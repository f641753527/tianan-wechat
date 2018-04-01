<template>
  <div>
  <!-- 优选服务 -->
    <ul v-waterfall-lower="loadMore" waterfall-disabled="disabled">
      <RecommendedDemo v-for="item in pageList" :key="item.serviceId" :msg="item"></RecommendedDemo>
   </ul>
  <!-- 优选服务 -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import RecommendedDemo from '../components/RecommendedDemo';

export default {
  data() {
    return{
      pageList: [],
      pageIndex: 1,
      pageTotal: 0,
      disabled: false,
    }
  },
  methods: {
    getList() {  // 获取优选服务列表
      this.$http.post(`${this.URL_PREFIX}/app/get/fine/service/info/list`, {
        parkId: this.parkIdList[0],
        currPage: this.pageIndex,
        pageRows: 10,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          const tempArr = res.resData.pageList ? res.resData.pageList : [];
          this.pageList = this.pageList.concat(tempArr);
          this.pageTotal = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
          this.disabled = false;
        }
      });
    },
    loadMore() {
      if (this.pageList.length == this.pageTotal) {
        return;
      }
      this.disabled = true;
      this.pageIndex++;
      this.getList();
    }
  },
  mounted() {
    this.getList();
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  components: {
    RecommendedDemo
  },
}
</script>

<style lang="scss" scoped>
ul {
  padding-bottom: .32rem;
}
</style>
