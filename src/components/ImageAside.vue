<template>
  <el-aside width="220px" class="image-aside" v-loading="loading">
    <div class="top">
      <aside-list
        v-for="item in list"
        :active="activeId == item.id"
        :key="item.id"
        @edit="handleEdit(item)"
        @delete="handleDelete(item.id)"
        @click="handleChangeActiveId(item.id)"
        >{{ item.name }}</aside-list
      >
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
  <form-drawer :title="drawerTitle" ref="formDrawerRef" @submit="handleSubmit">
    <el-form
      :model="form"
      ref="formRef"
      :rules="rules"
      label-width="80px"
      :inline="false"
    >
      <el-form-item label="分类名称" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>
      <el-form-item label="排序" prop="order">
        <el-input-number v-model="form.order" :min="0" :max="1000" />
      </el-form-item>
    </el-form>
  </form-drawer>
</template>
<script setup>
import AsideList from "./AsideList.vue";
import {
  GetImageClassList,
  CreateImageClass,
  UpdateImageClass,
  DeleteImageClass,
} from "~/api/image_class";
import { computed, reactive, ref } from "vue";
import FormDrawer from "./FormDrawer.vue";
import { toast } from "~/utils/common";

// 加载动画
const loading = ref(false);
const list = ref([]);
const activeId = ref(0);

// 分页
const currentPage = ref(1);
const total = ref(0);
const limit = ref(10);

// 获取数据
function getData(p = null) {
  if (typeof p == "number") {
    currentPage.value = p;
  }

  loading.value = true;
  GetImageClassList(currentPage.value)
    .then((res) => {
      list.value = res.list;
      total.value = res.totalCount;
      let item = list.value[0];
      if (item) {
        handleChangeActiveId(item.id);
      }
    })
    .finally(() => {
      loading.value = false;
    });
}
getData();

let formDrawerRef = ref();

const form = reactive({
  name: "",
  order: 50,
});

const formRef = ref();
const editId = ref(0);
const drawerTitle = computed(() => (editId.value ? "修改" : "新增"));

const rules = reactive({
  name: [{ required: true, message: "图库分类不能为空", trigger: "blur" }],
});

const handleSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      formDrawerRef.value.showLoading();

      const fun = editId.value
        ? UpdateImageClass(editId.value, { ...form })
        : CreateImageClass({ ...form });

      fun.then((res) => {
        formDrawerRef.value.hideLoading();
        toast(drawerTitle.value + "成功");
        getData(editId.value ? currentPage.value : 1);
        formDrawerRef.value.close();
      });
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 新增
const handleCreate = () => {
  editId.value = 0;
  form.name = "";
  form.order = 50;
  formDrawerRef.value.open();
};

// 编辑
const handleEdit = (row) => {
  editId.value = row.id;
  form.name = row.name;
  form.order = row.order;
  formDrawerRef.value.open();
};

// 删除
const handleDelete = (id) => {
  loading.value = true;
  DeleteImageClass(id)
    .then((res) => {
      toast("删除成功");
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
};

const emit = defineEmits(["change"]);
// 切换分类
function handleChangeActiveId(id) {
  activeId.value = id;
  emit("change", activeId.value);
}

defineExpose({
  handleCreate,
});
</script>
<style >
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
</style>