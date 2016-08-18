/////////////////////////////////////////////////////////////////////////////
// 包括一系列对 Data Table 中数据的操作藏发的集合,用于管理 Data Table 中的数据 //
////////////////////////////////////////////////////////////////////////////
import Fuse from 'fuse.js';
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
    this.data = data;
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
    if(searchText.trim()) {
      this.searchInfo.text = searchText;
      this.searchInfo.enable = true;
    } else {
      this.searchInfo.text = searchText;
      this.searchInfo.enable = false;
    }
    return this.search();
  }
  getSearchText() {
    return this.searchInfo.text;
  }
  setSearchResult(result) {
    this.searchInfo.enable = true;
    this.searchInfo.result = result;
    return this;
  }
  getSearchEnable() {
    return this.searchInfo.enable && this.searchInfo.text;
  }
  getSearchResult() {
    const {enable, result} = this.searchInfo;
    return enable === true ? result : this.getCurrentData();
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

  search() {
    if(this.getSearchEnable()) {

      // const fuse = new Fuse(this.data.slice(), {
      //   caseSensitive: false,
      //   shouldSort: true,
      //   tokenize: false,
      //   threshold: 0.3,
      //   location: 0,
      //   distance: 100,
      //   maxPatternLength: 32,
      //   keys: [
      //     // Object.keys(this.getColumns()),
      //     'name', 'modified_time'
      //   ]
      // });
      //
      // const searchResult = fuse.search(this.getSearchText());
      // this.setSearchResult(searchResult);
      //
      //
      // console.log(searchResult);


      const data = this.data.slice();
      const searchText = this.getSearchText();
      const columnKeys = Object.keys(this.getColumns());
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
