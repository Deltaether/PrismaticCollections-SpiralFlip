import { Injectable } from '@angular/core';

interface BrowserCapabilities {
  webglSupported: boolean;
  webgl2Supported: boolean;
  isHighPerformance: boolean;
  isLowPerformance: boolean;
  supportsOffscreenCanvas: boolean;
  supportsWebGLExtensions: string[];
  memoryLimit: number;
  browserType: 'chrome' | 'firefox' | 'safari' | 'opera' | 'edge' | 'unknown';
  performanceProfile: 'high' | 'medium' | 'low';
}

@Injectable({
  providedIn: 'root'
})
export class BrowserOptimizationService {
  private capabilities: BrowserCapabilities;

  constructor() {
    this.capabilities = this.detectCapabilities();
    this.applyOptimizations();
  }

  private detectCapabilities(): BrowserCapabilities {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    const gl2 = canvas.getContext('webgl2') as WebGL2RenderingContext;

    const navigator_ua = navigator.userAgent.toLowerCase();
    const browserType = this.detectBrowserType(navigator_ua);

    const capabilities: BrowserCapabilities = {
      webglSupported: !!gl,
      webgl2Supported: !!gl2,
      isHighPerformance: this.isHighPerformanceDevice(),
      isLowPerformance: this.isLowPerformanceDevice(),
      supportsOffscreenCanvas: typeof OffscreenCanvas !== 'undefined',
      supportsWebGLExtensions: this.getWebGLExtensions(gl),
      memoryLimit: this.getMemoryLimit(),
      browserType,
      performanceProfile: this.getPerformanceProfile(browserType, navigator_ua)
    };

    return capabilities;
  }

  private detectBrowserType(ua: string): BrowserCapabilities['browserType'] {
    if (ua.includes('chrome') && !ua.includes('edg')) return 'chrome';
    if (ua.includes('firefox')) return 'firefox';
    if (ua.includes('safari') && !ua.includes('chrome')) return 'safari';
    if (ua.includes('opr') || ua.includes('opera')) return 'opera';
    if (ua.includes('edg')) return 'edge';
    return 'unknown';
  }

  private getPerformanceProfile(browserType: string, ua: string): 'high' | 'medium' | 'low' {
    // Opera tends to have performance issues with Three.js
    if (browserType === 'opera') return 'low';

    // Mobile devices get medium performance
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      return 'medium';
    }

    // Desktop Chrome/Edge/Firefox get high performance
    if (['chrome', 'edge', 'firefox'].includes(browserType)) {
      return 'high';
    }

