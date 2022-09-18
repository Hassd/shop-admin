import { computed, reactive, ref } from "vue";
import { toast } from "~/utils/common";

// 分页、列表、搜索、删除、修改、状态
export function useInitTable(opt = {}) {

  let searchForm = null;
  let resetSarchForm = null;

  // const searchForm = reactive({
  //   keyword: "",
  //   limit: 10,
  // });

  // const resetSarchForm = () => {
  //   searchForm.keyword = "";
  //   getData();
  // };

  if (opt.searchForm) {
    searchForm = reactive({ ...opt.searchForm })

    resetSarchForm = () => {
      for (const key in opt.searchForm) {
        searchForm[key] = opt.searchForm[key]
      }
      getData();
    }
  }




  // 加载动画
  const loading = ref(false);
  const tableData = ref([]);

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
    opt.getList(currentPage.value, searchForm)
      .then((res) => {

        if (opt.onGetListSuccess && typeof opt.onGetListSuccess == "function") {
          opt.onGetListSuccess(res)
        } else {
          tableData.value = res.list;
          total.value = res.totalCount;
        }

      })
      .finally(() => {
        loading.value = false;
      });
  }
  getData();

  // 删除
  const handleDelete = (id) => {
    loading.value = true;

    opt.delete(id)
      .then((res) => {
        toast("删除成功");
        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // 修改状态
  const handleStatusChange = (status, row) => {
    row.statusLoading = true;
    opt.updateStatus(row.id, status)
      .then((res) => {
        toast("修改状态成功");
        row.status = status;
      })
      .finally(() => {
        row.statusLoading = false;
      });
  };



  //多选选中id
  const multiSelectionIds = ref([]);
  const handleSelectionChange = (e) => {
    multiSelectionIds.value = e.map((o) => o.id);
  };

  // 批量删除
  const multipleTableRef = ref();
  const handleMultiDelete = () => {
    loading.value = true;
    opt.delete(multiSelectionIds.value)
      .then((res) => {
        toast("删除成功！");

        // 清除选中
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }

        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  };

  // 批量修改状态
  const handleMultiStatusChange = (status) => {
    loading.value = true;
    opt.updateStatus(multiSelectionIds.value, status)
      .then((res) => {
        toast("修改状态成功！");

        // 清除选中
        if (multipleTableRef.value) {
          multipleTableRef.value.clearSelection();
        }

        getData();
      })
      .finally(() => {
        loading.value = false;
      });
  };

  return {
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
    multiSelectionIds
  }
}

// 新增、修改
export function useInitFrom(opt = {}) {
  // 表单部分
  const formDrawerRef = ref();
  const formRef = ref();

  const defaultForm = opt.form;

  const form = reactive({});

  const rules = opt.rules || {};

  let editId = ref(0);
  let drawerTitle = computed(() => (editId.value ? "修改" : "新增"));

  const handleSubmit = () => {
    formRef.value.validate((valid) => {
      if (!valid) return;

      formDrawerRef.value.showLoading();

      let body = {}
      if (opt.beforeSubmit && typeof opt.beforeSubmit == "function") {
        body = opt.beforeSubmit({ ...form })
      } else {
        body = form;
      }

      const fun = editId.value
        ? opt.update(editId.value, body)
        : opt.create(body);

      fun
        .then((res) => {
          toast(drawerTitle.value + "成功");
          opt.getData(editId.value ? false : 1);
          formDrawerRef.value.close();
        })
        .finally(() => {
          formDrawerRef.value.hideLoading();
        });
    });
  };

  // 重置表单
  function resetForm(row = false) {
    if (formRef.value) formRef.value.clearValidate()
    for (const key in defaultForm) {
      form[key] = row[key]
    }
  }

  // 新增
  const handleCreate = () => {
    editId.value = 0;

    resetForm(defaultForm)

    formDrawerRef.value.open();
  };

  // 修改
  const handleEdit = (row) => {
    editId.value = row.id;
    resetForm(row)
    formDrawerRef.value.open();
  };
  return {
    formDrawerRef,
    formRef,
    form,
    rules,
    editId,
    drawerTitle,
    handleSubmit,
    resetForm,
    handleCreate,
    handleEdit
  }
}