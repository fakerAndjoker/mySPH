import request from "@/utils/request"
//一级菜单列表
export const reqCategory1List = () => request({ url: `/admin/product/getCategory1`, method: "get" })

//二级菜单列表
export const reqCategory2List = (category1Id) => request({ url: `/admin/product/getCategory2/${category1Id}`, method: "get" })

//三级菜单列表
export const reqCategory3List = (category2Id) => request({ url: `/admin/product/getCategory3/${category2Id}`, method: "get" })

//获取商品属性
export const reqAttrInfoList = (category1Id, category2Id, category3Id) => request({ url: `/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`, method: "get" })

//添加属性与属性值
export const reqAddOrUpdateAttr =(data) => request({url:`/admin/product/saveAttrInfo`,data,method:"post"})