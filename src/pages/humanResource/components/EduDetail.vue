<template>
  <div class='job-detail'>

    <navigator class='header' title="人力资源平台"></navigator>

    <Job :job='job'></Job>

    <mt-cell class='job_desc' title="课程安排"></mt-cell>

    <div class='rich_text' v-html='job.content'></div>

    <mt-cell class='job_desc' title="企业介绍"></mt-cell>

    <div class='rich_text' v-html='job.corpProfile'></div>

    <div class='footer'>
      <mt-button @click='apply'>报名</mt-button>
    </div>

    <van-dialog v-model="applyFlag" title='附言' show-cancel-button @cancel='cancel' @confirm='confirm'>
      <van-field v-model="applyMsg" label="附言" placeholder="请输入附言"/>
    </van-dialog>


  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Job from './ServiceItem';
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
      this.$http.post(`${this.URL_PREFIX}/app/added/hr/education/order`, {
        parkId: this.parkIdList[0],
        remark: this.applyMsg,
        educationId: this.job.id,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;

        this.applyMsg = '';
        if (res.resCode !== '10000') {
          this.errorMsg = res.resDesc;
          Toast.fail({ duration: this.duration, message:  this.errorMsg});
        } else {
          this.errorMsg = '报名成功，等待企业与您联系！';
          Toast.success({ duration: this.duration, message:  this.errorMsg});
        }
      });
    },
    getJobDetail() {
      this.$http.post(`${this.URL_PREFIX}/app/get/hr/education/info/detail`, {
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
