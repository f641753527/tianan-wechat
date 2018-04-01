<template>
  <div class='food'>
    <div class="avatar"><img :src="seller.logoIcon" /></div>
    <div class="right_detail">
      <p class="title">{{seller.corpName}}</p>
      <p class="attr">{{seller.description}}</p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    seller: {
      type: Object,
      default() {
        return {};
      },
    },
  }
};
</script>

<style lang="scss" scoped>
.food{
  margin-bottom: .32rem;
  display: flex;
  background: #fff;
  .avatar{
    flex: 0 0 2.853333rem;
    width: 2.853333rem;
    height: 2.133333rem;
    img{
      width: 100%;
      height: 100%;
      outline: none;
      border: none;
      vertical-align: top;
    }
  }

  .right_detail{
    padding-left: .37rem;
    flex: 1 1 auto;
    font-size: .32rem;
    line-height: .453333rem;
    color: rgb(102, 102, 102);
    .title{
      font-size: .4rem;
      font-weight: 700;
      line-height: .64rem;
    }
  }
}
</style>


