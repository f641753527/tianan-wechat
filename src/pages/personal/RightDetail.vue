<template>
  <div class='detail'>
    <navigator :title="right.title"></navigator>
    <p class='banner'>
      <img :src='right.banner'>
    </p>
    <mt-cell class='desc_title' :title="right.description"></mt-cell>

    <div class='desc_text' ref='right' v-html='right.content'></div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      serviceId: '',
      right: {},
    };
  },
  methods: {
    getRightDetail() {
      this.$http.post(`${this.URL_PREFIX}/app/get/sys/service/info/detail`, {
        serviceId: this.serviceId,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.right = res.resData;
        } else {

        }
      });
    },
  },
  updated() {
    const ImgArr = this.$refs.right.querySelectorAll('.desc_text img');
    ImgArr.forEach((item) => {
      item.style.maxWidth = '100%';
    });
  },
  computed: {
    ...mapGetters(['token']),
  },
  created() {
    this.serviceId = this.$route.params.serviceId;
    this.getRightDetail();
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.detail{
  .banner{
    margin-bottom: .133333rem;
    width: 100%;
    height: 4rem;
    img{
      width: 100%;
      height: 100%;
    }
  }
  .desc_title{
    margin-bottom: .026667rem;
    height: 1.173333rem;
    line-height: 1.173333rem;
    font-size: .4rem;
    color: rgb(51, 51, 51);
    font-weight: 600;
  }
  .desc_text{
    padding: .32rem;
    box-sizing: border-box;
    width: 100%;
    overflow: hidden;
  }
}
</style>
