<template>
  <div>
    {{ movie }}

    <v-rating
      color="warning"
      background-color="warning lighten-1"
      empty-icon="mdi-heart-outline"
      full-icon="mdi-heart"
      half-icon="mdi-heart-half-full"
      half-increments
      hover
      length="5"
      size="50"
      v-model="value"
    ></v-rating>
    {{ value }}
    <v-icon large color="green darken-2"> mdi-domain </v-icon>
    <v-icon large color="green darken-2"> mdi-heart-outline </v-icon>
    <review-list :movieId="movieId"> </review-list>
  </div>
</template>

<script>
import ReviewList from "@/components/reviews/ReviewList.vue";
import { mapActions } from "vuex";

export default {
  name: "MovieDetail",
  data: function () {
    return {
      movie: null,
      reviewInput: null,
      commentInput: null,
      reviewEditInput: null,
      reviewList: [],
      value: null,
    };
  },
  components: {
    ReviewList,
  },
  props: { movieId: String },
  mounted: function () {
    this.getMovie(), this.getReviewList();
  },
  methods: {
    ...mapActions([
      "getMovieDetail",
      "createReview",
      "getReview",
      "createComment",
      "deleteReview",
      "updateReview",
    ]),
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
    setReview: function () {
      const data = {
        movieId: this.movieId,
        params: {
          content: this.reviewInput,
        },
      };
      this.createReview(data).then((res) => {
        console.log(res);
        this.getReviewList();
      });
    },
    getReviewList: function () {
      this.getReview(this.movieId)
        .then((res) => {
          this.reviewList = res;
        })
        .catch((err) => {
          console.log(err);
        });
    },
    setComment: function (reviewId) {
      const data = {
        reviewId: reviewId,
        params: {
          content: this.commentInput,
        },
      };
      this.createComment(data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    delReview: function (reviewId) {
      this.deleteReview(reviewId)
        .then((res) => {
          this.getReviewList();
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    editReview: function (reviewId, content) {
      const data = {
        reviewId,
        params: {
          content,
        },
      };
      this.updateReview(data)
        .then((res) => {
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style></style>
