<template>
  <div v-if="review">
      <v-list-item>
      <!-- 리뷰와 댓글 리스트를 보여준다 -->
      <template>
        <v-list-item-avatar @click="goToProfile">
          <v-img :src="imgUrl"></v-img>
        </v-list-item-avatar>
        <v-list-item-content>
          <v-list-item-title>{{ review.user.nickname }}</v-list-item-title>
          
          <!-- 수정모드면 input, 아니면 text를 보여준다. -->
          <v-list-item-subtitle v-if="editMode">
            <v-text-field v-model="review.content" filled rounded @keyup.enter="editReview">
            </v-text-field>
            <v-btn @click="editReview">수정</v-btn>
          </v-list-item-subtitle>
          <v-list-item-subtitle v-else>
            {{ review.content }}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-list-item-action-text>{{ review.created_at | moment('YY-MM-DD HH:mm') }}</v-list-item-action-text>
            <v-list-item-icon>
            <!-- 좋아요 버튼 : 해당 리뷰를 좋아요 한다 -->
              <v-icon
                @click="likeReview"
                color="red" 
                large v-text="review.isLiked ? 'mdi-heart' : 'mdi-heart-outline'"
              ></v-icon>
            <!-- 수정버튼 : editMode 값을 토글시킨다 -->
              <v-icon 
                @click="modeChange" 
                v-if="review.isWriter" 
                large>mdi-pencil</v-icon>
            <!-- 삭제버튼 : 클릭시 삭제된다. -->
              <v-icon 
                v-if="review.isWriter" 
                @click="removeReview" 
                color="red lighten-2" 
                large>mdi-delete</v-icon>
            </v-list-item-icon>
        </v-list-item-action>
      </template>
      </v-list-item>
    <v-list-group class="px-3">
      <comment-list v-if="review" :reviewId="review.id"></comment-list>
    </v-list-group>
      
  </div>
</template>

<script>
import CommentList from "./CommentList.vue";
import { mapActions } from 'vuex'
import axios from 'axios'
export default {
  name: "Review",
  components: {
    CommentList,
  },
  data: function () {
    return {
      commentInput: null,
      editMode: false,
    }
  },
  props: {
    review: Object
  },
  methods: {
    ...mapActions([
      'deleteReview',
      'createComment',
      'updateReview'
    ]),
    goToProfile: function () {
      this.$router.push({ name: 'Profile' , params: {'nickname': this.review.user.nickname}})
    },
    removeReview: function () {
      this.deleteReview(this.review.id)
      .then( () => {
        
        this.$emit('reload-review')
      })
    },
    modeChange: function () {
      this.editMode = !this.editMode
    },
    editReview: function () {
      const data = {
        reviewId: this.review.id,
        params: {
          content: this.review.content,
        }
      }
      this.updateReview(data)
      .then( res => {
        this.review.content = res.content
        this.editMode = false
      })
    },
    likeReview: function () {
      const token = localStorage.getItem("jwt");
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_MCS_URL}/movies/like-review/`,
        headers: {Authorization : `JWT ${token}`},
        data: { reviewId: this.review.id }
      })
      .then( res => {
        this.review.isLiked = res.data.isLiked
      })
    }
  },
  computed: {
    imgUrl: function () {
      if (this.review) {
        return `${process.env.VUE_APP_MCS_URL}${this.review.user.profile_img}`
      }
      else {
        return null
      }
    }
  }
};
</script>

<style></style>
