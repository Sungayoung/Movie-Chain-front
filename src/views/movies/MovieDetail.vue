<template>
  <div class="container d-flex">
    <div style="width: 900px" class="mx-auto">
      <div>
        <!-- 제목 -->
        <div>
          <h3 class="d-inline-flex">{{ movie.title }}</h3>

          <!-- 별 평점 -->
          <div>
            <v-icon size="50" color="warning">mdi-star</v-icon>
            <span>
              {{ voteAverage }}
            </span>
          </div>
        </div>

        <hr />
        <!-- 개봉일 -->
        <div>

        <v-chip small light color="grey darken-3" text-color="white" class="mx-2 my-1">
          <button>
          <v-icon left> mdi-calendar-month-outline </v-icon>
          {{ releaseDate }}
          </button>
        </v-chip>
        </div>
        
        <!-- 태그들(장르, 키워드) -->
        <div>
          <div>

          <v-chip
            small light
            color="grey darken-3"
            text-color="white"
            v-for="(gnr, idx) in movie.genre"
            :key="idx"
            class="mx-2 my-1"
          >
            <button @click.stop="moveGenreList(gnr.id)">
              <v-icon left> mdi-movie-open-outline </v-icon>
              {{ gnr.name }}
            </button>
          </v-chip>
          </div>
          <div>

          <v-chip
            small light
            color="grey darken-3"
            text-color="white"
            v-for="(kwd, idx) in movie.keyword"
            :key="idx"
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
      <hr />
      <!-- 본문 -->
      <div class="d-flex row">
        <!-- 포스터 -->
        <div class="col-3" @click.stop="dialog = true">
          <div class="poster-box" @mouseover="magnify">
            <!-- 포스터 확대 기능 -->
            <div class="hover-magnifier justify-content-center">
              <v-icon> magnify-plus-outline </v-icon>
            </div>
            <v-img :src="imgURL"></v-img>
          </div>
        </div>
        <!-- 줄거리 -->
        <div class="col-9">{{ movie.overview }}</div>

        <!-- 별점주기 -->
        <div class="text-center">
          <p>평가하기</p>
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
        <!-- 북마크 -->
        <v-btn color="primary" dark @click="saveMovie">
          {{ movie.saveCnt }}
          <v-icon
            dark
            right
            v-text="
              movie.isSaved ? 'mdi-bookmark-check' : 'mdi-bookmark-outline'
            "
          ></v-icon>
        </v-btn>
        <!-- 좋아요 -->
        <v-btn color="red" dark @click="likeMovie">
          {{ movie.likeCnt }}
          <v-icon
            dark
            right
            v-text="movie.isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
          ></v-icon>
        </v-btn>
      </div>
      <hr />
      <h3>감독</h3>
      <hr />
      <div>
        <PeopleCardList :people="movie.crews" />
      </div>

      <h3>배우</h3>
      <hr />
      <div>
        <PeopleCardList :people="movie.actors" />
      </div>
      <!-- 확대했을 때 dialog -->
      <v-dialog v-model="dialog" max-width="500">
        <v-img :src="imgURL"></v-img>
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
    </div>
  </div>
</template>

<script>
import axios from "axios";
import ReviewList from "@/components/reviews/ReviewList.vue";
import PeopleCardList from "../../components/people/PeopleCardList.vue";
import { mapActions } from "vuex";

export default {
  name: "MovieDetail",
  data: function () {
    return {
      dialog: false,
      movie: null,
      rank: null,
      myReview: null,
      reviewList: null,
      reviewCnt: null,
    };
  },
  components: {
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
    magnify: function () {},
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
.hover-magnifier {
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 100;
}
.hover-magnifying {
  background-color: rgba(92, 78, 78, 0.2);
  position: absolute;
  height: 100%;
  width: 100%;
  z-index: 100;
}
.poster-box {
  position: relative;
  display: inline-flex;
  width: 200px;
  height: 300px;
  object-fit: fill;
}
</style>
