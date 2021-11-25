<template>
  <div class="container d-flex" style="margin-top: 100px">
    <v-sheet
      style="z-index: 1"
      rounded="xl"
      color="rgba(255,255,255,0.6)"
      width="50%"
      class="mx-auto my-5 p-3"
    >
      <v-sheet
        rounded="xl"
        color="#85c085"
        elevation="8"
        class="justify-content-center align-items-center"
      >
        <!-- 제목 -->
        <div class="text-center">
          <span class="fs-3 fw-bold my-auto">{{ movie.title }}</span>
          <v-sheet
            rounded="xl"
            color="grey lighten-2"
            class="mt-3 d-flex"
            style="min-height: 340px"
          >
            <div class="col-3">
              <!-- 포스터 -->
              <button
                @click.stop="dialog = true"
                style="position: relative"
                class="d-flex"
              >
                <div class="d-flex justify-content-center" style="width: 200px">
                  <div style="position: absolute; z-index: 30; top: 273px">
                    <user-list-pop :movieId="movie.id"> </user-list-pop>
                  </div>
                </div>
                <div
                  class="poster-box"
                  @mouseover="isHover = true"
                  @mouseleave="isHover = false"
                  style="
                    border: 2px solid white;
                    position: absolute;
                    border-radius: 25px;
                  "
                >
                  <!-- 포스터 확대 기능 -->
                  <transition name="my-movie-card">
                    <div
                      v-if="isHover"
                      class="hover-magnifying justify-content-center d-flex"
                      style="border-radius: 25px"
                    >
                      <v-icon
                        color="white"
                        style="z-index: 20  border-radius:25px"
                        size="64"
                      >
                        mdi-magnify-plus-outline
                      </v-icon>
                    </div>
                  </transition>

                  <v-img :src="imgURL" style="border-radius: 25px"></v-img>
                </div>
              </button>
            </div>

            <!-- 본문 -->
            <div class="col-9">
              <v-sheet
                rounded="xl"
                elevation="8"
                color="grey lighten-2"
                class="mt-3"
              >
                <!-- 줄거리 -->
                <div class="p-3">{{ movie.overview }}</div>
              </v-sheet>

              <v-sheet
                rounded="xl"
                elevation="8"
                color="grey lighten-2"
                class="justify-content-center d-flex mt-3"
                width="auto"
              >
                <!-- 좋아요 -->
                <button @click="likeMovie">
                  <v-icon
                    color="red"
                    size="40"
                    v-text="movie.isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
                  ></v-icon>
                  {{ movie.likeCnt }}
                </button>
                <!-- 북마크 -->

                <button dark @click="saveMovie">
                  <v-icon
                    color="blue"
                    size="40"
                    v-text="
                      movie.isSaved ? 'mdi-bookmark' : 'mdi-bookmark-outline'
                    "
                  ></v-icon>
                  {{ movie.saveCnt }}
                </button>

                <!-- 별점주기 -->
                <div class="text-center">
                  <v-rating
                    color="warning"
                    background-color="warning lighten-1"
                    empty-icon="mdi-star-outline"
                    full-icon="mdi-star"
                    half-icon="mdi-star-half-full"
                    hover
                    half-increments
                    length="5"
                    large
                    v-model="rank"
                    @input="setRank"
                  ></v-rating>
                </div>
                <button>
                  {{ rank }}
                </button>
              </v-sheet>
            </div>
          </v-sheet>
        </div>
      </v-sheet>

      <v-sheet
        rounded="xl"
        elevation="8"
        class="mt-5 justify-content-center align-items-center"
        ><div class="d-flex justify-content-center container">
          <h3 class="fw-bold m-0">감독</h3>
        </div>
        <div>
          <PeopleCardList :people="movie.crews" />
        </div>
      </v-sheet>

      <v-sheet
        rounded="xl"
        color="grey lighten-2"
        elevation="8"
        class="mt-5 justify-content-center align-items-center"
        ><div class="d-flex justify-content-center container">
          <h3 class="fw-bold m-0">배우</h3>
        </div>
        <div>
          <PeopleCardList :people="movie.actors" />
        </div>
      </v-sheet>
      <!-- 확대했을 때 dialog -->

      <v-dialog v-model="dialog" max-width="500">
        <div style="border: 2px solid white">
          <v-img :src="imgURL"></v-img>
        </div>
      </v-dialog>

      <!-- 리뷰 -->
        <div>
          <v-icon large color="red lighten-2"> </v-icon>
          <review-list
            :reviewList="reviewList"
            :myReview="myReview"
            :reviewCnt="reviewCnt"
            :movieId="movieId"
            @reload-review="getReviewList"
          >
          </review-list>
        </div>
    </v-sheet>

    <v-sheet
      style="position: absolute; right: 1430px; top: 132px; width: auto"
      rounded="xl"
      elevation="8"
      color="rgba(255,255,255,0.6)"
      class="p-2 col d-flex"
    >
      <div>
        <!-- 별 평점 -->
        <div>
          <v-chip
            light
            color="grey darken-3"
            text-color="white"
            class="mx-2 my-1"
          >
            <button>
              <v-icon left color="warning">mdi-star</v-icon>
              {{ voteAverage }}
            </button>
          </v-chip>
        </div>

        <!-- 개봉일 -->
        <div>
          <v-chip
            light
            color="grey darken-3"
            text-color="white"
            class="mx-2 my-1"
          >
            <button>
              <v-icon left> mdi-calendar-month-outline </v-icon>
              {{ releaseDate }}
            </button>
          </v-chip>
        </div>

        <!-- 태그들(장르, 키워드) -->
        <div>
          <div v-for="(gnr, idx) in movie.genre" :key="idx">
            <v-chip
              small
              light
              color="grey darken-3"
              text-color="white"
              class="mx-2 my-1"
            >
              <button @click.stop="moveGenreList(gnr.id)">
                <v-icon left> mdi-movie-open-outline </v-icon>
                {{ gnr.name }}
              </button>
            </v-chip>
          </div>
          <div v-for="(kwd, idx) in movie.keyword" :key="idx">
            <v-chip
              small
              light
              color="grey darken-3"
              text-color="white"
              class="mx-2 my-1"
            >
              <button @click.stop="moveKeywordList(kwd.id)">
                <v-icon left> mdi-pound </v-icon>
                {{ kwd.name }}
              </button>
            </v-chip>
          </div>
        </div>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import axios from "axios";
