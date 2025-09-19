module default {
    # Twitter User Type
    type TwitterUser {
        required username: str {
            constraint exclusive;
        };
        required user_id: str {
            constraint exclusive;
        };
        display_name: str;
        description: str;
        profile_image_url: str;
        banner_url: str;
        location: str;
        website: str;
        verified: bool;
        verified_type: str;
        followers_count: int32;
        following_count: int32;
        tweet_count: int32;
        listed_count: int32;
        created_at: datetime;

        # Relationship to tweets
        multi link tweets := .<author[is Tweet];

        # Metadata
        fetched_at: datetime {
            default := datetime_current();
        };
        last_updated: datetime {
            default := datetime_current();
        };
    }

    # Tweet Type
    type Tweet {
        required tweet_id: str {
            constraint exclusive;
        };
        required text: str;
        required author: TwitterUser;

        # Tweet metrics
        retweet_count: int32;
        reply_count: int32;
        like_count: int32;
        quote_count: int32;
        bookmark_count: int32;
        impression_count: int32;

        # Tweet metadata
        created_at: datetime;
        lang: str;
        source: str;
        reply_settings: str;
        possibly_sensitive: bool;

        # Tweet type indicators
        is_reply: bool {
            default := false;
        };
        is_retweet: bool {
            default := false;
        };
        is_quote_tweet: bool {
            default := false;
        };

        # Referenced tweets (replies, retweets, quotes)
        in_reply_to_user_id: str;
        referenced_tweet_id: str;
        referenced_tweet_type: str;

        # Media attachments
        multi link media := .<tweet[is TweetMedia];

        # URLs and entities
        multi link urls := .<tweet[is TweetUrl];
        multi link hashtags := .<tweet[is TweetHashtag];
        multi link mentions := .<tweet[is TweetMention];

        # Metadata
        fetched_at: datetime {
            default := datetime_current();
        };
        last_updated: datetime {
            default := datetime_current();
        };
    }

    # Tweet Media Type
    type TweetMedia {
        required media_key: str {
            constraint exclusive;
        };
        required tweet: Tweet;
        media_type: str;  # photo, video, animated_gif
        url: str;
        preview_image_url: str;
        width: int32;
        height: int32;
        duration_ms: int32;  # For videos
        alt_text: str;

        # Metadata
        created_at: datetime {
            default := datetime_current();
        };
    }

    # Tweet URL Type
    type TweetUrl {
        required tweet: Tweet;
        required url: str;
        expanded_url: str;
        display_url: str;
        unwound_url: str;
        title: str;
        description: str;

        # Metadata
        created_at: datetime {
            default := datetime_current();
        };
    }

    # Tweet Hashtag Type
    type TweetHashtag {
        required tweet: Tweet;
        required tag: str;

        # Metadata
        created_at: datetime {
            default := datetime_current();
        };
    }

    # Tweet Mention Type
    type TweetMention {
        required tweet: Tweet;
        required username: str;
        user_id: str;

        # Metadata
        created_at: datetime {
            default := datetime_current();
        };
    }

    # API Rate Limit Tracking
    type ApiRateLimit {
        required endpoint: str {
            constraint exclusive;
        };
        requests_remaining: int32;
        requests_limit: int32;
        reset_time: datetime;
        last_updated: datetime {
            default := datetime_current();
        };
    }

    # Data Fetch Log
    type FetchLog {
        required operation: str;  # 'user_lookup', 'user_tweets', etc.
        target: str;  # username or user_id
        success: bool;
        error_message: str;
        records_fetched: int32;
        api_calls_used: int32;

        # Metadata
        created_at: datetime {
            default := datetime_current();
        };
    }
}