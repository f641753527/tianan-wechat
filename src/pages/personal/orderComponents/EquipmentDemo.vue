<template>
  <div>
    <li @click="$router.push({ path: `/business/equipmentInfo/${msg.serviceId}` })">
      <img :src="msg.banner" alt="">
      <h3 class="color_51 textOver">{{ msg.title }}</h3>
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
  },
}
</script>


<style lang="scss" scoped>
li {
  background-color: #fff;
  margin: .32rem;
  margin-bottom: 0;
  border-radius: .053333rem;
  img {
    width: 100%;
    height: 5.253333rem;
    border-radius: .053333rem .053333rem 0 0;
    border-bottom: 1px solid #c4c4c4;
  }
  h3 {
    font-size: .453333rem;
    height: 1.2rem;
    line-height: 1.2rem;
    font-weight: 600;
    margin: 0 .32rem;
  }
}
</style>
