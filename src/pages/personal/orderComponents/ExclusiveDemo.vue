<template>
  <div class="ExclusiveActivities">
      <div class="boxBig">
        <img :src="info.banner" alt="" class="img_b" @click="detalis(info.welfareId)">
        <div class="content in_b">
          <p class="boxTitle textOver">{{ info.title }}</p>
          <p class="boxPreferential textOver">{{ info.discountLimit }}</p>
          <p class="boxCompany textOver">福利来自：{{ info.providerName }}</p>
          <p class="boxLimitTime">有效限期：{{ info.endTime | DateFilter}}</p>
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
        return {};
      },
    },
  },
  methods: {
    detalis(id) {
      this.$router.push({ path: `./ExclusiveDetalis/${id}` });
    },
  },
}
</script>
<style lang="scss" scoped>
.ExclusiveActivities{
  .boxBig{
    width: 100%;
    height: 2.666667rem;
    background-color: #fff;
    border-radius: .106667rem;
    margin-bottom: .266667rem;
    display: flex;
    .img_b{
      vertical-align: middle;
      display: inline-block;
      width: 3.546667rem;
      height: 100%;
      border-radius: .106667rem 0 0 .106667rem;
    }
    .content{
      vertical-align: middle;
      flex: 1;
      padding: .36rem .28rem;
      .boxTitle{
        font-size: .4rem;
        font-weight: bold;
        width: 5.2rem;
      }
      .boxPreferential{
        font-size: .32rem;
        color: rgb(217, 38, 44);
        width: 5.2rem;
        margin-top: .16rem;
      }
      .boxCompany{
        font-size: .266667rem;
        color: rgb(102, 102, 102);
        width: 5.2rem;
        margin-top: .106667rem;
      }
      .boxLimitTime{
        font-size: .266667rem;
        color: rgb(102, 102, 102);
        width: 5.2rem;
        margin-top: .106667rem;
      }
    }
  }
}
.in_b{
  display: inline-block;
}
</style>
