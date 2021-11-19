<template>
  <!-- 2 페이지 -->
  <v-window-item :onboarding="2">
    <v-card-text>
      <v-text-field label="Password" type="password"></v-text-field>
      <v-text-field label="Confirm Password" type="password"></v-text-field>
      <span class="text-caption grey--text text--darken-1">
        Please enter a password for your account
      </span>
    </v-card-text>
  </v-window-item>
</template>

<script>
export default {
  name: "Page2",
};
</script>

<style></style>
