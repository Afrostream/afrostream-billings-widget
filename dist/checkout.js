(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
(function (process){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _iframe = require('./core/iframe');

var _iframe2 = _interopRequireDefault(_iframe);

var _fallbackView = require('./core/fallbackView');

var _fallbackView2 = _interopRequireDefault(_fallbackView);

var _tabView = require('./core/tabView');

var _tabView2 = _interopRequireDefault(_tabView);

var _button = require('./core/button');

var _button2 = _interopRequireDefault(_button);

var _helpers = require('./core/helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var name = 'Afrostream Checkout Widget';
var version = '1.0';

var createView = function createView(host, path) {
  var viewClass = void 0;
  var shouldPopup = _helpers2.default.isSupportedMobileOS() && !(_helpers2.default.isNativeWebContainer() || _helpers2.default.isAndroidWebapp() || _helpers2.default.isiOSWebView() || _helpers2.default.isiOSBroken());
  if (_helpers2.default.isFallback()) {
    viewClass = _fallbackView2.default;
  } else {
    if (shouldPopup) {
      viewClass = _tabView2.default;
    } else {
      viewClass = _iframe2.default;
    }
  }

  return new viewClass(host, path);
};

var configure = function configure() {
  this.host = this.options.host;
  this.path = this.options.path;
  this.view = createView(this.host, this.path);
  if (!this.button) {
    this.button = new _button2.default(this.view);
  }
  return this.view;
};

var AfrostreamCheckout = {
  name: name,
  version: version,
  configure: configure,
  options: {
    host: process.env.NODE_ENV === 'production' ? '//widget.afrostream.tv/' : '/'
  },
  path: '/dist/index.v.html'
};

window.AfrostreamCheckout = AfrostreamCheckout;

AfrostreamCheckout.configure();

exports.default = AfrostreamCheckout;

}).call(this,require('_process'))
},{"./core/button":3,"./core/fallbackView":5,"./core/helpers":6,"./core/iframe":7,"./core/tabView":9,"_process":1}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Button = function () {
  function Button(view) {
    _classCallCheck(this, Button);

    this.view = view;
    this.$el = document.createElement('button');
    this.$el.setAttribute('role', 'button');
    this.$el.className = 'afrostream-button-el';
    _helpers2.default.bind(this.$el, 'click', this.submit.bind(this));
    _helpers2.default.bind(this.$el, 'touchstart', function () {});

    var element = _utils2.default.$$('afrostream-button');
    element = function () {
      var _i = void 0,
          _len = void 0,
          _results = void 0,
          el = void 0;
      _results = [];
      for (_i = 0, _len = element.length; _i < _len; _i++) {
        el = element[_i];
        if (!_utils2.default.hasClass(el, 'active')) {
          _results.push(el);
        }
      }
      return _results;
    }();

    element = element[element.length - 1];
    if (!element) {
      return;
    }
    _utils2.default.addClass(element, 'active');
    this.scriptEl = element;
    this.document = this.scriptEl.ownerDocument;
    this.view.options = this.options = this.parseOptions();
    this.render();
    this.append();
  }

  _createClass(Button, [{
    key: 'render',
    value: function render() {
      console.log('render button');
      this.$el.innerHTML = '';
      this.$span = document.createElement('span');
      _utils2.default.text(this.$span, this.options.label);
      if (!this.nostyle) {
        this.$el.style.visibility = 'hidden';
        this.$span.style.display = 'block';
        this.$span.style.minHeight = (this.options.height || 30) + 'px';
      }

      this.$style = document.createElement('link');
      this.$style.setAttribute('type', 'text/css');
      this.$style.setAttribute('rel', 'stylesheet');
      this.$style.setAttribute('href', this.view.getHost() + 'dist/checkout.min.css');
      if (this.options.src) {
        this.$img = document.createElement('img');
        this.$img.setAttribute('src', this.options.src);
        _utils2.default.addClass(this.$el, 'image');
        if (this.options.height) {
          this.$img.setAttribute('height', this.options.height);
        }
        if (this.options.width) {
          this.$img.setAttribute('width', this.options.width);
        }
        return _utils2.default.append(this.$el, this.$img);
      }
      return _utils2.default.append(this.$el, this.$span);
    }
  }, {
    key: 'disable',
    value: function disable() {
      return this.$el.setAttribute('disabled', true);
    }
  }, {
    key: 'enable',
    value: function enable() {
      return this.$el.removeAttribute('disabled');
    }
  }, {
    key: 'isDisabled',
    value: function isDisabled() {
      return _utils2.default.hasAttr(this.$el, 'disabled');
    }
  }, {
    key: 'submit',
    value: function submit(e) {
      if (typeof e.preventDefault === 'function') {
        e.preventDefault();
      }
      if (!this.isDisabled()) {
        this.open();
      }
      return false;
    }
  }, {
    key: 'open',
    value: function open() {
      return this.view.open(this.options);
    }
  }, {
    key: 'append',
    value: function append() {
      var _this = this;

      var head = void 0;
      if (this.scriptEl) {
        _utils2.default.insertAfter(this.scriptEl, this.$el);
      }
      if (!this.nostyle) {
        head = this.parentHead();
        if (head) {
          _utils2.default.append(head, this.$style);
        }
      }
      if (this.$form = this.parentForm()) {
        _helpers2.default.unbind(this.$form, 'submit', this.submit);
        _helpers2.default.bind(this.$form, 'submit', this.submit);
      }
      if (!this.nostyle) {
        setTimeout(function () {
          return _this.$el.style.visibility = 'visible';
        }, 1e3);
      }
      this.view.setHost(_helpers2.default.host(this.scriptEl.src));
      //return this.view = this.view.configure(this.options, {
      //  form: this.$form
      //})
      this.view.configure(this.options, {
        form: this.$form
      });
    }
  }, {
    key: 'parentForm',
    value: function parentForm() {
      var el = void 0,
          elements = void 0,
          _i = void 0,
          _len = void 0,
          _ref1 = void 0;
      elements = _utils2.default.parents(this.$el);
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        el = elements[_i];
        if (((_ref1 = el.tagName) != null ? _ref1.toLowerCase() : void 0) === 'form') {
          return el;
        }
      }
      return null;
    }
  }, {
    key: 'parentHead',
    value: function parentHead() {
      var _ref1 = void 0,
          _ref2 = void 0;
      return ((_ref1 = this.document) != null ? _ref1.head : void 0) || ((_ref2 = this.document) != null ? _ref2.getElementsByTagName('head')[0] : void 0) || this.document.body;
    }
  }, {
    key: 'parseOptions',
    value: function parseOptions() {
      var attr = void 0,
          match = void 0,
          options = void 0,
          _i = void 0,
          _len = void 0,
          _ref1 = void 0;
      options = {};
      _ref1 = this.scriptEl.attributes;
      for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
        attr = _ref1[_i];
        match = attr.name.match(/^data-(.+)$/);
        if (match != null ? match[1] : void 0) {
          options[match[1]] = attr.value;
        }
      }
      return options;
    }
  }]);

  return Button;
}();

