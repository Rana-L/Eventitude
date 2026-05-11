<template>
  <div class="min-h-screen flex justify-center items-center bg-white">
    <div class="bg-white rounded-xl shadow-lg p-10 w-full max-w-lg">
      <h2 class="text-3xl font-semibold mb-6 text-center">Create an Account</h2>
      <form @submit.prevent="handleSubmit">
        <!-- First and Last Name -->
        <div class="flex flex-col sm:flex-row sm:gap-4 mb-6">
          <input
            type="text"
            name="first_name"
            v-model="first_name"
            required
            placeholder="First Name"
            class="border border-gray-300 py-3 px-4 rounded-lg w-full mb-4 sm:mb-0"
          />
          <input
            type="text"
            name="last_name"
            v-model="last_name"
            required
            placeholder="Last Name"
            class="border border-gray-300 py-3 px-4 rounded-lg w-full mb-4 sm:mb-0"
          />
        </div>

        <!-- Email -->
        <div class="mb-6">
          <input
            type="email"
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
            name="password"
            v-model="password"
            required
            placeholder="Password"
            class="border border-gray-300 py-3 px-4 rounded-lg w-full"
          />
        </div>

        <!-- Terms and Conditions -->
        <div class="mb-6 flex items-center">
          <input
            type="checkbox"
            name="terms"
            v-model="terms"
            required
            class="mr-2"
          />
          <label class="text-sm">
            I agree to the
            <a href="#" class="text-sky-600 underline">terms and conditions</a>
          </label>
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-sky-600 text-white py-3 rounded-lg hover:bg-sky-500 transition"
        >
          Continue
        </button>
      </form>

      <!-- Login Redirect -->
      <div class="mt-6 text-center">
        <a href="/login" class="text-sky-600 text-sm hover:underline">
          Already have an account? Login
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
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      terms: false,
      submitted: false,
    };
  },
  methods: {
    handleSubmit() {
      this.submitted = true;
      if (
        this.first_name &&
        this.last_name &&
        this.email &&
        this.password &&
        this.terms &&
        this.isValidEmail(this.email)
      ) {
        postsService
          .signup({
            first_name: this.first_name,
            last_name: this.last_name,
            email: this.email,
            password: this.password,
          })
          .then((response) => {
            alert("Signed in successfully!");
            this.$router.push("/login");
          })
          .catch((error) => {
            this.error = error;
            this.loading = false;
            alert("Error signing up");
          });
      }
    },
    isValidEmail(email) {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
      return re.test(email);
    },
  },
};
</script>
