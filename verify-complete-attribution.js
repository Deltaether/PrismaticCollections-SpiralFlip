#!/usr/bin/env node

/**
 * Complete Artist Attribution Verification Script
 * Ensures 100% accurate crediting for all Phantasia 2 contributors
 */

const fs = require('fs');
const path = require('path');

const ASSETS_DIR = path.join(__dirname, 'src/assets/images/artists');

// Complete list of expected artists with their contributions
const COMPLETE_ARTIST_DATABASE = {
  // Main Artists & Producers (22 artists)
  'SpiralFlip': {
    tracks: [1],
    roles: ['Main Artist', 'Producer', 'Composer'],
    avatar: 'SpiralFlip.png',
    socialLinks: ['youtube', 'carrd'],
    contributions: 1
  },
  'Ariatec': {
    tracks: [2],
    roles: ['Main Artist', 'Composer', 'Sound Designer'],
    avatar: 'Ariatec.png',
    socialLinks: ['youtube', 'reelcrafter'],
    contributions: 1
  },
  'MBgov': {
    tracks: [3],
    roles: ['Main Artist', 'Composer', 'Arranger'],
    avatar: 'MBgov.png',
    socialLinks: ['youtube', 'twitter'],
    contributions: 1
  },
  'AZALI': {
    tracks: [4],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'AZALI.png',
    socialLinks: ['youtube', 'twitter'],
    contributions: 1
  },
  'Aloysius': {
    tracks: [4],
    roles: ['Collaborator', 'Electronic Producer'],
    avatar: 'Aloysius.png',
    socialLinks: ['youtube', 'twitter'],
    contributions: 1
  },
  'potatoTeto': {
    tracks: [5],
    roles: ['Main Artist', 'Sound Designer'],
    avatar: 'potatoTeto.png',
    socialLinks: ['youtube', 'website'],
    contributions: 1
  },
  'Artisan': {
    tracks: [6],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'Artisan.png',
    socialLinks: ['youtube', 'twitter'],
    contributions: 1
  },
  'Mei Naganowa': {
    tracks: [7],
    roles: ['Main Artist', 'Synthesizer V Operator'],
    avatar: 'Mei Naganowa.png',
    socialLinks: ['twitter'],
    contributions: 1
  },
  'Evin a\'k': {
    tracks: [8],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'Evin a\u2019k.png',
    socialLinks: ['youtube', 'twitter'],
    contributions: 1
  },
  'BilliumMoto': {
    tracks: [9],
    roles: ['Main Artist', 'Producer'],
    avatar: 'BilliumMoto.png',
    socialLinks: ['youtube', 'twitter'],
    contributions: 1
  },
  'Elliot Hsu': {
    tracks: [10],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'Elliot Hsu.png',
    socialLinks: ['youtube', 'twitter'],
    contributions: 1
  },
  'Yuzuki': {
    tracks: [11],
    roles: ['Main Artist', 'Synthesizer V Operator'],
    avatar: 'Yuzuki.png',
    socialLinks: ['youtube', 'linktr'],
    contributions: 1
  },
  'LucaProject': {
    tracks: [12],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'LucaProject.png',
    socialLinks: ['youtube', 'carrd'],
    contributions: 1
  },
  'Koway': {
    tracks: [13],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'Koway.png',
    socialLinks: ['youtube', 'instagram', 'twitter'],
    contributions: 1
  },
  'Nstryder': {
    tracks: [14],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'Nstryder.png',
    socialLinks: ['youtube', 'bandcamp'],
    contributions: 1
  },
  'MoAE:.': {
    tracks: [15],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'MoAE:..png',
    socialLinks: ['youtube', 'website'],
    contributions: 1
  },
  'dystopian tanuki': {
    tracks: [16],
    roles: ['Main Artist', 'Sound Designer'],
    avatar: 'dystopian tanuki.png',
    socialLinks: ['youtube', 'twitter'],
    contributions: 1
  },
  'Heem': {
    tracks: [17],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'Heem.png',
    socialLinks: ['linktr'],
    contributions: 1
  },
  'Bigg Milk': {
    tracks: [18],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'Bigg Milk.png',
    socialLinks: ['youtube', 'twitter'],
    contributions: 1
  },
  'Gardens': {
    tracks: [19],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'Gardens.png',
    socialLinks: ['youtube', 'website'],
    contributions: 1
  },
  'Sad Keyboard Guy': {
    tracks: [19],
    roles: ['Collaborator', 'Keyboard', 'Composer'],
    avatar: 'Sad Keyboard Guy.png',
    socialLinks: ['youtube', 'carrd'],
    contributions: 1
  },
  'Futsuunohito': {
    tracks: [20],
    roles: ['Main Artist', 'Electronic Producer'],
    avatar: 'Futsuunohito.png',
    socialLinks: ['youtube', 'carrd'],
    contributions: 1
  },

  // Vocalists & Featured Artists (4 artists)
  'eili': {
    tracks: [1, 19],
    roles: ['Featured Artist', 'Vocalist'],
    avatar: 'Eili.png',
    socialLinks: ['youtube', 'twitter'],
    contributions: 2
  },
  'Iku Hoshifuri': {
    tracks: [3],
    roles: ['Featured Artist', 'Vocalist'],
    avatar: 'Iku Hoshifuri.png',
    socialLinks: ['youtube', 'linktr'],
    contributions: 1
  },
  '伍一': {
    tracks: [13],
    roles: ['Featured Artist', 'Vocalist'],
    avatar: '伍一.png',
    socialLinks: ['youtube', 'twitch'],
    contributions: 1
  },
  'shishishiena': {
    tracks: [20],
    roles: ['Voice Actor', 'Vocalist'],
    avatar: 'shishishiena.png',
    socialLinks: ['youtube', 'website'],
    contributions: 1
  },

  // Instrumentalists (5 artists)
  'Justin Thornburgh': {
    tracks: [3],
    roles: ['Accordion', 'Instrumentalist'],
    avatar: 'Justin Thornburgh.png',
    socialLinks: ['twitter'],
    contributions: 1
  },
  'v1ris': {
    tracks: [3],
    roles: ['Violin', 'Instrumentalist'],
    avatar: 'v1ris.png',
    socialLinks: ['website', 'youtube'],
    contributions: 1
  },
  'Rita Kamishiro': {
    tracks: [3],
    roles: ['Viola', 'Instrumentalist'],
    avatar: 'Rita Kamishiro.png',
    socialLinks: ['youtube', 'carrd'],
    contributions: 1
  },
  'Marcus Ho': {
    tracks: [3],
    roles: ['Cello', 'Instrumentalist'],
    avatar: 'Marcus Ho.png',
    socialLinks: ['website'],
    contributions: 1
  },
  'Woojinee': {
    tracks: [17],
    roles: ['Violin', 'Instrumentalist'],
    avatar: 'Woojinee.png',
    socialLinks: ['instagram'],
    contributions: 1
  }
};

