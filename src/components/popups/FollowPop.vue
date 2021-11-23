<template>
  <div>
    <div v-if="person">
    <v-list-item>
      <v-list-item-avatar @click="goToProfile" size=70>
        <img :src="imgUrl" style="object-fit: cover">
      </v-list-item-avatar>
      <v-list-item-content>
        <v-list-item-title
        v-text="idx < 2 ? person.nickname: person.name "></v-list-item-title>
      </v-list-item-content>
      <v-list-item-icon @click="followPeople">
        <v-btn
            dark
            width="120px"
          >{{ person.is_following ? 'UNFOLLOW' : 'FOLLOW'}}</v-btn>
      </v-list-item-icon>
    </v-list-item>
  </div>
  </div>
</template>

<script>
import axios from 'axios'
export default {
  name: 'FollowPop',
  props: {
    idx: Number,
    person: Object,
  },
  methods: {
    goToProfile: function () {
      if (this.idx < 2) {
        this.$router.push({name: 'Profile', params: {'nickname' : this.person.nickname }})
      }
      else {
        this.$router.push({name: 'PeopleProfile', params: {'personId': this.person.id}})
      }

    },
    followPeople: function () {
        const token = localStorage.getItem('jwt')
        const follow = this.person.job ? 'crew' : 'actor'
        axios({
          method: 'post',
          url: `${process.env.VUE_APP_MCS_URL}/accounts/follow/`,
          headers: { Authorization: `JWT ${token}` },
          data: {follow: follow, follow_id: this.person.id,}
        })
        .then( res => {
          this.person.is_following = !this.person.is_following
          console.log(res.data)
        })
        .catch( err => {
          console.log(err)
        })
      }
  },
  computed: {
    imgUrl: function () {
      if (this.person) {
        if (this.idx < 2) {
            return `${process.env.VUE_APP_MCS_URL}${this.person.profile_img}`
        }
        else {
          if (this.person.profile_path) {
            return `https://image.tmdb.org/t/p/w500${this.person.profile_path}`;
          } 
          else {
            return `${process.env.VUE_APP_MCS_URL}/media/images/profile/person_default.jpg`
          }
        }
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