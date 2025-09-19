import { Router, Request, Response } from 'express';
import { DatabaseService } from '../services/database.service';
import { MockDatabaseService } from '../services/mock-database.service';
import { scraperLogger } from '../utils/logger';
import path from 'path';
import fs from 'fs';

export class TwitterRoutes {
  private router: Router;
  private database: DatabaseService | MockDatabaseService;

  constructor(database: DatabaseService | MockDatabaseService) {
    this.router = Router();
    this.database = database;
    this.setupRoutes();
  }

  private setupRoutes(): void {
    // Get tweets with pagination and filtering
    this.router.get('/tweets', this.getTweets.bind(this));

    // Get specific tweet by ID
    this.router.get('/tweets/:id', this.getTweetById.bind(this));

    // Get user profile
    this.router.get('/user/:username', this.getUser.bind(this));

    // Get system status (Python fetcher information)
    this.router.get('/scraper/status', this.getSystemStatus.bind(this));

    // Get statistics
    this.router.get('/scraper/stats', this.getStats.bind(this));

    // Get profile image for specific user
    this.router.get('/profile-image/:username', this.getProfileImage.bind(this));

    // Check if profile image exists
    this.router.head('/profile-image/:username', this.checkProfileImage.bind(this));
  }

  private async getTweets(req: Request, res: Response): Promise<void> {
    try {
      const {
        page = '0',
        limit = '20',
        username,
        includeRetweets = 'true',
        includeReplies = 'true'
      } = req.query;

      const pageNum = Math.max(0, parseInt(page as string));
      const limitNum = Math.min(50, Math.max(1, parseInt(limit as string)));
      const offset = pageNum * limitNum;

      const tweets = await this.database.getTweets(
        limitNum,
        offset,
        username as string,
        includeRetweets === 'true',
        includeReplies === 'true'
      );

      const totalCount = await this.database.getTweetCount(username as string);

      res.json({
        data: tweets,
        meta: {
          resultCount: tweets.length,
          totalCount,
          page: pageNum,
          limit: limitNum,
          hasMore: offset + tweets.length < totalCount
        }
      });

      scraperLogger.apiRequest(req.method, req.path, res.statusCode);
    } catch (error) {
      scraperLogger.error('Error getting tweets', error);
      res.status(500).json({ error: 'Failed to retrieve tweets' });
    }
  }

  private async getTweetById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const tweet = await this.database.getTweetById(id);

      if (!tweet) {
        res.status(404).json({ error: 'Tweet not found' });
        return;
      }

      res.json({ data: tweet });
      scraperLogger.apiRequest(req.method, req.path, res.statusCode);
    } catch (error) {
      scraperLogger.error(`Error getting tweet ${req.params.id}`, error);
      res.status(500).json({ error: 'Failed to retrieve tweet' });
    }
  }

  private async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;
      const user = await this.database.getUser(username);

      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      res.json({ data: user });
      scraperLogger.apiRequest(req.method, req.path, res.statusCode);
    } catch (error) {
      scraperLogger.error(`Error getting user ${req.params.username}`, error);
      res.status(500).json({ error: 'Failed to retrieve user' });
    }
  }

  private async getSystemStatus(req: Request, res: Response): Promise<void> {
    try {
      const totalTweets = await this.database.getTweetCount();

      const status = {
        isRunning: false, // Python fetcher runs independently
        lastScrapedAt: new Date(), // Would need to track from Python fetcher logs
        totalTweetsStored: totalTweets,
        consecutiveFailures: 0,
        source: 'Python API v2 Fetcher' // Indicates new system
      };

      res.json(status);
      scraperLogger.apiRequest(req.method, req.path, res.statusCode);
    } catch (error) {
      scraperLogger.error('Error getting system status', error);
      res.status(500).json({ error: 'Failed to get system status' });
    }
  }



  private async getStats(req: Request, res: Response): Promise<void> {
    try {
      const totalTweets = await this.database.getTweetCount();
      const userTweets = await this.database.getTweetCount('prismcollect_');

      const stats = {
        totalTweets,
        userTweets,
        lastUpdated: new Date().toISOString()
      };

      res.json(stats);
      scraperLogger.apiRequest(req.method, req.path, res.statusCode);
    } catch (error) {
      scraperLogger.error('Error getting stats', error);
      res.status(500).json({ error: 'Failed to get statistics' });
    }
  }


  private async getProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;
      // Updated path to use assets directory instead of old scraper directory
      const profilePicsPath = path.join(__dirname, '../../../../src/assets/images/profile-pics');

      // Check for various image formats
      const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
      let imagePath: string | null = null;

      for (const ext of possibleExtensions) {
        const testPath = path.join(profilePicsPath, `${username}${ext}`);
        if (fs.existsSync(testPath)) {
          imagePath = testPath;
          break;
        }
      }

      if (!imagePath) {
        // Return default avatar instead of 404
        const defaultAvatarPath = path.join(__dirname, '../../../../src/assets/images/default-avatar.svg');
        if (fs.existsSync(defaultAvatarPath)) {
          res.setHeader('Content-Type', 'image/svg+xml');
          res.setHeader('Cache-Control', 'public, max-age=86400');
          res.sendFile(defaultAvatarPath);
        } else {
          res.status(404).json({
            error: 'Profile image not found',
            username,
            availableFormats: possibleExtensions
          });
        }
        return;
      }

      // Set appropriate content type based on file extension
      const ext = path.extname(imagePath).toLowerCase();
      const contentTypeMap: { [key: string]: string } = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml'
      };

      const contentType = contentTypeMap[ext] || 'image/jpeg';

      res.setHeader('Content-Type', contentType);
      res.setHeader('Cache-Control', 'public, max-age=86400'); // Cache for 1 day
      res.setHeader('ETag', `"${username}-${fs.statSync(imagePath).mtime.getTime()}"`);

      res.sendFile(imagePath);
      scraperLogger.apiRequest(req.method, req.path, res.statusCode);
    } catch (error) {
      scraperLogger.error(`Error getting profile image for ${req.params.username}`, error);
      res.status(500).json({ error: 'Failed to retrieve profile image' });
    }
  }

  private async checkProfileImage(req: Request, res: Response): Promise<void> {
    try {
      const { username } = req.params;
      // Updated path to use assets directory instead of old scraper directory
      const profilePicsPath = path.join(__dirname, '../../../../src/assets/images/profile-pics');

      const possibleExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg'];
      let imageExists = false;

      for (const ext of possibleExtensions) {
        const testPath = path.join(profilePicsPath, `${username}${ext}`);
        if (fs.existsSync(testPath)) {
          imageExists = true;
          break;
        }
      }

      // Also check if default avatar exists
      if (!imageExists) {
        const defaultAvatarPath = path.join(__dirname, '../../../../src/assets/images/default-avatar.svg');
        imageExists = fs.existsSync(defaultAvatarPath);
      }

      if (imageExists) {
        res.status(200).end();
      } else {
        res.status(404).end();
      }

      scraperLogger.apiRequest(req.method, req.path, res.statusCode);
    } catch (error) {
      scraperLogger.error(`Error checking profile image for ${req.params.username}`, error);
      res.status(500).end();
    }
  }

  getRouter(): Router {
    return this.router;
  }
}