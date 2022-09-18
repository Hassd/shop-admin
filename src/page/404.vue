<template>
  <el-col class="box-center" :sm="12" :lg="6">
    <el-result icon="error" title="404提示" sub-title="你的页面走丢了~">
      <template #extra>
        <el-button type="primary" @click="$router.push('/')"
          >回到首页</el-button
        >
      </template>
    </el-result>
  </el-col>
</template>

<script setup>
</script>

<style scoped>
.box-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>