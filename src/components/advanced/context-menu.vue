<script setup lang="ts">
import type { DropdownOption } from 'naive-ui';
import type { FollowerPlacement } from 'vueuc';

defineOptions({ name: 'ContextMenu', inheritAttrs: false });

const dropdownRef = ref();
const showDropdown = ref<boolean>(false);
const xRef = ref<number>();
const yRef = ref<number>();

interface Props {
  options: DropdownOption[];
  trigger?: import('naive-ui/es/popover').PopoverTrigger;
  placement?: FollowerPlacement;
  outsideClose?: boolean;
  selectClose?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  trigger: 'manual',
  placement: 'bottom-start',
  outsideClose: true,
  selectClose: true
});

const emit = defineEmits<{
  (e: 'select', key: string | number, option: DropdownOption, data?: any): void;
  (e: 'outside', mouseEvent: MouseEvent, data?: any): void;
}>();

const data = defineModel<any>('data', {
  default: () => undefined
});

function show<T>(position: MouseEvent | { clientX: number; clientY: number } | Touch, pdata?: T) {
  hide();
  if (pdata) {
    data.value = pdata;
  }
  xRef.value = position.clientX;
  yRef.value = position.clientY;
  showDropdown.value = true;
}

function hide() {
  showDropdown.value = false;
}

function handleSelect(key: string | number, option: DropdownOption) {
  emit('select', key, option, data.value);
  if (props.selectClose) {
    hide();
  }
}
function handleClickoutside(e: MouseEvent) {
  emit('outside', e, data.value);
  if (props.outsideClose) {
    hide();
  }
}

defineExpose({
  dropdownRef,
  show,
  hide
});
</script>

<template>
  <NDropdown
    ref="dropdownRef"
    :show="showDropdown"
    :trigger="trigger"
    :placement="placement"
    :options="options"
    :x="xRef"
    :y="yRef"
    v-bind="$attrs"
    @select="handleSelect"
    @clickoutside="handleClickoutside"
  >
    <div></div>
    <!-- <slot name="trigger1"></slot> -->
  </NDropdown>
</template>

<style scoped></style>
