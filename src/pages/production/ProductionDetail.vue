<template>
  <div class='detail'>
    <navigator title="产品路演详情"></navigator>
    <item :info='production'></item>

    <mt-cell :title="production.productName"></mt-cell>

    <div class='text' ref='text' v-html='production.productContent'></div>

    <div class='footer'>
      <mt-button @click.native='apply'>联系企业</mt-button>
    </div>

    <van-dialog v-model="applyFlag" title='附言' show-cancel-button @cancel='cancel' @confirm='confirm'>
      <van-field v-model="applyMsg" label="附言" placeholder="请输入附言"/>
    </van-dialog>

  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Item from './child/Item';
import { Toast } from 'vant';

export default {
  data() {
    return {
      productionId: '',
      production: {},
      
      errorMsg: '申请成功，等待企业与您联系！',
      duration: 2000,
      position: '',
      applyFlag: false,
      applyMsg: '',
    };
  },
  methods: {
    // http
    getDetail() {
      this.$http.post(`${this.URL_PREFIX}/app/get/products/roadshow/detail`, {
        productId: this.productionId,
      }, {
        headers: { token: this.token, }
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.production = res.resData;
        }
      });
    },
    // apply
    apply() {
      if (!this.token) {
        this.$root.eventHub.$emit('login', this.$route.path);
      } else {
        this.applyFlag = true;
      }
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
      this.submitRequest();
    },
    submitRequest() {
      this.$http.post(`${this.URL_PREFIX}/app/added/products/roadshow/order`, {
        parkId: this.parkIdList[0],
        remark: this.applyMsg,
        productId: this.productionId,
      }, {
        headers: { token: this.token, }
      }).then((response) => {
        const res = response.data;
        this.applyMsg = '';
        if (res.resCode !== '10000') {
          this.errorMsg = res.resDesc;
          Toast.fail({ duration: this.duration, message:  this.errorMsg});
        } else {
          this.errorMsg = '申请成功，等待企业与您联系！';
          Toast.success({ duration: this.duration, message:  this.errorMsg});
        }
      });
    },
  },
  components: {
    Item,
  },
  updated() {
    const ImgArr = this.$refs.text.querySelectorAll('.text img');
    ImgArr.forEach((item) => {
      item.style.maxWidth = '100%';
    });
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  created() {
    this.productionId = this.$route.params.productionId;
    this.getDetail();
  },
};
</script>

<style lang="scss" scoped>
@import "~@scss";
.detail {
  .mint-cell{
    margin-bottom: .026667rem;
    font-size: .453333rem;
    color: rgb(51, 51, 51);
    font-weight: 600;
  }

  .text{
    padding: .32rem;
    background: #fff;
  }

  .footer{
    padding: .106667rem .426667rem;
    margin-top: .4rem;
    box-sizing: border-box;
    width: 100%;
    .mint-button{
      width: 100%;
      height: 1.04rem;
      background: $color-main;
      color: #fff;
      font-size: .48rem;
    }
  }
}
</style>
