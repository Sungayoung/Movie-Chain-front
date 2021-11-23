<template>
  <v-dialog
    v-if="userProfile"
    v-model="dialog"
    persistent
    max-width="600px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        width="120"
        color="primary"
        dark
        v-bind="attrs"
        v-on="on"
      >
        유저 정보 수정
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
    this.userProfile = this.profile
  },
  data: function () {
    return {
      userProfile: null,
      dialog: false,
      profileImg: null,
      password: null,
      passwordConfirmation: null,
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
      'setProfile',
    ]),
    sendProfile: function () {
      console.log('send')
      let data = new FormData()
      data.append('files', this.profileImg)
      this.setProfile(data)
      .then( () => {
        this.reloadProfile()
      })
    },
    updateUser: function () {
      const token = localStorage.getItem('jwt')
      axios({
        method: "put",
        url: "http://127.0.0.1:8000/accounts/update-user/",
        headers: { Authorization: `JWT ${token}`},
        data: {
          ...this.userProfile,
          password: this.password
        }
      })
      .then(() => {
        this.dialog = false
        this.$emit('reload-profile')
      })
      .catch((err) => {
        this.validAlert = true;
        setTimeout(() => (this.validAlert = false), 2000);

        console.log(err.response);
      });
    }
  },
  computed: {
    imgUrl: function () {
      if (this.profile) {
        return `${process.env.VUE_APP_MCS_URL}${this.profile.profile_img}`
      }
      else {
        return this.nickname
      }
    },
  }
}
</script>

<style>

</style>