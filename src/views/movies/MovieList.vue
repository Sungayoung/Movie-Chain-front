<template>
  <div class="my-5">
    <div class="text-center" mandatory>
      <span v-for="n in 5" :key="`btn-${n}`">
        <span @click="page = n">
          <v-icon v-if="page === n" color="teal darken-2">mdi-record</v-icon>
          <v-icon v-else color="white">mdi-record</v-icon>
        </span>
      </span>
    </div>
    <div class="d-flex">
      <button id="left-btn">
        <v-icon size="100" color="white" @click="prev">
          mdi-chevron-left
        </v-icon>
      </button>
      <MovieCardMatrix :movieList="movies" />
      <button id="right-btn">
        <v-icon
          :disabled="page === 1000"
          size="100"
          color="white"
          depressed
          @click="next"
        >
          mdi-chevron-right
        </v-icon>
      </button>
      <v-dialog
        transition="dialog-top-transition"
        max-width="600"
      >으앙</v-dialog>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import MovieCardMatrix from "../../components/movies/MovieCardMatrix.vue";

export default {
  name: "MovieList",
  data: function () {
    return {
      dataPerPage: 18,
      page: 1,

      movies: [],
      results: [],
    };
  },
  components: {
    MovieCardMatrix,
  },
  updated: function () {
    document.querySelector("#left-btn").classList.add("left-btn");
    document.querySelector("#right-btn").classList.add("right-btn");
  },
  created: function () {
    this.getMovie();
  },
  methods: {
    ...mapActions(["getMovieListPage", "search"]),
    getMovie: function () {
      const params = {
        filter_by: "all",
        page: this.page,
      };
      this.getMovieListPage(params)
        .then((res) => {
          // console.log(res);
          this.movies = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getSearch: function () {
      this.search(this.query)
        .then((res) => {
          this.results = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    next: function () {
      this.page = this.page + 1 === 1000 ? 1000 - 1 : this.page + 1;
    },
    prev: function () {
      this.page = this.page - 1 < 1 ? 1 : this.page - 1;
    },
  },
  watch: {
    page: function () {
      this.getMovie();
    },
  },
};
</script>

<style>
.left-btn {
  transition-delay: 500ms;
  transition-duration: 500ms;
  transform: translateX(9vw);
}
.right-btn {
  transition-delay: 500ms;
  transition-duration: 500ms;
  transform: translateX(-9vw);
}
</style>
