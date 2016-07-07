import IframeView from './core/iframe'
import FallbackView from './core/fallbackView'
import TabView from './core/tabView'
import Button from './core/button'
import helpers from './core/helpers'

const name = 'Afrostream Checkout Widget'
const version = '1.0'

const createView = function (host, path) {
  let viewClass
  let shouldPopup = helpers.isSupportedMobileOS() && !(helpers.isNativeWebContainer() || helpers.isAndroidWebapp() || helpers.isiOSWebView() || helpers.isiOSBroken())
  if (helpers.isFallback()) {
    viewClass = FallbackView
  } else {
    if (shouldPopup) {
      viewClass = TabView
    } else {
      viewClass = IframeView
    }
  }

  return new viewClass(host, path)
}

const configure = function () {
  this.host = this.options.host
  this.path = this.options.path
  this.view = createView(this.host, this.path)
  if (!this.button) {
    this.button = new Button(this.view)
  }
  return this.view;
}

const AfrostreamCheckout = {
  name,
  version,
  configure,
  options: {
    host: process.env.NODE_ENV === 'production' ? '//widget.afrostream.tv/' : '/'
  },
  path: '/dist/index.v.html'
}

window.AfrostreamCheckout = AfrostreamCheckout

AfrostreamCheckout.configure()

export default AfrostreamCheckout
