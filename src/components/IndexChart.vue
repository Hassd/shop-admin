<template>
  <el-card shadow="never">
    <template #header>
      <div class="flex justify-between">
        <span class="text-sm">订单统计</span>
        <div>
          <el-check-tag
            v-for="item in options"
            :key="item.value"
            :checked="current == item.value"
            style="margin-right: 8px"
            @click="handleChoose(item.value)"
            >{{ item.text }}</el-check-tag
          >
        </div>
      </div>
    </template>
    <div id="chart" ref="el" style="width: 100%; height: 300px"></div>
  </el-card>
</template>
<script setup>
import { onMounted, ref, onBeforeUnmount } from "vue";
import * as echarts from "echarts";
import { useResizeObserver } from "@vueuse/core";

import { Statistics3 } from "~/api/index";

const current = ref("week");

const options = [
  {
    text: "近1个月",
    value: "month",
  },
  {
    text: "近1周",
    value: "week",
  },
  {
    text: "近24小时",
    value: "hour",
  },
];

const handleChoose = (type) => {
  current.value = type;
  getData();
};
let myChart = null;
onMounted(() => {
  let chartDom = document.getElementById("chart");
  if (!chartDom) return;
  myChart = echarts.init(chartDom);
  getData();
});

// 组件销毁前销毁echarts实例
onBeforeUnmount(() => {
  if (myChart) echarts.dispose(myChart);
});

function getData() {
  let option = {
    xAxis: {
      type: "category",
      data: [],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [],
        type: "bar",
        showBackground: true,
        backgroundStyle: {
          color: "rgba(180, 180, 180, 0.2)",
        },
      },
    ],
  };

  myChart.showLoading();
  Statistics3(current.value).then((res) => {
    myChart.hideLoading();
    option.xAxis.data = res.x;
    option.series[0].data = res.y;

    option && myChart.setOption(option);
  });
}

const el = ref();
useResizeObserver(el, () => myChart.resize());
</script>
<style scoped>
</style>