<template>
  <el-drawer
    :title="drawerTitle"
    v-model="dialogVisible"
    size="70%"
    :destroy-on-close="true"
  >
    <el-form :model="searchForm" size="small">
      <el-form-item label="时间选择">
        <el-radio-group v-model="searchForm.type">
          <el-radio-button label="all">全部</el-radio-button>
          <el-radio-button label="today">今天</el-radio-button>
          <el-radio-button label="yesterday">昨天</el-radio-button>
          <el-radio-button label="last7days">最近7天</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="开始时间">
        <el-date-picker
          v-model="searchForm.starttime"
          type="date"
          placeholder="开始日期"
          value-format="YYYY-MM-DD"
          style="width: 90%"
        />
      </el-form-item>
      <el-form-item label="结束时间">
        <el-date-picker
          v-model="searchForm.endtime"
          type="date"
          placeholder="结束时间"
          value-format="YYYY-MM-DD"
          style="width: 90%"
        />
      </el-form-item>
      <el-form-item label="用户类型">
        <el-radio-group v-model="searchForm.level">
          <el-radio-button :label="0">全部</el-radio-button>
          <el-radio-button :label="1">一级推广</el-radio-button>
          <el-radio-button :label="2">二级推广</el-radio-button>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="getData">搜索</el-button>
        <el-button @click="resetSarchForm">重置</el-button>
      </el-form-item>
    </el-form>

    <el-table :data="tableData" stripe style="width: 100%" v-loading="loading">
      <template v-if="type === 'user'">
        <el-table-column label="ID" prop="id" align="center"></el-table-column>
        <el-table-column label="头像" width="65">
          <template #default="{ row }">
            <el-avatar :size="40" :src="row.avatar">
              <img
                src="https://cube.elemecdn.com/e/fd/0fc7d20532fdaf769a25683617711png.png"
              />
            </el-avatar>
          </template>
        </el-table-column>
        <el-table-column label="用户信息" prop="username"></el-table-column>
        <el-table-column
          align="center"
          label="推广用户数量"
          prop="share_num"
        ></el-table-column>
        <el-table-column
          align="center"
          label="订单数量"
          prop="share_order_num"
        ></el-table-column>
        <el-table-column
          align="center"
          label="绑定时间"
          prop="create_time"
        ></el-table-column>
      </template>
      <template v-else>
        <el-table-column label="订单号">
          <template #default="{ row }">
            {{ row.order.no }}
          </template>
        </el-table-column>

        <el-table-column label="用户名|昵称|手机">
          <template #default="{ row }">
            <div v-if="!row.order.user">该用户已被删除</div>
            <div v-else>
              {{ row.order.user.username }}|{{ row.order.user.nickname }}|{{
                row.order.user.phone
              }}
            </div>
          </template>
        </el-table-column>

        <el-table-column label="时间" prop="create_time"></el-table-column>
        <el-table-column label="返佣金额" prop="commission"></el-table-column>
      </template>
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
  </el-drawer>
</template>
<script setup>
import { computed, ref } from "vue";
import { GetAgentList, GetAgentOrderList } from "~/api/distribution";
import { useInitTable } from "~/utils/useCommon";

import Search from "~/components/Search.vue";
import SearchItem from "~/components/SearchItem.vue";

const props = defineProps({
  type: {
    type: String,
    default: "user",
  },
});

const drawerTitle = computed(() =>
  props.type === "user" ? "推广人列表" : "订单列表"
);

const dialogVisible = ref(false);

const { searchForm, loading, tableData, currentPage, total, limit, getData } =
  useInitTable({
    searchForm: {
      type: "all",
      starttime: "",
      endtime: "",
      level: 0,
      user_id: 0,
    },
    getList: (() => {
      return props.type === "user" ? GetAgentList : GetAgentOrderList;
    })(),
    onGetListSuccess: (res) => {
      tableData.value = res.list;
      total.value = res.totalCount;
    },
  });

const resetSarchForm = () => {
  searchForm.type = "all";
  searchForm.starttime = "";
  searchForm.endtime = "";
  searchForm.level = 0;
};

const dataDrawerRef = ref();
const openDataDrawer = (id) => {
  dataDrawerRef.value.open(id);
};

const open = (id) => {
  dialogVisible.value = true;
  searchForm.user_id = id;
  getData();
};
const close = () => (dialogVisible.value = false);

defineExpose({
  open,
  close,
});
</script>