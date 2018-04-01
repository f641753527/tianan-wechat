<template>
  <div class='wrap'>
    <div class='search'>
      <van-search class='keyword' placeholder="请输入商品名称" v-model="condition.title"  @keyup='titleFilter'
        :style="{ 'background-color': 'rgb(245, 245, 245)' }"/>
      <div class='filter' @click='showType'>
         <span>筛选</span>
         <i class='iconfont icon-shaixuan'></i>
      </div>
    </div>

    <div class='list' v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="100">
      <Food v-for="(food, index) in foodList" :key="index" :food='food'></Food>
    </div>

    <van-popup class='type_wrap' v-model="typeFlag">
      <ul class='type_list'>
        <li :class='{ "active": condition.categoryId === "" }' @click='typeFilter("")'>全部</li>
        <li v-for='(typeItem, index) in typeList' :key="index" @click='typeFilter(typeItem.id)'
            :class='{ "active": condition.categoryId === typeItem.id }'>{{typeItem.name}}</li>
      </ul>
    </van-popup>

  </div>
</template>

<script>
import Food from './child/FoodItem';
import { mapGetters, mapMutations } from 'vuex';
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    return {

      typeFlag: false,

      foodList: [],
      typeList: [],

      condition: {
        title: '',
        categoryId: '', // 分类ID
      },
      pageInfo: {
        currPage: 1,
        pageRows: 10,
      },
      total: 0,
      disabled: false,
    };
  },
  methods: {
    ...mapMutations(['change_cartList', 'change_track']),
    loadMore() {
      if (this.foodList.length === this.total) {
        return;
      }
      this.disabled = true;
      this.pageInfo.currPage++;
      this.getFoodList();
    },

    getFoodType() {
      this.$http.post(`${this.URL_PREFIX}/app/get/food/category/tree`, {
        parkId: this.parkIdList[0],
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.typeList = res.resData || [];
        }
      });
    },

    getFoodList() {
      const condition = deepcopy(this.condition);

      Object.keys(condition).forEach((key) => {
        if (!condition[key]) {
          delete condition[key];
        }
      });

      this.$http.post(`${this.URL_PREFIX}/app/get/food/info/list`, {
        parkId: this.parkIdList[0],
        ...this.pageInfo,
        ...condition,
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

    showType() {
      this.typeFlag = true;
    },

    // 按类型筛选
    typeFilter(type) {
      this.condition.categoryId = type;
      this.condition.title = '';
      this.typeFlag = false;
    },

    // 按关键字搜索
    titleFilter() {
      this.condition.categoryId = '';
    },
  },
  computed: {
    ...mapGetters(['parkIdList', 'cartList']),
  },

  watch: {
    condition: {
      handler() {
        this.pageInfo.currPage = 1;
        this.foodList = [];
        this.getFoodList();
      },
      deep: true,
    },
  },

  components: { Food },
  created() {
    this.getFoodList();
    this.getFoodType();
    this.initCart();
    this.change_track('');
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.wrap{
  padding: .32rem;
  .search{
    display: flex;
    height: 1.6rem;
    line-height: 1.6rem;
    .keyword{
      flex: 1 1 auto;
      padding: 0;
      margin-right: .16rem;
      background: rgb(245, 245, 245);
    }
    .filter{
      flex: 0 0 1.6rem;
      width: 1.6rem;
      font-size: .373333rem;
      color: rgb(51, 51, 51);
      .iconfont{
        font-size: .373333rem;
        color: rgb(153, 153, 153);
      }
    }
  }

  .list{
    padding-bottom: 1.6rem;
  }

  .type_wrap{
    width: 100%;
    .type_list{
      padding: .48rem .32rem;
      @include clear-float;
      li{
        margin-right: .266667rem;
        margin-bottom: .266667rem;
        float: left;
        width: 2.133333rem;
        height: .64rem;
        line-height: .64rem;
        text-align: center;
        font-size: .32rem;
        color: rgb(51, 51, 51);
        border: .013333rem solid rgb(200, 200, 200);
        box-sizing: border-box;
        font-weight: 600;
        &:nth-of-type(4n){
          margin-right: 0;
        }
        &.active{
          background: $color-main;
          color: #fff;
          border: none;
        }
      }
    }
  }
}
</style>

