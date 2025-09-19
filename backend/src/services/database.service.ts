import * as edgedb from 'edgedb';
import { Tweet, TwitterUser, ScrapingSession } from '../models/tweet.model';
import { scraperLogger } from '../utils/logger';

export class DatabaseService {
  private client: edgedb.Client;

  constructor() {
    // For local development, connect directly to instance
    this.client = edgedb.createClient({
      instanceName: 'twitter_scraper',
      concurrency: 5,
      tlsSecurity: 'insecure' // Disable TLS verification for local development
    });
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
          tweet_id := <str>$tweet_id,
          text := <str>$text,
          author_username := <str>$author_username,
          author_display_name := <str>$author_display_name,
          author_profile_image_url := <optional str>$author_profile_image_url,
          author_verified := <bool>$author_verified,
          created_at := <datetime>$created_at,
          scraped_at := <datetime>$scraped_at,
          updated_at := <optional datetime>$updated_at,
          like_count := <int32>$like_count,
          retweet_count := <int32>$retweet_count,
          reply_count := <int32>$reply_count,
          quote_count := <int32>$quote_count,
          language := <optional str>$language,
          is_retweet := <bool>$is_retweet,
          is_quote := <bool>$is_quote,
          is_reply := <bool>$is_reply,
          conversation_id := <optional str>$conversation_id,
          in_reply_to_user_id := <optional str>$in_reply_to_user_id,
          in_reply_to_tweet_id := <optional str>$in_reply_to_tweet_id,
          media_urls := <array<str>>$media_urls,
          media_types := <array<str>>$media_types,
          hashtags := <array<str>>$hashtags,
          mentions := <array<str>>$mentions,
          urls := <array<str>>$urls,
          source_tweet_id := <optional str>$source_tweet_id,
          source_tweet_text := <optional str>$source_tweet_text,
          source_author_username := <optional str>$source_author_username,
          raw_data := <optional json>$raw_data
        }
        UNLESS CONFLICT ON .tweet_id
        ELSE (
          UPDATE Tweet SET {
            like_count := <int32>$like_count,
            retweet_count := <int32>$retweet_count,
            reply_count := <int32>$reply_count,
            quote_count := <int32>$quote_count,
            updated_at := <datetime>datetime_current()
          }
        )
      `;

      await this.client.query(query, {
        tweet_id: tweet.tweetId,
        text: tweet.text,
        author_username: tweet.authorUsername,
        author_display_name: tweet.authorDisplayName,
        author_profile_image_url: tweet.authorProfileImageUrl || null,
        author_verified: tweet.authorVerified,
        created_at: tweet.createdAt,
        scraped_at: tweet.scrapedAt,
        updated_at: tweet.updatedAt || null,
        like_count: tweet.likeCount,
        retweet_count: tweet.retweetCount,
        reply_count: tweet.replyCount,
        quote_count: tweet.quoteCount,
        language: tweet.language || null,
        is_retweet: tweet.isRetweet,
        is_quote: tweet.isQuote,
        is_reply: tweet.isReply,
        conversation_id: tweet.conversationId || null,
        in_reply_to_user_id: tweet.inReplyToUserId || null,
        in_reply_to_tweet_id: tweet.inReplyToTweetId || null,
        media_urls: tweet.mediaUrls,
        media_types: tweet.mediaTypes,
        hashtags: tweet.hashtags,
        mentions: tweet.mentions,
        urls: tweet.urls,
        source_tweet_id: tweet.sourceTweetId || null,
        source_tweet_text: tweet.sourceTweetText || null,
        source_author_username: tweet.sourceAuthorUsername || null,
        raw_data: tweet.rawData || null
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
          tweet_id,
          text,
          author_username,
          author_display_name,
          author_profile_image_url,
          author_verified,
          created_at,
          scraped_at,
          updated_at,
          like_count,
          retweet_count,
          reply_count,
          quote_count,
          language,
          is_retweet,
          is_quote,
          is_reply,
          conversation_id,
          in_reply_to_user_id,
          in_reply_to_tweet_id,
          media_urls,
          media_types,
          hashtags,
          mentions,
          urls,
          source_tweet_id,
          source_tweet_text,
          source_author_username,
          raw_data
        }
        FILTER .tweet_id = <str>$tweet_id
        LIMIT 1
      `;

