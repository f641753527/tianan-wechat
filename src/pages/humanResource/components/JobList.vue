<template>
  <div class='service-list'>

    <van-tabs class='job_types' type="card" @click='switchType'>
      <van-tab title="全部"></van-tab>
      <van-tab v-for="(type, index) in jobTypeList" :key='index' :title="type.name"></van-tab>
    </van-tabs>

    <div class='job_list' v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="100">
      <Job v-for='(job, index) in jobList' :key='index' :job='job'></Job>
    </div>
  </div>
</template>

<script>
import Job from './JobItem';
import { mapGetters } from 'vuex';


export default {
  data() {
    return {
      jobTypeList: [],
      jobList: [],
      categoryId: '',
      // 当前筛选类型
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
      if (this.jobList.length === this.total) {
        return;
      }
      this.disabled = true;
      this.condition.currPage++;
      this.getJobList();
    },
    getJobTypeListList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/hr/job/category/list`, {
        parkId: this.parkIdList[0],
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.jobTypeList = res.resData.pageList ? res.resData.pageList : [];
        }
      });
    },
    getJobList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/hr/job/info/list`, {
        ...this.condition,
        parkId: this.parkIdList[0],
        categoryId: this.categoryId,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.total = res.resData.pageInfo ? res.resData.pageInfo.total : 0;
          const tempArr = res.resData.pageList ? res.resData.pageList : [];
          this.jobList = this.jobList.concat(tempArr);
          this.disabled = false;
        }
      });
    },
    // 类型筛选
    switchType(key) {
      this.categoryId = key === 0 ? '' : this.jobTypeList[key-1].id;
      this.condition.currPage = 1;
      this.jobList = [];
      this.getJobList();
    },
  },
  components: { Job },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  mounted() {
    this.getJobTypeListList();
    this.getJobList();
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.service-list{
  .job_types{
    margin-top: .346667rem;
  }
  .job_list{
    margin-top: .346667rem;
    padding: .346667rem;
    // min-height: 600px;
    border-top: .013333rem solid rgb(200, 200, 200);
  }
}
</style>

