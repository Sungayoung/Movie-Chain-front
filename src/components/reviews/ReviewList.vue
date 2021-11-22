<template>
  <div v-if="reviewList">
    <v-text-field
    v-if="myReview.length == 0"
    v-model="reviewInput"
    @keyup.enter="setReview()"
    ></v-text-field>
    <v-list>
      <review v-if="myReview.length != 0"
      :review="myReview[0]"
      @reload-review="sendParent">
      </review>
      <hr>
      <review
      v-for="review in reviewList"
      :key="review.id"
      :review="review"
      @reload-review="sendParent"></review>
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
      // myReview: null,
      reviewInput: null,
      // reviewList: null,
    }
  },
  props: {
    movieId: String,
    myReview: Array,
    reviewList: Array,
  },
  // created: function () {
  //   this.getReviewList()
  // },
  methods: {
    ...mapActions([
      // 'getReview',
      'createReview',
    ]),
    // getReviewList: function () {
    //   this.getReview(this.movieId)
    //   .then( res => {
    //     this.myReview = res.my_review
    //     this.reviewList = res.reviews
    //     console.log(this.myReview)
    //     // console.log(res)
    //   })
    // },
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
        this.$emit('reload-review')
      })
    },
    sendParent: function () {
      this.$emit('reload-review')
    }
  }

};
</script>

<style></style>
