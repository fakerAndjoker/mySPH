import request from "@/utils/request"

export const reqSpuList = (page, limit, category3Id) => request({ url: `/admin/product/${page}/${limit}`, method: "get", params: { category3Id } })

//获取SPU信息
export const reqSpu = (spuId) => request({ url: `/admin/product/getSpuById/${spuId}`, method: 'get' });

//获取品牌的信息
export const reqTradeMarkList = () => request({ url: `/admin/product/baseTrademark/getTrademarkList`, method: 'get' });

//获取SPU图标的接口
export const reqSpuImageList = (spuId) => request({ url: `/admin/product/spuImageList/${spuId}`, method: 'get' });

//获取平台全部销售属性----整个平台销售属性一共三个
export const reqBaseSaleAttrList = () => request({ url: '/admin/product/baseSaleAttrList', method: 'get' });

//添加或修改spu
export const reqAddOrUpdateSpu = (spu) => {
    if (spu.id) {
        return request({ url: `/admin/product/updateSpuInfo`, method: "post", data: spu })
    } else {
        return request({ url: `/admin/product/saveSpuInfo`, method: "post", data: spu })
    }
}


//删除SPU
export const reqDeleteSpu = (spuId) => request({ url: `/admin/product/deleteSpu/${spuId}`, method: "delete" })

//获取图片的数据
export const reqSpuImageLIst = (spuId)=>request({url:`/admin/product/spuImageList/${spuId}`,method:'get'});


//获取销售属性的数据
export const reqSpuSaleAttrList = (spuId)=>request({url:`/admin/product/spuSaleAttrList/${spuId}`,method:'get'});


//获取平台属性的数据
export const reqAttrInfoList = (category1Id,category2Id,category3Id)=>request({url:`/admin/product/attrInfoList/${category1Id}/${category2Id}/${category3Id}`,method:'get'});


//保存添加sku
export const reqAddSku = (skuInfo)=>request({url:'/admin/product/saveSkuInfo',method:'post',data:skuInfo});

//获取sku列表
export const reqSkuList = (spuId)=>request({url:`/admin/product/findBySpuId/${spuId}`,method:"get"})