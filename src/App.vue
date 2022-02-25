<template>
  <header class="header">
    <a href="https://studentnews.manchester.ac.uk/" target="_blank" rel="noopener noreferrer" :tabindex="showPostView ? '-1' : ''">My <span>Manchester</span> News</a>
    <div class="mode-switch">
      <div>
        <svg viewBox="0 0 1024 1024" class="mode-icon mode-card" :class="{ active: viewMode === 'card' }" @click="changeModeTo('card')" @keypress.enter="changeModeTo('card')" :tabindex="showPostView ? '-1' : '0'"><title>{{ t('cardView') }}</title><path fill="#BBB" d="M0 0h474v1024H0zm550 0h474v1024H550z"/></svg>
        <svg viewBox="0 0 1024 1024" class="mode-icon mode-list" :class="{ active: viewMode === 'list' }" @click="changeModeTo('list')" @keypress.enter="changeModeTo('list')" :tabindex="showPostView ? '-1' : '0'"><title>{{ t('listView') }}</title><path fill="#BBB" d="M85 597h171V427H85v170zm0 256h171V683H85v170zm0-512h171V171H85v170zm256 256h598V427H341v170zm0 256h598V683H341v170zm0-682v170h598V171H341z"/></svg>
        <svg viewBox="0 0 1024 1024" class="mode-icon mode-refresh" :class="{ loading: loading && !error }" @click="refresh" @keypress.enter="refresh" :tabindex="showPostView ? '-1' : '0'"><title>{{ t('refresh') }}</title><path fill="#BBB" d="M832 704l192-224H895a385 385 0 00-313-346h-5l-3-1c-20-3-41-5-62-5h-1a384 384 0 00-373 297l-2 7v3l-1 4-1 5v2l-2 8c-2 13-3 25-3 38v2l-1 8v20l1 8v2c0 13 2 26 3 38v1l2 7v2l1 5 1 4v3l2 7a385 385 0 00374 297c86 0 166-28 234-81l15-12-87-93-12 10a256 256 0 11-150-464c133 0 246 93 259 224H624l208 224z"/></svg>
      </div>
    </div>
  </header>
  <div class="loading-container" v-if="(loading || error) && postList.length === 0">
    <LoadingBar v-if="loading && !error"/>
    <Error v-if="!loading && error" :localeString="localeName" @retry="loadNextPage" class="error-block"/>
  </div>
  <PostView :title="selectedPost.title" :img="selectedPost.img" :date="selectedPost.date" :href="selectedPost.href" :link="selectedPost.link" :authors="selectedPost.authors" :tags="selectedPost.tags" :localeString="localeName" :next="next" :previous="previous" :class="{ opened: showPostViewAnimation, 'no-scroll': !postViewScroll }" v-if="selectedPost !== null" v-show="showPostView" @open:next="openPost(openedIndex - 1)" @open:previous="openPost(openedIndex + 1)" @close="closePost"/>
  <main v-if="viewMode === 'card' && postList.length > 0">
    <PostCard v-for="(post, index) of postList" :key="post.id" :title="post.title" :content="post.content" :img="post.img.src" :date="post.date" :href="post.href" :tags="post.tags" :localeString="localeName" :disaledTab="showPostView" @open="openPost(index)"/>
  </main>
  <main v-if="viewMode === 'list' && postList.length > 0">
    <PostText v-for="(post, index) of postList" :key="post.id" :title="post.title" :date="post.date" :href="post.href" :disaledTab="showPostView" :localeString="localeName" @open="openPost(index)"/>
  </main>
  <footer class="foot-container" v-if="postList.length > 0" :class="{ end: noMore, 'on-error': error }">
    <div class="the-end" v-show="noMore">- {{ t('theEnd') }} -</div>
    <button class="load-more" v-show="!noMore && !loading && !error" @click="loadNextPage(true)" :tabindex="showPostView ? '-1' : ''">{{ t('loadMore') }}</button>
    <LoadingBar class="loading" v-if="loading && !error"/>
    <Error v-if="!loading && error" :localeString="localeName" @retry="loadNextPage" class="error-block-list"/>
  </footer>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import 'lazysizes'
import 'focus-visible'

import 'github-markdown-css'

