<template>
  <div>
    <el-form label-width="80px">
      <el-form-item label="SPU名称">
        <el-input placeholder="SPU名称" v-model="spu.spuName"></el-input>
      </el-form-item>
      <el-form-item label="品牌">
        <el-select placeholder="请选择品牌" v-model="spu.tmId">
          <el-option
            :label="tm.tmName"
            :value="tm.id"
            v-for="tm in tradeMarkList"
            :key="tm.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="Spu描述">
        <el-input type="textarea" rows="4" v-model="spu.description"></el-input>
      </el-form-item>
      <el-form-item label="Spu图片">
        <el-upload
          action="/dev-api/admin/product/fileUpload"
          list-type="picture-card"
          :on-preview="handlePictureCardPreview"
          :on-remove="handleRemove"
          :file-list="spuImageList"
          :on-success="hanldeSuccess"
        >
          <i class="el-icon-plus"></i>
        </el-upload>
        <el-dialog :visible.sync="dialogVisible">
          <img width="100%" :src="dialogImageUrl" alt="" />
        </el-dialog>
      </el-form-item>
      <el-form-item label="销售属性">
        <el-select
          :placeholder="`还有${unSelectedAttrList.length}种属性未选择`"
          v-model="attrIdAndName"
        >
          <el-option
            :label="unselected.name"
            :value="`${unselected.id}:${unselected.name}`"
            v-for="unselected in unSelectedAttrList"
            :key="unselected.id"
          ></el-option>
        </el-select>
        <el-button
          type="primary"
          icon="el-icon-plus"
          @click="addSaleAttr"
          :disabled="!attrIdAndName"
          >添加销售属性</el-button
        >
        <el-table border stripe style="width: 100%" :data="spu.spuSaleAttrList">
          <el-table-column label="序号" align="center" width="80">
          </el-table-column>
          <el-table-column prop="saleAttrName" label="属性名">
          </el-table-column>
          <el-table-column label="属性值名称列表">
            <template slot-scope="{ row }">
              <el-tag
                @close="row.spuSaleAttrValueList.splice(index, 1)"
                :key="tag.id"
                v-for="(tag, index) in row.spuSaleAttrValueList"
                closable
                :disable-transitions="false"
              >
                {{ tag.saleAttrValueName }}
              </el-tag>
              <el-input
                class="input-new-tag"
                v-if="row.inputVisible"
                v-model="row.inputValue"
                ref="saveTagInput"
                size="small"
                @keyup.enter.native="handleInputConfirm(row)"
                @blur="handleInputConfirm(row)"
              >
              </el-input>
              <el-button
                v-else
                class="button-new-tag"
                size="small"
                @click="addSpuAttrValue(row)"
                >+ 添加</el-button
              >
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="{ row, $index }">
              <el-button
                type="danger"
                icon="el-icon-delete"
                @click="spu.spuSaleAttrList.splice($index, 1)"
              ></el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateSave">保存</el-button>
        <el-button @click="cancle">取消</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //照片墙
      dialogImageUrl: "",
      dialogVisible: false,
      spu: {
        //三级分类的id
        category3Id: 0,
        //描述
        description: "",
        //spu名称
        spuName: "",
        //平台的id
        tmId: "",
        //收集SPU图片的信息
        spuImageList: [],
        //平台属性与属性值收集
        spuSaleAttrList: [],
      },
      tradeMarkList: [], //品牌信息
      spuImageList: [], //SPU图片信息
      saleAttrList: [], //平台的所有销售属性
      attrIdAndName: "", //添加的销售属性的ID和名称
    };
  },
  methods: {
    //初始化数据
    async initSpuData(spu) {
      let spuRes = await this.$API.spu.reqSpu(spu.id);
      console.log(spuRes);
      if (spuRes.code == 200) {
        this.spu = spuRes.data;
        console.log(this.spu);
      }
      let tradeMarkRes = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkRes.code == 200) {
        this.tradeMarkList = tradeMarkRes.data;
      }
      let spuImageRes = await this.$API.spu.reqSpuImageList(spu.id);
      if (spuImageRes.code == 200) {
        let res = spuImageRes.data;
        //照片墙展示数据时需要name，和URL两个参数
        res.forEach((item) => {
          item.name = item.imgName;
          item.url = item.imgUrl;
        });
        this.spuImageList = res;
      }
      let saleRes = await this.$API.spu.reqBaseSaleAttrList();
      if (saleRes.code == 200) {
        this.saleAttrList = saleRes.data;
      }
    },
    handleRemove(file, fileList) {
      this.spuImageList = fileList;
    },
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url;
      this.dialogVisible = true;
    },
    hanldeSuccess(response, file, fileList) {
      this.spuImageList = fileList;
    },
    //添加销售属性
    addSaleAttr() {
      let [baseSaleAttrId, saleAttrName] = this.attrIdAndName.split(":");
      this.spu.spuSaleAttrList.push({
        baseSaleAttrId,
        saleAttrName,
        spuSaleAttrValueList: [],
      });
      this.attrIdAndName = "";
    },
    //添加销售属性值
    addSpuAttrValue(row) {
      //显示输入框
      this.$set(row, "inputVisible", true);
      this.$set(row, "inputValue", "");
    },
    //失去焦点
    handleInputConfirm(row) {
      let { baseSaleAttrId, inputValue } = row;
      //不允许空串
      if (inputValue.trim() == "") {
        row.inputVisible = false;
        return;
      }
      //若有相同的值，则为真
      let isRepeat = row.spuSaleAttrValueList.some((item) => {
        return item.saleAttrValueName == inputValue.trim();
      });
      if (isRepeat) {
        this.$message.warning("属性值重复");
        row.inputVisible = false;
        return;
      }
      row.spuSaleAttrValueList.push({
        baseSaleAttrId,
        saleAttrValueName: inputValue,
      });
      row.inputVisible = false;
    },
    //保存数据
    async addOrUpdateSave() {
      //修改数据(原有的照片和新加的照片的属性不一样)
      this.spu.spuImageList = this.spuImageList.map((item) => {
        return {
          imgName: item.name,
          imgUrl: (item.response && item.response.data) || item.url,
        };
      });
      let res = await this.$API.spu.reqAddOrUpdateSpu(this.spu);
      if (res.code == 200) {
        this.$message.success("保存成功!");
        this.$emit("changeSence", {
          scene: 0,
          flag: this.spu.id ? "修改" : "新增",
        });
        Object.assign(this._data, this.$options.data());
      }
    },
    //添加按钮的初始化数据
    async addInitSpuData(category3Id) {
      this.spu.category3Id = category3Id;
      let tradeMarkRes = await this.$API.spu.reqTradeMarkList();
      if (tradeMarkRes.code == 200) {
        this.tradeMarkList = tradeMarkRes.data;
      }
      let saleRes = await this.$API.spu.reqBaseSaleAttrList();
      if (saleRes.code == 200) {
        this.saleAttrList = saleRes.data;
      }
    },
    //取消按钮
    cancle() {
      this.$emit("changeSence", {
        scene: 0,
        flag: "",
      });
      //清理数据
      //Object.assign:es6中新增的方法可以合并对象
      //组件实例this._data,可以操作data当中响应式数据
      //this.$options可以获取配置对象，配置对象的data函数执行，返回的响应式数据为空的
      Object.assign(this._data, this.$options.data());
    },
  },
  computed: {
    unSelectedAttrList() {
      let res = this.saleAttrList.filter((item) => {
        return this.spu.spuSaleAttrList.every((item1) => {
          return item1.saleAttrName !== item.name;
        });
      });
      return res;
    },
  },
};
</script>

<style lang="scss" scpoe>
.el-tag + .el-tag {
  margin-left: 10px;
}
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
</style>