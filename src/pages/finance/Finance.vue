<template>
  <div class="Finance">
    <navigator title="金融平台"></navigator>
    <div class="content">
      <div class="boxBig" v-for="(item, index) in financeList" :key="index" @click="detalis(item.serviceId)">
        <img :src="item.picUrl" alt="" class="img_b">
        <div class="title textOver">
          {{item.serviceName }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Navigator from '@/components/Navigator';
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return{
      financeList: [],
    }
  },
  methods: {
    detalis(id) {
      this.$router.push({ path: `/financeDetalis/${id}` });
    },
    getList() {
      console.log(this.$route.query);
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`,{
        parentId: 1004,
        parkId: this.parkIdList[0],
      }).then((res) => {
        if(res.data.resCode === '10000') {
          this.financeList = res.data.resData.pageList;
        }
        console.log(res);
      });
    },
  },
  components: {
    Navigator,
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
  created() {
    this.getList();
  },
}
</script>

<style lang="scss" scoped>
.Finance{
  background-color: rgb(245, 245, 245);
  min-height: 100%;
}
.content{
  padding: .32rem 0;
  .boxBig{
    background-color: #fff;
    width: 9.36rem;
    border-radius: .106667rem;
    margin: .133333rem auto;
    .img_b{
      width: 100%;
      height: 5.253333rem;
      display: inline-block;
      border-radius: .106667rem .106667rem 0 0;
      border-bottom: 1px solid #c4c4c4;
    }
    .title{
      flex: 1;
      padding: .32rem;
      font-size: .453333rem;
      font-weight: bold;
    }
  }
}

</style>
