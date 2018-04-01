<template>
  <div class="Notice">
    <navigator title="园区通知"></navigator>
    <div class="content">
      <div class="noticetital">
        {{ noticeInfo.noticeTitle}}
      </div>
      <div class="noticetime">{{ noticeInfo.createTime | DateFilter }}</div>
      <div class="noticetext" v-html="noticeInfo.noticeContent" ref="text"></div>
    </div>
  </div>
</template>

<script>
import Navigator from '@/components/Navigator';

export default {
  data() {
    return{
      noticeInfo: {},
    }
  },
  methods: {
    getNotice() {
      this.$http.post(`${this.URL_PREFIX}/app/get/park/notice/detail`,{
        noticeId: this.$route.params.noticeid,
      }, {
        headers: { token: this.token },
      }).then((res) => {
        if(res.data.resCode === '10000') {
          this.noticeInfo = res.data.resData;
        }
      });
    },
  },
  updated() {
    const imgs = this.$refs.text.querySelectorAll('img');
    const videos = this.$refs.text.querySelectorAll('video');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
    videos.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
  components: {
    Navigator,
  },
  created() {
    this.getNotice();
  },
}
</script>
<style lang="scss" scoped>
.Notice{
  background-color: #fff;
}
.content{
  padding: .32rem;
}
.noticetital{
  width: 9.093333rem;
  margin: 0 auto;
  text-align: center;
  margin-top: .4rem;
  font-weight: bold;
}
.noticetime{
  color: rgb(102, 102, 102);
  font-size: .32rem;
  text-align: center;
  margin-top: .226667rem;
}
.noticetext{
  font-size: .4rem;
  color: rgb(56, 56, 56);
  margin-top: .266667rem;
}
</style>
