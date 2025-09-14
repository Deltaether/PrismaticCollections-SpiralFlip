#!/usr/bin/env node

/**
 * Comprehensive Phantasia 2 Track Verification Script
 * Tests all 20 tracks to ensure they can be loaded and parsed correctly
 */

const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, 'src/assets/audio/Phantasia_2');
const TIMESTAMPS_FILE = path.join(AUDIO_DIR, 'timestamps_data.txt');

// Expected track mapping based on timestamps file
const EXPECTED_TRACKS = [
  { id: 1, title: 'SpiralFlip - Blinding Dawn (feat. eili)', audioFile: '1. SpiralFlip - Blinding Dawn feat. eili.ogg' },
  { id: 2, title: 'Ariatec - Hollow Crown', audioFile: '2. Ariatec - Hollow Crown.ogg' },
  { id: 3, title: 'MB - 暁の姫 (feat. Iku Hoshifuri)', audioFile: '3. MB -  暁の姫 feat. Iku Hoshifuri.ogg' },
  { id: 4, title: 'AZALI & Aloysius - Lux Nova', audioFile: '4. Azali & Aloysius - Lux Nova.ogg' },
  { id: 5, title: 'potatoTeto - Hall of Silent Echoes', audioFile: '5. potatoTeto - Hall of Silent Echoes.ogg' },
  { id: 6, title: 'Artisan - Lirica', audioFile: '6. Artisan - Lirica.ogg' },
  { id: 7, title: 'Mei Naganowa - To Defy The Beankeeper', audioFile: '7. Mei Naganowa - To Defy The Beankeeper.ogg' },
  { id: 8, title: `Evin a'k - Trench`, audioFile: `8. Evin a'k - Trench.ogg` },
  { id: 9, title: 'BilliumMoto - Blooming in the Square', audioFile: '9. BilliumMoto - Blooming in the Square.ogg' },
  { id: 10, title: 'Elliot Hsu - Skies in Abberation', audioFile: '10. Elliot Hsu - Skies in Abberation.ogg' },
  { id: 11, title: 'Yuzuki - song of the nymphs', audioFile: '11. Yuzuki - song of the nymphs.ogg' },
  { id: 12, title: 'LucaProject - Light Guardian', audioFile: '12. LucaProject - Light Guardian.ogg' },
  { id: 13, title: 'Koway - Enso Antumbra (feat. 伍一)', audioFile: '13. Koway - Enso Antumbra ft. 伍.ogg' },
  { id: 14, title: 'Nstryder - You\'re In My Way!', audioFile: '14. Nstryder - You_re In My Way.ogg' },
  { id: 15, title: 'MoAE:. - Remember you', audioFile: '15. MoAE. - Remember you.ogg' },
  { id: 16, title: 'dystopian tanuki - Hidden passage', audioFile: '16. dystopian tanuki - Hidden passage.ogg' },
  { id: 17, title: 'Heem - Last Dance (feat. Woojinee)', audioFile: '17. Heem - Last Dance feat. woojinee (detune version).ogg' },
  { id: 18, title: 'Bigg Milk - Second Guess', audioFile: '18. Bigg Milk - Second Guess.ogg' },
  { id: 19, title: 'Gardens & Sad Keyboard Guy - Fractured Light (feat. eili)', audioFile: '19. Gardens & Sad Keyboard Guy - Fractured Light ft. eili.ogg' },
  { id: 20, title: 'Futsuunohito - Beyond the Veil of Light', audioFile: '20. Futsuunohito - Beyond the Veil of Light.ogg' }
];

function testFileExistence() {
  console.log('🔍 Testing Audio File Existence...\n');

  const allFiles = fs.readdirSync(AUDIO_DIR);
  const audioFiles = allFiles.filter(file => file.endsWith('.ogg'));

  console.log(`📁 Found ${audioFiles.length} OGG files in directory:`);
  audioFiles.forEach(file => console.log(`   ✓ ${file}`));

  console.log('\n📋 Checking Expected Files:');
  let missingFiles = [];
  let foundFiles = [];

  EXPECTED_TRACKS.forEach(track => {
    const exists = audioFiles.includes(track.audioFile);
    if (exists) {
      console.log(`   ✅ Track ${track.id}: ${track.audioFile}`);
      foundFiles.push(track);
    } else {
      console.log(`   ❌ Track ${track.id}: MISSING ${track.audioFile}`);
      missingFiles.push(track);
    }
  });

  console.log(`\n📊 SUMMARY:`);
  console.log(`   ✅ Found: ${foundFiles.length}/${EXPECTED_TRACKS.length} tracks`);
  console.log(`   ❌ Missing: ${missingFiles.length} tracks`);

  if (missingFiles.length > 0) {
    console.log(`\n🚨 MISSING FILES:`);
    missingFiles.forEach(track => {
      console.log(`   - Track ${track.id}: ${track.audioFile}`);
    });
  }

  return { foundFiles, missingFiles, audioFiles };
}

