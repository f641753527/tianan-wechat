<template>
  <div>
    <navigator title="物业服务" routerPath="/property/" routerQuery="1001"></navigator>
    <EquipmentDemo :msg="categoryInfo" :isTextOver="false"></EquipmentDemo>
    <div class="content">
      <div class="text" ref="text" v-html="categoryInfo.content" v-show="formType !== 2"></div>
      <CustomForm :formObj="formInfo" @finishForm="submitForm" v-if="formType === 2"></CustomForm>
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
import { Indicator, Toast, Popup } from 'mint-ui';
import { jsTimestampFilter } from '@/utils/filters.js';
import deepcopy from '@/utils/deepcopy';
import EquipmentDemo from '../components/EquipmentDemo';

export default {
  data() {
    return {
      popupVisible: false,
      categoryInfo: {},
      formType: 0,
      formInfo: {},
    }
  },
  components: {
    EquipmentDemo,
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  mounted() {
    this.getInfo();
  },
  updated() {
    const imgs = this.$refs.text.querySelectorAll('img');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
  methods: {
    booking() {
      if (!this.token) {
        return false;
      }
      if (this.formType === 3) {  // 富文本+表单
        this.popupVisible = true;
      } else if (this.formType === 1) {
        // 直接预约接口
        this.submitForm();
      }
    },
    getInfo() {  // 获取详情
      Indicator.open('加载中...');
      setTimeout(() => {
        Indicator.close();
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/facilities/rent/detail`, {
        parkId: this.parkIdList[0],
        serviceId: this.$route.query.serviceId,
        facilitiesId: this.$route.params.facilitiesId,
      }, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        Indicator.close();
        if (res.resCode === '10000') {
          this.categoryInfo = res.resData;
          console.log(res);
          this.formType = res.resData.formType;  // 判断内容
          if (res.resData.formType !== 1) {
            this.formInfo = deepcopy(res.resData.customForm);
            // this.formInfo.itemList = this.formInfo.customForm.itemList;   // 排除报错
            this.formInfo.itemList.forEach((val) => {
              val.options = val.options ? val.options.split(',') : [];
              val.validate = false;
              if (val.type === 4) {
                val.defaultValue = jsTimestampFilter(new Date().getTime());
              } else if(val.type === 6) {
                val.defaultValue = [];
              }
            })
            console.log(this.formInfo);
          }
        }
      });
    },
    submitForm(content) {  // 提交表单
      Indicator.open('正在提交...');
      setTimeout(() => {
        Indicator.close();
      }, 5000);
      const orderBody = {
        parkId: this.parkIdList[0],
        serviceId: this.$route.query.serviceId,
        bindingId: this.$route.params.facilitiesId,
      }
      if (this.formType !== 1) {
        orderBody.formId = this.categoryInfo.formId;
        orderBody.content = content;
      }
      this.$http.post(`${this.URL_PREFIX}/app/added/park/service/form/order`, orderBody,
      {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        this.popupVisible = false;
        Indicator.close();
        if (res.resCode === '10000') {
          Toast('订单提交成功！');
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
  background-color: #fff;
  min-height: 4rem;
  margin: .32rem;
  margin-bottom: 60px;
  .text {
    padding: .32rem;
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
