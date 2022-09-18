<template>
  <el-container class="bg-white rounded" :style="{ height: h + 'px' }">
    <el-header class="image-header">
      <el-button type="primary" size="default" @click="handleOpenCreate"
        >新增图片分类</el-button
      >
      <el-button type="warning" size="default" @click="handleOpenUpload"
        >上传图片</el-button
      >
    </el-header>
    <el-container>
      <image-aside
        ref="imageAsideRef"
        @change="handleAsideChange"
      ></image-aside>
      <image-main ref="imageMainRef"></image-main>
    </el-container>
  </el-container>
</template>
<script setup>
import { ref } from "vue";
import ImageAside from "~/components/ImageAside.vue";
import ImageMain from "~/components/ImageMain.vue";

const windowHeight = window.innerHeight || document.body.clientHeight;
const h = windowHeight - 64 - 44 - 40;

const imageAsideRef = ref();
const imageMainRef = ref();
const handleOpenCreate = () => imageAsideRef.value.handleCreate();

const handleAsideChange = (image_class_id) =>
  imageMainRef.value.loadData(image_class_id);

const handleOpenUpload = () => imageMainRef.value.openUploadFile();
</script>
<style scoped>
.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}
</style>