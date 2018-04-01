<template>
  <div class="seller">

    <navigator :title="title"></navigator>


    <div class='list' v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="300">
      <Food v-for="(food, index) in foodList" :key="index" :food='food' :showHeader='false'></Food>
    </div>

    <div class='cart_wrap'>
      <Cart></Cart>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import Food from './child/FoodItem';
import Cart from './child/Cart';

export default {
  data() {
    return {
      foodList: [],
      sellerId: '',
      pageInfo: {
        currPage: 1,
        pageRows: 10,
      },
      total: 0,
      disabled: false,
    };
  },

  methods: {
    ...mapMutations(['change_cartList']),

    loadMore() {
      if (this.foodList.length === this.total) {
        return;
      }
      this.disabled = true;
      this.pageInfo.currPage++;
      this.getFoodList();
    },

    getFoodList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/food/info/list`, {
        parkId: this.parkIdList[0],
        ...this.pageInfo,
        corpId: this.sellerId,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.total = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
          const tempArr = res.resData.pageList ? res.resData.pageList : [];
          this.foodList = this.foodList.concat(tempArr);
          this.disabled = false;
          // 初始化数据
          this.initList(tempArr);
          // 同步购物车商品
          this.dealCart(tempArr);
        }
      });
    },

    initList(list) {
      list.forEach((food, index) => {
        this.$set(food, 'count', 0);
      });
    },

    initCart() {
      const newList = this.cartList.filter((food) => {
        return food.count > 0;
      });
      this.change_cartList(newList);
    },

    dealCart(list) {
      list.forEach((food) => {
        this.cartList.forEach((item) => {
          if (item.foodId === food.foodId) {
            food.count = item.count;
            return;
          }
        });
      });
    },
  },

  computed: {
    ...mapGetters(['parkIdList', 'cartList']),
    title() {
      return this.foodList.length ? this.foodList[0].corpName : '';
    },
  },

  components: { Food, Cart },

  created() {
    this.sellerId = this.$route.params.id;
    this.initCart();
    this.getFoodList();
  },
};
</script>

<style lang="scss" scoped>
.seller{
  padding-bottom: 1.2rem;
  background: rgb(245, 245, 245);
  .list{
    padding: .266667rem;
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


