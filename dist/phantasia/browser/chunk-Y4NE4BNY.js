import {
  MatButton,
  MatButtonModule,
  MatIconButton,
  _getAnimationsState
} from "./chunk-JJRARYBB.js";
import {
  FormsModule
} from "./chunk-MUUHJO3F.js";
import {
  MatCommonModule,
  MatIcon,
  MatIconModule
} from "./chunk-3GUFOW2E.js";
import {
  SquaresAnimationComponent
} from "./chunk-ZYYC6C7V.js";
import {
  environment
} from "./chunk-R6D4IH7D.js";
import {
  SiteHeaderComponent
} from "./chunk-YTISND37.js";
import {
  Router
} from "./chunk-FJNAFJM7.js";
import {
  BehaviorSubject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  DOCUMENT,
  DestroyRef,
  ElementRef,
  EventEmitter,
  HttpClient,
  HttpClientModule,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  Injectable,
  InjectionToken,
  Input,
  NgForOf,
  NgIf,
  NgModule,
  NgZone,
  Observable,
  Output,
  Renderer2,
  ViewChild,
  ViewEncapsulation,
  __async,
  __spreadValues,
  assertInInjectionContext,
  catchError,
  computed,
  debounceTime,
  distinctUntilChanged,
  effect,
  from,
  fromEvent,
  inject,
  map,
  numberAttribute,
  of,
  retry,
  setClassMetadata,
  shareReplay,
  signal,
  switchMap,
  takeUntil,
  tap,
  throwError,
  timer,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵqueryRefresh,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery
} from "./chunk-F34NQEWD.js";

// node_modules/.pnpm/@angular+material@20.2.1_6454c0930df7c912b2ef33598e3c1604/node_modules/@angular/material/fesm2022/progress-bar.mjs
function MatProgressBar_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElement(0, "div", 2);
  }
}
var MAT_PROGRESS_BAR_DEFAULT_OPTIONS = new InjectionToken("MAT_PROGRESS_BAR_DEFAULT_OPTIONS");
var MAT_PROGRESS_BAR_LOCATION = new InjectionToken("mat-progress-bar-location", {
  providedIn: "root",
  factory: MAT_PROGRESS_BAR_LOCATION_FACTORY
});
function MAT_PROGRESS_BAR_LOCATION_FACTORY() {
  const _document = inject(DOCUMENT);
  const _location = _document ? _document.location : null;
  return {
    // Note that this needs to be a function, rather than a property, because Angular
    // will only resolve it once, but we want the current path on each call.
    getPathname: () => _location ? _location.pathname + _location.search : ""
  };
}
var MatProgressBar = class _MatProgressBar {
  _elementRef = inject(ElementRef);
  _ngZone = inject(NgZone);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _renderer = inject(Renderer2);
  _cleanupTransitionEnd;
  constructor() {
    const animationsState = _getAnimationsState();
    const defaults = inject(MAT_PROGRESS_BAR_DEFAULT_OPTIONS, {
      optional: true
    });
    this._isNoopAnimation = animationsState === "di-disabled";
    if (animationsState === "reduced-motion") {
      this._elementRef.nativeElement.classList.add("mat-progress-bar-reduced-motion");
    }
    if (defaults) {
      if (defaults.color) {
        this.color = this._defaultColor = defaults.color;
      }
      this.mode = defaults.mode || this.mode;
    }
  }
  /** Flag that indicates whether NoopAnimations mode is set to true. */
  _isNoopAnimation;
  // TODO: should be typed as `ThemePalette` but internal apps pass in arbitrary strings.
  /**
   * Theme color of the progress bar. This API is supported in M2 themes only, it
   * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/progress-bar/styling.
   *
   * For information on applying color variants in M3, see
   * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
   */
  get color() {
    return this._color || this._defaultColor;
  }
  set color(value) {
    this._color = value;
  }
  _color;
  _defaultColor = "primary";
  /** Value of the progress bar. Defaults to zero. Mirrored to aria-valuenow. */
  get value() {
    return this._value;
  }
  set value(v) {
    this._value = clamp(v || 0);
    this._changeDetectorRef.markForCheck();
  }
  _value = 0;
  /** Buffer value of the progress bar. Defaults to zero. */
  get bufferValue() {
    return this._bufferValue || 0;
  }
  set bufferValue(v) {
    this._bufferValue = clamp(v || 0);
    this._changeDetectorRef.markForCheck();
  }
  _bufferValue = 0;
  /**
   * Event emitted when animation of the primary progress bar completes. This event will not
   * be emitted when animations are disabled, nor will it be emitted for modes with continuous
   * animations (indeterminate and query).
   */
  animationEnd = new EventEmitter();
  /**
   * Mode of the progress bar.
   *
   * Input must be one of these values: determinate, indeterminate, buffer, query, defaults to
   * 'determinate'.
   * Mirrored to mode attribute.
   */
  get mode() {
    return this._mode;
  }
  set mode(value) {
    this._mode = value;
    this._changeDetectorRef.markForCheck();
  }
  _mode = "determinate";
  ngAfterViewInit() {
    this._ngZone.runOutsideAngular(() => {
      this._cleanupTransitionEnd = this._renderer.listen(this._elementRef.nativeElement, "transitionend", this._transitionendHandler);
    });
  }
  ngOnDestroy() {
    this._cleanupTransitionEnd?.();
  }
  /** Gets the transform style that should be applied to the primary bar. */
  _getPrimaryBarTransform() {
    return `scaleX(${this._isIndeterminate() ? 1 : this.value / 100})`;
  }
  /** Gets the `flex-basis` value that should be applied to the buffer bar. */
  _getBufferBarFlexBasis() {
    return `${this.mode === "buffer" ? this.bufferValue : 100}%`;
  }
  /** Returns whether the progress bar is indeterminate. */
  _isIndeterminate() {
    return this.mode === "indeterminate" || this.mode === "query";
  }
  /** Event handler for `transitionend` events. */
  _transitionendHandler = (event) => {
    if (this.animationEnd.observers.length === 0 || !event.target || !event.target.classList.contains("mdc-linear-progress__primary-bar")) {
      return;
    }
    if (this.mode === "determinate" || this.mode === "buffer") {
      this._ngZone.run(() => this.animationEnd.next({
        value: this.value
      }));
    }
  };
  static \u0275fac = function MatProgressBar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatProgressBar)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatProgressBar,
    selectors: [["mat-progress-bar"]],
    hostAttrs: ["role", "progressbar", "aria-valuemin", "0", "aria-valuemax", "100", "tabindex", "-1", 1, "mat-mdc-progress-bar", "mdc-linear-progress"],
    hostVars: 10,
    hostBindings: function MatProgressBar_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("aria-valuenow", ctx._isIndeterminate() ? null : ctx.value)("mode", ctx.mode);
        \u0275\u0275classMap("mat-" + ctx.color);
        \u0275\u0275classProp("_mat-animation-noopable", ctx._isNoopAnimation)("mdc-linear-progress--animation-ready", !ctx._isNoopAnimation)("mdc-linear-progress--indeterminate", ctx._isIndeterminate());
      }
    },
    inputs: {
      color: "color",
      value: [2, "value", "value", numberAttribute],
      bufferValue: [2, "bufferValue", "bufferValue", numberAttribute],
      mode: "mode"
    },
    outputs: {
      animationEnd: "animationEnd"
    },
    exportAs: ["matProgressBar"],
    decls: 7,
    vars: 5,
    consts: [["aria-hidden", "true", 1, "mdc-linear-progress__buffer"], [1, "mdc-linear-progress__buffer-bar"], [1, "mdc-linear-progress__buffer-dots"], ["aria-hidden", "true", 1, "mdc-linear-progress__bar", "mdc-linear-progress__primary-bar"], [1, "mdc-linear-progress__bar-inner"], ["aria-hidden", "true", 1, "mdc-linear-progress__bar", "mdc-linear-progress__secondary-bar"]],
    template: function MatProgressBar_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275domElementStart(0, "div", 0);
        \u0275\u0275domElement(1, "div", 1);
        \u0275\u0275conditionalCreate(2, MatProgressBar_Conditional_2_Template, 1, 0, "div", 2);
        \u0275\u0275domElementEnd();
        \u0275\u0275domElementStart(3, "div", 3);
        \u0275\u0275domElement(4, "span", 4);
        \u0275\u0275domElementEnd();
        \u0275\u0275domElementStart(5, "div", 5);
        \u0275\u0275domElement(6, "span", 4);
        \u0275\u0275domElementEnd();
      }
      if (rf & 2) {
        \u0275\u0275advance();
        \u0275\u0275styleProp("flex-basis", ctx._getBufferBarFlexBasis());
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.mode === "buffer" ? 2 : -1);
        \u0275\u0275advance();
        \u0275\u0275styleProp("transform", ctx._getPrimaryBarTransform());
      }
    },
    styles: [`.mat-mdc-progress-bar{--mat-progress-bar-animation-multiplier: 1;display:block;text-align:start}.mat-mdc-progress-bar[mode=query]{transform:scaleX(-1)}.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-dots,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__secondary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__bar-inner.mdc-linear-progress__bar-inner{animation:none}.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-bar{transition:transform 1ms}.mat-progress-bar-reduced-motion{--mat-progress-bar-animation-multiplier: 2}.mdc-linear-progress{position:relative;width:100%;transform:translateZ(0);outline:1px solid rgba(0,0,0,0);overflow-x:hidden;transition:opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);height:max(var(--mat-progress-bar-track-height, 4px),var(--mat-progress-bar-active-indicator-height, 4px))}@media(forced-colors: active){.mdc-linear-progress{outline-color:CanvasText}}.mdc-linear-progress__bar{position:absolute;top:0;bottom:0;margin:auto 0;width:100%;animation:none;transform-origin:top left;transition:transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);height:var(--mat-progress-bar-active-indicator-height, 4px)}.mdc-linear-progress--indeterminate .mdc-linear-progress__bar{transition:none}[dir=rtl] .mdc-linear-progress__bar{right:0;transform-origin:center right}.mdc-linear-progress__bar-inner{display:inline-block;position:absolute;width:100%;animation:none;border-top-style:solid;border-color:var(--mat-progress-bar-active-indicator-color, var(--mat-sys-primary));border-top-width:var(--mat-progress-bar-active-indicator-height, 4px)}.mdc-linear-progress__buffer{display:flex;position:absolute;top:0;bottom:0;margin:auto 0;width:100%;overflow:hidden;height:var(--mat-progress-bar-track-height, 4px);border-radius:var(--mat-progress-bar-track-shape, var(--mat-sys-corner-none))}.mdc-linear-progress__buffer-dots{-webkit-mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");background-repeat:repeat-x;flex:auto;transform:rotate(180deg);animation:mdc-linear-progress-buffering calc(250ms*var(--mat-progress-bar-animation-multiplier)) infinite linear;background-color:var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant))}@media(forced-colors: active){.mdc-linear-progress__buffer-dots{background-color:ButtonBorder}}[dir=rtl] .mdc-linear-progress__buffer-dots{animation:mdc-linear-progress-buffering-reverse calc(250ms*var(--mat-progress-bar-animation-multiplier)) infinite linear;transform:rotate(0)}.mdc-linear-progress__buffer-bar{flex:0 1 100%;transition:flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);background-color:var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant))}.mdc-linear-progress__primary-bar{transform:scaleX(0)}.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{left:-145.166611%}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation:mdc-linear-progress-primary-indeterminate-translate calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-primary-indeterminate-scale calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation-name:mdc-linear-progress-primary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{right:-145.166611%;left:auto}.mdc-linear-progress__secondary-bar{display:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{left:-54.888891%;display:block}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation:mdc-linear-progress-secondary-indeterminate-translate calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-secondary-indeterminate-scale calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation-name:mdc-linear-progress-secondary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{right:-54.888891%;left:auto}@keyframes mdc-linear-progress-buffering{from{transform:rotate(180deg) translateX(calc(var(--mat-progress-bar-track-height, 4px) * -2.5))}}@keyframes mdc-linear-progress-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%)}100%{transform:translateX(200.611057%)}}@keyframes mdc-linear-progress-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%)}100%{transform:translateX(160.277782%)}}@keyframes mdc-linear-progress-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(-83.67142%)}100%{transform:translateX(-200.611057%)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(-37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(-84.386165%)}100%{transform:translateX(-160.277782%)}}@keyframes mdc-linear-progress-buffering-reverse{from{transform:translateX(-10px)}}
`],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatProgressBar, [{
    type: Component,
    args: [{
      selector: "mat-progress-bar",
      exportAs: "matProgressBar",
      host: {
        "role": "progressbar",
        "aria-valuemin": "0",
        "aria-valuemax": "100",
        // set tab index to -1 so screen readers will read the aria-label
        // Note: there is a known issue with JAWS that does not read progressbar aria labels on FireFox
        "tabindex": "-1",
        "[attr.aria-valuenow]": "_isIndeterminate() ? null : value",
        "[attr.mode]": "mode",
        "class": "mat-mdc-progress-bar mdc-linear-progress",
        "[class]": '"mat-" + color',
        "[class._mat-animation-noopable]": "_isNoopAnimation",
        "[class.mdc-linear-progress--animation-ready]": "!_isNoopAnimation",
        "[class.mdc-linear-progress--indeterminate]": "_isIndeterminate()"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: `<!--
  All children need to be hidden for screen readers in order to support ChromeVox.
  More context in the issue: https://github.com/angular/components/issues/22165.
-->
<div class="mdc-linear-progress__buffer" aria-hidden="true">
  <div
    class="mdc-linear-progress__buffer-bar"
    [style.flex-basis]="_getBufferBarFlexBasis()"></div>
  <!-- Remove the dots outside of buffer mode since they can cause CSP issues (see #28938) -->
  @if (mode === 'buffer') {
    <div class="mdc-linear-progress__buffer-dots"></div>
  }
</div>
<div
  class="mdc-linear-progress__bar mdc-linear-progress__primary-bar"
  aria-hidden="true"
  [style.transform]="_getPrimaryBarTransform()">
  <span class="mdc-linear-progress__bar-inner"></span>
</div>
<div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar" aria-hidden="true">
  <span class="mdc-linear-progress__bar-inner"></span>
</div>
`,
      styles: [`.mat-mdc-progress-bar{--mat-progress-bar-animation-multiplier: 1;display:block;text-align:start}.mat-mdc-progress-bar[mode=query]{transform:scaleX(-1)}.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-dots,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__secondary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__bar-inner.mdc-linear-progress__bar-inner{animation:none}.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__primary-bar,.mat-mdc-progress-bar._mat-animation-noopable .mdc-linear-progress__buffer-bar{transition:transform 1ms}.mat-progress-bar-reduced-motion{--mat-progress-bar-animation-multiplier: 2}.mdc-linear-progress{position:relative;width:100%;transform:translateZ(0);outline:1px solid rgba(0,0,0,0);overflow-x:hidden;transition:opacity 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);height:max(var(--mat-progress-bar-track-height, 4px),var(--mat-progress-bar-active-indicator-height, 4px))}@media(forced-colors: active){.mdc-linear-progress{outline-color:CanvasText}}.mdc-linear-progress__bar{position:absolute;top:0;bottom:0;margin:auto 0;width:100%;animation:none;transform-origin:top left;transition:transform 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);height:var(--mat-progress-bar-active-indicator-height, 4px)}.mdc-linear-progress--indeterminate .mdc-linear-progress__bar{transition:none}[dir=rtl] .mdc-linear-progress__bar{right:0;transform-origin:center right}.mdc-linear-progress__bar-inner{display:inline-block;position:absolute;width:100%;animation:none;border-top-style:solid;border-color:var(--mat-progress-bar-active-indicator-color, var(--mat-sys-primary));border-top-width:var(--mat-progress-bar-active-indicator-height, 4px)}.mdc-linear-progress__buffer{display:flex;position:absolute;top:0;bottom:0;margin:auto 0;width:100%;overflow:hidden;height:var(--mat-progress-bar-track-height, 4px);border-radius:var(--mat-progress-bar-track-shape, var(--mat-sys-corner-none))}.mdc-linear-progress__buffer-dots{-webkit-mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");mask-image:url("data:image/svg+xml,%3Csvg version='1.1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' enable-background='new 0 0 5 2' xml:space='preserve' viewBox='0 0 5 2' preserveAspectRatio='xMinYMin slice'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/svg%3E");background-repeat:repeat-x;flex:auto;transform:rotate(180deg);animation:mdc-linear-progress-buffering calc(250ms*var(--mat-progress-bar-animation-multiplier)) infinite linear;background-color:var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant))}@media(forced-colors: active){.mdc-linear-progress__buffer-dots{background-color:ButtonBorder}}[dir=rtl] .mdc-linear-progress__buffer-dots{animation:mdc-linear-progress-buffering-reverse calc(250ms*var(--mat-progress-bar-animation-multiplier)) infinite linear;transform:rotate(0)}.mdc-linear-progress__buffer-bar{flex:0 1 100%;transition:flex-basis 250ms 0ms cubic-bezier(0.4, 0, 0.6, 1);background-color:var(--mat-progress-bar-track-color, var(--mat-sys-surface-variant))}.mdc-linear-progress__primary-bar{transform:scaleX(0)}.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{left:-145.166611%}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation:mdc-linear-progress-primary-indeterminate-translate calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-primary-indeterminate-scale calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__primary-bar{animation-name:mdc-linear-progress-primary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__primary-bar{right:-145.166611%;left:auto}.mdc-linear-progress__secondary-bar{display:none}.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{left:-54.888891%;display:block}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation:mdc-linear-progress-secondary-indeterminate-translate calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}.mdc-linear-progress--indeterminate.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar>.mdc-linear-progress__bar-inner{animation:mdc-linear-progress-secondary-indeterminate-scale calc(2s*var(--mat-progress-bar-animation-multiplier)) infinite linear}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--animation-ready .mdc-linear-progress__secondary-bar{animation-name:mdc-linear-progress-secondary-indeterminate-translate-reverse}[dir=rtl] .mdc-linear-progress.mdc-linear-progress--indeterminate .mdc-linear-progress__secondary-bar{right:-54.888891%;left:auto}@keyframes mdc-linear-progress-buffering{from{transform:rotate(180deg) translateX(calc(var(--mat-progress-bar-track-height, 4px) * -2.5))}}@keyframes mdc-linear-progress-primary-indeterminate-translate{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(83.67142%)}100%{transform:translateX(200.611057%)}}@keyframes mdc-linear-progress-primary-indeterminate-scale{0%{transform:scaleX(0.08)}36.65%{animation-timing-function:cubic-bezier(0.334731, 0.12482, 0.785844, 1);transform:scaleX(0.08)}69.15%{animation-timing-function:cubic-bezier(0.06, 0.11, 0.6, 1);transform:scaleX(0.661479)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(84.386165%)}100%{transform:translateX(160.277782%)}}@keyframes mdc-linear-progress-secondary-indeterminate-scale{0%{animation-timing-function:cubic-bezier(0.205028, 0.057051, 0.57661, 0.453971);transform:scaleX(0.08)}19.15%{animation-timing-function:cubic-bezier(0.152313, 0.196432, 0.648374, 1.004315);transform:scaleX(0.457104)}44.15%{animation-timing-function:cubic-bezier(0.257759, -0.003163, 0.211762, 1.38179);transform:scaleX(0.72796)}100%{transform:scaleX(0.08)}}@keyframes mdc-linear-progress-primary-indeterminate-translate-reverse{0%{transform:translateX(0)}20%{animation-timing-function:cubic-bezier(0.5, 0, 0.701732, 0.495819);transform:translateX(0)}59.15%{animation-timing-function:cubic-bezier(0.302435, 0.381352, 0.55, 0.956352);transform:translateX(-83.67142%)}100%{transform:translateX(-200.611057%)}}@keyframes mdc-linear-progress-secondary-indeterminate-translate-reverse{0%{animation-timing-function:cubic-bezier(0.15, 0, 0.515058, 0.409685);transform:translateX(0)}25%{animation-timing-function:cubic-bezier(0.31033, 0.284058, 0.8, 0.733712);transform:translateX(-37.651913%)}48.35%{animation-timing-function:cubic-bezier(0.4, 0.627035, 0.6, 0.902026);transform:translateX(-84.386165%)}100%{transform:translateX(-160.277782%)}}@keyframes mdc-linear-progress-buffering-reverse{from{transform:translateX(-10px)}}
`]
    }]
  }], () => [], {
    color: [{
      type: Input
    }],
    value: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    bufferValue: [{
      type: Input,
      args: [{
        transform: numberAttribute
      }]
    }],
    animationEnd: [{
      type: Output
    }],
    mode: [{
      type: Input
    }]
  });
})();
function clamp(v, min = 0, max = 100) {
  return Math.max(min, Math.min(max, v));
}
var MatProgressBarModule = class _MatProgressBarModule {
  static \u0275fac = function MatProgressBarModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatProgressBarModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatProgressBarModule,
    imports: [MatProgressBar],
    exports: [MatProgressBar, MatCommonModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatCommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatProgressBarModule, [{
    type: NgModule,
    args: [{
      imports: [MatProgressBar],
      exports: [MatProgressBar, MatCommonModule]
    }]
  }], null, null);
})();

// node_modules/.pnpm/@angular+core@20.1.4_@angular+compiler@20.1.4_rxjs@7.8.2_zone.js@0.15.1/node_modules/@angular/core/fesm2022/rxjs-interop.mjs
function takeUntilDestroyed(destroyRef) {
  if (!destroyRef) {
    ngDevMode && assertInInjectionContext(takeUntilDestroyed);
    destroyRef = inject(DestroyRef);
  }
  const destroyed$ = new Observable((subscriber) => {
    if (destroyRef.destroyed) {
      subscriber.next();
      return;
    }
    const unregisterFn = destroyRef.onDestroy(subscriber.next.bind(subscriber));
    return unregisterFn;
  });
  return (source) => {
    return source.pipe(takeUntil(destroyed$));
  };
}

