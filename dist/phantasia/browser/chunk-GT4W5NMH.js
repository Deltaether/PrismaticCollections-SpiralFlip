import {
  ArtistCreditService
} from "./chunk-SBHYTBRN.js";
import {
  animate,
  query,
  stagger,
  state,
  style,
  transition,
  trigger
} from "./chunk-L4VH3QWU.js";
import {
  MatIcon,
  MatIconModule
} from "./chunk-3GUFOW2E.js";
import {
  SquaresAnimationComponent
} from "./chunk-ZYYC6C7V.js";
import {
  SiteHeaderComponent
} from "./chunk-YTISND37.js";
import "./chunk-FJNAFJM7.js";
import {
  AsyncPipe,
  BehaviorSubject,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  CommonModule,
  Component,
  Injectable,
  Input,
  NgForOf,
  NgIf,
  NgStyle,
  Subject,
  __spreadProps,
  __spreadValues,
  computed,
  debounceTime,
  distinctUntilChanged,
  map,
  setClassMetadata,
  shareReplay,
  signal,
  takeUntil,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinject,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-F34NQEWD.js";

// src/app/services/comprehensive-artist.service.ts
var _ComprehensiveArtistService = class _ComprehensiveArtistService {
  constructor(artistCreditService) {
    this.artistCreditService = artistCreditService;
    this.allArtistsSubject = new BehaviorSubject([]);
    this.filterSubject = new BehaviorSubject({ project: "all" });
    this.allArtists$ = this.allArtistsSubject.asObservable();
    this.currentFilter$ = this.filterSubject.asObservable();
    this.filteredArtists$ = this.allArtists$.pipe(map((artists) => this.applyFilter(artists, this.filterSubject.value)));
    this.initializeArtists();
  }
  /**
   * Initialize comprehensive artist data
   */
  initializeArtists() {
    const allArtistContributions = this.artistCreditService.getAllArtistsAllProjects();
    const socialsArtists = this.convertToSocialsArtists(allArtistContributions);
    this.allArtistsSubject.next(socialsArtists);
  }
  /**
   * Convert artist contributions to socials artist format
   */
  convertToSocialsArtists(contributions) {
    const artistMap = /* @__PURE__ */ new Map();
    contributions.forEach((contribution) => {
      const existing = artistMap.get(contribution.artistName) || [];
      existing.push(contribution);
      artistMap.set(contribution.artistName, existing);
    });
    const socialsArtists = [];
    artistMap.forEach((artistContributions, artistName) => {
      const primaryContribution = artistContributions[0];
      const projects = this.getArtistProjects(artistName);
      const trackCount = artistContributions.length;
      const role = this.determinePrimaryRole(artistContributions);
      const description = this.generateArtistDescription(artistContributions, projects);
      const socialsArtist = {
        id: this.generateArtistId(artistName),
        name: artistName,
        displayName: primaryContribution.artistDisplayName,
        role,
        description,
        avatar: primaryContribution.avatar || this.getDefaultAvatar(artistName),
        color: primaryContribution.color,
        socialLinks: primaryContribution.socialLinks,
        projects,
        trackCount,
        isMainArtist: this.isMainArtist(artistContributions),
        isFeatured: this.isFeatured(artistContributions),
        bio: this.getArtistBio(artistName)
      };
      socialsArtists.push(socialsArtist);
    });
    return socialsArtists.sort((a, b) => {
      if (a.isMainArtist && !b.isMainArtist)
        return -1;
      if (!a.isMainArtist && b.isMainArtist)
        return 1;
      if (a.trackCount !== b.trackCount)
        return b.trackCount - a.trackCount;
      return a.displayName.localeCompare(b.displayName);
    });
  }
  /**
   * Get projects an artist appears in
   */
  getArtistProjects(artistName) {
    const phantasia1Artists = this.artistCreditService.getProjectArtists("phantasia1");
    const phantasia2Artists = this.artistCreditService.getProjectArtists("phantasia2");
    const projects = [];
    if (phantasia1Artists.some((a) => a.artistName === artistName)) {
      projects.push("phantasia1");
    }
    if (phantasia2Artists.some((a) => a.artistName === artistName)) {
      projects.push("phantasia2");
    }
    return projects;
  }
  /**
   * Determine primary role for an artist
   */
  determinePrimaryRole(contributions) {
    const roleCounts = /* @__PURE__ */ new Map();
    contributions.forEach((contribution) => {
      const count = roleCounts.get(contribution.role) || 0;
      roleCounts.set(contribution.role, count + 1);
    });
    let primaryRole = "Artist";
    let maxCount = 0;
    roleCounts.forEach((count, role) => {
      if (count > maxCount) {
        maxCount = count;
        primaryRole = role;
      }
    });
    return primaryRole;
  }
  /**
   * Generate artist description based on contributions
   */
  generateArtistDescription(contributions, projects) {
    const roles = Array.from(new Set(contributions.map((c) => c.role)));
    const projectNames = projects.map((p) => p === "phantasia1" ? "Phantasia 1" : "Phantasia 2");
    let description = `Contributing as ${roles.slice(0, 2).join(" and ")}`;
    if (roles.length > 2) {
      description += ` among other roles`;
    }
    description += ` across ${projectNames.join(" and ")}.`;
    if (contributions.length > 1) {
      description += ` Featured on ${contributions.length} tracks.`;
    }
    return description;
  }
  /**
   * Check if artist is a main artist
   */
  isMainArtist(contributions) {
    return contributions.some((c) => c.role === "Main Artist" || c.participationType === "Primary");
  }
  /**
   * Check if artist is featured
   */
  isFeatured(contributions) {
    return contributions.some((c) => c.role === "Featured Artist" || c.participationType === "Featured");
  }
  /**
   * Get artist bio from the service
   */
  getArtistBio(artistName) {
    const artistData = this.artistCreditService.getArtistData(artistName);
    return artistData?.bio;
  }
  /**
   * Generate default avatar if none exists
   */
  getDefaultAvatar(artistName) {
    return `assets/images/artists/default-avatar.svg`;
  }
  /**
   * Generate consistent artist ID
   */
  generateArtistId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  }
  /**
   * Apply filter to artists list
   */
  applyFilter(artists, filter) {
    return artists.filter((artist) => {
      if (filter.project && filter.project !== "all") {
        if (!artist.projects.includes(filter.project)) {
          return false;
        }
      }
      if (filter.role && filter.role !== "all") {
        if (artist.role !== filter.role) {
          return false;
        }
      }
      if (filter.hasLinks) {
        const hasLinks = Object.values(artist.socialLinks).some((link) => link && link.length > 0);
        if (!hasLinks) {
          return false;
        }
      }
      if (filter.minTracks && artist.trackCount < filter.minTracks) {
        return false;
      }
      return true;
    });
  }
  // ====== PUBLIC METHODS ======
  /**
   * Get all artists
   */
  getAllArtists() {
    return this.allArtists$;
  }
  /**
   * Get filtered artists
   */
  getFilteredArtists() {
    return this.filteredArtists$;
  }
  /**
   * Set filter for artists
   */
  setFilter(filter) {
    this.filterSubject.next(filter);
  }
  /**
   * Get main artists (those with primary contributions)
   */
  getMainArtists() {
    return this.allArtists$.pipe(map((artists) => artists.filter((artist) => artist.isMainArtist)));
  }
  /**
   * Get featured artists
   */
  getFeaturedArtists() {
    return this.allArtists$.pipe(map((artists) => artists.filter((artist) => artist.isFeatured)));
  }
  /**
   * Get artists by project
   */
  getArtistsByProject(project) {
    return this.allArtists$.pipe(map((artists) => artists.filter((artist) => artist.projects.includes(project))));
  }
  /**
   * Get cross-project artists
   */
  getCrossProjectArtists() {
    return this.allArtists$.pipe(map((artists) => artists.filter((artist) => artist.projects.length > 1)));
  }
  /**
   * Get artists with social links
   */
  getArtistsWithSocialLinks() {
    return this.allArtists$.pipe(map((artists) => artists.filter((artist) => Object.values(artist.socialLinks).some((link) => link && link.length > 0))));
  }
  /**
   * Search artists by name
   */
  searchArtists(query2) {
    return this.allArtists$.pipe(map((artists) => artists.filter((artist) => artist.name.toLowerCase().includes(query2.toLowerCase()) || artist.displayName.toLowerCase().includes(query2.toLowerCase()))));
  }
  /**
   * Get available roles for filtering
   */
  getAvailableRoles() {
    return this.allArtists$.pipe(map((artists) => {
      const roles = new Set(artists.map((artist) => artist.role));
      return Array.from(roles).sort();
    }));
  }
  /**
   * Get project statistics
   */
  getProjectStatistics() {
    return this.allArtists$.pipe(map((artists) => {
      const phantasia1Artists = artists.filter((a) => a.projects.includes("phantasia1"));
      const phantasia2Artists = artists.filter((a) => a.projects.includes("phantasia2"));
      const crossProjectArtists = artists.filter((a) => a.projects.length > 1);
      return {
        phantasia1: {
          artists: phantasia1Artists.length,
          mainArtists: phantasia1Artists.filter((a) => a.isMainArtist).length,
          featured: phantasia1Artists.filter((a) => a.isFeatured).length
        },
        phantasia2: {
          artists: phantasia2Artists.length,
          mainArtists: phantasia2Artists.filter((a) => a.isMainArtist).length,
          featured: phantasia2Artists.filter((a) => a.isFeatured).length
        },
        crossProject: crossProjectArtists.length,
        totalUnique: artists.length
      };
    }));
  }
};
_ComprehensiveArtistService.\u0275fac = function ComprehensiveArtistService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ComprehensiveArtistService)(\u0275\u0275inject(ArtistCreditService));
};
_ComprehensiveArtistService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _ComprehensiveArtistService, factory: _ComprehensiveArtistService.\u0275fac, providedIn: "root" });
var ComprehensiveArtistService = _ComprehensiveArtistService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ComprehensiveArtistService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: ArtistCreditService }], null);
})();

