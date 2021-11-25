<template>
  <v-dialog
    scrollable
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
        @click="getChatList"
      >
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        color="cyan"
        dark
        flat
      >
        <v-toolbar-title>쪽지 목록</v-toolbar-title>

        <v-spacer></v-spacer>
        <template v-slot:extension>
          <v-tabs
            v-model="tab"
            align-with-title
          >
          
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab
              v-for="item in items"
              :key="item"
            >
              {{ item }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(chats, idx) in chatList"
          :key="idx"
        >
          <v-card flat style="overflow-y: scroll">
            <v-card-text style="height: 600px;">
            <v-list>
              <chat-pop
              v-for="(chat, idx) in chats"
              :key="idx"
              :chat="chat"
              @reload-chat="getChatList()"
              ></chat-pop>
            </v-list>
          </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      </v-card>

  </v-dialog>
  
</template>

<script>
import axios from 'axios'
import ChatPop from './ChatPop.vue'
export default {
  name: "ChatListPop",
  data: function () {
    return {
      items: ['받은 쪽지함', '보낸 쪽지함'],
      tab: null,
      chatList: null,
    }
  },
  props: {
    btnName: String,
    profile: Object,
  },
  components: {
    ChatPop,
  },
  methods: {
    getChatList: function (inputData) {
      inputData
      const token = localStorage.getItem('jwt')
      axios({
        method: 'get',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/chatting/`,
        headers: { Authorization: `JWT ${token}` },
      })
      .then(res => {
        this.chatList = res.data
      })

    },
  }
};
</script>

<style></style>
