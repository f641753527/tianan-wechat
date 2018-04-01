<template>
  <div class="Bbs">
    <navigator title="信息交互平台"></navigator>

    <Tabbar @navActive="getActive" :serviceId="1008"></Tabbar>

    <NeedBuyList v-if='active === 8'></NeedBuyList>

    <p v-if="active === 15">内容即将上线，敬请期待!</p>
    
  </div>
</template>

<script>
import NeedBuyList from './components/NeedBuyList';
import Tabbar from '@/components/Tabbar';
// import ServiceList from './components/ServiceList';

export default {
  data() {
    return {
      active: 0,
    };
  },
  methods: {
    getActive(index) {
      this.active = index;
    },
  },
  components: {
    NeedBuyList, Tabbar
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss';
.Bbs{
  background: rgb(245, 245, 245);
}
.van-tabbar{
  position: relative;
  height: 2.986667rem;
  padding: .533333rem .533333rem 0 .533333rem;
  box-sizing: border-box;
  .van-tabbar-item{
    .van-tabbar-item__icon .icon_wrap{
      width: 1.333333rem;
      height: 1.333333rem;
      border-radius: 50%;
      border: .026667rem solid rgb(241, 241, 241);
      text-align: center;
      line-height: 1.333333rem;
      .iconfont{
        font-size: .666667rem;
        color: $color-main;
      }
    }
    .van-tabbar-item__text .text_wrap{
      text-align: center;
      .text{
        line-height: .88rem;
        font-size: .32rem;
        color: rgb(51, 51, 51);
        font-weight: 600;
      }
      .active_icon{
        display: inline-block;
        border-bottom: .266667rem solid rgb(245, 245, 245);
        border-left: .266667rem solid transparent;
        border-right: .266667rem solid transparent;
      }
      .hidden_icon{
        display: inline-block;
        height: .266667rem;
      }
    }
  }
}
.van-hairline--top-bottom::after {
    border-width: 0;
}
</style>
