<template>
  <div class="p-3">
      <div class="d-flex container">
        <v-text-field
          maxlength="200"
          v-model="commentInput"
          @keyup.enter="setComment"
          :rules="commentRule"
        ></v-text-field>
        <button class="ms-3" @click.stop="setComment">
          <v-icon>mdi-arrow-left-bottom-bold</v-icon>
        </button>
      </div>

    <div v-if="commentList">
      <comment
        v-for="comment in commentList"
        :key="comment.id"
        :comment="comment"
        @reload-comment="getCommentList"
      >
      </comment>
    </div>
  </div>
</template>

<script>
import Comment from "./Comment.vue";
import { mapActions } from "vuex";
export default {
  name: "CommentList",
  components: {
    Comment,
  },
  data: function () {
    return {
      commentList: null,
      commentInput: null,
      commentRule: [
        (v) => !!v || " 댓글을 입력해주세요.",
        (v) =>
          !(v && v.length > 200) || "댓글은 200자 이상 입력할 수 없습니다.",
      ],
    };
  },
  props: {
    reviewId: Number,
  },
  created: function () {
    this.getCommentList();
  },
  methods: {
    ...mapActions(["getComment", "createComment"]),
    calComment() {
      this.$emit("calCommentCnt", this.commentList.length);
    },
    getCommentList: function () {
      this.getComment(this.reviewId)
        .then((res) => {
          this.commentList = res;
          this.calComment();
        })
    },
    setComment: function () {
      const data = {
        reviewId: this.reviewId,
        params: {
          content: this.commentInput,
        },
      };
      this.createComment(data).then(() => {
        this.commentInput = null;
        this.getCommentList();
      });
    },
  },
};
</script>

<style></style>