// src/app/services/twitter-oauth-optimized.service.ts
var _TwitterOAuthOptimizedService = class _TwitterOAuthOptimizedService {
  constructor(http) {
    this.http = http;
    this.API_BASE_URL = "https://api.x.com/2";
    this.OAUTH_VERSION = "1.0";
    this.SIGNATURE_METHOD = "HMAC-SHA1";
    this.CACHE_TTL = 3e5;
    this.signatureCache = /* @__PURE__ */ new Map();
    this.maxCacheSize = 50;
    this.encodeMap = /* @__PURE__ */ new Map();
    this.nonceChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    this.textEncoder = new TextEncoder();
    this.precomputeEncodingMap();
  }
  /**
   * Pre-compute common encoding values to avoid repeated calculations
   */
  precomputeEncodingMap() {
    const commonChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~";
    for (const char of commonChars) {
      this.encodeMap.set(char, char);
    }
    const specialChars = ` !"#$%&'()*+,/:;=?@[]`;
    for (const char of specialChars) {
      this.encodeMap.set(char, encodeURIComponent(char));
    }
  }
  /**
   * Generate OAuth authorization header with caching
   */
  generateAuthorizationHeader(_0, _1) {
    return __async(this, arguments, function* (httpMethod, url, queryParams = {}, credentials) {
      const cacheKey = this.createCacheKey(httpMethod, url, queryParams, credentials);
      const cached = this.getFromCache(cacheKey);
      if (cached) {
        return cached;
      }
      const oauthParams = {
        oauth_consumer_key: credentials.apiKey,
        oauth_nonce: this.generateNonce(),
        oauth_signature_method: this.SIGNATURE_METHOD,
        oauth_timestamp: this.generateTimestamp(),
        oauth_token: credentials.accessToken,
        oauth_version: this.OAUTH_VERSION
      };
      const signature = yield this.generateSignatureOptimized(httpMethod, url, __spreadValues(__spreadValues({}, queryParams), oauthParams), credentials);
      oauthParams.oauth_signature = signature;
      const authHeader = this.buildAuthorizationHeader(oauthParams);
      this.cacheSignature(cacheKey, authHeader);
      return authHeader;
    });
  }
  /**
   * Optimized signature generation using Web Crypto API
   */
  generateSignatureOptimized(httpMethod, url, params, credentials) {
    return __async(this, null, function* () {
      const parameterString = this.createParameterStringOptimized(params);
      const signatureBaseString = this.createSignatureBaseStringOptimized(httpMethod, url, parameterString);
      const signingKey = this.createSigningKeyOptimized(credentials.apiSecret, credentials.accessTokenSecret);
      return yield this.hmacSha1WebCrypto(signatureBaseString, signingKey);
    });
  }
  /**
   * Optimized parameter string creation
   */
  createParameterStringOptimized(params) {
    const keys = Object.keys(params);
    keys.sort();
    let result = "";
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const encodedKey = this.percentEncodeOptimized(key);
      const encodedValue = this.percentEncodeOptimized(params[key]);
      if (i > 0)
        result += "&";
      result += `${encodedKey}=${encodedValue}`;
    }
    return result;
  }
  /**
   * Optimized signature base string creation
   */
  createSignatureBaseStringOptimized(httpMethod, url, parameterString) {
    const method = httpMethod.toUpperCase();
    const encodedUrl = this.percentEncodeOptimized(url);
    const encodedParams = this.percentEncodeOptimized(parameterString);
    return `${method}&${encodedUrl}&${encodedParams}`;
  }
  /**
   * Optimized signing key creation
   */
  createSigningKeyOptimized(consumerSecret, tokenSecret) {
    const encodedConsumerSecret = this.percentEncodeOptimized(consumerSecret);
    const encodedTokenSecret = this.percentEncodeOptimized(tokenSecret);
    return `${encodedConsumerSecret}&${encodedTokenSecret}`;
  }
  /**
   * HMAC-SHA1 using Web Crypto API (faster than CryptoJS)
   */
  hmacSha1WebCrypto(data, key) {
    return __async(this, null, function* () {
      const keyBuffer = this.textEncoder.encode(key);
      const dataBuffer = this.textEncoder.encode(data);
      const cryptoKey = yield crypto.subtle.importKey("raw", keyBuffer, { name: "HMAC", hash: "SHA-1" }, false, ["sign"]);
      const signature = yield crypto.subtle.sign("HMAC", cryptoKey, dataBuffer);
      const bytes = new Uint8Array(signature);
      let binary = "";
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
      }
      return btoa(binary);
    });
  }
  /**
   * Optimized percent encoding with caching
   */
  percentEncodeOptimized(str) {
    let result = "";
    for (let i = 0; i < str.length; i++) {
      const char = str[i];
      if (this.encodeMap.has(char)) {
        result += this.encodeMap.get(char);
      } else {
        const encoded = encodeURIComponent(char).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
        if (this.encodeMap.size < 1e3) {
          this.encodeMap.set(char, encoded);
        }
        result += encoded;
      }
    }
    return result;
  }
  /**
   * Fast nonce generation (no crypto needed for nonces)
   */
  generateNonce() {
    let result = "";
    for (let i = 0; i < 32; i++) {
      result += this.nonceChars.charAt(Math.floor(Math.random() * this.nonceChars.length));
    }
    return result;
  }
  /**
   * Timestamp generation
   */
  generateTimestamp() {
    return Math.floor(Date.now() / 1e3).toString();
  }
  /**
   * Build authorization header
   */
  buildAuthorizationHeader(oauthParams) {
    const headerParts = [];
    for (const [key, value] of Object.entries(oauthParams)) {
      if (value !== void 0) {
        const encodedKey = this.percentEncodeOptimized(key);
        const encodedValue = this.percentEncodeOptimized(value);
        headerParts.push(`${encodedKey}="${encodedValue}"`);
      }
    }
    return `OAuth ${headerParts.join(", ")}`;
  }
  /**
   * Create cache key for signature caching
   */
  createCacheKey(method, url, params, credentials) {
    const sortedParams = Object.keys(params).sort().map((key) => `${key}=${params[key]}`).join("&");
    return `${method}:${url}:${sortedParams}:${credentials.apiKey}`;
  }
  /**
   * Get cached signature if still valid
   */
  getFromCache(key) {
    const cached = this.signatureCache.get(key);
    if (!cached)
      return null;
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.signatureCache.delete(key);
      return null;
    }
    return cached.signature;
  }
  /**
   * Cache signature with memory management
   */
  cacheSignature(key, signature) {
    if (this.signatureCache.size >= this.maxCacheSize) {
      const firstKey = this.signatureCache.keys().next().value;
      if (firstKey) {
        this.signatureCache.delete(firstKey);
      }
    }
    this.signatureCache.set(key, {
      key,
      signature,
      timestamp: Date.now()
    });
  }
  /**
   * Create authenticated headers
   */
  createAuthenticatedHeaders(_0, _1) {
    return __async(this, arguments, function* (httpMethod, url, queryParams = {}, credentials) {
      const authHeader = yield this.generateAuthorizationHeader(httpMethod, url, queryParams, credentials);
      return new HttpHeaders({
        "Authorization": authHeader,
        "Content-Type": "application/json"
      });
    });
  }
  /**
   * Clear caches to free memory
   */
  clearCaches() {
    this.signatureCache.clear();
    this.encodeMap.clear();
    this.precomputeEncodingMap();
  }
  /**
   * Get cache statistics for monitoring
   */
  getCacheStats() {
    return {
      signatureCacheSize: this.signatureCache.size,
      encodingCacheSize: this.encodeMap.size,
      maxCacheSize: this.maxCacheSize
    };
  }
  /**
   * Validate credentials
   */
  validateCredentials(credentials) {
    const errors = [];
    if (!credentials.apiKey?.trim()) {
      errors.push("API Key is required");
    }
    if (!credentials.apiSecret?.trim()) {
      errors.push("API Secret is required");
    }
    if (!credentials.accessToken?.trim()) {
      errors.push("Access Token is required");
    }
    if (!credentials.accessTokenSecret?.trim()) {
      errors.push("Access Token Secret is required");
    }
    return {
      valid: errors.length === 0,
      errors
    };
  }
  /**
   * Get API endpoints
   */
  getApiEndpoints() {
    return {
      userByUsername: (username) => `${this.API_BASE_URL}/users/by/username/${username}`,
      userTweets: (userId) => `${this.API_BASE_URL}/users/${userId}/tweets`,
      userInfo: () => `${this.API_BASE_URL}/users/me`,
      tweet: (tweetId) => `${this.API_BASE_URL}/tweets/${tweetId}`
    };
  }
};
_TwitterOAuthOptimizedService.\u0275fac = function TwitterOAuthOptimizedService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TwitterOAuthOptimizedService)(\u0275\u0275inject(HttpClient));
};
_TwitterOAuthOptimizedService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TwitterOAuthOptimizedService, factory: _TwitterOAuthOptimizedService.\u0275fac, providedIn: "root" });
var TwitterOAuthOptimizedService = _TwitterOAuthOptimizedService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TwitterOAuthOptimizedService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/services/twitter-cache-optimized.service.ts
var _TwitterCacheOptimizedService = class _TwitterCacheOptimizedService {
  constructor() {
    this.maxCacheSize = 100;
    this.maxMemorySize = 5 * 1024 * 1024;
    this.cleanupInterval = 6e4;
    this.maxAge = 24 * 60 * 60 * 1e3;
    this.userCache = /* @__PURE__ */ new Map();
    this.tweetCache = /* @__PURE__ */ new Map();
    this.hits = 0;
    this.misses = 0;
    this.totalRequests = 0;
    this.currentMemorySize = 0;
    this.cacheStatsSubject = new BehaviorSubject(this.calculateCacheStats());
    this.startMemoryMonitoring();
    this.setupMemoryPressureHandler();
  }
  /**
   * Cache a Twitter user with memory-efficient storage
   */
  cacheUser(user) {
    const size = this.estimateObjectSize(user);
    if (this.currentMemorySize + size > this.maxMemorySize) {
      this.performMemoryCleanup();
    }
    const entry = {
      data: user,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
      size
    };
    this.userCache.set(user.username.toLowerCase(), entry);
    this.currentMemorySize += size;
    this.enforceCacheLimits();
    this.updateCacheStats();
  }
  /**
   * Get cached user with efficient lookup
   */
  getUser(username) {
    this.totalRequests++;
    const entry = this.userCache.get(username.toLowerCase());
    if (!entry) {
      this.misses++;
      this.updateCacheStats();
      return null;
    }
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.removeUser(username);
      this.misses++;
      this.updateCacheStats();
      return null;
    }
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.hits++;
    this.updateCacheStats();
    return entry.data;
  }
  /**
   * Cache tweets for a user
   */
  cacheTweets(userId, tweets) {
    const size = this.estimateObjectSize(tweets);
    if (this.currentMemorySize + size > this.maxMemorySize) {
      this.performMemoryCleanup();
    }
    const entry = {
      data: tweets,
      timestamp: Date.now(),
      accessCount: 0,
      lastAccessed: Date.now(),
      size
    };
    const oldEntry = this.tweetCache.get(userId);
    if (oldEntry) {
      this.currentMemorySize -= oldEntry.size;
    }
    this.tweetCache.set(userId, entry);
    this.currentMemorySize += size;
    this.enforceCacheLimits();
    this.updateCacheStats();
  }
  /**
   * Get cached tweets for a user
   */
  getTweets(userId) {
    this.totalRequests++;
    const entry = this.tweetCache.get(userId);
    if (!entry) {
      this.misses++;
      this.updateCacheStats();
      return null;
    }
    const tweetMaxAge = 12 * 60 * 60 * 1e3;
    if (Date.now() - entry.timestamp > tweetMaxAge) {
      this.removeTweets(userId);
      this.misses++;
      this.updateCacheStats();
      return null;
    }
    entry.accessCount++;
    entry.lastAccessed = Date.now();
    this.hits++;
    this.updateCacheStats();
    return entry.data;
  }
  /**
   * Check if user data is fresh
   */
  isUserDataFresh(username, maxAgeHours = 24) {
    const entry = this.userCache.get(username.toLowerCase());
    if (!entry)
      return false;
    const maxAge = maxAgeHours * 60 * 60 * 1e3;
    return Date.now() - entry.timestamp < maxAge;
  }
  /**
   * Check if tweet data is fresh
   */
  isTweetDataFresh(userId, maxAgeHours = 12) {
    const entry = this.tweetCache.get(userId);
    if (!entry)
      return false;
    const maxAge = maxAgeHours * 60 * 60 * 1e3;
    return Date.now() - entry.timestamp < maxAge;
  }
  /**
   * Remove specific user from cache
   */
  removeUser(username) {
    const entry = this.userCache.get(username.toLowerCase());
    if (entry) {
      this.currentMemorySize -= entry.size;
      this.userCache.delete(username.toLowerCase());
    }
  }
  /**
   * Remove specific tweets from cache
   */
  removeTweets(userId) {
    const entry = this.tweetCache.get(userId);
    if (entry) {
      this.currentMemorySize -= entry.size;
      this.tweetCache.delete(userId);
    }
  }
  /**
   * Perform memory cleanup using LRU strategy
   */
  performMemoryCleanup() {
    console.log("\u{1F9F9} Performing memory cleanup...");
    const allEntries = [];
    this.userCache.forEach((entry, key) => {
      allEntries.push({ key, entry, type: "user" });
    });
    this.tweetCache.forEach((entry, key) => {
      allEntries.push({ key, entry, type: "tweet" });
    });
    allEntries.sort((a, b) => a.entry.lastAccessed - b.entry.lastAccessed);
    const targetSize = this.maxMemorySize * 0.7;
    let removedCount = 0;
    for (const item of allEntries) {
      if (this.currentMemorySize <= targetSize)
        break;
      if (item.type === "user") {
        this.removeUser(item.key);
      } else {
        this.removeTweets(item.key);
      }
      removedCount++;
    }
    console.log(`\u{1F9F9} Cleaned up ${removedCount} cache entries, freed ${(this.maxMemorySize - this.currentMemorySize) / 1024}KB`);
  }
  /**
   * Enforce cache size limits
   */
  enforceCacheLimits() {
    const totalEntries = this.userCache.size + this.tweetCache.size;
    if (totalEntries > this.maxCacheSize) {
      this.performMemoryCleanup();
    }
  }
  /**
   * Estimate object size in bytes (approximation)
   */
  estimateObjectSize(obj) {
    const jsonString = JSON.stringify(obj);
    return new Blob([jsonString]).size;
  }
  /**
   * Calculate current cache statistics
   */
  calculateCacheStats() {
    const totalItems = this.userCache.size + this.tweetCache.size;
    const hitRate = this.totalRequests > 0 ? this.hits / this.totalRequests * 100 : 0;
    let oldestEntry = Date.now();
    let newestEntry = 0;
    this.userCache.forEach((entry) => {
      oldestEntry = Math.min(oldestEntry, entry.timestamp);
      newestEntry = Math.max(newestEntry, entry.timestamp);
    });
    this.tweetCache.forEach((entry) => {
      oldestEntry = Math.min(oldestEntry, entry.timestamp);
      newestEntry = Math.max(newestEntry, entry.timestamp);
    });
    const memoryPressure = this.currentMemorySize / this.maxMemorySize * 100;
    return {
      totalItems,
      totalSize: this.currentMemorySize,
      hitRate,
      memoryPressure,
      oldestEntry: totalItems > 0 ? oldestEntry : 0,
      newestEntry: totalItems > 0 ? newestEntry : 0
    };
  }
  /**
   * Update cache statistics
   */
  updateCacheStats() {
    this.cacheStatsSubject.next(this.calculateCacheStats());
  }
  /**
   * Start memory monitoring
   */
  startMemoryMonitoring() {
    this.cleanupTimer = window.setInterval(() => {
      this.cleanupExpiredEntries();
      const stats = this.calculateCacheStats();
      if (stats.memoryPressure > 80) {
        this.performMemoryCleanup();
      }
      this.updateCacheStats();
    }, this.cleanupInterval);
  }
  /**
   * Cleanup expired entries
   */
  cleanupExpiredEntries() {
    const now = Date.now();
    this.userCache.forEach((entry, key) => {
      if (now - entry.timestamp > this.maxAge) {
        this.removeUser(key);
      }
    });
    const tweetMaxAge = 12 * 60 * 60 * 1e3;
    this.tweetCache.forEach((entry, key) => {
      if (now - entry.timestamp > tweetMaxAge) {
        this.removeTweets(key);
      }
    });
  }
  /**
   * Setup memory pressure handler for browsers that support it
   */
  setupMemoryPressureHandler() {
    if ("memory" in performance && "addEventListener" in performance) {
      performance.addEventListener("memory", () => {
        console.log("\u{1F6A8} Memory pressure detected, cleaning cache...");
        this.performMemoryCleanup();
      });
    }
    if ("memory" in performance) {
      setInterval(() => {
        const memory = performance.memory;
        if (memory && memory.usedJSHeapSize) {
          const memoryUsagePercent = memory.usedJSHeapSize / memory.jsHeapSizeLimit * 100;
          if (memoryUsagePercent > 90) {
            console.log("\u{1F6A8} High memory usage detected, cleaning cache...");
            this.performMemoryCleanup();
          }
        }
      }, 3e4);
    }
  }
  /**
   * Clear all caches
   */
  clearAll() {
    this.userCache.clear();
    this.tweetCache.clear();
    this.currentMemorySize = 0;
    this.hits = 0;
    this.misses = 0;
    this.totalRequests = 0;
    this.updateCacheStats();
    console.log("\u{1F5D1}\uFE0F All Twitter caches cleared");
  }
  /**
   * Get cache statistics observable
   */
  getCacheStats() {
    return this.cacheStatsSubject.asObservable();
  }
  /**
   * Get current cache statistics
   */
  getCurrentStats() {
    return this.calculateCacheStats();
  }
  /**
   * Destroy service and cleanup
   */
  destroy() {
    if (this.cleanupTimer) {
      clearInterval(this.cleanupTimer);
    }
    this.clearAll();
    this.cacheStatsSubject.complete();
  }
};
_TwitterCacheOptimizedService.\u0275fac = function TwitterCacheOptimizedService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TwitterCacheOptimizedService)();
};
_TwitterCacheOptimizedService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TwitterCacheOptimizedService, factory: _TwitterCacheOptimizedService.\u0275fac, providedIn: "root" });
var TwitterCacheOptimizedService = _TwitterCacheOptimizedService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TwitterCacheOptimizedService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/services/twitter-unified-optimized.service.ts
var _TwitterUnifiedOptimizedService = class _TwitterUnifiedOptimizedService {
  constructor(http, oauthService, cacheService) {
    this.http = http;
    this.oauthService = oauthService;
    this.cacheService = cacheService;
    this.destroyRef = inject(DestroyRef);
    this.config = {
      username: environment.twitter?.username || "prismcollect_",
      enableEmbedWidget: environment.twitter?.enableEmbed ?? true,
      enableApiIntegration: environment.twitter?.enableApi ?? true,
      conservativeMode: environment.twitter?.conservativeMode ?? true,
      maxTweets: environment.twitter?.maxTweets || 5,
      cacheHours: environment.twitter?.cacheHours || 24
    };
    this.credentials = null;
    this.performanceStartTime = Date.now();
    this.apiCallCount = 0;
    this.errorCount = 0;
    this.totalRequests = 0;
    this.pendingRequests = /* @__PURE__ */ new Map();
    this.stateSubject = new BehaviorSubject({
      initialized: false,
      loading: false,
      error: null,
      embedLoaded: false,
      user: null,
      tweets: [],
      lastUpdate: null,
      apiCallsUsed: 0,
      cacheHitRate: 0
    });
    this.state = signal(this.stateSubject.value, ...ngDevMode ? [{ debugName: "state" }] : []);
    this.loading = computed(() => this.state().loading, ...ngDevMode ? [{ debugName: "loading" }] : []);
    this.error = computed(() => this.state().error, ...ngDevMode ? [{ debugName: "error" }] : []);
    this.user = computed(() => this.state().user, ...ngDevMode ? [{ debugName: "user" }] : []);
    this.tweets = computed(() => this.state().tweets, ...ngDevMode ? [{ debugName: "tweets" }] : []);
    this.embedLoaded = computed(() => this.state().embedLoaded, ...ngDevMode ? [{ debugName: "embedLoaded" }] : []);
    this.initialized = computed(() => this.state().initialized, ...ngDevMode ? [{ debugName: "initialized" }] : []);
    this.stateObservable = this.stateSubject.asObservable();
    this.stateSubject.pipe(takeUntilDestroyed(this.destroyRef)).subscribe((state) => this.state.set(state));
    this.initializeService();
    timer(6e4, 6e4).pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.performMaintenance());
  }
  /**
   * Initialize the service with lazy loading
   */
  initializeService() {
    return __async(this, null, function* () {
      try {
        this.updateState({ loading: true, error: null });
        if (this.config.enableApiIntegration) {
          this.credentials = {
            apiKey: environment.twitter?.oauth?.apiKey || "",
            apiSecret: environment.twitter?.oauth?.apiSecret || "",
            accessToken: environment.twitter?.oauth?.accessToken || "",
            accessTokenSecret: environment.twitter?.oauth?.accessTokenSecret || ""
          };
          const validation = this.oauthService.validateCredentials(this.credentials);
          if (!validation.valid) {
            throw new Error(`Invalid credentials: ${validation.errors.join(", ")}`);
          }
        }
        yield this.loadCachedData();
        this.updateState({
          initialized: true,
          loading: false,
          error: null
        });
        console.log("\u{1F680} Twitter Unified Service initialized successfully");
      } catch (error) {
        console.error("\u274C Failed to initialize Twitter service:", error);
        this.updateState({
          initialized: false,
          loading: false,
          error: error.message
        });
      }
    });
  }
  /**
   * Load cached data on startup
   */
  loadCachedData() {
    return __async(this, null, function* () {
      const cachedUser = this.cacheService.getUser(this.config.username);
      if (cachedUser) {
        this.updateState({ user: cachedUser });
      }
      if (cachedUser) {
        const cachedTweets = this.cacheService.getTweets(cachedUser.id);
        if (cachedTweets) {
          this.updateState({ tweets: cachedTweets });
        }
      }
      const cacheStats = this.cacheService.getCurrentStats();
      this.updateState({ cacheHitRate: cacheStats.hitRate });
    });
  }
  /**
   * Get user data with intelligent caching and deduplication
   */
  getUserData(username = this.config.username) {
    const cacheKey = `user:${username}`;
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }
    if (this.cacheService.isUserDataFresh(username, this.config.cacheHours)) {
      const cachedUser = this.cacheService.getUser(username);
      if (cachedUser) {
        this.updateCacheStats();
        return of(cachedUser);
      }
    }
    const request$ = this.fetchUserFromApi(username).pipe(tap((user) => {
      if (user) {
        this.cacheService.cacheUser(user);
        this.updateState({ user });
      }
      this.pendingRequests.delete(cacheKey);
      this.updateCacheStats();
    }), catchError((error) => {
      this.pendingRequests.delete(cacheKey);
      this.handleError(error);
      return throwError(() => error);
    }), shareReplay(1));
    this.pendingRequests.set(cacheKey, request$);
    return request$;
  }
  /**
   * Get tweets with caching and deduplication
   */
  getTweets(userId, maxTweets = this.config.maxTweets) {
    const targetUserId = userId || this.state().user?.id;
    if (!targetUserId) {
      return throwError(() => new Error("No user ID available for tweets"));
    }
    const cacheKey = `tweets:${targetUserId}:${maxTweets}`;
    if (this.pendingRequests.has(cacheKey)) {
      return this.pendingRequests.get(cacheKey);
    }
    if (this.cacheService.isTweetDataFresh(targetUserId, this.config.cacheHours / 2)) {
      const cachedTweets = this.cacheService.getTweets(targetUserId);
      if (cachedTweets && cachedTweets.length >= maxTweets) {
        this.updateCacheStats();
        return of(cachedTweets.slice(0, maxTweets));
      }
    }
    const request$ = this.fetchTweetsFromApi(targetUserId, maxTweets).pipe(tap((tweets) => {
      this.cacheService.cacheTweets(targetUserId, tweets);
      this.updateState({ tweets });
      this.pendingRequests.delete(cacheKey);
      this.updateCacheStats();
    }), catchError((error) => {
      this.pendingRequests.delete(cacheKey);
      this.handleError(error);
      const cachedTweets = this.cacheService.getTweets(targetUserId);
      return cachedTweets ? of(cachedTweets) : throwError(() => error);
    }), shareReplay(1));
    this.pendingRequests.set(cacheKey, request$);
    return request$;
  }
  /**
   * Refresh all Twitter data
   */
  refreshAll() {
    this.updateState({ loading: true, error: null });
    return this.getUserData().pipe(switchMap((user) => {
      if (!user) {
        throw new Error("User not found");
      }
      return this.getTweets(user.id).pipe(map((tweets) => ({ user, tweets })));
    }), tap(({ user, tweets }) => {
      this.updateState({
        loading: false,
        user,
        tweets,
        lastUpdate: /* @__PURE__ */ new Date()
      });
    }), catchError((error) => {
      this.updateState({ loading: false });
      this.handleError(error);
      return throwError(() => error);
    }));
  }
  /**
   * Create Twitter embed widget with optimized loading
   */
  createEmbedTimeline(containerId) {
    return new Promise((resolve, reject) => {
      if (!this.config.enableEmbedWidget) {
        reject(new Error("Embed widget disabled in configuration"));
        return;
      }
      if (window.twttr?.widgets) {
        this.createTimelineWidget(containerId).then(resolve).catch(reject);
        return;
      }
      const script = document.createElement("script");
      script.async = true;
      script.src = "https://platform.twitter.com/widgets.js";
      script.onload = () => {
        const checkTwitter = () => {
          if (window.twttr?.widgets) {
            this.createTimelineWidget(containerId).then(resolve).catch(reject);
          } else {
            setTimeout(checkTwitter, 100);
          }
        };
        checkTwitter();
      };
      script.onerror = () => reject(new Error("Failed to load Twitter widgets script"));
      document.head.appendChild(script);
    });
  }
  /**
   * Create the actual timeline widget
   */
  createTimelineWidget(containerId) {
    return new Promise((resolve, reject) => {
      const container = document.getElementById(containerId);
      if (!container) {
        reject(new Error(`Container ${containerId} not found`));
        return;
      }
      container.innerHTML = "";
      window.twttr.widgets.createTimeline({
        sourceType: "profile",
        screenName: this.config.username
      }, container, {
        height: 600,
        theme: "dark",
        chrome: "noheader nofooter noborders transparent",
        tweetLimit: this.config.maxTweets,
        related: false,
        lang: "en"
      }).then((widget) => {
        if (widget) {
          this.updateState({ embedLoaded: true });
          console.log("\u2705 Twitter embed timeline created successfully");
          resolve();
        } else {
          reject(new Error("Failed to create Twitter timeline"));
        }
      }).catch(reject);
    });
  }
  /**
   * Fetch user from API with optimized OAuth
   */
  fetchUserFromApi(username) {
    if (!this.credentials || !this.config.enableApiIntegration) {
      return throwError(() => new Error("API integration disabled or credentials missing"));
    }
    this.totalRequests++;
    this.apiCallCount++;
    const url = `https://api.x.com/2/users/by/username/${username}`;
    const queryParams = {
      "user.fields": "id,name,username,profile_image_url,verified,public_metrics"
    };
    return from(this.oauthService.createAuthenticatedHeaders("GET", url, queryParams, this.credentials)).pipe(switchMap((headers) => {
      const httpParams = new HttpParams({ fromObject: queryParams });
      return this.http.get(url, {
        headers,
        params: httpParams,
        observe: "response"
      }).pipe(map((response) => {
        const userData = response.body?.data;
        if (!userData)
          return null;
        return {
          id: userData.id,
          username: userData.username,
          displayName: userData.name,
          profileImageUrl: userData.profile_image_url,
          verified: userData.verified,
          followersCount: userData.public_metrics?.followers_count,
          tweetsCount: userData.public_metrics?.tweet_count
        };
      }), retry({
        count: 2,
        delay: (error, retryCount) => timer(Math.pow(2, retryCount) * 1e3)
        // Exponential backoff
      }));
    }));
  }
  /**
   * Fetch tweets from API with optimized OAuth
   */
  fetchTweetsFromApi(userId, maxResults) {
    if (!this.credentials || !this.config.enableApiIntegration) {
      return throwError(() => new Error("API integration disabled or credentials missing"));
    }
    this.totalRequests++;
    this.apiCallCount++;
    const url = `https://api.x.com/2/users/${userId}/tweets`;
    const queryParams = {
      "tweet.fields": "id,text,created_at,author_id,public_metrics",
      "max_results": Math.min(maxResults, 100).toString(),
      "exclude": "retweets"
    };
    return from(this.oauthService.createAuthenticatedHeaders("GET", url, queryParams, this.credentials)).pipe(switchMap((headers) => {
      const httpParams = new HttpParams({ fromObject: queryParams });
      return this.http.get(url, {
        headers,
        params: httpParams,
        observe: "response"
      }).pipe(map((response) => {
        const tweets = response.body?.data || [];
        return tweets.map((tweet) => ({
          id: tweet.id,
          text: tweet.text,
          authorId: tweet.author_id,
          createdAt: tweet.created_at,
          metrics: tweet.public_metrics ? {
            likes: tweet.public_metrics.like_count || 0,
            retweets: tweet.public_metrics.retweet_count || 0,
            replies: tweet.public_metrics.reply_count || 0
          } : void 0
        }));
      }), retry({
        count: 2,
        delay: (error, retryCount) => timer(Math.pow(2, retryCount) * 1e3)
      }));
    }));
  }
  /**
   * Handle errors with proper categorization
   */
  handleError(error) {
    this.errorCount++;
    let errorMessage = "Unknown error occurred";
    if (error instanceof HttpErrorResponse) {
      switch (error.status) {
        case 401:
          errorMessage = "Authentication failed - invalid credentials";
          break;
        case 403:
          errorMessage = "Access forbidden - check permissions";
          break;
        case 429:
          errorMessage = "Rate limit exceeded - using cached data";
          break;
        case 404:
          errorMessage = "User or content not found";
          break;
        default:
          errorMessage = `API error: ${error.message}`;
      }
    } else {
      errorMessage = error.message || "Unknown error";
    }
    console.error("\u274C Twitter service error:", errorMessage);
    this.updateState({ error: errorMessage });
  }
  /**
   * Update cache statistics
   */
  updateCacheStats() {
    const cacheStats = this.cacheService.getCurrentStats();
    this.updateState({ cacheHitRate: cacheStats.hitRate });
  }
  /**
   * Update service state
   */
  updateState(updates) {
    const currentState = this.stateSubject.value;
    this.stateSubject.next(__spreadValues(__spreadValues({}, currentState), updates));
  }
  /**
   * Perform periodic maintenance
   */
  performMaintenance() {
    const oauthStats = this.oauthService.getCacheStats();
    if (oauthStats.signatureCacheSize > 30) {
      console.log("\u{1F9F9} Cleaning OAuth signature cache...");
    }
    this.updateState({
      apiCallsUsed: this.apiCallCount
    });
  }
  /**
   * Get performance metrics
   */
  getPerformanceMetrics() {
    const currentTime = Date.now();
    const loadTime = currentTime - this.performanceStartTime;
    const cacheStats = this.cacheService.getCurrentStats();
    return {
      bundleSize: 245e3,
      // Estimated bundle size reduction in bytes
      memoryUsage: cacheStats.totalSize,
      cacheHitRate: cacheStats.hitRate,
      apiEfficiency: this.totalRequests > 0 ? (this.totalRequests - this.apiCallCount) / this.totalRequests * 100 : 0,
      loadTime,
      errorRate: this.totalRequests > 0 ? this.errorCount / this.totalRequests * 100 : 0
    };
  }
  /**
   * Clear all caches and reset state
   */
  clearCache() {
    this.cacheService.clearAll();
    this.oauthService.clearCaches();
    this.pendingRequests.clear();
    this.updateState({
      user: null,
      tweets: [],
      lastUpdate: null,
      cacheHitRate: 0
    });
    console.log("\u{1F5D1}\uFE0F All Twitter caches cleared");
  }
  /**
   * Get Twitter profile URL
   */
  getTwitterUrl() {
    return `https://twitter.com/${this.config.username}`;
  }
  /**
   * Get username
   */
  getUsername() {
    return this.config.username;
  }
  /**
   * Update configuration
   */
  updateConfig(newConfig) {
    Object.assign(this.config, newConfig);
    console.log("\u2699\uFE0F Twitter service configuration updated");
  }
};
_TwitterUnifiedOptimizedService.\u0275fac = function TwitterUnifiedOptimizedService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TwitterUnifiedOptimizedService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(TwitterOAuthOptimizedService), \u0275\u0275inject(TwitterCacheOptimizedService));
};
_TwitterUnifiedOptimizedService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _TwitterUnifiedOptimizedService, factory: _TwitterUnifiedOptimizedService.\u0275fac, providedIn: "root" });
var TwitterUnifiedOptimizedService = _TwitterUnifiedOptimizedService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TwitterUnifiedOptimizedService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }, { type: TwitterOAuthOptimizedService }, { type: TwitterCacheOptimizedService }], null);
})();

