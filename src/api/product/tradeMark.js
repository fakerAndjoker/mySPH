import request from "@/utils/request"

//商品分页列表
export const reqTradeMarkList = (page, limit) => request({ url: `/admin/product/baseTrademark/${page}/${limit}`, method: "get" })

//添加或修改品牌形象
export const reqAddOrUpdateTradeMark = (tradeMark) => {
    //有ID就是修改
    if (tradeMark.id) {
        console.log("11");
       return request({ url: `/admin/product/baseTrademark/update`, method: "put", data: tradeMark })
    } else {
       return request({ url: `/admin/product/baseTrademark/save`, method: "post", data: tradeMark })
    }
}

//删除品牌
export const reqDeleteTradeMark =(id) => request({url:`/admin/product/baseTrademark/remove/${id}`,method:"delete"})