<template>
<div class='container'>
  <div class="cart">
    <div class="left">
       <div class='logo_wrap' @click="fold=!fold"> 
        <div class="logo" :class='{ "highlight": num>0 }'>
          <van-icon name="cart" class='cart_logo':class='{ "highlight": num>0 }'/>
        </div>
        <div class="num" v-show='num > 0'>{{num}}</div>
       </div>

       <div class="price" v-show='num > 0'>￥{{price | PriceFilter}}元</div>
    </div>
    <div class="right">
      <van-button class='toCart' block :class='{ "highlight": num>0 }' @click='submitOrder'>去结算</van-button>
    </div>

    <!-- 飞行的小球 -->
    <div class="ball-wrapper">
      <transition @before-enter="beforeEnter" @enter="enter" @after-enter="afterEnter">
        <div class="ball" v-show="ball.status">
          <div class="inner" ref="inner"></div>
        </div>
      </transition>
    </div>
  </div>

  <transition name='list'>
    <div class="cart-list" v-show="cartListShowFlag">
      <div class="header">
        <span class='title clear'>购物车</span>
        <span class='removeAll clear' @click='removeAll'>清空</span>
      </div>
      <div class="list-content" ref='listContent'>
        <ul>
          <li class="list-food" v-if='food.count > 0' v-for="(food, index) in cartList" :key='index'>
            <h3 class="food-name">{{food.title}}</h3>
            <div class="price-wrapper">￥<span class="price">{{food.originalPrice/100 * food.count | PriceFilter}}</span></div>
            <div class="cart-control-wrapper">
              <CartControl class='cart_control_self' :food="food" :from='from'></CartControl>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </transition>

  <transition name='bg'>
    <div class="bg" v-show='cartListShowFlag' @click='changeFold'></div>
  </transition>
</div>
</template>

<script>
import BScroll from 'better-scroll';
import CartControl from './CartControl';
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      ball: {
        status: false,
      },
      fold: true,
      from: 'cart',
      user: {},
    };
  },
  methods: {
    ...mapMutations(['change_token', 'change_cartList', 'change_track', 'change_curPath']),
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

    drop (target) {
      if (!this.ball.status) {
        this.ball.status = true;
        this.ball.el = target;
      }
    },
    beforeEnter (el) {
      let inner = this.$refs.inner;
      if (this.ball.status) {
        let x = this.ball.el.getBoundingClientRect().left - 32;
        let y = window.innerHeight - this.ball.el.getBoundingClientRect().top - 22 - 16 - 12;
        el.style.transform = `translate3d(${x}px, 0, 0)`;
        inner.style.transform = `translate3d(0, -${y}px, 0)`;
      }
    },
    enter (el) {
      /* eslint-disable no-unused-vars */
      let rf = el.offsetHeight;
      let inner = this.$refs.inner;
      this.$nextTick(function () {
        el.style.transform = 'translate3d(0, 0, 0)';
        inner.style.transform = `translate3d(0, 0, 0)`;
      });
    },
    afterEnter (el) {
      if (this.ball.status) {
        this.ball.status = false;
        el.style.display = 'none';
      }
    },

    _initScroll () {
      this.listContent = new BScroll(this.$refs.listContent, {
        click: true
      });
    },

    removeAll () {
      this.cartList.forEach((food) => {
        food.count = 0;
        this.$root.eventHub.$emit('updateFood', food.foodId, 0);
      });
      this.change_cartList([]);
      this.fold = true;
    },
    changeFold () {
      this.fold = true;
    },

    submitOrder() {
      this.change_track({ activeOuter: 9, activeInner: 0, });
      this.removeZero();
    },
    removeZero() {
      const newList = this.cartList.filter((food) => {
        return food.count > 0;
      });
      this.change_cartList(newList);
      this.$router.push({path: '/submitOrder',});
    },
  },
  computed: {
    ...mapGetters(['cartList', 'parkIdList', 'token']),
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
    cartListShowFlag () {
      if (this.fold) {
        return;
      }
      this.$nextTick(() => {
        if (!this.listContent) {
          this._initScroll();
        } else {
          this.listContent.refresh();
        }
      });
      return !this.fold && this.num;
    },
  },

  watch: {
    cartList: {
      deep: true,
      handler() {
        if (!this.cartList.length) {
          this.fold = true;
        }
      },
    },
  },

  components: { CartControl },

  mounted() {
    this.$root.eventHub.$on('cartToCart', (target) => {
      this.drop(target);
    });
    if (!this.token) {
      this.change_track({ activeOuter: 9, activeInner: 0, });
      this.$root.eventHub.$emit('login', this.$route.path);
    } else {
      this.getUserInfo();
    }
  },
};
</script>


