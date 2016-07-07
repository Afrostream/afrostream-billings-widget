import helpers from './helpers'
import RPC from './rpc'
import view from './view'

export default class TabView extends view {
  constructor (host, path) {
    super(host, path)
    this.closedTabInterval = null
  }

  open (options, callback = ()=> {
  }) {
    let targetName, url, _base, _ref, _ref1
    try {
      if ((_ref = this.frame) != null) {
        _ref.close()
      }
    } catch (_error) {
    }
    if (window.name === 'afrostream_checkout_tabview') {
      window.name = ''
    }
    if (helpers.isiOSChrome()) {
      targetName = '_blank'
    } else {
      targetName = 'stripe_checkout_tabview'
    }
    this.frame = window.open(this.fullPath(), targetName)
    if (!this.frame && ((_ref1 = this.options.key) != null ? _ref1.indexOf('test') : void 0) !== -1) {
      url = 'https://stripe.com/docs/checkout#integration-more-runloop'
      console.error('Stripe Checkout was unable to open a new window, possibly due to a popup blocker.\nTo provide the best experience for your users, follow the guide at ' + url + '.\nThis message will only appear when using a test publishable key.')
    }
    if (!this.frame || this.frame === window) {
      this.close()
      callback(false)
      return
    }
    if (typeof(_base = this.frame).focus === 'function') {
      _base.focus()
    }
    this.rpc = new RPC(this.frame, {
      host: this.host
    })
    this.rpc.methods.closed = this.closed
    this.rpc.ready(()=> {
      let _base1
      callback(true)
      this.rpc.invoke('render', '', 'tab', this.options);
      this.rpc.invoke('open')
      if (typeof(_base1 = this.options).opened === 'function') {
        _base1.opened()
      }
      return this.checkForClosedTab()
    })
  }

  close () {
    if (this.frame && this.frame !== window) {
      return this.frame.close()
    }
  }

  checkForClosedTab () {
    if (this.closedTabInterval) {
      clearInterval(this.closedTabInterval)
    }
    return this.closedTabInterval = setInterval(()=> {
      if (!this.frame || !this.frame.postMessage || this.frame.closed) {
        return this.closed()
      }
    }, 100)
  }

  closed () {
    console.log('closed')
    clearInterval(this.closedTabInterval)
    clearTimeout(this.tokenTimeout)
    if (this.token != null) {
      this.onToken(this.token)
    }
  }
}
