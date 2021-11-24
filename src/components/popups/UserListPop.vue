<template>
<v-dialog
    scrollable
  >
    <template 
      v-slot:activator="{ on, attrs }"
      >
      <v-btn
        color="white"
        rounded
        v-bind="attrs"
        v-on="on"
        style="width: 100px"
        class="m-2"
        @click="getUserList"
      >연결
      </v-btn>
    </template>
   
      <v-card>
      <v-tabs
        v-model="tab"
        background-color="deep-purple accent-4"
        centered
        dark
        icons-and-text
      >
        <v-tabs-slider></v-tabs-slider>

        <v-tab 
          v-for="item in items"
          :key='item'>
          {{ item }}
          <v-icon small>{{ icons[item] }}</v-icon>
        </v-tab>
      </v-tabs>

      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(users, key, idx) in userList"
          :key="idx"
        >
          <v-card flat style="overflow-y: scroll">
            <v-card-text style="height: 600px;">
            <v-list>
              <user-pop
              v-for="(user, i) in users"
              :key="i"
              :user="user"
              >

              </user-pop>
            </v-list>
            </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
import UserPop from './UserPop.vue'
export default {
  name: 'UserListPop',
  components: {
    UserPop
  },
  props: {
    movieId: Number
  },
  data: function () {
    return {
      dialog: null,
      tab: null,
      items: [
        'Symbol',
        'Liked',
        'Saved'
      ],
      icons: {
        'Symbol': 'mdi-paperclip',
        'Liked': 'mdi-heart',
        'Saved': 'mdi-bookmark-multiple'
      },
      userList: null
    }
  },
  methods: {
    getUserList: function () {
      const token = localStorage.getItem('jwt')
      axios({
        method: 'get',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/personal-movie/`,
        headers: {Authorization: `JWT ${token}`},
        params: {'movieId' : this.movieId}
      })
      .then( res => {
        this.userList = res.data
      })

    }
  }
}
</script>

<style>

</style>