<template>
  <div class="min-h-screen flex justify-center items-center bg-white">
    <div class="bg-white rounded-xl shadow-lg p-10 w-full max-w-md">
      <h2 class="text-3xl font-semibold mb-6 text-center">Log In</h2>
      <form @submit.prevent="handleSubmit">
        <!-- Email -->
        <div class="mb-6">
          <input
            type="email"
            id="email"
            name="email"
            v-model="email"
            required
            placeholder="Email"
            class="border border-gray-300 py-3 px-4 rounded-lg w-full"
          />
          <div
            v-show="submitted && email && !isValidEmail(email)"
            class="text-red-500 text-sm mt-2"
          >
            Invalid email format
          </div>
        </div>

        <!-- Password -->
        <div class="mb-6">
          <input
            type="password"
            id="password"
            name="password"
            v-model="password"
            required
            placeholder="Password"
            class="border border-gray-300 py-3 px-4 rounded-lg w-full"
          />
          <div v-if="submitted && !password" class="text-red-500 text-sm mt-2">
            Password is required
          </div>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-500 transition"
          :disabled="loading"
        >
          {{ loading ? "Logging in..." : "Log In" }}
        </button>
      </form>

      <!-- Register Redirect -->
      <div class="mt-6 text-center">
        <a href="/signup" class="text-sky-600 text-sm hover:underline">
          Don't have an account? Register
        </a>
      </div>
    </div>
  </div>
</template>

<script>
import { postsService } from "@/services/Posts.service";

export default {
  data() {
    return {
      email: "",
      password: "",
      submitted: false,
      error: null,
      loading: false,
    };
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      this.error = null;

      if (!this.email || !this.password) {
        this.error = "Please fill in both email and password.";
        return;
      }

      if (!this.isValidEmail(this.email)) {
        this.error = "Invalid email format.";
        return;
      }

      this.loading = true;

      postsService
        .login(this.email, this.password)
        .then(() => {
          alert("Login successful");
          this.$router.push("/");
        })
        .catch(() => {
          this.error = "Login failed. Please try again.";
          this.loading = false;
          alert("Login failed");
        });
    },
    isValidEmail(email) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
      return re.test(email);
    },
  },
};
</script>
