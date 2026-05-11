<template>
  <div
    class="homepage flex flex-col items-center justify-center max-h-screen bg-white text-black"
  >
    <section
      class="hero flex flex-col items-center justify-center text-center mb-6 mt-16"
    >
      <h1 class="title text-5xl mb-4 text-black">Find Events</h1>
      <p class="text-lg text-black">Explore events near you</p>
    </section>
    <div class="w-full max-w-md m-4">
      <input
        type="text"
        v-model="searchQuery"
        placeholder="Search Events"
        class="w-full p-2 mb-4 border border-gray-300 rounded mt-5"
      />
    </div>
  </div>

  <div class="flex flex-col justify-center mt-16">
    <ul class="flex flex-wrap justify-center gap-4">
      <li
        v-for="event in filteredEvents"
        :key="event.event_id"
        class="card bg-white p-4 rounded shadow-md cursor-pointer flex flex-col items-center transform transition-transform duration-300 hover:scale-105 hover:shadow-lg w-72 mb-4"
      >
        <div class="relative w-full">
          <img
            :src="event.image || 'https://via.placeholder.com/150'"
            alt="Event banner"
            class="rounded-lg mb-2 w-full h-40 object-cover"
          />
          <div class="absolute top-2 right-2 flex space-x-2">
            <button
              @click.stop="editEvent(event.event_id)"
              class="bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition duration-200"
            >
              <i class="mdi mdi-pencil text-gray-600"></i>
            </button>
            <button
              @click.stop="deleteEvent(event.event_id)"
              class="bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition duration-200"
            >
              <i class="mdi mdi-delete text-red-600"></i>
            </button>
          </div>
        </div>

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
          <span class="font-bold">Start Date:</span> {{ event.start }}
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

        <router-link
          :to="'/RegistrationAttendee/' + event.event_id"
          class="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded mt-4 inline-block transition duration-300"
        >
          Register Now
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
import Navigation from "@/components/Navigation.vue";
import Footer from "@/components/Footer.vue";
import { getService } from "@/services/Gets.service.js";
import { deletesService } from "@/services/Deletes.service";
import "@mdi/font/css/materialdesignicons.css";

export default {
  data() {
    return {
      searchQuery: "",
      events: [],
      error: "",
      loading: true,
    };
  },
  mounted() {
    this.fetchEvents();
  },
  computed: {
    filteredEvents() {
      return this.events.filter((event) => {
        // Check if event and event.name are valid before accessing
        if (event && event.name) {
          return event.name
            .toLowerCase()
            .includes(this.searchQuery.toLowerCase());
        }
        return false; // Exclude invalid events from the filter
      });
    },
  },
  methods: {
    async searchEvent() {
      try {
        const response = await getService.getEvents(); // Corrected to use getService.getEvents
        this.events = response.data;
      } catch (error) {
        console.error("Error fetching events:", error);
        this.error = "Failed to search events.";
      }
    },

    editEvent(eventId) {
      try {
        this.editEvent(eventId);
      } catch (error) {
        console.error("Error editing event:", error);
        this.error = "Failed to edit event.";
      }
    },
    editEvent(eventId) {
      console.log("Editing event:", eventId);
      this.$router.push({ name: "UpdateEvent", params: { id: eventId } });
    },

    async deleteEvent(eventId) {
      const confirmDelete = confirm(
        "Are you sure you want to delete this event?"
      );
      if (!confirmDelete) return;

      try {
        await deletesService.deleteEvent(eventId);
        alert("Event deleted successfully");
        this.fetchEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        this.error = "Failed to delete event.";
      }
    },

    async fetchEvents() {
      try {
        const fetchedEvents = await getService.getEvents(); // Corrected to use getService.getEvents
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
  components: {
    Navigation,
    Footer,
  },
};
</script>
