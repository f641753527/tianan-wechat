<template>
  <div class="style">
    <h3>{{ form.formName }}</h3>
    <ul class="form">
      <li v-for="(item, index) in form.itemList" :key="index">
         <!-- 1单行文本 -->
        <mt-field :label="item.title" :placeholder="item.description" type="text" v-model="item.defaultValue" v-if="item.type === 1">
          <i slot="icon">*</i>
        </mt-field>
        <!-- 2多行文本 -->
        <mt-field :label="item.title" :placeholder="item.description" type="textarea" rows="3" v-model="item.defaultValue" v-if="item.type === 2"></mt-field>
          <!-- 3数字 -->
        <mt-field :label="item.title" :placeholder="item.description" type="number" v-model="item.defaultValue" v-if="item.type === 3"></mt-field>
        <!-- 4日期 -->
        <mt-field :label="item.title" :placeholder="item.description" type="date" v-model="item.defaultValue" v-if="item.type === 4"></mt-field>
        <!-- 5单选 -->
        <mt-radio :title="item.title" v-model="item.defaultValue" :options="item.options" v-if="item.type === 5"> </mt-radio>
        <!-- 6多选 -->
        <mt-checklist :title="item.title" v-model="item.defaultValue" :options="item.options" v-if="item.type === 6"></mt-checklist>
         <!-- 7图片 -->
         <div class="uploaderImg" v-if="item.type === 7">
          <van-uploader :after-read='onRead' accept="image/gif, image/jpeg, image/png" :disable="true">
            <div class="imgs">
              <img v-for="(item, index) in images" :key="index" :src="item">
            </div>
            <van-icon name="upgrade">上传图片</van-icon>
            
          </van-uploader> 
        </div>
        <!-- 8说明文字 -->
        <p v-if="item.type === 8">{{ item.defaultValue }}</p>
      </li>
    </ul>
    <div class="footer">
      <mt-button type="danger"  @click.native="beforeSubmit" size="small">提交</mt-button>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import { Field, Toast } from 'mint-ui';
import { Uploader } from 'vant';
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    return {
      form: {},
      username: '',
      minDate: new Date(),
      qiniuConfig: {},
      images: [],
    }
  },
  props: {
    formObj: {
      type: Object,
      default() {
        return {}
      },
    },
  },
  mounted() {
    this.form = deepcopy(this.formObj);
    this.getUploadToken();
  },
  methods: {
    beforeSubmit() {  // 验证数据
      // console.log(this.form.itemList);
      // if (!this.token) {
      //   Toast('登录已过期');
      //   return false;
      // }
      const mustIndex = this.form.itemList.findIndex((val) => {
        return val.ismust && val.defaultValue.length === 0;
      });
      const picIndex = this.form.itemList.findIndex((val) => {
        return val.ismust && val.type === 7 && this.images.length === 0;
      });
      if (mustIndex !== -1) {
        Toast(`请填写${this.form.itemList[mustIndex].title}内容`);
      } else if (picIndex !== -1) {
        Toast('请上传图片');
      } else {
        this.submit();
        console.log(mustIndex);
        console.log(this.form);
      }
    },
    submit() {  // 提交表单
      const Form = deepcopy(this.form);
      const content = [];
       Form.itemList.forEach((val) => {
        if (val.type === 6) {  // 处理多选
          val.defaultValue = val.defaultValue ? val.defaultValue.toString() : '';
        } else if (val.type === 3) {  // 处理数字
          val.defaultValue = val.defaultValue + '';
        }
        // if (val.defaultValue === '') val.defaultValue = null;
          content.push({
            itemId: val.itemId,
            title: val.title,
            type: val.type,
            value: val.defaultValue,
          });
      });
      this.$emit('finishForm', content);
    },
    getUploadToken() {  // 获取七牛token
      this.$http.post(`${this.URL_PREFIX}/app/get/qiniu/bucket/token`, {}, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.qiniuConfig = res.resData;
          console.log(res);
        }
      });
    },
    beforeUploader(num) {  // 上传前
      console.log(num);
      if (Number(num) < this.images.length) {
        Toast({
          message: '操作成功',
          iconClass: 'icon icon-success'
        });
        return;
      }
    },
    onRead(uploader) {   // 图像上传
      let param = new FormData();
      param.append('file', uploader.file);
      param.append('token', this.qiniuConfig.token);
      let config = {
        headers:{ 'Content-Type': 'multipart/form-data' }
      };
      this.$http.post('http://up-z2.qiniup.com/', param, config).then((response) => {
        const res = response.data;
        // this.tempUser.icon = `${this.qiniuConfig.domain}/${res.key}`;
        this.images.push(`${this.qiniuConfig.domain}/${res.key}`);
      });
    },
  },
  computed: {
    ...mapGetters(['token']),
  },
}
</script>

<style lang="scss" scoped>
@import '~@scss';
.style {
  padding-bottom: 50px;
}
h3 {
  text-align: center;
  margin-bottom: 10px;
  font-weight: 600;
}
.mint-cell-wrapper {
  border-bottom: 1px solid #c4c4c4;
}
.form {
  background-color: rgb(245, 245, 245);
  .mint-field,
  .mint-cell,
  .mint-checklist,
  .mint-radiolist
  {
    padding: 2px 0;
    margin-bottom: .026667rem;
    font-size: .4rem;
    color: rgb(67, 67, 67);
    .mint-checklist-title {
      padding: 8px;
      margin: 0;
      background-color: #fff;
    }
    .mint-radiolist-title {
      background-color: #fff;
    }
  }
  .uploaderImg {
    padding: 10px 0;
    margin-bottom: .026667rem;
    min-height: 2.666667rem;
    background-color: #fff;
    display: flex;
    align-items: center;
    justify-content: space-around;
    .imgs {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
    }
    img {
      width: 46%;
      height: 2.666667rem;
      margin-bottom: .266667rem;
    }
  }
}
.footer{
  padding: .106667rem .426667rem;
  margin-top: .4rem;
  box-sizing: border-box;
  // position: fixed;
  // bottom: 30px;
  width: 100%;
  .mint-button{
    width: 100%;
    height: 1.04rem;
    background: $color-main;
    color: #fff;
    font-size: .48rem;
  }
}
</style>
