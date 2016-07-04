import helpers from './helpers'
import utils from './utils'
import RPC from './rpc'

export default class IframeView {
  constructor (host, path) {
    this.host = host
    this.path = path
  }

  getHost () {
    return this.host
  }

  setHost (host) {
    return this.host = host
  }

  showTouchOverlay () {
    if (this.overlay) {
      return
    }
    this.overlay = document.createElement('div')
    this.overlay.style.cssText = 'z-index: 2147483646;\nbackground: #000;\nopacity: 0;\nborder: 0px none transparent;\noverflow: none;\nmargin: 0;\npadding: 0;\n-webkit-tap-highlight-color: transparent;\n-webkit-touch-callout: none;\ntransition: opacity 320ms ease;\n-webkit-transition: opacity 320ms ease;\n-moz-transition: opacity 320ms ease;\n-ms-transition: opacity 320ms ease;'
    this.overlay.style.position = 'absolute'
    this.overlay.style.left = 0
    this.overlay.style.top = 0
    this.overlay.style.width = document.body.scrollWidth + 'px'
    this.overlay.style.height = document.body.scrollHeight + 'px'
    utils.append(document.body, this.overlay)
    return this.overlay.style.opacity = '0.5'
  }

  removeTouchOverlay () {
    let overlay
    if (!this.overlay) {
      return
    }
    overlay = this.overlay
    overlay.style.opacity = '0'
    setTimeout(()=> {
      return utils.remove(overlay)
    }, 400)
    return this.overlay = null
  }

  removeFrame () {
    let frame
    if (this.shouldShowTouchOverlay()) {
      this.removeTouchOverlay()
    }
    frame = this.frame
    setTimeout(function () {
      return utils.remove(frame)
    }, 500)
    return this.frame = null
  }

  configure () {
    if (this.frame != null) {
      this.removeFrame()
    }
    this.frame = this.attachIframe()
    this.rpc = new RPC(this.frame.contentWindow)

    this.rpc.methods.close = this.close.bind(this)
    this.rpc.methods.opened = this.opened.bind(this)
    this.rpc.methods.closed = this.closed.bind(this)
    this.rpc.ready(()=> {
      console.log('rpc done')
    })
    return this.frame
  }

  shouldShowTouchOverlay () {
    return helpers.isSupportedMobileOS()
  }

  iframeWidth () {
    if (helpers.isSmallScreen()) {
      return 328
    } else {
      return 380
    }
  }

  close () {
    if (!!this.rpc.target.window) {
      return this.rpc.invoke('close')
    }
  }

  closed (e) {
    document.body.style.overflow = this.originalOverflowValue
    this.removeFrame()
    clearTimeout(this.tokenTimeout)
    if ((e != null ? e.type : void 0) === 'error.close') {
      return alert(e.message)
    }
  }

  opened () {
  }

  attachIframe () {
    let cssText
    let iframe
    iframe = document.createElement('iframe')
    iframe.setAttribute('frameBorder', '0')
    iframe.setAttribute('allowtransparency', 'true')
    cssText = 'z-index: 2147483647;\ndisplay: none;\nbackground: transparent;\nbackground: rgba(0,0,0,0.005);\nborder: 0px none transparent;\noverflow-x: hidden;\noverflow-y: auto;\nvisibility: hidden;\nmargin: 0;\npadding: 0;\n-webkit-tap-highlight-color: transparent;\n-webkit-touch-callout: none;'
    if (this.shouldShowTouchOverlay()) {
      cssText += 'position: absolute;\nwidth: ' + this.iframeWidth() + 'px;\nheight: ' + document.body.scrollHeight + 'px;'
    } else {
      cssText += 'position: fixed;\nleft: 0;\ntop: 0;\nwidth: 100%;\nheight: 100%;'
    }
    iframe.style.cssText = cssText
    helpers.bind(iframe, 'load', function () {
      return iframe.style.visibility = 'visible'
    })
    iframe.src = this.host + this.path
    iframe.className = iframe.name = 'stripe_checkout_app'

    iframe.onload = iframe.onreadystatechange = ()=> {
      let rs = this.readyState;
      if (!rs || /loaded|complete/.test(rs)) {
        iframe.onload = iframe.onreadystatechange = null
        this.loaded = true
      }
    };

    utils.append(document.body, iframe)
    return iframe
  }

  open () {
    this.originalOverflowValue = document.body.style.overflow
    if (this.frame == null) {
      this.configure()
    }
    if (typeof $ !== 'undefined' && $ !== null ? (_ref = $.fn) != null ? _ref.modal : void 0 : void 0) {
      $(document).off('focusin.bs.modal').off('focusin.modal')
    }
    this.frame.style.display = 'block'

    if (this.shouldShowTouchOverlay()) {
      this.showTouchOverlay()
      let left = window.scrollX || window.pageXOffset;
      if (this.iframeWidth() < window.innerWidth) {
        left += (window.innerWidth - this.iframeWidth()) / 2
      }
      this.frame.style.top = (window.scrollY || window.pageYOffset) + 'px'
      this.frame.style.left = left + 'px'
    }

    setTimeout(()=> {
      if (this.loaded) {
        return
      }
      return this.removeFrame()
    }, 8e3)

    return this.rpc.ready(()=> {
      this.rpc.invoke('render', '', 'iframe', this.options);
      if (helpers.isIE()) {
        document.body.style.overflow = 'hidden'
      }
      return this.rpc.invoke('open', {})
    })
  }
}
