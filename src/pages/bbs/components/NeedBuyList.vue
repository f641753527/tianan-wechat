<template>
  <div class="NeedBuyList">
    <div v-waterfall-lower="loadMore" waterfall-disabled="disabled" waterfall-offset="100">
      <div class="itemBox" v-for="(item, index) in NeedBuyList" :key="index" @click="detalis(item.serviceId)">
        <div class="">
          <p class="title">{{item.serviceName}}</p> 
          <p class="price fr">{{item.price}}</p>
        </div>
        <p class="">结束时间：{{item.endTime | DateFilter}}</p>
        <p class="">类型描述：{{item.typeDesc}}</p>
        <p class="">送货地址或服务地点：{{item.address}}</p>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return{
      NeedBuyList:[],
      pageIndex: 1,
      total: 0,
      disabled: false,
    }
  },
  methods: {
    getList() {
      this.$http.post(`${this.URL_PREFIX}/app/get/ask/service/list`, {
        currPage: this.pageIndex,
        pageRows: 5,
        parkId: this.parkIdList[0],
      }).then((res) => {
        console.log(res);
        if(res.data.resCode === '10000') {
          this.total = res.data.resData.pageInfo ? res.data.resData.pageInfo.total : 0;
          const tempArr = res.data.resData.pageList ? res.data.resData.pageList : [];
          this.NeedBuyList = this.NeedBuyList.concat(tempArr);
          this.disabled = false;
        }
      });
    },
    loadMore() {
      if (this.NeedBuyList.length === this.total) {
        return;
      }
      this.disabled = true;
      this.pageIndex++;
      this.getList();
    },
    detalis(id) {
      this.$router.push({ path: `./NeedBuyDetalis/${id}` });
    },
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  created() {
    this.getList();
  },
}
</script>
<style lang="scss" scoped>
.NeedBuyList{
  padding: .333333rem;
  .itemBox{
    background-color: #fff;
    width: 100%;
    padding: .4rem;
    box-sizing: border-box;
    margin-bottom: .266667rem;
    border-radius: 4px;
    p{
      font-size: .32rem;
      color: rgb(102, 102, 102);
      margin-bottom: .2rem;
    }
    .title{
      display: inline-block;
      font-size: .453333rem;
      font-weight: bold;
      color: rgb(51, 51, 51);
      margin-bottom: .266667rem;
    }
    .price{
      display: inline-block;
      color: rgb(217, 38, 44);
      font-size: .4rem;
      
      font-weight: bold;
    }
    
  }
}
.fr{
  float: right;
}
</style>