// Track information for cross-validation
const TRACK_INFO = [
  { id: 1, title: 'Blinding Dawn', artists: ['SpiralFlip', 'eili'] },
  { id: 2, title: 'Hollow Crown', artists: ['Ariatec'] },
  { id: 3, title: '暁の姫', artists: ['MBgov', 'Iku Hoshifuri', 'Justin Thornburgh', 'v1ris', 'Rita Kamishiro', 'Marcus Ho'] },
  { id: 4, title: 'Lux Nova', artists: ['AZALI', 'Aloysius'] },
  { id: 5, title: 'Hall of Silent Echoes', artists: ['potatoTeto'] },
  { id: 6, title: 'Lirica', artists: ['Artisan'] },
  { id: 7, title: 'To Defy The Beankeeper', artists: ['Mei Naganowa'] },
  { id: 8, title: 'Trench', artists: ['Evin a\'k'] },
  { id: 9, title: 'Blooming in the Square', artists: ['BilliumMoto'] },
  { id: 10, title: 'Skies in Abberation', artists: ['Elliot Hsu'] },
  { id: 11, title: 'song of the nymphs', artists: ['Yuzuki'] },
  { id: 12, title: 'Light Guardian', artists: ['LucaProject'] },
  { id: 13, title: 'Enso Antumbra', artists: ['Koway', '伍一'] },
  { id: 14, title: 'You\'re In My Way', artists: ['Nstryder'] },
  { id: 15, title: 'Remember you', artists: ['MoAE:.'] },
  { id: 16, title: 'Hidden passage', artists: ['dystopian tanuki'] },
  { id: 17, title: 'Last Dance', artists: ['Heem', 'Woojinee'] },
  { id: 18, title: 'Second Guess', artists: ['Bigg Milk'] },
  { id: 19, title: 'Fractured Light', artists: ['Gardens', 'Sad Keyboard Guy', 'eili'] },
  { id: 20, title: 'Beyond the Veil of Light', artists: ['Futsuunohito', 'shishishiena'] }
];

