<template>
  <div class="OfficeAppointment">
    <Navigator title="商务服务平台"></Navigator>
    <div class="content">
      <mt-field label="预定日期" placeholder="请选择日期" type="date" v-model="doDate" class="reservationDate"  @blur.native.capture="getList"></mt-field>
      <div class="timeTitle">预定时段</div>
      <mt-checklist  v-model="alreadySelectData" :options="selectData" align="right" class="reservation"></mt-checklist>
      <div class="timeTitle">附言</div>
      <mt-field placeholder="请填写附言" type="textarea" rows="4" v-model="introduction"></mt-field>
      <mt-field label="申请人" placeholder="请输入申请人" v-model="username"></mt-field>
      <mt-field label="联系电话" placeholder="请输入联系电话" v-model="mobPhone"></mt-field>
    </div>
    <div class="foot">
      <p class="price">合计： ￥ <span class="priceNum">{{ roomFee / 100 | PriceFilter}}</span></p>
      <span class="payBtn" @click="submitOrder">去结算</span>
    </div>
  </div>
</template>
<script>
import { Field } from 'mint-ui';
import { Checklist, Toast, MessageBox, } from 'mint-ui';
import { mapGetters, mapMutations } from 'vuex';
import { jsTimestampFilter } from '@/utils/filters.js';

export default {
  data() {
    return{
      doDate: jsTimestampFilter(new Date().getTime()), // 预定日期
      selectData: [], // 时段
      alreadySelectData: [], // 已选时段的值
      introduction: '', // 附言
      username: '', // 申请人
      mobPhone: '', // 联系电话
    };
  },
  methods: {
    getList() { // 获取时间段
      this.$http.post(`${this.URL_PREFIX}/app/get/meeting/room/scheduling/list`, {
        date: this.doDate,
        roomId: this.$route.params.officeAppointmentId,
        parkId: this.parkIdList[0],
      }).then((response) => {
        console.log(response);
        const res = response.data;
        if (res.resCode === '10000') {
          const BookingTimeList = [];
          if (JSON.stringify(res.resData) == '{}'){ 
            res.resData = [];
          }
          res.resData.forEach((val) => {
            // 时间戳转换yyyy-MM-dd hh:mm格式
            let beginTime = jsTimestampFilter(val.beginTime, 'yyyy-MM-dd hh:mm');
            let endTime = jsTimestampFilter(val.endTime, 'yyyy-MM-dd hh:mm');
             // 切割后面的时间段
            beginTime = beginTime.split(' ')[1];
            endTime = endTime.split(' ')[1];
            BookingTimeList.push({
              label: `${beginTime} - ${endTime}   ${val.roomFee / 100} 元    ${val.orderId === undefined ? '' : '    被预定'}`,
              price: val.roomFee,
              value: val.schedulingId,
              disabled: val.orderId === undefined ? false : true,
            })
          });
          this.selectData = BookingTimeList;
        }
      });
    },
    submitOrder() {  // 提交表单 
      if (this.alreadySelectData.length === 0) {
        Toast('请选择排班');
        return;
      }
      if (this.username === '') {
        Toast('请填写申请人');
        return;
      }
      if (this.mobPhone === '') {
        Toast('请填写联系电话');
        return;
      }
      if(!/^1[3|4|5|7|8|9][0-9]\d{8}$/.test(this.mobPhone)) {
        Toast('请填写正确的联系电话');
        return;
      }
      let orderList = [];
      switch (this.alreadySelectData.length) {
        case 1:
          const obj = this.selectData.find((val) => {
            return val.value === this.alreadySelectData[0];
          })
          orderList.push({
            roomFee: obj.price,
            roomId: this.$route.params.officeAppointmentId,
            schedulingId: obj.value,
          })
        break;
        default:
          this.selectData.forEach((val) => {
            this.alreadySelectData.forEach((val2) => {
              if (val.value === val2) {
                orderList.push({
                  roomFee: val.price,
                  roomId: this.$route.params.officeAppointmentId,
                  schedulingId: val2,
                });
              }
            });
          });
        break;
      }
      this.$http.post(`${this.URL_PREFIX}/app/added/meeting/room/order`, {
        parkId: this.parkIdList[0],
        userName: this.username,
        userMobile: this.mobPhone,
        remark: this.introduction,
        roomFee: this.roomFee,
        orderList: orderList,
        serviceId: this.$route.params.serviceId,
      },{
        headers: { token: this.token, },
      }).then((response) => {
        console.log(response);
        const res = response.data;
        if (res.resCode === '10000') {
          // this.$router.push({ path: `/personal/orderList`});
          if (res.resData.orderFee && res.resData.orderFee !== 0) {
            window.location.href = `${this.URL_PREFIX_PAGE}/smark/pay/wechat?paymentId=${1}&wxTradeType=${2}&orderId=${res.resData.orderId}`;
          }
          // window.location.href = `${this.URL_PREFIX_PAGE}/smark/pay/wechat?paymentId=${1}&wxTradeType=${2}&orderId=${this.orderInfo.orderId}`;
        }else{
          MessageBox('提示', res.resDesc);
        }
      });
    },
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
    roomFee() {
      let sum = 0;
      switch (this.alreadySelectData.length) {
        case 0:
          return sum;
        case 1:
          const obj = this.selectData.find((val) => {
            return val.value === this.alreadySelectData[0];
          })
          return obj.price;
        default:
          this.selectData.forEach((val) => {
            this.alreadySelectData.forEach((val2) => {
              if (val.value === val2) {
                sum += val.price;
              }
            })
          });
        return sum;
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.OfficeAppointment{
  position: relative;
  .content{
  margin-top: .133333rem;
  margin-bottom: 60px;
  background-color: #fff;
  .timeTitle{
    height: 1.066667rem;
    font-size: .4rem;
    line-height: 1.066667rem;
    margin-left: .253333rem;
  }
}
.foot{
  position: fixed;
  bottom: 0;
  background-color: rgb(51, 51, 51);
  color: #fff;
  width: 100%;
  height: 1.173333rem;
  line-height: 1.173333rem;
  p{
    display: inline-block;
    margin-left: .32rem;
  }
  .payBtn{
    background-color: rgb(217, 38, 44);
    height: 1.173333rem;
    width: 3.066667rem;
    float: right;
    text-align: center;
    line-height: 1.173333rem;
  }
}
}
</style>
