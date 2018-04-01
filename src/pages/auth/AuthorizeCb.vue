<template>
  <div>
    <navigator class='header' title="登录授权" :routePath='"/"'></navigator>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { Toast } from 'vant';

export default {
  data() {
    return {
      resCode: '',
      token: '',
      ukey: '',

      duration: 150000,
    };
  },
  methods: {
    ...mapMutations(['change_token']),
    init() {
      if (this.resCode === '10000') {
        this.change_token(this.$route.query.token);
        this.$router.push(this.curPath);
      } else if (this.resCode === '20301') {
        this.$router.push({ path: '/auth/regist', query: { ukey: this.$route.query.ukey } });
      } else {
        let errMsg = '';
        if (this.resCode === '10009') {
          errMsg = '账号已冻结,TOKEN已失效';
        } else if (this.resCode === '10010') {
          errMsg = '账号已注销,TOKEN已失效';
        } else if (this.resCode === '99999') {
          errMsg = '服务器异常，请稍后再试！';
        }
        Toast.fail({ duration: this.duration, message: errMsg });
        setTimeout(() => {
          this.$router.push('/');
        }, this.duration);
      }
    },
  },
  computed: {
    ...mapGetters(['curPath']),
  },
  mounted() {
    this.resCode = this.$route.query.resCode;
    this.init();
  },
};
</script>


