import Core from '@glidejs/glide/src/index';

import Run from '@glidejs/glide/src/components/run';
import Gaps from '@glidejs/glide/src/components/gaps';
import Html from '@glidejs/glide/src/components/html';
import Peek from '@glidejs/glide/src/components/peek';
import Move from '@glidejs/glide/src/components/move';
import Sizes from '@glidejs/glide/src/components/sizes';
import Build from '@glidejs/glide/src/components/build';
import Clones from '@glidejs/glide/src/components/clones';
import Resize from '@glidejs/glide/src/components/resize';
import Direction from '@glidejs/glide/src/components/direction';
import Translate from '@glidejs/glide/src/components/translate';
import Transition from '@glidejs/glide/src/components/transition';
import Swipe from '@glidejs/glide/src/components/swipe';

const COMPONENTS = {
  Html,
  Translate,
  Transition,
  Direction,
  Peek,
  Sizes,
  Gaps,
  Move,
  Clones,
  Resize,
  Build,
  Run,
  Swipe
};

class EnhancedGlide extends Core {
  constructor(selector, options = {}) {
    super(selector, options);

    if (this.settings.debug) {
      // eslint-disable-next-line
      const log = (name) => [name, (params) => console.log(name, params)];
      const events = [
        'resize',
        'mount.before',
        'mount.after',
        'update',
        'play',
        'pause',
        'build.before',
        'build.after',
        'run.before',
        'run',
        'run.after',
        'run.offset',
        'run.start',
        'run.end',
        'move',
        'move.after',
        'resize',
        'swipe.start',
        'swipe.move',
        'swipe.end',
        'translate.jump'
      ];
      for (let i = events.length; i--;) {
        this.on(...log(events[i]));
      }
    }
  }

  mount(extensions = {}) {
    return super.mount({ ...COMPONENTS, ...extensions });
  }
}

export default EnhancedGlide;
