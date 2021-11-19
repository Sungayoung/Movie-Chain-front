<template>
  <!-- 1 페이지 -->
  <v-window-item :onboarding="1">
    <div class="container p-3">
      <div>
        <v-text-field
          :rules="[rules.required]"
          label="ID"
          type="text"
          id="username"
          v-model="credentials.username"
        />
      </div>
      <div>
        <v-text-field
          :rules="[rules.required]"
          label="Nickname"
          type="text"
          id="nickname"
          v-model="credentials.nickname"
        />
      </div>
      <div>
        <v-text-field
          :rules="[rules.required]"
          label="e-mail"
          type="text"
          id="email"
          v-model="credentials.email"
        />
      </div>
      <div>
        <v-text-field
          :rules="[rules.required]"
          label="Password"
          type="password"
          id="password"
          v-model="credentials.password"
        />
      </div>
      <div>
        <v-text-field
          :rules="[rules.required, rules.notConfirmed]"
          label="Password Confirmation"
          type="password"
          id="passwordConfirmation"
          v-model="credentials.passwordConfirmation"
        />
      </div>
    </div>
  </v-window-item>
</template>

<script>
export default {
  name: "Page1",
};
</script>

<style></style>
