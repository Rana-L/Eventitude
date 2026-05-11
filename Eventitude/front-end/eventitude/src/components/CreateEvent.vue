<template>
  <div class="homepage flex items-center justify-center bg-white mt-16">
    <section class="hero text-center">
      <h1 class="title text-5xl mb-4 text-black">
        Discover and create amazing events!
      </h1>
    </section>
  </div>
  <CreateEventForm />
</template>

<script>
import CreateEventForm from "@/components/createEventForm.vue";
import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";

export default {
  components: {
    CreateEventForm,
    Navigation,
    Footer,
  },
};
</script>
