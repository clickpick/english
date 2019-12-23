<template>
  <div class="async">
    <template v-if="pending">
      <slot v-if="$slots['pending']" name="pending" />
      <span v-else>Загрузка</span>
    </template>
    <template v-else-if="rejected">
      <slot v-if="$scopedSlots['catch']" name="catch" :error="error" />
      <slot v-else-if="$slots['catch']" name="catch" />
      <span v-else>Ошибка</span>
    </template>
    <template v-else>
      <slot v-if="$scopedSlots['then']" name="then" :result="result" />
      <slot v-else-if="$slots['then']" name="then" />
      <span v-else>Успешно</span>
    </template>
  </div>
</template>

<script>
export default {
  name: 'AsyncComponent',
  props: {
    promise: {
      required: true
    },
    trigger: {
      default: 0
    }
  },
  created() {
    this.execute();
  },
  data() {
    return {
      pending: false,
      rejected: false,
      error: null,
      result: null
    };
  },
  methods: {
    execute() {
      this.pending = true;
      this.rejected = false;
      this.error = null;
      this.result = null;
      this.promise.then((result) => {
        this.result = result;
        this.pending = false;
        if (this._isMounted) {
          this.$nextTick(() => {
            this.$emit('load');
          });
        } else {
          this.$once('hook:mounted', () => {
            this.$nextTick(() => {
              this.$emit('load');
            });
          });
        }
      }).catch((error) => {
        this.rejected = true;
        this.error = error;
        this.pending = false;
        if (this._isMounted) {
          this.$nextTick(() => {
            this.$emit('error');
          });
        } else {
          this.$once('hook:mounted', () => {
            this.$nextTick(() => {
              this.$emit('error');
            });
          });
        }
      });
    }
  },
  watch: {
    promise() {
      this.execute();
    },
    refresh() {
      this.execute();
    }
  }
};
</script>
