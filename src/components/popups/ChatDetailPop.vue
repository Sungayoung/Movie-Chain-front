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
        <v-btn
          color="primary"
          rounded
        >
          답장
        </v-btn>
        <v-btn
          color="error"
          rounded
        >
          삭제
        </v-btn>
      </v-card-actions>
    </v-card>
    <!-- <v-list-item>
      <v-list-item-avatar>
        
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ chat.from_user.nickname }}</v-list-item-title>
        수정모드면 input, 아니면 text를 보여준다.
        <v-list-item-subtitle>
          {{ chat.content }}
        </v-list-item-subtitle>
      </v-list-item-content>
      
      삭제버튼 : 클릭시 삭제된다.
      <v-list-item-icon @click="removeChatting">
        <v-icon class ="m-2" color="red lighten-2">mdi-delete</v-icon>
      </v-list-item-icon>
    </v-list-item> -->
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "ChatDetailPop",
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
