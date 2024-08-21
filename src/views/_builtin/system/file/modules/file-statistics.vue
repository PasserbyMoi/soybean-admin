<script setup lang="ts">
import VCharts from 'vue-echarts';
import { use } from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { GridComponent, LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { useChart } from '@/hooks/common/vchates';
import type { FileStatisticsResp } from '@/apis';
import { getFileStatistics } from '@/apis';
import { formatFileSize } from '@/utils';
import { FileTypeList } from '@/constants/file';

defineOptions({ name: 'FileStatistics' });

use([GridComponent, TitleComponent, TooltipComponent, LegendComponent, PieChart, CanvasRenderer]);
const chartData = ref<Array<{ name: string; value: number; size: string }>>([]);

const totalData = ref<FileStatisticsResp>({
  type: '',
  size: 0,
  number: 0,
  unit: '',
  data: []
});

const { option } = useChart(() => {
  return {
    legend: {
      show: true,
      icon: 'circle',
      orient: 'vertical',
      left: 'left',
      itemWidth: 6,
      itemHeight: 6,
      textStyle: {
        color: '#4E5969'
      }
    },
    tooltip: {
      show: true,
      formatter(params: any) {
        return `总计：${params.value}<br>${params.data.size}`;
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: true,
        label: {
          show: false
        },
        data: chartData.value
      }
    ]
  };
});

const loading = ref(false);
const getStatisticsData = async () => {
  try {
    loading.value = true;
    chartData.value = [];
    const { data: resData } = await getFileStatistics();
    const formatSize = formatFileSize(resData?.size).split(' ');
    totalData.value = {
      type: '',
      size: Number.parseFloat(formatSize[0]),
      number: resData?.number ?? 0,
      unit: formatSize[1],
      data: []
    };
    resData?.data?.forEach((fs: FileStatisticsResp) => {
      const matchedItem = FileTypeList[0].children?.find(item => {
        return `${fs.type}` === item.key;
      });
      chartData.value.unshift({
        name: matchedItem ? (matchedItem.label as string) : '',
        value: fs.number,
        size: formatFileSize(fs.size)
      });
    });
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  getStatisticsData();
});
</script>

<template>
  <NCard title="文件管理" size="small">
    <NGrid cols="24" item-responsive class="items-center">
      <NGridItem span="13">
        <NStatistic>
          <template #label>
            <div class="text-center">存储量</div>
          </template>
          <template #default>
            <div class="text-center font-size-0.9rem text-color-#5856D6">{{ totalData.size }} {{ totalData.unit }}</div>
          </template>
        </NStatistic>
      </NGridItem>
      <NGridItem span="2">
        <NDivider vertical class="min-h-30px" />
      </NGridItem>
      <NGridItem span="7">
        <NStatistic>
          <template #label>
            <div class="text-center">数量</div>
          </template>
          <template #default>
            <div class="text-center font-size-0.9rem text-color-#5856D6">{{ totalData.number }}</div>
          </template>
        </NStatistic>
      </NGridItem>
    </NGrid>
    <NDivider />
    <div v-if="chartData.length > 0" class="h-140px w-240px">
      <VCharts :option="option" class="w-240px" />
    </div>
  </NCard>
</template>

<style scoped></style>
