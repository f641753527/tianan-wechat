import Vue from 'vue';
import Vuex from 'vuex';
import getters from './getters';
import mutations from './mutations';
import cacheInLocalStorage from './localCache/cacheInLocalStorage';
import cacheInSession from './localCache/cacheInSession';
import moduleA from './modules/a';
import moduleB from './modules/b';

Vue.use(Vuex);

const initState = {
  token: cacheInLocalStorage.get('token') || '',
  user: cacheInLocalStorage.get('user') || {},
  parkIdList: ['1000'],
  // 购物车列表
  cartList: cacheInLocalStorage.get('cartList') || [],
  track: cacheInSession.get('track') || '',
  address: cacheInLocalStorage.get('address') || '',
  curPath: cacheInSession.get('curPath') || '',
};


export default new Vuex.Store({
  getters,
  mutations,
  state: initState,
  modules: {
    a: moduleA,
    b: moduleB,
  }
});

