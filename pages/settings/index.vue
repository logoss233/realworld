<template>
  <div class="settings-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">Your Settings</h1>
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
                  v-model="user.image"
                  class="form-control"
                  type="text"
                  placeholder="URL of profile picture"
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.username"
                  class="form-control form-control-lg"
                  type="text"
                  placeholder="Your Name"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <textarea
                  v-model="user.bio"
                  class="form-control form-control-lg"
                  rows="8"
                  placeholder="Short bio about you"
                ></textarea>
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.email"
                  class="form-control form-control-lg"
                  type="email"
                  placeholder="Email"
                  required
                />
              </fieldset>
              <fieldset class="form-group">
                <input
                  v-model="user.password"
                  class="form-control form-control-lg"
                  type="password"
                  placeholder="Password"
                  required
                />
              </fieldset>
              <button class="btn btn-lg btn-primary pull-xs-right"
              >
                Update Settings
              </button>
            </fieldset>
          </form>
          <hr>
          <button class="btn btn-outline-danger" 
            @click="onLoginOut">
            Or click here to logout.
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from "js-cookie"
import {updateSetting} from "@/api/user.js"

export default {
  name: "SettingIndex",
  middleware:"authenticated",
  data(){
      return {
        user:{
          bio:"",
          email:"",
          image:"",
          password:"",
          username:"",
        },
        errors:{},
      }
    },
  methods:{
    onLoginOut(){
      Cookies.remove('user')
      this.$store.commit("setUser",null)
      this.$router.push({
        name:"home"
      })
    },
    
    async onSubmit(){
      //记住
      try{
        let str=JSON.stringify(this.user)
        localStorage.setItem('formData',str)
      }catch(err){
        console.log("保存表单数据出错")
      }
      
      try{
        let {data}=await updateSetting({
          user:this.user
        })
        console.log("data",data)
        this.$store.commit("setUser",data.user)
        Cookies.set("user",data.user)
        this.$router.push({
          name:"profile",
          params:{
            username:data.user.username
          }
        })
      }catch(err){
        console.log("更新用户设置失败",err)
        console.dir(err)
        this.errors=err?.response?.data?.errors
      }
    }
  },
  mounted(){
    try{
      let str=localStorage.getItem("formData")
      if(str){
        this.user=JSON.parse(str)
      }
    }catch(err){

    }
  }
};
</script>

<style>
</style>