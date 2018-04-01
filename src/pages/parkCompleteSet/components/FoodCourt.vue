<template>
  <div class="FoodCourt">

    <div class='food_or_seller'>
      <div>&nbsp;</div>
      <div :class='{ "active": active === options[0].key }' @click='changeActive(options[0].key)'>{{options[0].label}}</div>
      <div>&nbsp;</div>
      <div :class='{ "active": active === options[1].key }'  @click='changeActive(options[1].key)'>{{options[1].label}}</div>
      <div>&nbsp;</div>
    </div>

    <FoodList v-if='active === 0'></FoodList>
    <SellerList v-if='active === 1'></SellerList>



    <div class='cart_wrap'>
      <Cart></Cart>
    </div>

  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { Indicator } from 'mint-ui';
import FoodList from './eleme/FoodList';
import SellerList from './eleme/SellerList';
import Cart from './eleme/child/Cart';

export default {
  data() {
    return {
      active: 0,
      options: [
        { key: 0, label: '商品' },
        { key: 1, label: '店铺' },
      ],
    };
  },

  methods: {
    changeActive(key) {
      this.active = key;
    },
  },
  components: { FoodList, SellerList, Cart },

  computed: {
    ...mapGetters(['track']),
  },

  created() {
    if (this.track) {
      this.active = this.track.activeInner;
    }
  },
}
</script>
<style lang="scss" scoped>
@import '~@scss';
.FoodCourt{
  background: rgb(245, 245, 245);
  .food_or_seller{
    display: flex;
    height: 1.146667rem;
    line-height: 1.146667rem;
    border-bottom: .013333rem solid rgb(222, 222, 222);
    div{
      flex: 1 1 auto;
      text-align: center;
      &.active{
        border-bottom: .053333rem solid $color-main;
      }
    }
  }
  .cart_wrap{
    position: fixed;
    left: 0;
    bottom: 0;
    height: 1.2rem;
    width: 100%;
  }
}
</style>
