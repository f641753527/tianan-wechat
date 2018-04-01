<template>
  <div class='food'>
    <p class="header" v-show='showHeader'>
      <img :src="food.logoIcon">
      <span>{{food.corpName}}</span>
    </p>
    <div class="detail">
      <div class="avatar"><img :src="food.picUrl" /></div>
      <div class="right_detail">
        <p class="title">{{food.title}}</p>
        <p class="attr">{{food.attrNorm}}</p>
        <p class="discountPrice">园区专享价：{{food.discountPrice/100 | PriceFilter}} 元</p>
        <p class="originalPrice">原价：{{food.originalPrice/100 | PriceFilter}} 元</p>
        <div class="cartcontrolwrapper">
          <Cartcontrol :food="food"></Cartcontrol>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cartcontrol from './CartControl';
import { mapGetters, mapMutations } from 'vuex';

export default {
  props: {
    food: {
      type: Object,
      default() {
        return {};
      },
    },
    showHeader: {
      type: Boolean,
      default: true,
    },
  },
  methods: {
    ...mapMutations(['change_cartList']),
  },
  computed: {
    ...mapGetters(['cartList']),
  },
  components: { Cartcontrol },
  mounted() {
    this.$root.eventHub.$on('updateFood', (foodId, num) => {
      if (this.food.foodId === foodId) {
        this.food.count = num;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
.food{
  margin-bottom: .32rem;
  .header{
    margin-bottom: .026667rem;
    padding: 0 .266667rem;
    height: 1.146667rem;
    line-height: 1.146667rem;
    background: #fff;
    img{
      margin-right: .213333rem;
      display: inline-block;
      vertical-align: middle;
      width: .8rem;
      height: .8rem;
      border-radius: 50%;
      border: none;
      outline: none;
    }
    span{
      display: inline-block;
      vertical-align: middle;
      line-height: .64rem;
      font-size: .453333rem;
      color: rgb(51, 51, 51);
      font-weight: 500;
    }
  }

  .detail{
    padding: .266667rem;
    background: #fff;
    display: flex;
    border-radius: .133333rem;
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
      position: relative;
      padding-left: .24rem;
      flex: 1 1 auto;
      font-size: .32rem;
      color: rgb(102, 102, 102);
      .title{
        font-size: .4rem;
        color: rgb(51, 51, 51);
        font-weight: 500;
        line-height: .586667rem;
      }
      .attr{
        line-height: .48rem;
      }
      .discountPrice{
        font-weight: 500;
        font-size: .346667rem;
        color: rgb(217, 38, 44);
        line-height: .586667rem;
      }
      .cartcontrolwrapper{
        position: absolute;
        right: .293333rem;
        bottom: 0;
      }
    }
  }
}
</style>


