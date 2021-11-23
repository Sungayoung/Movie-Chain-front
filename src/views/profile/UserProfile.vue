<template>
  <div v-if="profile">
    <v-row justify="center">
      <v-avatar
        class="m-3"
        size="128"
      ><img :src="imgUrl">
      </v-avatar>
    </v-row>
    <v-row justify="center">
      <v-dialog
        scrollable
        width="600px"
      >
        <template 
          v-slot:activator="{ on, attrs }"
          >
          <v-btn
            color="primary"
            dark
            v-bind="attrs"
            v-on="on"
            style="width: 120px"
            v-text="isLoginUser ? '쪽지 확인' : '쪽지 보내기'"
            @click="getChatList"
          >
          </v-btn>
        </template>
        <chat-list-pop
        v-if="isLoginUser"
        :chatList="chatList"
        @reload-chat="getChatList"
        ></chat-list-pop>
        <chat-input-pop
        v-else
        :toUser="profile">

        </chat-input-pop>
      </v-dialog>
    </v-row>
    <v-row>
    <movie-card-list-personal
     :movieList="profile.personal_movies"
     :isLoginUser="isLoginUser"
     @reload-profile="getProfileInfo()"></movie-card-list-personal>
    </v-row>
    <h3>프로필 이미지 변경</h3>
    {{ nickname }}
    <v-file-input v-model="profileImg" name="profileImg"></v-file-input>
    <button @click="sendProfile()">전송</button>
    <v-row>

    <movie-card-list></movie-card-list>
    </v-row>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions, mapState } from 'vuex'
import MovieCardList from '@/components/movies/MovieCardList'
import ChatListPop from '@/components/popups/ChatListPop'
import MovieCardListPersonal from '@/components/movies/MovieCardListPersonal'
import ChatInputPop from '../../components/popups/ChatInputPop.vue'
export default {
  name: "UserProfile",
  components: {
    MovieCardList,
    ChatListPop,
    ChatInputPop,
    MovieCardListPersonal,
  },
  data: function () {
    return {
      profile: null,
      profileImg: null,
      isLoginUser: null,
      chatList: null,
    }
  },
  mounted: function () {
    if(this.nickname){
      console.log(this.nickname)
      this.getProfileInfo(this.nickname)
      const userInfo = JSON.parse(localStorage.getItem('userInfo'))
      this.isLoginUser = this.nickname == userInfo.nickname
    }
  },
  props: {
    nickname: String,
  },
  methods: {
    ...mapActions([
      'getProfile',
      'setProfile'
    ]),
    getProfileInfo: function (inputData) {
      inputData
      this.getProfile(this.nickname)
      .then(res=> {
        this.profile = res
        console.log(res)
      })
    },
    sendProfile: function () {
      let data = new FormData()
      data.append('files', this.profileImg)
      this.setProfile(data)
      .then( () => {
        this.getProfileInfo()
        this.$router.go()
      })
    },
    getChatList: function (inputData) {
      inputData
      const token = localStorage.getItem('jwt')
      axios({
        method: 'get',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/chatting/`,
        headers: { Authorization: `JWT ${token}` },
      })
      .then( res => {
        console.log(res.data)
        this.chatList = res.data
      })
      .catch( err => {
        console.log(err)
      })
    }
  },
  computed: {
    ...mapState([
      'userNickname'
    ]),
    imgUrl: function () {
      if (this.profile) {
        return `${process.env.VUE_APP_MCS_URL}${this.profile.profile_img}`
      }
      else {
        return this.nickname
      }
    }
  }
}
</script>

<style></style>
