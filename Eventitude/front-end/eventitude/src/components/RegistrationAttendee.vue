<template>
  <div class="flex items-center justify-center mt-16">
    <div class="w-full max-w-md">
      <h2 class="text-2xl font-bold mb-4 text-center">Registration</h2>
      <p class="text-gray-600 mb-6 text-center">Register for an event</p>
      <form
        @submit.prevent="attendEvent"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="mb-4">
          <label for="name" class="block text-gray-700 text-sm font-bold mb-2"
            >Name:</label
          >
          <input
            type="text"
            v-model="attendee.name"
            id="name"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label for="email" class="block text-gray-700 text-sm font-bold mb-2"
            >Email:</label
          >
          <input
            type="email"
            v-model="attendee.email"
            id="email"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-6">
          <label for="event" class="block text-gray-700 text-sm font-bold mb-2"
            >Event:</label
          >
          <input
            type="text"
            :value="event ? event.name : 'Loading...'"
            id="event"
            readonly
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Register
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { postsService } from "@/services/Posts.service";
import { getService } from "@/services/Gets.service";

export default {
  data() {
    return {
      attendee: {
        name: "",
        email: "",
        eventId: null,
      },
      event: null,
    };
  },
  methods: {
    async fetchEvent() {
      try {
        const eventId = this.$route.params.id;
        this.event = await getService.getSingleEvent(eventId);
        this.attendee.eventId = eventId;
      } catch (error) {
        console.error("Error fetching event:", error);
      }
    },
    async attendEvent() {
      try {
        await postsService.attendEvent(this.attendee);

        this.attendee = {
          name: "",
          email: "",
          eventId: this.event.id,
        };
        alert("Successfully registered for the event!");
      } catch (error) {
        console.error("Error registering attendee:", error);
        alert("Failed to register for the event. Please try again.");
      }
    },
  },
  created() {
    this.fetchEvent();
  },
};
</script>
