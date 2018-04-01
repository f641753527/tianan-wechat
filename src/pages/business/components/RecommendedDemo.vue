<template>
  <div>
    <li @click="$router.push({ path: `/business/recommendInfo/${msg.serviceId}` })" :class="{ liMargin: isInfo}">
      <img :src="msg.banner" alt="">
      <h3 class="color_51 textOver">{{ msg.title }}</h3>
      <h4 class="mainColor textOver">{{ msg.discountPrice }} <span v-if="msg.discountMark === 1 && isInfo">折后价</span></h4>
      <p class="color_102" v-if="isInfo">原价：{{ msg.originalPrice }}</p>
    </li>
  </div>
</template>

<script>
export default {
  props: {
    msg: {
      type: Object,
      default: {},
    },
    isInfo: {
      type: Boolean,
      default: false,
    }
  },
}
</script>


<style lang="scss" scoped>
li {
  background-color: #fff;
  margin: .32rem;
  margin-bottom: 0;
  border-radius: .053333rem;
  &.liMargin {
    margin: 0;
  }
  img {
    width: 100%;
    height: 5.253333rem;
    border-radius: .053333rem .053333rem 0 0;
    border-bottom: 1px solid #c4c4c4;
  }
  h3 {
    font-size: .453333rem;
    font-weight: 600;
    margin: .16rem .32rem;
  }
  h4 {
    font-size: .4rem;
    margin-left: .32rem;
    line-height: .5rem;
    padding-bottom: .213333rem;
    span {
      margin-left: .266667rem;
      border: 1px solid red;
      border-radius: 4px;
      padding: .026667rem .053333rem;
      font-size: .32rem;
      line-height: .5rem;
    }
  }
  p {
    font-size: .32rem;
    margin-left: .32rem;
    padding-bottom: .426667rem;
  }
}
</style>
