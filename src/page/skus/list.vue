<template>
  <el-card shadow="never" class="border-0">
    <list-header
      layout="create,delete,refresh"
      @create="handleCreate"
      @refresh="getData"
      @delete="handleMultiDelete"
    ></list-header>
    <el-table
      @selection-change="handleSelectionChange"
      :data="tableData"
      ref="multipleTableRef"
      stripe
      style="width: 100%"
      v-loading="loading"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="规格名称" />
      <el-table-column prop="default" label="规格值" />
      <el-table-column prop="order" label="排序" />
      <el-table-column label="状态" width="120">
        <template #default="scope">
          <el-switch
            :model-value="scope.row.status"
            :active-value="1"
            :inactive-value="0"
            :loading="scope.row.statusLoading"
            :disabled="scope.row.super == 1"
            @change="handleStatusChange($event, scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="250">
        <template #default="scope">
          <el-button
            text
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >
          <el-popconfirm
            title="是否要删除该规格?"
            confirm-button-text="确认"
            cancel-button-text="取消"
            @confirm="handleDelete(scope.row.id)"
          >
            <template #reference>
              <el-button text type="primary" size="small">删除</el-button>
            </template>
          </el-popconfirm>
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

    <form-drawer
      ref="formDrawerRef"
      destroy-on-close
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
        <el-form-item label="规格名称" prop="name">
          <el-input v-model="form.name" placeholder="规格名称"></el-input>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000">
          </el-input-number>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
        <el-form-item label="规格值" prop="default">
          <tag-input v-model="form.default"></tag-input>
        </el-form-item>
      </el-form>
    </form-drawer>
  </el-card>
</template>
<script setup>
import { computed, reactive, ref } from "vue";
import {
  GetSkusList,
  CreateSkus,
  UpdateSkus,
  UpdateSkusStatus,
  DeleteSkus,
} from "~/api/skus";

import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import TagInput from "~/components/TagInput.vue";
import { toast } from "~/utils/common";

import { useInitTable, useInitFrom } from "~/utils/useCommon";

let {
  loading,
  tableData,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleStatusChange,
  handleSelectionChange,
  multipleTableRef,
  handleMultiDelete,
} = useInitTable({
  searchForm: {
    keyword: "",
  },
  getList: GetSkusList,
  delete: DeleteSkus,
  updateStatus: UpdateSkusStatus,
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
    status: 1,
    default: "",
    order: 50,
  },
  rules: {
    name: [{ required: true, message: "规格名称不能为空！", trigger: "blur" }],
    default: [{ required: true, message: "规格值不能为空！", trigger: "blur" }],
  },
  getData,
  update: UpdateSkus,
  create: CreateSkus,
});
</script>
<style scoped>
</style>