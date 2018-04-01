<template>
  <div class="ExclusiveDetalis">
    <navigator title="园区配套"></navigator>
    <div class="bigBox">
      <div class="header">
        <img :src="welfareinfo.banner" alt="" class="img_b">
        <div class="welfareinfo">
          <p class="title">{{welfareinfo.title }}</p>
          <p class="price">{{welfareinfo.discountLimit}}</p>
          <p class="welfare">数量: <span>{{welfareinfo.showNum}} </span>份 <span class="from">福利来自{{welfareinfo.providerName}}</span> </p>
        </div>
      </div>
      <div class="limTime">
        有效限期：{{welfareinfo.beginTime | DateFilter}} 至 {{welfareinfo.endTime | DateFilter}}
      </div>
      <div class="content">
        <div class="jieshao">
          产品介绍
        </div>
        <div class="text" v-html="welfareinfo.content"></div>
      </div>
    </div>
    <div class="submitbox positionfixDowm">
      <mt-button type="danger" class="submit" @click="submit(welfareinfo.welfareId)">提交</mt-button>
    </div>
  </div>  
</template>
<script>
import Navigator from '@/components/Navigator';
import { mapGetters, mapMutations } from 'vuex';
import { MessageBox } from 'mint-ui';

export default {
  data() {
    return{
      welfareinfo: {},
    }
  },
  methods: {
    submit(id) {
      this.$http.post(`${this.URL_PREFIX}/app/added/welfare/order`,{
        welfareId: id,
        parkId: Number(this.parkIdList[0]),
      },{
        headers: { token: this.token },
      }).then((res) =>{
        console.log(res);
        if(res.data.resCode === '10000') {
          MessageBox('提示', '领取成功');
        }else{
          MessageBox('提示', res.data.resDesc);
        }
      });
    },
    getinfo() {
      this.$http.post(`${this.URL_PREFIX}/app/get/welfare/info/detail`,{
        welfareId: Number(this.$route.params.exclusiveDetalisId),
        parkId: Number(this.parkIdList[0]),
      }).then((res) =>{
        console.log(res);
        if(res.data.resCode === '10000') {
          this.welfareinfo = res.data.resData;
        }
      });
    },
  },
  mounted() {
    this.getinfo();
  },
  components: {
    Navigator,
  },
  computed: {
    ...mapGetters(['parkIdList','token']),
  },
}
</script>
<style lang="scss" scoped>
.header{
  color: rgb(51, 51, 51);
  background-color: #fff;
  .img_b{
    display: inline-block;
    height: 7.506667rem;
    width: 100%;
  }
  .welfareinfo{
    padding: .266667rem .32rem;
    box-sizing: border-box;
    .title{
      font-size: .453333rem;
      font-weight: bold;
    }
    .price{
      color: rgb(217, 38, 44);
      font-size: .4rem;
      margin-top: .266667rem;
    }
    .welfare{
      display: inline-block;
      font-size: .32rem;
      margin-top: .266667rem;
      .from{
        margin-left: .133333rem;
      }
    }
  }
}
.limTime{
  margin-top: .133333rem;
  background-color: #fff;
  height: 1.333333rem;
  line-height: 1.333333rem;
  padding: 0 .32rem;
  font-size: .4rem;
}
.content{
  background-color: #fff;
  margin-bottom: 1.32rem;
  .jieshao{
    padding: .36rem .32rem;
    box-sizing: border-box;
    font-size: .453333rem;
    font-weight: bold;
  }
  .text{
    padding: .293333rem .32rem;
  }
}
.submitbox{
  height: 1.32rem;
  background-color: rgb(235, 235, 235);
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  .submit{
    width: 9.146667rem;
    height: 1.04rem;
  }
}
</style>
