const { insert: insert,page: pageData,remove: remove} = require('../../db/persistent');
module.exports = async (ctx) => {
    const { page, size } = ctx.request.query;
    remove();
    ctx.body = {
        data: 1,
    };
}
