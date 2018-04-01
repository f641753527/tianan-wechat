<template>
  <div class='card'>
    <navigator class='header' :title="title"></navigator>

    <mt-field label="姓名" placeholder="请输入姓名" v-model="userCard.name" :state='errStateList.name'></mt-field>

    <mt-field label="手机" placeholder="请输入手机" v-model="userCard.phone" :state='errStateList.phone'></mt-field>

     <mt-field label="职位" v-model="userCard.position"></mt-field>

    <mt-field label="企业名称" v-model="userCard.corpName" :state='errStateList.corpName'></mt-field>

    <mt-field label="地址"  v-model="userCard.address" :state='errStateList.address'></mt-field>

    <mt-field label="座机" v-model="userCard.tel"></mt-field>

    <mt-field label="邮箱" v-model="userCard.email"></mt-field>

    <!-- 错误提示 -->
    <mt-popup v-model="errorFlag" position="top" :modal='false' popup-transition="popup-fade"> {{errMsg}} </mt-popup>

    <div class='footer'>
      <mt-button @click.native='edit'>保存</mt-button>
    </div>

  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { Toast } from 'vant';

export default {
  data() {
    return {
      title: '编辑名片',
      userCard: {
        name: '',
        phone: '',
        position: '',
        corpName: '',
        address: '',
        tel: '',
        email: '',
      },
      errorFlag: false,
      errMsg: '',
      duration: 2000,
      errStateList: {
        name: '',
        phone: '',
        corpName: '',
        address: '',
      },
    };
  },
  methods: {
    getUserCard() {
      this.$http.post(`${this.URL_PREFIX}/app/get/user/info/detail`, {}, {
        headers: {
          token: this.token,
        },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.userCard = res.resData.userCardInfo;
        }
      });
    },

    edit() {
      if (!this.userCard.name) {
        this.errorFlag = true;
        this.errMsg = '姓名不能为空';
        this.errStateList.name = 'error';
        setTimeout(() => {
          this.errorFlag = false;
        }, this.duration);
        return;
      }
      if (!this.userCard.phone) {
        this.errorFlag = true;
        this.errMsg = '手机号不能为空';
        this.errStateList.phone = 'error';
        setTimeout(() => {
          this.errorFlag = false;
        }, this.duration);
        return;
      }
      if (!this.userCard.corpName) {
        this.errorFlag = true;
        this.errMsg = '企业名称不能为空';
        this.errStateList.corpName = 'error';
        setTimeout(() => {
          this.errorFlag = false;
        }, this.duration);
        return;
      }
      if (!this.userCard.address) {
        this.errorFlag = true;
        this.errMsg = '企业名称不能为空';
        this.errStateList.address = 'error';
        setTimeout(() => {
          this.errorFlag = false;
        }, this.duration);
        return;
      }

      this.modifyHttp();
    },
    modifyHttp() {
      this.$http.post(`${this.URL_PREFIX}/app/modify/user/card/info`, {
        ...this.userCard,
      }, {
        headers: { token: this.token }
      }).then((response) => {
        const res = response.data;
        const errorMsg = res.resDesc;
        if (res.resCode === '10000') {
          Toast.success({ duration: this.duration, message:  '名片修改成功'});
        } else {
          Toast.fail({ duration: this.duration, message:  errorMsg});
        }
      });
    },
  },
  watch: {
    userCard: {
      deep: true,
      handler() {
        if (this.userCard.name) {
          this.errStateList.name = '';
        }
        if (this.userCard.phone) {
          this.errStateList.phone = '';
        }
        if (this.userCard.corpName) {
          this.errStateList.corpName = '';
        }
        if (this.userCard.address) {
          this.errStateList.address = '';
        }
      },
    },
  },
  computed: {
    ...mapGetters(['token']),
  },
  created() {
    if (!this.token) {
      this.$root.eventHub.$emit('login', this.$route.path);
    } else {
      this.getUserCard();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.card{
  position: relative;
  height: 100%;
  .header{
    margin-bottom: .133333rem;
  }
  .mint-field{
    margin-bottom: .026667rem;
    height: 1.173333rem;
    line-height: 88px;
    font-size: .4rem;
    color: rgb(67, 67, 67);
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

.mint-popup{
  padding: .266667rem;
  box-sizing: border-box;
  width: 100%;
  text-align: center;
  font-size: .4rem;
  color: #fff;
  background: rgba(0, 0, 0, 0.6);
}
</style>