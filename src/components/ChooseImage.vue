<template>
  <div v-if="modelValue && preview">
    <el-image
      :src="modelValue"
      v-if="typeof modelValue == 'string'"
      fit="cover"
      class="w-[100px] h-[100px] rounded border mr-2"
    ></el-image>
    <div v-else class="flex flex-wrap">
      <div
        class="relative mx-1 mb-2 w-[100px] h-[100px]"
        v-for="(url, index) in modelValue"
        :key="index"
      >
        <el-icon
          class="
            absolute
            right-[5px]
            top-[5px]
            cursor-pointer
            bg-white
            rounded-full
          "
          style="z-index: 10"
          @click="removeImage(url)"
          ><CircleClose
        /></el-icon>
        <el-image
          :src="url"
          fit="cover"
          class="w-[100px] h-[100px] rounded border mr-2"
        ></el-image>
      </div>
    </div>
  </div>

  <div class="choose-image-btn" @click="open" v-if="preview">
    <el-icon :size="25" class="text-gray-500"><Plus /></el-icon>
  </div>

  <el-dialog title="选择图片" v-model="dialogVisble" width="80%" top="5vh">
    <el-container class="bg-white rounded" style="height: 70vh">
      <el-container>
        <image-aside
          ref="imageAsideRef"
          @change="handleAsideChange"
        ></image-aside>
        <image-main
          :openChoose="true"
          :limit="limit"
          ref="imageMainRef"
          @choose="handleChoose"
        ></image-main>
      </el-container>
    </el-container>

    <template #footer>
      <span>
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="submit">确定</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<script setup>
import { ref } from "vue";
import ImageAside from "~/components/ImageAside.vue";
import ImageMain from "~/components/ImageMain.vue";
import { toast } from "~/utils/common";

const dialogVisble = ref(false);

const callbackFunction = ref(null);

const open = (callback = null) => {
  callbackFunction.value = callback;
  dialogVisble.value = true;
};

const close = () => {
  dialogVisble.value = false;
};

const imageAsideRef = ref();
const imageMainRef = ref();
const handleOpenCreate = () => imageAsideRef.value.handleCreate();

const handleAsideChange = (image_class_id) =>
  imageMainRef.value.loadData(image_class_id);

const handleOpenUpload = () => imageMainRef.value.openUploadFile();

const props = defineProps({
  modelValue: [String, Array],
  limit: {
    type: Number,
    default: 1,
  },
  preview: {
    type: Boolean,
    default: true,
  },
});
const emit = defineEmits(["update:modelValue"]);

let urls = [];
const handleChoose = (e) => {
  urls = e.map((o) => o.url);
};

const submit = () => {
  let value = [];
  if (props.limit == 1) {
    value = urls[0];
  } else {
    value = props.modelValue ? [...props.modelValue, ...urls] : [...urls];
    if (value.length > props.limit) {
      let limit = props.preview
        ? props.limit - props.modelValue.length
        : props.limit;
      return toast(
        "最多还能选择" + (props.limit - props.modelValue.length) + "张"
      );
    }
  }
  if (value && props.preview) {
    emit("update:modelValue", value);
  }

  if (!props.preview && typeof callbackFunction.value === "function") {
    callbackFunction.value(value);
  }

  close();
};

const removeImage = (url) =>
  emit(
    "update:modelValue",
    props.modelValue.filter((u) => u != url)
  );

defineExpose({
  open,
  close,
});
</script>
<style scoped>
.choose-image-btn {
  @apply w-[100px] h-[100px] rounded border flex items-center justify-center cursor-pointer hover:(bg-gray-100);
}
.image-header {
  border-bottom: 1px solid #eee;
  @apply flex items-center;
}
</style>