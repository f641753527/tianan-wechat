<template>
  <div>
    <li @click="$router.push({ path: `/business/equipmentInfo/${msg.facilitiesId}`, query: { serviceId: msg.serviceId } })">
      <img :src="msg.banner" alt="">
      <h3 class="color_51" :class="{ 'textOver' : isTextOver }">{{ msg.title }}</h3>
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
    serviceId: {
      type: String,
    },
    isTextOver: {
      type: Boolean,
      default: true,
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
  img {
    width: 100%;
    height: 5.253333rem;
    box-sizing: border-box;
    border-radius: .053333rem .053333rem 0 0;
    border-bottom: 1px solid #c4c4c4;
  }
  h3 {
    font-size: .453333rem;
    min-height: 1.1rem;
    display: flex;
    align-items: center;
    font-weight: 600;
    margin: 0 .32rem;
  }
}
</style>
