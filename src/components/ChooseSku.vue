<template>
  <el-dialog title="规格选择" v-model="dialogVisible" width="80%" top="5vh">
    <el-container style="height: 65vh">
      <el-aside width="220px" class="image-aside">
        <div class="top">
          <div
            class="sku-list"
            :class="{ active: activeId == item.id }"
            v-for="(item, index) in tableData"
            :key="index"
            @click="handleChangeActiveId(item.id)"
          >
            {{ item.name }}
          </div>
        </div>
        <div class="bottom">
          <el-pagination
            background
            :current-page="currentPage"
            :page-size="limit"
            layout="prev, next"
            :total="total"
            @current-change="getData"
          />
        </div>
      </el-aside>
      <el-main height="">
        <el-checkbox-group v-model="form.list">
          <el-checkbox v-for="item in list" :key="item" :label="item" border>
          </el-checkbox>
        </el-checkbox-group>
      </el-main>
    </el-container>

    <template #footer>
      <span>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { reactive, ref } from "vue";
import { GetSkusList } from "~/api/skus";
import { useInitTable } from "~/utils/useCommon";

const dialogVisible = ref(false);
const activeId = ref(0);

const form = reactive({
  name: "",
  list: [],
});

const { loading, currentPage, limit, total, tableData, getData } = useInitTable(
  {
    getList: GetSkusList,
    onGetListSuccess: (res) => {
      tableData.value = res.list;
      total.value = res.totalCount;

      if (tableData.value.length > 0) {
        handleChangeActiveId(tableData.value[0].id);
      }
    },
  }
);

const callbackFunction = ref(null);

const open = (callback = null) => {
  callbackFunction.value = callback;
  getData(1);
  form.name = "";
  form.list = [];
  dialogVisible.value = true;
};

const list = ref([]);
function handleChangeActiveId(id) {
  activeId.value = id;
  list.value = [];

  let item = tableData.value.find((o) => o.id == id);

  if (item) {
    list.value = item.default.split(",");
    form.name = item.name;
  }
}

const submit = () => {
  if (typeof callbackFunction.value === "function") {
    callbackFunction.value(form);
    dialogVisible.value = false;
  }
};

defineExpose({
  open,
});
</script>
<style>
.image-aside {
  border-right: 1px solid #eee;
  position: relative;
}
.image-aside .top {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 50px;
  overflow-y: auto;
}
.image-aside .bottom {
  position: absolute;
  right: 0;
  height: 50px;
  left: 0;
  bottom: 0;
  @apply flex items-center justify-center;
}
.aside-list {
  border-bottom: 1px solid #f4f4f4;
  cursor: pointer;
  @apply flex items-center p-3 text-sm text-gray-600;
}
.aside-list button {
  padding: 0 !important;
}
.aside-list:hover,
.active {
  @apply bg-blue-50;
}
.sku-list {
  border-bottom: 1px solid #f4f4f4;
  @apply p-3 text-sm text-gray-600 felx items-center cursor-pointer;
}
.sku-list:hover {
  @apply bg-blue-50;
}
</style>