// src/app/components/socials-artist-cards/socials-artist-cards.component.ts
function SocialsArtistCardsComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "button", 13);
    \u0275\u0275listener("click", function SocialsArtistCardsComponent_div_10_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDisplayModeChange("all"));
    });
    \u0275\u0275elementStart(2, "mat-icon");
    \u0275\u0275text(3, "group");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span");
    \u0275\u0275text(5, "All Artists");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "button", 14);
    \u0275\u0275listener("click", function SocialsArtistCardsComponent_div_10_Template_button_click_6_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDisplayModeChange("main"));
    });
    \u0275\u0275elementStart(7, "mat-icon");
    \u0275\u0275text(8, "star");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span");
    \u0275\u0275text(10, "Main");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "button", 15);
    \u0275\u0275listener("click", function SocialsArtistCardsComponent_div_10_Template_button_click_11_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDisplayModeChange("featured"));
    });
    \u0275\u0275elementStart(12, "mat-icon");
    \u0275\u0275text(13, "featured_play_list");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span");
    \u0275\u0275text(15, "Featured");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "button", 16);
    \u0275\u0275listener("click", function SocialsArtistCardsComponent_div_10_Template_button_click_16_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDisplayModeChange("cross-project"));
    });
    \u0275\u0275elementStart(17, "mat-icon");
    \u0275\u0275text(18, "compare_arrows");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span");
    \u0275\u0275text(20, "Both Projects");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(21, "button", 17);
    \u0275\u0275listener("click", function SocialsArtistCardsComponent_div_10_Template_button_click_21_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDisplayModeChange("phantasia1"));
    });
    \u0275\u0275elementStart(22, "mat-icon");
    \u0275\u0275text(23, "album");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "span");
    \u0275\u0275text(25, "P1");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "button", 18);
    \u0275\u0275listener("click", function SocialsArtistCardsComponent_div_10_Template_button_click_26_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onDisplayModeChange("phantasia2"));
    });
    \u0275\u0275elementStart(27, "mat-icon");
    \u0275\u0275text(28, "library_music");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(29, "span");
    \u0275\u0275text(30, "P2");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("active", ctx_r1.displayMode === "all");
    \u0275\u0275advance(5);
    \u0275\u0275classProp("active", ctx_r1.displayMode === "main");
    \u0275\u0275advance(5);
    \u0275\u0275classProp("active", ctx_r1.displayMode === "featured");
    \u0275\u0275advance(5);
    \u0275\u0275classProp("active", ctx_r1.displayMode === "cross-project");
    \u0275\u0275advance(5);
    \u0275\u0275classProp("active", ctx_r1.displayMode === "phantasia1");
    \u0275\u0275advance(5);
    \u0275\u0275classProp("active", ctx_r1.displayMode === "phantasia2");
  }
}
function SocialsArtistCardsComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 19)(1, "div", 20)(2, "span", 21);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 22);
    \u0275\u0275text(5, "Total Artists");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 20)(7, "span", 21);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "span", 22);
    \u0275\u0275text(10, "Phantasia 1");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 20)(12, "span", 21);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "span", 22);
    \u0275\u0275text(15, "Phantasia 2");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "div", 20)(17, "span", 21);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "span", 22);
    \u0275\u0275text(20, "Cross-Project");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const stats_r3 = ctx.ngIf;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(stats_r3.totalUnique);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(stats_r3.phantasia1.artists);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(stats_r3.phantasia2.artists);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(stats_r3.crossProject);
  }
}
function SocialsArtistCardsComponent_div_13_div_1_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const badge_r6 = ctx.$implicit;
    \u0275\u0275styleProp("background-color", badge_r6.color);
    \u0275\u0275property("title", "Phantasia Project " + (badge_r6.id === "phantasia1" ? "1" : "2"));
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", badge_r6.name, " ");
  }
}
function SocialsArtistCardsComponent_div_13_div_1_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43)(1, "mat-icon", 44);
    \u0275\u0275text(2, "music_note");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const card_r5 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate2("", card_r5.trackCount, " track", card_r5.trackCount === 1 ? "" : "s");
  }
}
function SocialsArtistCardsComponent_div_13_div_1_div_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 45)(1, "mat-icon", 44);
    \u0275\u0275text(2, "compare_arrows");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4, "Cross-project artist");
    \u0275\u0275elementEnd()();
  }
}
function SocialsArtistCardsComponent_div_13_div_1_div_19_a_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "a", 50);
    \u0275\u0275listener("click", function SocialsArtistCardsComponent_div_13_div_1_div_19_a_4_Template_a_click_0_listener() {
      const link_r8 = \u0275\u0275restoreView(_r7).$implicit;
      const card_r5 = \u0275\u0275nextContext(2).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSocialLinkClick(link_r8.url, link_r8.platform, card_r5.name));
    });
    \u0275\u0275elementStart(1, "mat-icon", 51);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 52);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "mat-icon", 53);
    \u0275\u0275text(6, "arrow_forward");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const link_r8 = ctx.$implicit;
    const card_r5 = \u0275\u0275nextContext(2).$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("href", link_r8.url, \u0275\u0275sanitizeUrl)("title", ctx_r1.getSocialPlatformName(link_r8.platform) + " - " + card_r5.displayName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getSocialIcon(link_r8.platform));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getSocialPlatformName(link_r8.platform));
  }
}
function SocialsArtistCardsComponent_div_13_div_1_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 46)(1, "h4", 47);
    \u0275\u0275text(2, "Connect");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 48);
    \u0275\u0275template(4, SocialsArtistCardsComponent_div_13_div_1_div_19_a_4_Template, 7, 4, "a", 49);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const card_r5 = \u0275\u0275nextContext().$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("@socialLinksAnimation", "show");
    \u0275\u0275advance(4);
    \u0275\u0275property("ngForOf", ctx_r1.getVisibleSocialLinks(card_r5));
  }
}
function SocialsArtistCardsComponent_div_13_div_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 25)(1, "div", 26)(2, "div", 27)(3, "img", 28);
    \u0275\u0275listener("error", function SocialsArtistCardsComponent_div_13_div_1_Template_img_error_3_listener($event) {
      const card_r5 = \u0275\u0275restoreView(_r4).$implicit;
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onAvatarError($event, card_r5.name));
    });
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 29);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 30);
    \u0275\u0275template(7, SocialsArtistCardsComponent_div_13_div_1_div_7_Template, 2, 4, "div", 31);
    \u0275\u0275elementEnd();
    \u0275\u0275element(8, "div", 32);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 33)(10, "h3", 34);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "p", 35);
    \u0275\u0275text(13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "p", 36);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 37);
    \u0275\u0275template(17, SocialsArtistCardsComponent_div_13_div_1_div_17_Template, 5, 2, "div", 38)(18, SocialsArtistCardsComponent_div_13_div_1_div_18_Template, 5, 0, "div", 39);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(19, SocialsArtistCardsComponent_div_13_div_1_div_19_Template, 5, 2, "div", 40);
    \u0275\u0275element(20, "div", 41);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const card_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("main-artist", card_r5.isMainArtist)("featured-artist", card_r5.isFeatured);
    \u0275\u0275property("@cardAnimation", card_r5.animationState)("ngStyle", ctx_r1.getCardStyle(card_r5));
    \u0275\u0275advance(3);
    \u0275\u0275property("src", card_r5.avatar, \u0275\u0275sanitizeUrl)("alt", card_r5.displayName + " avatar");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getArtistInitials(card_r5.name));
    \u0275\u0275advance();
    \u0275\u0275property("@projectBadge", "show");
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.getProjectBadges(card_r5));
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", "radial-gradient(circle, " + card_r5.color + "40 0%, transparent 70%)");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(card_r5.displayName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.getRoleDisplay(card_r5));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(card_r5.description);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", card_r5.trackCount > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", card_r5.projects.length > 1);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasSocialLinks(card_r5));
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", "radial-gradient(circle at center, " + card_r5.color + "15 0%, transparent 70%)");
  }
}
function SocialsArtistCardsComponent_div_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 23);
    \u0275\u0275template(1, SocialsArtistCardsComponent_div_13_div_1_Template, 21, 21, "div", 24);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cards_r9 = ctx.ngIf;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", cards_r9)("ngForTrackBy", ctx_r1.trackByArtistId);
  }
}
function SocialsArtistCardsComponent_div_15_button_8_Template(rf, ctx) {
  if (rf & 1) {
    const _r10 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 60);
    \u0275\u0275listener("click", function SocialsArtistCardsComponent_div_15_button_8_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r10);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onDisplayModeChange("all"));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "refresh");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3, " Show All Artists ");
    \u0275\u0275elementEnd();
  }
}
function SocialsArtistCardsComponent_div_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 54)(1, "div", 55)(2, "mat-icon", 56);
    \u0275\u0275text(3, "people_outline");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3", 57);
    \u0275\u0275text(5, "No Artists Found");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 58);
    \u0275\u0275text(7, " Try changing the display mode or filters to see more artists. ");
    \u0275\u0275elementEnd();
    \u0275\u0275template(8, SocialsArtistCardsComponent_div_15_button_8_Template, 4, 0, "button", 59);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275property("ngIf", ctx_r1.displayMode !== "all");
  }
}
function SocialsArtistCardsComponent_div_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 61)(1, "div", 62)(2, "div", 63)(3, "mat-icon", 64);
    \u0275\u0275text(4, "refresh");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "h3", 65);
    \u0275\u0275text(6, "Discovering Artists...");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 66);
    \u0275\u0275text(8, " Loading the talented creators behind Prismatic Collections ");
    \u0275\u0275elementEnd()()();
  }
}
function SocialsArtistCardsComponent_div_19_div_1_span_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span");
    \u0275\u0275text(1, " Some artists may be hidden. Use filters to explore more. ");
    \u0275\u0275elementEnd();
  }
}
function SocialsArtistCardsComponent_div_19_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 69)(1, "mat-icon", 70);
    \u0275\u0275text(2, "info");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "p", 71);
    \u0275\u0275text(4, " Showing ");
    \u0275\u0275elementStart(5, "strong");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275text(7);
    \u0275\u0275template(8, SocialsArtistCardsComponent_div_19_div_1_span_8_Template, 2, 0, "span", 72);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const cards_r11 = \u0275\u0275nextContext().ngIf;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(cards_r11.length);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" artist", cards_r11.length === 1 ? "" : "s", " from the Prismatic Collections projects. ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", cards_r11.length === ctx_r1.maxVisibleCards);
  }
}
function SocialsArtistCardsComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 67);
    \u0275\u0275template(1, SocialsArtistCardsComponent_div_19_div_1_Template, 9, 3, "div", 68);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const cards_r11 = ctx.ngIf;
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", cards_r11 && cards_r11.length > 0);
  }
}
var _SocialsArtistCardsComponent = class _SocialsArtistCardsComponent {
  constructor(comprehensiveArtistService, cdr) {
    this.comprehensiveArtistService = comprehensiveArtistService;
    this.cdr = cdr;
    this.destroy$ = new Subject();
    this.cardUpdateSubject = new BehaviorSubject([]);
    this.displayMode = "all";
    this.maxVisibleCards = 24;
    this.enableAnimations = true;
    this.showFilters = true;
    this.compactMode = false;
    this.artistsSignal = signal([], ...ngDevMode ? [{ debugName: "artistsSignal" }] : []);
    this.currentFilterSignal = signal({ project: "all" }, ...ngDevMode ? [{ debugName: "currentFilterSignal" }] : []);
    this.cardsAnimationTriggerSignal = signal(0, ...ngDevMode ? [{ debugName: "cardsAnimationTriggerSignal" }] : []);
    this.artists = computed(() => this.artistsSignal(), ...ngDevMode ? [{ debugName: "artists" }] : []);
    this.currentFilter = computed(() => this.currentFilterSignal(), ...ngDevMode ? [{ debugName: "currentFilter" }] : []);
    this.cardsAnimationTrigger = computed(() => this.cardsAnimationTriggerSignal(), ...ngDevMode ? [{ debugName: "cardsAnimationTrigger" }] : []);
    this.optimizedArtistCards$ = this.cardUpdateSubject.pipe(
      distinctUntilChanged((prev, curr) => this.compareCardArrays(prev, curr)),
      debounceTime(16),
      // 60fps animation timing
      map((cards) => {
        console.log("[SocialsArtistCardsComponent] optimizedArtistCards$ emitting:", cards.length, "cards");
        return cards;
      }),
      shareReplay(1),
      takeUntil(this.destroy$)
    );
    this.availableRoles$ = this.comprehensiveArtistService.getAvailableRoles();
    this.projectStatistics$ = this.comprehensiveArtistService.getProjectStatistics();
  }
  ngOnInit() {
    this.setupArtistTracking();
    console.log("[SocialsArtistCardsComponent] Component initialized");
  }
  /**
   * Setup optimized artist tracking with reactive patterns
   */
  setupArtistTracking() {
    this.getArtistsForDisplayMode().pipe(
      takeUntil(this.destroy$),
      distinctUntilChanged((prev, curr) => this.compareArtistArrays(prev, curr)),
      debounceTime(50)
      // Debounce for smooth updates
    ).subscribe((artists) => {
      this.artistsSignal.set(artists);
      this.updateOptimizedArtistCards(artists);
      this.cdr.markForCheck();
      console.log(`[SocialsArtistCardsComponent] Artists updated: ${artists.length} artists in ${this.displayMode} mode`);
    });
  }
  /**
   * Get artists observable based on display mode
   */
  getArtistsForDisplayMode() {
    switch (this.displayMode) {
      case "main":
        return this.comprehensiveArtistService.getMainArtists();
      case "featured":
        return this.comprehensiveArtistService.getFeaturedArtists();
      case "cross-project":
        return this.comprehensiveArtistService.getCrossProjectArtists();
      case "phantasia1":
        return this.comprehensiveArtistService.getArtistsByProject("phantasia1");
      case "phantasia2":
        return this.comprehensiveArtistService.getArtistsByProject("phantasia2");
      case "all":
      default:
        return this.comprehensiveArtistService.getAllArtists();
    }
  }
  /**
   * Update optimized artist cards with memory-efficient processing
   */
  updateOptimizedArtistCards(artists) {
    console.log("[SocialsArtistCardsComponent] updateOptimizedArtistCards called with artists:", artists.length);
    if (artists.length === 0) {
      console.log("[SocialsArtistCardsComponent] No artists, clearing cards");
      this.clearOptimizedArtistCards();
      return;
    }
    const limitedArtists = artists.slice(0, this.maxVisibleCards);
    const newCards = this.createOptimizedCardData(limitedArtists);
    console.log("[SocialsArtistCardsComponent] Created cards:", newCards.length, "from artists:", limitedArtists.length);
    this.cardUpdateSubject.next(newCards);
    this.cardsAnimationTriggerSignal.update((val) => val + 1);
    this.cdr.markForCheck();
  }
  /**
   * Create optimized card data with minimal object creation
   */
  createOptimizedCardData(artists) {
    return artists.map((artist, index) => __spreadProps(__spreadValues({}, artist), {
      animationState: "enter",
      index
    }));
  }
  /**
   * Get social media icon for platform
   */
  getSocialIcon(platform) {
    const iconMap = {
      youtube: "smart_display",
      twitter: "alternate_email",
      instagram: "photo_camera",
      website: "language",
      carrd: "badge",
      linktr: "link",
      bandcamp: "library_music",
      reelcrafter: "play_circle",
      twitch: "videocam"
    };
    return iconMap[platform] || "link";
  }
  /**
   * Get social media platform display name
   */
  getSocialPlatformName(platform) {
    const nameMap = {
      youtube: "YouTube",
      twitter: "Twitter/X",
      instagram: "Instagram",
      website: "Website",
      carrd: "Carrd",
      linktr: "Linktree",
      bandcamp: "Bandcamp",
      reelcrafter: "ReelCrafter",
      twitch: "Twitch"
    };
    return nameMap[platform] || platform.charAt(0).toUpperCase() + platform.slice(1);
  }
  /**
   * Get CSS custom properties for artist card
   */
  getCardStyle(card) {
    return {
      "--artist-color": card.color || "#6c757d",
      "--card-index": card.index.toString()
    };
  }
  /**
   * Handle social link click
   */
  onSocialLinkClick(url, platform, artistName) {
    console.log("[SocialsArtistCardsComponent] Opening social link:", { url, platform, artistName });
    window.open(url, "_blank", "noopener,noreferrer");
  }
  /**
   * Generate artist initials for avatar fallback
   */
  getArtistInitials(name) {
    return name.split(" ").map((word) => word.charAt(0)).join("").toUpperCase().slice(0, 2);
  }
  /**
   * Check if artist has social links
   */
  hasSocialLinks(artist) {
    return Object.values(artist.socialLinks).some((link) => link && link.length > 0);
  }
  /**
   * Get visible social links for an artist
   */
  getVisibleSocialLinks(artist) {
    return Object.entries(artist.socialLinks).filter(([, url]) => url && url.length > 0).map(([platform, url]) => ({ platform, url }));
  }
  /**
   * Get project badges for artist
   */
  getProjectBadges(artist) {
    return artist.projects.map((project) => ({
      id: project,
      name: project === "phantasia1" ? "P1" : "P2",
      color: project === "phantasia1" ? "#FF6B6B" : "#6C5CE7"
    }));
  }
  /**
   * Get role display text
   */
  getRoleDisplay(artist) {
    if (artist.isMainArtist && artist.isFeatured) {
      return "Main & Featured Artist";
    } else if (artist.isMainArtist) {
      return "Main Artist";
    } else if (artist.isFeatured) {
      return "Featured Artist";
    }
    return artist.role;
  }
  /**
   * Handle filter change
   */
  onFilterChange(filter) {
    this.currentFilterSignal.set(filter);
    this.comprehensiveArtistService.setFilter(filter);
    this.cdr.markForCheck();
  }
  /**
   * Handle display mode change
   */
  onDisplayModeChange(mode) {
    if (mode !== this.displayMode) {
      this.displayMode = mode;
      this.setupArtistTracking();
      this.cdr.markForCheck();
    }
  }
  /**
   * Handle avatar image loading errors
   */
  onAvatarError(event, artistName) {
    console.warn(`Avatar image failed to load for ${artistName}, using initials fallback`);
    const target = event.target;
    target.style.display = "none";
    const parent = target.parentElement;
    if (parent) {
      parent.classList.add("avatar-fallback");
    }
  }
  /**
   * Optimized track by function for Angular *ngFor
   */
  trackByArtistId(index, card) {
    return `${card.id}-${card.animationState}`;
  }
  /**
   * Clear optimized artist cards
   */
  clearOptimizedArtistCards() {
    this.cardUpdateSubject.next([]);
    this.cdr.markForCheck();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.cardUpdateSubject.complete();
    console.log("[SocialsArtistCardsComponent] Component destroyed");
  }
  /**
   * Optimized array comparison for better performance
   */
  compareArtistArrays(prev, curr) {
    if (prev.length !== curr.length)
      return false;
    for (let i = 0; i < prev.length; i++) {
      if (prev[i].id !== curr[i].id)
        return false;
    }
    return true;
  }
  /**
   * Optimized card array comparison
   */
  compareCardArrays(prev, curr) {
    if (prev.length !== curr.length)
      return false;
    for (let i = 0; i < prev.length; i++) {
      if (prev[i].id !== curr[i].id || prev[i].animationState !== curr[i].animationState) {
        return false;
      }
    }
    return true;
  }
};
_SocialsArtistCardsComponent.\u0275fac = function SocialsArtistCardsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SocialsArtistCardsComponent)(\u0275\u0275directiveInject(ComprehensiveArtistService), \u0275\u0275directiveInject(ChangeDetectorRef));
};
_SocialsArtistCardsComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SocialsArtistCardsComponent, selectors: [["app-socials-artist-cards"]], inputs: { displayMode: "displayMode", maxVisibleCards: "maxVisibleCards", enableAnimations: "enableAnimations", showFilters: "showFilters", compactMode: "compactMode" }, decls: 21, vars: 21, consts: [[1, "socials-artist-cards"], [1, "section-header"], [1, "header-content"], [1, "section-title"], [1, "title-icon"], [1, "section-subtitle"], ["class", "display-modes", 4, "ngIf"], ["class", "statistics-bar", 4, "ngIf"], ["class", "artist-cards-grid", 4, "ngIf"], ["class", "empty-state", 4, "ngIf"], ["class", "loading-state", 4, "ngIf"], ["class", "cards-footer", 4, "ngIf"], [1, "display-modes"], ["title", "Show all artists with social links", 1, "mode-button", 3, "click"], ["title", "Show main artists", 1, "mode-button", 3, "click"], ["title", "Show featured artists", 1, "mode-button", 3, "click"], ["title", "Show artists who appear in both projects", 1, "mode-button", 3, "click"], ["title", "Show Phantasia 1 artists", 1, "mode-button", 3, "click"], ["title", "Show Phantasia 2 artists", 1, "mode-button", 3, "click"], [1, "statistics-bar"], [1, "stat-item"], [1, "stat-number"], [1, "stat-label"], [1, "artist-cards-grid"], ["class", "artist-card", 3, "ngStyle", "main-artist", "featured-artist", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "artist-card", 3, "ngStyle"], [1, "artist-avatar"], [1, "avatar-container"], ["loading", "lazy", 1, "avatar-image", 3, "error", "src", "alt"], [1, "avatar-initials"], [1, "project-badges"], ["class", "project-badge", 3, "background-color", "title", 4, "ngFor", "ngForOf"], [1, "avatar-glow"], [1, "artist-info"], [1, "artist-name"], [1, "artist-role"], [1, "artist-description"], [1, "artist-meta"], ["class", "track-count", 4, "ngIf"], ["class", "projects-info", 4, "ngIf"], ["class", "social-links", 4, "ngIf"], [1, "card-glow"], [1, "project-badge", 3, "title"], [1, "track-count"], [1, "meta-icon"], [1, "projects-info"], [1, "social-links"], [1, "links-title"], [1, "social-links-grid"], ["class", "social-link", "target", "_blank", "rel", "noopener noreferrer", 3, "href", "title", "click", 4, "ngFor", "ngForOf"], ["target", "_blank", "rel", "noopener noreferrer", 1, "social-link", 3, "click", "href", "title"], [1, "social-icon"], [1, "social-platform-name"], [1, "social-arrow"], [1, "empty-state"], [1, "empty-content"], [1, "empty-icon"], [1, "empty-title"], [1, "empty-message"], ["class", "reset-button", 3, "click", 4, "ngIf"], [1, "reset-button", 3, "click"], [1, "loading-state"], [1, "loading-content"], [1, "loading-spinner"], [1, "spinning"], [1, "loading-title"], [1, "loading-message"], [1, "cards-footer"], ["class", "footer-content", 4, "ngIf"], [1, "footer-content"], [1, "footer-icon"], [1, "footer-text"], [4, "ngIf"]], template: function SocialsArtistCardsComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "div", 2)(3, "h2", 3)(4, "mat-icon", 4);
    \u0275\u0275text(5, "people");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "span");
    \u0275\u0275text(7, "Featured Artists");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "p", 5);
    \u0275\u0275text(9, " Discover the talented creators behind Prismatic Collections ");
    \u0275\u0275elementEnd()();
    \u0275\u0275template(10, SocialsArtistCardsComponent_div_10_Template, 31, 12, "div", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, SocialsArtistCardsComponent_div_11_Template, 21, 4, "div", 7);
    \u0275\u0275pipe(12, "async");
    \u0275\u0275template(13, SocialsArtistCardsComponent_div_13_Template, 2, 2, "div", 8);
    \u0275\u0275pipe(14, "async");
    \u0275\u0275template(15, SocialsArtistCardsComponent_div_15_Template, 9, 1, "div", 9);
    \u0275\u0275pipe(16, "async");
    \u0275\u0275template(17, SocialsArtistCardsComponent_div_17_Template, 9, 0, "div", 10);
    \u0275\u0275pipe(18, "async");
    \u0275\u0275template(19, SocialsArtistCardsComponent_div_19_Template, 2, 1, "div", 11);
    \u0275\u0275pipe(20, "async");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    let tmp_6_0;
    \u0275\u0275classProp("compact-mode", ctx.compactMode)("with-filters", ctx.showFilters);
    \u0275\u0275property("@cardsContainer", ctx.cardsAnimationTrigger());
    \u0275\u0275advance(10);
    \u0275\u0275property("ngIf", ctx.showFilters);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(12, 11, ctx.projectStatistics$));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(14, 13, ctx.optimizedArtistCards$));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", ((tmp_6_0 = \u0275\u0275pipeBind1(16, 15, ctx.optimizedArtistCards$)) == null ? null : tmp_6_0.length) === 0);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", !\u0275\u0275pipeBind1(18, 17, ctx.optimizedArtistCards$));
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(20, 19, ctx.optimizedArtistCards$));
  }
}, dependencies: [CommonModule, NgForOf, NgIf, NgStyle, MatIconModule, MatIcon, AsyncPipe], styles: ['\n\n.socials-artist-cards[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.8) 0%,\n      rgba(32, 38, 44, 0.6) 25%,\n      rgba(48, 52, 58, 0.4) 50%,\n      rgba(32, 38, 44, 0.6) 75%,\n      rgba(0, 0, 0, 0.8) 100%);\n  -webkit-backdrop-filter: blur(20px);\n  backdrop-filter: blur(20px);\n  border-radius: 32px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  box-shadow:\n    0 12px 40px rgba(0, 0, 0, 0.3),\n    0 6px 20px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.1);\n  overflow: hidden;\n  contain: layout style;\n}\n.socials-artist-cards[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    radial-gradient(\n      circle at 20% 30%,\n      rgba(255, 255, 255, 0.03) 0%,\n      transparent 60%),\n    radial-gradient(\n      circle at 80% 70%,\n      rgba(255, 255, 255, 0.02) 0%,\n      transparent 60%),\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.015) 0%,\n      transparent 50%);\n  pointer-events: none;\n  border-radius: inherit;\n  z-index: 0;\n}\n.socials-artist-cards.compact-mode[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n  border-radius: 24px;\n}\n.socials-artist-cards.compact-mode[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n  padding: 1.5rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  margin-bottom: 3rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  font-size: 2.5rem;\n  font-weight: 700;\n  color: white;\n  margin: 0 0 1rem 0;\n  line-height: 1.2;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%]   .title-icon[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: #6c757d;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .section-subtitle[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0;\n  font-weight: 400;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .display-modes[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 0.75rem;\n  padding: 1.5rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.1) 0%,\n      rgba(255, 255, 255, 0.05) 100%);\n  -webkit-backdrop-filter: blur(20px);\n  backdrop-filter: blur(20px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 20px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .display-modes[_ngcontent-%COMP%]   .mode-button[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.75rem 1.25rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.1) 0%,\n      rgba(255, 255, 255, 0.05) 100%);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 12px;\n  color: rgba(255, 255, 255, 0.8);\n  font-size: 0.9rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .display-modes[_ngcontent-%COMP%]   .mode-button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  width: 1.2rem;\n  height: 1.2rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .display-modes[_ngcontent-%COMP%]   .mode-button[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.2) 0%,\n      rgba(255, 255, 255, 0.1) 100%);\n  border-color: rgba(255, 255, 255, 0.3);\n  color: white;\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .display-modes[_ngcontent-%COMP%]   .mode-button.active[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      #6c757d 0%,\n      #495057 100%);\n  border-color: #6c757d;\n  color: white;\n  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .statistics-bar[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  justify-content: center;\n  gap: 2rem;\n  margin-bottom: 3rem;\n  padding: 1.5rem 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.08) 0%,\n      rgba(255, 255, 255, 0.04) 100%);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 16px;\n  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .statistics-bar[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%] {\n  text-align: center;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .statistics-bar[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   .stat-number[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 2rem;\n  font-weight: 700;\n  color: white;\n  line-height: 1;\n  margin-bottom: 0.25rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .statistics-bar[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.7);\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));\n  gap: 2rem;\n  margin-bottom: 3rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n  position: relative;\n  padding: 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(20, 20, 20, 0.9) 0%,\n      rgba(30, 30, 30, 0.8) 50%,\n      rgba(15, 15, 15, 0.85) 100%);\n  -webkit-backdrop-filter: blur(20px);\n  backdrop-filter: blur(20px);\n  border: 1px solid rgba(60, 60, 60, 0.4);\n  border-radius: 24px;\n  box-shadow:\n    0 10px 30px rgba(0, 0, 0, 0.2),\n    0 4px 15px rgba(0, 0, 0, 0.1),\n    inset 0 1px 0 rgba(255, 255, 255, 0.15);\n  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);\n  overflow: hidden;\n  contain: layout style;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-8px) scale(1.02);\n  box-shadow:\n    0 20px 40px rgba(0, 0, 0, 0.25),\n    0 8px 20px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.2);\n  border-color: rgba(80, 80, 80, 0.6);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]:hover   .avatar-glow[_ngcontent-%COMP%] {\n  opacity: 0.6;\n  transform: scale(1.2);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]:hover   .card-glow[_ngcontent-%COMP%] {\n  opacity: 0.8;\n  transform: scale(1.1);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card.main-artist[_ngcontent-%COMP%] {\n  border-color: rgba(255, 107, 107, 0.4);\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 107, 107, 0.2) 0%,\n      rgba(40, 40, 40, 0.9) 50%,\n      rgba(25, 25, 25, 0.95) 100%);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card.main-artist[_ngcontent-%COMP%]:hover {\n  border-color: rgba(255, 107, 107, 0.6);\n  box-shadow:\n    0 20px 40px rgba(255, 107, 107, 0.2),\n    0 8px 20px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card.featured-artist[_ngcontent-%COMP%] {\n  border-color: rgba(108, 92, 231, 0.4);\n  background:\n    linear-gradient(\n      135deg,\n      rgba(108, 92, 231, 0.2) 0%,\n      rgba(40, 40, 40, 0.9) 50%,\n      rgba(25, 25, 25, 0.95) 100%);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card.featured-artist[_ngcontent-%COMP%]:hover {\n  border-color: rgba(108, 92, 231, 0.6);\n  box-shadow:\n    0 20px 40px rgba(108, 92, 231, 0.2),\n    0 8px 20px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-bottom: 1.5rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  overflow: hidden;\n  border: 3px solid rgba(255, 255, 255, 0.2);\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%]   .avatar-image[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%]   .avatar-initials[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: white;\n  background: var(--artist-color, #6c757d);\n  opacity: 0;\n  transition: opacity 0.3s ease;\n}\n.avatar-container.avatar-fallback[_ngcontent-%COMP%]   .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%]   .avatar-initials[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%]   .avatar-container.avatar-fallback[_ngcontent-%COMP%]   .avatar-image[_ngcontent-%COMP%] {\n  opacity: 0;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .project-badges[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  display: flex;\n  gap: 0.25rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .project-badges[_ngcontent-%COMP%]   .project-badge[_ngcontent-%COMP%] {\n  padding: 0.25rem 0.5rem;\n  border-radius: 8px;\n  font-size: 0.7rem;\n  font-weight: 700;\n  color: white;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .avatar-glow[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 120px;\n  height: 120px;\n  transform: translate(-50%, -50%);\n  border-radius: 50%;\n  opacity: 0.3;\n  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);\n  pointer-events: none;\n  z-index: -1;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 1.5rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: white;\n  margin: 0 0 0.5rem 0;\n  line-height: 1.3;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-role[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0 0 0.75rem 0;\n  font-weight: 500;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-description[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.7);\n  margin: 0 0 1rem 0;\n  line-height: 1.5;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-meta[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-meta[_ngcontent-%COMP%]   .track-count[_ngcontent-%COMP%], \n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-meta[_ngcontent-%COMP%]   .projects-info[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  font-size: 0.8rem;\n  color: rgba(255, 255, 255, 0.6);\n  font-weight: 500;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-meta[_ngcontent-%COMP%]   .track-count[_ngcontent-%COMP%]   .meta-icon[_ngcontent-%COMP%], \n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-meta[_ngcontent-%COMP%]   .projects-info[_ngcontent-%COMP%]   .meta-icon[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  width: 1rem;\n  height: 1rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .links-title[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 600;\n  color: rgba(255, 255, 255, 0.9);\n  margin: 0 0 1rem 0;\n  text-align: center;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-links-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-links-grid[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.75rem 1rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(40, 40, 40, 0.8) 0%,\n      rgba(20, 20, 20, 0.9) 100%);\n  border: 1px solid rgba(60, 60, 60, 0.4);\n  border-radius: 12px;\n  color: rgba(255, 255, 255, 0.8);\n  text-decoration: none;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-links-grid[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]   .social-icon[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  width: 1.2rem;\n  height: 1.2rem;\n  color: rgba(255, 255, 255, 0.7);\n  transition: color 0.3s ease;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-links-grid[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]   .social-platform-name[_ngcontent-%COMP%] {\n  flex: 1;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-links-grid[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]   .social-arrow[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  width: 1rem;\n  height: 1rem;\n  opacity: 0.6;\n  transition: all 0.3s ease;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-links-grid[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(60, 60, 60, 0.8) 0%,\n      rgba(40, 40, 40, 0.9) 100%);\n  border-color: rgba(80, 80, 80, 0.6);\n  color: white;\n  transform: translateX(8px);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-links-grid[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]:hover   .social-icon[_ngcontent-%COMP%] {\n  color: white;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-links-grid[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]:hover   .social-arrow[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: translateX(4px);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .card-glow[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 100%;\n  height: 100%;\n  transform: translate(-50%, -50%);\n  border-radius: inherit;\n  opacity: 0.2;\n  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);\n  pointer-events: none;\n  z-index: -1;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  padding: 4rem 2rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   .empty-content[_ngcontent-%COMP%]   .empty-icon[_ngcontent-%COMP%] {\n  font-size: 4rem;\n  color: rgba(255, 255, 255, 0.4);\n  margin-bottom: 1rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   .empty-content[_ngcontent-%COMP%]   .empty-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0 0 1rem 0;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   .empty-content[_ngcontent-%COMP%]   .empty-message[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: rgba(255, 255, 255, 0.6);\n  margin: 0 0 2rem 0;\n  line-height: 1.5;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   .empty-content[_ngcontent-%COMP%]   .reset-button[_ngcontent-%COMP%] {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.75rem 1.5rem;\n  background:\n    linear-gradient(\n      135deg,\n      #6c757d 0%,\n      #495057 100%);\n  border: none;\n  border-radius: 12px;\n  color: white;\n  font-size: 0.9rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .empty-state[_ngcontent-%COMP%]   .empty-content[_ngcontent-%COMP%]   .reset-button[_ngcontent-%COMP%]:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #495057 0%,\n      #343a40 100%);\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  padding: 4rem 2rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]   .loading-spinner[_ngcontent-%COMP%] {\n  margin-bottom: 1.5rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]   .loading-spinner[_ngcontent-%COMP%]   .spinning[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  color: #6c757d;\n  animation: _ngcontent-%COMP%_spin 2s linear infinite;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]   .loading-title[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0 0 1rem 0;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .loading-state[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]   .loading-message[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: rgba(255, 255, 255, 0.6);\n  margin: 0;\n  line-height: 1.5;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .cards-footer[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  padding: 1.5rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.08) 0%,\n      rgba(255, 255, 255, 0.04) 100%);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 16px;\n  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .cards-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.75rem;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .cards-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-icon[_ngcontent-%COMP%] {\n  font-size: 1.2rem;\n  color: rgba(255, 255, 255, 0.6);\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .cards-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-text[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.7);\n  margin: 0;\n  line-height: 1.5;\n}\n.socials-artist-cards[_ngcontent-%COMP%]   .cards-footer[_ngcontent-%COMP%]   .footer-content[_ngcontent-%COMP%]   .footer-text[_ngcontent-%COMP%]   strong[_ngcontent-%COMP%] {\n  color: white;\n  font-weight: 600;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@media (max-width: 1200px) {\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));\n    gap: 1.5rem;\n  }\n}\n@media (max-width: 768px) {\n  .socials-artist-cards[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%] {\n    margin-bottom: 2rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n    font-size: 2rem;\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%]   .title-icon[_ngcontent-%COMP%] {\n    font-size: 2.5rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .section-subtitle[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .display-modes[_ngcontent-%COMP%] {\n    padding: 1rem;\n    gap: 0.5rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .display-modes[_ngcontent-%COMP%]   .mode-button[_ngcontent-%COMP%] {\n    padding: 0.5rem 0.75rem;\n    font-size: 0.8rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .display-modes[_ngcontent-%COMP%]   .mode-button[_ngcontent-%COMP%]   span[_ngcontent-%COMP%] {\n    display: none;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .display-modes[_ngcontent-%COMP%]   .mode-button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n    font-size: 1rem;\n    width: 1rem;\n    height: 1rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .statistics-bar[_ngcontent-%COMP%] {\n    gap: 1rem;\n    padding: 1rem;\n    flex-wrap: wrap;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .statistics-bar[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   .stat-number[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .statistics-bar[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n    font-size: 0.8rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 1rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%] {\n    width: 70px;\n    height: 70px;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .avatar-glow[_ngcontent-%COMP%] {\n    width: 100px;\n    height: 100px;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n    font-size: 1.3rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-meta[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n}\n@media (max-width: 480px) {\n  .socials-artist-cards[_ngcontent-%COMP%] {\n    padding: 1rem;\n    border-radius: 20px;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .header-content[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n    font-size: 1.75rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .display-modes[_ngcontent-%COMP%]   .mode-button[_ngcontent-%COMP%] {\n    padding: 0.5rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .section-header[_ngcontent-%COMP%]   .display-modes[_ngcontent-%COMP%]   .mode-button[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n    font-size: 0.9rem;\n    width: 0.9rem;\n    height: 0.9rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .statistics-bar[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   .stat-number[_ngcontent-%COMP%] {\n    font-size: 1.25rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .statistics-bar[_ngcontent-%COMP%]   .stat-item[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n    font-size: 0.75rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n    padding: 1.25rem;\n    border-radius: 16px;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%] {\n    width: 60px;\n    height: 60px;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .artist-info[_ngcontent-%COMP%]   .artist-description[_ngcontent-%COMP%] {\n    font-size: 0.85rem;\n  }\n  .socials-artist-cards[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]   .social-links[_ngcontent-%COMP%]   .social-links-grid[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%] {\n    padding: 0.5rem 0.75rem;\n    font-size: 0.85rem;\n  }\n}\n/*# sourceMappingURL=socials-artist-cards.component.css.map */'], data: { animation: [
  // Main container animation for staggered entry
  trigger("cardsContainer", [
    transition("* => *", [
      query(".artist-card", [
        style({ opacity: 0, transform: "translateY(30px) scale(0.95)" }),
        stagger(80, [
          animate("600ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({ opacity: 1, transform: "translateY(0) scale(1)" }))
        ])
      ], { optional: true })
    ])
  ]),
  // Individual card animations
  trigger("cardAnimation", [
    state("enter", style({
      opacity: 1,
      transform: "translateY(0) scale(1)",
      filter: "blur(0px)"
    })),
    state("visible", style({
      opacity: 1,
      transform: "translateY(0) scale(1)",
      filter: "blur(0px)"
    })),
    state("leave", style({
      opacity: 0,
      transform: "translateY(-20px) scale(0.95)",
      filter: "blur(2px)"
    })),
    state("hidden", style({
      opacity: 0.3,
      transform: "translateY(0) scale(0.98)",
      filter: "blur(1px)"
    })),
    transition("* => enter", [
      style({ opacity: 0, transform: "translateY(40px) scale(0.8)", filter: "blur(4px)" }),
      animate("700ms cubic-bezier(0.175, 0.885, 0.32, 1.275)")
    ]),
    transition("* => visible", [
      animate("400ms cubic-bezier(0.4, 0.0, 0.2, 1)")
    ]),
    transition("* => leave", [
      animate("300ms cubic-bezier(0.4, 0.0, 1, 1)")
    ]),
    transition("* => hidden", [
      animate("250ms cubic-bezier(0.4, 0.0, 0.6, 1)")
    ])
  ]),
  // Project badge animation
  trigger("projectBadge", [
    state("show", style({
      opacity: 1,
      transform: "translateY(0) scale(1)"
    })),
    state("hide", style({
      opacity: 0,
      transform: "translateY(-10px) scale(0.8)"
    })),
    transition("hide => show", [
      animate("300ms cubic-bezier(0.4, 0.0, 0.2, 1)")
    ]),
    transition("show => hide", [
      animate("200ms cubic-bezier(0.4, 0.0, 1, 1)")
    ])
  ]),
  // Social links animation
  trigger("socialLinksAnimation", [
    state("show", style({
      opacity: 1,
      transform: "translateY(0)"
    })),
    state("hide", style({
      opacity: 0,
      transform: "translateY(10px)"
    })),
    transition("hide => show", [
      query(".social-link", [
        style({ opacity: 0, transform: "translateY(10px) scale(0.8)" }),
        stagger(40, [
          animate("300ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({ opacity: 1, transform: "translateY(0) scale(1)" }))
        ])
      ], { optional: true })
    ]),
    transition("show => hide", [
      animate("200ms cubic-bezier(0.4, 0.0, 1, 1)")
    ])
  ])
] }, changeDetection: 0 });
var SocialsArtistCardsComponent = _SocialsArtistCardsComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SocialsArtistCardsComponent, [{
    type: Component,
    args: [{ selector: "app-socials-artist-cards", standalone: true, imports: [CommonModule, MatIconModule], changeDetection: ChangeDetectionStrategy.OnPush, animations: [
      // Main container animation for staggered entry
      trigger("cardsContainer", [
        transition("* => *", [
          query(".artist-card", [
            style({ opacity: 0, transform: "translateY(30px) scale(0.95)" }),
            stagger(80, [
              animate("600ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({ opacity: 1, transform: "translateY(0) scale(1)" }))
            ])
          ], { optional: true })
        ])
      ]),
      // Individual card animations
      trigger("cardAnimation", [
        state("enter", style({
          opacity: 1,
          transform: "translateY(0) scale(1)",
          filter: "blur(0px)"
        })),
        state("visible", style({
          opacity: 1,
          transform: "translateY(0) scale(1)",
          filter: "blur(0px)"
        })),
        state("leave", style({
          opacity: 0,
          transform: "translateY(-20px) scale(0.95)",
          filter: "blur(2px)"
        })),
        state("hidden", style({
          opacity: 0.3,
          transform: "translateY(0) scale(0.98)",
          filter: "blur(1px)"
        })),
        transition("* => enter", [
          style({ opacity: 0, transform: "translateY(40px) scale(0.8)", filter: "blur(4px)" }),
          animate("700ms cubic-bezier(0.175, 0.885, 0.32, 1.275)")
        ]),
        transition("* => visible", [
          animate("400ms cubic-bezier(0.4, 0.0, 0.2, 1)")
        ]),
        transition("* => leave", [
          animate("300ms cubic-bezier(0.4, 0.0, 1, 1)")
        ]),
        transition("* => hidden", [
          animate("250ms cubic-bezier(0.4, 0.0, 0.6, 1)")
        ])
      ]),
      // Project badge animation
      trigger("projectBadge", [
        state("show", style({
          opacity: 1,
          transform: "translateY(0) scale(1)"
        })),
        state("hide", style({
          opacity: 0,
          transform: "translateY(-10px) scale(0.8)"
        })),
        transition("hide => show", [
          animate("300ms cubic-bezier(0.4, 0.0, 0.2, 1)")
        ]),
        transition("show => hide", [
          animate("200ms cubic-bezier(0.4, 0.0, 1, 1)")
        ])
      ]),
      // Social links animation
      trigger("socialLinksAnimation", [
        state("show", style({
          opacity: 1,
          transform: "translateY(0)"
        })),
        state("hide", style({
          opacity: 0,
          transform: "translateY(10px)"
        })),
        transition("hide => show", [
          query(".social-link", [
            style({ opacity: 0, transform: "translateY(10px) scale(0.8)" }),
            stagger(40, [
              animate("300ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({ opacity: 1, transform: "translateY(0) scale(1)" }))
            ])
          ], { optional: true })
        ]),
        transition("show => hide", [
          animate("200ms cubic-bezier(0.4, 0.0, 1, 1)")
        ])
      ])
    ], template: `<!-- Socials Artist Cards Container -->
<div class="socials-artist-cards"
     [@cardsContainer]="cardsAnimationTrigger()"
     [class.compact-mode]="compactMode"
     [class.with-filters]="showFilters">

  <!-- Section Header -->
  <div class="section-header">
    <div class="header-content">
      <h2 class="section-title">
        <mat-icon class="title-icon">people</mat-icon>
        <span>Featured Artists</span>
      </h2>
      <p class="section-subtitle">
        Discover the talented creators behind Prismatic Collections
      </p>
    </div>

    <!-- Display Mode Selector -->
    <div class="display-modes" *ngIf="showFilters">
      <button class="mode-button"
              [class.active]="displayMode === 'all'"
              (click)="onDisplayModeChange('all')"
              title="Show all artists with social links">
        <mat-icon>group</mat-icon>
        <span>All Artists</span>
      </button>

      <button class="mode-button"
              [class.active]="displayMode === 'main'"
              (click)="onDisplayModeChange('main')"
              title="Show main artists">
        <mat-icon>star</mat-icon>
        <span>Main</span>
      </button>

      <button class="mode-button"
              [class.active]="displayMode === 'featured'"
              (click)="onDisplayModeChange('featured')"
              title="Show featured artists">
        <mat-icon>featured_play_list</mat-icon>
        <span>Featured</span>
      </button>

      <button class="mode-button"
              [class.active]="displayMode === 'cross-project'"
              (click)="onDisplayModeChange('cross-project')"
              title="Show artists who appear in both projects">
        <mat-icon>compare_arrows</mat-icon>
        <span>Both Projects</span>
      </button>

      <button class="mode-button"
              [class.active]="displayMode === 'phantasia1'"
              (click)="onDisplayModeChange('phantasia1')"
              title="Show Phantasia 1 artists">
        <mat-icon>album</mat-icon>
        <span>P1</span>
      </button>

      <button class="mode-button"
              [class.active]="displayMode === 'phantasia2'"
              (click)="onDisplayModeChange('phantasia2')"
              title="Show Phantasia 2 artists">
        <mat-icon>library_music</mat-icon>
        <span>P2</span>
      </button>
    </div>
  </div>

  <!-- Statistics Bar -->
  <div class="statistics-bar" *ngIf="projectStatistics$ | async as stats">
    <div class="stat-item">
      <span class="stat-number">{{ stats.totalUnique }}</span>
      <span class="stat-label">Total Artists</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">{{ stats.phantasia1.artists }}</span>
      <span class="stat-label">Phantasia 1</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">{{ stats.phantasia2.artists }}</span>
      <span class="stat-label">Phantasia 2</span>
    </div>
    <div class="stat-item">
      <span class="stat-number">{{ stats.crossProject }}</span>
      <span class="stat-label">Cross-Project</span>
    </div>
  </div>

  <!-- Artist Cards Grid -->
  <div class="artist-cards-grid"
       *ngIf="(optimizedArtistCards$ | async) as cards">

    <div class="artist-card"
         *ngFor="let card of cards; trackBy: trackByArtistId"
         [@cardAnimation]="card.animationState"
         [ngStyle]="getCardStyle(card)"
         [class.main-artist]="card.isMainArtist"
         [class.featured-artist]="card.isFeatured">

      <!-- Artist Avatar -->
      <div class="artist-avatar">
        <div class="avatar-container">
          <img [src]="card.avatar"
               [alt]="card.displayName + ' avatar'"
               class="avatar-image"
               (error)="onAvatarError($event, card.name)"
               loading="lazy">
          <div class="avatar-initials">{{ getArtistInitials(card.name) }}</div>
        </div>

        <!-- Project Badges -->
        <div class="project-badges" [@projectBadge]="'show'">
          <div class="project-badge"
               *ngFor="let badge of getProjectBadges(card)"
               [style.background-color]="badge.color"
               [title]="'Phantasia Project ' + (badge.id === 'phantasia1' ? '1' : '2')">
            {{ badge.name }}
          </div>
        </div>

        <div class="avatar-glow" [style.background]="'radial-gradient(circle, ' + card.color + '40 0%, transparent 70%)'"></div>
      </div>

      <!-- Artist Information -->
      <div class="artist-info">
        <h3 class="artist-name">{{ card.displayName }}</h3>
        <p class="artist-role">{{ getRoleDisplay(card) }}</p>
        <p class="artist-description">{{ card.description }}</p>

        <!-- Track Count & Bio -->
        <div class="artist-meta">
          <div class="track-count" *ngIf="card.trackCount > 0">
            <mat-icon class="meta-icon">music_note</mat-icon>
            <span>{{ card.trackCount }} track{{ card.trackCount === 1 ? '' : 's' }}</span>
          </div>
          <div class="projects-info" *ngIf="card.projects.length > 1">
            <mat-icon class="meta-icon">compare_arrows</mat-icon>
            <span>Cross-project artist</span>
          </div>
        </div>
      </div>

      <!-- Social Links -->
      <div class="social-links"
           *ngIf="hasSocialLinks(card)"
           [@socialLinksAnimation]="'show'">

        <h4 class="links-title">Connect</h4>
        <div class="social-links-grid">
          <a class="social-link"
             *ngFor="let link of getVisibleSocialLinks(card)"
             [href]="link.url"
             [title]="getSocialPlatformName(link.platform) + ' - ' + card.displayName"
             target="_blank"
             rel="noopener noreferrer"
             (click)="onSocialLinkClick(link.url, link.platform, card.name)">

            <mat-icon class="social-icon">{{ getSocialIcon(link.platform) }}</mat-icon>
            <span class="social-platform-name">{{ getSocialPlatformName(link.platform) }}</span>
            <mat-icon class="social-arrow">arrow_forward</mat-icon>
          </a>
        </div>
      </div>

      <!-- Card Glow Effect -->
      <div class="card-glow"
           [style.background]="'radial-gradient(circle at center, ' + card.color + '15 0%, transparent 70%)'"></div>
    </div>
  </div>

  <!-- Empty State -->
  <div class="empty-state"
       *ngIf="(optimizedArtistCards$ | async)?.length === 0">
    <div class="empty-content">
      <mat-icon class="empty-icon">people_outline</mat-icon>
      <h3 class="empty-title">No Artists Found</h3>
      <p class="empty-message">
        Try changing the display mode or filters to see more artists.
      </p>
      <button class="reset-button"
              (click)="onDisplayModeChange('all')"
              *ngIf="displayMode !== 'all'">
        <mat-icon>refresh</mat-icon>
        Show All Artists
      </button>
    </div>
  </div>

  <!-- Loading State -->
  <div class="loading-state"
       *ngIf="!(optimizedArtistCards$ | async)">
    <div class="loading-content">
      <div class="loading-spinner">
        <mat-icon class="spinning">refresh</mat-icon>
      </div>
      <h3 class="loading-title">Discovering Artists...</h3>
      <p class="loading-message">
        Loading the talented creators behind Prismatic Collections
      </p>
    </div>
  </div>

  <!-- Footer Info -->
  <div class="cards-footer"
       *ngIf="(optimizedArtistCards$ | async) as cards">
    <div *ngIf="cards && cards.length > 0" class="footer-content">
      <mat-icon class="footer-icon">info</mat-icon>
      <p class="footer-text">
        Showing <strong>{{ cards.length }}</strong> artist{{ cards.length === 1 ? '' : 's' }}
        from the Prismatic Collections projects.
        <span *ngIf="cards.length === maxVisibleCards">
          Some artists may be hidden. Use filters to explore more.
        </span>
      </p>
    </div>
  </div>
</div>`, styles: ['/* src/app/components/socials-artist-cards/socials-artist-cards.component.scss */\n.socials-artist-cards {\n  position: relative;\n  width: 100%;\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.8) 0%,\n      rgba(32, 38, 44, 0.6) 25%,\n      rgba(48, 52, 58, 0.4) 50%,\n      rgba(32, 38, 44, 0.6) 75%,\n      rgba(0, 0, 0, 0.8) 100%);\n  -webkit-backdrop-filter: blur(20px);\n  backdrop-filter: blur(20px);\n  border-radius: 32px;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  box-shadow:\n    0 12px 40px rgba(0, 0, 0, 0.3),\n    0 6px 20px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.1);\n  overflow: hidden;\n  contain: layout style;\n}\n.socials-artist-cards::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    radial-gradient(\n      circle at 20% 30%,\n      rgba(255, 255, 255, 0.03) 0%,\n      transparent 60%),\n    radial-gradient(\n      circle at 80% 70%,\n      rgba(255, 255, 255, 0.02) 0%,\n      transparent 60%),\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.015) 0%,\n      transparent 50%);\n  pointer-events: none;\n  border-radius: inherit;\n  z-index: 0;\n}\n.socials-artist-cards.compact-mode {\n  padding: 1.5rem;\n  border-radius: 24px;\n}\n.socials-artist-cards.compact-mode .artist-card {\n  padding: 1.5rem;\n}\n.socials-artist-cards .section-header {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  margin-bottom: 3rem;\n}\n.socials-artist-cards .section-header .header-content {\n  margin-bottom: 2rem;\n}\n.socials-artist-cards .section-header .header-content .section-title {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  font-size: 2.5rem;\n  font-weight: 700;\n  color: white;\n  margin: 0 0 1rem 0;\n  line-height: 1.2;\n}\n.socials-artist-cards .section-header .header-content .section-title .title-icon {\n  font-size: 3rem;\n  color: #6c757d;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.socials-artist-cards .section-header .header-content .section-subtitle {\n  font-size: 1.2rem;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0;\n  font-weight: 400;\n}\n.socials-artist-cards .section-header .display-modes {\n  display: flex;\n  flex-wrap: wrap;\n  justify-content: center;\n  gap: 0.75rem;\n  padding: 1.5rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.1) 0%,\n      rgba(255, 255, 255, 0.05) 100%);\n  -webkit-backdrop-filter: blur(20px);\n  backdrop-filter: blur(20px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 20px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.15);\n}\n.socials-artist-cards .section-header .display-modes .mode-button {\n  display: flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.75rem 1.25rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.1) 0%,\n      rgba(255, 255, 255, 0.05) 100%);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 12px;\n  color: rgba(255, 255, 255, 0.8);\n  font-size: 0.9rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n}\n.socials-artist-cards .section-header .display-modes .mode-button mat-icon {\n  font-size: 1.2rem;\n  width: 1.2rem;\n  height: 1.2rem;\n}\n.socials-artist-cards .section-header .display-modes .mode-button:hover {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.2) 0%,\n      rgba(255, 255, 255, 0.1) 100%);\n  border-color: rgba(255, 255, 255, 0.3);\n  color: white;\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);\n}\n.socials-artist-cards .section-header .display-modes .mode-button.active {\n  background:\n    linear-gradient(\n      135deg,\n      #6c757d 0%,\n      #495057 100%);\n  border-color: #6c757d;\n  color: white;\n  box-shadow: 0 6px 20px rgba(108, 117, 125, 0.4);\n}\n.socials-artist-cards .statistics-bar {\n  position: relative;\n  z-index: 1;\n  display: flex;\n  justify-content: center;\n  gap: 2rem;\n  margin-bottom: 3rem;\n  padding: 1.5rem 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.08) 0%,\n      rgba(255, 255, 255, 0.04) 100%);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 16px;\n  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);\n}\n.socials-artist-cards .statistics-bar .stat-item {\n  text-align: center;\n}\n.socials-artist-cards .statistics-bar .stat-item .stat-number {\n  display: block;\n  font-size: 2rem;\n  font-weight: 700;\n  color: white;\n  line-height: 1;\n  margin-bottom: 0.25rem;\n}\n.socials-artist-cards .statistics-bar .stat-item .stat-label {\n  display: block;\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.7);\n  font-weight: 500;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n}\n.socials-artist-cards .artist-cards-grid {\n  position: relative;\n  z-index: 1;\n  display: grid;\n  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));\n  gap: 2rem;\n  margin-bottom: 3rem;\n}\n.socials-artist-cards .artist-cards-grid .artist-card {\n  position: relative;\n  padding: 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(20, 20, 20, 0.9) 0%,\n      rgba(30, 30, 30, 0.8) 50%,\n      rgba(15, 15, 15, 0.85) 100%);\n  -webkit-backdrop-filter: blur(20px);\n  backdrop-filter: blur(20px);\n  border: 1px solid rgba(60, 60, 60, 0.4);\n  border-radius: 24px;\n  box-shadow:\n    0 10px 30px rgba(0, 0, 0, 0.2),\n    0 4px 15px rgba(0, 0, 0, 0.1),\n    inset 0 1px 0 rgba(255, 255, 255, 0.15);\n  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);\n  overflow: hidden;\n  contain: layout style;\n}\n.socials-artist-cards .artist-cards-grid .artist-card:hover {\n  transform: translateY(-8px) scale(1.02);\n  box-shadow:\n    0 20px 40px rgba(0, 0, 0, 0.25),\n    0 8px 20px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.2);\n  border-color: rgba(80, 80, 80, 0.6);\n}\n.socials-artist-cards .artist-cards-grid .artist-card:hover .avatar-glow {\n  opacity: 0.6;\n  transform: scale(1.2);\n}\n.socials-artist-cards .artist-cards-grid .artist-card:hover .card-glow {\n  opacity: 0.8;\n  transform: scale(1.1);\n}\n.socials-artist-cards .artist-cards-grid .artist-card.main-artist {\n  border-color: rgba(255, 107, 107, 0.4);\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 107, 107, 0.2) 0%,\n      rgba(40, 40, 40, 0.9) 50%,\n      rgba(25, 25, 25, 0.95) 100%);\n}\n.socials-artist-cards .artist-cards-grid .artist-card.main-artist:hover {\n  border-color: rgba(255, 107, 107, 0.6);\n  box-shadow:\n    0 20px 40px rgba(255, 107, 107, 0.2),\n    0 8px 20px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n.socials-artist-cards .artist-cards-grid .artist-card.featured-artist {\n  border-color: rgba(108, 92, 231, 0.4);\n  background:\n    linear-gradient(\n      135deg,\n      rgba(108, 92, 231, 0.2) 0%,\n      rgba(40, 40, 40, 0.9) 50%,\n      rgba(25, 25, 25, 0.95) 100%);\n}\n.socials-artist-cards .artist-cards-grid .artist-card.featured-artist:hover {\n  border-color: rgba(108, 92, 231, 0.6);\n  box-shadow:\n    0 20px 40px rgba(108, 92, 231, 0.2),\n    0 8px 20px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.2);\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-avatar {\n  position: relative;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  margin-bottom: 1.5rem;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-avatar .avatar-container {\n  position: relative;\n  width: 80px;\n  height: 80px;\n  border-radius: 50%;\n  overflow: hidden;\n  border: 3px solid rgba(255, 255, 255, 0.2);\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-avatar .avatar-container .avatar-image {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-avatar .avatar-container .avatar-initials {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: white;\n  background: var(--artist-color, #6c757d);\n  opacity: 0;\n  transition: opacity 0.3s ease;\n}\n.avatar-container.avatar-fallback .socials-artist-cards .artist-cards-grid .artist-card .artist-avatar .avatar-container .avatar-initials {\n  opacity: 1;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-avatar .avatar-container .avatar-container.avatar-fallback .avatar-image {\n  opacity: 0;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-avatar .project-badges {\n  position: absolute;\n  top: -8px;\n  right: -8px;\n  display: flex;\n  gap: 0.25rem;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-avatar .project-badges .project-badge {\n  padding: 0.25rem 0.5rem;\n  border-radius: 8px;\n  font-size: 0.7rem;\n  font-weight: 700;\n  color: white;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-avatar .avatar-glow {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 120px;\n  height: 120px;\n  transform: translate(-50%, -50%);\n  border-radius: 50%;\n  opacity: 0.3;\n  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);\n  pointer-events: none;\n  z-index: -1;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-info {\n  text-align: center;\n  margin-bottom: 1.5rem;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-name {\n  font-size: 1.5rem;\n  font-weight: 700;\n  color: white;\n  margin: 0 0 0.5rem 0;\n  line-height: 1.3;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-role {\n  font-size: 1rem;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0 0 0.75rem 0;\n  font-weight: 500;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-description {\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.7);\n  margin: 0 0 1rem 0;\n  line-height: 1.5;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-meta {\n  display: flex;\n  justify-content: center;\n  gap: 1rem;\n  flex-wrap: wrap;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-meta .track-count,\n.socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-meta .projects-info {\n  display: flex;\n  align-items: center;\n  gap: 0.25rem;\n  font-size: 0.8rem;\n  color: rgba(255, 255, 255, 0.6);\n  font-weight: 500;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-meta .track-count .meta-icon,\n.socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-meta .projects-info .meta-icon {\n  font-size: 1rem;\n  width: 1rem;\n  height: 1rem;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .social-links .links-title {\n  font-size: 1rem;\n  font-weight: 600;\n  color: rgba(255, 255, 255, 0.9);\n  margin: 0 0 1rem 0;\n  text-align: center;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .social-links .social-links-grid {\n  display: flex;\n  flex-direction: column;\n  gap: 0.75rem;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .social-links .social-links-grid .social-link {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  padding: 0.75rem 1rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(40, 40, 40, 0.8) 0%,\n      rgba(20, 20, 20, 0.9) 100%);\n  border: 1px solid rgba(60, 60, 60, 0.4);\n  border-radius: 12px;\n  color: rgba(255, 255, 255, 0.8);\n  text-decoration: none;\n  font-size: 0.9rem;\n  font-weight: 500;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n}\n.socials-artist-cards .artist-cards-grid .artist-card .social-links .social-links-grid .social-link .social-icon {\n  font-size: 1.2rem;\n  width: 1.2rem;\n  height: 1.2rem;\n  color: rgba(255, 255, 255, 0.7);\n  transition: color 0.3s ease;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .social-links .social-links-grid .social-link .social-platform-name {\n  flex: 1;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .social-links .social-links-grid .social-link .social-arrow {\n  font-size: 1rem;\n  width: 1rem;\n  height: 1rem;\n  opacity: 0.6;\n  transition: all 0.3s ease;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .social-links .social-links-grid .social-link:hover {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(60, 60, 60, 0.8) 0%,\n      rgba(40, 40, 40, 0.9) 100%);\n  border-color: rgba(80, 80, 80, 0.6);\n  color: white;\n  transform: translateX(8px);\n}\n.socials-artist-cards .artist-cards-grid .artist-card .social-links .social-links-grid .social-link:hover .social-icon {\n  color: white;\n}\n.socials-artist-cards .artist-cards-grid .artist-card .social-links .social-links-grid .social-link:hover .social-arrow {\n  opacity: 1;\n  transform: translateX(4px);\n}\n.socials-artist-cards .artist-cards-grid .artist-card .card-glow {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  width: 100%;\n  height: 100%;\n  transform: translate(-50%, -50%);\n  border-radius: inherit;\n  opacity: 0.2;\n  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);\n  pointer-events: none;\n  z-index: -1;\n}\n.socials-artist-cards .empty-state {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  padding: 4rem 2rem;\n}\n.socials-artist-cards .empty-state .empty-content .empty-icon {\n  font-size: 4rem;\n  color: rgba(255, 255, 255, 0.4);\n  margin-bottom: 1rem;\n}\n.socials-artist-cards .empty-state .empty-content .empty-title {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0 0 1rem 0;\n}\n.socials-artist-cards .empty-state .empty-content .empty-message {\n  font-size: 1rem;\n  color: rgba(255, 255, 255, 0.6);\n  margin: 0 0 2rem 0;\n  line-height: 1.5;\n}\n.socials-artist-cards .empty-state .empty-content .reset-button {\n  display: inline-flex;\n  align-items: center;\n  gap: 0.5rem;\n  padding: 0.75rem 1.5rem;\n  background:\n    linear-gradient(\n      135deg,\n      #6c757d 0%,\n      #495057 100%);\n  border: none;\n  border-radius: 12px;\n  color: white;\n  font-size: 0.9rem;\n  font-weight: 500;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.socials-artist-cards .empty-state .empty-content .reset-button:hover {\n  background:\n    linear-gradient(\n      135deg,\n      #495057 0%,\n      #343a40 100%);\n  transform: translateY(-2px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.2);\n}\n.socials-artist-cards .loading-state {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  padding: 4rem 2rem;\n}\n.socials-artist-cards .loading-state .loading-content .loading-spinner {\n  margin-bottom: 1.5rem;\n}\n.socials-artist-cards .loading-state .loading-content .loading-spinner .spinning {\n  font-size: 3rem;\n  color: #6c757d;\n  animation: spin 2s linear infinite;\n}\n.socials-artist-cards .loading-state .loading-content .loading-title {\n  font-size: 1.5rem;\n  font-weight: 600;\n  color: rgba(255, 255, 255, 0.8);\n  margin: 0 0 1rem 0;\n}\n.socials-artist-cards .loading-state .loading-content .loading-message {\n  font-size: 1rem;\n  color: rgba(255, 255, 255, 0.6);\n  margin: 0;\n  line-height: 1.5;\n}\n.socials-artist-cards .cards-footer {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  padding: 1.5rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.08) 0%,\n      rgba(255, 255, 255, 0.04) 100%);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n  border-radius: 16px;\n  box-shadow: 0 6px 25px rgba(0, 0, 0, 0.1);\n}\n.socials-artist-cards .cards-footer .footer-content {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.75rem;\n}\n.socials-artist-cards .cards-footer .footer-content .footer-icon {\n  font-size: 1.2rem;\n  color: rgba(255, 255, 255, 0.6);\n}\n.socials-artist-cards .cards-footer .footer-content .footer-text {\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.7);\n  margin: 0;\n  line-height: 1.5;\n}\n.socials-artist-cards .cards-footer .footer-content .footer-text strong {\n  color: white;\n  font-weight: 600;\n}\n@keyframes spin {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@media (max-width: 1200px) {\n  .socials-artist-cards .artist-cards-grid {\n    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));\n    gap: 1.5rem;\n  }\n}\n@media (max-width: 768px) {\n  .socials-artist-cards {\n    padding: 1.5rem;\n  }\n  .socials-artist-cards .section-header {\n    margin-bottom: 2rem;\n  }\n  .socials-artist-cards .section-header .header-content .section-title {\n    font-size: 2rem;\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n  .socials-artist-cards .section-header .header-content .section-title .title-icon {\n    font-size: 2.5rem;\n  }\n  .socials-artist-cards .section-header .header-content .section-subtitle {\n    font-size: 1rem;\n  }\n  .socials-artist-cards .section-header .display-modes {\n    padding: 1rem;\n    gap: 0.5rem;\n  }\n  .socials-artist-cards .section-header .display-modes .mode-button {\n    padding: 0.5rem 0.75rem;\n    font-size: 0.8rem;\n  }\n  .socials-artist-cards .section-header .display-modes .mode-button span {\n    display: none;\n  }\n  .socials-artist-cards .section-header .display-modes .mode-button mat-icon {\n    font-size: 1rem;\n    width: 1rem;\n    height: 1rem;\n  }\n  .socials-artist-cards .statistics-bar {\n    gap: 1rem;\n    padding: 1rem;\n    flex-wrap: wrap;\n  }\n  .socials-artist-cards .statistics-bar .stat-item .stat-number {\n    font-size: 1.5rem;\n  }\n  .socials-artist-cards .statistics-bar .stat-item .stat-label {\n    font-size: 0.8rem;\n  }\n  .socials-artist-cards .artist-cards-grid {\n    grid-template-columns: 1fr;\n    gap: 1rem;\n  }\n  .socials-artist-cards .artist-cards-grid .artist-card {\n    padding: 1.5rem;\n  }\n  .socials-artist-cards .artist-cards-grid .artist-card .artist-avatar .avatar-container {\n    width: 70px;\n    height: 70px;\n  }\n  .socials-artist-cards .artist-cards-grid .artist-card .artist-avatar .avatar-glow {\n    width: 100px;\n    height: 100px;\n  }\n  .socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-name {\n    font-size: 1.3rem;\n  }\n  .socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-meta {\n    flex-direction: column;\n    gap: 0.5rem;\n  }\n}\n@media (max-width: 480px) {\n  .socials-artist-cards {\n    padding: 1rem;\n    border-radius: 20px;\n  }\n  .socials-artist-cards .section-header .header-content .section-title {\n    font-size: 1.75rem;\n  }\n  .socials-artist-cards .section-header .display-modes .mode-button {\n    padding: 0.5rem;\n  }\n  .socials-artist-cards .section-header .display-modes .mode-button mat-icon {\n    font-size: 0.9rem;\n    width: 0.9rem;\n    height: 0.9rem;\n  }\n  .socials-artist-cards .statistics-bar .stat-item .stat-number {\n    font-size: 1.25rem;\n  }\n  .socials-artist-cards .statistics-bar .stat-item .stat-label {\n    font-size: 0.75rem;\n  }\n  .socials-artist-cards .artist-cards-grid .artist-card {\n    padding: 1.25rem;\n    border-radius: 16px;\n  }\n  .socials-artist-cards .artist-cards-grid .artist-card .artist-avatar .avatar-container {\n    width: 60px;\n    height: 60px;\n  }\n  .socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-name {\n    font-size: 1.2rem;\n  }\n  .socials-artist-cards .artist-cards-grid .artist-card .artist-info .artist-description {\n    font-size: 0.85rem;\n  }\n  .socials-artist-cards .artist-cards-grid .artist-card .social-links .social-links-grid .social-link {\n    padding: 0.5rem 0.75rem;\n    font-size: 0.85rem;\n  }\n}\n/*# sourceMappingURL=socials-artist-cards.component.css.map */\n'] }]
  }], () => [{ type: ComprehensiveArtistService }, { type: ChangeDetectorRef }], { displayMode: [{
    type: Input
  }], maxVisibleCards: [{
    type: Input
  }], enableAnimations: [{
    type: Input
  }], showFilters: [{
    type: Input
  }], compactMode: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SocialsArtistCardsComponent, { className: "SocialsArtistCardsComponent", filePath: "src/app/components/socials-artist-cards/socials-artist-cards.component.ts", lineNumber: 150 });
})();

