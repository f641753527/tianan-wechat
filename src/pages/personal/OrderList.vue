<template>
  <div class="OrderList">
    <navigator title="订单中心" :routePath='"/personal"'></navigator>
    <div v-waterfall-lower="loadMore" waterfall-disabled="disabled">
      <div class="orderBox" v-for="(item, index) in tableData3" :key="index"  @click="details(item.orderType, item.orderId)">
        <p class="orderTitle">{{item.title}}</p>
        <p class="orderPrice">准核金额：{{item.orderFee / 100 | PriceFilter}}</p>
        <p class="orderStatus">{{item.orderStatus | orderStatus}}</p>
        <div class="orderDetalis">
          <p class="orderId">订单编号：{{item.orderId}}</p>
          <p class="orderTime">下单时间：{{item.createTime | DateFilter}}</p>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
  data(){
    return{
      value: '',
      tableData3:[],
      pageIndex: 1,
      msgtotal: 0,
      disabled: false,
    }
  },
  methods:{
    details(Ty, id) {
       this.$router.push({ path: `/personal/orderDetail`, query: { orderType: Ty, orderId: id } });
    },
    getlist() {
      const askBoby = {
        currPage: this.pageIndex,
        pageRows: 6,
      };
      if (this.value !== '') {
        askBoby.serviceId = this.value;
      }
      this.$http.post(`${this.URL_PREFIX}/app/get/user/order/info/list`, askBoby,{
        headers: { token: this.token },
      }).then((res) =>{
        if(res.data.resCode === '10000') {
          const tempArr = res.data.resData.pageList ? res.data.resData.pageList : [];
          this.tableData3 = this.tableData3.concat(tempArr);
          if(res.data.resData.pageInfo.total) {
            this.msgtotal = res.data.resData.pageInfo.total;
          }
          this.disabled = false;
        }
      });
    },
    loadMore() {
      if (this.tableData3.length === this.msgtotal) {
        console.log(333);
        return;
      }
      console.log(this.tableData3.length);
      console.log(this.msgtotal);
      this.disabled = true;
      this.pageIndex++;
      this.getlist();
    },
  },
  created() {
    this.getlist();
  },
  computed: {
    ...mapGetters(['parkIdList','token']),
  },
  filters: {
    orderStatus(num) {
      switch (num) {
        case 0:
          return '删除';
        case 1:
          return '待审批';
        case 2:
          return '审批中';
        case 3:
          return '审批不通过';
        case 4:
          return '用户取消';
        case 5:
          return '待支付';
        case 6:
          return '完成';
        case 7:
          return '订单关闭';
        case 8:
          return '已退款';
        default:
          break;
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.OrderList{
  .orderBox{
    margin-top: .133333rem;
    padding: .4rem .32rem;
    width: 100%;
    box-sizing: border-box;
    background-color: #fff;
    .orderTitle{
      font-size: .453333rem;
      font-weight: bold;
    }
    .orderPrice{
      margin-top: .266667rem;
      font-size: .4rem;
      font-weight: bold;
      color: rgb(217, 38, 44);
    }
    .orderStatus{
      margin-top: .266667rem;
      font-size: .4rem;
      font-weight: bold;
    }
    .orderDetalis{
      border-top: 1px solid rgb(245, 245, 245);
      margin-top: .4rem;
      .orderId{
        margin-top: .4rem;
        color: rgb(102, 102, 102);
      }
      .orderTime{
        color: rgb(102, 102, 102);
      }
    }
  }
  
}

</style>
