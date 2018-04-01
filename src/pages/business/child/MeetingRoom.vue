<template>
  <div class="OfficeDemo">
    <div class="bigBox" v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="100">
      <div class="itemBox" v-for="(item, index) in officeList" :key="index"  @click="detalis(item.id)">
        <img :src="item.roomPic" alt="">
        <div class="text">
          <p class="title">{{item.roomName}}</p>
          <p class="price">价格：{{item.minFee / 100 | PriceFilter}} <span class="capacity fr">容量：{{item.capacityNum}}</span> </p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return{
      disabled: false,
      officeList: [],
      pageIndex: 1,
      total: 0,
    };
  },
  methods: {
    getList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/meeting/room/info/list`, {
        currPage: this.pageIndex,
        pageRows: 5,
        parkId: this.parkIdList[0],
      }).then((res) => {
        if(res.data.resCode === '10000') {
          this.total = res.data.resData.pageInfo ? res.data.resData.pageInfo.total : 0;
          const tempArr = res.data.resData.pageList ? res.data.resData.pageList : [];
          this.officeList = this.officeList.concat(tempArr);
          this.disabled = false;
        }
      });
    },
    loadMore() {
      if (this.officeList.length === this.total) {
        return;
      }
      this.disabled = true;
      this.pageIndex++;
      this.getList();
    },
    detalis(id) {
      this.$router.push({ path: `/business/OfficeDetalis/${this.$route.params.serviceId}/${id}` });
    },
  },
  created() {
    this.getList();
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
}
</script>
<style lang="scss" scoped>
.OfficeDemo{
  padding: .293333rem .333333rem;
  .itemBox{
    width: 100%;
    background-color: #fff;
    margin-bottom: .333333rem;
    border-radius: .053333rem;
    img{
      display: block;
      width: 100%;
      height: 5.253333rem;
      border-radius: .053333rem .053333rem 0 0;
      border-bottom: 1px solid #c4c4c4;
    }
    .text{
      padding: .333333rem;
      .title{
        font-size: .453333rem;
        font-weight: bold;
      }
      .price{
        font-size: .4rem;
        color: rgb(217, 38, 44);
        margin-top: .133333rem;
        .capacity{
          font-size: .32rem;
          color: rgb(102, 102, 102);
        }
      }
    }
  }
}
.fr{
  float: right;
}
</style>
