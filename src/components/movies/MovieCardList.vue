<template>
  <div>
    <v-sheet
      class="mx-auto py-5"
      elevation="8"
      max-width="90%"
      style="border-radius:25px"
      color='grey lighten-2'
    >
    <movie-list-detail-pop
      :movies="movies">
    </movie-list-detail-pop>
      <v-slide-group
        show-arrows
        next-icon="mdi-chevron-right"
        prev-icon="mdi-chevron-left"
      >
        <movie-card
        v-for="(movie, idx) in movies"
        :key="idx"
        :movie="movie"
        class="ma-4">
        </movie-card>
      </v-slide-group>
    </v-sheet>
  </div>
</template>

<script>
import MovieCard from "./MovieCard.vue";
import MovieListDetailPop from '@/components/popups/MovieListDetailPop.vue'
export default {
  name: "MovieCardList",
  props: {
      movies: Array,
  },
  components: {
    MovieCard,
    MovieListDetailPop,
  },
};
</script>

<style></style>
