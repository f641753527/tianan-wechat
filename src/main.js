// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Mint from 'mint-ui';
import Vant from 'vant';
import 'vant/lib/vant-css/index.css';
import Es6Promise from 'es6-promise';
import router from './router'
import Store from './store/index';
import axios from 'axios';
import { priceFilter, sexFilter, jsTimestampFilter } from '@/utils/filters';
import App from './App';
import { getMD5 } from '@/utils/md5';
import Navigator from '@/components/Navigator';
import ErrorMsg from '@/components/ErrorMsg';
import CustomForm from '@/components/CustomForm';
import FastClick from 'fastclick';
import { Waterfall } from 'vant';
import apiUrl from '@/static/backstageUrl';
import '../src/static/flexible.js';

import 'mint-ui/lib/style.css';
import '@/static/my-mint.scss';
import '@/static/reset.css';
import '@/static/site.css'
import '@/static/font/iconfont.css';

Es6Promise.polyfill();

Vue.component('Navigator', Navigator);
Vue.component('ErrorMsg', ErrorMsg);
Vue.component('CustomForm', CustomForm);

Vue.prototype.$http = axios;
axios.defaults.headers['clientType'] = '5';
axios.defaults.headers['version'] = '1.0';
// axios.defaults.headers['token'] = Store.state.token;
axios.defaults.headers['auth'] = '4f7087695bc9025846ccfdb39495f109';

Vue.prototype.URL_PREFIX = '';
if (process.env.NODE_ENV !== 'development') {
  Vue.prototype.URL_PREFIX = apiUrl.apiUrl;
}

Vue.prototype.URL_PREFIX_PAGE = apiUrl.wxUrl;

Vue.prototype.MD5 = function MD5(value) {
  return getMD5(value);
};

Vue.filter('SexState', sexFilter);
Vue.filter('PriceFilter', priceFilter);
Vue.filter('DateFilter', jsTimestampFilter);

Vue.use(Mint);
Vue.use(Vant);
Vue.use(Waterfall);

FastClick.attach(document.body);

Vue.config.productionTip = false;

/* eslint-disable no-new */
const root = new Vue({
  el: '#app',
  router,
  store: Store,
  render: h => h(App),
  data: {
    eventHub: new Vue(),
  },
})

axios.interceptors.response.use(function (response) {  
  // token过期错误码
  if (response.data.resCode === '10004'){
    Store.commit('change_token', '');
    root.$root.eventHub.$emit('login', root.$route.path);
  }
  return response  
}, function (error) {  
  // Do something with response error  
  return Promise.reject(error)  
})

