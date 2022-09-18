<template>
  <el-drawer
    title="设置轮播图"
    v-model="dialogVisible"
    size="50%"
    :destroy-on-close="true"
  >
    <el-form :model="form" label-width="80px">
      <el-form-item label="轮播图">
        <choose-image :limit="9" v-model="form.banners"></choose-image>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="loading"
          >提交</el-button
        >
      </el-form-item>
    </el-form>
  </el-drawer>
</template>
  
<script setup>
import { reactive, ref } from "vue";
import { ReadGoods, SetGoodsBanner } from "~/api/goods";
import ChooseImage from "~/components/ChooseImage.vue";
import { toast } from "~/utils/common";

const dialogVisible = ref(false);

const form = reactive({
  banners: [],
});

const emit = defineEmits(["reloadDate"]);

const goodsId = ref(0);
const open = (row) => {
  goodsId.value = row.id;
  row.bannersLoading = true;
  ReadGoods(goodsId.value)
    .then((res) => {
      form.banners = res.goodsBanner.map((o) => o.url);
    })
    .finally(() => {
      row.bannersLoading = true;
    });
  dialogVisible.value = true;
};

const loading = ref(false);
const submit = () => {
  loading.value = true;
  SetGoodsBanner(goodsId.value, form)
    .then((res) => {
      toast("设置轮播图成功！");
      emit("reloadDate");
      dialogVisible.value = false;
    })
    .finally(() => {
      loading.value = false;
    });
};

defineExpose({
  open,
});
</script>
<style scoped>
</style>