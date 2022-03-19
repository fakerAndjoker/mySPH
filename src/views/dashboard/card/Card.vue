<template>
  <el-row :gutter="10">
    <el-col :span="6" class="card-item">
      <detail title="总销售额" count="¥ 126506">
        <template v-slot:charts>
          <span
            >周同比&nbsp;56.67%
            <svg
              t="1647530495291"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5038"
              width="16"
              height="16"
            >
              <path
                d="M554.666667 268.8v601.6h-85.333334V268.8L337.066667 401.066667 277.333333 341.333333 512 106.666667 746.666667 341.333333l-59.733334 59.733334L554.666667 268.8z"
                fill="#1afa29"
                p-id="5039"
              ></path>
            </svg>
          </span>
          <span
            >日同比&nbsp;19.96%
            <svg
              t="1647530561678"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5300"
              width="16"
              height="16"
            >
              <path
                d="M554.666667 712.533333V106.666667h-85.333334v601.6l-132.266666-132.266667L277.333333 640l234.666667 234.666667 234.666667-234.666667-59.733334-59.733333-132.266666 132.266666z"
                fill="#d81e06"
                p-id="5301"
              ></path>
            </svg>
          </span>
        </template>
        <template v-slot:footer>
          <span>日销售额¥ 12423</span>
        </template>
      </detail>
    </el-col>
    <el-col :span="6">
      <detail title="访问量" count="88460">
        <template v-slot:charts>
            <curve-chart></curve-chart>
        </template>
        <template v-slot:footer>
          <span>日访问量&nbsp;</span>
        </template>
      </detail>
    </el-col>
    <el-col :span="6">
      <detail title="支付笔数" count="88460">
        <template v-slot:charts>
          <bar-chart></bar-chart>
        </template>
        <template v-slot:footer>
          <span>转换率64%</span>
        </template>
      </detail>
    </el-col>
    <el-col :span="6">
      <detail title="运营活动效果" count="78%">
        <template v-slot:charts>
          <progress-chart></progress-chart>
        </template>
        <template v-slot:footer>
          <span
            >周同比&nbsp;56.67%
            <svg
              t="1647530495291"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5038"
              width="16"
              height="16"
            >
              <path
                d="M554.666667 268.8v601.6h-85.333334V268.8L337.066667 401.066667 277.333333 341.333333 512 106.666667 746.666667 341.333333l-59.733334 59.733334L554.666667 268.8z"
                fill="#1afa29"
                p-id="5039"
              ></path>
            </svg>
          </span>
          <span
            >日同比&nbsp;19.96%
            <svg
              t="1647530561678"
              class="icon"
              viewBox="0 0 1024 1024"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              p-id="5300"
              width="16"
              height="16"
            >
              <path
                d="M554.666667 712.533333V106.666667h-85.333334v601.6l-132.266666-132.266667L277.333333 640l234.666667 234.666667 234.666667-234.666667-59.733334-59.733333-132.266666 132.266666z"
                fill="#d81e06"
                p-id="5301"
              ></path>
            </svg>
          </span>
        </template>
      </detail>
    </el-col>
  </el-row>
</template>

<script>
import Detail from "@/views/dashboard/card/detail/Detail";
import BarChart from "@/views/dashboard/card/barChart/BarChart";
import ProgressChart from "@/views/dashboard/card/progressChart/ProgressChart";
import CurveChart from "@/views/dashboard/card/curveChart/CurveChart";
export default {
  components: {
    Detail,
    BarChart,
    ProgressChart,
    CurveChart
  },
};
</script>

<style>
</style>