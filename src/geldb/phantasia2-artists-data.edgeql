# Phantasia 2 Artists Data with Avatar Integration
# This script populates the geldb database with all Phantasia 2 artists and their avatars

# Insert SocialLinks for each artist
INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@SpiralFlip",
    carrd := "https://spiralflip.carrd.co/"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@musicbyariatec",
    reelcrafter := "https://play.reelcrafter.com/KLSound/port"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@MBMichael",
    twitter := "https://x.com/MBgov1133"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@IkuHoshifuri",
    linktr := "https://lit.link/en/ikuhoshifuri"
};

INSERT default::SocialLinks {
    twitter := "https://x.com/JustinThornbur7"
};

INSERT default::SocialLinks {
    website := "https://v1ris.com/",
    youtube := "https://www.youtube.com/@v1ris_music"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@RitaKamishiro",
    carrd := "https://ritakamishiro.carrd.co/"
};

INSERT default::SocialLinks {
    website := "https://www.marcushomusic.com/"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@AZALI00013",
    twitter := "https://x.com/AZALI00013"
};

INSERT default::SocialLinks {
    twitter := "https://x.com/Aloysiu04138577",
    youtube := "https://www.youtube.com/@aloysius3264"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@potatoteto",
    website := "https://www.potatoteto.com/"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@artisan1233",
    twitter := "https://x.com/artisan1233"
};

INSERT default::SocialLinks {
    twitter := "https://x.com/ReeKDoesDTM"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@Evin_a_k",
    twitter := "https://x.com/evin_a_k?lang=en"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@BilliumMoto",
    twitter := "https://x.com/BilliumMoto"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@ElliotHsu",
    twitter := "https://x.com/Leigendar"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@yuzukimasu",
    linktr := "https://linktr.ee/yuzukimasu"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@lucaproject6108",
    carrd := "https://lucaproject.carrd.co/"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@KOWAYmusic",
    instagram := "https://www.instagram.com/koway_music/",
    twitter := "https://x.com/kowaymusic"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@dreamer051",
    twitch := "https://www.twitch.tv/dreamer051/about"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@nstryder-music",
    bandcamp := "https://nstryder.bandcamp.com/"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@moae00",
    website := "https://moae.jimdosite.com/"
};

INSERT default::SocialLinks {
    twitter := "https://x.com/DystopianTanuki",
    youtube := "https://www.youtube.com/@dystopiantanuki"
};

INSERT default::SocialLinks {
    linktr := "https://linktr.ee/heeem"
};

INSERT default::SocialLinks {
    instagram := "https://www.instagram.com/wooj1nee?igsh=czUwcXg3aWh6NmM5&utm_source=qr"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@BiggMilk",
    twitter := "https://x.com/milk_bigg"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@gardens5812",
    website := "https://gardensdtm.com/"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@SadKeyboardGuy",
    carrd := "https://sadkeyboardguy.carrd.co/"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@EiliYT",
    twitter := "https://x.com/frenlize"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@futsuunohito",
    carrd := "https://futsuunohito.crd.co/"
};

INSERT default::SocialLinks {
    youtube := "https://www.youtube.com/@shishishiena",
    website := "https://www.shishishiena.com/"
};

# Insert all Phantasia 2 Artists with their avatars
INSERT default::Artist {
    name := "SpiralFlip",
    display_name := "SpiralFlip",
    avatar := "/assets/images/artists/SpiralFlip.png",
    genre := "Electronic, Synthwave",
    color := "#FF6B6B",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@SpiralFlip")
};

INSERT default::Artist {
    name := "eili",
    display_name := "eili",
    avatar := "/assets/images/artists/Eili.png",
    genre := "Vocal, Electronic",
    color := "#4ECDC4",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@EiliYT")
};

INSERT default::Artist {
    name := "Ariatec",
    display_name := "Ariatec",
    avatar := "/assets/images/artists/Ariatec.png",
    genre := "Ambient, Cinematic",
    color := "#45B7D1",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@musicbyariatec")
};

INSERT default::Artist {
    name := "MB",
    display_name := "MBgov",
    avatar := "/assets/images/artists/MBgov.png",
    genre := "Orchestral, Classical",
    color := "#96CEB4",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@MBMichael")
};

INSERT default::Artist {
    name := "Iku Hoshifuri",
    display_name := "Iku Hoshifuri",
    avatar := "/assets/images/artists/Iku Hoshifuri.png",
    genre := "Vocal, J-Pop",
    color := "#FFEAA7",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@IkuHoshifuri")
};

