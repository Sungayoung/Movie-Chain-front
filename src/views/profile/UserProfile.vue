<template>
  <div>
    <h3>프로필 이미지 변경</h3>
    <v-file-input v-model="profileImg" name="profileImg"></v-file-input>
    <button @click="sendProfile()">전송</button>
    <v-btn>쪽지 보내기</v-btn>
    <movie-card-list></movie-card-list>
  </div>
</template>

<script>
import MovieCardList from '@/components/movies/MovieCardList'
import axios from 'axios'
export default {
  name: "UserProfile",
  components: {
    MovieCardList
  },
  methods: {
    getProfile: function () {
      const token = localStorage.getItem('jwt')
      axios({
        method: 'get',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/profile/`,
        headers: { Authorization: `JWT ${token}` },
      })
      .then( res => {
        console.log(res)
        this.profile = res.data
      })
      .catch( err => {
        console.log(err)
      })
    },
    sendProfile: function () {
      const token = localStorage.getItem('jwt')
      let data = new FormData()
      data.append('files', this.profileImg)
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/profile/`,
        data: data,
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `JWT ${token}`,
        }
      })
      .then( res => {
        this.getProfile()
        console.log(res.data)
      })
      .catch( err => {
        console.log(err)
      })
    }
  },
  computed: {
    imgUrl: function () {
      return `${process.env.VUE_APP_MCS_URL}${this.profile.profile_img}`
    }
  }
};
</script>

<style></style>
