<template>
  <el-card class="sale">
    <div class="header">
      <el-tabs v-model="activeName" class="tabs">
        <el-tab-pane label="销售量" name="sale"> </el-tab-pane>
        <el-tab-pane label="访问量" name="visit"></el-tab-pane>
      </el-tabs>
      <div class="right">
        <span @click="setDay">今日</span>
        <span @click="setWeek">本周</span>
        <span @click="setMonth">本月</span>
        <span @click="setYear">本年</span>
        <!-- 日历 -->
        <el-date-picker
          v-model="date"
          type="daterange"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        >
        </el-date-picker>
      </div>
    </div>
    <el-row :gutter="10">
      <el-col :span="18">
        <div class="charts" ref="charts"></div>
      </el-col>
      <el-col :span="6">
        <div class="sale-right">
          <h1>门店{{this.title}}排名</h1>
          <ul>
            <li>
              <span class="top-index">0</span>
              <span>肯德基</span>
              <span class="phone">123456</span>
            </li>
            <li>
              <span class="top-index">0</span>
              <span>肯德基</span>
              <span class="phone">123456</span>
            </li>
            <li>
              <span class="top-index">0</span>
              <span>肯德基</span>
              <span class="phone">123456</span>
            </li>
            <li>
              <span class="index">0</span>
              <span>肯德基</span>
              <span class="phone">123456</span>
            </li>
            <li>
              <span class="index">0</span>
              <span>肯德基</span>
              <span class="phone">123456</span>
            </li>
            <li>
              <span class="index">0</span>
              <span>肯德基</span>
              <span class="phone">123456</span>
            </li>
            <li>
              <span class="index">0</span>
              <span>肯德基</span>
              <span class="phone">123456</span>
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import * as echarts from "echarts";
import * as dayjs from "dayjs";
export default {
  data() {
    return {
      activeName: "sale",
      date: [],
      mycharts: null,
    };
  },
  mounted() {
    //初始化echarts实例
    this.mycharts = echarts.init(this.$refs.charts);
    //配置数据
    this.mycharts.setOption({
      title: {
        text: this.title + "趋势",
      },
      tooltip: {
        trigger: "axis",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: [
        {
          type: "category",
          data: [
            "一月",
            "二月",
            "三月",
            "四月",
            "五月",
            "六月",
            "七月",
            "八月",
            "九月",
            "十月",
            "十一月",
            "十二月",
          ],
          axisTick: {
            alignWithLabel: true,
          },
        },
      ],
      yAxis: [
        {
          type: "value",
        },
      ],
      series: [
        {
          name: "Direct",
          type: "bar",
          barWidth: "60%",
          data: [10, 22, 44, 22, 1, 34, 56, 78, 11, 36, 18, 39],
          color: "yellowgreen",
        },
      ],
    });
  },
  computed: {
    title() {
      return this.activeName == "sale" ? "销售额" : "访问量";
    },
  },
  watch: {
    title() {
      this.mycharts.setOption({
        title: {
          text: this.title + "趋势",
        },
      });
    },
  },
  methods: {
    //本天
    setDay() {
      const day = dayjs().format("YYYY-MM-DD");
      this.date = [day, day];
    },
    //本周
    setWeek() {
      const start = dayjs().day(1).format("YYYY-MM-DD");
      const end = dayjs().day(7).format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本月
    setMonth() {
      const start = dayjs().startOf("month").format("YYYY-MM-DD");
      const end = dayjs().endOf("month").format("YYYY-MM-DD");
      this.date = [start, end];
    },
    //本年
    setYear() {
      const start = dayjs().startOf("year").format("YYYY-MM-DD");
      const end = dayjs().endOf("year").format("YYYY-MM-DD");
      this.date = [start, end];
    },
  },
};
</script>

<style lang="scss"  scoped>
.sale {
  margin-top: 10px;
  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    position: relative;
    .tabs {
      width: 100%;
    }
    .right {
      line-height: 40px;
      position: absolute;
      right: 0;
      span {
        margin-right: 15px;
        cursor: pointer;
      }
    }
  }
  .charts {
    height: 300px;
    width: 100%;
  }
  .sale-right {
    ul {
      list-style: none;
      padding: 0;
      width: 100%;
      height: 300px;
      li {
        height: 8%;
        margin: 10px 0px;
        .top-index {
          width: 20px;
          height: 20px;
          background-color: black;
          color: white;
          border-radius: 50%;
          text-align: center;
          float: left;
          margin-right: 20px;
        }
        .index {
          width: 20px;
          float: left;
          margin-right: 20px;
          padding-left: 5px;
        }
        .phone {
          float: right;
        }
      }
    }
  }
}
</style>