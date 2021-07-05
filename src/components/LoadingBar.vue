<template>
  <div class="loading-bar-container">
    <div class="bar-1"></div>
    <div class="bar-2"></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LoadingBar'
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
@keyframes bar1 {
  0% {
    right: 110%;
    width: 20px;
  }
  50% {
    right: -125%;
    width: 250px;
  }
  100% {
    right: -125%;
    width: 250px;
  }
}
@keyframes bar2 {
  0% {
    right: 100%;
    width: 250px;
  }
  60% {
    right: 100%;
    width: 250px;
  }
  100% {
    right: -10%;
    width: 20px;
  }
}
.loading-bar-container {
  background-color: #CCCCCC;
  height: 5px;
  overflow: hidden;
  position: relative;
  width: 200px;
  .bar-1, .bar-2 {
    background-color: #202020;
    position: absolute;
    top: 0;
    height: 100%;
  }
  .bar-1 {
    animation: bar1 infinite 2.2s ease-in;
  }
  .bar-2 {
    animation: bar2 infinite 2.2s -.3s ease-out;
  }
}
</style>

<style lang="less">
body.dark .loading-bar-container {
  background-color: #444444;
  .bar-1, .bar-2 {
    background-color: #EEEEEE;
  }
}
</style>
