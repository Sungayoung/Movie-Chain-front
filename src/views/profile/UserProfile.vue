<template>
  <div v-if="profile" class="d-flex">
    <v-sheet
      rounded="xl"
       color="grey lighten-3"
      elevation="12"
      width="50%"
      class="mx-auto my-5"
    >
    <div style="background-color: #2E4D54; border-radius: 20px 20px 0px 0px" >
      <v-row class="p-3" justify="space-between">
        <v-col>
          <!-- 팔로우 리스트 확인 버튼 -->
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
            width="120px"
            
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
        <h3 style="color: white; text-align: center" >{{ profile.nickname }} 님</h3>
      </v-row>
      <v-row justify="center">
        <div class="py-3">
          <div style="color: white; text-align: center" >{{ profile.introduce_content }}</div>
        </div>
      </v-row>
    </div>

    
    <div class="my-3">
    <v-row>
    <movie-card-list-personal
     :movieList="profile.personal_movies"
     :isLoginUser="isLoginUser"
     @reload-profile="reloadProfile"></movie-card-list-personal>
     <v-divider></v-divider>
    </v-row>
    <v-row>
    <h4 style="text-align: center">좋아하는 영화</h4>
    <movie-card-list
    :movies="profile.favorite_movies"
    class="my-3"></movie-card-list>
    <v-divider></v-divider>
    <h4 style="text-align: center">저장한 영화</h4>
    <movie-card-list
    :movies="profile.bookmark_movies"
    class="my-3"></movie-card-list>
    </v-row>
    </div>
    </v-sheet>
  </div>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'
import FollowListPop from '@/components/popups/FollowListPop'
import MovieCardList from '@/components/movies/MovieCardList'
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
    ChatInputPop
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
}
</script>

<style scoped>

</style>
