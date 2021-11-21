<template>
  <div v-if="review">
    <span>{{ review.content }}</span>
    <button v-if="review.isWriter" @click="removeReview">삭제</button>
    <comment-list></comment-list>
  </div>
</template>

<script>
import CommentList from "./CommentList.vue";
import { mapActions } from 'vuex'
export default {
  name: "Review",
  components: {
    CommentList,
  },
  props: {
    review: Object
  },
  methods: {
    ...mapActions([
      'deleteReview'
    ]),
    removeReview: function () {
      this.deleteReview(this.review.id)
      this.$emit('reloadReview')
    }
  }
};
</script>

<style></style>
