<template>
  <div v-if="reviewList">
    <div class="" v-if="myReview.length == 0">
      <v-sheet
        rounded="xl"
        elevation="8"
        color="grey lighten-2"
        class="justify-content-center mt-3 container d-flex"
      >
        리뷰 작성
        <v-text-field
          v-model="reviewInput"
          @keyup.enter="setReview()"
          :rules="reviewRule"
        ></v-text-field>
        <v-icon @click.stop="setReview()">mdi-arrow-left-bottom-bold</v-icon>
      </v-sheet>
    </div>

    <div>
      <v-sheet rounded="xl" elevation="8" color="grey lighten-2" class="mt-5">
        <review
          class="review-card mx-auto"
          v-if="myReview.length != 0 && myReview[0].content != null"
          :review="myReview[0]"
          @reload-review="sendParent"
        >
        </review>
      </v-sheet>
      <v-sheet rounded="xl" elevation="8" color="grey lighten-2" class="mt-5">
        <review
          class="review-card mx-auto"
          v-for="review in reviewList"
          :key="review.id"
          :review="review"
          @reload-review="sendParent"
        ></review>
      </v-sheet>
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
      this.createReview(data).then(() => {
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
  padding: 15px;
  border-radius: 25px;
}
</style>
