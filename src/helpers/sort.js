function sortByProperty(arr, prop, order = "asc") {
  const sortOrder = order === "desc" ? -1 : 1;

  return [...arr].sort((a, b) => {
    const valueA = a[prop];
    const valueB = b[prop];

    if (valueA < valueB) {
      return -1 * sortOrder;
    }
    if (valueA > valueB) {
      return 1 * sortOrder;
    }
    return 0;
  });
}

module.exports = { sortByProperty };
