const __indexOf = [].indexOf || function (item) {
    for (var i = 0, l = this.length; i < l; i++) {
      if (i in this && this[i] === item) return i
    }
    return -1
  }

const $ = function (sel) {
  return document.querySelectorAll(sel)
}

const $$ = function (cls) {
  var el, reg, _i, _len, _ref, _results
  if (typeof document.getElementsByClassName === 'function') {
    return document.getElementsByClassName(cls)
  } else if (typeof document.querySelectorAll === 'function') {
    return document.querySelectorAll('.' + cls)
  } else {
    reg = new RegExp('(^|\\s)' + cls + '(\\s|$)')
    _ref = document.getElementsByTagName('*')
    _results = []
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      el = _ref[_i]
      if (reg.test(el.className)) {
        _results.push(el)
      }
    }
    return _results
  }
}

const hasAttr = function (element, attr) {
  var node
  if (typeof element.hasAttribute === 'function') {
    return element.hasAttribute(attr)
  } else {
    node = element.getAttributeNode(attr)
    return !!(node && (node.specified || node.nodeValue))
  }
}

const trigger = function (element, name, data, bubble) {
  if (data == null) {
    data = {}
  }
  if (bubble == null) {
    bubble = true
  }
  if (window.jQuery) {
    return jQuery(element).trigger(name, data)
  }
}

const addClass = function (element, name) {
  return element.className += ' ' + name
}

const hasClass = function (element, name) {
  return __indexOf.call(element.className.split(' '), name) >= 0
}

const css = function (element, css) {
  return element.style.cssText += '' + css
}

const insertBefore = function (element, child) {
  return element.parentNode.insertBefore(child, element)
}

const insertAfter = function (element, child) {
  return element.parentNode.insertBefore(child, element.nextSibling)
}

const append = function (element, child) {
  return element.appendChild(child)
}

const remove = function (element) {
  var _ref
  return (_ref = element.parentNode) != null ? _ref.removeChild(element) : void 0
}

const parents = function (node) {
  var ancestors
  ancestors = []
  while ((node = node.parentNode) && node !== document && __indexOf.call(ancestors, node) < 0) {
    ancestors.push(node)
  }
  return ancestors
}

const resolve = function (url) {
  var parser
  parser = document.createElement('a')
  parser.href = url
  return '' + parser.href
}

const text = function (element, value) {
  if ('innerText' in element) {
    element.innerText = value
  } else {
    element.textContent = value
  }
  return value
}

export default {
  $: $,
  $$: $$,
  hasAttr: hasAttr,
  trigger: trigger,
  addClass: addClass,
  hasClass: hasClass,
  css: css,
  insertBefore: insertBefore,
  insertAfter: insertAfter,
  append: append,
  remove: remove,
  parents: parents,
  resolve: resolve,
  text: text
}
