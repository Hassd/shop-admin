<template>
  <el-card shadow="never" class="border-0">
    <list-header @create="handleCreate" @refresh="getData"></list-header>
    <el-tree
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
      node-key="id"
      v-loading="loading"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <span>{{ data.name }}</span>
          <div class="ml-auto">
            <el-button
              type="primary"
              size="small"
              text
              @click="openGoodsDrawer(data)"
              :loading="data.goodsDrawerLoading"
              >推荐商品</el-button
            >
            <el-switch
              :model-value="data.status"
              :active-value="1"
              :inactive-value="0"
              @change="handleStatusChange($event, data)"
            >
            </el-switch>
            <el-button
              type="primary"
              size="small"
              @click.stop="handleEdit(data)"
              text
              >修改</el-button
            >

            <el-popconfirm
              title="是否要删除该公告?"
              confirm-button-text="确认"
              cancel-button-text="取消"
              @confirm="handleDelete(data.id)"
            >
              <template #reference>
                <el-button type="primary" size="small" text>删除</el-button>
              </template>
            </el-popconfirm>
          </div>
        </div>
      </template>
    </el-tree>

    <form-drawer
      ref="formDrawerRef"
      :title="drawerTitle"
      @submit="handleSubmit"
    >
      <el-form
        :model="form"
        ref="formRef"
        :rules="rules"
        label-width="80px"
        :inline="false"
      >
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="form.name" placeholder="分类名称"></el-input>
        </el-form-item>
      </el-form>
    </form-drawer>

    <GoodsDrawer ref="goodsDrawerRef"></GoodsDrawer>
  </el-card>
</template>
<script setup>
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import GoodsDrawer from "./components/GoodsDrawer.vue";

import {
  GetCategoryList,
  CreateCategory,
  UpdateCategory,
  DeleteCategory,
  UpdateCategoryStatus,
} from "~/api/category";

import { useInitTable, useInitFrom } from "~/utils/useCommon";
import { ref } from "vue";

const {
  loading,
  tableData,
  currentPage,
  getData,
  handleDelete,
  handleStatusChange,
} = useInitTable({
  getList: GetCategoryList,
  delete: DeleteCategory,
  updateStatus: UpdateCategoryStatus,
  onGetListSuccess: (res) => {
    tableData.value = res.map((o) => {
      o.goodsDrawerLoading = false;
      return o;
    });
    tableData.value = res;
  },
});

const {
  formDrawerRef,
  formRef,
  form,
  rules,
  editId,
  drawerTitle,
  handleSubmit,
  resetForm,
  handleCreate,
  handleEdit,
} = useInitFrom({
  form: {
    name: "",
  },
  rules: {
    name: [{ required: true, message: "分类名称不能为空！", trigger: "blur" }],
  },
  getData,
  update: UpdateCategory,
  create: CreateCategory,
});

const goodsDrawerRef = ref();
const openGoodsDrawer = (data) => goodsDrawerRef.value.open(data);
</script>
<style>
.custom-tree-node {
  display: flex;
  flex: 1;
  align-items: center;
  font-size: 14px;
  padding-right: 8px;
}
.el-tree-node__content {
  padding: 20px 0;
}
</style>