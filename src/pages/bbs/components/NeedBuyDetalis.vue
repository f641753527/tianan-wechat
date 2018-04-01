<template>
  <div class="NeedBuyDetalis">
    <navigator title="信息交互平台"></navigator>
    <div class="bigBox">
      <div class="boxHeader">
        <img :src="DetalisInfo.banner" alt="" class="img_b">
        <div class="HeaderText">
          <p class="title">{{DetalisInfo.serviceName}}</p>
          <p class="price">{{DetalisInfo.price}}</p>
          <!-- <p class="beginTime">开始时间：{{DetalisInfo.}}</p> -->
          <p class="endTime">结束时间：{{DetalisInfo.endTime | DateFilter}}</p>
        </div>
      </div>
      <div class="boxContent">
        <p class="typeDesc">类型描述：{{DetalisInfo.typeDesc}}</p>
        <p class="address">送货地址或服务地址：{{DetalisInfo.address}}</p>
      </div>
    </div>
    <div class="text m_b" v-html="DetalisInfo.content" ref="text"></div>

    <div class="submit positionfixDowm">
      <div class="submitBtn" @click="apply">联系企业</div>
    </div>

    <van-dialog v-model="applyFlag" title='附言' show-cancel-button @cancel='cancel' @confirm='confirm'>
      <van-field v-model="applyMsg" label="附言" placeholder="请输入附言"/>
    </van-dialog>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';
import { Toast } from 'vant';

export default {
  data() {
    return{
      DetalisInfo: {},
      remark: 'remark',
      duration: 2000,
      applyFlag: false,
      applyMsg: '',
      errorMsg: '申请成功，等待企业与您联系！',
    };
  },
  methods: {
    getInfo() {
      this.$http.post(`${this.URL_PREFIX}/app/get/ask/service/detail`, {
        serviceId: this.$route.params.needBuyDetalisId,
      }).then((res) => {
        if(res.data.resCode === '10000') {
          this.DetalisInfo = res.data.resData;
        }
      });
    },
    apply() {
      this.applyFlag = true;
    },
    cancel() {
      this.applyMsg = '';
    },
    confirm() {
      if (!this.applyMsg) {
        this.errorMsg = '请填写附言'
        Toast.fail({ duration: this.duration, message:  this.errorMsg});
        this.applyFlag = true;
        return;
      }
      this.submit();
    },
    submit() {
      this.$http.post(`${this.URL_PREFIX}/app/added/ask/service/order`, {
        parkId: this.parkIdList[0],
        remark: this.applyMsg,
        serviceId: this.$route.params.needBuyDetalisId,
      },{
        headers: { token: this.token },
      }).then((res) => {
        this.applyMsg = '';
        if (res.data.resCode !== '10000') {
          this.errorMsg = res.data.resDesc;
          Toast.fail({ duration: this.duration, message:  this.errorMsg});
        } else {
          this.errorMsg = '申请成功，等待企业与您联系！';
          Toast.success({ duration: this.duration, message:  this.errorMsg});
        }
      });
    },
  },
  created() {
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
.bigBox{
  background-color: #fff;
  .boxHeader{
    padding: .333333rem;
    .img_b{
      width: 2.4rem;
      height: 2.4rem;
      vertical-align: middle;
    }
    .HeaderText{
      display: inline-block;
      margin-left: .266667rem;
      vertical-align: middle;
      width: 6.5rem;
      .title{
        font-size: .453333rem;
        font-weight: bold;
        margin-bottom: .2rem;
      }
      .price{
        color:rgb(217, 38, 44); 
        font-size: .4rem;
        margin-bottom: .133333rem;
      }
      .beginTime{
        margin-bottom: .133333rem;
        font-size: .32rem;
        color: rgb(102, 102, 102);
      }
      .endTime{
        margin-bottom: .133333rem;
        font-size: .32rem;
        color: rgb(102, 102, 102);
      }
    }
  }
  .boxContent{
    padding: .333333rem;
    background-color: #fff;
    border-top: 1px solid rgb(245, 245, 245);
    p{
      margin-bottom: .133333rem;
      font-size: .32rem;
      color: rgb(102, 102, 102);
    }
  }
}
.text{
  padding: .333333rem;
  margin-top: .133333rem;
  background-color: #fff;
}
.submit{
  height: 1.32rem;
  text-align: center;
  line-height: 1.32rem;
  width: 100%;
  background-color: rgb(245, 245, 245);
  .submitBtn{
    width: 9.146667rem;
    height: 1.04rem;
    color: #fff;
    background-color: rgb(217, 38, 44);
    border-radius: .133333rem;
    line-height: 1.04rem;
    text-align: center;
    display: inline-block;
  }
}
</style>
