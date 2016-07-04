import IframeView from './core/iframe'
import Button from './core/button'

const name = 'Afrostream Checkout Widget'
const version = '1.0'

const open = function () {
  this.host = this.options.host
  this.path = this.options.path
  console.log(this.name, this.host)
  this.view = new IframeView(this.host, this.path)
  this.button = new Button(this.view, {
    label: 'toto'
  })
}

const myObject = {
  name,
  version,
  open,
  options: {
    host: 'http://localhost:9999/',//'https://widget.afrostream.tv/',
    path: '/src/polymer/index-v.html'
  }
}


myObject.open()

export default myObject
