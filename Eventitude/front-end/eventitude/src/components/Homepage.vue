<template>
  <div
    class="homepage flex flex-col items-center justify-center text-black mt-16"
  >
    <section class="events-section mt-4 w-full max-w-4xl mx-auto">
      <h1 class="text-2xl font-bold text-center mb-60 text-primary">
        Welcome to Eventitude!
      </h1>
      <h1 class="text-3xl mb-10 mt-[-40px] flex justify-center">
        Upcoming Events
      </h1>

      <span v-if="loading" class="loading-text text-center block text-gray-500"
        >Loading posts...</span
      >

      <ul v-if="events.length" class="events-list flex gap-x-4 overflow-x-auto">
        <li
          v-for="event in events"
          :key="event.event_id"
          class="card bg-white p-4 rounded shadow-md cursor-pointer flex flex-col items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg w-72 mb-4"
        >
          <img
            :src="event.image || 'https://via.placeholder.com/150'"
            alt="Event banner"
            class="rounded-lg mb-2 w-full h-40 object-cover"
          />
          <h2 class="text-xl font-bold mb-2 text-center text-black">
            {{ event.name }}
          </h2>
          <p class="text-black text-sm mb-4 line-clamp-3">
            {{ event.description }}
          </p>
          <p class="text-black text-sm">
            <span class="font-bold">Location:</span> {{ event.location }}
          </p>
          <p class="text-black text-sm">
            <span class="font-bold">Start Date:</span> {{ event.start_date }}
          </p>
          <p class="text-black text-sm">
            <span class="font-bold">Close Date:</span>
            {{ event.close_registration }}
          </p>
          <p class="text-black text-sm">
            <span class="font-bold">Max Attendees:</span>
            {{ event.max_attendees }}
          </p>

          <router-link
            :to="'/events/' + event.event_id"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 inline-block transition duration-300"
          >
            View Details
          </router-link>
        </li>
      </ul>

      <p v-else class="text-center mb-10 mt-[-40px] text-gray-500">
        No events available. Check back later!
      </p>

      <div
        v-if="error"
        class="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
        role="alert"
      >
        <span class="block sm:inline">{{ error }}</span>
      </div>

      <div>
        <p>
          <router-link
            to="/events"
            class="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4 inline-block transition duration-300 float-right"
            >View All Events</router-link
          >
        </p>
      </div>
    </section>
  </div>
</template>

<script>
import { getService } from "@/services/Gets.service.js";
import SinglePost from "@/components/SinglePost.vue";

export default {
  components: {
    SinglePost,
  },

  data() {
    return {
      events: [],
      error: "",
      loading: true,
    };
  },
  mounted() {
    this.fetchThreeEvents();
  },
  methods: {
    async fetchThreeEvents() {
      try {
        const fetchedEvents = await getService.getThreeEvents();
        if (fetchedEvents.length === 0) {
          this.error = "No events found.";
        } else {
          this.events = fetchedEvents;
        }
      } catch (error) {
        console.error("Failed to fetch events", error);
        this.error = "Failed to load events. Please try again later.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
