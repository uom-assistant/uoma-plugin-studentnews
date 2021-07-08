<template>
  <article :class="{ 'no-img': img.src === '' }" class="viewer">
    <div class="head-img">
      <figure class="img-container" v-if="img.src !== ''">
        <img :data-src="img.src" class="lazyload" :key="img.src">
        <figcaption v-html="cleanedCaption" v-if="cleanedCaption !== ''" :data-readingtime="readingTime === '' ? '' : tf('readingTime', [readingTime])" :class="{ 'has-readingtime': readingTime !== '' && !loading && cleanedCaption !== ''}"/>
      </figure>
      <button class="action-btn close" :title="t('close')" @click="$emit('close')">
        <svg viewBox="0 0 24 24">
          <path fill="#FFF" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z"/>
        </svg>
      </button>
      <button class="action-btn share" :title="t('share')" @click="showShare = !showShare">
        <svg viewBox="0 0 24 24">
          <path fill="#FFF" d="M18,16.08C17.24,16.08 16.56,16.38 16.04,16.85L8.91,12.7C8.96,12.47 9,12.24 9,12C9,11.76 8.96,11.53 8.91,11.3L15.96,7.19C16.5,7.69 17.21,8 18,8A3,3 0 0,0 21,5A3,3 0 0,0 18,2A3,3 0 0,0 15,5C15,5.24 15.04,5.47 15.09,5.7L8.04,9.81C7.5,9.31 6.79,9 6,9A3,3 0 0,0 3,12A3,3 0 0,0 6,15C6.79,15 7.5,14.69 8.04,14.19L15.16,18.34C15.11,18.55 15.08,18.77 15.08,19C15.08,20.61 16.39,21.91 18,21.91C19.61,21.91 20.92,20.61 20.92,19A2.92,2.92 0 0,0 18,16.08Z"/>
        </svg>
      </button>
      <a class="action-btn share-fb" :title="t('shareToFacebook')" :href="`${href}?share=facebook&nb=1`" target="_blank" rel="noopener noreferrer" v-show="showShare">
        <svg viewBox="0 0 24 24">
          <path fill="#FFF" d="M12 2.04C6.5 2.04 2 6.53 2 12.06C2 17.06 5.66 21.21 10.44 21.96V14.96H7.9V12.06H10.44V9.85C10.44 7.34 11.93 5.96 14.22 5.96C15.31 5.96 16.45 6.15 16.45 6.15V8.62H15.19C13.95 8.62 13.56 9.39 13.56 10.18V12.06H16.34L15.89 14.96H13.56V21.96A10 10 0 0 0 22 12.06C22 6.53 17.5 2.04 12 2.04Z"/>
        </svg>
      </a>
      <a class="action-btn share-tw" :title="t('shareToTwitter')" :href="`${href}?share=twitter&nb=1`" target="_blank" rel="noopener noreferrer" v-show="showShare">
        <svg viewBox="0 0 24 24">
          <path fill="#FFF" d="M22.46,6C21.69,6.35 20.86,6.58 20,6.69C20.88,6.16 21.56,5.32 21.88,4.31C21.05,4.81 20.13,5.16 19.16,5.36C18.37,4.5 17.26,4 16,4C13.65,4 11.73,5.92 11.73,8.29C11.73,8.63 11.77,8.96 11.84,9.27C8.28,9.09 5.11,7.38 3,4.79C2.63,5.42 2.42,6.16 2.42,6.94C2.42,8.43 3.17,9.75 4.33,10.5C3.62,10.5 2.96,10.3 2.38,10C2.38,10 2.38,10 2.38,10.03C2.38,12.11 3.86,13.85 5.82,14.24C5.46,14.34 5.08,14.39 4.69,14.39C4.42,14.39 4.15,14.36 3.89,14.31C4.43,16 6,17.26 7.89,17.29C6.43,18.45 4.58,19.13 2.56,19.13C2.22,19.13 1.88,19.11 1.54,19.07C3.44,20.29 5.7,21 8.12,21C16,21 20.33,14.46 20.33,8.79C20.33,8.6 20.33,8.42 20.32,8.23C21.16,7.63 21.88,6.87 22.46,6Z"/>
        </svg>
      </a>
      <a class="action-btn link-to" :title="t('openWebsit')" :href="href" target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 1024 1024">
          <path fill="#FFF" d="M597 128v85h154L331 633l60 60 420-420v154h85V128H597zm214 683H213V213h299v-85H128v768h768V512h-85v299z"/>
        </svg>
      </a>
    </div>
    <h1 v-html="title" :data-readingtime="readingTime === '' ? '' : tf('readingTime', [readingTime])" :class="{ 'has-readingtime': readingTime !== '' && !loading && cleanedCaption === ''}"/>
    <LoadingBlock class="loading" v-if="loading"/>
    <main v-html="content" class="markdown-body" v-else/>
    <div class="tags" v-if="!loading">
      <div>
        <a v-for="(tag, index) in tags" :key="index" :href="tag.link" target="_blank" rel="noopener noreferrer"><span>{{ tag.name }}</span></a>
      </div>
      <time :datetime="date">{{ tf('published', tDate(new Date(date))) }}</time>
    </div>
    <aside v-if="authors.length > 0 && !loading" class="author">
      <div>
        <h2>{{ authors.length > 1 ? t('authors') : t('author') }}</h2>
        <section v-for="(author, index) in authors" :key="index">
          <a :href="author.link" target="_blank" rel="noopener noreferrer" :title="author.name">
            <div class="avatar-container" v-if="author.avatar !== ''">
              <img :data-src="author.avatar" class="lazyload">
            </div>
          </a>
          <div class="author-info">
            <h3>{{ author.name }}</h3>
            <p v-if="author.cleanedDescription !== ''" v-html="author.cleanedDescription"></p>
          </div>
        </section>
      </div>
    </aside>
    <footer v-if="!loading">
      <a :href="previous.href" target="_blank" rel="noopener noreferrer" v-if="previous && previous.href !== ''" class="previous-a" @click.prevent="$emit('open:previous')">
        <article class="previous">
          <span>{{ t('previous') }}<span class="post-date">&nbsp;&nbsp;•&nbsp;&nbsp;{{ tDate(new Date(previous.date)) }}</span></span>
          <h2 v-html="previous.title"/>
          <img :data-src="previous.img" class="lazyload" :key="previous.img" v-if="previous.img !== ''">
          <div class="bg" v-else/>
        </article>
      </a>
      <a v-if="previous && previous.href === ''" class="previous-a a-disabled">
        <article class="previous">
          <span>{{ t('previous') }}</span>
          <h2>{{ t('loading') }}</h2>
        </article>
      </a>
      <a v-if="!previous" class="previous-a a-disabled">
        <article class="previous">
          <span>{{ t('previous') }}</span>
          <h2>{{ t('noPrevious') }}</h2>
        </article>
      </a>
      <a :href="next.href" target="_blank" rel="noopener noreferrer" v-if="next" class="next-a" @click.prevent="$emit('open:next')">
        <article class="next">
          <span><span class="post-date">{{ tDate(new Date(next.date)) }}&nbsp;&nbsp;•&nbsp;&nbsp;</span>{{ t('next') }}</span>
          <h2 v-html="next.title"/>
          <img :data-src="next.img" class="lazyload" :key="next.img" v-if="next.img !== ''">
          <div class="bg" v-else/>
        </article>
      </a>
      <a v-else class="next-a a-disabled">
        <article class="next">
          <span>{{ t('next') }}</span>
          <h2>{{ t('noNext') }}</h2>
        </article>
      </a>
      <div class="divider"><div/></div>
    </footer>
  </article>
