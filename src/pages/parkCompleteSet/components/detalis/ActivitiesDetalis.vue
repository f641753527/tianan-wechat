<template>
  <div class="ActivitiesDetalis">
    <navigator title="园区配套"></navigator>
    <div class="header">
      <img :src="actinfo.banner" alt="" class="img_b">
      <div class="headerCon">
        <p class="actTitle">{{actinfo.activityParkName}}</p>
        <p class="price">{{actinfo.price}} 元</p>
      </div>
    </div>
    <div class="organizers">
      <img :src="actinfo.sponsorLogo" alt="" class="orgLogo">
      <div class="organizersText">
        <p class="organizersName textOver">{{ actinfo.sponsorName }}</p>
        <div class="annotation">主办方</div>
        <p class="organizersType">{{ actinfo.sponsorLable }}</p>
        <p class="organizersDescribe">{{ actinfo.sponsorDesc }}</p>
      </div>
    </div>
    <div class="actinfo">
      <div class="limTime"> <i class="iconfont icon-shijian "></i> {{actinfo.beginTime | DateFilter}} 至 {{actinfo.endTime | DateFilter}}</div>
      <div class="address"> <i class="iconfont icon-dizhi"></i> <div class="addressText"> {{actinfo.address}} </div></div>
      <div class="places"> <i class="iconfont icon-renshu"></i> {{actinfo.showNum}}个名额</div>
    </div>
    <div class="content"> 
      <div class="fuwu">服务介绍</div>
      <div class="text" ref="text" v-html="actinfo.content"></div>
      <CustomForm :formObj="formInfo" @finishForm="submitForm" v-if="formType === 2 && actinfo.content.length === 0"></CustomForm>
    </div>
    <!-- <div class="submitbox">
      <mt-button type="danger" class="submit" @click="submit11(actinfo.activityId)">提交</mt-button>
    </div> -->


    <mt-button type="danger" @click.native="booking" size="small" class="myButton" v-if="formType === 1 || formType === 2 && actinfo.content.length !== 0">提交</mt-button>

   <!-- 遮罩 -->
    <mt-popup v-model="popupVisible" position="right" >
      <p @click="popupVisible=false"><van-icon name="arrow-left" /></p>
      <CustomForm :formObj="formInfo" @finishForm="submitForm" v-if="formType === 2 && actinfo.content.length !== 0"></CustomForm>
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
      actinfo: {},
      formType: 0,
      popupVisible: false,
      formInfo: {},
    }
  },
  methods: {
    // submit11(id) {
    //   if(this.actinfo.formFlag === 1) {
    //     this.$http.post(`${this.URL_PREFIX}/app/added/activity/order`,{
    //       parkId: Number(this.parkIdList[0]),
    //       activityId: Number(this.$route.params.activitiesDetalisId),
    //     },{
    //       headers: { token: this.token },
    //     }).then((res) => {
    //       if(res.data.resCode === '10000') {
    //         MessageBox('提示', '报名成功，请等待企业联系！');
    //       }else{
    //         MessageBox('提示', res.data.resDesc);
    //       }
    //     });
    //     this.$router.push({path:`/activityForm/${id}`});
    //   }else if (this.actinfo.formFlag === 2) {
    //     this.$router.push({path:`/activityForm/${id}`});
    //   }
    // },
    booking(){
      if (!this.token) {
        //  授权登录
        return false;
      }
      if (this.formType === 2 && this.actinfo.content.length !== 0) {  // 富文本+表单
        this.popupVisible = true;
      } else {
        // 直接预约接口
        this.submitForm();
      }
    },
    submitForm(content) {
      Indicator.open({
        text: '正在提交订单...',
        spinnerType: 'fading-circle'
      });
      setTimeout(() => {
        Indicator.close();
      }, 5000);
      const orderBody = {
        parkId: this.parkIdList[0],
        activityId: this.$route.params.activitiesDetalisId,
      }
      if (this.formType === 2) {
        // formId: this.formInfo.formId,
        orderBody.content = content;
      }
       this.$http.post(`${this.URL_PREFIX}/app/added/activity/order`,orderBody, {
        headers: { token: this.token, },
      })
       .then((response) => {
         const res = response.data;
        Indicator.close();
        if(res.resCode === '10000') {
          this.popupVisible = false;
          Toast({
            message: '提交订单成功！',
            iconClass: 'icon icon-success'
          });
          if (res.resData.orderFee && res.resData.orderFee !== 0) {
            window.location.href = `${this.URL_PREFIX_PAGE}/smark/pay/wechat?paymentId=${1}&wxTradeType=${2}&orderId=${res.resData.orderId}`;
          }
        }else{
          Toast(res.resDesc);
        }
      });
    },
    // getinfo2() {
    //   this.$http.post(`${this.URL_PREFIX}/app/get/activity/info/detail`,{
    //     activityId: Number(this.$route.params.activitiesDetalisId),
    //     parkId: Number(this.parkIdList[0]),
    //   }, {
    //     headers: { token: this.token, },
    //   }).then((res) =>{
    //     console.log(res);
    //     if(res.data.resCode === '10000') {
    //       this.actinfo = res.data.resData;
    //     }
    //   });
    // },
    getInfo() {  // 获取详情
      Indicator.open({
        text: '加载中...',
        spinnerType: 'fading-circle'
      });
      setTimeout(() => {
        Indicator.close();
      }, 5000);
      this.$http.post(`${this.URL_PREFIX}/app/get/activity/info/detail`, {
        parkId: this.parkIdList[0],
        activityId: this.$route.params.activitiesDetalisId,
      }, {
        headers: { token: this.token, },
      }).then((response) => {
        const res = response.data;
        Indicator.close();
        if (res.resCode === '10000') {
          console.log(res);
          this.actinfo = res.resData;
          this.formType = res.resData.formFlag;   // 如果不是纯文本
          if (res.resData.formFlag === 2) {   // 如果不是纯文本
            this.formInfo.itemList = res.resData.formItemList.length ? deepcopy(res.resData.formItemList) : [];
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
  },
  mounted() {
    this.getInfo();
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  updated() {
    const imgs = this.$refs.text.querySelectorAll('img');
    imgs.forEach((val) => {
      val.style.maxWidth = '100%';
    });
  },
}
</script>


<style lang="scss" scoped>
.header{
  color: rgb(51, 51, 51);
  height: 7.946667rem;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  .img_b{
    height: 5.626667rem;
    width: 100%;
    background-color: #fff;
    display: inline-block;
  }
  .headerCon{
    flex: 1;
    width: 100%;
    padding: .32rem;
    box-sizing: border-box;
    .actTitle{
      font-size: .453333rem;
      font-weight: bold;
      width: 9.513333rem;
    }
    .price{
      font-size: .4rem;
      color: rgb(217, 38, 44);
      font-weight: bold;
      margin-top: .266667rem;
    }
  }
}
.organizers{
  color: rgb(51, 51, 51);
  margin-top: .133333rem;
  padding: .266667rem .32rem;
  background-color: #fff;
  box-sizing: border-box;
  display: flex;
  .orgLogo{
    border-radius: 50%;
    width: 1.6rem;
    height: 1.6rem;
  }
  .organizersText{
    flex: 1;
    margin-left: .266667rem;
    // background-color: pink;
    box-sizing: border-box;
    .organizersName{
      font-size: .453333rem;
      display: inline-block;
      font-weight: bold;
      vertical-align: middle;
      width: 5.933333rem;
    }
    .annotation{
      display: inline-block;
      width: 1.2rem;
      line-height: .426667rem;
      border-radius: .216667rem;
      box-sizing: border-box;
      font-size: .266667rem;
      text-align: center;
      border: .026667rem solid rgb(208, 2, 27);
      color: rgb(208, 2, 27);
      vertical-align: middle;
      margin-left: .133333rem;
    }
    .organizersType{
      margin-top: .106667rem;
      font-size: .266667rem;
      color: rgb(102, 102, 102);
    }
    .organizersDescribe{
      margin-top: .106667rem;
      font-size: .32rem;
      color: rgb(102, 102, 102);
    }
  }
}
.actinfo{
  color: rgb(51, 51, 51);
  margin-top: .133333rem;
  .iconfont{
    margin-left: .373333rem;
    color: rgb(153, 153, 153);
  }
  .limTime{
    height: 1.333333rem;
    font-size: .4rem;
    background-color: #fff;
    line-height: 1.333333rem;
    border-bottom: .013333rem solid rgb(245, 245, 245);
  }
  .address{
    font-size: .4rem;
    background-color: #fff;
    padding: .32rem .373333rem;;
    border-bottom: .013333rem solid rgb(245, 245, 245);
    display: flex;
    align-items:center;
    i{
      display: inline-block;
      vertical-align: middle;
      margin-left: 0;
    }
    .addressText{
      display: inline-block;
      vertical-align: middle;
      margin-left: .1rem
    }
  }
  .places{
    font-size: .4rem;
    background-color: #fff;
    height: 1.333333rem;
    line-height: 1.333333rem;
  }
}
.content{
  background-color: #fff;
  margin-top: .133333rem;
  margin-bottom: 60px;
  .fuwu{
    padding: .36rem .32rem;
    box-sizing: border-box;
    border-bottom: .013333rem solid rgb(245, 245, 245);
  }
  .text{
    padding: .32rem;
  }
}
.submitbox{
  height: 1.32rem;
  background-color: rgb(235, 235, 235);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  .submit{
    width: 9.146667rem;
    height: 1.04rem;
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
