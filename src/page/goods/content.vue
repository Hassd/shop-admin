<template>
  <form-drawer
    title="设置商品详情"
    :destroy-on-close="true"
    @submit="submit"
    ref="formDrawerRef"
  >
    <el-form :model="form">
      <el-form-item><Editor v-model="form.content"></Editor></el-form-item>
    </el-form>
  </form-drawer>
</template>
  
<script setup>
import { reactive, ref } from "vue";
import { ReadGoods, UpdateGoods } from "~/api/goods";
import FormDrawer from "~/components/FormDrawer.vue";
import Editor from "~/components/Editor.vue";

import { toast } from "~/utils/common";

const formDrawerRef = ref();

const form = reactive({
  content: "",
});

const goodsId = ref(0);
const open = (row) => {
  goodsId.value = row.id;
  row.contentLoading = true;
  ReadGoods(goodsId.value)
    .then((res) => {
      form.content = res.content;

      formDrawerRef.value.open();
    })
    .finally(() => {
      row.contentLoading = false;
    });
};

const emit = defineEmits(["reloadDate"]);
const submit = () => {
  formDrawerRef.value.showLoading();
  UpdateGoods(goodsId.value, form)
    .then((res) => {
      toast("设置轮播图成功！");
      formDrawerRef.value.close();
      emit("reloadDate");
    })
    .finally(() => {
      formDrawerRef.value.hideLoading();
    });
};

defineExpose({
  open,
});
</script>
<style scoped>
</style>