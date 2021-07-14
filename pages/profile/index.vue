<template>
  <div class="profile-page">
    <div class="user-info">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 offset-md-1">
            <img :src="target.image" class="user-img" />
            <h4>{{target.username}}</h4>
            <p>
              {{target.bio}}
            </p>
            <button class="btn btn-sm btn-outline-secondary action-btn"
              @click="onFollowClick"
              :disabled="followDisabled"
            >
              <i class="ion-plus-round"></i> &nbsp; {{followBtnText}}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row">
        <div class="col-xs-12 col-md-10 offset-md-1">
          <div class="articles-toggle">
            <ul class="nav nav-pills outline-active">
              <li class="nav-item">
                <nuxt-link class="nav-link" 
                  :class="{
                    active:tab==='my'
                  }"
                  :to="{
                    name:'profile', 
                    params:{
                      username:target.username
                    },
                    query:{
                      tab:'my'
                    }
                  }"
                  exact
                >My Articles</nuxt-link>
              </li>
              <li class="nav-item">
                <nuxt-link class="nav-link" 
                  :class="{
                    active:tab==='favorited'
                  }"
                  :to="{
                    name:'profile',
                    params:{
                      username:target.username
                    },
                    query:{
                      tab:'favorited'
                    }
                  }"
                  exact
                >Favorited Articles</nuxt-link>
              </li>
            </ul>
          </div>
          <articlePreview
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
                   name:'profile',
                    params:{
                      username:target.username
                    },
                    query:{
                      tab:tab,
                      page:item
                    },
                 }"
                 >{{item}}</nuxt-link>
              </li>
            </ul>
          </nav>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {profile,follow,unfollow} from "@/api/user"
import { 
  getArticles,
  addFavorite,
  deleteFavorite
 } from "@/api/article";
import articlePreview from '@/components/article-preview.vue';
export default {
  components: { articlePreview },
  name:"UserProfile",
  async asyncData({params,query}){
    let username=params.username
    const tab=query.tab || "my"
    const page=query.page || 1
    const limit=5

    let getArticlePromise
    if(tab=="my"){
      getArticlePromise=getArticles({
        author:username,
        limit:5,
        offset:(page-1)*limit
      })
    }else{
      getArticlePromise=getArticles({
        favorited:username,
        limit:5,
        offset:(page-1)*limit
      })
    }


    const [{data},{data:articleData}]=await Promise.all([
      profile(username),
      getArticlePromise,
    ])
    const {articles}=articleData

    articles.forEach(article=>{
      article.favoriteDisabled=false //处理点赞时 不让文章重复点赞
    })

    return {
      tab,
      page,
      limit,
      target:{
        username:data.profile?.username,
        bio:data.profile?.bio,
        image:data.profile?.image,
        following:data.profile?.following
      },
      articles,
      articlesCount:articleData.articlesCount,
    }
  },
  data(){
    return {
      followDisabled:false
    }
  },
  computed:{
    totalPage(){
      return Math.ceil(this.articlesCount/this.limit)
    },
    isSelf(){
      return this.$store.state.user && this.$store.state.user.username===this.target.username
    },
    followBtnText(){
      if(this.isSelf){
        return "Edit Profile Settings"
      }else if(this.target.following){
        return "Unfollow "+this.target.username
      }else{
        return "Follow "+this.target.username
      }
    }
  },
  methods:{
    onFollowClick(){
      //没登录，跳到登录
      if(!this.$store.state.user){
        this.$router.push({
          name:"login"
        })
        return
      }

      if(this.isSelf){
        this.$router.push({
          name:"settings"
        })
      }else{
        this.asyncfollow()
      }
    },
    async asyncfollow(){
      this.followDisabled=true
      if(this.target.following){
        const {data}= await unfollow(this.target.username)
        this.target.following=data.profile?.following
      }else{
        const {data}=await follow(this.target.username)
        this.target.following=data.profile?.following
      }
      this.followDisabled=false
    },
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
  watchQuery:["tab","page"]
};

</script>

<style>
</style>