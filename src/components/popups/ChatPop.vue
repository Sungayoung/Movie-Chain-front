<template>
  <div v-if="chat">
    <v-list-item>
      <v-badge
      :value="!chat.is_read"
      color="red"
      offset-x="30"
      offset-y="25">

      <v-list-item-avatar @click="goToProfile">
        <img :src="imgUrl">
      </v-list-item-avatar>
      </v-badge>
      <v-list-item-content>
        <v-list-item-title>{{ chat.from_user.nickname }}</v-list-item-title>
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
                @click="updateRead"
              >
              </v-list-item>
            </template>
            <chat-detail-pop
            :chat="chat"></chat-detail-pop>
          </v-dialog>
        </v-list-item-subtitle>
      </v-list-item-content>
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
        this.chat.is_read = false
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
        .then( res => {
          console.log(res.data)
          this.$emit('reload-chat')
        })
      } 
    },
    goToProfile: function () {
      this.$router.push({ name: 'Profile' , params: {'nickname': this.chat.from_user.nickname}})
      this.$router.go()
    },
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
