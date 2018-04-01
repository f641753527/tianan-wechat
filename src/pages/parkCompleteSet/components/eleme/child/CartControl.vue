<template>
  <div class="cartcontrol">
    <transition name="cart">
      <i class="cart-decrease iconfont icon-CombinedShape" v-show='food.count > 0' @click.stop="cartDecrease"></i>
    </transition>
    <transition name="count">
      <div class="count" v-show='food.count > 0'>{{food.count}}</div>
    </transition>
    
    <i class="cart-add iconfont icon-jiagouwuche" @click.stop="addCart"></i>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import deepcopy from '@/utils/deepcopy';

export default {
  props: {
    food: {
      type: Object,
    },
    from: {
      type: String,
    },
  },
  methods: {
    ...mapMutations(['change_cartList']),
    addCart (ev) {
      // 设置购物车商品id和数量

      const list = this.cartList;
      const curFoodIndex = list.findIndex((item) => {
        return item.foodId === this.food.foodId;
      });
      if (curFoodIndex === -1) {
        const food = deepcopy(this.food);
        food.count = 1;
        list.push(food);
      } else {
        list[curFoodIndex].count++;
      }

      // 更新本地存储
      this.change_cartList(list);

      // 同步商品数量
      const num = curFoodIndex === -1 ? 1 : list[curFoodIndex].count;
      this.$root.eventHub.$emit('updateFood', this.food.foodId, num);

      this.$root.eventHub.$emit('cartToCart', ev.target);
    },
    cartDecrease (ev) {
      const list = this.cartList;
      const curFoodIndex = list.findIndex((item) => {
        return item.foodId === this.food.foodId;
      });
      if (curFoodIndex === -1) {
        return;
      }
      list[curFoodIndex].count--;

      // 同步购物车数量
      const num = list[curFoodIndex].count;
      this.$root.eventHub.$emit('updateFood', this.food.foodId, num);

      if (num === 0) {
        list.splice(curFoodIndex, 1);
      }

      // 更新本地存储
      this.change_cartList(list);
    }
  },
  computed: {
    ...mapGetters(['cartList']),
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.cartcontrol{
  font-size: 0;
  .cart-decrease, .cart-add{
    display: inline-block;
    vertical-align: top;
    padding: .08rem;
    font-size: .533333rem;
    line-height: .533333rem;
    color: $color-main;
  }
  .count{
    display: inline-block;
    vertical-align: top;
    padding: .08rem 0;
    width: .533333rem;
    text-align: center;
    font-size: .293333rem;
    line-height: .533333rem;
    color: rgb(147, 153, 159);
  }
  .cart-enter-active, .cart-leave-active, .count-enter-active, .count-leave-active{
    transition: all .5s linear;
  }
  .count-enter, .count-leave-to, .cart-enter, .cart-leave-to{
    opacity: 0;
  }
  .cart-leave-to, .cart-enter{
    transform: translate3D(36px, 0, 0) rotate(180deg);
  }
}
  
</style>