<template>
  <div>
    <el-tabs v-model="searchForm.tab" @tab-change="getData">
      <el-tab-pane
        v-for="item in tabbars"
        :key="item.key"
        :label="item.name"
        :name="item.key"
      >
      </el-tab-pane>
    </el-tabs>
    <el-card shadow="never" class="border-0">
      <Search @reset="resetSarchForm" @search="getData">
        <SearchItem label="关键词">
          <el-input
            v-model="searchForm.title"
            placeholder="商品名称"
            clearable
          ></el-input>
        </SearchItem>
        <template #show>
          <SearchItem label="商品分类">
            <el-select
              v-model="searchForm.category_id"
              placeholder="请选择商品分类"
              clearable
            >
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </SearchItem>
        </template>
      </Search>

      <list-header
        layout="create,refresh"
        @create="handleCreate"
        @refresh="getData"
      >
        <el-button
          v-if="searchForm.tab != 'delete'"
          size="small"
          type="danger"
          @click="handleMultiDelete"
          >批量删除</el-button
        >
        <el-button
          v-if="searchForm.tab == 'delete'"
          size="small"
          type="warning"
          @click="handleRestorGoods"
          >恢复商品</el-button
        >

        <el-popconfirm
          title="是否要彻底删除该商品?"
          confirm-button-text="确认"
          cancel-button-text="取消"
          v-if="searchForm.tab == 'delete'"
          @confirm="handleDestroyGoods"
        >
          <template #reference>
            <el-button size="small" type="danger">彻底删除</el-button>
          </template>
        </el-popconfirm>

        <el-button
          v-if="searchForm.tab == 'all' || searchForm.tab == 'off'"
          size="small"
          @click="handleMultiStatusChange(1)"
          >上架</el-button
        >
        <el-button
          v-if="searchForm.tab == 'all' || searchForm.tab == 'saling'"
          size="small"
          @click="handleMultiStatusChange(0)"
          >下架</el-button
        >
      </list-header>
      <el-table
        :data="tableData"
        @selection-change="handleSelectionChange"
        ref="multipleTableRef"
        stripe
        style="width: 100%"
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
                <div>
                  <span class="text-rose-500">￥{{ row.min_price }}</span>
                  <el-divider direction="vertical" />
                  <span class="text-gray-500 text-xs"
                    >￥{{ row.min_oprice }}</span
                  >
                </div>
                <p class="text-gray-400 text-xs mb-1">
                  分类:{{ row.category ? row.category.name : "未分类" }}
                </p>
                <p class="text-gray-400 text-xs">
                  创建时间{{ row.create_time }}
                </p>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实际销量"
          width="100"
          prop="sale_count"
          align="center"
        ></el-table-column>
        <el-table-column label="商品状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status ? 'success' : 'danger'" size="small">{{
              row.status ? "上架" : "仓库"
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column
          label="审核状态"
          v-if="searchForm.tab != 'delete'"
          width="120"
        >
          <template #default="{ row }">
            <div class="flex flex-col" v-if="row.ischeck == 0">
              <el-button type="success" size="small" plain>审核通过</el-button>
              <el-button class="mt-2 !ml-0" type="danger" size="small" plain
                >审核拒绝</el-button
              >
            </div>
            <span v-else>{{ row.ischeck == 1 ? "通过" : "拒绝" }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="总库存"
          width="90"
          prop="stock"
          align="center"
        ></el-table-column>

        <el-table-column align="center" label="操作">
          <template #default="scope">
            <span v-if="searchForm.tab == 'delete'">暂无操作</span>
            <div v-else>
              <el-button
                class="px-1"
                text
                type="primary"
                size="small"
                @click="handleEdit(scope.row)"
                >修改</el-button
              >
              <el-button
                class="px-1"
                text
                :type="
                  (scope.row.sku_type == 0 && !scope.row.sku_value) ||
                  (scope.row.sku_type == 1 && !scope.row.goods_skus.length)
                    ? 'danger'
                    : 'primary'
                "
                size="small"
                @click="handleSetGoodsSkus(scope.row)"
                :loading="scope.row.skusLoading"
                >商品规格</el-button
              >
              <el-button
                class="px-1"
                text
                :type="
                  scope.row.goods_banner.length == 0 ? 'danger' : 'primary'
                "
                size="small"
                @click="handleSetGoodsBanners(scope.row)"
                :loading="scope.row.bannersLoading"
                >设置轮播图</el-button
              >
              <el-button
                class="px-1"
                text
                :type="!scope.row.content ? 'danger' : 'primary'"
                size="small"
                @click="handleSetGoodsContent(scope.row)"
                :loading="scope.row.contentLoading"
                >商品详情</el-button
              >

              <el-popconfirm
                title="是否要删除该商品?"
                confirm-button-text="确认"
                cancel-button-text="取消"
                @confirm="handleDelete([scope.row.id])"
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
          label-width="120px"
          :inline="false"
        >
          <el-form-item label="商品名称" prop="title">
            <el-input
              v-model="form.title"
              placeholder="请输入商品名称，不能超过60个字符"
              style="width: 50%"
            ></el-input>
          </el-form-item>

          <el-form-item label="封面" prop="cover">
            <choose-image v-model="form.cover"></choose-image>
          </el-form-item>
          <el-form-item label="商品分类" prop="category_id">
            <el-select v-model="form.category_id" placeholder="选择商品分类">
              <el-option
                v-for="item in category_list"
                :key="item.id"
                :label="item.name"
                :value="item.id"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="商品描述" prop="desc">
            <el-input
              v-model="form.desc"
              placeholder="选填，商品卖点"
              type="textarea"
            ></el-input>
          </el-form-item>

          <el-form-item label="单位" prop="unit">
            <el-input
              v-model="form.unit"
              placeholder="请输入商品分类"
              style="width: 50%"
            ></el-input>
          </el-form-item>

          <el-form-item label="总库存" prop="stock">
            <el-input
              v-model="form.stock"
              placeholder="请输入总库存"
              style="width: 50%"
            >
              <template #append> 件 </template>
            </el-input>
          </el-form-item>

          <el-form-item label="库存预警" prop="min_stock">
            <el-input
              v-model="form.min_stock"
              placeholder="请输入库存预警"
              style="width: 50%"
            >
              <template #append> 件 </template>
            </el-input>
          </el-form-item>

          <el-form-item label="最低销售价" prop="min_price">
            <el-input
              v-model="form.min_price"
              placeholder="请输入最低销售价"
              style="width: 50%"
            >
              <template #append> 元 </template>
            </el-input>
          </el-form-item>

          <el-form-item label="最低原价" prop="min_oprice">
            <el-input
              v-model="form.min_oprice"
              placeholder="请输入最低原价"
              style="width: 50%"
            >
              <template #append> 元 </template>
            </el-input>
          </el-form-item>

          <el-form-item label="库存显示" prop="stock_display">
            <el-radio-group v-model="form.stock_display">
              <el-radio :label="0">隐藏</el-radio>
              <el-radio :label="1">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否上架" prop="status">
            <el-radio-group v-model="form.status">
              <el-radio :label="0">放入仓库</el-radio>
              <el-radio :label="1">立即上架</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </form-drawer>
    </el-card>

    <banners ref="bannersRef" @reload-date="getData"></banners>
    <content ref="contentRef" @reload-date="getData"></content>
    <skus ref="skusRef" @reload-date="getData"></skus>
  </div>
</template>
<script setup>
import { ref } from "vue";
import {
  GetGoodsList,
  UpdateGoods,
  CreateGoods,
  UpdateGoodsStatus,
  DeleteGoods,
  RestoreGoods,
  DestroyGoods,
} from "~/api/goods";

import { GetCategoryList } from "~/api/category";
import ChooseImage from "~/components/ChooseImage.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "~/components/Search.vue";
import SearchItem from "~/components/SearchItem.vue";
import banners from "./banners.vue";
import content from "./content.vue";
import skus from "./skus.vue";

import { useInitTable, useInitFrom } from "~/utils/useCommon";
import { toast } from "~/utils/common";

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
  handleSelectionChange,
  multipleTableRef,
  handleMultiDelete,
  handleMultiStatusChange,

  multiSelectionIds,
} = useInitTable({
  searchForm: {
    title: "",
    tab: "all",
    category_id: null,
  },
  getList: GetGoodsList,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.bannersLoading = false;
      o.contentLoading = false;
      o.skusLoading = false;
      return o;
    });
    total.value = res.totalCount;
  },
  delete: DeleteGoods,
  updateStatus: UpdateGoodsStatus,
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
    title: null, //商品名称
    category_id: null, //商品分类
    cover: null, //商品封面
    desc: null, //商品描述
    unit: "件", //商品单位
    stock: 100, //总库存
    min_stock: 10, //库存预警
    status: 1, //是否上架 0仓库1上架
    stock_display: 1, //库存显示 0隐藏1显示
    min_price: 0, //最低销售价
    min_oprice: 0, //最低原价
  },
  rules: {
    username: [
      { required: true, message: "管理员名称不能为空！", trigger: "blur" },
    ],
    password: [
      { required: true, message: "管理员密码不能为空！", trigger: "blur" },
    ],
  },
  getData,
  update: UpdateGoods,
  create: CreateGoods,
});

