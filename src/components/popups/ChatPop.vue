<template>
  <div v-if="chat">
    <v-list-item>
      <v-badge
      :value="!chat.is_read"
      color="red"
      offset-x="30"
      offset-y="25">

      <v-list-item-avatar @click="goToProfile" size="60">
        <img :src="imgUrl">
      </v-list-item-avatar>
      </v-badge>
      <v-list-item-content>
        <v-list-item-title>{{ chat.from_user.nickname }}</v-list-item-title>
        <v-list-item-subtitle>
            <!-- 쪽지 세부내용 팝업 -->
            <chat-detail-pop
            :chat="chat"
            @update-read="updateRead(chat)"
            @reload-chat="reloadChat"></chat-detail-pop>
        </v-list-item-subtitle>
      </v-list-item-content>
      <v-list-item-action>
        <v-list-item-action-text> {{ chat.created_at | moment('YY-MM-DD HH:mm')}}</v-list-item-action-text>
        <v-list-item-icon @click="removeChatting">
          <v-icon class ="m-2" color="red lighten-2">mdi-delete</v-icon>
        </v-list-item-icon>
      </v-list-item-action>
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
      .then( () => {
        this.$emit('reload-chat')
      })
    },
    goToProfile: function () {
      this.$router.push({ name: 'Profile' , params: {'nickname': this.chat.from_user.nickname}})
      this.$router.go()
    },
    updateRead: function (chat) {
      chat.is_read = false
      this.$emit('reload-chat')
    },
    reloadChat: function (inputData) {
      inputData
      this.$emit('reload-chat')
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
