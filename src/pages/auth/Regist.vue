<template>
  <div class='wrapper'>
    <navigator class='header' title="注册"></navigator>

    <div class='body'>
      
      <mt-field class='phone' placeholder="请输入手机号" type="tel" v-model="userMobile"></mt-field>

      <mt-field class='smsCode' v-model="smsCode" type="tel"  placeholder="请输入验证码">
        <van-button class='send' @click.native='sendAccessCode' type='small'>{{access_msg}}</van-button>
      </mt-field>

      <div class='foot_bottom'>
        <van-button text='下一步' @click.native='next' block />
      </div>

    </div>

  </div>
</template>

<script>
import { Toast } from 'vant';
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      userMobile: '',
      smsCode: '',
      ukey: '',

      timer: 60,  // 默认倒数60秒
      stop: true,  // 默认是停止的
      Interval: null, // setInterval的对象

      duration: 1500,
    };
  },
  methods: {
    ...mapMutations(['change_token', 'change_firstLogin', 'change_authorizedCode']),
    runTimer() {
      if (this.timer <= 0) {
        this.timer = 60;
        this.stop = true;
        clearInterval(this.Interval);
      } else {
        this.timer -= 1;
      }
    },
    startTimer() {
      // 如果是false就开始倒计时，如果是true就停止倒计时
      if (!this.stop) {
        this.Interval = setInterval(this.runTimer, 1000);
      } else {
        clearInterval(this.Interval);
      }
    },
    sendAccessCode() {
      const phoneReg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;

      if (!this.userMobile) {
        Toast.fail({ duration: this.duration, message:  '请输入手机号'});
        return;
      } else if (!phoneReg.test(this.userMobile)) {
        Toast.fail({ duration: this.duration, message:  '手机号格式错误'});
        return;
      }
      
      // 手机号正确的处理
      this.stop = false;
      this.startTimer();
      this.$http.post(`${this.URL_PREFIX}/app/added/user/send/sms`, {
        userMobile: this.userMobile,
        smsType: 6,
      }).then((response) => {
        const res = response.data;
        if (res.resCode !== '10000') {
          Toast.fail({ duration: this.duration, message:  res.resDesc});
        }
      });
    },

    next() {
      if (!this.smsCode) {
        Toast.fail({ duration: this.duration, message:  '请输入验证码'});
        return;
      }
      this.$http.post(`${this.URL_PREFIX}/app/quick/auth/user/register`, {
        type: 1,
        userMobile: this.userMobile,
        validateCode: this.smsCode,
        ukey: this.ukey,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.change_token(res.resData.token);
          this.$router.push(this.curPath);
        } else if (res.resCode === '17106') {
          this.$router.push({ path: '/auth/login', query: { ukey: this.ukey, userMobile: this.userMobile, validateCode: this.smsCode }});
        } else {
          Toast.fail({ duration: this.duration, message:  res.resDesc});
        }
      });
    }
  },
  computed: {
    ...mapGetters(['curPath']),
    access_msg() {
      return this.stop ? '发送验证码' : `${this.timer}秒后可重新发送`;
    },
  },
  created() {
    this.ukey = this.$route.query.ukey;
  },
};
</script>


<style lang="scss" scoped>
.wrapper{
  position: absolute;
  top: 0;
  bottom: 0;
  width: 100%;
  background: #fff;
  .body{
    .mint-field{
      padding: 0 .266667rem;
      // height: 1.173333rem;
      line-height: 88px;
      font-size: .4rem;
      color: rgb(67, 67, 67);
      // border-bottom: .013333rem solid rgb(245, 245, 245);
    }
    .phone{
      margin-top: 2.666667rem;
    }
    .smsCode{
      margin-bottom: 1.2rem;
      .send{
        padding: 0;
        border: none;
        outline: 0;
        background: #fff;
      }
    }

    .foot_bottom{
      padding: 0 .8rem;
      .van-button{
        border-radius: .666667rem;
        background: #d0011b;
        color: #fff;
        font-size: .48rem;
      }
    }
  }
}
</style>
