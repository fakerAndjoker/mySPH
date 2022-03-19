<template>
  <div>
    <el-form :inline="true" class="demo-form-inline">
      <el-form-item label="一级菜单">
        <el-select
          placeholder="一级菜单"
          @change="changeCategory1"
          v-model="categoryForm.category1Id"
          :disabled="show"
        >
          <el-option
            :label="c1.name"
            :value="c1.id"
            v-for="c1 in category1List"
            :key="c1.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="二级菜单">
        <el-select
          placeholder="二级菜单"
          @change="changeCategory2"
          v-model="categoryForm.category2Id"
           :disabled="show"
        >
          <el-option
            :label="c2.name"
            :value="c2.id"
            v-for="c2 in category2List"
            :key="c2.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="三级菜单">
        <el-select
          placeholder="三级菜单"
          @change="changeCategory3"
          v-model="categoryForm.category3Id"
           :disabled="show"
        >
          <el-option
            :label="c3.name"
            :value="c3.id"
            v-for="c3 in category3List"
            :key="c3.id"
          ></el-option>
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  name: "CategorySelect",
  props: {
    show: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      category1List: [],
      category2List: [],
      category3List: [],
      categoryForm: {
        category1Id: "",
        category2Id: "",
        category3Id: "",
      },
    };
  },
  mounted() {
    this.getCategory1List();
  },
  methods: {
    async getCategory1List() {
      let res = await this.$API.attr.reqCategory1List();
      this.category1List = res.data;
    },
    async getCategory2List() {
      let res = await this.$API.attr.reqCategory2List(
        this.categoryForm.category1Id
      );
      this.category2List = res.data;
    },
    async getCategory3List() {
      let res = await this.$API.attr.reqCategory3List(
        this.categoryForm.category2Id
      );
      this.category3List = res.data;
    },
    changeCategory1() {
      this.category2List = [];
      this.category3List = [];
      this.categoryForm.category2Id = "";
      this.categoryForm.category3Id = "";
      this.getCategory2List();
    },
    changeCategory2() {
      this.categoryForm.category3List = [];
      this.categoryForm.category3Id = "";
      this.getCategory3List();
    },
    changeCategory3() {
      this.$emit("getCategoryId", this.categoryForm);
    },
  },
};
</script>

<style>
</style>