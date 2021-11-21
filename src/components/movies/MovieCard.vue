<template>
  <div @click="moveDetail">
    <img :src="imgURL" alt="" class="movie-img">
  </div>
</template>

<script>
export default {
  name: "MovieCard",
  props: {
    movie: Object
  },
  methods: {
    moveDetail: function () {
      this.$router.push({
        name: 'MovieDetail',
        params: {
          movieId: String(this.movie.id)
        }
      })
    }
  },
  computed: {
    imgURL: function () {
      if (this.movie){
        return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`
      }
      else {
        return null
      }
    }
  }
};
</script>

<style scoped>
  .movie-img {
    width: 300px;
    height: 500px;
  }
</style>
