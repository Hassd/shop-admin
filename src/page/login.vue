<template>
  <el-row class="login-container">
    <el-col class="left" :lg="16" :md="12">
      <div>
        <div>欢迎光临</div>
        <div>这里是vue3+vite商场后台系统</div>
      </div>
    </el-col>
    <el-col :lg="8" :md="12" class="right">
      <h2>欢迎回来</h2>
      <div>
        <span class="line"></span>
        <span>账号密码登录</span>
        <span class="line"></span>
      </div>
      <el-form :model="form" :rules="rules" ref="formRef" class="w-[250px]">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="请输入用户名">
            <template #prefix>
              <el-icon><User /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input
            v-model="form.password"
            placeholder="请输入密码"
            type="password"
            show-password
          >
            <template #prefix>
              <el-icon><Lock /></el-icon>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-button
            class="w-[250px]"
            round
            color="#626aef"
            type="primary"
            @click="onSubmit(formRef)"
            :loading="loading"
            >登录</el-button
          >
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { toast } from "../utils/common";
import { useStore } from "vuex";

const formRef = ref();
const loading = ref(false);
const router = useRouter();
let store = useStore();

const form = reactive({
  username: "admin",
  password: "admin",
});

const rules = reactive({
  username: [{ required: true, message: "账号不能为空！", trigger: "blur" }],
  password: [{ required: true, message: "密码不能为空！", trigger: "blur" }],
});

const onSubmit = async () => {
  if (!formRef.value) return;
  await formRef.value.validate(async (valid, fields) => {
    if (valid) {
      loading.value = true;

      store
        .dispatch("login", form)
        .then(() => {
          toast("登录成功！");
          router.push("/");
        })
        .finally(() => {
          loading.value = false;
        });
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 监听回车事件
function onKeyUp(e) {
  if (e.key == "Enter") {
    console.log(e);
    onSubmit();
  }
}

onMounted(() => {
  // 添加键盘监听
  document.addEventListener("keyup", onKeyUp);
});
onBeforeUnmount(() => {
  document.removeEventListener("keyup", onKeyUp);
});
</script>

<style scoped>
.login-container {
  @apply bg-indigo-500 min-h-screen;
}

.login-container .left,
.login-container .right {
  @apply flex items-center justify-center;
}
.login-container .right {
  @apply bg-light-50 flex-col;
}
.left > div > div:first-child {
  @apply font-bold text-5xl mb-4 text-light-50;
}
.left > div > div:last-child {
  @apply text-gray-50 text-sm;
}
.right h2 {
  @apply font-bold text-3xl text-gray-800;
}
.right > div {
  @apply flex items-center justify-center my-5 text-gray-300 space-x-2;
}
.right .line {
  @apply h-[1px] w-16 bg-gray-200;
}
</style>