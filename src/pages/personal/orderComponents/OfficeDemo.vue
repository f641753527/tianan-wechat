<template>
  <div>
    <div class="itemBox">
      <img :src="info.orderServiceInfo.roomPic" alt="">
      <div class="text">
        <p class="title">{{ info.orderServiceInfo.roomName }}</p>
        <p class="price">价格：{{ info.orderServiceInfo.minFee / 100 | PriceFilter}} <span class="capacity fr">容量：{{ info.capacityNum }}</span> </p>
      </div>
      <div class="timeBox">
        <div class="boxTitle">预定时间</div>
        <p class="itemTime" v-for="(item, index) in info.orderServiceInfo.roomOrderLis" :key="index">
          {{item.beginTime | DateFilter( 'yyyy-MM-dd hh:mm')}}  -  {{item.endTime | DateFilter('yyyy-MM-dd hh:mm')}}
          <span class="red fr">{{ item.roomFee / 100 | PriceFilter }}元 </span>
        </p>
      </div>
      <div class="remark">
        <div class="boxTitle">附言</div>
        <div class="itemText">
          <mt-field type="textarea" rows="4" v-model="info.remark" readonly></mt-field>
        </div>
      </div>
    </div>
  </div>
  
</template>
<script>
export default {
  data() {
    return {
      msgInfo: {
        orderServiceInfo: {
          roomPic: '',
        },
      },
    }
  },
  props: {
    info: {
      type: Object,
      default() {
        return{};
      },
    },
  },
  mounted() {
    this.msgInfo = this.info;
  }
}
</script>
<style lang="scss" scoped>
.itemBox{
    width: 100%;
    background-color: #fff;
    margin-bottom: .333333rem;
    border-radius: .053333rem;
    img{
      display: block;
      width: 100%;
      height: 5.253333rem;
      border-radius: .053333rem .053333rem 0 0;
    }
    .text{
      padding: .333333rem;
      .title{
        font-size: .453333rem;
        font-weight: bold;
      }
      .price{
        font-size: .4rem;
        color: rgb(217, 38, 44);
        margin-top: .133333rem;
        .capacity{
          font-size: .32rem;
          color: rgb(102, 102, 102);
        }
      }
    }
  }
  .fr{
    float: right;
  }
  .timeBox{
    border-top: 1px solid rgb(245, 245, 245);
    // margin-top: .32rem;
    .boxTitle{
      margin-top: .32rem;
      font-size: .4rem;
    }
    .itemTime{
      margin-top: .32rem;
    }
    .red{
      color: rgb(217, 38, 44);
    }
  }
  .remark{
    border-top: 1px solid rgb(245, 245, 245);
    margin-top: .32rem;
    .boxTitle{
      margin-top: .32rem;
      font-size: .4rem;
    }
  }
  
</style>
