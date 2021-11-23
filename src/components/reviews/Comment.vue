<template>
  <div v-if="comment">
    <v-list-item>
      <v-list-item-avatar>
        <v-img :src="imgUrl"></v-img>
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ comment.user.nickname }}</v-list-item-title>
        <!-- 수정모드면 input, 아니면 text를 보여준다. -->
        <v-list-item-subtitle v-if="editMode">
          <v-text-field v-model="comment.content" filled rounded @keyup.enter="editComment">
          </v-text-field>
          <v-btn @click="editComment">수정</v-btn>
        </v-list-item-subtitle>
        <v-list-item-subtitle v-else>
          {{ comment.content }}
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text>{{ comment.created_at | moment('YY-MM-DD HH:mm') }}</v-list-item-action-text>
        <v-list-item-icon>
        <!-- 수정버튼 : editMode 값을 토글시킨다 -->
          <v-icon 
            @click="modeChange" 
            v-if="comment.isWriter" 
            >mdi-pencil</v-icon>
        <!-- 삭제버튼 : 클릭시 삭제된다. -->
          <v-icon 
            v-if="comment.isWriter" 
            @click="removeComment" 
            color="red lighten-2" 
            >mdi-delete</v-icon>
        </v-list-item-icon>
      </v-list-item-action>
    </v-list-item>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
export default {
  name: "Comment",
  props: {
    comment: Object,
  },
  data: function () {
    return {
      editMode: false,
    }
  },
  methods: {
    ...mapActions([
      'updateComment',
      'deleteComment',
    ]),
    modeChange: function () {
      this.editMode = !this.editMode
    },
    editComment: function () {
      const data = {
        commentId: this.comment.id,
        params: {
          content: this.comment.content,
        }
      }
      this.updateComment(data)
      .then( res => {
        this.comment.content = res.content
        this.editMode = false
      })
    },
    removeComment: function () {
      this.deleteComment(this.comment.id)
      .then( () => {
        this.$emit('reload-comment')
      })
    },
  },
  computed: {
    imgUrl: function () {
      if (this.comment) {
        return `${process.env.VUE_APP_MCS_URL}${this.comment.user.profile_img}`
      }
      else {
        return null
      }
    }
  }
};
</script>

<style></style>
