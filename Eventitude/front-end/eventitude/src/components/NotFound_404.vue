<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen bg-gray-100"
  >
    <h2 class="text-6xl font-bold text-red-500">404 - Page Not Found</h2>
    <p class="mt-4 text-2xl text-gray-700">
      The page you are looking for doesn't exist.
    </p>
    <router-link to="/" class="mt-6 text-xl text-red-500 hover:underline"
      >Go back to Home</router-link
    >
  </div>
</template>

<script>
export default {
  name: "NotFound_404",
  mounted() {
    setTimeout(() => {
      this.$router.push("/");
    }, 5000);
  },
};
</script>
