<template>
  <div class="orderDetails">
    <navigator title="订单中心" :routePath='"/personal/orderList"'></navigator>
    <div class="headerTitle">订单信息</div>
      <div class="orderBox">
        <p class="orderTitle">{{DetailsInfo.title}}</p>
        <p class="orderStatus">预计金额：{{DetailsInfo.orderFee / 100 | PriceFilter}} 元</p>
        <p class="orderPrice">准核金额：{{DetailsInfo.approvalFee / 100 | PriceFilter}} 元</p>
        <p class="orderStatus">{{DetailsInfo.orderStatus | status }}</p>
        <div class="orderDetalis">
          <p class="orderId">订单编号：{{DetailsInfo.orderId}}</p>
          <p class="orderTime">下单时间：{{DetailsInfo.createTime | DateFilter}}</p>
        </div>
        <div class="payInfo">
          <p class="payAmount">支付金额：{{ DetailsInfo.payFee ? DetailsInfo.payFee : 0 / 100 | PriceFilter }}</p>
          <p class="payWay">支付方式：{{ DetailsInfo.payType | payType }}</p>
          <p class="payId">支付单号：{{ DetailsInfo.payLogId }}</p>
          <p class="payTime">支付时间：{{ DetailsInfo.payTime | DateFilter }}</p>
        </div>
      </div>
      <div class="headerTitle">订单详情</div>
      <div class="orderDetalis">
        <!-- 自定义 -->
        <CustomDemo v-if="orderInfo.orderType === 3 || orderInfo.orderType === 10 || orderInfo.orderType === 16"
        :info="orderDetails"></CustomDemo>
        <!-- 美食街 -->
        <FoodDemo v-else-if="orderInfo.orderType === 9" :info="orderDetails"></FoodDemo>
        <!-- 优选服务 -->
        <RecomDemo v-else-if="orderInfo.orderType === 11" :info="orderDetails"></RecomDemo>
        <!-- 产品路演 -->
        <ProductionDemo v-else-if="orderInfo.orderType === 7" :info="orderDetails"></ProductionDemo>
        <!-- 园区活动 -->
        <ParkActivityDemo v-else-if="orderInfo.orderType === 13" :info="orderDetails"></ParkActivityDemo>
        <!-- 专享活动 -->
        <ExclusiveDemo v-else-if="orderInfo.orderType === 14" :info="orderDetails"></ExclusiveDemo>
        <!-- 找工作 -->
        <JobDemo v-else-if="orderInfo.orderType === 4" :info="orderDetails"></JobDemo>
        <!-- 服务外包 -->
        <ServiceDemo v-else-if="orderInfo.orderType === 5" :info="orderDetails"></ServiceDemo>
        <!-- 招培训 -->
        <EduDemo v-else-if="orderInfo.orderType === 6" :info="orderDetails"></EduDemo>
        <!-- 求购 -->
        <NeedBuyDemo v-else-if="orderInfo.orderType === 8" :info="orderDetails"></NeedBuyDemo>
        <!-- 会议室 -->
        <OfficeDemo v-else-if="orderInfo.orderType === 12" :info="orderDetails"></OfficeDemo>
      </div>
      <div class="headerTitle">个人信息</div>
      <div class="userInfo">
        <p><span class="lable">联系人</span>{{DetailsInfo.applyName}}</p>
        <p><span class="lable">联系电话</span>{{DetailsInfo.applyPhone}}</p>
        <p><span class="lable">职位</span>{{DetailsInfo.applyPosition}}</p>
        <p><span class="lable">公司名称</span>{{DetailsInfo.applyCorpName}}</p>
      </div>
      <div class="payFoot">
        <van-button size="normal" type="default" class="btn" :disabled="cancleBtn" @click="orderCancle">取消订单</van-button>
        <van-button size="normal" type="danger" class="btn" :disabled="payBtn" @click="orderPay">支付</van-button>
      </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';
import CustomDemo from './orderComponents/CustomDemo';
import FoodDemo from './orderComponents/FoodDemo';
import RecomDemo from './orderComponents/RecomDemo';
import ProductionDemo from './orderComponents/ProductionDemo';
import ParkActivityDemo from './orderComponents/ParkActivityDemo';
import ExclusiveDemo from './orderComponents/ExclusiveDemo';
import JobDemo from './orderComponents/JobDemo';
import ServiceDemo from './orderComponents/ServiceDemo';
import EduDemo from './orderComponents/EduDemo';
import NeedBuyDemo from './orderComponents/NeedBuyDemo';
import OfficeDemo from './orderComponents/OfficeDemo';
import { Toast } from 'mint-ui';

