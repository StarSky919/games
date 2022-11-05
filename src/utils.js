export const $ = id => document.getElementById(id);
export function noop() {}

const p0 = (num, length = 2) => num.toString().padStart(length, '0');
const millisecond = 1;
const second = 1000;
const minute = second * 60;
const hour = minute * 60;
const day = hour * 24;
const week = day * 7;
export const Time = {
  millisecond,
  second,
  minute,
  hour,
  day,
  week,
  template(template, timestamp) {
    const time = new Date(timestamp);
    return template
      .replace('yyyy', time.getFullYear().toString())
      .replace('yy', time.getFullYear().toString().slice(2))
      .replace('MM', p0(time.getMonth() + 1))
      .replace('dd', p0(time.getDate()))
      .replace('hh', p0(time.getHours()))
      .replace('mm', p0(time.getMinutes()))
      .replace('ss', p0(time.getSeconds()))
      .replace('SSS', p0(time.getMilliseconds(), 3));
  },
  formatTimeInterval(ms) {
    const abs = Math.abs(ms);
    if (abs >= day - hour / 2) {
      return Math.round(ms / day) + 'd';
    } else if (abs >= hour - minute / 2) {
      return Math.round(ms / hour) + 'h';
    } else if (abs >= minute - second / 2) {
      return Math.round(ms / minute) + 'm';
    } else if (abs >= second) {
      return Math.round(ms / second) + 's';
    }
    return ms + 'ms';
  },
  formatTime(s) {
    let min = Math.floor(s / 60);
    let sec = s % 60;
    return `${p0(min)} : ${p0(sec)}`;
  }
}

export function isNullish(value) {
  return value === void 0 || value === null;
}

export function random(min, max) {
  return () => Math.round(Math.random() * (max - min) + min);
}

export function randomize(arr) {
  const result = arr.slice(0);
  for (let i = 0; i < result.length; i++) {
    let random = parseInt(Math.random() * result.length);
    let temp = result[random];
    result[random] = result[i];
    result[i] = temp;
  }
  return result;
}

export function sleep(delay) {
  return new Promise(function(resolve) {
    setTimeout(resolve, delay);
  });
}

export function createElement({ tagName, id, classList, attr, style, cssText, text, html }) {
  const el = document.createElement(tagName);
  id && (el.id = id);
  classList && el.classList.add(...classList);
  attr && Object.keys(attr).forEach(name => el.setAttribute(name, attr[name]));
  style && Object.keys(style).forEach(name => el.style[name] = style[name]);
  cssText && (el.style.cssText += cssText);
  text && (el.innerText = text);
  html && (el.innerHTML = html);
  return el;
}

export function createLongClick(element, interval, callback) {
  return (() => {
    let longClickTimer;
    let isLongClicked = false;
    element.addEventListener('touchstart', event => {
      isLongClicked = false;
      longClickTimer = setTimeout(() => {
        clearTimeout(longClickTimer);
        longClickTimer = null;
        isLongClicked = true;
        callback.call(this, event);
      }, interval * Time.second);
    });
    element.addEventListener('touchend', event => {
      isLongClicked = false;
      if (longClickTimer) clearTimeout(longClickTimer);
    });
    return () => isLongClicked;
  })();
}

export function compile(node, data) {
  const pattern = /\{\{\s*(\S+)\s*\}\}/;
  if (node.nodeType === 3) {
    let result;
    while (result = pattern.exec(node.nodeValue)) {
      const key = result[1];
      const value = key.split('.').reduce((p, c) => p[c], data);
      node.nodeValue = node.nodeValue.replace(pattern, value);
    }
    return;
  }
  node.childNodes.forEach(node => compile(node, data));
}