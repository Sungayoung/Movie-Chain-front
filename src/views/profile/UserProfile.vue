<template>
  <div>
    <v-row justify="center">
      <div>
        <v-avatar
          class="m-3"
          size="128"
        ><img :src="imgUrl">
        </v-avatar>
        <v-fab-transition>
          <v-btn
            color="pink"
            dark
            absolute
            fab
            small
          >
          <v-icon>mdi-plus</v-icon>
          </v-btn>
        </v-fab-transition>
      </div>
    </v-row>
    <h3>프로필 이미지 변경</h3>
    {{ nickname }}
    <v-file-input v-model="profileImg" name="profileImg"></v-file-input>
    <button @click="sendProfile()">전송</button>
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
            style="width: 150px"
            v-text="isLoginUser ? '쪽지 확인' : '쪽지 보내기'"
          >
            Open Dialog
          </v-btn>
        </template>
        <chat-pop
        :isLoginUser="isLoginUser"></chat-pop>
      </v-dialog>
    </v-row>
    <movie-card-list></movie-card-list>
  </div>
</template>

<script>
import MovieCardList from '@/components/movies/MovieCardList'
import ChatPop from '@/components/popups/ChatPop'
// import axios from 'axios'
import { mapActions, mapState } from 'vuex'
export default {
  name: "UserProfile",
  components: {
    MovieCardList,
    ChatPop,
  },
  data: function () {
    return {
      profile: null,
      profileImg: null,
      isLoginUser: null
    }
  },
  mounted: function () {
    if(this.nickname){
      this.getProfileInfo(this.nickname)
      console.log(this.nickname)
      console.log(this.userNickname)
      this.isLoginUser = this.nickname == this.userNickname
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
    getProfileInfo: function () {
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
      })
    }
  },
  watch: {
    nickname: function () {
      this.$router.go()
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
};
</script>

<style></style>
