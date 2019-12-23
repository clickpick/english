export let speaking = false;
export let callback = null;

export const speak = async (model) => {
  return new Promise((resolve, reject) => {
    if (speaking && callback) {
      speaking = false;
      callback();
    }

    if (!model.audio_link) {
      reject();
      return;
    }

    const audio = new Audio(model.audio_link);

    audio.onabort = audio.onerror = (e) => {
      reject(e);
    };
    audio.onended = audio.oncancel = () => {
      resolve();
    };

    speaking = true;
    callback = () => {
      audio.pause();
      audio.currentTime = 0;
      resolve();
    };

    audio.play();
  });
};
