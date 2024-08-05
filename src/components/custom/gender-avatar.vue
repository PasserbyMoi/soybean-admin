<script setup lang="ts">
import Unknown from '@/assets/imgs/avatar/unknown.png';
import Male from '@/assets/imgs/avatar/male.png';
import Female from '@/assets/imgs/avatar/female.png';

defineOptions({
  name: 'GenderAvatar'
});

interface Props {
  name?: string;
  avatar?: string;
  gender?: number;
  link?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  name: '',
  avatar: undefined,
  gender: 0,
  link: false
});

const emit = defineEmits<{
  (e: 'click'): void;
}>();

const avatarPath = computed(() => {
  if (props.avatar) {
    return props.avatar;
  }
  if (props.gender === 1) {
    return Male;
  }
  if (props.gender === 2) {
    return Female;
  }
  return Unknown;
});
</script>

<template>
  <NA @click="emit('click')">
    <NSpace :wrap="false">
      <NAvatar :src="avatarPath" :size="24" round></NAvatar>
      <span>{{ props.name }}</span>
    </NSpace>
  </NA>
</template>

<style scoped></style>
