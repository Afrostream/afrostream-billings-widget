import helpers from './helpers'
import utils from './utils'

class Button {

  constructor (view, options) {
    this.view = view
    this.options = options
    this.$el = document.createElement('button')
    this.$el.setAttribute('role', 'button')
    this.$el.className = 'stripe-button-el'
    helpers.bind(this.$el, 'click', this.submit.bind(this))
    helpers.bind(this.$el, 'touchstart', function () {
    });

    let element = utils.$$('stripe-button');
    element = function () {
      let _i, _len, _results, el
      _results = []
      for (_i = 0, _len = element.length; _i < _len; _i++) {
        el = element[_i]
        if (!utils.hasClass(el, 'active')) {
          _results.push(el)
        }
      }
      return _results
    }()

    element = element[element.length - 1];
    if (!element) {
      return
    }
    utils.addClass(element, 'active')
    this.scriptEl = element
    this.document = this.scriptEl.ownerDocument
    this.render()
    this.append()
  }

  render () {
    console.log('render button')
    this.$el.innerHTML = ''
    this.$span = document.createElement('span')
    utils.text(this.$span, this.options.label)
    if (!this.nostyle) {
      this.$el.style.visibility = 'hidden'
      this.$span.style.display = 'block'
      this.$span.style.minHeight = '30px'
    }
    this.$style = document.createElement('link')
    this.$style.setAttribute('type', 'text/css')
    this.$style.setAttribute('rel', 'stylesheet')
    this.$style.setAttribute('href', this.view.getHost() + 'src/css/checkout.css')
    return utils.append(this.$el, this.$span)
  }

  disable () {
    return this.$el.setAttribute('disabled', true)
  }

  enable () {
    return this.$el.removeAttribute('disabled')
  }

  isDisabled () {
    return utils.hasAttr(this.$el, 'disabled')
  }

  submit (e) {
    if (typeof e.preventDefault === 'function') {
      e.preventDefault()
    }
    if (!this.isDisabled()) {
      this.open()
    }
    return false
  }

  open () {
    return this.view.open(this.options)
  }

  append () {
    let head
    if (this.scriptEl) {
      utils.insertAfter(this.scriptEl, this.$el)
    }
    if (!this.nostyle) {
      head = this.parentHead()
      if (head) {
        utils.append(head, this.$style)
      }
    }
    if (this.$form = this.parentForm()) {
      helpers.unbind(this.$form, 'submit', this.submit);
      helpers.bind(this.$form, 'submit', this.submit)
    }
    if (!this.nostyle) {
      setTimeout(()=> {
        return this.$el.style.visibility = 'visible'
      }, 1e3)
    }
    this.view.setHost(helpers.host(this.scriptEl.src))
    //return this.view = this.view.configure(this.options, {
    //  form: this.$form
    //})
    this.view.configure(this.options, {
      form: this.$form
    })
  }

  parentForm () {
    let el, elements, _i, _len, _ref1
    elements = utils.parents(this.$el)
    for (_i = 0, _len = elements.length; _i < _len; _i++) {
      el = elements[_i]
      if (((_ref1 = el.tagName) != null ? _ref1.toLowerCase() : void 0) === 'form') {
        return el
      }
    }
    return null
  }

  parentHead () {
    let _ref1, _ref2
    return ((_ref1 = this.document) != null ? _ref1.head : void 0) || ((_ref2 = this.document) != null ? _ref2.getElementsByTagName('head')[0] : void 0) || this.document.body
  }
}

export
default
Button
