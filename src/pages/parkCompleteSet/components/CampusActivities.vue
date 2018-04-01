<template>
  <div class="CampusActivities">
    <div v-waterfall-lower="loadMore" waterfall-disabled="disabled">
      <div class="boxBig" v-for="(item, index) in boxinfo" :key="index"  @click="detalis(item.activityId)">
        <img :src="item.banner" alt="" class="img_b">
        <div class="content">
          <p class="bowTitle textOver">{{item.activityParkName}}</p>
          <p class="bowAddress textOver"> <i class="iconfont icon-dizhi"></i> {{item.address}}</p>
          <p class="bowTime in_b"> <i class="iconfont icon-shijian"></i> {{ item.beginTime | DateFilter}} 至 {{ item.endTime | DateFilter}}</p>
          <p class="bowNum in_b"> <i class="iconfont icon-renshu"></i> {{ item.showNum }}人</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return {
      pageIndex: 1,
      boxinfo: [],
      total: 0,
      disabled: false,
    }
  },
  methods: {
    detalis(id) {
      this.$router.push({ path: `./ActivitiesDetalis/${id}` });
    },
    getinfo() {
      this.$http.post(`${this.URL_PREFIX}/app/get/activity/info/list`,{
        currPage: this.pageIndex,
        pageRows: 10,
        parkId: this.parkIdList[0],
      }).then((res) => {
        console.log(res);
        if(res.data.resCode === '10000') {
          this.total = res.data.resData.pageInfo ? res.data.resData.pageInfo.total : 0;
          const tempArr = res.data.resData.pageList ? res.data.resData.pageList : [];
          this.boxinfo = this.boxinfo.concat(tempArr);
          this.disabled = false;
        }
      });
    },
    loadMore() {
      if (this.boxinfo.length === this.total) {
        return;
      }
      this.disabled = true;
      this.pageIndex++;
      this.getinfo();
    },
  },
  mounted() {
    this.getinfo();
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
}
</script>
<style lang="scss" scoped>
.CampusActivities{
  padding: .293333rem .32rem;
  .boxBig{
    background-color: #fff;
    width: 100%;
    height: 7.56rem;
    border-radius: .106667rem;
    margin-bottom: .266667rem;
    .img_b{
      display: inline-block;
      border-radius: .106667rem .106667rem 0 0;
      width: 100%;
      height: 5.253333rem;
    }
    .content{
      padding: .266667rem .32rem;
      p{
        color: rgb(153, 153, 153);
      }
      .bowTitle{
        font-size: .453333rem;
        color: rgb(51, 51, 51);
        font-weight: bold;
      }
      .bowAddress{
        font-size: .32rem;
        margin-top: .106667rem;
      }
      .bowTime{
        font-size: .32rem;
        margin-top: .106667rem;
      }
      .bowNum{
        font-size: .32rem;
        margin-left: .266667rem;
        margin-top: .106667rem;
      }
    }
    
  }
}
.in_b{
  display: inline-block;
}
</style>
