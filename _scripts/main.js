const MAILTO_TIMEOUT = 2000;

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

  messageInput.addEventListener('input', e => {
    let message = messageInput.value;
    if (message.length === 0) {
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
      mailNotice.classList.remove('is-hidden');
      noMailto.classList.add('is-hidden');
    }
    clearTimeout(timeout);
    timeout = null;
    sendLink.classList.remove('is-loading');
  });
})();

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
