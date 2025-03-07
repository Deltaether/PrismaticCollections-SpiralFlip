// Background plane shaders
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
  
  varying vec2 vUv;

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
    // Use domain warping for more organic wave shapes
    vec2 warpedUV = warp(uv);
    float t = time * speed;
    
    // Create circular/concentric wave patterns that expand outward
    float concentricWaves = 0.0;
    for (int i = 0; i < 3; i++) {
      // Create multiple wave centers with offsets
      vec2 waveCenter = vec2(
        0.5 + 0.3 * sin(time * 0.1 + float(i) * 2.1),
        0.5 + 0.3 * cos(time * 0.15 + float(i) * 1.7)
      );
      
      // Distance from center creates circular patterns
      float dist = length(warpedUV - waveCenter) * (2.0 + float(i) * 0.5);
      
      // Create rippling circles
      float rings = 0.5 + 0.5 * sin(dist * scale - t * (0.5 + float(i) * 0.2));
      
      // Apply falloff with distance
      float falloff = smoothstep(1.0, 0.2, length(warpedUV - waveCenter) * 2.0);
      
      concentricWaves += rings * falloff * (0.5 - float(i) * 0.1);
    }
    
    // Add swirling vortex patterns
    float vortex = 0.0;
    vec2 vortexCenter = vec2(0.7, 0.3);
    float vortexDist = length(warpedUV - vortexCenter);
    float vortexAngle = atan(warpedUV.y - vortexCenter.y, warpedUV.x - vortexCenter.x);
    vortex = 0.5 + 0.5 * sin(vortexAngle * 5.0 + vortexDist * 10.0 - t * 1.5);
    vortex = smoothstep(0.0, 0.7, vortex) * smoothstep(0.8, 0.0, vortexDist);
    
    // Create cross-hatched wave lines
    float waveLinesX = 0.5 + 0.5 * sin(warpedUV.x * scale * 2.0 + t);
    float waveLinesY = 0.5 + 0.5 * sin(warpedUV.y * scale * 2.0 - t * 0.8);
    float crossLines = smoothstep(0.4, 0.6, max(waveLinesX, waveLinesY));
    
    // Create geometric wave patterns
    float geometricPattern = 0.0;
    for (int i = 0; i < 3; i++) {
      float phase = float(i) * 0.5;
      // Hex grid-like pattern
      vec2 hexUV = warpedUV * scale * (1.0 + float(i) * 0.5);
      hexUV.y *= 1.73; // Sqrt(3) for hexagonal scaling
      
      vec2 gridPos = floor(hexUV);
      vec2 gridFract = fract(hexUV);
      
      // Offset alternating rows
      if (mod(gridPos.y, 2.0) == 1.0) {
        gridFract.x = fract(gridFract.x + 0.5);
      }
      
      // Create cell patterns
      float cellPattern = length(gridFract - 0.5);
      cellPattern = smoothstep(0.3 + 0.1 * sin(time + gridPos.x * 0.3 + gridPos.y * 0.5), 
                               0.5, 
                               cellPattern);
      
      geometricPattern += cellPattern * (0.5 - float(i) * 0.15);
    }
    
    // Add some fractal noise detail
    float noiseDetail = fbm(warpedUV * scale * 0.5 + vec2(t * 0.2, t * 0.1)) * 0.3;
    
    // Combine all patterns with different weights
    float finalPattern = 
      concentricWaves * 0.4 + 
      vortex * 0.3 + 
      crossLines * 0.25 + 
      geometricPattern * 0.35 + 
      noiseDetail;
      
    // Normalize to keep values in expected range
    finalPattern = clamp(finalPattern, 0.0, 1.0);
    
    return finalPattern;
  }
  
  // Replace light rays with magical ley lines
  float leyLines(vec2 uv, float density, float speed) {
    float result = 0.0;
    
    // Create several ley line paths with different properties
    for(int i = 0; i < 5; i++) {
      float lineIndex = float(i);
      
      // Generate unique starting positions and movement directions for each node
      // These are pre-calculated based on the lineIndex to ensure consistent behavior
      vec2 startPosition = vec2(
        0.3 + lineIndex * 0.15, 
        0.3 + sin(lineIndex * 0.8) * 0.4
      );
      
      vec2 moveDirection = vec2(
        cos(lineIndex * 1.5 + 0.5) * 0.03,
        sin(lineIndex * 1.7 + 0.3) * 0.03
      );
      
      // Calculate time-based position with bouncing behavior
      // Each point has a slightly different speed multiplier
      float timeScale = 0.1 + lineIndex * 0.02;
      float bounceTime = time * timeScale;
      
      // Calculate the bounce position - start with the initial position
      vec2 bouncePos = startPosition;
      
      // Add movement based on time and direction
      bouncePos += vec2(
        sin(bounceTime) * moveDirection.x,
        cos(bounceTime * 0.7) * moveDirection.y
      ) * 5.0; // Scale the movement amount
      
      // Apply additional sinusoidal movement patterns for variety
      bouncePos += vec2(
        sin(bounceTime * 0.3 + lineIndex * 2.1) * 0.1,
        sin(bounceTime * 0.5 + lineIndex * 1.3) * 0.1
      );
      
      // Add bouncing behavior by using abs(sin) patterns with different frequencies
      // MODIFIED: Enhanced TV screensaver-like bouncing with edge detection and velocity changes
      float xBounce = 0.2 + abs(sin(bounceTime * 0.2 + lineIndex)) * 0.6;
      float yBounce = 0.2 + abs(sin(bounceTime * 0.3 + lineIndex * 0.7)) * 0.6;
      
      // Create edge-aware bouncing behavior (like old TV screensavers)
      // Detect if we're close to an "edge" and change direction
      float edgeDetectX = smoothstep(0.75, 0.8, xBounce) - smoothstep(0.2, 0.15, xBounce);
      float edgeDetectY = smoothstep(0.75, 0.8, yBounce) - smoothstep(0.2, 0.15, yBounce);
      
      // Add a slight pause at edges and momentum changes
      float momentumX = 1.0 + 0.3 * sin(bounceTime * 0.7 + lineIndex * 2.5) * edgeDetectX;
      float momentumY = 1.0 + 0.3 * sin(bounceTime * 0.5 + lineIndex * 1.9) * edgeDetectY;
      
      bouncePos = vec2(
        0.2 + abs(sin(bounceTime * 0.2 * momentumX + lineIndex)) * 0.6,
        0.2 + abs(sin(bounceTime * 0.3 * momentumY + lineIndex * 0.7)) * 0.6
      );
      
      // Get current node center from the bouncing calculation
      vec2 nodeCenter = bouncePos;
      
      // Create tornado-like curved paths using swirling patterns
      // This creates a more dynamic, spiraling effect for the ley lines
      vec2 toCenter = uv - nodeCenter;
      float distToCenter = length(toCenter);
      float angle = atan(toCenter.y, toCenter.x);
      
      // Create swirling, tornado-like pattern
      float tornadoTime = time * (0.2 + lineIndex * 0.05);
      float swirl = sin(angle * 3.0 + tornadoTime) * cos(distToCenter * 5.0 + tornadoTime * 0.7);
      float verticalTwist = sin(uv.x * 7.0 + tornadoTime) * cos(uv.y * 8.0 - tornadoTime * 0.5);
      
      // Combine original curve pattern with tornado effect
      float curve = sin(uv.x * 2.0 + time * (0.1 + lineIndex * 0.05) + lineIndex * 3.1415) * 
                    sin(uv.y * 2.0 + time * (0.15 + lineIndex * 0.03) + lineIndex * 1.5);
      
      // Mix the original curve with the new tornado pattern
      curve = mix(curve, swirl * 0.3 + verticalTwist * 0.3, 0.6);
      
      // Create turbulent eddies in the tornado ley lines
      float turbulence = fbm(uv * 4.0 + vec2(time * 0.2, time * 0.15)) * 0.1;
      
      // Distance to the curved path with turbulence
      float dist = abs(uv.y - nodeCenter.y - curve * 0.2 - turbulence) / 
                   (density * (0.05 + 0.02 * sin(time * speed + lineIndex)));
      
      // Create twisting, rope-like structure with multiple strands
      float strandCount = 3.0; // Number of energy strands in each ley line
      float strandWidth = 0.2; // How tightly packed the strands are
      float strandOffset = sin(distToCenter * 10.0 + time + angle * 5.0) * strandWidth;
      
      // Apply strand effect to distance calculation
      float strandEffect = abs(sin(dist * strandCount * 3.14159 - time * 2.0 + strandOffset)) * 0.5 + 0.5;
      strandEffect = pow(strandEffect, 0.7); // Adjust contrast of strands
      
      // Pulse effect along the ley lines
      float pulse = 0.5 + 0.5 * sin(angle * 8.0 + time * (1.0 + lineIndex * 0.2));
      
      // Intensity falloff with distance from line center
      float baseIntensity = 0.03 / (dist + 0.001);
      float strandedIntensity = baseIntensity * strandEffect * 1.2;
      
      // Combine basic intensity with stranded effect
      float intensity = mix(baseIntensity, strandedIntensity, 0.7) * pulse;
      
      // Add occasional energy bursts along the ley line
      float burst = smoothstep(0.9, 1.0, sin(dist * 20.0 - time * 3.0) * 0.5 + 0.5) * 
                    smoothstep(0.2, 0.0, dist) * 1.5;
      intensity += burst * 0.3;
      
      // Fade based on x position to create flowing energy
      float xFade = smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
      intensity *= xFade;
      
      // Create ethereal energy vortex/convergence points at intersections
      vec2 toNode = uv - nodeCenter;
      float distToNode = length(toNode);
      
      // Rest of the magical effect code remains unchanged
      float magicalEffect = 0.0;
      
      // Spiraling energy that gets denser toward the center
      float spiralAngle = atan(toNode.y, toNode.x) + time * (0.2 + lineIndex * 0.05);
      float spiral = sin(spiralAngle * 4.0 + distToNode * 30.0 - time * 2.0);
      
      // Energy ripples/waves radiating from center point - INCREASED RANGE
      float ripples = sin(distToNode * 40.0 - time * 3.0) * 0.5 + 0.5;
      ripples *= smoothstep(0.25, 0.05, distToNode); // Fade out with distance - INCREASED RANGE
      
      // Magical runes/sigils that briefly appear and fade - INCREASED SIZE
      float runePattern = 0.0;
      float runeTime = fract(time * 0.2 + lineIndex * 0.3);
      float runeOpacity = smoothstep(0.0, 0.3, runeTime) * smoothstep(1.0, 0.7, runeTime);
      
      // Continuous rotation angle for the four spikes
      float rotationSpeed = 0.3 + lineIndex * 0.1; // MODIFIED: Reduced speed from 0.7 to 0.3 and factor from 0.2 to 0.1
      float mainRotationAngle = time * rotationSpeed;
      
      // Create four rotating spikes/rays emanating from the center
      float spikes = 0.0;
      
      // Create 4 rotating spikes (cross pattern)
      for (int s = 0; s < 4; s++) {
        float spikeAngle = float(s) * 3.14159 / 2.0 + mainRotationAngle; // 90 degree spacing + rotation
        
        // Create spike direction unit vector
        vec2 spikeDir = vec2(cos(spikeAngle), sin(spikeAngle));
        
        // Project the node vector onto the spike direction
        float projection = dot(toNode, spikeDir);
        
        // Get perpendicular distance from the spike line
        vec2 projVector = spikeDir * projection;
        float perpDistance = length(toNode - projVector);
        
        // Create a tapering spike that gets thinner away from center
        float spikeThickness = 0.01 + 0.01 * smoothstep(0.2, 0.0, abs(projection));
        float spikeLength = 0.2;
        
        // Create the spike with a smooth falloff and limited length
        float spike = smoothstep(spikeThickness, 0.0, perpDistance) * smoothstep(spikeLength, spikeLength * 0.7, abs(projection));
        
        // Add some energy pulses along the spikes
        spike *= 0.7 + 0.3 * sin(abs(projection) * 30.0 - time * 5.0);
        
        spikes += spike;
      }
      
      // Apply spike opacity and size modulation
      spikes *= 0.7 + 0.3 * sin(time * 2.0 + lineIndex);
      
      // Create several abstract rune-like patterns
      for (int j = 0; j < 3; j++) {
        float patternIndex = float(j);
        float patternAngle = patternIndex * 2.1 + time * 0.1;
        
        // Create abstract sigil components - lines and curves - INCREASED SIZE
        vec2 rotated = vec2(
          toNode.x * cos(patternAngle) - toNode.y * sin(patternAngle),
          toNode.x * sin(patternAngle) + toNode.y * cos(patternAngle)
        );
        
        // Create larger line segments of the rune
        float lineSeg = smoothstep(0.007, 0.001, abs(rotated.x)) * smoothstep(0.09, 0.01, abs(rotated.y));
        lineSeg += smoothstep(0.007, 0.001, abs(rotated.y)) * smoothstep(0.09, 0.01, abs(rotated.x)); 
        
        // Create larger curved segments
        float curvedSeg = smoothstep(0.005, 0.001, abs(length(rotated * vec2(1.0, 2.0)) - 0.06));
        
        runePattern += (lineSeg + curvedSeg) * 0.3;
      }
      runePattern *= runeOpacity * smoothstep(0.15, 0.03, distToNode); // INCREASED RANGE
      
      // Small energy particles that orbit the convergence point - WIDER ORBITS
      float particles = 0.0;
      for (int k = 0; k < 5; k++) { // Added one more particle
        float particleTime = time * (0.5 + float(k) * 0.2) + lineIndex;
        vec2 orbit = vec2(
          cos(particleTime) * (0.06 + float(k) * 0.02), // LARGER ORBITS
          sin(particleTime) * (0.06 + float(k) * 0.02)  // LARGER ORBITS
        );
        
        float particleShape = smoothstep(0.008, 0.002, length(toNode - orbit));
        particles += particleShape * 0.5;
      }
      
      // Combine all the energy effects with smooth transitions
      magicalEffect = ripples * 0.4 + 
                      spiral * smoothstep(0.2, 0.02, distToNode) * 0.5 + // INCREASED RANGE
                      runePattern * 0.5 + // Reduced weight to make room for spikes
                      particles * 0.7 +
                      spikes * 0.9; // Add the rotating spikes
      
      // Scale back based on distance to create focal points - INCREASED RANGE
      magicalEffect *= smoothstep(0.25, 0.05, distToNode);
      
      // Add a subtle glow that extends much further
      float glow = smoothstep(0.45, 0.1, distToNode) * 0.3 * (0.7 + 0.3 * sin(time + lineIndex));
      magicalEffect += glow;
      
      // Trail effect - leave fading magical residue along the path
      // Calculate previous positions
      float prevTime = bounceTime - 0.3;
      vec2 prevPos = vec2(
        0.2 + abs(sin(prevTime * 0.3 + lineIndex)) * 0.6,
        0.2 + abs(sin(prevTime * 0.5 + lineIndex * 0.7)) * 0.6
      );
      
      // Distance to previous position
      float trailDist = length(uv - prevPos);
      float trail = smoothstep(0.2, 0.02, trailDist) * 0.4;
      trail *= smoothstep(0.3, 0.0, bounceTime - prevTime); // Fade out with time
      
      magicalEffect += trail;
      
      // Add flickering effect
      float flicker = 0.8 + 0.2 * sin(time * 5.0 + lineIndex * 10.0);
      
      // Apply a subtle color tint to the ley lines
      vec3 leyLineColor = vec3(0.4, 0.8, 1.0); // Slight blue tint
      float colorIntensity = intensity * flicker * 0.8;
      
      // Combine the ley line with the energy convergence, using color for the ley lines
      result += colorIntensity + magicalEffect;
    }
    
    return min(result, 1.0) * 0.6; // Cap and scale the effect
  }
  
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
    
    // Create subtle rotating and flowing terrain details
    vec2 rotatedUV = vec2(
      uv.x * cos(time * 0.02) - uv.y * sin(time * 0.02),
      uv.x * sin(time * 0.02) + uv.y * cos(time * 0.02)
    );
    float terrainDetail = fbm(continentWarp(rotatedUV * 5.0));
    
    // Create mountain ridges and terrain variations with toggle
    float mountains = enableMountains > 0.5 ? terrainHeight(uv * 3.0 + time * 0.01) * continent : 0.0;
    
    // Base wave pattern for water/oceans with toggle
    float waves = enableWaves > 0.5 ? wavePattern(uv, 3.0, 0.05 + videoMotion * 0.1) * (1.0 - continent * 0.7) : 0.0;
    
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
    
    // Replace light rays with ley lines
    float leyLineEffect = enableLightRays > 0.5 ? leyLines(uv, 15.0, 0.3) * 0.7 : 0.0;
    
    // Add subtle particles for magical dust with toggle
    float particleEffect = enableParticles > 0.5 ? particles(uv) * (0.5 + continent * 0.5) : 0.0;
    
    // Soft vignette with toggle
    float vignette = enableVignette > 0.5 ? smoothstep(0.0, 0.7, 1.0 - length((uv - 0.5) * 1.3)) : 1.0;
    
    // Base color gradient from deep to primary gold
    vec3 baseColor = mix(deepColor, primaryGold, vignette * 0.7);
    
    // Layer visual elements for fantasy map appearance
    // Land areas
    baseColor = mix(baseColor, mix(secondaryGold, accentColor, terrainDetail), continent * 0.8);
    // Mountains and elevated terrain
    baseColor = mix(baseColor, highlightColor * 0.9, mountains * 0.6);
    // Water/ocean areas with wave patterns
    baseColor = mix(baseColor, deepColor * 0.8 + secondaryGold * 0.2, waves * (1.0 - continent * 0.8));
    // Kingdom/territory borders
    baseColor = mix(baseColor, highlightColor, borders);
    // Magical elements
    baseColor = mix(baseColor, mix(accentColor, highlightColor, 0.6 + 0.4 * sin(time * 0.2)), swirlPattern * 0.4);
    baseColor = mix(baseColor, vec3(0.7, 0.9, 1.0), leyLineEffect * 0.5);
    baseColor = mix(baseColor, highlightColor, particleEffect * 0.4);
    
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
    }
    
    // Apply gentle film grain with toggle
    if (enableFilmGrain > 0.5) {
      float grain = hash(uv + time) * 0.03;
      baseColor = mix(baseColor, deepColor, grain);
    }
    
    // Final vignette
    baseColor *= vignette;
    
    gl_FragColor = vec4(baseColor, 1.0);
  }
`; 