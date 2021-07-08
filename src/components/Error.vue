<template>
  <div class="error">
    <h2>{{ t('loadError') }}</h2>
    <button @click="$emit('retry')">{{ t('retry') }}</button>
  </div>
</template>

<script lang="ts">
import i18n from '@/tools/i18n'
import watchLocale from '@/tools/watchLocale'
import { defineComponent, toRef } from 'vue'

export default defineComponent({
  name: 'Error',
  emits: ['retry'],
  props: {
    localeString: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { localeName, locale, t, tf, tDate } = i18n()
    watchLocale(toRef(props, 'localeString'), localeName)

    return {
      localeName,
      locale,
      t,
      tf,
      tDate
    }
  }
})
</script>

<style scoped lang="less">
.error {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  h2 {
    margin: 0 0 20px 0;
    font-weight: normal;
    font-size: 28px;
    color: #666666;
  }
  button {
    -webkit-appearance: none;
    font-family: 'Playfair Display', serif;
    font-size: 18px;
    background-color: #DDDDDD;
    color: #202020;
    width: 100%;
    text-align: center;
    padding: 12px;
    box-sizing: border-box;
    cursor: pointer;
    border: 0px solid #202020;
    transition: all .2s;
    &:hover, &:focus {
      background-color: #CCCCCC;
      border-width: 3px;
      padding-top: 9px;
      padding-bottom: 9px;
    }
  }
}
</style>

<style lang="less">
body.dark .error {
  h2 {
    color: #999999;
  }
  button {
    background-color: #333333;
    border-color:#EEEEEE;
    color: #EEEEEE;
    &:hover, &:focus {
      background-color: #444444;
    }
  }
}
</style>
