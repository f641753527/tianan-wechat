<template>
  <div class='account'>

    <navigator class='header' :title="title"></navigator>

    <div class='avatar_wrap'>
      <div class='label'>头像</div>
      <div class='avarar'>
         <van-uploader :after-read='onRead' accept="image/gif, image/jpeg, image/png">
          <img :src="tempUser.icon">
        </van-uploader> 
      </div>
    </div>

    <mt-field v-model="user.userNick" label='昵称'/>

    <mt-cell title="性别" @click.native='changeSexFlag=true;' :value='tempUser.sex.text' is-link/>

    <mt-field v-model="user.userHobby" label='爱好'/>

    <mt-cell title="地址" @click.native='changeAreaFlag=true;' :value='tempUser.addrText' is-link/>

    <mt-field v-model="user.details" label='详细地址'/>
    

    <div class='footer'>
      <mt-button @click.native='edit'>保存</mt-button>
    </div>




    <!-- 选择性别 -->
    <van-popup class='selectSex' v-model="changeSexFlag" position="bottom">
      <van-picker show-toolbar :columns="columns" @cancel="cancelSex" @confirm="confirmSex"/>
    </van-popup>

    <!-- 选择地区 -->
    <van-popup v-model="changeAreaFlag" position="bottom">
      <van-area :area-list="areaList" @cancel='cancelArea' @confirm='confirmArea'/>
    </van-popup>


  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { Toast } from 'vant';

