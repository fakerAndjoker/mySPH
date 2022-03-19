<template>
  <el-card class="detail">
    <div class="header">
      <span class="title">{{ title }}</span>
      <i class="el-icon-info"></i>
    </div>
    <div class="content">
      <span>{{ count }}</span>
    </div>
    <div class="charts">
      <slot name="charts"></slot>
    </div>
    <div class="footer">
      <slot name="footer"></slot>
    </div>
  </el-card>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
    },
    count: {
      type: String,
    },
  },
};
</script>

<style scoped>
.detail {
  padding: 0 5px;
}
.title {
  font-size: 18px;
  color: #d9dbe3;
}
.el-icon-info {
  color: #d9dbe3;
}
.header {
  display: flex;
  justify-content: space-between;
}
.content {
  font-size: 30px;
  padding: 10px 0;
}
.charts {
  margin: 10px 0 20px 0;
  height: 50px;
}
.footer {
  border-top: 1px solid #d9dbe3;
  padding-top: 10px;
}
</style>