<template>
  <div @click="moveDetail">
    <img :src="imgURL? imgURL : './assets/no_image.png'" alt="영화포스터" class="movie-img">
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
    width:120px;
    height: 180px;
    object-fit: fill;
  }
</style>
