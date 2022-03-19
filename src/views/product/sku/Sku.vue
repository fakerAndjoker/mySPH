<template>
  <div>
    <el-table :data="records" style="width: 100%" stripe border>
      <el-table-column type="index" label="名称" width="80"> </el-table-column>
      <el-table-column prop="skuName" label="名称"> </el-table-column>
      <el-table-column prop="skuDesc" label="描述"> </el-table-column>
      <el-table-column label="默认图片">
        <template slot-scope="{ row }">
          <img :src="row.skuDefaultImg" alt="" class="img" />
        </template>
      </el-table-column>
      <el-table-column prop="weight" label="重量"> </el-table-column>
      <el-table-column prop="price" label="价格"> </el-table-column>
      <el-table-column prop="prop" label="操作" width="250">
        <template slot-scope="{ row }">
          <el-button
            v-if="row.isSale == 1"
            type="success"
            icon="el-icon-bottom"
            size="mini"
            @click="cancleSale(row)"
          ></el-button>
          <el-button
            v-else
            @click="sale(row)"
            type="success"
            icon="el-icon-top"
            size="mini"
          ></el-button>
          <el-button
            type="primary"
            icon="el-icon-edit"
            size="mini"
            @click="eidt"
          ></el-button>
          <el-button
            type="info"
            icon="el-icon-info"
            size="mini"
            @click="showSkuInfo(row)"
          ></el-button>
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
          ></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[3, 5, 10]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 抽屉效果 -->
    <el-drawer size="50%" :visible.sync="showSku" :show-close="false">
      <el-row>
        <el-col :span="5">名称</el-col>
        <el-col :span="16">{{ skuInfo.skuName }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">描述</el-col>
        <el-col :span="16">{{ skuInfo.skuDesc }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">价格</el-col>
        <el-col :span="16">{{ skuInfo.price }}</el-col>
      </el-row>
      <el-row>
        <el-col :span="5">平台属性</el-col>
        <el-col :span="16">
          <el-tag
            type="success"
            v-for="tag in skuInfo.skuAttrValueList"
            :key="tag.id"
            >{{ tag.attrName }}</el-tag
          >
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="5">商品图片</el-col>
        <el-col :span="16">
          <!-- 轮播图 -->
          <el-carousel height="150px">
            <el-carousel-item v-for="item in skuInfo.skuImageList" :key="item.id">
                <img :src="item.imgUrl" alt="">
            </el-carousel-item>
          </el-carousel>
        </el-col>
      </el-row>
    </el-drawer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 1,
      limit: 10,
      records: [],
      total: 0,
      showSku: false,
      skuInfo: {},
    };
  },
  mounted() {
    this.getSKuList();
  },
  methods: {
    async getSKuList() {
      let res = await this.$API.sku.reqSkuList(this.page, this.limit);
      this.records = res.data.records;
      this.total = res.data.total;
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getSKuList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getSKuList();
    },
    //商品下架
    async cancleSale(row) {
      let res = await this.$API.sku.reqCancleSale(row.id);
      if (res.code == 200) {
        this.$message.success("下架成功");
        row.isSale = 0;
      }
    },
    async sale(row) {
      let res = await this.$API.sku.reqSale(row.id);
      if (res.code == 200) {
        this.$message.success("上架成功");
        row.isSale = 1;
      }
    },
    eidt() {
      this.$message.info("正在开发中！");
    },
    async showSkuInfo(row) {
      let res = await this.$API.sku.reqSkuById(row.id);
      this.skuInfo = res.data;
      console.log(this.skuInfo);
      this.showSku = true;
    },
  },
};
</script>

<style scope >
.img {
  width: 100px;
  height: 100px;
}
.pagination {
  text-align: center;
}
.el-row .el-col-5 {
  font-size: 18px;
  text-align: right;
  margin-right: 10px;
}
.el-row {
  margin:10px;
}
/* 轮播图的按钮 */
.el-carousel__button{
     width:10px;
    height:10px;
    background:red;
    border-radius:50%;
}
.el-tag{
    margin-right: 5px;
}
</style>