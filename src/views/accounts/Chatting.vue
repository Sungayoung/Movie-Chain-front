<template>
  <div style="color: white;">
    <h3>프로필 이미지 전송!</h3>
    <div>
      <v-file-input v-model="profileImg" name="profileImg"></v-file-input>
      <button @click="sendProfile()">전송</button>
    </div>
    <h3>유저 프로필 정보</h3>
    <div>
      {{ profile }}
      <img :src="imgUrl" alt="">
    </div>
    <h3>채팅내역</h3>
    <div>
      <p v-for="(chat, idx) in chattingList" :key="idx">
        {{ chat.content }}
        {{ chat.from_user }}
      </p>
    </div>
    <h3>채팅 보내기</h3>
    <div>
      <input type="text" v-model="chattingInput" @keyup.enter="sendChatting">
    </div>
  </div>
</template>

<script>

import axios from 'axios'

export default {
  name: 'Chatting',
  data: function () {
    return {
      profile: null,
      chattingList: [],
      chattingInput: null,
      profileImg: null,
    }
  },
  mounted: function () {
    this.getChatting()
    this.getProfile()
  },
  methods: {
    getChatting: function () {
      const token = localStorage.getItem('jwt')
      axios({
        method: 'get',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/chatting/`,
        headers: { Authorization: `JWT ${token}` },
      })
      .then( res => {
        console.log(res)
        this.chattingList = res.data
      })
      .catch( err => {
        console.log(err)
      })
    },
    sendChatting: function () {
      const token = localStorage.getItem('jwt')
      const data = {
        to_user: 1,
        content: this.chattingInput,
      }
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/chatting/`,
        headers: { Authorization: `JWT ${token}` },
        data: data,
      })
      .then( res => {
        console.log(res)
        this.getChatting()
      })
      .catch( err => {
        console.log(err)
      })
    },
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
}
</script>

<style>

</style>
