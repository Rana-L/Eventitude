<template>
  <div class="flex items-center justify-center mt-16">
    <div class="w-full max-w-md">
      <form
        @submit.prevent="createEvent"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="mb-4">
          <label
            for="eventName"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Event Name:</label
          >
          <input
            type="text"
            id="eventName"
            v-model="eventName"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label
            for="eventDescription"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Event Description:</label
          >
          <textarea
            id="eventDescription"
            v-model="eventDescription"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div class="mb-4">
          <label
            for="eventLocation"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Event Location:</label
          >
          <input
            type="text"
            id="eventLocation"
            v-model="eventLocation"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label
            for="eventStart"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Event Start Date:</label
          >
          <input
            type="number"
            id="eventStart"
            v-model="eventStart"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label
            for="eventCloseRegistration"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Close Registration Date:</label
          >
          <input
            type="number"
            id="eventCloseRegistration"
            v-model="eventCloseRegistration"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label
            for="maxAttendees"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Max Attendees:</label
          >
          <input
            type="number"
            id="maxAttendees"
            v-model="maxAttendees"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Create Event
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { postsService } from "@/services/Posts.service";

export default {
  data() {
    return {
      eventName: "",
      eventDescription: "",
      eventLocation: "",
      eventStart: "",
      eventCloseRegistration: "",
      maxAttendees: null,
    };
  },
  methods: {
    async createEvent() {
      try {
        const eventData = {
          name: this.eventName,
          description: this.eventDescription,
          location: this.eventLocation,
          start_date: this.eventStart,
          close_registration: this.eventCloseRegistration,
          max_attendees: this.maxAttendees,
        };

        const response = await postsService.createEvent(eventData);
        console.log("Event created successfully:", response);

        this.eventName = "";
        this.eventDescription = "";
        this.eventLocation = "";
        this.eventStart = "";
        this.eventCloseRegistration = "";
        this.maxAttendees = null;
      } catch (error) {
        console.error("Failed to create event:", error);
        this.error = "Failed to create event. Please try again.";
      }
    },
  },
};
</script>
