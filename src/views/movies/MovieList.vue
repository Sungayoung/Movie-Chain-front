<template>
  <div class="my-5 container">
    <div class="justify-content-around d-flex" mandatory>
      <!-- 사이드바 -->
      <div class="my-sidebar">
        <div style="width: 200px">
          <v-combobox class="d-flex" clearable solo width="10"></v-combobox>
        </div>
      </div>

      <!-- N개씩 보기 버튼 -->
      <v-select
        v-model="movie_cnt"
        :items="movie_cnt_items"
        label="Standard"
        background-color="white"
        @change="getMovie"
        hide-details
      ></v-select>

      <div style="width: 200px">
        <v-combobox class="d-flex" clearable solo width="10"></v-combobox>
      </div>
    </div>

    <!-- 영화 보여주는 곳 -->
    <div class="d-flex">
      <button @click="prev" id="left-btn" class="left-btn-bg">
        <v-icon size="64" color="white"> mdi-chevron-left </v-icon>
      </button>
      <MovieCardMatrix :movieList="movies" />
      <button @click="next" id="right-btn" class="right-btn-bg">
        <v-icon :disabled="page === 1000" size="64" color="white" depressed>
          mdi-chevron-right
        </v-icon>
      </button>
      <v-dialog transition="dialog-top-transition" max-width="600"
        >으앙</v-dialog
      >
    </div>

    <!-- 페이지네이션 버튼 -->
    <div>
      <span><v-icon color="white">mdi-dots-horizontal</v-icon></span>
      <span v-for="p in nowPageList" :key="p" class="mx-2">
        <span>
          <v-btn
            small
            @click="page = p"
            fab
            v-if="page === p"
            color="rgb(41, 88, 78)"
            style="color: white"
            >{{ p }}</v-btn
          >
          <v-btn small @click="page = p" fab v-else color="white">{{
            p
          }}</v-btn>
        </span>
      </span>
      <span><v-icon color="white">mdi-dots-horizontal</v-icon></span>
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
      page: 1,
      movie_cnt: 18,
      movie_cnt_items: [
        { text: "18개씩 보기", value: 18 },
        { text: "36개씩 보기", value: 36 },
        { text: "72개씩 보기", value: 72 },
        { text: "144개씩 보기", value: 144 },
      ],
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
        movie_cnt: this.movie_cnt,
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
  computed: {
    nowPageList: function () {
      if (this.page < 5) {
        return [1, 2, 3, 4, 5, 6, 7, 8, 9];
      }
      return [
        this.page - 4,
        this.page - 3,
        this.page - 2,
        this.page - 1,
        this.page,
        this.page + 1,
        this.page + 2,
        this.page + 3,
        this.page + 4,
      ];
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
.left-btn,
.right-btn {
  position: fixed;
  transition-duration: 500ms;
  transition-property: position;
  top: 50vh;
  z-index: 100;
}

.left-btn {
  transform: translateX(9vw);
  left: 0;
}
.right-btn {
  transform: translateX(-9vw);
  right: 0;
}
.left-btn-bg,
.right-btn-bg{
  background-color: rgb(87, 94, 94);
}
.left-btn-bg:hover,
.right-btn-bg:hover {
  transition-property: background-color;
  transition-duration: 500ms;
  background-color: rgb(163, 200, 202);
}

.my-sidebar {
  background-color: red;
  height: 100vh;
  position: fixed;
  left: 0px;
}
</style>