</template>

<script lang="ts">
import { defineComponent, onMounted, toRef, PropType, watch, ref } from 'vue'

import LoadingBlock from '@/components/LoadingBlock.vue'

import i18n from '@/tools/i18n'
import loadPost from '@/tools/loadPost'
import watchLocale from '@/tools/watchLocale'
import sanitize from '@/tools/sanitize'

import { tag, author, featuredImage, postPreview } from '@/types/post'

export default defineComponent({
  name: 'PostView',
  emits: ['open:previous', 'open:next', 'close'],
  components: {
    LoadingBlock
  },
  props: {
    localeString: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    img: {
      type: Object as PropType<featuredImage>,
      required: true
    },
    href: {
      type: String,
      required: true
    },
    link: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    },
    authors: {
      type: Object as PropType<author[]>,
      required: true
    },
    tags: {
      type: Object as PropType<tag[]>,
      required: true
    },
    next: Object as PropType<postPreview>,
    previous: Object as PropType<postPreview>
  },
  setup (props) {
    const { localeName, locale, t, tf, tDate } = i18n()
    const { content, readingTime, loading, error, load } = loadPost()
    watchLocale(toRef(props, 'localeString'), localeName)
    const { cleanedCaption } = sanitize(toRef(props, 'img'), toRef(props, 'authors'))

    const showShare = ref(false)
    const link = toRef(props, 'link')

    /**
     * Open a post
     * @param link post link
     */
    const open = (link: string) => {
      content.value = ''
      showShare.value = false
      load(link)
    }

    watch(link, (newValue, oldValue) => {
      // Refresh view when the URL changes
      if (newValue !== oldValue && /https:\/\/studentnews\.manchester\.ac\.uk\/wp-json\/wp\/v2\/posts\/\d{1,}/.test(newValue)) {
        showShare.value = false
        load(newValue)
      }
    })

    onMounted(() => {
      // Load page when mounted
      load(link.value)
    })

    return {
      localeName,
      locale,
      t,
      tf,
      tDate,
      showShare,
      content,
      readingTime,
      loading,
      error,
      load,
      open,
      cleanedCaption
    }
  }
})
</script>

