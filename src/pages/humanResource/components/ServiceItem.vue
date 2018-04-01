<template>
  <div class='detail' @click.stop='showDetail(job.id)'>
    <div class='top'>
      <p class='header'>{{job.title}}</p>
      <p class='descripe'>
        <span class='salary'>{{job.price}}</span>
        <span class='unit' v-show='job.price'>元/月</span>
      </p>
    </div>
    <p class='footer'><span class='left'>{{job.corpName}}</span><span class='right'>{{job.createTime | DateFilter}}</span></p>
  </div> 
</template>

<script>
export default {
  props: {
    job: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    showDetail(id) {
      this.$router.push({ path: `/humanResource/serviceDetail/${id}` });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.detail{
  margin-bottom: 20px;
  border: 1px solid #c4c4c4;
  .top{
    padding: .4rem;
    background: #ffffff;
    .header{
      line-height: .746667rem;
      font-weight: 700;
      font-size: .453333rem;
      color: rgb(51, 51, 51);
    }
    .descripe{
      font-weight: 600;
      .salary{
        margin-right: .16rem;
        color: $color-main;
        font-size: .4rem;
      }
      .unit{
        color: rgb(51, 51, 51);
        font-size: .266667rem
      }
    }
  }
  .footer{
    @include clear-float;
    padding: 10px 30px;
    background: #f9f9f9;
    font-size: .266667rem;
    color: #666666;
    .left, .right{
      display: inline-block;
      vertical-align: middle;
    }
    .left {
      float: left;
    }
    .right{
      float: right;
    }
  }
}
</style>

