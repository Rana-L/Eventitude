<template>
  <v-container class="flex flex-col">
    <main class="mb-4 flex-1"></main>

    <v-footer class="bg-gray-800 text-center p-4 w-full d-flex flex-column">
      <div>
        <v-btn
          v-for="icon in icons"
          :key="icon"
          :icon="icon"
          class="mx-4 text-white hover:text-gray-800"
          size="small"
          variant="plain"
        >
          <v-icon>{{ icon }}</v-icon>
        </v-btn>
      </div>

      <div class="pt-0 text-white">
        Phasellus feugiat arcu sapien et iaculis ipsum elementum sit amet.
      </div>

      <v-divider></v-divider>

      <div class="text-white">
        {{ new Date().getFullYear() }} — <strong>@Eventitude</strong>
      </div>
    </v-footer>
  </v-container>
</template>

<script>
export default {
  data: () => ({
    icons: ["mdi-facebook", "mdi-twitter", "mdi-linkedin", "mdi-instagram"],
  }),
  name: "Footer",
};
</script>
