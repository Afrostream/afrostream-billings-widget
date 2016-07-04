(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var uaVersionFn = function uaVersionFn(re) {
  return function () {
    var uaMatch;
    uaMatch = helpers.userAgent.match(re);
    return uaMatch && parseInt(uaMatch[1]);
  };
};

var delurkWinPhone = function delurkWinPhone(fn) {
  return function () {
    return fn() && !helpers.isWindowsPhone();
  };
};

var helpers = {
  userAgent: window.navigator.userAgent,
  escape: function escape(value) {
    return value && ('' + value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\'/g, '&quot;');
  },
  trim: function trim(value) {
    return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
  },
  sanitizeURL: function sanitizeURL(value) {
    var SCHEME_WHITELIST, allowed, scheme, _i, _len;
    if (!value) {
      return;
    }
    value = helpers.trim(value);
    SCHEME_WHITELIST = ['data:', 'http:', 'https:'];
    allowed = false;
    for (_i = 0, _len = SCHEME_WHITELIST.length; _i < _len; _i++) {
      scheme = SCHEME_WHITELIST[_i];
      if (value.indexOf(scheme) === 0) {
        allowed = true;
        break;
      }
    }
    if (!allowed) {
      return null;
    }
    return encodeURI(value);
  },
  iOSVersion: uaVersionFn(/(?:iPhone OS |iPad; CPU OS )(\d+)_\d+/),
  iOSMinorVersion: uaVersionFn(/(?:iPhone OS |iPad; CPU OS )\d+_(\d+)/),
  iOSBuildVersion: uaVersionFn(/(?:iPhone OS |iPad; CPU OS )\d+_\d+_(\d+)/),
  androidWebkitVersion: uaVersionFn(/Mozilla\/5\.0.*Android.*AppleWebKit\/([\d]+)/),
  androidVersion: uaVersionFn(/Android (\d+)\.\d+/),
  firefoxVersion: uaVersionFn(/Firefox\/(\d+)\.\d+/),
  chromeVersion: uaVersionFn(/Chrome\/(\d+)\.\d+/),
  safariVersion: uaVersionFn(/Version\/(\d+)\.\d+ Safari/),
  iOSChromeVersion: uaVersionFn(/CriOS\/(\d+)\.\d+/),
  iOSNativeVersion: uaVersionFn(/Stripe\/(\d+)\.\d+/),
  ieVersion: uaVersionFn(/(?:MSIE |Trident\/.*rv:)(\d{1,2})\./),
  isiOSChrome: function isiOSChrome() {
    return (/CriOS/.test(helpers.userAgent)
    );
  },
  isiOSWebView: function isiOSWebView() {
    return (/(iPhone|iPod|iPad).*AppleWebKit((?!.*Safari)|(.*\([^)]*like[^)]*Safari[^)]*\)))/i.test(helpers.userAgent)
    );
  },
  getiOSWebViewType: function getiOSWebViewType() {
    if (helpers.isiOSWebView()) {
      if (window.indexedDB) {
        return 'WKWebView';
      } else {
        return 'UIWebView';
      }
    }
  },
  isiOS: delurkWinPhone(function () {
    return (/(iPhone|iPad|iPod)/i.test(helpers.userAgent)
    );
  }),
  isiOSNative: function isiOSNative() {
    return this.isiOS() && this.iOSNativeVersion() >= 3;
  },
  isiPad: function isiPad() {
    return (/(iPad)/i.test(helpers.userAgent)
    );
  },
  isMac: delurkWinPhone(function () {
    return (/mac/i.test(helpers.userAgent)
    );
  }),
  isWindowsPhone: function isWindowsPhone() {
    return (/(Windows\sPhone|IEMobile)/i.test(helpers.userAgent)
    );
  },
  isWindowsOS: function isWindowsOS() {
    return (/(Windows NT \d\.\d)/i.test(helpers.userAgent)
    );
  },
  isIE: function isIE() {
    return (/(MSIE ([0-9]{1,}[\.0-9]{0,})|Trident\/)/i.test(helpers.userAgent)
    );
  },
  isChrome: function isChrome() {
    return 'chrome' in window;
  },
  isSafari: delurkWinPhone(function () {
    var userAgent;
    userAgent = helpers.userAgent;
    return (/Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)
    );
  }),
  isFirefox: delurkWinPhone(function () {
    return helpers.firefoxVersion() != null;
  }),
  isAndroidBrowser: function isAndroidBrowser() {
    var version;
    version = helpers.androidWebkitVersion();
    return version && version < 537;
  },
  isAndroidChrome: function isAndroidChrome() {
    var version;
    version = helpers.androidWebkitVersion();
    return version && version >= 537;
  },
  isAndroidDevice: delurkWinPhone(function () {
    return (/Android/.test(helpers.userAgent)
    );
  }),
  isAndroidWebView: function isAndroidWebView() {
    return helpers.isAndroidChrome() && /Version\/\d+\.\d+/.test(helpers.userAgent);
  },
  isNativeWebContainer: function isNativeWebContainer() {
    return window.cordova != null || /GSA\/\d+\.\d+/.test(helpers.userAgent);
  },
  isSupportedMobileOS: function isSupportedMobileOS() {
    return helpers.isiOS() || helpers.isAndroidDevice();
  },
  isAndroidWebapp: function isAndroidWebapp() {
    var metaTag;
    if (!helpers.isAndroidChrome()) {
      return false;
    }
    metaTag = document.getElementsByName('apple-mobile-web-app-capable')[0] || document.getElementsByName('mobile-web-app-capable')[0];
    return metaTag && metaTag.content === 'yes';
  },
  isiOSBroken: function isiOSBroken() {
    var chromeVersion;
    chromeVersion = helpers.iOSChromeVersion();
    if (helpers.iOSVersion() === 9 && helpers.iOSMinorVersion() === 2 && chromeVersion && chromeVersion <= 47) {
      return true;
    }
    if (helpers.isiPad() && helpers.iOSVersion() === 8) {
      switch (helpers.iOSMinorVersion()) {
        case 0:
          return true;
        case 1:
          return helpers.iOSBuildVersion() < 1;
      }
    }
    return false;
  },
  isUserGesture: function isUserGesture() {
    var _ref, _ref1;
    return (_ref = (_ref1 = window.event) != null ? _ref1.type : void 0) === 'click' || _ref === 'touchstart' || _ref === 'touchend';
  },
  isInsideFrame: function isInsideFrame() {
    return window.top !== window.self;
  },
  isFallback: function isFallback() {
    var androidVersion, criosVersion, ffVersion, iOSVersion;
    if (!('postMessage' in window) || window.postMessageDisabled || document.documentMode && document.documentMode < 8) {
      return true;
    }
    androidVersion = helpers.androidVersion();
    if (androidVersion && androidVersion < 4) {
      return true;
    }
    iOSVersion = helpers.iOSVersion();
    if (iOSVersion && iOSVersion < 6) {
      return true;
    }
    ffVersion = helpers.firefoxVersion();
    if (ffVersion && ffVersion < 11) {
      return true;
    }
    criosVersion = helpers.iOSChromeVersion();
    if (criosVersion && criosVersion < 36) {
      return true;
    }
    return false;
  },
  isSmallScreen: function isSmallScreen() {
    return Math.min(window.screen.availHeight, window.screen.availWidth) <= 640 || /FakeCheckoutMobile/.test(helpers.userAgent);
  },
  pad: function pad(number, width, padding) {
    var leading;
    if (width == null) {
      width = 2;
    }
    if (padding == null) {
      padding = '0';
    }
    number = number + '';
    if (number.length > width) {
      return number;
    }
    leading = new Array(width - number.length + 1).join(padding);
    return leading + number;
  },
  requestAnimationFrame: function requestAnimationFrame(callback) {
    return (typeof window.requestAnimationFrame === 'function' ? window.requestAnimationFrame(callback) : void 0) || (typeof window.webkitRequestAnimationFrame === 'function' ? window.webkitRequestAnimationFrame(callback) : void 0) || window.setTimeout(callback, 100);
  },
  requestAnimationInterval: function requestAnimationInterval(func, interval) {
    var _callback, previous;
    previous = new Date();
    _callback = function callback() {
      var frame, now, remaining;
      frame = helpers.requestAnimationFrame(_callback);
      now = new Date();
      remaining = interval - (now - previous);
      if (remaining <= 0) {
        previous = now;
        func();
      }
      return frame;
    };
    return _callback();
  },
  getQueryParameterByName: function getQueryParameterByName(name) {
    var match;
    match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  },
  addQueryParameter: function addQueryParameter(url, name, value) {
    var hashParts, query;
    query = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    hashParts = new String(url).split('#');
    hashParts[0] += hashParts[0].indexOf('?') !== -1 ? '&' : '?';
    hashParts[0] += query;
    return hashParts.join('#');
  },
  bind: function bind(element, name, callback) {
    if (element.addEventListener) {
      return element.addEventListener(name, callback, false);
    } else {
      return element.attachEvent('on' + name, callback);
    }
  },
  unbind: function unbind(element, name, callback) {
    if (element.removeEventListener) {
      return element.removeEventListener(name, callback, false);
    } else {
      return element.detachEvent('on' + name, callback);
    }
  },
  host: function host(url) {
    var parent, parser;
    parent = document.createElement('div');
    parent.innerHTML = '<a href="' + this.escape(url) + '">x</a>';
    parser = parent.firstChild;
    return '' + parser.protocol + '//' + parser.host;
  },
  strip: function strip(html) {
    var tmp, _ref, _ref1;
    tmp = document.createElement('div');
    tmp.innerHTML = html;
    return (_ref = (_ref1 = tmp.textContent) != null ? _ref1 : tmp.innerText) != null ? _ref : '';
  },
  replaceFullWidthNumbers: function replaceFullWidthNumbers(el) {
    var char, fullWidth, halfWidth, idx, original, replaced, _i, _len, _ref;
    fullWidth = 'ï¼ï¼‘ï¼’ï¼“ï¼”ï¼•ï¼–ï¼—ï¼˜ï¼™';
    halfWidth = '0123456789';
    original = el.value;
    replaced = '';
    _ref = original.split('');
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      char = _ref[_i];
      idx = fullWidth.indexOf(char);
      if (idx > -1) {
        char = halfWidth[idx];
      }
      replaced += char;
    }
    if (original !== replaced) {
      return el.value = replaced;
    }
  },
  setAutocomplete: function setAutocomplete(el, type) {
    var secureCCFill;
    secureCCFill = helpers.chromeVersion() > 14 || helpers.safariVersion() > 7;
    if (type !== 'cc-csc' && (!/^cc-/.test(type) || secureCCFill)) {
      el.setAttribute('x-autocompletetype', type);
      el.setAttribute('autocompletetype', type);
    } else {
      el.setAttribute('autocomplete', 'off');
    }
    if (!(type === 'country-name' || type === 'language' || type === 'sex' || type === 'gender-identity')) {
      el.setAttribute('autocorrect', 'off');
      el.setAttribute('spellcheck', 'off');
    }
    if (!(/name|honorific/.test(type) || type === 'locality' || type === 'city' || type === 'adminstrative-area' || type === 'state' || type === 'province' || type === 'region' || type === 'language' || type === 'org' || type === 'organization-title' || type === 'sex' || type === 'gender-identity')) {
      return el.setAttribute('autocapitalize', 'off');
    }
  },
  hashCode: function hashCode(str) {
    var hash, i, _i, _ref;
    hash = 5381;
    for (i = _i = 0, _ref = str.length; _i < _ref; i = _i += 1) {
      hash = (hash << 5) + hash + str.charCodeAt(i);
    }
    return (hash >>> 0) % 65535;
  },
  stripeUrlPrefix: function stripeUrlPrefix() {
    var match;
    match = window.location.hostname.match('^([a-z-]*)checkout.');
    if (match) {
      return match[1];
    } else {
      return '';
    }
  },
  clientLocale: function clientLocale() {
    return (window.navigator.languages || [])[0] || window.navigator.userLanguage || window.navigator.language;
  }
};

