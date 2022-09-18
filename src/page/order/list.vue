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
        <SearchItem label="订单编号">
          <el-input
            v-model="searchForm.no"
            placeholder="订单编号"
            clearable
          ></el-input>
        </SearchItem>
        <template #show>
          <SearchItem label="收货人">
            <el-input
              v-model="searchForm.name"
              placeholder="收货人"
              clearable
            ></el-input>
          </SearchItem>
          <SearchItem label="手机号">
            <el-input
              v-model="searchForm.phone"
              placeholder="手机号"
              clearable
            ></el-input>
          </SearchItem>
          <SearchItem label="开始时间">
            <el-date-picker
              v-model="searchForm.starttime"
              type="date"
              placeholder="开始日期"
              value-format="YYYY-MM-DD"
              style="width: 90%"
            />
          </SearchItem>
          <SearchItem label="结束时间">
            <el-date-picker
              v-model="searchForm.endtime"
              type="date"
              placeholder="结束时间"
              value-format="YYYY-MM-DD"
              style="width: 90%"
            />
          </SearchItem>
        </template>
      </Search>

      <list-header
        layout="refresh,download"
        @refresh="getData"
        @download="handleExportExcel"
      >
        <el-button size="small" type="danger" @click="handleMultiDelete">
          批量删除
        </el-button>
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
            <div class="flex text-sm">
              <div class="flex-1">
                <p>订单号：</p>
                <small>{{ row.no }}</small>
              </div>
              <div>
                <p>下单时间：</p>
                <small>{{ row.create_time }}</small>
              </div>
            </div>
            <div
              class="flex py-2"
              v-for="(item, index) in row.order_items"
              :key="index"
            >
              <el-image
                :src="item.goods_item ? item.goods_item.cover : ''"
                fit="fill"
                :lazy="true"
                style="width: 30px; height: 30px"
              ></el-image>
              <p class="text-blue-500 ml-2">
                {{ item.goods_item ? item.goods_item.title : "商品以被删除" }}
              </p>
            </div>
          </template>
        </el-table-column>
        <el-table-column
          label="实际付款"
          width="120"
          prop="total_price"
          align="center"
        ></el-table-column>
        <el-table-column align="center" label="买家" width="120">
          <template #default="{ row }">
            <p>{{ row.user.nickname || row.user.username }}</p>
            <small>(用户ID:{{ row.user.id }})</small>
          </template>
        </el-table-column>

        <el-table-column
          label="交易状态"
          v-if="searchForm.tab != 'delete'"
          width="180"
        >
          <template #default="{ row }">
            <div>
              付款状态：
              <el-tag
                v-if="row.payment_method == 'wechat'"
                type="success"
                size="small"
                >微信支付</el-tag
              >
              <el-tag
                v-if="row.payment_method == 'alipay'"
                type="info"
                size="small"
                >支付宝支付</el-tag
              >
              <el-tag v-else type="info" size="small">未支付</el-tag>
            </div>
            <div>
              发货状态：
              <el-tag :type="row.ship_data ? 'success' : 'info'" size="small">
                {{ row.ship_data ? "已发货" : "未发货" }}
              </el-tag>
            </div>
            <div>
              收货状态：
              <el-tag
                :type="row.ship_status === 'received' ? 'success' : 'info'"
                size="small"
              >
                {{ row.ship_data ? "已收货" : "未收货" }}
              </el-tag>
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" label="操作">
          <template #default="{ row }">
            <span v-if="searchForm.tab == 'delete'">暂无操作</span>
            <div v-else>
              <el-button
                class="px-1"
                text
                type="primary"
                size="small"
                @click="openInfoModal(row)"
              >
                订单详情
              </el-button>
              <el-button
                class="px-1"
                text
                type="primary"
                size="small"
                v-if="searchForm.tab === 'noship'"
              >
                订单发货
              </el-button>
              <el-button
                class="px-1"
                text
                type="primary"
                size="small"
                v-if="searchForm.tab === 'refunding'"
                @click="handleRefund(row.id, 1)"
              >
                同意退款
              </el-button>
              <el-button
                class="px-1"
                text
                type="primary"
                size="small"
                v-if="searchForm.tab === 'refunding'"
                @click="handleRefund(row.id, 0)"
              >
                拒绝退款
              </el-button>
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
    </el-card>
    <ExportExcel :tabs="tabbars" ref="exportExcelRef"></ExportExcel>
    <InfoModal ref="infoModalRef" :info="info"></InfoModal>
  </div>
</template>
<script setup>
import { ref } from "vue";
import { GetOrderList, DeleteOrder, RefundOrder } from "~/api/order";

import ChooseImage from "~/components/ChooseImage.vue";
import FormDrawer from "~/components/FormDrawer.vue";
import ListHeader from "~/components/ListHeader.vue";
import Search from "~/components/Search.vue";
import SearchItem from "~/components/SearchItem.vue";
import ExportExcel from "./ExportExcel.vue";
import InfoModal from "./InfoModal.vue";

import { useInitTable } from "~/utils/useCommon";
import { showModal, showPrompt, toast } from "~/utils/common";

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

  multiSelectionIds,
} = useInitTable({
  searchForm: {
    no: "",
    tab: "all",
    starttime: "",
    endtime: "",
    name: "",
    phone: "",
  },
  getList: GetOrderList,
  onGetListSuccess: (res) => {
    tableData.value = res.list.map((o) => {
      o.bannersLoading = false;
      o.contentLoading = false;
      o.skusLoading = false;
      return o;
    });
    total.value = res.totalCount;
  },
  delete: DeleteOrder,
});

const tabbars = [
  {
    key: "all",
    name: "全部",
  },
  {
    key: "nopay",
    name: "待支付",
  },
  {
    key: "noship",
    name: "待发货",
  },
  {
    key: "shiped",
    name: "待收货",
  },
  {
    key: "received",
    name: "已收货",
  },
  {
    key: "finish",
    name: "已完成",
  },
  {
    key: "closed",
    name: "已关闭",
  },
  {
    key: "refunding",
    name: "退款中",
  },
];

const exportExcelRef = ref();
const handleExportExcel = () => {
  exportExcelRef.value.open();
};

const infoModalRef = ref();

const info = ref(null);
const openInfoModal = (row) => {
  row.order_items = row.order_items.map((o) => {
    if (o.skus_type == 1 && o.goods_skus) {
      let s = [];
      for (const key in o.goods_skus.skus) {
        s.push(o.goods_skus.skus[key].value);
      }
      o.sku = s.join(",");
    }
    return o;
  });
  info.value = row;
  infoModalRef.value.open();
};

const handleRefund = (id, agree) => {
  (agree
    ? showModal("是否同意该订单退款？")
    : showPrompt("请输入拒绝理由")
  ).then(({ value }) => {
    let data = { agree };
    if (!agree) {
      data.disagree_reason = value;
    }
    RefundOrder(id, data).then((res) => {
      toast("操作成功！");
      getData();
    });
  });
};
</script>
<style >
</style>