<template>
  <el-form-item label="规格选项" v-loading="bodyLoading">
    <el-card
      shadow="never"
      class="w-full mb-3"
      v-for="(item, index) in sku_card_list"
      :key="item.id"
      v-loading="item.loading"
    >
      <template #header>
        <div class="flex items-center">
          <el-input
            v-model="item.text"
            placeholder="规格名称"
            style="width: 200px"
            @change="handleUpdate(item)"
          >
            <template #append>
              <el-icon class="cursor-pointer" @click="handleCooseSku(item)"
                ><more
              /></el-icon>
            </template>
          </el-input>
          <el-button
            size="small"
            class="ml-auto"
            :disabled="index == 0"
            @click="sortCard('up', index)"
          >
            <el-icon><Top /></el-icon>
          </el-button>
          <el-button
            size="small"
            @click="sortCard('down', index)"
            :disabled="index == sku_card_list.length - 1"
          >
            <el-icon><Bottom /></el-icon>
          </el-button>

          <el-popconfirm
            title="是否要删除该选项?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDelete(item)"
          >
            <template #reference>
              <el-button size="small">
                <el-icon><Delete /></el-icon>
              </el-button>
            </template>
          </el-popconfirm>
        </div>
      </template>
      <SkuCardItem :skuCardId="item.id"></SkuCardItem>
    </el-card>
    <el-button
      type="success"
      size="small"
      :loading="btnLoading"
      @click="addSkuCardEvent"
      >添加规格</el-button
    >
  </el-form-item>
  <ChooseSku ref="chooseSkuRef"></ChooseSku>
</template>
<script setup>
import ChooseSku from "~/components/ChooseSku.vue";
import SkuCardItem from "./SkuCardItem.vue";
import {
  btnLoading,
  sku_card_list,
  addSkuCardEvent,
  handleUpdate,
  handleDelete,
  sortCard,
  bodyLoading,
  handleChooseSetGoodsSkusCard,
} from "~/utils/useSku";
import { ref } from "vue";

const chooseSkuRef = ref();
const handleCooseSku = (item) => {
  chooseSkuRef.value.open((value) => {
    handleChooseSetGoodsSkusCard(item.id, {
      name: value.name,
      value: value.list,
    });
  });
};
</script>
<style>
.el-card__header {
  @apply bg-gray-50 !p-2;
}
</style>