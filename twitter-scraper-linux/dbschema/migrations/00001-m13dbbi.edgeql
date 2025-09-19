CREATE MIGRATION m13dbbi3jnzfm5s3qo4a7e43bcd4ocg2nf6dycxwsgopbcgnl7hqna
    ONTO initial
{
  CREATE SCALAR TYPE default::ScrapingStatus EXTENDING enum<RUNNING, STOPPED, ERROR, COMPLETED>;
  CREATE TYPE default::ScrapingSession {
      CREATE REQUIRED PROPERTY startTime: std::datetime;
      CREATE INDEX ON (.startTime);
      CREATE REQUIRED PROPERTY username: std::str;
      CREATE INDEX ON (.username);
      CREATE REQUIRED PROPERTY consecutiveFailures: std::int32 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE PROPERTY endTime: std::datetime;
      CREATE PROPERTY lastError: std::str;
      CREATE PROPERTY lastScrapedTweetId: std::str;
      CREATE REQUIRED PROPERTY sessionId: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY status: default::ScrapingStatus;
      CREATE REQUIRED PROPERTY tweetsSaved: std::int32 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY tweetsScraped: std::int32 {
          SET default := 0;
          CREATE CONSTRAINT std::min_value(0);
      };
  };
  CREATE TYPE default::Tweet {
      CREATE REQUIRED PROPERTY createdAt: std::datetime;
      CREATE INDEX ON (.createdAt);
      CREATE REQUIRED PROPERTY authorUsername: std::str;
      CREATE INDEX ON (.authorUsername);
      CREATE REQUIRED PROPERTY scrapedAt: std::datetime;
      CREATE INDEX ON (.scrapedAt);
      CREATE REQUIRED PROPERTY authorDisplayName: std::str;
      CREATE PROPERTY authorProfileImageUrl: std::str;
      CREATE REQUIRED PROPERTY authorVerified: std::bool;
      CREATE MULTI PROPERTY hashtags: std::str;
      CREATE REQUIRED PROPERTY isQuote: std::bool;
      CREATE REQUIRED PROPERTY isReply: std::bool;
      CREATE REQUIRED PROPERTY isRetweet: std::bool;
      CREATE REQUIRED PROPERTY likeCount: std::int32 {
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE MULTI PROPERTY mediaTypes: std::str;
      CREATE MULTI PROPERTY mediaUrls: std::str;
      CREATE MULTI PROPERTY mentions: std::str;
      CREATE REQUIRED PROPERTY quoteCount: std::int32 {
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY replyCount: std::int32 {
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY retweetCount: std::int32 {
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE PROPERTY sourceAuthorUsername: std::str;
      CREATE PROPERTY sourceTweetId: std::str;
      CREATE PROPERTY sourceTweetText: std::str;
      CREATE REQUIRED PROPERTY text: std::str;
      CREATE REQUIRED PROPERTY tweetId: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE MULTI PROPERTY urls: std::str;
  };
  CREATE TYPE default::TwitterUser {
      CREATE REQUIRED PROPERTY username: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE INDEX ON (.username);
      CREATE REQUIRED PROPERTY createdAt: std::datetime;
      CREATE PROPERTY description: std::str;
      CREATE REQUIRED PROPERTY displayName: std::str;
      CREATE REQUIRED PROPERTY followersCount: std::int32 {
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY followingCount: std::int32 {
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE PROPERTY profileImageUrl: std::str;
      CREATE REQUIRED PROPERTY scrapedAt: std::datetime;
      CREATE REQUIRED PROPERTY tweetCount: std::int32 {
          CREATE CONSTRAINT std::min_value(0);
      };
      CREATE REQUIRED PROPERTY userId: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY verified: std::bool;
  };
};