    return 'medium';
  }

  private isHighPerformanceDevice(): boolean {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext;

    if (!gl) return false;

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    if (debugInfo) {
      const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
      // Check for high-performance GPUs
      return /nvidia|amd|radeon|geforce|quadro/i.test(renderer);
    }

    return navigator.hardwareConcurrency >= 8;
  }

  private isLowPerformanceDevice(): boolean {
    return navigator.hardwareConcurrency <= 2 ||
           (navigator as any).deviceMemory <= 2 ||
           /mobile|android/i.test(navigator.userAgent);
  }

  private getWebGLExtensions(gl: WebGLRenderingContext | null): string[] {
    if (!gl) return [];

    return [
      'OES_standard_derivatives',
      'EXT_shader_texture_lod',
      'OES_element_index_uint',
      'WEBGL_depth_texture',
      'OES_texture_float',
      'OES_texture_half_float',
      'EXT_texture_filter_anisotropic',
      'WEBGL_compressed_texture_s3tc',
      'WEBGL_compressed_texture_pvrtc',
      'WEBGL_compressed_texture_etc1'
    ].filter(ext => gl.getExtension(ext));
  }

  private getMemoryLimit(): number {
    const memory = (navigator as any).deviceMemory;
    if (memory) return memory * 1024; // Convert GB to MB

    // Fallback estimation based on user agent
    if (/mobile|android/i.test(navigator.userAgent)) return 2048; // 2GB
    return 8192; // 8GB default for desktop
  }

  private applyOptimizations(): void {
    // Apply browser-specific CSS optimizations
    this.applyCSSOptimizations();

    // Apply performance hints
    this.applyPerformanceHints();

    // Set global performance variables
    this.setGlobalPerformanceVars();
  }

  private applyCSSOptimizations(): void {
    const style = document.createElement('style');

    let cssOptimizations = `
      /* Base performance optimizations */
      * {
        -webkit-transform: translateZ(0);
        -moz-transform: translateZ(0);
        -ms-transform: translateZ(0);
        -o-transform: translateZ(0);
        transform: translateZ(0);
      }

      canvas {
        image-rendering: optimizeSpeed;
        image-rendering: -webkit-optimize-contrast;
        image-rendering: optimize-contrast;
        -ms-interpolation-mode: nearest-neighbor;
      }
    `;

    // Browser-specific optimizations
    switch (this.capabilities.browserType) {
      case 'opera':
        cssOptimizations += `
          /* Opera-specific optimizations */
          * {
            will-change: auto;
            backface-visibility: hidden;
            perspective: 1000px;
          }

          canvas {
            -webkit-backface-visibility: hidden;
            -moz-backface-visibility: hidden;
            backface-visibility: hidden;
          }
        `;
        break;

      case 'firefox':
        cssOptimizations += `
          /* Firefox-specific optimizations */
          * {
            -moz-osx-font-smoothing: grayscale;
          }
        `;
        break;

      case 'safari':
        cssOptimizations += `
          /* Safari-specific optimizations */
          * {
            -webkit-font-smoothing: antialiased;
            -webkit-backface-visibility: hidden;
          }
        `;
        break;
    }

    style.textContent = cssOptimizations;
    document.head.appendChild(style);
  }

  private applyPerformanceHints(): void {
    // Add performance hints to document head
    const hints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'dns-prefetch', href: 'https://cdn.jsdelivr.net' },
      { rel: 'preload', as: 'script', href: '/assets/3d/preload.js' }
    ];

    hints.forEach(hint => {
      const link = document.createElement('link');
      Object.assign(link, hint);
      document.head.appendChild(link);
    });
  }

  private setGlobalPerformanceVars(): void {
    // Set global variables for Three.js configuration
    (window as any).PHANTASIA_PERFORMANCE = {
      profile: this.capabilities.performanceProfile,
      webgl2: this.capabilities.webgl2Supported,
      extensions: this.capabilities.supportsWebGLExtensions,
      memoryLimit: this.capabilities.memoryLimit,
      browserType: this.capabilities.browserType
    };
  }

  getCapabilities(): BrowserCapabilities {
    return { ...this.capabilities };
  }

  getOptimalSettings() {
    const settings = {
      antialias: true,
      shadows: true,
      postProcessing: true,
      particleCount: 1000,
      textureQuality: 'high' as 'high' | 'medium' | 'low',
      renderScale: 1.0,
      targetFPS: 60
    };

    switch (this.capabilities.performanceProfile) {
      case 'low':
        return {
          ...settings,
          antialias: false,
          shadows: false,
          postProcessing: false,
          particleCount: 200,
          textureQuality: 'low' as const,
          renderScale: 0.75,
          targetFPS: 30
        };

      case 'medium':
        return {
          ...settings,
          shadows: this.capabilities.browserType !== 'opera',
          postProcessing: false,
          particleCount: 500,
          textureQuality: 'medium' as const,
          renderScale: 0.85,
          targetFPS: 45
        };

      default:
        return settings;
    }
  }

  // Method for Three.js renderer optimization
  optimizeThreeJSRenderer(renderer: any): void {
    const settings = this.getOptimalSettings();

    // Apply renderer-specific optimizations
    renderer.setPixelRatio(Math.min(window.devicePixelRatio * settings.renderScale, 2));
    renderer.antialias = settings.antialias;
    renderer.shadowMap.enabled = settings.shadows;

    // Browser-specific renderer settings
    if (this.capabilities.browserType === 'opera') {
      renderer.precision = 'lowp';
      renderer.powerPreference = 'high-performance';
    }

    if (this.capabilities.performanceProfile === 'low') {
      renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75);
    }
  }

  // Performance monitoring
  startPerformanceMonitoring(): void {
    let frameCount = 0;
    let lastTime = performance.now();

    const monitor = () => {
      frameCount++;
      const currentTime = performance.now();

      if (currentTime - lastTime >= 1000) {
        const fps = frameCount;
        frameCount = 0;
        lastTime = currentTime;

        // Adjust settings if performance drops
        if (fps < 30 && this.capabilities.performanceProfile !== 'low') {
          console.warn('Performance drop detected, consider reducing quality settings');
          this.adjustForLowPerformance();
        }
      }

      requestAnimationFrame(monitor);
    };

    requestAnimationFrame(monitor);
  }

  private adjustForLowPerformance(): void {
    // Emit performance adjustment event
    window.dispatchEvent(new CustomEvent('phantasia:performance-adjust', {
      detail: { profile: 'low', reason: 'fps-drop' }
    }));
  }
}