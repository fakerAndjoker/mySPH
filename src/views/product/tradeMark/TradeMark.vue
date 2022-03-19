<template>
  <div>
    <el-button
      type="primary"
      icon="el-icon-plus"
      class="add-btn"
      @click="showDialog"
      >添加</el-button
    >
    <el-table border style="width: 100%" stripe :data="tradeMarkList">
      <el-table-column type="index" label="序号" width="80px" align="center">
      </el-table-column>
      <el-table-column label="品牌名称" prop="tmName"> </el-table-column>
      <el-table-column label="品牌LOGO">
        <template slot-scope="scope">
          <img :src="scope.row.logoUrl" alt="" class="logo" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            type="warning"
            icon="el-icon-edit"
            size="mini"
            @click="changeDialog(scope.row)"
            >修改</el-button
          >
          <el-button
            type="danger"
            icon="el-icon-delete"
            size="mini"
            @click="deleteTradeMark(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-pagination
      class="pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="page"
      :page-sizes="[2, 3, 5]"
      :page-size="limit"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total"
    >
    </el-pagination>
    <!-- 添加、修改的对话框 -->
    <el-dialog
      :title="tmForm.id ? '修改品牌' : '添加品牌'"
      :visible.sync="dialogFormVisible"
      :show-close="false"
    >
      <el-form
        style="width: 80%"
        :model="tmForm"
        :rules="addOrUpdateRules"
        ref="addOrUpdateForm"
      >
        <el-form-item label="品牌名称" label-width="100px" prop="tmName">
          <el-input v-model="tmForm.tmName"></el-input>
        </el-form-item>
        <el-form-item label="品牌Logo" label-width="100px" prop="logoUrl">
          <el-upload
            action="dev-api/admin/product/fileUpload"
            class="avatar-uploader"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :before-upload="beforeAvatarUpload"
          >
            <img v-if="tmForm.logoUrl" :src="tmForm.logoUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            <div slot="tip" class="el-upload__tip">
              只能上传jpg/png文件，且不超过500kb
            </div>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="closeDialog">取 消</el-button>
        <el-button type="primary" @click="addOrUpdateTradeMark"
          >确 定</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      page: 3,
      limit: 3,
      total: 0,
      tradeMarkList: [],
      //dialog
      dialogFormVisible: false,
      imageUrl: "",
      //表单
      tmForm: {
        id: "",
        logoUrl: "",
        tmName: "",
      },
      addOrUpdateRules: {
        tmName: [
          { required: true, message: "请输入品牌", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
        logoUrl: [
          { required: true, message: "请选择品牌logo", trigger: "change" },
        ],
      },
    };
  },
  mounted() {
    this.getTrademarkList();
  },
  methods: {
    async getTrademarkList() {
      let res = await this.$API.tradeMark.reqTradeMarkList(
        this.page,
        this.limit
      );
      if (res.code == 200) {
        this.total = res.data.total;
        this.tradeMarkList = res.data.records;
      } else {
        console.log(res);
        alert("获取列表失败");
      }
    },
    handleSizeChange(size) {
      this.limit = size;
      this.getTrademarkList();
    },
    handleCurrentChange(page) {
      this.page = page;
      this.getTrademarkList();
    },
    showDialog() {
      this.dialogFormVisible = true;
    },
    changeDialog(row) {
      this.dialogFormVisible = true;
      //浅拷贝，tmForm和row指向的同一个对象。修改tmForm也会影响row,让页面跟着改变
      //   this.tmForm = row
      // 所以要用深拷贝，或者不用拷贝
      this.tmForm = { ...row };
    },
    // 上传图片成功
    handleAvatarSuccess(res, file) {
      this.tmForm.logoUrl = res.data;
      //消除logo表单验证的提示信息
      this.$refs.addOrUpdateForm.clearValidate("logoUrl");
    },
    // 上传图片之前
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg";
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error("上传头像图片只能是 JPG 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isJPG && isLt2M;
    },
    //确认添加或修改
    addOrUpdateTradeMark() {
      this.$refs.addOrUpdateForm.validate(async (valid) => {
        if (valid) {
          this.dialogFormVisible = false;
          let res = await this.$API.tradeMark.reqAddOrUpdateTradeMark(
            this.tmForm
          );
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: this.tmForm.id ? "修改品牌成功" : "添加品牌成功",
            });
            this.page = this.tmForm.id ? this.page : 1;
            await this.getTrademarkList();
            this.tmForm = {};
          } else {
            this.$message({
              type: "error",
              message: this.tmForm.id ? "修改失败" : "添加失败",
            });
          }
        } else {
          console.log("表单验证失败");
        }
      });
    },
    //取消按钮
    closeDialog() {
      //移除表单验证
      this.$refs.addOrUpdateForm.resetFields();
      this.dialogFormVisible = false;
      this.tmForm = {};
    },
    // 删除按钮
    deleteTradeMark(row) {
      this.$confirm(`是否删除${row.tmName}?`, "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(async () => {
          let res = await this.$API.tradeMark.reqDeleteTradeMark(row.id);
          if (res.code == 200) {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTrademarkList()
          }
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style lang="scss">
.add-btn {
  margin: 10px 0;
}
.logo {
  width: 100px;
  height: 100px;
}
.pagination {
  text-align: center;
}
//上传图片
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>