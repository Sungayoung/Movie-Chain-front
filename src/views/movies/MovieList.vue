<template>
  <div>
    <div >
      <SearchInput />
      </div>
    <MovieCardMatrix :movieList="movies" />
    <!-- <v-list v-for="(movieList, idx) in movies" :key='idx'>
    </v-list> -->
     <v-item-group v-model="onboarding" class="text-center" mandatory>
      <v-item v-for="n in length" :key="`btn-${n}`">
        <v-icon v-if="onboarding === n - 1" color="teal darken-2"
          >mdi-record</v-icon
        >
        <v-icon v-else color="white">mdi-record</v-icon>
      </v-item>
    </v-item-group>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import MovieCardMatrix from "../../components/movies/MovieCardMatrix.vue";
import SearchInput from "../../components/SearchInput.vue";

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
    SearchInput,
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
  },
  computed: {
    pageCount: function () {
      return Math.ceil(this.movies.length / this.dataPerPage);
    },
  },
};
</script>

<style></style>
