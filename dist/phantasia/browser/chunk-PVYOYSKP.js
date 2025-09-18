import {
  BehaviorSubject,
  HttpClient,
  Injectable,
  __spreadValues,
  map,
  of,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-F34NQEWD.js";

// src/app/core/services/geldb-integration.service.ts
var _GelDbIntegrationService = class _GelDbIntegrationService {
  constructor(http) {
    this.http = http;
    this.phantasia2Artists$ = new BehaviorSubject([]);
    this.phantasia2Album$ = new BehaviorSubject(null);
    this.prismaticCollection$ = new BehaviorSubject(null);
    this.twitterUsers$ = new BehaviorSubject([]);
    this.twitterTweets$ = new BehaviorSubject([]);
    this.twitterApiUsage$ = new BehaviorSubject([]);
    this.artistAvatarMap = {
      "SpiralFlip": {
        avatarPath: "/assets/images/artists/SpiralFlip.png",
        displayName: "SpiralFlip",
        color: "#FF6B6B",
        genre: "Organiser"
      },
      "eili": {
        avatarPath: "/assets/images/artists/Eili.png",
        displayName: "eili",
        color: "#ffffff",
        // Changed from cyan to white for better readability
        genre: "Vocal, Electronic"
      },
      "Ariatec": {
        avatarPath: "/assets/images/artists/Ariatec.png",
        displayName: "Ariatec",
        color: "#45B7D1",
        genre: "Ambient, Cinematic"
      },
      "MB": {
        avatarPath: "/assets/images/artists/MBgov.png",
        displayName: "MBgov",
        color: "#96CEB4",
        genre: "Orchestral, Classical"
      },
      "Iku Hoshifuri": {
        avatarPath: "/assets/images/artists/Iku Hoshifuri.png",
        displayName: "Iku Hoshifuri",
        color: "#FFEAA7",
        genre: "Vocal, J-Pop"
      },
      "Justin Thornburgh": {
        avatarPath: "/assets/images/artists/Justin Thornburgh.png",
        displayName: "Justin Thornburgh",
        color: "#DDA0DD",
        genre: "Folk, Accordion"
      },
      "v1ris": {
        avatarPath: "/assets/images/artists/v1ris.png",
        displayName: "v1ris",
        color: "#F8B500",
        genre: "Classical, Violin"
      },
      "Rita Kamishiro": {
        avatarPath: "/assets/images/artists/Rita Kamishiro.png",
        displayName: "Rita Kamishiro",
        color: "#E17055",
        genre: "Classical, Viola"
      },
      "Marcus Ho": {
        avatarPath: "/assets/images/artists/Marcus Ho.png",
        displayName: "Marcus Ho",
        color: "#6C5CE7",
        genre: "Classical, Cello"
      },
      "AZALI": {
        avatarPath: "/assets/images/artists/AZALI.png",
        displayName: "AZALI",
        color: "#A29BFE",
        genre: "Electronic, Experimental"
      },
      "Aloysius": {
        avatarPath: "/assets/images/artists/Aloysius.png",
        displayName: "Aloysius",
        color: "#FD79A8",
        genre: "Electronic, Ambient"
      },
      "potatoTeto": {
        avatarPath: "/assets/images/artists/potatoTeto.png",
        displayName: "potatoTeto",
        color: "#00B894",
        genre: "Ambient, Experimental"
      },
      "Artisan": {
        avatarPath: "/assets/images/artists/Artisan.png",
        displayName: "Artisan",
        color: "#E84393",
        genre: "Electronic, Melodic"
      },
      "Mei Naganowa": {
        avatarPath: "/assets/images/artists/Mei Naganowa.png",
        displayName: "Mei Naganowa",
        color: "#00CEC9",
        genre: "Electronic, Synthesizer V"
      },
      "Evin a'k": {
        avatarPath: "/assets/images/artists/Evin a'k.png",
        displayName: "Evin a'k",
        color: "#FDCB6E",
        genre: "Electronic, Bass"
      },
      "BilliumMoto": {
        avatarPath: "/assets/images/artists/BilliumMoto.png",
        displayName: "BilliumMoto",
        color: "#74B9FF",
        genre: "Lofi, Chill"
      },
      "Elliot Hsu": {
        avatarPath: "/assets/images/artists/Elliot Hsu.png",
        displayName: "Elliot Hsu",
        color: "#55A3FF",
        genre: "Electronic, Ambient"
      },
      "Yuzuki": {
        avatarPath: "/assets/images/artists/Yuzuki.png",
        displayName: "Yuzuki",
        color: "#FF7675",
        genre: "Electronic, Synthesizer V"
      },
      "LucaProject": {
        avatarPath: "/assets/images/artists/LucaProject.png",
        displayName: "LucaProject",
        color: "#6C5CE7",
        genre: "Electronic, Melodic"
      },
      "Koway": {
        avatarPath: "/assets/images/artists/Koway.png",
        displayName: "Koway",
        color: "#A29BFE",
        genre: "Electronic, Experimental"
      },
      "\u4F0D\u4E00": {
        avatarPath: "/assets/images/artists/\u4F0D\u4E00.png",
        displayName: "\u4F0D\u4E00",
        color: "#FFEAA7",
        genre: "Vocal, Electronic"
      },
      "Nstryder": {
        avatarPath: "/assets/images/artists/Nstryder.png",
        displayName: "Nstryder",
        color: "#E17055",
        genre: "Electronic, Hardcore"
      },
      "MoAE": {
        avatarPath: "/assets/images/artists/MoAE:..png",
        displayName: "MoAE:.",
        color: "#00B894",
        genre: "Electronic, Ambient"
      },
      "dystopian tanuki": {
        avatarPath: "/assets/images/artists/dystopian tanuki.png",
        displayName: "dystopian tanuki",
        color: "#636E72",
        genre: "Experimental, Ambient"
      },
      "Heem": {
        avatarPath: "/assets/images/artists/Heem.png",
        displayName: "Heem",
        color: "#FD79A8",
        genre: "Electronic, Melodic"
      },
      "Woojinee": {
        avatarPath: "/assets/images/artists/Woojinee.png",
        displayName: "Woojinee",
        color: "#E84393",
        genre: "Violinist"
      },
      "Bigg Milk": {
        avatarPath: "/assets/images/artists/Bigg Milk.png",
        displayName: "Bigg Milk",
        color: "#00CEC9",
        genre: "Electronic, Chill"
      },
      "Gardens": {
        avatarPath: "/assets/images/artists/Gardens.png",
        displayName: "Gardens",
        color: "#00B894",
        genre: "Electronic, Ambient"
      },
      "Sad Keyboard Guy": {
        avatarPath: "/assets/images/artists/Sad Keyboard Guy.png",
        displayName: "Sad Keyboard Guy",
        color: "#74B9FF",
        genre: "Lofi, Emotional"
      },
      "Futsuunohito": {
        avatarPath: "/assets/images/artists/Futsuunohito.png",
        displayName: "Futsuunohito",
        color: "#A29BFE",
        genre: "Electronic, Cinematic"
      },
      "shishishiena": {
        avatarPath: "/assets/images/artists/shishishiena.png",
        displayName: "shishishiena",
        color: "#FFEAA7",
        genre: "Voice Acting, Vocal"
      },
      // ====== SPECIAL MENTIONS - PRODUCTION TEAM ======
      "PliXoR": {
        avatarPath: "/assets/images/artists/PliXoR.png",
        displayName: "PliXoR",
        color: "#ff6b6b",
        genre: "Mastering Engineer"
      },
      "NapaL": {
        avatarPath: "/assets/images/artists/NapaL.png",
        displayName: "\uB098\uD314 NapaL",
        color: "#4ecdc4",
        genre: "Cover Illustration"
      },
      "yy_artwork": {
        avatarPath: "/assets/images/artists/yy_artwork.png",
        displayName: "yy_artwork",
        color: "#45b7d1",
        genre: "Logo/Jacket Design"
      },
      "Elegant Sister": {
        avatarPath: "/assets/images/artists/Elegant Sister.png",
        displayName: "Elegant Sister",
        color: "#f7b733",
        genre: "Album Stream MV"
      },
      "Len": {
        avatarPath: "/assets/images/artists/Len Licht.png",
        displayName: "Len",
        color: "#5f27cd",
        genre: "Crossfade MV/Live2D"
      },
      "Daph": {
        avatarPath: "/assets/images/artists/Daph Shoo.png",
        displayName: "Daph",
        color: "#00d2d3",
        genre: "Live2D"
      },
      "honabai": {
        avatarPath: "/assets/images/artists/honabai.png",
        displayName: "honabai",
        color: "#ff9ff3",
        genre: "Special Thanks"
      },
      "shironill": {
        avatarPath: "/assets/images/artists/shironill.png",
        displayName: "shironill",
        color: "#f368e0",
        genre: "Special Thanks"
      },
      // ====== PHANTASIA 1 ARTISTS ======
      "Prower": {
        avatarPath: "/assets/images/artists/Prower.png",
        displayName: "Prower",
        color: "#9b59b6",
        genre: "Electronic Producer"
      },
      "Seycara": {
        avatarPath: "/assets/images/artists/Seycara.png",
        displayName: "Seycara",
        color: "#e74c3c",
        genre: "Electronic Producer"
      },
      "Qyubey": {
        avatarPath: "/assets/images/artists/Qyubey.png",
        displayName: "Qyubey",
        color: "#f39c12",
        genre: "Electronic Producer"
      },
      "Luscinia": {
        avatarPath: "/assets/images/artists/Luscinia.png",
        displayName: "Luscinia",
        color: "#2ecc71",
        genre: "Electronic Producer"
      },
      "\u306F\u304C\u306D": {
        avatarPath: "/assets/images/artists/Hagane.png",
        displayName: "\u306F\u304C\u306D",
        color: "#34495e",
        genre: "Electronic Producer"
      },
      "satella": {
        avatarPath: "/assets/images/artists/satella.png",
        displayName: "satella",
        color: "#8e44ad",
        genre: "Electronic Producer"
      },
      "sleepy": {
        avatarPath: "/assets/images/artists/Sleepless.png",
        displayName: "sleepy",
        color: "#B0E0E6",
        genre: "Electronic Producer"
      },
      "tikaal": {
        avatarPath: "/assets/images/artists/tikaal.png",
        displayName: "tikaal",
        color: "#FF9F40",
        genre: "Bass Guitarist"
      },
      "Miyamai Moca": {
        avatarPath: "/assets/images/artists/Miyamai-Moca.png",
        displayName: "Miyamai Moca",
        color: "#FFB347",
        genre: "Synthesizer V Operator"
      }
    };
    this.initializeGelDbData();
    this.loadTwitterDataFromLocalStorage();
  }
  /**
   * Get all Phantasia 2 artists with their avatars
   */
  getPhantasia2Artists() {
    return this.phantasia2Artists$.asObservable();
  }
  /**
   * Get Phantasia 2 album data with full artist information
   */
  getPhantasia2Album() {
    return this.phantasia2Album$.asObservable();
  }
  /**
   * Get the Prismatic Collections prism data
   */
  getPrismaticCollection() {
    return this.prismaticCollection$.asObservable();
  }
  /**
   * Get artist avatar path by name
   */
  getArtistAvatar(artistName) {
    const artistData = this.artistAvatarMap[artistName];
    return artistData?.avatarPath || "/assets/images/artists/default-avatar.png";
  }
  /**
   * Get artist display name
   */
  getArtistDisplayName(artistName) {
    const artistData = this.artistAvatarMap[artistName];
    return artistData?.displayName || artistName;
  }
  /**
   * Get artist color theme
   */
  getArtistColor(artistName) {
    const artistData = this.artistAvatarMap[artistName];
    return artistData?.color || "#74B9FF";
  }
  /**
   * Get all artist avatar mappings
   */
  getArtistAvatarMap() {
    return this.artistAvatarMap;
  }
  /**
   * Get social media links for an artist
   */
  getArtistSocialLinks(artistName) {
    const socialLinksMap = {
      "SpiralFlip": { youtube: "https://www.youtube.com/@SpiralFlip", carrd: "https://spiralflip.carrd.co/" },
      "eili": { youtube: "https://www.youtube.com/@EiliYT", twitter: "https://x.com/frenlize" },
      "Ariatec": { youtube: "https://www.youtube.com/@musicbyariatec", reelcrafter: "https://play.reelcrafter.com/KLSound/port" },
      "MB": { youtube: "https://www.youtube.com/@MBMichael", twitter: "https://x.com/MBgov1133" },
      "Iku Hoshifuri": { youtube: "https://www.youtube.com/@IkuHoshifuri", linktr: "https://lit.link/en/ikuhoshifuri" },
      "AZALI": { youtube: "https://www.youtube.com/@AZALI00013", twitter: "https://x.com/AZALI00013" },
      "Aloysius": { youtube: "https://www.youtube.com/@aloysius3264", twitter: "https://x.com/Aloysiu04138577" },
      "Heem": { twitter: "https://x.com/h_e_e__m", linktr: "https://linktr.ee/heeem" },
      "Prower": { twitter: "https://x.com/prowerrr_" },
      "Seycara": { twitter: "https://x.com/Seycara", youtube: "https://www.youtube.com/@Seycara" },
      "Qyubey": { twitter: "https://x.com/QyubeySan", youtube: "https://www.youtube.com/@qyubey_san" },
      "Luscinia": { twitter: "https://x.com/LusciniaSound", youtube: "https://www.youtube.com/@Luscinia.Nightingale" },
      "\u306F\u304C\u306D": { twitter: "https://x.com/STEEL_PLUS", youtube: "https://www.youtube.com/@steelplus_hagane" },
      "Hagane": { twitter: "https://x.com/STEEL_PLUS", youtube: "https://www.youtube.com/@steelplus_hagane" },
      "LucaProject": { youtube: "https://www.youtube.com/@lucaproject6108", twitter: "https://x.com/LucaProject6108", carrd: "https://lucaproject.carrd.co/" },
      "satella": { twitter: "https://x.com/satella0w0", youtube: "https://www.youtube.com/@satella0w0" },
      "sleepy": { twitter: "https://x.com/sleeplessgamign" },
      "PliXoR": { twitter: "https://x.com/plixormusic" },
      "NapaL": { twitter: "https://x.com/Ve_Xillum" },
      "yy_artwork": { twitter: "https://x.com/yy_artwork" },
      "Elegant Sister": { twitter: "https://x.com/ElegantSister" },
      "Len": { twitter: "https://x.com/Len_licht" },
      "Daph": { twitter: "https://x.com/daphshoo" },
      "honabai": { twitter: "https://x.com/honabai" },
      "shironill": { twitter: "https://x.com/shironill" },
      "Woojinee": { instagram: "https://www.instagram.com/wooj1nee/?igsh=czUwcXg3aWh6NmM5&utm_source=qr#" },
      "tikaal": { twitter: "https://x.com/tikaal" },
      "Miyamai Moca": { twitter: "https://x.com/ReeKDoesDTM" }
    };
    const links = socialLinksMap[artistName];
    if (!links)
      return null;
    return __spreadValues({
      id: `social-${artistName.toLowerCase().replace(/\s+/g, "-")}`
    }, links);
  }
  /**
   * Search artists by name or genre
   */
  searchArtists(query) {
    return this.phantasia2Artists$.pipe(map((artists) => artists.filter((artist) => artist.name.toLowerCase().includes(query.toLowerCase()) || artist.display_name?.toLowerCase().includes(query.toLowerCase()) || artist.genre?.toLowerCase().includes(query.toLowerCase()))));
  }
  /**
   * Get featured artists from Prismatic Collections
   */
  getFeaturedArtists() {
    return this.prismaticCollection$.pipe(map((prism) => prism?.featured_artists || []));
  }
  /**
   * Initialize geldb data (would typically query the actual database)
   * For now, this creates mock data based on the avatar mapping
   */
  initializeGelDbData() {
    try {
      const artists = Object.entries(this.artistAvatarMap).map(([name, data], index) => ({
        id: `artist-${index + 1}`,
        name,
        display_name: data.displayName,
        avatar: data.avatarPath,
        color: data.color,
        genre: data.genre,
        created_at: (/* @__PURE__ */ new Date()).toISOString(),
        updated_at: (/* @__PURE__ */ new Date()).toISOString()
      }));
      this.phantasia2Artists$.next(artists);
      const phantasia2Album = {
        id: "phantasia-2",
        title: "Phantasia 2",
        artist: artists.find((a) => a.name === "SpiralFlip"),
        release_date: "2025-01-01",
        genre: "Electronic Compilation",
        description: "The second installment of the Phantasia compilation series",
        cover_art_url: "/assets/images/covers/phantasia2-cover.jpg",
        track_count: 20,
        duration_seconds: 4567,
        songs: []
        // Would be populated with actual track data
      };
      this.phantasia2Album$.next(phantasia2Album);
      const prismaticCollection = {
        id: "prismatic-collections",
        name: "Prismatic Collections",
        description: "A multi-faceted music collection celebrating diverse electronic artists",
        color_scheme: "prismatic",
        theme: "electronic-fusion",
        is_featured: true,
        collections: [],
        featured_artists: artists.slice(0, 10)
        // First 10 artists as featured
      };
      this.prismaticCollection$.next(prismaticCollection);
    } catch (error) {
      console.error("Failed to initialize geldb data:", error);
    }
  }
  /**
   * Refresh data from geldb (placeholder for actual database queries)
   */
  refreshData() {
    this.initializeGelDbData();
    return of(true);
  }
  // ====== TWITTER DATA MANAGEMENT METHODS ======
  /**
   * Get cached Twitter users
   */
  getTwitterUsers() {
    return this.twitterUsers$.asObservable();
  }
  /**
   * Get cached Twitter tweets
   */
  getTwitterTweets() {
    return this.twitterTweets$.asObservable();
  }
  /**
   * Get Twitter API usage history
   */
  getTwitterApiUsage() {
    return this.twitterApiUsage$.asObservable();
  }
  /**
   * Cache Twitter user data
   */
  cacheTwitterUser(userData) {
    const currentUsers = this.twitterUsers$.value;
    const existingIndex = currentUsers.findIndex((user2) => user2.twitter_id === userData.twitter_id);
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const user = {
      id: userData.id || `twitter_user_${userData.twitter_id}`,
      twitter_id: userData.twitter_id,
      username: userData.username,
      display_name: userData.display_name,
      profile_image_url: userData.profile_image_url,
      verified: userData.verified,
      followers_count: userData.followers_count,
      following_count: userData.following_count,
      tweet_count: userData.tweet_count,
      cached_at: now,
      updated_at: now
    };
    if (existingIndex >= 0) {
      currentUsers[existingIndex] = user;
    } else {
      currentUsers.push(user);
    }
    this.twitterUsers$.next([...currentUsers]);
    this.saveTwitterDataToLocalStorage();
    console.log(`\u{1F4CB} Cached Twitter user: @${user.username}`);
  }
  /**
   * Cache Twitter tweets
   */
  cacheTwitterTweets(tweets) {
    const currentTweets = this.twitterTweets$.value;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    tweets.forEach((tweetData) => {
      const existingIndex = currentTweets.findIndex((tweet2) => tweet2.tweet_id === tweetData.tweet_id);
      const hashtags = (tweetData.text.match(/#\w+/g) || []).map((tag) => tag.substring(1));
      const mentions = (tweetData.text.match(/@\w+/g) || []).map((mention) => mention.substring(1));
      const urls = tweetData.text.match(/https?:\/\/[^\s]+/g) || [];
      const tweet = {
        id: tweetData.id || `twitter_tweet_${tweetData.tweet_id}`,
        tweet_id: tweetData.tweet_id,
        user_id: tweetData.user_id,
        text: tweetData.text,
        created_at: tweetData.created_at,
        retweet_count: tweetData.retweet_count,
        like_count: tweetData.like_count,
        reply_count: tweetData.reply_count,
        quote_count: tweetData.quote_count,
        hashtags,
        mentions,
        urls,
        cached_at: now,
        updated_at: now
      };
      if (existingIndex >= 0) {
        currentTweets[existingIndex] = tweet;
      } else {
        currentTweets.push(tweet);
      }
    });
    currentTweets.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    this.twitterTweets$.next([...currentTweets]);
    this.saveTwitterDataToLocalStorage();
    console.log(`\u{1F4CB} Cached ${tweets.length} Twitter tweets`);
  }
  /**
   * Log Twitter API usage
   */
  logTwitterApiUsage(apiCall) {
    const currentUsage = this.twitterApiUsage$.value;
    const now = (/* @__PURE__ */ new Date()).toISOString();
    const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
    const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    const monthlyCallsUsed = currentUsage.filter((call) => {
      const callDate = new Date(call.timestamp);
      return callDate.getMonth() === currentMonth && callDate.getFullYear() === currentYear;
    }).length + 1;
    const usage = {
      id: apiCall.id || `api_call_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`,
      endpoint: apiCall.endpoint,
      method: apiCall.method,
      timestamp: now,
      success: apiCall.success,
      rate_limit_remaining: apiCall.rate_limit_remaining,
      error_message: apiCall.error_message,
      monthly_calls_used: monthlyCallsUsed
    };
    currentUsage.push(usage);
    if (currentUsage.length > 1e3) {
      currentUsage.splice(0, currentUsage.length - 1e3);
    }
    this.twitterApiUsage$.next([...currentUsage]);
    this.saveTwitterDataToLocalStorage();
    console.log(`\u{1F4CA} Logged Twitter API call: ${usage.method} ${usage.endpoint} (${usage.success ? "Success" : "Failed"})`);
  }
  /**
   * Get cached Twitter user by username
   */
  getCachedTwitterUser(username) {
    return this.twitterUsers$.pipe(map((users) => users.find((user) => user.username.toLowerCase() === username.toLowerCase()) || null));
  }
  /**
   * Get cached tweets for a specific user
   */
  getCachedTwitterTweetsForUser(userId) {
    return this.twitterTweets$.pipe(map((tweets) => tweets.filter((tweet) => tweet.user_id === userId)));
  }
  /**
   * Get monthly Twitter API usage statistics
   */
  getMonthlyApiUsageStats() {
    return this.twitterApiUsage$.pipe(map((usage) => {
      const currentMonth = (/* @__PURE__ */ new Date()).getMonth();
      const currentYear = (/* @__PURE__ */ new Date()).getFullYear();
      const monthlyUsage = usage.filter((call) => {
        const callDate = new Date(call.timestamp);
        return callDate.getMonth() === currentMonth && callDate.getFullYear() === currentYear;
      });
      const totalCalls = monthlyUsage.length;
      const successfulCalls = monthlyUsage.filter((call) => call.success).length;
      const failedCalls = totalCalls - successfulCalls;
      const successRate = totalCalls > 0 ? successfulCalls / totalCalls * 100 : 0;
      const remainingCalls = Math.max(0, 100 - totalCalls);
      const lastCallTimestamp = monthlyUsage.length > 0 ? monthlyUsage[monthlyUsage.length - 1].timestamp : null;
      return {
        totalCalls,
        successfulCalls,
        failedCalls,
        successRate,
        remainingCalls,
        lastCallTimestamp
      };
    }));
  }
  /**
   * Check if Twitter data is cached and recent
   */
  isTwitterDataFresh(username, maxAgeHours = 24) {
    return this.getCachedTwitterUser(username).pipe(map((user) => {
      if (!user)
        return false;
      const cacheAge = Date.now() - new Date(user.cached_at).getTime();
      const maxAge = maxAgeHours * 60 * 60 * 1e3;
      return cacheAge < maxAge;
    }));
  }
  /**
   * Clear Twitter cache
   */
  clearTwitterCache() {
    this.twitterUsers$.next([]);
    this.twitterTweets$.next([]);
    this.twitterApiUsage$.next([]);
    localStorage.removeItem("geldb_twitter_cache");
    console.log("\u{1F5D1}\uFE0F Twitter cache cleared");
  }
  /**
   * Save Twitter data to localStorage
   */
  saveTwitterDataToLocalStorage() {
    try {
      const twitterData = {
        users: this.twitterUsers$.value,
        tweets: this.twitterTweets$.value,
        usage: this.twitterApiUsage$.value,
        timestamp: Date.now()
      };
      localStorage.setItem("geldb_twitter_cache", JSON.stringify(twitterData));
    } catch (error) {
      console.warn("Failed to save Twitter data to localStorage:", error);
    }
  }
  /**
   * Load Twitter data from localStorage
   */
  loadTwitterDataFromLocalStorage() {
    try {
      const cached = localStorage.getItem("geldb_twitter_cache");
      if (!cached)
        return;
      const twitterData = JSON.parse(cached);
      const age = Date.now() - twitterData.timestamp;
      if (age > 7 * 24 * 60 * 60 * 1e3) {
        localStorage.removeItem("geldb_twitter_cache");
        return;
      }
      this.twitterUsers$.next(twitterData.users || []);
      this.twitterTweets$.next(twitterData.tweets || []);
      this.twitterApiUsage$.next(twitterData.usage || []);
      console.log(`\u{1F4CB} Loaded Twitter cache: ${twitterData.users?.length || 0} users, ${twitterData.tweets?.length || 0} tweets, ${twitterData.usage?.length || 0} API calls`);
    } catch (error) {
      console.warn("Failed to load Twitter data from localStorage:", error);
      localStorage.removeItem("geldb_twitter_cache");
    }
  }
};
_GelDbIntegrationService.\u0275fac = function GelDbIntegrationService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _GelDbIntegrationService)(\u0275\u0275inject(HttpClient));
};
_GelDbIntegrationService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GelDbIntegrationService, factory: _GelDbIntegrationService.\u0275fac, providedIn: "root" });
var GelDbIntegrationService = _GelDbIntegrationService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GelDbIntegrationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

export {
  GelDbIntegrationService
};
//# sourceMappingURL=chunk-PVYOYSKP.js.map
