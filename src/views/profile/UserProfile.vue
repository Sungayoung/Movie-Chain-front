<template>
  <div v-if="profile" class="d-flex">
      <div class='black-curtain'></div>

    <v-sheet
      rounded="xl"
      color="#EEEEEEB0"
      elevation="12"
      width="55%"
      class="mx-auto"
      style="margin-top: 100px; z-index: 1;"
    >
    <v-sheet style="border-radius: 20px 20px 0px 0px" :style="{'background-color': profile.background_color}" :elevation="8">
      <v-row class="p-3" justify="space-between">
        <v-col>
          <!-- 팔로우 리스트 확인 버튼 -->
          <color-picker-pop
          v-if="isLoginUser"
          :profile="profile">

          </color-picker-pop>
          <follow-list-pop
            v-if="isLoginUser"
            :profile="profile">
            
          </follow-list-pop>
        </v-col>
        <v-col>
          <v-row justify="end">

          <!-- 유저 정보 수정 -->
          <user-update
            v-if="isLoginUser"
            :profile="profile"
            @reload-profile="reloadProfile"
          ></user-update>
          
          <!-- 쪽지 확인 버튼 -->

          <chat-list-pop
            v-if="isLoginUser"
            :profile="profile"
            :btnName="'쪽지 확인'"
          ></chat-list-pop>
          <chat-input-pop
            v-else
            :toUser="profile"
            :btnName="'쪽지 보내기'"
          ></chat-input-pop>

          <!-- 팔로우 버튼 -->
          <v-btn
            dark
            class="m-2"
            v-if="!isLoginUser"
            @click="followUser"
            width="100px"
            :color="profile.is_following ? 'error' : '#999999'"
            
          >{{ profile.is_following ? 'UNFOLLOW' : 'FOLLOW'}}</v-btn>
          </v-row>
        </v-col>
      </v-row>
      <v-row 
        justify="center"
        no-gutters 
        class="p-1">
        <v-avatar
          class="m-3"
          size="128"
        ><img :src="imgUrl">
        </v-avatar>
      </v-row>
      
      <v-row justify="center">
        <h3 style="color: white; text-align: center" :style="{'color': fontColor}">{{ profile.nickname }} 님</h3>
      </v-row>
      <v-row justify="center">
        <div class="py-3">
          <div style="color: white; text-align: center" :style="{'color': fontColor}">{{ profile.introduce_content }}</div>
        </div>
      </v-row>
      
    </v-sheet>

    
    <div class="my-3">
    <v-row>
    <movie-card-list-personal
     :background_color="profile.background_color"
     :movieList="profile.personal_movies"
     :isLoginUser="isLoginUser"
     @reload-profile="reloadProfile"></movie-card-list-personal>
     <v-divider class="mx-5"></v-divider>
    </v-row>
    <v-row>
    <div v-if="profile.favorite_movies.length">
      <h4 style="text-align: center">좋아하는 영화</h4>
      <movie-card-list
      :movies="profile.favorite_movies"
      class="my-3"></movie-card-list>
    </div>
    
    <div v-if="profile.bookmark_movies.length">
      <v-divider class='mx-5'></v-divider>
      <h4 style="text-align: center">저장한 영화</h4>
      <movie-card-list
      :movies="profile.bookmark_movies"
      class="my-3"></movie-card-list>
    </div>
    </v-row>
    </div>
    </v-sheet>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import ColorPickerPop from '@/components/popups/ColorPickerPop.vue'
import FollowListPop from '@/components/popups/FollowListPop'
import MovieCardList from '@/components/movies/MovieCardList.vue'
import ChatListPop from '@/components/popups/ChatListPop'
import MovieCardListPersonal from '@/components/movies/MovieCardListPersonal'
import UserUpdate from '@/components/accounts/UserUpdate.vue'
import ChatInputPop from '../../components/popups/ChatInputPop.vue'

export default {
  name: "UserProfile",
  components: {
    MovieCardList,
    ChatListPop,
    MovieCardListPersonal,
    UserUpdate,
    FollowListPop,
    ChatInputPop,
    ColorPickerPop
  },
  data: function () {
    return {
      profile: null,
      profileImg: null,
      isLoginUser: null,
      chatList: null,
      imgUrl: null
    }
  },
  mounted: function () {
    if(this.nickname){
      this.getProfileInfo(this.nickname)
      
      console.log(this.nickname)
      console.log(this.$store.state.nickname)
    }
  },
  props: {
    nickname: String,
  },
  methods: {
    ...mapActions([
      'getProfile',
    ]),
    getProfileInfo: function (inputData) {
      inputData
      this.getProfile(this.nickname)
      .then(res=> {
        console.log(res)
        this.profile = res
        this.imgUrl = `${process.env.VUE_APP_MCS_URL}${res.profile_img}?_=${new Date().getTime()}`
        this.isLoginUser = this.nickname == this.$store.state.nickname
      })
    },
    reloadProfile: function (inputData) {
      if(inputData) {
        if(inputData=='profile_img') {
          this.imgUrl = `${process.env.VUE_APP_MCS_URL}${this.profile.profile_img}?_=${new Date().getTime()}`
        }
        else{
          this.$router.push({name: 'Profile', params: {'nickname': inputData}})
        }
      }
      else{
        this.$router.go()
      }
    },
    followUser: function () {
      const token = localStorage.getItem('jwt')
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/follow/`,
        headers: { Authorization: `JWT ${token}` },
        data: {follow: 'user', follow_id: this.profile.id,}
      })
      .then( res => {
        this.profile.is_following = !this.profile.is_following
        console.log(res.data)
      })
      .catch( err => {
        console.log(err)
      })
    }
  },
  computed: {
    fontColor: function () {
      if (this.profile) {
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(this.profile.background_color);
        let r= parseInt(result[1], 16);
        let g= parseInt(result[2], 16);
        let b= parseInt(result[3], 16);
        console.log(r, g, b)
        if (r >= 190 && g >= 190 && b >= 190) {
          return 'black'
        }
        else {
          return 'white'
        }
      }
      else {
        return null
      }
    }
  }
}
</script>

<style scoped>
* ::-webkit-scrollbar {
  display: none;
}
.black-curtain {
  position: fixed;
  top: 0;
  background: rgb(0,0,0,0.5);
  width: 100%;
  height: 200vh;
  transition-delay: 1s;
  transition-duration: 1.1s;
  z-index: 1;
}
</style>
