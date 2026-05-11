<template>
  <button
    @click="logout"
    class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
    :disabled="isLoggingOut"
  >
    {{ isLoggingOut ? "Logging out..." : "Logout" }}
  </button>
</template>

<script>
import { postsService } from "@/services/Posts.service";

export default {
  data() {
    return {
      isLoggingOut: false,
    };
  },
  methods: {
    logout() {
      this.isLoggingOut = true;

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      postsService
        .logout()
        .then(() => {
          console.log("User logged out");

          this.$router.push("/");
        })
        .catch((error) => {
          console.error("Error logging out", error);
          alert("There was an issue logging out. Please try again.");
        })
        .finally(() => {
          this.isLoggingOut = false;
        })
        .finally(() => {
          this.isLoggingOut = false;
        });
    },
  },
};
</script>
