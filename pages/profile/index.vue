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
          <div class="article-preview">
            <div class="article-meta">
              <a href=""><img src="http://i.imgur.com/Qr71crq.jpg" /></a>
              <div class="info">
                <a href="" class="author">Eric Simons</a>
                <span class="date">January 20th</span>
              </div>
              <button class="btn btn-outline-primary btn-sm pull-xs-right">
                <i class="ion-heart"></i> 29
              </button>
            </div>
            <a href="" class="preview-link">
              <h1>How to build webapps that scale</h1>
              <p>This is the description for the post.</p>
              <span>Read more...</span>
            </a>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {profile,follow,unfollow} from "@/api/user"
import {getArticles} from "@/api/article"
export default {
  name:"UserProfile",
  async asyncData({params,query}){
    let username=params.username
    const tab=query.tab || "my"

    let {data} =await profile(username)
    
    let {data:articleData}=await getArticles({
      author:username,
      limit:5,
      offset:0
    })
    console.log("articleData",articleData)

    return {
      tab,
      target:{
        username:data.profile?.username,
        bio:data.profile?.bio,
        image:data.profile?.image,
        following:data.profile?.following
      },
     
    }
  },
  data(){
    return {
      followDisabled:false
    }
  },
  computed:{
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
    }
  },
  watchQuery:["tab"]
};

</script>

<style>
</style>