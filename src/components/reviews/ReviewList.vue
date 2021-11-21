<template>
  <div>
    <v-text-field 
    v-model="reviewInput"
    @keyup.enter="setReview()"
    ></v-text-field>
    <v-list>
      <review
      v-for="review in reviewList"
      :key="review.id"
      :review="review"
      @reload-review="getReviewList"></review>
    </v-list>  
  </div>
</template>

<script>
import Review from "./Review.vue";
import { mapActions } from 'vuex';
export default {
  name: "ReviewList",
  components: {
    Review,
  },
  data: function () {
    return {
      reviewInput: null,
      reviewList: null,
    }
  },
  props: {
    movieId: String,
  },
  created: function () {
    this.getReviewList()
  },
  methods: {
    ...mapActions([
      'getReview',
      'createReview',
    ]),
    getReviewList: function () {
      this.getReview(this.movieId)
      .then( res => {
        this.reviewList = res
        console.log(this.reviewList)
      })
    },
    setReview: function () {
      const data = {
        movieId: this.movieId,
        params: {
          content: this.reviewInput,
        }
      }
      this.createReview(data)
      .then( res => {
        console.log(res)
        this.getReviewList()
      })
    }
  }

};
</script>

<style></style>
