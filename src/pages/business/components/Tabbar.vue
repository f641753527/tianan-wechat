<template>
  <div>
    <van-tabbar v-model="active">
      <van-tabbar-item v-for="(item, index) in listInfo" :key="index" @click.native="changeActive(item.type, item.serviceId)">
        <div class='text_wrap'>
          <p class='text textOver'>{{ item.serviceName }}</p>
          <i class='active_icon' v-if="active === item.serviceId"></i>
          <i class='hidden_icon' v-else></i>
        </div>
        <template slot="icon" slot-scope="props">
          <p class='icon_wrap'>
            <!-- <i class='iconfont icon-yuanquhuodong'></i> -->
            <img :src="item.picUrl" alt="">
          </p>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return{
      listInfo: [],
      active: 0,
    };
  },
  props: {
    serviceId: {
      type: Number,
    },
  },
  methods: {
    changeActive(typeId, serviceId) {
      this.active = serviceId;
      this.$emit('navActive', typeId, serviceId);
    },
    getList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`, {
        parkId: this.parkIdList[0],
        parentId: this.serviceId,
      }).then((res) => {
        if (res.data.resCode === '10000') {
          console.log(res);
          this.listInfo = res.data.resData.pageList ? res.data.resData.pageList : [];
          this.active = this.listInfo[0].serviceId;
          this.$emit('navActive', this.listInfo[0].type, this.listInfo[0].serviceId);
        }
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  mounted() {
    this.getList();
  },
}
</script>


<style lang="scss" scoped>
@import '~@scss';

.van-tabbar{
  position: relative;
  height: 2.986667rem;
  padding: .533333rem .533333rem 0 .233333rem;
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
        border-radius: 50%;
      }
    }
    .van-tabbar-item__text .text_wrap{
      text-align: center;
      .text{
        width: 2.666667rem;
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
