<template>
  <article :class="{ 'no-img': img === '' }" class="card">
    <a :href="href" target="_blank" rel="noopener noreferrer" @click.prevent="$emit('open')" :tabindex="disaledTab ? '-1' : ''">
      <div class="img-container" :title="title" v-if="img !== ''">
        <img :data-src="img" class="lazyload">
      </div>
      <h1 v-html="title"/>
    </a>
    <div v-if="readingTime !== null" class="reading-time">{{ tf('readingTime', [readingTime]) }}</div>
    <p>{{ contentText }}</p>
    <footer>
      <div>
        <a v-for="(tag, index) in tags" :key="index" :href="tag.link" target="_blank" rel="noopener noreferrer" :tabindex="disaledTab ? '-1' : ''"><span>{{ tag.name }}</span></a>
      </div>
      <time :datetime="date">{{ tDate(new Date(date)) }}</time>
    </footer>
  </article>
</template>

<script lang="ts">
import { defineComponent, toRef, PropType } from 'vue'

import i18n from '@/tools/i18n'
import watchLocale from '@/tools/watchLocale'
import parsePreview from '@/tools/parsePreview'

import { tag } from '@/types/post'

export default defineComponent({
  name: 'PostCard',
  emits: ['open'],
  props: {
    localeString: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    content: {
      type: String,
      required: true
    },
    img: {
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
    },
    tags: {
      type: Object as PropType<tag[]>,
      required: true
    },
    disaledTab: {
      type: Boolean,
      required: true
    }
  },
  setup (props) {
    const { localeName, locale, t, tf, tDate } = i18n()
    watchLocale(toRef(props, 'localeString'), localeName)
    const { readingTime, contentText } = parsePreview(toRef(props, 'content'))

    return {
      localeName,
      locale,
      t,
      tf,
      tDate,
      contentText,
      readingTime
    }
  }
})
</script>

<style scoped lang="less">
.card {
  width: 92%;
  max-width: 700px;
  border: 3px solid #202020;
  margin: 10px auto;
  color: #202020;
  position: relative;
  & > img {
    width: 100%;
  }
  a {
    text-decoration: none;
    .img-container {
      background-color: #DDDDDD;
      padding-top: 61.8%;
      position: relative;
      img {
        position: absolute;
        top: 0;
        left: 0;
        object-fit: cover;
        width: 100%;
        height: 100%;
        transition: opacity .3s;
        &.lazyload, &.lazyloading {
          opacity: 0;
        }
        &.lazyloaded {
          opacity: 1;
        }
      }
    }
    &.focus-visible:focus {
      h1 {
        padding-left: 30px;
        text-decoration: underline;
      }
      & + .reading-time {
        display: inline-block;
      }
    }
  }
  .reading-time {
    position: absolute;
    right: 0;
    top: 0;
    background-color: #202020;
    z-index: 5;
    color: white;
    padding: 2px 5px 5px 8px;
    font-size: 16px;
    display: none;
  }
  h1 {
    font-family: 'Playfair Display', serif;
    font-weight: normal;
    background: #202020;
    color: white;
    padding: 15px 20px 18px 20px;
    margin: 0;
    width: auto;
    max-width: 82%;
    margin-top: -40px;
    position: relative;
    z-index: 2;
    font-size: 22px;
    transition: padding .2s;
    display: table;
    word-break: break-word;
    &:hover {
      text-decoration: underline;
      padding-left: 30px;
    }
  }
  p {
    padding: 0 20px;
    margin: 15px 0;
    font-size: 16px;
    word-break: break-word;
  }
  footer {
    padding: 0 20px;
    padding-bottom: 15px;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    div {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      color: #888888;
      a {
        color: #202020;
        span {
          background: #DDDDDD;
          display: inline-block;
          padding: 3px 6px;
          font-size: 14px;
          margin-right: 5px;
        }
        &:hover, &:focus {
          span {
            background: #D5D5D5;
            text-decoration: underline;
          }
        }
      }
    }
    time {
      color: #888888;
      flex-shrink: 0;
      line-height: 24px;
    }
  }
  &:hover {
    .reading-time {
      display: inline-block;
    }
  }
  &.no-img{
    .reading-time {
      background-color: #333333;
    }
    a {
      h1 {
        padding: 30px 20px 33px 20px;
        width: calc(100% - 37px);
        max-width: calc(100% - 37px);
        display: block;
        margin-top: 0;
        font-size: 25px;
      }
      &:hover, &.focus-visible:focus {
        h1 {
          padding-left: 30px;
          padding-right: 10px;
        }
      }
    }
  }
}
</style>

<style lang="less">
body.dark .card {
  border: 3px solid #EEEEEE;
  color: #EEEEEE;
  a {
    .img-container {
      background-color: #333333;
      img {
        filter: brightness(.8);
      }
    }
  }
  .reading-time {
    background-color: #EEEEEE;
    color: #202020;
  }
  h1 {
    background: #EEEEEE;
    color: #202020;
    font-weight: 500;
  }
  footer {
    div {
      a {
        color: #EEEEEE;
        span {
          background: #333333;
          &:hover, &:focus {
            background: #444444;
          }
        }
      }
    }
    time {
      color: #888888;
    }
  }
  &.no-img{
    .reading-time {
      background-color: #CCCCCC;
    }
  }
}
</style>
