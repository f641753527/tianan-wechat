<template>
  <div class='food'>
    <div v-for="(item, index) in info.orderServiceList" :key="index">
      <div class="detail">
        <div class="avatar"><img :src="item.picUrl" /></div>
          <div class="right_detail">
            <p class="title">{{item.title}}</p>
            <p class="attr">{{item.attrNorm}}</p>
            <p class="price"><span class="priceNum">￥ {{item.price / 100 | PriceFilter}} 元 </span><span class="Number">× {{item.num}}</span></p>
          </div>
      </div>
      <div class="addressBox">
        <div class="addressTitle">个人信息/地址</div>
        <div class="addressItemBox">
          <p class="userName"> {{item.userName}}</p>
          <p class="address"> {{item.address}}</p>
        </div>
      </div>
    </div>
    <div class="remark">
      <div class="remarkTitle">附言</div>
      <mt-field  type="textarea" rows="4" v-model="info.remark" readonly class="remarkText"></mt-field>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  props: {
    info: {
      type: Object,
      default() {
        return {};
      },
    },
  },
};
</script>

<style lang="scss" scoped>
.food{
  padding-bottom: .32rem;
  .header{
    margin-bottom: .026667rem;
    padding: 0 .266667rem;
    height: 1.146667rem;
    line-height: 1.146667rem;
    background: #fff;
    img{
      margin-right: .213333rem;
      display: inline-block;
      vertical-align: middle;
      width: .8rem;
      height: .8rem;
      border-radius: 50%;
      border: none;
      outline: none;
    }
    span{
      display: inline-block;
      vertical-align: middle;
      line-height: .64rem;
      font-size: .453333rem;
      color: rgb(51, 51, 51);
      font-weight: 500;
    }
  }
  .detail{
    padding: .266667rem;
    background: #fff;
    display: flex;
    border-radius: .133333rem;
    .avatar{
      flex: 0 0 2.853333rem;
      width: 2.853333rem;
      height: 2.133333rem;
      img{
        width: 100%;
        height: 100%;
        outline: none;
        border: none;
        vertical-align: top;
      }
    }
    .right_detail{
      position: relative;
      padding-left: .24rem;
      flex: 1 1 auto;
      font-size: .32rem;
      color: rgb(102, 102, 102);
      .title{
        font-size: .4rem;
        color: rgb(51, 51, 51);
        font-weight: 500;
        line-height: .586667rem;
      }
      .attr{
        line-height: .48rem;
      }
      .discountPrice{
        font-weight: 500;
        font-size: .346667rem;
        color: rgb(217, 38, 44);
        line-height: .586667rem;
      }
      .cartcontrolwrapper{
        position: absolute;
        right: .293333rem;
        bottom: 0;
      }
      .price{
        margin-top: .133333rem;
        font-size: .4rem;
        line-height: .4rem;
        color: rgb(217, 38, 44);
        .priceNum{
          display: inline-block;
          vertical-align: middle;
        }
        .Number{
          display: inline-block;
          float: right;
          vertical-align: middle;
          color: rgb(51, 51, 51);
        }
      }
    }
  }
  .addressBox{
    margin-top: .32rem;
    border-top: 1px solid rgb(245, 245, 245);
    .addressTitle{
      margin-top: .32rem;
    }
    .addressItemBox{
      margin-top: .32rem;
      border: 1px solid rgb(245, 245, 245);
      padding: .32rem;
      box-sizing: border-box;
      border-radius: .093333rem;
      .address{
        margin-top: .15rem;
      }
    }
  }
  .remark{
    margin-top: .32rem;
    .remarkTitle{
      margin-top: .32rem;
    }
    .remarkText{
      border: 1px solid rgb(245, 245, 245);
      margin-top: .32rem;
    }
  }
}
</style>


