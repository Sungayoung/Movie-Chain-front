<template>
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          fab
          class="mx-3"
          :color="profile.background_color"
          dark
          v-bind="attrs"
          v-on="on"
          inline
        >
        <v-icon :elevation="8">mdi-palette</v-icon>
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="text-h5">
          프로필 색 정하기
        </v-card-title>
        <v-color-picker
          v-model="color"
          dot-size="25"
          swatches-max-height="200"
        ></v-color-picker>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="green darken-1"
            text
            @click="dialog = false"
          >
            CLOSE
          </v-btn>
          <v-btn
            color="green darken-1"
            text
            @click="updateColor"
          >
            SAVE
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
</template>

<script>
import axios from 'axios'
export default {
  name: 'ColorPickerPop',
  props: {
    profile: Object,
  },
  data: function () {
    return {
      dialog: false,
      color: null,
    }
  },
  methods: {
    updateColor: function () {
      const token = localStorage.getItem('jwt')
      console.log(this.color.hex)
      axios({
        method: 'put',
        url: `${process.env.VUE_APP_MCS_URL}/accounts/update-user/`,
        headers: {Authorization: `JWT ${token}`},
        data: {
          color: this.color.hex
        }
      }).then(() => {
        this.profile.background_color = this.color.hex
        this.dialog = false
      })
    }
  }
}
</script>

<style>

</style>