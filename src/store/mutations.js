import cacheInLocalStorage from './localCache/cacheInLocalStorage';
import cacheInSession from './localCache/cacheInSession';

const mutations = {
  change_token(state, token) {  // 修改登录状态
    state.token = token;
    if (token) {
      cacheInLocalStorage.set('token', token);   // 登录成功，记录响应的token
    } else {
      cacheInLocalStorage.remove('token');   // 主动退出, 清除登陆状态
    }
  },
  change_user(state, user) {
    state.user = user;
    if (user) {
      cacheInLocalStorage.set('user', user);  // 登陆成功，记录user信息
    } else {
      cacheInLocalStorage.remove('user');   // 退出登陆，删除该user信息
    }
  },
  change_cartList(state, list) {
    state.selectedList = list;
    if (list) {
      cacheInLocalStorage.set('cartList', list);
    } else {
      cacheInLocalStorage.remove('cartList');
    }
  },
  change_track(state, track) {
    state.track = track;
    if (track) {
      cacheInSession.set('track', track);
    } else {
      cacheInSession.remove('track');
    }
  },
  change_address(state, address) {
    state.address = address;
    if (address) {
      cacheInLocalStorage.set('address', address);
    } else {
      cacheInLocalStorage.remove('address');
    }
  },
  change_curPath(state, path) {
    state.curPath = path;
    if (path) {
      cacheInSession.set('curPath', path);
    } else {
      cacheInSession.remove('curPath');
    }
  },
};

export default mutations;
