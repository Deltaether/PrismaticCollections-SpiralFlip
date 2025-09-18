import {
  Router,
  RouterLink,
  RouterModule
} from "./chunk-FJNAFJM7.js";
import {
  CSP_NONCE,
  ChangeDetectionStrategy,
  CommonModule,
  Component,
  Directive,
  Injectable,
  Input,
  NgModule,
  NgZone,
  Observable,
  PLATFORM_ID,
  Subject,
  TemplateRef,
  ViewContainerRef,
  combineLatest,
  computed,
  concat,
  debounceTime,
  inject,
  isPlatformBrowser,
  map,
  setClassMetadata,
  shareReplay,
  signal,
  skip,
  startWith,
  take,
  takeUntil,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext
} from "./chunk-F34NQEWD.js";

// node_modules/.pnpm/@angular+cdk@20.2.1_@angular+common@20.1.4_@angular+core@20.1.4_@angular+compiler@20.1._b1186cf6030b5c2736340dec250d600a/node_modules/@angular/cdk/fesm2022/platform2.mjs
var hasV8BreakIterator;
try {
  hasV8BreakIterator = typeof Intl !== "undefined" && Intl.v8BreakIterator;
} catch {
  hasV8BreakIterator = false;
}
var Platform = class _Platform {
  _platformId = inject(PLATFORM_ID);
  // We want to use the Angular platform check because if the Document is shimmed
  // without the navigator, the following checks will fail. This is preferred because
  // sometimes the Document may be shimmed without the user's knowledge or intention
  /** Whether the Angular application is being rendered in the browser. */
  isBrowser = this._platformId ? isPlatformBrowser(this._platformId) : typeof document === "object" && !!document;
  /** Whether the current browser is Microsoft Edge. */
  EDGE = this.isBrowser && /(edge)/i.test(navigator.userAgent);
  /** Whether the current rendering engine is Microsoft Trident. */
  TRIDENT = this.isBrowser && /(msie|trident)/i.test(navigator.userAgent);
  // EdgeHTML and Trident mock Blink specific things and need to be excluded from this check.
  /** Whether the current rendering engine is Blink. */
  BLINK = this.isBrowser && !!(window.chrome || hasV8BreakIterator) && typeof CSS !== "undefined" && !this.EDGE && !this.TRIDENT;
  // Webkit is part of the userAgent in EdgeHTML, Blink and Trident. Therefore we need to
  // ensure that Webkit runs standalone and is not used as another engine's base.
  /** Whether the current rendering engine is WebKit. */
  WEBKIT = this.isBrowser && /AppleWebKit/i.test(navigator.userAgent) && !this.BLINK && !this.EDGE && !this.TRIDENT;
  /** Whether the current platform is Apple iOS. */
  IOS = this.isBrowser && /iPad|iPhone|iPod/.test(navigator.userAgent) && !("MSStream" in window);
  // It's difficult to detect the plain Gecko engine, because most of the browsers identify
  // them self as Gecko-like browsers and modify the userAgent's according to that.
  // Since we only cover one explicit Firefox case, we can simply check for Firefox
  // instead of having an unstable check for Gecko.
  /** Whether the current browser is Firefox. */
  FIREFOX = this.isBrowser && /(firefox|minefield)/i.test(navigator.userAgent);
  /** Whether the current platform is Android. */
  // Trident on mobile adds the android platform to the userAgent to trick detections.
  ANDROID = this.isBrowser && /android/i.test(navigator.userAgent) && !this.TRIDENT;
  // Safari browsers will include the Safari keyword in their userAgent. Some browsers may fake
  // this and just place the Safari keyword in the userAgent. To be more safe about Safari every
  // Safari browser should also use Webkit as its layout engine.
  /** Whether the current browser is Safari. */
  SAFARI = this.isBrowser && /safari/i.test(navigator.userAgent) && this.WEBKIT;
  constructor() {
  }
  static \u0275fac = function Platform_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _Platform)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _Platform,
    factory: _Platform.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(Platform, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// node_modules/.pnpm/@angular+cdk@20.2.1_@angular+common@20.1.4_@angular+core@20.1.4_@angular+compiler@20.1._b1186cf6030b5c2736340dec250d600a/node_modules/@angular/cdk/fesm2022/array.mjs
function coerceArray(value) {
  return Array.isArray(value) ? value : [value];
}

// node_modules/.pnpm/@angular+cdk@20.2.1_@angular+common@20.1.4_@angular+core@20.1.4_@angular+compiler@20.1._b1186cf6030b5c2736340dec250d600a/node_modules/@angular/cdk/fesm2022/breakpoints-observer.mjs
var mediaQueriesForWebkitCompatibility = /* @__PURE__ */ new Set();
var mediaQueryStyleNode;
var MediaMatcher = class _MediaMatcher {
  _platform = inject(Platform);
  _nonce = inject(CSP_NONCE, {
    optional: true
  });
  /** The internal matchMedia method to return back a MediaQueryList like object. */
  _matchMedia;
  constructor() {
    this._matchMedia = this._platform.isBrowser && window.matchMedia ? (
      // matchMedia is bound to the window scope intentionally as it is an illegal invocation to
      // call it from a different scope.
      window.matchMedia.bind(window)
    ) : noopMatchMedia;
  }
  /**
   * Evaluates the given media query and returns the native MediaQueryList from which results
   * can be retrieved.
   * Confirms the layout engine will trigger for the selector query provided and returns the
   * MediaQueryList for the query provided.
   */
  matchMedia(query) {
    if (this._platform.WEBKIT || this._platform.BLINK) {
      createEmptyStyleRule(query, this._nonce);
    }
    return this._matchMedia(query);
  }
  static \u0275fac = function MediaMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MediaMatcher)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _MediaMatcher,
    factory: _MediaMatcher.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MediaMatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function createEmptyStyleRule(query, nonce) {
  if (mediaQueriesForWebkitCompatibility.has(query)) {
    return;
  }
  try {
    if (!mediaQueryStyleNode) {
      mediaQueryStyleNode = document.createElement("style");
      if (nonce) {
        mediaQueryStyleNode.setAttribute("nonce", nonce);
      }
      mediaQueryStyleNode.setAttribute("type", "text/css");
      document.head.appendChild(mediaQueryStyleNode);
    }
    if (mediaQueryStyleNode.sheet) {
      mediaQueryStyleNode.sheet.insertRule(`@media ${query} {body{ }}`, 0);
      mediaQueriesForWebkitCompatibility.add(query);
    }
  } catch (e) {
    console.error(e);
  }
}
function noopMatchMedia(query) {
  return {
    matches: query === "all" || query === "",
    media: query,
    addListener: () => {
    },
    removeListener: () => {
    }
  };
}
var BreakpointObserver = class _BreakpointObserver {
  _mediaMatcher = inject(MediaMatcher);
  _zone = inject(NgZone);
  /**  A map of all media queries currently being listened for. */
  _queries = /* @__PURE__ */ new Map();
  /** A subject for all other observables to takeUntil based on. */
  _destroySubject = new Subject();
  constructor() {
  }
  /** Completes the active subject, signalling to all other observables to complete. */
  ngOnDestroy() {
    this._destroySubject.next();
    this._destroySubject.complete();
  }
  /**
   * Whether one or more media queries match the current viewport size.
   * @param value One or more media queries to check.
   * @returns Whether any of the media queries match.
   */
  isMatched(value) {
    const queries = splitQueries(coerceArray(value));
    return queries.some((mediaQuery) => this._registerQuery(mediaQuery).mql.matches);
  }
  /**
   * Gets an observable of results for the given queries that will emit new results for any changes
   * in matching of the given queries.
   * @param value One or more media queries to check.
   * @returns A stream of matches for the given queries.
   */
  observe(value) {
    const queries = splitQueries(coerceArray(value));
    const observables = queries.map((query) => this._registerQuery(query).observable);
    let stateObservable = combineLatest(observables);
    stateObservable = concat(stateObservable.pipe(take(1)), stateObservable.pipe(skip(1), debounceTime(0)));
    return stateObservable.pipe(map((breakpointStates) => {
      const response = {
        matches: false,
        breakpoints: {}
      };
      breakpointStates.forEach(({
        matches,
        query
      }) => {
        response.matches = response.matches || matches;
        response.breakpoints[query] = matches;
      });
      return response;
    }));
  }
  /** Registers a specific query to be listened for. */
  _registerQuery(query) {
    if (this._queries.has(query)) {
      return this._queries.get(query);
    }
    const mql = this._mediaMatcher.matchMedia(query);
    const queryObservable = new Observable((observer) => {
      const handler = (e) => this._zone.run(() => observer.next(e));
      mql.addListener(handler);
      return () => {
        mql.removeListener(handler);
      };
    }).pipe(startWith(mql), map(({
      matches
    }) => ({
      query,
      matches
    })), takeUntil(this._destroySubject));
    const output = {
      observable: queryObservable,
      mql
    };
    this._queries.set(query, output);
    return output;
  }
  static \u0275fac = function BreakpointObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _BreakpointObserver)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _BreakpointObserver,
    factory: _BreakpointObserver.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(BreakpointObserver, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();
function splitQueries(queries) {
  return queries.map((query) => query.split(",")).reduce((a1, a2) => a1.concat(a2)).map((query) => query.trim());
}

// node_modules/.pnpm/@angular+cdk@20.2.1_@angular+common@20.1.4_@angular+core@20.1.4_@angular+compiler@20.1._b1186cf6030b5c2736340dec250d600a/node_modules/@angular/cdk/fesm2022/layout.mjs
var LayoutModule = class _LayoutModule {
  static \u0275fac = function LayoutModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _LayoutModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _LayoutModule
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({});
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LayoutModule, [{
    type: NgModule,
    args: [{}]
  }], null, null);
})();

