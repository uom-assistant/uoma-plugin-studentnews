<template>
  <header class="header">
    <a href="https://studentnews.manchester.ac.uk/" target="_blank" rel="noopener noreferrer">My <span>Manchester</span> News</a>
    <div class="mode-switch">
      <div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="mode-icon mode-card" :class="{ active: viewMode === 'card' }" @click="viewMode = 'card'"><title>{{ t('cardView') }}</title><path fill="#BBB" d="M0 0h474v1024H0zm550 0h474v1024H550z"/></svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" class="mode-icon mode-list" :class="{ active: viewMode === 'list' }" @click="viewMode = 'list'"><title>{{ t('listView') }}</title><path fill="#BBB" d="M85 597h171V427H85v170zm0 256h171V683H85v170zm0-512h171V171H85v170zm256 256h598V427H341v170zm0 256h598V683H341v170zm0-682v170h598V171H341z"/></svg>
      </div>
    </div>
  </header>
  <div class="loading-container" v-if="loading && postList.length === 0">
    <LoadingBar/>
  </div>
  <div v-if="viewMode === 'card'">
    <PostCard v-for="(post, index) of postList" :key="index" :title="post.title" :content="post.content" :img="post.img" :date="post.date" :href="post.href" :tags="post.tags" :localeString="localeName"/>
  </div>
  <div v-else>
    <PostText v-for="(post, index) of postList" :key="index" :title="post.title" :date="post.date" :href="post.href" :localeString="localeName"/>
  </div>
  <footer class="foot-container" v-if="postList.length > 0" :class="{ end: noMore }">
    <div class="the-end" v-show="noMore">- {{ t('theEnd') }} -</div>
    <div class="load-more" v-show="!noMore && !loading" @click="loadNextPage">{{ t('loadMore') }}</div>
    <LoadingBar class="loading" v-if="loading"/>
  </footer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import 'lazysizes'

import PostCard from './components/PostCard.vue'
import PostText from './components/PostText.vue'
import LoadingBar from './components/LoadingBar.vue'

import i18n from './tools/i18n'
import loadPosts from './tools/loadPosts'

export default defineComponent({
  name: 'App',
  components: {
    PostCard,
    PostText,
    LoadingBar
  },
  setup () {
    const { localeName, locale, t, tf, tDate } = i18n()
    const { postList, page, loading, noMore, loadNextPage } = loadPosts()

    const viewMode = ref('card')

    return {
      localeName,
      locale,
      t,
      tf,
      tDate,
      postList,
      page,
      loading,
      noMore,
      loadNextPage,
      viewMode
    }
  }
})
</script>

<style lang="less">
body {
  margin: 0;
  font-family: "Source Sans Pro", -apple-system, Noto Sans, Helvetica Neue, Helvetica, Nimbus Sans L, Arial, Liberation Sans, PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Source Han Sans SC, Source Han Sans CN, Microsoft YaHei, Wenquanyi Micro Hei, WenQuanYi Zen Hei, ST Heiti, SimHei, WenQuanYi Zen Hei Sharp, sans-serif;
  background-color: #F5F5F5;
  .header {
    font-family: 'Cinzel Decorative', cursive;
    width: 85%;
    max-width: 600px;
    margin: 0 auto;
    text-align: center;
    font-size: 30px;
    padding: 55px 0 40px 0;
    color: #CCCCCC;
    position: relative;
    transition: padding .3s;
    a {
      color: #CCCCCC;
      text-decoration: none;
      transition: color .3s;
      span {
        transition: color .3s;
      }
      &:hover {
        color: #202020;
      }
    }
    .mode-switch {
      position: absolute;
      bottom: 40px;
      left: 0;
      opacity: 0;
      width: 100%;
      text-align: center;
      height: 34px;
      transition: all .3s;
      & > div {
        display: inline-block;
        text-align: center;
        background-color: #E6E6E6;
        height: 34px;
        width: 80px;
        .mode-icon {
          display: inline-block;
          cursor: pointer;
          &.active {
            & > path {
              fill: #202020;
            }
          }
        }
        .mode-card {
          width: 16px;
          height: 24px;
          transform: rotate(90deg) scaleY(1.15);
          margin-right: 12px;
          margin-left: 3px;
        }
        .mode-list {
          width: 24px;
          height: 24px;
        }
      }
    }
    &:hover {
      padding: 30px 0 65px 0;
      a > span {
        color: #202020;
      }
      .mode-switch {
        bottom: 15px;
        opacity: 1;
      }
    }
  }
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: calc(100vh - 195px);
  }
  .foot-container {
    font-family: 'Playfair Display', serif;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 60px;
    margin-bottom: 71px;
    .the-end {
      font-size: 18px;
      color: #CCCCCC;
    }
    .load-more {
      font-size: 20px;
      background-color: #DDDDDD;
      color: #202020;
      width: calc(85% + 6px);
      max-width: 606px;
      text-align: center;
      padding: 15px;
      box-sizing: border-box;
      cursor: pointer;
      border: 0px solid #202020;
      transition: all .2s;
      &:hover {
        background-color: #CCCCCC;
        border-width: 3px;
        padding-top: 12px;
        padding-bottom: 12px;
      }
    }
    .loading {
      margin:26px 0;
    }
    &.end {
      height: 150px;
      margin-bottom: 8px;
    }
  }
  &.dark {
    background-color: #202020;
    .header {
      color: #444444;
      a {
        color: #444444;
        &:hover {
          color: #EEEEEE;
        }
      }
      .mode-switch {
        & > div {
          background-color: #3A3A3A;
          .mode-icon {
            & > path {
              fill: #666666;
            }
            &.active {
              & > path {
                fill: #EEEEEE;
              }
            }
          }
        }
      }
      &:hover {
        a > span {
          color: #EEEEEE;
        }
      }
    }
    .foot-container {
      .the-end {
        color: #444444;
      }
      .load-more {
        background-color: #333333;
        border-color:#EEEEEE;
        color: #EEEEEE;
        &:hover {
          background-color: #444444;
        }
      }
    }
  }
}
</style>