      const result = await this.client.query(query, { tweet_id: tweetId });
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
          user_id := <str>$user_id,
          username := <str>$username,
          display_name := <str>$display_name,
          description := <optional str>$description,
          profile_image_url := <optional str>$profile_image_url,
          banner_image_url := <optional str>$banner_image_url,
          verified := <bool>$verified,
          followers_count := <int32>$followers_count,
          following_count := <int32>$following_count,
          tweet_count := <int32>$tweet_count,
          created_at := <datetime>$created_at,
          scraped_at := <datetime>$scraped_at,
          location := <optional str>$location,
          website := <optional str>$website,
          raw_data := <optional json>$raw_data
        }
        UNLESS CONFLICT ON .username
        ELSE (
          UPDATE TwitterUser SET {
            display_name := <str>$display_name,
            description := <optional str>$description,
            profile_image_url := <optional str>$profile_image_url,
            banner_image_url := <optional str>$banner_image_url,
            verified := <bool>$verified,
            followers_count := <int32>$followers_count,
            following_count := <int32>$following_count,
            tweet_count := <int32>$tweet_count,
            updated_at := <datetime>datetime_current(),
            location := <optional str>$location,
            website := <optional str>$website,
            raw_data := <optional json>$raw_data
          }
        )
      `;

      await this.client.query(query, {
        user_id: user.userId,
        username: user.username,
        display_name: user.displayName,
        description: user.description || null,
        profile_image_url: user.profileImageUrl || null,
        banner_image_url: user.bannerImageUrl || null,
        verified: user.verified,
        followers_count: user.followersCount,
        following_count: user.followingCount,
        tweet_count: user.tweetCount,
        created_at: user.createdAt,
        scraped_at: user.scrapedAt,
        location: user.location || null,
        website: user.website || null,
        raw_data: user.rawData || null
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
          target_username := <str>$target_username,
          session_type := <str>$session_type
        }
      `;

      const result = await this.client.querySingle(query, {
        target_username: sessionData.targetUsername,
        session_type: sessionData.sessionType
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
      const params: any = { session_id: sessionId };

      if (updates.completedAt !== undefined) {
        fields.push('completed_at := <optional datetime>$completed_at');
        params.completed_at = updates.completedAt;
      }
      if (updates.tweetsCollected !== undefined) {
        fields.push('tweets_collected := <int32>$tweets_collected');
        params.tweets_collected = updates.tweetsCollected;
      }
      if (updates.status !== undefined) {
        fields.push('status := <str>$status');
        params.status = updates.status;
      }
      if (updates.errorMessage !== undefined) {
        fields.push('error_message := <optional str>$error_message');
        params.error_message = updates.errorMessage;
      }
      if (updates.lastTweetIdProcessed !== undefined) {
        fields.push('last_tweet_id_processed := <optional str>$last_tweet_id_processed');
        params.last_tweet_id_processed = updates.lastTweetIdProcessed;
      }

      if (fields.length === 0) return true;

      const query = `
        UPDATE ScrapingSession
        FILTER .session_id = <uuid>$session_id
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
          session_id,
          started_at,
          completed_at,
          target_username,
          session_type,
          tweets_collected,
          errors_encountered,
          last_tweet_id_processed,
          status,
          error_message
        }
        FILTER .status = 'running'
        ORDER BY .started_at DESC
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
      sessionId: dbSession.session_id,
      startedAt: new Date(dbSession.started_at),
      completedAt: dbSession.completed_at ? new Date(dbSession.completed_at) : undefined,
      targetUsername: dbSession.target_username,
      sessionType: dbSession.session_type,
      tweetsCollected: dbSession.tweets_collected,
      errorsEncountered: dbSession.errors_encountered,
      lastTweetIdProcessed: dbSession.last_tweet_id_processed,
      status: dbSession.status,
      errorMessage: dbSession.error_message
    };
  }
}