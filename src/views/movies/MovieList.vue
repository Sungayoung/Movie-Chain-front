<template>
  <div>
    <input type="text" @keyup.enter="getSearch" v-model="query" />
    <v-list v-for="(movieList, idx) in movies" :key='idx'>
      
      <MovieCardMatrix :movieList="movieList" />
    </v-list>
    <div class="text-center">
      <v-pagination v-model="page" :length="pageCount"></v-pagination>
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

      query: null,
      movies: [],
      results: [],
    };
  },
  components: {
    MovieCardMatrix,
  },
  created: function () {
    this.getMovie();
  },
  methods: {
    ...mapActions(["getMovieList", "search"]),
    getMovie: function () {
      const params = {
        filter_by: "all",
      };
      this.getMovieList(params)
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
  },
  computed: {
    pageCount: function () {
      return Math.ceil(this.movies.length / this.dataPerPage);
    },
  },
};
</script>

<style></style>
