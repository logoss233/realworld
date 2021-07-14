<template>
  <div class="home-page">
    <div class="banner">
      <div class="container">
        <h1 class="logo-font">conduit</h1>
        <p>A place to share your knowledge.</p>
      </div>
    </div>
    <div class="container page">
      <div class="row">
        <div class="col-md-9">
          <div class="feed-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item"
                v-if="user"
              >
                <nuxt-link class="nav-link"
                  :class="{
                    active:tab==='your_feed'
                  }"
                  :to="{
                    name:'home',
                    query:{
                      tab:'your_feed'
                    }
                  }"
                  exact
                 >Your Feed</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" 
                  :class="{active:tab==='global_feed'}"
                  :to="{
                    name:'home',
                    query:{
                      tab:'global_feed'
                    }
                  }"
                  exact
                >Global Feed</nuxt-link>
              </li>
              <li class="nav-item"
                v-if="tag"
              >
                <nuxt-link class="nav-link"
                  :class="{active:tab==='tag'}"
                  exact
                  :to="{
                    name:'home',
                    query:{
                      tab:'tag',
                      tag:tag,
                    }
                  }"
                >#{{tag}}</nuxt-link>
              </li>
            </ul>
          </div>
          
          <article-preview 
            v-for="article in articles"
            :key="article.slug"
            :article="article"
            @onFavorite="onFavorite(article)"
          />


          <!-- 分页列表 -->
          <nav>
            <ul class="pagination">
              <li class="page-item ng-scope"
                :class="{active:page==item}"
                v-for="item in totalPage"
                :key="item"
              >
                <nuxt-link class="page-link ng-binding"
                 :to="{
                   name:'home',
                   query:{
                     page:item,
                     tag:tag,
                     tab:tab,
                   }
                 }"
                 >{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>
        </div>
        <div class="col-md-3">
          <div class="sidebar">
            <p>Popular Tags</p>
            <div class="tag-list">
              <nuxt-link 
                v-for="item in tags"
                :key="item"
                :to="{
                  name:'home',
                  query:{
                    tab:'tag',
                    tag:item
                  }
                }"
                class="tag-pill tag-default"
                >{{item}}</nuxt-link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { 
  getArticles,
  getFeedArticles,
  addFavorite,
  deleteFavorite
 } from "@/api/article";
import { getTags } from "@/api/tag";
import {mapState} from "vuex"
import articlePreview from '@/components/article-preview';
export default {
  components: { articlePreview },
  name: "HomeIndex",
  async asyncData({ query,store }) {
    const page = Number.parseInt(query.page || 1);
    const limit = 20;
    const tab=query.tab || 'global_feed'
    const loadArticles= store.state.user && tab==='your_feed'
      ? getFeedArticles 
      : getArticles
    const [articleRes,tagRes]=await Promise.all([
      loadArticles({
        limit,
        offset: (page - 1) * limit,
        tag:query.tag
      }),
      getTags()
    ])
    const {articles,articlesCount}=articleRes.data
    const tags=tagRes.data.tags

    articles.forEach(article=>{
      article.favoriteDisabled=false //处理点赞时 不让文章重复点赞
    })

    return {
      articles,
      articlesCount,
      tags,
      limit,
      page,
      tag:query.tag,
      tab,
    };
  },
  computed:{
    totalPage(){
      return Math.ceil(this.articlesCount/this.limit)
    },
    ...mapState(['user']),
  },
  methods:{
    async onFavorite(article){
      //没有登录时，点赞自动跳转到登录
      if(!this.$store.state.user){
        this.$router.push({
          name:"login"
        })
        return
      }

      article.favoriteDisabled=true
      if(article.favorited){
        const {data}=await deleteFavorite(article.slug)
        article.favorited=data.article?.favorited
        article.favoritesCount=data.article?.favoritesCount
      }else{
        const {data}=await addFavorite(article.slug)
        article.favorited=data.article?.favorited
        article.favoritesCount=data.article?.favoritesCount
      }
      article.favoriteDisabled=false
    }
  },
  watchQuery:["page","tag","tab"]
};
</script>

<style>
</style>