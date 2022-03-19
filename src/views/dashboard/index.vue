<template>
  <div class="container">
    <!-- 头部卡片 -->
    <card></card>
    <!-- 中间的销售部分 -->
    <sale></sale>
    <!-- 底部 -->
    <observe></observe>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Sale from "./sale/Sale.vue";
import Observe from "@/views/dashboard/observe/Observe";
import Card from "@/views/dashboard/card/Card";

export default {
  components: { Sale, Observe, Card },
  Salename: "Dashboard",
  computed: {
    ...mapGetters(["name"]),
  },
};
</script>

<style  scoped>
.container {
  margin-top: -18px;
}
</style>
