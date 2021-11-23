<template>
  <div v-if="person" class="d-flex">
    <v-sheet
    rounded="xl"
       color="grey lighten-3"
      elevation="12"
      width="70%"
      class="mx-auto my-5"
    >
      <div style="background-color: #EED360; border-radius: 20px 20px 0px 0px" >
        <v-row class="p-3" justify="end">
          <!-- 팔로우 버튼 -->
          <v-btn
            dark
            @click="followPeople"
            width="120px"
            
          >{{ person.is_following ? 'UNFOLLOW' : 'FOLLOW'}}</v-btn>
        </v-row>
        <v-row 
          justify="center"
          no-gutters 
          class="p-1">
          <v-avatar
            class="m-3"
            size="128"
          ><img :src="imgURL">
          </v-avatar>
        </v-row>
        
        <v-row justify="center">
          <h3 style="color: white; text-align: center" >{{ person.name }} 님</h3>
        </v-row>
      </div>
      
      <div class="my-3">
        <v-row>
          <h4 style="text-align: center"
            v-text="person.job ? '연출한 영화' : '출연한 영화'"></h4>
          <movie-card-list
          :movies="person.movies"
          class="my-3"></movie-card-list>
          <v-divider></v-divider>
        </v-row>
      </div>
    </v-sheet>
  </div>
</template>

<script>
import axios from 'axios'
import MovieCardList from '@/components/movies/MovieCardList.vue'
export default {
  name: "PeopleProfile",
  props: {
    personId: String 
  },
  data: function () {
    return {
      person: null
    }
  },
  components: {
    MovieCardList
  },
  created: function () {
    this.getProfile()
  },
  methods: {
    getProfile: function () {
      const token = localStorage.getItem('jwt')
      axios({
        method: 'get',
        url: `${process.env.VUE_APP_MCS_URL}/movies/people/${this.personId}`,
        headers: {Authorization: `JWT ${token}`}
      })
      .then( res => {
        console.log(res.data)
        this.person = res.data
      })
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
    imgURL: function () {
      if (this.person) {
        if (this.person.profile_path) {
          return `https://image.tmdb.org/t/p/w500${this.person.profile_path}`;
        } else {
          return `${process.env.VUE_APP_MCS_URL}/media/images/profile/person_default.jpg`
        }
      } else {
        return null;
      }
    },
  },
};
</script>

<style></style>
