export { default as parse } from 'date-fns/parseISO';

export const getUTCOffset = () => (new Date()).getTimezoneOffset() * -1;

const cases = [2, 0, 1, 1, 1, 2];
export const setOfNumber = (number, titles) => {
  return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
};

export const day = 86400000;
export const hour = 3600000;
export const minute = 60000;
export const setHour = ['час', 'часа', 'часов'];
export const setMinute = ['минуту', 'минуты', 'минут'];
export const getRelative = (to) => {
  const ml = to - new Date();
  const d = Math.floor(ml / day);
  const h = Math.floor(ml / hour);
  const m = Math.floor(ml / minute);
  return { d, h, m, ml };
};
export const getRelativeString = ({ d = 0, h = 0, m = 0 }) => {
  if (d > 0) {
    return 'завтра';
  }
  if (h > 0) {
    return `через ${h} ${setOfNumber(h, setHour)}`;
  }
  if (m > 0) {
    return `через ${m} ${setOfNumber(m, setMinute)}`;
  }
  return 'скоро';
};

