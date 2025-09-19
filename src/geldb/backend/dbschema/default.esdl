module default {
    # Tweet object representing a single tweet from X/Twitter
    type Tweet {
        required property tweet_id -> str {
            constraint exclusive;
        };
        required property text -> str;
        required property author_username -> str;
        required property author_display_name -> str;
        property author_profile_image_url -> str;
        required property author_verified -> bool;
        required property created_at -> datetime;
        required property scraped_at -> datetime;
        property updated_at -> datetime;

        # Engagement metrics
        required property like_count -> int32 {
            constraint min_value(0);
        };
        required property retweet_count -> int32 {
            constraint min_value(0);
        };
        required property reply_count -> int32 {
            constraint min_value(0);
        };
        required property quote_count -> int32 {
            constraint min_value(0);
        };

        # Tweet metadata
        property language -> str;
        required property is_retweet -> bool;
        required property is_quote -> bool;
        required property is_reply -> bool;
        property conversation_id -> str;
        property in_reply_to_user_id -> str;
        property in_reply_to_tweet_id -> str;

        # Media and content
        multi property media_urls -> str;
        multi property media_types -> str;
        multi property hashtags -> str;
        multi property mentions -> str;
        multi property urls -> str;

        # Source tweet for retweets/quotes
        property source_tweet_id -> str;
        property source_tweet_text -> str;
        property source_author_username -> str;

        # Additional metadata
        property raw_data -> json;
    }

    # Twitter user profile information
    type TwitterUser {
        required property user_id -> str {
            constraint exclusive;
        };
        required property username -> str {
            constraint exclusive;
        };
        required property display_name -> str;
        property description -> str;
        property profile_image_url -> str;
        property banner_image_url -> str;
        required property verified -> bool;
        required property followers_count -> int32 {
            constraint min_value(0);
        };
        required property following_count -> int32 {
            constraint min_value(0);
        };
        required property tweet_count -> int32 {
            constraint min_value(0);
        };
        required property created_at -> datetime;
        required property scraped_at -> datetime;
        property updated_at -> datetime;
        property location -> str;
        property website -> str;
        property raw_data -> json;
    }

    # Scraping session tracking
    type ScrapingSession {
        required property session_id -> uuid {
            constraint exclusive;
            default := uuid_generate_v4();
        };
        required property started_at -> datetime {
            default := datetime_current();
        };
        property completed_at -> datetime;
        required property target_username -> str;
        required property session_type -> str; # 'scheduled', 'manual', 'initial'
        property tweets_collected -> int32 {
            default := 0;
            constraint min_value(0);
        };
        property errors_encountered -> json;
        property last_tweet_id_processed -> str;
        property status -> str { # 'running', 'completed', 'failed', 'cancelled'
            default := 'running';
        };
        property error_message -> str;
    }

    # Rate limiting and monitoring
    type ScrapingStats {
        required property date -> cal::local_date {
            constraint exclusive;
        };
        required property total_requests -> int32 {
            default := 0;
            constraint min_value(0);
        };
        required property successful_requests -> int32 {
            default := 0;
            constraint min_value(0);
        };
        required property failed_requests -> int32 {
            default := 0;
            constraint min_value(0);
        };
        required property tweets_scraped -> int32 {
            default := 0;
            constraint min_value(0);
        };
        property rate_limited_count -> int32 {
            default := 0;
            constraint min_value(0);
        };
        property blocked_count -> int32 {
            default := 0;
            constraint min_value(0);
        };
        property average_delay_ms -> float32;
        property session_duration_seconds -> int32;
        required property created_at -> datetime {
            default := datetime_current();
        };
        property updated_at -> datetime;
    }

    # Configuration settings
    type ScraperConfig {
        required property key -> str {
            constraint exclusive;
        };
        required property value -> str;
        property description -> str;
        required property created_at -> datetime {
            default := datetime_current();
        };
        property updated_at -> datetime;
    }

    # Indexes for performance
    index tweet_created_at_idx on Tweet(created_at);
    index tweet_author_username_idx on Tweet(author_username);
    index tweet_scraped_at_idx on Tweet(scraped_at);
    index scraping_session_started_at_idx on ScrapingSession(started_at);
    index scraping_stats_date_idx on ScrapingStats(date);
}