export const readyDOM = (fn) => {
  if (document.readyState != 'loading') {
    fn();
  } else {
    document.addEventListener('DOMContentLoaded', fn);
  }
};

export const readyRender = (fn) => {
  if (document.readyState === 'complete') {
    fn();
  } else {
    window.addEventListener('load', fn);
  }
};

export const prevent = (e = window.event) => {
  if (e.cancelable) {
    if (e.preventDefault && !e.defaultPrevented) {
      e.preventDefault();
    }
  } else {
    e.returnValue = false;
  }

  if (e.stopPropagation) {
    e.stopPropagation();
  }

  return false;
};
