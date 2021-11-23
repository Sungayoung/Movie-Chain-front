<template>
  <div v-if="chat">
    <v-card>
      <v-list-item three-line>
        <v-list-item-content>
          <div class="text-overline mb-4">
            CHATTING
          </div>
          <v-list-item-title class="text-h5 mb-1">
            from. {{ chat.from_user.nickname }}
          </v-list-item-title>
          <v-list-item-subtitle>
            to. {{ chat.to_user.nickname }}
          </v-list-item-subtitle>
        </v-list-item-content>

        <v-list-item-avatar size=80>
          <img :src="imgUrl">
        </v-list-item-avatar>
      </v-list-item>
      <v-divider class="mx-4"></v-divider>
      <v-card-text>
        {{ chat.content }}
      </v-card-text>
      <v-divider class="mx-4"></v-divider>
      <v-card-actions>
      <!-- 답장 기능을 위한 dialog -->
        <v-dialog
              width="400px"
            >
            <template 
              v-slot:activator="{ on, attrs }"
              >
              <v-btn
                v-bind="attrs"
                v-on="on"
                color="primary"
                rounded
              >
              답장
              </v-btn>
            </template>
            <chat-input-pop
            :toUser="chat.from_user"></chat-input-pop>
          </v-dialog>
        
        <v-btn
          color="error"
          rounded
        >
          삭제
        </v-btn>
      </v-card-actions>
    </v-card>
  </div>
</template>

<script>
import axios from 'axios'
import ChatInputPop from './ChatInputPop.vue'
export default {
  name: "ChatDetailPop",
  components: {
    ChatInputPop
  },
  props: {
    chat: Object
  },
  methods: {
    updateChatting: function () {
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