export default {
  data() {
    return{
      url: '', // 动态url
      cancleBtn: true, // 取消按钮的禁用
      payBtn: true, // 支付按钮的禁用
      // 订单信息
      DetailsInfo:{},
      // 用户信息
      userinfo: { 
        name: '',
        position: '',
        phone: '',
        corp: '',
      },
      // 订单详情(传到子组件)
      orderDetails: {},
      // 详情信息
      orderInfo: { 
        orderId: '',
        orderType: 0,
      },
    }
  },
  methods: {
    // 获取详情
    getdetails() {
      this.$http.post(`${this.URL_PREFIX}${this.url}`, {
        orderId: this.$route.query.orderId,
      },{
        headers: { token: this.token },
      }).then((res) => {
        console.log(res);
        if(res.data.resCode === '10000') {
          this.DetailsInfo = res.data.resData;
          console.log(this.DetailsInfo);
          if(res.data.resData.orderType === 9 || res.data.resData.orderType === 12) {
            this.orderDetails = res.data.resData; // 订单信息
          } else{
            this.orderDetails = res.data.resData.orderServiceInfo ? res.data.resData.orderServiceInfo : {}; // 订单服务信息
          }
          if(res.data.resData.orderStatus === 5) {
            this.payBtn = false;
          }else{
            this.payBtn = true;
          }
          if(res.data.resData.orderStatus === 0 || res.data.resData.orderStatus ===3 || res.data.resData.orderStatus === 4 || 
            res.data.resData.orderStatus === 6 || res.data.resData.orderStatus === 7 || res.data.resData.orderStatus === 8) { // 把取消按钮禁用
            this.cancleBtn = true;
          }
        }
        
      });
    },
    // 获取用户信息
    getinfo() {
      // console.log(this.user);
      this.orderInfo.orderType = Number(this.$route.query.orderType);
      this.orderInfo.orderId = this.$route.query.orderId;
      // this.userinfo.name = this.user.userCardInfo.name;
      // this.userinfo.position = this.user.userCardInfo.position;
      // this.userinfo.phone = this.user.userCardInfo.phone;
      // this.userinfo.corp = this.user.userCardInfo.corpName;
    },
    // 根据orderType获取URL
    makeurl() {
      switch (Number(this.orderInfo.orderType)) {
        case 3:
        case 10:
        case 16:
          this.cancleBtn = false;
          this.url = '/app/get/park/service/form/order/detail'; // 自定义服务
          break;
        case 4:
          this.url = '/app/get/hr/job/order/detail'; // 找工作
          break;
        case 5:
          this.url = '/app/get/hr/service/order/detail'; // 服务外包
          break;
        case 6:
          this.url = '/app/get/hr/education/order/detail'; // 培训
          break;
        case 7:
          this.url = '/app/get/products/roadshow/order/detail'; // 产品路演
          break;
        case 8:
          this.url = '/app/get/ask/service/order/detail'; // 求购 
          break;
        case 9:
          this.cancleBtn = false;
          this.url = '/app/get/food/order/detail'; // 美食街
          break;
        case 11:
          this.url = '/app/get/fine/service/order/detail'; // 优选服务
          break;
        case 12:
          this.cancleBtn = false;
          this.url = '/app/get/meeting/room/order/detail'; // 会议室 
          break;
        case 13:
          this.cancleBtn = false;
          this.url = '/app/get/activity/order/detail'; // 活动
          break;
        case 14:
          this.url = '/app/get/welfare/order/detail'; // 福利
          break;
        // case 15:
        //   this.url = ''; // 微社区
        //   break;
        // case 17:
        //   this.url = '/app/get/shop/order/detail'; // 商城
        //   break;
        default:
          break;
      }
    },
    // 支付
    orderPay() {
      window.location.href = `${this.URL_PREFIX_PAGE}/smark/pay/wechat?paymentId=${1}&wxTradeType=${2}&orderId=${this.orderInfo.orderId}`;
    },
    // 取消
    orderCancle() {
      if(this.orderInfo.orderType === 13) {
        // 活动
        this.$http.post(`${this.URL_PREFIX}/app/cancel/activity/order`, {
        orderId: this.$route.query.orderId,
      },{
        headers: { token: this.token },
      }).then((res) => {
        console.log(res);
        if(res.data.resCode === '10000') {
          Toast('取消成功！');
          this.cancleBtn = true;
        }else{
           Toast(res.data.resDesc);
        }
       });
      }else if(this.orderInfo.orderType === 3 || this.orderInfo.orderType === 10 || this.orderInfo.orderType === 16) {
        // 自定义
        this.$http.post(`${this.URL_PREFIX}/app/delete/park/service/form/order`, {
          orderId: this.$route.query.orderId,
        },{
          headers: { token: this.token },
        }).then((res) => {
          console.log(res);
          if(res.data.resCode === '10000') {
            Toast('取消成功！');
            this.cancleBtn = true;
          }else{
            Toast(res.data.resDesc);
          }
        });
      }else if( this.orderInfo.orderType === 9 ) {
        // 美食街
        this.$http.post(`${this.URL_PREFIX}/app/delete/meeting/room/order`, {
          orderId: this.$route.query.orderId,
        },{
          headers: { token: this.token },
        }).then((res) => {
          console.log(res);
          if(res.data.resCode === '10000') {
            Toast('取消成功！');
            this.cancleBtn = true;
          }else{
            Toast(res.data.resDesc);
          }
        });
      }else if(this.orderInfo.orderType === 12 ) {
        // 会议室
        this.$http.post(`${this.URL_PREFIX}/app/delete/meeting/room/order`, {
          orderId: this.$route.query.orderId,
        },{
          headers: { token: this.token },
        }).then((res) => {
          console.log(res);
          if(res.data.resCode === '10000') {
            Toast('取消成功！');
            this.cancleBtn = true;
          }else{
            Toast(res.data.resDesc);
          }
        });
      }
      
    },
  },
  computed: {
    ...mapGetters(['parkIdList','token', 'user']),
  },
  created() {
    this.getinfo();
    this.makeurl();
    this.getdetails();
  },
  filters: {
    status(sta) {
      // 0删除/1待审批/2审批中/3审批不通过/4用户取消/5待支付/6完成/7订单关闭/8已退款
      if(sta === 0) {
        return '删除';
      }else if (sta === 1) {
        return '待审批';
      }else if (sta === 2) {
        return '审批中';
      }else if (sta === 3) {
        return '审批不通过';
      }else if (sta === 4) {
        return '用户取消';
      }else if (sta === 5) {
        return '待支付';
      }else if (sta === 6) {
        return '完成';
      }else if (sta === 7) {
        return '订单关闭';
      }else if (sta === 8) {
        return '已退款';
      }
    },
    payType(ty) {
      if(ty === 1) {
        return '微信支付';
      }
    }
  },
  components: {
    CustomDemo, FoodDemo, RecomDemo, ProductionDemo, ParkActivityDemo, ExclusiveDemo, JobDemo, ServiceDemo, EduDemo, NeedBuyDemo, OfficeDemo
  },
}
</script>
<style lang="scss" scoped>
.headerTitle{
  margin-top: .133333rem;
  font-size: .453333rem;
  font-weight: bold;
  background-color: #fff;
  padding: .36rem .32rem;
}
.orderBox{
    padding: .4rem .32rem;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    border-top: 1px solid rgb(245, 245, 245);
    .orderTitle{
      font-size: .453333rem;
      font-weight: bold;
    }
    .orderPrice{
      margin-top: .266667rem;
      font-size: .4rem;
      font-weight: bold;
      color: rgb(217, 38, 44);
    }
    .orderStatus{
      margin-top: .266667rem;
      font-size: .4rem;
      font-weight: bold;
    }
    .orderDetalis{
      margin-top: .4rem;
      border-top: 1px solid rgb(245, 245, 245);
      padding: .266667rem 0;
      box-sizing: border-box;
      .orderId{
        color: rgb(102, 102, 102);
      }
      .orderTime{
        color: rgb(102, 102, 102);
      }
    }
    .payInfo{
      border-top: 1px solid rgb(245, 245, 245);
      margin-top: .266667rem;
      padding: .266667rem 0;
      box-sizing: border-box;
      p{
        color: rgb(102, 102, 102);
      }
    }
  }
.orderDetalis{
  padding: 0 .32rem;
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  border-top: 1px solid rgb(245, 245, 245);
}
.userInfo{
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  border-top: 1px solid rgb(245, 245, 245);
  padding: 0 .32rem;
  p{
    height: 1.173333rem;
    border-bottom: 1px solid rgb(245, 245, 245);
    line-height: 1.173333rem;
    .lable{
      width: 3.173333rem;
      display: inline-block;
      text-align: left;
    }
  }
}
.payFoot{
  padding: .133333rem 0;
  text-align: center;
  .btn{
    width: 4.44rem;
  }
}
</style>
