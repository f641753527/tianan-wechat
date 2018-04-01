<template>
  <div class="ParkCompleteSet">
    <navigator title="园区配套" :routePath='"/"'></navigator>
    <van-tabbar v-model="active">
      <van-tabbar-item v-for="(item, index) in listInfo" :key="index" @click.native="changeActive(item.type)">
        <div class='text_wrap'>
          <p class='text textOver'>{{item.serviceName}}</p>
          <i class='active_icon' v-if="active === item.type"></i>
          <i class='hidden_icon' v-else></i>
        </div>
        <template slot="icon" slot-scope="props">
          <p class='icon_wrap'>
            <!-- <i class='iconfont icon-yuanquhuodong'></i> -->
            <img :src="item.picUrl" alt="">
          </p>
        </template>
      </van-tabbar-item>

      <!-- <van-tabbar-item>
        <div class='text_wrap'>
          <p class='text'>美食街</p>
          <i class='active_icon' v-if="active === 1"></i>
          <i class='hidden_icon' v-else></i>
        </div>
        <template slot="icon" slot-scope="props">
          <p class='icon_wrap'>
            <i class='iconfont icon-yuanqumeishijie'></i>
          </p>
        </template>
      </van-tabbar-item>

      <van-tabbar-item>
        <div class='text_wrap'>
          <p class='text'>专享活动</p>
          <i class='active_icon' v-if="active === 2"></i>
          <i class='hidden_icon' v-else></i>
        </div>
        <template slot="icon" slot-scope="props">
          <p class='icon_wrap'>
            <i class='iconfont icon-zhuanshufuli'></i>
          </p>
        </template>
      </van-tabbar-item> -->
    </van-tabbar>
    <CampusActivities v-if='active === 13'></CampusActivities>
    <ExclusiveActivities v-if='active === 14'></ExclusiveActivities>
    <FoodCourt v-if='active === 9'></FoodCourt>
    {{track}}
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Indicator } from 'mint-ui';
import Navigator from '@/components/Navigator';
import CampusActivities from './components/CampusActivities';
import ExclusiveActivities from './components/ExclusiveActivities';
import FoodCourt from './components/FoodCourt';

export default {
  data() {
    return {
      active: 13,
      listInfo:[],
    };
  },
  methods: {
    changeActive(typeId) {
      this.active = typeId;
    },
    getList() {
      setTimeout(() => {
        Indicator.close();
      }, 3000);
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`, {
        parkId: this.parkIdList[0],
        parentId: 1006,
      }).then((res) => {
         Indicator.close();
         if(res.data.resCode === '10000') {
          this.listInfo = res.data.resData.pageList ? res.data.resData.pageList : [];
          this.active = this.listInfo[0].type;
          if (this.track) {
            this.active = this.track.activeOuter;
          }
        }
      });
    },
  },
  computed: {
    ...mapGetters(['track', 'token', 'parkIdList']),
  },
  components: {
    Navigator, CampusActivities, ExclusiveActivities, FoodCourt,
  },
  created() {
    Indicator.open('加载中...');
    this.getList();
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss';
.ParkCompleteSet{
  background: rgb(245, 245, 245);
}
.van-tabbar{
  position: relative;
  height: 2.986667rem;
  padding: .533333rem .533333rem 0 .533333rem;
  box-sizing: border-box;
  overflow-x: auto;
  overflow-y: hidden;
  .van-tabbar-item{
    .van-tabbar-item__icon .icon_wrap{
      width: 1.333333rem;
      height: 1.333333rem;
      text-align: center;
      line-height: 1.333333rem;
      img{
        width: 100%;
        height: 100%;
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
