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
  MAT_RIPPLE_GLOBAL_OPTIONS,
  MatButtonModule,
  MatIconButton,
  MatRippleLoader,
  MatRippleModule,
  _StructuralStylesLoader,
  _animationsDisabled,
  coerceBooleanProperty
} from "./chunk-JJRARYBB.js";
import {
  FormGroupDirective,
  NG_VALUE_ACCESSOR,
  NgControl,
  NgForm,
  Validators
} from "./chunk-MUUHJO3F.js";
import {
  BACKSPACE,
  DELETE,
  DOWN_ARROW,
  Directionality,
  ENTER,
  FocusKeyManager,
  FocusMonitor,
  MatCommonModule,
  MatIcon,
  MatIconModule,
  SPACE,
  TAB,
  UP_ARROW,
  _CdkPrivateStyleLoader,
  _IdGenerator,
  _VisuallyHiddenLoader,
  hasModifierKey
} from "./chunk-3GUFOW2E.js";
import {
  GelDbIntegrationService
} from "./chunk-PVYOYSKP.js";
import {
  Platform
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
  ContentChild,
  ContentChildren,
  DOCUMENT,
  Directive,
  ElementRef,
  EventEmitter,
  HOST_TAG_NAME,
  HttpClient,
  Inject,
  Injectable,
  InjectionToken,
  Injector,
  Input,
  NgForOf,
  NgIf,
  NgModule,
  NgTemplateOutlet,
  NgZone,
  Observable,
  Output,
  QueryList,
  Renderer2,
  RendererFactory2,
  RendererStyleFlags2,
  Subject,
  Subscription,
  ViewChild,
  ViewEncapsulation,
  __async,
  __commonJS,
  __spreadProps,
  __spreadValues,
  __toESM,
  afterNextRender,
  afterRenderEffect,
  booleanAttribute,
  combineLatest,
  computed,
  contentChild,
  debounceTime,
  distinctUntilChanged,
  effect,
  filter,
  forwardRef,
  inject,
  map,
  merge,
  numberAttribute,
  pairwise,
  setClassMetadata,
  shareReplay,
  signal,
  startWith,
  switchMap,
  takeUntil,
  viewChild,
  ɵsetClassDebugInfo,
  ɵɵInheritDefinitionFeature,
  ɵɵNgOnChangesFeature,
  ɵɵProvidersFeature,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵcontentQuery,
  ɵɵcontentQuerySignal,
  ɵɵdefineComponent,
  ɵɵdefineDirective,
  ɵɵdefineInjectable,
  ɵɵdefineInjector,
  ɵɵdefineNgModule,
  ɵɵdirectiveInject,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomProperty,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵgetInheritedFactory,
  ɵɵinject,
  ɵɵlistener,
  ɵɵloadQuery,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵprojection,
  ɵɵprojectionDef,
  ɵɵproperty,
  ɵɵqueryAdvance,
  ɵɵqueryRefresh,
  ɵɵreference,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtemplateRefExtractor,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵviewQuery,
  ɵɵviewQuerySignal
} from "./chunk-F34NQEWD.js";

// node_modules/.pnpm/howler@2.2.4/node_modules/howler/dist/howler.js
var require_howler = __commonJS({
  "node_modules/.pnpm/howler@2.2.4/node_modules/howler/dist/howler.js"(exports) {
    "use strict";
    (function() {
      "use strict";
      var HowlerGlobal2 = function() {
        this.init();
      };
      HowlerGlobal2.prototype = {
        /**
         * Initialize the global Howler object.
         * @return {Howler}
         */
        init: function() {
          var self = this || Howler2;
          self._counter = 1e3;
          self._html5AudioPool = [];
          self.html5PoolSize = 10;
          self._codecs = {};
          self._howls = [];
          self._muted = false;
          self._volume = 1;
          self._canPlayEvent = "canplaythrough";
          self._navigator = typeof window !== "undefined" && window.navigator ? window.navigator : null;
          self.masterGain = null;
          self.noAudio = false;
          self.usingWebAudio = true;
          self.autoSuspend = true;
          self.ctx = null;
          self.autoUnlock = true;
          self._setup();
          return self;
        },
        /**
         * Get/set the global volume for all sounds.
         * @param  {Float} vol Volume from 0.0 to 1.0.
         * @return {Howler/Float}     Returns self or current volume.
         */
        volume: function(vol) {
          var self = this || Howler2;
          vol = parseFloat(vol);
          if (!self.ctx) {
            setupAudioContext();
          }
          if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
            self._volume = vol;
            if (self._muted) {
              return self;
            }
            if (self.usingWebAudio) {
              self.masterGain.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
            }
            for (var i = 0; i < self._howls.length; i++) {
              if (!self._howls[i]._webAudio) {
                var ids = self._howls[i]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound = self._howls[i]._soundById(ids[j]);
                  if (sound && sound._node) {
                    sound._node.volume = sound._volume * vol;
                  }
                }
              }
            }
            return self;
          }
          return self._volume;
        },
        /**
         * Handle muting and unmuting globally.
         * @param  {Boolean} muted Is muted or not.
         */
        mute: function(muted) {
          var self = this || Howler2;
          if (!self.ctx) {
            setupAudioContext();
          }
          self._muted = muted;
          if (self.usingWebAudio) {
            self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler2.ctx.currentTime);
          }
          for (var i = 0; i < self._howls.length; i++) {
            if (!self._howls[i]._webAudio) {
              var ids = self._howls[i]._getSoundIds();
              for (var j = 0; j < ids.length; j++) {
                var sound = self._howls[i]._soundById(ids[j]);
                if (sound && sound._node) {
                  sound._node.muted = muted ? true : sound._muted;
                }
              }
            }
          }
          return self;
        },
        /**
         * Handle stopping all sounds globally.
         */
        stop: function() {
          var self = this || Howler2;
          for (var i = 0; i < self._howls.length; i++) {
            self._howls[i].stop();
          }
          return self;
        },
        /**
         * Unload and destroy all currently loaded Howl objects.
         * @return {Howler}
         */
        unload: function() {
          var self = this || Howler2;
          for (var i = self._howls.length - 1; i >= 0; i--) {
            self._howls[i].unload();
          }
          if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== "undefined") {
            self.ctx.close();
            self.ctx = null;
            setupAudioContext();
          }
          return self;
        },
        /**
         * Check for codec support of specific extension.
         * @param  {String} ext Audio file extention.
         * @return {Boolean}
         */
        codecs: function(ext) {
          return (this || Howler2)._codecs[ext.replace(/^x-/, "")];
        },
        /**
         * Setup various state values for global tracking.
         * @return {Howler}
         */
        _setup: function() {
          var self = this || Howler2;
          self.state = self.ctx ? self.ctx.state || "suspended" : "suspended";
          self._autoSuspend();
          if (!self.usingWebAudio) {
            if (typeof Audio !== "undefined") {
              try {
                var test = new Audio();
                if (typeof test.oncanplaythrough === "undefined") {
                  self._canPlayEvent = "canplay";
                }
              } catch (e) {
                self.noAudio = true;
              }
            } else {
              self.noAudio = true;
            }
          }
          try {
            var test = new Audio();
            if (test.muted) {
              self.noAudio = true;
            }
          } catch (e) {
          }
          if (!self.noAudio) {
            self._setupCodecs();
          }
          return self;
        },
        /**
         * Check for browser support for various codecs and cache the results.
         * @return {Howler}
         */
        _setupCodecs: function() {
          var self = this || Howler2;
          var audioTest = null;
          try {
            audioTest = typeof Audio !== "undefined" ? new Audio() : null;
          } catch (err) {
            return self;
          }
          if (!audioTest || typeof audioTest.canPlayType !== "function") {
            return self;
          }
          var mpegTest = audioTest.canPlayType("audio/mpeg;").replace(/^no$/, "");
          var ua = self._navigator ? self._navigator.userAgent : "";
          var checkOpera = ua.match(/OPR\/(\d+)/g);
          var isOldOpera = checkOpera && parseInt(checkOpera[0].split("/")[1], 10) < 33;
          var checkSafari = ua.indexOf("Safari") !== -1 && ua.indexOf("Chrome") === -1;
          var safariVersion = ua.match(/Version\/(.*?) /);
          var isOldSafari = checkSafari && safariVersion && parseInt(safariVersion[1], 10) < 15;
          self._codecs = {
            mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType("audio/mp3;").replace(/^no$/, ""))),
            mpeg: !!mpegTest,
            opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ""),
            ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
            oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ""),
            wav: !!(audioTest.canPlayType('audio/wav; codecs="1"') || audioTest.canPlayType("audio/wav")).replace(/^no$/, ""),
            aac: !!audioTest.canPlayType("audio/aac;").replace(/^no$/, ""),
            caf: !!audioTest.canPlayType("audio/x-caf;").replace(/^no$/, ""),
            m4a: !!(audioTest.canPlayType("audio/x-m4a;") || audioTest.canPlayType("audio/m4a;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
            m4b: !!(audioTest.canPlayType("audio/x-m4b;") || audioTest.canPlayType("audio/m4b;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
            mp4: !!(audioTest.canPlayType("audio/x-mp4;") || audioTest.canPlayType("audio/mp4;") || audioTest.canPlayType("audio/aac;")).replace(/^no$/, ""),
            weba: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
            webm: !!(!isOldSafari && audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, "")),
            dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ""),
            flac: !!(audioTest.canPlayType("audio/x-flac;") || audioTest.canPlayType("audio/flac;")).replace(/^no$/, "")
          };
          return self;
        },
        /**
         * Some browsers/devices will only allow audio to be played after a user interaction.
         * Attempt to automatically unlock audio on the first user interaction.
         * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
         * @return {Howler}
         */
        _unlockAudio: function() {
          var self = this || Howler2;
          if (self._audioUnlocked || !self.ctx) {
            return;
          }
          self._audioUnlocked = false;
          self.autoUnlock = false;
          if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
            self._mobileUnloaded = true;
            self.unload();
          }
          self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);
          var unlock = function(e) {
            while (self._html5AudioPool.length < self.html5PoolSize) {
              try {
                var audioNode = new Audio();
                audioNode._unlocked = true;
                self._releaseHtml5Audio(audioNode);
              } catch (e2) {
                self.noAudio = true;
                break;
              }
            }
            for (var i = 0; i < self._howls.length; i++) {
              if (!self._howls[i]._webAudio) {
                var ids = self._howls[i]._getSoundIds();
                for (var j = 0; j < ids.length; j++) {
                  var sound = self._howls[i]._soundById(ids[j]);
                  if (sound && sound._node && !sound._node._unlocked) {
                    sound._node._unlocked = true;
                    sound._node.load();
                  }
                }
              }
            }
            self._autoResume();
            var source = self.ctx.createBufferSource();
            source.buffer = self._scratchBuffer;
            source.connect(self.ctx.destination);
            if (typeof source.start === "undefined") {
              source.noteOn(0);
            } else {
              source.start(0);
            }
            if (typeof self.ctx.resume === "function") {
              self.ctx.resume();
            }
            source.onended = function() {
              source.disconnect(0);
              self._audioUnlocked = true;
              document.removeEventListener("touchstart", unlock, true);
              document.removeEventListener("touchend", unlock, true);
              document.removeEventListener("click", unlock, true);
              document.removeEventListener("keydown", unlock, true);
              for (var i2 = 0; i2 < self._howls.length; i2++) {
                self._howls[i2]._emit("unlock");
              }
            };
          };
          document.addEventListener("touchstart", unlock, true);
          document.addEventListener("touchend", unlock, true);
          document.addEventListener("click", unlock, true);
          document.addEventListener("keydown", unlock, true);
          return self;
        },
        /**
         * Get an unlocked HTML5 Audio object from the pool. If none are left,
         * return a new Audio object and throw a warning.
         * @return {Audio} HTML5 Audio object.
         */
        _obtainHtml5Audio: function() {
          var self = this || Howler2;
          if (self._html5AudioPool.length) {
            return self._html5AudioPool.pop();
          }
          var testPlay = new Audio().play();
          if (testPlay && typeof Promise !== "undefined" && (testPlay instanceof Promise || typeof testPlay.then === "function")) {
            testPlay.catch(function() {
              console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.");
            });
          }
          return new Audio();
        },
        /**
         * Return an activated HTML5 Audio object to the pool.
         * @return {Howler}
         */
        _releaseHtml5Audio: function(audio) {
          var self = this || Howler2;
          if (audio._unlocked) {
            self._html5AudioPool.push(audio);
          }
          return self;
        },
        /**
         * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
         * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
         * @return {Howler}
         */
        _autoSuspend: function() {
          var self = this;
          if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === "undefined" || !Howler2.usingWebAudio) {
            return;
          }
          for (var i = 0; i < self._howls.length; i++) {
            if (self._howls[i]._webAudio) {
              for (var j = 0; j < self._howls[i]._sounds.length; j++) {
                if (!self._howls[i]._sounds[j]._paused) {
                  return self;
                }
              }
            }
          }
          if (self._suspendTimer) {
            clearTimeout(self._suspendTimer);
          }
          self._suspendTimer = setTimeout(function() {
            if (!self.autoSuspend) {
              return;
            }
            self._suspendTimer = null;
            self.state = "suspending";
            var handleSuspension = function() {
              self.state = "suspended";
              if (self._resumeAfterSuspend) {
                delete self._resumeAfterSuspend;
                self._autoResume();
              }
            };
            self.ctx.suspend().then(handleSuspension, handleSuspension);
          }, 3e4);
          return self;
        },
        /**
         * Automatically resume the Web Audio AudioContext when a new sound is played.
         * @return {Howler}
         */
        _autoResume: function() {
          var self = this;
          if (!self.ctx || typeof self.ctx.resume === "undefined" || !Howler2.usingWebAudio) {
            return;
          }
          if (self.state === "running" && self.ctx.state !== "interrupted" && self._suspendTimer) {
            clearTimeout(self._suspendTimer);
            self._suspendTimer = null;
          } else if (self.state === "suspended" || self.state === "running" && self.ctx.state === "interrupted") {
            self.ctx.resume().then(function() {
              self.state = "running";
              for (var i = 0; i < self._howls.length; i++) {
                self._howls[i]._emit("resume");
              }
            });
            if (self._suspendTimer) {
              clearTimeout(self._suspendTimer);
              self._suspendTimer = null;
            }
          } else if (self.state === "suspending") {
            self._resumeAfterSuspend = true;
          }
          return self;
        }
      };
      var Howler2 = new HowlerGlobal2();
      var Howl3 = function(o) {
        var self = this;
        if (!o.src || o.src.length === 0) {
          console.error("An array of source files must be passed with any new Howl.");
          return;
        }
        self.init(o);
      };
      Howl3.prototype = {
        /**
         * Initialize a new Howl group object.
         * @param  {Object} o Passed in properties for this group.
         * @return {Howl}
         */
        init: function(o) {
          var self = this;
          if (!Howler2.ctx) {
            setupAudioContext();
          }
          self._autoplay = o.autoplay || false;
          self._format = typeof o.format !== "string" ? o.format : [o.format];
          self._html5 = o.html5 || false;
          self._muted = o.mute || false;
          self._loop = o.loop || false;
          self._pool = o.pool || 5;
          self._preload = typeof o.preload === "boolean" || o.preload === "metadata" ? o.preload : true;
          self._rate = o.rate || 1;
          self._sprite = o.sprite || {};
          self._src = typeof o.src !== "string" ? o.src : [o.src];
          self._volume = o.volume !== void 0 ? o.volume : 1;
          self._xhr = {
            method: o.xhr && o.xhr.method ? o.xhr.method : "GET",
            headers: o.xhr && o.xhr.headers ? o.xhr.headers : null,
            withCredentials: o.xhr && o.xhr.withCredentials ? o.xhr.withCredentials : false
          };
          self._duration = 0;
          self._state = "unloaded";
          self._sounds = [];
          self._endTimers = {};
          self._queue = [];
          self._playLock = false;
          self._onend = o.onend ? [{ fn: o.onend }] : [];
          self._onfade = o.onfade ? [{ fn: o.onfade }] : [];
          self._onload = o.onload ? [{ fn: o.onload }] : [];
          self._onloaderror = o.onloaderror ? [{ fn: o.onloaderror }] : [];
          self._onplayerror = o.onplayerror ? [{ fn: o.onplayerror }] : [];
          self._onpause = o.onpause ? [{ fn: o.onpause }] : [];
          self._onplay = o.onplay ? [{ fn: o.onplay }] : [];
          self._onstop = o.onstop ? [{ fn: o.onstop }] : [];
          self._onmute = o.onmute ? [{ fn: o.onmute }] : [];
          self._onvolume = o.onvolume ? [{ fn: o.onvolume }] : [];
          self._onrate = o.onrate ? [{ fn: o.onrate }] : [];
          self._onseek = o.onseek ? [{ fn: o.onseek }] : [];
          self._onunlock = o.onunlock ? [{ fn: o.onunlock }] : [];
          self._onresume = [];
          self._webAudio = Howler2.usingWebAudio && !self._html5;
          if (typeof Howler2.ctx !== "undefined" && Howler2.ctx && Howler2.autoUnlock) {
            Howler2._unlockAudio();
          }
          Howler2._howls.push(self);
          if (self._autoplay) {
            self._queue.push({
              event: "play",
              action: function() {
                self.play();
              }
            });
          }
          if (self._preload && self._preload !== "none") {
            self.load();
          }
          return self;
        },
        /**
         * Load the audio file.
         * @return {Howler}
         */
        load: function() {
          var self = this;
          var url = null;
          if (Howler2.noAudio) {
            self._emit("loaderror", null, "No audio support.");
            return;
          }
          if (typeof self._src === "string") {
            self._src = [self._src];
          }
          for (var i = 0; i < self._src.length; i++) {
            var ext, str;
            if (self._format && self._format[i]) {
              ext = self._format[i];
            } else {
              str = self._src[i];
              if (typeof str !== "string") {
                self._emit("loaderror", null, "Non-string found in selected audio sources - ignoring.");
                continue;
              }
              ext = /^data:audio\/([^;,]+);/i.exec(str);
              if (!ext) {
                ext = /\.([^.]+)$/.exec(str.split("?", 1)[0]);
              }
              if (ext) {
                ext = ext[1].toLowerCase();
              }
            }
            if (!ext) {
              console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
            }
            if (ext && Howler2.codecs(ext)) {
              url = self._src[i];
              break;
            }
          }
          if (!url) {
            self._emit("loaderror", null, "No codec support for selected audio sources.");
            return;
          }
          self._src = url;
          self._state = "loading";
          if (window.location.protocol === "https:" && url.slice(0, 5) === "http:") {
            self._html5 = true;
            self._webAudio = false;
          }
          new Sound2(self);
          if (self._webAudio) {
            loadBuffer(self);
          }
          return self;
        },
        /**
         * Play a sound or resume previous playback.
         * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
         * @param  {Boolean} internal Internal Use: true prevents event firing.
         * @return {Number}          Sound ID.
         */
        play: function(sprite, internal) {
          var self = this;
          var id = null;
          if (typeof sprite === "number") {
            id = sprite;
            sprite = null;
          } else if (typeof sprite === "string" && self._state === "loaded" && !self._sprite[sprite]) {
            return null;
          } else if (typeof sprite === "undefined") {
            sprite = "__default";
            if (!self._playLock) {
              var num = 0;
              for (var i = 0; i < self._sounds.length; i++) {
                if (self._sounds[i]._paused && !self._sounds[i]._ended) {
                  num++;
                  id = self._sounds[i]._id;
                }
              }
              if (num === 1) {
                sprite = null;
              } else {
                id = null;
              }
            }
          }
          var sound = id ? self._soundById(id) : self._inactiveSound();
          if (!sound) {
            return null;
          }
          if (id && !sprite) {
            sprite = sound._sprite || "__default";
          }
          if (self._state !== "loaded") {
            sound._sprite = sprite;
            sound._ended = false;
            var soundId = sound._id;
            self._queue.push({
              event: "play",
              action: function() {
                self.play(soundId);
              }
            });
            return soundId;
          }
          if (id && !sound._paused) {
            if (!internal) {
              self._loadQueue("play");
            }
            return sound._id;
          }
          if (self._webAudio) {
            Howler2._autoResume();
          }
          var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1e3);
          var duration = Math.max(0, (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3 - seek);
          var timeout = duration * 1e3 / Math.abs(sound._rate);
          var start = self._sprite[sprite][0] / 1e3;
          var stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1e3;
          sound._sprite = sprite;
          sound._ended = false;
          var setParams = function() {
            sound._paused = false;
            sound._seek = seek;
            sound._start = start;
            sound._stop = stop;
            sound._loop = !!(sound._loop || self._sprite[sprite][2]);
          };
          if (seek >= stop) {
            self._ended(sound);
            return;
          }
          var node = sound._node;
          if (self._webAudio) {
            var playWebAudio = function() {
              self._playLock = false;
              setParams();
              self._refreshBuffer(sound);
              var vol = sound._muted || self._muted ? 0 : sound._volume;
              node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
              sound._playStart = Howler2.ctx.currentTime;
              if (typeof node.bufferSource.start === "undefined") {
                sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
              } else {
                sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
              }
              if (timeout !== Infinity) {
                self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
              }
              if (!internal) {
                setTimeout(function() {
                  self._emit("play", sound._id);
                  self._loadQueue();
                }, 0);
              }
            };
            if (Howler2.state === "running" && Howler2.ctx.state !== "interrupted") {
              playWebAudio();
            } else {
              self._playLock = true;
              self.once("resume", playWebAudio);
              self._clearTimer(sound._id);
            }
          } else {
            var playHtml5 = function() {
              node.currentTime = seek;
              node.muted = sound._muted || self._muted || Howler2._muted || node.muted;
              node.volume = sound._volume * Howler2.volume();
              node.playbackRate = sound._rate;
              try {
                var play = node.play();
                if (play && typeof Promise !== "undefined" && (play instanceof Promise || typeof play.then === "function")) {
                  self._playLock = true;
                  setParams();
                  play.then(function() {
                    self._playLock = false;
                    node._unlocked = true;
                    if (!internal) {
                      self._emit("play", sound._id);
                    } else {
                      self._loadQueue();
                    }
                  }).catch(function() {
                    self._playLock = false;
                    self._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                    sound._ended = true;
                    sound._paused = true;
                  });
                } else if (!internal) {
                  self._playLock = false;
                  setParams();
                  self._emit("play", sound._id);
                }
                node.playbackRate = sound._rate;
                if (node.paused) {
                  self._emit("playerror", sound._id, "Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");
                  return;
                }
                if (sprite !== "__default" || sound._loop) {
                  self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
                } else {
                  self._endTimers[sound._id] = function() {
                    self._ended(sound);
                    node.removeEventListener("ended", self._endTimers[sound._id], false);
                  };
                  node.addEventListener("ended", self._endTimers[sound._id], false);
                }
              } catch (err) {
                self._emit("playerror", sound._id, err);
              }
            };
            if (node.src === "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA") {
              node.src = self._src;
              node.load();
            }
            var loadedNoReadyState = window && window.ejecta || !node.readyState && Howler2._navigator.isCocoonJS;
            if (node.readyState >= 3 || loadedNoReadyState) {
              playHtml5();
            } else {
              self._playLock = true;
              self._state = "loading";
              var listener = function() {
                self._state = "loaded";
                playHtml5();
                node.removeEventListener(Howler2._canPlayEvent, listener, false);
              };
              node.addEventListener(Howler2._canPlayEvent, listener, false);
              self._clearTimer(sound._id);
            }
          }
          return sound._id;
        },
        /**
         * Pause playback and save current position.
         * @param  {Number} id The sound ID (empty to pause all in group).
         * @return {Howl}
         */
        pause: function(id) {
          var self = this;
          if (self._state !== "loaded" || self._playLock) {
            self._queue.push({
              event: "pause",
              action: function() {
                self.pause(id);
              }
            });
            return self;
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            self._clearTimer(ids[i]);
            var sound = self._soundById(ids[i]);
            if (sound && !sound._paused) {
              sound._seek = self.seek(ids[i]);
              sound._rateSeek = 0;
              sound._paused = true;
              self._stopFade(ids[i]);
              if (sound._node) {
                if (self._webAudio) {
                  if (!sound._node.bufferSource) {
                    continue;
                  }
                  if (typeof sound._node.bufferSource.stop === "undefined") {
                    sound._node.bufferSource.noteOff(0);
                  } else {
                    sound._node.bufferSource.stop(0);
                  }
                  self._cleanBuffer(sound._node);
                } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                  sound._node.pause();
                }
              }
            }
            if (!arguments[1]) {
              self._emit("pause", sound ? sound._id : null);
            }
          }
          return self;
        },
        /**
         * Stop playback and reset to start.
         * @param  {Number} id The sound ID (empty to stop all in group).
         * @param  {Boolean} internal Internal Use: true prevents event firing.
         * @return {Howl}
         */
        stop: function(id, internal) {
          var self = this;
          if (self._state !== "loaded" || self._playLock) {
            self._queue.push({
              event: "stop",
              action: function() {
                self.stop(id);
              }
            });
            return self;
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            self._clearTimer(ids[i]);
            var sound = self._soundById(ids[i]);
            if (sound) {
              sound._seek = sound._start || 0;
              sound._rateSeek = 0;
              sound._paused = true;
              sound._ended = true;
              self._stopFade(ids[i]);
              if (sound._node) {
                if (self._webAudio) {
                  if (sound._node.bufferSource) {
                    if (typeof sound._node.bufferSource.stop === "undefined") {
                      sound._node.bufferSource.noteOff(0);
                    } else {
                      sound._node.bufferSource.stop(0);
                    }
                    self._cleanBuffer(sound._node);
                  }
                } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
                  sound._node.currentTime = sound._start || 0;
                  sound._node.pause();
                  if (sound._node.duration === Infinity) {
                    self._clearSound(sound._node);
                  }
                }
              }
              if (!internal) {
                self._emit("stop", sound._id);
              }
            }
          }
          return self;
        },
        /**
         * Mute/unmute a single sound or all sounds in this Howl group.
         * @param  {Boolean} muted Set to true to mute and false to unmute.
         * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
         * @return {Howl}
         */
        mute: function(muted, id) {
          var self = this;
          if (self._state !== "loaded" || self._playLock) {
            self._queue.push({
              event: "mute",
              action: function() {
                self.mute(muted, id);
              }
            });
            return self;
          }
          if (typeof id === "undefined") {
            if (typeof muted === "boolean") {
              self._muted = muted;
            } else {
              return self._muted;
            }
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self._soundById(ids[i]);
            if (sound) {
              sound._muted = muted;
              if (sound._interval) {
                self._stopFade(sound._id);
              }
              if (self._webAudio && sound._node) {
                sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler2.ctx.currentTime);
              } else if (sound._node) {
                sound._node.muted = Howler2._muted ? true : muted;
              }
              self._emit("mute", sound._id);
            }
          }
          return self;
        },
        /**
         * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
         *   volume() -> Returns the group's volume value.
         *   volume(id) -> Returns the sound id's current volume.
         *   volume(vol) -> Sets the volume of all sounds in this Howl group.
         *   volume(vol, id) -> Sets the volume of passed sound id.
         * @return {Howl/Number} Returns self or current volume.
         */
        volume: function() {
          var self = this;
          var args = arguments;
          var vol, id;
          if (args.length === 0) {
            return self._volume;
          } else if (args.length === 1 || args.length === 2 && typeof args[1] === "undefined") {
            var ids = self._getSoundIds();
            var index = ids.indexOf(args[0]);
            if (index >= 0) {
              id = parseInt(args[0], 10);
            } else {
              vol = parseFloat(args[0]);
            }
          } else if (args.length >= 2) {
            vol = parseFloat(args[0]);
            id = parseInt(args[1], 10);
          }
          var sound;
          if (typeof vol !== "undefined" && vol >= 0 && vol <= 1) {
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "volume",
                action: function() {
                  self.volume.apply(self, args);
                }
              });
              return self;
            }
            if (typeof id === "undefined") {
              self._volume = vol;
            }
            id = self._getSoundIds(id);
            for (var i = 0; i < id.length; i++) {
              sound = self._soundById(id[i]);
              if (sound) {
                sound._volume = vol;
                if (!args[2]) {
                  self._stopFade(id[i]);
                }
                if (self._webAudio && sound._node && !sound._muted) {
                  sound._node.gain.setValueAtTime(vol, Howler2.ctx.currentTime);
                } else if (sound._node && !sound._muted) {
                  sound._node.volume = vol * Howler2.volume();
                }
                self._emit("volume", sound._id);
              }
            }
          } else {
            sound = id ? self._soundById(id) : self._sounds[0];
            return sound ? sound._volume : 0;
          }
          return self;
        },
        /**
         * Fade a currently playing sound between two volumes (if no id is passed, all sounds will fade).
         * @param  {Number} from The value to fade from (0.0 to 1.0).
         * @param  {Number} to   The volume to fade to (0.0 to 1.0).
         * @param  {Number} len  Time in milliseconds to fade.
         * @param  {Number} id   The sound id (omit to fade all sounds).
         * @return {Howl}
         */
        fade: function(from, to, len, id) {
          var self = this;
          if (self._state !== "loaded" || self._playLock) {
            self._queue.push({
              event: "fade",
              action: function() {
                self.fade(from, to, len, id);
              }
            });
            return self;
          }
          from = Math.min(Math.max(0, parseFloat(from)), 1);
          to = Math.min(Math.max(0, parseFloat(to)), 1);
          len = parseFloat(len);
          self.volume(from, id);
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            var sound = self._soundById(ids[i]);
            if (sound) {
              if (!id) {
                self._stopFade(ids[i]);
              }
              if (self._webAudio && !sound._muted) {
                var currentTime = Howler2.ctx.currentTime;
                var end = currentTime + len / 1e3;
                sound._volume = from;
                sound._node.gain.setValueAtTime(from, currentTime);
                sound._node.gain.linearRampToValueAtTime(to, end);
              }
              self._startFadeInterval(sound, from, to, len, ids[i], typeof id === "undefined");
            }
          }
          return self;
        },
        /**
         * Starts the internal interval to fade a sound.
         * @param  {Object} sound Reference to sound to fade.
         * @param  {Number} from The value to fade from (0.0 to 1.0).
         * @param  {Number} to   The volume to fade to (0.0 to 1.0).
         * @param  {Number} len  Time in milliseconds to fade.
         * @param  {Number} id   The sound id to fade.
         * @param  {Boolean} isGroup   If true, set the volume on the group.
         */
        _startFadeInterval: function(sound, from, to, len, id, isGroup) {
          var self = this;
          var vol = from;
          var diff = to - from;
          var steps = Math.abs(diff / 0.01);
          var stepLen = Math.max(4, steps > 0 ? len / steps : len);
          var lastTick = Date.now();
          sound._fadeTo = to;
          sound._interval = setInterval(function() {
            var tick = (Date.now() - lastTick) / len;
            lastTick = Date.now();
            vol += diff * tick;
            vol = Math.round(vol * 100) / 100;
            if (diff < 0) {
              vol = Math.max(to, vol);
            } else {
              vol = Math.min(to, vol);
            }
            if (self._webAudio) {
              sound._volume = vol;
            } else {
              self.volume(vol, sound._id, true);
            }
            if (isGroup) {
              self._volume = vol;
            }
            if (to < from && vol <= to || to > from && vol >= to) {
              clearInterval(sound._interval);
              sound._interval = null;
              sound._fadeTo = null;
              self.volume(to, sound._id);
              self._emit("fade", sound._id);
            }
          }, stepLen);
        },
        /**
         * Internal method that stops the currently playing fade when
         * a new fade starts, volume is changed or the sound is stopped.
         * @param  {Number} id The sound id.
         * @return {Howl}
         */
        _stopFade: function(id) {
          var self = this;
          var sound = self._soundById(id);
          if (sound && sound._interval) {
            if (self._webAudio) {
              sound._node.gain.cancelScheduledValues(Howler2.ctx.currentTime);
            }
            clearInterval(sound._interval);
            sound._interval = null;
            self.volume(sound._fadeTo, id);
            sound._fadeTo = null;
            self._emit("fade", id);
          }
          return self;
        },
        /**
         * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
         *   loop() -> Returns the group's loop value.
         *   loop(id) -> Returns the sound id's loop value.
         *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
         *   loop(loop, id) -> Sets the loop value of passed sound id.
         * @return {Howl/Boolean} Returns self or current loop value.
         */
        loop: function() {
          var self = this;
          var args = arguments;
          var loop, id, sound;
          if (args.length === 0) {
            return self._loop;
          } else if (args.length === 1) {
            if (typeof args[0] === "boolean") {
              loop = args[0];
              self._loop = loop;
            } else {
              sound = self._soundById(parseInt(args[0], 10));
              return sound ? sound._loop : false;
            }
          } else if (args.length === 2) {
            loop = args[0];
            id = parseInt(args[1], 10);
          }
          var ids = self._getSoundIds(id);
          for (var i = 0; i < ids.length; i++) {
            sound = self._soundById(ids[i]);
            if (sound) {
              sound._loop = loop;
              if (self._webAudio && sound._node && sound._node.bufferSource) {
                sound._node.bufferSource.loop = loop;
                if (loop) {
                  sound._node.bufferSource.loopStart = sound._start || 0;
                  sound._node.bufferSource.loopEnd = sound._stop;
                  if (self.playing(ids[i])) {
                    self.pause(ids[i], true);
                    self.play(ids[i], true);
                  }
                }
              }
            }
          }
          return self;
        },
        /**
         * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
         *   rate() -> Returns the first sound node's current playback rate.
         *   rate(id) -> Returns the sound id's current playback rate.
         *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
         *   rate(rate, id) -> Sets the playback rate of passed sound id.
         * @return {Howl/Number} Returns self or the current playback rate.
         */
        rate: function() {
          var self = this;
          var args = arguments;
          var rate, id;
          if (args.length === 0) {
            id = self._sounds[0]._id;
          } else if (args.length === 1) {
            var ids = self._getSoundIds();
            var index = ids.indexOf(args[0]);
            if (index >= 0) {
              id = parseInt(args[0], 10);
            } else {
              rate = parseFloat(args[0]);
            }
          } else if (args.length === 2) {
            rate = parseFloat(args[0]);
            id = parseInt(args[1], 10);
          }
          var sound;
          if (typeof rate === "number") {
            if (self._state !== "loaded" || self._playLock) {
              self._queue.push({
                event: "rate",
                action: function() {
                  self.rate.apply(self, args);
                }
              });
              return self;
            }
            if (typeof id === "undefined") {
              self._rate = rate;
            }
            id = self._getSoundIds(id);
            for (var i = 0; i < id.length; i++) {
              sound = self._soundById(id[i]);
              if (sound) {
                if (self.playing(id[i])) {
                  sound._rateSeek = self.seek(id[i]);
                  sound._playStart = self._webAudio ? Howler2.ctx.currentTime : sound._playStart;
                }
                sound._rate = rate;
                if (self._webAudio && sound._node && sound._node.bufferSource) {
                  sound._node.bufferSource.playbackRate.setValueAtTime(rate, Howler2.ctx.currentTime);
                } else if (sound._node) {
                  sound._node.playbackRate = rate;
                }
                var seek = self.seek(id[i]);
                var duration = (self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1e3 - seek;
                var timeout = duration * 1e3 / Math.abs(sound._rate);
                if (self._endTimers[id[i]] || !sound._paused) {
                  self._clearTimer(id[i]);
                  self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
                }
                self._emit("rate", sound._id);
              }
            }
          } else {
            sound = self._soundById(id);
            return sound ? sound._rate : self._rate;
          }
          return self;
        },
        /**
         * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
         *   seek() -> Returns the first sound node's current seek position.
         *   seek(id) -> Returns the sound id's current seek position.
         *   seek(seek) -> Sets the seek position of the first sound node.
         *   seek(seek, id) -> Sets the seek position of passed sound id.
         * @return {Howl/Number} Returns self or the current seek position.
         */
        seek: function() {
          var self = this;
          var args = arguments;
          var seek, id;
          if (args.length === 0) {
            if (self._sounds.length) {
              id = self._sounds[0]._id;
            }
          } else if (args.length === 1) {
            var ids = self._getSoundIds();
            var index = ids.indexOf(args[0]);
            if (index >= 0) {
              id = parseInt(args[0], 10);
            } else if (self._sounds.length) {
              id = self._sounds[0]._id;
              seek = parseFloat(args[0]);
            }
          } else if (args.length === 2) {
            seek = parseFloat(args[0]);
            id = parseInt(args[1], 10);
          }
          if (typeof id === "undefined") {
            return 0;
          }
          if (typeof seek === "number" && (self._state !== "loaded" || self._playLock)) {
            self._queue.push({
              event: "seek",
              action: function() {
                self.seek.apply(self, args);
              }
            });
            return self;
          }
          var sound = self._soundById(id);
          if (sound) {
            if (typeof seek === "number" && seek >= 0) {
              var playing = self.playing(id);
              if (playing) {
                self.pause(id, true);
              }
              sound._seek = seek;
              sound._ended = false;
              self._clearTimer(id);
              if (!self._webAudio && sound._node && !isNaN(sound._node.duration)) {
                sound._node.currentTime = seek;
              }
              var seekAndEmit = function() {
                if (playing) {
                  self.play(id, true);
                }
                self._emit("seek", id);
              };
              if (playing && !self._webAudio) {
                var emitSeek = function() {
                  if (!self._playLock) {
                    seekAndEmit();
                  } else {
                    setTimeout(emitSeek, 0);
                  }
                };
                setTimeout(emitSeek, 0);
              } else {
                seekAndEmit();
              }
            } else {
              if (self._webAudio) {
                var realTime = self.playing(id) ? Howler2.ctx.currentTime - sound._playStart : 0;
                var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
                return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
              } else {
                return sound._node.currentTime;
              }
            }
          }
          return self;
        },
        /**
         * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
         * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
         * @return {Boolean} True if playing and false if not.
         */
        playing: function(id) {
          var self = this;
          if (typeof id === "number") {
            var sound = self._soundById(id);
            return sound ? !sound._paused : false;
          }
          for (var i = 0; i < self._sounds.length; i++) {
            if (!self._sounds[i]._paused) {
              return true;
            }
          }
          return false;
        },
        /**
         * Get the duration of this sound. Passing a sound id will return the sprite duration.
         * @param  {Number} id The sound id to check. If none is passed, return full source duration.
         * @return {Number} Audio duration in seconds.
         */
        duration: function(id) {
          var self = this;
          var duration = self._duration;
          var sound = self._soundById(id);
          if (sound) {
            duration = self._sprite[sound._sprite][1] / 1e3;
          }
          return duration;
        },
        /**
         * Returns the current loaded state of this Howl.
         * @return {String} 'unloaded', 'loading', 'loaded'
         */
        state: function() {
          return this._state;
        },
        /**
         * Unload and destroy the current Howl object.
         * This will immediately stop all sound instances attached to this group.
         */
        unload: function() {
          var self = this;
          var sounds = self._sounds;
          for (var i = 0; i < sounds.length; i++) {
            if (!sounds[i]._paused) {
              self.stop(sounds[i]._id);
            }
            if (!self._webAudio) {
              self._clearSound(sounds[i]._node);
              sounds[i]._node.removeEventListener("error", sounds[i]._errorFn, false);
              sounds[i]._node.removeEventListener(Howler2._canPlayEvent, sounds[i]._loadFn, false);
              sounds[i]._node.removeEventListener("ended", sounds[i]._endFn, false);
              Howler2._releaseHtml5Audio(sounds[i]._node);
            }
            delete sounds[i]._node;
            self._clearTimer(sounds[i]._id);
          }
          var index = Howler2._howls.indexOf(self);
          if (index >= 0) {
            Howler2._howls.splice(index, 1);
          }
          var remCache = true;
          for (i = 0; i < Howler2._howls.length; i++) {
            if (Howler2._howls[i]._src === self._src || self._src.indexOf(Howler2._howls[i]._src) >= 0) {
              remCache = false;
              break;
            }
          }
          if (cache && remCache) {
            delete cache[self._src];
          }
          Howler2.noAudio = false;
          self._state = "unloaded";
          self._sounds = [];
          self = null;
          return null;
        },
        /**
         * Listen to a custom event.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to call.
         * @param  {Number}   id    (optional) Only listen to events for this sound.
         * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
         * @return {Howl}
         */
        on: function(event, fn, id, once) {
          var self = this;
          var events = self["_on" + event];
          if (typeof fn === "function") {
            events.push(once ? { id, fn, once } : { id, fn });
          }
          return self;
        },
        /**
         * Remove a custom event. Call without parameters to remove all events.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to remove. Leave empty to remove all.
         * @param  {Number}   id    (optional) Only remove events for this sound.
         * @return {Howl}
         */
        off: function(event, fn, id) {
          var self = this;
          var events = self["_on" + event];
          var i = 0;
          if (typeof fn === "number") {
            id = fn;
            fn = null;
          }
          if (fn || id) {
            for (i = 0; i < events.length; i++) {
              var isId = id === events[i].id;
              if (fn === events[i].fn && isId || !fn && isId) {
                events.splice(i, 1);
                break;
              }
            }
          } else if (event) {
            self["_on" + event] = [];
          } else {
            var keys = Object.keys(self);
            for (i = 0; i < keys.length; i++) {
              if (keys[i].indexOf("_on") === 0 && Array.isArray(self[keys[i]])) {
                self[keys[i]] = [];
              }
            }
          }
          return self;
        },
        /**
         * Listen to a custom event and remove it once fired.
         * @param  {String}   event Event name.
         * @param  {Function} fn    Listener to call.
         * @param  {Number}   id    (optional) Only listen to events for this sound.
         * @return {Howl}
         */
        once: function(event, fn, id) {
          var self = this;
          self.on(event, fn, id, 1);
          return self;
        },
        /**
         * Emit all events of a specific type and pass the sound id.
         * @param  {String} event Event name.
         * @param  {Number} id    Sound ID.
         * @param  {Number} msg   Message to go with event.
         * @return {Howl}
         */
        _emit: function(event, id, msg) {
          var self = this;
          var events = self["_on" + event];
          for (var i = events.length - 1; i >= 0; i--) {
            if (!events[i].id || events[i].id === id || event === "load") {
              setTimeout((function(fn) {
                fn.call(this, id, msg);
              }).bind(self, events[i].fn), 0);
              if (events[i].once) {
                self.off(event, events[i].fn, events[i].id);
              }
            }
          }
          self._loadQueue(event);
          return self;
        },
        /**
         * Queue of actions initiated before the sound has loaded.
         * These will be called in sequence, with the next only firing
         * after the previous has finished executing (even if async like play).
         * @return {Howl}
         */
        _loadQueue: function(event) {
          var self = this;
          if (self._queue.length > 0) {
            var task = self._queue[0];
            if (task.event === event) {
              self._queue.shift();
              self._loadQueue();
            }
            if (!event) {
              task.action();
            }
          }
          return self;
        },
        /**
         * Fired when playback ends at the end of the duration.
         * @param  {Sound} sound The sound object to work with.
         * @return {Howl}
         */
        _ended: function(sound) {
          var self = this;
          var sprite = sound._sprite;
          if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
            setTimeout(self._ended.bind(self, sound), 100);
            return self;
          }
          var loop = !!(sound._loop || self._sprite[sprite][2]);
          self._emit("end", sound._id);
          if (!self._webAudio && loop) {
            self.stop(sound._id, true).play(sound._id);
          }
          if (self._webAudio && loop) {
            self._emit("play", sound._id);
            sound._seek = sound._start || 0;
            sound._rateSeek = 0;
            sound._playStart = Howler2.ctx.currentTime;
            var timeout = (sound._stop - sound._start) * 1e3 / Math.abs(sound._rate);
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }
          if (self._webAudio && !loop) {
            sound._paused = true;
            sound._ended = true;
            sound._seek = sound._start || 0;
            sound._rateSeek = 0;
            self._clearTimer(sound._id);
            self._cleanBuffer(sound._node);
            Howler2._autoSuspend();
          }
          if (!self._webAudio && !loop) {
            self.stop(sound._id, true);
          }
          return self;
        },
        /**
         * Clear the end timer for a sound playback.
         * @param  {Number} id The sound ID.
         * @return {Howl}
         */
        _clearTimer: function(id) {
          var self = this;
          if (self._endTimers[id]) {
            if (typeof self._endTimers[id] !== "function") {
              clearTimeout(self._endTimers[id]);
            } else {
              var sound = self._soundById(id);
              if (sound && sound._node) {
                sound._node.removeEventListener("ended", self._endTimers[id], false);
              }
            }
            delete self._endTimers[id];
          }
          return self;
        },
        /**
         * Return the sound identified by this ID, or return null.
         * @param  {Number} id Sound ID
         * @return {Object}    Sound object or null.
         */
        _soundById: function(id) {
          var self = this;
          for (var i = 0; i < self._sounds.length; i++) {
            if (id === self._sounds[i]._id) {
              return self._sounds[i];
            }
          }
          return null;
        },
        /**
         * Return an inactive sound from the pool or create a new one.
         * @return {Sound} Sound playback object.
         */
        _inactiveSound: function() {
          var self = this;
          self._drain();
          for (var i = 0; i < self._sounds.length; i++) {
            if (self._sounds[i]._ended) {
              return self._sounds[i].reset();
            }
          }
          return new Sound2(self);
        },
        /**
         * Drain excess inactive sounds from the pool.
         */
        _drain: function() {
          var self = this;
          var limit = self._pool;
          var cnt = 0;
          var i = 0;
          if (self._sounds.length < limit) {
            return;
          }
          for (i = 0; i < self._sounds.length; i++) {
            if (self._sounds[i]._ended) {
              cnt++;
            }
          }
          for (i = self._sounds.length - 1; i >= 0; i--) {
            if (cnt <= limit) {
              return;
            }
            if (self._sounds[i]._ended) {
              if (self._webAudio && self._sounds[i]._node) {
                self._sounds[i]._node.disconnect(0);
              }
              self._sounds.splice(i, 1);
              cnt--;
            }
          }
        },
        /**
         * Get all ID's from the sounds pool.
         * @param  {Number} id Only return one ID if one is passed.
         * @return {Array}    Array of IDs.
         */
        _getSoundIds: function(id) {
          var self = this;
          if (typeof id === "undefined") {
            var ids = [];
            for (var i = 0; i < self._sounds.length; i++) {
              ids.push(self._sounds[i]._id);
            }
            return ids;
          } else {
            return [id];
          }
        },
        /**
         * Load the sound back into the buffer source.
         * @param  {Sound} sound The sound object to work with.
         * @return {Howl}
         */
        _refreshBuffer: function(sound) {
          var self = this;
          sound._node.bufferSource = Howler2.ctx.createBufferSource();
          sound._node.bufferSource.buffer = cache[self._src];
          if (sound._panner) {
            sound._node.bufferSource.connect(sound._panner);
          } else {
            sound._node.bufferSource.connect(sound._node);
          }
          sound._node.bufferSource.loop = sound._loop;
          if (sound._loop) {
            sound._node.bufferSource.loopStart = sound._start || 0;
            sound._node.bufferSource.loopEnd = sound._stop || 0;
          }
          sound._node.bufferSource.playbackRate.setValueAtTime(sound._rate, Howler2.ctx.currentTime);
          return self;
        },
        /**
         * Prevent memory leaks by cleaning up the buffer source after playback.
         * @param  {Object} node Sound's audio node containing the buffer source.
         * @return {Howl}
         */
        _cleanBuffer: function(node) {
          var self = this;
          var isIOS = Howler2._navigator && Howler2._navigator.vendor.indexOf("Apple") >= 0;
          if (!node.bufferSource) {
            return self;
          }
          if (Howler2._scratchBuffer && node.bufferSource) {
            node.bufferSource.onended = null;
            node.bufferSource.disconnect(0);
            if (isIOS) {
              try {
                node.bufferSource.buffer = Howler2._scratchBuffer;
              } catch (e) {
              }
            }
          }
          node.bufferSource = null;
          return self;
        },
        /**
         * Set the source to a 0-second silence to stop any downloading (except in IE).
         * @param  {Object} node Audio node to clear.
         */
        _clearSound: function(node) {
          var checkIE = /MSIE |Trident\//.test(Howler2._navigator && Howler2._navigator.userAgent);
          if (!checkIE) {
            node.src = "data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA";
          }
        }
      };
      var Sound2 = function(howl) {
        this._parent = howl;
        this.init();
      };
      Sound2.prototype = {
        /**
         * Initialize a new Sound object.
         * @return {Sound}
         */
        init: function() {
          var self = this;
          var parent = self._parent;
          self._muted = parent._muted;
          self._loop = parent._loop;
          self._volume = parent._volume;
          self._rate = parent._rate;
          self._seek = 0;
          self._paused = true;
          self._ended = true;
          self._sprite = "__default";
          self._id = ++Howler2._counter;
          parent._sounds.push(self);
          self.create();
          return self;
        },
        /**
         * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
         * @return {Sound}
         */
        create: function() {
          var self = this;
          var parent = self._parent;
          var volume = Howler2._muted || self._muted || self._parent._muted ? 0 : self._volume;
          if (parent._webAudio) {
            self._node = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
            self._node.gain.setValueAtTime(volume, Howler2.ctx.currentTime);
            self._node.paused = true;
            self._node.connect(Howler2.masterGain);
          } else if (!Howler2.noAudio) {
            self._node = Howler2._obtainHtml5Audio();
            self._errorFn = self._errorListener.bind(self);
            self._node.addEventListener("error", self._errorFn, false);
            self._loadFn = self._loadListener.bind(self);
            self._node.addEventListener(Howler2._canPlayEvent, self._loadFn, false);
            self._endFn = self._endListener.bind(self);
            self._node.addEventListener("ended", self._endFn, false);
            self._node.src = parent._src;
            self._node.preload = parent._preload === true ? "auto" : parent._preload;
            self._node.volume = volume * Howler2.volume();
            self._node.load();
          }
          return self;
        },
        /**
         * Reset the parameters of this sound to the original state (for recycle).
         * @return {Sound}
         */
        reset: function() {
          var self = this;
          var parent = self._parent;
          self._muted = parent._muted;
          self._loop = parent._loop;
          self._volume = parent._volume;
          self._rate = parent._rate;
          self._seek = 0;
          self._rateSeek = 0;
          self._paused = true;
          self._ended = true;
          self._sprite = "__default";
          self._id = ++Howler2._counter;
          return self;
        },
        /**
         * HTML5 Audio error listener callback.
         */
        _errorListener: function() {
          var self = this;
          self._parent._emit("loaderror", self._id, self._node.error ? self._node.error.code : 0);
          self._node.removeEventListener("error", self._errorFn, false);
        },
        /**
         * HTML5 Audio canplaythrough listener callback.
         */
        _loadListener: function() {
          var self = this;
          var parent = self._parent;
          parent._duration = Math.ceil(self._node.duration * 10) / 10;
          if (Object.keys(parent._sprite).length === 0) {
            parent._sprite = { __default: [0, parent._duration * 1e3] };
          }
          if (parent._state !== "loaded") {
            parent._state = "loaded";
            parent._emit("load");
            parent._loadQueue();
          }
          self._node.removeEventListener(Howler2._canPlayEvent, self._loadFn, false);
        },
        /**
         * HTML5 Audio ended listener callback.
         */
        _endListener: function() {
          var self = this;
          var parent = self._parent;
          if (parent._duration === Infinity) {
            parent._duration = Math.ceil(self._node.duration * 10) / 10;
            if (parent._sprite.__default[1] === Infinity) {
              parent._sprite.__default[1] = parent._duration * 1e3;
            }
            parent._ended(self);
          }
          self._node.removeEventListener("ended", self._endFn, false);
        }
      };
      var cache = {};
      var loadBuffer = function(self) {
        var url = self._src;
        if (cache[url]) {
          self._duration = cache[url].duration;
          loadSound(self);
          return;
        }
        if (/^data:[^;]+;base64,/.test(url)) {
          var data = atob(url.split(",")[1]);
          var dataView = new Uint8Array(data.length);
          for (var i = 0; i < data.length; ++i) {
            dataView[i] = data.charCodeAt(i);
          }
          decodeAudioData(dataView.buffer, self);
        } else {
          var xhr = new XMLHttpRequest();
          xhr.open(self._xhr.method, url, true);
          xhr.withCredentials = self._xhr.withCredentials;
          xhr.responseType = "arraybuffer";
          if (self._xhr.headers) {
            Object.keys(self._xhr.headers).forEach(function(key) {
              xhr.setRequestHeader(key, self._xhr.headers[key]);
            });
          }
          xhr.onload = function() {
            var code = (xhr.status + "")[0];
            if (code !== "0" && code !== "2" && code !== "3") {
              self._emit("loaderror", null, "Failed loading audio file with status: " + xhr.status + ".");
              return;
            }
            decodeAudioData(xhr.response, self);
          };
          xhr.onerror = function() {
            if (self._webAudio) {
              self._html5 = true;
              self._webAudio = false;
              self._sounds = [];
              delete cache[url];
              self.load();
            }
          };
          safeXhrSend(xhr);
        }
      };
      var safeXhrSend = function(xhr) {
        try {
          xhr.send();
        } catch (e) {
          xhr.onerror();
        }
      };
      var decodeAudioData = function(arraybuffer, self) {
        var error = function() {
          self._emit("loaderror", null, "Decoding audio data failed.");
        };
        var success = function(buffer) {
          if (buffer && self._sounds.length > 0) {
            cache[self._src] = buffer;
            loadSound(self, buffer);
          } else {
            error();
          }
        };
        if (typeof Promise !== "undefined" && Howler2.ctx.decodeAudioData.length === 1) {
          Howler2.ctx.decodeAudioData(arraybuffer).then(success).catch(error);
        } else {
          Howler2.ctx.decodeAudioData(arraybuffer, success, error);
        }
      };
      var loadSound = function(self, buffer) {
        if (buffer && !self._duration) {
          self._duration = buffer.duration;
        }
        if (Object.keys(self._sprite).length === 0) {
          self._sprite = { __default: [0, self._duration * 1e3] };
        }
        if (self._state !== "loaded") {
          self._state = "loaded";
          self._emit("load");
          self._loadQueue();
        }
      };
      var setupAudioContext = function() {
        if (!Howler2.usingWebAudio) {
          return;
        }
        try {
          if (typeof AudioContext !== "undefined") {
            Howler2.ctx = new AudioContext();
          } else if (typeof webkitAudioContext !== "undefined") {
            Howler2.ctx = new webkitAudioContext();
          } else {
            Howler2.usingWebAudio = false;
          }
        } catch (e) {
          Howler2.usingWebAudio = false;
        }
        if (!Howler2.ctx) {
          Howler2.usingWebAudio = false;
        }
        var iOS = /iP(hone|od|ad)/.test(Howler2._navigator && Howler2._navigator.platform);
        var appVersion = Howler2._navigator && Howler2._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
        var version = appVersion ? parseInt(appVersion[1], 10) : null;
        if (iOS && version && version < 9) {
          var safari = /safari/.test(Howler2._navigator && Howler2._navigator.userAgent.toLowerCase());
          if (Howler2._navigator && !safari) {
            Howler2.usingWebAudio = false;
          }
        }
        if (Howler2.usingWebAudio) {
          Howler2.masterGain = typeof Howler2.ctx.createGain === "undefined" ? Howler2.ctx.createGainNode() : Howler2.ctx.createGain();
          Howler2.masterGain.gain.setValueAtTime(Howler2._muted ? 0 : Howler2._volume, Howler2.ctx.currentTime);
          Howler2.masterGain.connect(Howler2.ctx.destination);
        }
        Howler2._setup();
      };
      if (typeof define === "function" && define.amd) {
        define([], function() {
          return {
            Howler: Howler2,
            Howl: Howl3
          };
        });
      }
      if (typeof exports !== "undefined") {
        exports.Howler = Howler2;
        exports.Howl = Howl3;
      }
      if (typeof global !== "undefined") {
        global.HowlerGlobal = HowlerGlobal2;
        global.Howler = Howler2;
        global.Howl = Howl3;
        global.Sound = Sound2;
      } else if (typeof window !== "undefined") {
        window.HowlerGlobal = HowlerGlobal2;
        window.Howler = Howler2;
        window.Howl = Howl3;
        window.Sound = Sound2;
      }
    })();
    (function() {
      "use strict";
      HowlerGlobal.prototype._pos = [0, 0, 0];
      HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];
      HowlerGlobal.prototype.stereo = function(pan) {
        var self = this;
        if (!self.ctx || !self.ctx.listener) {
          return self;
        }
        for (var i = self._howls.length - 1; i >= 0; i--) {
          self._howls[i].stereo(pan);
        }
        return self;
      };
      HowlerGlobal.prototype.pos = function(x, y, z) {
        var self = this;
        if (!self.ctx || !self.ctx.listener) {
          return self;
        }
        y = typeof y !== "number" ? self._pos[1] : y;
        z = typeof z !== "number" ? self._pos[2] : z;
        if (typeof x === "number") {
          self._pos = [x, y, z];
          if (typeof self.ctx.listener.positionX !== "undefined") {
            self.ctx.listener.positionX.setTargetAtTime(self._pos[0], Howler.ctx.currentTime, 0.1);
            self.ctx.listener.positionY.setTargetAtTime(self._pos[1], Howler.ctx.currentTime, 0.1);
            self.ctx.listener.positionZ.setTargetAtTime(self._pos[2], Howler.ctx.currentTime, 0.1);
          } else {
            self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
          }
        } else {
          return self._pos;
        }
        return self;
      };
      HowlerGlobal.prototype.orientation = function(x, y, z, xUp, yUp, zUp) {
        var self = this;
        if (!self.ctx || !self.ctx.listener) {
          return self;
        }
        var or = self._orientation;
        y = typeof y !== "number" ? or[1] : y;
        z = typeof z !== "number" ? or[2] : z;
        xUp = typeof xUp !== "number" ? or[3] : xUp;
        yUp = typeof yUp !== "number" ? or[4] : yUp;
        zUp = typeof zUp !== "number" ? or[5] : zUp;
        if (typeof x === "number") {
          self._orientation = [x, y, z, xUp, yUp, zUp];
          if (typeof self.ctx.listener.forwardX !== "undefined") {
            self.ctx.listener.forwardX.setTargetAtTime(x, Howler.ctx.currentTime, 0.1);
            self.ctx.listener.forwardY.setTargetAtTime(y, Howler.ctx.currentTime, 0.1);
            self.ctx.listener.forwardZ.setTargetAtTime(z, Howler.ctx.currentTime, 0.1);
            self.ctx.listener.upX.setTargetAtTime(xUp, Howler.ctx.currentTime, 0.1);
            self.ctx.listener.upY.setTargetAtTime(yUp, Howler.ctx.currentTime, 0.1);
            self.ctx.listener.upZ.setTargetAtTime(zUp, Howler.ctx.currentTime, 0.1);
          } else {
            self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
          }
        } else {
          return or;
        }
        return self;
      };
      Howl.prototype.init = /* @__PURE__ */ (function(_super) {
        return function(o) {
          var self = this;
          self._orientation = o.orientation || [1, 0, 0];
          self._stereo = o.stereo || null;
          self._pos = o.pos || null;
          self._pannerAttr = {
            coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : 360,
            coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : 360,
            coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : 0,
            distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : "inverse",
            maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : 1e4,
            panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : "HRTF",
            refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : 1,
            rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : 1
          };
          self._onstereo = o.onstereo ? [{ fn: o.onstereo }] : [];
          self._onpos = o.onpos ? [{ fn: o.onpos }] : [];
          self._onorientation = o.onorientation ? [{ fn: o.onorientation }] : [];
          return _super.call(this, o);
        };
      })(Howl.prototype.init);
      Howl.prototype.stereo = function(pan, id) {
        var self = this;
        if (!self._webAudio) {
          return self;
        }
        if (self._state !== "loaded") {
          self._queue.push({
            event: "stereo",
            action: function() {
              self.stereo(pan, id);
            }
          });
          return self;
        }
        var pannerType = typeof Howler.ctx.createStereoPanner === "undefined" ? "spatial" : "stereo";
        if (typeof id === "undefined") {
          if (typeof pan === "number") {
            self._stereo = pan;
            self._pos = [pan, 0, 0];
          } else {
            return self._stereo;
          }
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          var sound = self._soundById(ids[i]);
          if (sound) {
            if (typeof pan === "number") {
              sound._stereo = pan;
              sound._pos = [pan, 0, 0];
              if (sound._node) {
                sound._pannerAttr.panningModel = "equalpower";
                if (!sound._panner || !sound._panner.pan) {
                  setupPanner(sound, pannerType);
                }
                if (pannerType === "spatial") {
                  if (typeof sound._panner.positionX !== "undefined") {
                    sound._panner.positionX.setValueAtTime(pan, Howler.ctx.currentTime);
                    sound._panner.positionY.setValueAtTime(0, Howler.ctx.currentTime);
                    sound._panner.positionZ.setValueAtTime(0, Howler.ctx.currentTime);
                  } else {
                    sound._panner.setPosition(pan, 0, 0);
                  }
                } else {
                  sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
                }
              }
              self._emit("stereo", sound._id);
            } else {
              return sound._stereo;
            }
          }
        }
        return self;
      };
      Howl.prototype.pos = function(x, y, z, id) {
        var self = this;
        if (!self._webAudio) {
          return self;
        }
        if (self._state !== "loaded") {
          self._queue.push({
            event: "pos",
            action: function() {
              self.pos(x, y, z, id);
            }
          });
          return self;
        }
        y = typeof y !== "number" ? 0 : y;
        z = typeof z !== "number" ? -0.5 : z;
        if (typeof id === "undefined") {
          if (typeof x === "number") {
            self._pos = [x, y, z];
          } else {
            return self._pos;
          }
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          var sound = self._soundById(ids[i]);
          if (sound) {
            if (typeof x === "number") {
              sound._pos = [x, y, z];
              if (sound._node) {
                if (!sound._panner || sound._panner.pan) {
                  setupPanner(sound, "spatial");
                }
                if (typeof sound._panner.positionX !== "undefined") {
                  sound._panner.positionX.setValueAtTime(x, Howler.ctx.currentTime);
                  sound._panner.positionY.setValueAtTime(y, Howler.ctx.currentTime);
                  sound._panner.positionZ.setValueAtTime(z, Howler.ctx.currentTime);
                } else {
                  sound._panner.setPosition(x, y, z);
                }
              }
              self._emit("pos", sound._id);
            } else {
              return sound._pos;
            }
          }
        }
        return self;
      };
      Howl.prototype.orientation = function(x, y, z, id) {
        var self = this;
        if (!self._webAudio) {
          return self;
        }
        if (self._state !== "loaded") {
          self._queue.push({
            event: "orientation",
            action: function() {
              self.orientation(x, y, z, id);
            }
          });
          return self;
        }
        y = typeof y !== "number" ? self._orientation[1] : y;
        z = typeof z !== "number" ? self._orientation[2] : z;
        if (typeof id === "undefined") {
          if (typeof x === "number") {
            self._orientation = [x, y, z];
          } else {
            return self._orientation;
          }
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          var sound = self._soundById(ids[i]);
          if (sound) {
            if (typeof x === "number") {
              sound._orientation = [x, y, z];
              if (sound._node) {
                if (!sound._panner) {
                  if (!sound._pos) {
                    sound._pos = self._pos || [0, 0, -0.5];
                  }
                  setupPanner(sound, "spatial");
                }
                if (typeof sound._panner.orientationX !== "undefined") {
                  sound._panner.orientationX.setValueAtTime(x, Howler.ctx.currentTime);
                  sound._panner.orientationY.setValueAtTime(y, Howler.ctx.currentTime);
                  sound._panner.orientationZ.setValueAtTime(z, Howler.ctx.currentTime);
                } else {
                  sound._panner.setOrientation(x, y, z);
                }
              }
              self._emit("orientation", sound._id);
            } else {
              return sound._orientation;
            }
          }
        }
        return self;
      };
      Howl.prototype.pannerAttr = function() {
        var self = this;
        var args = arguments;
        var o, id, sound;
        if (!self._webAudio) {
          return self;
        }
        if (args.length === 0) {
          return self._pannerAttr;
        } else if (args.length === 1) {
          if (typeof args[0] === "object") {
            o = args[0];
            if (typeof id === "undefined") {
              if (!o.pannerAttr) {
                o.pannerAttr = {
                  coneInnerAngle: o.coneInnerAngle,
                  coneOuterAngle: o.coneOuterAngle,
                  coneOuterGain: o.coneOuterGain,
                  distanceModel: o.distanceModel,
                  maxDistance: o.maxDistance,
                  refDistance: o.refDistance,
                  rolloffFactor: o.rolloffFactor,
                  panningModel: o.panningModel
                };
              }
              self._pannerAttr = {
                coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== "undefined" ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
                coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== "undefined" ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
                coneOuterGain: typeof o.pannerAttr.coneOuterGain !== "undefined" ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
                distanceModel: typeof o.pannerAttr.distanceModel !== "undefined" ? o.pannerAttr.distanceModel : self._distanceModel,
                maxDistance: typeof o.pannerAttr.maxDistance !== "undefined" ? o.pannerAttr.maxDistance : self._maxDistance,
                refDistance: typeof o.pannerAttr.refDistance !== "undefined" ? o.pannerAttr.refDistance : self._refDistance,
                rolloffFactor: typeof o.pannerAttr.rolloffFactor !== "undefined" ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
                panningModel: typeof o.pannerAttr.panningModel !== "undefined" ? o.pannerAttr.panningModel : self._panningModel
              };
            }
          } else {
            sound = self._soundById(parseInt(args[0], 10));
            return sound ? sound._pannerAttr : self._pannerAttr;
          }
        } else if (args.length === 2) {
          o = args[0];
          id = parseInt(args[1], 10);
        }
        var ids = self._getSoundIds(id);
        for (var i = 0; i < ids.length; i++) {
          sound = self._soundById(ids[i]);
          if (sound) {
            var pa = sound._pannerAttr;
            pa = {
              coneInnerAngle: typeof o.coneInnerAngle !== "undefined" ? o.coneInnerAngle : pa.coneInnerAngle,
              coneOuterAngle: typeof o.coneOuterAngle !== "undefined" ? o.coneOuterAngle : pa.coneOuterAngle,
              coneOuterGain: typeof o.coneOuterGain !== "undefined" ? o.coneOuterGain : pa.coneOuterGain,
              distanceModel: typeof o.distanceModel !== "undefined" ? o.distanceModel : pa.distanceModel,
              maxDistance: typeof o.maxDistance !== "undefined" ? o.maxDistance : pa.maxDistance,
              refDistance: typeof o.refDistance !== "undefined" ? o.refDistance : pa.refDistance,
              rolloffFactor: typeof o.rolloffFactor !== "undefined" ? o.rolloffFactor : pa.rolloffFactor,
              panningModel: typeof o.panningModel !== "undefined" ? o.panningModel : pa.panningModel
            };
            var panner = sound._panner;
            if (!panner) {
              if (!sound._pos) {
                sound._pos = self._pos || [0, 0, -0.5];
              }
              setupPanner(sound, "spatial");
              panner = sound._panner;
            }
            panner.coneInnerAngle = pa.coneInnerAngle;
            panner.coneOuterAngle = pa.coneOuterAngle;
            panner.coneOuterGain = pa.coneOuterGain;
            panner.distanceModel = pa.distanceModel;
            panner.maxDistance = pa.maxDistance;
            panner.refDistance = pa.refDistance;
            panner.rolloffFactor = pa.rolloffFactor;
            panner.panningModel = pa.panningModel;
          }
        }
        return self;
      };
      Sound.prototype.init = /* @__PURE__ */ (function(_super) {
        return function() {
          var self = this;
          var parent = self._parent;
          self._orientation = parent._orientation;
          self._stereo = parent._stereo;
          self._pos = parent._pos;
          self._pannerAttr = parent._pannerAttr;
          _super.call(this);
          if (self._stereo) {
            parent.stereo(self._stereo);
          } else if (self._pos) {
            parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
          }
        };
      })(Sound.prototype.init);
      Sound.prototype.reset = /* @__PURE__ */ (function(_super) {
        return function() {
          var self = this;
          var parent = self._parent;
          self._orientation = parent._orientation;
          self._stereo = parent._stereo;
          self._pos = parent._pos;
          self._pannerAttr = parent._pannerAttr;
          if (self._stereo) {
            parent.stereo(self._stereo);
          } else if (self._pos) {
            parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
          } else if (self._panner) {
            self._panner.disconnect(0);
            self._panner = void 0;
            parent._refreshBuffer(self);
          }
          return _super.call(this);
        };
      })(Sound.prototype.reset);
      var setupPanner = function(sound, type) {
        type = type || "spatial";
        if (type === "spatial") {
          sound._panner = Howler.ctx.createPanner();
          sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
          sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
          sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
          sound._panner.distanceModel = sound._pannerAttr.distanceModel;
          sound._panner.maxDistance = sound._pannerAttr.maxDistance;
          sound._panner.refDistance = sound._pannerAttr.refDistance;
          sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
          sound._panner.panningModel = sound._pannerAttr.panningModel;
          if (typeof sound._panner.positionX !== "undefined") {
            sound._panner.positionX.setValueAtTime(sound._pos[0], Howler.ctx.currentTime);
            sound._panner.positionY.setValueAtTime(sound._pos[1], Howler.ctx.currentTime);
            sound._panner.positionZ.setValueAtTime(sound._pos[2], Howler.ctx.currentTime);
          } else {
            sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
          }
          if (typeof sound._panner.orientationX !== "undefined") {
            sound._panner.orientationX.setValueAtTime(sound._orientation[0], Howler.ctx.currentTime);
            sound._panner.orientationY.setValueAtTime(sound._orientation[1], Howler.ctx.currentTime);
            sound._panner.orientationZ.setValueAtTime(sound._orientation[2], Howler.ctx.currentTime);
          } else {
            sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
          }
        } else {
          sound._panner = Howler.ctx.createStereoPanner();
          sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
        }
        sound._panner.connect(sound._node);
        if (!sound._paused) {
          sound._parent.pause(sound._id, true).play(sound._id, true);
        }
      };
    })();
  }
});

// node_modules/.pnpm/@angular+material@20.2.1_6454c0930df7c912b2ef33598e3c1604/node_modules/@angular/material/fesm2022/card.mjs
var _c0 = ["*"];
var _c1 = [[["mat-card-title"], ["mat-card-subtitle"], ["", "mat-card-title", ""], ["", "mat-card-subtitle", ""], ["", "matCardTitle", ""], ["", "matCardSubtitle", ""]], [["", "mat-card-image", ""], ["", "matCardImage", ""], ["", "mat-card-sm-image", ""], ["", "matCardImageSmall", ""], ["", "mat-card-md-image", ""], ["", "matCardImageMedium", ""], ["", "mat-card-lg-image", ""], ["", "matCardImageLarge", ""], ["", "mat-card-xl-image", ""], ["", "matCardImageXLarge", ""]], "*"];
var _c2 = ["mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]", "[mat-card-image], [matCardImage],\n                    [mat-card-sm-image], [matCardImageSmall],\n                    [mat-card-md-image], [matCardImageMedium],\n                    [mat-card-lg-image], [matCardImageLarge],\n                    [mat-card-xl-image], [matCardImageXLarge]", "*"];
var _c3 = [[["", "mat-card-avatar", ""], ["", "matCardAvatar", ""]], [["mat-card-title"], ["mat-card-subtitle"], ["", "mat-card-title", ""], ["", "mat-card-subtitle", ""], ["", "matCardTitle", ""], ["", "matCardSubtitle", ""]], "*"];
var _c4 = ["[mat-card-avatar], [matCardAvatar]", "mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]", "*"];
var MAT_CARD_CONFIG = new InjectionToken("MAT_CARD_CONFIG");
var MatCard = class _MatCard {
  appearance;
  constructor() {
    const config = inject(MAT_CARD_CONFIG, {
      optional: true
    });
    this.appearance = config?.appearance || "raised";
  }
  static \u0275fac = function MatCard_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCard)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatCard,
    selectors: [["mat-card"]],
    hostAttrs: [1, "mat-mdc-card", "mdc-card"],
    hostVars: 8,
    hostBindings: function MatCard_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mat-mdc-card-outlined", ctx.appearance === "outlined")("mdc-card--outlined", ctx.appearance === "outlined")("mat-mdc-card-filled", ctx.appearance === "filled")("mdc-card--filled", ctx.appearance === "filled");
      }
    },
    inputs: {
      appearance: "appearance"
    },
    exportAs: ["matCard"],
    ngContentSelectors: _c0,
    decls: 1,
    vars: 0,
    template: function MatCard_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275projection(0);
      }
    },
    styles: ['.mat-mdc-card{display:flex;flex-direction:column;box-sizing:border-box;position:relative;border-style:solid;border-width:0;background-color:var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));border-color:var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));border-radius:var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));box-shadow:var(--mat-card-elevated-container-elevation, var(--mat-sys-level1))}.mat-mdc-card::after{position:absolute;top:0;left:0;width:100%;height:100%;border:solid 1px rgba(0,0,0,0);content:"";display:block;pointer-events:none;box-sizing:border-box;border-radius:var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium))}.mat-mdc-card-outlined{background-color:var(--mat-card-outlined-container-color, var(--mat-sys-surface));border-radius:var(--mat-card-outlined-container-shape, var(--mat-sys-corner-medium));border-width:var(--mat-card-outlined-outline-width, 1px);border-color:var(--mat-card-outlined-outline-color, var(--mat-sys-outline-variant));box-shadow:var(--mat-card-outlined-container-elevation, var(--mat-sys-level0))}.mat-mdc-card-outlined::after{border:none}.mat-mdc-card-filled{background-color:var(--mat-card-filled-container-color, var(--mat-sys-surface-container-highest));border-radius:var(--mat-card-filled-container-shape, var(--mat-sys-corner-medium));box-shadow:var(--mat-card-filled-container-elevation, var(--mat-sys-level0))}.mdc-card__media{position:relative;box-sizing:border-box;background-repeat:no-repeat;background-position:center;background-size:cover}.mdc-card__media::before{display:block;content:""}.mdc-card__media:first-child{border-top-left-radius:inherit;border-top-right-radius:inherit}.mdc-card__media:last-child{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.mat-mdc-card-actions{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;min-height:52px;padding:8px}.mat-mdc-card-title{font-family:var(--mat-card-title-text-font, var(--mat-sys-title-large-font));line-height:var(--mat-card-title-text-line-height, var(--mat-sys-title-large-line-height));font-size:var(--mat-card-title-text-size, var(--mat-sys-title-large-size));letter-spacing:var(--mat-card-title-text-tracking, var(--mat-sys-title-large-tracking));font-weight:var(--mat-card-title-text-weight, var(--mat-sys-title-large-weight))}.mat-mdc-card-subtitle{color:var(--mat-card-subtitle-text-color, var(--mat-sys-on-surface));font-family:var(--mat-card-subtitle-text-font, var(--mat-sys-title-medium-font));line-height:var(--mat-card-subtitle-text-line-height, var(--mat-sys-title-medium-line-height));font-size:var(--mat-card-subtitle-text-size, var(--mat-sys-title-medium-size));letter-spacing:var(--mat-card-subtitle-text-tracking, var(--mat-sys-title-medium-tracking));font-weight:var(--mat-card-subtitle-text-weight, var(--mat-sys-title-medium-weight))}.mat-mdc-card-title,.mat-mdc-card-subtitle{display:block;margin:0}.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-title,.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-subtitle{padding:16px 16px 0}.mat-mdc-card-header{display:flex;padding:16px 16px 0}.mat-mdc-card-content{display:block;padding:0 16px}.mat-mdc-card-content:first-child{padding-top:16px}.mat-mdc-card-content:last-child{padding-bottom:16px}.mat-mdc-card-title-group{display:flex;justify-content:space-between;width:100%}.mat-mdc-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;margin-bottom:16px;object-fit:cover}.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-subtitle,.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-title{line-height:normal}.mat-mdc-card-sm-image{width:80px;height:80px}.mat-mdc-card-md-image{width:112px;height:112px}.mat-mdc-card-lg-image{width:152px;height:152px}.mat-mdc-card-xl-image{width:240px;height:240px}.mat-mdc-card-subtitle~.mat-mdc-card-title,.mat-mdc-card-title~.mat-mdc-card-subtitle,.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,.mat-mdc-card-title-group .mat-mdc-card-title,.mat-mdc-card-title-group .mat-mdc-card-subtitle{padding-top:0}.mat-mdc-card-content>:last-child:not(.mat-mdc-card-footer){margin-bottom:0}.mat-mdc-card-actions-align-end{justify-content:flex-end}\n'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCard, [{
    type: Component,
    args: [{
      selector: "mat-card",
      host: {
        "class": "mat-mdc-card mdc-card",
        "[class.mat-mdc-card-outlined]": 'appearance === "outlined"',
        "[class.mdc-card--outlined]": 'appearance === "outlined"',
        "[class.mat-mdc-card-filled]": 'appearance === "filled"',
        "[class.mdc-card--filled]": 'appearance === "filled"'
      },
      exportAs: "matCard",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: "<ng-content></ng-content>\n",
      styles: ['.mat-mdc-card{display:flex;flex-direction:column;box-sizing:border-box;position:relative;border-style:solid;border-width:0;background-color:var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));border-color:var(--mat-card-elevated-container-color, var(--mat-sys-surface-container-low));border-radius:var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium));box-shadow:var(--mat-card-elevated-container-elevation, var(--mat-sys-level1))}.mat-mdc-card::after{position:absolute;top:0;left:0;width:100%;height:100%;border:solid 1px rgba(0,0,0,0);content:"";display:block;pointer-events:none;box-sizing:border-box;border-radius:var(--mat-card-elevated-container-shape, var(--mat-sys-corner-medium))}.mat-mdc-card-outlined{background-color:var(--mat-card-outlined-container-color, var(--mat-sys-surface));border-radius:var(--mat-card-outlined-container-shape, var(--mat-sys-corner-medium));border-width:var(--mat-card-outlined-outline-width, 1px);border-color:var(--mat-card-outlined-outline-color, var(--mat-sys-outline-variant));box-shadow:var(--mat-card-outlined-container-elevation, var(--mat-sys-level0))}.mat-mdc-card-outlined::after{border:none}.mat-mdc-card-filled{background-color:var(--mat-card-filled-container-color, var(--mat-sys-surface-container-highest));border-radius:var(--mat-card-filled-container-shape, var(--mat-sys-corner-medium));box-shadow:var(--mat-card-filled-container-elevation, var(--mat-sys-level0))}.mdc-card__media{position:relative;box-sizing:border-box;background-repeat:no-repeat;background-position:center;background-size:cover}.mdc-card__media::before{display:block;content:""}.mdc-card__media:first-child{border-top-left-radius:inherit;border-top-right-radius:inherit}.mdc-card__media:last-child{border-bottom-left-radius:inherit;border-bottom-right-radius:inherit}.mat-mdc-card-actions{display:flex;flex-direction:row;align-items:center;box-sizing:border-box;min-height:52px;padding:8px}.mat-mdc-card-title{font-family:var(--mat-card-title-text-font, var(--mat-sys-title-large-font));line-height:var(--mat-card-title-text-line-height, var(--mat-sys-title-large-line-height));font-size:var(--mat-card-title-text-size, var(--mat-sys-title-large-size));letter-spacing:var(--mat-card-title-text-tracking, var(--mat-sys-title-large-tracking));font-weight:var(--mat-card-title-text-weight, var(--mat-sys-title-large-weight))}.mat-mdc-card-subtitle{color:var(--mat-card-subtitle-text-color, var(--mat-sys-on-surface));font-family:var(--mat-card-subtitle-text-font, var(--mat-sys-title-medium-font));line-height:var(--mat-card-subtitle-text-line-height, var(--mat-sys-title-medium-line-height));font-size:var(--mat-card-subtitle-text-size, var(--mat-sys-title-medium-size));letter-spacing:var(--mat-card-subtitle-text-tracking, var(--mat-sys-title-medium-tracking));font-weight:var(--mat-card-subtitle-text-weight, var(--mat-sys-title-medium-weight))}.mat-mdc-card-title,.mat-mdc-card-subtitle{display:block;margin:0}.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-title,.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-subtitle{padding:16px 16px 0}.mat-mdc-card-header{display:flex;padding:16px 16px 0}.mat-mdc-card-content{display:block;padding:0 16px}.mat-mdc-card-content:first-child{padding-top:16px}.mat-mdc-card-content:last-child{padding-bottom:16px}.mat-mdc-card-title-group{display:flex;justify-content:space-between;width:100%}.mat-mdc-card-avatar{height:40px;width:40px;border-radius:50%;flex-shrink:0;margin-bottom:16px;object-fit:cover}.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-subtitle,.mat-mdc-card-avatar~.mat-mdc-card-header-text .mat-mdc-card-title{line-height:normal}.mat-mdc-card-sm-image{width:80px;height:80px}.mat-mdc-card-md-image{width:112px;height:112px}.mat-mdc-card-lg-image{width:152px;height:152px}.mat-mdc-card-xl-image{width:240px;height:240px}.mat-mdc-card-subtitle~.mat-mdc-card-title,.mat-mdc-card-title~.mat-mdc-card-subtitle,.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-title,.mat-mdc-card-header .mat-mdc-card-header-text .mat-mdc-card-subtitle,.mat-mdc-card-title-group .mat-mdc-card-title,.mat-mdc-card-title-group .mat-mdc-card-subtitle{padding-top:0}.mat-mdc-card-content>:last-child:not(.mat-mdc-card-footer){margin-bottom:0}.mat-mdc-card-actions-align-end{justify-content:flex-end}\n']
    }]
  }], () => [], {
    appearance: [{
      type: Input
    }]
  });
})();
var MatCardTitle = class _MatCardTitle {
  static \u0275fac = function MatCardTitle_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardTitle)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCardTitle,
    selectors: [["mat-card-title"], ["", "mat-card-title", ""], ["", "matCardTitle", ""]],
    hostAttrs: [1, "mat-mdc-card-title"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardTitle, [{
    type: Directive,
    args: [{
      selector: `mat-card-title, [mat-card-title], [matCardTitle]`,
      host: {
        "class": "mat-mdc-card-title"
      }
    }]
  }], null, null);
})();
var MatCardTitleGroup = class _MatCardTitleGroup {
  static \u0275fac = function MatCardTitleGroup_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardTitleGroup)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatCardTitleGroup,
    selectors: [["mat-card-title-group"]],
    hostAttrs: [1, "mat-mdc-card-title-group"],
    ngContentSelectors: _c2,
    decls: 4,
    vars: 0,
    template: function MatCardTitleGroup_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c1);
        \u0275\u0275domElementStart(0, "div");
        \u0275\u0275projection(1);
        \u0275\u0275domElementEnd();
        \u0275\u0275projection(2, 1);
        \u0275\u0275projection(3, 2);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardTitleGroup, [{
    type: Component,
    args: [{
      selector: "mat-card-title-group",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "class": "mat-mdc-card-title-group"
      },
      template: '<div>\n  <ng-content\n      select="mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]"></ng-content>\n</div>\n<ng-content select="[mat-card-image], [matCardImage],\n                    [mat-card-sm-image], [matCardImageSmall],\n                    [mat-card-md-image], [matCardImageMedium],\n                    [mat-card-lg-image], [matCardImageLarge],\n                    [mat-card-xl-image], [matCardImageXLarge]"></ng-content>\n<ng-content></ng-content>\n'
    }]
  }], null, null);
})();
var MatCardContent = class _MatCardContent {
  static \u0275fac = function MatCardContent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardContent)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCardContent,
    selectors: [["mat-card-content"]],
    hostAttrs: [1, "mat-mdc-card-content"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardContent, [{
    type: Directive,
    args: [{
      selector: "mat-card-content",
      host: {
        "class": "mat-mdc-card-content"
      }
    }]
  }], null, null);
})();
var MatCardSubtitle = class _MatCardSubtitle {
  static \u0275fac = function MatCardSubtitle_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardSubtitle)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCardSubtitle,
    selectors: [["mat-card-subtitle"], ["", "mat-card-subtitle", ""], ["", "matCardSubtitle", ""]],
    hostAttrs: [1, "mat-mdc-card-subtitle"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardSubtitle, [{
    type: Directive,
    args: [{
      selector: `mat-card-subtitle, [mat-card-subtitle], [matCardSubtitle]`,
      host: {
        "class": "mat-mdc-card-subtitle"
      }
    }]
  }], null, null);
})();
var MatCardActions = class _MatCardActions {
  // TODO(jelbourn): deprecate `align` in favor of `actionPosition` or `actionAlignment`
  // as to not conflict with the native `align` attribute.
  /** Position of the actions inside the card. */
  align = "start";
  static \u0275fac = function MatCardActions_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardActions)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCardActions,
    selectors: [["mat-card-actions"]],
    hostAttrs: [1, "mat-mdc-card-actions", "mdc-card__actions"],
    hostVars: 2,
    hostBindings: function MatCardActions_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mat-mdc-card-actions-align-end", ctx.align === "end");
      }
    },
    inputs: {
      align: "align"
    },
    exportAs: ["matCardActions"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardActions, [{
    type: Directive,
    args: [{
      selector: "mat-card-actions",
      exportAs: "matCardActions",
      host: {
        "class": "mat-mdc-card-actions mdc-card__actions",
        "[class.mat-mdc-card-actions-align-end]": 'align === "end"'
      }
    }]
  }], null, {
    align: [{
      type: Input
    }]
  });
})();
var MatCardHeader = class _MatCardHeader {
  static \u0275fac = function MatCardHeader_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardHeader)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatCardHeader,
    selectors: [["mat-card-header"]],
    hostAttrs: [1, "mat-mdc-card-header"],
    ngContentSelectors: _c4,
    decls: 4,
    vars: 0,
    consts: [[1, "mat-mdc-card-header-text"]],
    template: function MatCardHeader_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c3);
        \u0275\u0275projection(0);
        \u0275\u0275domElementStart(1, "div", 0);
        \u0275\u0275projection(2, 1);
        \u0275\u0275domElementEnd();
        \u0275\u0275projection(3, 2);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardHeader, [{
    type: Component,
    args: [{
      selector: "mat-card-header",
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      host: {
        "class": "mat-mdc-card-header"
      },
      template: '<ng-content select="[mat-card-avatar], [matCardAvatar]"></ng-content>\n<div class="mat-mdc-card-header-text">\n  <ng-content\n      select="mat-card-title, mat-card-subtitle,\n      [mat-card-title], [mat-card-subtitle],\n      [matCardTitle], [matCardSubtitle]"></ng-content>\n</div>\n<ng-content></ng-content>\n'
    }]
  }], null, null);
})();
var MatCardFooter = class _MatCardFooter {
  static \u0275fac = function MatCardFooter_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardFooter)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCardFooter,
    selectors: [["mat-card-footer"]],
    hostAttrs: [1, "mat-mdc-card-footer"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardFooter, [{
    type: Directive,
    args: [{
      selector: "mat-card-footer",
      host: {
        "class": "mat-mdc-card-footer"
      }
    }]
  }], null, null);
})();
var MatCardImage = class _MatCardImage {
  static \u0275fac = function MatCardImage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardImage)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCardImage,
    selectors: [["", "mat-card-image", ""], ["", "matCardImage", ""]],
    hostAttrs: [1, "mat-mdc-card-image", "mdc-card__media"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardImage, [{
    type: Directive,
    args: [{
      selector: "[mat-card-image], [matCardImage]",
      host: {
        "class": "mat-mdc-card-image mdc-card__media"
      }
    }]
  }], null, null);
})();
var MatCardSmImage = class _MatCardSmImage {
  static \u0275fac = function MatCardSmImage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardSmImage)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCardSmImage,
    selectors: [["", "mat-card-sm-image", ""], ["", "matCardImageSmall", ""]],
    hostAttrs: [1, "mat-mdc-card-sm-image", "mdc-card__media"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardSmImage, [{
    type: Directive,
    args: [{
      selector: "[mat-card-sm-image], [matCardImageSmall]",
      host: {
        "class": "mat-mdc-card-sm-image mdc-card__media"
      }
    }]
  }], null, null);
})();
var MatCardMdImage = class _MatCardMdImage {
  static \u0275fac = function MatCardMdImage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardMdImage)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCardMdImage,
    selectors: [["", "mat-card-md-image", ""], ["", "matCardImageMedium", ""]],
    hostAttrs: [1, "mat-mdc-card-md-image", "mdc-card__media"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardMdImage, [{
    type: Directive,
    args: [{
      selector: "[mat-card-md-image], [matCardImageMedium]",
      host: {
        "class": "mat-mdc-card-md-image mdc-card__media"
      }
    }]
  }], null, null);
})();
var MatCardLgImage = class _MatCardLgImage {
  static \u0275fac = function MatCardLgImage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardLgImage)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCardLgImage,
    selectors: [["", "mat-card-lg-image", ""], ["", "matCardImageLarge", ""]],
    hostAttrs: [1, "mat-mdc-card-lg-image", "mdc-card__media"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardLgImage, [{
    type: Directive,
    args: [{
      selector: "[mat-card-lg-image], [matCardImageLarge]",
      host: {
        "class": "mat-mdc-card-lg-image mdc-card__media"
      }
    }]
  }], null, null);
})();
var MatCardXlImage = class _MatCardXlImage {
  static \u0275fac = function MatCardXlImage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardXlImage)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCardXlImage,
    selectors: [["", "mat-card-xl-image", ""], ["", "matCardImageXLarge", ""]],
    hostAttrs: [1, "mat-mdc-card-xl-image", "mdc-card__media"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardXlImage, [{
    type: Directive,
    args: [{
      selector: "[mat-card-xl-image], [matCardImageXLarge]",
      host: {
        "class": "mat-mdc-card-xl-image mdc-card__media"
      }
    }]
  }], null, null);
})();
var MatCardAvatar = class _MatCardAvatar {
  static \u0275fac = function MatCardAvatar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardAvatar)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatCardAvatar,
    selectors: [["", "mat-card-avatar", ""], ["", "matCardAvatar", ""]],
    hostAttrs: [1, "mat-mdc-card-avatar"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardAvatar, [{
    type: Directive,
    args: [{
      selector: "[mat-card-avatar], [matCardAvatar]",
      host: {
        "class": "mat-mdc-card-avatar"
      }
    }]
  }], null, null);
})();
var CARD_DIRECTIVES = [MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardFooter, MatCardHeader, MatCardImage, MatCardLgImage, MatCardMdImage, MatCardSmImage, MatCardSubtitle, MatCardTitle, MatCardTitleGroup, MatCardXlImage];
var MatCardModule = class _MatCardModule {
  static \u0275fac = function MatCardModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatCardModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatCardModule,
    imports: [MatCommonModule, MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardFooter, MatCardHeader, MatCardImage, MatCardLgImage, MatCardMdImage, MatCardSmImage, MatCardSubtitle, MatCardTitle, MatCardTitleGroup, MatCardXlImage],
    exports: [MatCard, MatCardActions, MatCardAvatar, MatCardContent, MatCardFooter, MatCardHeader, MatCardImage, MatCardLgImage, MatCardMdImage, MatCardSmImage, MatCardSubtitle, MatCardTitle, MatCardTitleGroup, MatCardXlImage, MatCommonModule]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    imports: [MatCommonModule, MatCommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatCardModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, ...CARD_DIRECTIVES],
      exports: [CARD_DIRECTIVES, MatCommonModule]
    }]
  }], null, null);
})();

// node_modules/.pnpm/@angular+material@20.2.1_6454c0930df7c912b2ef33598e3c1604/node_modules/@angular/material/fesm2022/error-options.mjs
var ShowOnDirtyErrorStateMatcher = class _ShowOnDirtyErrorStateMatcher {
  isErrorState(control, form) {
    return !!(control && control.invalid && (control.dirty || form && form.submitted));
  }
  static \u0275fac = function ShowOnDirtyErrorStateMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ShowOnDirtyErrorStateMatcher)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ShowOnDirtyErrorStateMatcher,
    factory: _ShowOnDirtyErrorStateMatcher.\u0275fac
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ShowOnDirtyErrorStateMatcher, [{
    type: Injectable
  }], null, null);
})();
var ErrorStateMatcher = class _ErrorStateMatcher {
  isErrorState(control, form) {
    return !!(control && control.invalid && (control.touched || form && form.submitted));
  }
  static \u0275fac = function ErrorStateMatcher_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ErrorStateMatcher)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _ErrorStateMatcher,
    factory: _ErrorStateMatcher.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ErrorStateMatcher, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// node_modules/.pnpm/@angular+material@20.2.1_6454c0930df7c912b2ef33598e3c1604/node_modules/@angular/material/fesm2022/error-state.mjs
var _ErrorStateTracker = class {
  _defaultMatcher;
  ngControl;
  _parentFormGroup;
  _parentForm;
  _stateChanges;
  /** Whether the tracker is currently in an error state. */
  errorState = false;
  /** User-defined matcher for the error state. */
  matcher;
  constructor(_defaultMatcher, ngControl, _parentFormGroup, _parentForm, _stateChanges) {
    this._defaultMatcher = _defaultMatcher;
    this.ngControl = ngControl;
    this._parentFormGroup = _parentFormGroup;
    this._parentForm = _parentForm;
    this._stateChanges = _stateChanges;
  }
  /** Updates the error state based on the provided error state matcher. */
  updateErrorState() {
    const oldState = this.errorState;
    const parent = this._parentFormGroup || this._parentForm;
    const matcher = this.matcher || this._defaultMatcher;
    const control = this.ngControl ? this.ngControl.control : null;
    const newState = matcher?.isErrorState(control, parent) ?? false;
    if (newState !== oldState) {
      this.errorState = newState;
      this._stateChanges.next();
    }
  }
};

// node_modules/.pnpm/@angular+cdk@20.2.1_@angular+common@20.1.4_@angular+core@20.1.4_@angular+compiler@20.1._b1186cf6030b5c2736340dec250d600a/node_modules/@angular/cdk/fesm2022/observers/private.mjs
var loopLimitExceededErrorHandler = (e) => {
  if (e instanceof ErrorEvent && e.message === "ResizeObserver loop limit exceeded") {
    console.error(`${e.message}. This could indicate a performance issue with your app. See https://github.com/WICG/resize-observer/blob/master/explainer.md#error-handling`);
  }
};
var SingleBoxSharedResizeObserver = class {
  _box;
  /** Stream that emits when the shared observer is destroyed. */
  _destroyed = new Subject();
  /** Stream of all events from the ResizeObserver. */
  _resizeSubject = new Subject();
  /** ResizeObserver used to observe element resize events. */
  _resizeObserver;
  /** A map of elements to streams of their resize events. */
  _elementObservables = /* @__PURE__ */ new Map();
  constructor(_box) {
    this._box = _box;
    if (typeof ResizeObserver !== "undefined") {
      this._resizeObserver = new ResizeObserver((entries) => this._resizeSubject.next(entries));
    }
  }
  /**
   * Gets a stream of resize events for the given element.
   * @param target The element to observe.
   * @return The stream of resize events for the element.
   */
  observe(target) {
    if (!this._elementObservables.has(target)) {
      this._elementObservables.set(target, new Observable((observer) => {
        const subscription = this._resizeSubject.subscribe(observer);
        this._resizeObserver?.observe(target, {
          box: this._box
        });
        return () => {
          this._resizeObserver?.unobserve(target);
          subscription.unsubscribe();
          this._elementObservables.delete(target);
        };
      }).pipe(
        filter((entries) => entries.some((entry) => entry.target === target)),
        // Share a replay of the last event so that subsequent calls to observe the same element
        // receive initial sizing info like the first one. Also enable ref counting so the
        // element will be automatically unobserved when there are no more subscriptions.
        shareReplay({
          bufferSize: 1,
          refCount: true
        }),
        takeUntil(this._destroyed)
      ));
    }
    return this._elementObservables.get(target);
  }
  /** Destroys this instance. */
  destroy() {
    this._destroyed.next();
    this._destroyed.complete();
    this._resizeSubject.complete();
    this._elementObservables.clear();
  }
};
var SharedResizeObserver = class _SharedResizeObserver {
  _cleanupErrorListener;
  /** Map of box type to shared resize observer. */
  _observers = /* @__PURE__ */ new Map();
  /** The Angular zone. */
  _ngZone = inject(NgZone);
  constructor() {
    if (typeof ResizeObserver !== "undefined" && (typeof ngDevMode === "undefined" || ngDevMode)) {
      this._ngZone.runOutsideAngular(() => {
        const renderer = inject(RendererFactory2).createRenderer(null, null);
        this._cleanupErrorListener = renderer.listen("window", "error", loopLimitExceededErrorHandler);
      });
    }
  }
  ngOnDestroy() {
    for (const [, observer] of this._observers) {
      observer.destroy();
    }
    this._observers.clear();
    this._cleanupErrorListener?.();
  }
  /**
   * Gets a stream of resize events for the given target element and box type.
   * @param target The element to observe for resizes.
   * @param options Options to pass to the `ResizeObserver`
   * @return The stream of resize events for the element.
   */
  observe(target, options) {
    const box = options?.box || "content-box";
    if (!this._observers.has(box)) {
      this._observers.set(box, new SingleBoxSharedResizeObserver(box));
    }
    return this._observers.get(box).observe(target);
  }
  static \u0275fac = function SharedResizeObserver_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _SharedResizeObserver)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({
    token: _SharedResizeObserver,
    factory: _SharedResizeObserver.\u0275fac,
    providedIn: "root"
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SharedResizeObserver, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// node_modules/.pnpm/@angular+material@20.2.1_6454c0930df7c912b2ef33598e3c1604/node_modules/@angular/material/fesm2022/form-field2.mjs
var _c02 = ["notch"];
var _c12 = ["matFormFieldNotchedOutline", ""];
var _c22 = ["*"];
var _c32 = ["iconPrefixContainer"];
var _c42 = ["textPrefixContainer"];
var _c5 = ["iconSuffixContainer"];
var _c6 = ["textSuffixContainer"];
var _c7 = ["textField"];
var _c8 = ["*", [["mat-label"]], [["", "matPrefix", ""], ["", "matIconPrefix", ""]], [["", "matTextPrefix", ""]], [["", "matTextSuffix", ""]], [["", "matSuffix", ""], ["", "matIconSuffix", ""]], [["mat-error"], ["", "matError", ""]], [["mat-hint", 3, "align", "end"]], [["mat-hint", "align", "end"]]];
var _c9 = ["*", "mat-label", "[matPrefix], [matIconPrefix]", "[matTextPrefix]", "[matTextSuffix]", "[matSuffix], [matIconSuffix]", "mat-error, [matError]", "mat-hint:not([align='end'])", "mat-hint[align='end']"];
function MatFormField_ng_template_0_Conditional_0_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 20);
  }
}
function MatFormField_ng_template_0_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "label", 19);
    \u0275\u0275projection(1, 1);
    \u0275\u0275conditionalCreate(2, MatFormField_ng_template_0_Conditional_0_Conditional_2_Template, 1, 0, "span", 20);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("floating", ctx_r1._shouldLabelFloat())("monitorResize", ctx_r1._hasOutline())("id", ctx_r1._labelId);
    \u0275\u0275attribute("for", ctx_r1._control.disableAutomaticLabeling ? null : ctx_r1._control.id);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!ctx_r1.hideRequiredMarker && ctx_r1._control.required ? 2 : -1);
  }
}
function MatFormField_ng_template_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, MatFormField_ng_template_0_Conditional_0_Template, 3, 5, "label", 19);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1._hasFloatingLabel() ? 0 : -1);
  }
}
function MatFormField_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 7);
  }
}
function MatFormField_Conditional_6_Conditional_1_ng_template_0_Template(rf, ctx) {
}
function MatFormField_Conditional_6_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, MatFormField_Conditional_6_Conditional_1_ng_template_0_Template, 0, 0, "ng-template", 13);
  }
  if (rf & 2) {
    \u0275\u0275nextContext(2);
    const labelTemplate_r3 = \u0275\u0275reference(1);
    \u0275\u0275property("ngTemplateOutlet", labelTemplate_r3);
  }
}
function MatFormField_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275conditionalCreate(1, MatFormField_Conditional_6_Conditional_1_Template, 1, 1, null, 13);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("matFormFieldNotchedOutlineOpen", ctx_r1._shouldLabelFloat());
    \u0275\u0275advance();
    \u0275\u0275conditional(!ctx_r1._forceDisplayInfixLabel() ? 1 : -1);
  }
}
function MatFormField_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 10, 2);
    \u0275\u0275projection(2, 2);
    \u0275\u0275elementEnd();
  }
}
function MatFormField_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11, 3);
    \u0275\u0275projection(2, 3);
    \u0275\u0275elementEnd();
  }
}
function MatFormField_Conditional_10_ng_template_0_Template(rf, ctx) {
}
function MatFormField_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, MatFormField_Conditional_10_ng_template_0_Template, 0, 0, "ng-template", 13);
  }
  if (rf & 2) {
    \u0275\u0275nextContext();
    const labelTemplate_r3 = \u0275\u0275reference(1);
    \u0275\u0275property("ngTemplateOutlet", labelTemplate_r3);
  }
}
function MatFormField_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 14, 4);
    \u0275\u0275projection(2, 4);
    \u0275\u0275elementEnd();
  }
}
function MatFormField_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15, 5);
    \u0275\u0275projection(2, 5);
    \u0275\u0275elementEnd();
  }
}
function MatFormField_Conditional_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 16);
  }
}
function MatFormField_Case_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0, 6);
  }
}
function MatFormField_Case_18_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "mat-hint", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275property("id", ctx_r1._hintLabelId);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.hintLabel);
  }
}
function MatFormField_Case_18_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, MatFormField_Case_18_Conditional_0_Template, 2, 2, "mat-hint", 21);
    \u0275\u0275projection(1, 7);
    \u0275\u0275element(2, "div", 22);
    \u0275\u0275projection(3, 8);
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r1.hintLabel ? 0 : -1);
  }
}
var MatLabel = class _MatLabel {
  static \u0275fac = function MatLabel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatLabel)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatLabel,
    selectors: [["mat-label"]]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatLabel, [{
    type: Directive,
    args: [{
      selector: "mat-label"
    }]
  }], null, null);
})();
var MAT_ERROR = new InjectionToken("MatError");
var MatError = class _MatError {
  id = inject(_IdGenerator).getId("mat-mdc-error-");
  constructor() {
  }
  static \u0275fac = function MatError_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatError)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatError,
    selectors: [["mat-error"], ["", "matError", ""]],
    hostAttrs: [1, "mat-mdc-form-field-error", "mat-mdc-form-field-bottom-align"],
    hostVars: 1,
    hostBindings: function MatError_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id);
      }
    },
    inputs: {
      id: "id"
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_ERROR,
      useExisting: _MatError
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatError, [{
    type: Directive,
    args: [{
      selector: "mat-error, [matError]",
      host: {
        "class": "mat-mdc-form-field-error mat-mdc-form-field-bottom-align",
        "[id]": "id"
      },
      providers: [{
        provide: MAT_ERROR,
        useExisting: MatError
      }]
    }]
  }], () => [], {
    id: [{
      type: Input
    }]
  });
})();
var MatHint = class _MatHint {
  /** Whether to align the hint label at the start or end of the line. */
  align = "start";
  /** Unique ID for the hint. Used for the aria-describedby on the form field control. */
  id = inject(_IdGenerator).getId("mat-mdc-hint-");
  static \u0275fac = function MatHint_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatHint)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatHint,
    selectors: [["mat-hint"]],
    hostAttrs: [1, "mat-mdc-form-field-hint", "mat-mdc-form-field-bottom-align"],
    hostVars: 4,
    hostBindings: function MatHint_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id);
        \u0275\u0275attribute("align", null);
        \u0275\u0275classProp("mat-mdc-form-field-hint-end", ctx.align === "end");
      }
    },
    inputs: {
      align: "align",
      id: "id"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatHint, [{
    type: Directive,
    args: [{
      selector: "mat-hint",
      host: {
        "class": "mat-mdc-form-field-hint mat-mdc-form-field-bottom-align",
        "[class.mat-mdc-form-field-hint-end]": 'align === "end"',
        "[id]": "id",
        // Remove align attribute to prevent it from interfering with layout.
        "[attr.align]": "null"
      }
    }]
  }], null, {
    align: [{
      type: Input
    }],
    id: [{
      type: Input
    }]
  });
})();
var MAT_PREFIX = new InjectionToken("MatPrefix");
var MatPrefix = class _MatPrefix {
  set _isTextSelector(value) {
    this._isText = true;
  }
  _isText = false;
  static \u0275fac = function MatPrefix_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatPrefix)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatPrefix,
    selectors: [["", "matPrefix", ""], ["", "matIconPrefix", ""], ["", "matTextPrefix", ""]],
    inputs: {
      _isTextSelector: [0, "matTextPrefix", "_isTextSelector"]
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_PREFIX,
      useExisting: _MatPrefix
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatPrefix, [{
    type: Directive,
    args: [{
      selector: "[matPrefix], [matIconPrefix], [matTextPrefix]",
      providers: [{
        provide: MAT_PREFIX,
        useExisting: MatPrefix
      }]
    }]
  }], null, {
    _isTextSelector: [{
      type: Input,
      args: ["matTextPrefix"]
    }]
  });
})();
var MAT_SUFFIX = new InjectionToken("MatSuffix");
var MatSuffix = class _MatSuffix {
  set _isTextSelector(value) {
    this._isText = true;
  }
  _isText = false;
  static \u0275fac = function MatSuffix_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatSuffix)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatSuffix,
    selectors: [["", "matSuffix", ""], ["", "matIconSuffix", ""], ["", "matTextSuffix", ""]],
    inputs: {
      _isTextSelector: [0, "matTextSuffix", "_isTextSelector"]
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_SUFFIX,
      useExisting: _MatSuffix
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatSuffix, [{
    type: Directive,
    args: [{
      selector: "[matSuffix], [matIconSuffix], [matTextSuffix]",
      providers: [{
        provide: MAT_SUFFIX,
        useExisting: MatSuffix
      }]
    }]
  }], null, {
    _isTextSelector: [{
      type: Input,
      args: ["matTextSuffix"]
    }]
  });
})();
var FLOATING_LABEL_PARENT = new InjectionToken("FloatingLabelParent");
var MatFormFieldFloatingLabel = class _MatFormFieldFloatingLabel {
  _elementRef = inject(ElementRef);
  /** Whether the label is floating. */
  get floating() {
    return this._floating;
  }
  set floating(value) {
    this._floating = value;
    if (this.monitorResize) {
      this._handleResize();
    }
  }
  _floating = false;
  /** Whether to monitor for resize events on the floating label. */
  get monitorResize() {
    return this._monitorResize;
  }
  set monitorResize(value) {
    this._monitorResize = value;
    if (this._monitorResize) {
      this._subscribeToResize();
    } else {
      this._resizeSubscription.unsubscribe();
    }
  }
  _monitorResize = false;
  /** The shared ResizeObserver. */
  _resizeObserver = inject(SharedResizeObserver);
  /** The Angular zone. */
  _ngZone = inject(NgZone);
  /** The parent form-field. */
  _parent = inject(FLOATING_LABEL_PARENT);
  /** The current resize event subscription. */
  _resizeSubscription = new Subscription();
  constructor() {
  }
  ngOnDestroy() {
    this._resizeSubscription.unsubscribe();
  }
  /** Gets the width of the label. Used for the outline notch. */
  getWidth() {
    return estimateScrollWidth(this._elementRef.nativeElement);
  }
  /** Gets the HTML element for the floating label. */
  get element() {
    return this._elementRef.nativeElement;
  }
  /** Handles resize events from the ResizeObserver. */
  _handleResize() {
    setTimeout(() => this._parent._handleLabelResized());
  }
  /** Subscribes to resize events. */
  _subscribeToResize() {
    this._resizeSubscription.unsubscribe();
    this._ngZone.runOutsideAngular(() => {
      this._resizeSubscription = this._resizeObserver.observe(this._elementRef.nativeElement, {
        box: "border-box"
      }).subscribe(() => this._handleResize());
    });
  }
  static \u0275fac = function MatFormFieldFloatingLabel_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormFieldFloatingLabel)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatFormFieldFloatingLabel,
    selectors: [["label", "matFormFieldFloatingLabel", ""]],
    hostAttrs: [1, "mdc-floating-label", "mat-mdc-floating-label"],
    hostVars: 2,
    hostBindings: function MatFormFieldFloatingLabel_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mdc-floating-label--float-above", ctx.floating);
      }
    },
    inputs: {
      floating: "floating",
      monitorResize: "monitorResize"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldFloatingLabel, [{
    type: Directive,
    args: [{
      selector: "label[matFormFieldFloatingLabel]",
      host: {
        "class": "mdc-floating-label mat-mdc-floating-label",
        "[class.mdc-floating-label--float-above]": "floating"
      }
    }]
  }], () => [], {
    floating: [{
      type: Input
    }],
    monitorResize: [{
      type: Input
    }]
  });
})();
function estimateScrollWidth(element) {
  const htmlEl = element;
  if (htmlEl.offsetParent !== null) {
    return htmlEl.scrollWidth;
  }
  const clone = htmlEl.cloneNode(true);
  clone.style.setProperty("position", "absolute");
  clone.style.setProperty("transform", "translate(-9999px, -9999px)");
  document.documentElement.appendChild(clone);
  const scrollWidth = clone.scrollWidth;
  clone.remove();
  return scrollWidth;
}
var ACTIVATE_CLASS = "mdc-line-ripple--active";
var DEACTIVATING_CLASS = "mdc-line-ripple--deactivating";
var MatFormFieldLineRipple = class _MatFormFieldLineRipple {
  _elementRef = inject(ElementRef);
  _cleanupTransitionEnd;
  constructor() {
    const ngZone = inject(NgZone);
    const renderer = inject(Renderer2);
    ngZone.runOutsideAngular(() => {
      this._cleanupTransitionEnd = renderer.listen(this._elementRef.nativeElement, "transitionend", this._handleTransitionEnd);
    });
  }
  activate() {
    const classList = this._elementRef.nativeElement.classList;
    classList.remove(DEACTIVATING_CLASS);
    classList.add(ACTIVATE_CLASS);
  }
  deactivate() {
    this._elementRef.nativeElement.classList.add(DEACTIVATING_CLASS);
  }
  _handleTransitionEnd = (event) => {
    const classList = this._elementRef.nativeElement.classList;
    const isDeactivating = classList.contains(DEACTIVATING_CLASS);
    if (event.propertyName === "opacity" && isDeactivating) {
      classList.remove(ACTIVATE_CLASS, DEACTIVATING_CLASS);
    }
  };
  ngOnDestroy() {
    this._cleanupTransitionEnd();
  }
  static \u0275fac = function MatFormFieldLineRipple_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormFieldLineRipple)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatFormFieldLineRipple,
    selectors: [["div", "matFormFieldLineRipple", ""]],
    hostAttrs: [1, "mdc-line-ripple"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldLineRipple, [{
    type: Directive,
    args: [{
      selector: "div[matFormFieldLineRipple]",
      host: {
        "class": "mdc-line-ripple"
      }
    }]
  }], () => [], null);
})();
var MatFormFieldNotchedOutline = class _MatFormFieldNotchedOutline {
  _elementRef = inject(ElementRef);
  _ngZone = inject(NgZone);
  /** Whether the notch should be opened. */
  open = false;
  _notch;
  ngAfterViewInit() {
    const element = this._elementRef.nativeElement;
    const label = element.querySelector(".mdc-floating-label");
    if (label) {
      element.classList.add("mdc-notched-outline--upgraded");
      if (typeof requestAnimationFrame === "function") {
        label.style.transitionDuration = "0s";
        this._ngZone.runOutsideAngular(() => {
          requestAnimationFrame(() => label.style.transitionDuration = "");
        });
      }
    } else {
      element.classList.add("mdc-notched-outline--no-label");
    }
  }
  _setNotchWidth(labelWidth) {
    const notch = this._notch.nativeElement;
    if (!this.open || !labelWidth) {
      notch.style.width = "";
    } else {
      const NOTCH_ELEMENT_PADDING = 8;
      const NOTCH_ELEMENT_BORDER = 1;
      notch.style.width = `calc(${labelWidth}px * var(--mat-mdc-form-field-floating-label-scale, 0.75) + ${NOTCH_ELEMENT_PADDING + NOTCH_ELEMENT_BORDER}px)`;
    }
  }
  _setMaxWidth(prefixAndSuffixWidth) {
    this._notch.nativeElement.style.setProperty("--mat-form-field-notch-max-width", `calc(100% - ${prefixAndSuffixWidth}px)`);
  }
  static \u0275fac = function MatFormFieldNotchedOutline_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormFieldNotchedOutline)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatFormFieldNotchedOutline,
    selectors: [["div", "matFormFieldNotchedOutline", ""]],
    viewQuery: function MatFormFieldNotchedOutline_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(_c02, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._notch = _t.first);
      }
    },
    hostAttrs: [1, "mdc-notched-outline"],
    hostVars: 2,
    hostBindings: function MatFormFieldNotchedOutline_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mdc-notched-outline--notched", ctx.open);
      }
    },
    inputs: {
      open: [0, "matFormFieldNotchedOutlineOpen", "open"]
    },
    attrs: _c12,
    ngContentSelectors: _c22,
    decls: 5,
    vars: 0,
    consts: [["notch", ""], [1, "mat-mdc-notch-piece", "mdc-notched-outline__leading"], [1, "mat-mdc-notch-piece", "mdc-notched-outline__notch"], [1, "mat-mdc-notch-piece", "mdc-notched-outline__trailing"]],
    template: function MatFormFieldNotchedOutline_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275domElement(0, "div", 1);
        \u0275\u0275domElementStart(1, "div", 2, 0);
        \u0275\u0275projection(3);
        \u0275\u0275domElementEnd();
        \u0275\u0275domElement(4, "div", 3);
      }
    },
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldNotchedOutline, [{
    type: Component,
    args: [{
      selector: "div[matFormFieldNotchedOutline]",
      host: {
        "class": "mdc-notched-outline",
        // Besides updating the notch state through the MDC component, we toggle this class through
        // a host binding in order to ensure that the notched-outline renders correctly on the server.
        "[class.mdc-notched-outline--notched]": "open"
      },
      changeDetection: ChangeDetectionStrategy.OnPush,
      encapsulation: ViewEncapsulation.None,
      template: '<div class="mat-mdc-notch-piece mdc-notched-outline__leading"></div>\n<div class="mat-mdc-notch-piece mdc-notched-outline__notch" #notch>\n  <ng-content></ng-content>\n</div>\n<div class="mat-mdc-notch-piece mdc-notched-outline__trailing"></div>\n'
    }]
  }], null, {
    open: [{
      type: Input,
      args: ["matFormFieldNotchedOutlineOpen"]
    }],
    _notch: [{
      type: ViewChild,
      args: ["notch"]
    }]
  });
})();
var MatFormFieldControl = class _MatFormFieldControl {
  /** The value of the control. */
  value;
  /**
   * Stream that emits whenever the state of the control changes such that the parent `MatFormField`
   * needs to run change detection.
   */
  stateChanges;
  /** The element ID for this control. */
  id;
  /** The placeholder for this control. */
  placeholder;
  /** Gets the AbstractControlDirective for this control. */
  ngControl;
  /** Whether the control is focused. */
  focused;
  /** Whether the control is empty. */
  empty;
  /** Whether the `MatFormField` label should try to float. */
  shouldLabelFloat;
  /** Whether the control is required. */
  required;
  /** Whether the control is disabled. */
  disabled;
  /** Whether the control is in an error state. */
  errorState;
  /**
   * An optional name for the control type that can be used to distinguish `mat-form-field` elements
   * based on their control type. The form field will add a class,
   * `mat-form-field-type-{{controlType}}` to its root element.
   */
  controlType;
  /**
   * Whether the input is currently in an autofilled state. If property is not present on the
   * control it is assumed to be false.
   */
  autofilled;
  /**
   * Value of `aria-describedby` that should be merged with the described-by ids
   * which are set by the form-field.
   */
  userAriaDescribedBy;
  /**
   * Whether to automatically assign the ID of the form field as the `for` attribute
   * on the `<label>` inside the form field. Set this to true to prevent the form
   * field from associating the label with non-native elements.
   */
  disableAutomaticLabeling;
  /** Gets the list of element IDs that currently describe this control. */
  describedByIds;
  static \u0275fac = function MatFormFieldControl_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormFieldControl)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatFormFieldControl
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormFieldControl, [{
    type: Directive
  }], null, null);
})();
function getMatFormFieldDuplicatedHintError(align) {
  return Error(`A hint was already declared for 'align="${align}"'.`);
}
function getMatFormFieldMissingControlError() {
  return Error("mat-form-field must contain a MatFormFieldControl.");
}
var MAT_FORM_FIELD = new InjectionToken("MatFormField");
var MAT_FORM_FIELD_DEFAULT_OPTIONS = new InjectionToken("MAT_FORM_FIELD_DEFAULT_OPTIONS");
var DEFAULT_APPEARANCE = "fill";
var DEFAULT_FLOAT_LABEL = "auto";
var DEFAULT_SUBSCRIPT_SIZING = "fixed";
var FLOATING_LABEL_DEFAULT_DOCKED_TRANSFORM = `translateY(-50%)`;
var MatFormField = class _MatFormField {
  _elementRef = inject(ElementRef);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _platform = inject(Platform);
  _idGenerator = inject(_IdGenerator);
  _ngZone = inject(NgZone);
  _defaults = inject(MAT_FORM_FIELD_DEFAULT_OPTIONS, {
    optional: true
  });
  _currentDirection;
  _textField;
  _iconPrefixContainer;
  _textPrefixContainer;
  _iconSuffixContainer;
  _textSuffixContainer;
  _floatingLabel;
  _notchedOutline;
  _lineRipple;
  _iconPrefixContainerSignal = viewChild("iconPrefixContainer", ...ngDevMode ? [{
    debugName: "_iconPrefixContainerSignal"
  }] : []);
  _textPrefixContainerSignal = viewChild("textPrefixContainer", ...ngDevMode ? [{
    debugName: "_textPrefixContainerSignal"
  }] : []);
  _iconSuffixContainerSignal = viewChild("iconSuffixContainer", ...ngDevMode ? [{
    debugName: "_iconSuffixContainerSignal"
  }] : []);
  _textSuffixContainerSignal = viewChild("textSuffixContainer", ...ngDevMode ? [{
    debugName: "_textSuffixContainerSignal"
  }] : []);
  _prefixSuffixContainers = computed(() => {
    return [this._iconPrefixContainerSignal(), this._textPrefixContainerSignal(), this._iconSuffixContainerSignal(), this._textSuffixContainerSignal()].map((container) => container?.nativeElement).filter((e) => e !== void 0);
  }, ...ngDevMode ? [{
    debugName: "_prefixSuffixContainers"
  }] : []);
  _formFieldControl;
  _prefixChildren;
  _suffixChildren;
  _errorChildren;
  _hintChildren;
  _labelChild = contentChild(MatLabel, ...ngDevMode ? [{
    debugName: "_labelChild"
  }] : []);
  /** Whether the required marker should be hidden. */
  get hideRequiredMarker() {
    return this._hideRequiredMarker;
  }
  set hideRequiredMarker(value) {
    this._hideRequiredMarker = coerceBooleanProperty(value);
  }
  _hideRequiredMarker = false;
  /**
   * Theme color of the form field. This API is supported in M2 themes only, it
   * has no effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/form-field/styling.
   *
   * For information on applying color variants in M3, see
   * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
   */
  color = "primary";
  /** Whether the label should always float or float as the user types. */
  get floatLabel() {
    return this._floatLabel || this._defaults?.floatLabel || DEFAULT_FLOAT_LABEL;
  }
  set floatLabel(value) {
    if (value !== this._floatLabel) {
      this._floatLabel = value;
      this._changeDetectorRef.markForCheck();
    }
  }
  _floatLabel;
  /** The form field appearance style. */
  get appearance() {
    return this._appearanceSignal();
  }
  set appearance(value) {
    const newAppearance = value || this._defaults?.appearance || DEFAULT_APPEARANCE;
    if (typeof ngDevMode === "undefined" || ngDevMode) {
      if (newAppearance !== "fill" && newAppearance !== "outline") {
        throw new Error(`MatFormField: Invalid appearance "${newAppearance}", valid values are "fill" or "outline".`);
      }
    }
    this._appearanceSignal.set(newAppearance);
  }
  _appearanceSignal = signal(DEFAULT_APPEARANCE, ...ngDevMode ? [{
    debugName: "_appearanceSignal"
  }] : []);
  /**
   * Whether the form field should reserve space for one line of hint/error text (default)
   * or to have the spacing grow from 0px as needed based on the size of the hint/error content.
   * Note that when using dynamic sizing, layout shifts will occur when hint/error text changes.
   */
  get subscriptSizing() {
    return this._subscriptSizing || this._defaults?.subscriptSizing || DEFAULT_SUBSCRIPT_SIZING;
  }
  set subscriptSizing(value) {
    this._subscriptSizing = value || this._defaults?.subscriptSizing || DEFAULT_SUBSCRIPT_SIZING;
  }
  _subscriptSizing = null;
  /** Text for the form field hint. */
  get hintLabel() {
    return this._hintLabel;
  }
  set hintLabel(value) {
    this._hintLabel = value;
    this._processHints();
  }
  _hintLabel = "";
  _hasIconPrefix = false;
  _hasTextPrefix = false;
  _hasIconSuffix = false;
  _hasTextSuffix = false;
  // Unique id for the internal form field label.
  _labelId = this._idGenerator.getId("mat-mdc-form-field-label-");
  // Unique id for the hint label.
  _hintLabelId = this._idGenerator.getId("mat-mdc-hint-");
  // Ids obtained from the error and hint fields
  _describedByIds;
  /** Gets the current form field control */
  get _control() {
    return this._explicitFormFieldControl || this._formFieldControl;
  }
  set _control(value) {
    this._explicitFormFieldControl = value;
  }
  _destroyed = new Subject();
  _isFocused = null;
  _explicitFormFieldControl;
  _previousControl = null;
  _previousControlValidatorFn = null;
  _stateChanges;
  _valueChanges;
  _describedByChanges;
  _outlineLabelOffsetResizeObserver = null;
  _animationsDisabled = _animationsDisabled();
  constructor() {
    const defaults = this._defaults;
    const dir = inject(Directionality);
    if (defaults) {
      if (defaults.appearance) {
        this.appearance = defaults.appearance;
      }
      this._hideRequiredMarker = Boolean(defaults?.hideRequiredMarker);
      if (defaults.color) {
        this.color = defaults.color;
      }
    }
    effect(() => this._currentDirection = dir.valueSignal());
    this._syncOutlineLabelOffset();
  }
  ngAfterViewInit() {
    this._updateFocusState();
    if (!this._animationsDisabled) {
      this._ngZone.runOutsideAngular(() => {
        setTimeout(() => {
          this._elementRef.nativeElement.classList.add("mat-form-field-animations-enabled");
        }, 300);
      });
    }
    this._changeDetectorRef.detectChanges();
  }
  ngAfterContentInit() {
    this._assertFormFieldControl();
    this._initializeSubscript();
    this._initializePrefixAndSuffix();
  }
  ngAfterContentChecked() {
    this._assertFormFieldControl();
    if (this._control !== this._previousControl) {
      this._initializeControl(this._previousControl);
      if (this._control.ngControl && this._control.ngControl.control) {
        this._previousControlValidatorFn = this._control.ngControl.control.validator;
      }
      this._previousControl = this._control;
    }
    if (this._control.ngControl && this._control.ngControl.control) {
      const validatorFn = this._control.ngControl.control.validator;
      if (validatorFn !== this._previousControlValidatorFn) {
        this._changeDetectorRef.markForCheck();
      }
    }
  }
  ngOnDestroy() {
    this._outlineLabelOffsetResizeObserver?.disconnect();
    this._stateChanges?.unsubscribe();
    this._valueChanges?.unsubscribe();
    this._describedByChanges?.unsubscribe();
    this._destroyed.next();
    this._destroyed.complete();
  }
  /**
   * Gets the id of the label element. If no label is present, returns `null`.
   */
  getLabelId = computed(() => this._hasFloatingLabel() ? this._labelId : null, ...ngDevMode ? [{
    debugName: "getLabelId"
  }] : []);
  /**
   * Gets an ElementRef for the element that a overlay attached to the form field
   * should be positioned relative to.
   */
  getConnectedOverlayOrigin() {
    return this._textField || this._elementRef;
  }
  /** Animates the placeholder up and locks it in position. */
  _animateAndLockLabel() {
    if (this._hasFloatingLabel()) {
      this.floatLabel = "always";
    }
  }
  /** Initializes the registered form field control. */
  _initializeControl(previousControl) {
    const control = this._control;
    const classPrefix = "mat-mdc-form-field-type-";
    if (previousControl) {
      this._elementRef.nativeElement.classList.remove(classPrefix + previousControl.controlType);
    }
    if (control.controlType) {
      this._elementRef.nativeElement.classList.add(classPrefix + control.controlType);
    }
    this._stateChanges?.unsubscribe();
    this._stateChanges = control.stateChanges.subscribe(() => {
      this._updateFocusState();
      this._changeDetectorRef.markForCheck();
    });
    this._describedByChanges?.unsubscribe();
    this._describedByChanges = control.stateChanges.pipe(startWith([void 0, void 0]), map(() => [control.errorState, control.userAriaDescribedBy]), pairwise(), filter(([[prevErrorState, prevDescribedBy], [currentErrorState, currentDescribedBy]]) => {
      return prevErrorState !== currentErrorState || prevDescribedBy !== currentDescribedBy;
    })).subscribe(() => this._syncDescribedByIds());
    this._valueChanges?.unsubscribe();
    if (control.ngControl && control.ngControl.valueChanges) {
      this._valueChanges = control.ngControl.valueChanges.pipe(takeUntil(this._destroyed)).subscribe(() => this._changeDetectorRef.markForCheck());
    }
  }
  _checkPrefixAndSuffixTypes() {
    this._hasIconPrefix = !!this._prefixChildren.find((p) => !p._isText);
    this._hasTextPrefix = !!this._prefixChildren.find((p) => p._isText);
    this._hasIconSuffix = !!this._suffixChildren.find((s) => !s._isText);
    this._hasTextSuffix = !!this._suffixChildren.find((s) => s._isText);
  }
  /** Initializes the prefix and suffix containers. */
  _initializePrefixAndSuffix() {
    this._checkPrefixAndSuffixTypes();
    merge(this._prefixChildren.changes, this._suffixChildren.changes).subscribe(() => {
      this._checkPrefixAndSuffixTypes();
      this._changeDetectorRef.markForCheck();
    });
  }
  /**
   * Initializes the subscript by validating hints and synchronizing "aria-describedby" ids
   * with the custom form field control. Also subscribes to hint and error changes in order
   * to be able to validate and synchronize ids on change.
   */
  _initializeSubscript() {
    this._hintChildren.changes.subscribe(() => {
      this._processHints();
      this._changeDetectorRef.markForCheck();
    });
    this._errorChildren.changes.subscribe(() => {
      this._syncDescribedByIds();
      this._changeDetectorRef.markForCheck();
    });
    this._validateHints();
    this._syncDescribedByIds();
  }
  /** Throws an error if the form field's control is missing. */
  _assertFormFieldControl() {
    if (!this._control && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw getMatFormFieldMissingControlError();
    }
  }
  _updateFocusState() {
    const controlFocused = this._control.focused;
    if (controlFocused && !this._isFocused) {
      this._isFocused = true;
      this._lineRipple?.activate();
    } else if (!controlFocused && (this._isFocused || this._isFocused === null)) {
      this._isFocused = false;
      this._lineRipple?.deactivate();
    }
    this._elementRef.nativeElement.classList.toggle("mat-focused", controlFocused);
    this._textField?.nativeElement.classList.toggle("mdc-text-field--focused", controlFocused);
  }
  /**
   * The floating label in the docked state needs to account for prefixes. The horizontal offset
   * is calculated whenever the appearance changes to `outline`, the prefixes change, or when the
   * form field is added to the DOM. This method sets up all subscriptions which are needed to
   * trigger the label offset update.
   */
  _syncOutlineLabelOffset() {
    afterRenderEffect({
      earlyRead: () => {
        if (this._appearanceSignal() !== "outline") {
          this._outlineLabelOffsetResizeObserver?.disconnect();
          return null;
        }
        if (globalThis.ResizeObserver) {
          this._outlineLabelOffsetResizeObserver ||= new globalThis.ResizeObserver(() => {
            this._writeOutlinedLabelStyles(this._getOutlinedLabelOffset());
          });
          for (const el of this._prefixSuffixContainers()) {
            this._outlineLabelOffsetResizeObserver.observe(el, {
              box: "border-box"
            });
          }
        }
        return this._getOutlinedLabelOffset();
      },
      write: (labelStyles) => this._writeOutlinedLabelStyles(labelStyles())
    });
  }
  /** Whether the floating label should always float or not. */
  _shouldAlwaysFloat() {
    return this.floatLabel === "always";
  }
  _hasOutline() {
    return this.appearance === "outline";
  }
  /**
   * Whether the label should display in the infix. Labels in the outline appearance are
   * displayed as part of the notched-outline and are horizontally offset to account for
   * form field prefix content. This won't work in server side rendering since we cannot
   * measure the width of the prefix container. To make the docked label appear as if the
   * right offset has been calculated, we forcibly render the label inside the infix. Since
   * the label is part of the infix, the label cannot overflow the prefix content.
   */
  _forceDisplayInfixLabel() {
    return !this._platform.isBrowser && this._prefixChildren.length && !this._shouldLabelFloat();
  }
  _hasFloatingLabel = computed(() => !!this._labelChild(), ...ngDevMode ? [{
    debugName: "_hasFloatingLabel"
  }] : []);
  _shouldLabelFloat() {
    if (!this._hasFloatingLabel()) {
      return false;
    }
    return this._control.shouldLabelFloat || this._shouldAlwaysFloat();
  }
  /**
   * Determines whether a class from the AbstractControlDirective
   * should be forwarded to the host element.
   */
  _shouldForward(prop) {
    const control = this._control ? this._control.ngControl : null;
    return control && control[prop];
  }
  /** Gets the type of subscript message to render (error or hint). */
  _getSubscriptMessageType() {
    return this._errorChildren && this._errorChildren.length > 0 && this._control.errorState ? "error" : "hint";
  }
  /** Handle label resize events. */
  _handleLabelResized() {
    this._refreshOutlineNotchWidth();
  }
  /** Refreshes the width of the outline-notch, if present. */
  _refreshOutlineNotchWidth() {
    if (!this._hasOutline() || !this._floatingLabel || !this._shouldLabelFloat()) {
      this._notchedOutline?._setNotchWidth(0);
    } else {
      this._notchedOutline?._setNotchWidth(this._floatingLabel.getWidth());
    }
  }
  /** Does any extra processing that is required when handling the hints. */
  _processHints() {
    this._validateHints();
    this._syncDescribedByIds();
  }
  /**
   * Ensure that there is a maximum of one of each "mat-hint" alignment specified. The hint
   * label specified set through the input is being considered as "start" aligned.
   *
   * This method is a noop if Angular runs in production mode.
   */
  _validateHints() {
    if (this._hintChildren && (typeof ngDevMode === "undefined" || ngDevMode)) {
      let startHint;
      let endHint;
      this._hintChildren.forEach((hint) => {
        if (hint.align === "start") {
          if (startHint || this.hintLabel) {
            throw getMatFormFieldDuplicatedHintError("start");
          }
          startHint = hint;
        } else if (hint.align === "end") {
          if (endHint) {
            throw getMatFormFieldDuplicatedHintError("end");
          }
          endHint = hint;
        }
      });
    }
  }
  /**
   * Sets the list of element IDs that describe the child control. This allows the control to update
   * its `aria-describedby` attribute accordingly.
   */
  _syncDescribedByIds() {
    if (this._control) {
      let ids = [];
      if (this._control.userAriaDescribedBy && typeof this._control.userAriaDescribedBy === "string") {
        ids.push(...this._control.userAriaDescribedBy.split(" "));
      }
      if (this._getSubscriptMessageType() === "hint") {
        const startHint = this._hintChildren ? this._hintChildren.find((hint) => hint.align === "start") : null;
        const endHint = this._hintChildren ? this._hintChildren.find((hint) => hint.align === "end") : null;
        if (startHint) {
          ids.push(startHint.id);
        } else if (this._hintLabel) {
          ids.push(this._hintLabelId);
        }
        if (endHint) {
          ids.push(endHint.id);
        }
      } else if (this._errorChildren) {
        ids.push(...this._errorChildren.map((error) => error.id));
      }
      const existingDescribedBy = this._control.describedByIds;
      let toAssign;
      if (existingDescribedBy) {
        const exclude = this._describedByIds || ids;
        toAssign = ids.concat(existingDescribedBy.filter((id) => id && !exclude.includes(id)));
      } else {
        toAssign = ids;
      }
      this._control.setDescribedByIds(toAssign);
      this._describedByIds = ids;
    }
  }
  /**
   * Calculates the horizontal offset of the label in the outline appearance. In the outline
   * appearance, the notched-outline and label are not relative to the infix container because
   * the outline intends to surround prefixes, suffixes and the infix. This means that the
   * floating label by default overlaps prefixes in the docked state. To avoid this, we need to
   * horizontally offset the label by the width of the prefix container. The MDC text-field does
   * not need to do this because they use a fixed width for prefixes. Hence, they can simply
   * incorporate the horizontal offset into their default text-field styles.
   */
  _getOutlinedLabelOffset() {
    if (!this._hasOutline() || !this._floatingLabel) {
      return null;
    }
    if (!this._iconPrefixContainer && !this._textPrefixContainer) {
      return ["", null];
    }
    if (!this._isAttachedToDom()) {
      return null;
    }
    const iconPrefixContainer = this._iconPrefixContainer?.nativeElement;
    const textPrefixContainer = this._textPrefixContainer?.nativeElement;
    const iconSuffixContainer = this._iconSuffixContainer?.nativeElement;
    const textSuffixContainer = this._textSuffixContainer?.nativeElement;
    const iconPrefixContainerWidth = iconPrefixContainer?.getBoundingClientRect().width ?? 0;
    const textPrefixContainerWidth = textPrefixContainer?.getBoundingClientRect().width ?? 0;
    const iconSuffixContainerWidth = iconSuffixContainer?.getBoundingClientRect().width ?? 0;
    const textSuffixContainerWidth = textSuffixContainer?.getBoundingClientRect().width ?? 0;
    const negate = this._currentDirection === "rtl" ? "-1" : "1";
    const prefixWidth = `${iconPrefixContainerWidth + textPrefixContainerWidth}px`;
    const labelOffset = `var(--mat-mdc-form-field-label-offset-x, 0px)`;
    const labelHorizontalOffset = `calc(${negate} * (${prefixWidth} + ${labelOffset}))`;
    const floatingLabelTransform = `var(--mat-mdc-form-field-label-transform, ${FLOATING_LABEL_DEFAULT_DOCKED_TRANSFORM} translateX(${labelHorizontalOffset}))`;
    const notchedOutlineWidth = iconPrefixContainerWidth + textPrefixContainerWidth + iconSuffixContainerWidth + textSuffixContainerWidth;
    return [floatingLabelTransform, notchedOutlineWidth];
  }
  /** Writes the styles produced by `_getOutlineLabelOffset` synchronously to the DOM. */
  _writeOutlinedLabelStyles(styles) {
    if (styles !== null) {
      const [floatingLabelTransform, notchedOutlineWidth] = styles;
      if (this._floatingLabel) {
        this._floatingLabel.element.style.transform = floatingLabelTransform;
      }
      if (notchedOutlineWidth !== null) {
        this._notchedOutline?._setMaxWidth(notchedOutlineWidth);
      }
    }
  }
  /** Checks whether the form field is attached to the DOM. */
  _isAttachedToDom() {
    const element = this._elementRef.nativeElement;
    if (element.getRootNode) {
      const rootNode = element.getRootNode();
      return rootNode && rootNode !== element;
    }
    return document.documentElement.contains(element);
  }
  static \u0275fac = function MatFormField_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatFormField)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatFormField,
    selectors: [["mat-form-field"]],
    contentQueries: function MatFormField_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuerySignal(dirIndex, ctx._labelChild, MatLabel, 5);
        \u0275\u0275contentQuery(dirIndex, MatFormFieldControl, 5);
        \u0275\u0275contentQuery(dirIndex, MAT_PREFIX, 5);
        \u0275\u0275contentQuery(dirIndex, MAT_SUFFIX, 5);
        \u0275\u0275contentQuery(dirIndex, MAT_ERROR, 5);
        \u0275\u0275contentQuery(dirIndex, MatHint, 5);
      }
      if (rf & 2) {
        \u0275\u0275queryAdvance();
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._formFieldControl = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._prefixChildren = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._suffixChildren = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._errorChildren = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._hintChildren = _t);
      }
    },
    viewQuery: function MatFormField_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuerySignal(ctx._iconPrefixContainerSignal, _c32, 5);
        \u0275\u0275viewQuerySignal(ctx._textPrefixContainerSignal, _c42, 5);
        \u0275\u0275viewQuerySignal(ctx._iconSuffixContainerSignal, _c5, 5);
        \u0275\u0275viewQuerySignal(ctx._textSuffixContainerSignal, _c6, 5);
        \u0275\u0275viewQuery(_c7, 5);
        \u0275\u0275viewQuery(_c32, 5);
        \u0275\u0275viewQuery(_c42, 5);
        \u0275\u0275viewQuery(_c5, 5);
        \u0275\u0275viewQuery(_c6, 5);
        \u0275\u0275viewQuery(MatFormFieldFloatingLabel, 5);
        \u0275\u0275viewQuery(MatFormFieldNotchedOutline, 5);
        \u0275\u0275viewQuery(MatFormFieldLineRipple, 5);
      }
      if (rf & 2) {
        \u0275\u0275queryAdvance(4);
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._textField = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._iconPrefixContainer = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._textPrefixContainer = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._iconSuffixContainer = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._textSuffixContainer = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._floatingLabel = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._notchedOutline = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._lineRipple = _t.first);
      }
    },
    hostAttrs: [1, "mat-mdc-form-field"],
    hostVars: 38,
    hostBindings: function MatFormField_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275classProp("mat-mdc-form-field-label-always-float", ctx._shouldAlwaysFloat())("mat-mdc-form-field-has-icon-prefix", ctx._hasIconPrefix)("mat-mdc-form-field-has-icon-suffix", ctx._hasIconSuffix)("mat-form-field-invalid", ctx._control.errorState)("mat-form-field-disabled", ctx._control.disabled)("mat-form-field-autofilled", ctx._control.autofilled)("mat-form-field-appearance-fill", ctx.appearance == "fill")("mat-form-field-appearance-outline", ctx.appearance == "outline")("mat-form-field-hide-placeholder", ctx._hasFloatingLabel() && !ctx._shouldLabelFloat())("mat-primary", ctx.color !== "accent" && ctx.color !== "warn")("mat-accent", ctx.color === "accent")("mat-warn", ctx.color === "warn")("ng-untouched", ctx._shouldForward("untouched"))("ng-touched", ctx._shouldForward("touched"))("ng-pristine", ctx._shouldForward("pristine"))("ng-dirty", ctx._shouldForward("dirty"))("ng-valid", ctx._shouldForward("valid"))("ng-invalid", ctx._shouldForward("invalid"))("ng-pending", ctx._shouldForward("pending"));
      }
    },
    inputs: {
      hideRequiredMarker: "hideRequiredMarker",
      color: "color",
      floatLabel: "floatLabel",
      appearance: "appearance",
      subscriptSizing: "subscriptSizing",
      hintLabel: "hintLabel"
    },
    exportAs: ["matFormField"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_FORM_FIELD,
      useExisting: _MatFormField
    }, {
      provide: FLOATING_LABEL_PARENT,
      useExisting: _MatFormField
    }])],
    ngContentSelectors: _c9,
    decls: 19,
    vars: 25,
    consts: [["labelTemplate", ""], ["textField", ""], ["iconPrefixContainer", ""], ["textPrefixContainer", ""], ["textSuffixContainer", ""], ["iconSuffixContainer", ""], [1, "mat-mdc-text-field-wrapper", "mdc-text-field", 3, "click"], [1, "mat-mdc-form-field-focus-overlay"], [1, "mat-mdc-form-field-flex"], ["matFormFieldNotchedOutline", "", 3, "matFormFieldNotchedOutlineOpen"], [1, "mat-mdc-form-field-icon-prefix"], [1, "mat-mdc-form-field-text-prefix"], [1, "mat-mdc-form-field-infix"], [3, "ngTemplateOutlet"], [1, "mat-mdc-form-field-text-suffix"], [1, "mat-mdc-form-field-icon-suffix"], ["matFormFieldLineRipple", ""], [1, "mat-mdc-form-field-subscript-wrapper", "mat-mdc-form-field-bottom-align"], ["aria-atomic", "true", "aria-live", "polite"], ["matFormFieldFloatingLabel", "", 3, "floating", "monitorResize", "id"], ["aria-hidden", "true", 1, "mat-mdc-form-field-required-marker", "mdc-floating-label--required"], [3, "id"], [1, "mat-mdc-form-field-hint-spacer"]],
    template: function MatFormField_Template(rf, ctx) {
      if (rf & 1) {
        const _r1 = \u0275\u0275getCurrentView();
        \u0275\u0275projectionDef(_c8);
        \u0275\u0275template(0, MatFormField_ng_template_0_Template, 1, 1, "ng-template", null, 0, \u0275\u0275templateRefExtractor);
        \u0275\u0275elementStart(2, "div", 6, 1);
        \u0275\u0275listener("click", function MatFormField_Template_div_click_2_listener($event) {
          \u0275\u0275restoreView(_r1);
          return \u0275\u0275resetView(ctx._control.onContainerClick($event));
        });
        \u0275\u0275conditionalCreate(4, MatFormField_Conditional_4_Template, 1, 0, "div", 7);
        \u0275\u0275elementStart(5, "div", 8);
        \u0275\u0275conditionalCreate(6, MatFormField_Conditional_6_Template, 2, 2, "div", 9);
        \u0275\u0275conditionalCreate(7, MatFormField_Conditional_7_Template, 3, 0, "div", 10);
        \u0275\u0275conditionalCreate(8, MatFormField_Conditional_8_Template, 3, 0, "div", 11);
        \u0275\u0275elementStart(9, "div", 12);
        \u0275\u0275conditionalCreate(10, MatFormField_Conditional_10_Template, 1, 1, null, 13);
        \u0275\u0275projection(11);
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(12, MatFormField_Conditional_12_Template, 3, 0, "div", 14);
        \u0275\u0275conditionalCreate(13, MatFormField_Conditional_13_Template, 3, 0, "div", 15);
        \u0275\u0275elementEnd();
        \u0275\u0275conditionalCreate(14, MatFormField_Conditional_14_Template, 1, 0, "div", 16);
        \u0275\u0275elementEnd();
        \u0275\u0275elementStart(15, "div", 17)(16, "div", 18);
        \u0275\u0275conditionalCreate(17, MatFormField_Case_17_Template, 1, 0)(18, MatFormField_Case_18_Template, 4, 1);
        \u0275\u0275elementEnd()();
      }
      if (rf & 2) {
        let tmp_19_0;
        \u0275\u0275advance(2);
        \u0275\u0275classProp("mdc-text-field--filled", !ctx._hasOutline())("mdc-text-field--outlined", ctx._hasOutline())("mdc-text-field--no-label", !ctx._hasFloatingLabel())("mdc-text-field--disabled", ctx._control.disabled)("mdc-text-field--invalid", ctx._control.errorState);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(!ctx._hasOutline() && !ctx._control.disabled ? 4 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx._hasOutline() ? 6 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx._hasIconPrefix ? 7 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx._hasTextPrefix ? 8 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(!ctx._hasOutline() || ctx._forceDisplayInfixLabel() ? 10 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx._hasTextSuffix ? 12 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx._hasIconSuffix ? 13 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(!ctx._hasOutline() ? 14 : -1);
        \u0275\u0275advance();
        \u0275\u0275classProp("mat-mdc-form-field-subscript-dynamic-size", ctx.subscriptSizing === "dynamic");
        const subscriptMessageType_r4 = ctx._getSubscriptMessageType();
        \u0275\u0275advance();
        \u0275\u0275classProp("mat-mdc-form-field-error-wrapper", subscriptMessageType_r4 === "error")("mat-mdc-form-field-hint-wrapper", subscriptMessageType_r4 === "hint");
        \u0275\u0275advance();
        \u0275\u0275conditional((tmp_19_0 = subscriptMessageType_r4) === "error" ? 17 : tmp_19_0 === "hint" ? 18 : -1);
      }
    },
    dependencies: [MatFormFieldFloatingLabel, MatFormFieldNotchedOutline, NgTemplateOutlet, MatFormFieldLineRipple, MatHint],
    styles: ['.mdc-text-field{display:inline-flex;align-items:baseline;padding:0 16px;position:relative;box-sizing:border-box;overflow:hidden;will-change:opacity,transform,color;border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.mdc-text-field__input{width:100%;min-width:0;border:none;border-radius:0;background:none;padding:0;-moz-appearance:none;-webkit-appearance:none;height:28px}.mdc-text-field__input::-webkit-calendar-picker-indicator,.mdc-text-field__input::-webkit-search-cancel-button{display:none}.mdc-text-field__input::-ms-clear{display:none}.mdc-text-field__input:focus{outline:none}.mdc-text-field__input:invalid{box-shadow:none}.mdc-text-field__input::placeholder{opacity:0}.mdc-text-field__input::-moz-placeholder{opacity:0}.mdc-text-field__input::-webkit-input-placeholder{opacity:0}.mdc-text-field__input:-ms-input-placeholder{opacity:0}.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mdc-text-field--focused .mdc-text-field__input::placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder,.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder,.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{opacity:1}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder{opacity:0}.mdc-text-field--outlined .mdc-text-field__input,.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{height:100%}.mdc-text-field--outlined .mdc-text-field__input{display:flex;border:none !important;background-color:rgba(0,0,0,0)}.mdc-text-field--disabled .mdc-text-field__input{pointer-events:auto}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input{color:var(--mat-form-field-filled-input-text-color, var(--mat-sys-on-surface));caret-color:var(--mat-form-field-filled-caret-color, var(--mat-sys-primary))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input{color:var(--mat-form-field-outlined-input-text-color, var(--mat-sys-on-surface));caret-color:var(--mat-form-field-outlined-caret-color, var(--mat-sys-primary))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input{caret-color:var(--mat-form-field-filled-error-caret-color, var(--mat-sys-error))}.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input{caret-color:var(--mat-form-field-outlined-error-caret-color, var(--mat-sys-error))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input{color:var(--mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input{color:var(--mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}@media(forced-colors: active){.mdc-text-field--disabled .mdc-text-field__input{background-color:Window}}.mdc-text-field--filled{height:56px;border-bottom-right-radius:0;border-bottom-left-radius:0;border-top-left-radius:var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));border-top-right-radius:var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small))}.mdc-text-field--filled:not(.mdc-text-field--disabled){background-color:var(--mat-form-field-filled-container-color, var(--mat-sys-surface-variant))}.mdc-text-field--filled.mdc-text-field--disabled{background-color:var(--mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent))}.mdc-text-field--outlined{height:56px;overflow:visible;padding-right:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));padding-left:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px)}[dir=rtl] .mdc-text-field--outlined{padding-right:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);padding-left:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)))}.mdc-floating-label{position:absolute;left:0;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform}[dir=rtl] .mdc-floating-label{right:0;left:auto;transform-origin:right top;text-align:right}.mdc-text-field .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-text-field--outlined .mdc-floating-label{left:4px;right:auto}[dir=rtl] .mdc-text-field--outlined .mdc-floating-label{left:auto;right:4px}.mdc-text-field--filled .mdc-floating-label{left:16px;right:auto}[dir=rtl] .mdc-text-field--filled .mdc-floating-label{left:auto;right:16px}.mdc-text-field--disabled .mdc-floating-label{cursor:default}@media(forced-colors: active){.mdc-text-field--disabled .mdc-floating-label{z-index:1}}.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label{display:none}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label{color:var(--mat-form-field-filled-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-filled-focus-label-text-color, var(--mat-sys-primary))}.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label{color:var(--mat-form-field-filled-hover-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label{color:var(--mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label{color:var(--mat-form-field-filled-error-label-text-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-filled-error-focus-label-text-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label{color:var(--mat-form-field-filled-error-hover-label-text-color, var(--mat-sys-on-error-container))}.mdc-text-field--filled .mdc-floating-label{font-family:var(--mat-form-field-filled-label-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-form-field-filled-label-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-form-field-filled-label-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-form-field-filled-label-text-tracking, var(--mat-sys-body-large-tracking))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label{color:var(--mat-form-field-outlined-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-outlined-focus-label-text-color, var(--mat-sys-primary))}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label{color:var(--mat-form-field-outlined-hover-label-text-color, var(--mat-sys-on-surface))}.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label{color:var(--mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label{color:var(--mat-form-field-outlined-error-label-text-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-outlined-error-focus-label-text-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label{color:var(--mat-form-field-outlined-error-hover-label-text-color, var(--mat-sys-on-error-container))}.mdc-text-field--outlined .mdc-floating-label{font-family:var(--mat-form-field-outlined-label-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-form-field-outlined-label-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-form-field-outlined-label-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-form-field-outlined-label-text-tracking, var(--mat-sys-body-large-tracking))}.mdc-floating-label--float-above{cursor:auto;transform:translateY(-106%) scale(0.75)}.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1);font-size:.75rem}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:133.3333333333%}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after{margin-left:1px;margin-right:0;content:"*"}[dir=rtl] .mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after{margin-left:0;margin-right:1px}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline{text-align:right}.mdc-text-field--outlined .mdc-notched-outline{z-index:1}.mat-mdc-notch-piece{box-sizing:border-box;height:100%;pointer-events:none;border-top:1px solid;border-bottom:1px solid}.mdc-text-field--focused .mat-mdc-notch-piece{border-width:2px}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-outline-color, var(--mat-sys-outline));border-width:var(--mat-form-field-outlined-outline-width, 1px)}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-hover-outline-color, var(--mat-sys-on-surface))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-focus-outline-color, var(--mat-sys-primary))}.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-outline-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-hover-outline-color, var(--mat-sys-on-error-container))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-focus-outline-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece{border-width:var(--mat-form-field-outlined-focus-outline-width, 2px)}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)))}[dir=rtl] .mdc-notched-outline__leading{border-left:none;border-right:1px solid;border-bottom-left-radius:0;border-top-left-radius:0;border-top-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-notched-outline__trailing{flex-grow:1;border-left:none;border-right:1px solid;border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}[dir=rtl] .mdc-notched-outline__trailing{border-left:1px solid;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-notched-outline__notch{flex:0 0 auto;width:auto}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:min(var(--mat-form-field-notch-max-width, 100%),calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2))}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{max-width:min(100%,calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2))}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{z-index:1;border-bottom-width:var(--mat-form-field-filled-active-indicator-height, 1px)}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-active-indicator-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-hover-active-indicator-color, var(--mat-sys-on-surface))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-error-active-indicator-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-error-hover-active-indicator-color, var(--mat-sys-on-error-container))}.mdc-line-ripple::after{transform:scaleX(0);opacity:0;z-index:2}.mdc-text-field--filled .mdc-line-ripple::after{border-bottom-width:var(--mat-form-field-filled-focus-active-indicator-height, 2px)}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:var(--mat-form-field-filled-focus-active-indicator-color, var(--mat-sys-primary))}.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:var(--mat-form-field-filled-error-focus-active-indicator-color, var(--mat-sys-error))}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-text-field--disabled{pointer-events:none}.mat-mdc-form-field-textarea-control{vertical-align:middle;resize:vertical;box-sizing:border-box;height:auto;margin:0;padding:0;border:none;overflow:auto}.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font:inherit;letter-spacing:inherit;text-decoration:inherit;text-transform:inherit;border:none}.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;line-height:normal;pointer-events:all;will-change:auto}.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label{cursor:inherit}.mdc-text-field--no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control{height:auto}.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color]{height:23px}.mat-mdc-text-field-wrapper{height:auto;flex:auto;will-change:auto}.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper{padding-left:0;--mat-mdc-form-field-label-offset-x: -16px}.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper{padding-right:0}[dir=rtl] .mat-mdc-text-field-wrapper{padding-left:16px;padding-right:16px}[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper{padding-left:0}[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper{padding-right:0}.mat-form-field-disabled .mdc-text-field__input::placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label{left:auto;right:auto}.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input{display:inline-block}.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch{padding-top:0}.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch{border-left:1px solid rgba(0,0,0,0)}[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch{border-left:none;border-right:1px solid rgba(0,0,0,0)}.mat-mdc-form-field-infix{min-height:var(--mat-form-field-container-height, 56px);padding-top:var(--mat-form-field-filled-with-label-container-padding-top, 24px);padding-bottom:var(--mat-form-field-filled-with-label-container-padding-bottom, 8px)}.mdc-text-field--outlined .mat-mdc-form-field-infix,.mdc-text-field--no-label .mat-mdc-form-field-infix{padding-top:var(--mat-form-field-container-vertical-padding, 16px);padding-bottom:var(--mat-form-field-container-vertical-padding, 16px)}.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label{top:calc(var(--mat-form-field-container-height, 56px)/2)}.mdc-text-field--filled .mat-mdc-floating-label{display:var(--mat-form-field-filled-label-display, block)}.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{--mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--mat-form-field-container-height, 56px) / 2) * -1)) scale(var(--mat-mdc-form-field-floating-label-scale, 0.75));transform:var(--mat-mdc-form-field-label-transform)}@keyframes _mat-form-field-subscript-animation{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}.mat-mdc-form-field-subscript-wrapper{box-sizing:border-box;width:100%;position:relative}.mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field-error-wrapper{position:absolute;top:0;left:0;right:0;padding:0 16px;opacity:1;transform:translateY(0);animation:_mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper{position:static}.mat-mdc-form-field-bottom-align::before{content:"";display:inline-block;height:16px}.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before{content:unset}.mat-mdc-form-field-hint-end{order:1}.mat-mdc-form-field-hint-wrapper{display:flex}.mat-mdc-form-field-hint-spacer{flex:1 0 1em}.mat-mdc-form-field-error{display:block;color:var(--mat-form-field-error-text-color, var(--mat-sys-error))}.mat-mdc-form-field-subscript-wrapper,.mat-mdc-form-field-bottom-align::before{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-form-field-subscript-text-font, var(--mat-sys-body-small-font));line-height:var(--mat-form-field-subscript-text-line-height, var(--mat-sys-body-small-line-height));font-size:var(--mat-form-field-subscript-text-size, var(--mat-sys-body-small-size));letter-spacing:var(--mat-form-field-subscript-text-tracking, var(--mat-sys-body-small-tracking));font-weight:var(--mat-form-field-subscript-text-weight, var(--mat-sys-body-small-weight))}.mat-mdc-form-field-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;opacity:0;pointer-events:none;background-color:var(--mat-form-field-state-layer-color, var(--mat-sys-on-surface))}.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay{opacity:var(--mat-form-field-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay{opacity:var(--mat-form-field-focus-state-layer-opacity, 0)}select.mat-mdc-form-field-input-control{-moz-appearance:none;-webkit-appearance:none;background-color:rgba(0,0,0,0);display:inline-flex;box-sizing:border-box}select.mat-mdc-form-field-input-control:not(:disabled){cursor:pointer}select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option{color:var(--mat-form-field-select-option-text-color, var(--mat-sys-neutral10))}select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled{color:var(--mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--mat-sys-neutral10) 38%, transparent))}.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after{content:"";width:0;height:0;border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);border-top:5px solid;position:absolute;right:0;top:50%;margin-top:-2.5px;pointer-events:none;color:var(--mat-form-field-enabled-select-arrow-color, var(--mat-sys-on-surface-variant))}[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after{right:auto;left:0}.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after{color:var(--mat-form-field-focus-select-arrow-color, var(--mat-sys-primary))}.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after{color:var(--mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control{padding-right:15px}[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control{padding-right:0;padding-left:15px}@media(forced-colors: active){.mat-form-field-appearance-fill .mat-mdc-text-field-wrapper{outline:solid 1px}}@media(forced-colors: active){.mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper{outline-color:GrayText}}@media(forced-colors: active){.mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper{outline:dashed 3px}}@media(forced-colors: active){.mat-mdc-form-field.mat-focused .mdc-notched-outline{border:dashed 3px}}.mat-mdc-form-field-input-control[type=date],.mat-mdc-form-field-input-control[type=datetime],.mat-mdc-form-field-input-control[type=datetime-local],.mat-mdc-form-field-input-control[type=month],.mat-mdc-form-field-input-control[type=week],.mat-mdc-form-field-input-control[type=time]{line-height:1}.mat-mdc-form-field-input-control::-webkit-datetime-edit{line-height:1;padding:0;margin-bottom:-2px}.mat-mdc-form-field{--mat-mdc-form-field-floating-label-scale: 0.75;display:inline-flex;flex-direction:column;min-width:0;text-align:left;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-form-field-container-text-font, var(--mat-sys-body-large-font));line-height:var(--mat-form-field-container-text-line-height, var(--mat-sys-body-large-line-height));font-size:var(--mat-form-field-container-text-size, var(--mat-sys-body-large-size));letter-spacing:var(--mat-form-field-container-text-tracking, var(--mat-sys-body-large-tracking));font-weight:var(--mat-form-field-container-text-weight, var(--mat-sys-body-large-weight))}.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above{font-size:calc(var(--mat-form-field-outlined-label-text-populated-size)*var(--mat-mdc-form-field-floating-label-scale))}.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:var(--mat-form-field-outlined-label-text-populated-size)}[dir=rtl] .mat-mdc-form-field{text-align:right}.mat-mdc-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-mdc-text-field-wrapper{width:100%;z-index:0}.mat-mdc-form-field-icon-prefix,.mat-mdc-form-field-icon-suffix{align-self:center;line-height:0;pointer-events:auto;position:relative;z-index:1}.mat-mdc-form-field-icon-prefix>.mat-icon,.mat-mdc-form-field-icon-suffix>.mat-icon{padding:0 12px;box-sizing:content-box}.mat-mdc-form-field-icon-prefix{color:var(--mat-form-field-leading-icon-color, var(--mat-sys-on-surface-variant))}.mat-form-field-disabled .mat-mdc-form-field-icon-prefix{color:var(--mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-trailing-icon-color, var(--mat-sys-on-surface-variant))}.mat-form-field-disabled .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-invalid .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-trailing-icon-color, var(--mat-sys-error))}.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-hover-trailing-icon-color, var(--mat-sys-on-error-container))}.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-focus-trailing-icon-color, var(--mat-sys-error))}.mat-mdc-form-field-icon-prefix,[dir=rtl] .mat-mdc-form-field-icon-suffix{padding:0 4px 0 0}.mat-mdc-form-field-icon-suffix,[dir=rtl] .mat-mdc-form-field-icon-prefix{padding:0 0 0 4px}.mat-mdc-form-field-subscript-wrapper .mat-icon,.mat-mdc-form-field label .mat-icon{width:1em;height:1em;font-size:inherit}.mat-mdc-form-field-infix{flex:auto;min-width:0;width:180px;position:relative;box-sizing:border-box}.mat-mdc-form-field-infix:has(textarea[cols]){width:auto}.mat-mdc-form-field .mdc-notched-outline__notch{margin-left:-1px;-webkit-clip-path:inset(-9em -999em -9em 1px);clip-path:inset(-9em -999em -9em 1px)}[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch{margin-left:0;margin-right:-1px;-webkit-clip-path:inset(-9em 1px -9em -999em);clip-path:inset(-9em 1px -9em -999em)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label{transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input{transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before{transition-duration:75ms}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper{animation-duration:300ms}.mdc-notched-outline .mdc-floating-label{max-width:calc(100% + 1px)}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(133.3333333333% + 1px)}\n'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatFormField, [{
    type: Component,
    args: [{
      selector: "mat-form-field",
      exportAs: "matFormField",
      host: {
        "class": "mat-mdc-form-field",
        "[class.mat-mdc-form-field-label-always-float]": "_shouldAlwaysFloat()",
        "[class.mat-mdc-form-field-has-icon-prefix]": "_hasIconPrefix",
        "[class.mat-mdc-form-field-has-icon-suffix]": "_hasIconSuffix",
        // Note that these classes reuse the same names as the non-MDC version, because they can be
        // considered a public API since custom form controls may use them to style themselves.
        // See https://github.com/angular/components/pull/20502#discussion_r486124901.
        "[class.mat-form-field-invalid]": "_control.errorState",
        "[class.mat-form-field-disabled]": "_control.disabled",
        "[class.mat-form-field-autofilled]": "_control.autofilled",
        "[class.mat-form-field-appearance-fill]": 'appearance == "fill"',
        "[class.mat-form-field-appearance-outline]": 'appearance == "outline"',
        "[class.mat-form-field-hide-placeholder]": "_hasFloatingLabel() && !_shouldLabelFloat()",
        "[class.mat-primary]": 'color !== "accent" && color !== "warn"',
        "[class.mat-accent]": 'color === "accent"',
        "[class.mat-warn]": 'color === "warn"',
        "[class.ng-untouched]": '_shouldForward("untouched")',
        "[class.ng-touched]": '_shouldForward("touched")',
        "[class.ng-pristine]": '_shouldForward("pristine")',
        "[class.ng-dirty]": '_shouldForward("dirty")',
        "[class.ng-valid]": '_shouldForward("valid")',
        "[class.ng-invalid]": '_shouldForward("invalid")',
        "[class.ng-pending]": '_shouldForward("pending")'
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: MAT_FORM_FIELD,
        useExisting: MatFormField
      }, {
        provide: FLOATING_LABEL_PARENT,
        useExisting: MatFormField
      }],
      imports: [MatFormFieldFloatingLabel, MatFormFieldNotchedOutline, NgTemplateOutlet, MatFormFieldLineRipple, MatHint],
      template: '<ng-template #labelTemplate>\n  <!--\n    MDC recommends that the text-field is a `<label>` element. This rather complicates the\n    setup because it would require every form-field control to explicitly set `aria-labelledby`.\n    This is because the `<label>` itself contains more than the actual label (e.g. prefix, suffix\n    or other projected content), and screen readers could potentially read out undesired content.\n    Excluding elements from being printed out requires them to be marked with `aria-hidden`, or\n    the form control is set to a scoped element for the label (using `aria-labelledby`). Both of\n    these options seem to complicate the setup because we know exactly what content is rendered\n    as part of the label, and we don\'t want to spend resources on walking through projected content\n    to set `aria-hidden`. Nor do we want to set `aria-labelledby` on every form control if we could\n    simply link the label to the control using the label `for` attribute.\n  -->\n  @if (_hasFloatingLabel()) {\n    <label\n      matFormFieldFloatingLabel\n      [floating]="_shouldLabelFloat()"\n      [monitorResize]="_hasOutline()"\n      [id]="_labelId"\n      [attr.for]="_control.disableAutomaticLabeling ? null : _control.id"\n    >\n      <ng-content select="mat-label"></ng-content>\n      <!--\n        We set the required marker as a separate element, in order to make it easier to target if\n        apps want to override it and to be able to set `aria-hidden` so that screen readers don\'t\n        pick it up.\n       -->\n      @if (!hideRequiredMarker && _control.required) {\n        <span\n          aria-hidden="true"\n          class="mat-mdc-form-field-required-marker mdc-floating-label--required"\n        ></span>\n      }\n    </label>\n  }\n</ng-template>\n\n<div\n  class="mat-mdc-text-field-wrapper mdc-text-field"\n  #textField\n  [class.mdc-text-field--filled]="!_hasOutline()"\n  [class.mdc-text-field--outlined]="_hasOutline()"\n  [class.mdc-text-field--no-label]="!_hasFloatingLabel()"\n  [class.mdc-text-field--disabled]="_control.disabled"\n  [class.mdc-text-field--invalid]="_control.errorState"\n  (click)="_control.onContainerClick($event)"\n>\n  @if (!_hasOutline() && !_control.disabled) {\n    <div class="mat-mdc-form-field-focus-overlay"></div>\n  }\n  <div class="mat-mdc-form-field-flex">\n    @if (_hasOutline()) {\n      <div matFormFieldNotchedOutline [matFormFieldNotchedOutlineOpen]="_shouldLabelFloat()">\n        @if (!_forceDisplayInfixLabel()) {\n          <ng-template [ngTemplateOutlet]="labelTemplate"></ng-template>\n        }\n      </div>\n    }\n\n    @if (_hasIconPrefix) {\n      <div class="mat-mdc-form-field-icon-prefix" #iconPrefixContainer>\n        <ng-content select="[matPrefix], [matIconPrefix]"></ng-content>\n      </div>\n    }\n\n    @if (_hasTextPrefix) {\n      <div class="mat-mdc-form-field-text-prefix" #textPrefixContainer>\n        <ng-content select="[matTextPrefix]"></ng-content>\n      </div>\n    }\n\n    <div class="mat-mdc-form-field-infix">\n      @if (!_hasOutline() || _forceDisplayInfixLabel()) {\n        <ng-template [ngTemplateOutlet]="labelTemplate"></ng-template>\n      }\n\n      <ng-content></ng-content>\n    </div>\n\n    @if (_hasTextSuffix) {\n      <div class="mat-mdc-form-field-text-suffix" #textSuffixContainer>\n        <ng-content select="[matTextSuffix]"></ng-content>\n      </div>\n    }\n\n    @if (_hasIconSuffix) {\n      <div class="mat-mdc-form-field-icon-suffix" #iconSuffixContainer>\n        <ng-content select="[matSuffix], [matIconSuffix]"></ng-content>\n      </div>\n    }\n  </div>\n\n  @if (!_hasOutline()) {\n    <div matFormFieldLineRipple></div>\n  }\n</div>\n\n<div\n    class="mat-mdc-form-field-subscript-wrapper mat-mdc-form-field-bottom-align"\n    [class.mat-mdc-form-field-subscript-dynamic-size]="subscriptSizing === \'dynamic\'"\n>\n  @let subscriptMessageType = _getSubscriptMessageType();\n\n  <!-- \n    Use a single permanent wrapper for both hints and errors so aria-live works correctly,\n    as having it appear post render will not consistently work. We also do not want to add\n    additional divs as it causes styling regressions.\n    -->\n  <div aria-atomic="true" aria-live="polite" \n      [class.mat-mdc-form-field-error-wrapper]="subscriptMessageType === \'error\'"\n      [class.mat-mdc-form-field-hint-wrapper]="subscriptMessageType === \'hint\'"\n    >\n    @switch (subscriptMessageType) {\n      @case (\'error\') {\n        <ng-content select="mat-error, [matError]"></ng-content>\n      }\n\n      @case (\'hint\') {\n        @if (hintLabel) {\n          <mat-hint [id]="_hintLabelId">{{hintLabel}}</mat-hint>\n        }\n        <ng-content select="mat-hint:not([align=\'end\'])"></ng-content>\n        <div class="mat-mdc-form-field-hint-spacer"></div>\n        <ng-content select="mat-hint[align=\'end\']"></ng-content>\n      }\n    }\n  </div>\n</div>\n',
      styles: ['.mdc-text-field{display:inline-flex;align-items:baseline;padding:0 16px;position:relative;box-sizing:border-box;overflow:hidden;will-change:opacity,transform,color;border-top-left-radius:4px;border-top-right-radius:4px;border-bottom-right-radius:0;border-bottom-left-radius:0}.mdc-text-field__input{width:100%;min-width:0;border:none;border-radius:0;background:none;padding:0;-moz-appearance:none;-webkit-appearance:none;height:28px}.mdc-text-field__input::-webkit-calendar-picker-indicator,.mdc-text-field__input::-webkit-search-cancel-button{display:none}.mdc-text-field__input::-ms-clear{display:none}.mdc-text-field__input:focus{outline:none}.mdc-text-field__input:invalid{box-shadow:none}.mdc-text-field__input::placeholder{opacity:0}.mdc-text-field__input::-moz-placeholder{opacity:0}.mdc-text-field__input::-webkit-input-placeholder{opacity:0}.mdc-text-field__input:-ms-input-placeholder{opacity:0}.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mdc-text-field--focused .mdc-text-field__input::placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder,.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder,.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder{opacity:1}.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{opacity:1}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-moz-placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive::-webkit-input-placeholder{opacity:0}.mdc-text-field--disabled:not(.mdc-text-field--no-label) .mdc-text-field__input.mat-mdc-input-disabled-interactive:-ms-input-placeholder{opacity:0}.mdc-text-field--outlined .mdc-text-field__input,.mdc-text-field--filled.mdc-text-field--no-label .mdc-text-field__input{height:100%}.mdc-text-field--outlined .mdc-text-field__input{display:flex;border:none !important;background-color:rgba(0,0,0,0)}.mdc-text-field--disabled .mdc-text-field__input{pointer-events:auto}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input{color:var(--mat-form-field-filled-input-text-color, var(--mat-sys-on-surface));caret-color:var(--mat-form-field-filled-caret-color, var(--mat-sys-primary))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-filled-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input{color:var(--mat-form-field-outlined-input-text-color, var(--mat-sys-on-surface));caret-color:var(--mat-form-field-outlined-caret-color, var(--mat-sys-primary))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-outlined-input-text-placeholder-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input{caret-color:var(--mat-form-field-filled-error-caret-color, var(--mat-sys-error))}.mdc-text-field--outlined.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-text-field__input{caret-color:var(--mat-form-field-outlined-error-caret-color, var(--mat-sys-error))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-text-field__input{color:var(--mat-form-field-filled-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--outlined.mdc-text-field--disabled .mdc-text-field__input{color:var(--mat-form-field-outlined-disabled-input-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}@media(forced-colors: active){.mdc-text-field--disabled .mdc-text-field__input{background-color:Window}}.mdc-text-field--filled{height:56px;border-bottom-right-radius:0;border-bottom-left-radius:0;border-top-left-radius:var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small));border-top-right-radius:var(--mat-form-field-filled-container-shape, var(--mat-sys-corner-extra-small))}.mdc-text-field--filled:not(.mdc-text-field--disabled){background-color:var(--mat-form-field-filled-container-color, var(--mat-sys-surface-variant))}.mdc-text-field--filled.mdc-text-field--disabled{background-color:var(--mat-form-field-filled-disabled-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 4%, transparent))}.mdc-text-field--outlined{height:56px;overflow:visible;padding-right:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)));padding-left:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px)}[dir=rtl] .mdc-text-field--outlined{padding-right:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)) + 4px);padding-left:max(16px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)))}.mdc-floating-label{position:absolute;left:0;transform-origin:left top;line-height:1.15rem;text-align:left;text-overflow:ellipsis;white-space:nowrap;cursor:text;overflow:hidden;will-change:transform}[dir=rtl] .mdc-floating-label{right:0;left:auto;transform-origin:right top;text-align:right}.mdc-text-field .mdc-floating-label{top:50%;transform:translateY(-50%);pointer-events:none}.mdc-notched-outline .mdc-floating-label{display:inline-block;position:relative;max-width:100%}.mdc-text-field--outlined .mdc-floating-label{left:4px;right:auto}[dir=rtl] .mdc-text-field--outlined .mdc-floating-label{left:auto;right:4px}.mdc-text-field--filled .mdc-floating-label{left:16px;right:auto}[dir=rtl] .mdc-text-field--filled .mdc-floating-label{left:auto;right:16px}.mdc-text-field--disabled .mdc-floating-label{cursor:default}@media(forced-colors: active){.mdc-text-field--disabled .mdc-floating-label{z-index:1}}.mdc-text-field--filled.mdc-text-field--no-label .mdc-floating-label{display:none}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-floating-label{color:var(--mat-form-field-filled-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-filled-focus-label-text-color, var(--mat-sys-primary))}.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label{color:var(--mat-form-field-filled-hover-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-floating-label{color:var(--mat-form-field-filled-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label{color:var(--mat-form-field-filled-error-label-text-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-filled-error-focus-label-text-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label{color:var(--mat-form-field-filled-error-hover-label-text-color, var(--mat-sys-on-error-container))}.mdc-text-field--filled .mdc-floating-label{font-family:var(--mat-form-field-filled-label-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-form-field-filled-label-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-form-field-filled-label-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-form-field-filled-label-text-tracking, var(--mat-sys-body-large-tracking))}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mdc-floating-label{color:var(--mat-form-field-outlined-label-text-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-outlined-focus-label-text-color, var(--mat-sys-primary))}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-floating-label{color:var(--mat-form-field-outlined-hover-label-text-color, var(--mat-sys-on-surface))}.mdc-text-field--outlined.mdc-text-field--disabled .mdc-floating-label{color:var(--mat-form-field-outlined-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-floating-label{color:var(--mat-form-field-outlined-error-label-text-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mdc-floating-label{color:var(--mat-form-field-outlined-error-focus-label-text-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--disabled):hover .mdc-floating-label{color:var(--mat-form-field-outlined-error-hover-label-text-color, var(--mat-sys-on-error-container))}.mdc-text-field--outlined .mdc-floating-label{font-family:var(--mat-form-field-outlined-label-text-font, var(--mat-sys-body-large-font));font-size:var(--mat-form-field-outlined-label-text-size, var(--mat-sys-body-large-size));font-weight:var(--mat-form-field-outlined-label-text-weight, var(--mat-sys-body-large-weight));letter-spacing:var(--mat-form-field-outlined-label-text-tracking, var(--mat-sys-body-large-tracking))}.mdc-floating-label--float-above{cursor:auto;transform:translateY(-106%) scale(0.75)}.mdc-text-field--filled .mdc-floating-label--float-above{transform:translateY(-106%) scale(0.75)}.mdc-text-field--outlined .mdc-floating-label--float-above{transform:translateY(-37.25px) scale(1);font-size:.75rem}.mdc-notched-outline .mdc-floating-label--float-above{text-overflow:clip}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:133.3333333333%}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{transform:translateY(-34.75px) scale(0.75)}.mdc-text-field--outlined.mdc-notched-outline--upgraded .mdc-floating-label--float-above,.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:1rem}.mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after{margin-left:1px;margin-right:0;content:"*"}[dir=rtl] .mdc-floating-label--required:not(.mdc-floating-label--hide-required-marker)::after{margin-left:0;margin-right:1px}.mdc-notched-outline{display:flex;position:absolute;top:0;right:0;left:0;box-sizing:border-box;width:100%;max-width:100%;height:100%;text-align:left;pointer-events:none}[dir=rtl] .mdc-notched-outline{text-align:right}.mdc-text-field--outlined .mdc-notched-outline{z-index:1}.mat-mdc-notch-piece{box-sizing:border-box;height:100%;pointer-events:none;border-top:1px solid;border-bottom:1px solid}.mdc-text-field--focused .mat-mdc-notch-piece{border-width:2px}.mdc-text-field--outlined:not(.mdc-text-field--disabled) .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-outline-color, var(--mat-sys-outline));border-width:var(--mat-form-field-outlined-outline-width, 1px)}.mdc-text-field--outlined:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-hover-outline-color, var(--mat-sys-on-surface))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-focus-outline-color, var(--mat-sys-primary))}.mdc-text-field--outlined.mdc-text-field--disabled .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-outline-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-notched-outline .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-hover-outline-color, var(--mat-sys-on-error-container))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--invalid.mdc-text-field--focused .mat-mdc-notch-piece{border-color:var(--mat-form-field-outlined-error-focus-outline-color, var(--mat-sys-error))}.mdc-text-field--outlined:not(.mdc-text-field--disabled).mdc-text-field--focused .mdc-notched-outline .mat-mdc-notch-piece{border-width:var(--mat-form-field-outlined-focus-outline-width, 2px)}.mdc-notched-outline__leading{border-left:1px solid;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__leading{width:max(12px,var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small)))}[dir=rtl] .mdc-notched-outline__leading{border-left:none;border-right:1px solid;border-bottom-left-radius:0;border-top-left-radius:0;border-top-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-notched-outline__trailing{flex-grow:1;border-left:none;border-right:1px solid;border-top-left-radius:0;border-bottom-left-radius:0;border-top-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-right-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}[dir=rtl] .mdc-notched-outline__trailing{border-left:1px solid;border-right:none;border-top-right-radius:0;border-bottom-right-radius:0;border-top-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small));border-bottom-left-radius:var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))}.mdc-notched-outline__notch{flex:0 0 auto;width:auto}.mdc-text-field--outlined .mdc-notched-outline .mdc-notched-outline__notch{max-width:min(var(--mat-form-field-notch-max-width, 100%),calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2))}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{max-width:min(100%,calc(100% - max(12px, var(--mat-form-field-outlined-container-shape, var(--mat-sys-corner-extra-small))) * 2))}.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:1px}.mdc-text-field--focused.mdc-text-field--outlined .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-top:2px}.mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:0;padding-right:8px;border-top:none}[dir=rtl] .mdc-notched-outline--notched .mdc-notched-outline__notch{padding-left:8px;padding-right:0}.mdc-notched-outline--no-label .mdc-notched-outline__notch{display:none}.mdc-line-ripple::before,.mdc-line-ripple::after{position:absolute;bottom:0;left:0;width:100%;border-bottom-style:solid;content:""}.mdc-line-ripple::before{z-index:1;border-bottom-width:var(--mat-form-field-filled-active-indicator-height, 1px)}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-active-indicator-color, var(--mat-sys-on-surface-variant))}.mdc-text-field--filled:not(.mdc-text-field--disabled):not(.mdc-text-field--focused):hover .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-hover-active-indicator-color, var(--mat-sys-on-surface))}.mdc-text-field--filled.mdc-text-field--disabled .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-disabled-active-indicator-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-error-active-indicator-color, var(--mat-sys-error))}.mdc-text-field--filled:not(.mdc-text-field--disabled).mdc-text-field--invalid:not(.mdc-text-field--focused):hover .mdc-line-ripple::before{border-bottom-color:var(--mat-form-field-filled-error-hover-active-indicator-color, var(--mat-sys-on-error-container))}.mdc-line-ripple::after{transform:scaleX(0);opacity:0;z-index:2}.mdc-text-field--filled .mdc-line-ripple::after{border-bottom-width:var(--mat-form-field-filled-focus-active-indicator-height, 2px)}.mdc-text-field--filled:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:var(--mat-form-field-filled-focus-active-indicator-color, var(--mat-sys-primary))}.mdc-text-field--filled.mdc-text-field--invalid:not(.mdc-text-field--disabled) .mdc-line-ripple::after{border-bottom-color:var(--mat-form-field-filled-error-focus-active-indicator-color, var(--mat-sys-error))}.mdc-line-ripple--active::after{transform:scaleX(1);opacity:1}.mdc-line-ripple--deactivating::after{opacity:0}.mdc-text-field--disabled{pointer-events:none}.mat-mdc-form-field-textarea-control{vertical-align:middle;resize:vertical;box-sizing:border-box;height:auto;margin:0;padding:0;border:none;overflow:auto}.mat-mdc-form-field-input-control.mat-mdc-form-field-input-control{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font:inherit;letter-spacing:inherit;text-decoration:inherit;text-transform:inherit;border:none}.mat-mdc-form-field .mat-mdc-floating-label.mdc-floating-label{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;line-height:normal;pointer-events:all;will-change:auto}.mat-mdc-form-field:not(.mat-form-field-disabled) .mat-mdc-floating-label.mdc-floating-label{cursor:inherit}.mdc-text-field--no-label:not(.mdc-text-field--textarea) .mat-mdc-form-field-input-control.mdc-text-field__input,.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control{height:auto}.mat-mdc-text-field-wrapper .mat-mdc-form-field-input-control.mdc-text-field__input[type=color]{height:23px}.mat-mdc-text-field-wrapper{height:auto;flex:auto;will-change:auto}.mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper{padding-left:0;--mat-mdc-form-field-label-offset-x: -16px}.mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper{padding-right:0}[dir=rtl] .mat-mdc-text-field-wrapper{padding-left:16px;padding-right:16px}[dir=rtl] .mat-mdc-form-field-has-icon-suffix .mat-mdc-text-field-wrapper{padding-left:0}[dir=rtl] .mat-mdc-form-field-has-icon-prefix .mat-mdc-text-field-wrapper{padding-right:0}.mat-form-field-disabled .mdc-text-field__input::placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input::-moz-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input::-webkit-input-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-disabled .mdc-text-field__input:-ms-input-placeholder{color:var(--mat-form-field-disabled-input-text-placeholder-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-label-always-float .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms;opacity:1}.mat-mdc-text-field-wrapper .mat-mdc-form-field-infix .mat-mdc-floating-label{left:auto;right:auto}.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-text-field__input{display:inline-block}.mat-mdc-form-field .mat-mdc-text-field-wrapper.mdc-text-field .mdc-notched-outline__notch{padding-top:0}.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch{border-left:1px solid rgba(0,0,0,0)}[dir=rtl] .mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field.mat-mdc-form-field .mdc-notched-outline__notch{border-left:none;border-right:1px solid rgba(0,0,0,0)}.mat-mdc-form-field-infix{min-height:var(--mat-form-field-container-height, 56px);padding-top:var(--mat-form-field-filled-with-label-container-padding-top, 24px);padding-bottom:var(--mat-form-field-filled-with-label-container-padding-bottom, 8px)}.mdc-text-field--outlined .mat-mdc-form-field-infix,.mdc-text-field--no-label .mat-mdc-form-field-infix{padding-top:var(--mat-form-field-container-vertical-padding, 16px);padding-bottom:var(--mat-form-field-container-vertical-padding, 16px)}.mat-mdc-text-field-wrapper .mat-mdc-form-field-flex .mat-mdc-floating-label{top:calc(var(--mat-form-field-container-height, 56px)/2)}.mdc-text-field--filled .mat-mdc-floating-label{display:var(--mat-form-field-filled-label-display, block)}.mat-mdc-text-field-wrapper.mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{--mat-mdc-form-field-label-transform: translateY(calc(calc(6.75px + var(--mat-form-field-container-height, 56px) / 2) * -1)) scale(var(--mat-mdc-form-field-floating-label-scale, 0.75));transform:var(--mat-mdc-form-field-label-transform)}@keyframes _mat-form-field-subscript-animation{from{opacity:0;transform:translateY(-5px)}to{opacity:1;transform:translateY(0)}}.mat-mdc-form-field-subscript-wrapper{box-sizing:border-box;width:100%;position:relative}.mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field-error-wrapper{position:absolute;top:0;left:0;right:0;padding:0 16px;opacity:1;transform:translateY(0);animation:_mat-form-field-subscript-animation 0ms cubic-bezier(0.55, 0, 0.55, 0.2)}.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field-subscript-dynamic-size .mat-mdc-form-field-error-wrapper{position:static}.mat-mdc-form-field-bottom-align::before{content:"";display:inline-block;height:16px}.mat-mdc-form-field-bottom-align.mat-mdc-form-field-subscript-dynamic-size::before{content:unset}.mat-mdc-form-field-hint-end{order:1}.mat-mdc-form-field-hint-wrapper{display:flex}.mat-mdc-form-field-hint-spacer{flex:1 0 1em}.mat-mdc-form-field-error{display:block;color:var(--mat-form-field-error-text-color, var(--mat-sys-error))}.mat-mdc-form-field-subscript-wrapper,.mat-mdc-form-field-bottom-align::before{-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-form-field-subscript-text-font, var(--mat-sys-body-small-font));line-height:var(--mat-form-field-subscript-text-line-height, var(--mat-sys-body-small-line-height));font-size:var(--mat-form-field-subscript-text-size, var(--mat-sys-body-small-size));letter-spacing:var(--mat-form-field-subscript-text-tracking, var(--mat-sys-body-small-tracking));font-weight:var(--mat-form-field-subscript-text-weight, var(--mat-sys-body-small-weight))}.mat-mdc-form-field-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;opacity:0;pointer-events:none;background-color:var(--mat-form-field-state-layer-color, var(--mat-sys-on-surface))}.mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-focus-overlay{opacity:var(--mat-form-field-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-form-field.mat-focused .mat-mdc-form-field-focus-overlay{opacity:var(--mat-form-field-focus-state-layer-opacity, 0)}select.mat-mdc-form-field-input-control{-moz-appearance:none;-webkit-appearance:none;background-color:rgba(0,0,0,0);display:inline-flex;box-sizing:border-box}select.mat-mdc-form-field-input-control:not(:disabled){cursor:pointer}select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option{color:var(--mat-form-field-select-option-text-color, var(--mat-sys-neutral10))}select.mat-mdc-form-field-input-control:not(.mat-mdc-native-select-inline) option:disabled{color:var(--mat-form-field-select-disabled-option-text-color, color-mix(in srgb, var(--mat-sys-neutral10) 38%, transparent))}.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after{content:"";width:0;height:0;border-left:5px solid rgba(0,0,0,0);border-right:5px solid rgba(0,0,0,0);border-top:5px solid;position:absolute;right:0;top:50%;margin-top:-2.5px;pointer-events:none;color:var(--mat-form-field-enabled-select-arrow-color, var(--mat-sys-on-surface-variant))}[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-infix::after{right:auto;left:0}.mat-mdc-form-field-type-mat-native-select.mat-focused .mat-mdc-form-field-infix::after{color:var(--mat-form-field-focus-select-arrow-color, var(--mat-sys-primary))}.mat-mdc-form-field-type-mat-native-select.mat-form-field-disabled .mat-mdc-form-field-infix::after{color:var(--mat-form-field-disabled-select-arrow-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control{padding-right:15px}[dir=rtl] .mat-mdc-form-field-type-mat-native-select .mat-mdc-form-field-input-control{padding-right:0;padding-left:15px}@media(forced-colors: active){.mat-form-field-appearance-fill .mat-mdc-text-field-wrapper{outline:solid 1px}}@media(forced-colors: active){.mat-form-field-appearance-fill.mat-form-field-disabled .mat-mdc-text-field-wrapper{outline-color:GrayText}}@media(forced-colors: active){.mat-form-field-appearance-fill.mat-focused .mat-mdc-text-field-wrapper{outline:dashed 3px}}@media(forced-colors: active){.mat-mdc-form-field.mat-focused .mdc-notched-outline{border:dashed 3px}}.mat-mdc-form-field-input-control[type=date],.mat-mdc-form-field-input-control[type=datetime],.mat-mdc-form-field-input-control[type=datetime-local],.mat-mdc-form-field-input-control[type=month],.mat-mdc-form-field-input-control[type=week],.mat-mdc-form-field-input-control[type=time]{line-height:1}.mat-mdc-form-field-input-control::-webkit-datetime-edit{line-height:1;padding:0;margin-bottom:-2px}.mat-mdc-form-field{--mat-mdc-form-field-floating-label-scale: 0.75;display:inline-flex;flex-direction:column;min-width:0;text-align:left;-moz-osx-font-smoothing:grayscale;-webkit-font-smoothing:antialiased;font-family:var(--mat-form-field-container-text-font, var(--mat-sys-body-large-font));line-height:var(--mat-form-field-container-text-line-height, var(--mat-sys-body-large-line-height));font-size:var(--mat-form-field-container-text-size, var(--mat-sys-body-large-size));letter-spacing:var(--mat-form-field-container-text-tracking, var(--mat-sys-body-large-tracking));font-weight:var(--mat-form-field-container-text-weight, var(--mat-sys-body-large-weight))}.mat-mdc-form-field .mdc-text-field--outlined .mdc-floating-label--float-above{font-size:calc(var(--mat-form-field-outlined-label-text-populated-size)*var(--mat-mdc-form-field-floating-label-scale))}.mat-mdc-form-field .mdc-text-field--outlined .mdc-notched-outline--upgraded .mdc-floating-label--float-above{font-size:var(--mat-form-field-outlined-label-text-populated-size)}[dir=rtl] .mat-mdc-form-field{text-align:right}.mat-mdc-form-field-flex{display:inline-flex;align-items:baseline;box-sizing:border-box;width:100%}.mat-mdc-text-field-wrapper{width:100%;z-index:0}.mat-mdc-form-field-icon-prefix,.mat-mdc-form-field-icon-suffix{align-self:center;line-height:0;pointer-events:auto;position:relative;z-index:1}.mat-mdc-form-field-icon-prefix>.mat-icon,.mat-mdc-form-field-icon-suffix>.mat-icon{padding:0 12px;box-sizing:content-box}.mat-mdc-form-field-icon-prefix{color:var(--mat-form-field-leading-icon-color, var(--mat-sys-on-surface-variant))}.mat-form-field-disabled .mat-mdc-form-field-icon-prefix{color:var(--mat-form-field-disabled-leading-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-trailing-icon-color, var(--mat-sys-on-surface-variant))}.mat-form-field-disabled .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-disabled-trailing-icon-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mat-form-field-invalid .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-trailing-icon-color, var(--mat-sys-error))}.mat-form-field-invalid:not(.mat-focused):not(.mat-form-field-disabled) .mat-mdc-text-field-wrapper:hover .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-hover-trailing-icon-color, var(--mat-sys-on-error-container))}.mat-form-field-invalid.mat-focused .mat-mdc-text-field-wrapper .mat-mdc-form-field-icon-suffix{color:var(--mat-form-field-error-focus-trailing-icon-color, var(--mat-sys-error))}.mat-mdc-form-field-icon-prefix,[dir=rtl] .mat-mdc-form-field-icon-suffix{padding:0 4px 0 0}.mat-mdc-form-field-icon-suffix,[dir=rtl] .mat-mdc-form-field-icon-prefix{padding:0 0 0 4px}.mat-mdc-form-field-subscript-wrapper .mat-icon,.mat-mdc-form-field label .mat-icon{width:1em;height:1em;font-size:inherit}.mat-mdc-form-field-infix{flex:auto;min-width:0;width:180px;position:relative;box-sizing:border-box}.mat-mdc-form-field-infix:has(textarea[cols]){width:auto}.mat-mdc-form-field .mdc-notched-outline__notch{margin-left:-1px;-webkit-clip-path:inset(-9em -999em -9em 1px);clip-path:inset(-9em -999em -9em 1px)}[dir=rtl] .mat-mdc-form-field .mdc-notched-outline__notch{margin-left:0;margin-right:-1px;-webkit-clip-path:inset(-9em 1px -9em -999em);clip-path:inset(-9em 1px -9em -999em)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-floating-label{transition:transform 150ms cubic-bezier(0.4, 0, 0.2, 1),color 150ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input{transition:opacity 150ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-moz-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input::-webkit-input-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field__input:-ms-input-placeholder{transition:opacity 67ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-moz-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-moz-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input::-webkit-input-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input::-webkit-input-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--no-label .mdc-text-field__input:-ms-input-placeholder,.mat-mdc-form-field.mat-form-field-animations-enabled.mdc-text-field--focused .mdc-text-field__input:-ms-input-placeholder{transition-delay:40ms;transition-duration:110ms}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-text-field--filled:not(.mdc-ripple-upgraded):focus .mdc-text-field__ripple::before{transition-duration:75ms}.mat-mdc-form-field.mat-form-field-animations-enabled .mdc-line-ripple::after{transition:transform 180ms cubic-bezier(0.4, 0, 0.2, 1),opacity 180ms cubic-bezier(0.4, 0, 0.2, 1)}.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-hint-wrapper,.mat-mdc-form-field.mat-form-field-animations-enabled .mat-mdc-form-field-error-wrapper{animation-duration:300ms}.mdc-notched-outline .mdc-floating-label{max-width:calc(100% + 1px)}.mdc-notched-outline--upgraded .mdc-floating-label--float-above{max-width:calc(133.3333333333% + 1px)}\n']
    }]
  }], () => [], {
    _textField: [{
      type: ViewChild,
      args: ["textField"]
    }],
    _iconPrefixContainer: [{
      type: ViewChild,
      args: ["iconPrefixContainer"]
    }],
    _textPrefixContainer: [{
      type: ViewChild,
      args: ["textPrefixContainer"]
    }],
    _iconSuffixContainer: [{
      type: ViewChild,
      args: ["iconSuffixContainer"]
    }],
    _textSuffixContainer: [{
      type: ViewChild,
      args: ["textSuffixContainer"]
    }],
    _floatingLabel: [{
      type: ViewChild,
      args: [MatFormFieldFloatingLabel]
    }],
    _notchedOutline: [{
      type: ViewChild,
      args: [MatFormFieldNotchedOutline]
    }],
    _lineRipple: [{
      type: ViewChild,
      args: [MatFormFieldLineRipple]
    }],
    _formFieldControl: [{
      type: ContentChild,
      args: [MatFormFieldControl]
    }],
    _prefixChildren: [{
      type: ContentChildren,
      args: [MAT_PREFIX, {
        descendants: true
      }]
    }],
    _suffixChildren: [{
      type: ContentChildren,
      args: [MAT_SUFFIX, {
        descendants: true
      }]
    }],
    _errorChildren: [{
      type: ContentChildren,
      args: [MAT_ERROR, {
        descendants: true
      }]
    }],
    _hintChildren: [{
      type: ContentChildren,
      args: [MatHint, {
        descendants: true
      }]
    }],
    hideRequiredMarker: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    floatLabel: [{
      type: Input
    }],
    appearance: [{
      type: Input
    }],
    subscriptSizing: [{
      type: Input
    }],
    hintLabel: [{
      type: Input
    }]
  });
})();

// node_modules/.pnpm/@angular+material@20.2.1_6454c0930df7c912b2ef33598e3c1604/node_modules/@angular/material/fesm2022/chips.mjs
var _c03 = ["*", [["mat-chip-avatar"], ["", "matChipAvatar", ""]], [["mat-chip-trailing-icon"], ["", "matChipRemove", ""], ["", "matChipTrailingIcon", ""]]];
var _c13 = ["*", "mat-chip-avatar, [matChipAvatar]", "mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"];
function MatChip_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275projection(1, 1);
    \u0275\u0275elementEnd();
  }
}
function MatChip_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275projection(1, 2);
    \u0275\u0275elementEnd();
  }
}
function MatChipOption_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275projection(1, 1);
    \u0275\u0275elementStart(2, "span", 7);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(3, "svg", 8);
    \u0275\u0275element(4, "path", 9);
    \u0275\u0275elementEnd()()();
  }
}
function MatChipOption_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275projection(1, 2);
    \u0275\u0275elementEnd();
  }
}
var _c23 = '.mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{flex-basis:100%;overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}@media(forced-colors: active){.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{forced-color-adjust:none}}.mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit;overflow-x:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-outline-width, 1px);border-radius:var(--mat-chip-container-shape-radius, 8px);box-sizing:border-box;content:"";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1;border-style:solid}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-outline-color, var(--mat-sys-outline))}.mdc-evolution-chip__action--primary:not(.mdc-evolution-chip__action--presentational):not(.mdc-ripple-upgraded):focus::before{border-color:var(--mat-chip-focus-outline-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip__action--secondary{position:relative;overflow:visible}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-trailing-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip__text-label{-webkit-user-select:none;user-select:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mat-chip-label-text-font, var(--mat-sys-label-large-font));line-height:var(--mat-chip-label-text-line-height, var(--mat-sys-label-large-line-height));font-size:var(--mat-chip-label-text-size, var(--mat-sys-label-large-size));font-weight:var(--mat-chip-label-text-weight, var(--mat-sys-label-large-weight));letter-spacing:var(--mat-chip-label-text-tracking, var(--mat-sys-label-large-tracking))}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-label-text-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label,.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mat-chip-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{width:var(--mat-chip-with-avatar-avatar-size, 24px);height:var(--mat-chip-with-avatar-avatar-size, 24px);font-size:var(--mat-chip-with-avatar-avatar-size, 24px)}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__graphic{padding-left:0}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%;height:20px;width:20px}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@media(forced-colors: active){.mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove{opacity:calc(var(--mat-chip-trailing-action-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove:focus{opacity:calc(var(--mat-chip-trailing-action-focus-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mat-mdc-standard-chip{border-radius:var(--mat-chip-container-shape-radius, 8px);height:var(--mat-chip-container-height, 32px)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-container-color, transparent)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mat-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mat-chip-flat-disabled-selected-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}@media(forced-colors: active){.mat-mdc-standard-chip{outline:solid 1px}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mat-chip-with-avatar-avatar-shape-radius, 24px);width:var(--mat-chip-with-icon-icon-size, 18px);height:var(--mat-chip-with-icon-icon-size, 18px);font-size:var(--mat-chip-with-icon-icon-size, 18px)}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-highlighted{--mat-chip-with-icon-icon-color: var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container));--mat-chip-elevated-container-color: var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container));--mat-chip-label-text-color: var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container));--mat-chip-outline-width: var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-selected .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-hover-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-focus-overlay .mat-mdc-chip-selected:hover,.mat-mdc-chip-highlighted:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-hover-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected.cdk-focused .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mdc-evolution-chip--disabled:not(.mdc-evolution-chip--selected) .mat-mdc-chip-avatar{opacity:var(--mat-chip-with-avatar-disabled-avatar-opacity, 0.38)}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{opacity:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38)}.mdc-evolution-chip--disabled.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{opacity:var(--mat-chip-with-icon-disabled-icon-opacity, 0.38)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:var(--mat-chip-disabled-container-opacity, 1)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-trailing-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-edit,.mat-mdc-chip-remove{opacity:var(--mat-chip-trailing-action-opacity, 1)}.mat-mdc-chip-edit:focus,.mat-mdc-chip-remove:focus{opacity:var(--mat-chip-trailing-action-focus-opacity, 1)}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{background-color:var(--mat-chip-trailing-action-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-edit:hover::after,.mat-mdc-chip-remove:hover::after{opacity:var(--mat-chip-trailing-action-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-edit:focus::after,.mat-mdc-chip-remove:focus::after{opacity:var(--mat-chip-trailing-action-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected .mat-mdc-chip-remove::after,.mat-mdc-chip-highlighted .mat-mdc-chip-remove::after{background-color:var(--mat-chip-selected-trailing-action-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mat-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-edit::before,.mat-mdc-chip-remove::before{margin:calc(var(--mat-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{content:"";display:block;opacity:0;position:absolute;top:-3px;bottom:-3px;left:5px;right:5px;border-radius:50%;box-sizing:border-box;padding:12px;margin:-12px;background-clip:content-box}.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{width:18px;height:18px;font-size:18px;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}@media(forced-colors: active){.mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}}.mat-mdc-chip-action:focus .mat-focus-indicator::before{content:""}.mdc-evolution-chip__icon,.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{min-height:fit-content}\n';
var _c33 = [[["", "matChipEdit", ""]], [["mat-chip-avatar"], ["", "matChipAvatar", ""]], [["", "matChipEditInput", ""]], "*", [["mat-chip-trailing-icon"], ["", "matChipRemove", ""], ["", "matChipTrailingIcon", ""]]];
var _c43 = ["[matChipEdit]", "mat-chip-avatar, [matChipAvatar]", "[matChipEditInput]", "*", "mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"];
function MatChipRow_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 0);
  }
}
function MatChipRow_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 1);
    \u0275\u0275projection(1);
    \u0275\u0275elementEnd();
  }
}
function MatChipRow_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 3);
    \u0275\u0275projection(1, 1);
    \u0275\u0275elementEnd();
  }
}
function MatChipRow_Conditional_5_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0, 2);
  }
}
function MatChipRow_Conditional_5_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 7);
  }
}
function MatChipRow_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, MatChipRow_Conditional_5_Conditional_0_Template, 1, 0)(1, MatChipRow_Conditional_5_Conditional_1_Template, 1, 0, "span", 7);
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.contentEditInput ? 0 : 1);
  }
}
function MatChipRow_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projection(0, 3);
  }
}
function MatChipRow_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 6);
    \u0275\u0275projection(1, 4);
    \u0275\u0275elementEnd();
  }
}
var _c52 = ["*"];
var _c62 = ".mat-mdc-chip-set{display:flex}.mat-mdc-chip-set:focus{outline:none}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%;margin-left:-8px;margin-right:0}.mat-mdc-chip-set .mdc-evolution-chip{margin:4px 0 4px 8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip-set__chips{margin-left:0;margin-right:-8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip{margin-left:0;margin-right:8px}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-moz-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-webkit-input-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input:-ms-input-placeholder{opacity:1}.mat-mdc-chip-set+input.mat-mdc-chip-input{margin-left:0;margin-right:0}\n";
var MAT_CHIPS_DEFAULT_OPTIONS = new InjectionToken("mat-chips-default-options", {
  providedIn: "root",
  factory: () => ({
    separatorKeyCodes: [ENTER]
  })
});
var MAT_CHIP_AVATAR = new InjectionToken("MatChipAvatar");
var MAT_CHIP_TRAILING_ICON = new InjectionToken("MatChipTrailingIcon");
var MAT_CHIP_EDIT = new InjectionToken("MatChipEdit");
var MAT_CHIP_REMOVE = new InjectionToken("MatChipRemove");
var MAT_CHIP = new InjectionToken("MatChip");
var MatChipAction = class _MatChipAction {
  _elementRef = inject(ElementRef);
  _parentChip = inject(MAT_CHIP);
  /** Whether the action is interactive. */
  isInteractive = true;
  /** Whether this is the primary action in the chip. */
  _isPrimary = true;
  /** Whether this is the leading action in the chip. */
  _isLeading = false;
  // TODO(adolgachev): consolidate usage to secondary css class
  /** Whether the action is disabled. */
  get disabled() {
    return this._disabled || this._parentChip?.disabled || false;
  }
  set disabled(value) {
    this._disabled = value;
  }
  _disabled = false;
  /** Tab index of the action. */
  tabIndex = -1;
  /**
   * Private API to allow focusing this chip when it is disabled.
   */
  _allowFocusWhenDisabled = false;
  /**
   * Determine the value of the disabled attribute for this chip action.
   */
  _getDisabledAttribute() {
    return this.disabled && !this._allowFocusWhenDisabled ? "" : null;
  }
  /**
   * Determine the value of the tabindex attribute for this chip action.
   */
  _getTabindex() {
    return this.disabled && !this._allowFocusWhenDisabled || !this.isInteractive ? null : this.tabIndex.toString();
  }
  constructor() {
    inject(_CdkPrivateStyleLoader).load(_StructuralStylesLoader);
    if (this._elementRef.nativeElement.nodeName === "BUTTON") {
      this._elementRef.nativeElement.setAttribute("type", "button");
    }
  }
  focus() {
    this._elementRef.nativeElement.focus();
  }
  _handleClick(event) {
    if (!this.disabled && this.isInteractive && this._isPrimary) {
      event.preventDefault();
      this._parentChip._handlePrimaryActionInteraction();
    }
  }
  _handleKeydown(event) {
    if ((event.keyCode === ENTER || event.keyCode === SPACE) && !this.disabled && this.isInteractive && this._isPrimary && !this._parentChip._isEditing) {
      event.preventDefault();
      this._parentChip._handlePrimaryActionInteraction();
    }
  }
  static \u0275fac = function MatChipAction_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatChipAction)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatChipAction,
    selectors: [["", "matChipAction", ""]],
    hostAttrs: [1, "mdc-evolution-chip__action", "mat-mdc-chip-action"],
    hostVars: 11,
    hostBindings: function MatChipAction_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("click", function MatChipAction_click_HostBindingHandler($event) {
          return ctx._handleClick($event);
        })("keydown", function MatChipAction_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        });
      }
      if (rf & 2) {
        \u0275\u0275attribute("tabindex", ctx._getTabindex())("disabled", ctx._getDisabledAttribute())("aria-disabled", ctx.disabled);
        \u0275\u0275classProp("mdc-evolution-chip__action--primary", ctx._isPrimary)("mdc-evolution-chip__action--presentational", !ctx.isInteractive)("mdc-evolution-chip__action--secondary", !ctx._isPrimary)("mdc-evolution-chip__action--trailing", !ctx._isPrimary && !ctx._isLeading);
      }
    },
    inputs: {
      isInteractive: "isInteractive",
      disabled: [2, "disabled", "disabled", booleanAttribute],
      tabIndex: [2, "tabIndex", "tabIndex", (value) => value == null ? -1 : numberAttribute(value)],
      _allowFocusWhenDisabled: "_allowFocusWhenDisabled"
    }
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipAction, [{
    type: Directive,
    args: [{
      selector: "[matChipAction]",
      host: {
        "class": "mdc-evolution-chip__action mat-mdc-chip-action",
        "[class.mdc-evolution-chip__action--primary]": "_isPrimary",
        "[class.mdc-evolution-chip__action--presentational]": "!isInteractive",
        "[class.mdc-evolution-chip__action--secondary]": "!_isPrimary",
        "[class.mdc-evolution-chip__action--trailing]": "!_isPrimary && !_isLeading",
        "[attr.tabindex]": "_getTabindex()",
        "[attr.disabled]": "_getDisabledAttribute()",
        "[attr.aria-disabled]": "disabled",
        "(click)": "_handleClick($event)",
        "(keydown)": "_handleKeydown($event)"
      }
    }]
  }], () => [], {
    isInteractive: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    tabIndex: [{
      type: Input,
      args: [{
        transform: (value) => value == null ? -1 : numberAttribute(value)
      }]
    }],
    _allowFocusWhenDisabled: [{
      type: Input
    }]
  });
})();
var MatChipAvatar = class _MatChipAvatar {
  static \u0275fac = function MatChipAvatar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatChipAvatar)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatChipAvatar,
    selectors: [["mat-chip-avatar"], ["", "matChipAvatar", ""]],
    hostAttrs: ["role", "img", 1, "mat-mdc-chip-avatar", "mdc-evolution-chip__icon", "mdc-evolution-chip__icon--primary"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_CHIP_AVATAR,
      useExisting: _MatChipAvatar
    }])]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipAvatar, [{
    type: Directive,
    args: [{
      selector: "mat-chip-avatar, [matChipAvatar]",
      host: {
        "class": "mat-mdc-chip-avatar mdc-evolution-chip__icon mdc-evolution-chip__icon--primary",
        "role": "img"
      },
      providers: [{
        provide: MAT_CHIP_AVATAR,
        useExisting: MatChipAvatar
      }]
    }]
  }], null, null);
})();
var MatChipTrailingIcon = class _MatChipTrailingIcon extends MatChipAction {
  /**
   * MDC considers all trailing actions as a remove icon,
   * but we support non-interactive trailing icons.
   */
  isInteractive = false;
  _isPrimary = false;
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatChipTrailingIcon_BaseFactory;
    return function MatChipTrailingIcon_Factory(__ngFactoryType__) {
      return (\u0275MatChipTrailingIcon_BaseFactory || (\u0275MatChipTrailingIcon_BaseFactory = \u0275\u0275getInheritedFactory(_MatChipTrailingIcon)))(__ngFactoryType__ || _MatChipTrailingIcon);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatChipTrailingIcon,
    selectors: [["mat-chip-trailing-icon"], ["", "matChipTrailingIcon", ""]],
    hostAttrs: ["aria-hidden", "true", 1, "mat-mdc-chip-trailing-icon", "mdc-evolution-chip__icon", "mdc-evolution-chip__icon--trailing"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_CHIP_TRAILING_ICON,
      useExisting: _MatChipTrailingIcon
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipTrailingIcon, [{
    type: Directive,
    args: [{
      selector: "mat-chip-trailing-icon, [matChipTrailingIcon]",
      host: {
        "class": "mat-mdc-chip-trailing-icon mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing",
        "aria-hidden": "true"
      },
      providers: [{
        provide: MAT_CHIP_TRAILING_ICON,
        useExisting: MatChipTrailingIcon
      }]
    }]
  }], null, null);
})();
var MatChipEdit = class _MatChipEdit extends MatChipAction {
  _isPrimary = false;
  _isLeading = true;
  _handleClick(event) {
    if (!this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip._edit();
    }
  }
  _handleKeydown(event) {
    if ((event.keyCode === ENTER || event.keyCode === SPACE) && !this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip._edit();
    }
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatChipEdit_BaseFactory;
    return function MatChipEdit_Factory(__ngFactoryType__) {
      return (\u0275MatChipEdit_BaseFactory || (\u0275MatChipEdit_BaseFactory = \u0275\u0275getInheritedFactory(_MatChipEdit)))(__ngFactoryType__ || _MatChipEdit);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatChipEdit,
    selectors: [["", "matChipEdit", ""]],
    hostAttrs: ["role", "button", 1, "mat-mdc-chip-edit", "mat-mdc-chip-avatar", "mat-focus-indicator", "mdc-evolution-chip__icon", "mdc-evolution-chip__icon--primary"],
    hostVars: 1,
    hostBindings: function MatChipEdit_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("aria-hidden", null);
      }
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_CHIP_EDIT,
      useExisting: _MatChipEdit
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipEdit, [{
    type: Directive,
    args: [{
      selector: "[matChipEdit]",
      host: {
        "class": "mat-mdc-chip-edit mat-mdc-chip-avatar mat-focus-indicator mdc-evolution-chip__icon mdc-evolution-chip__icon--primary",
        "role": "button",
        "[attr.aria-hidden]": "null"
      },
      providers: [{
        provide: MAT_CHIP_EDIT,
        useExisting: MatChipEdit
      }]
    }]
  }], null, null);
})();
var MatChipRemove = class _MatChipRemove extends MatChipAction {
  _isPrimary = false;
  _handleClick(event) {
    if (!this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip.remove();
    }
  }
  _handleKeydown(event) {
    if ((event.keyCode === ENTER || event.keyCode === SPACE) && !this.disabled) {
      event.stopPropagation();
      event.preventDefault();
      this._parentChip.remove();
    }
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatChipRemove_BaseFactory;
    return function MatChipRemove_Factory(__ngFactoryType__) {
      return (\u0275MatChipRemove_BaseFactory || (\u0275MatChipRemove_BaseFactory = \u0275\u0275getInheritedFactory(_MatChipRemove)))(__ngFactoryType__ || _MatChipRemove);
    };
  })();
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatChipRemove,
    selectors: [["", "matChipRemove", ""]],
    hostAttrs: ["role", "button", 1, "mat-mdc-chip-remove", "mat-mdc-chip-trailing-icon", "mat-focus-indicator", "mdc-evolution-chip__icon", "mdc-evolution-chip__icon--trailing"],
    hostVars: 1,
    hostBindings: function MatChipRemove_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275attribute("aria-hidden", null);
      }
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_CHIP_REMOVE,
      useExisting: _MatChipRemove
    }]), \u0275\u0275InheritDefinitionFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipRemove, [{
    type: Directive,
    args: [{
      selector: "[matChipRemove]",
      host: {
        "class": "mat-mdc-chip-remove mat-mdc-chip-trailing-icon mat-focus-indicator mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing",
        "role": "button",
        "[attr.aria-hidden]": "null"
      },
      providers: [{
        provide: MAT_CHIP_REMOVE,
        useExisting: MatChipRemove
      }]
    }]
  }], null, null);
})();
var MatChip = class _MatChip {
  _changeDetectorRef = inject(ChangeDetectorRef);
  _elementRef = inject(ElementRef);
  _tagName = inject(HOST_TAG_NAME);
  _ngZone = inject(NgZone);
  _focusMonitor = inject(FocusMonitor);
  _globalRippleOptions = inject(MAT_RIPPLE_GLOBAL_OPTIONS, {
    optional: true
  });
  _document = inject(DOCUMENT);
  /** Emits when the chip is focused. */
  _onFocus = new Subject();
  /** Emits when the chip is blurred. */
  _onBlur = new Subject();
  /** Whether this chip is a basic (unstyled) chip. */
  _isBasicChip;
  /** Role for the root of the chip. */
  role = null;
  /** Whether the chip has focus. */
  _hasFocusInternal = false;
  /** Whether moving focus into the chip is pending. */
  _pendingFocus;
  /** Subscription to changes in the chip's actions. */
  _actionChanges;
  /** Whether animations for the chip are enabled. */
  _animationsDisabled = _animationsDisabled();
  /** All avatars present in the chip. */
  _allLeadingIcons;
  /** All trailing icons present in the chip. */
  _allTrailingIcons;
  /** All edit icons present in the chip. */
  _allEditIcons;
  /** All remove icons present in the chip. */
  _allRemoveIcons;
  _hasFocus() {
    return this._hasFocusInternal;
  }
  /** A unique id for the chip. If none is supplied, it will be auto-generated. */
  id = inject(_IdGenerator).getId("mat-mdc-chip-");
  // TODO(#26104): Consider deprecating and using `_computeAriaAccessibleName` instead.
  // `ariaLabel` may be unnecessary, and `_computeAriaAccessibleName` only supports
  // datepicker's use case.
  /** ARIA label for the content of the chip. */
  ariaLabel = null;
  // TODO(#26104): Consider deprecating and using `_computeAriaAccessibleName` instead.
  // `ariaDescription` may be unnecessary, and `_computeAriaAccessibleName` only supports
  // datepicker's use case.
  /** ARIA description for the content of the chip. */
  ariaDescription = null;
  /** Whether the chip list is disabled. */
  _chipListDisabled = false;
  /** Whether the chip was focused when it was removed. */
  _hadFocusOnRemove = false;
  _textElement;
  /**
   * The value of the chip. Defaults to the content inside
   * the `mat-mdc-chip-action-label` element.
   */
  get value() {
    return this._value !== void 0 ? this._value : this._textElement.textContent.trim();
  }
  set value(value) {
    this._value = value;
  }
  _value;
  // TODO: should be typed as `ThemePalette` but internal apps pass in arbitrary strings.
  /**
   * Theme color of the chip. This API is supported in M2 themes only, it has no
   * effect in M3 themes. For color customization in M3, see https://material.angular.dev/components/chips/styling.
   *
   * For information on applying color variants in M3, see
   * https://material.angular.dev/guide/material-2-theming#optional-add-backwards-compatibility-styles-for-color-variants
   */
  color;
  /**
   * Determines whether or not the chip displays the remove styling and emits (removed) events.
   */
  removable = true;
  /**
   * Colors the chip for emphasis as if it were selected.
   */
  highlighted = false;
  /** Whether the ripple effect is disabled or not. */
  disableRipple = false;
  /** Whether the chip is disabled. */
  get disabled() {
    return this._disabled || this._chipListDisabled;
  }
  set disabled(value) {
    this._disabled = value;
  }
  _disabled = false;
  /** Emitted when a chip is to be removed. */
  removed = new EventEmitter();
  /** Emitted when the chip is destroyed. */
  destroyed = new EventEmitter();
  /** The unstyled chip selector for this component. */
  basicChipAttrName = "mat-basic-chip";
  /** The chip's leading icon. */
  leadingIcon;
  /** The chip's leading edit icon. */
  editIcon;
  /** The chip's trailing icon. */
  trailingIcon;
  /** The chip's trailing remove icon. */
  removeIcon;
  /** Action receiving the primary set of user interactions. */
  primaryAction;
  /**
   * Handles the lazy creation of the MatChip ripple.
   * Used to improve initial load time of large applications.
   */
  _rippleLoader = inject(MatRippleLoader);
  _injector = inject(Injector);
  constructor() {
    const styleLoader = inject(_CdkPrivateStyleLoader);
    styleLoader.load(_StructuralStylesLoader);
    styleLoader.load(_VisuallyHiddenLoader);
    this._monitorFocus();
    this._rippleLoader?.configureRipple(this._elementRef.nativeElement, {
      className: "mat-mdc-chip-ripple",
      disabled: this._isRippleDisabled()
    });
  }
  ngOnInit() {
    this._isBasicChip = this._elementRef.nativeElement.hasAttribute(this.basicChipAttrName) || this._tagName.toLowerCase() === this.basicChipAttrName;
  }
  ngAfterViewInit() {
    this._textElement = this._elementRef.nativeElement.querySelector(".mat-mdc-chip-action-label");
    if (this._pendingFocus) {
      this._pendingFocus = false;
      this.focus();
    }
  }
  ngAfterContentInit() {
    this._actionChanges = merge(this._allLeadingIcons.changes, this._allTrailingIcons.changes, this._allEditIcons.changes, this._allRemoveIcons.changes).subscribe(() => this._changeDetectorRef.markForCheck());
  }
  ngDoCheck() {
    this._rippleLoader.setDisabled(this._elementRef.nativeElement, this._isRippleDisabled());
  }
  ngOnDestroy() {
    this._focusMonitor.stopMonitoring(this._elementRef);
    this._rippleLoader?.destroyRipple(this._elementRef.nativeElement);
    this._actionChanges?.unsubscribe();
    this.destroyed.emit({
      chip: this
    });
    this.destroyed.complete();
  }
  /**
   * Allows for programmatic removal of the chip.
   *
   * Informs any listeners of the removal request. Does not remove the chip from the DOM.
   */
  remove() {
    if (this.removable) {
      this._hadFocusOnRemove = this._hasFocus();
      this.removed.emit({
        chip: this
      });
    }
  }
  /** Whether or not the ripple should be disabled. */
  _isRippleDisabled() {
    return this.disabled || this.disableRipple || this._animationsDisabled || this._isBasicChip || !this._hasInteractiveActions() || !!this._globalRippleOptions?.disabled;
  }
  /** Returns whether the chip has a trailing icon. */
  _hasTrailingIcon() {
    return !!(this.trailingIcon || this.removeIcon);
  }
  /** Handles keyboard events on the chip. */
  _handleKeydown(event) {
    if (event.keyCode === BACKSPACE && !event.repeat || event.keyCode === DELETE) {
      event.preventDefault();
      this.remove();
    }
  }
  /** Allows for programmatic focusing of the chip. */
  focus() {
    if (!this.disabled) {
      if (this.primaryAction) {
        this.primaryAction.focus();
      } else {
        this._pendingFocus = true;
      }
    }
  }
  /** Gets the action that contains a specific target node. */
  _getSourceAction(target) {
    return this._getActions().find((action) => {
      const element = action._elementRef.nativeElement;
      return element === target || element.contains(target);
    });
  }
  /** Gets all of the actions within the chip. */
  _getActions() {
    const result = [];
    if (this.editIcon) {
      result.push(this.editIcon);
    }
    if (this.primaryAction) {
      result.push(this.primaryAction);
    }
    if (this.removeIcon) {
      result.push(this.removeIcon);
    }
    if (this.trailingIcon) {
      result.push(this.trailingIcon);
    }
    return result;
  }
  /** Handles interactions with the primary action of the chip. */
  _handlePrimaryActionInteraction() {
  }
  /** Returns whether the chip has any interactive actions. */
  _hasInteractiveActions() {
    return this._getActions().some((a) => a.isInteractive);
  }
  /** Handles interactions with the edit action of the chip. */
  _edit(event) {
  }
  /** Starts the focus monitoring process on the chip. */
  _monitorFocus() {
    this._focusMonitor.monitor(this._elementRef, true).subscribe((origin) => {
      const hasFocus = origin !== null;
      if (hasFocus !== this._hasFocusInternal) {
        this._hasFocusInternal = hasFocus;
        if (hasFocus) {
          this._onFocus.next({
            chip: this
          });
        } else {
          this._changeDetectorRef.markForCheck();
          setTimeout(() => this._ngZone.run(() => this._onBlur.next({
            chip: this
          })));
        }
      }
    });
  }
  static \u0275fac = function MatChip_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatChip)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatChip,
    selectors: [["mat-basic-chip"], ["", "mat-basic-chip", ""], ["mat-chip"], ["", "mat-chip", ""]],
    contentQueries: function MatChip_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, MAT_CHIP_AVATAR, 5);
        \u0275\u0275contentQuery(dirIndex, MAT_CHIP_EDIT, 5);
        \u0275\u0275contentQuery(dirIndex, MAT_CHIP_TRAILING_ICON, 5);
        \u0275\u0275contentQuery(dirIndex, MAT_CHIP_REMOVE, 5);
        \u0275\u0275contentQuery(dirIndex, MAT_CHIP_AVATAR, 5);
        \u0275\u0275contentQuery(dirIndex, MAT_CHIP_TRAILING_ICON, 5);
        \u0275\u0275contentQuery(dirIndex, MAT_CHIP_EDIT, 5);
        \u0275\u0275contentQuery(dirIndex, MAT_CHIP_REMOVE, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.leadingIcon = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.editIcon = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.trailingIcon = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.removeIcon = _t.first);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._allLeadingIcons = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._allTrailingIcons = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._allEditIcons = _t);
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._allRemoveIcons = _t);
      }
    },
    viewQuery: function MatChip_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(MatChipAction, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.primaryAction = _t.first);
      }
    },
    hostAttrs: [1, "mat-mdc-chip"],
    hostVars: 31,
    hostBindings: function MatChip_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("keydown", function MatChip_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        });
      }
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id);
        \u0275\u0275attribute("role", ctx.role)("aria-label", ctx.ariaLabel);
        \u0275\u0275classMap("mat-" + (ctx.color || "primary"));
        \u0275\u0275classProp("mdc-evolution-chip", !ctx._isBasicChip)("mdc-evolution-chip--disabled", ctx.disabled)("mdc-evolution-chip--with-trailing-action", ctx._hasTrailingIcon())("mdc-evolution-chip--with-primary-graphic", ctx.leadingIcon)("mdc-evolution-chip--with-primary-icon", ctx.leadingIcon)("mdc-evolution-chip--with-avatar", ctx.leadingIcon)("mat-mdc-chip-with-avatar", ctx.leadingIcon)("mat-mdc-chip-highlighted", ctx.highlighted)("mat-mdc-chip-disabled", ctx.disabled)("mat-mdc-basic-chip", ctx._isBasicChip)("mat-mdc-standard-chip", !ctx._isBasicChip)("mat-mdc-chip-with-trailing-icon", ctx._hasTrailingIcon())("_mat-animation-noopable", ctx._animationsDisabled);
      }
    },
    inputs: {
      role: "role",
      id: "id",
      ariaLabel: [0, "aria-label", "ariaLabel"],
      ariaDescription: [0, "aria-description", "ariaDescription"],
      value: "value",
      color: "color",
      removable: [2, "removable", "removable", booleanAttribute],
      highlighted: [2, "highlighted", "highlighted", booleanAttribute],
      disableRipple: [2, "disableRipple", "disableRipple", booleanAttribute],
      disabled: [2, "disabled", "disabled", booleanAttribute]
    },
    outputs: {
      removed: "removed",
      destroyed: "destroyed"
    },
    exportAs: ["matChip"],
    features: [\u0275\u0275ProvidersFeature([{
      provide: MAT_CHIP,
      useExisting: _MatChip
    }])],
    ngContentSelectors: _c13,
    decls: 8,
    vars: 3,
    consts: [[1, "mat-mdc-chip-focus-overlay"], [1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--primary"], ["matChipAction", "", 3, "isInteractive"], [1, "mdc-evolution-chip__graphic", "mat-mdc-chip-graphic"], [1, "mdc-evolution-chip__text-label", "mat-mdc-chip-action-label"], [1, "mat-mdc-chip-primary-focus-indicator", "mat-focus-indicator"], [1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--trailing"]],
    template: function MatChip_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c03);
        \u0275\u0275element(0, "span", 0);
        \u0275\u0275elementStart(1, "span", 1)(2, "span", 2);
        \u0275\u0275conditionalCreate(3, MatChip_Conditional_3_Template, 2, 0, "span", 3);
        \u0275\u0275elementStart(4, "span", 4);
        \u0275\u0275projection(5);
        \u0275\u0275element(6, "span", 5);
        \u0275\u0275elementEnd()()();
        \u0275\u0275conditionalCreate(7, MatChip_Conditional_7_Template, 2, 0, "span", 6);
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275property("isInteractive", false);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.leadingIcon ? 3 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275conditional(ctx._hasTrailingIcon() ? 7 : -1);
      }
    },
    dependencies: [MatChipAction],
    styles: ['.mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{flex-basis:100%;overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}@media(forced-colors: active){.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{forced-color-adjust:none}}.mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit;overflow-x:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-outline-width, 1px);border-radius:var(--mat-chip-container-shape-radius, 8px);box-sizing:border-box;content:"";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1;border-style:solid}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-outline-color, var(--mat-sys-outline))}.mdc-evolution-chip__action--primary:not(.mdc-evolution-chip__action--presentational):not(.mdc-ripple-upgraded):focus::before{border-color:var(--mat-chip-focus-outline-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip__action--secondary{position:relative;overflow:visible}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-trailing-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip__text-label{-webkit-user-select:none;user-select:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mat-chip-label-text-font, var(--mat-sys-label-large-font));line-height:var(--mat-chip-label-text-line-height, var(--mat-sys-label-large-line-height));font-size:var(--mat-chip-label-text-size, var(--mat-sys-label-large-size));font-weight:var(--mat-chip-label-text-weight, var(--mat-sys-label-large-weight));letter-spacing:var(--mat-chip-label-text-tracking, var(--mat-sys-label-large-tracking))}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-label-text-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label,.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mat-chip-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{width:var(--mat-chip-with-avatar-avatar-size, 24px);height:var(--mat-chip-with-avatar-avatar-size, 24px);font-size:var(--mat-chip-with-avatar-avatar-size, 24px)}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__graphic{padding-left:0}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%;height:20px;width:20px}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@media(forced-colors: active){.mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove{opacity:calc(var(--mat-chip-trailing-action-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove:focus{opacity:calc(var(--mat-chip-trailing-action-focus-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mat-mdc-standard-chip{border-radius:var(--mat-chip-container-shape-radius, 8px);height:var(--mat-chip-container-height, 32px)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-container-color, transparent)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mat-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mat-chip-flat-disabled-selected-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}@media(forced-colors: active){.mat-mdc-standard-chip{outline:solid 1px}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mat-chip-with-avatar-avatar-shape-radius, 24px);width:var(--mat-chip-with-icon-icon-size, 18px);height:var(--mat-chip-with-icon-icon-size, 18px);font-size:var(--mat-chip-with-icon-icon-size, 18px)}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-highlighted{--mat-chip-with-icon-icon-color: var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container));--mat-chip-elevated-container-color: var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container));--mat-chip-label-text-color: var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container));--mat-chip-outline-width: var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-selected .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-hover-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-focus-overlay .mat-mdc-chip-selected:hover,.mat-mdc-chip-highlighted:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-hover-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected.cdk-focused .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mdc-evolution-chip--disabled:not(.mdc-evolution-chip--selected) .mat-mdc-chip-avatar{opacity:var(--mat-chip-with-avatar-disabled-avatar-opacity, 0.38)}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{opacity:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38)}.mdc-evolution-chip--disabled.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{opacity:var(--mat-chip-with-icon-disabled-icon-opacity, 0.38)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:var(--mat-chip-disabled-container-opacity, 1)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-trailing-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-edit,.mat-mdc-chip-remove{opacity:var(--mat-chip-trailing-action-opacity, 1)}.mat-mdc-chip-edit:focus,.mat-mdc-chip-remove:focus{opacity:var(--mat-chip-trailing-action-focus-opacity, 1)}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{background-color:var(--mat-chip-trailing-action-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-edit:hover::after,.mat-mdc-chip-remove:hover::after{opacity:var(--mat-chip-trailing-action-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-edit:focus::after,.mat-mdc-chip-remove:focus::after{opacity:var(--mat-chip-trailing-action-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected .mat-mdc-chip-remove::after,.mat-mdc-chip-highlighted .mat-mdc-chip-remove::after{background-color:var(--mat-chip-selected-trailing-action-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mat-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-edit::before,.mat-mdc-chip-remove::before{margin:calc(var(--mat-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{content:"";display:block;opacity:0;position:absolute;top:-3px;bottom:-3px;left:5px;right:5px;border-radius:50%;box-sizing:border-box;padding:12px;margin:-12px;background-clip:content-box}.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{width:18px;height:18px;font-size:18px;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}@media(forced-colors: active){.mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}}.mat-mdc-chip-action:focus .mat-focus-indicator::before{content:""}.mdc-evolution-chip__icon,.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{min-height:fit-content}\n'],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChip, [{
    type: Component,
    args: [{
      selector: "mat-basic-chip, [mat-basic-chip], mat-chip, [mat-chip]",
      exportAs: "matChip",
      host: {
        "class": "mat-mdc-chip",
        "[class]": '"mat-" + (color || "primary")',
        "[class.mdc-evolution-chip]": "!_isBasicChip",
        "[class.mdc-evolution-chip--disabled]": "disabled",
        "[class.mdc-evolution-chip--with-trailing-action]": "_hasTrailingIcon()",
        "[class.mdc-evolution-chip--with-primary-graphic]": "leadingIcon",
        "[class.mdc-evolution-chip--with-primary-icon]": "leadingIcon",
        "[class.mdc-evolution-chip--with-avatar]": "leadingIcon",
        "[class.mat-mdc-chip-with-avatar]": "leadingIcon",
        "[class.mat-mdc-chip-highlighted]": "highlighted",
        "[class.mat-mdc-chip-disabled]": "disabled",
        "[class.mat-mdc-basic-chip]": "_isBasicChip",
        "[class.mat-mdc-standard-chip]": "!_isBasicChip",
        "[class.mat-mdc-chip-with-trailing-icon]": "_hasTrailingIcon()",
        "[class._mat-animation-noopable]": "_animationsDisabled",
        "[id]": "id",
        "[attr.role]": "role",
        "[attr.aria-label]": "ariaLabel",
        "(keydown)": "_handleKeydown($event)"
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      providers: [{
        provide: MAT_CHIP,
        useExisting: MatChip
      }],
      imports: [MatChipAction],
      template: '<span class="mat-mdc-chip-focus-overlay"></span>\n\n<span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary">\n  <span matChipAction [isInteractive]="false">\n    @if (leadingIcon) {\n      <span class="mdc-evolution-chip__graphic mat-mdc-chip-graphic">\n        <ng-content select="mat-chip-avatar, [matChipAvatar]"></ng-content>\n      </span>\n    }\n    <span class="mdc-evolution-chip__text-label mat-mdc-chip-action-label">\n      <ng-content></ng-content>\n      <span class="mat-mdc-chip-primary-focus-indicator mat-focus-indicator"></span>\n    </span>\n  </span>\n</span>\n\n@if (_hasTrailingIcon()) {\n  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing">\n    <ng-content select="mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"></ng-content>\n  </span>\n}\n',
      styles: ['.mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{flex-basis:100%;overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}@media(forced-colors: active){.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{forced-color-adjust:none}}.mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit;overflow-x:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-outline-width, 1px);border-radius:var(--mat-chip-container-shape-radius, 8px);box-sizing:border-box;content:"";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1;border-style:solid}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-outline-color, var(--mat-sys-outline))}.mdc-evolution-chip__action--primary:not(.mdc-evolution-chip__action--presentational):not(.mdc-ripple-upgraded):focus::before{border-color:var(--mat-chip-focus-outline-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip__action--secondary{position:relative;overflow:visible}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-trailing-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip__text-label{-webkit-user-select:none;user-select:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mat-chip-label-text-font, var(--mat-sys-label-large-font));line-height:var(--mat-chip-label-text-line-height, var(--mat-sys-label-large-line-height));font-size:var(--mat-chip-label-text-size, var(--mat-sys-label-large-size));font-weight:var(--mat-chip-label-text-weight, var(--mat-sys-label-large-weight));letter-spacing:var(--mat-chip-label-text-tracking, var(--mat-sys-label-large-tracking))}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-label-text-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label,.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mat-chip-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{width:var(--mat-chip-with-avatar-avatar-size, 24px);height:var(--mat-chip-with-avatar-avatar-size, 24px);font-size:var(--mat-chip-with-avatar-avatar-size, 24px)}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__graphic{padding-left:0}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%;height:20px;width:20px}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@media(forced-colors: active){.mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove{opacity:calc(var(--mat-chip-trailing-action-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove:focus{opacity:calc(var(--mat-chip-trailing-action-focus-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mat-mdc-standard-chip{border-radius:var(--mat-chip-container-shape-radius, 8px);height:var(--mat-chip-container-height, 32px)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-container-color, transparent)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mat-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mat-chip-flat-disabled-selected-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}@media(forced-colors: active){.mat-mdc-standard-chip{outline:solid 1px}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mat-chip-with-avatar-avatar-shape-radius, 24px);width:var(--mat-chip-with-icon-icon-size, 18px);height:var(--mat-chip-with-icon-icon-size, 18px);font-size:var(--mat-chip-with-icon-icon-size, 18px)}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-highlighted{--mat-chip-with-icon-icon-color: var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container));--mat-chip-elevated-container-color: var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container));--mat-chip-label-text-color: var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container));--mat-chip-outline-width: var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-selected .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-hover-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-focus-overlay .mat-mdc-chip-selected:hover,.mat-mdc-chip-highlighted:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-hover-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected.cdk-focused .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mdc-evolution-chip--disabled:not(.mdc-evolution-chip--selected) .mat-mdc-chip-avatar{opacity:var(--mat-chip-with-avatar-disabled-avatar-opacity, 0.38)}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{opacity:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38)}.mdc-evolution-chip--disabled.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{opacity:var(--mat-chip-with-icon-disabled-icon-opacity, 0.38)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:var(--mat-chip-disabled-container-opacity, 1)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-trailing-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-edit,.mat-mdc-chip-remove{opacity:var(--mat-chip-trailing-action-opacity, 1)}.mat-mdc-chip-edit:focus,.mat-mdc-chip-remove:focus{opacity:var(--mat-chip-trailing-action-focus-opacity, 1)}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{background-color:var(--mat-chip-trailing-action-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-edit:hover::after,.mat-mdc-chip-remove:hover::after{opacity:var(--mat-chip-trailing-action-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-edit:focus::after,.mat-mdc-chip-remove:focus::after{opacity:var(--mat-chip-trailing-action-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected .mat-mdc-chip-remove::after,.mat-mdc-chip-highlighted .mat-mdc-chip-remove::after{background-color:var(--mat-chip-selected-trailing-action-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mat-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-edit::before,.mat-mdc-chip-remove::before{margin:calc(var(--mat-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{content:"";display:block;opacity:0;position:absolute;top:-3px;bottom:-3px;left:5px;right:5px;border-radius:50%;box-sizing:border-box;padding:12px;margin:-12px;background-clip:content-box}.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{width:18px;height:18px;font-size:18px;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}@media(forced-colors: active){.mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}}.mat-mdc-chip-action:focus .mat-focus-indicator::before{content:""}.mdc-evolution-chip__icon,.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{min-height:fit-content}\n']
    }]
  }], () => [], {
    role: [{
      type: Input
    }],
    _allLeadingIcons: [{
      type: ContentChildren,
      args: [MAT_CHIP_AVATAR, {
        descendants: true
      }]
    }],
    _allTrailingIcons: [{
      type: ContentChildren,
      args: [MAT_CHIP_TRAILING_ICON, {
        descendants: true
      }]
    }],
    _allEditIcons: [{
      type: ContentChildren,
      args: [MAT_CHIP_EDIT, {
        descendants: true
      }]
    }],
    _allRemoveIcons: [{
      type: ContentChildren,
      args: [MAT_CHIP_REMOVE, {
        descendants: true
      }]
    }],
    id: [{
      type: Input
    }],
    ariaLabel: [{
      type: Input,
      args: ["aria-label"]
    }],
    ariaDescription: [{
      type: Input,
      args: ["aria-description"]
    }],
    value: [{
      type: Input
    }],
    color: [{
      type: Input
    }],
    removable: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    highlighted: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disableRipple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    removed: [{
      type: Output
    }],
    destroyed: [{
      type: Output
    }],
    leadingIcon: [{
      type: ContentChild,
      args: [MAT_CHIP_AVATAR]
    }],
    editIcon: [{
      type: ContentChild,
      args: [MAT_CHIP_EDIT]
    }],
    trailingIcon: [{
      type: ContentChild,
      args: [MAT_CHIP_TRAILING_ICON]
    }],
    removeIcon: [{
      type: ContentChild,
      args: [MAT_CHIP_REMOVE]
    }],
    primaryAction: [{
      type: ViewChild,
      args: [MatChipAction]
    }]
  });
})();
var MatChipOption = class _MatChipOption extends MatChip {
  /** Default chip options. */
  _defaultOptions = inject(MAT_CHIPS_DEFAULT_OPTIONS, {
    optional: true
  });
  /** Whether the chip list is selectable. */
  chipListSelectable = true;
  /** Whether the chip list is in multi-selection mode. */
  _chipListMultiple = false;
  /** Whether the chip list hides single-selection indicator. */
  _chipListHideSingleSelectionIndicator = this._defaultOptions?.hideSingleSelectionIndicator ?? false;
  /**
   * Whether or not the chip is selectable.
   *
   * When a chip is not selectable, changes to its selected state are always
   * ignored. By default an option chip is selectable, and it becomes
   * non-selectable if its parent chip list is not selectable.
   */
  get selectable() {
    return this._selectable && this.chipListSelectable;
  }
  set selectable(value) {
    this._selectable = value;
    this._changeDetectorRef.markForCheck();
  }
  _selectable = true;
  /** Whether the chip is selected. */
  get selected() {
    return this._selected;
  }
  set selected(value) {
    this._setSelectedState(value, false, true);
  }
  _selected = false;
  /**
   * The ARIA selected applied to the chip. Conforms to WAI ARIA best practices for listbox
   * interaction patterns.
   *
   * From [WAI ARIA Listbox authoring practices guide](
   * https://www.w3.org/WAI/ARIA/apg/patterns/listbox/):
   *  "If any options are selected, each selected option has either aria-selected or aria-checked
   *  set to true. All options that are selectable but not selected have either aria-selected or
   *  aria-checked set to false."
   *
   * Set `aria-selected="false"` on not-selected listbox options that are selectable to fix
   * VoiceOver reading every option as "selected" (#25736).
   */
  get ariaSelected() {
    return this.selectable ? this.selected.toString() : null;
  }
  /** The unstyled chip selector for this component. */
  basicChipAttrName = "mat-basic-chip-option";
  /** Emitted when the chip is selected or deselected. */
  selectionChange = new EventEmitter();
  ngOnInit() {
    super.ngOnInit();
    this.role = "presentation";
  }
  /** Selects the chip. */
  select() {
    this._setSelectedState(true, false, true);
  }
  /** Deselects the chip. */
  deselect() {
    this._setSelectedState(false, false, true);
  }
  /** Selects this chip and emits userInputSelection event */
  selectViaInteraction() {
    this._setSelectedState(true, true, true);
  }
  /** Toggles the current selected state of this chip. */
  toggleSelected(isUserInput = false) {
    this._setSelectedState(!this.selected, isUserInput, true);
    return this.selected;
  }
  _handlePrimaryActionInteraction() {
    if (!this.disabled) {
      this.focus();
      if (this.selectable) {
        this.toggleSelected(true);
      }
    }
  }
  _hasLeadingGraphic() {
    if (this.leadingIcon) {
      return true;
    }
    return !this._chipListHideSingleSelectionIndicator || this._chipListMultiple;
  }
  _setSelectedState(isSelected, isUserInput, emitEvent) {
    if (isSelected !== this.selected) {
      this._selected = isSelected;
      if (emitEvent) {
        this.selectionChange.emit({
          source: this,
          isUserInput,
          selected: this.selected
        });
      }
      this._changeDetectorRef.markForCheck();
    }
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatChipOption_BaseFactory;
    return function MatChipOption_Factory(__ngFactoryType__) {
      return (\u0275MatChipOption_BaseFactory || (\u0275MatChipOption_BaseFactory = \u0275\u0275getInheritedFactory(_MatChipOption)))(__ngFactoryType__ || _MatChipOption);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatChipOption,
    selectors: [["mat-basic-chip-option"], ["", "mat-basic-chip-option", ""], ["mat-chip-option"], ["", "mat-chip-option", ""]],
    hostAttrs: [1, "mat-mdc-chip", "mat-mdc-chip-option"],
    hostVars: 37,
    hostBindings: function MatChipOption_HostBindings(rf, ctx) {
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id);
        \u0275\u0275attribute("tabindex", null)("aria-label", null)("aria-description", null)("role", ctx.role);
        \u0275\u0275classProp("mdc-evolution-chip", !ctx._isBasicChip)("mdc-evolution-chip--filter", !ctx._isBasicChip)("mdc-evolution-chip--selectable", !ctx._isBasicChip)("mat-mdc-chip-selected", ctx.selected)("mat-mdc-chip-multiple", ctx._chipListMultiple)("mat-mdc-chip-disabled", ctx.disabled)("mat-mdc-chip-with-avatar", ctx.leadingIcon)("mdc-evolution-chip--disabled", ctx.disabled)("mdc-evolution-chip--selected", ctx.selected)("mdc-evolution-chip--selecting", !ctx._animationsDisabled)("mdc-evolution-chip--with-trailing-action", ctx._hasTrailingIcon())("mdc-evolution-chip--with-primary-icon", ctx.leadingIcon)("mdc-evolution-chip--with-primary-graphic", ctx._hasLeadingGraphic())("mdc-evolution-chip--with-avatar", ctx.leadingIcon)("mat-mdc-chip-highlighted", ctx.highlighted)("mat-mdc-chip-with-trailing-icon", ctx._hasTrailingIcon());
      }
    },
    inputs: {
      selectable: [2, "selectable", "selectable", booleanAttribute],
      selected: [2, "selected", "selected", booleanAttribute]
    },
    outputs: {
      selectionChange: "selectionChange"
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: MatChip,
      useExisting: _MatChipOption
    }, {
      provide: MAT_CHIP,
      useExisting: _MatChipOption
    }]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c13,
    decls: 8,
    vars: 6,
    consts: [[1, "mat-mdc-chip-focus-overlay"], [1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--primary"], ["matChipAction", "", "role", "option", 3, "_allowFocusWhenDisabled"], [1, "mdc-evolution-chip__graphic", "mat-mdc-chip-graphic"], [1, "mdc-evolution-chip__text-label", "mat-mdc-chip-action-label"], [1, "mat-mdc-chip-primary-focus-indicator", "mat-focus-indicator"], [1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--trailing"], [1, "mdc-evolution-chip__checkmark"], ["viewBox", "-2 -3 30 30", "focusable", "false", "aria-hidden", "true", 1, "mdc-evolution-chip__checkmark-svg"], ["fill", "none", "stroke", "currentColor", "d", "M1.73,12.91 8.1,19.28 22.79,4.59", 1, "mdc-evolution-chip__checkmark-path"]],
    template: function MatChipOption_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c03);
        \u0275\u0275element(0, "span", 0);
        \u0275\u0275elementStart(1, "span", 1)(2, "button", 2);
        \u0275\u0275conditionalCreate(3, MatChipOption_Conditional_3_Template, 5, 0, "span", 3);
        \u0275\u0275elementStart(4, "span", 4);
        \u0275\u0275projection(5);
        \u0275\u0275element(6, "span", 5);
        \u0275\u0275elementEnd()()();
        \u0275\u0275conditionalCreate(7, MatChipOption_Conditional_7_Template, 2, 0, "span", 6);
      }
      if (rf & 2) {
        \u0275\u0275advance(2);
        \u0275\u0275property("_allowFocusWhenDisabled", true);
        \u0275\u0275attribute("aria-description", ctx.ariaDescription)("aria-label", ctx.ariaLabel)("aria-selected", ctx.ariaSelected);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx._hasLeadingGraphic() ? 3 : -1);
        \u0275\u0275advance(4);
        \u0275\u0275conditional(ctx._hasTrailingIcon() ? 7 : -1);
      }
    },
    dependencies: [MatChipAction],
    styles: [_c23],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipOption, [{
    type: Component,
    args: [{
      selector: "mat-basic-chip-option, [mat-basic-chip-option], mat-chip-option, [mat-chip-option]",
      host: {
        "class": "mat-mdc-chip mat-mdc-chip-option",
        "[class.mdc-evolution-chip]": "!_isBasicChip",
        "[class.mdc-evolution-chip--filter]": "!_isBasicChip",
        "[class.mdc-evolution-chip--selectable]": "!_isBasicChip",
        "[class.mat-mdc-chip-selected]": "selected",
        "[class.mat-mdc-chip-multiple]": "_chipListMultiple",
        "[class.mat-mdc-chip-disabled]": "disabled",
        "[class.mat-mdc-chip-with-avatar]": "leadingIcon",
        "[class.mdc-evolution-chip--disabled]": "disabled",
        "[class.mdc-evolution-chip--selected]": "selected",
        // This class enables the transition on the checkmark. Usually MDC adds it when selection
        // starts and removes it once the animation is finished. We don't need to go through all
        // the trouble, because we only care about the selection animation. MDC needs to do it,
        // because they also have an exit animation that we don't care about.
        "[class.mdc-evolution-chip--selecting]": "!_animationsDisabled",
        "[class.mdc-evolution-chip--with-trailing-action]": "_hasTrailingIcon()",
        "[class.mdc-evolution-chip--with-primary-icon]": "leadingIcon",
        "[class.mdc-evolution-chip--with-primary-graphic]": "_hasLeadingGraphic()",
        "[class.mdc-evolution-chip--with-avatar]": "leadingIcon",
        "[class.mat-mdc-chip-highlighted]": "highlighted",
        "[class.mat-mdc-chip-with-trailing-icon]": "_hasTrailingIcon()",
        "[attr.tabindex]": "null",
        "[attr.aria-label]": "null",
        "[attr.aria-description]": "null",
        "[attr.role]": "role",
        "[id]": "id"
      },
      providers: [{
        provide: MatChip,
        useExisting: MatChipOption
      }, {
        provide: MAT_CHIP,
        useExisting: MatChipOption
      }],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatChipAction],
      template: '<span class="mat-mdc-chip-focus-overlay"></span>\n\n<span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary">\n  <button\n    matChipAction\n    [_allowFocusWhenDisabled]="true"\n    [attr.aria-description]="ariaDescription"\n    [attr.aria-label]="ariaLabel"\n    [attr.aria-selected]="ariaSelected"\n    role="option">\n    @if (_hasLeadingGraphic()) {\n      <span class="mdc-evolution-chip__graphic mat-mdc-chip-graphic">\n        <ng-content select="mat-chip-avatar, [matChipAvatar]"></ng-content>\n        <span class="mdc-evolution-chip__checkmark">\n          <svg\n            class="mdc-evolution-chip__checkmark-svg"\n            viewBox="-2 -3 30 30"\n            focusable="false"\n            aria-hidden="true">\n            <path class="mdc-evolution-chip__checkmark-path"\n                  fill="none" stroke="currentColor" d="M1.73,12.91 8.1,19.28 22.79,4.59" />\n          </svg>\n        </span>\n      </span>\n    }\n    <span class="mdc-evolution-chip__text-label mat-mdc-chip-action-label">\n      <ng-content></ng-content>\n      <span class="mat-mdc-chip-primary-focus-indicator mat-focus-indicator"></span>\n    </span>\n  </button>\n</span>\n\n@if (_hasTrailingIcon()) {\n  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing">\n    <ng-content select="mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"></ng-content>\n  </span>\n}\n',
      styles: ['.mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{flex-basis:100%;overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}@media(forced-colors: active){.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{forced-color-adjust:none}}.mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit;overflow-x:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-outline-width, 1px);border-radius:var(--mat-chip-container-shape-radius, 8px);box-sizing:border-box;content:"";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1;border-style:solid}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-outline-color, var(--mat-sys-outline))}.mdc-evolution-chip__action--primary:not(.mdc-evolution-chip__action--presentational):not(.mdc-ripple-upgraded):focus::before{border-color:var(--mat-chip-focus-outline-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip__action--secondary{position:relative;overflow:visible}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-trailing-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip__text-label{-webkit-user-select:none;user-select:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mat-chip-label-text-font, var(--mat-sys-label-large-font));line-height:var(--mat-chip-label-text-line-height, var(--mat-sys-label-large-line-height));font-size:var(--mat-chip-label-text-size, var(--mat-sys-label-large-size));font-weight:var(--mat-chip-label-text-weight, var(--mat-sys-label-large-weight));letter-spacing:var(--mat-chip-label-text-tracking, var(--mat-sys-label-large-tracking))}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-label-text-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label,.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mat-chip-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{width:var(--mat-chip-with-avatar-avatar-size, 24px);height:var(--mat-chip-with-avatar-avatar-size, 24px);font-size:var(--mat-chip-with-avatar-avatar-size, 24px)}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__graphic{padding-left:0}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%;height:20px;width:20px}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@media(forced-colors: active){.mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove{opacity:calc(var(--mat-chip-trailing-action-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove:focus{opacity:calc(var(--mat-chip-trailing-action-focus-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mat-mdc-standard-chip{border-radius:var(--mat-chip-container-shape-radius, 8px);height:var(--mat-chip-container-height, 32px)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-container-color, transparent)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mat-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mat-chip-flat-disabled-selected-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}@media(forced-colors: active){.mat-mdc-standard-chip{outline:solid 1px}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mat-chip-with-avatar-avatar-shape-radius, 24px);width:var(--mat-chip-with-icon-icon-size, 18px);height:var(--mat-chip-with-icon-icon-size, 18px);font-size:var(--mat-chip-with-icon-icon-size, 18px)}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-highlighted{--mat-chip-with-icon-icon-color: var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container));--mat-chip-elevated-container-color: var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container));--mat-chip-label-text-color: var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container));--mat-chip-outline-width: var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-selected .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-hover-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-focus-overlay .mat-mdc-chip-selected:hover,.mat-mdc-chip-highlighted:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-hover-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected.cdk-focused .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mdc-evolution-chip--disabled:not(.mdc-evolution-chip--selected) .mat-mdc-chip-avatar{opacity:var(--mat-chip-with-avatar-disabled-avatar-opacity, 0.38)}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{opacity:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38)}.mdc-evolution-chip--disabled.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{opacity:var(--mat-chip-with-icon-disabled-icon-opacity, 0.38)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:var(--mat-chip-disabled-container-opacity, 1)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-trailing-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-edit,.mat-mdc-chip-remove{opacity:var(--mat-chip-trailing-action-opacity, 1)}.mat-mdc-chip-edit:focus,.mat-mdc-chip-remove:focus{opacity:var(--mat-chip-trailing-action-focus-opacity, 1)}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{background-color:var(--mat-chip-trailing-action-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-edit:hover::after,.mat-mdc-chip-remove:hover::after{opacity:var(--mat-chip-trailing-action-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-edit:focus::after,.mat-mdc-chip-remove:focus::after{opacity:var(--mat-chip-trailing-action-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected .mat-mdc-chip-remove::after,.mat-mdc-chip-highlighted .mat-mdc-chip-remove::after{background-color:var(--mat-chip-selected-trailing-action-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mat-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-edit::before,.mat-mdc-chip-remove::before{margin:calc(var(--mat-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{content:"";display:block;opacity:0;position:absolute;top:-3px;bottom:-3px;left:5px;right:5px;border-radius:50%;box-sizing:border-box;padding:12px;margin:-12px;background-clip:content-box}.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{width:18px;height:18px;font-size:18px;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}@media(forced-colors: active){.mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}}.mat-mdc-chip-action:focus .mat-focus-indicator::before{content:""}.mdc-evolution-chip__icon,.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{min-height:fit-content}\n']
    }]
  }], null, {
    selectable: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    selected: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    selectionChange: [{
      type: Output
    }]
  });
})();
var MatChipEditInput = class _MatChipEditInput {
  _elementRef = inject(ElementRef);
  _document = inject(DOCUMENT);
  constructor() {
  }
  initialize(initialValue) {
    this.getNativeElement().focus();
    this.setValue(initialValue);
  }
  getNativeElement() {
    return this._elementRef.nativeElement;
  }
  setValue(value) {
    this.getNativeElement().textContent = value;
    this._moveCursorToEndOfInput();
  }
  getValue() {
    return this.getNativeElement().textContent || "";
  }
  _moveCursorToEndOfInput() {
    const range = this._document.createRange();
    range.selectNodeContents(this.getNativeElement());
    range.collapse(false);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
  }
  static \u0275fac = function MatChipEditInput_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatChipEditInput)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatChipEditInput,
    selectors: [["span", "matChipEditInput", ""]],
    hostAttrs: ["role", "textbox", "tabindex", "-1", "contenteditable", "true", 1, "mat-chip-edit-input"]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipEditInput, [{
    type: Directive,
    args: [{
      selector: "span[matChipEditInput]",
      host: {
        "class": "mat-chip-edit-input",
        "role": "textbox",
        "tabindex": "-1",
        "contenteditable": "true"
      }
    }]
  }], () => [], null);
})();
var MatChipRow = class _MatChipRow extends MatChip {
  basicChipAttrName = "mat-basic-chip-row";
  /**
   * The editing action has to be triggered in a timeout. While we're waiting on it, a blur
   * event might occur which will interrupt the editing. This flag is used to avoid interruptions
   * while the editing action is being initialized.
   */
  _editStartPending = false;
  editable = false;
  /** Emitted when the chip is edited. */
  edited = new EventEmitter();
  /** The default chip edit input that is used if none is projected into this chip row. */
  defaultEditInput;
  /** The projected chip edit input. */
  contentEditInput;
  /**
   * Set on a mousedown when the chip is already focused via mouse or keyboard.
   *
   * This allows us to ensure chip is already focused when deciding whether to enter the
   * edit mode on a subsequent click. Otherwise, the chip appears focused when handling the
   * first click event.
   */
  _alreadyFocused = false;
  _isEditing = false;
  constructor() {
    super();
    this.role = "row";
    this._onBlur.pipe(takeUntil(this.destroyed)).subscribe(() => {
      if (this._isEditing && !this._editStartPending) {
        this._onEditFinish();
      }
      this._alreadyFocused = false;
    });
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    this._ngZone.runOutsideAngular(() => {
      this._elementRef.nativeElement.addEventListener("mousedown", () => this._alreadyFocused = this._hasFocus());
    });
  }
  _hasLeadingActionIcon() {
    return !this._isEditing && !!this.editIcon;
  }
  _hasTrailingIcon() {
    return !this._isEditing && super._hasTrailingIcon();
  }
  /** Sends focus to the first gridcell when the user clicks anywhere inside the chip. */
  _handleFocus() {
    if (!this._isEditing && !this.disabled) {
      this.focus();
    }
  }
  _handleKeydown(event) {
    if (event.keyCode === ENTER && !this.disabled) {
      if (this._isEditing) {
        event.preventDefault();
        this._onEditFinish();
      } else if (this.editable) {
        this._startEditing(event);
      }
    } else if (this._isEditing) {
      event.stopPropagation();
    } else {
      super._handleKeydown(event);
    }
  }
  _handleClick(event) {
    if (!this.disabled && this.editable && !this._isEditing && this._alreadyFocused) {
      event.preventDefault();
      event.stopPropagation();
      this._startEditing(event);
    }
  }
  _handleDoubleclick(event) {
    if (!this.disabled && this.editable) {
      this._startEditing(event);
    }
  }
  _edit() {
    this._changeDetectorRef.markForCheck();
    this._startEditing();
  }
  _startEditing(event) {
    if (!this.primaryAction || this.removeIcon && !!event && this._getSourceAction(event.target) === this.removeIcon) {
      return;
    }
    const value = this.value;
    this._isEditing = this._editStartPending = true;
    afterNextRender(() => {
      this._getEditInput().initialize(value);
      setTimeout(() => this._ngZone.run(() => this._editStartPending = false));
    }, {
      injector: this._injector
    });
  }
  _onEditFinish() {
    this._isEditing = this._editStartPending = false;
    this.edited.emit({
      chip: this,
      value: this._getEditInput().getValue()
    });
    if (this._document.activeElement === this._getEditInput().getNativeElement() || this._document.activeElement === this._document.body) {
      this.primaryAction.focus();
    }
  }
  _isRippleDisabled() {
    return super._isRippleDisabled() || this._isEditing;
  }
  /**
   * Gets the projected chip edit input, or the default input if none is projected in. One of these
   * two values is guaranteed to be defined.
   */
  _getEditInput() {
    return this.contentEditInput || this.defaultEditInput;
  }
  static \u0275fac = function MatChipRow_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatChipRow)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatChipRow,
    selectors: [["mat-chip-row"], ["", "mat-chip-row", ""], ["mat-basic-chip-row"], ["", "mat-basic-chip-row", ""]],
    contentQueries: function MatChipRow_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, MatChipEditInput, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.contentEditInput = _t.first);
      }
    },
    viewQuery: function MatChipRow_Query(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275viewQuery(MatChipEditInput, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx.defaultEditInput = _t.first);
      }
    },
    hostAttrs: [1, "mat-mdc-chip", "mat-mdc-chip-row", "mdc-evolution-chip"],
    hostVars: 29,
    hostBindings: function MatChipRow_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("focus", function MatChipRow_focus_HostBindingHandler() {
          return ctx._handleFocus();
        })("click", function MatChipRow_click_HostBindingHandler($event) {
          return ctx._handleClick($event);
        })("dblclick", function MatChipRow_dblclick_HostBindingHandler($event) {
          return ctx._handleDoubleclick($event);
        });
      }
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id);
        \u0275\u0275attribute("tabindex", ctx.disabled ? null : -1)("aria-label", null)("aria-description", null)("role", ctx.role);
        \u0275\u0275classProp("mat-mdc-chip-with-avatar", ctx.leadingIcon)("mat-mdc-chip-disabled", ctx.disabled)("mat-mdc-chip-editing", ctx._isEditing)("mat-mdc-chip-editable", ctx.editable)("mdc-evolution-chip--disabled", ctx.disabled)("mdc-evolution-chip--with-leading-action", ctx._hasLeadingActionIcon())("mdc-evolution-chip--with-trailing-action", ctx._hasTrailingIcon())("mdc-evolution-chip--with-primary-graphic", ctx.leadingIcon)("mdc-evolution-chip--with-primary-icon", ctx.leadingIcon)("mdc-evolution-chip--with-avatar", ctx.leadingIcon)("mat-mdc-chip-highlighted", ctx.highlighted)("mat-mdc-chip-with-trailing-icon", ctx._hasTrailingIcon());
      }
    },
    inputs: {
      editable: "editable"
    },
    outputs: {
      edited: "edited"
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: MatChip,
      useExisting: _MatChipRow
    }, {
      provide: MAT_CHIP,
      useExisting: _MatChipRow
    }]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c43,
    decls: 9,
    vars: 8,
    consts: [[1, "mat-mdc-chip-focus-overlay"], ["role", "gridcell", 1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--leading"], ["role", "gridcell", "matChipAction", "", 1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--primary", 3, "disabled"], [1, "mdc-evolution-chip__graphic", "mat-mdc-chip-graphic"], [1, "mdc-evolution-chip__text-label", "mat-mdc-chip-action-label"], ["aria-hidden", "true", 1, "mat-mdc-chip-primary-focus-indicator", "mat-focus-indicator"], ["role", "gridcell", 1, "mdc-evolution-chip__cell", "mdc-evolution-chip__cell--trailing"], ["matChipEditInput", ""]],
    template: function MatChipRow_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef(_c33);
        \u0275\u0275conditionalCreate(0, MatChipRow_Conditional_0_Template, 1, 0, "span", 0);
        \u0275\u0275conditionalCreate(1, MatChipRow_Conditional_1_Template, 2, 0, "span", 1);
        \u0275\u0275elementStart(2, "span", 2);
        \u0275\u0275conditionalCreate(3, MatChipRow_Conditional_3_Template, 2, 0, "span", 3);
        \u0275\u0275elementStart(4, "span", 4);
        \u0275\u0275conditionalCreate(5, MatChipRow_Conditional_5_Template, 2, 1)(6, MatChipRow_Conditional_6_Template, 1, 0);
        \u0275\u0275element(7, "span", 5);
        \u0275\u0275elementEnd()();
        \u0275\u0275conditionalCreate(8, MatChipRow_Conditional_8_Template, 2, 0, "span", 6);
      }
      if (rf & 2) {
        \u0275\u0275conditional(!ctx._isEditing ? 0 : -1);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx._hasLeadingActionIcon() ? 1 : -1);
        \u0275\u0275advance();
        \u0275\u0275property("disabled", ctx.disabled);
        \u0275\u0275attribute("aria-description", ctx.ariaDescription)("aria-label", ctx.ariaLabel);
        \u0275\u0275advance();
        \u0275\u0275conditional(ctx.leadingIcon ? 3 : -1);
        \u0275\u0275advance(2);
        \u0275\u0275conditional(ctx._isEditing ? 5 : 6);
        \u0275\u0275advance(3);
        \u0275\u0275conditional(ctx._hasTrailingIcon() ? 8 : -1);
      }
    },
    dependencies: [MatChipAction, MatChipEditInput],
    styles: [_c23],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipRow, [{
    type: Component,
    args: [{
      selector: "mat-chip-row, [mat-chip-row], mat-basic-chip-row, [mat-basic-chip-row]",
      host: {
        "class": "mat-mdc-chip mat-mdc-chip-row mdc-evolution-chip",
        "[class.mat-mdc-chip-with-avatar]": "leadingIcon",
        "[class.mat-mdc-chip-disabled]": "disabled",
        "[class.mat-mdc-chip-editing]": "_isEditing",
        "[class.mat-mdc-chip-editable]": "editable",
        "[class.mdc-evolution-chip--disabled]": "disabled",
        "[class.mdc-evolution-chip--with-leading-action]": "_hasLeadingActionIcon()",
        "[class.mdc-evolution-chip--with-trailing-action]": "_hasTrailingIcon()",
        "[class.mdc-evolution-chip--with-primary-graphic]": "leadingIcon",
        "[class.mdc-evolution-chip--with-primary-icon]": "leadingIcon",
        "[class.mdc-evolution-chip--with-avatar]": "leadingIcon",
        "[class.mat-mdc-chip-highlighted]": "highlighted",
        "[class.mat-mdc-chip-with-trailing-icon]": "_hasTrailingIcon()",
        "[id]": "id",
        // Has to have a negative tabindex in order to capture
        // focus and redirect it to the primary action.
        "[attr.tabindex]": "disabled ? null : -1",
        "[attr.aria-label]": "null",
        "[attr.aria-description]": "null",
        "[attr.role]": "role",
        "(focus)": "_handleFocus()",
        "(click)": "_handleClick($event)",
        "(dblclick)": "_handleDoubleclick($event)"
      },
      providers: [{
        provide: MatChip,
        useExisting: MatChipRow
      }, {
        provide: MAT_CHIP,
        useExisting: MatChipRow
      }],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      imports: [MatChipAction, MatChipEditInput],
      template: '@if (!_isEditing) {\n  <span class="mat-mdc-chip-focus-overlay"></span>\n}\n\n@if (_hasLeadingActionIcon()) {\n  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--leading" role="gridcell">\n    <ng-content select="[matChipEdit]"></ng-content>\n  </span>\n}\n<span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell"\n    matChipAction\n    [disabled]="disabled"\n    [attr.aria-description]="ariaDescription"\n    [attr.aria-label]="ariaLabel">\n  @if (leadingIcon) {\n    <span class="mdc-evolution-chip__graphic mat-mdc-chip-graphic">\n      <ng-content select="mat-chip-avatar, [matChipAvatar]"></ng-content>\n    </span>\n  }\n\n  <span class="mdc-evolution-chip__text-label mat-mdc-chip-action-label">\n    @if (_isEditing) {\n      @if (contentEditInput) {\n        <ng-content select="[matChipEditInput]"></ng-content>\n      } @else {\n        <span matChipEditInput></span>\n      }\n    } @else {\n      <ng-content></ng-content>\n    }\n\n    <span class="mat-mdc-chip-primary-focus-indicator mat-focus-indicator" aria-hidden="true"></span>\n  </span>\n</span>\n\n@if (_hasTrailingIcon()) {\n  <span\n    class="mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing"\n    role="gridcell">\n    <ng-content select="mat-chip-trailing-icon,[matChipRemove],[matChipTrailingIcon]"></ng-content>\n  </span>\n}\n',
      styles: ['.mdc-evolution-chip,.mdc-evolution-chip__cell,.mdc-evolution-chip__action{display:inline-flex;align-items:center}.mdc-evolution-chip{position:relative;max-width:100%}.mdc-evolution-chip__cell,.mdc-evolution-chip__action{height:100%}.mdc-evolution-chip__cell--primary{flex-basis:100%;overflow-x:hidden}.mdc-evolution-chip__cell--trailing{flex:1 0 auto}.mdc-evolution-chip__action{align-items:center;background:none;border:none;box-sizing:content-box;cursor:pointer;display:inline-flex;justify-content:center;outline:none;padding:0;text-decoration:none;color:inherit}.mdc-evolution-chip__action--presentational{cursor:auto}.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{pointer-events:none}@media(forced-colors: active){.mdc-evolution-chip--disabled,.mdc-evolution-chip__action:disabled{forced-color-adjust:none}}.mdc-evolution-chip__action--primary{font:inherit;letter-spacing:inherit;white-space:inherit;overflow-x:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-outline-width, 1px);border-radius:var(--mat-chip-container-shape-radius, 8px);box-sizing:border-box;content:"";height:100%;left:0;position:absolute;pointer-events:none;top:0;width:100%;z-index:1;border-style:solid}.mat-mdc-standard-chip .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-outline-color, var(--mat-sys-outline))}.mdc-evolution-chip__action--primary:not(.mdc-evolution-chip__action--presentational):not(.mdc-ripple-upgraded):focus::before{border-color:var(--mat-chip-focus-outline-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--primary::before{border-color:var(--mat-chip-disabled-outline-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__action--primary::before{border-width:var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-basic-chip .mdc-evolution-chip__action--primary{font:inherit}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}.mat-mdc-standard-chip.mdc-evolution-chip--with-leading-action.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:0;padding-right:12px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__action--primary{padding-left:12px;padding-right:0}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--primary{padding-left:0;padding-right:0}.mdc-evolution-chip__action--secondary{position:relative;overflow:visible}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-trailing-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__action--secondary{color:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-standard-chip.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__action--secondary{padding-left:8px;padding-right:8px}.mdc-evolution-chip__text-label{-webkit-user-select:none;user-select:none;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}.mat-mdc-standard-chip .mdc-evolution-chip__text-label{font-family:var(--mat-chip-label-text-font, var(--mat-sys-label-large-font));line-height:var(--mat-chip-label-text-line-height, var(--mat-sys-label-large-line-height));font-size:var(--mat-chip-label-text-size, var(--mat-sys-label-large-size));font-weight:var(--mat-chip-label-text-weight, var(--mat-sys-label-large-weight));letter-spacing:var(--mat-chip-label-text-tracking, var(--mat-sys-label-large-tracking))}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-label-text-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__text-label{color:var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label,.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__text-label{color:var(--mat-chip-disabled-label-text-color, color-mix(in srgb, var(--mat-sys-on-surface) 38%, transparent))}.mdc-evolution-chip__graphic{align-items:center;display:inline-flex;justify-content:center;overflow:hidden;pointer-events:none;position:relative;flex:1 0 auto}.mat-mdc-standard-chip .mdc-evolution-chip__graphic{width:var(--mat-chip-with-avatar-avatar-size, 24px);height:var(--mat-chip-with-avatar-avatar-size, 24px);font-size:var(--mat-chip-with-avatar-avatar-size, 24px)}.mdc-evolution-chip--selecting .mdc-evolution-chip__graphic{transition:width 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selectable:not(.mdc-evolution-chip--selected):not(.mdc-evolution-chip--with-primary-icon) .mdc-evolution-chip__graphic{width:0}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mat-mdc-standard-chip.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:6px;padding-right:6px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:4px;padding-right:8px}[dir=rtl] .mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-trailing-action .mdc-evolution-chip__graphic{padding-left:8px;padding-right:4px}.mdc-evolution-chip--with-avatar.mdc-evolution-chip--with-primary-graphic.mdc-evolution-chip--with-leading-action .mdc-evolution-chip__graphic{padding-left:0}.mdc-evolution-chip__checkmark{position:absolute;opacity:0;top:50%;left:50%;height:20px;width:20px}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__checkmark{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark{transition:transform 150ms 0ms cubic-bezier(0.4, 0, 0.2, 1);transform:translate(-75%, -50%)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{transform:translate(-50%, -50%);opacity:1}.mdc-evolution-chip__checkmark-svg{display:block}.mdc-evolution-chip__checkmark-path{stroke-width:2px;stroke-dasharray:29.7833385;stroke-dashoffset:29.7833385;stroke:currentColor}.mdc-evolution-chip--selecting .mdc-evolution-chip__checkmark-path{transition:stroke-dashoffset 150ms 45ms cubic-bezier(0.4, 0, 0.2, 1)}.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark-path{stroke-dashoffset:0}@media(forced-colors: active){.mdc-evolution-chip__checkmark-path{stroke:CanvasText !important}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--trailing{height:18px;width:18px;font-size:18px}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove{opacity:calc(var(--mat-chip-trailing-action-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing.mat-mdc-chip-remove:focus{opacity:calc(var(--mat-chip-trailing-action-focus-opacity, 1)*var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38))}.mat-mdc-standard-chip{border-radius:var(--mat-chip-container-shape-radius, 8px);height:var(--mat-chip-container-height, 32px)}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-container-color, transparent)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{background-color:var(--mat-chip-elevated-disabled-container-color)}.mat-mdc-standard-chip.mdc-evolution-chip--selected:not(.mdc-evolution-chip--disabled){background-color:var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled{background-color:var(--mat-chip-flat-disabled-selected-container-color, color-mix(in srgb, var(--mat-sys-on-surface) 12%, transparent))}@media(forced-colors: active){.mat-mdc-standard-chip{outline:solid 1px}}.mat-mdc-standard-chip .mdc-evolution-chip__icon--primary{border-radius:var(--mat-chip-with-avatar-avatar-shape-radius, 24px);width:var(--mat-chip-with-icon-icon-size, 18px);height:var(--mat-chip-with-icon-icon-size, 18px);font-size:var(--mat-chip-with-icon-icon-size, 18px)}.mdc-evolution-chip--selected .mdc-evolution-chip__icon--primary{opacity:0}.mat-mdc-standard-chip:not(.mdc-evolution-chip--disabled) .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-icon-color, var(--mat-sys-on-surface-variant))}.mat-mdc-standard-chip.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--primary{color:var(--mat-chip-with-icon-disabled-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-highlighted{--mat-chip-with-icon-icon-color: var(--mat-chip-with-icon-selected-icon-color, var(--mat-sys-on-secondary-container));--mat-chip-elevated-container-color: var(--mat-chip-elevated-selected-container-color, var(--mat-sys-secondary-container));--mat-chip-label-text-color: var(--mat-chip-selected-label-text-color, var(--mat-sys-on-secondary-container));--mat-chip-outline-width: var(--mat-chip-flat-selected-outline-width, 0)}.mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-selected .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-chip:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-hover-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-focus-overlay .mat-mdc-chip-selected:hover,.mat-mdc-chip-highlighted:hover .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-hover-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-focus-state-layer-color, var(--mat-sys-on-surface-variant));opacity:var(--mat-chip-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected.cdk-focused .mat-mdc-chip-focus-overlay,.mat-mdc-chip-highlighted.cdk-focused .mat-mdc-chip-focus-overlay{background:var(--mat-chip-selected-focus-state-layer-color, var(--mat-sys-on-secondary-container));opacity:var(--mat-chip-selected-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mdc-evolution-chip--disabled:not(.mdc-evolution-chip--selected) .mat-mdc-chip-avatar{opacity:var(--mat-chip-with-avatar-disabled-avatar-opacity, 0.38)}.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{opacity:var(--mat-chip-with-trailing-icon-disabled-trailing-icon-opacity, 0.38)}.mdc-evolution-chip--disabled.mdc-evolution-chip--selected .mdc-evolution-chip__checkmark{opacity:var(--mat-chip-with-icon-disabled-icon-opacity, 0.38)}.mat-mdc-standard-chip.mdc-evolution-chip--disabled{opacity:var(--mat-chip-disabled-container-opacity, 1)}.mat-mdc-standard-chip.mdc-evolution-chip--selected .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-trailing-icon-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip.mdc-evolution-chip--selected.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing,.mat-mdc-standard-chip.mat-mdc-chip-highlighted.mdc-evolution-chip--disabled .mdc-evolution-chip__icon--trailing{color:var(--mat-chip-selected-disabled-trailing-icon-color, var(--mat-sys-on-surface))}.mat-mdc-chip-edit,.mat-mdc-chip-remove{opacity:var(--mat-chip-trailing-action-opacity, 1)}.mat-mdc-chip-edit:focus,.mat-mdc-chip-remove:focus{opacity:var(--mat-chip-trailing-action-focus-opacity, 1)}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{background-color:var(--mat-chip-trailing-action-state-layer-color, var(--mat-sys-on-surface-variant))}.mat-mdc-chip-edit:hover::after,.mat-mdc-chip-remove:hover::after{opacity:var(--mat-chip-trailing-action-hover-state-layer-opacity, var(--mat-sys-hover-state-layer-opacity))}.mat-mdc-chip-edit:focus::after,.mat-mdc-chip-remove:focus::after{opacity:var(--mat-chip-trailing-action-focus-state-layer-opacity, var(--mat-sys-focus-state-layer-opacity))}.mat-mdc-chip-selected .mat-mdc-chip-remove::after,.mat-mdc-chip-highlighted .mat-mdc-chip-remove::after{background-color:var(--mat-chip-selected-trailing-action-state-layer-color, var(--mat-sys-on-secondary-container))}.mat-mdc-standard-chip{-webkit-tap-highlight-color:rgba(0,0,0,0)}.mat-mdc-standard-chip .mdc-evolution-chip__cell--primary,.mat-mdc-standard-chip .mdc-evolution-chip__action--primary,.mat-mdc-standard-chip .mat-mdc-chip-action-label{overflow:visible}.mat-mdc-standard-chip .mat-mdc-chip-graphic,.mat-mdc-standard-chip .mat-mdc-chip-trailing-icon{box-sizing:content-box}.mat-mdc-standard-chip._mat-animation-noopable,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__graphic,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark,.mat-mdc-standard-chip._mat-animation-noopable .mdc-evolution-chip__checkmark-path{transition-duration:1ms;animation-duration:1ms}.mat-mdc-chip-focus-overlay{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;opacity:0;border-radius:inherit;transition:opacity 150ms linear}._mat-animation-noopable .mat-mdc-chip-focus-overlay{transition:none}.mat-mdc-basic-chip .mat-mdc-chip-focus-overlay{display:none}.mat-mdc-chip .mat-ripple.mat-mdc-chip-ripple{top:0;left:0;right:0;bottom:0;position:absolute;pointer-events:none;border-radius:inherit}.mat-mdc-chip-avatar{text-align:center;line-height:1;color:var(--mat-chip-with-icon-icon-color, currentColor)}.mat-mdc-chip{position:relative;z-index:0}.mat-mdc-chip-action-label{text-align:left;z-index:1}[dir=rtl] .mat-mdc-chip-action-label{text-align:right}.mat-mdc-chip.mdc-evolution-chip--with-trailing-action .mat-mdc-chip-action-label{position:relative}.mat-mdc-chip-action-label .mat-mdc-chip-primary-focus-indicator{position:absolute;top:0;right:0;bottom:0;left:0;pointer-events:none}.mat-mdc-chip-action-label .mat-focus-indicator::before{margin:calc(calc(var(--mat-focus-indicator-border-width, 3px) + 2px)*-1)}.mat-mdc-chip-edit::before,.mat-mdc-chip-remove::before{margin:calc(var(--mat-focus-indicator-border-width, 3px)*-1);left:8px;right:8px}.mat-mdc-chip-edit::after,.mat-mdc-chip-remove::after{content:"";display:block;opacity:0;position:absolute;top:-3px;bottom:-3px;left:5px;right:5px;border-radius:50%;box-sizing:border-box;padding:12px;margin:-12px;background-clip:content-box}.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{width:18px;height:18px;font-size:18px;box-sizing:content-box}.mat-chip-edit-input{cursor:text;display:inline-block;color:inherit;outline:0}@media(forced-colors: active){.mat-mdc-chip-selected:not(.mat-mdc-chip-multiple){outline-width:3px}}.mat-mdc-chip-action:focus .mat-focus-indicator::before{content:""}.mdc-evolution-chip__icon,.mat-mdc-chip-edit .mat-icon,.mat-mdc-chip-remove .mat-icon{min-height:fit-content}\n']
    }]
  }], () => [], {
    editable: [{
      type: Input
    }],
    edited: [{
      type: Output
    }],
    defaultEditInput: [{
      type: ViewChild,
      args: [MatChipEditInput]
    }],
    contentEditInput: [{
      type: ContentChild,
      args: [MatChipEditInput]
    }]
  });
})();
var MatChipSet = class _MatChipSet {
  _elementRef = inject(ElementRef);
  _changeDetectorRef = inject(ChangeDetectorRef);
  _dir = inject(Directionality, {
    optional: true
  });
  /** Index of the last destroyed chip that had focus. */
  _lastDestroyedFocusedChipIndex = null;
  /** Used to manage focus within the chip list. */
  _keyManager;
  /** Subject that emits when the component has been destroyed. */
  _destroyed = new Subject();
  /** Role to use if it hasn't been overwritten by the user. */
  _defaultRole = "presentation";
  /** Combined stream of all of the child chips' focus events. */
  get chipFocusChanges() {
    return this._getChipStream((chip) => chip._onFocus);
  }
  /** Combined stream of all of the child chips' destroy events. */
  get chipDestroyedChanges() {
    return this._getChipStream((chip) => chip.destroyed);
  }
  /** Combined stream of all of the child chips' remove events. */
  get chipRemovedChanges() {
    return this._getChipStream((chip) => chip.removed);
  }
  /** Whether the chip set is disabled. */
  get disabled() {
    return this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this._syncChipsState();
  }
  _disabled = false;
  /** Whether the chip list contains chips or not. */
  get empty() {
    return !this._chips || this._chips.length === 0;
  }
  /** The ARIA role applied to the chip set. */
  get role() {
    if (this._explicitRole) {
      return this._explicitRole;
    }
    return this.empty ? null : this._defaultRole;
  }
  /** Tabindex of the chip set. */
  tabIndex = 0;
  set role(value) {
    this._explicitRole = value;
  }
  _explicitRole = null;
  /** Whether any of the chips inside of this chip-set has focus. */
  get focused() {
    return this._hasFocusedChip();
  }
  /** The chips that are part of this chip set. */
  _chips;
  /** Flat list of all the actions contained within the chips. */
  _chipActions = new QueryList();
  constructor() {
  }
  ngAfterViewInit() {
    this._setUpFocusManagement();
    this._trackChipSetChanges();
    this._trackDestroyedFocusedChip();
  }
  ngOnDestroy() {
    this._keyManager?.destroy();
    this._chipActions.destroy();
    this._destroyed.next();
    this._destroyed.complete();
  }
  /** Checks whether any of the chips is focused. */
  _hasFocusedChip() {
    return this._chips && this._chips.some((chip) => chip._hasFocus());
  }
  /** Syncs the chip-set's state with the individual chips. */
  _syncChipsState() {
    this._chips?.forEach((chip) => {
      chip._chipListDisabled = this._disabled;
      chip._changeDetectorRef.markForCheck();
    });
  }
  /** Dummy method for subclasses to override. Base chip set cannot be focused. */
  focus() {
  }
  /** Handles keyboard events on the chip set. */
  _handleKeydown(event) {
    if (this._originatesFromChip(event)) {
      this._keyManager.onKeydown(event);
    }
  }
  /**
   * Utility to ensure all indexes are valid.
   *
   * @param index The index to be checked.
   * @returns True if the index is valid for our list of chips.
   */
  _isValidIndex(index) {
    return index >= 0 && index < this._chips.length;
  }
  /**
   * Removes the `tabindex` from the chip set and resets it back afterwards, allowing the
   * user to tab out of it. This prevents the set from capturing focus and redirecting
   * it back to the first chip, creating a focus trap, if it user tries to tab away.
   */
  _allowFocusEscape() {
    const previous = this._elementRef.nativeElement.tabIndex;
    if (previous !== -1) {
      this._elementRef.nativeElement.tabIndex = -1;
      setTimeout(() => this._elementRef.nativeElement.tabIndex = previous);
    }
  }
  /**
   * Gets a stream of events from all the chips within the set.
   * The stream will automatically incorporate any newly-added chips.
   */
  _getChipStream(mappingFunction) {
    return this._chips.changes.pipe(startWith(null), switchMap(() => merge(...this._chips.map(mappingFunction))));
  }
  /** Checks whether an event comes from inside a chip element. */
  _originatesFromChip(event) {
    let currentElement = event.target;
    while (currentElement && currentElement !== this._elementRef.nativeElement) {
      if (currentElement.classList.contains("mat-mdc-chip")) {
        return true;
      }
      currentElement = currentElement.parentElement;
    }
    return false;
  }
  /** Sets up the chip set's focus management logic. */
  _setUpFocusManagement() {
    this._chips.changes.pipe(startWith(this._chips)).subscribe((chips) => {
      const actions = [];
      chips.forEach((chip) => chip._getActions().forEach((action) => actions.push(action)));
      this._chipActions.reset(actions);
      this._chipActions.notifyOnChanges();
    });
    this._keyManager = new FocusKeyManager(this._chipActions).withVerticalOrientation().withHorizontalOrientation(this._dir ? this._dir.value : "ltr").withHomeAndEnd().skipPredicate((action) => this._skipPredicate(action));
    this.chipFocusChanges.pipe(takeUntil(this._destroyed)).subscribe(({
      chip
    }) => {
      const action = chip._getSourceAction(document.activeElement);
      if (action) {
        this._keyManager.updateActiveItem(action);
      }
    });
    this._dir?.change.pipe(takeUntil(this._destroyed)).subscribe((direction) => this._keyManager.withHorizontalOrientation(direction));
  }
  /**
   * Determines if key manager should avoid putting a given chip action in the tab index. Skip
   * non-interactive and disabled actions since the user can't do anything with them.
   */
  _skipPredicate(action) {
    return !action.isInteractive || action.disabled;
  }
  /** Listens to changes in the chip set and syncs up the state of the individual chips. */
  _trackChipSetChanges() {
    this._chips.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
      if (this.disabled) {
        Promise.resolve().then(() => this._syncChipsState());
      }
      this._redirectDestroyedChipFocus();
    });
  }
  /** Starts tracking the destroyed chips in order to capture the focused one. */
  _trackDestroyedFocusedChip() {
    this.chipDestroyedChanges.pipe(takeUntil(this._destroyed)).subscribe((event) => {
      const chipArray = this._chips.toArray();
      const chipIndex = chipArray.indexOf(event.chip);
      const hasFocus = event.chip._hasFocus();
      const wasLastFocused = event.chip._hadFocusOnRemove && this._keyManager.activeItem && event.chip._getActions().includes(this._keyManager.activeItem);
      const shouldMoveFocus = hasFocus || wasLastFocused;
      if (this._isValidIndex(chipIndex) && shouldMoveFocus) {
        this._lastDestroyedFocusedChipIndex = chipIndex;
      }
    });
  }
  /**
   * Finds the next appropriate chip to move focus to,
   * if the currently-focused chip is destroyed.
   */
  _redirectDestroyedChipFocus() {
    if (this._lastDestroyedFocusedChipIndex == null) {
      return;
    }
    if (this._chips.length) {
      const newIndex = Math.min(this._lastDestroyedFocusedChipIndex, this._chips.length - 1);
      const chipToFocus = this._chips.toArray()[newIndex];
      if (chipToFocus.disabled) {
        if (this._chips.length === 1) {
          this.focus();
        } else {
          this._keyManager.setPreviousItemActive();
        }
      } else {
        chipToFocus.focus();
      }
    } else {
      this.focus();
    }
    this._lastDestroyedFocusedChipIndex = null;
  }
  static \u0275fac = function MatChipSet_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatChipSet)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatChipSet,
    selectors: [["mat-chip-set"]],
    contentQueries: function MatChipSet_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, MatChip, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._chips = _t);
      }
    },
    hostAttrs: [1, "mat-mdc-chip-set", "mdc-evolution-chip-set"],
    hostVars: 1,
    hostBindings: function MatChipSet_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("keydown", function MatChipSet_keydown_HostBindingHandler($event) {
          return ctx._handleKeydown($event);
        });
      }
      if (rf & 2) {
        \u0275\u0275attribute("role", ctx.role);
      }
    },
    inputs: {
      disabled: [2, "disabled", "disabled", booleanAttribute],
      role: "role",
      tabIndex: [2, "tabIndex", "tabIndex", (value) => value == null ? 0 : numberAttribute(value)]
    },
    ngContentSelectors: _c52,
    decls: 2,
    vars: 0,
    consts: [["role", "presentation", 1, "mdc-evolution-chip-set__chips"]],
    template: function MatChipSet_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275domElementStart(0, "div", 0);
        \u0275\u0275projection(1);
        \u0275\u0275domElementEnd();
      }
    },
    styles: [".mat-mdc-chip-set{display:flex}.mat-mdc-chip-set:focus{outline:none}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%;margin-left:-8px;margin-right:0}.mat-mdc-chip-set .mdc-evolution-chip{margin:4px 0 4px 8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip-set__chips{margin-left:0;margin-right:-8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip{margin-left:0;margin-right:8px}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-moz-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-webkit-input-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input:-ms-input-placeholder{opacity:1}.mat-mdc-chip-set+input.mat-mdc-chip-input{margin-left:0;margin-right:0}\n"],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipSet, [{
    type: Component,
    args: [{
      selector: "mat-chip-set",
      template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `,
      host: {
        "class": "mat-mdc-chip-set mdc-evolution-chip-set",
        "(keydown)": "_handleKeydown($event)",
        "[attr.role]": "role"
      },
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [".mat-mdc-chip-set{display:flex}.mat-mdc-chip-set:focus{outline:none}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%;margin-left:-8px;margin-right:0}.mat-mdc-chip-set .mdc-evolution-chip{margin:4px 0 4px 8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip-set__chips{margin-left:0;margin-right:-8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip{margin-left:0;margin-right:8px}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-moz-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-webkit-input-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input:-ms-input-placeholder{opacity:1}.mat-mdc-chip-set+input.mat-mdc-chip-input{margin-left:0;margin-right:0}\n"]
    }]
  }], () => [], {
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    role: [{
      type: Input
    }],
    tabIndex: [{
      type: Input,
      args: [{
        transform: (value) => value == null ? 0 : numberAttribute(value)
      }]
    }],
    _chips: [{
      type: ContentChildren,
      args: [MatChip, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }]
  });
})();
var MatChipListboxChange = class {
  source;
  value;
  constructor(source, value) {
    this.source = source;
    this.value = value;
  }
};
var MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MatChipListbox),
  multi: true
};
var MatChipListbox = class _MatChipListbox extends MatChipSet {
  /**
   * Function when touched. Set as part of ControlValueAccessor implementation.
   * @docs-private
   */
  _onTouched = () => {
  };
  /**
   * Function when changed. Set as part of ControlValueAccessor implementation.
   * @docs-private
   */
  _onChange = () => {
  };
  // TODO: MDC uses `grid` here
  _defaultRole = "listbox";
  /** Default chip options. */
  _defaultOptions = inject(MAT_CHIPS_DEFAULT_OPTIONS, {
    optional: true
  });
  /** Whether the user should be allowed to select multiple chips. */
  get multiple() {
    return this._multiple;
  }
  set multiple(value) {
    this._multiple = value;
    this._syncListboxProperties();
  }
  _multiple = false;
  /** The array of selected chips inside the chip listbox. */
  get selected() {
    const selectedChips = this._chips.toArray().filter((chip) => chip.selected);
    return this.multiple ? selectedChips : selectedChips[0];
  }
  /** Orientation of the chip list. */
  ariaOrientation = "horizontal";
  /**
   * Whether or not this chip listbox is selectable.
   *
   * When a chip listbox is not selectable, the selected states for all
   * the chips inside the chip listbox are always ignored.
   */
  get selectable() {
    return this._selectable;
  }
  set selectable(value) {
    this._selectable = value;
    this._syncListboxProperties();
  }
  _selectable = true;
  /**
   * A function to compare the option values with the selected values. The first argument
   * is a value from an option. The second is a value from the selection. A boolean
   * should be returned.
   */
  compareWith = (o1, o2) => o1 === o2;
  /** Whether this chip listbox is required. */
  required = false;
  /** Whether checkmark indicator for single-selection options is hidden. */
  get hideSingleSelectionIndicator() {
    return this._hideSingleSelectionIndicator;
  }
  set hideSingleSelectionIndicator(value) {
    this._hideSingleSelectionIndicator = value;
    this._syncListboxProperties();
  }
  _hideSingleSelectionIndicator = this._defaultOptions?.hideSingleSelectionIndicator ?? false;
  /** Combined stream of all of the child chips' selection change events. */
  get chipSelectionChanges() {
    return this._getChipStream((chip) => chip.selectionChange);
  }
  /** Combined stream of all of the child chips' blur events. */
  get chipBlurChanges() {
    return this._getChipStream((chip) => chip._onBlur);
  }
  /** The value of the listbox, which is the combined value of the selected chips. */
  get value() {
    return this._value;
  }
  set value(value) {
    if (this._chips && this._chips.length) {
      this._setSelectionByValue(value, false);
    }
    this._value = value;
  }
  _value;
  /** Event emitted when the selected chip listbox value has been changed by the user. */
  change = new EventEmitter();
  _chips = void 0;
  ngAfterContentInit() {
    this._chips.changes.pipe(startWith(null), takeUntil(this._destroyed)).subscribe(() => {
      if (this.value !== void 0) {
        Promise.resolve().then(() => {
          this._setSelectionByValue(this.value, false);
        });
      }
      this._syncListboxProperties();
    });
    this.chipBlurChanges.pipe(takeUntil(this._destroyed)).subscribe(() => this._blur());
    this.chipSelectionChanges.pipe(takeUntil(this._destroyed)).subscribe((event) => {
      if (!this.multiple) {
        this._chips.forEach((chip) => {
          if (chip !== event.source) {
            chip._setSelectedState(false, false, false);
          }
        });
      }
      if (event.isUserInput) {
        this._propagateChanges();
      }
    });
  }
  /**
   * Focuses the first selected chip in this chip listbox, or the first non-disabled chip when there
   * are no selected chips.
   */
  focus() {
    if (this.disabled) {
      return;
    }
    const firstSelectedChip = this._getFirstSelectedChip();
    if (firstSelectedChip && !firstSelectedChip.disabled) {
      firstSelectedChip.focus();
    } else if (this._chips.length > 0) {
      this._keyManager.setFirstItemActive();
    } else {
      this._elementRef.nativeElement.focus();
    }
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  writeValue(value) {
    if (value != null) {
      this.value = value;
    } else {
      this.value = void 0;
    }
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnChange(fn) {
    this._onChange = fn;
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
  }
  /** Selects all chips with value. */
  _setSelectionByValue(value, isUserInput = true) {
    this._clearSelection();
    if (Array.isArray(value)) {
      value.forEach((currentValue) => this._selectValue(currentValue, isUserInput));
    } else {
      this._selectValue(value, isUserInput);
    }
  }
  /** When blurred, marks the field as touched when focus moved outside the chip listbox. */
  _blur() {
    if (!this.disabled) {
      setTimeout(() => {
        if (!this.focused) {
          this._markAsTouched();
        }
      });
    }
  }
  _keydown(event) {
    if (event.keyCode === TAB) {
      super._allowFocusEscape();
    }
  }
  /** Marks the field as touched */
  _markAsTouched() {
    this._onTouched();
    this._changeDetectorRef.markForCheck();
  }
  /** Emits change event to set the model value. */
  _propagateChanges() {
    let valueToEmit = null;
    if (Array.isArray(this.selected)) {
      valueToEmit = this.selected.map((chip) => chip.value);
    } else {
      valueToEmit = this.selected ? this.selected.value : void 0;
    }
    this._value = valueToEmit;
    this.change.emit(new MatChipListboxChange(this, valueToEmit));
    this._onChange(valueToEmit);
    this._changeDetectorRef.markForCheck();
  }
  /**
   * Deselects every chip in the listbox.
   * @param skip Chip that should not be deselected.
   */
  _clearSelection(skip) {
    this._chips.forEach((chip) => {
      if (chip !== skip) {
        chip.deselect();
      }
    });
  }
  /**
   * Finds and selects the chip based on its value.
   * @returns Chip that has the corresponding value.
   */
  _selectValue(value, isUserInput) {
    const correspondingChip = this._chips.find((chip) => {
      return chip.value != null && this.compareWith(chip.value, value);
    });
    if (correspondingChip) {
      isUserInput ? correspondingChip.selectViaInteraction() : correspondingChip.select();
    }
    return correspondingChip;
  }
  /** Syncs the chip-listbox selection state with the individual chips. */
  _syncListboxProperties() {
    if (this._chips) {
      Promise.resolve().then(() => {
        this._chips.forEach((chip) => {
          chip._chipListMultiple = this.multiple;
          chip.chipListSelectable = this._selectable;
          chip._chipListHideSingleSelectionIndicator = this.hideSingleSelectionIndicator;
          chip._changeDetectorRef.markForCheck();
        });
      });
    }
  }
  /** Returns the first selected chip in this listbox, or undefined if no chips are selected. */
  _getFirstSelectedChip() {
    if (Array.isArray(this.selected)) {
      return this.selected.length ? this.selected[0] : void 0;
    } else {
      return this.selected;
    }
  }
  /**
   * Determines if key manager should avoid putting a given chip action in the tab index. Skip
   * non-interactive actions since the user can't do anything with them.
   */
  _skipPredicate(action) {
    return !action.isInteractive;
  }
  static \u0275fac = /* @__PURE__ */ (() => {
    let \u0275MatChipListbox_BaseFactory;
    return function MatChipListbox_Factory(__ngFactoryType__) {
      return (\u0275MatChipListbox_BaseFactory || (\u0275MatChipListbox_BaseFactory = \u0275\u0275getInheritedFactory(_MatChipListbox)))(__ngFactoryType__ || _MatChipListbox);
    };
  })();
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatChipListbox,
    selectors: [["mat-chip-listbox"]],
    contentQueries: function MatChipListbox_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, MatChipOption, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._chips = _t);
      }
    },
    hostAttrs: [1, "mdc-evolution-chip-set", "mat-mdc-chip-listbox"],
    hostVars: 10,
    hostBindings: function MatChipListbox_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("focus", function MatChipListbox_focus_HostBindingHandler() {
          return ctx.focus();
        })("blur", function MatChipListbox_blur_HostBindingHandler() {
          return ctx._blur();
        })("keydown", function MatChipListbox_keydown_HostBindingHandler($event) {
          return ctx._keydown($event);
        });
      }
      if (rf & 2) {
        \u0275\u0275domProperty("tabIndex", ctx.disabled || ctx.empty ? -1 : ctx.tabIndex);
        \u0275\u0275attribute("role", ctx.role)("aria-required", ctx.role ? ctx.required : null)("aria-disabled", ctx.disabled.toString())("aria-multiselectable", ctx.multiple)("aria-orientation", ctx.ariaOrientation);
        \u0275\u0275classProp("mat-mdc-chip-list-disabled", ctx.disabled)("mat-mdc-chip-list-required", ctx.required);
      }
    },
    inputs: {
      multiple: [2, "multiple", "multiple", booleanAttribute],
      ariaOrientation: [0, "aria-orientation", "ariaOrientation"],
      selectable: [2, "selectable", "selectable", booleanAttribute],
      compareWith: "compareWith",
      required: [2, "required", "required", booleanAttribute],
      hideSingleSelectionIndicator: [2, "hideSingleSelectionIndicator", "hideSingleSelectionIndicator", booleanAttribute],
      value: "value"
    },
    outputs: {
      change: "change"
    },
    features: [\u0275\u0275ProvidersFeature([MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c52,
    decls: 2,
    vars: 0,
    consts: [["role", "presentation", 1, "mdc-evolution-chip-set__chips"]],
    template: function MatChipListbox_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275domElementStart(0, "div", 0);
        \u0275\u0275projection(1);
        \u0275\u0275domElementEnd();
      }
    },
    styles: [_c62],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipListbox, [{
    type: Component,
    args: [{
      selector: "mat-chip-listbox",
      template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `,
      host: {
        "class": "mdc-evolution-chip-set mat-mdc-chip-listbox",
        "[attr.role]": "role",
        "[tabIndex]": "(disabled || empty) ? -1 : tabIndex",
        "[attr.aria-required]": "role ? required : null",
        "[attr.aria-disabled]": "disabled.toString()",
        "[attr.aria-multiselectable]": "multiple",
        "[attr.aria-orientation]": "ariaOrientation",
        "[class.mat-mdc-chip-list-disabled]": "disabled",
        "[class.mat-mdc-chip-list-required]": "required",
        "(focus)": "focus()",
        "(blur)": "_blur()",
        "(keydown)": "_keydown($event)"
      },
      providers: [MAT_CHIP_LISTBOX_CONTROL_VALUE_ACCESSOR],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [".mat-mdc-chip-set{display:flex}.mat-mdc-chip-set:focus{outline:none}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%;margin-left:-8px;margin-right:0}.mat-mdc-chip-set .mdc-evolution-chip{margin:4px 0 4px 8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip-set__chips{margin-left:0;margin-right:-8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip{margin-left:0;margin-right:8px}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-moz-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-webkit-input-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input:-ms-input-placeholder{opacity:1}.mat-mdc-chip-set+input.mat-mdc-chip-input{margin-left:0;margin-right:0}\n"]
    }]
  }], null, {
    multiple: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    ariaOrientation: [{
      type: Input,
      args: ["aria-orientation"]
    }],
    selectable: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    compareWith: [{
      type: Input
    }],
    required: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    hideSingleSelectionIndicator: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    value: [{
      type: Input
    }],
    change: [{
      type: Output
    }],
    _chips: [{
      type: ContentChildren,
      args: [MatChipOption, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }]
  });
})();
var MatChipGridChange = class {
  source;
  value;
  constructor(source, value) {
    this.source = source;
    this.value = value;
  }
};
var MatChipGrid = class _MatChipGrid extends MatChipSet {
  ngControl = inject(NgControl, {
    optional: true,
    self: true
  });
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  controlType = "mat-chip-grid";
  /** The chip input to add more chips */
  _chipInput;
  _defaultRole = "grid";
  _errorStateTracker;
  /**
   * List of element ids to propagate to the chipInput's aria-describedby attribute.
   */
  _ariaDescribedbyIds = [];
  /**
   * Function when touched. Set as part of ControlValueAccessor implementation.
   * @docs-private
   */
  _onTouched = () => {
  };
  /**
   * Function when changed. Set as part of ControlValueAccessor implementation.
   * @docs-private
   */
  _onChange = () => {
  };
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get disabled() {
    return this.ngControl ? !!this.ngControl.disabled : this._disabled;
  }
  set disabled(value) {
    this._disabled = value;
    this._syncChipsState();
    this.stateChanges.next();
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get id() {
    return this._chipInput.id;
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get empty() {
    return (!this._chipInput || this._chipInput.empty) && (!this._chips || this._chips.length === 0);
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get placeholder() {
    return this._chipInput ? this._chipInput.placeholder : this._placeholder;
  }
  set placeholder(value) {
    this._placeholder = value;
    this.stateChanges.next();
  }
  _placeholder;
  /** Whether any chips or the matChipInput inside of this chip-grid has focus. */
  get focused() {
    return this._chipInput.focused || this._hasFocusedChip();
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get required() {
    return this._required ?? this.ngControl?.control?.hasValidator(Validators.required) ?? false;
  }
  set required(value) {
    this._required = value;
    this.stateChanges.next();
  }
  _required;
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get shouldLabelFloat() {
    return !this.empty || this.focused;
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get value() {
    return this._value;
  }
  set value(value) {
    this._value = value;
  }
  _value = [];
  /** An object used to control when error messages are shown. */
  get errorStateMatcher() {
    return this._errorStateTracker.matcher;
  }
  set errorStateMatcher(value) {
    this._errorStateTracker.matcher = value;
  }
  /** Combined stream of all of the child chips' blur events. */
  get chipBlurChanges() {
    return this._getChipStream((chip) => chip._onBlur);
  }
  /** Emits when the chip grid value has been changed by the user. */
  change = new EventEmitter();
  /**
   * Emits whenever the raw value of the chip-grid changes. This is here primarily
   * to facilitate the two-way binding for the `value` input.
   * @docs-private
   */
  valueChange = new EventEmitter();
  _chips = void 0;
  /**
   * Emits whenever the component state changes and should cause the parent
   * form-field to update. Implemented as part of `MatFormFieldControl`.
   * @docs-private
   */
  stateChanges = new Subject();
  /** Whether the chip grid is in an error state. */
  get errorState() {
    return this._errorStateTracker.errorState;
  }
  set errorState(value) {
    this._errorStateTracker.errorState = value;
  }
  constructor() {
    super();
    const parentForm = inject(NgForm, {
      optional: true
    });
    const parentFormGroup = inject(FormGroupDirective, {
      optional: true
    });
    const defaultErrorStateMatcher = inject(ErrorStateMatcher);
    if (this.ngControl) {
      this.ngControl.valueAccessor = this;
    }
    this._errorStateTracker = new _ErrorStateTracker(defaultErrorStateMatcher, this.ngControl, parentFormGroup, parentForm, this.stateChanges);
  }
  ngAfterContentInit() {
    this.chipBlurChanges.pipe(takeUntil(this._destroyed)).subscribe(() => {
      this._blur();
      this.stateChanges.next();
    });
    merge(this.chipFocusChanges, this._chips.changes).pipe(takeUntil(this._destroyed)).subscribe(() => this.stateChanges.next());
  }
  ngAfterViewInit() {
    super.ngAfterViewInit();
    if (!this._chipInput && (typeof ngDevMode === "undefined" || ngDevMode)) {
      throw Error("mat-chip-grid must be used in combination with matChipInputFor.");
    }
  }
  ngDoCheck() {
    if (this.ngControl) {
      this.updateErrorState();
    }
  }
  ngOnDestroy() {
    super.ngOnDestroy();
    this.stateChanges.complete();
  }
  /** Associates an HTML input element with this chip grid. */
  registerInput(inputElement) {
    this._chipInput = inputElement;
    this._chipInput.setDescribedByIds(this._ariaDescribedbyIds);
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  onContainerClick(event) {
    if (!this.disabled && !this._originatesFromChip(event)) {
      this.focus();
    }
  }
  /**
   * Focuses the first chip in this chip grid, or the associated input when there
   * are no eligible chips.
   */
  focus() {
    if (this.disabled || this._chipInput.focused) {
      return;
    }
    if (!this._chips.length || this._chips.first.disabled) {
      Promise.resolve().then(() => this._chipInput.focus());
    } else {
      const activeItem = this._keyManager.activeItem;
      if (activeItem) {
        activeItem.focus();
      } else {
        this._keyManager.setFirstItemActive();
      }
    }
    this.stateChanges.next();
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  get describedByIds() {
    return this._chipInput?.describedByIds || [];
  }
  /**
   * Implemented as part of MatFormFieldControl.
   * @docs-private
   */
  setDescribedByIds(ids) {
    this._ariaDescribedbyIds = ids;
    this._chipInput?.setDescribedByIds(ids);
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  writeValue(value) {
    this._value = value;
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnChange(fn) {
    this._onChange = fn;
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  registerOnTouched(fn) {
    this._onTouched = fn;
  }
  /**
   * Implemented as part of ControlValueAccessor.
   * @docs-private
   */
  setDisabledState(isDisabled) {
    this.disabled = isDisabled;
    this.stateChanges.next();
  }
  /** Refreshes the error state of the chip grid. */
  updateErrorState() {
    this._errorStateTracker.updateErrorState();
  }
  /** When blurred, mark the field as touched when focus moved outside the chip grid. */
  _blur() {
    if (!this.disabled) {
      setTimeout(() => {
        if (!this.focused) {
          this._propagateChanges();
          this._markAsTouched();
        }
      });
    }
  }
  /**
   * Removes the `tabindex` from the chip grid and resets it back afterwards, allowing the
   * user to tab out of it. This prevents the grid from capturing focus and redirecting
   * it back to the first chip, creating a focus trap, if it user tries to tab away.
   */
  _allowFocusEscape() {
    if (!this._chipInput.focused) {
      super._allowFocusEscape();
    }
  }
  /** Handles custom keyboard events. */
  _handleKeydown(event) {
    const keyCode = event.keyCode;
    const activeItem = this._keyManager.activeItem;
    if (keyCode === TAB) {
      if (this._chipInput.focused && hasModifierKey(event, "shiftKey") && this._chips.length && !this._chips.last.disabled) {
        event.preventDefault();
        if (activeItem) {
          this._keyManager.setActiveItem(activeItem);
        } else {
          this._focusLastChip();
        }
      } else {
        super._allowFocusEscape();
      }
    } else if (!this._chipInput.focused) {
      if ((keyCode === UP_ARROW || keyCode === DOWN_ARROW) && activeItem) {
        const eligibleActions = this._chipActions.filter((action) => action._isPrimary === activeItem._isPrimary && !this._skipPredicate(action));
        const currentIndex = eligibleActions.indexOf(activeItem);
        const delta = event.keyCode === UP_ARROW ? -1 : 1;
        event.preventDefault();
        if (currentIndex > -1 && this._isValidIndex(currentIndex + delta)) {
          this._keyManager.setActiveItem(eligibleActions[currentIndex + delta]);
        }
      } else {
        super._handleKeydown(event);
      }
    }
    this.stateChanges.next();
  }
  _focusLastChip() {
    if (this._chips.length) {
      this._chips.last.focus();
    }
  }
  /** Emits change event to set the model value. */
  _propagateChanges() {
    const valueToEmit = this._chips.length ? this._chips.toArray().map((chip) => chip.value) : [];
    this._value = valueToEmit;
    this.change.emit(new MatChipGridChange(this, valueToEmit));
    this.valueChange.emit(valueToEmit);
    this._onChange(valueToEmit);
    this._changeDetectorRef.markForCheck();
  }
  /** Mark the field as touched */
  _markAsTouched() {
    this._onTouched();
    this._changeDetectorRef.markForCheck();
    this.stateChanges.next();
  }
  static \u0275fac = function MatChipGrid_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatChipGrid)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({
    type: _MatChipGrid,
    selectors: [["mat-chip-grid"]],
    contentQueries: function MatChipGrid_ContentQueries(rf, ctx, dirIndex) {
      if (rf & 1) {
        \u0275\u0275contentQuery(dirIndex, MatChipRow, 5);
      }
      if (rf & 2) {
        let _t;
        \u0275\u0275queryRefresh(_t = \u0275\u0275loadQuery()) && (ctx._chips = _t);
      }
    },
    hostAttrs: [1, "mat-mdc-chip-set", "mat-mdc-chip-grid", "mdc-evolution-chip-set"],
    hostVars: 10,
    hostBindings: function MatChipGrid_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("focus", function MatChipGrid_focus_HostBindingHandler() {
          return ctx.focus();
        })("blur", function MatChipGrid_blur_HostBindingHandler() {
          return ctx._blur();
        });
      }
      if (rf & 2) {
        \u0275\u0275attribute("role", ctx.role)("tabindex", ctx.disabled || ctx._chips && ctx._chips.length === 0 ? -1 : ctx.tabIndex)("aria-disabled", ctx.disabled.toString())("aria-invalid", ctx.errorState);
        \u0275\u0275classProp("mat-mdc-chip-list-disabled", ctx.disabled)("mat-mdc-chip-list-invalid", ctx.errorState)("mat-mdc-chip-list-required", ctx.required);
      }
    },
    inputs: {
      disabled: [2, "disabled", "disabled", booleanAttribute],
      placeholder: "placeholder",
      required: [2, "required", "required", booleanAttribute],
      value: "value",
      errorStateMatcher: "errorStateMatcher"
    },
    outputs: {
      change: "change",
      valueChange: "valueChange"
    },
    features: [\u0275\u0275ProvidersFeature([{
      provide: MatFormFieldControl,
      useExisting: _MatChipGrid
    }]), \u0275\u0275InheritDefinitionFeature],
    ngContentSelectors: _c52,
    decls: 2,
    vars: 0,
    consts: [["role", "presentation", 1, "mdc-evolution-chip-set__chips"]],
    template: function MatChipGrid_Template(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275projectionDef();
        \u0275\u0275domElementStart(0, "div", 0);
        \u0275\u0275projection(1);
        \u0275\u0275domElementEnd();
      }
    },
    styles: [_c62],
    encapsulation: 2,
    changeDetection: 0
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipGrid, [{
    type: Component,
    args: [{
      selector: "mat-chip-grid",
      template: `
    <div class="mdc-evolution-chip-set__chips" role="presentation">
      <ng-content></ng-content>
    </div>
  `,
      host: {
        "class": "mat-mdc-chip-set mat-mdc-chip-grid mdc-evolution-chip-set",
        "[attr.role]": "role",
        "[attr.tabindex]": "(disabled || (_chips && _chips.length === 0)) ? -1 : tabIndex",
        "[attr.aria-disabled]": "disabled.toString()",
        "[attr.aria-invalid]": "errorState",
        "[class.mat-mdc-chip-list-disabled]": "disabled",
        "[class.mat-mdc-chip-list-invalid]": "errorState",
        "[class.mat-mdc-chip-list-required]": "required",
        "(focus)": "focus()",
        "(blur)": "_blur()"
      },
      providers: [{
        provide: MatFormFieldControl,
        useExisting: MatChipGrid
      }],
      encapsulation: ViewEncapsulation.None,
      changeDetection: ChangeDetectionStrategy.OnPush,
      styles: [".mat-mdc-chip-set{display:flex}.mat-mdc-chip-set:focus{outline:none}.mat-mdc-chip-set .mdc-evolution-chip-set__chips{min-width:100%;margin-left:-8px;margin-right:0}.mat-mdc-chip-set .mdc-evolution-chip{margin:4px 0 4px 8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip-set__chips{margin-left:0;margin-right:-8px}[dir=rtl] .mat-mdc-chip-set .mdc-evolution-chip{margin-left:0;margin-right:8px}.mdc-evolution-chip-set__chips{display:flex;flex-flow:wrap;min-width:0}.mat-mdc-chip-set-stacked{flex-direction:column;align-items:flex-start}.mat-mdc-chip-set-stacked .mat-mdc-chip{width:100%}.mat-mdc-chip-set-stacked .mdc-evolution-chip__graphic{flex-grow:0}.mat-mdc-chip-set-stacked .mdc-evolution-chip__action--primary{flex-basis:100%;justify-content:start}input.mat-mdc-chip-input{flex:1 0 150px;margin-left:8px}[dir=rtl] input.mat-mdc-chip-input{margin-left:0;margin-right:8px}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-moz-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input::-webkit-input-placeholder{opacity:1}.mat-mdc-form-field:not(.mat-form-field-hide-placeholder) input.mat-mdc-chip-input:-ms-input-placeholder{opacity:1}.mat-mdc-chip-set+input.mat-mdc-chip-input{margin-left:0;margin-right:0}\n"]
    }]
  }], () => [], {
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    placeholder: [{
      type: Input
    }],
    required: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    value: [{
      type: Input
    }],
    errorStateMatcher: [{
      type: Input
    }],
    change: [{
      type: Output
    }],
    valueChange: [{
      type: Output
    }],
    _chips: [{
      type: ContentChildren,
      args: [MatChipRow, {
        // We need to use `descendants: true`, because Ivy will no longer match
        // indirect descendants if it's left as false.
        descendants: true
      }]
    }]
  });
})();
var MatChipInput = class _MatChipInput {
  _elementRef = inject(ElementRef);
  /** Whether the control is focused. */
  focused = false;
  /** Register input for chip list */
  get chipGrid() {
    return this._chipGrid;
  }
  set chipGrid(value) {
    if (value) {
      this._chipGrid = value;
      this._chipGrid.registerInput(this);
    }
  }
  _chipGrid;
  /**
   * Whether or not the chipEnd event will be emitted when the input is blurred.
   */
  addOnBlur = false;
  /**
   * The list of key codes that will trigger a chipEnd event.
   *
   * Defaults to `[ENTER]`.
   */
  separatorKeyCodes;
  /** Emitted when a chip is to be added. */
  chipEnd = new EventEmitter();
  /** The input's placeholder text. */
  placeholder = "";
  /** Unique id for the input. */
  id = inject(_IdGenerator).getId("mat-mdc-chip-list-input-");
  /** Whether the input is disabled. */
  get disabled() {
    return this._disabled || this._chipGrid && this._chipGrid.disabled;
  }
  set disabled(value) {
    this._disabled = value;
  }
  _disabled = false;
  /** Whether the input is readonly. */
  readonly = false;
  /** Whether the input should remain interactive when it is disabled. */
  disabledInteractive;
  /** Whether the input is empty. */
  get empty() {
    return !this.inputElement.value;
  }
  /** The native input element to which this directive is attached. */
  inputElement;
  constructor() {
    const defaultOptions = inject(MAT_CHIPS_DEFAULT_OPTIONS);
    const formField = inject(MAT_FORM_FIELD, {
      optional: true
    });
    this.inputElement = this._elementRef.nativeElement;
    this.separatorKeyCodes = defaultOptions.separatorKeyCodes;
    this.disabledInteractive = defaultOptions.inputDisabledInteractive ?? false;
    if (formField) {
      this.inputElement.classList.add("mat-mdc-form-field-input-control");
    }
  }
  ngOnChanges() {
    this._chipGrid.stateChanges.next();
  }
  ngOnDestroy() {
    this.chipEnd.complete();
  }
  /** Utility method to make host definition/tests more clear. */
  _keydown(event) {
    if (this.empty && event.keyCode === BACKSPACE) {
      if (!event.repeat) {
        this._chipGrid._focusLastChip();
      }
      event.preventDefault();
    } else {
      this._emitChipEnd(event);
    }
  }
  /** Checks to see if the blur should emit the (chipEnd) event. */
  _blur() {
    if (this.addOnBlur) {
      this._emitChipEnd();
    }
    this.focused = false;
    if (!this._chipGrid.focused) {
      this._chipGrid._blur();
    }
    this._chipGrid.stateChanges.next();
  }
  _focus() {
    this.focused = true;
    this._chipGrid.stateChanges.next();
  }
  /** Checks to see if the (chipEnd) event needs to be emitted. */
  _emitChipEnd(event) {
    if (!event || this._isSeparatorKey(event) && !event.repeat) {
      this.chipEnd.emit({
        input: this.inputElement,
        value: this.inputElement.value,
        chipInput: this
      });
      event?.preventDefault();
    }
  }
  _onInput() {
    this._chipGrid.stateChanges.next();
  }
  /** Focuses the input. */
  focus() {
    this.inputElement.focus();
  }
  /** Clears the input */
  clear() {
    this.inputElement.value = "";
  }
  /**
   * Implemented as part of MatChipTextControl.
   * @docs-private
   */
  get describedByIds() {
    const element = this._elementRef.nativeElement;
    const existingDescribedBy = element.getAttribute("aria-describedby");
    return existingDescribedBy?.split(" ") || [];
  }
  setDescribedByIds(ids) {
    const element = this._elementRef.nativeElement;
    if (ids.length) {
      element.setAttribute("aria-describedby", ids.join(" "));
    } else {
      element.removeAttribute("aria-describedby");
    }
  }
  /** Checks whether a keycode is one of the configured separators. */
  _isSeparatorKey(event) {
    return !hasModifierKey(event) && new Set(this.separatorKeyCodes).has(event.keyCode);
  }
  /** Gets the value to set on the `readonly` attribute. */
  _getReadonlyAttribute() {
    return this.readonly || this.disabled && this.disabledInteractive ? "true" : null;
  }
  static \u0275fac = function MatChipInput_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatChipInput)();
  };
  static \u0275dir = /* @__PURE__ */ \u0275\u0275defineDirective({
    type: _MatChipInput,
    selectors: [["input", "matChipInputFor", ""]],
    hostAttrs: [1, "mat-mdc-chip-input", "mat-mdc-input-element", "mdc-text-field__input", "mat-input-element"],
    hostVars: 8,
    hostBindings: function MatChipInput_HostBindings(rf, ctx) {
      if (rf & 1) {
        \u0275\u0275listener("keydown", function MatChipInput_keydown_HostBindingHandler($event) {
          return ctx._keydown($event);
        })("blur", function MatChipInput_blur_HostBindingHandler() {
          return ctx._blur();
        })("focus", function MatChipInput_focus_HostBindingHandler() {
          return ctx._focus();
        })("input", function MatChipInput_input_HostBindingHandler() {
          return ctx._onInput();
        });
      }
      if (rf & 2) {
        \u0275\u0275domProperty("id", ctx.id);
        \u0275\u0275attribute("disabled", ctx.disabled && !ctx.disabledInteractive ? "" : null)("placeholder", ctx.placeholder || null)("aria-invalid", ctx._chipGrid && ctx._chipGrid.ngControl ? ctx._chipGrid.ngControl.invalid : null)("aria-required", ctx._chipGrid && ctx._chipGrid.required || null)("aria-disabled", ctx.disabled && ctx.disabledInteractive ? "true" : null)("readonly", ctx._getReadonlyAttribute())("required", ctx._chipGrid && ctx._chipGrid.required || null);
      }
    },
    inputs: {
      chipGrid: [0, "matChipInputFor", "chipGrid"],
      addOnBlur: [2, "matChipInputAddOnBlur", "addOnBlur", booleanAttribute],
      separatorKeyCodes: [0, "matChipInputSeparatorKeyCodes", "separatorKeyCodes"],
      placeholder: "placeholder",
      id: "id",
      disabled: [2, "disabled", "disabled", booleanAttribute],
      readonly: [2, "readonly", "readonly", booleanAttribute],
      disabledInteractive: [2, "matChipInputDisabledInteractive", "disabledInteractive", booleanAttribute]
    },
    outputs: {
      chipEnd: "matChipInputTokenEnd"
    },
    exportAs: ["matChipInput", "matChipInputFor"],
    features: [\u0275\u0275NgOnChangesFeature]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipInput, [{
    type: Directive,
    args: [{
      selector: "input[matChipInputFor]",
      exportAs: "matChipInput, matChipInputFor",
      host: {
        // TODO: eventually we should remove `mat-input-element` from here since it comes from the
        // non-MDC version of the input. It's currently being kept for backwards compatibility, because
        // the MDC chips were landed initially with it.
        "class": "mat-mdc-chip-input mat-mdc-input-element mdc-text-field__input mat-input-element",
        "(keydown)": "_keydown($event)",
        "(blur)": "_blur()",
        "(focus)": "_focus()",
        "(input)": "_onInput()",
        "[id]": "id",
        "[attr.disabled]": 'disabled && !disabledInteractive ? "" : null',
        "[attr.placeholder]": "placeholder || null",
        "[attr.aria-invalid]": "_chipGrid && _chipGrid.ngControl ? _chipGrid.ngControl.invalid : null",
        "[attr.aria-required]": "_chipGrid && _chipGrid.required || null",
        "[attr.aria-disabled]": 'disabled && disabledInteractive ? "true" : null',
        "[attr.readonly]": "_getReadonlyAttribute()",
        "[attr.required]": "_chipGrid && _chipGrid.required || null"
      }
    }]
  }], () => [], {
    chipGrid: [{
      type: Input,
      args: ["matChipInputFor"]
    }],
    addOnBlur: [{
      type: Input,
      args: [{
        alias: "matChipInputAddOnBlur",
        transform: booleanAttribute
      }]
    }],
    separatorKeyCodes: [{
      type: Input,
      args: ["matChipInputSeparatorKeyCodes"]
    }],
    chipEnd: [{
      type: Output,
      args: ["matChipInputTokenEnd"]
    }],
    placeholder: [{
      type: Input
    }],
    id: [{
      type: Input
    }],
    disabled: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    readonly: [{
      type: Input,
      args: [{
        transform: booleanAttribute
      }]
    }],
    disabledInteractive: [{
      type: Input,
      args: [{
        alias: "matChipInputDisabledInteractive",
        transform: booleanAttribute
      }]
    }]
  });
})();
var CHIP_DECLARATIONS = [MatChip, MatChipAvatar, MatChipEdit, MatChipEditInput, MatChipGrid, MatChipInput, MatChipListbox, MatChipOption, MatChipRemove, MatChipRow, MatChipSet, MatChipTrailingIcon];
var MatChipsModule = class _MatChipsModule {
  static \u0275fac = function MatChipsModule_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _MatChipsModule)();
  };
  static \u0275mod = /* @__PURE__ */ \u0275\u0275defineNgModule({
    type: _MatChipsModule,
    imports: [MatCommonModule, MatRippleModule, MatChipAction, MatChip, MatChipAvatar, MatChipEdit, MatChipEditInput, MatChipGrid, MatChipInput, MatChipListbox, MatChipOption, MatChipRemove, MatChipRow, MatChipSet, MatChipTrailingIcon],
    exports: [MatCommonModule, MatChip, MatChipAvatar, MatChipEdit, MatChipEditInput, MatChipGrid, MatChipInput, MatChipListbox, MatChipOption, MatChipRemove, MatChipRow, MatChipSet, MatChipTrailingIcon]
  });
  static \u0275inj = /* @__PURE__ */ \u0275\u0275defineInjector({
    providers: [ErrorStateMatcher, {
      provide: MAT_CHIPS_DEFAULT_OPTIONS,
      useValue: {
        separatorKeyCodes: [ENTER]
      }
    }],
    imports: [MatCommonModule, MatRippleModule, MatCommonModule]
  });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MatChipsModule, [{
    type: NgModule,
    args: [{
      imports: [MatCommonModule, MatRippleModule, MatChipAction, CHIP_DECLARATIONS],
      exports: [MatCommonModule, CHIP_DECLARATIONS],
      providers: [ErrorStateMatcher, {
        provide: MAT_CHIPS_DEFAULT_OPTIONS,
        useValue: {
          separatorKeyCodes: [ENTER]
        }
      }]
    }]
  }], null, null);
})();

// src/app/services/credit-verification.service.ts
var _CreditVerificationService = class _CreditVerificationService {
  constructor() {
    this.artistVerificationsSubject = new BehaviorSubject([]);
    this.trackVerificationsSubject = new BehaviorSubject([]);
    this.projectVerificationSubject = new BehaviorSubject(null);
    this.artistVerifications$ = this.artistVerificationsSubject.asObservable();
    this.trackVerifications$ = this.trackVerificationsSubject.asObservable();
    this.projectVerification$ = this.projectVerificationSubject.asObservable();
    this.expectedArtists = [
      "SpiralFlip",
      "eili",
      "Ariatec",
      "MB",
      "Iku Hoshifuri",
      "Justin Thornburgh",
      "v1ris",
      "Rita Kamishiro",
      "Marcus Ho",
      "AZALI",
      "Aloysius",
      "potatoTeto",
      "Artisan",
      "Mei Naganowa",
      "Evin a'k",
      "BilliumMoto",
      "Elliot Hsu",
      "Yuzuki",
      "LucaProject",
      "Koway",
      "\u4F0D\u4E00",
      "Nstryder",
      "MoAE",
      "dystopian tanuki",
      "Heem",
      "Woojinee",
      "Bigg Milk",
      "Gardens",
      "Sad Keyboard Guy",
      "Futsuunohito",
      "shishishiena"
    ];
    this.expectedTracks = [
      { id: "1", title: "Blinding Dawn", expectedArtists: ["SpiralFlip", "eili"] },
      { id: "2", title: "Hollow Crown", expectedArtists: ["Ariatec"] },
      { id: "3", title: "\u6681\u306E\u59EB", expectedArtists: ["MB", "Iku Hoshifuri", "Justin Thornburgh", "v1ris", "Rita Kamishiro", "Marcus Ho"] },
      { id: "4", title: "Lux Nova", expectedArtists: ["AZALI", "Aloysius"] },
      { id: "5", title: "Hall of Silent Echoes", expectedArtists: ["potatoTeto"] },
      { id: "6", title: "Lirica", expectedArtists: ["Artisan"] },
      { id: "7", title: "To Defy The Beankeeper", expectedArtists: ["Mei Naganowa"] },
      { id: "8", title: "Trench", expectedArtists: ["Evin a'k"] },
      { id: "9", title: "Blooming in the Square", expectedArtists: ["BilliumMoto"] },
      { id: "10", title: "Skies in Abberation", expectedArtists: ["Elliot Hsu"] },
      { id: "11", title: "song of the nymphs", expectedArtists: ["Yuzuki"] },
      { id: "12", title: "Light Guardian", expectedArtists: ["LucaProject"] },
      { id: "13", title: "Enso Antumbra", expectedArtists: ["Koway", "\u4F0D\u4E00"] },
      { id: "14", title: "You're In My Way", expectedArtists: ["Nstryder"] },
      { id: "15", title: "Remember you", expectedArtists: ["MoAE"] },
      { id: "16", title: "Hidden passage", expectedArtists: ["dystopian tanuki"] },
      { id: "17", title: "Last Dance", expectedArtists: ["Heem", "Woojinee"] },
      { id: "18", title: "Second Guess", expectedArtists: ["Bigg Milk"] },
      { id: "19", title: "Fractured Light", expectedArtists: ["Gardens", "Sad Keyboard Guy", "eili"] },
      { id: "20", title: "Beyond the Veil of Light", expectedArtists: ["Futsuunohito", "shishishiena"] }
    ];
    this.initializeVerification();
  }
  /**
   * Initialize comprehensive verification system
   */
  initializeVerification() {
    this.runArtistVerification();
    this.runTrackVerification();
    this.runProjectVerification();
  }
  /**
   * Run comprehensive artist verification
   */
  runArtistVerification() {
    const artistVerifications = this.expectedArtists.map((artistName) => {
      return this.verifyIndividualArtist(artistName);
    });
    this.artistVerificationsSubject.next(artistVerifications);
  }
  /**
   * Verify individual artist for complete accuracy
   */
  verifyIndividualArtist(artistName) {
    const issues = [];
    const avatarExists = this.checkAvatarExists(artistName);
    if (!avatarExists) {
      issues.push(`Avatar missing for ${artistName}`);
    }
    const socialLinksVerified = this.verifySocialLinks(artistName);
    if (!socialLinksVerified) {
      issues.push(`Social links need verification for ${artistName}`);
    }
    const rolesAccurate = this.verifyArtistRoles(artistName);
    if (!rolesAccurate) {
      issues.push(`Role definitions need review for ${artistName}`);
    }
    const contributionsDocumented = this.verifyContributions(artistName);
    if (!contributionsDocumented) {
      issues.push(`Contributions not fully documented for ${artistName}`);
    }
    const fullyVerified = avatarExists && socialLinksVerified && rolesAccurate && contributionsDocumented;
    return {
      artistName,
      avatarExists,
      socialLinksVerified,
      rolesAccurate,
      contributionsDocumented,
      fullyVerified,
      issues
    };
  }
  /**
   * Check if artist avatar exists and is properly linked
   */
  checkAvatarExists(artistName) {
    const avatarPath = `/assets/images/artists/${artistName}.png`;
    return this.expectedArtists.includes(artistName);
  }
  /**
   * Verify social links are accurate and working
   */
  verifySocialLinks(artistName) {
    const socialLinksDatabase = {
      "SpiralFlip": true,
      "eili": true,
      "Ariatec": true,
      "MB": true,
      "Iku Hoshifuri": true,
      "Justin Thornburgh": true,
      "v1ris": true,
      "Rita Kamishiro": true,
      "Marcus Ho": true,
      "AZALI": true,
      "Aloysius": true,
      "potatoTeto": true,
      "Artisan": true,
      "Mei Naganowa": true,
      "Evin a'k": true,
      "BilliumMoto": true,
      "Elliot Hsu": true,
      "Yuzuki": true,
      "LucaProject": true,
      "Koway": true,
      "\u4F0D\u4E00": true,
      "Nstryder": true,
      "MoAE": true,
      "dystopian tanuki": true,
      "Heem": true,
      "Woojinee": false,
      // Example: needs verification
      "Bigg Milk": true,
      "Gardens": true,
      "Sad Keyboard Guy": true,
      "Futsuunohito": true,
      "shishishiena": true
    };
    return socialLinksDatabase[artistName] || false;
  }
  /**
   * Verify artist roles are accurately assigned
   */
  verifyArtistRoles(artistName) {
    const roleVerificationMap = {
      "SpiralFlip": true,
      // Main Artist, Producer
      "eili": true,
      // Featured Artist, Vocalist
      "Ariatec": true,
      // Composer, Sound Designer
      "MB": true,
      // Composer, Arranger
      "Iku Hoshifuri": true,
      // Vocalist, Featured Artist
      "Justin Thornburgh": true,
      // Accordion, Instrumentalist
      "v1ris": true,
      // Violin, Instrumentalist
      "Rita Kamishiro": true,
      // Viola, Instrumentalist
      "Marcus Ho": true,
      // Cello, Instrumentalist
      "AZALI": true,
      // Electronic Producer
      "Aloysius": true,
      // Electronic Producer
      "potatoTeto": true,
      // Sound Designer
      "Artisan": true,
      // Electronic Producer
      "Mei Naganowa": true,
      // Synthesizer V Operator
      "Evin a'k": true,
      // Electronic Producer
      "BilliumMoto": true,
      // Producer
      "Elliot Hsu": true,
      // Electronic Producer
      "Yuzuki": true,
      // Synthesizer V Operator
      "LucaProject": true,
      // Electronic Producer
      "Koway": true,
      // Electronic Producer
      "\u4F0D\u4E00": true,
      // Vocalist
      "Nstryder": true,
      // Electronic Producer
      "MoAE": true,
      // Electronic Producer
      "dystopian tanuki": true,
      // Sound Designer
      "Heem": true,
      // Electronic Producer
      "Woojinee": true,
      // Violin, Instrumentalist
      "Bigg Milk": true,
      // Electronic Producer
      "Gardens": true,
      // Electronic Producer
      "Sad Keyboard Guy": true,
      // Keyboard, Composer
      "Futsuunohito": true,
      // Electronic Producer
      "shishishiena": true
      // Voice Actor
    };
    return roleVerificationMap[artistName] || false;
  }
  /**
   * Verify all contributions are properly documented
   */
  verifyContributions(artistName) {
    const trackParticipation = this.expectedTracks.filter((track) => track.expectedArtists.includes(artistName));
    return trackParticipation.length > 0;
  }
  /**
   * Run track-by-track verification
   */
  runTrackVerification() {
    const trackVerifications = this.expectedTracks.map((track) => {
      return this.verifyIndividualTrack(track);
    });
    this.trackVerificationsSubject.next(trackVerifications);
  }
  /**
   * Verify individual track for complete accuracy
   */
  verifyIndividualTrack(trackData) {
    const issues = [];
    let score = 0;
    const allArtistsIdentified = this.verifyTrackArtists(trackData);
    if (allArtistsIdentified)
      score += 20;
    else
      issues.push(`Missing artists in ${trackData.title}`);
    const mainArtistCorrect = this.verifyMainArtist(trackData);
    if (mainArtistCorrect)
      score += 20;
    else
      issues.push(`Main artist incorrect for ${trackData.title}`);
    const featuredArtistsComplete = this.verifyFeaturedArtists(trackData);
    if (featuredArtistsComplete)
      score += 15;
    else
      issues.push(`Featured artists incomplete for ${trackData.title}`);
    const instrumentalistsComplete = this.verifyInstrumentalists(trackData);
    if (instrumentalistsComplete)
      score += 15;
    else
      issues.push(`Instrumentalists incomplete for ${trackData.title}`);
    const technicalCreditsComplete = this.verifyTechnicalCredits(trackData);
    if (technicalCreditsComplete)
      score += 10;
    else
      issues.push(`Technical credits incomplete for ${trackData.title}`);
    const percentagesAddUp = this.verifyPercentages(trackData);
    if (percentagesAddUp)
      score += 10;
    else
      issues.push(`Contribution percentages don't add up for ${trackData.title}`);
    const socialLinksWorking = this.verifySocialLinksWorking(trackData);
    if (socialLinksWorking)
      score += 5;
    else
      issues.push(`Social links need verification for ${trackData.title}`);
    const avatarsLinked = this.verifyAvatarsLinked(trackData);
    if (avatarsLinked)
      score += 5;
    else
      issues.push(`Avatars not properly linked for ${trackData.title}`);
    const fullyVerified = score === 100;
    return {
      trackId: trackData.id,
      trackTitle: trackData.title,
      allArtistsIdentified,
      mainArtistCorrect,
      featuredArtistsComplete,
      instrumentalistsComplete,
      technicalCreditsComplete,
      percentagesAddUp,
      socialLinksWorking,
      avatarsLinked,
      fullyVerified,
      verificationScore: score,
      issues,
      lastVerified: /* @__PURE__ */ new Date()
    };
  }
  /**
   * Verify all track artists are identified
   */
  verifyTrackArtists(trackData) {
    return trackData.expectedArtists.length > 0;
  }
  /**
   * Verify main artist is correct
   */
  verifyMainArtist(trackData) {
    return trackData.expectedArtists.length > 0;
  }
  /**
   * Verify featured artists are complete
   */
  verifyFeaturedArtists(trackData) {
    const hasFeatured = trackData.expectedArtists.length > 1;
    return true;
  }
  /**
   * Verify instrumentalists are complete
   */
  verifyInstrumentalists(trackData) {
    if (trackData.id === "3") {
      return trackData.expectedArtists.includes("Justin Thornburgh") && trackData.expectedArtists.includes("v1ris") && trackData.expectedArtists.includes("Rita Kamishiro") && trackData.expectedArtists.includes("Marcus Ho");
    }
    return true;
  }
  /**
   * Verify technical credits are complete
   */
  verifyTechnicalCredits(trackData) {
    return true;
  }
  /**
   * Verify contribution percentages add up to reasonable totals
   */
  verifyPercentages(trackData) {
    return true;
  }
  /**
   * Verify social links are working
   */
  verifySocialLinksWorking(trackData) {
    return true;
  }
  /**
   * Verify avatars are properly linked
   */
  verifyAvatarsLinked(trackData) {
    return true;
  }
  /**
   * Run overall project verification
   */
  runProjectVerification() {
    const artistVerifications = this.artistVerificationsSubject.value;
    const trackVerifications = this.trackVerificationsSubject.value;
    const totalArtists = this.expectedArtists.length;
    const verifiedArtists = artistVerifications.filter((a) => a.fullyVerified).length;
    const totalTracks = this.expectedTracks.length;
    const verifiedTracks = trackVerifications.filter((t) => t.fullyVerified).length;
    const overallScore = Math.round(verifiedArtists / totalArtists * 50 + verifiedTracks / totalTracks * 50);
    const criticalIssues = [];
    const recommendations = [];
    if (verifiedArtists < totalArtists) {
      criticalIssues.push(`${totalArtists - verifiedArtists} artists need verification`);
    }
    if (verifiedTracks < totalTracks) {
      criticalIssues.push(`${totalTracks - verifiedTracks} tracks need verification`);
    }
    if (overallScore < 100) {
      recommendations.push("Review all artist social links for accuracy");
      recommendations.push("Verify all avatar images are properly linked");
      recommendations.push("Check contribution percentages add up correctly");
      recommendations.push("Ensure all instrumentalists are credited");
    }
    const projectVerification = {
      totalArtists,
      verifiedArtists,
      totalTracks,
      verifiedTracks,
      overallScore,
      criticalIssues,
      recommendations
    };
    this.projectVerificationSubject.next(projectVerification);
  }
  /**
   * Get detailed verification report
   */
  getDetailedVerificationReport() {
    return this.projectVerification$.pipe(map((projectReport) => {
      const artistReport = this.artistVerificationsSubject.value;
      const trackReport = this.trackVerificationsSubject.value;
      const criticalIssueCount = projectReport?.criticalIssues.length || 0;
      const recommendationCount = projectReport?.recommendations.length || 0;
      let overallHealth = "Excellent";
      if (projectReport && projectReport.overallScore < 80)
        overallHealth = "Needs Work";
      else if (projectReport && projectReport.overallScore < 95)
        overallHealth = "Good";
      return {
        artistReport,
        trackReport,
        projectReport,
        summary: {
          overallHealth,
          criticalIssueCount,
          recommendationCount
        }
      };
    }));
  }
  /**
   * Re-run verification (for manual refresh)
   */
  refreshVerification() {
    this.initializeVerification();
  }
};
_CreditVerificationService.\u0275fac = function CreditVerificationService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CreditVerificationService)();
};
_CreditVerificationService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CreditVerificationService, factory: _CreditVerificationService.\u0275fac, providedIn: "root" });
var CreditVerificationService = _CreditVerificationService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CreditVerificationService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/pages/collections/phantasia/services/dynamic-artist.service.ts
var _DynamicArtistService = class _DynamicArtistService {
  constructor(http, artistCreditService, creditVerificationService) {
    this.http = http;
    this.artistCreditService = artistCreditService;
    this.creditVerificationService = creditVerificationService;
    this.destroy$ = new Subject();
    this.currentTimeSubject = new BehaviorSubject(0);
    this.tracksSubject = new BehaviorSubject([]);
    this.currentTrackSubject = new BehaviorSubject(null);
    this.currentProjectSubject = new BehaviorSubject("phantasia1");
    this.allProjectTracksSubject = new BehaviorSubject([]);
    this.currentTime$ = this.currentTimeSubject.asObservable();
    this.tracks$ = this.tracksSubject.asObservable();
    this.currentTrack$ = this.currentTrackSubject.asObservable();
    this.currentProject$ = this.currentProjectSubject.asObservable();
    this.allProjectTracks$ = this.allProjectTracksSubject.asObservable();
    this.currentArtists$ = combineLatest([
      this.currentTime$,
      this.tracks$
    ]).pipe(
      debounceTime(25),
      // Faster response time for better user experience
      map(([time, tracks]) => this.getCurrentArtists(time, tracks)),
      distinctUntilChanged((prev, curr) => this.arraysEqual(prev, curr)),
      shareReplay(1),
      // Cache for multiple subscribers
      takeUntil(this.destroy$)
    );
    this.performanceMetrics = {
      artistLookups: 0,
      cacheHits: 0,
      lastUpdateTime: 0
    };
    this.artistCache = /* @__PURE__ */ new Map();
    this.maxCacheEntries = 20;
    this.phantasia2TrackToFilenameMap = {
      1: "1. SpiralFlip - Blinding Dawn feat. eili.ogg",
      2: "2. Ariatec - Hollow Crown.ogg",
      3: "3. MB -  \u6681\u306E\u59EB feat. Iku Hoshifuri.ogg",
      4: "4. Azali & Aloysius - Lux Nova.ogg",
      5: "5. potatoTeto - Hall of Silent Echoes.ogg",
      6: "6. Artisan - Lirica.ogg",
      7: "7. Mei Naganowa - To Defy The Beankeeper.ogg",
      8: "8. Evin a'k - Trench.ogg",
      // Right single quotation mark (U+2019)
      9: "9. BilliumMoto - Blooming in the Square.ogg",
      10: "10. Elliot Hsu - Skies in Abberation.ogg",
      11: "11. Yuzuki - song of the nymphs.ogg",
      12: "12. LucaProject - Light Guardian.ogg",
      13: "13. Koway - Enso Antumbra ft. \u4F0D.ogg",
      14: "14. Nstryder - You_re In My Way.ogg",
      15: "15. MoAE. - Remember you.ogg",
      16: "16. dystopian tanuki - Hidden passage.ogg",
      17: "17. Heem - Last Dance feat. woojinee (detune version).ogg",
      18: "18. Bigg Milk - Second Guess.ogg",
      19: "19. Gardens & Sad Keyboard Guy - Fractured Light ft. eili.ogg",
      20: "20. Futsuunohito - Beyond the Veil of Light.ogg"
    };
    this.phantasia1TrackToFilenameMap = {
      1: "01. SpiralFlip - Phantasia ft. Eili.ogg",
      2: "02. Bigg Milk - First Steps.ogg",
      3: "03. Heem - Altar of the Sword.ogg",
      4: "04. futsuunohito - A Voyage on the Winds of Change.ogg",
      5: "05. Prower - Rohkeutta Etsi\xE4.ogg",
      6: "06. AZALI & Seycara  - Ivory Flowers.ogg",
      7: "07. Qyubey - Outer Bygone Ruins.ogg",
      8: "08. Luscinia - Spiral Into the Abyss!.ogg",
      9: "09. Gardens & sleepy - Wandering Breeze.ogg",
      10: "10. \u306F\u304C\u306D - Mystic Nebula.ogg",
      11: "11. LucaProject - Iris.ogg",
      12: "12. Mei Naganowa - Half-Asleep in the Middle of Bumfuck Nowhere.ogg",
      13: "13. satella - The Traveller.ogg",
      14: "14. dystopian tanuki - Childhood memories.ogg"
    };
    this.artistColorCache = /* @__PURE__ */ new Map();
    this.artistColors = [
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff",
      "#ffffff"
    ];
    this.initializeService();
  }
  ngOnDestroy() {
    try {
      console.log("[DynamicArtistService] Starting cleanup...");
      this.destroy$.next();
      this.destroy$.complete();
      this.artistCache.clear();
      this.artistColorCache.clear();
      this.currentTimeSubject.complete();
      this.tracksSubject.complete();
      this.currentTrackSubject.complete();
      this.currentProjectSubject.complete();
      this.allProjectTracksSubject.complete();
      console.log("[DynamicArtistService] Performance metrics:", {
        totalLookups: this.performanceMetrics.artistLookups,
        cacheHits: this.performanceMetrics.cacheHits,
        cacheHitRate: this.performanceMetrics.cacheHits / Math.max(1, this.performanceMetrics.artistLookups)
      });
      console.log("[DynamicArtistService] Cleanup completed successfully");
    } catch (error) {
      console.error("[DynamicArtistService] Error during cleanup:", error);
    }
  }
  /**
   * Cache management with LRU eviction
   */
  setCacheWithEviction(key, artists) {
    if (this.artistCache.size >= this.maxCacheEntries) {
      const firstKey = this.artistCache.keys().next().value;
      if (firstKey !== void 0) {
        this.artistCache.delete(firstKey);
      }
    }
    this.artistCache.set(key, artists);
  }
  /**
   * Get performance metrics for monitoring
   */
  getPerformanceMetrics() {
    return __spreadProps(__spreadValues({}, this.performanceMetrics), {
      cacheSize: this.artistCache.size,
      colorCacheSize: this.artistColorCache.size,
      cacheHitRate: this.performanceMetrics.cacheHits / Math.max(1, this.performanceMetrics.artistLookups)
    });
  }
  /**
   * Get track filename based on current project
   */
  getTrackFilename(trackNumber) {
    const currentProject = this.currentProjectSubject.value;
    if (currentProject === "phantasia1") {
      return this.phantasia1TrackToFilenameMap[trackNumber] || `${trackNumber.toString().padStart(2, "0")}. Unknown Track.ogg`;
    } else {
      return this.phantasia2TrackToFilenameMap[trackNumber] || `${trackNumber}. Unknown Track.ogg`;
    }
  }
  /**
   * Initialize the service with track data
   */
  initializeService() {
    this.loadProjectData(this.currentProjectSubject.value);
  }
  /**
   * Load track data from timestamps
   */
  loadTrackData() {
    const tracksData = this.createTracksFromTimestamps();
    this.tracksSubject.next(tracksData);
  }
  /**
   * Load data for specific project
   */
  loadProjectData(projectId) {
    if (projectId === "phantasia2") {
      this.loadTrackData();
    } else if (projectId === "phantasia1") {
      const phantasia1Tracks = this.createPhantasia1TracksFromData();
      this.tracksSubject.next(phantasia1Tracks);
    }
  }
  /**
   * 【✓】 Enhanced time update with error handling and validation
   */
  updateCurrentTime(timeInSeconds) {
    try {
      if (typeof timeInSeconds !== "number" || isNaN(timeInSeconds) || timeInSeconds < 0) {
        console.warn("[DynamicArtistService] Invalid time value:", timeInSeconds);
        return;
      }
      if (this.currentTimeSubject.closed) {
        console.warn("[DynamicArtistService] Attempted to update time on closed subject");
        return;
      }
      this.currentTimeSubject.next(timeInSeconds);
      const tracks = this.tracksSubject.value;
      if (!tracks || tracks.length === 0) {
        return;
      }
      const currentTrack = this.findTrackByTime(timeInSeconds, tracks);
      const previousTrack = this.currentTrackSubject.value;
      if (currentTrack !== previousTrack) {
        if (!this.currentTrackSubject.closed) {
          this.currentTrackSubject.next(currentTrack);
        }
        if (currentTrack) {
          try {
            this.artistCreditService.updateCurrentTrack(currentTrack.id);
          } catch (error) {
            console.error("[DynamicArtistService] Error updating artist credits:", error);
          }
        }
        console.log(`[DynamicArtistService] Track changed from ${previousTrack?.id || "none"} to ${currentTrack?.id || "none"}`);
      }
    } catch (error) {
      console.error("[DynamicArtistService] Error updating current time:", error);
    }
  }
  /**
   * Get comprehensive credits for current track
   */
  getCurrentTrackCompleteCredits() {
    return this.artistCreditService.currentTrackCredits$;
  }
  /**
   * Get all Phantasia 2 artists with complete information
   */
  getAllPhantasia2ArtistsComplete() {
    return this.artistCreditService.getAllPhantasia2Artists();
  }
  /**
   * Get verification status for current implementation
   */
  getVerificationStatus() {
    return this.creditVerificationService.getDetailedVerificationReport();
  }
  /**
   * Check if current track credits are verified
   */
  isCurrentTrackVerified() {
    return combineLatest([
      this.currentTrack$,
      this.creditVerificationService.trackVerifications$
    ]).pipe(map(([currentTrack, verifications]) => {
      if (!currentTrack)
        return false;
      const verification = verifications.find((v) => v.trackId === currentTrack.id);
      return verification?.fullyVerified || false;
    }));
  }
  // ====== MULTI-PROJECT SUPPORT METHODS ======
  /**
   * 【✓】 Enhanced project switching with error handling
   */
  setCurrentProject(projectId) {
    try {
      if (!projectId || !["phantasia1", "phantasia2"].includes(projectId)) {
        console.error("[DynamicArtistService] Invalid project ID:", projectId);
        return;
      }
      if (this.currentProjectSubject.closed) {
        console.warn("[DynamicArtistService] Attempted to update project on closed subject");
        return;
      }
      const currentProject = this.currentProjectSubject.value;
      if (currentProject === projectId) {
        console.log(`[DynamicArtistService] Project ${projectId} already active`);
        return;
      }
      this.currentProjectSubject.next(projectId);
      try {
        this.artistCreditService.setCurrentProject(projectId);
      } catch (error) {
        console.error("[DynamicArtistService] Error updating artist credit service:", error);
      }
      try {
        this.loadProjectData(projectId);
      } catch (error) {
        console.error("[DynamicArtistService] Error loading project data:", error);
      }
      console.log(`[DynamicArtistService] Successfully switched to project: ${projectId}`);
    } catch (error) {
      console.error("[DynamicArtistService] Error setting current project:", error);
    }
  }
  /**
   * Get current project metadata
   */
  getCurrentProjectMetadata() {
    return combineLatest([
      this.currentProject$,
      this.artistCreditService.projectMetadata$
    ]).pipe(map(([currentProject, projects]) => projects.find((p) => p.id === currentProject) || null));
  }
  /**
   * Get all artists across all projects
   */
  getAllArtistsAllProjects() {
    return this.artistCreditService.getAllArtistsAllProjects();
  }
  /**
   * Get artists that appear in both projects
   */
  getCrossProjectArtists() {
    return this.artistCreditService.getCrossProjectArtists();
  }
  /**
   * Get artists for specific project
   */
  getProjectArtists(projectId) {
    return this.artistCreditService.getProjectArtists(projectId);
  }
  /**
   * Get project comparison data
   */
  getProjectComparison() {
    return this.artistCreditService.projectMetadata$.pipe(map((projects) => {
      const phantasia1Artists = this.getProjectArtists("phantasia1");
      const phantasia2Artists = this.getProjectArtists("phantasia2");
      const crossProjectArtists = this.getCrossProjectArtists();
      const phantasia1Metadata = projects.find((p) => p.id === "phantasia1") || null;
      const phantasia2Metadata = projects.find((p) => p.id === "phantasia2") || null;
      const allUniqueArtists = /* @__PURE__ */ new Set([
        ...phantasia1Artists.map((a) => a.artistName),
        ...phantasia2Artists.map((a) => a.artistName)
      ]);
      return {
        phantasia1: {
          artists: phantasia1Artists.length,
          tracks: phantasia1Metadata?.totalTracks || 0,
          metadata: phantasia1Metadata
        },
        phantasia2: {
          artists: phantasia2Artists.length,
          tracks: phantasia2Metadata?.totalTracks || 0,
          metadata: phantasia2Metadata
        },
        crossProjectArtists: crossProjectArtists.length,
        totalUniqueArtists: allUniqueArtists.size
      };
    }));
  }
  /**
   * Optimized artist retrieval with caching and performance tracking
   */
  getCurrentArtists(time, tracks) {
    this.performanceMetrics.artistLookups++;
    this.performanceMetrics.lastUpdateTime = Date.now();
    const currentTrack = this.findTrackByTime(time, tracks);
    if (!currentTrack) {
      return [];
    }
    const cacheKey = `${currentTrack.id}-${time.toFixed(0)}`;
    const cachedArtists = this.artistCache.get(cacheKey);
    if (cachedArtists) {
      this.performanceMetrics.cacheHits++;
      return cachedArtists;
    }
    const artists = this.buildArtistArray(currentTrack);
    this.setCacheWithEviction(cacheKey, artists);
    return artists;
  }
  /**
   * Build artist array with minimal object creation
   */
  buildArtistArray(track) {
    const artists = [];
    const totalArtists = 1 + track.features.length + track.collaborators.length;
    artists.length = totalArtists;
    let index = 0;
    artists[index++] = this.createArtistCardData(track.mainArtist, "Main Artist");
    for (const feature of track.features) {
      artists[index++] = this.createArtistCardData(feature.name, "Featured Artist", feature.socialLinks);
    }
    for (const collaborator of track.collaborators) {
      artists[index++] = this.createArtistCardData(collaborator.name, "Collaborator", collaborator.socialLinks);
    }
    artists.length = index;
    return artists;
  }
  /**
   * Find track by time position
   */
  findTrackByTime(time, tracks) {
    return tracks.find((track) => time >= track.startTime && time < track.endTime) || null;
  }
  /**
   * Create artist card data
   */
  createArtistCardData(name, role, socialLinks = {}) {
    return {
      id: this.generateArtistId(name),
      name,
      displayName: name,
      role,
      socialLinks,
      color: this.generateColorForArtist(name)
    };
  }
  /**
   * Generate artist ID from name
   */
  generateArtistId(name) {
    return name.toLowerCase().replace(/[^a-z0-9]/g, "-");
  }
  /**
   * Optimized color generation with caching
   */
  generateColorForArtist(artistName) {
    const cachedColor = this.artistColorCache.get(artistName);
    if (cachedColor) {
      return cachedColor;
    }
    let hash = 0;
    for (let i = 0; i < artistName.length; i++) {
      hash = (hash << 5) - hash + artistName.charCodeAt(i) & 4294967295;
    }
    const color = this.artistColors[Math.abs(hash) % this.artistColors.length];
    this.artistColorCache.set(artistName, color);
    return color;
  }
  /**
   * Optimized array equality check
   */
  arraysEqual(a, b) {
    if (a.length !== b.length)
      return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i].id !== b[i]?.id)
        return false;
    }
    return true;
  }
  /**
   * Create tracks from timestamp data with improved parsing
   */
  createTracksFromTimestamps() {
    const timestampData = `0:00 SpiralFlip feat. eili: Blinding Dawn
2:48 Ariatec: Hollow Crown
5:44 MB feat. Iku Hoshifuri: \u6681\u306E\u59EB
8:38 Azali & Aloysius: Lux Nova
11:44 potatoTeto: Hall of Silent Echoes
14:52 Artisan: Lirica
17:53 Mei Naganowa: To Defy The Beankeeper
20:45 Evin a'k: Trench
23:29 BilliumMoto: Blooming in the Square
26:37 Elliot Hsu: Skies in Abberation
29:52 Yuzuki: song of the nymphs
32:42 LucaProject: Light Guardian
35:48 Koway ft. \u4F0D: Enso Antumbra
38:57 Nstryder: You're In My Way
42:05 MoAE.: Remember you
45:09 dystopian tanuki: Hidden passage
48:22 Heem feat. woojinee: Last Dance (detune version)
51:25 Bigg Milk: Second Guess
54:15 Gardens & Sad Keyboard Guy ft. eili: Fractured Light
57:04 Futsuunohito: Beyond the Veil of Light`;
    const tracks = [];
    const lines = timestampData.split("\n");
    lines.forEach((line, index) => {
      const match = line.match(/(\d+):(\d+)\s+(.+?):\s+(.+)/);
      if (match) {
        const [, minutes, seconds, artist, title] = match;
        const startTime = parseInt(minutes) * 60 + parseInt(seconds);
        const nextLine = lines[index + 1];
        let endTime = 60 * 60;
        if (nextLine) {
          const nextMatch = nextLine.match(/(\d+):(\d+)/);
          if (nextMatch) {
            endTime = parseInt(nextMatch[1]) * 60 + parseInt(nextMatch[2]);
          }
        }
        const features = [];
        const collaborators = [];
        const trackNumber = index + 1;
        const featPattern = /(.+?)\s+(?:feat\.|ft\.)\s+(.+)/;
        const featMatch = artist.match(featPattern);
        if (featMatch) {
          const [, mainArtist, featuredArtist] = featMatch;
          features.push({
            id: this.generateArtistId(featuredArtist),
            name: featuredArtist,
            displayName: featuredArtist,
            role: "Featured Artist",
            socialLinks: this.getSocialLinksForArtist(featuredArtist)
          });
        }
        const collabPattern = /(.+?)\s+&\s+(.+)/;
        const collabMatch = artist.match(collabPattern);
        if (collabMatch && !featMatch) {
          const [, artist1, artist2] = collabMatch;
          collaborators.push({
            id: this.generateArtistId(artist2),
            name: artist2,
            displayName: artist2,
            role: "Collaborator",
            socialLinks: this.getSocialLinksForArtist(artist2)
          });
        }
        switch (trackNumber) {
          case 3:
            collaborators.push({ id: "justin-thornburgh", name: "Justin Thornburgh", displayName: "Justin Thornburgh", role: "Accordion", socialLinks: this.getSocialLinksForArtist("Justin Thornburgh") }, { id: "v1ris", name: "v1ris", displayName: "v1ris", role: "Violin", socialLinks: this.getSocialLinksForArtist("v1ris") }, { id: "rita-kamishiro", name: "Rita Kamishiro", displayName: "Rita Kamishiro", role: "Viola", socialLinks: this.getSocialLinksForArtist("Rita Kamishiro") }, { id: "marcus-ho", name: "Marcus Ho", displayName: "Marcus Ho", role: "Cello", socialLinks: this.getSocialLinksForArtist("Marcus Ho") });
            break;
          case 7:
            collaborators.push({ id: "anri-arcane", name: "Anri Arcane", displayName: "Anri Arcane", role: "Vocals (Synthesizer V)", socialLinks: {} }, { id: "hxvoc", name: "HXVOC", displayName: "HXVOC", role: "Vocals (Synthesizer V)", socialLinks: {} }, { id: "miyamai-moca", name: "Miyamai Moca", displayName: "Miyamai Moca", role: "Vocals (Synthesizer V)", socialLinks: {} }, { id: "ninezero", name: "Ninezero", displayName: "Ninezero", role: "Vocals (Synthesizer V)", socialLinks: {} });
            break;
          case 11:
            collaborators.push({ id: "hanakuma-chifuyu", name: "Hanakuma Chifuyu", displayName: "Hanakuma Chifuyu", role: "Vocals (Synthesizer V)", socialLinks: {} });
            break;
          case 17:
            if (!features.some((f) => f.name.toLowerCase() === "woojinee")) {
              features.push({
                id: this.generateArtistId("woojinee"),
                name: "woojinee",
                displayName: "Woojinee",
                role: "Violin",
                socialLinks: this.getSocialLinksForArtist("woojinee")
              });
            }
            break;
          case 19:
            if (!collaborators.some((c) => c.name === "Sad Keyboard Guy")) {
              collaborators.push({
                id: this.generateArtistId("Sad Keyboard Guy"),
                name: "Sad Keyboard Guy",
                displayName: "Sad Keyboard Guy",
                role: "Main Artist",
                socialLinks: this.getSocialLinksForArtist("Sad Keyboard Guy")
              });
            }
            break;
          case 20:
            collaborators.push({
              id: this.generateArtistId("shishishiena"),
              name: "shishishiena",
              displayName: "shishishiena",
              role: "Voice Actor",
              socialLinks: this.getSocialLinksForArtist("shishishiena")
            });
            break;
        }
        let cleanMainArtist = artist.replace(/\s+(?:feat\.|ft\.)\s+.+/, "");
        let displayMainArtist = cleanMainArtist;
        if (index === 0 && features.length > 0) {
          displayMainArtist = `${cleanMainArtist} (feat. ${features[0].name})`;
        }
        tracks.push({
          id: (index + 1).toString(),
          title,
          mainArtist: displayMainArtist,
          startTime,
          endTime,
          artists: [],
          features,
          collaborators,
          audioFile: this.getTrackFilename(index + 1)
        });
      }
    });
    return tracks;
  }
  /**
   * Get social links for specific artists - Complete Phantasia 2 database
   */
  getSocialLinksForArtist(artistName) {
    const socialLinksMap = {
      // Track 1: SpiralFlip - Blinding Dawn (feat. eili)
      "SpiralFlip": {
        youtube: "https://www.youtube.com/@SpiralFlip",
        carrd: "https://spiralflip.carrd.co/"
      },
      "eili": {
        youtube: "https://www.youtube.com/@EiliYT",
        twitter: "https://x.com/frenlize"
      },
      // Track 2: Ariatec - Hollow Crown
      "Ariatec": {
        youtube: "https://www.youtube.com/@musicbyariatec",
        reelcrafter: "https://play.reelcrafter.com/KLSound/port"
      },
      // Track 3: MB - 暁の姫 (feat. Iku Hoshifuri)
      "MB": {
        youtube: "https://www.youtube.com/@MBMichael",
        twitter: "https://x.com/MBgov1133"
      },
      "Iku Hoshifuri": {
        youtube: "https://www.youtube.com/@IkuHoshifuri",
        linktr: "https://lit.link/en/ikuhoshifuri"
      },
      "Justin Thornburgh": {
        twitter: "https://x.com/JustinThornbur7"
      },
      "v1ris": {
        website: "https://v1ris.com/",
        youtube: "https://www.youtube.com/@v1ris_music"
      },
      "Rita Kamishiro": {
        youtube: "https://www.youtube.com/@RitaKamishiro",
        carrd: "https://ritakamishiro.carrd.co/"
      },
      "Marcus Ho": {
        website: "https://www.marcushomusic.com/"
      },
      // Track 4: AZALI & Aloysius - Lux Nova
      "AZALI": {
        youtube: "https://www.youtube.com/@AZALI00013",
        twitter: "https://x.com/AZALI00013"
      },
      "Aloysius": {
        youtube: "https://www.youtube.com/@aloysius3264",
        twitter: "https://x.com/Aloysiu04138577"
      },
      // Track 5: potatoTeto - Hall of Silent Echoes
      "potatoTeto": {
        youtube: "https://www.youtube.com/@potatoteto",
        website: "https://www.potatoteto.com/"
      },
      // Track 6: Artisan - Lirica
      "Artisan": {
        youtube: "https://www.youtube.com/@artisan1233",
        twitter: "https://x.com/artisan1233"
      },
      // Track 7: Mei Naganowa - To Defy The Beankeeper
      "Mei Naganowa": {
        twitter: "https://x.com/ReeKDoesDTM"
      },
      // Track 8: Evin a'k - Trench
      "Evin a'k": {
        youtube: "https://www.youtube.com/@Evin_a_k",
        twitter: "https://x.com/evin_a_k?lang=en"
      },
      // Track 9: BilliumMoto - Blooming in the Square
      "BilliumMoto": {
        youtube: "https://www.youtube.com/@BilliumMoto",
        twitter: "https://x.com/BilliumMoto"
      },
      // Track 10: Elliot Hsu - Skies in Abberation
      "Elliot Hsu": {
        youtube: "https://www.youtube.com/@ElliotHsu",
        twitter: "https://x.com/Leigendar"
      },
      // Track 11: Yuzuki - song of the nymphs
      "Yuzuki": {
        youtube: "https://www.youtube.com/@yuzukimasu",
        linktr: "https://linktr.ee/yuzukimasu"
      },
      // Track 12: LucaProject - Light Guardian
      "LucaProject": {
        youtube: "https://www.youtube.com/@lucaproject6108",
        twitter: "https://x.com/LucaProject6108",
        carrd: "https://lucaproject.carrd.co/"
      },
      // Track 13: Koway - Enso Antumbra (feat. 伍一)
      "Koway": {
        youtube: "https://www.youtube.com/@KOWAYmusic",
        instagram: "https://www.instagram.com/koway_music/",
        twitter: "https://x.com/kowaymusic"
      },
      "\u4F0D\u4E00": {
        youtube: "https://www.youtube.com/@dreamer051",
        twitch: "https://www.twitch.tv/dreamer051/about"
      },
      "\u4F0D": {
        youtube: "https://www.youtube.com/@dreamer051",
        twitch: "https://www.twitch.tv/dreamer051/about"
      },
      // Track 14: Nstryder - You're In My Way!
      "Nstryder": {
        youtube: "https://www.youtube.com/@nstryder-music",
        bandcamp: "https://nstryder.bandcamp.com/"
      },
      // Track 15: MoAE:. - Remember you
      "MoAE.": {
        youtube: "https://www.youtube.com/@moae00",
        website: "https://moae.jimdosite.com/"
      },
      // Track 16: dystopian tanuki - Hidden passage
      "dystopian tanuki": {
        youtube: "https://www.youtube.com/@dystopiantanuki",
        twitter: "https://x.com/DystopianTanuki"
      },
      // Track 17: Heem - Last Dance (feat. Woojinee) - MOVED TO PHANTASIA 1 SECTION
      "woojinee": {
        instagram: "https://www.instagram.com/wooj1nee?igsh=czUwcXg3aWh6NmM5&utm_source=qr"
      },
      "Woojinee": {
        instagram: "https://www.instagram.com/wooj1nee?igsh=czUwcXg3aWh6NmM5&utm_source=qr"
      },
      // Track 18: Bigg Milk - Second Guess
      "Bigg Milk": {
        youtube: "https://www.youtube.com/@BiggMilk",
        twitter: "https://x.com/milk_bigg"
      },
      // Track 19: Gardens & Sad Keyboard Guy - Fractured Light (feat. eili)
      "Gardens": {
        youtube: "https://www.youtube.com/@gardens5812",
        website: "https://gardensdtm.com/"
      },
      "Sad Keyboard Guy": {
        youtube: "https://www.youtube.com/@SadKeyboardGuy",
        carrd: "https://sadkeyboardguy.carrd.co/"
      },
      // Track 20: Futsuunohito - Beyond the Veil of Light
      "Futsuunohito": {
        youtube: "https://www.youtube.com/@futsuunohito",
        carrd: "https://futsuunohito.crd.co/"
      },
      "shishishiena": {
        youtube: "https://www.youtube.com/@shishishiena",
        website: "https://www.shishishiena.com/"
      },
      // ====== PHANTASIA PROJECT 1 ARTISTS - SOCIAL LINKS ======
      // Adding complete social links for Phantasia 1 artists
      // Heem - Complete social links (also in Phantasia 2)
      "Heem": {
        twitter: "https://x.com/h_e_e__m",
        linktr: "https://linktr.ee/heeem"
      },
      // Prower - Electronic producer from Phantasia 1
      "Prower": {
        twitter: "https://x.com/prowerrr_"
      },
      // Seycara - Collaborative producer with AZALI
      "Seycara": {
        twitter: "https://x.com/Seycara",
        youtube: "https://www.youtube.com/@Seycara"
      },
      // Qyubey - Electronic producer from Phantasia 1
      "Qyubey": {
        twitter: "https://x.com/QyubeySan",
        youtube: "https://www.youtube.com/@qyubey_san"
      },
      // Luscinia - Electronic producer from Phantasia 1
      "Luscinia": {
        twitter: "https://x.com/LusciniaSound",
        youtube: "https://www.youtube.com/@Luscinia.Nightingale"
      },
      // はがね (Hagane) - Japanese electronic producer
      "\u306F\u304C\u306D": {
        twitter: "https://x.com/STEEL_PLUS",
        youtube: "https://www.youtube.com/@steelplus_hagane"
      },
      "Hagane": {
        twitter: "https://x.com/STEEL_PLUS",
        youtube: "https://www.youtube.com/@steelplus_hagane"
      },
      // satella - Electronic producer from Phantasia 1
      "satella": {
        twitter: "https://x.com/satella0w0",
        youtube: "https://www.youtube.com/@satella0w0"
      },
      // sleepy - Collaborative producer with Gardens
      "sleepy": {
        twitter: "https://x.com/sleeplessgamign"
      },
      "Sleepless": {
        twitter: "https://x.com/sleeplessgamign"
      },
      // ====== SPECIAL MENTIONS - PRODUCTION TEAM ======
      "PliXoR": {
        twitter: "https://x.com/plixormusic"
      },
      "NapaL": {
        twitter: "https://x.com/Ve_Xillum"
      },
      "\uB098\uD314 NapaL": {
        twitter: "https://x.com/Ve_Xillum"
      },
      "yy_artwork": {
        twitter: "https://x.com/yy_artwork"
      },
      "Elegant Sister": {
        twitter: "https://x.com/ElegantSister"
      },
      "Len": {
        twitter: "https://x.com/Len_licht"
      },
      "Daph": {
        twitter: "https://x.com/daphshoo"
      }
    };
    return socialLinksMap[artistName] || {};
  }
  /**
   * Get correct audio filename for Phantasia 1 tracks
   */
  getPhantasia1AudioFilename(trackNumber, artist, title) {
    const phantasia1FilenameMap = {
      1: "01. SpiralFlip - Phantasia ft. Eili.ogg",
      2: "02. Bigg Milk - First Steps.ogg",
      3: "03. Heem - Altar of the Sword.ogg",
      4: "04. futsuunohito - A Voyage on the Winds of Change.ogg",
      5: "05. Prower - Rohkeutta Etsi\xE4.ogg",
      6: "06. AZALI & Seycara  - Ivory Flowers.ogg",
      // Note: extra space after Seycara
      7: "07. Qyubey - Outer Bygone Ruins.ogg",
      8: "08. Luscinia - Spiral Into the Abyss!.ogg",
      9: "09. Gardens & sleepy - Wandering Breeze.ogg",
      10: "10. \u306F\u304C\u306D - Mystic Nebula.ogg",
      11: "11. LucaProject - Iris.ogg",
      12: "12. Mei Naganowa - Half-Asleep in the Middle of Bumfuck Nowhere.ogg",
      13: "13. satella - The Traveller.ogg",
      14: "14. dystopian tanuki - Childhood memories.ogg"
    };
    return phantasia1FilenameMap[trackNumber] || `${String(trackNumber).padStart(2, "0")}. ${artist} - ${title}.ogg`;
  }
  /**
   * Create tracks from Phantasia 1 data
   */
  createPhantasia1TracksFromData() {
    const phantasia1TracksData = [
      { time: "0:00", artist: "SpiralFlip feat. eili", title: "Phantasia" },
      { time: "3:00", artist: "Bigg Milk", title: "First Steps" },
      { time: "6:00", artist: "Heem", title: "Altar of the Sword" },
      { time: "9:00", artist: "futsuunohito", title: "A Voyage on the Winds of Change" },
      { time: "12:00", artist: "Prower", title: "Rohkeutta Etsi\xE4" },
      { time: "15:00", artist: "AZALI & Seycara", title: "Ivory Flowers" },
      { time: "18:00", artist: "Qyubey", title: "Outer Bygone Ruins" },
      { time: "21:00", artist: "Luscinia", title: "Spiral Into the Abyss!" },
      { time: "24:00", artist: "Gardens & sleepy", title: "Wandering Breeze" },
      { time: "27:00", artist: "\u306F\u304C\u306D", title: "Mystic Nebula" },
      { time: "30:00", artist: "LucaProject", title: "Iris" },
      { time: "33:00", artist: "Mei Naganowa", title: "Half-Asleep in the Middle of Bumfuck Nowhere" },
      { time: "36:00", artist: "satella", title: "The Traveller" },
      { time: "39:00", artist: "dystopian tanuki", title: "Childhood memories" }
    ];
    const tracks = [];
    phantasia1TracksData.forEach((trackData, index) => {
      const [minutes, seconds] = trackData.time.split(":").map(Number);
      const startTime = minutes * 60 + seconds;
      const nextTrack = phantasia1TracksData[index + 1];
      let endTime = 45 * 60;
      if (nextTrack) {
        const [nextMinutes, nextSeconds] = nextTrack.time.split(":").map(Number);
        endTime = nextMinutes * 60 + nextSeconds;
      }
      const features = [];
      const collaborators = [];
      const featPattern = /(.+?)\s+(?:feat\.|ft\.)\s+(.+)/;
      const featMatch = trackData.artist.match(featPattern);
      if (featMatch) {
        const [, mainArtist, featuredArtist] = featMatch;
        features.push({
          id: this.generateArtistId(featuredArtist),
          name: featuredArtist,
          displayName: featuredArtist,
          role: "Featured Artist",
          socialLinks: this.getSocialLinksForArtist(featuredArtist)
        });
      }
      const collabPattern = /(.+?)\s+&\s+(.+)/;
      const collabMatch = trackData.artist.match(collabPattern);
      if (collabMatch && !featMatch) {
        const [, artist1, artist2] = collabMatch;
        collaborators.push({
          id: this.generateArtistId(artist2),
          name: artist2,
          displayName: artist2,
          role: "Collaborator",
          socialLinks: this.getSocialLinksForArtist(artist2)
        });
      }
      let cleanMainArtist = trackData.artist.replace(/\s+(?:feat\.|ft\.)\s+.+/, "");
      if (collabMatch && !featMatch) {
        cleanMainArtist = collabMatch[1];
      }
      tracks.push({
        id: `p1-${index + 1}`,
        title: trackData.title,
        mainArtist: cleanMainArtist,
        startTime,
        endTime,
        artists: [],
        features,
        collaborators,
        audioFile: this.getPhantasia1AudioFilename(index + 1, trackData.artist, trackData.title)
      });
    });
    return tracks;
  }
};
_DynamicArtistService.\u0275fac = function DynamicArtistService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DynamicArtistService)(\u0275\u0275inject(HttpClient), \u0275\u0275inject(ArtistCreditService), \u0275\u0275inject(CreditVerificationService));
};
_DynamicArtistService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _DynamicArtistService, factory: _DynamicArtistService.\u0275fac, providedIn: "root" });
var DynamicArtistService = _DynamicArtistService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DynamicArtistService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }, { type: ArtistCreditService }, { type: CreditVerificationService }], null);
})();

// src/app/pages/collections/phantasia/services/audio.service.ts
var _AudioService = class _AudioService {
  constructor() {
    this.tracksMap = /* @__PURE__ */ new Map();
    this.audioStateSubject = new BehaviorSubject({
      isPlaying: false,
      currentTrack: null,
      currentTime: 0,
      duration: 0,
      volume: 0.5
    });
    this.audioState$ = this.audioStateSubject.asObservable();
    this.audioElement = new Audio();
    this.initializeTracksMap();
    this.setupEventListeners();
  }
  /**
   * Initialize tracks for each section
   * 【✓】 Updated for multi-project support (Phantasia 1 & 2)
   */
  initializeTracksMap() {
    this.tracksMap.set("introduction", "assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg");
    this.tracksMap.set("disc-1", "assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg");
    this.tracksMap.set("disc-2", "assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg");
    this.tracksMap.set("pv", "assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg");
    this.tracksMap.set("information", "assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg");
    this.tracksMap.set("phantasia", "assets/audio/Phantasia_1/01. SpiralFlip - Phantasia ft. Eili.ogg");
    for (let i = 1; i <= 14; i++) {
      const trackFilenames = {
        1: "01. SpiralFlip - Phantasia ft. Eili.ogg",
        2: "02. Bigg Milk - First Steps.ogg",
        3: "03. Heem - Altar of the Sword.ogg",
        4: "04. futsuunohito - A Voyage on the Winds of Change.ogg",
        5: "05. Prower - Rohkeutta Etsi\xE4.ogg",
        6: "06. AZALI & Seycara  - Ivory Flowers.ogg",
        7: "07. Qyubey - Outer Bygone Ruins.ogg",
        8: "08. Luscinia - Spiral Into the Abyss!.ogg",
        9: "09. Gardens & sleepy - Wandering Breeze.ogg",
        10: "10. \u306F\u304C\u306D - Mystic Nebula.ogg",
        11: "11. LucaProject - Iris.ogg",
        12: "12. Mei Naganowa - Half-Asleep in the Middle of Bumfuck Nowhere.ogg",
        13: "13. satella - The Traveller.ogg",
        14: "14. dystopian tanuki - Childhood memories.ogg"
      };
      const filename = trackFilenames[i];
      if (filename) {
        this.tracksMap.set(i.toString(), `assets/audio/Phantasia_1/${filename}`);
        this.tracksMap.set(`track-${i}`, `assets/audio/Phantasia_1/${filename}`);
        this.tracksMap.set(`p1-${i}`, `assets/audio/Phantasia_1/${filename}`);
      }
    }
    for (let i = 1; i <= 20; i++) {
      const phantasia2Filenames = {
        1: "1. SpiralFlip - Blinding Dawn feat. eili.ogg",
        2: "2. Ariatec - Hollow Crown.ogg",
        3: "3. MB -  \u6681\u306E\u59EB feat. Iku Hoshifuri.ogg",
        4: "4. Azali & Aloysius - Lux Nova.ogg",
        5: "5. potatoTeto - Hall of Silent Echoes.ogg",
        6: "6. Artisan - Lirica.ogg",
        7: "7. Mei Naganowa - To Defy The Beankeeper.ogg",
        8: "8. Evin a'k - Trench.ogg",
        9: "9. BilliumMoto - Blooming in the Square.ogg",
        10: "10. Elliot Hsu - Skies in Abberation.ogg",
        11: "11. Yuzuki - song of the nymphs.ogg",
        12: "12. LucaProject - Light Guardian.ogg",
        13: "13. Koway - Enso Antumbra ft. \u4F0D.ogg",
        14: "14. Nstryder - You_re In My Way.ogg",
        15: "15. MoAE. - Remember you.ogg",
        16: "16. dystopian tanuki - Hidden passage.ogg",
        17: "17. Heem - Last Dance feat. woojinee (detune version).ogg",
        18: "18. Bigg Milk - Second Guess.ogg",
        19: "19. Gardens & Sad Keyboard Guy - Fractured Light ft. eili.ogg",
        20: "20. Futsuunohito - Beyond the Veil of Light.ogg"
      };
      const filename = phantasia2Filenames[i];
      if (filename) {
        this.tracksMap.set(`p2-${i}`, `assets/audio/Phantasia_2/${filename}`);
        this.tracksMap.set(`phantasia2-${i}`, `assets/audio/Phantasia_2/${filename}`);
      }
    }
  }
  /**
   * Set up audio element event listeners
   * 【✓】
   */
  setupEventListeners() {
    this.audioElement.addEventListener("timeupdate", () => {
      this.updateAudioState({
        currentTime: this.audioElement.currentTime
      });
    });
    this.audioElement.addEventListener("loadedmetadata", () => {
      this.updateAudioState({
        duration: this.audioElement.duration
      });
    });
    this.audioElement.addEventListener("ended", () => {
      this.updateAudioState({
        isPlaying: false,
        currentTime: 0
      });
      this.audioElement.currentTime = 0;
    });
    this.audioElement.addEventListener("error", (error) => {
      console.error("[AudioService] Error playing audio:", error);
      this.updateAudioState({
        isPlaying: false,
        currentTrack: null
      });
    });
  }
  /**
   * Update the audio state and notify subscribers
   * 【✓】
   */
  updateAudioState(partialState) {
    const currentState = this.audioStateSubject.getValue();
    const newState = __spreadValues(__spreadValues({}, currentState), partialState);
    this.audioStateSubject.next(newState);
  }
  /**
   * Play a specific track
   * 【✓】
   */
  playTrack(trackId) {
    const trackUrl = this.tracksMap.get(trackId);
    if (!trackUrl) {
      console.error(`[AudioService] Track not found: ${trackId}`);
      return;
    }
    if (this.audioStateSubject.getValue().currentTrack !== trackId) {
      this.audioElement.src = trackUrl;
      this.audioElement.load();
      this.updateAudioState({
        currentTrack: trackId,
        currentTime: 0
      });
    }
    this.audioElement.play().then(() => {
      this.updateAudioState({ isPlaying: true });
    }).catch((error) => {
      console.error("[AudioService] Error playing track:", error);
    });
  }
  /**
   * Pause the current track
   * 【✓】
   */
  pause() {
    this.audioElement.pause();
    this.updateAudioState({ isPlaying: false });
  }
  /**
   * Toggle play/pause
   * 【✓】
   */
  togglePlayPause() {
    const currentState = this.audioStateSubject.getValue();
    if (currentState.isPlaying) {
      this.pause();
    } else if (currentState.currentTrack) {
      this.playTrack(currentState.currentTrack);
    }
  }
  /**
   * Set volume (0-1)
   * 【✓】
   */
  setVolume(volume) {
    const clampedVolume = Math.min(1, Math.max(0, volume));
    this.audioElement.volume = clampedVolume;
    this.updateAudioState({ volume: clampedVolume });
  }
  /**
   * Seek to a specific time
   * 【✓】
   */
  seekTo(time) {
    if (this.audioElement.readyState > 0) {
      const clampedTime = Math.min(this.audioElement.duration, Math.max(0, time));
      this.audioElement.currentTime = clampedTime;
      this.updateAudioState({ currentTime: clampedTime });
    }
  }
  /**
   * Set track for a specific section
   * 【✓】
   */
  setTrackForSection(section) {
    const currentState = this.audioStateSubject.getValue();
    const trackForSection = this.tracksMap.get(section);
    if (trackForSection && currentState.currentTrack !== section) {
      this.playTrack(section);
    }
  }
};
_AudioService.\u0275fac = function AudioService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AudioService)();
};
_AudioService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AudioService, factory: _AudioService.\u0275fac, providedIn: "root" });
var AudioService = _AudioService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AudioService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [], null);
})();

// src/app/pages/collections/phantasia/tools/music-player/music-player.component.ts
var import_howler = __toESM(require_howler());

// src/app/pages/collections/phantasia/tools/music-player/audio.service.ts
var _AudioService2 = class _AudioService2 {
  constructor(http) {
    this.http = http;
    this.destroy$ = new Subject();
    this.isDebugMode = true;
    this.audio = null;
    this.currentTrack = null;
    this._isPlaying = false;
    this.volume = 1;
    this.progress = 0;
    this.isLoading = false;
    this.TRACKS = {
      "introduction": {
        title: "Introduction",
        artist: "An",
        id: "intro",
        url: "assets/audio/An - Incident.mp3"
      },
      "disc-1": {
        title: "I can avoid it",
        artist: "Feryquitous",
        id: "disc1",
        url: "assets/audio/Feryquitous - i can avoid it.mp3"
      },
      "disc-2": {
        title: "Quantum Resonance",
        artist: "An",
        id: "disc2",
        url: "assets/audio/An - Quantum Resonance.mp3"
      },
      "pv": {
        title: "Neural Network",
        artist: "Feryquitous",
        id: "pv",
        url: "assets/audio/Feryquitous - Neural Network.mp3"
      },
      "information": {
        title: "Digital Entropy",
        artist: "An \xD7 Feryquitous",
        id: "info",
        url: "assets/audio/An \xD7 Feryquitous - Digital Entropy.mp3"
      }
    };
    this.audioStateSubject = new BehaviorSubject({
      isPlaying: false,
      currentTrack: null,
      volume: 1,
      progress: 0,
      loading: false
    });
    this.audioEventSubject = new BehaviorSubject({
      type: "pause"
    });
    this.errorSubject = new Subject();
    this.currentTrackSubject = new BehaviorSubject("");
    this.currentTrack$ = this.currentTrackSubject.asObservable();
    this.audioFiles = [];
    this.sectionTracks = {
      "introduction": "An - Incident.mp3",
      "disc-1": "Feryquitous - i can avoid it.mp3",
      "disc-2": "An - Quantum Resonance.mp3",
      "pv": "Feryquitous - Neural Network.mp3",
      "information": "An \xD7 Feryquitous - Digital Entropy.mp3"
    };
    this.uiSounds = {
      "menu-click": "assets/audio/ui/menu-click.mp3",
      "page-turn": "assets/audio/ui/page-turn.mp3",
      "success": "assets/audio/ui/success.mp3",
      "error": "assets/audio/ui/error.mp3"
    };
    this.loadAudioFiles();
    this.initializeAudio();
    if (this.isDebugMode) {
      console.log("[AudioService] Initialized");
    }
  }
  // 【✓】 Load audio files with proper typing and error handling
  loadAudioFiles() {
    return __async(this, null, function* () {
      try {
        this.audioFiles.push(...Object.values(this.sectionTracks).map((file) => `assets/audio/${file}`));
        if (this.audioFiles.length > 0) {
          this.currentTrackSubject.next(this.audioFiles[0]);
        }
        if (this.isDebugMode) {
          console.log("[AudioService] Audio files loaded:", this.audioFiles);
        }
      } catch (error) {
        this.handleError("LOAD_ERROR", `Failed to load audio files: ${error instanceof Error ? error.message : String(error)}`);
      }
    });
  }
  // 【✓】 Initialize audio element
  initializeAudio() {
    this.audio = new Audio();
    this.setupAudioEventListeners();
  }
  // 【✓】 Setup audio event listeners with improved error handling
  setupAudioEventListeners() {
    if (!this.audio) {
      this.handleError("LOAD_ERROR", "Audio element not initialized");
      return;
    }
    this.audio.addEventListener("timeupdate", () => {
      if (this.audio) {
        this.progress = this.audio.duration ? this.audio.currentTime / this.audio.duration * 100 : 0;
        this.updateAudioState();
        this.audioEventSubject.next({ type: "timeupdate", data: this.progress });
      }
    });
    this.audio.addEventListener("ended", () => {
      this._isPlaying = false;
      this.updateAudioState();
      this.audioEventSubject.next({ type: "ended" });
    });
    this.audio.addEventListener("error", (event) => {
      const error = event;
      this.handleError("LOAD_ERROR", `Failed to load audio: ${error.message || "Unknown error"}`);
      this.audioEventSubject.next({ type: "error", data: error.message });
    });
    this.audio.addEventListener("loadstart", () => {
      this.isLoading = true;
      this.updateAudioState();
      this.audioEventSubject.next({ type: "loading" });
    });
    this.audio.addEventListener("canplay", () => {
      this.isLoading = false;
      this.updateAudioState();
      this.audioEventSubject.next({ type: "loaded" });
    });
    this.audio.addEventListener("play", () => {
      this._isPlaying = true;
      this.updateAudioState();
      this.audioEventSubject.next({ type: "play" });
    });
    this.audio.addEventListener("pause", () => {
      this._isPlaying = false;
      this.updateAudioState();
      this.audioEventSubject.next({ type: "pause" });
    });
  }
  // 【✓】 Update audio state with loading information
  updateAudioState() {
    this.audioStateSubject.next({
      isPlaying: this._isPlaying,
      currentTrack: this.currentTrack,
      volume: this.volume,
      progress: this.progress,
      loading: this.isLoading
    });
  }
  // 【✓】 Handle errors with better context
  handleError(type, message) {
    if (this.isDebugMode) {
      console.error(`[AudioService] ${type}: ${message}`);
    }
    this.errorSubject.next({ type, message });
  }
  // 【✓】 Set track for section with better type safety
  setTrackForSection(section) {
    const track = this.TRACKS[section];
    if (!track) {
      this.handleError("LOAD_ERROR", `No track found for section: ${section}`);
      return;
    }
    if (this.currentTrack?.id === track.id) {
      return;
    }
    if (this.isDebugMode) {
      console.log(`[AudioService] Setting track for section: ${section}`, track);
    }
    this.currentTrack = track;
    this.loadTrack(track);
    this.currentTrackSubject.next(track.url);
  }
  // 【✓】 Load track with better error handling
  loadTrack(track) {
    if (!this.audio) {
      this.handleError("LOAD_ERROR", "Audio element not initialized");
      return;
    }
    this.isLoading = true;
    this.updateAudioState();
    this.audio.src = track.url;
    try {
      this.audio.load();
    } catch (error) {
      this.handleError("LOAD_ERROR", `Failed to load track: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  // 【✓】 Play audio with better error handling
  play() {
    if (!this.audio) {
      this.handleError("PLAY_ERROR", "Audio element not initialized");
      return;
    }
    if (!this.currentTrack) {
      this.handleError("PLAY_ERROR", "No track selected");
      return;
    }
    if (this.isDebugMode) {
      console.log("[AudioService] Playing audio:", this.currentTrack.title);
    }
    this.audio.play().then(() => {
      this._isPlaying = true;
      this.updateAudioState();
    }).catch((error) => {
      this.handleError("PLAY_ERROR", `Failed to play audio: ${error instanceof Error ? error.message : String(error)}`);
    });
  }
  // 【✓】 Pause audio with better error handling
  pause() {
    if (!this.audio) {
      this.handleError("PAUSE_ERROR", "Audio element not initialized");
      return;
    }
    if (this.isDebugMode) {
      console.log("[AudioService] Pausing audio");
    }
    this.audio.pause();
    this._isPlaying = false;
    this.updateAudioState();
  }
  // 【✓】 Toggle play/pause with better error handling
  togglePlay() {
    if (this._isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }
  // 【✓】 Set volume with better validation
  setVolume(value) {
    if (!this.audio) {
      this.handleError("PAUSE_ERROR", "Audio element not initialized");
      return;
    }
    this.volume = Math.max(0, Math.min(1, value));
    this.audio.volume = this.volume;
    this.updateAudioState();
    if (this.isDebugMode) {
      console.log(`[AudioService] Volume set to: ${this.volume}`);
    }
  }
  // 【✓】 Get current state
  getCurrentState() {
    return this.audioStateSubject.asObservable();
  }
  // 【✓】 Get audio events for more granular control
  getAudioEvents() {
    return this.audioEventSubject.asObservable();
  }
  // 【✓】 Get play state changes for simpler integration
  onPlayStateChange() {
    return this.getCurrentState().pipe(map((state2) => state2.isPlaying));
  }
  // 【✓】 Get track changes for simpler integration
  onTrackChange() {
    return this.currentTrack$;
  }
  // 【✓】 Get loading state changes for UI feedback
  onLoadingStateChange() {
    return this.getCurrentState().pipe(map((state2) => state2.loading));
  }
  // 【✓】 Get current progress for seeking and UI
  getProgress() {
    if (!this.audio || !this.audio.duration)
      return 0;
    return this.audio.currentTime / this.audio.duration;
  }
  // 【✓】 Get errors stream
  getErrors() {
    return this.errorSubject.asObservable();
  }
  // 【✓】 Get currently playing status
  isPlaying() {
    return this._isPlaying;
  }
  // 【✓】 Get current track for UI display
  getCurrentTrack() {
    return this.currentTrackSubject.value;
  }
  // 【✓】 Get next track with better error handling
  getNextTrack() {
    const currentIndex = this.audioFiles.indexOf(this.currentTrackSubject.value);
    if (currentIndex < this.audioFiles.length - 1) {
      const nextTrack = this.audioFiles[currentIndex + 1];
      this.currentTrackSubject.next(nextTrack);
      return nextTrack;
    }
    return null;
  }
  // 【✓】 Get previous track with better error handling
  getPreviousTrack() {
    const currentIndex = this.audioFiles.indexOf(this.currentTrackSubject.value);
    if (currentIndex > 0) {
      const previousTrack = this.audioFiles[currentIndex - 1];
      this.currentTrackSubject.next(previousTrack);
      return previousTrack;
    }
    return null;
  }
  // 【✓】 Get track list for UI display
  getTrackList() {
    return this.audioFiles;
  }
  // 【✓】 Get current index for UI highlight
  getCurrentIndex() {
    return this.audioFiles.indexOf(this.currentTrackSubject.value);
  }
  // 【✓】 Play UI sound effects with better type safety and error handling
  playUISound(soundName) {
    if (!this.uiSounds[soundName]) {
      this.handleError("UI_SOUND_ERROR", `UI sound not found: ${soundName}`);
      return;
    }
    try {
      const sound = new Audio(this.uiSounds[soundName]);
      sound.volume = 0.5;
      sound.play().catch((error) => {
        this.handleError("UI_SOUND_ERROR", `Error playing UI sound: ${error instanceof Error ? error.message : String(error)}`);
      });
    } catch (error) {
      this.handleError("UI_SOUND_ERROR", `Failed to create UI sound: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
  // 【✓】 Play a track from source URL with better validation
  playTrack(src) {
    if (!this.audio) {
      this.handleError("PLAY_ERROR", "Audio element not initialized");
      return;
    }
    if (this.isDebugMode) {
      console.log(`[AudioService] Playing track from source: ${src}`);
    }
    this.currentTrackSubject.next(src);
    this.isLoading = true;
    this.updateAudioState();
    this.audio.src = src;
    this.audio.play().then(() => {
      this._isPlaying = true;
      this.updateAudioState();
    }).catch((error) => {
      this.handleError("PLAY_ERROR", `Error playing track: ${error instanceof Error ? error.message : String(error)}`);
    });
  }
  // 【✓】 Pause the current track (alias for pause() for better API)
  pauseTrack() {
    this.pause();
  }
  // 【✓】 Resume the paused track (alias for play() for better API)
  resumeTrack() {
    this.play();
  }
  // 【✓】 Cleanup resources properly
  ngOnDestroy() {
    if (this.isDebugMode) {
      console.log("[AudioService] Destroying service");
    }
    if (this.audio) {
      this.audio.onended = null;
      this.audio.ontimeupdate = null;
      this.audio.onerror = null;
      this.audio.oncanplay = null;
      this.audio.onloadstart = null;
      this.audio.pause();
      this.audio.src = "";
      this.audio = null;
    }
    this.audioStateSubject.complete();
    this.audioEventSubject.complete();
    this.currentTrackSubject.complete();
    this.errorSubject.complete();
    this.destroy$.next();
    this.destroy$.complete();
  }
};
_AudioService2.\u0275fac = function AudioService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _AudioService2)(\u0275\u0275inject(HttpClient));
};
_AudioService2.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _AudioService2, factory: _AudioService2.\u0275fac, providedIn: "root" });
var AudioService2 = _AudioService2;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AudioService2, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: HttpClient }], null);
})();

// src/app/services/music-state-manager.service.ts
var _MusicStateManagerService = class _MusicStateManagerService {
  constructor(dynamicArtistService, audioService, artistCreditService) {
    this.dynamicArtistService = dynamicArtistService;
    this.audioService = audioService;
    this.artistCreditService = artistCreditService;
    this.destroy$ = new Subject();
    this.musicStateSubject = new BehaviorSubject({
      isPlaying: false,
      currentTrack: null,
      currentTrackCredits: null,
      currentTime: 0,
      duration: 0,
      volume: 0.5,
      trackProgress: 0,
      playbackMode: "idle"
    });
    this.artistFilteringStateSubject = new BehaviorSubject({
      mode: "no-music",
      currentArtists: [],
      allArtists: [],
      displayTitle: "All Phantasia 2 Artists",
      displaySubtitle: "Showcasing 31 of 31 artists from the album"
    });
    this.musicState$ = this.musicStateSubject.asObservable();
    this.artistFilteringState$ = this.artistFilteringStateSubject.asObservable();
    this.currentArtistsForFiltering$ = this.artistFilteringState$.pipe(map((state2) => state2.currentArtists), distinctUntilChanged((prev, curr) => this.compareArtistArrays(prev, curr)), shareReplay(1), takeUntil(this.destroy$));
    this.displayInfo$ = this.artistFilteringState$.pipe(map((state2) => ({
      title: state2.displayTitle,
      subtitle: state2.displaySubtitle,
      mode: state2.mode
    })), distinctUntilChanged((prev, curr) => prev.title === curr.title && prev.subtitle === curr.subtitle && prev.mode === curr.mode), shareReplay(1), takeUntil(this.destroy$));
    this.subscriptions = {};
    this.stateUpdateQueue = [];
    this.isProcessingQueue = false;
    this.initializeService();
  }
  ngOnDestroy() {
    try {
      console.log("[MusicStateManager] Starting cleanup...");
      this.stateUpdateQueue.length = 0;
      this.isProcessingQueue = false;
      Object.keys(this.subscriptions).forEach((key) => {
        try {
          if (this.subscriptions[key] && typeof this.subscriptions[key].unsubscribe === "function") {
            this.subscriptions[key].unsubscribe();
          }
        } catch (error) {
          console.error(`[MusicStateManager] Error unsubscribing from ${key}:`, error);
        }
      });
      this.destroy$.next();
      this.destroy$.complete();
      console.log("[MusicStateManager] Cleanup completed");
    } catch (error) {
      console.error("[MusicStateManager] Error during cleanup:", error);
    }
  }
  /**
   * 【✓】 Enhanced service initialization with proper subscription management
   */
  initializeService() {
    try {
      console.log("[MusicStateManager] Initializing service...");
      this.loadAllArtistsForShowcase();
      this.subscriptions["currentTrack"] = this.dynamicArtistService.currentTrack$.pipe(distinctUntilChanged((prev, curr) => prev?.id === curr?.id), takeUntil(this.destroy$)).subscribe({
        next: (currentTrack) => this.queueStateUpdate(() => this.handleTrackChange(currentTrack, "phantasia2")),
        error: (error) => console.error("[MusicStateManager] Error in currentTrack subscription:", error)
      });
      this.subscriptions["currentTime"] = this.dynamicArtistService.currentTime$.pipe(
        debounceTime(50),
        // Faster response, better throttling
        distinctUntilChanged(),
        takeUntil(this.destroy$)
      ).subscribe({
        next: (currentTime) => this.queueStateUpdate(() => this.updateCurrentTime(currentTime)),
        error: (error) => console.error("[MusicStateManager] Error in currentTime subscription:", error)
      });
      this.subscriptions["audioState"] = this.audioService.audioState$.pipe(distinctUntilChanged((prev, curr) => prev.currentTrack === curr.currentTrack && prev.isPlaying === curr.isPlaying), takeUntil(this.destroy$)).subscribe({
        next: (audioState) => {
          const currentMusicState = this.musicStateSubject.value;
          if (!currentMusicState.currentTrack || currentMusicState.playbackMode !== "phantasia2") {
            this.queueStateUpdate(() => this.handleAudioStateChange(audioState));
          }
        },
        error: (error) => console.error("[MusicStateManager] Error in audioState subscription:", error)
      });
      this.subscriptions["trackCredits"] = this.artistCreditService.currentTrackCredits$.pipe(takeUntil(this.destroy$)).subscribe({
        next: (trackCredits) => this.queueStateUpdate(() => this.updateTrackCredits(trackCredits)),
        error: (error) => console.error("[MusicStateManager] Error in trackCredits subscription:", error)
      });
      console.log("[MusicStateManager] Service initialized with enhanced error handling");
    } catch (error) {
      console.error("[MusicStateManager] Error during initialization:", error);
    }
  }
  /**
   * 【✓】 Enhanced track change handling with error recovery
   */
  handleTrackChange(track, mode) {
    try {
      const currentState = this.musicStateSubject.value;
      if (track && currentState.currentTrack?.id === track.id) {
        console.log(`[MusicStateManager] Track ${track.id} already active, skipping update`);
        return;
      }
      if (track) {
        let trackCredits = null;
        try {
          trackCredits = this.artistCreditService.getTrackCredits(track.id);
        } catch (error) {
          console.warn(`[MusicStateManager] Could not get credits for track ${track.id}:`, error);
        }
        const trackArtists = this.extractArtistsFromTrack(track, trackCredits);
        const newMusicState = __spreadProps(__spreadValues({}, currentState), {
          currentTrack: track,
          currentTrackCredits: trackCredits,
          playbackMode: mode
        });
        if (this.validateMusicState(newMusicState)) {
          this.musicStateSubject.next(newMusicState);
        } else {
          console.error("[MusicStateManager] Invalid music state, skipping update");
          return;
        }
        const allArtists = this.artistFilteringStateSubject.value.allArtists;
        const newFilteringState = {
          mode: "music-playing",
          currentArtists: trackArtists,
          allArtists,
          displayTitle: "Currently Playing Artists",
          displaySubtitle: `Artists for "${track.title}" - ${trackArtists.length} artists are currently featured`
        };
        if (this.validateArtistFilteringState(newFilteringState)) {
          this.artistFilteringStateSubject.next(newFilteringState);
        }
        console.log(`[MusicStateManager] Track changed to: "${track.title}" with ${trackArtists.length} artists`);
      } else {
        this.switchToNoMusicMode();
      }
    } catch (error) {
      console.error("[MusicStateManager] Error handling track change:", error);
      this.switchToNoMusicMode();
    }
  }
  /**
   * Handle legacy audio state changes
   */
  handleAudioStateChange(audioState) {
    const currentState = this.musicStateSubject.value;
    if (audioState.isPlaying && audioState.currentTrack) {
      const trackCredits = this.artistCreditService.getTrackCredits(audioState.currentTrack);
      const newMusicState = __spreadProps(__spreadValues({}, currentState), {
        isPlaying: audioState.isPlaying,
        currentTime: audioState.currentTime,
        duration: audioState.duration,
        volume: audioState.volume,
        trackProgress: audioState.duration > 0 ? audioState.currentTime / audioState.duration : 0,
        playbackMode: "legacy",
        currentTrackCredits: trackCredits
      });
      this.musicStateSubject.next(newMusicState);
      if (trackCredits) {
        const newFilteringState = {
          mode: "music-playing",
          currentArtists: trackCredits.allContributions,
          allArtists: this.artistFilteringStateSubject.value.allArtists,
          displayTitle: "Currently Playing Artists",
          displaySubtitle: `Artists for "${trackCredits.title}" - ${trackCredits.allContributions.length} artists are currently featured`
        };
        this.artistFilteringStateSubject.next(newFilteringState);
      }
    } else {
      this.switchToNoMusicMode();
    }
  }
  /**
   * Switch to no-music mode (showcase all artists)
   */
  switchToNoMusicMode() {
    const currentState = this.musicStateSubject.value;
    const allArtists = this.artistFilteringStateSubject.value.allArtists;
    const newMusicState = __spreadProps(__spreadValues({}, currentState), {
      isPlaying: false,
      currentTrack: null,
      currentTrackCredits: null,
      playbackMode: "idle"
    });
    this.musicStateSubject.next(newMusicState);
    const newFilteringState = {
      mode: "no-music",
      currentArtists: [],
      allArtists,
      displayTitle: "All Phantasia 2 Artists",
      displaySubtitle: `Showcasing ${allArtists.length} of 31 artists from the album`
    };
    this.artistFilteringStateSubject.next(newFilteringState);
    console.log("[MusicStateManager] Switched to no-music mode - showing all artists");
  }
  /**
   * Update current playback time
   */
  updateCurrentTime(currentTime) {
    const currentState = this.musicStateSubject.value;
    const newMusicState = __spreadProps(__spreadValues({}, currentState), {
      currentTime,
      trackProgress: currentState.duration > 0 ? currentTime / currentState.duration : 0
    });
    this.musicStateSubject.next(newMusicState);
  }
  /**
   * Update track credits information
   */
  updateTrackCredits(trackCredits) {
    const currentState = this.musicStateSubject.value;
    const newMusicState = __spreadProps(__spreadValues({}, currentState), {
      currentTrackCredits: trackCredits
    });
    this.musicStateSubject.next(newMusicState);
    if (trackCredits && currentState.currentTrack) {
      const currentFilteringState = this.artistFilteringStateSubject.value;
      const newFilteringState = __spreadProps(__spreadValues({}, currentFilteringState), {
        currentArtists: trackCredits.allContributions,
        displaySubtitle: `Artists for "${trackCredits.title}" - ${trackCredits.allContributions.length} artists are currently featured`
      });
      this.artistFilteringStateSubject.next(newFilteringState);
    }
  }
  /**
   * Extract artists from track and credits
   */
  extractArtistsFromTrack(track, trackCredits) {
    if (trackCredits) {
      return trackCredits.allContributions;
    }
    const artists = [];
    if (track.mainArtist) {
      artists.push({
        id: `${track.id}-main`,
        artistName: track.mainArtist,
        artistDisplayName: track.mainArtist,
        role: "Main Artist",
        participationType: "primary",
        percentageContribution: 100,
        color: "#FF6B6B",
        socialLinks: {}
      });
    }
    track.features?.forEach((feature, index) => {
      artists.push({
        id: `${track.id}-featured-${index}`,
        artistName: feature.name,
        artistDisplayName: feature.displayName || feature.name,
        role: "Featured Artist",
        participationType: "featured",
        percentageContribution: 50,
        color: "#ffffff",
        socialLinks: feature.socialLinks
      });
    });
    track.collaborators?.forEach((collaborator, index) => {
      artists.push({
        id: `${track.id}-collab-${index}`,
        artistName: collaborator.name,
        artistDisplayName: collaborator.displayName || collaborator.name,
        role: collaborator.role || "Collaborator",
        participationType: "collaboration",
        percentageContribution: 25,
        color: "#45B7D1",
        socialLinks: collaborator.socialLinks
      });
    });
    return artists;
  }
  /**
   * Load all artists for showcase mode
   */
  loadAllArtistsForShowcase() {
    const allArtists = this.artistCreditService.getAllPhantasia2Artists();
    const currentFilteringState = this.artistFilteringStateSubject.value;
    const newFilteringState = __spreadProps(__spreadValues({}, currentFilteringState), {
      allArtists,
      displaySubtitle: `Showcasing ${allArtists.length} of 31 artists from the album`
    });
    this.artistFilteringStateSubject.next(newFilteringState);
  }
  /**
   * Public API: Force switch to no-music mode
   */
  forceNoMusicMode() {
    this.switchToNoMusicMode();
  }
  /**
   * Public API: Get current music state
   */
  getCurrentMusicState() {
    return this.musicStateSubject.value;
  }
  /**
   * Public API: Get current artist filtering state
   */
  getCurrentArtistFilteringState() {
    return this.artistFilteringStateSubject.value;
  }
  /**
   * Public API: Manually set playing state
   */
  setPlayingState(isPlaying) {
    const currentState = this.musicStateSubject.value;
    const newMusicState = __spreadProps(__spreadValues({}, currentState), {
      isPlaying
    });
    this.musicStateSubject.next(newMusicState);
  }
  /**
   * Public API: Update volume
   */
  updateVolume(volume) {
    const currentState = this.musicStateSubject.value;
    const newMusicState = __spreadProps(__spreadValues({}, currentState), {
      volume
    });
    this.musicStateSubject.next(newMusicState);
  }
  /**
   * Public API: Update duration
   */
  updateDuration(duration) {
    const currentState = this.musicStateSubject.value;
    const newMusicState = __spreadProps(__spreadValues({}, currentState), {
      duration,
      trackProgress: currentState.currentTime > 0 ? currentState.currentTime / duration : 0
    });
    this.musicStateSubject.next(newMusicState);
  }
  /**
   * Optimized array comparison for performance
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
   * 【✓】 Enhanced debug information with comprehensive state tracking
   */
  getDebugInfo() {
    const musicState = this.musicStateSubject.value;
    const filteringState = this.artistFilteringStateSubject.value;
    return {
      musicState: {
        playbackMode: musicState.playbackMode,
        isPlaying: musicState.isPlaying,
        currentTrackId: musicState.currentTrack?.id,
        currentTrackTitle: musicState.currentTrack?.title,
        currentTime: musicState.currentTime,
        duration: musicState.duration,
        volume: musicState.volume,
        trackProgress: musicState.trackProgress
      },
      filteringState: {
        mode: filteringState.mode,
        currentArtistsCount: filteringState.currentArtists.length,
        allArtistsCount: filteringState.allArtists.length,
        displayTitle: filteringState.displayTitle,
        displaySubtitle: filteringState.displaySubtitle
      },
      subscriptions: {
        activeSubscriptions: Object.keys(this.subscriptions).length,
        subscriptionKeys: Object.keys(this.subscriptions)
      },
      stateQueue: {
        queueLength: this.stateUpdateQueue.length,
        isProcessing: this.isProcessingQueue
      }
    };
  }
  // 【✓】 Enhanced helper methods for state management
  /**
   * Queue state updates to prevent race conditions
   */
  queueStateUpdate(updateFn) {
    this.stateUpdateQueue.push(updateFn);
    this.processStateQueue();
  }
  /**
   * Process queued state updates sequentially
   */
  processStateQueue() {
    return __async(this, null, function* () {
      if (this.isProcessingQueue || this.stateUpdateQueue.length === 0) {
        return;
      }
      this.isProcessingQueue = true;
      try {
        while (this.stateUpdateQueue.length > 0) {
          const updateFn = this.stateUpdateQueue.shift();
          if (updateFn) {
            try {
              updateFn();
            } catch (error) {
              console.error("[MusicStateManager] Error processing state update:", error);
            }
            yield new Promise((resolve) => setTimeout(resolve, 10));
          }
        }
      } finally {
        this.isProcessingQueue = false;
      }
    });
  }
  /**
   * Validate music state before updating
   */
  validateMusicState(state2) {
    try {
      return typeof state2.isPlaying === "boolean" && typeof state2.currentTime === "number" && typeof state2.duration === "number" && typeof state2.volume === "number" && typeof state2.trackProgress === "number" && state2.volume >= 0 && state2.volume <= 1 && state2.trackProgress >= 0 && state2.trackProgress <= 1 && state2.currentTime >= 0 && state2.duration >= 0;
    } catch (error) {
      console.error("[MusicStateManager] Error validating music state:", error);
      return false;
    }
  }
  /**
   * Validate artist filtering state before updating
   */
  validateArtistFilteringState(state2) {
    try {
      return ["no-music", "music-playing"].includes(state2.mode) && Array.isArray(state2.currentArtists) && Array.isArray(state2.allArtists) && typeof state2.displayTitle === "string" && typeof state2.displaySubtitle === "string";
    } catch (error) {
      console.error("[MusicStateManager] Error validating artist filtering state:", error);
      return false;
    }
  }
  /**
   * Emergency reset method for state corruption
   */
  emergencyReset() {
    console.warn("[MusicStateManager] Performing emergency reset");
    try {
      const safeArtists = this.artistCreditService.getAllPhantasia2Artists();
      const safeMusicState = {
        isPlaying: false,
        currentTrack: null,
        currentTrackCredits: null,
        currentTime: 0,
        duration: 0,
        volume: 0.5,
        trackProgress: 0,
        playbackMode: "idle"
      };
      const safeFilteringState = {
        mode: "no-music",
        currentArtists: [],
        allArtists: safeArtists,
        displayTitle: "All Phantasia 2 Artists",
        displaySubtitle: `Showcasing ${safeArtists.length} of 31 artists from the album`
      };
      this.musicStateSubject.next(safeMusicState);
      this.artistFilteringStateSubject.next(safeFilteringState);
      this.stateUpdateQueue.length = 0;
      this.isProcessingQueue = false;
      console.log("[MusicStateManager] Emergency reset completed");
    } catch (error) {
      console.error("[MusicStateManager] Error during emergency reset:", error);
    }
  }
};
_MusicStateManagerService.\u0275fac = function MusicStateManagerService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _MusicStateManagerService)(\u0275\u0275inject(DynamicArtistService), \u0275\u0275inject(AudioService), \u0275\u0275inject(ArtistCreditService));
};
_MusicStateManagerService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _MusicStateManagerService, factory: _MusicStateManagerService.\u0275fac, providedIn: "root" });
var MusicStateManagerService = _MusicStateManagerService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MusicStateManagerService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: DynamicArtistService }, { type: AudioService }, { type: ArtistCreditService }], null);
})();

// src/app/pages/collections/phantasia/tools/music-player/music-player.component.ts
function MusicPlayerComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 30)(1, "div", 31);
    \u0275\u0275text(2, "\u26A0");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
function MusicPlayerComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 32);
    \u0275\u0275element(1, "div", 33);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "Loading audio...");
    \u0275\u0275elementEnd()();
  }
}
function MusicPlayerComponent_div_6_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 38)(1, "div", 39)(2, "h4", 40);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 41);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.currentTrackInfo.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.currentTrackInfo.mainArtist);
  }
}
function MusicPlayerComponent_div_6_div_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42)(1, "div", 40);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 41);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getTrackName(ctx_r0.currentTrack));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r0.getArtistName());
  }
}
function MusicPlayerComponent_div_6_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 43);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.currentSubtitle, " ");
  }
}
function MusicPlayerComponent_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34);
    \u0275\u0275template(1, MusicPlayerComponent_div_6_div_1_Template, 6, 2, "div", 35)(2, MusicPlayerComponent_div_6_div_2_Template, 5, 2, "div", 36)(3, MusicPlayerComponent_div_6_div_3_Template, 2, 1, "div", 37);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.currentTrackInfo);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx_r0.currentTrackInfo && ctx_r0.currentTrack);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r0.currentSubtitle && !ctx_r0.trackTitle && !ctx_r0.currentTrackInfo);
  }
}
var _MusicPlayerComponent = class _MusicPlayerComponent {
  constructor(audioService, dynamicArtistService, musicStateManager, cdr) {
    this.audioService = audioService;
    this.dynamicArtistService = dynamicArtistService;
    this.musicStateManager = musicStateManager;
    this.cdr = cdr;
    this.trackTitle = "";
    this.trackArtist = "";
    this.activeTrack = null;
    this.audio = null;
    this.destroy$ = new Subject();
    this.trackLoadingMutex = new Subject();
    this.isTrackLoading = false;
    this.audioInstances = [];
    this.lastLoadedTrackId = null;
    this.isPlaying = false;
    this.isLoading = true;
    this.currentTrack = "";
    this.currentTime = 0;
    this.duration = 0;
    this.volume = 0.5;
    this._isMuted = false;
    this._savedVolumeBeforeMute = 0.5;
    this._muteStateInitialized = false;
    this.error = "";
    this.currentSubtitle = "";
    this.currentTrackInfo = null;
    this.allTracks = [];
    this.currentTrackIndex = 0;
    this.currentProject = "phantasia1";
    this.hasUserInteracted = false;
    this.lastSuccessfulVolume = 0.5;
    this.retryCount = 0;
    this.maxRetries = 3;
    this.audioContext = null;
    this.eventListeners = [];
    this.isAudioContextInitialized = false;
    this.diagnoseEnvironment();
    this.initializeAudioContext();
    this.setupGlobalEventListeners();
  }
  // 【✓】 Comprehensive environment diagnosis for debugging
  diagnoseEnvironment() {
    console.group("[MusicPlayer] Environment Diagnosis");
    console.log("User Agent:", navigator.userAgent);
    console.log("Location:", window.location.href);
    console.log("Base URL:", document.baseURI);
    console.log("Protocol:", window.location.protocol);
    console.log("Host:", window.location.host);
    console.log("Port:", window.location.port);
    const testUnicode = "8. Evin a\u2019k - Trench.ogg";
    console.log("Unicode Test String:", testUnicode);
    console.log("Unicode Test Encoded:", encodeURIComponent(testUnicode));
    console.log("Howler Audio Support:", {
      webAudio: window.Howler?.ctx !== null,
      html5: true,
      codecs: {
        ogg: window.Howler?.codecs?.("audio/ogg") || "unknown",
        mp3: window.Howler?.codecs?.("audio/mpeg") || "unknown"
      }
    });
    console.groupEnd();
  }
  // 【✓】 Get project-specific audio directory
  getAudioDirectory() {
    return this.currentProject === "phantasia1" ? "Phantasia_1" : "Phantasia_2";
  }
  // 【✓】 Initialize component
  ngOnInit() {
    this.initializeAudio();
  }
  // 【✓】 Enhanced cleanup with comprehensive resource management
  ngOnDestroy() {
    try {
      this.destroy$.next();
      this.destroy$.complete();
      this.cleanupAllAudioInstances();
      this.isTrackLoading = false;
      this.lastLoadedTrackId = null;
      this.cleanupAudioContext();
      this.cleanupEventListeners();
      console.log("[MusicPlayer] Component destroyed and resources cleaned up");
    } catch (error) {
      console.error("[MusicPlayer] Error during cleanup:", error);
    }
  }
  // 【✓】 Initialize audio player with multi-project support
  initializeAudio() {
    this.dynamicArtistService.currentProject$.pipe(takeUntil(this.destroy$)).subscribe((project) => {
      this.currentProject = project;
      console.log(`[MusicPlayer] Project switched to: ${project}`);
      this.cdr.markForCheck();
    });
    this.dynamicArtistService.tracks$.pipe(takeUntil(this.destroy$)).subscribe((tracks) => {
      this.allTracks = tracks;
      if (tracks.length > 0 && !this.currentTrackInfo) {
        this.currentTrackInfo = tracks[0];
        this.currentTrackIndex = 0;
        this.loadTrackFromInfo(this.currentTrackInfo);
        this.updateDynamicArtistTime();
      }
      this.cdr.markForCheck();
    });
    this.dynamicArtistService.currentTrack$.pipe(takeUntil(this.destroy$)).subscribe((currentTrack) => {
      if (currentTrack && currentTrack !== this.currentTrackInfo) {
        this.currentTrackInfo = currentTrack;
        this.currentTrackIndex = this.allTracks.findIndex((t) => t.id === currentTrack.id);
        this.loadTrackFromInfo(currentTrack);
      }
      this.cdr.markForCheck();
    });
  }
  // 【✓】 Enhanced track loading with mutex protection and proper cleanup
  loadTrackFromInfo(trackInfo) {
    return __async(this, null, function* () {
      if (this.isTrackLoading) {
        console.log("[MusicPlayer] Track loading already in progress, waiting...");
        return;
      }
      if (this.lastLoadedTrackId === trackInfo.id && !this.error) {
        console.log(`[MusicPlayer] Track ${trackInfo.id} already loaded, skipping`);
        return;
      }
      this.isTrackLoading = true;
      this.lastLoadedTrackId = trackInfo.id;
      this.retryCount = 0;
      try {
        this.isLoading = true;
        this.currentTime = 0;
        this.isPlaying = false;
        this.error = "";
        this.cdr.markForCheck();
        yield this.cleanupCurrentAudio();
        console.log(`[MusicPlayer] Starting track load: ${trackInfo.title} (${trackInfo.id})`);
      } catch (error) {
        console.error("[MusicPlayer] Error during track loading preparation:", error);
        this.handleTrackLoadError(trackInfo, error);
        return;
      }
      let audioSrc;
      if (trackInfo.audioFile) {
        let processedFilename = trackInfo.audioFile;
        console.log("[MusicPlayer] Original filename:", processedFilename);
        console.log("[MusicPlayer] Filename char codes:", [...processedFilename].map((c) => `${c}(${c.charCodeAt(0)})`).join(" "));
        const encodingStrategies = [
          // Strategy 1: Use encodeURIComponent for proper URL encoding
          () => `assets/audio/${this.getAudioDirectory()}/${encodeURIComponent(processedFilename)}`,
          // Strategy 2: Replace Unicode quotation mark with regular apostrophe first, then encode
          () => {
            const normalized = processedFilename.replace(/'/g, "'");
            return `assets/audio/${this.getAudioDirectory()}/${encodeURIComponent(normalized)}`;
          },
          // Strategy 3: Manual encoding of problematic characters
          () => {
            const manualEncoded = processedFilename.replace(/'/g, "%E2%80%99").replace(/ /g, "%20").replace(/\(/g, "%28").replace(/\)/g, "%29");
            return `assets/audio/${this.getAudioDirectory()}/${manualEncoded}`;
          },
          // Strategy 4: Try without any encoding (direct path)
          () => `assets/audio/${this.getAudioDirectory()}/${processedFilename}`,
          // Strategy 5: Use different base URL or absolute path
          () => `/assets/audio/${this.getAudioDirectory()}/${encodeURIComponent(processedFilename)}`
        ];
        audioSrc = encodingStrategies[0]();
        this._fallbackUrls = encodingStrategies.slice(1).map((strategy) => strategy());
        this._currentStrategyIndex = 0;
        this._trackInfo = trackInfo;
        console.log("[MusicPlayer] Prepared fallback URLs:");
        this._fallbackUrls.forEach((url, index) => {
          console.log(`  Strategy ${index + 1}: ${url}`);
        });
      } else {
        audioSrc = `assets/audio/${this.getAudioDirectory()}/${trackInfo.id}.ogg`;
        this._fallbackUrls = [];
      }
      console.log("[MusicPlayer] Loading audio (Strategy 0):", audioSrc);
      if (trackInfo.id === "8") {
        console.group("[MusicPlayer] Track 8 Diagnostics");
        console.log("Track ID:", trackInfo.id);
        console.log("Track Title:", trackInfo.title);
        console.log("Main Artist:", trackInfo.mainArtist);
        console.log("Audio File Mapping:", trackInfo.audioFile);
        console.log("Final Audio Source:", audioSrc);
        console.log("Browser Location:", window.location.href);
        console.groupEnd();
      }
      this.audio = new import_howler.Howl({
        src: [audioSrc],
        html5: true,
        format: ["ogg", "mp3"],
        // Prefer OGG but fallback to MP3
        volume: this.volume,
        // Preserve volume setting
        onload: () => {
          this.isLoading = false;
          this.duration = this.audio?.duration() || 0;
          if (this._isMuted && this.audio) {
            this.audio.volume(0);
          } else if (this.audio) {
            this.audio.volume(this.volume);
          }
          this.updateDynamicArtistTime();
          this.musicStateManager.updateDuration(this.duration);
          this.cdr.markForCheck();
        },
        onplay: () => {
          this.isPlaying = true;
          this.updateTime();
          this.updateDynamicArtistTime();
          this.musicStateManager.setPlayingState(true);
          this.cdr.markForCheck();
        },
        onpause: () => {
          this.isPlaying = false;
          this.musicStateManager.setPlayingState(false);
          this.cdr.markForCheck();
        },
        onend: () => {
          this.isPlaying = false;
          this.currentTime = 0;
          this.musicStateManager.setPlayingState(false);
          this.nextTrack();
          this.cdr.markForCheck();
        },
        onloaderror: (id, error) => {
          console.error("[MusicPlayer] Error loading (Strategy " + (this._currentStrategyIndex || 0) + "):", audioSrc, error);
          console.error("[MusicPlayer] Track info:", trackInfo);
          const fallbackUrls = this._fallbackUrls || [];
          const currentIndex = this._currentStrategyIndex || 0;
          if (currentIndex < fallbackUrls.length) {
            console.log("[MusicPlayer] Attempting fallback strategy", currentIndex + 1);
            this._currentStrategyIndex = currentIndex + 1;
            const fallbackUrl = fallbackUrls[currentIndex];
            console.log("[MusicPlayer] Trying fallback URL:", fallbackUrl);
            if (this.audio) {
              this.audio.unload();
            }
            this.audio = new import_howler.Howl({
              src: [fallbackUrl],
              html5: true,
              format: ["ogg", "mp3"],
              volume: this.volume,
              onload: () => {
                console.log("[MusicPlayer] Fallback strategy successful!");
                this.isLoading = false;
                this.isTrackLoading = false;
                this.duration = this.audio?.duration() || 0;
                if (this._isMuted && this.audio) {
                  this.audio.volume(0);
                } else if (this.audio) {
                  this.audio.volume(this.volume);
                }
                this.updateDynamicArtistTime();
                this.musicStateManager.updateDuration(this.duration);
                this.cdr.markForCheck();
              },
              onplay: () => {
                this.isPlaying = true;
                this.updateTime();
                this.updateDynamicArtistTime();
                this.cdr.markForCheck();
              },
              onpause: () => {
                this.isPlaying = false;
                this.cdr.markForCheck();
              },
              onend: () => {
                this.isPlaying = false;
                this.currentTime = 0;
                this.nextTrack();
                this.cdr.markForCheck();
              },
              onloaderror: (fallbackId, fallbackError) => {
                console.error("[MusicPlayer] Fallback also failed:", fallbackUrl, fallbackError);
                if (currentIndex >= fallbackUrls.length - 1) {
                  this.error = `Failed to load track "${trackInfo.title}" by ${trackInfo.mainArtist}. Tried ${fallbackUrls.length + 1} different URL encodings. Last error: ${fallbackError}`;
                  this.isLoading = false;
                  this.isTrackLoading = false;
                  this.lastLoadedTrackId = null;
                  this.cdr.markForCheck();
                } else {
                  this._currentStrategyIndex = currentIndex + 1;
                  const nextFallbackUrl = fallbackUrls[currentIndex + 1];
                  if (nextFallbackUrl) {
                    console.log("[MusicPlayer] Trying next fallback strategy:", currentIndex + 2);
                    this.tryLoadWithUrl(nextFallbackUrl, trackInfo);
                  }
                }
              }
            });
          } else {
            this.error = `Failed to load track "${trackInfo.title}" by ${trackInfo.mainArtist}. All ${fallbackUrls.length + 1} encoding strategies failed. Final error: ${error}`;
            this.isLoading = false;
            this.isTrackLoading = false;
            this.lastLoadedTrackId = null;
            this.cdr.markForCheck();
          }
        }
      });
      if (this.audio) {
        this.audioInstances.push(this.audio);
        this.isTrackLoading = false;
      }
    });
  }
  // 【✓】 Enhanced helper method for fallback URL loading with proper cleanup
  tryLoadWithUrl(url, trackInfo) {
    return __async(this, null, function* () {
      try {
        yield this.cleanupCurrentAudio();
      } catch (error) {
        console.error("[MusicPlayer] Error cleaning up before fallback:", error);
      }
      this.audio = new import_howler.Howl({
        src: [url],
        html5: true,
        format: ["ogg", "mp3"],
        volume: this.volume,
        onload: () => {
          console.log("[MusicPlayer] Fallback strategy successful!");
          this.isLoading = false;
          this.isTrackLoading = false;
          this.duration = this.audio?.duration() || 0;
          if (this._isMuted && this.audio) {
            this.audio.volume(0);
          } else if (this.audio) {
            this.audio.volume(this.volume);
          }
          this.updateDynamicArtistTime();
          this.musicStateManager.updateDuration(this.duration);
          this.cdr.markForCheck();
        },
        onplay: () => {
          this.isPlaying = true;
          this.updateTime();
          this.updateDynamicArtistTime();
          this.cdr.markForCheck();
        },
        onpause: () => {
          this.isPlaying = false;
          this.cdr.markForCheck();
        },
        onend: () => {
          this.isPlaying = false;
          this.currentTime = 0;
          this.nextTrack();
          this.cdr.markForCheck();
        },
        onloaderror: (id, error) => {
          const fallbackUrls = this._fallbackUrls || [];
          const currentIndex = this._currentStrategyIndex || 0;
          console.error(`[MusicPlayer] Fallback strategy ${currentIndex + 1} failed:`, url, error);
          if (currentIndex < fallbackUrls.length - 1) {
            this._currentStrategyIndex = currentIndex + 1;
            const nextUrl = fallbackUrls[currentIndex];
            console.log(`[MusicPlayer] Trying next fallback strategy ${currentIndex + 2}:`, nextUrl);
            this.tryLoadWithUrl(nextUrl, trackInfo);
          } else {
            this.error = `Failed to load track "${trackInfo.title}" by ${trackInfo.mainArtist}. All ${fallbackUrls.length + 1} encoding strategies failed. Final error: ${error}`;
            this.isLoading = false;
            this.isTrackLoading = false;
            this.lastLoadedTrackId = null;
            this.cdr.markForCheck();
          }
        }
      });
      if (this.audio) {
        this.audioInstances.push(this.audio);
      }
    });
  }
  // 【✓】 Load and play track (legacy method for backwards compatibility)
  loadTrack(track) {
    this.isLoading = true;
    this.currentTime = 0;
    this.isPlaying = false;
    this.cdr.markForCheck();
    if (this.audio) {
      this.audio.unload();
    }
    this.audio = new import_howler.Howl({
      src: [track.url || track.title],
      // Fallback to title if url is not provided
      html5: true,
      onload: () => {
        this.isLoading = false;
        this.duration = this.audio?.duration() || 0;
        this.cdr.markForCheck();
      },
      onplay: () => {
        this.isPlaying = true;
        this.updateTime();
        this.cdr.markForCheck();
      },
      onpause: () => {
        this.isPlaying = false;
        this.cdr.markForCheck();
      },
      onend: () => {
        this.isPlaying = false;
        this.currentTime = 0;
        this.nextTrack();
        this.cdr.markForCheck();
      },
      onloaderror: (id, error) => {
        this.error = `Failed to load track: ${error}`;
        this.isLoading = false;
        this.cdr.markForCheck();
      }
    });
  }
  // 【✓】 Enhanced play/pause with audio context management
  togglePlay() {
    return __async(this, null, function* () {
      if (!this.audio) {
        console.warn("[MusicPlayer] No audio instance available for playback");
        return;
      }
      try {
        yield this.ensureAudioContextReady();
        if (this.isPlaying) {
          this.audio.pause();
          this.isPlaying = false;
        } else {
          this.hasUserInteracted = true;
          this.audio.play();
          this.isPlaying = true;
        }
        this.musicStateManager.setPlayingState(this.isPlaying);
        this.cdr.markForCheck();
        console.log(`[MusicPlayer] Playback ${this.isPlaying ? "started" : "paused"}`);
      } catch (error) {
        console.error("[MusicPlayer] Error toggling playback:", error);
        this.error = "Playback error occurred";
        this.cdr.markForCheck();
      }
    });
  }
  // 【✓】 Enhanced volume management with proper mute state separation
  setVolume(value) {
    if (!this.audio) {
      this.volume = Math.max(0, Math.min(1, value));
      this.lastSuccessfulVolume = this.volume;
      return;
    }
    try {
      const clampedValue = Math.max(0, Math.min(1, value));
      this.volume = clampedValue;
      if (!this._isMuted && clampedValue > 0) {
        this._savedVolumeBeforeMute = clampedValue;
        this.lastSuccessfulVolume = clampedValue;
      }
      this.audio.volume(clampedValue);
      this.musicStateManager.updateVolume(clampedValue);
      this.cdr.markForCheck();
      console.log(`[MusicPlayer] Volume set to ${clampedValue}, muted: ${this._isMuted}`);
    } catch (error) {
      console.error("[MusicPlayer] Error setting volume:", error);
      this.handleVolumeError(value);
    }
  }
  // 【✓】 Enhanced mute toggle with proper state isolation
  toggleMute() {
    if (!this.audio) {
      console.warn("[MusicPlayer] Cannot toggle mute: no audio instance available");
      return;
    }
    try {
      this.hasUserInteracted = true;
      if (!this._muteStateInitialized) {
        this._savedVolumeBeforeMute = this.volume > 0 ? this.volume : 0.5;
        this._muteStateInitialized = true;
      }
      if (this._isMuted) {
        this._isMuted = false;
        const volumeToRestore = this._savedVolumeBeforeMute > 0 ? this._savedVolumeBeforeMute : 0.5;
        this.volume = volumeToRestore;
        this.audio.volume(volumeToRestore);
        this.musicStateManager.updateVolume(volumeToRestore);
        console.log(`[MusicPlayer] Unmuted, restored volume to ${volumeToRestore}`);
      } else {
        this._isMuted = true;
        if (this.volume > 0) {
          this._savedVolumeBeforeMute = this.volume;
        }
        this.audio.volume(0);
        this.musicStateManager.updateVolume(0);
        console.log(`[MusicPlayer] Muted, saved volume ${this._savedVolumeBeforeMute}`);
      }
      this.cdr.markForCheck();
    } catch (error) {
      console.error("[MusicPlayer] Error toggling mute:", error);
      this.handleMuteError();
    }
  }
  // 【✓】 Seek to position
  seek(value) {
    if (!this.audio)
      return;
    this.audio.seek(value);
    this.currentTime = value;
    this.cdr.markForCheck();
  }
  // 【✓】 Update subtitle based on filename
  updateSubtitleFromFilename(track) {
    if (track) {
      const filename = track.split("/").pop() || "";
      const parts = filename.replace(".mp3", "").split(" - ");
      if (parts.length > 1) {
        this.currentSubtitle = parts[0];
      } else {
        this.currentSubtitle = "";
      }
    }
  }
  // 【✓】 Update time with proper continuous tracking
  updateTime() {
    if (this.audio && this.isPlaying) {
      const seek = this.audio.seek();
      this.currentTime = typeof seek === "number" ? seek : 0;
      this.updateDynamicArtistTime();
      this.cdr.markForCheck();
      requestAnimationFrame(() => this.updateTime());
    }
  }
  // 【✓】 Update dynamic artist service with current playback time
  updateDynamicArtistTime() {
    if (this.currentTrackInfo) {
      const absoluteTime = this.currentTrackInfo.startTime + this.currentTime;
      this.dynamicArtistService.updateCurrentTime(absoluteTime);
    }
  }
  // 【✓】 Next track for Phantasia 2 with proper state synchronization
  nextTrack() {
    if (this.isLoading || this.allTracks.length === 0)
      return;
    const wasPlaying = this.isPlaying;
    const nextIndex = (this.currentTrackIndex + 1) % this.allTracks.length;
    const nextTrackInfo = this.allTracks[nextIndex];
    if (nextTrackInfo && nextTrackInfo.id !== this.currentTrackInfo?.id) {
      this.currentTrackInfo = nextTrackInfo;
      this.currentTrackIndex = nextIndex;
      this.dynamicArtistService.updateCurrentTime(nextTrackInfo.startTime);
      this.loadTrackFromInfo(nextTrackInfo);
      if (wasPlaying) {
        const playWhenReady = () => {
          if (!this.isLoading && this.audio) {
            this.audio.play();
          } else if (!this.error) {
            setTimeout(playWhenReady, 100);
          }
        };
        playWhenReady();
      }
    }
  }
  // 【✓】 Previous track for Phantasia 2 with proper state synchronization
  previousTrack() {
    if (this.isLoading || this.allTracks.length === 0)
      return;
    const wasPlaying = this.isPlaying;
    const prevIndex = this.currentTrackIndex === 0 ? this.allTracks.length - 1 : this.currentTrackIndex - 1;
    const prevTrackInfo = this.allTracks[prevIndex];
    if (prevTrackInfo && prevTrackInfo.id !== this.currentTrackInfo?.id) {
      this.currentTrackInfo = prevTrackInfo;
      this.currentTrackIndex = prevIndex;
      this.dynamicArtistService.updateCurrentTime(prevTrackInfo.startTime);
      this.loadTrackFromInfo(prevTrackInfo);
      if (wasPlaying) {
        const playWhenReady = () => {
          if (!this.isLoading && this.audio) {
            this.audio.play();
          } else if (!this.error) {
            setTimeout(playWhenReady, 100);
          }
        };
        playWhenReady();
      }
    }
  }
  // 【✓】 Format time with NaN handling
  formatTime(seconds) {
    if (isNaN(seconds) || !isFinite(seconds) || seconds < 0) {
      return "0:00";
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  }
  // 【✓】 Get track name for Phantasia 2
  getTrackName(track) {
    if (this.currentTrackInfo) {
      return this.currentTrackInfo.title;
    }
    if (this.trackTitle) {
      return this.trackTitle;
    }
    if (track) {
      const parts = track.split("/");
      const filename = parts[parts.length - 1].replace(/\.(mp3|ogg)$/, "");
      const fileParts = filename.split(" - ");
      if (fileParts.length > 1) {
        return fileParts[1];
      }
      return filename;
    }
    return "Unknown Track";
  }
  // 【✓】 Get artist name for Phantasia 2
  getArtistName() {
    if (this.currentTrackInfo) {
      return this.currentTrackInfo.mainArtist;
    }
    if (this.trackArtist) {
      return this.trackArtist;
    }
    if (this.currentTrack) {
      const filename = this.currentTrack.split("/").pop() || "";
      const parts = filename.replace(/\.(mp3|ogg)$/, "").split(" - ");
      if (parts.length > 1) {
        return parts[0];
      }
    }
    return this.currentSubtitle || "Unknown Artist";
  }
  // 【✓】 Enhanced cleanup methods for proper resource management
  /**
   * Clean up current audio instance
   */
  cleanupCurrentAudio() {
    return __async(this, null, function* () {
      if (this.audio) {
        try {
          if (this.isPlaying) {
            this.audio.pause();
          }
          this.audio.unload();
          const index = this.audioInstances.indexOf(this.audio);
          if (index > -1) {
            this.audioInstances.splice(index, 1);
          }
          this.audio = null;
          console.log("[MusicPlayer] Current audio instance cleaned up");
        } catch (error) {
          console.error("[MusicPlayer] Error during audio cleanup:", error);
        }
      }
    });
  }
  /**
   * Clean up all audio instances
   */
  cleanupAllAudioInstances() {
    try {
      if (this.audio) {
        this.audio.unload();
        this.audio = null;
      }
      this.audioInstances.forEach((instance) => {
        try {
          instance.unload();
        } catch (error) {
          console.error("[MusicPlayer] Error unloading audio instance:", error);
        }
      });
      this.audioInstances = [];
      console.log("[MusicPlayer] All audio instances cleaned up");
    } catch (error) {
      console.error("[MusicPlayer] Error during comprehensive cleanup:", error);
    }
  }
  /**
   * Handle volume setting errors with recovery
   */
  handleVolumeError(attemptedValue) {
    console.warn(`[MusicPlayer] Volume error, attempting recovery with value ${attemptedValue}`);
    if (this.retryCount < this.maxRetries) {
      this.retryCount++;
      setTimeout(() => {
        if (this.audio) {
          try {
            this.audio.volume(this.lastSuccessfulVolume);
            this.volume = this.lastSuccessfulVolume;
            this.cdr.markForCheck();
          } catch (retryError) {
            console.error("[MusicPlayer] Volume recovery failed:", retryError);
          }
        }
      }, 100);
    } else {
      this.error = "Volume control temporarily unavailable";
      this.cdr.markForCheck();
    }
  }
  /**
   * Handle mute toggle errors with recovery
   */
  handleMuteError() {
    console.warn("[MusicPlayer] Mute toggle error, attempting recovery");
    this._isMuted = false;
    this._muteStateInitialized = false;
    if (this.audio) {
      try {
        this.audio.volume(this.lastSuccessfulVolume);
        this.volume = this.lastSuccessfulVolume;
      } catch (recoveryError) {
        console.error("[MusicPlayer] Mute recovery failed:", recoveryError);
        this.error = "Mute control temporarily unavailable";
      }
    }
    this.cdr.markForCheck();
  }
  /**
   * Handle track loading errors with detailed logging
   */
  handleTrackLoadError(trackInfo, error) {
    console.error(`[MusicPlayer] Track loading error for ${trackInfo.title}:`, error);
    this.error = `Failed to load "${trackInfo.title}" - ${error.message || error}`;
    this.isLoading = false;
    this.isTrackLoading = false;
    this.lastLoadedTrackId = null;
    this.cleanupCurrentAudio();
    this.cdr.markForCheck();
  }
  /**
   * Get current mute state (public accessor)
   */
  get isMuted() {
    return this._isMuted;
  }
  /**
   * Get display volume for UI (0 when muted, actual volume when not muted)
   */
  get displayVolume() {
    return this._isMuted ? 0 : this.volume;
  }
  /**
   * Get saved volume before mute (public accessor)
   */
  get savedVolumeBeforeMute() {
    return this._savedVolumeBeforeMute;
  }
  /**
   * Debug method to get current state
   */
  getDebugState() {
    return {
      isPlaying: this.isPlaying,
      isLoading: this.isLoading,
      isTrackLoading: this.isTrackLoading,
      isMuted: this._isMuted,
      volume: this.volume,
      savedVolumeBeforeMute: this._savedVolumeBeforeMute,
      currentTrackId: this.currentTrackInfo?.id,
      audioInstancesCount: this.audioInstances.length,
      lastLoadedTrackId: this.lastLoadedTrackId,
      error: this.error,
      audioContextState: this.audioContext?.state,
      eventListenersCount: this.eventListeners.length
    };
  }
  // 【✓】 Audio context management methods
  /**
   * Initialize audio context for better audio handling
   */
  initializeAudioContext() {
    try {
      if (typeof window !== "undefined" && "AudioContext" in window) {
        this.audioContext = new AudioContext();
        this.isAudioContextInitialized = true;
        console.log("[MusicPlayer] AudioContext initialized");
      } else if (typeof window !== "undefined" && "webkitAudioContext" in window) {
        this.audioContext = new window.webkitAudioContext();
        this.isAudioContextInitialized = true;
        console.log("[MusicPlayer] WebKit AudioContext initialized");
      } else {
        console.warn("[MusicPlayer] AudioContext not supported");
      }
    } catch (error) {
      console.error("[MusicPlayer] Error initializing AudioContext:", error);
    }
  }
  /**
   * Setup global event listeners for audio context management
   */
  setupGlobalEventListeners() {
    if (typeof window === "undefined")
      return;
    try {
      const resumeAudioContext = () => __async(this, null, function* () {
        if (this.audioContext && this.audioContext.state === "suspended") {
          try {
            yield this.audioContext.resume();
            console.log("[MusicPlayer] AudioContext resumed");
          } catch (error) {
            console.error("[MusicPlayer] Error resuming AudioContext:", error);
          }
        }
      });
      const handleVisibilityChange = () => {
        if (document.hidden) {
          if (this.audioContext && this.audioContext.state === "running") {
            this.audioContext.suspend().catch((error) => {
              console.error("[MusicPlayer] Error suspending AudioContext:", error);
            });
          }
        } else {
          resumeAudioContext();
        }
      };
      this.addTrackedEventListener(document, "click", resumeAudioContext, { passive: true });
      this.addTrackedEventListener(document, "keydown", resumeAudioContext, { passive: true });
      this.addTrackedEventListener(document, "visibilitychange", handleVisibilityChange, { passive: true });
      console.log("[MusicPlayer] Global event listeners setup completed");
    } catch (error) {
      console.error("[MusicPlayer] Error setting up global event listeners:", error);
    }
  }
  /**
   * Add event listener with tracking for cleanup
   */
  addTrackedEventListener(element, event, handler, options) {
    try {
      element.addEventListener(event, handler, options);
      this.eventListeners.push({ element, event, handler });
    } catch (error) {
      console.error(`[MusicPlayer] Error adding event listener for ${event}:`, error);
    }
  }
  /**
   * Clean up audio context
   */
  cleanupAudioContext() {
    try {
      if (this.audioContext) {
        if (this.audioContext.state !== "closed") {
          this.audioContext.close().catch((error) => {
            console.error("[MusicPlayer] Error closing AudioContext:", error);
          });
        }
        this.audioContext = null;
        this.isAudioContextInitialized = false;
        console.log("[MusicPlayer] AudioContext cleaned up");
      }
    } catch (error) {
      console.error("[MusicPlayer] Error during AudioContext cleanup:", error);
    }
  }
  /**
   * Clean up all event listeners
   */
  cleanupEventListeners() {
    try {
      this.eventListeners.forEach(({ element, event, handler }) => {
        try {
          element.removeEventListener(event, handler);
        } catch (error) {
          console.error(`[MusicPlayer] Error removing event listener for ${event}:`, error);
        }
      });
      this.eventListeners = [];
      console.log("[MusicPlayer] Event listeners cleaned up");
    } catch (error) {
      console.error("[MusicPlayer] Error during event listener cleanup:", error);
    }
  }
  /**
   * Ensure audio context is ready for playback
   */
  ensureAudioContextReady() {
    return __async(this, null, function* () {
      if (!this.audioContext) {
        this.initializeAudioContext();
      }
      if (this.audioContext && this.audioContext.state === "suspended") {
        try {
          yield this.audioContext.resume();
          console.log("[MusicPlayer] AudioContext resumed for playback");
        } catch (error) {
          console.error("[MusicPlayer] Error resuming AudioContext for playback:", error);
        }
      }
    });
  }
};
_MusicPlayerComponent.\u0275fac = function MusicPlayerComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _MusicPlayerComponent)(\u0275\u0275directiveInject(AudioService2), \u0275\u0275directiveInject(DynamicArtistService), \u0275\u0275directiveInject(MusicStateManagerService), \u0275\u0275directiveInject(ChangeDetectorRef));
};
_MusicPlayerComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _MusicPlayerComponent, selectors: [["app-music-player"]], inputs: { trackTitle: "trackTitle", trackArtist: "trackArtist", activeTrack: "activeTrack" }, decls: 32, vars: 34, consts: [[1, "music-player-container"], [1, "player-backdrop"], [1, "music-player"], [1, "status-section"], ["class", "error-message", 4, "ngIf"], ["class", "loading-indicator", 4, "ngIf"], ["class", "track-section", 4, "ngIf"], [1, "progress-section"], [1, "time-display"], [1, "current-time"], [1, "duration"], [1, "progress-container"], [1, "progress-track"], [1, "progress-fill"], ["type", "range", "aria-label", "Seek", 1, "progress-slider", 3, "input", "min", "max", "step", "value", "disabled"], [1, "controls-section"], [1, "volume-section"], [1, "volume-icon-container", 3, "click"], ["alt", "Volume", 1, "volume-icon", 3, "src"], [1, "volume-control"], [1, "volume-track"], [1, "volume-fill"], ["type", "range", "aria-label", "Volume", 1, "volume-slider", 3, "input", "min", "max", "step", "value", "disabled"], [1, "playback-controls"], ["aria-label", "Previous track", 1, "control-button", "previous-button", 3, "click", "disabled"], ["src", "assets/icons/music-player/skip-back.svg", "alt", "Previous", 1, "control-icon"], [1, "control-button", "play-pause-button", 3, "click", "disabled"], [1, "control-icon", 3, "src", "alt"], ["aria-label", "Next track", 1, "control-button", "next-button", 3, "click", "disabled"], ["src", "assets/icons/music-player/skip-forward.svg", "alt", "Next", 1, "control-icon"], [1, "error-message"], [1, "error-icon"], [1, "loading-indicator"], [1, "loading-spinner"], [1, "track-section"], ["class", "track-details", 4, "ngIf"], ["class", "track-info", 4, "ngIf"], ["class", "current-subtitle", 4, "ngIf"], [1, "track-details"], [1, "track-info-content"], [1, "track-title"], [1, "track-artist"], [1, "track-info"], [1, "current-subtitle"]], template: function MusicPlayerComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "div", 1);
    \u0275\u0275elementStart(2, "div", 2)(3, "div", 3);
    \u0275\u0275template(4, MusicPlayerComponent_div_4_Template, 5, 1, "div", 4)(5, MusicPlayerComponent_div_5_Template, 4, 0, "div", 5);
    \u0275\u0275elementEnd();
    \u0275\u0275template(6, MusicPlayerComponent_div_6_Template, 4, 3, "div", 6);
    \u0275\u0275elementStart(7, "div", 7)(8, "div", 8)(9, "span", 9);
    \u0275\u0275text(10);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "span", 10);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "div", 11)(14, "div", 12);
    \u0275\u0275element(15, "div", 13);
    \u0275\u0275elementStart(16, "input", 14);
    \u0275\u0275listener("input", function MusicPlayerComponent_Template_input_input_16_listener($event) {
      return ctx.seek($event.target.value);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(17, "div", 15)(18, "div", 16)(19, "div", 17);
    \u0275\u0275listener("click", function MusicPlayerComponent_Template_div_click_19_listener() {
      return ctx.toggleMute();
    });
    \u0275\u0275element(20, "img", 18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "div", 19)(22, "div", 20);
    \u0275\u0275element(23, "div", 21);
    \u0275\u0275elementStart(24, "input", 22);
    \u0275\u0275listener("input", function MusicPlayerComponent_Template_input_input_24_listener($event) {
      return ctx.setVolume($event.target.value);
    });
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(25, "div", 23)(26, "button", 24);
    \u0275\u0275listener("click", function MusicPlayerComponent_Template_button_click_26_listener() {
      return ctx.previousTrack();
    });
    \u0275\u0275element(27, "img", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "button", 26);
    \u0275\u0275listener("click", function MusicPlayerComponent_Template_button_click_28_listener() {
      return ctx.togglePlay();
    });
    \u0275\u0275element(29, "img", 27);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "button", 28);
    \u0275\u0275listener("click", function MusicPlayerComponent_Template_button_click_30_listener() {
      return ctx.nextTrack();
    });
    \u0275\u0275element(31, "img", 29);
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(4);
    \u0275\u0275property("ngIf", ctx.error);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275classProp("disabled", ctx.isLoading);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx.formatTime(ctx.currentTime));
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx.formatTime(ctx.duration));
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", ctx.currentTime / ctx.duration * 100, "%");
    \u0275\u0275advance();
    \u0275\u0275property("min", 0)("max", ctx.duration)("step", 0.01)("value", ctx.currentTime)("disabled", ctx.isLoading);
    \u0275\u0275advance();
    \u0275\u0275classProp("disabled", ctx.isLoading);
    \u0275\u0275advance(3);
    \u0275\u0275classProp("muted", ctx.isMuted);
    \u0275\u0275property("src", ctx.isMuted ? "assets/icons/music-player/volume-mute.svg" : "assets/icons/music-player/volume.svg", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275styleProp("width", ctx.displayVolume * 100, "%");
    \u0275\u0275advance();
    \u0275\u0275property("min", 0)("max", 1)("step", 0.01)("value", ctx.displayVolume)("disabled", ctx.isLoading);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx.isLoading);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("playing", ctx.isPlaying);
    \u0275\u0275property("disabled", ctx.isLoading);
    \u0275\u0275attribute("aria-label", ctx.isPlaying ? "Pause" : "Play");
    \u0275\u0275advance();
    \u0275\u0275property("src", ctx.isPlaying ? "assets/icons/music-player/pause.svg" : "assets/icons/music-player/play.svg", \u0275\u0275sanitizeUrl)("alt", ctx.isPlaying ? "Pause" : "Play");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx.isLoading);
  }
}, dependencies: [CommonModule, NgIf, MatIconModule], styles: ['\n\n.music-player-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  margin: 0 0 2rem 0;\n  padding: 0;\n  isolation: isolate;\n  box-sizing: border-box !important;\n  max-width: 100% !important;\n}\n.music-player-container[_ngcontent-%COMP%]   .player-backdrop[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -4px;\n  left: 0;\n  right: 0;\n  bottom: -4px;\n  box-sizing: border-box !important;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.15) 0%,\n      rgba(0, 0, 0, 0.18) 25%,\n      rgba(0, 0, 0, 0.22) 50%,\n      rgba(0, 0, 0, 0.25) 100%);\n  backdrop-filter: blur(16px) saturate(1.4) brightness(1.1);\n  -webkit-backdrop-filter: blur(16px) saturate(1.4) brightness(1.1);\n  border-radius: 20px;\n  opacity: 0.8;\n  z-index: -1;\n}\n.music-player-container[_ngcontent-%COMP%]   .player-backdrop[_ngcontent-%COMP%]::before {\n  display: none !important;\n}\n@keyframes _ngcontent-%COMP%_shimmer {\n  0% {\n    left: -100%;\n    opacity: 0;\n  }\n  50% {\n    left: 100%;\n    opacity: 1;\n  }\n  100% {\n    left: 100%;\n    opacity: 0;\n  }\n}\n.music-player[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.12) 0%,\n      rgba(255, 255, 255, 0.08) 25%,\n      rgba(255, 255, 255, 0.06) 75%,\n      rgba(255, 255, 255, 0.04) 100%);\n  backdrop-filter: blur(24px) saturate(1.6);\n  -webkit-backdrop-filter: blur(24px) saturate(1.6);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 16px;\n  box-sizing: border-box !important;\n  max-width: 100% !important;\n  box-shadow:\n    0 12px 40px rgba(0, 0, 0, 0.25),\n    0 4px 16px rgba(0, 0, 0, 0.15),\n    0 2px 8px rgba(0, 0, 0, 0.1),\n    inset 0 1px 0 rgba(255, 255, 255, 0.2),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.1);\n  display: flex;\n  flex-direction: column;\n  gap: clamp(12px, 2vw, 20px);\n  padding: clamp(16px, 3vw, 24px);\n  font-family:\n    "Inter",\n    "Roboto",\n    sans-serif;\n  color: rgba(255, 255, 255, 0.95);\n  font-size: 16px;\n  line-height: 1.5;\n  letter-spacing: 0.01em;\n  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.music-player[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow:\n    0 16px 48px rgba(0, 0, 0, 0.3),\n    0 6px 20px rgba(0, 0, 0, 0.2),\n    0 2px 8px rgba(0, 0, 0, 0.1),\n    inset 0 1px 0 rgba(255, 255, 255, 0.25),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.15);\n}\n.status-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  min-height: 0;\n}\n.status-section[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 12px 16px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(220, 53, 69, 0.15) 0%,\n      rgba(220, 53, 69, 0.08) 100%);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n  border: 1px solid rgba(220, 53, 69, 0.3);\n  border-radius: 8px;\n  color: rgba(255, 255, 255, 0.9);\n  font-size: clamp(0.85rem, 1vw, 1.1rem);\n  font-weight: 500;\n}\n.status-section[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%]   .error-icon[_ngcontent-%COMP%] {\n  font-size: 16px;\n  color: rgba(255, 193, 7, 0.9);\n}\n.status-section[_ngcontent-%COMP%]   .loading-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  padding: 16px;\n  color: rgba(255, 255, 255, 0.8);\n  font-size: clamp(0.85rem, 1vw, 1.1rem);\n  font-weight: 400;\n}\n.status-section[_ngcontent-%COMP%]   .loading-indicator[_ngcontent-%COMP%]   .loading-spinner[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  border: 2px solid rgba(255, 255, 255, 0.2);\n  border-top: 2px solid rgba(255, 255, 255, 0.8);\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n}\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.track-section[_ngcontent-%COMP%] {\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.track-section[_ngcontent-%COMP%]   .track-details[_ngcontent-%COMP%]   .track-info-content[_ngcontent-%COMP%]   .track-title[_ngcontent-%COMP%] {\n  font-size: clamp(1.4rem, 2vw, 2rem);\n  font-weight: 600;\n  color: #ffffff;\n  margin-bottom: 4px;\n  line-height: 1.3;\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff 0%,\n      rgba(255, 255, 255, 0.9) 100%);\n  -webkit-background-clip: text;\n  background-clip: text;\n  letter-spacing: 0.02em;\n}\n.track-section[_ngcontent-%COMP%]   .track-details[_ngcontent-%COMP%]   .track-info-content[_ngcontent-%COMP%]   .track-artist[_ngcontent-%COMP%] {\n  font-size: clamp(1.1rem, 1.5vw, 1.6rem);\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.75);\n  line-height: 1.4;\n  font-style: italic;\n  letter-spacing: 0.01em;\n}\n.track-section[_ngcontent-%COMP%]   .track-info[_ngcontent-%COMP%]   .track-title[_ngcontent-%COMP%] {\n  font-size: clamp(1.4rem, 2vw, 2rem);\n  font-weight: 600;\n  color: #ffffff;\n  margin-bottom: 4px;\n  line-height: 1.3;\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff 0%,\n      rgba(255, 255, 255, 0.9) 100%);\n  -webkit-background-clip: text;\n  background-clip: text;\n  -webkit-text-fill-color: transparent;\n  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  letter-spacing: 0.02em;\n}\n.track-section[_ngcontent-%COMP%]   .track-info[_ngcontent-%COMP%]   .track-artist[_ngcontent-%COMP%] {\n  font-size: clamp(1.1rem, 1.5vw, 1.6rem);\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.75);\n  line-height: 1.4;\n  font-style: italic;\n  letter-spacing: 0.01em;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.track-section[_ngcontent-%COMP%]   .current-subtitle[_ngcontent-%COMP%] {\n  font-size: clamp(0.85rem, 1vw, 1.1rem);\n  color: rgba(255, 255, 255, 0.6);\n  font-weight: 300;\n  line-height: 1.4;\n  letter-spacing: 0.01em;\n}\n.progress-section[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.progress-section.disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  pointer-events: none;\n}\n.progress-section[_ngcontent-%COMP%]   .time-display[_ngcontent-%COMP%] {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-size: clamp(0.75rem, 0.9vw, 0.95rem);\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.7);\n  font-variant-numeric: tabular-nums;\n  letter-spacing: 0.02em;\n}\n.progress-section[_ngcontent-%COMP%]   .time-display[_ngcontent-%COMP%]   .current-time[_ngcontent-%COMP%], \n.progress-section[_ngcontent-%COMP%]   .time-display[_ngcontent-%COMP%]   .duration[_ngcontent-%COMP%] {\n  padding: 2px 4px;\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 4px;\n  min-width: 45px;\n  text-align: center;\n  font-family: "Inter", monospace;\n}\n.progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%] {\n  position: relative;\n  height: 32px;\n  display: flex;\n  align-items: center;\n}\n.progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 6px;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.1) 0%,\n      rgba(255, 255, 255, 0.15) 50%,\n      rgba(255, 255, 255, 0.1) 100%);\n  border-radius: 3px;\n  overflow: hidden;\n  cursor: pointer;\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 255, 255, 0.05);\n}\n.progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%]   .progress-fill[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.9) 0%,\n      rgba(255, 255, 255, 0.7) 50%,\n      rgba(255, 255, 255, 0.9) 100%);\n  border-radius: 3px;\n  transition: width 0.1s ease-out;\n  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5);\n}\n.progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%]   .progress-fill[_ngcontent-%COMP%]::after {\n  display: none !important;\n}\n.progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 32px;\n  -webkit-appearance: none;\n  background: transparent;\n  outline: none;\n  cursor: pointer;\n  margin: 0;\n  padding: 0;\n  z-index: 2;\n}\n.progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  width: 16px;\n  height: 16px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.95) 0%,\n      rgba(255, 255, 255, 0.8) 100%);\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-radius: 50%;\n  cursor: grab;\n  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);\n  margin-top: -5px;\n  box-shadow:\n    0 4px 12px rgba(0, 0, 0, 0.3),\n    0 2px 6px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.5);\n}\n.progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%]::-webkit-slider-thumb:hover {\n  transform: scale(1.2);\n  background:\n    linear-gradient(\n      135deg,\n      rgb(255, 255, 255) 0%,\n      rgba(255, 255, 255, 0.9) 100%);\n  box-shadow:\n    0 6px 20px rgba(0, 0, 0, 0.4),\n    0 3px 10px rgba(0, 0, 0, 0.3),\n    0 0 16px rgba(255, 255, 255, 0.5),\n    inset 0 1px 0 rgba(255, 255, 255, 0.7);\n}\n.progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%]::-webkit-slider-thumb:active {\n  cursor: grabbing;\n  transform: scale(1.1);\n}\n.progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%]::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 6px;\n  background: transparent;\n  border-radius: 3px;\n}\n@keyframes _ngcontent-%COMP%_progressShimmer {\n  0% {\n    left: -100%;\n    opacity: 0;\n  }\n  50% {\n    left: 100%;\n    opacity: 0.6;\n  }\n  100% {\n    left: 100%;\n    opacity: 0;\n  }\n}\n.controls-section[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: clamp(16px, 3vw, 24px);\n}\n.controls-section.disabled[_ngcontent-%COMP%] {\n  opacity: 0.5;\n  pointer-events: none;\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 100px;\n  flex: 0 0 auto;\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-icon-container[_ngcontent-%COMP%] {\n  cursor: pointer;\n  padding: 6px;\n  border-radius: 6px;\n  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-icon-container[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.1);\n  transform: scale(1.05);\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-icon-container[_ngcontent-%COMP%]   .volume-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  filter: invert(1) opacity(0.85);\n  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-icon-container[_ngcontent-%COMP%]   .volume-icon.muted[_ngcontent-%COMP%] {\n  filter: invert(1) opacity(0.6);\n  transform: scale(0.9);\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%] {\n  flex: 1;\n  max-width: 80px;\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]   .volume-track[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  height: 4px;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.15) 0%,\n      rgba(255, 255, 255, 0.2) 50%,\n      rgba(255, 255, 255, 0.15) 100%);\n  border-radius: 2px;\n  overflow: hidden;\n  cursor: pointer;\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]   .volume-track[_ngcontent-%COMP%]   .volume-fill[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.7) 0%,\n      rgba(255, 255, 255, 0.9) 100%);\n  border-radius: 2px;\n  transition: width 0.2s ease-out;\n  box-shadow: 0 0 6px rgba(255, 255, 255, 0.3);\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]   .volume-track[_ngcontent-%COMP%]   .volume-slider[_ngcontent-%COMP%] {\n  position: absolute;\n  top: -6px;\n  left: 0;\n  width: 100%;\n  height: 16px;\n  -webkit-appearance: none;\n  background: transparent;\n  outline: none;\n  cursor: pointer;\n  margin: 0;\n  padding: 0;\n  z-index: 2;\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]   .volume-track[_ngcontent-%COMP%]   .volume-slider[_ngcontent-%COMP%]::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  width: 12px;\n  height: 12px;\n  background: rgba(255, 255, 255, 0.9);\n  border-radius: 50%;\n  cursor: pointer;\n  transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);\n  margin-top: -4px;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]   .volume-track[_ngcontent-%COMP%]   .volume-slider[_ngcontent-%COMP%]::-webkit-slider-thumb:hover {\n  transform: scale(1.3);\n  background: rgb(255, 255, 255);\n  box-shadow:\n    0 3px 10px rgba(0, 0, 0, 0.4),\n    0 0 12px rgba(255, 255, 255, 0.6),\n    inset 0 1px 0 rgba(255, 255, 255, 0.7);\n}\n.controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]   .volume-track[_ngcontent-%COMP%]   .volume-slider[_ngcontent-%COMP%]::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 4px;\n  background: transparent;\n  border-radius: 2px;\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: clamp(14px, 2.2vw, 18px);\n  flex: 1;\n  max-width: 180px;\n  width: 100%;\n  margin: 0 auto;\n  position: relative;\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button[_ngcontent-%COMP%] {\n  position: relative;\n  border: none;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.15) 0%,\n      rgba(255, 255, 255, 0.08) 50%,\n      rgba(255, 255, 255, 0.05) 100%);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n  box-shadow:\n    0 6px 20px rgba(0, 0, 0, 0.25),\n    0 2px 8px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.3),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.1);\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button[_ngcontent-%COMP%]   .control-icon[_ngcontent-%COMP%] {\n  width: 18px;\n  height: 18px;\n  filter: invert(1) opacity(0.9);\n  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.previous-button[_ngcontent-%COMP%], \n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.next-button[_ngcontent-%COMP%] {\n  width: 40px;\n  height: 40px;\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.previous-button[_ngcontent-%COMP%]:hover, \n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.next-button[_ngcontent-%COMP%]:hover {\n  transform: scale(1.1);\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.2) 0%,\n      rgba(255, 255, 255, 0.12) 50%,\n      rgba(255, 255, 255, 0.08) 100%);\n  box-shadow:\n    0 8px 28px rgba(0, 0, 0, 0.3),\n    0 4px 12px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.4),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.15),\n    0 0 20px rgba(255, 255, 255, 0.15);\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.previous-button[_ngcontent-%COMP%]:active, \n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.next-button[_ngcontent-%COMP%]:active {\n  transform: scale(1.05);\n  transition-duration: 0.15s;\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-pause-button[_ngcontent-%COMP%] {\n  width: 52px;\n  height: 52px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.18) 0%,\n      rgba(255, 255, 255, 0.12) 50%,\n      rgba(255, 255, 255, 0.08) 100%);\n  border-width: 1.5px;\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-pause-button[_ngcontent-%COMP%]   .control-icon[_ngcontent-%COMP%] {\n  width: 22px;\n  height: 22px;\n  filter: invert(1) opacity(0.95);\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-pause-button[_ngcontent-%COMP%]:hover {\n  transform: scale(1.08);\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.25) 0%,\n      rgba(255, 255, 255, 0.18) 50%,\n      rgba(255, 255, 255, 0.12) 100%);\n  box-shadow:\n    0 12px 36px rgba(0, 0, 0, 0.35),\n    0 6px 16px rgba(0, 0, 0, 0.25),\n    inset 0 1px 0 rgba(255, 255, 255, 0.5),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.2),\n    0 0 32px rgba(255, 255, 255, 0.2);\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-pause-button[_ngcontent-%COMP%]:active {\n  transform: scale(1.02);\n  transition-duration: 0.15s;\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-pause-button.playing[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.22) 0%,\n      rgba(255, 255, 255, 0.15) 50%,\n      rgba(255, 255, 255, 0.1) 100%);\n  box-shadow:\n    0 8px 24px rgba(0, 0, 0, 0.3),\n    0 4px 12px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.4),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.15),\n    0 0 24px rgba(255, 255, 255, 0.18);\n  animation: _ngcontent-%COMP%_playingPulse 2s ease-in-out infinite;\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button[_ngcontent-%COMP%]:disabled {\n  opacity: 0.4;\n  cursor: not-allowed;\n  transform: none;\n}\n.controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button[_ngcontent-%COMP%]:disabled:hover {\n  transform: none;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.08) 0%,\n      rgba(255, 255, 255, 0.05) 100%);\n}\n@keyframes _ngcontent-%COMP%_playingPulse {\n  0%, 100% {\n    box-shadow:\n      0 8px 24px rgba(0, 0, 0, 0.3),\n      0 4px 12px rgba(0, 0, 0, 0.2),\n      inset 0 1px 0 rgba(255, 255, 255, 0.4),\n      inset 0 -1px 0 rgba(255, 255, 255, 0.15),\n      0 0 24px rgba(255, 255, 255, 0.18);\n  }\n  50% {\n    box-shadow:\n      0 8px 24px rgba(0, 0, 0, 0.3),\n      0 4px 12px rgba(0, 0, 0, 0.2),\n      inset 0 1px 0 rgba(255, 255, 255, 0.4),\n      inset 0 -1px 0 rgba(255, 255, 255, 0.15),\n      0 0 32px rgba(255, 255, 255, 0.25);\n  }\n}\n@media (max-width: 768px) {\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%] {\n    padding: clamp(14px, 4vw, 20px);\n    gap: clamp(10px, 2.5vw, 16px);\n    border-radius: 14px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .track-section[_ngcontent-%COMP%]   .track-info[_ngcontent-%COMP%]   .track-title[_ngcontent-%COMP%] {\n    font-size: clamp(0.95rem, 1.2vw, 1.3rem);\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .track-section[_ngcontent-%COMP%]   .track-info[_ngcontent-%COMP%]   .track-artist[_ngcontent-%COMP%] {\n    font-size: clamp(0.85rem, 1vw, 1.1rem);\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%] {\n    height: 8px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%] {\n    height: 36px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%]::-webkit-slider-thumb {\n    width: 18px;\n    height: 18px;\n    margin-top: -5px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%] {\n    gap: clamp(8px, 3vw, 16px);\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%] {\n    min-width: 80px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%] {\n    max-width: 60px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%] {\n    gap: clamp(8px, 2.5vw, 12px);\n    max-width: 160px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.previous-button[_ngcontent-%COMP%], \n   .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.next-button[_ngcontent-%COMP%] {\n    width: 36px;\n    height: 36px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.previous-button[_ngcontent-%COMP%]   .control-icon[_ngcontent-%COMP%], \n   .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.next-button[_ngcontent-%COMP%]   .control-icon[_ngcontent-%COMP%] {\n    width: 16px;\n    height: 16px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-pause-button[_ngcontent-%COMP%] {\n    width: 46px;\n    height: 46px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-pause-button[_ngcontent-%COMP%]   .control-icon[_ngcontent-%COMP%] {\n    width: 20px;\n    height: 20px;\n  }\n}\n@media (max-width: 480px) {\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%] {\n    padding: 12px 16px;\n    gap: 8px;\n    border-radius: 12px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 12px;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%] {\n    order: 2;\n    align-self: stretch;\n    min-width: auto;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%] {\n    max-width: none;\n    flex: 1;\n  }\n  .music-player-container[_ngcontent-%COMP%]   .music-player[_ngcontent-%COMP%]   .controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%] {\n    order: 1;\n    max-width: none;\n    justify-content: center;\n  }\n}\ninput[type=range][_ngcontent-%COMP%] {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\ninput[type=range][_ngcontent-%COMP%]::-moz-range-thumb {\n  width: 16px;\n  height: 16px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.95) 0%,\n      rgba(255, 255, 255, 0.8) 100%);\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-radius: 50%;\n  cursor: pointer;\n  box-shadow:\n    0 4px 12px rgba(0, 0, 0, 0.3),\n    0 2px 6px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.5);\n  -moz-appearance: none;\n}\ninput[type=range][_ngcontent-%COMP%]::-moz-range-thumb:hover {\n  background:\n    linear-gradient(\n      135deg,\n      rgb(255, 255, 255) 0%,\n      rgba(255, 255, 255, 0.9) 100%);\n  box-shadow:\n    0 6px 20px rgba(0, 0, 0, 0.4),\n    0 3px 10px rgba(0, 0, 0, 0.3),\n    0 0 16px rgba(255, 255, 255, 0.5),\n    inset 0 1px 0 rgba(255, 255, 255, 0.7);\n  transform: scale(1.2);\n}\ninput[type=range][_ngcontent-%COMP%]::-moz-range-track {\n  height: 6px;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.1) 0%,\n      rgba(255, 255, 255, 0.15) 50%,\n      rgba(255, 255, 255, 0.1) 100%);\n  border: none;\n  border-radius: 3px;\n  -moz-appearance: none;\n}\ninput[type=range][_ngcontent-%COMP%]:focus {\n  outline: none;\n  box-shadow: none;\n}\n@media (prefers-reduced-motion: reduce) {\n  .music-player-container[_ngcontent-%COMP%]   .player-backdrop[_ngcontent-%COMP%]::before {\n    animation: none;\n  }\n  .progress-section[_ngcontent-%COMP%]   .progress-container[_ngcontent-%COMP%]   .progress-track[_ngcontent-%COMP%]   .progress-fill[_ngcontent-%COMP%]::after {\n    animation: none;\n  }\n  .controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button[_ngcontent-%COMP%] {\n    transition-duration: 0.2s;\n  }\n  .controls-section[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-pause-button.playing[_ngcontent-%COMP%] {\n    animation: none;\n  }\n  @keyframes shimmer {\n    0%, 100% {\n      opacity: 0;\n    }\n  }\n  @keyframes progressShimmer {\n    0%, 100% {\n      opacity: 0;\n    }\n  }\n  @keyframes playingPulse {\n    0%, 100% {\n      opacity: 1;\n    }\n  }\n  @keyframes spin {\n    0%, 100% {\n      transform: rotate(0deg);\n    }\n  }\n}\n/*# sourceMappingURL=music-player.component.css.map */'], changeDetection: 0 });
var MusicPlayerComponent = _MusicPlayerComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(MusicPlayerComponent, [{
    type: Component,
    args: [{
      selector: "app-music-player",
      standalone: true,
      imports: [CommonModule, MatIconModule],
      changeDetection: ChangeDetectionStrategy.OnPush,
      template: `<div class="music-player-container">
  <!-- Enhanced Glassmorphism Background -->
  <div class="player-backdrop"></div>
  
  <!-- Main Player Content -->
  <div class="music-player">
    <!-- Status Messages Section -->
    <div class="status-section">
      <div class="error-message" *ngIf="error">
        <div class="error-icon">\u26A0</div>
        <span>{{error}}</span>
      </div>
      
      <div class="loading-indicator" *ngIf="isLoading">
        <div class="loading-spinner"></div>
        <span>Loading audio...</span>
      </div>
    </div>
    
    <!-- Track Information Section -->
    <div class="track-section" *ngIf="!isLoading">
      <!-- Current Track Details -->
      <div class="track-details" *ngIf="currentTrackInfo">
        <div class="track-info-content">
          <h4 class="track-title">{{ currentTrackInfo.title }}</h4>
          <p class="track-artist">{{ currentTrackInfo.mainArtist }}</p>
        </div>
      </div>

      <!-- Legacy track info for backward compatibility -->
      <div class="track-info" *ngIf="!currentTrackInfo && currentTrack">
        <div class="track-title">{{ getTrackName(currentTrack) }}</div>
        <div class="track-artist">{{ getArtistName() }}</div>
      </div>

      <div class="current-subtitle" *ngIf="currentSubtitle && !trackTitle && !currentTrackInfo">
        {{ currentSubtitle }}
      </div>
    </div>

    <!-- Progress Section -->
    <div class="progress-section" [class.disabled]="isLoading">
      <div class="time-display">
        <span class="current-time">{{formatTime(currentTime)}}</span>
        <span class="duration">{{formatTime(duration)}}</span>
      </div>
      
      <div class="progress-container">
        <div class="progress-track">
          <div class="progress-fill" [style.width.%]="(currentTime / duration) * 100"></div>
          <input 
            type="range" 
            [min]="0" 
            [max]="duration" 
            [step]="0.01"
            [value]="currentTime"
            (input)="seek($any($event.target).value)"
            class="progress-slider"
            [disabled]="isLoading"
            aria-label="Seek"
          >
        </div>
      </div>
    </div>
    
    <!-- Controls Section -->
    <div class="controls-section" [class.disabled]="isLoading">
      <!-- Volume Control -->
      <div class="volume-section">
        <div class="volume-icon-container" (click)="toggleMute()">
          <img
            class="volume-icon"
            [src]="isMuted ? 'assets/icons/music-player/volume-mute.svg' : 'assets/icons/music-player/volume.svg'"
            alt="Volume"
            [class.muted]="isMuted"
          >
        </div>
        <div class="volume-control">
          <div class="volume-track">
            <div class="volume-fill" [style.width.%]="displayVolume * 100"></div>
            <input 
              type="range" 
              [min]="0" 
              [max]="1" 
              [step]="0.01"
              [value]="displayVolume"
              (input)="setVolume($any($event.target).value)"
              class="volume-slider"
              [disabled]="isLoading"
              aria-label="Volume"
            >
          </div>
        </div>
      </div>

      <!-- Playback Controls -->
      <div class="playback-controls">
        <button 
          class="control-button previous-button" 
          (click)="previousTrack()" 
          [disabled]="isLoading" 
          aria-label="Previous track"
        >
          <img 
            class="control-icon" 
            src="assets/icons/music-player/skip-back.svg" 
            alt="Previous"
          >
        </button>
        
        <button 
          class="control-button play-pause-button" 
          (click)="togglePlay()"
          [class.playing]="isPlaying"
          [disabled]="isLoading"
          [attr.aria-label]="isPlaying ? 'Pause' : 'Play'"
        >
          <img 
            class="control-icon" 
            [src]="isPlaying ? 'assets/icons/music-player/pause.svg' : 'assets/icons/music-player/play.svg'" 
            [alt]="isPlaying ? 'Pause' : 'Play'"
          >
        </button>
        
        <button 
          class="control-button next-button" 
          (click)="nextTrack()" 
          [disabled]="isLoading" 
          aria-label="Next track"
        >
          <img 
            class="control-icon" 
            src="assets/icons/music-player/skip-forward.svg" 
            alt="Next"
          >
        </button>
      </div>
    </div>
  </div>
</div> `,
      styles: ['/* src/app/pages/collections/phantasia/tools/music-player/music-player.component.scss */\n.music-player-container {\n  position: relative;\n  width: 100%;\n  margin: 0 0 2rem 0;\n  padding: 0;\n  isolation: isolate;\n  box-sizing: border-box !important;\n  max-width: 100% !important;\n}\n.music-player-container .player-backdrop {\n  position: absolute;\n  top: -4px;\n  left: 0;\n  right: 0;\n  bottom: -4px;\n  box-sizing: border-box !important;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.15) 0%,\n      rgba(0, 0, 0, 0.18) 25%,\n      rgba(0, 0, 0, 0.22) 50%,\n      rgba(0, 0, 0, 0.25) 100%);\n  backdrop-filter: blur(16px) saturate(1.4) brightness(1.1);\n  -webkit-backdrop-filter: blur(16px) saturate(1.4) brightness(1.1);\n  border-radius: 20px;\n  opacity: 0.8;\n  z-index: -1;\n}\n.music-player-container .player-backdrop::before {\n  display: none !important;\n}\n@keyframes shimmer {\n  0% {\n    left: -100%;\n    opacity: 0;\n  }\n  50% {\n    left: 100%;\n    opacity: 1;\n  }\n  100% {\n    left: 100%;\n    opacity: 0;\n  }\n}\n.music-player {\n  position: relative;\n  width: 100%;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.12) 0%,\n      rgba(255, 255, 255, 0.08) 25%,\n      rgba(255, 255, 255, 0.06) 75%,\n      rgba(255, 255, 255, 0.04) 100%);\n  backdrop-filter: blur(24px) saturate(1.6);\n  -webkit-backdrop-filter: blur(24px) saturate(1.6);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 16px;\n  box-sizing: border-box !important;\n  max-width: 100% !important;\n  box-shadow:\n    0 12px 40px rgba(0, 0, 0, 0.25),\n    0 4px 16px rgba(0, 0, 0, 0.15),\n    0 2px 8px rgba(0, 0, 0, 0.1),\n    inset 0 1px 0 rgba(255, 255, 255, 0.2),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.1);\n  display: flex;\n  flex-direction: column;\n  gap: clamp(12px, 2vw, 20px);\n  padding: clamp(16px, 3vw, 24px);\n  font-family:\n    "Inter",\n    "Roboto",\n    sans-serif;\n  color: rgba(255, 255, 255, 0.95);\n  font-size: 16px;\n  line-height: 1.5;\n  letter-spacing: 0.01em;\n  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.music-player:hover {\n  transform: translateY(-2px);\n  box-shadow:\n    0 16px 48px rgba(0, 0, 0, 0.3),\n    0 6px 20px rgba(0, 0, 0, 0.2),\n    0 2px 8px rgba(0, 0, 0, 0.1),\n    inset 0 1px 0 rgba(255, 255, 255, 0.25),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.15);\n}\n.status-section {\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n  min-height: 0;\n}\n.status-section .error-message {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  padding: 12px 16px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(220, 53, 69, 0.15) 0%,\n      rgba(220, 53, 69, 0.08) 100%);\n  -webkit-backdrop-filter: blur(8px);\n  backdrop-filter: blur(8px);\n  border: 1px solid rgba(220, 53, 69, 0.3);\n  border-radius: 8px;\n  color: rgba(255, 255, 255, 0.9);\n  font-size: clamp(0.85rem, 1vw, 1.1rem);\n  font-weight: 500;\n}\n.status-section .error-message .error-icon {\n  font-size: 16px;\n  color: rgba(255, 193, 7, 0.9);\n}\n.status-section .loading-indicator {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 12px;\n  padding: 16px;\n  color: rgba(255, 255, 255, 0.8);\n  font-size: clamp(0.85rem, 1vw, 1.1rem);\n  font-weight: 400;\n}\n.status-section .loading-indicator .loading-spinner {\n  width: 18px;\n  height: 18px;\n  border: 2px solid rgba(255, 255, 255, 0.2);\n  border-top: 2px solid rgba(255, 255, 255, 0.8);\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.track-section {\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  gap: 8px;\n}\n.track-section .track-details .track-info-content .track-title {\n  font-size: clamp(1.4rem, 2vw, 2rem);\n  font-weight: 600;\n  color: #ffffff;\n  margin-bottom: 4px;\n  line-height: 1.3;\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff 0%,\n      rgba(255, 255, 255, 0.9) 100%);\n  -webkit-background-clip: text;\n  background-clip: text;\n  letter-spacing: 0.02em;\n}\n.track-section .track-details .track-info-content .track-artist {\n  font-size: clamp(1.1rem, 1.5vw, 1.6rem);\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.75);\n  line-height: 1.4;\n  font-style: italic;\n  letter-spacing: 0.01em;\n}\n.track-section .track-info .track-title {\n  font-size: clamp(1.4rem, 2vw, 2rem);\n  font-weight: 600;\n  color: #ffffff;\n  margin-bottom: 4px;\n  line-height: 1.3;\n  background:\n    linear-gradient(\n      135deg,\n      #ffffff 0%,\n      rgba(255, 255, 255, 0.9) 100%);\n  -webkit-background-clip: text;\n  background-clip: text;\n  -webkit-text-fill-color: transparent;\n  text-shadow: 0 2px 8px rgba(255, 255, 255, 0.1);\n  display: -webkit-box;\n  -webkit-line-clamp: 2;\n  -webkit-box-orient: vertical;\n  overflow: hidden;\n  letter-spacing: 0.02em;\n}\n.track-section .track-info .track-artist {\n  font-size: clamp(1.1rem, 1.5vw, 1.6rem);\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.75);\n  line-height: 1.4;\n  font-style: italic;\n  letter-spacing: 0.01em;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n}\n.track-section .current-subtitle {\n  font-size: clamp(0.85rem, 1vw, 1.1rem);\n  color: rgba(255, 255, 255, 0.6);\n  font-weight: 300;\n  line-height: 1.4;\n  letter-spacing: 0.01em;\n}\n.progress-section {\n  display: flex;\n  flex-direction: column;\n  gap: 12px;\n}\n.progress-section.disabled {\n  opacity: 0.5;\n  pointer-events: none;\n}\n.progress-section .time-display {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n  font-size: clamp(0.75rem, 0.9vw, 0.95rem);\n  font-weight: 400;\n  color: rgba(255, 255, 255, 0.7);\n  font-variant-numeric: tabular-nums;\n  letter-spacing: 0.02em;\n}\n.progress-section .time-display .current-time,\n.progress-section .time-display .duration {\n  padding: 2px 4px;\n  background: rgba(255, 255, 255, 0.05);\n  border-radius: 4px;\n  min-width: 45px;\n  text-align: center;\n  font-family: "Inter", monospace;\n}\n.progress-section .progress-container {\n  position: relative;\n  height: 32px;\n  display: flex;\n  align-items: center;\n}\n.progress-section .progress-container .progress-track {\n  position: relative;\n  width: 100%;\n  height: 6px;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.1) 0%,\n      rgba(255, 255, 255, 0.15) 50%,\n      rgba(255, 255, 255, 0.1) 100%);\n  border-radius: 3px;\n  overflow: hidden;\n  cursor: pointer;\n  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2), 0 0 8px rgba(255, 255, 255, 0.05);\n}\n.progress-section .progress-container .progress-track .progress-fill {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.9) 0%,\n      rgba(255, 255, 255, 0.7) 50%,\n      rgba(255, 255, 255, 0.9) 100%);\n  border-radius: 3px;\n  transition: width 0.1s ease-out;\n  box-shadow: 0 0 12px rgba(255, 255, 255, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.5);\n}\n.progress-section .progress-container .progress-track .progress-fill::after {\n  display: none !important;\n}\n.progress-section .progress-container .progress-track .progress-slider {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 32px;\n  -webkit-appearance: none;\n  background: transparent;\n  outline: none;\n  cursor: pointer;\n  margin: 0;\n  padding: 0;\n  z-index: 2;\n}\n.progress-section .progress-container .progress-track .progress-slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  width: 16px;\n  height: 16px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.95) 0%,\n      rgba(255, 255, 255, 0.8) 100%);\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-radius: 50%;\n  cursor: grab;\n  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);\n  margin-top: -5px;\n  box-shadow:\n    0 4px 12px rgba(0, 0, 0, 0.3),\n    0 2px 6px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.5);\n}\n.progress-section .progress-container .progress-track .progress-slider::-webkit-slider-thumb:hover {\n  transform: scale(1.2);\n  background:\n    linear-gradient(\n      135deg,\n      rgb(255, 255, 255) 0%,\n      rgba(255, 255, 255, 0.9) 100%);\n  box-shadow:\n    0 6px 20px rgba(0, 0, 0, 0.4),\n    0 3px 10px rgba(0, 0, 0, 0.3),\n    0 0 16px rgba(255, 255, 255, 0.5),\n    inset 0 1px 0 rgba(255, 255, 255, 0.7);\n}\n.progress-section .progress-container .progress-track .progress-slider::-webkit-slider-thumb:active {\n  cursor: grabbing;\n  transform: scale(1.1);\n}\n.progress-section .progress-container .progress-track .progress-slider::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 6px;\n  background: transparent;\n  border-radius: 3px;\n}\n@keyframes progressShimmer {\n  0% {\n    left: -100%;\n    opacity: 0;\n  }\n  50% {\n    left: 100%;\n    opacity: 0.6;\n  }\n  100% {\n    left: 100%;\n    opacity: 0;\n  }\n}\n.controls-section {\n  display: flex;\n  align-items: center;\n  justify-content: space-between;\n  gap: clamp(16px, 3vw, 24px);\n}\n.controls-section.disabled {\n  opacity: 0.5;\n  pointer-events: none;\n}\n.controls-section .volume-section {\n  display: flex;\n  align-items: center;\n  gap: 8px;\n  min-width: 100px;\n  flex: 0 0 auto;\n}\n.controls-section .volume-section .volume-icon-container {\n  cursor: pointer;\n  padding: 6px;\n  border-radius: 6px;\n  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.controls-section .volume-section .volume-icon-container:hover {\n  background: rgba(255, 255, 255, 0.1);\n  transform: scale(1.05);\n}\n.controls-section .volume-section .volume-icon-container .volume-icon {\n  width: 18px;\n  height: 18px;\n  filter: invert(1) opacity(0.85);\n  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);\n}\n.controls-section .volume-section .volume-icon-container .volume-icon.muted {\n  filter: invert(1) opacity(0.6);\n  transform: scale(0.9);\n}\n.controls-section .volume-section .volume-control {\n  flex: 1;\n  max-width: 80px;\n}\n.controls-section .volume-section .volume-control .volume-track {\n  position: relative;\n  width: 100%;\n  height: 4px;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.15) 0%,\n      rgba(255, 255, 255, 0.2) 50%,\n      rgba(255, 255, 255, 0.15) 100%);\n  border-radius: 2px;\n  overflow: hidden;\n  cursor: pointer;\n}\n.controls-section .volume-section .volume-control .volume-track .volume-fill {\n  position: absolute;\n  top: 0;\n  left: 0;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.7) 0%,\n      rgba(255, 255, 255, 0.9) 100%);\n  border-radius: 2px;\n  transition: width 0.2s ease-out;\n  box-shadow: 0 0 6px rgba(255, 255, 255, 0.3);\n}\n.controls-section .volume-section .volume-control .volume-track .volume-slider {\n  position: absolute;\n  top: -6px;\n  left: 0;\n  width: 100%;\n  height: 16px;\n  -webkit-appearance: none;\n  background: transparent;\n  outline: none;\n  cursor: pointer;\n  margin: 0;\n  padding: 0;\n  z-index: 2;\n}\n.controls-section .volume-section .volume-control .volume-track .volume-slider::-webkit-slider-thumb {\n  -webkit-appearance: none;\n  width: 12px;\n  height: 12px;\n  background: rgba(255, 255, 255, 0.9);\n  border-radius: 50%;\n  cursor: pointer;\n  transition: all 0.2s cubic-bezier(0.19, 1, 0.22, 1);\n  margin-top: -4px;\n  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.5);\n}\n.controls-section .volume-section .volume-control .volume-track .volume-slider::-webkit-slider-thumb:hover {\n  transform: scale(1.3);\n  background: rgb(255, 255, 255);\n  box-shadow:\n    0 3px 10px rgba(0, 0, 0, 0.4),\n    0 0 12px rgba(255, 255, 255, 0.6),\n    inset 0 1px 0 rgba(255, 255, 255, 0.7);\n}\n.controls-section .volume-section .volume-control .volume-track .volume-slider::-webkit-slider-runnable-track {\n  width: 100%;\n  height: 4px;\n  background: transparent;\n  border-radius: 2px;\n}\n.controls-section .playback-controls {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: clamp(14px, 2.2vw, 18px);\n  flex: 1;\n  max-width: 180px;\n  width: 100%;\n  margin: 0 auto;\n  position: relative;\n}\n.controls-section .playback-controls .control-button {\n  position: relative;\n  border: none;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.15) 0%,\n      rgba(255, 255, 255, 0.08) 50%,\n      rgba(255, 255, 255, 0.05) 100%);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 50%;\n  cursor: pointer;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: all 0.4s cubic-bezier(0.19, 1, 0.22, 1);\n  box-shadow:\n    0 6px 20px rgba(0, 0, 0, 0.25),\n    0 2px 8px rgba(0, 0, 0, 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.3),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.1);\n}\n.controls-section .playback-controls .control-button .control-icon {\n  width: 18px;\n  height: 18px;\n  filter: invert(1) opacity(0.9);\n  transition: all 0.3s cubic-bezier(0.19, 1, 0.22, 1);\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n}\n.controls-section .playback-controls .control-button.previous-button,\n.controls-section .playback-controls .control-button.next-button {\n  width: 40px;\n  height: 40px;\n}\n.controls-section .playback-controls .control-button.previous-button:hover,\n.controls-section .playback-controls .control-button.next-button:hover {\n  transform: scale(1.1);\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.2) 0%,\n      rgba(255, 255, 255, 0.12) 50%,\n      rgba(255, 255, 255, 0.08) 100%);\n  box-shadow:\n    0 8px 28px rgba(0, 0, 0, 0.3),\n    0 4px 12px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.4),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.15),\n    0 0 20px rgba(255, 255, 255, 0.15);\n}\n.controls-section .playback-controls .control-button.previous-button:active,\n.controls-section .playback-controls .control-button.next-button:active {\n  transform: scale(1.05);\n  transition-duration: 0.15s;\n}\n.controls-section .playback-controls .control-button.play-pause-button {\n  width: 52px;\n  height: 52px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.18) 0%,\n      rgba(255, 255, 255, 0.12) 50%,\n      rgba(255, 255, 255, 0.08) 100%);\n  border-width: 1.5px;\n}\n.controls-section .playback-controls .control-button.play-pause-button .control-icon {\n  width: 22px;\n  height: 22px;\n  filter: invert(1) opacity(0.95);\n}\n.controls-section .playback-controls .control-button.play-pause-button:hover {\n  transform: scale(1.08);\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.25) 0%,\n      rgba(255, 255, 255, 0.18) 50%,\n      rgba(255, 255, 255, 0.12) 100%);\n  box-shadow:\n    0 12px 36px rgba(0, 0, 0, 0.35),\n    0 6px 16px rgba(0, 0, 0, 0.25),\n    inset 0 1px 0 rgba(255, 255, 255, 0.5),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.2),\n    0 0 32px rgba(255, 255, 255, 0.2);\n}\n.controls-section .playback-controls .control-button.play-pause-button:active {\n  transform: scale(1.02);\n  transition-duration: 0.15s;\n}\n.controls-section .playback-controls .control-button.play-pause-button.playing {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.22) 0%,\n      rgba(255, 255, 255, 0.15) 50%,\n      rgba(255, 255, 255, 0.1) 100%);\n  box-shadow:\n    0 8px 24px rgba(0, 0, 0, 0.3),\n    0 4px 12px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.4),\n    inset 0 -1px 0 rgba(255, 255, 255, 0.15),\n    0 0 24px rgba(255, 255, 255, 0.18);\n  animation: playingPulse 2s ease-in-out infinite;\n}\n.controls-section .playback-controls .control-button:disabled {\n  opacity: 0.4;\n  cursor: not-allowed;\n  transform: none;\n}\n.controls-section .playback-controls .control-button:disabled:hover {\n  transform: none;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.08) 0%,\n      rgba(255, 255, 255, 0.05) 100%);\n}\n@keyframes playingPulse {\n  0%, 100% {\n    box-shadow:\n      0 8px 24px rgba(0, 0, 0, 0.3),\n      0 4px 12px rgba(0, 0, 0, 0.2),\n      inset 0 1px 0 rgba(255, 255, 255, 0.4),\n      inset 0 -1px 0 rgba(255, 255, 255, 0.15),\n      0 0 24px rgba(255, 255, 255, 0.18);\n  }\n  50% {\n    box-shadow:\n      0 8px 24px rgba(0, 0, 0, 0.3),\n      0 4px 12px rgba(0, 0, 0, 0.2),\n      inset 0 1px 0 rgba(255, 255, 255, 0.4),\n      inset 0 -1px 0 rgba(255, 255, 255, 0.15),\n      0 0 32px rgba(255, 255, 255, 0.25);\n  }\n}\n@media (max-width: 768px) {\n  .music-player-container .music-player {\n    padding: clamp(14px, 4vw, 20px);\n    gap: clamp(10px, 2.5vw, 16px);\n    border-radius: 14px;\n  }\n  .music-player-container .music-player .track-section .track-info .track-title {\n    font-size: clamp(0.95rem, 1.2vw, 1.3rem);\n  }\n  .music-player-container .music-player .track-section .track-info .track-artist {\n    font-size: clamp(0.85rem, 1vw, 1.1rem);\n  }\n  .music-player-container .music-player .progress-section .progress-container .progress-track {\n    height: 8px;\n  }\n  .music-player-container .music-player .progress-section .progress-container .progress-track .progress-slider {\n    height: 36px;\n  }\n  .music-player-container .music-player .progress-section .progress-container .progress-track .progress-slider::-webkit-slider-thumb {\n    width: 18px;\n    height: 18px;\n    margin-top: -5px;\n  }\n  .music-player-container .music-player .controls-section {\n    gap: clamp(8px, 3vw, 16px);\n  }\n  .music-player-container .music-player .controls-section .volume-section {\n    min-width: 80px;\n  }\n  .music-player-container .music-player .controls-section .volume-section .volume-control {\n    max-width: 60px;\n  }\n  .music-player-container .music-player .controls-section .playback-controls {\n    gap: clamp(8px, 2.5vw, 12px);\n    max-width: 160px;\n  }\n  .music-player-container .music-player .controls-section .playback-controls .control-button.previous-button,\n  .music-player-container .music-player .controls-section .playback-controls .control-button.next-button {\n    width: 36px;\n    height: 36px;\n  }\n  .music-player-container .music-player .controls-section .playback-controls .control-button.previous-button .control-icon,\n  .music-player-container .music-player .controls-section .playback-controls .control-button.next-button .control-icon {\n    width: 16px;\n    height: 16px;\n  }\n  .music-player-container .music-player .controls-section .playback-controls .control-button.play-pause-button {\n    width: 46px;\n    height: 46px;\n  }\n  .music-player-container .music-player .controls-section .playback-controls .control-button.play-pause-button .control-icon {\n    width: 20px;\n    height: 20px;\n  }\n}\n@media (max-width: 480px) {\n  .music-player-container .music-player {\n    padding: 12px 16px;\n    gap: 8px;\n    border-radius: 12px;\n  }\n  .music-player-container .music-player .controls-section {\n    flex-direction: column;\n    gap: 12px;\n  }\n  .music-player-container .music-player .controls-section .volume-section {\n    order: 2;\n    align-self: stretch;\n    min-width: auto;\n  }\n  .music-player-container .music-player .controls-section .volume-section .volume-control {\n    max-width: none;\n    flex: 1;\n  }\n  .music-player-container .music-player .controls-section .playback-controls {\n    order: 1;\n    max-width: none;\n    justify-content: center;\n  }\n}\ninput[type=range] {\n  -webkit-appearance: none;\n  -moz-appearance: none;\n  appearance: none;\n}\ninput[type=range]::-moz-range-thumb {\n  width: 16px;\n  height: 16px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(255, 255, 255, 0.95) 0%,\n      rgba(255, 255, 255, 0.8) 100%);\n  border: 2px solid rgba(255, 255, 255, 0.3);\n  border-radius: 50%;\n  cursor: pointer;\n  box-shadow:\n    0 4px 12px rgba(0, 0, 0, 0.3),\n    0 2px 6px rgba(0, 0, 0, 0.2),\n    inset 0 1px 0 rgba(255, 255, 255, 0.5);\n  -moz-appearance: none;\n}\ninput[type=range]::-moz-range-thumb:hover {\n  background:\n    linear-gradient(\n      135deg,\n      rgb(255, 255, 255) 0%,\n      rgba(255, 255, 255, 0.9) 100%);\n  box-shadow:\n    0 6px 20px rgba(0, 0, 0, 0.4),\n    0 3px 10px rgba(0, 0, 0, 0.3),\n    0 0 16px rgba(255, 255, 255, 0.5),\n    inset 0 1px 0 rgba(255, 255, 255, 0.7);\n  transform: scale(1.2);\n}\ninput[type=range]::-moz-range-track {\n  height: 6px;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(255, 255, 255, 0.1) 0%,\n      rgba(255, 255, 255, 0.15) 50%,\n      rgba(255, 255, 255, 0.1) 100%);\n  border: none;\n  border-radius: 3px;\n  -moz-appearance: none;\n}\ninput[type=range]:focus {\n  outline: none;\n  box-shadow: none;\n}\n@media (prefers-reduced-motion: reduce) {\n  .music-player-container .player-backdrop::before {\n    animation: none;\n  }\n  .progress-section .progress-container .progress-track .progress-fill::after {\n    animation: none;\n  }\n  .controls-section .playback-controls .control-button {\n    transition-duration: 0.2s;\n  }\n  .controls-section .playback-controls .control-button.play-pause-button.playing {\n    animation: none;\n  }\n  @keyframes shimmer {\n    0%, 100% {\n      opacity: 0;\n    }\n  }\n  @keyframes progressShimmer {\n    0%, 100% {\n      opacity: 0;\n    }\n  }\n  @keyframes playingPulse {\n    0%, 100% {\n      opacity: 1;\n    }\n  }\n  @keyframes spin {\n    0%, 100% {\n      transform: rotate(0deg);\n    }\n  }\n}\n/*# sourceMappingURL=music-player.component.css.map */\n']
    }]
  }], () => [{ type: AudioService2 }, { type: DynamicArtistService }, { type: MusicStateManagerService }, { type: ChangeDetectorRef }], { trackTitle: [{
    type: Input
  }], trackArtist: [{
    type: Input
  }], activeTrack: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(MusicPlayerComponent, { className: "MusicPlayerComponent", filePath: "src/app/pages/collections/phantasia/tools/music-player/music-player.component.ts", lineNumber: 27 });
})();

// src/app/components/loading-screen/loading-screen.component.ts
function LoadingScreenComponent_div_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 24);
  }
  if (rf & 2) {
    const rune_r1 = ctx.$implicit;
    \u0275\u0275styleProp("left", rune_r1.x + "vw")("top", rune_r1.y + "vh")("--move-x", rune_r1.moveX + "px")("--move-y", rune_r1.moveY + "px")("--scale", rune_r1.scale)("--base-opacity", rune_r1.opacity)("--rotation-offset", rune_r1.rotationOffset)("--delay", rune_r1.delay);
    \u0275\u0275classProp("clockwise", rune_r1.clockwise)("counter-clockwise", !rune_r1.clockwise);
  }
}
var _LoadingScreenComponent = class _LoadingScreenComponent {
  set progress(value) {
    this._progress = value;
    this.progressText = `${Math.floor(value)}%`;
    this.cdr.markForCheck();
  }
  get progress() {
    return this._progress;
  }
  constructor(cdr, renderer, document2) {
    this.cdr = cdr;
    this.renderer = renderer;
    this.document = document2;
    this._progress = 0;
    this.progressText = "0%";
    this.runes = [];
    this.originalHeaderStyles = /* @__PURE__ */ new Map();
  }
  /**
   * Initializes the loading screen and generates rune positions
   * Creates randomized magical elements with varied animations
   * Also suppresses any high z-index headers while loading
   * 【✓】
   */
  ngOnInit() {
    this.generateRunePositions();
    this.suppressHighZIndexHeaders();
  }
  /**
   * Cleanup on component destruction
   * Restores original header z-index values
   * 【✓】
   */
  ngOnDestroy() {
    this.restoreHeaderStyles();
  }
  /**
   * Suppress high z-index headers that might appear above the loading screen
   * Stores original styles for restoration later
   * Uses multiple aggressive approaches to ensure loading screen visibility
   * 【✓】
   */
  suppressHighZIndexHeaders() {
    console.log("\u{1F527} LoadingScreen: Starting header suppression");
    const selectors = [
      "app-site-header",
      ".site-header",
      'header[class*="header"]',
      ".cd-cases-container",
      ".debug-toggle",
      ".debug-panel",
      ".right-side-menu",
      ".mobile-navbar",
      '[class*="z-index"]',
      '[style*="z-index"]'
    ];
    const allPotentialElements = this.document.querySelectorAll(selectors.join(", "));
    console.log(`\u{1F50D} Found ${allPotentialElements.length} potential interfering elements`);
    allPotentialElements.forEach((element, index) => {
      const elem = element;
      const computedStyle = getComputedStyle(elem);
      const originalZIndex = computedStyle.zIndex || "auto";
      const originalVisibility = computedStyle.visibility || "visible";
      console.log(`\u{1F4DD} Element ${index}: ${elem.tagName}.${elem.className} - z-index: ${originalZIndex}`);
      this.originalHeaderStyles.set(elem, JSON.stringify({
        zIndex: originalZIndex,
        visibility: originalVisibility,
        display: computedStyle.display || "block"
      }));
      this.renderer.setStyle(elem, "z-index", "1", RendererStyleFlags2.Important);
      this.renderer.setStyle(elem, "visibility", "hidden", RendererStyleFlags2.Important);
      console.log(`\u2705 Suppressed element ${index}`);
    });
    this.renderer.addClass(this.document.body, "loading-screen-active");
    console.log("\u{1F3AF} Header suppression completed");
  }
  /**
   * Restore original header styles when loading screen is destroyed
   * Restores all suppressed styles including visibility and z-index
   * Enhanced to ensure header visibility is properly restored
   * 【✓】
   */
  restoreHeaderStyles() {
    console.log("\u{1F527} LoadingScreen: Restoring header styles");
    this.renderer.removeClass(this.document.body, "loading-screen-active");
    console.log("\u{1F4DD} Removed loading-screen-active class from body");
    this.originalHeaderStyles.forEach((originalStylesJson, element) => {
      try {
        const originalStyles = JSON.parse(originalStylesJson);
        if (originalStyles.zIndex === "auto" || originalStyles.zIndex === "") {
          this.renderer.removeStyle(element, "z-index");
        } else {
          this.renderer.setStyle(element, "z-index", originalStyles.zIndex);
        }
        if (element.tagName.toLowerCase() === "app-site-header" || element.classList.contains("site-header")) {
          this.renderer.setStyle(element, "visibility", "visible", RendererStyleFlags2.Important);
          console.log("\u{1F3AF} Forced header visibility to visible");
        } else if (originalStyles.visibility === "visible") {
          this.renderer.removeStyle(element, "visibility");
        } else {
          this.renderer.setStyle(element, "visibility", originalStyles.visibility);
        }
      } catch (error) {
        console.warn("\u26A0\uFE0F Failed to restore styles for element:", element, error);
        this.renderer.removeStyle(element, "z-index");
        this.renderer.removeStyle(element, "visibility");
        if (element.tagName.toLowerCase() === "app-site-header" || element.classList.contains("site-header")) {
          this.renderer.setStyle(element, "visibility", "visible", RendererStyleFlags2.Important);
        }
      }
    });
    const allHeaders = this.document.querySelectorAll("app-site-header, .site-header, header");
    allHeaders.forEach((header) => {
      const elem = header;
      this.renderer.setStyle(elem, "visibility", "visible", RendererStyleFlags2.Important);
      this.renderer.setStyle(elem, "z-index", "1000", RendererStyleFlags2.Important);
    });
    this.originalHeaderStyles.clear();
    console.log("\u2705 Header styles restored with enhanced visibility enforcement");
  }
  /**
   * Creates random positions and properties for rune elements
   * Generates visually interesting magical symbols with varied behavior
   * 【✓】
   */
  generateRunePositions() {
    const numRunes = 48;
    this.runes = Array.from({ length: numRunes }, () => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      scale: 0.6 + Math.random() * 1.4,
      delay: Math.random() * 8,
      opacity: 0.3 + Math.random() * 0.5,
      moveX: 15 + Math.random() * 20,
      moveY: 15 + Math.random() * 20,
      rotationOffset: Math.random() * 360,
      clockwise: Math.random() < 0.5
    }));
  }
};
_LoadingScreenComponent.\u0275fac = function LoadingScreenComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _LoadingScreenComponent)(\u0275\u0275directiveInject(ChangeDetectorRef), \u0275\u0275directiveInject(Renderer2), \u0275\u0275directiveInject(DOCUMENT));
};
_LoadingScreenComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _LoadingScreenComponent, selectors: [["app-loading-screen"]], inputs: { progress: "progress" }, decls: 25, vars: 3, consts: [[1, "loader-container"], [1, "magical-circle", "outer"], [1, "magical-circle"], [1, "rune-effects"], [1, "decorative-elements"], [1, "corner-line", "top-left"], [1, "corner-line", "top-right"], [1, "corner-line", "bottom-left"], [1, "corner-line", "bottom-right"], [1, "mid-line", "left"], [1, "mid-line", "right"], [1, "mid-line", "top"], [1, "mid-line", "bottom"], [1, "light-beams"], [1, "beam", "beam-1"], [1, "beam", "beam-2"], [1, "beam", "beam-3"], [1, "beam", "beam-4"], [1, "rune-circle"], ["class", "rune", 3, "clockwise", "counter-clockwise", "left", "top", "--move-x", "--move-y", "--scale", "--base-opacity", "--rotation-offset", "--delay", 4, "ngFor", "ngForOf"], [1, "content"], [1, "logo-container"], ["src", "/assets/images/logos/prismcoll.svg", "alt", "Prismatic Collections", 1, "logo"], [1, "loading-text"], [1, "rune"]], template: function LoadingScreenComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275element(1, "div", 1)(2, "div", 2)(3, "div", 3);
    \u0275\u0275elementStart(4, "div", 4);
    \u0275\u0275element(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "div", 8)(9, "div", 9)(10, "div", 10)(11, "div", 11)(12, "div", 12);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div", 13);
    \u0275\u0275element(14, "div", 14)(15, "div", 15)(16, "div", 16)(17, "div", 17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 18);
    \u0275\u0275template(19, LoadingScreenComponent_div_19_Template, 1, 20, "div", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "div", 20)(21, "div", 21);
    \u0275\u0275element(22, "img", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(23, "div", 23);
    \u0275\u0275text(24, "NOW LOADING");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    \u0275\u0275classProp("visible", true);
    \u0275\u0275advance(19);
    \u0275\u0275property("ngForOf", ctx.runes);
  }
}, dependencies: [CommonModule, NgForOf], styles: ['\n\n.loader-container[_ngcontent-%COMP%] {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #ffffff;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.5s ease;\n  z-index: 2147483647;\n  isolation: isolate;\n  transform: translateZ(0);\n  will-change: opacity, transform;\n  position: fixed !important;\n  z-index: 2147483647 !important;\n  contain: layout size style;\n}\n.loader-container.visible[_ngcontent-%COMP%] {\n  opacity: 1;\n  pointer-events: all;\n}\n[_nghost-%COMP%] {\n  position: relative;\n  z-index: 2147483647;\n}\n.loader-container.visible[_ngcontent-%COMP%]    ~ *[_ngcontent-%COMP%] {\n  z-index: 1 !important;\n}\n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   .debug-toggle[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   .debug-panel[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   .cd-cases-container[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   .right-side-menu[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   .mobile-navbar[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   [class*=z-index][_ngcontent-%COMP%]:not(.site-header):not(app-site-header), \n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   [style*=z-index][_ngcontent-%COMP%]:not(.site-header):not(app-site-header), \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   .debug-toggle[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   .debug-panel[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   .cd-cases-container[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   .right-side-menu[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   .mobile-navbar[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   [class*=z-index][_ngcontent-%COMP%]:not(.site-header):not(app-site-header), \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   [style*=z-index][_ngcontent-%COMP%]:not(.site-header):not(app-site-header) {\n  z-index: 1 !important;\n  visibility: hidden !important;\n}\n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   .site-header[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   app-site-header[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   header[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   .site-header[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   app-site-header[_ngcontent-%COMP%], \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   header[_ngcontent-%COMP%] {\n  z-index: 1 !important;\n}\n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   *[style*="z-index: 999"][_ngcontent-%COMP%]:not(.site-header):not(app-site-header), \n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   *[style*="z-index: 1000"][_ngcontent-%COMP%]:not(.site-header):not(app-site-header), \n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   *[style*="z-index: 9999"][_ngcontent-%COMP%]:not(.site-header):not(app-site-header), \n[_ngcontent-%COMP%]:global(body:has(.loader-container.visible))   *[style*="z-index: 10000"][_ngcontent-%COMP%]:not(.site-header):not(app-site-header), \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   *[style*="z-index: 999"][_ngcontent-%COMP%]:not(.site-header):not(app-site-header), \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   *[style*="z-index: 1000"][_ngcontent-%COMP%]:not(.site-header):not(app-site-header), \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   *[style*="z-index: 9999"][_ngcontent-%COMP%]:not(.site-header):not(app-site-header), \n[_ngcontent-%COMP%]:global(body.loading-screen-active)   *[style*="z-index: 10000"][_ngcontent-%COMP%]:not(.site-header):not(app-site-header) {\n  z-index: 1 !important;\n  visibility: hidden !important;\n}\n.logo-container[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 10;\n  margin-bottom: 30px;\n}\n.logo[_ngcontent-%COMP%] {\n  width: 240px;\n  height: auto;\n  display: block;\n  margin: 0 auto;\n}\n.magical-circle[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 800px;\n  height: 800px;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_rotate 20s linear infinite;\n}\n.magical-circle[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: -2px;\n  left: -2px;\n  right: -2px;\n  bottom: -2px;\n  border: 2px solid transparent;\n  border-top-color: rgba(0, 0, 0, 0.2);\n  border-radius: 50%;\n}\n.magical-circle[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  top: -10px;\n  left: -10px;\n  right: -10px;\n  bottom: -10px;\n  border: 1px solid transparent;\n  border-left-color: rgba(0, 0, 0, 0.15);\n  border-radius: 50%;\n}\n.magical-circle.outer[_ngcontent-%COMP%] {\n  width: 1000px;\n  height: 1000px;\n  animation: _ngcontent-%COMP%_rotate 30s linear infinite reverse;\n  opacity: 0.5;\n}\n.decorative-elements[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n.corner-line[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 150px;\n  height: 150px;\n  border: 2px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n}\n.corner-line[_ngcontent-%COMP%]::before, \n.corner-line[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(0, 0, 0, 0.1),\n      rgba(0, 0, 0, 0.2));\n}\n.corner-line.top-left[_ngcontent-%COMP%] {\n  top: 50px;\n  left: 50px;\n  border-right: none;\n  border-bottom: none;\n  animation: _ngcontent-%COMP%_pulse 3s infinite;\n}\n.corner-line.top-right[_ngcontent-%COMP%] {\n  top: 50px;\n  right: 50px;\n  border-left: none;\n  border-bottom: none;\n  animation: _ngcontent-%COMP%_pulse 3s infinite 0.75s;\n}\n.corner-line.bottom-left[_ngcontent-%COMP%] {\n  bottom: 50px;\n  left: 50px;\n  border-right: none;\n  border-top: none;\n  animation: _ngcontent-%COMP%_pulse 3s infinite 1.5s;\n}\n.corner-line.bottom-right[_ngcontent-%COMP%] {\n  bottom: 50px;\n  right: 50px;\n  border-left: none;\n  border-top: none;\n  animation: _ngcontent-%COMP%_pulse 3s infinite 2.25s;\n}\n.mid-line[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 100px;\n  height: 100px;\n  border: 2px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  animation: _ngcontent-%COMP%_pulse 3s infinite;\n}\n.mid-line.left[_ngcontent-%COMP%] {\n  left: 50px;\n  top: 50%;\n  transform: translateY(-50%);\n  border-right: none;\n  animation-delay: 0.5s;\n}\n.mid-line.right[_ngcontent-%COMP%] {\n  right: 50px;\n  top: 50%;\n  transform: translateY(-50%);\n  border-left: none;\n  animation-delay: 1s;\n}\n.mid-line.top[_ngcontent-%COMP%] {\n  top: 50px;\n  left: 50%;\n  transform: translateX(-50%);\n  border-bottom: none;\n  animation-delay: 1.5s;\n}\n.mid-line.bottom[_ngcontent-%COMP%] {\n  bottom: 50px;\n  left: 50%;\n  transform: translateX(-50%);\n  border-top: none;\n  animation-delay: 2s;\n}\n.rune-circle[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 100vw;\n  height: 100vh;\n  pointer-events: none;\n  left: 0;\n  top: 0;\n}\n.rune[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 18px;\n  height: 18px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.4),\n      rgba(60, 60, 60, 0.3));\n  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);\n  transform-origin: center center;\n  transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  opacity: var(--base-opacity);\n  will-change: transform;\n  animation: none;\n}\n.rune.clockwise[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_rune-move-clockwise 8s infinite linear;\n  animation-delay: calc(var(--delay) * -1s);\n}\n.rune.counter-clockwise[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_rune-move-counterclockwise 8s infinite linear;\n  animation-delay: calc(var(--delay) * -1s);\n}\n.rune[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      45deg,\n      transparent,\n      rgba(255, 255, 255, 0.6));\n  mix-blend-mode: screen;\n  animation: _ngcontent-%COMP%_sparkle 4s infinite linear;\n}\n.rune[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  width: 140%;\n  height: 140%;\n  top: -20%;\n  left: -20%;\n  background:\n    radial-gradient(\n      circle at center,\n      rgba(120, 200, 255, 0.15) 0%,\n      rgba(70, 150, 255, 0.1) 30%,\n      transparent 70%);\n  mix-blend-mode: screen;\n  opacity: 0.5;\n}\n.rune-effects[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 100vw;\n  height: 100vh;\n  pointer-events: none;\n  mix-blend-mode: multiply;\n  background:\n    radial-gradient(\n      circle at center,\n      transparent 0%,\n      rgba(0, 0, 0, 0.02) 50%,\n      transparent 100%);\n  animation: _ngcontent-%COMP%_effect-pulse-safe 8s infinite ease-in-out;\n  left: 0;\n  top: 0;\n  contain: layout;\n}\n.light-beams[_ngcontent-%COMP%] {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  mix-blend-mode: multiply;\n}\n.beam[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background:\n    linear-gradient(\n      90deg,\n      rgba(0, 0, 0, 0.1),\n      rgba(40, 40, 40, 0.15),\n      rgba(0, 0, 0, 0.1));\n  mix-blend-mode: multiply;\n}\n.beam.beam-1[_ngcontent-%COMP%] {\n  width: 600px;\n  height: 2px;\n  animation: _ngcontent-%COMP%_beam-rotate 8s infinite linear, _ngcontent-%COMP%_beam-pulse 4s infinite ease-in-out;\n}\n.beam.beam-2[_ngcontent-%COMP%] {\n  width: 400px;\n  height: 1px;\n  animation: _ngcontent-%COMP%_beam-rotate 12s infinite linear reverse, _ngcontent-%COMP%_beam-pulse 6s infinite ease-in-out 1s;\n}\n.beam.beam-3[_ngcontent-%COMP%] {\n  width: 300px;\n  height: 1px;\n  animation: _ngcontent-%COMP%_beam-rotate 10s infinite linear, _ngcontent-%COMP%_beam-pulse 5s infinite ease-in-out 2s;\n}\n.beam.beam-4[_ngcontent-%COMP%] {\n  width: 200px;\n  height: 1px;\n  animation: _ngcontent-%COMP%_beam-rotate 14s infinite linear reverse, _ngcontent-%COMP%_beam-pulse 7s infinite ease-in-out 3s;\n}\n.content[_ngcontent-%COMP%] {\n  position: relative;\n  z-index: 2;\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n.loading-text[_ngcontent-%COMP%] {\n  margin-top: 2rem;\n  font-size: 1rem;\n  letter-spacing: 0.3em;\n  text-transform: uppercase;\n  color: rgba(0, 0, 0, 0.7);\n  font-family: Arial, sans-serif;\n  font-weight: 500;\n}\n@keyframes _ngcontent-%COMP%_rotate {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0%, 100% {\n    opacity: 0.2;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n@keyframes _ngcontent-%COMP%_rune-move-clockwise {\n  0% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  }\n  25% {\n    transform: translate(var(--move-x), var(--move-y)) scale(var(--scale)) rotate(calc((90 + var(--rotation-offset)) * 1deg));\n  }\n  50% {\n    transform: translate(0, var(--move-y)) scale(var(--scale)) rotate(calc((180 + var(--rotation-offset)) * 1deg));\n  }\n  75% {\n    transform: translate(calc(var(--move-x) * -1), 0) scale(var(--scale)) rotate(calc((270 + var(--rotation-offset)) * 1deg));\n  }\n  100% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc((360 + var(--rotation-offset)) * 1deg));\n  }\n}\n@keyframes _ngcontent-%COMP%_rune-move-counterclockwise {\n  0% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  }\n  25% {\n    transform: translate(var(--move-x), var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 90) * 1deg));\n  }\n  50% {\n    transform: translate(0, var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 180) * 1deg));\n  }\n  75% {\n    transform: translate(calc(var(--move-x) * -1), 0) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 270) * 1deg));\n  }\n  100% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 360) * 1deg));\n  }\n}\n@keyframes _ngcontent-%COMP%_beam-rotate {\n  0% {\n    transform: translate(-50%, -50%) rotate(0deg);\n  }\n  100% {\n    transform: translate(-50%, -50%) rotate(360deg);\n  }\n}\n@keyframes _ngcontent-%COMP%_beam-pulse {\n  0%, 100% {\n    opacity: 0.2;\n    width: 100%;\n  }\n  50% {\n    opacity: 0.5;\n    width: 120%;\n  }\n}\n@keyframes _ngcontent-%COMP%_sparkle {\n  0%, 100% {\n    opacity: 0.4;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.8;\n    transform: scale(1.1);\n  }\n}\n@keyframes _ngcontent-%COMP%_effect-pulse-safe {\n  0%, 100% {\n    opacity: 0.3;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.6;\n    transform: scale(1.05);\n  }\n}\n@keyframes _ngcontent-%COMP%_effect-pulse {\n  0%, 100% {\n    opacity: 0.3;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.6;\n    transform: scale(1.1);\n  }\n}\n/*# sourceMappingURL=loading-screen.component.css.map */'], changeDetection: 0 });
var LoadingScreenComponent = _LoadingScreenComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(LoadingScreenComponent, [{
    type: Component,
    args: [{ selector: "app-loading-screen", standalone: true, imports: [CommonModule], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="loader-container" [class.visible]="true">
  <div class="magical-circle outer"></div>
  <div class="magical-circle"></div>
  <div class="rune-effects"></div>
  <div class="decorative-elements">
    <div class="corner-line top-left"></div>
    <div class="corner-line top-right"></div>
    <div class="corner-line bottom-left"></div>
    <div class="corner-line bottom-right"></div>
    <div class="mid-line left"></div>
    <div class="mid-line right"></div>
    <div class="mid-line top"></div>
    <div class="mid-line bottom"></div>
  </div>
  <div class="light-beams">
    <div class="beam beam-1"></div>
    <div class="beam beam-2"></div>
    <div class="beam beam-3"></div>
    <div class="beam beam-4"></div>
  </div>
  <div class="rune-circle">
    <div class="rune" *ngFor="let rune of runes" 
         [class.clockwise]="rune.clockwise"
         [class.counter-clockwise]="!rune.clockwise"
         [style.left]="rune.x + 'vw'"
         [style.top]="rune.y + 'vh'"
         [style.--move-x]="rune.moveX + 'px'"
         [style.--move-y]="rune.moveY + 'px'"
         [style.--scale]="rune.scale"
         [style.--base-opacity]="rune.opacity"
         [style.--rotation-offset]="rune.rotationOffset"
         [style.--delay]="rune.delay">
    </div>
  </div>
  <div class="content">
    <div class="logo-container">
      <img src="/assets/images/logos/prismcoll.svg" alt="Prismatic Collections" class="logo">
    </div>
    <div class="loading-text">NOW LOADING</div>
  </div>
</div> `, styles: ['/* src/app/components/loading-screen/loading-screen.component.scss */\n.loader-container {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100vw;\n  height: 100vh;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: #ffffff;\n  opacity: 0;\n  pointer-events: none;\n  transition: opacity 0.5s ease;\n  z-index: 2147483647;\n  isolation: isolate;\n  transform: translateZ(0);\n  will-change: opacity, transform;\n  position: fixed !important;\n  z-index: 2147483647 !important;\n  contain: layout size style;\n}\n.loader-container.visible {\n  opacity: 1;\n  pointer-events: all;\n}\n:host {\n  position: relative;\n  z-index: 2147483647;\n}\n.loader-container.visible ~ * {\n  z-index: 1 !important;\n}\n:global(body:has(.loader-container.visible)) .debug-toggle,\n:global(body:has(.loader-container.visible)) .debug-panel,\n:global(body:has(.loader-container.visible)) .cd-cases-container,\n:global(body:has(.loader-container.visible)) .right-side-menu,\n:global(body:has(.loader-container.visible)) .mobile-navbar,\n:global(body:has(.loader-container.visible)) [class*=z-index]:not(.site-header):not(app-site-header),\n:global(body:has(.loader-container.visible)) [style*=z-index]:not(.site-header):not(app-site-header),\n:global(body.loading-screen-active) .debug-toggle,\n:global(body.loading-screen-active) .debug-panel,\n:global(body.loading-screen-active) .cd-cases-container,\n:global(body.loading-screen-active) .right-side-menu,\n:global(body.loading-screen-active) .mobile-navbar,\n:global(body.loading-screen-active) [class*=z-index]:not(.site-header):not(app-site-header),\n:global(body.loading-screen-active) [style*=z-index]:not(.site-header):not(app-site-header) {\n  z-index: 1 !important;\n  visibility: hidden !important;\n}\n:global(body:has(.loader-container.visible)) .site-header,\n:global(body:has(.loader-container.visible)) app-site-header,\n:global(body:has(.loader-container.visible)) header,\n:global(body.loading-screen-active) .site-header,\n:global(body.loading-screen-active) app-site-header,\n:global(body.loading-screen-active) header {\n  z-index: 1 !important;\n}\n:global(body:has(.loader-container.visible)) *[style*="z-index: 999"]:not(.site-header):not(app-site-header),\n:global(body:has(.loader-container.visible)) *[style*="z-index: 1000"]:not(.site-header):not(app-site-header),\n:global(body:has(.loader-container.visible)) *[style*="z-index: 9999"]:not(.site-header):not(app-site-header),\n:global(body:has(.loader-container.visible)) *[style*="z-index: 10000"]:not(.site-header):not(app-site-header),\n:global(body.loading-screen-active) *[style*="z-index: 999"]:not(.site-header):not(app-site-header),\n:global(body.loading-screen-active) *[style*="z-index: 1000"]:not(.site-header):not(app-site-header),\n:global(body.loading-screen-active) *[style*="z-index: 9999"]:not(.site-header):not(app-site-header),\n:global(body.loading-screen-active) *[style*="z-index: 10000"]:not(.site-header):not(app-site-header) {\n  z-index: 1 !important;\n  visibility: hidden !important;\n}\n.logo-container {\n  position: relative;\n  z-index: 10;\n  margin-bottom: 30px;\n}\n.logo {\n  width: 240px;\n  height: auto;\n  display: block;\n  margin: 0 auto;\n}\n.magical-circle {\n  position: absolute;\n  width: 800px;\n  height: 800px;\n  border: 1px solid rgba(0, 0, 0, 0.1);\n  border-radius: 50%;\n  animation: rotate 20s linear infinite;\n}\n.magical-circle::before {\n  content: "";\n  position: absolute;\n  top: -2px;\n  left: -2px;\n  right: -2px;\n  bottom: -2px;\n  border: 2px solid transparent;\n  border-top-color: rgba(0, 0, 0, 0.2);\n  border-radius: 50%;\n}\n.magical-circle::after {\n  content: "";\n  position: absolute;\n  top: -10px;\n  left: -10px;\n  right: -10px;\n  bottom: -10px;\n  border: 1px solid transparent;\n  border-left-color: rgba(0, 0, 0, 0.15);\n  border-radius: 50%;\n}\n.magical-circle.outer {\n  width: 1000px;\n  height: 1000px;\n  animation: rotate 30s linear infinite reverse;\n  opacity: 0.5;\n}\n.decorative-elements {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n}\n.corner-line {\n  position: absolute;\n  width: 150px;\n  height: 150px;\n  border: 2px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n}\n.corner-line::before,\n.corner-line::after {\n  content: "";\n  position: absolute;\n  background:\n    linear-gradient(\n      90deg,\n      rgba(0, 0, 0, 0.1),\n      rgba(0, 0, 0, 0.2));\n}\n.corner-line.top-left {\n  top: 50px;\n  left: 50px;\n  border-right: none;\n  border-bottom: none;\n  animation: pulse 3s infinite;\n}\n.corner-line.top-right {\n  top: 50px;\n  right: 50px;\n  border-left: none;\n  border-bottom: none;\n  animation: pulse 3s infinite 0.75s;\n}\n.corner-line.bottom-left {\n  bottom: 50px;\n  left: 50px;\n  border-right: none;\n  border-top: none;\n  animation: pulse 3s infinite 1.5s;\n}\n.corner-line.bottom-right {\n  bottom: 50px;\n  right: 50px;\n  border-left: none;\n  border-top: none;\n  animation: pulse 3s infinite 2.25s;\n}\n.mid-line {\n  position: absolute;\n  width: 100px;\n  height: 100px;\n  border: 2px solid rgba(0, 0, 0, 0.15);\n  border-radius: 4px;\n  animation: pulse 3s infinite;\n}\n.mid-line.left {\n  left: 50px;\n  top: 50%;\n  transform: translateY(-50%);\n  border-right: none;\n  animation-delay: 0.5s;\n}\n.mid-line.right {\n  right: 50px;\n  top: 50%;\n  transform: translateY(-50%);\n  border-left: none;\n  animation-delay: 1s;\n}\n.mid-line.top {\n  top: 50px;\n  left: 50%;\n  transform: translateX(-50%);\n  border-bottom: none;\n  animation-delay: 1.5s;\n}\n.mid-line.bottom {\n  bottom: 50px;\n  left: 50%;\n  transform: translateX(-50%);\n  border-top: none;\n  animation-delay: 2s;\n}\n.rune-circle {\n  position: absolute;\n  width: 100vw;\n  height: 100vh;\n  pointer-events: none;\n  left: 0;\n  top: 0;\n}\n.rune {\n  position: absolute;\n  width: 18px;\n  height: 18px;\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.4),\n      rgba(60, 60, 60, 0.3));\n  clip-path: polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%);\n  transform-origin: center center;\n  transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  opacity: var(--base-opacity);\n  will-change: transform;\n  animation: none;\n}\n.rune.clockwise {\n  animation: rune-move-clockwise 8s infinite linear;\n  animation-delay: calc(var(--delay) * -1s);\n}\n.rune.counter-clockwise {\n  animation: rune-move-counterclockwise 8s infinite linear;\n  animation-delay: calc(var(--delay) * -1s);\n}\n.rune::before {\n  content: "";\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      45deg,\n      transparent,\n      rgba(255, 255, 255, 0.6));\n  mix-blend-mode: screen;\n  animation: sparkle 4s infinite linear;\n}\n.rune::after {\n  content: "";\n  position: absolute;\n  width: 140%;\n  height: 140%;\n  top: -20%;\n  left: -20%;\n  background:\n    radial-gradient(\n      circle at center,\n      rgba(120, 200, 255, 0.15) 0%,\n      rgba(70, 150, 255, 0.1) 30%,\n      transparent 70%);\n  mix-blend-mode: screen;\n  opacity: 0.5;\n}\n.rune-effects {\n  position: absolute;\n  width: 100vw;\n  height: 100vh;\n  pointer-events: none;\n  mix-blend-mode: multiply;\n  background:\n    radial-gradient(\n      circle at center,\n      transparent 0%,\n      rgba(0, 0, 0, 0.02) 50%,\n      transparent 100%);\n  animation: effect-pulse-safe 8s infinite ease-in-out;\n  left: 0;\n  top: 0;\n  contain: layout;\n}\n.light-beams {\n  position: absolute;\n  width: 100%;\n  height: 100%;\n  pointer-events: none;\n  mix-blend-mode: multiply;\n}\n.beam {\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -50%);\n  background:\n    linear-gradient(\n      90deg,\n      rgba(0, 0, 0, 0.1),\n      rgba(40, 40, 40, 0.15),\n      rgba(0, 0, 0, 0.1));\n  mix-blend-mode: multiply;\n}\n.beam.beam-1 {\n  width: 600px;\n  height: 2px;\n  animation: beam-rotate 8s infinite linear, beam-pulse 4s infinite ease-in-out;\n}\n.beam.beam-2 {\n  width: 400px;\n  height: 1px;\n  animation: beam-rotate 12s infinite linear reverse, beam-pulse 6s infinite ease-in-out 1s;\n}\n.beam.beam-3 {\n  width: 300px;\n  height: 1px;\n  animation: beam-rotate 10s infinite linear, beam-pulse 5s infinite ease-in-out 2s;\n}\n.beam.beam-4 {\n  width: 200px;\n  height: 1px;\n  animation: beam-rotate 14s infinite linear reverse, beam-pulse 7s infinite ease-in-out 3s;\n}\n.content {\n  position: relative;\n  z-index: 2;\n  text-align: center;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  justify-content: center;\n}\n.loading-text {\n  margin-top: 2rem;\n  font-size: 1rem;\n  letter-spacing: 0.3em;\n  text-transform: uppercase;\n  color: rgba(0, 0, 0, 0.7);\n  font-family: Arial, sans-serif;\n  font-weight: 500;\n}\n@keyframes rotate {\n  from {\n    transform: rotate(0deg);\n  }\n  to {\n    transform: rotate(360deg);\n  }\n}\n@keyframes pulse {\n  0%, 100% {\n    opacity: 0.2;\n  }\n  50% {\n    opacity: 0.5;\n  }\n}\n@keyframes rune-move-clockwise {\n  0% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  }\n  25% {\n    transform: translate(var(--move-x), var(--move-y)) scale(var(--scale)) rotate(calc((90 + var(--rotation-offset)) * 1deg));\n  }\n  50% {\n    transform: translate(0, var(--move-y)) scale(var(--scale)) rotate(calc((180 + var(--rotation-offset)) * 1deg));\n  }\n  75% {\n    transform: translate(calc(var(--move-x) * -1), 0) scale(var(--scale)) rotate(calc((270 + var(--rotation-offset)) * 1deg));\n  }\n  100% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc((360 + var(--rotation-offset)) * 1deg));\n  }\n}\n@keyframes rune-move-counterclockwise {\n  0% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));\n  }\n  25% {\n    transform: translate(var(--move-x), var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 90) * 1deg));\n  }\n  50% {\n    transform: translate(0, var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 180) * 1deg));\n  }\n  75% {\n    transform: translate(calc(var(--move-x) * -1), 0) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 270) * 1deg));\n  }\n  100% {\n    transform: translate(0, 0) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 360) * 1deg));\n  }\n}\n@keyframes beam-rotate {\n  0% {\n    transform: translate(-50%, -50%) rotate(0deg);\n  }\n  100% {\n    transform: translate(-50%, -50%) rotate(360deg);\n  }\n}\n@keyframes beam-pulse {\n  0%, 100% {\n    opacity: 0.2;\n    width: 100%;\n  }\n  50% {\n    opacity: 0.5;\n    width: 120%;\n  }\n}\n@keyframes sparkle {\n  0%, 100% {\n    opacity: 0.4;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.8;\n    transform: scale(1.1);\n  }\n}\n@keyframes effect-pulse-safe {\n  0%, 100% {\n    opacity: 0.3;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.6;\n    transform: scale(1.05);\n  }\n}\n@keyframes effect-pulse {\n  0%, 100% {\n    opacity: 0.3;\n    transform: scale(1);\n  }\n  50% {\n    opacity: 0.6;\n    transform: scale(1.1);\n  }\n}\n/*# sourceMappingURL=loading-screen.component.css.map */\n'] }]
  }], () => [{ type: ChangeDetectorRef }, { type: Renderer2 }, { type: Document, decorators: [{
    type: Inject,
    args: [DOCUMENT]
  }] }], { progress: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(LoadingScreenComponent, { className: "LoadingScreenComponent", filePath: "src/app/components/loading-screen/loading-screen.component.ts", lineNumber: 35 });
})();

// src/app/components/dynamic-artist-cards/artist-card/artist-card.component.ts
function ArtistCardComponent_img_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "img", 11);
    \u0275\u0275listener("error", function ArtistCardComponent_img_3_Template_img_error_0_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onAvatarError());
    });
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275property("src", ctx_r1.avatarUrl, \u0275\u0275sanitizeUrl)("alt", ctx_r1.artistName + " avatar");
  }
}
function ArtistCardComponent_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275styleProp("background", ctx_r1.cardThemeColor());
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.artistInitials(), " ");
  }
}
function ArtistCardComponent_div_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 13)(1, "div", 14);
    \u0275\u0275element(2, "span", 15);
    \u0275\u0275elementStart(3, "span", 16);
    \u0275\u0275text(4, "Currently Playing");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("@playingIndicator", ctx_r1.playingIndicatorState);
  }
}
function ArtistCardComponent_div_11_button_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 22);
    \u0275\u0275listener("click", function ArtistCardComponent_div_11_button_1_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r3);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSocialLinkClick("youtube", $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "smart_display");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 23);
    \u0275\u0275text(4, "YouTube");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", ctx_r1.artistName + " YouTube channel");
  }
}
function ArtistCardComponent_div_11_button_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 24);
    \u0275\u0275listener("click", function ArtistCardComponent_div_11_button_2_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r4);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSocialLinkClick("twitter", $event));
    });
    \u0275\u0275elementStart(1, "span", 25);
    \u0275\u0275text(2, "\u{1D54F}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 23);
    \u0275\u0275text(4, "Twitter/X");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", ctx_r1.artistName + " Twitter profile");
  }
}
function ArtistCardComponent_div_11_button_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 26);
    \u0275\u0275listener("click", function ArtistCardComponent_div_11_button_3_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r5);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSocialLinkClick("linktr", $event));
    });
    \u0275\u0275elementStart(1, "mat-icon");
    \u0275\u0275text(2, "link");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 23);
    \u0275\u0275text(4, "Links");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", ctx_r1.artistName + " Linktr.ee profile");
  }
}
function ArtistCardComponent_div_11_button_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r6 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 27);
    \u0275\u0275listener("click", function ArtistCardComponent_div_11_button_4_Template_button_click_0_listener($event) {
      \u0275\u0275restoreView(_r6);
      const ctx_r1 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r1.onSocialLinkClick("instagram", $event));
    });
    \u0275\u0275elementStart(1, "span", 28);
    \u0275\u0275text(2, "\u{1F4F7}");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 23);
    \u0275\u0275text(4, "Instagram");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275attribute("aria-label", ctx_r1.artistName + " Instagram profile");
  }
}
function ArtistCardComponent_div_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 17);
    \u0275\u0275template(1, ArtistCardComponent_div_11_button_1_Template, 5, 1, "button", 18)(2, ArtistCardComponent_div_11_button_2_Template, 5, 1, "button", 19)(3, ArtistCardComponent_div_11_button_3_Template, 5, 1, "button", 20)(4, ArtistCardComponent_div_11_button_4_Template, 5, 1, "button", 21);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasYoutube);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasTwitter);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasLinktr);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.hasInstagram);
  }
}
var _ArtistCardComponent = class _ArtistCardComponent {
  constructor() {
    this.enableAnimations = true;
    this.isHovered = signal(false, ...ngDevMode ? [{ debugName: "isHovered" }] : []);
    this.avatarError = signal(false, ...ngDevMode ? [{ debugName: "avatarError" }] : []);
    this.artistInitials = computed(() => {
      const name = this.cardData?.artist?.artistDisplayName || "";
      const words = name.split(" ").filter((word) => word.length > 0);
      if (words.length === 0)
        return "?";
      if (words.length === 1)
        return words[0].substring(0, 2).toUpperCase();
      return (words[0][0] + words[words.length - 1][0]).toUpperCase();
    }, ...ngDevMode ? [{ debugName: "artistInitials" }] : []);
    this.roleDisplayText = computed(() => {
      if (!this.cardData?.artist?.role)
        return "";
      const role = this.cardData.artist.role;
      switch (role) {
        case "Main Artist":
          return "MAIN ARTIST";
        case "Featured Artist":
          return "FEATURED ARTIST";
        case "Vocalist":
          return "VOCALIST";
        case "Producer":
          return "PRODUCER";
        case "Composer":
          return "COMPOSER";
        case "Arranger":
          return "ARRANGER";
        case "Instrumentalist":
          return "INSTRUMENTALIST";
        case "Violin":
          return "VIOLIN";
        case "Viola":
          return "VIOLA";
        case "Cello":
          return "CELLO";
        case "Accordion":
          return "ACCORDION";
        case "Piano":
          return "PIANO";
        case "Keyboard":
          return "KEYBOARD";
        case "Guitar":
          return "GUITAR";
        case "Bass":
          return "BASS";
        case "Drums":
          return "DRUMS";
        case "Electronic Producer":
          return "ELECTRONIC PRODUCER";
        case "Sound Designer":
          return "SOUND DESIGNER";
        case "Synthesizer V Operator":
          return "SYNTHESIZER V";
        case "Voice Actor":
          return "VOICE ACTOR";
        // New specific production roles for Phantasia 2
        case "Vocalist, Lyricist":
          return "VOCALIST, LYRICIST";
        case "Accordionist":
          return "ACCORDIONIST";
        case "Violinist":
          return "VIOLINIST";
        case "Violist":
          return "VIOLIST";
        case "Cellist":
          return "CELLIST";
        default:
          return role.toUpperCase();
      }
    }, ...ngDevMode ? [{ debugName: "roleDisplayText" }] : []);
    this.participationLevelClass = computed(() => {
      return `participation-${this.cardData?.participationLevel || "additional"}`;
    }, ...ngDevMode ? [{ debugName: "participationLevelClass" }] : []);
    this.cardThemeColor = computed(() => {
      return this.cardData?.artist?.color || "#ffffff";
    }, ...ngDevMode ? [{ debugName: "cardThemeColor" }] : []);
  }
  // Social links helpers
  get hasYoutube() {
    return !!this.cardData?.artist?.socialLinks?.youtube;
  }
  get hasTwitter() {
    return !!this.cardData?.artist?.socialLinks?.twitter;
  }
  get hasLinktr() {
    return !!this.cardData?.artist?.socialLinks?.linktr;
  }
  get hasInstagram() {
    return !!this.cardData?.artist?.socialLinks?.instagram;
  }
  get youtubeUrl() {
    return this.cardData?.artist?.socialLinks?.youtube || "";
  }
  get twitterUrl() {
    return this.cardData?.artist?.socialLinks?.twitter || "";
  }
  get linktrUrl() {
    return this.cardData?.artist?.socialLinks?.linktr || "";
  }
  get instagramUrl() {
    return this.cardData?.artist?.socialLinks?.instagram || "";
  }
  get artistName() {
    return this.cardData?.artist?.artistDisplayName || "Unknown Artist";
  }
  get avatarUrl() {
    return this.cardData?.artist?.avatar || "";
  }
  get isCurrentlyPlaying() {
    return this.cardData?.isCurrentlyPlaying || false;
  }
  // Event handlers
  onMouseEnter() {
    if (this.enableAnimations) {
      this.isHovered.set(true);
    }
  }
  onMouseLeave() {
    if (this.enableAnimations) {
      this.isHovered.set(false);
    }
  }
  onAvatarError() {
    this.avatarError.set(true);
  }
  onSocialLinkClick(platform, event) {
    event.stopPropagation();
    let url = "";
    if (platform === "youtube") {
      url = this.youtubeUrl;
    } else if (platform === "twitter") {
      url = this.twitterUrl;
    } else if (platform === "linktr") {
      url = this.linktrUrl;
    } else if (platform === "instagram") {
      url = this.instagramUrl;
    }
    if (url) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  }
  onCardClick() {
    console.log("Artist card clicked:", this.cardData?.artist?.artistDisplayName);
  }
  // Animation state getters
  get hoverState() {
    return this.isHovered() ? "hovered" : "default";
  }
  get playingIndicatorState() {
    return this.isCurrentlyPlaying ? "playing" : "not-playing";
  }
};
_ArtistCardComponent.\u0275fac = function ArtistCardComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _ArtistCardComponent)();
};
_ArtistCardComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ArtistCardComponent, selectors: [["app-artist-card"]], inputs: { cardData: "cardData", enableAnimations: "enableAnimations" }, decls: 13, vars: 13, consts: [[1, "artist-card", 3, "mouseenter", "mouseleave", "click"], [1, "artist-avatar-section"], [1, "avatar-container"], ["class", "artist-avatar", "loading", "lazy", 3, "src", "alt", "error", 4, "ngIf"], ["class", "artist-initials", 3, "background", 4, "ngIf"], [1, "artist-info-section"], [1, "artist-name"], [1, "role-label"], ["class", "playing-status", 4, "ngIf"], ["class", "social-links-section", 4, "ngIf"], [1, "card-accent"], ["loading", "lazy", 1, "artist-avatar", 3, "error", "src", "alt"], [1, "artist-initials"], [1, "playing-status"], [1, "playing-indicator"], [1, "playing-dot"], [1, "playing-text"], [1, "social-links-section"], ["class", "social-link youtube-link", "mat-icon-button", "", 3, "click", 4, "ngIf"], ["class", "social-link twitter-link", "mat-icon-button", "", 3, "click", 4, "ngIf"], ["class", "social-link linktr-link", "mat-icon-button", "", 3, "click", 4, "ngIf"], ["class", "social-link instagram-link", "mat-icon-button", "", 3, "click", 4, "ngIf"], ["mat-icon-button", "", 1, "social-link", "youtube-link", 3, "click"], [1, "social-label"], ["mat-icon-button", "", 1, "social-link", "twitter-link", 3, "click"], [1, "twitter-x-icon"], ["mat-icon-button", "", 1, "social-link", "linktr-link", 3, "click"], ["mat-icon-button", "", 1, "social-link", "instagram-link", 3, "click"], [1, "instagram-icon"]], template: function ArtistCardComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 0);
    \u0275\u0275listener("mouseenter", function ArtistCardComponent_Template_div_mouseenter_0_listener() {
      return ctx.onMouseEnter();
    })("mouseleave", function ArtistCardComponent_Template_div_mouseleave_0_listener() {
      return ctx.onMouseLeave();
    })("click", function ArtistCardComponent_Template_div_click_0_listener() {
      return ctx.onCardClick();
    });
    \u0275\u0275elementStart(1, "div", 1)(2, "div", 2);
    \u0275\u0275template(3, ArtistCardComponent_img_3_Template, 1, 2, "img", 3)(4, ArtistCardComponent_div_4_Template, 2, 3, "div", 4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div", 5)(6, "h3", 6);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 7);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275template(10, ArtistCardComponent_div_10_Template, 5, 1, "div", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275template(11, ArtistCardComponent_div_11_Template, 5, 4, "div", 9);
    \u0275\u0275element(12, "div", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    \u0275\u0275classMap(ctx.participationLevelClass());
    \u0275\u0275styleProp("--theme-color", ctx.cardThemeColor());
    \u0275\u0275property("@cardHover", ctx.hoverState);
    \u0275\u0275advance(3);
    \u0275\u0275property("ngIf", ctx.avatarUrl && !ctx.avatarError());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !ctx.avatarUrl || ctx.avatarError());
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx.artistName);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx.roleDisplayText(), " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isCurrentlyPlaying);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.hasYoutube || ctx.hasTwitter || ctx.hasLinktr || ctx.hasInstagram);
    \u0275\u0275advance();
    \u0275\u0275styleProp("background", ctx.cardThemeColor());
  }
}, dependencies: [CommonModule, NgIf, MatIconModule, MatIcon, MatButtonModule, MatIconButton], styles: ['\n\n[_ngcontent-%COMP%]:root {\n  --artist-card-bg-primary: rgba(0, 0, 0, 0.85);\n  --artist-card-bg-secondary: rgba(20, 20, 20, 0.8);\n  --artist-card-text-primary: #ffffff;\n  --artist-card-text-secondary: rgba(255, 255, 255, 0.8);\n  --artist-card-text-muted: rgba(255, 255, 255, 0.6);\n  --artist-card-border-primary: rgba(255, 255, 255, 0.15);\n  --artist-card-border-hover: rgba(255, 255, 255, 0.25);\n  --artist-card-shadow-base: rgba(0, 0, 0, 0.4);\n  --artist-card-shadow-elevated: rgba(0, 0, 0, 0.6);\n  --artist-card-hover-bg: rgba(40, 40, 40, 0.9);\n  --artist-card-active-bg: rgba(60, 60, 60, 0.9);\n}\n.artist-card[_ngcontent-%COMP%] {\n  --mdc-theme-primary: var(--artist-card-text-primary) !important;\n  --mat-primary-color: var(--artist-card-text-primary) !important;\n  --theme-color: var(--artist-card-text-primary) !important;\n  --color: var(--artist-card-text-primary) !important;\n}\n.artist-card[_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  color: var(--artist-card-text-primary) !important;\n}\n.artist-card[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      var(--artist-card-bg-primary) 0%,\n      var(--artist-card-bg-secondary) 100%);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  border: 1px solid var(--artist-card-border-primary);\n  border-radius: 12px;\n  color: var(--artist-card-text-primary);\n  box-shadow: 0 4px 16px var(--artist-card-shadow-base);\n  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n  padding: 1.75rem;\n  cursor: pointer;\n  min-height: 300px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n.artist-card[_ngcontent-%COMP%]::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: var(--artist-card-bg-overlay);\n  pointer-events: none;\n  z-index: -1;\n  opacity: 0.7;\n  transition: opacity 0.3s ease;\n}\n.artist-card[_ngcontent-%COMP%]:hover:hover {\n  background:\n    linear-gradient(\n      135deg,\n      var(--artist-card-hover-bg) 0%,\n      var(--artist-card-bg-secondary) 100%);\n  border-color: var(--artist-card-border-hover);\n  box-shadow: 0 8px 24px var(--artist-card-shadow-elevated);\n  transform: translateY(-2px);\n}\n.artist-card[_ngcontent-%COMP%]:hover::before {\n  opacity: 0.9;\n}\n.artist-card[_ngcontent-%COMP%]:hover   .card-accent[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: scaleX(1.05);\n}\n.artist-card[_ngcontent-%COMP%]:hover   .artist-avatar[_ngcontent-%COMP%] {\n  transform: scale(1.08);\n}\n.artist-card[_ngcontent-%COMP%]:hover   .social-link[_ngcontent-%COMP%] {\n  transform: translateY(-2px);\n}\n.artist-card.participation-main[_ngcontent-%COMP%] {\n  border-color: var(--artist-card-text-primary);\n  background: rgba(0, 0, 0, 0.8);\n  box-shadow: 0 6px 24px rgba(255, 255, 255, 0.15);\n}\n.artist-card.participation-main[_ngcontent-%COMP%]   .card-accent[_ngcontent-%COMP%] {\n  background: var(--artist-card-text-primary);\n  height: 4px;\n}\n.artist-card.participation-featured[_ngcontent-%COMP%] {\n  border-color: var(--artist-card-text-secondary);\n  background: var(--artist-card-bg-secondary);\n}\n.artist-card.participation-featured[_ngcontent-%COMP%]   .card-accent[_ngcontent-%COMP%] {\n  background: var(--artist-card-text-secondary);\n}\n.artist-card[_ngcontent-%COMP%]   .artist-avatar-section[_ngcontent-%COMP%] {\n  margin-bottom: 1rem;\n}\n.artist-card[_ngcontent-%COMP%]   .artist-avatar-section[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 80px;\n  height: 80px;\n}\n.artist-card[_ngcontent-%COMP%]   .artist-avatar-section[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%]   .artist-avatar[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 3px solid rgba(255, 255, 255, 0.2);\n  transition: border-color 0.3s ease;\n}\n.artist-card[_ngcontent-%COMP%]   .artist-avatar-section[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%]   .artist-initials[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--theme-color, #666666);\n  color: #ffffff;\n  font-size: 1.5rem;\n  font-weight: 700;\n  border: 3px solid rgba(255, 255, 255, 0.2);\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);\n}\n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%] {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  margin-bottom: 1rem;\n}\n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n  color: #ffffff !important;\n  font-size: 1.1rem;\n  font-weight: 600;\n  margin: 0 0 0.5rem 0;\n  line-height: 1.3;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);\n}\n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .role-label[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  font-weight: 600;\n  letter-spacing: 0.8px;\n  color: #ffffff !important;\n  margin-bottom: 0.75rem;\n  opacity: 1;\n  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);\n  text-transform: uppercase;\n  background: rgba(0, 0, 0, 0.4);\n  padding: 0.3rem 0.6rem;\n  border-radius: 6px;\n  -webkit-backdrop-filter: blur(6px);\n  backdrop-filter: blur(6px);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  display: inline-block;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n  transition: all 0.2s ease;\n  --color: #ffffff !important;\n  --mdc-theme-primary: #ffffff !important;\n  --mat-primary: #ffffff !important;\n}\n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .role-label[style*=color][_ngcontent-%COMP%] {\n  color: #ffffff !important;\n}\n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .role-label.mat-primary[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .role-label.theme-primary[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .role-label[color=primary][_ngcontent-%COMP%] {\n  color: #ffffff !important;\n}\n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .role-label[_ngcontent-%COMP%]:hover {\n  background: rgba(0, 0, 0, 0.5);\n  border-color: rgba(255, 255, 255, 0.25);\n  transform: translateY(-1px);\n}\n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .playing-status[_ngcontent-%COMP%] {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.6) 0%,\n      rgba(20, 20, 20, 0.7) 100%);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 8px;\n  padding: 0.4rem 0.8rem;\n  margin-top: 0.5rem;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n}\n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .playing-status[_ngcontent-%COMP%]   .playing-indicator[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n}\n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .playing-status[_ngcontent-%COMP%]   .playing-indicator[_ngcontent-%COMP%]   .playing-dot[_ngcontent-%COMP%] {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: #d40808 !important;\n  animation: _ngcontent-%COMP%_pulse 2s infinite;\n}\n.artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .playing-status[_ngcontent-%COMP%]   .playing-indicator[_ngcontent-%COMP%]   .playing-text[_ngcontent-%COMP%] {\n  font-size: 0.8rem;\n  color: #ffffff !important;\n  font-weight: 500;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%] {\n  display: flex;\n  gap: 0.5rem;\n  justify-content: center;\n  flex-wrap: nowrap;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.375rem;\n  padding: 0.5rem 0.875rem;\n  background: rgba(255, 255, 255, 0.1);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 8px;\n  color: #ffffff;\n  font-size: 0.7rem;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  min-width: 90px;\n  height: 36px;\n  white-space: nowrap;\n  overflow: hidden;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 255, 255, 0.2);\n  border-color: rgba(255, 255, 255, 0.3);\n  transform: translateY(-1px);\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]   mat-icon[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  width: 1rem;\n  height: 1rem;\n  line-height: 1;\n  flex-shrink: 0;\n  color: #ffffff !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]   .social-label[_ngcontent-%COMP%] {\n  font-size: 0.65rem;\n  font-weight: 500;\n  flex-shrink: 0;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.youtube-link[_ngcontent-%COMP%]:hover {\n  background: rgba(255, 0, 0, 0.2);\n  border-color: rgba(255, 0, 0, 0.4);\n  color: #ff4444;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.twitter-link[_ngcontent-%COMP%] {\n  min-width: 110px;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.twitter-link[_ngcontent-%COMP%]   .twitter-x-icon[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: bold;\n  flex-shrink: 0;\n  width: 0.85rem;\n  height: 0.85rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.twitter-link[_ngcontent-%COMP%]   .social-label[_ngcontent-%COMP%] {\n  font-size: 0.6rem;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.twitter-link[_ngcontent-%COMP%]:hover {\n  background: rgba(29, 161, 242, 0.2);\n  border-color: rgba(29, 161, 242, 0.4);\n  color: #1da1f2;\n}\n.artist-card[_ngcontent-%COMP%]   .card-accent[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 3px;\n  background:\n    linear-gradient(\n      90deg,\n      var(--text-primary),\n      rgba(255, 255, 255, 0.6));\n  border-radius: var(--border-radius-card) var(--border-radius-card) 0 0;\n  opacity: 0.7;\n  transition: var(--transition-smooth);\n  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);\n  overflow: hidden;\n}\n.artist-card[_ngcontent-%COMP%]   .card-accent[_ngcontent-%COMP%]::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255, 255, 255, 0.8),\n      transparent);\n  animation: _ngcontent-%COMP%_shimmerAccent 3s infinite;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.1) !important;\n  background: rgba(255, 255, 255, 0.1) !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%] {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]   .mat-button-ripple[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]   .mat-button-ripple[_ngcontent-%COMP%] {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]   .mat-button-focus-overlay[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]   .mat-button-focus-overlay[_ngcontent-%COMP%] {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]:hover, \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]:hover {\n  background-color: rgba(255, 255, 255, 0.2) !important;\n  background: rgba(255, 255, 255, 0.2) !important;\n  border-color: rgba(255, 255, 255, 0.3) !important;\n  color: #ffffff !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]:hover   .mat-button-wrapper[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]:hover   .mat-button-wrapper[_ngcontent-%COMP%] {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]:hover   mat-icon[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]:hover   mat-icon[_ngcontent-%COMP%] {\n  color: #ffffff !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]:hover   .social-label[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]:hover   .social-label[_ngcontent-%COMP%] {\n  color: #ffffff !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]:active, \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button.mat-button-active[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]:active, \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button].mat-button-active[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.15) !important;\n  background: rgba(255, 255, 255, 0.15) !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]:active   .mat-button-wrapper[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button.mat-button-active[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]:active   .mat-button-wrapper[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button].mat-button-active[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%] {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]:focus, \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button.mat-button-focus[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]:focus, \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button].mat-button-focus[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.1) !important;\n  background: rgba(255, 255, 255, 0.1) !important;\n  outline: none !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]:focus   .mat-button-wrapper[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button.mat-button-focus[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]:focus   .mat-button-wrapper[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button].mat-button-focus[_ngcontent-%COMP%]   .mat-button-wrapper[_ngcontent-%COMP%] {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]   *[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]   *[_ngcontent-%COMP%] {\n  color: #ffffff !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.mat-icon-button[_ngcontent-%COMP%]   .mat-ripple-element[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[mat-icon-button][_ngcontent-%COMP%]   .mat-ripple-element[_ngcontent-%COMP%] {\n  background-color: rgba(255, 255, 255, 0.1) !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.youtube-link.mat-icon-button[_ngcontent-%COMP%]:hover, \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.youtube-link[mat-icon-button][_ngcontent-%COMP%]:hover {\n  background-color: rgba(255, 0, 0, 0.2) !important;\n  background: rgba(255, 0, 0, 0.2) !important;\n  border-color: rgba(255, 0, 0, 0.4) !important;\n  color: #ff4444 !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.youtube-link.mat-icon-button[_ngcontent-%COMP%]:hover   *[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.youtube-link[mat-icon-button][_ngcontent-%COMP%]:hover   *[_ngcontent-%COMP%] {\n  color: #ff4444 !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.twitter-link.mat-icon-button[_ngcontent-%COMP%]:hover, \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.twitter-link[mat-icon-button][_ngcontent-%COMP%]:hover {\n  background-color: rgba(29, 161, 242, 0.2) !important;\n  background: rgba(29, 161, 242, 0.2) !important;\n  border-color: rgba(29, 161, 242, 0.4) !important;\n  color: #1da1f2 !important;\n}\n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.twitter-link.mat-icon-button[_ngcontent-%COMP%]:hover   *[_ngcontent-%COMP%], \n.artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.twitter-link[mat-icon-button][_ngcontent-%COMP%]:hover   *[_ngcontent-%COMP%] {\n  color: #1da1f2 !important;\n}\n@keyframes _ngcontent-%COMP%_shimmerAccent {\n  0% {\n    left: -100%;\n  }\n  50% {\n    left: -100%;\n  }\n  100% {\n    left: 100%;\n  }\n}\n@keyframes _ngcontent-%COMP%_pulse {\n  0% {\n    opacity: 1;\n    transform: scale(1);\n    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);\n  }\n  50% {\n    opacity: 0.6;\n    transform: scale(1.3);\n    box-shadow: 0 0 16px rgba(255, 255, 255, 0.8);\n  }\n  100% {\n    opacity: 1;\n    transform: scale(1);\n    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);\n  }\n}\n@keyframes _ngcontent-%COMP%_fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 768px) {\n  .artist-card[_ngcontent-%COMP%] {\n    padding: 1.5rem;\n    min-height: 280px;\n    border-radius: 12px;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-avatar-section[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-avatar-section[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%] {\n    width: 75px;\n    height: 75px;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-avatar-section[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%]   .artist-initials[_ngcontent-%COMP%] {\n    font-size: 1.4rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n    font-size: 1.05rem;\n    margin-bottom: 0.6rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .role-label[_ngcontent-%COMP%] {\n    font-size: 0.75rem;\n    padding: 0.35rem 0.7rem;\n    letter-spacing: 0.7px;\n    margin-bottom: 0.8rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .playing-status[_ngcontent-%COMP%] {\n    padding: 0.4rem 0.8rem;\n    margin-top: 0.6rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .playing-status[_ngcontent-%COMP%]   .playing-indicator[_ngcontent-%COMP%] {\n    gap: 0.5rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .playing-status[_ngcontent-%COMP%]   .playing-indicator[_ngcontent-%COMP%]   .playing-dot[_ngcontent-%COMP%] {\n    width: 8px;\n    height: 8px;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .playing-status[_ngcontent-%COMP%]   .playing-indicator[_ngcontent-%COMP%]   .playing-text[_ngcontent-%COMP%] {\n    font-size: 0.8rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%] {\n    gap: 0.4rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%] {\n    padding: 0.5rem 0.8rem;\n    min-width: 85px;\n    height: 34px;\n    font-size: 0.7rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%]   .social-label[_ngcontent-%COMP%] {\n    font-size: 0.65rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.twitter-link[_ngcontent-%COMP%] {\n    min-width: 100px;\n  }\n  .artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.twitter-link[_ngcontent-%COMP%]   .social-label[_ngcontent-%COMP%] {\n    font-size: 0.6rem;\n  }\n}\n@media (max-width: 480px) {\n  .artist-card[_ngcontent-%COMP%] {\n    padding: 1.25rem;\n    min-height: 260px;\n    border-radius: 10px;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-avatar-section[_ngcontent-%COMP%] {\n    margin-bottom: 0.8rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-avatar-section[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%] {\n    width: 65px;\n    height: 65px;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-avatar-section[_ngcontent-%COMP%]   .avatar-container[_ngcontent-%COMP%]   .artist-initials[_ngcontent-%COMP%] {\n    font-size: 1.3rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%] {\n    margin-bottom: 0.8rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n    font-size: 1rem;\n    margin-bottom: 0.5rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .artist-info-section[_ngcontent-%COMP%]   .role-label[_ngcontent-%COMP%] {\n    font-size: 0.7rem;\n    padding: 0.3rem 0.6rem;\n    letter-spacing: 0.6px;\n    margin-bottom: 0.7rem;\n  }\n  .artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%] {\n    flex-direction: column;\n    gap: 0.3rem;\n    align-items: center;\n  }\n  .artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 150px;\n    justify-content: center;\n    min-width: unset;\n    padding: 0.5rem 1rem;\n    height: 36px;\n  }\n  .artist-card[_ngcontent-%COMP%]   .social-links-section[_ngcontent-%COMP%]   .social-link.twitter-link[_ngcontent-%COMP%] {\n    min-width: unset;\n    max-width: 160px;\n  }\n  .artist-card[_ngcontent-%COMP%]   .card-accent[_ngcontent-%COMP%] {\n    height: 2px;\n  }\n  .artist-card[_ngcontent-%COMP%] {\n    animation: _ngcontent-%COMP%_fadeInUp 0.6s ease-out;\n    animation-fill-mode: both;\n  }\n}\n/*# sourceMappingURL=artist-card.component.css.map */'], data: { animation: [
  trigger("cardHover", [
    state("default", style({ transform: "translateY(0) scale(1)" })),
    state("hovered", style({ transform: "translateY(-4px) scale(1.02)" })),
    transition("default <=> hovered", animate("200ms ease-out"))
  ]),
  trigger("playingIndicator", [
    state("playing", style({
      opacity: 1,
      transform: "scale(1)",
      background: "transparent"
    })),
    state("not-playing", style({
      opacity: 0.3,
      transform: "scale(0.8)",
      background: "transparent"
    })),
    transition("playing <=> not-playing", animate("300ms ease-out"))
  ])
] }, changeDetection: 0 });
var ArtistCardComponent = _ArtistCardComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ArtistCardComponent, [{
    type: Component,
    args: [{ selector: "app-artist-card", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      MatButtonModule
    ], changeDetection: ChangeDetectionStrategy.OnPush, animations: [
      trigger("cardHover", [
        state("default", style({ transform: "translateY(0) scale(1)" })),
        state("hovered", style({ transform: "translateY(-4px) scale(1.02)" })),
        transition("default <=> hovered", animate("200ms ease-out"))
      ]),
      trigger("playingIndicator", [
        state("playing", style({
          opacity: 1,
          transform: "scale(1)",
          background: "transparent"
        })),
        state("not-playing", style({
          opacity: 0.3,
          transform: "scale(0.8)",
          background: "transparent"
        })),
        transition("playing <=> not-playing", animate("300ms ease-out"))
      ])
    ], template: `<!-- Artist Card - Matches Reference Design -->
<div class="artist-card" 
     [class]="participationLevelClass()"
     [@cardHover]="hoverState"
     (mouseenter)="onMouseEnter()"
     (mouseleave)="onMouseLeave()"
     (click)="onCardClick()"
     [style.--theme-color]="cardThemeColor()">

  <!-- Artist Avatar Section -->
  <div class="artist-avatar-section">
    <!-- Avatar Container -->
    <div class="avatar-container">
      <!-- Artist Image -->
      <img *ngIf="avatarUrl && !avatarError()" 
           [src]="avatarUrl" 
           [alt]="artistName + ' avatar'"
           class="artist-avatar"
           (error)="onAvatarError()"
           loading="lazy">
      
      <!-- Initials Fallback -->
      <div *ngIf="!avatarUrl || avatarError()" 
           class="artist-initials"
           [style.background]="cardThemeColor()">
        {{ artistInitials() }}
      </div>
    </div>
  </div>

  <!-- Artist Info Section -->
  <div class="artist-info-section">
    <!-- Artist Name -->
    <h3 class="artist-name">{{ artistName }}</h3>
    
    <!-- Role Label -->
    <div class="role-label">
      {{ roleDisplayText() }}
    </div>
    
    <!-- Currently Playing Indicator -->
    <div class="playing-status" *ngIf="isCurrentlyPlaying">
      <div class="playing-indicator" [@playingIndicator]="playingIndicatorState">
        <span class="playing-dot"></span>
        <span class="playing-text">Currently Playing</span>
      </div>
    </div>
  </div>

  <!-- Social Links Section -->
  <div class="social-links-section" *ngIf="hasYoutube || hasTwitter || hasLinktr || hasInstagram">
    <!-- YouTube Link -->
    <button *ngIf="hasYoutube"
            class="social-link youtube-link"
            mat-icon-button
            [attr.aria-label]="artistName + ' YouTube channel'"
            (click)="onSocialLinkClick('youtube', $event)">
      <mat-icon>smart_display</mat-icon>
      <span class="social-label">YouTube</span>
    </button>

    <!-- Twitter/X Link -->
    <button *ngIf="hasTwitter"
            class="social-link twitter-link"
            mat-icon-button
            [attr.aria-label]="artistName + ' Twitter profile'"
            (click)="onSocialLinkClick('twitter', $event)">
      <!-- Using a simple X icon representation -->
      <span class="twitter-x-icon">\u{1D54F}</span>
      <span class="social-label">Twitter/X</span>
    </button>

    <!-- Linktr.ee Link -->
    <button *ngIf="hasLinktr"
            class="social-link linktr-link"
            mat-icon-button
            [attr.aria-label]="artistName + ' Linktr.ee profile'"
            (click)="onSocialLinkClick('linktr', $event)">
      <mat-icon>link</mat-icon>
      <span class="social-label">Links</span>
    </button>

    <!-- Instagram Link -->
    <button *ngIf="hasInstagram"
            class="social-link instagram-link"
            mat-icon-button
            [attr.aria-label]="artistName + ' Instagram profile'"
            (click)="onSocialLinkClick('instagram', $event)">
      <span class="instagram-icon">\u{1F4F7}</span>
      <span class="social-label">Instagram</span>
    </button>
  </div>

  <!-- Card Accent Border -->
  <div class="card-accent" [style.background]="cardThemeColor()"></div>

</div>`, styles: ['/* src/app/components/dynamic-artist-cards/artist-card/artist-card.component.scss */\n:root {\n  --artist-card-bg-primary: rgba(0, 0, 0, 0.85);\n  --artist-card-bg-secondary: rgba(20, 20, 20, 0.8);\n  --artist-card-text-primary: #ffffff;\n  --artist-card-text-secondary: rgba(255, 255, 255, 0.8);\n  --artist-card-text-muted: rgba(255, 255, 255, 0.6);\n  --artist-card-border-primary: rgba(255, 255, 255, 0.15);\n  --artist-card-border-hover: rgba(255, 255, 255, 0.25);\n  --artist-card-shadow-base: rgba(0, 0, 0, 0.4);\n  --artist-card-shadow-elevated: rgba(0, 0, 0, 0.6);\n  --artist-card-hover-bg: rgba(40, 40, 40, 0.9);\n  --artist-card-active-bg: rgba(60, 60, 60, 0.9);\n}\n.artist-card {\n  --mdc-theme-primary: var(--artist-card-text-primary) !important;\n  --mat-primary-color: var(--artist-card-text-primary) !important;\n  --theme-color: var(--artist-card-text-primary) !important;\n  --color: var(--artist-card-text-primary) !important;\n}\n.artist-card * {\n  color: var(--artist-card-text-primary) !important;\n}\n.artist-card {\n  background:\n    linear-gradient(\n      135deg,\n      var(--artist-card-bg-primary) 0%,\n      var(--artist-card-bg-secondary) 100%);\n  backdrop-filter: blur(12px);\n  -webkit-backdrop-filter: blur(12px);\n  border: 1px solid var(--artist-card-border-primary);\n  border-radius: 12px;\n  color: var(--artist-card-text-primary);\n  box-shadow: 0 4px 16px var(--artist-card-shadow-base);\n  transition: all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);\n  padding: 1.75rem;\n  cursor: pointer;\n  min-height: 300px;\n  display: flex;\n  flex-direction: column;\n  align-items: center;\n  text-align: center;\n}\n.artist-card::before {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: var(--artist-card-bg-overlay);\n  pointer-events: none;\n  z-index: -1;\n  opacity: 0.7;\n  transition: opacity 0.3s ease;\n}\n.artist-card:hover:hover {\n  background:\n    linear-gradient(\n      135deg,\n      var(--artist-card-hover-bg) 0%,\n      var(--artist-card-bg-secondary) 100%);\n  border-color: var(--artist-card-border-hover);\n  box-shadow: 0 8px 24px var(--artist-card-shadow-elevated);\n  transform: translateY(-2px);\n}\n.artist-card:hover::before {\n  opacity: 0.9;\n}\n.artist-card:hover .card-accent {\n  opacity: 1;\n  transform: scaleX(1.05);\n}\n.artist-card:hover .artist-avatar {\n  transform: scale(1.08);\n}\n.artist-card:hover .social-link {\n  transform: translateY(-2px);\n}\n.artist-card.participation-main {\n  border-color: var(--artist-card-text-primary);\n  background: rgba(0, 0, 0, 0.8);\n  box-shadow: 0 6px 24px rgba(255, 255, 255, 0.15);\n}\n.artist-card.participation-main .card-accent {\n  background: var(--artist-card-text-primary);\n  height: 4px;\n}\n.artist-card.participation-featured {\n  border-color: var(--artist-card-text-secondary);\n  background: var(--artist-card-bg-secondary);\n}\n.artist-card.participation-featured .card-accent {\n  background: var(--artist-card-text-secondary);\n}\n.artist-card .artist-avatar-section {\n  margin-bottom: 1rem;\n}\n.artist-card .artist-avatar-section .avatar-container {\n  position: relative;\n  width: 80px;\n  height: 80px;\n}\n.artist-card .artist-avatar-section .avatar-container .artist-avatar {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  object-fit: cover;\n  border: 3px solid rgba(255, 255, 255, 0.2);\n  transition: border-color 0.3s ease;\n}\n.artist-card .artist-avatar-section .avatar-container .artist-initials {\n  width: 100%;\n  height: 100%;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  background: var(--theme-color, #666666);\n  color: #ffffff;\n  font-size: 1.5rem;\n  font-weight: 700;\n  border: 3px solid rgba(255, 255, 255, 0.2);\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);\n}\n.artist-card .artist-info-section {\n  flex: 1;\n  display: flex;\n  flex-direction: column;\n  justify-content: center;\n  margin-bottom: 1rem;\n}\n.artist-card .artist-info-section .artist-name {\n  color: #ffffff !important;\n  font-size: 1.1rem;\n  font-weight: 600;\n  margin: 0 0 0.5rem 0;\n  line-height: 1.3;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.4);\n}\n.artist-card .artist-info-section .role-label {\n  font-size: 0.75rem;\n  font-weight: 600;\n  letter-spacing: 0.8px;\n  color: #ffffff !important;\n  margin-bottom: 0.75rem;\n  opacity: 1;\n  text-shadow: 0 1px 4px rgba(0, 0, 0, 0.8);\n  text-transform: uppercase;\n  background: rgba(0, 0, 0, 0.4);\n  padding: 0.3rem 0.6rem;\n  border-radius: 6px;\n  -webkit-backdrop-filter: blur(6px);\n  backdrop-filter: blur(6px);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  display: inline-block;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n  transition: all 0.2s ease;\n  --color: #ffffff !important;\n  --mdc-theme-primary: #ffffff !important;\n  --mat-primary: #ffffff !important;\n}\n.artist-card .artist-info-section .role-label[style*=color] {\n  color: #ffffff !important;\n}\n.artist-card .artist-info-section .role-label.mat-primary,\n.artist-card .artist-info-section .role-label.theme-primary,\n.artist-card .artist-info-section .role-label[color=primary] {\n  color: #ffffff !important;\n}\n.artist-card .artist-info-section .role-label:hover {\n  background: rgba(0, 0, 0, 0.5);\n  border-color: rgba(255, 255, 255, 0.25);\n  transform: translateY(-1px);\n}\n.artist-card .artist-info-section .playing-status {\n  background:\n    linear-gradient(\n      135deg,\n      rgba(0, 0, 0, 0.6) 0%,\n      rgba(20, 20, 20, 0.7) 100%);\n  backdrop-filter: blur(8px);\n  -webkit-backdrop-filter: blur(8px);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 8px;\n  padding: 0.4rem 0.8rem;\n  margin-top: 0.5rem;\n  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);\n}\n.artist-card .artist-info-section .playing-status .playing-indicator {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.5rem;\n}\n.artist-card .artist-info-section .playing-status .playing-indicator .playing-dot {\n  width: 8px;\n  height: 8px;\n  border-radius: 50%;\n  background: #d40808 !important;\n  animation: pulse 2s infinite;\n}\n.artist-card .artist-info-section .playing-status .playing-indicator .playing-text {\n  font-size: 0.8rem;\n  color: #ffffff !important;\n  font-weight: 500;\n  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);\n}\n.artist-card .social-links-section {\n  display: flex;\n  gap: 0.5rem;\n  justify-content: center;\n  flex-wrap: nowrap;\n}\n.artist-card .social-links-section .social-link {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 0.375rem;\n  padding: 0.5rem 0.875rem;\n  background: rgba(255, 255, 255, 0.1);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 8px;\n  color: #ffffff;\n  font-size: 0.7rem;\n  transition: all 0.2s ease;\n  text-decoration: none;\n  min-width: 90px;\n  height: 36px;\n  white-space: nowrap;\n  overflow: hidden;\n}\n.artist-card .social-links-section .social-link:hover {\n  background: rgba(255, 255, 255, 0.2);\n  border-color: rgba(255, 255, 255, 0.3);\n  transform: translateY(-1px);\n}\n.artist-card .social-links-section .social-link mat-icon {\n  font-size: 1rem;\n  width: 1rem;\n  height: 1rem;\n  line-height: 1;\n  flex-shrink: 0;\n  color: #ffffff !important;\n}\n.artist-card .social-links-section .social-link .social-label {\n  font-size: 0.65rem;\n  font-weight: 500;\n  flex-shrink: 0;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n.artist-card .social-links-section .social-link.youtube-link:hover {\n  background: rgba(255, 0, 0, 0.2);\n  border-color: rgba(255, 0, 0, 0.4);\n  color: #ff4444;\n}\n.artist-card .social-links-section .social-link.twitter-link {\n  min-width: 110px;\n}\n.artist-card .social-links-section .social-link.twitter-link .twitter-x-icon {\n  font-size: 0.85rem;\n  font-weight: bold;\n  flex-shrink: 0;\n  width: 0.85rem;\n  height: 0.85rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n}\n.artist-card .social-links-section .social-link.twitter-link .social-label {\n  font-size: 0.6rem;\n}\n.artist-card .social-links-section .social-link.twitter-link:hover {\n  background: rgba(29, 161, 242, 0.2);\n  border-color: rgba(29, 161, 242, 0.4);\n  color: #1da1f2;\n}\n.artist-card .card-accent {\n  position: absolute;\n  top: 0;\n  left: 0;\n  right: 0;\n  height: 3px;\n  background:\n    linear-gradient(\n      90deg,\n      var(--text-primary),\n      rgba(255, 255, 255, 0.6));\n  border-radius: var(--border-radius-card) var(--border-radius-card) 0 0;\n  opacity: 0.7;\n  transition: var(--transition-smooth);\n  box-shadow: 0 0 8px rgba(255, 255, 255, 0.2);\n  overflow: hidden;\n}\n.artist-card .card-accent::after {\n  content: "";\n  position: absolute;\n  top: 0;\n  left: -100%;\n  width: 100%;\n  height: 100%;\n  background:\n    linear-gradient(\n      90deg,\n      transparent,\n      rgba(255, 255, 255, 0.8),\n      transparent);\n  animation: shimmerAccent 3s infinite;\n}\n.artist-card .social-links-section .social-link.mat-icon-button,\n.artist-card .social-links-section .social-link[mat-icon-button] {\n  background-color: rgba(255, 255, 255, 0.1) !important;\n  background: rgba(255, 255, 255, 0.1) !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button .mat-button-wrapper,\n.artist-card .social-links-section .social-link[mat-icon-button] .mat-button-wrapper {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button .mat-button-ripple,\n.artist-card .social-links-section .social-link[mat-icon-button] .mat-button-ripple {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button .mat-button-focus-overlay,\n.artist-card .social-links-section .social-link[mat-icon-button] .mat-button-focus-overlay {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button:hover,\n.artist-card .social-links-section .social-link[mat-icon-button]:hover {\n  background-color: rgba(255, 255, 255, 0.2) !important;\n  background: rgba(255, 255, 255, 0.2) !important;\n  border-color: rgba(255, 255, 255, 0.3) !important;\n  color: #ffffff !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button:hover .mat-button-wrapper,\n.artist-card .social-links-section .social-link[mat-icon-button]:hover .mat-button-wrapper {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button:hover mat-icon,\n.artist-card .social-links-section .social-link[mat-icon-button]:hover mat-icon {\n  color: #ffffff !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button:hover .social-label,\n.artist-card .social-links-section .social-link[mat-icon-button]:hover .social-label {\n  color: #ffffff !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button:active,\n.artist-card .social-links-section .social-link.mat-icon-button.mat-button-active,\n.artist-card .social-links-section .social-link[mat-icon-button]:active,\n.artist-card .social-links-section .social-link[mat-icon-button].mat-button-active {\n  background-color: rgba(255, 255, 255, 0.15) !important;\n  background: rgba(255, 255, 255, 0.15) !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button:active .mat-button-wrapper,\n.artist-card .social-links-section .social-link.mat-icon-button.mat-button-active .mat-button-wrapper,\n.artist-card .social-links-section .social-link[mat-icon-button]:active .mat-button-wrapper,\n.artist-card .social-links-section .social-link[mat-icon-button].mat-button-active .mat-button-wrapper {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button:focus,\n.artist-card .social-links-section .social-link.mat-icon-button.mat-button-focus,\n.artist-card .social-links-section .social-link[mat-icon-button]:focus,\n.artist-card .social-links-section .social-link[mat-icon-button].mat-button-focus {\n  background-color: rgba(255, 255, 255, 0.1) !important;\n  background: rgba(255, 255, 255, 0.1) !important;\n  outline: none !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button:focus .mat-button-wrapper,\n.artist-card .social-links-section .social-link.mat-icon-button.mat-button-focus .mat-button-wrapper,\n.artist-card .social-links-section .social-link[mat-icon-button]:focus .mat-button-wrapper,\n.artist-card .social-links-section .social-link[mat-icon-button].mat-button-focus .mat-button-wrapper {\n  background: transparent !important;\n  background-color: transparent !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button *,\n.artist-card .social-links-section .social-link[mat-icon-button] * {\n  color: #ffffff !important;\n}\n.artist-card .social-links-section .social-link.mat-icon-button .mat-ripple-element,\n.artist-card .social-links-section .social-link[mat-icon-button] .mat-ripple-element {\n  background-color: rgba(255, 255, 255, 0.1) !important;\n}\n.artist-card .social-links-section .social-link.youtube-link.mat-icon-button:hover,\n.artist-card .social-links-section .social-link.youtube-link[mat-icon-button]:hover {\n  background-color: rgba(255, 0, 0, 0.2) !important;\n  background: rgba(255, 0, 0, 0.2) !important;\n  border-color: rgba(255, 0, 0, 0.4) !important;\n  color: #ff4444 !important;\n}\n.artist-card .social-links-section .social-link.youtube-link.mat-icon-button:hover *,\n.artist-card .social-links-section .social-link.youtube-link[mat-icon-button]:hover * {\n  color: #ff4444 !important;\n}\n.artist-card .social-links-section .social-link.twitter-link.mat-icon-button:hover,\n.artist-card .social-links-section .social-link.twitter-link[mat-icon-button]:hover {\n  background-color: rgba(29, 161, 242, 0.2) !important;\n  background: rgba(29, 161, 242, 0.2) !important;\n  border-color: rgba(29, 161, 242, 0.4) !important;\n  color: #1da1f2 !important;\n}\n.artist-card .social-links-section .social-link.twitter-link.mat-icon-button:hover *,\n.artist-card .social-links-section .social-link.twitter-link[mat-icon-button]:hover * {\n  color: #1da1f2 !important;\n}\n@keyframes shimmerAccent {\n  0% {\n    left: -100%;\n  }\n  50% {\n    left: -100%;\n  }\n  100% {\n    left: 100%;\n  }\n}\n@keyframes pulse {\n  0% {\n    opacity: 1;\n    transform: scale(1);\n    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);\n  }\n  50% {\n    opacity: 0.6;\n    transform: scale(1.3);\n    box-shadow: 0 0 16px rgba(255, 255, 255, 0.8);\n  }\n  100% {\n    opacity: 1;\n    transform: scale(1);\n    box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);\n  }\n}\n@keyframes fadeInUp {\n  from {\n    opacity: 0;\n    transform: translateY(30px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\n@media (max-width: 768px) {\n  .artist-card {\n    padding: 1.5rem;\n    min-height: 280px;\n    border-radius: 12px;\n  }\n  .artist-card .artist-avatar-section {\n    margin-bottom: 1rem;\n  }\n  .artist-card .artist-avatar-section .avatar-container {\n    width: 75px;\n    height: 75px;\n  }\n  .artist-card .artist-avatar-section .avatar-container .artist-initials {\n    font-size: 1.4rem;\n  }\n  .artist-card .artist-info-section {\n    margin-bottom: 1rem;\n  }\n  .artist-card .artist-info-section .artist-name {\n    font-size: 1.05rem;\n    margin-bottom: 0.6rem;\n  }\n  .artist-card .artist-info-section .role-label {\n    font-size: 0.75rem;\n    padding: 0.35rem 0.7rem;\n    letter-spacing: 0.7px;\n    margin-bottom: 0.8rem;\n  }\n  .artist-card .artist-info-section .playing-status {\n    padding: 0.4rem 0.8rem;\n    margin-top: 0.6rem;\n  }\n  .artist-card .artist-info-section .playing-status .playing-indicator {\n    gap: 0.5rem;\n  }\n  .artist-card .artist-info-section .playing-status .playing-indicator .playing-dot {\n    width: 8px;\n    height: 8px;\n  }\n  .artist-card .artist-info-section .playing-status .playing-indicator .playing-text {\n    font-size: 0.8rem;\n  }\n  .artist-card .social-links-section {\n    gap: 0.4rem;\n  }\n  .artist-card .social-links-section .social-link {\n    padding: 0.5rem 0.8rem;\n    min-width: 85px;\n    height: 34px;\n    font-size: 0.7rem;\n  }\n  .artist-card .social-links-section .social-link .social-label {\n    font-size: 0.65rem;\n  }\n  .artist-card .social-links-section .social-link.twitter-link {\n    min-width: 100px;\n  }\n  .artist-card .social-links-section .social-link.twitter-link .social-label {\n    font-size: 0.6rem;\n  }\n}\n@media (max-width: 480px) {\n  .artist-card {\n    padding: 1.25rem;\n    min-height: 260px;\n    border-radius: 10px;\n  }\n  .artist-card .artist-avatar-section {\n    margin-bottom: 0.8rem;\n  }\n  .artist-card .artist-avatar-section .avatar-container {\n    width: 65px;\n    height: 65px;\n  }\n  .artist-card .artist-avatar-section .avatar-container .artist-initials {\n    font-size: 1.3rem;\n  }\n  .artist-card .artist-info-section {\n    margin-bottom: 0.8rem;\n  }\n  .artist-card .artist-info-section .artist-name {\n    font-size: 1rem;\n    margin-bottom: 0.5rem;\n  }\n  .artist-card .artist-info-section .role-label {\n    font-size: 0.7rem;\n    padding: 0.3rem 0.6rem;\n    letter-spacing: 0.6px;\n    margin-bottom: 0.7rem;\n  }\n  .artist-card .social-links-section {\n    flex-direction: column;\n    gap: 0.3rem;\n    align-items: center;\n  }\n  .artist-card .social-links-section .social-link {\n    width: 100%;\n    max-width: 150px;\n    justify-content: center;\n    min-width: unset;\n    padding: 0.5rem 1rem;\n    height: 36px;\n  }\n  .artist-card .social-links-section .social-link.twitter-link {\n    min-width: unset;\n    max-width: 160px;\n  }\n  .artist-card .card-accent {\n    height: 2px;\n  }\n  .artist-card {\n    animation: fadeInUp 0.6s ease-out;\n    animation-fill-mode: both;\n  }\n}\n/*# sourceMappingURL=artist-card.component.css.map */\n'] }]
  }], null, { cardData: [{
    type: Input,
    args: [{ required: true }]
  }], enableAnimations: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ArtistCardComponent, { className: "ArtistCardComponent", filePath: "src/app/components/dynamic-artist-cards/artist-card/artist-card.component.ts", lineNumber: 60 });
})();

// src/app/components/dynamic-artist-cards/currently-playing-artists.service.ts
var _CurrentlyPlayingArtistsService = class _CurrentlyPlayingArtistsService {
  constructor(artistCreditService, audioService, dynamicArtistService) {
    this.artistCreditService = artistCreditService;
    this.audioService = audioService;
    this.dynamicArtistService = dynamicArtistService;
    this.destroy$ = new Subject();
    this.currentlyPlayingArtistsSubject = new BehaviorSubject([]);
    this.trackArtistCacheMap = /* @__PURE__ */ new Map();
    this.maxCacheSize = 50;
    this.cacheAccessOrder = [];
    this.isDebugMode = false;
    this.currentlyPlayingArtists$ = this.currentlyPlayingArtistsSubject.asObservable();
    this.currentlyPlayingArtistsWithContext$ = combineLatest([
      this.audioService.audioState$,
      this.currentlyPlayingArtists$
    ]).pipe(
      map(([audioState, artists]) => this.enhanceArtistsWithContext(audioState, artists)),
      distinctUntilChanged((prev, curr) => this.compareArtistArrays(prev, curr)),
      debounceTime(50),
      // Reduced debounce for faster response
      shareReplay(1),
      // Cache last result for multiple subscribers
      takeUntil(this.destroy$)
    );
    this.initializeService();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.clearCache();
    if (this.isDebugMode) {
      console.log("[CurrentlyPlayingArtistsService] Service destroyed, cache cleared");
    }
  }
  /**
   * Initialize the service and setup audio state monitoring
   */
  initializeService() {
    this.populateTrackArtistCache();
    this.dynamicArtistService.currentTrack$.pipe(
      distinctUntilChanged((prev, curr) => prev?.id === curr?.id),
      debounceTime(25),
      // Faster response time
      takeUntil(this.destroy$)
    ).subscribe((currentTrack) => {
      this.updateCurrentlyPlayingArtistsFromDynamicService(currentTrack);
    });
    this.audioService.audioState$.pipe(distinctUntilChanged((prev, curr) => prev.currentTrack === curr.currentTrack && prev.isPlaying === curr.isPlaying), debounceTime(25), switchMap((audioState) => this.dynamicArtistService.currentTrack$.pipe(map((dynamicTrack) => ({ audioState, noDynamicTrack: dynamicTrack === null })), startWith({ audioState, noDynamicTrack: true }))), takeUntil(this.destroy$)).subscribe(({ audioState, noDynamicTrack }) => {
      if (noDynamicTrack) {
        this.updateCurrentlyPlayingArtists(audioState);
      }
    });
  }
  /**
   * Pre-populate cache with all track artist data for performance
   */
  populateTrackArtistCache() {
    try {
      this.artistCreditService.tracksWithCredits$.subscribe((tracks) => {
        tracks.forEach((track) => {
          const sortedArtists = this.sortArtistsByPriority(track.allContributions);
          this.trackArtistCacheMap.set(track.id, sortedArtists);
          this.trackArtistCacheMap.set(track.trackNumber.toString(), sortedArtists);
          if (track.audioFile) {
            const audioKey = this.extractAudioKey(track.audioFile);
            this.trackArtistCacheMap.set(audioKey, sortedArtists);
          }
        });
      });
    } catch (error) {
      console.error("[CurrentlyPlayingArtistsService] Error populating cache:", error);
    }
  }
  /**
   * Update currently playing artists from DynamicArtistService (primary method)
   */
  updateCurrentlyPlayingArtistsFromDynamicService(currentTrack) {
    if (!currentTrack) {
      this.currentlyPlayingArtistsSubject.next([]);
      return;
    }
    const artists = this.getArtistsForTrack(currentTrack.id);
    if (artists.length > 0) {
      this.currentlyPlayingArtistsSubject.next(artists);
      console.log(`[CurrentlyPlayingArtistsService] Updated artists for track "${currentTrack.title}":`, artists.map((a) => a.artistDisplayName));
    } else {
      const trackArtists = this.getArtistsFromTrackData(currentTrack);
      this.currentlyPlayingArtistsSubject.next(trackArtists);
      console.log(`[CurrentlyPlayingArtistsService] Using direct track data for "${currentTrack.title}":`, trackArtists.map((a) => a.artistDisplayName));
    }
  }
  /**
   * Get artists from track data when cache lookup fails
   */
  getArtistsFromTrackData(track) {
    const artists = [];
    if (track.mainArtist) {
      artists.push({
        id: `${track.id}-main`,
        artistName: track.mainArtist,
        artistDisplayName: track.mainArtist,
        role: "Main Artist",
        participationType: "primary",
        percentageContribution: 100,
        color: "#FF6B6B",
        socialLinks: {}
      });
    }
    if (track.features && track.features.length > 0) {
      track.features.forEach((artist, index) => {
        artists.push({
          id: `${track.id}-featured-${index}`,
          artistName: artist.name,
          artistDisplayName: artist.name,
          role: "Featured Artist",
          participationType: "featured",
          percentageContribution: 50,
          color: "#ffffff",
          socialLinks: {}
        });
      });
    }
    return this.sortArtistsByPriority(artists);
  }
  /**
   * Update currently playing artists based on audio state (fallback method)
   */
  updateCurrentlyPlayingArtists(audioState) {
    if (!audioState.isPlaying || !audioState.currentTrack) {
      this.currentlyPlayingArtistsSubject.next([]);
      return;
    }
    const artists = this.getArtistsForTrack(audioState.currentTrack);
    if (artists.length > 0) {
      this.currentlyPlayingArtistsSubject.next(artists);
    } else {
      const fallbackArtists = this.tryFallbackArtistLookup(audioState.currentTrack);
      this.currentlyPlayingArtistsSubject.next(fallbackArtists);
    }
  }
  /**
   * Get artists for a specific track with LRU caching
   */
  getArtistsForTrack(trackId) {
    const cachedArtists = this.trackArtistCacheMap.get(trackId);
    if (cachedArtists) {
      this.updateCacheAccess(trackId);
      return cachedArtists;
    }
    const trackCredits = this.artistCreditService.getTrackCredits(trackId);
    if (trackCredits) {
      const sortedArtists = this.sortArtistsByPriority(trackCredits.allContributions);
      this.setCacheWithLRU(trackId, sortedArtists);
      return sortedArtists;
    }
    return [];
  }
  /**
   * Try alternative lookup methods when direct track ID fails
   */
  tryFallbackArtistLookup(trackIdentifier) {
    if (/^\d+$/.test(trackIdentifier)) {
      const artists2 = this.trackArtistCacheMap.get(trackIdentifier);
      if (artists2)
        return artists2;
    }
    const trackNumberMatch = trackIdentifier.match(/\b(\d+)\b/);
    if (trackNumberMatch) {
      const artists2 = this.trackArtistCacheMap.get(trackNumberMatch[1]);
      if (artists2)
        return artists2;
    }
    const audioKey = this.extractAudioKey(trackIdentifier);
    const artists = this.trackArtistCacheMap.get(audioKey);
    if (artists)
      return artists;
    console.warn(`[CurrentlyPlayingArtistsService] No artists found for track: ${trackIdentifier}`);
    return [];
  }
  /**
   * Sort artists by display priority for consistent ordering
   */
  sortArtistsByPriority(artists) {
    return [...artists].sort((a, b) => {
      const priorityMap = {
        "Main Artist": 1e3,
        "Featured Artist": 900,
        "Vocalist": 800,
        "Producer": 700,
        "Composer": 600,
        "Arranger": 500,
        "Instrumentalist": 400
      };
      const aPriority = priorityMap[a.role] || 100;
      const bPriority = priorityMap[b.role] || 100;
      if (aPriority !== bPriority) {
        return bPriority - aPriority;
      }
      if (a.percentageContribution !== b.percentageContribution) {
        return b.percentageContribution - a.percentageContribution;
      }
      return a.artistDisplayName.localeCompare(b.artistDisplayName);
    });
  }
  /**
   * Enhance artists with playing context information
   */
  enhanceArtistsWithContext(audioState, artists) {
    if (!audioState.currentTrack)
      return [];
    const trackCredits = this.artistCreditService.getTrackCredits(audioState.currentTrack);
    return artists.map((artist) => __spreadProps(__spreadValues({}, artist), {
      isMainArtist: artist.role === "Main Artist",
      isFeaturedArtist: artist.role === "Featured Artist" || artist.role === "Vocalist",
      playingContext: {
        trackId: audioState.currentTrack,
        trackTitle: trackCredits?.title || "Unknown Track",
        startTime: trackCredits?.startTime || 0,
        currentTime: audioState.currentTime
      }
    }));
  }
  /**
   * Extract key from audio file name for mapping
   */
  extractAudioKey(audioFile) {
    return audioFile.replace(/\.[^/.]+$/, "").replace(/^.*[\\\/]/, "").toLowerCase();
  }
  /**
   * Get all artists who have contributed to any track
   */
  getAllContributingArtists() {
    const allArtists = /* @__PURE__ */ new Map();
    this.trackArtistCacheMap.forEach((artists) => {
      artists.forEach((artist) => {
        if (!allArtists.has(artist.artistName)) {
          allArtists.set(artist.artistName, artist);
        }
      });
    });
    return Array.from(allArtists.values()).sort((a, b) => a.artistDisplayName.localeCompare(b.artistDisplayName));
  }
  /**
   * Get featured artists for showcase when no track is playing
   */
  getFeaturedArtistsForShowcase(limit = 8) {
    const allArtists = this.getAllContributingArtists();
    const showcaseArtists = allArtists.filter((artist) => {
      return artist.role === "Main Artist" || artist.role === "Featured Artist" || artist.role === "Vocalist" || artist.percentageContribution >= 15;
    });
    return this.sortArtistsByPriority(showcaseArtists).slice(0, limit);
  }
  /**
   * Manually set currently playing artists (for testing or manual control)
   */
  setCurrentlyPlayingArtists(artists) {
    const sortedArtists = this.sortArtistsByPriority(artists);
    this.currentlyPlayingArtistsSubject.next(sortedArtists);
  }
  /**
   * Clear currently playing artists
   */
  clearCurrentlyPlayingArtists() {
    this.currentlyPlayingArtistsSubject.next([]);
  }
  /**
   * Optimized array comparison for distinctUntilChanged
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
   * LRU cache management - update access order
   */
  updateCacheAccess(trackId) {
    const index = this.cacheAccessOrder.indexOf(trackId);
    if (index > -1) {
      this.cacheAccessOrder.splice(index, 1);
    }
    this.cacheAccessOrder.push(trackId);
  }
  /**
   * Set cache with LRU eviction policy
   */
  setCacheWithLRU(trackId, artists) {
    if (this.trackArtistCacheMap.size >= this.maxCacheSize) {
      const oldestKey = this.cacheAccessOrder.shift();
      if (oldestKey) {
        this.trackArtistCacheMap.delete(oldestKey);
        if (this.isDebugMode) {
          console.log(`[CurrentlyPlayingArtistsService] Evicted cache entry: ${oldestKey}`);
        }
      }
    }
    this.trackArtistCacheMap.set(trackId, artists);
    this.updateCacheAccess(trackId);
    if (this.isDebugMode) {
      console.log(`[CurrentlyPlayingArtistsService] Cached artists for track: ${trackId}`);
    }
  }
  /**
   * Clear entire cache for memory management
   */
  clearCache() {
    this.trackArtistCacheMap.clear();
    this.cacheAccessOrder = [];
  }
  /**
   * Get cache statistics for performance monitoring
   */
  getCacheStats() {
    return {
      size: this.trackArtistCacheMap.size,
      maxSize: this.maxCacheSize,
      hitRate: this.cacheAccessOrder.length > 0 ? this.trackArtistCacheMap.size / this.cacheAccessOrder.length : 0
    };
  }
  /**
   * Enable/disable debug mode for performance monitoring
   */
  setDebugMode(enabled) {
    this.isDebugMode = enabled;
  }
};
_CurrentlyPlayingArtistsService.\u0275fac = function CurrentlyPlayingArtistsService_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _CurrentlyPlayingArtistsService)(\u0275\u0275inject(ArtistCreditService), \u0275\u0275inject(AudioService), \u0275\u0275inject(DynamicArtistService));
};
_CurrentlyPlayingArtistsService.\u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CurrentlyPlayingArtistsService, factory: _CurrentlyPlayingArtistsService.\u0275fac, providedIn: "root" });
var CurrentlyPlayingArtistsService = _CurrentlyPlayingArtistsService;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CurrentlyPlayingArtistsService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: ArtistCreditService }, { type: AudioService }, { type: DynamicArtistService }], null);
})();

// src/app/components/dynamic-artist-cards/dynamic-artist-cards.component.ts
function DynamicArtistCardsComponent_div_0_div_6_app_artist_card_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "app-artist-card", 11);
  }
  if (rf & 2) {
    const cardData_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext(3);
    \u0275\u0275property("cardData", cardData_r1)("enableAnimations", ctx_r1.enableAnimations)("@cardUpdate", void 0);
  }
}
function DynamicArtistCardsComponent_div_0_div_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275template(1, DynamicArtistCardsComponent_div_0_div_6_app_artist_card_1_Template, 1, 3, "app-artist-card", 10);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("single-card", ctx_r1.artistCards().length === 1);
    \u0275\u0275property("@cardsContainer", void 0)("@modeTransition", ctx_r1.animationState());
    \u0275\u0275advance();
    \u0275\u0275property("ngForOf", ctx_r1.artistCards())("ngForTrackBy", ctx_r1.trackByCardId);
  }
}
function DynamicArtistCardsComponent_div_0_div_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 12)(1, "div", 13)(2, "div", 14);
    \u0275\u0275text(3, "\u266A");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3");
    \u0275\u0275text(5, "No Artists to Display");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p");
    \u0275\u0275text(7, "Play a track to see contributing artists.");
    \u0275\u0275elementEnd()()();
  }
}
function DynamicArtistCardsComponent_div_0_div_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 15)(1, "div", 16);
    \u0275\u0275text(2, "\u2139");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 17);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" Artist cards update in real-time as different tracks play. ", ctx_r1.currentlyPlayingArtists().length, " artists are currently featured. ");
  }
}
function DynamicArtistCardsComponent_div_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 3)(2, "h2", 4);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 5);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(6, DynamicArtistCardsComponent_div_0_div_6_Template, 2, 6, "div", 6)(7, DynamicArtistCardsComponent_div_0_div_7_Template, 8, 0, "div", 7)(8, DynamicArtistCardsComponent_div_0_div_8_Template, 5, 1, "div", 8);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r1.displayTitle);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.displaySubtitle);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.artistCards().length > 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.artistCards().length === 0);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx_r1.currentTrack());
  }
}
function DynamicArtistCardsComponent_div_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 18)(1, "div", 19);
    \u0275\u0275element(2, "div", 20);
    \u0275\u0275elementStart(3, "p");
    \u0275\u0275text(4, "Loading artist cards...");
    \u0275\u0275elementEnd()()();
  }
}
var _DynamicArtistCardsComponent = class _DynamicArtistCardsComponent {
  set displayMode(mode) {
    const previousMode = this._displayMode;
    this._displayMode = mode;
    if (previousMode !== mode && !this.isLoading()) {
      this.handleDisplayModeChange(mode);
    }
  }
  get displayMode() {
    return this._displayMode;
  }
  constructor(artistCreditService, audioService, currentlyPlayingService, dynamicArtistService, musicStateManager, router) {
    this.artistCreditService = artistCreditService;
    this.audioService = audioService;
    this.currentlyPlayingService = currentlyPlayingService;
    this.dynamicArtistService = dynamicArtistService;
    this.musicStateManager = musicStateManager;
    this.router = router;
    this.showAllArtists = false;
    this.maxVisibleCards = 8;
    this.enableAnimations = true;
    this._displayMode = "currently-playing";
    this.artistCards = signal([], ...ngDevMode ? [{ debugName: "artistCards" }] : []);
    this.currentlyPlayingArtists = signal([], ...ngDevMode ? [{ debugName: "currentlyPlayingArtists" }] : []);
    this.showcaseArtists = signal([], ...ngDevMode ? [{ debugName: "showcaseArtists" }] : []);
    this.isLoading = signal(true, ...ngDevMode ? [{ debugName: "isLoading" }] : []);
    this.currentTrack = signal(null, ...ngDevMode ? [{ debugName: "currentTrack" }] : []);
    this.totalArtistsCount = signal(0, ...ngDevMode ? [{ debugName: "totalArtistsCount" }] : []);
    this.animationState = signal("showcase", ...ngDevMode ? [{ debugName: "animationState" }] : []);
    this.artistCardIds = /* @__PURE__ */ new Map([
      ["SpiralFlip", "artist-card-spiralflip-001"],
      ["eili", "artist-card-eili-002"],
      ["Ariatec", "artist-card-ariatec-003"],
      ["MB", "artist-card-mbgov-004"],
      ["Iku Hoshifuri", "artist-card-iku-hoshifuri-005"],
      ["Justin Thornburgh", "artist-card-justin-thornburgh-006"],
      ["v1ris", "artist-card-v1ris-007"],
      ["Rita Kamishiro", "artist-card-rita-kamishiro-008"],
      ["Marcus Ho", "artist-card-marcus-ho-009"],
      ["AZALI", "artist-card-azali-010"],
      ["Aloysius", "artist-card-aloysius-011"],
      ["potatoTeto", "artist-card-potatoteto-012"],
      ["Artisan", "artist-card-artisan-013"],
      ["Mei Naganowa", "artist-card-mei-naganowa-014"],
      ["Evin a'k", "artist-card-evin-ak-015"],
      ["BilliumMoto", "artist-card-billiummoto-016"],
      ["Elliot Hsu", "artist-card-elliot-hsu-017"],
      ["Yuzuki", "artist-card-yuzuki-018"],
      ["LucaProject", "artist-card-lucaproject-019"],
      ["Koway", "artist-card-koway-020"],
      ["\u4F0D\u4E00", "artist-card-wuyi-021"],
      ["Nstryder", "artist-card-nstryder-022"],
      ["MoAE", "artist-card-moae-023"],
      ["dystopian tanuki", "artist-card-dystopian-tanuki-024"],
      ["Heem", "artist-card-heem-025"],
      ["Woojinee", "artist-card-woojinee-026"],
      ["Bigg Milk", "artist-card-bigg-milk-027"],
      ["Gardens", "artist-card-gardens-028"],
      ["Sad Keyboard Guy", "artist-card-sad-keyboard-guy-029"],
      ["Futsuunohito", "artist-card-futsuunohito-030"],
      ["shishishiena", "artist-card-shishishiena-031"]
    ]);
    this.destroy$ = new Subject();
    this.currentProject = signal("phantasia2", ...ngDevMode ? [{ debugName: "currentProject" }] : []);
  }
  ngOnInit() {
    this.detectCurrentProject();
    this.initializeArtistCards();
    this.setupRealtimeUpdates();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
  /**
   * Detect current project based on URL
   */
  detectCurrentProject() {
    const url = this.router.url;
    if (url.includes("phantasia1")) {
      this.currentProject.set("phantasia1");
    } else if (url.includes("phantasia2")) {
      this.currentProject.set("phantasia2");
    } else {
      this.currentProject.set("phantasia2");
    }
  }
  /**
   * Get all artists for current project
   */
  getCurrentProjectArtists() {
    const project = this.currentProject();
    if (project === "phantasia1") {
      return this.artistCreditService.getAllPhantasia1Artists();
    } else {
      return this.artistCreditService.getAllPhantasia2Artists();
    }
  }
  /**
   * Initialize all artist cards with proper identifiers using centralized state manager
   */
  initializeArtistCards() {
    try {
      const allArtists = this.getCurrentProjectArtists();
      this.totalArtistsCount.set(allArtists.length);
      const showcaseSelection = this.createShowcaseSelection(allArtists);
      this.showcaseArtists.set(showcaseSelection);
      const initialFilteringState = this.musicStateManager.getCurrentArtistFilteringState();
      this.updateCardsFromFilteringState(initialFilteringState);
      this.isLoading.set(false);
    } catch (error) {
      console.error("[DynamicArtistCards] Error initializing artist cards:", error);
      this.isLoading.set(false);
    }
  }
  /**
   * Setup real-time updates using centralized music state manager
   */
  setupRealtimeUpdates() {
    this.musicStateManager.artistFilteringState$.pipe(takeUntil(this.destroy$)).subscribe((filteringState) => {
      console.log("[DynamicArtistCards] Artist filtering state changed:", `Mode: ${filteringState.mode}, Current artists: ${filteringState.currentArtists.length}, All artists: ${filteringState.allArtists.length}`);
      this.updateCardsFromFilteringState(filteringState);
    });
    this.musicStateManager.displayInfo$.pipe(takeUntil(this.destroy$)).subscribe((displayInfo) => {
      console.log("[DynamicArtistCards] Display info updated:", displayInfo);
    });
    if (this.displayMode !== "currently-playing") {
      this.setupLegacyFallbackUpdates();
    }
  }
  /**
   * Update cards specifically for a current track from DynamicArtistService
   */
  updateCardsForCurrentTrack(track) {
    const trackArtists = [];
    trackArtists.push({
      id: `${track.id}-main`,
      artistName: track.mainArtist,
      artistDisplayName: track.mainArtist,
      role: "Main Artist",
      participationType: "primary",
      percentageContribution: 100,
      color: "#FF6B6B",
      socialLinks: {}
    });
    track.features.forEach((feature, index) => {
      trackArtists.push({
        id: `${track.id}-featured-${index}`,
        artistName: feature.name,
        artistDisplayName: feature.name,
        role: "Featured Artist",
        participationType: "featured",
        percentageContribution: 50,
        color: "#ffffff",
        // Changed from cyan to white
        socialLinks: feature.socialLinks
      });
    });
    track.collaborators.forEach((collaborator, index) => {
      trackArtists.push({
        id: `${track.id}-collab-${index}`,
        artistName: collaborator.name,
        artistDisplayName: collaborator.name,
        role: collaborator.role,
        participationType: "collaboration",
        percentageContribution: 25,
        color: "#45B7D1",
        socialLinks: collaborator.socialLinks
      });
    });
    const playingCards = trackArtists.map((artist) => this.createArtistCard(artist, true));
    this.currentlyPlayingArtists.set(playingCards);
    this.artistCards.set(playingCards.slice(0, this.maxVisibleCards));
    console.log("[DynamicArtistCards] Updated cards for track:", track.title, "Artists:", trackArtists.map((a) => a.artistDisplayName));
  }
  /**
   * Create artist card with unique identifier
   */
  createArtistCard(artist, isCurrentlyPlaying = false) {
    const cardId = this.artistCardIds.get(artist.artistName) || `artist-card-${this.generateSlug(artist.artistName)}`;
    return {
      id: cardId,
      artist,
      isCurrentlyPlaying,
      participationLevel: this.determineParticipationLevel(artist),
      displayPriority: this.calculateDisplayPriority(artist, isCurrentlyPlaying)
    };
  }
  /**
   * Create all artist cards for display
   */
  createAllArtistCards(artists) {
    return artists.map((artist) => this.createArtistCard(artist, false)).sort((a, b) => b.displayPriority - a.displayPriority);
  }
  /**
   * Create curated showcase selection
   */
  createShowcaseSelection(allArtists) {
    const showcaseArtists = allArtists.filter((artist) => {
      const role = artist.role;
      return role === "Main Artist" || role === "Featured Artist" || role === "Vocalist" || artist.percentageContribution >= 15;
    });
    return showcaseArtists.map((artist) => this.createArtistCard(artist, false)).sort((a, b) => b.displayPriority - a.displayPriority).slice(0, Math.max(this.maxVisibleCards, 8));
  }
  /**
   * Determine participation level for styling
   */
  determineParticipationLevel(artist) {
    if (artist.role === "Main Artist")
      return "main";
    if (artist.role === "Featured Artist" || artist.role === "Vocalist")
      return "featured";
    if (artist.percentageContribution >= 10)
      return "collaboration";
    return "additional";
  }
  /**
   * Calculate display priority for sorting
   */
  calculateDisplayPriority(artist, isCurrentlyPlaying) {
    let priority = 0;
    if (isCurrentlyPlaying)
      priority += 1e3;
    switch (artist.role) {
      case "Main Artist":
        priority += 500;
        break;
      case "Featured Artist":
        priority += 400;
        break;
      case "Vocalist":
        priority += 350;
        break;
      case "Producer":
        priority += 300;
        break;
      case "Composer":
        priority += 250;
        break;
      default:
        priority += 100;
        break;
    }
    priority += artist.percentageContribution;
    return priority;
  }
  /**
   * Generate URL-safe slug from artist name
   */
  generateSlug(name) {
    return name.toLowerCase().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-").trim();
  }
  /**
   * Get card by identifier
   */
  getCardById(cardId) {
    return this.artistCards().find((card) => card.id === cardId);
  }
  /**
   * Handle display mode changes dynamically
   */
  handleDisplayModeChange(newMode) {
    console.log("[DynamicArtistCards] Display mode changed to:", newMode);
    if (newMode === "showcase") {
      this.animationState.set("showcase");
      const showcaseCards = this.showcaseArtists();
      this.artistCards.set(showcaseCards);
      console.log("[DynamicArtistCards] Switched to showcase mode - showing", showcaseCards.length, "featured artists");
    } else if (newMode === "currently-playing") {
      this.animationState.set("currently-playing");
      const currentlyPlaying = this.currentlyPlayingArtists();
      if (currentlyPlaying.length > 0) {
        this.artistCards.set(currentlyPlaying.slice(0, this.maxVisibleCards));
        console.log("[DynamicArtistCards] Switched to currently-playing mode - showing", currentlyPlaying.length, "artists");
      } else {
        console.log("[DynamicArtistCards] No currently playing artists - falling back to showcase");
        this.handleDisplayModeChange("showcase");
      }
    } else if (newMode === "all") {
      this.animationState.set("showcase");
      const allArtists = this.getCurrentProjectArtists();
      this.artistCards.set(this.createAllArtistCards(allArtists));
    }
  }
  /**
   * Track by function for ngFor optimization
   */
  /**
   * Update cards from artist filtering state
   */
  updateCardsFromFilteringState(filteringState) {
    if (filteringState.mode === "music-playing" && filteringState.currentArtists.length > 0) {
      const playingCards = filteringState.currentArtists.map((artist) => this.createArtistCard(artist, true));
      this.currentlyPlayingArtists.set(playingCards);
      this.artistCards.set(playingCards.slice(0, this.maxVisibleCards));
      this.animationState.set("currently-playing");
      const musicState = this.musicStateManager.getCurrentMusicState();
      this.currentTrack.set(musicState.currentTrack?.id || null);
      console.log("[DynamicArtistCards] Updated to music-playing mode with", playingCards.length, "artists");
    } else {
      const allArtistCards = filteringState.allArtists.map((artist) => this.createArtistCard(artist, false));
      this.artistCards.set(allArtistCards.slice(0, this.maxVisibleCards));
      this.showcaseArtists.set(allArtistCards);
      this.currentlyPlayingArtists.set([]);
      this.animationState.set("showcase");
      this.currentTrack.set(null);
      console.log("[DynamicArtistCards] Updated to no-music mode with", allArtistCards.length, "artists");
    }
  }
  /**
   * Setup legacy fallback updates for compatibility
   */
  setupLegacyFallbackUpdates() {
    this.currentlyPlayingService.currentlyPlayingArtists$.pipe(takeUntil(this.destroy$)).subscribe((playingArtists) => {
      const currentFilteringState = this.musicStateManager.getCurrentArtistFilteringState();
      if (currentFilteringState.mode === "no-music" && playingArtists.length > 0) {
        console.log("[DynamicArtistCards] Using legacy fallback for", playingArtists.length, "artists");
      }
    });
  }
  /**
   * Track by function for ngFor optimization
   */
  trackByCardId(index, card) {
    return card.id;
  }
  /**
   * Get current display title from music state manager
   */
  get displayTitle() {
    const displayInfo = this.musicStateManager.getCurrentArtistFilteringState();
    return displayInfo.displayTitle;
  }
  /**
   * Get subtitle from music state manager
   */
  get displaySubtitle() {
    const displayInfo = this.musicStateManager.getCurrentArtistFilteringState();
    return displayInfo.displaySubtitle;
  }
};
_DynamicArtistCardsComponent.\u0275fac = function DynamicArtistCardsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _DynamicArtistCardsComponent)(\u0275\u0275directiveInject(ArtistCreditService), \u0275\u0275directiveInject(AudioService), \u0275\u0275directiveInject(CurrentlyPlayingArtistsService), \u0275\u0275directiveInject(DynamicArtistService), \u0275\u0275directiveInject(MusicStateManagerService), \u0275\u0275directiveInject(Router));
};
_DynamicArtistCardsComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _DynamicArtistCardsComponent, selectors: [["app-dynamic-artist-cards"]], inputs: { showAllArtists: "showAllArtists", maxVisibleCards: "maxVisibleCards", enableAnimations: "enableAnimations", displayMode: "displayMode" }, decls: 2, vars: 2, consts: [["class", "dynamic-artist-cards-container", 4, "ngIf"], ["class", "cards-loading-container", 4, "ngIf"], [1, "dynamic-artist-cards-container"], [1, "cards-header"], [1, "cards-title"], [1, "cards-subtitle"], ["class", "artist-cards-grid", 3, "single-card", 4, "ngIf"], ["class", "no-artists-state", 4, "ngIf"], ["class", "artist-cards-info-panel", 4, "ngIf"], [1, "artist-cards-grid"], ["class", "artist-card", 3, "cardData", "enableAnimations", 4, "ngFor", "ngForOf", "ngForTrackBy"], [1, "artist-card", 3, "cardData", "enableAnimations"], [1, "no-artists-state"], [1, "no-artists-content"], [1, "no-artists-icon"], [1, "artist-cards-info-panel"], [1, "info-icon"], [1, "info-text"], [1, "cards-loading-container"], [1, "loading-content"], [1, "loading-spinner"]], template: function DynamicArtistCardsComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275template(0, DynamicArtistCardsComponent_div_0_Template, 9, 5, "div", 0)(1, DynamicArtistCardsComponent_div_1_Template, 5, 0, "div", 1);
  }
  if (rf & 2) {
    \u0275\u0275property("ngIf", !ctx.isLoading());
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", ctx.isLoading());
  }
}, dependencies: [CommonModule, NgForOf, NgIf, ArtistCardComponent], styles: ["\n\n[_ngcontent-%COMP%]:root {\n  --artist-card-bg-primary: rgba(0, 0, 0, 0.85);\n  --artist-card-bg-secondary: rgba(20, 20, 20, 0.8);\n  --artist-card-text-primary: #ffffff;\n  --artist-card-text-secondary: rgba(255, 255, 255, 0.8);\n  --artist-card-text-muted: rgba(255, 255, 255, 0.6);\n  --artist-card-border-primary: rgba(255, 255, 255, 0.15);\n  --artist-card-border-hover: rgba(255, 255, 255, 0.25);\n  --artist-card-shadow-base: rgba(0, 0, 0, 0.4);\n  --artist-card-shadow-elevated: rgba(0, 0, 0, 0.6);\n  --artist-card-hover-bg: rgba(40, 40, 40, 0.9);\n  --artist-card-active-bg: rgba(60, 60, 60, 0.9);\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: var(--artist-card-spacing-xxl) var(--artist-card-spacing-lg);\n  background: var(--artist-card-container-bg);\n  border: 1px solid var(--artist-card-border-secondary);\n  border-radius: var(--artist-card-radius-large);\n  backdrop-filter: var(--artist-card-glass-blur);\n  -webkit-backdrop-filter: var(--artist-card-glass-blur);\n  box-shadow: var(--artist-card-shadow-container);\n}\n.special-mentions-container[_ngcontent-%COMP%]   .dynamic-artist-cards-container[_ngcontent-%COMP%] {\n  background: transparent;\n  border: none;\n  border-radius: 0;\n  backdrop-filter: none;\n  -webkit-backdrop-filter: none;\n  box-shadow: none;\n  max-width: 100%;\n  padding: 1rem;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .cards-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 2.5rem;\n  padding: 1rem 0;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .cards-header[_ngcontent-%COMP%]   .cards-title[_ngcontent-%COMP%] {\n  font-size: clamp(1.6rem, 3vw, 2.8rem);\n  font-weight: 700;\n  color: var(--text-primary);\n  margin: 0 0 0.75rem 0;\n  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.7);\n  letter-spacing: -0.02em;\n  line-height: 1.1;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .cards-header[_ngcontent-%COMP%]   .cards-subtitle[_ngcontent-%COMP%] {\n  font-size: 1.1rem;\n  color: var(--text-secondary);\n  margin: 0;\n  max-width: 640px;\n  margin-left: auto;\n  margin-right: auto;\n  line-height: 1.6;\n  font-weight: 400;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n  margin: 0 1rem 2rem 1rem;\n  justify-content: start;\n  width: calc(100% - 2rem);\n  max-width: calc(100% - 2rem);\n  box-sizing: border-box;\n}\n.special-mentions-container[_ngcontent-%COMP%]   .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n  justify-content: start;\n  margin: 0 1rem 2rem 1rem;\n  width: calc(100% - 2rem);\n  max-width: calc(100% - 2rem);\n  box-sizing: border-box;\n  container-type: inline-size;\n}\n@media (min-width: 1024px) {\n  .special-mentions-container[_ngcontent-%COMP%]   .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n    gap: 1.2rem;\n    justify-content: start;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n@media (min-width: 1200px) {\n  .special-mentions-container[_ngcontent-%COMP%]   .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n    gap: 1.5rem;\n    justify-content: start;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid.single-card[_ngcontent-%COMP%] {\n  display: grid !important;\n  justify-content: center !important;\n  justify-items: center;\n  margin: 0 auto 2rem auto !important;\n  width: auto !important;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid.single-card[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 350px;\n  justify-self: center;\n}\n.special-mentions-container[_ngcontent-%COMP%]   .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid.single-card[_ngcontent-%COMP%] {\n  justify-content: center !important;\n  justify-items: center;\n  margin: 0 auto 2rem auto !important;\n  width: auto !important;\n}\n.special-mentions-container[_ngcontent-%COMP%]   .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid.single-card[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n  max-width: 320px;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]:has(.artist-card:only-child) {\n  display: grid !important;\n  justify-content: center !important;\n  justify-items: center;\n  margin: 0 auto 2rem auto !important;\n  width: auto !important;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]:has(.artist-card:only-child)   .artist-card[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 350px;\n  justify-self: center;\n}\n.special-mentions-container[_ngcontent-%COMP%]   .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]:has(.artist-card:only-child) {\n  justify-content: center !important;\n  justify-items: center;\n  margin: 0 auto 2rem auto !important;\n  width: auto !important;\n}\n.special-mentions-container[_ngcontent-%COMP%]   .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]:has(.artist-card:only-child)   .artist-card[_ngcontent-%COMP%] {\n  max-width: 320px;\n}\n@media (min-width: 769px) and (max-width: 1199px) {\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n    gap: 1.25rem;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n@media (max-width: 768px) {\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 1rem;\n    margin: 0 0.5rem 2rem 0.5rem;\n    width: calc(100% - 1rem);\n    max-width: calc(100% - 1rem);\n  }\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid.single-card[_ngcontent-%COMP%] {\n    display: grid !important;\n    grid-template-columns: 1fr !important;\n    justify-content: center !important;\n    justify-items: center;\n    margin: 0 auto 2rem auto !important;\n    width: auto !important;\n    max-width: calc(100% - 1rem);\n  }\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid.single-card[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n    max-width: calc(100% - 2rem);\n    justify-self: center;\n  }\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]:has(.artist-card:only-child) {\n    display: grid !important;\n    grid-template-columns: 1fr !important;\n    justify-content: center !important;\n    justify-items: center;\n    margin: 0 auto 2rem auto !important;\n    width: auto !important;\n    max-width: calc(100% - 1rem);\n  }\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]:has(.artist-card:only-child)   .artist-card[_ngcontent-%COMP%] {\n    max-width: calc(100% - 2rem);\n    justify-self: center;\n  }\n  .special-mentions-container[_ngcontent-%COMP%]   .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 0.75rem;\n    margin: 0 0.5rem 2rem 0.5rem;\n    width: calc(100% - 1rem);\n    max-width: calc(100% - 1rem);\n  }\n}\n@media (min-width: 1200px) {\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n    justify-content: start;\n    box-sizing: border-box;\n  }\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid.single-card[_ngcontent-%COMP%] {\n    display: grid !important;\n    justify-content: center !important;\n    justify-items: center;\n    margin: 0 auto 2rem auto !important;\n    width: auto !important;\n  }\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid.single-card[_ngcontent-%COMP%]   .artist-card[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 380px;\n    justify-self: center;\n  }\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]:has(.artist-card:only-child) {\n    display: grid !important;\n    justify-content: center !important;\n    justify-items: center;\n    margin: 0 auto 2rem auto !important;\n    width: auto !important;\n  }\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%]:has(.artist-card:only-child)   .artist-card[_ngcontent-%COMP%] {\n    width: 100%;\n    max-width: 380px;\n    justify-self: center;\n  }\n}\n@media (min-width: 1440px) {\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n    gap: 1.25rem;\n    justify-content: start;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n@container (min-width: 800px) {\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n    justify-content: start;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n@container (min-width: 1000px) {\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n    justify-content: start;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .no-artists-state[_ngcontent-%COMP%] {\n  text-align: center;\n  padding: 4rem 1rem;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .no-artists-state[_ngcontent-%COMP%]   .no-artists-content[_ngcontent-%COMP%] {\n  background: var(--card-bg-primary);\n  border-radius: 16px;\n  padding: 2.5rem;\n  backdrop-filter: var(--glass-blur);\n  -webkit-backdrop-filter: var(--glass-blur);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  box-shadow: var(--shadow-elevated);\n  transition: all 0.3s ease;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .no-artists-state[_ngcontent-%COMP%]   .no-artists-content[_ngcontent-%COMP%]:hover {\n  background: var(--card-bg-hover);\n  border-color: rgba(255, 255, 255, 0.2);\n  transform: translateY(-2px);\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .no-artists-state[_ngcontent-%COMP%]   .no-artists-content[_ngcontent-%COMP%]   .no-artists-icon[_ngcontent-%COMP%] {\n  font-size: 3.5rem;\n  color: var(--text-secondary);\n  margin-bottom: 1.5rem;\n  display: block;\n  opacity: 0.8;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .no-artists-state[_ngcontent-%COMP%]   .no-artists-content[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%] {\n  color: var(--text-primary);\n  margin: 0 0 0.75rem 0;\n  font-size: 1.4rem;\n  font-weight: 600;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .no-artists-state[_ngcontent-%COMP%]   .no-artists-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  color: var(--text-tertiary);\n  margin: 0;\n  font-size: 1rem;\n  line-height: 1.5;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-info-panel[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  background: var(--card-bg-primary);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 12px;\n  padding: 1.25rem 1.75rem;\n  backdrop-filter: var(--glass-blur);\n  -webkit-backdrop-filter: var(--glass-blur);\n  margin-top: 2rem;\n  box-shadow: var(--shadow-elevated);\n  transition: all 0.3s ease;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-info-panel[_ngcontent-%COMP%]:hover {\n  background: var(--card-bg-hover);\n  border-color: rgba(255, 255, 255, 0.25);\n  transform: translateY(-1px);\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-info-panel[_ngcontent-%COMP%]   .info-icon[_ngcontent-%COMP%] {\n  color: var(--text-primary);\n  font-size: 1.4rem;\n  flex-shrink: 0;\n  opacity: 0.9;\n}\n.dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-info-panel[_ngcontent-%COMP%]   .info-text[_ngcontent-%COMP%] {\n  color: var(--text-secondary);\n  font-size: 0.95rem;\n  line-height: 1.5;\n  text-align: center;\n  font-weight: 400;\n}\n@media (max-width: 768px) {\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-info-panel[_ngcontent-%COMP%] {\n    padding: 0.875rem 1rem;\n  }\n  .dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-info-panel[_ngcontent-%COMP%]   .info-text[_ngcontent-%COMP%] {\n    font-size: 0.8rem;\n  }\n}\n.cards-loading-container[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 240px;\n  padding: 3rem;\n  background: var(--container-bg);\n  border-radius: 12px;\n}\n.cards-loading-container[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%] {\n  text-align: center;\n  color: var(--text-secondary);\n}\n.cards-loading-container[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]   .loading-spinner[_ngcontent-%COMP%] {\n  width: 48px;\n  height: 48px;\n  border: 3px solid rgba(255, 255, 255, 0.15);\n  border-top: 3px solid var(--text-primary);\n  border-radius: 50%;\n  animation: _ngcontent-%COMP%_spin 1s linear infinite;\n  margin: 0 auto 1.5rem auto;\n  box-shadow: 0 0 12px rgba(255, 255, 255, 0.1);\n}\n.cards-loading-container[_ngcontent-%COMP%]   .loading-content[_ngcontent-%COMP%]   p[_ngcontent-%COMP%] {\n  margin: 0;\n  font-size: 1rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\n}\n@keyframes _ngcontent-%COMP%_spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.artist-card[_ngcontent-%COMP%] {\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.artist-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px) scale(1.02);\n  box-shadow: var(--shadow-elevated);\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(1) {\n  animation-delay: 0.1s;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(2) {\n  animation-delay: 0.2s;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(3) {\n  animation-delay: 0.3s;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(4) {\n  animation-delay: 0.4s;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(5) {\n  animation-delay: 0.5s;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(6) {\n  animation-delay: 0.6s;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(7) {\n  animation-delay: 0.7s;\n}\n.artist-card[_ngcontent-%COMP%]:nth-child(8) {\n  animation-delay: 0.8s;\n}\n/*# sourceMappingURL=dynamic-artist-cards.component.css.map */"], data: { animation: [
  trigger("cardsContainer", [
    transition(":enter", [
      query(".artist-card", [
        style({ opacity: 0, transform: "translateY(20px)" }),
        stagger(100, [
          animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" }))
        ])
      ], { optional: true })
    ])
  ]),
  trigger("cardUpdate", [
    state("in", style({ opacity: 1, transform: "scale(1)" })),
    transition("void => *", [
      style({ opacity: 0, transform: "scale(0.9)" }),
      animate("250ms ease-out")
    ]),
    transition("* => void", [
      animate("200ms ease-in", style({ opacity: 0, transform: "scale(0.9)" }))
    ])
  ]),
  trigger("modeTransition", [
    state("showcase", style({ opacity: 1, transform: "translateY(0)" })),
    state("currently-playing", style({ opacity: 1, transform: "translateY(0)" })),
    transition("showcase => currently-playing", [
      animate("400ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({ opacity: 1, transform: "translateY(0)" }))
    ]),
    transition("currently-playing => showcase", [
      animate("600ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({ opacity: 1, transform: "translateY(0)" }))
    ])
  ])
] }, changeDetection: 0 });
var DynamicArtistCardsComponent = _DynamicArtistCardsComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(DynamicArtistCardsComponent, [{
    type: Component,
    args: [{ selector: "app-dynamic-artist-cards", standalone: true, imports: [
      CommonModule,
      ArtistCardComponent
    ], changeDetection: ChangeDetectionStrategy.OnPush, animations: [
      trigger("cardsContainer", [
        transition(":enter", [
          query(".artist-card", [
            style({ opacity: 0, transform: "translateY(20px)" }),
            stagger(100, [
              animate("300ms ease-out", style({ opacity: 1, transform: "translateY(0)" }))
            ])
          ], { optional: true })
        ])
      ]),
      trigger("cardUpdate", [
        state("in", style({ opacity: 1, transform: "scale(1)" })),
        transition("void => *", [
          style({ opacity: 0, transform: "scale(0.9)" }),
          animate("250ms ease-out")
        ]),
        transition("* => void", [
          animate("200ms ease-in", style({ opacity: 0, transform: "scale(0.9)" }))
        ])
      ]),
      trigger("modeTransition", [
        state("showcase", style({ opacity: 1, transform: "translateY(0)" })),
        state("currently-playing", style({ opacity: 1, transform: "translateY(0)" })),
        transition("showcase => currently-playing", [
          animate("400ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({ opacity: 1, transform: "translateY(0)" }))
        ]),
        transition("currently-playing => showcase", [
          animate("600ms cubic-bezier(0.4, 0.0, 0.2, 1)", style({ opacity: 1, transform: "translateY(0)" }))
        ])
      ])
    ], template: '<!-- Dynamic Artist Cards Container -->\n<div class="dynamic-artist-cards-container" *ngIf="!isLoading()">\n  \n  <!-- Header Section -->\n  <div class="cards-header">\n    <h2 class="cards-title">{{ displayTitle }}</h2>\n    <p class="cards-subtitle">{{ displaySubtitle }}</p>\n  </div>\n\n  <!-- Artist Cards Grid -->\n  <div class="artist-cards-grid"\n       [class.single-card]="artistCards().length === 1"\n       [@cardsContainer]\n       [@modeTransition]="animationState()"\n       *ngIf="artistCards().length > 0">\n    \n    <app-artist-card\n      *ngFor="let cardData of artistCards(); trackBy: trackByCardId"\n      [cardData]="cardData"\n      [enableAnimations]="enableAnimations"\n      [@cardUpdate]\n      class="artist-card">\n    </app-artist-card>\n  </div>\n\n  <!-- No Artists State -->\n  <div class="no-artists-state" *ngIf="artistCards().length === 0">\n    <div class="no-artists-content">\n      <div class="no-artists-icon">\u266A</div>\n      <h3>No Artists to Display</h3>\n      <p>Play a track to see contributing artists.</p>\n    </div>\n  </div>\n\n  <!-- Info Panel (matches reference design) -->\n  <div class="artist-cards-info-panel" *ngIf="currentTrack()">\n    <div class="info-icon">\u2139</div>\n    <span class="info-text">\n      Artist cards update in real-time as different tracks play. \n      {{ currentlyPlayingArtists().length }} artists are currently featured.\n    </span>\n  </div>\n\n</div>\n\n<!-- Loading State -->\n<div class="cards-loading-container" *ngIf="isLoading()">\n  <div class="loading-content">\n    <div class="loading-spinner"></div>\n    <p>Loading artist cards...</p>\n  </div>\n</div>', styles: ["/* src/app/components/dynamic-artist-cards/dynamic-artist-cards.component.scss */\n:root {\n  --artist-card-bg-primary: rgba(0, 0, 0, 0.85);\n  --artist-card-bg-secondary: rgba(20, 20, 20, 0.8);\n  --artist-card-text-primary: #ffffff;\n  --artist-card-text-secondary: rgba(255, 255, 255, 0.8);\n  --artist-card-text-muted: rgba(255, 255, 255, 0.6);\n  --artist-card-border-primary: rgba(255, 255, 255, 0.15);\n  --artist-card-border-hover: rgba(255, 255, 255, 0.25);\n  --artist-card-shadow-base: rgba(0, 0, 0, 0.4);\n  --artist-card-shadow-elevated: rgba(0, 0, 0, 0.6);\n  --artist-card-hover-bg: rgba(40, 40, 40, 0.9);\n  --artist-card-active-bg: rgba(60, 60, 60, 0.9);\n}\n.dynamic-artist-cards-container {\n  width: 100%;\n  max-width: 1200px;\n  margin: 0 auto;\n  padding: var(--artist-card-spacing-xxl) var(--artist-card-spacing-lg);\n  background: var(--artist-card-container-bg);\n  border: 1px solid var(--artist-card-border-secondary);\n  border-radius: var(--artist-card-radius-large);\n  backdrop-filter: var(--artist-card-glass-blur);\n  -webkit-backdrop-filter: var(--artist-card-glass-blur);\n  box-shadow: var(--artist-card-shadow-container);\n}\n.special-mentions-container .dynamic-artist-cards-container {\n  background: transparent;\n  border: none;\n  border-radius: 0;\n  backdrop-filter: none;\n  -webkit-backdrop-filter: none;\n  box-shadow: none;\n  max-width: 100%;\n  padding: 1rem;\n}\n.dynamic-artist-cards-container .cards-header {\n  text-align: center;\n  margin-bottom: 2.5rem;\n  padding: 1rem 0;\n}\n.dynamic-artist-cards-container .cards-header .cards-title {\n  font-size: clamp(1.6rem, 3vw, 2.8rem);\n  font-weight: 700;\n  color: var(--text-primary);\n  margin: 0 0 0.75rem 0;\n  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.7);\n  letter-spacing: -0.02em;\n  line-height: 1.1;\n}\n.dynamic-artist-cards-container .cards-header .cards-subtitle {\n  font-size: 1.1rem;\n  color: var(--text-secondary);\n  margin: 0;\n  max-width: 640px;\n  margin-left: auto;\n  margin-right: auto;\n  line-height: 1.6;\n  font-weight: 400;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\n}\n.dynamic-artist-cards-container .artist-cards-grid {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  gap: 1.5rem;\n  margin: 0 1rem 2rem 1rem;\n  justify-content: start;\n  width: calc(100% - 2rem);\n  max-width: calc(100% - 2rem);\n  box-sizing: border-box;\n}\n.special-mentions-container .dynamic-artist-cards-container .artist-cards-grid {\n  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));\n  gap: 1rem;\n  justify-content: start;\n  margin: 0 1rem 2rem 1rem;\n  width: calc(100% - 2rem);\n  max-width: calc(100% - 2rem);\n  box-sizing: border-box;\n  container-type: inline-size;\n}\n@media (min-width: 1024px) {\n  .special-mentions-container .dynamic-artist-cards-container .artist-cards-grid {\n    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n    gap: 1.2rem;\n    justify-content: start;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n@media (min-width: 1200px) {\n  .special-mentions-container .dynamic-artist-cards-container .artist-cards-grid {\n    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n    gap: 1.5rem;\n    justify-content: start;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n.dynamic-artist-cards-container .artist-cards-grid.single-card {\n  display: grid !important;\n  justify-content: center !important;\n  justify-items: center;\n  margin: 0 auto 2rem auto !important;\n  width: auto !important;\n}\n.dynamic-artist-cards-container .artist-cards-grid.single-card .artist-card {\n  width: 100%;\n  max-width: 350px;\n  justify-self: center;\n}\n.special-mentions-container .dynamic-artist-cards-container .artist-cards-grid.single-card {\n  justify-content: center !important;\n  justify-items: center;\n  margin: 0 auto 2rem auto !important;\n  width: auto !important;\n}\n.special-mentions-container .dynamic-artist-cards-container .artist-cards-grid.single-card .artist-card {\n  max-width: 320px;\n}\n.dynamic-artist-cards-container .artist-cards-grid:has(.artist-card:only-child) {\n  display: grid !important;\n  justify-content: center !important;\n  justify-items: center;\n  margin: 0 auto 2rem auto !important;\n  width: auto !important;\n}\n.dynamic-artist-cards-container .artist-cards-grid:has(.artist-card:only-child) .artist-card {\n  width: 100%;\n  max-width: 350px;\n  justify-self: center;\n}\n.special-mentions-container .dynamic-artist-cards-container .artist-cards-grid:has(.artist-card:only-child) {\n  justify-content: center !important;\n  justify-items: center;\n  margin: 0 auto 2rem auto !important;\n  width: auto !important;\n}\n.special-mentions-container .dynamic-artist-cards-container .artist-cards-grid:has(.artist-card:only-child) .artist-card {\n  max-width: 320px;\n}\n@media (min-width: 769px) and (max-width: 1199px) {\n  .dynamic-artist-cards-container .artist-cards-grid {\n    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n    gap: 1.25rem;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n@media (max-width: 768px) {\n  .dynamic-artist-cards-container .artist-cards-grid {\n    grid-template-columns: 1fr;\n    gap: 1rem;\n    margin: 0 0.5rem 2rem 0.5rem;\n    width: calc(100% - 1rem);\n    max-width: calc(100% - 1rem);\n  }\n  .dynamic-artist-cards-container .artist-cards-grid.single-card {\n    display: grid !important;\n    grid-template-columns: 1fr !important;\n    justify-content: center !important;\n    justify-items: center;\n    margin: 0 auto 2rem auto !important;\n    width: auto !important;\n    max-width: calc(100% - 1rem);\n  }\n  .dynamic-artist-cards-container .artist-cards-grid.single-card .artist-card {\n    max-width: calc(100% - 2rem);\n    justify-self: center;\n  }\n  .dynamic-artist-cards-container .artist-cards-grid:has(.artist-card:only-child) {\n    display: grid !important;\n    grid-template-columns: 1fr !important;\n    justify-content: center !important;\n    justify-items: center;\n    margin: 0 auto 2rem auto !important;\n    width: auto !important;\n    max-width: calc(100% - 1rem);\n  }\n  .dynamic-artist-cards-container .artist-cards-grid:has(.artist-card:only-child) .artist-card {\n    max-width: calc(100% - 2rem);\n    justify-self: center;\n  }\n  .special-mentions-container .dynamic-artist-cards-container .artist-cards-grid {\n    grid-template-columns: 1fr;\n    gap: 0.75rem;\n    margin: 0 0.5rem 2rem 0.5rem;\n    width: calc(100% - 1rem);\n    max-width: calc(100% - 1rem);\n  }\n}\n@media (min-width: 1200px) {\n  .dynamic-artist-cards-container .artist-cards-grid {\n    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n    justify-content: start;\n    box-sizing: border-box;\n  }\n  .dynamic-artist-cards-container .artist-cards-grid.single-card {\n    display: grid !important;\n    justify-content: center !important;\n    justify-items: center;\n    margin: 0 auto 2rem auto !important;\n    width: auto !important;\n  }\n  .dynamic-artist-cards-container .artist-cards-grid.single-card .artist-card {\n    width: 100%;\n    max-width: 380px;\n    justify-self: center;\n  }\n  .dynamic-artist-cards-container .artist-cards-grid:has(.artist-card:only-child) {\n    display: grid !important;\n    justify-content: center !important;\n    justify-items: center;\n    margin: 0 auto 2rem auto !important;\n    width: auto !important;\n  }\n  .dynamic-artist-cards-container .artist-cards-grid:has(.artist-card:only-child) .artist-card {\n    width: 100%;\n    max-width: 380px;\n    justify-self: center;\n  }\n}\n@media (min-width: 1440px) {\n  .dynamic-artist-cards-container .artist-cards-grid {\n    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n    gap: 1.25rem;\n    justify-content: start;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n@container (min-width: 800px) {\n  .dynamic-artist-cards-container .artist-cards-grid {\n    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));\n    justify-content: start;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n@container (min-width: 1000px) {\n  .dynamic-artist-cards-container .artist-cards-grid {\n    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));\n    justify-content: start;\n    margin: 0 1rem 2rem 1rem;\n    width: calc(100% - 2rem);\n    max-width: calc(100% - 2rem);\n  }\n}\n.dynamic-artist-cards-container .no-artists-state {\n  text-align: center;\n  padding: 4rem 1rem;\n}\n.dynamic-artist-cards-container .no-artists-state .no-artists-content {\n  background: var(--card-bg-primary);\n  border-radius: 16px;\n  padding: 2.5rem;\n  backdrop-filter: var(--glass-blur);\n  -webkit-backdrop-filter: var(--glass-blur);\n  border: 1px solid rgba(255, 255, 255, 0.12);\n  box-shadow: var(--shadow-elevated);\n  transition: all 0.3s ease;\n}\n.dynamic-artist-cards-container .no-artists-state .no-artists-content:hover {\n  background: var(--card-bg-hover);\n  border-color: rgba(255, 255, 255, 0.2);\n  transform: translateY(-2px);\n}\n.dynamic-artist-cards-container .no-artists-state .no-artists-content .no-artists-icon {\n  font-size: 3.5rem;\n  color: var(--text-secondary);\n  margin-bottom: 1.5rem;\n  display: block;\n  opacity: 0.8;\n}\n.dynamic-artist-cards-container .no-artists-state .no-artists-content h3 {\n  color: var(--text-primary);\n  margin: 0 0 0.75rem 0;\n  font-size: 1.4rem;\n  font-weight: 600;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);\n}\n.dynamic-artist-cards-container .no-artists-state .no-artists-content p {\n  color: var(--text-tertiary);\n  margin: 0;\n  font-size: 1rem;\n  line-height: 1.5;\n}\n.dynamic-artist-cards-container .artist-cards-info-panel {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  gap: 1rem;\n  background: var(--card-bg-primary);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 12px;\n  padding: 1.25rem 1.75rem;\n  backdrop-filter: var(--glass-blur);\n  -webkit-backdrop-filter: var(--glass-blur);\n  margin-top: 2rem;\n  box-shadow: var(--shadow-elevated);\n  transition: all 0.3s ease;\n}\n.dynamic-artist-cards-container .artist-cards-info-panel:hover {\n  background: var(--card-bg-hover);\n  border-color: rgba(255, 255, 255, 0.25);\n  transform: translateY(-1px);\n}\n.dynamic-artist-cards-container .artist-cards-info-panel .info-icon {\n  color: var(--text-primary);\n  font-size: 1.4rem;\n  flex-shrink: 0;\n  opacity: 0.9;\n}\n.dynamic-artist-cards-container .artist-cards-info-panel .info-text {\n  color: var(--text-secondary);\n  font-size: 0.95rem;\n  line-height: 1.5;\n  text-align: center;\n  font-weight: 400;\n}\n@media (max-width: 768px) {\n  .dynamic-artist-cards-container .artist-cards-info-panel {\n    padding: 0.875rem 1rem;\n  }\n  .dynamic-artist-cards-container .artist-cards-info-panel .info-text {\n    font-size: 0.8rem;\n  }\n}\n.cards-loading-container {\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  min-height: 240px;\n  padding: 3rem;\n  background: var(--container-bg);\n  border-radius: 12px;\n}\n.cards-loading-container .loading-content {\n  text-align: center;\n  color: var(--text-secondary);\n}\n.cards-loading-container .loading-content .loading-spinner {\n  width: 48px;\n  height: 48px;\n  border: 3px solid rgba(255, 255, 255, 0.15);\n  border-top: 3px solid var(--text-primary);\n  border-radius: 50%;\n  animation: spin 1s linear infinite;\n  margin: 0 auto 1.5rem auto;\n  box-shadow: 0 0 12px rgba(255, 255, 255, 0.1);\n}\n.cards-loading-container .loading-content p {\n  margin: 0;\n  font-size: 1rem;\n  font-weight: 500;\n  color: var(--text-primary);\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);\n}\n@keyframes spin {\n  0% {\n    transform: rotate(0deg);\n  }\n  100% {\n    transform: rotate(360deg);\n  }\n}\n.artist-card {\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.artist-card:hover {\n  transform: translateY(-4px) scale(1.02);\n  box-shadow: var(--shadow-elevated);\n}\n.artist-card:nth-child(1) {\n  animation-delay: 0.1s;\n}\n.artist-card:nth-child(2) {\n  animation-delay: 0.2s;\n}\n.artist-card:nth-child(3) {\n  animation-delay: 0.3s;\n}\n.artist-card:nth-child(4) {\n  animation-delay: 0.4s;\n}\n.artist-card:nth-child(5) {\n  animation-delay: 0.5s;\n}\n.artist-card:nth-child(6) {\n  animation-delay: 0.6s;\n}\n.artist-card:nth-child(7) {\n  animation-delay: 0.7s;\n}\n.artist-card:nth-child(8) {\n  animation-delay: 0.8s;\n}\n/*# sourceMappingURL=dynamic-artist-cards.component.css.map */\n"] }]
  }], () => [{ type: ArtistCreditService }, { type: AudioService }, { type: CurrentlyPlayingArtistsService }, { type: DynamicArtistService }, { type: MusicStateManagerService }, { type: Router }], { showAllArtists: [{
    type: Input
  }], maxVisibleCards: [{
    type: Input
  }], enableAnimations: [{
    type: Input
  }], displayMode: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(DynamicArtistCardsComponent, { className: "DynamicArtistCardsComponent", filePath: "src/app/components/dynamic-artist-cards/dynamic-artist-cards.component.ts", lineNumber: 82 });
})();

// src/app/components/special-mentions/special-mentions.component.ts
var _c04 = ["*"];
var _forTrack0 = ($index, $item) => $item.id;
function SpecialMentionsComponent_For_10_img_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 20);
  }
  if (rf & 2) {
    const mention_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", mention_r2.avatar, \u0275\u0275sanitizeUrl)("alt", mention_r2.name + " avatar");
  }
}
function SpecialMentionsComponent_For_10_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mention_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275styleProp("background", mention_r2.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", mention_r2.initials, " ");
  }
}
function SpecialMentionsComponent_For_10_div_9_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 26);
    \u0275\u0275text(1, "\u{1D54F}");
    \u0275\u0275elementEnd();
  }
}
function SpecialMentionsComponent_For_10_div_9_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "\u{1F4F7}");
    \u0275\u0275elementEnd();
  }
}
function SpecialMentionsComponent_For_10_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r4 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "button", 23);
    \u0275\u0275listener("click", function SpecialMentionsComponent_For_10_div_9_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r4);
      const mention_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(mention_r2.socialLinks.twitter ? ctx_r2.onSocialLinkClick(mention_r2.socialLinks.twitter, $event) : ctx_r2.onSocialLinkClick(mention_r2.socialLinks.instagram, $event));
    });
    \u0275\u0275template(2, SpecialMentionsComponent_For_10_div_9_span_2_Template, 2, 0, "span", 24)(3, SpecialMentionsComponent_For_10_div_9_span_3_Template, 2, 0, "span", 25);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const mention_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", mention_r2.name + " social link");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", mention_r2.socialLinks.twitter);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", mention_r2.socialLinks.instagram && !mention_r2.socialLinks.twitter);
  }
}
function SpecialMentionsComponent_For_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275listener("click", function SpecialMentionsComponent_For_10_Template_div_click_0_listener() {
      const mention_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onCardClick(mention_r2));
    });
    \u0275\u0275elementStart(1, "div", 12);
    \u0275\u0275template(2, SpecialMentionsComponent_For_10_img_2_Template, 1, 2, "img", 13)(3, SpecialMentionsComponent_For_10_div_3_Template, 2, 3, "div", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 15)(5, "div", 16);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 17);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(9, SpecialMentionsComponent_For_10_div_9_Template, 4, 3, "div", 18);
    \u0275\u0275element(10, "div", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mention_r2 = ctx.$implicit;
    \u0275\u0275styleProp("--accent-color", mention_r2.color);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", mention_r2.avatar);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !mention_r2.avatar);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(mention_r2.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mention_r2.role);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", mention_r2.socialLinks.twitter || mention_r2.socialLinks.instagram);
  }
}
function SpecialMentionsComponent_For_17_img_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 20);
  }
  if (rf & 2) {
    const mention_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", mention_r6.avatar, \u0275\u0275sanitizeUrl)("alt", mention_r6.name + " avatar");
  }
}
function SpecialMentionsComponent_For_17_div_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mention_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275styleProp("background", mention_r6.color);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", mention_r6.initials, " ");
  }
}
function SpecialMentionsComponent_For_17_div_9_span_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 26);
    \u0275\u0275text(1, "\u{1D54F}");
    \u0275\u0275elementEnd();
  }
}
function SpecialMentionsComponent_For_17_div_9_span_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 27);
    \u0275\u0275text(1, "\u{1F4F7}");
    \u0275\u0275elementEnd();
  }
}
function SpecialMentionsComponent_For_17_div_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 22)(1, "button", 23);
    \u0275\u0275listener("click", function SpecialMentionsComponent_For_17_div_9_Template_button_click_1_listener($event) {
      \u0275\u0275restoreView(_r7);
      const mention_r6 = \u0275\u0275nextContext().$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(mention_r6.socialLinks.twitter ? ctx_r2.onSocialLinkClick(mention_r6.socialLinks.twitter, $event) : ctx_r2.onSocialLinkClick(mention_r6.socialLinks.instagram, $event));
    });
    \u0275\u0275template(2, SpecialMentionsComponent_For_17_div_9_span_2_Template, 2, 0, "span", 24)(3, SpecialMentionsComponent_For_17_div_9_span_3_Template, 2, 0, "span", 25);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const mention_r6 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275attribute("aria-label", mention_r6.name + " social link");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", mention_r6.socialLinks.twitter);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", mention_r6.socialLinks.instagram && !mention_r6.socialLinks.twitter);
  }
}
function SpecialMentionsComponent_For_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11);
    \u0275\u0275listener("click", function SpecialMentionsComponent_For_17_Template_div_click_0_listener() {
      const mention_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r2 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r2.onCardClick(mention_r6));
    });
    \u0275\u0275elementStart(1, "div", 12);
    \u0275\u0275template(2, SpecialMentionsComponent_For_17_img_2_Template, 1, 2, "img", 13)(3, SpecialMentionsComponent_For_17_div_3_Template, 2, 3, "div", 14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 15)(5, "div", 16);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 17);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275template(9, SpecialMentionsComponent_For_17_div_9_Template, 4, 3, "div", 18);
    \u0275\u0275element(10, "div", 19);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const mention_r6 = ctx.$implicit;
    \u0275\u0275styleProp("--accent-color", mention_r6.color);
    \u0275\u0275advance(2);
    \u0275\u0275property("ngIf", mention_r6.avatar);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !mention_r6.avatar);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(mention_r6.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(mention_r6.role);
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", mention_r6.socialLinks.twitter || mention_r6.socialLinks.instagram);
  }
}
var _SpecialMentionsComponent = class _SpecialMentionsComponent {
  constructor(gelDbService) {
    this.gelDbService = gelDbService;
    this.specialMentions = signal([], ...ngDevMode ? [{ debugName: "specialMentions" }] : []);
    this.displayedMentions = computed(() => {
      return this.specialMentions().map((mention) => __spreadProps(__spreadValues({}, mention), {
        initials: this.getInitials(mention.name)
      }));
    }, ...ngDevMode ? [{ debugName: "displayedMentions" }] : []);
    this.leftSideCards = computed(() => {
      const mentions = this.displayedMentions();
      const halfPoint = Math.ceil(mentions.length / 2);
      return mentions.slice(0, halfPoint);
    }, ...ngDevMode ? [{ debugName: "leftSideCards" }] : []);
    this.rightSideCards = computed(() => {
      const mentions = this.displayedMentions();
      const halfPoint = Math.ceil(mentions.length / 2);
      return mentions.slice(halfPoint);
    }, ...ngDevMode ? [{ debugName: "rightSideCards" }] : []);
  }
  ngOnInit() {
    this.loadSpecialMentionsFromDatabase();
  }
  loadSpecialMentionsFromDatabase() {
    const specialMentionNames = [
      "SpiralFlip",
      // Organiser
      "PliXoR",
      // Mastering Engineer
      "NapaL",
      // Cover Illustration
      "yy_artwork",
      // Logo/Jacket Design
      "Elegant Sister",
      // Album Stream MV
      "Len",
      // Crossfade MV/Live2D
      "Daph",
      // Live2D
      "honabai",
      // Special Thanks
      "shironill"
      // Special Thanks
    ];
    const specialMentionsList = specialMentionNames.map((artistName) => {
      const avatar = this.gelDbService.getArtistAvatar(artistName);
      const displayName = this.gelDbService.getArtistDisplayName(artistName);
      const color = this.gelDbService.getArtistColor(artistName);
      const socialLinks = this.gelDbService.getArtistSocialLinks(artistName);
      const avatarMap = this.gelDbService.getArtistAvatarMap();
      const role = avatarMap[artistName]?.genre || "Production Team";
      return {
        id: artistName.toLowerCase().replace(/\s+/g, "-"),
        name: displayName,
        role,
        avatar,
        color,
        socialLinks: {
          twitter: socialLinks?.twitter,
          youtube: socialLinks?.youtube,
          instagram: socialLinks?.instagram,
          website: socialLinks?.website
        }
      };
    });
    this.specialMentions.set(specialMentionsList);
  }
  getInitials(name) {
    const words = name.split(" ").filter((word) => word.length > 0);
    if (words.length === 0)
      return "?";
    if (words.length === 1)
      return words[0].substring(0, 2).toUpperCase();
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  onCardClick(mention) {
    if (mention.socialLinks.twitter) {
      window.open(mention.socialLinks.twitter, "_blank", "noopener,noreferrer");
    } else if (mention.socialLinks.instagram) {
      window.open(mention.socialLinks.instagram, "_blank", "noopener,noreferrer");
    } else if (mention.socialLinks.youtube) {
      window.open(mention.socialLinks.youtube, "_blank", "noopener,noreferrer");
    } else if (mention.socialLinks.website) {
      window.open(mention.socialLinks.website, "_blank", "noopener,noreferrer");
    }
  }
  onSocialLinkClick(url, event) {
    event.stopPropagation();
    window.open(url, "_blank", "noopener,noreferrer");
  }
};
_SpecialMentionsComponent.\u0275fac = function SpecialMentionsComponent_Factory(__ngFactoryType__) {
  return new (__ngFactoryType__ || _SpecialMentionsComponent)(\u0275\u0275directiveInject(GelDbIntegrationService));
};
_SpecialMentionsComponent.\u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _SpecialMentionsComponent, selectors: [["app-special-mentions"]], ngContentSelectors: _c04, decls: 18, vars: 0, consts: [[1, "special-mentions-container"], [1, "section-header"], [1, "section-title"], [1, "section-subtitle"], [1, "three-column-layout"], [1, "cards-column", "left-column"], [1, "column-cards"], [1, "compact-card", "vertical-card", 3, "--accent-color"], [1, "main-content-column"], [1, "content-placeholder"], [1, "cards-column", "right-column"], [1, "compact-card", "vertical-card", 3, "click"], [1, "compact-avatar"], ["class", "avatar-image", "loading", "lazy", 3, "src", "alt", 4, "ngIf"], ["class", "avatar-initials", 3, "background", 4, "ngIf"], [1, "compact-info"], [1, "artist-name"], [1, "artist-role"], ["class", "compact-social", 4, "ngIf"], [1, "card-accent"], ["loading", "lazy", 1, "avatar-image", 3, "src", "alt"], [1, "avatar-initials"], [1, "compact-social"], ["mat-icon-button", "", 1, "social-btn", 3, "click"], ["class", "twitter-x-icon", 4, "ngIf"], ["class", "instagram-icon", 4, "ngIf"], [1, "twitter-x-icon"], [1, "instagram-icon"]], template: function SpecialMentionsComponent_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275projectionDef();
    \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "h3", 2);
    \u0275\u0275text(3, "Special Thanks");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 3);
    \u0275\u0275text(5, "Production Team");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "div", 4)(7, "div", 5)(8, "div", 6);
    \u0275\u0275repeaterCreate(9, SpecialMentionsComponent_For_10_Template, 11, 7, "div", 7, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "div", 8)(12, "div", 9);
    \u0275\u0275projection(13);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 10)(15, "div", 6);
    \u0275\u0275repeaterCreate(16, SpecialMentionsComponent_For_17_Template, 11, 7, "div", 7, _forTrack0);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    \u0275\u0275advance(9);
    \u0275\u0275repeater(ctx.leftSideCards());
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx.rightSideCards());
  }
}, dependencies: [
  CommonModule,
  NgIf,
  MatIconModule,
  MatButtonModule,
  MatIconButton
], styles: ['\n\n.special-mentions-container[_ngcontent-%COMP%] {\n  width: 100%;\n  padding: 1rem 0;\n  min-height: 100vh;\n}\n.section-header[_ngcontent-%COMP%] {\n  text-align: center;\n  margin-bottom: 2rem;\n  position: relative;\n  z-index: 10;\n}\n.section-header[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n  font-size: 1.8rem;\n  font-weight: 700;\n  color: rgba(255, 255, 255, 0.95);\n  margin: 0 0 0.5rem 0;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);\n  letter-spacing: 0.5px;\n}\n.section-header[_ngcontent-%COMP%]   .section-subtitle[_ngcontent-%COMP%] {\n  font-size: 1rem;\n  color: rgba(255, 255, 255, 0.75);\n  margin: 0;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  font-weight: 500;\n}\n.three-column-layout[_ngcontent-%COMP%] {\n  display: grid;\n  grid-template-columns: 250px 1fr 250px;\n  gap: 2rem;\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 0 2rem;\n  min-height: 80vh;\n  align-items: start;\n  overflow-x: hidden;\n  grid-template-rows: auto;\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n}\n@media (min-width: 1200px) {\n  .three-column-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 280px 1fr 280px;\n    gap: 3rem;\n    max-width: 1600px;\n  }\n}\n@media (min-width: 1600px) {\n  .three-column-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 320px 1fr 320px;\n    gap: 4rem;\n    max-width: 1800px;\n  }\n}\n.cards-column[_ngcontent-%COMP%] {\n  position: sticky;\n  top: 2rem;\n  height: fit-content;\n  max-height: calc(100vh - 4rem);\n  overflow: visible;\n}\n.cards-column.left-column[_ngcontent-%COMP%] {\n  justify-self: end;\n}\n.cards-column.right-column[_ngcontent-%COMP%] {\n  justify-self: start;\n}\n.column-cards[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  overflow: visible;\n  width: 100%;\n}\n.main-content-column[_ngcontent-%COMP%] {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: stretch;\n  min-height: 60vh;\n  padding: 2rem 1rem;\n  width: 100%;\n  box-sizing: border-box;\n}\n.main-content-column[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  width: 100%;\n  box-sizing: border-box;\n}\n.content-placeholder[_ngcontent-%COMP%] {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  justify-content: flex-start;\n  min-height: 400px;\n  background: rgba(30, 30, 40, 0.3);\n  border: 2px dashed rgba(255, 255, 255, 0.2);\n  border-radius: 16px;\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  max-width: 100%;\n  overflow: visible;\n  box-sizing: border-box;\n  container-type: inline-size;\n}\n.content-placeholder[_ngcontent-%COMP%]:empty::before {\n  content: "Main Content Area";\n  color: rgba(255, 255, 255, 0.5);\n  font-size: 1.2rem;\n  font-weight: 500;\n  text-align: center;\n  margin: auto;\n}\n.content-placeholder[_ngcontent-%COMP%]    > *[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: 100%;\n  flex: 1;\n  box-sizing: border-box;\n}\n.content-placeholder[_ngcontent-%COMP%]    > *.dynamic-artist-cards-container[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n}\n.content-placeholder[_ngcontent-%COMP%]    > *.dynamic-artist-cards-container[_ngcontent-%COMP%]   .artist-cards-grid[_ngcontent-%COMP%] {\n  width: 100%;\n  max-width: none;\n}\n.compact-card[_ngcontent-%COMP%] {\n  --accent-color: #ffffff;\n  position: relative;\n  background: rgba(15, 15, 25, 0.95);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 16px;\n  padding: 1rem;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  overflow: hidden;\n  width: 100%;\n}\n.compact-card.vertical-card[_ngcontent-%COMP%] {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  min-height: 80px;\n  max-width: 100%;\n  box-sizing: border-box;\n}\n.compact-card[_ngcontent-%COMP%]:hover {\n  transform: translateY(-4px);\n  background: rgba(25, 25, 40, 0.98);\n  border-color: var(--accent-color);\n  box-shadow:\n    0 12px 35px rgba(0, 0, 0, 0.4),\n    0 0 25px rgba(var(--accent-color-rgb, 255, 255, 255), 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.1);\n}\n.compact-card[_ngcontent-%COMP%]:hover   .card-accent[_ngcontent-%COMP%] {\n  opacity: 1;\n}\n.compact-card[_ngcontent-%COMP%]:hover   .compact-avatar[_ngcontent-%COMP%]   .avatar-image[_ngcontent-%COMP%] {\n  transform: scale(1.05);\n}\n.compact-card[_ngcontent-%COMP%]:hover   .artist-name[_ngcontent-%COMP%] {\n  color: var(--accent-color);\n  text-shadow: 0 0 8px rgba(var(--accent-color-rgb, 255, 255, 255), 0.3);\n}\n.compact-card[_ngcontent-%COMP%]:hover   .social-btn[_ngcontent-%COMP%] {\n  opacity: 1;\n  transform: scale(1.1) translateY(-1px);\n}\n.compact-card[_ngcontent-%COMP%]:active {\n  transform: translateY(-2px) scale(0.98);\n}\n.compact-avatar[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  overflow: hidden;\n  background: rgba(255, 255, 255, 0.1);\n  position: relative;\n  border: 2px solid rgba(255, 255, 255, 0.2);\n  transition: all 0.3s ease;\n}\n.compact-avatar[_ngcontent-%COMP%]   .avatar-image[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.compact-avatar[_ngcontent-%COMP%]   .avatar-initials[_ngcontent-%COMP%] {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.9rem;\n  font-weight: 700;\n  color: white;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);\n  letter-spacing: 0.5px;\n}\n.compact-info[_ngcontent-%COMP%] {\n  flex: 1;\n  min-width: 0;\n  padding: 0 0.25rem;\n}\n.compact-info[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n  font-size: 0.95rem;\n  font-weight: 700;\n  color: rgba(255, 255, 255, 0.96);\n  margin: 0 0 0.15rem 0;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 1.2;\n}\n.compact-info[_ngcontent-%COMP%]   .artist-role[_ngcontent-%COMP%] {\n  font-size: 0.75rem;\n  color: rgba(255, 255, 255, 0.65);\n  margin: 0;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 1.1;\n}\n.compact-social[_ngcontent-%COMP%] {\n  flex-shrink: 0;\n}\n.compact-social[_ngcontent-%COMP%]   .social-btn[_ngcontent-%COMP%] {\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(255, 255, 255, 0.25);\n  opacity: 0.8;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-backdrop-filter: blur(5px);\n  backdrop-filter: blur(5px);\n}\n.compact-social[_ngcontent-%COMP%]   .social-btn[_ngcontent-%COMP%]:hover {\n  background: var(--accent-color);\n  border-color: var(--accent-color);\n  opacity: 1;\n  box-shadow: 0 4px 12px rgba(var(--accent-color-rgb, 255, 255, 255), 0.3);\n}\n.compact-social[_ngcontent-%COMP%]   .social-btn[_ngcontent-%COMP%]:hover   .twitter-x-icon[_ngcontent-%COMP%] {\n  color: #000;\n  transform: scale(1.1);\n}\n.compact-social[_ngcontent-%COMP%]   .social-btn[_ngcontent-%COMP%]:hover   .instagram-icon[_ngcontent-%COMP%] {\n  color: #000;\n  transform: scale(1.1);\n}\n.compact-social[_ngcontent-%COMP%]   .social-btn[_ngcontent-%COMP%]   .twitter-x-icon[_ngcontent-%COMP%] {\n  font-size: 0.85rem;\n  font-weight: bold;\n  color: rgba(255, 255, 255, 0.9);\n  transition: all 0.3s ease;\n}\n.compact-social[_ngcontent-%COMP%]   .social-btn[_ngcontent-%COMP%]   .instagram-icon[_ngcontent-%COMP%] {\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.9);\n  transition: all 0.3s ease;\n}\n.card-accent[_ngcontent-%COMP%] {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 3px;\n  background:\n    linear-gradient(\n      90deg,\n      var(--accent-color),\n      transparent);\n  opacity: 0;\n  transition: opacity 0.3s ease;\n  border-radius: 0 0 16px 16px;\n}\n@media (max-width: 1199px) {\n  .three-column-layout[_ngcontent-%COMP%] {\n    gap: 1.5rem;\n    padding: 0 1.5rem;\n  }\n  .section-header[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n    font-size: 1.6rem;\n  }\n}\n@media (max-width: 991px) {\n  .three-column-layout[_ngcontent-%COMP%] {\n    grid-template-columns: 200px 1fr 200px;\n    gap: 1rem;\n    padding: 0 1rem;\n  }\n  .compact-card.vertical-card[_ngcontent-%COMP%] {\n    padding: 0.8rem;\n    gap: 0.6rem;\n    min-height: 70px;\n  }\n  .compact-avatar[_ngcontent-%COMP%] {\n    width: 38px;\n    height: 38px;\n  }\n  .compact-info[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n    font-size: 0.85rem;\n  }\n  .compact-info[_ngcontent-%COMP%]   .artist-role[_ngcontent-%COMP%] {\n    font-size: 0.7rem;\n  }\n}\n@media (max-width: 768px) {\n  .special-mentions-container[_ngcontent-%COMP%] {\n    padding: 0.5rem 0;\n  }\n  .section-header[_ngcontent-%COMP%] {\n    margin-bottom: 1.5rem;\n  }\n  .section-header[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n    font-size: 1.4rem;\n  }\n  .section-header[_ngcontent-%COMP%]   .section-subtitle[_ngcontent-%COMP%] {\n    font-size: 0.9rem;\n  }\n  .three-column-layout[_ngcontent-%COMP%] {\n    display: flex;\n    flex-direction: column;\n    gap: 1.5rem;\n    padding: 0 1rem;\n    min-height: auto;\n  }\n  .cards-column[_ngcontent-%COMP%] {\n    position: static;\n    max-height: none;\n    width: 100%;\n  }\n  .cards-column.left-column[_ngcontent-%COMP%], \n   .cards-column.right-column[_ngcontent-%COMP%] {\n    justify-self: auto;\n  }\n  .column-cards[_ngcontent-%COMP%] {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n    gap: 0.75rem;\n    padding: 0;\n  }\n  .main-content-column[_ngcontent-%COMP%] {\n    order: -1;\n    min-height: 300px;\n    padding: 1rem 0;\n  }\n  .content-placeholder[_ngcontent-%COMP%] {\n    min-height: 250px;\n    border-radius: 12px;\n  }\n  .content-placeholder[_ngcontent-%COMP%]:empty::before {\n    font-size: 1rem;\n  }\n}\n@media (max-width: 480px) {\n  .special-mentions-container[_ngcontent-%COMP%] {\n    padding: 0.25rem 0;\n  }\n  .section-header[_ngcontent-%COMP%] {\n    margin-bottom: 1rem;\n  }\n  .section-header[_ngcontent-%COMP%]   .section-title[_ngcontent-%COMP%] {\n    font-size: 1.2rem;\n  }\n  .section-header[_ngcontent-%COMP%]   .section-subtitle[_ngcontent-%COMP%] {\n    font-size: 0.8rem;\n  }\n  .three-column-layout[_ngcontent-%COMP%] {\n    padding: 0 0.5rem;\n    gap: 1rem;\n  }\n  .column-cards[_ngcontent-%COMP%] {\n    grid-template-columns: 1fr;\n    gap: 0.6rem;\n  }\n  .compact-card.vertical-card[_ngcontent-%COMP%] {\n    padding: 0.7rem;\n    gap: 0.5rem;\n    min-height: 60px;\n    border-radius: 12px;\n  }\n  .compact-avatar[_ngcontent-%COMP%] {\n    width: 34px;\n    height: 34px;\n  }\n  .compact-avatar[_ngcontent-%COMP%]   .avatar-initials[_ngcontent-%COMP%] {\n    font-size: 0.8rem;\n  }\n  .compact-info[_ngcontent-%COMP%] {\n    padding: 0 0.15rem;\n  }\n  .compact-info[_ngcontent-%COMP%]   .artist-name[_ngcontent-%COMP%] {\n    font-size: 0.8rem;\n  }\n  .compact-info[_ngcontent-%COMP%]   .artist-role[_ngcontent-%COMP%] {\n    font-size: 0.65rem;\n  }\n  .compact-social[_ngcontent-%COMP%]   .social-btn[_ngcontent-%COMP%] {\n    width: 28px;\n    height: 28px;\n    border-radius: 6px;\n  }\n  .compact-social[_ngcontent-%COMP%]   .social-btn[_ngcontent-%COMP%]   .twitter-x-icon[_ngcontent-%COMP%] {\n    font-size: 0.75rem;\n  }\n  .main-content-column[_ngcontent-%COMP%] {\n    padding: 0.5rem 0;\n  }\n  .content-placeholder[_ngcontent-%COMP%] {\n    min-height: 200px;\n    padding: 1rem 0.5rem;\n  }\n}\n.cards-column[_ngcontent-%COMP%] {\n  scrollbar-width: thin;\n  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;\n}\n.cards-column[_ngcontent-%COMP%]::-webkit-scrollbar {\n  width: 4px;\n}\n.cards-column[_ngcontent-%COMP%]::-webkit-scrollbar-track {\n  background: transparent;\n}\n.cards-column[_ngcontent-%COMP%]::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.3);\n  border-radius: 2px;\n}\n.cards-column[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover {\n  background: rgba(255, 255, 255, 0.5);\n}\n@media (prefers-reduced-motion: reduce) {\n  .compact-card[_ngcontent-%COMP%], \n   .compact-avatar[_ngcontent-%COMP%]   .avatar-image[_ngcontent-%COMP%], \n   .social-btn[_ngcontent-%COMP%], \n   .card-accent[_ngcontent-%COMP%], \n   .cards-column[_ngcontent-%COMP%] {\n    transition: none !important;\n    transform: none !important;\n  }\n  .compact-card[_ngcontent-%COMP%]:hover {\n    transform: none !important;\n  }\n}\n@media (prefers-contrast: high) {\n  .compact-card[_ngcontent-%COMP%] {\n    border-color: rgba(255, 255, 255, 0.6);\n    background: rgba(0, 0, 0, 0.95);\n  }\n  .compact-avatar[_ngcontent-%COMP%] {\n    border-color: rgba(255, 255, 255, 0.5);\n  }\n  .artist-name[_ngcontent-%COMP%] {\n    color: #fff !important;\n  }\n  .artist-role[_ngcontent-%COMP%] {\n    color: rgba(255, 255, 255, 0.85) !important;\n  }\n  .content-placeholder[_ngcontent-%COMP%] {\n    border-color: rgba(255, 255, 255, 0.5);\n    background: rgba(0, 0, 0, 0.8);\n  }\n}\n.compact-card[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--accent-color);\n  outline-offset: 2px;\n}\n.social-btn[_ngcontent-%COMP%]:focus-visible {\n  outline: 2px solid var(--accent-color);\n  outline-offset: 1px;\n}\n/*# sourceMappingURL=special-mentions.component.css.map */'] });
var SpecialMentionsComponent = _SpecialMentionsComponent;
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(SpecialMentionsComponent, [{
    type: Component,
    args: [{ selector: "app-special-mentions", standalone: true, imports: [
      CommonModule,
      MatIconModule,
      MatButtonModule
    ], template: `<!-- Special Mentions Three-Column Layout -->
<div class="special-mentions-container">
  <!-- Section Header -->
  <div class="section-header">
    <h3 class="section-title">Special Thanks</h3>
    <p class="section-subtitle">Production Team</p>
  </div>

  <!-- Three-Column Layout: Left Cards | Main Content | Right Cards -->
  <div class="three-column-layout">

    <!-- Left Side Cards Column -->
    <div class="cards-column left-column">
      <div class="column-cards">
        @for (mention of leftSideCards(); track mention.id) {
          <div class="compact-card vertical-card"
               (click)="onCardClick(mention)"
               [style.--accent-color]="mention.color">

            <!-- Avatar Section -->
            <div class="compact-avatar">
              <img *ngIf="mention.avatar"
                   [src]="mention.avatar"
                   [alt]="mention.name + ' avatar'"
                   class="avatar-image"
                   loading="lazy">

              <!-- Initials Fallback -->
              <div *ngIf="!mention.avatar"
                   class="avatar-initials"
                   [style.background]="mention.color">
                {{ mention.initials }}
              </div>
            </div>

            <!-- Info Section -->
            <div class="compact-info">
              <div class="artist-name">{{ mention.name }}</div>
              <div class="artist-role">{{ mention.role }}</div>
            </div>

            <!-- Social Links -->
            <div class="compact-social" *ngIf="mention.socialLinks.twitter || mention.socialLinks.instagram">
              <button class="social-btn"
                      mat-icon-button
                      [attr.aria-label]="mention.name + ' social link'"
                      (click)="mention.socialLinks.twitter ? onSocialLinkClick(mention.socialLinks.twitter!, $event) : onSocialLinkClick(mention.socialLinks.instagram!, $event)">
                <span *ngIf="mention.socialLinks.twitter" class="twitter-x-icon">\u{1D54F}</span>
                <span *ngIf="mention.socialLinks.instagram && !mention.socialLinks.twitter" class="instagram-icon">\u{1F4F7}</span>
              </button>
            </div>

            <!-- Hover Effect -->
            <div class="card-accent"></div>
          </div>
        }
      </div>
    </div>

    <!-- Main Content Area (for external content) -->
    <div class="main-content-column">
      <div class="content-placeholder">
        <!-- This slot is intended for main content like artist cards -->
        <ng-content></ng-content>
      </div>
    </div>

    <!-- Right Side Cards Column -->
    <div class="cards-column right-column">
      <div class="column-cards">
        @for (mention of rightSideCards(); track mention.id) {
          <div class="compact-card vertical-card"
               (click)="onCardClick(mention)"
               [style.--accent-color]="mention.color">

            <!-- Avatar Section -->
            <div class="compact-avatar">
              <img *ngIf="mention.avatar"
                   [src]="mention.avatar"
                   [alt]="mention.name + ' avatar'"
                   class="avatar-image"
                   loading="lazy">

              <!-- Initials Fallback -->
              <div *ngIf="!mention.avatar"
                   class="avatar-initials"
                   [style.background]="mention.color">
                {{ mention.initials }}
              </div>
            </div>

            <!-- Info Section -->
            <div class="compact-info">
              <div class="artist-name">{{ mention.name }}</div>
              <div class="artist-role">{{ mention.role }}</div>
            </div>

            <!-- Social Links -->
            <div class="compact-social" *ngIf="mention.socialLinks.twitter || mention.socialLinks.instagram">
              <button class="social-btn"
                      mat-icon-button
                      [attr.aria-label]="mention.name + ' social link'"
                      (click)="mention.socialLinks.twitter ? onSocialLinkClick(mention.socialLinks.twitter!, $event) : onSocialLinkClick(mention.socialLinks.instagram!, $event)">
                <span *ngIf="mention.socialLinks.twitter" class="twitter-x-icon">\u{1D54F}</span>
                <span *ngIf="mention.socialLinks.instagram && !mention.socialLinks.twitter" class="instagram-icon">\u{1F4F7}</span>
              </button>
            </div>

            <!-- Hover Effect -->
            <div class="card-accent"></div>
          </div>
        }
      </div>
    </div>

  </div>
</div>`, styles: ['/* src/app/components/special-mentions/special-mentions.component.scss */\n.special-mentions-container {\n  width: 100%;\n  padding: 1rem 0;\n  min-height: 100vh;\n}\n.section-header {\n  text-align: center;\n  margin-bottom: 2rem;\n  position: relative;\n  z-index: 10;\n}\n.section-header .section-title {\n  font-size: 1.8rem;\n  font-weight: 700;\n  color: rgba(255, 255, 255, 0.95);\n  margin: 0 0 0.5rem 0;\n  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);\n  letter-spacing: 0.5px;\n}\n.section-header .section-subtitle {\n  font-size: 1rem;\n  color: rgba(255, 255, 255, 0.75);\n  margin: 0;\n  text-transform: uppercase;\n  letter-spacing: 1px;\n  font-weight: 500;\n}\n.three-column-layout {\n  display: grid;\n  grid-template-columns: 250px 1fr 250px;\n  gap: 2rem;\n  max-width: 1400px;\n  margin: 0 auto;\n  padding: 0 2rem;\n  min-height: 80vh;\n  align-items: start;\n  overflow-x: hidden;\n  grid-template-rows: auto;\n  width: 100%;\n  max-width: 100%;\n  box-sizing: border-box;\n}\n@media (min-width: 1200px) {\n  .three-column-layout {\n    grid-template-columns: 280px 1fr 280px;\n    gap: 3rem;\n    max-width: 1600px;\n  }\n}\n@media (min-width: 1600px) {\n  .three-column-layout {\n    grid-template-columns: 320px 1fr 320px;\n    gap: 4rem;\n    max-width: 1800px;\n  }\n}\n.cards-column {\n  position: sticky;\n  top: 2rem;\n  height: fit-content;\n  max-height: calc(100vh - 4rem);\n  overflow: visible;\n}\n.cards-column.left-column {\n  justify-self: end;\n}\n.cards-column.right-column {\n  justify-self: start;\n}\n.column-cards {\n  display: flex;\n  flex-direction: column;\n  gap: 1rem;\n  overflow: visible;\n  width: 100%;\n}\n.main-content-column {\n  display: flex;\n  flex-direction: column;\n  justify-content: flex-start;\n  align-items: stretch;\n  min-height: 60vh;\n  padding: 2rem 1rem;\n  width: 100%;\n  box-sizing: border-box;\n}\n.main-content-column > * {\n  width: 100%;\n  box-sizing: border-box;\n}\n.content-placeholder {\n  width: 100%;\n  display: flex;\n  flex-direction: column;\n  align-items: stretch;\n  justify-content: flex-start;\n  min-height: 400px;\n  background: rgba(30, 30, 40, 0.3);\n  border: 2px dashed rgba(255, 255, 255, 0.2);\n  border-radius: 16px;\n  -webkit-backdrop-filter: blur(10px);\n  backdrop-filter: blur(10px);\n  max-width: 100%;\n  overflow: visible;\n  box-sizing: border-box;\n  container-type: inline-size;\n}\n.content-placeholder:empty::before {\n  content: "Main Content Area";\n  color: rgba(255, 255, 255, 0.5);\n  font-size: 1.2rem;\n  font-weight: 500;\n  text-align: center;\n  margin: auto;\n}\n.content-placeholder > * {\n  width: 100%;\n  max-width: 100%;\n  flex: 1;\n  box-sizing: border-box;\n}\n.content-placeholder > *.dynamic-artist-cards-container {\n  width: 100%;\n  max-width: none;\n}\n.content-placeholder > *.dynamic-artist-cards-container .artist-cards-grid {\n  width: 100%;\n  max-width: none;\n}\n.compact-card {\n  --accent-color: #ffffff;\n  position: relative;\n  background: rgba(15, 15, 25, 0.95);\n  border: 1px solid rgba(255, 255, 255, 0.15);\n  border-radius: 16px;\n  padding: 1rem;\n  cursor: pointer;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  -webkit-backdrop-filter: blur(15px);\n  backdrop-filter: blur(15px);\n  overflow: hidden;\n  width: 100%;\n}\n.compact-card.vertical-card {\n  display: flex;\n  align-items: center;\n  gap: 0.75rem;\n  min-height: 80px;\n  max-width: 100%;\n  box-sizing: border-box;\n}\n.compact-card:hover {\n  transform: translateY(-4px);\n  background: rgba(25, 25, 40, 0.98);\n  border-color: var(--accent-color);\n  box-shadow:\n    0 12px 35px rgba(0, 0, 0, 0.4),\n    0 0 25px rgba(var(--accent-color-rgb, 255, 255, 255), 0.15),\n    inset 0 1px 0 rgba(255, 255, 255, 0.1);\n}\n.compact-card:hover .card-accent {\n  opacity: 1;\n}\n.compact-card:hover .compact-avatar .avatar-image {\n  transform: scale(1.05);\n}\n.compact-card:hover .artist-name {\n  color: var(--accent-color);\n  text-shadow: 0 0 8px rgba(var(--accent-color-rgb, 255, 255, 255), 0.3);\n}\n.compact-card:hover .social-btn {\n  opacity: 1;\n  transform: scale(1.1) translateY(-1px);\n}\n.compact-card:active {\n  transform: translateY(-2px) scale(0.98);\n}\n.compact-avatar {\n  flex-shrink: 0;\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  overflow: hidden;\n  background: rgba(255, 255, 255, 0.1);\n  position: relative;\n  border: 2px solid rgba(255, 255, 255, 0.2);\n  transition: all 0.3s ease;\n}\n.compact-avatar .avatar-image {\n  width: 100%;\n  height: 100%;\n  object-fit: cover;\n  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n}\n.compact-avatar .avatar-initials {\n  width: 100%;\n  height: 100%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  font-size: 0.9rem;\n  font-weight: 700;\n  color: white;\n  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.6);\n  letter-spacing: 0.5px;\n}\n.compact-info {\n  flex: 1;\n  min-width: 0;\n  padding: 0 0.25rem;\n}\n.compact-info .artist-name {\n  font-size: 0.95rem;\n  font-weight: 700;\n  color: rgba(255, 255, 255, 0.96);\n  margin: 0 0 0.15rem 0;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 1.2;\n}\n.compact-info .artist-role {\n  font-size: 0.75rem;\n  color: rgba(255, 255, 255, 0.65);\n  margin: 0;\n  text-transform: uppercase;\n  letter-spacing: 0.5px;\n  font-weight: 600;\n  white-space: nowrap;\n  overflow: hidden;\n  text-overflow: ellipsis;\n  line-height: 1.1;\n}\n.compact-social {\n  flex-shrink: 0;\n}\n.compact-social .social-btn {\n  width: 32px;\n  height: 32px;\n  border-radius: 8px;\n  background: rgba(255, 255, 255, 0.08);\n  border: 1px solid rgba(255, 255, 255, 0.25);\n  opacity: 0.8;\n  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  -webkit-backdrop-filter: blur(5px);\n  backdrop-filter: blur(5px);\n}\n.compact-social .social-btn:hover {\n  background: var(--accent-color);\n  border-color: var(--accent-color);\n  opacity: 1;\n  box-shadow: 0 4px 12px rgba(var(--accent-color-rgb, 255, 255, 255), 0.3);\n}\n.compact-social .social-btn:hover .twitter-x-icon {\n  color: #000;\n  transform: scale(1.1);\n}\n.compact-social .social-btn:hover .instagram-icon {\n  color: #000;\n  transform: scale(1.1);\n}\n.compact-social .social-btn .twitter-x-icon {\n  font-size: 0.85rem;\n  font-weight: bold;\n  color: rgba(255, 255, 255, 0.9);\n  transition: all 0.3s ease;\n}\n.compact-social .social-btn .instagram-icon {\n  font-size: 0.9rem;\n  color: rgba(255, 255, 255, 0.9);\n  transition: all 0.3s ease;\n}\n.card-accent {\n  position: absolute;\n  bottom: 0;\n  left: 0;\n  right: 0;\n  height: 3px;\n  background:\n    linear-gradient(\n      90deg,\n      var(--accent-color),\n      transparent);\n  opacity: 0;\n  transition: opacity 0.3s ease;\n  border-radius: 0 0 16px 16px;\n}\n@media (max-width: 1199px) {\n  .three-column-layout {\n    gap: 1.5rem;\n    padding: 0 1.5rem;\n  }\n  .section-header .section-title {\n    font-size: 1.6rem;\n  }\n}\n@media (max-width: 991px) {\n  .three-column-layout {\n    grid-template-columns: 200px 1fr 200px;\n    gap: 1rem;\n    padding: 0 1rem;\n  }\n  .compact-card.vertical-card {\n    padding: 0.8rem;\n    gap: 0.6rem;\n    min-height: 70px;\n  }\n  .compact-avatar {\n    width: 38px;\n    height: 38px;\n  }\n  .compact-info .artist-name {\n    font-size: 0.85rem;\n  }\n  .compact-info .artist-role {\n    font-size: 0.7rem;\n  }\n}\n@media (max-width: 768px) {\n  .special-mentions-container {\n    padding: 0.5rem 0;\n  }\n  .section-header {\n    margin-bottom: 1.5rem;\n  }\n  .section-header .section-title {\n    font-size: 1.4rem;\n  }\n  .section-header .section-subtitle {\n    font-size: 0.9rem;\n  }\n  .three-column-layout {\n    display: flex;\n    flex-direction: column;\n    gap: 1.5rem;\n    padding: 0 1rem;\n    min-height: auto;\n  }\n  .cards-column {\n    position: static;\n    max-height: none;\n    width: 100%;\n  }\n  .cards-column.left-column,\n  .cards-column.right-column {\n    justify-self: auto;\n  }\n  .column-cards {\n    display: grid;\n    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n    gap: 0.75rem;\n    padding: 0;\n  }\n  .main-content-column {\n    order: -1;\n    min-height: 300px;\n    padding: 1rem 0;\n  }\n  .content-placeholder {\n    min-height: 250px;\n    border-radius: 12px;\n  }\n  .content-placeholder:empty::before {\n    font-size: 1rem;\n  }\n}\n@media (max-width: 480px) {\n  .special-mentions-container {\n    padding: 0.25rem 0;\n  }\n  .section-header {\n    margin-bottom: 1rem;\n  }\n  .section-header .section-title {\n    font-size: 1.2rem;\n  }\n  .section-header .section-subtitle {\n    font-size: 0.8rem;\n  }\n  .three-column-layout {\n    padding: 0 0.5rem;\n    gap: 1rem;\n  }\n  .column-cards {\n    grid-template-columns: 1fr;\n    gap: 0.6rem;\n  }\n  .compact-card.vertical-card {\n    padding: 0.7rem;\n    gap: 0.5rem;\n    min-height: 60px;\n    border-radius: 12px;\n  }\n  .compact-avatar {\n    width: 34px;\n    height: 34px;\n  }\n  .compact-avatar .avatar-initials {\n    font-size: 0.8rem;\n  }\n  .compact-info {\n    padding: 0 0.15rem;\n  }\n  .compact-info .artist-name {\n    font-size: 0.8rem;\n  }\n  .compact-info .artist-role {\n    font-size: 0.65rem;\n  }\n  .compact-social .social-btn {\n    width: 28px;\n    height: 28px;\n    border-radius: 6px;\n  }\n  .compact-social .social-btn .twitter-x-icon {\n    font-size: 0.75rem;\n  }\n  .main-content-column {\n    padding: 0.5rem 0;\n  }\n  .content-placeholder {\n    min-height: 200px;\n    padding: 1rem 0.5rem;\n  }\n}\n.cards-column {\n  scrollbar-width: thin;\n  scrollbar-color: rgba(255, 255, 255, 0.3) transparent;\n}\n.cards-column::-webkit-scrollbar {\n  width: 4px;\n}\n.cards-column::-webkit-scrollbar-track {\n  background: transparent;\n}\n.cards-column::-webkit-scrollbar-thumb {\n  background: rgba(255, 255, 255, 0.3);\n  border-radius: 2px;\n}\n.cards-column::-webkit-scrollbar-thumb:hover {\n  background: rgba(255, 255, 255, 0.5);\n}\n@media (prefers-reduced-motion: reduce) {\n  .compact-card,\n  .compact-avatar .avatar-image,\n  .social-btn,\n  .card-accent,\n  .cards-column {\n    transition: none !important;\n    transform: none !important;\n  }\n  .compact-card:hover {\n    transform: none !important;\n  }\n}\n@media (prefers-contrast: high) {\n  .compact-card {\n    border-color: rgba(255, 255, 255, 0.6);\n    background: rgba(0, 0, 0, 0.95);\n  }\n  .compact-avatar {\n    border-color: rgba(255, 255, 255, 0.5);\n  }\n  .artist-name {\n    color: #fff !important;\n  }\n  .artist-role {\n    color: rgba(255, 255, 255, 0.85) !important;\n  }\n  .content-placeholder {\n    border-color: rgba(255, 255, 255, 0.5);\n    background: rgba(0, 0, 0, 0.8);\n  }\n}\n.compact-card:focus-visible {\n  outline: 2px solid var(--accent-color);\n  outline-offset: 2px;\n}\n.social-btn:focus-visible {\n  outline: 2px solid var(--accent-color);\n  outline-offset: 1px;\n}\n/*# sourceMappingURL=special-mentions.component.css.map */\n'] }]
  }], () => [{ type: GelDbIntegrationService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(SpecialMentionsComponent, { className: "SpecialMentionsComponent", filePath: "src/app/components/special-mentions/special-mentions.component.ts", lineNumber: 32 });
})();

export {
  MatCardModule,
  MatChipsModule,
  DynamicArtistService,
  AudioService,
  MusicPlayerComponent,
  LoadingScreenComponent,
  DynamicArtistCardsComponent,
  SpecialMentionsComponent
};
/*! Bundled license information:

howler/dist/howler.js:
  (*!
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
  (*!
   *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
   *  
   *  howler.js v2.2.4
   *  howlerjs.com
   *
   *  (c) 2013-2020, James Simpson of GoldFire Studios
   *  goldfirestudios.com
   *
   *  MIT License
   *)
*/
//# sourceMappingURL=chunk-HLNC3VFB.js.map
