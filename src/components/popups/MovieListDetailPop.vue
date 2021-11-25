<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      scrollable
      width="900px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          plain
          width="100px"
          class="fs-4"
        >
          MORE
        </v-btn>
      </template>
      <v-card rounded="xl">
        <v-card-title class="d-flex justify-content-center fs-3">영화 리스트</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 700px;">
          <div class="container">
            <div >
              <div class="row row-cols-4 g-3 m-0 mx-auto">
                <div v-for="(movie, idx) in movies" :key="idx" class="p-0">
                  <MovieCard :movie="movie" />
                </div>
              </div>
            </div>
          </div>
          <movie-card></movie-card>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import MovieCard from '@/components/movies/MovieCard.vue'
export default {
  name: 'MovieListDetailPop',
  props: {
    movies: Array
  },
  components: {
    MovieCard
  },
  data: function () {
    return {
      dialog: false
    }
  }
}
</script>

<style>

</style>