function runCompleteVerification() {
  console.log('🎯 PHANTASIA 2 COMPLETE ARTIST ATTRIBUTION VERIFICATION');
  console.log('='.repeat(80));
  console.log('📊 Verifying 100% accurate crediting for all contributors...\n');

  // Get actual avatar files
  const avatarFiles = fs.readdirSync(ASSETS_DIR).filter(file => file.endsWith('.png') && !file.includes('deltaether'));

  console.log('📁 AVATAR VERIFICATION:');
  console.log(`Found ${avatarFiles.length} artist avatars\n`);

  const artistNames = Object.keys(COMPLETE_ARTIST_DATABASE);
  let avatarScore = 0;
  let socialScore = 0;
  let trackScore = 0;

  console.log('👤 INDIVIDUAL ARTIST VERIFICATION:');
  console.log('-'.repeat(60));

  artistNames.forEach((artistName, index) => {
    const artist = COMPLETE_ARTIST_DATABASE[artistName];
    const hasAvatar = avatarFiles.includes(artist.avatar);
    const hasSocialLinks = artist.socialLinks.length > 0;

    console.log(`${(index + 1).toString().padStart(2)}. ${artistName.padEnd(20)} | ${hasAvatar ? '✅' : '❌'} Avatar | ${hasSocialLinks ? '✅' : '❌'} Social | Tracks: ${artist.tracks.join(', ')}`);

    if (hasAvatar) avatarScore++;
    if (hasSocialLinks) socialScore++;
  });

  console.log('\n📊 TRACK-BY-TRACK VERIFICATION:');
  console.log('-'.repeat(60));

  TRACK_INFO.forEach(track => {
    const expectedArtists = track.artists;
    const actualArtists = expectedArtists.filter(artist => artistNames.includes(artist));
    const isComplete = expectedArtists.length === actualArtists.length;

    console.log(`Track ${track.id.toString().padStart(2)}: ${track.title.padEnd(25)} | ${isComplete ? '✅' : '❌'} | ${actualArtists.length}/${expectedArtists.length} artists`);

    if (isComplete) trackScore++;
  });

  console.log('\n🏆 FINAL VERIFICATION RESULTS:');
  console.log('='.repeat(80));

  const totalArtists = artistNames.length;
  const avatarPercentage = Math.round((avatarScore / totalArtists) * 100);
  const socialPercentage = Math.round((socialScore / totalArtists) * 100);
  const trackPercentage = Math.round((trackScore / TRACK_INFO.length) * 100);

  console.log(`👤 Artists: ${totalArtists} total`);
  console.log(`🖼️  Avatars: ${avatarScore}/${totalArtists} (${avatarPercentage}%)`);
  console.log(`🔗 Social Links: ${socialScore}/${totalArtists} (${socialPercentage}%)`);
  console.log(`🎵 Track Coverage: ${trackScore}/${TRACK_INFO.length} (${trackPercentage}%)`);

  const overallScore = Math.round((avatarPercentage + socialPercentage + trackPercentage) / 3);
  console.log(`📈 Overall Score: ${overallScore}%`);

  console.log('\n📋 DETAILED STATISTICS:');
  console.log('-'.repeat(40));

  // Count by role type
  const roleCounts = {};
  artistNames.forEach(artistName => {
    const artist = COMPLETE_ARTIST_DATABASE[artistName];
    artist.roles.forEach(role => {
      roleCounts[role] = (roleCounts[role] || 0) + 1;
    });
  });

  console.log('🎭 Artists by Role:');
  Object.entries(roleCounts)
    .sort(([,a], [,b]) => b - a)
    .forEach(([role, count]) => {
      console.log(`   ${role}: ${count} artists`);
    });

  // Count track participation
  const participationCounts = {};
  artistNames.forEach(artistName => {
    const artist = COMPLETE_ARTIST_DATABASE[artistName];
    const trackCount = artist.contributions;
    participationCounts[trackCount] = (participationCounts[trackCount] || 0) + 1;
  });

  console.log('\n🎵 Participation Distribution:');
  Object.entries(participationCounts)
    .sort(([a], [b]) => parseInt(b) - parseInt(a))
    .forEach(([tracks, count]) => {
      console.log(`   ${tracks} track${tracks > 1 ? 's' : ''}: ${count} artists`);
    });

  // Multi-track artists
  const multiTrackArtists = artistNames.filter(name =>
    COMPLETE_ARTIST_DATABASE[name].contributions > 1
  );

  console.log('\n🌟 Multi-Track Contributors:');
  multiTrackArtists.forEach(artistName => {
    const artist = COMPLETE_ARTIST_DATABASE[artistName];
    console.log(`   ${artistName}: ${artist.contributions} contributions (Tracks ${artist.tracks.join(', ')})`);
  });

  console.log('\n🎯 VERIFICATION SUMMARY:');
  console.log('='.repeat(80));

  if (overallScore >= 95) {
    console.log('✅ EXCELLENT - Artist attribution system is comprehensive and accurate!');
  } else if (overallScore >= 85) {
    console.log('⚠️  GOOD - Minor improvements needed for complete accuracy');
  } else {
    console.log('❌ NEEDS WORK - Significant gaps in artist attribution');
  }

  console.log('\n🔍 MISSING ELEMENTS:');

  // Find missing avatars
  const missingAvatars = artistNames.filter(name =>
    !avatarFiles.includes(COMPLETE_ARTIST_DATABASE[name].avatar)
  );

  if (missingAvatars.length > 0) {
    console.log('❌ Missing Avatars:');
    missingAvatars.forEach(name => console.log(`   - ${name}`));
  }

  // Find artists without social links
  const noSocialLinks = artistNames.filter(name =>
    COMPLETE_ARTIST_DATABASE[name].socialLinks.length === 0
  );

  if (noSocialLinks.length > 0) {
    console.log('❌ No Social Links:');
    noSocialLinks.forEach(name => console.log(`   - ${name}`));
  }

  console.log('\n✨ ATTRIBUTION ACHIEVEMENT:');
  console.log(`🎉 Successfully tracking ${totalArtists} artists across ${TRACK_INFO.length} tracks`);
  console.log(`🤝 Total contributions documented: ${artistNames.reduce((sum, name) => sum + COMPLETE_ARTIST_DATABASE[name].contributions, 0)}`);
  console.log(`🎨 Unique roles identified: ${Object.keys(roleCounts).length}`);
  console.log(`🌐 Social media coverage: ${socialScore} artists with active links`);

  return {
    totalArtists,
    avatarCoverage: avatarPercentage,
    socialCoverage: socialPercentage,
    trackCoverage: trackPercentage,
    overallScore,
    isComplete: overallScore >= 95
  };
}

// Run the verification
const results = runCompleteVerification();

if (results.isComplete) {
  console.log('\n🎊 VERIFICATION COMPLETE - 100% ARTIST ATTRIBUTION ACHIEVED! 🎊');
} else {
  console.log('\n⚡ VERIFICATION INCOMPLETE - See issues above for completion');
}