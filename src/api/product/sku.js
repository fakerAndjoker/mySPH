import request from '@/utils/request'
//获取sku列表
export const reqSkuList = (page, limit) => request({ url: `/admin/product/list/${page}/${limit}`, method: "get" })

//商品上架
export const reqSale = (skuId) => request({ url: `/admin/product/onSale/${skuId}`, method: 'get' })

//商品下架
export const reqCancleSale = (skuId) => request({ url: `/admin/product/cancelSale/${skuId}`, method: "get" })

//获取skuinfo
export const reqSkuById = (skuId) => request({ url: `/admin/product/getSkuById/${skuId}`, method: "get" })