const getter = {
  token: state => state.token,
  user: state => state.user,
  parkIdList: state => state.parkIdList,
  cartList: state => state.cartList,
  track: state => state.track,
  address: state => state.address,
  curPath: state => state.curPath,
};

export default getter;
