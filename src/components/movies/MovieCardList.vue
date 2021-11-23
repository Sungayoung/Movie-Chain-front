<template>
  <div>
    <v-sheet
      class="mx-auto"
      elevation="8"
      max-width="85%"
      style="background: gray; border-radius:25px"
    >
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
export default {
  name: "MovieCardList",
  props: {
      movies: Array,
  },
  components: {
    MovieCard,
  },
};
</script>

<style></style>
