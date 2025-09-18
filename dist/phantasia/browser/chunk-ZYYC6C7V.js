import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  Input,
  NgForOf,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵproperty,
  ɵɵstyleProp,
  ɵɵtemplate
} from "./chunk-F34NQEWD.js";

// src/app/shared/components/squares-animation/squares-animation.component.ts
function SquaresAnimationComponent_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "div", 4)(2, "div", 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const square_r1 = ctx.$implicit;
    \u0275\u0275styleProp("left", square_r1.x + "vw")("top", square_r1.y + "vh")("--move-x", square_r1.moveX + "px")("--move-y", square_r1.moveY + "px")("--scale", square_r1.scale)("--base-opacity", square_r1.opacity)("--rotation-offset", square_r1.rotationOffset)("--delay", square_r1.delay)("--size", square_r1.size + "px")("--speed", square_r1.speedMultiplier);
    \u0275\u0275classProp("clockwise", square_r1.clockwise)("counter-clockwise", !square_r1.clockwise);
  }
}
var _SquaresAnimationComponent = class _SquaresAnimationComponent {
  constructor(cdr) {
    this.cdr = cdr;
    this.count = 48;
    this.enabled = true;
    this.squares = [];
  }
  /**
   * Initializes the squares animation component
   * Creates randomized square positions with varied animations
   */
  ngOnInit() {
    this.generateSquarePositions();
  }
  ngOnDestroy() {
  }
  trackBySquareId(index, square) {
    return index;
  }
  /**
   * Creates random positions and properties for square elements
   * Generates visually interesting squares with varied space-like behavior
   * Inspired by the Now Loading component's rune system
   */
  generateSquarePositions() {
    this.squares = Array.from({ length: this.count }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.4 + Math.random() * 1.2,
      delay: Math.random() * 8,
      opacity: 0.2 + Math.random() * 0.4,
      moveX: 10 + Math.random() * 30,
      moveY: 10 + Math.random() * 30,
      rotationOffset: Math.random() * 360,
      clockwise: Math.random() < 0.5,
      size: 8 + Math.random() * 16,
      // Square size between 8px and 24px
      speedMultiplier: 0.5 + Math.random() * 1.5
      // Varied animation speeds
    }));
  }
  // Public methods for external control
  setSquareCount(count) {
    this.count = count;
    this.generateSquarePositions();
    this.cdr.markForCheck();
  }
  regenerateSquares() {
    this.generateSquarePositions();
    this.cdr.markForCheck();
  }
};
_SquaresAnimationComponent.\u0275fac = function SquaresAnimationComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SquaresAnimationComponent)(\u0275\u0275directiveInject(ChangeDetectorRef));
};
_SquaresAnimationComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SquaresAnimationComponent, selectors: [["app-squares-animation"]], inputs: { count: "count", enabled: "enabled" }, decls: 3, vars: 2, consts: [["squareContainer", ""], [1, "squares-container"], ["class", "square", 3, "clockwise", "counter-clockwise", "left", "top", "--move-x", "--move-y", "--scale", "--base-opacity", "--rotation-offset", "--delay", "--size", "--speed", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "square"], [1, "square-outer"], [1, "square-inner"]], template: function SquaresAnimationComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1, 0);
    \u0275\u0275template(2, SquaresAnimationComponent_div_2_Template, 3, 24, "div", 2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("ngForOf", ctx.squares)("ngForTrackBy", ctx.trackBySquareId);
  }
}, dependencies: [CommonModule, NgForOf], styles: ['\n\n.squares-container[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  pointer-events: none;\n  z-index: 0;\n  overflow: visible;\n  will-change: transform;\n  backface-visibility: hidden;\n  perspective: 1000px;\n}\n.square[_ngcontent-%COMP%] {\n  position: absolute;\n  width: var(--size);\n  height: var(--size);\n  transform-origin: center center;\n  transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  opacity: var(--base-opacity);\n  will-change: transform, opacity;\n  animation: none;\n}\n.square.clockwise[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_square-move-clockwise calc(8s / var(--speed)) infinite linear;\n  animation-delay: calc(var(--delay) * -1s);\n}\n.square.counter-clockwise[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_square-move-counterclockwise calc(8s / var(--speed)) infinite linear;\n  animation-delay: calc(var(--delay) * -1s);\n}\n.square-outer[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(248, 249, 250, 0.85) 0%,\n      rgba(255, 255, 255, 0.95) 100%);\n  border-radius: 2px;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  z-index: 1;\n  will-change: transform;\n}\n.square-inner[_ngcontent-%COMP%] {\n  position: absolute;\n  width: calc(100% - 6px);\n  height: calc(100% - 6px);\n  top: 3px;\n  left: 3px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.95) 0%,\n      rgba(240, 240, 240, 0.98) 100%);\n  border-radius: 1px;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  box-shadow:\n    0 0 0 2px rgba(255, 255, 255, 0.8),\n    0 0 0 3px rgba(0, 0, 0, 0.6),\n    inset 0 1px 2px rgba(0, 0, 0, 0.1);\n  z-index: 2;\n  will-change: transform;\n  position: relative;\n}\n.square-inner[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      45deg,\n      transparent,\n      rgba(255, 255, 255, 0.6));\n  mix-blend-mode: screen;\n  animation: _ngcontent-%COMP%_sparkle calc(4s * var(--speed)) infinite linear;\n  border-radius: 1px;\n}\n.square-inner[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  width: 140%;\n  height: 140%;\n  top: -20%;\n  left: -20%;\n  background:\n    radial-gradient(\n      circle at center,\n      rgba(120, 200, 255, 0.15) 0%,\n      rgba(70, 150, 255, 0.1) 30%,\n      transparent 70%);\n  mix-blend-mode: screen;\n  opacity: 0.5;\n  border-radius: 50%;\n}\n@keyframes _ngcontent-%COMP%_square-move-clockwise {\n  0% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  }\n  25% {\n    transform: translate(var(--move-x), var(--move-y)) scale(var(--scale)) rotate(calc((90 + var(--rotation-offset)) * 1deg));\n  }\n  50% {\n    transform: translate(0, var(--move-y)) scale(var(--scale)) rotate(calc((180 + var(--rotation-offset)) * 1deg));\n  }\n  75% {\n    transform: translate(calc(var(--move-x) * -1), 0) scale(var(--scale)) rotate(calc((270 + var(--rotation-offset)) * 1deg));\n  }\n  100% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc((360 + var(--rotation-offset)) * 1deg));\n  }\n}\n@keyframes _ngcontent-%COMP%_square-move-counterclockwise {\n  0% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  }\n  25% {\n    transform: translate(var(--move-x), var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 90) * 1deg));\n  }\n  50% {\n    transform: translate(0, var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 180) * 1deg));\n  }\n  75% {\n    transform: translate(calc(var(--move-x) * -1), 0) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 270) * 1deg));\n  }\n  100% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 360) * 1deg));\n  }\n}\n@keyframes _ngcontent-%COMP%_sparkle {\n  0%, 100% {\n    opacity: 0.4;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.8;\n    transform: scale(1.1);\n  }\n}\n/*# sourceMappingURL=squares-animation.component.css.map */'], changeDetection: 0 });
var SquaresAnimationComponent = _SquaresAnimationComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SquaresAnimationComponent, [{
    type: Component,
    args: [{ selector: "app-squares-animation", standalone: true, imports: [CommonModule], template: `
    <div class="squares-container" #squareContainer>
      <div
        *ngFor="let square of squares; trackBy: trackBySquareId"
        class="square"
        [class.clockwise]="square.clockwise"
        [class.counter-clockwise]="!square.clockwise"
        [style.left]="square.x + 'vw'"
        [style.top]="square.y + 'vh'"
        [style.--move-x]="square.moveX + 'px'"
        [style.--move-y]="square.moveY + 'px'"
        [style.--scale]="square.scale"
        [style.--base-opacity]="square.opacity"
        [style.--rotation-offset]="square.rotationOffset"
        [style.--delay]="square.delay"
        [style.--size]="square.size + 'px'"
        [style.--speed]="square.speedMultiplier"
      >
        <div class="square-outer"></div>
        <div class="square-inner"></div>
      </div>
    </div>
  `, changeDetection: ChangeDetectionStrategy.OnPush, styles: ['/* angular:styles/component:scss;611b09a091cdf832d61a5d2f0a2beb4538d7b6df3058c0dc2b8f013d7fbc2169;/home/delta/Projects/PrismaticCollections(SpiralFlip_Site)/src/app/shared/components/squares-animation/squares-animation.component.ts */\n.squares-container {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  pointer-events: none;\n  z-index: 0;\n  overflow: visible;\n  will-change: transform;\n  backface-visibility: hidden;\n  perspective: 1000px;\n}\n.square {\n  position: absolute;\n  width: var(--size);\n  height: var(--size);\n  transform-origin: center center;\n  transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  opacity: var(--base-opacity);\n  will-change: transform, opacity;\n  animation: none;\n}\n.square.clockwise {\n  animation: square-move-clockwise calc(8s / var(--speed)) infinite linear;\n  animation-delay: calc(var(--delay) * -1s);\n}\n.square.counter-clockwise {\n  animation: square-move-counterclockwise calc(8s / var(--speed)) infinite linear;\n  animation-delay: calc(var(--delay) * -1s);\n}\n.square-outer {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(248, 249, 250, 0.85) 0%,\n      rgba(255, 255, 255, 0.95) 100%);\n  border-radius: 2px;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);\n  z-index: 1;\n  will-change: transform;\n}\n.square-inner {\n  position: absolute;\n  width: calc(100% - 6px);\n  height: calc(100% - 6px);\n  top: 3px;\n  left: 3px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.95) 0%,\n      rgba(240, 240, 240, 0.98) 100%);\n  border-radius: 1px;\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  box-shadow:\n    0 0 0 2px rgba(255, 255, 255, 0.8),\n    0 0 0 3px rgba(0, 0, 0, 0.6),\n    inset 0 1px 2px rgba(0, 0, 0, 0.1);\n  z-index: 2;\n  will-change: transform;\n  position: relative;\n}\n.square-inner::before {\n  content: "";\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      45deg,\n      transparent,\n      rgba(255, 255, 255, 0.6));\n  mix-blend-mode: screen;\n  animation: sparkle calc(4s * var(--speed)) infinite linear;\n  border-radius: 1px;\n}\n.square-inner::after {\n  content: "";\n  position: absolute;\n  width: 140%;\n  height: 140%;\n  top: -20%;\n  left: -20%;\n  background:\n    radial-gradient(\n      circle at center,\n      rgba(120, 200, 255, 0.15) 0%,\n      rgba(70, 150, 255, 0.1) 30%,\n      transparent 70%);\n  mix-blend-mode: screen;\n  opacity: 0.5;\n  border-radius: 50%;\n}\n@keyframes square-move-clockwise {\n  0% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  }\n  25% {\n    transform: translate(var(--move-x), var(--move-y)) scale(var(--scale)) rotate(calc((90 + var(--rotation-offset)) * 1deg));\n  }\n  50% {\n    transform: translate(0, var(--move-y)) scale(var(--scale)) rotate(calc((180 + var(--rotation-offset)) * 1deg));\n  }\n  75% {\n    transform: translate(calc(var(--move-x) * -1), 0) scale(var(--scale)) rotate(calc((270 + var(--rotation-offset)) * 1deg));\n  }\n  100% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc((360 + var(--rotation-offset)) * 1deg));\n  }\n}\n@keyframes square-move-counterclockwise {\n  0% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  }\n  25% {\n    transform: translate(var(--move-x), var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 90) * 1deg));\n  }\n  50% {\n    transform: translate(0, var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 180) * 1deg));\n  }\n  75% {\n    transform: translate(calc(var(--move-x) * -1), 0) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 270) * 1deg));\n  }\n  100% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 360) * 1deg));\n  }\n}\n@keyframes sparkle {\n  0%, 100% {\n    opacity: 0.4;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.8;\n    transform: scale(1.1);\n  }\n}\n/*# sourceMappingURL=squares-animation.component.css.map */\n'] }]
  }], () => [{ type: ChangeDetectorRef }], { count: [{
    type: Input
  }], enabled: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SquaresAnimationComponent, { className: "SquaresAnimationComponent", filePath: "src/app/shared/components/squares-animation/squares-animation.component.ts", lineNumber: 206 });
})();

export {
  SquaresAnimationComponent
};
//# sourceMappingURL=chunk-ZYYC6C7V.js.map
