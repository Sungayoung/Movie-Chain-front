<template>
<v-card v-if="toUser">
  <v-card-title>{{ toUser.nickname }}님께 쪽지 보내기</v-card-title>
  <v-divider></v-divider>
  <v-card-text style="height: 300px;">
    <v-textarea
        solo

        name="input-7-4"
        label="쪽지내용"
        v-model="chattingInput"
        @keyup.enter="sendChatting"
      ></v-textarea>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions>
      <v-btn
        color="blue darken-1"
        dark
        @click="sendChatting"
      >
        전송
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script>
import axios from 'axios'
export default {
  name: "ChatPop",
  props: {
    toUser: Object
  },
  data: function () {
    return {
      chattingInput: null,
    }
  },
  methods: {
    sendChatting: function () {
      const token = localStorage.getItem('jwt')
      console.log(this.toUser)
      const data = {
        to_user: this.toUser.pk,
        content: this.chattingInput,
      }
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/chatting/`,
        headers: { Authorization: `JWT ${token}` },
        data: data,
      })
      .then( res => {
        this.chattingInput = null
        console.log(res)
      })
      .catch( err => {
        console.log(err)
      })
    }
  }
};
</script>

<style></style>
