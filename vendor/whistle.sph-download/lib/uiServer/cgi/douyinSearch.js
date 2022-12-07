const { page: page,count: count} = require('../../db/dySearchData');
const {generate:generate} = require('../../utils');
module.exports = async (ctx) => {
    const { sortField,sortOrder ,pageSize,pageIndex} = ctx.request.body;

    console.log(sortField)
    const data =await page((+pageIndex)+1,pageSize,sortField,sortOrder)
    const total = await count(1)
    
    ctx.body = {total:total,data:data};
}
