<template>
  <div class="pay">

    <navigator title="订单支付" :routePath='"/personal/orderList"'></navigator>


  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Toast } from 'vant';

export default {
  data() {
    return {
      weChatPayParam: {
        appId: '',  
        timeStamp: '',   
        nonceStr: '',    
        package: '',     
        signType: '',
        paySign: '',
      },
    };
  },
  methods: {
    // 获取微信支付参数
    getWeChatPayParams() {
      const wechatPayNeedParam = this.$route.query;
      this.$http.post(`${this.URL_PREFIX}/app/pay/user/order/info`, {
        ...wechatPayNeedParam,
      }, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.weChatPayParam.appId = res.resData.appId;
          this.weChatPayParam.timeStamp = res.resData.timeStamp;
          this.weChatPayParam.nonceStr = res.resData.nonceStr;
          this.weChatPayParam.package = res.resData.package;
          this.weChatPayParam.signType = res.resData.signType;
          this.weChatPayParam.paySign = res.resData.paySign;
          this.callWeChatPay();
        } else {
          // 失败
          Toast.fail({ duration: 1500, message: res.resDesc });
          setTimeout(() => {
            this.$router.push('/personal/orderList');
          }, 1500);
        }
      });
    },

    // 微信支付
    onBridgeReady(){
      WeixinJSBridge.invoke('getBrandWCPayRequest', {...this.weChatPayParam}, (res) => {    
        if(res.err_msg == "get_brand_wcpay_request:ok" ) {
          // 支付成功的回调
          this.$router.push('/personal/orderList');
        } else {
          // 失败
          Toast.fail({ duration: 1500, message: '订单支付失败' });
          setTimeout(() => {
            this.$router.push('/personal/orderList');
          }, 1500);
        }
      }); 
    },

    // 发起微信支付
    callWeChatPay() {
      if (typeof WeixinJSBridge === "undefined"){
        if( document.addEventListener ){
          document.addEventListener('WeixinJSBridgeReady', this.onBridgeReady, false);
        }else if (document.attachEvent){
          document.attachEvent('WeixinJSBridgeReady', this.onBridgeReady); 
          document.attachEvent('onWeixinJSBridgeReady', this.onBridgeReady);
        }
      }else{
        this.onBridgeReady();
      }
    },
  },
  computed: {
    ...mapGetters(['token']),
  },
  mounted() {
    this.getWeChatPayParams();
  },
};
</script>



<style lang="scss" scoped>
.pay{
}
</style>
