<template>
  <div class="">
    <div class="itemBox" @click="detalis(info.serviceId)">
      <div class="">
        <p class="title">{{info.serviceName}}</p> 
        <p class="price fr">{{info.price}}</p>
      </div>
      <p class="">结束时间：{{info.endTime | DateFilter}}</p>
      <p class="">类型描述：{{info.typeDesc}}</p>
      <p class="">送货地址或服务地点：{{info.address}}</p>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Object,
      default() {
        return{};
      },
    },
  },
}
</script>
<style lang="scss" scoped>
.itemBox{
  background-color: #fff;
  width: 100%;
  padding: .4rem;
  box-sizing: border-box;
  margin-bottom: .266667rem;
  border-radius: 4px;
  p{
    font-size: .32rem;
    color: rgb(102, 102, 102);
    margin-bottom: .2rem;
  }
  .title{
    display: inline-block;
    font-size: .453333rem;
    font-weight: bold;
    color: rgb(51, 51, 51);
    margin-bottom: .266667rem;
  }
  .price{
    display: inline-block;
    color: rgb(217, 38, 44);
    font-size: .4rem;
    
    font-weight: bold;
  }
}
.fr{
  float: right;
}
</style>
