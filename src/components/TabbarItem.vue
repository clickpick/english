<template functional>
  <button
    type="button"
    class="tabbar__item"
    :class="{ 'tabbar__item--selected': props.selected }"
    @click="listeners.click"
  >
    <div class="tabbar__item__in">
      <div class="tabbar__item__icon">
        <slot name="icon" />
      </div>
      <div class="tabbar__item__text">
        <slot />
      </div>
    </div>
  </button>
</template>

<script>
export default {
  name: 'TabbarItem',
  props: {
    selected: {
      type: Boolean,
      default: false
    }
  }
};
</script>

<style lang="scss">
.tabbar__item {
  flex-shrink: 0;
  max-width: 100%;
  flex-grow: 1;
  flex-basis: 0;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-content: center;
  align-items: center;

  color: #76787a;
  transition: color 0.3s ease;

  &--selected {
    color: #ffffff;
  }

  &__in {
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-self: center;
    align-items: center;
    justify-content: center;
  }

  &__icon {
    height: 28px;
    width: 28px;
  }

  &__text {
    font-size: 8pt;
    line-height: 12px;
    font-weight: 500;
    margin-top: 2px;
  }
}

html[theme="light"] {
  .tabbar__item {
    color: #b1b3b4;
  }

  .tabbar__item--selected {
    color: #212121;
  }
}
</style>
