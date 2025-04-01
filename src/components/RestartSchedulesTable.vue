<script setup lang="ts">
import { computed } from 'vue';
import type { RestartSchedule } from '@/types/restartSchedules';
import GenericTable from '@/components/GenericTable.vue';

const props = defineProps<{
  schedules: RestartSchedule[];
  loading: boolean;
  onEdit?: (schedule: RestartSchedule) => void;
  onDelete?: (schedule: RestartSchedule) => void;
}>();

// Format schedule type for display
const formatScheduleType = (value: string): string => {
  return value.charAt(0).toUpperCase() + value.slice(1);
};

// Format time from 24-hour to 12-hour format with AM/PM
const formatTime = (time: string): string => {
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return `${formattedHour}:${minutes} ${ampm}`;
};

// Format days of week
const formatDaysOfWeek = (days: number[]): string => {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(day => dayNames[day - 1]).join(', ');
};

// Format days of month
const formatDaysOfMonth = (days: number[]): string => {
  return days.map(day => {
    if (day === 1 || day === 21 || day === 31) return `${day}st`;
    if (day === 2 || day === 22) return `${day}nd`;
    if (day === 3 || day === 23) return `${day}rd`;
    return `${day}th`;
  }).join(', ');
};

// Format date for display
const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString();
};

// Format created_at timestamp for display - handle Unix timestamp in seconds
const formatCreatedAt = (timestamp: number): string => {
  // Convert UNIX timestamp (seconds since epoch) to milliseconds
  const date = new Date(timestamp * 1000);
  
  // Format the date in a user-friendly way
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
};

// Add a special formatting function for each row
const processScheduleRow = (row: any) => {
  // Add a virtual 'description' field to each row for the table to display
  const newRow = { ...row }; // Create a copy to avoid mutating the original
  newRow.description = getScheduleDescription(row);
  return newRow;
};

// Get the description of the schedule
const getScheduleDescription = (schedule: RestartSchedule): string => {
  switch (schedule.schedule_type) {
    case 'daily':
      return `Device will restart every day at ${formatTime(schedule.time)}`;
    case 'weekly': {
      const weeklySchedule = schedule as any;
      return `Device will restart every ${formatDaysOfWeek(weeklySchedule.days_of_week)} at ${formatTime(schedule.time)}`;
    }
    case 'monthly': {
      const monthlySchedule = schedule as any;
      return `Device will restart monthly on the ${formatDaysOfMonth(monthlySchedule.days_of_month)} at ${formatTime(schedule.time)}`;
    }
    case 'once': {
      const onceSchedule = schedule as any;
      return `Device will restart once on ${formatDate(onceSchedule.restart_date)} at ${formatTime(schedule.time)}`;
    }
    default:
      return 'Unknown schedule type';
  }
};

// Convert to a computed property to make it reactive to changes in props.schedules
const processedSchedules = computed(() => {
  console.log('Processing schedules:', props.schedules.length);
  return props.schedules.map(processScheduleRow);
});

const columns = [
  {
    key: 'id',
    label: 'ID'
  },
  {
    key: 'schedule_type',
    label: 'Type',
    format: formatScheduleType
  },
  {
    key: 'description',  // Now using a real key that exists in the processed data
    label: 'Description'
  },
  {
    key: 'created_at',
    label: 'Created',
    format: formatCreatedAt
  }
];

const mobileDisplayKeys = ['id', 'description'];

// Handle edit action with a fallback for undefined handler
const handleEdit = (schedule: RestartSchedule): void => {
  if (props.onEdit) {
    props.onEdit(schedule);
  } else {
    console.warn('Edit handler not provided');
  }
};

// Handle delete action with a fallback for undefined handler
const handleDelete = (schedule: RestartSchedule): void => {
  if (props.onDelete) {
    props.onDelete(schedule);
  } else {
    console.warn('Delete handler not provided');
  }
};

const actions = [
  {
    label: 'Edit',
    icon: 'i-heroicons-pencil-square',
    onClick: handleEdit,
    color: 'blue-600',
    hoverColor: 'blue-800'
  },
  {
    label: 'Delete',
    icon: 'i-heroicons-trash',
    onClick: handleDelete,
    color: 'red-600',
    hoverColor: 'red-800'
  }
];
</script>

<template>
  <GenericTable
    :columns="columns"
    :data="processedSchedules"
    :actions="actions"
    :mobile-display-keys="mobileDisplayKeys"
    :loading="loading"
  />
</template>
