module default {
    scalar type ScrapingStatus extending enum<RUNNING, STOPPED, ERROR, COMPLETED>;

    # Tweet object representing a single tweet from X/Twitter
    type Tweet {
        required property tweetId -> str {
            constraint exclusive;
        };
        required property text -> str;
        required property authorUsername -> str;
        required property authorDisplayName -> str;
        property authorProfileImageUrl -> str;
        property authorProfileImageLocalPath -> str;
        required property authorVerified -> bool;
        required property createdAt -> datetime;
        required property scrapedAt -> datetime;

        # Engagement metrics
        required property likeCount -> int32 {
            constraint min_value(0);
        };
        required property retweetCount -> int32 {
            constraint min_value(0);
        };
        required property replyCount -> int32 {
            constraint min_value(0);
        };
        required property quoteCount -> int32 {
            constraint min_value(0);
        };

        # Tweet metadata
        required property isRetweet -> bool;
        required property isQuote -> bool;
        required property isReply -> bool;

        # Media and content
        multi property mediaUrls -> str;
        multi property mediaTypes -> str;
        multi property hashtags -> str;
        multi property mentions -> str;
        multi property urls -> str;

        # Source tweet for retweets/quotes
        property sourceTweetId -> str;
        property sourceTweetText -> str;
        property sourceAuthorUsername -> str;

        # Indexes for performance
        index on (.createdAt);
        index on (.authorUsername);
        index on (.scrapedAt);
    }

    # Twitter user profile information
    type TwitterUser {
        required property userId -> str {
            constraint exclusive;
        };
        required property username -> str {
            constraint exclusive;
        };
        required property displayName -> str;
        property description -> str;
        property profileImageUrl -> str;
        property profileImageLocalPath -> str;
        required property verified -> bool;
        required property followersCount -> int32 {
            constraint min_value(0);
        };
        required property followingCount -> int32 {
            constraint min_value(0);
        };
        required property tweetCount -> int32 {
            constraint min_value(0);
        };
        required property createdAt -> datetime;
        required property scrapedAt -> datetime;

        index on (.username);
    }

    # Scraping session tracking
    type ScrapingSession {
        required property sessionId -> str {
            constraint exclusive;
        };
        required property username -> str;
        required property status -> ScrapingStatus;
        required property startTime -> datetime;
        property endTime -> datetime;
        required property tweetsScraped -> int32 {
            default := 0;
            constraint min_value(0);
        };
        required property tweetsSaved -> int32 {
            default := 0;
            constraint min_value(0);
        };
        required property consecutiveFailures -> int32 {
            default := 0;
            constraint min_value(0);
        };
        property lastError -> str;
        property lastScrapedTweetId -> str;

        index on (.startTime);
        index on (.username);
    }
}