exports.default = Button;

},{"./helpers":6,"./utils":10}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FallbackRPC = function () {
  function FallbackRPC(target, host) {
    _classCallCheck(this, FallbackRPC);

    this.target = target;
    this.host = host;
  }

  _createClass(FallbackRPC, [{
    key: 'invokeTarget',
    value: function invokeTarget(message) {
      var url = void 0;
      message = +new Date() + cacheBust++ + '&' + encodeURIComponent(message);
      url = this.host + '';
      return this.target.location = url.replace(/#.*$/, '') + '#' + message;
    }
  }, {
    key: 'receiveMessage',
    value: function receiveMessage(callback, delay) {
      if (delay == null) {
        delay = 100;
      }
      interval && clearInterval(interval);
      return interval = setInterval(function () {
        var hash = decodeURIComponent(window.location.hash);
        if (hash !== lastHash && re.test(hash)) {
          window.location.hash = '';
          lastHash = hash;
          return callback({
            data: hash.replace(re, '')
          });
        }
      }, delay);
    }
  }]);

  return FallbackRPC;
}();

exports.default = FallbackRPC;

},{"./helpers":6}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _view2 = require('./view');

var _view3 = _interopRequireDefault(_view2);

var _fallbackRpc = require('./fallbackRpc');

var _fallbackRpc2 = _interopRequireDefault(_fallbackRpc);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var FallbackView = function (_view) {
  _inherits(FallbackView, _view);

  function FallbackView() {
    _classCallCheck(this, FallbackView);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(FallbackView).apply(this, arguments));
  }

  _createClass(FallbackView, [{
    key: 'open',
    value: function open(options, callback) {
      var message = void 0,
          url = void 0;
      url = this.fullPath();
      this.frame = window.open(url, 'afrostream_checkout_app', 'width=400,height=400,location=yes,resizable=yes,scrollbars=yes');
      if (this.frame == null) {
        alert('Disable your popup blocker to proceed with checkout.');
        url = 'support@afrostream.tv';
        throw new Error('To learn how to prevent the Stripe Checkout popup from being blocked, please call ' + url);
      }
      this.rpc = new _fallbackRpc2.default(this.frame, url);
      message = JSON.stringify(this.options);
      this.rpc.invokeTarget(message);
      return callback(true);
    }
  }, {
    key: 'close',
    value: function close() {
      var _ref = void 0;
      return (_ref = this.frame) != null ? _ref.close() : void 0;
    }
  }]);

  return FallbackView;
}(_view3.default);

