<template>
  <div class='wrapper'>
    <navigator class='header' title="提示"></navigator>

    <div class='body'>
      <h1 class='tipTitle'>该用户已经注册</h1>

      <div class='foot_bottom'>
        <van-button text='关闭' @click.native='back' block />
      </div>
    </div>

  </div>
</template>

<script>
export default {
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>


<style lang="scss" scoped>
.wrapper{
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  .body{
    .tipTitle{
      margin-top: 2.346667rem;
      margin-bottom: 2.666667rem;
      font-weight: 600;
      font-size: .453333rem;
      color: rgb(51, 51, 51);
      text-align: center;
    }

    .foot_bottom{
      padding: 0 .8rem;
      .van-button{
        border-radius: .666667rem;
        background: #d0011b;
        color: #fff;
        font-size: .48rem;
      }
    }
  }
}
</style>
