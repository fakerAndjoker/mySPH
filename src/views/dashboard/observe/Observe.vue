<template>
  <div>
    <el-row :gutter="10">
      <el-col :span="12">
          <search></search>
      </el-col>
      <el-col :span="12">
          <category></category>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import Search from '@/views/dashboard/observe/search/Search'
import Category from '@/views/dashboard/observe/category/Category'
export default {
  name: "",
  components: {
    Search,
    Category,
  },
};
</script>

<style scoped>
</style>