// src/app/shared/services/responsive.service.ts
var PHANTASIA_BREAKPOINTS = {
  // Mobile breakpoints
  XS: "(max-width: 319px)",
  // Extra small mobile
  SM: "(min-width: 320px) and (max-width: 767px)",
  // Mobile
  // Tablet breakpoints  
  MD: "(min-width: 768px) and (max-width: 1023px)",
  // Tablet
  // Desktop breakpoints
  LG: "(min-width: 1024px) and (max-width: 1439px)",
  // Desktop
  XL: "(min-width: 1440px) and (max-width: 2559px)",
  // Large Desktop
  XXL: "(min-width: 2560px)",
  // Ultra-wide
  // Specific device orientations
  MOBILE_PORTRAIT: "(max-width: 767px) and (orientation: portrait)",
  MOBILE_LANDSCAPE: "(max-width: 1023px) and (orientation: landscape)",
  TABLET_PORTRAIT: "(min-width: 768px) and (max-width: 1023px) and (orientation: portrait)",
  TABLET_LANDSCAPE: "(min-width: 768px) and (max-width: 1279px) and (orientation: landscape)",
  // Touch and hover capabilities
  TOUCH_DEVICE: "(hover: none) and (pointer: coarse)",
  HOVER_DEVICE: "(hover: hover) and (pointer: fine)",
  // High DPI displays
  RETINA: "(-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi)",
  // Height-based breakpoints for viewport considerations
  SHORT_HEIGHT: "(max-height: 600px)",
  TALL_HEIGHT: "(min-height: 900px)"
};
var DeviceType;
(function(DeviceType2) {
  DeviceType2["MOBILE"] = "mobile";
  DeviceType2["TABLET"] = "tablet";
  DeviceType2["DESKTOP"] = "desktop";
  DeviceType2["LARGE_DESKTOP"] = "large-desktop";
  DeviceType2["ULTRA_WIDE"] = "ultra-wide";
})(DeviceType || (DeviceType = {}));
var _ResponsiveService = class _ResponsiveService {
  constructor(breakpointObserver) {
    this.breakpointObserver = breakpointObserver;
    this.isXS$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.XS);
    this.isSM$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.SM);
    this.isMD$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.MD);
    this.isLG$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.LG);
    this.isXL$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.XL);
    this.isXXL$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.XXL);
    this.isMobilePortrait$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.MOBILE_PORTRAIT);
    this.isMobileLandscape$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.MOBILE_LANDSCAPE);
    this.isTabletPortrait$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.TABLET_PORTRAIT);
    this.isTabletLandscape$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.TABLET_LANDSCAPE);
    this.isTouchDevice$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.TOUCH_DEVICE);
    this.isHoverCapable$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.HOVER_DEVICE);
    this.isRetina$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.RETINA);
    this.isShortHeight$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.SHORT_HEIGHT);
    this.isTallHeight$ = this.breakpointObserver.observe(PHANTASIA_BREAKPOINTS.TALL_HEIGHT);
    this.screenInfo$ = combineLatest([
      this.isXS$,
      this.isSM$,
      this.isMD$,
      this.isLG$,
      this.isXL$,
      this.isXXL$,
      this.isMobilePortrait$,
      this.isMobileLandscape$,
      this.isTabletPortrait$,
      this.isTabletLandscape$,
      this.isTouchDevice$,
      this.isHoverCapable$,
      this.isRetina$,
      this.isShortHeight$,
      this.isTallHeight$
    ]).pipe(map(([xs, sm, md, lg, xl, xxl, mobilePortrait, mobileLandscape, tabletPortrait, tabletLandscape, touchDevice, hoverCapable, retina, shortHeight, tallHeight]) => {
      let deviceType;
      let breakpointName;
      if (xs.matches) {
        deviceType = DeviceType.MOBILE;
        breakpointName = "XS";
      } else if (sm.matches) {
        deviceType = DeviceType.MOBILE;
        breakpointName = "SM";
      } else if (md.matches) {
        deviceType = DeviceType.TABLET;
        breakpointName = "MD";
      } else if (lg.matches) {
        deviceType = DeviceType.DESKTOP;
        breakpointName = "LG";
      } else if (xl.matches) {
        deviceType = DeviceType.LARGE_DESKTOP;
        breakpointName = "XL";
      } else {
        deviceType = DeviceType.ULTRA_WIDE;
        breakpointName = "XXL";
      }
      const isMobile = xs.matches || sm.matches;
      const isTablet = md.matches;
      const isDesktop = lg.matches;
      const isLargeDesktop = xl.matches;
      const isUltraWide = xxl.matches;
      const isPortrait = mobilePortrait.matches || tabletPortrait.matches || !mobileLandscape.matches && !tabletLandscape.matches && window.innerHeight > window.innerWidth;
      const isLandscape = !isPortrait;
      const screenInfo = {
        deviceType,
        isMobile,
        isTablet,
        isDesktop,
        isLargeDesktop,
        isUltraWide,
        isPortrait,
        isLandscape,
        isTouchDevice: touchDevice.matches,
        isHoverCapable: hoverCapable.matches,
        isRetina: retina.matches,
        isShortHeight: shortHeight.matches,
        isTallHeight: tallHeight.matches,
        breakpointName
      };
      return screenInfo;
    }), shareReplay(1));
    this._screenInfo = signal({
      deviceType: DeviceType.DESKTOP,
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      isLargeDesktop: false,
      isUltraWide: false,
      isPortrait: false,
      isLandscape: true,
      isTouchDevice: false,
      isHoverCapable: true,
      isRetina: false,
      isShortHeight: false,
      isTallHeight: false,
      breakpointName: "LG"
    }, ...ngDevMode ? [{ debugName: "_screenInfo" }] : []);
    this.screenInfo = this._screenInfo.asReadonly();
    this.isMobile = computed(() => this._screenInfo().isMobile, ...ngDevMode ? [{ debugName: "isMobile" }] : []);
    this.isTablet = computed(() => this._screenInfo().isTablet, ...ngDevMode ? [{ debugName: "isTablet" }] : []);
    this.isDesktop = computed(() => this._screenInfo().isDesktop, ...ngDevMode ? [{ debugName: "isDesktop" }] : []);
    this.isLargeDesktop = computed(() => this._screenInfo().isLargeDesktop, ...ngDevMode ? [{ debugName: "isLargeDesktop" }] : []);
    this.isUltraWide = computed(() => this._screenInfo().isUltraWide, ...ngDevMode ? [{ debugName: "isUltraWide" }] : []);
    this.isPortrait = computed(() => this._screenInfo().isPortrait, ...ngDevMode ? [{ debugName: "isPortrait" }] : []);
    this.isLandscape = computed(() => this._screenInfo().isLandscape, ...ngDevMode ? [{ debugName: "isLandscape" }] : []);
    this.isTouchDevice = computed(() => this._screenInfo().isTouchDevice, ...ngDevMode ? [{ debugName: "isTouchDevice" }] : []);
    this.isHoverCapable = computed(() => this._screenInfo().isHoverCapable, ...ngDevMode ? [{ debugName: "isHoverCapable" }] : []);
    this.isRetina = computed(() => this._screenInfo().isRetina, ...ngDevMode ? [{ debugName: "isRetina" }] : []);
    this.deviceType = computed(() => this._screenInfo().deviceType, ...ngDevMode ? [{ debugName: "deviceType" }] : []);
    this.breakpointName = computed(() => this._screenInfo().breakpointName, ...ngDevMode ? [{ debugName: "breakpointName" }] : []);
    this.screenInfo$.subscribe((info) => {
      this._screenInfo.set(info);
    });
  }
  /**
   * Get current screen information synchronously
   * 【✓】
   */
  getScreenInfo() {
    return this._screenInfo();
  }
  /**
   * Check if device matches specific breakpoint
   * 【✓】
   */
  matches(breakpoint) {
    return this.breakpointObserver.observe(breakpoint).pipe(map((result) => result.matches));
  }
  /**
   * Check if device matches any of the provided breakpoints
   * 【✓】
   */
  matchesAny(breakpoints) {
    return this.breakpointObserver.observe(breakpoints).pipe(map((result) => result.matches));
  }
  /**
   * Get optimal number of columns for grid layouts based on screen size
   * 【✓】
   */
  getGridColumns() {
    const info = this.getScreenInfo();
    if (info.isMobile)
      return 1;
    if (info.isTablet)
      return 2;
    if (info.isDesktop)
      return 3;
    if (info.isLargeDesktop)
      return 4;
    return 5;
  }
  /**
   * Get optimal content max-width based on screen size
   * 【✓】
   */
  getContentMaxWidth() {
    const info = this.getScreenInfo();
    if (info.isMobile)
      return "100%";
    if (info.isTablet)
      return "768px";
    if (info.isDesktop)
      return "1024px";
    if (info.isLargeDesktop)
      return "1200px";
    return "1400px";
  }
  /**
   * Get optimal spacing scale based on screen size
   * 【✓】
   */
  getSpacingScale() {
    const info = this.getScreenInfo();
    if (info.isMobile)
      return 0.75;
    if (info.isTablet)
      return 0.9;
    if (info.isDesktop)
      return 1;
    if (info.isLargeDesktop)
      return 1.1;
    return 1.2;
  }
  /**
   * Get optimal typography scale based on screen size
   * 【✓】
   */
  getTypographyScale() {
    const info = this.getScreenInfo();
    if (info.isMobile)
      return 0.85;
    if (info.isTablet)
      return 0.95;
    if (info.isDesktop)
      return 1;
    if (info.isLargeDesktop)
      return 1.05;
    return 1.1;
  }
  /**
   * Check if reduced motion is preferred (accessibility)
   * 【✓】
   */
  prefersReducedMotion() {
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }
  /**
   * Check if dark mode is preferred
   * 【✓】
   */
  prefersDarkMode() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  }
  /**
   * Get safe area insets for devices with notches
   * 【✓】
   */
  getSafeAreaInsets() {
    const computedStyle = getComputedStyle(document.documentElement);
    return {
      top: computedStyle.getPropertyValue("env(safe-area-inset-top)") || "0px",
      right: computedStyle.getPropertyValue("env(safe-area-inset-right)") || "0px",
      bottom: computedStyle.getPropertyValue("env(safe-area-inset-bottom)") || "0px",
      left: computedStyle.getPropertyValue("env(safe-area-inset-left)") || "0px"
    };
  }
};
_ResponsiveService.\u0275fac = function ResponsiveService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ResponsiveService)(\u0275\u0275inject(BreakpointObserver));
};
_ResponsiveService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ResponsiveService, factory: _ResponsiveService.\u0275fac, providedIn: "root" });
var ResponsiveService = _ResponsiveService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResponsiveService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: BreakpointObserver }], null);
})();