INSERT default::Artist {
    name := "Justin Thornburgh",
    display_name := "Justin Thornburgh",
    avatar := "/assets/images/artists/Justin Thornburgh.png",
    genre := "Folk, Accordion",
    color := "#DDA0DD",
    social_links := (SELECT default::SocialLinks FILTER .twitter = "https://x.com/JustinThornbur7")
};

INSERT default::Artist {
    name := "v1ris",
    display_name := "v1ris",
    avatar := "/assets/images/artists/v1ris.png",
    genre := "Classical, Violin",
    color := "#F8B500",
    social_links := (SELECT default::SocialLinks FILTER .website = "https://v1ris.com/")
};

INSERT default::Artist {
    name := "Rita Kamishiro",
    display_name := "Rita Kamishiro",
    avatar := "/assets/images/artists/Rita Kamishiro.png",
    genre := "Classical, Viola",
    color := "#E17055",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@RitaKamishiro")
};

INSERT default::Artist {
    name := "Marcus Ho",
    display_name := "Marcus Ho",
    avatar := "/assets/images/artists/Marcus Ho.png",
    genre := "Classical, Cello",
    color := "#6C5CE7",
    social_links := (SELECT default::SocialLinks FILTER .website = "https://www.marcushomusic.com/")
};

INSERT default::Artist {
    name := "AZALI",
    display_name := "AZALI",
    avatar := "/assets/images/artists/AZALI.png",
    genre := "Electronic, Experimental",
    color := "#A29BFE",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@AZALI00013")
};

INSERT default::Artist {
    name := "Aloysius",
    display_name := "Aloysius",
    avatar := "/assets/images/artists/Aloysius.png",
    genre := "Electronic, Ambient",
    color := "#FD79A8",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@aloysius3264")
};

INSERT default::Artist {
    name := "potatoTeto",
    display_name := "potatoTeto",
    avatar := "/assets/images/artists/potatoTeto.png",
    genre := "Ambient, Experimental",
    color := "#00B894",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@potatoteto")
};

INSERT default::Artist {
    name := "Artisan",
    display_name := "Artisan",
    avatar := "/assets/images/artists/Artisan.png",
    genre := "Electronic, Melodic",
    color := "#E84393",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@artisan1233")
};

INSERT default::Artist {
    name := "Mei Naganowa",
    display_name := "Mei Naganowa",
    avatar := "/assets/images/artists/Mei Naganowa.png",
    genre := "Electronic, Synthesizer V",
    color := "#00CEC9",
    social_links := (SELECT default::SocialLinks FILTER .twitter = "https://x.com/ReeKDoesDTM")
};

INSERT default::Artist {
    name := "Evin a'k",
    display_name := "Evin a'k",
    avatar := "/assets/images/artists/Evin a'k.png",
    genre := "Electronic, Bass",
    color := "#FDCB6E",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@Evin_a_k")
};

INSERT default::Artist {
    name := "BilliumMoto",
    display_name := "BilliumMoto",
    avatar := "/assets/images/artists/BilliumMoto.png",
    genre := "Lofi, Chill",
    color := "#74B9FF",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@BilliumMoto")
};

INSERT default::Artist {
    name := "Elliot Hsu",
    display_name := "Elliot Hsu",
    avatar := "/assets/images/artists/Elliot Hsu.png",
    genre := "Electronic, Ambient",
    color := "#55A3FF",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@ElliotHsu")
};

INSERT default::Artist {
    name := "Yuzuki",
    display_name := "Yuzuki",
    avatar := "/assets/images/artists/Yuzuki.png",
    genre := "Electronic, Synthesizer V",
    color := "#FF7675",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@yuzukimasu")
};

INSERT default::Artist {
    name := "LucaProject",
    display_name := "LucaProject",
    avatar := "/assets/images/artists/LucaProject.png",
    genre := "Electronic, Melodic",
    color := "#6C5CE7",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@lucaproject6108")
};

INSERT default::Artist {
    name := "Koway",
    display_name := "Koway",
    avatar := "/assets/images/artists/Koway.png",
    genre := "Electronic, Experimental",
    color := "#A29BFE",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@KOWAYmusic")
};

INSERT default::Artist {
    name := "伍一",
    display_name := "伍一",
    avatar := "/assets/images/artists/伍一.png",
    genre := "Vocal, Electronic",
    color := "#FFEAA7",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@dreamer051")
};

