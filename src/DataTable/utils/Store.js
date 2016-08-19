/////////////////////////////////////////////////////////////////////////////
// 包括一系列对 Data Table 中数据的操作藏发的集合,用于管理 Data Table 中的数据 //
////////////////////////////////////////////////////////////////////////////
import {Order} from './Constants';
import {stringIsNotEmpty} from './utils';

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

    this.data = data.slice();
    this.sortInfo = null;
    this.columns = null;
    this.searchInfo = {
      enable: false,
      text: '',
      result: this.data.slice()
    };
    // this.filteredData = data;
  }

  setData(data) {
    if (this.getSearchEnable()){
      this.setSearchResult(data);
    } else {
      this.data = data;
    }
  }
  /**
   * 保存当前的排序信息
   */
  setSortInfo(field, order) {
    this.sortInfo = {
      field, order
    };
    return this;
  }
  getSortInfo() {
    return Object.assign({}, this.sortInfo);
  }

  setSearchText(searchText) {
    if(stringIsNotEmpty(searchText)) {
      this.searchInfo.text = searchText;
      this.searchInfo.enable = true;
      return this.search();
    } else {
      this.searchInfo.text = searchText;
      this.searchInfo.enable = false;
      return this;
    }
  }
  getSearchText() {
    return this.searchInfo.text;
  }
  setSearchResult(result) {
    this.searchInfo.result = result;
    return this;
  }
  getSearchEnable() {
    return this.searchInfo.enable && stringIsNotEmpty(this.searchInfo.text);
  }
  getSearchResult() {
    const {result} = this.searchInfo;
    return this.getSearchEnable() ? result : this.data.slice();
  }

  /**
   * 保存每一列的配置信息
   */
  setColumns(columns) {
    this.columns = columns;
    return this;
  }
  getColumns() {
    return Object.assign({}, this.columns);
  }

  getCurrentData() {
    return this.getSearchEnable() ? this.getSearchResult() : this.data.slice();
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

  /**
   * 仅限内部的 setSearchText 调用，不需要手动调用
   */
  search() {
    if(this.getSearchEnable()) {
      const data = this.data.slice();
      const searchText = this.getSearchText();
      const columnKeys = Object.keys(this.getColumns());
      // 拼接字符串成正则表达式，可实现简单有效的模糊匹配
      const reg = new RegExp(searchText.toLocaleLowerCase().split('').join('.*?'), ['g']);

      const result = data.filter((value) => {
        return columnKeys.some((key) => {
          return reg.exec(String(value[key]).toLocaleLowerCase());
        });
      });

      this.setSearchResult(result);
    }
    return this;
  }

}

export default Store;
