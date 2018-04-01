<template>
  <div class="NoticeList">
    <navigator title="园区通知"></navigator>
    <div class="content" v-waterfall-lower="loadMore" waterfall-disabled="disabled">
      <p class="noticItem textOver" v-for="(item, index) in noticList" :key="index" @click="signin(item.noticeId)"> {{item.noticeTitle}}</p>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return{
      noticList: [],
      pageIndex: 1,
      disabled: false,
      total: 0,
    }
  },
  methods: {
    signin(id) {
      this.$router.push({ path: `/notice/${id}` });
    },
    getNewsList() {  // 获取通知列表
      this.$http.post(`${this.URL_PREFIX}/app/get/park/notice/list`, {
        parkId: this.parkIdList[0],
        currPage: this.pageIndex,
        pageRows: 8,
      }).then((response) => {
        const res = response.data;
        this.loading = false;
        if (res.resCode === '10000') {
          this.total = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
          const tempArr = res.resData.pageList ? res.resData.pageList : [];
          this.noticList = this.noticList.concat(tempArr);
          this.disabled = false;
        }
      });
    },
    loadMore() {
      if (this.noticList.length === this.total) {
        return;
      }
      this.disabled = true;
      this.pageIndex++;
      this.getNewsList();
    },
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  created() {
    this.getNewsList();
  },
}
</script>
<style lang="scss" scoped>
.content{
  padding: .533333rem .6rem;
  .noticItem{
    background-color: #fff;
    border-bottom: 1px solid rgb(245, 245, 245);
    border-radius: .053333rem;
    width: 8.3rem;
    height: 1.173333rem;
    line-height: 1.173333rem;
    padding: 4px 10px;
  }
}
</style>
