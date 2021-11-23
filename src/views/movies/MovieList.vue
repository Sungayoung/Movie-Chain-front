<template>
  <div class="my-5 container">
    <div class="justify-content-around row" mandatory>
      <!-- 사이드바 -->
      <div class="my-sidebar col-2">
        <v-btn>
          <v-icon size="200"> mdi-filter-menu-outline </v-icon>
        </v-btn>
        <!-- N개씩 보기 버튼 -->
        <div class="d-flex">
          <v-select
            v-model="movieCnt"
            :items="movieCntItems"
            background-color="white"
            @change="getMovie"
            width="10"
            solo
            hide-details
          ></v-select>
        </div>
        <!-- 필터지정 -->
        <div style="width: 15vw">
          <v-select
            class="d-flex"
            clearable
            solo
            width="10"
            :items="filterItems"
            v-model="filterBy"
            @change="getList(filterBy)"
          ></v-select>
        </div>
        <!-- 필터에서 내용선택 -->

        <v-autocomplete
          @change="getMovieMovie"
          chips
          clearable
          deletable-chips
          multiple
          :items="filterIdItems"
          item-text="name"
          item-value="id"
          v-model="filterIdList"
        ></v-autocomplete>
      </div>
    </div>

    <div class="content-area offset-1 col-9">
      <!-- 사이드바 배경부분 -->
      <div class=""></div>
      <!-- 영화 보여주는 곳 -->
      <div>
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
              <v-btn small @click="page = p" fab v-else color="white">
                {{ p }}</v-btn
              >
            </span>
          </span>
          <span><v-icon color="white">mdi-dots-horizontal</v-icon></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from "vuex";
import MovieCardMatrix from "../../components/movies/MovieCardMatrix.vue";
import axios from "axios";

export default {
  name: "MovieList",
  data: function () {
    return {
      page: 1,
      totalPages: 100,
      movieCnt: 18,
      movieCntItems: [
        { text: "18개씩 보기", value: 18 },
        { text: "36개씩 보기", value: 36 },
        { text: "72개씩 보기", value: 72 },
        { text: "144개씩 보기", value: 144 },
      ],
      movies: [],
      results: [],
      filterItems: [
        { text: "모두보기", value: "all" },
        { text: "배우", value: "actor" },
        { text: "제작진", value: "crew" },
        { text: "해시태그", value: "keyword" },
        { text: "장르", value: "genre" },
      ],
      orderItems: [],
      filterBy: "all",
      orderBy: null,
      filterId: null,
      filterIdList: [],
      filterIdItems: [],
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
    getList: function (value) {
      const token = localStorage.getItem("jwt");

      axios({
        method: "get",
        url: `${process.env.VUE_APP_MCS_URL}/movies/${value}s/`,
        headers: { Authorization: `JWT ${token}` },
      })
        .then((res) => {
          this.filterIdItems = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMovieMovie: function () {
      const params = {
        filter_id: this.filterIdList.join(','),
        filter_by: this.filterBy,
        order_by: this.orderBy,
        page: this.page,
        movie_cnt: this.movieCnt,
      };
      this.movies = [];
      this.getMovieListPage(params)
        .then((res) => {
          // console.log(res);
          this.movies = res.serialized_data
          console.log(res)
          this.totalPages = res.total_page_cnt;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getMovie: function () {
      const params = {
        filter_id: this.filterId,
        filter_by: this.filterBy,
        order_by: this.orderBy,
        page: this.page,
        movie_cnt: this.movieCnt,
      };
      if (!params.filter_id_list) {
        params.filter_by = "all";
      }
      this.getMovieListPage(params)
        .then((res) => {
          // console.log(res);
          this.movies = res.serialized_data;
          this.totalPages = res.total_page_cnt;
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
  transform: translateX(18vw);
  left: 0;
}
.right-btn {
  transform: translateX(-3vw);
  right: 0;
}
.left-btn-bg,
.right-btn-bg {
  background-color: rgb(87, 94, 94);
}
.left-btn-bg:hover,
.right-btn-bg:hover {
  transition-property: background-color;
  transition-duration: 500ms;
  background-color: rgb(163, 200, 202);
}

.my-sidebar {
  position: fixed;
  background-color: red;
  height: 100vh;
  width: 20vw;
  top: 72px;
  left: 0px;
  transition-duration: 1s;
}
</style>
