<template>
  <div class="submit">
    <!-- <mt-header title="结算" class="navheader">
      <mt-button icon="back" slot="left" @click='$router.push("/parkCompleteSet")' class="headerbtn"></mt-button>
      <div slot="right" @click='$router.push("/")'><i class="iconfont icon-shouye"></i></div>
    </mt-header> -->

    <navigator title="结算" :routePath='"/parkCompleteSet"'></navigator>

    <div class="no_address" @click='$router.push("/eleme/editAddress");' v-if='!address'>
      <i class='iconfont icon-jiagouwuche'></i>
      <span>添加收货地址</span>
    </div> 

     <div class="yes_address" v-else @click='$router.push("/eleme/editAddress");'>
      <p class='first'><span class="name">{{address.name}}</span><span class="phone">{{address.phone}}</span></p>
      <p>{{allAddress}}</p>
      <van-icon class='is_link' name="arrow" />
    </div> 

    <div class="seller_wrap">
      <div class="seller" v-for='(seller, index) in sellerIdList' :key='index' v-show='sellerFlag(seller.id)'>
        <p class="title">
          <img :src="seller.list[0].logoIcon">
          <span>{{seller.list[0].corpName}}</span>
        </p>
        <div class="list">
          <div class='item' v-for='(food, index2) in seller.list' :key='index2' v-show='food.count>0'>
            <div class="left">
              <img :src="food.picUrl">
            </div>
            <div class="right">
              <p class="title2">
                <span class="name">{{food.title}}</span>
                <span class="price">￥{{food.originalPrice/100 | PriceFilter}}</span>
              </p>
              <p class="desc">
                <span class="attr">{{food.attrNorm}}</span>
                <span class="num">×{{food.count}}</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>


    <mt-field label="备注" placeholder="请填写备注内容" v-model='remark'></mt-field>

    <mt-cell class='pay_method' title="支付方式"></mt-cell>

    <van-radio-group class='methods_list' v-model="payMethod">
      <van-cell-group>
        <van-cell v-for='(pay, index) in payMethods' :key='index'><van-radio :name="pay.value">
          <i class='iconfont' :class='pay.icon'></i><span>{{pay.label}}</span>
        </van-radio></van-cell>
      </van-cell-group>
    </van-radio-group>


    <div class='cart_wrap'>
      <div class="left">
        <p>
          <span class='num'>共{{num}}件,&nbsp;&nbsp;&nbsp;￥</span><span class='price'>{{price | PriceFilter}}</span>
        </p>
      </div>
      <div class="right">
        <van-button class='submit' text='提交订单' :disabled="!address" @click='submitOrder'/>
      </div>
    </div>



  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import deepcopy from '@/utils/deepcopy';
import { Toast } from 'vant';