exports.default = FallbackView;

},{"./fallbackRpc":4,"./view":11}],6:[function(require,module,exports){
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

},{}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _utils = require('./utils');

var _utils2 = _interopRequireDefault(_utils);

var _rpc = require('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _view2 = require('./view');

var _view3 = _interopRequireDefault(_view2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var IframeView = function (_view) {
  _inherits(IframeView, _view);

  function IframeView() {
    _classCallCheck(this, IframeView);

    return _possibleConstructorReturn(this, Object.getPrototypeOf(IframeView).apply(this, arguments));
  }

  _createClass(IframeView, [{
    key: 'showTouchOverlay',
    value: function showTouchOverlay() {
      if (this.overlay) {
        return;
      }
      this.overlay = document.createElement('div');
      this.overlay.style.cssText = 'z-index: 2147483646;\nbackground: #000;\nopacity: 0;\nborder: 0px none transparent;\noverflow: none;\nmargin: 0;\npadding: 0;\n-webkit-tap-highlight-color: transparent;\n-webkit-touch-callout: none;\ntransition: opacity 320ms ease;\n-webkit-transition: opacity 320ms ease;\n-moz-transition: opacity 320ms ease;\n-ms-transition: opacity 320ms ease;';
      this.overlay.style.position = 'absolute';
      this.overlay.style.left = 0;
      this.overlay.style.top = 0;
      this.overlay.style.width = document.body.scrollWidth + 'px';
      this.overlay.style.height = document.body.scrollHeight + 'px';
      _utils2.default.append(document.body, this.overlay);
      return this.overlay.style.opacity = '0.5';
    }
  }, {
    key: 'removeTouchOverlay',
    value: function removeTouchOverlay() {
      var overlay = void 0;
      if (!this.overlay) {
        return;
      }
      overlay = this.overlay;
      overlay.style.opacity = '0';
      setTimeout(function () {
        return _utils2.default.remove(overlay);
      }, 400);
      return this.overlay = null;
    }
  }, {
    key: 'removeFrame',
    value: function removeFrame() {
      var frame = void 0;
      if (this.shouldShowTouchOverlay()) {
        this.removeTouchOverlay();
      }
      frame = this.frame;
      setTimeout(function () {
        return _utils2.default.remove(frame);
      }, 500);
      return this.frame = null;
    }
  }, {
    key: 'configure',
    value: function configure() {
      if (this.frame != null) {
        this.removeFrame();
      }
      this.frame = this.attachIframe();
      this.rpc = new _rpc2.default(this.frame.contentWindow);

      this.rpc.methods.close = this.close.bind(this);
      this.rpc.methods.opened = this.opened.bind(this);
      this.rpc.methods.closed = this.closed.bind(this);
      this.rpc.ready(function () {
        console.log('rpc done');
      });
      return this.frame;
    }
  }, {
    key: 'shouldShowTouchOverlay',
    value: function shouldShowTouchOverlay() {
      return _helpers2.default.isSupportedMobileOS();
    }
  }, {
    key: 'iframeWidth',
    value: function iframeWidth() {
      if (_helpers2.default.isSmallScreen()) {
        return 328;
      } else {
        return 380;
      }
    }
  }, {
    key: 'close',
    value: function close() {
      if (!!this.rpc.target.window) {
        return this.rpc.invoke('close');
      }
    }
  }, {
    key: 'closed',
    value: function closed(e) {
      document.body.style.overflow = this.originalOverflowValue;
      this.removeFrame();
      clearTimeout(this.tokenTimeout);
      if ((e != null ? e.type : void 0) === 'error.close') {
        return alert(e.message);
      }
    }
  }, {
    key: 'opened',
    value: function opened() {}
  }, {
    key: 'attachIframe',
    value: function attachIframe() {
      var _this2 = this;

      var cssText = void 0;
      var iframe = void 0;
      iframe = document.createElement('iframe');
      iframe.setAttribute('frameBorder', '0');
      iframe.setAttribute('allowtransparency', 'true');
      cssText = 'z-index: 2147483647;\ndisplay: none;\nbackground: transparent;\nbackground: rgba(0,0,0,0.005);\nborder: 0px none transparent;\noverflow-x: hidden;\noverflow-y: auto;\nvisibility: hidden;\nmargin: 0;\npadding: 0;\n-webkit-tap-highlight-color: transparent;\n-webkit-touch-callout: none;';
      if (this.shouldShowTouchOverlay()) {
        cssText += 'position: absolute;\nwidth: ' + this.iframeWidth() + 'px;\nheight: ' + document.body.scrollHeight + 'px;';
      } else {
        cssText += 'position: fixed;\nleft: 0;\ntop: 0;\nwidth: 100%;\nheight: 100%;';
      }
      iframe.style.cssText = cssText;
      _helpers2.default.bind(iframe, 'load', function () {
        return iframe.style.visibility = 'visible';
      });
      iframe.src = this.fullPath();
      iframe.className = iframe.name = 'afrostream_checkout_app';

      iframe.onload = iframe.onreadystatechange = function () {
        var rs = _this2.readyState;
        if (!rs || /loaded|complete/.test(rs)) {
          iframe.onload = iframe.onreadystatechange = null;
          _this2.loaded = true;
        }
      };

      _utils2.default.append(document.body, iframe);
      return iframe;
    }
  }, {
    key: 'open',
    value: function open() {
      var _this3 = this;

      var _ref = void 0;
      this.originalOverflowValue = document.body.style.overflow;
      if (this.frame == null) {
        this.configure();
      }
      if (typeof $ !== 'undefined' && $ !== null ? (_ref = $.fn) != null ? _ref.modal : void 0 : void 0) {
        $(document).off('focusin.bs.modal').off('focusin.modal');
      }
      this.frame.style.display = 'block';

      if (this.shouldShowTouchOverlay()) {
        this.showTouchOverlay();
        var left = window.scrollX || window.pageXOffset;
        if (this.iframeWidth() < window.innerWidth) {
          left += (window.innerWidth - this.iframeWidth()) / 2;
        }
        this.frame.style.top = (window.scrollY || window.pageYOffset) + 'px';
        this.frame.style.left = left + 'px';
      }

      setTimeout(function () {
        if (_this3.loaded) {
          return;
        }
        return _this3.removeFrame();
      }, 8e3);

      return this.rpc.ready(function () {
        _this3.rpc.invoke('render', '', 'iframe', _this3.options);
        if (_helpers2.default.isIE()) {
          document.body.style.overflow = 'hidden';
        }
        return _this3.rpc.invoke('open', {});
      });
    }
  }]);

  return IframeView;
}(_view3.default);

exports.default = IframeView;

},{"./helpers":6,"./rpc":8,"./utils":10,"./view":11}],8:[function(require,module,exports){
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

},{"./helpers":6}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _helpers = require('./helpers');

var _helpers2 = _interopRequireDefault(_helpers);

var _rpc = require('./rpc');

var _rpc2 = _interopRequireDefault(_rpc);

var _view2 = require('./view');

var _view3 = _interopRequireDefault(_view2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var TabView = function (_view) {
  _inherits(TabView, _view);

  function TabView(host, path) {
    _classCallCheck(this, TabView);

    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(TabView).call(this, host, path));

    _this.closedTabInterval = null;
    return _this;
  }

  _createClass(TabView, [{
    key: 'open',
    value: function open(options) {
      var _this2 = this;

      var callback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

      var targetName = void 0,
          url = void 0,
          _base = void 0,
          _ref = void 0,
          _ref1 = void 0;
      try {
        if ((_ref = this.frame) != null) {
          _ref.close();
        }
      } catch (_error) {}
      if (window.name === 'afrostream_checkout_tabview') {
        window.name = '';
      }
      if (_helpers2.default.isiOSChrome()) {
        targetName = '_blank';
      } else {
        targetName = 'stripe_checkout_tabview';
      }
      this.frame = window.open(this.fullPath(), targetName);
      if (!this.frame && ((_ref1 = this.options.key) != null ? _ref1.indexOf('test') : void 0) !== -1) {
        url = 'https://stripe.com/docs/checkout#integration-more-runloop';
        console.error('Stripe Checkout was unable to open a new window, possibly due to a popup blocker.\nTo provide the best experience for your users, follow the guide at ' + url + '.\nThis message will only appear when using a test publishable key.');
      }
      if (!this.frame || this.frame === window) {
        this.close();
        callback(false);
        return;
      }
      if (typeof (_base = this.frame).focus === 'function') {
        _base.focus();
      }
      this.rpc = new _rpc2.default(this.frame, {
        host: this.host
      });
      this.rpc.methods.closed = this.closed;
      this.rpc.ready(function () {
        var _base1 = void 0;
        callback(true);
        _this2.rpc.invoke('render', '', 'tab', _this2.options);
        _this2.rpc.invoke('open');
        if (typeof (_base1 = _this2.options).opened === 'function') {
          _base1.opened();
        }
        return _this2.checkForClosedTab();
      });
    }
  }, {
    key: 'close',
    value: function close() {
      if (this.frame && this.frame !== window) {
        return this.frame.close();
      }
    }
  }, {
    key: 'checkForClosedTab',
    value: function checkForClosedTab() {
      var _this3 = this;

      if (this.closedTabInterval) {
        clearInterval(this.closedTabInterval);
      }
      return this.closedTabInterval = setInterval(function () {
        if (!_this3.frame || !_this3.frame.postMessage || _this3.frame.closed) {
          return _this3.closed();
        }
      }, 100);
    }
  }, {
    key: 'closed',
    value: function closed() {
      console.log('closed');
      clearInterval(this.closedTabInterval);
      clearTimeout(this.tokenTimeout);
      if (this.token != null) {
        this.onToken(this.token);
      }
    }
  }]);

  return TabView;
}(_view3.default);

exports.default = TabView;

},{"./helpers":6,"./rpc":8,"./view":11}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var __indexOf = [].indexOf || function (item) {
  for (var i = 0, l = this.length; i < l; i++) {
    if (i in this && this[i] === item) return i;
  }
  return -1;
};

var $ = function $(sel) {
  return document.querySelectorAll(sel);
};

var $$ = function $$(cls) {
  var el, reg, _i, _len, _ref, _results;
  if (typeof document.getElementsByClassName === 'function') {
    return document.getElementsByClassName(cls);
  } else if (typeof document.querySelectorAll === 'function') {
    return document.querySelectorAll('.' + cls);
  } else {
    reg = new RegExp('(^|\\s)' + cls + '(\\s|$)');
    _ref = document.getElementsByTagName('*');
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i];
      if (reg.test(el.className)) {
        _results.push(el);
      }
    }
    return _results;
  }
};

