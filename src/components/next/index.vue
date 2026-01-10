<template>
  <div class="next">
    <div v-for="(item,index) in block">
      <b :class="e ? 'active type-' + e : ''" v-for="(e,k2) in item">德</b>
    </div>
  </div>
</template>

<script src="./index.js">
</script>


<style lang="less">
@import './index.less';
</style>