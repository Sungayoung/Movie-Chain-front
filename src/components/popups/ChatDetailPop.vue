<template>
    <v-dialog 
      v-if="chat"
      v-model="dialog"
      width="400px"
      >
      <template 
        v-slot:activator="{ on, attrs }"
        >
        <v-list-item
          v-bind="attrs"
          v-on="on"
          v-text="chat.content"
          @click="updateRead"
        >
        </v-list-item>
      </template>
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
            <v-list-item-subtitle>
              {{ chat.created_at | moment('YY-MM-DD HH:mm') }}
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
        <chat-input-pop
          :toUser="chat.from_user"
          :btnName="'답장'"
          ></chat-input-pop>
        <v-btn
          color="error"
          width= "100px"
          @click="removeChatting"
        >
          삭제
        </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'
import ChatInputPop from './ChatInputPop.vue'
export default {
  name: "ChatDetailPop",
  components: {
    ChatInputPop
  },
  data: function () {
    return {
      dialog: false
    }
  },
  props: {
    chat: Object
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
      .then( () => {
        this.dialog = false
        this.$emit('reload-chat')
      })
    },
    updateRead: function () {
      if(!this.chat.is_read){
        const token = localStorage.getItem('jwt')
        axios({
          method: 'put',
          url: `${process.env.VUE_APP_MCS_URL}/accounts/chatting/`,
          headers: {Authorization : `JWT ${token}`},
          data: { chatId : this.chat.id }
        })
        .then( () => {
          this.chat.is_read = !false
          this.$emit('update-read')
        })
      }
    }
  },
  computed: {
    imgUrl: function () {
      if (this.chat){
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