<style scoped lang="less">
.viewer {
  position: fixed;
  top: 30px;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #F5F5F5;
  z-index: 10;
  overflow-y: scroll;
  overflow-x: hidden;
  transition: all .15s;
  opacity: 0;
  .head-img {
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
    .img-container {
      background-color: #DDDDDD;
      padding-top: 61.8%;
      position: relative;
      width: 100%;
      margin: 0;
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
      figcaption {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, .5);
        color: rgba(255, 255, 255, .5);
        padding: 5px 15px;
        box-sizing: border-box;
        font-size: 14px;
        a {
          color: rgba(255, 255, 255, .5);
        }
        &.has-readingtime:after {
          display: inline-block;
          position: absolute;
          top: -40px;
          left: 10px;
          padding: 5px 10px;
          content: attr(data-readingtime);
          background-color: #F5F5F5;
          font-family: "Source Sans Pro", -apple-system, Noto Sans, Helvetica Neue, Helvetica, Nimbus Sans L, Arial, Liberation Sans, PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Source Han Sans SC, Source Han Sans CN, Microsoft YaHei, Wenquanyi Micro Hei, WenQuanYi Zen Hei, ST Heiti, SimHei, WenQuanYi Zen Hei Sharp, sans-serif;
          font-size: 15px;
          color: #202020;
          opacity: 1;
        }
      }
    }
    .action-btn {
      -webkit-appearance: none;
      position: absolute;
      top: 0;
      background-color: #202020;
      border: none;
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      &.close {
        right: 0;
        svg {
          width: 36px;
          height: 36px;
        }
      }
      &.share {
        left: 0;
        svg {
          width: 29px;
          height: 29px;
        }
      }
      &.share-fb {
        left: 0;
        top: 48px;
        svg {
          width: 28px;
          height: 28px;
        }
      }
      &.share-tw {
        left: 0;
        top: 96px;
        svg {
          width: 27px;
          height: 27px;
        }
      }
      &.link-to {
        left: 48px;
        svg {
          width: 30px;
          height: 30px;
        }
      }
      &:hover, &.focus-visible:focus {
        background-color: #000000;
        svg path {
          fill: #AAAAAA
        }
      }
    }
  }
  h1 {
    font-family: 'Playfair Display', serif;
    font-weight: normal;
    background: #202020;
    color: white;
    padding: 25px 20px 28px 20px;
    margin: 0;
    width: 100%;
    max-width: 1000px;
    margin: 0 auto;
    font-size: 25px;
    box-sizing: border-box;
    position: relative;
    z-index: 3;
    &.has-readingtime:after {
      display: inline-block;
      position: absolute;
      top: -15px;
      left: 20px;
      padding: 5px 10px;
      content: attr(data-readingtime);
      background-color: #F5F5F5;
      font-family: "Source Sans Pro", -apple-system, Noto Sans, Helvetica Neue, Helvetica, Nimbus Sans L, Arial, Liberation Sans, PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Source Han Sans SC, Source Han Sans CN, Microsoft YaHei, Wenquanyi Micro Hei, WenQuanYi Zen Hei, ST Heiti, SimHei, WenQuanYi Zen Hei Sharp, sans-serif;
      font-size: 15px;
      color: #202020;
      opacity: 1;
      @media (min-width: 500px) {
        left: 25px;
      }
      @media (min-width: 700px) {
        left: 30px;
      }
    }
    @media (min-width: 500px) {
      font-size: 28px;
      padding: 30px 25px 33px 25px;
    }
    @media (min-width: 700px) {
      font-size: 32px;
      padding: 30px 30px 33px 30px;
    }
  }
  .loading {
    max-width: 1000px;
    margin: 0 auto;
    margin-top: 20px;
    padding: 0 20px;
    @media (min-width: 500px) {
      margin-top: 23px;
      padding: 0 25px;
    }
    @media (min-width: 700px) {
      margin-top: 30px;
      padding: 0 30px;
    }
  }
  .markdown-body {
    font-family: "Source Sans Pro", -apple-system, Noto Sans, Helvetica Neue, Helvetica, Nimbus Sans L, Arial, Liberation Sans, PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Source Han Sans SC, Source Han Sans CN, Microsoft YaHei, Wenquanyi Micro Hei, WenQuanYi Zen Hei, ST Heiti, SimHei, WenQuanYi Zen Hei Sharp, sans-serif;
    max-width: 1000px;
    margin: 0 auto;
    margin-top: 20px;
    font-size: 18px;
    padding: 0 20px;
    @media (min-width: 500px) {
      margin-top: 23px;
      padding: 0 25px;
    }
    @media (min-width: 700px) {
      margin-top: 30px;
      font-size: 20px;
      padding: 0 30px;
    }
  }
  .tags {
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    max-width: 1000px;
    margin: 0 auto;
    margin-top: 35px;
    margin-bottom: 40px;
    padding: 0 20px;
    @media (min-width: 500px) {
      padding: 0 25px;
    }
    @media (min-width: 700px) {
      padding: 0 30px;
    }
    & > div {
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
          font-size: 16px;
          margin-right: 8px;
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
      line-height: 26px;
      font-size: 18px;
    }
  }
  .author {
    padding: 10px 0;
    background-color: #EBEBEB;
    & > div {
      max-width: 1000px;
      margin: 0 auto;
      padding: 0 20px;
      h2 {
        font-family: 'Playfair Display', serif;
        font-weight: normal;
        margin: 10px 0 30px 0;
        font-size: 26px;
      }
      section {
        display: flex;
        margin-bottom: 20px;
        .avatar-container {
          width: 80px;
          height: 80px;
          flex-shrink: 0;
          margin-right: 20px;
          position: relative;
          border-radius: 50%;
          overflow: hidden;
          background-color: #DDDDDD;
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
          @media (min-width: 500px) {
            width: 90px;
            height: 90px;
          }
          @media (min-width: 700px) {
            width: 100px;
            height: 100px;
          }
        }
        .author-info{
          display: flex;
          flex-direction: column;
          justify-content: center;
          h3 {
            color: #202020;
            margin: 0;
            font-size: 20px;
            line-height: 20px;
          }
          p {
            margin: 8px 0;
            color: #666666;
            a {
              color: #666666;
            }
          }
        }
      }
      @media (min-width: 500px) {
        padding: 0 25px;
      }
      @media (min-width: 700px) {
        padding: 0 30px;
      }
    }
    @media (min-width: 500px) {
      padding: 15px 0;
    }
    @media (min-width: 700px) {
      padding: 20px 0;
    }
  }
  footer {
    max-width: 1000px;
    margin: 0 auto;
    display: flex;
    a {
      flex-shrink: 0;
      width: 50%;
      color: #202020;
      text-decoration: none;
      transition: all .2s;
      .previous, .next {
        display: flex;
        flex-direction: column;
        padding-top: 40px;
        padding-bottom: 40px;
        position: relative;
        overflow: hidden;
        justify-content: center;
        height: 75px;
        span {
          transition: all .2s;
          color: #777777;
          font-size: 14px;
          @media (min-width: 500px) {
            font-size: 16px;
          }
        }
        h2 {
          margin: 0;
          font-family: 'Playfair Display', serif;
          font-weight: 500;
          font-size: 18px;
          max-height: 55px;
          overflow : hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          @media (min-width: 500px) {
            font-size: 20px;
          }
        }
        img {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
          object-fit: cover;
          filter: brightness(.4);
        }
        .bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: -2;
          background-color: #202020;
        }
        .post-date {
          display: none;
          @media (min-width: 360px) {
            display: inline;
          }
        }
        &:after {
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          content: ' ';
          background: #F5F5F5;
          z-index: -1;
          transition: all .3s;
        }
      }
      &:hover:not(.a-disabled), &.focus-visible:focus:not(.a-disabled) {
        color: #EEEEEE;
        .previous, .next {
          span {
            color: #999999;
          }
        }
        .previous {
          &:after {
            left: -100%;
          }
        }
        .next {
          &:after {
            left: 100%;
          }
        }
        & ~ .divider {
          opacity: 0;
          transition: opacity 0s 0s;
        }
      }
      &.previous-a {
        order: 1;
      }
      &.next-a {
        order: 3;
      }
      &.a-disabled {
        pointer-events: none;
        h2 {
          opacity: .6;
        }
      }
    }
    .previous {
      text-align: left;
      padding-left: 20px;
      padding-right: 20px;
      transition: all .3s;
      @media (min-width: 500px) {
        padding-left: 25px;
      }
      @media (min-width: 700px) {
        padding-left: 30px;
      }
      @media (min-width: 1017px) {
        padding-left: 0;
        padding-right: 45px;
      }
    }
    .next {
      text-align: right;
      padding-right: 20px;
      padding-left: 20px;
      transition: all .3s;
      @media (min-width: 500px) {
        padding-right: 25px;
      }
      @media (min-width: 700px) {
        padding-right: 30px;
      }
      @media (min-width: 1017px) {
        padding-right: 0;
        padding-left: 45px;
      }
    }
    .divider {
      width: 0;
      height: 155px;
      display: flex;
      align-items: center;
      order: 2;
      opacity: 1;
      transition: opacity 0s 0.3s;
      & > div {
        position: relative;
        width: 0;
        height: 70px;
        &:after {
          width: 2px;
          align-items: center;
          position: absolute;
          top: 0;
          left: -1px;
          height: 100%;
          content: ' ';
          background-color: #DDDDDD;
        }
      }
    }
    @media (min-width: 1017px) {
      padding: 0 30px;
      a:hover:not(.a-disabled), a.focus-visible:focus:not(.a-disabled) {
        .previous {
          padding-left: 30px;
          padding-right: 15px;
        }
        .next {
          padding-right: 30px;
          padding-left: 15px;
        }
      }
    }
  }
  &.opened {
    top: 0;
    opacity: 1;
  }
  &.no-scroll {
    overflow: hidden;
  }
  &.no-img {
    .head-img {
      height: 48px;
      background-color: #202020;
      .action-btn {
        background-color: #333333;
        &:hover, &.focus-visible:focus {
          background-color: #000000;
        }
      }
    }
    h1 {
      padding: 35px 20px 55px 20px;
      z-index: 1;
      &.has-readingtime:after {
        top: calc(100% - 55px);
        background-color: transparent;
        color: #666666;
        padding-left: 0;
        font-size: 16px;
      }
      @media (min-width: 500px) {
        padding: 45px 25px 65px 25px;
        &.has-readingtime:after {
          top: calc(100% - 65px);
        }
      }
      @media (min-width: 700px) {
        padding: 45px 30px 70px 30px;
        &.has-readingtime:after {
          top: calc(100% - 70px);
        }
      }
    }
  }
}
</style>

