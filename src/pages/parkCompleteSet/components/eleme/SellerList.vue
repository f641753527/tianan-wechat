<template>
  <div class='wrap'>
    <div class='search'>
      <van-search class='keyword' placeholder="请输入店铺名称" v-model="condition.corpName"
        :style="{ 'background-color': 'rgb(245, 245, 245)' }"/>
    </div>

    <div class='list'>
      <Seller @click.native='sellerDetail(seller.corpId)' v-for="(seller, index) in sellerList" :key="index" :seller='seller'></Seller>
    </div>


  </div>
</template>

<script>
import Seller from './child/SellerItem';
import { mapGetters, mapMutations } from 'vuex';
import deepcopy from '@/utils/deepcopy';
export default {
  data() {
    return {

      sellerList: [],

      condition: {
        corpName: '',
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
    ...mapMutations(['change_track']),
    loadMore() {
      if (this.foodList.length === this.total) {
        return;
      }
      this.disabled = true;
      this.pageInfo.currPage++;
      this.getFoodList();
    },

    getSellerList() {
      const condition = deepcopy(this.condition);

      Object.keys(condition).forEach((key) => {
        if (!condition[key]) {
          delete condition[key];
        }
      });

      this.$http.post(`${this.URL_PREFIX}/app/get/food/info/corp/list`, {
        parkId: this.parkIdList[0],
        ...this.pageInfo,
        ...condition,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.total = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
          const tempArr = res.resData.pageList ? res.resData.pageList : [];
          // this.foodList = this.foodList.concat(tempArr);
          this.sellerList = tempArr;
          this.disabled = false;
        }
      });
    },


    sellerDetail(id) {
      this.change_track({ activeOuter: 9, activeInner: 1, });
      this.$router.push({ path: `/sellerDetail/${id}` });
    },
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },

  watch: {
    condition: {
      handler() {
        this.pageInfo.currPage = 1;
        this.sellerList = [];
        this.getSellerList();
      },
      deep: true,
    },
  },

  components: { Seller },
  created() {
    this.getSellerList();
  },
  mounted() {
    this.change_track('');
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.wrap{
  padding: .32rem;
  .search{
    height: 1.6rem;
    line-height: 1.6rem;
    .keyword{
      padding: 0;
      display: inline-block;
      width: 100%;
    }
  }
}
</style>

