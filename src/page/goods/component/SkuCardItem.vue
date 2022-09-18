<template>
  <div class="flex" v-loading="loading">
    <el-tag
      v-for="(tag, index) in item.goodsSkusCardValue"
      :key="index"
      class="mx-1"
      closable
      :disable-transitions="false"
      effect="plain"
      @close="handleClose(tag)"
    >
      <el-input
        v-model="tag.text"
        placeholder="选项值"
        style="width: 80px"
        class="ml-[-10px]"
        size="small"
        @change="handleChange($event, tag)"
      ></el-input>
    </el-tag>
    <el-input
      v-if="inputVisible"
      ref="InputRef"
      v-model="inputValue"
      class="ml-1"
      style="width: 80px"
      size="small"
      @keyup.enter="handleInputConfirm"
      @blur="handleInputConfirm"
    />
    <el-button
      v-else
      class="button-new-tag ml-1"
      size="small"
      @click="showInput"
    >
      + 添加选项值
    </el-button>
  </div>
</template>
<script setup>
import { initSkuCardItem } from "~/utils/useSku";

const props = defineProps({
  skuCardId: [Number, String],
});

const {
  item,
  inputValue,
  inputVisible,
  InputRef,
  handleClose,
  showInput,
  handleInputConfirm,
  loading,
  handleChange,
} = initSkuCardItem(props.skuCardId);
</script>