import * as edgedb from 'edgedb';
import { Tweet, TwitterUser, ScrapingSession } from '../models/tweet.model';
import { scraperLogger } from '../utils/logger';

export class DatabaseService {
  private client: edgedb.Client;

  constructor() {
    // Configure connection based on environment
    const isDocker = process.env.EDGEDB_HOST;

    if (isDocker) {
      // Docker environment - connect to containerized EdgeDB
      this.client = edgedb.createClient({
        host: process.env.EDGEDB_HOST || 'edgedb',
        port: parseInt(process.env.EDGEDB_PORT || '5656'),
        database: process.env.EDGEDB_DATABASE || 'edgedb',
        concurrency: 5,
        tlsSecurity: 'insecure'
      });
    } else {
      // Local development - connect to instance
      this.client = edgedb.createClient({
        instanceName: 'twitter_scraper',
        concurrency: 5,
        tlsSecurity: 'insecure'
      });
    }
  }

  async connect(): Promise<void> {
    try {
      await this.client.ensureConnected();
      scraperLogger.info('Connected to EdgeDB successfully');
    } catch (error) {
      scraperLogger.error('Failed to connect to EdgeDB', error);
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    try {
      await this.client.close();
      scraperLogger.info('Disconnected from EdgeDB');
    } catch (error) {
      scraperLogger.error('Error disconnecting from EdgeDB', error);
    }
  }

  // Tweet operations
  async saveTweet(tweet: Tweet): Promise<boolean> {
    try {
      const query = `
        INSERT Tweet {
          tweetId := <str>$tweetId,
          text := <str>$text,
          authorUsername := <str>$authorUsername,
          authorDisplayName := <str>$authorDisplayName,
          authorProfileImageUrl := <optional str>$authorProfileImageUrl,
          authorVerified := <bool>$authorVerified,
          createdAt := <datetime>$createdAt,
          scrapedAt := <datetime>$scrapedAt,
          likeCount := <int32>$likeCount,
          retweetCount := <int32>$retweetCount,
          replyCount := <int32>$replyCount,
          quoteCount := <int32>$quoteCount,
          isRetweet := <bool>$isRetweet,
          isQuote := <bool>$isQuote,
          isReply := <bool>$isReply,
          mediaUrls := <array<str>>$mediaUrls,
          mediaTypes := <array<str>>$mediaTypes,
          hashtags := <array<str>>$hashtags,
          mentions := <array<str>>$mentions,
          urls := <array<str>>$urls,
          sourceTweetId := <optional str>$sourceTweetId,
          sourceTweetText := <optional str>$sourceTweetText,
          sourceAuthorUsername := <optional str>$sourceAuthorUsername
        }
        UNLESS CONFLICT ON .tweetId
        ELSE (
          UPDATE Tweet SET {
            likeCount := <int32>$likeCount,
            retweetCount := <int32>$retweetCount,
            replyCount := <int32>$replyCount,
            quoteCount := <int32>$quoteCount
          }
        )
      `;

      await this.client.query(query, {
        tweetId: tweet.tweetId,
        text: tweet.text,
        authorUsername: tweet.authorUsername,
        authorDisplayName: tweet.authorDisplayName,
        authorProfileImageUrl: tweet.authorProfileImageUrl || null,
        authorVerified: tweet.authorVerified,
        createdAt: tweet.createdAt,
        scrapedAt: tweet.scrapedAt,
        likeCount: tweet.likeCount,
        retweetCount: tweet.retweetCount,
        replyCount: tweet.replyCount,
        quoteCount: tweet.quoteCount,
        isRetweet: tweet.isRetweet,
        isQuote: tweet.isQuote,
        isReply: tweet.isReply,
        mediaUrls: tweet.mediaUrls,
        mediaTypes: tweet.mediaTypes,
        hashtags: tweet.hashtags,
        mentions: tweet.mentions,
        urls: tweet.urls,
        sourceTweetId: tweet.sourceTweetId || null,
        sourceTweetText: tweet.sourceTweetText || null,
        sourceAuthorUsername: tweet.sourceAuthorUsername || null
      });

      return true;
    } catch (error) {
      scraperLogger.error(`Failed to save tweet ${tweet.tweetId}`, error);
      return false;
    }
  }

  async getTweets(
    limit: number = 20,
    _offset: number = 0,
    username?: string,
    includeRetweets: boolean = true,
    includeReplies: boolean = true
  ): Promise<Tweet[]> {
    try {
      let query = `
        SELECT Tweet {
          tweetId,
          text,
          authorUsername,
          authorDisplayName,
          authorProfileImageUrl,
          authorVerified,
          createdAt,
          scrapedAt,
          likeCount,
          retweetCount,
          replyCount,
          quoteCount,
          isRetweet,
          isQuote,
          isReply,
          mediaUrls,
          mediaTypes,
          hashtags,
          mentions,
          urls,
          sourceTweetId,
          sourceTweetText,
          sourceAuthorUsername
        }
      `;

      const filters: string[] = [];
      const params: any = { limit };

      if (username) {
        filters.push('.authorUsername = <str>$username');
        params.username = username;
      }
      if (!includeRetweets) {
        filters.push('.isRetweet = false');
      }
      if (!includeReplies) {
        filters.push('.isReply = false');
      }

      if (filters.length > 0) {
        query += ` FILTER ${filters.join(' AND ')}`;
      }

      query += ` ORDER BY .createdAt DESC LIMIT <int64>$limit`;

      const result = await this.client.query(query, params);

      return result.map(this.mapTweetFromDb);
    } catch (error) {
      scraperLogger.error('Failed to get tweets', error);
      throw error;
    }
  }

  async getTweetById(tweetId: string): Promise<Tweet | null> {
    try {
      const query = `
        SELECT Tweet {
          tweetId,
          text,
          authorUsername,
          authorDisplayName,
          authorProfileImageUrl,
          authorVerified,
          createdAt,
          scrapedAt,
          likeCount,
          retweetCount,
          replyCount,
          quoteCount,
          isRetweet,
          isQuote,
          isReply,
          mediaUrls,
          mediaTypes,
          hashtags,
          mentions,
          urls,
          sourceTweetId,
          sourceTweetText,
          sourceAuthorUsername
        }
        FILTER .tweetId = <str>$tweetId
        LIMIT 1
      `;

      const result = await this.client.query(query, { tweetId });
      return result.length > 0 ? this.mapTweetFromDb(result[0]) : null;
    } catch (error) {
      scraperLogger.error(`Failed to get tweet ${tweetId}`, error);
      return null;
    }
  }

  async getTweetCount(username?: string): Promise<number> {
    try {
      let query = 'SELECT count(Tweet)';
      let params = {};

      if (username) {
        query += ' FILTER Tweet.authorUsername = <str>$username';
        params = { username };
      }

      const result = await this.client.querySingle(query, params);

      return result as number;
    } catch (error) {
      scraperLogger.error('Failed to get tweet count', error);
      return 0;
    }
  }

  async getLatestTweetId(username: string): Promise<string | null> {
    try {
      const query = `
        SELECT Tweet.tweetId
        FILTER .authorUsername = <str>$username
        ORDER BY .createdAt DESC
        LIMIT 1
      `;

      const result = await this.client.querySingle(query, { username });
      return result as string || null;
    } catch (error) {
      scraperLogger.error(`Failed to get latest tweet ID for ${username}`, error);
      return null;
    }
  }

  // User operations
  async saveUser(user: TwitterUser): Promise<boolean> {
    try {
      const query = `
        INSERT TwitterUser {
          userId := <str>$userId,
          username := <str>$username,
          displayName := <str>$displayName,
          description := <optional str>$description,
          profileImageUrl := <optional str>$profileImageUrl,
          verified := <bool>$verified,
          followersCount := <int32>$followersCount,
          followingCount := <int32>$followingCount,
          tweetCount := <int32>$tweetCount,
          createdAt := <datetime>$createdAt,
          scrapedAt := <datetime>$scrapedAt
        }
        UNLESS CONFLICT ON .username
        ELSE (
          UPDATE TwitterUser SET {
            displayName := <str>$displayName,
            description := <optional str>$description,
            profileImageUrl := <optional str>$profileImageUrl,
            verified := <bool>$verified,
            followersCount := <int32>$followersCount,
            followingCount := <int32>$followingCount,
            tweetCount := <int32>$tweetCount
          }
        )
      `;

      await this.client.query(query, {
        userId: user.userId,
        username: user.username,
        displayName: user.displayName,
        description: user.description || null,
        profileImageUrl: user.profileImageUrl || null,
        verified: user.verified,
        followersCount: user.followersCount,
        followingCount: user.followingCount,
        tweetCount: user.tweetCount,
        createdAt: user.createdAt,
        scrapedAt: user.scrapedAt
      });

      return true;
    } catch (error) {
      scraperLogger.error(`Failed to save user ${user.username}`, error);
      return false;
    }
  }

  async getUser(username: string): Promise<TwitterUser | null> {
    try {
      const query = `
        SELECT TwitterUser {
          userId,
          username,
          displayName,
          description,
          profileImageUrl,
          verified,
          followersCount,
          followingCount,
          tweetCount,
          createdAt,
          scrapedAt
        }
        FILTER .username = <str>$username
        LIMIT 1
      `;

      const result = await this.client.query(query, { username });
      return result.length > 0 ? this.mapUserFromDb(result[0]) : null;
    } catch (error) {
      scraperLogger.error(`Failed to get user ${username}`, error);
      return null;
    }
  }

  // Scraping session operations
  async createScrapingSession(sessionData: Omit<ScrapingSession, 'sessionId'>): Promise<string> {
    try {
      const query = `
        INSERT ScrapingSession {
          username := <str>$username,
          status := <ScrapingStatus>$status,
          startTime := <datetime>$startTime,
          tweetsScraped := <int32>$tweetsScraped,
          tweetsSaved := <int32>$tweetsSaved,
          consecutiveFailures := <int32>$consecutiveFailures
        }
      `;

      const result = await this.client.querySingle(query, {
        username: sessionData.targetUsername,
        status: sessionData.status || 'RUNNING',
        startTime: sessionData.startedAt || new Date(),
        tweetsScraped: sessionData.tweetsCollected || 0,
        tweetsSaved: sessionData.tweetsCollected || 0,
        consecutiveFailures: sessionData.errorsEncountered || 0
      });

      return result as string;
    } catch (error) {
      scraperLogger.error('Failed to create scraping session', error);
      throw error;
    }
  }

  async updateScrapingSession(sessionId: string, updates: Partial<ScrapingSession>): Promise<boolean> {
    try {
      const fields: string[] = [];
      const params: any = { sessionId: sessionId };

      if (updates.completedAt !== undefined) {
        fields.push('endTime := <optional datetime>$endTime');
        params.endTime = updates.completedAt;
      }
      if (updates.tweetsCollected !== undefined) {
        fields.push('tweetsScraped := <int32>$tweetsScraped');
        params.tweetsScraped = updates.tweetsCollected;
      }
      if (updates.status !== undefined) {
        fields.push('status := <ScrapingStatus>$status');
        params.status = updates.status;
      }
      if (updates.errorMessage !== undefined) {
        fields.push('lastError := <optional str>$lastError');
        params.lastError = updates.errorMessage;
      }
      if (updates.lastTweetIdProcessed !== undefined) {
        fields.push('lastScrapedTweetId := <optional str>$lastScrapedTweetId');
        params.lastScrapedTweetId = updates.lastTweetIdProcessed;
      }

      if (fields.length === 0) return true;

      const query = `
        UPDATE ScrapingSession
        FILTER .sessionId = <str>$sessionId
        SET { ${fields.join(', ')} }
      `;

      await this.client.query(query, params);
      return true;
    } catch (error) {
      scraperLogger.error(`Failed to update scraping session ${sessionId}`, error);
      return false;
    }
  }

  async getActiveScrapingSession(): Promise<ScrapingSession | null> {
    try {
      const query = `
        SELECT ScrapingSession {
          sessionId,
          startTime,
          endTime,
          username,
          status,
          tweetsScraped,
          tweetsSaved,
          consecutiveFailures,
          lastError,
          lastScrapedTweetId
        }
        FILTER .status = 'RUNNING'
        ORDER BY .startTime DESC
        LIMIT 1
      `;

      const result = await this.client.query(query);
      return result.length > 0 ? this.mapSessionFromDb(result[0]) : null;
    } catch (error) {
      scraperLogger.error('Failed to get active scraping session', error);
      return null;
    }
  }

  // Utility methods
  private mapTweetFromDb(dbTweet: any): Tweet {
    return {
      tweetId: dbTweet.tweetId,
      text: dbTweet.text,
      authorUsername: dbTweet.authorUsername,
      authorDisplayName: dbTweet.authorDisplayName,
      authorProfileImageUrl: dbTweet.authorProfileImageUrl,
      authorVerified: dbTweet.authorVerified,
      createdAt: new Date(dbTweet.createdAt),
      scrapedAt: new Date(dbTweet.scrapedAt),
      likeCount: dbTweet.likeCount,
      retweetCount: dbTweet.retweetCount,
      replyCount: dbTweet.replyCount,
      quoteCount: dbTweet.quoteCount,
      isRetweet: dbTweet.isRetweet,
      isQuote: dbTweet.isQuote,
      isReply: dbTweet.isReply,
      mediaUrls: dbTweet.mediaUrls || [],
      mediaTypes: dbTweet.mediaTypes || [],
      hashtags: dbTweet.hashtags || [],
      mentions: dbTweet.mentions || [],
      urls: dbTweet.urls || [],
      sourceTweetId: dbTweet.sourceTweetId,
      sourceTweetText: dbTweet.sourceTweetText,
      sourceAuthorUsername: dbTweet.sourceAuthorUsername
    };
  }

  private mapUserFromDb(dbUser: any): TwitterUser {
    return {
      userId: dbUser.userId,
      username: dbUser.username,
      displayName: dbUser.displayName,
      description: dbUser.description,
      profileImageUrl: dbUser.profileImageUrl,
      verified: dbUser.verified,
      followersCount: dbUser.followersCount,
      followingCount: dbUser.followingCount,
      tweetCount: dbUser.tweetCount,
      createdAt: new Date(dbUser.createdAt),
      scrapedAt: new Date(dbUser.scrapedAt)
    };
  }

  private mapSessionFromDb(dbSession: any): ScrapingSession {
    return {
      sessionId: dbSession.sessionId,
      startedAt: new Date(dbSession.startTime),
      completedAt: dbSession.endTime ? new Date(dbSession.endTime) : undefined,
      targetUsername: dbSession.username,
      sessionType: 'manual',
      tweetsCollected: dbSession.tweetsScraped || 0,
      errorsEncountered: dbSession.consecutiveFailures || 0,
      lastTweetIdProcessed: dbSession.lastScrapedTweetId,
      status: dbSession.status,
      errorMessage: dbSession.lastError
    };
  }
}