import { reactive, ref } from "vue";
import { showModal, toast } from "~/utils/common";
import { Logout, UpdatePassword } from "~/api/manager";
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export function useRepassword() {
  const router = useRouter();
  let store = useStore();
  // 修改密码
  const formDrawerRef = ref();
  const form = reactive({
    oldpassword: "",
    password: "",
    repassword: "",
  });
  const formRef = ref();
  const rules = reactive({
    oldpassword: [
      { required: true, message: "旧密码不能为空！", trigger: "blur" },
    ],
    password: [
      { required: true, message: "新密码不能为空！", trigger: "blur" },
    ],
    repassword: [
      { required: true, message: "确认密码不能为空！", trigger: "blur" },
    ],
  });
  const onSubmit = async () => {
    if (!formRef.value) return;
    await formRef.value.validate(async (valid, fields) => {
      if (valid) {
        formDrawerRef.value.showLoading();
        UpdatePassword(form)
          .then((res) => {
            if (!res) {
              return;
            }
            store.dispatch("logout");
            //跳转回登录页
            router.push("/login");
            toast("修改密码成功，请重新登录");
          })
          .finally(() => {
            formDrawerRef.value.hideLoading();
          });
      } else {
        console.log("error submit!", fields);
      }
    });
  };

  const openRePasswordForm = () => formDrawerRef.value.open();
  return {
    formDrawerRef,
    form,
    rules,
    formRef,
    onSubmit,
    openRePasswordForm,
  };
}

export function useLogout() {
  // 退出登录
  const router = useRouter();
  let store = useStore();
  function handleLogout() {
    showModal("是否确认退出登录？")
      .then(() => {
        Logout().finally(() => {
          store.dispatch("logout");

          //跳转回登录页
          router.push("/login");

          //提示退出登录成功
          toast("退出登录成功!");
        });
      })
      .catch(() => { });
  }
  return {
    handleLogout
  }
}