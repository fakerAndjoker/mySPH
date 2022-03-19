<template>
  <div>
      <el-form label-width="80px">
          <el-form-item label="SPU名称">{{spu.spuName}}</el-form-item></el-form-item>
          <el-form-item label="SKU名称">
              <el-input placeholder="sku名称" v-model="skuInfo.skuName"></el-input>
          </el-form-item>
               <el-form-item label="价格(元)">
              <el-input placeholder="请输入价格" v-model="skuInfo.price" type="number"></el-input>
          </el-form-item>
               <el-form-item label="重量(千克)">
              <el-input placeholder="重量(千克)" v-model="skuInfo.weight"></el-input>
          </el-form-item>
          <el-form-item label="规格描述">
          <el-input type="textarea" :rows="4" v-model="skuInfo.skuDesc"></el-input>
          </el-form-item>
          <el-form-item label="平台属性">
              <el-form :inline="true"  label-width="80px">
                  <el-form-item :label="attrInfo.attrName" v-for="attrInfo in attrInfoList" :key="attrInfo.id">
                      <el-select  placeholder="请选择" v-model="attrInfo.attrIdAndValueId">
                          <el-option :label="attrValue.valueName" :value="`${attrInfo.id}:${attrValue.id}`" v-for="attrValue in attrInfo.attrValueList" :key="attrValue.id"></el-option>
                      </el-select>
                  </el-form-item>
              </el-form>
          </el-form-item>
          <el-form-item label="销售属性">
              <el-form :inline="true"  label-width="80px">
                  <el-form-item :label="spuSaleAttr.saleAttrName" v-for="spuSaleAttr in spuSaleAttrList" :key="spuSaleAttr.id">
                      <el-select  placeholder="请选择" v-model="spuSaleAttr.attrIdAndValueId">
                          <el-option :label="saleValue.saleAttrValueName" :value="`${spuSaleAttr.id}:${saleValue.id}`" v-for="saleValue in spuSaleAttr.spuSaleAttrValueList" :key="saleValue.id"></el-option>
                      </el-select>
                  </el-form-item>
              </el-form>
          </el-form-item>
          <el-form-item label="图片列表">
              <el-table
              border
              stripe
              :data="spuImageList"
              @selection-change="handleSelectionChange"
                  style="width: 100%">
                  <el-table-column
                  type="selection"
                  align="center"
                      width="80">
                  </el-table-column>
                   <el-table-column
                      label="图片">
                      <template slot-scope="{row}">
                          <img :src="row.imgUrl" alt="" class="img">
                      </template>
                  </el-table-column>
                   <el-table-column
                      prop="imgName"
                      label="名称">
                  </el-table-column>
                   <el-table-column
                      prop="prop"
                      label="操作">
                      <template slot-scope="{row}">
                          <el-button type="primary" @click="setDefault(row)" v-if="row.isDefault == 0">设为默认</el-button>
                          <el-button v-else>默认</el-button>
                      </template>
                  </el-table-column>
              </el-table>
          </el-form-item>
          <el-form-item>
              <el-button type="primary" @click="save">保存</el-button>
              <el-button @click="cancel">取消</el-button>
          </el-form-item>
      </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      spu: {},
      spuImageList: [],
      spuSaleAttrList: [],
      attrInfoList: [],
      //被选中的图片
      selectedImgList: [],
      //收集sku信息
      skuInfo: {
        //第一类收集的数据：父组件给的数据
        category3Id: 0,
        spuId: 0,
        tmId: 0,
        //第二类：需要通过数据双向绑定v-model收集
        skuName: "",
        price: 0,
        weight: "",
        skuDesc: "",
        //第三类：需要自己书写代码
        //默认图片
        skuDefaultImg: "",
        //收集图片的字段
        skuImageList: [],
        //平台属性
        skuAttrValueList: [],
        //销售属性
        skuSaleAttrValueList: [],
      },
    };
  },
  methods: {
    async initAddSkuData(spu, category1Id, category2Id) {
      this.spu = spu;
      this.skuInfo.category3Id = spu.category3Id;
      this.skuInfo.spuId = spu.id;
      this.skuInfo.tmId = spu.tmId;
      let imageRes = await this.$API.spu.reqSpuImageLIst(spu.id);
      if (imageRes.code == 200) {
        //用这种方式添加的属性不是响应式的，不知道为什么。（可能是因为单独修改的数组里面的元素，不是整体修改的数组）（有待考察）
        // this.spuImageList = imageRes.data;
        // let list = imageRes.data
        // list.forEach((item) => {
        //   item.isDefault = 0;
        // });
        // this.spuImageList = list
        this.spuImageList = imageRes.data;
        this.spuImageList.forEach((item) => {
          this.$set(item, "isDefault", 0);
        });
      }
      //销售属性
      let saleAttrRes = await this.$API.spu.reqSpuSaleAttrList(spu.id);
      if (saleAttrRes.code == 200) {
        this.spuSaleAttrList = saleAttrRes.data;
      }
      //平台属性
      let attrInfoRes = await this.$API.spu.reqAttrInfoList(
        category1Id,
        category2Id,
        spu.category3Id
      );
      if (attrInfoRes.code == 200) {
        this.attrInfoList = attrInfoRes.data;
      }
    },
    cancel() {
      this.$emit("changeSence", { scene: 0, flag: "" });
       //清除数据
      Object.assign(this._data,this.$options.data());
    },
    //被勾选的元素
    handleSelectionChange(section) {
      this.selectedImgList = section;
    },
    //设为默认
    setDefault(row) {
      this.spuImageList.forEach((item) => {
        item.isDefault = 0;
      });
      row.isDefault = 1;
      //收集图片的默认地址

      this.skuInfo.skuDefaultImg = row.imgUrl;
    },
    //保存数据
    async save() {
      //整理数据
      //整理平台属性
      this.skuInfo.skuAttrValueList = this.attrInfoList.reduce((prev, item) => {
        if (item.attrIdAndValueId) {
          let [attrId, valueId] = item.attrIdAndValueId.split(":");
          prev.push({ attrId, valueId });
        }
        return prev;
      }, []);
      //销售属性
      this.skuInfo.skuSaleAttrValueList = this.spuSaleAttrList.reduce(
        (prev, item) => {
          if (item.attrIdAndValueId) {
            let [saleAttrId, saleAttrValueId] =
              item.attrIdAndValueId.split(":");
            prev.push({ saleAttrId, saleAttrValueId });
          }
          return prev;
        },
        []
      );
      //选中的图片
      this.skuInfo.skuImageList = this.selectedImgList.map((item) => {
        return {
          imgName: item.imgName,
          imgUrl: item.imgUrl,
          isDefault: item.isDefault,
          spuImgId: item.id,
        };
      });
      //这个接口好像出问题了，应该不是我的问题
      let res = await this.$API.spu.reqAddSku(this.skuInfo);
      if(res.code == 200){
          this.$$message.success("添加sku成功！")
         this.$emit("changeSence", { scene: 0, flag: "" });
      }
    },
  },
};
</script>

<style scope lang="scss">
.img {
  width: 100px;
  height: 100px;
}
</style>