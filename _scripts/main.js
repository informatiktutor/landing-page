const MAILTO_TIMEOUT = 2000;
const QR_SCROLL_DELAY = 150;

const messageSuggestions = [
  "Ich habe Schwierigkeiten bei ...",
  "Ich verstehe ... nicht",
  "Das Thema ... liegt mir nicht"
];

(function () {
  // Pick a random suggestion and put it into the message field.
  const messageInput = document.querySelector('#message');
  const selected = Math.floor(Math.random() * messageSuggestions.length);
  messageInput.value = messageSuggestions[selected];
})();

(function () {
  // Fixate the hero continuation height
  // so that it does not change when the height of the contact card changes
  // because elements are manipulated.
  const continuation = document.querySelector('.hero-continuation');
  continuation.style.height = continuation.clientHeight + 'px';
})();

const trigger_event = function (name) {
  if (is_development) {
    console.debug('event', name);
  }
  sa_event(name);
};

const trigger_event_once = (function () {
  const state = {};
  return function (name) {
    if (state.hasOwnProperty(name)) {
      return;
    }
    state[name] = true;
    trigger_event(name);
  }
})();

(function () {
  const messageInput = document.querySelector('#message');
  const sendLink = document.querySelector('#send-message');

  // Enable the input field if JavaScript is enabled.
  messageInput.removeAttribute('disabled');

  const [prefix, suffix] = sendLink.href.split('?');
  const params = queryParams(suffix);

  const splitAt = params.body.indexOf('.');
  const defaultMessage = decodeURIComponent(params.body.substring(0, splitAt + 1));
  const reuseBody = params.body.substring(splitAt + 1, params.body.length);

  function setMessage(message) {
    const newParams = shallowClone(params);
    newParams.body = encodeURIComponent(message) + reuseBody;
    sendLink.href = prefix + queryString(newParams);
  }

  register_event_once(messageInput, 'focus', 'email_input_focused');

  messageInput.addEventListener('input', e => {
    let message = messageInput.value;
    if (message.length === 0) {
      trigger_event_once('email_input_cleared');
      message = defaultMessage;
    }
    if (!message.endsWith('...')) {
      message = trimEnd(message, '.') + '.';
    }
    setMessage(message);
  });

  let timeout = null;

  const mailNotice = document.querySelector('#mail-notice');
  const noMailto = document.querySelector('#no-mailto');

  sendLink.addEventListener('click', e => {
    trigger_event('email_continue_clicked');
    sendLink.classList.add('is-loading');
    mailNotice.classList.remove('is-hidden');
    noMailto.classList.add('is-hidden');
    timeout = setTimeout(() => {
      timeout = null;
      mailNotice.classList.add('is-hidden');
      noMailto.classList.remove('is-hidden');
      sendLink.classList.remove('is-loading');
    }, MAILTO_TIMEOUT);
  });

  window.addEventListener('blur', e => {
    if (timeout !== null) {
      trigger_event('email_program_likely_opened');
      mailNotice.classList.remove('is-hidden');
      noMailto.classList.add('is-hidden');
    }
    clearTimeout(timeout);
    timeout = null;
    sendLink.classList.remove('is-loading');
  });
})();

(function () {
  const whatsappLink = document.querySelector('a.button.is-whatsapp');
  const whatsappQrLabel = document.querySelector('label[for=radio-whatsapp]');
  const signalLink = document.querySelector('a.button.is-signal');
  const signalQrLabel = document.querySelector('label[for=radio-signal]');

  register_event_once(whatsappLink, 'click', 'social_whatsapp_clicked');
  register_event_once(whatsappQrLabel, 'click', 'social_whatsapp_qr_opened');
  register_event_once(signalLink, 'click', 'social_signal_clicked');
  register_event_once(signalQrLabel, 'click', 'social_signal_qr_opened');
})();

function register_event(element, event, name, once) {
  element.addEventListener(event, e => {
    if (once) {
      trigger_event_once(name);
    } else {
      trigger_event(name);
    }
  });
}

function register_event_once(element, event, name) {
  register_event(element, event, name, true);
}

function queryParams(string) {
  const result = {};
  string = string.replace('?', '');
  for (const part of string.split('&')) {
    const [name, value] = part.split('=');
    result[name] = value;
  }
  return result
}

function queryString(params) {
  const parts = [];
  for (const name in params) {
    if (params.hasOwnProperty(name)) {
      parts.push(name + '=' + params[name]);
    }
  }
  return '?' + parts.join('&');
}

function shallowClone(object) {
  const clone = {};
  for (const key in object) {
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

(function () {
  const qrLabels = [
    ['whatsapp', document.querySelector('label[for=radio-whatsapp]')],
    ['signal', document.querySelector('label[for=radio-signal]')]
  ];
  for (const [platform, element] of qrLabels) {
    element.addEventListener('click', e => {
      setTimeout(function () {
        const element = document.querySelector('.qrcode.is-' + platform);
        const offset = (window.innerHeight - element.clientHeight) / 2;
        const position = elementPosition(element) - offset;
        window.scroll({
          top: position,
          behavior: 'smooth'
        });
      }, QR_SCROLL_DELAY);
    });
  }
})();

function elementPosition(element) {
  if (!element.offsetParent) {
    return;
  }
  let top = 0;
  do {
      top += element.offsetTop;
  }
  while (element = element.offsetParent);
  return top;
}

(function () {
  const links = ['github', 'source', 'imprint', 'privacy'];
  for (const name of links) {
    const element = document.querySelector('#link-' + name);
    register_event_once(element, 'click', 'footer_' + name + '_clicked');
  }
})();
