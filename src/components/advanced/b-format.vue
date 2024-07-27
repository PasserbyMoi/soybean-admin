<script setup lang="tsx">
import numeral from 'numeral';

defineOptions({
  name: 'BFormat'
});

type FormatType = 'default' | 'currency' | 'number' | 'gbytes' | 'kbytes' | 'percentages' | 'time' | 'exponential';

interface Props {
  value: number;
  type?: FormatType;
  format?: string | null;
}

const props = withDefaults(defineProps<Props>(), {
  format: null,
  type: 'default'
});

const formatValue = ref<number | string | null>();

if (props.format) {
  formatValue.value = numeral(props.value).format(props.format);
} else if (props.type === 'currency') {
  formatValue.value = numeral(props.value).format('$0,0.00');
} else if (props.type === 'number') {
  formatValue.value = numeral(props.value).format('0,0');
} else if (props.type === 'kbytes') {
  formatValue.value = numeral(props.value).format('0.0b');
} else if (props.type === 'gbytes') {
  formatValue.value = numeral(props.value).format('0.00b');
} else if (props.type === 'percentages') {
  formatValue.value = numeral(props.value).format('0.000%');
} else if (props.type === 'time') {
  formatValue.value = numeral(props.value).format('00:00:00');
} else if (props.type === 'exponential') {
  formatValue.value = numeral(props.value).format('0.00e+0');
} else {
  formatValue.value = numeral(props.value).value();
}
</script>

<template>
  {{ formatValue }}
</template>

<style scoped></style>
