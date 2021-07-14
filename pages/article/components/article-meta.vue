<template>
  <div class="article-meta">
    <nuxt-link
      :to="{
        name: 'profile',
        params: {
          username: article.author.username,
        },
      }"
      ><img :src="article.author.image" />
    </nuxt-link>
    <div class="info">
      <nuxt-link
        class="author"
        :to="{
          name: 'profile',
          params: {
            username: article.author.username,
          },
        }"
        >
          {{article.author.username}}
      </nuxt-link>
      <span class="date">{{article.createdAt | date("MMM DD,YYYY")}}</span>
    </div>
    <!-- 如果是他人  显示follow按钮 -->
    <template v-if="!isSelf">
      <button class="btn btn-sm btn-outline-secondary"
        :class="{active:article.author.following}"
        @click="onFollowBtn"
        :disabled="followingDisabled"
      >
        <i class="ion-plus-round"></i> &nbsp;{{followBtnText}}
      </button>
      &nbsp;&nbsp;
      <button class="btn btn-sm btn-outline-primary"
      :class="{active:article.favorited}"
      @click="onFavorite"
      :disabled="favoriteDisabled"
    >
      <i class="ion-heart"></i> &nbsp; {{favoriteBtnText}}
      <span class="counter">({{article.favoritesCount}})</span>
    </button>
    </template>
    <!-- 如果是自己  显示编辑文章按钮 -->
    <template v-if="isSelf">
      <button class="btn btn-outline-secondary btn-sm" 
        @click="onEdit"
      >
        <i class="ion-edit"></i> Edit Article
      </button>
      <button class="btn btn-outline-danger btn-sm"
        @click="onDelete"
      >
        <i class="ion-trash-a"></i> Delete Article
      </button>
    </template>
  </div>
</template>

<script>
import {
  deleteArticle,
  addFavorite,
  deleteFavorite
  } from "@/api/article"
import {follow,unfollow} from "@/api/user"
export default {
  name: "ArticleMeta",
  props: {
    article: {
      type: Object,
      required: true,
    },
  },
  data(){
    return{
      followingDisabled:false,
      favoriteDisabled:false,
    }
  },
  computed:{
    isSelf(){
      return this.$store.state.user && this.$store.state.user.username===this.article.author.username
    },
    followBtnText(){
      if(this.article.author.following){
        return "Unfollow "+this.article.author.username
      }else{
        return "Follow "+this.article.author.username
      }
    },
    favoriteBtnText(){
      if(this.article.favorited){
        return "Unfavorite Article"
      }else{
        return "Favorite Article"
      }
    }
  }, 
  methods:{
    onEdit(){
      //先保存文章信息，再跳转到编辑页
      const articleData={
        title:this.article.title,
        description:this.article.description,
        tagList:this.article.tagList.join(","),
        body:this.article.body
      }
      try{
        localStorage.setItem("article",JSON.stringify(articleData))
      }catch(err){
      }
      this.$router.push({
        name:"editor"
      })
    },
    async onDelete(){
      try{
        const {data}=await deleteArticle(this.article.slug)
        //删除成功后跳转到首页
        this.$router.push({
          name:"home"
        })
      }catch(err){
      }
    },
    async onFollowBtn(){
      //没登录，跳到登录
      if(!this.$store.state.user){
        this.$router.push({
          name:"login"
        })
        return
      }

      this.followingDisabled=true
      if(this.article.author.following){
        const {data}=await unfollow(this.article.author.username)
        this.$emit("updateFollow",data.profile?.following)
      }else{
        const {data}=await follow(this.article.author.username)
        this.$emit("updateFollow",data.profile?.following)
      }
      this.followingDisabled=false
    },
    async onFavorite(){
      //没有登录时，点赞自动跳转到登录
      if(!this.$store.state.user){
        this.$router.push({
          name:"login"
        })
        return
      }
      this.favoriteDisabled=true
      if(this.article.favorited){
        const {data}=await deleteFavorite(this.article.slug)
        // article.favorited=data.article?.favorited
        // article.favoritesCount=data.article?.favoritesCount
        this.$emit("updateFavorited",data.article?.favorited,data.article?.favoritesCount)
      }else{
        const {data}=await addFavorite(this.article.slug)
        // article.favorited=data.article?.favorited
        // article.favoritesCount=data.article?.favoritesCount
        this.$emit("updateFavorited",data.article?.favorited,data.article?.favoritesCount)
      }

      this.favoriteDisabled=false
    }
  }
};
</script>

<style>
</style>