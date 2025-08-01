/**
 * Magical Ley Lines Effect
 * Custom implementation for Project Phantasia
 * 【✓】 Separated from main shader for better modularity
 */

// GLSL fragment shader code for the magical ley lines effect
export const leyLinesShaderFunction = `
// Calculate magical ley lines energy paths
float leyLines(vec2 uv, float density, float speed) {
  float result = 0.0;
  
  // Create a smaller number of flowing energy paths that are more parallel
  for (int i = 0; i < 3; i++) { // Reduced from 5 to 3 lines
    float lineIndex = float(i);
    float verticalOffset = 0.25 + 0.25 * lineIndex; // More even vertical distribution (parallel lines)
    
    // Use sin/cos waves to create flowing curves
    float flowSpeed = time * (0.08 + lineIndex * 0.01) * speed;
    
    // Create smoother, gentler curves
    float curve = sin(uv.x * 2.0 + flowSpeed) * 0.05; // Reduced amplitude for subtle movement
    
    // Add subtle wave variation
    curve += sin(uv.x * 5.0 - flowSpeed * 0.3) * 0.02;
    
    // Calculate distance to the curve with MUCH wider lines
    float dist = abs(uv.y - verticalOffset - curve) / (density * 0.004); // Doubled from 0.002 to 0.004
    
    // Dramatically increase base thickness
    float baseThickness = 4.0; // Increased from 1.5 to 4.0 for much thicker lines
    dist = dist / baseThickness;
    
    // Create a subtle pulsing effect
    float pulse = 0.8 + 0.2 * sin(time * 0.2 + lineIndex);
    
    // Intensity falloff with distance from line - much gentler falloff for very thick appearance
    float intensity = 0.02 / (dist + 0.02); // Increased denominator from 0.01 to 0.02 for wider falloff
    intensity *= pulse;
    
    // Apply fade based on horizontal position
    float xFade = smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
    intensity *= xFade;
    
    // Create larger flowing energy particles along the path
    float particleEffect = 0.0;
    for (int j = 0; j < 5; j++) {
      float particleOffset = float(j) / 5.0;
      float particlePhase = fract(flowSpeed + particleOffset);
      
      // Calculate particle position along the curve
      vec2 particleCenter = vec2(
        particlePhase,
        verticalOffset + curve * sin(particlePhase * 3.14)
      );
      
      // Distance to particle
      float distToParticle = length(uv - particleCenter);
      
      // Create much larger particles
      float particleSize = 0.025 + 0.008 * sin(particlePhase * 6.28); // Increased from 0.015 to 0.025
      float particle = smoothstep(particleSize, 0.0, distToParticle);
      
      particleEffect += particle * 0.5; // Reduced intensity
    }
    
    // Create a wider ethereal glow around the path
    float glow = 0.02 / (dist + 0.08); // Increased from 0.05 to 0.08 for wider glow
    glow *= pulse * smoothstep(0.7, 0.0, dist); // Increased smoothstep range from 0.5 to 0.7
    
    // Combine effects with reduced intensity
    float lineEffect = (intensity * 0.6 + glow * 0.4 + particleEffect * 0.4) * 0.6;
    
    result += lineEffect * (0.5 + 0.2 * sin(lineIndex + time * 0.1));
  }
  
  // Limit the overall brightness and reduce visibility
  return min(result, 1.0) * 0.4; // Reduced from 0.5 to 0.4 for less visibility
}
`;

// Main interface for the ley lines effect configuration
export interface LeyLinesEffectConfig {
  enabled: boolean;     // Whether the effect is enabled
  intensity: number;    // Overall intensity of the effect (0-1)
  speed: number;        // Animation speed multiplier
  density: number;      // Density of the ley lines
  color: string;        // Base color of the ley lines (hex format)
}

// Default configuration values
export const defaultLeyLinesConfig: LeyLinesEffectConfig = {
  enabled: true,
  intensity: 0.4,    // Reduced from 0.5 for subtlety
  speed: 0.6,        // Reduced from 0.7 for slower, less distracting movement
  density: 35.0,     // Significantly increased from 20.0 for much thicker lines
  color: '#a0c8ff'   // Lighter blue color for subtler appearance
};

/**
 * Class to manage the ley lines effect
 * 【✓】 Provides methods to update shader uniforms and toggle the effect
 */
export class LeyLinesEffect {
  private config: LeyLinesEffectConfig;
  
  constructor(config?: Partial<LeyLinesEffectConfig>) {
    this.config = {
      ...defaultLeyLinesConfig,
      ...config
    };
  }
  
  /**
   * Get the current configuration
   * 【✓】 
   */
  getConfig(): LeyLinesEffectConfig {
    return { ...this.config };
  }
  
  /**
   * Update the effect configuration
   * 【✓】 
   */
  updateConfig(config: Partial<LeyLinesEffectConfig>): void {
    this.config = {
      ...this.config,
      ...config
    };
  }
  
  /**
   * Toggle the effect on/off
   * 【✓】 
   */
  toggle(enabled?: boolean): void {
    this.config.enabled = enabled !== undefined ? enabled : !this.config.enabled;
  }
  
  /**
   * Convert the effect configuration to shader uniforms
   * 【✓】 Returns uniforms that can be applied to the shader
   */
  toShaderUniforms(): Record<string, any> {
    // Convert hex color to RGB components
    const color = this.hexToRgb(this.config.color);
    
    return {
      enableLeyLines: { value: this.config.enabled ? 1.0 : 0.0 },
      leyLinesIntensity: { value: this.config.intensity },
      leyLinesSpeed: { value: this.config.speed },
      leyLinesDensity: { value: this.config.density },
      leyLinesColor: { value: [color.r / 255, color.g / 255, color.b / 255] }
    };
  }
  
  /**
   * Helper function to convert hex color to RGB
   * 【✓】 
   */
  private hexToRgb(hex: string): { r: number, g: number, b: number } {
    // Remove # if present
    hex = hex.replace(/^#/, '');
    
    // Parse hex values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255;
    const g = (bigint >> 8) & 255;
    const b = bigint & 255;
    
    return { r, g, b };
  }
} 