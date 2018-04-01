<template>
  <div class="OfficeDetalis">
    <Navigator title="商务服务平台"></Navigator>
    <div class="header">
      <div class="img_b">
        <img :src="detalisInfo.roomPic" alt="">
        <p class="tap">{{detalisInfo.roomTag}}</p>
      </div>
      <div class="text">
        <p class="title">{{detalisInfo.roomName}}</p>
        <p class="price">价格：{{detalisInfo.minFee / 100 | PriceFilter}} <span class="capacity fr">容量：{{detalisInfo.capacityNum}}</span> </p>
      </div>
    </div>
    <div class="content" v-html="detalisInfo.content" ref="text"></div>
    <div class="foot">
      <div class="submitBtn" @click="appointment(detalisInfo.id)">预约</div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return{
      detalisInfo: {},
      tapText: '',
    };
  },
  methods: {
    getInfo() {
      this.$http.post(`${this.URL_PREFIX}/app/get/meeting/room/info/detail`, {
        id: this.$route.params.officeDetalisId,
        parkId: this.parkIdList[0],
      }, {
        headers: { token: this.token, }
      }).then((res) => {
        console.log(res);
        if(res.data.resCode === '10000') {
          this.detalisInfo = res.data.resData ? res.data.resData : [];
          this.detalisInfo.roomTag = this.detalisInfo.roomTag.replace(/,/g, ' | ');
        }
      });
    },
    appointment(id) {
      this.$router.push({ path: `/business/OfficeAppointment/${this.$route.params.serviceId}/${id}` });
    },
  },
  created() {
    this.getInfo();
  },
  updated() {
    const imgs = this.$refs.text.querySelectorAll('img');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
}
</script>
<style lang="scss" scoped>
.header{
  width: 100%;
  background-color: #fff;
  .img_b{
    display: block;
    width: 100%;
    height: 5.253333rem;
    border-radius: .053333rem .053333rem 0 0;
    position: relative;
    img {
      width: 100%;
      height: 100%;
    }
    .tap{
      position: absolute;
      bottom: .266667rem;
      left: .266667rem;
      color: #fff;
      font-size: .32rem;
    }
  }
  .text{
    padding: .333333rem;
    .title{
      font-size: .453333rem;
      font-weight: bold;
    }
    .price{
      font-size: .4rem;
      color: rgb(217, 38, 44);
      margin-top: .133333rem;
      .capacity{
        font-size: .32rem;
        color: rgb(102, 102, 102);
      }
    }
  }
}
.content{
  padding: .333333rem;
  background-color: #fff;
  margin-top: .133333rem;
}
.foot{
  height: 1.32rem;
  width: 100%;
  text-align: center;
  line-height: 1.32rem;
  .submitBtn{
    width: 9.146667rem;
    height: 1.04rem;
    border-radius: .133333rem;
    background-color: rgb(217, 38, 44);
    color: #fff;
    font-size: .493333rem;
    text-align: center;
    line-height: 1.04rem;
    display: inline-block;
  }
}
.fr{
  float: right;
}
</style>