// src/app/components/twitter-optimized/twitter-optimized.component.ts
var _c0 = ["embedContainer"];
function TwitterOptimizedComponent_div_1_div_2_div_7_span_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 25)(1, "mat-icon", 26);
    \u0275\u0275text(2, "verified");
    \u0275\u0275elementEnd()();
  }
}
function TwitterOptimizedComponent_div_1_div_2_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21)(1, "span", 22)(2, "mat-icon", 23);
    \u0275\u0275text(3, "people");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275template(5, TwitterOptimizedComponent_div_1_div_2_div_7_span_5_Template, 3, 0, "span", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatNumber(ctx_r1.user().followersCount), " followers ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.user().verified);
  }
}
function TwitterOptimizedComponent_div_1_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 15)(1, "img", 16);
    \u0275\u0275listener("error", function TwitterOptimizedComponent_div_1_div_2_Template_img_error_1_listener($event) {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onImageError($event));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "div", 17)(3, "h3", 18);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 19);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(7, TwitterOptimizedComponent_div_1_div_2_div_7_Template, 6, 2, "div", 20);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx_r1.user().profileImageUrl, \u0275\u0275sanitizeUrl)("alt", ctx_r1.user().displayName);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.user().displayName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("@", ctx_r1.user().username);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.user().followersCount);
  }
}
function TwitterOptimizedComponent_div_1_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function TwitterOptimizedComponent_div_1_button_4_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onFollowClick());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "add");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Follow ");
    \u0275\u0275elementEnd();
  }
}
function TwitterOptimizedComponent_div_1_button_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 28);
    \u0275\u0275listener("click", function TwitterOptimizedComponent_div_1_button_5_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onRefreshClick());
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "refresh");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("disabled", ctx_r1.loading());
    \u0275\u0275attribute("aria-label", "Refresh tweets");
    \u0275\u0275advance();
    \u0275\u0275classProp("spinning", ctx_r1.loading());
  }
}
function TwitterOptimizedComponent_div_1_div_6_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "span", 31);
    \u0275\u0275text(2, "Updated:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 32);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r1.formatRelativeTime(ctx_r1.lastUpdate()));
  }
}
function TwitterOptimizedComponent_div_1_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 29)(1, "div", 30)(2, "span", 31);
    \u0275\u0275text(3, "Tweets:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 32);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 30)(7, "span", 31);
    \u0275\u0275text(8, "Cache Hit:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 32);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(11, TwitterOptimizedComponent_div_1_div_6_div_11_Template, 5, 1, "div", 33);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r1.tweets().length);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r1.cacheHitRate(), "%");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.lastUpdate());
  }
}
function TwitterOptimizedComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 9);
    \u0275\u0275template(2, TwitterOptimizedComponent_div_1_div_2_Template, 8, 5, "div", 10);
    \u0275\u0275elementStart(3, "div", 11);
    \u0275\u0275template(4, TwitterOptimizedComponent_div_1_button_4_Template, 4, 0, "button", 12)(5, TwitterOptimizedComponent_div_1_button_5_Template, 3, 4, "button", 13);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, TwitterOptimizedComponent_div_1_div_6_Template, 12, 3, "div", 14);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.user());
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx_r1.config.showFollowButton);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.config.showRefreshButton);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.config.showStats && ctx_r1.initialized());
  }
}
function TwitterOptimizedComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275element(1, "mat-progress-bar", 35);
    \u0275\u0275elementStart(2, "div", 36)(3, "mat-icon", 37);
    \u0275\u0275text(4, "hourglass_empty");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 38);
    \u0275\u0275text(6, "Loading tweets...");
    \u0275\u0275elementEnd()()();
  }
}
function TwitterOptimizedComponent_div_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 39)(1, "mat-icon", 40);
    \u0275\u0275text(2, "warning");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h4", 41);
    \u0275\u0275text(4, "Unable to load tweets");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 42);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "button", 43);
    \u0275\u0275listener("click", function TwitterOptimizedComponent_div_3_Template_button_click_7_listener() {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onRetryClick());
    });
    \u0275\u0275elementStart(8, "mat-icon");
    \u0275\u0275text(9, "refresh");
    \u0275\u0275elementEnd();
    \u0275\u0275text(10, " Try Again ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r1.error());
  }
}
function TwitterOptimizedComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 44, 0);
  }
  if (rf & 2) {
    \u0275\u0275styleProp("min-height", 400, "px");
  }
}
function TwitterOptimizedComponent_div_5_div_1_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54)(1, "span", 55)(2, "mat-icon", 56);
    \u0275\u0275text(3, "favorite_border");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 55)(6, "mat-icon", 56);
    \u0275\u0275text(7, "repeat");
    \u0275\u0275elementEnd();
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 55)(10, "mat-icon", 56);
    \u0275\u0275text(11, "chat_bubble_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tweet_r6 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatNumber(tweet_r6.metrics.likes), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatNumber(tweet_r6.metrics.retweets), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", ctx_r1.formatNumber(tweet_r6.metrics.replies), " ");
  }
}
function TwitterOptimizedComponent_div_5_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 48)(1, "div", 49);
    \u0275\u0275element(2, "p", 50);
    \u0275\u0275elementStart(3, "div", 51)(4, "span", 52);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, TwitterOptimizedComponent_div_5_div_1_div_6_Template, 13, 3, "div", 53);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const tweet_r6 = ctx.$implicit;
    const i_r7 = ctx.index;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275styleProp("animation-delay", i_r7 * 100, "ms");
    \u0275\u0275classProp("fadeInUp", true);
    \u0275\u0275advance(2);
    \u0275\u0275property("innerHTML", ctx_r1.formatTweetText(tweet_r6.text), \u0275\u0275sanitizeHtml);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.formatTweetDate(tweet_r6.createdAt));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", tweet_r6.metrics);
  }
}
function TwitterOptimizedComponent_div_5_div_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r8 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 57)(1, "button", 58);
    \u0275\u0275listener("click", function TwitterOptimizedComponent_div_5_div_2_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r8);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.loadMoreTweets());
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "expand_more");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " Load More Tweets ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r1.loading());
  }
}
function TwitterOptimizedComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275template(1, TwitterOptimizedComponent_div_5_div_1_Template, 7, 7, "div", 46)(2, TwitterOptimizedComponent_div_5_div_2_Template, 5, 1, "div", 47);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("max-height", ctx_r1.config.maxHeight ? ctx_r1.config.maxHeight - 200 : 400, "px");
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.visibleTweets())("ngForTrackBy", ctx_r1.trackByTweetId);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasMoreTweets());
  }
}
function TwitterOptimizedComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 59)(1, "a", 60)(2, "mat-icon");
    \u0275\u0275text(3, "open_in_new");
    \u0275\u0275elementEnd();
    \u0275\u0275text(4, " View Full Profile ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("href", ctx_r1.twitterUrl(), \u0275\u0275sanitizeUrl);
  }
}
var _TwitterOptimizedComponent = class _TwitterOptimizedComponent {
  constructor() {
    this.config = {
      showHeader: true,
      showFollowButton: true,
      showRefreshButton: true,
      showStats: false,
      maxHeight: 600,
      autoRefresh: false,
      refreshInterval: 3e5,
      // 5 minutes
      enableVirtualScrolling: false,
      loadThreshold: 10
    };
    this.userClick = new EventEmitter();
    this.tweetClick = new EventEmitter();
    this.followClick = new EventEmitter();
    this.refreshComplete = new EventEmitter();
    this.twitterService = inject(TwitterUnifiedOptimizedService);
    this.cdr = inject(ChangeDetectorRef);
    this.ngZone = inject(NgZone);
    this.subscriptions = /* @__PURE__ */ new Set();
    this.visibleTweetCount = signal(10, ...ngDevMode ? [{ debugName: "visibleTweetCount" }] : []);
    this.hasInitialLoad = signal(false, ...ngDevMode ? [{ debugName: "hasInitialLoad" }] : []);
    this.loading = computed(() => this.twitterService.loading(), ...ngDevMode ? [{ debugName: "loading" }] : []);
    this.error = computed(() => this.twitterService.error(), ...ngDevMode ? [{ debugName: "error" }] : []);
    this.user = computed(() => this.twitterService.user(), ...ngDevMode ? [{ debugName: "user" }] : []);
    this.tweets = computed(() => this.twitterService.tweets(), ...ngDevMode ? [{ debugName: "tweets" }] : []);
    this.embedLoaded = computed(() => this.twitterService.embedLoaded(), ...ngDevMode ? [{ debugName: "embedLoaded" }] : []);
    this.initialized = computed(() => this.twitterService.initialized(), ...ngDevMode ? [{ debugName: "initialized" }] : []);
    this.visibleTweets = computed(() => this.tweets().slice(0, this.visibleTweetCount()), ...ngDevMode ? [{ debugName: "visibleTweets" }] : []);
    this.hasMoreTweets = computed(() => this.tweets().length > this.visibleTweetCount(), ...ngDevMode ? [{ debugName: "hasMoreTweets" }] : []);
    this.cacheHitRate = computed(() => {
      const metrics = this.twitterService.getPerformanceMetrics();
      return Math.round(metrics.cacheHitRate);
    }, ...ngDevMode ? [{ debugName: "cacheHitRate" }] : []);
    this.lastUpdate = computed(() => this.twitterService.state().lastUpdate, ...ngDevMode ? [{ debugName: "lastUpdate" }] : []);
    this.twitterUrl = computed(() => this.twitterService.getTwitterUrl(), ...ngDevMode ? [{ debugName: "twitterUrl" }] : []);
    effect(() => {
      if (this.initialized() && !this.embedLoaded() && this.embedContainer) {
        this.initializeEmbed();
      }
    });
    effect(() => {
      if (this.config.autoRefresh && this.initialized()) {
        this.startAutoRefresh();
      } else {
        this.stopAutoRefresh();
      }
    });
  }
  ngOnInit() {
    console.log("\u{1F426} Twitter Optimized Component initialized");
    this.setupIntersectionObserver();
    this.setupResizeListener();
    if (this.initialized()) {
      this.loadInitialData();
    } else {
      const initSub = this.twitterService.stateObservable.subscribe((state) => {
        if (state.initialized && !this.hasInitialLoad()) {
          this.loadInitialData();
          this.hasInitialLoad.set(true);
        }
      });
      this.subscriptions.add(initSub);
    }
  }
  ngOnDestroy() {
    console.log("\u{1F9F9} Cleaning up Twitter Optimized Component");
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
    this.intersectionObserver?.disconnect();
    this.stopAutoRefresh();
    this.cleanupEventListeners();
  }
  /**
   * Load initial data with error handling
   */
  loadInitialData() {
    const refreshSub = this.twitterService.refreshAll().subscribe({
      next: (data) => {
        console.log("\u2705 Initial Twitter data loaded", data);
        this.refreshComplete.emit(data);
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error("\u274C Failed to load initial Twitter data:", error);
        this.cdr.markForCheck();
      }
    });
    this.subscriptions.add(refreshSub);
  }
  /**
   * Initialize Twitter embed with lazy loading
   */
  initializeEmbed() {
    return __async(this, null, function* () {
      if (!this.embedContainer?.nativeElement) {
        return;
      }
      try {
        yield this.twitterService.createEmbedTimeline(this.embedContainer.nativeElement.id || "twitter-embed-" + Math.random().toString(36).substr(2, 9));
        console.log("\u2705 Twitter embed initialized");
        this.cdr.markForCheck();
      } catch (error) {
        console.warn("\u26A0\uFE0F Twitter embed failed, using fallback:", error);
        this.cdr.markForCheck();
      }
    });
  }
  /**
   * Setup intersection observer for performance optimization
   */
  setupIntersectionObserver() {
    if (typeof IntersectionObserver === "undefined") {
      return;
    }
    this.intersectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.cdr.markForCheck();
        }
      });
    }, { threshold: 0.1 });
  }
  /**
   * Setup resize listener with debouncing
   */
  setupResizeListener() {
    const resizeSub = fromEvent(window, "resize").pipe(debounceTime(250), distinctUntilChanged()).subscribe(() => {
      this.ngZone.run(() => {
        this.cdr.markForCheck();
      });
    });
    this.subscriptions.add(resizeSub);
  }
  /**
   * Start auto-refresh timer
   */
  startAutoRefresh() {
    if (this.autoRefreshTimer) {
      return;
    }
    this.autoRefreshTimer = window.setInterval(() => {
      if (!this.loading()) {
        this.onRefreshClick();
      }
    }, this.config.refreshInterval);
  }
  /**
   * Stop auto-refresh timer
   */
  stopAutoRefresh() {
    if (this.autoRefreshTimer) {
      clearInterval(this.autoRefreshTimer);
      this.autoRefreshTimer = void 0;
    }
  }
  /**
   * Clean up event listeners
   */
  cleanupEventListeners() {
  }
  // Event Handlers
  onFollowClick() {
    window.open(this.twitterUrl(), "_blank", "noopener,noreferrer");
    this.followClick.emit();
  }
  onRefreshClick() {
    const refreshSub = this.twitterService.refreshAll().subscribe({
      next: (data) => {
        this.refreshComplete.emit(data);
        console.log("\u2705 Twitter data refreshed");
      },
      error: (error) => {
        console.error("\u274C Refresh failed:", error);
      }
    });
    this.subscriptions.add(refreshSub);
  }
  onRetryClick() {
    this.loadInitialData();
  }
  loadMoreTweets() {
    const currentCount = this.visibleTweetCount();
    const increment = this.config.loadThreshold || 10;
    this.visibleTweetCount.set(Math.min(currentCount + increment, this.tweets().length));
    this.cdr.markForCheck();
  }
  onImageError(event) {
    const img = event.target;
    img.style.display = "none";
  }
  // Utility Methods
  trackByTweetId(index, tweet) {
    return tweet.id;
  }
  formatNumber(num) {
    if (num >= 1e6) {
      return (num / 1e6).toFixed(1) + "M";
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1) + "K";
    }
    return num.toString();
  }
  formatTweetDate(dateString) {
    const date = new Date(dateString);
    const now = /* @__PURE__ */ new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffHours = Math.floor(diffTime / (1e3 * 60 * 60));
    const diffDays = Math.floor(diffTime / (1e3 * 60 * 60 * 24));
    if (diffDays > 7) {
      return date.toLocaleDateString();
    } else if (diffDays > 0) {
      return `${diffDays}d`;
    } else if (diffHours > 0) {
      return `${diffHours}h`;
    } else {
      return "now";
    }
  }
  formatRelativeTime(date) {
    const now = /* @__PURE__ */ new Date();
    const diffMinutes = Math.floor((now.getTime() - date.getTime()) / (1e3 * 60));
    if (diffMinutes < 1)
      return "just now";
    if (diffMinutes < 60)
      return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
      return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
  formatTweetText(text) {
    return text.replace(/#(\w+)/g, '<span class="hashtag">#$1</span>').replace(/@(\w+)/g, '<span class="mention">@$1</span>').replace(/(https?:\/\/[^\s]+)/g, '<a href="$1" target="_blank" rel="noopener noreferrer" class="tweet-link">$1</a>');
  }
};
_TwitterOptimizedComponent.\u0275fac = function TwitterOptimizedComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TwitterOptimizedComponent)();
};
_TwitterOptimizedComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TwitterOptimizedComponent, selectors: [["app-twitter-optimized"]], viewQuery: function TwitterOptimizedComponent_Query(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275viewQuery(_c0, 5);
  }
  if (rf & 2) {
    let _t;
    \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.embedContainer = _t.first);
  }
}, inputs: { config: "config" }, outputs: { userClick: "userClick", tweetClick: "tweetClick", followClick: "followClick", refreshComplete: "refreshComplete" }, decls: 7, vars: 12, consts: [["embedContainer", ""], [1, "twitter-container"], ["class", "twitter-header", 4, "ngIf"], ["class", "loading-container", 4, "ngIf"], ["class", "error-container", 4, "ngIf"], ["class", "embed-container", 3, "min-height", 4, "ngIf"], ["class", "tweet-list", 3, "max-height", 4, "ngIf"], ["class", "twitter-footer", 4, "ngIf"], [1, "twitter-header"], [1, "header-info"], ["class", "profile-section", 4, "ngIf"], [1, "header-actions"], ["mat-button", "", "class", "follow-btn", "type", "button", 3, "click", 4, "ngIf"], ["mat-icon-button", "", "class", "refresh-btn", "type", "button", 3, "disabled", "click", 4, "ngIf"], ["class", "stats-bar", 4, "ngIf"], [1, "profile-section"], ["loading", "lazy", 1, "profile-image", 3, "error", "src", "alt"], [1, "profile-details"], [1, "display-name"], [1, "username"], ["class", "metrics", 4, "ngIf"], [1, "metrics"], [1, "metric"], [1, "metric-icon"], ["class", "verified", 4, "ngIf"], [1, "verified"], [1, "verified-icon"], ["mat-button", "", "type", "button", 1, "follow-btn", 3, "click"], ["mat-icon-button", "", "type", "button", 1, "refresh-btn", 3, "click", "disabled"], [1, "stats-bar"], [1, "stat"], [1, "stat-label"], [1, "stat-value"], ["class", "stat", 4, "ngIf"], [1, "loading-container"], ["mode", "indeterminate", 1, "progress-bar"], [1, "loading-content"], [1, "loading-icon"], [1, "loading-text"], [1, "error-container"], [1, "error-icon"], [1, "error-title"], [1, "error-message"], ["mat-button", "", "type", "button", 1, "retry-btn", 3, "click"], [1, "embed-container"], [1, "tweet-list"], ["class", "tweet-item", 3, "fadeInUp", "animation-delay", 4, "ngFor", "ngForOf", "ngForTrackBy"], ["class", "load-more", 4, "ngIf"], [1, "tweet-item"], [1, "tweet-content"], [1, "tweet-text", 3, "innerHTML"], [1, "tweet-meta"], [1, "tweet-date"], ["class", "tweet-actions", 4, "ngIf"], [1, "tweet-actions"], [1, "action-item"], [1, "action-icon"], [1, "load-more"], ["mat-button", "", 1, "load-more-btn", 3, "click", "disabled"], [1, "twitter-footer"], ["target", "_blank", "rel", "noopener noreferrer", 1, "view-profile-link", 3, "href"]], template: function TwitterOptimizedComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275template(1, TwitterOptimizedComponent_div_1_Template, 7, 4, "div", 2)(2, TwitterOptimizedComponent_div_2_Template, 7, 0, "div", 3)(3, TwitterOptimizedComponent_div_3_Template, 11, 1, "div", 4)(4, TwitterOptimizedComponent_div_4_Template, 2, 2, "div", 5)(5, TwitterOptimizedComponent_div_5_Template, 3, 5, "div", 6)(6, TwitterOptimizedComponent_div_6_Template, 5, 1, "div", 7);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275styleProp("max-height", ctx.config.maxHeight, "px");
    \u0275\u0275classProp("loading", ctx.loading())("error", !!ctx.error());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.config.showHeader);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.loading() && ctx.tweets().length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.error() && ctx.tweets().length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.error() || ctx.tweets().length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.tweets().length > 0 && !ctx.embedLoaded());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.loading() || ctx.tweets().length > 0);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, MatIconModule, MatIcon, MatButtonModule, MatButton, MatIconButton, MatProgressBarModule, MatProgressBar], styles: ["\n\n.twitter-container[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  background: var(--surface-color, #ffffff);\n  border-radius: 12px;\n  border: 1px solid var(--border-color, #e1e8ed);\n  overflow: hidden;\n  transition: box-shadow 0.2s ease-in-out;\n  will-change: transform;\n}\n.twitter-container[_ngcontent-%COMP%]:hover {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.twitter-container.loading[_ngcontent-%COMP%]   .twitter-header[_ngcontent-%COMP%] {\n  opacity: 0.7;\n}\n.twitter-container.error[_ngcontent-%COMP%] {\n  border-color: var(--error-color, #e74c3c);\n}\n.twitter-header[_ngcontent-%COMP%] {\n  padding: 16px;\n  border-bottom: 1px solid var(--border-color, #e1e8ed);\n  background: var(--header-bg, #f8f9fa);\n}\n.twitter-header[_ngcontent-%COMP%]   .header-info[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 12px;\n}\n.twitter-header[_ngcontent-%COMP%]   .profile-section[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 12px;\n  flex: 1;\n}\n.twitter-header[_ngcontent-%COMP%]   .profile-image[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  object-fit: cover;\n  background: var(--skeleton-color, #f0f0f0);\n  flex-shrink: 0;\n}\n.twitter-header[_ngcontent-%COMP%]   .profile-details[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n}\n.twitter-header[_ngcontent-%COMP%]   .display-name[_ngcontent-%COMP%] {\n  margin: 0 0 4px 0;\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--text-primary, #14171a);\n  line-height: 1.2;\n}\n.twitter-header[_ngcontent-%COMP%]   .username[_ngcontent-%COMP%] {\n  margin: 0 0 8px 0;\n  font-size: 14px;\n  color: var(--text-secondary, #657786);\n  line-height: 1.2;\n}\n.twitter-header[_ngcontent-%COMP%]   .metrics[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  font-size: 12px;\n  color: var(--text-secondary, #657786);\n}\n.twitter-header[_ngcontent-%COMP%]   .metric[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.twitter-header[_ngcontent-%COMP%]   .metric[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n}\n.twitter-header[_ngcontent-%COMP%]   .verified[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n}\n.twitter-header[_ngcontent-%COMP%]   .verified[_ngcontent-%COMP%]   .verified-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: var(--verified-color, #1da1f2);\n}\n.twitter-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 8px;\n  flex-shrink: 0;\n}\n.twitter-header[_ngcontent-%COMP%]   .follow-btn[_ngcontent-%COMP%] {\n  background: var(--primary-color, #1da1f2);\n  color: white;\n  border-radius: 20px;\n  padding: 6px 16px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.twitter-header[_ngcontent-%COMP%]   .follow-btn[_ngcontent-%COMP%]:hover {\n  background: var(--primary-hover, #0d8bd9);\n}\n.twitter-header[_ngcontent-%COMP%]   .refresh-btn[_ngcontent-%COMP%] {\n  color: var(--text-secondary, #657786);\n}\n.twitter-header[_ngcontent-%COMP%]   .refresh-btn[_ngcontent-%COMP%]:hover {\n  background: var(--hover-bg, rgba(0, 0, 0, 0.05));\n}\n.twitter-header[_ngcontent-%COMP%]   .refresh-btn[_ngcontent-%COMP%]   .spinning[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n.stats-bar[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n  padding: 12px 16px 0;\n  font-size: 12px;\n}\n.stats-bar[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 4px;\n  align-items: center;\n}\n.stats-bar[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  color: var(--text-secondary, #657786);\n  font-weight: 500;\n}\n.stats-bar[_ngcontent-%COMP%]   .stat-value[_ngcontent-%COMP%] {\n  color: var(--text-primary, #14171a);\n  font-weight: 600;\n}\n.loading-container[_ngcontent-%COMP%] {\n  padding: 24px;\n  text-align: center;\n}\n.loading-container[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%] {\n  margin-bottom: 16px;\n  border-radius: 2px;\n}\n.loading-container[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.loading-container[_ngcontent-%COMP%]   .loading-icon[_ngcontent-%COMP%] {\n  font-size: 32px;\n  width: 32px;\n  height: 32px;\n  color: var(--text-secondary, #657786);\n  animation: _ngcontent-%COMP%_pulse 1.5s ease-in-out infinite;\n}\n.loading-container[_ngcontent-%COMP%]   .loading-text[_ngcontent-%COMP%] {\n  margin: 0;\n  color: var(--text-secondary, #657786);\n  font-size: 14px;\n}\n.error-container[_ngcontent-%COMP%] {\n  padding: 24px;\n  text-align: center;\n}\n.error-container[_ngcontent-%COMP%]   .error-icon[_ngcontent-%COMP%] {\n  font-size: 32px;\n  width: 32px;\n  height: 32px;\n  color: var(--error-color, #e74c3c);\n  margin-bottom: 12px;\n}\n.error-container[_ngcontent-%COMP%]   .error-title[_ngcontent-%COMP%] {\n  margin: 0 0 8px 0;\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--text-primary, #14171a);\n}\n.error-container[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%] {\n  margin: 0 0 16px 0;\n  font-size: 14px;\n  color: var(--text-secondary, #657786);\n  line-height: 1.4;\n}\n.error-container[_ngcontent-%COMP%]   .retry-btn[_ngcontent-%COMP%] {\n  background: var(--error-color, #e74c3c);\n  color: white;\n  border-radius: 20px;\n}\n.error-container[_ngcontent-%COMP%]   .retry-btn[_ngcontent-%COMP%]:hover {\n  background: var(--error-hover, #c0392b);\n}\n.embed-container[_ngcontent-%COMP%] {\n  position: relative;\n  background: var(--embed-bg, #ffffff);\n}\n.embed-container[_ngcontent-%COMP%]   iframe[_ngcontent-%COMP%] {\n  border: none !important;\n  max-width: 100% !important;\n}\n.tweet-list[_ngcontent-%COMP%] {\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: var(--scrollbar-thumb, #ccd6dd) var(--scrollbar-track, transparent);\n}\n.tweet-list[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 6px;\n}\n.tweet-list[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.tweet-list[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background-color: var(--scrollbar-thumb, #ccd6dd);\n  border-radius: 3px;\n}\n.tweet-item[_ngcontent-%COMP%] {\n  padding: 16px;\n  border-bottom: 1px solid var(--border-color, #e1e8ed);\n  transition: background-color 0.2s ease-in-out;\n}\n.tweet-item[_ngcontent-%COMP%]:hover {\n  background: var(--hover-bg, rgba(0, 0, 0, 0.02));\n}\n.tweet-item[_ngcontent-%COMP%]:last-child {\n  border-bottom: none;\n}\n.tweet-item.fadeInUp[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeInUp 0.4s ease-out forwards;\n}\n.tweet-content[_ngcontent-%COMP%]   .tweet-text[_ngcontent-%COMP%] {\n  margin: 0 0 12px 0;\n  font-size: 14px;\n  line-height: 1.5;\n  color: var(--text-primary, #14171a);\n  word-wrap: break-word;\n}\n.tweet-content[_ngcontent-%COMP%]   .tweet-text[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:global(.hashtag) {\n  color: var(--primary-color, #1da1f2);\n  font-weight: 500;\n}\n.tweet-content[_ngcontent-%COMP%]   .tweet-text[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:global(.mention) {\n  color: var(--primary-color, #1da1f2);\n  font-weight: 500;\n}\n.tweet-content[_ngcontent-%COMP%]   .tweet-text[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:global(.tweet-link) {\n  color: var(--primary-color, #1da1f2);\n  text-decoration: none;\n}\n.tweet-content[_ngcontent-%COMP%]   .tweet-text[_ngcontent-%COMP%]   [_ngcontent-%COMP%]:global(.tweet-link):hover {\n  text-decoration: underline;\n}\n.tweet-meta[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-size: 12px;\n  color: var(--text-secondary, #657786);\n}\n.tweet-meta[_ngcontent-%COMP%]   .tweet-date[_ngcontent-%COMP%] {\n  font-weight: 500;\n}\n.tweet-meta[_ngcontent-%COMP%]   .tweet-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 16px;\n}\n.tweet-meta[_ngcontent-%COMP%]   .action-item[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  cursor: pointer;\n  transition: color 0.2s ease-in-out;\n}\n.tweet-meta[_ngcontent-%COMP%]   .action-item[_ngcontent-%COMP%]:hover {\n  color: var(--text-primary, #14171a);\n}\n.tweet-meta[_ngcontent-%COMP%]   .action-item[_ngcontent-%COMP%]   .action-icon[_ngcontent-%COMP%] {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n}\n.load-more[_ngcontent-%COMP%] {\n  padding: 16px;\n  text-align: center;\n  border-top: 1px solid var(--border-color, #e1e8ed);\n}\n.load-more[_ngcontent-%COMP%]   .load-more-btn[_ngcontent-%COMP%] {\n  color: var(--primary-color, #1da1f2);\n  border: 1px solid var(--primary-color, #1da1f2);\n  border-radius: 20px;\n  padding: 8px 20px;\n}\n.load-more[_ngcontent-%COMP%]   .load-more-btn[_ngcontent-%COMP%]:hover {\n  background: var(--primary-color, #1da1f2);\n  color: white;\n}\n.load-more[_ngcontent-%COMP%]   .load-more-btn[_ngcontent-%COMP%]:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.twitter-footer[_ngcontent-%COMP%] {\n  padding: 12px 16px;\n  border-top: 1px solid var(--border-color, #e1e8ed);\n  background: var(--footer-bg, #f8f9fa);\n}\n.twitter-footer[_ngcontent-%COMP%]   .view-profile-link[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--text-secondary, #657786);\n  text-decoration: none;\n  transition: color 0.2s ease-in-out;\n}\n.twitter-footer[_ngcontent-%COMP%]   .view-profile-link[_ngcontent-%COMP%]:hover {\n  color: var(--primary-color, #1da1f2);\n}\n.twitter-footer[_ngcontent-%COMP%]   .view-profile-link[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 768px) {\n  .twitter-header[_ngcontent-%COMP%]   .header-info[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 16px;\n  }\n  .twitter-header[_ngcontent-%COMP%]   .header-actions[_ngcontent-%COMP%] {\n    align-self: stretch;\n    justify-content: space-between;\n  }\n  .stats-bar[_ngcontent-%COMP%] {\n    flex-wrap: wrap;\n    gap: 12px;\n  }\n  .tweet-meta[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 8px;\n  }\n}\n@media (max-width: 480px) {\n  .twitter-container[_ngcontent-%COMP%] {\n    border-radius: 8px;\n  }\n  .twitter-header[_ngcontent-%COMP%], \n   .tweet-item[_ngcontent-%COMP%], \n   .load-more[_ngcontent-%COMP%] {\n    padding: 12px;\n  }\n  .profile-image[_ngcontent-%COMP%] {\n    width: 40px;\n    height: 40px;\n  }\n  .display-name[_ngcontent-%COMP%] {\n    font-size: 15px;\n  }\n  .username[_ngcontent-%COMP%] {\n    font-size: 13px;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .twitter-container[_ngcontent-%COMP%] {\n    --surface-color: #1a1a1a;\n    --border-color: #333333;\n    --header-bg: #2a2a2a;\n    --footer-bg: #2a2a2a;\n    --text-primary: #ffffff;\n    --text-secondary: #8899a6;\n    --hover-bg: rgba(255, 255, 255, 0.03);\n    --skeleton-color: #333333;\n    --embed-bg: #1a1a1a;\n    --scrollbar-thumb: #555555;\n  }\n}\n@media (prefers-contrast: high) {\n  .twitter-container[_ngcontent-%COMP%] {\n    border: 2px solid;\n  }\n  .tweet-item[_ngcontent-%COMP%] {\n    border-bottom-width: 2px;\n  }\n  .action-item[_ngcontent-%COMP%]:hover {\n    background: var(--hover-bg);\n    border-radius: 4px;\n    padding: 2px 4px;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  *[_ngcontent-%COMP%] {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n  .spinning[_ngcontent-%COMP%] {\n    animation: none !important;\n  }\n}\n/*# sourceMappingURL=twitter-optimized.component.css.map */"], changeDetection: 0 });
