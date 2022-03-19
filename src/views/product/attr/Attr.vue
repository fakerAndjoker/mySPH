<template>
  <div>
    <el-card class="top">
      <category-select @getCategoryId="getCategoryId" :show="isShowAddOrUpdateTable"></category-select>
    </el-card>
    <el-card>
      <div v-show="!isShowAddOrUpdateTable">
        <el-button
          type="primary"
          size="medium"
          icon="el-icon-plus"
          class="add-attr-btn"
          :disabled="!category3Id"
          @click="addAttr"
          >添加属性</el-button
        >
        <el-table :data="attrInfoList" style="width: 100%" border stripe>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="attrName" label="属性名称"> </el-table-column>
          <el-table-column label="属性值列表" width="600">
            <template slot-scope="scope">
              <el-tag
                class="attr-tag"
                type="success"
                v-for="item in scope.row.attrValueList"
                :key="item.id"
                >{{ item.valueName }}</el-tag
              >
            </template>
          </el-table-column>
          <el-table-column label="操作" width="width">
            <template slot-scope="scope">
              <el-button
                type="warning"
                size="mini"
                @click="updateAttr(scope.row)"
                >编辑</el-button
              >
              <el-button type="danger" size="mini">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加修改属性的表单 -->
      <div v-show="isShowAddOrUpdateTable">
        <el-form ref="form" :inline="true" label-width="80px" :model="attrInfo">
          <el-form-item label="属性名">
            <el-input
              placeholder="请输入属性名"
              v-model="attrInfo.attrName"
            ></el-input>
          </el-form-item>
        </el-form>
        <el-button
          type="primary"
          icon="el-icon-plus"
          class="add-attr-btn"
          @click="addAttrValue"
          :disabled="!attrInfo.attrName"
          >添加属性值</el-button
        >
        <el-table
          border
          stripe
          style="width: 100%"
          :data="attrInfo.attrValueList"
        >
          <el-table-column type="index" label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="prop" label="属性值名称" width="width">
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-if="scope.row.flag"
                v-model="scope.row.valueName"
                @blur="toLook(scope.row)"
                @keyup.native.enter="toLook(scope.row)"
                placeholder="请输入属性值名称"
              ></el-input>
              <span v-else @click="toEdit(scope.row)" style="display: block">{{
                scope.row.valueName
              }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="prop" label="操作" width="width">
            <template slot-scope="scope">
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @onConfirm="deleteAttrValue(scope.$index)"
              >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  slot="reference"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-button type="primary" class="save-btn" @click="addOrUpdateAttrValue" :disabled="attrInfo.attrValueList.length < 1"
          >保存</el-button
        >
        <el-button @click="isShowAddOrUpdateTable = false">取消</el-button>
      </div>
    </el-card>
  </div>
</template>

<script>
import CategorySelect from "@/components/categorySelect/CategorySelect";
export default {
  components: {
    CategorySelect,
  },
  data() {
    return {
      category1Id: "",
      category2Id: "",
      category3Id: "",
      attrInfoList: [],
      isShowAddOrUpdateTable: false,
      //添加属性要传的差数
      attrInfo: {
        attrName: "",
        attrValueList: [],
        categoryId: 0, //三级分类的ID
        categoryLevel: 3,
      },
    };
  },
  methods: {
    getCategoryId({ category1Id, category2Id, category3Id }) {
      this.category1Id = category1Id;
      this.category2Id = category2Id;
      this.category3Id = category3Id;
      this.getAttrInfoList();
    },
    async getAttrInfoList() {
      let res = await this.$API.attr.reqAttrInfoList(
        this.category1Id,
        this.category2Id,
        this.category3Id
      );
      this.attrInfoList = res.data;
    },
    //添加属性值按钮
    addAttrValue() {
      this.attrInfo.attrValueList.push({
        attrId: this.attrInfo.id,
        valueName: "",
        //查看模式也编辑模式的切换标志
        flag: true,
      });
    },
    //添加属性
    addAttr() {
      this.attrInfo = {
        attrName: "",
        attrValueList: [],
        categoryId: this.category3Id, //三级分类的ID
        categoryLevel: 3,
      };
      this.isShowAddOrUpdateTable = true;
    },
    updateAttr(row) {
      this.isShowAddOrUpdateTable = true;
      //深拷贝，可也以直接使用lodaash里面的深拷贝方法
      this.attrInfo = JSON.parse(JSON.stringify(row));
    },
    //查看模式
    toLook(row) {
      if (row.valueName.trim() == "") {
        this.$message.error("非法输入");
        return;
      }
      let isRepeat = this.attrInfo.attrValueList.some((item) => {
        if (item !== row) {
          return row.valueName == item.valueName;
        }
      });
      if (isRepeat) {
        this.$message.error("属性值重复");
        return;
      }
      row.flag = false;
    },
    toEdit(row) {
      //这样添加的属性不是响应式的，所以页面不会发生变化。
      //   row.flag = true;
      //响应式添加属性
      this.$set(row, "flag", true);
      console.log(row);
    },
    //删除属性值
    deleteAttrValue(index) {
      this.attrInfo.attrValueList.splice(index, 1);
    },
    async addOrUpdateAttrValue() {
      //过滤掉空的属性值,并删除flag属性
      this.attrInfo.attrValueList = this.attrInfo.attrValueList.filter(
        (item) => {
          if (item.valueName != "") {
            delete item.flag;
            return true;
          }
        }
      );
      try {
        let res = await this.$API.attr.reqAddOrUpdateAttr(this.attrInfo);
        this.isShowAddOrUpdateTable = false
        this.$message.success("保存成功")
        this.getAttrInfoList()
      } catch (error) {
          this.$message.error("保存失败")
      }
    },
  },
};
</script>

<style lang="scss">
.top {
  margin: 20px 0;
}
.attr-tag {
  margin-right: 10px;
}
.add-attr-btn {
  margin-bottom: 20px;
}
.save-btn {
  margin-top: 20px;
}
</style>

