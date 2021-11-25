<template>
  <div >
    <div class="container" >
      <div class="row row-cols-6 g-3 mt-5 mx-auto container" style="width:73vw">
        <div v-for="(movie, idx) in movieList" :key="idx" class="p-auto my-2">
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
    return {
      
    };
  },
};
</script>

<style>

</style>
