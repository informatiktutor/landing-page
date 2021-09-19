"use strict";

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e2) { throw _e2; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e3) { didErr = true; err = _e3; }, f: function f() { try { if (!normalCompletion && it.return != null) it.return(); } finally { if (didErr) throw err; } } }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _iterableToArrayLimit(arr, i) { var _i = arr == null ? null : typeof Symbol !== "undefined" && arr[Symbol.iterator] || arr["@@iterator"]; if (_i == null) return; var _arr = []; var _n = true; var _d = false; var _s, _e; try { for (_i = _i.call(arr); !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var MAILTO_TIMEOUT = 2000;
var messageSuggestions = ["Ich habe Schwierigkeiten bei ...", "Ich verstehe ... nicht", "Das Thema ... liegt mir nicht"];

(function () {
  // Pick a random suggestion and put it into the message field.
  var messageInput = document.querySelector('#message');
  var selected = Math.floor(Math.random() * messageSuggestions.length);
  messageInput.value = messageSuggestions[selected];
})();

(function () {
  // Fixate the hero continuation height
  // so that it does not change when the height of the contact card changes
  // because elements are manipulated.
  var continuation = document.querySelector('.hero-continuation');
  continuation.style.height = continuation.clientHeight + 'px';
})();

(function () {
  var messageInput = document.querySelector('#message');
  var sendLink = document.querySelector('#send-message'); // Enable the input field if JavaScript is enabled.

  messageInput.removeAttribute('disabled');

  var _sendLink$href$split = sendLink.href.split('?'),
      _sendLink$href$split2 = _slicedToArray(_sendLink$href$split, 2),
      prefix = _sendLink$href$split2[0],
      suffix = _sendLink$href$split2[1];

  var params = queryParams(suffix);
  var splitAt = params.body.indexOf('.');
  var defaultMessage = decodeURIComponent(params.body.substring(0, splitAt + 1));
  var reuseBody = params.body.substring(splitAt + 1, params.body.length);

  function setMessage(message) {
    var newParams = shallowClone(params);
    newParams.body = encodeURIComponent(message) + reuseBody;
    sendLink.href = prefix + queryString(newParams);
  }

  messageInput.addEventListener('input', function (e) {
    var message = messageInput.value;

    if (message.length === 0) {
      message = defaultMessage;
    }

    if (!message.endsWith('...')) {
      message = trimEnd(message, '.') + '.';
    }

    setMessage(message);
  });
  var timeout = null;
  var mailNotice = document.querySelector('#mail-notice');
  var noMailto = document.querySelector('#no-mailto');
  sendLink.addEventListener('click', function (e) {
    sendLink.classList.add('is-loading');
    mailNotice.classList.remove('is-hidden');
    noMailto.classList.add('is-hidden');
    timeout = setTimeout(function () {
      timeout = null;
      mailNotice.classList.add('is-hidden');
      noMailto.classList.remove('is-hidden');
      sendLink.classList.remove('is-loading');
    }, MAILTO_TIMEOUT);
  });
  window.addEventListener('blur', function (e) {
    if (timeout !== null) {
      mailNotice.classList.remove('is-hidden');
      noMailto.classList.add('is-hidden');
    }

    clearTimeout(timeout);
    timeout = null;
    sendLink.classList.remove('is-loading');
  });
})();

function queryParams(string) {
  var result = {};
  string = string.replace('?', '');

  var _iterator = _createForOfIteratorHelper(string.split('&')),
      _step;

  try {
    for (_iterator.s(); !(_step = _iterator.n()).done;) {
      var part = _step.value;

      var _part$split = part.split('='),
          _part$split2 = _slicedToArray(_part$split, 2),
          name = _part$split2[0],
          value = _part$split2[1];

      result[name] = value;
    }
  } catch (err) {
    _iterator.e(err);
  } finally {
    _iterator.f();
  }

  return result;
}

function queryString(params) {
  var parts = [];

  for (var name in params) {
    if (params.hasOwnProperty(name)) {
      parts.push(name + '=' + params[name]);
    }
  }

  return '?' + parts.join('&');
}

function shallowClone(object) {
  var clone = {};

  for (var key in object) {
    if (object.hasOwnProperty(key)) {
      clone[key] = object[key];
    }
  }

  return clone;
}

function trimEnd(string, char) {
  while (string.length > 0 && string.endsWith(char)) {
    string = string.substring(0, string.length - 1);
  }

  return string;
}