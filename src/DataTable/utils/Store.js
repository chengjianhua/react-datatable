/////////////////////////////////////////////////////////////////////////////
// 包括一系列对 Data Table 中数据的操作藏发的集合,用于管理 Data Table 中的数据 //
////////////////////////////////////////////////////////////////////////////

import {Order} from './Constants';

function _sort({array, sortField, order}) {
  order = order.toLowerCase();
  const isAsc = order === Order.ASC;

  return array.sort((a, b) => {
    let valueA = a[sortField] === null ? '' : a[sortField];
    let valueB = b[sortField] === null ? '' : b[sortField];

    if(!isAsc) {
      const temp = valueA; valueA = valueB; valueB = temp;
    }

    return typeof valueA === 'string' ? valueA.localeCompare(valueB) :
      valueA > valueB ? 1 : (valueA < valueB ? -1 : 0);
  });
}

class Store {
  constructor(data) {

    this.data = data;
    this.sortInfo = null;
    this.columns = null;
    this.searchText = '';
  }

  setData(data) {
    this.data = data;
  }
  /**
   * 保存当前的排序信息
   */
  setSortInfo(field, order) {
    this.sortInfo = {
      field, order
    };
  }

  getSortInfo() {
    return Object.assign({}, this.sortInfo);
  }

  /**
   * 保存每一列的配置信息
   */
  setColumns(columns) {
    this.columns = columns;
  }
  getColumns() {
    return this.columns.slice();
  }

  getCurrentData() {
    return this.data.slice();
  }

  /**
  * 根据 排序字段、排序顺序 对数据进行排序
  */
  sort(sortField, order) {
    this.setSortInfo(sortField, order);
    let currentData = this.getCurrentData();

    currentData = _sort({
      array: currentData,
      sortField,
      order
    });

    this.setData(currentData);

    return this;
  }

}

export default Store;
