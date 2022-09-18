<template>
  <form-drawer
    title="设置商品详情"
    :destroy-on-close="true"
    @submit="submit"
    size="70%"
    ref="formDrawerRef"
  >
    <el-form :model="form">
      <el-form-item label="规格类型">
        <el-radio-group v-model="form.sku_type">
          <el-radio :label="0" border>单规格 </el-radio>
          <el-radio :label="1" border>多规格 </el-radio>
        </el-radio-group>
      </el-form-item>
      <template v-if="form.sku_type == 0">
        <el-form-item label="市场价格">
          <el-input
            v-model="form.sku_value.oprice"
            placeholder="请输入市场价格"
            style="width: 35%"
          >
            <template #append>元</template></el-input
          >
        </el-form-item>
        <el-form-item label="销售价格"
          ><el-input
            v-model="form.sku_value.pprice"
            placeholder="请输入市场价格"
            style="width: 35%"
          >
            <template #append>元</template></el-input
          ></el-form-item
        >
        <el-form-item label="成本价格"
          ><el-input
            v-model="form.sku_value.cprice"
            placeholder="请输入市场价格"
            style="width: 35%"
          >
            <template #append>元</template></el-input
          ></el-form-item
        >
        <el-form-item label="商品重量"
          ><el-input
            v-model="form.sku_value.weight"
            placeholder="请输入市场价格"
            style="width: 35%"
          >
            <template #append>公斤</template></el-input
          ></el-form-item
        >
        <el-form-item label="商品体积"
          ><el-input
            v-model="form.sku_value.volume"
            placeholder="请输入市场价格"
            style="width: 35%"
          >
            <template #append>立方米</template></el-input
          ></el-form-item
        >
      </template>
      <template v-else>
        <SkuCard></SkuCard>
        <SkuTable></SkuTable>
      </template>
    </el-form>
  </form-drawer>
</template>
  
<script setup>
import { reactive, ref } from "vue";
import { ReadGoods, UpdateGoods, UpdateGoodsSkus } from "~/api/goods";
import FormDrawer from "~/components/FormDrawer.vue";
import SkuCard from "./component/SkuCard.vue";
import SkuTable from "./component/SkuTable.vue";
import { initSkuCardList, goodsId, sku_list } from "~/utils/useSku";

import { toast } from "~/utils/common";

const formDrawerRef = ref();

const form = reactive({
  sku_type: 1, //规格类型：0单规格1多规格
  sku_value: {
    oprice: 20,
    pprice: 30,
    cprice: 20,
    weight: 10,
    volume: 20,
  }, //单规格属性（sku_type=0时必填）
});

const open = (row) => {
  goodsId.value = row.id;
  row.skusLoading = true;
  ReadGoods(goodsId.value)
    .then((res) => {
      form.sku_type = res.sku_type;
      form.sku_value = res.sku_value || {
        oprice: 20,
        pprice: 30,
        cprice: 20,
        weight: 10,
        volume: 20,
      };
      initSkuCardList(res);

      formDrawerRef.value.open();
    })
    .finally(() => {
      row.skusLoading = false;
    });
};

const emit = defineEmits(["reloadDate"]);
const submit = () => {
  formDrawerRef.value.showLoading();
  let data = {
    sku_type: form.sku_type,
    sku_value: form.sku_value,
  };

  if (form.sku_type == 1) {
    data.goodsSkus = sku_list.value;
  }

  UpdateGoodsSkus(goodsId.value, data)
    .then((res) => {
      toast("设置商品规格成功！");
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