// src/app/shared/directives/responsive.directive.ts
var _ResponsiveDirective = class _ResponsiveDirective {
  constructor() {
    this.destroy$ = new Subject();
    this.responsiveService = inject(ResponsiveService);
    this.templateRef = inject(TemplateRef);
    this.viewContainer = inject(ViewContainerRef);
    this.hasView = false;
    this.targetDevices = [];
  }
  set responsive(value) {
    this.targetDevices = Array.isArray(value) ? value : [value];
    this.updateView();
  }
  ngOnInit() {
    this.responsiveService.screenInfo$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateView();
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updateView() {
    const screenInfo = this.responsiveService.getScreenInfo();
    const shouldShow = this.shouldShowForCurrentDevice(screenInfo);
    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
  shouldShowForCurrentDevice(screenInfo) {
    return this.targetDevices.some((target) => {
      switch (target) {
        case "mobile":
          return screenInfo.isMobile;
        case "tablet":
          return screenInfo.isTablet;
        case "desktop":
          return screenInfo.isDesktop;
        case "large-desktop":
          return screenInfo.isLargeDesktop;
        case "ultra-wide":
          return screenInfo.isUltraWide;
        case "touch":
          return screenInfo.isTouchDevice;
        case "hover":
          return screenInfo.isHoverCapable;
        case "portrait":
          return screenInfo.isPortrait;
        case "landscape":
          return screenInfo.isLandscape;
        case "retina":
          return screenInfo.isRetina;
        case DeviceType.MOBILE:
          return screenInfo.isMobile;
        case DeviceType.TABLET:
          return screenInfo.isTablet;
        case DeviceType.DESKTOP:
          return screenInfo.isDesktop;
        case DeviceType.LARGE_DESKTOP:
          return screenInfo.isLargeDesktop;
        case DeviceType.ULTRA_WIDE:
          return screenInfo.isUltraWide;
        default:
          return false;
      }
    });
  }
};
_ResponsiveDirective.\u0275fac = function ResponsiveDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ResponsiveDirective)();
};
_ResponsiveDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _ResponsiveDirective, selectors: [["", "appResponsive", ""]], inputs: { responsive: [0, "appResponsive", "responsive"] } });
var ResponsiveDirective = _ResponsiveDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResponsiveDirective, [{
    type: Directive,
    args: [{
      selector: "[appResponsive]",
      standalone: true
    }]
  }], null, { responsive: [{
    type: Input,
    args: ["appResponsive"]
  }] });
})();
var _ResponsiveFromDirective = class _ResponsiveFromDirective {
  constructor() {
    this.destroy$ = new Subject();
    this.responsiveService = inject(ResponsiveService);
    this.templateRef = inject(TemplateRef);
    this.viewContainer = inject(ViewContainerRef);
    this.hasView = false;
    this.fromDevice = "mobile";
  }
  set responsiveFrom(value) {
    this.fromDevice = value;
    this.updateView();
  }
  ngOnInit() {
    this.responsiveService.screenInfo$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateView();
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updateView() {
    const screenInfo = this.responsiveService.getScreenInfo();
    const shouldShow = this.shouldShowFromDevice(screenInfo);
    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
  shouldShowFromDevice(screenInfo) {
    const deviceOrder = ["mobile", "tablet", "desktop", "large-desktop", "ultra-wide"];
    const currentDeviceIndex = this.getDeviceIndex(screenInfo.deviceType);
    const fromDeviceIndex = this.getDeviceIndex(this.fromDevice);
    return currentDeviceIndex >= fromDeviceIndex;
  }
  getDeviceIndex(device) {
    const deviceMap = {
      "mobile": 0,
      "tablet": 1,
      "desktop": 2,
      "large-desktop": 3,
      "ultra-wide": 4
    };
    if (typeof device === "string") {
      return deviceMap[device] ?? 0;
    } else {
      const enumToString = {
        [DeviceType.MOBILE]: "mobile",
        [DeviceType.TABLET]: "tablet",
        [DeviceType.DESKTOP]: "desktop",
        [DeviceType.LARGE_DESKTOP]: "large-desktop",
        [DeviceType.ULTRA_WIDE]: "ultra-wide"
      };
      return deviceMap[enumToString[device]] ?? 0;
    }
  }
};
_ResponsiveFromDirective.\u0275fac = function ResponsiveFromDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ResponsiveFromDirective)();
};
_ResponsiveFromDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _ResponsiveFromDirective, selectors: [["", "appResponsiveFrom", ""]], inputs: { responsiveFrom: [0, "appResponsiveFrom", "responsiveFrom"] } });
var ResponsiveFromDirective = _ResponsiveFromDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResponsiveFromDirective, [{
    type: Directive,
    args: [{
      selector: "[appResponsiveFrom]",
      standalone: true
    }]
  }], null, { responsiveFrom: [{
    type: Input,
    args: ["appResponsiveFrom"]
  }] });
})();
var _ResponsiveToDirective = class _ResponsiveToDirective {
  constructor() {
    this.destroy$ = new Subject();
    this.responsiveService = inject(ResponsiveService);
    this.templateRef = inject(TemplateRef);
    this.viewContainer = inject(ViewContainerRef);
    this.hasView = false;
    this.toDevice = "ultra-wide";
  }
  set responsiveTo(value) {
    this.toDevice = value;
    this.updateView();
  }
  ngOnInit() {
    this.responsiveService.screenInfo$.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.updateView();
    });
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  updateView() {
    const screenInfo = this.responsiveService.getScreenInfo();
    const shouldShow = this.shouldShowToDevice(screenInfo);
    if (shouldShow && !this.hasView) {
      this.viewContainer.createEmbeddedView(this.templateRef);
      this.hasView = true;
    } else if (!shouldShow && this.hasView) {
      this.viewContainer.clear();
      this.hasView = false;
    }
  }
  shouldShowToDevice(screenInfo) {
    const deviceOrder = ["mobile", "tablet", "desktop", "large-desktop", "ultra-wide"];
    const currentDeviceIndex = this.getDeviceIndex(screenInfo.deviceType);
    const toDeviceIndex = this.getDeviceIndex(this.toDevice);
    return currentDeviceIndex <= toDeviceIndex;
  }
  getDeviceIndex(device) {
    const deviceMap = {
      "mobile": 0,
      "tablet": 1,
      "desktop": 2,
      "large-desktop": 3,
      "ultra-wide": 4
    };
    if (typeof device === "string") {
      return deviceMap[device] ?? 4;
    } else {
      const enumToString = {
        [DeviceType.MOBILE]: "mobile",
        [DeviceType.TABLET]: "tablet",
        [DeviceType.DESKTOP]: "desktop",
        [DeviceType.LARGE_DESKTOP]: "large-desktop",
        [DeviceType.ULTRA_WIDE]: "ultra-wide"
      };
      return deviceMap[enumToString[device]] ?? 4;
    }
  }
};
_ResponsiveToDirective.\u0275fac = function ResponsiveToDirective_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ResponsiveToDirective)();
};
_ResponsiveToDirective.\u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({ type: _ResponsiveToDirective, selectors: [["", "appResponsiveTo", ""]], inputs: { responsiveTo: [0, "appResponsiveTo", "responsiveTo"] } });
var ResponsiveToDirective = _ResponsiveToDirective;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ResponsiveToDirective, [{
    type: Directive,
    args: [{
      selector: "[appResponsiveTo]",
      standalone: true
    }]
  }], null, { responsiveTo: [{
    type: Input,
    args: ["appResponsiveTo"]
  }] });
})();

