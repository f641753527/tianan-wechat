<template>
  <div class='info'>
    <navigator :title="navtital" :routePath='"/"'></navigator>
    <mt-cell class='card' title="个人名片" to="/personal/editCard" is-link></mt-cell>
    <div class='card_wrapper'>
      <div class='info_body'>
        <p class='name paddingL'>{{userCardInfo.name}} &nbsp;</p>
        <p class='mobile paddingL'>{{userCardInfo.phone}} &nbsp;</p>

        <div class='position line'>{{userCardInfo.corpName}} &nbsp;</div>

        <p class='tel paddingL'>TEL: {{userCardInfo.tel}}</p>
        <p class='email paddingL'>Email: {{userCardInfo.email || ''}}</p>
        <p class='address paddingL'>ADDR: {{userCardInfo.address}}</p>
      </div>
    </div>

    <mt-cell class='info_link link_cell' title="个人资料" to="/personal/editInfo" is-link>
      <i slot='icon' class='iconfont icon-gerenmingpian'></i>
    </mt-cell>
    <mt-cell class='order_link link_cell' title="订单中心" to="/personal/orderList" is-link>
      <i slot='icon' class='iconfont icon-dingdanzhongxin'></i>
    </mt-cell>

    <mt-cell class='right_cell' title="园区用户专属特权"></mt-cell>

    <ul class='rights'>
      <li class='item' @click='rightDetail(1)'>
        <div class="icon"><i class='iconfont icon-VIPquanyi'></i></div>
        <p>VIP权益</p>
      </li>
      <li class='item' @click='rightDetail(2)'>
        <div class="icon"><i class='iconfont icon-zhuanshufuli'></i></div>
        <p>专享福利</p>
      </li>
      <li class='item' @click='rightDetail(3)'>
        <div class="icon"><i class='iconfont icon-huoqurenmai'></i></div>
        <p>获取人脉</p>
      </li>
    </ul>
    
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      navtital: '个人中心',
      userCardInfo: {},
    };
  },
  methods: {

    getUserInfo() {
      this.$http.post(`${this.URL_PREFIX}/app/get/user/info/detail`, {}, {
        headers: {
          token: this.token,
        },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.userCardInfo = res.resData.userCardInfo;
        }
      });
    },

    rightDetail(serviceId) {
      this.$router.push(`/personal/rightDetail/${serviceId}`);
    },
  },
  computed: {
    ...mapGetters(['token']),
  },
  created() {
    if (!this.token) {
      this.$root.eventHub.$emit('login', this.$route.path);
    } else {
      this.getUserInfo();
    }
  },
};
</script>


<style lang="scss" scoped>
@import '~@scss';
.info{
  background: rgb(245, 245, 245);
  .card{
    border-bottom: .013333rem solid rgb(245, 245, 245);
  }
  .card_wrapper{
    padding: .4rem .32rem;
    margin-bottom: .133333rem;
    background: rgb(255, 255, 255);
    .info_body{
      padding: .4rem 0;
      box-shadow: 0 .026667rem .053333rem .066667rem rgba(0, 0, 0, 0.1);
      color: rgb(81, 81, 81);
      font-size: .213333rem;
      .paddingL{
        padding-left: .96rem;
        margin: .213333rem 0;
        height: .426667rem;
        line-height: .426667rem;
        &.name{
          height: .64rem;
          line-height: .64rem;
          font-size: .4rem;
          font-weight: 700;
        }
        &.mobile{
          height: .533333rem;
          line-height: .533333rem;
          font-size: .24rem;
          font-weight: 600;
        }
      }
      .line{
        padding-left: .96rem;
        height: .8rem;
        line-height: .8rem;
        background: $color-main;
        color: #fff;
        font-size: .266667rem;
      }

    }
  }
  .link_cell{
    height: 1.173333rem;
    line-height: 1.173333rem;
    font-size: .4rem;
    color: rgb(81, 81, 81);
    &.info_link{
      border-bottom: .013333rem solid rgb(245, 245, 245);
    }
    &.order_link{
      margin-bottom: .133333rem;
    }
    .iconfont{
      font-size: .4rem;
    }
    .icon-gerenmingpian{
      color: rgb(255, 102, 102);
    }
    .icon-dingdanzhongxin{
      color: rgb(245, 166, 35);
    }
  }

  .right_cell{
    height: 1.173333rem;
    line-height: 1.173333rem;
    font-size: .4rem;
    color: rgb(81, 81, 81);
    border-bottom: .013333rem solid rgb(245, 245, 245);
  }

  .rights{
    display: flex;
    padding: .853333rem;
    background: #fff;
    .item{
      flex: 1 1 auto;
      text-align: center;
      color: rgb(103, 103, 103);
      font-size: .4rem;
      font-weight: 600;
      .iconfont{
        font-size: 1.013333rem;
        margin-bottom: .266667rem;
        &.icon-VIPquanyi{
          color: rgb(255, 121, 78);
        }
        &.icon-zhuanshufuli{
          color: rgb(255, 108, 107);
        }
        &.icon-huoqurenmai{
          color: rgb(107, 177, 255);
        }
      }
    }
  }
}
</style>

