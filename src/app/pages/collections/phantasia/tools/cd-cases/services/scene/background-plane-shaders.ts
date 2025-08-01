// Background plane shaders
// 【✓】 Import our new ley lines shader function
import { leyLinesShaderFunction } from '../../services/effects/ley-lines.effect';

export const vertexShader = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const fragmentShader = `
  uniform float time;
  uniform vec2 resolution;
  uniform vec3 primaryGold;
  uniform vec3 secondaryGold;
  uniform vec3 accentColor;
  uniform vec3 deepColor;
  uniform vec3 highlightColor;
  uniform sampler2D videoTexture;
  
  // Effect toggle uniforms
  uniform float enableContinents;
  uniform float enableMountains;
  uniform float enableWaves;
  uniform float enableBorders;
  uniform float enableSwirls;
  uniform float enableLightRays;
  uniform float enableParticles;
  uniform float enableVideoInfluence;
  uniform float enableBloom;
  uniform float enableFilmGrain;
  uniform float enableVignette;
  
  // 【✓】 New ley lines effect uniforms
  uniform float leyLinesIntensity;
  uniform float leyLinesSpeed;
  uniform float leyLinesDensity;
  uniform vec3 leyLinesColor;
  
  varying vec2 vUv;

  // Ocean colors - different shades of blue and white for highlights
  const vec3 deepOceanColor = vec3(0.0, 0.01, 0.04); // Even darker deep blue
  const vec3 midOceanColor = vec3(0.0, 0.05, 0.15);  // Darker medium blue
  const vec3 shallowOceanColor = vec3(0.03, 0.09, 0.2); // Darker light blue
  const vec3 waveHighlightColor = vec3(0.5, 0.7, 0.9); // More intense blue-tinted white
  const vec3 foamColor = vec3(1.0, 1.0, 1.0);        // Pure white for foam
  const vec3 specularHighlight = vec3(0.9, 0.95, 1.0); // Bright specular highlight for water reflection

  // Hash function for pseudo-random values
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  // Improved noise function for organic patterns
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Smooth interpolation
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  // Fractal Brownian Motion for richer texture
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    
    for(int i = 0; i < 6; i++) {
      sum += noise(p * freq) * amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    
    return sum;
  }
  
  // Domain warping for more interesting patterns
  vec2 warp(vec2 p) {
      float d1 = fbm(p + time * 0.1);
      float d2 = fbm(p - time * 0.15);
      return p + vec2(d1, d2) * 0.3;
  }
  
  // Enhanced domain warping for continent-like shapes
  vec2 continentWarp(vec2 p) {
      // Multiple layers of warping for more natural, organic terrain shapes
      vec2 q = vec2(
          fbm(p + vec2(0.0, 0.1) + time * 0.05),
          fbm(p + vec2(0.2, 0.3) - time * 0.03)
      );
      
      vec2 r = vec2(
          fbm(p + 2.0 * q + vec2(1.7, 9.2) + time * 0.02),
          fbm(p + 2.0 * q + vec2(8.3, 2.8) - time * 0.01)
      );
      
      // Final warped coordinates
      return p + 0.5 * r;
  }
  
  // Height map for terrain elevation
  float terrainHeight(vec2 p) {
      vec2 warped = continentWarp(p * 0.5);
      float height = fbm(warped * 2.0);
      
      // Add ridges for mountain ranges
      float ridges = 1.0 - abs(0.5 - fbm(warped * 4.0)) * 2.0;
      ridges = ridges * ridges * 0.7;
      
      // Combine for final height map
      return smoothstep(0.2, 0.75, height) + ridges * 0.3;
  }
  
  // Create fantasy continent shapes
  float continentShape(vec2 uv) {
      // Scale to create larger continent forms
      vec2 scaled = uv * 1.5;
      
      // Create main landmass shape
      float terrain = terrainHeight(scaled);
      
      // Erode the edges for coastlines
      float coast = smoothstep(0.4, 0.45, terrain);
      
      // Add inner terrain details
      float details = fbm(continentWarp(scaled * 3.0)) * coast;
      
      return coast + details * 0.2;
  }
  
  // Enhanced wave pattern for more realistic ocean waves
  float wavePattern(vec2 uv, float scale, float speed) {
    // Reduce the speed for slower wave movement
    float adjustedSpeed = speed * 0.4; // 40% slower
    float t = time * adjustedSpeed;
    
    // Use domain warping for more organic wave shapes - emphasize horizontal warping for ocean waves
    vec2 warpedUV = warp(uv);
    warpedUV.x += sin(warpedUV.y * 2.5) * 0.03; // Add horizontal displacement based on vertical position
    
    // Create smaller, more natural wave patterns
    float wavePattern = 0.0;
    
    // Create directional waves that move primarily in one direction (like ocean swells)
    float directionalWaves = 0.0;
    for (int i = 0; i < 3; i++) {
      float waveHeight = 0.02 + 0.01 * float(i);
      float waveFreq = 10.0 + float(i) * 5.0;
      float waveSpeed = t * (0.1 + 0.05 * float(i));
      
      // Create horizontal wave lines with subtle variations
      float wave = sin(warpedUV.y * waveFreq + waveSpeed + sin(warpedUV.x * 2.0) * 0.8);
      directionalWaves += smoothstep(0.7, 0.99, wave) * waveHeight;
    }
    
    // Add subtle cross currents (smaller perpendicular waves)
    float crossCurrents = 0.0;
    for (int i = 0; i < 2; i++) {
      float waveHeight = 0.01 + 0.005 * float(i);
      float waveFreq = 8.0 + float(i) * 4.0;
      float waveSpeed = t * (0.05 + 0.03 * float(i));
      
      // Create vertical wave lines with subtle variations
      float wave = sin(warpedUV.x * waveFreq + waveSpeed + sin(warpedUV.y * 1.5) * 0.5);
      crossCurrents += smoothstep(0.8, 0.99, wave) * waveHeight;
    }
    
    // Create focused wave crests between continent areas
    // Use detection of nearby continent edges to amplify wave intensity
    float continentProximity = fbm(warpedUV * 1.5) * 0.2; // Low-frequency noise for general ocean areas
    
    // Create elongated waves that follow contours between continents
    float elongatedWaves = 0.0;
    for (int i = 0; i < 4; i++) {
      float yOffset = float(i) * 0.2;
      float xOffset = sin(time * 0.03 + yOffset * 3.0) * 0.1;
      
      // Create thin, elongated horizontal wave lines (whitecaps)
      float waveSize = 0.003 + 0.002 * sin(time * 0.1 + float(i));
      float waveLine = smoothstep(waveSize, 0.0, abs(fract(warpedUV.y * 2.0 + yOffset + time * 0.03) - 0.5));
      
      // Distort the wave line based on horizontal position
      waveLine *= 0.7 + 0.3 * sin(warpedUV.x * 8.0 + time * 0.02);
      
      elongatedWaves += waveLine * 0.15;
    }
    
    // Add some detailed ripples and small waves
    float ripples = 0.0;
    for (int i = 0; i < 3; i++) {
      vec2 rippleCenter = vec2(
        0.5 + 0.3 * sin(time * 0.01 + float(i)),
        0.5 + 0.3 * cos(time * 0.015 + float(i) * 1.5)
      );
      
      float dist = length(warpedUV - rippleCenter);
      float ripplePattern = sin(dist * (20.0 + float(i) * 5.0) - time * 0.1);
      
      // Fade out ripples with distance from center
      ripples += smoothstep(0.0, 0.7, ripplePattern) * smoothstep(0.5, 0.1, dist) * 0.1;
    }
    
    // Add subtle noise detail for water surface texture
    float surfaceDetail = fbm(warpedUV * 10.0 + vec2(t * 0.1, 0.0)) * 0.03;
    
    // Create specific foam for wave crests
    float foam = 0.0;
    for (int i = 0; i < 4; i++) { // Added one more foam line
      // Create horizontal wave lines that move slowly
      float yPos = 0.2 + float(i) * 0.25;
      float xOffset = sin(time * 0.04 + yPos * 2.0) * 0.1;
      
      // Create thin foam lines with varying width
      float foamWidth = 0.002 + 0.001 * sin(time * 0.07 + float(i));
      float foamLine = smoothstep(foamWidth, 0.0, abs(fract(warpedUV.y * 1.5 + yPos + time * 0.02) - 0.5));
      
      // Add curvature and variation to foam lines
      foamLine *= 0.8 + 0.2 * sin(warpedUV.x * 10.0 + time * 0.05 + float(i));
      
      foam += foamLine * 0.25; // Increased foam intensity
    }
    
    // Add specular highlights (water reflections)
    float specular = 0.0;
    for (int i = 0; i < 3; i++) {
      // Create moving light reflections on water surface
      vec2 specCenter = vec2(
        0.3 + 0.4 * sin(time * 0.03 + float(i) * 2.1),
        0.4 + 0.3 * cos(time * 0.04 + float(i) * 1.7)
      );
      
      float specDist = length(warpedUV - specCenter);
      
      // Create sharp, directional highlights
      float specStrength = 0.008 + 0.004 * sin(time * 0.2 + float(i));
      float specShape = smoothstep(specStrength, 0.0, specDist - 0.1 * sin(time * 0.1 + warpedUV.x * 5.0));
      
      // Add directional stretching to simulate light reflection on waves
      specShape *= smoothstep(0.1, 0.0, abs(sin(warpedUV.y * 20.0 + time * 0.5) - 0.5));
      
      specular += specShape * 0.15;
    }
    
    // Combine all patterns with different weights
    float finalPattern = 
      directionalWaves * 0.4 +
      crossCurrents * 0.15 +
      elongatedWaves * 0.7 +
      ripples * 0.3 +
      surfaceDetail +
      foam * 1.1 + // Enhance foam prominence
      specular * 1.5; // Add strong specular highlights
    
    // Normalize to keep values in expected range
    return clamp(finalPattern, 0.0, 1.0);
  }
  
  // Calculate ley lines energy paths
  // 【✓】 Original implementation replaced with imported one from ley-lines.effect.ts
  ${leyLinesShaderFunction}
  
  // Create soft gradient swirls
  float swirl(vec2 uv, vec2 center, float radius, float intensity) {
    vec2 toCenter = uv - center;
    float dist = length(toCenter);
    
    // Enhanced angular distortion with multiple frequencies
    float angle = atan(toCenter.y, toCenter.x);
    float timeFactor = time * 0.15;
    
    // Create a more complex swirl pattern with multiple layers
    float twist = dist * intensity;
    float timeVariation = sin(timeFactor) * 0.5 + 0.5;
    
    // Dynamic swirl pattern with rotating core
    float swirl1 = sin(angle * 4.0 + twist + timeFactor);
    float swirl2 = cos(angle * 3.0 - twist * 1.5 + timeFactor * 0.7);
    float swirl3 = sin(angle * 7.0 + twist * 0.8 - timeFactor * 1.2);
    
    // Combine swirl layers with different weights
    float combinedSwirl = swirl1 * 0.5 + swirl2 * 0.3 + swirl3 * 0.2;
    
    // Enhanced radial gradient with soft edges
    float fade = 1.0 - smoothstep(radius * 0.7, radius * 1.1, dist);
    float innerGlow = smoothstep(0.0, radius * 0.3, dist) * fade;
    
    // Add subtle pulsing effect
    float pulse = 0.85 + 0.15 * sin(time * 0.3 + dist * 5.0);
    
    return innerGlow * (0.6 + 0.4 * combinedSwirl) * pulse;
  }
  
  // Create floating particles effect
  float particles(vec2 uv) {
    float result = 0.0;
    
    // Create multiple particle layers
    for (int i = 0; i < 3; i++) {
      float speed = 0.1 + float(i) * 0.05;
      float scale = 100.0 + float(i) * 50.0;
      float timeOffset = time * speed + float(i) * 10.0;
      
      // Create particle grid and animate
      vec2 gridUV = uv * scale;
      vec2 gridPos = floor(gridUV);
      
      // Unique random properties for each particle
      float random = hash(gridPos);
      float size = 0.3 + 0.7 * hash(gridPos + 1.2);
      float particleTime = timeOffset * (0.5 + 0.5 * random);
      
      // Particle movement path
      vec2 center = gridPos + 0.5;
      center.x += 0.3 * sin(particleTime * 0.7 + random * 6.28);
      center.y += 0.3 * cos(particleTime * 0.5 + random * 6.28);
      
      // Particle glow
      float dist = length(gridUV - center);
      float glow = size * 0.5 * (0.1 / (dist + 0.01));
      
      // Fade particles in and out
      float fade = 0.5 + 0.5 * sin(particleTime);
      glow *= fade;
      
      result += glow;
    }
    
    return smoothstep(0.0, 1.0, result * 0.25); // Normalize and smooth
  }
  
  // Sample video with blur and offset
  vec4 sampleVideoBlurred(vec2 uv, float blurAmount, vec2 offset) {
    // Apply offset and scaling to create interesting sampling area
    vec2 videoUV = uv * 0.8 + 0.1 + offset;
    
    // Multi-sample blur
    vec4 blurredColor = vec4(0.0);
    float total = 0.0;
    
    // 9-tap gaussian-like blur
    for(float x = -2.0; x <= 2.0; x += 1.0) {
      for(float y = -2.0; y <= 2.0; y += 1.0) {
        float weight = 1.0 - length(vec2(x, y)) / 3.0;
        if(weight > 0.0) {
          vec2 sampleUV = videoUV + vec2(x, y) * blurAmount / resolution;
          blurredColor += texture2D(videoTexture, sampleUV) * weight;
          total += weight;
        }
      }
    }
    
    return blurredColor / total;
  }

  void main() {
    // Base coordinates
    vec2 uv = vUv;
    
    // Sample video for reactive elements
    vec4 blurredVideo1 = sampleVideoBlurred(uv, 0.1, vec2(sin(time * 0.2) * 0.05, cos(time * 0.15) * 0.05));
    vec4 blurredVideo2 = sampleVideoBlurred(uv + 0.2, 0.15, vec2(cos(time * 0.15) * 0.05, sin(time * 0.25) * 0.05));
    
    // Extract luminance and motion from video
    float vidLuma1 = dot(blurredVideo1.rgb, vec3(0.2126, 0.7152, 0.0722));
    float vidLuma2 = dot(blurredVideo2.rgb, vec3(0.2126, 0.7152, 0.0722));
    float videoMotion = abs(vidLuma1 - vidLuma2) * 3.0; // Motion detection
    
    // Generate continent shapes with toggle
    float continent = enableContinents > 0.5 ? continentShape(uv) : 0.0;
    
    // Get distance to nearest continent edge for wave intensity
    float continentEdge = abs(continent - 0.5) * 2.0;
    float distToCoast = 1.0 - smoothstep(0.0, 0.2, continentEdge);
    
    // Create subtle rotating and flowing terrain details
    vec2 rotatedUV = vec2(
      uv.x * cos(time * 0.02) - uv.y * sin(time * 0.02),
      uv.x * sin(time * 0.02) + uv.y * cos(time * 0.02)
    );
    float terrainDetail = fbm(continentWarp(rotatedUV * 5.0));
    
    // Create mountain ridges and terrain variations with toggle
    float mountains = enableMountains > 0.5 ? terrainHeight(uv * 3.0 + time * 0.01) * continent : 0.0;
    
    // Base wave pattern for water/oceans with toggle
    float waveIntensity = 0.03 + 0.1 * videoMotion + 0.15 * distToCoast; // Waves intensify near shores
    float waves = enableWaves > 0.5 ? wavePattern(uv, 3.0, waveIntensity) * (1.0 - continent) : 0.0;
    
    // Extract foam pattern - more pronounced near continent edges
    float foam = waves * distToCoast * 2.0; // Amplify foam near coasts
    
    // Create depth variations in the ocean - deeper areas further from land
    float oceanDepth = smoothstep(0.0, 0.5, 1.0 - distToCoast) * (1.0 - continent);
    
    // Add subtle current patterns in deeper areas
    float deepCurrents = fbm(warp(uv) * 2.0 + time * 0.003) * oceanDepth * 0.5;
    
    // Create subtle "kingdom borders" or territory lines with toggle
    float borders = 0.0;
    if (enableBorders > 0.5) {
      vec2 borderUV = continentWarp(uv * 2.0);
      // Cellular-like patterns for territory divisions
      float cellValue = fract(sin(borderUV.x * 12.0) * 43758.5453 + cos(borderUV.y * 13.0) * 93728.3462);
      float territoryEdge = smoothstep(0.02, 0.0, abs(fract(cellValue * 3.0) - 0.5) - 0.2) * 0.4;
      // Only show borders on land
      borders = territoryEdge * continent;
    }
    
    // Create layered swirls for magical elements with toggle
    float swirlPattern = 0.0;
    if (enableSwirls > 0.5) {
      // More distributed and varied swirl centers
      swirlPattern += swirl(uv, vec2(0.25, 0.35), 0.55, 2.5) * 0.35;
      swirlPattern += swirl(uv, vec2(0.75, 0.65), 0.65, 3.0) * 0.3;
      swirlPattern += swirl(uv, vec2(0.5, 0.15), 0.45, 2.2) * 0.25;
      swirlPattern += swirl(uv, vec2(0.15, 0.8), 0.4, 3.5) * 0.2;
      
      // Add subtle interaction with video motion
      if (enableVideoInfluence > 0.5) {
        swirlPattern *= 1.0 + videoMotion * 0.25;
      }
      
      // Enhance with terrain interaction
      swirlPattern *= 1.0 + terrainDetail * 0.2;
    }
    
    // Add ley line effects with toggle - MODIFIED: Updated to use new implementation
    float leyLineEffect = enableLightRays > 0.5 ? 
      leyLines(
        uv, 
        leyLinesDensity > 0.0 ? leyLinesDensity : 15.0, 
        leyLinesSpeed > 0.0 ? leyLinesSpeed : 0.3
      ) * (leyLinesIntensity > 0.0 ? leyLinesIntensity : 0.7) : 0.0;
    
    // Add subtle particles for magical dust with toggle
    float particleEffect = enableParticles > 0.5 ? particles(uv) * (0.5 + continent * 0.5) : 0.0;
    
    // Soft vignette with toggle
    float vignette = enableVignette > 0.5 ? smoothstep(0.0, 0.7, 1.0 - length((uv - 0.5) * 1.3)) : 1.0;
    
    // Start with deep ocean color
    vec3 baseColor = deepOceanColor;
    
    // Layer visual elements for fantasy map appearance
    // Ocean water with depth variations and waves
    baseColor = mix(deepOceanColor, midOceanColor, oceanDepth);
    
    // Add deep ocean currents
    baseColor = mix(baseColor, midOceanColor * 1.2, deepCurrents);
    
    // Add wave effects to shallow areas
    baseColor = mix(baseColor, shallowOceanColor, waves * 0.6 * (1.0 - oceanDepth));
    
    // Add stronger highlight near shores
    baseColor = mix(baseColor, shallowOceanColor * 1.3, distToCoast * waves * 0.5);
    
    // White foam highlights on wave crests - stronger near shores
    baseColor = mix(baseColor, waveHighlightColor, foam * foam * 1.3); // Enhanced foam
    baseColor = mix(baseColor, foamColor, foam * foam * foam * 1.2); // Enhanced white foam
    
    // Add specular reflections for water surface (moonlight/sunlight reflections)
    float specularReflection = waves * 1.2;
    baseColor = mix(baseColor, specularHighlight, specularReflection * specularReflection * 0.3);
    
    // Land areas
    baseColor = mix(baseColor, mix(secondaryGold, accentColor, terrainDetail), continent * 0.8);
    
    // Mountains and elevated terrain
    baseColor = mix(baseColor, highlightColor * 0.9, mountains * 0.6);
    
    // Kingdom/territory borders
    baseColor = mix(baseColor, highlightColor, borders);
    
    // Magical elements
    baseColor = mix(baseColor, mix(accentColor, highlightColor, 0.6 + 0.4 * sin(time * 0.2)), swirlPattern * 0.4);
    
    // Use custom color for ley lines with a stronger glow effect
    vec3 customLeyLineColor = vec3(0.7, 0.9, 1.0); // Default color
    if (leyLinesColor.r > 0.0 || leyLinesColor.g > 0.0 || leyLinesColor.b > 0.0) {
      customLeyLineColor = leyLinesColor;
    }
    
    // Add a subtle bloom effect to the ley lines
    float leyLineBloom = leyLineEffect * 0.1;
    baseColor = mix(baseColor, customLeyLineColor, leyLineEffect * 0.3);
    baseColor += leyLineBloom * customLeyLineColor * 0.7;
    
    // Add subtle particles for magical dust with toggle
    baseColor = mix(baseColor, vec3(0.9, 0.9, 1.0), particleEffect * 0.4);
    
    // Add subtle video influence for magical shimmer with toggle
    if (enableVideoInfluence > 0.5) {
      vec3 videoColor = blurredVideo1.rgb;
      float videoInfluence = videoMotion * 0.15;
      baseColor = mix(baseColor, videoColor * vec3(1.2, 1.1, 0.8), videoInfluence * continent);
    }
    
    // Add subtle bloom to bright areas with toggle
    if (enableBloom > 0.5) {
      float luminance = dot(baseColor, vec3(0.2126, 0.7152, 0.0722));
      float bloom = smoothstep(0.7, 0.9, luminance);
      baseColor += bloom * highlightColor * 0.3;
      
      // Add enhanced bloom to wave crests and specular reflections
      baseColor += foam * foam * waveHighlightColor * 0.3;
      baseColor += waves * waves * specularHighlight * 0.15; // Add bloom to water reflections
    }
    
    // Apply gentle film grain with toggle
    if (enableFilmGrain > 0.5) {
      float grain = hash(uv + time) * 0.03;
      baseColor = mix(baseColor, vec3(0.0, 0.0, 0.03), grain); // Even darker blue grain for water
    }
    
    // Final vignette
    baseColor *= vignette;
    
    gl_FragColor = vec4(baseColor, 1.0);
  }
`; 