var TwitterOptimizedComponent = _TwitterOptimizedComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TwitterOptimizedComponent, [{
    type: Component,
    args: [{ selector: "app-twitter-optimized", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      MatButtonModule,
      MatProgressBarModule
    ], template: `
    <div class="twitter-container"
         [class.loading]="loading()"
         [class.error]="!!error()"
         [style.max-height.px]="config.maxHeight">

      <!-- Header Section -->
      <div class="twitter-header" *ngIf="config.showHeader">
        <div class="header-info">
          <div class="profile-section" *ngIf="user()">
            <img [src]="user()!.profileImageUrl"
                 [alt]="user()!.displayName"
                 class="profile-image"
                 loading="lazy"
                 (error)="onImageError($event)">
            <div class="profile-details">
              <h3 class="display-name">{{ user()!.displayName }}</h3>
              <p class="username">@{{ user()!.username }}</p>
              <div class="metrics" *ngIf="user()!.followersCount">
                <span class="metric">
                  <mat-icon class="metric-icon">people</mat-icon>
                  {{ formatNumber(user()!.followersCount!) }} followers
                </span>
                <span class="verified" *ngIf="user()!.verified">
                  <mat-icon class="verified-icon">verified</mat-icon>
                </span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="header-actions">
            <button mat-button
                    class="follow-btn"
                    *ngIf="config.showFollowButton"
                    (click)="onFollowClick()"
                    type="button">
              <mat-icon>add</mat-icon>
              Follow
            </button>

            <button mat-icon-button
                    class="refresh-btn"
                    *ngIf="config.showRefreshButton"
                    [disabled]="loading()"
                    (click)="onRefreshClick()"
                    type="button"
                    [attr.aria-label]="'Refresh tweets'">
              <mat-icon [class.spinning]="loading()">refresh</mat-icon>
            </button>
          </div>
        </div>

        <!-- Stats Bar -->
        <div class="stats-bar" *ngIf="config.showStats && initialized()">
          <div class="stat">
            <span class="stat-label">Tweets:</span>
            <span class="stat-value">{{ tweets().length }}</span>
          </div>
          <div class="stat">
            <span class="stat-label">Cache Hit:</span>
            <span class="stat-value">{{ cacheHitRate() }}%</span>
          </div>
          <div class="stat" *ngIf="lastUpdate()">
            <span class="stat-label">Updated:</span>
            <span class="stat-value">{{ formatRelativeTime(lastUpdate()!) }}</span>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div class="loading-container" *ngIf="loading() && tweets().length === 0">
        <mat-progress-bar mode="indeterminate" class="progress-bar"></mat-progress-bar>
        <div class="loading-content">
          <mat-icon class="loading-icon">hourglass_empty</mat-icon>
          <p class="loading-text">Loading tweets...</p>
        </div>
      </div>

      <!-- Error State -->
      <div class="error-container" *ngIf="error() && tweets().length === 0">
        <mat-icon class="error-icon">warning</mat-icon>
        <h4 class="error-title">Unable to load tweets</h4>
        <p class="error-message">{{ error() }}</p>
        <button mat-button
                class="retry-btn"
                (click)="onRetryClick()"
                type="button">
          <mat-icon>refresh</mat-icon>
          Try Again
        </button>
      </div>

      <!-- Twitter Embed Container -->
      <div #embedContainer
           class="embed-container"
           *ngIf="!error() || tweets().length > 0"
           [style.min-height.px]="400">
      </div>

      <!-- Custom Tweet List (Fallback) -->
      <div class="tweet-list"
           *ngIf="tweets().length > 0 && !embedLoaded()"
           [style.max-height.px]="config.maxHeight ? config.maxHeight - 200 : 400">

        <div class="tweet-item"
             *ngFor="let tweet of visibleTweets(); trackBy: trackByTweetId; index as i"
             [class.fadeInUp]="true"
             [style.animation-delay.ms]="i * 100">

          <div class="tweet-content">
            <p class="tweet-text" [innerHTML]="formatTweetText(tweet.text)"></p>

            <div class="tweet-meta">
              <span class="tweet-date">{{ formatTweetDate(tweet.createdAt) }}</span>

              <div class="tweet-actions" *ngIf="tweet.metrics">
                <span class="action-item">
                  <mat-icon class="action-icon">favorite_border</mat-icon>
                  {{ formatNumber(tweet.metrics.likes) }}
                </span>
                <span class="action-item">
                  <mat-icon class="action-icon">repeat</mat-icon>
                  {{ formatNumber(tweet.metrics.retweets) }}
                </span>
                <span class="action-item">
                  <mat-icon class="action-icon">chat_bubble_outline</mat-icon>
                  {{ formatNumber(tweet.metrics.replies) }}
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- Load More Button -->
        <div class="load-more" *ngIf="hasMoreTweets()">
          <button mat-button
                  class="load-more-btn"
                  (click)="loadMoreTweets()"
                  [disabled]="loading()">
            <mat-icon>expand_more</mat-icon>
            Load More Tweets
          </button>
        </div>
      </div>

      <!-- Footer -->
      <div class="twitter-footer" *ngIf="!loading() || tweets().length > 0">
        <a [href]="twitterUrl()"
           target="_blank"
           rel="noopener noreferrer"
           class="view-profile-link">
          <mat-icon>open_in_new</mat-icon>
          View Full Profile
        </a>
      </div>
    </div>
  `, changeDetection: ChangeDetectionStrategy.OnPush, styles: ["/* src/app/components/twitter-optimized/twitter-optimized.component.scss */\n.twitter-container {\n  display: flex;\n  flex-direction: column;\n  background: var(--surface-color, #ffffff);\n  border-radius: 12px;\n  border: 1px solid var(--border-color, #e1e8ed);\n  overflow: hidden;\n  transition: box-shadow 0.2s ease-in-out;\n  will-change: transform;\n}\n.twitter-container:hover {\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);\n}\n.twitter-container.loading .twitter-header {\n  opacity: 0.7;\n}\n.twitter-container.error {\n  border-color: var(--error-color, #e74c3c);\n}\n.twitter-header {\n  padding: 16px;\n  border-bottom: 1px solid var(--border-color, #e1e8ed);\n  background: var(--header-bg, #f8f9fa);\n}\n.twitter-header .header-info {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  gap: 12px;\n}\n.twitter-header .profile-section {\n  display: flex;\n  gap: 12px;\n  flex: 1;\n}\n.twitter-header .profile-image {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  object-fit: cover;\n  background: var(--skeleton-color, #f0f0f0);\n  flex-shrink: 0;\n}\n.twitter-header .profile-details {\n  flex: 1;\n  min-width: 0;\n}\n.twitter-header .display-name {\n  margin: 0 0 4px 0;\n  font-size: 16px;\n  font-weight: 700;\n  color: var(--text-primary, #14171a);\n  line-height: 1.2;\n}\n.twitter-header .username {\n  margin: 0 0 8px 0;\n  font-size: 14px;\n  color: var(--text-secondary, #657786);\n  line-height: 1.2;\n}\n.twitter-header .metrics {\n  display: flex;\n  align-items: center;\n  gap: 12px;\n  font-size: 12px;\n  color: var(--text-secondary, #657786);\n}\n.twitter-header .metric {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n}\n.twitter-header .metric .metric-icon {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n}\n.twitter-header .verified {\n  display: flex;\n  align-items: center;\n}\n.twitter-header .verified .verified-icon {\n  font-size: 16px;\n  width: 16px;\n  height: 16px;\n  color: var(--verified-color, #1da1f2);\n}\n.twitter-header .header-actions {\n  display: flex;\n  gap: 8px;\n  flex-shrink: 0;\n}\n.twitter-header .follow-btn {\n  background: var(--primary-color, #1da1f2);\n  color: white;\n  border-radius: 20px;\n  padding: 6px 16px;\n  font-size: 14px;\n  font-weight: 600;\n}\n.twitter-header .follow-btn:hover {\n  background: var(--primary-hover, #0d8bd9);\n}\n.twitter-header .refresh-btn {\n  color: var(--text-secondary, #657786);\n}\n.twitter-header .refresh-btn:hover {\n  background: var(--hover-bg, rgba(0, 0, 0, 0.05));\n}\n.twitter-header .refresh-btn .spinning {\n  animation: spin 1s linear infinite;\n}\n.stats-bar {\n  display: flex;\n  gap: 16px;\n  padding: 12px 16px 0;\n  font-size: 12px;\n}\n.stats-bar .stat {\n  display: flex;\n  gap: 4px;\n  align-items: center;\n}\n.stats-bar .stat-label {\n  color: var(--text-secondary, #657786);\n  font-weight: 500;\n}\n.stats-bar .stat-value {\n  color: var(--text-primary, #14171a);\n  font-weight: 600;\n}\n.loading-container {\n  padding: 24px;\n  text-align: center;\n}\n.loading-container .progress-bar {\n  margin-bottom: 16px;\n  border-radius: 2px;\n}\n.loading-container .loading-content {\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 8px;\n}\n.loading-container .loading-icon {\n  font-size: 32px;\n  width: 32px;\n  height: 32px;\n  color: var(--text-secondary, #657786);\n  animation: pulse 1.5s ease-in-out infinite;\n}\n.loading-container .loading-text {\n  margin: 0;\n  color: var(--text-secondary, #657786);\n  font-size: 14px;\n}\n.error-container {\n  padding: 24px;\n  text-align: center;\n}\n.error-container .error-icon {\n  font-size: 32px;\n  width: 32px;\n  height: 32px;\n  color: var(--error-color, #e74c3c);\n  margin-bottom: 12px;\n}\n.error-container .error-title {\n  margin: 0 0 8px 0;\n  font-size: 16px;\n  font-weight: 600;\n  color: var(--text-primary, #14171a);\n}\n.error-container .error-message {\n  margin: 0 0 16px 0;\n  font-size: 14px;\n  color: var(--text-secondary, #657786);\n  line-height: 1.4;\n}\n.error-container .retry-btn {\n  background: var(--error-color, #e74c3c);\n  color: white;\n  border-radius: 20px;\n}\n.error-container .retry-btn:hover {\n  background: var(--error-hover, #c0392b);\n}\n.embed-container {\n  position: relative;\n  background: var(--embed-bg, #ffffff);\n}\n.embed-container iframe {\n  border: none !important;\n  max-width: 100% !important;\n}\n.tweet-list {\n  overflow-y: auto;\n  scrollbar-width: thin;\n  scrollbar-color: var(--scrollbar-thumb, #ccd6dd) var(--scrollbar-track, transparent);\n}\n.tweet-list::-webkit-scrollbar {\n  width: 6px;\n}\n.tweet-list::-webkit-scrollbar-track {\n  background: transparent;\n}\n.tweet-list::-webkit-scrollbar-thumb {\n  background-color: var(--scrollbar-thumb, #ccd6dd);\n  border-radius: 3px;\n}\n.tweet-item {\n  padding: 16px;\n  border-bottom: 1px solid var(--border-color, #e1e8ed);\n  transition: background-color 0.2s ease-in-out;\n}\n.tweet-item:hover {\n  background: var(--hover-bg, rgba(0, 0, 0, 0.02));\n}\n.tweet-item:last-child {\n  border-bottom: none;\n}\n.tweet-item.fadeInUp {\n  animation: fadeInUp 0.4s ease-out forwards;\n}\n.tweet-content .tweet-text {\n  margin: 0 0 12px 0;\n  font-size: 14px;\n  line-height: 1.5;\n  color: var(--text-primary, #14171a);\n  word-wrap: break-word;\n}\n.tweet-content .tweet-text :global(.hashtag) {\n  color: var(--primary-color, #1da1f2);\n  font-weight: 500;\n}\n.tweet-content .tweet-text :global(.mention) {\n  color: var(--primary-color, #1da1f2);\n  font-weight: 500;\n}\n.tweet-content .tweet-text :global(.tweet-link) {\n  color: var(--primary-color, #1da1f2);\n  text-decoration: none;\n}\n.tweet-content .tweet-text :global(.tweet-link):hover {\n  text-decoration: underline;\n}\n.tweet-meta {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-size: 12px;\n  color: var(--text-secondary, #657786);\n}\n.tweet-meta .tweet-date {\n  font-weight: 500;\n}\n.tweet-meta .tweet-actions {\n  display: flex;\n  gap: 16px;\n}\n.tweet-meta .action-item {\n  display: flex;\n  align-items: center;\n  gap: 4px;\n  cursor: pointer;\n  transition: color 0.2s ease-in-out;\n}\n.tweet-meta .action-item:hover {\n  color: var(--text-primary, #14171a);\n}\n.tweet-meta .action-item .action-icon {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n}\n.load-more {\n  padding: 16px;\n  text-align: center;\n  border-top: 1px solid var(--border-color, #e1e8ed);\n}\n.load-more .load-more-btn {\n  color: var(--primary-color, #1da1f2);\n  border: 1px solid var(--primary-color, #1da1f2);\n  border-radius: 20px;\n  padding: 8px 20px;\n}\n.load-more .load-more-btn:hover {\n  background: var(--primary-color, #1da1f2);\n  color: white;\n}\n.load-more .load-more-btn:disabled {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.twitter-footer {\n  padding: 12px 16px;\n  border-top: 1px solid var(--border-color, #e1e8ed);\n  background: var(--footer-bg, #f8f9fa);\n}\n.twitter-footer .view-profile-link {\n  display: inline-flex;\n  align-items: center;\n  gap: 6px;\n  font-size: 12px;\n  color: var(--text-secondary, #657786);\n  text-decoration: none;\n  transition: color 0.2s ease-in-out;\n}\n.twitter-footer .view-profile-link:hover {\n  color: var(--primary-color, #1da1f2);\n}\n.twitter-footer .view-profile-link mat-icon {\n  font-size: 14px;\n  width: 14px;\n  height: 14px;\n}\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@keyframes pulse {\n  0%, 100% {\n    opacity: 1;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 768px) {\n  .twitter-header .header-info {\n    flex-direction: column;\n    gap: 16px;\n  }\n  .twitter-header .header-actions {\n    align-self: stretch;\n    justify-content: space-between;\n  }\n  .stats-bar {\n    flex-wrap: wrap;\n    gap: 12px;\n  }\n  .tweet-meta {\n    flex-direction: column;\n    align-items: flex-start;\n    gap: 8px;\n  }\n}\n@media (max-width: 480px) {\n  .twitter-container {\n    border-radius: 8px;\n  }\n  .twitter-header,\n  .tweet-item,\n  .load-more {\n    padding: 12px;\n  }\n  .profile-image {\n    width: 40px;\n    height: 40px;\n  }\n  .display-name {\n    font-size: 15px;\n  }\n  .username {\n    font-size: 13px;\n  }\n}\n@media (prefers-color-scheme: dark) {\n  .twitter-container {\n    --surface-color: #1a1a1a;\n    --border-color: #333333;\n    --header-bg: #2a2a2a;\n    --footer-bg: #2a2a2a;\n    --text-primary: #ffffff;\n    --text-secondary: #8899a6;\n    --hover-bg: rgba(255, 255, 255, 0.03);\n    --skeleton-color: #333333;\n    --embed-bg: #1a1a1a;\n    --scrollbar-thumb: #555555;\n  }\n}\n@media (prefers-contrast: high) {\n  .twitter-container {\n    border: 2px solid;\n  }\n  .tweet-item {\n    border-bottom-width: 2px;\n  }\n  .action-item:hover {\n    background: var(--hover-bg);\n    border-radius: 4px;\n    padding: 2px 4px;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  * {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n  .spinning {\n    animation: none !important;\n  }\n}\n/*# sourceMappingURL=twitter-optimized.component.css.map */\n"] }]
  }], () => [], { config: [{
    type: Input
  }], userClick: [{
    type: Output
  }], tweetClick: [{
    type: Output
  }], followClick: [{
    type: Output
  }], refreshComplete: [{
    type: Output
  }], embedContainer: [{
    type: ViewChild,
    args: ["embedContainer"]
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TwitterOptimizedComponent, { className: "TwitterOptimizedComponent", filePath: "src/app/components/twitter-optimized/twitter-optimized.component.ts", lineNumber: 233 });
})();

