import IframeView from './core/iframe'
import Button from './core/button'

const name = 'Afrostream Checkout Widget'
const version = '1.0'

const open = function () {
  this.host = this.options.host
  this.path = this.options.path
  console.log(this.name, this.host)
  this.view = new IframeView(this.host, this.path)
  this.button = new Button(this.view)
}

const myObject = {
  name,
  version,
  open,
  options: {
    host: '//widget.afrostream.tv/',
    path: '/dist/index.v.html'
  }
}


myObject.open()

export default myObject
