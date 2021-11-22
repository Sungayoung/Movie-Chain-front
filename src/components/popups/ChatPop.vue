<template>
  <div v-if="chat">
    <v-list-item>
      <v-list-item-avatar>
        <img :src="imgUrl">
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ chat.from_user.nickname }}</v-list-item-title>
        <!-- 수정모드면 input, 아니면 text를 보여준다. -->
        <v-list-item-subtitle>
            <v-dialog
              width="400px"
            >
            <template 
              v-slot:activator="{ on, attrs }"
              >
              <v-list-item
                v-bind="attrs"
                v-on="on"
                v-text="chat.content"
              >
              </v-list-item>
            </template>
            <chat-detail-pop
            :chat="chat"></chat-detail-pop>
          </v-dialog>
        </v-list-item-subtitle>
      </v-list-item-content>
      
      <!-- 삭제버튼 : 클릭시 삭제된다. -->
      <v-list-item-icon @click="removeChatting">
        <v-icon class ="m-2" color="red lighten-2">mdi-delete</v-icon>
      </v-list-item-icon>
    </v-list-item>
  </div>
</template>

<script>
import axios from 'axios'
import ChatDetailPop from './ChatDetailPop.vue'
export default {
  name: "ChatPop",
  props: {
    chat: Object,
    key: Number,
  },
  components: {
    ChatDetailPop
  },
  methods: {
    removeChatting: function () {
      const token = localStorage.getItem('jwt')
      axios({
        method: 'delete',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/chatting/`,
        headers: {Authorization : `JWT ${token}`},
        data: { chatId : this.chat.id }
      })
      .then( res => {
        console.log(res.data)
        this.$emit('reload-chat')
      })
    }
  },
  computed: {
    imgUrl: function () {
      if (this.chat){
        console.log(this.chat.from_user.profile_img)
        return `${process.env.VUE_APP_MCS_URL}${this.chat.from_user.profile_img}`
      }
      else {
        return null
      }
    }
  }
};
</script>

<style></style>