export default {
  data() {
    return {
      user: {},
      remark: '',
      payMethod: 1,
      sellerIdList: [],

      payMethods: [
        { value: 1, label: '微信支付', icon: 'icon-weixinzhifu', },
        // { value: 2, label: '支付宝', icon: 'icon-weixinzhifu', },
      ],
      duration: 1500,
    };
  },
  methods: {
    ...mapMutations(['change_cartList', 'change_track']),
    // 获取用户信息
    getUserInfo() {
      this.$http.post(`${this.URL_PREFIX}/app/get/user/info/detail`, {}, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.user = res.resData;
        } else {
          this.change_track({ activeOuter: 9, activeInner: 0, });
        }
      });
    },
    dealCart() {
      // 将商家添加到list
      this.cartList.forEach((food) => {
        this.sellerIdList.push(food.corpId);
      });
      
      // 去重
      this.sellerIdList =  Array.from(new Set(this.sellerIdList));

      // 商家列表
      this.sellerIdList.forEach((item, index) => {
        const seller = {
          id: item,
          list: [],
        }
        this.sellerIdList[index] = seller;
      });

      this.sellerIdList.forEach((seller) => {
        this.cartList.forEach((food) => {
          if (seller.id === food.corpId) {
            const obj = deepcopy(food);
            seller.list.push(obj);
          }
        });
      });
    },

    // 是否显示商家
    sellerFlag(id) {
      const list = this.cartList.filter((food) => {
        return food.corpId === id;
      });

      const index = list.findIndex((food) => {
        return food.count > 0;
      });
      return index !== -1;
    },

    // 提交订单
    submitOrder() {
      const list = [];
      this.cartList.forEach((food) => {
        const obj = {
          foodId: food.foodId,
          num: food.count,
          price: this.isVip ? food.discountPrice : food.originalPrice,
        };
        if (food.count > 0) {
          list.push(obj);
        }
      });
      const orderMsg = {
        userName: this.address.name,
        userMobile: this.address.phone,
        address: this.allAddress,
        num: this.num,
        price: this.price * 100,
        remark: this.remark,
        orderList: list,
      };

      Object.keys(orderMsg).forEach((key) => {
        if (!orderMsg[key]) {
          delete orderMsg[key];
        }
      });

      this.$http.post(`${this.URL_PREFIX}/app/added/food/order`, {
        parkId: this.parkIdList[0],
        ...orderMsg,
      }, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.clearCart();
          const orderId = res.resData.orderId.length === 1 ? res.resData.orderId[0] : res.resData.bindSn;
          const isSingle = res.resData.orderId.length === 1;
          this.toPay(orderId, isSingle);
        } else {
          Toast.fail({ duration: this.duration, message:  res.resDesc});
        }
      });
    },


    toPay(orderId, isSingle) {
      const params = {
        paymentId: this.payMethod,
        wxTradeType: 2,
      };
      if (isSingle) {
        this.$set(params, 'orderId', orderId);
        window.location.href = `${this.URL_PREFIX_PAGE}/smark/pay/wechat?paymentId=${this.payMethod}&wxTradeType=${2}&orderId=${orderId}`;
      } else {
        this.$set(params, 'bindSN', orderId);
        window.location.href = `${this.URL_PREFIX_PAGE}/smark/pay/wechat?paymentId=${this.payMethod}&wxTradeType=${2}&bindSN=${orderId}`;
      }
      // this.$router.push({ path: '/smark/pay/wechat', query: { ...params } });
    },

    // 清空购物车
    clearCart() {
      this.cartList.forEach((food) => {
        food.count = 0;
      });
      this.change_cartList();
    },
  },
  computed: {
    ...mapGetters(['token', 'cartList', 'address', 'parkIdList']),
    // 是否享受优惠价
    isVip() {
      // 当前园区普通用户
      if (this.user.attachParkId === this.parkIdList[0]) {
        return true;
      }
      // 园区管理员
      if (this.user.bindParkInfo && this.user.bindParkInfo.length) {
        this.user.bindParkInfo.forEach((park) => {
          if (park.parkId === this.parkIdList[0]) {
            return true;
          }
        });
      }
      // 当前园区企业管理员
      if (this.user.bindCorpInfo && this.user.bindCorpInfo.parkId === this.parkIdList[0]) {
        return true;
      }
      return false;
    },
    num() {
      let temp = 0;
      this.cartList.forEach((food) => {
        temp += food.count;
      });
      return temp;
    },
    price() {
      let temp = 0;
      this.cartList.forEach((food) => {
        if (food.count > 0) {
          if (this.isVip) {
            temp += food.discountPrice/100 * food.count;
          } else {
            temp += food.originalPrice/100 * food.count;
          }
        }
      });
      return temp;
    },
    allAddress() {
      return `${this.address.provinceName}${this.address.cityName}${this.address.countyName}${this.address.details}`;
    },
  },
  created() {
    this.dealCart();
    if (!this.token) {
      this.$root.eventHub.$emit('login', this.$route.path);
    } else {
      this.getUserInfo();
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.submit{
  padding-bottom: 1.6rem;
  background: rgb(245, 245, 245);
  .no_address{
    margin-bottom: .133333rem;
    background: #fff;
    height: 2.666667rem;
    line-height: 2.666667rem;
    text-align: center;
    font-size: .453333rem;
    color: rgb(102, 102, 102);
  }
  .yes_address{
    position: relative;
    padding-top: .56rem;
    box-sizing: border-box;
    margin-bottom: .133333rem;
    background: #fff;
    height: 2.666667rem;
    font-size: .453333rem;
    color: rgb(102, 102, 102);
    font-weight: 600;
    p{
      padding-left: .32rem;
      line-height: .8rem;
    }
    .is_link{
      position: absolute;
      right: .266667rem;
      top: 1.173333rem;
    }
  }

  .seller_wrap{
    .seller{
      margin-bottom: .133333rem;
      background:#fff;
      .title{
        margin-bottom: .013333rem;
        padding: 0 .266667rem;
        height: 1.173333rem;
        line-height: 1.173333rem;
        border-bottom: .013333rem solid rgb(245, 245, 245);
        img, span{
          display: inline-block;
          vertical-align: middle;
        }
        img{
          width: .8rem;
          height: .8rem;
          border-radius: 50%;
          margin-right: .24rem;
        }
        span{
          font-size: .453333rem;
          color: rgb(51, 51, 51);
          font-weight: 600;
        }
      }
      .list{
        padding: 0 .266667rem;
        .item{
          display: flex;
          padding: .266667rem 0;
          border-bottom: .013333rem solid rgb(245, 245, 245);
          .left{
            flex: 0 0 2.133333rem;
            width: 2.133333rem;
            height: 1.6rem;
            img{
              display: inline-block;
              width: 100%;
              height: 100%;
              vertical-align: top;
            }
          }
          .right{
            flex: 1 1 auto;
            padding-left: .213333rem;
            font-size: .32rem;
            .title2{
              line-height: .586667rem;
              @include clear-float;
              span{
                display: inline-block;
                vertical-align: middle;
              }
              .name{
                float: left;
                font-size: .453333rem;
                font-weight: 600;
                @include line-ellipsis;
                max-width: 5.066667rem;
              }
              .price{
                float: right;
                color: $color-main;
              }
            }
            .desc{
              margin-top: .08rem;
              line-height: .586667rem;
              @include clear-float;
              span{
                display: inline-block;
                vertical-align: middle;
              }
              .attr{
                float: left;
              }
              .num{
                float:right;
              }
            }
          }
        }
      }
    }
  }

  .mint-field{
    margin-bottom: .026667rem;
    height: 1.173333rem;
    line-height: 88px;
    font-size: .4rem;
    color: rgb(67, 67, 67);
  }

  .pay_method{
    font-weight: 600;
    font-size: .453333rem;
    color: rgb(51, 51, 51);
  }

  .cart_wrap{
    position: fixed;
    display: flex;
    left: 0;
    bottom: 0;
    height: 1.2rem;
    width: 100%;
    color: #fff;
    .left{
      padding-left: .32rem;
      height: 100%;
      flex: 1 1 auto;
      background: #131d26;
      line-height: 1.2rem;
      p{
        margin-top: .266667rem;
        line-height: .64rem;
        span{
          font-size: .453333rem;
        }
        .num{
          font-size: .32rem;
        }
      }
    }
    .right{
      flex: 0 0 3.066667rem;
      height: 100%;
      .submit{
        width: 100%;
        height: 100%;
        border: none;
        background: $color-main;
        border-radius: 0;
        font-size: .453333rem;
        color: #fff;
        &.van-button--disabled{
          background: #2b343b;
        }
      }
    }
  }


  .navheader{
    height: 1.173333rem;
    font-weight: bold;
    font-size: .453333rem;
    text-align: center;
    background-color: #fff;
    color: rgb(55, 55, 55);
    border-bottom: 1px solid rgb(246, 246, 246);
    .iconfont{
      color: #666666;
    }
    .headerbtn{
      color: rgb(51, 51, 51);
    }
  }
}
</style>


