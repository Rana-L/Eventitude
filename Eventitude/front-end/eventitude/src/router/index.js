import { createRouter, createWebHistory } from "vue-router";

import Homepage from "@/components/Homepage.vue";
import Signup from "@/components/Signup.vue";
import Login from "@/components/Login.vue";
import Events from "@/components/allEvents.vue";
import CreateEvent from "@/components/CreateEvent.vue";
import SinglePost from "@/components/SinglePost.vue";
import Logout from "@/components/Logout.vue";
import UpdateEventForm from "@/components/updateEventForm.vue";
import RegistrationAttendee from "@/components/RegistrationAttendee.vue";
import NotFound from "@/components/NotFound_404.vue";

const routes = [
  { path: "/", name: "Home", component: Homepage },
  { path: "/login", name: "Login", component: Login },
  { path: "/signup", name: "Signup", component: Signup },
  { path: "/events", name: "Events", component: Events },
  { path: "/create", name: "Create Event", component: CreateEvent },
  { path: "/events/:id", component: SinglePost },
  { path: "/logout", component: Logout },
  { path: "/events/:id/edit", name: "UpdateEvent", component: UpdateEventForm },
  {
    path: "/RegistrationAttendee/:id",
    name: "RegisterAttendee",
    component: RegistrationAttendee,
  },
  { path: "/:pathMatch(.*)*", name: "NotFound", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
