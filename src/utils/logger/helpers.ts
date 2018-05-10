const replacer = (cache = []) => (key, value) => {
  if (typeof value === 'object' && value !== null) {
    if (cache.indexOf(value) !== -1) {
      return '[Circular]';
    }
    cache.push(value);
  }

  return value;
};

export const stringify = (data) => {
  if (typeof data === 'string') {
    return data;
  }
  if (data instanceof Error) {
    return JSON.stringify(data, Object.getOwnPropertyNames(data));
  }

  return JSON.stringify(data, replacer());
};

/* eslint-disable no-magic-numbers */
const styles = {
    // styles
  bold: [1, 22],
  italic: [3, 23],
  underline: [4, 24],
  inverse: [7, 27],
    // grayscale
  white: [37, 39],
  grey: [90, 39],
  black: [90, 39],
    // colors
  blue: [34, 39],
  cyan: [36, 39],
  green: [32, 39],
  magenta: [35, 39],
  red: [31, 39],
  yellow: [33, 39],
};
/* eslint-enable no-magic-numbers */

const colorizeStart = style => (style ? `\x1B[${styles[style][0]}m` : '');
const colorizeEnd = style => (style ? `\x1B[${styles[style][1]}m` : '');

export const colorize = (str, style) =>
    colorizeStart(style) + str + colorizeEnd(style);

export const time = date =>
    date
        .toString()
        .split(' ')
        .splice(4) // eslint-disable-line no-magic-numbers
        .slice(0, -2) // eslint-disable-line no-magic-numbers
        .join(' ');
