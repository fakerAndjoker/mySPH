<template>
  <!-- 曲线图 -->
  <!-- 容器 -->
  <div class="charts" ref="charts"></div>
</template>

<script>
import * as echarts from "echarts";
export default {
  mounted() {
    //初始化echarts实例
    let curveCharts = echarts.init(this.$refs.charts);
    //配置数据
    curveCharts.setOption({
      xAxis: {
        //隐藏x轴
        show: false,
        //折线效果
        type: "category",
      },
      yAxis: {
        show: false,
      },
      //系列
      series: [
        {
          type: "line",
          //折线变曲线
          smooth: true,
          data: [10, 7, 33, 12, 48, 9, 29, 10, 44],
          //拐点样式设置
          itemStyle: {
            opacity: 0,
          },
          //线条样式设置
          lineStyle: {
            color: "purple",
          },
          //   填充颜色设置
          areaStyle: {
            color: {
              type: "linear",
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: "purple", // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: "#fff", // 100% 处的颜色
                },
              ],
              global: false, // 缺省为 false
            },
          },
        },
      ],
      grid: {
        left: 0,
        top: 0,
        bottom: 0,
        right: 0,
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