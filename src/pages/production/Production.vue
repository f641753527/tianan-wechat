<template>
  <div class="Notice">
    <navigator title="产品路演"></navigator>
    <div class='list' v-waterfall-lower="loadMore" waterfall-disabled="disabled">
      <Item v-for='(item, index) in productionList' :key='index' :info='item'></Item>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Item from './child/Item';


export default {
  data() {
    return {
      productionList : [],
      condition: {
        currPage: 1,
        pageRows: 10,
      },
      total: 0,
      disabled: false,
    };
  },
  methods: {
    loadMore() {
      console.log(123);
      if (this.productionList.length === this.total) {
        return;
      }
      this.disabled = true;
      this.condition.currPage++;
      this.getList();
    },
    getList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/products/roadshow/list`, {
        parkId: this.parkIdList[0],
        ...this.condition,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.total = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
          const tempArr = res.resData.pageList ? res.resData.pageList : [];
          this.productionList = this.productionList.concat(tempArr);
          this.disabled = false;
        }
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  components: { Item },
  created() {
    this.getList();
  },
};
</script>

<style lang="scss" scoped>
.list{
  padding: .32rem;
}
</style>
