import _ from "lodash";

export function paginate(items, curPage, pageSize) {
  const startIndex = (curPage - 1) * pageSize;
  return _(items).slice(startIndex).take(pageSize).value();
  // console.log(items);
  // return items;
}
