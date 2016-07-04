import helpers from './helpers'

class RPC {

  constructor (target, options) {
    if (options == null) {
      options = {}
    }

    this.rpcID = 0
    this.target = target
    this.callbacks = {}
    this.readyQueue = []
    this.readyStatus = false
    this.methods = {}
    helpers.bind(window, 'message', this.message.bind(this))
  }

  startSession () {
    this.sendMessage('frameReady')
    return this.frameReady()
  }

  invoke () {
    const __slice = [].slice
    let self = this
    let args, method
    method = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : []
    return this.ready(() => {
      return self.sendMessage(method, args)
    })
  }

  message (e) {
    let shouldProcess = false
    try {
      shouldProcess = e.source === this.target
    } catch (_error) {
      console.log(_error)
    }

    if (shouldProcess) {
      return this.processMessage(e.data)
    }
  }

  ready (fn) {
    if (this.readyStatus) {
      return fn()
    } else {
      return this.readyQueue.push(fn)
    }
  }

  frameCallback (id, result) {
    delete this.callbacks[id]
    return true
  }

  frameReady () {
    var callbacks, cb, _i, _len
    this.readyStatus = true
    callbacks = this.readyQueue.slice(0)
    for (_i = 0, _len = callbacks.length; _i < _len; _i++) {
      cb = callbacks[_i]
      cb()
    }
    return false
  }

  isAlive () {
    return true
  }

  sendMessage (method, args) {
    var err, id, message, _ref
    if (args == null) {
      args = []
    }
    id = ++this.rpcID
    if (typeof args[args.length - 1] === 'function') {
      this.callbacks[id] = args.pop()
    }
    message = JSON.stringify({
      method: method,
      args: args,
      id: id
    })
    if (((_ref = this.target) != null ? _ref.postMessage : void 0) == null) {
      err = new Error('Unable to communicate with Checkout. Please contact support@stripe.com if the problem persists.')
      if (this.methods.rpcError != null) {
        this.methods.rpcError(err)
      } else {
        throw err
      }
      return
    }
    this.target.postMessage(message, '*')
  }

  processMessage (data) {
    var method, result, _base, _name
    try {
      data = JSON.parse(data)
    } catch (_error) {
      return
    }
    if (['frameReady', 'frameCallback', 'isAlive'].indexOf(data.method) !== -1) {
      result = null
      method = this[data.method]
      if (method != null) {
        result = method.apply(this, data.args)
      }
    } else {
      result = typeof(_base = this.methods)[_name = data.method] === 'function' ? _base[_name].apply(_base, data.args) : void 0
    }
    if (data.method !== 'frameCallback') {
      return this.invoke('frameCallback', data.id, result)
    }
  }

}

window.RPC = RPC

export default RPC
