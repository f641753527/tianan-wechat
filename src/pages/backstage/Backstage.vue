<template>
  <div class='backstage'>
    <navigator :title="navtital"></navigator>
    <mt-button @click='toModule("/personal")' class="myButton" type="danger">个人中心</mt-button>
    <!-- <mt-button>企业管理后台</mt-button>
    <mt-button>园区管理后台</mt-button> -->
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
  data() {
    return {
      navtital: '后台管理',
    };
  },
  methods: {
    toModule(path) {
      this.$router.push({ path: path });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.backstage{
 
}

.myButton {
  width: 90%;
  margin: 30px .426667rem;
}
</style>

