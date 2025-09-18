import {
  SiteHeaderComponent
} from "./chunk-YTISND37.js";
import {
  RouterOutlet
} from "./chunk-FJNAFJM7.js";
import {
  Component,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart
} from "./chunk-F34NQEWD.js";

// src/app/pages/collections/phantasia/layout/layout.component.ts
var _PhantasiaLayoutComponent = class _PhantasiaLayoutComponent {
  /**
   * Current year for the copyright text
   * 【✓】
   */
  get currentYear() {
    return (/* @__PURE__ */ new Date()).getFullYear();
  }
};
_PhantasiaLayoutComponent.\u0275fac = function PhantasiaLayoutComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _PhantasiaLayoutComponent)();
};
_PhantasiaLayoutComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PhantasiaLayoutComponent, selectors: [["app-phantasia-layout"]], decls: 4, vars: 0, consts: [[1, "phantasia-layout", "phantasia-collection-page"], [1, "phantasia-content"]], template: function PhantasiaLayoutComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "app-site-header");
    \u0275\u0275elementStart(2, "main", 1);
    \u0275\u0275element(3, "router-outlet");
    \u0275\u0275elementEnd()();
  }
}, dependencies: [RouterOutlet, SiteHeaderComponent], styles: ['@charset "UTF-8";\n\n\n\n.phantasia-layout[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      135deg,\n      #121212,\n      #242424);\n  color: #ffffff;\n  font-family: "Montserrat", sans-serif;\n}\n.phantasia-layout[_ngcontent-%COMP%]:has(app-loading-screen)   app-site-header[_ngcontent-%COMP%] {\n  z-index: 1 !important;\n}\n.phantasia-layout[_ngcontent-%COMP%]   app-loading-screen[_ngcontent-%COMP%]    ~ *[_ngcontent-%COMP%]   app-site-header[_ngcontent-%COMP%], \n.phantasia-layout[_ngcontent-%COMP%]   app-loading-screen[_ngcontent-%COMP%]    + *[_ngcontent-%COMP%]   app-site-header[_ngcontent-%COMP%] {\n  z-index: 1 !important;\n}\n[_ngcontent-%COMP%]:global(.loader-container.visible)    ~ *[_ngcontent-%COMP%]   .phantasia-layout[_ngcontent-%COMP%]   app-site-header[_ngcontent-%COMP%] {\n  z-index: 1 !important;\n}\n.phantasia-content[_ngcontent-%COMP%] {\n  flex: 1;\n  margin: 0;\n  width: 100%;\n  padding: 0;\n  padding-top: 0;\n  margin-top: 0;\n  padding-right: calc(100vw - 100%);\n}\n.phantasia-footer[_ngcontent-%COMP%] {\n  background: rgba(0, 0, 0, 0.8);\n  padding: 3rem 2rem;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%] {\n  max-width: 1200px;\n  margin: 0 auto;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-logo[_ngcontent-%COMP%] {\n  flex: 0 0 100%;\n  margin-bottom: 2rem;\n  text-align: center;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-logo[_ngcontent-%COMP%]   img[_ngcontent-%COMP%] {\n  height: 40px;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 3rem;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .link-group[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  margin-bottom: 1rem;\n  font-weight: 600;\n  background:\n    linear-gradient(\n      90deg,\n      #6a11cb,\n      #2575fc);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .link-group[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%] {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .link-group[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .link-group[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%] {\n  color: #ffffff;\n  text-decoration: none;\n  transition: color 0.3s ease;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-links[_ngcontent-%COMP%]   .link-group[_ngcontent-%COMP%]   ul[_ngcontent-%COMP%]   li[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]:hover {\n  color: #ff7e5f;\n}\n.phantasia-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .copyright[_ngcontent-%COMP%] {\n  flex: 0 0 100%;\n  text-align: center;\n  margin-top: 3rem;\n  font-size: 0.9rem;\n  opacity: 0.7;\n}\n@media (max-width: 768px) {\n  .phantasia-header[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n  .phantasia-header[_ngcontent-%COMP%]   .navigation[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .phantasia-header[_ngcontent-%COMP%]   .menu-toggle[_ngcontent-%COMP%] {\n    display: flex;\n  }\n  .phantasia-content[_ngcontent-%COMP%] {\n    padding: 1rem;\n  }\n}\n.fade-in[_ngcontent-%COMP%] {\n  opacity: 0;\n  transform: translateY(20px);\n  transition: opacity 0.5s ease, transform 0.5s ease;\n}\n.fade-in.visible[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: translateY(0);\n}\n.slide-in-left[_ngcontent-%COMP%] {\n  opacity: 0;\n  transform: translateX(-50px);\n  transition: opacity 0.5s ease, transform 0.5s ease;\n}\n.slide-in-left.visible[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: translateX(0);\n}\n.slide-in-right[_ngcontent-%COMP%] {\n  opacity: 0;\n  transform: translateX(50px);\n  transition: opacity 0.5s ease, transform 0.5s ease;\n}\n.slide-in-right.visible[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: translateX(0);\n}\n.parallax-element[_ngcontent-%COMP%] {\n  will-change: transform;\n  transition: transform 0.1s ease-out;\n}\n/*# sourceMappingURL=layout.component.css.map */'] });
var PhantasiaLayoutComponent = _PhantasiaLayoutComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PhantasiaLayoutComponent, [{
    type: Component,
    args: [{ selector: "app-phantasia-layout", standalone: true, imports: [RouterOutlet, SiteHeaderComponent], template: '<div class="phantasia-layout phantasia-collection-page">\n  <!-- Site Header -->\n  <app-site-header></app-site-header>\n  \n  <!-- Main Content Area -->\n  <main class="phantasia-content">\n    <!-- Router outlet for page content -->\n    <router-outlet></router-outlet>\n  </main>\n\n</div> ', styles: ['@charset "UTF-8";\n\n/* src/app/pages/collections/phantasia/layout/layout.component.scss */\n.phantasia-layout {\n  display: flex;\n  flex-direction: column;\n  min-height: 100vh;\n  background:\n    linear-gradient(\n      135deg,\n      #121212,\n      #242424);\n  color: #ffffff;\n  font-family: "Montserrat", sans-serif;\n}\n.phantasia-layout:has(app-loading-screen) app-site-header {\n  z-index: 1 !important;\n}\n.phantasia-layout app-loading-screen ~ * app-site-header,\n.phantasia-layout app-loading-screen + * app-site-header {\n  z-index: 1 !important;\n}\n:global(.loader-container.visible) ~ * .phantasia-layout app-site-header {\n  z-index: 1 !important;\n}\n.phantasia-content {\n  flex: 1;\n  margin: 0;\n  width: 100%;\n  padding: 0;\n  padding-top: 0;\n  margin-top: 0;\n  padding-right: calc(100vw - 100%);\n}\n.phantasia-footer {\n  background: rgba(0, 0, 0, 0.8);\n  padding: 3rem 2rem;\n}\n.phantasia-footer .footer-content {\n  max-width: 1200px;\n  margin: 0 auto;\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: space-between;\n}\n.phantasia-footer .footer-content .footer-logo {\n  flex: 0 0 100%;\n  margin-bottom: 2rem;\n  text-align: center;\n}\n.phantasia-footer .footer-content .footer-logo img {\n  height: 40px;\n}\n.phantasia-footer .footer-content .footer-links {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 3rem;\n}\n.phantasia-footer .footer-content .footer-links .link-group h3 {\n  font-size: 1.2rem;\n  margin-bottom: 1rem;\n  font-weight: 600;\n  background:\n    linear-gradient(\n      90deg,\n      #6a11cb,\n      #2575fc);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n}\n.phantasia-footer .footer-content .footer-links .link-group ul {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n.phantasia-footer .footer-content .footer-links .link-group ul li {\n  margin-bottom: 0.5rem;\n}\n.phantasia-footer .footer-content .footer-links .link-group ul li a {\n  color: #ffffff;\n  text-decoration: none;\n  transition: color 0.3s ease;\n}\n.phantasia-footer .footer-content .footer-links .link-group ul li a:hover {\n  color: #ff7e5f;\n}\n.phantasia-footer .footer-content .copyright {\n  flex: 0 0 100%;\n  text-align: center;\n  margin-top: 3rem;\n  font-size: 0.9rem;\n  opacity: 0.7;\n}\n@media (max-width: 768px) {\n  .phantasia-header {\n    padding: 1rem;\n  }\n  .phantasia-header .navigation {\n    display: none;\n  }\n  .phantasia-header .menu-toggle {\n    display: flex;\n  }\n  .phantasia-content {\n    padding: 1rem;\n  }\n}\n.fade-in {\n  opacity: 0;\n  transform: translateY(20px);\n  transition: opacity 0.5s ease, transform 0.5s ease;\n}\n.fade-in.visible {\n  opacity: 1;\n  transform: translateY(0);\n}\n.slide-in-left {\n  opacity: 0;\n  transform: translateX(-50px);\n  transition: opacity 0.5s ease, transform 0.5s ease;\n}\n.slide-in-left.visible {\n  opacity: 1;\n  transform: translateX(0);\n}\n.slide-in-right {\n  opacity: 0;\n  transform: translateX(50px);\n  transition: opacity 0.5s ease, transform 0.5s ease;\n}\n.slide-in-right.visible {\n  opacity: 1;\n  transform: translateX(0);\n}\n.parallax-element {\n  will-change: transform;\n  transition: transform 0.1s ease-out;\n}\n/*# sourceMappingURL=layout.component.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PhantasiaLayoutComponent, { className: "PhantasiaLayoutComponent", filePath: "src/app/pages/collections/phantasia/layout/layout.component.ts", lineNumber: 17 });
})();
export {
  PhantasiaLayoutComponent
};
//# sourceMappingURL=chunk-OPDEEQ4Z.js.map
