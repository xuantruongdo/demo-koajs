function filterObjectFields(product, fields) {
  const fieldsArr = fields.split(",");
  const filteredObject = {};

  fieldsArr.forEach((field) => {
    if (product.hasOwnProperty(field)) {
      filteredObject[field] = product[field];
    }
  });

  return filteredObject;
}

module.exports = { filterObjectFields };
