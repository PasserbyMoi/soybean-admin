<script setup lang="ts">
import ProfileBasicInfo from './modules/profile-basic-info.vue';
import ProfileSocial from './modules/profile-social.vue';
import ProfileSecurity from './modules/profile-security.vue';

defineOptions({ name: 'SettingProfile' });
</script>

<template>
  <NGrid :cols="24" item-responsive responsive="screen" :x-gap="16" :y-gap="16">
    <NGridItem span="24 m:12 l:8">
      <ProfileBasicInfo />
    </NGridItem>
    <NGridItem span="24 m:12 l:16">
      <NFlex vertical :size="[16, 16]">
        <ProfileSecurity />
        <ProfileSocial />
      </NFlex>
    </NGridItem>
  </NGrid>
</template>

<style scoped></style>