var hasAttr = function hasAttr(element, attr) {
  var node;
  if (typeof element.hasAttribute === 'function') {
    return element.hasAttribute(attr);
  } else {
    node = element.getAttributeNode(attr);
    return !!(node && (node.specified || node.nodeValue));
  }
};

var trigger = function trigger(element, name, data, bubble) {
  if (data == null) {
    data = {};
  }
  if (bubble == null) {
    bubble = true;
  }
  if (window.jQuery) {
    return jQuery(element).trigger(name, data);
  }
};

var addClass = function addClass(element, name) {
  return element.className += ' ' + name;
};

var hasClass = function hasClass(element, name) {
  return __indexOf.call(element.className.split(' '), name) >= 0;
};

var css = function css(element, _css) {
  return element.style.cssText += '' + _css;
};

var insertBefore = function insertBefore(element, child) {
  return element.parentNode.insertBefore(child, element);
};

var insertAfter = function insertAfter(element, child) {
  return element.parentNode.insertBefore(child, element.nextSibling);
};

var append = function append(element, child) {
  return element.appendChild(child);
};

var remove = function remove(element) {
  var _ref;
  return (_ref = element.parentNode) != null ? _ref.removeChild(element) : void 0;
};

var parents = function parents(node) {
  var ancestors;
  ancestors = [];
  while ((node = node.parentNode) && node !== document && __indexOf.call(ancestors, node) < 0) {
    ancestors.push(node);
  }
  return ancestors;
};