// src/app/pages/social-links/social-links.ts
var _SocialLinksComponent = class _SocialLinksComponent {
  ngOnInit() {
    console.log("Social Links component initialized");
    document.body.classList.add("social-links-page-active");
  }
  ngOnDestroy() {
    document.body.classList.remove("social-links-page-active");
  }
};
_SocialLinksComponent.\u0275fac = function SocialLinksComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SocialLinksComponent)();
};
_SocialLinksComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SocialLinksComponent, selectors: [["app-social-links"]], decls: 43, vars: 7, consts: [[1, "social-links-page", "anim-a"], [3, "count", "enabled"], [1, "social-main"], [1, "hero"], [1, "hero-content"], [1, "title"], [1, "subtitle"], [1, "description"], [1, "hero-background"], [1, "overlay"], [1, "artists"], [3, "displayMode", "maxVisibleCards", "enableAnimations", "showFilters", "compactMode"], [1, "community"], [1, "community-content"], [1, "section-title"], [1, "community-text"], [1, "community-stats"], [1, "stat"], [1, "stat-number"], [1, "stat-label"]], template: function SocialLinksComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-site-header");
    \u0275\u0275elementStart(1, "div", 0);
    \u0275\u0275element(2, "app-squares-animation", 1);
    \u0275\u0275elementStart(3, "main", 2)(4, "section", 3)(5, "div", 4)(6, "h1", 5);
    \u0275\u0275text(7, "ARTIST CIRCLES");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 6);
    \u0275\u0275text(9, "Connect with the creators behind Prismatic Collections");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 7);
    \u0275\u0275text(11, " Explore our artists' social media platforms, follow their journeys, and stay updated with their latest musical creations and collaborations. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(12, "div", 8);
    \u0275\u0275element(13, "div", 9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "section", 10);
    \u0275\u0275element(15, "app-socials-artist-cards", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "section", 12)(17, "div", 13)(18, "h2", 14);
    \u0275\u0275text(19, "Join Our Community");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "p", 15);
    \u0275\u0275text(21, " Be part of the Prismatic Collections community! Follow our artists, share your thoughts, and discover new music together across both Phantasia projects. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "div", 16)(23, "div", 17)(24, "span", 18);
    \u0275\u0275text(25, "60+");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(26, "span", 19);
    \u0275\u0275text(27, "Contributing Artists");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(28, "div", 17)(29, "span", 18);
    \u0275\u0275text(30, "34");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "span", 19);
    \u0275\u0275text(32, "Released Tracks");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div", 17)(34, "span", 18);
    \u0275\u0275text(35, "2");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "span", 19);
    \u0275\u0275text(37, "Phantasia Projects");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(38, "div", 17)(39, "span", 18);
    \u0275\u0275text(40, "\u221E");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "span", 19);
    \u0275\u0275text(42, "Musical Possibilities");
    \u0275\u0275elementEnd()()()()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(2);
    \u0275\u0275property("count", 48)("enabled", true);
    \u0275\u0275advance(13);
    \u0275\u0275property("displayMode", "all")("maxVisibleCards", 24)("enableAnimations", true)("showFilters", true)("compactMode", false);
  }
}, dependencies: [CommonModule, MatIconModule, SiteHeaderComponent, SquaresAnimationComponent, SocialsArtistCardsComponent], styles: ['@charset "UTF-8";\n\n\n\n.typography[_ngcontent-%COMP%] {\n}\n.typography-display-large[_ngcontent-%COMP%] {\n  font-size: 3.75rem;\n  font-weight: 900;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-display-medium[_ngcontent-%COMP%] {\n  font-size: 3rem;\n  font-weight: 800;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-heading-1[_ngcontent-%COMP%] {\n  font-size: 2.25rem;\n  font-weight: 700;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-heading-2[_ngcontent-%COMP%], \n.artist-info[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n  font-size: 1.875rem;\n  font-weight: 700;\n  line-height: 1.375;\n}\n.typography-heading-3[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  font-weight: 600;\n  line-height: 1.375;\n}\n.typography-heading-4[_ngcontent-%COMP%] {\n  font-size: 1.25rem;\n  font-weight: 600;\n  line-height: 1.5;\n}\n.typography-body-large[_ngcontent-%COMP%], \n.artist-info[_ngcontent-%COMP%]   .artist-role[_ngcontent-%COMP%] {\n  font-size: 1.125rem;\n  font-weight: 400;\n  line-height: 1.625;\n}\n.typography-body-medium[_ngcontent-%COMP%], \n.artist-info[_ngcontent-%COMP%]   .artist-description[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n}\n.typography-body-small[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 400;\n  line-height: 1.5;\n}\n.typography-label-large[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.0125em;\n}\n.typography-label-medium[_ngcontent-%COMP%] {\n  font-size: 0.875rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.025em;\n}\n.typography-label-small[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n}\n@media (max-width: 768px) {\n  .typography-display-large[_ngcontent-%COMP%] {\n    font-size: 2.25rem;\n  }\n  .typography-display-medium[_ngcontent-%COMP%] {\n    font-size: 1.875rem;\n  }\n  .typography-heading-1[_ngcontent-%COMP%] {\n    font-size: 1.875rem;\n  }\n  .typography-heading-2[_ngcontent-%COMP%], \n   .artist-info[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n@media (max-width: 480px) {\n  .typography-display-large[_ngcontent-%COMP%] {\n    font-size: 1.875rem;\n  }\n  .typography-display-medium[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n  .typography-heading-1[_ngcontent-%COMP%] {\n    font-size: 1.5rem;\n  }\n}\n[_ngcontent-%COMP%]:root {\n  --primary-color: #ff7f50;\n  --gradient-primary:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      #ff5252);\n  --category-project-updates-color: #6c757d;\n  --category-project-updates-gradient:\n    linear-gradient(\n      135deg,\n      #6c757d,\n      #495057);\n  --category-project-updates-light: rgba(108, 117, 125, 0.1);\n  --category-releases-color: #10b981;\n  --category-releases-gradient:\n    linear-gradient(\n      135deg,\n      #10b981,\n      #059669);\n  --category-releases-light: rgba(16, 185, 129, 0.1);\n  --category-announcements-color: #f59e0b;\n  --category-announcements-gradient:\n    linear-gradient(\n      135deg,\n      #f59e0b,\n      #d97706);\n  --category-announcements-light: rgba(245, 158, 11, 0.1);\n  --category-technical-updates-color: #495057;\n  --category-technical-updates-gradient:\n    linear-gradient(\n      135deg,\n      #495057,\n      #343a40);\n  --category-technical-updates-light: rgba(73, 80, 87, 0.1);\n  --category-community-color: #ec4899;\n  --category-community-gradient:\n    linear-gradient(\n      135deg,\n      #ec4899,\n      #db2777);\n  --category-community-light: rgba(236, 72, 153, 0.1);\n  --social-spotify-color: #1DB954;\n  --social-soundcloud-color: #FF5500;\n  --social-youtube-color: #FF0000;\n  --social-github-color: #333333;\n  --social-discord-color: #5865F2;\n  --social-bandcamp-color: #629AA0;\n  --social-instagram-color: #E4405F;\n  --social-twitter-color: #1DA1F2;\n  --success-color: #10b981;\n  --warning-color: #f59e0b;\n  --error-color: #ef4444;\n  --info-color: #3b82f6;\n}\n.focus-enhanced[_ngcontent-%COMP%]:focus-visible, \n.interactive-element[_ngcontent-%COMP%]:focus-visible, \n.filter-button[_ngcontent-%COMP%]:focus-visible, \n.social-button[_ngcontent-%COMP%]:focus-visible, \n.news-article[_ngcontent-%COMP%]:focus-visible, \n.featured-article[_ngcontent-%COMP%]:focus-visible, \n.artist-card[_ngcontent-%COMP%]:focus-visible {\n  outline: 3px solid #ff7f50;\n  outline-offset: 2px;\n  border-radius: 4px;\n  box-shadow: 0 0 0 3px rgba(255, 127, 80, 0.2);\n}\n.interactive-element[_ngcontent-%COMP%]:focus-visible, \n.filter-button[_ngcontent-%COMP%]:focus-visible, \n.social-button[_ngcontent-%COMP%]:focus-visible, \n.news-article[_ngcontent-%COMP%]:focus-visible, \n.featured-article[_ngcontent-%COMP%]:focus-visible, \n.artist-card[_ngcontent-%COMP%]:focus-visible {\n  transform: translateY(-1px);\n  transition: all 0.2s ease;\n}\n.interactive-element[_ngcontent-%COMP%]:active, \n.filter-button[_ngcontent-%COMP%]:active, \n.social-button[_ngcontent-%COMP%]:active, \n.news-article[_ngcontent-%COMP%]:active, \n.featured-article[_ngcontent-%COMP%]:active, \n.artist-card[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n.skip-link[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -40px;\n  left: 6px;\n  background: #000;\n  color: white;\n  padding: 8px;\n  text-decoration: none;\n  border-radius: 0 0 4px 4px;\n  z-index: 1000;\n}\n.skip-link[_ngcontent-%COMP%]:focus {\n  top: 0;\n}\n.sr-only[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n@media (prefers-contrast: high) {\n  .category-badge[_ngcontent-%COMP%], \n   .filter-button[_ngcontent-%COMP%], \n   .social-button[_ngcontent-%COMP%] {\n    border: 2px solid currentColor;\n  }\n  .article-card[_ngcontent-%COMP%], \n   .artist-card[_ngcontent-%COMP%] {\n    border: 1px solid rgba(255, 255, 255, 0.3);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  *[_ngcontent-%COMP%], \n   *[_ngcontent-%COMP%]::before, \n   *[_ngcontent-%COMP%]::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n  .triangle[_ngcontent-%COMP%] {\n    animation: none !important;\n  }\n  .triangle[_ngcontent-%COMP%]::after {\n    animation: none !important;\n  }\n}\n.status-indicator[_ngcontent-%COMP%]::before {\n  content: attr(data-status);\n  font-weight: bold;\n  margin-right: 0.5rem;\n}\n.status-indicator.available[_ngcontent-%COMP%]::before {\n  content: "\\2713  ";\n  color: #10b981;\n}\n.status-indicator.coming-soon[_ngcontent-%COMP%]::before {\n  content: "\\23f3  ";\n  color: #f59e0b;\n}\n.status-indicator.unavailable[_ngcontent-%COMP%]::before {\n  content: "\\2717  ";\n  color: #ef4444;\n}\n.keyboard-nav-active[_ngcontent-%COMP%]   .filter-button[_ngcontent-%COMP%]:focus, \n.keyboard-nav-active[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]:focus, \n.keyboard-nav-active[_ngcontent-%COMP%]   .article[_ngcontent-%COMP%]:focus, \n.keyboard-nav-active[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]:focus {\n  transform: scale(1.02);\n  z-index: 10;\n  position: relative;\n}\n.touch-target[_ngcontent-%COMP%] {\n  min-width: 44px;\n  min-height: 44px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.readable-content[_ngcontent-%COMP%] {\n  max-width: 65ch;\n  line-height: 1.6;\n}\n.readable-content[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], \n.readable-content[_ngcontent-%COMP%]   h2[_ngcontent-%COMP%], \n.readable-content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%], \n.readable-content[_ngcontent-%COMP%]   h4[_ngcontent-%COMP%], \n.readable-content[_ngcontent-%COMP%]   h5[_ngcontent-%COMP%], \n.readable-content[_ngcontent-%COMP%]   h6[_ngcontent-%COMP%] {\n  line-height: 1.3;\n  margin-bottom: 0.5em;\n}\n.readable-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin-bottom: 1em;\n}\n.error-state[_ngcontent-%COMP%] {\n  color: #ef4444;\n  border-color: #ef4444;\n}\n.error-state[_ngcontent-%COMP%]:focus {\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);\n}\n.loading-state[_ngcontent-%COMP%] {\n  position: relative;\n  color: transparent;\n}\n.loading-state[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.1) 25%,\n      rgba(255, 255, 255, 0.2) 50%,\n      rgba(255, 255, 255, 0.1) 75%);\n  background-size: 200% 100%;\n  animation: _ngcontent-%COMP%_loading-shimmer 1.5s infinite;\n}\n@keyframes _ngcontent-%COMP%_loading-shimmer {\n  0% {\n    background-position: -200% 0;\n  }\n  100% {\n    background-position: 200% 0;\n  }\n}\n@keyframes _ngcontent-%COMP%_winterFloat {\n  0% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n  33% {\n    background-position:\n      40px 20px,\n      20px 40px,\n      35px 15px;\n  }\n  66% {\n    background-position:\n      20px 40px,\n      40px 20px,\n      15px 35px;\n  }\n  100% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n}\n[_ngcontent-%COMP%]:export {\n  winterPrimary: #f0f4f8;\n  winterSecondary: #e6f0f5;\n  winterAccent: #d4e8ef;\n  winterDark: #334155;\n  winterDarker: #1e293b;\n  winterHighlight: #cbd5e1;\n}\n[_nghost-%COMP%]     app-site-header {\n  display: block !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  pointer-events: auto !important;\n}\n.social-links-page[_ngcontent-%COMP%] {\n  min-height: calc(100vh + 400px);\n  height: auto;\n  color: #ffffff;\n  position: relative;\n  overflow-x: hidden;\n  overflow-y: auto;\n  margin-top: 89px;\n  scroll-behavior: smooth;\n  background:\n    radial-gradient(\n      ellipse at 15% 25%,\n      rgba(255, 255, 255, 0.08) 0%,\n      transparent 40%),\n    radial-gradient(\n      ellipse at 85% 75%,\n      rgba(248, 249, 250, 0.1) 0%,\n      transparent 45%),\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f8f9fa 25%,\n      #f5f5f5 50%,\n      #f0f0f0 75%,\n      #eeeeee 100%);\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  perspective: 1000px;\n}\n.social-links-page.anim-a[_ngcontent-%COMP%] {\n  overflow-y: auto !important;\n  overflow-x: hidden !important;\n  height: calc(100vh - 89px) !important;\n}\n.social-links-page[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background:\n    repeating-linear-gradient(\n      -45deg,\n      transparent 0px,\n      transparent 3px,\n      rgba(0, 0, 0, 0.02) 4px,\n      rgba(0, 0, 0, 0.02) 5px,\n      transparent 6px,\n      transparent 9px,\n      rgba(100, 100, 100, 0.015) 10px,\n      rgba(100, 100, 100, 0.015) 11px,\n      transparent 12px,\n      transparent 15px,\n      rgba(150, 150, 150, 0.01) 16px,\n      rgba(150, 150, 150, 0.01) 17px,\n      transparent 18px,\n      transparent 21px),\n    repeating-linear-gradient(\n      -75deg,\n      transparent 0px,\n      transparent 8px,\n      rgba(0, 0, 0, 0.008) 9px,\n      rgba(0, 0, 0, 0.008) 10px,\n      transparent 11px,\n      transparent 19px);\n  pointer-events: none;\n  z-index: 1;\n  transform: translateZ(0);\n  will-change:\n    background-position,\n    opacity,\n    filter;\n  backface-visibility: hidden;\n}\n.social-links-page.anim-a[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalSlideA 12s linear infinite;\n  will-change: background-position;\n}\n.social-links-page.anim-b[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalPulseB 6s ease-in-out infinite;\n}\n.social-links-page.anim-c[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalSweepC 4s linear infinite;\n}\n.social-links-page.anim-d[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalDriftD 15s linear infinite;\n}\n.social-links-page.anim-e[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalBreatheE 7s ease-in-out infinite;\n}\n.social-links-page.anim-f[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalColorShiftF 12s ease-in-out infinite;\n}\n.social-links-page.anim-g[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalMultiLayerG 20s linear infinite;\n}\n.social-links-page.anim-h[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalShimmerH 5s ease-in-out infinite;\n}\n.social-links-page.anim-i[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalGlitchI 8s linear infinite;\n}\n.social-links-page.anim-j[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalWaveJ 14s ease-in-out infinite;\n}\n.social-links-page.anim-k[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalFadeK 9s ease-in-out infinite;\n}\n.social-links-page.anim-l[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalBounceL 6s ease-in-out infinite;\n}\n.social-links-page.anim-m[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalContinuousM 11s linear infinite;\n}\n.social-links-page.anim-n[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalSpiralN 18s linear infinite;\n}\n.social-links-page.anim-o[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalZoomPulseO 7s ease-in-out infinite;\n}\n.social-links-page.anim-p[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalBlurWavesP 13s ease-in-out infinite;\n}\n.social-links-page.anim-q[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalOpacityWavesQ 10s ease-in-out infinite;\n}\n.social-links-page.anim-r[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalPositionOscillationR 16s ease-in-out infinite;\n}\n.social-links-page.anim-s[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalTemperatureShiftS 14s ease-in-out infinite;\n}\n.social-links-page.anim-t[_ngcontent-%COMP%]::before {\n  animation: _ngcontent-%COMP%_diagonalMorphingPatternT 12s ease-in-out infinite;\n}\n.social-links-page[_ngcontent-%COMP%]::after {\n  content: "";\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background:\n    radial-gradient(\n      circle at 10% 10%,\n      rgba(0, 0, 0, 0.015) 1px,\n      transparent 1px),\n    radial-gradient(\n      circle at 90% 90%,\n      rgba(100, 100, 100, 0.02) 1px,\n      transparent 1px),\n    radial-gradient(\n      circle at 30% 70%,\n      rgba(150, 150, 150, 0.01) 1px,\n      transparent 1px);\n  background-size:\n    100px 100px,\n    80px 80px,\n    120px 120px;\n  animation: _ngcontent-%COMP%_subtleFloat 20s infinite linear;\n  pointer-events: none;\n  z-index: 0;\n}\n.social-links-page[_ngcontent-%COMP%] {\n  --text-primary: #1e293b;\n  --text-secondary: #334155;\n  --text-muted: #64748b;\n  --text-light: #94a3b8;\n}\n.social-main[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n  padding: 0 2rem;\n  max-width: 1400px;\n  margin: 0 auto;\n  padding-top: 4rem;\n  padding-bottom: clamp(8rem, 15vh, 16rem);\n  min-height: calc(100vh + 300px);\n}\n.social-links-page.anim-a[_ngcontent-%COMP%]   .social-main[_ngcontent-%COMP%] {\n  min-height: calc(100vh + 500px) !important;\n  padding-bottom: 20rem !important;\n}\n.social-links-page.anim-a[_ngcontent-%COMP%]   .social-main[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  margin-bottom: 2rem;\n}\n.social-links-page.anim-a[_ngcontent-%COMP%]   .social-main[_ngcontent-%COMP%] {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 2rem;\n}\n.hero[_ngcontent-%COMP%] {\n  position: relative;\n  height: 25vh;\n  min-height: 220px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  margin-bottom: 3rem;\n  max-width: 1200px;\n  margin-left: auto;\n  margin-right: auto;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(167, 90, 201, 0.02) 0%,\n      rgba(143, 182, 136, 0.22) 50%,\n      rgba(187, 108, 164, 0.08) 100%);\n  backdrop-filter: blur(15px);\n  -webkit-backdrop-filter: blur(15px);\n  border-radius: 24px;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);\n  padding: 3rem 2.5rem;\n}\n.hero[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    radial-gradient(\n      circle at center,\n      rgba(255, 255, 255, 0.05) 0%,\n      transparent 60%);\n  pointer-events: none;\n  z-index: -1;\n}\n.hero[_ngcontent-%COMP%]   .hero-background[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-image: url(/assets/images/ui/composite_bg.png);\n  background-size: cover;\n  background-position: center;\n  z-index: -1;\n}\n.hero[_ngcontent-%COMP%]   .hero-background[_ngcontent-%COMP%]   .overlay[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8));\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%] {\n  text-align: center;\n  z-index: 1;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  max-width: 800px;\n  margin: 0 auto;\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto 1rem auto;\n  font-size: clamp(2rem, 4vw + 1rem, 4.5rem) !important;\n  line-height: 1.15 !important;\n  letter-spacing: clamp(-0.025em, -0.01vw, -0.015em) !important;\n  font-weight: 800 !important;\n  font-family:\n    "DALFITRA",\n    "Raleway",\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    Helvetica,\n    Arial,\n    sans-serif !important;\n  color: #eeeeee !important;\n  -webkit-text-fill-color: #eeeeee !important;\n  background: none !important;\n  -webkit-background-clip: unset !important;\n  background-clip: unset !important;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;\n}\n@media (max-width: 768px) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n    font-size: clamp(1.75rem, 6vw, 2.5rem) !important;\n    font-family:\n      "DALFITRA",\n      "Raleway",\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      Roboto,\n      Helvetica,\n      Arial,\n      sans-serif !important;\n  }\n}\n@media (max-width: 480px) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n    font-size: clamp(1.5rem, 8vw, 2rem) !important;\n    font-family:\n      "DALFITRA",\n      "Raleway",\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      Roboto,\n      Helvetica,\n      Arial,\n      sans-serif !important;\n  }\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  font-size: clamp(1.125rem, 1.0892857143rem + 0.0111607143vw, 1.25rem);\n  line-height: clamp(1.5, 1.5 + 0.5vw, 1.7);\n  letter-spacing: 0;\n  font-weight: 400;\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: clamp(1.5rem, 5vw, 3rem);\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.9);\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto 1rem auto;\n}\n@media (prefers-contrast: high) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    transition: none;\n    animation: none;\n  }\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n@media (max-width: 768px) {\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    text-shadow: none;\n    font-feature-settings: normal;\n    font-variant: normal;\n    font-family:\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      sans-serif;\n    text-rendering: optimizeSpeed;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n}\n.hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.8);\n  font-weight: 500;\n  position: relative;\n  z-index: 2;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto;\n}\n.artists[_ngcontent-%COMP%] {\n  padding: 2rem 0;\n}\n.artists[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  position: relative;\n  color: #fff;\n}\n.artists[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  font-size: clamp(1.875rem, 1.5535714286rem + 0.1004464286vw, 3rem);\n  line-height: clamp(1.2, 1.2 + 0.5vw, 1.3);\n  letter-spacing: -0.025em;\n  font-weight: 700;\n}\n.artists[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.artists[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: clamp(2rem, 6vw, 4rem);\n}\n@media (prefers-contrast: high) {\n  .artists[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .artists[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n    transition: none;\n    animation: none;\n  }\n}\n.artists[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .artists[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n@media (max-width: 768px) {\n  .artists[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n    text-shadow: none;\n    font-feature-settings: normal;\n    font-variant: normal;\n    font-family:\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      sans-serif;\n    text-rendering: optimizeSpeed;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n}\n.artists[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%]:after {\n  content: "";\n  position: absolute;\n  bottom: -15px;\n  left: 50%;\n  transform: translateX(-50%);\n  width: 80px;\n  height: 4px;\n  background:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      #ff5252);\n  border-radius: 2px;\n}\n.artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%] {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 3rem;\n  justify-content: center;\n  align-items: flex-start;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.85) 0%,\n      rgba(15, 15, 15, 0.9) 50%,\n      rgba(25, 25, 25, 0.85) 100%);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border-radius: 20px;\n  padding: 2rem;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);\n  transition: all 0.3s ease;\n  cursor: pointer;\n  width: 350px;\n  max-width: 100%;\n  position: relative;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}\n.artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-10px);\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);\n}\n.artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]:hover   .avatar-glow[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: scale(1.2);\n}\n.artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]:hover   .social-button[_ngcontent-%COMP%] {\n  transform: translateY(-2px);\n}\n.artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card.main-artist[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 600px;\n}\n.artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card.main-artist[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%]   .avatar-image[_ngcontent-%COMP%] {\n  width: 120px;\n  height: 120px;\n}\n.artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card.main-artist[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n}\n.artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card.main-artist[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n}\n.artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 3px;\n  background:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      #ff5252);\n  opacity: 0;\n  transition: opacity 0.3s ease;\n}\n.artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%]:hover::before {\n  opacity: 1;\n}\n.artist-avatar[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: center;\n  margin-bottom: 2rem;\n  position: relative;\n}\n.artist-avatar[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n}\n.artist-avatar[_ngcontent-%COMP%]   .avatar-image[_ngcontent-%COMP%] {\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 3px solid #ff7f50;\n  box-shadow: 0 4px 20px rgba(255, 127, 80, 0.3);\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n.artist-avatar[_ngcontent-%COMP%]   .avatar-glow[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 120px;\n  height: 120px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 127, 80, 0.3) 0%,\n      transparent 70%);\n  border-radius: 50%;\n  opacity: 0;\n  transition: all 0.5s ease;\n  z-index: 1;\n}\n.artist-avatar[_ngcontent-%COMP%]   .avatar-fallback[_ngcontent-%COMP%] {\n  position: relative;\n}\n.artist-avatar[_ngcontent-%COMP%]   .avatar-fallback[_ngcontent-%COMP%]::before {\n  content: "\\1f464";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 3rem;\n  color: rgba(255, 255, 255, 0.7);\n  background:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      rgba(255, 127, 80, 0.7));\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: 3px solid #ff7f50;\n  box-shadow: 0 4px 20px rgba(255, 127, 80, 0.3);\n}\n.artist-info[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 2rem;\n}\n.artist-info[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n  margin-bottom: 0.5rem;\n  color: #fff;\n}\n.artist-info[_ngcontent-%COMP%]   .artist-role[_ngcontent-%COMP%] {\n  color: #ff7f50;\n  margin-bottom: 1rem;\n  font-weight: 500;\n  opacity: 0.95;\n}\n.artist-info[_ngcontent-%COMP%]   .artist-description[_ngcontent-%COMP%] {\n  color: rgba(255, 255, 255, 0.7);\n}\n.social-links[_ngcontent-%COMP%]   .links-title[_ngcontent-%COMP%] {\n  text-align: center;\n  font-size: 1.2rem;\n  margin-bottom: 1.5rem;\n  color: #fff;\n  font-weight: 600;\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n  gap: 1rem;\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%] {\n  background: rgba(255, 255, 255, 0.05);\n  border: 2px solid rgba(255, 255, 255, 0.1);\n  border-radius: 12px;\n  padding: 1rem 0.75rem;\n  color: #fff;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  min-height: 80px;\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255, 255, 255, 0.1),\n      transparent);\n  transition: left 0.5s ease;\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]:hover::before {\n  left: 100%;\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]:hover {\n  border-color: rgba(255, 255, 255, 0.4);\n  background: rgba(255, 255, 255, 0.1);\n  transform: translateY(-3px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]:hover   .social-icon[_ngcontent-%COMP%] {\n  transform: scale(1.2);\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]:hover   .social-arrow[_ngcontent-%COMP%] {\n  transform: translateX(3px);\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button.coming-soon[_ngcontent-%COMP%] {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button.coming-soon[_ngcontent-%COMP%]:hover {\n  transform: none;\n  border-color: rgba(255, 255, 255, 0.2);\n  background: rgba(255, 255, 255, 0.05);\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]   .social-icon[_ngcontent-%COMP%] {\n  font-size: 1.5rem;\n  transition: transform 0.3s ease;\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]   .social-platform[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: 600;\n  text-align: center;\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]   .social-arrow[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  transition: transform 0.3s ease;\n  color: rgba(255, 255, 255, 0.8);\n}\n.social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]   .coming-soon-text[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  opacity: 0.7;\n  color: rgba(255, 255, 255, 0.5);\n}\n.community[_ngcontent-%COMP%] {\n  padding: 4rem 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.85) 0%,\n      rgba(15, 15, 15, 0.9) 50%,\n      rgba(25, 25, 25, 0.85) 100%);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  margin: 4rem 0;\n  width: 100vw;\n  margin-left: calc(-50vw + 50%);\n  margin-right: calc(-50vw + 50%);\n  border-radius: 8px;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}\n.community[_ngcontent-%COMP%]   .community-content[_ngcontent-%COMP%] {\n  max-width: 800px;\n  margin: 0 auto;\n  text-align: center;\n}\n.community[_ngcontent-%COMP%]   .community-content[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  font-size: 2.5rem;\n  margin-bottom: 2rem;\n  color: #fff;\n}\n.community[_ngcontent-%COMP%]   .community-content[_ngcontent-%COMP%]   .community-text[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  line-height: 1.8;\n  margin-bottom: 3rem;\n  color: rgba(255, 255, 255, 0.8);\n}\n.community[_ngcontent-%COMP%]   .community-content[_ngcontent-%COMP%]   .community-stats[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 2rem;\n}\n.community[_ngcontent-%COMP%]   .community-content[_ngcontent-%COMP%]   .community-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .stat-number[_ngcontent-%COMP%] {\n  display: block;\n  font-size: 2.5rem;\n  font-weight: 800;\n  color: #ff7f50;\n  margin-bottom: 0.5rem;\n}\n.community[_ngcontent-%COMP%]   .community-content[_ngcontent-%COMP%]   .community-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .stat-label[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.7);\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}\n@keyframes _ngcontent-%COMP%_diagonalSlideA {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 42px 42px, 38px 38px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalPulseB {\n  0%, 100% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0.7;\n  }\n  50% {\n    opacity: 0.9;\n  }\n  75% {\n    opacity: 0.6;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalSweepC {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 84px 84px, 76px 76px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalDriftD {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    background-position: 30px 30px, 25px 25px;\n  }\n  75% {\n    background-position: 45px 45px, 38px 38px;\n  }\n  100% {\n    background-position: 60px 60px, 50px 50px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalBreatheE {\n  0%, 100% {\n    filter: opacity(1) saturate(1);\n  }\n  50% {\n    filter: opacity(0.4) saturate(1.3);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalColorShiftF {\n  0%, 100% {\n    filter: hue-rotate(0deg);\n  }\n  33% {\n    filter: hue-rotate(30deg);\n  }\n  66% {\n    filter: hue-rotate(-20deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalMultiLayerG {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 21px 21px, -19px -19px;\n  }\n  50% {\n    background-position: 42px 42px, -38px -38px;\n  }\n  75% {\n    background-position: 63px 63px, -57px -57px;\n  }\n  100% {\n    background-position: 84px 84px, -76px -76px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalShimmerH {\n  0%, 100% {\n    filter: brightness(1) contrast(1);\n  }\n  25% {\n    filter: brightness(1.4) contrast(1.2);\n  }\n  50% {\n    filter: brightness(0.8) contrast(1.1);\n  }\n  75% {\n    filter: brightness(1.6) contrast(1.3);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalGlitchI {\n  0%, 85%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  10% {\n    background-position: 5px 5px, -3px -3px;\n  }\n  15% {\n    background-position: -8px -8px, 6px 6px;\n  }\n  20% {\n    background-position: 12px 12px, -10px -10px;\n  }\n  25% {\n    background-position: -5px -5px, 8px 8px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalWaveJ {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 30px 15px, -20px -10px;\n  }\n  50% {\n    background-position: 10px 40px, -15px -25px;\n  }\n  75% {\n    background-position: -20px 25px, 25px -15px;\n  }\n  100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalFadeK {\n  0%, 100% {\n    filter: opacity(1);\n  }\n  20% {\n    filter: opacity(0.2);\n  }\n  40% {\n    filter: opacity(0.8);\n  }\n  60% {\n    filter: opacity(0.1);\n  }\n  80% {\n    filter: opacity(0.6);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalBounceL {\n  0%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    background-position: -10px -10px, -8px -8px;\n  }\n  75% {\n    background-position: 20px 20px, 16px 16px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalContinuousM {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 220px 220px, 200px 200px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalSpiralN {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 30px 15px, 25px 12px;\n  }\n  50% {\n    background-position: 15px 30px, 12px 25px;\n  }\n  75% {\n    background-position: -15px 15px, -12px 12px;\n  }\n  100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalZoomPulseO {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n  50% {\n    transform: scale(1.02);\n    opacity: 0.9;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalBlurWavesP {\n  0%, 100% {\n    filter: blur(0px);\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    filter: blur(1px);\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    filter: blur(2px);\n    background-position: 30px 30px, 25px 25px;\n  }\n  75% {\n    filter: blur(1px);\n    background-position: 15px 15px, 12px 12px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalOpacityWavesQ {\n  0%, 100% {\n    filter: opacity(1);\n  }\n  16% {\n    filter: opacity(0.3);\n  }\n  32% {\n    filter: opacity(0.7);\n  }\n  48% {\n    filter: opacity(0.2);\n  }\n  64% {\n    filter: opacity(0.9);\n  }\n  80% {\n    filter: opacity(0.4);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalPositionOscillationR {\n  0%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 8px 12px, 6px 10px;\n  }\n  50% {\n    background-position: -12px 8px, -10px 6px;\n  }\n  75% {\n    background-position: 15px -10px, 12px -8px;\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalTemperatureShiftS {\n  0%, 100% {\n    filter: hue-rotate(0deg) brightness(1);\n  }\n  33% {\n    filter: hue-rotate(45deg) brightness(1.2);\n  }\n  66% {\n    filter: hue-rotate(-30deg) brightness(0.8);\n  }\n}\n@keyframes _ngcontent-%COMP%_diagonalMorphingPatternT {\n  0%, 100% {\n    background-position: 0px 0px, 0px 0px;\n    filter: brightness(1);\n  }\n  25% {\n    background-position: 20px 10px, 18px 8px;\n    filter: brightness(1.1);\n  }\n  50% {\n    background-position: 40px 20px, 35px 18px;\n    filter: brightness(0.9);\n  }\n  75% {\n    background-position: 20px 30px, 18px 25px;\n    filter: brightness(1.05);\n  }\n}\n@keyframes _ngcontent-%COMP%_subtleFloat {\n  0% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n  33% {\n    background-position:\n      30px 20px,\n      20px 40px,\n      40px 10px;\n  }\n  66% {\n    background-position:\n      20px 40px,\n      40px 20px,\n      10px 30px;\n  }\n  100% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n}\n@keyframes _ngcontent-%COMP%_titleGlow {\n  0% {\n    filter: brightness(1) saturate(1);\n    text-shadow: 0 0 10px rgba(255, 127, 80, 0.3);\n  }\n  100% {\n    filter: brightness(1.1) saturate(1.2);\n    text-shadow: 0 0 20px rgba(255, 127, 80, 0.6);\n  }\n}\n@keyframes _ngcontent-%COMP%_borderGlow {\n  0%, 100% {\n    background-position: 0% 50%;\n  }\n  50% {\n    background-position: 100% 50%;\n  }\n}\n@keyframes _ngcontent-%COMP%_artistCardFloat {\n  0% {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes _ngcontent-%COMP%_socialButtonPop {\n  0% {\n    transform: scale(0.8);\n    opacity: 0;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n@keyframes _ngcontent-%COMP%_avatarPulse {\n  0% {\n    transform: scale(1);\n    box-shadow: 0 4px 20px rgba(255, 127, 80, 0.3);\n  }\n  50% {\n    transform: scale(1.05);\n    box-shadow: 0 8px 30px rgba(255, 127, 80, 0.5);\n  }\n  100% {\n    transform: scale(1);\n    box-shadow: 0 4px 20px rgba(255, 127, 80, 0.3);\n  }\n}\n.artist-card[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_artistCardFloat 0.6s ease-out;\n  animation-fill-mode: both;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(1) {\n  animation-delay: 0.15s;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.3s;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.45s;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(4) {\n  animation-delay: 0.6s;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(5) {\n  animation-delay: 0.75s;\n}\n.artist-card[_ngcontent-%COMP%]:hover   .avatar-image[_ngcontent-%COMP%] {\n  transform: scale(1.05);\n  box-shadow: 0 6px 25px rgba(255, 127, 80, 0.4);\n}\n.social-button[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_socialButtonPop 0.4s ease-out;\n  animation-fill-mode: both;\n}\n.social-button[_ngcontent-%COMP%]:nth-child(1) {\n  animation-delay: 0.68s;\n}\n.social-button[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.76s;\n}\n.social-button[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.84s;\n}\n.social-button[_ngcontent-%COMP%]:nth-child(4) {\n  animation-delay: 0.92s;\n}\n.social-button[_ngcontent-%COMP%]:nth-child(5) {\n  animation-delay: 1s;\n}\n.social-button[_ngcontent-%COMP%]:nth-child(6) {\n  animation-delay: 1.08s;\n}\n.social-button[_ngcontent-%COMP%]:nth-child(7) {\n  animation-delay: 1.16s;\n}\n.social-button[_ngcontent-%COMP%]:nth-child(8) {\n  animation-delay: 1.24s;\n}\n.social-button[_ngcontent-%COMP%]:hover::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 255, 255, 0.1) 0%,\n      transparent 70%);\n  border-radius: 12px;\n  animation: _ngcontent-%COMP%_ripple 0.6s ease-out;\n}\n@keyframes _ngcontent-%COMP%_ripple {\n  0% {\n    transform: scale(0);\n    opacity: 1;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 0;\n  }\n}\n.community-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]:hover   .stat-number[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_numberBounce 0.5s ease-in-out;\n}\n@keyframes _ngcontent-%COMP%_numberBounce {\n  0%, 100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.1);\n  }\n}\n.social-button[data-platform=spotify][_ngcontent-%COMP%]:hover {\n  border-color: #1DB954;\n  box-shadow: 0 0 20px rgba(29, 185, 84, 0.3);\n}\n.social-button[data-platform=soundcloud][_ngcontent-%COMP%]:hover {\n  border-color: #FF5500;\n  box-shadow: 0 0 20px rgba(255, 85, 0, 0.3);\n}\n.social-button[data-platform=youtube][_ngcontent-%COMP%]:hover {\n  border-color: #FF0000;\n  box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);\n}\n.social-button[data-platform=github][_ngcontent-%COMP%]:hover {\n  border-color: #333333;\n  box-shadow: 0 0 20px rgba(51, 51, 51, 0.3);\n}\n.social-button[data-platform=discord][_ngcontent-%COMP%]:hover {\n  border-color: #5865F2;\n  box-shadow: 0 0 20px rgba(88, 101, 242, 0.3);\n}\n@media (prefers-reduced-motion: reduce) {\n  .social-links-page[_ngcontent-%COMP%]::before, \n   .social-links-page[_ngcontent-%COMP%]::after {\n    animation: none !important;\n  }\n  .social-links-page.anim-a[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-b[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-c[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-d[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-e[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-f[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-g[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-h[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-i[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-j[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-k[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-l[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-m[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-n[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-o[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-p[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-q[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-r[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-s[_ngcontent-%COMP%]::before, \n   .social-links-page.anim-t[_ngcontent-%COMP%]::before {\n    animation: none !important;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n    animation: none !important;\n  }\n  .artist-card[_ngcontent-%COMP%], \n   .social-button[_ngcontent-%COMP%] {\n    animation: none !important;\n  }\n}\n@media (max-width: 768px) {\n  .social-links-page[_ngcontent-%COMP%] {\n  }\n  .social-main[_ngcontent-%COMP%] {\n    padding-bottom: clamp(12rem, 20vh, 18rem);\n  }\n  .hero[_ngcontent-%COMP%] {\n    padding: 2rem 0;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%] {\n    padding: 2rem 1.5rem;\n    border-radius: 20px;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n    font-size: 2.5rem;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .artists[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n  .artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%] {\n    gap: 2rem;\n  }\n  .artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n    width: 100%;\n  }\n  .artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card.main-artist[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n  .social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));\n    gap: 0.75rem;\n  }\n  .social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%] {\n    padding: 0.75rem 0.5rem;\n    min-height: 70px;\n  }\n  .social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]   .social-icon[_ngcontent-%COMP%] {\n    font-size: 1.3rem;\n  }\n  .social-links[_ngcontent-%COMP%]   .social-buttons[_ngcontent-%COMP%]   .social-button[_ngcontent-%COMP%]   .social-platform[_ngcontent-%COMP%] {\n    font-size: 0.8rem;\n  }\n  .community[_ngcontent-%COMP%] {\n    padding: 3rem 1rem;\n  }\n  .community[_ngcontent-%COMP%]   .community-content[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n  .community[_ngcontent-%COMP%]   .community-content[_ngcontent-%COMP%]   .community-stats[_ngcontent-%COMP%] {\n    gap: 1.5rem;\n  }\n  .community[_ngcontent-%COMP%]   .community-content[_ngcontent-%COMP%]   .community-stats[_ngcontent-%COMP%]   .stat[_ngcontent-%COMP%]   .stat-number[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n}\n@media (max-width: 480px) {\n  .social-links-page[_ngcontent-%COMP%] {\n  }\n  .social-main[_ngcontent-%COMP%] {\n    padding: 0 1rem;\n    padding-top: 2rem;\n    padding-bottom: clamp(16rem, 25vh, 22rem);\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%] {\n    padding: 1.5rem 1rem;\n    border-radius: 16px;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .title[_ngcontent-%COMP%] {\n    font-size: 2rem;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%] {\n    font-size: 1.1rem;\n  }\n  .hero[_ngcontent-%COMP%]   .hero-content[_ngcontent-%COMP%]   .description[_ngcontent-%COMP%] {\n    font-size: 1rem;\n  }\n  .artists[_ngcontent-%COMP%]   .artists-grid[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n  }\n}\n/*# sourceMappingURL=social-links.css.map */'], changeDetection: 0 });
var SocialLinksComponent = _SocialLinksComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SocialLinksComponent, [{
    type: Component,
    args: [{ selector: "app-social-links", standalone: true, imports: [CommonModule, MatIconModule, SiteHeaderComponent, SquaresAnimationComponent, SocialsArtistCardsComponent], changeDetection: ChangeDetectionStrategy.OnPush, template: `<!-- Site Header -->
<app-site-header></app-site-header>

<!-- Social Links Page -->
<div class="social-links-page anim-a">
  
  <!-- TypeScript-based Square Animation (48 squares with space-like movement) -->
  <app-squares-animation [count]="48" [enabled]="true"></app-squares-animation>

  <!-- Main Content -->
  <main class="social-main">
    
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="title">ARTIST CIRCLES</h1>
        <p class="subtitle">Connect with the creators behind Prismatic Collections</p>
        <p class="description">
          Explore our artists' social media platforms, follow their journeys,
          and stay updated with their latest musical creations and collaborations.
        </p>
      </div>
      <div class="hero-background">
        <div class="overlay"></div>
      </div>
    </section>

    <!-- Artists Section with New Component -->
    <section class="artists">
      <app-socials-artist-cards
        [displayMode]="'all'"
        [maxVisibleCards]="24"
        [enableAnimations]="true"
        [showFilters]="true"
        [compactMode]="false">
      </app-socials-artist-cards>
    </section>

    <!-- Community Section -->
    <section class="community">
      <div class="community-content">
        <h2 class="section-title">Join Our Community</h2>
        <p class="community-text">
          Be part of the Prismatic Collections community! Follow our artists,
          share your thoughts, and discover new music together across both Phantasia projects.
        </p>
        <div class="community-stats">
          <div class="stat">
            <span class="stat-number">60+</span>
            <span class="stat-label">Contributing Artists</span>
          </div>
          <div class="stat">
            <span class="stat-number">34</span>
            <span class="stat-label">Released Tracks</span>
          </div>
          <div class="stat">
            <span class="stat-number">2</span>
            <span class="stat-label">Phantasia Projects</span>
          </div>
          <div class="stat">
            <span class="stat-number">\u221E</span>
            <span class="stat-label">Musical Possibilities</span>
          </div>
        </div>
      </div>
    </section>
    
  </main>
  
</div>
`, styles: ['@charset "UTF-8";\n\n/* src/app/pages/social-links/social-links.scss */\n.typography {\n}\n.typography-display-large {\n  font-size: 3.75rem;\n  font-weight: 900;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-display-medium {\n  font-size: 3rem;\n  font-weight: 800;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-heading-1 {\n  font-size: 2.25rem;\n  font-weight: 700;\n  line-height: 1.25;\n  letter-spacing: -0.025em;\n}\n.typography-heading-2,\n.artist-info .artist-name {\n  font-size: 1.875rem;\n  font-weight: 700;\n  line-height: 1.375;\n}\n.typography-heading-3 {\n  font-size: 1.5rem;\n  font-weight: 600;\n  line-height: 1.375;\n}\n.typography-heading-4 {\n  font-size: 1.25rem;\n  font-weight: 600;\n  line-height: 1.5;\n}\n.typography-body-large,\n.artist-info .artist-role {\n  font-size: 1.125rem;\n  font-weight: 400;\n  line-height: 1.625;\n}\n.typography-body-medium,\n.artist-info .artist-description {\n  font-size: 1rem;\n  font-weight: 400;\n  line-height: 1.5;\n}\n.typography-body-small {\n  font-size: 0.875rem;\n  font-weight: 400;\n  line-height: 1.5;\n}\n.typography-label-large {\n  font-size: 1rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.0125em;\n}\n.typography-label-medium {\n  font-size: 0.875rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.025em;\n}\n.typography-label-small {\n  font-size: 0.75rem;\n  font-weight: 500;\n  line-height: 1.5;\n  letter-spacing: 0.05em;\n  text-transform: uppercase;\n}\n@media (max-width: 768px) {\n  .typography-display-large {\n    font-size: 2.25rem;\n  }\n  .typography-display-medium {\n    font-size: 1.875rem;\n  }\n  .typography-heading-1 {\n    font-size: 1.875rem;\n  }\n  .typography-heading-2,\n  .artist-info .artist-name {\n    font-size: 1.5rem;\n  }\n}\n@media (max-width: 480px) {\n  .typography-display-large {\n    font-size: 1.875rem;\n  }\n  .typography-display-medium {\n    font-size: 1.5rem;\n  }\n  .typography-heading-1 {\n    font-size: 1.5rem;\n  }\n}\n:root {\n  --primary-color: #ff7f50;\n  --gradient-primary:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      #ff5252);\n  --category-project-updates-color: #6c757d;\n  --category-project-updates-gradient:\n    linear-gradient(\n      135deg,\n      #6c757d,\n      #495057);\n  --category-project-updates-light: rgba(108, 117, 125, 0.1);\n  --category-releases-color: #10b981;\n  --category-releases-gradient:\n    linear-gradient(\n      135deg,\n      #10b981,\n      #059669);\n  --category-releases-light: rgba(16, 185, 129, 0.1);\n  --category-announcements-color: #f59e0b;\n  --category-announcements-gradient:\n    linear-gradient(\n      135deg,\n      #f59e0b,\n      #d97706);\n  --category-announcements-light: rgba(245, 158, 11, 0.1);\n  --category-technical-updates-color: #495057;\n  --category-technical-updates-gradient:\n    linear-gradient(\n      135deg,\n      #495057,\n      #343a40);\n  --category-technical-updates-light: rgba(73, 80, 87, 0.1);\n  --category-community-color: #ec4899;\n  --category-community-gradient:\n    linear-gradient(\n      135deg,\n      #ec4899,\n      #db2777);\n  --category-community-light: rgba(236, 72, 153, 0.1);\n  --social-spotify-color: #1DB954;\n  --social-soundcloud-color: #FF5500;\n  --social-youtube-color: #FF0000;\n  --social-github-color: #333333;\n  --social-discord-color: #5865F2;\n  --social-bandcamp-color: #629AA0;\n  --social-instagram-color: #E4405F;\n  --social-twitter-color: #1DA1F2;\n  --success-color: #10b981;\n  --warning-color: #f59e0b;\n  --error-color: #ef4444;\n  --info-color: #3b82f6;\n}\n.focus-enhanced:focus-visible,\n.interactive-element:focus-visible,\n.filter-button:focus-visible,\n.social-button:focus-visible,\n.news-article:focus-visible,\n.featured-article:focus-visible,\n.artist-card:focus-visible {\n  outline: 3px solid #ff7f50;\n  outline-offset: 2px;\n  border-radius: 4px;\n  box-shadow: 0 0 0 3px rgba(255, 127, 80, 0.2);\n}\n.interactive-element:focus-visible,\n.filter-button:focus-visible,\n.social-button:focus-visible,\n.news-article:focus-visible,\n.featured-article:focus-visible,\n.artist-card:focus-visible {\n  transform: translateY(-1px);\n  transition: all 0.2s ease;\n}\n.interactive-element:active,\n.filter-button:active,\n.social-button:active,\n.news-article:active,\n.featured-article:active,\n.artist-card:active {\n  transform: translateY(0);\n}\n.skip-link {\n  position: absolute;\n  top: -40px;\n  left: 6px;\n  background: #000;\n  color: white;\n  padding: 8px;\n  text-decoration: none;\n  border-radius: 0 0 4px 4px;\n  z-index: 1000;\n}\n.skip-link:focus {\n  top: 0;\n}\n.sr-only {\n  position: absolute;\n  width: 1px;\n  height: 1px;\n  padding: 0;\n  margin: -1px;\n  overflow: hidden;\n  clip: rect(0, 0, 0, 0);\n  white-space: nowrap;\n  border: 0;\n}\n@media (prefers-contrast: high) {\n  .category-badge,\n  .filter-button,\n  .social-button {\n    border: 2px solid currentColor;\n  }\n  .article-card,\n  .artist-card {\n    border: 1px solid rgba(255, 255, 255, 0.3);\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  *,\n  *::before,\n  *::after {\n    animation-duration: 0.01ms !important;\n    animation-iteration-count: 1 !important;\n    transition-duration: 0.01ms !important;\n  }\n  .triangle {\n    animation: none !important;\n  }\n  .triangle::after {\n    animation: none !important;\n  }\n}\n.status-indicator::before {\n  content: attr(data-status);\n  font-weight: bold;\n  margin-right: 0.5rem;\n}\n.status-indicator.available::before {\n  content: "\\2713  ";\n  color: #10b981;\n}\n.status-indicator.coming-soon::before {\n  content: "\\23f3  ";\n  color: #f59e0b;\n}\n.status-indicator.unavailable::before {\n  content: "\\2717  ";\n  color: #ef4444;\n}\n.keyboard-nav-active .filter-button:focus,\n.keyboard-nav-active .social-button:focus,\n.keyboard-nav-active .article:focus,\n.keyboard-nav-active .artist-card:focus {\n  transform: scale(1.02);\n  z-index: 10;\n  position: relative;\n}\n.touch-target {\n  min-width: 44px;\n  min-height: 44px;\n  display: inline-flex;\n  align-items: center;\n  justify-content: center;\n}\n.readable-content {\n  max-width: 65ch;\n  line-height: 1.6;\n}\n.readable-content h1,\n.readable-content h2,\n.readable-content h3,\n.readable-content h4,\n.readable-content h5,\n.readable-content h6 {\n  line-height: 1.3;\n  margin-bottom: 0.5em;\n}\n.readable-content p {\n  margin-bottom: 1em;\n}\n.error-state {\n  color: #ef4444;\n  border-color: #ef4444;\n}\n.error-state:focus {\n  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.2);\n}\n.loading-state {\n  position: relative;\n  color: transparent;\n}\n.loading-state::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.1) 25%,\n      rgba(255, 255, 255, 0.2) 50%,\n      rgba(255, 255, 255, 0.1) 75%);\n  background-size: 200% 100%;\n  animation: loading-shimmer 1.5s infinite;\n}\n@keyframes loading-shimmer {\n  0% {\n    background-position: -200% 0;\n  }\n  100% {\n    background-position: 200% 0;\n  }\n}\n@keyframes winterFloat {\n  0% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n  33% {\n    background-position:\n      40px 20px,\n      20px 40px,\n      35px 15px;\n  }\n  66% {\n    background-position:\n      20px 40px,\n      40px 20px,\n      15px 35px;\n  }\n  100% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n}\n:export {\n  winterPrimary: #f0f4f8;\n  winterSecondary: #e6f0f5;\n  winterAccent: #d4e8ef;\n  winterDark: #334155;\n  winterDarker: #1e293b;\n  winterHighlight: #cbd5e1;\n}\n:host ::ng-deep app-site-header {\n  display: block !important;\n  visibility: visible !important;\n  opacity: 1 !important;\n  pointer-events: auto !important;\n}\n.social-links-page {\n  min-height: calc(100vh + 400px);\n  height: auto;\n  color: #ffffff;\n  position: relative;\n  overflow-x: hidden;\n  overflow-y: auto;\n  margin-top: 89px;\n  scroll-behavior: smooth;\n  background:\n    radial-gradient(\n      ellipse at 15% 25%,\n      rgba(255, 255, 255, 0.08) 0%,\n      transparent 40%),\n    radial-gradient(\n      ellipse at 85% 75%,\n      rgba(248, 249, 250, 0.1) 0%,\n      transparent 45%),\n    linear-gradient(\n      180deg,\n      #ffffff 0%,\n      #f8f9fa 25%,\n      #f5f5f5 50%,\n      #f0f0f0 75%,\n      #eeeeee 100%);\n  transform: translateZ(0);\n  backface-visibility: hidden;\n  perspective: 1000px;\n}\n.social-links-page.anim-a {\n  overflow-y: auto !important;\n  overflow-x: hidden !important;\n  height: calc(100vh - 89px) !important;\n}\n.social-links-page::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background:\n    repeating-linear-gradient(\n      -45deg,\n      transparent 0px,\n      transparent 3px,\n      rgba(0, 0, 0, 0.02) 4px,\n      rgba(0, 0, 0, 0.02) 5px,\n      transparent 6px,\n      transparent 9px,\n      rgba(100, 100, 100, 0.015) 10px,\n      rgba(100, 100, 100, 0.015) 11px,\n      transparent 12px,\n      transparent 15px,\n      rgba(150, 150, 150, 0.01) 16px,\n      rgba(150, 150, 150, 0.01) 17px,\n      transparent 18px,\n      transparent 21px),\n    repeating-linear-gradient(\n      -75deg,\n      transparent 0px,\n      transparent 8px,\n      rgba(0, 0, 0, 0.008) 9px,\n      rgba(0, 0, 0, 0.008) 10px,\n      transparent 11px,\n      transparent 19px);\n  pointer-events: none;\n  z-index: 1;\n  transform: translateZ(0);\n  will-change:\n    background-position,\n    opacity,\n    filter;\n  backface-visibility: hidden;\n}\n.social-links-page.anim-a::before {\n  animation: diagonalSlideA 12s linear infinite;\n  will-change: background-position;\n}\n.social-links-page.anim-b::before {\n  animation: diagonalPulseB 6s ease-in-out infinite;\n}\n.social-links-page.anim-c::before {\n  animation: diagonalSweepC 4s linear infinite;\n}\n.social-links-page.anim-d::before {\n  animation: diagonalDriftD 15s linear infinite;\n}\n.social-links-page.anim-e::before {\n  animation: diagonalBreatheE 7s ease-in-out infinite;\n}\n.social-links-page.anim-f::before {\n  animation: diagonalColorShiftF 12s ease-in-out infinite;\n}\n.social-links-page.anim-g::before {\n  animation: diagonalMultiLayerG 20s linear infinite;\n}\n.social-links-page.anim-h::before {\n  animation: diagonalShimmerH 5s ease-in-out infinite;\n}\n.social-links-page.anim-i::before {\n  animation: diagonalGlitchI 8s linear infinite;\n}\n.social-links-page.anim-j::before {\n  animation: diagonalWaveJ 14s ease-in-out infinite;\n}\n.social-links-page.anim-k::before {\n  animation: diagonalFadeK 9s ease-in-out infinite;\n}\n.social-links-page.anim-l::before {\n  animation: diagonalBounceL 6s ease-in-out infinite;\n}\n.social-links-page.anim-m::before {\n  animation: diagonalContinuousM 11s linear infinite;\n}\n.social-links-page.anim-n::before {\n  animation: diagonalSpiralN 18s linear infinite;\n}\n.social-links-page.anim-o::before {\n  animation: diagonalZoomPulseO 7s ease-in-out infinite;\n}\n.social-links-page.anim-p::before {\n  animation: diagonalBlurWavesP 13s ease-in-out infinite;\n}\n.social-links-page.anim-q::before {\n  animation: diagonalOpacityWavesQ 10s ease-in-out infinite;\n}\n.social-links-page.anim-r::before {\n  animation: diagonalPositionOscillationR 16s ease-in-out infinite;\n}\n.social-links-page.anim-s::before {\n  animation: diagonalTemperatureShiftS 14s ease-in-out infinite;\n}\n.social-links-page.anim-t::before {\n  animation: diagonalMorphingPatternT 12s ease-in-out infinite;\n}\n.social-links-page::after {\n  content: "";\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background:\n    radial-gradient(\n      circle at 10% 10%,\n      rgba(0, 0, 0, 0.015) 1px,\n      transparent 1px),\n    radial-gradient(\n      circle at 90% 90%,\n      rgba(100, 100, 100, 0.02) 1px,\n      transparent 1px),\n    radial-gradient(\n      circle at 30% 70%,\n      rgba(150, 150, 150, 0.01) 1px,\n      transparent 1px);\n  background-size:\n    100px 100px,\n    80px 80px,\n    120px 120px;\n  animation: subtleFloat 20s infinite linear;\n  pointer-events: none;\n  z-index: 0;\n}\n.social-links-page {\n  --text-primary: #1e293b;\n  --text-secondary: #334155;\n  --text-muted: #64748b;\n  --text-light: #94a3b8;\n}\n.social-main {\n  position: relative;\n  z-index: 2;\n  padding: 0 2rem;\n  max-width: 1400px;\n  margin: 0 auto;\n  padding-top: 4rem;\n  padding-bottom: clamp(8rem, 15vh, 16rem);\n  min-height: calc(100vh + 300px);\n}\n.social-links-page.anim-a .social-main {\n  min-height: calc(100vh + 500px) !important;\n  padding-bottom: 20rem !important;\n}\n.social-links-page.anim-a .social-main > * {\n  margin-bottom: 2rem;\n}\n.social-links-page.anim-a .social-main {\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  gap: 2rem;\n}\n.hero {\n  position: relative;\n  height: 25vh;\n  min-height: 220px;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  overflow: hidden;\n  margin-bottom: 3rem;\n  max-width: 1200px;\n  margin-left: auto;\n  margin-right: auto;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(167, 90, 201, 0.02) 0%,\n      rgba(143, 182, 136, 0.22) 50%,\n      rgba(187, 108, 164, 0.08) 100%);\n  backdrop-filter: blur(15px);\n  -webkit-backdrop-filter: blur(15px);\n  border-radius: 24px;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);\n  padding: 3rem 2.5rem;\n}\n.hero::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    radial-gradient(\n      circle at center,\n      rgba(255, 255, 255, 0.05) 0%,\n      transparent 60%);\n  pointer-events: none;\n  z-index: -1;\n}\n.hero .hero-background {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background-image: url(/assets/images/ui/composite_bg.png);\n  background-size: cover;\n  background-position: center;\n  z-index: -1;\n}\n.hero .hero-background .overlay {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  background: linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8));\n}\n.hero .hero-content {\n  text-align: center;\n  z-index: 1;\n  position: relative;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n  width: 100%;\n  max-width: 800px;\n  margin: 0 auto;\n}\n.hero .hero-content .title {\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto 1rem auto;\n  font-size: clamp(2rem, 4vw + 1rem, 4.5rem) !important;\n  line-height: 1.15 !important;\n  letter-spacing: clamp(-0.025em, -0.01vw, -0.015em) !important;\n  font-weight: 800 !important;\n  font-family:\n    "DALFITRA",\n    "Raleway",\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    Roboto,\n    Helvetica,\n    Arial,\n    sans-serif !important;\n  color: #eeeeee !important;\n  -webkit-text-fill-color: #eeeeee !important;\n  background: none !important;\n  -webkit-background-clip: unset !important;\n  background-clip: unset !important;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3) !important;\n}\n@media (max-width: 768px) {\n  .hero .hero-content .title {\n    font-size: clamp(1.75rem, 6vw, 2.5rem) !important;\n    font-family:\n      "DALFITRA",\n      "Raleway",\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      Roboto,\n      Helvetica,\n      Arial,\n      sans-serif !important;\n  }\n}\n@media (max-width: 480px) {\n  .hero .hero-content .title {\n    font-size: clamp(1.5rem, 8vw, 2rem) !important;\n    font-family:\n      "DALFITRA",\n      "Raleway",\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      Roboto,\n      Helvetica,\n      Arial,\n      sans-serif !important;\n  }\n}\n.hero .hero-content .subtitle {\n  font-size: clamp(1.125rem, 1.0892857143rem + 0.0111607143vw, 1.25rem);\n  line-height: clamp(1.5, 1.5 + 0.5vw, 1.7);\n  letter-spacing: 0;\n  font-weight: 400;\n}\n.hero .hero-content .subtitle {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.hero .hero-content .subtitle {\n  text-align: center;\n  margin-bottom: clamp(1.5rem, 5vw, 3rem);\n}\n.hero .hero-content .subtitle {\n  color: rgba(255, 255, 255, 0.9);\n  position: relative;\n  z-index: 1;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto 1rem auto;\n}\n@media (prefers-contrast: high) {\n  .hero .hero-content .subtitle {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .hero .hero-content .subtitle {\n    transition: none;\n    animation: none;\n  }\n}\n.hero .hero-content .subtitle:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .hero .hero-content .subtitle {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n@media (max-width: 768px) {\n  .hero .hero-content .subtitle {\n    text-shadow: none;\n    font-feature-settings: normal;\n    font-variant: normal;\n    font-family:\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      sans-serif;\n    text-rendering: optimizeSpeed;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n}\n.hero .hero-content .description {\n  color: rgba(255, 255, 255, 0.8);\n  font-weight: 500;\n  position: relative;\n  z-index: 2;\n  text-align: center;\n  width: 100%;\n  margin: 0 auto;\n}\n.artists {\n  padding: 2rem 0;\n}\n.artists .section-title {\n  position: relative;\n  color: #fff;\n}\n.artists .section-title {\n  font-size: clamp(1.875rem, 1.5535714286rem + 0.1004464286vw, 3rem);\n  line-height: clamp(1.2, 1.2 + 0.5vw, 1.3);\n  letter-spacing: -0.025em;\n  font-weight: 700;\n}\n.artists .section-title {\n  font-family:\n    system-ui,\n    -apple-system,\n    BlinkMacSystemFont,\n    "Segoe UI",\n    sans-serif;\n}\n.artists .section-title {\n  text-align: center;\n  margin-bottom: clamp(2rem, 6vw, 4rem);\n}\n@media (prefers-contrast: high) {\n  .artists .section-title {\n    text-shadow: none;\n    background: transparent;\n    font-weight: 600;\n  }\n}\n@media (prefers-reduced-motion: reduce) {\n  .artists .section-title {\n    transition: none;\n    animation: none;\n  }\n}\n.artists .section-title:focus-visible {\n  outline: 2px solid currentColor;\n  outline-offset: 2px;\n}\n@media (prefers-reduced-motion: no-preference) {\n  .artists .section-title {\n    transition: color 0.2s ease, background-color 0.2s ease;\n  }\n}\n@media (max-width: 768px) {\n  .artists .section-title {\n    text-shadow: none;\n    font-feature-settings: normal;\n    font-variant: normal;\n    font-family:\n      system-ui,\n      -apple-system,\n      BlinkMacSystemFont,\n      "Segoe UI",\n      sans-serif;\n    text-rendering: optimizeSpeed;\n    -webkit-font-smoothing: antialiased;\n    -moz-osx-font-smoothing: grayscale;\n  }\n}\n.artists .section-title:after {\n  content: "";\n  position: absolute;\n  bottom: -15px;\n  left: 50%;\n  transform: translateX(-50%);\n  width: 80px;\n  height: 4px;\n  background:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      #ff5252);\n  border-radius: 2px;\n}\n.artists .artists-grid {\n  display: flex;\n  flex-wrap: wrap;\n  gap: 3rem;\n  justify-content: center;\n  align-items: flex-start;\n  max-width: 1200px;\n  margin: 0 auto;\n}\n.artists .artists-grid .artist-card {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.85) 0%,\n      rgba(15, 15, 15, 0.9) 50%,\n      rgba(25, 25, 25, 0.85) 100%);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  border-radius: 20px;\n  padding: 2rem;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);\n  transition: all 0.3s ease;\n  cursor: pointer;\n  width: 350px;\n  max-width: 100%;\n  position: relative;\n  overflow: hidden;\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}\n.artists .artists-grid .artist-card:hover {\n  transform: translateY(-10px);\n  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.4);\n}\n.artists .artists-grid .artist-card:hover .avatar-glow {\n  opacity: 1;\n  transform: scale(1.2);\n}\n.artists .artists-grid .artist-card:hover .social-button {\n  transform: translateY(-2px);\n}\n.artists .artists-grid .artist-card.main-artist {\n  width: 100%;\n  max-width: 600px;\n}\n.artists .artists-grid .artist-card.main-artist .artist-avatar .avatar-image {\n  width: 120px;\n  height: 120px;\n}\n.artists .artists-grid .artist-card.main-artist .artist-name {\n  font-size: 2.5rem;\n}\n.artists .artists-grid .artist-card.main-artist .social-buttons {\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n}\n.artists .artists-grid .artist-card::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 3px;\n  background:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      #ff5252);\n  opacity: 0;\n  transition: opacity 0.3s ease;\n}\n.artists .artists-grid .artist-card:hover::before {\n  opacity: 1;\n}\n.artist-avatar {\n  display: flex;\n  justify-content: center;\n  margin-bottom: 2rem;\n  position: relative;\n}\n.artist-avatar .avatar-container {\n  position: relative;\n  z-index: 2;\n}\n.artist-avatar .avatar-image {\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 3px solid #ff7f50;\n  box-shadow: 0 4px 20px rgba(255, 127, 80, 0.3);\n  transition: transform 0.3s ease, box-shadow 0.3s ease;\n}\n.artist-avatar .avatar-glow {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  width: 120px;\n  height: 120px;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 127, 80, 0.3) 0%,\n      transparent 70%);\n  border-radius: 50%;\n  opacity: 0;\n  transition: all 0.5s ease;\n  z-index: 1;\n}\n.artist-avatar .avatar-fallback {\n  position: relative;\n}\n.artist-avatar .avatar-fallback::before {\n  content: "\\1f464";\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  font-size: 3rem;\n  color: rgba(255, 255, 255, 0.7);\n  background:\n    linear-gradient(\n      135deg,\n      #ff7f50,\n      rgba(255, 127, 80, 0.7));\n  width: 100px;\n  height: 100px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border: 3px solid #ff7f50;\n  box-shadow: 0 4px 20px rgba(255, 127, 80, 0.3);\n}\n.artist-info {\n  text-align: center;\n  margin-bottom: 2rem;\n}\n.artist-info .artist-name {\n  margin-bottom: 0.5rem;\n  color: #fff;\n}\n.artist-info .artist-role {\n  color: #ff7f50;\n  margin-bottom: 1rem;\n  font-weight: 500;\n  opacity: 0.95;\n}\n.artist-info .artist-description {\n  color: rgba(255, 255, 255, 0.7);\n}\n.social-links .links-title {\n  text-align: center;\n  font-size: 1.2rem;\n  margin-bottom: 1.5rem;\n  color: #fff;\n  font-weight: 600;\n}\n.social-links .social-buttons {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));\n  gap: 1rem;\n}\n.social-links .social-buttons .social-button {\n  background: rgba(255, 255, 255, 0.05);\n  border: 2px solid rgba(255, 255, 255, 0.1);\n  border-radius: 12px;\n  padding: 1rem 0.75rem;\n  color: #fff;\n  cursor: pointer;\n  transition: all 0.3s ease;\n  position: relative;\n  overflow: hidden;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  gap: 0.5rem;\n  min-height: 80px;\n}\n.social-links .social-buttons .social-button::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255, 255, 255, 0.1),\n      transparent);\n  transition: left 0.5s ease;\n}\n.social-links .social-buttons .social-button:hover::before {\n  left: 100%;\n}\n.social-links .social-buttons .social-button:hover {\n  border-color: rgba(255, 255, 255, 0.4);\n  background: rgba(255, 255, 255, 0.1);\n  transform: translateY(-3px);\n  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);\n}\n.social-links .social-buttons .social-button:hover .social-icon {\n  transform: scale(1.2);\n}\n.social-links .social-buttons .social-button:hover .social-arrow {\n  transform: translateX(3px);\n}\n.social-links .social-buttons .social-button.coming-soon {\n  opacity: 0.6;\n  cursor: not-allowed;\n}\n.social-links .social-buttons .social-button.coming-soon:hover {\n  transform: none;\n  border-color: rgba(255, 255, 255, 0.2);\n  background: rgba(255, 255, 255, 0.05);\n}\n.social-links .social-buttons .social-button .social-icon {\n  font-size: 1.5rem;\n  transition: transform 0.3s ease;\n}\n.social-links .social-buttons .social-button .social-platform {\n  font-size: 0.85rem;\n  font-weight: 600;\n  text-align: center;\n}\n.social-links .social-buttons .social-button .social-arrow {\n  font-size: 0.9rem;\n  transition: transform 0.3s ease;\n  color: rgba(255, 255, 255, 0.8);\n}\n.social-links .social-buttons .social-button .coming-soon-text {\n  font-size: 0.75rem;\n  opacity: 0.7;\n  color: rgba(255, 255, 255, 0.5);\n}\n.community {\n  padding: 4rem 2rem;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.85) 0%,\n      rgba(15, 15, 15, 0.9) 50%,\n      rgba(25, 25, 25, 0.85) 100%);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  margin: 4rem 0;\n  width: 100vw;\n  margin-left: calc(-50vw + 50%);\n  margin-right: calc(-50vw + 50%);\n  border-radius: 8px;\n  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);\n  border: 1px solid rgba(255, 255, 255, 0.1);\n}\n.community .community-content {\n  max-width: 800px;\n  margin: 0 auto;\n  text-align: center;\n}\n.community .community-content .section-title {\n  font-size: 2.5rem;\n  margin-bottom: 2rem;\n  color: #fff;\n}\n.community .community-content .community-text {\n  font-size: 1.1rem;\n  line-height: 1.8;\n  margin-bottom: 3rem;\n  color: rgba(255, 255, 255, 0.8);\n}\n.community .community-content .community-stats {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));\n  gap: 2rem;\n}\n.community .community-content .community-stats .stat .stat-number {\n  display: block;\n  font-size: 2.5rem;\n  font-weight: 800;\n  color: #ff7f50;\n  margin-bottom: 0.5rem;\n}\n.community .community-content .community-stats .stat .stat-label {\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.7);\n  text-transform: uppercase;\n  letter-spacing: 1px;\n}\n@keyframes diagonalSlideA {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 42px 42px, 38px 38px;\n  }\n}\n@keyframes diagonalPulseB {\n  0%, 100% {\n    opacity: 1;\n  }\n  25% {\n    opacity: 0.7;\n  }\n  50% {\n    opacity: 0.9;\n  }\n  75% {\n    opacity: 0.6;\n  }\n}\n@keyframes diagonalSweepC {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 84px 84px, 76px 76px;\n  }\n}\n@keyframes diagonalDriftD {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    background-position: 30px 30px, 25px 25px;\n  }\n  75% {\n    background-position: 45px 45px, 38px 38px;\n  }\n  100% {\n    background-position: 60px 60px, 50px 50px;\n  }\n}\n@keyframes diagonalBreatheE {\n  0%, 100% {\n    filter: opacity(1) saturate(1);\n  }\n  50% {\n    filter: opacity(0.4) saturate(1.3);\n  }\n}\n@keyframes diagonalColorShiftF {\n  0%, 100% {\n    filter: hue-rotate(0deg);\n  }\n  33% {\n    filter: hue-rotate(30deg);\n  }\n  66% {\n    filter: hue-rotate(-20deg);\n  }\n}\n@keyframes diagonalMultiLayerG {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 21px 21px, -19px -19px;\n  }\n  50% {\n    background-position: 42px 42px, -38px -38px;\n  }\n  75% {\n    background-position: 63px 63px, -57px -57px;\n  }\n  100% {\n    background-position: 84px 84px, -76px -76px;\n  }\n}\n@keyframes diagonalShimmerH {\n  0%, 100% {\n    filter: brightness(1) contrast(1);\n  }\n  25% {\n    filter: brightness(1.4) contrast(1.2);\n  }\n  50% {\n    filter: brightness(0.8) contrast(1.1);\n  }\n  75% {\n    filter: brightness(1.6) contrast(1.3);\n  }\n}\n@keyframes diagonalGlitchI {\n  0%, 85%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  10% {\n    background-position: 5px 5px, -3px -3px;\n  }\n  15% {\n    background-position: -8px -8px, 6px 6px;\n  }\n  20% {\n    background-position: 12px 12px, -10px -10px;\n  }\n  25% {\n    background-position: -5px -5px, 8px 8px;\n  }\n}\n@keyframes diagonalWaveJ {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 30px 15px, -20px -10px;\n  }\n  50% {\n    background-position: 10px 40px, -15px -25px;\n  }\n  75% {\n    background-position: -20px 25px, 25px -15px;\n  }\n  100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n}\n@keyframes diagonalFadeK {\n  0%, 100% {\n    filter: opacity(1);\n  }\n  20% {\n    filter: opacity(0.2);\n  }\n  40% {\n    filter: opacity(0.8);\n  }\n  60% {\n    filter: opacity(0.1);\n  }\n  80% {\n    filter: opacity(0.6);\n  }\n}\n@keyframes diagonalBounceL {\n  0%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    background-position: -10px -10px, -8px -8px;\n  }\n  75% {\n    background-position: 20px 20px, 16px 16px;\n  }\n}\n@keyframes diagonalContinuousM {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  100% {\n    background-position: 220px 220px, 200px 200px;\n  }\n}\n@keyframes diagonalSpiralN {\n  0% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 30px 15px, 25px 12px;\n  }\n  50% {\n    background-position: 15px 30px, 12px 25px;\n  }\n  75% {\n    background-position: -15px 15px, -12px 12px;\n  }\n  100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n}\n@keyframes diagonalZoomPulseO {\n  0%, 100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n  50% {\n    transform: scale(1.02);\n    opacity: 0.9;\n  }\n}\n@keyframes diagonalBlurWavesP {\n  0%, 100% {\n    filter: blur(0px);\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    filter: blur(1px);\n    background-position: 15px 15px, 12px 12px;\n  }\n  50% {\n    filter: blur(2px);\n    background-position: 30px 30px, 25px 25px;\n  }\n  75% {\n    filter: blur(1px);\n    background-position: 15px 15px, 12px 12px;\n  }\n}\n@keyframes diagonalOpacityWavesQ {\n  0%, 100% {\n    filter: opacity(1);\n  }\n  16% {\n    filter: opacity(0.3);\n  }\n  32% {\n    filter: opacity(0.7);\n  }\n  48% {\n    filter: opacity(0.2);\n  }\n  64% {\n    filter: opacity(0.9);\n  }\n  80% {\n    filter: opacity(0.4);\n  }\n}\n@keyframes diagonalPositionOscillationR {\n  0%, 100% {\n    background-position: 0px 0px, 0px 0px;\n  }\n  25% {\n    background-position: 8px 12px, 6px 10px;\n  }\n  50% {\n    background-position: -12px 8px, -10px 6px;\n  }\n  75% {\n    background-position: 15px -10px, 12px -8px;\n  }\n}\n@keyframes diagonalTemperatureShiftS {\n  0%, 100% {\n    filter: hue-rotate(0deg) brightness(1);\n  }\n  33% {\n    filter: hue-rotate(45deg) brightness(1.2);\n  }\n  66% {\n    filter: hue-rotate(-30deg) brightness(0.8);\n  }\n}\n@keyframes diagonalMorphingPatternT {\n  0%, 100% {\n    background-position: 0px 0px, 0px 0px;\n    filter: brightness(1);\n  }\n  25% {\n    background-position: 20px 10px, 18px 8px;\n    filter: brightness(1.1);\n  }\n  50% {\n    background-position: 40px 20px, 35px 18px;\n    filter: brightness(0.9);\n  }\n  75% {\n    background-position: 20px 30px, 18px 25px;\n    filter: brightness(1.05);\n  }\n}\n@keyframes subtleFloat {\n  0% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n  33% {\n    background-position:\n      30px 20px,\n      20px 40px,\n      40px 10px;\n  }\n  66% {\n    background-position:\n      20px 40px,\n      40px 20px,\n      10px 30px;\n  }\n  100% {\n    background-position:\n      0px 0px,\n      0px 0px,\n      0px 0px;\n  }\n}\n@keyframes titleGlow {\n  0% {\n    filter: brightness(1) saturate(1);\n    text-shadow: 0 0 10px rgba(255, 127, 80, 0.3);\n  }\n  100% {\n    filter: brightness(1.1) saturate(1.2);\n    text-shadow: 0 0 20px rgba(255, 127, 80, 0.6);\n  }\n}\n@keyframes borderGlow {\n  0%, 100% {\n    background-position: 0% 50%;\n  }\n  50% {\n    background-position: 100% 50%;\n  }\n}\n@keyframes artistCardFloat {\n  0% {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  100% {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@keyframes socialButtonPop {\n  0% {\n    transform: scale(0.8);\n    opacity: 0;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 1;\n  }\n}\n@keyframes avatarPulse {\n  0% {\n    transform: scale(1);\n    box-shadow: 0 4px 20px rgba(255, 127, 80, 0.3);\n  }\n  50% {\n    transform: scale(1.05);\n    box-shadow: 0 8px 30px rgba(255, 127, 80, 0.5);\n  }\n  100% {\n    transform: scale(1);\n    box-shadow: 0 4px 20px rgba(255, 127, 80, 0.3);\n  }\n}\n.artist-card {\n  animation: artistCardFloat 0.6s ease-out;\n  animation-fill-mode: both;\n}\n.artist-card:nth-child(1) {\n  animation-delay: 0.15s;\n}\n.artist-card:nth-child(2) {\n  animation-delay: 0.3s;\n}\n.artist-card:nth-child(3) {\n  animation-delay: 0.45s;\n}\n.artist-card:nth-child(4) {\n  animation-delay: 0.6s;\n}\n.artist-card:nth-child(5) {\n  animation-delay: 0.75s;\n}\n.artist-card:hover .avatar-image {\n  transform: scale(1.05);\n  box-shadow: 0 6px 25px rgba(255, 127, 80, 0.4);\n}\n.social-button {\n  animation: socialButtonPop 0.4s ease-out;\n  animation-fill-mode: both;\n}\n.social-button:nth-child(1) {\n  animation-delay: 0.68s;\n}\n.social-button:nth-child(2) {\n  animation-delay: 0.76s;\n}\n.social-button:nth-child(3) {\n  animation-delay: 0.84s;\n}\n.social-button:nth-child(4) {\n  animation-delay: 0.92s;\n}\n.social-button:nth-child(5) {\n  animation-delay: 1s;\n}\n.social-button:nth-child(6) {\n  animation-delay: 1.08s;\n}\n.social-button:nth-child(7) {\n  animation-delay: 1.16s;\n}\n.social-button:nth-child(8) {\n  animation-delay: 1.24s;\n}\n.social-button:hover::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background:\n    radial-gradient(\n      circle,\n      rgba(255, 255, 255, 0.1) 0%,\n      transparent 70%);\n  border-radius: 12px;\n  animation: ripple 0.6s ease-out;\n}\n@keyframes ripple {\n  0% {\n    transform: scale(0);\n    opacity: 1;\n  }\n  100% {\n    transform: scale(1);\n    opacity: 0;\n  }\n}\n.community-stats .stat:hover .stat-number {\n  animation: numberBounce 0.5s ease-in-out;\n}\n@keyframes numberBounce {\n  0%, 100% {\n    transform: scale(1);\n  }\n  50% {\n    transform: scale(1.1);\n  }\n}\n.social-button[data-platform=spotify]:hover {\n  border-color: #1DB954;\n  box-shadow: 0 0 20px rgba(29, 185, 84, 0.3);\n}\n.social-button[data-platform=soundcloud]:hover {\n  border-color: #FF5500;\n  box-shadow: 0 0 20px rgba(255, 85, 0, 0.3);\n}\n.social-button[data-platform=youtube]:hover {\n  border-color: #FF0000;\n  box-shadow: 0 0 20px rgba(255, 0, 0, 0.3);\n}\n.social-button[data-platform=github]:hover {\n  border-color: #333333;\n  box-shadow: 0 0 20px rgba(51, 51, 51, 0.3);\n}\n.social-button[data-platform=discord]:hover {\n  border-color: #5865F2;\n  box-shadow: 0 0 20px rgba(88, 101, 242, 0.3);\n}\n@media (prefers-reduced-motion: reduce) {\n  .social-links-page::before,\n  .social-links-page::after {\n    animation: none !important;\n  }\n  .social-links-page.anim-a::before,\n  .social-links-page.anim-b::before,\n  .social-links-page.anim-c::before,\n  .social-links-page.anim-d::before,\n  .social-links-page.anim-e::before,\n  .social-links-page.anim-f::before,\n  .social-links-page.anim-g::before,\n  .social-links-page.anim-h::before,\n  .social-links-page.anim-i::before,\n  .social-links-page.anim-j::before,\n  .social-links-page.anim-k::before,\n  .social-links-page.anim-l::before,\n  .social-links-page.anim-m::before,\n  .social-links-page.anim-n::before,\n  .social-links-page.anim-o::before,\n  .social-links-page.anim-p::before,\n  .social-links-page.anim-q::before,\n  .social-links-page.anim-r::before,\n  .social-links-page.anim-s::before,\n  .social-links-page.anim-t::before {\n    animation: none !important;\n  }\n  .hero .hero-content .title {\n    animation: none !important;\n  }\n  .artist-card,\n  .social-button {\n    animation: none !important;\n  }\n}\n@media (max-width: 768px) {\n  .social-links-page {\n  }\n  .social-main {\n    padding-bottom: clamp(12rem, 20vh, 18rem);\n  }\n  .hero {\n    padding: 2rem 0;\n  }\n  .hero .hero-content {\n    padding: 2rem 1.5rem;\n    border-radius: 20px;\n  }\n  .hero .hero-content .title {\n    font-size: 2.5rem;\n  }\n  .hero .hero-content .subtitle {\n    font-size: 1.2rem;\n  }\n  .artists .section-title {\n    font-size: 2rem;\n  }\n  .artists .artists-grid {\n    gap: 2rem;\n  }\n  .artists .artists-grid .artist-card {\n    width: 100%;\n  }\n  .artists .artists-grid .artist-card.main-artist .artist-name {\n    font-size: 2rem;\n  }\n  .social-links .social-buttons {\n    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));\n    gap: 0.75rem;\n  }\n  .social-links .social-buttons .social-button {\n    padding: 0.75rem 0.5rem;\n    min-height: 70px;\n  }\n  .social-links .social-buttons .social-button .social-icon {\n    font-size: 1.3rem;\n  }\n  .social-links .social-buttons .social-button .social-platform {\n    font-size: 0.8rem;\n  }\n  .community {\n    padding: 3rem 1rem;\n  }\n  .community .community-content .section-title {\n    font-size: 2rem;\n  }\n  .community .community-content .community-stats {\n    gap: 1.5rem;\n  }\n  .community .community-content .community-stats .stat .stat-number {\n    font-size: 2rem;\n  }\n}\n@media (max-width: 480px) {\n  .social-links-page {\n  }\n  .social-main {\n    padding: 0 1rem;\n    padding-top: 2rem;\n    padding-bottom: clamp(16rem, 25vh, 22rem);\n  }\n  .hero .hero-content {\n    padding: 1.5rem 1rem;\n    border-radius: 16px;\n  }\n  .hero .hero-content .title {\n    font-size: 2rem;\n  }\n  .hero .hero-content .subtitle {\n    font-size: 1.1rem;\n  }\n  .hero .hero-content .description {\n    font-size: 1rem;\n  }\n  .artists .artists-grid .artist-card {\n    padding: 1.5rem;\n  }\n}\n/*# sourceMappingURL=social-links.css.map */\n'] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SocialLinksComponent, { className: "SocialLinksComponent", filePath: "src/app/pages/social-links/social-links.ts", lineNumber: 20 });
})();
export {
  SocialLinksComponent
};
//# sourceMappingURL=chunk-GT4W5NMH.js.map
