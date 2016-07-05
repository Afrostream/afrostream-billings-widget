import IframeView from './core/iframe'
import Button from './core/button'

const name = 'Afrostream Checkout Widget'
const version = '1.0'

const configure = function () {
  this.host = this.options.host
  this.path = this.options.path
  if (!this.view) {
    this.view = new IframeView(this.host, this.path)
  }
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
    //host: 'http://localhost:9999/',
    host: '//widget.afrostream.tv/',
    path: '/dist/index.v.html'
  }
}

window.AfrostreamCheckout = AfrostreamCheckout

AfrostreamCheckout.configure()

export default AfrostreamCheckout
