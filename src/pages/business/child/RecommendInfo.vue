<template>
  <div>
    <Navigator title="商务服务平台"></Navigator>
    <RecommendedDemo :msg="recommendedInfo" :isInfo="true"></RecommendedDemo>
    <div class="couponImg">
      <img :src="recommendedInfo.couponImg" alt="">
    </div>
    <div class="textContent">
      <h3 class="title">服务介绍</h3>
      <div class="text" v-html="recommendedInfo.content" ref="text" :class="{ 'textHeight': textShow }"></div>
      <div class="textShow" @click="textShow = false" v-show="textShow">
        展开
        <i class="iconfont icon-zhankai mainColor"></i>
      </div>
    </div>
    <div class="who">
      <h3 class="title">谁在用</h3>
      <div class="icon">
        <img :src="item" alt="" v-for="(item, index) in recommendedInfo.whoUsingList" :key="index">
      </div>
    </div>
    <div class="customer">
      <h3 class="title">客户说</h3>
      <div class="customerTitle clearfix">
        <img :src="recommendedInfo.customerLogo" alt="">
        <h4>{{ recommendedInfo.customerUser }}</h4>
        <p class="company">{{ recommendedInfo.customerName }}</p>
      </div>
      <p class="introduce">{{ recommendedInfo.customerDesc }}</p>
    </div>
    <div class="merchants">
      <h3 class="title">服务提供商</h3>
      <div class="content clearfix">
        <img :src="recommendedInfo.sponsorLogo" alt="">
        <div class="introduce">
          <h4>{{ recommendedInfo.providerName }}</h4>
          <p class="color_102">{{ recommendedInfo.sponsorLable }}</p>
          <p class="color_102">{{ recommendedInfo.sponsorDesc }}</p>
        </div>
      </div>
    </div>

    <div class='footer'>
      <mt-button @click='apply'>报名</mt-button>
    </div>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Toast, Indicator } from 'mint-ui';
import RecommendedDemo from '../components/RecommendedDemo';

export default {
  data() {
    return {
      recommendedInfo: {},
      textShow: true,
    }
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getInfo() {  // 获取优选服务详情
      Indicator.open('加载中...');
      setTimeout(() => {
        Indicator.close();
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/fine/service/info/detail`, {
        parkId: this.parkIdList[0],
        serviceId: this.$route.params.serviceId,
      }, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        Indicator.close();
        if (res.resCode === '10000') {
          res.resData.whoUsingList = res.resData.whoUsing.split(',');
          this.recommendedInfo = res.resData;
          console.log(res);
        }
      });
    },
    apply() {  // 申请
      if (this.token) {
        this.submit();
      } else {
        // 授权登录
      }
    },
    submit() {  // 提交表单
      Indicator.open('正在提交...');
      setTimeout(() => {
        Indicator.close();
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/added/fine/service/order`, {
        parkId: this.parkIdList[0],
        serviceId: this.$route.params.serviceId,
      },{
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        Indicator.close();
        if (res.resCode === '10000') {
          Toast({
            message: '订单提交成功！',
            iconClass: 'icon icon-success',
          });
        } else {
          Toast(res.resDesc);
        }
      });
    },
  },
  components: {
    RecommendedDemo,
  },
  updated() {
    const textImg = this.$refs.text.querySelectorAll('img');
    const textHeight = this.$refs.text.offsetHeight;
    if (textHeight < 300) {
      this.textShow = false;
    }
    textImg.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  }
}
</script>

<style lang="scss" scoped>
@import '~@scss';

.couponImg {
  height: 2.48rem;
  margin: .133333rem 0;
  background-color: #fff;
  padding: .32rem;
  img {
    width: 100%;
    height: 100%;
  }
}

.title {
  height: 1.173333rem;
  font-size: .453333rem;
  padding-left: .32rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  border-bottom: 1px solid rgb(245, 245, 245);
}
.textContent {
  background-color: #fff;
  padding-bottom: .32rem;
  .text {
    margin: .32rem;
    overflow-y: auto;
  }
  .textHeight {
    max-height: 8rem;
    overflow: hidden;
  }
  .textShow {
    text-align: center;
    .icon-zhankai {
      font-size: .186667rem;
    }
  }
}

.who {
  margin: .133333rem 0;
  background-color: #fff;
  .icon {
    padding-top: .266667rem;
    padding-bottom: .266667rem;
    img {
      width: 1.173333rem;
      height: 1.173333rem;
      border-radius: 50%;
      margin-left: .266667rem;
    }
  }
}

.customer {
  background-color: #fff;
  margin: .133333rem 0;
  .customerTitle {
    padding: .32rem .32rem 0;
    img {
      width: 1.066667rem;
      height: 1.066667rem;
      border-radius: 50%;
      margin-right: 12px;
      float: left;
    }
    h4 {
      font-size: .453333rem;
      color: #333;
    }
    p {
      font-size: .32rem;
    }
    .company {
      color: #666;
      font-size: .4rem;
    }
  }
  .introduce {
    padding: .32rem;
  }
}

.merchants {
  margin: .133333rem 0;
  margin-bottom: 60px;
  background-color: #fff;
  .content {
    margin: .32rem;
    padding: .32rem;
    background-color: rgb(245, 245, 245);
    border-radius: 5px;
  }
   img {
    width: 1.6rem;
    height: 1.6rem;
    border-radius: 5px;
    float: left;
    margin-right: .186667rem;
  }
  .introduce {
    float: left;
    h4 {
      font-size: .453333rem;
      font-weight: 600;
      color: #333;
    }
    p {
      font-size: .32rem;
    }
  }
}

.footer{
  padding: .106667rem .426667rem;
  margin-top: .4rem;
  box-sizing: border-box;
  width: 100%;
  position: fixed;
  bottom: 0;
  .mint-button{
    width: 100%;
    height: 1.04rem;
    background: $color-main;
    color: #fff;
    font-size: .48rem;
  }
}
</style>
