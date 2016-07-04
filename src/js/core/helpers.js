const uaVersionFn = function (re) {
  return function () {
    var uaMatch;
    uaMatch = helpers.userAgent.match(re);
    return uaMatch && parseInt(uaMatch[1])
  }
}

const delurkWinPhone = function (fn) {
  return function () {
    return fn() && !helpers.isWindowsPhone()
  }
}

const helpers = {
  userAgent: window.navigator.userAgent,
  escape: function (value) {
    return value && ('' + value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\'/g, '&quot;')
  },
  trim: function (value) {
    return value.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '')
  },
  sanitizeURL: function (value) {
    var SCHEME_WHITELIST, allowed, scheme, _i, _len;
    if (!value) {
      return
    }
    value = helpers.trim(value);
    SCHEME_WHITELIST = ['data:', 'http:', 'https:'];
    allowed = false;
    for (_i = 0, _len = SCHEME_WHITELIST.length; _i < _len; _i++) {
      scheme = SCHEME_WHITELIST[_i];
      if (value.indexOf(scheme) === 0) {
        allowed = true;
        break
      }
    }
    if (!allowed) {
      return null
    }
    return encodeURI(value)
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
  isiOSChrome: function () {
    return /CriOS/.test(helpers.userAgent)
  },
  isiOSWebView: function () {
    return /(iPhone|iPod|iPad).*AppleWebKit((?!.*Safari)|(.*\([^)]*like[^)]*Safari[^)]*\)))/i.test(helpers.userAgent)
  },
  getiOSWebViewType: function () {
    if (helpers.isiOSWebView()) {
      if (window.indexedDB) {
        return 'WKWebView'
      } else {
        return 'UIWebView'
      }
    }
  },
  isiOS: delurkWinPhone(function () {
    return /(iPhone|iPad|iPod)/i.test(helpers.userAgent)
  }),
  isiOSNative: function () {
    return this.isiOS() && this.iOSNativeVersion() >= 3
  },
  isiPad: function () {
    return /(iPad)/i.test(helpers.userAgent)
  },
  isMac: delurkWinPhone(function () {
    return /mac/i.test(helpers.userAgent)
  }),
  isWindowsPhone: function () {
    return /(Windows\sPhone|IEMobile)/i.test(helpers.userAgent)
  },
  isWindowsOS: function () {
    return /(Windows NT \d\.\d)/i.test(helpers.userAgent)
  },
  isIE: function () {
    return /(MSIE ([0-9]{1,}[\.0-9]{0,})|Trident\/)/i.test(helpers.userAgent)
  },
  isChrome: function () {
    return 'chrome' in window
  },
  isSafari: delurkWinPhone(function () {
    var userAgent;
    userAgent = helpers.userAgent;
    return /Safari/i.test(userAgent) && !/Chrome/i.test(userAgent)
  }),
  isFirefox: delurkWinPhone(function () {
    return helpers.firefoxVersion() != null
  }),
  isAndroidBrowser: function () {
    var version;
    version = helpers.androidWebkitVersion();
    return version && version < 537
  },
  isAndroidChrome: function () {
    var version;
    version = helpers.androidWebkitVersion();
    return version && version >= 537
  },
  isAndroidDevice: delurkWinPhone(function () {
    return /Android/.test(helpers.userAgent)
  }),
  isAndroidWebView: function () {
    return helpers.isAndroidChrome() && /Version\/\d+\.\d+/.test(helpers.userAgent)
  },
  isNativeWebContainer: function () {
    return window.cordova != null || /GSA\/\d+\.\d+/.test(helpers.userAgent)
  },
  isSupportedMobileOS: function () {
    return helpers.isiOS() || helpers.isAndroidDevice()
  },
  isAndroidWebapp: function () {
    var metaTag;
    if (!helpers.isAndroidChrome()) {
      return false
    }
    metaTag = document.getElementsByName('apple-mobile-web-app-capable')[0] || document.getElementsByName('mobile-web-app-capable')[0];
    return metaTag && metaTag.content === 'yes'
  },
  isiOSBroken: function () {
    var chromeVersion;
    chromeVersion = helpers.iOSChromeVersion();
    if (helpers.iOSVersion() === 9 && helpers.iOSMinorVersion() === 2 && chromeVersion && chromeVersion <= 47) {
      return true
    }
    if (helpers.isiPad() && helpers.iOSVersion() === 8) {
      switch (helpers.iOSMinorVersion()) {
        case 0:
          return true;
        case 1:
          return helpers.iOSBuildVersion() < 1
      }
    }
    return false
  },
  isUserGesture: function () {
    var _ref, _ref1;
    return (_ref = (_ref1 = window.event) != null ? _ref1.type : void 0) === 'click' || _ref === 'touchstart' || _ref === 'touchend'
  },
  isInsideFrame: function () {
    return window.top !== window.self
  },
  isFallback: function () {
    var androidVersion, criosVersion, ffVersion, iOSVersion;
    if (!('postMessage' in window) || window.postMessageDisabled || document.documentMode && document.documentMode < 8) {
      return true
    }
    androidVersion = helpers.androidVersion();
    if (androidVersion && androidVersion < 4) {
      return true
    }
    iOSVersion = helpers.iOSVersion();
    if (iOSVersion && iOSVersion < 6) {
      return true
    }
    ffVersion = helpers.firefoxVersion();
    if (ffVersion && ffVersion < 11) {
      return true
    }
    criosVersion = helpers.iOSChromeVersion();
    if (criosVersion && criosVersion < 36) {
      return true
    }
    return false
  },
  isSmallScreen: function () {
    return Math.min(window.screen.availHeight, window.screen.availWidth) <= 640 || /FakeCheckoutMobile/.test(helpers.userAgent)
  },
  pad: function (number, width, padding) {
    var leading;
    if (width == null) {
      width = 2
    }
    if (padding == null) {
      padding = '0'
    }
    number = number + '';
    if (number.length > width) {
      return number
    }
    leading = new Array(width - number.length + 1).join(padding);
    return leading + number
  },
  requestAnimationFrame: function (callback) {
    return (typeof window.requestAnimationFrame === 'function' ? window.requestAnimationFrame(callback) : void 0) || (typeof window.webkitRequestAnimationFrame === 'function' ? window.webkitRequestAnimationFrame(callback) : void 0) || window.setTimeout(callback, 100)
  },
  requestAnimationInterval: function (func, interval) {
    var callback, previous;
    previous = new Date;
    callback = function () {
      var frame, now, remaining;
      frame = helpers.requestAnimationFrame(callback);
      now = new Date;
      remaining = interval - (now - previous);
      if (remaining <= 0) {
        previous = now;
        func()
      }
      return frame
    };
    return callback()
  },
  getQueryParameterByName: function (name) {
    var match;
    match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '))
  },
  addQueryParameter: function (url, name, value) {
    var hashParts, query;
    query = encodeURIComponent(name) + '=' + encodeURIComponent(value);
    hashParts = new String(url).split('#');
    hashParts[0] += hashParts[0].indexOf('?') !== -1 ? '&' : '?';
    hashParts[0] += query;
    return hashParts.join('#')
  },
  bind: function (element, name, callback) {
    if (element.addEventListener) {
      return element.addEventListener(name, callback, false)
    } else {
      return element.attachEvent('on' + name, callback)
    }
  },
  unbind: function (element, name, callback) {
    if (element.removeEventListener) {
      return element.removeEventListener(name, callback, false)
    } else {
      return element.detachEvent('on' + name, callback)
    }
  },
  host: function (url) {
    var parent, parser;
    parent = document.createElement('div');
    parent.innerHTML = '<a href="' + this.escape(url) + '">x</a>';
    parser = parent.firstChild;
    return '' + parser.protocol + '//' + parser.host
  },
  strip: function (html) {
    var tmp, _ref, _ref1;
    tmp = document.createElement('div');
    tmp.innerHTML = html;
    return (_ref = (_ref1 = tmp.textContent) != null ? _ref1 : tmp.innerText) != null ? _ref : ''
  },
  replaceFullWidthNumbers: function (el) {
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
        char = halfWidth[idx]
      }
      replaced += char
    }
    if (original !== replaced) {
      return el.value = replaced
    }
  },
  setAutocomplete: function (el, type) {
    var secureCCFill;
    secureCCFill = helpers.chromeVersion() > 14 || helpers.safariVersion() > 7;
    if (type !== 'cc-csc' && (!/^cc-/.test(type) || secureCCFill)) {
      el.setAttribute('x-autocompletetype', type);
      el.setAttribute('autocompletetype', type)
    } else {
      el.setAttribute('autocomplete', 'off')
    }
    if (!(type === 'country-name' || type === 'language' || type === 'sex' || type === 'gender-identity')) {
      el.setAttribute('autocorrect', 'off');
      el.setAttribute('spellcheck', 'off')
    }
    if (!(/name|honorific/.test(type) || (type === 'locality' || type === 'city' || type === 'adminstrative-area' || type === 'state' || type === 'province' || type === 'region' || type === 'language' || type === 'org' || type === 'organization-title' || type === 'sex' || type === 'gender-identity'))) {
      return el.setAttribute('autocapitalize', 'off')
    }
  },
  hashCode: function (str) {
    var hash, i, _i, _ref;
    hash = 5381;
    for (i = _i = 0, _ref = str.length; _i < _ref; i = _i += 1) {
      hash = (hash << 5) + hash + str.charCodeAt(i)
    }
    return (hash >>> 0) % 65535
  },
  stripeUrlPrefix: function () {
    var match;
    match = window.location.hostname.match('^([a-z-]*)checkout.');
    if (match) {
      return match[1]
    } else {
      return ''
    }
  },
  clientLocale: function () {
    return (window.navigator.languages || [])[0] || window.navigator.userLanguage || window.navigator.language
  }
}

export default helpers
