<template>
  <div>
    <el-row :gutter="20">
      <!-- 骨架屏实现 -->
      <template v-if="panels.length == 0">
        <el-col :span="6" v-for="i in 4" :key="i">
          <el-skeleton style="width: 100%" animated loading>
            <template #template>
              <el-card shadow="hover" class="border-0">
                <template #header>
                  <div class="flex justify-between">
                    <el-skeleton-item variant="text" style="width: 50%" />
                    <el-skeleton-item variant="text" style="width: 10%" />
                  </div>
                </template>
                <el-skeleton-item variant="h3" style="width: 80%" />
                <el-divider />
                <div class="flex justify-between text-sm text-gray-500">
                  <el-skeleton-item variant="text" style="width: 50%" />
                  <el-skeleton-item variant="text" style="width: 10%" />
                </div>
              </el-card>
            </template>
          </el-skeleton>
        </el-col>
      </template>

      <el-col
        :span="6"
        :offset="0"
        v-for="(item, index) in panels"
        :key="item.title"
      >
        <el-card shadow="hover" class="border-0">
          <template #header>
            <div class="flex justify-between">
              <span class="text-sm">{{ item.title }}</span>
              <el-tag :type="item.unitColor" effect="plain">
                {{ item.unit }}
              </el-tag>
            </div>
          </template>
          <span class="text-3xl font-bold text-gray-500">
            <count-to :value="item.value"></count-to>
          </span>
          <el-divider />
          <div class="flex justify-between text-sm text-gray-500">
            <span>{{ item.subTitle }}</span>
            <span>{{ item.subValue }}</span>
          </div>
        </el-card>
      </el-col>
    </el-row>
    <index-navs></index-navs>
    <el-row :gutter="20" class="mt-5">
      <el-col :span="12" :offset="0">
        <index-chart v-permission="['getStatistics3,GET']"></index-chart>
      </el-col>
      <el-col :span="12" :offset="0">
        <index-card
          title="店铺及商品提示"
          :btns="goods"
          tip="店铺及商品提示"
        ></index-card>
        <index-card
          title="交易提示"
          :btns="order"
          class="mt-3"
          tip="需要立即处理的交易订单"
        ></index-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { Statistics1, Statistics2 } from "~/api/index";
import CountTo from "~/components/CountTo.vue";
import IndexNavs from "~/components/IndexNavs.vue";
import IndexChart from "~/components/IndexChart.vue";
import IndexCard from "~/components/IndexCard.vue";

const panels = ref([]);

Statistics1().then((res) => {
  panels.value = res.panels;
});

const goods = ref([]);
const order = ref([]);
Statistics2().then((res) => {
  goods.value = res.goods;
  order.value = res.order;
});
</script>

<style scoped>
</style>