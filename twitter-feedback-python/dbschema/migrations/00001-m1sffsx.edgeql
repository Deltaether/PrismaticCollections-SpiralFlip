CREATE MIGRATION m1sffsx2zeey33mxwx3uihtwhqsosxw4dh3bao4xcmeeponfeaa2da
    ONTO initial
{
  CREATE TYPE default::ApiRateLimit {
      CREATE REQUIRED PROPERTY endpoint: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY last_updated: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY requests_limit: std::int32;
      CREATE PROPERTY requests_remaining: std::int32;
      CREATE PROPERTY reset_time: std::datetime;
  };
  CREATE TYPE default::FetchLog {
      CREATE PROPERTY api_calls_used: std::int32;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY error_message: std::str;
      CREATE REQUIRED PROPERTY operation: std::str;
      CREATE PROPERTY records_fetched: std::int32;
      CREATE PROPERTY success: std::bool;
      CREATE PROPERTY target: std::str;
  };
  CREATE TYPE default::Tweet {
      CREATE PROPERTY bookmark_count: std::int32;
      CREATE PROPERTY created_at: std::datetime;
      CREATE PROPERTY fetched_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY impression_count: std::int32;
      CREATE PROPERTY in_reply_to_user_id: std::str;
      CREATE PROPERTY is_quote_tweet: std::bool {
          SET default := false;
      };
      CREATE PROPERTY is_reply: std::bool {
          SET default := false;
      };
      CREATE PROPERTY is_retweet: std::bool {
          SET default := false;
      };
      CREATE PROPERTY lang: std::str;
      CREATE PROPERTY last_updated: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY like_count: std::int32;
      CREATE PROPERTY possibly_sensitive: std::bool;
      CREATE PROPERTY quote_count: std::int32;
      CREATE PROPERTY referenced_tweet_id: std::str;
      CREATE PROPERTY referenced_tweet_type: std::str;
      CREATE PROPERTY reply_count: std::int32;
      CREATE PROPERTY reply_settings: std::str;
      CREATE PROPERTY retweet_count: std::int32;
      CREATE PROPERTY source: std::str;
      CREATE REQUIRED PROPERTY text: std::str;
      CREATE REQUIRED PROPERTY tweet_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
  };
  CREATE TYPE default::TwitterUser {
      CREATE PROPERTY banner_url: std::str;
      CREATE PROPERTY created_at: std::datetime;
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY display_name: std::str;
      CREATE PROPERTY fetched_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY followers_count: std::int32;
      CREATE PROPERTY following_count: std::int32;
      CREATE PROPERTY last_updated: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY listed_count: std::int32;
      CREATE PROPERTY location: std::str;
      CREATE PROPERTY profile_image_url: std::str;
      CREATE PROPERTY tweet_count: std::int32;
      CREATE REQUIRED PROPERTY user_id: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE REQUIRED PROPERTY username: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY verified: std::bool;
      CREATE PROPERTY verified_type: std::str;
      CREATE PROPERTY website: std::str;
  };
  ALTER TYPE default::Tweet {
      CREATE REQUIRED LINK author: default::TwitterUser;
  };
  ALTER TYPE default::TwitterUser {
      CREATE MULTI LINK tweets := (.<author[IS default::Tweet]);
  };
  CREATE TYPE default::TweetHashtag {
      CREATE REQUIRED LINK tweet: default::Tweet;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE REQUIRED PROPERTY tag: std::str;
  };
  ALTER TYPE default::Tweet {
      CREATE MULTI LINK hashtags := (.<tweet[IS default::TweetHashtag]);
  };
  CREATE TYPE default::TweetMedia {
      CREATE REQUIRED LINK tweet: default::Tweet;
      CREATE PROPERTY alt_text: std::str;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY duration_ms: std::int32;
      CREATE PROPERTY height: std::int32;
      CREATE REQUIRED PROPERTY media_key: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY media_type: std::str;
      CREATE PROPERTY preview_image_url: std::str;
      CREATE PROPERTY url: std::str;
      CREATE PROPERTY width: std::int32;
  };
  ALTER TYPE default::Tweet {
      CREATE MULTI LINK media := (.<tweet[IS default::TweetMedia]);
  };
  CREATE TYPE default::TweetMention {
      CREATE REQUIRED LINK tweet: default::Tweet;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY user_id: std::str;
      CREATE REQUIRED PROPERTY username: std::str;
  };
  ALTER TYPE default::Tweet {
      CREATE MULTI LINK mentions := (.<tweet[IS default::TweetMention]);
  };
  CREATE TYPE default::TweetUrl {
      CREATE REQUIRED LINK tweet: default::Tweet;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY display_url: std::str;
      CREATE PROPERTY expanded_url: std::str;
      CREATE PROPERTY title: std::str;
      CREATE PROPERTY unwound_url: std::str;
      CREATE REQUIRED PROPERTY url: std::str;
  };
  ALTER TYPE default::Tweet {
      CREATE MULTI LINK urls := (.<tweet[IS default::TweetUrl]);
  };
};