const tabbars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "checking",
    name: "审核中",
  },
  {
    key: "saling",
    name: "出售中",
  },
  {
    key: "off",
    name: "已下架",
  },
  {
    key: "min_stock",
    name: "库存预警",
  },
  {
    key: "delete",
    name: "回收站",
  },
];

// 商品分类
const category_list = ref([]);
GetCategoryList().then((res) => (category_list.value = res));

const showSearch = ref(false);

// 设置轮播图
const bannersRef = ref();
const handleSetGoodsBanners = (row) => bannersRef.value.open(row);

// 设置商品详情
const contentRef = ref();
const handleSetGoodsContent = (row) => contentRef.value.open(row);

// 设置规格
const skusRef = ref();
const handleSetGoodsSkus = (row) => skusRef.value.open(row);

const handleRestorGoods = () => useMultiAction(RestoreGoods, "恢复");

const handleDestroyGoods = () => useMultiAction(DestroyGoods, "彻底删除");

function useMultiAction(func, msg) {
  loading.value = true;
  func(multiSelectionIds.value)
    .then((res) => {
      toast(msg + "成功");
      // 清除选中
      if (multipleTableRef.value) {
        multipleTableRef.value.clearSelection();
      }
      getData();
    })
    .finally(() => {
      loading.value = false;
    });
}
</script>
<style >
</style>