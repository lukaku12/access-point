<script setup lang="ts">
interface NavLink {
    name: string;
    path: string;
    icon?: string;
}

const dashboardNavLinks: NavLink[] = [
    { name: 'dashboard', path: '/dashboard' },
    { name: 'cards', path: '/cards' },
    { name: 'card-reads', path: '/card-reads' },
    { name: 'wifi', path: '/wifi' },
    { name: 'config', path: '/config' }
];

defineProps<{
    activeRoute: string;
}>();
</script>

<template>
    <nav class="bg-blue-600 text-white p-4 rounded-lg mb-8">
        <div class="flex gap-4 justify-center mb-4 ">
            <router-link v-for="link in dashboardNavLinks" :key="link.path" :to="link.path" :class="[
                'px-4 py-2 rounded-lg transition-colors',
                activeRoute === link.name
                    ? 'bg-blue-700 text-white'
                    : 'hover:bg-blue-500'
            ]">
                {{ link.name.charAt(0).toUpperCase() + link.name.slice(1) }}
            </router-link>

        </div>
        <div class="mb-4 text-center">
            <slot name="header"></slot>
        </div>
    </nav>
</template>