INSERT default::Artist {
    name := "Nstryder",
    display_name := "Nstryder",
    avatar := "/assets/images/artists/Nstryder.png",
    genre := "Electronic, Hardcore",
    color := "#E17055",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@nstryder-music")
};

INSERT default::Artist {
    name := "MoAE",
    display_name := "MoAE:.",
    avatar := "/assets/images/artists/MoAE:..png",
    genre := "Electronic, Ambient",
    color := "#00B894",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@moae00")
};

INSERT default::Artist {
    name := "dystopian tanuki",
    display_name := "dystopian tanuki",
    avatar := "/assets/images/artists/dystopian tanuki.png",
    genre := "Experimental, Ambient",
    color := "#636E72",
    social_links := (SELECT default::SocialLinks FILTER .twitter = "https://x.com/DystopianTanuki")
};

INSERT default::Artist {
    name := "Heem",
    display_name := "Heem",
    avatar := "/assets/images/artists/Heem.png",
    genre := "Electronic, Melodic",
    color := "#FD79A8",
    social_links := (SELECT default::SocialLinks FILTER .linktr = "https://linktr.ee/heeem")
};

INSERT default::Artist {
    name := "Woojinee",
    display_name := "Woojinee",
    avatar := "/assets/images/artists/Woojinee.png",
    genre := "Classical, Violin",
    color := "#E84393",
    social_links := (SELECT default::SocialLinks FILTER .instagram LIKE "%wooj1nee%")
};

INSERT default::Artist {
    name := "Bigg Milk",
    display_name := "Bigg Milk",
    avatar := "/assets/images/artists/Bigg Milk.png",
    genre := "Electronic, Chill",
    color := "#00CEC9",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@BiggMilk")
};

INSERT default::Artist {
    name := "Gardens",
    display_name := "Gardens",
    avatar := "/assets/images/artists/Gardens.png",
    genre := "Electronic, Ambient",
    color := "#00B894",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@gardens5812")
};

INSERT default::Artist {
    name := "Sad Keyboard Guy",
    display_name := "Sad Keyboard Guy",
    avatar := "/assets/images/artists/Sad Keyboard Guy.png",
    genre := "Lofi, Emotional",
    color := "#74B9FF",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@SadKeyboardGuy")
};

INSERT default::Artist {
    name := "Futsuunohito",
    display_name := "Futsuunohito",
    avatar := "/assets/images/artists/Futsuunohito.png",
    genre := "Electronic, Cinematic",
    color := "#A29BFE",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@futsuunohito")
};

INSERT default::Artist {
    name := "shishishiena",
    display_name := "shishishiena",
    avatar := "/assets/images/artists/shishishiena.png",
    genre := "Voice Acting, Vocal",
    color := "#FFEAA7",
    social_links := (SELECT default::SocialLinks FILTER .youtube = "https://www.youtube.com/@shishishiena")
};

# Create Phantasia 2 Album
INSERT default::Album {
    title := "Phantasia 2",
    artist := (SELECT default::Artist FILTER .name = "SpiralFlip"),
    release_date := <cal::local_date>'2025-01-01',
    genre := "Electronic Compilation",
    description := "The second installment of the Phantasia compilation series, featuring diverse electronic music from talented artists around the world.",
    cover_art_url := "/assets/images/covers/phantasia2-cover.jpg",
    track_count := 20,
    duration_seconds := 4567
};

# Create Phantasia 2 Collection
INSERT default::Collection {
    name := "Phantasia 2",
    description := "A curated collection of electronic music featuring artists from around the globe, showcasing diverse styles and innovative soundscapes.",
    cover_image_url := "/assets/images/covers/phantasia2-collection.jpg",
    albums := (SELECT default::Album FILTER .title = "Phantasia 2"),
    is_public := true
};

# Create Prismatic Collections Prism
INSERT default::Prism {
    name := "Prismatic Collections",
    description := "A multi-faceted music collection celebrating diverse electronic artists and their unique creative visions.",
    color_scheme := "prismatic",
    theme := "electronic-fusion",
    is_featured := true,
    collections := (SELECT default::Collection FILTER .name = "Phantasia 2"),
    featured_artists := (
        SELECT default::Artist FILTER .name IN {
            "SpiralFlip", "eili", "Ariatec", "potatoTeto", "Artisan",
            "BilliumMoto", "Elliot Hsu", "Yuzuki", "Futsuunohito", "Gardens"
        }
    )
};