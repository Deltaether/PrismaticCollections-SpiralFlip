/**
 * Phantasia2 Debug System
 * Enhanced comprehensive logging and analysis for scrollbar overflow issues
 */
export class Phantasia2Debug {
  private debugLog: string[] = [];
  private elementMonitoringInterval: any = null;
  private document: Document;
  private domReadyPromise: Promise<void>;
  private isLoadingScreenPresent: boolean = false;
  private loadingScreenPhase: 'loading' | 'transition' | 'complete' | 'not-found' = 'not-found';

  constructor(document: Document) {
    this.document = document;
    this.domReadyPromise = this.waitForDOMReady();
  }

  /**
   * Wait for DOM to be fully ready including dynamic content
   */
  private waitForDOMReady(): Promise<void> {
    return new Promise((resolve) => {
      if (this.document.readyState === 'complete') {
        setTimeout(resolve, 2000);
      } else {
        const checkReady = () => {
          if (this.document.readyState === 'complete') {
            setTimeout(resolve, 2000);
          } else {
            setTimeout(checkReady, 100);
          }
        };
        checkReady();
      }
    });
  }

  /**
   * Start comprehensive debug monitoring with DOM ready detection
   */
  async startDebugMonitoring(): Promise<void> {
    this.logDebugInfo('=== PHANTASIA2 ENHANCED DEBUG MONITORING STARTED ===');
    this.logDebugInfo(`Browser: ${navigator.userAgent}`);
    this.logDebugInfo(`Screen resolution: ${screen.width}x${screen.height}`);
    this.logDebugInfo(`Device pixel ratio: ${devicePixelRatio}`);
    this.logDebugInfo(`DOM ready state: ${this.document.readyState}`);
    
    // Wait for DOM to be fully ready
    this.logDebugInfo('Waiting for DOM to be fully loaded...');
    await this.domReadyPromise;
    this.logDebugInfo('✅ DOM is fully loaded, starting comprehensive analysis');
    
    // Detect loading screen phase
    this.detectLoadingScreenPhase();
    
    // Initial comprehensive analysis
    setTimeout(() => {
      this.performComprehensiveAnalysis();
    }, 500);
    
    // Advanced monitoring phases
    this.setupAdvancedMonitoring();
  }

  /**
   * Log debug information with timestamp
   */
  logDebugInfo(message: string): void {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.debugLog.push(logEntry);
    console.log(`[PHANTASIA2-DEBUG] ${logEntry}`);
  }

  /**
   * Detect current loading screen phase
   */
  private detectLoadingScreenPhase(): void {
    this.logDebugInfo('--- LOADING SCREEN PHASE DETECTION ---');
    
    const loadingContainer = this.document.querySelector('.loader-container') as HTMLElement;
    if (loadingContainer) {
      this.isLoadingScreenPresent = true;
      
      const style = window.getComputedStyle(loadingContainer);
      const opacity = parseFloat(style.opacity);
      const display = style.display;
      const visibility = style.visibility;
      
      this.logDebugInfo(`Loading container found: opacity=${opacity}, display=${display}, visibility=${visibility}`);
      
      if (opacity > 0.9 && display !== 'none' && visibility !== 'hidden') {
        this.loadingScreenPhase = 'loading';
        this.logDebugInfo('🎬 LOADING SCREEN PHASE: Active loading');
      } else if (opacity > 0.1 && opacity < 0.9) {
        this.loadingScreenPhase = 'transition';
        this.logDebugInfo('🔄 LOADING SCREEN PHASE: Transitioning out');
      } else {
        this.loadingScreenPhase = 'complete';
        this.logDebugInfo('✅ LOADING SCREEN PHASE: Hidden/Complete');
      }
    } else {
      this.isLoadingScreenPresent = false;
      this.loadingScreenPhase = 'not-found';
      this.logDebugInfo('❌ Loading screen container not found');
    }
  }

