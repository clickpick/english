<template>
  <button
    type="button"
    class="tappable"
    @touchstart="$emit('tap', $event)"
    @click="$emit('click', $event)"
    @dragstart.prevent="_noop"
  >
    <slot />
  </button>
</template>

<script>
export default {
  name: 'Tappable',
  methods: {
    _noop() {
      return false;
    }
  }
};
</script>

<style lang="scss">
.tappable {
  transition-duration: 0.3s;
  transition-timing-function: cubic-bezier(0.36, 0.66, 0.04, 1);
  transition-property: transform, background-color, opacity;

  will-change: transform;
  backface-visibility: hidden;

  transform: scale(1);

  &:active {
    transform: scale(0.95);
  }
}
</style>
