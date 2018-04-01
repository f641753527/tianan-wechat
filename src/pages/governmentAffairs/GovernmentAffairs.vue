<template>
  <div class="Property">
    <navigator title="政务平台"></navigator>
    <ul class="clearfix">
      <router-link :to="{ path: `/governmentDetiles/${item.serviceId}` }" v-for="(item,index) in serviceList" :key="index">
        <li>
          <img :src="item.picUrl" alt="">
          <h3 class="textOver">{{ item.serviceName }}</h3>
        </li>
      </router-link>
    </ul>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  data() {
    return{
      serviceList: [],
    }
  },
  methods: {
    getServiceList(flag) {  // 获取商务平台列表
      this.$http.post(`${this.URL_PREFIX}/app/get/park/service/list`, {
        parkId: this.parkIdList[0],
        parentId: 1003,
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.serviceList = res.resData.pageList ? res.resData.pageList : [];
        }
      });
    },
  },
  computed: {
    ...mapGetters(['parkIdList']),
  },
  mounted() {
    this.getServiceList();
  },
}
</script>

<style lang="scss" scoped>
ul{
  padding: .533333rem .266667rem;
  li {
    float: left;
    width: 17%;
    height: 1.866667rem;
    margin-right: .266667rem;
    margin-bottom: .533333rem;
    &:nth-of-type(5n) {
      margin-right: 0;
    }
    img {
      width: 1.333333rem;
      height: 1.333333rem;
      border-radius: 50%;
      margin-bottom: .08rem;
    }
    h3 {
      // width: 1.333333rem;
      width: 100%;
      text-align: center;
      font-size: .32rem;
    }
  }
}
</style>
