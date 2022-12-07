const { findById: findById } = require('../../db/persistent');
module.exports = async (ctx) => {
    const { id } = ctx.request.body;
    const doc = await findById(id);
    ctx.body = {
        data: doc,
    };
}
