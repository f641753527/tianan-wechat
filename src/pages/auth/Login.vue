<template>
  <div class='login'>
    <navigator class='header' title="登录"></navigator>

    <div class='body'>
      
      <mt-field class='password1' placeholder="请输入密码" type="password" v-model="password1"></mt-field>

      <mt-field class='password2' placeholder="请再次输入密码" type="password" v-model="password2"></mt-field>

      <div class='foot_bottom'>
        <van-button text='登录' @click.native='login' block />
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
      password1: '',
      password2: '',

      duration: 1500,
    };
  },
  methods: {
    ...mapMutations(['change_token', 'change_firstLogin', 'change_authorizedCode']),
    login() {
      const valid = /^(\w){8,}$/;
      if (!this.password1) {
        Toast.fail({ duration: this.duration, message:  '请输入密码'});
        return;
      } else if (!valid.test(this.password1)) {
        Toast.fail({ duration: this.duration, message:  '密码仅支持8位以上数字、字母和下划线'});
        return;
      } else if (!this.password2) {
        Toast.fail({ duration: this.duration, message:  '请输入密码'});
        return;
      } else if (!valid.test(this.password2)) {
        Toast.fail({ duration: this.duration, message:  '密码仅支持8位以上数字、字母和下划线'});
        return;
      } else if (this.password1 !== this.password2) {
        Toast.fail({ duration: this.duration, message:  '两次密码不一致'});
        return;
      }

      this.$http.post(`${this.URL_PREFIX}/app/quick/auth/user/register`, {
        type: 1,
        userMobile: this.$route.query.userMobile,
        validateCode: this.$route.query.validateCode,
        ukey: this.$route.query.ukey,
        loginPassword: this.MD5(this.password1),
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.change_token(res.resData.token);
          this.$router.push(this.curPath);
        } else {
          Toast.fail({ duration: this.duration, message: res.resDesc});
        }
      });
    },
  },
  computed: {
    ...mapGetters(['curPath']),
  },
};
</script>


<style lang='scss' scoped>
  .login{
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    background: #fff;
    .body{
      .foot_bottom{
        padding: 0 .8rem;
        .van-button{
          border-radius: .666667rem;
          background: #d0011b;
          color: #fff;
          font-size: .48rem;
        }
      }
      .mint-field{
        padding: 0 .266667rem;
        height: 1.173333rem;
        line-height: 88px;
        font-size: .4rem;
        color: rgb(67, 67, 67);
        border-bottom: .013333rem solid rgb(245, 245, 245);
      }
      .password1{
        margin-top: 2.666667rem;
      }
      .password2{
        margin-bottom: .4rem;
      }
    }
  }
</style>