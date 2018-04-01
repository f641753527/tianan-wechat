<template>
  <div class="Notice">
    <navigator title="人力资源平台"></navigator>

    <van-tabbar v-model="active">
      <van-tabbar-item>
        <div class='text_wrap'>
          <p class='text'>找工作</p>
          <i class='active_icon' v-if="active === 0"></i>
          <i class='hidden_icon' v-else></i>
        </div>
        <template slot="icon" slot-scope="props">
          <p class='icon_wrap'>
            <i class='iconfont icon-zhaogongzuo'></i>
          </p>
        </template>
      </van-tabbar-item>

      <van-tabbar-item>
        <div class='text_wrap'>
          <p class='text'>服务外包</p>
          <i class='active_icon' v-if="active === 1"></i>
          <i class='hidden_icon' v-else></i>
        </div>
        <template slot="icon" slot-scope="props">
          <p class='icon_wrap'>
            <i class='iconfont icon-fuwuwaibao'></i>
          </p>
        </template>
      </van-tabbar-item>

      <van-tabbar-item>
        <div class='text_wrap'>
          <p class='text'>招培训</p>
          <i class='active_icon' v-if="active === 2"></i>
          <i class='hidden_icon' v-else></i>
        </div>
        <template slot="icon" slot-scope="props">
          <p class='icon_wrap'>
            <i class='iconfont icon-zhaopeixun'></i>
          </p>
        </template>
      </van-tabbar-item>
    </van-tabbar>

    <JobList v-if='active === 0'></JobList>
    <ServiceList v-if='active === 1'></ServiceList>
    <EduList v-if='active === 2'></EduList>
    
  </div>
</template>

<script>
import JobList from './components/JobList';
import ServiceList from './components/ServiceList';
import EduList from './components/EduList';

export default {
  data() {
    return {
      active: 0,
    };
  },
  components: {
    JobList, ServiceList, EduList,
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss';
.Notice{
  background: rgb(245, 245, 245);
}
.van-tabbar{
  position: relative;
  height: 2.986667rem;
  padding: .533333rem .533333rem 0 .533333rem;
  box-sizing: border-box;
  .van-tabbar-item{
    .van-tabbar-item__icon .icon_wrap{
      width: 1.333333rem;
      height: 1.333333rem;
      border-radius: 50%;
      border: .026667rem solid rgb(241, 241, 241);
      text-align: center;
      line-height: 1.333333rem;
      .iconfont{
        font-size: .72rems;
        color: $color-main;
      }
    }
    .van-tabbar-item__text .text_wrap{
      text-align: center;
      .text{
        line-height: .88rem;
        font-size: .32rem;
        color: rgb(51, 51, 51);
        font-weight: 600;
      }
      .active_icon{
        display: inline-block;
        border-bottom: .266667rem solid rgb(245, 245, 245);
        border-left: .266667rem solid transparent;
        border-right: .266667rem solid transparent;
      }
      .hidden_icon{
        display: inline-block;
        height: .266667rem;
      }
    }
  }
}
.van-hairline--top-bottom::after {
    border-width: 0;
}
</style>
