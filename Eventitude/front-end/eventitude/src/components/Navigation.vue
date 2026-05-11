<template>
  <div class="bg-gray-800 text-white">
    <nav class="flex justify-center space-x-4 p-4">
      <router-link
        to="/"
        class="text-white hover:text-gray-300 transition duration-200"
        active-class="font-bold text-red-500"
        >Home</router-link
      >

      <router-link
        to="/events"
        class="text-white hover:text-gray-300 transition duration-200"
        active-class="font-bold text-red-500"
        >Events</router-link
      >

      <router-link
        to="/create"
        class="text-white hover:text-gray-300 transition duration-200"
        active-class="font-bold text-red-500"
        >Add Event</router-link
      >

      <template v-if="!isAuthenticated">
        <router-link
          to="/login"
          class="text-white hover:text-gray-300 transition duration-200"
          active-class="font-bold text-red-500"
          >Log In</router-link
        >

        <router-link
          to="/signup"
          class="text-white hover:text-gray-300 transition duration-200"
          active-class="font-bold text-red-500"
          >Sign Up</router-link
        >
      </template>

      <a
        v-else
        @click="logout"
        class="text-white hover:text-gray-300 transition duration-200 cursor-pointer"
        >Logout</a
      >
    </nav>
  </div>
</template>

<script>
export default {
  name: "Navigation",
  data() {
    return {
      isAuthenticated: false,
    };
  },
  created() {
    this.checkAuthentication();
  },
  methods: {
    checkAuthentication() {
      const sessionToken = localStorage.getItem("session_token");
      this.isAuthenticated = !!sessionToken;
    },
    logout() {
      // Clear session token and user_id
      localStorage.removeItem("session_token");
      localStorage.removeItem("user_id");
      this.isAuthenticated = false;
      this.$router.push("/login");
    },
  },
  watch: {
    $route() {
      this.checkAuthentication();
    },
  },
};
</script>
