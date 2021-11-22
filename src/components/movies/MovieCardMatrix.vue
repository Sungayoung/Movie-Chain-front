<template>
  <div class="container">
    <div >
      <div class="row row-cols-6 g-3 m-0 mx-auto" style="width:1300px">
        <div v-for="(movie, idx) in movieList" :key="idx" class="p-0">
          <MovieCard :movie="movie" />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import MovieCard from "./MovieCard.vue";
export default {
  name: "MovieCardMatrix",
  components: {
    MovieCard,
  },
  props: {
    movieList: Array,
  },
  data: function () {
    return {};
  },
};
</script>

<style>

</style>
