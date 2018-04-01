<template>
  <div class='job-detail'>
    
    <navigator class='header' title="人力资源平台"></navigator>

    <Job :job='job'></Job>

    <mt-cell class='job_desc' title="职位描述"></mt-cell>

    <div class='rich_text' v-html='job.content'></div>

    <mt-cell class='job_desc' title="公司介绍"></mt-cell>

    <div class='rich_text' v-html='job.corpProfile'></div>

    <div class='footer'>
      <mt-button @click='apply'>联系企业</mt-button>
    </div>

    <van-dialog v-model="applyFlag" title='附言' show-cancel-button @cancel='cancel' @confirm='confirm'>
      <van-field v-model="applyMsg" label="附言" placeholder="请输入附言"/>
    </van-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Job from './JobItem';
import { Toast } from 'vant';

export default {
  data() {
    return {
      jobId: '',
      job: {},

      errorMsg: '申请成功，等待企业与您联系！',
      duration: 1000,
      position: '',
      applyFlag: false,
      applyMsg: '',
    };
  },
  methods: {
    apply() {
      if (!this.token) {
        this.$root.eventHub.$emit('login', this.$route.path);
      } else {
        this.applyFlag = true;
      }
    },
    cancel() {
      this.applyMsg = '';
    },
    confirm() {
      if (!this.applyMsg) {
        this.errorMsg = '请填写附言'
        Toast.fail({ duration: this.duration, message:  this.errorMsg});
        this.applyFlag = true;
        return;
      }
      this.submitRequest();
    },
    submitRequest() {
      this.$http.post(`${this.URL_PREFIX}/app/added/hr/job/order`, {
        parkId: this.parkIdList[0],
        remark: this.applyMsg,
        jobId: this.job.id,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        this.applyMsg = '';
        if (res.resCode !== '10000') {
          this.errorMsg = res.resDesc;
          Toast.fail({ duration: this.duration, message:  this.errorMsg});
        } else {
          this.errorMsg = '申请成功，等待企业与您联系！';
          Toast.success({ duration: this.duration, message:  this.errorMsg});
        }
      });
    },
    getJobDetail() {
      this.$http.post(`${this.URL_PREFIX}/app/get/hr/job/info/detail`, {
        id: this.jobId,
      }, {
        headers: { token: this.token, }
      }).then((response) => {
        const res = response.data;
        this.job = res.resData;
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  components: { Job },
  created() {
    this.jobId = this.$route.params.id;
    this.getJobDetail();
  },
  filters: {
    salaryFilter(salary) {
      if (salary === 1) {
        return '面议 ';
      } else if (salary === 2) {
        return '低于2K';
      } else if (salary === 3) {
        return '2-3K';
      } else if (salary === 4) {
        return '3-4.5K';
      } else if (salary === 5) {
        return '4.5-6K';
      } else if (salary === 6) {
        return '6-8K';
      } else if (salary === 7) {
        return '8-10K';
      } else if (salary === 8) {
        return '10-15K';
      } else if (salary === 9) {
        return '15-20K';
      } else if (salary === 10) {
        return '20-30K';
      } else if (salary === 11) {
        return '30-40K';
      } else if (salary === 12) {
        return '40-50K';
      } else if (salary === 13) {
        return '50K以上';
      }
    },
    educationFilter(education) {
      if (education === 1) {
        return '初中及以下';
      } else if (education === 2) {
        return '高中/中技/中专';
      } else if (education === 3) {
        return '大专';
      } else if (education === 4) {
        return '本科';
      } else if (education === 5) {
        return '硕士';
      } else if (education === 6) {
        return '博士';
      }
    },
    jobFilter(year) {
      if (year === 1) {
        return '有无经验均可';
      } else if (year === 2) {
        return '1-3年';
      } else if (year === 3) {
        return '3-5年';
      } else if (year === 4) {
        return '5-10年';
      } else if (year === 5) {
        return '10年以上';
      }
    },
    jobStatue(status) {
      return status === 0 ? '全职' : '兼职';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.job-detail {
  .header{
    margin-bottom: .133333rem;
  }
  .job_desc{
    margin-bottom: .026667rem;
    font-size: .453333rem;
    font-weight: 600;
    color: rgb(51, 51, 51);
  }

  .rich_text{
    padding: .32rem;
    margin-bottom: .133333rem;
    background: #fff;
  }

  .footer{
    padding: .106667rem .426667rem;
    margin-top: .4rem;
    box-sizing: border-box;
    width: 100%;
    .mint-button{
      width: 100%;
      height: 1.04rem;
      background: $color-main;
      color: #fff;
      font-size: .48rem;
    }
  }


}
</style>
