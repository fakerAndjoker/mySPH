<template>
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  mounted() {
    let progressChart = echarts.init(this.$refs.charts);
    progressChart.setOption({
      xAxis: {
        show: false,
        max: 100,
        min: 0,
      },
      yAxis: {
        show: false,
        type: "category",
      },
      series: [
        {
          type: "bar",
          data: [78],
          barWidth:10,
          color: "yellowgreen",
          showBackground: true,
          //设置背景颜色
          backgroundStyle: {
            color: "#eee",
          },
          label:{
              show:true,
              //改变文本内容
              formatter:"|",
              position:"right"
          }
        },
      ],
      grid: {
        left: 0,
        top: 0,
        right: 0,
        bottom: 0,
      },
    });
  },
};
</script>
<style scoped>
.charts{
    height: 100%;
}
</style>