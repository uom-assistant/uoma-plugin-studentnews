<template>
  <div class="loading-block-container">
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line"></div>
    <div class="line line-short"></div>
  </div>
</template>

<style scoped lang="less">
@keyframes line {
  0% {
    left: -120%;
  }
  100% {
    left: 120%;
  }
}
.loading-block-container {
  .line {
    width: 100%;
    background: #DDDDDD;
    height: 20px;
    margin-bottom: 8px;
    position: relative;
    overflow: hidden;
    &.line-short:before {
      display: block;
      position: absolute;
      top: 0;
      right: 0;
      width: 61.8%;
      height: 100%;
      content: ' ';
      background-color: #F5F5F5;
      z-index: 3;
    }
    &:after {
      display: block;
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      content: ' ';
      background: linear-gradient(90deg, rgba(245, 245, 245, 0), rgba(245, 245, 245, 0.55), rgba(245, 245, 245, 0));
      animation: line 1.2s -0.5s linear infinite;
      z-index: 2;
    }
    @media (min-width: 700px) {
      height: 23px;
      margin-bottom: 12px;
    }
  }
}
</style>

<style lang="less">
body.dark .loading-block-container {
  .line {
    background: #333333;
    &.line-short:before {
      background-color: #202020;
    }
    &:after {
      background: linear-gradient(90deg, rgba(255, 255, 255, 0), rgba(255, 255, 255, 0.15), rgba(255, 255, 255, 0));
    }
  }
}
</style>
