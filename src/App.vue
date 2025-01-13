<template>
  <div class="font-sans antialiased text-center text-gray-700 mt-14">
    <nav class="p-8 flex justify-center items-center gap-4">
      <router-link 
        v-for="route in navigationRoutes" 
        :key="route.path"
        :to="route.path"
        class="font-bold text-gray-700 no-underline hover:text-emerald-600 transition-colors"
        :class="{ 'text-emerald-500': $route.path === route.path }"
      >
        <span v-if="route.icon" class="mr-1">{{ route.icon }}</span>
        {{ route.name }}
        <span v-if="route !== navigationRoutes[navigationRoutes.length - 1]">|</span>
      </router-link>
    </nav>
    <router-view />
  </div>
</template>

<script setup lang="ts">
import { useNavigation } from './composables/useNavigation'

const { navigationRoutes } = useNavigation()
</script>
