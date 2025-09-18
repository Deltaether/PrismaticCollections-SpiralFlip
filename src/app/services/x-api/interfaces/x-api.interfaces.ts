/**
 * Complete X API V2 Interface Definitions
 *
 * Official TypeScript interfaces matching X API V2 response schemas exactly.
 * These interfaces follow the official documentation at:
 * https://docs.x.com/x-api/data-dictionary
 *
 * Key Features:
 * - Complete type safety for all X API V2 responses
 * - Optional fields marked correctly per API specification
 * - Comprehensive field definitions including metrics and entities
 * - Support for expansions and includes
 * - Error response typing
 *
 * Last Updated: Based on X API V2 specification as of 2024
 */

// Core Data Objects

/**
 * User Object - Complete definition
 * @see https://docs.x.com/x-api/data-dictionary/object-model/user
 */
export interface XApiUser {
  /** Unique identifier of the user */
  id: string;

  /** Display name of the user */
  name: string;

  /** Unique username (handle) without @ symbol */
  username: string;

  /** UTC datetime when the user account was created */
  created_at?: string;

  /** Description/bio provided by the user */
  description?: string;

  /** Array of custom profile fields */
  entities?: {
    url?: {
      urls?: Array<{
        start: number;
        end: number;
        url: string;
        expanded_url?: string;
        display_url?: string;
      }>;
    };
    description?: {
      urls?: Array<{
        start: number;
        end: number;
        url: string;
        expanded_url?: string;
        display_url?: string;
      }>;
      hashtags?: Array<{
        start: number;
        end: number;
        tag: string;
      }>;
      mentions?: Array<{
        start: number;
        end: number;
        username: string;
      }>;
      cashtags?: Array<{
        start: number;
        end: number;
        tag: string;
      }>;
    };
  };

  /** Location specified by the user */
  location?: string;

  /** Unique identifier of the user's pinned Tweet */
  pinned_tweet_id?: string;

  /** URL to the user's profile image */
  profile_image_url?: string;

  /** Indicates if user has protected tweets */
  protected?: boolean;

  /** Public engagement metrics for the user */
  public_metrics?: {
    followers_count: number;
    following_count: number;
    tweet_count: number;
    listed_count: number;
    like_count?: number;
  };

  /** URL provided by the user in their profile */
  url?: string;

  /** Indicates if user is verified */
  verified?: boolean;

  /** Type of verification */
  verified_type?: 'blue' | 'business' | 'government';

  /** Information about withheld content */
  withheld?: {
    country_codes: string[];
    scope?: 'tweet' | 'user';
  };
}

/**
 * Tweet Object - Complete definition
 * @see https://docs.x.com/x-api/data-dictionary/object-model/tweet
 */
export interface XApiTweet {
  /** Unique identifier of the Tweet */
  id: string;

  /** The actual UTF-8 text of the Tweet */
  text: string;

  /** Array of Tweet attachments */
  attachments?: {
    media_keys?: string[];
    poll_ids?: string[];
  };

  /** Unique identifier of the User who posted this Tweet */
  author_id?: string;

  /** Contains details about text that has a special meaning */
  context_annotations?: Array<{
    domain: {
      id: string;
      name: string;
      description?: string;
    };
    entity: {
      id: string;
      name: string;
      description?: string;
    };
  }>;

  /** The id of the original Tweet of the conversation */
  conversation_id?: string;

  /** Creation time of the Tweet */
  created_at?: string;

  /** Specifies the type of attachments present in this Tweet */
  edit_controls?: {
    edits_remaining?: number;
    is_edit_eligible?: boolean;
    editable_until?: string;
  };

  /** Array of Tweet edit history metadata */
  edit_history_tweet_ids?: string[];

