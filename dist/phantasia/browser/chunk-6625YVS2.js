import{c as Lc,d as va,f as co,g as ya}from"./chunk-ZRIGA7C4.js";import{a as nh}from"./chunk-TOGBP23S.js";import{e as th}from"./chunk-HI7UVJRH.js";import{a as _a}from"./chunk-INV6E4XJ.js";import{i as ga,j as Ui,k as Rn}from"./chunk-I6DLYWHU.js";import{$ as $t,$a as Ze,Aa as Ae,Da as Yd,Ea as qd,Ga as et,Gb as Kn,M as Ni,Ma as Tn,Qa as Jt,R as ze,Sa as os,Ta as ua,V as Be,Za as jd,_a as Zd,a as Ct,aa as Kt,ab as he,b as ui,bb as me,cb as Gt,d as Yp,da as Vd,db as ki,e as qp,ea as Gd,eb as as,f as rn,fb as $d,gb as da,hb as ha,ib as di,jb as Bt,kb as Kd,l as wn,lb as vt,m as Li,mb as fa,nb as pa,oa as Wd,ob as ma,pb as Jd,qb as An,sb as Re,t as Dc,tb as $n,ub as Fi,vb as Qd,wa as Xd,ya as lo,za as Oc,zb as eh}from"./chunk-PVBC43KC.js";var Fp=Yp(bc=>{"use strict";(function(){"use strict";var s=function(){this.init()};s.prototype={init:function(){var a=this||e;return a._counter=1e3,a._html5AudioPool=[],a.html5PoolSize=10,a._codecs={},a._howls=[],a._muted=!1,a._volume=1,a._canPlayEvent="canplaythrough",a._navigator=typeof window<"u"&&window.navigator?window.navigator:null,a.masterGain=null,a.noAudio=!1,a.usingWebAudio=!0,a.autoSuspend=!0,a.ctx=null,a.autoUnlock=!0,a._setup(),a},volume:function(a){var c=this||e;if(a=parseFloat(a),c.ctx||d(),typeof a<"u"&&a>=0&&a<=1){if(c._volume=a,c._muted)return c;c.usingWebAudio&&c.masterGain.gain.setValueAtTime(a,e.ctx.currentTime);for(var h=0;h<c._howls.length;h++)if(!c._howls[h]._webAudio)for(var f=c._howls[h]._getSoundIds(),g=0;g<f.length;g++){var _=c._howls[h]._soundById(f[g]);_&&_._node&&(_._node.volume=_._volume*a)}return c}return c._volume},mute:function(a){var c=this||e;c.ctx||d(),c._muted=a,c.usingWebAudio&&c.masterGain.gain.setValueAtTime(a?0:c._volume,e.ctx.currentTime);for(var h=0;h<c._howls.length;h++)if(!c._howls[h]._webAudio)for(var f=c._howls[h]._getSoundIds(),g=0;g<f.length;g++){var _=c._howls[h]._soundById(f[g]);_&&_._node&&(_._node.muted=a?!0:_._muted)}return c},stop:function(){for(var a=this||e,c=0;c<a._howls.length;c++)a._howls[c].stop();return a},unload:function(){for(var a=this||e,c=a._howls.length-1;c>=0;c--)a._howls[c].unload();return a.usingWebAudio&&a.ctx&&typeof a.ctx.close<"u"&&(a.ctx.close(),a.ctx=null,d()),a},codecs:function(a){return(this||e)._codecs[a.replace(/^x-/,"")]},_setup:function(){var a=this||e;if(a.state=a.ctx&&a.ctx.state||"suspended",a._autoSuspend(),!a.usingWebAudio)if(typeof Audio<"u")try{var c=new Audio;typeof c.oncanplaythrough>"u"&&(a._canPlayEvent="canplay")}catch{a.noAudio=!0}else a.noAudio=!0;try{var c=new Audio;c.muted&&(a.noAudio=!0)}catch{}return a.noAudio||a._setupCodecs(),a},_setupCodecs:function(){var a=this||e,c=null;try{c=typeof Audio<"u"?new Audio:null}catch{return a}if(!c||typeof c.canPlayType!="function")return a;var h=c.canPlayType("audio/mpeg;").replace(/^no$/,""),f=a._navigator?a._navigator.userAgent:"",g=f.match(/OPR\/(\d+)/g),_=g&&parseInt(g[0].split("/")[1],10)<33,m=f.indexOf("Safari")!==-1&&f.indexOf("Chrome")===-1,p=f.match(/Version\/(.*?) /),b=m&&p&&parseInt(p[1],10)<15;return a._codecs={mp3:!!(!_&&(h||c.canPlayType("audio/mp3;").replace(/^no$/,""))),mpeg:!!h,opus:!!c.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/,""),ogg:!!c.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),oga:!!c.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/,""),wav:!!(c.canPlayType('audio/wav; codecs="1"')||c.canPlayType("audio/wav")).replace(/^no$/,""),aac:!!c.canPlayType("audio/aac;").replace(/^no$/,""),caf:!!c.canPlayType("audio/x-caf;").replace(/^no$/,""),m4a:!!(c.canPlayType("audio/x-m4a;")||c.canPlayType("audio/m4a;")||c.canPlayType("audio/aac;")).replace(/^no$/,""),m4b:!!(c.canPlayType("audio/x-m4b;")||c.canPlayType("audio/m4b;")||c.canPlayType("audio/aac;")).replace(/^no$/,""),mp4:!!(c.canPlayType("audio/x-mp4;")||c.canPlayType("audio/mp4;")||c.canPlayType("audio/aac;")).replace(/^no$/,""),weba:!!(!b&&c.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")),webm:!!(!b&&c.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/,"")),dolby:!!c.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/,""),flac:!!(c.canPlayType("audio/x-flac;")||c.canPlayType("audio/flac;")).replace(/^no$/,"")},a},_unlockAudio:function(){var a=this||e;if(!(a._audioUnlocked||!a.ctx)){a._audioUnlocked=!1,a.autoUnlock=!1,!a._mobileUnloaded&&a.ctx.sampleRate!==44100&&(a._mobileUnloaded=!0,a.unload()),a._scratchBuffer=a.ctx.createBuffer(1,1,22050);var c=function(h){for(;a._html5AudioPool.length<a.html5PoolSize;)try{var f=new Audio;f._unlocked=!0,a._releaseHtml5Audio(f)}catch{a.noAudio=!0;break}for(var g=0;g<a._howls.length;g++)if(!a._howls[g]._webAudio)for(var _=a._howls[g]._getSoundIds(),m=0;m<_.length;m++){var p=a._howls[g]._soundById(_[m]);p&&p._node&&!p._node._unlocked&&(p._node._unlocked=!0,p._node.load())}a._autoResume();var b=a.ctx.createBufferSource();b.buffer=a._scratchBuffer,b.connect(a.ctx.destination),typeof b.start>"u"?b.noteOn(0):b.start(0),typeof a.ctx.resume=="function"&&a.ctx.resume(),b.onended=function(){b.disconnect(0),a._audioUnlocked=!0,document.removeEventListener("touchstart",c,!0),document.removeEventListener("touchend",c,!0),document.removeEventListener("click",c,!0),document.removeEventListener("keydown",c,!0);for(var M=0;M<a._howls.length;M++)a._howls[M]._emit("unlock")}};return document.addEventListener("touchstart",c,!0),document.addEventListener("touchend",c,!0),document.addEventListener("click",c,!0),document.addEventListener("keydown",c,!0),a}},_obtainHtml5Audio:function(){var a=this||e;if(a._html5AudioPool.length)return a._html5AudioPool.pop();var c=new Audio().play();return c&&typeof Promise<"u"&&(c instanceof Promise||typeof c.then=="function")&&c.catch(function(){console.warn("HTML5 Audio pool exhausted, returning potentially locked audio object.")}),new Audio},_releaseHtml5Audio:function(a){var c=this||e;return a._unlocked&&c._html5AudioPool.push(a),c},_autoSuspend:function(){var a=this;if(!(!a.autoSuspend||!a.ctx||typeof a.ctx.suspend>"u"||!e.usingWebAudio)){for(var c=0;c<a._howls.length;c++)if(a._howls[c]._webAudio){for(var h=0;h<a._howls[c]._sounds.length;h++)if(!a._howls[c]._sounds[h]._paused)return a}return a._suspendTimer&&clearTimeout(a._suspendTimer),a._suspendTimer=setTimeout(function(){if(a.autoSuspend){a._suspendTimer=null,a.state="suspending";var f=function(){a.state="suspended",a._resumeAfterSuspend&&(delete a._resumeAfterSuspend,a._autoResume())};a.ctx.suspend().then(f,f)}},3e4),a}},_autoResume:function(){var a=this;if(!(!a.ctx||typeof a.ctx.resume>"u"||!e.usingWebAudio))return a.state==="running"&&a.ctx.state!=="interrupted"&&a._suspendTimer?(clearTimeout(a._suspendTimer),a._suspendTimer=null):a.state==="suspended"||a.state==="running"&&a.ctx.state==="interrupted"?(a.ctx.resume().then(function(){a.state="running";for(var c=0;c<a._howls.length;c++)a._howls[c]._emit("resume")}),a._suspendTimer&&(clearTimeout(a._suspendTimer),a._suspendTimer=null)):a.state==="suspending"&&(a._resumeAfterSuspend=!0),a}};var e=new s,t=function(a){var c=this;if(!a.src||a.src.length===0){console.error("An array of source files must be passed with any new Howl.");return}c.init(a)};t.prototype={init:function(a){var c=this;return e.ctx||d(),c._autoplay=a.autoplay||!1,c._format=typeof a.format!="string"?a.format:[a.format],c._html5=a.html5||!1,c._muted=a.mute||!1,c._loop=a.loop||!1,c._pool=a.pool||5,c._preload=typeof a.preload=="boolean"||a.preload==="metadata"?a.preload:!0,c._rate=a.rate||1,c._sprite=a.sprite||{},c._src=typeof a.src!="string"?a.src:[a.src],c._volume=a.volume!==void 0?a.volume:1,c._xhr={method:a.xhr&&a.xhr.method?a.xhr.method:"GET",headers:a.xhr&&a.xhr.headers?a.xhr.headers:null,withCredentials:a.xhr&&a.xhr.withCredentials?a.xhr.withCredentials:!1},c._duration=0,c._state="unloaded",c._sounds=[],c._endTimers={},c._queue=[],c._playLock=!1,c._onend=a.onend?[{fn:a.onend}]:[],c._onfade=a.onfade?[{fn:a.onfade}]:[],c._onload=a.onload?[{fn:a.onload}]:[],c._onloaderror=a.onloaderror?[{fn:a.onloaderror}]:[],c._onplayerror=a.onplayerror?[{fn:a.onplayerror}]:[],c._onpause=a.onpause?[{fn:a.onpause}]:[],c._onplay=a.onplay?[{fn:a.onplay}]:[],c._onstop=a.onstop?[{fn:a.onstop}]:[],c._onmute=a.onmute?[{fn:a.onmute}]:[],c._onvolume=a.onvolume?[{fn:a.onvolume}]:[],c._onrate=a.onrate?[{fn:a.onrate}]:[],c._onseek=a.onseek?[{fn:a.onseek}]:[],c._onunlock=a.onunlock?[{fn:a.onunlock}]:[],c._onresume=[],c._webAudio=e.usingWebAudio&&!c._html5,typeof e.ctx<"u"&&e.ctx&&e.autoUnlock&&e._unlockAudio(),e._howls.push(c),c._autoplay&&c._queue.push({event:"play",action:function(){c.play()}}),c._preload&&c._preload!=="none"&&c.load(),c},load:function(){var a=this,c=null;if(e.noAudio){a._emit("loaderror",null,"No audio support.");return}typeof a._src=="string"&&(a._src=[a._src]);for(var h=0;h<a._src.length;h++){var f,g;if(a._format&&a._format[h])f=a._format[h];else{if(g=a._src[h],typeof g!="string"){a._emit("loaderror",null,"Non-string found in selected audio sources - ignoring.");continue}f=/^data:audio\/([^;,]+);/i.exec(g),f||(f=/\.([^.]+)$/.exec(g.split("?",1)[0])),f&&(f=f[1].toLowerCase())}if(f||console.warn('No file extension was found. Consider using the "format" property or specify an extension.'),f&&e.codecs(f)){c=a._src[h];break}}if(!c){a._emit("loaderror",null,"No codec support for selected audio sources.");return}return a._src=c,a._state="loading",window.location.protocol==="https:"&&c.slice(0,5)==="http:"&&(a._html5=!0,a._webAudio=!1),new n(a),a._webAudio&&r(a),a},play:function(a,c){var h=this,f=null;if(typeof a=="number")f=a,a=null;else{if(typeof a=="string"&&h._state==="loaded"&&!h._sprite[a])return null;if(typeof a>"u"&&(a="__default",!h._playLock)){for(var g=0,_=0;_<h._sounds.length;_++)h._sounds[_]._paused&&!h._sounds[_]._ended&&(g++,f=h._sounds[_]._id);g===1?a=null:f=null}}var m=f?h._soundById(f):h._inactiveSound();if(!m)return null;if(f&&!a&&(a=m._sprite||"__default"),h._state!=="loaded"){m._sprite=a,m._ended=!1;var p=m._id;return h._queue.push({event:"play",action:function(){h.play(p)}}),p}if(f&&!m._paused)return c||h._loadQueue("play"),m._id;h._webAudio&&e._autoResume();var b=Math.max(0,m._seek>0?m._seek:h._sprite[a][0]/1e3),M=Math.max(0,(h._sprite[a][0]+h._sprite[a][1])/1e3-b),y=M*1e3/Math.abs(m._rate),T=h._sprite[a][0]/1e3,P=(h._sprite[a][0]+h._sprite[a][1])/1e3;m._sprite=a,m._ended=!1;var A=function(){m._paused=!1,m._seek=b,m._start=T,m._stop=P,m._loop=!!(m._loop||h._sprite[a][2])};if(b>=P){h._ended(m);return}var D=m._node;if(h._webAudio){var S=function(){h._playLock=!1,A(),h._refreshBuffer(m);var B=m._muted||h._muted?0:m._volume;D.gain.setValueAtTime(B,e.ctx.currentTime),m._playStart=e.ctx.currentTime,typeof D.bufferSource.start>"u"?m._loop?D.bufferSource.noteGrainOn(0,b,86400):D.bufferSource.noteGrainOn(0,b,M):m._loop?D.bufferSource.start(0,b,86400):D.bufferSource.start(0,b,M),y!==1/0&&(h._endTimers[m._id]=setTimeout(h._ended.bind(h,m),y)),c||setTimeout(function(){h._emit("play",m._id),h._loadQueue()},0)};e.state==="running"&&e.ctx.state!=="interrupted"?S():(h._playLock=!0,h.once("resume",S),h._clearTimer(m._id))}else{var E=function(){D.currentTime=b,D.muted=m._muted||h._muted||e._muted||D.muted,D.volume=m._volume*e.volume(),D.playbackRate=m._rate;try{var B=D.play();if(B&&typeof Promise<"u"&&(B instanceof Promise||typeof B.then=="function")?(h._playLock=!0,A(),B.then(function(){h._playLock=!1,D._unlocked=!0,c?h._loadQueue():h._emit("play",m._id)}).catch(function(){h._playLock=!1,h._emit("playerror",m._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction."),m._ended=!0,m._paused=!0})):c||(h._playLock=!1,A(),h._emit("play",m._id)),D.playbackRate=m._rate,D.paused){h._emit("playerror",m._id,"Playback was unable to start. This is most commonly an issue on mobile devices and Chrome where playback was not within a user interaction.");return}a!=="__default"||m._loop?h._endTimers[m._id]=setTimeout(h._ended.bind(h,m),y):(h._endTimers[m._id]=function(){h._ended(m),D.removeEventListener("ended",h._endTimers[m._id],!1)},D.addEventListener("ended",h._endTimers[m._id],!1))}catch(z){h._emit("playerror",m._id,z)}};D.src==="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA"&&(D.src=h._src,D.load());var R=window&&window.ejecta||!D.readyState&&e._navigator.isCocoonJS;if(D.readyState>=3||R)E();else{h._playLock=!0,h._state="loading";var V=function(){h._state="loaded",E(),D.removeEventListener(e._canPlayEvent,V,!1)};D.addEventListener(e._canPlayEvent,V,!1),h._clearTimer(m._id)}}return m._id},pause:function(a){var c=this;if(c._state!=="loaded"||c._playLock)return c._queue.push({event:"pause",action:function(){c.pause(a)}}),c;for(var h=c._getSoundIds(a),f=0;f<h.length;f++){c._clearTimer(h[f]);var g=c._soundById(h[f]);if(g&&!g._paused&&(g._seek=c.seek(h[f]),g._rateSeek=0,g._paused=!0,c._stopFade(h[f]),g._node))if(c._webAudio){if(!g._node.bufferSource)continue;typeof g._node.bufferSource.stop>"u"?g._node.bufferSource.noteOff(0):g._node.bufferSource.stop(0),c._cleanBuffer(g._node)}else(!isNaN(g._node.duration)||g._node.duration===1/0)&&g._node.pause();arguments[1]||c._emit("pause",g?g._id:null)}return c},stop:function(a,c){var h=this;if(h._state!=="loaded"||h._playLock)return h._queue.push({event:"stop",action:function(){h.stop(a)}}),h;for(var f=h._getSoundIds(a),g=0;g<f.length;g++){h._clearTimer(f[g]);var _=h._soundById(f[g]);_&&(_._seek=_._start||0,_._rateSeek=0,_._paused=!0,_._ended=!0,h._stopFade(f[g]),_._node&&(h._webAudio?_._node.bufferSource&&(typeof _._node.bufferSource.stop>"u"?_._node.bufferSource.noteOff(0):_._node.bufferSource.stop(0),h._cleanBuffer(_._node)):(!isNaN(_._node.duration)||_._node.duration===1/0)&&(_._node.currentTime=_._start||0,_._node.pause(),_._node.duration===1/0&&h._clearSound(_._node))),c||h._emit("stop",_._id))}return h},mute:function(a,c){var h=this;if(h._state!=="loaded"||h._playLock)return h._queue.push({event:"mute",action:function(){h.mute(a,c)}}),h;if(typeof c>"u")if(typeof a=="boolean")h._muted=a;else return h._muted;for(var f=h._getSoundIds(c),g=0;g<f.length;g++){var _=h._soundById(f[g]);_&&(_._muted=a,_._interval&&h._stopFade(_._id),h._webAudio&&_._node?_._node.gain.setValueAtTime(a?0:_._volume,e.ctx.currentTime):_._node&&(_._node.muted=e._muted?!0:a),h._emit("mute",_._id))}return h},volume:function(){var a=this,c=arguments,h,f;if(c.length===0)return a._volume;if(c.length===1||c.length===2&&typeof c[1]>"u"){var g=a._getSoundIds(),_=g.indexOf(c[0]);_>=0?f=parseInt(c[0],10):h=parseFloat(c[0])}else c.length>=2&&(h=parseFloat(c[0]),f=parseInt(c[1],10));var m;if(typeof h<"u"&&h>=0&&h<=1){if(a._state!=="loaded"||a._playLock)return a._queue.push({event:"volume",action:function(){a.volume.apply(a,c)}}),a;typeof f>"u"&&(a._volume=h),f=a._getSoundIds(f);for(var p=0;p<f.length;p++)m=a._soundById(f[p]),m&&(m._volume=h,c[2]||a._stopFade(f[p]),a._webAudio&&m._node&&!m._muted?m._node.gain.setValueAtTime(h,e.ctx.currentTime):m._node&&!m._muted&&(m._node.volume=h*e.volume()),a._emit("volume",m._id))}else return m=f?a._soundById(f):a._sounds[0],m?m._volume:0;return a},fade:function(a,c,h,f){var g=this;if(g._state!=="loaded"||g._playLock)return g._queue.push({event:"fade",action:function(){g.fade(a,c,h,f)}}),g;a=Math.min(Math.max(0,parseFloat(a)),1),c=Math.min(Math.max(0,parseFloat(c)),1),h=parseFloat(h),g.volume(a,f);for(var _=g._getSoundIds(f),m=0;m<_.length;m++){var p=g._soundById(_[m]);if(p){if(f||g._stopFade(_[m]),g._webAudio&&!p._muted){var b=e.ctx.currentTime,M=b+h/1e3;p._volume=a,p._node.gain.setValueAtTime(a,b),p._node.gain.linearRampToValueAtTime(c,M)}g._startFadeInterval(p,a,c,h,_[m],typeof f>"u")}}return g},_startFadeInterval:function(a,c,h,f,g,_){var m=this,p=c,b=h-c,M=Math.abs(b/.01),y=Math.max(4,M>0?f/M:f),T=Date.now();a._fadeTo=h,a._interval=setInterval(function(){var P=(Date.now()-T)/f;T=Date.now(),p+=b*P,p=Math.round(p*100)/100,b<0?p=Math.max(h,p):p=Math.min(h,p),m._webAudio?a._volume=p:m.volume(p,a._id,!0),_&&(m._volume=p),(h<c&&p<=h||h>c&&p>=h)&&(clearInterval(a._interval),a._interval=null,a._fadeTo=null,m.volume(h,a._id),m._emit("fade",a._id))},y)},_stopFade:function(a){var c=this,h=c._soundById(a);return h&&h._interval&&(c._webAudio&&h._node.gain.cancelScheduledValues(e.ctx.currentTime),clearInterval(h._interval),h._interval=null,c.volume(h._fadeTo,a),h._fadeTo=null,c._emit("fade",a)),c},loop:function(){var a=this,c=arguments,h,f,g;if(c.length===0)return a._loop;if(c.length===1)if(typeof c[0]=="boolean")h=c[0],a._loop=h;else return g=a._soundById(parseInt(c[0],10)),g?g._loop:!1;else c.length===2&&(h=c[0],f=parseInt(c[1],10));for(var _=a._getSoundIds(f),m=0;m<_.length;m++)g=a._soundById(_[m]),g&&(g._loop=h,a._webAudio&&g._node&&g._node.bufferSource&&(g._node.bufferSource.loop=h,h&&(g._node.bufferSource.loopStart=g._start||0,g._node.bufferSource.loopEnd=g._stop,a.playing(_[m])&&(a.pause(_[m],!0),a.play(_[m],!0)))));return a},rate:function(){var a=this,c=arguments,h,f;if(c.length===0)f=a._sounds[0]._id;else if(c.length===1){var g=a._getSoundIds(),_=g.indexOf(c[0]);_>=0?f=parseInt(c[0],10):h=parseFloat(c[0])}else c.length===2&&(h=parseFloat(c[0]),f=parseInt(c[1],10));var m;if(typeof h=="number"){if(a._state!=="loaded"||a._playLock)return a._queue.push({event:"rate",action:function(){a.rate.apply(a,c)}}),a;typeof f>"u"&&(a._rate=h),f=a._getSoundIds(f);for(var p=0;p<f.length;p++)if(m=a._soundById(f[p]),m){a.playing(f[p])&&(m._rateSeek=a.seek(f[p]),m._playStart=a._webAudio?e.ctx.currentTime:m._playStart),m._rate=h,a._webAudio&&m._node&&m._node.bufferSource?m._node.bufferSource.playbackRate.setValueAtTime(h,e.ctx.currentTime):m._node&&(m._node.playbackRate=h);var b=a.seek(f[p]),M=(a._sprite[m._sprite][0]+a._sprite[m._sprite][1])/1e3-b,y=M*1e3/Math.abs(m._rate);(a._endTimers[f[p]]||!m._paused)&&(a._clearTimer(f[p]),a._endTimers[f[p]]=setTimeout(a._ended.bind(a,m),y)),a._emit("rate",m._id)}}else return m=a._soundById(f),m?m._rate:a._rate;return a},seek:function(){var a=this,c=arguments,h,f;if(c.length===0)a._sounds.length&&(f=a._sounds[0]._id);else if(c.length===1){var g=a._getSoundIds(),_=g.indexOf(c[0]);_>=0?f=parseInt(c[0],10):a._sounds.length&&(f=a._sounds[0]._id,h=parseFloat(c[0]))}else c.length===2&&(h=parseFloat(c[0]),f=parseInt(c[1],10));if(typeof f>"u")return 0;if(typeof h=="number"&&(a._state!=="loaded"||a._playLock))return a._queue.push({event:"seek",action:function(){a.seek.apply(a,c)}}),a;var m=a._soundById(f);if(m)if(typeof h=="number"&&h>=0){var p=a.playing(f);p&&a.pause(f,!0),m._seek=h,m._ended=!1,a._clearTimer(f),!a._webAudio&&m._node&&!isNaN(m._node.duration)&&(m._node.currentTime=h);var b=function(){p&&a.play(f,!0),a._emit("seek",f)};if(p&&!a._webAudio){var M=function(){a._playLock?setTimeout(M,0):b()};setTimeout(M,0)}else b()}else if(a._webAudio){var y=a.playing(f)?e.ctx.currentTime-m._playStart:0,T=m._rateSeek?m._rateSeek-m._seek:0;return m._seek+(T+y*Math.abs(m._rate))}else return m._node.currentTime;return a},playing:function(a){var c=this;if(typeof a=="number"){var h=c._soundById(a);return h?!h._paused:!1}for(var f=0;f<c._sounds.length;f++)if(!c._sounds[f]._paused)return!0;return!1},duration:function(a){var c=this,h=c._duration,f=c._soundById(a);return f&&(h=c._sprite[f._sprite][1]/1e3),h},state:function(){return this._state},unload:function(){for(var a=this,c=a._sounds,h=0;h<c.length;h++)c[h]._paused||a.stop(c[h]._id),a._webAudio||(a._clearSound(c[h]._node),c[h]._node.removeEventListener("error",c[h]._errorFn,!1),c[h]._node.removeEventListener(e._canPlayEvent,c[h]._loadFn,!1),c[h]._node.removeEventListener("ended",c[h]._endFn,!1),e._releaseHtml5Audio(c[h]._node)),delete c[h]._node,a._clearTimer(c[h]._id);var f=e._howls.indexOf(a);f>=0&&e._howls.splice(f,1);var g=!0;for(h=0;h<e._howls.length;h++)if(e._howls[h]._src===a._src||a._src.indexOf(e._howls[h]._src)>=0){g=!1;break}return i&&g&&delete i[a._src],e.noAudio=!1,a._state="unloaded",a._sounds=[],a=null,null},on:function(a,c,h,f){var g=this,_=g["_on"+a];return typeof c=="function"&&_.push(f?{id:h,fn:c,once:f}:{id:h,fn:c}),g},off:function(a,c,h){var f=this,g=f["_on"+a],_=0;if(typeof c=="number"&&(h=c,c=null),c||h)for(_=0;_<g.length;_++){var m=h===g[_].id;if(c===g[_].fn&&m||!c&&m){g.splice(_,1);break}}else if(a)f["_on"+a]=[];else{var p=Object.keys(f);for(_=0;_<p.length;_++)p[_].indexOf("_on")===0&&Array.isArray(f[p[_]])&&(f[p[_]]=[])}return f},once:function(a,c,h){var f=this;return f.on(a,c,h,1),f},_emit:function(a,c,h){for(var f=this,g=f["_on"+a],_=g.length-1;_>=0;_--)(!g[_].id||g[_].id===c||a==="load")&&(setTimeout((function(m){m.call(this,c,h)}).bind(f,g[_].fn),0),g[_].once&&f.off(a,g[_].fn,g[_].id));return f._loadQueue(a),f},_loadQueue:function(a){var c=this;if(c._queue.length>0){var h=c._queue[0];h.event===a&&(c._queue.shift(),c._loadQueue()),a||h.action()}return c},_ended:function(a){var c=this,h=a._sprite;if(!c._webAudio&&a._node&&!a._node.paused&&!a._node.ended&&a._node.currentTime<a._stop)return setTimeout(c._ended.bind(c,a),100),c;var f=!!(a._loop||c._sprite[h][2]);if(c._emit("end",a._id),!c._webAudio&&f&&c.stop(a._id,!0).play(a._id),c._webAudio&&f){c._emit("play",a._id),a._seek=a._start||0,a._rateSeek=0,a._playStart=e.ctx.currentTime;var g=(a._stop-a._start)*1e3/Math.abs(a._rate);c._endTimers[a._id]=setTimeout(c._ended.bind(c,a),g)}return c._webAudio&&!f&&(a._paused=!0,a._ended=!0,a._seek=a._start||0,a._rateSeek=0,c._clearTimer(a._id),c._cleanBuffer(a._node),e._autoSuspend()),!c._webAudio&&!f&&c.stop(a._id,!0),c},_clearTimer:function(a){var c=this;if(c._endTimers[a]){if(typeof c._endTimers[a]!="function")clearTimeout(c._endTimers[a]);else{var h=c._soundById(a);h&&h._node&&h._node.removeEventListener("ended",c._endTimers[a],!1)}delete c._endTimers[a]}return c},_soundById:function(a){for(var c=this,h=0;h<c._sounds.length;h++)if(a===c._sounds[h]._id)return c._sounds[h];return null},_inactiveSound:function(){var a=this;a._drain();for(var c=0;c<a._sounds.length;c++)if(a._sounds[c]._ended)return a._sounds[c].reset();return new n(a)},_drain:function(){var a=this,c=a._pool,h=0,f=0;if(!(a._sounds.length<c)){for(f=0;f<a._sounds.length;f++)a._sounds[f]._ended&&h++;for(f=a._sounds.length-1;f>=0;f--){if(h<=c)return;a._sounds[f]._ended&&(a._webAudio&&a._sounds[f]._node&&a._sounds[f]._node.disconnect(0),a._sounds.splice(f,1),h--)}}},_getSoundIds:function(a){var c=this;if(typeof a>"u"){for(var h=[],f=0;f<c._sounds.length;f++)h.push(c._sounds[f]._id);return h}else return[a]},_refreshBuffer:function(a){var c=this;return a._node.bufferSource=e.ctx.createBufferSource(),a._node.bufferSource.buffer=i[c._src],a._panner?a._node.bufferSource.connect(a._panner):a._node.bufferSource.connect(a._node),a._node.bufferSource.loop=a._loop,a._loop&&(a._node.bufferSource.loopStart=a._start||0,a._node.bufferSource.loopEnd=a._stop||0),a._node.bufferSource.playbackRate.setValueAtTime(a._rate,e.ctx.currentTime),c},_cleanBuffer:function(a){var c=this,h=e._navigator&&e._navigator.vendor.indexOf("Apple")>=0;if(!a.bufferSource)return c;if(e._scratchBuffer&&a.bufferSource&&(a.bufferSource.onended=null,a.bufferSource.disconnect(0),h))try{a.bufferSource.buffer=e._scratchBuffer}catch{}return a.bufferSource=null,c},_clearSound:function(a){var c=/MSIE |Trident\//.test(e._navigator&&e._navigator.userAgent);c||(a.src="data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA")}};var n=function(a){this._parent=a,this.init()};n.prototype={init:function(){var a=this,c=a._parent;return a._muted=c._muted,a._loop=c._loop,a._volume=c._volume,a._rate=c._rate,a._seek=0,a._paused=!0,a._ended=!0,a._sprite="__default",a._id=++e._counter,c._sounds.push(a),a.create(),a},create:function(){var a=this,c=a._parent,h=e._muted||a._muted||a._parent._muted?0:a._volume;return c._webAudio?(a._node=typeof e.ctx.createGain>"u"?e.ctx.createGainNode():e.ctx.createGain(),a._node.gain.setValueAtTime(h,e.ctx.currentTime),a._node.paused=!0,a._node.connect(e.masterGain)):e.noAudio||(a._node=e._obtainHtml5Audio(),a._errorFn=a._errorListener.bind(a),a._node.addEventListener("error",a._errorFn,!1),a._loadFn=a._loadListener.bind(a),a._node.addEventListener(e._canPlayEvent,a._loadFn,!1),a._endFn=a._endListener.bind(a),a._node.addEventListener("ended",a._endFn,!1),a._node.src=c._src,a._node.preload=c._preload===!0?"auto":c._preload,a._node.volume=h*e.volume(),a._node.load()),a},reset:function(){var a=this,c=a._parent;return a._muted=c._muted,a._loop=c._loop,a._volume=c._volume,a._rate=c._rate,a._seek=0,a._rateSeek=0,a._paused=!0,a._ended=!0,a._sprite="__default",a._id=++e._counter,a},_errorListener:function(){var a=this;a._parent._emit("loaderror",a._id,a._node.error?a._node.error.code:0),a._node.removeEventListener("error",a._errorFn,!1)},_loadListener:function(){var a=this,c=a._parent;c._duration=Math.ceil(a._node.duration*10)/10,Object.keys(c._sprite).length===0&&(c._sprite={__default:[0,c._duration*1e3]}),c._state!=="loaded"&&(c._state="loaded",c._emit("load"),c._loadQueue()),a._node.removeEventListener(e._canPlayEvent,a._loadFn,!1)},_endListener:function(){var a=this,c=a._parent;c._duration===1/0&&(c._duration=Math.ceil(a._node.duration*10)/10,c._sprite.__default[1]===1/0&&(c._sprite.__default[1]=c._duration*1e3),c._ended(a)),a._node.removeEventListener("ended",a._endFn,!1)}};var i={},r=function(a){var c=a._src;if(i[c]){a._duration=i[c].duration,u(a);return}if(/^data:[^;]+;base64,/.test(c)){for(var h=atob(c.split(",")[1]),f=new Uint8Array(h.length),g=0;g<h.length;++g)f[g]=h.charCodeAt(g);l(f.buffer,a)}else{var _=new XMLHttpRequest;_.open(a._xhr.method,c,!0),_.withCredentials=a._xhr.withCredentials,_.responseType="arraybuffer",a._xhr.headers&&Object.keys(a._xhr.headers).forEach(function(m){_.setRequestHeader(m,a._xhr.headers[m])}),_.onload=function(){var m=(_.status+"")[0];if(m!=="0"&&m!=="2"&&m!=="3"){a._emit("loaderror",null,"Failed loading audio file with status: "+_.status+".");return}l(_.response,a)},_.onerror=function(){a._webAudio&&(a._html5=!0,a._webAudio=!1,a._sounds=[],delete i[c],a.load())},o(_)}},o=function(a){try{a.send()}catch{a.onerror()}},l=function(a,c){var h=function(){c._emit("loaderror",null,"Decoding audio data failed.")},f=function(g){g&&c._sounds.length>0?(i[c._src]=g,u(c,g)):h()};typeof Promise<"u"&&e.ctx.decodeAudioData.length===1?e.ctx.decodeAudioData(a).then(f).catch(h):e.ctx.decodeAudioData(a,f,h)},u=function(a,c){c&&!a._duration&&(a._duration=c.duration),Object.keys(a._sprite).length===0&&(a._sprite={__default:[0,a._duration*1e3]}),a._state!=="loaded"&&(a._state="loaded",a._emit("load"),a._loadQueue())},d=function(){if(e.usingWebAudio){try{typeof AudioContext<"u"?e.ctx=new AudioContext:typeof webkitAudioContext<"u"?e.ctx=new webkitAudioContext:e.usingWebAudio=!1}catch{e.usingWebAudio=!1}e.ctx||(e.usingWebAudio=!1);var a=/iP(hone|od|ad)/.test(e._navigator&&e._navigator.platform),c=e._navigator&&e._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/),h=c?parseInt(c[1],10):null;if(a&&h&&h<9){var f=/safari/.test(e._navigator&&e._navigator.userAgent.toLowerCase());e._navigator&&!f&&(e.usingWebAudio=!1)}e.usingWebAudio&&(e.masterGain=typeof e.ctx.createGain>"u"?e.ctx.createGainNode():e.ctx.createGain(),e.masterGain.gain.setValueAtTime(e._muted?0:e._volume,e.ctx.currentTime),e.masterGain.connect(e.ctx.destination)),e._setup()}};typeof define=="function"&&define.amd&&define([],function(){return{Howler:e,Howl:t}}),typeof bc<"u"&&(bc.Howler=e,bc.Howl=t),typeof global<"u"?(global.HowlerGlobal=s,global.Howler=e,global.Howl=t,global.Sound=n):typeof window<"u"&&(window.HowlerGlobal=s,window.Howler=e,window.Howl=t,window.Sound=n)})();(function(){"use strict";HowlerGlobal.prototype._pos=[0,0,0],HowlerGlobal.prototype._orientation=[0,0,-1,0,1,0],HowlerGlobal.prototype.stereo=function(e){var t=this;if(!t.ctx||!t.ctx.listener)return t;for(var n=t._howls.length-1;n>=0;n--)t._howls[n].stereo(e);return t},HowlerGlobal.prototype.pos=function(e,t,n){var i=this;if(!i.ctx||!i.ctx.listener)return i;if(t=typeof t!="number"?i._pos[1]:t,n=typeof n!="number"?i._pos[2]:n,typeof e=="number")i._pos=[e,t,n],typeof i.ctx.listener.positionX<"u"?(i.ctx.listener.positionX.setTargetAtTime(i._pos[0],Howler.ctx.currentTime,.1),i.ctx.listener.positionY.setTargetAtTime(i._pos[1],Howler.ctx.currentTime,.1),i.ctx.listener.positionZ.setTargetAtTime(i._pos[2],Howler.ctx.currentTime,.1)):i.ctx.listener.setPosition(i._pos[0],i._pos[1],i._pos[2]);else return i._pos;return i},HowlerGlobal.prototype.orientation=function(e,t,n,i,r,o){var l=this;if(!l.ctx||!l.ctx.listener)return l;var u=l._orientation;if(t=typeof t!="number"?u[1]:t,n=typeof n!="number"?u[2]:n,i=typeof i!="number"?u[3]:i,r=typeof r!="number"?u[4]:r,o=typeof o!="number"?u[5]:o,typeof e=="number")l._orientation=[e,t,n,i,r,o],typeof l.ctx.listener.forwardX<"u"?(l.ctx.listener.forwardX.setTargetAtTime(e,Howler.ctx.currentTime,.1),l.ctx.listener.forwardY.setTargetAtTime(t,Howler.ctx.currentTime,.1),l.ctx.listener.forwardZ.setTargetAtTime(n,Howler.ctx.currentTime,.1),l.ctx.listener.upX.setTargetAtTime(i,Howler.ctx.currentTime,.1),l.ctx.listener.upY.setTargetAtTime(r,Howler.ctx.currentTime,.1),l.ctx.listener.upZ.setTargetAtTime(o,Howler.ctx.currentTime,.1)):l.ctx.listener.setOrientation(e,t,n,i,r,o);else return u;return l},Howl.prototype.init=(function(e){return function(t){var n=this;return n._orientation=t.orientation||[1,0,0],n._stereo=t.stereo||null,n._pos=t.pos||null,n._pannerAttr={coneInnerAngle:typeof t.coneInnerAngle<"u"?t.coneInnerAngle:360,coneOuterAngle:typeof t.coneOuterAngle<"u"?t.coneOuterAngle:360,coneOuterGain:typeof t.coneOuterGain<"u"?t.coneOuterGain:0,distanceModel:typeof t.distanceModel<"u"?t.distanceModel:"inverse",maxDistance:typeof t.maxDistance<"u"?t.maxDistance:1e4,panningModel:typeof t.panningModel<"u"?t.panningModel:"HRTF",refDistance:typeof t.refDistance<"u"?t.refDistance:1,rolloffFactor:typeof t.rolloffFactor<"u"?t.rolloffFactor:1},n._onstereo=t.onstereo?[{fn:t.onstereo}]:[],n._onpos=t.onpos?[{fn:t.onpos}]:[],n._onorientation=t.onorientation?[{fn:t.onorientation}]:[],e.call(this,t)}})(Howl.prototype.init),Howl.prototype.stereo=function(e,t){var n=this;if(!n._webAudio)return n;if(n._state!=="loaded")return n._queue.push({event:"stereo",action:function(){n.stereo(e,t)}}),n;var i=typeof Howler.ctx.createStereoPanner>"u"?"spatial":"stereo";if(typeof t>"u")if(typeof e=="number")n._stereo=e,n._pos=[e,0,0];else return n._stereo;for(var r=n._getSoundIds(t),o=0;o<r.length;o++){var l=n._soundById(r[o]);if(l)if(typeof e=="number")l._stereo=e,l._pos=[e,0,0],l._node&&(l._pannerAttr.panningModel="equalpower",(!l._panner||!l._panner.pan)&&s(l,i),i==="spatial"?typeof l._panner.positionX<"u"?(l._panner.positionX.setValueAtTime(e,Howler.ctx.currentTime),l._panner.positionY.setValueAtTime(0,Howler.ctx.currentTime),l._panner.positionZ.setValueAtTime(0,Howler.ctx.currentTime)):l._panner.setPosition(e,0,0):l._panner.pan.setValueAtTime(e,Howler.ctx.currentTime)),n._emit("stereo",l._id);else return l._stereo}return n},Howl.prototype.pos=function(e,t,n,i){var r=this;if(!r._webAudio)return r;if(r._state!=="loaded")return r._queue.push({event:"pos",action:function(){r.pos(e,t,n,i)}}),r;if(t=typeof t!="number"?0:t,n=typeof n!="number"?-.5:n,typeof i>"u")if(typeof e=="number")r._pos=[e,t,n];else return r._pos;for(var o=r._getSoundIds(i),l=0;l<o.length;l++){var u=r._soundById(o[l]);if(u)if(typeof e=="number")u._pos=[e,t,n],u._node&&((!u._panner||u._panner.pan)&&s(u,"spatial"),typeof u._panner.positionX<"u"?(u._panner.positionX.setValueAtTime(e,Howler.ctx.currentTime),u._panner.positionY.setValueAtTime(t,Howler.ctx.currentTime),u._panner.positionZ.setValueAtTime(n,Howler.ctx.currentTime)):u._panner.setPosition(e,t,n)),r._emit("pos",u._id);else return u._pos}return r},Howl.prototype.orientation=function(e,t,n,i){var r=this;if(!r._webAudio)return r;if(r._state!=="loaded")return r._queue.push({event:"orientation",action:function(){r.orientation(e,t,n,i)}}),r;if(t=typeof t!="number"?r._orientation[1]:t,n=typeof n!="number"?r._orientation[2]:n,typeof i>"u")if(typeof e=="number")r._orientation=[e,t,n];else return r._orientation;for(var o=r._getSoundIds(i),l=0;l<o.length;l++){var u=r._soundById(o[l]);if(u)if(typeof e=="number")u._orientation=[e,t,n],u._node&&(u._panner||(u._pos||(u._pos=r._pos||[0,0,-.5]),s(u,"spatial")),typeof u._panner.orientationX<"u"?(u._panner.orientationX.setValueAtTime(e,Howler.ctx.currentTime),u._panner.orientationY.setValueAtTime(t,Howler.ctx.currentTime),u._panner.orientationZ.setValueAtTime(n,Howler.ctx.currentTime)):u._panner.setOrientation(e,t,n)),r._emit("orientation",u._id);else return u._orientation}return r},Howl.prototype.pannerAttr=function(){var e=this,t=arguments,n,i,r;if(!e._webAudio)return e;if(t.length===0)return e._pannerAttr;if(t.length===1)if(typeof t[0]=="object")n=t[0],typeof i>"u"&&(n.pannerAttr||(n.pannerAttr={coneInnerAngle:n.coneInnerAngle,coneOuterAngle:n.coneOuterAngle,coneOuterGain:n.coneOuterGain,distanceModel:n.distanceModel,maxDistance:n.maxDistance,refDistance:n.refDistance,rolloffFactor:n.rolloffFactor,panningModel:n.panningModel}),e._pannerAttr={coneInnerAngle:typeof n.pannerAttr.coneInnerAngle<"u"?n.pannerAttr.coneInnerAngle:e._coneInnerAngle,coneOuterAngle:typeof n.pannerAttr.coneOuterAngle<"u"?n.pannerAttr.coneOuterAngle:e._coneOuterAngle,coneOuterGain:typeof n.pannerAttr.coneOuterGain<"u"?n.pannerAttr.coneOuterGain:e._coneOuterGain,distanceModel:typeof n.pannerAttr.distanceModel<"u"?n.pannerAttr.distanceModel:e._distanceModel,maxDistance:typeof n.pannerAttr.maxDistance<"u"?n.pannerAttr.maxDistance:e._maxDistance,refDistance:typeof n.pannerAttr.refDistance<"u"?n.pannerAttr.refDistance:e._refDistance,rolloffFactor:typeof n.pannerAttr.rolloffFactor<"u"?n.pannerAttr.rolloffFactor:e._rolloffFactor,panningModel:typeof n.pannerAttr.panningModel<"u"?n.pannerAttr.panningModel:e._panningModel});else return r=e._soundById(parseInt(t[0],10)),r?r._pannerAttr:e._pannerAttr;else t.length===2&&(n=t[0],i=parseInt(t[1],10));for(var o=e._getSoundIds(i),l=0;l<o.length;l++)if(r=e._soundById(o[l]),r){var u=r._pannerAttr;u={coneInnerAngle:typeof n.coneInnerAngle<"u"?n.coneInnerAngle:u.coneInnerAngle,coneOuterAngle:typeof n.coneOuterAngle<"u"?n.coneOuterAngle:u.coneOuterAngle,coneOuterGain:typeof n.coneOuterGain<"u"?n.coneOuterGain:u.coneOuterGain,distanceModel:typeof n.distanceModel<"u"?n.distanceModel:u.distanceModel,maxDistance:typeof n.maxDistance<"u"?n.maxDistance:u.maxDistance,refDistance:typeof n.refDistance<"u"?n.refDistance:u.refDistance,rolloffFactor:typeof n.rolloffFactor<"u"?n.rolloffFactor:u.rolloffFactor,panningModel:typeof n.panningModel<"u"?n.panningModel:u.panningModel};var d=r._panner;d||(r._pos||(r._pos=e._pos||[0,0,-.5]),s(r,"spatial"),d=r._panner),d.coneInnerAngle=u.coneInnerAngle,d.coneOuterAngle=u.coneOuterAngle,d.coneOuterGain=u.coneOuterGain,d.distanceModel=u.distanceModel,d.maxDistance=u.maxDistance,d.refDistance=u.refDistance,d.rolloffFactor=u.rolloffFactor,d.panningModel=u.panningModel}return e},Sound.prototype.init=(function(e){return function(){var t=this,n=t._parent;t._orientation=n._orientation,t._stereo=n._stereo,t._pos=n._pos,t._pannerAttr=n._pannerAttr,e.call(this),t._stereo?n.stereo(t._stereo):t._pos&&n.pos(t._pos[0],t._pos[1],t._pos[2],t._id)}})(Sound.prototype.init),Sound.prototype.reset=(function(e){return function(){var t=this,n=t._parent;return t._orientation=n._orientation,t._stereo=n._stereo,t._pos=n._pos,t._pannerAttr=n._pannerAttr,t._stereo?n.stereo(t._stereo):t._pos?n.pos(t._pos[0],t._pos[1],t._pos[2],t._id):t._panner&&(t._panner.disconnect(0),t._panner=void 0,n._refreshBuffer(t)),e.call(this)}})(Sound.prototype.reset);var s=function(e,t){t=t||"spatial",t==="spatial"?(e._panner=Howler.ctx.createPanner(),e._panner.coneInnerAngle=e._pannerAttr.coneInnerAngle,e._panner.coneOuterAngle=e._pannerAttr.coneOuterAngle,e._panner.coneOuterGain=e._pannerAttr.coneOuterGain,e._panner.distanceModel=e._pannerAttr.distanceModel,e._panner.maxDistance=e._pannerAttr.maxDistance,e._panner.refDistance=e._pannerAttr.refDistance,e._panner.rolloffFactor=e._pannerAttr.rolloffFactor,e._panner.panningModel=e._pannerAttr.panningModel,typeof e._panner.positionX<"u"?(e._panner.positionX.setValueAtTime(e._pos[0],Howler.ctx.currentTime),e._panner.positionY.setValueAtTime(e._pos[1],Howler.ctx.currentTime),e._panner.positionZ.setValueAtTime(e._pos[2],Howler.ctx.currentTime)):e._panner.setPosition(e._pos[0],e._pos[1],e._pos[2]),typeof e._panner.orientationX<"u"?(e._panner.orientationX.setValueAtTime(e._orientation[0],Howler.ctx.currentTime),e._panner.orientationY.setValueAtTime(e._orientation[1],Howler.ctx.currentTime),e._panner.orientationZ.setValueAtTime(e._orientation[2],Howler.ctx.currentTime)):e._panner.setOrientation(e._orientation[0],e._orientation[1],e._orientation[2])):(e._panner=Howler.ctx.createStereoPanner(),e._panner.pan.setValueAtTime(e._stereo,Howler.ctx.currentTime)),e._panner.connect(e._node),e._paused||e._parent.pause(e._id,!0).play(e._id,!0)}})()});var Dn={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},$i={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Gh=0,vu=1,Wh=2;var yu=1,Fs=2,ii=3,Mn=0,jt=1,Vt=2,Ti=0,mr=1,Tr=2,xu=3,bu=4,Xh=5,Yi=100,Yh=101,qh=102,jh=103,Zh=104,$h=200,Kh=201,Jh=202,Qh=203,Ya=204,qa=205,ef=206,tf=207,nf=208,rf=209,sf=210,of=211,af=212,lf=213,cf=214,hl=0,fl=1,pl=2,gr=3,ml=4,gl=5,_l=6,vl=7,Mu=0,uf=1,df=2,Ai=0,hf=1,ff=2,pf=3,Ki=4,mf=5,gf=6,_f=7,lu="attached",vf="detached",cu=300,Ar=301,Rr=302,Ji=303,yl=304,Zo=306,qi=1e3,bn=1001,Ss=1002,Xt=1003,xl=1004;var Pr=1005;var Dt=1006,Us=1007;var jn=1008;var an=1009,Su=1010,Eu=1011,Bs=1012,bl=1013,Qi=1014,On=1015,Hs=1016,Ml=1017,Sl=1018,zs=1020,Cu=35902,wu=1021,Tu=1022,Zt=1023,Es=1026,Vs=1027,El=1028,Cl=1029,Au=1030,wl=1031;var Tl=1033,$o=33776,Ko=33777,Jo=33778,Qo=33779,Al=35840,Rl=35841,Pl=35842,Il=35843,Dl=36196,Ol=37492,Ll=37496,Nl=37808,kl=37809,Fl=37810,Ul=37811,Bl=37812,Hl=37813,zl=37814,Vl=37815,Gl=37816,Wl=37817,Xl=37818,Yl=37819,ql=37820,jl=37821,ea=36492,Zl=36494,$l=36495,Ru=36283,Kl=36284,Jl=36285,Ql=36286,er=2200,yf=2201,xf=2202,_r=2300,vr=2301,Xa=2302,fr=2400,pr=2401,bo=2402,ec=2500,bf=2501,Pu=0,ta=1,Gs=2,Mf=3200,Sf=3201;var Iu=0,Ef=1,Ri="",Je="srgb",Lt="srgb-linear",Mo="linear",ct="srgb";var hr=7680;var uu=519,Cf=512,wf=513,Tf=514,Du=515,Af=516,Rf=517,Pf=518,If=519,ja=35044;var Ou="300 es",Gn=2e3,So=2001;var Yn=class{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){let n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){let n=this._listeners;if(n===void 0)return;let i=n[e];if(i!==void 0){let r=i.indexOf(t);r!==-1&&i.splice(r,1)}}dispatchEvent(e){let t=this._listeners;if(t===void 0)return;let n=t[e.type];if(n!==void 0){e.target=this;let i=n.slice(0);for(let r=0,o=i.length;r<o;r++)i[r].call(this,e);e.target=null}}},Qt=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],ih=1234567,yo=Math.PI/180,yr=180/Math.PI;function Xn(){let s=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Qt[s&255]+Qt[s>>8&255]+Qt[s>>16&255]+Qt[s>>24&255]+"-"+Qt[e&255]+Qt[e>>8&255]+"-"+Qt[e>>16&15|64]+Qt[e>>24&255]+"-"+Qt[t&63|128]+Qt[t>>8&255]+"-"+Qt[t>>16&255]+Qt[t>>24&255]+Qt[n&255]+Qt[n>>8&255]+Qt[n>>16&255]+Qt[n>>24&255]).toLowerCase()}function qe(s,e,t){return Math.max(e,Math.min(t,s))}function Lu(s,e){return(s%e+e)%e}function jp(s,e,t,n,i){return n+(s-e)*(i-n)/(t-e)}function Zp(s,e,t){return s!==e?(t-s)/(e-s):0}function xo(s,e,t){return(1-t)*s+t*e}function $p(s,e,t,n){return xo(s,e,1-Math.exp(-t*n))}function Kp(s,e=1){return e-Math.abs(Lu(s,e*2)-e)}function Jp(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*(3-2*s))}function Qp(s,e,t){return s<=e?0:s>=t?1:(s=(s-e)/(t-e),s*s*s*(s*(s*6-15)+10))}function em(s,e){return s+Math.floor(Math.random()*(e-s+1))}function tm(s,e){return s+Math.random()*(e-s)}function nm(s){return s*(.5-Math.random())}function im(s){s!==void 0&&(ih=s);let e=ih+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function rm(s){return s*yo}function sm(s){return s*yr}function om(s){return(s&s-1)===0&&s!==0}function am(s){return Math.pow(2,Math.ceil(Math.log(s)/Math.LN2))}function lm(s){return Math.pow(2,Math.floor(Math.log(s)/Math.LN2))}function cm(s,e,t,n,i){let r=Math.cos,o=Math.sin,l=r(t/2),u=o(t/2),d=r((e+n)/2),a=o((e+n)/2),c=r((e-n)/2),h=o((e-n)/2),f=r((n-e)/2),g=o((n-e)/2);switch(i){case"XYX":s.set(l*a,u*c,u*h,l*d);break;case"YZY":s.set(u*h,l*a,u*c,l*d);break;case"ZXZ":s.set(u*c,u*h,l*a,l*d);break;case"XZX":s.set(l*a,u*g,u*f,l*d);break;case"YXY":s.set(u*f,l*a,u*g,l*d);break;case"ZYZ":s.set(u*g,u*f,l*a,l*d);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+i)}}function Vn(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return s/4294967295;case Uint16Array:return s/65535;case Uint8Array:return s/255;case Int32Array:return Math.max(s/2147483647,-1);case Int16Array:return Math.max(s/32767,-1);case Int8Array:return Math.max(s/127,-1);default:throw new Error("Invalid component type.")}}function lt(s,e){switch(e.constructor){case Float32Array:return s;case Uint32Array:return Math.round(s*4294967295);case Uint16Array:return Math.round(s*65535);case Uint8Array:return Math.round(s*255);case Int32Array:return Math.round(s*2147483647);case Int16Array:return Math.round(s*32767);case Int8Array:return Math.round(s*127);default:throw new Error("Invalid component type.")}}var na={DEG2RAD:yo,RAD2DEG:yr,generateUUID:Xn,clamp:qe,euclideanModulo:Lu,mapLinear:jp,inverseLerp:Zp,lerp:xo,damp:$p,pingpong:Kp,smoothstep:Jp,smootherstep:Qp,randInt:em,randFloat:tm,randFloatSpread:nm,seededRandom:im,degToRad:rm,radToDeg:sm,isPowerOfTwo:om,ceilPowerOfTwo:am,floorPowerOfTwo:lm,setQuaternionFromProperEuler:cm,normalize:lt,denormalize:Vn},Se=class s{constructor(e=0,t=0){s.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){let t=this.x,n=this.y,i=e.elements;return this.x=i[0]*t+i[3]*n+i[6],this.y=i[1]*t+i[4]*n+i[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){let n=Math.cos(t),i=Math.sin(t),r=this.x-e.x,o=this.y-e.y;return this.x=r*n-o*i+e.x,this.y=r*i+o*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},ft=class{constructor(e=0,t=0,n=0,i=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=i}static slerpFlat(e,t,n,i,r,o,l){let u=n[i+0],d=n[i+1],a=n[i+2],c=n[i+3],h=r[o+0],f=r[o+1],g=r[o+2],_=r[o+3];if(l===0){e[t+0]=u,e[t+1]=d,e[t+2]=a,e[t+3]=c;return}if(l===1){e[t+0]=h,e[t+1]=f,e[t+2]=g,e[t+3]=_;return}if(c!==_||u!==h||d!==f||a!==g){let m=1-l,p=u*h+d*f+a*g+c*_,b=p>=0?1:-1,M=1-p*p;if(M>Number.EPSILON){let T=Math.sqrt(M),P=Math.atan2(T,p*b);m=Math.sin(m*P)/T,l=Math.sin(l*P)/T}let y=l*b;if(u=u*m+h*y,d=d*m+f*y,a=a*m+g*y,c=c*m+_*y,m===1-l){let T=1/Math.sqrt(u*u+d*d+a*a+c*c);u*=T,d*=T,a*=T,c*=T}}e[t]=u,e[t+1]=d,e[t+2]=a,e[t+3]=c}static multiplyQuaternionsFlat(e,t,n,i,r,o){let l=n[i],u=n[i+1],d=n[i+2],a=n[i+3],c=r[o],h=r[o+1],f=r[o+2],g=r[o+3];return e[t]=l*g+a*c+u*f-d*h,e[t+1]=u*g+a*h+d*c-l*f,e[t+2]=d*g+a*f+l*h-u*c,e[t+3]=a*g-l*c-u*h-d*f,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,i){return this._x=e,this._y=t,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){let n=e._x,i=e._y,r=e._z,o=e._order,l=Math.cos,u=Math.sin,d=l(n/2),a=l(i/2),c=l(r/2),h=u(n/2),f=u(i/2),g=u(r/2);switch(o){case"XYZ":this._x=h*a*c+d*f*g,this._y=d*f*c-h*a*g,this._z=d*a*g+h*f*c,this._w=d*a*c-h*f*g;break;case"YXZ":this._x=h*a*c+d*f*g,this._y=d*f*c-h*a*g,this._z=d*a*g-h*f*c,this._w=d*a*c+h*f*g;break;case"ZXY":this._x=h*a*c-d*f*g,this._y=d*f*c+h*a*g,this._z=d*a*g+h*f*c,this._w=d*a*c-h*f*g;break;case"ZYX":this._x=h*a*c-d*f*g,this._y=d*f*c+h*a*g,this._z=d*a*g-h*f*c,this._w=d*a*c+h*f*g;break;case"YZX":this._x=h*a*c+d*f*g,this._y=d*f*c+h*a*g,this._z=d*a*g-h*f*c,this._w=d*a*c-h*f*g;break;case"XZY":this._x=h*a*c-d*f*g,this._y=d*f*c-h*a*g,this._z=d*a*g+h*f*c,this._w=d*a*c+h*f*g;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+o)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){let n=t/2,i=Math.sin(n);return this._x=e.x*i,this._y=e.y*i,this._z=e.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){let t=e.elements,n=t[0],i=t[4],r=t[8],o=t[1],l=t[5],u=t[9],d=t[2],a=t[6],c=t[10],h=n+l+c;if(h>0){let f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(a-u)*f,this._y=(r-d)*f,this._z=(o-i)*f}else if(n>l&&n>c){let f=2*Math.sqrt(1+n-l-c);this._w=(a-u)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(r+d)/f}else if(l>c){let f=2*Math.sqrt(1+l-n-c);this._w=(r-d)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(u+a)/f}else{let f=2*Math.sqrt(1+c-n-l);this._w=(o-i)/f,this._x=(r+d)/f,this._y=(u+a)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(qe(this.dot(e),-1,1)))}rotateTowards(e,t){let n=this.angleTo(e);if(n===0)return this;let i=Math.min(1,t/n);return this.slerp(e,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){let n=e._x,i=e._y,r=e._z,o=e._w,l=t._x,u=t._y,d=t._z,a=t._w;return this._x=n*a+o*l+i*d-r*u,this._y=i*a+o*u+r*l-n*d,this._z=r*a+o*d+n*u-i*l,this._w=o*a-n*l-i*u-r*d,this._onChangeCallback(),this}slerp(e,t){if(t===0)return this;if(t===1)return this.copy(e);let n=this._x,i=this._y,r=this._z,o=this._w,l=o*e._w+n*e._x+i*e._y+r*e._z;if(l<0?(this._w=-e._w,this._x=-e._x,this._y=-e._y,this._z=-e._z,l=-l):this.copy(e),l>=1)return this._w=o,this._x=n,this._y=i,this._z=r,this;let u=1-l*l;if(u<=Number.EPSILON){let f=1-t;return this._w=f*o+t*this._w,this._x=f*n+t*this._x,this._y=f*i+t*this._y,this._z=f*r+t*this._z,this.normalize(),this}let d=Math.sqrt(u),a=Math.atan2(d,l),c=Math.sin((1-t)*a)/d,h=Math.sin(t*a)/d;return this._w=o*c+this._w*h,this._x=n*c+this._x*h,this._y=i*c+this._y*h,this._z=r*c+this._z*h,this._onChangeCallback(),this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){let e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(i*Math.sin(e),i*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},w=class s{constructor(e=0,t=0,n=0){s.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(rh.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(rh.setFromAxisAngle(e,t))}applyMatrix3(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*i,this.y=r[1]*t+r[4]*n+r[7]*i,this.z=r[2]*t+r[5]*n+r[8]*i,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=e.elements,o=1/(r[3]*t+r[7]*n+r[11]*i+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*i+r[12])*o,this.y=(r[1]*t+r[5]*n+r[9]*i+r[13])*o,this.z=(r[2]*t+r[6]*n+r[10]*i+r[14])*o,this}applyQuaternion(e){let t=this.x,n=this.y,i=this.z,r=e.x,o=e.y,l=e.z,u=e.w,d=2*(o*i-l*n),a=2*(l*t-r*i),c=2*(r*n-o*t);return this.x=t+u*d+o*c-l*a,this.y=n+u*a+l*d-r*c,this.z=i+u*c+r*a-o*d,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){let t=this.x,n=this.y,i=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*i,this.y=r[1]*t+r[5]*n+r[9]*i,this.z=r[2]*t+r[6]*n+r[10]*i,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){let n=e.x,i=e.y,r=e.z,o=t.x,l=t.y,u=t.z;return this.x=i*u-r*l,this.y=r*o-n*u,this.z=n*l-i*o,this}projectOnVector(e){let t=e.lengthSq();if(t===0)return this.set(0,0,0);let n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return Nc.copy(this).projectOnVector(e),this.sub(Nc)}reflect(e){return this.sub(Nc.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){let t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;let n=this.dot(e)/t;return Math.acos(qe(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){let t=this.x-e.x,n=this.y-e.y,i=this.z-e.z;return t*t+n*n+i*i}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){let i=Math.sin(t)*e;return this.x=i*Math.sin(n),this.y=Math.cos(t)*e,this.z=i*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){let t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),i=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=i,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Nc=new w,rh=new ft,Ge=class s{constructor(e,t,n,i,r,o,l,u,d){s.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,l,u,d)}set(e,t,n,i,r,o,l,u,d){let a=this.elements;return a[0]=e,a[1]=i,a[2]=l,a[3]=t,a[4]=r,a[5]=u,a[6]=n,a[7]=o,a[8]=d,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){let t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],l=n[3],u=n[6],d=n[1],a=n[4],c=n[7],h=n[2],f=n[5],g=n[8],_=i[0],m=i[3],p=i[6],b=i[1],M=i[4],y=i[7],T=i[2],P=i[5],A=i[8];return r[0]=o*_+l*b+u*T,r[3]=o*m+l*M+u*P,r[6]=o*p+l*y+u*A,r[1]=d*_+a*b+c*T,r[4]=d*m+a*M+c*P,r[7]=d*p+a*y+c*A,r[2]=h*_+f*b+g*T,r[5]=h*m+f*M+g*P,r[8]=h*p+f*y+g*A,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],l=e[5],u=e[6],d=e[7],a=e[8];return t*o*a-t*l*d-n*r*a+n*l*u+i*r*d-i*o*u}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],l=e[5],u=e[6],d=e[7],a=e[8],c=a*o-l*d,h=l*u-a*r,f=d*r-o*u,g=t*c+n*h+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/g;return e[0]=c*_,e[1]=(i*d-a*n)*_,e[2]=(l*n-i*o)*_,e[3]=h*_,e[4]=(a*t-i*u)*_,e[5]=(i*r-l*t)*_,e[6]=f*_,e[7]=(n*u-d*t)*_,e[8]=(o*t-n*r)*_,this}transpose(){let e,t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){let t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,i,r,o,l){let u=Math.cos(r),d=Math.sin(r);return this.set(n*u,n*d,-n*(u*o+d*l)+o+e,-i*d,i*u,-i*(-d*o+u*l)+l+t,0,0,1),this}scale(e,t){return this.premultiply(kc.makeScale(e,t)),this}rotate(e){return this.premultiply(kc.makeRotation(-e)),this}translate(e,t){return this.premultiply(kc.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<9;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}},kc=new Ge;function Nu(s){for(let e=s.length-1;e>=0;--e)if(s[e]>=65535)return!0;return!1}function Cs(s){return document.createElementNS("http://www.w3.org/1999/xhtml",s)}function Df(){let s=Cs("canvas");return s.style.display="block",s}var sh={};function xr(s){s in sh||(sh[s]=!0,console.warn(s))}function Of(s,e,t){return new Promise(function(n,i){function r(){switch(s.clientWaitSync(e,s.SYNC_FLUSH_COMMANDS_BIT,0)){case s.WAIT_FAILED:i();break;case s.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}var oh=new Ge().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),ah=new Ge().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function um(){let s={enabled:!0,workingColorSpace:Lt,spaces:{},convert:function(i,r,o){return this.enabled===!1||r===o||!r||!o||(this.spaces[r].transfer===ct&&(i.r=vi(i.r),i.g=vi(i.g),i.b=vi(i.b)),this.spaces[r].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[r].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ct&&(i.r=Ms(i.r),i.g=Ms(i.g),i.b=Ms(i.b))),i},workingToColorSpace:function(i,r){return this.convert(i,this.workingColorSpace,r)},colorSpaceToWorking:function(i,r){return this.convert(i,r,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===Ri?Mo:this.spaces[i].transfer},getLuminanceCoefficients:function(i,r=this.workingColorSpace){return i.fromArray(this.spaces[r].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,r,o){return i.copy(this.spaces[r].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,r){return xr("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),s.workingToColorSpace(i,r)},toWorkingColorSpace:function(i,r){return xr("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),s.colorSpaceToWorking(i,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return s.define({[Lt]:{primaries:e,whitePoint:n,transfer:Mo,toXYZ:oh,fromXYZ:ah,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:Je},outputColorSpaceConfig:{drawingBufferColorSpace:Je}},[Je]:{primaries:e,whitePoint:n,transfer:ct,toXYZ:oh,fromXYZ:ah,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:Je}}}),s}var je=um();function vi(s){return s<.04045?s*.0773993808:Math.pow(s*.9478672986+.0521327014,2.4)}function Ms(s){return s<.0031308?s*12.92:1.055*Math.pow(s,.41666)-.055}var ls,Za=class{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{ls===void 0&&(ls=Cs("canvas")),ls.width=e.width,ls.height=e.height;let i=ls.getContext("2d");e instanceof ImageData?i.putImageData(e,0,0):i.drawImage(e,0,0,e.width,e.height),n=ls}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){let t=Cs("canvas");t.width=e.width,t.height=e.height;let n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);let i=n.getImageData(0,0,e.width,e.height),r=i.data;for(let o=0;o<r.length;o++)r[o]=vi(r[o]/255)*255;return n.putImageData(i,0,0),t}else if(e.data){let t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(vi(t[n]/255)*255):t[n]=vi(t[n]);return{data:t,width:e.width,height:e.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}},dm=0,ws=class{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:dm++}),this.uuid=Xn(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){let t=this.data;return t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){let t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];let n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let r;if(Array.isArray(i)){r=[];for(let o=0,l=i.length;o<l;o++)i[o].isDataTexture?r.push(Fc(i[o].image)):r.push(Fc(i[o]))}else r=Fc(i);n.url=r}return t||(e.images[this.uuid]=n),n}};function Fc(s){return typeof HTMLImageElement<"u"&&s instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&s instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&s instanceof ImageBitmap?Za.getDataURL(s):s.data?{data:Array.from(s.data),width:s.width,height:s.height,type:s.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var hm=0,Uc=new w,pn=(()=>{class s extends Yn{constructor(t=s.DEFAULT_IMAGE,n=s.DEFAULT_MAPPING,i=bn,r=bn,o=Dt,l=jn,u=Zt,d=an,a=s.DEFAULT_ANISOTROPY,c=Ri){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:hm++}),this.uuid=Xn(),this.name="",this.source=new ws(t),this.mipmaps=[],this.mapping=n,this.channel=0,this.wrapS=i,this.wrapT=r,this.magFilter=o,this.minFilter=l,this.anisotropy=a,this.format=u,this.internalFormat=null,this.type=d,this.offset=new Se(0,0),this.repeat=new Se(1,1),this.center=new Se(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Ge,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=c,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(Uc).x}get height(){return this.source.getSize(Uc).y}get depth(){return this.source.getSize(Uc).z}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,n){this.updateRanges.push({start:t,count:n})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(let n in t){let i=t[n];if(i===void 0){console.warn(`THREE.Texture.setValues(): parameter '${n}' has value of undefined.`);continue}let r=this[n];if(r===void 0){console.warn(`THREE.Texture.setValues(): property '${n}' does not exist.`);continue}r&&i&&r.isVector2&&i.isVector2||r&&i&&r.isVector3&&i.isVector3||r&&i&&r.isMatrix3&&i.isMatrix3?r.copy(i):this[n]=i}}toJSON(t){let n=t===void 0||typeof t=="string";if(!n&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let i={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(i.userData=this.userData),n||(t.textures[this.uuid]=i),i}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==cu)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case qi:t.x=t.x-Math.floor(t.x);break;case bn:t.x=t.x<0?0:1;break;case Ss:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case qi:t.y=t.y-Math.floor(t.y);break;case bn:t.y=t.y<0?0:1;break;case Ss:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}return s.DEFAULT_IMAGE=null,s.DEFAULT_MAPPING=cu,s.DEFAULT_ANISOTROPY=1,s})(),it=class s{constructor(e=0,t=0,n=0,i=1){s.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=i}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,i){return this.x=e,this.y=t,this.z=n,this.w=i,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){let t=this.x,n=this.y,i=this.z,r=this.w,o=e.elements;return this.x=o[0]*t+o[4]*n+o[8]*i+o[12]*r,this.y=o[1]*t+o[5]*n+o[9]*i+o[13]*r,this.z=o[2]*t+o[6]*n+o[10]*i+o[14]*r,this.w=o[3]*t+o[7]*n+o[11]*i+o[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);let t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,i,r,u=e.elements,d=u[0],a=u[4],c=u[8],h=u[1],f=u[5],g=u[9],_=u[2],m=u[6],p=u[10];if(Math.abs(a-h)<.01&&Math.abs(c-_)<.01&&Math.abs(g-m)<.01){if(Math.abs(a+h)<.1&&Math.abs(c+_)<.1&&Math.abs(g+m)<.1&&Math.abs(d+f+p-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;let M=(d+1)/2,y=(f+1)/2,T=(p+1)/2,P=(a+h)/4,A=(c+_)/4,D=(g+m)/4;return M>y&&M>T?M<.01?(n=0,i=.707106781,r=.707106781):(n=Math.sqrt(M),i=P/n,r=A/n):y>T?y<.01?(n=.707106781,i=0,r=.707106781):(i=Math.sqrt(y),n=P/i,r=D/i):T<.01?(n=.707106781,i=.707106781,r=0):(r=Math.sqrt(T),n=A/r,i=D/r),this.set(n,i,r,t),this}let b=Math.sqrt((m-g)*(m-g)+(c-_)*(c-_)+(h-a)*(h-a));return Math.abs(b)<.001&&(b=1),this.x=(m-g)/b,this.y=(c-_)/b,this.z=(h-a)/b,this.w=Math.acos((d+f+p-1)/2),this}setFromMatrixPosition(e){let t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=qe(this.x,e.x,t.x),this.y=qe(this.y,e.y,t.y),this.z=qe(this.z,e.z,t.z),this.w=qe(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=qe(this.x,e,t),this.y=qe(this.y,e,t),this.z=qe(this.z,e,t),this.w=qe(this.w,e,t),this}clampLength(e,t){let n=this.length();return this.divideScalar(n||1).multiplyScalar(qe(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},$a=class extends Yn{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Dt,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new it(0,0,e,t),this.scissorTest=!1,this.viewport=new it(0,0,e,t);let i={width:e,height:t,depth:n.depth},r=new pn(i);this.textures=[];let o=n.count;for(let l=0;l<o;l++)this.textures[l]=r.clone(),this.textures[l].isRenderTargetTexture=!0,this.textures[l].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){let t={minFilter:Dt,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let i=0,r=this.textures.length;i<r;i++)this.textures[i].image.width=e,this.textures[i].image.height=t,this.textures[i].image.depth=n,this.textures[i].isArrayTexture=this.textures[i].image.depth>1;this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;let i=Object.assign({},e.textures[t].image);this.textures[t].source=new ws(i)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},un=class extends $a{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}},Eo=class extends pn{constructor(e=null,t=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}};var Ka=class extends pn{constructor(e=null,t=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:i},this.magFilter=Xt,this.minFilter=Xt,this.wrapR=bn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Sn=class{constructor(e=new w(1/0,1/0,1/0),t=new w(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(Bn.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(Bn.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){let n=Bn.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);let n=e.geometry;if(n!==void 0){let r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let o=0,l=r.count;o<l;o++)e.isMesh===!0?e.getVertexPosition(o,Bn):Bn.fromBufferAttribute(r,o),Bn.applyMatrix4(e.matrixWorld),this.expandByPoint(Bn);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),xa.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),xa.copy(n.boundingBox)),xa.applyMatrix4(e.matrixWorld),this.union(xa)}let i=e.children;for(let r=0,o=i.length;r<o;r++)this.expandByObject(i[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,Bn),Bn.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(uo),ba.subVectors(this.max,uo),cs.subVectors(e.a,uo),us.subVectors(e.b,uo),ds.subVectors(e.c,uo),Bi.subVectors(us,cs),Hi.subVectors(ds,us),lr.subVectors(cs,ds);let t=[0,-Bi.z,Bi.y,0,-Hi.z,Hi.y,0,-lr.z,lr.y,Bi.z,0,-Bi.x,Hi.z,0,-Hi.x,lr.z,0,-lr.x,-Bi.y,Bi.x,0,-Hi.y,Hi.x,0,-lr.y,lr.x,0];return!Bc(t,cs,us,ds,ba)||(t=[1,0,0,0,1,0,0,0,1],!Bc(t,cs,us,ds,ba))?!1:(Ma.crossVectors(Bi,Hi),t=[Ma.x,Ma.y,Ma.z],Bc(t,cs,us,ds,ba))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,Bn).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(Bn).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(hi[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),hi[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),hi[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),hi[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),hi[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),hi[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),hi[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),hi[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(hi),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}},hi=[new w,new w,new w,new w,new w,new w,new w,new w],Bn=new w,xa=new Sn,cs=new w,us=new w,ds=new w,Bi=new w,Hi=new w,lr=new w,uo=new w,ba=new w,Ma=new w,cr=new w;function Bc(s,e,t,n,i){for(let r=0,o=s.length-3;r<=o;r+=3){cr.fromArray(s,r);let l=i.x*Math.abs(cr.x)+i.y*Math.abs(cr.y)+i.z*Math.abs(cr.z),u=e.dot(cr),d=t.dot(cr),a=n.dot(cr);if(Math.max(-Math.max(u,d,a),Math.min(u,d,a))>l)return!1}return!0}var fm=new Sn,ho=new w,Hc=new w,dn=class{constructor(e=new w,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){let n=this.center;t!==void 0?n.copy(t):fm.setFromPoints(e).getCenter(n);let i=0;for(let r=0,o=e.length;r<o;r++)i=Math.max(i,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(i),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){let t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){let n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ho.subVectors(e,this.center);let t=ho.lengthSq();if(t>this.radius*this.radius){let n=Math.sqrt(t),i=(n-this.radius)*.5;this.center.addScaledVector(ho,i/n),this.radius+=i}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Hc.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ho.copy(e.center).add(Hc)),this.expandByPoint(ho.copy(e.center).sub(Hc))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}},fi=new w,zc=new w,Sa=new w,zi=new w,Vc=new w,Ea=new w,Gc=new w,Qn=class{constructor(e=new w,t=new w(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,fi)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);let n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){let t=fi.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(fi.copy(this.origin).addScaledVector(this.direction,t),fi.distanceToSquared(e))}distanceSqToSegment(e,t,n,i){zc.copy(e).add(t).multiplyScalar(.5),Sa.copy(t).sub(e).normalize(),zi.copy(this.origin).sub(zc);let r=e.distanceTo(t)*.5,o=-this.direction.dot(Sa),l=zi.dot(this.direction),u=-zi.dot(Sa),d=zi.lengthSq(),a=Math.abs(1-o*o),c,h,f,g;if(a>0)if(c=o*u-l,h=o*l-u,g=r*a,c>=0)if(h>=-g)if(h<=g){let _=1/a;c*=_,h*=_,f=c*(c+o*h+2*l)+h*(o*c+h+2*u)+d}else h=r,c=Math.max(0,-(o*h+l)),f=-c*c+h*(h+2*u)+d;else h=-r,c=Math.max(0,-(o*h+l)),f=-c*c+h*(h+2*u)+d;else h<=-g?(c=Math.max(0,-(-o*r+l)),h=c>0?-r:Math.min(Math.max(-r,-u),r),f=-c*c+h*(h+2*u)+d):h<=g?(c=0,h=Math.min(Math.max(-r,-u),r),f=h*(h+2*u)+d):(c=Math.max(0,-(o*r+l)),h=c>0?r:Math.min(Math.max(-r,-u),r),f=-c*c+h*(h+2*u)+d);else h=o>0?-r:r,c=Math.max(0,-(o*h+l)),f=-c*c+h*(h+2*u)+d;return n&&n.copy(this.origin).addScaledVector(this.direction,c),i&&i.copy(zc).addScaledVector(Sa,h),f}intersectSphere(e,t){fi.subVectors(e.center,this.origin);let n=fi.dot(this.direction),i=fi.dot(fi)-n*n,r=e.radius*e.radius;if(i>r)return null;let o=Math.sqrt(r-i),l=n-o,u=n+o;return u<0?null:l<0?this.at(u,t):this.at(l,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){let t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){let n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){let t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,i,r,o,l,u,d=1/this.direction.x,a=1/this.direction.y,c=1/this.direction.z,h=this.origin;return d>=0?(n=(e.min.x-h.x)*d,i=(e.max.x-h.x)*d):(n=(e.max.x-h.x)*d,i=(e.min.x-h.x)*d),a>=0?(r=(e.min.y-h.y)*a,o=(e.max.y-h.y)*a):(r=(e.max.y-h.y)*a,o=(e.min.y-h.y)*a),n>o||r>i||((r>n||isNaN(n))&&(n=r),(o<i||isNaN(i))&&(i=o),c>=0?(l=(e.min.z-h.z)*c,u=(e.max.z-h.z)*c):(l=(e.max.z-h.z)*c,u=(e.min.z-h.z)*c),n>u||l>i)||((l>n||n!==n)&&(n=l),(u<i||i!==i)&&(i=u),i<0)?null:this.at(n>=0?n:i,t)}intersectsBox(e){return this.intersectBox(e,fi)!==null}intersectTriangle(e,t,n,i,r){Vc.subVectors(t,e),Ea.subVectors(n,e),Gc.crossVectors(Vc,Ea);let o=this.direction.dot(Gc),l;if(o>0){if(i)return null;l=1}else if(o<0)l=-1,o=-o;else return null;zi.subVectors(this.origin,e);let u=l*this.direction.dot(Ea.crossVectors(zi,Ea));if(u<0)return null;let d=l*this.direction.dot(Vc.cross(zi));if(d<0||u+d>o)return null;let a=-l*zi.dot(Gc);return a<0?null:this.at(a/o,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},ke=class s{constructor(e,t,n,i,r,o,l,u,d,a,c,h,f,g,_,m){s.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,i,r,o,l,u,d,a,c,h,f,g,_,m)}set(e,t,n,i,r,o,l,u,d,a,c,h,f,g,_,m){let p=this.elements;return p[0]=e,p[4]=t,p[8]=n,p[12]=i,p[1]=r,p[5]=o,p[9]=l,p[13]=u,p[2]=d,p[6]=a,p[10]=c,p[14]=h,p[3]=f,p[7]=g,p[11]=_,p[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new s().fromArray(this.elements)}copy(e){let t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){let t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){let t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){let t=this.elements,n=e.elements,i=1/hs.setFromMatrixColumn(e,0).length(),r=1/hs.setFromMatrixColumn(e,1).length(),o=1/hs.setFromMatrixColumn(e,2).length();return t[0]=n[0]*i,t[1]=n[1]*i,t[2]=n[2]*i,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*o,t[9]=n[9]*o,t[10]=n[10]*o,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){let t=this.elements,n=e.x,i=e.y,r=e.z,o=Math.cos(n),l=Math.sin(n),u=Math.cos(i),d=Math.sin(i),a=Math.cos(r),c=Math.sin(r);if(e.order==="XYZ"){let h=o*a,f=o*c,g=l*a,_=l*c;t[0]=u*a,t[4]=-u*c,t[8]=d,t[1]=f+g*d,t[5]=h-_*d,t[9]=-l*u,t[2]=_-h*d,t[6]=g+f*d,t[10]=o*u}else if(e.order==="YXZ"){let h=u*a,f=u*c,g=d*a,_=d*c;t[0]=h+_*l,t[4]=g*l-f,t[8]=o*d,t[1]=o*c,t[5]=o*a,t[9]=-l,t[2]=f*l-g,t[6]=_+h*l,t[10]=o*u}else if(e.order==="ZXY"){let h=u*a,f=u*c,g=d*a,_=d*c;t[0]=h-_*l,t[4]=-o*c,t[8]=g+f*l,t[1]=f+g*l,t[5]=o*a,t[9]=_-h*l,t[2]=-o*d,t[6]=l,t[10]=o*u}else if(e.order==="ZYX"){let h=o*a,f=o*c,g=l*a,_=l*c;t[0]=u*a,t[4]=g*d-f,t[8]=h*d+_,t[1]=u*c,t[5]=_*d+h,t[9]=f*d-g,t[2]=-d,t[6]=l*u,t[10]=o*u}else if(e.order==="YZX"){let h=o*u,f=o*d,g=l*u,_=l*d;t[0]=u*a,t[4]=_-h*c,t[8]=g*c+f,t[1]=c,t[5]=o*a,t[9]=-l*a,t[2]=-d*a,t[6]=f*c+g,t[10]=h-_*c}else if(e.order==="XZY"){let h=o*u,f=o*d,g=l*u,_=l*d;t[0]=u*a,t[4]=-c,t[8]=d*a,t[1]=h*c+_,t[5]=o*a,t[9]=f*c-g,t[2]=g*c-f,t[6]=l*a,t[10]=_*c+h}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(pm,e,mm)}lookAt(e,t,n){let i=this.elements;return yn.subVectors(e,t),yn.lengthSq()===0&&(yn.z=1),yn.normalize(),Vi.crossVectors(n,yn),Vi.lengthSq()===0&&(Math.abs(n.z)===1?yn.x+=1e-4:yn.z+=1e-4,yn.normalize(),Vi.crossVectors(n,yn)),Vi.normalize(),Ca.crossVectors(yn,Vi),i[0]=Vi.x,i[4]=Ca.x,i[8]=yn.x,i[1]=Vi.y,i[5]=Ca.y,i[9]=yn.y,i[2]=Vi.z,i[6]=Ca.z,i[10]=yn.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){let n=e.elements,i=t.elements,r=this.elements,o=n[0],l=n[4],u=n[8],d=n[12],a=n[1],c=n[5],h=n[9],f=n[13],g=n[2],_=n[6],m=n[10],p=n[14],b=n[3],M=n[7],y=n[11],T=n[15],P=i[0],A=i[4],D=i[8],S=i[12],E=i[1],R=i[5],V=i[9],B=i[13],z=i[2],j=i[6],Y=i[10],Z=i[14],H=i[3],te=i[7],ue=i[11],ye=i[15];return r[0]=o*P+l*E+u*z+d*H,r[4]=o*A+l*R+u*j+d*te,r[8]=o*D+l*V+u*Y+d*ue,r[12]=o*S+l*B+u*Z+d*ye,r[1]=a*P+c*E+h*z+f*H,r[5]=a*A+c*R+h*j+f*te,r[9]=a*D+c*V+h*Y+f*ue,r[13]=a*S+c*B+h*Z+f*ye,r[2]=g*P+_*E+m*z+p*H,r[6]=g*A+_*R+m*j+p*te,r[10]=g*D+_*V+m*Y+p*ue,r[14]=g*S+_*B+m*Z+p*ye,r[3]=b*P+M*E+y*z+T*H,r[7]=b*A+M*R+y*j+T*te,r[11]=b*D+M*V+y*Y+T*ue,r[15]=b*S+M*B+y*Z+T*ye,this}multiplyScalar(e){let t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){let e=this.elements,t=e[0],n=e[4],i=e[8],r=e[12],o=e[1],l=e[5],u=e[9],d=e[13],a=e[2],c=e[6],h=e[10],f=e[14],g=e[3],_=e[7],m=e[11],p=e[15];return g*(+r*u*c-i*d*c-r*l*h+n*d*h+i*l*f-n*u*f)+_*(+t*u*f-t*d*h+r*o*h-i*o*f+i*d*a-r*u*a)+m*(+t*d*c-t*l*f-r*o*c+n*o*f+r*l*a-n*d*a)+p*(-i*l*a-t*u*c+t*l*h+i*o*c-n*o*h+n*u*a)}transpose(){let e=this.elements,t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){let i=this.elements;return e.isVector3?(i[12]=e.x,i[13]=e.y,i[14]=e.z):(i[12]=e,i[13]=t,i[14]=n),this}invert(){let e=this.elements,t=e[0],n=e[1],i=e[2],r=e[3],o=e[4],l=e[5],u=e[6],d=e[7],a=e[8],c=e[9],h=e[10],f=e[11],g=e[12],_=e[13],m=e[14],p=e[15],b=c*m*d-_*h*d+_*u*f-l*m*f-c*u*p+l*h*p,M=g*h*d-a*m*d-g*u*f+o*m*f+a*u*p-o*h*p,y=a*_*d-g*c*d+g*l*f-o*_*f-a*l*p+o*c*p,T=g*c*u-a*_*u-g*l*h+o*_*h+a*l*m-o*c*m,P=t*b+n*M+i*y+r*T;if(P===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let A=1/P;return e[0]=b*A,e[1]=(_*h*r-c*m*r-_*i*f+n*m*f+c*i*p-n*h*p)*A,e[2]=(l*m*r-_*u*r+_*i*d-n*m*d-l*i*p+n*u*p)*A,e[3]=(c*u*r-l*h*r-c*i*d+n*h*d+l*i*f-n*u*f)*A,e[4]=M*A,e[5]=(a*m*r-g*h*r+g*i*f-t*m*f-a*i*p+t*h*p)*A,e[6]=(g*u*r-o*m*r-g*i*d+t*m*d+o*i*p-t*u*p)*A,e[7]=(o*h*r-a*u*r+a*i*d-t*h*d-o*i*f+t*u*f)*A,e[8]=y*A,e[9]=(g*c*r-a*_*r-g*n*f+t*_*f+a*n*p-t*c*p)*A,e[10]=(o*_*r-g*l*r+g*n*d-t*_*d-o*n*p+t*l*p)*A,e[11]=(a*l*r-o*c*r-a*n*d+t*c*d+o*n*f-t*l*f)*A,e[12]=T*A,e[13]=(a*_*i-g*c*i+g*n*h-t*_*h-a*n*m+t*c*m)*A,e[14]=(g*l*i-o*_*i-g*n*u+t*_*u+o*n*m-t*l*m)*A,e[15]=(o*c*i-a*l*i+a*n*u-t*c*u-o*n*h+t*l*h)*A,this}scale(e){let t=this.elements,n=e.x,i=e.y,r=e.z;return t[0]*=n,t[4]*=i,t[8]*=r,t[1]*=n,t[5]*=i,t[9]*=r,t[2]*=n,t[6]*=i,t[10]*=r,t[3]*=n,t[7]*=i,t[11]*=r,this}getMaxScaleOnAxis(){let e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],i=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,i))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){let t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){let t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){let n=Math.cos(t),i=Math.sin(t),r=1-n,o=e.x,l=e.y,u=e.z,d=r*o,a=r*l;return this.set(d*o+n,d*l-i*u,d*u+i*l,0,d*l+i*u,a*l+n,a*u-i*o,0,d*u-i*l,a*u+i*o,r*u*u+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,i,r,o){return this.set(1,n,r,0,e,1,o,0,t,i,1,0,0,0,0,1),this}compose(e,t,n){let i=this.elements,r=t._x,o=t._y,l=t._z,u=t._w,d=r+r,a=o+o,c=l+l,h=r*d,f=r*a,g=r*c,_=o*a,m=o*c,p=l*c,b=u*d,M=u*a,y=u*c,T=n.x,P=n.y,A=n.z;return i[0]=(1-(_+p))*T,i[1]=(f+y)*T,i[2]=(g-M)*T,i[3]=0,i[4]=(f-y)*P,i[5]=(1-(h+p))*P,i[6]=(m+b)*P,i[7]=0,i[8]=(g+M)*A,i[9]=(m-b)*A,i[10]=(1-(h+_))*A,i[11]=0,i[12]=e.x,i[13]=e.y,i[14]=e.z,i[15]=1,this}decompose(e,t,n){let i=this.elements,r=hs.set(i[0],i[1],i[2]).length(),o=hs.set(i[4],i[5],i[6]).length(),l=hs.set(i[8],i[9],i[10]).length();this.determinant()<0&&(r=-r),e.x=i[12],e.y=i[13],e.z=i[14],Hn.copy(this);let d=1/r,a=1/o,c=1/l;return Hn.elements[0]*=d,Hn.elements[1]*=d,Hn.elements[2]*=d,Hn.elements[4]*=a,Hn.elements[5]*=a,Hn.elements[6]*=a,Hn.elements[8]*=c,Hn.elements[9]*=c,Hn.elements[10]*=c,t.setFromRotationMatrix(Hn),n.x=r,n.y=o,n.z=l,this}makePerspective(e,t,n,i,r,o,l=Gn,u=!1){let d=this.elements,a=2*r/(t-e),c=2*r/(n-i),h=(t+e)/(t-e),f=(n+i)/(n-i),g,_;if(u)g=r/(o-r),_=o*r/(o-r);else if(l===Gn)g=-(o+r)/(o-r),_=-2*o*r/(o-r);else if(l===So)g=-o/(o-r),_=-o*r/(o-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+l);return d[0]=a,d[4]=0,d[8]=h,d[12]=0,d[1]=0,d[5]=c,d[9]=f,d[13]=0,d[2]=0,d[6]=0,d[10]=g,d[14]=_,d[3]=0,d[7]=0,d[11]=-1,d[15]=0,this}makeOrthographic(e,t,n,i,r,o,l=Gn,u=!1){let d=this.elements,a=2/(t-e),c=2/(n-i),h=-(t+e)/(t-e),f=-(n+i)/(n-i),g,_;if(u)g=1/(o-r),_=o/(o-r);else if(l===Gn)g=-2/(o-r),_=-(o+r)/(o-r);else if(l===So)g=-1/(o-r),_=-r/(o-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+l);return d[0]=a,d[4]=0,d[8]=0,d[12]=h,d[1]=0,d[5]=c,d[9]=0,d[13]=f,d[2]=0,d[6]=0,d[10]=g,d[14]=_,d[3]=0,d[7]=0,d[11]=0,d[15]=1,this}equals(e){let t=this.elements,n=e.elements;for(let i=0;i<16;i++)if(t[i]!==n[i])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){let n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}},hs=new w,Hn=new ke,pm=new w(0,0,0),mm=new w(1,1,1),Vi=new w,Ca=new w,yn=new w,lh=new ke,ch=new ft,Yt=(()=>{class s{constructor(t=0,n=0,i=0,r=s.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=n,this._z=i,this._order=r}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,n,i,r=this._order){return this._x=t,this._y=n,this._z=i,this._order=r,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,n=this._order,i=!0){let r=t.elements,o=r[0],l=r[4],u=r[8],d=r[1],a=r[5],c=r[9],h=r[2],f=r[6],g=r[10];switch(n){case"XYZ":this._y=Math.asin(qe(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(-c,g),this._z=Math.atan2(-l,o)):(this._x=Math.atan2(f,a),this._z=0);break;case"YXZ":this._x=Math.asin(-qe(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(u,g),this._z=Math.atan2(d,a)):(this._y=Math.atan2(-h,o),this._z=0);break;case"ZXY":this._x=Math.asin(qe(f,-1,1)),Math.abs(f)<.9999999?(this._y=Math.atan2(-h,g),this._z=Math.atan2(-l,a)):(this._y=0,this._z=Math.atan2(d,o));break;case"ZYX":this._y=Math.asin(-qe(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(f,g),this._z=Math.atan2(d,o)):(this._x=0,this._z=Math.atan2(-l,a));break;case"YZX":this._z=Math.asin(qe(d,-1,1)),Math.abs(d)<.9999999?(this._x=Math.atan2(-c,a),this._y=Math.atan2(-h,o)):(this._x=0,this._y=Math.atan2(u,g));break;case"XZY":this._z=Math.asin(-qe(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(f,a),this._y=Math.atan2(u,o)):(this._x=Math.atan2(-c,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+n)}return this._order=n,i===!0&&this._onChangeCallback(),this}setFromQuaternion(t,n,i){return lh.makeRotationFromQuaternion(t),this.setFromRotationMatrix(lh,n,i)}setFromVector3(t,n=this._order){return this.set(t.x,t.y,t.z,n)}reorder(t){return ch.setFromEuler(this),this.setFromQuaternion(ch,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],n=0){return t[n]=this._x,t[n+1]=this._y,t[n+2]=this._z,t[n+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}return s.DEFAULT_ORDER="XYZ",s})(),Ts=class{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}},gm=0,uh=new w,fs=new ft,pi=new ke,wa=new w,fo=new w,_m=new w,vm=new ft,dh=new w(1,0,0),hh=new w(0,1,0),fh=new w(0,0,1),ph={type:"added"},ym={type:"removed"},ps={type:"childadded",child:null},Wc={type:"childremoved",child:null},wt=(()=>{class s extends Yn{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:gm++}),this.uuid=Xn(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=s.DEFAULT_UP.clone();let t=new w,n=new Yt,i=new ft,r=new w(1,1,1);function o(){i.setFromEuler(n,!1)}function l(){n.setFromQuaternion(i,void 0,!1)}n._onChange(o),i._onChange(l),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:n},quaternion:{configurable:!0,enumerable:!0,value:i},scale:{configurable:!0,enumerable:!0,value:r},modelViewMatrix:{value:new ke},normalMatrix:{value:new Ge}}),this.matrix=new ke,this.matrixWorld=new ke,this.matrixAutoUpdate=s.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Ts,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,n){this.quaternion.setFromAxisAngle(t,n)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,n){return fs.setFromAxisAngle(t,n),this.quaternion.multiply(fs),this}rotateOnWorldAxis(t,n){return fs.setFromAxisAngle(t,n),this.quaternion.premultiply(fs),this}rotateX(t){return this.rotateOnAxis(dh,t)}rotateY(t){return this.rotateOnAxis(hh,t)}rotateZ(t){return this.rotateOnAxis(fh,t)}translateOnAxis(t,n){return uh.copy(t).applyQuaternion(this.quaternion),this.position.add(uh.multiplyScalar(n)),this}translateX(t){return this.translateOnAxis(dh,t)}translateY(t){return this.translateOnAxis(hh,t)}translateZ(t){return this.translateOnAxis(fh,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(pi.copy(this.matrixWorld).invert())}lookAt(t,n,i){t.isVector3?wa.copy(t):wa.set(t,n,i);let r=this.parent;this.updateWorldMatrix(!0,!1),fo.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?pi.lookAt(fo,wa,this.up):pi.lookAt(wa,fo,this.up),this.quaternion.setFromRotationMatrix(pi),r&&(pi.extractRotation(r.matrixWorld),fs.setFromRotationMatrix(pi),this.quaternion.premultiply(fs.invert()))}add(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.add(arguments[n]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(ph),ps.child=t,this.dispatchEvent(ps),ps.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let i=0;i<arguments.length;i++)this.remove(arguments[i]);return this}let n=this.children.indexOf(t);return n!==-1&&(t.parent=null,this.children.splice(n,1),t.dispatchEvent(ym),Wc.child=t,this.dispatchEvent(Wc),Wc.child=null),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),pi.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),pi.multiply(t.parent.matrixWorld)),t.applyMatrix4(pi),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(ph),ps.child=t,this.dispatchEvent(ps),ps.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,n){if(this[t]===n)return this;for(let i=0,r=this.children.length;i<r;i++){let l=this.children[i].getObjectByProperty(t,n);if(l!==void 0)return l}}getObjectsByProperty(t,n,i=[]){this[t]===n&&i.push(this);let r=this.children;for(let o=0,l=r.length;o<l;o++)r[o].getObjectsByProperty(t,n,i);return i}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,t,_m),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(fo,vm,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let n=this.matrixWorld.elements;return t.set(n[8],n[9],n[10]).normalize()}raycast(){}traverse(t){t(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].traverseVisible(t)}traverseAncestors(t){let n=this.parent;n!==null&&(t(n),n.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);let n=this.children;for(let i=0,r=n.length;i<r;i++)n[i].updateMatrixWorld(t)}updateWorldMatrix(t,n){let i=this.parent;if(t===!0&&i!==null&&i.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),n===!0){let r=this.children;for(let o=0,l=r.length;o<l;o++)r[o].updateWorldMatrix(!1,!0)}}toJSON(t){let n=t===void 0||typeof t=="string",i={};n&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},i.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let r={};r.uuid=this.uuid,r.type=this.type,this.name!==""&&(r.name=this.name),this.castShadow===!0&&(r.castShadow=!0),this.receiveShadow===!0&&(r.receiveShadow=!0),this.visible===!1&&(r.visible=!1),this.frustumCulled===!1&&(r.frustumCulled=!1),this.renderOrder!==0&&(r.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(r.userData=this.userData),r.layers=this.layers.mask,r.matrix=this.matrix.toArray(),r.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(r.matrixAutoUpdate=!1),this.isInstancedMesh&&(r.type="InstancedMesh",r.count=this.count,r.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(r.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(r.type="BatchedMesh",r.perObjectFrustumCulled=this.perObjectFrustumCulled,r.sortObjects=this.sortObjects,r.drawRanges=this._drawRanges,r.reservedRanges=this._reservedRanges,r.geometryInfo=this._geometryInfo.map(u=>ui(Ct({},u),{boundingBox:u.boundingBox?u.boundingBox.toJSON():void 0,boundingSphere:u.boundingSphere?u.boundingSphere.toJSON():void 0})),r.instanceInfo=this._instanceInfo.map(u=>Ct({},u)),r.availableInstanceIds=this._availableInstanceIds.slice(),r.availableGeometryIds=this._availableGeometryIds.slice(),r.nextIndexStart=this._nextIndexStart,r.nextVertexStart=this._nextVertexStart,r.geometryCount=this._geometryCount,r.maxInstanceCount=this._maxInstanceCount,r.maxVertexCount=this._maxVertexCount,r.maxIndexCount=this._maxIndexCount,r.geometryInitialized=this._geometryInitialized,r.matricesTexture=this._matricesTexture.toJSON(t),r.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(r.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(r.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(r.boundingBox=this.boundingBox.toJSON()));function o(u,d){return u[d.uuid]===void 0&&(u[d.uuid]=d.toJSON(t)),d.uuid}if(this.isScene)this.background&&(this.background.isColor?r.background=this.background.toJSON():this.background.isTexture&&(r.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(r.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){r.geometry=o(t.geometries,this.geometry);let u=this.geometry.parameters;if(u!==void 0&&u.shapes!==void 0){let d=u.shapes;if(Array.isArray(d))for(let a=0,c=d.length;a<c;a++){let h=d[a];o(t.shapes,h)}else o(t.shapes,d)}}if(this.isSkinnedMesh&&(r.bindMode=this.bindMode,r.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(o(t.skeletons,this.skeleton),r.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let u=[];for(let d=0,a=this.material.length;d<a;d++)u.push(o(t.materials,this.material[d]));r.material=u}else r.material=o(t.materials,this.material);if(this.children.length>0){r.children=[];for(let u=0;u<this.children.length;u++)r.children.push(this.children[u].toJSON(t).object)}if(this.animations.length>0){r.animations=[];for(let u=0;u<this.animations.length;u++){let d=this.animations[u];r.animations.push(o(t.animations,d))}}if(n){let u=l(t.geometries),d=l(t.materials),a=l(t.textures),c=l(t.images),h=l(t.shapes),f=l(t.skeletons),g=l(t.animations),_=l(t.nodes);u.length>0&&(i.geometries=u),d.length>0&&(i.materials=d),a.length>0&&(i.textures=a),c.length>0&&(i.images=c),h.length>0&&(i.shapes=h),f.length>0&&(i.skeletons=f),g.length>0&&(i.animations=g),_.length>0&&(i.nodes=_)}return i.object=r,i;function l(u){let d=[];for(let a in u){let c=u[a];delete c.metadata,d.push(c)}return d}}clone(t){return new this.constructor().copy(this,t)}copy(t,n=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),n===!0)for(let i=0;i<t.children.length;i++){let r=t.children[i];this.add(r.clone())}return this}}return s.DEFAULT_UP=new w(0,1,0),s.DEFAULT_MATRIX_AUTO_UPDATE=!0,s.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0,s})(),zn=new w,mi=new w,Xc=new w,gi=new w,ms=new w,gs=new w,mh=new w,Yc=new w,qc=new w,jc=new w,Zc=new it,$c=new it,Kc=new it,Xi=class s{constructor(e=new w,t=new w,n=new w){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,i){i.subVectors(n,t),zn.subVectors(e,t),i.cross(zn);let r=i.lengthSq();return r>0?i.multiplyScalar(1/Math.sqrt(r)):i.set(0,0,0)}static getBarycoord(e,t,n,i,r){zn.subVectors(i,t),mi.subVectors(n,t),Xc.subVectors(e,t);let o=zn.dot(zn),l=zn.dot(mi),u=zn.dot(Xc),d=mi.dot(mi),a=mi.dot(Xc),c=o*d-l*l;if(c===0)return r.set(0,0,0),null;let h=1/c,f=(d*u-l*a)*h,g=(o*a-l*u)*h;return r.set(1-f-g,g,f)}static containsPoint(e,t,n,i){return this.getBarycoord(e,t,n,i,gi)===null?!1:gi.x>=0&&gi.y>=0&&gi.x+gi.y<=1}static getInterpolation(e,t,n,i,r,o,l,u){return this.getBarycoord(e,t,n,i,gi)===null?(u.x=0,u.y=0,"z"in u&&(u.z=0),"w"in u&&(u.w=0),null):(u.setScalar(0),u.addScaledVector(r,gi.x),u.addScaledVector(o,gi.y),u.addScaledVector(l,gi.z),u)}static getInterpolatedAttribute(e,t,n,i,r,o){return Zc.setScalar(0),$c.setScalar(0),Kc.setScalar(0),Zc.fromBufferAttribute(e,t),$c.fromBufferAttribute(e,n),Kc.fromBufferAttribute(e,i),o.setScalar(0),o.addScaledVector(Zc,r.x),o.addScaledVector($c,r.y),o.addScaledVector(Kc,r.z),o}static isFrontFacing(e,t,n,i){return zn.subVectors(n,t),mi.subVectors(e,t),zn.cross(mi).dot(i)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,i){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[i]),this}setFromAttributeAndIndices(e,t,n,i){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,i),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return zn.subVectors(this.c,this.b),mi.subVectors(this.a,this.b),zn.cross(mi).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return s.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return s.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,i,r){return s.getInterpolation(e,this.a,this.b,this.c,t,n,i,r)}containsPoint(e){return s.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return s.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){let n=this.a,i=this.b,r=this.c,o,l;ms.subVectors(i,n),gs.subVectors(r,n),Yc.subVectors(e,n);let u=ms.dot(Yc),d=gs.dot(Yc);if(u<=0&&d<=0)return t.copy(n);qc.subVectors(e,i);let a=ms.dot(qc),c=gs.dot(qc);if(a>=0&&c<=a)return t.copy(i);let h=u*c-a*d;if(h<=0&&u>=0&&a<=0)return o=u/(u-a),t.copy(n).addScaledVector(ms,o);jc.subVectors(e,r);let f=ms.dot(jc),g=gs.dot(jc);if(g>=0&&f<=g)return t.copy(r);let _=f*d-u*g;if(_<=0&&d>=0&&g<=0)return l=d/(d-g),t.copy(n).addScaledVector(gs,l);let m=a*g-f*c;if(m<=0&&c-a>=0&&f-g>=0)return mh.subVectors(r,i),l=(c-a)/(c-a+(f-g)),t.copy(i).addScaledVector(mh,l);let p=1/(m+_+h);return o=_*p,l=h*p,t.copy(n).addScaledVector(ms,o).addScaledVector(gs,l)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}},Lf={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Gi={h:0,s:0,l:0},Ta={h:0,s:0,l:0};function Jc(s,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?s+(e-s)*6*t:t<1/2?e:t<2/3?s+(e-s)*6*(2/3-t):s}var de=class{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){let i=e;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=Je){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,i=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.colorSpaceToWorking(this,i),this}setHSL(e,t,n,i=je.workingColorSpace){if(e=Lu(e,1),t=qe(t,0,1),n=qe(n,0,1),t===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+t):n+t-n*t,o=2*n-r;this.r=Jc(o,r,e+1/3),this.g=Jc(o,r,e),this.b=Jc(o,r,e-1/3)}return je.colorSpaceToWorking(this,i),this}setStyle(e,t=Je){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+e+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(e)){let r,o=i[1],l=i[2];switch(o){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(l))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:console.warn("THREE.Color: Unknown color model "+e)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(e)){let r=i[1],o=r.length;if(o===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(o===6)return this.setHex(parseInt(r,16),t);console.warn("THREE.Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=Je){let n=Lf[e.toLowerCase()];return n!==void 0?this.setHex(n,t):console.warn("THREE.Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=vi(e.r),this.g=vi(e.g),this.b=vi(e.b),this}copyLinearToSRGB(e){return this.r=Ms(e.r),this.g=Ms(e.g),this.b=Ms(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=Je){return je.workingToColorSpace(en.copy(this),e),Math.round(qe(en.r*255,0,255))*65536+Math.round(qe(en.g*255,0,255))*256+Math.round(qe(en.b*255,0,255))}getHexString(e=Je){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.workingToColorSpace(en.copy(this),t);let n=en.r,i=en.g,r=en.b,o=Math.max(n,i,r),l=Math.min(n,i,r),u,d,a=(l+o)/2;if(l===o)u=0,d=0;else{let c=o-l;switch(d=a<=.5?c/(o+l):c/(2-o-l),o){case n:u=(i-r)/c+(i<r?6:0);break;case i:u=(r-n)/c+2;break;case r:u=(n-i)/c+4;break}u/=6}return e.h=u,e.s=d,e.l=a,e}getRGB(e,t=je.workingColorSpace){return je.workingToColorSpace(en.copy(this),t),e.r=en.r,e.g=en.g,e.b=en.b,e}getStyle(e=Je){je.workingToColorSpace(en.copy(this),e);let t=en.r,n=en.g,i=en.b;return e!==Je?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(e,t,n){return this.getHSL(Gi),this.setHSL(Gi.h+e,Gi.s+t,Gi.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Gi),e.getHSL(Ta);let n=xo(Gi.h,Ta.h,t),i=xo(Gi.s,Ta.s,t),r=xo(Gi.l,Ta.l,t);return this.setHSL(n,i,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){let t=this.r,n=this.g,i=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*i,this.g=r[1]*t+r[4]*n+r[7]*i,this.b=r[2]*t+r[5]*n+r[8]*i,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},en=new de;de.NAMES=Lf;var xm=0,qt=class extends Yn{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:xm++}),this.uuid=Xn(),this.name="",this.type="Material",this.blending=mr,this.side=Mn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ya,this.blendDst=qa,this.blendEquation=Yi,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new de(0,0,0),this.blendAlpha=0,this.depthFunc=gr,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=uu,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=hr,this.stencilZFail=hr,this.stencilZPass=hr,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(let t in e){let n=e[t];if(n===void 0){console.warn(`THREE.Material: parameter '${t}' has value of undefined.`);continue}let i=this[t];if(i===void 0){console.warn(`THREE.Material: '${t}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[t]=n}}toJSON(e){let t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});let n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==mr&&(n.blending=this.blending),this.side!==Mn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ya&&(n.blendSrc=this.blendSrc),this.blendDst!==qa&&(n.blendDst=this.blendDst),this.blendEquation!==Yi&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==gr&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==uu&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==hr&&(n.stencilFail=this.stencilFail),this.stencilZFail!==hr&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==hr&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(r){let o=[];for(let l in r){let u=r[l];delete u.metadata,o.push(u)}return o}if(t){let r=i(e.textures),o=i(e.images);r.length>0&&(n.textures=r),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;let t=e.clippingPlanes,n=null;if(t!==null){let i=t.length;n=new Array(i);for(let r=0;r!==i;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}},Ot=class extends qt{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new de(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yt,this.combine=Mu,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}};var Pt=new w,Aa=new Se,bm=0,st=class{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:bm++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ja,this.updateRanges=[],this.gpuType=On,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let i=0,r=this.itemSize;i<r;i++)this.array[e+i]=t.array[n+i];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Aa.fromBufferAttribute(this,t),Aa.applyMatrix3(e),this.setXY(t,Aa.x,Aa.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix3(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyMatrix4(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.applyNormalMatrix(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)Pt.fromBufferAttribute(this,t),Pt.transformDirection(e),this.setXYZ(t,Pt.x,Pt.y,Pt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Vn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=lt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Vn(t,this.array)),t}setX(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Vn(t,this.array)),t}setY(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Vn(t,this.array)),t}setZ(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Vn(t,this.array)),t}setW(e,t){return this.normalized&&(t=lt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,i){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),i=lt(i,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e*=this.itemSize,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),i=lt(i,this.array),r=lt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=i,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ja&&(e.usage=this.usage),e}};var Co=class extends st{constructor(e,t,n){super(new Uint16Array(e),t,n)}};var wo=class extends st{constructor(e,t,n){super(new Uint32Array(e),t,n)}};var Wt=class extends st{constructor(e,t,n){super(new Float32Array(e),t,n)}},Mm=0,Pn=new ke,Qc=new wt,_s=new w,xn=new Sn,po=new Sn,Ht=new w,Tt=class s extends Yn{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Mm++}),this.uuid=Xn(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(Nu(e)?wo:Co)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){let t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new Ge().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}let i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(e),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return Pn.makeRotationFromQuaternion(e),this.applyMatrix4(Pn),this}rotateX(e){return Pn.makeRotationX(e),this.applyMatrix4(Pn),this}rotateY(e){return Pn.makeRotationY(e),this.applyMatrix4(Pn),this}rotateZ(e){return Pn.makeRotationZ(e),this.applyMatrix4(Pn),this}translate(e,t,n){return Pn.makeTranslation(e,t,n),this.applyMatrix4(Pn),this}scale(e,t,n){return Pn.makeScale(e,t,n),this.applyMatrix4(Pn),this}lookAt(e){return Qc.lookAt(e),Qc.updateMatrix(),this.applyMatrix4(Qc.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_s).negate(),this.translate(_s.x,_s.y,_s.z),this}setFromPoints(e){let t=this.getAttribute("position");if(t===void 0){let n=[];for(let i=0,r=e.length;i<r;i++){let o=e[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new Wt(n,3))}else{let n=Math.min(e.length,t.count);for(let i=0;i<n;i++){let r=e[i];t.setXYZ(i,r.x,r.y,r.z||0)}e.length>t.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Sn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new w(-1/0,-1/0,-1/0),new w(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,i=t.length;n<i;n++){let r=t[n];xn.setFromBufferAttribute(r),this.morphTargetsRelative?(Ht.addVectors(this.boundingBox.min,xn.min),this.boundingBox.expandByPoint(Ht),Ht.addVectors(this.boundingBox.max,xn.max),this.boundingBox.expandByPoint(Ht)):(this.boundingBox.expandByPoint(xn.min),this.boundingBox.expandByPoint(xn.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new dn);let e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new w,1/0);return}if(e){let n=this.boundingSphere.center;if(xn.setFromBufferAttribute(e),t)for(let r=0,o=t.length;r<o;r++){let l=t[r];po.setFromBufferAttribute(l),this.morphTargetsRelative?(Ht.addVectors(xn.min,po.min),xn.expandByPoint(Ht),Ht.addVectors(xn.max,po.max),xn.expandByPoint(Ht)):(xn.expandByPoint(po.min),xn.expandByPoint(po.max))}xn.getCenter(n);let i=0;for(let r=0,o=e.count;r<o;r++)Ht.fromBufferAttribute(e,r),i=Math.max(i,n.distanceToSquared(Ht));if(t)for(let r=0,o=t.length;r<o;r++){let l=t[r],u=this.morphTargetsRelative;for(let d=0,a=l.count;d<a;d++)Ht.fromBufferAttribute(l,d),u&&(_s.fromBufferAttribute(e,d),Ht.add(_s)),i=Math.max(i,n.distanceToSquared(Ht))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.position,i=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new st(new Float32Array(4*n.count),4));let o=this.getAttribute("tangent"),l=[],u=[];for(let D=0;D<n.count;D++)l[D]=new w,u[D]=new w;let d=new w,a=new w,c=new w,h=new Se,f=new Se,g=new Se,_=new w,m=new w;function p(D,S,E){d.fromBufferAttribute(n,D),a.fromBufferAttribute(n,S),c.fromBufferAttribute(n,E),h.fromBufferAttribute(r,D),f.fromBufferAttribute(r,S),g.fromBufferAttribute(r,E),a.sub(d),c.sub(d),f.sub(h),g.sub(h);let R=1/(f.x*g.y-g.x*f.y);isFinite(R)&&(_.copy(a).multiplyScalar(g.y).addScaledVector(c,-f.y).multiplyScalar(R),m.copy(c).multiplyScalar(f.x).addScaledVector(a,-g.x).multiplyScalar(R),l[D].add(_),l[S].add(_),l[E].add(_),u[D].add(m),u[S].add(m),u[E].add(m))}let b=this.groups;b.length===0&&(b=[{start:0,count:e.count}]);for(let D=0,S=b.length;D<S;++D){let E=b[D],R=E.start,V=E.count;for(let B=R,z=R+V;B<z;B+=3)p(e.getX(B+0),e.getX(B+1),e.getX(B+2))}let M=new w,y=new w,T=new w,P=new w;function A(D){T.fromBufferAttribute(i,D),P.copy(T);let S=l[D];M.copy(S),M.sub(T.multiplyScalar(T.dot(S))).normalize(),y.crossVectors(P,S);let R=y.dot(u[D])<0?-1:1;o.setXYZW(D,M.x,M.y,M.z,R)}for(let D=0,S=b.length;D<S;++D){let E=b[D],R=E.start,V=E.count;for(let B=R,z=R+V;B<z;B+=3)A(e.getX(B+0)),A(e.getX(B+1)),A(e.getX(B+2))}}computeVertexNormals(){let e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new st(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);let i=new w,r=new w,o=new w,l=new w,u=new w,d=new w,a=new w,c=new w;if(e)for(let h=0,f=e.count;h<f;h+=3){let g=e.getX(h+0),_=e.getX(h+1),m=e.getX(h+2);i.fromBufferAttribute(t,g),r.fromBufferAttribute(t,_),o.fromBufferAttribute(t,m),a.subVectors(o,r),c.subVectors(i,r),a.cross(c),l.fromBufferAttribute(n,g),u.fromBufferAttribute(n,_),d.fromBufferAttribute(n,m),l.add(a),u.add(a),d.add(a),n.setXYZ(g,l.x,l.y,l.z),n.setXYZ(_,u.x,u.y,u.z),n.setXYZ(m,d.x,d.y,d.z)}else for(let h=0,f=t.count;h<f;h+=3)i.fromBufferAttribute(t,h+0),r.fromBufferAttribute(t,h+1),o.fromBufferAttribute(t,h+2),a.subVectors(o,r),c.subVectors(i,r),a.cross(c),n.setXYZ(h+0,a.x,a.y,a.z),n.setXYZ(h+1,a.x,a.y,a.z),n.setXYZ(h+2,a.x,a.y,a.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)Ht.fromBufferAttribute(e,t),Ht.normalize(),e.setXYZ(t,Ht.x,Ht.y,Ht.z)}toNonIndexed(){function e(l,u){let d=l.array,a=l.itemSize,c=l.normalized,h=new d.constructor(u.length*a),f=0,g=0;for(let _=0,m=u.length;_<m;_++){l.isInterleavedBufferAttribute?f=u[_]*l.data.stride+l.offset:f=u[_]*a;for(let p=0;p<a;p++)h[g++]=d[f++]}return new st(h,a,c)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let t=new s,n=this.index.array,i=this.attributes;for(let l in i){let u=i[l],d=e(u,n);t.setAttribute(l,d)}let r=this.morphAttributes;for(let l in r){let u=[],d=r[l];for(let a=0,c=d.length;a<c;a++){let h=d[a],f=e(h,n);u.push(f)}t.morphAttributes[l]=u}t.morphTargetsRelative=this.morphTargetsRelative;let o=this.groups;for(let l=0,u=o.length;l<u;l++){let d=o[l];t.addGroup(d.start,d.count,d.materialIndex)}return t}toJSON(){let e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){let u=this.parameters;for(let d in u)u[d]!==void 0&&(e[d]=u[d]);return e}e.data={attributes:{}};let t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});let n=this.attributes;for(let u in n){let d=n[u];e.data.attributes[u]=d.toJSON(e.data)}let i={},r=!1;for(let u in this.morphAttributes){let d=this.morphAttributes[u],a=[];for(let c=0,h=d.length;c<h;c++){let f=d[c];a.push(f.toJSON(e.data))}a.length>0&&(i[u]=a,r=!0)}r&&(e.data.morphAttributes=i,e.data.morphTargetsRelative=this.morphTargetsRelative);let o=this.groups;o.length>0&&(e.data.groups=JSON.parse(JSON.stringify(o)));let l=this.boundingSphere;return l!==null&&(e.data.boundingSphere=l.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let t={};this.name=e.name;let n=e.index;n!==null&&this.setIndex(n.clone());let i=e.attributes;for(let d in i){let a=i[d];this.setAttribute(d,a.clone(t))}let r=e.morphAttributes;for(let d in r){let a=[],c=r[d];for(let h=0,f=c.length;h<f;h++)a.push(c[h].clone(t));this.morphAttributes[d]=a}this.morphTargetsRelative=e.morphTargetsRelative;let o=e.groups;for(let d=0,a=o.length;d<a;d++){let c=o[d];this.addGroup(c.start,c.count,c.materialIndex)}let l=e.boundingBox;l!==null&&(this.boundingBox=l.clone());let u=e.boundingSphere;return u!==null&&(this.boundingSphere=u.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},gh=new ke,ur=new Qn,Ra=new dn,_h=new w,Pa=new w,Ia=new w,Da=new w,eu=new w,Oa=new w,vh=new w,La=new w,Ue=class extends wt{constructor(e=new Tt,t=new Ot){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let l=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}getVertexPosition(e,t){let n=this.geometry,i=n.attributes.position,r=n.morphAttributes.position,o=n.morphTargetsRelative;t.fromBufferAttribute(i,e);let l=this.morphTargetInfluences;if(r&&l){Oa.set(0,0,0);for(let u=0,d=r.length;u<d;u++){let a=l[u],c=r[u];a!==0&&(eu.fromBufferAttribute(c,e),o?Oa.addScaledVector(eu,a):Oa.addScaledVector(eu.sub(t),a))}t.add(Oa)}return t}raycast(e,t){let n=this.geometry,i=this.material,r=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ra.copy(n.boundingSphere),Ra.applyMatrix4(r),ur.copy(e.ray).recast(e.near),!(Ra.containsPoint(ur.origin)===!1&&(ur.intersectSphere(Ra,_h)===null||ur.origin.distanceToSquared(_h)>(e.far-e.near)**2))&&(gh.copy(r).invert(),ur.copy(e.ray).applyMatrix4(gh),!(n.boundingBox!==null&&ur.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ur)))}_computeIntersections(e,t,n){let i,r=this.geometry,o=this.material,l=r.index,u=r.attributes.position,d=r.attributes.uv,a=r.attributes.uv1,c=r.attributes.normal,h=r.groups,f=r.drawRange;if(l!==null)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){let m=h[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),M=Math.min(l.count,Math.min(m.start+m.count,f.start+f.count));for(let y=b,T=M;y<T;y+=3){let P=l.getX(y),A=l.getX(y+1),D=l.getX(y+2);i=Na(this,p,e,n,d,a,c,P,A,D),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let g=Math.max(0,f.start),_=Math.min(l.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let b=l.getX(m),M=l.getX(m+1),y=l.getX(m+2);i=Na(this,o,e,n,d,a,c,b,M,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}else if(u!==void 0)if(Array.isArray(o))for(let g=0,_=h.length;g<_;g++){let m=h[g],p=o[m.materialIndex],b=Math.max(m.start,f.start),M=Math.min(u.count,Math.min(m.start+m.count,f.start+f.count));for(let y=b,T=M;y<T;y+=3){let P=y,A=y+1,D=y+2;i=Na(this,p,e,n,d,a,c,P,A,D),i&&(i.faceIndex=Math.floor(y/3),i.face.materialIndex=m.materialIndex,t.push(i))}}else{let g=Math.max(0,f.start),_=Math.min(u.count,f.start+f.count);for(let m=g,p=_;m<p;m+=3){let b=m,M=m+1,y=m+2;i=Na(this,o,e,n,d,a,c,b,M,y),i&&(i.faceIndex=Math.floor(m/3),t.push(i))}}}};function Sm(s,e,t,n,i,r,o,l){let u;if(e.side===jt?u=n.intersectTriangle(o,r,i,!0,l):u=n.intersectTriangle(i,r,o,e.side===Mn,l),u===null)return null;La.copy(l),La.applyMatrix4(s.matrixWorld);let d=t.ray.origin.distanceTo(La);return d<t.near||d>t.far?null:{distance:d,point:La.clone(),object:s}}function Na(s,e,t,n,i,r,o,l,u,d){s.getVertexPosition(l,Pa),s.getVertexPosition(u,Ia),s.getVertexPosition(d,Da);let a=Sm(s,e,t,n,Pa,Ia,Da,vh);if(a){let c=new w;Xi.getBarycoord(vh,Pa,Ia,Da,c),i&&(a.uv=Xi.getInterpolatedAttribute(i,l,u,d,c,new Se)),r&&(a.uv1=Xi.getInterpolatedAttribute(r,l,u,d,c,new Se)),o&&(a.normal=Xi.getInterpolatedAttribute(o,l,u,d,c,new w),a.normal.dot(n.direction)>0&&a.normal.multiplyScalar(-1));let h={a:l,b:u,c:d,normal:new w,materialIndex:0};Xi.getNormal(Pa,Ia,Da,h.normal),a.face=h,a.barycoord=c}return a}var As=class s extends Tt{constructor(e=1,t=1,n=1,i=1,r=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:i,heightSegments:r,depthSegments:o};let l=this;i=Math.floor(i),r=Math.floor(r),o=Math.floor(o);let u=[],d=[],a=[],c=[],h=0,f=0;g("z","y","x",-1,-1,n,t,e,o,r,0),g("z","y","x",1,-1,n,t,-e,o,r,1),g("x","z","y",1,1,e,n,t,i,o,2),g("x","z","y",1,-1,e,n,-t,i,o,3),g("x","y","z",1,-1,e,t,n,i,r,4),g("x","y","z",-1,-1,e,t,-n,i,r,5),this.setIndex(u),this.setAttribute("position",new Wt(d,3)),this.setAttribute("normal",new Wt(a,3)),this.setAttribute("uv",new Wt(c,2));function g(_,m,p,b,M,y,T,P,A,D,S){let E=y/A,R=T/D,V=y/2,B=T/2,z=P/2,j=A+1,Y=D+1,Z=0,H=0,te=new w;for(let ue=0;ue<Y;ue++){let ye=ue*R-B;for(let He=0;He<j;He++){let at=He*E-V;te[_]=at*b,te[m]=ye*M,te[p]=z,d.push(te.x,te.y,te.z),te[_]=0,te[m]=0,te[p]=P>0?1:-1,a.push(te.x,te.y,te.z),c.push(He/A),c.push(1-ue/D),Z+=1}}for(let ue=0;ue<D;ue++)for(let ye=0;ye<A;ye++){let He=h+ye+j*ue,at=h+ye+j*(ue+1),tt=h+(ye+1)+j*(ue+1),W=h+(ye+1)+j*ue;u.push(He,at,W),u.push(at,tt,W),H+=6}l.addGroup(f,H,S),f+=H,h+=Z}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}};function Ir(s){let e={};for(let t in s){e[t]={};for(let n in s[t]){let i=s[t][n];i&&(i.isColor||i.isMatrix3||i.isMatrix4||i.isVector2||i.isVector3||i.isVector4||i.isTexture||i.isQuaternion)?i.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=i.clone():Array.isArray(i)?e[t][n]=i.slice():e[t][n]=i}}return e}function tn(s){let e={};for(let t=0;t<s.length;t++){let n=Ir(s[t]);for(let i in n)e[i]=n[i]}return e}function Em(s){let e=[];for(let t=0;t<s.length;t++)e.push(s[t].clone());return e}function ku(s){let e=s.getRenderTarget();return e===null?s.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}var Nf={clone:Ir,merge:tn},Cm=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,wm=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Rt=class extends qt{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Cm,this.fragmentShader=wm,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Ir(e.uniforms),this.uniformsGroups=Em(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){let t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(let i in this.uniforms){let o=this.uniforms[i].value;o&&o.isTexture?t.uniforms[i]={type:"t",value:o.toJSON(e).uuid}:o&&o.isColor?t.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?t.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?t.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?t.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?t.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?t.uniforms[i]={type:"m4",value:o.toArray()}:t.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;let n={};for(let i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}},To=class extends wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new ke,this.projectionMatrix=new ke,this.projectionMatrixInverse=new ke,this.coordinateSystem=Gn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Wi=new w,yh=new Se,xh=new Se,It=class extends To{constructor(e=50,t=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){let t=.5*this.getFilmHeight()/e;this.fov=yr*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){let e=Math.tan(yo*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return yr*2*Math.atan(Math.tan(yo*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Wi.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z),Wi.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wi.x,Wi.y).multiplyScalar(-e/Wi.z)}getViewSize(e,t){return this.getViewBounds(e,yh,xh),t.subVectors(xh,yh)}setViewOffset(e,t,n,i,r,o){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=this.near,t=e*Math.tan(yo*.5*this.fov)/this.zoom,n=2*t,i=this.aspect*n,r=-.5*i,o=this.view;if(this.view!==null&&this.view.enabled){let u=o.fullWidth,d=o.fullHeight;r+=o.offsetX*i/u,t-=o.offsetY*n/d,i*=o.width/u,n*=o.height/d}let l=this.filmOffset;l!==0&&(r+=e*l/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+i,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}},vs=-90,ys=1,Ja=class extends wt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let i=new It(vs,ys,e,t);i.layers=this.layers,this.add(i);let r=new It(vs,ys,e,t);r.layers=this.layers,this.add(r);let o=new It(vs,ys,e,t);o.layers=this.layers,this.add(o);let l=new It(vs,ys,e,t);l.layers=this.layers,this.add(l);let u=new It(vs,ys,e,t);u.layers=this.layers,this.add(u);let d=new It(vs,ys,e,t);d.layers=this.layers,this.add(d)}updateCoordinateSystem(){let e=this.coordinateSystem,t=this.children.concat(),[n,i,r,o,l,u]=t;for(let d of t)this.remove(d);if(e===Gn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),l.up.set(0,1,0),l.lookAt(0,0,1),u.up.set(0,1,0),u.lookAt(0,0,-1);else if(e===So)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),l.up.set(0,-1,0),l.lookAt(0,0,1),u.up.set(0,-1,0),u.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(let d of t)this.add(d),d.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());let[r,o,l,u,d,a]=this.children,c=e.getRenderTarget(),h=e.getActiveCubeFace(),f=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,i),e.render(t,r),e.setRenderTarget(n,1,i),e.render(t,o),e.setRenderTarget(n,2,i),e.render(t,l),e.setRenderTarget(n,3,i),e.render(t,u),e.setRenderTarget(n,4,i),e.render(t,d),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,i),e.render(t,a),e.setRenderTarget(c,h,f),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}},Ao=class extends pn{constructor(e=[],t=Ar,n,i,r,o,l,u,d,a){super(e,t,n,i,r,o,l,u,d,a),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}},Qa=class extends un{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;let n={width:e,height:e,depth:1},i=[n,n,n,n,n,n];this.texture=new Ao(i),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new As(5,5,5),r=new Rt({name:"CubemapFromEquirect",uniforms:Ir(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:jt,blending:Ti});r.uniforms.tEquirect.value=t;let o=new Ue(i,r),l=t.minFilter;return t.minFilter===jn&&(t.minFilter=Dt),new Ja(1,10,this).update(e,o),t.minFilter=l,o.geometry.dispose(),o.material.dispose(),this}clear(e,t=!0,n=!0,i=!0){let r=e.getRenderTarget();for(let o=0;o<6;o++)e.setRenderTarget(this,o),e.clear(t,n,i);e.setRenderTarget(r)}},Wn=class extends wt{constructor(){super(),this.isGroup=!0,this.type="Group"}},Tm={type:"move"},Rs=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Wn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Wn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new w,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new w),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Wn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new w,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new w),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){let t=this._hand;if(t)for(let n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let i=null,r=null,o=null,l=this._targetRay,u=this._grip,d=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(d&&e.hand){o=!0;for(let _ of e.hand.values()){let m=t.getJointPose(_,n),p=this._getHandJoint(d,_);m!==null&&(p.matrix.fromArray(m.transform.matrix),p.matrix.decompose(p.position,p.rotation,p.scale),p.matrixWorldNeedsUpdate=!0,p.jointRadius=m.radius),p.visible=m!==null}let a=d.joints["index-finger-tip"],c=d.joints["thumb-tip"],h=a.position.distanceTo(c.position),f=.02,g=.005;d.inputState.pinching&&h>f+g?(d.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!d.inputState.pinching&&h<=f-g&&(d.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else u!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(u.matrix.fromArray(r.transform.matrix),u.matrix.decompose(u.position,u.rotation,u.scale),u.matrixWorldNeedsUpdate=!0,r.linearVelocity?(u.hasLinearVelocity=!0,u.linearVelocity.copy(r.linearVelocity)):u.hasLinearVelocity=!1,r.angularVelocity?(u.hasAngularVelocity=!0,u.angularVelocity.copy(r.angularVelocity)):u.hasAngularVelocity=!1));l!==null&&(i=t.getPose(e.targetRaySpace,n),i===null&&r!==null&&(i=r),i!==null&&(l.matrix.fromArray(i.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,i.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(i.linearVelocity)):l.hasLinearVelocity=!1,i.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(i.angularVelocity)):l.hasAngularVelocity=!1,this.dispatchEvent(Tm)))}return l!==null&&(l.visible=i!==null),u!==null&&(u.visible=r!==null),d!==null&&(d.visible=o!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){let n=new Wn;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}};var Ro=class s{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new de(e),this.near=t,this.far=n}clone(){return new s(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}},yi=class extends wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new Yt,this.environmentIntensity=1,this.environmentRotation=new Yt,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){let t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}},Ps=class{constructor(e,t){this.isInterleavedBuffer=!0,this.array=e,this.stride=t,this.count=e!==void 0?e.length/t:0,this.usage=ja,this.updateRanges=[],this.version=0,this.uuid=Xn()}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.array=new e.array.constructor(e.array),this.count=e.count,this.stride=e.stride,this.usage=e.usage,this}copyAt(e,t,n){e*=this.stride,n*=t.stride;for(let i=0,r=this.stride;i<r;i++)this.array[e+i]=t.array[n+i];return this}set(e,t=0){return this.array.set(e,t),this}clone(e){e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let t=new this.array.constructor(e.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(t,this.stride);return n.setUsage(this.usage),n}onUpload(e){return this.onUploadCallback=e,this}toJSON(e){return e.arrayBuffers===void 0&&(e.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=Xn()),e.arrayBuffers[this.array.buffer._uuid]===void 0&&(e.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},sn=new w,Is=class s{constructor(e,t,n,i=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=e,this.itemSize=t,this.offset=n,this.normalized=i}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(e){this.data.needsUpdate=e}applyMatrix4(e){for(let t=0,n=this.data.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyMatrix4(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.applyNormalMatrix(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)sn.fromBufferAttribute(this,t),sn.transformDirection(e),this.setXYZ(t,sn.x,sn.y,sn.z);return this}getComponent(e,t){let n=this.array[e*this.data.stride+this.offset+t];return this.normalized&&(n=Vn(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=lt(n,this.array)),this.data.array[e*this.data.stride+this.offset+t]=n,this}setX(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset]=t,this}setY(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+1]=t,this}setZ(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+2]=t,this}setW(e,t){return this.normalized&&(t=lt(t,this.array)),this.data.array[e*this.data.stride+this.offset+3]=t,this}getX(e){let t=this.data.array[e*this.data.stride+this.offset];return this.normalized&&(t=Vn(t,this.array)),t}getY(e){let t=this.data.array[e*this.data.stride+this.offset+1];return this.normalized&&(t=Vn(t,this.array)),t}getZ(e){let t=this.data.array[e*this.data.stride+this.offset+2];return this.normalized&&(t=Vn(t,this.array)),t}getW(e){let t=this.data.array[e*this.data.stride+this.offset+3];return this.normalized&&(t=Vn(t,this.array)),t}setXY(e,t,n){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this}setXYZ(e,t,n,i){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),i=lt(i,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this}setXYZW(e,t,n,i,r){return e=e*this.data.stride+this.offset,this.normalized&&(t=lt(t,this.array),n=lt(n,this.array),i=lt(i,this.array),r=lt(r,this.array)),this.data.array[e+0]=t,this.data.array[e+1]=n,this.data.array[e+2]=i,this.data.array[e+3]=r,this}clone(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return new st(new this.array.constructor(t),this.itemSize,this.normalized)}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.clone(e)),new s(e.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(e){if(e===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let t=[];for(let n=0;n<this.count;n++){let i=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)t.push(this.data.array[i+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:t,normalized:this.normalized}}else return e.interleavedBuffers===void 0&&(e.interleavedBuffers={}),e.interleavedBuffers[this.data.uuid]===void 0&&(e.interleavedBuffers[this.data.uuid]=this.data.toJSON(e)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var bh=new w,Mh=new it,Sh=new it,Am=new w,Eh=new ke,ka=new w,tu=new dn,Ch=new ke,nu=new Qn,Po=class extends Ue{constructor(e,t){super(e,t),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=lu,this.bindMatrix=new ke,this.bindMatrixInverse=new ke,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let e=this.geometry;this.boundingBox===null&&(this.boundingBox=new Sn),this.boundingBox.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ka),this.boundingBox.expandByPoint(ka)}computeBoundingSphere(){let e=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new dn),this.boundingSphere.makeEmpty();let t=e.getAttribute("position");for(let n=0;n<t.count;n++)this.getVertexPosition(n,ka),this.boundingSphere.expandByPoint(ka)}copy(e,t){return super.copy(e,t),this.bindMode=e.bindMode,this.bindMatrix.copy(e.bindMatrix),this.bindMatrixInverse.copy(e.bindMatrixInverse),this.skeleton=e.skeleton,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}raycast(e,t){let n=this.material,i=this.matrixWorld;n!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),tu.copy(this.boundingSphere),tu.applyMatrix4(i),e.ray.intersectsSphere(tu)!==!1&&(Ch.copy(i).invert(),nu.copy(e.ray).applyMatrix4(Ch),!(this.boundingBox!==null&&nu.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(e,t,nu)))}getVertexPosition(e,t){return super.getVertexPosition(e,t),this.applyBoneTransform(e,t),t}bind(e,t){this.skeleton=e,t===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),t=this.matrixWorld),this.bindMatrix.copy(t),this.bindMatrixInverse.copy(t).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let e=new it,t=this.geometry.attributes.skinWeight;for(let n=0,i=t.count;n<i;n++){e.fromBufferAttribute(t,n);let r=1/e.manhattanLength();r!==1/0?e.multiplyScalar(r):e.set(1,0,0,0),t.setXYZW(n,e.x,e.y,e.z,e.w)}}updateMatrixWorld(e){super.updateMatrixWorld(e),this.bindMode===lu?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===vf?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(e,t){let n=this.skeleton,i=this.geometry;Mh.fromBufferAttribute(i.attributes.skinIndex,e),Sh.fromBufferAttribute(i.attributes.skinWeight,e),bh.copy(t).applyMatrix4(this.bindMatrix),t.set(0,0,0);for(let r=0;r<4;r++){let o=Sh.getComponent(r);if(o!==0){let l=Mh.getComponent(r);Eh.multiplyMatrices(n.bones[l].matrixWorld,n.boneInverses[l]),t.addScaledVector(Am.copy(bh).applyMatrix4(Eh),o)}}return t.applyMatrix4(this.bindMatrixInverse)}},Ds=class extends wt{constructor(){super(),this.isBone=!0,this.type="Bone"}},Io=class extends pn{constructor(e=null,t=1,n=1,i,r,o,l,u,d=Xt,a=Xt,c,h){super(null,o,l,u,d,a,i,r,c,h),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},wh=new ke,Rm=new ke,Do=class s{constructor(e=[],t=[]){this.uuid=Xn(),this.bones=e.slice(0),this.boneInverses=t,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let e=this.bones,t=this.boneInverses;if(this.boneMatrices=new Float32Array(e.length*16),t.length===0)this.calculateInverses();else if(e.length!==t.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let n=0,i=this.bones.length;n<i;n++)this.boneInverses.push(new ke)}}calculateInverses(){this.boneInverses.length=0;for(let e=0,t=this.bones.length;e<t;e++){let n=new ke;this.bones[e]&&n.copy(this.bones[e].matrixWorld).invert(),this.boneInverses.push(n)}}pose(){for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&n.matrixWorld.copy(this.boneInverses[e]).invert()}for(let e=0,t=this.bones.length;e<t;e++){let n=this.bones[e];n&&(n.parent&&n.parent.isBone?(n.matrix.copy(n.parent.matrixWorld).invert(),n.matrix.multiply(n.matrixWorld)):n.matrix.copy(n.matrixWorld),n.matrix.decompose(n.position,n.quaternion,n.scale))}}update(){let e=this.bones,t=this.boneInverses,n=this.boneMatrices,i=this.boneTexture;for(let r=0,o=e.length;r<o;r++){let l=e[r]?e[r].matrixWorld:Rm;wh.multiplyMatrices(l,t[r]),wh.toArray(n,r*16)}i!==null&&(i.needsUpdate=!0)}clone(){return new s(this.bones,this.boneInverses)}computeBoneTexture(){let e=Math.sqrt(this.bones.length*4);e=Math.ceil(e/4)*4,e=Math.max(e,4);let t=new Float32Array(e*e*4);t.set(this.boneMatrices);let n=new Io(t,e,e,Zt,On);return n.needsUpdate=!0,this.boneMatrices=t,this.boneTexture=n,this}getBoneByName(e){for(let t=0,n=this.bones.length;t<n;t++){let i=this.bones[t];if(i.name===e)return i}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(e,t){this.uuid=e.uuid;for(let n=0,i=e.bones.length;n<i;n++){let r=e.bones[n],o=t[r];o===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",r),o=new Ds),this.bones.push(o),this.boneInverses.push(new ke().fromArray(e.boneInverses[n]))}return this.init(),this}toJSON(){let e={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};e.uuid=this.uuid;let t=this.bones,n=this.boneInverses;for(let i=0,r=t.length;i<r;i++){let o=t[i];e.bones.push(o.uuid);let l=n[i];e.boneInverses.push(l.toArray())}return e}},ji=class extends st{constructor(e,t,n,i=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){let e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}},xs=new ke,Th=new ke,Fa=[],Ah=new Sn,Pm=new ke,mo=new Ue,go=new dn,Oo=class extends Ue{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new ji(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,Pm)}computeBoundingBox(){let e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new Sn),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,xs),Ah.copy(e.boundingBox).applyMatrix4(xs),this.boundingBox.union(Ah)}computeBoundingSphere(){let e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new dn),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,xs),go.copy(e.boundingSphere).applyMatrix4(xs),this.boundingSphere.union(go)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){let n=t.morphTargetInfluences,i=this.morphTexture.source.data.data,r=n.length+1,o=e*r+1;for(let l=0;l<n.length;l++)n[l]=i[o+l]}raycast(e,t){let n=this.matrixWorld,i=this.count;if(mo.geometry=this.geometry,mo.material=this.material,mo.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),go.copy(this.boundingSphere),go.applyMatrix4(n),e.ray.intersectsSphere(go)!==!1))for(let r=0;r<i;r++){this.getMatrixAt(r,xs),Th.multiplyMatrices(n,xs),mo.matrixWorld=Th,mo.raycast(e,Fa);for(let o=0,l=Fa.length;o<l;o++){let u=Fa[o];u.instanceId=r,u.object=this,t.push(u)}Fa.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new ji(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){let n=t.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Io(new Float32Array(i*this.count),i,this.count,El,On));let r=this.morphTexture.source.data.data,o=0;for(let d=0;d<n.length;d++)o+=n[d];let l=this.geometry.morphTargetsRelative?1:1-o,u=i*e;r[u]=l,r.set(n,u+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},iu=new w,Im=new w,Dm=new Ge,In=class{constructor(e=new w(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,i){return this.normal.set(e,t,n),this.constant=i,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){let i=iu.subVectors(n,t).cross(Im.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(i,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){let e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){let n=e.delta(iu),i=this.normal.dot(n);if(i===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;let r=-(e.start.dot(this.normal)+this.constant)/i;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){let t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){let n=t||Dm.getNormalMatrix(e),i=this.coplanarPoint(iu).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}},dr=new dn,Om=new Se(.5,.5),Ua=new w,Os=class{constructor(e=new In,t=new In,n=new In,i=new In,r=new In,o=new In){this.planes=[e,t,n,i,r,o]}set(e,t,n,i,r,o){let l=this.planes;return l[0].copy(e),l[1].copy(t),l[2].copy(n),l[3].copy(i),l[4].copy(r),l[5].copy(o),this}copy(e){let t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=Gn,n=!1){let i=this.planes,r=e.elements,o=r[0],l=r[1],u=r[2],d=r[3],a=r[4],c=r[5],h=r[6],f=r[7],g=r[8],_=r[9],m=r[10],p=r[11],b=r[12],M=r[13],y=r[14],T=r[15];if(i[0].setComponents(d-o,f-a,p-g,T-b).normalize(),i[1].setComponents(d+o,f+a,p+g,T+b).normalize(),i[2].setComponents(d+l,f+c,p+_,T+M).normalize(),i[3].setComponents(d-l,f-c,p-_,T-M).normalize(),n)i[4].setComponents(u,h,m,y).normalize(),i[5].setComponents(d-u,f-h,p-m,T-y).normalize();else if(i[4].setComponents(d-u,f-h,p-m,T-y).normalize(),t===Gn)i[5].setComponents(d+u,f+h,p+m,T+y).normalize();else if(t===So)i[5].setComponents(u,h,m,y).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),dr.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{let t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),dr.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(dr)}intersectsSprite(e){dr.center.set(0,0,0);let t=Om.distanceTo(e.center);return dr.radius=.7071067811865476+t,dr.applyMatrix4(e.matrixWorld),this.intersectsSphere(dr)}intersectsSphere(e){let t=this.planes,n=e.center,i=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<i)return!1;return!0}intersectsBox(e){let t=this.planes;for(let n=0;n<6;n++){let i=t[n];if(Ua.x=i.normal.x>0?e.max.x:e.min.x,Ua.y=i.normal.y>0?e.max.y:e.min.y,Ua.z=i.normal.z>0?e.max.z:e.min.z,i.distanceToPoint(Ua)<0)return!1}return!0}containsPoint(e){let t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var Zi=class extends qt{constructor(e){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new de(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.linewidth=e.linewidth,this.linecap=e.linecap,this.linejoin=e.linejoin,this.fog=e.fog,this}},el=new w,tl=new w,Rh=new ke,_o=new Qn,Ba=new dn,ru=new w,Ph=new w,xi=class extends wt{constructor(e=new Tt,t=new Zi){super(),this.isLine=!0,this.type="Line",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[0];for(let i=1,r=t.count;i<r;i++)el.fromBufferAttribute(t,i-1),tl.fromBufferAttribute(t,i),n[i]=n[i-1],n[i]+=el.distanceTo(tl);e.setAttribute("lineDistance",new Wt(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Line.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ba.copy(n.boundingSphere),Ba.applyMatrix4(i),Ba.radius+=r,e.ray.intersectsSphere(Ba)===!1)return;Rh.copy(i).invert(),_o.copy(e.ray).applyMatrix4(Rh);let l=r/((this.scale.x+this.scale.y+this.scale.z)/3),u=l*l,d=this.isLineSegments?2:1,a=n.index,h=n.attributes.position;if(a!==null){let f=Math.max(0,o.start),g=Math.min(a.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=d){let p=a.getX(_),b=a.getX(_+1),M=Ha(this,e,_o,u,p,b,_);M&&t.push(M)}if(this.isLineLoop){let _=a.getX(g-1),m=a.getX(f),p=Ha(this,e,_o,u,_,m,g-1);p&&t.push(p)}}else{let f=Math.max(0,o.start),g=Math.min(h.count,o.start+o.count);for(let _=f,m=g-1;_<m;_+=d){let p=Ha(this,e,_o,u,_,_+1,_);p&&t.push(p)}if(this.isLineLoop){let _=Ha(this,e,_o,u,g-1,f,g-1);_&&t.push(_)}}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let l=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}};function Ha(s,e,t,n,i,r,o){let l=s.geometry.attributes.position;if(el.fromBufferAttribute(l,i),tl.fromBufferAttribute(l,r),t.distanceSqToSegment(el,tl,ru,Ph)>n)return;ru.applyMatrix4(s.matrixWorld);let d=e.ray.origin.distanceTo(ru);if(!(d<e.near||d>e.far))return{distance:d,point:Ph.clone().applyMatrix4(s.matrixWorld),index:o,face:null,faceIndex:null,barycoord:null,object:s}}var Ih=new w,Dh=new w,Ls=class extends xi{constructor(e,t){super(e,t),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let e=this.geometry;if(e.index===null){let t=e.attributes.position,n=[];for(let i=0,r=t.count;i<r;i+=2)Ih.fromBufferAttribute(t,i),Dh.fromBufferAttribute(t,i+1),n[i]=i===0?0:n[i-1],n[i+1]=n[i]+Ih.distanceTo(Dh);e.setAttribute("lineDistance",new Wt(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Lo=class extends xi{constructor(e,t){super(e,t),this.isLineLoop=!0,this.type="LineLoop"}},Ns=class extends qt{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new de(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}},Oh=new ke,du=new Qn,za=new dn,Va=new w,No=class extends wt{constructor(e=new Tt,t=new Ns){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){let n=this.geometry,i=this.matrixWorld,r=e.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),za.copy(n.boundingSphere),za.applyMatrix4(i),za.radius+=r,e.ray.intersectsSphere(za)===!1)return;Oh.copy(i).invert(),du.copy(e.ray).applyMatrix4(Oh);let l=r/((this.scale.x+this.scale.y+this.scale.z)/3),u=l*l,d=n.index,c=n.attributes.position;if(d!==null){let h=Math.max(0,o.start),f=Math.min(d.count,o.start+o.count);for(let g=h,_=f;g<_;g++){let m=d.getX(g);Va.fromBufferAttribute(c,m),Lh(Va,m,u,i,e,t,this)}}else{let h=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=h,_=f;g<_;g++)Va.fromBufferAttribute(c,g),Lh(Va,g,u,i,e,t,this)}}updateMorphTargets(){let t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){let i=t[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,o=i.length;r<o;r++){let l=i[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[l]=r}}}}};function Lh(s,e,t,n,i,r,o){let l=du.distanceSqToPoint(s);if(l<t){let u=new w;du.closestPointToPoint(s,u),u.applyMatrix4(n);let d=i.ray.origin.distanceTo(u);if(d<i.near||d>i.far)return;r.push({distance:d,distanceToRay:Math.sqrt(l),point:u,index:e,face:null,faceIndex:null,barycoord:null,object:o})}}var ko=class extends pn{constructor(e,t,n,i,r=Dt,o=Dt,l,u,d){super(e,t,n,i,r,o,l,u,d),this.isVideoTexture=!0,this.generateMipmaps=!1,this._requestVideoFrameCallbackId=0;let a=this;function c(){a.needsUpdate=!0,a._requestVideoFrameCallbackId=e.requestVideoFrameCallback(c)}"requestVideoFrameCallback"in e&&(this._requestVideoFrameCallbackId=e.requestVideoFrameCallback(c))}clone(){return new this.constructor(this.image).copy(this)}update(){let e=this.image;"requestVideoFrameCallback"in e===!1&&e.readyState>=e.HAVE_CURRENT_DATA&&(this.needsUpdate=!0)}dispose(){this._requestVideoFrameCallbackId!==0&&this.source.data.cancelVideoFrameCallback(this._requestVideoFrameCallbackId),super.dispose()}};var Fo=class extends pn{constructor(e,t,n=Qi,i,r,o,l=Xt,u=Xt,d,a=Es,c=1){if(a!==Es&&a!==Vs)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let h={width:e,height:t,depth:c};super(h,i,r,o,l,u,a,n,d),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ws(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){let t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}};var zt=class s extends Tt{constructor(e=1,t=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:i};let r=e/2,o=t/2,l=Math.floor(n),u=Math.floor(i),d=l+1,a=u+1,c=e/l,h=t/u,f=[],g=[],_=[],m=[];for(let p=0;p<a;p++){let b=p*h-o;for(let M=0;M<d;M++){let y=M*c-r;g.push(y,-b,0),_.push(0,0,1),m.push(M/l),m.push(1-p/u)}}for(let p=0;p<u;p++)for(let b=0;b<l;b++){let M=b+d*p,y=b+d*(p+1),T=b+1+d*(p+1),P=b+1+d*p;f.push(M,y,P),f.push(y,T,P)}this.setIndex(f),this.setAttribute("position",new Wt(g,3)),this.setAttribute("normal",new Wt(_,3)),this.setAttribute("uv",new Wt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new s(e.width,e.height,e.widthSegments,e.heightSegments)}};var br=class extends qt{constructor(e){super(),this.isShadowMaterial=!0,this.type="ShadowMaterial",this.color=new de(0),this.transparent=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.fog=e.fog,this}};var Mr=class extends qt{constructor(e){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new de(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new de(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Iu,this.normalScale=new Se(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new Yt,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.defines={STANDARD:""},this.color.copy(e.color),this.roughness=e.roughness,this.metalness=e.metalness,this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.roughnessMap=e.roughnessMap,this.metalnessMap=e.metalnessMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.envMapIntensity=e.envMapIntensity,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}},hn=class extends Mr{constructor(e){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new Se(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return qe(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(t){this.ior=(1+.4*t)/(1-.4*t)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new de(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new de(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new de(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(e)}get anisotropy(){return this._anisotropy}set anisotropy(e){this._anisotropy>0!=e>0&&this.version++,this._anisotropy=e}get clearcoat(){return this._clearcoat}set clearcoat(e){this._clearcoat>0!=e>0&&this.version++,this._clearcoat=e}get iridescence(){return this._iridescence}set iridescence(e){this._iridescence>0!=e>0&&this.version++,this._iridescence=e}get dispersion(){return this._dispersion}set dispersion(e){this._dispersion>0!=e>0&&this.version++,this._dispersion=e}get sheen(){return this._sheen}set sheen(e){this._sheen>0!=e>0&&this.version++,this._sheen=e}get transmission(){return this._transmission}set transmission(e){this._transmission>0!=e>0&&this.version++,this._transmission=e}copy(e){return super.copy(e),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=e.anisotropy,this.anisotropyRotation=e.anisotropyRotation,this.anisotropyMap=e.anisotropyMap,this.clearcoat=e.clearcoat,this.clearcoatMap=e.clearcoatMap,this.clearcoatRoughness=e.clearcoatRoughness,this.clearcoatRoughnessMap=e.clearcoatRoughnessMap,this.clearcoatNormalMap=e.clearcoatNormalMap,this.clearcoatNormalScale.copy(e.clearcoatNormalScale),this.dispersion=e.dispersion,this.ior=e.ior,this.iridescence=e.iridescence,this.iridescenceMap=e.iridescenceMap,this.iridescenceIOR=e.iridescenceIOR,this.iridescenceThicknessRange=[...e.iridescenceThicknessRange],this.iridescenceThicknessMap=e.iridescenceThicknessMap,this.sheen=e.sheen,this.sheenColor.copy(e.sheenColor),this.sheenColorMap=e.sheenColorMap,this.sheenRoughness=e.sheenRoughness,this.sheenRoughnessMap=e.sheenRoughnessMap,this.transmission=e.transmission,this.transmissionMap=e.transmissionMap,this.thickness=e.thickness,this.thicknessMap=e.thicknessMap,this.attenuationDistance=e.attenuationDistance,this.attenuationColor.copy(e.attenuationColor),this.specularIntensity=e.specularIntensity,this.specularIntensityMap=e.specularIntensityMap,this.specularColor.copy(e.specularColor),this.specularColorMap=e.specularColorMap,this}};var nl=class extends qt{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Mf,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}},il=class extends qt{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}};function Ga(s,e){return!s||s.constructor===e?s:typeof e.BYTES_PER_ELEMENT=="number"?new e(s):Array.prototype.slice.call(s)}function Lm(s){return ArrayBuffer.isView(s)&&!(s instanceof DataView)}function Nm(s){function e(i,r){return s[i]-s[r]}let t=s.length,n=new Array(t);for(let i=0;i!==t;++i)n[i]=i;return n.sort(e),n}function Nh(s,e,t){let n=s.length,i=new s.constructor(n);for(let r=0,o=0;o!==n;++r){let l=t[r]*e;for(let u=0;u!==e;++u)i[o++]=s[l+u]}return i}function kf(s,e,t,n){let i=1,r=s[0];for(;r!==void 0&&r[n]===void 0;)r=s[i++];if(r===void 0)return;let o=r[n];if(o!==void 0)if(Array.isArray(o))do o=r[n],o!==void 0&&(e.push(r.time),t.push(...o)),r=s[i++];while(r!==void 0);else if(o.toArray!==void 0)do o=r[n],o!==void 0&&(e.push(r.time),o.toArray(t,t.length)),r=s[i++];while(r!==void 0);else do o=r[n],o!==void 0&&(e.push(r.time),t.push(o)),r=s[i++];while(r!==void 0)}var bi=class{constructor(e,t,n,i){this.parameterPositions=e,this._cachedIndex=0,this.resultBuffer=i!==void 0?i:new t.constructor(n),this.sampleValues=t,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(e){let t=this.parameterPositions,n=this._cachedIndex,i=t[n],r=t[n-1];e:{t:{let o;n:{i:if(!(e<i)){for(let l=n+2;;){if(i===void 0){if(e<r)break i;return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===l)break;if(r=i,i=t[++n],e<i)break t}o=t.length;break n}if(!(e>=r)){let l=t[1];e<l&&(n=2,r=l);for(let u=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===u)break;if(i=r,r=t[--n-1],e>=r)break t}o=n,n=0;break n}break e}for(;n<o;){let l=n+o>>>1;e<t[l]?o=l:n=l+1}if(i=t[n],r=t[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(i===void 0)return n=t.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,i)}return this.interpolate_(n,r,e,i)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i;for(let o=0;o!==i;++o)t[o]=n[r+o];return t}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},rl=class extends bi{constructor(e,t,n,i){super(e,t,n,i),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:fr,endingEnd:fr}}intervalChanged_(e,t,n){let i=this.parameterPositions,r=e-2,o=e+1,l=i[r],u=i[o];if(l===void 0)switch(this.getSettings_().endingStart){case pr:r=e,l=2*t-n;break;case bo:r=i.length-2,l=t+i[r]-i[r+1];break;default:r=e,l=n}if(u===void 0)switch(this.getSettings_().endingEnd){case pr:o=e,u=2*n-t;break;case bo:o=1,u=n+i[1]-i[0];break;default:o=e-1,u=t}let d=(n-t)*.5,a=this.valueSize;this._weightPrev=d/(t-l),this._weightNext=d/(u-n),this._offsetPrev=r*a,this._offsetNext=o*a}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,l=this.valueSize,u=e*l,d=u-l,a=this._offsetPrev,c=this._offsetNext,h=this._weightPrev,f=this._weightNext,g=(n-t)/(i-t),_=g*g,m=_*g,p=-h*m+2*h*_-h*g,b=(1+h)*m+(-1.5-2*h)*_+(-.5+h)*g+1,M=(-1-f)*m+(1.5+f)*_+.5*g,y=f*m-f*_;for(let T=0;T!==l;++T)r[T]=p*o[a+T]+b*o[d+T]+M*o[u+T]+y*o[c+T];return r}},Uo=class extends bi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,l=this.valueSize,u=e*l,d=u-l,a=(n-t)/(i-t),c=1-a;for(let h=0;h!==l;++h)r[h]=o[d+h]*c+o[u+h]*a;return r}},sl=class extends bi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e){return this.copySampleValue_(e-1)}},fn=class{constructor(e,t,n,i){if(e===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(t===void 0||t.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+e);this.name=e,this.times=Ga(t,this.TimeBufferType),this.values=Ga(n,this.ValueBufferType),this.setInterpolation(i||this.DefaultInterpolation)}static toJSON(e){let t=e.constructor,n;if(t.toJSON!==this.toJSON)n=t.toJSON(e);else{n={name:e.name,times:Ga(e.times,Array),values:Ga(e.values,Array)};let i=e.getInterpolation();i!==e.DefaultInterpolation&&(n.interpolation=i)}return n.type=e.ValueTypeName,n}InterpolantFactoryMethodDiscrete(e){return new sl(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodLinear(e){return new Uo(this.times,this.values,this.getValueSize(),e)}InterpolantFactoryMethodSmooth(e){return new rl(this.times,this.values,this.getValueSize(),e)}setInterpolation(e){let t;switch(e){case _r:t=this.InterpolantFactoryMethodDiscrete;break;case vr:t=this.InterpolantFactoryMethodLinear;break;case Xa:t=this.InterpolantFactoryMethodSmooth;break}if(t===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(e!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=t,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return _r;case this.InterpolantFactoryMethodLinear:return vr;case this.InterpolantFactoryMethodSmooth:return Xa}}getValueSize(){return this.values.length/this.times.length}shift(e){if(e!==0){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]+=e}return this}scale(e){if(e!==1){let t=this.times;for(let n=0,i=t.length;n!==i;++n)t[n]*=e}return this}trim(e,t){let n=this.times,i=n.length,r=0,o=i-1;for(;r!==i&&n[r]<e;)++r;for(;o!==-1&&n[o]>t;)--o;if(++o,r!==0||o!==i){r>=o&&(o=Math.max(o,1),r=o-1);let l=this.getValueSize();this.times=n.slice(r,o),this.values=this.values.slice(r*l,o*l)}return this}validate(){let e=!0,t=this.getValueSize();t-Math.floor(t)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),e=!1);let n=this.times,i=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),e=!1);let o=null;for(let l=0;l!==r;l++){let u=n[l];if(typeof u=="number"&&isNaN(u)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,l,u),e=!1;break}if(o!==null&&o>u){console.error("THREE.KeyframeTrack: Out of order keys.",this,l,u,o),e=!1;break}o=u}if(i!==void 0&&Lm(i))for(let l=0,u=i.length;l!==u;++l){let d=i[l];if(isNaN(d)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,l,d),e=!1;break}}return e}optimize(){let e=this.times.slice(),t=this.values.slice(),n=this.getValueSize(),i=this.getInterpolation()===Xa,r=e.length-1,o=1;for(let l=1;l<r;++l){let u=!1,d=e[l],a=e[l+1];if(d!==a&&(l!==1||d!==e[0]))if(i)u=!0;else{let c=l*n,h=c-n,f=c+n;for(let g=0;g!==n;++g){let _=t[c+g];if(_!==t[h+g]||_!==t[f+g]){u=!0;break}}}if(u){if(l!==o){e[o]=e[l];let c=l*n,h=o*n;for(let f=0;f!==n;++f)t[h+f]=t[c+f]}++o}}if(r>0){e[o]=e[r];for(let l=r*n,u=o*n,d=0;d!==n;++d)t[u+d]=t[l+d];++o}return o!==e.length?(this.times=e.slice(0,o),this.values=t.slice(0,o*n)):(this.times=e,this.values=t),this}clone(){let e=this.times.slice(),t=this.values.slice(),n=this.constructor,i=new n(this.name,e,t);return i.createInterpolant=this.createInterpolant,i}};fn.prototype.ValueTypeName="";fn.prototype.TimeBufferType=Float32Array;fn.prototype.ValueBufferType=Float32Array;fn.prototype.DefaultInterpolation=vr;var Mi=class extends fn{constructor(e,t,n){super(e,t,n)}};Mi.prototype.ValueTypeName="bool";Mi.prototype.ValueBufferType=Array;Mi.prototype.DefaultInterpolation=_r;Mi.prototype.InterpolantFactoryMethodLinear=void 0;Mi.prototype.InterpolantFactoryMethodSmooth=void 0;var Bo=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}};Bo.prototype.ValueTypeName="color";var ei=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}};ei.prototype.ValueTypeName="number";var ol=class extends bi{constructor(e,t,n,i){super(e,t,n,i)}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,l=this.valueSize,u=(n-t)/(i-t),d=e*l;for(let a=d+l;d!==a;d+=4)ft.slerpFlat(r,0,o,d-l,o,d,u);return r}},ti=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}InterpolantFactoryMethodLinear(e){return new ol(this.times,this.values,this.getValueSize(),e)}};ti.prototype.ValueTypeName="quaternion";ti.prototype.InterpolantFactoryMethodSmooth=void 0;var Si=class extends fn{constructor(e,t,n){super(e,t,n)}};Si.prototype.ValueTypeName="string";Si.prototype.ValueBufferType=Array;Si.prototype.DefaultInterpolation=_r;Si.prototype.InterpolantFactoryMethodLinear=void 0;Si.prototype.InterpolantFactoryMethodSmooth=void 0;var ni=class extends fn{constructor(e,t,n,i){super(e,t,n,i)}};ni.prototype.ValueTypeName="vector";var Sr=class{constructor(e="",t=-1,n=[],i=ec){this.name=e,this.tracks=n,this.duration=t,this.blendMode=i,this.uuid=Xn(),this.duration<0&&this.resetDuration()}static parse(e){let t=[],n=e.tracks,i=1/(e.fps||1);for(let o=0,l=n.length;o!==l;++o)t.push(Fm(n[o]).scale(i));let r=new this(e.name,e.duration,t,e.blendMode);return r.uuid=e.uuid,r}static toJSON(e){let t=[],n=e.tracks,i={name:e.name,duration:e.duration,tracks:t,uuid:e.uuid,blendMode:e.blendMode};for(let r=0,o=n.length;r!==o;++r)t.push(fn.toJSON(n[r]));return i}static CreateFromMorphTargetSequence(e,t,n,i){let r=t.length,o=[];for(let l=0;l<r;l++){let u=[],d=[];u.push((l+r-1)%r,l,(l+1)%r),d.push(0,1,0);let a=Nm(u);u=Nh(u,1,a),d=Nh(d,1,a),!i&&u[0]===0&&(u.push(r),d.push(d[0])),o.push(new ei(".morphTargetInfluences["+t[l].name+"]",u,d).scale(1/n))}return new this(e,-1,o)}static findByName(e,t){let n=e;if(!Array.isArray(e)){let i=e;n=i.geometry&&i.geometry.animations||i.animations}for(let i=0;i<n.length;i++)if(n[i].name===t)return n[i];return null}static CreateClipsFromMorphTargetSequences(e,t,n){let i={},r=/^([\w-]*?)([\d]+)$/;for(let l=0,u=e.length;l<u;l++){let d=e[l],a=d.name.match(r);if(a&&a.length>1){let c=a[1],h=i[c];h||(i[c]=h=[]),h.push(d)}}let o=[];for(let l in i)o.push(this.CreateFromMorphTargetSequence(l,i[l],t,n));return o}static parseAnimation(e,t){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!e)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let n=function(c,h,f,g,_){if(f.length!==0){let m=[],p=[];kf(f,m,p,g),m.length!==0&&_.push(new c(h,m,p))}},i=[],r=e.name||"default",o=e.fps||30,l=e.blendMode,u=e.length||-1,d=e.hierarchy||[];for(let c=0;c<d.length;c++){let h=d[c].keys;if(!(!h||h.length===0))if(h[0].morphTargets){let f={},g;for(g=0;g<h.length;g++)if(h[g].morphTargets)for(let _=0;_<h[g].morphTargets.length;_++)f[h[g].morphTargets[_]]=-1;for(let _ in f){let m=[],p=[];for(let b=0;b!==h[g].morphTargets.length;++b){let M=h[g];m.push(M.time),p.push(M.morphTarget===_?1:0)}i.push(new ei(".morphTargetInfluence["+_+"]",m,p))}u=f.length*o}else{let f=".bones["+t[c].name+"]";n(ni,f+".position",h,"pos",i),n(ti,f+".quaternion",h,"rot",i),n(ni,f+".scale",h,"scl",i)}}return i.length===0?null:new this(r,u,i,l)}resetDuration(){let e=this.tracks,t=0;for(let n=0,i=e.length;n!==i;++n){let r=this.tracks[n];t=Math.max(t,r.times[r.times.length-1])}return this.duration=t,this}trim(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].trim(0,this.duration);return this}validate(){let e=!0;for(let t=0;t<this.tracks.length;t++)e=e&&this.tracks[t].validate();return e}optimize(){for(let e=0;e<this.tracks.length;e++)this.tracks[e].optimize();return this}clone(){let e=[];for(let t=0;t<this.tracks.length;t++)e.push(this.tracks[t].clone());return new this.constructor(this.name,this.duration,e,this.blendMode)}toJSON(){return this.constructor.toJSON(this)}};function km(s){switch(s.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return ei;case"vector":case"vector2":case"vector3":case"vector4":return ni;case"color":return Bo;case"quaternion":return ti;case"bool":case"boolean":return Mi;case"string":return Si}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+s)}function Fm(s){if(s.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let e=km(s.type);if(s.times===void 0){let t=[],n=[];kf(s.keys,t,n,"value"),s.times=t,s.values=n}return e.parse!==void 0?e.parse(s):new e(s.name,s.times,s.values,s.interpolation)}var Jn={enabled:!1,files:{},add:function(s,e){this.enabled!==!1&&(this.files[s]=e)},get:function(s){if(this.enabled!==!1)return this.files[s]},remove:function(s){delete this.files[s]},clear:function(){this.files={}}},al=class{constructor(e,t,n){let i=this,r=!1,o=0,l=0,u,d=[];this.onStart=void 0,this.onLoad=e,this.onProgress=t,this.onError=n,this.abortController=new AbortController,this.itemStart=function(a){l++,r===!1&&i.onStart!==void 0&&i.onStart(a,o,l),r=!0},this.itemEnd=function(a){o++,i.onProgress!==void 0&&i.onProgress(a,o,l),o===l&&(r=!1,i.onLoad!==void 0&&i.onLoad())},this.itemError=function(a){i.onError!==void 0&&i.onError(a)},this.resolveURL=function(a){return u?u(a):a},this.setURLModifier=function(a){return u=a,this},this.addHandler=function(a,c){return d.push(a,c),this},this.removeHandler=function(a){let c=d.indexOf(a);return c!==-1&&d.splice(c,2),this},this.getHandler=function(a){for(let c=0,h=d.length;c<h;c+=2){let f=d[c],g=d[c+1];if(f.global&&(f.lastIndex=0),f.test(a))return g}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},Ff=new al,Pi=(()=>{class s{constructor(t){this.manager=t!==void 0?t:Ff,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,n){let i=this;return new Promise(function(r,o){i.load(t,r,n,o)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}abort(){return this}}return s.DEFAULT_MATERIAL_NAME="__DEFAULT",s})(),_i={},hu=class extends Error{constructor(e,t){super(e),this.response=t}},Ei=class extends Pi{constructor(e){super(e),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=Jn.get(`file:${e}`);if(r!==void 0)return this.manager.itemStart(e),setTimeout(()=>{t&&t(r),this.manager.itemEnd(e)},0),r;if(_i[e]!==void 0){_i[e].push({onLoad:t,onProgress:n,onError:i});return}_i[e]=[],_i[e].push({onLoad:t,onProgress:n,onError:i});let o=new Request(e,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),l=this.mimeType,u=this.responseType;fetch(o).then(d=>{if(d.status===200||d.status===0){if(d.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||d.body===void 0||d.body.getReader===void 0)return d;let a=_i[e],c=d.body.getReader(),h=d.headers.get("X-File-Size")||d.headers.get("Content-Length"),f=h?parseInt(h):0,g=f!==0,_=0,m=new ReadableStream({start(p){b();function b(){c.read().then(({done:M,value:y})=>{if(M)p.close();else{_+=y.byteLength;let T=new ProgressEvent("progress",{lengthComputable:g,loaded:_,total:f});for(let P=0,A=a.length;P<A;P++){let D=a[P];D.onProgress&&D.onProgress(T)}p.enqueue(y),b()}},M=>{p.error(M)})}}});return new Response(m)}else throw new hu(`fetch for "${d.url}" responded with ${d.status}: ${d.statusText}`,d)}).then(d=>{switch(u){case"arraybuffer":return d.arrayBuffer();case"blob":return d.blob();case"document":return d.text().then(a=>new DOMParser().parseFromString(a,l));case"json":return d.json();default:if(l==="")return d.text();{let c=/charset="?([^;"\s]*)"?/i.exec(l),h=c&&c[1]?c[1].toLowerCase():void 0,f=new TextDecoder(h);return d.arrayBuffer().then(g=>f.decode(g))}}}).then(d=>{Jn.add(`file:${e}`,d);let a=_i[e];delete _i[e];for(let c=0,h=a.length;c<h;c++){let f=a[c];f.onLoad&&f.onLoad(d)}}).catch(d=>{let a=_i[e];if(a===void 0)throw this.manager.itemError(e),d;delete _i[e];for(let c=0,h=a.length;c<h;c++){let f=a[c];f.onError&&f.onError(d)}this.manager.itemError(e)}).finally(()=>{this.manager.itemEnd(e)}),this.manager.itemStart(e)}setResponseType(e){return this.responseType=e,this}setMimeType(e){return this.mimeType=e,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var bs=new WeakMap,ll=class extends Pi{constructor(e){super(e)}load(e,t,n,i){this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Jn.get(`image:${e}`);if(o!==void 0){if(o.complete===!0)r.manager.itemStart(e),setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0);else{let c=bs.get(o);c===void 0&&(c=[],bs.set(o,c)),c.push({onLoad:t,onError:i})}return o}let l=Cs("img");function u(){a(),t&&t(this);let c=bs.get(this)||[];for(let h=0;h<c.length;h++){let f=c[h];f.onLoad&&f.onLoad(this)}bs.delete(this),r.manager.itemEnd(e)}function d(c){a(),i&&i(c),Jn.remove(`image:${e}`);let h=bs.get(this)||[];for(let f=0;f<h.length;f++){let g=h[f];g.onError&&g.onError(c)}bs.delete(this),r.manager.itemError(e),r.manager.itemEnd(e)}function a(){l.removeEventListener("load",u,!1),l.removeEventListener("error",d,!1)}return l.addEventListener("load",u,!1),l.addEventListener("error",d,!1),e.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(l.crossOrigin=this.crossOrigin),Jn.add(`image:${e}`,l),r.manager.itemStart(e),l.src=e,l}};var Er=class extends Pi{constructor(e){super(e)}load(e,t,n,i){let r=new pn,o=new ll(this.manager);return o.setCrossOrigin(this.crossOrigin),o.setPath(this.path),o.load(e,function(l){r.image=l,r.needsUpdate=!0,t!==void 0&&t(r)},n,i),r}},Cr=class extends wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new de(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){let t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}};var su=new ke,kh=new w,Fh=new w,Ho=class{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Se(512,512),this.mapType=an,this.map=null,this.mapPass=null,this.matrix=new ke,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Os,this._frameExtents=new Se(1,1),this._viewportCount=1,this._viewports=[new it(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){let t=this.camera,n=this.matrix;kh.setFromMatrixPosition(e.matrixWorld),t.position.copy(kh),Fh.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(Fh),t.updateMatrixWorld(),su.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(su,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(su)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}},fu=class extends Ho{constructor(){super(new It(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(e){let t=this.camera,n=yr*2*e.angle*this.focus,i=this.mapSize.width/this.mapSize.height*this.aspect,r=e.distance||t.far;(n!==t.fov||i!==t.aspect||r!==t.far)&&(t.fov=n,t.aspect=i,t.far=r,t.updateProjectionMatrix()),super.updateMatrices(e)}copy(e){return super.copy(e),this.focus=e.focus,this}},zo=class extends Cr{constructor(e,t,n=0,i=Math.PI/3,r=0,o=2){super(e,t),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.distance=n,this.angle=i,this.penumbra=r,this.decay=o,this.map=null,this.shadow=new fu}get power(){return this.intensity*Math.PI}set power(e){this.intensity=e/Math.PI}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.angle=e.angle,this.penumbra=e.penumbra,this.decay=e.decay,this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Uh=new ke,vo=new w,ou=new w,pu=class extends Ho{constructor(){super(new It(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new Se(4,2),this._viewportCount=6,this._viewports=[new it(2,1,1,1),new it(0,1,1,1),new it(3,1,1,1),new it(1,1,1,1),new it(3,0,1,1),new it(1,0,1,1)],this._cubeDirections=[new w(1,0,0),new w(-1,0,0),new w(0,0,1),new w(0,0,-1),new w(0,1,0),new w(0,-1,0)],this._cubeUps=[new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,1,0),new w(0,0,1),new w(0,0,-1)]}updateMatrices(e,t=0){let n=this.camera,i=this.matrix,r=e.distance||n.far;r!==n.far&&(n.far=r,n.updateProjectionMatrix()),vo.setFromMatrixPosition(e.matrixWorld),n.position.copy(vo),ou.copy(n.position),ou.add(this._cubeDirections[t]),n.up.copy(this._cubeUps[t]),n.lookAt(ou),n.updateMatrixWorld(),i.makeTranslation(-vo.x,-vo.y,-vo.z),Uh.multiplyMatrices(n.projectionMatrix,n.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Uh,n.coordinateSystem,n.reversedDepth)}},Vo=class extends Cr{constructor(e,t,n=0,i=2){super(e,t),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new pu}get power(){return this.intensity*4*Math.PI}set power(e){this.intensity=e/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(e,t){return super.copy(e,t),this.distance=e.distance,this.decay=e.decay,this.shadow=e.shadow.clone(),this}},qn=class extends To{constructor(e=-1,t=1,n=1,i=-1,r=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=i,this.near=r,this.far=o,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,i,r,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=i,this.view.width=r,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2,r=n-e,o=n+e,l=i+t,u=i-t;if(this.view!==null&&this.view.enabled){let d=(this.right-this.left)/this.view.fullWidth/this.zoom,a=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=d*this.view.offsetX,o=r+d*this.view.width,l-=a*this.view.offsetY,u=l-a*this.view.height}this.projectionMatrix.makeOrthographic(r,o,l,u,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){let t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}},mu=class extends Ho{constructor(){super(new qn(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ci=class extends Cr{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.shadow=new mu}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}},Go=class extends Cr{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}};var wi=class{static extractUrlBase(e){let t=e.lastIndexOf("/");return t===-1?"./":e.slice(0,t+1)}static resolveURL(e,t){return typeof e!="string"||e===""?"":(/^https?:\/\//i.test(t)&&/^\//.test(e)&&(t=t.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(e)||/^data:.*,.*$/i.test(e)||/^blob:.*$/i.test(e)?e:t+e)}};var au=new WeakMap,Wo=class extends Pi{constructor(e){super(e),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(e){return this.options=e,this}load(e,t,n,i){e===void 0&&(e=""),this.path!==void 0&&(e=this.path+e),e=this.manager.resolveURL(e);let r=this,o=Jn.get(`image-bitmap:${e}`);if(o!==void 0){if(r.manager.itemStart(e),o.then){o.then(d=>{if(au.has(o)===!0)i&&i(au.get(o)),r.manager.itemError(e),r.manager.itemEnd(e);else return t&&t(d),r.manager.itemEnd(e),d});return}return setTimeout(function(){t&&t(o),r.manager.itemEnd(e)},0),o}let l={};l.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",l.headers=this.requestHeader,l.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let u=fetch(e,l).then(function(d){return d.blob()}).then(function(d){return createImageBitmap(d,Object.assign(r.options,{colorSpaceConversion:"none"}))}).then(function(d){return Jn.add(`image-bitmap:${e}`,d),t&&t(d),r.manager.itemEnd(e),d}).catch(function(d){i&&i(d),au.set(u,d),Jn.remove(`image-bitmap:${e}`),r.manager.itemError(e),r.manager.itemEnd(e)});Jn.add(`image-bitmap:${e}`,u),r.manager.itemStart(e)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var cl=class extends It{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}},on=class{constructor(e=!0){this.autoStart=e,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let e=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let t=performance.now();e=(t-this.oldTime)/1e3,this.oldTime=t,this.elapsedTime+=e}return e}};var ul=class{constructor(e,t,n){this.binding=e,this.valueSize=n;let i,r,o;switch(t){case"quaternion":i=this._slerp,r=this._slerpAdditive,o=this._setAdditiveIdentityQuaternion,this.buffer=new Float64Array(n*6),this._workIndex=5;break;case"string":case"bool":i=this._select,r=this._select,o=this._setAdditiveIdentityOther,this.buffer=new Array(n*5);break;default:i=this._lerp,r=this._lerpAdditive,o=this._setAdditiveIdentityNumeric,this.buffer=new Float64Array(n*5)}this._mixBufferRegion=i,this._mixBufferRegionAdditive=r,this._setIdentity=o,this._origIndex=3,this._addIndex=4,this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,this.useCount=0,this.referenceCount=0}accumulate(e,t){let n=this.buffer,i=this.valueSize,r=e*i+i,o=this.cumulativeWeight;if(o===0){for(let l=0;l!==i;++l)n[r+l]=n[l];o=t}else{o+=t;let l=t/o;this._mixBufferRegion(n,r,0,l,i)}this.cumulativeWeight=o}accumulateAdditive(e){let t=this.buffer,n=this.valueSize,i=n*this._addIndex;this.cumulativeWeightAdditive===0&&this._setIdentity(),this._mixBufferRegionAdditive(t,i,0,e,n),this.cumulativeWeightAdditive+=e}apply(e){let t=this.valueSize,n=this.buffer,i=e*t+t,r=this.cumulativeWeight,o=this.cumulativeWeightAdditive,l=this.binding;if(this.cumulativeWeight=0,this.cumulativeWeightAdditive=0,r<1){let u=t*this._origIndex;this._mixBufferRegion(n,i,u,1-r,t)}o>0&&this._mixBufferRegionAdditive(n,i,this._addIndex*t,1,t);for(let u=t,d=t+t;u!==d;++u)if(n[u]!==n[u+t]){l.setValue(n,i);break}}saveOriginalState(){let e=this.binding,t=this.buffer,n=this.valueSize,i=n*this._origIndex;e.getValue(t,i);for(let r=n,o=i;r!==o;++r)t[r]=t[i+r%n];this._setIdentity(),this.cumulativeWeight=0,this.cumulativeWeightAdditive=0}restoreOriginalState(){let e=this.valueSize*3;this.binding.setValue(this.buffer,e)}_setAdditiveIdentityNumeric(){let e=this._addIndex*this.valueSize,t=e+this.valueSize;for(let n=e;n<t;n++)this.buffer[n]=0}_setAdditiveIdentityQuaternion(){this._setAdditiveIdentityNumeric(),this.buffer[this._addIndex*this.valueSize+3]=1}_setAdditiveIdentityOther(){let e=this._origIndex*this.valueSize,t=this._addIndex*this.valueSize;for(let n=0;n<this.valueSize;n++)this.buffer[t+n]=this.buffer[e+n]}_select(e,t,n,i,r){if(i>=.5)for(let o=0;o!==r;++o)e[t+o]=e[n+o]}_slerp(e,t,n,i){ft.slerpFlat(e,t,e,t,e,n,i)}_slerpAdditive(e,t,n,i,r){let o=this._workIndex*r;ft.multiplyQuaternionsFlat(e,o,e,t,e,n),ft.slerpFlat(e,t,e,t,e,o,i)}_lerp(e,t,n,i,r){let o=1-i;for(let l=0;l!==r;++l){let u=t+l;e[u]=e[u]*o+e[n+l]*i}}_lerpAdditive(e,t,n,i,r){for(let o=0;o!==r;++o){let l=t+o;e[l]=e[l]+e[n+o]*i}}},Fu="\\[\\]\\.:\\/",Um=new RegExp("["+Fu+"]","g"),Uu="[^"+Fu+"]",Bm="[^"+Fu.replace("\\.","")+"]",Hm=/((?:WC+[\/:])*)/.source.replace("WC",Uu),zm=/(WCOD+)?/.source.replace("WCOD",Bm),Vm=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Uu),Gm=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Uu),Wm=new RegExp("^"+Hm+zm+Vm+Gm+"$"),Xm=["material","materials","bones","map"],gu=class{constructor(e,t,n){let i=n||yt.parseTrackName(t);this._targetGroup=e,this._bindings=e.subscribe_(t,i)}getValue(e,t){this.bind();let n=this._targetGroup.nCachedObjects_,i=this._bindings[n];i!==void 0&&i.getValue(e,t)}setValue(e,t){let n=this._bindings;for(let i=this._targetGroup.nCachedObjects_,r=n.length;i!==r;++i)n[i].setValue(e,t)}bind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].bind()}unbind(){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,n=e.length;t!==n;++t)e[t].unbind()}},yt=(()=>{class s{constructor(t,n,i){this.path=n,this.parsedPath=i||s.parseTrackName(n),this.node=s.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,n,i){return t&&t.isAnimationObjectGroup?new s.Composite(t,n,i):new s(t,n,i)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Um,"")}static parseTrackName(t){let n=Wm.exec(t);if(n===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let i={nodeName:n[2],objectName:n[3],objectIndex:n[4],propertyName:n[5],propertyIndex:n[6]},r=i.nodeName&&i.nodeName.lastIndexOf(".");if(r!==void 0&&r!==-1){let o=i.nodeName.substring(r+1);Xm.indexOf(o)!==-1&&(i.nodeName=i.nodeName.substring(0,r),i.objectName=o)}if(i.propertyName===null||i.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return i}static findNode(t,n){if(n===void 0||n===""||n==="."||n===-1||n===t.name||n===t.uuid)return t;if(t.skeleton){let i=t.skeleton.getBoneByName(n);if(i!==void 0)return i}if(t.children){let i=function(o){for(let l=0;l<o.length;l++){let u=o[l];if(u.name===n||u.uuid===n)return u;let d=i(u.children);if(d)return d}return null},r=i(t.children);if(r)return r}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,n){t[n]=this.targetObject[this.propertyName]}_getValue_array(t,n){let i=this.resolvedProperty;for(let r=0,o=i.length;r!==o;++r)t[n++]=i[r]}_getValue_arrayElement(t,n){t[n]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,n){this.resolvedProperty.toArray(t,n)}_setValue_direct(t,n){this.targetObject[this.propertyName]=t[n]}_setValue_direct_setNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,n){this.targetObject[this.propertyName]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,n){let i=this.resolvedProperty;for(let r=0,o=i.length;r!==o;++r)i[r]=t[n++]}_setValue_array_setNeedsUpdate(t,n){let i=this.resolvedProperty;for(let r=0,o=i.length;r!==o;++r)i[r]=t[n++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,n){let i=this.resolvedProperty;for(let r=0,o=i.length;r!==o;++r)i[r]=t[n++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,n){this.resolvedProperty[this.propertyIndex]=t[n]}_setValue_arrayElement_setNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty[this.propertyIndex]=t[n],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,n){this.resolvedProperty.fromArray(t,n)}_setValue_fromArray_setNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,n){this.resolvedProperty.fromArray(t,n),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,n){this.bind(),this.getValue(t,n)}_setValue_unbound(t,n){this.bind(),this.setValue(t,n)}bind(){let t=this.node,n=this.parsedPath,i=n.objectName,r=n.propertyName,o=n.propertyIndex;if(t||(t=s.findNode(this.rootNode,n.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(i){let a=n.objectIndex;switch(i){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let c=0;c<t.length;c++)if(t[c].name===a){a=c;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[i]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[i]}if(a!==void 0){if(t[a]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[a]}}let l=t[r];if(l===void 0){let a=n.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+a+"."+r+" but it wasn't found.",t);return}let u=this.Versioning.None;this.targetObject=t,t.isMaterial===!0?u=this.Versioning.NeedsUpdate:t.isObject3D===!0&&(u=this.Versioning.MatrixWorldNeedsUpdate);let d=this.BindingType.Direct;if(o!==void 0){if(r==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[o]!==void 0&&(o=t.morphTargetDictionary[o])}d=this.BindingType.ArrayElement,this.resolvedProperty=l,this.propertyIndex=o}else l.fromArray!==void 0&&l.toArray!==void 0?(d=this.BindingType.HasFromToArray,this.resolvedProperty=l):Array.isArray(l)?(d=this.BindingType.EntireArray,this.resolvedProperty=l):this.propertyName=r;this.getValue=this.GetterByBindingType[d],this.setValue=this.SetterByBindingTypeAndVersioning[d][u]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}}return s.Composite=gu,s})();yt.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};yt.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};yt.prototype.GetterByBindingType=[yt.prototype._getValue_direct,yt.prototype._getValue_array,yt.prototype._getValue_arrayElement,yt.prototype._getValue_toArray];yt.prototype.SetterByBindingTypeAndVersioning=[[yt.prototype._setValue_direct,yt.prototype._setValue_direct_setNeedsUpdate,yt.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[yt.prototype._setValue_array,yt.prototype._setValue_array_setNeedsUpdate,yt.prototype._setValue_array_setMatrixWorldNeedsUpdate],[yt.prototype._setValue_arrayElement,yt.prototype._setValue_arrayElement_setNeedsUpdate,yt.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[yt.prototype._setValue_fromArray,yt.prototype._setValue_fromArray_setNeedsUpdate,yt.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var dl=class{constructor(e,t,n=null,i=t.blendMode){this._mixer=e,this._clip=t,this._localRoot=n,this.blendMode=i;let r=t.tracks,o=r.length,l=new Array(o),u={endingStart:fr,endingEnd:fr};for(let d=0;d!==o;++d){let a=r[d].createInterpolant(null);l[d]=a,a.settings=u}this._interpolantSettings=u,this._interpolants=l,this._propertyBindings=new Array(o),this._cacheIndex=null,this._byClipCacheIndex=null,this._timeScaleInterpolant=null,this._weightInterpolant=null,this.loop=yf,this._loopCount=-1,this._startTime=null,this.time=0,this.timeScale=1,this._effectiveTimeScale=1,this.weight=1,this._effectiveWeight=1,this.repetitions=1/0,this.paused=!1,this.enabled=!0,this.clampWhenFinished=!1,this.zeroSlopeAtStart=!0,this.zeroSlopeAtEnd=!0}play(){return this._mixer._activateAction(this),this}stop(){return this._mixer._deactivateAction(this),this.reset()}reset(){return this.paused=!1,this.enabled=!0,this.time=0,this._loopCount=-1,this._startTime=null,this.stopFading().stopWarping()}isRunning(){return this.enabled&&!this.paused&&this.timeScale!==0&&this._startTime===null&&this._mixer._isActiveAction(this)}isScheduled(){return this._mixer._isActiveAction(this)}startAt(e){return this._startTime=e,this}setLoop(e,t){return this.loop=e,this.repetitions=t,this}setEffectiveWeight(e){return this.weight=e,this._effectiveWeight=this.enabled?e:0,this.stopFading()}getEffectiveWeight(){return this._effectiveWeight}fadeIn(e){return this._scheduleFading(e,0,1)}fadeOut(e){return this._scheduleFading(e,1,0)}crossFadeFrom(e,t,n=!1){if(e.fadeOut(t),this.fadeIn(t),n===!0){let i=this._clip.duration,r=e._clip.duration,o=r/i,l=i/r;e.warp(1,o,t),this.warp(l,1,t)}return this}crossFadeTo(e,t,n=!1){return e.crossFadeFrom(this,t,n)}stopFading(){let e=this._weightInterpolant;return e!==null&&(this._weightInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}setEffectiveTimeScale(e){return this.timeScale=e,this._effectiveTimeScale=this.paused?0:e,this.stopWarping()}getEffectiveTimeScale(){return this._effectiveTimeScale}setDuration(e){return this.timeScale=this._clip.duration/e,this.stopWarping()}syncWith(e){return this.time=e.time,this.timeScale=e.timeScale,this.stopWarping()}halt(e){return this.warp(this._effectiveTimeScale,0,e)}warp(e,t,n){let i=this._mixer,r=i.time,o=this.timeScale,l=this._timeScaleInterpolant;l===null&&(l=i._lendControlInterpolant(),this._timeScaleInterpolant=l);let u=l.parameterPositions,d=l.sampleValues;return u[0]=r,u[1]=r+n,d[0]=e/o,d[1]=t/o,this}stopWarping(){let e=this._timeScaleInterpolant;return e!==null&&(this._timeScaleInterpolant=null,this._mixer._takeBackControlInterpolant(e)),this}getMixer(){return this._mixer}getClip(){return this._clip}getRoot(){return this._localRoot||this._mixer._root}_update(e,t,n,i){if(!this.enabled){this._updateWeight(e);return}let r=this._startTime;if(r!==null){let u=(e-r)*n;u<0||n===0?t=0:(this._startTime=null,t=n*u)}t*=this._updateTimeScale(e);let o=this._updateTime(t),l=this._updateWeight(e);if(l>0){let u=this._interpolants,d=this._propertyBindings;switch(this.blendMode){case bf:for(let a=0,c=u.length;a!==c;++a)u[a].evaluate(o),d[a].accumulateAdditive(l);break;case ec:default:for(let a=0,c=u.length;a!==c;++a)u[a].evaluate(o),d[a].accumulate(i,l)}}}_updateWeight(e){let t=0;if(this.enabled){t=this.weight;let n=this._weightInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopFading(),i===0&&(this.enabled=!1))}}return this._effectiveWeight=t,t}_updateTimeScale(e){let t=0;if(!this.paused){t=this.timeScale;let n=this._timeScaleInterpolant;if(n!==null){let i=n.evaluate(e)[0];t*=i,e>n.parameterPositions[1]&&(this.stopWarping(),t===0?this.paused=!0:this.timeScale=t)}}return this._effectiveTimeScale=t,t}_updateTime(e){let t=this._clip.duration,n=this.loop,i=this.time+e,r=this._loopCount,o=n===xf;if(e===0)return r===-1?i:o&&(r&1)===1?t-i:i;if(n===er){r===-1&&(this._loopCount=0,this._setEndings(!0,!0,!1));e:{if(i>=t)i=t;else if(i<0)i=0;else{this.time=i;break e}this.clampWhenFinished?this.paused=!0:this.enabled=!1,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e<0?-1:1})}}else{if(r===-1&&(e>=0?(r=0,this._setEndings(!0,this.repetitions===0,o)):this._setEndings(this.repetitions===0,!0,o)),i>=t||i<0){let l=Math.floor(i/t);i-=t*l,r+=Math.abs(l);let u=this.repetitions-r;if(u<=0)this.clampWhenFinished?this.paused=!0:this.enabled=!1,i=e>0?t:0,this.time=i,this._mixer.dispatchEvent({type:"finished",action:this,direction:e>0?1:-1});else{if(u===1){let d=e<0;this._setEndings(d,!d,o)}else this._setEndings(!1,!1,o);this._loopCount=r,this.time=i,this._mixer.dispatchEvent({type:"loop",action:this,loopDelta:l})}}else this.time=i;if(o&&(r&1)===1)return t-i}return i}_setEndings(e,t,n){let i=this._interpolantSettings;n?(i.endingStart=pr,i.endingEnd=pr):(e?i.endingStart=this.zeroSlopeAtStart?pr:fr:i.endingStart=bo,t?i.endingEnd=this.zeroSlopeAtEnd?pr:fr:i.endingEnd=bo)}_scheduleFading(e,t,n){let i=this._mixer,r=i.time,o=this._weightInterpolant;o===null&&(o=i._lendControlInterpolant(),this._weightInterpolant=o);let l=o.parameterPositions,u=o.sampleValues;return l[0]=r,u[0]=t,l[1]=r+e,u[1]=n,this}},Ym=new Float32Array(1),Xo=class extends Yn{constructor(e){super(),this._root=e,this._initMemoryManager(),this._accuIndex=0,this.time=0,this.timeScale=1}_bindAction(e,t){let n=e._localRoot||this._root,i=e._clip.tracks,r=i.length,o=e._propertyBindings,l=e._interpolants,u=n.uuid,d=this._bindingsByRootAndName,a=d[u];a===void 0&&(a={},d[u]=a);for(let c=0;c!==r;++c){let h=i[c],f=h.name,g=a[f];if(g!==void 0)++g.referenceCount,o[c]=g;else{if(g=o[c],g!==void 0){g._cacheIndex===null&&(++g.referenceCount,this._addInactiveBinding(g,u,f));continue}let _=t&&t._propertyBindings[c].binding.parsedPath;g=new ul(yt.create(n,f,_),h.ValueTypeName,h.getValueSize()),++g.referenceCount,this._addInactiveBinding(g,u,f),o[c]=g}l[c].resultBuffer=g.buffer}}_activateAction(e){if(!this._isActiveAction(e)){if(e._cacheIndex===null){let n=(e._localRoot||this._root).uuid,i=e._clip.uuid,r=this._actionsByClip[i];this._bindAction(e,r&&r.knownActions[0]),this._addInactiveAction(e,i,n)}let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];r.useCount++===0&&(this._lendBinding(r),r.saveOriginalState())}this._lendAction(e)}}_deactivateAction(e){if(this._isActiveAction(e)){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];--r.useCount===0&&(r.restoreOriginalState(),this._takeBackBinding(r))}this._takeBackAction(e)}}_initMemoryManager(){this._actions=[],this._nActiveActions=0,this._actionsByClip={},this._bindings=[],this._nActiveBindings=0,this._bindingsByRootAndName={},this._controlInterpolants=[],this._nActiveControlInterpolants=0;let e=this;this.stats={actions:{get total(){return e._actions.length},get inUse(){return e._nActiveActions}},bindings:{get total(){return e._bindings.length},get inUse(){return e._nActiveBindings}},controlInterpolants:{get total(){return e._controlInterpolants.length},get inUse(){return e._nActiveControlInterpolants}}}}_isActiveAction(e){let t=e._cacheIndex;return t!==null&&t<this._nActiveActions}_addInactiveAction(e,t,n){let i=this._actions,r=this._actionsByClip,o=r[t];if(o===void 0)o={knownActions:[e],actionByRoot:{}},e._byClipCacheIndex=0,r[t]=o;else{let l=o.knownActions;e._byClipCacheIndex=l.length,l.push(e)}e._cacheIndex=i.length,i.push(e),o.actionByRoot[n]=e}_removeInactiveAction(e){let t=this._actions,n=t[t.length-1],i=e._cacheIndex;n._cacheIndex=i,t[i]=n,t.pop(),e._cacheIndex=null;let r=e._clip.uuid,o=this._actionsByClip,l=o[r],u=l.knownActions,d=u[u.length-1],a=e._byClipCacheIndex;d._byClipCacheIndex=a,u[a]=d,u.pop(),e._byClipCacheIndex=null;let c=l.actionByRoot,h=(e._localRoot||this._root).uuid;delete c[h],u.length===0&&delete o[r],this._removeInactiveBindingsForAction(e)}_removeInactiveBindingsForAction(e){let t=e._propertyBindings;for(let n=0,i=t.length;n!==i;++n){let r=t[n];--r.referenceCount===0&&this._removeInactiveBinding(r)}}_lendAction(e){let t=this._actions,n=e._cacheIndex,i=this._nActiveActions++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackAction(e){let t=this._actions,n=e._cacheIndex,i=--this._nActiveActions,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_addInactiveBinding(e,t,n){let i=this._bindingsByRootAndName,r=this._bindings,o=i[t];o===void 0&&(o={},i[t]=o),o[n]=e,e._cacheIndex=r.length,r.push(e)}_removeInactiveBinding(e){let t=this._bindings,n=e.binding,i=n.rootNode.uuid,r=n.path,o=this._bindingsByRootAndName,l=o[i],u=t[t.length-1],d=e._cacheIndex;u._cacheIndex=d,t[d]=u,t.pop(),delete l[r],Object.keys(l).length===0&&delete o[i]}_lendBinding(e){let t=this._bindings,n=e._cacheIndex,i=this._nActiveBindings++,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_takeBackBinding(e){let t=this._bindings,n=e._cacheIndex,i=--this._nActiveBindings,r=t[i];e._cacheIndex=i,t[i]=e,r._cacheIndex=n,t[n]=r}_lendControlInterpolant(){let e=this._controlInterpolants,t=this._nActiveControlInterpolants++,n=e[t];return n===void 0&&(n=new Uo(new Float32Array(2),new Float32Array(2),1,Ym),n.__cacheIndex=t,e[t]=n),n}_takeBackControlInterpolant(e){let t=this._controlInterpolants,n=e.__cacheIndex,i=--this._nActiveControlInterpolants,r=t[i];e.__cacheIndex=i,t[i]=e,r.__cacheIndex=n,t[n]=r}clipAction(e,t,n){let i=t||this._root,r=i.uuid,o=typeof e=="string"?Sr.findByName(i,e):e,l=o!==null?o.uuid:e,u=this._actionsByClip[l],d=null;if(n===void 0&&(o!==null?n=o.blendMode:n=ec),u!==void 0){let c=u.actionByRoot[r];if(c!==void 0&&c.blendMode===n)return c;d=u.knownActions[0],o===null&&(o=d._clip)}if(o===null)return null;let a=new dl(this,o,t,n);return this._bindAction(a,d),this._addInactiveAction(a,l,r),a}existingAction(e,t){let n=t||this._root,i=n.uuid,r=typeof e=="string"?Sr.findByName(n,e):e,o=r?r.uuid:e,l=this._actionsByClip[o];return l!==void 0&&l.actionByRoot[i]||null}stopAllAction(){let e=this._actions,t=this._nActiveActions;for(let n=t-1;n>=0;--n)e[n].stop();return this}update(e){e*=this.timeScale;let t=this._actions,n=this._nActiveActions,i=this.time+=e,r=Math.sign(e),o=this._accuIndex^=1;for(let d=0;d!==n;++d)t[d]._update(i,e,r,o);let l=this._bindings,u=this._nActiveBindings;for(let d=0;d!==u;++d)l[d].apply(o);return this}setTime(e){this.time=0;for(let t=0;t<this._actions.length;t++)this._actions[t].time=0;return this.update(e)}getRoot(){return this._root}uncacheClip(e){let t=this._actions,n=e.uuid,i=this._actionsByClip,r=i[n];if(r!==void 0){let o=r.knownActions;for(let l=0,u=o.length;l!==u;++l){let d=o[l];this._deactivateAction(d);let a=d._cacheIndex,c=t[t.length-1];d._cacheIndex=null,d._byClipCacheIndex=null,c._cacheIndex=a,t[a]=c,t.pop(),this._removeInactiveBindingsForAction(d)}delete i[n]}}uncacheRoot(e){let t=e.uuid,n=this._actionsByClip;for(let o in n){let l=n[o].actionByRoot,u=l[t];u!==void 0&&(this._deactivateAction(u),this._removeInactiveAction(u))}let i=this._bindingsByRootAndName,r=i[t];if(r!==void 0)for(let o in r){let l=r[o];l.restoreOriginalState(),this._removeInactiveBinding(l)}}uncacheAction(e,t){let n=this.existingAction(e,t);n!==null&&(this._deactivateAction(n),this._removeInactiveAction(n))}};var Bh=new ke,Yo=class{constructor(e,t,n=0,i=1/0){this.ray=new Qn(e,t),this.near=n,this.far=i,this.camera=null,this.layers=new Ts,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(e,t){this.ray.set(e,t)}setFromCamera(e,t){t.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(t.matrixWorld),this.ray.direction.set(e.x,e.y,.5).unproject(t).sub(this.ray.origin).normalize(),this.camera=t):t.isOrthographicCamera?(this.ray.origin.set(e.x,e.y,(t.near+t.far)/(t.near-t.far)).unproject(t),this.ray.direction.set(0,0,-1).transformDirection(t.matrixWorld),this.camera=t):console.error("THREE.Raycaster: Unsupported camera type: "+t.type)}setFromXRController(e){return Bh.identity().extractRotation(e.matrixWorld),this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(0,0,-1).applyMatrix4(Bh),this}intersectObject(e,t=!0,n=[]){return _u(e,this,n,t),n.sort(Hh),n}intersectObjects(e,t=!0,n=[]){for(let i=0,r=e.length;i<r;i++)_u(e[i],this,n,t);return n.sort(Hh),n}};function Hh(s,e){return s.distance-e.distance}function _u(s,e,t,n){let i=!0;if(s.layers.test(e.layers)&&s.raycast(e,t)===!1&&(i=!1),i===!0&&n===!0){let r=s.children;for(let o=0,l=r.length;o<l;o++)_u(r[o],e,t,!0)}}var ks=class{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=qe(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(qe(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var zh=new w,Wa=new w,Vh=new w,wr=class extends wt{constructor(e,t,n){super(),this.light=e,this.matrix=e.matrixWorld,this.matrixAutoUpdate=!1,this.color=n,this.type="DirectionalLightHelper",t===void 0&&(t=1);let i=new Tt;i.setAttribute("position",new Wt([-t,t,0,t,t,0,t,-t,0,-t,-t,0,-t,t,0],3));let r=new Zi({fog:!1,toneMapped:!1});this.lightPlane=new xi(i,r),this.add(this.lightPlane),i=new Tt,i.setAttribute("position",new Wt([0,0,0,0,0,1],3)),this.targetLine=new xi(i,r),this.add(this.targetLine),this.update()}dispose(){this.lightPlane.geometry.dispose(),this.lightPlane.material.dispose(),this.targetLine.geometry.dispose(),this.targetLine.material.dispose()}update(){this.light.updateWorldMatrix(!0,!1),this.light.target.updateWorldMatrix(!0,!1),zh.setFromMatrixPosition(this.light.matrixWorld),Wa.setFromMatrixPosition(this.light.target.matrixWorld),Vh.subVectors(Wa,zh),this.lightPlane.lookAt(Wa),this.color!==void 0?(this.lightPlane.material.color.set(this.color),this.targetLine.material.color.set(this.color)):(this.lightPlane.material.color.copy(this.light.color),this.targetLine.material.color.copy(this.light.color)),this.targetLine.lookAt(Wa),this.targetLine.scale.z=Vh.length()}};var qo=class extends Ls{constructor(e=1){let t=[0,0,0,e,0,0,0,0,0,0,e,0,0,0,0,0,0,e],n=[1,0,0,1,.6,0,0,1,0,.6,1,0,0,0,1,0,.6,1],i=new Tt;i.setAttribute("position",new Wt(t,3)),i.setAttribute("color",new Wt(n,3));let r=new Zi({vertexColors:!0,toneMapped:!1});super(i,r),this.type="AxesHelper"}setColors(e,t,n){let i=new de,r=this.geometry.attributes.color.array;return i.set(e),i.toArray(r,0),i.toArray(r,3),i.set(t),i.toArray(r,6),i.toArray(r,9),i.set(n),i.toArray(r,12),i.toArray(r,15),this.geometry.attributes.color.needsUpdate=!0,this}dispose(){this.geometry.dispose(),this.material.dispose()}};var jo=class extends Yn{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){console.warn("THREE.Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}};function Bu(s,e,t,n){let i=qm(n);switch(t){case wu:return s*e;case El:return s*e/i.components*i.byteLength;case Cl:return s*e/i.components*i.byteLength;case Au:return s*e*2/i.components*i.byteLength;case wl:return s*e*2/i.components*i.byteLength;case Tu:return s*e*3/i.components*i.byteLength;case Zt:return s*e*4/i.components*i.byteLength;case Tl:return s*e*4/i.components*i.byteLength;case $o:case Ko:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Jo:case Qo:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Rl:case Il:return Math.max(s,16)*Math.max(e,8)/4;case Al:case Pl:return Math.max(s,8)*Math.max(e,8)/2;case Dl:case Ol:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*8;case Ll:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case Nl:return Math.floor((s+3)/4)*Math.floor((e+3)/4)*16;case kl:return Math.floor((s+4)/5)*Math.floor((e+3)/4)*16;case Fl:return Math.floor((s+4)/5)*Math.floor((e+4)/5)*16;case Ul:return Math.floor((s+5)/6)*Math.floor((e+4)/5)*16;case Bl:return Math.floor((s+5)/6)*Math.floor((e+5)/6)*16;case Hl:return Math.floor((s+7)/8)*Math.floor((e+4)/5)*16;case zl:return Math.floor((s+7)/8)*Math.floor((e+5)/6)*16;case Vl:return Math.floor((s+7)/8)*Math.floor((e+7)/8)*16;case Gl:return Math.floor((s+9)/10)*Math.floor((e+4)/5)*16;case Wl:return Math.floor((s+9)/10)*Math.floor((e+5)/6)*16;case Xl:return Math.floor((s+9)/10)*Math.floor((e+7)/8)*16;case Yl:return Math.floor((s+9)/10)*Math.floor((e+9)/10)*16;case ql:return Math.floor((s+11)/12)*Math.floor((e+9)/10)*16;case jl:return Math.floor((s+11)/12)*Math.floor((e+11)/12)*16;case ea:case Zl:case $l:return Math.ceil(s/4)*Math.ceil(e/4)*16;case Ru:case Kl:return Math.ceil(s/4)*Math.ceil(e/4)*8;case Jl:case Ql:return Math.ceil(s/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function qm(s){switch(s){case an:case Su:return{byteLength:1,components:1};case Bs:case Eu:case Hs:return{byteLength:2,components:1};case Ml:case Sl:return{byteLength:2,components:4};case Qi:case bl:case On:return{byteLength:4,components:1};case Cu:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${s}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"179"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="179");function ap(){let s=null,e=!1,t=null,n=null;function i(r,o){t(r,o),n=s.requestAnimationFrame(i)}return{start:function(){e!==!0&&t!==null&&(n=s.requestAnimationFrame(i),e=!0)},stop:function(){s.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){s=r}}}function Zm(s){let e=new WeakMap;function t(l,u){let d=l.array,a=l.usage,c=d.byteLength,h=s.createBuffer();s.bindBuffer(u,h),s.bufferData(u,d,a),l.onUploadCallback();let f;if(d instanceof Float32Array)f=s.FLOAT;else if(typeof Float16Array<"u"&&d instanceof Float16Array)f=s.HALF_FLOAT;else if(d instanceof Uint16Array)l.isFloat16BufferAttribute?f=s.HALF_FLOAT:f=s.UNSIGNED_SHORT;else if(d instanceof Int16Array)f=s.SHORT;else if(d instanceof Uint32Array)f=s.UNSIGNED_INT;else if(d instanceof Int32Array)f=s.INT;else if(d instanceof Int8Array)f=s.BYTE;else if(d instanceof Uint8Array)f=s.UNSIGNED_BYTE;else if(d instanceof Uint8ClampedArray)f=s.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+d);return{buffer:h,type:f,bytesPerElement:d.BYTES_PER_ELEMENT,version:l.version,size:c}}function n(l,u,d){let a=u.array,c=u.updateRanges;if(s.bindBuffer(d,l),c.length===0)s.bufferSubData(d,0,a);else{c.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<c.length;f++){let g=c[h],_=c[f];_.start<=g.start+g.count+1?g.count=Math.max(g.count,_.start+_.count-g.start):(++h,c[h]=_)}c.length=h+1;for(let f=0,g=c.length;f<g;f++){let _=c[f];s.bufferSubData(d,_.start*a.BYTES_PER_ELEMENT,a,_.start,_.count)}u.clearUpdateRanges()}u.onUploadCallback()}function i(l){return l.isInterleavedBufferAttribute&&(l=l.data),e.get(l)}function r(l){l.isInterleavedBufferAttribute&&(l=l.data);let u=e.get(l);u&&(s.deleteBuffer(u.buffer),e.delete(l))}function o(l,u){if(l.isInterleavedBufferAttribute&&(l=l.data),l.isGLBufferAttribute){let a=e.get(l);(!a||a.version<l.version)&&e.set(l,{buffer:l.buffer,type:l.type,bytesPerElement:l.elementSize,version:l.version});return}let d=e.get(l);if(d===void 0)e.set(l,t(l,u));else if(d.version<l.version){if(d.size!==l.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(d.buffer,l,u),d.version=l.version}}return{get:i,remove:r,update:o}}var $m=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Km=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Jm=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Qm=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,eg=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,tg=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,ng=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,ig=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,rg=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,sg=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,og=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,ag=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,lg=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,cg=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ug=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,dg=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,hg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,fg=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,pg=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,mg=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,gg=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,_g=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,vg=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,yg=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,xg=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,bg=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Mg=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Sg=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Eg=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Cg=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wg="gl_FragColor = linearToOutputTexel( gl_FragColor );",Tg=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ag=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,Rg=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,Pg=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Ig=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Dg=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Og=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Lg=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Ng=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,kg=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Fg=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Ug=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Bg=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Hg=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,zg=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Vg=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Gg=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Wg=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Xg=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Yg=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,qg=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,jg=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Zg=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,$g=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Kg=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Jg=`#if defined( USE_LOGDEPTHBUF )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Qg=`#if defined( USE_LOGDEPTHBUF )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,e0=`#ifdef USE_LOGDEPTHBUF
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,t0=`#ifdef USE_LOGDEPTHBUF
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,n0=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,i0=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,r0=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,s0=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,o0=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,a0=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,l0=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,c0=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,u0=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,d0=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,h0=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,f0=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,p0=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,m0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,g0=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_0=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,v0=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,y0=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,x0=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,b0=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,M0=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,S0=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,E0=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,C0=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,w0=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,T0=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,A0=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,R0=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,P0=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,I0=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSEDEPTHBUF
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSEDEPTHBUF
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare , distribution.x );
		#endif
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,D0=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,O0=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,L0=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,N0=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,k0=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,F0=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,U0=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,B0=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,H0=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,z0=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,V0=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,G0=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,W0=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,X0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Y0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,q0=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,j0=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Z0=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,$0=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,K0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,J0=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Q0=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,e_=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,t_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,n_=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSEDEPTHBUF
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,i_=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,r_=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,s_=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,o_=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,a_=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,l_=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,c_=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,u_=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,d_=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,h_=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,f_=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,p_=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,m_=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,g_=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,__=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,v_=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,y_=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,x_=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,b_=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,M_=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,S_=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,E_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,C_=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,w_=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,T_=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,A_=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Xe={alphahash_fragment:$m,alphahash_pars_fragment:Km,alphamap_fragment:Jm,alphamap_pars_fragment:Qm,alphatest_fragment:eg,alphatest_pars_fragment:tg,aomap_fragment:ng,aomap_pars_fragment:ig,batching_pars_vertex:rg,batching_vertex:sg,begin_vertex:og,beginnormal_vertex:ag,bsdfs:lg,iridescence_fragment:cg,bumpmap_pars_fragment:ug,clipping_planes_fragment:dg,clipping_planes_pars_fragment:hg,clipping_planes_pars_vertex:fg,clipping_planes_vertex:pg,color_fragment:mg,color_pars_fragment:gg,color_pars_vertex:_g,color_vertex:vg,common:yg,cube_uv_reflection_fragment:xg,defaultnormal_vertex:bg,displacementmap_pars_vertex:Mg,displacementmap_vertex:Sg,emissivemap_fragment:Eg,emissivemap_pars_fragment:Cg,colorspace_fragment:wg,colorspace_pars_fragment:Tg,envmap_fragment:Ag,envmap_common_pars_fragment:Rg,envmap_pars_fragment:Pg,envmap_pars_vertex:Ig,envmap_physical_pars_fragment:Vg,envmap_vertex:Dg,fog_vertex:Og,fog_pars_vertex:Lg,fog_fragment:Ng,fog_pars_fragment:kg,gradientmap_pars_fragment:Fg,lightmap_pars_fragment:Ug,lights_lambert_fragment:Bg,lights_lambert_pars_fragment:Hg,lights_pars_begin:zg,lights_toon_fragment:Gg,lights_toon_pars_fragment:Wg,lights_phong_fragment:Xg,lights_phong_pars_fragment:Yg,lights_physical_fragment:qg,lights_physical_pars_fragment:jg,lights_fragment_begin:Zg,lights_fragment_maps:$g,lights_fragment_end:Kg,logdepthbuf_fragment:Jg,logdepthbuf_pars_fragment:Qg,logdepthbuf_pars_vertex:e0,logdepthbuf_vertex:t0,map_fragment:n0,map_pars_fragment:i0,map_particle_fragment:r0,map_particle_pars_fragment:s0,metalnessmap_fragment:o0,metalnessmap_pars_fragment:a0,morphinstance_vertex:l0,morphcolor_vertex:c0,morphnormal_vertex:u0,morphtarget_pars_vertex:d0,morphtarget_vertex:h0,normal_fragment_begin:f0,normal_fragment_maps:p0,normal_pars_fragment:m0,normal_pars_vertex:g0,normal_vertex:_0,normalmap_pars_fragment:v0,clearcoat_normal_fragment_begin:y0,clearcoat_normal_fragment_maps:x0,clearcoat_pars_fragment:b0,iridescence_pars_fragment:M0,opaque_fragment:S0,packing:E0,premultiplied_alpha_fragment:C0,project_vertex:w0,dithering_fragment:T0,dithering_pars_fragment:A0,roughnessmap_fragment:R0,roughnessmap_pars_fragment:P0,shadowmap_pars_fragment:I0,shadowmap_pars_vertex:D0,shadowmap_vertex:O0,shadowmask_pars_fragment:L0,skinbase_vertex:N0,skinning_pars_vertex:k0,skinning_vertex:F0,skinnormal_vertex:U0,specularmap_fragment:B0,specularmap_pars_fragment:H0,tonemapping_fragment:z0,tonemapping_pars_fragment:V0,transmission_fragment:G0,transmission_pars_fragment:W0,uv_pars_fragment:X0,uv_pars_vertex:Y0,uv_vertex:q0,worldpos_vertex:j0,background_vert:Z0,background_frag:$0,backgroundCube_vert:K0,backgroundCube_frag:J0,cube_vert:Q0,cube_frag:e_,depth_vert:t_,depth_frag:n_,distanceRGBA_vert:i_,distanceRGBA_frag:r_,equirect_vert:s_,equirect_frag:o_,linedashed_vert:a_,linedashed_frag:l_,meshbasic_vert:c_,meshbasic_frag:u_,meshlambert_vert:d_,meshlambert_frag:h_,meshmatcap_vert:f_,meshmatcap_frag:p_,meshnormal_vert:m_,meshnormal_frag:g_,meshphong_vert:__,meshphong_frag:v_,meshphysical_vert:y_,meshphysical_frag:x_,meshtoon_vert:b_,meshtoon_frag:M_,points_vert:S_,points_frag:E_,shadow_vert:C_,shadow_frag:w_,sprite_vert:T_,sprite_frag:A_},oe={common:{diffuse:{value:new de(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Ge}},envmap:{envMap:{value:null},envMapRotation:{value:new Ge},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Ge}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Ge}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Ge},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Ge},normalScale:{value:new Se(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Ge},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Ge}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Ge}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Ge}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new de(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new de(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0},uvTransform:{value:new Ge}},sprite:{diffuse:{value:new de(16777215)},opacity:{value:1},center:{value:new Se(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Ge},alphaMap:{value:null},alphaMapTransform:{value:new Ge},alphaTest:{value:0}}},ri={basic:{uniforms:tn([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.fog]),vertexShader:Xe.meshbasic_vert,fragmentShader:Xe.meshbasic_frag},lambert:{uniforms:tn([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new de(0)}}]),vertexShader:Xe.meshlambert_vert,fragmentShader:Xe.meshlambert_frag},phong:{uniforms:tn([oe.common,oe.specularmap,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,oe.lights,{emissive:{value:new de(0)},specular:{value:new de(1118481)},shininess:{value:30}}]),vertexShader:Xe.meshphong_vert,fragmentShader:Xe.meshphong_frag},standard:{uniforms:tn([oe.common,oe.envmap,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.roughnessmap,oe.metalnessmap,oe.fog,oe.lights,{emissive:{value:new de(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag},toon:{uniforms:tn([oe.common,oe.aomap,oe.lightmap,oe.emissivemap,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.gradientmap,oe.fog,oe.lights,{emissive:{value:new de(0)}}]),vertexShader:Xe.meshtoon_vert,fragmentShader:Xe.meshtoon_frag},matcap:{uniforms:tn([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,oe.fog,{matcap:{value:null}}]),vertexShader:Xe.meshmatcap_vert,fragmentShader:Xe.meshmatcap_frag},points:{uniforms:tn([oe.points,oe.fog]),vertexShader:Xe.points_vert,fragmentShader:Xe.points_frag},dashed:{uniforms:tn([oe.common,oe.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Xe.linedashed_vert,fragmentShader:Xe.linedashed_frag},depth:{uniforms:tn([oe.common,oe.displacementmap]),vertexShader:Xe.depth_vert,fragmentShader:Xe.depth_frag},normal:{uniforms:tn([oe.common,oe.bumpmap,oe.normalmap,oe.displacementmap,{opacity:{value:1}}]),vertexShader:Xe.meshnormal_vert,fragmentShader:Xe.meshnormal_frag},sprite:{uniforms:tn([oe.sprite,oe.fog]),vertexShader:Xe.sprite_vert,fragmentShader:Xe.sprite_frag},background:{uniforms:{uvTransform:{value:new Ge},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Xe.background_vert,fragmentShader:Xe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Ge}},vertexShader:Xe.backgroundCube_vert,fragmentShader:Xe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Xe.cube_vert,fragmentShader:Xe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Xe.equirect_vert,fragmentShader:Xe.equirect_frag},distanceRGBA:{uniforms:tn([oe.common,oe.displacementmap,{referencePosition:{value:new w},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Xe.distanceRGBA_vert,fragmentShader:Xe.distanceRGBA_frag},shadow:{uniforms:tn([oe.lights,oe.fog,{color:{value:new de(0)},opacity:{value:1}}]),vertexShader:Xe.shadow_vert,fragmentShader:Xe.shadow_frag}};ri.physical={uniforms:tn([ri.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Ge},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Ge},clearcoatNormalScale:{value:new Se(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Ge},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Ge},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Ge},sheen:{value:0},sheenColor:{value:new de(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Ge},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Ge},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Ge},transmissionSamplerSize:{value:new Se},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Ge},attenuationDistance:{value:0},attenuationColor:{value:new de(0)},specularColor:{value:new de(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Ge},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Ge},anisotropyVector:{value:new Se},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Ge}}]),vertexShader:Xe.meshphysical_vert,fragmentShader:Xe.meshphysical_frag};var tc={r:0,b:0,g:0},Dr=new Yt,R_=new ke;function P_(s,e,t,n,i,r,o){let l=new de(0),u=r===!0?0:1,d,a,c=null,h=0,f=null;function g(M){let y=M.isScene===!0?M.background:null;return y&&y.isTexture&&(y=(M.backgroundBlurriness>0?t:e).get(y)),y}function _(M){let y=!1,T=g(M);T===null?p(l,u):T&&T.isColor&&(p(T,1),y=!0);let P=s.xr.getEnvironmentBlendMode();P==="additive"?n.buffers.color.setClear(0,0,0,1,o):P==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,o),(s.autoClear||y)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),s.clear(s.autoClearColor,s.autoClearDepth,s.autoClearStencil))}function m(M,y){let T=g(y);T&&(T.isCubeTexture||T.mapping===Zo)?(a===void 0&&(a=new Ue(new As(1,1,1),new Rt({name:"BackgroundCubeMaterial",uniforms:Ir(ri.backgroundCube.uniforms),vertexShader:ri.backgroundCube.vertexShader,fragmentShader:ri.backgroundCube.fragmentShader,side:jt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),a.geometry.deleteAttribute("normal"),a.geometry.deleteAttribute("uv"),a.onBeforeRender=function(P,A,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(a.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),i.update(a)),Dr.copy(y.backgroundRotation),Dr.x*=-1,Dr.y*=-1,Dr.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(Dr.y*=-1,Dr.z*=-1),a.material.uniforms.envMap.value=T,a.material.uniforms.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,a.material.uniforms.backgroundBlurriness.value=y.backgroundBlurriness,a.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,a.material.uniforms.backgroundRotation.value.setFromMatrix4(R_.makeRotationFromEuler(Dr)),a.material.toneMapped=je.getTransfer(T.colorSpace)!==ct,(c!==T||h!==T.version||f!==s.toneMapping)&&(a.material.needsUpdate=!0,c=T,h=T.version,f=s.toneMapping),a.layers.enableAll(),M.unshift(a,a.geometry,a.material,0,0,null)):T&&T.isTexture&&(d===void 0&&(d=new Ue(new zt(2,2),new Rt({name:"BackgroundMaterial",uniforms:Ir(ri.background.uniforms),vertexShader:ri.background.vertexShader,fragmentShader:ri.background.fragmentShader,side:Mn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),Object.defineProperty(d.material,"map",{get:function(){return this.uniforms.t2D.value}}),i.update(d)),d.material.uniforms.t2D.value=T,d.material.uniforms.backgroundIntensity.value=y.backgroundIntensity,d.material.toneMapped=je.getTransfer(T.colorSpace)!==ct,T.matrixAutoUpdate===!0&&T.updateMatrix(),d.material.uniforms.uvTransform.value.copy(T.matrix),(c!==T||h!==T.version||f!==s.toneMapping)&&(d.material.needsUpdate=!0,c=T,h=T.version,f=s.toneMapping),d.layers.enableAll(),M.unshift(d,d.geometry,d.material,0,0,null))}function p(M,y){M.getRGB(tc,ku(s)),n.buffers.color.setClear(tc.r,tc.g,tc.b,y,o)}function b(){a!==void 0&&(a.geometry.dispose(),a.material.dispose(),a=void 0),d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0)}return{getClearColor:function(){return l},setClearColor:function(M,y=1){l.set(M),u=y,p(l,u)},getClearAlpha:function(){return u},setClearAlpha:function(M){u=M,p(l,u)},render:_,addToRenderList:m,dispose:b}}function I_(s,e){let t=s.getParameter(s.MAX_VERTEX_ATTRIBS),n={},i=h(null),r=i,o=!1;function l(E,R,V,B,z){let j=!1,Y=c(B,V,R);r!==Y&&(r=Y,d(r.object)),j=f(E,B,V,z),j&&g(E,B,V,z),z!==null&&e.update(z,s.ELEMENT_ARRAY_BUFFER),(j||o)&&(o=!1,y(E,R,V,B),z!==null&&s.bindBuffer(s.ELEMENT_ARRAY_BUFFER,e.get(z).buffer))}function u(){return s.createVertexArray()}function d(E){return s.bindVertexArray(E)}function a(E){return s.deleteVertexArray(E)}function c(E,R,V){let B=V.wireframe===!0,z=n[E.id];z===void 0&&(z={},n[E.id]=z);let j=z[R.id];j===void 0&&(j={},z[R.id]=j);let Y=j[B];return Y===void 0&&(Y=h(u()),j[B]=Y),Y}function h(E){let R=[],V=[],B=[];for(let z=0;z<t;z++)R[z]=0,V[z]=0,B[z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:R,enabledAttributes:V,attributeDivisors:B,object:E,attributes:{},index:null}}function f(E,R,V,B){let z=r.attributes,j=R.attributes,Y=0,Z=V.getAttributes();for(let H in Z)if(Z[H].location>=0){let ue=z[H],ye=j[H];if(ye===void 0&&(H==="instanceMatrix"&&E.instanceMatrix&&(ye=E.instanceMatrix),H==="instanceColor"&&E.instanceColor&&(ye=E.instanceColor)),ue===void 0||ue.attribute!==ye||ye&&ue.data!==ye.data)return!0;Y++}return r.attributesNum!==Y||r.index!==B}function g(E,R,V,B){let z={},j=R.attributes,Y=0,Z=V.getAttributes();for(let H in Z)if(Z[H].location>=0){let ue=j[H];ue===void 0&&(H==="instanceMatrix"&&E.instanceMatrix&&(ue=E.instanceMatrix),H==="instanceColor"&&E.instanceColor&&(ue=E.instanceColor));let ye={};ye.attribute=ue,ue&&ue.data&&(ye.data=ue.data),z[H]=ye,Y++}r.attributes=z,r.attributesNum=Y,r.index=B}function _(){let E=r.newAttributes;for(let R=0,V=E.length;R<V;R++)E[R]=0}function m(E){p(E,0)}function p(E,R){let V=r.newAttributes,B=r.enabledAttributes,z=r.attributeDivisors;V[E]=1,B[E]===0&&(s.enableVertexAttribArray(E),B[E]=1),z[E]!==R&&(s.vertexAttribDivisor(E,R),z[E]=R)}function b(){let E=r.newAttributes,R=r.enabledAttributes;for(let V=0,B=R.length;V<B;V++)R[V]!==E[V]&&(s.disableVertexAttribArray(V),R[V]=0)}function M(E,R,V,B,z,j,Y){Y===!0?s.vertexAttribIPointer(E,R,V,z,j):s.vertexAttribPointer(E,R,V,B,z,j)}function y(E,R,V,B){_();let z=B.attributes,j=V.getAttributes(),Y=R.defaultAttributeValues;for(let Z in j){let H=j[Z];if(H.location>=0){let te=z[Z];if(te===void 0&&(Z==="instanceMatrix"&&E.instanceMatrix&&(te=E.instanceMatrix),Z==="instanceColor"&&E.instanceColor&&(te=E.instanceColor)),te!==void 0){let ue=te.normalized,ye=te.itemSize,He=e.get(te);if(He===void 0)continue;let at=He.buffer,tt=He.type,W=He.bytesPerElement,se=tt===s.INT||tt===s.UNSIGNED_INT||te.gpuType===bl;if(te.isInterleavedBufferAttribute){let ne=te.data,Pe=ne.stride,we=te.offset;if(ne.isInstancedInterleavedBuffer){for(let Oe=0;Oe<H.locationSize;Oe++)p(H.location+Oe,ne.meshPerAttribute);E.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Oe=0;Oe<H.locationSize;Oe++)m(H.location+Oe);s.bindBuffer(s.ARRAY_BUFFER,at);for(let Oe=0;Oe<H.locationSize;Oe++)M(H.location+Oe,ye/H.locationSize,tt,ue,Pe*W,(we+ye/H.locationSize*Oe)*W,se)}else{if(te.isInstancedBufferAttribute){for(let ne=0;ne<H.locationSize;ne++)p(H.location+ne,te.meshPerAttribute);E.isInstancedMesh!==!0&&B._maxInstanceCount===void 0&&(B._maxInstanceCount=te.meshPerAttribute*te.count)}else for(let ne=0;ne<H.locationSize;ne++)m(H.location+ne);s.bindBuffer(s.ARRAY_BUFFER,at);for(let ne=0;ne<H.locationSize;ne++)M(H.location+ne,ye/H.locationSize,tt,ue,ye*W,ye/H.locationSize*ne*W,se)}}else if(Y!==void 0){let ue=Y[Z];if(ue!==void 0)switch(ue.length){case 2:s.vertexAttrib2fv(H.location,ue);break;case 3:s.vertexAttrib3fv(H.location,ue);break;case 4:s.vertexAttrib4fv(H.location,ue);break;default:s.vertexAttrib1fv(H.location,ue)}}}}b()}function T(){D();for(let E in n){let R=n[E];for(let V in R){let B=R[V];for(let z in B)a(B[z].object),delete B[z];delete R[V]}delete n[E]}}function P(E){if(n[E.id]===void 0)return;let R=n[E.id];for(let V in R){let B=R[V];for(let z in B)a(B[z].object),delete B[z];delete R[V]}delete n[E.id]}function A(E){for(let R in n){let V=n[R];if(V[E.id]===void 0)continue;let B=V[E.id];for(let z in B)a(B[z].object),delete B[z];delete V[E.id]}}function D(){S(),o=!0,r!==i&&(r=i,d(r.object))}function S(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:l,reset:D,resetDefaultState:S,dispose:T,releaseStatesOfGeometry:P,releaseStatesOfProgram:A,initAttributes:_,enableAttribute:m,disableUnusedAttributes:b}}function D_(s,e,t){let n;function i(d){n=d}function r(d,a){s.drawArrays(n,d,a),t.update(a,n,1)}function o(d,a,c){c!==0&&(s.drawArraysInstanced(n,d,a,c),t.update(a,n,c))}function l(d,a,c){if(c===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,d,0,a,0,c);let f=0;for(let g=0;g<c;g++)f+=a[g];t.update(f,n,1)}function u(d,a,c,h){if(c===0)return;let f=e.get("WEBGL_multi_draw");if(f===null)for(let g=0;g<d.length;g++)o(d[g],a[g],h[g]);else{f.multiDrawArraysInstancedWEBGL(n,d,0,a,0,h,0,c);let g=0;for(let _=0;_<c;_++)g+=a[_]*h[_];t.update(g,n,1)}}this.setMode=i,this.render=r,this.renderInstances=o,this.renderMultiDraw=l,this.renderMultiDrawInstances=u}function O_(s,e,t,n){let i;function r(){if(i!==void 0)return i;if(e.has("EXT_texture_filter_anisotropic")===!0){let A=e.get("EXT_texture_filter_anisotropic");i=s.getParameter(A.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(A){return!(A!==Zt&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_FORMAT))}function l(A){let D=A===Hs&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(A!==an&&n.convert(A)!==s.getParameter(s.IMPLEMENTATION_COLOR_READ_TYPE)&&A!==On&&!D)}function u(A){if(A==="highp"){if(s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.HIGH_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.HIGH_FLOAT).precision>0)return"highp";A="mediump"}return A==="mediump"&&s.getShaderPrecisionFormat(s.VERTEX_SHADER,s.MEDIUM_FLOAT).precision>0&&s.getShaderPrecisionFormat(s.FRAGMENT_SHADER,s.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let d=t.precision!==void 0?t.precision:"highp",a=u(d);a!==d&&(console.warn("THREE.WebGLRenderer:",d,"not supported, using",a,"instead."),d=a);let c=t.logarithmicDepthBuffer===!0,h=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),f=s.getParameter(s.MAX_TEXTURE_IMAGE_UNITS),g=s.getParameter(s.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=s.getParameter(s.MAX_TEXTURE_SIZE),m=s.getParameter(s.MAX_CUBE_MAP_TEXTURE_SIZE),p=s.getParameter(s.MAX_VERTEX_ATTRIBS),b=s.getParameter(s.MAX_VERTEX_UNIFORM_VECTORS),M=s.getParameter(s.MAX_VARYING_VECTORS),y=s.getParameter(s.MAX_FRAGMENT_UNIFORM_VECTORS),T=g>0,P=s.getParameter(s.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:u,textureFormatReadable:o,textureTypeReadable:l,precision:d,logarithmicDepthBuffer:c,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:g,maxTextureSize:_,maxCubemapSize:m,maxAttributes:p,maxVertexUniforms:b,maxVaryings:M,maxFragmentUniforms:y,vertexTextures:T,maxSamples:P}}function L_(s){let e=this,t=null,n=0,i=!1,r=!1,o=new In,l=new Ge,u={value:null,needsUpdate:!1};this.uniform=u,this.numPlanes=0,this.numIntersection=0,this.init=function(c,h){let f=c.length!==0||h||n!==0||i;return i=h,n=c.length,f},this.beginShadows=function(){r=!0,a(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(c,h){t=a(c,h,0)},this.setState=function(c,h,f){let g=c.clippingPlanes,_=c.clipIntersection,m=c.clipShadows,p=s.get(c);if(!i||g===null||g.length===0||r&&!m)r?a(null):d();else{let b=r?0:n,M=b*4,y=p.clippingState||null;u.value=y,y=a(g,h,M,f);for(let T=0;T!==M;++T)y[T]=t[T];p.clippingState=y,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=b}};function d(){u.value!==t&&(u.value=t,u.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function a(c,h,f,g){let _=c!==null?c.length:0,m=null;if(_!==0){if(m=u.value,g!==!0||m===null){let p=f+_*4,b=h.matrixWorldInverse;l.getNormalMatrix(b),(m===null||m.length<p)&&(m=new Float32Array(p));for(let M=0,y=f;M!==_;++M,y+=4)o.copy(c[M]).applyMatrix4(b,l),o.normal.toArray(m,y),m[y+3]=o.constant}u.value=m,u.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function N_(s){let e=new WeakMap;function t(o,l){return l===Ji?o.mapping=Ar:l===yl&&(o.mapping=Rr),o}function n(o){if(o&&o.isTexture){let l=o.mapping;if(l===Ji||l===yl)if(e.has(o)){let u=e.get(o).texture;return t(u,o.mapping)}else{let u=o.image;if(u&&u.height>0){let d=new Qa(u.height);return d.fromEquirectangularTexture(s,o),e.set(o,d),o.addEventListener("dispose",i),t(d.texture,o.mapping)}else return null}}return o}function i(o){let l=o.target;l.removeEventListener("dispose",i);let u=e.get(l);u!==void 0&&(e.delete(l),u.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}var Xs=4,Uf=[.125,.215,.35,.446,.526,.582],Nr=20,Hu=new qn,Bf=new de,zu=null,Vu=0,Gu=0,Wu=!1,Lr=(1+Math.sqrt(5))/2,Ws=1/Lr,Hf=[new w(-Lr,Ws,0),new w(Lr,Ws,0),new w(-Ws,0,Lr),new w(Ws,0,Lr),new w(0,Lr,-Ws),new w(0,Lr,Ws),new w(-1,1,-1),new w(1,1,-1),new w(-1,1,1),new w(1,1,1)],k_=new w,si=class{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(e,t=0,n=.1,i=100,r={}){let{size:o=256,position:l=k_}=r;zu=this._renderer.getRenderTarget(),Vu=this._renderer.getActiveCubeFace(),Gu=this._renderer.getActiveMipmapLevel(),Wu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);let u=this._allocateTargets();return u.depthBuffer=!0,this._sceneToCubeUV(e,n,i,u,l),t>0&&this._blur(u,0,0,t),this._applyPMREM(u),this._cleanup(u),u}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=Gf(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Vf(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodPlanes.length;e++)this._lodPlanes[e].dispose()}_cleanup(e){this._renderer.setRenderTarget(zu,Vu,Gu),this._renderer.xr.enabled=Wu,e.scissorTest=!1,nc(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Ar||e.mapping===Rr?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),zu=this._renderer.getRenderTarget(),Vu=this._renderer.getActiveCubeFace(),Gu=this._renderer.getActiveMipmapLevel(),Wu=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:Dt,minFilter:Dt,generateMipmaps:!1,type:Hs,format:Zt,colorSpace:Lt,depthBuffer:!1},i=zf(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=zf(e,t,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=F_(r)),this._blurMaterial=U_(r,e,t)}return i}_compileMaterial(e){let t=new Ue(this._lodPlanes[0],e);this._renderer.compile(t,Hu)}_sceneToCubeUV(e,t,n,i,r){let u=new It(90,1,t,n),d=[1,-1,1,1,1,1],a=[1,1,1,-1,-1,-1],c=this._renderer,h=c.autoClear,f=c.toneMapping;c.getClearColor(Bf),c.toneMapping=Ai,c.autoClear=!1,c.state.buffers.depth.getReversed()&&(c.setRenderTarget(i),c.clearDepth(),c.setRenderTarget(null));let _=new Ot({name:"PMREM.Background",side:jt,depthWrite:!1,depthTest:!1}),m=new Ue(new As,_),p=!1,b=e.background;b?b.isColor&&(_.color.copy(b),e.background=null,p=!0):(_.color.copy(Bf),p=!0);for(let M=0;M<6;M++){let y=M%3;y===0?(u.up.set(0,d[M],0),u.position.set(r.x,r.y,r.z),u.lookAt(r.x+a[M],r.y,r.z)):y===1?(u.up.set(0,0,d[M]),u.position.set(r.x,r.y,r.z),u.lookAt(r.x,r.y+a[M],r.z)):(u.up.set(0,d[M],0),u.position.set(r.x,r.y,r.z),u.lookAt(r.x,r.y,r.z+a[M]));let T=this._cubeSize;nc(i,y*T,M>2?T:0,T,T),c.setRenderTarget(i),p&&c.render(m,u),c.render(e,u)}m.geometry.dispose(),m.material.dispose(),c.toneMapping=f,c.autoClear=h,e.background=b}_textureToCubeUV(e,t){let n=this._renderer,i=e.mapping===Ar||e.mapping===Rr;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=Gf()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Vf());let r=i?this._cubemapMaterial:this._equirectMaterial,o=new Ue(this._lodPlanes[0],r),l=r.uniforms;l.envMap.value=e;let u=this._cubeSize;nc(t,0,0,3*u,2*u),n.setRenderTarget(t),n.render(o,Hu)}_applyPMREM(e){let t=this._renderer,n=t.autoClear;t.autoClear=!1;let i=this._lodPlanes.length;for(let r=1;r<i;r++){let o=Math.sqrt(this._sigmas[r]*this._sigmas[r]-this._sigmas[r-1]*this._sigmas[r-1]),l=Hf[(i-r-1)%Hf.length];this._blur(e,r-1,r,o,l)}t.autoClear=n}_blur(e,t,n,i,r){let o=this._pingPongRenderTarget;this._halfBlur(e,o,t,n,i,"latitudinal",r),this._halfBlur(o,e,n,n,i,"longitudinal",r)}_halfBlur(e,t,n,i,r,o,l){let u=this._renderer,d=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let a=3,c=new Ue(this._lodPlanes[i],d),h=d.uniforms,f=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*f):2*Math.PI/(2*Nr-1),_=r/g,m=isFinite(r)?1+Math.floor(a*_):Nr;m>Nr&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${Nr}`);let p=[],b=0;for(let A=0;A<Nr;++A){let D=A/_,S=Math.exp(-D*D/2);p.push(S),A===0?b+=S:A<m&&(b+=2*S)}for(let A=0;A<p.length;A++)p[A]=p[A]/b;h.envMap.value=e.texture,h.samples.value=m,h.weights.value=p,h.latitudinal.value=o==="latitudinal",l&&(h.poleAxis.value=l);let{_lodMax:M}=this;h.dTheta.value=g,h.mipInt.value=M-n;let y=this._sizeLods[i],T=3*y*(i>M-Xs?i-M+Xs:0),P=4*(this._cubeSize-y);nc(t,T,P,3*y,2*y),u.setRenderTarget(t),u.render(c,Hu)}};function F_(s){let e=[],t=[],n=[],i=s,r=s-Xs+1+Uf.length;for(let o=0;o<r;o++){let l=Math.pow(2,i);t.push(l);let u=1/l;o>s-Xs?u=Uf[o-s+Xs-1]:o===0&&(u=0),n.push(u);let d=1/(l-2),a=-d,c=1+d,h=[a,a,c,a,c,c,a,a,c,c,a,c],f=6,g=6,_=3,m=2,p=1,b=new Float32Array(_*g*f),M=new Float32Array(m*g*f),y=new Float32Array(p*g*f);for(let P=0;P<f;P++){let A=P%3*2/3-1,D=P>2?0:-1,S=[A,D,0,A+2/3,D,0,A+2/3,D+1,0,A,D,0,A+2/3,D+1,0,A,D+1,0];b.set(S,_*g*P),M.set(h,m*g*P);let E=[P,P,P,P,P,P];y.set(E,p*g*P)}let T=new Tt;T.setAttribute("position",new st(b,_)),T.setAttribute("uv",new st(M,m)),T.setAttribute("faceIndex",new st(y,p)),e.push(T),i>Xs&&i--}return{lodPlanes:e,sizeLods:t,sigmas:n}}function zf(s,e,t){let n=new un(s,e,t);return n.texture.mapping=Zo,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function nc(s,e,t,n,i){s.viewport.set(e,t,n,i),s.scissor.set(e,t,n,i)}function U_(s,e,t){let n=new Float32Array(Nr),i=new w(0,1,0);return new Rt({name:"SphericalGaussianBlur",defines:{n:Nr,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${s}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:ed(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Ti,depthTest:!1,depthWrite:!1})}function Vf(){return new Rt({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:ed(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Ti,depthTest:!1,depthWrite:!1})}function Gf(){return new Rt({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:ed(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Ti,depthTest:!1,depthWrite:!1})}function ed(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function B_(s){let e=new WeakMap,t=null;function n(l){if(l&&l.isTexture){let u=l.mapping,d=u===Ji||u===yl,a=u===Ar||u===Rr;if(d||a){let c=e.get(l),h=c!==void 0?c.texture.pmremVersion:0;if(l.isRenderTargetTexture&&l.pmremVersion!==h)return t===null&&(t=new si(s)),c=d?t.fromEquirectangular(l,c):t.fromCubemap(l,c),c.texture.pmremVersion=l.pmremVersion,e.set(l,c),c.texture;if(c!==void 0)return c.texture;{let f=l.image;return d&&f&&f.height>0||a&&f&&i(f)?(t===null&&(t=new si(s)),c=d?t.fromEquirectangular(l):t.fromCubemap(l),c.texture.pmremVersion=l.pmremVersion,e.set(l,c),l.addEventListener("dispose",r),c.texture):null}}}return l}function i(l){let u=0,d=6;for(let a=0;a<d;a++)l[a]!==void 0&&u++;return u===d}function r(l){let u=l.target;u.removeEventListener("dispose",r);let d=e.get(u);d!==void 0&&(e.delete(u),d.dispose())}function o(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:o}}function H_(s){let e={};function t(n){if(e[n]!==void 0)return e[n];let i;switch(n){case"WEBGL_depth_texture":i=s.getExtension("WEBGL_depth_texture")||s.getExtension("MOZ_WEBGL_depth_texture")||s.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":i=s.getExtension("EXT_texture_filter_anisotropic")||s.getExtension("MOZ_EXT_texture_filter_anisotropic")||s.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":i=s.getExtension("WEBGL_compressed_texture_s3tc")||s.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":i=s.getExtension("WEBGL_compressed_texture_pvrtc")||s.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:i=s.getExtension(n)}return e[n]=i,i}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){let i=t(n);return i===null&&xr("THREE.WebGLRenderer: "+n+" extension not supported."),i}}}function z_(s,e,t,n){let i={},r=new WeakMap;function o(c){let h=c.target;h.index!==null&&e.remove(h.index);for(let g in h.attributes)e.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete i[h.id];let f=r.get(h);f&&(e.remove(f),r.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,t.memory.geometries--}function l(c,h){return i[h.id]===!0||(h.addEventListener("dispose",o),i[h.id]=!0,t.memory.geometries++),h}function u(c){let h=c.attributes;for(let f in h)e.update(h[f],s.ARRAY_BUFFER)}function d(c){let h=[],f=c.index,g=c.attributes.position,_=0;if(f!==null){let b=f.array;_=f.version;for(let M=0,y=b.length;M<y;M+=3){let T=b[M+0],P=b[M+1],A=b[M+2];h.push(T,P,P,A,A,T)}}else if(g!==void 0){let b=g.array;_=g.version;for(let M=0,y=b.length/3-1;M<y;M+=3){let T=M+0,P=M+1,A=M+2;h.push(T,P,P,A,A,T)}}else return;let m=new(Nu(h)?wo:Co)(h,1);m.version=_;let p=r.get(c);p&&e.remove(p),r.set(c,m)}function a(c){let h=r.get(c);if(h){let f=c.index;f!==null&&h.version<f.version&&d(c)}else d(c);return r.get(c)}return{get:l,update:u,getWireframeAttribute:a}}function V_(s,e,t){let n;function i(h){n=h}let r,o;function l(h){r=h.type,o=h.bytesPerElement}function u(h,f){s.drawElements(n,f,r,h*o),t.update(f,n,1)}function d(h,f,g){g!==0&&(s.drawElementsInstanced(n,f,r,h*o,g),t.update(f,n,g))}function a(h,f,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,f,0,r,h,0,g);let m=0;for(let p=0;p<g;p++)m+=f[p];t.update(m,n,1)}function c(h,f,g,_){if(g===0)return;let m=e.get("WEBGL_multi_draw");if(m===null)for(let p=0;p<h.length;p++)d(h[p]/o,f[p],_[p]);else{m.multiDrawElementsInstancedWEBGL(n,f,0,r,h,0,_,0,g);let p=0;for(let b=0;b<g;b++)p+=f[b]*_[b];t.update(p,n,1)}}this.setMode=i,this.setIndex=l,this.render=u,this.renderInstances=d,this.renderMultiDraw=a,this.renderMultiDrawInstances=c}function G_(s){let e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,o,l){switch(t.calls++,o){case s.TRIANGLES:t.triangles+=l*(r/3);break;case s.LINES:t.lines+=l*(r/2);break;case s.LINE_STRIP:t.lines+=l*(r-1);break;case s.LINE_LOOP:t.lines+=l*r;break;case s.POINTS:t.points+=l*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",o);break}}function i(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:i,update:n}}function W_(s,e,t){let n=new WeakMap,i=new it;function r(o,l,u){let d=o.morphTargetInfluences,a=l.morphAttributes.position||l.morphAttributes.normal||l.morphAttributes.color,c=a!==void 0?a.length:0,h=n.get(l);if(h===void 0||h.count!==c){let E=function(){D.dispose(),n.delete(l),l.removeEventListener("dispose",E)};var f=E;h!==void 0&&h.texture.dispose();let g=l.morphAttributes.position!==void 0,_=l.morphAttributes.normal!==void 0,m=l.morphAttributes.color!==void 0,p=l.morphAttributes.position||[],b=l.morphAttributes.normal||[],M=l.morphAttributes.color||[],y=0;g===!0&&(y=1),_===!0&&(y=2),m===!0&&(y=3);let T=l.attributes.position.count*y,P=1;T>e.maxTextureSize&&(P=Math.ceil(T/e.maxTextureSize),T=e.maxTextureSize);let A=new Float32Array(T*P*4*c),D=new Eo(A,T,P,c);D.type=On,D.needsUpdate=!0;let S=y*4;for(let R=0;R<c;R++){let V=p[R],B=b[R],z=M[R],j=T*P*4*R;for(let Y=0;Y<V.count;Y++){let Z=Y*S;g===!0&&(i.fromBufferAttribute(V,Y),A[j+Z+0]=i.x,A[j+Z+1]=i.y,A[j+Z+2]=i.z,A[j+Z+3]=0),_===!0&&(i.fromBufferAttribute(B,Y),A[j+Z+4]=i.x,A[j+Z+5]=i.y,A[j+Z+6]=i.z,A[j+Z+7]=0),m===!0&&(i.fromBufferAttribute(z,Y),A[j+Z+8]=i.x,A[j+Z+9]=i.y,A[j+Z+10]=i.z,A[j+Z+11]=z.itemSize===4?i.w:1)}}h={count:c,texture:D,size:new Se(T,P)},n.set(l,h),l.addEventListener("dispose",E)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)u.getUniforms().setValue(s,"morphTexture",o.morphTexture,t);else{let g=0;for(let m=0;m<d.length;m++)g+=d[m];let _=l.morphTargetsRelative?1:1-g;u.getUniforms().setValue(s,"morphTargetBaseInfluence",_),u.getUniforms().setValue(s,"morphTargetInfluences",d)}u.getUniforms().setValue(s,"morphTargetsTexture",h.texture,t),u.getUniforms().setValue(s,"morphTargetsTextureSize",h.size)}return{update:r}}function X_(s,e,t,n){let i=new WeakMap;function r(u){let d=n.render.frame,a=u.geometry,c=e.get(u,a);if(i.get(c)!==d&&(e.update(c),i.set(c,d)),u.isInstancedMesh&&(u.hasEventListener("dispose",l)===!1&&u.addEventListener("dispose",l),i.get(u)!==d&&(t.update(u.instanceMatrix,s.ARRAY_BUFFER),u.instanceColor!==null&&t.update(u.instanceColor,s.ARRAY_BUFFER),i.set(u,d))),u.isSkinnedMesh){let h=u.skeleton;i.get(h)!==d&&(h.update(),i.set(h,d))}return c}function o(){i=new WeakMap}function l(u){let d=u.target;d.removeEventListener("dispose",l),t.remove(d.instanceMatrix),d.instanceColor!==null&&t.remove(d.instanceColor)}return{update:r,dispose:o}}var lp=new pn,Wf=new Fo(1,1),cp=new Eo,up=new Ka,dp=new Ao,Xf=[],Yf=[],qf=new Float32Array(16),jf=new Float32Array(9),Zf=new Float32Array(4);function qs(s,e,t){let n=s[0];if(n<=0||n>0)return s;let i=e*t,r=Xf[i];if(r===void 0&&(r=new Float32Array(i),Xf[i]=r),e!==0){n.toArray(r,0);for(let o=1,l=0;o!==e;++o)l+=t,s[o].toArray(r,l)}return r}function Nt(s,e){if(s.length!==e.length)return!1;for(let t=0,n=s.length;t<n;t++)if(s[t]!==e[t])return!1;return!0}function kt(s,e){for(let t=0,n=e.length;t<n;t++)s[t]=e[t]}function oc(s,e){let t=Yf[e];t===void 0&&(t=new Int32Array(e),Yf[e]=t);for(let n=0;n!==e;++n)t[n]=s.allocateTextureUnit();return t}function Y_(s,e){let t=this.cache;t[0]!==e&&(s.uniform1f(this.addr,e),t[0]=e)}function q_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;s.uniform2fv(this.addr,e),kt(t,e)}}function j_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(s.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Nt(t,e))return;s.uniform3fv(this.addr,e),kt(t,e)}}function Z_(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;s.uniform4fv(this.addr,e),kt(t,e)}}function $_(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;s.uniformMatrix2fv(this.addr,!1,e),kt(t,e)}else{if(Nt(t,n))return;Zf.set(n),s.uniformMatrix2fv(this.addr,!1,Zf),kt(t,n)}}function K_(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;s.uniformMatrix3fv(this.addr,!1,e),kt(t,e)}else{if(Nt(t,n))return;jf.set(n),s.uniformMatrix3fv(this.addr,!1,jf),kt(t,n)}}function J_(s,e){let t=this.cache,n=e.elements;if(n===void 0){if(Nt(t,e))return;s.uniformMatrix4fv(this.addr,!1,e),kt(t,e)}else{if(Nt(t,n))return;qf.set(n),s.uniformMatrix4fv(this.addr,!1,qf),kt(t,n)}}function Q_(s,e){let t=this.cache;t[0]!==e&&(s.uniform1i(this.addr,e),t[0]=e)}function ev(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;s.uniform2iv(this.addr,e),kt(t,e)}}function tv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;s.uniform3iv(this.addr,e),kt(t,e)}}function nv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;s.uniform4iv(this.addr,e),kt(t,e)}}function iv(s,e){let t=this.cache;t[0]!==e&&(s.uniform1ui(this.addr,e),t[0]=e)}function rv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(s.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Nt(t,e))return;s.uniform2uiv(this.addr,e),kt(t,e)}}function sv(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(s.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Nt(t,e))return;s.uniform3uiv(this.addr,e),kt(t,e)}}function ov(s,e){let t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(s.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Nt(t,e))return;s.uniform4uiv(this.addr,e),kt(t,e)}}function av(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i);let r;this.type===s.SAMPLER_2D_SHADOW?(Wf.compareFunction=Du,r=Wf):r=lp,t.setTexture2D(e||r,i)}function lv(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture3D(e||up,i)}function cv(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTextureCube(e||dp,i)}function uv(s,e,t){let n=this.cache,i=t.allocateTextureUnit();n[0]!==i&&(s.uniform1i(this.addr,i),n[0]=i),t.setTexture2DArray(e||cp,i)}function dv(s){switch(s){case 5126:return Y_;case 35664:return q_;case 35665:return j_;case 35666:return Z_;case 35674:return $_;case 35675:return K_;case 35676:return J_;case 5124:case 35670:return Q_;case 35667:case 35671:return ev;case 35668:case 35672:return tv;case 35669:case 35673:return nv;case 5125:return iv;case 36294:return rv;case 36295:return sv;case 36296:return ov;case 35678:case 36198:case 36298:case 36306:case 35682:return av;case 35679:case 36299:case 36307:return lv;case 35680:case 36300:case 36308:case 36293:return cv;case 36289:case 36303:case 36311:case 36292:return uv}}function hv(s,e){s.uniform1fv(this.addr,e)}function fv(s,e){let t=qs(e,this.size,2);s.uniform2fv(this.addr,t)}function pv(s,e){let t=qs(e,this.size,3);s.uniform3fv(this.addr,t)}function mv(s,e){let t=qs(e,this.size,4);s.uniform4fv(this.addr,t)}function gv(s,e){let t=qs(e,this.size,4);s.uniformMatrix2fv(this.addr,!1,t)}function _v(s,e){let t=qs(e,this.size,9);s.uniformMatrix3fv(this.addr,!1,t)}function vv(s,e){let t=qs(e,this.size,16);s.uniformMatrix4fv(this.addr,!1,t)}function yv(s,e){s.uniform1iv(this.addr,e)}function xv(s,e){s.uniform2iv(this.addr,e)}function bv(s,e){s.uniform3iv(this.addr,e)}function Mv(s,e){s.uniform4iv(this.addr,e)}function Sv(s,e){s.uniform1uiv(this.addr,e)}function Ev(s,e){s.uniform2uiv(this.addr,e)}function Cv(s,e){s.uniform3uiv(this.addr,e)}function wv(s,e){s.uniform4uiv(this.addr,e)}function Tv(s,e,t){let n=this.cache,i=e.length,r=oc(t,i);Nt(n,r)||(s.uniform1iv(this.addr,r),kt(n,r));for(let o=0;o!==i;++o)t.setTexture2D(e[o]||lp,r[o])}function Av(s,e,t){let n=this.cache,i=e.length,r=oc(t,i);Nt(n,r)||(s.uniform1iv(this.addr,r),kt(n,r));for(let o=0;o!==i;++o)t.setTexture3D(e[o]||up,r[o])}function Rv(s,e,t){let n=this.cache,i=e.length,r=oc(t,i);Nt(n,r)||(s.uniform1iv(this.addr,r),kt(n,r));for(let o=0;o!==i;++o)t.setTextureCube(e[o]||dp,r[o])}function Pv(s,e,t){let n=this.cache,i=e.length,r=oc(t,i);Nt(n,r)||(s.uniform1iv(this.addr,r),kt(n,r));for(let o=0;o!==i;++o)t.setTexture2DArray(e[o]||cp,r[o])}function Iv(s){switch(s){case 5126:return hv;case 35664:return fv;case 35665:return pv;case 35666:return mv;case 35674:return gv;case 35675:return _v;case 35676:return vv;case 5124:case 35670:return yv;case 35667:case 35671:return xv;case 35668:case 35672:return bv;case 35669:case 35673:return Mv;case 5125:return Sv;case 36294:return Ev;case 36295:return Cv;case 36296:return wv;case 35678:case 36198:case 36298:case 36306:case 35682:return Tv;case 35679:case 36299:case 36307:return Av;case 35680:case 36300:case 36308:case 36293:return Rv;case 36289:case 36303:case 36311:case 36292:return Pv}}var Yu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=dv(t.type)}},qu=class{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Iv(t.type)}},ju=class{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){let i=this.seq;for(let r=0,o=i.length;r!==o;++r){let l=i[r];l.setValue(e,t[l.id],n)}}},Xu=/(\w+)(\])?(\[|\.)?/g;function $f(s,e){s.seq.push(e),s.map[e.id]=e}function Dv(s,e,t){let n=s.name,i=n.length;for(Xu.lastIndex=0;;){let r=Xu.exec(n),o=Xu.lastIndex,l=r[1],u=r[2]==="]",d=r[3];if(u&&(l=l|0),d===void 0||d==="["&&o+2===i){$f(t,d===void 0?new Yu(l,s,e):new qu(l,s,e));break}else{let c=t.map[l];c===void 0&&(c=new ju(l),$f(t,c)),t=c}}}var Ys=class{constructor(e,t){this.seq=[],this.map={};let n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let i=0;i<n;++i){let r=e.getActiveUniform(t,i),o=e.getUniformLocation(t,r.name);Dv(r,o,this)}}setValue(e,t,n,i){let r=this.map[t];r!==void 0&&r.setValue(e,n,i)}setOptional(e,t,n){let i=t[n];i!==void 0&&this.setValue(e,n,i)}static upload(e,t,n,i){for(let r=0,o=t.length;r!==o;++r){let l=t[r],u=n[l.id];u.needsUpdate!==!1&&l.setValue(e,u.value,i)}}static seqWithValue(e,t){let n=[];for(let i=0,r=e.length;i!==r;++i){let o=e[i];o.id in t&&n.push(o)}return n}};function Kf(s,e,t){let n=s.createShader(e);return s.shaderSource(n,t),s.compileShader(n),n}var Ov=37297,Lv=0;function Nv(s,e){let t=s.split(`
`),n=[],i=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let o=i;o<r;o++){let l=o+1;n.push(`${l===e?">":" "} ${l}: ${t[o]}`)}return n.join(`
`)}var Jf=new Ge;function kv(s){je._getMatrix(Jf,je.workingColorSpace,s);let e=`mat3( ${Jf.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(s)){case Mo:return[e,"LinearTransferOETF"];case ct:return[e,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",s),[e,"LinearTransferOETF"]}}function Qf(s,e,t){let n=s.getShaderParameter(e,s.COMPILE_STATUS),r=(s.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";let o=/ERROR: 0:(\d+)/.exec(r);if(o){let l=parseInt(o[1]);return t.toUpperCase()+`

`+r+`

`+Nv(s.getShaderSource(e),l)}else return r}function Fv(s,e){let t=kv(e);return[`vec4 ${s}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Uv(s,e){let t;switch(e){case hf:t="Linear";break;case ff:t="Reinhard";break;case pf:t="Cineon";break;case Ki:t="ACESFilmic";break;case gf:t="AgX";break;case _f:t="Neutral";break;case mf:t="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+s+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}var ic=new w;function Bv(){je.getLuminanceCoefficients(ic);let s=ic.x.toFixed(4),e=ic.y.toFixed(4),t=ic.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${s}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Hv(s){return[s.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",s.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ia).join(`
`)}function zv(s){let e=[];for(let t in s){let n=s[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Vv(s,e){let t={},n=s.getProgramParameter(e,s.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){let r=s.getActiveAttrib(e,i),o=r.name,l=1;r.type===s.FLOAT_MAT2&&(l=2),r.type===s.FLOAT_MAT3&&(l=3),r.type===s.FLOAT_MAT4&&(l=4),t[o]={type:r.type,location:s.getAttribLocation(e,o),locationSize:l}}return t}function ia(s){return s!==""}function ep(s,e){let t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return s.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function tp(s,e){return s.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}var Gv=/^[ \t]*#include +<([\w\d./]+)>/gm;function Zu(s){return s.replace(Gv,Xv)}var Wv=new Map;function Xv(s,e){let t=Xe[e];if(t===void 0){let n=Wv.get(e);if(n!==void 0)t=Xe[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Zu(t)}var Yv=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function np(s){return s.replace(Yv,qv)}function qv(s,e,t,n){let i="";for(let r=parseInt(e);r<parseInt(t);r++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return i}function ip(s){let e=`precision ${s.precision} float;
	precision ${s.precision} int;
	precision ${s.precision} sampler2D;
	precision ${s.precision} samplerCube;
	precision ${s.precision} sampler3D;
	precision ${s.precision} sampler2DArray;
	precision ${s.precision} sampler2DShadow;
	precision ${s.precision} samplerCubeShadow;
	precision ${s.precision} sampler2DArrayShadow;
	precision ${s.precision} isampler2D;
	precision ${s.precision} isampler3D;
	precision ${s.precision} isamplerCube;
	precision ${s.precision} isampler2DArray;
	precision ${s.precision} usampler2D;
	precision ${s.precision} usampler3D;
	precision ${s.precision} usamplerCube;
	precision ${s.precision} usampler2DArray;
	`;return s.precision==="highp"?e+=`
#define HIGH_PRECISION`:s.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:s.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function jv(s){let e="SHADOWMAP_TYPE_BASIC";return s.shadowMapType===yu?e="SHADOWMAP_TYPE_PCF":s.shadowMapType===Fs?e="SHADOWMAP_TYPE_PCF_SOFT":s.shadowMapType===ii&&(e="SHADOWMAP_TYPE_VSM"),e}function Zv(s){let e="ENVMAP_TYPE_CUBE";if(s.envMap)switch(s.envMapMode){case Ar:case Rr:e="ENVMAP_TYPE_CUBE";break;case Zo:e="ENVMAP_TYPE_CUBE_UV";break}return e}function $v(s){let e="ENVMAP_MODE_REFLECTION";if(s.envMap)switch(s.envMapMode){case Rr:e="ENVMAP_MODE_REFRACTION";break}return e}function Kv(s){let e="ENVMAP_BLENDING_NONE";if(s.envMap)switch(s.combine){case Mu:e="ENVMAP_BLENDING_MULTIPLY";break;case uf:e="ENVMAP_BLENDING_MIX";break;case df:e="ENVMAP_BLENDING_ADD";break}return e}function Jv(s){let e=s.envMapCubeUVHeight;if(e===null)return null;let t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Qv(s,e,t,n){let i=s.getContext(),r=t.defines,o=t.vertexShader,l=t.fragmentShader,u=jv(t),d=Zv(t),a=$v(t),c=Kv(t),h=Jv(t),f=Hv(t),g=zv(r),_=i.createProgram(),m,p,b=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ia).join(`
`),m.length>0&&(m+=`
`),p=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ia).join(`
`),p.length>0&&(p+=`
`)):(m=[ip(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+a:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ia).join(`
`),p=[ip(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.envMap?"#define "+a:"",t.envMap?"#define "+c:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+u:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",t.reversedDepthBuffer?"#define USE_REVERSEDEPTHBUF":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==Ai?"#define TONE_MAPPING":"",t.toneMapping!==Ai?Xe.tonemapping_pars_fragment:"",t.toneMapping!==Ai?Uv("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Xe.colorspace_pars_fragment,Fv("linearToOutputTexel",t.outputColorSpace),Bv(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ia).join(`
`)),o=Zu(o),o=ep(o,t),o=tp(o,t),l=Zu(l),l=ep(l,t),l=tp(l,t),o=np(o),l=np(l),t.isRawShaderMaterial!==!0&&(b=`#version 300 es
`,m=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,p=["#define varying in",t.glslVersion===Ou?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Ou?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+p);let M=b+m+o,y=b+p+l,T=Kf(i,i.VERTEX_SHADER,M),P=Kf(i,i.FRAGMENT_SHADER,y);i.attachShader(_,T),i.attachShader(_,P),t.index0AttributeName!==void 0?i.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&i.bindAttribLocation(_,0,"position"),i.linkProgram(_);function A(R){if(s.debug.checkShaderErrors){let V=i.getProgramInfoLog(_)||"",B=i.getShaderInfoLog(T)||"",z=i.getShaderInfoLog(P)||"",j=V.trim(),Y=B.trim(),Z=z.trim(),H=!0,te=!0;if(i.getProgramParameter(_,i.LINK_STATUS)===!1)if(H=!1,typeof s.debug.onShaderError=="function")s.debug.onShaderError(i,_,T,P);else{let ue=Qf(i,T,"vertex"),ye=Qf(i,P,"fragment");console.error("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(_,i.VALIDATE_STATUS)+`

Material Name: `+R.name+`
Material Type: `+R.type+`

Program Info Log: `+j+`
`+ue+`
`+ye)}else j!==""?console.warn("THREE.WebGLProgram: Program Info Log:",j):(Y===""||Z==="")&&(te=!1);te&&(R.diagnostics={runnable:H,programLog:j,vertexShader:{log:Y,prefix:m},fragmentShader:{log:Z,prefix:p}})}i.deleteShader(T),i.deleteShader(P),D=new Ys(i,_),S=Vv(i,_)}let D;this.getUniforms=function(){return D===void 0&&A(this),D};let S;this.getAttributes=function(){return S===void 0&&A(this),S};let E=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return E===!1&&(E=i.getProgramParameter(_,Ov)),E},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Lv++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=T,this.fragmentShader=P,this}var ey=0,$u=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){let t=e.vertexShader,n=e.fragmentShader,i=this._getShaderStage(t),r=this._getShaderStage(n),o=this._getShaderCacheForMaterial(e);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(r)===!1&&(o.add(r),r.usedTimes++),this}remove(e){let t=this.materialCache.get(e);for(let n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){let t=this.materialCache,n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){let t=this.shaderCache,n=t.get(e);return n===void 0&&(n=new Ku(e),t.set(e,n)),n}},Ku=class{constructor(e){this.id=ey++,this.code=e,this.usedTimes=0}};function ty(s,e,t,n,i,r,o){let l=new Ts,u=new $u,d=new Set,a=[],c=i.logarithmicDepthBuffer,h=i.vertexTextures,f=i.precision,g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(S){return d.add(S),S===0?"uv":`uv${S}`}function m(S,E,R,V,B){let z=V.fog,j=B.geometry,Y=S.isMeshStandardMaterial?V.environment:null,Z=(S.isMeshStandardMaterial?t:e).get(S.envMap||Y),H=Z&&Z.mapping===Zo?Z.image.height:null,te=g[S.type];S.precision!==null&&(f=i.getMaxPrecision(S.precision),f!==S.precision&&console.warn("THREE.WebGLProgram.getParameters:",S.precision,"not supported, using",f,"instead."));let ue=j.morphAttributes.position||j.morphAttributes.normal||j.morphAttributes.color,ye=ue!==void 0?ue.length:0,He=0;j.morphAttributes.position!==void 0&&(He=1),j.morphAttributes.normal!==void 0&&(He=2),j.morphAttributes.color!==void 0&&(He=3);let at,tt,W,se;if(te){let ot=ri[te];at=ot.vertexShader,tt=ot.fragmentShader}else at=S.vertexShader,tt=S.fragmentShader,u.update(S),W=u.getVertexShaderID(S),se=u.getFragmentShaderID(S);let ne=s.getRenderTarget(),Pe=s.state.buffers.depth.getReversed(),we=B.isInstancedMesh===!0,Oe=B.isBatchedMesh===!0,bt=!!S.map,Qe=!!S.matcap,I=!!Z,mt=!!S.aoMap,Ie=!!S.lightMap,rt=!!S.bumpMap,Ce=!!S.normalMap,xt=!!S.displacementMap,ge=!!S.emissiveMap,Ye=!!S.metalnessMap,Ut=!!S.roughnessMap,At=S.anisotropy>0,C=S.clearcoat>0,v=S.dispersion>0,k=S.iridescence>0,X=S.sheen>0,$=S.transmission>0,G=At&&!!S.anisotropyMap,Ee=C&&!!S.clearcoatMap,ie=C&&!!S.clearcoatNormalMap,xe=C&&!!S.clearcoatRoughnessMap,be=k&&!!S.iridescenceMap,Q=k&&!!S.iridescenceThicknessMap,ce=X&&!!S.sheenColorMap,Ne=X&&!!S.sheenRoughnessMap,Me=!!S.specularMap,ae=!!S.specularColorMap,We=!!S.specularIntensityMap,O=$&&!!S.transmissionMap,ee=$&&!!S.thicknessMap,re=!!S.gradientMap,pe=!!S.alphaMap,K=S.alphaTest>0,q=!!S.alphaHash,ve=!!S.extensions,Ve=Ai;S.toneMapped&&(ne===null||ne.isXRRenderTarget===!0)&&(Ve=s.toneMapping);let gt={shaderID:te,shaderType:S.type,shaderName:S.name,vertexShader:at,fragmentShader:tt,defines:S.defines,customVertexShaderID:W,customFragmentShaderID:se,isRawShaderMaterial:S.isRawShaderMaterial===!0,glslVersion:S.glslVersion,precision:f,batching:Oe,batchingColor:Oe&&B._colorsTexture!==null,instancing:we,instancingColor:we&&B.instanceColor!==null,instancingMorph:we&&B.morphTexture!==null,supportsVertexTextures:h,outputColorSpace:ne===null?s.outputColorSpace:ne.isXRRenderTarget===!0?ne.texture.colorSpace:Lt,alphaToCoverage:!!S.alphaToCoverage,map:bt,matcap:Qe,envMap:I,envMapMode:I&&Z.mapping,envMapCubeUVHeight:H,aoMap:mt,lightMap:Ie,bumpMap:rt,normalMap:Ce,displacementMap:h&&xt,emissiveMap:ge,normalMapObjectSpace:Ce&&S.normalMapType===Ef,normalMapTangentSpace:Ce&&S.normalMapType===Iu,metalnessMap:Ye,roughnessMap:Ut,anisotropy:At,anisotropyMap:G,clearcoat:C,clearcoatMap:Ee,clearcoatNormalMap:ie,clearcoatRoughnessMap:xe,dispersion:v,iridescence:k,iridescenceMap:be,iridescenceThicknessMap:Q,sheen:X,sheenColorMap:ce,sheenRoughnessMap:Ne,specularMap:Me,specularColorMap:ae,specularIntensityMap:We,transmission:$,transmissionMap:O,thicknessMap:ee,gradientMap:re,opaque:S.transparent===!1&&S.blending===mr&&S.alphaToCoverage===!1,alphaMap:pe,alphaTest:K,alphaHash:q,combine:S.combine,mapUv:bt&&_(S.map.channel),aoMapUv:mt&&_(S.aoMap.channel),lightMapUv:Ie&&_(S.lightMap.channel),bumpMapUv:rt&&_(S.bumpMap.channel),normalMapUv:Ce&&_(S.normalMap.channel),displacementMapUv:xt&&_(S.displacementMap.channel),emissiveMapUv:ge&&_(S.emissiveMap.channel),metalnessMapUv:Ye&&_(S.metalnessMap.channel),roughnessMapUv:Ut&&_(S.roughnessMap.channel),anisotropyMapUv:G&&_(S.anisotropyMap.channel),clearcoatMapUv:Ee&&_(S.clearcoatMap.channel),clearcoatNormalMapUv:ie&&_(S.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:xe&&_(S.clearcoatRoughnessMap.channel),iridescenceMapUv:be&&_(S.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&_(S.iridescenceThicknessMap.channel),sheenColorMapUv:ce&&_(S.sheenColorMap.channel),sheenRoughnessMapUv:Ne&&_(S.sheenRoughnessMap.channel),specularMapUv:Me&&_(S.specularMap.channel),specularColorMapUv:ae&&_(S.specularColorMap.channel),specularIntensityMapUv:We&&_(S.specularIntensityMap.channel),transmissionMapUv:O&&_(S.transmissionMap.channel),thicknessMapUv:ee&&_(S.thicknessMap.channel),alphaMapUv:pe&&_(S.alphaMap.channel),vertexTangents:!!j.attributes.tangent&&(Ce||At),vertexColors:S.vertexColors,vertexAlphas:S.vertexColors===!0&&!!j.attributes.color&&j.attributes.color.itemSize===4,pointsUvs:B.isPoints===!0&&!!j.attributes.uv&&(bt||pe),fog:!!z,useFog:S.fog===!0,fogExp2:!!z&&z.isFogExp2,flatShading:S.flatShading===!0&&S.wireframe===!1,sizeAttenuation:S.sizeAttenuation===!0,logarithmicDepthBuffer:c,reversedDepthBuffer:Pe,skinning:B.isSkinnedMesh===!0,morphTargets:j.morphAttributes.position!==void 0,morphNormals:j.morphAttributes.normal!==void 0,morphColors:j.morphAttributes.color!==void 0,morphTargetsCount:ye,morphTextureStride:He,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:o.numPlanes,numClipIntersection:o.numIntersection,dithering:S.dithering,shadowMapEnabled:s.shadowMap.enabled&&R.length>0,shadowMapType:s.shadowMap.type,toneMapping:Ve,decodeVideoTexture:bt&&S.map.isVideoTexture===!0&&je.getTransfer(S.map.colorSpace)===ct,decodeVideoTextureEmissive:ge&&S.emissiveMap.isVideoTexture===!0&&je.getTransfer(S.emissiveMap.colorSpace)===ct,premultipliedAlpha:S.premultipliedAlpha,doubleSided:S.side===Vt,flipSided:S.side===jt,useDepthPacking:S.depthPacking>=0,depthPacking:S.depthPacking||0,index0AttributeName:S.index0AttributeName,extensionClipCullDistance:ve&&S.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ve&&S.extensions.multiDraw===!0||Oe)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:S.customProgramCacheKey()};return gt.vertexUv1s=d.has(1),gt.vertexUv2s=d.has(2),gt.vertexUv3s=d.has(3),d.clear(),gt}function p(S){let E=[];if(S.shaderID?E.push(S.shaderID):(E.push(S.customVertexShaderID),E.push(S.customFragmentShaderID)),S.defines!==void 0)for(let R in S.defines)E.push(R),E.push(S.defines[R]);return S.isRawShaderMaterial===!1&&(b(E,S),M(E,S),E.push(s.outputColorSpace)),E.push(S.customProgramCacheKey),E.join()}function b(S,E){S.push(E.precision),S.push(E.outputColorSpace),S.push(E.envMapMode),S.push(E.envMapCubeUVHeight),S.push(E.mapUv),S.push(E.alphaMapUv),S.push(E.lightMapUv),S.push(E.aoMapUv),S.push(E.bumpMapUv),S.push(E.normalMapUv),S.push(E.displacementMapUv),S.push(E.emissiveMapUv),S.push(E.metalnessMapUv),S.push(E.roughnessMapUv),S.push(E.anisotropyMapUv),S.push(E.clearcoatMapUv),S.push(E.clearcoatNormalMapUv),S.push(E.clearcoatRoughnessMapUv),S.push(E.iridescenceMapUv),S.push(E.iridescenceThicknessMapUv),S.push(E.sheenColorMapUv),S.push(E.sheenRoughnessMapUv),S.push(E.specularMapUv),S.push(E.specularColorMapUv),S.push(E.specularIntensityMapUv),S.push(E.transmissionMapUv),S.push(E.thicknessMapUv),S.push(E.combine),S.push(E.fogExp2),S.push(E.sizeAttenuation),S.push(E.morphTargetsCount),S.push(E.morphAttributeCount),S.push(E.numDirLights),S.push(E.numPointLights),S.push(E.numSpotLights),S.push(E.numSpotLightMaps),S.push(E.numHemiLights),S.push(E.numRectAreaLights),S.push(E.numDirLightShadows),S.push(E.numPointLightShadows),S.push(E.numSpotLightShadows),S.push(E.numSpotLightShadowsWithMaps),S.push(E.numLightProbes),S.push(E.shadowMapType),S.push(E.toneMapping),S.push(E.numClippingPlanes),S.push(E.numClipIntersection),S.push(E.depthPacking)}function M(S,E){l.disableAll(),E.supportsVertexTextures&&l.enable(0),E.instancing&&l.enable(1),E.instancingColor&&l.enable(2),E.instancingMorph&&l.enable(3),E.matcap&&l.enable(4),E.envMap&&l.enable(5),E.normalMapObjectSpace&&l.enable(6),E.normalMapTangentSpace&&l.enable(7),E.clearcoat&&l.enable(8),E.iridescence&&l.enable(9),E.alphaTest&&l.enable(10),E.vertexColors&&l.enable(11),E.vertexAlphas&&l.enable(12),E.vertexUv1s&&l.enable(13),E.vertexUv2s&&l.enable(14),E.vertexUv3s&&l.enable(15),E.vertexTangents&&l.enable(16),E.anisotropy&&l.enable(17),E.alphaHash&&l.enable(18),E.batching&&l.enable(19),E.dispersion&&l.enable(20),E.batchingColor&&l.enable(21),E.gradientMap&&l.enable(22),S.push(l.mask),l.disableAll(),E.fog&&l.enable(0),E.useFog&&l.enable(1),E.flatShading&&l.enable(2),E.logarithmicDepthBuffer&&l.enable(3),E.reversedDepthBuffer&&l.enable(4),E.skinning&&l.enable(5),E.morphTargets&&l.enable(6),E.morphNormals&&l.enable(7),E.morphColors&&l.enable(8),E.premultipliedAlpha&&l.enable(9),E.shadowMapEnabled&&l.enable(10),E.doubleSided&&l.enable(11),E.flipSided&&l.enable(12),E.useDepthPacking&&l.enable(13),E.dithering&&l.enable(14),E.transmission&&l.enable(15),E.sheen&&l.enable(16),E.opaque&&l.enable(17),E.pointsUvs&&l.enable(18),E.decodeVideoTexture&&l.enable(19),E.decodeVideoTextureEmissive&&l.enable(20),E.alphaToCoverage&&l.enable(21),S.push(l.mask)}function y(S){let E=g[S.type],R;if(E){let V=ri[E];R=Nf.clone(V.uniforms)}else R=S.uniforms;return R}function T(S,E){let R;for(let V=0,B=a.length;V<B;V++){let z=a[V];if(z.cacheKey===E){R=z,++R.usedTimes;break}}return R===void 0&&(R=new Qv(s,E,S,r),a.push(R)),R}function P(S){if(--S.usedTimes===0){let E=a.indexOf(S);a[E]=a[a.length-1],a.pop(),S.destroy()}}function A(S){u.remove(S)}function D(){u.dispose()}return{getParameters:m,getProgramCacheKey:p,getUniforms:y,acquireProgram:T,releaseProgram:P,releaseShaderCache:A,programs:a,dispose:D}}function ny(){let s=new WeakMap;function e(o){return s.has(o)}function t(o){let l=s.get(o);return l===void 0&&(l={},s.set(o,l)),l}function n(o){s.delete(o)}function i(o,l,u){s.get(o)[l]=u}function r(){s=new WeakMap}return{has:e,get:t,remove:n,update:i,dispose:r}}function iy(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.material.id!==e.material.id?s.material.id-e.material.id:s.z!==e.z?s.z-e.z:s.id-e.id}function rp(s,e){return s.groupOrder!==e.groupOrder?s.groupOrder-e.groupOrder:s.renderOrder!==e.renderOrder?s.renderOrder-e.renderOrder:s.z!==e.z?e.z-s.z:s.id-e.id}function sp(){let s=[],e=0,t=[],n=[],i=[];function r(){e=0,t.length=0,n.length=0,i.length=0}function o(c,h,f,g,_,m){let p=s[e];return p===void 0?(p={id:c.id,object:c,geometry:h,material:f,groupOrder:g,renderOrder:c.renderOrder,z:_,group:m},s[e]=p):(p.id=c.id,p.object=c,p.geometry=h,p.material=f,p.groupOrder=g,p.renderOrder=c.renderOrder,p.z=_,p.group=m),e++,p}function l(c,h,f,g,_,m){let p=o(c,h,f,g,_,m);f.transmission>0?n.push(p):f.transparent===!0?i.push(p):t.push(p)}function u(c,h,f,g,_,m){let p=o(c,h,f,g,_,m);f.transmission>0?n.unshift(p):f.transparent===!0?i.unshift(p):t.unshift(p)}function d(c,h){t.length>1&&t.sort(c||iy),n.length>1&&n.sort(h||rp),i.length>1&&i.sort(h||rp)}function a(){for(let c=e,h=s.length;c<h;c++){let f=s[c];if(f.id===null)break;f.id=null,f.object=null,f.geometry=null,f.material=null,f.group=null}}return{opaque:t,transmissive:n,transparent:i,init:r,push:l,unshift:u,finish:a,sort:d}}function ry(){let s=new WeakMap;function e(n,i){let r=s.get(n),o;return r===void 0?(o=new sp,s.set(n,[o])):i>=r.length?(o=new sp,r.push(o)):o=r[i],o}function t(){s=new WeakMap}return{get:e,dispose:t}}function sy(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new w,color:new de};break;case"SpotLight":t={position:new w,direction:new w,color:new de,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new w,color:new de,distance:0,decay:0};break;case"HemisphereLight":t={direction:new w,skyColor:new de,groundColor:new de};break;case"RectAreaLight":t={color:new de,position:new w,halfWidth:new w,halfHeight:new w};break}return s[e.id]=t,t}}}function oy(){let s={};return{get:function(e){if(s[e.id]!==void 0)return s[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Se,shadowCameraNear:1,shadowCameraFar:1e3};break}return s[e.id]=t,t}}}var ay=0;function ly(s,e){return(e.castShadow?2:0)-(s.castShadow?2:0)+(e.map?1:0)-(s.map?1:0)}function cy(s){let e=new sy,t=oy(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let d=0;d<9;d++)n.probe.push(new w);let i=new w,r=new ke,o=new ke;function l(d){let a=0,c=0,h=0;for(let S=0;S<9;S++)n.probe[S].set(0,0,0);let f=0,g=0,_=0,m=0,p=0,b=0,M=0,y=0,T=0,P=0,A=0;d.sort(ly);for(let S=0,E=d.length;S<E;S++){let R=d[S],V=R.color,B=R.intensity,z=R.distance,j=R.shadow&&R.shadow.map?R.shadow.map.texture:null;if(R.isAmbientLight)a+=V.r*B,c+=V.g*B,h+=V.b*B;else if(R.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(R.sh.coefficients[Y],B);A++}else if(R.isDirectionalLight){let Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity),R.castShadow){let Z=R.shadow,H=t.get(R);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,n.directionalShadow[f]=H,n.directionalShadowMap[f]=j,n.directionalShadowMatrix[f]=R.shadow.matrix,b++}n.directional[f]=Y,f++}else if(R.isSpotLight){let Y=e.get(R);Y.position.setFromMatrixPosition(R.matrixWorld),Y.color.copy(V).multiplyScalar(B),Y.distance=z,Y.coneCos=Math.cos(R.angle),Y.penumbraCos=Math.cos(R.angle*(1-R.penumbra)),Y.decay=R.decay,n.spot[_]=Y;let Z=R.shadow;if(R.map&&(n.spotLightMap[T]=R.map,T++,Z.updateMatrices(R),R.castShadow&&P++),n.spotLightMatrix[_]=Z.matrix,R.castShadow){let H=t.get(R);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,n.spotShadow[_]=H,n.spotShadowMap[_]=j,y++}_++}else if(R.isRectAreaLight){let Y=e.get(R);Y.color.copy(V).multiplyScalar(B),Y.halfWidth.set(R.width*.5,0,0),Y.halfHeight.set(0,R.height*.5,0),n.rectArea[m]=Y,m++}else if(R.isPointLight){let Y=e.get(R);if(Y.color.copy(R.color).multiplyScalar(R.intensity),Y.distance=R.distance,Y.decay=R.decay,R.castShadow){let Z=R.shadow,H=t.get(R);H.shadowIntensity=Z.intensity,H.shadowBias=Z.bias,H.shadowNormalBias=Z.normalBias,H.shadowRadius=Z.radius,H.shadowMapSize=Z.mapSize,H.shadowCameraNear=Z.camera.near,H.shadowCameraFar=Z.camera.far,n.pointShadow[g]=H,n.pointShadowMap[g]=j,n.pointShadowMatrix[g]=R.shadow.matrix,M++}n.point[g]=Y,g++}else if(R.isHemisphereLight){let Y=e.get(R);Y.skyColor.copy(R.color).multiplyScalar(B),Y.groundColor.copy(R.groundColor).multiplyScalar(B),n.hemi[p]=Y,p++}}m>0&&(s.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=oe.LTC_FLOAT_1,n.rectAreaLTC2=oe.LTC_FLOAT_2):(n.rectAreaLTC1=oe.LTC_HALF_1,n.rectAreaLTC2=oe.LTC_HALF_2)),n.ambient[0]=a,n.ambient[1]=c,n.ambient[2]=h;let D=n.hash;(D.directionalLength!==f||D.pointLength!==g||D.spotLength!==_||D.rectAreaLength!==m||D.hemiLength!==p||D.numDirectionalShadows!==b||D.numPointShadows!==M||D.numSpotShadows!==y||D.numSpotMaps!==T||D.numLightProbes!==A)&&(n.directional.length=f,n.spot.length=_,n.rectArea.length=m,n.point.length=g,n.hemi.length=p,n.directionalShadow.length=b,n.directionalShadowMap.length=b,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=y,n.spotShadowMap.length=y,n.directionalShadowMatrix.length=b,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=y+T-P,n.spotLightMap.length=T,n.numSpotLightShadowsWithMaps=P,n.numLightProbes=A,D.directionalLength=f,D.pointLength=g,D.spotLength=_,D.rectAreaLength=m,D.hemiLength=p,D.numDirectionalShadows=b,D.numPointShadows=M,D.numSpotShadows=y,D.numSpotMaps=T,D.numLightProbes=A,n.version=ay++)}function u(d,a){let c=0,h=0,f=0,g=0,_=0,m=a.matrixWorldInverse;for(let p=0,b=d.length;p<b;p++){let M=d[p];if(M.isDirectionalLight){let y=n.directional[c];y.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),c++}else if(M.isSpotLight){let y=n.spot[f];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),y.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),y.direction.sub(i),y.direction.transformDirection(m),f++}else if(M.isRectAreaLight){let y=n.rectArea[g];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),o.identity(),r.copy(M.matrixWorld),r.premultiply(m),o.extractRotation(r),y.halfWidth.set(M.width*.5,0,0),y.halfHeight.set(0,M.height*.5,0),y.halfWidth.applyMatrix4(o),y.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){let y=n.point[h];y.position.setFromMatrixPosition(M.matrixWorld),y.position.applyMatrix4(m),h++}else if(M.isHemisphereLight){let y=n.hemi[_];y.direction.setFromMatrixPosition(M.matrixWorld),y.direction.transformDirection(m),_++}}}return{setup:l,setupView:u,state:n}}function op(s){let e=new cy(s),t=[],n=[];function i(a){d.camera=a,t.length=0,n.length=0}function r(a){t.push(a)}function o(a){n.push(a)}function l(){e.setup(t)}function u(a){e.setupView(t,a)}let d={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:i,state:d,setupLights:l,setupLightsView:u,pushLight:r,pushShadow:o}}function uy(s){let e=new WeakMap;function t(i,r=0){let o=e.get(i),l;return o===void 0?(l=new op(s),e.set(i,[l])):r>=o.length?(l=new op(s),o.push(l)):l=o[r],l}function n(){e=new WeakMap}return{get:t,dispose:n}}var dy=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,hy=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function fy(s,e,t){let n=new Os,i=new Se,r=new Se,o=new it,l=new nl({depthPacking:Sf}),u=new il,d={},a=t.maxTextureSize,c={[Mn]:jt,[jt]:Mn,[Vt]:Vt},h=new Rt({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Se},radius:{value:4}},vertexShader:dy,fragmentShader:hy}),f=h.clone();f.defines.HORIZONTAL_PASS=1;let g=new Tt;g.setAttribute("position",new st(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Ue(g,h),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=yu;let p=this.type;this.render=function(P,A,D){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||P.length===0)return;let S=s.getRenderTarget(),E=s.getActiveCubeFace(),R=s.getActiveMipmapLevel(),V=s.state;V.setBlending(Ti),V.buffers.depth.getReversed()?V.buffers.color.setClear(0,0,0,0):V.buffers.color.setClear(1,1,1,1),V.buffers.depth.setTest(!0),V.setScissorTest(!1);let B=p!==ii&&this.type===ii,z=p===ii&&this.type!==ii;for(let j=0,Y=P.length;j<Y;j++){let Z=P[j],H=Z.shadow;if(H===void 0){console.warn("THREE.WebGLShadowMap:",Z,"has no shadow.");continue}if(H.autoUpdate===!1&&H.needsUpdate===!1)continue;i.copy(H.mapSize);let te=H.getFrameExtents();if(i.multiply(te),r.copy(H.mapSize),(i.x>a||i.y>a)&&(i.x>a&&(r.x=Math.floor(a/te.x),i.x=r.x*te.x,H.mapSize.x=r.x),i.y>a&&(r.y=Math.floor(a/te.y),i.y=r.y*te.y,H.mapSize.y=r.y)),H.map===null||B===!0||z===!0){let ye=this.type!==ii?{minFilter:Xt,magFilter:Xt}:{};H.map!==null&&H.map.dispose(),H.map=new un(i.x,i.y,ye),H.map.texture.name=Z.name+".shadowMap",H.camera.updateProjectionMatrix()}s.setRenderTarget(H.map),s.clear();let ue=H.getViewportCount();for(let ye=0;ye<ue;ye++){let He=H.getViewport(ye);o.set(r.x*He.x,r.y*He.y,r.x*He.z,r.y*He.w),V.viewport(o),H.updateMatrices(Z,ye),n=H.getFrustum(),y(A,D,H.camera,Z,this.type)}H.isPointLightShadow!==!0&&this.type===ii&&b(H,D),H.needsUpdate=!1}p=this.type,m.needsUpdate=!1,s.setRenderTarget(S,E,R)};function b(P,A){let D=e.update(_);h.defines.VSM_SAMPLES!==P.blurSamples&&(h.defines.VSM_SAMPLES=P.blurSamples,f.defines.VSM_SAMPLES=P.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),P.mapPass===null&&(P.mapPass=new un(i.x,i.y)),h.uniforms.shadow_pass.value=P.map.texture,h.uniforms.resolution.value=P.mapSize,h.uniforms.radius.value=P.radius,s.setRenderTarget(P.mapPass),s.clear(),s.renderBufferDirect(A,null,D,h,_,null),f.uniforms.shadow_pass.value=P.mapPass.texture,f.uniforms.resolution.value=P.mapSize,f.uniforms.radius.value=P.radius,s.setRenderTarget(P.map),s.clear(),s.renderBufferDirect(A,null,D,f,_,null)}function M(P,A,D,S){let E=null,R=D.isPointLight===!0?P.customDistanceMaterial:P.customDepthMaterial;if(R!==void 0)E=R;else if(E=D.isPointLight===!0?u:l,s.localClippingEnabled&&A.clipShadows===!0&&Array.isArray(A.clippingPlanes)&&A.clippingPlanes.length!==0||A.displacementMap&&A.displacementScale!==0||A.alphaMap&&A.alphaTest>0||A.map&&A.alphaTest>0||A.alphaToCoverage===!0){let V=E.uuid,B=A.uuid,z=d[V];z===void 0&&(z={},d[V]=z);let j=z[B];j===void 0&&(j=E.clone(),z[B]=j,A.addEventListener("dispose",T)),E=j}if(E.visible=A.visible,E.wireframe=A.wireframe,S===ii?E.side=A.shadowSide!==null?A.shadowSide:A.side:E.side=A.shadowSide!==null?A.shadowSide:c[A.side],E.alphaMap=A.alphaMap,E.alphaTest=A.alphaToCoverage===!0?.5:A.alphaTest,E.map=A.map,E.clipShadows=A.clipShadows,E.clippingPlanes=A.clippingPlanes,E.clipIntersection=A.clipIntersection,E.displacementMap=A.displacementMap,E.displacementScale=A.displacementScale,E.displacementBias=A.displacementBias,E.wireframeLinewidth=A.wireframeLinewidth,E.linewidth=A.linewidth,D.isPointLight===!0&&E.isMeshDistanceMaterial===!0){let V=s.properties.get(E);V.light=D}return E}function y(P,A,D,S,E){if(P.visible===!1)return;if(P.layers.test(A.layers)&&(P.isMesh||P.isLine||P.isPoints)&&(P.castShadow||P.receiveShadow&&E===ii)&&(!P.frustumCulled||n.intersectsObject(P))){P.modelViewMatrix.multiplyMatrices(D.matrixWorldInverse,P.matrixWorld);let B=e.update(P),z=P.material;if(Array.isArray(z)){let j=B.groups;for(let Y=0,Z=j.length;Y<Z;Y++){let H=j[Y],te=z[H.materialIndex];if(te&&te.visible){let ue=M(P,te,S,E);P.onBeforeShadow(s,P,A,D,B,ue,H),s.renderBufferDirect(D,null,B,ue,P,H),P.onAfterShadow(s,P,A,D,B,ue,H)}}}else if(z.visible){let j=M(P,z,S,E);P.onBeforeShadow(s,P,A,D,B,j,null),s.renderBufferDirect(D,null,B,j,P,null),P.onAfterShadow(s,P,A,D,B,j,null)}}let V=P.children;for(let B=0,z=V.length;B<z;B++)y(V[B],A,D,S,E)}function T(P){P.target.removeEventListener("dispose",T);for(let D in d){let S=d[D],E=P.target.uuid;E in S&&(S[E].dispose(),delete S[E])}}}var py={[hl]:fl,[pl]:_l,[ml]:vl,[gr]:gl,[fl]:hl,[_l]:pl,[vl]:ml,[gl]:gr};function my(s,e){function t(){let O=!1,ee=new it,re=null,pe=new it(0,0,0,0);return{setMask:function(K){re!==K&&!O&&(s.colorMask(K,K,K,K),re=K)},setLocked:function(K){O=K},setClear:function(K,q,ve,Ve,gt){gt===!0&&(K*=Ve,q*=Ve,ve*=Ve),ee.set(K,q,ve,Ve),pe.equals(ee)===!1&&(s.clearColor(K,q,ve,Ve),pe.copy(ee))},reset:function(){O=!1,re=null,pe.set(-1,0,0,0)}}}function n(){let O=!1,ee=!1,re=null,pe=null,K=null;return{setReversed:function(q){if(ee!==q){let ve=e.get("EXT_clip_control");q?ve.clipControlEXT(ve.LOWER_LEFT_EXT,ve.ZERO_TO_ONE_EXT):ve.clipControlEXT(ve.LOWER_LEFT_EXT,ve.NEGATIVE_ONE_TO_ONE_EXT),ee=q;let Ve=K;K=null,this.setClear(Ve)}},getReversed:function(){return ee},setTest:function(q){q?ne(s.DEPTH_TEST):Pe(s.DEPTH_TEST)},setMask:function(q){re!==q&&!O&&(s.depthMask(q),re=q)},setFunc:function(q){if(ee&&(q=py[q]),pe!==q){switch(q){case hl:s.depthFunc(s.NEVER);break;case fl:s.depthFunc(s.ALWAYS);break;case pl:s.depthFunc(s.LESS);break;case gr:s.depthFunc(s.LEQUAL);break;case ml:s.depthFunc(s.EQUAL);break;case gl:s.depthFunc(s.GEQUAL);break;case _l:s.depthFunc(s.GREATER);break;case vl:s.depthFunc(s.NOTEQUAL);break;default:s.depthFunc(s.LEQUAL)}pe=q}},setLocked:function(q){O=q},setClear:function(q){K!==q&&(ee&&(q=1-q),s.clearDepth(q),K=q)},reset:function(){O=!1,re=null,pe=null,K=null,ee=!1}}}function i(){let O=!1,ee=null,re=null,pe=null,K=null,q=null,ve=null,Ve=null,gt=null;return{setTest:function(ot){O||(ot?ne(s.STENCIL_TEST):Pe(s.STENCIL_TEST))},setMask:function(ot){ee!==ot&&!O&&(s.stencilMask(ot),ee=ot)},setFunc:function(ot,ci,Zn){(re!==ot||pe!==ci||K!==Zn)&&(s.stencilFunc(ot,ci,Zn),re=ot,pe=ci,K=Zn)},setOp:function(ot,ci,Zn){(q!==ot||ve!==ci||Ve!==Zn)&&(s.stencilOp(ot,ci,Zn),q=ot,ve=ci,Ve=Zn)},setLocked:function(ot){O=ot},setClear:function(ot){gt!==ot&&(s.clearStencil(ot),gt=ot)},reset:function(){O=!1,ee=null,re=null,pe=null,K=null,q=null,ve=null,Ve=null,gt=null}}}let r=new t,o=new n,l=new i,u=new WeakMap,d=new WeakMap,a={},c={},h=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,M=null,y=null,T=null,P=null,A=new de(0,0,0),D=0,S=!1,E=null,R=null,V=null,B=null,z=null,j=s.getParameter(s.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Y=!1,Z=0,H=s.getParameter(s.VERSION);H.indexOf("WebGL")!==-1?(Z=parseFloat(/^WebGL (\d)/.exec(H)[1]),Y=Z>=1):H.indexOf("OpenGL ES")!==-1&&(Z=parseFloat(/^OpenGL ES (\d)/.exec(H)[1]),Y=Z>=2);let te=null,ue={},ye=s.getParameter(s.SCISSOR_BOX),He=s.getParameter(s.VIEWPORT),at=new it().fromArray(ye),tt=new it().fromArray(He);function W(O,ee,re,pe){let K=new Uint8Array(4),q=s.createTexture();s.bindTexture(O,q),s.texParameteri(O,s.TEXTURE_MIN_FILTER,s.NEAREST),s.texParameteri(O,s.TEXTURE_MAG_FILTER,s.NEAREST);for(let ve=0;ve<re;ve++)O===s.TEXTURE_3D||O===s.TEXTURE_2D_ARRAY?s.texImage3D(ee,0,s.RGBA,1,1,pe,0,s.RGBA,s.UNSIGNED_BYTE,K):s.texImage2D(ee+ve,0,s.RGBA,1,1,0,s.RGBA,s.UNSIGNED_BYTE,K);return q}let se={};se[s.TEXTURE_2D]=W(s.TEXTURE_2D,s.TEXTURE_2D,1),se[s.TEXTURE_CUBE_MAP]=W(s.TEXTURE_CUBE_MAP,s.TEXTURE_CUBE_MAP_POSITIVE_X,6),se[s.TEXTURE_2D_ARRAY]=W(s.TEXTURE_2D_ARRAY,s.TEXTURE_2D_ARRAY,1,1),se[s.TEXTURE_3D]=W(s.TEXTURE_3D,s.TEXTURE_3D,1,1),r.setClear(0,0,0,1),o.setClear(1),l.setClear(0),ne(s.DEPTH_TEST),o.setFunc(gr),rt(!1),Ce(vu),ne(s.CULL_FACE),mt(Ti);function ne(O){a[O]!==!0&&(s.enable(O),a[O]=!0)}function Pe(O){a[O]!==!1&&(s.disable(O),a[O]=!1)}function we(O,ee){return c[O]!==ee?(s.bindFramebuffer(O,ee),c[O]=ee,O===s.DRAW_FRAMEBUFFER&&(c[s.FRAMEBUFFER]=ee),O===s.FRAMEBUFFER&&(c[s.DRAW_FRAMEBUFFER]=ee),!0):!1}function Oe(O,ee){let re=f,pe=!1;if(O){re=h.get(ee),re===void 0&&(re=[],h.set(ee,re));let K=O.textures;if(re.length!==K.length||re[0]!==s.COLOR_ATTACHMENT0){for(let q=0,ve=K.length;q<ve;q++)re[q]=s.COLOR_ATTACHMENT0+q;re.length=K.length,pe=!0}}else re[0]!==s.BACK&&(re[0]=s.BACK,pe=!0);pe&&s.drawBuffers(re)}function bt(O){return g!==O?(s.useProgram(O),g=O,!0):!1}let Qe={[Yi]:s.FUNC_ADD,[Yh]:s.FUNC_SUBTRACT,[qh]:s.FUNC_REVERSE_SUBTRACT};Qe[jh]=s.MIN,Qe[Zh]=s.MAX;let I={[$h]:s.ZERO,[Kh]:s.ONE,[Jh]:s.SRC_COLOR,[Ya]:s.SRC_ALPHA,[sf]:s.SRC_ALPHA_SATURATE,[nf]:s.DST_COLOR,[ef]:s.DST_ALPHA,[Qh]:s.ONE_MINUS_SRC_COLOR,[qa]:s.ONE_MINUS_SRC_ALPHA,[rf]:s.ONE_MINUS_DST_COLOR,[tf]:s.ONE_MINUS_DST_ALPHA,[of]:s.CONSTANT_COLOR,[af]:s.ONE_MINUS_CONSTANT_COLOR,[lf]:s.CONSTANT_ALPHA,[cf]:s.ONE_MINUS_CONSTANT_ALPHA};function mt(O,ee,re,pe,K,q,ve,Ve,gt,ot){if(O===Ti){_===!0&&(Pe(s.BLEND),_=!1);return}if(_===!1&&(ne(s.BLEND),_=!0),O!==Xh){if(O!==m||ot!==S){if((p!==Yi||y!==Yi)&&(s.blendEquation(s.FUNC_ADD),p=Yi,y=Yi),ot)switch(O){case mr:s.blendFuncSeparate(s.ONE,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Tr:s.blendFunc(s.ONE,s.ONE);break;case xu:s.blendFuncSeparate(s.ZERO,s.ONE_MINUS_SRC_COLOR,s.ZERO,s.ONE);break;case bu:s.blendFuncSeparate(s.DST_COLOR,s.ONE_MINUS_SRC_ALPHA,s.ZERO,s.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case mr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE_MINUS_SRC_ALPHA,s.ONE,s.ONE_MINUS_SRC_ALPHA);break;case Tr:s.blendFuncSeparate(s.SRC_ALPHA,s.ONE,s.ONE,s.ONE);break;case xu:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case bu:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}b=null,M=null,T=null,P=null,A.set(0,0,0),D=0,m=O,S=ot}return}K=K||ee,q=q||re,ve=ve||pe,(ee!==p||K!==y)&&(s.blendEquationSeparate(Qe[ee],Qe[K]),p=ee,y=K),(re!==b||pe!==M||q!==T||ve!==P)&&(s.blendFuncSeparate(I[re],I[pe],I[q],I[ve]),b=re,M=pe,T=q,P=ve),(Ve.equals(A)===!1||gt!==D)&&(s.blendColor(Ve.r,Ve.g,Ve.b,gt),A.copy(Ve),D=gt),m=O,S=!1}function Ie(O,ee){O.side===Vt?Pe(s.CULL_FACE):ne(s.CULL_FACE);let re=O.side===jt;ee&&(re=!re),rt(re),O.blending===mr&&O.transparent===!1?mt(Ti):mt(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),o.setFunc(O.depthFunc),o.setTest(O.depthTest),o.setMask(O.depthWrite),r.setMask(O.colorWrite);let pe=O.stencilWrite;l.setTest(pe),pe&&(l.setMask(O.stencilWriteMask),l.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),l.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),ge(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?ne(s.SAMPLE_ALPHA_TO_COVERAGE):Pe(s.SAMPLE_ALPHA_TO_COVERAGE)}function rt(O){E!==O&&(O?s.frontFace(s.CW):s.frontFace(s.CCW),E=O)}function Ce(O){O!==Gh?(ne(s.CULL_FACE),O!==R&&(O===vu?s.cullFace(s.BACK):O===Wh?s.cullFace(s.FRONT):s.cullFace(s.FRONT_AND_BACK))):Pe(s.CULL_FACE),R=O}function xt(O){O!==V&&(Y&&s.lineWidth(O),V=O)}function ge(O,ee,re){O?(ne(s.POLYGON_OFFSET_FILL),(B!==ee||z!==re)&&(s.polygonOffset(ee,re),B=ee,z=re)):Pe(s.POLYGON_OFFSET_FILL)}function Ye(O){O?ne(s.SCISSOR_TEST):Pe(s.SCISSOR_TEST)}function Ut(O){O===void 0&&(O=s.TEXTURE0+j-1),te!==O&&(s.activeTexture(O),te=O)}function At(O,ee,re){re===void 0&&(te===null?re=s.TEXTURE0+j-1:re=te);let pe=ue[re];pe===void 0&&(pe={type:void 0,texture:void 0},ue[re]=pe),(pe.type!==O||pe.texture!==ee)&&(te!==re&&(s.activeTexture(re),te=re),s.bindTexture(O,ee||se[O]),pe.type=O,pe.texture=ee)}function C(){let O=ue[te];O!==void 0&&O.type!==void 0&&(s.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function v(){try{s.compressedTexImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function k(){try{s.compressedTexImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function X(){try{s.texSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function $(){try{s.texSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function G(){try{s.compressedTexSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Ee(){try{s.compressedTexSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ie(){try{s.texStorage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function xe(){try{s.texStorage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function be(){try{s.texImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function Q(){try{s.texImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function ce(O){at.equals(O)===!1&&(s.scissor(O.x,O.y,O.z,O.w),at.copy(O))}function Ne(O){tt.equals(O)===!1&&(s.viewport(O.x,O.y,O.z,O.w),tt.copy(O))}function Me(O,ee){let re=d.get(ee);re===void 0&&(re=new WeakMap,d.set(ee,re));let pe=re.get(O);pe===void 0&&(pe=s.getUniformBlockIndex(ee,O.name),re.set(O,pe))}function ae(O,ee){let pe=d.get(ee).get(O);u.get(ee)!==pe&&(s.uniformBlockBinding(ee,pe,O.__bindingPointIndex),u.set(ee,pe))}function We(){s.disable(s.BLEND),s.disable(s.CULL_FACE),s.disable(s.DEPTH_TEST),s.disable(s.POLYGON_OFFSET_FILL),s.disable(s.SCISSOR_TEST),s.disable(s.STENCIL_TEST),s.disable(s.SAMPLE_ALPHA_TO_COVERAGE),s.blendEquation(s.FUNC_ADD),s.blendFunc(s.ONE,s.ZERO),s.blendFuncSeparate(s.ONE,s.ZERO,s.ONE,s.ZERO),s.blendColor(0,0,0,0),s.colorMask(!0,!0,!0,!0),s.clearColor(0,0,0,0),s.depthMask(!0),s.depthFunc(s.LESS),o.setReversed(!1),s.clearDepth(1),s.stencilMask(4294967295),s.stencilFunc(s.ALWAYS,0,4294967295),s.stencilOp(s.KEEP,s.KEEP,s.KEEP),s.clearStencil(0),s.cullFace(s.BACK),s.frontFace(s.CCW),s.polygonOffset(0,0),s.activeTexture(s.TEXTURE0),s.bindFramebuffer(s.FRAMEBUFFER,null),s.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),s.bindFramebuffer(s.READ_FRAMEBUFFER,null),s.useProgram(null),s.lineWidth(1),s.scissor(0,0,s.canvas.width,s.canvas.height),s.viewport(0,0,s.canvas.width,s.canvas.height),a={},te=null,ue={},c={},h=new WeakMap,f=[],g=null,_=!1,m=null,p=null,b=null,M=null,y=null,T=null,P=null,A=new de(0,0,0),D=0,S=!1,E=null,R=null,V=null,B=null,z=null,at.set(0,0,s.canvas.width,s.canvas.height),tt.set(0,0,s.canvas.width,s.canvas.height),r.reset(),o.reset(),l.reset()}return{buffers:{color:r,depth:o,stencil:l},enable:ne,disable:Pe,bindFramebuffer:we,drawBuffers:Oe,useProgram:bt,setBlending:mt,setMaterial:Ie,setFlipSided:rt,setCullFace:Ce,setLineWidth:xt,setPolygonOffset:ge,setScissorTest:Ye,activeTexture:Ut,bindTexture:At,unbindTexture:C,compressedTexImage2D:v,compressedTexImage3D:k,texImage2D:be,texImage3D:Q,updateUBOMapping:Me,uniformBlockBinding:ae,texStorage2D:ie,texStorage3D:xe,texSubImage2D:X,texSubImage3D:$,compressedTexSubImage2D:G,compressedTexSubImage3D:Ee,scissor:ce,viewport:Ne,reset:We}}function gy(s,e,t,n,i,r,o){let l=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,u=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),d=new Se,a=new WeakMap,c,h=new WeakMap,f=!1;try{f=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(C,v){return f?new OffscreenCanvas(C,v):Cs("canvas")}function _(C,v,k){let X=1,$=At(C);if(($.width>k||$.height>k)&&(X=k/Math.max($.width,$.height)),X<1)if(typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&C instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&C instanceof ImageBitmap||typeof VideoFrame<"u"&&C instanceof VideoFrame){let G=Math.floor(X*$.width),Ee=Math.floor(X*$.height);c===void 0&&(c=g(G,Ee));let ie=v?g(G,Ee):c;return ie.width=G,ie.height=Ee,ie.getContext("2d").drawImage(C,0,0,G,Ee),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+$.width+"x"+$.height+") to ("+G+"x"+Ee+")."),ie}else return"data"in C&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+$.width+"x"+$.height+")."),C;return C}function m(C){return C.generateMipmaps}function p(C){s.generateMipmap(C)}function b(C){return C.isWebGLCubeRenderTarget?s.TEXTURE_CUBE_MAP:C.isWebGL3DRenderTarget?s.TEXTURE_3D:C.isWebGLArrayRenderTarget||C.isCompressedArrayTexture?s.TEXTURE_2D_ARRAY:s.TEXTURE_2D}function M(C,v,k,X,$=!1){if(C!==null){if(s[C]!==void 0)return s[C];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+C+"'")}let G=v;if(v===s.RED&&(k===s.FLOAT&&(G=s.R32F),k===s.HALF_FLOAT&&(G=s.R16F),k===s.UNSIGNED_BYTE&&(G=s.R8)),v===s.RED_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.R8UI),k===s.UNSIGNED_SHORT&&(G=s.R16UI),k===s.UNSIGNED_INT&&(G=s.R32UI),k===s.BYTE&&(G=s.R8I),k===s.SHORT&&(G=s.R16I),k===s.INT&&(G=s.R32I)),v===s.RG&&(k===s.FLOAT&&(G=s.RG32F),k===s.HALF_FLOAT&&(G=s.RG16F),k===s.UNSIGNED_BYTE&&(G=s.RG8)),v===s.RG_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.RG8UI),k===s.UNSIGNED_SHORT&&(G=s.RG16UI),k===s.UNSIGNED_INT&&(G=s.RG32UI),k===s.BYTE&&(G=s.RG8I),k===s.SHORT&&(G=s.RG16I),k===s.INT&&(G=s.RG32I)),v===s.RGB_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.RGB8UI),k===s.UNSIGNED_SHORT&&(G=s.RGB16UI),k===s.UNSIGNED_INT&&(G=s.RGB32UI),k===s.BYTE&&(G=s.RGB8I),k===s.SHORT&&(G=s.RGB16I),k===s.INT&&(G=s.RGB32I)),v===s.RGBA_INTEGER&&(k===s.UNSIGNED_BYTE&&(G=s.RGBA8UI),k===s.UNSIGNED_SHORT&&(G=s.RGBA16UI),k===s.UNSIGNED_INT&&(G=s.RGBA32UI),k===s.BYTE&&(G=s.RGBA8I),k===s.SHORT&&(G=s.RGBA16I),k===s.INT&&(G=s.RGBA32I)),v===s.RGB&&k===s.UNSIGNED_INT_5_9_9_9_REV&&(G=s.RGB9_E5),v===s.RGBA){let Ee=$?Mo:je.getTransfer(X);k===s.FLOAT&&(G=s.RGBA32F),k===s.HALF_FLOAT&&(G=s.RGBA16F),k===s.UNSIGNED_BYTE&&(G=Ee===ct?s.SRGB8_ALPHA8:s.RGBA8),k===s.UNSIGNED_SHORT_4_4_4_4&&(G=s.RGBA4),k===s.UNSIGNED_SHORT_5_5_5_1&&(G=s.RGB5_A1)}return(G===s.R16F||G===s.R32F||G===s.RG16F||G===s.RG32F||G===s.RGBA16F||G===s.RGBA32F)&&e.get("EXT_color_buffer_float"),G}function y(C,v){let k;return C?v===null||v===Qi||v===zs?k=s.DEPTH24_STENCIL8:v===On?k=s.DEPTH32F_STENCIL8:v===Bs&&(k=s.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):v===null||v===Qi||v===zs?k=s.DEPTH_COMPONENT24:v===On?k=s.DEPTH_COMPONENT32F:v===Bs&&(k=s.DEPTH_COMPONENT16),k}function T(C,v){return m(C)===!0||C.isFramebufferTexture&&C.minFilter!==Xt&&C.minFilter!==Dt?Math.log2(Math.max(v.width,v.height))+1:C.mipmaps!==void 0&&C.mipmaps.length>0?C.mipmaps.length:C.isCompressedTexture&&Array.isArray(C.image)?v.mipmaps.length:1}function P(C){let v=C.target;v.removeEventListener("dispose",P),D(v),v.isVideoTexture&&a.delete(v)}function A(C){let v=C.target;v.removeEventListener("dispose",A),E(v)}function D(C){let v=n.get(C);if(v.__webglInit===void 0)return;let k=C.source,X=h.get(k);if(X){let $=X[v.__cacheKey];$.usedTimes--,$.usedTimes===0&&S(C),Object.keys(X).length===0&&h.delete(k)}n.remove(C)}function S(C){let v=n.get(C);s.deleteTexture(v.__webglTexture);let k=C.source,X=h.get(k);delete X[v.__cacheKey],o.memory.textures--}function E(C){let v=n.get(C);if(C.depthTexture&&(C.depthTexture.dispose(),n.remove(C.depthTexture)),C.isWebGLCubeRenderTarget)for(let X=0;X<6;X++){if(Array.isArray(v.__webglFramebuffer[X]))for(let $=0;$<v.__webglFramebuffer[X].length;$++)s.deleteFramebuffer(v.__webglFramebuffer[X][$]);else s.deleteFramebuffer(v.__webglFramebuffer[X]);v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer[X])}else{if(Array.isArray(v.__webglFramebuffer))for(let X=0;X<v.__webglFramebuffer.length;X++)s.deleteFramebuffer(v.__webglFramebuffer[X]);else s.deleteFramebuffer(v.__webglFramebuffer);if(v.__webglDepthbuffer&&s.deleteRenderbuffer(v.__webglDepthbuffer),v.__webglMultisampledFramebuffer&&s.deleteFramebuffer(v.__webglMultisampledFramebuffer),v.__webglColorRenderbuffer)for(let X=0;X<v.__webglColorRenderbuffer.length;X++)v.__webglColorRenderbuffer[X]&&s.deleteRenderbuffer(v.__webglColorRenderbuffer[X]);v.__webglDepthRenderbuffer&&s.deleteRenderbuffer(v.__webglDepthRenderbuffer)}let k=C.textures;for(let X=0,$=k.length;X<$;X++){let G=n.get(k[X]);G.__webglTexture&&(s.deleteTexture(G.__webglTexture),o.memory.textures--),n.remove(k[X])}n.remove(C)}let R=0;function V(){R=0}function B(){let C=R;return C>=i.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+C+" texture units while this GPU supports only "+i.maxTextures),R+=1,C}function z(C){let v=[];return v.push(C.wrapS),v.push(C.wrapT),v.push(C.wrapR||0),v.push(C.magFilter),v.push(C.minFilter),v.push(C.anisotropy),v.push(C.internalFormat),v.push(C.format),v.push(C.type),v.push(C.generateMipmaps),v.push(C.premultiplyAlpha),v.push(C.flipY),v.push(C.unpackAlignment),v.push(C.colorSpace),v.join()}function j(C,v){let k=n.get(C);if(C.isVideoTexture&&Ye(C),C.isRenderTargetTexture===!1&&C.isExternalTexture!==!0&&C.version>0&&k.__version!==C.version){let X=C.image;if(X===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(X.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{se(k,C,v);return}}else C.isExternalTexture&&(k.__webglTexture=C.sourceTexture?C.sourceTexture:null);t.bindTexture(s.TEXTURE_2D,k.__webglTexture,s.TEXTURE0+v)}function Y(C,v){let k=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){se(k,C,v);return}t.bindTexture(s.TEXTURE_2D_ARRAY,k.__webglTexture,s.TEXTURE0+v)}function Z(C,v){let k=n.get(C);if(C.isRenderTargetTexture===!1&&C.version>0&&k.__version!==C.version){se(k,C,v);return}t.bindTexture(s.TEXTURE_3D,k.__webglTexture,s.TEXTURE0+v)}function H(C,v){let k=n.get(C);if(C.version>0&&k.__version!==C.version){ne(k,C,v);return}t.bindTexture(s.TEXTURE_CUBE_MAP,k.__webglTexture,s.TEXTURE0+v)}let te={[qi]:s.REPEAT,[bn]:s.CLAMP_TO_EDGE,[Ss]:s.MIRRORED_REPEAT},ue={[Xt]:s.NEAREST,[xl]:s.NEAREST_MIPMAP_NEAREST,[Pr]:s.NEAREST_MIPMAP_LINEAR,[Dt]:s.LINEAR,[Us]:s.LINEAR_MIPMAP_NEAREST,[jn]:s.LINEAR_MIPMAP_LINEAR},ye={[Cf]:s.NEVER,[If]:s.ALWAYS,[wf]:s.LESS,[Du]:s.LEQUAL,[Tf]:s.EQUAL,[Pf]:s.GEQUAL,[Af]:s.GREATER,[Rf]:s.NOTEQUAL};function He(C,v){if(v.type===On&&e.has("OES_texture_float_linear")===!1&&(v.magFilter===Dt||v.magFilter===Us||v.magFilter===Pr||v.magFilter===jn||v.minFilter===Dt||v.minFilter===Us||v.minFilter===Pr||v.minFilter===jn)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),s.texParameteri(C,s.TEXTURE_WRAP_S,te[v.wrapS]),s.texParameteri(C,s.TEXTURE_WRAP_T,te[v.wrapT]),(C===s.TEXTURE_3D||C===s.TEXTURE_2D_ARRAY)&&s.texParameteri(C,s.TEXTURE_WRAP_R,te[v.wrapR]),s.texParameteri(C,s.TEXTURE_MAG_FILTER,ue[v.magFilter]),s.texParameteri(C,s.TEXTURE_MIN_FILTER,ue[v.minFilter]),v.compareFunction&&(s.texParameteri(C,s.TEXTURE_COMPARE_MODE,s.COMPARE_REF_TO_TEXTURE),s.texParameteri(C,s.TEXTURE_COMPARE_FUNC,ye[v.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(v.magFilter===Xt||v.minFilter!==Pr&&v.minFilter!==jn||v.type===On&&e.has("OES_texture_float_linear")===!1)return;if(v.anisotropy>1||n.get(v).__currentAnisotropy){let k=e.get("EXT_texture_filter_anisotropic");s.texParameterf(C,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(v.anisotropy,i.getMaxAnisotropy())),n.get(v).__currentAnisotropy=v.anisotropy}}}function at(C,v){let k=!1;C.__webglInit===void 0&&(C.__webglInit=!0,v.addEventListener("dispose",P));let X=v.source,$=h.get(X);$===void 0&&($={},h.set(X,$));let G=z(v);if(G!==C.__cacheKey){$[G]===void 0&&($[G]={texture:s.createTexture(),usedTimes:0},o.memory.textures++,k=!0),$[G].usedTimes++;let Ee=$[C.__cacheKey];Ee!==void 0&&($[C.__cacheKey].usedTimes--,Ee.usedTimes===0&&S(v)),C.__cacheKey=G,C.__webglTexture=$[G].texture}return k}function tt(C,v,k){return Math.floor(Math.floor(C/k)/v)}function W(C,v,k,X){let G=C.updateRanges;if(G.length===0)t.texSubImage2D(s.TEXTURE_2D,0,0,0,v.width,v.height,k,X,v.data);else{G.sort((Q,ce)=>Q.start-ce.start);let Ee=0;for(let Q=1;Q<G.length;Q++){let ce=G[Ee],Ne=G[Q],Me=ce.start+ce.count,ae=tt(Ne.start,v.width,4),We=tt(ce.start,v.width,4);Ne.start<=Me+1&&ae===We&&tt(Ne.start+Ne.count-1,v.width,4)===ae?ce.count=Math.max(ce.count,Ne.start+Ne.count-ce.start):(++Ee,G[Ee]=Ne)}G.length=Ee+1;let ie=s.getParameter(s.UNPACK_ROW_LENGTH),xe=s.getParameter(s.UNPACK_SKIP_PIXELS),be=s.getParameter(s.UNPACK_SKIP_ROWS);s.pixelStorei(s.UNPACK_ROW_LENGTH,v.width);for(let Q=0,ce=G.length;Q<ce;Q++){let Ne=G[Q],Me=Math.floor(Ne.start/4),ae=Math.ceil(Ne.count/4),We=Me%v.width,O=Math.floor(Me/v.width),ee=ae,re=1;s.pixelStorei(s.UNPACK_SKIP_PIXELS,We),s.pixelStorei(s.UNPACK_SKIP_ROWS,O),t.texSubImage2D(s.TEXTURE_2D,0,We,O,ee,re,k,X,v.data)}C.clearUpdateRanges(),s.pixelStorei(s.UNPACK_ROW_LENGTH,ie),s.pixelStorei(s.UNPACK_SKIP_PIXELS,xe),s.pixelStorei(s.UNPACK_SKIP_ROWS,be)}}function se(C,v,k){let X=s.TEXTURE_2D;(v.isDataArrayTexture||v.isCompressedArrayTexture)&&(X=s.TEXTURE_2D_ARRAY),v.isData3DTexture&&(X=s.TEXTURE_3D);let $=at(C,v),G=v.source;t.bindTexture(X,C.__webglTexture,s.TEXTURE0+k);let Ee=n.get(G);if(G.version!==Ee.__version||$===!0){t.activeTexture(s.TEXTURE0+k);let ie=je.getPrimaries(je.workingColorSpace),xe=v.colorSpace===Ri?null:je.getPrimaries(v.colorSpace),be=v.colorSpace===Ri||ie===xe?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,be);let Q=_(v.image,!1,i.maxTextureSize);Q=Ut(v,Q);let ce=r.convert(v.format,v.colorSpace),Ne=r.convert(v.type),Me=M(v.internalFormat,ce,Ne,v.colorSpace,v.isVideoTexture);He(X,v);let ae,We=v.mipmaps,O=v.isVideoTexture!==!0,ee=Ee.__version===void 0||$===!0,re=G.dataReady,pe=T(v,Q);if(v.isDepthTexture)Me=y(v.format===Vs,v.type),ee&&(O?t.texStorage2D(s.TEXTURE_2D,1,Me,Q.width,Q.height):t.texImage2D(s.TEXTURE_2D,0,Me,Q.width,Q.height,0,ce,Ne,null));else if(v.isDataTexture)if(We.length>0){O&&ee&&t.texStorage2D(s.TEXTURE_2D,pe,Me,We[0].width,We[0].height);for(let K=0,q=We.length;K<q;K++)ae=We[K],O?re&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,ae.width,ae.height,ce,Ne,ae.data):t.texImage2D(s.TEXTURE_2D,K,Me,ae.width,ae.height,0,ce,Ne,ae.data);v.generateMipmaps=!1}else O?(ee&&t.texStorage2D(s.TEXTURE_2D,pe,Me,Q.width,Q.height),re&&W(v,Q,ce,Ne)):t.texImage2D(s.TEXTURE_2D,0,Me,Q.width,Q.height,0,ce,Ne,Q.data);else if(v.isCompressedTexture)if(v.isCompressedArrayTexture){O&&ee&&t.texStorage3D(s.TEXTURE_2D_ARRAY,pe,Me,We[0].width,We[0].height,Q.depth);for(let K=0,q=We.length;K<q;K++)if(ae=We[K],v.format!==Zt)if(ce!==null)if(O){if(re)if(v.layerUpdates.size>0){let ve=Bu(ae.width,ae.height,v.format,v.type);for(let Ve of v.layerUpdates){let gt=ae.data.subarray(Ve*ve/ae.data.BYTES_PER_ELEMENT,(Ve+1)*ve/ae.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,Ve,ae.width,ae.height,1,ce,gt)}v.clearLayerUpdates()}else t.compressedTexSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,ae.width,ae.height,Q.depth,ce,ae.data)}else t.compressedTexImage3D(s.TEXTURE_2D_ARRAY,K,Me,ae.width,ae.height,Q.depth,0,ae.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?re&&t.texSubImage3D(s.TEXTURE_2D_ARRAY,K,0,0,0,ae.width,ae.height,Q.depth,ce,Ne,ae.data):t.texImage3D(s.TEXTURE_2D_ARRAY,K,Me,ae.width,ae.height,Q.depth,0,ce,Ne,ae.data)}else{O&&ee&&t.texStorage2D(s.TEXTURE_2D,pe,Me,We[0].width,We[0].height);for(let K=0,q=We.length;K<q;K++)ae=We[K],v.format!==Zt?ce!==null?O?re&&t.compressedTexSubImage2D(s.TEXTURE_2D,K,0,0,ae.width,ae.height,ce,ae.data):t.compressedTexImage2D(s.TEXTURE_2D,K,Me,ae.width,ae.height,0,ae.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?re&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,ae.width,ae.height,ce,Ne,ae.data):t.texImage2D(s.TEXTURE_2D,K,Me,ae.width,ae.height,0,ce,Ne,ae.data)}else if(v.isDataArrayTexture)if(O){if(ee&&t.texStorage3D(s.TEXTURE_2D_ARRAY,pe,Me,Q.width,Q.height,Q.depth),re)if(v.layerUpdates.size>0){let K=Bu(Q.width,Q.height,v.format,v.type);for(let q of v.layerUpdates){let ve=Q.data.subarray(q*K/Q.data.BYTES_PER_ELEMENT,(q+1)*K/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,q,Q.width,Q.height,1,ce,Ne,ve)}v.clearLayerUpdates()}else t.texSubImage3D(s.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ce,Ne,Q.data)}else t.texImage3D(s.TEXTURE_2D_ARRAY,0,Me,Q.width,Q.height,Q.depth,0,ce,Ne,Q.data);else if(v.isData3DTexture)O?(ee&&t.texStorage3D(s.TEXTURE_3D,pe,Me,Q.width,Q.height,Q.depth),re&&t.texSubImage3D(s.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ce,Ne,Q.data)):t.texImage3D(s.TEXTURE_3D,0,Me,Q.width,Q.height,Q.depth,0,ce,Ne,Q.data);else if(v.isFramebufferTexture){if(ee)if(O)t.texStorage2D(s.TEXTURE_2D,pe,Me,Q.width,Q.height);else{let K=Q.width,q=Q.height;for(let ve=0;ve<pe;ve++)t.texImage2D(s.TEXTURE_2D,ve,Me,K,q,0,ce,Ne,null),K>>=1,q>>=1}}else if(We.length>0){if(O&&ee){let K=At(We[0]);t.texStorage2D(s.TEXTURE_2D,pe,Me,K.width,K.height)}for(let K=0,q=We.length;K<q;K++)ae=We[K],O?re&&t.texSubImage2D(s.TEXTURE_2D,K,0,0,ce,Ne,ae):t.texImage2D(s.TEXTURE_2D,K,Me,ce,Ne,ae);v.generateMipmaps=!1}else if(O){if(ee){let K=At(Q);t.texStorage2D(s.TEXTURE_2D,pe,Me,K.width,K.height)}re&&t.texSubImage2D(s.TEXTURE_2D,0,0,0,ce,Ne,Q)}else t.texImage2D(s.TEXTURE_2D,0,Me,ce,Ne,Q);m(v)&&p(X),Ee.__version=G.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function ne(C,v,k){if(v.image.length!==6)return;let X=at(C,v),$=v.source;t.bindTexture(s.TEXTURE_CUBE_MAP,C.__webglTexture,s.TEXTURE0+k);let G=n.get($);if($.version!==G.__version||X===!0){t.activeTexture(s.TEXTURE0+k);let Ee=je.getPrimaries(je.workingColorSpace),ie=v.colorSpace===Ri?null:je.getPrimaries(v.colorSpace),xe=v.colorSpace===Ri||Ee===ie?s.NONE:s.BROWSER_DEFAULT_WEBGL;s.pixelStorei(s.UNPACK_FLIP_Y_WEBGL,v.flipY),s.pixelStorei(s.UNPACK_PREMULTIPLY_ALPHA_WEBGL,v.premultiplyAlpha),s.pixelStorei(s.UNPACK_ALIGNMENT,v.unpackAlignment),s.pixelStorei(s.UNPACK_COLORSPACE_CONVERSION_WEBGL,xe);let be=v.isCompressedTexture||v.image[0].isCompressedTexture,Q=v.image[0]&&v.image[0].isDataTexture,ce=[];for(let q=0;q<6;q++)!be&&!Q?ce[q]=_(v.image[q],!0,i.maxCubemapSize):ce[q]=Q?v.image[q].image:v.image[q],ce[q]=Ut(v,ce[q]);let Ne=ce[0],Me=r.convert(v.format,v.colorSpace),ae=r.convert(v.type),We=M(v.internalFormat,Me,ae,v.colorSpace),O=v.isVideoTexture!==!0,ee=G.__version===void 0||X===!0,re=$.dataReady,pe=T(v,Ne);He(s.TEXTURE_CUBE_MAP,v);let K;if(be){O&&ee&&t.texStorage2D(s.TEXTURE_CUBE_MAP,pe,We,Ne.width,Ne.height);for(let q=0;q<6;q++){K=ce[q].mipmaps;for(let ve=0;ve<K.length;ve++){let Ve=K[ve];v.format!==Zt?Me!==null?O?re&&t.compressedTexSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,ve,0,0,Ve.width,Ve.height,Me,Ve.data):t.compressedTexImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,ve,We,Ve.width,Ve.height,0,Ve.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?re&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,ve,0,0,Ve.width,Ve.height,Me,ae,Ve.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,ve,We,Ve.width,Ve.height,0,Me,ae,Ve.data)}}}else{if(K=v.mipmaps,O&&ee){K.length>0&&pe++;let q=At(ce[0]);t.texStorage2D(s.TEXTURE_CUBE_MAP,pe,We,q.width,q.height)}for(let q=0;q<6;q++)if(Q){O?re&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,ce[q].width,ce[q].height,Me,ae,ce[q].data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,We,ce[q].width,ce[q].height,0,Me,ae,ce[q].data);for(let ve=0;ve<K.length;ve++){let gt=K[ve].image[q].image;O?re&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,ve+1,0,0,gt.width,gt.height,Me,ae,gt.data):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,ve+1,We,gt.width,gt.height,0,Me,ae,gt.data)}}else{O?re&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,0,0,Me,ae,ce[q]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,0,We,Me,ae,ce[q]);for(let ve=0;ve<K.length;ve++){let Ve=K[ve];O?re&&t.texSubImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,ve+1,0,0,Me,ae,Ve.image[q]):t.texImage2D(s.TEXTURE_CUBE_MAP_POSITIVE_X+q,ve+1,We,Me,ae,Ve.image[q])}}}m(v)&&p(s.TEXTURE_CUBE_MAP),G.__version=$.version,v.onUpdate&&v.onUpdate(v)}C.__version=v.version}function Pe(C,v,k,X,$,G){let Ee=r.convert(k.format,k.colorSpace),ie=r.convert(k.type),xe=M(k.internalFormat,Ee,ie,k.colorSpace),be=n.get(v),Q=n.get(k);if(Q.__renderTarget=v,!be.__hasExternalTextures){let ce=Math.max(1,v.width>>G),Ne=Math.max(1,v.height>>G);$===s.TEXTURE_3D||$===s.TEXTURE_2D_ARRAY?t.texImage3D($,G,xe,ce,Ne,v.depth,0,Ee,ie,null):t.texImage2D($,G,xe,ce,Ne,0,Ee,ie,null)}t.bindFramebuffer(s.FRAMEBUFFER,C),ge(v)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,X,$,Q.__webglTexture,0,xt(v)):($===s.TEXTURE_2D||$>=s.TEXTURE_CUBE_MAP_POSITIVE_X&&$<=s.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&s.framebufferTexture2D(s.FRAMEBUFFER,X,$,Q.__webglTexture,G),t.bindFramebuffer(s.FRAMEBUFFER,null)}function we(C,v,k){if(s.bindRenderbuffer(s.RENDERBUFFER,C),v.depthBuffer){let X=v.depthTexture,$=X&&X.isDepthTexture?X.type:null,G=y(v.stencilBuffer,$),Ee=v.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,ie=xt(v);ge(v)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,ie,G,v.width,v.height):k?s.renderbufferStorageMultisample(s.RENDERBUFFER,ie,G,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,G,v.width,v.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,Ee,s.RENDERBUFFER,C)}else{let X=v.textures;for(let $=0;$<X.length;$++){let G=X[$],Ee=r.convert(G.format,G.colorSpace),ie=r.convert(G.type),xe=M(G.internalFormat,Ee,ie,G.colorSpace),be=xt(v);k&&ge(v)===!1?s.renderbufferStorageMultisample(s.RENDERBUFFER,be,xe,v.width,v.height):ge(v)?l.renderbufferStorageMultisampleEXT(s.RENDERBUFFER,be,xe,v.width,v.height):s.renderbufferStorage(s.RENDERBUFFER,xe,v.width,v.height)}}s.bindRenderbuffer(s.RENDERBUFFER,null)}function Oe(C,v){if(v&&v.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(s.FRAMEBUFFER,C),!(v.depthTexture&&v.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let X=n.get(v.depthTexture);X.__renderTarget=v,(!X.__webglTexture||v.depthTexture.image.width!==v.width||v.depthTexture.image.height!==v.height)&&(v.depthTexture.image.width=v.width,v.depthTexture.image.height=v.height,v.depthTexture.needsUpdate=!0),j(v.depthTexture,0);let $=X.__webglTexture,G=xt(v);if(v.depthTexture.format===Es)ge(v)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,$,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_ATTACHMENT,s.TEXTURE_2D,$,0);else if(v.depthTexture.format===Vs)ge(v)?l.framebufferTexture2DMultisampleEXT(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,$,0,G):s.framebufferTexture2D(s.FRAMEBUFFER,s.DEPTH_STENCIL_ATTACHMENT,s.TEXTURE_2D,$,0);else throw new Error("Unknown depthTexture format")}function bt(C){let v=n.get(C),k=C.isWebGLCubeRenderTarget===!0;if(v.__boundDepthTexture!==C.depthTexture){let X=C.depthTexture;if(v.__depthDisposeCallback&&v.__depthDisposeCallback(),X){let $=()=>{delete v.__boundDepthTexture,delete v.__depthDisposeCallback,X.removeEventListener("dispose",$)};X.addEventListener("dispose",$),v.__depthDisposeCallback=$}v.__boundDepthTexture=X}if(C.depthTexture&&!v.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");let X=C.texture.mipmaps;X&&X.length>0?Oe(v.__webglFramebuffer[0],C):Oe(v.__webglFramebuffer,C)}else if(k){v.__webglDepthbuffer=[];for(let X=0;X<6;X++)if(t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[X]),v.__webglDepthbuffer[X]===void 0)v.__webglDepthbuffer[X]=s.createRenderbuffer(),we(v.__webglDepthbuffer[X],C,!1);else{let $=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,G=v.__webglDepthbuffer[X];s.bindRenderbuffer(s.RENDERBUFFER,G),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,G)}}else{let X=C.texture.mipmaps;if(X&&X.length>0?t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer[0]):t.bindFramebuffer(s.FRAMEBUFFER,v.__webglFramebuffer),v.__webglDepthbuffer===void 0)v.__webglDepthbuffer=s.createRenderbuffer(),we(v.__webglDepthbuffer,C,!1);else{let $=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,G=v.__webglDepthbuffer;s.bindRenderbuffer(s.RENDERBUFFER,G),s.framebufferRenderbuffer(s.FRAMEBUFFER,$,s.RENDERBUFFER,G)}}t.bindFramebuffer(s.FRAMEBUFFER,null)}function Qe(C,v,k){let X=n.get(C);v!==void 0&&Pe(X.__webglFramebuffer,C,C.texture,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,0),k!==void 0&&bt(C)}function I(C){let v=C.texture,k=n.get(C),X=n.get(v);C.addEventListener("dispose",A);let $=C.textures,G=C.isWebGLCubeRenderTarget===!0,Ee=$.length>1;if(Ee||(X.__webglTexture===void 0&&(X.__webglTexture=s.createTexture()),X.__version=v.version,o.memory.textures++),G){k.__webglFramebuffer=[];for(let ie=0;ie<6;ie++)if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer[ie]=[];for(let xe=0;xe<v.mipmaps.length;xe++)k.__webglFramebuffer[ie][xe]=s.createFramebuffer()}else k.__webglFramebuffer[ie]=s.createFramebuffer()}else{if(v.mipmaps&&v.mipmaps.length>0){k.__webglFramebuffer=[];for(let ie=0;ie<v.mipmaps.length;ie++)k.__webglFramebuffer[ie]=s.createFramebuffer()}else k.__webglFramebuffer=s.createFramebuffer();if(Ee)for(let ie=0,xe=$.length;ie<xe;ie++){let be=n.get($[ie]);be.__webglTexture===void 0&&(be.__webglTexture=s.createTexture(),o.memory.textures++)}if(C.samples>0&&ge(C)===!1){k.__webglMultisampledFramebuffer=s.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(s.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let ie=0;ie<$.length;ie++){let xe=$[ie];k.__webglColorRenderbuffer[ie]=s.createRenderbuffer(),s.bindRenderbuffer(s.RENDERBUFFER,k.__webglColorRenderbuffer[ie]);let be=r.convert(xe.format,xe.colorSpace),Q=r.convert(xe.type),ce=M(xe.internalFormat,be,Q,xe.colorSpace,C.isXRRenderTarget===!0),Ne=xt(C);s.renderbufferStorageMultisample(s.RENDERBUFFER,Ne,ce,C.width,C.height),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+ie,s.RENDERBUFFER,k.__webglColorRenderbuffer[ie])}s.bindRenderbuffer(s.RENDERBUFFER,null),C.depthBuffer&&(k.__webglDepthRenderbuffer=s.createRenderbuffer(),we(k.__webglDepthRenderbuffer,C,!0)),t.bindFramebuffer(s.FRAMEBUFFER,null)}}if(G){t.bindTexture(s.TEXTURE_CUBE_MAP,X.__webglTexture),He(s.TEXTURE_CUBE_MAP,v);for(let ie=0;ie<6;ie++)if(v.mipmaps&&v.mipmaps.length>0)for(let xe=0;xe<v.mipmaps.length;xe++)Pe(k.__webglFramebuffer[ie][xe],C,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,xe);else Pe(k.__webglFramebuffer[ie],C,v,s.COLOR_ATTACHMENT0,s.TEXTURE_CUBE_MAP_POSITIVE_X+ie,0);m(v)&&p(s.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(Ee){for(let ie=0,xe=$.length;ie<xe;ie++){let be=$[ie],Q=n.get(be),ce=s.TEXTURE_2D;(C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ce=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ce,Q.__webglTexture),He(ce,be),Pe(k.__webglFramebuffer,C,be,s.COLOR_ATTACHMENT0+ie,ce,0),m(be)&&p(ce)}t.unbindTexture()}else{let ie=s.TEXTURE_2D;if((C.isWebGL3DRenderTarget||C.isWebGLArrayRenderTarget)&&(ie=C.isWebGL3DRenderTarget?s.TEXTURE_3D:s.TEXTURE_2D_ARRAY),t.bindTexture(ie,X.__webglTexture),He(ie,v),v.mipmaps&&v.mipmaps.length>0)for(let xe=0;xe<v.mipmaps.length;xe++)Pe(k.__webglFramebuffer[xe],C,v,s.COLOR_ATTACHMENT0,ie,xe);else Pe(k.__webglFramebuffer,C,v,s.COLOR_ATTACHMENT0,ie,0);m(v)&&p(ie),t.unbindTexture()}C.depthBuffer&&bt(C)}function mt(C){let v=C.textures;for(let k=0,X=v.length;k<X;k++){let $=v[k];if(m($)){let G=b(C),Ee=n.get($).__webglTexture;t.bindTexture(G,Ee),p(G),t.unbindTexture()}}}let Ie=[],rt=[];function Ce(C){if(C.samples>0){if(ge(C)===!1){let v=C.textures,k=C.width,X=C.height,$=s.COLOR_BUFFER_BIT,G=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT,Ee=n.get(C),ie=v.length>1;if(ie)for(let be=0;be<v.length;be++)t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+be,s.RENDERBUFFER,null),t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+be,s.TEXTURE_2D,null,0);t.bindFramebuffer(s.READ_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer);let xe=C.texture.mipmaps;xe&&xe.length>0?t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer[0]):t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ee.__webglFramebuffer);for(let be=0;be<v.length;be++){if(C.resolveDepthBuffer&&(C.depthBuffer&&($|=s.DEPTH_BUFFER_BIT),C.stencilBuffer&&C.resolveStencilBuffer&&($|=s.STENCIL_BUFFER_BIT)),ie){s.framebufferRenderbuffer(s.READ_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.RENDERBUFFER,Ee.__webglColorRenderbuffer[be]);let Q=n.get(v[be]).__webglTexture;s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0,s.TEXTURE_2D,Q,0)}s.blitFramebuffer(0,0,k,X,0,0,k,X,$,s.NEAREST),u===!0&&(Ie.length=0,rt.length=0,Ie.push(s.COLOR_ATTACHMENT0+be),C.depthBuffer&&C.resolveDepthBuffer===!1&&(Ie.push(G),rt.push(G),s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,rt)),s.invalidateFramebuffer(s.READ_FRAMEBUFFER,Ie))}if(t.bindFramebuffer(s.READ_FRAMEBUFFER,null),t.bindFramebuffer(s.DRAW_FRAMEBUFFER,null),ie)for(let be=0;be<v.length;be++){t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglMultisampledFramebuffer),s.framebufferRenderbuffer(s.FRAMEBUFFER,s.COLOR_ATTACHMENT0+be,s.RENDERBUFFER,Ee.__webglColorRenderbuffer[be]);let Q=n.get(v[be]).__webglTexture;t.bindFramebuffer(s.FRAMEBUFFER,Ee.__webglFramebuffer),s.framebufferTexture2D(s.DRAW_FRAMEBUFFER,s.COLOR_ATTACHMENT0+be,s.TEXTURE_2D,Q,0)}t.bindFramebuffer(s.DRAW_FRAMEBUFFER,Ee.__webglMultisampledFramebuffer)}else if(C.depthBuffer&&C.resolveDepthBuffer===!1&&u){let v=C.stencilBuffer?s.DEPTH_STENCIL_ATTACHMENT:s.DEPTH_ATTACHMENT;s.invalidateFramebuffer(s.DRAW_FRAMEBUFFER,[v])}}}function xt(C){return Math.min(i.maxSamples,C.samples)}function ge(C){let v=n.get(C);return C.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&v.__useRenderToTexture!==!1}function Ye(C){let v=o.render.frame;a.get(C)!==v&&(a.set(C,v),C.update())}function Ut(C,v){let k=C.colorSpace,X=C.format,$=C.type;return C.isCompressedTexture===!0||C.isVideoTexture===!0||k!==Lt&&k!==Ri&&(je.getTransfer(k)===ct?(X!==Zt||$!==an)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",k)),v}function At(C){return typeof HTMLImageElement<"u"&&C instanceof HTMLImageElement?(d.width=C.naturalWidth||C.width,d.height=C.naturalHeight||C.height):typeof VideoFrame<"u"&&C instanceof VideoFrame?(d.width=C.displayWidth,d.height=C.displayHeight):(d.width=C.width,d.height=C.height),d}this.allocateTextureUnit=B,this.resetTextureUnits=V,this.setTexture2D=j,this.setTexture2DArray=Y,this.setTexture3D=Z,this.setTextureCube=H,this.rebindTextures=Qe,this.setupRenderTarget=I,this.updateRenderTargetMipmap=mt,this.updateMultisampleRenderTarget=Ce,this.setupDepthRenderbuffer=bt,this.setupFrameBufferTexture=Pe,this.useMultisampledRTT=ge}function _y(s,e){function t(n,i=Ri){let r,o=je.getTransfer(i);if(n===an)return s.UNSIGNED_BYTE;if(n===Ml)return s.UNSIGNED_SHORT_4_4_4_4;if(n===Sl)return s.UNSIGNED_SHORT_5_5_5_1;if(n===Cu)return s.UNSIGNED_INT_5_9_9_9_REV;if(n===Su)return s.BYTE;if(n===Eu)return s.SHORT;if(n===Bs)return s.UNSIGNED_SHORT;if(n===bl)return s.INT;if(n===Qi)return s.UNSIGNED_INT;if(n===On)return s.FLOAT;if(n===Hs)return s.HALF_FLOAT;if(n===wu)return s.ALPHA;if(n===Tu)return s.RGB;if(n===Zt)return s.RGBA;if(n===Es)return s.DEPTH_COMPONENT;if(n===Vs)return s.DEPTH_STENCIL;if(n===El)return s.RED;if(n===Cl)return s.RED_INTEGER;if(n===Au)return s.RG;if(n===wl)return s.RG_INTEGER;if(n===Tl)return s.RGBA_INTEGER;if(n===$o||n===Ko||n===Jo||n===Qo)if(o===ct)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===$o)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Ko)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Jo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Qo)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===$o)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Ko)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Jo)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Qo)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===Al||n===Rl||n===Pl||n===Il)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===Al)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===Rl)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===Pl)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===Il)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===Dl||n===Ol||n===Ll)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===Dl||n===Ol)return o===ct?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===Ll)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Nl||n===kl||n===Fl||n===Ul||n===Bl||n===Hl||n===zl||n===Vl||n===Gl||n===Wl||n===Xl||n===Yl||n===ql||n===jl)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Nl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===kl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Fl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ul)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Bl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Hl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===zl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Vl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Gl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Wl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Xl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Yl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===ql)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===jl)return o===ct?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===ea||n===Zl||n===$l)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===ea)return o===ct?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Zl)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===$l)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===Ru||n===Kl||n===Jl||n===Ql)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ea)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Kl)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Jl)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Ql)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===zs?s.UNSIGNED_INT_24_8:s[n]!==void 0?s[n]:null}return{convert:t}}var rc=class extends pn{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}},vy=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,yy=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,Ju=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){let n=new rc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){let t=e.cameras[0].viewport,n=new Rt({vertexShader:vy,fragmentShader:yy,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Ue(new zt(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},Qu=class extends Yn{constructor(e,t){super();let n=this,i=null,r=1,o=null,l="local-floor",u=1,d=null,a=null,c=null,h=null,f=null,g=null,_=new Ju,m={},p=t.getContextAttributes(),b=null,M=null,y=[],T=[],P=new Se,A=null,D=new It;D.viewport=new it;let S=new It;S.viewport=new it;let E=[D,S],R=new cl,V=null,B=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(W){let se=y[W];return se===void 0&&(se=new Rs,y[W]=se),se.getTargetRaySpace()},this.getControllerGrip=function(W){let se=y[W];return se===void 0&&(se=new Rs,y[W]=se),se.getGripSpace()},this.getHand=function(W){let se=y[W];return se===void 0&&(se=new Rs,y[W]=se),se.getHandSpace()};function z(W){let se=T.indexOf(W.inputSource);if(se===-1)return;let ne=y[se];ne!==void 0&&(ne.update(W.inputSource,W.frame,d||o),ne.dispatchEvent({type:W.type,data:W.inputSource}))}function j(){i.removeEventListener("select",z),i.removeEventListener("selectstart",z),i.removeEventListener("selectend",z),i.removeEventListener("squeeze",z),i.removeEventListener("squeezestart",z),i.removeEventListener("squeezeend",z),i.removeEventListener("end",j),i.removeEventListener("inputsourceschange",Y);for(let W=0;W<y.length;W++){let se=T[W];se!==null&&(T[W]=null,y[W].disconnect(se))}V=null,B=null,_.reset();for(let W in m)delete m[W];e.setRenderTarget(b),f=null,h=null,c=null,i=null,M=null,tt.stop(),n.isPresenting=!1,e.setPixelRatio(A),e.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(W){r=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(W){l=W,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return d||o},this.setReferenceSpace=function(W){d=W},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return c},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=function(W){return rn(this,null,function*(){if(i=W,i!==null){if(b=e.getRenderTarget(),i.addEventListener("select",z),i.addEventListener("selectstart",z),i.addEventListener("selectend",z),i.addEventListener("squeeze",z),i.addEventListener("squeezestart",z),i.addEventListener("squeezeend",z),i.addEventListener("end",j),i.addEventListener("inputsourceschange",Y),p.xrCompatible!==!0&&(yield t.makeXRCompatible()),A=e.getPixelRatio(),e.getSize(P),typeof XRWebGLBinding<"u"&&(c=new XRWebGLBinding(i,t)),c!==null&&"createProjectionLayer"in XRWebGLBinding.prototype){let ne=null,Pe=null,we=null;p.depth&&(we=p.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,ne=p.stencil?Vs:Es,Pe=p.stencil?zs:Qi);let Oe={colorFormat:t.RGBA8,depthFormat:we,scaleFactor:r};h=c.createProjectionLayer(Oe),i.updateRenderState({layers:[h]}),e.setPixelRatio(1),e.setSize(h.textureWidth,h.textureHeight,!1),M=new un(h.textureWidth,h.textureHeight,{format:Zt,type:an,depthTexture:new Fo(h.textureWidth,h.textureHeight,Pe,void 0,void 0,void 0,void 0,void 0,void 0,ne),stencilBuffer:p.stencil,colorSpace:e.outputColorSpace,samples:p.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{let ne={antialias:p.antialias,alpha:!0,depth:p.depth,stencil:p.stencil,framebufferScaleFactor:r};f=new XRWebGLLayer(i,t,ne),i.updateRenderState({baseLayer:f}),e.setPixelRatio(1),e.setSize(f.framebufferWidth,f.framebufferHeight,!1),M=new un(f.framebufferWidth,f.framebufferHeight,{format:Zt,type:an,colorSpace:e.outputColorSpace,stencilBuffer:p.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}M.isXRRenderTarget=!0,this.setFoveation(u),d=null,o=yield i.requestReferenceSpace(l),tt.setContext(i),tt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}})},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return _.getDepthTexture()};function Y(W){for(let se=0;se<W.removed.length;se++){let ne=W.removed[se],Pe=T.indexOf(ne);Pe>=0&&(T[Pe]=null,y[Pe].disconnect(ne))}for(let se=0;se<W.added.length;se++){let ne=W.added[se],Pe=T.indexOf(ne);if(Pe===-1){for(let Oe=0;Oe<y.length;Oe++)if(Oe>=T.length){T.push(ne),Pe=Oe;break}else if(T[Oe]===null){T[Oe]=ne,Pe=Oe;break}if(Pe===-1)break}let we=y[Pe];we&&we.connect(ne)}}let Z=new w,H=new w;function te(W,se,ne){Z.setFromMatrixPosition(se.matrixWorld),H.setFromMatrixPosition(ne.matrixWorld);let Pe=Z.distanceTo(H),we=se.projectionMatrix.elements,Oe=ne.projectionMatrix.elements,bt=we[14]/(we[10]-1),Qe=we[14]/(we[10]+1),I=(we[9]+1)/we[5],mt=(we[9]-1)/we[5],Ie=(we[8]-1)/we[0],rt=(Oe[8]+1)/Oe[0],Ce=bt*Ie,xt=bt*rt,ge=Pe/(-Ie+rt),Ye=ge*-Ie;if(se.matrixWorld.decompose(W.position,W.quaternion,W.scale),W.translateX(Ye),W.translateZ(ge),W.matrixWorld.compose(W.position,W.quaternion,W.scale),W.matrixWorldInverse.copy(W.matrixWorld).invert(),we[10]===-1)W.projectionMatrix.copy(se.projectionMatrix),W.projectionMatrixInverse.copy(se.projectionMatrixInverse);else{let Ut=bt+ge,At=Qe+ge,C=Ce-Ye,v=xt+(Pe-Ye),k=I*Qe/At*Ut,X=mt*Qe/At*Ut;W.projectionMatrix.makePerspective(C,v,k,X,Ut,At),W.projectionMatrixInverse.copy(W.projectionMatrix).invert()}}function ue(W,se){se===null?W.matrixWorld.copy(W.matrix):W.matrixWorld.multiplyMatrices(se.matrixWorld,W.matrix),W.matrixWorldInverse.copy(W.matrixWorld).invert()}this.updateCamera=function(W){if(i===null)return;let se=W.near,ne=W.far;_.texture!==null&&(_.depthNear>0&&(se=_.depthNear),_.depthFar>0&&(ne=_.depthFar)),R.near=S.near=D.near=se,R.far=S.far=D.far=ne,(V!==R.near||B!==R.far)&&(i.updateRenderState({depthNear:R.near,depthFar:R.far}),V=R.near,B=R.far),R.layers.mask=W.layers.mask|6,D.layers.mask=R.layers.mask&3,S.layers.mask=R.layers.mask&5;let Pe=W.parent,we=R.cameras;ue(R,Pe);for(let Oe=0;Oe<we.length;Oe++)ue(we[Oe],Pe);we.length===2?te(R,D,S):R.projectionMatrix.copy(D.projectionMatrix),ye(W,R,Pe)};function ye(W,se,ne){ne===null?W.matrix.copy(se.matrixWorld):(W.matrix.copy(ne.matrixWorld),W.matrix.invert(),W.matrix.multiply(se.matrixWorld)),W.matrix.decompose(W.position,W.quaternion,W.scale),W.updateMatrixWorld(!0),W.projectionMatrix.copy(se.projectionMatrix),W.projectionMatrixInverse.copy(se.projectionMatrixInverse),W.isPerspectiveCamera&&(W.fov=yr*2*Math.atan(1/W.projectionMatrix.elements[5]),W.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(h===null&&f===null))return u},this.setFoveation=function(W){u=W,h!==null&&(h.fixedFoveation=W),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=W)},this.hasDepthSensing=function(){return _.texture!==null},this.getDepthSensingMesh=function(){return _.getMesh(R)},this.getCameraTexture=function(W){return m[W]};let He=null;function at(W,se){if(a=se.getViewerPose(d||o),g=se,a!==null){let ne=a.views;f!==null&&(e.setRenderTargetFramebuffer(M,f.framebuffer),e.setRenderTarget(M));let Pe=!1;ne.length!==R.cameras.length&&(R.cameras.length=0,Pe=!0);for(let Qe=0;Qe<ne.length;Qe++){let I=ne[Qe],mt=null;if(f!==null)mt=f.getViewport(I);else{let rt=c.getViewSubImage(h,I);mt=rt.viewport,Qe===0&&(e.setRenderTargetTextures(M,rt.colorTexture,rt.depthStencilTexture),e.setRenderTarget(M))}let Ie=E[Qe];Ie===void 0&&(Ie=new It,Ie.layers.enable(Qe),Ie.viewport=new it,E[Qe]=Ie),Ie.matrix.fromArray(I.transform.matrix),Ie.matrix.decompose(Ie.position,Ie.quaternion,Ie.scale),Ie.projectionMatrix.fromArray(I.projectionMatrix),Ie.projectionMatrixInverse.copy(Ie.projectionMatrix).invert(),Ie.viewport.set(mt.x,mt.y,mt.width,mt.height),Qe===0&&(R.matrix.copy(Ie.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),Pe===!0&&R.cameras.push(Ie)}let we=i.enabledFeatures;if(we&&we.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&c){let Qe=c.getDepthInformation(ne[0]);Qe&&Qe.isValid&&Qe.texture&&_.init(Qe,i.renderState)}if(we&&we.includes("camera-access")&&(e.state.unbindTexture(),c))for(let Qe=0;Qe<ne.length;Qe++){let I=ne[Qe].camera;if(I){let mt=m[I];mt||(mt=new rc,m[I]=mt);let Ie=c.getCameraImage(I);mt.sourceTexture=Ie}}}for(let ne=0;ne<y.length;ne++){let Pe=T[ne],we=y[ne];Pe!==null&&we!==void 0&&we.update(Pe,se,d||o)}He&&He(W,se),se.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:se}),g=null}let tt=new ap;tt.setAnimationLoop(at),this.setAnimationLoop=function(W){He=W},this.dispose=function(){}}},Or=new Yt,xy=new ke;function by(s,e){function t(m,p){m.matrixAutoUpdate===!0&&m.updateMatrix(),p.value.copy(m.matrix)}function n(m,p){p.color.getRGB(m.fogColor.value,ku(s)),p.isFog?(m.fogNear.value=p.near,m.fogFar.value=p.far):p.isFogExp2&&(m.fogDensity.value=p.density)}function i(m,p,b,M,y){p.isMeshBasicMaterial||p.isMeshLambertMaterial?r(m,p):p.isMeshToonMaterial?(r(m,p),c(m,p)):p.isMeshPhongMaterial?(r(m,p),a(m,p)):p.isMeshStandardMaterial?(r(m,p),h(m,p),p.isMeshPhysicalMaterial&&f(m,p,y)):p.isMeshMatcapMaterial?(r(m,p),g(m,p)):p.isMeshDepthMaterial?r(m,p):p.isMeshDistanceMaterial?(r(m,p),_(m,p)):p.isMeshNormalMaterial?r(m,p):p.isLineBasicMaterial?(o(m,p),p.isLineDashedMaterial&&l(m,p)):p.isPointsMaterial?u(m,p,b,M):p.isSpriteMaterial?d(m,p):p.isShadowMaterial?(m.color.value.copy(p.color),m.opacity.value=p.opacity):p.isShaderMaterial&&(p.uniformsNeedUpdate=!1)}function r(m,p){m.opacity.value=p.opacity,p.color&&m.diffuse.value.copy(p.color),p.emissive&&m.emissive.value.copy(p.emissive).multiplyScalar(p.emissiveIntensity),p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.bumpMap&&(m.bumpMap.value=p.bumpMap,t(p.bumpMap,m.bumpMapTransform),m.bumpScale.value=p.bumpScale,p.side===jt&&(m.bumpScale.value*=-1)),p.normalMap&&(m.normalMap.value=p.normalMap,t(p.normalMap,m.normalMapTransform),m.normalScale.value.copy(p.normalScale),p.side===jt&&m.normalScale.value.negate()),p.displacementMap&&(m.displacementMap.value=p.displacementMap,t(p.displacementMap,m.displacementMapTransform),m.displacementScale.value=p.displacementScale,m.displacementBias.value=p.displacementBias),p.emissiveMap&&(m.emissiveMap.value=p.emissiveMap,t(p.emissiveMap,m.emissiveMapTransform)),p.specularMap&&(m.specularMap.value=p.specularMap,t(p.specularMap,m.specularMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest);let b=e.get(p),M=b.envMap,y=b.envMapRotation;M&&(m.envMap.value=M,Or.copy(y),Or.x*=-1,Or.y*=-1,Or.z*=-1,M.isCubeTexture&&M.isRenderTargetTexture===!1&&(Or.y*=-1,Or.z*=-1),m.envMapRotation.value.setFromMatrix4(xy.makeRotationFromEuler(Or)),m.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=p.reflectivity,m.ior.value=p.ior,m.refractionRatio.value=p.refractionRatio),p.lightMap&&(m.lightMap.value=p.lightMap,m.lightMapIntensity.value=p.lightMapIntensity,t(p.lightMap,m.lightMapTransform)),p.aoMap&&(m.aoMap.value=p.aoMap,m.aoMapIntensity.value=p.aoMapIntensity,t(p.aoMap,m.aoMapTransform))}function o(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform))}function l(m,p){m.dashSize.value=p.dashSize,m.totalSize.value=p.dashSize+p.gapSize,m.scale.value=p.scale}function u(m,p,b,M){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.size.value=p.size*b,m.scale.value=M*.5,p.map&&(m.map.value=p.map,t(p.map,m.uvTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function d(m,p){m.diffuse.value.copy(p.color),m.opacity.value=p.opacity,m.rotation.value=p.rotation,p.map&&(m.map.value=p.map,t(p.map,m.mapTransform)),p.alphaMap&&(m.alphaMap.value=p.alphaMap,t(p.alphaMap,m.alphaMapTransform)),p.alphaTest>0&&(m.alphaTest.value=p.alphaTest)}function a(m,p){m.specular.value.copy(p.specular),m.shininess.value=Math.max(p.shininess,1e-4)}function c(m,p){p.gradientMap&&(m.gradientMap.value=p.gradientMap)}function h(m,p){m.metalness.value=p.metalness,p.metalnessMap&&(m.metalnessMap.value=p.metalnessMap,t(p.metalnessMap,m.metalnessMapTransform)),m.roughness.value=p.roughness,p.roughnessMap&&(m.roughnessMap.value=p.roughnessMap,t(p.roughnessMap,m.roughnessMapTransform)),p.envMap&&(m.envMapIntensity.value=p.envMapIntensity)}function f(m,p,b){m.ior.value=p.ior,p.sheen>0&&(m.sheenColor.value.copy(p.sheenColor).multiplyScalar(p.sheen),m.sheenRoughness.value=p.sheenRoughness,p.sheenColorMap&&(m.sheenColorMap.value=p.sheenColorMap,t(p.sheenColorMap,m.sheenColorMapTransform)),p.sheenRoughnessMap&&(m.sheenRoughnessMap.value=p.sheenRoughnessMap,t(p.sheenRoughnessMap,m.sheenRoughnessMapTransform))),p.clearcoat>0&&(m.clearcoat.value=p.clearcoat,m.clearcoatRoughness.value=p.clearcoatRoughness,p.clearcoatMap&&(m.clearcoatMap.value=p.clearcoatMap,t(p.clearcoatMap,m.clearcoatMapTransform)),p.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=p.clearcoatRoughnessMap,t(p.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),p.clearcoatNormalMap&&(m.clearcoatNormalMap.value=p.clearcoatNormalMap,t(p.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(p.clearcoatNormalScale),p.side===jt&&m.clearcoatNormalScale.value.negate())),p.dispersion>0&&(m.dispersion.value=p.dispersion),p.iridescence>0&&(m.iridescence.value=p.iridescence,m.iridescenceIOR.value=p.iridescenceIOR,m.iridescenceThicknessMinimum.value=p.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=p.iridescenceThicknessRange[1],p.iridescenceMap&&(m.iridescenceMap.value=p.iridescenceMap,t(p.iridescenceMap,m.iridescenceMapTransform)),p.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=p.iridescenceThicknessMap,t(p.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),p.transmission>0&&(m.transmission.value=p.transmission,m.transmissionSamplerMap.value=b.texture,m.transmissionSamplerSize.value.set(b.width,b.height),p.transmissionMap&&(m.transmissionMap.value=p.transmissionMap,t(p.transmissionMap,m.transmissionMapTransform)),m.thickness.value=p.thickness,p.thicknessMap&&(m.thicknessMap.value=p.thicknessMap,t(p.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=p.attenuationDistance,m.attenuationColor.value.copy(p.attenuationColor)),p.anisotropy>0&&(m.anisotropyVector.value.set(p.anisotropy*Math.cos(p.anisotropyRotation),p.anisotropy*Math.sin(p.anisotropyRotation)),p.anisotropyMap&&(m.anisotropyMap.value=p.anisotropyMap,t(p.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=p.specularIntensity,m.specularColor.value.copy(p.specularColor),p.specularColorMap&&(m.specularColorMap.value=p.specularColorMap,t(p.specularColorMap,m.specularColorMapTransform)),p.specularIntensityMap&&(m.specularIntensityMap.value=p.specularIntensityMap,t(p.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,p){p.matcap&&(m.matcap.value=p.matcap)}function _(m,p){let b=e.get(p).light;m.referencePosition.value.setFromMatrixPosition(b.matrixWorld),m.nearDistance.value=b.shadow.camera.near,m.farDistance.value=b.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function My(s,e,t,n){let i={},r={},o=[],l=s.getParameter(s.MAX_UNIFORM_BUFFER_BINDINGS);function u(b,M){let y=M.program;n.uniformBlockBinding(b,y)}function d(b,M){let y=i[b.id];y===void 0&&(g(b),y=a(b),i[b.id]=y,b.addEventListener("dispose",m));let T=M.program;n.updateUBOMapping(b,T);let P=e.render.frame;r[b.id]!==P&&(h(b),r[b.id]=P)}function a(b){let M=c();b.__bindingPointIndex=M;let y=s.createBuffer(),T=b.__size,P=b.usage;return s.bindBuffer(s.UNIFORM_BUFFER,y),s.bufferData(s.UNIFORM_BUFFER,T,P),s.bindBuffer(s.UNIFORM_BUFFER,null),s.bindBufferBase(s.UNIFORM_BUFFER,M,y),y}function c(){for(let b=0;b<l;b++)if(o.indexOf(b)===-1)return o.push(b),b;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(b){let M=i[b.id],y=b.uniforms,T=b.__cache;s.bindBuffer(s.UNIFORM_BUFFER,M);for(let P=0,A=y.length;P<A;P++){let D=Array.isArray(y[P])?y[P]:[y[P]];for(let S=0,E=D.length;S<E;S++){let R=D[S];if(f(R,P,S,T)===!0){let V=R.__offset,B=Array.isArray(R.value)?R.value:[R.value],z=0;for(let j=0;j<B.length;j++){let Y=B[j],Z=_(Y);typeof Y=="number"||typeof Y=="boolean"?(R.__data[0]=Y,s.bufferSubData(s.UNIFORM_BUFFER,V+z,R.__data)):Y.isMatrix3?(R.__data[0]=Y.elements[0],R.__data[1]=Y.elements[1],R.__data[2]=Y.elements[2],R.__data[3]=0,R.__data[4]=Y.elements[3],R.__data[5]=Y.elements[4],R.__data[6]=Y.elements[5],R.__data[7]=0,R.__data[8]=Y.elements[6],R.__data[9]=Y.elements[7],R.__data[10]=Y.elements[8],R.__data[11]=0):(Y.toArray(R.__data,z),z+=Z.storage/Float32Array.BYTES_PER_ELEMENT)}s.bufferSubData(s.UNIFORM_BUFFER,V,R.__data)}}}s.bindBuffer(s.UNIFORM_BUFFER,null)}function f(b,M,y,T){let P=b.value,A=M+"_"+y;if(T[A]===void 0)return typeof P=="number"||typeof P=="boolean"?T[A]=P:T[A]=P.clone(),!0;{let D=T[A];if(typeof P=="number"||typeof P=="boolean"){if(D!==P)return T[A]=P,!0}else if(D.equals(P)===!1)return D.copy(P),!0}return!1}function g(b){let M=b.uniforms,y=0,T=16;for(let A=0,D=M.length;A<D;A++){let S=Array.isArray(M[A])?M[A]:[M[A]];for(let E=0,R=S.length;E<R;E++){let V=S[E],B=Array.isArray(V.value)?V.value:[V.value];for(let z=0,j=B.length;z<j;z++){let Y=B[z],Z=_(Y),H=y%T,te=H%Z.boundary,ue=H+te;y+=te,ue!==0&&T-ue<Z.storage&&(y+=T-ue),V.__data=new Float32Array(Z.storage/Float32Array.BYTES_PER_ELEMENT),V.__offset=y,y+=Z.storage}}}let P=y%T;return P>0&&(y+=T-P),b.__size=y,b.__cache={},this}function _(b){let M={boundary:0,storage:0};return typeof b=="number"||typeof b=="boolean"?(M.boundary=4,M.storage=4):b.isVector2?(M.boundary=8,M.storage=8):b.isVector3||b.isColor?(M.boundary=16,M.storage=12):b.isVector4?(M.boundary=16,M.storage=16):b.isMatrix3?(M.boundary=48,M.storage=48):b.isMatrix4?(M.boundary=64,M.storage=64):b.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",b),M}function m(b){let M=b.target;M.removeEventListener("dispose",m);let y=o.indexOf(M.__bindingPointIndex);o.splice(y,1),s.deleteBuffer(i[M.id]),delete i[M.id],delete r[M.id]}function p(){for(let b in i)s.deleteBuffer(i[b]);o=[],i={},r={}}return{bind:u,update:d,dispose:p}}var sc=class{constructor(e={}){let{canvas:t=Df(),context:n=null,depth:i=!0,stencil:r=!1,alpha:o=!1,antialias:l=!1,premultipliedAlpha:u=!0,preserveDrawingBuffer:d=!1,powerPreference:a="default",failIfMajorPerformanceCaveat:c=!1,reversedDepthBuffer:h=!1}=e;this.isWebGLRenderer=!0;let f;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");f=n.getContextAttributes().alpha}else f=o;let g=new Uint32Array(4),_=new Int32Array(4),m=null,p=null,b=[],M=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ai,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let y=this,T=!1;this._outputColorSpace=Je;let P=0,A=0,D=null,S=-1,E=null,R=new it,V=new it,B=null,z=new de(0),j=0,Y=t.width,Z=t.height,H=1,te=null,ue=null,ye=new it(0,0,Y,Z),He=new it(0,0,Y,Z),at=!1,tt=new Os,W=!1,se=!1,ne=new ke,Pe=new w,we=new it,Oe={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},bt=!1;function Qe(){return D===null?H:1}let I=n;function mt(x,L){return t.getContext(x,L)}try{let x={alpha:!0,depth:i,stencil:r,antialias:l,premultipliedAlpha:u,preserveDrawingBuffer:d,powerPreference:a,failIfMajorPerformanceCaveat:c};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${"179"}`),t.addEventListener("webglcontextlost",re,!1),t.addEventListener("webglcontextrestored",pe,!1),t.addEventListener("webglcontextcreationerror",K,!1),I===null){let L="webgl2";if(I=mt(L,x),I===null)throw mt(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(x){throw console.error("THREE.WebGLRenderer: "+x.message),x}let Ie,rt,Ce,xt,ge,Ye,Ut,At,C,v,k,X,$,G,Ee,ie,xe,be,Q,ce,Ne,Me,ae,We;function O(){Ie=new H_(I),Ie.init(),Me=new _y(I,Ie),rt=new O_(I,Ie,e,Me),Ce=new my(I,Ie),rt.reversedDepthBuffer&&h&&Ce.buffers.depth.setReversed(!0),xt=new G_(I),ge=new ny,Ye=new gy(I,Ie,Ce,ge,rt,Me,xt),Ut=new N_(y),At=new B_(y),C=new Zm(I),ae=new I_(I,C),v=new z_(I,C,xt,ae),k=new X_(I,v,C,xt),Q=new W_(I,rt,Ye),ie=new L_(ge),X=new ty(y,Ut,At,Ie,rt,ae,ie),$=new by(y,ge),G=new ry,Ee=new uy(Ie),be=new P_(y,Ut,At,Ce,k,f,u),xe=new fy(y,k,rt),We=new My(I,xt,rt,Ce),ce=new D_(I,Ie,xt),Ne=new V_(I,Ie,xt),xt.programs=X.programs,y.capabilities=rt,y.extensions=Ie,y.properties=ge,y.renderLists=G,y.shadowMap=xe,y.state=Ce,y.info=xt}O();let ee=new Qu(y,I);this.xr=ee,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){let x=Ie.get("WEBGL_lose_context");x&&x.loseContext()},this.forceContextRestore=function(){let x=Ie.get("WEBGL_lose_context");x&&x.restoreContext()},this.getPixelRatio=function(){return H},this.setPixelRatio=function(x){x!==void 0&&(H=x,this.setSize(Y,Z,!1))},this.getSize=function(x){return x.set(Y,Z)},this.setSize=function(x,L,F=!0){if(ee.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}Y=x,Z=L,t.width=Math.floor(x*H),t.height=Math.floor(L*H),F===!0&&(t.style.width=x+"px",t.style.height=L+"px"),this.setViewport(0,0,x,L)},this.getDrawingBufferSize=function(x){return x.set(Y*H,Z*H).floor()},this.setDrawingBufferSize=function(x,L,F){Y=x,Z=L,H=F,t.width=Math.floor(x*F),t.height=Math.floor(L*F),this.setViewport(0,0,x,L)},this.getCurrentViewport=function(x){return x.copy(R)},this.getViewport=function(x){return x.copy(ye)},this.setViewport=function(x,L,F,U){x.isVector4?ye.set(x.x,x.y,x.z,x.w):ye.set(x,L,F,U),Ce.viewport(R.copy(ye).multiplyScalar(H).round())},this.getScissor=function(x){return x.copy(He)},this.setScissor=function(x,L,F,U){x.isVector4?He.set(x.x,x.y,x.z,x.w):He.set(x,L,F,U),Ce.scissor(V.copy(He).multiplyScalar(H).round())},this.getScissorTest=function(){return at},this.setScissorTest=function(x){Ce.setScissorTest(at=x)},this.setOpaqueSort=function(x){te=x},this.setTransparentSort=function(x){ue=x},this.getClearColor=function(x){return x.copy(be.getClearColor())},this.setClearColor=function(){be.setClearColor(...arguments)},this.getClearAlpha=function(){return be.getClearAlpha()},this.setClearAlpha=function(){be.setClearAlpha(...arguments)},this.clear=function(x=!0,L=!0,F=!0){let U=0;if(x){let N=!1;if(D!==null){let J=D.texture.format;N=J===Tl||J===wl||J===Cl}if(N){let J=D.texture.type,le=J===an||J===Qi||J===Bs||J===zs||J===Ml||J===Sl,_e=be.getClearColor(),fe=be.getClearAlpha(),Le=_e.r,Fe=_e.g,Te=_e.b;le?(g[0]=Le,g[1]=Fe,g[2]=Te,g[3]=fe,I.clearBufferuiv(I.COLOR,0,g)):(_[0]=Le,_[1]=Fe,_[2]=Te,_[3]=fe,I.clearBufferiv(I.COLOR,0,_))}else U|=I.COLOR_BUFFER_BIT}L&&(U|=I.DEPTH_BUFFER_BIT),F&&(U|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),I.clear(U)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",re,!1),t.removeEventListener("webglcontextrestored",pe,!1),t.removeEventListener("webglcontextcreationerror",K,!1),be.dispose(),G.dispose(),Ee.dispose(),ge.dispose(),Ut.dispose(),At.dispose(),k.dispose(),ae.dispose(),We.dispose(),X.dispose(),ee.dispose(),ee.removeEventListener("sessionstart",Zn),ee.removeEventListener("sessionend",kd),or.stop()};function re(x){x.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),T=!0}function pe(){console.log("THREE.WebGLRenderer: Context Restored."),T=!1;let x=xt.autoReset,L=xe.enabled,F=xe.autoUpdate,U=xe.needsUpdate,N=xe.type;O(),xt.autoReset=x,xe.enabled=L,xe.autoUpdate=F,xe.needsUpdate=U,xe.type=N}function K(x){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",x.statusMessage)}function q(x){let L=x.target;L.removeEventListener("dispose",q),ve(L)}function ve(x){Ve(x),ge.remove(x)}function Ve(x){let L=ge.get(x).programs;L!==void 0&&(L.forEach(function(F){X.releaseProgram(F)}),x.isShaderMaterial&&X.releaseShaderCache(x))}this.renderBufferDirect=function(x,L,F,U,N,J){L===null&&(L=Oe);let le=N.isMesh&&N.matrixWorld.determinant()<0,_e=Hp(x,L,F,U,N);Ce.setMaterial(U,le);let fe=F.index,Le=1;if(U.wireframe===!0){if(fe=v.getWireframeAttribute(F),fe===void 0)return;Le=2}let Fe=F.drawRange,Te=F.attributes.position,Ke=Fe.start*Le,ut=(Fe.start+Fe.count)*Le;J!==null&&(Ke=Math.max(Ke,J.start*Le),ut=Math.min(ut,(J.start+J.count)*Le)),fe!==null?(Ke=Math.max(Ke,0),ut=Math.min(ut,fe.count)):Te!=null&&(Ke=Math.max(Ke,0),ut=Math.min(ut,Te.count));let Et=ut-Ke;if(Et<0||Et===1/0)return;ae.setup(N,U,_e,F,fe);let _t,ht=ce;if(fe!==null&&(_t=C.get(fe),ht=Ne,ht.setIndex(_t)),N.isMesh)U.wireframe===!0?(Ce.setLineWidth(U.wireframeLinewidth*Qe()),ht.setMode(I.LINES)):ht.setMode(I.TRIANGLES);else if(N.isLine){let De=U.linewidth;De===void 0&&(De=1),Ce.setLineWidth(De*Qe()),N.isLineSegments?ht.setMode(I.LINES):N.isLineLoop?ht.setMode(I.LINE_LOOP):ht.setMode(I.LINE_STRIP)}else N.isPoints?ht.setMode(I.POINTS):N.isSprite&&ht.setMode(I.TRIANGLES);if(N.isBatchedMesh)if(N._multiDrawInstances!==null)xr("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),ht.renderMultiDrawInstances(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount,N._multiDrawInstances);else if(Ie.get("WEBGL_multi_draw"))ht.renderMultiDraw(N._multiDrawStarts,N._multiDrawCounts,N._multiDrawCount);else{let De=N._multiDrawStarts,Mt=N._multiDrawCounts,nt=N._multiDrawCount,_n=fe?C.get(fe).bytesPerElement:1,ss=ge.get(U).currentProgram.getUniforms();for(let vn=0;vn<nt;vn++)ss.setValue(I,"_gl_DrawID",vn),ht.render(De[vn]/_n,Mt[vn])}else if(N.isInstancedMesh)ht.renderInstances(Ke,Et,N.count);else if(F.isInstancedBufferGeometry){let De=F._maxInstanceCount!==void 0?F._maxInstanceCount:1/0,Mt=Math.min(F.instanceCount,De);ht.renderInstances(Ke,Et,Mt)}else ht.render(Ke,Et)};function gt(x,L,F){x.transparent===!0&&x.side===Vt&&x.forceSinglePass===!1?(x.side=jt,x.needsUpdate=!0,ca(x,L,F),x.side=Mn,x.needsUpdate=!0,ca(x,L,F),x.side=Vt):ca(x,L,F)}this.compile=function(x,L,F=null){F===null&&(F=x),p=Ee.get(F),p.init(L),M.push(p),F.traverseVisible(function(N){N.isLight&&N.layers.test(L.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),x!==F&&x.traverseVisible(function(N){N.isLight&&N.layers.test(L.layers)&&(p.pushLight(N),N.castShadow&&p.pushShadow(N))}),p.setupLights();let U=new Set;return x.traverse(function(N){if(!(N.isMesh||N.isPoints||N.isLine||N.isSprite))return;let J=N.material;if(J)if(Array.isArray(J))for(let le=0;le<J.length;le++){let _e=J[le];gt(_e,F,N),U.add(_e)}else gt(J,F,N),U.add(J)}),p=M.pop(),U},this.compileAsync=function(x,L,F=null){let U=this.compile(x,L,F);return new Promise(N=>{function J(){if(U.forEach(function(le){ge.get(le).currentProgram.isReady()&&U.delete(le)}),U.size===0){N(x);return}setTimeout(J,10)}Ie.get("KHR_parallel_shader_compile")!==null?J():setTimeout(J,10)})};let ot=null;function ci(x){ot&&ot(x)}function Zn(){or.stop()}function kd(){or.start()}let or=new ap;or.setAnimationLoop(ci),typeof self<"u"&&or.setContext(self),this.setAnimationLoop=function(x){ot=x,ee.setAnimationLoop(x),x===null?or.stop():or.start()},ee.addEventListener("sessionstart",Zn),ee.addEventListener("sessionend",kd),this.render=function(x,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(T===!0)return;if(x.matrixWorldAutoUpdate===!0&&x.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),ee.enabled===!0&&ee.isPresenting===!0&&(ee.cameraAutoUpdate===!0&&ee.updateCamera(L),L=ee.getCamera()),x.isScene===!0&&x.onBeforeRender(y,x,L,D),p=Ee.get(x,M.length),p.init(L),M.push(p),ne.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),tt.setFromProjectionMatrix(ne,Gn,L.reversedDepth),se=this.localClippingEnabled,W=ie.init(this.clippingPlanes,se),m=G.get(x,b.length),m.init(),b.push(m),ee.enabled===!0&&ee.isPresenting===!0){let J=y.xr.getDepthSensingMesh();J!==null&&Pc(J,L,-1/0,y.sortObjects)}Pc(x,L,0,y.sortObjects),m.finish(),y.sortObjects===!0&&m.sort(te,ue),bt=ee.enabled===!1||ee.isPresenting===!1||ee.hasDepthSensing()===!1,bt&&be.addToRenderList(m,x),this.info.render.frame++,W===!0&&ie.beginShadows();let F=p.state.shadowsArray;xe.render(F,x,L),W===!0&&ie.endShadows(),this.info.autoReset===!0&&this.info.reset();let U=m.opaque,N=m.transmissive;if(p.setupLights(),L.isArrayCamera){let J=L.cameras;if(N.length>0)for(let le=0,_e=J.length;le<_e;le++){let fe=J[le];Ud(U,N,x,fe)}bt&&be.render(x);for(let le=0,_e=J.length;le<_e;le++){let fe=J[le];Fd(m,x,fe,fe.viewport)}}else N.length>0&&Ud(U,N,x,L),bt&&be.render(x),Fd(m,x,L);D!==null&&A===0&&(Ye.updateMultisampleRenderTarget(D),Ye.updateRenderTargetMipmap(D)),x.isScene===!0&&x.onAfterRender(y,x,L),ae.resetDefaultState(),S=-1,E=null,M.pop(),M.length>0?(p=M[M.length-1],W===!0&&ie.setGlobalState(y.clippingPlanes,p.state.camera)):p=null,b.pop(),b.length>0?m=b[b.length-1]:m=null};function Pc(x,L,F,U){if(x.visible===!1)return;if(x.layers.test(L.layers)){if(x.isGroup)F=x.renderOrder;else if(x.isLOD)x.autoUpdate===!0&&x.update(L);else if(x.isLight)p.pushLight(x),x.castShadow&&p.pushShadow(x);else if(x.isSprite){if(!x.frustumCulled||tt.intersectsSprite(x)){U&&we.setFromMatrixPosition(x.matrixWorld).applyMatrix4(ne);let le=k.update(x),_e=x.material;_e.visible&&m.push(x,le,_e,F,we.z,null)}}else if((x.isMesh||x.isLine||x.isPoints)&&(!x.frustumCulled||tt.intersectsObject(x))){let le=k.update(x),_e=x.material;if(U&&(x.boundingSphere!==void 0?(x.boundingSphere===null&&x.computeBoundingSphere(),we.copy(x.boundingSphere.center)):(le.boundingSphere===null&&le.computeBoundingSphere(),we.copy(le.boundingSphere.center)),we.applyMatrix4(x.matrixWorld).applyMatrix4(ne)),Array.isArray(_e)){let fe=le.groups;for(let Le=0,Fe=fe.length;Le<Fe;Le++){let Te=fe[Le],Ke=_e[Te.materialIndex];Ke&&Ke.visible&&m.push(x,le,Ke,F,we.z,Te)}}else _e.visible&&m.push(x,le,_e,F,we.z,null)}}let J=x.children;for(let le=0,_e=J.length;le<_e;le++)Pc(J[le],L,F,U)}function Fd(x,L,F,U){let N=x.opaque,J=x.transmissive,le=x.transparent;p.setupLightsView(F),W===!0&&ie.setGlobalState(y.clippingPlanes,F),U&&Ce.viewport(R.copy(U)),N.length>0&&la(N,L,F),J.length>0&&la(J,L,F),le.length>0&&la(le,L,F),Ce.buffers.depth.setTest(!0),Ce.buffers.depth.setMask(!0),Ce.buffers.color.setMask(!0),Ce.setPolygonOffset(!1)}function Ud(x,L,F,U){if((F.isScene===!0?F.overrideMaterial:null)!==null)return;p.state.transmissionRenderTarget[U.id]===void 0&&(p.state.transmissionRenderTarget[U.id]=new un(1,1,{generateMipmaps:!0,type:Ie.has("EXT_color_buffer_half_float")||Ie.has("EXT_color_buffer_float")?Hs:an,minFilter:jn,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace}));let J=p.state.transmissionRenderTarget[U.id],le=U.viewport||R;J.setSize(le.z*y.transmissionResolutionScale,le.w*y.transmissionResolutionScale);let _e=y.getRenderTarget(),fe=y.getActiveCubeFace(),Le=y.getActiveMipmapLevel();y.setRenderTarget(J),y.getClearColor(z),j=y.getClearAlpha(),j<1&&y.setClearColor(16777215,.5),y.clear(),bt&&be.render(F);let Fe=y.toneMapping;y.toneMapping=Ai;let Te=U.viewport;if(U.viewport!==void 0&&(U.viewport=void 0),p.setupLightsView(U),W===!0&&ie.setGlobalState(y.clippingPlanes,U),la(x,F,U),Ye.updateMultisampleRenderTarget(J),Ye.updateRenderTargetMipmap(J),Ie.has("WEBGL_multisampled_render_to_texture")===!1){let Ke=!1;for(let ut=0,Et=L.length;ut<Et;ut++){let _t=L[ut],ht=_t.object,De=_t.geometry,Mt=_t.material,nt=_t.group;if(Mt.side===Vt&&ht.layers.test(U.layers)){let _n=Mt.side;Mt.side=jt,Mt.needsUpdate=!0,Bd(ht,F,U,De,Mt,nt),Mt.side=_n,Mt.needsUpdate=!0,Ke=!0}}Ke===!0&&(Ye.updateMultisampleRenderTarget(J),Ye.updateRenderTargetMipmap(J))}y.setRenderTarget(_e,fe,Le),y.setClearColor(z,j),Te!==void 0&&(U.viewport=Te),y.toneMapping=Fe}function la(x,L,F){let U=L.isScene===!0?L.overrideMaterial:null;for(let N=0,J=x.length;N<J;N++){let le=x[N],_e=le.object,fe=le.geometry,Le=le.group,Fe=le.material;Fe.allowOverride===!0&&U!==null&&(Fe=U),_e.layers.test(F.layers)&&Bd(_e,L,F,fe,Fe,Le)}}function Bd(x,L,F,U,N,J){x.onBeforeRender(y,L,F,U,N,J),x.modelViewMatrix.multiplyMatrices(F.matrixWorldInverse,x.matrixWorld),x.normalMatrix.getNormalMatrix(x.modelViewMatrix),N.onBeforeRender(y,L,F,U,x,J),N.transparent===!0&&N.side===Vt&&N.forceSinglePass===!1?(N.side=jt,N.needsUpdate=!0,y.renderBufferDirect(F,L,U,N,x,J),N.side=Mn,N.needsUpdate=!0,y.renderBufferDirect(F,L,U,N,x,J),N.side=Vt):y.renderBufferDirect(F,L,U,N,x,J),x.onAfterRender(y,L,F,U,N,J)}function ca(x,L,F){L.isScene!==!0&&(L=Oe);let U=ge.get(x),N=p.state.lights,J=p.state.shadowsArray,le=N.state.version,_e=X.getParameters(x,N.state,J,L,F),fe=X.getProgramCacheKey(_e),Le=U.programs;U.environment=x.isMeshStandardMaterial?L.environment:null,U.fog=L.fog,U.envMap=(x.isMeshStandardMaterial?At:Ut).get(x.envMap||U.environment),U.envMapRotation=U.environment!==null&&x.envMap===null?L.environmentRotation:x.envMapRotation,Le===void 0&&(x.addEventListener("dispose",q),Le=new Map,U.programs=Le);let Fe=Le.get(fe);if(Fe!==void 0){if(U.currentProgram===Fe&&U.lightsStateVersion===le)return zd(x,_e),Fe}else _e.uniforms=X.getUniforms(x),x.onBeforeCompile(_e,y),Fe=X.acquireProgram(_e,fe),Le.set(fe,Fe),U.uniforms=_e.uniforms;let Te=U.uniforms;return(!x.isShaderMaterial&&!x.isRawShaderMaterial||x.clipping===!0)&&(Te.clippingPlanes=ie.uniform),zd(x,_e),U.needsLights=Vp(x),U.lightsStateVersion=le,U.needsLights&&(Te.ambientLightColor.value=N.state.ambient,Te.lightProbe.value=N.state.probe,Te.directionalLights.value=N.state.directional,Te.directionalLightShadows.value=N.state.directionalShadow,Te.spotLights.value=N.state.spot,Te.spotLightShadows.value=N.state.spotShadow,Te.rectAreaLights.value=N.state.rectArea,Te.ltc_1.value=N.state.rectAreaLTC1,Te.ltc_2.value=N.state.rectAreaLTC2,Te.pointLights.value=N.state.point,Te.pointLightShadows.value=N.state.pointShadow,Te.hemisphereLights.value=N.state.hemi,Te.directionalShadowMap.value=N.state.directionalShadowMap,Te.directionalShadowMatrix.value=N.state.directionalShadowMatrix,Te.spotShadowMap.value=N.state.spotShadowMap,Te.spotLightMatrix.value=N.state.spotLightMatrix,Te.spotLightMap.value=N.state.spotLightMap,Te.pointShadowMap.value=N.state.pointShadowMap,Te.pointShadowMatrix.value=N.state.pointShadowMatrix),U.currentProgram=Fe,U.uniformsList=null,Fe}function Hd(x){if(x.uniformsList===null){let L=x.currentProgram.getUniforms();x.uniformsList=Ys.seqWithValue(L.seq,x.uniforms)}return x.uniformsList}function zd(x,L){let F=ge.get(x);F.outputColorSpace=L.outputColorSpace,F.batching=L.batching,F.batchingColor=L.batchingColor,F.instancing=L.instancing,F.instancingColor=L.instancingColor,F.instancingMorph=L.instancingMorph,F.skinning=L.skinning,F.morphTargets=L.morphTargets,F.morphNormals=L.morphNormals,F.morphColors=L.morphColors,F.morphTargetsCount=L.morphTargetsCount,F.numClippingPlanes=L.numClippingPlanes,F.numIntersection=L.numClipIntersection,F.vertexAlphas=L.vertexAlphas,F.vertexTangents=L.vertexTangents,F.toneMapping=L.toneMapping}function Hp(x,L,F,U,N){L.isScene!==!0&&(L=Oe),Ye.resetTextureUnits();let J=L.fog,le=U.isMeshStandardMaterial?L.environment:null,_e=D===null?y.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Lt,fe=(U.isMeshStandardMaterial?At:Ut).get(U.envMap||le),Le=U.vertexColors===!0&&!!F.attributes.color&&F.attributes.color.itemSize===4,Fe=!!F.attributes.tangent&&(!!U.normalMap||U.anisotropy>0),Te=!!F.morphAttributes.position,Ke=!!F.morphAttributes.normal,ut=!!F.morphAttributes.color,Et=Ai;U.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&(Et=y.toneMapping);let _t=F.morphAttributes.position||F.morphAttributes.normal||F.morphAttributes.color,ht=_t!==void 0?_t.length:0,De=ge.get(U),Mt=p.state.lights;if(W===!0&&(se===!0||x!==E)){let nn=x===E&&U.id===S;ie.setState(U,x,nn)}let nt=!1;U.version===De.__version?(De.needsLights&&De.lightsStateVersion!==Mt.state.version||De.outputColorSpace!==_e||N.isBatchedMesh&&De.batching===!1||!N.isBatchedMesh&&De.batching===!0||N.isBatchedMesh&&De.batchingColor===!0&&N.colorTexture===null||N.isBatchedMesh&&De.batchingColor===!1&&N.colorTexture!==null||N.isInstancedMesh&&De.instancing===!1||!N.isInstancedMesh&&De.instancing===!0||N.isSkinnedMesh&&De.skinning===!1||!N.isSkinnedMesh&&De.skinning===!0||N.isInstancedMesh&&De.instancingColor===!0&&N.instanceColor===null||N.isInstancedMesh&&De.instancingColor===!1&&N.instanceColor!==null||N.isInstancedMesh&&De.instancingMorph===!0&&N.morphTexture===null||N.isInstancedMesh&&De.instancingMorph===!1&&N.morphTexture!==null||De.envMap!==fe||U.fog===!0&&De.fog!==J||De.numClippingPlanes!==void 0&&(De.numClippingPlanes!==ie.numPlanes||De.numIntersection!==ie.numIntersection)||De.vertexAlphas!==Le||De.vertexTangents!==Fe||De.morphTargets!==Te||De.morphNormals!==Ke||De.morphColors!==ut||De.toneMapping!==Et||De.morphTargetsCount!==ht)&&(nt=!0):(nt=!0,De.__version=U.version);let _n=De.currentProgram;nt===!0&&(_n=ca(U,L,N));let ss=!1,vn=!1,ao=!1,St=_n.getUniforms(),En=De.uniforms;if(Ce.useProgram(_n.program)&&(ss=!0,vn=!0,ao=!0),U.id!==S&&(S=U.id,vn=!0),ss||E!==x){Ce.buffers.depth.getReversed()&&x.reversedDepth!==!0&&(x._reversedDepth=!0,x.updateProjectionMatrix()),St.setValue(I,"projectionMatrix",x.projectionMatrix),St.setValue(I,"viewMatrix",x.matrixWorldInverse);let cn=St.map.cameraPosition;cn!==void 0&&cn.setValue(I,Pe.setFromMatrixPosition(x.matrixWorld)),rt.logarithmicDepthBuffer&&St.setValue(I,"logDepthBufFC",2/(Math.log(x.far+1)/Math.LN2)),(U.isMeshPhongMaterial||U.isMeshToonMaterial||U.isMeshLambertMaterial||U.isMeshBasicMaterial||U.isMeshStandardMaterial||U.isShaderMaterial)&&St.setValue(I,"isOrthographic",x.isOrthographicCamera===!0),E!==x&&(E=x,vn=!0,ao=!0)}if(N.isSkinnedMesh){St.setOptional(I,N,"bindMatrix"),St.setOptional(I,N,"bindMatrixInverse");let nn=N.skeleton;nn&&(nn.boneTexture===null&&nn.computeBoneTexture(),St.setValue(I,"boneTexture",nn.boneTexture,Ye))}N.isBatchedMesh&&(St.setOptional(I,N,"batchingTexture"),St.setValue(I,"batchingTexture",N._matricesTexture,Ye),St.setOptional(I,N,"batchingIdTexture"),St.setValue(I,"batchingIdTexture",N._indirectTexture,Ye),St.setOptional(I,N,"batchingColorTexture"),N._colorsTexture!==null&&St.setValue(I,"batchingColorTexture",N._colorsTexture,Ye));let Cn=F.morphAttributes;if((Cn.position!==void 0||Cn.normal!==void 0||Cn.color!==void 0)&&Q.update(N,F,_n),(vn||De.receiveShadow!==N.receiveShadow)&&(De.receiveShadow=N.receiveShadow,St.setValue(I,"receiveShadow",N.receiveShadow)),U.isMeshGouraudMaterial&&U.envMap!==null&&(En.envMap.value=fe,En.flipEnvMap.value=fe.isCubeTexture&&fe.isRenderTargetTexture===!1?-1:1),U.isMeshStandardMaterial&&U.envMap===null&&L.environment!==null&&(En.envMapIntensity.value=L.environmentIntensity),vn&&(St.setValue(I,"toneMappingExposure",y.toneMappingExposure),De.needsLights&&zp(En,ao),J&&U.fog===!0&&$.refreshFogUniforms(En,J),$.refreshMaterialUniforms(En,U,H,Z,p.state.transmissionRenderTarget[x.id]),Ys.upload(I,Hd(De),En,Ye)),U.isShaderMaterial&&U.uniformsNeedUpdate===!0&&(Ys.upload(I,Hd(De),En,Ye),U.uniformsNeedUpdate=!1),U.isSpriteMaterial&&St.setValue(I,"center",N.center),St.setValue(I,"modelViewMatrix",N.modelViewMatrix),St.setValue(I,"normalMatrix",N.normalMatrix),St.setValue(I,"modelMatrix",N.matrixWorld),U.isShaderMaterial||U.isRawShaderMaterial){let nn=U.uniformsGroups;for(let cn=0,Ic=nn.length;cn<Ic;cn++){let ar=nn[cn];We.update(ar,_n),We.bind(ar,_n)}}return _n}function zp(x,L){x.ambientLightColor.needsUpdate=L,x.lightProbe.needsUpdate=L,x.directionalLights.needsUpdate=L,x.directionalLightShadows.needsUpdate=L,x.pointLights.needsUpdate=L,x.pointLightShadows.needsUpdate=L,x.spotLights.needsUpdate=L,x.spotLightShadows.needsUpdate=L,x.rectAreaLights.needsUpdate=L,x.hemisphereLights.needsUpdate=L}function Vp(x){return x.isMeshLambertMaterial||x.isMeshToonMaterial||x.isMeshPhongMaterial||x.isMeshStandardMaterial||x.isShadowMaterial||x.isShaderMaterial&&x.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return A},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(x,L,F){let U=ge.get(x);U.__autoAllocateDepthBuffer=x.resolveDepthBuffer===!1,U.__autoAllocateDepthBuffer===!1&&(U.__useRenderToTexture=!1),ge.get(x.texture).__webglTexture=L,ge.get(x.depthTexture).__webglTexture=U.__autoAllocateDepthBuffer?void 0:F,U.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(x,L){let F=ge.get(x);F.__webglFramebuffer=L,F.__useDefaultFramebuffer=L===void 0};let Gp=I.createFramebuffer();this.setRenderTarget=function(x,L=0,F=0){D=x,P=L,A=F;let U=!0,N=null,J=!1,le=!1;if(x){let fe=ge.get(x);if(fe.__useDefaultFramebuffer!==void 0)Ce.bindFramebuffer(I.FRAMEBUFFER,null),U=!1;else if(fe.__webglFramebuffer===void 0)Ye.setupRenderTarget(x);else if(fe.__hasExternalTextures)Ye.rebindTextures(x,ge.get(x.texture).__webglTexture,ge.get(x.depthTexture).__webglTexture);else if(x.depthBuffer){let Te=x.depthTexture;if(fe.__boundDepthTexture!==Te){if(Te!==null&&ge.has(Te)&&(x.width!==Te.image.width||x.height!==Te.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");Ye.setupDepthRenderbuffer(x)}}let Le=x.texture;(Le.isData3DTexture||Le.isDataArrayTexture||Le.isCompressedArrayTexture)&&(le=!0);let Fe=ge.get(x).__webglFramebuffer;x.isWebGLCubeRenderTarget?(Array.isArray(Fe[L])?N=Fe[L][F]:N=Fe[L],J=!0):x.samples>0&&Ye.useMultisampledRTT(x)===!1?N=ge.get(x).__webglMultisampledFramebuffer:Array.isArray(Fe)?N=Fe[F]:N=Fe,R.copy(x.viewport),V.copy(x.scissor),B=x.scissorTest}else R.copy(ye).multiplyScalar(H).floor(),V.copy(He).multiplyScalar(H).floor(),B=at;if(F!==0&&(N=Gp),Ce.bindFramebuffer(I.FRAMEBUFFER,N)&&U&&Ce.drawBuffers(x,N),Ce.viewport(R),Ce.scissor(V),Ce.setScissorTest(B),J){let fe=ge.get(x.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+L,fe.__webglTexture,F)}else if(le){let fe=L;for(let Le=0;Le<x.textures.length;Le++){let Fe=ge.get(x.textures[Le]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Le,Fe.__webglTexture,F,fe)}}else if(x!==null&&F!==0){let fe=ge.get(x.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,fe.__webglTexture,F)}S=-1},this.readRenderTargetPixels=function(x,L,F,U,N,J,le,_e=0){if(!(x&&x.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let fe=ge.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&le!==void 0&&(fe=fe[le]),fe){Ce.bindFramebuffer(I.FRAMEBUFFER,fe);try{let Le=x.textures[_e],Fe=Le.format,Te=Le.type;if(!rt.textureFormatReadable(Fe)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!rt.textureTypeReadable(Te)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=x.width-U&&F>=0&&F<=x.height-N&&(x.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+_e),I.readPixels(L,F,U,N,Me.convert(Fe),Me.convert(Te),J))}finally{let Le=D!==null?ge.get(D).__webglFramebuffer:null;Ce.bindFramebuffer(I.FRAMEBUFFER,Le)}}},this.readRenderTargetPixelsAsync=function(x,L,F,U,N,J,le,_e=0){return rn(this,null,function*(){if(!(x&&x.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let fe=ge.get(x).__webglFramebuffer;if(x.isWebGLCubeRenderTarget&&le!==void 0&&(fe=fe[le]),fe)if(L>=0&&L<=x.width-U&&F>=0&&F<=x.height-N){Ce.bindFramebuffer(I.FRAMEBUFFER,fe);let Le=x.textures[_e],Fe=Le.format,Te=Le.type;if(!rt.textureFormatReadable(Fe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!rt.textureTypeReadable(Te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let Ke=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Ke),I.bufferData(I.PIXEL_PACK_BUFFER,J.byteLength,I.STREAM_READ),x.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+_e),I.readPixels(L,F,U,N,Me.convert(Fe),Me.convert(Te),0);let ut=D!==null?ge.get(D).__webglFramebuffer:null;Ce.bindFramebuffer(I.FRAMEBUFFER,ut);let Et=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),yield Of(I,Et,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Ke),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,J),I.deleteBuffer(Ke),I.deleteSync(Et),J}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")})},this.copyFramebufferToTexture=function(x,L=null,F=0){let U=Math.pow(2,-F),N=Math.floor(x.image.width*U),J=Math.floor(x.image.height*U),le=L!==null?L.x:0,_e=L!==null?L.y:0;Ye.setTexture2D(x,0),I.copyTexSubImage2D(I.TEXTURE_2D,F,0,0,le,_e,N,J),Ce.unbindTexture()};let Wp=I.createFramebuffer(),Xp=I.createFramebuffer();this.copyTextureToTexture=function(x,L,F=null,U=null,N=0,J=null){J===null&&(N!==0?(xr("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),J=N,N=0):J=0);let le,_e,fe,Le,Fe,Te,Ke,ut,Et,_t=x.isCompressedTexture?x.mipmaps[J]:x.image;if(F!==null)le=F.max.x-F.min.x,_e=F.max.y-F.min.y,fe=F.isBox3?F.max.z-F.min.z:1,Le=F.min.x,Fe=F.min.y,Te=F.isBox3?F.min.z:0;else{let Cn=Math.pow(2,-N);le=Math.floor(_t.width*Cn),_e=Math.floor(_t.height*Cn),x.isDataArrayTexture?fe=_t.depth:x.isData3DTexture?fe=Math.floor(_t.depth*Cn):fe=1,Le=0,Fe=0,Te=0}U!==null?(Ke=U.x,ut=U.y,Et=U.z):(Ke=0,ut=0,Et=0);let ht=Me.convert(L.format),De=Me.convert(L.type),Mt;L.isData3DTexture?(Ye.setTexture3D(L,0),Mt=I.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(Ye.setTexture2DArray(L,0),Mt=I.TEXTURE_2D_ARRAY):(Ye.setTexture2D(L,0),Mt=I.TEXTURE_2D),I.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,L.flipY),I.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),I.pixelStorei(I.UNPACK_ALIGNMENT,L.unpackAlignment);let nt=I.getParameter(I.UNPACK_ROW_LENGTH),_n=I.getParameter(I.UNPACK_IMAGE_HEIGHT),ss=I.getParameter(I.UNPACK_SKIP_PIXELS),vn=I.getParameter(I.UNPACK_SKIP_ROWS),ao=I.getParameter(I.UNPACK_SKIP_IMAGES);I.pixelStorei(I.UNPACK_ROW_LENGTH,_t.width),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,_t.height),I.pixelStorei(I.UNPACK_SKIP_PIXELS,Le),I.pixelStorei(I.UNPACK_SKIP_ROWS,Fe),I.pixelStorei(I.UNPACK_SKIP_IMAGES,Te);let St=x.isDataArrayTexture||x.isData3DTexture,En=L.isDataArrayTexture||L.isData3DTexture;if(x.isDepthTexture){let Cn=ge.get(x),nn=ge.get(L),cn=ge.get(Cn.__renderTarget),Ic=ge.get(nn.__renderTarget);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,cn.__webglFramebuffer),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,Ic.__webglFramebuffer);for(let ar=0;ar<fe;ar++)St&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ge.get(x).__webglTexture,N,Te+ar),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,ge.get(L).__webglTexture,J,Et+ar)),I.blitFramebuffer(Le,Fe,le,_e,Ke,ut,le,_e,I.DEPTH_BUFFER_BIT,I.NEAREST);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(N!==0||x.isRenderTargetTexture||ge.has(x)){let Cn=ge.get(x),nn=ge.get(L);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,Wp),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,Xp);for(let cn=0;cn<fe;cn++)St?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Cn.__webglTexture,N,Te+cn):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Cn.__webglTexture,N),En?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,nn.__webglTexture,J,Et+cn):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,nn.__webglTexture,J),N!==0?I.blitFramebuffer(Le,Fe,le,_e,Ke,ut,le,_e,I.COLOR_BUFFER_BIT,I.NEAREST):En?I.copyTexSubImage3D(Mt,J,Ke,ut,Et+cn,Le,Fe,le,_e):I.copyTexSubImage2D(Mt,J,Ke,ut,Le,Fe,le,_e);Ce.bindFramebuffer(I.READ_FRAMEBUFFER,null),Ce.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else En?x.isDataTexture||x.isData3DTexture?I.texSubImage3D(Mt,J,Ke,ut,Et,le,_e,fe,ht,De,_t.data):L.isCompressedArrayTexture?I.compressedTexSubImage3D(Mt,J,Ke,ut,Et,le,_e,fe,ht,_t.data):I.texSubImage3D(Mt,J,Ke,ut,Et,le,_e,fe,ht,De,_t):x.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,J,Ke,ut,le,_e,ht,De,_t.data):x.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,J,Ke,ut,_t.width,_t.height,ht,_t.data):I.texSubImage2D(I.TEXTURE_2D,J,Ke,ut,le,_e,ht,De,_t);I.pixelStorei(I.UNPACK_ROW_LENGTH,nt),I.pixelStorei(I.UNPACK_IMAGE_HEIGHT,_n),I.pixelStorei(I.UNPACK_SKIP_PIXELS,ss),I.pixelStorei(I.UNPACK_SKIP_ROWS,vn),I.pixelStorei(I.UNPACK_SKIP_IMAGES,ao),J===0&&L.generateMipmaps&&I.generateMipmap(Mt),Ce.unbindTexture()},this.copyTextureToTexture3D=function(x,L,F=null,U=null,N=0){return xr('WebGLRenderer: copyTextureToTexture3D function has been deprecated. Use "copyTextureToTexture" instead.'),this.copyTextureToTexture(x,L,F,U,N)},this.initRenderTarget=function(x){ge.get(x).__webglFramebuffer===void 0&&Ye.setupRenderTarget(x)},this.initTexture=function(x){x.isCubeTexture?Ye.setTextureCube(x,0):x.isData3DTexture?Ye.setTexture3D(x,0):x.isDataArrayTexture||x.isCompressedArrayTexture?Ye.setTexture2DArray(x,0):Ye.setTexture2D(x,0),Ce.unbindTexture()},this.resetState=function(){P=0,A=0,D=null,Ce.reset(),ae.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Gn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;let t=this.getContext();t.drawingBufferColorSpace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}};var Ii={sceneSettings:{camera:{position:{x:-1.2,y:-7.7,z:0},lookAt:{x:1,y:0,z:0},lockControls:!0},lighting:{ambient:{intensity:.7},main:{intensity:1.2,position:{x:8,y:-10,z:-7}},fill:{intensity:.6,position:{x:7,y:-13,z:-3}},back:{intensity:.5,position:{x:-3,y:4,z:2.5}}},renderer:{exposure:1.2},orbitControls:{minPolarAngle:0,maxPolarAngle:3.14159,minDistance:5,maxDistance:20,dampingFactor:.05,enableDamping:!0,enableZoom:!0,enablePan:!0},ground:{y:0,opacity:.3,size:20},videoPlane:{position:{x:-.75,y:-6.5,z:.8},rotation:{x:1.5708,y:-.27,z:1.57},size:{width:.9,height:1.05},color:"#e9dcd2",opacity:1,rightCrop:0},backgroundPlane:{position:{x:.7,y:-1.4,z:0},rotation:{x:-1.5708,y:.23,z:1.57},size:{width:15.25,height:7.7},colors:{gold:"#ffd700",darkGold:"#d49b00",orange:"#ff8000",brown:"#996633"}}},videoPaths:["assets/3d/CD_Case/twitter_crossfade.mp4","assets/3d/CD_Case/twitter_crossfade2.mp4","assets/3d/CD_Case/twitter_crossfade3.mp4","assets/3d/CD_Case/twitter_crossfade4.mp4","assets/3d/CD_Case/twitter_crossfade5.mp4"],caseSettings:{basePosition:{x:2,y:-5.2,z:-3.5},baseRotation:{x:3.14,y:0,z:1.57},stackOffset:.3,materials:{cd:[{name:"Material.001",metalness:.9,roughness:.1,envMapIntensity:2,clearcoat:1,clearcoatRoughness:.1},{name:"Material.002",metalness:.8,roughness:.2,envMapIntensity:2,clearcoat:.5,clearcoatRoughness:.2}]}},silhouette:{size:{scale:1,widthScale:.98,heightScale:.8,depthScale:.98},appearance:{color:"#FFD700",intensity:1,opacity:.9},position:{offsetX:-.77,offsetY:0,offsetZ:1.25},rotation:{offsetX:0,offsetY:0,offsetZ:-1.59},animation:{fastPulseSpeed:5,slowPulseSpeed:2,fastPulseAmount:.3,slowPulseAmount:.4}},videoPlane2Position:{offsetX:-.04,offsetY:.75,offsetZ:-.37},videoPlane2Rotation:{offsetX:-.01,offsetY:-1.57,offsetZ:-.012},videoPlane2Size:{width:4.5,height:2.5,cornerRadius:.05,rightCrop:0,visible:!1},menuAnimation:{duration:.5,bezierCurve:{p1:.25,p2:.1,p3:.25,p4:1}},finalCasePosition:{offsetX:-1.08,offsetY:0,offsetZ:2.5,rotationX:0,rotationY:-.02,rotationZ:0},consecutiveCaseExtraY:-.3,finalCaseRotation:{offsetX:3.14,offsetY:0,offsetZ:0},cdCases:[]};var kr=class kr{constructor(){this.clock=new on;this.ANIMATION_DURATION=1;this.ANIMATION_BUFFER=100;this.MOVEMENTS={OPEN_LID:"Open Lid.001",CLOSE_LID:"Close Lid"};this.ANIMATION_CONFIG={duration:1,easing:e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2};this.animationQueues=new Map;this.activeAnimations=new Map;this.animationListeners=new Map;this.currentActions=new Map;this.targetStates=new Map;this.animationLocks=new Map;this.animationTimers=new Map}setupAnimation(e){if(!e.mixer||!e.animations){console.warn("\u{1F527} [Setup] No mixer or animations available for case:",e.id);return}console.log(`\u{1F527} [Setup] Initializing animations for case ${e.id}`),this.animationQueues.set(e.id,[]),this.activeAnimations.set(e.id,!1),this.currentActions.set(e.id,void 0),this.targetStates.set(e.id,!1),this.animationLocks.set(e.id,!1);let t=e.animations.find(i=>i.name===this.MOVEMENTS.OPEN_LID),n=e.animations.find(i=>i.name===this.MOVEMENTS.CLOSE_LID);if(t&&n){console.log(`\u{1F527} [Setup] Found animations for case ${e.id}:`,{openAnim:t.name,closeAnim:n.name}),e.openAction=e.mixer.clipAction(t),e.closeAction=e.mixer.clipAction(n),[e.openAction,e.closeAction].forEach(r=>{r&&(r.setLoop(er,1),r.clampWhenFinished=!0,r.enabled=!0)}),e.closeAction&&(e.closeAction.play().setEffectiveTimeScale(1).setEffectiveWeight(1),e.closeAction.paused=!0,e.closeAction.time=n.duration,e.mixer.update(0),e.isOpen=!1);let i=()=>this.onAnimationComplete(e);this.animationListeners.set(e.id,i)}}queueAnimation(e,t,n){let i=t==="open";if(console.group(`%c \u{1F3AC} [ANIM-QUEUE] Case ${e.id}`,"background: #2196F3; color: white; padding: 2px 5px; border-radius: 3px;"),console.log("Request:",{type:t,currentlyOpen:e.isOpen,isLocked:this.animationLocks.get(e.id),isAnimating:this.isAnimating(e),queueLength:(this.animationQueues.get(e.id)||[]).length,hasActiveAction:!!this.currentActions.get(e.id)}),this.animationLocks.get(e.id)||this.isAnimating(e)){let o=this.animationQueues.get(e.id)||[];o.push({type:t,onComplete:n}),this.animationQueues.set(e.id,o),this.targetStates.set(e.id,i),console.log(`%c \u23F3 [ANIM-QUEUE] Case ${e.id} is busy, queued ${t}`,"background: #FFA000; color: white; padding: 2px 5px; border-radius: 3px;"),console.groupEnd();return}if(i&&e.isOpen||!i&&!e.isOpen){console.log(`%c \u2705 [ANIM-SKIP] Case ${e.id} already in ${t} state`,"background: #4CAF50; color: white; padding: 2px 5px; border-radius: 3px;"),n?.(),console.groupEnd();return}let r=[{type:t,onComplete:n}];this.animationQueues.set(e.id,r),this.targetStates.set(e.id,i),console.log(`%c \u{1F4CB} [ANIM-QUEUE] Starting new animation queue for case ${e.id}`,"background: #2196F3; color: white; padding: 2px 5px; border-radius: 3px;"),console.groupEnd(),this.animationLocks.set(e.id,!0),requestAnimationFrame(()=>{this.processNextAnimation(e)})}processNextAnimation(e){console.group(`%c \u2699\uFE0F [ANIM-PROCESS] Case ${e.id}`,"background: #673AB7; color: white; padding: 2px 5px; border-radius: 3px;");let t=this.animationTimers.get(e.id);if(t&&Date.now()-t.startTime<t.duration+this.ANIMATION_BUFFER){setTimeout(()=>this.processNextAnimation(e),this.ANIMATION_BUFFER),console.groupEnd();return}this.animationLocks.set(e.id,!0);let n=this.animationQueues.get(e.id)||[];if(n.length===0){this.animationLocks.set(e.id,!1),this.animationTimers.delete(e.id),console.groupEnd();return}let i=n[0],r=i.type==="open"?e.openAction:e.closeAction;if(!r){console.warn(`No ${i.type} action available for case:`,e.id),this.onAnimationComplete(e),console.groupEnd();return}try{e.mixer&&e.mixer.stopAllAction(),r.reset(),r.setLoop(er,1),r.clampWhenFinished=!0,r.enabled=!0,this.animationTimers.set(e.id,{startTime:Date.now(),duration:r.getClip().duration*1e3,type:i.type}),this.activeAnimations.set(e.id,!0),this.currentActions.set(e.id,r);let o=this.animationListeners.get(e.id);o&&r.getMixer().addEventListener("finished",o),r.play(),console.log(`%c \u25B6\uFE0F [ANIM-START] Playing ${i.type} animation for case ${e.id}`,"background: #E91E63; color: white; padding: 2px 5px; border-radius: 3px;")}catch(o){console.error(`Error playing animation for case ${e.id}:`,o),this.cleanupAnimation(e)}console.groupEnd()}stopExistingAnimations(e){e.mixer&&e.mixer.stopAllAction(),this.cleanupListeners(e)}onAnimationComplete(e){console.group(`%c \u2728 [ANIM-COMPLETE] Case ${e.id}`,"background: #009688; color: white; padding: 2px 5px; border-radius: 3px;");let t=this.animationQueues.get(e.id)||[],n=t.shift();this.animationQueues.set(e.id,t);let i=this.animationTimers.get(e.id);if(i){let r=Date.now()-i.startTime;console.log("Animation timing:",{type:i.type,duration:i.duration,elapsed:r,difference:r-i.duration})}if(n&&(n.type==="open"?(e.isOpen=!0,console.log(`%c \u{1F4C2} [ANIM-STATE] Case ${e.id} marked as open`,"background: #4CAF50; color: white; padding: 2px 5px; border-radius: 3px;")):n.type==="close"&&(e.isOpen=!1,console.log(`%c \u{1F4C1} [ANIM-STATE] Case ${e.id} marked as closed`,"background: #F44336; color: white; padding: 2px 5px; border-radius: 3px;")),n.onComplete?.()),this.cleanupAnimation(e),t.length>0)console.log(`%c \u{1F504} [ANIM-NEXT] Processing next animation in queue for case ${e.id} after buffer`,"background: #2196F3; color: white; padding: 2px 5px; border-radius: 3px;"),setTimeout(()=>{this.processNextAnimation(e)},this.ANIMATION_BUFFER);else{let r=this.targetStates.get(e.id);r!==void 0&&r!==e.isOpen?(console.log(`%c \u{1F504} [ANIM-NEXT] Queueing animation to reach target state for case ${e.id}`,"background: #2196F3; color: white; padding: 2px 5px; border-radius: 3px;",{currentState:e.isOpen,targetState:r}),setTimeout(()=>{this.queueAnimation(e,r?"open":"close")},this.ANIMATION_BUFFER)):(this.animationLocks.set(e.id,!1),this.animationTimers.delete(e.id))}console.groupEnd()}cleanupAnimation(e){console.group(`%c \u{1F9F9} [ANIM-CLEANUP] Case ${e.id}`,"background: #795548; color: white; padding: 2px 5px; border-radius: 3px;");let t=this.currentActions.get(e.id);t&&this.cleanupListeners(e),this.currentActions.set(e.id,void 0),this.activeAnimations.set(e.id,!1),console.log("Cleanup complete:",{currentAction:t?.getClip().name,wasAnimating:this.isAnimating(e),wasLocked:this.animationLocks.get(e.id),remainingInQueue:(this.animationQueues.get(e.id)||[]).length,timer:this.animationTimers.get(e.id)}),console.groupEnd()}updateAnimations(e){let t=this.clock.getDelta();e.forEach(n=>{n.mixer&&this.isAnimating(n)&&(n.mixer.update(t),Math.random()<.02&&console.log(`%c \u23F1\uFE0F [ANIM-UPDATE] Case ${n.id}`,"background: #607D8B; color: white; padding: 2px 5px; border-radius: 3px;",{delta:t,currentAction:this.currentActions.get(n.id)?.getClip().name,progress:this.currentActions.get(n.id)?.time||0}))})}clearQueue(e){this.animationLocks.get(e.id)||(this.animationQueues.set(e.id,[]),this.targetStates.set(e.id,e.isOpen))}isAnimating(e){return this.activeAnimations.get(e.id)||!1}cleanupListeners(e){let t=this.currentActions.get(e.id),n=this.animationListeners.get(e.id);t&&n&&(console.log(`\u{1F3A7} [Cleanup] Removing animation listener for case ${e.id}`,{actionName:t.getClip().name}),t.getMixer().removeEventListener("finished",n))}hasAnyActiveAnimations(e){return e.some(t=>this.isAnimating(t))}openCase(e){e.isOpen||(console.log("Opening CD case:",e.id),this.queueAnimation(e,"open"))}};kr.\u0275fac=function(t){return new(t||kr)},kr.\u0275prov=ze({token:kr,factory:kr.\u0275fac,providedIn:"root"});var mn=kr;var Fr=class Fr{createGlowEffect(e){return new Ot({color:65280,transparent:!0,opacity:.5,blending:Tr})}updateGlowEffect(e){e.glowMaterial||(e.glowMaterial=this.createGlowEffect(e.model)),e.model.traverse(t=>{t instanceof Ue&&t.name==="CD"&&(e.isOpen?(t.userData.originalMaterials||(t.userData.originalMaterials=Array.isArray(t.material)?t.material.map(n=>n.clone()):[t.material.clone()]),t.material=e.glowMaterial):t.userData.originalMaterials&&(t.material=t.userData.originalMaterials))})}};Fr.\u0275fac=function(t){return new(t||Fr)},Fr.\u0275prov=ze({token:Fr,factory:Fr.\u0275fac,providedIn:"root"});var ac=Fr;function td(s,e){if(e===Pu)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),s;if(e===Gs||e===ta){let t=s.getIndex();if(t===null){let o=[],l=s.getAttribute("position");if(l!==void 0){for(let u=0;u<l.count;u++)o.push(u);s.setIndex(o),t=s.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),s}let n=t.count-2,i=[];if(e===Gs)for(let o=1;o<=n;o++)i.push(t.getX(0)),i.push(t.getX(o)),i.push(t.getX(o+1));else for(let o=0;o<n;o++)o%2===0?(i.push(t.getX(o)),i.push(t.getX(o+1)),i.push(t.getX(o+2))):(i.push(t.getX(o+2)),i.push(t.getX(o+1)),i.push(t.getX(o)));i.length/3!==n&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let r=s.clone();return r.setIndex(i),r.clearGroups(),r}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",e),s}var lc=class extends Pi{constructor(e){super(e),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(t){return new ld(t)}),this.register(function(t){return new cd(t)}),this.register(function(t){return new vd(t)}),this.register(function(t){return new yd(t)}),this.register(function(t){return new xd(t)}),this.register(function(t){return new dd(t)}),this.register(function(t){return new hd(t)}),this.register(function(t){return new fd(t)}),this.register(function(t){return new pd(t)}),this.register(function(t){return new ad(t)}),this.register(function(t){return new md(t)}),this.register(function(t){return new ud(t)}),this.register(function(t){return new _d(t)}),this.register(function(t){return new gd(t)}),this.register(function(t){return new sd(t)}),this.register(function(t){return new bd(t)}),this.register(function(t){return new Md(t)})}load(e,t,n,i){let r=this,o;if(this.resourcePath!=="")o=this.resourcePath;else if(this.path!==""){let d=wi.extractUrlBase(e);o=wi.resolveURL(d,this.path)}else o=wi.extractUrlBase(e);this.manager.itemStart(e);let l=function(d){i?i(d):console.error(d),r.manager.itemError(e),r.manager.itemEnd(e)},u=new Ei(this.manager);u.setPath(this.path),u.setResponseType("arraybuffer"),u.setRequestHeader(this.requestHeader),u.setWithCredentials(this.withCredentials),u.load(e,function(d){try{r.parse(d,o,function(a){t(a),r.manager.itemEnd(e)},l)}catch(a){l(a)}},n,l)}setDRACOLoader(e){return this.dracoLoader=e,this}setKTX2Loader(e){return this.ktx2Loader=e,this}setMeshoptDecoder(e){return this.meshoptDecoder=e,this}register(e){return this.pluginCallbacks.indexOf(e)===-1&&this.pluginCallbacks.push(e),this}unregister(e){return this.pluginCallbacks.indexOf(e)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(e),1),this}parse(e,t,n,i){let r,o={},l={},u=new TextDecoder;if(typeof e=="string")r=JSON.parse(e);else if(e instanceof ArrayBuffer)if(u.decode(new Uint8Array(e,0,4))===gp){try{o[$e.KHR_BINARY_GLTF]=new Sd(e)}catch(c){i&&i(c);return}r=JSON.parse(o[$e.KHR_BINARY_GLTF].content)}else r=JSON.parse(u.decode(e));else r=e;if(r.asset===void 0||r.asset.version[0]<2){i&&i(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let d=new Pd(r,{path:t||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});d.fileLoader.setRequestHeader(this.requestHeader);for(let a=0;a<this.pluginCallbacks.length;a++){let c=this.pluginCallbacks[a](d);c.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),l[c.name]=c,o[c.name]=!0}if(r.extensionsUsed)for(let a=0;a<r.extensionsUsed.length;++a){let c=r.extensionsUsed[a],h=r.extensionsRequired||[];switch(c){case $e.KHR_MATERIALS_UNLIT:o[c]=new od;break;case $e.KHR_DRACO_MESH_COMPRESSION:o[c]=new Ed(r,this.dracoLoader);break;case $e.KHR_TEXTURE_TRANSFORM:o[c]=new Cd;break;case $e.KHR_MESH_QUANTIZATION:o[c]=new wd;break;default:h.indexOf(c)>=0&&l[c]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+c+'".')}}d.setExtensions(o),d.setPlugins(l),d.parse(n,i)}parseAsync(e,t){let n=this;return new Promise(function(i,r){n.parse(e,t,i,r)})}};function Cy(){let s={};return{get:function(e){return s[e]},add:function(e,t){s[e]=t},remove:function(e){delete s[e]},removeAll:function(){s={}}}}var $e={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},sd=class{constructor(e){this.parser=e,this.name=$e.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let e=this.parser,t=this.parser.json.nodes||[];for(let n=0,i=t.length;n<i;n++){let r=t[n];r.extensions&&r.extensions[this.name]&&r.extensions[this.name].light!==void 0&&e._addNodeRef(this.cache,r.extensions[this.name].light)}}_loadLight(e){let t=this.parser,n="light:"+e,i=t.cache.get(n);if(i)return i;let r=t.json,u=((r.extensions&&r.extensions[this.name]||{}).lights||[])[e],d,a=new de(16777215);u.color!==void 0&&a.setRGB(u.color[0],u.color[1],u.color[2],Lt);let c=u.range!==void 0?u.range:0;switch(u.type){case"directional":d=new Ci(a),d.target.position.set(0,0,-1),d.add(d.target);break;case"point":d=new Vo(a),d.distance=c;break;case"spot":d=new zo(a),d.distance=c,u.spot=u.spot||{},u.spot.innerConeAngle=u.spot.innerConeAngle!==void 0?u.spot.innerConeAngle:0,u.spot.outerConeAngle=u.spot.outerConeAngle!==void 0?u.spot.outerConeAngle:Math.PI/4,d.angle=u.spot.outerConeAngle,d.penumbra=1-u.spot.innerConeAngle/u.spot.outerConeAngle,d.target.position.set(0,0,-1),d.add(d.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+u.type)}return d.position.set(0,0,0),Di(d,u),u.intensity!==void 0&&(d.intensity=u.intensity),d.name=t.createUniqueName(u.name||"light_"+e),i=Promise.resolve(d),t.cache.add(n,i),i}getDependency(e,t){if(e==="light")return this._loadLight(t)}createNodeAttachment(e){let t=this,n=this.parser,r=n.json.nodes[e],l=(r.extensions&&r.extensions[this.name]||{}).light;return l===void 0?null:this._loadLight(l).then(function(u){return n._getNodeRef(t.cache,l,u)})}},od=class{constructor(){this.name=$e.KHR_MATERIALS_UNLIT}getMaterialType(){return Ot}extendParams(e,t,n){let i=[];e.color=new de(1,1,1),e.opacity=1;let r=t.pbrMetallicRoughness;if(r){if(Array.isArray(r.baseColorFactor)){let o=r.baseColorFactor;e.color.setRGB(o[0],o[1],o[2],Lt),e.opacity=o[3]}r.baseColorTexture!==void 0&&i.push(n.assignTexture(e,"map",r.baseColorTexture,Je))}return Promise.all(i)}},ad=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name].emissiveStrength;return r!==void 0&&(t.emissiveIntensity=r),Promise.resolve()}},ld=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_CLEARCOAT}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];if(o.clearcoatFactor!==void 0&&(t.clearcoat=o.clearcoatFactor),o.clearcoatTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatMap",o.clearcoatTexture)),o.clearcoatRoughnessFactor!==void 0&&(t.clearcoatRoughness=o.clearcoatRoughnessFactor),o.clearcoatRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"clearcoatRoughnessMap",o.clearcoatRoughnessTexture)),o.clearcoatNormalTexture!==void 0&&(r.push(n.assignTexture(t,"clearcoatNormalMap",o.clearcoatNormalTexture)),o.clearcoatNormalTexture.scale!==void 0)){let l=o.clearcoatNormalTexture.scale;t.clearcoatNormalScale=new Se(l,l)}return Promise.all(r)}},cd=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_DISPERSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return t.dispersion=r.dispersion!==void 0?r.dispersion:0,Promise.resolve()}},ud=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_IRIDESCENCE}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.iridescenceFactor!==void 0&&(t.iridescence=o.iridescenceFactor),o.iridescenceTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceMap",o.iridescenceTexture)),o.iridescenceIor!==void 0&&(t.iridescenceIOR=o.iridescenceIor),t.iridescenceThicknessRange===void 0&&(t.iridescenceThicknessRange=[100,400]),o.iridescenceThicknessMinimum!==void 0&&(t.iridescenceThicknessRange[0]=o.iridescenceThicknessMinimum),o.iridescenceThicknessMaximum!==void 0&&(t.iridescenceThicknessRange[1]=o.iridescenceThicknessMaximum),o.iridescenceThicknessTexture!==void 0&&r.push(n.assignTexture(t,"iridescenceThicknessMap",o.iridescenceThicknessTexture)),Promise.all(r)}},dd=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_SHEEN}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[];t.sheenColor=new de(0,0,0),t.sheenRoughness=0,t.sheen=1;let o=i.extensions[this.name];if(o.sheenColorFactor!==void 0){let l=o.sheenColorFactor;t.sheenColor.setRGB(l[0],l[1],l[2],Lt)}return o.sheenRoughnessFactor!==void 0&&(t.sheenRoughness=o.sheenRoughnessFactor),o.sheenColorTexture!==void 0&&r.push(n.assignTexture(t,"sheenColorMap",o.sheenColorTexture,Je)),o.sheenRoughnessTexture!==void 0&&r.push(n.assignTexture(t,"sheenRoughnessMap",o.sheenRoughnessTexture)),Promise.all(r)}},hd=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_TRANSMISSION}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.transmissionFactor!==void 0&&(t.transmission=o.transmissionFactor),o.transmissionTexture!==void 0&&r.push(n.assignTexture(t,"transmissionMap",o.transmissionTexture)),Promise.all(r)}},fd=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_VOLUME}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];t.thickness=o.thicknessFactor!==void 0?o.thicknessFactor:0,o.thicknessTexture!==void 0&&r.push(n.assignTexture(t,"thicknessMap",o.thicknessTexture)),t.attenuationDistance=o.attenuationDistance||1/0;let l=o.attenuationColor||[1,1,1];return t.attenuationColor=new de().setRGB(l[0],l[1],l[2],Lt),Promise.all(r)}},pd=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_IOR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(e,t){let i=this.parser.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=i.extensions[this.name];return t.ior=r.ior!==void 0?r.ior:1.5,Promise.resolve()}},md=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_SPECULAR}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];t.specularIntensity=o.specularFactor!==void 0?o.specularFactor:1,o.specularTexture!==void 0&&r.push(n.assignTexture(t,"specularIntensityMap",o.specularTexture));let l=o.specularColorFactor||[1,1,1];return t.specularColor=new de().setRGB(l[0],l[1],l[2],Lt),o.specularColorTexture!==void 0&&r.push(n.assignTexture(t,"specularColorMap",o.specularColorTexture,Je)),Promise.all(r)}},gd=class{constructor(e){this.parser=e,this.name=$e.EXT_MATERIALS_BUMP}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return t.bumpScale=o.bumpFactor!==void 0?o.bumpFactor:1,o.bumpTexture!==void 0&&r.push(n.assignTexture(t,"bumpMap",o.bumpTexture)),Promise.all(r)}},_d=class{constructor(e){this.parser=e,this.name=$e.KHR_MATERIALS_ANISOTROPY}getMaterialType(e){let n=this.parser.json.materials[e];return!n.extensions||!n.extensions[this.name]?null:hn}extendMaterialParams(e,t){let n=this.parser,i=n.json.materials[e];if(!i.extensions||!i.extensions[this.name])return Promise.resolve();let r=[],o=i.extensions[this.name];return o.anisotropyStrength!==void 0&&(t.anisotropy=o.anisotropyStrength),o.anisotropyRotation!==void 0&&(t.anisotropyRotation=o.anisotropyRotation),o.anisotropyTexture!==void 0&&r.push(n.assignTexture(t,"anisotropyMap",o.anisotropyTexture)),Promise.all(r)}},vd=class{constructor(e){this.parser=e,this.name=$e.KHR_TEXTURE_BASISU}loadTexture(e){let t=this.parser,n=t.json,i=n.textures[e];if(!i.extensions||!i.extensions[this.name])return null;let r=i.extensions[this.name],o=t.options.ktx2Loader;if(!o){if(n.extensionsRequired&&n.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return t.loadTextureImage(e,r.source,o)}},yd=class{constructor(e){this.parser=e,this.name=$e.EXT_TEXTURE_WEBP}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],l=i.images[o.source],u=n.textureLoader;if(l.uri){let d=n.options.manager.getHandler(l.uri);d!==null&&(u=d)}return n.loadTextureImage(e,o.source,u)}},xd=class{constructor(e){this.parser=e,this.name=$e.EXT_TEXTURE_AVIF}loadTexture(e){let t=this.name,n=this.parser,i=n.json,r=i.textures[e];if(!r.extensions||!r.extensions[t])return null;let o=r.extensions[t],l=i.images[o.source],u=n.textureLoader;if(l.uri){let d=n.options.manager.getHandler(l.uri);d!==null&&(u=d)}return n.loadTextureImage(e,o.source,u)}},bd=class{constructor(e){this.name=$e.EXT_MESHOPT_COMPRESSION,this.parser=e}loadBufferView(e){let t=this.parser.json,n=t.bufferViews[e];if(n.extensions&&n.extensions[this.name]){let i=n.extensions[this.name],r=this.parser.getDependency("buffer",i.buffer),o=this.parser.options.meshoptDecoder;if(!o||!o.supported){if(t.extensionsRequired&&t.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return r.then(function(l){let u=i.byteOffset||0,d=i.byteLength||0,a=i.count,c=i.byteStride,h=new Uint8Array(l,u,d);return o.decodeGltfBufferAsync?o.decodeGltfBufferAsync(a,c,h,i.mode,i.filter).then(function(f){return f.buffer}):o.ready.then(function(){let f=new ArrayBuffer(a*c);return o.decodeGltfBuffer(new Uint8Array(f),a,c,h,i.mode,i.filter),f})})}else return null}},Md=class{constructor(e){this.name=$e.EXT_MESH_GPU_INSTANCING,this.parser=e}createNodeMesh(e){let t=this.parser.json,n=t.nodes[e];if(!n.extensions||!n.extensions[this.name]||n.mesh===void 0)return null;let i=t.meshes[n.mesh];for(let d of i.primitives)if(d.mode!==Ln.TRIANGLES&&d.mode!==Ln.TRIANGLE_STRIP&&d.mode!==Ln.TRIANGLE_FAN&&d.mode!==void 0)return null;let o=n.extensions[this.name].attributes,l=[],u={};for(let d in o)l.push(this.parser.getDependency("accessor",o[d]).then(a=>(u[d]=a,u[d])));return l.length<1?null:(l.push(this.parser.createNodeMesh(e)),Promise.all(l).then(d=>{let a=d.pop(),c=a.isGroup?a.children:[a],h=d[0].count,f=[];for(let g of c){let _=new ke,m=new w,p=new ft,b=new w(1,1,1),M=new Oo(g.geometry,g.material,h);for(let y=0;y<h;y++)u.TRANSLATION&&m.fromBufferAttribute(u.TRANSLATION,y),u.ROTATION&&p.fromBufferAttribute(u.ROTATION,y),u.SCALE&&b.fromBufferAttribute(u.SCALE,y),M.setMatrixAt(y,_.compose(m,p,b));for(let y in u)if(y==="_COLOR_0"){let T=u[y];M.instanceColor=new ji(T.array,T.itemSize,T.normalized)}else y!=="TRANSLATION"&&y!=="ROTATION"&&y!=="SCALE"&&g.geometry.setAttribute(y,u[y]);wt.prototype.copy.call(M,g),this.parser.assignFinalMaterial(M),f.push(M)}return a.isGroup?(a.clear(),a.add(...f),a):f[0]}))}},gp="glTF",sa=12,hp={JSON:1313821514,BIN:5130562},Sd=class{constructor(e){this.name=$e.KHR_BINARY_GLTF,this.content=null,this.body=null;let t=new DataView(e,0,sa),n=new TextDecoder;if(this.header={magic:n.decode(new Uint8Array(e.slice(0,4))),version:t.getUint32(4,!0),length:t.getUint32(8,!0)},this.header.magic!==gp)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let i=this.header.length-sa,r=new DataView(e,sa),o=0;for(;o<i;){let l=r.getUint32(o,!0);o+=4;let u=r.getUint32(o,!0);if(o+=4,u===hp.JSON){let d=new Uint8Array(e,sa+o,l);this.content=n.decode(d)}else if(u===hp.BIN){let d=sa+o;this.body=e.slice(d,d+l)}o+=l}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},Ed=class{constructor(e,t){if(!t)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=$e.KHR_DRACO_MESH_COMPRESSION,this.json=e,this.dracoLoader=t,this.dracoLoader.preload()}decodePrimitive(e,t){let n=this.json,i=this.dracoLoader,r=e.extensions[this.name].bufferView,o=e.extensions[this.name].attributes,l={},u={},d={};for(let a in o){let c=Ad[a]||a.toLowerCase();l[c]=o[a]}for(let a in e.attributes){let c=Ad[a]||a.toLowerCase();if(o[a]!==void 0){let h=n.accessors[e.attributes[a]],f=js[h.componentType];d[c]=f.name,u[c]=h.normalized===!0}}return t.getDependency("bufferView",r).then(function(a){return new Promise(function(c,h){i.decodeDracoFile(a,function(f){for(let g in f.attributes){let _=f.attributes[g],m=u[g];m!==void 0&&(_.normalized=m)}c(f)},l,d,Lt,h)})})}},Cd=class{constructor(){this.name=$e.KHR_TEXTURE_TRANSFORM}extendTexture(e,t){return(t.texCoord===void 0||t.texCoord===e.channel)&&t.offset===void 0&&t.rotation===void 0&&t.scale===void 0||(e=e.clone(),t.texCoord!==void 0&&(e.channel=t.texCoord),t.offset!==void 0&&e.offset.fromArray(t.offset),t.rotation!==void 0&&(e.rotation=t.rotation),t.scale!==void 0&&e.repeat.fromArray(t.scale),e.needsUpdate=!0),e}},wd=class{constructor(){this.name=$e.KHR_MESH_QUANTIZATION}},cc=class extends bi{constructor(e,t,n,i){super(e,t,n,i)}copySampleValue_(e){let t=this.resultBuffer,n=this.sampleValues,i=this.valueSize,r=e*i*3+i;for(let o=0;o!==i;o++)t[o]=n[r+o];return t}interpolate_(e,t,n,i){let r=this.resultBuffer,o=this.sampleValues,l=this.valueSize,u=l*2,d=l*3,a=i-t,c=(n-t)/a,h=c*c,f=h*c,g=e*d,_=g-d,m=-2*f+3*h,p=f-h,b=1-m,M=p-h+c;for(let y=0;y!==l;y++){let T=o[_+y+l],P=o[_+y+u]*a,A=o[g+y+l],D=o[g+y]*a;r[y]=b*T+M*P+m*A+p*D}return r}},wy=new ft,Td=class extends cc{interpolate_(e,t,n,i){let r=super.interpolate_(e,t,n,i);return wy.fromArray(r).normalize().toArray(r),r}},Ln={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},js={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},fp={9728:Xt,9729:Dt,9984:xl,9985:Us,9986:Pr,9987:jn},pp={33071:bn,33648:Ss,10497:qi},nd={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Ad={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},tr={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},Ty={CUBICSPLINE:void 0,LINEAR:vr,STEP:_r},id={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function Ay(s){return s.DefaultMaterial===void 0&&(s.DefaultMaterial=new Mr({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:Mn})),s.DefaultMaterial}function Ur(s,e,t){for(let n in t.extensions)s[n]===void 0&&(e.userData.gltfExtensions=e.userData.gltfExtensions||{},e.userData.gltfExtensions[n]=t.extensions[n])}function Di(s,e){e.extras!==void 0&&(typeof e.extras=="object"?Object.assign(s.userData,e.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+e.extras))}function Ry(s,e,t){let n=!1,i=!1,r=!1;for(let d=0,a=e.length;d<a;d++){let c=e[d];if(c.POSITION!==void 0&&(n=!0),c.NORMAL!==void 0&&(i=!0),c.COLOR_0!==void 0&&(r=!0),n&&i&&r)break}if(!n&&!i&&!r)return Promise.resolve(s);let o=[],l=[],u=[];for(let d=0,a=e.length;d<a;d++){let c=e[d];if(n){let h=c.POSITION!==void 0?t.getDependency("accessor",c.POSITION):s.attributes.position;o.push(h)}if(i){let h=c.NORMAL!==void 0?t.getDependency("accessor",c.NORMAL):s.attributes.normal;l.push(h)}if(r){let h=c.COLOR_0!==void 0?t.getDependency("accessor",c.COLOR_0):s.attributes.color;u.push(h)}}return Promise.all([Promise.all(o),Promise.all(l),Promise.all(u)]).then(function(d){let a=d[0],c=d[1],h=d[2];return n&&(s.morphAttributes.position=a),i&&(s.morphAttributes.normal=c),r&&(s.morphAttributes.color=h),s.morphTargetsRelative=!0,s})}function Py(s,e){if(s.updateMorphTargets(),e.weights!==void 0)for(let t=0,n=e.weights.length;t<n;t++)s.morphTargetInfluences[t]=e.weights[t];if(e.extras&&Array.isArray(e.extras.targetNames)){let t=e.extras.targetNames;if(s.morphTargetInfluences.length===t.length){s.morphTargetDictionary={};for(let n=0,i=t.length;n<i;n++)s.morphTargetDictionary[t[n]]=n}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function Iy(s){let e,t=s.extensions&&s.extensions[$e.KHR_DRACO_MESH_COMPRESSION];if(t?e="draco:"+t.bufferView+":"+t.indices+":"+rd(t.attributes):e=s.indices+":"+rd(s.attributes)+":"+s.mode,s.targets!==void 0)for(let n=0,i=s.targets.length;n<i;n++)e+=":"+rd(s.targets[n]);return e}function rd(s){let e="",t=Object.keys(s).sort();for(let n=0,i=t.length;n<i;n++)e+=t[n]+":"+s[t[n]]+";";return e}function Rd(s){switch(s){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function Dy(s){return s.search(/\.jpe?g($|\?)/i)>0||s.search(/^data\:image\/jpeg/)===0?"image/jpeg":s.search(/\.webp($|\?)/i)>0||s.search(/^data\:image\/webp/)===0?"image/webp":s.search(/\.ktx2($|\?)/i)>0||s.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var Oy=new ke,Pd=class{constructor(e={},t={}){this.json=e,this.extensions={},this.plugins={},this.options=t,this.cache=new Cy,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let n=!1,i=-1,r=!1,o=-1;if(typeof navigator<"u"){let l=navigator.userAgent;n=/^((?!chrome|android).)*safari/i.test(l)===!0;let u=l.match(/Version\/(\d+)/);i=n&&u?parseInt(u[1],10):-1,r=l.indexOf("Firefox")>-1,o=r?l.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||n&&i<17||r&&o<98?this.textureLoader=new Er(this.options.manager):this.textureLoader=new Wo(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new Ei(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(e){this.extensions=e}setPlugins(e){this.plugins=e}parse(e,t){let n=this,i=this.json,r=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(o){return o._markDefs&&o._markDefs()}),Promise.all(this._invokeAll(function(o){return o.beforeRoot&&o.beforeRoot()})).then(function(){return Promise.all([n.getDependencies("scene"),n.getDependencies("animation"),n.getDependencies("camera")])}).then(function(o){let l={scene:o[0][i.scene||0],scenes:o[0],animations:o[1],cameras:o[2],asset:i.asset,parser:n,userData:{}};return Ur(r,l,i),Di(l,i),Promise.all(n._invokeAll(function(u){return u.afterRoot&&u.afterRoot(l)})).then(function(){for(let u of l.scenes)u.updateMatrixWorld();e(l)})}).catch(t)}_markDefs(){let e=this.json.nodes||[],t=this.json.skins||[],n=this.json.meshes||[];for(let i=0,r=t.length;i<r;i++){let o=t[i].joints;for(let l=0,u=o.length;l<u;l++)e[o[l]].isBone=!0}for(let i=0,r=e.length;i<r;i++){let o=e[i];o.mesh!==void 0&&(this._addNodeRef(this.meshCache,o.mesh),o.skin!==void 0&&(n[o.mesh].isSkinnedMesh=!0)),o.camera!==void 0&&this._addNodeRef(this.cameraCache,o.camera)}}_addNodeRef(e,t){t!==void 0&&(e.refs[t]===void 0&&(e.refs[t]=e.uses[t]=0),e.refs[t]++)}_getNodeRef(e,t,n){if(e.refs[t]<=1)return n;let i=n.clone(),r=(o,l)=>{let u=this.associations.get(o);u!=null&&this.associations.set(l,u);for(let[d,a]of o.children.entries())r(a,l.children[d])};return r(n,i),i.name+="_instance_"+e.uses[t]++,i}_invokeOne(e){let t=Object.values(this.plugins);t.push(this);for(let n=0;n<t.length;n++){let i=e(t[n]);if(i)return i}return null}_invokeAll(e){let t=Object.values(this.plugins);t.unshift(this);let n=[];for(let i=0;i<t.length;i++){let r=e(t[i]);r&&n.push(r)}return n}getDependency(e,t){let n=e+":"+t,i=this.cache.get(n);if(!i){switch(e){case"scene":i=this.loadScene(t);break;case"node":i=this._invokeOne(function(r){return r.loadNode&&r.loadNode(t)});break;case"mesh":i=this._invokeOne(function(r){return r.loadMesh&&r.loadMesh(t)});break;case"accessor":i=this.loadAccessor(t);break;case"bufferView":i=this._invokeOne(function(r){return r.loadBufferView&&r.loadBufferView(t)});break;case"buffer":i=this.loadBuffer(t);break;case"material":i=this._invokeOne(function(r){return r.loadMaterial&&r.loadMaterial(t)});break;case"texture":i=this._invokeOne(function(r){return r.loadTexture&&r.loadTexture(t)});break;case"skin":i=this.loadSkin(t);break;case"animation":i=this._invokeOne(function(r){return r.loadAnimation&&r.loadAnimation(t)});break;case"camera":i=this.loadCamera(t);break;default:if(i=this._invokeOne(function(r){return r!=this&&r.getDependency&&r.getDependency(e,t)}),!i)throw new Error("Unknown type: "+e);break}this.cache.add(n,i)}return i}getDependencies(e){let t=this.cache.get(e);if(!t){let n=this,i=this.json[e+(e==="mesh"?"es":"s")]||[];t=Promise.all(i.map(function(r,o){return n.getDependency(e,o)})),this.cache.add(e,t)}return t}loadBuffer(e){let t=this.json.buffers[e],n=this.fileLoader;if(t.type&&t.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+t.type+" buffer type is not supported.");if(t.uri===void 0&&e===0)return Promise.resolve(this.extensions[$e.KHR_BINARY_GLTF].body);let i=this.options;return new Promise(function(r,o){n.load(wi.resolveURL(t.uri,i.path),r,void 0,function(){o(new Error('THREE.GLTFLoader: Failed to load buffer "'+t.uri+'".'))})})}loadBufferView(e){let t=this.json.bufferViews[e];return this.getDependency("buffer",t.buffer).then(function(n){let i=t.byteLength||0,r=t.byteOffset||0;return n.slice(r,r+i)})}loadAccessor(e){let t=this,n=this.json,i=this.json.accessors[e];if(i.bufferView===void 0&&i.sparse===void 0){let o=nd[i.type],l=js[i.componentType],u=i.normalized===!0,d=new l(i.count*o);return Promise.resolve(new st(d,o,u))}let r=[];return i.bufferView!==void 0?r.push(this.getDependency("bufferView",i.bufferView)):r.push(null),i.sparse!==void 0&&(r.push(this.getDependency("bufferView",i.sparse.indices.bufferView)),r.push(this.getDependency("bufferView",i.sparse.values.bufferView))),Promise.all(r).then(function(o){let l=o[0],u=nd[i.type],d=js[i.componentType],a=d.BYTES_PER_ELEMENT,c=a*u,h=i.byteOffset||0,f=i.bufferView!==void 0?n.bufferViews[i.bufferView].byteStride:void 0,g=i.normalized===!0,_,m;if(f&&f!==c){let p=Math.floor(h/f),b="InterleavedBuffer:"+i.bufferView+":"+i.componentType+":"+p+":"+i.count,M=t.cache.get(b);M||(_=new d(l,p*f,i.count*f/a),M=new Ps(_,f/a),t.cache.add(b,M)),m=new Is(M,u,h%f/a,g)}else l===null?_=new d(i.count*u):_=new d(l,h,i.count*u),m=new st(_,u,g);if(i.sparse!==void 0){let p=nd.SCALAR,b=js[i.sparse.indices.componentType],M=i.sparse.indices.byteOffset||0,y=i.sparse.values.byteOffset||0,T=new b(o[1],M,i.sparse.count*p),P=new d(o[2],y,i.sparse.count*u);l!==null&&(m=new st(m.array.slice(),m.itemSize,m.normalized)),m.normalized=!1;for(let A=0,D=T.length;A<D;A++){let S=T[A];if(m.setX(S,P[A*u]),u>=2&&m.setY(S,P[A*u+1]),u>=3&&m.setZ(S,P[A*u+2]),u>=4&&m.setW(S,P[A*u+3]),u>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}m.normalized=g}return m})}loadTexture(e){let t=this.json,n=this.options,r=t.textures[e].source,o=t.images[r],l=this.textureLoader;if(o.uri){let u=n.manager.getHandler(o.uri);u!==null&&(l=u)}return this.loadTextureImage(e,r,l)}loadTextureImage(e,t,n){let i=this,r=this.json,o=r.textures[e],l=r.images[t],u=(l.uri||l.bufferView)+":"+o.sampler;if(this.textureCache[u])return this.textureCache[u];let d=this.loadImageSource(t,n).then(function(a){a.flipY=!1,a.name=o.name||l.name||"",a.name===""&&typeof l.uri=="string"&&l.uri.startsWith("data:image/")===!1&&(a.name=l.uri);let h=(r.samplers||{})[o.sampler]||{};return a.magFilter=fp[h.magFilter]||Dt,a.minFilter=fp[h.minFilter]||jn,a.wrapS=pp[h.wrapS]||qi,a.wrapT=pp[h.wrapT]||qi,a.generateMipmaps=!a.isCompressedTexture&&a.minFilter!==Xt&&a.minFilter!==Dt,i.associations.set(a,{textures:e}),a}).catch(function(){return null});return this.textureCache[u]=d,d}loadImageSource(e,t){let n=this,i=this.json,r=this.options;if(this.sourceCache[e]!==void 0)return this.sourceCache[e].then(c=>c.clone());let o=i.images[e],l=self.URL||self.webkitURL,u=o.uri||"",d=!1;if(o.bufferView!==void 0)u=n.getDependency("bufferView",o.bufferView).then(function(c){d=!0;let h=new Blob([c],{type:o.mimeType});return u=l.createObjectURL(h),u});else if(o.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+e+" is missing URI and bufferView");let a=Promise.resolve(u).then(function(c){return new Promise(function(h,f){let g=h;t.isImageBitmapLoader===!0&&(g=function(_){let m=new pn(_);m.needsUpdate=!0,h(m)}),t.load(wi.resolveURL(c,r.path),g,void 0,f)})}).then(function(c){return d===!0&&l.revokeObjectURL(u),Di(c,o),c.userData.mimeType=o.mimeType||Dy(o.uri),c}).catch(function(c){throw console.error("THREE.GLTFLoader: Couldn't load texture",u),c});return this.sourceCache[e]=a,a}assignTexture(e,t,n,i){let r=this;return this.getDependency("texture",n.index).then(function(o){if(!o)return null;if(n.texCoord!==void 0&&n.texCoord>0&&(o=o.clone(),o.channel=n.texCoord),r.extensions[$e.KHR_TEXTURE_TRANSFORM]){let l=n.extensions!==void 0?n.extensions[$e.KHR_TEXTURE_TRANSFORM]:void 0;if(l){let u=r.associations.get(o);o=r.extensions[$e.KHR_TEXTURE_TRANSFORM].extendTexture(o,l),r.associations.set(o,u)}}return i!==void 0&&(o.colorSpace=i),e[t]=o,o})}assignFinalMaterial(e){let t=e.geometry,n=e.material,i=t.attributes.tangent===void 0,r=t.attributes.color!==void 0,o=t.attributes.normal===void 0;if(e.isPoints){let l="PointsMaterial:"+n.uuid,u=this.cache.get(l);u||(u=new Ns,qt.prototype.copy.call(u,n),u.color.copy(n.color),u.map=n.map,u.sizeAttenuation=!1,this.cache.add(l,u)),n=u}else if(e.isLine){let l="LineBasicMaterial:"+n.uuid,u=this.cache.get(l);u||(u=new Zi,qt.prototype.copy.call(u,n),u.color.copy(n.color),u.map=n.map,this.cache.add(l,u)),n=u}if(i||r||o){let l="ClonedMaterial:"+n.uuid+":";i&&(l+="derivative-tangents:"),r&&(l+="vertex-colors:"),o&&(l+="flat-shading:");let u=this.cache.get(l);u||(u=n.clone(),r&&(u.vertexColors=!0),o&&(u.flatShading=!0),i&&(u.normalScale&&(u.normalScale.y*=-1),u.clearcoatNormalScale&&(u.clearcoatNormalScale.y*=-1)),this.cache.add(l,u),this.associations.set(u,this.associations.get(n))),n=u}e.material=n}getMaterialType(){return Mr}loadMaterial(e){let t=this,n=this.json,i=this.extensions,r=n.materials[e],o,l={},u=r.extensions||{},d=[];if(u[$e.KHR_MATERIALS_UNLIT]){let c=i[$e.KHR_MATERIALS_UNLIT];o=c.getMaterialType(),d.push(c.extendParams(l,r,t))}else{let c=r.pbrMetallicRoughness||{};if(l.color=new de(1,1,1),l.opacity=1,Array.isArray(c.baseColorFactor)){let h=c.baseColorFactor;l.color.setRGB(h[0],h[1],h[2],Lt),l.opacity=h[3]}c.baseColorTexture!==void 0&&d.push(t.assignTexture(l,"map",c.baseColorTexture,Je)),l.metalness=c.metallicFactor!==void 0?c.metallicFactor:1,l.roughness=c.roughnessFactor!==void 0?c.roughnessFactor:1,c.metallicRoughnessTexture!==void 0&&(d.push(t.assignTexture(l,"metalnessMap",c.metallicRoughnessTexture)),d.push(t.assignTexture(l,"roughnessMap",c.metallicRoughnessTexture))),o=this._invokeOne(function(h){return h.getMaterialType&&h.getMaterialType(e)}),d.push(Promise.all(this._invokeAll(function(h){return h.extendMaterialParams&&h.extendMaterialParams(e,l)})))}r.doubleSided===!0&&(l.side=Vt);let a=r.alphaMode||id.OPAQUE;if(a===id.BLEND?(l.transparent=!0,l.depthWrite=!1):(l.transparent=!1,a===id.MASK&&(l.alphaTest=r.alphaCutoff!==void 0?r.alphaCutoff:.5)),r.normalTexture!==void 0&&o!==Ot&&(d.push(t.assignTexture(l,"normalMap",r.normalTexture)),l.normalScale=new Se(1,1),r.normalTexture.scale!==void 0)){let c=r.normalTexture.scale;l.normalScale.set(c,c)}if(r.occlusionTexture!==void 0&&o!==Ot&&(d.push(t.assignTexture(l,"aoMap",r.occlusionTexture)),r.occlusionTexture.strength!==void 0&&(l.aoMapIntensity=r.occlusionTexture.strength)),r.emissiveFactor!==void 0&&o!==Ot){let c=r.emissiveFactor;l.emissive=new de().setRGB(c[0],c[1],c[2],Lt)}return r.emissiveTexture!==void 0&&o!==Ot&&d.push(t.assignTexture(l,"emissiveMap",r.emissiveTexture,Je)),Promise.all(d).then(function(){let c=new o(l);return r.name&&(c.name=r.name),Di(c,r),t.associations.set(c,{materials:e}),r.extensions&&Ur(i,c,r),c})}createUniqueName(e){let t=yt.sanitizeNodeName(e||"");return t in this.nodeNamesUsed?t+"_"+ ++this.nodeNamesUsed[t]:(this.nodeNamesUsed[t]=0,t)}loadGeometries(e){let t=this,n=this.extensions,i=this.primitiveCache;function r(l){return n[$e.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(l,t).then(function(u){return mp(u,l,t)})}let o=[];for(let l=0,u=e.length;l<u;l++){let d=e[l],a=Iy(d),c=i[a];if(c)o.push(c.promise);else{let h;d.extensions&&d.extensions[$e.KHR_DRACO_MESH_COMPRESSION]?h=r(d):h=mp(new Tt,d,t),i[a]={primitive:d,promise:h},o.push(h)}}return Promise.all(o)}loadMesh(e){let t=this,n=this.json,i=this.extensions,r=n.meshes[e],o=r.primitives,l=[];for(let u=0,d=o.length;u<d;u++){let a=o[u].material===void 0?Ay(this.cache):this.getDependency("material",o[u].material);l.push(a)}return l.push(t.loadGeometries(o)),Promise.all(l).then(function(u){let d=u.slice(0,u.length-1),a=u[u.length-1],c=[];for(let f=0,g=a.length;f<g;f++){let _=a[f],m=o[f],p,b=d[f];if(m.mode===Ln.TRIANGLES||m.mode===Ln.TRIANGLE_STRIP||m.mode===Ln.TRIANGLE_FAN||m.mode===void 0)p=r.isSkinnedMesh===!0?new Po(_,b):new Ue(_,b),p.isSkinnedMesh===!0&&p.normalizeSkinWeights(),m.mode===Ln.TRIANGLE_STRIP?p.geometry=td(p.geometry,ta):m.mode===Ln.TRIANGLE_FAN&&(p.geometry=td(p.geometry,Gs));else if(m.mode===Ln.LINES)p=new Ls(_,b);else if(m.mode===Ln.LINE_STRIP)p=new xi(_,b);else if(m.mode===Ln.LINE_LOOP)p=new Lo(_,b);else if(m.mode===Ln.POINTS)p=new No(_,b);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+m.mode);Object.keys(p.geometry.morphAttributes).length>0&&Py(p,r),p.name=t.createUniqueName(r.name||"mesh_"+e),Di(p,r),m.extensions&&Ur(i,p,m),t.assignFinalMaterial(p),c.push(p)}for(let f=0,g=c.length;f<g;f++)t.associations.set(c[f],{meshes:e,primitives:f});if(c.length===1)return r.extensions&&Ur(i,c[0],r),c[0];let h=new Wn;r.extensions&&Ur(i,h,r),t.associations.set(h,{meshes:e});for(let f=0,g=c.length;f<g;f++)h.add(c[f]);return h})}loadCamera(e){let t,n=this.json.cameras[e],i=n[n.type];if(!i){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return n.type==="perspective"?t=new It(na.radToDeg(i.yfov),i.aspectRatio||1,i.znear||1,i.zfar||2e6):n.type==="orthographic"&&(t=new qn(-i.xmag,i.xmag,i.ymag,-i.ymag,i.znear,i.zfar)),n.name&&(t.name=this.createUniqueName(n.name)),Di(t,n),Promise.resolve(t)}loadSkin(e){let t=this.json.skins[e],n=[];for(let i=0,r=t.joints.length;i<r;i++)n.push(this._loadNodeShallow(t.joints[i]));return t.inverseBindMatrices!==void 0?n.push(this.getDependency("accessor",t.inverseBindMatrices)):n.push(null),Promise.all(n).then(function(i){let r=i.pop(),o=i,l=[],u=[];for(let d=0,a=o.length;d<a;d++){let c=o[d];if(c){l.push(c);let h=new ke;r!==null&&h.fromArray(r.array,d*16),u.push(h)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',t.joints[d])}return new Do(l,u)})}loadAnimation(e){let t=this.json,n=this,i=t.animations[e],r=i.name?i.name:"animation_"+e,o=[],l=[],u=[],d=[],a=[];for(let c=0,h=i.channels.length;c<h;c++){let f=i.channels[c],g=i.samplers[f.sampler],_=f.target,m=_.node,p=i.parameters!==void 0?i.parameters[g.input]:g.input,b=i.parameters!==void 0?i.parameters[g.output]:g.output;_.node!==void 0&&(o.push(this.getDependency("node",m)),l.push(this.getDependency("accessor",p)),u.push(this.getDependency("accessor",b)),d.push(g),a.push(_))}return Promise.all([Promise.all(o),Promise.all(l),Promise.all(u),Promise.all(d),Promise.all(a)]).then(function(c){let h=c[0],f=c[1],g=c[2],_=c[3],m=c[4],p=[];for(let b=0,M=h.length;b<M;b++){let y=h[b],T=f[b],P=g[b],A=_[b],D=m[b];if(y===void 0)continue;y.updateMatrix&&y.updateMatrix();let S=n._createAnimationTracks(y,T,P,A,D);if(S)for(let E=0;E<S.length;E++)p.push(S[E])}return new Sr(r,void 0,p)})}createNodeMesh(e){let t=this.json,n=this,i=t.nodes[e];return i.mesh===void 0?null:n.getDependency("mesh",i.mesh).then(function(r){let o=n._getNodeRef(n.meshCache,i.mesh,r);return i.weights!==void 0&&o.traverse(function(l){if(l.isMesh)for(let u=0,d=i.weights.length;u<d;u++)l.morphTargetInfluences[u]=i.weights[u]}),o})}loadNode(e){let t=this.json,n=this,i=t.nodes[e],r=n._loadNodeShallow(e),o=[],l=i.children||[];for(let d=0,a=l.length;d<a;d++)o.push(n.getDependency("node",l[d]));let u=i.skin===void 0?Promise.resolve(null):n.getDependency("skin",i.skin);return Promise.all([r,Promise.all(o),u]).then(function(d){let a=d[0],c=d[1],h=d[2];h!==null&&a.traverse(function(f){f.isSkinnedMesh&&f.bind(h,Oy)});for(let f=0,g=c.length;f<g;f++)a.add(c[f]);return a})}_loadNodeShallow(e){let t=this.json,n=this.extensions,i=this;if(this.nodeCache[e]!==void 0)return this.nodeCache[e];let r=t.nodes[e],o=r.name?i.createUniqueName(r.name):"",l=[],u=i._invokeOne(function(d){return d.createNodeMesh&&d.createNodeMesh(e)});return u&&l.push(u),r.camera!==void 0&&l.push(i.getDependency("camera",r.camera).then(function(d){return i._getNodeRef(i.cameraCache,r.camera,d)})),i._invokeAll(function(d){return d.createNodeAttachment&&d.createNodeAttachment(e)}).forEach(function(d){l.push(d)}),this.nodeCache[e]=Promise.all(l).then(function(d){let a;if(r.isBone===!0?a=new Ds:d.length>1?a=new Wn:d.length===1?a=d[0]:a=new wt,a!==d[0])for(let c=0,h=d.length;c<h;c++)a.add(d[c]);if(r.name&&(a.userData.name=r.name,a.name=o),Di(a,r),r.extensions&&Ur(n,a,r),r.matrix!==void 0){let c=new ke;c.fromArray(r.matrix),a.applyMatrix4(c)}else r.translation!==void 0&&a.position.fromArray(r.translation),r.rotation!==void 0&&a.quaternion.fromArray(r.rotation),r.scale!==void 0&&a.scale.fromArray(r.scale);if(!i.associations.has(a))i.associations.set(a,{});else if(r.mesh!==void 0&&i.meshCache.refs[r.mesh]>1){let c=i.associations.get(a);i.associations.set(a,Ct({},c))}return i.associations.get(a).nodes=e,a}),this.nodeCache[e]}loadScene(e){let t=this.extensions,n=this.json.scenes[e],i=this,r=new Wn;n.name&&(r.name=i.createUniqueName(n.name)),Di(r,n),n.extensions&&Ur(t,r,n);let o=n.nodes||[],l=[];for(let u=0,d=o.length;u<d;u++)l.push(i.getDependency("node",o[u]));return Promise.all(l).then(function(u){for(let a=0,c=u.length;a<c;a++)r.add(u[a]);let d=a=>{let c=new Map;for(let[h,f]of i.associations)(h instanceof qt||h instanceof pn)&&c.set(h,f);return a.traverse(h=>{let f=i.associations.get(h);f!=null&&c.set(h,f)}),c};return i.associations=d(r),r})}_createAnimationTracks(e,t,n,i,r){let o=[],l=e.name?e.name:e.uuid,u=[];tr[r.path]===tr.weights?e.traverse(function(h){h.morphTargetInfluences&&u.push(h.name?h.name:h.uuid)}):u.push(l);let d;switch(tr[r.path]){case tr.weights:d=ei;break;case tr.rotation:d=ti;break;case tr.translation:case tr.scale:d=ni;break;default:switch(n.itemSize){case 1:d=ei;break;case 2:case 3:default:d=ni;break}break}let a=i.interpolation!==void 0?Ty[i.interpolation]:vr,c=this._getArrayFromAccessor(n);for(let h=0,f=u.length;h<f;h++){let g=new d(u[h]+"."+tr[r.path],t.array,c,a);i.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(g),o.push(g)}return o}_getArrayFromAccessor(e){let t=e.array;if(e.normalized){let n=Rd(t.constructor),i=new Float32Array(t.length);for(let r=0,o=t.length;r<o;r++)i[r]=t[r]*n;t=i}return t}_createCubicSplineTrackInterpolant(e){e.createInterpolant=function(n){let i=this instanceof ti?Td:cc;return new i(this.times,this.values,this.getValueSize()/3,n)},e.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function Ly(s,e,t){let n=e.attributes,i=new Sn;if(n.POSITION!==void 0){let l=t.json.accessors[n.POSITION],u=l.min,d=l.max;if(u!==void 0&&d!==void 0){if(i.set(new w(u[0],u[1],u[2]),new w(d[0],d[1],d[2])),l.normalized){let a=Rd(js[l.componentType]);i.min.multiplyScalar(a),i.max.multiplyScalar(a)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let r=e.targets;if(r!==void 0){let l=new w,u=new w;for(let d=0,a=r.length;d<a;d++){let c=r[d];if(c.POSITION!==void 0){let h=t.json.accessors[c.POSITION],f=h.min,g=h.max;if(f!==void 0&&g!==void 0){if(u.setX(Math.max(Math.abs(f[0]),Math.abs(g[0]))),u.setY(Math.max(Math.abs(f[1]),Math.abs(g[1]))),u.setZ(Math.max(Math.abs(f[2]),Math.abs(g[2]))),h.normalized){let _=Rd(js[h.componentType]);u.multiplyScalar(_)}l.max(u)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}i.expandByVector(l)}s.boundingBox=i;let o=new dn;i.getCenter(o.center),o.radius=i.min.distanceTo(i.max)/2,s.boundingSphere=o}function mp(s,e,t){let n=e.attributes,i=[];function r(o,l){return t.getDependency("accessor",o).then(function(u){s.setAttribute(l,u)})}for(let o in n){let l=Ad[o]||o.toLowerCase();l in s.attributes||i.push(r(n[o],l))}if(e.indices!==void 0&&!s.index){let o=t.getDependency("accessor",e.indices).then(function(l){s.setIndex(l)});i.push(o)}return je.workingColorSpace!==Lt&&"COLOR_0"in n&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${je.workingColorSpace}" not supported.`),Di(s,e),Ly(s,e,t),Promise.all(i).then(function(){return e.targets!==void 0?Ry(s,e.targets,t):s})}var Id=new WeakMap,uc=class extends Pi{constructor(e){super(e),this.decoderPath="",this.decoderConfig={},this.decoderBinary=null,this.decoderPending=null,this.workerLimit=4,this.workerPool=[],this.workerNextTaskID=1,this.workerSourceURL="",this.defaultAttributeIDs={position:"POSITION",normal:"NORMAL",color:"COLOR",uv:"TEX_COORD"},this.defaultAttributeTypes={position:"Float32Array",normal:"Float32Array",color:"Float32Array",uv:"Float32Array"}}setDecoderPath(e){return this.decoderPath=e,this}setDecoderConfig(e){return this.decoderConfig=e,this}setWorkerLimit(e){return this.workerLimit=e,this}load(e,t,n,i){let r=new Ei(this.manager);r.setPath(this.path),r.setResponseType("arraybuffer"),r.setRequestHeader(this.requestHeader),r.setWithCredentials(this.withCredentials),r.load(e,o=>{this.parse(o,t,i)},n,i)}parse(e,t,n=()=>{}){this.decodeDracoFile(e,t,null,null,Je,n).catch(n)}decodeDracoFile(e,t,n,i,r=Lt,o=()=>{}){let l={attributeIDs:n||this.defaultAttributeIDs,attributeTypes:i||this.defaultAttributeTypes,useUniqueIDs:!!n,vertexColorSpace:r};return this.decodeGeometry(e,l).then(t).catch(o)}decodeGeometry(e,t){let n=JSON.stringify(t);if(Id.has(e)){let u=Id.get(e);if(u.key===n)return u.promise;if(e.byteLength===0)throw new Error("THREE.DRACOLoader: Unable to re-decode a buffer with different settings. Buffer has already been transferred.")}let i,r=this.workerNextTaskID++,o=e.byteLength,l=this._getWorker(r,o).then(u=>(i=u,new Promise((d,a)=>{i._callbacks[r]={resolve:d,reject:a},i.postMessage({type:"decode",id:r,taskConfig:t,buffer:e},[e])}))).then(u=>this._createGeometry(u.geometry));return l.catch(()=>!0).then(()=>{i&&r&&this._releaseTask(i,r)}),Id.set(e,{key:n,promise:l}),l}_createGeometry(e){let t=new Tt;e.index&&t.setIndex(new st(e.index.array,1));for(let n=0;n<e.attributes.length;n++){let i=e.attributes[n],r=i.name,o=i.array,l=i.itemSize,u=new st(o,l);r==="color"&&(this._assignVertexColorSpace(u,i.vertexColorSpace),u.normalized=!(o instanceof Float32Array)),t.setAttribute(r,u)}return t}_assignVertexColorSpace(e,t){if(t!==Je)return;let n=new de;for(let i=0,r=e.count;i<r;i++)n.fromBufferAttribute(e,i),je.colorSpaceToWorking(n,Je),e.setXYZ(i,n.r,n.g,n.b)}_loadLibrary(e,t){let n=new Ei(this.manager);return n.setPath(this.decoderPath),n.setResponseType(t),n.setWithCredentials(this.withCredentials),new Promise((i,r)=>{n.load(e,i,void 0,r)})}preload(){return this._initDecoder(),this}_initDecoder(){if(this.decoderPending)return this.decoderPending;let e=typeof WebAssembly!="object"||this.decoderConfig.type==="js",t=[];return e?t.push(this._loadLibrary("draco_decoder.js","text")):(t.push(this._loadLibrary("draco_wasm_wrapper.js","text")),t.push(this._loadLibrary("draco_decoder.wasm","arraybuffer"))),this.decoderPending=Promise.all(t).then(n=>{let i=n[0];e||(this.decoderConfig.wasmBinary=n[1]);let r=Ny.toString(),o=["/* draco decoder */",i,"","/* worker */",r.substring(r.indexOf("{")+1,r.lastIndexOf("}"))].join(`
`);this.workerSourceURL=URL.createObjectURL(new Blob([o]))}),this.decoderPending}_getWorker(e,t){return this._initDecoder().then(()=>{if(this.workerPool.length<this.workerLimit){let i=new Worker(this.workerSourceURL);i._callbacks={},i._taskCosts={},i._taskLoad=0,i.postMessage({type:"init",decoderConfig:this.decoderConfig}),i.onmessage=function(r){let o=r.data;switch(o.type){case"decode":i._callbacks[o.id].resolve(o);break;case"error":i._callbacks[o.id].reject(o);break;default:console.error('THREE.DRACOLoader: Unexpected message, "'+o.type+'"')}},this.workerPool.push(i)}else this.workerPool.sort(function(i,r){return i._taskLoad>r._taskLoad?-1:1});let n=this.workerPool[this.workerPool.length-1];return n._taskCosts[e]=t,n._taskLoad+=t,n})}_releaseTask(e,t){e._taskLoad-=e._taskCosts[t],delete e._callbacks[t],delete e._taskCosts[t]}debug(){console.log("Task load: ",this.workerPool.map(e=>e._taskLoad))}dispose(){for(let e=0;e<this.workerPool.length;++e)this.workerPool[e].terminate();return this.workerPool.length=0,this.workerSourceURL!==""&&URL.revokeObjectURL(this.workerSourceURL),this}};function Ny(){let s,e;onmessage=function(o){let l=o.data;switch(l.type){case"init":s=l.decoderConfig,e=new Promise(function(a){s.onModuleLoaded=function(c){a({draco:c})},DracoDecoderModule(s)});break;case"decode":let u=l.buffer,d=l.taskConfig;e.then(a=>{let c=a.draco,h=new c.Decoder;try{let f=t(c,h,new Int8Array(u),d),g=f.attributes.map(_=>_.array.buffer);f.index&&g.push(f.index.array.buffer),self.postMessage({type:"decode",id:l.id,geometry:f},g)}catch(f){console.error(f),self.postMessage({type:"error",id:l.id,error:f.message})}finally{c.destroy(h)}});break}};function t(o,l,u,d){let a=d.attributeIDs,c=d.attributeTypes,h,f,g=l.GetEncodedGeometryType(u);if(g===o.TRIANGULAR_MESH)h=new o.Mesh,f=l.DecodeArrayToMesh(u,u.byteLength,h);else if(g===o.POINT_CLOUD)h=new o.PointCloud,f=l.DecodeArrayToPointCloud(u,u.byteLength,h);else throw new Error("THREE.DRACOLoader: Unexpected geometry type.");if(!f.ok()||h.ptr===0)throw new Error("THREE.DRACOLoader: Decoding failed: "+f.error_msg());let _={index:null,attributes:[]};for(let m in a){let p=self[c[m]],b,M;if(d.useUniqueIDs)M=a[m],b=l.GetAttributeByUniqueId(h,M);else{if(M=l.GetAttributeId(h,o[a[m]]),M===-1)continue;b=l.GetAttribute(h,M)}let y=i(o,l,h,m,p,b);m==="color"&&(y.vertexColorSpace=d.vertexColorSpace),_.attributes.push(y)}return g===o.TRIANGULAR_MESH&&(_.index=n(o,l,h)),o.destroy(h),_}function n(o,l,u){let a=u.num_faces()*3,c=a*4,h=o._malloc(c);l.GetTrianglesUInt32Array(u,c,h);let f=new Uint32Array(o.HEAPF32.buffer,h,a).slice();return o._free(h),{array:f,itemSize:1}}function i(o,l,u,d,a,c){let h=c.num_components(),g=u.num_points()*h,_=g*a.BYTES_PER_ELEMENT,m=r(o,a),p=o._malloc(_);l.GetAttributeDataArrayForAllPoints(u,c,m,_,p);let b=new a(o.HEAPF32.buffer,p,g).slice();return o._free(p),{name:d,array:b,itemSize:h}}function r(o,l){switch(l){case Float32Array:return o.DT_FLOAT32;case Int8Array:return o.DT_INT8;case Int16Array:return o.DT_INT16;case Int32Array:return o.DT_INT32;case Uint8Array:return o.DT_UINT8;case Uint16Array:return o.DT_UINT16;case Uint32Array:return o.DT_UINT32}}}var Br=class Br{setupMaterials(e,t){e.traverse(n=>{n instanceof Ue&&n.name==="CD"&&Array.isArray(n.material)&&(n.material=n.material.map((i,r)=>{let o=t.materials.cd[r],l=i.clone();return Object.assign(l,{metalness:Math.min(o.metalness,.6),roughness:Math.max(o.roughness,.4),envMapIntensity:Math.min(o.envMapIntensity*.5,1),transparent:!1,depthWrite:!0,depthTest:!0,side:Vt}),"clearcoat"in l&&o.clearcoat!==void 0&&(l.clearcoat=Math.min(o.clearcoat*.7,.7),l.clearcoatRoughness=Math.max(o.clearcoatRoughness,.3)),l.needsUpdate=!0,l}))})}setupEnvironmentMap(e,t,n){let i=new si(t),r={uniforms:{tDiffuse:{value:n},tintColor:{value:new de(1.1,.9,.9)},tintIntensity:{value:.3}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform vec3 tintColor;
        uniform float tintIntensity;
        varying vec2 vUv;
        
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec3 tinted = mix(texel.rgb, texel.rgb * tintColor, tintIntensity);
          gl_FragColor = vec4(tinted, texel.a);
        }
      `},o=new yi,l=new qn(-1,1,1,-1,0,1),u=new Rt(r),d=new zt(2,2),a=new Ue(d,u);o.add(a);let c=new un(n.image.width,n.image.height,{format:Zt,type:an});t.setRenderTarget(c),t.render(o,l),t.setRenderTarget(null);let h=c.texture;h.colorSpace=Je,t.toneMapping=Ki,t.toneMappingExposure=.5;let f=i.fromEquirectangular(h).texture;f.mapping=Ji,e.environment=f,n.dispose(),h.dispose(),c.dispose(),u.dispose(),d.dispose(),i.dispose()}};Br.\u0275fac=function(t){return new(t||Br)},Br.\u0275prov=ze({token:Br,factory:Br.\u0275fac,providedIn:"root"});var dc=Br;var Hr=class Hr{constructor(e,t){this.animationsService=e;this.materialsService=t;this.POSITION_STATES={getInactivePosition:(e,t,n)=>new w(e.x,e.y+t*n,e.z),getActivePosition:(e,t)=>e.clone().add(t)}}loadModels(e,t,n){return rn(this,null,function*(){let i=new lc,r=new uc,o="assets/draco/";console.log("[CDCaseLoadingService] Setting Draco decoder path:",o),r.setDecoderPath(o),i.setDRACOLoader(r);let l=[],u=[];try{console.log("[CDCaseLoadingService] Loading 3D model: assets/3d/CD_Case/untitled.glb");let d=i.loadAsync("assets/3d/CD_Case/untitled.glb").catch(_=>{throw console.error("[CDCaseLoadingService] Error loading GLB model:",_),new Error("Failed to load CD Case model: "+_.message)});u.push(d);let a=new Promise((_,m)=>{console.log("[CDCaseLoadingService] Loading environment map: assets/images/composite.png"),new Er().load("assets/images/composite.png",p=>{console.log("[CDCaseLoadingService] Environment map loaded successfully"),this.materialsService.setupEnvironmentMap(t,n,p),_()},p=>{if(p.total>0){let b=Math.round(p.loaded/p.total*100);console.log(`[CDCaseLoadingService] Environment map loading: ${b}%`)}},p=>{console.error("[CDCaseLoadingService] Error loading environment map:",p),m(p)})}).catch(_=>(console.warn("[CDCaseLoadingService] Continuing without environment map:",_),null));u.push(a);let h=(yield Promise.all(u))[0];if(!h)throw new Error("Failed to load 3D model");console.log("[CDCaseLoadingService] Loaded animations:",h.animations),this.logBones(h.scene);let f=e.cdCases.map(_=>{let m=h.scene.clone(!0);m.scale.set(.7,.7,.7);let p=this.POSITION_STATES.getInactivePosition(new w(e.caseSettings.basePosition.x,e.caseSettings.basePosition.y,e.caseSettings.basePosition.z),_.id,e.caseSettings.stackOffset);m.position.copy(p);let b=new Yt(e.caseSettings.baseRotation.x,e.caseSettings.baseRotation.y,e.caseSettings.baseRotation.z);m.rotation.copy(b);let M=null;m.traverse(A=>{A.name==="Armature"&&(M=A)});let y=new Xo(m),T=h.animations.map(A=>A.clone());this.materialsService.setupMaterials(m,e.caseSettings);let P={id:_.id,title:_.title||`CD Case ${_.id}`,artist:_.artist||"Unknown Artist",imageUrl:"",model:m,isFlipped:!1,position:new w(p.x,p.y,p.z),rotation:new Yt(b.x,b.y,b.z),mixer:y,animations:h.animations,openAction:void 0,closeAction:void 0,armature:M,isOpen:!1,glowMaterial:void 0,carouselIndex:_.id-1,targetPosition:new w(p.x,p.y,p.z),isActive:!1,isDeactivating:!1,currentLerpAlpha:0,initialPosition:new w(p.x,p.y,p.z)};return this.animationsService.setupAnimation(P),t.add(m),P}),g=yield Promise.all(f);return l.push(...g),l}catch(d){throw console.error("Error loading model:",d),d}})}logBones(e){e.traverse(t=>{t.type==="Bone"&&console.log("Found bone:",{name:t.name,type:t.type,position:t.position,rotation:t.rotation,parent:t.parent?.name})})}};Hr.\u0275fac=function(t){return new(t||Hr)(Be(mn),Be(dc))},Hr.\u0275prov=ze({token:Hr,factory:Hr.\u0275fac,providedIn:"root"});var hc=Hr;var zr=class zr{constructor(e,t,n){this.animationsService=e;this.effectsService=t;this.loadingService=n;this.clock=new on;this.ANIMATION_DURATION=1;this.MOVEMENTS={OPEN_LID:"Open Lid.001",CLOSE_LID:"Close Lid"};this.ANIMATION_CONFIG={duration:1,easing:e=>e<.5?4*e*e*e:1-Math.pow(-2*e+2,3)/2};this.POSITION_STATES={getInactivePosition:(e,t,n)=>new w(e.x,e.y+t*n,e.z),getActivePosition:(e,t)=>e.clone().add(t)}}loadModels(e,t,n){return rn(this,null,function*(){return this.loadingService.loadModels(e,t,n)})}logBones(e){e.traverse(t=>{t.type==="Bone"&&console.log("Found bone:",{name:t.name,type:t.type,position:t.position,rotation:t.rotation,parent:t.parent?.name})})}setupEnvironmentMap(e,t,n){let i=new si(t),r={uniforms:{tDiffuse:{value:n},tintColor:{value:new de(1.1,.9,.9)},tintIntensity:{value:.3}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D tDiffuse;
        uniform vec3 tintColor;
        uniform float tintIntensity;
        varying vec2 vUv;
        
        void main() {
          vec4 texel = texture2D(tDiffuse, vUv);
          vec3 tinted = mix(texel.rgb, texel.rgb * tintColor, tintIntensity);
          gl_FragColor = vec4(tinted, texel.a);
        }
      `},o=new yi,l=new qn(-1,1,1,-1,0,1),u=new Rt(r),d=new zt(2,2),a=new Ue(d,u);o.add(a);let c=new un(n.image.width,n.image.height,{format:Zt,type:an});t.setRenderTarget(c),t.render(o,l),t.setRenderTarget(null);let h=c.texture;h.colorSpace=Je,t.toneMapping=Ki,t.toneMappingExposure=.5;let f=i.fromEquirectangular(h).texture;f.mapping=Ji,e.environment=f,n.dispose(),h.dispose(),c.dispose(),u.dispose(),d.dispose(),i.dispose()}setupMaterials(e,t){e.traverse(n=>{n instanceof Ue&&n.name==="CD"&&Array.isArray(n.material)&&(n.material=n.material.map((i,r)=>{let o=t.materials.cd[r],l=i.clone();return Object.assign(l,{metalness:Math.min(o.metalness,.6),roughness:Math.max(o.roughness,.4),envMapIntensity:Math.min(o.envMapIntensity*.5,1),transparent:!1,depthWrite:!0,depthTest:!0,side:Vt}),"clearcoat"in l&&o.clearcoat!==void 0&&(l.clearcoat=Math.min(o.clearcoat*.7,.7),l.clearcoatRoughness=Math.max(o.clearcoatRoughness,.3)),l.needsUpdate=!0,l}))})}setupAnimation(e){if(!e.mixer||!e.animations){console.warn("No mixer or animations available for case:",e.id);return}let t=e.animations.find(i=>i.name===this.MOVEMENTS.OPEN_LID),n=e.animations.find(i=>i.name===this.MOVEMENTS.CLOSE_LID);if(t&&n){let i=e.mixer.clipAction(t);i.setLoop(er,1),i.clampWhenFinished=!0,i.timeScale=1;let r=e.mixer.clipAction(n);r.setLoop(er,1),r.clampWhenFinished=!0,r.timeScale=1,e.openAction=i,e.closeAction=r,r.play(),r.paused=!0,r.time=n.duration}}updateAnimations(e){this.animationsService.updateAnimations(e)}createGlowEffect(e){return new Ot({color:65280,transparent:!0,opacity:.5,blending:Tr})}updateGlowEffect(e){e.glowMaterial||(e.glowMaterial=this.createGlowEffect(e.model)),e.model.traverse(t=>{t instanceof Ue&&t.name==="CD"&&(e.isOpen?(t.userData.originalMaterials||(t.userData.originalMaterials=Array.isArray(t.material)?t.material.map(n=>n.clone()):[t.material.clone()]),t.material=e.glowMaterial):t.userData.originalMaterials&&(t.material=t.userData.originalMaterials))})}flipCase(e){if(console.log("Attempting to flip case:",e.id,{hasOpenAction:!!e.openAction,hasCloseAction:!!e.closeAction,currentState:e.isOpen?"Open":"Closed"}),!e.openAction||!e.closeAction){console.warn("No animations found for case:",e.id);return}e.isOpen=!e.isOpen,console.log("Case state toggled to:",e.isOpen?"Open":"Closed"),this.animationsService.queueAnimation(e,e.isOpen?"open":"close",()=>{this.effectsService.updateGlowEffect(e)})}checkCollisions(e,t){}};zr.\u0275fac=function(t){return new(t||zr)(Be(mn),Be(ac),Be(hc))},zr.\u0275prov=ze({token:zr,factory:zr.\u0275fac,providedIn:"root"});var nr=zr;var vp={type:"change"},Od={type:"start"},xp={type:"end"},fc=new Qn,yp=new In,Uy=Math.cos(70*na.DEG2RAD),Ft=new w,gn=2*Math.PI,dt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Dd=1e-6,pc=class extends jo{constructor(e,t=null){super(e,t),this.state=dt.NONE,this.target=new w,this.cursor=new w,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Dn.ROTATE,MIDDLE:Dn.DOLLY,RIGHT:Dn.PAN},this.touches={ONE:$i.ROTATE,TWO:$i.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new w,this._lastQuaternion=new ft,this._lastTargetPosition=new w,this._quat=new ft().setFromUnitVectors(e.up,new w(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ks,this._sphericalDelta=new ks,this._scale=1,this._panOffset=new w,this._rotateStart=new Se,this._rotateEnd=new Se,this._rotateDelta=new Se,this._panStart=new Se,this._panEnd=new Se,this._panDelta=new Se,this._dollyStart=new Se,this._dollyEnd=new Se,this._dollyDelta=new Se,this._dollyDirection=new w,this._mouse=new Se,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=Hy.bind(this),this._onPointerDown=By.bind(this),this._onPointerUp=zy.bind(this),this._onContextMenu=jy.bind(this),this._onMouseWheel=Wy.bind(this),this._onKeyDown=Xy.bind(this),this._onTouchStart=Yy.bind(this),this._onTouchMove=qy.bind(this),this._onMouseDown=Vy.bind(this),this._onMouseMove=Gy.bind(this),this._interceptControlDown=Zy.bind(this),this._interceptControlUp=$y.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(vp),this.update(),this.state=dt.NONE}update(e=null){let t=this.object.position;Ft.copy(t).sub(this.target),Ft.applyQuaternion(this._quat),this._spherical.setFromVector3(Ft),this.autoRotate&&this.state===dt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,i=this.maxAzimuthAngle;isFinite(n)&&isFinite(i)&&(n<-Math.PI?n+=gn:n>Math.PI&&(n-=gn),i<-Math.PI?i+=gn:i>Math.PI&&(i-=gn),n<=i?this._spherical.theta=Math.max(n,Math.min(i,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+i)/2?Math.max(n,this._spherical.theta):Math.min(i,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{let o=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=o!=this._spherical.radius}if(Ft.setFromSpherical(this._spherical),Ft.applyQuaternion(this._quatInverse),t.copy(this.target).add(Ft),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let o=null;if(this.object.isPerspectiveCamera){let l=Ft.length();o=this._clampDistance(l*this._scale);let u=l-o;this.object.position.addScaledVector(this._dollyDirection,u),this.object.updateMatrixWorld(),r=!!u}else if(this.object.isOrthographicCamera){let l=new w(this._mouse.x,this._mouse.y,0);l.unproject(this.object);let u=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=u!==this.object.zoom;let d=new w(this._mouse.x,this._mouse.y,0);d.unproject(this.object),this.object.position.sub(d).add(l),this.object.updateMatrixWorld(),o=Ft.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;o!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(o).add(this.object.position):(fc.origin.copy(this.object.position),fc.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(fc.direction))<Uy?this.object.lookAt(this.target):(yp.setFromNormalAndCoplanarPoint(this.object.up,this.target),fc.intersectPlane(yp,this.target))))}else if(this.object.isOrthographicCamera){let o=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),o!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Dd||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Dd||this._lastTargetPosition.distanceToSquared(this.target)>Dd?(this.dispatchEvent(vp),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?gn/60*this.autoRotateSpeed*e:gn/60/60*this.autoRotateSpeed}_getZoomScale(e){let t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){Ft.setFromMatrixColumn(t,0),Ft.multiplyScalar(-e),this._panOffset.add(Ft)}_panUp(e,t){this.screenSpacePanning===!0?Ft.setFromMatrixColumn(t,1):(Ft.setFromMatrixColumn(t,0),Ft.crossVectors(this.object.up,Ft)),Ft.multiplyScalar(e),this._panOffset.add(Ft)}_pan(e,t){let n=this.domElement;if(this.object.isPerspectiveCamera){let i=this.object.position;Ft.copy(i).sub(this.target);let r=Ft.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;let n=this.domElement.getBoundingClientRect(),i=e-n.left,r=t-n.top,o=n.width,l=n.height;this._mouse.x=i/o*2-1,this._mouse.y=-(r/l)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(gn*this._rotateDelta.x/t.clientHeight),this._rotateUp(gn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-gn*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._rotateStart.set(n,i)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panStart.set(n,i)}}_handleTouchStartDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{let n=this._getSecondPointerPosition(e),i=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(i,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);let t=this.domElement;this._rotateLeft(gn*this._rotateDelta.x/t.clientHeight),this._rotateUp(gn*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{let t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),i=.5*(e.pageY+t.y);this._panEnd.set(n,i)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){let t=this._getSecondPointerPosition(e),n=e.pageX-t.x,i=e.pageY-t.y,r=Math.sqrt(n*n+i*i);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);let o=(e.pageX+t.x)*.5,l=(e.pageY+t.y)*.5;this._updateZoomParameters(o,l)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Se,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){let t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){let t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}};function By(s){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(s.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(s)&&(this._addPointer(s),s.pointerType==="touch"?this._onTouchStart(s):this._onMouseDown(s)))}function Hy(s){this.enabled!==!1&&(s.pointerType==="touch"?this._onTouchMove(s):this._onMouseMove(s))}function zy(s){switch(this._removePointer(s),this._pointers.length){case 0:this.domElement.releasePointerCapture(s.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(xp),this.state=dt.NONE;break;case 1:let e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function Vy(s){let e;switch(s.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Dn.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(s),this.state=dt.DOLLY;break;case Dn.ROTATE:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=dt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=dt.ROTATE}break;case Dn.PAN:if(s.ctrlKey||s.metaKey||s.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(s),this.state=dt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(s),this.state=dt.PAN}break;default:this.state=dt.NONE}this.state!==dt.NONE&&this.dispatchEvent(Od)}function Gy(s){switch(this.state){case dt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(s);break;case dt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(s);break;case dt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(s);break}}function Wy(s){this.enabled===!1||this.enableZoom===!1||this.state!==dt.NONE||(s.preventDefault(),this.dispatchEvent(Od),this._handleMouseWheel(this._customWheelEvent(s)),this.dispatchEvent(xp))}function Xy(s){this.enabled!==!1&&this._handleKeyDown(s)}function Yy(s){switch(this._trackPointer(s),this._pointers.length){case 1:switch(this.touches.ONE){case $i.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(s),this.state=dt.TOUCH_ROTATE;break;case $i.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(s),this.state=dt.TOUCH_PAN;break;default:this.state=dt.NONE}break;case 2:switch(this.touches.TWO){case $i.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(s),this.state=dt.TOUCH_DOLLY_PAN;break;case $i.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(s),this.state=dt.TOUCH_DOLLY_ROTATE;break;default:this.state=dt.NONE}break;default:this.state=dt.NONE}this.state!==dt.NONE&&this.dispatchEvent(Od)}function qy(s){switch(this._trackPointer(s),this.state){case dt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(s),this.update();break;case dt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(s),this.update();break;case dt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(s),this.update();break;case dt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(s),this.update();break;default:this.state=dt.NONE}}function jy(s){this.enabled!==!1&&s.preventDefault()}function Zy(s){s.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function $y(s){s.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}var mc=class extends wt{constructor(e=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=e,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new Se(.5,.5),this.addEventListener("removed",function(){this.traverse(function(t){t.element instanceof t.element.ownerDocument.defaultView.Element&&t.element.parentNode!==null&&t.element.remove()})})}copy(e,t){return super.copy(e,t),this.element=e.element.cloneNode(!0),this.center=e.center,this}},Zs=new w,bp=new ke,Mp=new ke,Sp=new w,Ep=new w,gc=class{constructor(e={}){let t=this,n,i,r,o,l={objects:new WeakMap},u=e.element!==void 0?e.element:document.createElement("div");u.style.overflow="hidden",this.domElement=u,this.getSize=function(){return{width:n,height:i}},this.render=function(g,_){g.matrixWorldAutoUpdate===!0&&g.updateMatrixWorld(),_.parent===null&&_.matrixWorldAutoUpdate===!0&&_.updateMatrixWorld(),bp.copy(_.matrixWorldInverse),Mp.multiplyMatrices(_.projectionMatrix,bp),a(g,g,_),f(g)},this.setSize=function(g,_){n=g,i=_,r=n/2,o=i/2,u.style.width=g+"px",u.style.height=_+"px"};function d(g){g.isCSS2DObject&&(g.element.style.display="none");for(let _=0,m=g.children.length;_<m;_++)d(g.children[_])}function a(g,_,m){if(g.visible===!1){d(g);return}if(g.isCSS2DObject){Zs.setFromMatrixPosition(g.matrixWorld),Zs.applyMatrix4(Mp);let p=Zs.z>=-1&&Zs.z<=1&&g.layers.test(m.layers)===!0,b=g.element;b.style.display=p===!0?"":"none",p===!0&&(g.onBeforeRender(t,_,m),b.style.transform="translate("+-100*g.center.x+"%,"+-100*g.center.y+"%)translate("+(Zs.x*r+r)+"px,"+(-Zs.y*o+o)+"px)",b.parentNode!==u&&u.appendChild(b),g.onAfterRender(t,_,m));let M={distanceToCameraSquared:c(m,g)};l.objects.set(g,M)}for(let p=0,b=g.children.length;p<b;p++)a(g.children[p],_,m)}function c(g,_){return Sp.setFromMatrixPosition(g.matrixWorld),Ep.setFromMatrixPosition(_.matrixWorld),Sp.distanceToSquared(Ep)}function h(g){let _=[];return g.traverseVisible(function(m){m.isCSS2DObject&&_.push(m)}),_}function f(g){let _=h(g).sort(function(p,b){if(p.renderOrder!==b.renderOrder)return b.renderOrder-p.renderOrder;let M=l.objects.get(p).distanceToCameraSquared,y=l.objects.get(b).distanceToCameraSquared;return M-y}),m=_.length;for(let p=0,b=_.length;p<b;p++)_[p].element.style.zIndex=m-p}}};var Cp=`
// Calculate magical ley lines energy paths
float leyLines(vec2 uv, float density, float speed) {
  float result = 0.0;
  
  // Create a smaller number of flowing energy paths that are more parallel
  for (int i = 0; i < 3; i++) { // Reduced from 5 to 3 lines
    float lineIndex = float(i);
    float verticalOffset = 0.25 + 0.25 * lineIndex; // More even vertical distribution (parallel lines)
    
    // Use sin/cos waves to create flowing curves
    float flowSpeed = time * (0.08 + lineIndex * 0.01) * speed;
    
    // Create smoother, gentler curves
    float curve = sin(uv.x * 2.0 + flowSpeed) * 0.05; // Reduced amplitude for subtle movement
    
    // Add subtle wave variation
    curve += sin(uv.x * 5.0 - flowSpeed * 0.3) * 0.02;
    
    // Calculate distance to the curve with MUCH wider lines
    float dist = abs(uv.y - verticalOffset - curve) / (density * 0.004); // Doubled from 0.002 to 0.004
    
    // Dramatically increase base thickness
    float baseThickness = 4.0; // Increased from 1.5 to 4.0 for much thicker lines
    dist = dist / baseThickness;
    
    // Create a subtle pulsing effect
    float pulse = 0.8 + 0.2 * sin(time * 0.2 + lineIndex);
    
    // Intensity falloff with distance from line - much gentler falloff for very thick appearance
    float intensity = 0.02 / (dist + 0.02); // Increased denominator from 0.01 to 0.02 for wider falloff
    intensity *= pulse;
    
    // Apply fade based on horizontal position
    float xFade = smoothstep(0.0, 0.2, uv.x) * smoothstep(1.0, 0.8, uv.x);
    intensity *= xFade;
    
    // Create larger flowing energy particles along the path
    float particleEffect = 0.0;
    for (int j = 0; j < 5; j++) {
      float particleOffset = float(j) / 5.0;
      float particlePhase = fract(flowSpeed + particleOffset);
      
      // Calculate particle position along the curve
      vec2 particleCenter = vec2(
        particlePhase,
        verticalOffset + curve * sin(particlePhase * 3.14)
      );
      
      // Distance to particle
      float distToParticle = length(uv - particleCenter);
      
      // Create much larger particles
      float particleSize = 0.025 + 0.008 * sin(particlePhase * 6.28); // Increased from 0.015 to 0.025
      float particle = smoothstep(particleSize, 0.0, distToParticle);
      
      particleEffect += particle * 0.5; // Reduced intensity
    }
    
    // Create a wider ethereal glow around the path
    float glow = 0.02 / (dist + 0.08); // Increased from 0.05 to 0.08 for wider glow
    glow *= pulse * smoothstep(0.7, 0.0, dist); // Increased smoothstep range from 0.5 to 0.7
    
    // Combine effects with reduced intensity
    float lineEffect = (intensity * 0.6 + glow * 0.4 + particleEffect * 0.4) * 0.6;
    
    result += lineEffect * (0.5 + 0.2 * sin(lineIndex + time * 0.1));
  }
  
  // Limit the overall brightness and reduce visibility
  return min(result, 1.0) * 0.4; // Reduced from 0.5 to 0.4 for less visibility
}
`,Oi={enabled:!0,intensity:.4,speed:.6,density:35,color:"#a0c8ff"},_c=class{constructor(e){this.config=Ct(Ct({},Oi),e)}getConfig(){return Ct({},this.config)}updateConfig(e){this.config=Ct(Ct({},this.config),e)}toggle(e){this.config.enabled=e!==void 0?e:!this.config.enabled}toShaderUniforms(){let e=this.hexToRgb(this.config.color);return{enableLeyLines:{value:this.config.enabled?1:0},leyLinesIntensity:{value:this.config.intensity},leyLinesSpeed:{value:this.config.speed},leyLinesDensity:{value:this.config.density},leyLinesColor:{value:[e.r/255,e.g/255,e.b/255]}}}hexToRgb(e){e=e.replace(/^#/,"");let t=parseInt(e,16),n=t>>16&255,i=t>>8&255,r=t&255;return{r:n,g:i,b:r}}};var wp=`
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`,Tp=`
  uniform float time;
  uniform vec2 resolution;
  uniform vec3 primaryGold;
  uniform vec3 secondaryGold;
  uniform vec3 accentColor;
  uniform vec3 deepColor;
  uniform vec3 highlightColor;
  uniform sampler2D videoTexture;
  
  // Effect toggle uniforms
  uniform float enableContinents;
  uniform float enableMountains;
  uniform float enableWaves;
  uniform float enableBorders;
  uniform float enableSwirls;
  uniform float enableLightRays;
  uniform float enableParticles;
  uniform float enableVideoInfluence;
  uniform float enableBloom;
  uniform float enableFilmGrain;
  uniform float enableVignette;
  
  // \u3010\u2713\u3011 New ley lines effect uniforms
  uniform float leyLinesIntensity;
  uniform float leyLinesSpeed;
  uniform float leyLinesDensity;
  uniform vec3 leyLinesColor;
  
  varying vec2 vUv;

  // Ocean colors - different shades of blue and white for highlights
  const vec3 deepOceanColor = vec3(0.0, 0.01, 0.04); // Even darker deep blue
  const vec3 midOceanColor = vec3(0.0, 0.05, 0.15);  // Darker medium blue
  const vec3 shallowOceanColor = vec3(0.03, 0.09, 0.2); // Darker light blue
  const vec3 waveHighlightColor = vec3(0.5, 0.7, 0.9); // More intense blue-tinted white
  const vec3 foamColor = vec3(1.0, 1.0, 1.0);        // Pure white for foam
  const vec3 specularHighlight = vec3(0.9, 0.95, 1.0); // Bright specular highlight for water reflection

  // Hash function for pseudo-random values
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
  }
  
  // Improved noise function for organic patterns
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f); // Smooth interpolation
    
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
  }
  
  // Fractal Brownian Motion for richer texture
  float fbm(vec2 p) {
    float sum = 0.0;
    float amp = 0.5;
    float freq = 1.0;
    
    for(int i = 0; i < 6; i++) {
      sum += noise(p * freq) * amp;
      amp *= 0.5;
      freq *= 2.0;
    }
    
    return sum;
  }
  
  // Domain warping for more interesting patterns
  vec2 warp(vec2 p) {
      float d1 = fbm(p + time * 0.1);
      float d2 = fbm(p - time * 0.15);
      return p + vec2(d1, d2) * 0.3;
  }
  
  // Enhanced domain warping for continent-like shapes
  vec2 continentWarp(vec2 p) {
      // Multiple layers of warping for more natural, organic terrain shapes
      vec2 q = vec2(
          fbm(p + vec2(0.0, 0.1) + time * 0.05),
          fbm(p + vec2(0.2, 0.3) - time * 0.03)
      );
      
      vec2 r = vec2(
          fbm(p + 2.0 * q + vec2(1.7, 9.2) + time * 0.02),
          fbm(p + 2.0 * q + vec2(8.3, 2.8) - time * 0.01)
      );
      
      // Final warped coordinates
      return p + 0.5 * r;
  }
  
  // Height map for terrain elevation
  float terrainHeight(vec2 p) {
      vec2 warped = continentWarp(p * 0.5);
      float height = fbm(warped * 2.0);
      
      // Add ridges for mountain ranges
      float ridges = 1.0 - abs(0.5 - fbm(warped * 4.0)) * 2.0;
      ridges = ridges * ridges * 0.7;
      
      // Combine for final height map
      return smoothstep(0.2, 0.75, height) + ridges * 0.3;
  }
  
  // Create fantasy continent shapes
  float continentShape(vec2 uv) {
      // Scale to create larger continent forms
      vec2 scaled = uv * 1.5;
      
      // Create main landmass shape
      float terrain = terrainHeight(scaled);
      
      // Erode the edges for coastlines
      float coast = smoothstep(0.4, 0.45, terrain);
      
      // Add inner terrain details
      float details = fbm(continentWarp(scaled * 3.0)) * coast;
      
      return coast + details * 0.2;
  }
  
  // Enhanced wave pattern for more realistic ocean waves
  float wavePattern(vec2 uv, float scale, float speed) {
    // Reduce the speed for slower wave movement
    float adjustedSpeed = speed * 0.4; // 40% slower
    float t = time * adjustedSpeed;
    
    // Use domain warping for more organic wave shapes - emphasize horizontal warping for ocean waves
    vec2 warpedUV = warp(uv);
    warpedUV.x += sin(warpedUV.y * 2.5) * 0.03; // Add horizontal displacement based on vertical position
    
    // Create smaller, more natural wave patterns
    float wavePattern = 0.0;
    
    // Create directional waves that move primarily in one direction (like ocean swells)
    float directionalWaves = 0.0;
    for (int i = 0; i < 3; i++) {
      float waveHeight = 0.02 + 0.01 * float(i);
      float waveFreq = 10.0 + float(i) * 5.0;
      float waveSpeed = t * (0.1 + 0.05 * float(i));
      
      // Create horizontal wave lines with subtle variations
      float wave = sin(warpedUV.y * waveFreq + waveSpeed + sin(warpedUV.x * 2.0) * 0.8);
      directionalWaves += smoothstep(0.7, 0.99, wave) * waveHeight;
    }
    
    // Add subtle cross currents (smaller perpendicular waves)
    float crossCurrents = 0.0;
    for (int i = 0; i < 2; i++) {
      float waveHeight = 0.01 + 0.005 * float(i);
      float waveFreq = 8.0 + float(i) * 4.0;
      float waveSpeed = t * (0.05 + 0.03 * float(i));
      
      // Create vertical wave lines with subtle variations
      float wave = sin(warpedUV.x * waveFreq + waveSpeed + sin(warpedUV.y * 1.5) * 0.5);
      crossCurrents += smoothstep(0.8, 0.99, wave) * waveHeight;
    }
    
    // Create focused wave crests between continent areas
    // Use detection of nearby continent edges to amplify wave intensity
    float continentProximity = fbm(warpedUV * 1.5) * 0.2; // Low-frequency noise for general ocean areas
    
    // Create elongated waves that follow contours between continents
    float elongatedWaves = 0.0;
    for (int i = 0; i < 4; i++) {
      float yOffset = float(i) * 0.2;
      float xOffset = sin(time * 0.03 + yOffset * 3.0) * 0.1;
      
      // Create thin, elongated horizontal wave lines (whitecaps)
      float waveSize = 0.003 + 0.002 * sin(time * 0.1 + float(i));
      float waveLine = smoothstep(waveSize, 0.0, abs(fract(warpedUV.y * 2.0 + yOffset + time * 0.03) - 0.5));
      
      // Distort the wave line based on horizontal position
      waveLine *= 0.7 + 0.3 * sin(warpedUV.x * 8.0 + time * 0.02);
      
      elongatedWaves += waveLine * 0.15;
    }
    
    // Add some detailed ripples and small waves
    float ripples = 0.0;
    for (int i = 0; i < 3; i++) {
      vec2 rippleCenter = vec2(
        0.5 + 0.3 * sin(time * 0.01 + float(i)),
        0.5 + 0.3 * cos(time * 0.015 + float(i) * 1.5)
      );
      
      float dist = length(warpedUV - rippleCenter);
      float ripplePattern = sin(dist * (20.0 + float(i) * 5.0) - time * 0.1);
      
      // Fade out ripples with distance from center
      ripples += smoothstep(0.0, 0.7, ripplePattern) * smoothstep(0.5, 0.1, dist) * 0.1;
    }
    
    // Add subtle noise detail for water surface texture
    float surfaceDetail = fbm(warpedUV * 10.0 + vec2(t * 0.1, 0.0)) * 0.03;
    
    // Create specific foam for wave crests
    float foam = 0.0;
    for (int i = 0; i < 4; i++) { // Added one more foam line
      // Create horizontal wave lines that move slowly
      float yPos = 0.2 + float(i) * 0.25;
      float xOffset = sin(time * 0.04 + yPos * 2.0) * 0.1;
      
      // Create thin foam lines with varying width
      float foamWidth = 0.002 + 0.001 * sin(time * 0.07 + float(i));
      float foamLine = smoothstep(foamWidth, 0.0, abs(fract(warpedUV.y * 1.5 + yPos + time * 0.02) - 0.5));
      
      // Add curvature and variation to foam lines
      foamLine *= 0.8 + 0.2 * sin(warpedUV.x * 10.0 + time * 0.05 + float(i));
      
      foam += foamLine * 0.25; // Increased foam intensity
    }
    
    // Add specular highlights (water reflections)
    float specular = 0.0;
    for (int i = 0; i < 3; i++) {
      // Create moving light reflections on water surface
      vec2 specCenter = vec2(
        0.3 + 0.4 * sin(time * 0.03 + float(i) * 2.1),
        0.4 + 0.3 * cos(time * 0.04 + float(i) * 1.7)
      );
      
      float specDist = length(warpedUV - specCenter);
      
      // Create sharp, directional highlights
      float specStrength = 0.008 + 0.004 * sin(time * 0.2 + float(i));
      float specShape = smoothstep(specStrength, 0.0, specDist - 0.1 * sin(time * 0.1 + warpedUV.x * 5.0));
      
      // Add directional stretching to simulate light reflection on waves
      specShape *= smoothstep(0.1, 0.0, abs(sin(warpedUV.y * 20.0 + time * 0.5) - 0.5));
      
      specular += specShape * 0.15;
    }
    
    // Combine all patterns with different weights
    float finalPattern = 
      directionalWaves * 0.4 +
      crossCurrents * 0.15 +
      elongatedWaves * 0.7 +
      ripples * 0.3 +
      surfaceDetail +
      foam * 1.1 + // Enhance foam prominence
      specular * 1.5; // Add strong specular highlights
    
    // Normalize to keep values in expected range
    return clamp(finalPattern, 0.0, 1.0);
  }
  
  // Calculate ley lines energy paths
  // \u3010\u2713\u3011 Original implementation replaced with imported one from ley-lines.effect.ts
  ${Cp}
  
  // Create soft gradient swirls
  float swirl(vec2 uv, vec2 center, float radius, float intensity) {
    vec2 toCenter = uv - center;
    float dist = length(toCenter);
    
    // Enhanced angular distortion with multiple frequencies
    float angle = atan(toCenter.y, toCenter.x);
    float timeFactor = time * 0.15;
    
    // Create a more complex swirl pattern with multiple layers
    float twist = dist * intensity;
    float timeVariation = sin(timeFactor) * 0.5 + 0.5;
    
    // Dynamic swirl pattern with rotating core
    float swirl1 = sin(angle * 4.0 + twist + timeFactor);
    float swirl2 = cos(angle * 3.0 - twist * 1.5 + timeFactor * 0.7);
    float swirl3 = sin(angle * 7.0 + twist * 0.8 - timeFactor * 1.2);
    
    // Combine swirl layers with different weights
    float combinedSwirl = swirl1 * 0.5 + swirl2 * 0.3 + swirl3 * 0.2;
    
    // Enhanced radial gradient with soft edges
    float fade = 1.0 - smoothstep(radius * 0.7, radius * 1.1, dist);
    float innerGlow = smoothstep(0.0, radius * 0.3, dist) * fade;
    
    // Add subtle pulsing effect
    float pulse = 0.85 + 0.15 * sin(time * 0.3 + dist * 5.0);
    
    return innerGlow * (0.6 + 0.4 * combinedSwirl) * pulse;
  }
  
  // Create floating particles effect
  float particles(vec2 uv) {
    float result = 0.0;
    
    // Create multiple particle layers
    for (int i = 0; i < 3; i++) {
      float speed = 0.1 + float(i) * 0.05;
      float scale = 100.0 + float(i) * 50.0;
      float timeOffset = time * speed + float(i) * 10.0;
      
      // Create particle grid and animate
      vec2 gridUV = uv * scale;
      vec2 gridPos = floor(gridUV);
      
      // Unique random properties for each particle
      float random = hash(gridPos);
      float size = 0.3 + 0.7 * hash(gridPos + 1.2);
      float particleTime = timeOffset * (0.5 + 0.5 * random);
      
      // Particle movement path
      vec2 center = gridPos + 0.5;
      center.x += 0.3 * sin(particleTime * 0.7 + random * 6.28);
      center.y += 0.3 * cos(particleTime * 0.5 + random * 6.28);
      
      // Particle glow
      float dist = length(gridUV - center);
      float glow = size * 0.5 * (0.1 / (dist + 0.01));
      
      // Fade particles in and out
      float fade = 0.5 + 0.5 * sin(particleTime);
      glow *= fade;
      
      result += glow;
    }
    
    return smoothstep(0.0, 1.0, result * 0.25); // Normalize and smooth
  }
  
  // Sample video with blur and offset
  vec4 sampleVideoBlurred(vec2 uv, float blurAmount, vec2 offset) {
    // Apply offset and scaling to create interesting sampling area
    vec2 videoUV = uv * 0.8 + 0.1 + offset;
    
    // Multi-sample blur
    vec4 blurredColor = vec4(0.0);
    float total = 0.0;
    
    // 9-tap gaussian-like blur
    for(float x = -2.0; x <= 2.0; x += 1.0) {
      for(float y = -2.0; y <= 2.0; y += 1.0) {
        float weight = 1.0 - length(vec2(x, y)) / 3.0;
        if(weight > 0.0) {
          vec2 sampleUV = videoUV + vec2(x, y) * blurAmount / resolution;
          blurredColor += texture2D(videoTexture, sampleUV) * weight;
          total += weight;
        }
      }
    }
    
    return blurredColor / total;
  }

  void main() {
    // Base coordinates
    vec2 uv = vUv;
    
    // Sample video for reactive elements
    vec4 blurredVideo1 = sampleVideoBlurred(uv, 0.1, vec2(sin(time * 0.2) * 0.05, cos(time * 0.15) * 0.05));
    vec4 blurredVideo2 = sampleVideoBlurred(uv + 0.2, 0.15, vec2(cos(time * 0.15) * 0.05, sin(time * 0.25) * 0.05));
    
    // Extract luminance and motion from video
    float vidLuma1 = dot(blurredVideo1.rgb, vec3(0.2126, 0.7152, 0.0722));
    float vidLuma2 = dot(blurredVideo2.rgb, vec3(0.2126, 0.7152, 0.0722));
    float videoMotion = abs(vidLuma1 - vidLuma2) * 3.0; // Motion detection
    
    // Generate continent shapes with toggle
    float continent = enableContinents > 0.5 ? continentShape(uv) : 0.0;
    
    // Get distance to nearest continent edge for wave intensity
    float continentEdge = abs(continent - 0.5) * 2.0;
    float distToCoast = 1.0 - smoothstep(0.0, 0.2, continentEdge);
    
    // Create subtle rotating and flowing terrain details
    vec2 rotatedUV = vec2(
      uv.x * cos(time * 0.02) - uv.y * sin(time * 0.02),
      uv.x * sin(time * 0.02) + uv.y * cos(time * 0.02)
    );
    float terrainDetail = fbm(continentWarp(rotatedUV * 5.0));
    
    // Create mountain ridges and terrain variations with toggle
    float mountains = enableMountains > 0.5 ? terrainHeight(uv * 3.0 + time * 0.01) * continent : 0.0;
    
    // Base wave pattern for water/oceans with toggle
    float waveIntensity = 0.03 + 0.1 * videoMotion + 0.15 * distToCoast; // Waves intensify near shores
    float waves = enableWaves > 0.5 ? wavePattern(uv, 3.0, waveIntensity) * (1.0 - continent) : 0.0;
    
    // Extract foam pattern - more pronounced near continent edges
    float foam = waves * distToCoast * 2.0; // Amplify foam near coasts
    
    // Create depth variations in the ocean - deeper areas further from land
    float oceanDepth = smoothstep(0.0, 0.5, 1.0 - distToCoast) * (1.0 - continent);
    
    // Add subtle current patterns in deeper areas
    float deepCurrents = fbm(warp(uv) * 2.0 + time * 0.003) * oceanDepth * 0.5;
    
    // Create subtle "kingdom borders" or territory lines with toggle
    float borders = 0.0;
    if (enableBorders > 0.5) {
      vec2 borderUV = continentWarp(uv * 2.0);
      // Cellular-like patterns for territory divisions
      float cellValue = fract(sin(borderUV.x * 12.0) * 43758.5453 + cos(borderUV.y * 13.0) * 93728.3462);
      float territoryEdge = smoothstep(0.02, 0.0, abs(fract(cellValue * 3.0) - 0.5) - 0.2) * 0.4;
      // Only show borders on land
      borders = territoryEdge * continent;
    }
    
    // Create layered swirls for magical elements with toggle
    float swirlPattern = 0.0;
    if (enableSwirls > 0.5) {
      // More distributed and varied swirl centers
      swirlPattern += swirl(uv, vec2(0.25, 0.35), 0.55, 2.5) * 0.35;
      swirlPattern += swirl(uv, vec2(0.75, 0.65), 0.65, 3.0) * 0.3;
      swirlPattern += swirl(uv, vec2(0.5, 0.15), 0.45, 2.2) * 0.25;
      swirlPattern += swirl(uv, vec2(0.15, 0.8), 0.4, 3.5) * 0.2;
      
      // Add subtle interaction with video motion
      if (enableVideoInfluence > 0.5) {
        swirlPattern *= 1.0 + videoMotion * 0.25;
      }
      
      // Enhance with terrain interaction
      swirlPattern *= 1.0 + terrainDetail * 0.2;
    }
    
    // Add ley line effects with toggle - MODIFIED: Updated to use new implementation
    float leyLineEffect = enableLightRays > 0.5 ? 
      leyLines(
        uv, 
        leyLinesDensity > 0.0 ? leyLinesDensity : 15.0, 
        leyLinesSpeed > 0.0 ? leyLinesSpeed : 0.3
      ) * (leyLinesIntensity > 0.0 ? leyLinesIntensity : 0.7) : 0.0;
    
    // Add subtle particles for magical dust with toggle
    float particleEffect = enableParticles > 0.5 ? particles(uv) * (0.5 + continent * 0.5) : 0.0;
    
    // Soft vignette with toggle
    float vignette = enableVignette > 0.5 ? smoothstep(0.0, 0.7, 1.0 - length((uv - 0.5) * 1.3)) : 1.0;
    
    // Start with deep ocean color
    vec3 baseColor = deepOceanColor;
    
    // Layer visual elements for fantasy map appearance
    // Ocean water with depth variations and waves
    baseColor = mix(deepOceanColor, midOceanColor, oceanDepth);
    
    // Add deep ocean currents
    baseColor = mix(baseColor, midOceanColor * 1.2, deepCurrents);
    
    // Add wave effects to shallow areas
    baseColor = mix(baseColor, shallowOceanColor, waves * 0.6 * (1.0 - oceanDepth));
    
    // Add stronger highlight near shores
    baseColor = mix(baseColor, shallowOceanColor * 1.3, distToCoast * waves * 0.5);
    
    // White foam highlights on wave crests - stronger near shores
    baseColor = mix(baseColor, waveHighlightColor, foam * foam * 1.3); // Enhanced foam
    baseColor = mix(baseColor, foamColor, foam * foam * foam * 1.2); // Enhanced white foam
    
    // Add specular reflections for water surface (moonlight/sunlight reflections)
    float specularReflection = waves * 1.2;
    baseColor = mix(baseColor, specularHighlight, specularReflection * specularReflection * 0.3);
    
    // Land areas
    baseColor = mix(baseColor, mix(secondaryGold, accentColor, terrainDetail), continent * 0.8);
    
    // Mountains and elevated terrain
    baseColor = mix(baseColor, highlightColor * 0.9, mountains * 0.6);
    
    // Kingdom/territory borders
    baseColor = mix(baseColor, highlightColor, borders);
    
    // Magical elements
    baseColor = mix(baseColor, mix(accentColor, highlightColor, 0.6 + 0.4 * sin(time * 0.2)), swirlPattern * 0.4);
    
    // Use custom color for ley lines with a stronger glow effect
    vec3 customLeyLineColor = vec3(0.7, 0.9, 1.0); // Default color
    if (leyLinesColor.r > 0.0 || leyLinesColor.g > 0.0 || leyLinesColor.b > 0.0) {
      customLeyLineColor = leyLinesColor;
    }
    
    // Add a subtle bloom effect to the ley lines
    float leyLineBloom = leyLineEffect * 0.1;
    baseColor = mix(baseColor, customLeyLineColor, leyLineEffect * 0.3);
    baseColor += leyLineBloom * customLeyLineColor * 0.7;
    
    // Add subtle particles for magical dust with toggle
    baseColor = mix(baseColor, vec3(0.9, 0.9, 1.0), particleEffect * 0.4);
    
    // Add subtle video influence for magical shimmer with toggle
    if (enableVideoInfluence > 0.5) {
      vec3 videoColor = blurredVideo1.rgb;
      float videoInfluence = videoMotion * 0.15;
      baseColor = mix(baseColor, videoColor * vec3(1.2, 1.1, 0.8), videoInfluence * continent);
    }
    
    // Add subtle bloom to bright areas with toggle
    if (enableBloom > 0.5) {
      float luminance = dot(baseColor, vec3(0.2126, 0.7152, 0.0722));
      float bloom = smoothstep(0.7, 0.9, luminance);
      baseColor += bloom * highlightColor * 0.3;
      
      // Add enhanced bloom to wave crests and specular reflections
      baseColor += foam * foam * waveHighlightColor * 0.3;
      baseColor += waves * waves * specularHighlight * 0.15; // Add bloom to water reflections
    }
    
    // Apply gentle film grain with toggle
    if (enableFilmGrain > 0.5) {
      float grain = hash(uv + time) * 0.03;
      baseColor = mix(baseColor, vec3(0.0, 0.0, 0.03), grain); // Even darker blue grain for water
    }
    
    // Final vignette
    baseColor *= vignette;
    
    gl_FragColor = vec4(baseColor, 1.0);
  }
`;var Vr=class Vr{constructor(){this.isVideoPlaying=!1;this.clock=new on;this.backgroundShaderMaterial=null;this.effectToggles={continents:!0,mountains:!0,waves:!0,borders:!0,swirls:!0,lightRays:!0,particles:!0,videoInfluence:!0,bloom:!0,filmGrain:!0,vignette:!0};this.leyLinesEffect=new _c}get videoPlaying(){return this.isVideoPlaying}set videoPlaying(e){this.isVideoPlaying=e}setupVideoPlane(e,t){let{videoPlane:n}=t.sceneSettings,{width:i,height:r}=n.size,o=n.rightCrop||0,l;if(o>0&&o<1){let f=i*(1-o);l=new Tt;let g=new Float32Array([-i/2,-r/2,0,-i/2+f,-r/2,0,-i/2+f,r/2,0,-i/2,r/2,0]),_=new Float32Array([0,0,1-o,0,1-o,1,0,1]),m=new Uint16Array([0,1,2,0,2,3]);l.setAttribute("position",new st(g,3)),l.setAttribute("uv",new st(_,2)),l.setIndex(new st(m,1)),l.computeVertexNormals()}else l=new zt(i,r);let u=document.createElement("video");u.src="assets/3d/CD_Case/twitter_crossfade.mp4",u.loop=!0,u.muted=!0,u.playsInline=!0,u.autoplay=!1,u.preload="auto",u.crossOrigin="anonymous",u.addEventListener("loadeddata",()=>console.log("Video loaded data")),u.addEventListener("error",f=>console.error("Video error:",f));let d=new ko(u);d.minFilter=Dt,d.magFilter=Dt,d.colorSpace=Je,d.wrapS=bn,d.wrapT=bn,d.needsUpdate=!0;let a=new Ot({map:d,side:Mn}),c=new Ue(l,a);return c.position.set(n.position.x,n.position.y,n.position.z),c.rotation.set(n.rotation.x,n.rotation.y,n.rotation.z),c.renderOrder=1,e.add(c),{mesh:c,play:()=>(this.isVideoPlaying=!0,u.play().catch(f=>console.warn("Video play failed:",f))),pause:()=>{this.isVideoPlaying=!1,u.pause()},videoTexture:d,updateVideoSource:f=>{if(console.log("Updating video source to:",f),u.src.endsWith(f)){console.log("Video source already set to",f);return}u.paused||u.pause();let g=this.isVideoPlaying,_=()=>{console.log("New video loaded:",f),d.needsUpdate=!0,g&&u.play().catch(m=>console.warn("Video play failed after source update:",m)),u.removeEventListener("loadeddata",_)};u.addEventListener("loadeddata",_),u.src=f,u.load()}}}updateVideoSource(e){}loadHandler(){}setupBackgroundPlane(e,t,n){let{backgroundPlane:i}=t.sceneSettings,r=new zt(i.size.width,i.size.height),o=new de(16111748),l=new de(12558959),u=new de(11038013),d=new de(4534308),a=new de(16774356),c=new Rt({uniforms:{time:{value:0},resolution:{value:new Se(window.innerWidth,window.innerHeight)},primaryGold:{value:new w(o.r,o.g,o.b)},secondaryGold:{value:new w(l.r,l.g,l.b)},accentColor:{value:new w(u.r,u.g,u.b)},deepColor:{value:new w(d.r,d.g,d.b)},highlightColor:{value:new w(a.r,a.g,a.b)},videoTexture:{value:n||null},enableContinents:{value:this.effectToggles.continents?1:0},enableMountains:{value:this.effectToggles.mountains?1:0},enableWaves:{value:this.effectToggles.waves?1:0},enableBorders:{value:this.effectToggles.borders?1:0},enableSwirls:{value:this.effectToggles.swirls?1:0},enableLightRays:{value:this.effectToggles.lightRays?1:0},enableParticles:{value:this.effectToggles.particles?1:0},enableVideoInfluence:{value:this.effectToggles.videoInfluence?1:0},enableBloom:{value:this.effectToggles.bloom?1:0},enableFilmGrain:{value:this.effectToggles.filmGrain?1:0},enableVignette:{value:this.effectToggles.vignette?1:0},leyLinesIntensity:{value:Oi.intensity},leyLinesSpeed:{value:Oi.speed},leyLinesDensity:{value:Oi.density},leyLinesColor:{value:new w(.7,.9,1)}},vertexShader:wp,fragmentShader:Tp,side:jt});this.backgroundShaderMaterial=c;let h=new Ue(r,c);return h.position.set(i.position.x,i.position.y,i.position.z-.01),h.rotation.set(i.rotation.x,i.rotation.y,i.rotation.z),h.renderOrder=0,e.add(h),h}updateBackgroundAnimations(){if(this.backgroundShaderMaterial){let e=this.clock.getElapsedTime();this.backgroundShaderMaterial.uniforms.time.value=e,this.backgroundShaderMaterial.needsUpdate=!0}}updateBackgroundEffects(e){if(!this.backgroundShaderMaterial)return;let t=this.extractSceneSettings(e);this.effectToggles={continents:t.bgEffectContinents,mountains:t.bgEffectMountains,waves:t.bgEffectWaves,borders:t.bgEffectBorders,swirls:t.bgEffectSwirls,lightRays:t.bgEffectLightRays,particles:t.bgEffectParticles,videoInfluence:t.bgEffectVideoInfluence,bloom:t.bgEffectBloom,filmGrain:t.bgEffectFilmGrain,vignette:t.bgEffectVignette},this.leyLinesEffect.updateConfig({enabled:t.bgEffectLightRays,intensity:t.leyLinesIntensity||Oi.intensity,speed:t.leyLinesSpeed||Oi.speed,density:t.leyLinesDensity||Oi.density,color:t.leyLinesColor||Oi.color});let n=this.leyLinesEffect.toShaderUniforms();this.backgroundShaderMaterial&&this.backgroundShaderMaterial.uniforms&&Object.keys(n).forEach(i=>{this.backgroundShaderMaterial&&this.backgroundShaderMaterial.uniforms&&this.backgroundShaderMaterial.uniforms[i]&&(this.backgroundShaderMaterial.uniforms[i].value=n[i].value)}),this.backgroundShaderMaterial&&this.backgroundShaderMaterial.uniforms&&(this.backgroundShaderMaterial.uniforms.enableContinents.value=this.effectToggles.continents?1:0,this.backgroundShaderMaterial.uniforms.enableMountains.value=this.effectToggles.mountains?1:0,this.backgroundShaderMaterial.uniforms.enableWaves.value=this.effectToggles.waves?1:0,this.backgroundShaderMaterial.uniforms.enableBorders.value=this.effectToggles.borders?1:0,this.backgroundShaderMaterial.uniforms.enableSwirls.value=this.effectToggles.swirls?1:0,this.backgroundShaderMaterial.uniforms.enableLightRays.value=this.effectToggles.lightRays?1:0,this.backgroundShaderMaterial.uniforms.enableParticles.value=this.effectToggles.particles?1:0,this.backgroundShaderMaterial.uniforms.enableVideoInfluence.value=this.effectToggles.videoInfluence?1:0,this.backgroundShaderMaterial.uniforms.enableBloom.value=this.effectToggles.bloom?1:0,this.backgroundShaderMaterial.uniforms.enableFilmGrain.value=this.effectToggles.filmGrain?1:0,this.backgroundShaderMaterial.uniforms.enableVignette.value=this.effectToggles.vignette?1:0,this.backgroundShaderMaterial.needsUpdate=!0)}extractSceneSettings(e){return"sceneSettings"in e?{bgEffectContinents:e.sceneSettings.bgEffectContinents!==void 0?e.sceneSettings.bgEffectContinents:this.effectToggles.continents,bgEffectMountains:e.sceneSettings.bgEffectMountains!==void 0?e.sceneSettings.bgEffectMountains:this.effectToggles.mountains,bgEffectWaves:e.sceneSettings.bgEffectWaves!==void 0?e.sceneSettings.bgEffectWaves:this.effectToggles.waves,bgEffectBorders:e.sceneSettings.bgEffectBorders!==void 0?e.sceneSettings.bgEffectBorders:this.effectToggles.borders,bgEffectSwirls:e.sceneSettings.bgEffectSwirls!==void 0?e.sceneSettings.bgEffectSwirls:this.effectToggles.swirls,bgEffectLightRays:e.sceneSettings.bgEffectLightRays!==void 0?e.sceneSettings.bgEffectLightRays:this.effectToggles.lightRays,bgEffectParticles:e.sceneSettings.bgEffectParticles!==void 0?e.sceneSettings.bgEffectParticles:this.effectToggles.particles,bgEffectVideoInfluence:e.sceneSettings.bgEffectVideoInfluence!==void 0?e.sceneSettings.bgEffectVideoInfluence:this.effectToggles.videoInfluence,bgEffectBloom:e.sceneSettings.bgEffectBloom!==void 0?e.sceneSettings.bgEffectBloom:this.effectToggles.bloom,bgEffectFilmGrain:e.sceneSettings.bgEffectFilmGrain!==void 0?e.sceneSettings.bgEffectFilmGrain:this.effectToggles.filmGrain,bgEffectVignette:e.sceneSettings.bgEffectVignette!==void 0?e.sceneSettings.bgEffectVignette:this.effectToggles.vignette,leyLinesIntensity:e.sceneSettings.leyLinesIntensity,leyLinesSpeed:e.sceneSettings.leyLinesSpeed,leyLinesDensity:e.sceneSettings.leyLinesDensity,leyLinesColor:e.sceneSettings.leyLinesColor}:e}};Vr.\u0275fac=function(t){return new(t||Vr)},Vr.\u0275prov=ze({token:Vr,factory:Vr.\u0275fac,providedIn:"root"});var vc=Vr;var Gr=class Gr{constructor(e){this.sceneEffectsService=e;this.FOG_COLOR=0;this.FOG_NEAR=10;this.FOG_FAR=40}setupScene(e){let t=new yi;t.background=null,t.fog=new Ro(0,30,100);let n=new qo(5);return n.setColors(new de(16711680),new de(65280),new de(255)),t.add(n),t}setupCamera(e){let{position:t,lookAt:n}=e.sceneSettings.camera,i=new It(60,window.innerWidth/window.innerHeight,.1,1e3);return i.position.set(t.x,t.y,t.z),i.lookAt(n.x,n.y,n.z),i}setupRenderer(e,t){let n=new sc({canvas:e,alpha:!0,antialias:!0,powerPreference:"high-performance",stencil:!0,depth:!0});return n.setSize(window.innerWidth,window.innerHeight),n.setPixelRatio(Math.min(window.devicePixelRatio,2)),n.outputColorSpace=Je,n.shadowMap.enabled=!0,n.shadowMap.type=Fs,n.toneMapping=Ki,n.toneMappingExposure=t.sceneSettings.renderer.exposure,n.setClearColor(0,0),n}setupControls(e,t,n){let{orbitControls:i}=n.sceneSettings,r=new pc(e,t);r.enableDamping=i.enableDamping,r.dampingFactor=i.dampingFactor,r.minDistance=i.minDistance,r.maxDistance=i.maxDistance,r.minPolarAngle=i.minPolarAngle,r.maxPolarAngle=i.maxPolarAngle;let o=n.sceneSettings.camera.lockControls;return r.enabled=!o,o?(r.enableZoom=!1,r.enablePan=!1,r.enableRotate=!1):(r.enableZoom=i.enableZoom,r.enablePan=i.enablePan,r.enableRotate=!0),r.target.set(n.sceneSettings.camera.lookAt.x,n.sceneSettings.camera.lookAt.y,n.sceneSettings.camera.lookAt.z),r.update(),r}setupLights(e,t){let{lighting:n}=t.sceneSettings,i=new Go(16777215,n.ambient.intensity),r=new Ci(16777215,n.main.intensity);r.position.set(n.main.position.x,n.main.position.y,n.main.position.z),r.castShadow=!0;let o=new Ci(16777215,n.fill.intensity);o.position.set(n.fill.position.x,n.fill.position.y,n.fill.position.z);let l=new Ci(16777215,n.back.intensity);return l.position.set(n.back.position.x,n.back.position.y,n.back.position.z),e.add(i,r,o,l),{ambientLight:i,mainLight:r,fillLight:o,backLight:l}}setupGround(e,t){let{ground:n}=t.sceneSettings,i=new zt(n.size,n.size),r=new br({opacity:n.opacity}),o=new Ue(i,r);return o.rotation.x=-Math.PI/2,o.position.y=n.y,o.receiveShadow=!0,e.add(o),o}createLightLabel(e){let t=document.createElement("div");return t.className="light-label",t.textContent=e,new mc(t)}get videoPlaying(){return this.sceneEffectsService.videoPlaying}set videoPlaying(e){this.sceneEffectsService.videoPlaying=e}setupVideoPlane(e,t){return this.sceneEffectsService.setupVideoPlane(e,t)}setupBackgroundPlane(e,t,n){return this.sceneEffectsService.setupBackgroundPlane(e,t,n)}updateBackgroundAnimations(){this.sceneEffectsService.updateBackgroundAnimations()}updateBackgroundEffects(e){this.sceneEffectsService.updateBackgroundEffects(e)}};Gr.\u0275fac=function(t){return new(t||Gr)(Be(vc))},Gr.\u0275prov=ze({token:Gr,factory:Gr.\u0275fac,providedIn:"root"});var Nn=Gr;var Ap=(s,e,t)=>({id:s,title:e,artist:t,position:Ct({},Ii.caseSettings.basePosition),rotation:Ct({},Ii.caseSettings.baseRotation),materials:Ct({},Ii.caseSettings.materials)});var Rp=Array.from({length:5},(s,e)=>{let t=["Phantasia","Xronixle","Fractalizer","Serenism","Archetype Engine"],n=["An \xD7 Feryquitous","Feryquitous","Voidheart","Team Grimoire","Sound Souler"];return Ap(e+1,t[e],n[e])}),Pp=s=>s.map((e,t)=>ui(Ct({},e),{position:ui(Ct({},e.position),{y:Ii.caseSettings.basePosition.y+t*Ii.caseSettings.stackOffset})}));var Wr=class Wr{constructor(e){this.cdCasesService=e;this.mouseX=0;this.mouseY=0;this.isMouseDown=!1;this.raycaster=new Yo;this.mouse=new Se}handleMouseDown(e,t,n,i){if(e.button!==0)return null;this.isMouseDown=!0;let r=t.getBoundingClientRect();this.mouseX=e.clientX,this.mouseY=e.clientY,this.mouse.x=(e.clientX-r.left)/t.clientWidth*2-1,this.mouse.y=-((e.clientY-r.top)/t.clientHeight)*2+1,this.raycaster.setFromCamera(this.mouse,n);for(let o of i)if(this.raycaster.intersectObject(o.model,!0).length>0)return console.log("CD case clicked:",o.id),o;return null}handleMouseMove(e,t){this.mouseX=e.clientX,this.mouseY=e.clientY}handleMouseUp(){this.isMouseDown=!1}handleContextMenu(e,t,n,i){e.preventDefault();let r=t.getBoundingClientRect();this.mouse.x=(e.clientX-r.left)/r.width*2-1,this.mouse.y=-((e.clientY-r.top)/r.height)*2+1,this.raycaster.setFromCamera(this.mouse,n);for(let o of i){let l=[];if(o.model.traverse(u=>{if(u instanceof Ue){let d=this.raycaster.intersectObject(u);l.push(...d)}}),l.length>0){this.cdCasesService.flipCase(o);break}}}};Wr.\u0275fac=function(t){return new(t||Wr)(Be(nr))},Wr.\u0275prov=ze({token:Wr,factory:Wr.\u0275fac,providedIn:"root"});var $s=Wr;var Xr=class Xr{updateCamera(e,t,n){e.position.set(n.cameraX,n.cameraY,n.cameraZ),t.target.set(n.lookAtX,n.lookAtY,n.lookAtZ),t.update()}updateLighting(e,t,n,i,r,o){e.intensity=o.ambientIntensity,t.intensity=o.mainLightIntensity,n.update(),i.update(),r.update()}updateRenderer(e,t){e.toneMappingExposure=t.exposure}updateOrbitControls(e,t){e.minPolarAngle=t.orbitMinPolarAngle,e.maxPolarAngle=t.orbitMaxPolarAngle,e.minDistance=t.orbitMinDistance,e.maxDistance=t.orbitMaxDistance,e.dampingFactor=t.orbitDampingFactor,e.enabled=!t.lockControls,t.lockControls?(e.enableZoom=!1,e.enablePan=!1,e.enableRotate=!1):(e.enableZoom=!0,e.enablePan=!0,e.enableRotate=!0),e.update()}updateGround(e,t){let n=e.children.find(i=>i instanceof Ue&&i.geometry instanceof zt);n&&n.material instanceof br&&(n.position.y=t.groundY,n.material.opacity=t.groundOpacity,n.material.needsUpdate=!0)}updateCaseTransform(e){e.model.position.copy(e.position),e.model.rotation.copy(e.rotation)}resetToDefault(e,t,n){Object.assign(e,{cameraX:t.sceneSettings.camera.position.x,cameraY:t.sceneSettings.camera.position.y,cameraZ:t.sceneSettings.camera.position.z,lookAtX:t.sceneSettings.camera.lookAt.x,lookAtY:t.sceneSettings.camera.lookAt.y,lookAtZ:t.sceneSettings.camera.lookAt.z,ambientIntensity:t.sceneSettings.lighting.ambient.intensity,mainLightIntensity:t.sceneSettings.lighting.main.intensity,exposure:t.sceneSettings.renderer.exposure,orbitMinPolarAngle:t.sceneSettings.orbitControls.minPolarAngle,orbitMaxPolarAngle:t.sceneSettings.orbitControls.maxPolarAngle,orbitMinDistance:t.sceneSettings.orbitControls.minDistance,orbitMaxDistance:t.sceneSettings.orbitControls.maxDistance,orbitDampingFactor:t.sceneSettings.orbitControls.dampingFactor,groundY:t.sceneSettings.ground.y,groundOpacity:t.sceneSettings.ground.opacity,lockControls:t.sceneSettings.camera.lockControls}),n.forEach(i=>{i.position.copy(i.model.position),i.rotation.copy(i.model.rotation)})}};Xr.\u0275fac=function(t){return new(t||Xr)},Xr.\u0275prov=ze({token:Xr,factory:Xr.\u0275fac,providedIn:"root"});var ir=Xr;var Yr=class Yr{constructor(){this.clock=new on;this.isManuallyAnimating=!1;this.manuallyAnimatedCaseId=null;this.activeCaseExpanded=!1;this.animationCancelToken=null;this.expandActiveCaseAfterScroll=()=>{};this.isActivationAnimating=!1;this.pendingExpansion={case:null,params:null}}setConfig(e){this.config=e}getIsManuallyAnimating(){return this.isManuallyAnimating}setIsManuallyAnimating(e){this.isManuallyAnimating=e}getManuallyAnimatedCaseId(){return this.manuallyAnimatedCaseId}setManuallyAnimatedCaseId(e){this.manuallyAnimatedCaseId=e}getActiveCaseExpanded(){return this.activeCaseExpanded}setActiveCaseExpanded(e){this.activeCaseExpanded=e}isActivationInProgress(){return this.isActivationAnimating}startCaseActivation(e){this.isActivationAnimating=!0,setTimeout(()=>{if(this.isActivationAnimating=!1,this.pendingExpansion.case&&this.pendingExpansion.params){let{case:t,params:n}=this.pendingExpansion;this.pendingExpansion={case:null,params:null},this.expandActiveCase(t,n[0],n[1],n[2],n[3],n[4],n[5],n[6],n[7],n[8])}},500)}cubicBezier(e,t,n,i,r){let o=1-e;return Math.pow(o,3)*t+3*Math.pow(o,2)*e*n+3*o*Math.pow(e,2)*i+Math.pow(e,3)*r}expandActiveCase(e,t,n,i,r,o,l,u,d,a){if(!e.isActive||this.activeCaseExpanded)return;if(this.isActivationAnimating){console.log("Queuing expansion - activation animation in progress"),this.pendingExpansion={case:e,params:[t,n,i,r,o,l,u,d,a]};return}this.cancelCurrentAnimation();let c=t.indexOf(e);c>=0&&(i[c]=!0),l(0),o.visible=!0,u(e);let h=new Yt().copy(e.model.rotation),f=new w().copy(e.model.position);console.log("Starting expansion from current position:",f),console.log("Initial position (for reference):",e.initialPosition),this.isManuallyAnimating=!0,this.manuallyAnimatedCaseId=e.id,this.activeCaseExpanded=!0;let g=this.config.videoPlane2Position||{offsetX:.8,offsetY:.01,offsetZ:.02},_=this.config.videoPlane2Rotation||{offsetX:0,offsetY:-1.57,offsetZ:0},m=this.config.finalCasePosition||{offsetX:-2.5,offsetY:3,offsetZ:-2},p=this.config.finalCaseRotation||{offsetX:3.14,offsetY:0,offsetZ:0},b=this.config.consecutiveCaseExtraY||.1,M=e.carouselIndex,y=b*M,T={offsetX:m.offsetX,offsetY:m.offsetY+y,offsetZ:m.offsetZ};console.log("Original Position:",f),console.log("videoPlane2Position offsets:",g),console.log("Case Index:",M,"Extra Y Offset:",y),console.log("finalCasePosition offsets (with extra Y):",T),console.log("finalCaseRotation offsets (added to original):",p);let P=this.config.menuAnimation||{duration:1,bezierCurve:{p1:.25,p2:.1,p3:.25,p4:1}},A=this.clock.getElapsedTime(),D=P.duration,S=()=>{let R=this.clock.getElapsedTime()-A,V=Math.min(R/D,1),B=P.bezierCurve,z=this.cubicBezier(V,0,B.p1,B.p2,1),j=new w().copy(e.model.position),Y=m.offsetX*z,Z=(m.offsetY+y)*z,H=m.offsetZ*z,te=new Yt().copy(e.model.rotation);e.model.rotation.x=h.x+p.offsetX*z,e.model.rotation.y=h.y+p.offsetY*z,e.model.rotation.z=h.z+p.offsetZ*z,m.rotationX!==void 0&&(e.model.rotation.x+=m.rotationX*z),m.rotationY!==void 0&&(e.model.rotation.y+=m.rotationY*z),m.rotationZ!==void 0&&(e.model.rotation.z+=m.rotationZ*z);let ue=new ft().setFromEuler(e.model.rotation),ye=new w(Y,Z,H),He=f.x+ye.x,at=f.y+ye.y,tt=f.z+ye.z;(V===0||V>=.99)&&(console.log(`Animation progress: ${V.toFixed(2)}, t=${z.toFixed(2)}`),console.log("Original position:",f),console.log(`Applied offsets: X=${Y.toFixed(2)}, Y=${Z.toFixed(2)}, Z=${H.toFixed(2)}`),console.log(`Final position: X=${He.toFixed(2)}, Y=${at.toFixed(2)}, Z=${tt.toFixed(2)}`)),e.model.position.set(He,at,tt),e.position.copy(e.model.position),a(),V<1?this.animationCancelToken=requestAnimationFrame(S):(console.log("Animation complete: Keeping case in final position"),this.animationCancelToken=null,e.position.copy(e.model.position),e.targetPosition.copy(e.model.position))};S(),setTimeout(()=>{c>=0&&(n[c]=!0),d()},D*1e3)}animateActiveCaseBack(e,t,n,i,r,o,l,u,d){console.log("Animating case back: ",e.id,"New index: ",t),this.cancelCurrentAnimation();let a=new Yt().copy(e.model.rotation),c=new w().copy(e.model.position),h=new w().copy(e.initialPosition);h.z+=1,console.log("Using active position as target:",h),console.log("Starting from current position:",c),this.isManuallyAnimating=!0,this.manuallyAnimatedCaseId=e.id;let f=0;r&&(f=r.material.opacity);let g=this.config.finalCasePosition||{offsetX:-1,offsetY:0,offsetZ:2},_=this.config.finalCaseRotation||{offsetX:3.14,offsetY:0,offsetZ:0},m=this.config.menuAnimation||{duration:.5,bezierCurve:{p1:.25,p2:.1,p3:.25,p4:1}},p=this.clock.getElapsedTime(),b=m.duration,M=()=>{let T=this.clock.getElapsedTime()-p,P=Math.min(T/b,1),A=m.bezierCurve,D=this.cubicBezier(P,0,A.p1,A.p2,1),S=c.x-h.x,E=c.y-h.y,R=c.z-h.z,V=S*(1-D),B=E*(1-D),z=R*(1-D),j=new w(V,B,z),Y=h.x+V,Z=h.y+B,H=h.z+z;e.model.position.set(Y,Z,H),e.position.copy(e.model.position);let te=this.config.caseSettings?.baseRotation||{x:0,y:0,z:0},ue=a.x-te.x,ye=a.y-te.y,He=a.z-te.z,at=ue*(1-D),tt=ye*(1-D),W=He*(1-D),se=te.x+at,ne=te.y+tt,Pe=te.z+W;if(e.model.rotation.set(se,ne,Pe),r){let we=r.material;we.opacity=f*(1-D)}if(P<1)this.animationCancelToken=requestAnimationFrame(M);else{if(this.animationCancelToken=null,this.isManuallyAnimating=!1,this.manuallyAnimatedCaseId=null,this.activeCaseExpanded=!1,e.model.position.copy(h),e.position.copy(h),e.targetPosition.copy(h),e.model.rotation.set(te.x,te.y,te.z),r){let Oe=r.material;Oe.opacity=0,r.visible=!1}o.visible=!1;let we=i.findIndex(Oe=>Oe.isActive);t!==we&&(l.setActiveCase(i,t),n&&setTimeout(()=>{let Oe=i.find(bt=>bt.isActive);Oe&&this.expandActiveCaseAfterScroll(Oe)},100)),u(t,n)}};M()}cancelCurrentAnimation(){this.animationCancelToken!==null&&(cancelAnimationFrame(this.animationCancelToken),this.animationCancelToken=null)}setExpandFunction(e){this.expandActiveCaseAfterScroll=e}resetCasePosition(e){let t=new w().copy(e.initialPosition);t.z+=1,e.model.position.copy(t),e.position.copy(t),e.targetPosition.copy(t);let n=this.config.caseSettings?.baseRotation||{x:0,y:0,z:0};e.model.rotation.set(n.x,n.y,n.z)}};Yr.\u0275fac=function(t){return new(t||Yr)},Yr.\u0275prov=ze({token:Yr,factory:Yr.\u0275fac});var oi=Yr;var qr=class qr{constructor(e,t){this.animationsService=e;this.caseAnimationService=t;this.Z_OFFSET=1;this.DEACTIVATED_Z_OFFSET=-3;this.POSITION_LERP_FACTOR=.1;console.log("CDCasesStateService created with CaseAnimationService:",!!t)}getPositionLerpFactor(){return this.POSITION_LERP_FACTOR}setActiveCase(e,t){console.group("Setting active case:",t);let n=e.find(r=>r.isActive),i=e[t];if(!i){console.error("Target case not found for index:",t),console.groupEnd();return}if(n===i){console.log("Case already active:",t),console.groupEnd();return}n&&(console.log("Deactivating case:",n.id),n.isActive=!1,n.targetPosition.copy(n.initialPosition),n.targetPosition.z+=this.DEACTIVATED_Z_OFFSET,n.isOpen&&this.animationsService.queueAnimation(n,"close")),e.forEach(r=>{r!==n&&r!==i&&(r.isActive=!1,r.targetPosition.copy(r.initialPosition),r.targetPosition.z+=this.DEACTIVATED_Z_OFFSET,r.isOpen&&this.animationsService.queueAnimation(r,"close"))}),console.log("Activating case:",i.id),i.isActive=!0,i.targetPosition.copy(i.initialPosition),i.targetPosition.z+=this.Z_OFFSET,this.caseAnimationService.startCaseActivation(i),console.groupEnd()}updatePositions(e){e.forEach(t=>{t.position.lerp(t.targetPosition,this.POSITION_LERP_FACTOR),t.model.position.copy(t.position)})}flipCase(e){console.log("Attempting to flip case:",e.id),e.isOpen=!e.isOpen,console.log("Case state toggled to:",e.isOpen?"Open":"Closed"),this.animationsService.queueAnimation(e,e.isOpen?"open":"close")}setupMaterials(e,t){e.traverse(n=>{n instanceof Ue&&n.name==="CD"&&Array.isArray(n.material)&&(n.material=n.material.map((i,r)=>{let o=t.materials.cd[r],l=i.clone();return Object.assign(l,{metalness:o.metalness,roughness:o.roughness,envMapIntensity:o.envMapIntensity}),"clearcoat"in l&&o.clearcoat!==void 0&&(l.clearcoat=o.clearcoat,l.clearcoatRoughness=o.clearcoatRoughness||0),l.needsUpdate=!0,l}))})}setupEnvironmentMap(e,t,n){let i=new si(t);i.compileEquirectangularShader();let r=i.fromEquirectangular(n).texture;e.environment=r,n.dispose(),i.dispose()}};qr.\u0275fac=function(t){return new(t||qr)(Be(mn),Be(oi))},qr.\u0275prov=ze({token:qr,factory:qr.\u0275fac,providedIn:"root"});var rr=qr;var jr=class jr{constructor(){this.clock=new on}setConfig(e){this.config=e}setVideoElements(e,t,n,i,r,o){this.rightSideMenuPlane=e,this.backgroundPlane=t,this.caseBackVideoPlane=n,this.videoPlay=i,this.videoPause=r,this.updateVideoSource=o}revealVideoAndBackground(e,t,n){if(this.rightSideMenuPlane&&this.backgroundPlane){let i=t.findIndex(r=>r.isActive);if(i>=0&&i<n.length&&this.updateVideoSource(n[i]),this.videoPlay(),this.caseBackVideoPlane&&e){if(!(this.caseBackVideoPlane.userData.configVisible!==void 0?this.caseBackVideoPlane.userData.configVisible:!0)){this.caseBackVideoPlane.visible=!1;return}console.log("Animation complete, revealing video plane 2"),this.caseBackVideoPlane.visible=!0;let o=0,l=.95,u=.3,d=this.clock.getElapsedTime(),a=()=>{let h=this.clock.getElapsedTime()-d,f=Math.min(h/u,1),g=o+(l-o)*f;if(this.caseBackVideoPlane.material instanceof Rt&&this.caseBackVideoPlane.material.uniforms){let _=this.caseBackVideoPlane.material.uniforms.opacity;_&&(_.value=g)}else this.caseBackVideoPlane.material instanceof Ot&&(this.caseBackVideoPlane.material.opacity=g);f<1?requestAnimationFrame(a):console.log("Fade-in complete, video plane 2 opacity:",g)};a()}}}resetCaseBackVideoPlane(e=.95){if(this.caseBackVideoPlane){let t=this.caseBackVideoPlane.userData.configVisible!==void 0?this.caseBackVideoPlane.userData.configVisible:!0;if(this.caseBackVideoPlane.material instanceof Rt&&this.caseBackVideoPlane.material.uniforms){let n=this.caseBackVideoPlane.material.uniforms.opacity;n&&(n.value=e)}else this.caseBackVideoPlane.material instanceof Ot&&(this.caseBackVideoPlane.material.opacity=e);this.caseBackVideoPlane.visible=!1,this.caseBackVideoPlane.userData.configVisible=t}}createCaseBackVideoPlane(e){let t=this.config.videoPlane2Size?.width||1.2,n=this.config.videoPlane2Size?.height||.8,i=this.config.videoPlane2Size?.cornerRadius||.05,r=this.config.videoPlane2Size?.rightCrop||0,o=this.config.videoPlane2Size?.visible!==void 0?this.config.videoPlane2Size.visible:!0,l;if(r>0&&r<1){let f=t*(1-r);l=new Tt;let g=new Float32Array([-t/2,-n/2,0,-t/2+f,-n/2,0,-t/2+f,n/2,0,-t/2,n/2,0]),_=new Float32Array([0,0,1-r,0,1-r,1,0,1]),m=new Uint16Array([0,1,2,0,2,3]);l.setAttribute("position",new st(g,3)),l.setAttribute("uv",new st(_,2)),l.setIndex(new st(m,1)),l.computeVertexNormals()}else l=new zt(t,n);let u=new Rt({uniforms:{map:{value:e},opacity:{value:.95},size:{value:new Se(t,n)},radius:{value:i},ambient:{value:new de(16579836)},ambientIntensity:{value:.75}},vertexShader:`
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,fragmentShader:`
        uniform sampler2D map;
        uniform float opacity;
        uniform vec2 size;
        uniform float radius;
        uniform vec3 ambient;
        uniform float ambientIntensity;
        varying vec2 vUv;
        
        float roundedRectangle(vec2 position, vec2 size, float radius) {
          // Convert UV to pixel coordinates
          vec2 q = abs(position) - size + vec2(radius);
          return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
        }
        
        void main() {
          // Convert UV from 0-1 to -size/2 to size/2
          vec2 position = (vUv - 0.5) * size;
          
          // Calculate distance to rounded rectangle edge
          float distance = roundedRectangle(position, size * 0.5, radius);
          
          // Apply a sharp cutoff for rounded corners
          if (distance > 0.0) {
            discard; // Discard fragments outside the rounded rectangle
          }
          
          // Sample texture
          vec4 texColor = texture2D(map, vUv);
          
          // Apply subtle darkening for scene integration
          vec3 finalColor = texColor.rgb * ambientIntensity;
          
          // Apply opacity
          gl_FragColor = vec4(finalColor, texColor.a * opacity);
        }
      `,transparent:!0,side:Vt}),d=new Ue(l,u),a=(Math.random()-.5)*.01,c=(Math.random()-.5)*.01,h=(Math.random()-.5)*.01;return d.rotation.set(a,c,h),d.renderOrder=2,d.castShadow=!0,d.receiveShadow=!0,d.userData.configVisible=o,d}updateVideoForNewActiveCase(e,t,n,i,r,o,l,u){this.resetCaseBackVideoPlane(0);let d=r.find(a=>a.isActive);if(d&&!i[e]&&!o[e]&&l(d),i[e]&&this.rightSideMenuPlane?e>=0&&e<n.length&&(this.updateVideoSource(n[e]),this.videoPlay()):this.videoPause(),t&&d){let a=!1,c=()=>{if(a)return;let h=d.position.distanceTo(d.targetPosition);h<=.05?(console.log("Case reached target position, auto-expanding because previous case was expanded"),console.log("Distance to target:",h),a=!0,u(d)):(console.log("Waiting for case to reach position before auto-expanding. Current distance:",h),requestAnimationFrame(c))};c()}}updateVideoPlane2Alignment(e,t,n,i){if(!e)return;if(!(e.userData.configVisible!==void 0?e.userData.configVisible:!0)){e.visible=!1;return}let o;if(t&&n!==null?o=i.find(m=>m.id===n):(o=i.find(m=>m.isActive),!o&&n!==null&&(o=i.find(m=>m.id===n))),!o)return;let l=this.config.videoPlane2Position||{offsetX:.8,offsetY:.01,offsetZ:.02},u=this.config.videoPlane2Rotation||{offsetX:0,offsetY:-1.57,offsetZ:0};t&&console.log("Aligning videoPlane2 with manually animated case:",o.id);let d=new w().copy(o.model.position),a=new ft().setFromEuler(o.model.rotation),c=new w(l.offsetX,l.offsetY,l.offsetZ);c.applyQuaternion(a);let h=new w(d.x+c.x,d.y+c.y,d.z+c.z);e.position.copy(h);let f=new ft().setFromEuler(o.model.rotation),g=new ft().setFromEuler(new Yt(u.offsetX,u.offsetY,u.offsetZ,"YXZ")),_=new ft().multiplyQuaternions(f,g);if(e.setRotationFromQuaternion(_),!o.isActive&&!t){let m=e.material,p=new w().copy(o.position),b=new w().copy(o.targetPosition),M=2,y=o.initialPosition.distanceTo(b.add(new w(0,0,M))),T=o.initialPosition.distanceTo(p);if(y>0){let P=1-T/y;m.opacity=Math.max(0,.95*(1-P))}else m.opacity=0}}getVideoPlay(){return this.videoPlay}getUpdateVideoSource(){return this.updateVideoSource}};jr.\u0275fac=function(t){return new(t||jr)},jr.\u0275prov=ze({token:jr,factory:jr.\u0275fac});var kn=jr;var Zr=class Zr{constructor(){this.silhouetteMaterial=null;this.silhouetteMesh=null;this.clock=new on}setConfig(e){this.config=e,e.cdCases&&(this.config.cdCases=e.cdCases)}setScene(e){this.scene=e}removeSilhouetteEffect(e){e.model.traverse(t=>{t instanceof Ue&&t.userData.originalMaterial&&(t.material=t.userData.originalMaterial,delete t.userData.originalMaterial)}),this.silhouetteMesh&&(this.scene.remove(this.silhouetteMesh),this.silhouetteMesh=null),this.silhouetteMaterial&&(this.silhouetteMaterial.dispose(),this.silhouetteMaterial=null)}createActiveCaseSilhouette(e,t){let n=this.config.cdCases.indexOf(e);if(n>=0&&t[n])return;this.silhouetteMesh&&(this.scene.remove(this.silhouetteMesh),this.silhouetteMesh=null,this.silhouetteMaterial&&this.silhouetteMaterial.dispose());let i=this.config.silhouette,r=e.model,o=i.appearance.color,l=new de(o);r.traverse(u=>{if(u instanceof Ue&&(u.userData.originalMaterial||(u.userData.originalMaterial=u.material.clone()),u.material))if(Array.isArray(u.material))u.material=u.material.map(d=>{let a=d.clone();return a.emissive=l,a.emissiveIntensity=i.appearance.intensity,a});else{let d=u.material.clone();d.emissive=l,d.emissiveIntensity=i.appearance.intensity,u.material=d}}),this.silhouetteMaterial=null,this.silhouetteMesh=null,console.log("Silhouette effect applied directly to CD case:",e.id)}updateSilhouetteAnimation(e,t,n){let i=e.findIndex(r=>r.isActive&&!r.isOpen);if(i>=0&&!t[i]&&!n[i]){let r=e[i],o=this.clock.getElapsedTime(),l=this.config.silhouette,u=1-l.animation.fastPulseAmount+l.animation.fastPulseAmount*Math.sin(o*l.animation.fastPulseSpeed),d=1-l.animation.slowPulseAmount+l.animation.slowPulseAmount*Math.sin(o*l.animation.slowPulseSpeed),a=u*d*l.appearance.intensity;r.model.traverse(c=>{c instanceof Ue&&(Array.isArray(c.material)?c.material.forEach(h=>{h.emissive&&(h.emissiveIntensity=a)}):c.material&&c.material.emissive&&(c.material.emissiveIntensity=a))})}e.forEach(r=>{!r.isActive&&r.model&&r.model.traverse(o=>{o instanceof Ue&&o.userData.originalMaterial&&(o.material=o.userData.originalMaterial,delete o.userData.originalMaterial)})})}};Zr.\u0275fac=function(t){return new(t||Zr)},Zr.\u0275prov=ze({token:Zr,factory:Zr.\u0275fac});var Fn=Zr;var $r=class $r{setConfig(e){this.config=e}onWheel(e,t,n,i,r,o,l,u,d,a){if(n.lockControls){if(r.hasAnyActiveAnimations(t)){e.preventDefault(),e.stopPropagation();return}e.preventDefault(),e.stopPropagation();let c=t.findIndex(_=>_.isActive);if(c===-1){i.setActiveCase(t,0);let _=t.find(m=>m.isActive);_&&o(_);return}let h=c;e.deltaY>0?h=(c+1)%t.length:h=(c-1+t.length)%t.length;let f=t[c],g=d();t.forEach(_=>{_!==f&&_.isActive&&a(_)}),f&&f.isActive&&g?l(f,h,g):(i.setActiveCase(t,h),u(h,g))}}addEventListeners(e,t,n,i,r,o,l,u,d){let a=e;a.addEventListener("mousedown",c=>{let h=i.handleMouseDown(c,a,n,t),f=h?t.indexOf(h):-1;if(h&&h.isActive){if(f>=0&&(r[f]=!0),o()){console.log("Case is already expanded, collapsing it fully"),l&&(l.visible=!1),d(h,f,!1);return}u(h)}}),a.addEventListener("mousemove",c=>i.handleMouseMove(c,a)),a.addEventListener("mouseup",()=>i.handleMouseUp()),a.addEventListener("contextmenu",c=>i.handleContextMenu(c,a,n,t))}onWindowResize(e,t,n){e.aspect=window.innerWidth/window.innerHeight,e.updateProjectionMatrix(),t.setSize(window.innerWidth,window.innerHeight),n.setSize(window.innerWidth,window.innerHeight)}activateCase(e,t,n,i,r,o,l){e.isActive=!0,o(e),r&&(r.visible=!0),l(e)}deactivateCase(e,t,n,i,r,o,l){e.isActive=!1,e.isDeactivating=!0,r&&(r.visible=!1),setTimeout(()=>{e.isDeactivating=!1},300)}};$r.\u0275fac=function(t){return new(t||$r)},$r.\u0275prov=ze({token:$r,factory:$r.\u0275fac});var sr=$r;var Kr=class Kr{setConfig(e){this.config=e}getRenderer(){return this.renderer}getLabelRenderer(){return this.labelRenderer}getScene(){return this.scene}getCamera(){return this.camera}getControls(){return this.controls}getVideoPlane(){return this.rightSideMenuPlane}getRightSideMenuPlane(){return this.rightSideMenuPlane}getVideoTexture(){return this.videoTexture}getBackgroundPlane(){return this.backgroundPlane}getCaseBackVideoPlane(){return this.caseBackVideoPlane}getVideoControls(){return{play:this.videoPlay,pause:this.videoPause,updateSource:this.updateVideoSource}}getLights(){return{ambientLight:this.ambientLight,mainLight:this.mainLight,fillLight:this.fillLight,backLight:this.backLight}}getLightHelpers(){return{mainLightHelper:this.mainLightHelper,fillLightHelper:this.fillLightHelper,backLightHelper:this.backLightHelper}}setupRenderer(e,t,n){this.renderer=t.setupRenderer(e,this.config),this.scene=t.setupScene(this.config),this.camera=t.setupCamera(this.config),this.labelRenderer=new gc,this.labelRenderer.setSize(window.innerWidth,window.innerHeight),this.labelRenderer.domElement.style.position="absolute",this.labelRenderer.domElement.style.top="0",this.labelRenderer.domElement.style.pointerEvents="none";let i=t.setupLights(this.scene,this.config);this.ambientLight=i.ambientLight,this.mainLight=i.mainLight,this.fillLight=i.fillLight,this.backLight=i.backLight,this.mainLightHelper=new wr(this.mainLight,1),this.fillLightHelper=new wr(this.fillLight,1),this.backLightHelper=new wr(this.backLight,1);let r=t.createLightLabel("Main Light"),o=t.createLightLabel("Fill Light"),l=t.createLightLabel("Back Light");this.mainLight.add(r),this.fillLight.add(o),this.backLight.add(l),this.scene.add(this.mainLightHelper,this.fillLightHelper,this.backLightHelper),t.setupGround(this.scene,this.config);let u=t.setupVideoPlane(this.scene,this.config);u.mesh.visible=!1;let d=t.setupBackgroundPlane(this.scene,this.config,u.videoTexture);d.visible=!0;let a=n(u.videoTexture);a.visible=!1,this.scene.add(a),this.rightSideMenuPlane=u.mesh,this.backgroundPlane=d,this.caseBackVideoPlane=a,this.videoTexture=u.videoTexture,this.videoPlay=u.play,this.videoPause=u.pause,this.updateVideoSource=u.updateVideoSource,this.rightSideMenuPlane.material instanceof qt&&(this.rightSideMenuPlane.material.transparent=!0,this.rightSideMenuPlane.material.opacity=0,this.rightSideMenuPlane.material.needsUpdate=!0)}setupControls(e){this.controls=e.setupControls(this.camera,this.renderer.domElement,this.config)}onWindowResize(){this.camera.aspect=window.innerWidth/window.innerHeight,this.camera.updateProjectionMatrix(),this.renderer.setSize(window.innerWidth,window.innerHeight),this.labelRenderer.setSize(window.innerWidth,window.innerHeight)}cleanUpResources(e,t){t!==null&&cancelAnimationFrame(t),e.forEach(n=>{this.scene.remove(n.model),n.model.traverse(i=>{i instanceof Ue&&(i.geometry.dispose(),Array.isArray(i.material)?i.material.forEach(r=>r.dispose()):i.material.dispose())})}),this.scene.remove(this.mainLightHelper),this.scene.remove(this.fillLightHelper),this.scene.remove(this.backLightHelper),this.renderer.dispose(),this.labelRenderer.domElement.remove()}};Kr.\u0275fac=function(t){return new(t||Kr)},Kr.\u0275prov=ze({token:Kr,factory:Kr.\u0275fac});var ai=Kr;var Np=new w,ex=new ft,kp=new w;var li=new ke,tx=new ke,xc=class{constructor(e={}){let t=this,n,i,r,o,l={camera:{style:""},objects:new WeakMap},u=e.element!==void 0?e.element:document.createElement("div");u.style.overflow="hidden",this.domElement=u;let d=document.createElement("div");d.style.transformOrigin="0 0",d.style.pointerEvents="none",u.appendChild(d);let a=document.createElement("div");a.style.transformStyle="preserve-3d",d.appendChild(a),this.getSize=function(){return{width:n,height:i}},this.render=function(m,p){let b=p.projectionMatrix.elements[5]*o;p.view&&p.view.enabled?(d.style.transform=`translate( ${-p.view.offsetX*(n/p.view.width)}px, ${-p.view.offsetY*(i/p.view.height)}px )`,d.style.transform+=`scale( ${p.view.fullWidth/p.view.width}, ${p.view.fullHeight/p.view.height} )`):d.style.transform="",m.matrixWorldAutoUpdate===!0&&m.updateMatrixWorld(),p.parent===null&&p.matrixWorldAutoUpdate===!0&&p.updateMatrixWorld();let M,y;p.isOrthographicCamera&&(M=-(p.right+p.left)/2,y=(p.top+p.bottom)/2);let T=p.view&&p.view.enabled?p.view.height/p.view.fullHeight:1,P=p.isOrthographicCamera?`scale( ${T} )scale(`+b+")translate("+c(M)+"px,"+c(y)+"px)"+h(p.matrixWorldInverse):`scale( ${T} )translateZ(`+b+"px)"+h(p.matrixWorldInverse),D=(p.isPerspectiveCamera?"perspective("+b+"px) ":"")+P+"translate("+r+"px,"+o+"px)";l.camera.style!==D&&(a.style.transform=D,l.camera.style=D),_(m,m,p,P)},this.setSize=function(m,p){n=m,i=p,r=n/2,o=i/2,u.style.width=m+"px",u.style.height=p+"px",d.style.width=m+"px",d.style.height=p+"px",a.style.width=m+"px",a.style.height=p+"px"};function c(m){return Math.abs(m)<1e-10?0:m}function h(m){let p=m.elements;return"matrix3d("+c(p[0])+","+c(-p[1])+","+c(p[2])+","+c(p[3])+","+c(p[4])+","+c(-p[5])+","+c(p[6])+","+c(p[7])+","+c(p[8])+","+c(-p[9])+","+c(p[10])+","+c(p[11])+","+c(p[12])+","+c(-p[13])+","+c(p[14])+","+c(p[15])+")"}function f(m){let p=m.elements;return"translate(-50%,-50%)"+("matrix3d("+c(p[0])+","+c(p[1])+","+c(p[2])+","+c(p[3])+","+c(-p[4])+","+c(-p[5])+","+c(-p[6])+","+c(-p[7])+","+c(p[8])+","+c(p[9])+","+c(p[10])+","+c(p[11])+","+c(p[12])+","+c(p[13])+","+c(p[14])+","+c(p[15])+")")}function g(m){m.isCSS3DObject&&(m.element.style.display="none");for(let p=0,b=m.children.length;p<b;p++)g(m.children[p])}function _(m,p,b,M){if(m.visible===!1){g(m);return}if(m.isCSS3DObject){let y=m.layers.test(b.layers)===!0,T=m.element;if(T.style.display=y===!0?"":"none",y===!0){m.onBeforeRender(t,p,b);let P;m.isCSS3DSprite?(li.copy(b.matrixWorldInverse),li.transpose(),m.rotation2D!==0&&li.multiply(tx.makeRotationZ(m.rotation2D)),m.matrixWorld.decompose(Np,ex,kp),li.setPosition(Np),li.scale(kp),li.elements[3]=0,li.elements[7]=0,li.elements[11]=0,li.elements[15]=1,P=f(li)):P=f(m.matrixWorld);let A=l.objects.get(m);if(A===void 0||A.style!==P){T.style.transform=P;let D={style:P};l.objects.set(m,D)}T.parentNode!==a&&a.appendChild(T),m.onAfterRender(t,p,b)}}for(let y=0,T=m.children.length;y<T;y++)_(m.children[y],p,b,M)}}};var Up=qp(Fp());var Jr=class Jr{constructor(e){this.http=e;this.destroy$=new wn;this.isDebugMode=!0;this.audio=null;this.currentTrack=null;this._isPlaying=!1;this.volume=1;this.progress=0;this.isLoading=!1;this.TRACKS={introduction:{title:"Introduction",artist:"An",id:"intro",url:"assets/audio/An - Incident.mp3"},"disc-1":{title:"I can avoid it",artist:"Feryquitous",id:"disc1",url:"assets/audio/Feryquitous - i can avoid it.mp3"},"disc-2":{title:"Quantum Resonance",artist:"An",id:"disc2",url:"assets/audio/An - Quantum Resonance.mp3"},pv:{title:"Neural Network",artist:"Feryquitous",id:"pv",url:"assets/audio/Feryquitous - Neural Network.mp3"},information:{title:"Digital Entropy",artist:"An \xD7 Feryquitous",id:"info",url:"assets/audio/An \xD7 Feryquitous - Digital Entropy.mp3"}};this.audioStateSubject=new Li({isPlaying:!1,currentTrack:null,volume:1,progress:0,loading:!1});this.audioEventSubject=new Li({type:"pause"});this.errorSubject=new wn;this.currentTrackSubject=new Li("");this.currentTrack$=this.currentTrackSubject.asObservable();this.audioFiles=[];this.sectionTracks={introduction:"An - Incident.mp3","disc-1":"Feryquitous - i can avoid it.mp3","disc-2":"An - Quantum Resonance.mp3",pv:"Feryquitous - Neural Network.mp3",information:"An \xD7 Feryquitous - Digital Entropy.mp3"};this.uiSounds={"menu-click":"assets/audio/ui/menu-click.mp3","page-turn":"assets/audio/ui/page-turn.mp3",success:"assets/audio/ui/success.mp3",error:"assets/audio/ui/error.mp3"};this.loadAudioFiles(),this.initializeAudio(),this.isDebugMode&&console.log("[AudioService] Initialized")}loadAudioFiles(){return rn(this,null,function*(){try{this.audioFiles.push(...Object.values(this.sectionTracks).map(e=>`assets/audio/${e}`)),this.audioFiles.length>0&&this.currentTrackSubject.next(this.audioFiles[0]),this.isDebugMode&&console.log("[AudioService] Audio files loaded:",this.audioFiles)}catch(e){this.handleError("LOAD_ERROR",`Failed to load audio files: ${e instanceof Error?e.message:String(e)}`)}})}initializeAudio(){this.audio=new Audio,this.setupAudioEventListeners()}setupAudioEventListeners(){if(!this.audio){this.handleError("LOAD_ERROR","Audio element not initialized");return}this.audio.addEventListener("timeupdate",()=>{this.audio&&(this.progress=this.audio.duration?this.audio.currentTime/this.audio.duration*100:0,this.updateAudioState(),this.audioEventSubject.next({type:"timeupdate",data:this.progress}))}),this.audio.addEventListener("ended",()=>{this._isPlaying=!1,this.updateAudioState(),this.audioEventSubject.next({type:"ended"})}),this.audio.addEventListener("error",e=>{let t=e;this.handleError("LOAD_ERROR",`Failed to load audio: ${t.message||"Unknown error"}`),this.audioEventSubject.next({type:"error",data:t.message})}),this.audio.addEventListener("loadstart",()=>{this.isLoading=!0,this.updateAudioState(),this.audioEventSubject.next({type:"loading"})}),this.audio.addEventListener("canplay",()=>{this.isLoading=!1,this.updateAudioState(),this.audioEventSubject.next({type:"loaded"})}),this.audio.addEventListener("play",()=>{this._isPlaying=!0,this.updateAudioState(),this.audioEventSubject.next({type:"play"})}),this.audio.addEventListener("pause",()=>{this._isPlaying=!1,this.updateAudioState(),this.audioEventSubject.next({type:"pause"})})}updateAudioState(){this.audioStateSubject.next({isPlaying:this._isPlaying,currentTrack:this.currentTrack,volume:this.volume,progress:this.progress,loading:this.isLoading})}handleError(e,t){this.isDebugMode&&console.error(`[AudioService] ${e}: ${t}`),this.errorSubject.next({type:e,message:t})}setTrackForSection(e){let t=this.TRACKS[e];if(!t){this.handleError("LOAD_ERROR",`No track found for section: ${e}`);return}this.currentTrack?.id!==t.id&&(this.isDebugMode&&console.log(`[AudioService] Setting track for section: ${e}`,t),this.currentTrack=t,this.loadTrack(t),this.currentTrackSubject.next(t.url))}loadTrack(e){if(!this.audio){this.handleError("LOAD_ERROR","Audio element not initialized");return}this.isLoading=!0,this.updateAudioState(),this.audio.src=e.url;try{this.audio.load()}catch(t){this.handleError("LOAD_ERROR",`Failed to load track: ${t instanceof Error?t.message:String(t)}`)}}play(){if(!this.audio){this.handleError("PLAY_ERROR","Audio element not initialized");return}if(!this.currentTrack){this.handleError("PLAY_ERROR","No track selected");return}this.isDebugMode&&console.log("[AudioService] Playing audio:",this.currentTrack.title),this.audio.play().then(()=>{this._isPlaying=!0,this.updateAudioState()}).catch(e=>{this.handleError("PLAY_ERROR",`Failed to play audio: ${e instanceof Error?e.message:String(e)}`)})}pause(){if(!this.audio){this.handleError("PAUSE_ERROR","Audio element not initialized");return}this.isDebugMode&&console.log("[AudioService] Pausing audio"),this.audio.pause(),this._isPlaying=!1,this.updateAudioState()}togglePlay(){this._isPlaying?this.pause():this.play()}setVolume(e){if(!this.audio){this.handleError("PAUSE_ERROR","Audio element not initialized");return}this.volume=Math.max(0,Math.min(1,e)),this.audio.volume=this.volume,this.updateAudioState(),this.isDebugMode&&console.log(`[AudioService] Volume set to: ${this.volume}`)}getCurrentState(){return this.audioStateSubject.asObservable()}getAudioEvents(){return this.audioEventSubject.asObservable()}onPlayStateChange(){return this.getCurrentState().pipe(Dc(e=>e.isPlaying))}onTrackChange(){return this.currentTrack$}onLoadingStateChange(){return this.getCurrentState().pipe(Dc(e=>e.loading))}getProgress(){return!this.audio||!this.audio.duration?0:this.audio.currentTime/this.audio.duration}getErrors(){return this.errorSubject.asObservable()}isPlaying(){return this._isPlaying}getCurrentTrack(){return this.currentTrackSubject.value}getNextTrack(){let e=this.audioFiles.indexOf(this.currentTrackSubject.value);if(e<this.audioFiles.length-1){let t=this.audioFiles[e+1];return this.currentTrackSubject.next(t),t}return null}getPreviousTrack(){let e=this.audioFiles.indexOf(this.currentTrackSubject.value);if(e>0){let t=this.audioFiles[e-1];return this.currentTrackSubject.next(t),t}return null}getTrackList(){return this.audioFiles}getCurrentIndex(){return this.audioFiles.indexOf(this.currentTrackSubject.value)}playUISound(e){if(!this.uiSounds[e]){this.handleError("UI_SOUND_ERROR",`UI sound not found: ${e}`);return}try{let t=new Audio(this.uiSounds[e]);t.volume=.5,t.play().catch(n=>{this.handleError("UI_SOUND_ERROR",`Error playing UI sound: ${n instanceof Error?n.message:String(n)}`)})}catch(t){this.handleError("UI_SOUND_ERROR",`Failed to create UI sound: ${t instanceof Error?t.message:String(t)}`)}}playTrack(e){if(!this.audio){this.handleError("PLAY_ERROR","Audio element not initialized");return}this.isDebugMode&&console.log(`[AudioService] Playing track from source: ${e}`),this.currentTrackSubject.next(e),this.isLoading=!0,this.updateAudioState(),this.audio.src=e,this.audio.play().then(()=>{this._isPlaying=!0,this.updateAudioState()}).catch(t=>{this.handleError("PLAY_ERROR",`Error playing track: ${t instanceof Error?t.message:String(t)}`)})}pauseTrack(){this.pause()}resumeTrack(){this.play()}ngOnDestroy(){this.isDebugMode&&console.log("[AudioService] Destroying service"),this.audio&&(this.audio.onended=null,this.audio.ontimeupdate=null,this.audio.onerror=null,this.audio.oncanplay=null,this.audio.onloadstart=null,this.audio.pause(),this.audio.src="",this.audio=null),this.audioStateSubject.complete(),this.audioEventSubject.complete(),this.currentTrackSubject.complete(),this.errorSubject.complete(),this.destroy$.next(),this.destroy$.complete()}};Jr.\u0275fac=function(t){return new(t||Jr)(Be(_a))},Jr.\u0275prov=ze({token:Jr,factory:Jr.\u0275fac,providedIn:"root"});var Mc=Jr;function rx(s,e){if(s&1&&(he(0,"div",23),Re(1),me()),s&2){let t=vt();Ae(),$n(t.error)}}function sx(s,e){s&1&&(he(0,"div",24),Re(1,"Loading..."),me())}function ox(s,e){if(s&1&&(he(0,"div",25)(1,"div",26),Re(2),me(),he(3,"div",27),Re(4),me()()),s&2){let t=vt();Ae(2),$n(t.getTrackName(t.currentTrack)),Ae(2),$n(t.getArtistName())}}function ax(s,e){if(s&1&&(he(0,"div",28),Re(1),me()),s&2){let t=vt();Ae(),Fi(" ",t.currentSubtitle," ")}}function lx(s,e){s&1&&(he(0,"i",29),Re(1,"\u25B6"),me())}function cx(s,e){s&1&&(he(0,"i",30),Re(1,"\u23F8"),me())}var Ks=class Ks{constructor(e,t){this.audioService=e;this.cdr=t;this.trackTitle="";this.trackArtist="";this.activeTrack=null;this.audio=null;this.destroy$=new wn;this.isPlaying=!1;this.isLoading=!0;this.currentTrack="";this.currentTime=0;this.duration=0;this.volume=.1;this.error="";this.currentSubtitle=""}ngOnInit(){this.initializeAudio()}ngOnDestroy(){this.destroy$.next(),this.destroy$.complete(),this.audio&&this.audio.unload()}initializeAudio(){this.audioService.currentTrack$.pipe(Ni(this.destroy$)).subscribe(e=>{if(e){let t={title:this.getTrackName(e),artist:this.getArtistName(),url:e};this.loadTrack(t)}})}loadTrack(e){this.isLoading=!0,this.cdr.markForCheck(),this.audio&&this.audio.unload(),this.audio=new Up.Howl({src:[e.url||e.title],html5:!0,onload:()=>{this.isLoading=!1,this.duration=this.audio?.duration()||0,this.cdr.markForCheck()},onloaderror:(t,n)=>{this.error=`Failed to load track: ${n}`,this.isLoading=!1,this.cdr.markForCheck()}})}togglePlay(){this.audio&&(this.isPlaying?this.audio.pause():this.audio.play(),this.isPlaying=!this.isPlaying,this.cdr.markForCheck())}setVolume(e){this.audio&&(this.volume=e,this.audio.volume(e),this.cdr.markForCheck())}seek(e){this.audio&&(this.audio.seek(e),this.currentTime=e,this.cdr.markForCheck())}updateSubtitleFromFilename(e){if(e){let n=(e.split("/").pop()||"").replace(".mp3","").split(" - ");n.length>1?this.currentSubtitle=n[0]:this.currentSubtitle=""}}updateTime(){this.audio&&this.isPlaying&&(this.currentTime=this.audio.seek(),requestAnimationFrame(()=>this.updateTime()))}nextTrack(){if(this.isLoading)return;let e=this.audioService.getNextTrack();if(e){let t={title:this.getTrackName(e),artist:this.getArtistName(),url:e};this.loadTrack(t)}}previousTrack(){if(this.isLoading)return;let e=this.audioService.getPreviousTrack();if(e){let t={title:this.getTrackName(e),artist:this.getArtistName(),url:e};this.loadTrack(t)}}formatTime(e){let t=Math.floor(e/60),n=Math.floor(e%60);return`${t}:${n.toString().padStart(2,"0")}`}getTrackName(e){let t=e.split("/"),n=t[t.length-1].replace(".mp3","");if(this.trackTitle)return this.trackTitle;let i=n.split(" - ");return i.length>1?i[1]:n}getArtistName(){if(this.trackArtist)return this.trackArtist;if(this.currentTrack){let t=(this.currentTrack.split("/").pop()||"").replace(".mp3","").split(" - ");if(t.length>1)return t[0]}return this.currentSubtitle}};Ks.\u0275fac=function(t){return new(t||Ks)(et(Mc),et(Kn))},Ks.\u0275cmp=Tn({type:Ks,selectors:[["app-music-player"]],inputs:{trackTitle:"trackTitle",trackArtist:"trackArtist",activeTrack:"activeTrack"},decls:30,vars:29,consts:[[1,"music-player"],[1,"player-container"],["class","error-message",4,"ngIf"],["class","loading-indicator",4,"ngIf"],["class","enhanced-track-info",4,"ngIf"],["class","current-subtitle",4,"ngIf"],[1,"time-info"],[1,"current-time"],[1,"progress-bar"],["type","range",1,"progress-slider",3,"input","min","max","step","value","disabled"],[1,"duration"],[1,"controls"],[1,"volume-section"],[1,"volume-icon"],[1,"volume-control"],["type","range",1,"volume-slider",3,"input","min","max","step","value","disabled"],[1,"playback-controls"],[1,"control-button","previous",3,"click","disabled"],[1,"control-icon"],[1,"control-button","play-button",3,"click","disabled"],["class","control-icon play-icon",4,"ngIf"],["class","control-icon pause-icon",4,"ngIf"],[1,"control-button","next",3,"click","disabled"],[1,"error-message"],[1,"loading-indicator"],[1,"enhanced-track-info"],[1,"track-title"],[1,"track-artist"],[1,"current-subtitle"],[1,"control-icon","play-icon"],[1,"control-icon","pause-icon"]],template:function(t,n){t&1&&(he(0,"div",0)(1,"div",1),Jt(2,rx,2,1,"div",2)(3,sx,2,0,"div",3)(4,ox,5,2,"div",4)(5,ax,2,1,"div",5),he(6,"div",6)(7,"span",7),Re(8),me(),he(9,"div",8)(10,"input",9),Bt("input",function(r){return n.seek(r.target.value)}),me()(),he(11,"span",10),Re(12),me()(),he(13,"div",11)(14,"div",12)(15,"div",13)(16,"span"),Re(17,"\u{1F50A}"),me()(),he(18,"div",14)(19,"input",15),Bt("input",function(r){return n.setVolume(r.target.value)}),me()()(),he(20,"div",16)(21,"button",17),Bt("click",function(){return n.previousTrack()}),he(22,"i",18),Re(23,"\u23EE"),me()(),he(24,"button",19),Bt("click",function(){return n.togglePlay()}),Jt(25,lx,2,0,"i",20)(26,cx,2,0,"i",21),me(),he(27,"button",22),Bt("click",function(){return n.nextTrack()}),he(28,"i",18),Re(29,"\u23ED"),me()()()()()()),t&2&&(Ae(2),Ze("ngIf",n.error),Ae(),Ze("ngIf",n.isLoading),Ae(),Ze("ngIf",n.currentTrack&&!n.isLoading),Ae(),Ze("ngIf",n.currentSubtitle&&!n.trackTitle&&!n.isLoading),Ae(),An("disabled",n.isLoading),Ae(2),$n(n.formatTime(n.currentTime)),Ae(),An("disabled",n.isLoading),Ae(),Ze("min",0)("max",n.duration)("step",.01)("value",n.currentTime)("disabled",n.isLoading),Ae(2),$n(n.formatTime(n.duration)),Ae(),An("disabled",n.isLoading),Ae(6),Ze("min",0)("max",1)("step",.01)("value",n.volume)("disabled",n.isLoading),Ae(2),Ze("disabled",n.isLoading),Ae(3),An("playing",n.isPlaying),Ze("disabled",n.isLoading),Ae(),Ze("ngIf",!n.isPlaying),Ae(),Ze("ngIf",n.isPlaying),Ae(),Ze("disabled",n.isLoading))},dependencies:[Rn,Ui],styles:['.music-player[_ngcontent-%COMP%]{position:relative;width:100%;background:#111c32b3;border-radius:8px;overflow:hidden;box-shadow:inset 0 0 10px #b8a68233;display:flex;flex-direction:column;padding:12px 15px;z-index:1000;font-family:Quicksand,sans-serif;color:#ffffffe6;font-size:16px}.music-player[_ngcontent-%COMP%]   .player-container[_ngcontent-%COMP%]{width:100%;display:flex;flex-direction:column;gap:4px;position:relative}.music-player[_ngcontent-%COMP%]   .player-container[_ngcontent-%COMP%]:before{content:"";position:absolute;top:0;left:0;width:100%;height:100%;background-image:linear-gradient(90deg,transparent 48%,rgba(184,166,130,.05) 49%,rgba(184,166,130,.05) 51%,transparent 52%),linear-gradient(180deg,transparent 48%,rgba(184,166,130,.05) 49%,rgba(184,166,130,.05) 51%,transparent 52%);background-size:30px 30px;opacity:.4;pointer-events:none;z-index:-1}.music-player[_ngcontent-%COMP%]   .enhanced-track-info[_ngcontent-%COMP%]{text-align:center;padding:5px 0 10px;border-bottom:1px solid rgba(184,166,130,.15);margin-bottom:10px}.music-player[_ngcontent-%COMP%]   .enhanced-track-info[_ngcontent-%COMP%]   .track-title[_ngcontent-%COMP%]{font-size:1.1rem;font-weight:600;color:#b8a682;margin-bottom:5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 0 10px rgba(184,166,130,.3);font-family:Cinzel,serif;letter-spacing:.05em}.music-player[_ngcontent-%COMP%]   .enhanced-track-info[_ngcontent-%COMP%]   .track-artist[_ngcontent-%COMP%]{font-size:.9rem;font-weight:400;color:#b8a682b3;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.music-player[_ngcontent-%COMP%]   .current-subtitle[_ngcontent-%COMP%]{font-size:.75rem;text-align:center;margin-bottom:8px;color:#b8a68299}.music-player[_ngcontent-%COMP%]   .time-info[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;color:#b8a682b3;font-size:.7rem;margin:5px 0;gap:8px}.music-player[_ngcontent-%COMP%]   .time-info.disabled[_ngcontent-%COMP%]{opacity:.5}.music-player[_ngcontent-%COMP%]   .time-info[_ngcontent-%COMP%]   .current-time[_ngcontent-%COMP%], .music-player[_ngcontent-%COMP%]   .time-info[_ngcontent-%COMP%]   .duration[_ngcontent-%COMP%]{flex:0 0 auto;min-width:40px;text-align:center}.music-player[_ngcontent-%COMP%]   .time-info[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%]{flex:1;padding:0;position:relative;height:20px}.music-player[_ngcontent-%COMP%]   .time-info[_ngcontent-%COMP%]   .progress-bar.disabled[_ngcontent-%COMP%]{opacity:.5}.music-player[_ngcontent-%COMP%]   .time-info[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%]{width:100%;height:20px;-webkit-appearance:none;background:transparent;outline:none;cursor:pointer;position:relative;margin:0}.music-player[_ngcontent-%COMP%]   .time-info[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%]:before{content:"";position:absolute;left:0;right:0;top:50%;height:3px;background:#b8a68226;border-radius:1.5px;transform:translateY(-50%);pointer-events:none}.music-player[_ngcontent-%COMP%]   .time-info[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%]::-webkit-slider-thumb{-webkit-appearance:none;width:12px;height:12px;background:#b8a682cc;border-radius:50%;cursor:pointer;transition:all .2s ease;margin-top:-4.5px;position:relative;z-index:1;box-shadow:0 0 8px #b8a68266}.music-player[_ngcontent-%COMP%]   .time-info[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%]::-webkit-slider-thumb:hover{transform:scale(1.2);background:#b8a682}.music-player[_ngcontent-%COMP%]   .time-info[_ngcontent-%COMP%]   .progress-bar[_ngcontent-%COMP%]   .progress-slider[_ngcontent-%COMP%]::-webkit-slider-runnable-track{height:3px;border-radius:1.5px;background:transparent}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]{display:flex;align-items:center;justify-content:space-between;width:100%;margin-top:8px}.music-player[_ngcontent-%COMP%]   .controls.disabled[_ngcontent-%COMP%]{opacity:.5}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]{display:flex;align-items:center;width:90px;margin-right:8px}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-icon[_ngcontent-%COMP%]{margin-right:5px;color:#b8a682b3;font-size:.8rem}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]{flex:1;padding:0;position:relative;height:20px}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]   .volume-slider[_ngcontent-%COMP%]{width:100%;height:20px;-webkit-appearance:none;background:transparent;outline:none;cursor:pointer;position:relative;margin:0}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]   .volume-slider[_ngcontent-%COMP%]:before{content:"";position:absolute;left:0;right:0;top:50%;height:3px;background:#b8a68226;border-radius:1.5px;transform:translateY(-50%);pointer-events:none}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]   .volume-slider[_ngcontent-%COMP%]::-webkit-slider-thumb{-webkit-appearance:none;width:10px;height:10px;background:#b8a682cc;border-radius:50%;cursor:pointer;transition:all .2s ease;margin-top:-3.5px;position:relative;z-index:1}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]   .volume-slider[_ngcontent-%COMP%]::-webkit-slider-thumb:hover{transform:scale(1.2);background:#b8a682}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .volume-section[_ngcontent-%COMP%]   .volume-control[_ngcontent-%COMP%]   .volume-slider[_ngcontent-%COMP%]::-webkit-slider-runnable-track{height:3px;border-radius:1.5px;background:transparent}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]{display:flex;align-items:center;gap:12px;margin:0 auto}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button[_ngcontent-%COMP%]{width:32px;height:32px;border-radius:50%;border:1px solid rgba(184,166,130,.3);background:#19233ccc;color:#b8a682e6;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s ease;padding:0;position:relative;transform-origin:center center;box-shadow:0 0 8px #b8a68233}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button[_ngcontent-%COMP%]   .control-icon[_ngcontent-%COMP%]{font-style:normal;font-size:14px;line-height:1;display:flex;align-items:center;justify-content:center;height:100%;width:100%}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button[_ngcontent-%COMP%]:hover{transform:scale(1.1);background:#1e2846e6;box-shadow:0 0 12px #b8a6824d;border-color:#b8a68280}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button[_ngcontent-%COMP%]:disabled{opacity:.5;cursor:not-allowed;transform:none}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-button[_ngcontent-%COMP%]{width:38px;height:38px;background:#1e2846e6;border-color:#b8a68266}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-button[_ngcontent-%COMP%]   .control-icon[_ngcontent-%COMP%]{font-size:16px}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-button[_ngcontent-%COMP%]   .play-icon[_ngcontent-%COMP%]{padding-left:2px}.music-player[_ngcontent-%COMP%]   .controls[_ngcontent-%COMP%]   .playback-controls[_ngcontent-%COMP%]   .control-button.play-button.playing[_ngcontent-%COMP%]{background:#283250e6}.music-player[_ngcontent-%COMP%]   .error-message[_ngcontent-%COMP%]{color:#dc6464e6;font-size:.75rem;text-align:center;margin:5px 0;padding:5px;background:#3c14144d;border-radius:4px}.music-player[_ngcontent-%COMP%]   .loading-indicator[_ngcontent-%COMP%]{color:#b8a682b3;font-size:.75rem;text-align:center;margin:10px 0;animation:_ngcontent-%COMP%_pulse 2s infinite}@keyframes _ngcontent-%COMP%_pulse{0%{opacity:.7}50%{opacity:1}to{opacity:.7}}input[type=range][_ngcontent-%COMP%]::-moz-range-thumb{width:10px;height:10px;background:#b8a682cc;border:none;border-radius:50%;cursor:pointer}input[type=range][_ngcontent-%COMP%]::-moz-range-thumb:hover{background:#b8a682}input[type=range][_ngcontent-%COMP%]::-moz-range-track{height:3px;background:#b8a68226;border:none;border-radius:1.5px}input[type=range][_ngcontent-%COMP%]:focus{outline:none}'],changeDetection:0});var Sc=Ks;var Qr=class Qr{constructor(){this.destroy$=new wn;this.isDebugMode=!0;this.DEFAULT_CONFIG={position:{rightPercentage:20,topPercentage:20},isVisible:!0,isDraggable:!0};this.menuStateSubject=new Li(this.DEFAULT_CONFIG);this.errorSubject=new wn;this.loadSavedConfig()}loadSavedConfig(){try{let e=localStorage.getItem("menuConfig");if(e){let t=JSON.parse(e);this.validateConfig(t),this.menuStateSubject.next(t)}}catch(e){this.handleError("CONFIG_ERROR",`Failed to load menu config: ${e instanceof Error?e.message:String(e)}`)}}validateConfig(e){if(!this.isValidPosition(e.position))throw new Error("Invalid menu position");if(typeof e.isVisible!="boolean"||typeof e.isDraggable!="boolean")throw new Error("Invalid menu state properties")}isValidPosition(e){return typeof e.rightPercentage=="number"&&typeof e.topPercentage=="number"&&e.rightPercentage>=0&&e.rightPercentage<=100&&e.topPercentage>=0&&e.topPercentage<=100}handleError(e,t){this.isDebugMode&&console.error(`[MenuService] ${e}: ${t}`),this.errorSubject.next({type:e,message:t})}updatePosition(e,t){try{let n={rightPercentage:Math.max(0,Math.min(100,e)),topPercentage:Math.max(0,Math.min(100,t))},i=this.menuStateSubject.value,r=ui(Ct({},i),{position:n});this.menuStateSubject.next(r),this.saveConfig(r)}catch(n){this.handleError("POSITION_ERROR",`Failed to update menu position: ${n instanceof Error?n.message:String(n)}`)}}toggleVisibility(){try{let e=this.menuStateSubject.value,t=ui(Ct({},e),{isVisible:!e.isVisible});this.menuStateSubject.next(t),this.saveConfig(t)}catch(e){this.handleError("STATE_ERROR",`Failed to toggle menu visibility: ${e instanceof Error?e.message:String(e)}`)}}toggleDraggable(){try{let e=this.menuStateSubject.value,t=ui(Ct({},e),{isDraggable:!e.isDraggable});this.menuStateSubject.next(t),this.saveConfig(t)}catch(e){this.handleError("STATE_ERROR",`Failed to toggle menu draggability: ${e instanceof Error?e.message:String(e)}`)}}saveConfig(e){try{localStorage.setItem("menuConfig",JSON.stringify(e))}catch(t){this.handleError("CONFIG_ERROR",`Failed to save menu config: ${t instanceof Error?t.message:String(t)}`)}}getConfig(){return this.menuStateSubject.value}getMenuConfig(){return this.menuStateSubject.asObservable()}getErrors(){return this.errorSubject.asObservable()}resetConfig(){try{this.menuStateSubject.next(this.DEFAULT_CONFIG),this.saveConfig(this.DEFAULT_CONFIG)}catch(e){this.handleError("CONFIG_ERROR",`Failed to reset menu config: ${e instanceof Error?e.message:String(e)}`)}}ngOnDestroy(){this.isDebugMode&&console.log("[MenuService] Destroying service"),this.destroy$.next(),this.destroy$.complete()}};Qr.\u0275fac=function(t){return new(t||Qr)},Qr.\u0275prov=ze({token:Qr,factory:Qr.\u0275fac,providedIn:"root"});var Cc=Qr;function dx(s,e){if(s&1&&(he(0,"div",16)(1,"div",17),Re(2,"Menu Position (Dev Mode)"),me(),he(3,"div",18),Re(4),Gt(5,"br"),Re(6),me()()),s&2){let t=vt();Ae(4),Fi(" Right: ",t.menuPosition.right.toFixed(2),"%"),Ae(2),Fi(" Top: ",t.menuPosition.top.toFixed(2),"% ")}}function hx(s,e){s&1&&(he(0,"div",27),Re(1,"\u25B6"),me())}function fx(s,e){if(s&1){let t=di();da(0),he(1,"div",19),Bt("click",function(){let i=$t(t).index,r=vt();return Kt(r.onTrackSelected(i))}),Jt(2,hx,2,0,"div",20),he(3,"div",21),Re(4),me(),he(5,"div",22)(6,"div",23),Re(7),me(),he(8,"div",24),Re(9),me()(),he(10,"div",25),Gt(11,"i",26),me()(),ha()}if(s&2){let t=e.$implicit,n=e.index,i=vt();Ae(),An("active",n===i.activeCaseIndex),Ae(),Ze("ngIf",n===i.activeCaseIndex),Ae(2),$n(n+1),Ae(3),$n(t.title),Ae(2),$n(t.artist)}}function px(s,e){if(s&1&&(he(0,"div",28),Re(1),me()),s&2){let t=vt();Ae(),Qd(" ",t.tracks[t.activeCaseIndex].title," - ",t.tracks[t.activeCaseIndex].artist," ")}}function mx(s,e){s&1&&(he(0,"div",28),Re(1," Select a track to begin playback "),me())}function gx(s,e){s&1&&Gt(0,"app-music-player",29)}var Js=class Js{constructor(e,t,n,i){this.menuService=e;this.menuIntegrationService=t;this.elementRef=n;this.cdr=i;this.cdCases=[];this.activeCaseIndex=null;this.trackSelected=new os;this.isDevelopment=!1;this.isDragging=!1;this.startX=0;this.startY=0;this.currentX=0;this.currentY=0;this.destroy$=new wn;this.menuPosition={right:20,top:10};this.tracks=[{title:"SpiralFlip - Phantasia ft. Elli",artist:"SpiralFlip"},{title:"First Steps",artist:"Bigg Milk"},{title:"Altar of the Sword",artist:"Heem"},{title:"A Voyage on the Winds of Change",artist:"Futsuunobito"},{title:"Rohkeutta Etsi\xE4",artist:"Prower"},{title:"Ivory Flowers",artist:"AZALI & Seycara"},{title:"Outer Bygone Ruins",artist:"Qrubey"},{title:"Spiral Into the Abyss",artist:"Luscinia"},{title:"Wandering Breeze",artist:"Gardens & sleepy"},{title:"Mystic Nebula",artist:"\u306F\u304C\u306D"},{title:"Iris",artist:"LucaProject"},{title:"Half-Asleep in the Middle of Bumfuck Nowhere",artist:"Mei Naganowa"},{title:"The Traveller",artist:"ratella"},{title:"Childhood memories",artist:"dystopian tanuki"}];this.currentTrack=null}ngOnInit(){this.isDevelopment&&console.log("[RightSideMenu] Initializing component"),this.applyResponsiveSizing(),this.setupEventListeners(),this.loadMenuConfig(),this.updateCurrentTrack()}ngOnDestroy(){this.isDevelopment&&console.log("[RightSideMenu] Destroying component"),this.destroy$.next(),this.destroy$.complete()}setupEventListeners(){this.menuService.getMenuConfig().pipe(Ni(this.destroy$)).subscribe(e=>{this.isDevelopment&&console.log("[RightSideMenu] Menu config updated:",e),this.menuPosition={right:e.position.rightPercentage*window.innerWidth/100,top:e.position.topPercentage*window.innerHeight/100},this.cdr.markForCheck()}),this.menuIntegrationService.menuVisibilityState.pipe(Ni(this.destroy$)).subscribe(e=>{this.isDevelopment&&console.log(`[RightSideMenu] Menu visibility changed: ${e}`),e?this.onMenuShown():this.onMenuHidden(),this.cdr.markForCheck()})}onMenuShown(){this.applyResponsiveSizing(),setTimeout(()=>{this.cdr.markForCheck()},50)}onMenuHidden(){}loadMenuConfig(){let e=this.menuService.getConfig();e?.position&&(this.menuPosition={right:e.position.rightPercentage*window.innerWidth/100,top:e.position.topPercentage*window.innerHeight/100},this.cdr.markForCheck())}handleResize(){this.applyResponsiveSizing(),this.cdr.markForCheck()}applyResponsiveSizing(){let e=window.innerWidth,t=window.innerHeight;this.isDevelopment&&console.log(`[RightSideMenu] Viewport dimensions: ${e}x${t}`),this.menuPosition={right:e>1920?5:20,top:t>1080?5:20},this.cdr.markForCheck()}updateCurrentTrack(){this.activeCaseIndex!==null&&this.activeCaseIndex>=0&&this.activeCaseIndex<this.tracks.length?this.currentTrack=this.tracks[this.activeCaseIndex]:this.currentTrack=null,this.cdr.markForCheck()}onTrackSelected(e){this.isDevelopment&&console.log(`[RightSideMenu] Track selected: ${e}`),this.trackSelected.emit(e),this.activeCaseIndex=e,this.updateCurrentTrack()}onDragStart(e){if(!this.isDevelopment)return;let t=e.target;t.classList.contains("track-item")||t.closest(".track-item")||t.classList.contains("music-player-container")||t.closest(".music-player-container")||t.tagName.toLowerCase()==="button"||t.closest("button")||(this.isDragging=!0,this.startX=e.clientX,this.startY=e.clientY,this.currentX=this.menuPosition.right,this.currentY=this.menuPosition.top,this.elementRef.nativeElement.classList.add("dragging"),e.preventDefault())}onDragMove(e){if(!this.isDragging)return;let t=e.clientX-this.startX,n=e.clientY-this.startY;this.menuPosition={right:Math.max(0,this.currentX-t),top:Math.max(0,this.currentY+n)},this.cdr.markForCheck()}onDragEnd(){if(!this.isDragging)return;this.isDragging=!1,this.elementRef.nativeElement.classList.remove("dragging");let e=this.menuPosition.right/window.innerWidth*100,t=this.menuPosition.top/window.innerHeight*100;this.menuService.updatePosition(e,t)}};Js.\u0275fac=function(t){return new(t||Js)(et(Cc),et(Un),et(Wd),et(Kn))},Js.\u0275cmp=Tn({type:Js,selectors:[["app-right-side-menu"]],hostBindings:function(t,n){t&1&&Bt("resize",function(){return n.handleResize()},lo)("mousedown",function(r){return n.onDragStart(r)})("mousemove",function(r){return n.onDragMove(r)},Oc)("mouseup",function(){return n.onDragEnd()},Oc)},inputs:{cdCases:"cdCases",activeCaseIndex:"activeCaseIndex"},outputs:{trackSelected:"trackSelected"},decls:20,vars:5,consts:[[1,"futuristic-menu"],[1,"magical-particles"],[1,"circuit-lines"],[1,"magical-runes"],[1,"glow-effect"],["class","debug-panel",4,"ngIf"],[1,"menu-header"],[1,"menu-title","responsive-text"],[1,"menu-subtitle","responsive-text"],[1,"tracklist-container"],[1,"tracklist-grid"],[4,"ngFor","ngForOf"],[1,"now-playing"],[1,"now-playing-label","responsive-text"],["class","current-track responsive-text",4,"ngIf"],["class","music-player-container",4,"ngIf"],[1,"debug-panel"],[1,"debug-title"],[1,"debug-coordinates"],[1,"track-item","responsive-container",3,"click"],["class","selector-arrow",4,"ngIf"],[1,"track-number","responsive-text"],[1,"track-info"],[1,"track-title","responsive-text"],[1,"track-artist","responsive-text"],[1,"play-icon"],[1,"fas","fa-play"],[1,"selector-arrow"],[1,"current-track","responsive-text"],[1,"music-player-container"]],template:function(t,n){t&1&&(he(0,"div",0),Gt(1,"div",1)(2,"div",2)(3,"div",3)(4,"div",4),Jt(5,dx,7,2,"div",5),he(6,"header",6)(7,"h1",7),Re(8,"PHANTASIA"),me(),he(9,"h2",8),Re(10,"SOUNDTRACK"),me()(),he(11,"section",9)(12,"div",10),Jt(13,fx,12,6,"ng-container",11),me()(),he(14,"footer",12)(15,"div",13),Re(16,"NOW PLAYING"),me(),Jt(17,px,2,2,"div",14)(18,mx,2,0,"div",14),me(),Jt(19,gx,1,0,"app-music-player",15),me()),t&2&&(Ae(5),Ze("ngIf",n.isDevelopment),Ae(8),Ze("ngForOf",n.tracks),Ae(4),Ze("ngIf",n.activeCaseIndex!==null&&n.activeCaseIndex>=0&&n.activeCaseIndex<n.tracks.length),Ae(),Ze("ngIf",n.activeCaseIndex===null||n.activeCaseIndex<0||n.activeCaseIndex>=n.tracks.length),Ae(),Ze("ngIf",n.activeCaseIndex!==null&&n.activeCaseIndex>=0))},dependencies:[Rn,ga,Ui,Sc],styles:['@charset "UTF-8";[_nghost-%COMP%]{display:block;width:100%;height:100%;color:#fff;font-family:Quicksand,sans-serif;overflow:hidden;pointer-events:auto;-webkit-user-select:none;user-select:none;transform:rotate(0);box-sizing:border-box;font-size:16px}.hidden[_nghost-%COMP%]{pointer-events:none!important;visibility:hidden;opacity:0}.visible[_nghost-%COMP%]{pointer-events:auto;visibility:visible;opacity:1}.futuristic-menu[_ngcontent-%COMP%]{position:relative;width:100%;height:100%;background:#000000d9;border-radius:8px;overflow:hidden;cursor:move}.debug-panel[_ngcontent-%COMP%]{position:absolute;top:0;left:0;background:#000c;padding:8px;border-radius:0 0 4px;font-family:monospace;font-size:12px;color:#0f0;border:1px solid rgba(0,255,0,.3);z-index:1001;pointer-events:none}.debug-panel[_ngcontent-%COMP%]   .debug-title[_ngcontent-%COMP%]{font-weight:700;margin-bottom:4px;color:#0f0}.debug-panel[_ngcontent-%COMP%]   .debug-coordinates[_ngcontent-%COMP%]{color:#0f0;line-height:1.4}.menu-header[_ngcontent-%COMP%]{padding:20px;text-align:center;background:transparent}.menu-header[_ngcontent-%COMP%]   .menu-title[_ngcontent-%COMP%]{font-size:2em;color:#fff;margin:0;letter-spacing:.2em;text-shadow:0 0 10px rgba(255,255,255,.5)}.menu-header[_ngcontent-%COMP%]   .menu-subtitle[_ngcontent-%COMP%]{font-size:1em;color:#aaa;margin:5px 0 0;letter-spacing:.1em}@keyframes _ngcontent-%COMP%_floatParticle{0%{transform:translateY(0) translate(0);opacity:0}50%{opacity:.8}to{transform:translateY(-20px) translate(10px);opacity:0}}@keyframes _ngcontent-%COMP%_pulse{0%{box-shadow:0 0 5px #b8a6824d,0 0 10px #b8a68233}50%{box-shadow:0 0 15px #b8a68280,0 0 20px #b8a68266}to{box-shadow:0 0 5px #b8a6824d,0 0 10px #b8a68233}}@keyframes _ngcontent-%COMP%_glow{0%{opacity:.3}50%{opacity:.6}to{opacity:.3}}@keyframes _ngcontent-%COMP%_arrow-pulse{0%{transform:translate(0)}50%{transform:translate(3px)}to{transform:translate(0)}}@keyframes _ngcontent-%COMP%_circuit-pulse{0%{opacity:.1}50%{opacity:.3}to{opacity:.1}}@keyframes _ngcontent-%COMP%_edge-glow{0%{box-shadow:inset 0 0 5px #b8a68233}50%{box-shadow:inset 0 0 15px #b8a68266}to{box-shadow:inset 0 0 5px #b8a68233}}@keyframes _ngcontent-%COMP%_selector-rock{0%{transform:translate(0)}50%{transform:translate(6px)}to{transform:translate(0)}}@keyframes _ngcontent-%COMP%_selector-pulse{0%{opacity:.7}50%{opacity:1}to{opacity:.7}}.futuristic-menu[_ngcontent-%COMP%]{display:flex;flex-direction:column;width:100%;height:100%;color:#ffffffe6;background:#0c1424d9;border:1px solid rgba(184,166,130,.2);position:relative;overflow:hidden;box-sizing:border-box;border-radius:8px;animation:_ngcontent-%COMP%_edge-glow 4s infinite;cursor:move}.futuristic-menu[_ngcontent-%COMP%]:before, .futuristic-menu[_ngcontent-%COMP%]:after{content:"";position:absolute;width:80px;height:80px;pointer-events:none;z-index:2}.futuristic-menu[_ngcontent-%COMP%]:before{top:0;left:0;border-top:2px solid rgba(184,166,130,.4);border-left:2px solid rgba(184,166,130,.4);border-top-left-radius:8px;clip-path:polygon(0 0,30px 0,0 30px);background:radial-gradient(circle at 15px 15px,rgba(184,166,130,.2),transparent 40%)}.futuristic-menu[_ngcontent-%COMP%]:after{bottom:0;right:0;border-bottom:2px solid rgba(184,166,130,.4);border-right:2px solid rgba(184,166,130,.4);border-bottom-right-radius:8px;clip-path:polygon(100% 100%,100% calc(100% - 30px),calc(100% - 30px) 100%);background:radial-gradient(circle at calc(100% - 15px) calc(100% - 15px),rgba(184,166,130,.2),transparent 40%)}.futuristic-menu[_ngcontent-%COMP%]   .responsive-text[_ngcontent-%COMP%]{line-height:1.4;letter-spacing:.05em}.futuristic-menu[_ngcontent-%COMP%]   .responsive-container[_ngcontent-%COMP%]{display:flex;align-items:center}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]{flex:1;overflow-y:auto;padding:0 1rem;min-height:0;margin-bottom:.5rem}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]::-webkit-scrollbar{width:6px}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]::-webkit-scrollbar-track{background:#141e3033;border-radius:3px}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb{background:#b8a6824d;border-radius:3px}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]::-webkit-scrollbar-thumb:hover{background:#b8a68280}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]{display:flex;flex-direction:column;gap:.6rem;padding-bottom:.5rem}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item[_ngcontent-%COMP%]{border-radius:3px;background:#1923374d;border:1px solid rgba(184,166,130,.15);display:flex;align-items:center;gap:1rem;cursor:pointer;transition:all .2s ease;position:relative;overflow:hidden;padding:.6rem 1rem .6rem 3rem}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item[_ngcontent-%COMP%]   .selector-arrow[_ngcontent-%COMP%]{position:absolute;left:.8rem;color:#b8a682;font-size:1.4rem;animation:_ngcontent-%COMP%_selector-rock 1.2s infinite ease-in-out,_ngcontent-%COMP%_selector-pulse 1.5s infinite;text-shadow:0 0 8px rgba(184,166,130,.8);pointer-events:none;z-index:2;font-family:monospace;line-height:1;transform-origin:center;font-weight:700}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item[_ngcontent-%COMP%]:before{content:"";position:absolute;top:0;left:0;width:3px;height:100%;background:#b8a682;opacity:0;transition:opacity .2s ease}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item[_ngcontent-%COMP%]:hover{background:#232d4180;border-color:#b8a6824d}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item[_ngcontent-%COMP%]:hover   .play-icon[_ngcontent-%COMP%]{opacity:.8}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item.active[_ngcontent-%COMP%]{background:#2d374bb3;border-color:#b8a68280}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item.active[_ngcontent-%COMP%]:before{opacity:1}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item.active[_ngcontent-%COMP%]   .track-title[_ngcontent-%COMP%], .futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item.active[_ngcontent-%COMP%]   .track-artist[_ngcontent-%COMP%], .futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item.active[_ngcontent-%COMP%]   .track-number[_ngcontent-%COMP%]{color:#b8a682}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item.active[_ngcontent-%COMP%]   .play-icon[_ngcontent-%COMP%]{opacity:1}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item[_ngcontent-%COMP%]   .track-number[_ngcontent-%COMP%]{font-size:.9rem;font-weight:700;color:#b8a68299;min-width:1.5rem;text-align:center}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item[_ngcontent-%COMP%]   .track-info[_ngcontent-%COMP%]{flex:1}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item[_ngcontent-%COMP%]   .track-info[_ngcontent-%COMP%]   .track-title[_ngcontent-%COMP%]{font-size:1rem;font-weight:500;color:#ffffffd9;margin-bottom:.3rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .2s ease}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item[_ngcontent-%COMP%]   .track-info[_ngcontent-%COMP%]   .track-artist[_ngcontent-%COMP%]{font-size:.8rem;color:#b8a68299;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;transition:color .2s ease}.futuristic-menu[_ngcontent-%COMP%]   .tracklist-container[_ngcontent-%COMP%]   .tracklist-grid[_ngcontent-%COMP%]   .track-item[_ngcontent-%COMP%]   .play-icon[_ngcontent-%COMP%]{font-size:1rem;color:#b8a682;opacity:.3;transition:opacity .2s ease}.futuristic-menu[_ngcontent-%COMP%]   .now-playing[_ngcontent-%COMP%]{padding:1rem;background:#0f192acc;border-top:1px solid rgba(184,166,130,.2);margin-top:auto}.futuristic-menu[_ngcontent-%COMP%]   .now-playing[_ngcontent-%COMP%]   .now-playing-label[_ngcontent-%COMP%]{font-size:.75rem;color:#b8a682b3;margin-bottom:.5rem;letter-spacing:.1em}.futuristic-menu[_ngcontent-%COMP%]   .now-playing[_ngcontent-%COMP%]   .now-playing-label[_ngcontent-%COMP%]:before, .futuristic-menu[_ngcontent-%COMP%]   .now-playing[_ngcontent-%COMP%]   .now-playing-label[_ngcontent-%COMP%]:after{content:"\\2756";margin:0 .5rem;font-size:.6rem;vertical-align:middle}.futuristic-menu[_ngcontent-%COMP%]   .now-playing[_ngcontent-%COMP%]   .current-track[_ngcontent-%COMP%]{font-size:1rem;color:#b8a682;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.futuristic-menu[_ngcontent-%COMP%]   .music-player-container[_ngcontent-%COMP%]{padding:0 1rem 1rem}.futuristic-menu[_ngcontent-%COMP%]   .magical-particles[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-1;background-image:radial-gradient(circle at 85% 15%,rgba(184,166,130,.1) 1px,transparent 1px),radial-gradient(circle at 15% 85%,rgba(184,166,130,.1) 1px,transparent 1px),radial-gradient(circle at 50% 50%,rgba(184,166,130,.05) 1px,transparent 2px);background-size:40px 40px,40px 40px,60px 60px;animation:_ngcontent-%COMP%_floatParticle 20s infinite linear}.futuristic-menu[_ngcontent-%COMP%]   .circuit-lines[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-2;background-image:linear-gradient(90deg,transparent 98%,rgba(184,166,130,.1) 98%,rgba(184,166,130,.1) 99%,transparent 99%),linear-gradient(180deg,transparent 98%,rgba(184,166,130,.1) 98%,rgba(184,166,130,.1) 99%,transparent 99%);background-size:50px 50px;opacity:.5;mix-blend-mode:overlay}.futuristic-menu[_ngcontent-%COMP%]   .magical-runes[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-3;opacity:.2;background-image:radial-gradient(circle at 10% 10%,rgba(184,166,130,.2) 3px,transparent 4px),radial-gradient(circle at 90% 90%,rgba(184,166,130,.2) 3px,transparent 4px),radial-gradient(circle at 90% 10%,rgba(184,166,130,.2) 3px,transparent 4px),radial-gradient(circle at 10% 90%,rgba(184,166,130,.2) 3px,transparent 4px);background-size:150px 150px}.futuristic-menu[_ngcontent-%COMP%]   .glow-effect[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:-4;background:radial-gradient(circle at center,rgba(184,166,130,.03) 0%,transparent 70%),radial-gradient(circle at 80% 20%,rgba(184,166,130,.05) 0%,transparent 60%);opacity:.8;mix-blend-mode:screen}.menu-frame[_ngcontent-%COMP%]{display:flex;flex-direction:column;height:100%;padding:1.2rem;position:relative;z-index:2}.tracklist-grid[_ngcontent-%COMP%]:not(.futuristic-menu .tracklist-grid){display:flex;flex-direction:column;gap:.8rem;margin-bottom:1.2rem;flex:1;max-height:calc(100% - 13rem);overflow-y:auto;padding-right:10px;position:relative}.tracklist-grid[_ngcontent-%COMP%]:not(.futuristic-menu .tracklist-grid)::-webkit-scrollbar{width:6px}.tracklist-grid[_ngcontent-%COMP%]:not(.futuristic-menu .tracklist-grid)::-webkit-scrollbar-track{background:#b8a6820d;border-radius:3px}.tracklist-grid[_ngcontent-%COMP%]:not(.futuristic-menu .tracklist-grid)::-webkit-scrollbar-thumb{background:#b8a68233;border-radius:3px}.tracklist-grid[_ngcontent-%COMP%]:not(.futuristic-menu .tracklist-grid)::-webkit-scrollbar-thumb:hover{background:#b8a6824d}.track-item[_ngcontent-%COMP%]{display:flex;align-items:center;padding:.8rem;border:1px solid rgba(184,166,130,.1);background:#1e284199;border-radius:4px;cursor:pointer;transition:all .2s ease;position:relative;overflow:hidden;min-height:2.5rem}.track-item[_ngcontent-%COMP%]:before{content:"";position:absolute;left:0;top:0;bottom:0;width:3px;background:#b8a68233;transition:all .3s ease}.track-item[_ngcontent-%COMP%]:hover{background:#283250b3;border-color:#b8a6824d;transform:translateY(-2px)}.track-item[_ngcontent-%COMP%]:hover   .track-arrow[_ngcontent-%COMP%]{opacity:.8;animation:_ngcontent-%COMP%_arrow-pulse 1s infinite}.track-item[_ngcontent-%COMP%]:hover:before{background:#b8a68266}.track-item.active[_ngcontent-%COMP%]{background:#323c5fb3;border-color:#b8a68280;animation:_ngcontent-%COMP%_pulse 2s infinite}.track-item.active[_ngcontent-%COMP%]   .track-arrow[_ngcontent-%COMP%]{opacity:1;color:#b8a682}.track-item.active[_ngcontent-%COMP%]   .track-number[_ngcontent-%COMP%]{color:#b8a682}.track-item.active[_ngcontent-%COMP%]   .track-title[_ngcontent-%COMP%]{color:#fff;font-weight:600;text-shadow:0 0 5px rgba(184,166,130,.5)}.track-item.active[_ngcontent-%COMP%]:before{background:#b8a68299}.track-arrow[_ngcontent-%COMP%]{flex:0 0 24px;font-size:1rem;opacity:.4;color:#b8a682b3;margin-right:8px;transition:all .3s ease}.track-number[_ngcontent-%COMP%]{flex:0 0 2.5rem;color:#b8a682b3;font-size:.9rem;font-weight:600;text-align:center;font-family:Cinzel,serif}.track-content[_ngcontent-%COMP%]{flex:1;overflow:hidden;min-width:0}.track-title[_ngcontent-%COMP%]{font-size:1rem;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#ffffffe6;margin-bottom:.3rem;line-height:1.2}.track-artist[_ngcontent-%COMP%]{font-size:.8rem;font-weight:300;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;color:#b8a68299;line-height:1.2}.menu-footer[_ngcontent-%COMP%]{margin-top:auto;padding-top:.8rem;position:relative}.menu-footer[_ngcontent-%COMP%]:before{content:"";position:absolute;top:0;left:15%;width:70%;height:1px;background:#b8a68233}.menu-footer[_ngcontent-%COMP%]   .music-section[_ngcontent-%COMP%]{text-align:center}.menu-footer[_ngcontent-%COMP%]   .music-section[_ngcontent-%COMP%]   .section-heading[_ngcontent-%COMP%]{font-size:1rem;margin:.3rem 0;font-weight:600;color:#b8a682cc;letter-spacing:.05em;font-family:Cinzel,serif;position:relative;display:inline-block}.menu-footer[_ngcontent-%COMP%]   .music-section[_ngcontent-%COMP%]   .section-heading[_ngcontent-%COMP%]:before, .menu-footer[_ngcontent-%COMP%]   .music-section[_ngcontent-%COMP%]   .section-heading[_ngcontent-%COMP%]:after{content:"";position:absolute;top:50%;width:15px;height:15px;border:1px solid rgba(184,166,130,.4);transform:translateY(-50%)}.menu-footer[_ngcontent-%COMP%]   .music-section[_ngcontent-%COMP%]   .section-heading[_ngcontent-%COMP%]:before{left:-25px;border-right:none;border-bottom:none}.menu-footer[_ngcontent-%COMP%]   .music-section[_ngcontent-%COMP%]   .section-heading[_ngcontent-%COMP%]:after{right:-25px;border-left:none;border-top:none}.menu-footer[_ngcontent-%COMP%]   .music-player-wrapper[_ngcontent-%COMP%]{margin-top:.8rem;background:#1e28414d;border:1px solid rgba(184,166,130,.2);border-radius:8px;position:relative;padding:.2rem}.menu-footer[_ngcontent-%COMP%]   .music-player-wrapper[_ngcontent-%COMP%]:before, .menu-footer[_ngcontent-%COMP%]   .music-player-wrapper[_ngcontent-%COMP%]:after{content:"";position:absolute;background:#b8a68233;height:1px}.menu-footer[_ngcontent-%COMP%]   .music-player-wrapper[_ngcontent-%COMP%]:before{top:-3px;left:30%;width:40%}.menu-footer[_ngcontent-%COMP%]   .music-player-wrapper[_ngcontent-%COMP%]:after{bottom:-3px;left:30%;width:40%}.menu-footer[_ngcontent-%COMP%]   .music-player-wrapper[_ngcontent-%COMP%]   .corner[_ngcontent-%COMP%]{position:absolute;width:10px;height:10px;border:1px solid rgba(184,166,130,.3)}.menu-footer[_ngcontent-%COMP%]   .music-player-wrapper[_ngcontent-%COMP%]   .corner.top-left[_ngcontent-%COMP%]{top:-1px;left:-1px;border-bottom:none;border-right:none;border-top-left-radius:4px}.menu-footer[_ngcontent-%COMP%]   .music-player-wrapper[_ngcontent-%COMP%]   .corner.top-right[_ngcontent-%COMP%]{top:-1px;right:-1px;border-bottom:none;border-left:none;border-top-right-radius:4px}.menu-footer[_ngcontent-%COMP%]   .music-player-wrapper[_ngcontent-%COMP%]   .corner.bottom-left[_ngcontent-%COMP%]{bottom:-1px;left:-1px;border-top:none;border-right:none;border-bottom-left-radius:4px}.menu-footer[_ngcontent-%COMP%]   .music-player-wrapper[_ngcontent-%COMP%]   .corner.bottom-right[_ngcontent-%COMP%]{bottom:-1px;right:-1px;border-top:none;border-left:none;border-bottom-right-radius:4px}.debug-controls[_ngcontent-%COMP%]{position:absolute;bottom:10px;right:10px;z-index:9999;display:flex;flex-direction:column;gap:5px;background:#00000080;padding:5px;border-radius:5px}.debug-button[_ngcontent-%COMP%]{background:#000000b3;color:#fff;border:1px solid #555;padding:5px 10px;border-radius:4px;cursor:pointer;font-size:12px;width:100px;text-align:center}.debug-button[_ngcontent-%COMP%]:hover{background:#282828cc}.menu-header[_ngcontent-%COMP%], .debug-panel[_ngcontent-%COMP%]{cursor:move}.menu-header[_ngcontent-%COMP%]:hover{background:#000000b3}.menu-content[_ngcontent-%COMP%]{position:relative;z-index:1}.futuristic-menu[_ngcontent-%COMP%]{cursor:move}.futuristic-menu[_ngcontent-%COMP%]   .track-item[_ngcontent-%COMP%], .futuristic-menu[_ngcontent-%COMP%]   .music-player-container[_ngcontent-%COMP%], .futuristic-menu[_ngcontent-%COMP%]   button[_ngcontent-%COMP%], .futuristic-menu[_ngcontent-%COMP%]   a[_ngcontent-%COMP%]{cursor:pointer}'],changeDetection:0});var aa=Js;var es=class es{constructor(e,t,n,i,r,o){this.rendererFactory=e;this.appRef=t;this.componentFactoryResolver=n;this.injector=i;this.ngZone=r;this.http=o;this.destroy$=new wn;this.isDebugMode=!0;this.menuVisible=!1;this.menuVisibilityState=new Li(!1);this.viewportWidth=window.innerWidth;this.viewportHeight=window.innerHeight;this.menuConfig={position:{rightPercentage:5,topPercentage:5,minRightPercentage:5,maxRightPercentage:15},size:{maxWidth:650,widthPercentage:35,heightPercentage:80},transformOrigin:"top right",zIndex:1e3};this.menuElement=null;this.componentRef=null;this.isMenuVisible=!1;this.originalMenuContainer=null;this.menuPosition={x:0,y:0,z:0};this.menuRotation={x:0,y:0,z:0};this.menuSize={width:0,height:0};this.resizeListener=null;this.renderer=e.createRenderer(null,null),this.isDebugMode&&console.log("[MenuIntegration] Service initialized"),this.setupResizeListener(),this.loadMenuConfiguration()}setupResizeListener(){window.addEventListener("resize",this.handleResize.bind(this)),this.isDebugMode&&console.log("[MenuIntegration] Resize listener set up")}loadMenuConfiguration(){this.isDebugMode&&console.log("[MenuIntegration] Attempting to load menu configuration");let e=new Date().getTime();this.http.get(`src/app/tools/right-side-menu/config/menu-config.json?t=${e}`).pipe(Ni(this.destroy$)).subscribe(t=>{t&&t.rightSideMenu?(this.menuConfig=t.rightSideMenu,this.isDebugMode&&console.log("[MenuIntegration] Configuration loaded successfully:",this.menuConfig),this.menuContainer&&this.updateMenuDimensions()):(console.error("[MenuIntegration] Config loaded but rightSideMenu property not found:",t),this.loadAlternateConfig(e))},t=>{console.error("[MenuIntegration] Error loading configuration from primary path:",t),this.loadAlternateConfig(e)})}loadAlternateConfig(e){this.isDebugMode&&console.log("[MenuIntegration] Attempting to load from alternate path"),this.http.get(`assets/app/tools/right-side-menu/config/menu-config.json?t=${e}`).pipe(Ni(this.destroy$)).subscribe(t=>{t&&t.rightSideMenu?(this.menuConfig=t.rightSideMenu,this.isDebugMode&&console.log("[MenuIntegration] Configuration loaded from alternate path:",this.menuConfig),this.menuContainer&&this.updateMenuDimensions()):console.error("[MenuIntegration] Alternate config loaded but rightSideMenu property not found:",t)},t=>{console.error("[MenuIntegration] Error loading from alternate path:",t),console.log("[MenuIntegration] Using default menu configuration")})}ngOnDestroy(){this.isDebugMode&&console.log("[MenuIntegration] Destroying service"),window.removeEventListener("resize",this.handleResize.bind(this)),this.removeResizeHandler(),this.componentRef&&(this.appRef.detachView(this.componentRef.hostView),this.componentRef.destroy(),this.componentRef=null),this.menuContainer&&this.menuContainer.parentNode&&this.menuContainer.parentNode.removeChild(this.menuContainer);let e=document.querySelector("style.menu-container-style");e&&e.parentNode&&e.parentNode.removeChild(e),this.menuVisibilityState.complete(),this.destroy$.next(),this.destroy$.complete()}handleResize(){this.viewportWidth=window.innerWidth,this.viewportHeight=window.innerHeight,this.menuContainer&&this.menuVisible&&this.updateMenuDimensions()}updateMenuDimensions(){let e=this.menuConfig.size.maxWidth,t=this.menuConfig.size.widthPercentage,n=this.menuConfig.size.heightPercentage,i=this.menuConfig.position.rightPercentage,r=this.menuConfig.position.topPercentage,o=Math.min(e,this.viewportWidth*(t/100)),l=this.viewportHeight*(n/100);console.log(`Applying menu position: right=${i}%, top=${r}%`),this.renderer.setStyle(this.menuContainer,"width",`${o}px`),this.renderer.setStyle(this.menuContainer,"height",`${l}px`),this.renderer.setStyle(this.menuContainer,"right",`${i}%`),this.renderer.setStyle(this.menuContainer,"left","auto"),this.renderer.setStyle(this.menuContainer,"top",`${r}%`),this.renderer.setStyle(this.menuContainer,"z-index",this.menuConfig.zIndex.toString()),this.originalMenuContainer&&(this.renderer.setStyle(this.originalMenuContainer,"width",`${o}px`),this.renderer.setStyle(this.originalMenuContainer,"height",`${l}px`),this.renderer.setStyle(this.originalMenuContainer,"right","0"),this.renderer.setStyle(this.originalMenuContainer,"top","0"));let u=document.querySelector("style.menu-container-style");u&&u.parentNode?.removeChild(u);let d=this.renderer.createElement("style");this.renderer.addClass(d,"menu-container-style"),d.textContent=`
      .menu-container {
        position: fixed;
        width: ${e}px;
        height: ${n}%;
        right: ${i}%;
        top: ${r}%;
        z-index: ${this.menuConfig.zIndex};
        overflow: hidden;
        transition: opacity 0.5s ease, pointer-events 0s;
      }
      .menu-container.hidden {
        opacity: 0;
        pointer-events: none !important;
        visibility: hidden;
      }
      .menu-container.visible {
        opacity: 1;
        pointer-events: auto !important;
        visibility: visible;
      }
    `,this.renderer.appendChild(document.head,d)}initMenuContainer(){if(!this.menuContainer){this.menuContainer=this.renderer.createElement("div"),this.renderer.addClass(this.menuContainer,"menu-container");let e=document.body;this.renderer.appendChild(e,this.menuContainer),this.setMenuVisibility(!1),this.updateMenuDimensions()}}setMenuVisibility(e){this.menuVisible!==e&&(this.menuVisible=e,this.menuVisibilityState.next(e),this.menuContainer&&(this.renderer.removeClass(this.menuContainer,"visible"),this.renderer.removeClass(this.menuContainer,"hidden"),e?(this.renderer.addClass(this.menuContainer,"visible"),this.renderer.setStyle(this.menuContainer,"pointer-events","auto")):(this.renderer.addClass(this.menuContainer,"hidden"),this.renderer.setStyle(this.menuContainer,"pointer-events","none"))),this.originalMenuContainer&&(this.renderer.setStyle(this.originalMenuContainer,"opacity",e?"1":"0"),this.renderer.setStyle(this.originalMenuContainer,"pointer-events",e?"auto":"none"),this.isMenuVisible=e))}getMenuContainer(){return this.menuContainer}updateActiveCase(e){this.componentRef&&(this.componentRef.instance.activeCaseIndex=e,this.componentRef.changeDetectorRef.detectChanges())}createMenuObject(e,t,n,i){this.initMenuContainer();let r=this.componentFactoryResolver.resolveComponentFactory(aa);this.componentRef=r.create(this.injector),this.componentRef.instance.cdCases=n,this.componentRef.instance.trackSelected.subscribe(f=>{i&&i(f)}),this.appRef.attachView(this.componentRef.hostView),this.menuElement=this.componentRef.location.nativeElement,this.menuPosition={x:t.position.x,y:t.position.y,z:t.position.z},this.menuRotation={x:t.rotation.x,y:t.rotation.y,z:t.rotation.z},this.menuSize={width:t.size.width,height:t.size.height},this.originalMenuContainer=document.createElement("div"),this.renderer.addClass(this.originalMenuContainer,"menu-overlay-container");let o=window.innerWidth,l=window.innerHeight,u=Math.min(this.menuConfig.size.maxWidth,o*(this.menuConfig.size.widthPercentage/100)),d=Math.round(l*(this.menuConfig.size.heightPercentage/100));this.menuSize={width:u,height:d},this.renderer.setStyle(this.originalMenuContainer,"width",`${u}px`),this.renderer.setStyle(this.originalMenuContainer,"height",`${d}px`);let a=Math.min(o/1920,l/1080);this.renderer.setStyle(this.originalMenuContainer,"transform",`scale(${a})`),this.renderer.setStyle(this.originalMenuContainer,"transform-origin",this.menuConfig.transformOrigin),this.renderer.setStyle(this.originalMenuContainer,"position","absolute"),this.renderer.setStyle(this.originalMenuContainer,"right","0"),this.renderer.setStyle(this.originalMenuContainer,"top","0");let c=this.menuVisible?"auto":"none";this.renderer.setStyle(this.originalMenuContainer,"pointer-events",c);let h=this.menuVisible?"1":"0";if(this.renderer.setStyle(this.originalMenuContainer,"opacity",h),this.renderer.appendChild(this.originalMenuContainer,this.menuElement),this.menuContainer){for(;this.menuContainer.firstChild;)this.renderer.removeChild(this.menuContainer,this.menuContainer.firstChild);this.renderer.appendChild(this.menuContainer,this.originalMenuContainer)}return this.setupResizeHandler(),this.setMenuVisibility(this.menuVisible),this.originalMenuContainer}update3DMenuPosition(e){}setupResizeHandler(){this.removeResizeHandler(),this.resizeListener=()=>{this.ngZone.run(()=>{if(this.originalMenuContainer){let e=window.innerWidth,t=window.innerHeight,n=Math.min(this.menuConfig.size.maxWidth,e*(this.menuConfig.size.widthPercentage/100)),i=Math.round(t*(this.menuConfig.size.heightPercentage/100));this.menuSize={width:n,height:i},this.renderer.setStyle(this.originalMenuContainer,"width",`${n}px`),this.renderer.setStyle(this.originalMenuContainer,"height",`${i}px`);let r=Math.min(e/1920,t/1080);this.renderer.setStyle(this.originalMenuContainer,"transform",`scale(${r})`),this.renderer.setStyle(this.originalMenuContainer,"right","0"),this.renderer.setStyle(this.originalMenuContainer,"top","0");let o=this.menuConfig.position.rightPercentage,l=this.menuConfig.position.topPercentage;console.log(`Resize handler: Setting menu position right=${o}%, top=${l}%`),this.renderer.setStyle(this.menuContainer,"right",`${o}%`),this.renderer.setStyle(this.menuContainer,"top",`${l}%`)}})},window.addEventListener("resize",this.resizeListener)}removeResizeHandler(){this.resizeListener&&(window.removeEventListener("resize",this.resizeListener),this.resizeListener=null)}destroy(){if(this.removeResizeHandler(),this.componentRef&&(this.appRef.detachView(this.componentRef.hostView),this.componentRef.destroy(),this.componentRef=null),this.originalMenuContainer&&this.originalMenuContainer.parentNode&&(this.originalMenuContainer.parentNode.removeChild(this.originalMenuContainer),this.originalMenuContainer=null),this.menuElement){let e=this.menuElement.parentNode;e&&e.removeChild(this.menuElement),this.menuElement=null}this.menuContainer&&this.menuContainer.parentNode&&this.renderer.removeChild(this.menuContainer.parentNode,this.menuContainer)}createMenu(e=1){if(!this.componentRef&&(this.initMenuContainer(),!this.componentRef)){console.log("Creating right-side menu component");let t=this.componentFactoryResolver.resolveComponentFactory(aa);if(this.componentRef=t.create(this.injector),this.appRef.attachView(this.componentRef.hostView),this.menuElement=this.componentRef.location.nativeElement,this.menuContainer&&this.menuElement){for(;this.menuContainer.firstChild;)this.renderer.removeChild(this.menuContainer,this.menuContainer.firstChild);this.renderer.appendChild(this.menuContainer,this.menuElement),console.log("Right-side menu component added to DOM container")}else console.error("Menu container or menu element not found")}}setMenuConfig(e){console.log("Menu configuration being set directly:",e),this.menuConfig=e,this.menuContainer&&(this.updateMenuDimensions(),console.log("Menu dimensions updated with directly set config"))}reloadMenuConfig(){console.log("Manually reloading menu configuration..."),this.loadMenuConfiguration()}updateMenuPosition(e,t){if(!this.menuConfig||!this.menuConfig.position){console.warn("[MenuIntegration] Cannot update menu position: Config not properly initialized");return}if(["rightPercentage","topPercentage","minRightPercentage","maxRightPercentage"].includes(e)){let i=e;this.menuConfig.position[i]=t,this.updateMenuDimensions(),this.isDebugMode&&console.log(`[MenuIntegration] Position updated: ${e} = ${t}`)}else console.warn(`[MenuIntegration] Unknown position property: ${e}`)}getConfig(){return this.menuConfig}updateMenuDimensionsWithCurrentConfig(){if(!this.menuContainer||!this.menuConfig)return;let e=this.menuConfig.position,t=this.menuConfig.size,n=`${e.rightPercentage}%`,i=`${e.topPercentage}%`,r=window.innerWidth,o=Math.min(r*t.widthPercentage/100,t.maxWidth);this.menuContainer.style.position="absolute",this.menuContainer.style.right=n,this.menuContainer.style.top=i,this.menuContainer.style.width=`${o}px`,this.menuContainer.style.height=`${t.heightPercentage}%`,this.menuContainer.style.transformOrigin=this.menuConfig.transformOrigin,this.menuContainer.style.zIndex=this.menuConfig.zIndex.toString(),this.menuContainer.setAttribute("data-right-percent",e.rightPercentage.toString()),this.menuContainer.setAttribute("data-top-percent",e.topPercentage.toString()),this.originalMenuContainer&&(this.originalMenuContainer.style.position="absolute",this.originalMenuContainer.style.top="0",this.originalMenuContainer.style.right="0",this.originalMenuContainer.style.width="100%",this.originalMenuContainer.style.height="100%")}};es.\u0275fac=function(t){return new(t||es)(Be(qd),Be(jd),Be(Yd),Be(Vd),Be(ua),Be(_a))},es.\u0275prov=ze({token:es,factory:es.\u0275fac,providedIn:"root"});var Un=es;var ts=class ts{constructor(e,t,n,i,r,o){this.videoService=e;this.rendererService=t;this.menuIntegrationService=n;this.silhouetteService=i;this.caseAnimationService=r;this.sceneService=o}setupCSS3DRenderer(e){let t=new xc;return t.setSize(window.innerWidth,window.innerHeight),t.domElement.style.position="absolute",t.domElement.style.top="0",t.domElement.style.left="0",t.domElement.style.pointerEvents="none",t.domElement.style.zIndex="1",e.nativeElement.appendChild(t.domElement),t}setupRightSideMenu(e,t,n,i,r){let o=t.sceneSettings.videoPlane,l=this.menuIntegrationService.createMenuObject(e,o,n,r);return this.menuIntegrationService.setMenuVisibility(!1),l}revealVideoAndBackground(e,t,n){let i=t.findIndex(r=>r.isActive);if(i>=0){if(console.log(`revealVideoAndBackground: Showing menu for active case index ${i}`),this.menuIntegrationService.createMenu(),this.menuIntegrationService.setMenuVisibility(!0),this.menuIntegrationService.updateActiveCase(i),i>=0&&i<n.length){let r=this.videoService.getUpdateVideoSource(),o=this.videoService.getVideoPlay();r&&r(n[i]),o&&o()}}else console.log("revealVideoAndBackground: No active case found, menu will not be shown");e&&(e.visible=!0)}updateBackgroundEffects(e){this.sceneService.updateBackgroundEffects(e)}removeSilhouetteEffect(e){this.silhouetteService.removeSilhouetteEffect(e)}createSilhouetteWrapper(e,t){this.silhouetteService.createActiveCaseSilhouette(e,t),this.menuIntegrationService.updateActiveCase(e.id)}expandActiveCaseWrapper(e,t,n,i,r,o,l,u){let d=o;this.caseAnimationService.expandActiveCase(e,t,n,i,r,d,this.videoService.resetCaseBackVideoPlane.bind(this.videoService),this.silhouetteService.removeSilhouetteEffect.bind(this.silhouetteService),l,u)}updateVideoForNewActiveCase(e,t,n,i,r,o,l,u){this.menuIntegrationService.updateActiveCase(e),t&&this.menuIntegrationService.setMenuVisibility(!0)}onWindowResize(e,t,n){t.aspect=window.innerWidth/window.innerHeight,t.updateProjectionMatrix(),e.setSize(window.innerWidth,window.innerHeight),n.setSize(window.innerWidth,window.innerHeight)}};ts.\u0275fac=function(t){return new(t||ts)(Be(kn),Be(ai),Be(Un),Be(Fn),Be(oi),Be(Nn))},ts.\u0275prov=ze({token:ts,factory:ts.\u0275fac});var Qs=ts;var ns=class ns{constructor(e,t,n,i,r){this.rendererService=e;this.videoService=t;this.silhouetteService=n;this.eventHandlerService=i;this.sceneService=r}setupRenderer(e,t,n){this.rendererService.setupRenderer(e,t,this.videoService.createCaseBackVideoPlane.bind(this.videoService));let i=this.rendererService.getRenderer(),r=this.rendererService.getScene(),o=this.rendererService.getCamera(),l=this.rendererService.getLights(),u=this.rendererService.getLightHelpers(),d=this.rendererService.getVideoPlane(),a=this.rendererService.getBackgroundPlane(),c=this.rendererService.getCaseBackVideoPlane(),h=this.rendererService.getVideoControls();return this.videoService.setVideoElements(d,a,c,h.play,h.pause,h.updateSource),this.silhouetteService.setScene(r),{renderer:i,scene:r,camera:o,lights:l,lightHelpers:u,videoElements:{rightSideMenuPlane:d,backgroundPlane:a,caseBackVideoPlane:c,videoPlay:h.play,videoPause:h.pause,updateVideoSource:h.updateSource}}}setupControls(e){return this.rendererService.setupControls(e),this.rendererService.getControls()}updateOrbitControls(e,t){e.minPolarAngle=t.orbitMinPolarAngle,e.maxPolarAngle=t.orbitMaxPolarAngle,e.minDistance=t.orbitMinDistance,e.maxDistance=t.orbitMaxDistance,e.dampingFactor=t.orbitDampingFactor}addEventListeners(e,t,n,i,r,o,l,u,d){this.eventHandlerService.addEventListeners(e,t,n,i,r,o,l,u,d)}initializeMusicStatus(e){return new Array(e.length).fill(!1)}initializeTutorialCompletion(e){return new Array(e.length).fill(!1)}loadModelAssets(e,t,n,i,r){return this.loadModel(e,t,n,i.cdCasesService).then(o=>(this.setupScene(o,t,i.stateService,i.videoService,i.silhouetteService,i.videoService.getCaseBackVideoPlane(),!1,null,r.createSilhouette),o))}loadModel(e,t,n,i){return i.loadModels(e,t,n)}setupScene(e,t,n,i,r,o,l,u,d){r.setScene(t),n.setActiveCase(e,0);let a=e.find(c=>c.isActive);a&&(d(a),i.updateVideoPlane2Alignment(o,l,u,e))}};ns.\u0275fac=function(t){return new(t||ns)(Be(ai),Be(kn),Be(Fn),Be(sr),Be(Nn))},ns.\u0275prov=ze({token:ns,factory:ns.\u0275fac});var eo=ns;var is=class is{constructor(e,t,n,i,r,o){this.videoService=e;this.silhouetteService=t;this.sceneService=n;this.stateService=i;this.animationService=r;this.menuIntegrationService=o}animate(e,t,n,i,r,o,l,u,d,a,c,h,f){if(!e)return;this.animationService.updateAnimations(o),d?(o.forEach(_=>{_.id!==a&&(_.position.lerp(_.targetPosition,this.stateService.getPositionLerpFactor()),_.model.position.copy(_.position))}),this.videoService.updateVideoPlane2Alignment(l,d,a,o)):(this.stateService.updatePositions(o),o.findIndex(m=>m.isActive)>=0&&this.videoService.updateVideoPlane2Alignment(l,d,a,o)),this.silhouetteService.updateSilhouetteAnimation(o,h,f),this.sceneService.updateBackgroundAnimations(),i.update(),e.render(t,n),r.render(t,n),l&&(c||d)&&this.videoService.updateVideoPlane2Alignment(l,d,a,o);let g=o.findIndex(_=>_.isActive);g>=0&&c?(this.menuIntegrationService.setMenuVisibility(!0),this.menuIntegrationService.updateActiveCase(g),u&&(u.visible=!1)):(this.menuIntegrationService.setMenuVisibility(!1),u&&(u.visible=!1))}};is.\u0275fac=function(t){return new(t||is)(Be(kn),Be(Fn),Be(Nn),Be(rr),Be(mn),Be(Un))},is.\u0275prov=ze({token:is,factory:is.\u0275fac});var to=is;var rs=class rs{constructor(e){this.debugService=e}updateCamera(e,t,n){this.debugService.updateCamera(e,t,n)}updateLighting(e,t,n,i,r,o){this.debugService.updateLighting(e,t,n,i,r,o)}updateRenderer(e,t){this.debugService.updateRenderer(e,t)}updateOrbitControls(e,t){this.debugService.updateOrbitControls(e,t)}updateGround(e,t){this.debugService.updateGround(e,t)}updateCaseTransform(e){this.debugService.updateCaseTransform(e)}resetToDefault(e,t,n,i,r,o,l,u,d){this.debugService.resetToDefault(e,t,n),i(),r(),o(),l(),u(),n.forEach(a=>d(a))}};rs.\u0275fac=function(t){return new(t||rs)(Be(ir))},rs.\u0275prov=ze({token:rs,factory:rs.\u0275fac});var no=rs;var vx=["canvas"],yx=["labelRenderer"],xx=["backgroundVideo"];function bx(s,e){if(s&1){let t=di();he(0,"div",12),Bt("click",function(){$t(t);let i=vt(2);return Kt(i.forceVideoPlay())}),he(1,"div",13)(2,"div",14),Re(3,"\u25B6"),me(),he(4,"div",15),Re(5,"Click to start background video"),me()()()}}function Mx(s,e){if(s&1){let t=di();he(0,"div",8)(1,"video",9,0),Bt("loadstart",function(){$t(t);let i=vt();return Kt(i.onVideoLoadStart())})("loadeddata",function(){$t(t);let i=vt();return Kt(i.onVideoLoadedData())})("canplay",function(){$t(t);let i=vt();return Kt(i.onVideoCanPlay())})("loadedmetadata",function(){$t(t);let i=vt();return Kt(i.onVideoMetadataLoaded())})("playing",function(){$t(t);let i=vt();return Kt(i.onVideoPlaying())})("pause",function(){$t(t);let i=vt();return Kt(i.onVideoPaused())})("error",function(i){$t(t);let r=vt();return Kt(r.onVideoError(i))}),me(),Jt(3,bx,6,0,"div",10),he(4,"div",11)(5,"p"),Re(6,"Using Pre-recorded Video Background"),me(),he(7,"small"),Re(8,'Click "Enable 3D Rendering" to switch to live 3D'),me()()()}if(s&2){let t=vt();Ae(),Ze("src","assets/3d/CD_Case/pregen_bg_optimized.mp4",Xd),Zd("data-object-fit","cover"),Ae(2),Ze("ngIf",t.videoPlaybackFailed)}}function Sx(s,e){s&1&&(he(0,"div",16),Gt(1,"canvas",null,1)(3,"div",17,2),me())}function Ex(s,e){s&1&&(he(0,"div",18),Gt(1,"div",19),he(2,"div",20),Re(3,"Loading 3D CD Cases..."),me()())}function Cx(s,e){if(s&1){let t=di();he(0,"div",21)(1,"button",22),Bt("click",function(){$t(t);let i=vt();return Kt(i.startRecording())}),Re(2),me(),he(3,"button",23),Bt("click",function(){$t(t);let i=vt();return Kt(i.toggle3DMode())}),Re(4),me()()}if(s&2){let t=vt();Ae(),Ze("disabled",t.isRecordingMode||t.usePreRecordedVideo),Ae(),Fi(" ",t.isRecordingMode?"Recording... (60s)":"Start 60s Recording"," "),Ae(),Ze("disabled",t.isRecordingMode),Ae(),Fi(" ",t.usePreRecordedVideo?"Enable 3D Rendering":"Use Pre-recorded Video"," ")}}var io=class io{constructor(e,t,n,i,r,o,l,u,d,a,c,h,f,g,_,m,p,b){this.cdCasesService=e;this.sceneService=t;this.eventsService=n;this.animationService=i;this.debugService=r;this.stateService=o;this.videoService=l;this.eventHandlerService=u;this.silhouetteService=d;this.rendererService=a;this.caseAnimationService=c;this.menuIntegrationService=h;this.viewHelperService=f;this.setupHelperService=g;this.animationHelperService=_;this.sceneConfigHelperService=m;this.ngZone=p;this.cdr=b;this.loadingChange=new os;this.animationId=null;this.cdCases=[];this.config=Ii;this.loadingPromises=[];this.isLoading=!0;this.sceneSettings={cameraX:this.config.sceneSettings.camera.position.x,cameraY:this.config.sceneSettings.camera.position.y,cameraZ:this.config.sceneSettings.camera.position.z,lookAtX:this.config.sceneSettings.camera.lookAt.x,lookAtY:this.config.sceneSettings.camera.lookAt.y,lookAtZ:this.config.sceneSettings.camera.lookAt.z,ambientIntensity:this.config.sceneSettings.lighting.ambient.intensity,mainLightIntensity:this.config.sceneSettings.lighting.main.intensity,exposure:this.config.sceneSettings.renderer.exposure,orbitMinPolarAngle:this.config.sceneSettings.orbitControls.minPolarAngle,orbitMaxPolarAngle:this.config.sceneSettings.orbitControls.maxPolarAngle,orbitMinDistance:this.config.sceneSettings.orbitControls.minDistance,orbitMaxDistance:this.config.sceneSettings.orbitControls.maxDistance,orbitDampingFactor:this.config.sceneSettings.orbitControls.dampingFactor,groundY:this.config.sceneSettings.ground.y,groundOpacity:this.config.sceneSettings.ground.opacity,lockControls:this.config.sceneSettings.camera.lockControls,bgEffectContinents:!0,bgEffectMountains:!0,bgEffectWaves:!0,bgEffectBorders:!0,bgEffectSwirls:!0,bgEffectLightRays:!0,bgEffectParticles:!0,bgEffectVideoInfluence:!0,bgEffectBloom:!0,bgEffectFilmGrain:!0,bgEffectVignette:!0};this.caseSettings={};this.videoPaths=[];this.playingMusic=[];this.tutorialCompleted=[];this.targetAspect=16/9;this.isDebugMode=!0;this.isRecordingMode=!1;this.resizeObserver=null;this.wheelDebounceTimer=null;this.WHEEL_DEBOUNCE_DELAY=150;this.usePreRecordedVideo=!0;this.videoPlaybackFailed=!1;this.autoplayAttempted=!1;this.videoReadyForPlay=!1;this.forceShowRecordingControls=!0;this.resizeDebounceId=null}get isManuallyAnimating(){return this.caseAnimationService.getIsManuallyAnimating()}get manuallyAnimatedCaseId(){return this.caseAnimationService.getManuallyAnimatedCaseId()}get activeCaseExpanded(){return this.caseAnimationService.getActiveCaseExpanded()}initializeServices(){this.loadCDCases()}setupScene(){this.isDebugMode&&console.log("[CDCases] Setting up scene"),this.setupRenderer(),this.setupControls(),this.setupCSS3DRenderer(),this.setupRightSideMenu(),this.loadModels().then(()=>{this.isDebugMode&&console.log("[CDCases] Scene setup completed")}).catch(e=>{console.error("[CDCases] Error setting up scene:",e)})}ngOnInit(){this.isDebugMode&&console.log("[CDCases] Initializing component"),this.setLoadingState(!0),this.initializeServices(),this.isDebugMode&&console.log("[CDCases] Component initialized, loading state set to true")}ngAfterViewInit(){if(this.isDebugMode&&(console.log("[CDCases] AfterViewInit - Checking rendering mode"),console.log("  - usePreRecordedVideo:",this.usePreRecordedVideo),console.log("  - forceShowRecordingControls:",this.forceShowRecordingControls)),this.usePreRecordedVideo){this.isDebugMode&&console.log("[CDCases] Using pre-recorded video background - skipping 3D setup"),setTimeout(()=>{this.setLoadingState(!1)},100);return}this.isDebugMode&&console.log("[CDCases] AfterViewInit - Initializing 3D CD case scene"),this.setupRenderer(),this.setupControls(),this.setupCSS3DRenderer(),this.setupRightSideMenu(),this.setupResizeObserver(),this.loadModels().then(()=>{this.isDebugMode&&console.log("[CDCases] CD Case models loaded successfully"),requestAnimationFrame(()=>{requestAnimationFrame(()=>{this.isDebugMode&&console.log("[CDCases] All CD Case assets loaded, notifying parent component"),this.setLoadingState(!1)})})}).catch(e=>{console.error("[CDCases] Error loading CD Case models:",e),this.setLoadingState(!1)}),this.caseAnimationService.setExpandFunction(this.expandActiveCase.bind(this))}setupResizeObserver(){typeof ResizeObserver<"u"&&this.canvasRef?.nativeElement?this.ngZone.runOutsideAngular(()=>{this.resizeObserver=new ResizeObserver(t=>{this.resizeDebounceId&&cancelAnimationFrame(this.resizeDebounceId),this.resizeDebounceId=requestAnimationFrame(()=>{this.updateRendererSize()})});let e=this.canvasRef.nativeElement.parentElement;e&&(this.resizeObserver.observe(e),this.isDebugMode&&console.log("[CDCases] ResizeObserver set up on container"))}):this.isDebugMode&&console.log("[CDCases] ResizeObserver not available, falling back to window resize")}setupRenderer(){let e=this.setupHelperService.setupRenderer(this.canvasRef.nativeElement,this.sceneService,this.config);this.renderer=e.renderer,this.scene=e.scene,this.camera=e.camera,this.optimizeRenderer(),this.ambientLight=e.lights.ambientLight,this.mainLight=e.lights.mainLight,this.fillLight=e.lights.fillLight,this.backLight=e.lights.backLight,this.mainLightHelper=e.lightHelpers.mainLightHelper,this.fillLightHelper=e.lightHelpers.fillLightHelper,this.backLightHelper=e.lightHelpers.backLightHelper,this.rightSideMenuPlane=e.videoElements.rightSideMenuPlane,this.backgroundPlane=e.videoElements.backgroundPlane,this.caseBackVideoPlane=e.videoElements.caseBackVideoPlane,this.videoPlay=e.videoElements.videoPlay,this.videoPause=e.videoElements.videoPause,this.updateVideoSource=e.videoElements.updateVideoSource}optimizeRenderer(){this.renderer&&this.ngZone.runOutsideAngular(()=>{let e=Math.min(window.devicePixelRatio,2);this.renderer.setPixelRatio(e),"powerPreference"in this.renderer&&(this.renderer.powerPreference="high-performance"),"outputColorSpace"in this.renderer?this.renderer.outputColorSpace=Je:"outputEncoding"in this.renderer&&(this.renderer.outputEncoding=Je),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Fs,"physicallyCorrectLights"in this.renderer?this.renderer.physicallyCorrectLights=!0:"useLegacyLights"in this.renderer&&(this.renderer.useLegacyLights=!1),this.isDebugMode&&console.log(`[CDCases] Renderer optimized with pixel ratio: ${e}`)})}setupControls(){this.controls=this.setupHelperService.setupControls(this.sceneService),this.controls.enableZoom=!1,this.controls.mouseButtons={LEFT:Dn.ROTATE,MIDDLE:Dn.DOLLY,RIGHT:Dn.PAN},this.setupHelperService.updateOrbitControls(this.controls,this.sceneSettings)}loadModels(){return rn(this,null,function*(){try{this.isDebugMode&&(console.log("[CDCases] Starting model loading"),console.time("model-loading")),this.cdCases=yield this.cdCasesService.loadModels(this.config,this.scene,this.renderer),yield Promise.all([this.initializeTrackingArrays(),this.initializeCaseSettings()]),this.labelRendererElement.nativeElement.appendChild(this.labelRenderer.domElement),this.ngZone.runOutsideAngular(()=>{this.animate()}),this.addEventListeners(),this.renderer.render(this.scene,this.camera),this.labelRenderer.render(this.scene,this.camera),yield new Promise(e=>requestAnimationFrame(()=>e())),this.activateInitialCase(),this.isDebugMode&&(console.timeEnd("model-loading"),console.log("[CDCases] Models loaded and initialized successfully"))}catch(e){throw console.error("[CDCases] Error loading scene:",e),this.setLoadingState(!1),e}})}initializeTrackingArrays(){return rn(this,null,function*(){this.playingMusic=new Array(this.cdCases.length).fill(!1),this.tutorialCompleted=new Array(this.cdCases.length).fill(!1),this.isDebugMode&&console.log(`[CDCases] Initialized tracking arrays for ${this.cdCases.length} cases`)})}initializeCaseSettings(){return rn(this,null,function*(){this.cdCases.forEach(e=>{this.caseSettings[e.id]||(this.caseSettings[e.id]={positionX:0,positionY:0,positionZ:0,rotationX:0,rotationY:0,rotationZ:0})}),this.isDebugMode&&console.log(`[CDCases] Initialized settings for ${this.cdCases.length} cases`)})}activateInitialCase(){this.stateService.setActiveCase(this.cdCases,0);let e=this.cdCases.find(t=>t.isActive);e&&(this.createActiveCaseSilhouette(e),this.videoService.updateVideoPlane2Alignment(this.caseBackVideoPlane,this.isManuallyAnimating,this.manuallyAnimatedCaseId,this.cdCases),this.isDebugMode&&console.log(`[CDCases] Activated initial case ID: ${e.id}`))}addEventListeners(){this.setupHelperService.addEventListeners(this.canvasRef.nativeElement,this.cdCases,this.camera,this.eventsService,this.tutorialCompleted,()=>this.activeCaseExpanded,this.caseBackVideoPlane,this.expandActiveCase.bind(this),this.animateActiveCaseBack.bind(this))}revealVideoAndBackground(){this.viewHelperService.revealVideoAndBackground(this.backgroundPlane,this.cdCases,this.videoPaths)}updateBackgroundEffects(){this.viewHelperService.updateBackgroundEffects(this.sceneSettings)}removeSilhouetteEffect(e){this.viewHelperService.removeSilhouetteEffect(e)}createActiveCaseSilhouette(e){this.silhouetteService.createActiveCaseSilhouette(e,this.tutorialCompleted)}animate(){this.renderer&&this.ngZone.runOutsideAngular(()=>{this.animationId=requestAnimationFrame(()=>this.animate()),this.animationHelperService.animate(this.renderer,this.scene,this.camera,this.controls,this.labelRenderer,this.cdCases,this.caseBackVideoPlane,this.rightSideMenuPlane,this.isManuallyAnimating,this.manuallyAnimatedCaseId,this.activeCaseExpanded,this.playingMusic,this.tutorialCompleted)})}updateCamera(){this.sceneConfigHelperService.updateCamera(this.camera,this.controls,this.sceneSettings)}updateLighting(){this.sceneConfigHelperService.updateLighting(this.ambientLight,this.mainLight,this.mainLightHelper,this.fillLightHelper,this.backLightHelper,this.sceneSettings)}updateRenderer(){this.sceneConfigHelperService.updateRenderer(this.renderer,this.sceneSettings)}updateOrbitControls(){this.sceneConfigHelperService.updateOrbitControls(this.controls,this.sceneSettings)}updateGround(){this.sceneConfigHelperService.updateGround(this.scene,this.sceneSettings)}updateCaseTransform(e){this.sceneConfigHelperService.updateCaseTransform(e)}resetToDefault(){this.sceneConfigHelperService.resetToDefault(this.sceneSettings,this.config,this.cdCases,this.updateCamera.bind(this),this.updateLighting.bind(this),this.updateRenderer.bind(this),this.updateOrbitControls.bind(this),this.updateGround.bind(this),this.updateCaseTransform.bind(this))}onWindowResize(){this.resizeDebounceId&&cancelAnimationFrame(this.resizeDebounceId),this.resizeDebounceId=requestAnimationFrame(()=>{this.updateRendererSize()})}updateRendererSize(){!this.renderer||!this.camera||!this.labelRenderer||this.ngZone.runOutsideAngular(()=>{let e=window.innerWidth,t=window.innerHeight,n=e/t;n>this.targetAspect?this.camera.fov=60/(n/this.targetAspect):this.camera.fov=60*(this.targetAspect/n),this.camera.aspect=n,this.camera.updateProjectionMatrix(),this.renderer.setSize(e,t),this.labelRenderer.setSize(e,t);let i=Math.min(window.devicePixelRatio,2);this.renderer.setPixelRatio(i),this.adjustCasePositionsForAspectRatio(),this.isDebugMode&&console.log(`[CDCases] Renderer resized: ${e}x${t}, aspect: ${n.toFixed(2)}`)})}centerCamera(){this.cdCases.find(t=>t.isActive)&&this.camera&&(this.camera.position.set(0,0,10),this.camera.lookAt(0,0,0))}centerContainer(){this.centerCamera()}adjustCasePositionsForAspectRatio(){let e=window.innerWidth/window.innerHeight,t=16/9;this.isDebugMode&&(console.log(`[CDCases] Current Aspect Ratio: ${e.toFixed(3)}`),console.log(`[CDCases] Design Aspect Ratio: ${t.toFixed(3)}`)),this.cdCases.forEach(n=>{let i=n.model.userData.originalPosition||{x:n.model.position.x,y:n.model.position.y,z:n.model.position.z};if(n.model.userData.originalPosition||(n.model.userData.originalPosition=i),e>t){let r=Math.min(e/t*1.15,1.8);n.model.position.x=i.x*r}else{let r=Math.min(t/e*1.15,1.8);n.model.position.y=i.y*r}}),this.cdCases.length>0&&this.stateService.updatePositions(this.cdCases)}ngOnDestroy(){this.isDebugMode&&console.log("[CDCases] Component destroying - cleaning up resources"),this.resizeObserver&&(this.resizeObserver.disconnect(),this.resizeObserver=null),this.resizeDebounceId&&(cancelAnimationFrame(this.resizeDebounceId),this.resizeDebounceId=null),this.wheelDebounceTimer&&(clearTimeout(this.wheelDebounceTimer),this.wheelDebounceTimer=null),this.animationId!==null&&(cancelAnimationFrame(this.animationId),this.animationId=null),this.menuIntegrationService.destroy(),this.performComprehensiveCleanup()}onWheel(e){if(e.ctrlKey||e.metaKey){e.preventDefault();return}this.wheelDebounceTimer&&clearTimeout(this.wheelDebounceTimer),this.wheelDebounceTimer=setTimeout(()=>{this.ngZone.run(()=>{this.eventHandlerService.onWheel(e,this.cdCases,this.sceneSettings,this.stateService,this.animationService,this.createActiveCaseSilhouette.bind(this),this.animateActiveCaseBack.bind(this),this.updateVideoForNewActiveCase.bind(this),()=>this.activeCaseExpanded,this.caseAnimationService.resetCasePosition.bind(this.caseAnimationService)),this.cdr.markForCheck()})},this.WHEEL_DEBOUNCE_DELAY)}animateActiveCaseBack(e,t,n){this.caseAnimationService.animateActiveCaseBack(e,t,n,this.cdCases,this.caseBackVideoPlane,this.rightSideMenuPlane,this.stateService,this.updateVideoForNewActiveCase.bind(this),()=>this.videoService.updateVideoPlane2Alignment(this.caseBackVideoPlane,this.isManuallyAnimating,this.manuallyAnimatedCaseId,this.cdCases))}updateVideoForNewActiveCase(e,t=!1){this.viewHelperService.updateVideoForNewActiveCase(e,t,this.videoPaths,this.playingMusic,this.cdCases,this.tutorialCompleted,this.createSilhouetteWrapper.bind(this),this.expandActiveCaseWrapper.bind(this))}expandActiveCase(e){console.log(`Expanding case ${e.id}`),this.menuIntegrationService.reloadMenuConfig(),this.caseAnimationService.expandActiveCase(e,this.cdCases,this.playingMusic,this.tutorialCompleted,this.caseBackVideoPlane,this.rightSideMenuPlane,this.videoService.resetCaseBackVideoPlane.bind(this.videoService),this.removeSilhouetteEffect.bind(this),this.revealVideoAndBackground.bind(this),()=>this.videoService.updateVideoPlane2Alignment(this.caseBackVideoPlane,this.isManuallyAnimating,this.manuallyAnimatedCaseId,this.cdCases))}setupCSS3DRenderer(){this.labelRenderer=this.viewHelperService.setupCSS3DRenderer(this.labelRendererElement)}setupRightSideMenu(){this.css3DMenu=this.viewHelperService.setupRightSideMenu(this.scene,this.config,this.cdCases,this.rightSideMenuPlane,this.handleTrackSelection.bind(this))}createSilhouetteWrapper(e){this.viewHelperService.createSilhouetteWrapper(e,this.tutorialCompleted)}expandActiveCaseWrapper(e){this.viewHelperService.expandActiveCaseWrapper(e,this.cdCases,this.playingMusic,this.tutorialCompleted,this.caseBackVideoPlane,this.rightSideMenuPlane,this.revealVideoAndBackground.bind(this),()=>this.videoService.updateVideoPlane2Alignment(this.caseBackVideoPlane,this.isManuallyAnimating,this.manuallyAnimatedCaseId,this.cdCases))}handleTrackSelection(e){if(e>=0&&e<this.cdCases.length){let t=this.cdCases.find(n=>n.isActive);t&&this.eventHandlerService.deactivateCase(t,this.cdCases,this.playingMusic,this.tutorialCompleted,this.caseBackVideoPlane,this.createSilhouetteWrapper.bind(this),this.expandActiveCaseWrapper.bind(this)),setTimeout(()=>{this.eventHandlerService.activateCase(this.cdCases[e],this.cdCases,this.playingMusic,this.tutorialCompleted,this.caseBackVideoPlane,this.createSilhouetteWrapper.bind(this),this.expandActiveCaseWrapper.bind(this))},300)}}loadCDCases(){this.config.cdCases=Pp(Rp),this.videoPaths=this.config.videoPaths||[],this.videoService.setConfig(this.config),this.silhouetteService.setConfig(this.config),this.rendererService.setConfig(this.config),this.caseAnimationService.setConfig(this.config);let e=this.config.cdCases.length;this.playingMusic=new Array(e).fill(!1),this.tutorialCompleted=new Array(e).fill(!1)}onKeyDown(e){return(e.ctrlKey||e.metaKey)&&(e.key==="+"||e.key==="-"||e.key==="0"||e.key==="=")?(e.preventDefault(),!1):!0}setLoadingState(e){this.isDebugMode&&console.log(`[CDCases] Setting loading state to: ${e}`),this.isLoading=e,this.ngZone.run(()=>{this.isDebugMode&&console.log(`[CDCases] About to emit loading state: ${e}`),this.loadingChange.emit(e),this.cdr.markForCheck(),this.isDebugMode&&console.log(`[CDCases] Successfully emitted loading state: ${e}`)})}performComprehensiveCleanup(){if(this.renderer&&(this.renderer.dispose(),this.renderer.forceContextLoss(),this.renderer.domElement=null,this.renderer=null),this.labelRenderer&&(this.labelRenderer.domElement&&this.labelRenderer.domElement.parentNode&&this.labelRenderer.domElement.parentNode.removeChild(this.labelRenderer.domElement),this.labelRenderer=null),this.scene&&(this.disposeSceneObjects(this.scene),this.scene=null),this.controls&&(this.controls.dispose(),this.controls=null),this.camera&&(this.camera=null),this.canvasRef?.nativeElement)for(;this.canvasRef.nativeElement.firstChild;)this.canvasRef.nativeElement.removeChild(this.canvasRef.nativeElement.firstChild);if(this.labelRendererElement?.nativeElement)for(;this.labelRendererElement.nativeElement.firstChild;)this.labelRendererElement.nativeElement.removeChild(this.labelRendererElement.nativeElement.firstChild);this.isDebugMode&&console.log("[CDCases] Comprehensive cleanup completed")}disposeSceneObjects(e){for(;e.children.length>0;)this.disposeSceneObjects(e.children[0]),e.remove(e.children[0]);e.geometry&&e.geometry.dispose(),e.material&&(Array.isArray(e.material)?e.material.forEach(t=>this.disposeMaterial(t)):this.disposeMaterial(e.material))}disposeMaterial(e){e.dispose();for(let t in e){let n=e[t];n&&typeof n=="object"&&"dispose"in n&&n.dispose()}}trackByCaseId(e,t){return t.id}enableRecordingMode(){console.log("[CDCases] Enabling recording mode - hiding all UI elements"),this.isRecordingMode=!0,this.rightSideMenuPlane&&(this.rightSideMenuPlane.visible=!1,console.log("[CDCases] Hidden right side menu 3D plane")),this.backgroundPlane&&(this.backgroundPlane.visible=!1,console.log("[CDCases] Hidden background plane 3D object")),this.caseBackVideoPlane&&(this.caseBackVideoPlane.visible=!1,console.log("[CDCases] Hidden case back video plane")),document.body.classList.add("recording-mode"),this.cdr.markForCheck(),console.log("[CDCases] Recording mode enabled - all UI elements hidden")}disableRecordingMode(){console.log("[CDCases] Disabling recording mode - restoring UI elements"),this.isRecordingMode=!1,this.rightSideMenuPlane&&(this.rightSideMenuPlane.visible=!0),this.backgroundPlane&&(this.backgroundPlane.visible=!0),this.caseBackVideoPlane&&(this.caseBackVideoPlane.visible=!0),document.body.classList.remove("recording-mode"),this.cdr.markForCheck(),console.log("[CDCases] Recording mode disabled - UI elements restored")}startRecording(){console.log("[CDCases] Starting 60-second Three.js recording"),this.enableRecordingMode();let t=this.canvasRef.nativeElement.captureStream(60),n=new MediaRecorder(t,{mimeType:"video/webm;codecs=vp9"}),i=[];n.ondataavailable=r=>{r.data.size>0&&i.push(r.data)},n.onstop=()=>{console.log("[CDCases] Recording stopped, processing video");let r=new Blob(i,{type:"video/webm"}),o=URL.createObjectURL(r),l=document.createElement("a");l.href=o,l.download=`phantasia-3d-recording-${Date.now()}.webm`,document.body.appendChild(l),l.click(),document.body.removeChild(l),URL.revokeObjectURL(o),this.disableRecordingMode(),console.log("[CDCases] Recording saved and recording mode disabled")},n.start(),console.log("[CDCases] Recording started for 60 seconds"),setTimeout(()=>{n.stop(),console.log("[CDCases] 60 seconds elapsed, stopping recording")},6e4)}toggle3DMode(){this.usePreRecordedVideo=!this.usePreRecordedVideo,console.log("[CDCases] Rendering mode:",this.usePreRecordedVideo?"Pre-recorded Video":"Live 3D"),this.usePreRecordedVideo?this.animationId!==null&&(cancelAnimationFrame(this.animationId),this.animationId=null):this.ngAfterViewInit(),this.cdr.markForCheck()}onVideoCanPlay(){console.log("[CDCases] Video can play - attempting autoplay"),this.backgroundVideoRef?.nativeElement&&this.usePreRecordedVideo&&this.backgroundVideoRef.nativeElement.play().then(()=>{console.log("[CDCases] Video autoplay successful"),this.setLoadingState(!1)}).catch(t=>{console.warn("[CDCases] Video autoplay failed:",t),this.setLoadingState(!1)})}onVideoError(e){console.error("[CDCases] Video loading error:",e),console.log("[CDCases] Falling back to 3D rendering due to video error"),this.usePreRecordedVideo=!1,this.cdr.markForCheck(),setTimeout(()=>{this.ngAfterViewInit()},100)}onVideoLoadStart(){console.log("[CDCases] Video load started")}onVideoLoadedData(){console.log("[CDCases] Video data loaded")}onVideoMetadataLoaded(){console.log("[CDCases] Video metadata loaded - attempting advanced autoplay"),this.videoReadyForPlay=!0,this.attemptAdvancedAutoplay()}onVideoPlaying(){console.log("[CDCases] Video is now playing successfully"),this.videoPlaybackFailed=!1,this.autoplayAttempted=!0,this.usePreRecordedVideo&&this.backgroundVideoRef?.nativeElement&&this.autoplayAttempted&&setTimeout(()=>this.attemptAdvancedAutoplay(),100)}onVideoPaused(){console.log("[CDCases] Video paused")}attemptAdvancedAutoplay(){return rn(this,null,function*(){if(!this.backgroundVideoRef?.nativeElement||!this.usePreRecordedVideo||this.autoplayAttempted)return;let e=this.backgroundVideoRef.nativeElement;this.autoplayAttempted=!0;try{console.log("[CDCases] Attempting advanced video autoplay bypass..."),e.muted=!0,e.defaultMuted=!0,e.volume=0,e.setAttribute("muted","true"),e.setAttribute("playsinline","true"),e.setAttribute("webkit-playsinline","true"),e.setAttribute("x5-playsinline","true"),e.setAttribute("x5-video-player-type","h5"),e.setAttribute("x5-video-player-fullscreen","false"),yield e.play(),console.log("[CDCases] Video autoplay successful on first attempt")}catch{console.log("[CDCases] First autoplay attempt failed, trying fallback strategies...");try{e.load(),e.currentTime=0,yield new Promise(n=>setTimeout(n,50)),yield e.play(),console.log("[CDCases] Video autoplay successful after reset")}catch{console.log("[CDCases] Reset strategy failed, trying interaction simulation...");try{yield new Promise(i=>{let r=()=>{e.removeEventListener("loadedmetadata",r),i(e.play())};e.addEventListener("loadedmetadata",r),e.load()}),console.log("[CDCases] Video autoplay successful with interaction simulation")}catch(i){console.error("[CDCases] All autoplay strategies exhausted:",i),this.handleAutoplayFailure()}}}})}handleAutoplayFailure(){console.log("[CDCases] All autoplay attempts failed - showing user interaction fallback"),this.videoPlaybackFailed=!0,this.setLoadingState(!1),this.cdr.markForCheck()}forceVideoPlay(){if(console.log("[CDCases] User clicked to play video"),this.backgroundVideoRef?.nativeElement&&this.usePreRecordedVideo){let e=this.backgroundVideoRef.nativeElement;this.videoReadyForPlay=!0,e.play().then(()=>{console.log("[CDCases] Manual video play successful"),this.videoPlaybackFailed=!1,this.cdr.markForCheck()}).catch(t=>{console.error("[CDCases] Manual video play failed:",t),this.videoPlaybackFailed=!1,this.cdr.markForCheck()})}}};io.\u0275fac=function(t){return new(t||io)(et(nr),et(Nn),et($s),et(mn),et(ir),et(rr),et(kn),et(sr),et(Fn),et(ai),et(oi),et(Un),et(Qs),et(eo),et(to),et(no),et(ua),et(Kn))},io.\u0275cmp=Tn({type:io,selectors:[["app-cd-cases"]],viewQuery:function(t,n){if(t&1&&(fa(vx,5),fa(yx,5),fa(xx,5)),t&2){let i;pa(i=ma())&&(n.canvasRef=i.first),pa(i=ma())&&(n.labelRendererElement=i.first),pa(i=ma())&&(n.backgroundVideoRef=i.first)}},hostBindings:function(t,n){t&1&&Bt("resize",function(r){return n.onWindowResize(r)},lo)("wheel",function(r){return n.onWheel(r)})("keydown",function(r){return n.onKeyDown(r)},lo)},outputs:{loadingChange:"loadingChange"},features:[eh([kn,sr,Fn,ai,oi,Un,Qs,eo,to,no,nr,Nn,$s,mn,ir,rr])],decls:5,vars:4,consts:[["backgroundVideo",""],["canvas",""],["labelRenderer",""],[1,"cd-cases-container"],["class","video-background-container",4,"ngIf"],["class","original-3d-container",4,"ngIf"],["class","loading-overlay","aria-live","polite",4,"ngIf"],["class","recording-controls-below-debug",4,"ngIf"],[1,"video-background-container"],["autoplay","","loop","","muted","","playsinline","","preload","auto","webkit-playsinline","","x5-playsinline","",1,"background-video",3,"loadstart","loadeddata","canplay","loadedmetadata","playing","pause","error","src"],["class","video-play-overlay",3,"click",4,"ngIf"],[1,"video-overlay-text"],[1,"video-play-overlay",3,"click"],[1,"play-button"],[1,"play-icon"],[1,"play-text"],[1,"original-3d-container"],[1,"label-renderer"],["aria-live","polite",1,"loading-overlay"],[1,"loading-spinner"],[1,"loading-text"],[1,"recording-controls-below-debug"],[1,"record-btn",3,"click","disabled"],[1,"toggle-3d-btn",3,"click","disabled"]],template:function(t,n){t&1&&(he(0,"div",3),Jt(1,Mx,9,3,"div",4)(2,Sx,5,0,"div",5)(3,Ex,4,0,"div",6)(4,Cx,5,4,"div",7),me()),t&2&&(Ae(),Ze("ngIf",n.usePreRecordedVideo),Ae(),Ze("ngIf",!n.usePreRecordedVideo),Ae(),Ze("ngIf",n.isLoading&&!n.isRecordingMode),Ae(),Ze("ngIf",n.forceShowRecordingControls||n.isDebugMode&&!n.isLoading))},dependencies:[Rn,Ui],styles:['[_nghost-%COMP%]{display:block;width:100%;height:100%;position:relative;background:#000;overflow:hidden;transform:none;filter:none;perspective:none;isolation:isolate;z-index:10}[_nghost-%COMP%]     body.recording-mode .app-header, [_nghost-%COMP%]     body.recording-mode .auth-status{display:none!important;visibility:hidden!important}[_nghost-%COMP%]     body.recording-mode app-site-header, [_nghost-%COMP%]     body.recording-mode .site-header, [_nghost-%COMP%]     body.recording-mode .header-container, [_nghost-%COMP%]     body.recording-mode .phantasia-header, [_nghost-%COMP%]     body.recording-mode header{display:none!important;visibility:hidden!important}[_nghost-%COMP%]     body.recording-mode footer, [_nghost-%COMP%]     body.recording-mode .footer{display:none!important;visibility:hidden!important}[_nghost-%COMP%]     body.recording-mode app-cd-cases .cd-cases-container{position:fixed!important;top:0!important;left:0!important;width:100vw!important;height:100vh!important;z-index:9999!important;background:#000!important}[_nghost-%COMP%]     body.recording-mode app-cd-cases .cd-cases-container .original-3d-container{width:100%!important;height:100%!important}[_nghost-%COMP%]     body.recording-mode app-cd-cases .cd-cases-container .original-3d-container canvas{width:100%!important;height:100%!important}.cd-container[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100%;z-index:10}.visually-hidden[_ngcontent-%COMP%]{position:absolute;width:1px;height:1px;margin:-1px;padding:0;overflow:hidden;clip:rect(0,0,0,0);border:0}canvas[_ngcontent-%COMP%]{display:block;width:100%;height:100%;position:absolute;top:0;left:0;outline:none;z-index:1;object-fit:cover;background:transparent;transition:opacity .5s ease;cursor:grab}canvas[_ngcontent-%COMP%]:active{cursor:grabbing}.label-renderer[_ngcontent-%COMP%]{position:absolute;top:0;left:0;pointer-events:none;z-index:2}.video-background-container[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;background:#000;overflow:hidden;z-index:1}.video-background-container[_ngcontent-%COMP%]   .background-video[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;min-width:100%;min-height:100%;width:auto;height:auto;transform:translate(-50%,-50%);object-fit:cover;background:#000}.video-background-container[_ngcontent-%COMP%]   .video-overlay-text[_ngcontent-%COMP%]{position:absolute;top:20px;right:20px;background:#000000b3;color:#fff;padding:10px 15px;border-radius:4px;font-size:12px;z-index:10}.video-background-container[_ngcontent-%COMP%]   .video-overlay-text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0;font-weight:700}.video-background-container[_ngcontent-%COMP%]   .video-overlay-text[_ngcontent-%COMP%]   small[_ngcontent-%COMP%]{opacity:.8}.video-play-overlay[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;background:#000c;display:flex;align-items:center;justify-content:center;cursor:pointer;z-index:20;-webkit-backdrop-filter:blur(4px);backdrop-filter:blur(4px);transition:all .3s ease}.video-play-overlay[_ngcontent-%COMP%]:hover{background:#000000e6;-webkit-backdrop-filter:blur(6px);backdrop-filter:blur(6px)}.video-play-overlay[_ngcontent-%COMP%]:hover   .play-button[_ngcontent-%COMP%]{transform:scale(1.1)}.video-play-overlay[_ngcontent-%COMP%]   .play-button[_ngcontent-%COMP%]{text-align:center;color:#fff;transition:transform .3s ease}.video-play-overlay[_ngcontent-%COMP%]   .play-button[_ngcontent-%COMP%]   .play-icon[_ngcontent-%COMP%]{font-size:64px;margin-bottom:16px;opacity:.9}.video-play-overlay[_ngcontent-%COMP%]   .play-button[_ngcontent-%COMP%]   .play-text[_ngcontent-%COMP%]{font-size:18px;font-weight:500;letter-spacing:.5px}.recording-controls-below-debug[_ngcontent-%COMP%]{position:fixed;top:320px;left:20px;z-index:10000;display:flex;gap:10px;flex-direction:column}.recording-controls-below-debug[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]{background:#4a90e2;color:#fff;border:none;padding:10px 16px;border-radius:4px;font-size:13px;font-weight:500;cursor:pointer;transition:all .2s ease;min-width:160px}.recording-controls-below-debug[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:hover:not(:disabled){background:#357abd;transform:translateY(-1px)}.recording-controls-below-debug[_ngcontent-%COMP%]   button[_ngcontent-%COMP%]:disabled{background:#888;cursor:not-allowed;opacity:.6}.recording-controls-below-debug[_ngcontent-%COMP%]   .record-btn[_ngcontent-%COMP%]{background:#f44}.recording-controls-below-debug[_ngcontent-%COMP%]   .record-btn[_ngcontent-%COMP%]:hover:not(:disabled){background:#f33}.recording-controls-below-debug[_ngcontent-%COMP%]   .record-btn[_ngcontent-%COMP%]:disabled{animation:_ngcontent-%COMP%_pulse 1.5s ease-in-out infinite}.recording-controls-below-debug[_ngcontent-%COMP%]   .toggle-3d-btn[_ngcontent-%COMP%]{background:#28a745}.recording-controls-below-debug[_ngcontent-%COMP%]   .toggle-3d-btn[_ngcontent-%COMP%]:hover:not(:disabled){background:#218838}.recording-controls[_ngcontent-%COMP%]{position:fixed;top:20px;left:20px;z-index:10000}.recording-controls[_ngcontent-%COMP%]   .record-btn[_ngcontent-%COMP%]{background:#f44;color:#fff;border:none;padding:12px 20px;border-radius:6px;font-size:14px;font-weight:700;cursor:pointer;transition:all .2s ease;box-shadow:0 2px 8px #ff44444d}.recording-controls[_ngcontent-%COMP%]   .record-btn[_ngcontent-%COMP%]:hover:not(:disabled){background:#f33;transform:translateY(-1px);box-shadow:0 4px 12px #f446}.recording-controls[_ngcontent-%COMP%]   .record-btn[_ngcontent-%COMP%]:disabled{background:#888;cursor:not-allowed;animation:_ngcontent-%COMP%_pulse 1.5s ease-in-out infinite}@keyframes _ngcontent-%COMP%_pulse{0%,to{opacity:1}50%{opacity:.7}}.cd-cases-container[_ngcontent-%COMP%]{position:relative;width:100%;height:100%;overflow:hidden;background-color:#000;will-change:transform}canvas[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%!important;height:100%!important}.label-renderer[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%!important;height:100%!important;pointer-events:none}.cd-case[_ngcontent-%COMP%]{position:absolute;width:280px;height:248px;pointer-events:all;cursor:grab;transition:all .3s cubic-bezier(.2,.8,.2,1);-webkit-user-select:none;user-select:none;transform-style:preserve-3d;transform-origin:center center}.cd-case[_ngcontent-%COMP%]:active{cursor:grabbing;transition:transform .1s ease-out}.cd-case[_ngcontent-%COMP%]:active   .cd-cover[_ngcontent-%COMP%]{box-shadow:0 15px 35px #0000004d,0 0 0 1px #fff6}.cd-case[_ngcontent-%COMP%]:active:after{opacity:.2}.cd-case[_ngcontent-%COMP%]:after{content:"";position:absolute;width:200%;height:200%;left:-50%;top:-50%;background:radial-gradient(circle at center,rgba(0,0,0,.2) 0%,transparent 60%);opacity:0;transition:opacity .3s ease;pointer-events:none;transform:translateZ(-20px)}.cd-case[_ngcontent-%COMP%]   .cd-cover[_ngcontent-%COMP%]{position:absolute;width:100%;height:100%;background:url(/assets/images/jewel-case-_640.png);background-size:100% 100%;background-position:center;border-radius:4px;box-shadow:0 4px 15px #0003,0 0 0 1px #ffffff4d;overflow:hidden;transform-style:preserve-3d;backface-visibility:hidden;transform:translateZ(1px) rotateY(0);transition:all .3s cubic-bezier(.2,.8,.2,1)}.cd-case[_ngcontent-%COMP%]   .cd-cover[_ngcontent-%COMP%]:before{content:"";position:absolute;width:100%;height:100%;background:linear-gradient(45deg,transparent 0%,rgba(255,255,255,.1) 50%,transparent 100%);transform:translateZ(1px);pointer-events:none}.cd-case[_ngcontent-%COMP%]   .cd-cover[_ngcontent-%COMP%]   img[_ngcontent-%COMP%]{width:92%;height:92%;margin:4%;object-fit:cover;pointer-events:none;backface-visibility:hidden;border-radius:2px;box-shadow:inset 0 0 2px #0003}.cd-case[_ngcontent-%COMP%]   .cd-cover[_ngcontent-%COMP%]:after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,#fff3,#fff0,#ffffff1a);pointer-events:none;backface-visibility:hidden}.cd-case[_ngcontent-%COMP%]   .cd-info[_ngcontent-%COMP%]{position:absolute;bottom:-60px;left:0;width:100%;text-align:center;color:#ffffffe6;text-shadow:0 4px 8px rgba(0,0,0,.3);opacity:0;transform:translateY(20px);transition:all .3s ease;pointer-events:none;backface-visibility:hidden}.cd-case[_ngcontent-%COMP%]   .cd-info[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{margin:0;font-size:1.2rem;font-weight:600}.cd-case[_ngcontent-%COMP%]   .cd-info[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:8px 0 0;font-size:1rem;opacity:.8}.cd-case[_ngcontent-%COMP%]:hover   .cd-info[_ngcontent-%COMP%]{opacity:1;transform:translateY(0)}.cd-case[_ngcontent-%COMP%]:hover   .cd-cover[_ngcontent-%COMP%]{box-shadow:0 8px 25px #0000004d,0 0 0 1px #fff6}.cd-case[style*=stackId][_ngcontent-%COMP%]{transition:all .3s cubic-bezier(.4,0,.2,1)}.cd-case[style*=stackId][_ngcontent-%COMP%]   .cd-cover[_ngcontent-%COMP%]{box-shadow:0 2px 8px #00000026,0 0 0 1px #ffffff4d}.cd-case[style*=stackId][_ngcontent-%COMP%]:hover{transform:translateZ(5px)!important}.cd-case[style*="rotateY(180deg)"][_ngcontent-%COMP%]   .cd-cover[_ngcontent-%COMP%]{transform:translateZ(1px) rotateY(180deg)}.cd-case[style*="rotateY(180deg)"][_ngcontent-%COMP%]   .cd-back[_ngcontent-%COMP%]{transform:translateZ(-10px) rotateY(0)}.cd-case[style*="rotateY(180deg)"][_ngcontent-%COMP%]   .cd-info[_ngcontent-%COMP%]{transform:rotateY(180deg) translateY(-10px)}.loading-overlay[_ngcontent-%COMP%]{position:absolute;top:0;left:0;width:100%;height:100%;background-color:#000000d9;display:flex;flex-direction:column;justify-content:center;align-items:center;z-index:1000;color:#fff;transform:translateZ(0);backface-visibility:hidden;perspective:1000px}.loading-spinner[_ngcontent-%COMP%]{width:60px;height:60px;border-radius:50%;border:3px solid rgba(255,255,255,.2);border-top-color:#fff;animation:_ngcontent-%COMP%_spin 1s infinite linear;margin-bottom:20px;will-change:transform}.loading-text[_ngcontent-%COMP%]{font-size:18px;font-weight:500;letter-spacing:1px;animation:_ngcontent-%COMP%_pulse 1.5s infinite ease-in-out}@keyframes _ngcontent-%COMP%_spin{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_pulse{0%,to{opacity:.6}50%{opacity:1}}'],changeDetection:0});var Tc=io;var ro=class ro{constructor(e){this.cdr=e;this.acknowledged=new os;this.isReadyToProceed=!0;this.isDebugMode=!1}ngOnInit(){this.isDebugMode&&console.log("[Disclaimer] Component initialized"),this.cdr.detectChanges()}onAcknowledge(){this.isDebugMode&&console.log("[Disclaimer] User acknowledged disclaimer"),this.acknowledged.emit()}};ro.\u0275fac=function(t){return new(t||ro)(et(Kn))},ro.\u0275cmp=Tn({type:ro,selectors:[["app-disclaimer"]],outputs:{acknowledged:"acknowledged"},decls:16,vars:1,consts:[[1,"disclaimer-container"],[1,"disclaimer-content"],[1,"logo-container"],["src","/assets/images/prismcoll_logox.svg","alt","Prismatic Collections",1,"logo"],[1,"tagline"],[1,"disclaimer-text"],[1,"proceed-button","ready",3,"click"],[1,"button-text"],[1,"button-icon"]],template:function(t,n){t&1&&(ki(0,"div",0)(1,"div",1)(2,"div",2),$d(3,"img",3),ki(4,"div",4),Re(5,"Project Phantasia"),as()(),ki(6,"div",5)(7,"p"),Re(8,"This is a digital 3D experience showcasing artistic representations of our audio collection."),as(),ki(9,"p"),Re(10,"Visual elements are digital renderings intended for presentation purposes only."),as()(),ki(11,"button",6),Kd("click",function(){return n.onAcknowledge()}),ki(12,"span",7),Re(13,"Continue"),as(),ki(14,"span",8),Re(15,"\u2192"),as()()()()),t&2&&Ze("@fadeInOut",void 0)},dependencies:[Rn],styles:[".disclaimer-container[_ngcontent-%COMP%]{position:fixed;inset:0;width:100vw;height:100vh;background:#000000d9 url(/assets/images/jewel-case-_640.png) center/cover no-repeat;background-blend-mode:darken;display:flex;align-items:center;justify-content:center;padding:20px;z-index:2000;overflow:auto}.disclaimer-content[_ngcontent-%COMP%]{backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);background-color:#141414d9;border:1px solid rgba(255,255,255,.1);box-shadow:0 8px 32px #0000004d;max-width:600px;width:100%;border-radius:12px;padding:30px;color:#f5f5f5;display:flex;flex-direction:column;gap:25px;text-align:center}.logo-container[_ngcontent-%COMP%]{text-align:center;margin-bottom:5px}.logo-container[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{max-width:240px;height:auto;margin:0 auto;display:block;filter:drop-shadow(0 0 10px rgba(245,216,132,.3))}.logo-container[_ngcontent-%COMP%]   .tagline[_ngcontent-%COMP%]{font-size:1rem;color:#ffffffb3;letter-spacing:2px;text-transform:uppercase;margin-top:5px}.disclaimer-text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin:0 0 15px;font-size:1.1rem;line-height:1.5;color:#ffffffe6}.disclaimer-text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]:last-child{margin-bottom:0}.proceed-button[_ngcontent-%COMP%]{align-self:center;background:#ffffff1a;color:#ffffff80;border:none;border-radius:30px;padding:10px 25px;font-size:1rem;font-weight:500;cursor:not-allowed;display:flex;align-items:center;gap:8px;transition:all .3s ease;position:relative;overflow:hidden}.proceed-button.ready[_ngcontent-%COMP%]{background:linear-gradient(to right,#ff6432cc,#ff9646cc);color:#fff;cursor:pointer;box-shadow:0 4px 15px #ff964666}.proceed-button.ready[_ngcontent-%COMP%]:hover{transform:translateY(-2px);box-shadow:0 8px 20px #ff964680}.proceed-button.ready[_ngcontent-%COMP%]:hover   .button-icon[_ngcontent-%COMP%]{transform:translate(3px)}.proceed-button.ready[_ngcontent-%COMP%]:active{transform:translateY(1px);box-shadow:0 2px 10px #ff96464d}.proceed-button[_ngcontent-%COMP%]   .button-text[_ngcontent-%COMP%]{transition:transform .3s ease}.proceed-button[_ngcontent-%COMP%]   .button-icon[_ngcontent-%COMP%]{font-size:1.2rem;transition:transform .3s ease}@media (max-width: 768px){.disclaimer-content[_ngcontent-%COMP%]{padding:25px 20px}.logo-container[_ngcontent-%COMP%]   .logo[_ngcontent-%COMP%]{max-width:180px}.disclaimer-text[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:1rem}}"],data:{animation:[Lc("fadeInOut",[ya(":enter",[co({opacity:0}),va("400ms ease-in-out",co({opacity:1}))]),ya(":leave",[va("400ms ease-in-out",co({opacity:0}))])])]},changeDetection:0});var Ac=ro;function wx(s,e){if(s&1&&Gt(0,"div",24),s&2){let t=e.$implicit;Jd("left",t.x+"vw")("top",t.y+"vh")("--move-x",t.moveX+"px")("--move-y",t.moveY+"px")("--scale",t.scale)("--base-opacity",t.opacity)("--rotation-offset",t.rotationOffset)("--delay",t.delay),An("clockwise",t.clockwise)("counter-clockwise",!t.clockwise)}}var so=class so{constructor(){this.isVisible=!0;this.devMode=!1;this.runes=[]}ngOnInit(){this.generateRunePositions()}generateRunePositions(){this.runes=Array.from({length:48},()=>({x:Math.random()*100,y:Math.random()*100,scale:.6+Math.random()*1.4,delay:Math.random()*8,opacity:.3+Math.random()*.5,moveX:15+Math.random()*20,moveY:15+Math.random()*20,rotationOffset:Math.random()*360,clockwise:Math.random()<.5}))}};so.\u0275fac=function(t){return new(t||so)},so.\u0275cmp=Tn({type:so,selectors:[["app-scene-loader"]],inputs:{isVisible:"isVisible",devMode:"devMode"},decls:25,vars:3,consts:[[1,"loader-container"],[1,"magical-circle","outer"],[1,"magical-circle"],[1,"rune-effects"],[1,"decorative-elements"],[1,"corner-line","top-left"],[1,"corner-line","top-right"],[1,"corner-line","bottom-left"],[1,"corner-line","bottom-right"],[1,"mid-line","left"],[1,"mid-line","right"],[1,"mid-line","top"],[1,"mid-line","bottom"],[1,"light-beams"],[1,"beam","beam-1"],[1,"beam","beam-2"],[1,"beam","beam-3"],[1,"beam","beam-4"],[1,"rune-circle"],["class","rune",3,"clockwise","counter-clockwise","left","top","--move-x","--move-y","--scale","--base-opacity","--rotation-offset","--delay",4,"ngFor","ngForOf"],[1,"content"],[1,"logo-container"],["src","/assets/images/prismcoll_logox_black_upright.svg","alt","Prismatic Collections",1,"logo"],[1,"loading-text"],[1,"rune"]],template:function(t,n){t&1&&(he(0,"div",0),Gt(1,"div",1)(2,"div",2)(3,"div",3),he(4,"div",4),Gt(5,"div",5)(6,"div",6)(7,"div",7)(8,"div",8)(9,"div",9)(10,"div",10)(11,"div",11)(12,"div",12),me(),he(13,"div",13),Gt(14,"div",14)(15,"div",15)(16,"div",16)(17,"div",17),me(),he(18,"div",18),Jt(19,wx,1,20,"div",19),me(),he(20,"div",20)(21,"div",21),Gt(22,"img",22),me(),he(23,"div",23),Re(24,"Now Loading"),me()()()),t&2&&(An("visible",n.isVisible||n.devMode),Ae(19),Ze("ngForOf",n.runes))},dependencies:[Rn,ga],styles:['.loader-container[_ngcontent-%COMP%]{position:fixed;top:0;left:0;width:100%;height:100%;display:flex;align-items:center;justify-content:center;background:#fff;opacity:0;pointer-events:none;transition:opacity .5s ease;z-index:99999;isolation:isolate}.loader-container.visible[_ngcontent-%COMP%]{opacity:1;pointer-events:all}.logo-container[_ngcontent-%COMP%]{position:relative;z-index:10;margin-bottom:30px}.logo[_ngcontent-%COMP%]{width:240px;height:auto;display:block;margin:0 auto}.magical-circle[_ngcontent-%COMP%]{position:absolute;width:800px;height:800px;border:1px solid rgba(0,0,0,.1);border-radius:50%;animation:_ngcontent-%COMP%_rotate 20s linear infinite}.magical-circle[_ngcontent-%COMP%]:before{content:"";position:absolute;inset:-2px;border:2px solid transparent;border-top-color:#0003;border-radius:50%}.magical-circle[_ngcontent-%COMP%]:after{content:"";position:absolute;inset:-10px;border:1px solid transparent;border-left-color:#00000026;border-radius:50%}.magical-circle.outer[_ngcontent-%COMP%]{width:1000px;height:1000px;animation:_ngcontent-%COMP%_rotate 30s linear infinite reverse;opacity:.5}.decorative-elements[_ngcontent-%COMP%]{position:absolute;width:100%;height:100%;pointer-events:none}.corner-line[_ngcontent-%COMP%]{position:absolute;width:150px;height:150px;border:2px solid rgba(0,0,0,.15);border-radius:4px}.corner-line[_ngcontent-%COMP%]:before, .corner-line[_ngcontent-%COMP%]:after{content:"";position:absolute;background:linear-gradient(90deg,#0000001a,#0003)}.corner-line.top-left[_ngcontent-%COMP%]{top:50px;left:50px;border-right:none;border-bottom:none;animation:_ngcontent-%COMP%_pulse 3s infinite}.corner-line.top-right[_ngcontent-%COMP%]{top:50px;right:50px;border-left:none;border-bottom:none;animation:_ngcontent-%COMP%_pulse 3s infinite .75s}.corner-line.bottom-left[_ngcontent-%COMP%]{bottom:50px;left:50px;border-right:none;border-top:none;animation:_ngcontent-%COMP%_pulse 3s infinite 1.5s}.corner-line.bottom-right[_ngcontent-%COMP%]{bottom:50px;right:50px;border-left:none;border-top:none;animation:_ngcontent-%COMP%_pulse 3s infinite 2.25s}.mid-line[_ngcontent-%COMP%]{position:absolute;width:100px;height:100px;border:2px solid rgba(0,0,0,.15);border-radius:4px;animation:_ngcontent-%COMP%_pulse 3s infinite}.mid-line.left[_ngcontent-%COMP%]{left:50px;top:50%;transform:translateY(-50%);border-right:none;animation-delay:.5s}.mid-line.right[_ngcontent-%COMP%]{right:50px;top:50%;transform:translateY(-50%);border-left:none;animation-delay:1s}.mid-line.top[_ngcontent-%COMP%]{top:50px;left:50%;transform:translate(-50%);border-bottom:none;animation-delay:1.5s}.mid-line.bottom[_ngcontent-%COMP%]{bottom:50px;left:50%;transform:translate(-50%);border-top:none;animation-delay:2s}.rune-circle[_ngcontent-%COMP%]{position:absolute;width:100vw;height:100vh;pointer-events:none;overflow:visible}.rune[_ngcontent-%COMP%]{position:absolute;width:18px;height:18px;background:linear-gradient(135deg,#0006,#3c3c3c4d);clip-path:polygon(50% 0%,100% 50%,50% 100%,0% 50%);transform-origin:center center;transform:translate(0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg));opacity:var(--base-opacity);will-change:transform;animation:none}.rune.clockwise[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_rune-move-clockwise 8s infinite linear;animation-delay:calc(var(--delay) * -1s)}.rune.counter-clockwise[_ngcontent-%COMP%]{animation:_ngcontent-%COMP%_rune-move-counterclockwise 8s infinite linear;animation-delay:calc(var(--delay) * -1s)}.rune[_ngcontent-%COMP%]:before{content:"";position:absolute;width:100%;height:100%;background:linear-gradient(45deg,transparent,rgba(255,255,255,.6));mix-blend-mode:screen;animation:_ngcontent-%COMP%_sparkle 4s infinite linear}.rune[_ngcontent-%COMP%]:after{content:"";position:absolute;width:140%;height:140%;top:-20%;left:-20%;background:radial-gradient(circle at center,rgba(120,200,255,.15) 0%,rgba(70,150,255,.1) 30%,transparent 70%);mix-blend-mode:screen;opacity:.5}.rune-effects[_ngcontent-%COMP%]{position:absolute;width:100vw;height:100vh;pointer-events:none;mix-blend-mode:multiply;background:radial-gradient(circle at center,transparent 0%,rgba(0,0,0,.02) 50%,transparent 100%);animation:_ngcontent-%COMP%_effect-pulse 8s infinite ease-in-out}.light-beams[_ngcontent-%COMP%]{position:absolute;width:100%;height:100%;pointer-events:none;mix-blend-mode:multiply}.beam[_ngcontent-%COMP%]{position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);background:linear-gradient(90deg,#0000001a,#28282826,#0000001a);mix-blend-mode:multiply}.beam.beam-1[_ngcontent-%COMP%]{width:600px;height:2px;animation:_ngcontent-%COMP%_beam-rotate 8s infinite linear,_ngcontent-%COMP%_beam-pulse 4s infinite ease-in-out}.beam.beam-2[_ngcontent-%COMP%]{width:400px;height:1px;animation:_ngcontent-%COMP%_beam-rotate 12s infinite linear reverse,_ngcontent-%COMP%_beam-pulse 6s infinite ease-in-out 1s}.beam.beam-3[_ngcontent-%COMP%]{width:300px;height:1px;animation:_ngcontent-%COMP%_beam-rotate 10s infinite linear,_ngcontent-%COMP%_beam-pulse 5s infinite ease-in-out 2s}.beam.beam-4[_ngcontent-%COMP%]{width:200px;height:1px;animation:_ngcontent-%COMP%_beam-rotate 14s infinite linear reverse,_ngcontent-%COMP%_beam-pulse 7s infinite ease-in-out 3s}.content[_ngcontent-%COMP%]{position:relative;z-index:2;text-align:center;display:flex;flex-direction:column;align-items:center;justify-content:center}.loading-text[_ngcontent-%COMP%]{margin-top:2rem;font-size:1rem;letter-spacing:.3em;text-transform:uppercase;color:#000000b3;font-family:Arial,sans-serif;font-weight:500}@keyframes _ngcontent-%COMP%_rotate{0%{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes _ngcontent-%COMP%_pulse{0%,to{opacity:.2}50%{opacity:.5}}@keyframes _ngcontent-%COMP%_rune-move-clockwise{0%{transform:translate(0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg))}25%{transform:translate(var(--move-x),var(--move-y)) scale(var(--scale)) rotate(calc((90 + var(--rotation-offset)) * 1deg))}50%{transform:translateY(var(--move-y)) scale(var(--scale)) rotate(calc((180 + var(--rotation-offset)) * 1deg))}75%{transform:translate(calc(var(--move-x) * -1)) scale(var(--scale)) rotate(calc((270 + var(--rotation-offset)) * 1deg))}to{transform:translate(0) scale(var(--scale)) rotate(calc((360 + var(--rotation-offset)) * 1deg))}}@keyframes _ngcontent-%COMP%_rune-move-counterclockwise{0%{transform:translate(0) scale(var(--scale)) rotate(calc(var(--rotation-offset) * 1deg))}25%{transform:translate(var(--move-x),var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 90) * 1deg))}50%{transform:translateY(var(--move-y)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 180) * 1deg))}75%{transform:translate(calc(var(--move-x) * -1)) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 270) * 1deg))}to{transform:translate(0) scale(var(--scale)) rotate(calc((var(--rotation-offset) - 360) * 1deg))}}@keyframes _ngcontent-%COMP%_beam-rotate{0%{transform:translate(-50%,-50%) rotate(0)}to{transform:translate(-50%,-50%) rotate(360deg)}}@keyframes _ngcontent-%COMP%_beam-pulse{0%,to{opacity:.2;width:100%}50%{opacity:.5;width:120%}}@keyframes _ngcontent-%COMP%_sparkle{0%,to{opacity:.4;transform:scale(1)}50%{opacity:.8;transform:scale(1.1)}}@keyframes _ngcontent-%COMP%_effect-pulse{0%,to{opacity:.3;transform:scale(1)}50%{opacity:.6;transform:scale(1.1)}}']});var Rc=so;function Tx(s,e){s&1&&Gt(0,"app-site-header")}function Ax(s,e){s&1&&Gt(0,"app-scene-loader")}function Rx(s,e){if(s&1){let t=di();he(0,"app-disclaimer",3),Bt("acknowledged",function(){$t(t);let i=vt();return Kt(i.onDisclaimerAcknowledged())}),me()}}function Px(s,e){if(s&1){let t=di();da(0),he(1,"div",4)(2,"app-cd-cases",5),Bt("loadingChange",function(i){$t(t);let r=vt();return Kt(r.onCDCasesLoadingChange(i))}),me()(),he(3,"div",6)(4,"div",7)(5,"h1"),Re(6,"Project Phantasia"),me(),he(7,"p",8),Re(8,"A Journey Through Electronic Dreams"),me()(),he(9,"div",9)(10,"p",10),Re(11," Welcome to Project Phantasia, a groundbreaking double album that pushes the boundaries of electronic dance music. "),me(),he(12,"p"),Re(13," Created by legendary producers An and Feryquitous, this masterpiece combines cutting-edge sound design with ethereal melodies to create an unprecedented auditory experience. "),me(),he(14,"div",11)(15,"div",12)(16,"h3"),Re(17,"2 Discs"),me(),he(18,"p"),Re(19,"20 original tracks spread across two themed discs"),me()(),he(20,"div",12)(21,"h3"),Re(22,"160+ BPM"),me(),he(23,"p"),Re(24,"High-energy compositions that will move your soul"),me()(),he(25,"div",12)(26,"h3"),Re(27,"Digital Art"),me(),he(28,"p"),Re(29,"Stunning visual accompaniment for each track"),me()()()()(),ha()}}var oo=class oo{constructor(e,t,n){this.cdr=e;this.router=t;this.document=n;this.isLoading=!0;this.loadingStartTime=Date.now();this.MINIMUM_LOADING_TIME=3e3;this.DISCLAIMER_STORAGE_KEY="prismatic_collections_disclaimer_acknowledged";this.showDisclaimer=!1;this.isDebugMode=!0;this.isDevelopmentMode=!0}ngOnInit(){this.isDebugMode&&console.log(`[PhantasiaComponent] Current URL: ${this.router.url}`),this.document.body.classList.add("phantasia-3d-page"),this.isDebugMode&&console.log("[PhantasiaComponent] Added phantasia-3d-page class to body"),localStorage.getItem(this.DISCLAIMER_STORAGE_KEY)?(this.showDisclaimer=!1,this.isDebugMode&&console.log("[PhantasiaComponent] Disclaimer already acknowledged")):(this.showDisclaimer=!0,this.isDebugMode&&console.log("[PhantasiaComponent] Showing disclaimer")),setTimeout(()=>{this.isLoading&&(this.isDebugMode&&console.warn("[PhantasiaComponent] Fallback timeout - forcing loading to false after 10 seconds"),this.isLoading=!1,this.cdr.markForCheck())},1e4)}get isInsidePhantasiaLayout(){return this.router.url.includes("/phantasia/")}onDisclaimerAcknowledged(){this.isDebugMode&&console.log("[PhantasiaComponent] Disclaimer acknowledged"),localStorage.setItem(this.DISCLAIMER_STORAGE_KEY,"true"),this.showDisclaimer=!1,this.cdr.markForCheck()}onCDCasesLoadingChange(e){if(this.isDebugMode&&console.log(`[PhantasiaComponent] CD Cases loading state received: ${e}, current isLoading: ${this.isLoading}`),e)this.isDebugMode&&console.log(`[PhantasiaComponent] Not updating loading state - isLoading: ${e}`);else{let t=Date.now()-this.loadingStartTime,n=Math.max(0,this.MINIMUM_LOADING_TIME-t);n>0?(this.isDebugMode&&console.log(`[PhantasiaComponent] Waiting ${n}ms to maintain minimum loading display time (3s aesthetic)`),setTimeout(()=>{this.isLoading=!1,this.isDebugMode&&console.log("[PhantasiaComponent] Loading screen shown for aesthetic minimum time - hiding now"),this.cdr.markForCheck()},n)):(this.isLoading=!1,this.isDebugMode&&console.log("[PhantasiaComponent] CD Cases finished loading - setting isLoading to false"),this.cdr.markForCheck())}this.cdr.markForCheck()}ngOnDestroy(){this.document.body.classList.remove("phantasia-3d-page"),this.isDebugMode&&console.log("[PhantasiaComponent] Removed phantasia-3d-page class from body - scrolling restored")}};oo.\u0275fac=function(t){return new(t||oo)(et(Kn),et(th),et(Gd))},oo.\u0275cmp=Tn({type:oo,selectors:[["app-phantasia"]],decls:5,vars:6,consts:[[1,"phantasia-experience"],[4,"ngIf"],[3,"acknowledged",4,"ngIf"],[3,"acknowledged"],[1,"cd-cases-container"],[3,"loadingChange"],[1,"intro-content"],[1,"hero-section"],[1,"subtitle"],[1,"description"],[1,"highlight"],[1,"features"],[1,"feature"]],template:function(t,n){t&1&&(he(0,"div",0),Jt(1,Tx,1,0,"app-site-header",1)(2,Ax,1,0,"app-scene-loader",1)(3,Rx,1,0,"app-disclaimer",2)(4,Px,30,0,"ng-container",1),me()),t&2&&(An("loading",n.isLoading),Ae(),Ze("ngIf",!n.isInsidePhantasiaLayout),Ae(),Ze("ngIf",n.isLoading),Ae(),Ze("ngIf",n.showDisclaimer),Ae(),Ze("ngIf",!n.showDisclaimer))},dependencies:[Rn,Ui,Tc,Ac,Rc,nh],styles:['[_nghost-%COMP%]{display:block}.phantasia-collection-page[_nghost-%COMP%]   .phantasia-experience[_ngcontent-%COMP%], .phantasia-collection-page   [_nghost-%COMP%]   .phantasia-experience[_ngcontent-%COMP%]{padding-top:90px}.page[_ngcontent-%COMP%]{height:100vh;width:100%;padding:2rem;box-sizing:border-box;display:flex;flex-direction:column;margin:0;background:transparent;pointer-events:none}.page[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%], .page[_ngcontent-%COMP%]   p[_ngcontent-%COMP%], .page[_ngcontent-%COMP%]   .feature[_ngcontent-%COMP%]{pointer-events:auto}h1[_ngcontent-%COMP%]{margin-bottom:2rem;font-size:2.5rem;font-weight:600;padding:0;color:#000000e6}p[_ngcontent-%COMP%]{margin-bottom:1rem;line-height:1.6;max-width:800px;font-size:1.1rem;color:#000c}.phantasia-experience[_ngcontent-%COMP%]{position:relative;width:100%;height:100vh;overflow:hidden;background-color:#000;color:#fff;font-family:"Exo 2",sans-serif}.phantasia-experience.loading[_ngcontent-%COMP%]   .cd-cases-container[_ngcontent-%COMP%], .phantasia-experience.loading[_ngcontent-%COMP%]   .intro-content[_ngcontent-%COMP%]{opacity:0;pointer-events:none;visibility:hidden}.cd-cases-container[_ngcontent-%COMP%]{position:fixed;inset:0;width:100vw;height:100vh;overflow:hidden;z-index:2;opacity:1;transition:opacity .8s ease-in-out}.intro-content[_ngcontent-%COMP%]{position:relative;z-index:3;width:100%;max-width:1200px;margin:0 auto;padding:20px;opacity:.9;transition:opacity .8s ease-in-out;margin-top:30vh;pointer-events:none}.hero-section[_ngcontent-%COMP%]{text-align:center;margin-bottom:40px}.hero-section[_ngcontent-%COMP%]   h1[_ngcontent-%COMP%]{font-size:3.5rem;font-weight:700;margin-bottom:10px;text-shadow:0 0 15px rgba(255,255,255,.7);letter-spacing:2px}.hero-section[_ngcontent-%COMP%]   .subtitle[_ngcontent-%COMP%]{font-size:1.5rem;font-weight:300;color:#b3b3ff;letter-spacing:1px}.description[_ngcontent-%COMP%]{background-color:#000000b3;border-radius:10px;padding:20px}.description[_ngcontent-%COMP%]   .highlight[_ngcontent-%COMP%]{font-size:1.2rem;font-weight:500;color:#d9d9ff;margin-bottom:15px;border-left:3px solid #6464ff;padding-left:15px}.description[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{margin-bottom:20px;line-height:1.6}.features[_ngcontent-%COMP%]{display:flex;justify-content:space-between;margin-top:30px}.features[_ngcontent-%COMP%]   .feature[_ngcontent-%COMP%]{flex:1;background-color:#28285099;padding:15px;border-radius:8px;margin:0 10px;text-align:center}.features[_ngcontent-%COMP%]   .feature[_ngcontent-%COMP%]   h3[_ngcontent-%COMP%]{font-size:1.3rem;margin-bottom:10px;color:#a9a9ff}.features[_ngcontent-%COMP%]   .feature[_ngcontent-%COMP%]   p[_ngcontent-%COMP%]{font-size:.9rem;margin-bottom:0}.features[_ngcontent-%COMP%]   .feature[_ngcontent-%COMP%]:first-child{margin-left:0}.features[_ngcontent-%COMP%]   .feature[_ngcontent-%COMP%]:last-child{margin-right:0}'],changeDetection:0});var Bp=oo;export{Bp as PhantasiaComponent};
