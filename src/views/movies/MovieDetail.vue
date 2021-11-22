<template>
  <div v-if="movie">
    {{ movie }}
    <v-rating
      color="warning"
      background-color="warning lighten-1"
      empty-icon="mdi-heart-outline"
      full-icon="mdi-heart"
      half-icon="mdi-heart-half-full"
      hover
      half-increments
      length="5"
      size="50"
      v-model="rank"
      @input="setRank"
    ></v-rating>
    {{ rank }}
    <v-btn color="primary" dark @click="saveMovie">
      {{ movie.saveCnt }}
      <v-icon dark right v-text="movie.isSaved ? 'mdi-bookmark-check' : 'mdi-bookmark-check-outline'"></v-icon>
    </v-btn>
    <v-btn color="red" dark @click="likeMovie">
      {{ movie.likeCnt }}
      <v-icon dark right v-text="movie.isLiked ? 'mdi-heart' : 'mdi-heart-outline'"></v-icon>
    </v-btn>

    
    <v-icon large color="red lighten-2">  </v-icon>
    <review-list 
      :reviewList="reviewList"
      :myReview="myReview"
      @reload-review="getReviewList"> </review-list>
  </div>
</template>

<script>
import axios from 'axios'
import ReviewList from "@/components/reviews/ReviewList.vue";
import { mapActions } from "vuex";

export default {
  name: "MovieDetail",
  data: function () {
    return {
      movie: null,
      rank: null,
      myReview: null,
      reviewList: null,
    };
  },
  components: {
    ReviewList,
  },
  props: { movieId: String },
  created: function () {
    this.getMovie(), this.getReviewList();
  },
  methods: {
    ...mapActions([
      "getMovieDetail",
      'getReview',
      'createReview',
      'updateReview',
    ]),
    getReviewList: function () {
      this.getReview(this.movieId)
      .then( res => {
        this.myReview = res.my_review
        if (this.myReview.length != 0) {
          this.rank = this.myReview[0].rank / 2
        }
        this.reviewList = res.reviews
        console.log(this.myReview)
      })
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
        method: 'post',
        url: `${process.env.VUE_APP_MCS_URL}/movies/like-movie/`,
        headers: {Authorization : `JWT ${token}`},
        data: { movieId: this.movie.id }
      })
      .then( res => {
        this.movie.likeCnt = res.data.likeCnt
        this.movie.isLiked = res.data.isLiked
      })
    },
    saveMovie: function () {
      const token = localStorage.getItem("jwt");
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_MCS_URL}/movies/bookmark-movie/`,
        headers: {Authorization : `JWT ${token}`},
        data: { movieId: this.movie.id }
      })
      .then( res => {
        this.movie.saveCnt = res.data.saveCnt
        this.movie.isSaved = res.data.isSaved
      })
    },
    setRank: function () {
      console.log('hello')
      if(this.myReview.length == 0) {
        const data = {
          movieId: this.movieId,
          params: {
            rank: this.rank * 2
          }
        }
        this.createReview(data)
        .then( () => {
          this.getReviewList()
        })
      }
      else {
        const data = {
          reviewId: this.myReview[0].id,
          params: {
            rank: this.rank * 2
          }
        }
        this.updateReview(data)
        .then ( () => {
          this.getReviewList()
        })
      }
    }
  },
};
</script>

<style></style>
