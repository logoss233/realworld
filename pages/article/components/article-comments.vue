<template>
  <div>
    <p show-authed="false" style="display: inherit;"
      v-if="!user"
    >
      <nuxt-link ui-sref="app.login" :to="{
        name:'login'
      }">Sign in</nuxt-link> or <nuxt-link ui-sref="app.register" :to="{
        name:'register'
      }">sign up</nuxt-link> to add comments on this article.
    </p>
    <form class="card comment-form" @submit.prevent="postComment"
      v-if="user"
    >
      <div class="card-block">
        <textarea
          class="form-control"
          placeholder="Write a comment..."
          rows="3"
          v-model="commentText"
          required
        ></textarea>
      </div>
      <div class="card-footer">
        <img :src="user.image" class="comment-author-img" />
        <button class="btn btn-sm btn-primary"
          :disabled="addingComment"
        >Post Comment</button>
      </div>
    </form>
    <div class="card"
      v-for="comment in comments"
      :key="comment.id"
    >
      <div class="card-block">
        <p class="card-text">
          {{comment.body}}
        </p>
      </div>
      <div class="card-footer">
        <nuxt-link :to="{
          name:'profile',
          params:{
            username:comment.author.username
          }
        }" class="comment-author">
          <img
            :src="comment.author.image"
            class="comment-author-img"
          />
        </nuxt-link>
        &nbsp; 
        <nuxt-link :to="{
          name:'profile',
          params:{
            username:comment.author.username
          }
        }" class="comment-author">
          {{comment.author.username}}
        </nuxt-link>
        <span class="date-posted">{{ comment.createdAt | date('MMM DD,YYYY')}}</span>
        <!-- 删除按钮 -->
        <span class="mod-options"
          v-if="isSelfComment(comment)"
          @click="onDeleteCommentBtn(comment)"
        >
          <i class="ion-trash-a"></i>
        </span>
      </div>
    </div>
  </div>
</template>

<script>
import {getComments,deleteComment,addComment} from "@/api/article"
import {mapState} from "vuex"
export default {
  name:"articleComments",
  props:{
    article:{
      type:Object,
      required:true,
    }
  },
  data(){
    return {
      comments:[], //文章列表
      commentText:"",
      addingComment:false,
    }
  },
  computed:{
    ...mapState(["user"]),
    
  },
  methods:{
    isSelfComment(comment){
      return this.user && this.user.username===comment.author.username
    },
    async onDeleteCommentBtn(comment){
      if(comment.deleting){
        return
      }
      comment.deleting=true
      try{
        await deleteComment(this.article.slug,comment.id)
        let index=this.comments.indexOf(comment)
        this.comments.splice(index,1)
      }catch(err){
        comment.deleting=false
      }
    },
    async postComment(){
      this.addingComment=true
      try{
        const {data}=await addComment(this.article.slug,{
          comment:{
            body:this.commentText
          }
        })
        console.log("addComment",data)
        const {comment}=data
        comment.deleting=false
        this.comments.unshift(comment)
        this.commentText=""
      }catch(err){ 
      }
      this.addingComment=false
    }
  },
  async mounted(){
    const {data}=await getComments(this.article.slug)
    data.comments.forEach(comment=>{
      comment.deleting=false
    })
    this.comments=data.comments
  
  }
};
</script>

<style>
</style>