  /** Contains hashtags, URLs, user mentions, etc. */
  entities?: {
    annotations?: Array<{
      start: number;
      end: number;
      probability: number;
      type: string;
      normalized_text?: string;
    }>;
    cashtags?: Array<{
      start: number;
      end: number;
      tag: string;
    }>;
    hashtags?: Array<{
      start: number;
      end: number;
      tag: string;
    }>;
    mentions?: Array<{
      start: number;
      end: number;
      username: string;
      id?: string;
    }>;
    urls?: Array<{
      start: number;
      end: number;
      url: string;
      expanded_url?: string;
      display_url?: string;
      unwound_url?: string;
      status?: number;
      title?: string;
      description?: string;
      images?: Array<{
        url: string;
        width?: number;
        height?: number;
      }>;
    }>;
  };

  /** Contains details about the location tagged by the user */
  geo?: {
    coordinates?: {
      type: 'Point';
      coordinates: [number, number]; // [longitude, latitude]
    };
    place_id?: string;
  };

  /** Unique identifier of a Tweet user is replying to */
  in_reply_to_user_id?: string;

  /** Language of the Tweet */
  lang?: string;

  /** Non-public engagement metrics */
  non_public_metrics?: {
    impression_count?: number;
    url_link_clicks?: number;
    user_profile_clicks?: number;
  };

  /** Organic engagement metrics */
  organic_metrics?: {
    impression_count?: number;
    like_count?: number;
    reply_count?: number;
    retweet_count?: number;
    url_link_clicks?: number;
    user_profile_clicks?: number;
  };

  /** Indicates if this is a possibly sensitive Tweet */
  possibly_sensitive?: boolean;

  /** Promoted engagement metrics */
  promoted_metrics?: {
    impression_count?: number;
    like_count?: number;
    reply_count?: number;
    retweet_count?: number;
    url_link_clicks?: number;
    user_profile_clicks?: number;
  };

  /** Public engagement metrics */
  public_metrics?: {
    retweet_count: number;
    like_count: number;
    reply_count: number;
    quote_count: number;
    bookmark_count?: number;
    impression_count?: number;
  };

  /** Array of Tweets this Tweet refers to */
  referenced_tweets?: Array<{
    type: 'retweeted' | 'quoted' | 'replied_to';
    id: string;
  }>;

  /** Shows you if the content you are viewing has been withheld */
  reply_settings?: 'everyone' | 'mentionedUsers' | 'following';

  /** Source of the Tweet */
  source?: string;

  /** Information about withheld content */
  withheld?: {
    copyright?: boolean;
    country_codes?: string[];
    scope?: 'tweet';
  };
}

/**
 * Media Object - Complete definition
 * @see https://docs.x.com/x-api/data-dictionary/object-model/media
 */
export interface XApiMedia {
  /** Unique identifier for this piece of media */
  media_key: string;

  /** Type of media */
  type: 'photo' | 'video' | 'animated_gif';

  /** A direct URL to the media file */
  url?: string;

  /** Media width in pixels */
  width?: number;

  /** Media height in pixels */
  height?: number;

  /** Duration in milliseconds (video/gif only) */
  duration_ms?: number;

  /** URL to a static preview image (video/gif only) */
  preview_image_url?: string;

  /** Non-public engagement metrics */
  non_public_metrics?: {
    playback_0_count?: number;
    playback_25_count?: number;
    playback_50_count?: number;
    playback_75_count?: number;
    playback_100_count?: number;
  };

  /** Organic engagement metrics */
  organic_metrics?: {
    playback_0_count?: number;
    playback_25_count?: number;
    playback_50_count?: number;
    playback_75_count?: number;
    playback_100_count?: number;
    view_count?: number;
  };

  /** Promoted engagement metrics */
  promoted_metrics?: {
    playback_0_count?: number;
    playback_25_count?: number;
    playback_50_count?: number;
    playback_75_count?: number;
    playback_100_count?: number;
    view_count?: number;
  };

  /** Public engagement metrics */
  public_metrics?: {
    view_count?: number;
  };

  /** Alternative text for the media */
  alt_text?: string;

  /** Media category for content labeling */
  variants?: Array<{
    bit_rate?: number;
    content_type: string;
    url: string;
  }>;
}

