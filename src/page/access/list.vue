<template>
  <el-card shadow="never" class="border-0">
    <list-header @create="handleCreate" @refresh="getData"></list-header>
    <el-tree
      :data="tableData"
      :props="{ label: 'name', children: 'child' }"
      node-key="id"
      v-loading="loading"
      :default-expanded-keys="defaultExpandedKeys"
    >
      <template #default="{ node, data }">
        <div class="custom-tree-node">
          <el-tag size="small" :type="data.menu ? '' : 'info'">{{
            data.menu ? "菜单" : "权限"
          }}</el-tag>
          <el-icon v-if="data.icon" :size="16" class="m-2">
            <component :is="data.icon"></component>
          </el-icon>
          <span>{{ data.name }}</span>
          <div class="ml-auto">
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
            <el-button
              type="primary"
              size="small"
              text
              @click.stop="addChild(data.id)"
              >增加</el-button
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
        <el-form-item label="上级菜单" prop="rule_id">
          <el-cascader
            v-model="form.rule_id"
            :options="options"
            :props="{
              label: 'name',
              children: 'child',
              checkStrictly: true,
              emitPath: false,
              value: 'id',
            }"
            clearable
            placeholder="请选择上级菜单"
          />
        </el-form-item>
        <el-form-item label="菜单/规则" prop="menu">
          <el-radio-group v-model="form.menu">
            <el-radio :label="1" border>菜单</el-radio>
            <el-radio :label="0" border>权限</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="名称" prop="name">
          <el-input
            v-model="form.name"
            style="width: 35%"
            placeholder="请输入名称"
          ></el-input>
        </el-form-item>
        <el-form-item label="菜单图标" prop="icon" v-if="form.menu == 1">
          <icon-select v-model="form.icon"></icon-select>
        </el-form-item>
        <el-form-item
          label="前端路由"
          prop="frontpath"
          v-if="form.menu == 1 && form.rule_id > 0"
        >
          <el-input
            v-model="form.frontpath"
            placeholder="请输入前端路由"
          ></el-input>
        </el-form-item>
        <el-form-item label="后端规则" v-if="form.menu == 0" prop="condition">
          <el-input
            v-model="form.condition"
            placeholder="请输入后端规则"
          ></el-input>
        </el-form-item>
        <el-form-item label="请求方式" v-if="form.menu == 0" prop="method">
          <el-select
            v-model="form.method"
            class="m-2"
            placeholder="请选择请求方式"
          >
            <el-option
              v-for="item in ['GET', 'POST', 'PUT', 'DELETE']"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="排序" prop="order">
          <el-input-number v-model="form.order" :min="0" :max="1000" />
        </el-form-item>
      </el-form>
    </form-drawer>
  </el-card>
</template>
<script setup>
import ListHeader from "~/components/ListHeader.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import IconSelect from "~/components/IconSelect.vue";

import {
  GetRuleList,
  CreateRule,
  UpdateRule,
  DeleteRule,
  UpdateRuleStatus,
} from "~/api/rule";

import { useInitTable, useInitFrom } from "~/utils/useCommon";
import { ref } from "vue";

const defaultExpandedKeys = ref([]);
const options = ref([]);

const {
  loading,
  tableData,
  currentPage,
  getData,
  handleDelete,
  handleStatusChange,
} = useInitTable({
  getList: GetRuleList,
  delete: DeleteRule,
  updateStatus: UpdateRuleStatus,
  onGetListSuccess: (res) => {
    tableData.value = res.list;
    defaultExpandedKeys.value = res.list.map((o) => o.id);
    options.value = res.rules;
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
    rule_id: 0,
    menu: 1,
    name: "",
    condition: "",
    method: "GET",
    status: 1,
    order: 50,
    icon: "",
    frontpath: "",
  },
  rules: {
    title: [{ required: true, message: "公告标题不能为空！", trigger: "blur" }],
    content: [
      { required: true, message: "公告内容不能为空！", trigger: "blur" },
    ],
  },
  getData,
  update: UpdateRule,
  create: CreateRule,
});

// 添加子分类
const addChild = (id) => {
  handleCreate();
  form.rule_id = id;
  form.status = 1;
};
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