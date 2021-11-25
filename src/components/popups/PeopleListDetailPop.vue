<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialog"
      scrollable
      width="900px"
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          color="primary"
          dark
          v-bind="attrs"
          v-on="on"
          plain
          width="100px"
          class="fs-4"
        >
          MORE
        </v-btn>
      </template>
      <v-card>
        <v-card-title class="d-flex justify-content-center">사람 리스트</v-card-title>
        <v-divider></v-divider>
        <v-card-text style="height: 700px;">
          <div class="container">
            <div >
              <div class="row row-cols-4 g-3 m-0 mx-auto">
                <div v-for="(person, idx) in people" :key="idx" class="p-0">
                  <PeopleCard :person="person" />
                </div>
              </div>
            </div>
          </div>
          <movie-card></movie-card>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-btn
            color="blue darken-1"
            text
            @click="dialog = false"
          >
            Close
          </v-btn>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import PeopleCard from '@/components/people/PeopleCard.vue'
export default {
  name: 'PeopleListDetailPop',
  props: {
    people: Array
  },
  components: {
    PeopleCard
  },
  data: function () {
    return {
      dialog: false
    }
  }
}
</script>

<style>

</style>