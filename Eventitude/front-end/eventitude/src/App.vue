<template>
  <div id="app">
    <Navigation />
    <RouterView />
    <v-footer>
      <Footer />
    </v-footer>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";
import "@mdi/font/css/materialdesignicons.css";

export default {
  components: {
    Navigation,
    Footer,
  },
};
</script>
