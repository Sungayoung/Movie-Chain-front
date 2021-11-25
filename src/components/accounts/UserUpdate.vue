<template>
  <v-dialog
    v-if="userProfile"
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        width="100"
        color="#999999"
        dark
        v-bind="attrs"
        v-on="on"
        class="m-2"
        @click="getProfile"
      >
        개인정보 수정
      </v-btn>
    </template>
    <v-card 
      max-height="700px"
      style="background-color:white">
      
      <v-card-title>
        <span class="text-h5">유저 정보 수정</span>
      </v-card-title>
      <v-card-text style="background-color:white">
        <v-container>
          <v-row justify="center">
            <v-file-input
            @change="sendProfile"
            hide-input
            v-model="profileImg"
            accept="image/png, image/jpeg, image/bmp"
            placeholder="Pick an avatar"
            prepend-icon="mdi-camera"
            label="프로필 이미지 수정"
            ></v-file-input>
            <v-avatar
              class="m-3"
              size="128"
            ><img :src="imgUrl">
            </v-avatar>
          </v-row>
          <v-row>
            <p>username : {{ userProfile.username }}</p>
            <v-text-field
              :rules="rules.nicknameRule"
              label="닉네임 수정*"
              required
              v-model="userProfile.nickname"
            ></v-text-field>
            
            <v-text-field
              :rules="rules.emailRule"
              label="이메일 수정*"
              required
              v-model="userProfile.email"
            ></v-text-field>
            
            <v-textarea
              :rules="rules.introduceRule"
              filled
              autoGrow
              label="소개글 수정"
              v-model="userProfile.introduce_content"
            ></v-textarea>
            
            <v-text-field
              v-model="password"
              :rules="rules.passwordConfirmationRule"
              label="비밀번호 수정"
              type="password"
            ></v-text-field>
            <v-text-field
              v-model="passwordConfirmation"
              :rules="rules.passwordConfirmationRule"
              label="비밀번호 확인"
              type="password"
            ></v-text-field>
          </v-row>
        </v-container>
        <small>*indicates required field</small>
      </v-card-text>
      <v-card-actions style="background-color:white">
        <v-spacer></v-spacer>
        <v-btn
          color="blue darken-1"
          text
          @click="dialog = false"
        >
          Close
        </v-btn>
        <v-btn
          color="blue darken-1"
          text
          @click="updateUser"
        >
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
  name: 'UserUpdate',
  props: {
    profile: Object
  },
  mounted: function () {
    this.userProfile = {...this.profile}
    this.imgUrl = `${process.env.VUE_APP_MCS_URL}${this.profile.profile_img}?_=${new Date().getTime()}`
  },
  data: function () {
    return {
      validAlert = false,
      userProfile: null,
      dialog: false,
      introduce_content: null,
      profileImg: null,
      password: null,
      passwordConfirmation: null,
      imgUrl: null,
      rules: {
        nicknameRule: [
          (v) => !!v || " 닉네임을 입력해주세요.",
          (v) =>
            !(v && v.length >= 30) || "닉네임은 30자 이상 입력할 수 없습니다.",
          (v) =>
            !/[~!@#$%^&*()_+|<>?:{}]/.test(v) ||
            "닉네임에는 특수문자를 사용할 수 없습니다.",
        ],
        emailRule: [
          (v) => !!v || " 이메일을 입력해주세요.",
          (v) =>
            /^([0-9a-zA-Z_.-]+)@([0-9a-zA-Z_-]+).(.[0-9a-zA-Z_-]+){1,2}$/.test(
              v
            ) || "이메일 형식에 맞지 않습니다.",
        ],
        introduceRule: [(v) => !(v && v.length >= 100) || "소개글은 100자 이상 입력할 수 없습니다."],
        passwordConfirmationRule: [
          (v) =>
            !(v && v.length >= 30) ||
            "패스워드는 30자 이상 입력할 수 없습니다.",
          (v) =>
            v === this.password || "패스워드가 일치하지 않습니다.",
        ],
      },
    }
  },
  methods : {
    ...mapActions([
      'setProfileImg',
      'getProfile',
    ]),
    getProfile: function () {
      this.userProfile = { ...this.profile }
    },
    sendProfile: function () {
      if(this.profileImg.size >= 1000000) {
          this.validAlert = true
         setTimeout(() => (this.validAlert = false), 2000);
      }
      else {
        let data = new FormData()
        data.append('files', this.profileImg)
        this.setProfileImg(data)
        .then( (res) => {
          this.$emit('reload-profile', 'profile_img')
          this.imgUrl = `${process.env.VUE_APP_MCS_URL}${res.profile_img}?_=${new Date().getTime()}`
        })
      }
    },
    updateUser: function () {
      const token = localStorage.getItem('jwt')
      const data = {
        ...this.userProfile
      }
      if (this.password) {
        data['password'] = this.password
      }
      axios({
        method: "put",
        url: `${process.env.VUE_APP_MCS_URL}/accounts/update-user/`,
        headers: { Authorization: `JWT ${token}`},
        data: data
      })
      .then(( res ) => {
        this.dialog = false
        this.getProfile(res.data.nickname)
        this.$emit('reload-profile', res.data.nickname)
      })
      .catch(() => {
        this.validAlert = true;
        setTimeout(() => (this.validAlert = false), 2000);

      });
    },
  },
}
</script>

<style>
*::-webkit-scrollbar {
  width: 8px;
}
*::-webkit-scrollbar-thumb {
  height: 12%;
  background-color: rgba(255, 255, 255, 0.5) !important;
  border-radius: 25px;
}
*::-webkit-scrollbar-track {
  height: 80%;
  position: scroll;
  left: 0;
  background-color: rgba(0, 0, 0, 0);
}
.alert-box {
  position: fixed;
  top: 0;
  width: 45%;
  z-index: 10;
}
.alert {
  position: absolute;
  top: 0;
}
</style>