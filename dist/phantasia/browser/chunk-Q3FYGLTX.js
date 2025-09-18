import {
  Router
} from "./chunk-FJNAFJM7.js";
import {
  CommonModule,
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵtext
} from "./chunk-F34NQEWD.js";

// src/app/pages/test-home/test-home.component.ts
var _TestHomeComponent = class _TestHomeComponent {
  constructor(router) {
    this.router = router;
    console.log("TEST HOME COMPONENT LOADED");
  }
  navigate() {
    console.log("Navigate to collections");
    this.router.navigateByUrl("/collections");
  }
};
_TestHomeComponent.\u0275fac = function TestHomeComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _TestHomeComponent)(\u0275\u0275directiveInject(Router));
};
_TestHomeComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _TestHomeComponent, selectors: [["app-test-home"]], decls: 5, vars: 0, consts: [[1, "hero-buttons"], [1, "button", "primary", 3, "click"]], template: function TestHomeComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "p");
    \u0275\u0275text(1, "test-home works!");
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(2, "div", 0)(3, "button", 1);
    \u0275\u0275domListener("click", function TestHomeComponent_Template_button_click_3_listener() {
      return ctx.navigate();
    });
    \u0275\u0275text(4, " Explore Collections TEST ");
    \u0275\u0275domElementEnd()();
  }
}, dependencies: [CommonModule], encapsulation: 2 });
var TestHomeComponent = _TestHomeComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(TestHomeComponent, [{
    type: Component,
    args: [{ selector: "app-test-home", standalone: true, imports: [CommonModule], template: '<p>test-home works!</p>\n<div class="hero-buttons">\n  <button class="button primary" (click)="navigate()">\n    Explore Collections TEST\n  </button>\n</div>\n' }]
  }], () => [{ type: Router }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(TestHomeComponent, { className: "TestHomeComponent", filePath: "src/app/pages/test-home/test-home.component.ts", lineNumber: 12 });
})();
export {
  TestHomeComponent
};
//# sourceMappingURL=chunk-Q3FYGLTX.js.map
