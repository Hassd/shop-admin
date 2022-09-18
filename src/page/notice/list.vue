<template>
  <el-card shadow="never" class="border-0">
    <list-header @create="handleCreate" @refresh="getData"></list-header>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="title" label="公告标题" />
      <el-table-column prop="create_time" label="创建时间" />
      <el-table-column align="center" label="操作" width="180">
        <template #default="scope">
          <el-button
            text
            type="primary"
            size="small"
            @click="handleEdit(scope.row)"
            >修改</el-button
          >

          <el-popconfirm
            title="是否要删除该公告?"
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
        <el-form-item label="公告标题" prop="title">
          <el-input v-model="form.title" placeholder="公告标题"></el-input>
        </el-form-item>
        <el-form-item label="公告内容" prop="content">
          <el-input
            v-model="form.content"
            placeholder="公告内容"
            type="textarea"
            :rows="5"
          ></el-input>
        </el-form-item>
      </el-form>
    </form-drawer>
  </el-card>
</template>
<script setup>
import { computed, reactive, ref } from "vue";
import {
  GetNoticeList,
  CreateNotice,
  UpdateNotice,
  DeleteNotice,
} from "~/api/notice";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import { toast } from "~/utils/common";

import { useInitTable, useInitFrom } from "~/utils/useCommon";

let { loading, tableData, currentPage, total, limit, getData, handleDelete } =
  useInitTable({
    searchForm: {
      keyword: "",
    },
    getList: GetNoticeList,
    delete: DeleteNotice,
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
    title: "",
    content: "",
  },
  rules: {
    title: [{ required: true, message: "公告标题不能为空！", trigger: "blur" }],
    content: [
      { required: true, message: "公告内容不能为空！", trigger: "blur" },
    ],
  },
  getData,
  update: UpdateNotice,
  create: CreateNotice,
});
</script>
<style scoped>
</style>