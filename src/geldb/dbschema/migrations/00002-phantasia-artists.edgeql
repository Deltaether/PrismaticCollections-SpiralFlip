CREATE MIGRATION m2phantasia_artists_and_avatars_20250915
    ONTO m1nwol46usk2ppspd2nfvpt2ahqxqq5h4znr6iy53eirk6bxkapuba
{
  # Add missing properties to Artist type
  ALTER TYPE default::Artist {
      CREATE PROPERTY avatar: std::str;
      CREATE PROPERTY color: std::str;
      CREATE PROPERTY display_name: std::str;
  };

  # Create SocialLinks type
  CREATE TYPE default::SocialLinks {
      CREATE PROPERTY youtube: std::str;
      CREATE PROPERTY twitter: std::str;
      CREATE PROPERTY instagram: std::str;
      CREATE PROPERTY website: std::str;
      CREATE PROPERTY carrd: std::str;
      CREATE PROPERTY linktr: std::str;
      CREATE PROPERTY bandcamp: std::str;
      CREATE PROPERTY reelcrafter: std::str;
      CREATE PROPERTY twitch: std::str;
  };

  # Add social_links relationship to Artist
  ALTER TYPE default::Artist {
      CREATE LINK social_links: default::SocialLinks;
  };

  # Add missing properties to Song type for Phantasia tracks
  ALTER TYPE default::Song {
      CREATE PROPERTY start_time_seconds: std::int32;
      CREATE PROPERTY end_time_seconds: std::int32;
      CREATE PROPERTY audio_file_path: std::str;
      CREATE MULTI LINK featured_artists: default::Artist;
      CREATE MULTI LINK collaborators: default::Artist;
      CREATE MULTI LINK additional_artists: default::Artist;
      CREATE REQUIRED LINK main_artist: default::Artist;
  };

  # Rename existing artist link to avoid conflicts
  ALTER TYPE default::Song {
      ALTER LINK artist {
          RENAME TO legacy_artist;
      };
  };
};