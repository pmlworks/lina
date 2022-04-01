<template>
  <div>
    <div v-for="item in value" :key="item.name" style="display: flex;margin-top: 8px;">
      <el-input v-model="item.port" placeholder="Port">
        <template slot="prepend">{{ item.name_display }}</template>
      </el-input>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Protocols',
  props: {
    value: {
      type: Array,
      default: () => []
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-input {
    width: 100%;
  }
  .el-input >>> .el-input-group__prepend {
    background-color: #fff;
    width: 120px !important;
  }
</style>
