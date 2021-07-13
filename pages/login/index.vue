<template>
  <div class="auth-page">
    <div class="container page">
      <div class="row">
        <div class="col-md-6 offset-md-3 col-xs-12">
          <h1 class="text-xs-center">{{ isLogin ? "Sign in" : "Sign up" }}</h1>
          <p class="text-xs-center">
            <nuxt-link v-if="isLogin" to="/register"
              >Need an account?
            </nuxt-link>
            <nuxt-link v-else to="/login">Have an account?</nuxt-link>
          </p>
          <ul class="error-messages">
            <template v-for="(messages, field) in errors">
              <li v-for="message in messages" :key="message">
                {{ field }} {{ message }}
              </li>
            </template>
          </ul>
          <form @submit.prevent="onSubmit">
            <fieldset v-if="!isLogin" class="form-group">
              <input
                v-model="user.username"
                class="form-control form-control-lg"
                type="text"
                placeholder="Your Name"
                required
              />
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
                minlength="8"
              />
            </fieldset>
            <button class="btn btn-lg btn-primary pull-xs-right">
              {{ isLogin ? "Sign in" : "Sign up" }}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { login ,register} from "@/api/user";
const Cookie=process.client?require("js-cookie"):undefined

export default {
  name: "LoginIndex",
  middleware:"notAuthenticated",
  asyncData() {},
  data() {
    return {
      user: {
        username:"",
        email: "463010136@qq.com", 
        password: "sb200805410",
      },
      errors: {},
    };
  },
  computed: {
    isLogin() {
      return this.$route.path === "/login";
    },
  },
  methods: {
    async onSubmit() {
      try {
        //提交表单请求登录
        const { data } = this.isLogin? await login({
          user: this.user,
        }):await register({
          user:this.user
        })
      
        console.log(data);
        //todo: 保存用户的登录状态
        this.$store.commit("setUser",data.user)
        Cookie.set("user",data.user)
        //跳转到首页
        this.$router.push("/")
      } catch (err) {
        console.log("请求失败", err)
        console.dir(err)
        this.errors = err?.response?.data?.errors
      }
    },
  },
};
</script>
<style>
</style>