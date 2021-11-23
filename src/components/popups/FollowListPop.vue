<template>
  <v-dialog
    scrollable
    width="600px"
  >
    <template 
      v-slot:activator="{ on, attrs }"
      >
      <v-btn
        color="#89AFA5"
        dark
        v-bind="attrs"
        v-on="on"
        style="width: 100px"
        class="m-2"
        @click="getFollowList"
      >팔로우 리스트
      </v-btn>
    </template>
    <v-card>
      <v-toolbar
        color="grey"
        dark
        flat
      >
        <v-toolbar-title>FOLLOW LIST</v-toolbar-title>

        <v-spacer></v-spacer>
        <template v-slot:extension>
          <v-tabs
            v-model="tab"
            align-with-title
          >
            <v-tabs-slider color="yellow"></v-tabs-slider>

            <v-tab
              v-for="item in items"
              :key="item"
            >
              {{ item }}
            </v-tab>
          </v-tabs>
        </template>
      </v-toolbar>
      <v-tabs-items v-model="tab">
        <v-tab-item
          v-for="(follow, idx) in followList"
          :key="idx"
        >
          <v-card flat style="overflow-y: scroll">
            <v-card-text style="height: 600px;">
            <v-list>
              <follow-pop
              v-for="(person, i) in follow"
              :key="i"
              :person="person"
              :idx="idx"
              @reload-follow="getFollowList()">

              </follow-pop>
            </v-list>
          </v-card-text>
          </v-card>
        </v-tab-item>
      </v-tabs-items>
      </v-card>
  </v-dialog>
</template>

<script>
import FollowPop from './FollowPop.vue'
import axios from 'axios'

export default {
  name: 'FollowListPop',
  data: function () {
    return {
      tab: null,
      items: ['유저 팔로워', '유저 팔로잉', '배우 팔로우', '감독 팔로우'],
      followList: null
    }
  },
  components: {
    FollowPop
  },
  methods: {
    getFollowList: function () {
      const token = localStorage.getItem('jwt')
      axios({
        method: 'get',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/follow/`,
        headers: { Authorization: `JWT ${token}` },
      })
      .then( res => {
        this.followList = res.data
        console.log(res.data)
      })
      .catch( err => {
        console.log(err)
      })
    }
  }
}
</script>

<style scoped>
.box {
    width: 150px;
    height: 150px; 
    border-radius: 70%;
    overflow: hidden;
}
.profile {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>