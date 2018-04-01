<template>
  <div class="CustomDemo">
    <div class="formText">
      <p v-for="(item, index) in info.content" :key="index" class="clearfix">
        <span class="lable">{{item.title}}</span>
        <span class="content"  v-if="item.type !== 7">{{item.value}}</span>
        <img :src="item.value" alt="" class="img_b" v-if="item.type === 7">
      </p>
    </div>
  </div>
</template>
<script>
import { ImagePreview } from 'vant';

export default {
  props: {
    info:{
      type: Object,
      default() {
        return{};
      },
    },
  },
  methods: {
    aaa() {
      ImagePreview([]);
    },
  },
}
</script>
<style lang="scss" scoped>
.formText{
  width: 100%;
  box-sizing: border-box;
  background-color: #fff;
  border-top: 1px solid rgb(245, 245, 245);
  padding: 0 .32rem;
  p{
    min-height: 1.173333rem;
    border-bottom: 1px solid rgb(245, 245, 245);
    display: flex;
    align-items: center;
    padding: .066667rem 0;
  }
  .lable{
    width: 3.173333rem;
    text-align: left;
    flex-shrink: 0;
  }
  .content {
    flex: 1;
  }
  .img_b{
    display: inline-block;
    width: 2rem;
    height: 2rem;
  }
}
</style>
