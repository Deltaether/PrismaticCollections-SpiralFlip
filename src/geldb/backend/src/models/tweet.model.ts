export interface Tweet {
  tweetId: string;
  text: string;
  authorUsername: string;
  authorDisplayName: string;
  authorProfileImageUrl?: string;
  authorVerified: boolean;
  createdAt: Date;
  scrapedAt: Date;
  updatedAt?: Date;

  // Engagement metrics
  likeCount: number;
  retweetCount: number;
  replyCount: number;
  quoteCount: number;

  // Tweet metadata
  language?: string;
  isRetweet: boolean;
  isQuote: boolean;
  isReply: boolean;
  conversationId?: string;
  inReplyToUserId?: string;
  inReplyToTweetId?: string;

  // Media and content
  mediaUrls: string[];
  mediaTypes: string[];
  hashtags: string[];
  mentions: string[];
  urls: string[];

  // Source tweet for retweets/quotes
  sourceTweetId?: string;
  sourceTweetText?: string;
  sourceAuthorUsername?: string;

  // Raw data for debugging
  rawData?: any;
}

export interface TwitterUser {
  userId: string;
  username: string;
  displayName: string;
  description?: string;
  profileImageUrl?: string;
  profileImagePath?: string; // Local filesystem path for cached profile images
  bannerImageUrl?: string;
  verified: boolean;
  followersCount: number;
  followingCount: number;
  tweetCount: number;
  createdAt: Date;
  scrapedAt: Date;
  updatedAt?: Date;
  location?: string;
  website?: string;
  rawData?: any;
}

export interface ScrapingSession {
  sessionId: string;
  startedAt: Date;
  completedAt?: Date;
  targetUsername: string;
  sessionType: 'scheduled' | 'manual' | 'initial';
  tweetsCollected: number;
  errorsEncountered?: any;
  lastTweetIdProcessed?: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  errorMessage?: string;
}

export interface ScrapingStats {
  date: string; // YYYY-MM-DD format
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  tweetsScraped: number;
  rateLimitedCount: number;
  blockedCount: number;
  averageDelayMs?: number;
  sessionDurationSeconds?: number;
  createdAt: Date;
  updatedAt?: Date;
}

export interface ScraperConfig {
  key: string;
  value: string;
  description?: string;
  createdAt: Date;
  updatedAt?: Date;
}

// API Response types
export interface TweetResponse {
  data: Tweet[];
  meta: {
    resultCount: number;
    nextToken?: string;
    previousToken?: string;
  };
}

export interface ScraperStatus {
  isRunning: boolean;
  lastScrapedAt?: Date;
  nextScheduledRun?: Date;
  totalTweetsStored: number;
  lastError?: string;
  consecutiveFailures: number;
  currentSession?: ScrapingSession;
}

// Scraping configuration
export interface ScrapingOptions {
  maxTweets?: number;
  includeRetweets?: boolean;
  includeReplies?: boolean;
  startFromTweetId?: string;
  delayMin?: number;
  delayMax?: number;
  timeout?: number;
}

// Raw scraped data from browser
export interface RawTweetData {
  id: string;
  text: string;
  authorName: string;
  authorHandle: string;
  authorImage?: string;
  authorVerified: boolean;
  timestamp: string;
  engagement: {
    likes: number;
    retweets: number;
    replies: number;
    quotes: number;
  };
  media?: Array<{
    type: 'image' | 'video' | 'gif';
    url: string;
    alt?: string;
  }>;
  hashtags: string[];
  mentions: string[];
  links: string[];
  isRetweet: boolean;
  isQuote: boolean;
  isReply: boolean;
  originalTweet?: RawTweetData;
}