// src/app/shared/components/site-header/site-header.component.ts
var _c0 = () => ["/"];
var _c1 = () => ["/collections"];
var _c2 = () => ["/news"];
var _c3 = () => ["/socials"];
function SiteHeaderComponent_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 9);
    \u0275\u0275listener("click", function SiteHeaderComponent_button_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.toggleMobileMenu());
    });
    \u0275\u0275element(1, "span", 10)(2, "span", 10)(3, "span", 10);
    \u0275\u0275elementEnd();
  }
}
function SiteHeaderComponent_nav_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "nav", 11)(1, "div", 12)(2, "ul")(3, "li", 13)(4, "span", 14);
    \u0275\u0275text(5, "Home");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 15);
    \u0275\u0275text(7, "Landing Page");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(8, "div", 16)(9, "ul")(10, "li", 17)(11, "span", 14);
    \u0275\u0275text(12, "Gallery");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "span", 15);
    \u0275\u0275text(14, "Library");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(15, "div", 18)(16, "ul")(17, "li", 17)(18, "span", 14);
    \u0275\u0275text(19, "News");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 15);
    \u0275\u0275text(21, "Updates");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(22, "div", 19)(23, "ul")(24, "li", 17)(25, "span", 14);
    \u0275\u0275text(26, "Circles");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "span", 15);
    \u0275\u0275text(28, "Socials");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(12, _c0));
    \u0275\u0275advance(7);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/collections"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(13, _c1));
    \u0275\u0275advance(7);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/news"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(14, _c2));
    \u0275\u0275advance(7);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/socials"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(15, _c3));
  }
}
function SiteHeaderComponent_nav_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "nav", 20)(1, "div", 21)(2, "ul")(3, "li", 17)(4, "span", 14);
    \u0275\u0275text(5, "Home");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "li", 17)(7, "span", 14);
    \u0275\u0275text(8, "Gallery");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "li", 17)(10, "span", 14);
    \u0275\u0275text(11, "News");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "li", 17)(13, "span", 14);
    \u0275\u0275text(14, "Socials");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(12, _c0));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/collections"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(13, _c1));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/news"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(14, _c2));
    \u0275\u0275advance(3);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/socials"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(15, _c3));
  }
}
function SiteHeaderComponent_div_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22);
    \u0275\u0275listener("click", function SiteHeaderComponent_div_8_Template_div_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMobileMenu());
    });
    \u0275\u0275elementStart(1, "nav", 23)(2, "ul")(3, "li", 24);
    \u0275\u0275listener("click", function SiteHeaderComponent_div_8_Template_li_click_3_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMobileMenu());
    });
    \u0275\u0275elementStart(4, "span", 25);
    \u0275\u0275text(5, "\u{1F3E0}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 26);
    \u0275\u0275text(7, "Home");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "li", 24);
    \u0275\u0275listener("click", function SiteHeaderComponent_div_8_Template_li_click_8_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMobileMenu());
    });
    \u0275\u0275elementStart(9, "span", 25);
    \u0275\u0275text(10, "\u{1F3A8}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 26);
    \u0275\u0275text(12, "Gallery");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "li", 24);
    \u0275\u0275listener("click", function SiteHeaderComponent_div_8_Template_li_click_13_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMobileMenu());
    });
    \u0275\u0275elementStart(14, "span", 25);
    \u0275\u0275text(15, "\u{1F4F0}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "span", 26);
    \u0275\u0275text(17, "News");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(18, "li", 24);
    \u0275\u0275listener("click", function SiteHeaderComponent_div_8_Template_li_click_18_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.closeMobileMenu());
    });
    \u0275\u0275elementStart(19, "span", 25);
    \u0275\u0275text(20, "\u{1F310}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "span", 26);
    \u0275\u0275text(22, "Socials");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275classProp("open", ctx_r1.mobileMenuOpen());
    \u0275\u0275advance(3);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(14, _c0));
    \u0275\u0275advance(5);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/collections"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(15, _c1));
    \u0275\u0275advance(5);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/news"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(16, _c2));
    \u0275\u0275advance(5);
    \u0275\u0275classProp("active", ctx_r1.isActiveRoute("/socials"));
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(17, _c3));
  }
}
var _SiteHeaderComponent = class _SiteHeaderComponent {
  constructor(router, responsiveService) {
    this.router = router;
    this.responsiveService = responsiveService;
    this.mobileMenuOpen = signal(false, ...ngDevMode ? [{ debugName: "mobileMenuOpen" }] : []);
    this.isMobile = this.responsiveService.isMobile;
    this.isTablet = this.responsiveService.isTablet;
    this.isDesktop = this.responsiveService.isDesktop;
    this.isTouchDevice = this.responsiveService.isTouchDevice;
  }
  ngOnInit() {
  }
  /**
   * Check if the given route is active
   * 【✓】
   */
  isActiveRoute(route) {
    return this.router.url.includes(route);
  }
  /**
   * Toggle mobile menu visibility
   * 【✓】
   */
  toggleMobileMenu() {
    this.mobileMenuOpen.update((open) => !open);
    if (this.mobileMenuOpen()) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
  }
  /**
   * Close mobile menu
   * 【✓】
   */
  closeMobileMenu() {
    this.mobileMenuOpen.set(false);
    document.body.style.overflow = "";
  }
};
_SiteHeaderComponent.\u0275fac = function SiteHeaderComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SiteHeaderComponent)(\u0275\u0275directiveInject(Router), \u0275\u0275directiveInject(ResponsiveService));
};
_SiteHeaderComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SiteHeaderComponent, selectors: [["app-site-header"]], decls: 9, vars: 6, consts: [[1, "site-header"], [1, "header-container"], [1, "logo-container"], [1, "logo-link", 3, "routerLink"], ["src", "/assets/images/logos/prismcoll_logox.svg", "alt", "Prismatic Collections", 1, "logo-image"], ["class", "mobile-menu-toggle", 3, "click", 4, "appResponsiveTo"], ["class", "site-nav", 4, "appResponsiveFrom"], ["class", "site-nav tablet-nav", 4, "appResponsive"], ["class", "mobile-menu-overlay", 3, "open", "click", 4, "appResponsiveTo"], [1, "mobile-menu-toggle", 3, "click"], [1, "hamburger-line"], [1, "site-nav"], [1, "nav-section", "home-tabs"], [1, "home-tab", 3, "routerLink"], [1, "page-name"], [1, "page-description"], [1, "nav-section", "collection-tabs"], [3, "routerLink"], [1, "nav-section", "news-tabs"], [1, "nav-section", "experience-tabs"], [1, "site-nav", "tablet-nav"], [1, "nav-section"], [1, "mobile-menu-overlay", 3, "click"], [1, "mobile-nav"], [3, "click", "routerLink"], [1, "nav-icon"], [1, "nav-text"]], template: function SiteHeaderComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "header", 0)(1, "div", 1)(2, "div", 2)(3, "a", 3);
    \u0275\u0275element(4, "img", 4);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(5, SiteHeaderComponent_button_5_Template, 4, 0, "button", 5)(6, SiteHeaderComponent_nav_6_Template, 29, 16, "nav", 6)(7, SiteHeaderComponent_nav_7_Template, 15, 16, "nav", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, SiteHeaderComponent_div_8_Template, 23, 18, "div", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(3);
    \u0275\u0275property("routerLink", \u0275\u0275pureFunction0(5, _c0));
    \u0275\u0275advance(2);
    \u0275\u0275property("appResponsiveTo", "tablet");
    \u0275\u0275advance();
    \u0275\u0275property("appResponsiveFrom", "desktop");
    \u0275\u0275advance();
    \u0275\u0275property("appResponsive", "tablet");
    \u0275\u0275advance();
    \u0275\u0275property("appResponsiveTo", "tablet");
  }
}, dependencies: [CommonModule, RouterModule, RouterLink, ResponsiveDirective, ResponsiveFromDirective, ResponsiveToDirective], styles: ['@charset "UTF-8";\n\n\n\nbody.collections-page[_ngcontent-%COMP%]   .site-header[_ngcontent-%COMP%], \n.phantasia-collection-page[_ngcontent-%COMP%]   .site-header[_ngcontent-%COMP%], \n.collections-header[_ngcontent-%COMP%] {\n  background-color: rgba(17, 17, 17, 0.95);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border-bottom: 1px solid rgba(0, 229, 255, 0.3);\n  box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);\n}\nbody.collections-page[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   li.active[_ngcontent-%COMP%], \n.phantasia-collection-page[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   li.active[_ngcontent-%COMP%], \n.collections-active-item[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.1);\n  color: #e0f7ff;\n  font-weight: 600;\n}\nbody.collections-page[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   li.active[_ngcontent-%COMP%]::after, \n.phantasia-collection-page[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   li.active[_ngcontent-%COMP%]::after, \n.collections-active-item[_ngcontent-%COMP%]::after {\n  background-color: #00e5ff;\n  box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);\n}\nbody.collections-page[_ngcontent-%COMP%]   .collection-tabs[_ngcontent-%COMP%]   li[_ngcontent-%COMP%], \n.phantasia-collection-page[_ngcontent-%COMP%]   .collection-tabs[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  color: #e0f7ff;\n  border: 1px solid transparent;\n  transition: all 0.3s ease;\n}\nbody.collections-page[_ngcontent-%COMP%]   .collection-tabs[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover, \n.phantasia-collection-page[_ngcontent-%COMP%]   .collection-tabs[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  color: #00e5ff;\n  background-color: rgba(255, 255, 255, 0.1);\n}\nbody.collections-page[_ngcontent-%COMP%]   .collection-tabs[_ngcontent-%COMP%]   li.active[_ngcontent-%COMP%], \n.phantasia-collection-page[_ngcontent-%COMP%]   .collection-tabs[_ngcontent-%COMP%]   li.active[_ngcontent-%COMP%] {\n  border: 1px solid rgba(0, 229, 255, 0.3);\n  box-shadow: 0 0 8px rgba(0, 229, 255, 0.2);\n}\n.nav-link.active.collections-nav-link[_ngcontent-%COMP%], \na.nav-link.active[routerLink="/collections"][_ngcontent-%COMP%], \n.phantasia-collection-container[_ngcontent-%COMP%]   .nav-links[_ngcontent-%COMP%]   .nav-link.active[_ngcontent-%COMP%], \nbody[_ngcontent-%COMP%]:not(.home-page)   .collection-navbar[_ngcontent-%COMP%]   .nav-content[_ngcontent-%COMP%]   .nav-links[_ngcontent-%COMP%]   .nav-link.active[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.1);\n  color: #e0f7ff;\n  font-weight: 600;\n  border: 1px solid rgba(0, 229, 255, 0.3);\n  box-shadow: 0 0 8px rgba(0, 229, 255, 0.2);\n}\n.nav-link.active.collections-nav-link[_ngcontent-%COMP%]::after, \na.nav-link.active[routerLink="/collections"][_ngcontent-%COMP%]::after, \n.phantasia-collection-container[_ngcontent-%COMP%]   .nav-links[_ngcontent-%COMP%]   .nav-link.active[_ngcontent-%COMP%]::after, \nbody[_ngcontent-%COMP%]:not(.home-page)   .collection-navbar[_ngcontent-%COMP%]   .nav-content[_ngcontent-%COMP%]   .nav-links[_ngcontent-%COMP%]   .nav-link.active[_ngcontent-%COMP%]::after {\n  background-color: #00e5ff;\n  box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);\n}\n/*# sourceMappingURL=collection-header-global.css.map */', "\n\n.site-header[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 90px;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 1000;\n  background-color: rgba(17, 17, 17, 0.95);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border-bottom: 1px solid rgba(0, 229, 255, 0.3);\n}\n.site-header[_ngcontent-%COMP%]   .header-container[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n}\n.logo-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  height: 100%;\n  padding-left: 50px;\n}\n.logo-container[_ngcontent-%COMP%]   .logo-link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  justify-content: center;\n  text-decoration: none;\n  height: 100%;\n  cursor: pointer;\n}\n.logo-container[_ngcontent-%COMP%]   .logo-image[_ngcontent-%COMP%] {\n  height: 55px;\n  width: auto;\n  object-fit: contain;\n  max-width: 280px;\n  display: block;\n}\n.site-nav[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  height: 100%;\n  gap: 50px;\n  margin-left: auto;\n  padding-right: 50px;\n}\n.site-nav[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%] {\n  height: 100%;\n}\n.site-nav[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n.site-nav[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  height: 100%;\n  padding: 0 20px;\n  display: flex;\n  align-items: center;\n  cursor: pointer;\n  position: relative;\n  transition: all 0.3s ease;\n  color: #e0f7ff;\n  flex-direction: column;\n  justify-content: center;\n}\n.site-nav[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n.site-nav[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   li.active[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.2);\n  font-weight: 500;\n}\n.site-nav[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .page-name[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 500;\n}\n.site-nav[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .page-description[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n  opacity: 0.8;\n}\n.mobile-menu-toggle[_ngcontent-%COMP%] {\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 8px;\n  margin-right: 20px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 4px;\n  z-index: 1001;\n}\n.mobile-menu-toggle[_ngcontent-%COMP%]   .hamburger-line[_ngcontent-%COMP%] {\n  width: 24px;\n  height: 3px;\n  background-color: #e0f7ff;\n  transition: all 0.3s ease;\n  border-radius: 2px;\n}\n.mobile-menu-toggle.active[_ngcontent-%COMP%]   .hamburger-line[_ngcontent-%COMP%]:nth-child(1) {\n  transform: rotate(45deg) translate(5px, 5px);\n}\n.mobile-menu-toggle.active[_ngcontent-%COMP%]   .hamburger-line[_ngcontent-%COMP%]:nth-child(2) {\n  opacity: 0;\n}\n.mobile-menu-toggle.active[_ngcontent-%COMP%]   .hamburger-line[_ngcontent-%COMP%]:nth-child(3) {\n  transform: rotate(-45deg) translate(7px, -6px);\n}\n.mobile-menu-overlay[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background-color: rgba(0, 0, 0, 0.95);\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  z-index: 1000;\n  opacity: 0;\n  visibility: hidden;\n  transition: all 0.3s ease;\n}\n.mobile-menu-overlay.open[_ngcontent-%COMP%] {\n  opacity: 1;\n  visibility: visible;\n}\n.mobile-menu-overlay[_ngcontent-%COMP%]   .mobile-nav[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.mobile-menu-overlay[_ngcontent-%COMP%]   .mobile-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2rem;\n}\n.mobile-menu-overlay[_ngcontent-%COMP%]   .mobile-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1rem 2rem;\n  color: #e0f7ff;\n  cursor: pointer;\n  border-radius: 8px;\n  transition: all 0.3s ease;\n  min-height: 60px;\n}\n.mobile-menu-overlay[_ngcontent-%COMP%]   .mobile-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n.mobile-menu-overlay[_ngcontent-%COMP%]   .mobile-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li.active[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.2);\n  font-weight: 600;\n}\n.mobile-menu-overlay[_ngcontent-%COMP%]   .mobile-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .nav-icon[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n}\n.mobile-menu-overlay[_ngcontent-%COMP%]   .mobile-nav[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .nav-text[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  font-weight: 500;\n}\n.tablet-nav[_ngcontent-%COMP%] {\n  gap: 20px !important;\n  padding-right: 30px !important;\n}\n.tablet-nav[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  gap: 10px !important;\n}\n.tablet-nav[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  padding: 0 15px !important;\n}\n.tablet-nav[_ngcontent-%COMP%]   .nav-section[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   .page-name[_ngcontent-%COMP%] {\n  font-size: 0.9rem !important;\n}\n@media (max-width: 1023px) {\n  .logo-container[_ngcontent-%COMP%] {\n    padding-left: 20px;\n  }\n  .logo-container[_ngcontent-%COMP%]   .logo-image[_ngcontent-%COMP%] {\n    height: 45px;\n    max-width: 220px;\n  }\n}\n@media (max-width: 767px) {\n  .logo-container[_ngcontent-%COMP%] {\n    padding-left: 15px;\n  }\n  .logo-container[_ngcontent-%COMP%]   .logo-image[_ngcontent-%COMP%] {\n    height: 40px;\n    max-width: 180px;\n  }\n  .site-header[_ngcontent-%COMP%] {\n    height: 70px;\n  }\n}\n@supports (padding-top: env(safe-area-inset-top)) {\n  .site-header[_ngcontent-%COMP%] {\n    padding-top: env(safe-area-inset-top);\n    height: calc(90px + env(safe-area-inset-top));\n  }\n  @media (max-width: 767px) {\n    .site-header[_ngcontent-%COMP%] {\n      height: calc(70px + env(safe-area-inset-top));\n    }\n  }\n  .mobile-menu-overlay[_ngcontent-%COMP%] {\n    padding-top: env(safe-area-inset-top);\n  }\n}\n/*# sourceMappingURL=site-header.component.css.map */"], changeDetection: 0 });
var SiteHeaderComponent = _SiteHeaderComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SiteHeaderComponent, [{
    type: Component,
    args: [{ selector: "app-site-header", standalone: true, imports: [CommonModule, RouterModule, ResponsiveDirective, ResponsiveFromDirective, ResponsiveToDirective], template: `
    <header class="site-header">
      <div class="header-container">
        <!-- Site Logo/Title -->
        <div class="logo-container">
          <a class="logo-link" [routerLink]="['/']">
            <img src="/assets/images/logos/prismcoll_logox.svg" alt="Prismatic Collections" class="logo-image">
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button class="mobile-menu-toggle" (click)="toggleMobileMenu()" *appResponsiveTo="'tablet'">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>

        <!-- Desktop Navigation -->
        <nav class="site-nav" *appResponsiveFrom="'desktop'">
          <!-- Home Link -->
          <div class="nav-section home-tabs">
            <ul>
              <li class="home-tab" [class.active]="isActiveRoute('/')" [routerLink]="['/']">
                <span class="page-name">Home</span>
                <span class="page-description">Landing Page</span>
              </li>
            </ul>
          </div>

          <!-- Collection Tab -->
          <div class="nav-section collection-tabs">
            <ul>
              <li [class.active]="isActiveRoute('/collections')" [routerLink]="['/collections']">
                <span class="page-name">Gallery</span>
                <span class="page-description">Library</span>
              </li>
            </ul>
          </div>

          <!-- News Tab -->
          <div class="nav-section news-tabs">
            <ul>
              <li [class.active]="isActiveRoute('/news')" [routerLink]="['/news']">
                <span class="page-name">News</span>
                <span class="page-description">Updates</span>
              </li>
            </ul>
          </div>

          <!-- Social Links Tab -->
          <div class="nav-section experience-tabs">
            <ul>
              <li [class.active]="isActiveRoute('/socials')" [routerLink]="['/socials']">
                <span class="page-name">Circles</span>
                <span class="page-description">Socials</span>
              </li>
            </ul>
          </div>
        </nav>

        <!-- Tablet Navigation (Compact) -->
        <nav class="site-nav tablet-nav" *appResponsive="'tablet'">
          <div class="nav-section">
            <ul>
              <li [class.active]="isActiveRoute('/')" [routerLink]="['/']">
                <span class="page-name">Home</span>
              </li>
              <li [class.active]="isActiveRoute('/collections')" [routerLink]="['/collections']">
                <span class="page-name">Gallery</span>
              </li>
              <li [class.active]="isActiveRoute('/news')" [routerLink]="['/news']">
                <span class="page-name">News</span>
              </li>
              <li [class.active]="isActiveRoute('/socials')" [routerLink]="['/socials']">
                <span class="page-name">Socials</span>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <!-- Mobile Overlay Menu -->
      <div class="mobile-menu-overlay" 
           [class.open]="mobileMenuOpen()" 
           (click)="closeMobileMenu()"
           *appResponsiveTo="'tablet'">
        <nav class="mobile-nav">
          <ul>
            <li [routerLink]="['/']" (click)="closeMobileMenu()" [class.active]="isActiveRoute('/')">
              <span class="nav-icon">\u{1F3E0}</span>
              <span class="nav-text">Home</span>
            </li>
            <li [routerLink]="['/collections']" (click)="closeMobileMenu()" [class.active]="isActiveRoute('/collections')">
              <span class="nav-icon">\u{1F3A8}</span>
              <span class="nav-text">Gallery</span>
            </li>
            <li [routerLink]="['/news']" (click)="closeMobileMenu()" [class.active]="isActiveRoute('/news')">
              <span class="nav-icon">\u{1F4F0}</span>
              <span class="nav-text">News</span>
            </li>
            <li [routerLink]="['/socials']" (click)="closeMobileMenu()" [class.active]="isActiveRoute('/socials')">
              <span class="nav-icon">\u{1F310}</span>
              <span class="nav-text">Socials</span>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  `, changeDetection: ChangeDetectionStrategy.OnPush, styles: ['@charset "UTF-8";\n\n/* src/app/pages/collections-page/collection-header-global.scss */\nbody.collections-page .site-header,\n.phantasia-collection-page .site-header,\n.collections-header {\n  background-color: rgba(17, 17, 17, 0.95);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border-bottom: 1px solid rgba(0, 229, 255, 0.3);\n  box-shadow: 0 0 25px rgba(0, 0, 0, 0.25);\n}\nbody.collections-page .nav-section li.active,\n.phantasia-collection-page .nav-section li.active,\n.collections-active-item {\n  background: rgba(255, 255, 255, 0.1);\n  color: #e0f7ff;\n  font-weight: 600;\n}\nbody.collections-page .nav-section li.active::after,\n.phantasia-collection-page .nav-section li.active::after,\n.collections-active-item::after {\n  background-color: #00e5ff;\n  box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);\n}\nbody.collections-page .collection-tabs li,\n.phantasia-collection-page .collection-tabs li {\n  color: #e0f7ff;\n  border: 1px solid transparent;\n  transition: all 0.3s ease;\n}\nbody.collections-page .collection-tabs li:hover,\n.phantasia-collection-page .collection-tabs li:hover {\n  color: #00e5ff;\n  background-color: rgba(255, 255, 255, 0.1);\n}\nbody.collections-page .collection-tabs li.active,\n.phantasia-collection-page .collection-tabs li.active {\n  border: 1px solid rgba(0, 229, 255, 0.3);\n  box-shadow: 0 0 8px rgba(0, 229, 255, 0.2);\n}\n.nav-link.active.collections-nav-link,\na.nav-link.active[routerLink="/collections"],\n.phantasia-collection-container .nav-links .nav-link.active,\nbody:not(.home-page) .collection-navbar .nav-content .nav-links .nav-link.active {\n  background: rgba(255, 255, 255, 0.1);\n  color: #e0f7ff;\n  font-weight: 600;\n  border: 1px solid rgba(0, 229, 255, 0.3);\n  box-shadow: 0 0 8px rgba(0, 229, 255, 0.2);\n}\n.nav-link.active.collections-nav-link::after,\na.nav-link.active[routerLink="/collections"]::after,\n.phantasia-collection-container .nav-links .nav-link.active::after,\nbody:not(.home-page) .collection-navbar .nav-content .nav-links .nav-link.active::after {\n  background-color: #00e5ff;\n  box-shadow: 0 0 8px rgba(0, 229, 255, 0.4);\n}\n/*# sourceMappingURL=collection-header-global.css.map */\n', "/* angular:styles/component:scss;e3801efc61d1ed1103c4993707335f4cb4196ed0e88adea412c315a4b9575b2e;/home/delta/Projects/PrismaticCollections(SpiralFlip_Site)/src/app/shared/components/site-header/site-header.component.ts */\n.site-header {\n  width: 100%;\n  height: 90px;\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: 1000;\n  background-color: rgba(17, 17, 17, 0.95);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border-bottom: 1px solid rgba(0, 229, 255, 0.3);\n}\n.site-header .header-container {\n  width: 100%;\n  height: 100%;\n  margin: 0;\n  padding: 0;\n  display: flex;\n  align-items: center;\n  justify-content: flex-start;\n}\n.logo-container {\n  display: flex;\n  align-items: center;\n  height: 100%;\n  padding-left: 50px;\n}\n.logo-container .logo-link {\n  display: flex;\n  align-items: center;\n  flex-direction: column;\n  justify-content: center;\n  text-decoration: none;\n  height: 100%;\n  cursor: pointer;\n}\n.logo-container .logo-image {\n  height: 55px;\n  width: auto;\n  object-fit: contain;\n  max-width: 280px;\n  display: block;\n}\n.site-nav {\n  display: flex;\n  align-items: center;\n  height: 100%;\n  gap: 50px;\n  margin-left: auto;\n  padding-right: 50px;\n}\n.site-nav .nav-section {\n  height: 100%;\n}\n.site-nav .nav-section ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  gap: 5px;\n}\n.site-nav .nav-section li {\n  height: 100%;\n  padding: 0 20px;\n  display: flex;\n  align-items: center;\n  cursor: pointer;\n  position: relative;\n  transition: all 0.3s ease;\n  color: #e0f7ff;\n  flex-direction: column;\n  justify-content: center;\n}\n.site-nav .nav-section li:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n.site-nav .nav-section li.active {\n  background-color: rgba(255, 255, 255, 0.2);\n  font-weight: 500;\n}\n.site-nav .nav-section li .page-name {\n  font-size: 1rem;\n  font-weight: 500;\n}\n.site-nav .nav-section li .page-description {\n  font-size: 0.7rem;\n  opacity: 0.8;\n}\n.mobile-menu-toggle {\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 8px;\n  margin-right: 20px;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  align-items: center;\n  gap: 4px;\n  z-index: 1001;\n}\n.mobile-menu-toggle .hamburger-line {\n  width: 24px;\n  height: 3px;\n  background-color: #e0f7ff;\n  transition: all 0.3s ease;\n  border-radius: 2px;\n}\n.mobile-menu-toggle.active .hamburger-line:nth-child(1) {\n  transform: rotate(45deg) translate(5px, 5px);\n}\n.mobile-menu-toggle.active .hamburger-line:nth-child(2) {\n  opacity: 0;\n}\n.mobile-menu-toggle.active .hamburger-line:nth-child(3) {\n  transform: rotate(-45deg) translate(7px, -6px);\n}\n.mobile-menu-overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  background-color: rgba(0, 0, 0, 0.95);\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  z-index: 1000;\n  opacity: 0;\n  visibility: hidden;\n  transition: all 0.3s ease;\n}\n.mobile-menu-overlay.open {\n  opacity: 1;\n  visibility: visible;\n}\n.mobile-menu-overlay .mobile-nav {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.mobile-menu-overlay .mobile-nav ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n  display: flex;\n  flex-direction: column;\n  gap: 2rem;\n}\n.mobile-menu-overlay .mobile-nav ul li {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1rem 2rem;\n  color: #e0f7ff;\n  cursor: pointer;\n  border-radius: 8px;\n  transition: all 0.3s ease;\n  min-height: 60px;\n}\n.mobile-menu-overlay .mobile-nav ul li:hover {\n  background-color: rgba(255, 255, 255, 0.1);\n}\n.mobile-menu-overlay .mobile-nav ul li.active {\n  background-color: rgba(255, 255, 255, 0.2);\n  font-weight: 600;\n}\n.mobile-menu-overlay .mobile-nav ul li .nav-icon {\n  font-size: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  width: 32px;\n  height: 32px;\n}\n.mobile-menu-overlay .mobile-nav ul li .nav-text {\n  font-size: 1.2rem;\n  font-weight: 500;\n}\n.tablet-nav {\n  gap: 20px !important;\n  padding-right: 30px !important;\n}\n.tablet-nav .nav-section ul {\n  gap: 10px !important;\n}\n.tablet-nav .nav-section ul li {\n  padding: 0 15px !important;\n}\n.tablet-nav .nav-section ul li .page-name {\n  font-size: 0.9rem !important;\n}\n@media (max-width: 1023px) {\n  .logo-container {\n    padding-left: 20px;\n  }\n  .logo-container .logo-image {\n    height: 45px;\n    max-width: 220px;\n  }\n}\n@media (max-width: 767px) {\n  .logo-container {\n    padding-left: 15px;\n  }\n  .logo-container .logo-image {\n    height: 40px;\n    max-width: 180px;\n  }\n  .site-header {\n    height: 70px;\n  }\n}\n@supports (padding-top: env(safe-area-inset-top)) {\n  .site-header {\n    padding-top: env(safe-area-inset-top);\n    height: calc(90px + env(safe-area-inset-top));\n  }\n  @media (max-width: 767px) {\n    .site-header {\n      height: calc(70px + env(safe-area-inset-top));\n    }\n  }\n  .mobile-menu-overlay {\n    padding-top: env(safe-area-inset-top);\n  }\n}\n/*# sourceMappingURL=site-header.component.css.map */\n"] }]
  }], () => [{ type: Router }, { type: ResponsiveService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SiteHeaderComponent, { className: "SiteHeaderComponent", filePath: "src/app/shared/components/site-header/site-header.component.ts", lineNumber: 402 });
})();

export {
  Platform,
  MediaMatcher,
  BreakpointObserver,
  ResponsiveService,
  SiteHeaderComponent
};
//# sourceMappingURL=chunk-YTISND37.js.map
