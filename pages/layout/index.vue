<template>
  <div>
    <nav class="navbar navbar-light">
      <div class="container">
        <nuxt-link class="navbar-brand" to="/">conduit</nuxt-link>
        <ul class="nav navbar-nav pull-xs-right">
          <li class="nav-item">
            <!-- Add "active" class when you're on that page" -->
            <nuxt-link class="nav-link" to="/" exact>Home</nuxt-link>
          </li>
          <template
            v-if="user"
          >
            <!-- 写文章 -->
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/editor">
                <i class="ion-compose"></i>&nbsp;New Post
              </nuxt-link>
            </li>
            <!-- 设置 -->
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/settings">
                <i class="ion-gear-a"></i>&nbsp;Settings
              </nuxt-link>
            </li>
            <!-- 头像 -->
            <li class="nav-item">
              <nuxt-link class="nav-link" 
              :to="{
                name:'profile',
                params:{
                  username:this.user.username
                }
              }">
                <img
                  class="user-pic"
                  :src="faceImg"
                />
                {{userName}}
              </nuxt-link>
            </li>
          </template>
          <template
            v-else
          >
            <!-- 登录 -->
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/login"> Sign in </nuxt-link>
            </li>
            <!-- 注册 -->
            <li class="nav-item">
              <nuxt-link class="nav-link" to="/register"> Sign up </nuxt-link>
            </li>
          </template>
        </ul>
      </div>
    </nav>
    <nuxt-child />
    <footer>
      <div class="container">
        <nuxt-link class="logo-font" to="/">conduit</nuxt-link>
        <span class="attribution">
          An interactive learning project from
          <a href="https://kaiwu.lagou.com/">lagou</a>. Code &amp; design
          licensed under MIT.
        </span>
      </div>
    </footer>
  </div>
</template> 
<script>
import { mapState } from "vuex";
export default {
  name: "LayoutIndex",
  computed: {
    ...mapState(["user"]),
    faceImg(){
      return this.user?.image || "/images/default_face.jpg"
    },
    userName(){
      return this.user?.username || ""
    }
  },
};
</script> 
<style>
</style>