import PostCard from './components/PostCard.vue'
import PostText from './components/PostText.vue'
import LoadingBar from './components/LoadingBar.vue'
import PostView from './components/PostView.vue'
import Error from './components/Error.vue'

import i18n from './tools/i18n'
import loadPosts from './tools/loadPosts'
import postListView from './tools/postListView'
import darkMode from './tools/darkMode'
import viewPost from './tools/viewPost'

import localeList from '@/tools/locales'

const { localeName, t } = i18n()
const { postList, loading, error, noMore, loadNextPage, refresh } = loadPosts()
const { viewMode, changeModeTo } = postListView()
const { dark } = darkMode()
const { showPostView, showPostViewAnimation, postViewScroll, selectedPost, openPost, closePost, openedIndex, previous, next } = viewPost(postList, noMore, loadNextPage)

onMounted(() => {
  // Read initial settings from URl query
  const urlParams = new URLSearchParams(window.location.search)
  localeName.value = localeList[urlParams.get('locale') || 'en'] ? (urlParams.get('locale') || 'en') : 'en'
  dark.value = (urlParams.get('dark') || 'false') === 'true'

  const parentOrigin = urlParams.get('origin') || ''

  window.addEventListener('message', (event) => {
    if (event.origin !== parentOrigin) {
      return
    }
    const data = JSON.parse(event.data)
    for (const action of data) {
      if (action.type === 'dark') {
        dark.value = action.payload
      } else if (action.type === 'locale') {
        localeName.value = localeList[action.payload] ? action.payload : 'en'
      }
    }
  }, false)
})
</script>

<style lang="less">
@keyframes spinning {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
body {
  margin: 0;
  font-family: "Source Sans Pro", -apple-system, Noto Sans, Helvetica Neue, Helvetica, Nimbus Sans L, Arial, Liberation Sans, PingFang SC, Hiragino Sans GB, Noto Sans CJK SC, Source Han Sans SC, Source Han Sans CN, Microsoft YaHei, Wenquanyi Micro Hei, WenQuanYi Zen Hei, ST Heiti, SimHei, WenQuanYi Zen Hei Sharp, sans-serif;
  background-color: #F5F5F5;
  *:focus:not(.focus-visible) {
    outline: 0;
  }
  * {
    -webkit-tap-highlight-color: transparent;
  }
  .header {
    font-family: 'Cinzel Decorative', cursive;
    width: 85%;
    max-width: 700px;
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
      &:hover, &:focus {
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
        width: 124px;
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
          padding-right: 12px;
          border-right: 2px solid #D2D2D2;
        }
        .mode-refresh {
          padding-left: 9.5px;
          margin-right: -3px;
          width: 23px;
          height: 24px;
          transform-origin: 21.1px 12.3px;
          &.loading {
            animation: spinning 1s infinite linear;
          }
        }
      }
    }
    &:hover, &:focus-within {
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
    .error-block {
      width: 200px;
    }
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
      -webkit-appearance: none;
      font-family: 'Playfair Display', serif;
      font-size: 20px;
      background-color: #DDDDDD;
      color: #202020;
      width: calc(92% + 6px);
      max-width: 706px;
      text-align: center;
      padding: 15px;
      box-sizing: border-box;
      cursor: pointer;
      border: 0px solid #202020;
      transition: all .2s;
      &:hover, &:focus {
        background-color: #CCCCCC;
        border-width: 3px;
        padding-top: 12px;
        padding-bottom: 12px;
      }
    }
    .loading {
      margin:26px 0;
    }
    .error-block-list {
      margin: 0 auto;
      width: calc(92% + 6px);
      max-width: 706px;
    }
    &.on-error {
      height: 120px;
      margin-bottom: 40px;
    }
    &.end {
      height: 150px;
      margin-bottom: 8px;
    }
  }
  &.dark {
    color-scheme: dark;
    background-color: #202020;
    .header {
      color: #444444;
      a {
        color: #444444;
        &:hover, &:focus {
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
          .mode-list {
            border-right-color: #4B4B4B;
          }
        }
      }
      &:hover, &:focus {
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
        &:hover, &:focus {
          background-color: #444444;
        }
      }
    }
  }
  &.lock-scroll {
    overflow: hidden;
  }
}
html.dark {
    color-scheme: dark;
}
</style>
