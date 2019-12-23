export const isWindows = () => {
  if (navigator.platform) {
    return String(navigator.platform).toLowerCase().startsWith('win');
  } else {
    return String(navigator.userAgent).toLowerCase().includes('win');
  }
};