exports.default = helpers;

},{}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var RPC = function () {
  function RPC(target, options) {
    _classCallCheck(this, RPC);

    if (options == null) {
      options = {};
    }

    this.rpcID = 0;
    this.target = target;
    this.callbacks = {};
    this.readyQueue = [];
    this.readyStatus = false;
    this.methods = {};
    _helpers2.default.bind(window, 'message', this.message.bind(this));
  }

  _createClass(RPC, [{
    key: 'startSession',
    value: function startSession() {
      this.sendMessage('frameReady');
      return this.frameReady();
    }
  }, {
    key: 'invoke',
    value: function invoke() {
      var __slice = [].slice;
      var self = this;
      var args = void 0,
          method = void 0;
      method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.ready(function () {
        return self.sendMessage(method, args);
      });
    }
  }, {
    key: 'message',
    value: function message(e) {
      var shouldProcess = false;
      try {
        shouldProcess = e.source === this.target;
      } catch (_error) {
        console.log(_error);
      }

      if (shouldProcess) {
        return this.processMessage(e.data);
      }
    }
  }, {
    key: 'ready',
    value: function ready(fn) {
      if (this.readyStatus) {
        return fn();
      } else {
        return this.readyQueue.push(fn);
      }
    }
  }, {
    key: 'frameCallback',
    value: function frameCallback(id, result) {
      delete this.callbacks[id];
      return true;
    }
  }, {
    key: 'frameReady',
    value: function frameReady() {
      var callbacks, cb, _i, _len;
      this.readyStatus = true;
      callbacks = this.readyQueue.slice(0);
      for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
        cb = callbacks[_i];
        cb();
      }
      return false;
    }
  }, {
    key: 'isAlive',
    value: function isAlive() {
      return true;
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(method, args) {
      var err, id, message, _ref;
      if (args == null) {
        args = [];
      }
      id = ++this.rpcID;
      if (typeof args[args.length - 1] === 'function') {
        this.callbacks[id] = args.pop();
      }
      message = JSON.stringify({
        method: method,
        args: args,
        id: id
      });
      if (((_ref = this.target) != null ? _ref.postMessage : void 0) == null) {
        err = new Error('Unable to communicate with Checkout. Please contact support@stripe.com if the problem persists.');
        if (this.methods.rpcError != null) {
          this.methods.rpcError(err);
        } else {
          throw err;
        }
        return;
      }
      this.target.postMessage(message, '*');
    }
  }, {
    key: 'processMessage',
    value: function processMessage(data) {
      var method, result, _base, _name;
      try {
        data = JSON.parse(data);
      } catch (_error) {
        return;
      }
      if (['frameReady', 'frameCallback', 'isAlive'].indexOf(data.method) !== -1) {
        result = null;
        method = this[data.method];
        if (method != null) {
          result = method.apply(this, data.args);
        }
      } else {
        result = typeof (_base = this.methods)[_name = data.method] === 'function' ? _base[_name].apply(_base, data.args) : void 0;
      }
      if (data.method !== 'frameCallback') {
        return this.invoke('frameCallback', data.id, result);
      }
    }
  }]);

  return RPC;
}();

window.RPC = RPC;

exports.default = RPC;

},{"./helpers":1}]},{},[2]);
