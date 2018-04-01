<template>
  <div>
  </div>
</template>

<script>
import { Indicator } from 'mint-ui';

export default {
  mounted() {
    Indicator.open({
      text: '内容即将上线，敬请期待!',
      spinnerType: 'fading-circle'
    });
  },
  beforeDestroy() {
    Indicator.close();
  }
}
</script>