<style lang="scss" scoped>
@import '~@scss';
.container{
  height: 100%;
  width: 100%;
  .cart{
    display: flex;
    position: absolute;
    z-index: 43;
    width: 100%;
    height: 100%;
    .left{
      flex: 1 1 auto;
      padding-left: .346667rem;
      background: #131d26;
      color: #fff;
      height: 100%;
      .logo_wrap{
        position: relative;
        padding: .133333rem;
        box-sizing: border-box;
        display: inline-block;
        height: 1.2rem;
        .logo{
          width: .933333rem;
          height: .933333rem;
          border-radius: 50%;
          text-align: center;
          line-height: .933333rem;
          background: #2b343c;
          &.highlight{
            background: #00a0dc;
          }
          .cart_logo{
            display: inline-block;
            vertical-align: middle;
            font-size: .4rem;
            &.highlight{
              color: rgb(255, 255, 255)
            }
          }
        }
        .num{
          position: absolute;
          right: 0;
          top: 0;
          width: .453333rem;
          height: .453333rem;
          line-height: .453333rem;
          border-radius: 50%;
          text-align: center;
          font-size: .266667rem;
          font-weight: 700;
          color: rgb(255, 255, 255);
          background: rgb(240, 20, 20);
        }
      }
      .price{
        display: inline-block;
        margin-left: .48rem;
        font-size: .4rem;
      }
    }
    .right{
      flex: 0 0 3.066667rem;
      width: 3.066667rem;
      .toCart{
        height: 100%;
        background: #2b343b;
        color: #fff;
        border-radius: 0;
        border: none;
        font-size: .453333rem;
        &.highlight{
          background: $color-main;
        }
      }
    }

    .ball-wrapper{
      .ball{
        position: fixed;
        left: .613333rem;
        bottom: .506667rem;
        transition: transform .5s;
        .inner{
          width: .4rem;
          height: .4rem;
          background: $color-main;
          border-radius: 50%;
          transition: all .5s cubic-bezier(.49, -0.29, .75, .41);
        }
      }
    }
  }

  // 购物车详情
  .cart-list{
    position: fixed;
    bottom: 1.2rem;
    left: 0;
    z-index: 41;
    width: 100%;
    .header{
      height: 1.066667rem;
      line-height: 1.066667rem;
      padding: 0 .48rem;
      border-bottom: .053333rem solid rgba(7, 17, 27, 0.1);
      background: #f3f5f7;
      .title{
        float: left;
        font-size: .373333rem;
        font-weight: 500;
        color: rgb(7, 17, 27);
      }
      .removeAll{
        float: right;
        font-size: .32rem;
        color: rgb(0, 160, 220);
      }
    }
    .list-content{
      padding: 0 10px;
      max-height: 6.4rem;
      overflow: hidden;
      background: #fff;
      .list-food{
        display: flex;
        padding: .133333rem 0;
        font-size: .32rem;
        height: .96rem;
        line-height: .96rem;
        border-bottom: .013333rem solid (rgba(7, 17, 27, 0.1));
        .food-name{
          flex: 1 1 auto;
          @include line-ellipsis;
          font-size: .4rem;
          color: rgb(51, 51, 51);
        }
        .price-wrapper{
          margin-left: .32rem;          
          flex: 0 0 1.333333rem;
          width: 1.333333rem;
          font-size: .266667rem;
          color: rgb(240, 20, 20);
          .price{
            font-size: .373333rem;
            font-weight: 700;
          }
        }
        .cart-control-wrapper{
          flex: 0 0 2.133333rem;
          width: 2.133333rem;
          text-align: right;
          .cart_control_self{
            display: inline-block;
            height: .666667rem;
            line-height: .666667rem;
            vertical-align: middle;
          }
        }
      }
    }
  }


  .list-enter-active, .list-leave-active{
    transition: all 0.5s linear;
  }
  .list-enter-to, .list-leave{
    transform: translate3d(0, 0, 0);
  }
  .list-enter, .list-leave-to{
    transform: translate3d(0, 100%, 0);
  }
  .bg{
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: 40;
    background: rgba(7, 17, 27, 0.6);
    backdrop-filter: blur(10px);
  }
  .bg-leave-active, .bg-enter-active{
    transition: all 0.5s;
  }
  .bg-enter, .bg-leave-to{
    opacity: 0;
  }
  .bg-enter-to{
    opacity: 1;
  }
}
</style>


