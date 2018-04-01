import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/pages/auth/Login';
import Regist from '@/pages/auth/Regist';
import AuthorizeCb from '@/pages/auth/AuthorizeCb';
import AlreadyRegist from '@/pages/auth/AlreadyRegist';
// 首页
import Index from '@/pages/index/Index';
import ScanCode from '@/pages/index/ScanCode';
// 通知
import Notice from '@/pages/notice/Notice';
import NoticeList from '@/pages/notice/NoticeList';
// 物业平台
import Property from '@/pages/property/Property';
import PropertyDetiles from '@/pages/property/Detiles';
// 商业平台
import Business from '@/pages/business/Business';
import BusinessList from '@/pages/business/List';
import Recommend from '@/pages/business/child/Recommend';
import MeetingRoom from '@/pages/business/child/MeetingRoom';
import Equipment from '@/pages/business/child/Equipment';
import RecommendInfo from '@/pages/business/child/RecommendInfo';
import EquipmentInfo from '@/pages/business/child/EquipmentInfo';
import OfficeDetalis from '@/pages/business/components/detalis/OfficeDetalis';
import OfficeAppointment from '@/pages/business/components/detalis/OfficeAppointment';

// 政务平台
import GovernmentAffairs from '@/pages/governmentAffairs/GovernmentAffairs';
import GovernmentDetiles from '@/pages/governmentAffairs/Detiles';
// 金融服务
import Finance from '@/pages/finance/Finance';
import FinanceDetalis from '@/pages/finance/components/FinanceDetalis';
// 人力资源
import HumanResource from '@/pages/humanResource/HumanResource';
import JobDetail from '@/pages/humanResource/components/JobDetail';
import ServiceDetail from '@/pages/humanResource/components/ServiceDetail';
import EduDetail from '@/pages/humanResource/components/EduDetail';
// 园区配套
import ParkCompleteSet from '@/pages/parkCompleteSet/ParkCompleteSet';
import ActivitiesDetalis from '@/pages/parkCompleteSet/components/detalis/ActivitiesDetalis';
import ExclusiveDetalis from '@/pages/parkCompleteSet/components/detalis/ExclusiveDetalis';
import ActivityForm from '@/pages/parkCompleteSet/components/detalis/ActivityForm';
import SellerDetail from '@/pages/parkCompleteSet/components/eleme/SellerDetail';
import SubmitOrder from '@/pages/parkCompleteSet/components/eleme/SubmitOrder';
import EditAddress from '@/pages/parkCompleteSet/components/eleme/EditAddress';
import WechatPay from '@/pages/parkCompleteSet/components/eleme/WechatPay';
// 产品路演
import Production from '@/pages/production/Production';
import ProductionDetail from '@/pages/production/ProductionDetail';
// 信息交互
import Bbs from '@/pages/bbs/Bbs';
import NeedBuyDetalis from '@/pages/bbs/components/NeedBuyDetalis';
// 后台管理
import Backstage from '@/pages/backstage/Backstage';
import Personal from '@/pages/personal/Personal';
import UserIndex from '@/pages/personal/UserIndex';
import EditInfo from '@/pages/personal/EditInfo';
import EditCard from '@/pages/personal/EditCard';
import OrderList from '@/pages/personal/OrderList';
import OrderDetail from '@/pages/personal/OrderDetail';
import RightDetail from '@/pages/personal/RightDetail';