export default {
  data(){
    return {
      title: '个人资料',
      user: {},

      tempUser: {
        sex: {
          code: '',
          text: '',
        },
        addrList: [],
        addrText: '',
        icon: '',
      },

      provinces: [],
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {},
      },
      changeSexFlag: false,
      changeAreaFlag: false,
      columns: [{ text: '男', code: 1 }, { text: '女', code : 2 }],

      errorMsg: '修改成功',
      duration: 2000,
      qiniuConfig: {},
    };
  },

  methods: {
    getUploadToken() {
      this.$http.post(`${this.URL_PREFIX}/app/get/qiniu/bucket/token`, {}, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.qiniuConfig = res.resData;
        }
      });
    },

    getAllArea() {
      this.$http.post(`${this.URL_PREFIX}/app/get/all/area/data`, {}).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.provinces = res.resData.pageList[0].childrenList;
          this.dataprocess();
        }
      });
    },

    getUserInfo() {
      this.$http.post(`${this.URL_PREFIX}/app/get/user/info/detail`, {}, {
        headers: {
          token: this.token,
        },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.user = res.resData;

          this.userInit();
        }
      });
    },

    userInit() {
      if (this.user.userSex === 0) {
        this.tempUser.sex.text = '';
      } else if (this.user.userSex === 1) {
        this.tempUser.sex.text = '男';
      } else {
        this.tempUser.sex.text = '女';
      }

      const provinceText = this.user.provinceName ? this.user.provinceName : '';
      const cityText = this.user.cityName ? this.user.cityName : '';
      const countyText = this.user.countyName ? this.user.countyName : '';

      this.tempUser.addrText = provinceText + '  ' + cityText + '  ' + countyText;

      this.tempUser.icon = this.user.userIcon;

      this.tempUser.addrList = [];
      this.tempUser.code = '';
    },

    dataprocess() {
      this.provinces.forEach((province, index1) => {
        const provinceKey = 11 + index1;
        // this.$set(this.provinces[index1], 'key', provinceKey);
        const processedProvinceKey = parseInt(this.paddingRightZero(provinceKey));
        this.$set(this.areaList.province_list, processedProvinceKey, province.areaName);

        if (!province.childrenList) {
          return;
        }

        province.childrenList.forEach((city, index2) => {
          const cityKey = 11 + index2;
          // this.$set(this.provinces[index1].childrenList[index2], 'key', cityKey);
          const processedCityKey = parseInt(this.paddingRightZero(provinceKey.toString() + cityKey));
          this.$set(this.areaList.city_list, processedCityKey, city.areaName);

          if (!city.childrenList) {
            return;
          }

          city.childrenList.forEach((county, index3) => {
            const countyKey = 11 + index3;
            // this.$set(this.provinces[index1].childrenList[index2], 'key', cityKey);
            const processedCountyKey = parseInt(this.paddingRightZero(provinceKey.toString() + cityKey + countyKey));
            this.$set(this.areaList.county_list, processedCountyKey, county.areaName);
          });


        });

      });
    },
    // 图像上传
    onRead(uploader) {
      let param = new FormData();
      param.append('file', uploader.file);
      param.append('token', this.qiniuConfig.token);
      let config = {
        headers:{'Content-Type':'multipart/form-data'}
      };
      this.$http.post('http://up-z2.qiniup.com/', param, config).then((response) => {
        const res = response.data;
        this.tempUser.icon = `${this.qiniuConfig.domain}/${res.key}`;
      });
    },

    cancelSex() {
      this.changeSexFlag = false;
    },

    confirmSex(value) {
      this.tempUser.sex = value;
      this.changeSexFlag = false;
    },

    cancelArea() {
      this.changeAreaFlag = false;
    },

    confirmArea(value) {
      console.log(value);
      let str = '';
      value.forEach((item) => {
        if (item.code !== '-1') {
          str = str + item.name + "  ";
          this.tempUser.addrList.push(item);
        }
      });
      this.tempUser.addrText = str;
      this.changeAreaFlag = false;
    },


    edit() {
      if (!this.user.userNick) {
        Toast.fail({ duration: this.duration, message:  '请填写昵称'});
        return;
      }

      let provinceId = '';
      let cityId = '';
      let countyId = '';

      if (this.tempUser.addrList.length === 3) {
        const provinceCode = this.tempUser.addrList[0].code;
        const cityCode = this.tempUser.addrList[1].code;
        const countyCode = this.tempUser.addrList[2].code;


        const key1 = parseInt(provinceCode.substr(0, 2)) - 11;
        const province = this.provinces[key1];

        provinceId = province.areaId;

        const key2 = parseInt(cityCode.substr(2, 2)) - 11;
        const city = province.childrenList[key2];
        cityId = city.areaId;

        const key3 = parseInt(countyCode.substr(4, 2)) - 11;
        const county = city.childrenList[key3];
        countyId = county.areaId;


      } else if (this.tempUser.addrList.length === 2) {

        const provinceCode = this.tempUser.addrList[0].code;
        const cityCode = this.tempUser.addrList[1].code;

        const key1 = parseInt(provinceCode.substr(0, 2)) - 11;
        const province = this.provinces[key1];
        provinceId = province.areaId;

        const key2 = parseInt(cityCode.substr(2, 2)) - 11;
        const city = province.childrenList[key2];
        cityId = city.areaId;

      } else if (this.tempUser.addrList.length === 1) {
        const provinceCode = this.tempUser.addrList[0].code;

        const key1 = parseInt(provinceCode.substr(0, 2)) - 11;
        const province = this.provinces[key1];
        provinceId = province.areaId;

      } else {
        provinceId = this.user.provinceId;
        cityId = this.user.cityId;
        countyId = this.user.countyId;
      }

      const user = {
        userNick: this.user.userNick,
        userSex: this.tempUser.sex.code || this.user.userSex,
        userHobby: this.user.userHobby,
        details: this.user.details,
        provinceId: provinceId,
        cityId: cityId,
        countyId: countyId,
        userIcon: this.tempUser.icon || this.user.userIcon,
      };

      this.$http.post(`${this.URL_PREFIX}/app/modify/user/info`, {
        ...user,
      }, {
        headers: { token: this.token },
      }).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          Toast.success({ duration: this.duration, message:  '修改信息成功'});
        } else {
          this.errorMsg = res.resDesc;
          Toast.fail({ duration: this.duration, message:  this.errorMsg});
        }
        this.getUserInfo();
      });
    },


    paddingLtftZero(str) {
      let newStr = '00' + str
      return newStr.substr(newStr.length - 2);
    },

    paddingRightZero(str) {
      let newStr = str + '00000000';
      return newStr.substr(0, 6);
    },

  },
  computed: {
    ...mapGetters(['token']),
  },
  created() {
    this.getAllArea();
    if (!this.token) {
      this.$root.eventHub.$emit('login', this.$route.path);
    } else {
      this.getUserInfo();
    }
    this.getUploadToken();
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.account{
  .header{
    margin-bottom: .133333rem;
  }
  .avatar_wrap{
    padding: .4rem;
    margin-bottom: .133333rem;
    background: #fff;
    @include clear-float;
    .label{
      float: left;
      height: 1.6rem;
      line-height: 1.6rem;
    }
    .avarar{
      float: right;
      height: 1.6rem;
      img{
        width: 1.6rem;
        height: 1.6rem;
        border-radius: 50%;
      }
    }
  }

  .footer{
    padding: .106667rem .426667rem;
    margin-top: .4rem;
    box-sizing: border-box;
    width: 100%;
    .mint-button{
      width: 100%;
      height: 1.04rem;
      background: $color-main;
      color: #fff;
      font-size: .48rem;
    }
  }
  .mint-field, .mint-cell{
    margin-bottom: .026667rem;
    height: 1.173333rem;
    line-height: 88px;
    font-size: .4rem;
    color: rgb(67, 67, 67);
  }
}
</style>

