<template>
  <div class="single-event p-4 max-w-2xl mx-auto">
    <em v-if="loading" class="text-gray-500">Loading event details...</em>

    <div
      v-else-if="event"
      class="bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <img
        :src="event.image || 'https://via.placeholder.com/800x400'"
        alt="Event banner"
        class="w-full h-64 object-cover"
      />
      <div class="p-6">
        <h1 class="text-3xl font-bold mb-4">{{ event.name }}</h1>
        <p class="text-gray-700 mb-4">{{ event.description }}</p>
        <div class="grid grid-cols-2 gap-4">
          <p><span class="font-bold">Location:</span> {{ event.location }}</p>
          <p>
            <span class="font-bold">Start Date:</span> {{ event.start_date }}
          </p>
          <p>
            <span class="font-bold">Close Registration:</span>
            {{ event.close_registration }}
          </p>
          <p>
            <span class="font-bold">Max Attendees:</span>
            {{ event.max_attendees }}
          </p>
        </div>
      </div>

      <!-- Question submission form -->
      <div class="mt-16 p-6 bg-gray-100 rounded-lg">
        <h2 class="text-2xl font-bold mb-4">Ask a Question</h2>
        <form @submit.prevent="submitQuestion">
          <div class="mb-4">
            <label
              for="question"
              class="block text-gray-700 text-sm font-bold mb-2"
            >
              Your Question
            </label>
            <textarea
              id="question"
              v-model="questionInput"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              rows="3"
              placeholder="Type your question here..."
              :disabled="questionLoading"
            ></textarea>
          </div>

          <button
            type="submit"
            class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            :disabled="questionLoading"
          >
            {{ questionLoading ? "Submitting..." : "Submit Question" }}
          </button>
        </form>
        <p v-if="questionError" class="text-red-500 mt-2">
          {{ questionError }}
        </p>

        <div class="mt-8 p-6 bg-white rounded-lg shadow">
          <h2 class="text-2xl font-bold mb-4">Questions</h2>
          <div v-if="questions.length === 0" class="text-gray-500">
            No questions yet. Be the first to ask!
          </div>
          <ul v-else class="space-y-4">
            <li
              v-for="q in questions"
              :key="q.question_id"
              class="border-b pb-4 relative"
            >
              <p class="text-gray-800 pr-8">{{ q.content }}</p>
              <p class="text-sm text-gray-500 mt-1">
                Asked by: {{ q.asked_by }}
              </p>
              <div class="flex justify-end items-center space-x-4">
                <button
                  @click.prevent="upvoteQuestion(q.question_id)"
                  class="text-green-500 hover:text-green-700"
                >
                  <i class="mdi mdi-thumb-up-outline"></i>
                </button>

                <button
                  @click.prevent="downvoteQuestion(q.question_id)"
                  class="text-red-500 hover:text-red-700"
                >
                  <i class="mdi mdi-thumb-down-outline"></i>
                </button>

                <button
                  @click.prevent="deleteQuestion(q.question_id)"
                  class="bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition duration-200"
                >
                  <i class="mdi mdi-delete text-red-600"></i>
                </button>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <div
      v-if="error"
      class="error-message bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4"
    >
      {{ error }}
    </div>
  </div>
</template>

<script>
import { getService } from "@/services/Gets.service.js";
import { postsService } from "@/services/Posts.service.js";
import { deletesService } from "@/services/Deletes.service.js";

export default {
  data() {
    return {
      event: null,
      error: "",
      loading: true,
      questionInput: "",
      questions: [],
      questionLoading: false,
      questionError: null,
    };
  },
  created() {
    this.fetchSingleEvent();
  },

  methods: {
    async fetchSingleEvent() {
      try {
        const response = await getService.getSingleEvent(this.$route.params.id);
        this.event = response;
      } catch (error) {
        this.error = error.response.data.message;
      } finally {
        this.loading = false;
      }
    },

    async submitQuestion() {
      if (this.questionInput.trim() === "") {
        alert("Please enter a question.");
        return;
      }

      this.questionLoading = true;
      this.questionError = null;

      try {
        const questionData = { content: this.questionInput };
        const response = await postsService.createQuestion(
          this.$route.params.id,
          questionData
        );
        console.log("Question submitted successfully:", response);

        this.questions.push({
          question_id: response.question_idid,
          content: this.questionInput,
          asked_by: "",
        });

        this.questionInput = "";
      } catch (error) {
        this.questionError = "Failed to submit question. Please try again.";
        console.error("Error submitting question:", error);
      } finally {
        this.questionLoading = false;
      }
    },

    async deleteQuestion(questionId) {
      try {
        await deletesService.deleteQuestion(questionId);
        this.questions = this.questions.filter(
          (q) => q.question_id !== questionId
        );
        console.log("Question deleted successfully");
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    },
  },

  async upvoteQuestion(questionId) {
    const question = this.questions.find((q) => q.id === questionId);

    if (question) {
      question.upvotes += 1;
      await postsService.upvoteQuestion(this.$route.params.id, questionId);
    }
  },

  async downvoteQuestion(questionId) {
    const question = this.questions.find((q) => q.id === questionId);

    if (question) {
      question.downvotes += 1;
      await deletesService.downvoteQuestion(this.$route.params.id, questionId);
    }
  },
};
</script>
