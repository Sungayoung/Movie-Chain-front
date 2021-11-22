<template>
  <div v-if="reviewList">
    <v-list>
      <v-list-item>
        {{ reviewCnt }}개의 리뷰가 있습니다.
      </v-list-item>
      <v-text-field
      v-if="myReview.length == 0"
      v-model="reviewInput"
      @keyup.enter="setReview()"
      ></v-text-field>
      <review v-if="myReview.length != 0 && myReview[0].content != null"
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
      reviewInput: null,
    }
  },
  props: {
    reviewCnt: Number,
    movieId: String,
    myReview: Array,
    reviewList: Array,
  },
  methods: {
    ...mapActions([
      'createReview',
    ]),
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
