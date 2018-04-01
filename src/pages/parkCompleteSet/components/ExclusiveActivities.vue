<template>
  <div class="ExclusiveActivities">
    <div v-waterfall-lower="loadMore" waterfall-disabled="disabled">
      <div class="boxBig" v-for="(item, index) in boxinfo" :key="index"  @click="detalis(item.welfareId)">
        <img :src="item.banner" alt="" class="img_b">
        <div class="content in_b">
          <p class="boxTitle textOver">{{ item.title }}</p>
          <p class="boxPreferential textOver">{{ item.discountLimit }}</p>
          <p class="boxCompany textOver">福利来自：{{ item.providerName }}</p>
          <p class="boxLimitTime">有效限期：{{ item.endTime | DateFilter}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return{
      pageIndex: 1,
      boxinfo: [],
      total: 0,
      disabled: false,
    }
  },
  methods: {
    detalis(id) {
      this.$router.push({ path: `./ExclusiveDetalis/${id}` });
    },
    getinfo() {
      this.$http.post(`${this.URL_PREFIX}/app/get/welfare/info/list`,{
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
.ExclusiveActivities{
  padding: .32rem;
  .boxBig{
    width: 100%;
    height: 2.666667rem;
    background-color: #fff;
    border-radius: .106667rem;
    margin-bottom: .266667rem;
    display: flex;
    .img_b{
      vertical-align: middle;
      display: inline-block;
      width: 3.546667rem;
      height: 100%;
      border-radius: .106667rem 0 0 .106667rem;
    }
    .content{
      vertical-align: middle;
      flex: 1;
      padding: .36rem .28rem;
      .boxTitle{
        font-size: .4rem;
        font-weight: bold;
        width: 5.2rem;
      }
      .boxPreferential{
        font-size: .32rem;
        color: rgb(217, 38, 44);
        width: 5.2rem;
        margin-top: .16rem;
      }
      .boxCompany{
        font-size: .266667rem;
        color: rgb(102, 102, 102);
        width: 5.2rem;
        margin-top: .106667rem;
      }
      .boxLimitTime{
        font-size: .266667rem;
        color: rgb(102, 102, 102);
        width: 5.2rem;
        margin-top: .106667rem;
      }
    }
  }
}
.in_b{
  display: inline-block;
}
</style>
