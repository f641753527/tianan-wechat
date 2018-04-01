<template>
  <div class="style">
    <van-swipe @change="onChange" id="vanSwipe" :autoplay="5000">
      <van-swipe-item v-for="(item, index) in swipeList" :key="index">
        <router-link :to="item.linkUrl == null ? '/' : item.linkUrl" v-if="item.type === 2">
          <img :src="item.picUrl" :title="item.title" >
        </router-link>
        <video :src="item.videoUrl" loop :muted="false" onpageshow v-if="item.type === 1" controls preload="meta"></video>
      </van-swipe-item>
    </van-swipe>
    <nav>
      <div class="entry">
        <div class="icon">
          <i class="iconfont icon-yuanqushangcheng"></i>
        </div>
        <router-link to="/shoppingMall">
         <h3>园区商城</h3>
        </router-link>
      </div>
      <div class="entry" @click='toScan'>
        <div class="icon">
          <i class="iconfont icon-saoma"></i>
        </div>
         <h3>扫码</h3>
      </div>
      <div class="entry" @click='toModule("/backstage")'>
        <div class="icon">
          <i class="iconfont icon-houtaiguanli"></i>
        </div>
         <h3>后台管理</h3>
      </div>
    </nav>
    <div class="notice">
      <div class="content boxShadow">
        <router-link to="/noticelist" class="left">
          <div>
            <i class="iconfont icon-pinglun"></i>
              <p class="more">查看更多</p>
          </div>
        </router-link>
        <div class="right">
          <router-link :to= "{ path: `/notice/${item.noticeId}` }" v-for="item in noticeList" :key="item.noticeId" class="clearfix">
            <h3 class="textOver">{{ item.noticeTitle }}</h3>
            <span class="time">{{ item.createTime | DateFilter('MM-dd') }}</span>
          </router-link>
        </div>
      </div>
    </div>
    <!-- <router-link to="/navigator">商业平台</router-link> -->
    <div class="service">
      <h3>八大服务</h3>
      <h4>互联网行业解决方案领导品牌，值得信赖！</h4>
      <ul class="content">
        <li v-for="item in serviceList" :key="item.serviceId" @click="goService(item.serviceId)" class="clearfix">
          <img :src="item.picUrl" alt="">
          <h3>{{ item.serviceName }}</h3>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      swipeList: [],
      noticeList: [],
      serviceList: [],
    }
  },
  methods: {
    ...mapMutations(['change_track']),
    onChange(index) {
      // const videos = this.$el.querySelectorAll('#vanSwipe video');
      // videos.forEach((val) => {
      //   val.pause();
      // });
    },
    getBanner() {  // 获取首页轮播和通知
      this.$http.post(`${this.URL_PREFIX}/app/get/park/banner/index`, {
        parkId: this.parkIdList[0],
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.swipeList = res.resData.bannerList;
          this.noticeList = res.resData.noticeList;
        }
      });
    },
    getService() {  // 获取八大服务
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`, {
        parkId: 1000,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.serviceList = res.resData.pageList;
        }
      });
    },
    goService(serviceId) {  // 跳转八大服务
      switch (serviceId) {
        case 1001:    // 物业服务
          this.$router.push({ path: '/property', query: { serviceId: serviceId } });
          break;
        case 1002:    // 商务服务
          this.$router.push({ path: '/business', query: { serviceId: serviceId } });
          break;
        case 1003:    // 政务平台
          this.$router.push({ path: '/governmentAffairs', query: { serviceId: serviceId } });
          break;
        case 1004:    // 金融服务
          this.$router.push({ path: '/finance', query: { serviceId: serviceId } });
          break;
        case 1005:    // 人力资源
          this.$router.push({ path: '/humanResource', query: { serviceId: serviceId } });
          break;
        case 1006:    //  园区配套
          this.$router.push({ path: '/parkCompleteSet', query: { serviceId: serviceId } });
          break;
        case 1007:     // 产品路演
          this.$router.push({ path: '/production', query: { serviceId: serviceId } });
          break;
        case 1008:     // 信息交互
          this.$router.push({ path: '/bbs', query: { serviceId: serviceId } });
          break;
        default:
          break;
      }
    },
    toModule(path) {
      this.$router.push({ path: path });
    },
    toScan() {
      window.location.href = `${this.URL_PREFIX_PAGE}/smark/pay/scan`;
    },
  },
  mounted() {
    this.getBanner();
    this.getService();
    this.change_track('');
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
}
</script>

<style lang="scss" scoped>
.style {
  background-color: #fff;
}
.van-swipe {
  height: 5rem;
  .van-swipe-item {
    background-color: #000;
  }
  img {
    width: 100%;
    height: 100%;
  }
  video {
    width: 100%;
    height: 100%;
    background-color: #000;
  }
}
nav {
  display: flex;
  height: 2.506667rem;
  justify-content: space-around;
  .entry {
    // flex: 1;
    width: 2.16rem;
    padding-top: .586667rem;
    .icon {
      width: .72rem;
      height: .72rem;
      margin: 0 auto;
      .iconfont {
        font-size: .72rem;
      }
    }
    h3 {
      font-size: .373333rem;
      line-height: 1rem;
      text-align: center;
    }
  }
}
.notice {
  height: 1.866667rem;
  padding: .266667rem 0;
  background-color: rgb(245, 245, 245);
  .content {
    // width: 100%;
    height: 100%;
    margin: 0 .266667rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    .left {
      width: 1.52rem;
      font-size: .24rem;
      text-align: center;
      border-right: 1px solid #c4c4c4;
      .icon-pinglun {
        color: rgb(230, 98, 102);
      }
      .more {
        font-size: .24rem;
        color: #000;
      }
    }
    .right {
      flex: 1;
      a {
        display: block;
        padding: 0 .32rem;
        h3 {
          width: 5.6rem;
          line-height: .666667rem;
          float: left;
          font-size: .32rem;
        }
        .time {
          float: right;
          line-height: .666667rem;
          width: 1rem;
          font-size: .32rem;
          color: rgb(102, 102, 102);
        }
      }
    }
  }
}
.service {
  padding: .32rem;
  text-align: center;
  h3 {
    font-size: .493333rem;
  }
  h4 {
    font-size: .373333rem;
    color: rgb(153, 153, 153);
    margin-top: .266667rem;
    margin-bottom: .8rem;
  }
  .content {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
    li {
      height: 1.6rem;
      width: 40%;
      border: 1px solid rgb(200,200,200);
      box-sizing: border-box;
      margin-bottom: .24rem;
      display: flex;
      justify-content: center;
      align-items: center;
      img {
        width: 1.04rem;
        height: 1.04rem;
      }
      h3 {
        margin-left: .32rem;
        font-size: .4rem;
        font-weight: 600;
      }
    }
  }
  .test{
    width: 1rem;
  }
}
</style>
