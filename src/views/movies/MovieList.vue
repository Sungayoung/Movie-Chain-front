<template>
  <div>
    <!-- 화면에 고정되야 할 것들 -->
    <!-- 좌우버튼 -->
    <button @click="prev" id="left-btn" class="left-btn-bg">
      <v-icon size="64" color="white"> mdi-chevron-left </v-icon>
    </button>
    <button @click="next" id="right-btn" class="right-btn-bg">
      <v-icon :disabled="page === 1000" size="64" color="white" depressed>
        mdi-chevron-right
      </v-icon>
    </button>

    <div>
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
            <div class="d-flex">
              <v-select
                v-model="orderBy"
                :items="orderItems"
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
                solo
                width="10"
                :items="filterItems"
                v-model="filterBy"
                @change="getList(filterBy), (filterIdList = [])"
              ></v-select>
            </div>
            <!-- 필터에서 내용선택 -->
            <v-autocomplete
              :disabled="filterBy === 'all'"
              @change="getMovieMovie"
              chips
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
          <div class="container">
            <!-- 페이지네이션 버튼 -->

            <div
              style="
                height: 1px;
                width: 100%;
                position: fixed;
                top: 300px;
                z-index: 50;
              "
              class="d-flex justify-content-center text-center"
            >
              <div class="page-slot justify-content-evenly d-flex">
                <span v-for="n in 5" :key="`btn-${n}`" class="d-flex">
                  <v-icon v-if="pageIdx === n" color="white">mdi-record</v-icon>
                  <v-icon v-else color="grey darken-2">mdi-record</v-icon>
                </span>
              </div>
            </div>
            <div class="d-flex">
              <MovieCardMatrix :movieList="movies" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from "vuex";
import MovieCardMatrix from "../../components/movies/MovieCardMatrix.vue";
import axios from "axios";

export default {
  name: "MovieList",
  props: {
    propFilterBy: String,
    propFilterId: Number,
    propOrderBy: String,
  },
  data: function () {
    return {
      page: 1,
      pageIdx: 1,
      movieCnt: 18,
      orderBy: null,
      filterId: null,

      totalPages: 100,
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
      orderItems: [
        { text: "기본값", value: null },
        { text: "제목 오름차순", value: "title" },
        { text: "제목 내림차순", value: "-title" },
        { text: "최신순", value: "-release_date" },
        { text: "오래된순", value: "release_date" },
        { text: "평점낮은순", value: "vote_average" },
        { text: "평점높은순", value: "-vote_average" },
      ],
      filterBy: "all",
      filterIdList: [],
      filterIdItems: [],
    };
  },
  components: {
    MovieCardMatrix,
  },
  beforeDistroy: function () {},
  updated: function () {
    console.log("111111111111111111");
    const info = {
      page: this.page,
      movieCnt: this.movieCnt,
      orderBy: this.orderBy,
      filterBy: this.filterBy,
      filterId: this.filterId,
      filterIdList: this.filterIdList,
    };
    this.updateInfo(info);
    document.querySelector("#left-btn").classList.add("left-btn");
    document.querySelector("#right-btn").classList.add("right-btn");
  },
  created: function () {
    this.page = this.Spage;
    this.movieCnt = this.SmovieCnt;
    this.orderBy = this.SorderBy;
    this.filterBy = this.SfilterBy;
    this.filterId = this.SfilterId;
    this.filterIdList = this.SfilterIdList;
    if (this.propFilterBy) {
      this.filterBy = this.propFilterBy;
      this.getList(this.propFilterBy);
      this.filterId = this.propFilterId;
      this.filterIdList = [this.propFilterId];
      this.getMovieMovie();
    } else {
      this.getList(this.SfilterBy);
      this.getMovie();
    }
  },
  methods: {
    ...mapActions(["getMovieListPage", "search", "updateInfo"]),
    getList: function (value) {
      if (value) {
        if (value === "all") {
          this.getMovie();
        } else {
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
        }
      }
    },
    getMovieMovie: function () {
      const params = {
        filter_id: this.filterIdList.join(","),
        filter_by: this.filterBy,
        order_by: this.orderBy,
        page: this.page,
        movie_cnt: this.movieCnt,
      };
      this.movies = [];
      this.getMovieListPage(params)
        .then((res) => {
          // console.log(res);
          this.movies = res.serialized_data;
          console.log(res);
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
      this.page =
        this.page + 1 === this.totalPages ? this.totalPages - 1 : this.page + 1;
      if (this.page === this.totalPages) {
        this.pageIdx = 5;
      } else if (this.pageIdx < 4) {
        this.pageIdx++;
      }
    },
    prev: function () {
      this.page = this.page - 1 < 1 ? 1 : this.page - 1;
      if (this.page === 1) {
        this.pageIdx = 1;
      } else if (this.pageIdx > 2) {
        this.pageIdx--;
      }
    },
  },
  computed: {
    ...mapState([
      "Spage",
      "SmovieCnt",
      "SorderBy",
      "SfilterBy",
      "SfilterId",
      "SfilterIdList",
    ]),
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
.page-slot {
  width: 300px;
  height: 50px;
  border-radius: 25px;
  background-color: rgb(0, 0, 0, 0.6);
}
</style>