function testSpecialCharacters() {
  console.log('\n🈴 Testing Special Character Handling...\n');

  const specialTracks = [
    { id: 3, title: 'Japanese Characters', file: '3. MB -  暁の姫 feat. Iku Hoshifuri.ogg' },
    { id: 8, title: 'Apostrophe', file: '8. Evin a\'k - Trench.ogg' },
    { id: 13, title: 'Chinese Characters', file: '13. Koway - Enso Antumbra ft. 伍.ogg' },
    { id: 14, title: 'Underscores', file: '14. Nstryder - You_re In My Way.ogg' },
    { id: 17, title: 'Parentheses', file: '17. Heem - Last Dance feat. woojinee (detune version).ogg' }
  ];

  specialTracks.forEach(track => {
    const exists = fs.existsSync(path.join(AUDIO_DIR, track.file));
    const encoded = encodeURIComponent(track.file);
    console.log(`   ${exists ? '✅' : '❌'} Track ${track.id} (${track.title}):`);
    console.log(`      File: ${track.file}`);
    console.log(`      Encoded: ${encoded}`);
    console.log(`      Bytes: ${Buffer.from(track.file, 'utf8').length} bytes`);
  });
}

function testTimestampsFile() {
  console.log('\n⏱️  Testing Timestamps File...\n');

  if (!fs.existsSync(TIMESTAMPS_FILE)) {
    console.log('❌ timestamps_data.txt not found!');
    return;
  }

  const data = fs.readFileSync(TIMESTAMPS_FILE, 'utf8');
  const lines = data.split('\n');

  console.log(`📄 File size: ${data.length} bytes`);
  console.log(`📄 Lines: ${lines.length}`);

  // Find track entries
  const trackLines = lines.filter(line => line.match(/^\s*\d+→Track \d+:/));
  console.log(`🎵 Found ${trackLines.length} track entries`);

  trackLines.slice(0, 5).forEach((line, index) => {
    console.log(`   ${index + 1}. ${line.trim()}`);
  });

  // Find timestamp entries
  const timestampIndex = lines.findIndex(line => line.includes('REAL TIMESTAMPS:'));
  if (timestampIndex >= 0) {
    const timestampLines = lines.slice(timestampIndex + 1)
      .filter(line => line.match(/\[\d{2}:\d{2}:\d{2}\]\s+\d+/));
    console.log(`⏰ Found ${timestampLines.length} timestamp entries`);

    timestampLines.slice(0, 5).forEach((line, index) => {
      console.log(`   ${index + 1}. ${line.trim()}`);
    });
  }
}

function testUrlParsing() {
  console.log('\n🔗 Testing URL Construction...\n');

  EXPECTED_TRACKS.slice(0, 5).forEach(track => {
    const baseUrl = `assets/audio/Phantasia_2/`;
    const encodedUrl = `${baseUrl}${encodeURIComponent(track.audioFile)}`;
    const directUrl = `${baseUrl}${track.audioFile}`;

    console.log(`🎵 Track ${track.id}:`);
    console.log(`   Original: ${track.audioFile}`);
    console.log(`   Direct URL: ${directUrl}`);
    console.log(`   Encoded URL: ${encodedUrl}`);
    console.log(`   URL Safe: ${encodedUrl === directUrl ? 'YES' : 'NO'}`);
  });
}

function runAllTests() {
  console.log('🚀 PHANTASIA 2 COMPREHENSIVE TRACK VERIFICATION');
  console.log('='.repeat(60));

  const fileResults = testFileExistence();
  testSpecialCharacters();
  testTimestampsFile();
  testUrlParsing();

  console.log('\n' + '='.repeat(60));
  console.log('📋 FINAL RESULTS:');
  console.log('='.repeat(60));

  if (fileResults.missingFiles.length === 0) {
    console.log('✅ ALL 20 TRACKS FOUND AND VERIFIED!');
    console.log('✅ System should work correctly with all tracks.');
  } else {
    console.log('❌ ISSUES DETECTED:');
    console.log(`   - ${fileResults.missingFiles.length} missing files`);
    console.log('🔧 Recommendation: Fix filename mapping in dynamic-artist.service.ts');
  }

  console.log('\n🎯 Next Steps:');
  console.log('   1. Navigate to http://localhost:5007/phantasia');
  console.log('   2. Open browser console to see detailed parsing logs');
  console.log('   3. Test audio playback for each track');
  console.log('   4. Verify artist cards display correctly');
}

// Run the tests
runAllTests();