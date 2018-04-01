<template>
  <div class="scan">
    <navigator title="扫一扫" :routePath='"/"'></navigator>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Toast } from 'vant';

export default {
  data() {
    return {
      appId: '',
      timestamp: '',
      nonceStr: '',
      signature: '',
    };
  },
  methods: {
    getJsSdkConfigParams() {
      this.$http.post(`${this.URL_PREFIX}/app/get/wx/jssdk/config/info`, {
        url: `${this.URL_PREFIX_PAGE}/smark/pay/scan`
      }, {
        headers: { token: this.token } 
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.appId = res.resData.appId;
          this.timestamp = res.resData.timestamp;
          this.nonceStr = res.resData.nonceStr;
          this.signature = res.resData.signature;
          this.config();
        } else {
          Toast.fail({ duration: 1500, message: res.resDesc });
        }
      });
    },
    config() {
      wx.config({
        debug: false,
        appId: this.appId,
        timestamp: "" + this.timestamp,
        nonceStr: this.nonceStr,
        signature: this.signature,
        jsApiList: ['checkJsApi', 'scanQRCode']
      });


      // 配置出错
      wx.error((res) => {
        Toast.fail({ duration: 1500, message: `${res}` });
      });

      // 配置成功之后的回调
      wx.ready(() => {
        wx.checkJsApi({
          jsApiList : ['scanQRCode'],
          success : (res) => {
          }
        });
        wx.scanQRCode({
          needResult : 1,
          scanType : ["qrCode"],
          success : (res) => {
            var result = res.resultStr;
            window.location.href = result;
            // Toast.fail({ duration: 15000, message: `${result}` });
          }
        });
      });
    },
  },
  created() {
    this.getJsSdkConfigParams();
  },

  computed: {
    ...mapGetters(['token']),
  },
};
</script>

