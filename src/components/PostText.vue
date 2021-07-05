<template>
  <article class="list">
    <a :href="href" target="_blank" rel="noopener noreferrer"><h1 v-html="title"/></a>
    <time :datetime="date">{{ tDate(new Date(date)) }}</time>
  </article>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRef } from 'vue'

import i18n from '@/tools/i18n'

export default defineComponent({
  name: 'PostCard',
  props: {
    localeString: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  },
  setup (props) {
    const { localeName, locale, t, tf, tDate } = i18n()

    onMounted(() => {
      localeName.value = toRef(props, 'localeString').value
    })

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
.list {
  width: calc(85% + 6px);
  max-width: 606px;
  color: #202020;
  display: flex;
  justify-content: space-between;
  border-bottom: 2px solid #202020;
  padding: 15px 0;
  margin: 0 auto;
  a {
    color: #202020;
    text-decoration: none;
  }
  h1 {
    font-family: 'Playfair Display', serif;
    font-weight: normal;
    margin: 0;
    font-size: 18px;
    &:hover {
      text-decoration: underline;
    }
  }
  time {
    color: #888888;
    flex-shrink: 0;
    line-height: 24px;
    margin-left: 10px;
  }
  &:last-child {
    border-bottom: none;
    margin-bottom: 20px;
  }
}
</style>

<style lang="less">
body.dark .list {
  color: #EEEEEE;
  border-bottom: 2px solid #EEEEEE;
  a {
    color: #EEEEEE;
  }
}
</style>
