<template>
  <div>
    <el-card class="top">
      <category-select @getCategoryId="getCategoryId"></category-select>
    </el-card>
    <el-card>
      <!-- spu列表的展示 -->
      <div v-show="scene == 0">
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="add-spu-btn"
          :disabled="!category3Id"
          @click="addSpu"
          >添加SPU</el-button
        >
        <!-- 展示table -->
        <el-table border stripe style="width: 100%" :data="records">
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="spuName" label="SPU名称"> </el-table-column>
          <el-table-column prop="description" label="SPU描述">
          </el-table-column>
          <el-table-column prop="prop" label="操作">
            <template slot-scope="scope">
              <el-tooltip
                class="item"
                effect="dark"
                content="添加sku"
                placement="bottom-start"
              >
                <el-button
                  type="success"
                  icon="el-icon-plus"
                  @click="addSku(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="修改spu"
                placement="bottom-start"
              >
                <el-button
                  type="warning"
                  icon="el-icon-edit"
                  @click="updateSpu(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="查看当前spu全部sku列表"
                placement="bottom-start"
              >
                <el-button
                  type="info"
                  icon="el-icon-info"
                  @click="showSkuList(scope.row)"
                ></el-button>
              </el-tooltip>
              <el-tooltip
                class="item"
                effect="dark"
                content="删除spu"
                placement="bottom-start"
              >
                <el-popconfirm
                  :title="`确定删除${scope.row.spuName}吗？`"
                  @onConfirm="deleteSpu(scope.row)"
                >
                  <el-button
                    type="danger"
                    icon="el-icon-delete"
                    slot="reference"
                    class="delete-btn"
                  ></el-button>
                </el-popconfirm>
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页 -->
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          class="pagination"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="3"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
      <spu-form
        v-show="scene == 1"
        @changeSence="changeSence"
        ref="spu"
      ></spu-form>
      <sku-form
        v-show="scene == 2"
        ref="sku"
        @changeSence="changeSence"
      ></sku-form>
    </el-card>
    <!-- 展示skuList的dialog -->
    <el-dialog :title="`${spu.spuName}列表`" :visible.sync="dialogTableVisible" :before-close="close">
      <el-table :data="skuList" border stripe   v-loading="loading">
        <el-table-column property="skuName" label="名称"></el-table-column>
        <el-table-column property="price" label="价格"></el-table-column>
        <el-table-column property="skuName" label="weight"></el-table-column>
        <el-table-column label="默认图片">
          <template slot-scope="{ row }">
            <img :src="row.skuDefaultImg" alt="" class="img" />
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import CategorySelect from "@/components/categorySelect/CategorySelect";
import SkuForm from "@/views/product/spu/childComponent/skuForm/SkuForm";
import SpuForm from "@/views/product/spu/childComponent/spuForm/SpuForm";
import { done } from 'nprogress';
export default {
  components: {
    CategorySelect,
    SkuForm,
    SpuForm,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      page: 1,
      limit: 5,
      //spuList
      records: [],
      total: 0,
      scene: 0, //控制面板的显示与隐藏 0:展示spu列表数据, 1:spu修改与添加  2:添加SKU
      skuList: [],
      dialogTableVisible: false,
      spu: {},
      loading:true
    };
  },
  methods: {
    getCategoryId({ category1Id, category2Id, category3Id }) {
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      this.getSpuList();
    },
    async getSpuList() {
      let res = await this.$API.spu.reqSpuList(
        this.page,
        this.limit,
        this.category3Id
      );
      this.records = res.data.records;
      this.total = res.data.total;
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getSpuList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getSpuList();
    },
    addSpu() {
      this.scene = 1;
      this.$refs.spu.addInitSpuData(this.category3Id);
    },
    updateSpu(row) {
      this.$refs.spu.initSpuData(row);
      this.scene = 1;
    },
    //返回
    changeSence({ scene, flag }) {
      this.scene = scene;
      if (flag == "新增") {
        this.page = 1;
      }
      this.getSpuList();
    },
    //删除SPU
    async deleteSpu(row) {
      let res = await this.$API.spu.reqDeleteSpu(row.id);
      if (res.code == 200) {
        this.$message.success("删除成功！");
        //判断是否发生页面的跳转
        this.page = this.records.length > 1 ? this.page : this.page - 1;
        this.getSpuList();
      } else {
        console.log(res);
        this.$message.error("删除失败！");
      }
    },
    //添加sku
    addSku(row) {
      this.$refs.sku.initAddSkuData(row, this.category1Id, this.category2Id);
      this.scene = 2;
    },
    async showSkuList(row) {
      this.dialogTableVisible = true;
      this.spu = row;
      let res = await this.$API.spu.reqSkuList(row.id);
      this.skuList = res.data;
      this.loading = false
    },
    //关闭dialog
    close(done){
        console.log("执行");
        this.loading = true
        this.skuList = []
        done()
    }
  },
};
</script>

<style lang="scss" scope>
.top {
  margin-bottom: 20px;
}
.add-spu-btn {
  margin-bottom: 20px;
}
.pagination {
  text-align: center;
}
.delete-btn {
  margin-left: 10px;
}
.img {
  width: 100px;
  height: 100px;
}
</style>