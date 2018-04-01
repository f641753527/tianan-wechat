<template>
  <div>
    <ul v-waterfall-lower="loadMore" waterfall-disabled="disabled" :waterfall-offset="200">
      <EquipmentDemo v-for="(item, index) in pageList" :key="index" :msg="item"></EquipmentDemo>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Indicator } from 'mint-ui';
import EquipmentDemo from '../components/EquipmentDemo';

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
    getList() {  // 获取列表
      Indicator.open('加载中...');
      setTimeout(() => {
        Indicator.close();
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/facilities/rent/list`, {
        parkId: this.parkIdList[0],
        serviceId: this.$route.params.serviceId,
        currPage: this.pageIndex,
        pageRows: 10,
      }).then((response) => {
        const res = response.data;
        Indicator.close();
        if (res.resCode === '10000') {
          const tempArr = res.resData.pageList ? res.resData.pageList : [];
          this.pageList = this.pageList.concat(tempArr);
          this.pageTotal = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
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
    EquipmentDemo, 
  },
  watch: {
    $route() {
      this.pageList = [];
      this.getList();
    },
  },
}
</script>

<style lang="scss" scoped>


ul {
  padding-bottom: .32rem;
}
</style>
