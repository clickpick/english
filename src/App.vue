<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
};
</script>

<style lang="scss">
.caption {
  &-small {
    font-size: 14pt;
    text-transform: lowercase;
    font-variant: small-caps;
    font-weight: 300;
    margin-bottom: 4px;
  }

  &-big {
    font-size: 36pt;

    @media (max-width: 340px) {
      letter-spacing: -1px;
      font-size: 30pt;
    }
  }
}
</style>