/**
 * Poll Object - Complete definition
 * @see https://docs.x.com/x-api/data-dictionary/object-model/poll
 */
export interface XApiPoll {
  /** Unique identifier of the poll */
  id: string;

  /** Array of poll options */
  options: Array<{
    position: number;
    label: string;
    votes: number;
  }>;

  /** Duration of the poll in minutes */
  duration_minutes?: number;

  /** End time of the poll */
  end_datetime?: string;

  /** Voting status of the poll */
  voting_status?: 'open' | 'closed';
}

/**
 * Place Object - Complete definition
 * @see https://docs.x.com/x-api/data-dictionary/object-model/place
 */
export interface XApiPlace {
  /** Unique identifier of the place */
  id: string;

  /** Full human-readable representation of the place's name */
  full_name: string;

  /** Name of the place */
  name?: string;

  /** Type of place */
  place_type?: string;

  /** Name of the country containing this place */
  country?: string;

  /** ISO Alpha-2 country code */
  country_code?: string;

  /** A bounding box of coordinates which encloses this place */
  geo?: {
    type: string;
    bbox?: number[];
    properties?: Record<string, any>;
  };

  /** Array of places contained within this place */
  contained_within?: string[];
}

// Response Wrappers

/**
 * Standard X API V2 Response Structure
 * @see https://docs.x.com/x-api/data-dictionary/introduction
 */
export interface XApiResponse<T> {
  /** The primary data for the request */
  data?: T;

  /** Additional objects referenced in the primary data */
  includes?: {
    tweets?: XApiTweet[];
    users?: XApiUser[];
    media?: XApiMedia[];
    polls?: XApiPoll[];
    places?: XApiPlace[];
  };

  /** Contains metadata about the request */
  meta?: {
    result_count?: number;
    next_token?: string;
    previous_token?: string;
    newest_id?: string;
    oldest_id?: string;
  };

  /** Array of error objects if the request failed */
  errors?: XApiError[];
}

/**
 * Error Object
 * @see https://docs.x.com/x-api/data-dictionary/object-model/error
 */
export interface XApiError {
  /** Summary of the error */
  title: string;

  /** Description of the error */
  detail: string;

  /** Type of error */
  type: string;

  /** Resource type that caused the error */
  resource_type?: string;

  /** Parameter that caused the error */
  parameter?: string;

  /** Resource ID that caused the error */
  resource_id?: string;

  /** Value that caused the error */
  value?: string;

  /** Section of the request that caused the error */
  section?: string;
}

// Request Parameters

/**
 * User Fields for API requests
 */
export type UserFields =
  | 'created_at'
  | 'description'
  | 'entities'
  | 'id'
  | 'location'
  | 'name'
  | 'pinned_tweet_id'
  | 'profile_image_url'
  | 'protected'
  | 'public_metrics'
  | 'url'
  | 'username'
  | 'verified'
  | 'verified_type'
  | 'withheld';

/**
 * Tweet Fields for API requests
 */
export type TweetFields =
  | 'attachments'
  | 'author_id'
  | 'context_annotations'
  | 'conversation_id'
  | 'created_at'
  | 'edit_controls'
  | 'edit_history_tweet_ids'
  | 'entities'
  | 'geo'
  | 'id'
  | 'in_reply_to_user_id'
  | 'lang'
  | 'non_public_metrics'
  | 'organic_metrics'
  | 'possibly_sensitive'
  | 'promoted_metrics'
  | 'public_metrics'
  | 'referenced_tweets'
  | 'reply_settings'
  | 'source'
  | 'text'
  | 'withheld';

/**
 * Media Fields for API requests
 */
export type MediaFields =
  | 'alt_text'
  | 'duration_ms'
  | 'height'
  | 'media_key'
  | 'non_public_metrics'
  | 'organic_metrics'
  | 'preview_image_url'
  | 'promoted_metrics'
  | 'public_metrics'
  | 'type'
  | 'url'
  | 'variants'
  | 'width';

