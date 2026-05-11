<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md mt-8">
      <form
        @submit.prevent="updateForm"
        class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
      >
        <div class="mb-4">
          <label
            for="updateEventName"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Update Event Name:</label
          >
          <input
            type="text"
            id="updateEventName"
            v-model="updateEventName"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label
            for="updateEventDescription"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Update Event Description:</label
          >
          <textarea
            id="updateEventDescription"
            v-model="updateEventDescription"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          ></textarea>
        </div>
        <div class="mb-4">
          <label
            for="updateEventLocation"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Update Event Location:</label
          >
          <input
            type="text"
            id="updateEventLocation"
            v-model="updateEventLocation"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label
            for="updateEventStart"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Update Event Start Date:</label
          >
          <input
            type="number"
            id="updateEventStart"
            v-model="updateEventStart"
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label
            for="updateEventCloseRegistration"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Update Close Registration Date:</label
          >
          <input
            type="number"
            id="updateEventCloseRegistration"
            v-model="updateEventCloseRegistration"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div class="mb-4">
          <label
            for="updateMaxAttendees"
            class="block text-gray-700 text-sm font-bold mb-2"
            >Update Max Attendees:</label
          >
          <input
            type="number"
            id="updateMaxAttendees"
            v-model="updateMaxAttendees"
            required
            class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <button
          type="submit"
          class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Update Event
        </button>
      </form>
    </div>
  </div>
</template>

<script>
import { getService } from "@/services/Gets.service.js";
import { patchService } from "@/services/Patch.service.js";

export default {
  name: "UpdateEventForm",
  props: {
    id: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      updateEventName: "",
      updateEventDescription: "",
      updateEventLocation: "",
      updateEventStart: "",
      updateEventCloseRegistration: "",
      updateMaxAttendees: "",
      loading: true,
      error: null,
    };
  },
  mounted() {
    const eventId = this.$route.params.id;
    if (eventId) {
    } else {
      this.error = "No event ID provided";
      this.loading = false;
    }
  },
  methods: {
    async fetchEventDetails() {
      try {
        this.loading = true;
        this.error = null;
        const event = await getService.getEventById(this.$route.params.id);
        this.updateEventName = event?.name ?? "";
        this.updateEventDescription = event?.description ?? "";
        this.updateEventLocation = event?.location ?? "";
        this.updateEventStart = event?.start_date ?? "";
        this.updateEventCloseRegistration = event?.close_registration ?? "";
        this.updateMaxAttendees = event?.max_attendees ?? "";
      } catch (error) {
        console.error("Failed to fetch event details", error);
        this.error = "Failed to load event details. Please try again.";
      } finally {
        this.loading = false;
      }
    },

    async updateForm() {
      this.loading = true;
      this.error = null;
      try {
        const updatedEvent = {
          name: this.updateEventName,
          description: this.updateEventDescription,
          location: this.updateEventLocation,
          start_date: this.updateEventStart,
          close_registration: this.updateEventCloseRegistration,
          max_attendees: this.updateMaxAttendees,
        };
        const eventId = this.$route.params.id;
        await patchService.updateEvent(eventId, updatedEvent);
        this.$router.push("/events");
      } catch (error) {
        console.error("Failed to update event", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
