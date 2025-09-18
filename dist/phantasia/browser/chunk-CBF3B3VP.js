import {
  AudioService,
  DynamicArtistCardsComponent,
  DynamicArtistService,
  LoadingScreenComponent,
  MatCardModule,
  MatChipsModule,
  MusicPlayerComponent,
  SpecialMentionsComponent
} from "./chunk-HLNC3VFB.js";
import "./chunk-SBHYTBRN.js";
import {
  animate,
  state,
  style,
  transition,
  trigger
} from "./chunk-L4VH3QWU.js";
import {
  MatButtonModule
} from "./chunk-JJRARYBB.js";
import "./chunk-MUUHJO3F.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-3GUFOW2E.js";
import "./chunk-PVYOYSKP.js";
import {
  SiteHeaderComponent
} from "./chunk-YTISND37.js";
import {
  Router,
  RouterLink,
  RouterModule
} from "./chunk-FJNAFJM7.js";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  DOCUMENT,
  HostBinding,
  Inject,
  NgIf,
  ViewChild,
  __async,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-F34NQEWD.js";

// src/app/pages/collections/phantasia/pages/phantasia2/phantasia2-debug.ts
var Phantasia2Debug = class {
  constructor(document2) {
    this.debugLog = [];
    this.elementMonitoringInterval = null;
    this.isLoadingScreenPresent = false;
    this.loadingScreenPhase = "not-found";
    this.document = document2;
    this.domReadyPromise = this.waitForDOMReady();
  }
  /**
   * Wait for DOM to be fully ready including dynamic content
   */
  waitForDOMReady() {
    return new Promise((resolve) => {
      if (this.document.readyState === "complete") {
        setTimeout(resolve, 2e3);
      } else {
        const checkReady = () => {
          if (this.document.readyState === "complete") {
            setTimeout(resolve, 2e3);
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
  startDebugMonitoring() {
    return __async(this, null, function* () {
      this.logDebugInfo("=== PHANTASIA2 ENHANCED DEBUG MONITORING STARTED ===");
      this.logDebugInfo(`Browser: ${navigator.userAgent}`);
      this.logDebugInfo(`Screen resolution: ${screen.width}x${screen.height}`);
      this.logDebugInfo(`Device pixel ratio: ${devicePixelRatio}`);
      this.logDebugInfo(`DOM ready state: ${this.document.readyState}`);
      this.logDebugInfo("Waiting for DOM to be fully loaded...");
      yield this.domReadyPromise;
      this.logDebugInfo("\u2705 DOM is fully loaded, starting comprehensive analysis");
      this.detectLoadingScreenPhase();
      setTimeout(() => {
        this.performComprehensiveAnalysis();
      }, 500);
      this.setupAdvancedMonitoring();
    });
  }
  /**
   * Log debug information with timestamp
   */
  logDebugInfo(message) {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString();
    const logEntry = `[${timestamp}] ${message}`;
    this.debugLog.push(logEntry);
    console.log(`[PHANTASIA2-DEBUG] ${logEntry}`);
  }
  /**
   * Detect current loading screen phase
   */
  detectLoadingScreenPhase() {
    this.logDebugInfo("--- LOADING SCREEN PHASE DETECTION ---");
    const loadingContainer = this.document.querySelector(".loader-container");
    if (loadingContainer) {
      this.isLoadingScreenPresent = true;
      const style2 = window.getComputedStyle(loadingContainer);
      const opacity = parseFloat(style2.opacity);
      const display = style2.display;
      const visibility = style2.visibility;
      this.logDebugInfo(`Loading container found: opacity=${opacity}, display=${display}, visibility=${visibility}`);
      if (opacity > 0.9 && display !== "none" && visibility !== "hidden") {
        this.loadingScreenPhase = "loading";
        this.logDebugInfo("\u{1F3AC} LOADING SCREEN PHASE: Active loading");
      } else if (opacity > 0.1 && opacity < 0.9) {
        this.loadingScreenPhase = "transition";
        this.logDebugInfo("\u{1F504} LOADING SCREEN PHASE: Transitioning out");
      } else {
        this.loadingScreenPhase = "complete";
        this.logDebugInfo("\u2705 LOADING SCREEN PHASE: Hidden/Complete");
      }
    } else {
      this.isLoadingScreenPresent = false;
      this.loadingScreenPhase = "not-found";
      this.logDebugInfo("\u274C Loading screen container not found");
    }
  }
  /**
   * Perform comprehensive analysis based on current state
   */
  performComprehensiveAnalysis() {
    this.logDebugInfo("=== COMPREHENSIVE ANALYSIS STARTING ===");
    this.analyzeViewportAndDocument();
    this.logScrollbarState();
    if (this.isLoadingScreenPresent) {
      this.analyzeLoadingScreenComponents();
    }
    this.analyzeMainPageElements();
    this.analyzeAllOverflowingElements();
    this.detectPotentialCulprits();
  }
  /**
   * Setup advanced monitoring with multiple phases
   */
  setupAdvancedMonitoring() {
    this.logDebugInfo("Setting up advanced monitoring...");
    this.elementMonitoringInterval = setInterval(() => {
      this.monitorElementChanges();
      this.detectLoadingScreenPhase();
    }, 3e3);
    this.setupLoadingScreenTransitionMonitoring();
    window.addEventListener("resize", () => {
      this.logDebugInfo("\u{1F504} Window resized - performing full re-analysis");
      setTimeout(() => this.performComprehensiveAnalysis(), 100);
    });
    let scrollTimeout = null;
    window.addEventListener("scroll", () => {
      if (scrollTimeout)
        clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        this.logScrollState();
      }, 100);
    }, { passive: true });
  }
  /**
   * Monitor loading screen transitions for overflow during animation
   */
  setupLoadingScreenTransitionMonitoring() {
    const loadingContainer = this.document.querySelector(".loader-container");
    if (!loadingContainer)
      return;
    const observer = new MutationObserver(() => {
      this.detectLoadingScreenPhase();
      if (this.loadingScreenPhase === "transition") {
        this.logDebugInfo("\u{1F504} Loading screen transition detected - analyzing overflow during animation");
        setTimeout(() => this.analyzeLoadingScreenDuringTransition(), 100);
      }
    });
    observer.observe(loadingContainer, {
      attributes: true,
      attributeFilter: ["style", "class"],
      subtree: true
    });
  }
  /**
   * Analyze loading screen during transition animations
   */
  analyzeLoadingScreenDuringTransition() {
    this.logDebugInfo("--- LOADING SCREEN TRANSITION ANALYSIS ---");
    const loadingContainer = this.document.querySelector(".loader-container");
    if (!loadingContainer)
      return;
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
  checkForOverflowDuringTransition() {
    const overflowAmount = this.document.documentElement.scrollWidth - window.innerWidth;
    if (overflowAmount > 0) {
      this.logDebugInfo(`\u{1F6A8} TRANSITION OVERFLOW: ${overflowAmount}px during loading screen transition`);
      const animatedElements = Array.from(this.document.querySelectorAll(".loader-container *")).filter((el) => {
        const style2 = window.getComputedStyle(el);
        return style2.animation !== "none" || style2.transform !== "none";
      });
      animatedElements.forEach((el, index) => {
        const rect = el.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
          this.logDebugInfo(`  Transition culprit ${index}: ${el.tagName}.${el.className} extends ${(rect.right - window.innerWidth).toFixed(2)}px beyond viewport`);
        }
      });
    }
  }
  /**
   * Analyze viewport and document fundamentals
   */
  analyzeViewportAndDocument() {
    this.logDebugInfo("--- VIEWPORT & DOCUMENT ANALYSIS ---");
    const docElement = this.document.documentElement;
    const bodyElement = this.document.body;
    this.logDebugInfo(`Document scrollWidth: ${docElement.scrollWidth}, clientWidth: ${docElement.clientWidth}`);
    this.logDebugInfo(`Body scrollWidth: ${bodyElement.scrollWidth}, clientWidth: ${bodyElement.clientWidth}`);
    this.logDebugInfo(`Viewport dimensions: ${window.innerWidth}x${window.innerHeight}`);
    this.logDebugInfo(`Screen dimensions: ${screen.width}x${screen.height}`);
    this.logDebugInfo(`Device pixel ratio: ${window.devicePixelRatio}`);
    if (docElement.scrollWidth > docElement.clientWidth) {
      this.logDebugInfo("\u26A0\uFE0F DOCUMENT HORIZONTAL OVERFLOW DETECTED!");
    }
    if (bodyElement.scrollWidth > bodyElement.clientWidth) {
      this.logDebugInfo("\u26A0\uFE0F BODY HORIZONTAL OVERFLOW DETECTED!");
    }
  }
  /**
   * Analyze main page elements
   */
  analyzeMainPageElements() {
    this.logDebugInfo("--- MAIN PAGE ELEMENTS ANALYSIS ---");
    const albumPage = this.document.querySelector(".phantasia-album-page");
    if (albumPage) {
      this.analyzeElementOverflow(albumPage, "PHANTASIA-ALBUM-PAGE");
    }
    const mainElements = [
      ".video-background",
      ".video-title-section",
      ".album-presentation",
      ".cd-showcase",
      "app-music-player",
      "app-dynamic-artist-cards",
      ".phantasia-footer"
    ];
    mainElements.forEach((selector) => {
      const element = this.document.querySelector(selector);
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
  analyzeLoadingScreenComponents() {
    this.logDebugInfo("=== LOADING SCREEN OVERFLOW ANALYSIS ===");
    const loadingContainer = this.document.querySelector(".loader-container");
    if (loadingContainer) {
      this.analyzeElementOverflow(loadingContainer, "LOADER-CONTAINER");
      const loadingChildren = [
        ".magical-circle",
        ".magical-circle.outer",
        ".rune-effects",
        ".decorative-elements",
        ".corner-line",
        ".mid-line",
        ".light-beams",
        ".beam",
        ".rune-circle",
        ".rune"
      ];
      loadingChildren.forEach((selector) => {
        const elements = loadingContainer.querySelectorAll(selector);
        if (elements.length > 0) {
          this.logDebugInfo(`Found ${elements.length} elements matching ${selector}:`);
          elements.forEach((el, index) => {
            this.analyzeElementOverflow(el, `${selector}-${index}`);
          });
        } else {
          this.logDebugInfo(`No elements found for selector: ${selector}`);
        }
      });
      this.analyzeAnimationBounds(loadingContainer);
    } else {
      this.logDebugInfo("\u274C Loading container not found - may have been removed");
    }
  }
  /**
   * Analyze animation bounds for elements with transforms
   */
  analyzeAnimationBounds(container) {
    this.logDebugInfo("--- ANIMATION BOUNDS ANALYSIS ---");
    const animatedElements = Array.from(container.querySelectorAll("*")).filter((el) => {
      const style2 = window.getComputedStyle(el);
      return style2.animation !== "none" || style2.transform !== "none";
    });
    this.logDebugInfo(`Found ${animatedElements.length} animated elements in loading screen:`);
    animatedElements.forEach((el, index) => {
      const element = el;
      const style2 = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();
      this.logDebugInfo(`Animated Element ${index + 1}: ${element.tagName}.${element.className}`);
      this.logDebugInfo(`  Rect: ${rect.left.toFixed(2)}, ${rect.top.toFixed(2)}, ${rect.width.toFixed(2)}x${rect.height.toFixed(2)}`);
      this.logDebugInfo(`  Right edge: ${rect.right.toFixed(2)}px (viewport: ${window.innerWidth}px)`);
      this.logDebugInfo(`  Bottom edge: ${rect.bottom.toFixed(2)}px (viewport: ${window.innerHeight}px)`);
      this.logDebugInfo(`  Animation: ${style2.animation}`);
      this.logDebugInfo(`  Transform: ${style2.transform}`);
      this.logDebugInfo(`  Position: ${style2.position}`);
      this.logDebugInfo(`  Z-index: ${style2.zIndex}`);
      if (rect.right > window.innerWidth) {
        this.logDebugInfo(`  \u{1F6A8} HORIZONTAL OVERFLOW: ${(rect.right - window.innerWidth).toFixed(2)}px beyond viewport`);
      }
      if (rect.bottom > window.innerHeight) {
        this.logDebugInfo(`  \u{1F6A8} VERTICAL OVERFLOW: ${(rect.bottom - window.innerHeight).toFixed(2)}px beyond viewport`);
      }
    });
  }
  /**
   * Enhanced analysis of all overflowing elements
   */
  analyzeAllOverflowingElements() {
    this.logDebugInfo("--- ENHANCED OVERFLOW ELEMENT DETECTION ---");
    const allElements = Array.from(this.document.querySelectorAll("*"));
    const overflowElements = allElements.filter((el) => {
      const rect = el.getBoundingClientRect();
      return rect.width > window.innerWidth || rect.right > window.innerWidth;
    });
    this.logDebugInfo(`Found ${overflowElements.length} elements causing potential horizontal overflow:`);
    overflowElements.forEach((el, index) => {
      const rect = el.getBoundingClientRect();
      const computedStyle = window.getComputedStyle(el);
      this.logDebugInfo(`${index + 1}. ${el.tagName}.${el.className || "no-class"}`);
      this.logDebugInfo(`   Dimensions: ${rect.width.toFixed(2)}x${rect.height.toFixed(2)}`);
      this.logDebugInfo(`   Position: left=${rect.left.toFixed(2)}, right=${rect.right.toFixed(2)}`);
      this.logDebugInfo(`   Overflow amount: ${(rect.right - window.innerWidth).toFixed(2)}px`);
      this.logDebugInfo(`   CSS Position: ${computedStyle.position}`);
      this.logDebugInfo(`   CSS Transform: ${computedStyle.transform}`);
      this.logDebugInfo(`   CSS Overflow-X: ${computedStyle.overflowX}`);
      this.logDebugInfo(`   CSS Width: ${computedStyle.width}`);
      this.logDebugInfo(`   CSS Max-Width: ${computedStyle.maxWidth}`);
      this.logDebugInfo(`   Parent: ${el.parentElement?.tagName}.${el.parentElement?.className || "no-class"}`);
      this.logDebugInfo(`   ---`);
    });
    this.analyzeIndirectOverflowCauses();
  }
  /**
   * Analyze indirect causes of overflow
   */
  analyzeIndirectOverflowCauses() {
    this.logDebugInfo("--- INDIRECT OVERFLOW CAUSE ANALYSIS ---");
    const elementsWithSpacing = Array.from(this.document.querySelectorAll("*")).filter((el) => {
      const style2 = window.getComputedStyle(el);
      const marginLeft = parseFloat(style2.marginLeft);
      const marginRight = parseFloat(style2.marginRight);
      const paddingLeft = parseFloat(style2.paddingLeft);
      const paddingRight = parseFloat(style2.paddingRight);
      return Math.abs(marginLeft) > 50 || Math.abs(marginRight) > 50 || paddingLeft > 50 || paddingRight > 50;
    });
    if (elementsWithSpacing.length > 0) {
      this.logDebugInfo(`Found ${elementsWithSpacing.length} elements with large spacing:`);
      elementsWithSpacing.forEach((el, index) => {
        const element = el;
        const style2 = window.getComputedStyle(element);
        this.logDebugInfo(`${index + 1}. ${element.tagName}.${element.className || "no-class"}`);
        this.logDebugInfo(`   Margin: ${style2.marginLeft} ${style2.marginTop} ${style2.marginRight} ${style2.marginBottom}`);
        this.logDebugInfo(`   Padding: ${style2.paddingLeft} ${style2.paddingTop} ${style2.paddingRight} ${style2.paddingBottom}`);
      });
    }
    const viewportMeta = this.document.querySelector('meta[name="viewport"]');
    if (viewportMeta) {
      this.logDebugInfo(`Viewport meta tag content: ${viewportMeta.content}`);
    } else {
      this.logDebugInfo("\u26A0\uFE0F No viewport meta tag found");
    }
  }
  /**
   * Analyze specific element for overflow
   */
  analyzeElementOverflow(element, name) {
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
      this.logDebugInfo(`  \u26A0\uFE0F HORIZONTAL OVERFLOW: scrollWidth (${element.scrollWidth}) > clientWidth (${element.clientWidth})`);
    }
    if (rect.right > window.innerWidth) {
      this.logDebugInfo(`  \u26A0\uFE0F ELEMENT EXTENDS BEYOND VIEWPORT: right (${rect.right}) > viewport (${window.innerWidth})`);
    }
  }
  /**
   * Log current scrollbar state
   */
  logScrollbarState() {
    this.logDebugInfo("--- SCROLLBAR STATE ---");
    this.logDebugInfo(`Window scroll: X=${window.scrollX}, Y=${window.scrollY}`);
    this.logDebugInfo(`Document scroll dimensions: ${this.document.documentElement.scrollWidth}x${this.document.documentElement.scrollHeight}`);
    this.logDebugInfo(`Viewport dimensions: ${window.innerWidth}x${window.innerHeight}`);
    if (this.document.documentElement.scrollWidth > window.innerWidth) {
      this.logDebugInfo("\u{1F525} HORIZONTAL SCROLLBAR IS PRESENT!");
    } else {
      this.logDebugInfo("\u2705 No horizontal scrollbar detected");
    }
  }
  /**
   * Log scroll state changes
   */
  logScrollState() {
    if (window.scrollX > 0) {
      this.logDebugInfo(`\u{1F6A8} HORIZONTAL SCROLL DETECTED: scrollX=${window.scrollX}`);
    }
  }
  /**
   * Detect potential culprits causing overflow
   */
  detectPotentialCulprits() {
    this.logDebugInfo("--- DETECTING POTENTIAL CULPRITS ---");
    const musicPlayer = this.document.querySelector("app-music-player");
    if (musicPlayer) {
      this.logDebugInfo("Music Player Analysis:");
      const playerChildren = Array.from(musicPlayer.querySelectorAll("*"));
      playerChildren.forEach((child, index) => {
        const rect = child.getBoundingClientRect();
        if (rect.width > window.innerWidth || rect.right > window.innerWidth) {
          const computedStyle = window.getComputedStyle(child);
          this.logDebugInfo(`  Culprit ${index}: ${child.tagName}.${child.className} - width: ${rect.width}px, right: ${rect.right}px, transform: ${computedStyle.transform}`);
        }
      });
    }
    const transformElements = Array.from(this.document.querySelectorAll("*")).filter((el) => {
      const style2 = window.getComputedStyle(el);
      return style2.transform !== "none" && style2.transform !== "matrix(1, 0, 0, 1, 0, 0)";
    });
    this.logDebugInfo(`Found ${transformElements.length} elements with transforms`);
    transformElements.forEach((el, index) => {
      const computedStyle = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      this.logDebugInfo(`  Transform ${index}: ${el.tagName}.${el.className} - transform: ${computedStyle.transform}, bounds: ${rect.right}px`);
    });
  }
  /**
   * Monitor element changes continuously
   */
  monitorElementChanges() {
    if (this.document.documentElement.scrollWidth > window.innerWidth) {
      this.logDebugInfo(`\u{1F525} CONTINUOUS MONITORING: Horizontal overflow still present (${this.document.documentElement.scrollWidth} > ${window.innerWidth})`);
      const overflowAmount = this.document.documentElement.scrollWidth - window.innerWidth;
      this.logDebugInfo(`Overflow amount: ${overflowAmount}px`);
    }
  }
  /**
   * Save debug log to file for user analysis
   */
  saveDebugLogToFile() {
    const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[:.]/g, "-");
    const filename = `phantasia2-debug-enhanced-${timestamp}.log`;
    this.logDebugInfo("=== ENHANCED DEBUG SUMMARY ===");
    this.logDebugInfo(`Total log entries: ${this.debugLog.length}`);
    this.logDebugInfo(`Document final scrollWidth: ${this.document.documentElement.scrollWidth}`);
    this.logDebugInfo(`Viewport final width: ${window.innerWidth}`);
    this.logDebugInfo(`Final overflow amount: ${this.document.documentElement.scrollWidth - window.innerWidth}px`);
    this.logDebugInfo(`Loading screen phase: ${this.loadingScreenPhase}`);
    this.logDebugInfo(`Loading screen present: ${this.isLoadingScreenPresent}`);
    const logContent = this.debugLog.join("\n");
    const blob = new Blob([logContent], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const link = this.document.createElement("a");
    link.href = url;
    link.download = filename;
    link.style.display = "none";
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
  cleanup() {
    if (this.elementMonitoringInterval) {
      clearInterval(this.elementMonitoringInterval);
      this.elementMonitoringInterval = null;
    }
  }
};

// src/app/pages/collections/phantasia/pages/phantasia2/phantasia2.ts
var _c0 = ["backgroundVideo"];
var _c1 = ["titleVideo"];
var _c2 = ["cdShowcase"];
function Phantasia2Component_app_loading_screen_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-loading-screen", 5);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275property("progress", ctx_r0.loadingProgress);
  }
}
function Phantasia2Component_div_1_app_site_header_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-site-header");
  }
}
function Phantasia2Component_div_1_div_16_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 51);
    \u0275\u0275listener("click", function Phantasia2Component_div_1_div_16_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.scrollToContent());
    });
    \u0275\u0275elementStart(1, "div", 52);
    \u0275\u0275text(2, "Scroll for More");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 53);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(4, "svg", 54);
    \u0275\u0275element(5, "path", 55);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275property("@scrollIndicator", ctx_r0.scrollIndicatorState);
  }
}
function Phantasia2Component_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 6);
    \u0275\u0275template(1, Phantasia2Component_div_1_app_site_header_1_Template, 1, 0, "app-site-header", 7);
    \u0275\u0275elementStart(2, "div", 8)(3, "video", 9, 0);
    \u0275\u0275listener("loadedmetadata", function Phantasia2Component_div_1_Template_video_loadedmetadata_3_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onVideoLoaded());
    })("canplay", function Phantasia2Component_div_1_Template_video_canplay_3_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onVideoLoaded());
    });
    \u0275\u0275element(5, "source", 10)(6, "source", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "div", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "section", 13)(9, "div", 14)(10, "video", 15, 1);
    \u0275\u0275listener("loadedmetadata", function Phantasia2Component_div_1_Template_video_loadedmetadata_10_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onTitleVideoLoaded());
    })("canplay", function Phantasia2Component_div_1_Template_video_canplay_10_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onTitleVideoCanPlay());
    })("ended", function Phantasia2Component_div_1_Template_video_ended_10_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.onTitleVideoEnded());
    });
    \u0275\u0275element(12, "source", 16)(13, "source", 17)(14, "img", 18);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(15, "section", 19);
    \u0275\u0275template(16, Phantasia2Component_div_1_div_16_Template, 6, 1, "div", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 21)(18, "section", 22, 2)(20, "h2", 23);
    \u0275\u0275text(21, "The highly anticipated sequel");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 24)(23, "div", 25)(24, "div", 26)(25, "div", 27)(26, "div", 28);
    \u0275\u0275element(27, "img", 29);
    \u0275\u0275elementEnd()();
    \u0275\u0275element(28, "div", 30);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 31)(30, "div", 32)(31, "div", 33)(32, "h3", 34);
    \u0275\u0275text(33, '"Defining your justice."');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "p", 35);
    \u0275\u0275text(35, "A fantasy compilation album");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(36, "div", 36)(37, "div", 37)(38, "mat-icon");
    \u0275\u0275text(39, "music_note");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "span");
    \u0275\u0275text(41, "20 Tracks");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 37)(43, "mat-icon");
    \u0275\u0275text(44, "schedule");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(45, "span");
    \u0275\u0275text(46, "83 Minutes");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "div", 37)(48, "mat-icon");
    \u0275\u0275text(49, "style");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "span");
    \u0275\u0275text(51, "Ambient Fantasy Orchestral");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(52, "div", 38);
    \u0275\u0275element(53, "app-music-player");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(54, "section", 39)(55, "app-special-mentions");
    \u0275\u0275element(56, "app-dynamic-artist-cards", 40);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "footer", 41)(58, "div", 42)(59, "div", 43);
    \u0275\u0275element(60, "img", 44);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "div", 45)(62, "div", 46)(63, "h3");
    \u0275\u0275text(64, "Explore");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(65, "ul")(66, "li")(67, "a", 47);
    \u0275\u0275text(68, "Collections");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(69, "li")(70, "a", 48);
    \u0275\u0275text(71, "About");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(72, "div", 46)(73, "h3");
    \u0275\u0275text(74, "Legal");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(75, "ul")(76, "li")(77, "a", 49);
    \u0275\u0275text(78, "Privacy Policy");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(79, "li")(80, "a", 49);
    \u0275\u0275text(81, "Terms of Use");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(82, "div", 50);
    \u0275\u0275text(83);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.isInsidePhantasiaLayout);
    \u0275\u0275advance(2);
    \u0275\u0275property("loop", true);
    \u0275\u0275advance(13);
    \u0275\u0275property("ngIf", ctx_r0.showScrollIndicator());
    \u0275\u0275advance(40);
    \u0275\u0275property("showAllArtists", false)("maxVisibleCards", 8)("enableAnimations", true)("displayMode", ctx_r0.artistDisplayMode());
    \u0275\u0275advance(27);
    \u0275\u0275textInterpolate1(" \xA9 ", ctx_r0.currentYear, " Prismatic Collections. All rights reserved. ");
  }
}
var _Phantasia2Component = class _Phantasia2Component {
  get loadingActive() {
    return this.isLoading;
  }
  constructor(cdr, router, document2, audioService, dynamicArtistService) {
    this.cdr = cdr;
    this.router = router;
    this.document = document2;
    this.audioService = audioService;
    this.dynamicArtistService = dynamicArtistService;
    this.isLoading = true;
    this.loadingProgress = 0;
    this.videoLoaded = false;
    this.videoElement = null;
    this.userHasInteracted = false;
    this.autoplayFailed = false;
    this.titleVideoElement = null;
    this.titleAutoplayFailed = false;
    this.scrollIndicatorState = "hidden";
    this.showScrollIndicator = signal(true, ...ngDevMode ? [{ debugName: "showScrollIndicator" }] : []);
    this.scrollState = "top";
    this.isAutoScrolling = false;
    this.scrollLocked = false;
    this.scrollThreshold = 50;
    this.contentScrollThreshold = 200;
    this.scrollTimeoutId = null;
    this.wheelTimeoutId = null;
    this.lastScrollY = 0;
    this.lastWheelTime = 0;
    this.scrollDirection = null;
    this.touchStartY = 0;
    this.touchEndY = 0;
    this.isScrollSnapping = false;
    this.lastScrollTime = 0;
    this.scrollSections = [];
    this.isDebugMode = false;
    this.debugSystem = null;
    this.componentClass = true;
    this.albumPageClass = true;
    this.currentYear = (/* @__PURE__ */ new Date()).getFullYear();
    this.artistDisplayMode = signal("showcase", ...ngDevMode ? [{ debugName: "artistDisplayMode" }] : []);
  }
  ngOnInit() {
    if (this.isDebugMode) {
      console.log(`[Phantasia2Component] Current URL: ${this.router.url}`);
    }
    this.dynamicArtistService.setCurrentProject("phantasia2");
    if (this.isDebugMode) {
      console.log(`[Phantasia2Component] Set project to phantasia2 - will load 20 tracks`);
    }
    if (typeof document !== "undefined") {
      document.body.classList.add("phantasia-album-page");
      if (this.isDebugMode) {
        console.log(`[Phantasia2Component] Added phantasia-album-page class to body`);
      }
    }
    this.setupUserInteractionDetection();
    this.startLoadingSequence();
    setTimeout(() => {
      this.scrollIndicatorState = "visible";
      this.cdr.markForCheck();
    }, 2e3);
    this.setupSmoothScrolling();
    this.initializeTwoStateScroll();
    this.resetToTop();
    this.initializeDynamicArtistSystem();
    this.setupArtistDisplayModeLogic();
    if (this.isDebugMode) {
      this.debugSystem = new Phantasia2Debug(this.document);
      this.debugSystem.startDebugMonitoring().then(() => {
        console.log("[PHANTASIA2] Enhanced debug monitoring fully initialized");
      }).catch((error) => {
        console.error("[PHANTASIA2] Debug monitoring initialization failed:", error);
      });
    }
  }
  /**
   * Determines if this component is inside the PhantasiaLayout
   */
  get isInsidePhantasiaLayout() {
    return this.router.url.includes("/phantasia/");
  }
  /**
   * Handle video loaded event for seamless background playback
   */
  onVideoLoaded() {
    if (this.backgroundVideo?.nativeElement) {
      this.videoElement = this.backgroundVideo.nativeElement;
      this.videoLoaded = true;
      this.videoElement.muted = true;
      this.videoElement.style.opacity = "0";
      this.attemptVideoPlay();
      this.setupVideoLoop();
    }
  }
  /**
   * Setup seamless video looping with fade transitions
   */
  setupVideoLoop() {
    if (!this.videoElement)
      return;
    this.videoElement.addEventListener("timeupdate", () => {
      if (!this.videoElement)
        return;
      const timeRemaining = this.videoElement.duration - this.videoElement.currentTime;
      if (timeRemaining <= 1 && timeRemaining > 0.5) {
        this.videoElement.style.transition = "opacity 1s ease-out";
        this.videoElement.style.opacity = "0.3";
      }
    });
    this.videoElement.addEventListener("ended", () => {
      if (!this.videoElement)
        return;
      this.videoElement.currentTime = 0;
      this.videoElement.style.opacity = "0";
      if (!this.autoplayFailed || this.userHasInteracted) {
        this.videoElement.play().then(() => {
          if (this.videoElement) {
            this.videoElement.style.transition = "opacity 1.5s ease-in";
            this.videoElement.style.opacity = "1";
          }
        }).catch((error) => {
          if (this.isDebugMode) {
            console.warn("[Phantasia2Component] Video replay failed:", error);
          }
        });
      }
    });
  }
  /**
   * Attempt to play video with proper error handling
   */
  attemptVideoPlay() {
    if (!this.videoElement)
      return;
    const playPromise = this.videoElement.play();
    if (playPromise !== void 0) {
      playPromise.then(() => {
        this.autoplayFailed = false;
        if (this.isDebugMode) {
          console.log("[Phantasia2Component] Video autoplay succeeded");
        }
        this.fadeInVideo();
      }).catch((error) => {
        this.autoplayFailed = true;
        if (this.isDebugMode) {
          console.log("[Phantasia2Component] Video autoplay failed (expected):", error.name);
          console.log("[Phantasia2Component] Video will start after user interaction");
        }
        this.showVideoWithoutPlay();
      });
    }
  }
  /**
   * Fade in video after successful play
   */
  fadeInVideo() {
    if (!this.videoElement)
      return;
    setTimeout(() => {
      if (this.videoElement) {
        this.videoElement.style.transition = "opacity 2s ease-in-out";
        this.videoElement.style.opacity = "1";
      }
    }, 100);
  }
  /**
   * Show video element without playing (fallback for autoplay failure)
   */
  showVideoWithoutPlay() {
    if (!this.videoElement)
      return;
    this.videoElement.currentTime = 0;
    setTimeout(() => {
      if (this.videoElement) {
        this.videoElement.style.transition = "opacity 1s ease-in-out";
        this.videoElement.style.opacity = "0.8";
      }
    }, 100);
  }
  /**
   * Set up user interaction detection to enable video playback
   */
  setupUserInteractionDetection() {
    const handleFirstInteraction = () => {
      if (!this.userHasInteracted) {
        this.userHasInteracted = true;
        if (this.isDebugMode) {
          console.log("[Phantasia2Component] User interaction detected");
        }
        if (this.autoplayFailed && this.videoElement) {
          this.attemptVideoPlayAfterInteraction();
        }
        if (this.titleAutoplayFailed && this.titleVideoElement) {
          this.attemptTitleVideoPlayAfterInteraction();
        }
        this.document.removeEventListener("click", handleFirstInteraction);
        this.document.removeEventListener("touchstart", handleFirstInteraction);
        this.document.removeEventListener("keydown", handleFirstInteraction);
      }
    };
    this.document.addEventListener("click", handleFirstInteraction, { passive: true });
    this.document.addEventListener("touchstart", handleFirstInteraction, { passive: true });
    this.document.addEventListener("keydown", handleFirstInteraction, { passive: true });
  }
  /**
   * Attempt to play video after user interaction
   */
  attemptVideoPlayAfterInteraction() {
    if (!this.videoElement)
      return;
    this.videoElement.play().then(() => {
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Video started after user interaction");
      }
      this.fadeInVideo();
    }).catch((error) => {
      if (this.isDebugMode) {
        console.warn("[Phantasia2Component] Video play failed even after user interaction:", error);
      }
    });
  }
  /**
   * Start the loading sequence with progress simulation
   */
  startLoadingSequence() {
    this.isLoading = true;
    this.loadingProgress = 0;
    const progressInterval = setInterval(() => {
      this.loadingProgress += Math.random() * 15;
      if (this.loadingProgress >= 100) {
        this.loadingProgress = 100;
        clearInterval(progressInterval);
        setTimeout(() => {
          this.isLoading = false;
          this.cdr.markForCheck();
          if (this.isDebugMode) {
            console.log("[Phantasia2Component] Loading complete, showing main content");
          }
        }, 500);
      }
      this.cdr.markForCheck();
    }, 200);
    if (this.isDebugMode) {
      console.log("[Phantasia2Component] Loading sequence started");
    }
  }
  /**
   * Handle title video loaded metadata
   */
  onTitleVideoLoaded() {
    if (this.titleVideo?.nativeElement) {
      this.titleVideoElement = this.titleVideo.nativeElement;
      this.titleVideoElement.muted = true;
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Title video loaded");
      }
    }
  }
  /**
   * Handle title video can play event
   */
  onTitleVideoCanPlay() {
    if (this.titleVideoElement) {
      this.attemptTitleVideoPlay();
    }
  }
  /**
   * Attempt to play title video with error handling
   */
  attemptTitleVideoPlay() {
    if (!this.titleVideoElement)
      return;
    const playPromise = this.titleVideoElement.play();
    if (playPromise !== void 0) {
      playPromise.then(() => {
        this.titleAutoplayFailed = false;
        if (this.isDebugMode) {
          console.log("[Phantasia2Component] Title video autoplay succeeded");
        }
      }).catch((error) => {
        this.titleAutoplayFailed = true;
        if (this.isDebugMode) {
          console.log("[Phantasia2Component] Title video autoplay failed (expected):", error.name);
        }
      });
    }
  }
  /**
   * Attempt to play title video after user interaction
   */
  attemptTitleVideoPlayAfterInteraction() {
    if (!this.titleVideoElement)
      return;
    this.titleVideoElement.play().then(() => {
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Title video started after user interaction");
      }
    }).catch((error) => {
      if (this.isDebugMode) {
        console.warn("[Phantasia2Component] Title video play failed even after user interaction:", error);
      }
    });
  }
  /**
   * Handle title video ended event - keep video visible, no compacting
   */
  onTitleVideoEnded() {
    if (this.isDebugMode) {
      console.log("[Phantasia2Component] Title video playback completed - keeping video visible");
    }
  }
  /**
   * Set up smooth scrolling behavior for the page
   */
  setupSmoothScrolling() {
    if (typeof document !== "undefined") {
      document.documentElement.style.scrollBehavior = "smooth";
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Smooth scrolling enabled globally");
      }
    }
  }
  /**
   * Initialize the two-state scroll system
   */
  initializeTwoStateScroll() {
    if (typeof window === "undefined")
      return;
    this.handleScroll = this.handleScroll.bind(this);
    this.handleWheel = this.handleWheel.bind(this);
    this.handleKeyboard = this.handleKeyboard.bind(this);
    this.handleTouchStart = this.handleTouchStart.bind(this);
    this.handleTouchEnd = this.handleTouchEnd.bind(this);
    window.addEventListener("scroll", this.handleScroll, { passive: false });
    window.addEventListener("wheel", this.handleWheel, { passive: false });
    window.addEventListener("keydown", this.handleKeyboard, { passive: false });
    window.addEventListener("touchstart", this.handleTouchStart, { passive: true });
    window.addEventListener("touchend", this.handleTouchEnd, { passive: false });
    this.lastScrollY = window.scrollY;
    this.updateScrollState();
    if (this.isDebugMode) {
      console.log("[Phantasia2Component] Two-state scroll system initialized");
      console.log("[Phantasia2Component] Initial scroll state:", this.scrollState);
    }
  }
  /**
   * Handle scroll events for two-state system
   */
  handleScroll(event) {
    if (this.isAutoScrolling || this.scrollLocked)
      return;
    const currentScrollY = window.scrollY;
    const scrollDelta = currentScrollY - this.lastScrollY;
    if (Math.abs(scrollDelta) > 5) {
      this.scrollDirection = scrollDelta > 0 ? "down" : "up";
    }
    this.checkScrollTriggers(currentScrollY);
    this.lastScrollY = currentScrollY;
  }
  /**
   * Handle wheel events for immediate response
   */
  handleWheel(event) {
    if (this.isAutoScrolling || this.scrollLocked) {
      event.preventDefault();
      return;
    }
    const now = Date.now();
    if (now - this.lastWheelTime < 50)
      return;
    this.lastWheelTime = now;
    const scrollingDown = event.deltaY > 0;
    const currentScrollY = window.scrollY;
    if (this.scrollState === "top" && scrollingDown && Math.abs(event.deltaY) > 10) {
      event.preventDefault();
      this.scrollToContent();
      return;
    }
    if (this.scrollState === "content" && !scrollingDown) {
      const cdShowcase = this.cdShowcase?.nativeElement;
      if (cdShowcase) {
        const showcaseRect = cdShowcase.getBoundingClientRect();
        if (showcaseRect.top > this.contentScrollThreshold) {
          event.preventDefault();
          this.scrollToTop();
          return;
        }
      }
    }
  }
  /**
   * Handle keyboard navigation
   */
  handleKeyboard(event) {
    if (this.isAutoScrolling || this.scrollLocked) {
      if (["ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " "].includes(event.key)) {
        event.preventDefault();
      }
      return;
    }
    const currentScrollY = window.scrollY;
    switch (event.key) {
      case "ArrowDown":
      case "PageDown":
      case " ":
        if (this.scrollState === "top") {
          event.preventDefault();
          this.scrollToContent();
        }
        break;
      case "ArrowUp":
      case "PageUp":
        if (this.scrollState === "content") {
          const cdShowcase = this.cdShowcase?.nativeElement;
          if (cdShowcase) {
            const showcaseRect = cdShowcase.getBoundingClientRect();
            if (showcaseRect.top > this.contentScrollThreshold) {
              event.preventDefault();
              this.scrollToTop();
            }
          }
        }
        break;
      case "Home":
        event.preventDefault();
        this.scrollToTop();
        break;
      case "End":
        if (this.scrollState === "top") {
          event.preventDefault();
          this.scrollToContent();
        }
        break;
    }
  }
  /**
   * Handle touch start for mobile gestures
   */
  handleTouchStart(event) {
    this.touchStartY = event.touches[0].clientY;
  }
  /**
   * Handle touch end for mobile gestures
   */
  handleTouchEnd(event) {
    if (this.isAutoScrolling || this.scrollLocked) {
      event.preventDefault();
      return;
    }
    this.touchEndY = event.changedTouches[0].clientY;
    const swipeDistance = this.touchStartY - this.touchEndY;
    const swipeThreshold = 50;
    if (swipeDistance > swipeThreshold && this.scrollState === "top") {
      event.preventDefault();
      this.scrollToContent();
    }
    if (swipeDistance < -swipeThreshold && this.scrollState === "content") {
      const cdShowcase = this.cdShowcase?.nativeElement;
      if (cdShowcase) {
        const showcaseRect = cdShowcase.getBoundingClientRect();
        if (showcaseRect.top > this.contentScrollThreshold) {
          event.preventDefault();
          this.scrollToTop();
        }
      }
    }
  }
  /**
   * Check if auto-scroll should be triggered based on current position
   */
  checkScrollTriggers(currentScrollY) {
    this.updateScrollState();
    if (currentScrollY > this.scrollThreshold && this.scrollState === "top") {
      this.scrollToContent();
    } else if (this.scrollState === "content") {
      const cdShowcase = this.cdShowcase?.nativeElement;
      if (cdShowcase && this.scrollDirection === "up") {
        const showcaseRect = cdShowcase.getBoundingClientRect();
        if (showcaseRect.top > this.contentScrollThreshold) {
          this.scrollToTop();
        }
      }
    }
  }
  /**
   * Update the current scroll state based on position
   */
  updateScrollState() {
    const currentScrollY = window.scrollY;
    const cdShowcase = this.cdShowcase?.nativeElement;
    if (currentScrollY <= this.scrollThreshold) {
      this.scrollState = "top";
    } else if (cdShowcase) {
      const showcaseRect = cdShowcase.getBoundingClientRect();
      if (showcaseRect.top <= this.contentScrollThreshold) {
        this.scrollState = "content";
      }
    }
    if (this.isDebugMode) {
      console.log("[Phantasia2Component] Scroll state updated:", this.scrollState, "at position:", currentScrollY);
    }
  }
  /**
   * Auto-scroll to the top of the page
   */
  scrollToTop() {
    if (this.isAutoScrolling)
      return;
    this.isAutoScrolling = true;
    this.scrollLocked = true;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    if (this.isDebugMode) {
      console.log("[Phantasia2Component] Auto-scrolling to top");
    }
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
    this.showScrollIndicator.set(true);
    this.scrollIndicatorState = "visible";
    this.cdr.markForCheck();
    setTimeout(() => {
      this.isAutoScrolling = false;
      this.scrollLocked = false;
      this.scrollState = "top";
      this.lastScrollY = 0;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.width = "";
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Arrived at top, scroll unlocked");
      }
    }, 1e3);
  }
  /**
   * Reset scroll position to top on initial load
   */
  resetToTop() {
    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      this.scrollState = "top";
      this.lastScrollY = 0;
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Reset to top position");
      }
    }
  }
  /**
   * Set up section snapping functionality (DEPRECATED - replaced by two-state system)
   */
  setupSectionSnapping() {
    if (typeof document === "undefined")
      return;
    const videoSection = document.querySelector(".video-title-section");
    const cdSection = this.cdShowcase?.nativeElement;
    const artistSection = document.querySelector(".artist-section");
    this.scrollSections = [videoSection, cdSection, artistSection].filter((section) => section !== null && section !== void 0);
    if (this.scrollSections.length === 0) {
      if (this.isDebugMode) {
        console.warn("[Phantasia2Component] No scroll sections found for snapping");
      }
      return;
    }
    if (this.isDebugMode) {
      console.log("[Phantasia2Component] Section snapping set up with", this.scrollSections.length, "sections");
    }
    const albumPage = document.querySelector(".phantasia-album-page");
    if (albumPage) {
      albumPage.addEventListener("scroll", this.handleSectionSnap.bind(this), { passive: false });
      albumPage.addEventListener("wheel", this.handleWheelSnap.bind(this), { passive: false });
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Scroll event listeners added for section snapping");
      }
    } else {
      window.addEventListener("scroll", this.handleSectionSnap.bind(this), { passive: false });
      window.addEventListener("wheel", this.handleWheelSnap.bind(this), { passive: false });
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Window scroll event listeners added for section snapping (fallback)");
      }
    }
  }
  /**
   * Handle section snapping on scroll
   */
  handleSectionSnap() {
    if (this.isScrollSnapping)
      return;
    if (this.scrollTimeoutId) {
      clearTimeout(this.scrollTimeoutId);
    }
    this.scrollTimeoutId = window.setTimeout(() => {
      this.performSectionSnap();
    }, 150);
  }
  /**
   * Handle wheel events for immediate snapping
   */
  handleWheelSnap(event) {
    if (Math.abs(event.deltaY) < 10)
      return;
    const now = Date.now();
    if (now - this.lastScrollTime < 500)
      return;
    this.lastScrollTime = now;
    const scrollingDown = event.deltaY > 0;
    const currentSection = this.getCurrentSection();
    const currentIndex = this.scrollSections.indexOf(currentSection);
    if (currentIndex === -1)
      return;
    let targetIndex = currentIndex;
    if (scrollingDown && currentIndex < this.scrollSections.length - 1) {
      targetIndex = currentIndex + 1;
    } else if (!scrollingDown && currentIndex > 0) {
      targetIndex = currentIndex - 1;
    }
    if (targetIndex !== currentIndex) {
      event.preventDefault();
      this.snapToSection(this.scrollSections[targetIndex]);
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Wheel snap to section", targetIndex);
      }
    }
  }
  /**
   * Perform section snapping to the nearest section
   */
  performSectionSnap() {
    if (this.isScrollSnapping || this.scrollSections.length === 0)
      return;
    const nearestSection = this.getNearestSection();
    if (nearestSection) {
      this.snapToSection(nearestSection);
    }
  }
  /**
   * Get the current section based on scroll position
   */
  getCurrentSection() {
    const albumPage = document.querySelector(".phantasia-album-page");
    const scrollTop = albumPage ? albumPage.scrollTop : window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const threshold = viewportHeight * 0.3;
    for (const section of this.scrollSections) {
      const sectionRect = section.getBoundingClientRect();
      const sectionTop = albumPage ? sectionRect.top + scrollTop : section.offsetTop;
      if (scrollTop >= sectionTop - threshold && scrollTop < sectionTop + section.offsetHeight - threshold) {
        return section;
      }
    }
    return this.scrollSections[0];
  }
  /**
   * Get the nearest section to snap to
   */
  getNearestSection() {
    if (this.scrollSections.length === 0)
      return null;
    const albumPage = document.querySelector(".phantasia-album-page");
    const scrollTop = albumPage ? albumPage.scrollTop : window.pageYOffset;
    const viewportHeight = window.innerHeight;
    const snapPoint = scrollTop + viewportHeight * 0.5;
    let nearestSection = this.scrollSections[0];
    let minDistance = Infinity;
    for (const section of this.scrollSections) {
      const sectionRect = section.getBoundingClientRect();
      const sectionCenter = albumPage ? sectionRect.top + scrollTop + section.offsetHeight * 0.5 : section.offsetTop + section.offsetHeight * 0.5;
      const distance = Math.abs(snapPoint - sectionCenter);
      if (distance < minDistance) {
        minDistance = distance;
        nearestSection = section;
      }
    }
    return nearestSection;
  }
  /**
   * Snap to a specific section
   */
  snapToSection(section) {
    if (this.isScrollSnapping)
      return;
    this.isScrollSnapping = true;
    const albumPage = document.querySelector(".phantasia-album-page");
    const sectionRect = section.getBoundingClientRect();
    let targetScrollTop;
    if (albumPage) {
      targetScrollTop = sectionRect.top + albumPage.scrollTop - window.innerHeight * 0.1;
      albumPage.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth"
      });
    } else {
      targetScrollTop = section.offsetTop - window.innerHeight * 0.1;
      window.scrollTo({
        top: Math.max(0, targetScrollTop),
        behavior: "smooth"
      });
    }
    if (this.isDebugMode) {
      console.log("[Phantasia2Component] Snapping to section at position:", targetScrollTop);
    }
    setTimeout(() => {
      this.isScrollSnapping = false;
    }, 1e3);
  }
  /**
   * Smooth scroll to CD showcase section with two-state system
   */
  scrollToContent() {
    if (this.isAutoScrolling)
      return;
    this.isAutoScrolling = true;
    this.scrollLocked = true;
    const currentScrollY = window.scrollY;
    document.body.style.overflow = "hidden";
    document.body.style.position = "fixed";
    document.body.style.width = "100%";
    document.body.style.top = `-${currentScrollY}px`;
    if (this.isDebugMode) {
      console.log("[Phantasia2Component] Auto-scrolling to content section");
    }
    const albumPresentation = document.querySelector(".album-presentation");
    const cdShowcase = this.cdShowcase?.nativeElement;
    let targetPosition = 0;
    if (albumPresentation) {
      targetPosition = albumPresentation.offsetTop - 100;
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Using album presentation position:", albumPresentation.offsetTop);
      }
    } else if (cdShowcase) {
      let element = cdShowcase;
      let offsetTop = 0;
      while (element) {
        offsetTop += element.offsetTop;
        element = element.offsetParent;
      }
      targetPosition = offsetTop - 100;
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Using calculated CD showcase absolute position:", offsetTop);
      }
    } else {
      targetPosition = window.innerHeight - 90;
      if (this.isDebugMode) {
        console.warn("[Phantasia2Component] Using fallback viewport-based position");
      }
    }
    document.body.style.position = "";
    document.body.style.top = "";
    window.scrollTo(0, currentScrollY);
    window.scrollTo({
      top: Math.max(0, targetPosition),
      behavior: "smooth"
    });
    this.hideScrollIndicatorAfterUse();
    setTimeout(() => {
      this.isAutoScrolling = false;
      this.scrollLocked = false;
      this.scrollState = "content";
      this.lastScrollY = window.scrollY;
      document.body.style.overflow = "";
      document.body.style.width = "";
      if (this.isDebugMode) {
        console.log("[Phantasia2Component] Arrived at content, scroll unlocked");
      }
    }, 1200);
  }
  /**
   * Hide scroll indicator after user interaction
   */
  hideScrollIndicatorAfterUse() {
    this.showScrollIndicator.set(false);
    this.scrollIndicatorState = "hidden";
    this.cdr.markForCheck();
    if (this.isDebugMode) {
      console.log("[Phantasia2Component] Scroll indicator hidden after use");
    }
  }
  /**
   * Initialize the dynamic artist system
   */
  initializeDynamicArtistSystem() {
    if (this.isDebugMode) {
      console.log("[Phantasia2Component] Initializing dynamic artist system");
    }
  }
  /**
   * Set up artist display mode switching logic
   * Default: showcase mode (all 31 artists)
   * When music plays: switch to currently-playing mode (track-specific artists)
   */
  setupArtistDisplayModeLogic() {
    this.audioService.audioState$.subscribe((audioState) => {
      if (audioState.isPlaying && audioState.currentTrack) {
        this.artistDisplayMode.set("currently-playing");
        if (this.isDebugMode) {
          console.log("[Phantasia2Component] Switched to currently-playing mode for track:", audioState.currentTrack);
        }
      } else {
        this.artistDisplayMode.set("showcase");
        if (this.isDebugMode) {
          console.log("[Phantasia2Component] Switched to showcase mode (music stopped or no track)");
        }
      }
      this.cdr.markForCheck();
    });
    if (this.isDebugMode) {
      console.log("[Phantasia2Component] Artist display mode logic initialized - starting in showcase mode");
    }
  }
  ngOnDestroy() {
    if (typeof window !== "undefined") {
      window.removeEventListener("scroll", this.handleScroll);
      window.removeEventListener("wheel", this.handleWheel);
      window.removeEventListener("keydown", this.handleKeyboard);
      window.removeEventListener("touchstart", this.handleTouchStart);
      window.removeEventListener("touchend", this.handleTouchEnd);
    }
    if (this.wheelTimeoutId) {
      clearTimeout(this.wheelTimeoutId);
      this.wheelTimeoutId = null;
    }
    if (this.debugSystem) {
      this.debugSystem.saveDebugLogToFile();
      this.debugSystem.cleanup();
      this.debugSystem = null;
    }
    if (typeof document !== "undefined") {
      document.body.classList.remove("phantasia-album-page");
      if (this.isDebugMode) {
        console.log(`[Phantasia2Component] Removed phantasia-album-page class from body`);
      }
    }
    if (this.videoElement) {
      this.videoElement.pause();
      this.videoElement.removeEventListener("timeupdate", () => {
      });
      this.videoElement.removeEventListener("ended", () => {
      });
      this.videoElement = null;
    }
    if (this.titleVideoElement) {
      this.titleVideoElement.pause();
      this.titleVideoElement = null;
    }
    if (this.scrollTimeoutId) {
      clearTimeout(this.scrollTimeoutId);
      this.scrollTimeoutId = null;
    }
    const albumPage = document.querySelector(".phantasia-album-page");
    if (albumPage) {
      albumPage.removeEventListener("scroll", this.handleSectionSnap.bind(this));
      albumPage.removeEventListener("wheel", this.handleWheelSnap.bind(this));
    } else {
      window.removeEventListener("scroll", this.handleSectionSnap.bind(this));
      window.removeEventListener("wheel", this.handleWheelSnap.bind(this));
    }
    const handleFirstInteraction = () => {
    };
    this.document.removeEventListener("click", handleFirstInteraction);
    this.document.removeEventListener("touchstart", handleFirstInteraction);
    this.document.removeEventListener("keydown", handleFirstInteraction);
    this.scrollSections = [];
    this.isScrollSnapping = false;
    this.lastScrollTime = 0;
    if (this.isDebugMode) {
      console.log(`[Phantasia2Component] Component destroyed, cleanup completed`);
    }
  }
};
_Phantasia2Component.\u0275fac = function Phantasia2Component_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _Phantasia2Component)(\u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(DOCUMENT), \u0275\u0275directiveInject(AudioService), \u0275\u0275directiveInject(DynamicArtistService));
};
_Phantasia2Component.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _Phantasia2Component, selectors: [["app-phantasia2"]], viewQuery: function Phantasia2Component_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c0, 5);
    \u0275\u0275viewQuery(_c1, 5);
    \u0275\u0275viewQuery(_c2, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.backgroundVideo = _t.first);
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.titleVideo = _t.first);
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.cdShowcase = _t.first);
  }
}, hostVars: 6, hostBindings: function Phantasia2Component_HostBindings(rf, ctx) {
  if (rf & 2) {
    \u0275\u0275classProp("phantasia2-component", ctx.componentClass)("loading-active", ctx.loadingActive)("phantasia-album-page", ctx.albumPageClass);
  }
}, decls: 2, vars: 2, consts: [["backgroundVideo", ""], ["titleVideo", ""], ["cdShowcase", ""], [3, "progress", 4, "ngIf"], ["class", "phantasia2-container", 4, "ngIf"], [3, "progress"], [1, "phantasia2-container"], [4, "ngIf"], [1, "video-background"], ["autoplay", "", "muted", "", "playsinline", "", 1, "bg-video", 3, "loadedmetadata", "canplay", "loop"], ["src", "assets/videos/phantasia2/animated_background_optimized.webm", "type", "video/webm"], ["src", "assets/videos/phantasia2/animated_background_web.mp4", "type", "video/mp4"], [1, "video-overlay"], [1, "video-title-section"], [1, "title-container"], ["autoplay", "", "muted", "", "playsinline", "", "preload", "auto", 1, "title-video", 3, "loadedmetadata", "canplay", "ended"], ["src", "assets/videos/phantasia2/ULTIMATE_alpha_with_flares.webm", "type", "video/webm"], ["src", "assets/videos/phantasia2/Phantasi2_Logo_Animated_web.mp4", "type", "video/mp4"], ["src", "assets/videos/phantasia2/Logo_fx.png", "alt", "Phantasia Project II", 1, "title-image-fallback"], [1, "scroll-indicator-section"], ["class", "scroll-indicator-container", 3, "click", 4, "ngIf"], [1, "album-presentation"], [1, "cd-showcase"], [1, "cd-showcase-title"], [1, "showcase-main-content"], [1, "album-cover-section"], [1, "cd-jacket"], [1, "jacket-3d-container"], [1, "jacket-art"], ["src", "assets/videos/phantasia2/album_cover.png", "alt", "Phantasia Project II Album Cover", 1, "album-cover"], [1, "jacket-reflection"], [1, "album-content-section"], [1, "album-info"], [1, "artist-info"], [1, "artists"], [1, "collaboration-label"], [1, "album-details"], [1, "detail-item"], [1, "music-player-section"], [1, "artist-cards-section"], [3, "showAllArtists", "maxVisibleCards", "enableAnimations", "displayMode"], [1, "phantasia-footer"], [1, "footer-content"], [1, "footer-logo"], ["src", "assets/images/logos/prismcoll_logox.svg", "alt", "Prismatic Collections"], [1, "footer-links"], [1, "link-group"], ["routerLink", "/collections"], ["routerLink", "/phantasia/phantasia2"], ["href", "#"], [1, "copyright"], [1, "scroll-indicator-container", 3, "click"], [1, "scroll-text"], [1, "triangle-separator"], ["width", "24", "height", "16", "viewBox", "0 0 24 16", "fill", "none", 1, "triangle-icon"], ["d", "M12 16L0 0H24L12 16Z", "fill", "currentColor"]], template: function Phantasia2Component_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, Phantasia2Component_app_loading_screen_0_Template, 1, 1, "app-loading-screen", 3)(1, Phantasia2Component_div_1_Template, 84, 8, "div", 4);
  }
  if (rf & 2) {
    \u0275\u0275property("ngIf", ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.isLoading);
  }
}, dependencies: [
  CommonModule,
  NgIf,
  RouterModule,
  RouterLink,
  MatCardModule,
  MatButtonModule,
  MatIconModule,
  MatIcon,
  MatChipsModule,
  MusicPlayerComponent,
  SiteHeaderComponent,
  LoadingScreenComponent,
  DynamicArtistCardsComponent,
  SpecialMentionsComponent
], styles: ['@charset "UTF-8";\n\n\n\n[_nghost-%COMP%] {\n  display: block;\n  width: 100%;\n  min-height: 100vh;\n  position: relative;\n  font-family:\n    "Inter",\n    "Roboto",\n    sans-serif;\n  background: transparent;\n  box-sizing: border-box;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding-top: 90px;\n  scrollbar-width: thin;\n  scrollbar-color: rgba(255, 255, 255, 0.8) rgba(0, 0, 0, 0.9);\n  isolation: isolate;\n}\n[_nghost-%COMP%], \n[_nghost-%COMP%]   *[_ngcontent-%COMP%] {\n  background-attachment: initial;\n}\n.scroll-locked[_nghost-%COMP%] {\n  overflow-y: hidden !important;\n  position: fixed !important;\n  width: 100% !important;\n}\n@media (max-width: 767px) {\n  [_nghost-%COMP%] {\n    padding-top: 70px;\n  }\n}\n@supports (padding-top: env(safe-area-inset-top)) {\n  [_nghost-%COMP%] {\n    padding-top: calc(90px + env(safe-area-inset-top));\n  }\n  @media (max-width: 767px) {\n    [_nghost-%COMP%] {\n      padding-top: calc(70px + env(safe-area-inset-top));\n    }\n  }\n}\n[_nghost-%COMP%]     app-site-header {\n  background: rgba(0, 0, 0, 0.8) !important;\n  backdrop-filter: blur(clamp(8px, 2vw, 12px));\n  -webkit-backdrop-filter: blur(clamp(8px, 2vw, 12px));\n}\n[_nghost-%COMP%]:has(app-loading-screen)     app-site-header {\n  z-index: 1 !important;\n}\n.loading-active[_nghost-%COMP%]     app-site-header {\n  z-index: 1 !important;\n}\n[_nghost-%COMP%]   app-loading-screen[_ngcontent-%COMP%]    ~ *[_ngcontent-%COMP%]     app-site-header, \n[_nghost-%COMP%]   app-loading-screen[_ngcontent-%COMP%]    + *[_ngcontent-%COMP%]     app-site-header {\n  z-index: 1 !important;\n}\n[_nghost-%COMP%]::-webkit-scrollbar {\n  width: clamp(8px, 1.5vw, 16px);\n  background: rgba(0, 0, 0, 0.9);\n}\n[_nghost-%COMP%]::-webkit-scrollbar-track {\n  background: rgba(0, 0, 0, 0.9);\n  border-radius: clamp(4px, 0.75vw, 8px);\n}\n[_nghost-%COMP%]::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.8);\n  border-radius: clamp(4px, 0.75vw, 8px);\n  border: clamp(1px, 0.25vw, 3px) solid rgba(0, 0, 0, 0.9);\n}\n[_nghost-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: rgba(255, 255, 255, 0.9);\n  box-shadow: 0 0 clamp(6px, 1vw, 12px) rgba(255, 255, 255, 0.3);\n}\n[_nghost-%COMP%]::-webkit-scrollbar-thumb:active {\n  background: rgb(240, 240, 240);\n}\n[_nghost-%COMP%]::-webkit-scrollbar-corner {\n  background: rgba(0, 0, 0, 0.9);\n}\n.phantasia2-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  box-sizing: border-box;\n  z-index: 1;\n}\n.phantasia2-container[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  box-sizing: border-box;\n}\n.phantasia2-container[_ngcontent-%COMP%]   .video-title-section[_ngcontent-%COMP%], \n.phantasia2-container[_ngcontent-%COMP%]   .video-title-section[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  max-width: none !important;\n}\n.video-background[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: -999;\n  overflow: hidden;\n  pointer-events: none;\n  backface-visibility: hidden;\n  transform: translateZ(0);\n  will-change: transform;\n  contain: layout style paint;\n}\n.video-background[_ngcontent-%COMP%]   .bg-video[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  min-width: 100vw;\n  min-height: 100vh;\n  width: auto;\n  height: auto;\n  z-index: 1;\n  transform: translate(-50%, -50%);\n  filter: brightness(1.05) saturate(1.08) contrast(1.03);\n  object-fit: cover;\n  opacity: 1;\n  will-change: auto;\n  backface-visibility: hidden;\n  -webkit-backface-visibility: hidden;\n}\n.video-background[_ngcontent-%COMP%]   .video-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.2);\n  z-index: 2;\n  contain: layout style paint;\n}\n@media (max-width: 768px) {\n  .video-background[_ngcontent-%COMP%] {\n    top: 0;\n    height: 100vh;\n  }\n  .video-background[_ngcontent-%COMP%]   .bg-video[_ngcontent-%COMP%] {\n    min-height: 100vh;\n  }\n}\n@media (max-width: 480px) {\n  .video-background[_ngcontent-%COMP%] {\n    top: 0;\n    height: 100vh;\n  }\n  .video-background[_ngcontent-%COMP%]   .bg-video[_ngcontent-%COMP%] {\n    min-height: 100vh;\n  }\n}\n.album-presentation[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  height: auto;\n  min-height: auto;\n  background: transparent;\n  scroll-behavior: smooth;\n  margin-top: 100vh;\n}\n@media (max-width: 768px) {\n  .album-presentation[_ngcontent-%COMP%] {\n    max-width: 100vw;\n  }\n}\n.video-title-section[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  max-width: 100vw;\n  height: calc(100vh - 90px);\n  margin-top: 0;\n  text-align: center;\n  z-index: 2;\n  contain: layout style;\n}\n.video-title-section[_ngcontent-%COMP%]   .title-container[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  will-change: transform;\n  backface-visibility: hidden;\n}\n@media (max-width: 768px) {\n  .video-title-section[_ngcontent-%COMP%]   .title-container[_ngcontent-%COMP%] {\n    transform: translate(-50%, -50%);\n    width: 100%;\n    height: 100%;\n  }\n}\n@media (max-width: 480px) {\n  .video-title-section[_ngcontent-%COMP%]   .title-container[_ngcontent-%COMP%] {\n    transform: translate(-50%, -50%);\n    width: 100%;\n    height: 100%;\n  }\n}\n.video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100vw;\n  height: 80vh;\n  max-width: min(110vw, 100% + 10vw);\n  z-index: 20;\n  margin: 0 auto;\n  object-fit: cover;\n  object-position: center center;\n  transform: translateY(10vh);\n  transform: scale(1);\n  will-change: transform, filter;\n  backface-visibility: hidden;\n  overflow: visible !important;\n  overflow-x: visible !important;\n  overflow-y: visible !important;\n  overflow-clip-margin: initial;\n  contain: layout style size;\n  filter: contrast(1.1) brightness(1.05) drop-shadow(0 0.28vw 1.11vw rgba(0, 0, 0, 0.5));\n  mix-blend-mode: screen;\n}\n@media (max-width: 768px) {\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    transform: scale(1.4);\n    width: 95vw;\n    height: 70vh;\n    object-fit: contain;\n  }\n}\n@media (max-width: 480px) {\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    width: 60vw;\n    height: 25vh;\n    max-width: 70vw;\n    transform: scale(0.6);\n    object-fit: contain;\n    margin: 0 auto;\n  }\n}\n.video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%]   .title-image-fallback[_ngcontent-%COMP%] {\n  max-width: clamp(300px, 41.67vw, 600px);\n  width: 100%;\n  height: auto;\n  margin-bottom: clamp(8px, 0.69vw, 16px);\n  filter: drop-shadow(0 0.28vw 1.11vw rgba(0, 0, 0, 0.3));\n}\n.video-title-section[_ngcontent-%COMP%]   .title-subtitle[_ngcontent-%COMP%] {\n  margin-top: clamp(0.75rem, 0.69vw, 1.25rem);\n  font-size: clamp(1.1rem, 0.9vw, 1.8rem);\n  font-weight: 300;\n  color: rgba(255, 255, 255, 0.8);\n  font-style: italic;\n  text-shadow: 0 clamp(1px, 0.14vw, 3px) clamp(6px, 0.56vw, 14px) rgba(0, 0, 0, 0.6);\n  letter-spacing: clamp(0.3px, 0.035vw, 1px);\n}\n@media (max-width: 768px) {\n  .video-title-section[_ngcontent-%COMP%]   .title-subtitle[_ngcontent-%COMP%] {\n    font-size: clamp(1.1rem, 1.5vw, 1.6rem);\n    margin-top: clamp(0.5rem, 1vh, 0.8rem);\n  }\n}\n.scroll-indicator-section[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 15vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.5rem 0;\n  margin: -20vh 0 0 0;\n  z-index: 10;\n}\n.scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%] {\n  position: relative !important;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  padding: 1rem 1.25rem;\n  transition: opacity 0.3s ease, filter 0.3s ease;\n  left: auto !important;\n  right: auto !important;\n  top: auto !important;\n  bottom: auto !important;\n  transform: none !important;\n  margin: 0 auto !important;\n}\n.scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]:hover {\n  filter: brightness(1.2) drop-shadow(0 4px 8px rgba(255, 255, 255, 0.2));\n}\n.scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .scroll-text[_ngcontent-%COMP%] {\n  font-family: "Inter", sans-serif;\n  font-size: 1.5rem;\n  font-weight: 300;\n  color: rgba(255, 255, 255, 0.8);\n  text-align: center;\n  letter-spacing: 0.05em;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n  margin: 0;\n}\n@media (max-width: 768px) {\n  .scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .scroll-text[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n}\n@media (max-width: 480px) {\n  .scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .scroll-text[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n}\n.scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .triangle-separator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0;\n}\n.scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .triangle-separator[_ngcontent-%COMP%]   .triangle-icon[_ngcontent-%COMP%] {\n  width: clamp(16px, 1.5vw, 20px);\n  height: clamp(12px, 1vw, 14px);\n  color: rgba(255, 255, 255, 0.7);\n  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));\n  animation: _ngcontent-%COMP%_bounce 2s infinite;\n}\n@media (max-width: 768px) {\n  .scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .triangle-separator[_ngcontent-%COMP%]   .triangle-icon[_ngcontent-%COMP%] {\n    width: clamp(20px, 2vw, 24px);\n    height: clamp(16px, 1.5vw, 18px);\n  }\n}\n@media (max-width: 480px) {\n  .scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .triangle-separator[_ngcontent-%COMP%]   .triangle-icon[_ngcontent-%COMP%] {\n    width: clamp(24px, 3vw, 28px);\n    height: clamp(18px, 2.2vw, 22px);\n  }\n}\n@media (max-width: 320px) {\n  .scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .triangle-separator[_ngcontent-%COMP%]   .triangle-icon[_ngcontent-%COMP%] {\n    width: 18px;\n    height: 14px;\n  }\n}\n@media (min-width: 769px) and (max-width: 1024px) {\n  .scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .triangle-separator[_ngcontent-%COMP%]   .triangle-icon[_ngcontent-%COMP%] {\n    width: clamp(18px, 1.8vw, 22px);\n    height: clamp(14px, 1.3vw, 16px);\n  }\n}\n@media (orientation: portrait) {\n  .scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .triangle-separator[_ngcontent-%COMP%]   .triangle-icon[_ngcontent-%COMP%] {\n    width: clamp(22px, 2.5vw, 26px);\n    height: clamp(16px, 1.8vw, 20px);\n  }\n}\n@media (hover: none) and (pointer: coarse) {\n  .scroll-indicator-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .triangle-separator[_ngcontent-%COMP%]   .triangle-icon[_ngcontent-%COMP%] {\n    width: clamp(20px, 2.2vw, 26px);\n    height: clamp(15px, 1.6vw, 20px);\n  }\n}\n@media (max-width: 480px) {\n  .scroll-indicator-section[_ngcontent-%COMP%] {\n    margin: -35vh 0 0 0 !important;\n  }\n}\n.cd-showcase[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.18) 0%,\n      rgba(0, 0, 0, 0.21) 25%,\n      rgba(0, 0, 0, 0.24) 50%,\n      rgba(0, 0, 0, 0.27) 100%);\n  backdrop-filter: blur(clamp(6px, 1vw, 12px)) saturate(1.2);\n  -webkit-backdrop-filter: blur(clamp(6px, 1vw, 12px)) saturate(1.2);\n  border-radius: clamp(18px, 3.5vw, 36px);\n  border: clamp(1px, 0.15vw, 2px) solid rgba(255, 255, 255, 0.15);\n  margin: clamp(2rem, 4vh, 3rem) auto clamp(1rem, 2vh, 2rem);\n  max-width: min(1800px, 95vw);\n  width: 100%;\n  padding: clamp(1rem, 2.5vh, 2rem) clamp(1rem, 3vw, 3rem) clamp(0.25rem, 1vh, 0.75rem);\n  position: relative;\n  box-sizing: border-box;\n}\n@media (max-width: 768px) {\n  .cd-showcase[_ngcontent-%COMP%] {\n    max-width: 80vw;\n    width: 80vw;\n    margin: 1rem auto;\n    padding: 2rem 1rem 0.5rem;\n    border-radius: clamp(16px, 3vw, 24px);\n  }\n}\n@media (max-width: 480px) {\n  .cd-showcase[_ngcontent-%COMP%] {\n    max-width: 85vw;\n    width: 85vw;\n    margin: 0.5rem auto;\n    padding: 1.5rem 0.75rem 0.5rem;\n    border-radius: clamp(12px, 2.5vw, 20px);\n  }\n}\n.cd-showcase[_ngcontent-%COMP%] {\n  will-change: transform, opacity;\n  backface-visibility: hidden;\n  transform: translateZ(0);\n  box-shadow:\n    0 8px 32px rgba(0, 0, 0, 0.25),\n    0 4px 16px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.1),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.05);\n  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n}\n.cd-showcase[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px) translateZ(0);\n  box-shadow:\n    0 12px 40px rgba(0, 0, 0, 0.3),\n    0 6px 20px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.15),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.08);\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%] {\n  max-width: 100%;\n  overflow-x: hidden;\n  box-sizing: border-box;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  max-width: 100%;\n  box-sizing: border-box;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .role-label {\n  color: #000000 !important;\n  background: rgba(255, 255, 255, 0.9) !important;\n  padding: 0.3rem 0.6rem !important;\n  border-radius: 6px !important;\n  text-shadow: none !important;\n  border: 1px solid rgba(0, 0, 0, 0.1) !important;\n  --color: #000000 !important;\n  --mdc-theme-primary: #000000 !important;\n  --mat-primary: #000000 !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .role-label[style*=color] {\n  color: #000000 !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .artist-name, \n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card h3, \n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card h4 {\n  color: #000000 !important;\n  background: rgba(255, 255, 255, 0.8) !important;\n  padding: 0.2rem 0.4rem !important;\n  border-radius: 4px !important;\n  text-shadow: none !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .playing-text, \n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .playing-indicator .playing-text, \n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .playing-status .playing-text, \n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .artist-info-section .playing-text {\n  color: #ffffff !important;\n  background: rgba(0, 0, 0, 0.6) !important;\n  padding: 0.2rem 0.4rem !important;\n  border-radius: 4px !important;\n  font-size: 0.75rem !important;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;\n  border: 1px solid rgba(255, 255, 255, 0.15) !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card *[style*="color: rgb(78, 205, 196)"], \n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card *[style*="color: #4ECDC4"], \n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card *[style*="color: cyan"] {\n  color: #ffffff !important;\n  background: rgba(0, 0, 0, 0.6) !important;\n  padding: 0.15rem 0.3rem !important;\n  border-radius: 3px !important;\n  border: 1px solid rgba(255, 255, 255, 0.15) !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .playing-dot {\n  background: #d40808 !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .playing-text {\n  color: #ffffff !important;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card [class*=theme-], \n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card [class*=primary], \n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .mat-primary {\n  color: #ffffff !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card *[style], \n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card *[class] {\n  color: inherit !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .artist-name, \n.cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card .role-label {\n  color: #ffffff !important;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%] {\n  max-width: 100%;\n  box-sizing: border-box;\n}\n.cd-showcase[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  max-width: 100%;\n  box-sizing: border-box;\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-showcase-title[_ngcontent-%COMP%] {\n  font-family: "Inter", sans-serif;\n  font-size: clamp(1.2rem, 1.11vw, 1.8rem);\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.85);\n  font-style: italic;\n  text-align: center;\n  margin: 0 0 clamp(1.5rem, 2.08vw, 3rem) 0;\n  text-shadow: 0 clamp(1px, 0.14vw, 3px) clamp(6px, 0.56vw, 12px) rgba(0, 0, 0, 0.7);\n  letter-spacing: clamp(0.3px, 0.035vw, 1px);\n}\n.cd-showcase[_ngcontent-%COMP%]   .showcase-main-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: stretch;\n  gap: min(3rem, 5vw);\n  min-height: clamp(350px, 60vh, 500px);\n  max-height: none;\n  max-width: 1800px;\n  margin: 0 auto;\n  width: 100%;\n}\n@media (max-width: 1024px) {\n  .cd-showcase[_ngcontent-%COMP%]   .showcase-main-content[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: center;\n    gap: 2rem;\n    text-align: center;\n    min-height: auto;\n  }\n}\n.cd-showcase[_ngcontent-%COMP%]   .album-cover-section[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: auto;\n  min-width: fit-content;\n  margin-right: clamp(0rem, 2vw, 3rem);\n}\n@media (min-width: 1025px) {\n  .cd-showcase[_ngcontent-%COMP%]   .album-cover-section[_ngcontent-%COMP%] {\n    width: clamp(420px, 32vw, 520px);\n    min-width: clamp(420px, 32vw, 480px);\n  }\n}\n@media (min-width: 2000px) {\n  .cd-showcase[_ngcontent-%COMP%]   .album-cover-section[_ngcontent-%COMP%] {\n    margin-right: clamp(2rem, 4vw, 6rem);\n  }\n}\n@media (max-width: 1024px) {\n  .cd-showcase[_ngcontent-%COMP%]   .album-cover-section[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: center;\n    margin-right: 0;\n  }\n}\n.cd-showcase[_ngcontent-%COMP%]   .album-content-section[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  min-width: 0;\n  gap: clamp(1.5rem, 3vh, 3rem);\n  margin-left: clamp(0rem, 1vw, 2rem);\n}\n@media (min-width: 1025px) {\n  .cd-showcase[_ngcontent-%COMP%]   .album-content-section[_ngcontent-%COMP%] {\n    width: 60%;\n  }\n}\n@media (min-width: 2000px) {\n  .cd-showcase[_ngcontent-%COMP%]   .album-content-section[_ngcontent-%COMP%] {\n    margin-left: clamp(1rem, 3vw, 4rem);\n  }\n}\n@media (max-width: 1024px) {\n  .cd-showcase[_ngcontent-%COMP%]   .album-content-section[_ngcontent-%COMP%] {\n    margin-left: 0;\n  }\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  min-height: clamp(140px, 20vh, 180px);\n  max-height: none;\n  overflow: visible;\n  padding: 0.5rem 0;\n  box-sizing: border-box;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%] {\n  max-width: min(900px, 85vw);\n  width: 100%;\n  display: flex;\n  align-items: center;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player-container {\n  height: auto !important;\n  min-height: clamp(140px, 20vh, 180px) !important;\n  max-height: none !important;\n  padding: 0.2rem !important;\n  margin: 0 !important;\n  overflow: visible !important;\n  box-sizing: border-box !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player {\n  height: auto !important;\n  min-height: clamp(135px, 19vh, 175px) !important;\n  max-height: none !important;\n  padding: 0.2rem !important;\n  overflow: visible !important;\n  box-sizing: border-box !important;\n  display: flex !important;\n  flex-direction: column !important;\n  gap: 0 !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .status-section {\n  display: none !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .track-section, \n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .progress-section, \n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section {\n  margin: 0 !important;\n  padding: 0 !important;\n  flex-shrink: 0 !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .track-section {\n  order: 1 !important;\n  margin-bottom: 0.1rem !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .progress-section {\n  order: 2 !important;\n  margin-bottom: 0.1rem !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section {\n  order: 3 !important;\n  max-height: clamp(28px, 4vh, 36px) !important;\n  position: relative !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section::after {\n  content: "" !important;\n  width: 120px !important;\n  flex-shrink: 0 !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .playback-controls {\n  position: absolute !important;\n  left: 50% !important;\n  top: 50% !important;\n  transform: translate(-50%, -50%) !important;\n  justify-content: center !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .control-button {\n  width: clamp(24px, 3.5vw, 32px) !important;\n  height: clamp(24px, 3.5vw, 32px) !important;\n  border-radius: 50% !important;\n  min-width: 28px !important;\n  max-width: 28px !important;\n  min-height: 28px !important;\n  max-height: 28px !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .control-button .control-icon {\n  width: clamp(14px, 2vw, 18px) !important;\n  height: clamp(14px, 2vw, 18px) !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .control-button.play-pause-button {\n  width: clamp(28px, 4vw, 36px) !important;\n  height: clamp(28px, 4vw, 36px) !important;\n  border-radius: 50% !important;\n  min-width: 32px !important;\n  max-width: 32px !important;\n  min-height: 32px !important;\n  max-height: 32px !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .control-button.play-pause-button .control-icon {\n  width: clamp(16px, 2.5vw, 20px) !important;\n  height: clamp(16px, 2.5vw, 20px) !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .volume-icon {\n  width: clamp(16px, 2.5vw, 20px) !important;\n  height: clamp(16px, 2.5vw, 20px) !important;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .volume-track {\n  width: clamp(45px, 7vw, 65px) !important;\n}\n@media (max-width: 768px) {\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%] {\n    min-height: clamp(110px, 18vh, 140px);\n    max-height: none;\n    padding: clamp(0.15rem, 0.5vh, 0.3rem) 0;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player-container {\n    min-height: clamp(115px, 17vh, 135px) !important;\n    max-height: none !important;\n    padding: clamp(0.2rem, 0.6vh, 0.35rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player {\n    height: auto !important;\n    min-height: clamp(110px, 16vh, 130px) !important;\n    max-height: none !important;\n    padding: clamp(0.2rem, 0.5vh, 0.3rem) !important;\n    display: flex !important;\n    flex-direction: column !important;\n    gap: 0 !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .track-section, \n   .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .progress-section, \n   .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section {\n    margin: 0 !important;\n    padding: 0 !important;\n    flex-shrink: 0 !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .track-section {\n    order: 1 !important;\n    margin-bottom: 0.05rem !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .track-section .track-title {\n    font-size: clamp(0.8rem, 1vw, 0.9rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .track-section .track-artist {\n    font-size: clamp(0.7rem, 0.85vw, 0.8rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .progress-section {\n    order: 2 !important;\n    margin-bottom: 0.05rem !important;\n    gap: 0.05rem !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .progress-section .time-display {\n    font-size: clamp(0.6rem, 0.7vw, 0.65rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section {\n    order: 3 !important;\n    max-height: clamp(26px, 4vh, 32px) !important;\n    gap: clamp(0.25rem, 0.6vw, 0.4rem) !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .volume-section {\n    gap: clamp(0.25rem, 0.6vw, 0.4rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .volume-section .volume-icon {\n    width: clamp(12px, 2vw, 16px);\n    height: clamp(12px, 2vw, 16px);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .volume-section .volume-control .volume-track {\n    width: clamp(35px, 6vw, 50px);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .playback-controls {\n    gap: clamp(0.3rem, 0.8vw, 0.5rem);\n    position: absolute !important;\n    left: 50% !important;\n    top: 50% !important;\n    transform: translate(-50%, -50%) !important;\n    justify-content: center !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .playback-controls .control-button {\n    width: clamp(22px, 3.5vw, 28px) !important;\n    height: clamp(22px, 3.5vw, 28px) !important;\n    border-radius: 50% !important;\n    min-width: clamp(22px, 3.5vw, 28px) !important;\n    max-width: clamp(22px, 3.5vw, 28px) !important;\n    min-height: clamp(22px, 3.5vw, 28px) !important;\n    max-height: clamp(22px, 3.5vw, 28px) !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .playback-controls .control-button .control-icon {\n    width: clamp(12px, 2vw, 16px) !important;\n    height: clamp(12px, 2vw, 16px) !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .playback-controls .control-button.play-pause-button {\n    width: clamp(26px, 4vw, 32px) !important;\n    height: clamp(26px, 4vw, 32px) !important;\n    border-radius: 50% !important;\n    min-width: clamp(26px, 4vw, 32px) !important;\n    max-width: clamp(26px, 4vw, 32px) !important;\n    min-height: clamp(26px, 4vw, 32px) !important;\n    max-height: clamp(26px, 4vw, 32px) !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .playback-controls .control-button.play-pause-button .control-icon {\n    width: clamp(14px, 2.5vw, 18px) !important;\n    height: clamp(14px, 2.5vw, 18px) !important;\n  }\n}\n@media (max-width: 480px) {\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%] {\n    max-height: clamp(70px, 12vh, 85px);\n    padding: clamp(0.15rem, 0.4vh, 0.25rem) 0;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player-container {\n    min-height: clamp(105px, 16vh, 125px) !important;\n    max-height: none !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player {\n    height: auto !important;\n    min-height: clamp(100px, 15vh, 120px) !important;\n    max-height: none !important;\n    padding: clamp(0.15rem, 0.4vh, 0.25rem) !important;\n    overflow: visible !important;\n    box-sizing: border-box !important;\n    display: flex !important;\n    flex-direction: column !important;\n    gap: 0 !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .track-section, \n   .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .progress-section, \n   .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section {\n    margin: 0 !important;\n    padding: 0 !important;\n    flex-shrink: 0 !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .track-section {\n    order: 1 !important;\n    margin-bottom: 0.05rem !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .track-section .track-title {\n    font-size: clamp(0.75rem, 0.9vw, 0.85rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .track-section .track-artist {\n    font-size: clamp(0.65rem, 0.8vw, 0.75rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .progress-section {\n    order: 2 !important;\n    margin-bottom: 0.05rem !important;\n    gap: 0.1rem;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .progress-section .time-display {\n    font-size: clamp(0.55rem, 0.65vw, 0.6rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .progress-section .progress-container .progress-track {\n    height: clamp(1.5px, 0.3vh, 2.5px);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .progress-section .progress-container .progress-track .progress-slider {\n    height: clamp(1.5px, 0.3vh, 2.5px);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section {\n    order: 3 !important;\n    max-height: clamp(24px, 4vh, 30px) !important;\n    gap: clamp(0.3rem, 0.8vw, 0.5rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .volume-section {\n    gap: clamp(0.25rem, 0.6vw, 0.4rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .volume-section .volume-icon {\n    width: clamp(12px, 2.2vw, 16px);\n    height: clamp(12px, 2.2vw, 16px);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .volume-section .volume-control .volume-track {\n    width: clamp(35px, 7vw, 45px);\n    height: clamp(1.5px, 0.4vh, 2.5px);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .volume-section .volume-control .volume-track .volume-slider {\n    height: clamp(1.5px, 0.4vh, 2.5px);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .playback-controls {\n    gap: clamp(0.3rem, 0.8vw, 0.5rem);\n    position: absolute !important;\n    left: 50% !important;\n    top: 50% !important;\n    transform: translate(-50%, -50%) !important;\n    justify-content: center !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .playback-controls .control-button {\n    width: clamp(22px, 4vw, 28px) !important;\n    height: clamp(22px, 4vw, 28px) !important;\n    border-radius: 50% !important;\n    min-width: clamp(22px, 4vw, 28px) !important;\n    max-width: clamp(22px, 4vw, 28px) !important;\n    min-height: clamp(22px, 4vw, 28px) !important;\n    max-height: clamp(22px, 4vw, 28px) !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .playback-controls .control-button .control-icon {\n    width: clamp(12px, 2.2vw, 16px) !important;\n    height: clamp(12px, 2.2vw, 16px) !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .playback-controls .control-button.play-pause-button {\n    width: clamp(26px, 4.5vw, 32px) !important;\n    height: clamp(26px, 4.5vw, 32px) !important;\n    border-radius: 50% !important;\n    min-width: clamp(26px, 4.5vw, 32px) !important;\n    max-width: clamp(26px, 4.5vw, 32px) !important;\n    min-height: clamp(26px, 4.5vw, 32px) !important;\n    max-height: clamp(26px, 4.5vw, 32px) !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player .controls-section .playback-controls .control-button.play-pause-button .control-icon {\n    width: clamp(14px, 2.8vw, 18px) !important;\n    height: clamp(14px, 2.8vw, 18px) !important;\n  }\n}\n.cd-showcase[_ngcontent-%COMP%]   .artist-cards-section[_ngcontent-%COMP%] {\n  width: 100%;\n  margin-top: clamp(7rem, 12vh, 11rem);\n  padding: 0;\n  box-sizing: border-box;\n  overflow: visible;\n  display: flex;\n  justify-content: center;\n}\n.cd-showcase[_ngcontent-%COMP%]   .artist-cards-section[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  display: block;\n  box-sizing: border-box;\n}\n.cd-showcase[_ngcontent-%COMP%]   .artist-cards-section[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artists-container, \n.cd-showcase[_ngcontent-%COMP%]   .artist-cards-section[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artists-grid {\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: clamp(1rem, 2vw, 2rem);\n}\n.cd-showcase[_ngcontent-%COMP%]   .artist-cards-section[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artist-card {\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n}\n@media (max-width: 768px) {\n  .cd-showcase[_ngcontent-%COMP%]   .artist-cards-section[_ngcontent-%COMP%] {\n    margin-top: clamp(1.5rem, 2vh, 2rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .artist-cards-section[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artists-container, \n   .cd-showcase[_ngcontent-%COMP%]   .artist-cards-section[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artists-grid {\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n    gap: clamp(0.75rem, 1.5vw, 1.5rem);\n  }\n}\n@media (max-width: 480px) {\n  .cd-showcase[_ngcontent-%COMP%]   .artist-cards-section[_ngcontent-%COMP%] {\n    margin-top: clamp(1rem, 1.5vh, 1.5rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .artist-cards-section[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artists-container, \n   .cd-showcase[_ngcontent-%COMP%]   .artist-cards-section[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%]     .artists-grid {\n    grid-template-columns: 1fr;\n    gap: clamp(0.5rem, 1vw, 1rem);\n  }\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n  position: relative;\n  width: clamp(360px, 45vw, 480px);\n  height: clamp(360px, 45vw, 480px);\n  perspective: 55vw;\n  flex-shrink: 0;\n  margin: 0 auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n@media (min-width: 1025px) and (max-width: 1440px) {\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: clamp(420px, 32vw, 480px);\n    height: clamp(420px, 32vw, 480px);\n  }\n}\n@media (max-width: 1024px) {\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: clamp(380px, 45vw, 460px);\n    height: clamp(380px, 45vw, 460px);\n  }\n}\n@media (max-width: 768px) {\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: clamp(320px, 50vw, 380px);\n    height: clamp(320px, 50vw, 380px);\n  }\n}\n@media (max-width: 480px) {\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: clamp(280px, 60vw, 320px);\n    height: clamp(280px, 60vw, 320px);\n  }\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-3d-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  transform-style: preserve-3d;\n  transition: transform 0.4s ease;\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-3d-container[_ngcontent-%COMP%]:hover {\n  transform: rotateY(15deg) rotateX(5deg);\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-art[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.08) 0%,\n      rgba(255, 255, 255, 0.04) 25%,\n      rgba(0, 0, 0, 0.1) 50%,\n      rgba(0, 0, 0, 0.2) 100%);\n  backdrop-filter: blur(8px) saturate(1.2);\n  -webkit-backdrop-filter: blur(8px) saturate(1.2);\n  border-radius: clamp(12px, 1.5vw, 24px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  z-index: 2;\n  box-shadow:\n    0 1.39vw 3.47vw rgba(0, 0, 0, 0.35),\n    0 0.56vw 1.74vw rgba(0, 0, 0, 0.2),\n    inset 0 0.07vw 0 rgba(255, 255, 255, 0.15),\n    inset 0 -0.07vw 0 rgba(0, 0, 0, 0.1);\n  border: clamp(1px, 0.1vw, 2px) solid rgba(255, 255, 255, 0.12);\n  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-art[_ngcontent-%COMP%]:hover {\n  box-shadow:\n    0 1.74vw 4.17vw rgba(0, 0, 0, 0.4),\n    0 0.69vw 2.08vw rgba(0, 0, 0, 0.25),\n    inset 0 0.07vw 0 rgba(255, 255, 255, 0.2),\n    inset 0 -0.07vw 0 rgba(0, 0, 0, 0.15);\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-art[_ngcontent-%COMP%]   .album-cover[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: 0.83vw;\n  transition: all 0.3s ease;\n  display: block;\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-art[_ngcontent-%COMP%]   .album-cover[_ngcontent-%COMP%]:hover {\n  transform: scale(1.02);\n  filter: brightness(1.1) contrast(1.05);\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-art[_ngcontent-%COMP%]   .art-placeholder[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 6.25vw;\n  color: rgba(255, 255, 255, 0.9);\n  filter: drop-shadow(0 0.28vw 1.11vw rgba(0, 0, 0, 0.5));\n  transition: all 0.3s ease;\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-art[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.1) 0%,\n      transparent 50%,\n      rgba(255, 255, 255, 0.05) 100%);\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 0.3s ease;\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-art[_ngcontent-%COMP%]:hover::before {\n  opacity: 1;\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-spine[_ngcontent-%COMP%] {\n  position: absolute;\n  left: -1.11vw;\n  top: 0;\n  width: 2.22vw;\n  height: 100%;\n  background:\n    linear-gradient(\n      180deg,\n      rgb(63.4310344828, 70.75, 78.0689655172),\n      #343a40,\n      rgb(10.2567567568, 11.5, 12.7432432432));\n  border-radius: 0.28vw 0 0 0.28vw;\n  transform: skewY(2deg);\n  z-index: 1;\n  box-shadow:\n    -0.14vw 0 0.56vw rgba(0, 0, 0, 0.3),\n    inset 0.14vw 0 0.28vw rgba(0, 0, 0, 0.2),\n    inset -0.14vw 0 0.14vw rgba(255, 255, 255, 0.1);\n  border-right: 0.07vw solid rgba(0, 0, 0, 0.3);\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-spine[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    repeating-linear-gradient(\n      90deg,\n      transparent,\n      transparent 0.07vw,\n      rgba(255, 255, 255, 0.03) 0.07vw,\n      rgba(255, 255, 255, 0.03) 0.14vw);\n  border-radius: inherit;\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-reflection[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: -3.47vw;\n  left: 0;\n  width: 100%;\n  height: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(0, 0, 0, 0.1),\n      transparent);\n  border-radius: 0.83vw;\n  filter: blur(0.07vw);\n  opacity: 0.6;\n  transform-origin: top center;\n  transition: transform 0.4s ease;\n  pointer-events: none;\n}\n.cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-3d-container[_ngcontent-%COMP%]:hover    + .jacket-reflection[_ngcontent-%COMP%] {\n  transform: rotateY(7deg) rotateX(-2deg) scaleY(0.95);\n  opacity: 0.4;\n}\n.cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%] {\n  flex: 0 0 auto;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n}\n.cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%] {\n  margin-bottom: clamp(1rem, 2vh, 2rem);\n}\n.cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artists[_ngcontent-%COMP%] {\n  font-family: "Inter", sans-serif;\n  font-size: clamp(1.75rem, 2.5vw, 3rem);\n  font-weight: 600;\n  margin: 0 0 clamp(0.5rem, 1vh, 1rem) 0;\n  color: #ffffff;\n  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);\n  line-height: 1.2;\n}\n@media (max-width: 1024px) {\n  .cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artists[_ngcontent-%COMP%] {\n    font-size: clamp(1.5rem, 3vw, 2.5rem);\n    text-align: center;\n  }\n}\n@media (max-width: 768px) {\n  .cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artists[_ngcontent-%COMP%] {\n    font-size: clamp(1.2rem, 2.5vw, 2rem);\n  }\n}\n.cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .collaboration-label[_ngcontent-%COMP%] {\n  font-size: clamp(1rem, 1.2vw, 1.4rem);\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0;\n  font-style: italic;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);\n  letter-spacing: 0.5px;\n  text-transform: uppercase;\n}\n@media (max-width: 1024px) {\n  .cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .collaboration-label[_ngcontent-%COMP%] {\n    text-align: center;\n  }\n}\n.cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .album-details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: clamp(0.25rem, 0.5vh, 0.4rem);\n  padding: clamp(0.5rem, 0.8vh, 0.65rem);\n  width: fit-content;\n  min-width: 280px;\n  max-width: 400px;\n  box-sizing: border-box;\n  flex-grow: 0;\n  flex-shrink: 1;\n  flex-basis: auto;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.06) 0%,\n      rgba(255, 255, 255, 0.02) 50%,\n      rgba(0, 0, 0, 0.08) 100%);\n  backdrop-filter: blur(6px);\n  -webkit-backdrop-filter: blur(6px);\n  border-radius: clamp(10px, 1.2vh, 16px);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n}\n.cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .album-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: clamp(0.5rem, 0.8vw, 1rem);\n  color: rgba(255, 255, 255, 0.95);\n  font-size: clamp(0.9rem, 1vw, 1.2rem);\n  font-weight: 400;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);\n  padding: clamp(0.3rem, 0.6vh, 0.5rem);\n  border-radius: clamp(6px, 0.8vh, 10px);\n  transition: all 0.3s ease;\n  box-sizing: border-box;\n}\n.cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .album-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.05);\n  transform: translateX(4px);\n}\n.cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .album-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.9);\n  font-size: clamp(16px, 1vw, 20px);\n  width: clamp(16px, 1vw, 20px);\n  height: clamp(16px, 1vw, 20px);\n  flex-shrink: 0;\n  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));\n}\n.cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .album-details[_ngcontent-%COMP%]   .detail-item[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n  font-weight: 500;\n  letter-spacing: 0.3px;\n  word-break: break-word;\n  line-height: 1.4;\n}\n.cd-showcase[_ngcontent-%COMP%]   .evolution-text[_ngcontent-%COMP%] {\n  text-align: center;\n  margin: 1.5rem 0 0 0;\n}\n.cd-showcase[_ngcontent-%COMP%]   .evolution-text[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  font-family: "Inter", sans-serif;\n  font-size: clamp(1.1rem, 0.9vw, 1.4rem);\n  font-weight: 500;\n  color: rgba(255, 255, 255, 0.9);\n  margin: 0;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%] {\n  display: block;\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  max-width: 100%;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .player-controls {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 1rem;\n}\n.cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .play-pause-btn {\n  margin: 0 auto;\n}\n.artist-section[_ngcontent-%COMP%] {\n  text-align: center;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.18) 0%,\n      rgba(0, 0, 0, 0.21) 25%,\n      rgba(0, 0, 0, 0.24) 50%,\n      rgba(0, 0, 0, 0.27) 100%);\n  backdrop-filter: blur(clamp(6px, 1vw, 12px)) saturate(1.2);\n  -webkit-backdrop-filter: blur(clamp(6px, 1vw, 12px)) saturate(1.2);\n  border-radius: clamp(18px, 3.5vw, 36px);\n  border: clamp(1px, 0.15vw, 2px) solid rgba(255, 255, 255, 0.15);\n  margin: clamp(1.5rem, 4vh, 3rem) 10vw 0;\n  max-width: 80vw;\n  width: 80vw;\n  padding: clamp(1rem, 3vh, 2.5rem) clamp(1rem, 2vw, 2rem) clamp(0.5rem, 1vh, 1rem);\n  position: relative;\n  box-sizing: border-box;\n}\n@media (max-width: 768px) {\n  .artist-section[_ngcontent-%COMP%] {\n    max-width: 80vw;\n    width: 80vw;\n    margin: 1rem 10vw;\n    padding: 1.5rem 1rem;\n    border-radius: 20px;\n  }\n}\n@media (max-width: 480px) {\n  .artist-section[_ngcontent-%COMP%] {\n    max-width: 85vw;\n    width: 85vw;\n    margin: 0.5rem 7.5vw;\n    padding: 1rem 0.75rem;\n    border-radius: 16px;\n  }\n}\n.artist-section[_ngcontent-%COMP%] {\n  will-change: transform, opacity;\n  backface-visibility: hidden;\n  transform: translateZ(0);\n  box-shadow:\n    0 8px 32px rgba(0, 0, 0, 0.25),\n    0 4px 16px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.1),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.05);\n  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n}\n.artist-section[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px) translateZ(0);\n  box-shadow:\n    0 12px 40px rgba(0, 0, 0, 0.3),\n    0 6px 20px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.15),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.08);\n}\n.artist-section[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-family: "Inter", sans-serif;\n  font-size: clamp(1.5rem, 2vw, 2.5rem);\n  color: #ffffff;\n  margin: 0 0 3rem 0;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 2rem;\n  max-width: 100%;\n  width: 100%;\n  margin: 0;\n}\n@media (max-width: 768px) {\n  .artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 1.5rem;\n    max-width: 100%;\n  }\n}\n@media (max-width: 480px) {\n  .artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%] {\n    gap: 1rem;\n    max-width: 100%;\n  }\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.7),\n      rgba(20, 20, 20, 0.8));\n  backdrop-filter: blur(clamp(6px, 1vw, 12px));\n  -webkit-backdrop-filter: blur(clamp(6px, 1vw, 12px));\n  border-radius: clamp(12px, 2vw, 20px);\n  border: clamp(1px, 0.15vw, 2px) solid rgba(255, 255, 255, 0.2);\n  padding: clamp(1.5rem, 3vh, 2.5rem);\n  text-align: center;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n  box-shadow: 0 clamp(3px, 0.6vw, 6px) clamp(15px, 3vw, 25px) rgba(0, 0, 0, 0.3);\n  box-sizing: border-box;\n  max-width: 100%;\n}\n@media (max-width: 768px) {\n  .artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n    margin: 0 auto;\n    max-width: calc(100% - 1rem);\n  }\n}\n@media (max-width: 480px) {\n  .artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n    padding: 1rem;\n    border-radius: 12px;\n    max-width: calc(100% - 0.5rem);\n  }\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-8px);\n  box-shadow: 0 clamp(12px, 2vw, 20px) clamp(30px, 5vw, 50px) rgba(0, 0, 0, 0.2);\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%] {\n  width: clamp(60px, 10vw, 100px);\n  height: clamp(60px, 10vw, 100px);\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      #343a40,\n      #212529,\n      #000000);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto clamp(0.75rem, 1.5vh, 1.25rem) auto;\n  color: #ffffff;\n  font-weight: 700;\n  font-size: clamp(1.2rem, 1.8vw, 2rem);\n  box-shadow: 0 clamp(6px, 1vw, 12px) clamp(15px, 3vw, 25px) rgba(0, 0, 0, 0.2);\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%] {\n  font-family: "Inter", sans-serif;\n  font-size: clamp(1.1rem, 1.5vw, 1.8rem);\n  color: #ffffff;\n  margin: 0 0 0.5rem 0;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: #f8f9fa;\n  margin: 0 0 1.5rem 0;\n  font-style: italic;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 0.5rem;\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%] {\n  width: clamp(44px, 12vw, 48px);\n  height: clamp(44px, 12vw, 48px);\n  min-width: 44px;\n  min-height: 44px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.1);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #f8f9fa;\n  transition: all 0.3s ease;\n  text-decoration: none;\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #343a40,\n      #212529,\n      #000000);\n  color: #ffffff;\n  transform: scale(1.1);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-link.youtube-link[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #FF0000,\n      #CC0000);\n  border-color: #FF0000;\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-link.spotify-link[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #1DB954,\n      #1AA34A);\n  border-color: #1DB954;\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-link.soundcloud-link[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #FF5500,\n      #E14D00);\n  border-color: #FF5500;\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-link.twitter-link[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #1DA1F2,\n      #0D8BD9);\n  border-color: #1DA1F2;\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-link.website-link[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #666666,\n      #444444);\n  border-color: #666666;\n}\n.artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: clamp(16px, 1.2vw, 24px);\n  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));\n}\n.phantasia-footer[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.9);\n  color: white;\n  padding: clamp(1.5rem, 3vh, 2.5rem) clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 2vh, 2rem);\n  margin-top: clamp(1.5rem, 3vh, 2.5rem);\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%] {\n  max-width: 80vw;\n  width: 80vw;\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: 1fr 2fr 1fr;\n  gap: clamp(1.5rem, 3vw, 2.5rem);\n  align-items: start;\n}\n@media (max-width: 768px) {\n  .phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    text-align: center;\n  }\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  max-width: clamp(200px, 20vw, 350px);\n  width: clamp(180px, 18vw, 320px);\n  height: auto;\n  filter: brightness(0) invert(1);\n  min-width: 180px;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-around;\n  gap: 2rem;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .link-group[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: clamp(0.9rem, 1.3vw, 1.4rem);\n  font-weight: 600;\n  margin-bottom: 1rem;\n  color: #e9ecef;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .link-group[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .link-group[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .link-group[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #6c757d;\n  text-decoration: none;\n  transition: color 0.3s ease;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .link-group[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: white;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .copyright[_ngcontent-%COMP%] {\n  font-size: clamp(0.8rem, 1.1vw, 1.2rem);\n  color: #6c757d;\n  text-align: right;\n}\n@media (max-width: 768px) {\n  .phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .copyright[_ngcontent-%COMP%] {\n    text-align: center;\n  }\n}\n@keyframes _ngcontent-%COMP%_bounce {\n  0%, 20%, 50%, 80%, 100% {\n    padding-bottom: 0;\n  }\n  40% {\n    padding-bottom: 6px;\n  }\n  60% {\n    padding-bottom: 3px;\n  }\n}\n@keyframes _ngcontent-%COMP%_scrollIndicatorPulse {\n  0%, 100% {\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 255, 255, 0.1);\n  }\n  50% {\n    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3), 0 0 16px rgba(255, 255, 255, 0.2);\n  }\n}\n@keyframes _ngcontent-%COMP%_triangleFloat {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-0.56vw);\n  }\n}\n@keyframes _ngcontent-%COMP%_triangleBounce {\n  0%, 20%, 50%, 80%, 100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-0.69vw);\n  }\n  60% {\n    transform: translateY(-0.35vw);\n  }\n}\n@keyframes _ngcontent-%COMP%_arrowFloat {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(0.56vw);\n  }\n}\n@keyframes _ngcontent-%COMP%_arrowBounce {\n  0%, 20%, 50%, 80%, 100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(0.69vw);\n  }\n  60% {\n    transform: translateY(0.35vw);\n  }\n}\n@media (max-width: 768px) {\n  .video-title-section[_ngcontent-%COMP%] {\n    height: calc(150vh - 89px);\n    min-height: calc(150vh - 89px);\n    margin-top: 89px;\n    padding: 0;\n    margin-bottom: clamp(2rem, 5vh, 4rem);\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-container[_ngcontent-%COMP%] {\n    transform: translate(-50%, -50%) !important;\n    position: absolute !important;\n    top: 50% !important;\n    left: 50% !important;\n    width: 100%;\n    height: auto;\n    z-index: 10;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    object-fit: contain;\n    transform: scale(2.3) translateY(-20vh) !important;\n    max-width: 95vw !important;\n    max-height: 75vh !important;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-subtitle[_ngcontent-%COMP%] {\n    font-size: clamp(1rem, 1.4vw, 1.3rem);\n    margin-top: clamp(0.75rem, 1.2vh, 1rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%] {\n    padding: 3.26vw 1.31vw 0.65vw;\n    margin: clamp(3rem, 6vh, 5rem) auto 1.31vw;\n    will-change: transform;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .showcase-main-content[_ngcontent-%COMP%] {\n    gap: 2rem;\n    min-height: auto;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-cover-section[_ngcontent-%COMP%] {\n    width: 100%;\n    display: flex;\n    justify-content: center;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-content-section[_ngcontent-%COMP%] {\n    width: 100%;\n    gap: 1.5rem;\n    text-align: center;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-info[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artists[_ngcontent-%COMP%] {\n    font-size: clamp(1.2rem, 2.35vw, 2rem);\n  }\n  .artist-section[_ngcontent-%COMP%] {\n    padding: 2.61vw 1.31vw 0.65vw;\n    margin: 1.31vw auto;\n  }\n  .artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 1.96vw;\n  }\n  .scroll-indicator-container[_ngcontent-%COMP%] {\n    padding: 0.75rem 1rem;\n  }\n  .scroll-indicator-container[_ngcontent-%COMP%]   .scroll-text[_ngcontent-%COMP%] {\n    font-size: clamp(0.8rem, 1.18vw, 1.1rem);\n  }\n  .scroll-indicator-container[_ngcontent-%COMP%]   .scroll-arrow[_ngcontent-%COMP%]   .scroll-arrow-icon[_ngcontent-%COMP%] {\n    font-size: 3.5vw;\n    width: 3.5vw;\n    height: 3.5vw;\n  }\n}\n@media (max-width: 480px) {\n  .video-title-section[_ngcontent-%COMP%] {\n    height: calc(100vh - 89px);\n    min-height: calc(100vh - 89px);\n    margin-top: 89px;\n    padding: 0;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    width: 100vw !important;\n    object-fit: contain;\n    transform: translateY(-10vh) scale(2.3) !important;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-subtitle[_ngcontent-%COMP%] {\n    font-size: clamp(0.85rem, 1.88vw, 1.2rem);\n    margin-top: 0.42vw;\n  }\n  .cd-showcase[_ngcontent-%COMP%] {\n    padding: 2rem 1rem 0.5rem;\n    margin: 2rem auto;\n    border-radius: 20px;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .showcase-main-content[_ngcontent-%COMP%] {\n    gap: 1.5rem;\n    min-height: auto;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-cover-section[_ngcontent-%COMP%] {\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    overflow: visible;\n    max-width: 100%;\n    box-sizing: border-box;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-cover-section[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: clamp(200px, 70vw, 300px) !important;\n    height: clamp(200px, 70vw, 300px) !important;\n    max-width: 70vw !important;\n    max-height: 50vh !important;\n    box-sizing: border-box;\n    flex-shrink: 1;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-cover-section[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-3d-container[_ngcontent-%COMP%] {\n    width: 100% !important;\n    height: 100% !important;\n    max-width: 100%;\n    max-height: 100%;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-cover-section[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-art[_ngcontent-%COMP%] {\n    width: 100% !important;\n    height: 100% !important;\n    max-width: 100%;\n    max-height: 100%;\n    overflow: visible !important;\n    box-sizing: border-box;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-cover-section[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-art[_ngcontent-%COMP%]   .album-cover[_ngcontent-%COMP%] {\n    width: 100% !important;\n    height: 100% !important;\n    max-width: 100% !important;\n    max-height: 100% !important;\n    object-fit: cover !important;\n    object-position: center;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-content-section[_ngcontent-%COMP%] {\n    width: 100%;\n    gap: 1rem;\n    text-align: center;\n  }\n}\n.artist-cards-section[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.18) 0%,\n      rgba(0, 0, 0, 0.21) 25%,\n      rgba(0, 0, 0, 0.24) 50%,\n      rgba(0, 0, 0, 0.27) 100%);\n  backdrop-filter: blur(8px) saturate(1.2);\n  -webkit-backdrop-filter: blur(8px) saturate(1.2);\n  border-radius: 28px;\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  margin: clamp(2rem, 4vh, 3rem) auto clamp(1rem, 2vh, 2rem);\n  max-width: min(1800px, 95vw);\n  width: 100%;\n  padding: clamp(1.5rem, 3vh, 2.5rem) clamp(1rem, 3vw, 3rem);\n  position: relative;\n  box-sizing: border-box;\n  clear: both;\n}\n@media (max-width: 768px) {\n  .artist-cards-section[_ngcontent-%COMP%] {\n    max-width: 80vw;\n    width: 80vw;\n    margin: clamp(2rem, 4vh, 3rem) auto clamp(1rem, 2vh, 2rem);\n    padding: clamp(1.5rem, 2vh, 2rem) clamp(1rem, 2vw, 1.5rem);\n    border-radius: 20px;\n  }\n}\n@media (max-width: 480px) {\n  .artist-cards-section[_ngcontent-%COMP%] {\n    max-width: 85vw;\n    width: 85vw;\n    margin: clamp(3rem, 5vh, 4rem) auto clamp(1rem, 2vh, 2rem);\n    padding: clamp(1.5rem, 2vh, 2rem) clamp(0.75rem, 2vw, 1.25rem);\n    border-radius: 16px;\n    clear: both !important;\n    display: block !important;\n    position: relative !important;\n    z-index: 1 !important;\n  }\n}\n.artist-cards-section[_ngcontent-%COMP%]   .artist-section[_ngcontent-%COMP%] {\n  padding: 3.13vw 1.04vw 0.52vw;\n  margin: 1.04vw auto;\n  border-radius: 4.17vw;\n}\n.artist-cards-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%] {\n  padding: 0.75rem 1rem;\n}\n.artist-cards-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .scroll-text[_ngcontent-%COMP%] {\n  font-size: clamp(0.75rem, 1.67vw, 1rem);\n  margin-bottom: 1.25vw;\n}\n.artist-cards-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%]   .scroll-arrow[_ngcontent-%COMP%]   .scroll-arrow-icon[_ngcontent-%COMP%] {\n  font-size: 5vw;\n  width: 5vw;\n  height: 5vw;\n}\n@media (min-width: 769px) and (max-width: 1024px) {\n  .cd-showcase[_ngcontent-%COMP%] {\n    margin-top: clamp(3rem, 6vh, 5rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .showcase-main-content[_ngcontent-%COMP%] {\n    gap: 2.5rem;\n    min-height: auto;\n    overflow: visible;\n    justify-content: center;\n    align-items: center;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-cover-section[_ngcontent-%COMP%] {\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    margin-bottom: 1rem;\n    max-width: 100%;\n    overflow: visible;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-content-section[_ngcontent-%COMP%] {\n    width: 100%;\n    gap: 2rem;\n    text-align: center;\n    max-width: 100%;\n    overflow: visible;\n    box-sizing: border-box;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%] {\n    min-height: 130px;\n    max-height: none;\n    overflow: visible;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player-container {\n    min-height: 125px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player {\n    min-height: 120px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .video-title-section[_ngcontent-%COMP%] {\n    height: calc(100vh - 89px);\n    min-height: calc(100vh - 89px);\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-container[_ngcontent-%COMP%] {\n    transform: translate(-50%, -50%);\n    position: absolute;\n    top: 50%;\n    left: 50%;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    object-fit: contain;\n    transform: scale(1.35);\n    width: 105vw;\n    height: 80vh;\n  }\n}\n@media (min-width: 1025px) and (max-width: 1440px) {\n  .cd-showcase[_ngcontent-%COMP%] {\n    max-width: min(1400px, 90vw);\n    width: 100%;\n    margin: clamp(2rem, 4vh, 3rem) auto clamp(1rem, 2vh, 2rem);\n    padding: 0 clamp(1rem, 3vw, 3rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .showcase-main-content[_ngcontent-%COMP%] {\n    gap: 3rem;\n    min-height: 380px;\n    overflow: visible;\n    align-items: center;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: clamp(420px, 32vw, 480px);\n    height: clamp(420px, 32vw, 480px);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%] {\n    min-height: 160px;\n    max-height: none;\n    overflow: visible;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player-container {\n    min-height: 155px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player {\n    min-height: 150px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .artist-cards-section[_ngcontent-%COMP%] {\n    max-width: min(1400px, 90vw);\n    width: 100%;\n    margin: clamp(2rem, 4vh, 3rem) auto clamp(1rem, 2vh, 2rem);\n    padding: 0 clamp(1rem, 3vw, 3rem);\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    object-fit: contain;\n    transform: translateY(6vh);\n  }\n}\n@media (min-width: 1441px) and (max-width: 1920px) {\n  .cd-showcase[_ngcontent-%COMP%]   .showcase-main-content[_ngcontent-%COMP%] {\n    gap: 3.5rem;\n    min-height: 480px;\n    overflow: visible;\n    align-items: center;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: clamp(460px, 33vw, 520px);\n    height: clamp(460px, 33vw, 520px);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-content-section[_ngcontent-%COMP%] {\n    gap: 2rem;\n    max-width: 100%;\n    overflow: visible;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%] {\n    min-height: 170px;\n    max-height: none;\n    overflow: visible;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player-container {\n    min-height: 165px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .music-player-section[_ngcontent-%COMP%]   app-music-player[_ngcontent-%COMP%]     .music-player {\n    min-height: 160px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    object-fit: contain;\n  }\n}\n@media (min-width: 2000px) {\n  .cd-showcase[_ngcontent-%COMP%] {\n    max-width: min(2200px, 90vw);\n    padding: clamp(2rem, 3vh, 3rem) clamp(2rem, 4vw, 4rem) clamp(0.5rem, 1vh, 1rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .showcase-main-content[_ngcontent-%COMP%] {\n    gap: 4rem;\n    min-height: 600px;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: 520px;\n    height: 520px;\n  }\n  .artist-cards-section[_ngcontent-%COMP%] {\n    max-width: min(2200px, 90vw);\n    padding: clamp(2rem, 3vh, 3rem) clamp(2rem, 4vw, 4rem);\n  }\n}\n@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    filter: contrast(1.15) brightness(1.08) drop-shadow(0 0.42vw 1.39vw rgba(0, 0, 0, 0.6));\n  }\n  .cd-showcase[_ngcontent-%COMP%] {\n    box-shadow:\n      0 0.56vw 2.22vw rgba(0, 0, 0, 0.3),\n      0 0.28vw 1.11vw rgba(0, 0, 0, 0.18),\n      inset 0 0.07vw 0 rgba(255, 255, 255, 0.12),\n      inset 0 -0.07vw 0 rgba(255, 255, 255, 0.06);\n  }\n}\n@media (max-width: 768px) and (min-width: 481px) {\n  .video-title-section[_ngcontent-%COMP%] {\n    height: calc(100vh - 89px) !important;\n    min-height: calc(100vh - 89px) !important;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-container[_ngcontent-%COMP%] {\n    position: absolute !important;\n    top: 50% !important;\n    left: 50% !important;\n    transform: translate(-50%, -50%) !important;\n    width: 100% !important;\n    height: auto !important;\n    z-index: 10 !important;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    transform: scale(1.4) !important;\n    width: 95vw !important;\n    height: 70vh !important;\n    max-width: 95vw !important;\n    max-height: 75vh !important;\n    object-fit: contain !important;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-subtitle[_ngcontent-%COMP%] {\n    font-size: clamp(1.1rem, 1.5vw, 1.6rem) !important;\n    margin-top: clamp(0.5rem, 1vh, 0.8rem) !important;\n  }\n  .scroll-indicator-section[_ngcontent-%COMP%] {\n    margin: -30vh 0 0 0 !important;\n  }\n  .cd-showcase[_ngcontent-%COMP%] {\n    margin-top: clamp(4rem, 8vh, 6rem) !important;\n  }\n  .artist-section[_ngcontent-%COMP%] {\n    margin-top: clamp(2rem, 4vh, 3rem) !important;\n  }\n}\n@media (min-width: 1920px) and (max-width: 1920px) and (min-height: 1080px) and (max-height: 1080px) {\n  .cd-showcase[_ngcontent-%COMP%] {\n    max-width: 1500px;\n    margin: 0.5rem clamp(8rem, 12vw, 16rem);\n    padding: 1rem 2rem 0.75rem;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .cd-showcase-title[_ngcontent-%COMP%] {\n    margin-bottom: 1.5rem;\n    font-size: 1.5rem;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .showcase-main-content[_ngcontent-%COMP%] {\n    gap: 2.5rem;\n    margin-bottom: 1rem;\n    min-height: 400px;\n    max-height: 450px;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: 450px;\n    height: 450px;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .album-content-section[_ngcontent-%COMP%] {\n    gap: 1.5rem;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   app-dynamic-artist-cards[_ngcontent-%COMP%] {\n    margin-top: 1rem;\n    max-height: 200px;\n    overflow-y: auto;\n    overflow-x: hidden;\n    box-sizing: border-box;\n  }\n}\n@media (min-width: 1921px) {\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    height: 35vmax;\n    transform: translateY(12vh);\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-subtitle[_ngcontent-%COMP%] {\n    font-size: 0.6vmax;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-container[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%] {\n    padding-bottom: 12vh;\n  }\n  .cd-showcase[_ngcontent-%COMP%] {\n    max-width: 70vmax;\n    padding: 1.5vmax 1vmax;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: 30vmax;\n    height: 30vmax;\n  }\n}\n@media (min-aspect-ratio: 21/9) {\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    height: 30vmin;\n    transform: translateY(46vh);\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-container[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%] {\n    padding-bottom: 10vh;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .showcase-container[_ngcontent-%COMP%] {\n    gap: 4vmin;\n  }\n}\n@media (orientation: portrait) {\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    position: absolute;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-subtitle[_ngcontent-%COMP%] {\n    font-size: clamp(1rem, 2.5vw, 1.8rem);\n  }\n  .video-title-section[_ngcontent-%COMP%]   .scroll-indicator-container[_ngcontent-%COMP%] {\n    padding-top: clamp(2rem, 8vh, 5rem);\n    margin: 0 auto clamp(1rem, 2vh, 3rem);\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: clamp(280px, 32vw, 480px);\n    height: clamp(280px, 32vw, 480px);\n  }\n}\n@media (orientation: portrait) and (max-width: 768px) {\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: clamp(250px, 45vw, 350px);\n    height: clamp(250px, 45vw, 350px);\n  }\n}\n@media (orientation: portrait) and (max-width: 480px) {\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%] {\n    width: clamp(200px, 50vw, 280px);\n    height: clamp(200px, 50vw, 280px);\n  }\n}\n@media (orientation: landscape) and (max-height: 480px) {\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    height: 40vh;\n    transform: translateY(-2vh);\n  }\n  .scroll-indicator-container[_ngcontent-%COMP%] {\n    padding-top: clamp(0.5rem, 2vh, 1.5rem);\n    margin: 0 auto 0.5rem;\n    min-height: 44px;\n  }\n}\n@media (orientation: portrait) and (max-height: 812px) and (max-width: 480px) {\n  .scroll-indicator-container[_ngcontent-%COMP%] {\n    padding-top: clamp(2rem, 8vh, 5rem);\n    margin: 0 auto clamp(0.5rem, 2vh, 2rem);\n  }\n}\n@media (min-width: 1920px) {\n  .scroll-indicator-container[_ngcontent-%COMP%] {\n    padding-top: clamp(10rem, 15vh, 20rem);\n    margin: 0 auto clamp(3rem, 5vh, 8rem);\n  }\n}\n@media (max-width: 320px) {\n  .scroll-indicator-container[_ngcontent-%COMP%] {\n    padding: 0.75rem 0.5rem;\n    margin: 0 auto 1rem;\n  }\n  .scroll-indicator-container[_ngcontent-%COMP%]   .scroll-text[_ngcontent-%COMP%] {\n    font-size: 0.9rem;\n    letter-spacing: 0.03em;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-container[_ngcontent-%COMP%] {\n    padding: 0.5rem;\n  }\n  .cd-showcase[_ngcontent-%COMP%] {\n    margin: 0.5rem auto;\n    padding: 1rem 0.5rem 0.5rem;\n  }\n  .artist-section[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 0.75rem;\n  }\n}\n@media (hover: none) and (pointer: coarse) {\n  .scroll-indicator-container[_ngcontent-%COMP%] {\n    padding: 1rem 1.5rem;\n    min-height: 44px;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .video-title-section[_ngcontent-%COMP%]   .title-container[_ngcontent-%COMP%] {\n    will-change: auto;\n  }\n  .video-title-section[_ngcontent-%COMP%]   .title-video[_ngcontent-%COMP%] {\n    will-change: auto;\n  }\n  .cd-showcase[_ngcontent-%COMP%] {\n    will-change: auto;\n  }\n  .cd-showcase[_ngcontent-%COMP%]:hover {\n    transform: none;\n  }\n  .cd-showcase[_ngcontent-%COMP%]   .cd-jacket[_ngcontent-%COMP%]   .jacket-3d-container[_ngcontent-%COMP%]:hover {\n    transform: none;\n  }\n  .artist-section[_ngcontent-%COMP%] {\n    will-change: auto;\n  }\n  .artist-section[_ngcontent-%COMP%]:hover {\n    transform: none;\n  }\n}\n/*# sourceMappingURL=phantasia2.css.map */'], data: { animation: [
  // Scroll indicator animation - only animate opacity to preserve CSS centering
  trigger("scrollIndicator", [
    state("visible", style({
      opacity: 1
      // REMOVED transform to preserve flexbox centering
    })),
    state("hidden", style({
      opacity: 0
      // REMOVED transform to preserve flexbox centering
    })),
    transition("hidden => visible", [
      animate("600ms cubic-bezier(0.4, 0.0, 0.2, 1)")
    ]),
    transition("visible => hidden", [
      animate("300ms cubic-bezier(0.4, 0.0, 0.2, 1)")
    ])
  ])
] }, changeDetection: 0 });
var Phantasia2Component = _Phantasia2Component;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Phantasia2Component, [{
    type: Component,
    args: [{ selector: "app-phantasia2", standalone: true, imports: [
      CommonModule,
      RouterModule,
      MatCardModule,
      MatButtonModule,
      MatIconModule,
      MatChipsModule,
      MusicPlayerComponent,
      SiteHeaderComponent,
      LoadingScreenComponent,
      DynamicArtistCardsComponent,
      SpecialMentionsComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, animations: [
      // Scroll indicator animation - only animate opacity to preserve CSS centering
      trigger("scrollIndicator", [
        state("visible", style({
          opacity: 1
          // REMOVED transform to preserve flexbox centering
        })),
        state("hidden", style({
          opacity: 0
          // REMOVED transform to preserve flexbox centering
        })),
        transition("hidden => visible", [
          animate("600ms cubic-bezier(0.4, 0.0, 0.2, 1)")
        ]),
        transition("visible => hidden", [
          animate("300ms cubic-bezier(0.4, 0.0, 0.2, 1)")
        ])
      ])
    ], template: '<!-- Loading Screen -->\n<app-loading-screen \n  *ngIf="isLoading" \n  [progress]="loadingProgress">\n</app-loading-screen>\n\n<div class="phantasia2-container" *ngIf="!isLoading">\n  <!-- Site Header - only shown when not inside the phantasia layout -->\n  <app-site-header *ngIf="!isInsidePhantasiaLayout"></app-site-header>\n\n  <!-- Video Background with Seamless Loop -->\n  <div class="video-background">\n    <video #backgroundVideo class="bg-video" autoplay muted playsinline [loop]="true" (loadedmetadata)="onVideoLoaded()" (canplay)="onVideoLoaded()">\n      <source src="assets/videos/phantasia2/animated_background_optimized.webm" type="video/webm">\n      <source src="assets/videos/phantasia2/animated_background_web.mp4" type="video/mp4">\n    </video>\n    <div class="video-overlay"></div>\n  </div>\n\n  <!-- Video Title Section - Clean Structure for Perfect Centering -->\n  <section class="video-title-section">\n    <div class="title-container">\n      <video #titleVideo class="title-video" autoplay muted playsinline preload="auto"\n             (loadedmetadata)="onTitleVideoLoaded()"\n             (canplay)="onTitleVideoCanPlay()"\n             (ended)="onTitleVideoEnded()">\n        <source src="assets/videos/phantasia2/ULTIMATE_alpha_with_flares.webm" type="video/webm">\n        <source src="assets/videos/phantasia2/Phantasi2_Logo_Animated_web.mp4" type="video/mp4">\n        <!-- Fallback to static image if video fails -->\n        <img src="assets/videos/phantasia2/Logo_fx.png" alt="Phantasia Project II" class="title-image-fallback">\n      </video>\n    </div>\n  </section>\n\n  <!-- Scroll Indicator Section - Now completely outside video-title-section -->\n  <section class="scroll-indicator-section">\n    <div class="scroll-indicator-container"\n         *ngIf="showScrollIndicator()"\n         [@scrollIndicator]="scrollIndicatorState"\n         (click)="scrollToContent()">\n      <div class="scroll-text">Scroll for More</div>\n      <div class="triangle-separator">\n        <svg width="24" height="16" viewBox="0 0 24 16" fill="none" class="triangle-icon">\n          <path d="M12 16L0 0H24L12 16Z" fill="currentColor"/>\n        </svg>\n      </div>\n    </div>\n  </section>\n\n  <!-- Main Album Presentation Content -->\n  <div class="album-presentation">\n\n    <!-- Enhanced CD Showcase - Always Visible -->\n    <section class="cd-showcase" #cdShowcase>\n      \n      <!-- CD Showcase Title -->\n      <h2 class="cd-showcase-title">The highly anticipated sequel</h2>\n\n      <!-- Optimized Horizontal Layout for 1920x1080 -->\n      <div class="showcase-main-content">\n        <!-- Left side: Album Cover -->\n        <div class="album-cover-section">\n          <div class="cd-jacket">\n            <div class="jacket-3d-container">\n              <div class="jacket-art">\n                <img src="assets/videos/phantasia2/album_cover.png" alt="Phantasia Project II Album Cover" class="album-cover">\n              </div>\n            </div>\n            <div class="jacket-reflection"></div>\n          </div>\n        </div>\n\n        <!-- Right side: Album Info and Music Player -->\n        <div class="album-content-section">\n          <div class="album-info">\n            <div class="artist-info">\n              <h3 class="artists">"Defining your justice."</h3>\n              <p class="collaboration-label">A fantasy compilation album</p>\n            </div>\n            <div class="album-details">\n              <div class="detail-item">\n                <mat-icon>music_note</mat-icon>\n                <span>20 Tracks</span>\n              </div>\n              <div class="detail-item">\n                <mat-icon>schedule</mat-icon>\n                <span>83 Minutes</span>\n              </div>\n              <div class="detail-item">\n                <mat-icon>style</mat-icon>\n                <span>Ambient Fantasy Orchestral</span>\n              </div>\n            </div>\n          </div>\n\n          <!-- Music Player positioned below album info -->\n          <div class="music-player-section">\n            <app-music-player></app-music-player>\n          </div>\n        </div>\n      </div>\n    </section>\n\n    <!-- Dynamic Artist Cards Section with Special Mentions - Three-column layout -->\n    <section class="artist-cards-section">\n      <app-special-mentions>\n        <!-- Main content (artist cards) will be projected into the center column -->\n        <app-dynamic-artist-cards\n          [showAllArtists]="false"\n          [maxVisibleCards]="8"\n          [enableAnimations]="true"\n          [displayMode]="artistDisplayMode()">\n        </app-dynamic-artist-cards>\n      </app-special-mentions>\n    </section>\n\n    <!-- Footer Section -->\n    <footer class="phantasia-footer">\n      <div class="footer-content">\n        <div class="footer-logo">\n          <img src="assets/images/logos/prismcoll_logox.svg" alt="Prismatic Collections" />\n        </div>\n        \n        <div class="footer-links">\n          <div class="link-group">\n            <h3>Explore</h3>\n            <ul>\n              <li><a routerLink="/collections">Collections</a></li>\n              <li><a routerLink="/phantasia/phantasia2">About</a></li>\n            </ul>\n          </div>\n          \n          <div class="link-group">\n            <h3>Legal</h3>\n            <ul>\n              <li><a href="#">Privacy Policy</a></li>\n              <li><a href="#">Terms of Use</a></li>\n            </ul>\n          </div>\n        </div>\n        \n        <div class="copyright">\n          \xA9 {{ currentYear }} Prismatic Collections. All rights reserved.\n        </div>\n      </div>\n    </footer>\n  </div>\n</div>\n', styles: ['@charset "UTF-8";\n\n/* src/app/pages/collections/phantasia/pages/phantasia2/phantasia2.scss */\n:host {\n  display: block;\n  width: 100%;\n  min-height: 100vh;\n  position: relative;\n  font-family:\n    "Inter",\n    "Roboto",\n    sans-serif;\n  background: transparent;\n  box-sizing: border-box;\n  overflow-x: hidden;\n  overflow-y: auto;\n  padding-top: 90px;\n  scrollbar-width: thin;\n  scrollbar-color: rgba(255, 255, 255, 0.8) rgba(0, 0, 0, 0.9);\n  isolation: isolate;\n}\n:host,\n:host * {\n  background-attachment: initial;\n}\n:host.scroll-locked {\n  overflow-y: hidden !important;\n  position: fixed !important;\n  width: 100% !important;\n}\n@media (max-width: 767px) {\n  :host {\n    padding-top: 70px;\n  }\n}\n@supports (padding-top: env(safe-area-inset-top)) {\n  :host {\n    padding-top: calc(90px + env(safe-area-inset-top));\n  }\n  @media (max-width: 767px) {\n    :host {\n      padding-top: calc(70px + env(safe-area-inset-top));\n    }\n  }\n}\n:host ::ng-deep app-site-header {\n  background: rgba(0, 0, 0, 0.8) !important;\n  backdrop-filter: blur(clamp(8px, 2vw, 12px));\n  -webkit-backdrop-filter: blur(clamp(8px, 2vw, 12px));\n}\n:host:has(app-loading-screen) ::ng-deep app-site-header {\n  z-index: 1 !important;\n}\n:host.loading-active ::ng-deep app-site-header {\n  z-index: 1 !important;\n}\n:host app-loading-screen ~ * ::ng-deep app-site-header,\n:host app-loading-screen + * ::ng-deep app-site-header {\n  z-index: 1 !important;\n}\n:host::-webkit-scrollbar {\n  width: clamp(8px, 1.5vw, 16px);\n  background: rgba(0, 0, 0, 0.9);\n}\n:host::-webkit-scrollbar-track {\n  background: rgba(0, 0, 0, 0.9);\n  border-radius: clamp(4px, 0.75vw, 8px);\n}\n:host::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.8);\n  border-radius: clamp(4px, 0.75vw, 8px);\n  border: clamp(1px, 0.25vw, 3px) solid rgba(0, 0, 0, 0.9);\n}\n:host::-webkit-scrollbar-thumb:hover {\n  background: rgba(255, 255, 255, 0.9);\n  box-shadow: 0 0 clamp(6px, 1vw, 12px) rgba(255, 255, 255, 0.3);\n}\n:host::-webkit-scrollbar-thumb:active {\n  background: rgb(240, 240, 240);\n}\n:host::-webkit-scrollbar-corner {\n  background: rgba(0, 0, 0, 0.9);\n}\n.phantasia2-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  background: transparent;\n  box-sizing: border-box;\n  z-index: 1;\n}\n.phantasia2-container * {\n  box-sizing: border-box;\n}\n.phantasia2-container .video-title-section,\n.phantasia2-container .video-title-section * {\n  max-width: none !important;\n}\n.video-background {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  z-index: -999;\n  overflow: hidden;\n  pointer-events: none;\n  backface-visibility: hidden;\n  transform: translateZ(0);\n  will-change: transform;\n  contain: layout style paint;\n}\n.video-background .bg-video {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  min-width: 100vw;\n  min-height: 100vh;\n  width: auto;\n  height: auto;\n  z-index: 1;\n  transform: translate(-50%, -50%);\n  filter: brightness(1.05) saturate(1.08) contrast(1.03);\n  object-fit: cover;\n  opacity: 1;\n  will-change: auto;\n  backface-visibility: hidden;\n  -webkit-backface-visibility: hidden;\n}\n.video-background .video-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: rgba(0, 0, 0, 0.2);\n  z-index: 2;\n  contain: layout style paint;\n}\n@media (max-width: 768px) {\n  .video-background {\n    top: 0;\n    height: 100vh;\n  }\n  .video-background .bg-video {\n    min-height: 100vh;\n  }\n}\n@media (max-width: 480px) {\n  .video-background {\n    top: 0;\n    height: 100vh;\n  }\n  .video-background .bg-video {\n    min-height: 100vh;\n  }\n}\n.album-presentation {\n  position: relative;\n  z-index: 1;\n  width: 100%;\n  height: auto;\n  min-height: auto;\n  background: transparent;\n  scroll-behavior: smooth;\n  margin-top: 100vh;\n}\n@media (max-width: 768px) {\n  .album-presentation {\n    max-width: 100vw;\n  }\n}\n.video-title-section {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  max-width: 100vw;\n  height: calc(100vh - 90px);\n  margin-top: 0;\n  text-align: center;\n  z-index: 2;\n  contain: layout style;\n}\n.video-title-section .title-container {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  z-index: 1;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  will-change: transform;\n  backface-visibility: hidden;\n}\n@media (max-width: 768px) {\n  .video-title-section .title-container {\n    transform: translate(-50%, -50%);\n    width: 100%;\n    height: 100%;\n  }\n}\n@media (max-width: 480px) {\n  .video-title-section .title-container {\n    transform: translate(-50%, -50%);\n    width: 100%;\n    height: 100%;\n  }\n}\n.video-title-section .title-video {\n  position: relative;\n  width: 100vw;\n  height: 80vh;\n  max-width: min(110vw, 100% + 10vw);\n  z-index: 20;\n  margin: 0 auto;\n  object-fit: cover;\n  object-position: center center;\n  transform: translateY(10vh);\n  transform: scale(1);\n  will-change: transform, filter;\n  backface-visibility: hidden;\n  overflow: visible !important;\n  overflow-x: visible !important;\n  overflow-y: visible !important;\n  overflow-clip-margin: initial;\n  contain: layout style size;\n  filter: contrast(1.1) brightness(1.05) drop-shadow(0 0.28vw 1.11vw rgba(0, 0, 0, 0.5));\n  mix-blend-mode: screen;\n}\n@media (max-width: 768px) {\n  .video-title-section .title-video {\n    transform: scale(1.4);\n    width: 95vw;\n    height: 70vh;\n    object-fit: contain;\n  }\n}\n@media (max-width: 480px) {\n  .video-title-section .title-video {\n    width: 60vw;\n    height: 25vh;\n    max-width: 70vw;\n    transform: scale(0.6);\n    object-fit: contain;\n    margin: 0 auto;\n  }\n}\n.video-title-section .title-video .title-image-fallback {\n  max-width: clamp(300px, 41.67vw, 600px);\n  width: 100%;\n  height: auto;\n  margin-bottom: clamp(8px, 0.69vw, 16px);\n  filter: drop-shadow(0 0.28vw 1.11vw rgba(0, 0, 0, 0.3));\n}\n.video-title-section .title-subtitle {\n  margin-top: clamp(0.75rem, 0.69vw, 1.25rem);\n  font-size: clamp(1.1rem, 0.9vw, 1.8rem);\n  font-weight: 300;\n  color: rgba(255, 255, 255, 0.8);\n  font-style: italic;\n  text-shadow: 0 clamp(1px, 0.14vw, 3px) clamp(6px, 0.56vw, 14px) rgba(0, 0, 0, 0.6);\n  letter-spacing: clamp(0.3px, 0.035vw, 1px);\n}\n@media (max-width: 768px) {\n  .video-title-section .title-subtitle {\n    font-size: clamp(1.1rem, 1.5vw, 1.6rem);\n    margin-top: clamp(0.5rem, 1vh, 0.8rem);\n  }\n}\n.scroll-indicator-section {\n  position: relative;\n  width: 100%;\n  height: 15vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  padding: 0.5rem 0;\n  margin: -20vh 0 0 0;\n  z-index: 10;\n}\n.scroll-indicator-section .scroll-indicator-container {\n  position: relative !important;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n  cursor: pointer;\n  padding: 1rem 1.25rem;\n  transition: opacity 0.3s ease, filter 0.3s ease;\n  left: auto !important;\n  right: auto !important;\n  top: auto !important;\n  bottom: auto !important;\n  transform: none !important;\n  margin: 0 auto !important;\n}\n.scroll-indicator-section .scroll-indicator-container:hover {\n  filter: brightness(1.2) drop-shadow(0 4px 8px rgba(255, 255, 255, 0.2));\n}\n.scroll-indicator-section .scroll-indicator-container .scroll-text {\n  font-family: "Inter", sans-serif;\n  font-size: 1.5rem;\n  font-weight: 300;\n  color: rgba(255, 255, 255, 0.8);\n  text-align: center;\n  letter-spacing: 0.05em;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n  margin: 0;\n}\n@media (max-width: 768px) {\n  .scroll-indicator-section .scroll-indicator-container .scroll-text {\n    font-size: 1.2rem;\n  }\n}\n@media (max-width: 480px) {\n  .scroll-indicator-section .scroll-indicator-container .scroll-text {\n    font-size: 1rem;\n  }\n}\n.scroll-indicator-section .scroll-indicator-container .triangle-separator {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0;\n}\n.scroll-indicator-section .scroll-indicator-container .triangle-separator .triangle-icon {\n  width: clamp(16px, 1.5vw, 20px);\n  height: clamp(12px, 1vw, 14px);\n  color: rgba(255, 255, 255, 0.7);\n  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.3));\n  animation: bounce 2s infinite;\n}\n@media (max-width: 768px) {\n  .scroll-indicator-section .scroll-indicator-container .triangle-separator .triangle-icon {\n    width: clamp(20px, 2vw, 24px);\n    height: clamp(16px, 1.5vw, 18px);\n  }\n}\n@media (max-width: 480px) {\n  .scroll-indicator-section .scroll-indicator-container .triangle-separator .triangle-icon {\n    width: clamp(24px, 3vw, 28px);\n    height: clamp(18px, 2.2vw, 22px);\n  }\n}\n@media (max-width: 320px) {\n  .scroll-indicator-section .scroll-indicator-container .triangle-separator .triangle-icon {\n    width: 18px;\n    height: 14px;\n  }\n}\n@media (min-width: 769px) and (max-width: 1024px) {\n  .scroll-indicator-section .scroll-indicator-container .triangle-separator .triangle-icon {\n    width: clamp(18px, 1.8vw, 22px);\n    height: clamp(14px, 1.3vw, 16px);\n  }\n}\n@media (orientation: portrait) {\n  .scroll-indicator-section .scroll-indicator-container .triangle-separator .triangle-icon {\n    width: clamp(22px, 2.5vw, 26px);\n    height: clamp(16px, 1.8vw, 20px);\n  }\n}\n@media (hover: none) and (pointer: coarse) {\n  .scroll-indicator-section .scroll-indicator-container .triangle-separator .triangle-icon {\n    width: clamp(20px, 2.2vw, 26px);\n    height: clamp(15px, 1.6vw, 20px);\n  }\n}\n@media (max-width: 480px) {\n  .scroll-indicator-section {\n    margin: -35vh 0 0 0 !important;\n  }\n}\n.cd-showcase {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.18) 0%,\n      rgba(0, 0, 0, 0.21) 25%,\n      rgba(0, 0, 0, 0.24) 50%,\n      rgba(0, 0, 0, 0.27) 100%);\n  backdrop-filter: blur(clamp(6px, 1vw, 12px)) saturate(1.2);\n  -webkit-backdrop-filter: blur(clamp(6px, 1vw, 12px)) saturate(1.2);\n  border-radius: clamp(18px, 3.5vw, 36px);\n  border: clamp(1px, 0.15vw, 2px) solid rgba(255, 255, 255, 0.15);\n  margin: clamp(2rem, 4vh, 3rem) auto clamp(1rem, 2vh, 2rem);\n  max-width: min(1800px, 95vw);\n  width: 100%;\n  padding: clamp(1rem, 2.5vh, 2rem) clamp(1rem, 3vw, 3rem) clamp(0.25rem, 1vh, 0.75rem);\n  position: relative;\n  box-sizing: border-box;\n}\n@media (max-width: 768px) {\n  .cd-showcase {\n    max-width: 80vw;\n    width: 80vw;\n    margin: 1rem auto;\n    padding: 2rem 1rem 0.5rem;\n    border-radius: clamp(16px, 3vw, 24px);\n  }\n}\n@media (max-width: 480px) {\n  .cd-showcase {\n    max-width: 85vw;\n    width: 85vw;\n    margin: 0.5rem auto;\n    padding: 1.5rem 0.75rem 0.5rem;\n    border-radius: clamp(12px, 2.5vw, 20px);\n  }\n}\n.cd-showcase {\n  will-change: transform, opacity;\n  backface-visibility: hidden;\n  transform: translateZ(0);\n  box-shadow:\n    0 8px 32px rgba(0, 0, 0, 0.25),\n    0 4px 16px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.1),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.05);\n  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n}\n.cd-showcase:hover {\n  transform: translateY(-4px) translateZ(0);\n  box-shadow:\n    0 12px 40px rgba(0, 0, 0, 0.3),\n    0 6px 20px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.15),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.08);\n}\n.cd-showcase app-dynamic-artist-cards {\n  max-width: 100%;\n  overflow-x: hidden;\n  box-sizing: border-box;\n}\n.cd-showcase app-dynamic-artist-cards * {\n  max-width: 100%;\n  box-sizing: border-box;\n}\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .role-label {\n  color: #000000 !important;\n  background: rgba(255, 255, 255, 0.9) !important;\n  padding: 0.3rem 0.6rem !important;\n  border-radius: 6px !important;\n  text-shadow: none !important;\n  border: 1px solid rgba(0, 0, 0, 0.1) !important;\n  --color: #000000 !important;\n  --mdc-theme-primary: #000000 !important;\n  --mat-primary: #000000 !important;\n}\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .role-label[style*=color] {\n  color: #000000 !important;\n}\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .artist-name,\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card h3,\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card h4 {\n  color: #000000 !important;\n  background: rgba(255, 255, 255, 0.8) !important;\n  padding: 0.2rem 0.4rem !important;\n  border-radius: 4px !important;\n  text-shadow: none !important;\n}\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .playing-text,\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .playing-indicator .playing-text,\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .playing-status .playing-text,\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .artist-info-section .playing-text {\n  color: #ffffff !important;\n  background: rgba(0, 0, 0, 0.6) !important;\n  padding: 0.2rem 0.4rem !important;\n  border-radius: 4px !important;\n  font-size: 0.75rem !important;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;\n  border: 1px solid rgba(255, 255, 255, 0.15) !important;\n}\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card *[style*="color: rgb(78, 205, 196)"],\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card *[style*="color: #4ECDC4"],\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card *[style*="color: cyan"] {\n  color: #ffffff !important;\n  background: rgba(0, 0, 0, 0.6) !important;\n  padding: 0.15rem 0.3rem !important;\n  border-radius: 3px !important;\n  border: 1px solid rgba(255, 255, 255, 0.15) !important;\n}\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .playing-dot {\n  background: #d40808 !important;\n}\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .playing-text {\n  color: #ffffff !important;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;\n}\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card [class*=theme-],\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card [class*=primary],\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .mat-primary {\n  color: #ffffff !important;\n}\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card *[style],\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card *[class] {\n  color: inherit !important;\n}\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .artist-name,\n.cd-showcase app-dynamic-artist-cards ::ng-deep .artist-card .role-label {\n  color: #ffffff !important;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.8) !important;\n}\n.cd-showcase app-music-player {\n  max-width: 100%;\n  box-sizing: border-box;\n}\n.cd-showcase app-music-player * {\n  max-width: 100%;\n  box-sizing: border-box;\n}\n.cd-showcase .cd-showcase-title {\n  font-family: "Inter", sans-serif;\n  font-size: clamp(1.2rem, 1.11vw, 1.8rem);\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.85);\n  font-style: italic;\n  text-align: center;\n  margin: 0 0 clamp(1.5rem, 2.08vw, 3rem) 0;\n  text-shadow: 0 clamp(1px, 0.14vw, 3px) clamp(6px, 0.56vw, 12px) rgba(0, 0, 0, 0.7);\n  letter-spacing: clamp(0.3px, 0.035vw, 1px);\n}\n.cd-showcase .showcase-main-content {\n  display: flex;\n  align-items: stretch;\n  gap: min(3rem, 5vw);\n  min-height: clamp(350px, 60vh, 500px);\n  max-height: none;\n  max-width: 1800px;\n  margin: 0 auto;\n  width: 100%;\n}\n@media (max-width: 1024px) {\n  .cd-showcase .showcase-main-content {\n    flex-direction: column;\n    align-items: center;\n    gap: 2rem;\n    text-align: center;\n    min-height: auto;\n  }\n}\n.cd-showcase .album-cover-section {\n  flex-shrink: 0;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: auto;\n  min-width: fit-content;\n  margin-right: clamp(0rem, 2vw, 3rem);\n}\n@media (min-width: 1025px) {\n  .cd-showcase .album-cover-section {\n    width: clamp(420px, 32vw, 520px);\n    min-width: clamp(420px, 32vw, 480px);\n  }\n}\n@media (min-width: 2000px) {\n  .cd-showcase .album-cover-section {\n    margin-right: clamp(2rem, 4vw, 6rem);\n  }\n}\n@media (max-width: 1024px) {\n  .cd-showcase .album-cover-section {\n    width: 100%;\n    justify-content: center;\n    margin-right: 0;\n  }\n}\n.cd-showcase .album-content-section {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  min-width: 0;\n  gap: clamp(1.5rem, 3vh, 3rem);\n  margin-left: clamp(0rem, 1vw, 2rem);\n}\n@media (min-width: 1025px) {\n  .cd-showcase .album-content-section {\n    width: 60%;\n  }\n}\n@media (min-width: 2000px) {\n  .cd-showcase .album-content-section {\n    margin-left: clamp(1rem, 3vw, 4rem);\n  }\n}\n@media (max-width: 1024px) {\n  .cd-showcase .album-content-section {\n    margin-left: 0;\n  }\n}\n.cd-showcase .music-player-section {\n  flex: 0 0 auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  min-height: clamp(140px, 20vh, 180px);\n  max-height: none;\n  overflow: visible;\n  padding: 0.5rem 0;\n  box-sizing: border-box;\n}\n.cd-showcase .music-player-section app-music-player {\n  max-width: min(900px, 85vw);\n  width: 100%;\n  display: flex;\n  align-items: center;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player-container {\n  height: auto !important;\n  min-height: clamp(140px, 20vh, 180px) !important;\n  max-height: none !important;\n  padding: 0.2rem !important;\n  margin: 0 !important;\n  overflow: visible !important;\n  box-sizing: border-box !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player {\n  height: auto !important;\n  min-height: clamp(135px, 19vh, 175px) !important;\n  max-height: none !important;\n  padding: 0.2rem !important;\n  overflow: visible !important;\n  box-sizing: border-box !important;\n  display: flex !important;\n  flex-direction: column !important;\n  gap: 0 !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .status-section {\n  display: none !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .track-section,\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .progress-section,\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section {\n  margin: 0 !important;\n  padding: 0 !important;\n  flex-shrink: 0 !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .track-section {\n  order: 1 !important;\n  margin-bottom: 0.1rem !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .progress-section {\n  order: 2 !important;\n  margin-bottom: 0.1rem !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section {\n  order: 3 !important;\n  max-height: clamp(28px, 4vh, 36px) !important;\n  position: relative !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section::after {\n  content: "" !important;\n  width: 120px !important;\n  flex-shrink: 0 !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .playback-controls {\n  position: absolute !important;\n  left: 50% !important;\n  top: 50% !important;\n  transform: translate(-50%, -50%) !important;\n  justify-content: center !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .control-button {\n  width: clamp(24px, 3.5vw, 32px) !important;\n  height: clamp(24px, 3.5vw, 32px) !important;\n  border-radius: 50% !important;\n  min-width: 28px !important;\n  max-width: 28px !important;\n  min-height: 28px !important;\n  max-height: 28px !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .control-button .control-icon {\n  width: clamp(14px, 2vw, 18px) !important;\n  height: clamp(14px, 2vw, 18px) !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .control-button.play-pause-button {\n  width: clamp(28px, 4vw, 36px) !important;\n  height: clamp(28px, 4vw, 36px) !important;\n  border-radius: 50% !important;\n  min-width: 32px !important;\n  max-width: 32px !important;\n  min-height: 32px !important;\n  max-height: 32px !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .control-button.play-pause-button .control-icon {\n  width: clamp(16px, 2.5vw, 20px) !important;\n  height: clamp(16px, 2.5vw, 20px) !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .volume-icon {\n  width: clamp(16px, 2.5vw, 20px) !important;\n  height: clamp(16px, 2.5vw, 20px) !important;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .volume-track {\n  width: clamp(45px, 7vw, 65px) !important;\n}\n@media (max-width: 768px) {\n  .cd-showcase .music-player-section {\n    min-height: clamp(110px, 18vh, 140px);\n    max-height: none;\n    padding: clamp(0.15rem, 0.5vh, 0.3rem) 0;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player-container {\n    min-height: clamp(115px, 17vh, 135px) !important;\n    max-height: none !important;\n    padding: clamp(0.2rem, 0.6vh, 0.35rem);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player {\n    height: auto !important;\n    min-height: clamp(110px, 16vh, 130px) !important;\n    max-height: none !important;\n    padding: clamp(0.2rem, 0.5vh, 0.3rem) !important;\n    display: flex !important;\n    flex-direction: column !important;\n    gap: 0 !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .track-section,\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .progress-section,\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section {\n    margin: 0 !important;\n    padding: 0 !important;\n    flex-shrink: 0 !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .track-section {\n    order: 1 !important;\n    margin-bottom: 0.05rem !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .track-section .track-title {\n    font-size: clamp(0.8rem, 1vw, 0.9rem);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .track-section .track-artist {\n    font-size: clamp(0.7rem, 0.85vw, 0.8rem);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .progress-section {\n    order: 2 !important;\n    margin-bottom: 0.05rem !important;\n    gap: 0.05rem !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .progress-section .time-display {\n    font-size: clamp(0.6rem, 0.7vw, 0.65rem);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section {\n    order: 3 !important;\n    max-height: clamp(26px, 4vh, 32px) !important;\n    gap: clamp(0.25rem, 0.6vw, 0.4rem) !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .volume-section {\n    gap: clamp(0.25rem, 0.6vw, 0.4rem);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .volume-section .volume-icon {\n    width: clamp(12px, 2vw, 16px);\n    height: clamp(12px, 2vw, 16px);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .volume-section .volume-control .volume-track {\n    width: clamp(35px, 6vw, 50px);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .playback-controls {\n    gap: clamp(0.3rem, 0.8vw, 0.5rem);\n    position: absolute !important;\n    left: 50% !important;\n    top: 50% !important;\n    transform: translate(-50%, -50%) !important;\n    justify-content: center !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .playback-controls .control-button {\n    width: clamp(22px, 3.5vw, 28px) !important;\n    height: clamp(22px, 3.5vw, 28px) !important;\n    border-radius: 50% !important;\n    min-width: clamp(22px, 3.5vw, 28px) !important;\n    max-width: clamp(22px, 3.5vw, 28px) !important;\n    min-height: clamp(22px, 3.5vw, 28px) !important;\n    max-height: clamp(22px, 3.5vw, 28px) !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .playback-controls .control-button .control-icon {\n    width: clamp(12px, 2vw, 16px) !important;\n    height: clamp(12px, 2vw, 16px) !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .playback-controls .control-button.play-pause-button {\n    width: clamp(26px, 4vw, 32px) !important;\n    height: clamp(26px, 4vw, 32px) !important;\n    border-radius: 50% !important;\n    min-width: clamp(26px, 4vw, 32px) !important;\n    max-width: clamp(26px, 4vw, 32px) !important;\n    min-height: clamp(26px, 4vw, 32px) !important;\n    max-height: clamp(26px, 4vw, 32px) !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .playback-controls .control-button.play-pause-button .control-icon {\n    width: clamp(14px, 2.5vw, 18px) !important;\n    height: clamp(14px, 2.5vw, 18px) !important;\n  }\n}\n@media (max-width: 480px) {\n  .cd-showcase .music-player-section {\n    max-height: clamp(70px, 12vh, 85px);\n    padding: clamp(0.15rem, 0.4vh, 0.25rem) 0;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player-container {\n    min-height: clamp(105px, 16vh, 125px) !important;\n    max-height: none !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player {\n    height: auto !important;\n    min-height: clamp(100px, 15vh, 120px) !important;\n    max-height: none !important;\n    padding: clamp(0.15rem, 0.4vh, 0.25rem) !important;\n    overflow: visible !important;\n    box-sizing: border-box !important;\n    display: flex !important;\n    flex-direction: column !important;\n    gap: 0 !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .track-section,\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .progress-section,\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section {\n    margin: 0 !important;\n    padding: 0 !important;\n    flex-shrink: 0 !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .track-section {\n    order: 1 !important;\n    margin-bottom: 0.05rem !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .track-section .track-title {\n    font-size: clamp(0.75rem, 0.9vw, 0.85rem);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .track-section .track-artist {\n    font-size: clamp(0.65rem, 0.8vw, 0.75rem);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .progress-section {\n    order: 2 !important;\n    margin-bottom: 0.05rem !important;\n    gap: 0.1rem;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .progress-section .time-display {\n    font-size: clamp(0.55rem, 0.65vw, 0.6rem);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .progress-section .progress-container .progress-track {\n    height: clamp(1.5px, 0.3vh, 2.5px);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .progress-section .progress-container .progress-track .progress-slider {\n    height: clamp(1.5px, 0.3vh, 2.5px);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section {\n    order: 3 !important;\n    max-height: clamp(24px, 4vh, 30px) !important;\n    gap: clamp(0.3rem, 0.8vw, 0.5rem);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .volume-section {\n    gap: clamp(0.25rem, 0.6vw, 0.4rem);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .volume-section .volume-icon {\n    width: clamp(12px, 2.2vw, 16px);\n    height: clamp(12px, 2.2vw, 16px);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .volume-section .volume-control .volume-track {\n    width: clamp(35px, 7vw, 45px);\n    height: clamp(1.5px, 0.4vh, 2.5px);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .volume-section .volume-control .volume-track .volume-slider {\n    height: clamp(1.5px, 0.4vh, 2.5px);\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .playback-controls {\n    gap: clamp(0.3rem, 0.8vw, 0.5rem);\n    position: absolute !important;\n    left: 50% !important;\n    top: 50% !important;\n    transform: translate(-50%, -50%) !important;\n    justify-content: center !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .playback-controls .control-button {\n    width: clamp(22px, 4vw, 28px) !important;\n    height: clamp(22px, 4vw, 28px) !important;\n    border-radius: 50% !important;\n    min-width: clamp(22px, 4vw, 28px) !important;\n    max-width: clamp(22px, 4vw, 28px) !important;\n    min-height: clamp(22px, 4vw, 28px) !important;\n    max-height: clamp(22px, 4vw, 28px) !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .playback-controls .control-button .control-icon {\n    width: clamp(12px, 2.2vw, 16px) !important;\n    height: clamp(12px, 2.2vw, 16px) !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .playback-controls .control-button.play-pause-button {\n    width: clamp(26px, 4.5vw, 32px) !important;\n    height: clamp(26px, 4.5vw, 32px) !important;\n    border-radius: 50% !important;\n    min-width: clamp(26px, 4.5vw, 32px) !important;\n    max-width: clamp(26px, 4.5vw, 32px) !important;\n    min-height: clamp(26px, 4.5vw, 32px) !important;\n    max-height: clamp(26px, 4.5vw, 32px) !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player .controls-section .playback-controls .control-button.play-pause-button .control-icon {\n    width: clamp(14px, 2.8vw, 18px) !important;\n    height: clamp(14px, 2.8vw, 18px) !important;\n  }\n}\n.cd-showcase .artist-cards-section {\n  width: 100%;\n  margin-top: clamp(7rem, 12vh, 11rem);\n  padding: 0;\n  box-sizing: border-box;\n  overflow: visible;\n  display: flex;\n  justify-content: center;\n}\n.cd-showcase .artist-cards-section app-dynamic-artist-cards {\n  width: 100%;\n  max-width: 100%;\n  display: block;\n  box-sizing: border-box;\n}\n.cd-showcase .artist-cards-section app-dynamic-artist-cards ::ng-deep .artists-container,\n.cd-showcase .artist-cards-section app-dynamic-artist-cards ::ng-deep .artists-grid {\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: clamp(1rem, 2vw, 2rem);\n}\n.cd-showcase .artist-cards-section app-dynamic-artist-cards ::ng-deep .artist-card {\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n}\n@media (max-width: 768px) {\n  .cd-showcase .artist-cards-section {\n    margin-top: clamp(1.5rem, 2vh, 2rem);\n  }\n  .cd-showcase .artist-cards-section app-dynamic-artist-cards ::ng-deep .artists-container,\n  .cd-showcase .artist-cards-section app-dynamic-artist-cards ::ng-deep .artists-grid {\n    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n    gap: clamp(0.75rem, 1.5vw, 1.5rem);\n  }\n}\n@media (max-width: 480px) {\n  .cd-showcase .artist-cards-section {\n    margin-top: clamp(1rem, 1.5vh, 1.5rem);\n  }\n  .cd-showcase .artist-cards-section app-dynamic-artist-cards ::ng-deep .artists-container,\n  .cd-showcase .artist-cards-section app-dynamic-artist-cards ::ng-deep .artists-grid {\n    grid-template-columns: 1fr;\n    gap: clamp(0.5rem, 1vw, 1rem);\n  }\n}\n.cd-showcase .cd-jacket {\n  position: relative;\n  width: clamp(360px, 45vw, 480px);\n  height: clamp(360px, 45vw, 480px);\n  perspective: 55vw;\n  flex-shrink: 0;\n  margin: 0 auto;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n@media (min-width: 1025px) and (max-width: 1440px) {\n  .cd-showcase .cd-jacket {\n    width: clamp(420px, 32vw, 480px);\n    height: clamp(420px, 32vw, 480px);\n  }\n}\n@media (max-width: 1024px) {\n  .cd-showcase .cd-jacket {\n    width: clamp(380px, 45vw, 460px);\n    height: clamp(380px, 45vw, 460px);\n  }\n}\n@media (max-width: 768px) {\n  .cd-showcase .cd-jacket {\n    width: clamp(320px, 50vw, 380px);\n    height: clamp(320px, 50vw, 380px);\n  }\n}\n@media (max-width: 480px) {\n  .cd-showcase .cd-jacket {\n    width: clamp(280px, 60vw, 320px);\n    height: clamp(280px, 60vw, 320px);\n  }\n}\n.cd-showcase .cd-jacket .jacket-3d-container {\n  position: relative;\n  width: 100%;\n  height: 100%;\n  transform-style: preserve-3d;\n  transition: transform 0.4s ease;\n}\n.cd-showcase .cd-jacket .jacket-3d-container:hover {\n  transform: rotateY(15deg) rotateX(5deg);\n}\n.cd-showcase .cd-jacket .jacket-art {\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.08) 0%,\n      rgba(255, 255, 255, 0.04) 25%,\n      rgba(0, 0, 0, 0.1) 50%,\n      rgba(0, 0, 0, 0.2) 100%);\n  backdrop-filter: blur(8px) saturate(1.2);\n  -webkit-backdrop-filter: blur(8px) saturate(1.2);\n  border-radius: clamp(12px, 1.5vw, 24px);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  position: relative;\n  z-index: 2;\n  box-shadow:\n    0 1.39vw 3.47vw rgba(0, 0, 0, 0.35),\n    0 0.56vw 1.74vw rgba(0, 0, 0, 0.2),\n    inset 0 0.07vw 0 rgba(255, 255, 255, 0.15),\n    inset 0 -0.07vw 0 rgba(0, 0, 0, 0.1);\n  border: clamp(1px, 0.1vw, 2px) solid rgba(255, 255, 255, 0.12);\n  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n}\n.cd-showcase .cd-jacket .jacket-art:hover {\n  box-shadow:\n    0 1.74vw 4.17vw rgba(0, 0, 0, 0.4),\n    0 0.69vw 2.08vw rgba(0, 0, 0, 0.25),\n    inset 0 0.07vw 0 rgba(255, 255, 255, 0.2),\n    inset 0 -0.07vw 0 rgba(0, 0, 0, 0.15);\n}\n.cd-showcase .cd-jacket .jacket-art .album-cover {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  border-radius: 0.83vw;\n  transition: all 0.3s ease;\n  display: block;\n}\n.cd-showcase .cd-jacket .jacket-art .album-cover:hover {\n  transform: scale(1.02);\n  filter: brightness(1.1) contrast(1.05);\n}\n.cd-showcase .cd-jacket .jacket-art .art-placeholder mat-icon {\n  font-size: 6.25vw;\n  color: rgba(255, 255, 255, 0.9);\n  filter: drop-shadow(0 0.28vw 1.11vw rgba(0, 0, 0, 0.5));\n  transition: all 0.3s ease;\n}\n.cd-showcase .cd-jacket .jacket-art::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  border-radius: inherit;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.1) 0%,\n      transparent 50%,\n      rgba(255, 255, 255, 0.05) 100%);\n  pointer-events: none;\n  opacity: 0;\n  transition: opacity 0.3s ease;\n}\n.cd-showcase .cd-jacket .jacket-art:hover::before {\n  opacity: 1;\n}\n.cd-showcase .cd-jacket .jacket-spine {\n  position: absolute;\n  left: -1.11vw;\n  top: 0;\n  width: 2.22vw;\n  height: 100%;\n  background:\n    linear-gradient(\n      180deg,\n      rgb(63.4310344828, 70.75, 78.0689655172),\n      #343a40,\n      rgb(10.2567567568, 11.5, 12.7432432432));\n  border-radius: 0.28vw 0 0 0.28vw;\n  transform: skewY(2deg);\n  z-index: 1;\n  box-shadow:\n    -0.14vw 0 0.56vw rgba(0, 0, 0, 0.3),\n    inset 0.14vw 0 0.28vw rgba(0, 0, 0, 0.2),\n    inset -0.14vw 0 0.14vw rgba(255, 255, 255, 0.1);\n  border-right: 0.07vw solid rgba(0, 0, 0, 0.3);\n}\n.cd-showcase .cd-jacket .jacket-spine::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    repeating-linear-gradient(\n      90deg,\n      transparent,\n      transparent 0.07vw,\n      rgba(255, 255, 255, 0.03) 0.07vw,\n      rgba(255, 255, 255, 0.03) 0.14vw);\n  border-radius: inherit;\n}\n.cd-showcase .cd-jacket .jacket-reflection {\n  position: absolute;\n  bottom: -3.47vw;\n  left: 0;\n  width: 100%;\n  height: 50%;\n  background:\n    linear-gradient(\n      180deg,\n      rgba(0, 0, 0, 0.1),\n      transparent);\n  border-radius: 0.83vw;\n  filter: blur(0.07vw);\n  opacity: 0.6;\n  transform-origin: top center;\n  transition: transform 0.4s ease;\n  pointer-events: none;\n}\n.cd-showcase .cd-jacket .jacket-3d-container:hover + .jacket-reflection {\n  transform: rotateY(7deg) rotateX(-2deg) scaleY(0.95);\n  opacity: 0.4;\n}\n.cd-showcase .album-info {\n  flex: 0 0 auto;\n  min-width: 0;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  width: 100%;\n}\n.cd-showcase .album-info .artist-info {\n  margin-bottom: clamp(1rem, 2vh, 2rem);\n}\n.cd-showcase .album-info .artist-info .artists {\n  font-family: "Inter", sans-serif;\n  font-size: clamp(1.75rem, 2.5vw, 3rem);\n  font-weight: 600;\n  margin: 0 0 clamp(0.5rem, 1vh, 1rem) 0;\n  color: #ffffff;\n  text-shadow: 0 2px 12px rgba(0, 0, 0, 0.7);\n  line-height: 1.2;\n}\n@media (max-width: 1024px) {\n  .cd-showcase .album-info .artist-info .artists {\n    font-size: clamp(1.5rem, 3vw, 2.5rem);\n    text-align: center;\n  }\n}\n@media (max-width: 768px) {\n  .cd-showcase .album-info .artist-info .artists {\n    font-size: clamp(1.2rem, 2.5vw, 2rem);\n  }\n}\n.cd-showcase .album-info .artist-info .collaboration-label {\n  font-size: clamp(1rem, 1.2vw, 1.4rem);\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0;\n  font-style: italic;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);\n  letter-spacing: 0.5px;\n  text-transform: uppercase;\n}\n@media (max-width: 1024px) {\n  .cd-showcase .album-info .artist-info .collaboration-label {\n    text-align: center;\n  }\n}\n.cd-showcase .album-info .album-details {\n  display: flex;\n  flex-direction: column;\n  gap: clamp(0.25rem, 0.5vh, 0.4rem);\n  padding: clamp(0.5rem, 0.8vh, 0.65rem);\n  width: fit-content;\n  min-width: 280px;\n  max-width: 400px;\n  box-sizing: border-box;\n  flex-grow: 0;\n  flex-shrink: 1;\n  flex-basis: auto;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.06) 0%,\n      rgba(255, 255, 255, 0.02) 50%,\n      rgba(0, 0, 0, 0.08) 100%);\n  backdrop-filter: blur(6px);\n  -webkit-backdrop-filter: blur(6px);\n  border-radius: clamp(10px, 1.2vh, 16px);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n}\n.cd-showcase .album-info .album-details .detail-item {\n  display: flex;\n  align-items: center;\n  gap: clamp(0.5rem, 0.8vw, 1rem);\n  color: rgba(255, 255, 255, 0.95);\n  font-size: clamp(0.9rem, 1vw, 1.2rem);\n  font-weight: 400;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);\n  padding: clamp(0.3rem, 0.6vh, 0.5rem);\n  border-radius: clamp(6px, 0.8vh, 10px);\n  transition: all 0.3s ease;\n  box-sizing: border-box;\n}\n.cd-showcase .album-info .album-details .detail-item:hover {\n  background: rgba(255, 255, 255, 0.05);\n  transform: translateX(4px);\n}\n.cd-showcase .album-info .album-details .detail-item mat-icon {\n  color: rgba(255, 255, 255, 0.9);\n  font-size: clamp(16px, 1vw, 20px);\n  width: clamp(16px, 1vw, 20px);\n  height: clamp(16px, 1vw, 20px);\n  flex-shrink: 0;\n  filter: drop-shadow(0 0 8px rgba(255, 255, 255, 0.2));\n}\n.cd-showcase .album-info .album-details .detail-item span {\n  font-weight: 500;\n  letter-spacing: 0.3px;\n  word-break: break-word;\n  line-height: 1.4;\n}\n.cd-showcase .evolution-text {\n  text-align: center;\n  margin: 1.5rem 0 0 0;\n}\n.cd-showcase .evolution-text h4 {\n  font-family: "Inter", sans-serif;\n  font-size: clamp(1.1rem, 0.9vw, 1.4rem);\n  font-weight: 500;\n  color: rgba(255, 255, 255, 0.9);\n  margin: 0;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.6);\n}\n.cd-showcase .music-player-section app-music-player {\n  display: block;\n  margin: 0;\n  padding: 0;\n  box-sizing: border-box;\n  max-width: 100%;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .music-player-container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .player-controls {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 1rem;\n}\n.cd-showcase .music-player-section app-music-player ::ng-deep .play-pause-btn {\n  margin: 0 auto;\n}\n.artist-section {\n  text-align: center;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.18) 0%,\n      rgba(0, 0, 0, 0.21) 25%,\n      rgba(0, 0, 0, 0.24) 50%,\n      rgba(0, 0, 0, 0.27) 100%);\n  backdrop-filter: blur(clamp(6px, 1vw, 12px)) saturate(1.2);\n  -webkit-backdrop-filter: blur(clamp(6px, 1vw, 12px)) saturate(1.2);\n  border-radius: clamp(18px, 3.5vw, 36px);\n  border: clamp(1px, 0.15vw, 2px) solid rgba(255, 255, 255, 0.15);\n  margin: clamp(1.5rem, 4vh, 3rem) 10vw 0;\n  max-width: 80vw;\n  width: 80vw;\n  padding: clamp(1rem, 3vh, 2.5rem) clamp(1rem, 2vw, 2rem) clamp(0.5rem, 1vh, 1rem);\n  position: relative;\n  box-sizing: border-box;\n}\n@media (max-width: 768px) {\n  .artist-section {\n    max-width: 80vw;\n    width: 80vw;\n    margin: 1rem 10vw;\n    padding: 1.5rem 1rem;\n    border-radius: 20px;\n  }\n}\n@media (max-width: 480px) {\n  .artist-section {\n    max-width: 85vw;\n    width: 85vw;\n    margin: 0.5rem 7.5vw;\n    padding: 1rem 0.75rem;\n    border-radius: 16px;\n  }\n}\n.artist-section {\n  will-change: transform, opacity;\n  backface-visibility: hidden;\n  transform: translateZ(0);\n  box-shadow:\n    0 8px 32px rgba(0, 0, 0, 0.25),\n    0 4px 16px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.1),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.05);\n  transition: all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n}\n.artist-section:hover {\n  transform: translateY(-4px) translateZ(0);\n  box-shadow:\n    0 12px 40px rgba(0, 0, 0, 0.3),\n    0 6px 20px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.15),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.08);\n}\n.artist-section h3 {\n  font-family: "Inter", sans-serif;\n  font-size: clamp(1.5rem, 2vw, 2.5rem);\n  color: #ffffff;\n  margin: 0 0 3rem 0;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);\n}\n.artist-section .artists-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 2rem;\n  max-width: 100%;\n  width: 100%;\n  margin: 0;\n}\n@media (max-width: 768px) {\n  .artist-section .artists-grid {\n    grid-template-columns: 1fr;\n    gap: 1.5rem;\n    max-width: 100%;\n  }\n}\n@media (max-width: 480px) {\n  .artist-section .artists-grid {\n    gap: 1rem;\n    max-width: 100%;\n  }\n}\n.artist-section .artists-grid .artist-card {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.7),\n      rgba(20, 20, 20, 0.8));\n  backdrop-filter: blur(clamp(6px, 1vw, 12px));\n  -webkit-backdrop-filter: blur(clamp(6px, 1vw, 12px));\n  border-radius: clamp(12px, 2vw, 20px);\n  border: clamp(1px, 0.15vw, 2px) solid rgba(255, 255, 255, 0.2);\n  padding: clamp(1.5rem, 3vh, 2.5rem);\n  text-align: center;\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n  box-shadow: 0 clamp(3px, 0.6vw, 6px) clamp(15px, 3vw, 25px) rgba(0, 0, 0, 0.3);\n  box-sizing: border-box;\n  max-width: 100%;\n}\n@media (max-width: 768px) {\n  .artist-section .artists-grid .artist-card {\n    padding: 1.5rem;\n    margin: 0 auto;\n    max-width: calc(100% - 1rem);\n  }\n}\n@media (max-width: 480px) {\n  .artist-section .artists-grid .artist-card {\n    padding: 1rem;\n    border-radius: 12px;\n    max-width: calc(100% - 0.5rem);\n  }\n}\n.artist-section .artists-grid .artist-card:hover {\n  transform: translateY(-8px);\n  box-shadow: 0 clamp(12px, 2vw, 20px) clamp(30px, 5vw, 50px) rgba(0, 0, 0, 0.2);\n}\n.artist-section .artists-grid .artist-card .artist-avatar {\n  width: clamp(60px, 10vw, 100px);\n  height: clamp(60px, 10vw, 100px);\n  border-radius: 50%;\n  background:\n    linear-gradient(\n      135deg,\n      #343a40,\n      #212529,\n      #000000);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin: 0 auto clamp(0.75rem, 1.5vh, 1.25rem) auto;\n  color: #ffffff;\n  font-weight: 700;\n  font-size: clamp(1.2rem, 1.8vw, 2rem);\n  box-shadow: 0 clamp(6px, 1vw, 12px) clamp(15px, 3vw, 25px) rgba(0, 0, 0, 0.2);\n}\n.artist-section .artists-grid .artist-card .artist-info h4 {\n  font-family: "Inter", sans-serif;\n  font-size: clamp(1.1rem, 1.5vw, 1.8rem);\n  color: #ffffff;\n  margin: 0 0 0.5rem 0;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);\n}\n.artist-section .artists-grid .artist-card .artist-info p {\n  color: #f8f9fa;\n  margin: 0 0 1.5rem 0;\n  font-style: italic;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.8);\n}\n.artist-section .artists-grid .artist-card .artist-info .social-links {\n  display: flex;\n  justify-content: center;\n  gap: 0.5rem;\n}\n.artist-section .artists-grid .artist-card .artist-info .social-links .social-link {\n  width: clamp(44px, 12vw, 48px);\n  height: clamp(44px, 12vw, 48px);\n  min-width: 44px;\n  min-height: 44px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.1);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  color: #f8f9fa;\n  transition: all 0.3s ease;\n  text-decoration: none;\n}\n.artist-section .artists-grid .artist-card .artist-info .social-links .social-link:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #343a40,\n      #212529,\n      #000000);\n  color: #ffffff;\n  transform: scale(1.1);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);\n}\n.artist-section .artists-grid .artist-card .artist-info .social-links .social-link.youtube-link:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #FF0000,\n      #CC0000);\n  border-color: #FF0000;\n}\n.artist-section .artists-grid .artist-card .artist-info .social-links .social-link.spotify-link:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #1DB954,\n      #1AA34A);\n  border-color: #1DB954;\n}\n.artist-section .artists-grid .artist-card .artist-info .social-links .social-link.soundcloud-link:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #FF5500,\n      #E14D00);\n  border-color: #FF5500;\n}\n.artist-section .artists-grid .artist-card .artist-info .social-links .social-link.twitter-link:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #1DA1F2,\n      #0D8BD9);\n  border-color: #1DA1F2;\n}\n.artist-section .artists-grid .artist-card .artist-info .social-links .social-link.website-link:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #666666,\n      #444444);\n  border-color: #666666;\n}\n.artist-section .artists-grid .artist-card .artist-info .social-links .social-link mat-icon {\n  font-size: clamp(16px, 1.2vw, 24px);\n  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));\n}\n.phantasia-footer {\n  background: rgba(0, 0, 0, 0.9);\n  color: white;\n  padding: clamp(1.5rem, 3vh, 2.5rem) clamp(1.5rem, 3vw, 2.5rem) clamp(1rem, 2vh, 2rem);\n  margin-top: clamp(1.5rem, 3vh, 2.5rem);\n}\n.phantasia-footer .footer-content {\n  max-width: 80vw;\n  width: 80vw;\n  margin: 0 auto;\n  display: grid;\n  grid-template-columns: 1fr 2fr 1fr;\n  gap: clamp(1.5rem, 3vw, 2.5rem);\n  align-items: start;\n}\n@media (max-width: 768px) {\n  .phantasia-footer .footer-content {\n    grid-template-columns: 1fr;\n    text-align: center;\n  }\n}\n.phantasia-footer .footer-content .footer-logo img {\n  max-width: clamp(200px, 20vw, 350px);\n  width: clamp(180px, 18vw, 320px);\n  height: auto;\n  filter: brightness(0) invert(1);\n  min-width: 180px;\n}\n.phantasia-footer .footer-content .footer-links {\n  display: flex;\n  justify-content: space-around;\n  gap: 2rem;\n}\n.phantasia-footer .footer-content .footer-links .link-group h3 {\n  font-size: clamp(0.9rem, 1.3vw, 1.4rem);\n  font-weight: 600;\n  margin-bottom: 1rem;\n  color: #e9ecef;\n}\n.phantasia-footer .footer-content .footer-links .link-group ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.phantasia-footer .footer-content .footer-links .link-group ul li {\n  margin-bottom: 0.5rem;\n}\n.phantasia-footer .footer-content .footer-links .link-group ul li a {\n  color: #6c757d;\n  text-decoration: none;\n  transition: color 0.3s ease;\n}\n.phantasia-footer .footer-content .footer-links .link-group ul li a:hover {\n  color: white;\n}\n.phantasia-footer .footer-content .copyright {\n  font-size: clamp(0.8rem, 1.1vw, 1.2rem);\n  color: #6c757d;\n  text-align: right;\n}\n@media (max-width: 768px) {\n  .phantasia-footer .footer-content .copyright {\n    text-align: center;\n  }\n}\n@keyframes bounce {\n  0%, 20%, 50%, 80%, 100% {\n    padding-bottom: 0;\n  }\n  40% {\n    padding-bottom: 6px;\n  }\n  60% {\n    padding-bottom: 3px;\n  }\n}\n@keyframes scrollIndicatorPulse {\n  0%, 100% {\n    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 255, 255, 0.1);\n  }\n  50% {\n    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.3), 0 0 16px rgba(255, 255, 255, 0.2);\n  }\n}\n@keyframes triangleFloat {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(-0.56vw);\n  }\n}\n@keyframes triangleBounce {\n  0%, 20%, 50%, 80%, 100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(-0.69vw);\n  }\n  60% {\n    transform: translateY(-0.35vw);\n  }\n}\n@keyframes arrowFloat {\n  0%, 100% {\n    transform: translateY(0);\n  }\n  50% {\n    transform: translateY(0.56vw);\n  }\n}\n@keyframes arrowBounce {\n  0%, 20%, 50%, 80%, 100% {\n    transform: translateY(0);\n  }\n  40% {\n    transform: translateY(0.69vw);\n  }\n  60% {\n    transform: translateY(0.35vw);\n  }\n}\n@media (max-width: 768px) {\n  .video-title-section {\n    height: calc(150vh - 89px);\n    min-height: calc(150vh - 89px);\n    margin-top: 89px;\n    padding: 0;\n    margin-bottom: clamp(2rem, 5vh, 4rem);\n  }\n  .video-title-section .title-container {\n    transform: translate(-50%, -50%) !important;\n    position: absolute !important;\n    top: 50% !important;\n    left: 50% !important;\n    width: 100%;\n    height: auto;\n    z-index: 10;\n  }\n  .video-title-section .title-video {\n    object-fit: contain;\n    transform: scale(2.3) translateY(-20vh) !important;\n    max-width: 95vw !important;\n    max-height: 75vh !important;\n  }\n  .video-title-section .title-subtitle {\n    font-size: clamp(1rem, 1.4vw, 1.3rem);\n    margin-top: clamp(0.75rem, 1.2vh, 1rem);\n  }\n  .cd-showcase {\n    padding: 3.26vw 1.31vw 0.65vw;\n    margin: clamp(3rem, 6vh, 5rem) auto 1.31vw;\n    will-change: transform;\n  }\n  .cd-showcase .showcase-main-content {\n    gap: 2rem;\n    min-height: auto;\n  }\n  .cd-showcase .album-cover-section {\n    width: 100%;\n    display: flex;\n    justify-content: center;\n  }\n  .cd-showcase .album-content-section {\n    width: 100%;\n    gap: 1.5rem;\n    text-align: center;\n  }\n  .cd-showcase .album-info .artist-info .artists {\n    font-size: clamp(1.2rem, 2.35vw, 2rem);\n  }\n  .artist-section {\n    padding: 2.61vw 1.31vw 0.65vw;\n    margin: 1.31vw auto;\n  }\n  .artist-section .artists-grid {\n    grid-template-columns: 1fr;\n    gap: 1.96vw;\n  }\n  .scroll-indicator-container {\n    padding: 0.75rem 1rem;\n  }\n  .scroll-indicator-container .scroll-text {\n    font-size: clamp(0.8rem, 1.18vw, 1.1rem);\n  }\n  .scroll-indicator-container .scroll-arrow .scroll-arrow-icon {\n    font-size: 3.5vw;\n    width: 3.5vw;\n    height: 3.5vw;\n  }\n}\n@media (max-width: 480px) {\n  .video-title-section {\n    height: calc(100vh - 89px);\n    min-height: calc(100vh - 89px);\n    margin-top: 89px;\n    padding: 0;\n  }\n  .video-title-section .title-video {\n    width: 100vw !important;\n    object-fit: contain;\n    transform: translateY(-10vh) scale(2.3) !important;\n  }\n  .video-title-section .title-subtitle {\n    font-size: clamp(0.85rem, 1.88vw, 1.2rem);\n    margin-top: 0.42vw;\n  }\n  .cd-showcase {\n    padding: 2rem 1rem 0.5rem;\n    margin: 2rem auto;\n    border-radius: 20px;\n  }\n  .cd-showcase .showcase-main-content {\n    gap: 1.5rem;\n    min-height: auto;\n  }\n  .cd-showcase .album-cover-section {\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    overflow: visible;\n    max-width: 100%;\n    box-sizing: border-box;\n  }\n  .cd-showcase .album-cover-section .cd-jacket {\n    width: clamp(200px, 70vw, 300px) !important;\n    height: clamp(200px, 70vw, 300px) !important;\n    max-width: 70vw !important;\n    max-height: 50vh !important;\n    box-sizing: border-box;\n    flex-shrink: 1;\n  }\n  .cd-showcase .album-cover-section .cd-jacket .jacket-3d-container {\n    width: 100% !important;\n    height: 100% !important;\n    max-width: 100%;\n    max-height: 100%;\n  }\n  .cd-showcase .album-cover-section .cd-jacket .jacket-art {\n    width: 100% !important;\n    height: 100% !important;\n    max-width: 100%;\n    max-height: 100%;\n    overflow: visible !important;\n    box-sizing: border-box;\n  }\n  .cd-showcase .album-cover-section .cd-jacket .jacket-art .album-cover {\n    width: 100% !important;\n    height: 100% !important;\n    max-width: 100% !important;\n    max-height: 100% !important;\n    object-fit: cover !important;\n    object-position: center;\n  }\n  .cd-showcase .album-content-section {\n    width: 100%;\n    gap: 1rem;\n    text-align: center;\n  }\n}\n.artist-cards-section {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.18) 0%,\n      rgba(0, 0, 0, 0.21) 25%,\n      rgba(0, 0, 0, 0.24) 50%,\n      rgba(0, 0, 0, 0.27) 100%);\n  backdrop-filter: blur(8px) saturate(1.2);\n  -webkit-backdrop-filter: blur(8px) saturate(1.2);\n  border-radius: 28px;\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  margin: clamp(2rem, 4vh, 3rem) auto clamp(1rem, 2vh, 2rem);\n  max-width: min(1800px, 95vw);\n  width: 100%;\n  padding: clamp(1.5rem, 3vh, 2.5rem) clamp(1rem, 3vw, 3rem);\n  position: relative;\n  box-sizing: border-box;\n  clear: both;\n}\n@media (max-width: 768px) {\n  .artist-cards-section {\n    max-width: 80vw;\n    width: 80vw;\n    margin: clamp(2rem, 4vh, 3rem) auto clamp(1rem, 2vh, 2rem);\n    padding: clamp(1.5rem, 2vh, 2rem) clamp(1rem, 2vw, 1.5rem);\n    border-radius: 20px;\n  }\n}\n@media (max-width: 480px) {\n  .artist-cards-section {\n    max-width: 85vw;\n    width: 85vw;\n    margin: clamp(3rem, 5vh, 4rem) auto clamp(1rem, 2vh, 2rem);\n    padding: clamp(1.5rem, 2vh, 2rem) clamp(0.75rem, 2vw, 1.25rem);\n    border-radius: 16px;\n    clear: both !important;\n    display: block !important;\n    position: relative !important;\n    z-index: 1 !important;\n  }\n}\n.artist-cards-section .artist-section {\n  padding: 3.13vw 1.04vw 0.52vw;\n  margin: 1.04vw auto;\n  border-radius: 4.17vw;\n}\n.artist-cards-section .scroll-indicator-container {\n  padding: 0.75rem 1rem;\n}\n.artist-cards-section .scroll-indicator-container .scroll-text {\n  font-size: clamp(0.75rem, 1.67vw, 1rem);\n  margin-bottom: 1.25vw;\n}\n.artist-cards-section .scroll-indicator-container .scroll-arrow .scroll-arrow-icon {\n  font-size: 5vw;\n  width: 5vw;\n  height: 5vw;\n}\n@media (min-width: 769px) and (max-width: 1024px) {\n  .cd-showcase {\n    margin-top: clamp(3rem, 6vh, 5rem);\n  }\n  .cd-showcase .showcase-main-content {\n    gap: 2.5rem;\n    min-height: auto;\n    overflow: visible;\n    justify-content: center;\n    align-items: center;\n  }\n  .cd-showcase .album-cover-section {\n    width: 100%;\n    display: flex;\n    justify-content: center;\n    margin-bottom: 1rem;\n    max-width: 100%;\n    overflow: visible;\n  }\n  .cd-showcase .album-content-section {\n    width: 100%;\n    gap: 2rem;\n    text-align: center;\n    max-width: 100%;\n    overflow: visible;\n    box-sizing: border-box;\n  }\n  .cd-showcase .music-player-section {\n    min-height: 130px;\n    max-height: none;\n    overflow: visible;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player-container {\n    min-height: 125px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player {\n    min-height: 120px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .video-title-section {\n    height: calc(100vh - 89px);\n    min-height: calc(100vh - 89px);\n  }\n  .video-title-section .title-container {\n    transform: translate(-50%, -50%);\n    position: absolute;\n    top: 50%;\n    left: 50%;\n  }\n  .video-title-section .title-video {\n    object-fit: contain;\n    transform: scale(1.35);\n    width: 105vw;\n    height: 80vh;\n  }\n}\n@media (min-width: 1025px) and (max-width: 1440px) {\n  .cd-showcase {\n    max-width: min(1400px, 90vw);\n    width: 100%;\n    margin: clamp(2rem, 4vh, 3rem) auto clamp(1rem, 2vh, 2rem);\n    padding: 0 clamp(1rem, 3vw, 3rem);\n  }\n  .cd-showcase .showcase-main-content {\n    gap: 3rem;\n    min-height: 380px;\n    overflow: visible;\n    align-items: center;\n  }\n  .cd-showcase .cd-jacket {\n    width: clamp(420px, 32vw, 480px);\n    height: clamp(420px, 32vw, 480px);\n  }\n  .cd-showcase .music-player-section {\n    min-height: 160px;\n    max-height: none;\n    overflow: visible;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player-container {\n    min-height: 155px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player {\n    min-height: 150px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .artist-cards-section {\n    max-width: min(1400px, 90vw);\n    width: 100%;\n    margin: clamp(2rem, 4vh, 3rem) auto clamp(1rem, 2vh, 2rem);\n    padding: 0 clamp(1rem, 3vw, 3rem);\n  }\n  .video-title-section .title-video {\n    object-fit: contain;\n    transform: translateY(6vh);\n  }\n}\n@media (min-width: 1441px) and (max-width: 1920px) {\n  .cd-showcase .showcase-main-content {\n    gap: 3.5rem;\n    min-height: 480px;\n    overflow: visible;\n    align-items: center;\n  }\n  .cd-showcase .cd-jacket {\n    width: clamp(460px, 33vw, 520px);\n    height: clamp(460px, 33vw, 520px);\n  }\n  .cd-showcase .album-content-section {\n    gap: 2rem;\n    max-width: 100%;\n    overflow: visible;\n  }\n  .cd-showcase .music-player-section {\n    min-height: 170px;\n    max-height: none;\n    overflow: visible;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player-container {\n    min-height: 165px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .cd-showcase .music-player-section app-music-player ::ng-deep .music-player {\n    min-height: 160px !important;\n    max-height: none !important;\n    overflow: visible !important;\n  }\n  .video-title-section .title-video {\n    object-fit: contain;\n  }\n}\n@media (min-width: 2000px) {\n  .cd-showcase {\n    max-width: min(2200px, 90vw);\n    padding: clamp(2rem, 3vh, 3rem) clamp(2rem, 4vw, 4rem) clamp(0.5rem, 1vh, 1rem);\n  }\n  .cd-showcase .showcase-main-content {\n    gap: 4rem;\n    min-height: 600px;\n  }\n  .cd-showcase .cd-jacket {\n    width: 520px;\n    height: 520px;\n  }\n  .artist-cards-section {\n    max-width: min(2200px, 90vw);\n    padding: clamp(2rem, 3vh, 3rem) clamp(2rem, 4vw, 4rem);\n  }\n}\n@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {\n  .video-title-section .title-video {\n    filter: contrast(1.15) brightness(1.08) drop-shadow(0 0.42vw 1.39vw rgba(0, 0, 0, 0.6));\n  }\n  .cd-showcase {\n    box-shadow:\n      0 0.56vw 2.22vw rgba(0, 0, 0, 0.3),\n      0 0.28vw 1.11vw rgba(0, 0, 0, 0.18),\n      inset 0 0.07vw 0 rgba(255, 255, 255, 0.12),\n      inset 0 -0.07vw 0 rgba(255, 255, 255, 0.06);\n  }\n}\n@media (max-width: 768px) and (min-width: 481px) {\n  .video-title-section {\n    height: calc(100vh - 89px) !important;\n    min-height: calc(100vh - 89px) !important;\n  }\n  .video-title-section .title-container {\n    position: absolute !important;\n    top: 50% !important;\n    left: 50% !important;\n    transform: translate(-50%, -50%) !important;\n    width: 100% !important;\n    height: auto !important;\n    z-index: 10 !important;\n  }\n  .video-title-section .title-video {\n    transform: scale(1.4) !important;\n    width: 95vw !important;\n    height: 70vh !important;\n    max-width: 95vw !important;\n    max-height: 75vh !important;\n    object-fit: contain !important;\n  }\n  .video-title-section .title-subtitle {\n    font-size: clamp(1.1rem, 1.5vw, 1.6rem) !important;\n    margin-top: clamp(0.5rem, 1vh, 0.8rem) !important;\n  }\n  .scroll-indicator-section {\n    margin: -30vh 0 0 0 !important;\n  }\n  .cd-showcase {\n    margin-top: clamp(4rem, 8vh, 6rem) !important;\n  }\n  .artist-section {\n    margin-top: clamp(2rem, 4vh, 3rem) !important;\n  }\n}\n@media (min-width: 1920px) and (max-width: 1920px) and (min-height: 1080px) and (max-height: 1080px) {\n  .cd-showcase {\n    max-width: 1500px;\n    margin: 0.5rem clamp(8rem, 12vw, 16rem);\n    padding: 1rem 2rem 0.75rem;\n  }\n  .cd-showcase .cd-showcase-title {\n    margin-bottom: 1.5rem;\n    font-size: 1.5rem;\n  }\n  .cd-showcase .showcase-main-content {\n    gap: 2.5rem;\n    margin-bottom: 1rem;\n    min-height: 400px;\n    max-height: 450px;\n  }\n  .cd-showcase .cd-jacket {\n    width: 450px;\n    height: 450px;\n  }\n  .cd-showcase .album-content-section {\n    gap: 1.5rem;\n  }\n  .cd-showcase app-dynamic-artist-cards {\n    margin-top: 1rem;\n    max-height: 200px;\n    overflow-y: auto;\n    overflow-x: hidden;\n    box-sizing: border-box;\n  }\n}\n@media (min-width: 1921px) {\n  .video-title-section .title-video {\n    height: 35vmax;\n    transform: translateY(12vh);\n  }\n  .video-title-section .title-subtitle {\n    font-size: 0.6vmax;\n  }\n  .video-title-section .title-container .scroll-indicator-container {\n    padding-bottom: 12vh;\n  }\n  .cd-showcase {\n    max-width: 70vmax;\n    padding: 1.5vmax 1vmax;\n  }\n  .cd-showcase .cd-jacket {\n    width: 30vmax;\n    height: 30vmax;\n  }\n}\n@media (min-aspect-ratio: 21/9) {\n  .video-title-section .title-video {\n    height: 30vmin;\n    transform: translateY(46vh);\n  }\n  .video-title-section .title-container .scroll-indicator-container {\n    padding-bottom: 10vh;\n  }\n  .cd-showcase .showcase-container {\n    gap: 4vmin;\n  }\n}\n@media (orientation: portrait) {\n  .video-title-section .title-video {\n    position: absolute;\n  }\n  .video-title-section .title-subtitle {\n    font-size: clamp(1rem, 2.5vw, 1.8rem);\n  }\n  .video-title-section .scroll-indicator-container {\n    padding-top: clamp(2rem, 8vh, 5rem);\n    margin: 0 auto clamp(1rem, 2vh, 3rem);\n  }\n  .cd-showcase .cd-jacket {\n    width: clamp(280px, 32vw, 480px);\n    height: clamp(280px, 32vw, 480px);\n  }\n}\n@media (orientation: portrait) and (max-width: 768px) {\n  .cd-showcase .cd-jacket {\n    width: clamp(250px, 45vw, 350px);\n    height: clamp(250px, 45vw, 350px);\n  }\n}\n@media (orientation: portrait) and (max-width: 480px) {\n  .cd-showcase .cd-jacket {\n    width: clamp(200px, 50vw, 280px);\n    height: clamp(200px, 50vw, 280px);\n  }\n}\n@media (orientation: landscape) and (max-height: 480px) {\n  .video-title-section .title-video {\n    height: 40vh;\n    transform: translateY(-2vh);\n  }\n  .scroll-indicator-container {\n    padding-top: clamp(0.5rem, 2vh, 1.5rem);\n    margin: 0 auto 0.5rem;\n    min-height: 44px;\n  }\n}\n@media (orientation: portrait) and (max-height: 812px) and (max-width: 480px) {\n  .scroll-indicator-container {\n    padding-top: clamp(2rem, 8vh, 5rem);\n    margin: 0 auto clamp(0.5rem, 2vh, 2rem);\n  }\n}\n@media (min-width: 1920px) {\n  .scroll-indicator-container {\n    padding-top: clamp(10rem, 15vh, 20rem);\n    margin: 0 auto clamp(3rem, 5vh, 8rem);\n  }\n}\n@media (max-width: 320px) {\n  .scroll-indicator-container {\n    padding: 0.75rem 0.5rem;\n    margin: 0 auto 1rem;\n  }\n  .scroll-indicator-container .scroll-text {\n    font-size: 0.9rem;\n    letter-spacing: 0.03em;\n  }\n  .video-title-section .title-container {\n    padding: 0.5rem;\n  }\n  .cd-showcase {\n    margin: 0.5rem auto;\n    padding: 1rem 0.5rem 0.5rem;\n  }\n  .artist-section .artists-grid {\n    grid-template-columns: 1fr;\n    gap: 0.75rem;\n  }\n}\n@media (hover: none) and (pointer: coarse) {\n  .scroll-indicator-container {\n    padding: 1rem 1.5rem;\n    min-height: 44px;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .video-title-section .title-container {\n    will-change: auto;\n  }\n  .video-title-section .title-video {\n    will-change: auto;\n  }\n  .cd-showcase {\n    will-change: auto;\n  }\n  .cd-showcase:hover {\n    transform: none;\n  }\n  .cd-showcase .cd-jacket .jacket-3d-container:hover {\n    transform: none;\n  }\n  .artist-section {\n    will-change: auto;\n  }\n  .artist-section:hover {\n    transform: none;\n  }\n}\n/*# sourceMappingURL=phantasia2.css.map */\n'] }]
  }], () => [{ type: ChangeDetectorRef }, { type: Router }, { type: Document, decorators: [{
    type: Inject,
    args: [DOCUMENT]
  }] }, { type: AudioService }, { type: DynamicArtistService }], { backgroundVideo: [{
    type: ViewChild,
    args: ["backgroundVideo", { static: false }]
  }], titleVideo: [{
    type: ViewChild,
    args: ["titleVideo", { static: false }]
  }], cdShowcase: [{
    type: ViewChild,
    args: ["cdShowcase", { static: false }]
  }], componentClass: [{
    type: HostBinding,
    args: ["class.phantasia2-component"]
  }], loadingActive: [{
    type: HostBinding,
    args: ["class.loading-active"]
  }], albumPageClass: [{
    type: HostBinding,
    args: ["class.phantasia-album-page"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(Phantasia2Component, { className: "Phantasia2Component", filePath: "src/app/pages/collections/phantasia/pages/phantasia2/phantasia2.ts", lineNumber: 72 });
})();
export {
  Phantasia2Component
};
//# sourceMappingURL=chunk-CBF3B3VP.js.map
