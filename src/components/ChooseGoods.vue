<template>
  <el-dialog
    title="商品选择"
    v-model="dialogvisible"
    destroy-on-close
    width="80%"
  >
    <el-table
      :data="tableData"
      @selection-change="handleSelectionChange"
      ref="multipleTableRef"
      stripe
      style="width: 100%"
      height="60vh"
      v-loading="loading"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="商品">
        <template #default="{ row }">
          <div class="flex items-center">
            <el-image
              :src="row.cover"
              fit="cover"
              :lazy="true"
              style="width: 50px; height: 50px"
              class="mr-3 rounded"
            ></el-image>
            <div class="flex-1">
              <p>{{ row.title }}</p>
              <p class="text-gray-400 text-xs mb-1">
                分类:{{ row.category ? row.category.name : "未分类" }}
              </p>
              <p class="text-gray-400 text-xs">创建时间{{ row.create_time }}</p>
            </div>
          </div>
        </template>
      </el-table-column>

      <el-table-column
        label="总库存"
        width="90"
        prop="stock"
        align="center"
      ></el-table-column>

      <el-table-column label="价格（元）" width="150" align="center">
        <template #default="{ row }">
          <span class="text-rose-500">￥{{ row.min_price }}</span>
          <el-divider direction="vertical"></el-divider>
          <span class="text-gray-500 text-xs">￥{{ row.min_oprice }}</span>
        </template>
      </el-table-column>
    </el-table>
    <div class="flex items-center justify-center mt-5">
      <el-pagination
        background
        :current-page="currentPage"
        :page-size="limit"
        layout="prev, pager, next"
        :total="total"
        @current-change="getData"
      />
    </div>

    <template #footer>
      <span>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>

<script setup>
import { ref } from "vue";
import { GetGoodsList } from "~/api/goods";
import { useInitTable } from "~/utils/useCommon";

const dialogvisible = ref(false);

const close = () => (dialogvisible.value = false);

const callbackFunction = ref(null);
const open = (callback = null) => {
  callbackFunction.value = callback;
  dialogvisible.value = true;
};

const {
  searchForm,
  loading,
  tableData,
  currentPage,
  total,
  limit,
  getData,
  handleSelectionChange,
  multipleTableRef,
  multiSelectionIds,
} = useInitTable({
  searchForm: {
    title: "",
    tab: "all",
    category_id: null,
  },
  getList: GetGoodsList,
  onGetListSuccess: (res) => {
    tableData.value = res.list;
    total.value = res.totalCount;
  },
});

const submit = () => {
  if (typeof callbackFunction.value === "function") {
    callbackFunction.value(multiSelectionIds.value);
  }
  close();
};

defineExpose({
  open,
  close,
});
</script>