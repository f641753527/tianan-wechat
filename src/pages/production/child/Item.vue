<template>
  <div class='item' @click='produtionDetail'>
    <div class='avatar'><img :src='info.productBanner'/></div>
    <div class='introduce'>
      <h1 class='title'>{{info.productName}}</h1>
      <p class='attrs'>
        <span class='attr' v-for='(attr, index) in info.productAttr' :key='index'>{{attr.attr}} : {{attr.value}} </span>
      </p>
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
    }
  },
  methods: {
    produtionDetail() {
      this.$router.push({ path: `/production/detail/${this.info.productId}` });
    },
  },
}
</script>

<style lang="scss" scoped>
@import "~@scss";

.item{
  margin-bottom: .32rem;
  background: #fff;
  .avatar{
    width: 100%;
    height: 5.253333rem;
    img{
      display: inline-block;
      vertical-align: top;
      width: 100%;
      height: 100%;
    }
  }
  .introduce{
    padding: .293333rem;
    .title{
      font-size: .453333rem;
      color: rgb(53, 53, 53);
      font-weight: 600;
      line-height: .986667rem;
    }
    .attrs{
      line-height: .453333rem;
      color: rgb(119, 119, 119);
      font-size: .32rem;
    }
  }
}
</style>
