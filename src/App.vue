<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
import { Toast } from 'vant';
import { mapGetters, mapMutations } from 'vuex';
export default {
  name: 'App',
  data() {
    return {
      duration: 1500,
    };
  },
  methods: {
    ...mapMutations(['change_token', 'change_curPath']),
    getUserDetail(curPath) {
      // 记录当前路径
      this.change_curPath(curPath);
      this.$http.post(`${this.URL_PREFIX}/app/get/user/info/detail/wx`, {
        redirectUri: `${this.URL_PREFIX_PAGE}/auth/authorizeCb`,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
        } else if (res.resCode === '20201') {
          const uri = res.resData.redirectUri;
          window.location.href = uri;
        } else {
          Toast.fail({ duration: this.duration, message: res.resDesc });
        }
      });
    },
  },
  mounted() {
    this.$root.eventHub.$on('login', (curPath) => {
      this.getUserDetail(curPath);
    });
  },
};
</script>

<style>
#app {
  min-height: 100%;
  background-color: rgb(245, 245, 245);  
}
</style>

