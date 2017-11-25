export function createTypes(base, actionsArray) {
  const res = {};
  actionsArray.forEach(type => {
    res[type] = `${base}_${type}`;
  });
  return res;
}
