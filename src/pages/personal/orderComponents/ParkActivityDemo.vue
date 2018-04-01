<template>
  <div class="CampusActivities">
    <div class="boxBig">
      <img :src="info.banner" alt="" class="img_b" @click="detalis(info.activityId)">
      <div class="content">
        <p class="bowTitle textOver">{{info.activityParkName}}</p>
        <p class="bowAddress textOver"> <i class="iconfont icon-dizhi"></i> {{info.address}}</p>
        <p class="bowTime in_b"> <i class="iconfont icon-shijian"></i> {{ info.beginTime | DateFilter}} 至 {{ info.endTime | DateFilter}}</p>
        <p class="bowNum in_b"> <i class="iconfont icon-renshu"></i> {{ info.showNum }}人</p>
      </div>
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
  methods: {
    detalis(id) {
      this.$router.push({ path: `./ActivitiesDetalis/${id}` });
    },
  },
}
</script>
<style lang="scss" scoped>
.CampusActivities{
  padding: .293333rem .32rem;
  .boxBig{
    background-color: #fff;
    width: 100%;
    height: 7.56rem;
    border-radius: .106667rem;
    margin-bottom: .266667rem;
    .img_b{
      display: inline-block;
      border-radius: .106667rem .106667rem 0 0;
      width: 100%;
      height: 5.253333rem;
    }
    .content{
      padding: .266667rem .32rem;
      p{
        color: rgb(153, 153, 153);
      }
      .bowTitle{
        font-size: .453333rem;
        color: rgb(51, 51, 51);
        font-weight: bold;
      }
      .bowAddress{
        font-size: .32rem;
        margin-top: .106667rem;
      }
      .bowTime{
        font-size: .32rem;
        margin-top: .106667rem;
      }
      .bowNum{
        font-size: .32rem;
        margin-left: .266667rem;
        margin-top: .106667rem;
      }
    }
    
  }
}
.in_b{
  display: inline-block;
}
</style>