<style lang="less">
body .viewer {
  .head-img {
    .img-container {
      figcaption {
        a {
          color: rgba(255, 255, 255, .5);
        }
      }
    }
  }
  .markdown-body {
    a {
      color: #555555;
      text-decoration: underline;
      &:hover, &.focus-visible:focus {
        background-color: #202020;
        color: white;
        text-decoration: none;
      }
    }
    figure {
      margin: 12px 0;
      &.video-iframe {
        margin: 16px 0;
        &.video-16-9, &.video-unknown {
          & > div {
            padding-top: 56.25%;
          }
        }
        &.video-16-10 {
          & > div {
            padding-top: 62.6%;
          }
        }
        &.video-4-3 {
          & > div {
            padding-top: 75%;
          }
        }
        & > div {
          position: relative;
          & > span {
            position: absolute;
            top: 0;
            left: 0;
            display: block;
            width: 100%;
            height: 100%;
            & > iframe {
              width: 100%;
              height: 100%;
            }
          }
        }
      }
    }
  }
}
body.dark .viewer {
  background-color: #202020;
  color: #EEEEEE;
  .head-img {
    .img-container {
      background-color: #282828;
      img {
        filter: brightness(0.8);
      }
    }
    .action-btn {
      background-color: #333333;
    }
  }
  h1 {
    background: #333333;
    font-weight: 500;
  }
  .markdown-body {
    color: #EEEEEE;
    a {
      color: #AAAAAA;
      &:hover, &.focus-visible:focus {
        background-color: #EEEEEE;
        color: #202020;
      }
    }
  }
  .tags {
    & > div {
      color: #888888;
      a {
        color: #EEEEEE;
        span {
          background: #333333;
        }
        &:hover, &:focus {
          span {
            background: #444444;
          }
        }
      }
    }
    time {
      color: #888888;
    }
  }
  .author {
    background-color: #181818;
    & > div {
      section {
        .avatar-container {
          background-color: #333333;
        }
        .author-info{
          h3 {
            color: #EEEEEE;
          }
          p {
            color: #999999;
            a {
              color: #999999;
            }
          }
        }
      }
    }
  }
  footer {
    a {
      color: #EEEEEE;
      .previous, .next {
        .bg {
          background-color: #333333;
        }
        &:after {
          background: #202020;
        }
      }
    }
    .divider {
      & > div {
        &:after {
          background-color: #666666;
        }
      }
    }
  }
  &.no-img {
    .head-img {
      background-color: #333333;
      .action-btn {
        background-color: #282828;
      }
    }
    h1 {
      &.has-readingtime:after {
        color: #999999;
      }
    }
  }
}
</style>