// src/app/pages/news/news.ts
var _c02 = () => ({ showHeader: true, showFollowButton: true, showRefreshButton: true, showStats: false, maxHeight: 600, autoRefresh: false, refreshInterval: 3e5, enableVirtualScrolling: true, loadThreshold: 5 });
function News_div_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 34)(2, "div", 35)(3, "span", 36);
    \u0275\u0275text(4, "Cache Hit Rate:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "span", 37);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 35)(8, "span", 36);
    \u0275\u0275text(9, "Memory Usage:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "span", 37);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 35)(13, "span", 36);
    \u0275\u0275text(14, "API Efficiency:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 37);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 35)(18, "span", 36);
    \u0275\u0275text(19, "Load Time:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 37);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1("", ctx_r0.getPerformanceMetrics().cacheHitRate.toFixed(1), "%");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r0.formatBytes(ctx_r0.getPerformanceMetrics().memoryUsage));
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r0.getPerformanceMetrics().apiEfficiency.toFixed(1), "%");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate1("", ctx_r0.getPerformanceMetrics().loadTime, "ms");
  }
}
function News_section_28_article_4_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 62)(1, "img", 63);
    \u0275\u0275listener("error", function News_section_28_article_4_div_1_Template_img_error_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      return \u0275\u0275resetView($event.target.style.display = "none");
    });
    \u0275\u0275elementEnd();
    \u0275\u0275element(2, "div", 64);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const article_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", article_r3.featuredImage, \u0275\u0275sanitizeUrl)("alt", article_r3.title);
  }
}
function News_section_28_article_4_span_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 65)(1, "mat-icon");
    \u0275\u0275text(2, "push_pin");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Pinned");
    \u0275\u0275elementEnd();
  }
}
function News_section_28_article_4_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 66);
    \u0275\u0275element(1, "img", 67);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const article_r3 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", article_r3.author.avatar, \u0275\u0275sanitizeUrl)("alt", article_r3.author.name);
  }
}
function News_section_28_article_4_span_25_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 68);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tag_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("#", tag_r5);
  }
}
function News_section_28_article_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 41);
    \u0275\u0275listener("click", function News_section_28_article_4_Template_article_click_0_listener() {
      const article_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.navigateToArticle(article_r3.id));
    })("mouseenter", function News_section_28_article_4_Template_article_mouseenter_0_listener() {
      const article_r3 = \u0275\u0275restoreView(_r2).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onArticleHover(article_r3.id));
    });
    \u0275\u0275template(1, News_section_28_article_4_div_1_Template, 3, 2, "div", 42);
    \u0275\u0275elementStart(2, "div", 43)(3, "div", 44)(4, "span", 45)(5, "mat-icon", 46);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 47);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, News_section_28_article_4_span_10_Template, 4, 0, "span", 48);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "h3", 49);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "p", 50);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 51);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 52);
    \u0275\u0275template(18, News_section_28_article_4_div_18_Template, 2, 2, "div", 53);
    \u0275\u0275elementStart(19, "div", 54)(20, "span", 55);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 56);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(24, "div", 57);
    \u0275\u0275template(25, News_section_28_article_4_span_25_Template, 2, 1, "span", 58);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "div", 59)(27, "span", 60);
    \u0275\u0275text(28, "Read Full Article");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "mat-icon", 61);
    \u0275\u0275text(30, "arrow_forward");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const article_r3 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", article_r3.featuredImage);
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("background", ctx_r0.getCategoryGradient(article_r3.category));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getCategoryIcon(article_r3.category));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getCategoryLabel(article_r3.category), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatDate(article_r3.publishDate));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", article_r3.isPinned);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(article_r3.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(article_r3.subtitle);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(article_r3.excerpt);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", article_r3.author.avatar);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(article_r3.author.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(article_r3.author.role);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", article_r3.tags);
  }
}
function News_section_28_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "section", 38)(1, "h2", 13);
    \u0275\u0275text(2, "Featured Updates");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 39);
    \u0275\u0275template(4, News_section_28_article_4_Template, 31, 14, "article", 40);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r0.featuredArticles())("ngForTrackBy", ctx_r0.trackByArticleId);
  }
}
function News_h2_30_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2", 13);
    \u0275\u0275text(1, "Recent Updates");
    \u0275\u0275elementEnd();
  }
}
function News_h2_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h2", 13);
    \u0275\u0275text(1, "All Updates");
    \u0275\u0275elementEnd();
  }
}
function News_div_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 69)(1, "div", 70);
    \u0275\u0275text(2, "\u{1F50D}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 71);
    \u0275\u0275text(4, "No articles found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 72);
    \u0275\u0275text(6, " No news articles are currently available. ");
    \u0275\u0275elementEnd()();
  }
}
function News_div_33_article_1_p_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 50);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const article_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(article_r7.subtitle);
  }
}
function News_div_33_article_1_span_22_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 85);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tag_r8 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("#", tag_r8);
  }
}
function News_div_33_article_1_span_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 86);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const article_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("+", article_r7.tags.length - 3, " more");
  }
}
function News_div_33_article_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "article", 75);
    \u0275\u0275listener("click", function News_div_33_article_1_Template_article_click_0_listener() {
      const article_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.navigateToArticle(article_r7.id));
    })("mouseenter", function News_div_33_article_1_Template_article_mouseenter_0_listener() {
      const article_r7 = \u0275\u0275restoreView(_r6).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.onArticleHover(article_r7.id));
    });
    \u0275\u0275elementStart(1, "div", 44)(2, "span", 76)(3, "span", 46);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span", 47);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 43)(9, "h3", 49);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, News_div_33_article_1_p_11_Template, 2, 1, "p", 77);
    \u0275\u0275elementStart(12, "p", 51);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 78)(15, "span", 55);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "span", 79);
    \u0275\u0275text(18, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 56);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "div", 57);
    \u0275\u0275template(22, News_div_33_article_1_span_22_Template, 2, 1, "span", 80)(23, News_div_33_article_1_span_23_Template, 2, 1, "span", 81);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 82)(25, "span", 83);
    \u0275\u0275text(26, "Read More");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "mat-icon", 84);
    \u0275\u0275text(28, "arrow_forward");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const article_r7 = ctx.$implicit;
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275styleProp("background", ctx_r0.getCategoryGradient(article_r7.category));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getCategoryIcon(article_r7.category));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.getCategoryLabel(article_r7.category), " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.formatDate(article_r7.publishDate));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(article_r7.title);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", article_r7.subtitle);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(article_r7.excerpt);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(article_r7.author.name);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(article_r7.author.role);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", article_r7.tags.slice(0, 3));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", article_r7.tags.length > 3);
  }
}
function News_div_33_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73);
    \u0275\u0275template(1, News_div_33_article_1_Template, 29, 12, "article", 74);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r0.regularArticles())("ngForTrackBy", ctx_r0.trackByArticleId);
  }
}
var _News = class _News {
  constructor(router) {
    this.router = router;
    this.allNewsArticles = signal([], ...ngDevMode ? [{ debugName: "allNewsArticles" }] : []);
    this.currentFilter = signal({}, ...ngDevMode ? [{ debugName: "currentFilter" }] : []);
    this.filteredArticles = computed(() => {
      const articles = this.allNewsArticles();
      const filter = this.currentFilter();
      return articles.filter((article) => {
        if (filter.category && article.category !== filter.category) {
          return false;
        }
        if (filter.searchTerm) {
          const searchLower = filter.searchTerm.toLowerCase();
          return article.title.toLowerCase().includes(searchLower) || article.subtitle.toLowerCase().includes(searchLower) || article.excerpt.toLowerCase().includes(searchLower) || article.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        }
        return true;
      }).sort((a, b) => {
        if (a.isPinned && !b.isPinned)
          return -1;
        if (!a.isPinned && b.isPinned)
          return 1;
        return b.publishDate.getTime() - a.publishDate.getTime();
      });
    }, ...ngDevMode ? [{ debugName: "filteredArticles" }] : []);
    this.featuredArticles = computed(() => this.filteredArticles().filter((article) => article.isPinned), ...ngDevMode ? [{ debugName: "featuredArticles" }] : []);
    this.regularArticles = computed(() => this.filteredArticles().filter((article) => !article.isPinned), ...ngDevMode ? [{ debugName: "regularArticles" }] : []);
    this.categories = [
      {
        value: "project-updates",
        label: "Project Updates",
        icon: "rocket_launch",
        color: "#6c757d",
        gradient: "linear-gradient(135deg, #6c757d, #495057)",
        lightBg: "rgba(108, 117, 125, 0.1)"
      },
      {
        value: "releases",
        label: "Releases",
        icon: "music_note",
        color: "#10b981",
        gradient: "linear-gradient(135deg, #10b981, #059669)",
        lightBg: "rgba(16, 185, 129, 0.1)"
      },
      {
        value: "announcements",
        label: "Announcements",
        icon: "campaign",
        color: "#f59e0b",
        gradient: "linear-gradient(135deg, #f59e0b, #d97706)",
        lightBg: "rgba(245, 158, 11, 0.1)"
      },
      {
        value: "technical-updates",
        label: "Technical",
        icon: "settings",
        color: "#495057",
        gradient: "linear-gradient(135deg, #495057, #343a40)",
        lightBg: "rgba(73, 80, 87, 0.1)"
      },
      {
        value: "community",
        label: "Community",
        icon: "group",
        color: "#ec4899",
        gradient: "linear-gradient(135deg, #ec4899, #db2777)",
        lightBg: "rgba(236, 72, 153, 0.1)"
      }
    ];
    this.twitterService = inject(TwitterUnifiedOptimizedService);
    this.subscriptions = /* @__PURE__ */ new Set();
    this.twitterLoading = computed(() => this.twitterService.loading(), ...ngDevMode ? [{ debugName: "twitterLoading" }] : []);
    this.twitterError = computed(() => this.twitterService.error(), ...ngDevMode ? [{ debugName: "twitterError" }] : []);
    this.twitterTweets = computed(() => this.twitterService.tweets(), ...ngDevMode ? [{ debugName: "twitterTweets" }] : []);
    this.twitterUser = computed(() => this.twitterService.user(), ...ngDevMode ? [{ debugName: "twitterUser" }] : []);
    this.embedLoaded = computed(() => this.twitterService.embedLoaded(), ...ngDevMode ? [{ debugName: "embedLoaded" }] : []);
  }
  ngOnInit() {
    console.log("News component initialized");
    document.body.classList.add("news-page-active");
    this.loadNewsArticles();
    this.initializeTwitterIntegration();
  }
  ngOnDestroy() {
    document.body.classList.remove("news-page-active");
    this.subscriptions.forEach((sub) => sub.unsubscribe());
    this.subscriptions.clear();
  }
  loadNewsArticles() {
    const mockArticles = [
      {
        id: "1",
        title: "Project Phantasia 2.0 Launch",
        subtitle: "Major Update with New 3D Features",
        excerpt: "We are excited to announce the launch of Project Phantasia 2.0, featuring enhanced 3D environments, improved performance, and new interactive elements.",
        content: "Detailed content about the Project Phantasia 2.0 launch...",
        publishDate: /* @__PURE__ */ new Date("2024-01-15"),
        lastUpdated: /* @__PURE__ */ new Date("2024-01-16"),
        category: "project-updates",
        featuredImage: "/assets/videos/phantasia2/album_cover.png",
        author: {
          name: "Deltaether",
          role: "Lead Developer",
          avatar: "/assets/images/artists/deltaether-avatar.svg"
        },
        tags: ["phantasia", "3d", "launch", "update"],
        isPinned: true,
        relatedLinks: [
          { text: "Experience Phantasia", url: "/phantasia", type: "internal" },
          { text: "GitHub Repository", url: "https://github.com/deltaether/phantasia", type: "external" }
        ]
      },
      {
        id: "2",
        title: "New Mobile Interface Available",
        subtitle: "Touch-Optimized Experience for All Devices",
        excerpt: "All Prismatic Collections projects now feature a dedicated mobile interface optimized for touchscreen devices.",
        content: "Mobile interface content...",
        publishDate: /* @__PURE__ */ new Date("2023-12-10"),
        category: "announcements",
        author: {
          name: "Design Team",
          role: "UI/UX Designers"
        },
        tags: ["mobile", "ui", "responsive"],
        isPinned: false
      },
      {
        id: "3",
        title: "Performance Improvements",
        subtitle: "Faster Loading and Smoother Animations",
        excerpt: "Recent optimizations have improved loading times by 40% and enhanced animation smoothness across all platforms.",
        content: "Performance improvements content...",
        publishDate: /* @__PURE__ */ new Date("2023-11-22"),
        category: "technical-updates",
        author: {
          name: "Technical Team",
          role: "Backend Engineers"
        },
        tags: ["performance", "optimization", "technical"],
        isPinned: false
      },
      {
        id: "4",
        title: "Community Showcase: User Creations",
        subtitle: "Featuring Amazing Projects from Our Community",
        excerpt: "Discover incredible projects and remixes created by our community members using Prismatic Collections tools.",
        content: "Community showcase content...",
        publishDate: /* @__PURE__ */ new Date("2023-10-18"),
        category: "community",
        author: {
          name: "Community Team",
          role: "Community Managers"
        },
        tags: ["community", "showcase", "creativity"],
        isPinned: false
      },
      {
        id: "5",
        title: "New Music Release: Ethereal Echoes",
        subtitle: "Latest EP Available on All Platforms",
        excerpt: 'Our latest musical creation "Ethereal Echoes" is now available across all major streaming platforms.',
        content: "New music release content...",
        publishDate: /* @__PURE__ */ new Date("2023-09-30"),
        category: "releases",
        author: {
          name: "Deltaether",
          role: "Music Producer"
        },
        tags: ["music", "release", "ethereal-echoes"],
        isPinned: true
      }
    ];
    this.allNewsArticles.set(mockArticles);
  }
  // Optimized Twitter Integration Methods
  initializeTwitterIntegration() {
    console.log("\u{1F680} Initializing optimized Twitter integration...");
    if (this.twitterService.initialized()) {
      this.createEmbedWithDelay();
    } else {
      const initSub = this.twitterService.stateObservable.subscribe((state) => {
        if (state.initialized) {
          this.createEmbedWithDelay();
          initSub.unsubscribe();
        }
      });
      this.subscriptions.add(initSub);
    }
    const refreshSub = this.twitterService.refreshAll().subscribe({
      next: (data) => {
        console.log(`\u2705 Loaded ${data.tweets.length} tweets successfully with optimized service`);
      },
      error: (error) => {
        console.warn("\u26A0\uFE0F Using cached/fallback data:", error.message);
      }
    });
    this.subscriptions.add(refreshSub);
  }
  createEmbedWithDelay() {
    setTimeout(() => {
      this.twitterService.createEmbedTimeline("twitter-embed-container").catch((error) => {
        console.warn("Twitter embed creation failed, using fallback UI:", error);
      });
    }, 500);
  }
  // Optimized Twitter interaction methods
  onFollowClick() {
    console.log("\u{1F4F1} Follow button clicked - using optimized service");
    window.open(this.twitterService.getTwitterUrl(), "_blank", "noopener,noreferrer");
  }
  retryTwitterLoad() {
    console.log("\u{1F504} Retrying Twitter load with optimized service...");
    this.initializeTwitterIntegration();
  }
  refreshTwitterFeed() {
    console.log("\u{1F504} Refreshing Twitter feed with optimized service...");
    const refreshSub = this.twitterService.refreshAll().subscribe({
      next: (data) => {
        console.log(`\u2705 Refreshed: ${data.tweets.length} tweets, cache hit rate: ${this.twitterService.getPerformanceMetrics().cacheHitRate}%`);
      },
      error: (error) => {
        console.warn("\u26A0\uFE0F Refresh failed, using cached data:", error.message);
      }
    });
    this.subscriptions.add(refreshSub);
  }
  // Utility methods for Twitter integration
  getTwitterUsername() {
    return this.twitterService.getUsername();
  }
  getTwitterUrl() {
    return this.twitterService.getTwitterUrl();
  }
  getLastUpdateTime() {
    const lastUpdate = this.twitterService.state().lastUpdate;
    if (!lastUpdate)
      return "Never";
    const now = /* @__PURE__ */ new Date();
    const diffMinutes = Math.floor((now.getTime() - lastUpdate.getTime()) / (1e3 * 60));
    if (diffMinutes < 1)
      return "Just now";
    if (diffMinutes < 60)
      return `${diffMinutes}m ago`;
    const diffHours = Math.floor(diffMinutes / 60);
    if (diffHours < 24)
      return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  }
  formatDate(date) {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  }
  getCategoryIcon(category) {
    const categoryInfo = this.categories.find((c) => c.value === category);
    return categoryInfo?.icon || "article";
  }
  getCategoryLabel(category) {
    const categoryInfo = this.categories.find((c) => c.value === category);
    return categoryInfo?.label || category;
  }
  getCategoryColor(category) {
    const categoryInfo = this.categories.find((c) => c.value === category);
    return categoryInfo?.color || "#ff7f50";
  }
  getCategoryGradient(category) {
    const categoryInfo = this.categories.find((c) => c.value === category);
    return categoryInfo?.gradient || "linear-gradient(135deg, #ff7f50, #ff5252)";
  }
  getCategoryLightBg(category) {
    const categoryInfo = this.categories.find((c) => c.value === category);
    return categoryInfo?.lightBg || "rgba(255, 127, 80, 0.1)";
  }
  navigateToArticle(articleId) {
    console.log("Navigate to article:", articleId);
  }
  openExternalLink(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  // Enhanced interaction methods
  onArticleHover(articleId) {
    console.log("Article hovered:", articleId);
  }
  trackByArticleId(index, article) {
    return article.id;
  }
  // Optimized Twitter integration event handlers
  onTwitterRefreshComplete(data) {
    console.log("\u{1F389} Twitter refresh completed:", data);
    const metrics = this.twitterService.getPerformanceMetrics();
    console.log("\u{1F4CA} Performance metrics:", metrics);
  }
  // Performance monitoring methods
  showPerformanceStats() {
    return !environment.production || window.enableTwitterStats;
  }
  getPerformanceMetrics() {
    return this.twitterService.getPerformanceMetrics();
  }
  formatBytes(bytes) {
    if (bytes === 0)
      return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  }
};
_News.\u0275fac = function News_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _News)(\u0275\u0275directiveInject(Router));
};
_News.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _News, selectors: [["app-news"]], decls: 53, vars: 11, consts: [[1, "news-page", "anim-c"], [3, "count", "enabled"], [1, "news-main"], [1, "hero"], [1, "hero-content"], [1, "title"], [1, "subtitle"], [1, "description"], [1, "hero-background"], [1, "overlay"], [1, "filters"], [1, "filter-container", "twitter-integration"], [1, "section-header"], [1, "section-title"], [1, "section-icon"], [1, "twitter-handle"], [1, "section-subtitle"], [3, "followClick", "refreshComplete", "config"], ["class", "performance-stats", 4, "ngIf"], ["class", "featured-news", 4, "ngIf"], [1, "news-articles"], ["class", "section-title", 4, "ngIf"], ["class", "no-results", 4, "ngIf"], ["class", "articles-grid", 4, "ngIf"], [1, "newsletter-cta"], [1, "cta-content"], [1, "cta-title"], [1, "cta-text"], [1, "cta-buttons"], [1, "button", "primary", 3, "click"], [1, "button-icon"], [1, "button-description"], [1, "button", "secondary", 3, "click"], [1, "performance-stats"], [1, "stats-grid"], [1, "stat-item"], [1, "stat-label"], [1, "stat-value"], [1, "featured-news"], [1, "featured-grid"], ["class", "featured-article", 3, "click", "mouseenter", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "featured-article", 3, "click", "mouseenter"], ["class", "article-image", 4, "ngIf"], [1, "article-content"], [1, "article-meta"], [1, "category-badge"], [1, "category-icon"], [1, "publish-date"], ["class", "pinned-indicator", 4, "ngIf"], [1, "article-title"], [1, "article-subtitle"], [1, "article-excerpt"], [1, "author-info"], ["class", "author-avatar", 4, "ngIf"], [1, "author-details"], [1, "author-name"], [1, "author-role"], [1, "article-tags"], ["class", "tag", 4, "ngFor", "ngForOf"], [1, "read-more"], [1, "read-more-text"], [1, "read-more-arrow"], [1, "article-image"], [3, "error", "src", "alt"], [1, "image-overlay"], [1, "pinned-indicator"], [1, "author-avatar"], [3, "src", "alt"], [1, "tag"], [1, "no-results"], [1, "no-results-icon"], [1, "no-results-title"], [1, "no-results-text"], [1, "articles-grid"], ["class", "news-article", 3, "click", "mouseenter", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "news-article", 3, "click", "mouseenter"], [1, "category-badge", "small"], ["class", "article-subtitle", 4, "ngIf"], [1, "author-info", "compact"], [1, "author-separator"], ["class", "tag small", 4, "ngFor", "ngForOf"], ["class", "tag-more", 4, "ngIf"], [1, "read-indicator"], [1, "read-text"], [1, "read-arrow"], [1, "tag", "small"], [1, "tag-more"]], template: function News_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "app-site-header")(2, "app-squares-animation", 1);
    \u0275\u0275elementStart(3, "main", 2)(4, "section", 3)(5, "div", 4)(6, "h1", 5);
    \u0275\u0275text(7, "PROJECT UPDATES");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 6);
    \u0275\u0275text(9, "Latest News and Announcements");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 7);
    \u0275\u0275text(11, " Stay updated with the latest developments, releases, and community highlights from Prismatic Collections. Discover new features, technical improvements, and exciting announcements. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 8);
    \u0275\u0275element(13, "div", 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "section", 10)(15, "div", 11)(16, "div", 12)(17, "div", 13)(18, "mat-icon", 14);
    \u0275\u0275text(19, "alternate_email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "h3");
    \u0275\u0275text(21, "Latest from Prismatic Collections");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "span", 15);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(24, "div", 16);
    \u0275\u0275text(25, " Stay updated with our latest announcements and behind-the-scenes content ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "app-twitter-optimized", 17);
    \u0275\u0275listener("followClick", function News_Template_app_twitter_optimized_followClick_26_listener() {
      return ctx.onFollowClick();
    })("refreshComplete", function News_Template_app_twitter_optimized_refreshComplete_26_listener($event) {
      return ctx.onTwitterRefreshComplete($event);
    });
    \u0275\u0275elementEnd();
    \u0275\u0275template(27, News_div_27_Template, 22, 4, "div", 18);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(28, News_section_28_Template, 5, 2, "section", 19);
    \u0275\u0275elementStart(29, "section", 20);
    \u0275\u0275template(30, News_h2_30_Template, 2, 0, "h2", 21)(31, News_h2_31_Template, 2, 0, "h2", 21)(32, News_div_32_Template, 7, 0, "div", 22)(33, News_div_33_Template, 2, 2, "div", 23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "section", 24)(35, "div", 25)(36, "h2", 26);
    \u0275\u0275text(37, "Stay Updated");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "p", 27);
    \u0275\u0275text(39, " Never miss an update! Follow our social channels or bookmark this page to stay informed about the latest developments in Prismatic Collections. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 28)(41, "button", 29);
    \u0275\u0275listener("click", function News_Template_button_click_41_listener() {
      return ctx.router.navigate(["/socials"]);
    });
    \u0275\u0275elementStart(42, "mat-icon", 30);
    \u0275\u0275text(43, "notifications");
    \u0275\u0275elementEnd();
    \u0275\u0275text(44, " Follow Us ");
    \u0275\u0275elementStart(45, "span", 31);
    \u0275\u0275text(46, "Join our community channels");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(47, "button", 32);
    \u0275\u0275listener("click", function News_Template_button_click_47_listener() {
      return ctx.router.navigate(["/collections"]);
    });
    \u0275\u0275elementStart(48, "mat-icon", 30);
    \u0275\u0275text(49, "palette");
    \u0275\u0275elementEnd();
    \u0275\u0275text(50, " Explore Collections ");
    \u0275\u0275elementStart(51, "span", 31);
    \u0275\u0275text(52, "Discover our interactive experiences");
    \u0275\u0275elementEnd()()()()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("count", 48)("enabled", true);
    \u0275\u0275advance(21);
    \u0275\u0275textInterpolate1("@", ctx.getTwitterUsername());
    \u0275\u0275advance(3);
    \u0275\u0275property("config", \u0275\u0275pureFunction0(10, _c02));
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.showPerformanceStats());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.featuredArticles().length > 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ctx.featuredArticles().length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.featuredArticles().length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.regularArticles().length === 0 && ctx.featuredArticles().length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.regularArticles().length > 0);
  }
}, dependencies: [CommonModule, NgForOf, NgIf, FormsModule, MatIconModule, MatIcon, HttpClientModule, SiteHeaderComponent, SquaresAnimationComponent, TwitterOptimizedComponent], styles: ['@charset "UTF-8";\n\n\n\n.typography[_ngcontent-%COMP%] {\n}\n.typography-display-large[_ngcontent-%COMP%] {\n  font-size: 3.75rem;\n  font-weight: 900;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-display-medium[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  font-weight: 800;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-heading-1[_ngcontent-%COMP%] {\n  font-size: 2.25rem;\n  font-weight: 700;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-heading-2[_ngcontent-%COMP%] {\n  font-size: 1.875rem;\n  font-weight: 700;\n  line-height: 1.375;\n}\n.typography-heading-3[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 600;\n  line-height: 1.375;\n}\n.typography-heading-4[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 600;\n  line-height: 1.5;\n}\n.typography-body-large[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  font-weight: 400;\n  line-height: 1.625;\n}\n.typography-body-medium[_ngcontent-%COMP%], \n.article-excerpt[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n}\n.typography-body-small[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 400;\n  line-height: 1.5;\n}\n.typography-label-large[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.0125em;\n}\n.typography-label-medium[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.025em;\n}\n.typography-label-small[_ngcontent-%COMP%], \n.article-meta[_ngcontent-%COMP%]   .category-badge[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n}\n@media (max-width: 768px) {\n  .typography-display-large[_ngcontent-%COMP%] {\n    font-size: 2.25rem;\n  }\n  .typography-display-medium[_ngcontent-%COMP%] {\n    font-size: 1.875rem;\n  }\n  .typography-heading-1[_ngcontent-%COMP%] {\n    font-size: 1.875rem;\n  }\n  .typography-heading-2[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n@media (max-width: 480px) {\n  .typography-display-large[_ngcontent-%COMP%] {\n    font-size: 1.875rem;\n  }\n  .typography-display-medium[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .typography-heading-1[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n[_ngcontent-%COMP%]:root {\n  --primary-color: #ff7f50;\n  --gradient-primary:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      #ff5252);\n  --category-project-updates-color: #6c757d;\n  --category-project-updates-gradient:\n    linear-gradient(\n      135deg,\n      #6c757d,\n      #495057);\n  --category-project-updates-light: rgba(108, 117, 125, 0.1);\n  --category-releases-color: #10b981;\n  --category-releases-gradient:\n    linear-gradient(\n      135deg,\n      #10b981,\n      #059669);\n  --category-releases-light: rgba(16, 185, 129, 0.1);\n  --category-announcements-color: #f59e0b;\n  --category-announcements-gradient:\n    linear-gradient(\n      135deg,\n      #f59e0b,\n      #d97706);\n  --category-announcements-light: rgba(245, 158, 11, 0.1);\n  --category-technical-updates-color: #495057;\n  --category-technical-updates-gradient:\n    linear-gradient(\n      135deg,\n      #495057,\n      #343a40);\n  --category-technical-updates-light: rgba(73, 80, 87, 0.1);\n  --category-community-color: #ec4899;\n  --category-community-gradient:\n    linear-gradient(\n      135deg,\n      #ec4899,\n      #db2777);\n  --category-community-light: rgba(236, 72, 153, 0.1);\n  --social-spotify-color: #1DB954;\n  --social-soundcloud-color: #FF5500;\n  --social-youtube-color: #FF0000;\n  --social-github-color: #333333;\n  --social-discord-color: #5865F2;\n  --social-bandcamp-color: #629AA0;\n  --social-instagram-color: #E4405F;\n  --social-twitter-color: #1DA1F2;\n  --success-color: #10b981;\n  --warning-color: #f59e0b;\n  --error-color: #ef4444;\n  --info-color: #3b82f6;\n}\n.focus-enhanced[_ngcontent-%COMP%]:focus-visible, \n.interactive-element[_ngcontent-%COMP%]:focus-visible, \n.filter-button[_ngcontent-%COMP%]:focus-visible, \n.social-button[_ngcontent-%COMP%]:focus-visible, \n.news-article[_ngcontent-%COMP%]:focus-visible, \n.featured-article[_ngcontent-%COMP%]:focus-visible, \n.artist-card[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid #ff7f50;\n  outline-offset: 2px;\n  border-radius: 4px;\n  box-shadow: 0 0 0 3px rgba(255, 127, 80, 0.2);\n}\n.interactive-element[_ngcontent-%COMP%]:focus-visible, \n.filter-button[_ngcontent-%COMP%]:focus-visible, \n.social-button[_ngcontent-%COMP%]:focus-visible, \n.news-article[_ngcontent-%COMP%]:focus-visible, \n.featured-article[_ngcontent-%COMP%]:focus-visible, \n.artist-card[_ngcontent-%COMP%]:focus-visible {\n  transform: translateY(-1px);\n  transition: all 0.2s ease;\n}\n.interactive-element[_ngcontent-%COMP%]:active, \n.filter-button[_ngcontent-%COMP%]:active, \n.social-button[_ngcontent-%COMP%]:active, \n.news-article[_ngcontent-%COMP%]:active, \n.featured-article[_ngcontent-%COMP%]:active, \n.artist-card[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n.skip-link[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -40px;\n  left: 6px;\n  background: #000;\n  color: white;\n  padding: 8px;\n  text-decoration: none;\n  border-radius: 0 0 4px 4px;\n  z-index: 1000;\n}\n.skip-link[_ngcontent-%COMP%]:focus {\n  top: 0;\n}\n.sr-only[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n@media (prefers-contrast: high) {\n  .category-badge[_ngcontent-%COMP%], \n   .filter-button[_ngcontent-%COMP%], \n   .social-button[_ngcontent-%COMP%] {\n    border: 2px solid currentColor;\n  }\n  .article-card[_ngcontent-%COMP%], \n   .artist-card[_ngcontent-%COMP%] {\n    border: 1px solid rgba(255, 255, 255, 0.3);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  *[_ngcontent-%COMP%], \n   *[_ngcontent-%COMP%]::before, \n   *[_ngcontent-%COMP%]::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n  .triangle[_ngcontent-%COMP%] {\n    animation: none !important;\n  }\n  .triangle[_ngcontent-%COMP%]::after {\n    animation: none !important;\n  }\n}\n.status-indicator[_ngcontent-%COMP%]::before {\n  content: attr(data-status);\n  font-weight: bold;\n  margin-right: 0.5rem;\n}\n.status-indicator.available[_ngcontent-%COMP%]::before {\n  content: "\\2713  ";\n  color: #10b981;\n}\n.status-indicator.coming-soon[_ngcontent-%COMP%]::before {\n  content: "\\23f3  ";\n  color: #f59e0b;\n}\n.status-indicator.unavailable[_ngcontent-%COMP%]::before {\n  content: "\\2717  ";\n  color: #ef4444;\n}\n.keyboard-nav-active[_ngcontent-%COMP%]   .filter-button[_ngcontent-%COMP%]:focus, \n.keyboard-nav-active[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]:focus, \n.keyboard-nav-active[_ngcontent-%COMP%]   .article[_ngcontent-%COMP%]:focus, \n.keyboard-nav-active[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]:focus {\n  transform: scale(1.02);\n  z-index: 10;\n  position: relative;\n}\n.touch-target[_ngcontent-%COMP%] {\n  min-width: 44px;\n  min-height: 44px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.readable-content[_ngcontent-%COMP%] {\n  max-width: 65ch;\n  line-height: 1.6;\n}\n.readable-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], \n.readable-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \n.readable-content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.readable-content[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], \n.readable-content[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%], \n.readable-content[_ngcontent-%COMP%]   h6[_ngcontent-%COMP%] {\n  line-height: 1.3;\n  margin-bottom: 0.5em;\n}\n.readable-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-bottom: 1em;\n}\n.error-state[_ngcontent-%COMP%] {\n  color: #ef4444;\n  border-color: #ef4444;\n}\n.error-state[_ngcontent-%COMP%]:focus {\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);\n}\n.loading-state[_ngcontent-%COMP%] {\n  position: relative;\n  color: transparent;\n}\n.loading-state[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.1) 25%,\n      rgba(255, 255, 255, 0.2) 50%,\n      rgba(255, 255, 255, 0.1) 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_loading-shimmer 1.5s infinite;\n}\n@keyframes _ngcontent-%COMP%_loading-shimmer {\n  0% {\n    background-position: -200% 0;\n  }\n  100% {\n    background-position: 200% 0;\n  }\n}\n@keyframes _ngcontent-%COMP%_winterFloat {\n  0% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n  33% {\n    background-position:\n      40px 20px,\n      20px 40px,\n      35px 15px;\n  }\n  66% {\n    background-position:\n      20px 40px,\n      40px 20px,\n      15px 35px;\n  }\n  100% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n}\n[_ngcontent-%COMP%]:export {\n  winterPrimary: #f0f4f8;\n  winterSecondary: #e6f0f5;\n  winterAccent: #d4e8ef;\n  winterDark: #334155;\n  winterDarker: #1e293b;\n  winterHighlight: #cbd5e1;\n}\n[_nghost-%COMP%]     app-site-header {\n  display: block !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  pointer-events: auto !important;\n}\n.news-page[_ngcontent-%COMP%] {\n  min-height: calc(100vh + 500px);\n  height: 100vh;\n  color: #333333;\n  position: relative;\n  overflow-x: hidden;\n  overflow-y: auto;\n  margin-top: 89px;\n  scroll-behavior: smooth;\n  background:\n    radial-gradient(\n      ellipse at 15% 25%,\n      rgba(255, 255, 255, 0.08) 0%,\n      transparent 40%),\n    radial-gradient(\n      ellipse at 85% 75%,\n      rgba(248, 249, 250, 0.1) 0%,\n      transparent 45%),\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f8f9fa 30%,\n      #e9ecef 60%,\n      #dee2e6 100%);\n}\n.news-page[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background:\n    repeating-linear-gradient(\n      -45deg,\n      transparent 0px,\n      transparent 3px,\n      rgba(74, 158, 255, 0.035) 4px,\n      rgba(74, 158, 255, 0.035) 5px,\n      transparent 6px,\n      transparent 9px,\n      rgba(32, 178, 170, 0.03) 10px,\n      rgba(32, 178, 170, 0.03) 11px,\n      transparent 12px,\n      transparent 15px,\n      rgba(0, 206, 209, 0.025) 16px,\n      rgba(0, 206, 209, 0.025) 17px,\n      transparent 18px,\n      transparent 21px),\n    repeating-linear-gradient(\n      -75deg,\n      transparent 0px,\n      transparent 8px,\n      rgba(74, 158, 255, 0.02) 9px,\n      rgba(74, 158, 255, 0.02) 10px,\n      transparent 11px,\n      transparent 19px);\n  pointer-events: none;\n  z-index: 1;\n}\n.news-page.anim-a[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalSlideA 8s linear infinite;\n}\n.news-page.anim-b[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalPulseB 6s ease-in-out infinite;\n}\n.news-page.anim-c[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalSweepC 4s linear infinite;\n}\n.news-page.anim-d[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalDriftD 15s linear infinite;\n}\n.news-page.anim-e[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalBreatheE 7s ease-in-out infinite;\n}\n.news-page.anim-f[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalColorShiftF 12s ease-in-out infinite;\n}\n.news-page.anim-g[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalMultiLayerG 20s linear infinite;\n}\n.news-page.anim-h[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalShimmerH 5s ease-in-out infinite;\n}\n.news-page.anim-i[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalGlitchI 8s linear infinite;\n}\n.news-page.anim-j[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalWaveJ 14s ease-in-out infinite;\n}\n.news-page.anim-k[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalFadeK 9s ease-in-out infinite;\n}\n.news-page.anim-l[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalBounceL 6s ease-in-out infinite;\n}\n.news-page.anim-m[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalContinuousM 11s linear infinite;\n}\n.news-page.anim-n[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalSpiralN 18s linear infinite;\n}\n.news-page.anim-o[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalZoomPulseO 7s ease-in-out infinite;\n}\n.news-page.anim-p[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalBlurWavesP 13s ease-in-out infinite;\n}\n.news-page.anim-q[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalOpacityWavesQ 10s ease-in-out infinite;\n}\n.news-page.anim-r[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalPositionOscillationR 16s ease-in-out infinite;\n}\n.news-page.anim-s[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalTemperatureShiftS 14s ease-in-out infinite;\n}\n.news-page.anim-t[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalMorphingPatternT 12s ease-in-out infinite;\n}\n.news-page.anim-c[_ngcontent-%COMP%] {\n  overflow-y: auto !important;\n  overflow-x: hidden !important;\n  height: calc(100vh - 89px) !important;\n  scrollbar-width: thin;\n  scrollbar-color: rgba(255, 255, 255, 0.7) rgba(0, 0, 0, 0.3);\n}\n.news-page.anim-c[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n  height: 4px;\n  background: rgba(0, 0, 0, 0.3);\n}\n.news-page.anim-c[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: rgba(0, 0, 0, 0.3);\n  border-radius: 2px;\n}\n.news-page.anim-c[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.7);\n  border-radius: 2px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}\n.news-page.anim-c[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: hsla(0, 0%, 110%, 0.7);\n}\n@media (hover: none) and (pointer: coarse) {\n  .news-page.anim-c[_ngcontent-%COMP%] {\n    scrollbar-width: thin;\n    scrollbar-color: rgba(255, 255, 255, 0.8) rgba(0, 0, 0, 0.3);\n  }\n  .news-page.anim-c[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar {\n    width: 6px;\n    height: 6px;\n    background: rgba(0, 0, 0, 0.3);\n  }\n  .news-page.anim-c[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-track {\n    background: rgba(0, 0, 0, 0.3);\n    border-radius: 3px;\n  }\n  .news-page.anim-c[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n    background: rgba(255, 255, 255, 0.8);\n    border-radius: 3px;\n    border: 1px solid rgba(255, 255, 255, 0.1);\n  }\n  .news-page.anim-c[_ngcontent-%COMP%]   [_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n    background: hsla(0, 0%, 110%, 0.8);\n  }\n}\n.news-page[_ngcontent-%COMP%]::after {\n  content: "";\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background:\n    radial-gradient(\n      circle at 10% 10%,\n      rgba(255, 255, 255, 0.03) 1px,\n      transparent 1px),\n    radial-gradient(\n      circle at 90% 90%,\n      rgba(255, 255, 255, 0.025) 1px,\n      transparent 1px),\n    radial-gradient(\n      circle at 30% 70%,\n      rgba(255, 255, 255, 0.02) 1px,\n      transparent 1px);\n  background-size:\n    100px 100px,\n    80px 80px,\n    120px 120px;\n  animation: _ngcontent-%COMP%_subtleFloat 20s infinite linear;\n  pointer-events: none;\n  z-index: 0;\n}\n.news-page[_ngcontent-%COMP%] {\n  height: auto;\n}\n.news-page[_ngcontent-%COMP%] {\n  --text-primary: #1e293b;\n  --text-secondary: #334155;\n  --text-muted: #64748b;\n  --text-light: #94a3b8;\n}\n@keyframes _ngcontent-%COMP%_diagonalSlideA {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 42px 42px, 38px 38px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalPulseB {\n  0%, 100% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0.7;\n  }\n  50% {\n    opacity: 0.9;\n  }\n  75% {\n    opacity: 0.6;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalSweepC {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 84px 84px, 76px 76px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalDriftD {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    background-position: 30px 30px, 25px 25px;\n  }\n  75% {\n    background-position: 45px 45px, 38px 38px;\n  }\n  100% {\n    background-position: 60px 60px, 50px 50px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalBreatheE {\n  0%, 100% {\n    filter: opacity(1) saturate(1);\n  }\n  50% {\n    filter: opacity(0.4) saturate(1.3);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalColorShiftF {\n  0%, 100% {\n    filter: hue-rotate(0deg);\n  }\n  33% {\n    filter: hue-rotate(30deg);\n  }\n  66% {\n    filter: hue-rotate(-20deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalMultiLayerG {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 21px 21px, -19px -19px;\n  }\n  50% {\n    background-position: 42px 42px, -38px -38px;\n  }\n  75% {\n    background-position: 63px 63px, -57px -57px;\n  }\n  100% {\n    background-position: 84px 84px, -76px -76px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalShimmerH {\n  0%, 100% {\n    filter: brightness(1) contrast(1);\n  }\n  25% {\n    filter: brightness(1.4) contrast(1.2);\n  }\n  50% {\n    filter: brightness(0.8) contrast(1.1);\n  }\n  75% {\n    filter: brightness(1.6) contrast(1.3);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalGlitchI {\n  0%, 85%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  10% {\n    background-position: 5px 5px, -3px -3px;\n  }\n  15% {\n    background-position: -8px -8px, 6px 6px;\n  }\n  20% {\n    background-position: 12px 12px, -10px -10px;\n  }\n  25% {\n    background-position: -5px -5px, 8px 8px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalWaveJ {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 30px 15px, -20px -10px;\n  }\n  50% {\n    background-position: 10px 40px, -15px -25px;\n  }\n  75% {\n    background-position: -20px 25px, 25px -15px;\n  }\n  100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalFadeK {\n  0%, 100% {\n    filter: opacity(1);\n  }\n  20% {\n    filter: opacity(0.2);\n  }\n  40% {\n    filter: opacity(0.8);\n  }\n  60% {\n    filter: opacity(0.1);\n  }\n  80% {\n    filter: opacity(0.6);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalBounceL {\n  0%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    background-position: -10px -10px, -8px -8px;\n  }\n  75% {\n    background-position: 20px 20px, 16px 16px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalContinuousM {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 220px 220px, 200px 200px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalSpiralN {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 30px 15px, 25px 12px;\n  }\n  50% {\n    background-position: 15px 30px, 12px 25px;\n  }\n  75% {\n    background-position: -15px 15px, -12px 12px;\n  }\n  100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalZoomPulseO {\n  0%, 100% {\n    background-size: 42px 42px, 38px 38px;\n  }\n  50% {\n    background-size: 60px 60px, 55px 55px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalBlurWavesP {\n  0%, 100% {\n    filter: blur(0px);\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    filter: blur(1px);\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    filter: blur(2px);\n    background-position: 30px 30px, 25px 25px;\n  }\n  75% {\n    filter: blur(1px);\n    background-position: 15px 15px, 12px 12px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalOpacityWavesQ {\n  0%, 100% {\n    filter: opacity(1);\n  }\n  16% {\n    filter: opacity(0.3);\n  }\n  32% {\n    filter: opacity(0.7);\n  }\n  48% {\n    filter: opacity(0.2);\n  }\n  64% {\n    filter: opacity(0.9);\n  }\n  80% {\n    filter: opacity(0.4);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalPositionOscillationR {\n  0%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 8px 12px, 6px 10px;\n  }\n  50% {\n    background-position: -12px 8px, -10px 6px;\n  }\n  75% {\n    background-position: 15px -10px, 12px -8px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalTemperatureShiftS {\n  0%, 100% {\n    filter: hue-rotate(0deg) brightness(1);\n  }\n  33% {\n    filter: hue-rotate(45deg) brightness(1.2);\n  }\n  66% {\n    filter: hue-rotate(-30deg) brightness(0.8);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalMorphingPatternT {\n  0%, 100% {\n    background-size: 42px 42px, 38px 38px;\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-size: 55px 55px, 50px 50px;\n    background-position: 20px 10px, 18px 8px;\n  }\n  50% {\n    background-size: 35px 35px, 32px 32px;\n    background-position: 40px 20px, 35px 18px;\n  }\n  75% {\n    background-size: 65px 65px, 60px 60px;\n    background-position: 20px 30px, 18px 25px;\n  }\n}\n@keyframes _ngcontent-%COMP%_subtleFloat {\n  0% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n  33% {\n    background-position:\n      30px 20px,\n      20px 40px,\n      40px 10px;\n  }\n  66% {\n    background-position:\n      20px 40px,\n      40px 20px,\n      10px 30px;\n  }\n  100% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n}\n.news-main[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n  padding: 0 2rem;\n  max-width: 1400px;\n  margin: 0 auto;\n  padding-top: 4rem;\n  padding-bottom: 12rem;\n  min-height: calc(100vh + 600px);\n}\n.news-page.anim-c[_ngcontent-%COMP%]   .news-main[_ngcontent-%COMP%] {\n  min-height: calc(100vh + 500px) !important;\n  padding-bottom: 20rem !important;\n}\n.news-page.anim-c[_ngcontent-%COMP%]   .news-main[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.news-page.anim-c[_ngcontent-%COMP%]   .news-main[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 2rem;\n}\n.hero[_ngcontent-%COMP%] {\n  position: relative;\n  height: 25vh;\n  min-height: 220px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  margin-bottom: 3rem;\n  max-width: 1200px;\n  margin-left: auto;\n  margin-right: auto;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.25) 0%,\n      rgba(255, 255, 255, 0.22) 50%,\n      rgba(255, 255, 255, 0.18) 100%);\n  backdrop-filter: blur(15px);\n  -webkit-backdrop-filter: blur(15px);\n  border-radius: 24px;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);\n  padding: 3rem 2.5rem;\n}\n.hero[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    radial-gradient(\n      circle at center,\n      rgba(255, 255, 255, 0.05) 0%,\n      transparent 60%);\n  pointer-events: none;\n  z-index: -1;\n}\n.hero[_ngcontent-%COMP%]   .hero-background[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-image: url(/assets/images/ui/composite_bg.png);\n  background-size: cover;\n  background-position: center;\n  z-index: -1;\n}\n.hero[_ngcontent-%COMP%]   .hero-background[_ngcontent-%COMP%]   .overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8));\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%] {\n  text-align: center;\n  z-index: 1;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  max-width: 800px;\n  margin: 0 auto;\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto 1rem auto;\n  font-size: clamp(2rem, 4vw + 1rem, 4.5rem) !important;\n  line-height: 1.15 !important;\n  letter-spacing: clamp(-0.025em, -0.01vw, -0.015em) !important;\n  font-weight: 800 !important;\n  font-family:\n    "DALFITRA",\n    "Raleway",\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    Helvetica,\n    Arial,\n    sans-serif !important;\n  color: #eeeeee !important;\n  -webkit-text-fill-color: #eeeeee !important;\n  background: none !important;\n  -webkit-background-clip: unset !important;\n  background-clip: unset !important;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;\n}\n@media (max-width: 768px) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n    font-size: clamp(1.75rem, 6vw, 2.5rem) !important;\n    font-family:\n      "DALFITRA",\n      "Raleway",\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      Roboto,\n      Helvetica,\n      Arial,\n      sans-serif !important;\n  }\n}\n@media (max-width: 480px) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n    font-size: clamp(1.5rem, 8vw, 2rem) !important;\n    font-family:\n      "DALFITRA",\n      "Raleway",\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      Roboto,\n      Helvetica,\n      Arial,\n      sans-serif !important;\n  }\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  font-size: clamp(1.125rem, 1.0892857143rem + 0.0111607143vw, 1.25rem);\n  line-height: clamp(1.5, 1.5 + 0.5vw, 1.7);\n  letter-spacing: 0;\n  font-weight: 400;\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: clamp(1.5rem, 5vw, 3rem);\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.9);\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto 1rem auto;\n}\n@media (prefers-contrast: high) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    transition: none;\n    animation: none;\n  }\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n@media (max-width: 768px) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    text-shadow: none;\n    font-feature-settings: normal;\n    font-variant: normal;\n    font-family:\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      sans-serif;\n    text-rendering: optimizeSpeed;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.8);\n  font-weight: 500;\n  position: relative;\n  z-index: 2;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto;\n}\n.filters[_ngcontent-%COMP%] {\n  margin-bottom: 4rem;\n}\n.filters[_ngcontent-%COMP%]   .filter-container.twitter-integration[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.85) 0%,\n      rgba(15, 15, 15, 0.9) 50%,\n      rgba(25, 25, 25, 0.85) 100%);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border-radius: 20px;\n  padding: 2rem;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);\n  margin-bottom: 2rem;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  position: relative;\n  overflow: hidden;\n}\n.filters[_ngcontent-%COMP%]   .filter-container.twitter-integration[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    radial-gradient(\n      circle at 20% 20%,\n      rgba(29, 161, 242, 0.1) 0%,\n      transparent 50%);\n  pointer-events: none;\n}\n.twitter-header[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 2rem;\n  padding-bottom: 1.5rem;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n  position: relative;\n  z-index: 1;\n}\n.twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%]   .twitter-icon[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  filter: hue-rotate(200deg) brightness(1.2);\n}\n.twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: #fff;\n  margin: 0;\n  font-weight: 700;\n}\n.twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: clamp(1.125rem, 1.0178571429rem + 0.0334821429vw, 1.5rem);\n  line-height: clamp(1.35, 1.35 + 0.5vw, 1.45);\n  letter-spacing: 0;\n  font-weight: 500;\n}\n.twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n@media (prefers-contrast: high) {\n  .twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    transition: none;\n    animation: none;\n  }\n}\n.twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n.twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%]   .twitter-handle[_ngcontent-%COMP%] {\n  color: rgba(29, 161, 242, 0.8);\n  font-size: 0.9rem;\n  font-weight: 500;\n  background: rgba(29, 161, 242, 0.1);\n  padding: 0.25rem 0.75rem;\n  border-radius: 12px;\n  border: 1px solid rgba(29, 161, 242, 0.2);\n}\n.twitter-header[_ngcontent-%COMP%]   .follow-button[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #1da1f2,\n      #0d8bd9);\n  color: white;\n  border: none;\n  border-radius: 12px;\n  padding: 0.75rem 1.5rem;\n  font-weight: 600;\n  font-size: 0.9rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  text-decoration: none;\n  position: relative;\n  overflow: hidden;\n}\n.twitter-header[_ngcontent-%COMP%]   .follow-button[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255, 255, 255, 0.2),\n      transparent);\n  transition: left 0.5s ease;\n}\n.twitter-header[_ngcontent-%COMP%]   .follow-button[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(29, 161, 242, 0.3);\n}\n.twitter-header[_ngcontent-%COMP%]   .follow-button[_ngcontent-%COMP%]:hover::before {\n  left: 100%;\n}\n.twitter-header[_ngcontent-%COMP%]   .follow-button[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n.twitter-header[_ngcontent-%COMP%]   .follow-button[_ngcontent-%COMP%]   .follow-icon[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n}\n.twitter-timeline-container[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.twitter-timeline-container[_ngcontent-%COMP%]   .twitter-timeline-wrapper[_ngcontent-%COMP%] {\n  position: relative;\n  min-height: 400px;\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.02);\n  border: 1px solid rgba(255, 255, 255, 0.05);\n  overflow: hidden;\n}\n.twitter-timeline-container[_ngcontent-%COMP%]   .twitter-timeline-wrapper.loading[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.twitter-timeline-container[_ngcontent-%COMP%]   .twitter-timeline-wrapper.error[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.twitter-loading[_ngcontent-%COMP%] {\n  text-align: center;\n  color: rgba(255, 255, 255, 0.7);\n}\n.twitter-loading[_ngcontent-%COMP%]   .loading-spinner[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n  border: 3px solid rgba(29, 161, 242, 0.3);\n  border-top: 3px solid #1da1f2;\n  border-radius: 50%;\n  margin: 0 auto 1rem;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n.twitter-loading[_ngcontent-%COMP%]   .loading-text[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 500;\n  margin: 0;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.twitter-error[_ngcontent-%COMP%] {\n  text-align: center;\n  color: rgba(255, 255, 255, 0.7);\n}\n.twitter-error[_ngcontent-%COMP%]   .error-icon[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  margin-bottom: 1rem;\n}\n.twitter-error[_ngcontent-%COMP%]   .error-text[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  margin-bottom: 1.5rem;\n  color: rgba(255, 255, 255, 0.8);\n}\n.twitter-error[_ngcontent-%COMP%]   .retry-button[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.1);\n  color: #fff;\n  border: 2px solid rgba(255, 255, 255, 0.2);\n  border-radius: 12px;\n  padding: 0.75rem 1.5rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.twitter-error[_ngcontent-%COMP%]   .retry-button[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.15);\n  border-color: #ff7f50;\n  transform: translateY(-1px);\n}\n.twitter-error[_ngcontent-%COMP%]   .retry-button[_ngcontent-%COMP%]   .retry-icon[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n}\n.manual-tweets[_ngcontent-%COMP%] {\n  padding: 1rem;\n  max-height: 500px;\n  overflow-y: auto;\n}\n.tweet-card[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  border-radius: 16px;\n  padding: 1.5rem;\n  margin-bottom: 1rem;\n  transition: all 0.3s ease;\n  position: relative;\n}\n.tweet-card[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(29, 161, 242, 0.3);\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);\n}\n.tweet-card[_ngcontent-%COMP%]:last-child {\n  margin-bottom: 0;\n}\n.tweet-header[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n.tweet-header[_ngcontent-%COMP%]   .tweet-avatar[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  overflow: hidden;\n  flex-shrink: 0;\n  border: 2px solid rgba(29, 161, 242, 0.3);\n}\n.tweet-header[_ngcontent-%COMP%]   .tweet-avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.tweet-header[_ngcontent-%COMP%]   .tweet-info[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n}\n.tweet-header[_ngcontent-%COMP%]   .tweet-info[_ngcontent-%COMP%]   .tweet-name[_ngcontent-%COMP%] {\n  color: #fff;\n  font-weight: 700;\n  font-size: 0.95rem;\n}\n.tweet-header[_ngcontent-%COMP%]   .tweet-info[_ngcontent-%COMP%]   .tweet-handle[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.6);\n  font-size: 0.85rem;\n}\n.tweet-header[_ngcontent-%COMP%]   .tweet-info[_ngcontent-%COMP%]   .tweet-date[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.5);\n  font-size: 0.8rem;\n}\n.tweet-content[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.tweet-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.9);\n  line-height: 1.6;\n  margin: 0;\n  font-size: 0.95rem;\n}\n.tweet-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]     .tweet-hashtag {\n  color: #1da1f2;\n  font-weight: 500;\n}\n.tweet-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]     .tweet-mention {\n  color: #1da1f2;\n  font-weight: 500;\n}\n.tweet-content[_ngcontent-%COMP%]   .tweet-media[_ngcontent-%COMP%] {\n  margin-top: 1rem;\n  border-radius: 12px;\n  overflow: hidden;\n}\n.tweet-content[_ngcontent-%COMP%]   .tweet-media[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: auto;\n  max-height: 300px;\n  object-fit: cover;\n  transition: transform 0.3s ease;\n}\n.tweet-content[_ngcontent-%COMP%]   .tweet-media[_ngcontent-%COMP%]:hover   img[_ngcontent-%COMP%] {\n  transform: scale(1.02);\n}\n.tweet-metrics[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  margin-top: 0.75rem;\n  padding-top: 0.75rem;\n  border-top: 1px solid rgba(255, 255, 255, 0.05);\n}\n.tweet-metrics[_ngcontent-%COMP%]   .metric[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  color: rgba(255, 255, 255, 0.6);\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n.tweet-metrics[_ngcontent-%COMP%]   .metric[_ngcontent-%COMP%]   .metric-icon[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n}\n.tweet-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n.tweet-actions[_ngcontent-%COMP%]   .tweet-action[_ngcontent-%COMP%] {\n  background: transparent;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  color: rgba(255, 255, 255, 0.7);\n  border-radius: 8px;\n  padding: 0.5rem 1rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n.tweet-actions[_ngcontent-%COMP%]   .tweet-action[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.05);\n  border-color: rgba(29, 161, 242, 0.5);\n  color: #1da1f2;\n}\n.tweet-actions[_ngcontent-%COMP%]   .tweet-action[_ngcontent-%COMP%]   .action-icon[_ngcontent-%COMP%] {\n  font-size: 0.7rem;\n}\n.twitter-footer[_ngcontent-%COMP%] {\n  text-align: center;\n  position: relative;\n  z-index: 1;\n}\n.twitter-footer[_ngcontent-%COMP%]   .twitter-footer-text[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.7);\n  font-size: 0.95rem;\n  line-height: 1.6;\n  margin-bottom: 1.5rem;\n  max-width: 600px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.twitter-footer[_ngcontent-%COMP%]   .twitter-footer-text[_ngcontent-%COMP%]   .last-update[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.8rem;\n  color: rgba(255, 255, 255, 0.5);\n  margin-top: 0.5rem;\n  font-style: italic;\n}\n.twitter-footer[_ngcontent-%COMP%]   .twitter-footer-actions[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 1rem;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n.twitter-footer[_ngcontent-%COMP%]   .twitter-footer-actions[_ngcontent-%COMP%]   .footer-link[_ngcontent-%COMP%] {\n  padding: 0.75rem 1.5rem;\n  border-radius: 12px;\n  font-weight: 600;\n  font-size: 0.9rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  text-decoration: none;\n  border: none;\n}\n.twitter-footer[_ngcontent-%COMP%]   .twitter-footer-actions[_ngcontent-%COMP%]   .footer-link.primary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      rgb(255, 89.6971428571, 29));\n  color: white;\n}\n.twitter-footer[_ngcontent-%COMP%]   .twitter-footer-actions[_ngcontent-%COMP%]   .footer-link.primary[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(255, 127, 80, 0.3);\n}\n.twitter-footer[_ngcontent-%COMP%]   .twitter-footer-actions[_ngcontent-%COMP%]   .footer-link.secondary[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.05);\n  color: rgba(255, 255, 255, 0.8);\n  border: 2px solid rgba(255, 255, 255, 0.1);\n}\n.twitter-footer[_ngcontent-%COMP%]   .twitter-footer-actions[_ngcontent-%COMP%]   .footer-link.secondary[_ngcontent-%COMP%]:hover:not(:disabled) {\n  background: rgba(255, 255, 255, 0.1);\n  border-color: rgba(255, 255, 255, 0.3);\n  color: #fff;\n}\n.twitter-footer[_ngcontent-%COMP%]   .twitter-footer-actions[_ngcontent-%COMP%]   .footer-link.secondary[_ngcontent-%COMP%]:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  color: rgba(255, 255, 255, 0.4);\n}\n.twitter-footer[_ngcontent-%COMP%]   .twitter-footer-actions[_ngcontent-%COMP%]   .footer-link[_ngcontent-%COMP%]   .link-icon[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n}\n@media (max-width: 768px) {\n  .twitter-header[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 1rem;\n    text-align: center;\n  }\n  .twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%] {\n    justify-content: center;\n  }\n  .twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    font-size: 1.3rem;\n  }\n  .twitter-header[_ngcontent-%COMP%]   .follow-button[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 200px;\n    justify-content: center;\n  }\n  .twitter-timeline-wrapper[_ngcontent-%COMP%] {\n    min-height: 300px;\n  }\n  .tweet-card[_ngcontent-%COMP%] {\n    padding: 1.25rem;\n  }\n  .tweet-header[_ngcontent-%COMP%]   .tweet-avatar[_ngcontent-%COMP%] {\n    width: 40px;\n    height: 40px;\n  }\n  .twitter-footer-actions[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: center;\n  }\n  .twitter-footer-actions[_ngcontent-%COMP%]   .footer-link[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 250px;\n    justify-content: center;\n  }\n}\n@media (max-width: 480px) {\n  .filters[_ngcontent-%COMP%]   .filter-container.twitter-integration[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n  }\n  .twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n  .twitter-header[_ngcontent-%COMP%]   .twitter-title[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .tweet-card[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .tweet-actions[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.75rem;\n  }\n  .tweet-actions[_ngcontent-%COMP%]   .tweet-action[_ngcontent-%COMP%] {\n    width: 100%;\n    justify-content: center;\n  }\n  .manual-tweets[_ngcontent-%COMP%] {\n    max-height: 400px;\n    padding: 0.75rem;\n  }\n}\n.section-title[_ngcontent-%COMP%] {\n  position: relative;\n  color: #fff;\n  font-weight: 700;\n}\n.section-title[_ngcontent-%COMP%] {\n  font-size: clamp(1.875rem, 1.5535714286rem + 0.1004464286vw, 3rem);\n  line-height: clamp(1.2, 1.2 + 0.5vw, 1.3);\n  letter-spacing: -0.025em;\n  font-weight: 700;\n}\n.section-title[_ngcontent-%COMP%] {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.section-title[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: clamp(2rem, 6vw, 4rem);\n}\n@media (prefers-contrast: high) {\n  .section-title[_ngcontent-%COMP%] {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .section-title[_ngcontent-%COMP%] {\n    transition: none;\n    animation: none;\n  }\n}\n.section-title[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .section-title[_ngcontent-%COMP%] {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n@media (max-width: 768px) {\n  .section-title[_ngcontent-%COMP%] {\n    text-shadow: none;\n    font-feature-settings: normal;\n    font-variant: normal;\n    font-family:\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      sans-serif;\n    text-rendering: optimizeSpeed;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n}\n.section-title[_ngcontent-%COMP%]:after {\n  content: "";\n  position: absolute;\n  bottom: -15px;\n  left: 50%;\n  transform: translateX(-50%);\n  width: 80px;\n  height: 4px;\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff,\n      #f0f0f0);\n  border-radius: 2px;\n}\n.featured-news[_ngcontent-%COMP%] {\n  margin-bottom: 5rem;\n}\n.featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));\n  gap: 3rem;\n  justify-content: center;\n}\n.featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.45) 0%,\n      rgba(248, 249, 250, 0.4) 50%,\n      rgba(255, 255, 255, 0.45) 100%);\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  border-radius: 20px;\n  padding: 0;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);\n  transition: all 0.3s ease;\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n}\n.featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]:hover {\n  transform: translateY(-10px);\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);\n}\n.featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 4px;\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff,\n      #f0f0f0);\n  opacity: 0;\n  transition: opacity 0.3s ease;\n}\n.featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]:hover::before {\n  opacity: 1;\n}\n.featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]   .article-image[_ngcontent-%COMP%] {\n  position: relative;\n  height: 200px;\n  overflow: hidden;\n  border-radius: 20px 20px 0 0;\n}\n.featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]   .article-image[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.5s ease;\n}\n.featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]   .article-image[_ngcontent-%COMP%]   .image-overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    linear-gradient(\n      to bottom,\n      transparent 0%,\n      rgba(0, 0, 0, 0.3) 100%);\n}\n.featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]   .article-image[_ngcontent-%COMP%]:hover   img[_ngcontent-%COMP%] {\n  transform: scale(1.05);\n}\n.featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]   .article-content[_ngcontent-%COMP%] {\n  padding: 2rem;\n}\n.news-articles[_ngcontent-%COMP%]   .articles-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));\n  gap: 2rem;\n}\n.news-articles[_ngcontent-%COMP%]   .articles-grid[_ngcontent-%COMP%]   .news-article[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.35) 0%,\n      rgba(248, 249, 250, 0.3) 50%,\n      rgba(255, 255, 255, 0.35) 100%);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n  border-radius: 20px;\n  padding: 1.5rem;\n  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);\n  transition: all 0.3s ease;\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n}\n.news-articles[_ngcontent-%COMP%]   .articles-grid[_ngcontent-%COMP%]   .news-article[_ngcontent-%COMP%]:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.35);\n}\n.news-articles[_ngcontent-%COMP%]   .articles-grid[_ngcontent-%COMP%]   .news-article[_ngcontent-%COMP%]:hover   .read-indicator[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: translateX(0);\n}\n.news-articles[_ngcontent-%COMP%]   .articles-grid[_ngcontent-%COMP%]   .news-article[_ngcontent-%COMP%]   .read-indicator[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 1rem;\n  right: 1.5rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: #ff7f50;\n  font-size: 0.85rem;\n  font-weight: 500;\n  opacity: 0;\n  transform: translateX(-10px);\n  transition: all 0.3s ease;\n}\n.news-articles[_ngcontent-%COMP%]   .articles-grid[_ngcontent-%COMP%]   .news-article[_ngcontent-%COMP%]   .read-indicator[_ngcontent-%COMP%]   .read-arrow[_ngcontent-%COMP%] {\n  transition: transform 0.3s ease;\n}\n.news-articles[_ngcontent-%COMP%]   .articles-grid[_ngcontent-%COMP%]   .news-article[_ngcontent-%COMP%]:hover   .read-indicator[_ngcontent-%COMP%]   .read-arrow[_ngcontent-%COMP%] {\n  transform: translateX(3px);\n}\n.article-meta[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1rem;\n  flex-wrap: wrap;\n}\n.article-meta[_ngcontent-%COMP%]   .category-badge[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  color: white;\n  padding: 0.35rem 0.85rem;\n  border-radius: 15px;\n  background: var(--category-project-updates-gradient, linear-gradient(135deg, #ffffff, #f0f0f0));\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n  transition: all 0.2s ease;\n}\n.article-meta[_ngcontent-%COMP%]   .category-badge[_ngcontent-%COMP%]:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);\n}\n.article-meta[_ngcontent-%COMP%]   .category-badge.small[_ngcontent-%COMP%] {\n  padding: 0.2rem 0.6rem;\n  font-size: 0.7rem;\n}\n.article-meta[_ngcontent-%COMP%]   .category-badge[_ngcontent-%COMP%]   .category-icon[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n}\n.article-meta[_ngcontent-%COMP%]   .publish-date[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.6);\n  font-size: 0.85rem;\n  font-weight: 500;\n}\n.article-meta[_ngcontent-%COMP%]   .pinned-indicator[_ngcontent-%COMP%] {\n  background: rgba(255, 215, 0, 0.2);\n  color: #ffd700;\n  padding: 0.25rem 0.5rem;\n  border-radius: 10px;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.article-title[_ngcontent-%COMP%] {\n  color: #fff;\n  margin-bottom: clamp(0.375rem, 1.5vw, 0.625rem);\n  transition: color 0.2s ease;\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.article-title[_ngcontent-%COMP%] {\n  font-size: clamp(1.25rem, 1.0714285714rem + 0.0558035714vw, 1.875rem);\n  line-height: clamp(1.3, 1.3 + 0.5vw, 1.4);\n  letter-spacing: -0.01em;\n  font-weight: 600;\n}\n@media (prefers-contrast: high) {\n  .article-title[_ngcontent-%COMP%] {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .article-title[_ngcontent-%COMP%] {\n    transition: none;\n    animation: none;\n  }\n}\n.article-title[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .article-title[_ngcontent-%COMP%] {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n.featured-article[_ngcontent-%COMP%]:hover   .article-title[_ngcontent-%COMP%], \n.news-article[_ngcontent-%COMP%]:hover   .article-title[_ngcontent-%COMP%] {\n  color: #ff7f50;\n}\n.article-subtitle[_ngcontent-%COMP%] {\n  color: #ff7f50;\n  margin-bottom: 1rem;\n  font-weight: 500;\n  opacity: 0.9;\n}\n.article-subtitle[_ngcontent-%COMP%] {\n  font-size: clamp(1.125rem, 1.0892857143rem + 0.0111607143vw, 1.25rem);\n  line-height: clamp(1.5, 1.5 + 0.5vw, 1.7);\n  letter-spacing: 0;\n  font-weight: 400;\n}\n.article-subtitle[_ngcontent-%COMP%] {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.article-excerpt[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.8);\n  margin-bottom: 1.5rem;\n}\n.author-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  margin-bottom: 1rem;\n}\n.author-info.compact[_ngcontent-%COMP%] {\n  gap: 0.5rem;\n  font-size: 0.85rem;\n}\n.author-info.compact[_ngcontent-%COMP%]   .author-separator[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.4);\n}\n.author-info[_ngcontent-%COMP%]   .author-avatar[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  overflow: hidden;\n  flex-shrink: 0;\n}\n.author-info[_ngcontent-%COMP%]   .author-avatar[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.author-info[_ngcontent-%COMP%]   .author-details[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.1rem;\n}\n.author-info[_ngcontent-%COMP%]   .author-name[_ngcontent-%COMP%] {\n  color: #fff;\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.author-info[_ngcontent-%COMP%]   .author-role[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.6);\n  font-size: 0.8rem;\n}\n.article-tags[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n  margin-bottom: 1.5rem;\n}\n.article-tags[_ngcontent-%COMP%]   .tag[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.1);\n  color: rgba(255, 255, 255, 0.8);\n  padding: 0.3rem 0.6rem;\n  border-radius: 12px;\n  font-size: 0.75rem;\n  font-weight: 500;\n  transition: all 0.3s ease;\n}\n.article-tags[_ngcontent-%COMP%]   .tag.small[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.7rem;\n}\n.article-tags[_ngcontent-%COMP%]   .tag[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.2);\n  color: #fff;\n}\n.article-tags[_ngcontent-%COMP%]   .tag-more[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.5);\n  font-size: 0.75rem;\n  font-style: italic;\n}\n.read-more[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: #ff7f50;\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.read-more[_ngcontent-%COMP%]   .read-more-arrow[_ngcontent-%COMP%] {\n  transition: transform 0.3s ease;\n}\n.featured-article[_ngcontent-%COMP%]:hover   .read-more[_ngcontent-%COMP%]   .read-more-arrow[_ngcontent-%COMP%] {\n  transform: translateX(3px);\n}\n.no-results[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 4rem 2rem;\n  color: rgba(255, 255, 255, 0.7);\n}\n.no-results[_ngcontent-%COMP%]   .no-results-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  margin-bottom: 1.5rem;\n  opacity: 0.5;\n}\n.no-results[_ngcontent-%COMP%]   .no-results-title[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  margin-bottom: 1rem;\n  color: #fff;\n}\n.no-results[_ngcontent-%COMP%]   .no-results-text[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  margin-bottom: 2rem;\n  max-width: 500px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.newsletter-cta[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.4) 0%,\n      rgba(248, 249, 250, 0.45) 50%,\n      rgba(255, 255, 255, 0.4) 100%);\n  -webkit-backdrop-filter: blur(5px);\n  backdrop-filter: blur(5px);\n  margin: 4rem 0;\n  width: 100vw;\n  margin-left: calc(-50vw + 50%);\n  margin-right: calc(-50vw + 50%);\n  border-radius: 8px;\n  padding: 4rem 2rem;\n}\n.newsletter-cta[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: -50%;\n  left: -50%;\n  width: 200%;\n  height: 200%;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 127, 80, 0.1) 0%,\n      transparent 70%);\n  animation: _ngcontent-%COMP%_rotate 20s linear infinite;\n  pointer-events: none;\n}\n@keyframes _ngcontent-%COMP%_rotate {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%] {\n  max-width: 800px;\n  margin: 0 auto;\n  text-align: center;\n}\n.newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-title[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  margin-bottom: 2rem;\n  color: #fff;\n  font-weight: 700;\n}\n.newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-text[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  line-height: 1.8;\n  margin-bottom: 3rem;\n  color: rgba(255, 255, 255, 0.8);\n  max-width: 600px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-buttons[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 2rem;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n.newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-buttons[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n  padding: 1rem 2rem;\n  border-radius: 12px;\n  border: none;\n  cursor: pointer;\n  font-weight: 600;\n  font-size: 1rem;\n  transition: all 0.3s ease;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  min-width: 200px;\n}\n.newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-buttons[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]   .button-icon[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n}\n.newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-buttons[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%]   .button-description[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  opacity: 0.9;\n  font-weight: 400;\n}\n.newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-buttons[_ngcontent-%COMP%]   .button.primary[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff,\n      #f0f0f0);\n  color: white;\n}\n.newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-buttons[_ngcontent-%COMP%]   .button.primary[_ngcontent-%COMP%]:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 8px 25px rgba(255, 127, 80, 0.3);\n}\n.newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-buttons[_ngcontent-%COMP%]   .button.secondary[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.1);\n  color: #fff;\n  border: 2px solid rgba(255, 255, 255, 0.2);\n}\n.newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-buttons[_ngcontent-%COMP%]   .button.secondary[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.2);\n  border-color: #ff7f50;\n  transform: translateY(-3px);\n}\n@keyframes _ngcontent-%COMP%_titlePulse {\n  0% {\n    filter: brightness(1) saturate(1);\n  }\n  100% {\n    filter: brightness(1.1) saturate(1.2);\n  }\n}\n@keyframes _ngcontent-%COMP%_borderGlow {\n  0%, 100% {\n    background-position: 0% 50%;\n  }\n  50% {\n    background-position: 100% 50%;\n  }\n}\n@keyframes _ngcontent-%COMP%_cardFloatIn {\n  0% {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_shimmer {\n  0% {\n    transform: translateX(-100%);\n  }\n  100% {\n    transform: translateX(100%);\n  }\n}\n.featured-article[_ngcontent-%COMP%], \n.news-article[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_cardFloatIn 0.6s ease-out;\n  animation-fill-mode: both;\n}\n.featured-article[_ngcontent-%COMP%]::after, \n.news-article[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255, 255, 255, 0.1),\n      transparent);\n  transition: left 0.5s ease;\n  pointer-events: none;\n  opacity: 0;\n}\n.featured-article[_ngcontent-%COMP%]:hover::after, \n.news-article[_ngcontent-%COMP%]:hover::after {\n  left: 100%;\n  opacity: 1;\n}\n.featured-article[_ngcontent-%COMP%]:nth-child(1), \n.news-article[_ngcontent-%COMP%]:nth-child(1) {\n  animation-delay: 0.1s;\n}\n.featured-article[_ngcontent-%COMP%]:nth-child(2), \n.news-article[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.2s;\n}\n.featured-article[_ngcontent-%COMP%]:nth-child(3), \n.news-article[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.3s;\n}\n.featured-article[_ngcontent-%COMP%]:nth-child(4), \n.news-article[_ngcontent-%COMP%]:nth-child(4) {\n  animation-delay: 0.4s;\n}\n.featured-article[_ngcontent-%COMP%]:nth-child(5), \n.news-article[_ngcontent-%COMP%]:nth-child(5) {\n  animation-delay: 0.5s;\n}\n.featured-article[_ngcontent-%COMP%]:nth-child(6), \n.news-article[_ngcontent-%COMP%]:nth-child(6) {\n  animation-delay: 0.6s;\n}\n.featured-article[_ngcontent-%COMP%]:nth-child(7), \n.news-article[_ngcontent-%COMP%]:nth-child(7) {\n  animation-delay: 0.7s;\n}\n.featured-article[_ngcontent-%COMP%]:nth-child(8), \n.news-article[_ngcontent-%COMP%]:nth-child(8) {\n  animation-delay: 0.8s;\n}\n.featured-article[_ngcontent-%COMP%]:nth-child(9), \n.news-article[_ngcontent-%COMP%]:nth-child(9) {\n  animation-delay: 0.9s;\n}\n.featured-article[_ngcontent-%COMP%]:nth-child(10), \n.news-article[_ngcontent-%COMP%]:nth-child(10) {\n  animation-delay: 1s;\n}\n.filter-button[_ngcontent-%COMP%] {\n  position: relative;\n  overflow: hidden;\n}\n.filter-button[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0;\n  height: 0;\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 50%;\n  transform: translate(-50%, -50%);\n  transition: width 0.3s ease, height 0.3s ease;\n}\n.filter-button[_ngcontent-%COMP%]:hover::before {\n  width: 100%;\n  height: 100%;\n}\n.search-input[_ngcontent-%COMP%]:focus {\n  transform: scale(1.02);\n  box-shadow: 0 0 0 3px rgba(255, 127, 80, 0.2);\n}\n.loading-skeleton[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.1) 25%,\n      rgba(255, 255, 255, 0.2) 50%,\n      rgba(255, 255, 255, 0.1) 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_shimmer 1.5s infinite;\n}\n@media (max-width: 768px) {\n  .news-page[_ngcontent-%COMP%] {\n    min-height: calc(100vh + 700px) !important;\n    height: 100vh !important;\n  }\n  .news-main[_ngcontent-%COMP%] {\n    padding-bottom: 18rem !important;\n    min-height: calc(100vh + 800px) !important;\n  }\n  .hero[_ngcontent-%COMP%] {\n    padding: 2rem 0;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%] {\n    padding: 2rem 1.5rem;\n    border-radius: 20px;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n    font-size: 2.5rem;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .filters[_ngcontent-%COMP%]   .filter-container[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n  }\n  .category-filters[_ngcontent-%COMP%]   .filter-button[_ngcontent-%COMP%] {\n    padding: 0.6rem 1rem;\n    font-size: 0.85rem;\n  }\n  .section-title[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n  .featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 2rem;\n  }\n  .featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]   .article-image[_ngcontent-%COMP%] {\n    height: 160px;\n  }\n  .featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]   .article-content[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n  }\n  .featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]   .article-title[_ngcontent-%COMP%] {\n    font-size: 1.3rem;\n  }\n  .news-articles[_ngcontent-%COMP%]   .articles-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 1.5rem;\n  }\n  .news-articles[_ngcontent-%COMP%]   .articles-grid[_ngcontent-%COMP%]   .news-article[_ngcontent-%COMP%] {\n    padding: 1.25rem;\n  }\n  .news-articles[_ngcontent-%COMP%]   .articles-grid[_ngcontent-%COMP%]   .news-article[_ngcontent-%COMP%]   .article-title[_ngcontent-%COMP%] {\n    font-size: 1.3rem;\n  }\n  .newsletter-cta[_ngcontent-%COMP%] {\n    padding: 3rem 1rem;\n  }\n  .newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-title[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n  .newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-buttons[_ngcontent-%COMP%] {\n    flex-direction: column;\n    align-items: center;\n    gap: 1.5rem;\n  }\n  .newsletter-cta[_ngcontent-%COMP%]   .cta-content[_ngcontent-%COMP%]   .cta-buttons[_ngcontent-%COMP%]   .button[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 300px;\n  }\n}\n@media (max-width: 480px) {\n  .news-page[_ngcontent-%COMP%] {\n    min-height: calc(100vh + 900px) !important;\n  }\n  .news-main[_ngcontent-%COMP%] {\n    padding: 0 1rem;\n    padding-top: 2rem;\n    padding-bottom: 22rem !important;\n    min-height: calc(100vh + 900px) !important;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%] {\n    padding: 1.5rem 1rem;\n    border-radius: 16px;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    font-size: 1.1rem;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .featured-news[_ngcontent-%COMP%]   .featured-grid[_ngcontent-%COMP%]   .featured-article[_ngcontent-%COMP%]   .article-content[_ngcontent-%COMP%] {\n    padding: 1.25rem;\n  }\n  .search-section[_ngcontent-%COMP%]   .search-input-container[_ngcontent-%COMP%]   .search-input[_ngcontent-%COMP%] {\n    padding: 0.875rem 1.25rem;\n    padding-right: 2.75rem;\n    font-size: 0.9rem;\n  }\n  .category-filters[_ngcontent-%COMP%] {\n    gap: 0.75rem;\n  }\n  .category-filters[_ngcontent-%COMP%]   .filter-button[_ngcontent-%COMP%] {\n    padding: 0.5rem 0.875rem;\n    font-size: 0.8rem;\n  }\n  .category-filters[_ngcontent-%COMP%]   .filter-button[_ngcontent-%COMP%]   .filter-icon[_ngcontent-%COMP%] {\n    font-size: 0.9rem;\n  }\n}\n/*# sourceMappingURL=news.css.map */'], changeDetection: 0 });
var News = _News;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(News, [{
    type: Component,
    args: [{ selector: "app-news", standalone: true, imports: [CommonModule, FormsModule, MatIconModule, HttpClientModule, SiteHeaderComponent, SquaresAnimationComponent, TwitterOptimizedComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: `<!-- News Page -->
<div class="news-page anim-c">
  
  <!-- Site Header -->
  <app-site-header></app-site-header>
  
  <!-- TypeScript-based Square Animation (48 squares, space-like movement) -->
  <app-squares-animation [count]="48" [enabled]="true"></app-squares-animation>

  <!-- Main Content -->
  <main class="news-main">
    
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="title">PROJECT UPDATES</h1>
        <p class="subtitle">Latest News and Announcements</p>
        <p class="description">
          Stay updated with the latest developments, releases, and community highlights 
          from Prismatic Collections. Discover new features, technical improvements, and exciting announcements.
        </p>
      </div>
      <div class="hero-background">
        <div class="overlay"></div>
      </div>
    </section>

    <!-- Optimized Twitter Integration Section -->
    <section class="filters">
      <div class="filter-container twitter-integration">

        <!-- Section Header -->
        <div class="section-header">
          <div class="section-title">
            <mat-icon class="section-icon">alternate_email</mat-icon>
            <h3>Latest from Prismatic Collections</h3>
            <span class="twitter-handle">@{{ getTwitterUsername() }}</span>
          </div>
          <div class="section-subtitle">
            Stay updated with our latest announcements and behind-the-scenes content
          </div>
        </div>

        <!-- Optimized Twitter Component -->
        <app-twitter-optimized
          [config]="{
            showHeader: true,
            showFollowButton: true,
            showRefreshButton: true,
            showStats: false,
            maxHeight: 600,
            autoRefresh: false,
            refreshInterval: 300000,
            enableVirtualScrolling: true,
            loadThreshold: 5
          }"
          (followClick)="onFollowClick()"
          (refreshComplete)="onTwitterRefreshComplete($event)">
        </app-twitter-optimized>

        <!-- Performance Stats (Development Only) -->
        <div class="performance-stats" *ngIf="showPerformanceStats()">
          <div class="stats-grid">
            <div class="stat-item">
              <span class="stat-label">Cache Hit Rate:</span>
              <span class="stat-value">{{ getPerformanceMetrics().cacheHitRate.toFixed(1) }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Memory Usage:</span>
              <span class="stat-value">{{ formatBytes(getPerformanceMetrics().memoryUsage) }}</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">API Efficiency:</span>
              <span class="stat-value">{{ getPerformanceMetrics().apiEfficiency.toFixed(1) }}%</span>
            </div>
            <div class="stat-item">
              <span class="stat-label">Load Time:</span>
              <span class="stat-value">{{ getPerformanceMetrics().loadTime }}ms</span>
            </div>
          </div>
        </div>

      </div>
    </section>

    <!-- Featured Articles Section -->
    <section class="featured-news" *ngIf="featuredArticles().length > 0">
      <h2 class="section-title">Featured Updates</h2>
      
      <div class="featured-grid">
        <article *ngFor="let article of featuredArticles(); trackBy: trackByArticleId" 
                 class="featured-article"
                 (click)="navigateToArticle(article.id)"
                 (mouseenter)="onArticleHover(article.id)">
          
          <!-- Featured Image -->
          <div class="article-image" *ngIf="article.featuredImage">
            <img [src]="article.featuredImage" 
                 [alt]="article.title" 
                 (error)="$event.target.style.display='none'">
            <div class="image-overlay"></div>
          </div>
          
          <!-- Article Content -->
          <div class="article-content">
            
            <!-- Article Meta -->
            <div class="article-meta">
              <span class="category-badge"
                    [style.background]="getCategoryGradient(article.category)">
                <mat-icon class="category-icon">{{ getCategoryIcon(article.category) }}</mat-icon>
                {{ getCategoryLabel(article.category) }}
              </span>
              <span class="publish-date">{{ formatDate(article.publishDate) }}</span>
              <span class="pinned-indicator" *ngIf="article.isPinned"><mat-icon>push_pin</mat-icon> Pinned</span>
            </div>
            
            <!-- Article Title and Subtitle -->
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-subtitle">{{ article.subtitle }}</p>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            
            <!-- Author Info -->
            <div class="author-info">
              <div class="author-avatar" *ngIf="article.author.avatar">
                <img [src]="article.author.avatar" [alt]="article.author.name">
              </div>
              <div class="author-details">
                <span class="author-name">{{ article.author.name }}</span>
                <span class="author-role">{{ article.author.role }}</span>
              </div>
            </div>
            
            <!-- Tags -->
            <div class="article-tags">
              <span *ngFor="let tag of article.tags" class="tag">#{{ tag }}</span>
            </div>
            
            <!-- Read More -->
            <div class="read-more">
              <span class="read-more-text">Read Full Article</span>
              <mat-icon class="read-more-arrow">arrow_forward</mat-icon>
            </div>
            
          </div>
          
        </article>
      </div>
    </section>

    <!-- Regular News Articles -->
    <section class="news-articles">
      <h2 class="section-title" *ngIf="featuredArticles().length > 0">Recent Updates</h2>
      <h2 class="section-title" *ngIf="featuredArticles().length === 0">All Updates</h2>
      
      <!-- No Results Message -->
      <div class="no-results" *ngIf="regularArticles().length === 0 && featuredArticles().length === 0">
        <div class="no-results-icon">\u{1F50D}</div>
        <h3 class="no-results-title">No articles found</h3>
        <p class="no-results-text">
          No news articles are currently available.
        </p>
      </div>
      
      <!-- Articles Grid -->
      <div class="articles-grid" *ngIf="regularArticles().length > 0">
        <article *ngFor="let article of regularArticles(); trackBy: trackByArticleId" 
                 class="news-article"
                 (click)="navigateToArticle(article.id)"
                 (mouseenter)="onArticleHover(article.id)">
          
          <!-- Article Meta -->
          <div class="article-meta">
            <span class="category-badge small"
                  [style.background]="getCategoryGradient(article.category)">
              <span class="category-icon">{{ getCategoryIcon(article.category) }}</span>
              {{ getCategoryLabel(article.category) }}
            </span>
            <span class="publish-date">{{ formatDate(article.publishDate) }}</span>
          </div>
          
          <!-- Article Content -->
          <div class="article-content">
            <h3 class="article-title">{{ article.title }}</h3>
            <p class="article-subtitle" *ngIf="article.subtitle">{{ article.subtitle }}</p>
            <p class="article-excerpt">{{ article.excerpt }}</p>
            
            <!-- Author Info -->
            <div class="author-info compact">
              <span class="author-name">{{ article.author.name }}</span>
              <span class="author-separator">\u2022</span>
              <span class="author-role">{{ article.author.role }}</span>
            </div>
            
            <!-- Tags -->
            <div class="article-tags">
              <span *ngFor="let tag of article.tags.slice(0, 3)" class="tag small">#{{ tag }}</span>
              <span *ngIf="article.tags.length > 3" class="tag-more">+{{ article.tags.length - 3 }} more</span>
            </div>
          </div>
          
          <!-- Read More Indicator -->
          <div class="read-indicator">
            <span class="read-text">Read More</span>
            <mat-icon class="read-arrow">arrow_forward</mat-icon>
          </div>
          
        </article>
      </div>
    </section>

    <!-- Call to Action -->
    <section class="newsletter-cta">
      <div class="cta-content">
        <h2 class="cta-title">Stay Updated</h2>
        <p class="cta-text">
          Never miss an update! Follow our social channels or bookmark this page 
          to stay informed about the latest developments in Prismatic Collections.
        </p>
        <div class="cta-buttons">
          <button class="button primary" (click)="router.navigate(['/socials'])">
            <mat-icon class="button-icon">notifications</mat-icon>
            Follow Us
            <span class="button-description">Join our community channels</span>
          </button>
          <button class="button secondary" (click)="router.navigate(['/collections'])">
            <mat-icon class="button-icon">palette</mat-icon>
            Explore Collections
            <span class="button-description">Discover our interactive experiences</span>
          </button>
        </div>
      </div>
    </section>
    
  </main>
  
</div>
`, styles: ['@charset "UTF-8";\n\n/* src/app/pages/news/news.scss */\n.typography {\n}\n.typography-display-large {\n  font-size: 3.75rem;\n  font-weight: 900;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-display-medium {\n  font-size: 3rem;\n  font-weight: 800;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-heading-1 {\n  font-size: 2.25rem;\n  font-weight: 700;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-heading-2 {\n  font-size: 1.875rem;\n  font-weight: 700;\n  line-height: 1.375;\n}\n.typography-heading-3 {\n  font-size: 1.5rem;\n  font-weight: 600;\n  line-height: 1.375;\n}\n.typography-heading-4 {\n  font-size: 1.25rem;\n  font-weight: 600;\n  line-height: 1.5;\n}\n.typography-body-large {\n  font-size: 1.125rem;\n  font-weight: 400;\n  line-height: 1.625;\n}\n.typography-body-medium,\n.article-excerpt {\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n}\n.typography-body-small {\n  font-size: 0.875rem;\n  font-weight: 400;\n  line-height: 1.5;\n}\n.typography-label-large {\n  font-size: 1rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.0125em;\n}\n.typography-label-medium {\n  font-size: 0.875rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.025em;\n}\n.typography-label-small,\n.article-meta .category-badge {\n  font-size: 0.75rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n}\n@media (max-width: 768px) {\n  .typography-display-large {\n    font-size: 2.25rem;\n  }\n  .typography-display-medium {\n    font-size: 1.875rem;\n  }\n  .typography-heading-1 {\n    font-size: 1.875rem;\n  }\n  .typography-heading-2 {\n    font-size: 1.5rem;\n  }\n}\n@media (max-width: 480px) {\n  .typography-display-large {\n    font-size: 1.875rem;\n  }\n  .typography-display-medium {\n    font-size: 1.5rem;\n  }\n  .typography-heading-1 {\n    font-size: 1.5rem;\n  }\n}\n:root {\n  --primary-color: #ff7f50;\n  --gradient-primary:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      #ff5252);\n  --category-project-updates-color: #6c757d;\n  --category-project-updates-gradient:\n    linear-gradient(\n      135deg,\n      #6c757d,\n      #495057);\n  --category-project-updates-light: rgba(108, 117, 125, 0.1);\n  --category-releases-color: #10b981;\n  --category-releases-gradient:\n    linear-gradient(\n      135deg,\n      #10b981,\n      #059669);\n  --category-releases-light: rgba(16, 185, 129, 0.1);\n  --category-announcements-color: #f59e0b;\n  --category-announcements-gradient:\n    linear-gradient(\n      135deg,\n      #f59e0b,\n      #d97706);\n  --category-announcements-light: rgba(245, 158, 11, 0.1);\n  --category-technical-updates-color: #495057;\n  --category-technical-updates-gradient:\n    linear-gradient(\n      135deg,\n      #495057,\n      #343a40);\n  --category-technical-updates-light: rgba(73, 80, 87, 0.1);\n  --category-community-color: #ec4899;\n  --category-community-gradient:\n    linear-gradient(\n      135deg,\n      #ec4899,\n      #db2777);\n  --category-community-light: rgba(236, 72, 153, 0.1);\n  --social-spotify-color: #1DB954;\n  --social-soundcloud-color: #FF5500;\n  --social-youtube-color: #FF0000;\n  --social-github-color: #333333;\n  --social-discord-color: #5865F2;\n  --social-bandcamp-color: #629AA0;\n  --social-instagram-color: #E4405F;\n  --social-twitter-color: #1DA1F2;\n  --success-color: #10b981;\n  --warning-color: #f59e0b;\n  --error-color: #ef4444;\n  --info-color: #3b82f6;\n}\n.focus-enhanced:focus-visible,\n.interactive-element:focus-visible,\n.filter-button:focus-visible,\n.social-button:focus-visible,\n.news-article:focus-visible,\n.featured-article:focus-visible,\n.artist-card:focus-visible {\n  outline: 3px solid #ff7f50;\n  outline-offset: 2px;\n  border-radius: 4px;\n  box-shadow: 0 0 0 3px rgba(255, 127, 80, 0.2);\n}\n.interactive-element:focus-visible,\n.filter-button:focus-visible,\n.social-button:focus-visible,\n.news-article:focus-visible,\n.featured-article:focus-visible,\n.artist-card:focus-visible {\n  transform: translateY(-1px);\n  transition: all 0.2s ease;\n}\n.interactive-element:active,\n.filter-button:active,\n.social-button:active,\n.news-article:active,\n.featured-article:active,\n.artist-card:active {\n  transform: translateY(0);\n}\n.skip-link {\n  position: absolute;\n  top: -40px;\n  left: 6px;\n  background: #000;\n  color: white;\n  padding: 8px;\n  text-decoration: none;\n  border-radius: 0 0 4px 4px;\n  z-index: 1000;\n}\n.skip-link:focus {\n  top: 0;\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n@media (prefers-contrast: high) {\n  .category-badge,\n  .filter-button,\n  .social-button {\n    border: 2px solid currentColor;\n  }\n  .article-card,\n  .artist-card {\n    border: 1px solid rgba(255, 255, 255, 0.3);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n  .triangle {\n    animation: none !important;\n  }\n  .triangle::after {\n    animation: none !important;\n  }\n}\n.status-indicator::before {\n  content: attr(data-status);\n  font-weight: bold;\n  margin-right: 0.5rem;\n}\n.status-indicator.available::before {\n  content: "\\2713  ";\n  color: #10b981;\n}\n.status-indicator.coming-soon::before {\n  content: "\\23f3  ";\n  color: #f59e0b;\n}\n.status-indicator.unavailable::before {\n  content: "\\2717  ";\n  color: #ef4444;\n}\n.keyboard-nav-active .filter-button:focus,\n.keyboard-nav-active .social-button:focus,\n.keyboard-nav-active .article:focus,\n.keyboard-nav-active .artist-card:focus {\n  transform: scale(1.02);\n  z-index: 10;\n  position: relative;\n}\n.touch-target {\n  min-width: 44px;\n  min-height: 44px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.readable-content {\n  max-width: 65ch;\n  line-height: 1.6;\n}\n.readable-content h1,\n.readable-content h2,\n.readable-content h3,\n.readable-content h4,\n.readable-content h5,\n.readable-content h6 {\n  line-height: 1.3;\n  margin-bottom: 0.5em;\n}\n.readable-content p {\n  margin-bottom: 1em;\n}\n.error-state {\n  color: #ef4444;\n  border-color: #ef4444;\n}\n.error-state:focus {\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);\n}\n.loading-state {\n  position: relative;\n  color: transparent;\n}\n.loading-state::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.1) 25%,\n      rgba(255, 255, 255, 0.2) 50%,\n      rgba(255, 255, 255, 0.1) 75%);\n  background-size: 200% 100%;\n  animation: loading-shimmer 1.5s infinite;\n}\n@keyframes loading-shimmer {\n  0% {\n    background-position: -200% 0;\n  }\n  100% {\n    background-position: 200% 0;\n  }\n}\n@keyframes winterFloat {\n  0% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n  33% {\n    background-position:\n      40px 20px,\n      20px 40px,\n      35px 15px;\n  }\n  66% {\n    background-position:\n      20px 40px,\n      40px 20px,\n      15px 35px;\n  }\n  100% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n}\n:export {\n  winterPrimary: #f0f4f8;\n  winterSecondary: #e6f0f5;\n  winterAccent: #d4e8ef;\n  winterDark: #334155;\n  winterDarker: #1e293b;\n  winterHighlight: #cbd5e1;\n}\n:host ::ng-deep app-site-header {\n  display: block !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  pointer-events: auto !important;\n}\n.news-page {\n  min-height: calc(100vh + 500px);\n  height: 100vh;\n  color: #333333;\n  position: relative;\n  overflow-x: hidden;\n  overflow-y: auto;\n  margin-top: 89px;\n  scroll-behavior: smooth;\n  background:\n    radial-gradient(\n      ellipse at 15% 25%,\n      rgba(255, 255, 255, 0.08) 0%,\n      transparent 40%),\n    radial-gradient(\n      ellipse at 85% 75%,\n      rgba(248, 249, 250, 0.1) 0%,\n      transparent 45%),\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f8f9fa 30%,\n      #e9ecef 60%,\n      #dee2e6 100%);\n}\n.news-page::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background:\n    repeating-linear-gradient(\n      -45deg,\n      transparent 0px,\n      transparent 3px,\n      rgba(74, 158, 255, 0.035) 4px,\n      rgba(74, 158, 255, 0.035) 5px,\n      transparent 6px,\n      transparent 9px,\n      rgba(32, 178, 170, 0.03) 10px,\n      rgba(32, 178, 170, 0.03) 11px,\n      transparent 12px,\n      transparent 15px,\n      rgba(0, 206, 209, 0.025) 16px,\n      rgba(0, 206, 209, 0.025) 17px,\n      transparent 18px,\n      transparent 21px),\n    repeating-linear-gradient(\n      -75deg,\n      transparent 0px,\n      transparent 8px,\n      rgba(74, 158, 255, 0.02) 9px,\n      rgba(74, 158, 255, 0.02) 10px,\n      transparent 11px,\n      transparent 19px);\n  pointer-events: none;\n  z-index: 1;\n}\n.news-page.anim-a::before {\n  animation: diagonalSlideA 8s linear infinite;\n}\n.news-page.anim-b::before {\n  animation: diagonalPulseB 6s ease-in-out infinite;\n}\n.news-page.anim-c::before {\n  animation: diagonalSweepC 4s linear infinite;\n}\n.news-page.anim-d::before {\n  animation: diagonalDriftD 15s linear infinite;\n}\n.news-page.anim-e::before {\n  animation: diagonalBreatheE 7s ease-in-out infinite;\n}\n.news-page.anim-f::before {\n  animation: diagonalColorShiftF 12s ease-in-out infinite;\n}\n.news-page.anim-g::before {\n  animation: diagonalMultiLayerG 20s linear infinite;\n}\n.news-page.anim-h::before {\n  animation: diagonalShimmerH 5s ease-in-out infinite;\n}\n.news-page.anim-i::before {\n  animation: diagonalGlitchI 8s linear infinite;\n}\n.news-page.anim-j::before {\n  animation: diagonalWaveJ 14s ease-in-out infinite;\n}\n.news-page.anim-k::before {\n  animation: diagonalFadeK 9s ease-in-out infinite;\n}\n.news-page.anim-l::before {\n  animation: diagonalBounceL 6s ease-in-out infinite;\n}\n.news-page.anim-m::before {\n  animation: diagonalContinuousM 11s linear infinite;\n}\n.news-page.anim-n::before {\n  animation: diagonalSpiralN 18s linear infinite;\n}\n.news-page.anim-o::before {\n  animation: diagonalZoomPulseO 7s ease-in-out infinite;\n}\n.news-page.anim-p::before {\n  animation: diagonalBlurWavesP 13s ease-in-out infinite;\n}\n.news-page.anim-q::before {\n  animation: diagonalOpacityWavesQ 10s ease-in-out infinite;\n}\n.news-page.anim-r::before {\n  animation: diagonalPositionOscillationR 16s ease-in-out infinite;\n}\n.news-page.anim-s::before {\n  animation: diagonalTemperatureShiftS 14s ease-in-out infinite;\n}\n.news-page.anim-t::before {\n  animation: diagonalMorphingPatternT 12s ease-in-out infinite;\n}\n.news-page.anim-c {\n  overflow-y: auto !important;\n  overflow-x: hidden !important;\n  height: calc(100vh - 89px) !important;\n  scrollbar-width: thin;\n  scrollbar-color: rgba(255, 255, 255, 0.7) rgba(0, 0, 0, 0.3);\n}\n.news-page.anim-c ::-webkit-scrollbar {\n  width: 4px;\n  height: 4px;\n  background: rgba(0, 0, 0, 0.3);\n}\n.news-page.anim-c ::-webkit-scrollbar-track {\n  background: rgba(0, 0, 0, 0.3);\n  border-radius: 2px;\n}\n.news-page.anim-c ::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.7);\n  border-radius: 2px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}\n.news-page.anim-c ::-webkit-scrollbar-thumb:hover {\n  background: hsla(0, 0%, 110%, 0.7);\n}\n@media (hover: none) and (pointer: coarse) {\n  .news-page.anim-c {\n    scrollbar-width: thin;\n    scrollbar-color: rgba(255, 255, 255, 0.8) rgba(0, 0, 0, 0.3);\n  }\n  .news-page.anim-c ::-webkit-scrollbar {\n    width: 6px;\n    height: 6px;\n    background: rgba(0, 0, 0, 0.3);\n  }\n  .news-page.anim-c ::-webkit-scrollbar-track {\n    background: rgba(0, 0, 0, 0.3);\n    border-radius: 3px;\n  }\n  .news-page.anim-c ::-webkit-scrollbar-thumb {\n    background: rgba(255, 255, 255, 0.8);\n    border-radius: 3px;\n    border: 1px solid rgba(255, 255, 255, 0.1);\n  }\n  .news-page.anim-c ::-webkit-scrollbar-thumb:hover {\n    background: hsla(0, 0%, 110%, 0.8);\n  }\n}\n.news-page::after {\n  content: "";\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background:\n    radial-gradient(\n      circle at 10% 10%,\n      rgba(255, 255, 255, 0.03) 1px,\n      transparent 1px),\n    radial-gradient(\n      circle at 90% 90%,\n      rgba(255, 255, 255, 0.025) 1px,\n      transparent 1px),\n    radial-gradient(\n      circle at 30% 70%,\n      rgba(255, 255, 255, 0.02) 1px,\n      transparent 1px);\n  background-size:\n    100px 100px,\n    80px 80px,\n    120px 120px;\n  animation: subtleFloat 20s infinite linear;\n  pointer-events: none;\n  z-index: 0;\n}\n.news-page {\n  height: auto;\n}\n.news-page {\n  --text-primary: #1e293b;\n  --text-secondary: #334155;\n  --text-muted: #64748b;\n  --text-light: #94a3b8;\n}\n@keyframes diagonalSlideA {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 42px 42px, 38px 38px;\n  }\n}\n@keyframes diagonalPulseB {\n  0%, 100% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0.7;\n  }\n  50% {\n    opacity: 0.9;\n  }\n  75% {\n    opacity: 0.6;\n  }\n}\n@keyframes diagonalSweepC {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 84px 84px, 76px 76px;\n  }\n}\n@keyframes diagonalDriftD {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    background-position: 30px 30px, 25px 25px;\n  }\n  75% {\n    background-position: 45px 45px, 38px 38px;\n  }\n  100% {\n    background-position: 60px 60px, 50px 50px;\n  }\n}\n@keyframes diagonalBreatheE {\n  0%, 100% {\n    filter: opacity(1) saturate(1);\n  }\n  50% {\n    filter: opacity(0.4) saturate(1.3);\n  }\n}\n@keyframes diagonalColorShiftF {\n  0%, 100% {\n    filter: hue-rotate(0deg);\n  }\n  33% {\n    filter: hue-rotate(30deg);\n  }\n  66% {\n    filter: hue-rotate(-20deg);\n  }\n}\n@keyframes diagonalMultiLayerG {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 21px 21px, -19px -19px;\n  }\n  50% {\n    background-position: 42px 42px, -38px -38px;\n  }\n  75% {\n    background-position: 63px 63px, -57px -57px;\n  }\n  100% {\n    background-position: 84px 84px, -76px -76px;\n  }\n}\n@keyframes diagonalShimmerH {\n  0%, 100% {\n    filter: brightness(1) contrast(1);\n  }\n  25% {\n    filter: brightness(1.4) contrast(1.2);\n  }\n  50% {\n    filter: brightness(0.8) contrast(1.1);\n  }\n  75% {\n    filter: brightness(1.6) contrast(1.3);\n  }\n}\n@keyframes diagonalGlitchI {\n  0%, 85%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  10% {\n    background-position: 5px 5px, -3px -3px;\n  }\n  15% {\n    background-position: -8px -8px, 6px 6px;\n  }\n  20% {\n    background-position: 12px 12px, -10px -10px;\n  }\n  25% {\n    background-position: -5px -5px, 8px 8px;\n  }\n}\n@keyframes diagonalWaveJ {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 30px 15px, -20px -10px;\n  }\n  50% {\n    background-position: 10px 40px, -15px -25px;\n  }\n  75% {\n    background-position: -20px 25px, 25px -15px;\n  }\n  100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n}\n@keyframes diagonalFadeK {\n  0%, 100% {\n    filter: opacity(1);\n  }\n  20% {\n    filter: opacity(0.2);\n  }\n  40% {\n    filter: opacity(0.8);\n  }\n  60% {\n    filter: opacity(0.1);\n  }\n  80% {\n    filter: opacity(0.6);\n  }\n}\n@keyframes diagonalBounceL {\n  0%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    background-position: -10px -10px, -8px -8px;\n  }\n  75% {\n    background-position: 20px 20px, 16px 16px;\n  }\n}\n@keyframes diagonalContinuousM {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 220px 220px, 200px 200px;\n  }\n}\n@keyframes diagonalSpiralN {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 30px 15px, 25px 12px;\n  }\n  50% {\n    background-position: 15px 30px, 12px 25px;\n  }\n  75% {\n    background-position: -15px 15px, -12px 12px;\n  }\n  100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n}\n@keyframes diagonalZoomPulseO {\n  0%, 100% {\n    background-size: 42px 42px, 38px 38px;\n  }\n  50% {\n    background-size: 60px 60px, 55px 55px;\n  }\n}\n@keyframes diagonalBlurWavesP {\n  0%, 100% {\n    filter: blur(0px);\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    filter: blur(1px);\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    filter: blur(2px);\n    background-position: 30px 30px, 25px 25px;\n  }\n  75% {\n    filter: blur(1px);\n    background-position: 15px 15px, 12px 12px;\n  }\n}\n@keyframes diagonalOpacityWavesQ {\n  0%, 100% {\n    filter: opacity(1);\n  }\n  16% {\n    filter: opacity(0.3);\n  }\n  32% {\n    filter: opacity(0.7);\n  }\n  48% {\n    filter: opacity(0.2);\n  }\n  64% {\n    filter: opacity(0.9);\n  }\n  80% {\n    filter: opacity(0.4);\n  }\n}\n@keyframes diagonalPositionOscillationR {\n  0%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 8px 12px, 6px 10px;\n  }\n  50% {\n    background-position: -12px 8px, -10px 6px;\n  }\n  75% {\n    background-position: 15px -10px, 12px -8px;\n  }\n}\n@keyframes diagonalTemperatureShiftS {\n  0%, 100% {\n    filter: hue-rotate(0deg) brightness(1);\n  }\n  33% {\n    filter: hue-rotate(45deg) brightness(1.2);\n  }\n  66% {\n    filter: hue-rotate(-30deg) brightness(0.8);\n  }\n}\n@keyframes diagonalMorphingPatternT {\n  0%, 100% {\n    background-size: 42px 42px, 38px 38px;\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-size: 55px 55px, 50px 50px;\n    background-position: 20px 10px, 18px 8px;\n  }\n  50% {\n    background-size: 35px 35px, 32px 32px;\n    background-position: 40px 20px, 35px 18px;\n  }\n  75% {\n    background-size: 65px 65px, 60px 60px;\n    background-position: 20px 30px, 18px 25px;\n  }\n}\n@keyframes subtleFloat {\n  0% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n  33% {\n    background-position:\n      30px 20px,\n      20px 40px,\n      40px 10px;\n  }\n  66% {\n    background-position:\n      20px 40px,\n      40px 20px,\n      10px 30px;\n  }\n  100% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n}\n.news-main {\n  position: relative;\n  z-index: 2;\n  padding: 0 2rem;\n  max-width: 1400px;\n  margin: 0 auto;\n  padding-top: 4rem;\n  padding-bottom: 12rem;\n  min-height: calc(100vh + 600px);\n}\n.news-page.anim-c .news-main {\n  min-height: calc(100vh + 500px) !important;\n  padding-bottom: 20rem !important;\n}\n.news-page.anim-c .news-main > * {\n  margin-bottom: 2rem;\n}\n.news-page.anim-c .news-main {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 2rem;\n}\n.hero {\n  position: relative;\n  height: 25vh;\n  min-height: 220px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  margin-bottom: 3rem;\n  max-width: 1200px;\n  margin-left: auto;\n  margin-right: auto;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.25) 0%,\n      rgba(255, 255, 255, 0.22) 50%,\n      rgba(255, 255, 255, 0.18) 100%);\n  backdrop-filter: blur(15px);\n  -webkit-backdrop-filter: blur(15px);\n  border-radius: 24px;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);\n  padding: 3rem 2.5rem;\n}\n.hero::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    radial-gradient(\n      circle at center,\n      rgba(255, 255, 255, 0.05) 0%,\n      transparent 60%);\n  pointer-events: none;\n  z-index: -1;\n}\n.hero .hero-background {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-image: url(/assets/images/ui/composite_bg.png);\n  background-size: cover;\n  background-position: center;\n  z-index: -1;\n}\n.hero .hero-background .overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8));\n}\n.hero .hero-content {\n  text-align: center;\n  z-index: 1;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  max-width: 800px;\n  margin: 0 auto;\n}\n.hero .hero-content .title {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto 1rem auto;\n  font-size: clamp(2rem, 4vw + 1rem, 4.5rem) !important;\n  line-height: 1.15 !important;\n  letter-spacing: clamp(-0.025em, -0.01vw, -0.015em) !important;\n  font-weight: 800 !important;\n  font-family:\n    "DALFITRA",\n    "Raleway",\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    Helvetica,\n    Arial,\n    sans-serif !important;\n  color: #eeeeee !important;\n  -webkit-text-fill-color: #eeeeee !important;\n  background: none !important;\n  -webkit-background-clip: unset !important;\n  background-clip: unset !important;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;\n}\n@media (max-width: 768px) {\n  .hero .hero-content .title {\n    font-size: clamp(1.75rem, 6vw, 2.5rem) !important;\n    font-family:\n      "DALFITRA",\n      "Raleway",\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      Roboto,\n      Helvetica,\n      Arial,\n      sans-serif !important;\n  }\n}\n@media (max-width: 480px) {\n  .hero .hero-content .title {\n    font-size: clamp(1.5rem, 8vw, 2rem) !important;\n    font-family:\n      "DALFITRA",\n      "Raleway",\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      Roboto,\n      Helvetica,\n      Arial,\n      sans-serif !important;\n  }\n}\n.hero .hero-content .subtitle {\n  font-size: clamp(1.125rem, 1.0892857143rem + 0.0111607143vw, 1.25rem);\n  line-height: clamp(1.5, 1.5 + 0.5vw, 1.7);\n  letter-spacing: 0;\n  font-weight: 400;\n}\n.hero .hero-content .subtitle {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.hero .hero-content .subtitle {\n  text-align: center;\n  margin-bottom: clamp(1.5rem, 5vw, 3rem);\n}\n.hero .hero-content .subtitle {\n  color: rgba(255, 255, 255, 0.9);\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto 1rem auto;\n}\n@media (prefers-contrast: high) {\n  .hero .hero-content .subtitle {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .hero .hero-content .subtitle {\n    transition: none;\n    animation: none;\n  }\n}\n.hero .hero-content .subtitle:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .hero .hero-content .subtitle {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n@media (max-width: 768px) {\n  .hero .hero-content .subtitle {\n    text-shadow: none;\n    font-feature-settings: normal;\n    font-variant: normal;\n    font-family:\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      sans-serif;\n    text-rendering: optimizeSpeed;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n}\n.hero .hero-content .description {\n  color: rgba(255, 255, 255, 0.8);\n  font-weight: 500;\n  position: relative;\n  z-index: 2;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto;\n}\n.filters {\n  margin-bottom: 4rem;\n}\n.filters .filter-container.twitter-integration {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.85) 0%,\n      rgba(15, 15, 15, 0.9) 50%,\n      rgba(25, 25, 25, 0.85) 100%);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border-radius: 20px;\n  padding: 2rem;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);\n  margin-bottom: 2rem;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  position: relative;\n  overflow: hidden;\n}\n.filters .filter-container.twitter-integration::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    radial-gradient(\n      circle at 20% 20%,\n      rgba(29, 161, 242, 0.1) 0%,\n      transparent 50%);\n  pointer-events: none;\n}\n.twitter-header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  margin-bottom: 2rem;\n  padding-bottom: 1.5rem;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1);\n  position: relative;\n  z-index: 1;\n}\n.twitter-header .twitter-title {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.twitter-header .twitter-title .twitter-icon {\n  font-size: 1.8rem;\n  filter: hue-rotate(200deg) brightness(1.2);\n}\n.twitter-header .twitter-title h3 {\n  color: #fff;\n  margin: 0;\n  font-weight: 700;\n}\n.twitter-header .twitter-title h3 {\n  font-size: clamp(1.125rem, 1.0178571429rem + 0.0334821429vw, 1.5rem);\n  line-height: clamp(1.35, 1.35 + 0.5vw, 1.45);\n  letter-spacing: 0;\n  font-weight: 500;\n}\n.twitter-header .twitter-title h3 {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n@media (prefers-contrast: high) {\n  .twitter-header .twitter-title h3 {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .twitter-header .twitter-title h3 {\n    transition: none;\n    animation: none;\n  }\n}\n.twitter-header .twitter-title h3:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .twitter-header .twitter-title h3 {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n.twitter-header .twitter-title .twitter-handle {\n  color: rgba(29, 161, 242, 0.8);\n  font-size: 0.9rem;\n  font-weight: 500;\n  background: rgba(29, 161, 242, 0.1);\n  padding: 0.25rem 0.75rem;\n  border-radius: 12px;\n  border: 1px solid rgba(29, 161, 242, 0.2);\n}\n.twitter-header .follow-button {\n  background:\n    linear-gradient(\n      135deg,\n      #1da1f2,\n      #0d8bd9);\n  color: white;\n  border: none;\n  border-radius: 12px;\n  padding: 0.75rem 1.5rem;\n  font-weight: 600;\n  font-size: 0.9rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  text-decoration: none;\n  position: relative;\n  overflow: hidden;\n}\n.twitter-header .follow-button::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255, 255, 255, 0.2),\n      transparent);\n  transition: left 0.5s ease;\n}\n.twitter-header .follow-button:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(29, 161, 242, 0.3);\n}\n.twitter-header .follow-button:hover::before {\n  left: 100%;\n}\n.twitter-header .follow-button:active {\n  transform: translateY(0);\n}\n.twitter-header .follow-button .follow-icon {\n  font-size: 0.8rem;\n}\n.twitter-timeline-container {\n  margin-bottom: 2rem;\n}\n.twitter-timeline-container .twitter-timeline-wrapper {\n  position: relative;\n  min-height: 400px;\n  border-radius: 16px;\n  background: rgba(255, 255, 255, 0.02);\n  border: 1px solid rgba(255, 255, 255, 0.05);\n  overflow: hidden;\n}\n.twitter-timeline-container .twitter-timeline-wrapper.loading {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.twitter-timeline-container .twitter-timeline-wrapper.error {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.twitter-loading {\n  text-align: center;\n  color: rgba(255, 255, 255, 0.7);\n}\n.twitter-loading .loading-spinner {\n  width: 40px;\n  height: 40px;\n  border: 3px solid rgba(29, 161, 242, 0.3);\n  border-top: 3px solid #1da1f2;\n  border-radius: 50%;\n  margin: 0 auto 1rem;\n  animation: spin 1s linear infinite;\n}\n.twitter-loading .loading-text {\n  font-size: 1rem;\n  font-weight: 500;\n  margin: 0;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.twitter-error {\n  text-align: center;\n  color: rgba(255, 255, 255, 0.7);\n}\n.twitter-error .error-icon {\n  font-size: 2.5rem;\n  margin-bottom: 1rem;\n}\n.twitter-error .error-text {\n  font-size: 1.1rem;\n  margin-bottom: 1.5rem;\n  color: rgba(255, 255, 255, 0.8);\n}\n.twitter-error .retry-button {\n  background: rgba(255, 255, 255, 0.1);\n  color: #fff;\n  border: 2px solid rgba(255, 255, 255, 0.2);\n  border-radius: 12px;\n  padding: 0.75rem 1.5rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.9rem;\n  font-weight: 500;\n}\n.twitter-error .retry-button:hover {\n  background: rgba(255, 255, 255, 0.15);\n  border-color: #ff7f50;\n  transform: translateY(-1px);\n}\n.twitter-error .retry-button .retry-icon {\n  font-size: 0.8rem;\n}\n.manual-tweets {\n  padding: 1rem;\n  max-height: 500px;\n  overflow-y: auto;\n}\n.tweet-card {\n  background: rgba(255, 255, 255, 0.05);\n  border: 1px solid rgba(255, 255, 255, 0.08);\n  border-radius: 16px;\n  padding: 1.5rem;\n  margin-bottom: 1rem;\n  transition: all 0.3s ease;\n  position: relative;\n}\n.tweet-card:hover {\n  background: rgba(255, 255, 255, 0.08);\n  border-color: rgba(29, 161, 242, 0.3);\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);\n}\n.tweet-card:last-child {\n  margin-bottom: 0;\n}\n.tweet-header {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1rem;\n}\n.tweet-header .tweet-avatar {\n  width: 48px;\n  height: 48px;\n  border-radius: 50%;\n  overflow: hidden;\n  flex-shrink: 0;\n  border: 2px solid rgba(29, 161, 242, 0.3);\n}\n.tweet-header .tweet-avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.tweet-header .tweet-info {\n  display: flex;\n  flex-direction: column;\n  gap: 0.25rem;\n}\n.tweet-header .tweet-info .tweet-name {\n  color: #fff;\n  font-weight: 700;\n  font-size: 0.95rem;\n}\n.tweet-header .tweet-info .tweet-handle {\n  color: rgba(255, 255, 255, 0.6);\n  font-size: 0.85rem;\n}\n.tweet-header .tweet-info .tweet-date {\n  color: rgba(255, 255, 255, 0.5);\n  font-size: 0.8rem;\n}\n.tweet-content {\n  margin-bottom: 1rem;\n}\n.tweet-content p {\n  color: rgba(255, 255, 255, 0.9);\n  line-height: 1.6;\n  margin: 0;\n  font-size: 0.95rem;\n}\n.tweet-content p ::ng-deep .tweet-hashtag {\n  color: #1da1f2;\n  font-weight: 500;\n}\n.tweet-content p ::ng-deep .tweet-mention {\n  color: #1da1f2;\n  font-weight: 500;\n}\n.tweet-content .tweet-media {\n  margin-top: 1rem;\n  border-radius: 12px;\n  overflow: hidden;\n}\n.tweet-content .tweet-media img {\n  width: 100%;\n  height: auto;\n  max-height: 300px;\n  object-fit: cover;\n  transition: transform 0.3s ease;\n}\n.tweet-content .tweet-media:hover img {\n  transform: scale(1.02);\n}\n.tweet-metrics {\n  display: flex;\n  gap: 1rem;\n  margin-top: 0.75rem;\n  padding-top: 0.75rem;\n  border-top: 1px solid rgba(255, 255, 255, 0.05);\n}\n.tweet-metrics .metric {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  color: rgba(255, 255, 255, 0.6);\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n.tweet-metrics .metric .metric-icon {\n  font-size: 0.7rem;\n}\n.tweet-actions {\n  display: flex;\n  gap: 1rem;\n  margin-top: 1rem;\n}\n.tweet-actions .tweet-action {\n  background: transparent;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  color: rgba(255, 255, 255, 0.7);\n  border-radius: 8px;\n  padding: 0.5rem 1rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  font-size: 0.8rem;\n  font-weight: 500;\n}\n.tweet-actions .tweet-action:hover {\n  background: rgba(255, 255, 255, 0.05);\n  border-color: rgba(29, 161, 242, 0.5);\n  color: #1da1f2;\n}\n.tweet-actions .tweet-action .action-icon {\n  font-size: 0.7rem;\n}\n.twitter-footer {\n  text-align: center;\n  position: relative;\n  z-index: 1;\n}\n.twitter-footer .twitter-footer-text {\n  color: rgba(255, 255, 255, 0.7);\n  font-size: 0.95rem;\n  line-height: 1.6;\n  margin-bottom: 1.5rem;\n  max-width: 600px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.twitter-footer .twitter-footer-text .last-update {\n  display: block;\n  font-size: 0.8rem;\n  color: rgba(255, 255, 255, 0.5);\n  margin-top: 0.5rem;\n  font-style: italic;\n}\n.twitter-footer .twitter-footer-actions {\n  display: flex;\n  gap: 1rem;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n.twitter-footer .twitter-footer-actions .footer-link {\n  padding: 0.75rem 1.5rem;\n  border-radius: 12px;\n  font-weight: 600;\n  font-size: 0.9rem;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  text-decoration: none;\n  border: none;\n}\n.twitter-footer .twitter-footer-actions .footer-link.primary {\n  background:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      rgb(255, 89.6971428571, 29));\n  color: white;\n}\n.twitter-footer .twitter-footer-actions .footer-link.primary:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(255, 127, 80, 0.3);\n}\n.twitter-footer .twitter-footer-actions .footer-link.secondary {\n  background: rgba(255, 255, 255, 0.05);\n  color: rgba(255, 255, 255, 0.8);\n  border: 2px solid rgba(255, 255, 255, 0.1);\n}\n.twitter-footer .twitter-footer-actions .footer-link.secondary:hover:not(:disabled) {\n  background: rgba(255, 255, 255, 0.1);\n  border-color: rgba(255, 255, 255, 0.3);\n  color: #fff;\n}\n.twitter-footer .twitter-footer-actions .footer-link.secondary:disabled {\n  opacity: 0.5;\n  cursor: not-allowed;\n  color: rgba(255, 255, 255, 0.4);\n}\n.twitter-footer .twitter-footer-actions .footer-link .link-icon {\n  font-size: 0.8rem;\n}\n@media (max-width: 768px) {\n  .twitter-header {\n    flex-direction: column;\n    gap: 1rem;\n    text-align: center;\n  }\n  .twitter-header .twitter-title {\n    justify-content: center;\n  }\n  .twitter-header .twitter-title h3 {\n    font-size: 1.3rem;\n  }\n  .twitter-header .follow-button {\n    width: 100%;\n    max-width: 200px;\n    justify-content: center;\n  }\n  .twitter-timeline-wrapper {\n    min-height: 300px;\n  }\n  .tweet-card {\n    padding: 1.25rem;\n  }\n  .tweet-header .tweet-avatar {\n    width: 40px;\n    height: 40px;\n  }\n  .twitter-footer-actions {\n    flex-direction: column;\n    align-items: center;\n  }\n  .twitter-footer-actions .footer-link {\n    width: 100%;\n    max-width: 250px;\n    justify-content: center;\n  }\n}\n@media (max-width: 480px) {\n  .filters .filter-container.twitter-integration {\n    padding: 1.5rem;\n  }\n  .twitter-header .twitter-title {\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n  .twitter-header .twitter-title h3 {\n    font-size: 1.2rem;\n  }\n  .tweet-card {\n    padding: 1rem;\n  }\n  .tweet-actions {\n    flex-direction: column;\n    gap: 0.75rem;\n  }\n  .tweet-actions .tweet-action {\n    width: 100%;\n    justify-content: center;\n  }\n  .manual-tweets {\n    max-height: 400px;\n    padding: 0.75rem;\n  }\n}\n.section-title {\n  position: relative;\n  color: #fff;\n  font-weight: 700;\n}\n.section-title {\n  font-size: clamp(1.875rem, 1.5535714286rem + 0.1004464286vw, 3rem);\n  line-height: clamp(1.2, 1.2 + 0.5vw, 1.3);\n  letter-spacing: -0.025em;\n  font-weight: 700;\n}\n.section-title {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.section-title {\n  text-align: center;\n  margin-bottom: clamp(2rem, 6vw, 4rem);\n}\n@media (prefers-contrast: high) {\n  .section-title {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .section-title {\n    transition: none;\n    animation: none;\n  }\n}\n.section-title:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .section-title {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n@media (max-width: 768px) {\n  .section-title {\n    text-shadow: none;\n    font-feature-settings: normal;\n    font-variant: normal;\n    font-family:\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      sans-serif;\n    text-rendering: optimizeSpeed;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n}\n.section-title:after {\n  content: "";\n  position: absolute;\n  bottom: -15px;\n  left: 50%;\n  transform: translateX(-50%);\n  width: 80px;\n  height: 4px;\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff,\n      #f0f0f0);\n  border-radius: 2px;\n}\n.featured-news {\n  margin-bottom: 5rem;\n}\n.featured-news .featured-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));\n  gap: 3rem;\n  justify-content: center;\n}\n.featured-news .featured-grid .featured-article {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.45) 0%,\n      rgba(248, 249, 250, 0.4) 50%,\n      rgba(255, 255, 255, 0.45) 100%);\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  border-radius: 20px;\n  padding: 0;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);\n  transition: all 0.3s ease;\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n}\n.featured-news .featured-grid .featured-article:hover {\n  transform: translateY(-10px);\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);\n}\n.featured-news .featured-grid .featured-article::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 4px;\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff,\n      #f0f0f0);\n  opacity: 0;\n  transition: opacity 0.3s ease;\n}\n.featured-news .featured-grid .featured-article:hover::before {\n  opacity: 1;\n}\n.featured-news .featured-grid .featured-article .article-image {\n  position: relative;\n  height: 200px;\n  overflow: hidden;\n  border-radius: 20px 20px 0 0;\n}\n.featured-news .featured-grid .featured-article .article-image img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.5s ease;\n}\n.featured-news .featured-grid .featured-article .article-image .image-overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    linear-gradient(\n      to bottom,\n      transparent 0%,\n      rgba(0, 0, 0, 0.3) 100%);\n}\n.featured-news .featured-grid .featured-article .article-image:hover img {\n  transform: scale(1.05);\n}\n.featured-news .featured-grid .featured-article .article-content {\n  padding: 2rem;\n}\n.news-articles .articles-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));\n  gap: 2rem;\n}\n.news-articles .articles-grid .news-article {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.35) 0%,\n      rgba(248, 249, 250, 0.3) 50%,\n      rgba(255, 255, 255, 0.35) 100%);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n  border-radius: 20px;\n  padding: 1.5rem;\n  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);\n  transition: all 0.3s ease;\n  cursor: pointer;\n  position: relative;\n  overflow: hidden;\n}\n.news-articles .articles-grid .news-article:hover {\n  transform: translateY(-5px);\n  box-shadow: 0 15px 45px rgba(0, 0, 0, 0.35);\n}\n.news-articles .articles-grid .news-article:hover .read-indicator {\n  opacity: 1;\n  transform: translateX(0);\n}\n.news-articles .articles-grid .news-article .read-indicator {\n  position: absolute;\n  bottom: 1rem;\n  right: 1.5rem;\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: #ff7f50;\n  font-size: 0.85rem;\n  font-weight: 500;\n  opacity: 0;\n  transform: translateX(-10px);\n  transition: all 0.3s ease;\n}\n.news-articles .articles-grid .news-article .read-indicator .read-arrow {\n  transition: transform 0.3s ease;\n}\n.news-articles .articles-grid .news-article:hover .read-indicator .read-arrow {\n  transform: translateX(3px);\n}\n.article-meta {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  margin-bottom: 1rem;\n  flex-wrap: wrap;\n}\n.article-meta .category-badge {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.25rem;\n  color: white;\n  padding: 0.35rem 0.85rem;\n  border-radius: 15px;\n  background: var(--category-project-updates-gradient, linear-gradient(135deg, #ffffff, #f0f0f0));\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);\n  transition: all 0.2s ease;\n}\n.article-meta .category-badge:hover {\n  transform: translateY(-1px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);\n}\n.article-meta .category-badge.small {\n  padding: 0.2rem 0.6rem;\n  font-size: 0.7rem;\n}\n.article-meta .category-badge .category-icon {\n  font-size: 0.8rem;\n}\n.article-meta .publish-date {\n  color: rgba(255, 255, 255, 0.6);\n  font-size: 0.85rem;\n  font-weight: 500;\n}\n.article-meta .pinned-indicator {\n  background: rgba(255, 215, 0, 0.2);\n  color: #ffd700;\n  padding: 0.25rem 0.5rem;\n  border-radius: 10px;\n  font-size: 0.75rem;\n  font-weight: 600;\n}\n.article-title {\n  color: #fff;\n  margin-bottom: clamp(0.375rem, 1.5vw, 0.625rem);\n  transition: color 0.2s ease;\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.article-title {\n  font-size: clamp(1.25rem, 1.0714285714rem + 0.0558035714vw, 1.875rem);\n  line-height: clamp(1.3, 1.3 + 0.5vw, 1.4);\n  letter-spacing: -0.01em;\n  font-weight: 600;\n}\n@media (prefers-contrast: high) {\n  .article-title {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .article-title {\n    transition: none;\n    animation: none;\n  }\n}\n.article-title:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .article-title {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n.featured-article:hover .article-title,\n.news-article:hover .article-title {\n  color: #ff7f50;\n}\n.article-subtitle {\n  color: #ff7f50;\n  margin-bottom: 1rem;\n  font-weight: 500;\n  opacity: 0.9;\n}\n.article-subtitle {\n  font-size: clamp(1.125rem, 1.0892857143rem + 0.0111607143vw, 1.25rem);\n  line-height: clamp(1.5, 1.5 + 0.5vw, 1.7);\n  letter-spacing: 0;\n  font-weight: 400;\n}\n.article-subtitle {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.article-excerpt {\n  color: rgba(255, 255, 255, 0.8);\n  margin-bottom: 1.5rem;\n}\n.author-info {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  margin-bottom: 1rem;\n}\n.author-info.compact {\n  gap: 0.5rem;\n  font-size: 0.85rem;\n}\n.author-info.compact .author-separator {\n  color: rgba(255, 255, 255, 0.4);\n}\n.author-info .author-avatar {\n  width: 32px;\n  height: 32px;\n  border-radius: 50%;\n  overflow: hidden;\n  flex-shrink: 0;\n}\n.author-info .author-avatar img {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n}\n.author-info .author-details {\n  display: flex;\n  flex-direction: column;\n  gap: 0.1rem;\n}\n.author-info .author-name {\n  color: #fff;\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.author-info .author-role {\n  color: rgba(255, 255, 255, 0.6);\n  font-size: 0.8rem;\n}\n.article-tags {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 0.5rem;\n  margin-bottom: 1.5rem;\n}\n.article-tags .tag {\n  background: rgba(255, 255, 255, 0.1);\n  color: rgba(255, 255, 255, 0.8);\n  padding: 0.3rem 0.6rem;\n  border-radius: 12px;\n  font-size: 0.75rem;\n  font-weight: 500;\n  transition: all 0.3s ease;\n}\n.article-tags .tag.small {\n  padding: 0.25rem 0.5rem;\n  font-size: 0.7rem;\n}\n.article-tags .tag:hover {\n  background: rgba(255, 255, 255, 0.2);\n  color: #fff;\n}\n.article-tags .tag-more {\n  color: rgba(255, 255, 255, 0.5);\n  font-size: 0.75rem;\n  font-style: italic;\n}\n.read-more {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  color: #ff7f50;\n  font-weight: 600;\n  font-size: 0.9rem;\n}\n.read-more .read-more-arrow {\n  transition: transform 0.3s ease;\n}\n.featured-article:hover .read-more .read-more-arrow {\n  transform: translateX(3px);\n}\n.no-results {\n  text-align: center;\n  padding: 4rem 2rem;\n  color: rgba(255, 255, 255, 0.7);\n}\n.no-results .no-results-icon {\n  font-size: 4rem;\n  margin-bottom: 1.5rem;\n  opacity: 0.5;\n}\n.no-results .no-results-title {\n  font-size: 1.8rem;\n  margin-bottom: 1rem;\n  color: #fff;\n}\n.no-results .no-results-text {\n  font-size: 1.1rem;\n  margin-bottom: 2rem;\n  max-width: 500px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.newsletter-cta {\n  position: relative;\n  overflow: hidden;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.4) 0%,\n      rgba(248, 249, 250, 0.45) 50%,\n      rgba(255, 255, 255, 0.4) 100%);\n  -webkit-backdrop-filter: blur(5px);\n  backdrop-filter: blur(5px);\n  margin: 4rem 0;\n  width: 100vw;\n  margin-left: calc(-50vw + 50%);\n  margin-right: calc(-50vw + 50%);\n  border-radius: 8px;\n  padding: 4rem 2rem;\n}\n.newsletter-cta::before {\n  content: "";\n  position: absolute;\n  top: -50%;\n  left: -50%;\n  width: 200%;\n  height: 200%;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 127, 80, 0.1) 0%,\n      transparent 70%);\n  animation: rotate 20s linear infinite;\n  pointer-events: none;\n}\n@keyframes rotate {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.newsletter-cta .cta-content {\n  max-width: 800px;\n  margin: 0 auto;\n  text-align: center;\n}\n.newsletter-cta .cta-content .cta-title {\n  font-size: 2.5rem;\n  margin-bottom: 2rem;\n  color: #fff;\n  font-weight: 700;\n}\n.newsletter-cta .cta-content .cta-text {\n  font-size: 1.1rem;\n  line-height: 1.8;\n  margin-bottom: 3rem;\n  color: rgba(255, 255, 255, 0.8);\n  max-width: 600px;\n  margin-left: auto;\n  margin-right: auto;\n}\n.newsletter-cta .cta-content .cta-buttons {\n  display: flex;\n  gap: 2rem;\n  justify-content: center;\n  flex-wrap: wrap;\n}\n.newsletter-cta .cta-content .cta-buttons .button {\n  padding: 1rem 2rem;\n  border-radius: 12px;\n  border: none;\n  cursor: pointer;\n  font-weight: 600;\n  font-size: 1rem;\n  transition: all 0.3s ease;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  min-width: 200px;\n}\n.newsletter-cta .cta-content .cta-buttons .button .button-icon {\n  font-size: 1.5rem;\n}\n.newsletter-cta .cta-content .cta-buttons .button .button-description {\n  font-size: 0.8rem;\n  opacity: 0.9;\n  font-weight: 400;\n}\n.newsletter-cta .cta-content .cta-buttons .button.primary {\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff,\n      #f0f0f0);\n  color: white;\n}\n.newsletter-cta .cta-content .cta-buttons .button.primary:hover {\n  transform: translateY(-3px);\n  box-shadow: 0 8px 25px rgba(255, 127, 80, 0.3);\n}\n.newsletter-cta .cta-content .cta-buttons .button.secondary {\n  background: rgba(255, 255, 255, 0.1);\n  color: #fff;\n  border: 2px solid rgba(255, 255, 255, 0.2);\n}\n.newsletter-cta .cta-content .cta-buttons .button.secondary:hover {\n  background: rgba(255, 255, 255, 0.2);\n  border-color: #ff7f50;\n  transform: translateY(-3px);\n}\n@keyframes titlePulse {\n  0% {\n    filter: brightness(1) saturate(1);\n  }\n  100% {\n    filter: brightness(1.1) saturate(1.2);\n  }\n}\n@keyframes borderGlow {\n  0%, 100% {\n    background-position: 0% 50%;\n  }\n  50% {\n    background-position: 100% 50%;\n  }\n}\n@keyframes cardFloatIn {\n  0% {\n    opacity: 0;\n    transform: translateY(20px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes shimmer {\n  0% {\n    transform: translateX(-100%);\n  }\n  100% {\n    transform: translateX(100%);\n  }\n}\n.featured-article,\n.news-article {\n  animation: cardFloatIn 0.6s ease-out;\n  animation-fill-mode: both;\n}\n.featured-article::after,\n.news-article::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255, 255, 255, 0.1),\n      transparent);\n  transition: left 0.5s ease;\n  pointer-events: none;\n  opacity: 0;\n}\n.featured-article:hover::after,\n.news-article:hover::after {\n  left: 100%;\n  opacity: 1;\n}\n.featured-article:nth-child(1),\n.news-article:nth-child(1) {\n  animation-delay: 0.1s;\n}\n.featured-article:nth-child(2),\n.news-article:nth-child(2) {\n  animation-delay: 0.2s;\n}\n.featured-article:nth-child(3),\n.news-article:nth-child(3) {\n  animation-delay: 0.3s;\n}\n.featured-article:nth-child(4),\n.news-article:nth-child(4) {\n  animation-delay: 0.4s;\n}\n.featured-article:nth-child(5),\n.news-article:nth-child(5) {\n  animation-delay: 0.5s;\n}\n.featured-article:nth-child(6),\n.news-article:nth-child(6) {\n  animation-delay: 0.6s;\n}\n.featured-article:nth-child(7),\n.news-article:nth-child(7) {\n  animation-delay: 0.7s;\n}\n.featured-article:nth-child(8),\n.news-article:nth-child(8) {\n  animation-delay: 0.8s;\n}\n.featured-article:nth-child(9),\n.news-article:nth-child(9) {\n  animation-delay: 0.9s;\n}\n.featured-article:nth-child(10),\n.news-article:nth-child(10) {\n  animation-delay: 1s;\n}\n.filter-button {\n  position: relative;\n  overflow: hidden;\n}\n.filter-button::before {\n  content: "";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 0;\n  height: 0;\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 50%;\n  transform: translate(-50%, -50%);\n  transition: width 0.3s ease, height 0.3s ease;\n}\n.filter-button:hover::before {\n  width: 100%;\n  height: 100%;\n}\n.search-input:focus {\n  transform: scale(1.02);\n  box-shadow: 0 0 0 3px rgba(255, 127, 80, 0.2);\n}\n.loading-skeleton {\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.1) 25%,\n      rgba(255, 255, 255, 0.2) 50%,\n      rgba(255, 255, 255, 0.1) 75%);\n  background-size: 200% 100%;\n  animation: shimmer 1.5s infinite;\n}\n@media (max-width: 768px) {\n  .news-page {\n    min-height: calc(100vh + 700px) !important;\n    height: 100vh !important;\n  }\n  .news-main {\n    padding-bottom: 18rem !important;\n    min-height: calc(100vh + 800px) !important;\n  }\n  .hero {\n    padding: 2rem 0;\n  }\n  .hero .hero-content {\n    padding: 2rem 1.5rem;\n    border-radius: 20px;\n  }\n  .hero .hero-content .title {\n    font-size: 2.5rem;\n  }\n  .hero .hero-content .subtitle {\n    font-size: 1.2rem;\n  }\n  .filters .filter-container {\n    padding: 1.5rem;\n  }\n  .category-filters .filter-button {\n    padding: 0.6rem 1rem;\n    font-size: 0.85rem;\n  }\n  .section-title {\n    font-size: 2rem;\n  }\n  .featured-news .featured-grid {\n    grid-template-columns: 1fr;\n    gap: 2rem;\n  }\n  .featured-news .featured-grid .featured-article .article-image {\n    height: 160px;\n  }\n  .featured-news .featured-grid .featured-article .article-content {\n    padding: 1.5rem;\n  }\n  .featured-news .featured-grid .featured-article .article-title {\n    font-size: 1.3rem;\n  }\n  .news-articles .articles-grid {\n    grid-template-columns: 1fr;\n    gap: 1.5rem;\n  }\n  .news-articles .articles-grid .news-article {\n    padding: 1.25rem;\n  }\n  .news-articles .articles-grid .news-article .article-title {\n    font-size: 1.3rem;\n  }\n  .newsletter-cta {\n    padding: 3rem 1rem;\n  }\n  .newsletter-cta .cta-content .cta-title {\n    font-size: 2rem;\n  }\n  .newsletter-cta .cta-content .cta-buttons {\n    flex-direction: column;\n    align-items: center;\n    gap: 1.5rem;\n  }\n  .newsletter-cta .cta-content .cta-buttons .button {\n    width: 100%;\n    max-width: 300px;\n  }\n}\n@media (max-width: 480px) {\n  .news-page {\n    min-height: calc(100vh + 900px) !important;\n  }\n  .news-main {\n    padding: 0 1rem;\n    padding-top: 2rem;\n    padding-bottom: 22rem !important;\n    min-height: calc(100vh + 900px) !important;\n  }\n  .hero .hero-content {\n    padding: 1.5rem 1rem;\n    border-radius: 16px;\n  }\n  .hero .hero-content .title {\n    font-size: 2rem;\n  }\n  .hero .hero-content .subtitle {\n    font-size: 1.1rem;\n  }\n  .hero .hero-content .description {\n    font-size: 1rem;\n  }\n  .featured-news .featured-grid .featured-article .article-content {\n    padding: 1.25rem;\n  }\n  .search-section .search-input-container .search-input {\n    padding: 0.875rem 1.25rem;\n    padding-right: 2.75rem;\n    font-size: 0.9rem;\n  }\n  .category-filters {\n    gap: 0.75rem;\n  }\n  .category-filters .filter-button {\n    padding: 0.5rem 0.875rem;\n    font-size: 0.8rem;\n  }\n  .category-filters .filter-button .filter-icon {\n    font-size: 0.9rem;\n  }\n}\n/*# sourceMappingURL=news.css.map */\n'] }]
  }], () => [{ type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(News, { className: "News", filePath: "src/app/pages/news/news.ts", lineNumber: 58 });
})();
export {
  News
};
/*! Bundled license information:

@angular/core/fesm2022/rxjs-interop.mjs:
  (**
   * @license Angular v20.1.4
   * (c) 2010-2025 Google LLC. https://angular.io/
   * License: MIT
   *)
*/
//# sourceMappingURL=chunk-Y4NE4BNY.js.map
