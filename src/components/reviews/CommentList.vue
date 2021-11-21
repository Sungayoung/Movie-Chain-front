<template>
  <div class="p-3">
    <v-text-field 
      class="p-3" 
      v-model="commentInput" 
      @keyup.enter="setComment"
    ></v-text-field>
    <div v-if="commentList">
      <comment 
        v-for="comment in commentList" 
        :key="comment.id"
        :comment="comment"
        @reload-comment="getCommentList">
      </comment>
    </div> 
  </div>
</template>

<script>
import Comment from "./Comment.vue";
import { mapActions } from 'vuex'
export default {
  name: "CommentList",
  components: {
    Comment,
  },
  data: function () {
    return {
      commentList: null,
      commentInput: null,
    }
  },
  props: {
    reviewId: Number,
  },
  created: function () {
    this.getCommentList()
  },
  methods: {
    ...mapActions([
      'getComment',
      'createComment',
    ]),
    getCommentList: function () {
      this.getComment(this.reviewId)
      .then( res => {
        this.commentList = res
      })
      .catch( err => {
        console.log(err)
      })
    },
    setComment: function () {
      const data = {
        reviewId: this.reviewId,
        params: {
          content: this.commentInput
        }
      }
      this.createComment(data)
      .then( res => {
        console.log(res)
        this.getCommentList()
      })
    }
  },
};
</script>

<style></style>
