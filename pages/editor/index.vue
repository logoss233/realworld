<template>
  <div class="editor-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-10 offset-md-1 col-xs-12">
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="message in messages" :key="message">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control form-control-lg"
                  placeholder="Article Title"
                  v-model="article.title"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="What's this article about?"
                  v-model="article.description"
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  class="form-control"
                  rows="8"
                  placeholder="Write your article (in markdown)"
                  v-model="article.body"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  type="text"
                  class="form-control"
                  placeholder="Enter tags"
                  v-model="article.tagList"
                />
                <div class="tag-list"></div>
              </fieldset>
              <button
                class="btn btn-lg pull-xs-right btn-primary"
              >
                Publish Article
              </button>
            </fieldset>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {publish} from "@/api/article"

export default {
  name:"EditorIndex",
  middleware:"authenticated",
  data(){
    return {
      article:{
        title:"",
        description:"",
        tagList:"",
        body:"",
      },
      errors:{},
    }
  },
  watch:{
    article:{
      handler(val,oldVal){
        try{
          localStorage.setItem("article",JSON.stringify(this.article))
        }catch(err){
          console.log("保存文章到本地出错",err)
        }
      },
      deep:true
    }
  },
  mounted(){
    try{
      const str=localStorage.getItem("article")
      if(str){
        this.article=JSON.parse(str)
      }
    }catch(err){
      console.log("读取文章出错",err)
    }
  },
  methods:{
    async onSubmit(){
      try{
        const {data}=await publish({
          article:{
            title:this.article.title,
            description:this.article.description,
            tagList:this.article.tagList.split(","),
            body:this.article.body
          }
        })
        console.log(data)
        const slug=data.article.slug
        //发布成功 清除文章
        this.article={
          title:"",
          description:"",
          tagList:"",
          body:"",
        }
        this.$router.push({
          name:"article",
          params:{
            slug
          }
        })
      }catch(err){
        this.errors = err?.response?.data?.errors
      }
    }
  }
};
</script>

<style>
</style>