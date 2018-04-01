<template>
  <div class="ActivityForm">
    <navigator title="园区活动"></navigator>
    <div class="header">
      <img :src="imgSrc" alt="" class="img_b">
    </div>
    <div class="form">
      <van-cell-group>
        <van-field
          v-model="ActivityForm.username"
          label="用户名"
          placeholder="请输入用户名"
          required
        />
        <van-field
          v-model="ActivityForm.password"
          label="密码"
          placeholder="请输入密码"
          required
        />
        <van-field
          v-model="ActivityForm.message"
          label="留言"
          type="textarea"
          placeholder="请输入留言"
          rows="1"
          autosize
        />
        <mt-button type="default" class="defbtn color_51" @click="upload">上传图片 <i class="iconfont icon-shangchuantupian fr"></i> </mt-button>
        <mt-actionsheet :actions="actions" v-model="sheetVisible"></mt-actionsheet>
      </van-cell-group>
    </div>
    <div class="submitbox">
      <mt-button type="danger" class="submit" @click="submit">提交</mt-button>
    </div>
  </div>
</template>
<script>
import Navigator from '@/components/Navigator';
import { mapGetters, mapMutations } from 'vuex';

export default {
  data() {
    return{
      imgSrc: '', // 图片地址
      ActivityForm: [{}, {}], // 用户填写的表单数据
      actions: [{ name: '拍照', method: this.makephoto },{name: '从照片里取', method: this.takephoto }],
      sheetVisible: false,
    }
  },
  methods: {
    upload(file) {
      this.sheetVisible = true;
    },
    submit() {
      this.$http.post(`${this.URL_PREFIX}/app/added/activity/order`,{
        parkId: Number(this.parkIdList[0]),
        activityId: Number(this.$route.params.activityFormId),
        content: this.ActivityForm,
      },{
        headers: { token: this.token },
      }).then((res) => {
        console.log(res);
      });
    },
    makephoto() {
      console.log(11);
    },
    takephoto() {
      console.log(11);
    },
    getInfoPic(){
      this.$http.post(`${this.URL_PREFIX}/app/get/activity/info/detail`,{
        parkId: Number(this.parkIdList[0]),
        activityId: Number(this.$route.params.activityFormId),
      }).then((res) => {
        console.log(res);
        if (res.data.resCode === '10000') {
          this.imgSrc = res.data.resData.banner;
        }
      });
    },
  },
  components: {
    Navigator,
  },
  created() {
    this.getInfoPic();
  },
  computed: {
    ...mapGetters(['parkIdList', 'token']),
  },
}
</script>
<style lang="scss" scoped>
.ActivityForm{
  background-color: rgb(245, 245, 245);
  .img_b{
    display: inline-block;
    height: 5.613333rem;
    width: 100%;
    background-color: #fff;
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
.defbtn{
  background-color: #fff;
  width: 100%;
  text-align: left;
  font-size: .426667rem;
}
.fr{
  float: right;
}
</style>
