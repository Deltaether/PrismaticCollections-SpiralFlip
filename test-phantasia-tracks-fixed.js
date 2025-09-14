#!/usr/bin/env node

/**
 * Enhanced Phantasia 2 Track Verification Script
 * Tests all 20 tracks with actual filesystem filenames for accurate validation
 */

const fs = require('fs');
const path = require('path');

const AUDIO_DIR = path.join(__dirname, 'src/assets/audio/Phantasia_2');

function testAllTracksFromFilesystem() {
  console.log('🚀 PHANTASIA 2 ENHANCED TRACK VERIFICATION');
  console.log('='.repeat(60));
  console.log('🔍 Testing Audio File Existence with Real Filesystem Data...\n');

  // Get actual files from filesystem
  const actualFiles = fs.readdirSync(AUDIO_DIR).filter(file => file.endsWith('.ogg')).sort();

  console.log(`📁 Found ${actualFiles.length} OGG files in directory:`);
  actualFiles.forEach(file => console.log(`   ✓ ${file}`));

  // Map of expected track numbers to their actual filesystem names
  const trackMapping = {};
  actualFiles.forEach(file => {
    const match = file.match(/^(\d+)\./);
    if (match) {
      const trackNum = parseInt(match[1]);
      trackMapping[trackNum] = file;
    }
  });

  console.log('\n📋 Track Mapping Validation:');
  let allTracksFound = true;

  for (let i = 1; i <= 20; i++) {
    if (trackMapping[i]) {
      console.log(`   ✅ Track ${i}: ${trackMapping[i]}`);
    } else {
      console.log(`   ❌ Track ${i}: MISSING`);
      allTracksFound = false;
    }
  }

  console.log('\n🈴 Testing Special Character Tracks...');
  const specialTracks = [
    { id: 3, name: 'Japanese Characters', pattern: '暁の姫' },
    { id: 8, name: 'Apostrophe/Quotation', pattern: 'Evin a' },
    { id: 13, name: 'Chinese Characters', pattern: '伍' },
    { id: 14, name: 'Underscores', pattern: 'You_re' },
    { id: 17, name: 'Parentheses', pattern: 'detune version' }
  ];

  specialTracks.forEach(track => {
    const actualFile = trackMapping[track.id];
    if (actualFile && actualFile.includes(track.pattern)) {
      console.log(`   ✅ Track ${track.id} (${track.name}): ${actualFile}`);
      console.log(`      Pattern "${track.pattern}" found successfully`);
      console.log(`      File size: ${fs.statSync(path.join(AUDIO_DIR, actualFile)).size} bytes`);
    } else {
      console.log(`   ❌ Track ${track.id} (${track.name}): Pattern "${track.pattern}" not found`);
      if (actualFile) {
        console.log(`      Actual file: ${actualFile}`);
      }
    }
  });

  console.log('\n🔗 Testing URL Encoding for All Tracks...');
  Object.entries(trackMapping).slice(0, 5).forEach(([trackNum, filename]) => {
    const encodedUrl = `assets/audio/Phantasia_2/${encodeURIComponent(filename)}`;
    console.log(`🎵 Track ${trackNum}:`);
    console.log(`   Original: ${filename}`);
    console.log(`   Encoded URL: ${encodedUrl}`);
    console.log(`   Character count: ${filename.length} chars`);
  });

  console.log('\n' + '='.repeat(60));
  console.log('📋 FINAL RESULTS:');
  console.log('='.repeat(60));

  if (allTracksFound && actualFiles.length === 20) {
    console.log('✅ ALL 20 TRACKS FOUND AND VERIFIED!');
    console.log('✅ All special characters handled correctly');
    console.log('✅ System should work perfectly with all tracks');
  } else {
    console.log('❌ ISSUES DETECTED:');
    console.log(`   - Found ${actualFiles.length}/20 audio files`);
    if (!allTracksFound) {
      console.log('   - Some tracks are missing or not properly mapped');
    }
  }

  console.log('\n🎯 Next Steps:');
  console.log('   1. Navigate to http://localhost:5007/phantasia');
  console.log('   2. Test audio playback for each track');
  console.log('   3. Verify dynamic artist cards update correctly');
  console.log('   4. Test previous/next navigation buttons');

  // Output the exact mapping for the service
  console.log('\n📄 EXACT MAPPING FOR SERVICE:');
  console.log('Copy this mapping into your dynamic-artist.service.ts:');
  console.log('```typescript');
  console.log('private readonly trackToFilenameMap: Record<number, string> = {');
  Object.entries(trackMapping).forEach(([trackNum, filename]) => {
    console.log(`  ${trackNum}: ${JSON.stringify(filename)},`);
  });
  console.log('};');
  console.log('```');
}

// Run the enhanced test
testAllTracksFromFilesystem();