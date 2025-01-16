import { ref, watch, onMounted } from 'vue';

export function useTheme() {
  const isDark = ref(false);

  const initializeTheme = () => {
    // First check localStorage
    const storedTheme = localStorage.getItem('theme');
    if (storedTheme) {
      isDark.value = storedTheme === 'dark';
    } else {
      // If no stored theme, check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches;
      // Store the initial theme
      localStorage.setItem('theme', isDark.value ? 'dark' : 'light');
    }
  };

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
    initializeTheme();
    if (isDark.value) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  });

  return {
    isDark,
    toggleTheme
  };
}