var resolve = function resolve(url) {
  var parser;
  parser = document.createElement('a');
  parser.href = url;
  return '' + parser.href;
};

var text = function text(element, value) {
  if ('innerText' in element) {
    element.innerText = value;
  } else {
    element.textContent = value;
  }
  return value;
};

exports.default = {
  $: $,
  $$: $$,
  hasAttr: hasAttr,
  trigger: trigger,
  addClass: addClass,
  hasClass: hasClass,
  css: css,
  insertBefore: insertBefore,
  insertAfter: insertAfter,
  append: append,
  remove: remove,
  parents: parents,
  resolve: resolve,
  text: text
};

},{}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var view = function () {
  function view(host, path) {
    _classCallCheck(this, view);

    this.host = host;
    this.path = path;
  }

  _createClass(view, [{
    key: 'getHost',
    value: function getHost() {
      return this.host;
    }
  }, {
    key: 'setHost',
    value: function setHost(host) {
      return this.host = host;
    }
  }, {
    key: 'fullPath',
    value: function fullPath() {
      return this.host + this.path + (this.options && this.options.key ? '?key=' + this.options.key : '') + (this.options && this.options.coupon ? '?coupon=' + this.options.coupon : '');
    }
  }, {
    key: 'open',
    value: function open(options, callback) {}
  }, {
    key: 'configure',
    value: function configure() {}
  }]);

  return view;
}();

exports.default = view;

},{}]},{},[2]);