// 商城
import ShoppingMall from '@/pages/shoppingMall/ShoppingMall';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/index',
    },
    // 登录
    {
      path: '/auth/login',
      component: Login,
    },
    // 注册
    {
      path: '/auth/regist',
      component: Regist,
    },
    {
      path: '/auth/authorizeCb',
      component: AuthorizeCb,
    },
    // 已经注册
    {
      path: '/auth/already',
      component: AlreadyRegist,
    },
    // 首页
    {
      path: '/index',
      name: 'index',
      component: Index,
    },
    // 通知
    {
      path: '/notice/:noticeid',
      component: Notice,
    },
    {
      path: '/noticelist',
      component: NoticeList,
    },
    // 物业服务
    { 
      path: '/property',
      component: Property,
    },
    { 
      path: '/propertyDetiles/:serviceId',
      component: PropertyDetiles,
    },
    // 商务服务
    {
      path: '/business',
      component: Business,
      children: [
        {
          path: '/',
          redirect: 'businessList',
        },
        {
          path: 'businessList',
          component: BusinessList,
          children: [
            {
              path: 'recommend',
              component: Recommend,
            },
            {
              path: 'meetingRoom/:serviceId',
              component: MeetingRoom,
            },
            {
              path: 'equipment/:serviceId',
              component: Equipment,
            },
          ],
        },
        {
          path: 'recommendInfo/:serviceId',
          component: RecommendInfo,
        },
        {
          path: 'EquipmentInfo/:facilitiesId',
          component: EquipmentInfo,
        },
        {
          path: 'officeDetalis/:serviceId/:officeDetalisId',
          component: OfficeDetalis,
        },
        {
          path: 'officeAppointment/:serviceId/:officeAppointmentId',
          component: OfficeAppointment,
        },
      ]
    },
    // 政务平台
    {
      path: '/governmentAffairs',
      component: GovernmentAffairs,
    },
    { 
      path: '/governmentDetiles/:serviceId',
      component: GovernmentDetiles,
    },
    // 金融服务
    {
      path: '/finance',
      component: Finance,
    },
    {
      path: '/financeDetalis/:serviceId',
      component: FinanceDetalis,
    },
    // 人力资源
    {
      path: '/humanResource',
      component: HumanResource,
    },
    {
      path: '/humanResource/jobDetail/:id',
      component: JobDetail,
    },
    {
      path: '/humanResource/serviceDetail/:id',
      component: ServiceDetail,
    },
    {
      path: '/humanResource/eduDetail/:id',
      component: EduDetail,
    },
    //  园区配套
    {
      path: '/parkCompleteSet',
      component: ParkCompleteSet,
    },
    {
      path: '/activitiesDetalis/:activitiesDetalisId',
      component: ActivitiesDetalis,
    },
    {
      path: '/exclusiveDetalis/:exclusiveDetalisId',
      component: ExclusiveDetalis,
    },
    {
      path: '/activityForm/:activityFormId',
      component: ActivityForm,
    },
    {
      path: '/sellerDetail/:id',
      component: SellerDetail,
    },
    {
      path: '/submitOrder',
      component: SubmitOrder,
    },
    {
      path: '/smark/pay/wechat',
      component: WechatPay,
    },
    {
      path: '/eleme/editAddress',
      component: EditAddress,
    },
    // 产品路演
    {
      path: '/production',
      component: Production,
    },
    {
      path: '/production/detail/:productionId',
      component: ProductionDetail,
    },
    // bbs
    {
      path: '/bbs',
      component: Bbs,
    },
    {
      path: '/needBuyDetalis/:needBuyDetalisId',
      component: NeedBuyDetalis,
    },
    // 后台管理
    {
      path: '/backstage',
      component: Backstage,
    },
    // 个人中心
    {
      path: '/personal',
      component: Personal,
      children: [
        {
          path: '/',
          component: UserIndex,
        },
        {
          path: 'editCard',
          component: EditCard,
        },
        {
          path: 'editInfo',
          component: EditInfo,
        },
        {
          path: 'orderList',
          component: OrderList,
        },
        {
          path: 'orderDetail',
          component: OrderDetail,
        },
        {
          path: 'rightDetail/:serviceId',
          component: RightDetail,
        },
      ],
    },
    // 扫码
    {
      path: '/smark/pay/scan',
      component: ScanCode,
    },
    // 商城
    {
      path: '/shoppingMall',
      component: ShoppingMall,
    }
  ],
  scrollBehavior (to, from, savedPosition) {
  // return 期望滚动到哪个的位置
  window.scrollTo(0, 0);
  },
  mode: 'history',
})
