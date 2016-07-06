import helpers from './helpers'

class FallbackRPC {

  constructor (target, host) {
    this.target = target
    this.host = host
  }

  invokeTarget (message) {
    let url
    message = +new Date + cacheBust++ + '&' + encodeURIComponent(message)
    url = this.host + ''
    return this.target.location = url.replace(/#.*$/, '') + '#' + message
  }

  receiveMessage (callback, delay) {
    if (delay == null) {
      delay = 100
    }
    interval && clearInterval(interval)
    return interval = setInterval(() => {
      let hash = decodeURIComponent(window.location.hash)
      if (hash !== lastHash && re.test(hash)) {
        window.location.hash = ''
        lastHash = hash
        return callback({
          data: hash.replace(re, '')
        })
      }
    }, delay)
  }
}

export default FallbackRPC
