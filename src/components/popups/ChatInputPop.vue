<template>
  <v-dialog
    v-model="dialog"
    width="600px"
  >
    <template 
      v-slot:activator="{ on, attrs }"
      >
      <v-btn
        color="#999999"
        dark
        v-bind="attrs"
        v-on="on"
        style="width: 100px"
        v-text="btnName"
        class="m-2"
      >
      </v-btn>
    </template>
    <v-card v-if="toUser">
      <v-card-title>{{ toUser.nickname }}님께 쪽지 보내기</v-card-title>
      <v-divider></v-divider>
      <v-card-text style="height: 300px;">
        <v-textarea
            solo
            name="input-7-4"
            label="쪽지내용"
            v-model="chattingInput"
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
  </v-dialog>
</template>

<script>
import axios from 'axios'
export default {
  name: "ChatPop",
  props: {
    btnName: String,
    toUser: Object
  },
  data: function () {
    return {
      chattingInput: null,
      dialog: false,
    }
  },
  methods: {
    sendChatting: function () {
      const token = localStorage.getItem('jwt')
      const data = {
        to_user: this.toUser.id,
        content: this.chattingInput,
      }
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/chatting/`,
        headers: { Authorization: `JWT ${token}` },
        data: data,
      })
      .then( res => {
        this.dialog = false
        this.chattingInput = null
      })

    }
  }
};
</script>

<style></style>
