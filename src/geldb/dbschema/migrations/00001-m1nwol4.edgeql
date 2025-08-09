CREATE MIGRATION m1nwol46usk2ppspd2nfvpt2ahqxqq5h4znr6iy53eirk6bxkapuba
    ONTO initial
{
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
  CREATE TYPE default::Artist {
      CREATE PROPERTY bio: std::str;
      CREATE PROPERTY country: std::str;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
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
      CREATE REQUIRED LINK artist: default::Artist;
      CREATE PROPERTY audio_file_url: std::str;
      CREATE PROPERTY created_at: std::datetime {
          SET default := (std::datetime_current());
      };
      CREATE PROPERTY duration_seconds: std::int32;
      CREATE PROPERTY genre: std::str;
      CREATE PROPERTY lyrics: std::str;
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
      CREATE MULTI LINK songs := (.<artist[IS default::Song]);
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
};
