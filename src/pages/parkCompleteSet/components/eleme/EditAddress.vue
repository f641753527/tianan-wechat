<template>
  <div class="address">
    <navigator title="添加收货地址" :routePath='"/submitOrder"'></navigator>

    <mt-field v-model="deliveryAddress.name" label="联系人" placeholder="请输入姓名"/>

    <mt-field v-model="deliveryAddress.phone" type="tel" label="电话" placeholder="请输入手机号"/>

    <mt-cell title="地区" @click.native='changeAreaFlag=true;' :value='areaText' is-link/>

    <mt-field v-model="deliveryAddress.details" label='详细地址'/>


    <div class="footer">
      <van-button class='save' text='保存' @click='saveAddress'/>
    </div>



    <!-- 选择地区 -->
    <van-popup v-model="changeAreaFlag" position="bottom">
      <van-area :area-list="areaList" @cancel='cancelArea' @confirm='confirmArea'/>
    </van-popup>


  </div>
</template>

<script>
import { mapGetters, mapMutations } from 'vuex';
import { Toast } from 'vant';
import deepcopy from '@/utils/deepcopy';

export default {
  data() {
    return {
      deliveryAddress: {
        name: '',
        phone: '',
        provinceCode: '',
        provinceName: '',
        cityCode: '',
        cityName: '',
        countyName: '',
        countCode: '',
        details: '',
      },
      changeAreaFlag: false,
      provinces: [],
      areaList: {
        province_list: {},
        city_list: {},
        county_list: {},
      },
      duration: 1500,
    };
  },

  methods: {
    ...mapMutations(['change_address']),
    getAllArea() {
      this.$http.post(`${this.URL_PREFIX}/app/get/all/area/data`, {}).then((response) => {
        const res = response.data;
        if (res.resCode === '10000') {
          this.provinces = res.resData ? res.resData.pageList[0].childrenList : [];
          this.dataprocess();
        }
      });
    },

    dataprocess() {
      this.provinces.forEach((province, index1) => {
        const provinceKey = 11 + index1;
        const processedProvinceKey = parseInt(this.paddingRightZero(provinceKey));
        this.$set(this.areaList.province_list, processedProvinceKey, province.areaName);

        if (!province.childrenList) {
          return;
        }

        province.childrenList.forEach((city, index2) => {
          const cityKey = 11 + index2;
          const processedCityKey = parseInt(this.paddingRightZero(provinceKey.toString() + cityKey));
          this.$set(this.areaList.city_list, processedCityKey, city.areaName);

          if (!city.childrenList) {
            return;
          }
          city.childrenList.forEach((county, index3) => {
            const countyKey = 11 + index3;
            const processedCountyKey = parseInt(this.paddingRightZero(provinceKey.toString() + cityKey + countyKey));
            this.$set(this.areaList.county_list, processedCountyKey, county.areaName);
          });
        });
      });
    },

    cancelArea() {
      this.changeAreaFlag = false;
    },

    confirmArea(value) {
      if (value[0].code !== '-1') {
        this.deliveryAddress.provinceCode = value[0].code;
        this.deliveryAddress.provinceName = value[0].name;
      } else {
        this.deliveryAddress.provinceCode = '-1';
        this.deliveryAddress.provinceName = '';
      }
      if (value[1].code !== '-1') {
        this.deliveryAddress.cityCode = value[1].code;
        this.deliveryAddress.cityName = value[1].name;
      } else {
        this.deliveryAddress.cityCode = '-1';
        this.deliveryAddress.cityName = '';
      }
      if (value[2].code !== '-1') {
        this.deliveryAddress.countCode = value[2].code;
        this.deliveryAddress.countyName = value[2].name;
      } else {
        this.deliveryAddress.countCode = '-1';
        this.deliveryAddress.countyName = '';
      }

      this.deliveryAddress.details = '';
      
      this.changeAreaFlag = false;
    },


    saveAddress() {
      const phoneReg = /^1[3|4|5|7|8|9][0-9]\d{8}$/;
      if (!this.deliveryAddress.name) {
        Toast.fail({ duration: this.duration, message:  '请填写收货人姓名'});
        return;
      }
      if (!this.deliveryAddress.phone) {
        Toast.fail({ duration: this.duration, message:  '请填写收货人电话'});
        return;
      }
      if (!phoneReg.test(this.deliveryAddress.phone)) {
        Toast.fail({ duration: this.duration, message:  '请填写正确的手机号'});
        return;
      }
      if (this.deliveryAddress.countCode === '-1' && this.deliveryAddress.cityCode.substr(0, 2) !== '45') {
        Toast.fail({ duration: this.duration, message:  '请补全配送地区'});
        return;
      }
      if (!this.deliveryAddress.details) {
        Toast.fail({ duration: this.duration, message:  '请填写详细地址'});
        return;
      }

      this.change_address(this.deliveryAddress);

      this.$router.push('/submitOrder');

    },


    // utils
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
    ...mapGetters(['address']),
    areaText() {
      return this.deliveryAddress.provinceName + this.deliveryAddress.cityName + this.deliveryAddress.countyName;
    },
  },
  created() {
    this.getAllArea();
    if (this.address) {
      this.deliveryAddress = deepcopy(this.address);
    }
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.address{

  .mint-field, .mint-cell{
    height: 1.173333rem;
    line-height: 88px;
    font-size: .4rem;
    color: rgb(67, 67, 67);
  }


  .footer{
    position: fixed;
    padding: .133333rem .426667rem;
    box-sizing: border-box;
    left: 0;
    bottom: 0;
    width: 100%;
    background: rgb(235, 235, 235);
    .save{
      padding: 0;
      width: 100%;
      height: 1.066667rem;
      line-height: 1.066667rem;
      background: $color-main;
      border: none;
      color: #fff;
    }
  }
}
</style>