/**
 * Poll Fields for API requests
 */
export type PollFields =
  | 'duration_minutes'
  | 'end_datetime'
  | 'id'
  | 'options'
  | 'voting_status';

/**
 * Place Fields for API requests
 */
export type PlaceFields =
  | 'contained_within'
  | 'country'
  | 'country_code'
  | 'full_name'
  | 'geo'
  | 'id'
  | 'name'
  | 'place_type';

/**
 * Expansions for API requests
 */
export type Expansions =
  | 'attachments.media_keys'
  | 'attachments.poll_ids'
  | 'author_id'
  | 'edit_history_tweet_ids'
  | 'entities.mentions.username'
  | 'geo.place_id'
  | 'in_reply_to_user_id'
  | 'referenced_tweets.id'
  | 'referenced_tweets.id.author_id';

/**
 * Exclude parameters for tweets
 */
export type TweetExcludes = 'retweets' | 'replies';

// Configuration Interfaces

/**
 * Configuration for X API V2 Service
 */
export interface XApiConfig {
  /** Bearer Token for authentication */
  bearerToken: string;

  /** Base URL for X API (defaults to https://api.x.com/2) */
  baseUrl?: string;

  /** Enable debug logging */
  enableLogging?: boolean;

  /** Cache duration in milliseconds */
  cacheDuration?: number;

  /** Rate limiting configuration */
  rateLimiting?: {
    /** Enable automatic rate limiting */
    enabled: boolean;

    /** Warning threshold (0-1) for rate limit warnings */
    warningThreshold: number;

    /** Critical threshold (0-1) for request queuing */
    criticalThreshold: number;
  };

  /** Retry configuration */
  retry?: {
    /** Maximum number of retries */
    maxRetries: number;

    /** Base delay for exponential backoff (ms) */
    baseDelay: number;

    /** Maximum delay between retries (ms) */
    maxDelay: number;
  };
}

/**
 * Service state interface
 */
export interface XApiServiceState {
  /** Service initialization status */
  initialized: boolean;

  /** Authentication status */
  authenticated: boolean;

  /** Loading state */
  loading: boolean;

  /** Current error message */
  error: string | null;

  /** Last request timestamp */
  lastRequest: Date | null;

  /** Total request count */
  requestCount: number;

  /** Rate limit information per endpoint */
  rateLimits: Map<string, RateLimitInfo>;

  /** Cache statistics */
  cache?: {
    size: number;
    entries: number;
    hitRate: number;
  };
}

/**
 * Rate limit information
 */
export interface RateLimitInfo {
  /** Rate limit maximum */
  limit: number;

  /** Remaining requests */
  remaining: number;

  /** Reset timestamp (Unix timestamp) */
  reset: number;

  /** Reset date object */
  resetDate: Date;

  /** Window start time */
  windowStart: Date;

  /** Endpoint this applies to */
  endpoint: string;
}

// Utility Types

/**
 * Common query parameters for user lookup
 */
export interface UserLookupParams {
  userFields?: UserFields[];
  expansions?: Expansions[];
  tweetFields?: TweetFields[];
}

/**
 * Common query parameters for tweets
 */
export interface TweetsParams {
  maxResults?: number;
  tweetFields?: TweetFields[];
  userFields?: UserFields[];
  mediaFields?: MediaFields[];
  pollFields?: PollFields[];
  placeFields?: PlaceFields[];
  expansions?: Expansions[];
  exclude?: TweetExcludes[];
  startTime?: string;
  endTime?: string;
  sinceId?: string;
  untilId?: string;
  paginationToken?: string;
}

/**
 * Complete response type for user tweets
 */
export interface UserTweetsResponse {
  tweets: XApiTweet[];
  includes?: XApiResponse<XApiTweet[]>['includes'];
  meta?: XApiResponse<XApiTweet[]>['meta'];
  errors?: XApiError[];
}