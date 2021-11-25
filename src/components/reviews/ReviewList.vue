<template>
  <div v-if="reviewList" >
    <v-list-item> {{ reviewCnt }}개의 리뷰가 있습니다.</v-list-item>
    <v-text-field
      v-if="myReview.length == 0"
      v-model="reviewInput"
      @keyup.enter="setReview()"
      :rules="reviewRule"
    ></v-text-field>
    <div>
      <v-sheet rounded="xl" elevation="8" color="grey lighten-2" class="mt-5">
    <review
    class="review-card mx-auto"
      v-if="myReview.length != 0 && myReview[0].content != null"
      :review="myReview[0]"
      @reload-review="sendParent"
    >
    </review>      </v-sheet>
    <hr />
          <v-sheet rounded="xl" elevation="8" color="grey lighten-2" class="mt-5">
    <review
      class="review-card mx-auto"
      v-for="review in reviewList"
      :key="review.id"
      :review="review"
      @reload-review="sendParent"
    ></review>      </v-sheet>
    </div>
  </div>
</template>

<script>
import Review from "./Review.vue";
import { mapActions } from "vuex";
export default {
  name: "ReviewList",
  components: {
    Review,
  },
  data: function () {
    return {
      reviewInput: null,
      reviewRule: [
        (v) => !!v || " 리뷰를 입력해주세요.",
        (v) =>
          !(v && v.length > 200) || "리뷰는 200자 이상 입력할 수 없습니다.",
      ],
    };
  },
  props: {
    reviewCnt: Number,
    movieId: String,
    myReview: Array,
    reviewList: Array,
  },
  methods: {
    ...mapActions(["createReview"]),
    setReview: function () {
      const data = {
        movieId: this.movieId,
        params: {
          content: this.reviewInput,
        },
      };
      this.createReview(data).then((res) => {
        console.log(res);
        this.$emit("reload-review");
      });
    },
    sendParent: function () {
      this.$emit("reload-review");
    },
  },
};
</script>

<style>
.review-card {
  padding:15px;
  border-radius: 25px;
}
</style>
