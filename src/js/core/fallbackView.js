import view from './view'
import FallbackRPC from './fallbackRpc'

export default class FallbackView extends view {

  open (options, callback) {
    let message, url
    url = this.fullPath()
    this.frame = window.open(url, 'afrostream_checkout_app', 'width=400,height=400,location=yes,resizable=yes,scrollbars=yes')
    if (this.frame == null) {
      alert('Disable your popup blocker to proceed with checkout.')
      url = 'support@afrostream.tv'
      throw new Error('To learn how to prevent the Stripe Checkout popup from being blocked, please call ' + url)
    }
    this.rpc = new FallbackRPC(this.frame, url)
    message = JSON.stringify(this.options)
    this.rpc.invokeTarget(message)
    return callback(true)
  }

  close () {
    let _ref
    return (_ref = this.frame) != null ? _ref.close() : void 0
  }

}
