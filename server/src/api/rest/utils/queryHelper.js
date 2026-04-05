const { Like, ILike } = require("typeorm");

const applyFilters = (queryBuilder, alias, filters, allowedFields) => {
    Object.keys(filters).forEach(key => {
        if (allowedFields.includes(key) && filters[key]) {
            queryBuilder.andWhere(`${alias}.${key} ILIKE :${key}`, { [key]: `%${filters[key]}%` });
        }
    });
    return queryBuilder;
};

module.exports = { applyFilters };