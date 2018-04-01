<template>
  <div class='detail' @click.stop='showDetail(info.id)'>
    <div class='top'>
      <p class='header'>{{info.title}}</p>
      <p class='descripe'>
        <span class='salary'>{{info.salary | salaryFilter}}</span>
        <span class='prop'>{{info.education | educationFilter}}</span>
        <span class='line'>&nbsp;</span>
        <span class='prop'>{{info.yearOfWorking | jobFilter}}</span>
      </p>
      <p class='number same'><i class='iconfont icon-renshu'></i><span>招聘{{info.number}}人</span></p>
      <p class='jobstatus same'><i class='iconfont icon-zhiwei'></i><span>{{info.jobType | jobStatus}}</span></p>
    </div>
    <p class='footer'><span class='left'>{{info.corpName}}</span><span class='right'>{{info.createTime | DateFilter}}</span></p>
  </div> 
</template>

<script>
export default {
  props: {
    info: {
      type: Object,
      default() {
        return {};
      },
    },
  },
  methods: {
    showDetail(id) {
      this.$router.push({ path: `/humanResource/jobDetail/${id}` });
    },
  },
  filters: {
    salaryFilter(salary) {
      if (salary === 1) {
        return '面议 ';
      } else if (salary === 2) {
        return '低于2K';
      } else if (salary === 3) {
        return '2-3K';
      } else if (salary === 4) {
        return '3-4.5K';
      } else if (salary === 5) {
        return '4.5-6K';
      } else if (salary === 6) {
        return '6-8K';
      } else if (salary === 7) {
        return '8-10K';
      } else if (salary === 8) {
        return '10-15K';
      } else if (salary === 9) {
        return '15-20K';
      } else if (salary === 10) {
        return '20-30K';
      } else if (salary === 11) {
        return '30-40K';
      } else if (salary === 12) {
        return '40-50K';
      } else if (salary === 13) {
        return '50K以上';
      }
    },
    educationFilter(education) {
      if (education === 1) {
        return '初中及以下';
      } else if (education === 2) {
        return '高中/中技/中专';
      } else if (education === 3) {
        return '大专';
      } else if (education === 4) {
        return '本科';
      } else if (education === 5) {
        return '硕士';
      } else if (education === 6) {
        return '博士';
      }
    },
    jobFilter(year) {
      if (year === 1) {
        return '有无经验均可';
      } else if (year === 2) {
        return '1-3年';
      } else if (year === 3) {
        return '3-5年';
      } else if (year === 4) {
        return '5-10年';
      } else if (year === 5) {
        return '10年以上';
      }
    },
    jobStatus(status) {
      return status === 0 ? '全职' : '兼职';
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~@scss';
.detail{
  margin-bottom: 20px;
  border: 1px solid #c4c4c4;
  .top{
    padding: .4rem;
    background: #ffffff;
    .header{
      line-height: .746667rem;
      font-weight: 700;
      font-size: .453333rem;
      color: rgb(51, 51, 51);
    }
    .descripe{
      font-weight: 600;
      .salary{
        margin-right: .16rem;
        color: $color-main;
        font-size: .4rem;
      }
      .prop{
        color: rgb(51, 51, 51);
        font-size: .266667rem
      }
      .line{
        display: inline-block;
        border-right: 1px solid rgb(51, 51, 51);
        line-height: .266667rem;
        vertical-align: middle;
      }
    }
    .same{
      line-height: .64rem;
      font-size: .32rem;
      color: rgb(51, 51, 51);
      .iconfont{
        color: rgb(153, 153, 153);
        font-size: .32rem;
      }
    }
  }
  .footer{
    @include clear-float;
    padding: 10px 30px;
    background: #f9f9f9;
    font-size: .266667rem;
    color: #666666;
    .left, .right{
      display: inline-block;
      vertical-align: middle;
    }
    .left {
      float: left;
    }
    .right{
      float: right;
    }
  }
}
</style>

