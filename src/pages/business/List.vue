<template>
  <div>
    <Navigator title="商务服务平台"></Navigator>
    <Tabbar :serviceId="1002" @navActive="getActive"></Tabbar>
    <router-view></router-view>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import Tabbar from '../business/components/Tabbar';

export default {
  data() {
    return{
      BusinessList: [],
      pageList: [],
      pageIndex: 1,
      pageTotal: 0,
      disabled: false,
      typeId: 0,
    }
  },
  methods: {
    getActive(typeId, serviceId) {
      switch (typeId) {
        case 11:
          this.$router.push({ path: '/business/businessList/recommend' });
          break;
        case 12:
          this.$router.push({ path: `/business/businessList/meetingRoom/${serviceId}` });
          break;
        case 16:
          this.$router.push({ path: `/business/businessList/equipment/${serviceId}` });
          break;
        default:
          break;
      };
    },
  },
  components: {
    Tabbar
  },
}
</script>

