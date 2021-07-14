<template>
  <div
      class="article-preview"
    >
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
            :to="{
              name: 'profile',
              params: {
                username: article.author.username,
              },
            }"
            class="author"
            >{{ article.author.username }}
          </nuxt-link>
          <span class="date">{{ article.createdAt | date('MMM DD, YYYY') }}</span>
        </div>
        <button
          class="btn btn-outline-primary btn-sm pull-xs-right"
          :class="{ active: article.favorited }"
          @click="onFavorite()"
          :disabled="article.favoriteDisabled"
        >
          <i class="ion-heart"></i>
          {{ article.favoritesCount }}
        </button>
      </div>
      <nuxt-link
        :to="{
          name: 'article',
          params: {
            slug: article.slug,
          },
        }"
        class="preview-link"
      >
        <h1>{{ article.title }}</h1>
        <p>{{ article.description }}</p>
        <span>Read more...</span>
      </nuxt-link>
    </div>
</template>

<script>
export default {
  props:{
    article:{
      type:Object,
      required:true,
    }
  },
  methods:{
    onFavorite(){
      
      this.$emit('onFavorite')
    }
  }
}
</script>

<style>

</style>