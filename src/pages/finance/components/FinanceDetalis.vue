<template>
  <div class="FinanceDetalis">
    <navigator title="金融平台"></navigator>
    <div class="boxBig">
      <img :src="financeInfo.picUrl" alt="">
      <h3> {{ financeInfo.serviceName }}</h3>
    </div>
    <div class="content" >
      <div class="text" v-html="content" ref="text"></div>
      <CustomForm :fromObj="formInfo" v-if="formType === 2" @finishForm="submitForm"></CustomForm>
    </div>


     <mt-button type="danger" @click.native="booking" size="small" v-if="formType !== 2" class="myButton">申请服务</mt-button>
    
    <!-- 模态 -->
    <mt-popup v-model="popupVisible" position="right" >
      <p @click="popupVisible=false"><van-icon name="arrow-left" /></p>
      <CustomForm :fromObj="formInfo" v-if="formType === 3" @finishForm="submitForm"></CustomForm>
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
    return{
      financeInfo: {},
      content: '',
      formInfo: {},
      formType: 0,
      popupVisible: false,
    }
  },
  mounted() {
    this.getInfo();
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
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
  methods: {
    getInfo() {  // 获取详情
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/form/tree`, {
        parkId: this.parkIdList[0],
        serviceId: this.$route.params.serviceId,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          console.log(res);
          this.financeInfo = res.resData;
          this.content = res.resData.content;
          this.formType = res.resData.formType;  // 判断内容
          if (res.resData.formType !== 1) {
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
              }
            })
          }
        }
      });
    },
    booking() {
     if (this.formType === 3) {  // 富文本+表单
        this.popupVisible = true;
      } else {
        // 直接预约接口
        this.submitForm();
      }
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
.FinanceDetalis{
  background-color: rgb(245, 245, 245);
}
.boxBig {
  background-color: #fff;
  border-radius: .106667rem;
  img {
    width: 100%;
    height: 5.253333rem;
    display: block;
    border-radius: .106667rem .106667rem 0 0;
    border-bottom: 1px solid #c4c4c4;
  }
  h3 {
    height: 1.2rem;
    display: flex;
    align-items: center;
    padding: 0 .32rem;
  }
}
.content{
  margin-top: .133333rem;
  padding-bottom: 40px;
  min-height: 4rem;
  background-color: #fff;
  overflow-x: auto;
  .text{
    padding: .266667rem .32rem;
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
