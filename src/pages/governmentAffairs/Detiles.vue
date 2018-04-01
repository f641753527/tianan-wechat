<template>
  <div>
    <navigator :title="serviceName"></navigator>

    <div class="content">
      <!-- 富文本 -->
      <div class="text" ref="text" v-html="content" v-show="formType !== 2"></div>
      <!-- 表单 -->
      <CustomForm :formObj="formInfo" v-if="formType === 2" @finishForm="submitForm"></CustomForm>
    </div>

    <mt-button type="danger" @click.native="booking" size="small" v-if="formType !== 2" class="myButton">提交</mt-button>

   <!-- 遮罩 -->
    <mt-popup v-model="popupVisible" position="right" >
      <p @click="popupVisible=false"><van-icon name="arrow-left" /></p>
      <CustomForm :formObj="formInfo" v-if="formType === 3" @finishForm="submitForm"></CustomForm>
    </mt-popup>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { jsTimestampFilter } from '@/utils/filters.js';
import { Indicator, Toast, Popup } from 'mint-ui';
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    return {
      serviceName: '',  // 服务名称
      content: '',  // 富文本
      formType: 0,    // 1为文本， 2为表单 3为文本+表单
      formInfo: {},   // 表单内容
      popupVisible: false,
    }
  },
  mounted() {
    this.getInfo();
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  updated () {
    const imgs = this.$refs.text.querySelectorAll('img');
    const videos = this.$refs.text.querySelectorAll('video');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
    videos.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
  methods: {
    booking() {
     if (this.formType === 3) {  // 富文本+表单
        this.popupVisible = true;
      } else {
        // 直接预约接口
        this.submitForm();
      }
    },
    getInfo() {  // 获取详情
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      });
      setTimeout(() => {
        Indicator.close();
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/form/tree`, {
        parkId: this.parkIdList[0],
        serviceId: this.$route.params.serviceId ? this.$route.params.serviceId : 1003,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        Indicator.close();
        if (res.resCode === '10000') {
          this.serviceName = res.resData.serviceName;
          this.content = res.resData.content;
          this.formType = res.resData.formType;  // 判断内容
          if (res.resData.formType === 2 || res.resData.formType === 3) {
            this.formInfo = deepcopy(res.resData.formTreeDto);
            // 排除报错
            this.formInfo.itemList = this.formInfo.itemList ? this.formInfo.itemList : [];
            this.formInfo.itemList.forEach((val) => {
              val.options = val.options ? val.options.split(',') : [];
              val.validate = false;
              if (val.type === 4) {
                val.defaultValue = jsTimestampFilter(new Date().getTime());
              } else if(val.type === 6) {
                val.defaultValue = [];
              } else if (val.type === 3) {
                val.defaultValue = Number(val.defaultValue);
              }
            })
          }
        }
      });
    },
    submitForm(formContent) {  // 提交表单
      this.popupVisible = false;
      Indicator.open({
        text: '正在提交...',
        spinnerType: 'fading-circle'
      });
      setTimeout(() => {
        Indicator.close();
      }, 5000);
      const orderBody = {
        parkId: this.parkIdList[0],
        serviceId: this.$route.params.serviceId,
      }
      if (this.formType !== 1) {
        orderBody.formId = this.formInfo.formId;
        orderBody.content = formContent;
      }
      this.$http.post(`${this.URL_PREFIX}/app/added/park/service/form/order`, orderBody,
      {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        Indicator.close();
        if (res.resCode === '10000') {
          Toast({
            message: '提交订单成功！',
            iconClass: 'icon icon-success'
          });
          if (res.resData.orderFee && res.resData.orderFee !== 0) {
            window.location.href = `${this.URL_PREFIX_PAGE}/smark/pay/wechat?paymentId=${1}&wxTradeType=${2}&orderId=${res.resData.orderId}`;
          }
        } else {
          Toast(res.resDesc);
        }
      });
    },
  },
}
</script>

<style lang="scss" scoped>
.content {
  margin: 10px 0 40px;
  min-height: 300px;
  padding: .32rem;
  overflow-x: auto;
  background-color: #fff;
  .text {
    margin-bottom: 20px;
  }
}
.mint-popup {
  height: 100%;
  width: 100%;
  overflow-y: scroll;
  p {
    padding-top: 20px;
    padding-left: 10px;
  }
}
.myButton {
  width: 90%;
  margin: 0 .426667rem;
  position: fixed;
  bottom: 10px;
}
</style>
