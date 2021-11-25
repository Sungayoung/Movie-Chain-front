<template>
  <div>
    <div v-if="user">
    <v-list-item>
      <v-list-item-avatar @click="goToProfile" size=70>
        <img :src="imgUrl" style="object-fit: cover">
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title>{{ user.nickname }}</v-list-item-title>
      </v-list-item-content>
      <v-list-item-icon @click="followUser">
        <v-btn
            dark
            width="120px"
            :color="user.is_following ? 'error' : '#999999'"
          >{{ user.is_following ? 'UNFOLLOW' : 'FOLLOW'}}</v-btn>
      </v-list-item-icon>
    </v-list-item>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: "UserPop",
  props: {
    user: Object,
  },
  methods: {
    goToProfile: function () {
      this.$router.push({name: 'Profile', params: {'nickname': this.user.nickname}})
      this.$router.go()
    },
    followUser: function () {
      const token = localStorage.getItem('jwt')
      axios({
        method: 'post',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/follow/`,
        headers: { Authorization: `JWT ${token}` },
        data: {follow: 'user', follow_id: this.user.id,}
      })
      .then( () => {
        this.user.is_following = !this.user.is_following
      })
      }
  },
  computed: {
    imgUrl: function () {
      if (this.user) {
        return `${process.env.VUE_APP_MCS_URL}${this.user.profile_img}`
      }
      else {
        return null
      }
    }
  }
}
</script>

<style>

</style>