import UserListPop from "@/components/popups/UserListPop.vue";
import ReviewList from "@/components/reviews/ReviewList.vue";
import PeopleCardList from "../../components/people/PeopleCardList.vue";
import { mapActions } from "vuex";

export default {
  name: "MovieDetail",
  data: function () {
    return {
      isHover: false,
      dialog: false,
      movie: null,
      rank: null,
      myReview: null,
      reviewList: null,
      reviewCnt: null,
    };
  },
  components: {
    UserListPop,
    ReviewList,
    PeopleCardList,
  },
  props: { movieId: String },
  created: function () {
    this.getMovie(), this.getReviewList();
  },
  methods: {
    ...mapActions([
      "getMovieDetail",
      "getReview",
      "createReview",
      "updateReview",
    ]),
    search: function (query) {
      this.$router.push({
        name: "MovieSearchResult",
        params: {
          query: query,
        },
      });
    },
    moveGenreList: function (gnrId) {
      this.$router.push({
        name: "MovieList",
        params: { propFilterBy: "genre", propFilterId: gnrId },
      });
    },
    moveKeywordList: function (kwdId) {
      this.$router.push({
        name: "MovieList",
        params: { propFilterBy: "keyword", propFilterId: kwdId },
      });
    },

    getReviewList: function () {
      this.getReview(this.movieId).then((res) => {
        this.myReview = res.myReview;
        if (res.myRank.length != 0) {
          console.log(res.myRank);
          this.rank = res.myRank[0].rank / 2;
        }
        this.reviewList = res.reviews;
        this.reviewCnt = res.reviewCnt;
        console.log(res);
      });
    },
    getMovie: function () {
      console.log(this.movieId);
      this.getMovieDetail(this.movieId)
        .then((res) => {
          this.movie = res;
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    likeMovie: function () {
      const token = localStorage.getItem("jwt");
      axios({
        method: "post",
        url: `${process.env.VUE_APP_MCS_URL}/movies/like-movie/`,
        headers: { Authorization: `JWT ${token}` },
        data: { movieId: this.movie.id },
      }).then((res) => {
        this.movie.likeCnt = res.data.likeCnt;
        this.movie.isLiked = res.data.isLiked;
      });
    },
    saveMovie: function () {
      const token = localStorage.getItem("jwt");
      axios({
        method: "post",
        url: `${process.env.VUE_APP_MCS_URL}/movies/bookmark-movie/`,
        headers: { Authorization: `JWT ${token}` },
        data: { movieId: this.movie.id },
      }).then((res) => {
        this.movie.saveCnt = res.data.saveCnt;
        this.movie.isSaved = res.data.isSaved;
      });
    },
    setRank: function () {
      console.log("hello");
      if (this.myReview.length == 0) {
        let data = {
          movieId: this.movieId,
          params: {
            rank: this.rank * 2,
          },
        };
        this.createReview(data).then(() => {
          this.getReviewList();
        });
      } else {
        let data = {
          reviewId: this.myReview[0].id,
          params: {
            rank: this.rank * 2,
          },
        };
        if (this.rank === this.myReview[0].rank / 2) {
          data.params.rank = null;
        }
        this.updateReview(data).then(() => {
          this.getReviewList();
        });
      }
    },
  },
  computed: {
    imgURL: function () {
      if (this.movie) {
        return `https://image.tmdb.org/t/p/w500${this.movie.poster_path}`;
      } else {
        return "@/assets/no_image.png";
      }
    },
    releaseDate: function () {
      if (this.movie.release_date === "1111-11-11") {
        return "개봉예정";
      }
      return this.movie.release_date;
    },
    voteAverage: function () {
      if (this.movie.vote_average == 0) {
        return "평점정보 없음";
      }
      return this.movie.vote_average;
    },
  },
};
</script>

<style>
.movie-detail-header {
  height: 300px;
}
.hover-magnifying {
  background-color: rgba(65, 65, 65, 0.7);
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 20;
}
.poster-box {
  position: relative;
  display: inline-flex;
  width: 200px;
  height: 300px;
  object-fit: fill;
}
.my-movie-card-enter-active,
.my-movie-card-leave-active {
  transition-duration: 500ms;
}
.my-movie-card-enter,
.my-movie-card-leave-to {
  opacity: 0;
}
</style>
