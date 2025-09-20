/**
 * Polyfills for better cross-browser compatibility
 * This file includes polyfills needed by Angular and is loaded before the app.
 */

import 'zone.js'; // Required for Angular

// Polyfills for older browsers (IE11, Opera, Safari)
import 'core-js/es/array';
import 'core-js/es/promise';
import 'core-js/es/object';
import 'core-js/es/function';
import 'core-js/es/parse-int';
import 'core-js/es/parse-float';
import 'core-js/es/number/constructor';
import 'core-js/es/number/to-fixed';
import 'core-js/es/number/to-precision';
import 'core-js/es/symbol';
import 'core-js/es/reflect';
import 'core-js/es/map';
import 'core-js/es/set';
import 'core-js/es/weak-map';
import 'core-js/es/weak-set';

// Web Animations API polyfill for older browsers
import 'web-animations-js';

// ResizeObserver polyfill for better compatibility
import { ResizeObserver } from '@juggle/resize-observer';

// IntersectionObserver polyfill
import 'intersection-observer';

// Custom polyfills for specific browser issues
(function() {
  // Fix for Opera and older browsers - requestAnimationFrame
  if (!window.requestAnimationFrame) {
    window.requestAnimationFrame = function(callback) {
      return window.setTimeout(callback, 1000 / 60);
    };
    window.cancelAnimationFrame = function(id) {
      clearTimeout(id);
    };
  }

  // Fix for browsers without ResizeObserver
  if (!window.ResizeObserver) {
    window.ResizeObserver = ResizeObserver;
  }

  // Performance.now() polyfill for older browsers
  if (!window.performance || !window.performance.now) {
    window.performance = window.performance || {};
    window.performance.now = function() {
      return Date.now();
    };
  }

  // AudioContext polyfill for WebKit browsers
  if (typeof window !== 'undefined') {
    window.AudioContext = window.AudioContext ||
                          (window as any).webkitAudioContext ||
                          (window as any).mozAudioContext;
  }

  // CSS.supports polyfill
  if (!CSS.supports) {
    CSS.supports = function(property: string, value?: string) {
      try {
        const div = document.createElement('div');
        div.style.setProperty(property, value || '');
        return div.style.getPropertyValue(property) !== '';
      } catch {
        return false;
      }
    };
  }
})();

// WebGL compatibility checks and fallbacks
(function() {
  function getWebGLContext(): WebGLRenderingContext | null {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') as WebGLRenderingContext || canvas.getContext('experimental-webgl') as WebGLRenderingContext;
    return gl;
  }

  // Store WebGL support status globally
  (window as any).webglSupported = !!getWebGLContext();

  // WebGL extensions for better Three.js compatibility
  const gl = getWebGLContext();
  if (gl) {
    // Enable standard extensions for better compatibility
    gl.getExtension('OES_standard_derivatives');
    gl.getExtension('EXT_shader_texture_lod');
    gl.getExtension('OES_element_index_uint');
    gl.getExtension('WEBGL_depth_texture');
    gl.getExtension('OES_texture_float');
    gl.getExtension('OES_texture_half_float');
  }
})();