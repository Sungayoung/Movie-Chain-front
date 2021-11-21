<template>
  <div @click="moveDetail">
    <v-img
      v-if="noImage"
      src="@/assets/no_image.png"
      alt="포스터가 없는 영화"
      class="movie-img"
    ></v-img>
    <v-img v-else :src="imgURL" alt="영화포스터" class="movie-img"></v-img>
  </div>
</template>

<script>
export default {
  name: "MovieCard",
  props: {
    movie: Object,
  },
  methods: {
    moveDetail: function () {
      this.$router.push({
        name: "MovieDetail",
        params: {
          movieId: String(this.movie.id),
        },
      });
    },
  },
  computed: {
    imgURL: function () {
      if (this.movie) {
        return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;
      } else {
        return "@/assets/no_image.png";
      }
    },
    noImage: function () {
      if (this.movie.poster_path) {
        return false;
      } else {
        return true;
      }
    },
  },
};
</script>

<style scoped>
.movie-img {
  width: 120px;
  height: 180px;
  object-fit: fill;
}
</style>
