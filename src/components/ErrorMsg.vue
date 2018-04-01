<template>
  <mt-popup v-model="errorFlag" :position="position" :modal='false' popup-transition="popup-fade"> {{errMsg}} </mt-popup>
</template>

<script>
export default {
  props: {
    errorFlag: {
      type: Boolean,
      default: false,
    },
    position: {
      type: String,
      default: 'top',
    },
    errMsg: {
      type: String,
      default: '成功',
    },
    duration: {
      type: Number,
      default: 2000,
    },
  },
  updated() {
    if (this.errorFlag) {
      setTimeout(() => {
        this.$emit('closeError');
      }, this.duration);
    }
  },
};
</script>

<style lang="scss" scoped>
.mint-popup{
  padding: .266667rem;
  box-sizing: border-box;
  width: 100%;
  text-align: center;
  font-size: .4rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.8);
  z-index: 3000;
}
</style>

