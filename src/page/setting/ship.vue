<template>
  <div v-loading class="bg-white p-4 rounded">
    <el-form :model="form" label-width="160px">
      <el-form-item label="物流查询key">
        <div>
          <el-input v-model="form.ship" placeholder="物流查询key"> </el-input>
        </div>
        <small class="text-gray-500"
          >用于查询物流信息，接口申请(仅供参考)</small
        >
      </el-form-item>
      <el-form-item label="">
        <el-button type="primary" size="small" @click="submit">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, ref } from "vue";
import { GetSysconfig, SetSysconfig } from "~/api/sysconfig";
import { toast } from "~/utils/common";

const form = reactive({
  ship: "",
});

const loading = ref(false);
function getData() {
  loading.value = true;
  GetSysconfig()
    .then((res) => {
      for (const key in form) {
        form[key] = res[key];
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();

const submit = () => {
  loading.value = true;
  SetSysconfig(form)
    .then((res) => {
      toast("修改成功");
    })
    .finally(() => {
      loading.value = false;
    });
};
</script>
<style scoped>
</style>