<template>
  <el-card shadow="never" class="border-0">
    <list-header @create="handleCreate" @refresh="getData"></list-header>
    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="desc" label="角色描述" />
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
            @click="openSetRule(scope.row)"
            >配置权限</el-button
          >
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
        <el-form-item label="角色名称" prop="title">
          <el-input v-model="form.name" placeholder="角色名称"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="content">
          <el-input
            v-model="form.desc"
            placeholder="角色描述"
            type="textarea"
            :rows="5"
          ></el-input>
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

    <!-- 权限配置 -->
    <form-drawer
      ref="setRuleformDrawerRef"
      title="权限配置"
      @submit="handleSetRuleSubmit"
    >
      <el-tree-v2
        :data="ruleList"
        :props="{ label: 'name', children: 'child' }"
        show-checkbox
        :height="treeHeight"
        node-key="id"
        ref="elTreeRef"
        :check-strictly="checkStrictly"
        :default-expanded-keys="defaultExpandedKeys"
        @check="handleTreeCheck"
      >
        <template #default="{ node, data }">
          <div class="flex items-center">
            <el-tag :type="data.menu ? '' : 'info'" size="small">
              {{ data.menu ? "菜单" : "权限" }}
            </el-tag>
            <span class="ml-2 text-sm">{{ data.name }}</span>
          </div>
        </template>
      </el-tree-v2>
    </form-drawer>
  </el-card>
</template>
<script setup>
import { computed, reactive, ref } from "vue";
import {
  GetRoleList,
  CreateRole,
  UpdateRole,
  UpdateRoleStatus,
  DeleteRole,
  SetRoleRules,
} from "~/api/role";

import { GetRuleList } from "~/api/rule";

import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
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
} = useInitTable({
  searchForm: {
    keyword: "",
  },
  getList: GetRoleList,
  delete: DeleteRole,
  updateStatus: UpdateRoleStatus,
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
    desc: "",
  },
  rules: {
    name: [{ required: true, message: "名称不能为空！", trigger: "blur" }],
  },
  getData,
  update: UpdateRole,
  create: CreateRole,
});

// 权限配置
const setRuleformDrawerRef = ref();
const elTreeRef = ref();
const ruleList = ref([]);
const treeHeight = ref(0);
const roleId = ref(0);
const defaultExpandedKeys = ref([]);
const ruleIds = ref([]);
const checkStrictly = ref(false);

const handleSetRuleSubmit = () => {
  setRuleformDrawerRef.value.showLoading();
  SetRoleRules(roleId.value, ruleIds.value)
    .then((res) => {
      toast("配置成功");
      setRuleformDrawerRef.value.close();
      getData();
    })
    .finally(() => {
      setRuleformDrawerRef.value.hideLoading();
    });
};

const openSetRule = (row) => {
  roleId.value = row.id;
  treeHeight.value = window.innerHeight - 180;
  checkStrictly.value = true;

  GetRuleList().then((res) => {
    ruleList.value = res.list;
    defaultExpandedKeys.value = res.list.map((o) => o.id);
    setRuleformDrawerRef.value.open();

    // 当前角色拥有的权限角色
    ruleIds.value = row.rules.map((o) => o.id);
    setTimeout(() => {
      elTreeRef.value.setCheckedKeys(ruleIds.value);
      checkStrictly.value = false;
    }, 150);
  });
};

// 获取选择的节点
const handleTreeCheck = (...e) => {
  const { checkedKeys, halfCheckedKeys } = e[1];
  ruleIds.value = [...checkedKeys, halfCheckedKeys];
};
</script>
<style scoped>
</style>