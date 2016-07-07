export default class view {
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

  fullPath () {
    return this.host + this.path + (this.options && this.options.key ? '?key=' + this.options.key : '') + (this.options && this.options.coupon ? '?coupon=' + this.options.coupon : '')
  }

  open (options, callback) {

  }

  configure () {

  }
}