  /**
   * Perform comprehensive analysis based on current state
   */
  private performComprehensiveAnalysis(): void {
    this.logDebugInfo('=== COMPREHENSIVE ANALYSIS STARTING ===');
    
    // Base analysis
    this.analyzeViewportAndDocument();
    this.logScrollbarState();
    
    // Phase-specific analysis
    if (this.isLoadingScreenPresent) {
      this.analyzeLoadingScreenComponents();
    }
    
    // Main page analysis
    this.analyzeMainPageElements();
    
    // Enhanced overflow detection
    this.analyzeAllOverflowingElements();
    
    // Advanced culprit detection
    this.detectPotentialCulprits();
  }

  /**
   * Setup advanced monitoring with multiple phases
   */
  private setupAdvancedMonitoring(): void {
    this.logDebugInfo('Setting up advanced monitoring...');
    
    // Continuous monitoring every 3 seconds
    this.elementMonitoringInterval = setInterval(() => {
      this.monitorElementChanges();
      this.detectLoadingScreenPhase(); // Re-check phase
    }, 3000);
    
    // Monitor for loading screen transitions
    this.setupLoadingScreenTransitionMonitoring();
    
    // Enhanced resize monitoring
    window.addEventListener('resize', () => {
      this.logDebugInfo('🔄 Window resized - performing full re-analysis');
      setTimeout(() => this.performComprehensiveAnalysis(), 100);
    });
    
    // Enhanced scroll monitoring with throttling
    let scrollTimeout: any = null;
    window.addEventListener('scroll', () => {
      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.logScrollState();
      }, 100);
    }, { passive: true });
  }

  /**
   * Monitor loading screen transitions for overflow during animation
   */
  private setupLoadingScreenTransitionMonitoring(): void {
    const loadingContainer = this.document.querySelector('.loader-container') as HTMLElement;
    if (!loadingContainer) return;
    
    const observer = new MutationObserver(() => {
      this.detectLoadingScreenPhase();
      if (this.loadingScreenPhase === 'transition') {
        this.logDebugInfo('🔄 Loading screen transition detected - analyzing overflow during animation');
        setTimeout(() => this.analyzeLoadingScreenDuringTransition(), 100);
      }
    });
    
    observer.observe(loadingContainer, {
      attributes: true,
      attributeFilter: ['style', 'class'],
      subtree: true
    });
  }

  /**
   * Analyze loading screen during transition animations
   */
  private analyzeLoadingScreenDuringTransition(): void {
    this.logDebugInfo('--- LOADING SCREEN TRANSITION ANALYSIS ---');
    const loadingContainer = this.document.querySelector('.loader-container') as HTMLElement;
    if (!loadingContainer) return;
    
    // Sample multiple times during transition
    const sampleCount = 5;
    const sampleInterval = 200;
    
    for (let i = 0; i < sampleCount; i++) {
      setTimeout(() => {
        this.logDebugInfo(`Transition Sample ${i + 1}/${sampleCount}:`);
        this.analyzeAnimationBounds(loadingContainer);
        this.checkForOverflowDuringTransition();
      }, i * sampleInterval);
    }
  }

  /**
   * Check for overflow specifically during transitions
   */
  private checkForOverflowDuringTransition(): void {
    const overflowAmount = this.document.documentElement.scrollWidth - window.innerWidth;
    if (overflowAmount > 0) {
      this.logDebugInfo(`🚨 TRANSITION OVERFLOW: ${overflowAmount}px during loading screen transition`);
      
      // Identify culprits during transition
      const animatedElements = Array.from(this.document.querySelectorAll('.loader-container *')).filter(el => {
        const style = window.getComputedStyle(el as HTMLElement);
        return style.animation !== 'none' || style.transform !== 'none';
      });
      
      animatedElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          this.logDebugInfo(`  Transition culprit ${index}: ${el.tagName}.${(el as HTMLElement).className} extends ${(rect.right - window.innerWidth).toFixed(2)}px beyond viewport`);
        }
      });
    }
  }

  /**
   * Analyze viewport and document fundamentals
   */
  private analyzeViewportAndDocument(): void {
    this.logDebugInfo('--- VIEWPORT & DOCUMENT ANALYSIS ---');
    
    const docElement = this.document.documentElement;
    const bodyElement = this.document.body;
    
    this.logDebugInfo(`Document scrollWidth: ${docElement.scrollWidth}, clientWidth: ${docElement.clientWidth}`);
    this.logDebugInfo(`Body scrollWidth: ${bodyElement.scrollWidth}, clientWidth: ${bodyElement.clientWidth}`);
    this.logDebugInfo(`Viewport dimensions: ${window.innerWidth}x${window.innerHeight}`);
    this.logDebugInfo(`Screen dimensions: ${screen.width}x${screen.height}`);
    this.logDebugInfo(`Device pixel ratio: ${window.devicePixelRatio}`);
    
    if (docElement.scrollWidth > docElement.clientWidth) {
      this.logDebugInfo('⚠️ DOCUMENT HORIZONTAL OVERFLOW DETECTED!');
    }
    
    if (bodyElement.scrollWidth > bodyElement.clientWidth) {
      this.logDebugInfo('⚠️ BODY HORIZONTAL OVERFLOW DETECTED!');
    }
  }

  /**
   * Analyze main page elements
   */
  private analyzeMainPageElements(): void {
    this.logDebugInfo('--- MAIN PAGE ELEMENTS ANALYSIS ---');
    
    const albumPage = this.document.querySelector('.phantasia-album-page') as HTMLElement;
    if (albumPage) {
      this.analyzeElementOverflow(albumPage, 'PHANTASIA-ALBUM-PAGE');
    }
    
    const mainElements = [
      '.video-background',
      '.video-title-section',
      '.album-presentation',
      '.cd-showcase',
      'app-music-player',
      'app-dynamic-artist-cards',
      '.phantasia-footer'
    ];
    
    mainElements.forEach(selector => {
      const element = this.document.querySelector(selector) as HTMLElement;
      if (element) {
        this.analyzeElementOverflow(element, selector);
      } else {
        this.logDebugInfo(`Main element not found: ${selector}`);
      }
    });
  }

  /**
   * Deep analysis of loading screen components causing overflow
   */
  private analyzeLoadingScreenComponents(): void {
    this.logDebugInfo('=== LOADING SCREEN OVERFLOW ANALYSIS ===');
    
    const loadingContainer = this.document.querySelector('.loader-container') as HTMLElement;
    if (loadingContainer) {
      this.analyzeElementOverflow(loadingContainer, 'LOADER-CONTAINER');
      
      // Analyze all loading screen child components
      const loadingChildren = [
        '.magical-circle',
        '.magical-circle.outer',
        '.rune-effects',
        '.decorative-elements',
        '.corner-line',
        '.mid-line',
        '.light-beams',
        '.beam',
        '.rune-circle',
        '.rune'
      ];
      
      loadingChildren.forEach(selector => {
        const elements = loadingContainer.querySelectorAll(selector);
        if (elements.length > 0) {
          this.logDebugInfo(`Found ${elements.length} elements matching ${selector}:`);
          elements.forEach((el, index) => {
            this.analyzeElementOverflow(el as HTMLElement, `${selector}-${index}`);
          });
        } else {
          this.logDebugInfo(`No elements found for selector: ${selector}`);
        }
      });
      
      // Check specific problematic animations
      this.analyzeAnimationBounds(loadingContainer);
    } else {
      this.logDebugInfo('❌ Loading container not found - may have been removed');
    }
  }

  /**
   * Analyze animation bounds for elements with transforms
   */
  private analyzeAnimationBounds(container: HTMLElement): void {
    this.logDebugInfo('--- ANIMATION BOUNDS ANALYSIS ---');
    
    const animatedElements = Array.from(container.querySelectorAll('*')).filter(el => {
      const style = window.getComputedStyle(el as HTMLElement);
      return style.animation !== 'none' || style.transform !== 'none';
    });
    
    this.logDebugInfo(`Found ${animatedElements.length} animated elements in loading screen:`);
    
    animatedElements.forEach((el, index) => {
      const element = el as HTMLElement;
      const style = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      
      this.logDebugInfo(`Animated Element ${index + 1}: ${element.tagName}.${element.className}`);
      this.logDebugInfo(`  Rect: ${rect.left.toFixed(2)}, ${rect.top.toFixed(2)}, ${rect.width.toFixed(2)}x${rect.height.toFixed(2)}`);
      this.logDebugInfo(`  Right edge: ${rect.right.toFixed(2)}px (viewport: ${window.innerWidth}px)`);
      this.logDebugInfo(`  Bottom edge: ${rect.bottom.toFixed(2)}px (viewport: ${window.innerHeight}px)`);
      this.logDebugInfo(`  Animation: ${style.animation}`);
      this.logDebugInfo(`  Transform: ${style.transform}`);
      this.logDebugInfo(`  Position: ${style.position}`);
      this.logDebugInfo(`  Z-index: ${style.zIndex}`);
      
      if (rect.right > window.innerWidth) {
        this.logDebugInfo(`  🚨 HORIZONTAL OVERFLOW: ${(rect.right - window.innerWidth).toFixed(2)}px beyond viewport`);
      }
      
      if (rect.bottom > window.innerHeight) {
        this.logDebugInfo(`  🚨 VERTICAL OVERFLOW: ${(rect.bottom - window.innerHeight).toFixed(2)}px beyond viewport`);
      }
    });
  }

  /**
   * Enhanced analysis of all overflowing elements
   */
  private analyzeAllOverflowingElements(): void {
    this.logDebugInfo('--- ENHANCED OVERFLOW ELEMENT DETECTION ---');
    
    // Find all elements that might cause horizontal overflow
    const allElements = Array.from(this.document.querySelectorAll('*')) as HTMLElement[];
    const overflowElements = allElements.filter(el => {
      const rect = el.getBoundingClientRect();
      return rect.width > window.innerWidth || rect.right > window.innerWidth;
    });
    
    this.logDebugInfo(`Found ${overflowElements.length} elements causing potential horizontal overflow:`);
    overflowElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(el);
      
      this.logDebugInfo(`${index + 1}. ${el.tagName}.${el.className || 'no-class'}`);
      this.logDebugInfo(`   Dimensions: ${rect.width.toFixed(2)}x${rect.height.toFixed(2)}`);
      this.logDebugInfo(`   Position: left=${rect.left.toFixed(2)}, right=${rect.right.toFixed(2)}`);
      this.logDebugInfo(`   Overflow amount: ${(rect.right - window.innerWidth).toFixed(2)}px`);
      this.logDebugInfo(`   CSS Position: ${computedStyle.position}`);
      this.logDebugInfo(`   CSS Transform: ${computedStyle.transform}`);
      this.logDebugInfo(`   CSS Overflow-X: ${computedStyle.overflowX}`);
      this.logDebugInfo(`   CSS Width: ${computedStyle.width}`);
      this.logDebugInfo(`   CSS Max-Width: ${computedStyle.maxWidth}`);
      this.logDebugInfo(`   Parent: ${el.parentElement?.tagName}.${el.parentElement?.className || 'no-class'}`);
      this.logDebugInfo(`   ---`);
    });
    
    // Also check for elements that might be causing the overflow indirectly
    this.analyzeIndirectOverflowCauses();
  }

  /**
   * Analyze indirect causes of overflow
   */
  private analyzeIndirectOverflowCauses(): void {
    this.logDebugInfo('--- INDIRECT OVERFLOW CAUSE ANALYSIS ---');
    
    // Check for elements with large margins or padding that push content
    const elementsWithSpacing = Array.from(this.document.querySelectorAll('*')).filter(el => {
      const style = window.getComputedStyle(el as HTMLElement);
      const marginLeft = parseFloat(style.marginLeft);
      const marginRight = parseFloat(style.marginRight);
      const paddingLeft = parseFloat(style.paddingLeft);
      const paddingRight = parseFloat(style.paddingRight);
      
      return Math.abs(marginLeft) > 50 || Math.abs(marginRight) > 50 || 
             paddingLeft > 50 || paddingRight > 50;
    });
    
    if (elementsWithSpacing.length > 0) {
      this.logDebugInfo(`Found ${elementsWithSpacing.length} elements with large spacing:`);
      elementsWithSpacing.forEach((el, index) => {
        const element = el as HTMLElement;
        const style = window.getComputedStyle(element);
        this.logDebugInfo(`${index + 1}. ${element.tagName}.${element.className || 'no-class'}`);
        this.logDebugInfo(`   Margin: ${style.marginLeft} ${style.marginTop} ${style.marginRight} ${style.marginBottom}`);
        this.logDebugInfo(`   Padding: ${style.paddingLeft} ${style.paddingTop} ${style.paddingRight} ${style.paddingBottom}`);
      });
    }
    
    // Check viewport meta tag
    const viewportMeta = this.document.querySelector('meta[name="viewport"]') as HTMLMetaElement;
    if (viewportMeta) {
      this.logDebugInfo(`Viewport meta tag content: ${viewportMeta.content}`);
    } else {
      this.logDebugInfo('⚠️ No viewport meta tag found');
    }
  }

  /**
   * Analyze specific element for overflow
   */
  private analyzeElementOverflow(element: HTMLElement, name: string): void {
    const rect = element.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(element);
    
    this.logDebugInfo(`--- ${name.toUpperCase()} ANALYSIS ---`);
    this.logDebugInfo(`  Dimensions: ${rect.width}x${rect.height}`);
    this.logDebugInfo(`  Position: left=${rect.left}, right=${rect.right}, top=${rect.top}, bottom=${rect.bottom}`);
    this.logDebugInfo(`  ScrollDimensions: scrollWidth=${element.scrollWidth}, scrollHeight=${element.scrollHeight}`);
    this.logDebugInfo(`  ClientDimensions: clientWidth=${element.clientWidth}, clientHeight=${element.clientHeight}`);
    this.logDebugInfo(`  CSS: position=${computedStyle.position}, overflow-x=${computedStyle.overflowX}, overflow-y=${computedStyle.overflowY}`);
    this.logDebugInfo(`  CSS: width=${computedStyle.width}, max-width=${computedStyle.maxWidth}, min-width=${computedStyle.minWidth}`);
    this.logDebugInfo(`  CSS: transform=${computedStyle.transform}, z-index=${computedStyle.zIndex}`);
    
    if (element.scrollWidth > element.clientWidth) {
      this.logDebugInfo(`  ⚠️ HORIZONTAL OVERFLOW: scrollWidth (${element.scrollWidth}) > clientWidth (${element.clientWidth})`);
    }
    
    if (rect.right > window.innerWidth) {
      this.logDebugInfo(`  ⚠️ ELEMENT EXTENDS BEYOND VIEWPORT: right (${rect.right}) > viewport (${window.innerWidth})`);
    }
  }

  /**
   * Log current scrollbar state
   */
  private logScrollbarState(): void {
    this.logDebugInfo('--- SCROLLBAR STATE ---');
    this.logDebugInfo(`Window scroll: X=${window.scrollX}, Y=${window.scrollY}`);
    this.logDebugInfo(`Document scroll dimensions: ${this.document.documentElement.scrollWidth}x${this.document.documentElement.scrollHeight}`);
    this.logDebugInfo(`Viewport dimensions: ${window.innerWidth}x${window.innerHeight}`);
    
    // Check if horizontal scrollbar is present
    if (this.document.documentElement.scrollWidth > window.innerWidth) {
      this.logDebugInfo('🔥 HORIZONTAL SCROLLBAR IS PRESENT!');
    } else {
      this.logDebugInfo('✅ No horizontal scrollbar detected');
    }
  }

  /**
   * Log scroll state changes
   */
  private logScrollState(): void {
    if (window.scrollX > 0) {
      this.logDebugInfo(`🚨 HORIZONTAL SCROLL DETECTED: scrollX=${window.scrollX}`);
    }
  }

  /**
   * Detect potential culprits causing overflow
   */
  private detectPotentialCulprits(): void {
    this.logDebugInfo('--- DETECTING POTENTIAL CULPRITS ---');
    
    // Check music player specifically (identified as culprit)
    const musicPlayer = this.document.querySelector('app-music-player') as HTMLElement;
    if (musicPlayer) {
      this.logDebugInfo('Music Player Analysis:');
      const playerChildren = Array.from(musicPlayer.querySelectorAll('*')) as HTMLElement[];
      playerChildren.forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        if (rect.width > window.innerWidth || rect.right > window.innerWidth) {
          const computedStyle = window.getComputedStyle(child);
          this.logDebugInfo(`  Culprit ${index}: ${child.tagName}.${child.className} - width: ${rect.width}px, right: ${rect.right}px, transform: ${computedStyle.transform}`);
        }
      });
    }
    
    // Check for elements with large transforms
    const transformElements = Array.from(this.document.querySelectorAll('*')).filter(el => {
      const style = window.getComputedStyle(el as HTMLElement);
      return style.transform !== 'none' && style.transform !== 'matrix(1, 0, 0, 1, 0, 0)';
    });
    
    this.logDebugInfo(`Found ${transformElements.length} elements with transforms`);
    transformElements.forEach((el, index) => {
      const computedStyle = window.getComputedStyle(el as HTMLElement);
      const rect = el.getBoundingClientRect();
      this.logDebugInfo(`  Transform ${index}: ${el.tagName}.${(el as HTMLElement).className} - transform: ${computedStyle.transform}, bounds: ${rect.right}px`);
    });
  }

  /**
   * Monitor element changes continuously
   */
  private monitorElementChanges(): void {
    // Quick check for new horizontal overflow
    if (this.document.documentElement.scrollWidth > window.innerWidth) {
      this.logDebugInfo(`🔥 CONTINUOUS MONITORING: Horizontal overflow still present (${this.document.documentElement.scrollWidth} > ${window.innerWidth})`);
      
      // Check if it's gotten worse
      const overflowAmount = this.document.documentElement.scrollWidth - window.innerWidth;
      this.logDebugInfo(`Overflow amount: ${overflowAmount}px`);
    }
  }

  /**
   * Save debug log to file for user analysis
   */
  saveDebugLogToFile(): void {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `phantasia2-debug-enhanced-${timestamp}.log`;
    
    // Add final summary to log
    this.logDebugInfo('=== ENHANCED DEBUG SUMMARY ===');
    this.logDebugInfo(`Total log entries: ${this.debugLog.length}`);
    this.logDebugInfo(`Document final scrollWidth: ${this.document.documentElement.scrollWidth}`);
    this.logDebugInfo(`Viewport final width: ${window.innerWidth}`);
    this.logDebugInfo(`Final overflow amount: ${this.document.documentElement.scrollWidth - window.innerWidth}px`);
    this.logDebugInfo(`Loading screen phase: ${this.loadingScreenPhase}`);
    this.logDebugInfo(`Loading screen present: ${this.isLoadingScreenPresent}`);
    
    // Create downloadable log file
    const logContent = this.debugLog.join('\n');
    const blob = new Blob([logContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = this.document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    this.document.body.appendChild(link);
    link.click();
    this.document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    this.logDebugInfo(`Enhanced debug log saved to ${filename}`);
    console.log(`[PHANTASIA2-DEBUG] Enhanced debug log saved to Downloads/${filename}`);
  }

  /**
   * Cleanup debug monitoring
   */
  cleanup(): void {
    if (this.elementMonitoringInterval) {
      clearInterval(this.elementMonitoringInterval);
      this.elementMonitoringInterval = null;
    }
  }
}