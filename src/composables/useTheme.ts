import { ref, watch, onMounted } from 'vue';

export function useTheme() {
  const isDark = ref(
    localStorage.getItem('theme') === 'dark' ||
      window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  watch(isDark, (newValue) => {
    localStorage.setItem('theme', newValue ? 'dark' : 'light');
    if (newValue) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  onMounted(() => {
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    }
  });

  return {
    isDark,
    toggleTheme
  };
}
