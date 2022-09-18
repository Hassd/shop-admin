<template>
  <el-card shadow="never" class="border-0">
    <Search @reset="resetSarchForm" @search="getData">
      <SearchItem label="关键词">
        <el-input
          v-model="searchForm.keyword"
          placeholder="手机号/邮箱/用户昵称"
          clearable
        ></el-input>
      </SearchItem>
      <template #show>
        <SearchItem label="会员等级">
          <el-select
            v-model="searchForm.user_level_id"
            placeholder="请选择会员等级"
          >
            <el-option
              v-for="item in user_level"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </SearchItem>
      </template>
    </Search>

    <list-header @create="handleCreate" @refresh="getData"></list-header>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column label="会员">
        <template #default="scope">
          <div class="flex items-center">
            <el-avatar
              :size="40"
              shape="circle"
              :src="scope.row.avatar"
              fit="fill"
            >
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
            <div class="ml-3">
              <h6>{{ scope.row.username }}</h6>
              <small>ID:{{ scope.row.id }}</small>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="会员等级">
        <template #default="scope">
          {{ scope.row.user_level?.name || "-" }}
        </template>
      </el-table-column>
      <el-table-column label="登录注册">
        <template #default="scope">
          <p v-if="scope.row.last_login_time">
            最后登录：{{ scope.row.last_login_time }}
          </p>
          <p>注册时间：{{ scope.row.create_time }}</p>
        </template>
      </el-table-column>
      <el-table-column label="状态" width="100">
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
      <el-table-column align="center" label="操作" width="180">
        <template #default="scope">
          <small v-if="scope.row.super == 1" class="text-sm text-gray-500"
            >暂无操作</small
          >
          <div v-else>
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
          </div>
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
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" placeholder="用户名"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="form.password" placeholder="密码"></el-input>
        </el-form-item>
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="form.nickname" placeholder="昵称"></el-input>
        </el-form-item>
        <el-form-item label="头像" prop="avatar">
          <choose-image v-model="form.avatar"></choose-image>
        </el-form-item>
        <el-form-item label="会员等级" prop="user_level_id">
          <el-select v-model="form.user_level_id" placeholder="选择会员等级">
            <el-option
              v-for="item in user_level"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="手机" prop="phone">
          <el-input v-model="form.phone" placeholder="手机"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" placeholder="邮箱"></el-input>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-switch
            v-model="form.status"
            :active-value="1"
            :inactive-value="0"
          >
          </el-switch>
        </el-form-item>
      </el-form>
    </form-drawer>
  </el-card>
</template>
<script setup>
import { ref } from "vue";
import {
  GetUserList,
  UpdateUserStatus,
  CreateUser,
  UpdateUser,
  DeleteUser,
} from "~/api/user";
import ChooseImage from "~/components/ChooseImage.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";

import { useInitTable, useInitFrom } from "~/utils/useCommon";

import Search from "~/components/Search.vue";
import SearchItem from "~/components/SearchItem.vue";

const user_level = ref([]);

const {
  searchForm,
  resetSarchForm,
  loading,
  tableData,
  currentPage,
  total,
  limit,
  getData,
  handleDelete,
  handleStatusChange,
} = useInitTable({
  searchForm: {
    keyword: "",
    user_level_id: "",
  },
  getList: GetUserList,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.statusLoading = false;
      return o;
    });
    total.value = res.totalCount;
    user_level.value = res.user_level;
  },
  delete: DeleteUser,
  updateStatus: UpdateUserStatus,
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
    username: "",
    password: "",
    nickname: "",
    status: 1,
    avatar: "",
    phone: "",
    email: "",
    user_level_id: null,
  },
  rules: {
    username: [
      { required: true, message: "管理员名称不能为空！", trigger: "blur" },
    ],
  },
  getData,
  update: UpdateUser,
  create: CreateUser,
});
</script>
<style scoped>
</style>