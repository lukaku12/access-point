<script setup lang="ts">
interface NavLink {
    name: string;
    path: string;
    icon?: string;
}

const isActive = (path: string) => {
    return window.location.pathname.includes(path.toLowerCase());
};

const dashboardNavLinks : NavLink[] = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Cards', path: '/cards' },
    { name: 'Card Reads', path: '/card-reads' },
    { name: 'WiFi', path: '/wifi' },
    { name: 'Config', path: '/config' }
];

</script>

<template>
    <div class="bg-blue-600 text-white rounded-lg shadow-md p-6 mb-6">
        <nav class="flex gap-4 mb-6 justify-center">
            <router-link v-for="link in dashboardNavLinks" :key="link.path" :to="link.path"
                class="px-4 py-2 rounded-md hover:bg-blue-700 transition-colors text-white"
                :class="{ 'bg-blue-700': isActive(link.path) }">
                <span v-if="link.icon" class="mr-1">{{ link.icon }}</span>
                {{ link.name }}
            </router-link>
        </nav>
        <div class="text-center">
            <slot name="header">
            </slot>
        </div>
    </div>
</template>
