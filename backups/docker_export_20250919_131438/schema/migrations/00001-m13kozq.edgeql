CREATE MIGRATION m13kozqgyniirhfe4qpfadiww7rondfl2sqjfudae6kizpiaghli2q
    ONTO initial
{
  CREATE SCALAR TYPE default::ScrapingStatus EXTENDING enum<RUNNING, STOPPED, ERROR, COMPLETED>;
  CREATE FUTURE simple_scoping;
  CREATE TYPE default::Album {
      CREATE PROPERTY cover_art_url: std::str;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY duration_seconds: std::int32;
      CREATE PROPERTY genre: std::str;
      CREATE PROPERTY release_date: std::cal::local_date;
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE PROPERTY track_count: std::int32;
      CREATE PROPERTY updated_at: std::datetime {
          SET default := (std::datetime_current());
      };
  };
  CREATE TYPE default::SocialLinks {
      CREATE PROPERTY bandcamp: std::str;
      CREATE PROPERTY carrd: std::str;
      CREATE PROPERTY instagram: std::str;
      CREATE PROPERTY linktr: std::str;
      CREATE PROPERTY reelcrafter: std::str;
      CREATE PROPERTY twitch: std::str;
      CREATE PROPERTY twitter: std::str;
      CREATE PROPERTY website: std::str;
      CREATE PROPERTY youtube: std::str;
  };
  CREATE TYPE default::Artist {
      CREATE LINK social_links: default::SocialLinks;
      CREATE PROPERTY avatar: std::str;
      CREATE PROPERTY bio: std::str;
      CREATE PROPERTY color: std::str;
      CREATE PROPERTY country: std::str;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY display_name: std::str;
      CREATE PROPERTY genre: std::str;
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY updated_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY website: std::str;
  };
  ALTER TYPE default::Album {
      CREATE REQUIRED LINK artist: default::Artist;
  };
  ALTER TYPE default::Artist {
      CREATE MULTI LINK albums := (.<artist[IS default::Album]);
  };
  CREATE TYPE default::Song {
      CREATE LINK album: default::Album;
      CREATE MULTI LINK collaborators: default::Artist;
      CREATE MULTI LINK featured_artists: default::Artist;
      CREATE REQUIRED LINK main_artist: default::Artist;
      CREATE MULTI LINK additional_artists: default::Artist;
      CREATE PROPERTY audio_file_path: std::str;
      CREATE PROPERTY audio_file_url: std::str;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY duration_seconds: std::int32;
      CREATE PROPERTY end_time_seconds: std::int32;
      CREATE PROPERTY genre: std::str;
      CREATE PROPERTY lyrics: std::str;
      CREATE PROPERTY start_time_seconds: std::int32;
      CREATE REQUIRED PROPERTY title: std::str;
      CREATE PROPERTY track_number: std::int32;
      CREATE PROPERTY updated_at: std::datetime {
          SET default := (std::datetime_current());
      };
  };
  ALTER TYPE default::Album {
      CREATE MULTI LINK songs := (.<album[IS default::Song]);
  };
  CREATE TYPE default::Collection {
      CREATE MULTI LINK albums: default::Album;
      CREATE MULTI LINK songs: default::Song;
      CREATE PROPERTY cover_image_url: std::str;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY is_public: std::bool {
          SET default := true;
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY updated_at: std::datetime {
          SET default := (std::datetime_current());
      };
  };
  ALTER TYPE default::Artist {
      CREATE MULTI LINK collaborated_songs := (.<collaborators[IS default::Song]);
      CREATE MULTI LINK featured_songs := (.<featured_artists[IS default::Song]);
      CREATE MULTI LINK songs := (.<main_artist[IS default::Song]);
  };
  CREATE TYPE default::Prism {
      CREATE MULTI LINK featured_artists: default::Artist;
      CREATE MULTI LINK collections: default::Collection;
      CREATE PROPERTY color_scheme: std::str;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY description: std::str;
      CREATE PROPERTY is_featured: std::bool {
          SET default := false;
      };
      CREATE REQUIRED PROPERTY name: std::str {
          CREATE CONSTRAINT std::exclusive;
      };
      CREATE PROPERTY theme: std::str;
      CREATE PROPERTY updated_at: std::datetime {
          SET default := (std::datetime_current());
      };
  };
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
      CREATE PROPERTY authorProfileImageLocalPath: std::str;
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
      CREATE PROPERTY profileImageLocalPath: std::str;
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
