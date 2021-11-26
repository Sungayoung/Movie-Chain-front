<template>
  <div v-if="review" >
    <v-list-item  >
      <!-- 리뷰와 댓글 리스트를 보여준다 -->
      <template >
        <v-list-item-avatar @click="goToProfile">
          <v-img :src="imgUrl"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ review.user.nickname }}<span v-if="review.rank"><v-icon color="#E6AF00">mdi-star</v-icon> {{ review.rank / 2}}</span></v-list-item-title>

          <!-- 수정모드면 input, 아니면 text를 보여준다. -->
          <v-list-item-subtitle v-if="editMode">
            <v-text-field
              maxlength="200"
              :rules="reviewRule"
              v-model="reviewInput"
              @keyup.enter="editReview"
            >
            </v-text-field>
          </v-list-item-subtitle>

          <v-list-item v-if="!editMode">
            {{ review.content }}
          </v-list-item>
        </v-list-item-content>
        <v-btn v-if="editMode" @click="editReview">수정</v-btn>
        <v-list-item-action
          class="text-center justify-content-center"
        >
          <v-list-item-action-text
            class="justify-content-center d-flex container p-0"
          >
            {{ review.updated_at | moment("YY-MM-DD HH:mm") }}
          </v-list-item-action-text>
          <v-list-item-icon>
            <!-- 좋아요 버튼 : 해당 리뷰를 좋아요 한다 -->
            <v-icon
              @click="likeReview"
              color="red"
              large
              v-text="review.isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
            ></v-icon>

            <!-- 수정버튼 : editMode 값을 토글시킨다 -->
            <v-icon @click="modeChange" v-if="review.isWriter" large
              >mdi-pencil</v-icon
            >
            <!-- 삭제버튼 : 클릭시 삭제된다. -->
            <v-icon
              v-if="review.isWriter"
              @click="removeReview"
              color="red lighten-2"
              large
              >mdi-delete</v-icon
            >
          </v-list-item-icon>
        </v-list-item-action>
        <v-btn @click="isExpand=!isExpand">댓글 {{ commentCnt }}</v-btn>
      </template>
    </v-list-item>
    
    <div class="px-3">
      <comment-list @calCommentCnt="calCommentCnt" v-if="review" :reviewId="review.id" :class="{'hide-comment':!isExpand}"></comment-list>
    </div>
  </div>
</template>

<script>
import CommentList from "./CommentList.vue";
import { mapActions } from "vuex";
import axios from "axios";
export default {
  name: "Review",
  components: {
    CommentList,
  },
  data: function () {
    return {
      reviewInput: null,
      commentCnt: 0,
      isExpand: false,
      editMode: false,
      reviewRule: [
        (v) => !!v || " 리뷰를 입력해주세요.",
        (v) =>
          !(v && v.length > 200) || "리뷰는 200자 이상 입력할 수 없습니다.",
      ],
    };
  },
  props: {
    review: Object,
  },
  created: function () {
    this.commentCnt = this.review.commentCnt
    this.reviewInput = this.review.content
  },
  methods: {
    ...mapActions(["deleteReview", "createComment", "updateReview"]),
    calCommentCnt(val) {
      this.commentCnt = val
    },
    goToProfile: function () {
      this.$router.push({
        name: "Profile",
        params: { nickname: this.review.user.nickname },
      });
    },
    removeReview: function () {
      this.deleteReview(this.review.id).then(() => {
        this.$emit("reload-review");
      });
    },
    modeChange: function () {
      if (this.editMode) {
        this.reviewInput = this.review.content
      }
      this.editMode = !this.editMode;
    },
    editReview: function () {
      const data = {
        reviewId: this.review.id,
        params: {
          content: this.reviewInput,
        },
      };
      this.updateReview(data).then((res) => {
        this.reviewInput = res.content
        this.review.content = res.content;
        this.editMode = false;
      });
    },
    likeReview: function () {
      const token = localStorage.getItem("jwt");
      axios({
        method: "post",
        url: `${process.env.VUE_APP_MCS_URL}/movies/like-review/`,
        headers: { Authorization: `JWT ${token}` },
        data: { reviewId: this.review.id },
      }).then((res) => {
        this.review.isLiked = res.data.isLiked;
      });
    },
  },
  computed: {
    imgUrl: function () {
      if (this.review) {
        return `${process.env.VUE_APP_MCS_URL}${this.review.user.profile_img}`;
      } else {
        return null;
      }
    },
  },
};
</script>

<style>
.hide-comment{
  display: none;
  transition: 500ms;
}
</style>
