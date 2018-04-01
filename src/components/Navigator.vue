<template>
  <div>
    <mt-header :title="title" class="navheader">
      <!-- <mt-button icon="back" slot="left" @click="$router.go(-1)" class="headerbtn"></mt-button>
      <div slot="right" @click='$router.push("/")'> <i class="iconfont icon-shouye"></i> </div> -->
      <mt-button icon="back" slot="left" @click="back" class="headerbtn"></mt-button>
      <div slot="right" @click='$router.push("/")'><i class="iconfont icon-shouye"></i></div> 
    </mt-header> 
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '天安智慧云',
    },
    routePath: {
      type: String,
    },
    routeQuery: {
      type: String,
      default: '0',
    },
  },
  methods: {
    back() {
      if (!this.routePath) {
        this.$router.go(-1);
      } else {
        this.$router.push(this.routePath);
      }
    },
  },
}
</script>

<style lang="scss" scoped>
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
    font-size: .453333rem;
  }
}
.headerbtn{
  color: rgb(51, 51, 51);
}

</style>
