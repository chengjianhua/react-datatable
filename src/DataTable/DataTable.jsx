import React, {Component, PropTypes} from 'react';
import classname from 'classname';
import Column from './Column';
import Pagination from './Pagination';

import Store from './utils/Store';

const style = {
  wrapper: {
    width: '100%',
    height: '550px',
    overflowY: 'scroll',
    overflowX: 'hidden'
  }
};

class DataTable extends Component {

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.instanceOf(Column)),
    hover: PropTypes.bool,
    data: PropTypes.arrayOf(PropTypes.object),
    search: PropTypes.bool,
    searchText: PropTypes.string,
    pageSize: PropTypes.number
  };

  static defaultProps = {
    hover: true,
    data: [],
    search: true,
    searchText: '',
    pageSize: 10
  };

  constructor(props) {
    super(props);

    this.store = new Store(props.data.slice());

    this.initTable = this.initTable.bind(this);
    this.getColumns = this.getColumns.bind(this);
    this.getTableHeaders = this.getTableHeaders.bind(this);
    this.renderTbody = this.renderTbody.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handlePageChange = this.handlePageChange.bind(this);

    // initialize the table and data store
    this.initTable();

    this.state = {
      data: this.store.getCurrentData(),
      orderStatus: this.store.getSortInfo(),
      activePage: 1
    };
  }

  initTable() {
    const {search, searchText} = this.props;
    /* START: 将 Column 中需要用到的数据存储到 store 中 */
    this.store.setColumns(this.getColumns().reduce((prev, curr) => {
        // 将每一列的列信息以列的 field 字段作为键，值为列的所有属性的集合来存储
        prev[curr.field] = curr;
        return prev;
      }, {}));
    /* END: 将 Column 中需要用到的数据存储到 store 中 */

    /* START: 如果开启了搜索并且搜索的字符串不为空，那么保存搜索的字符串并搜索 */
    if(search && searchText.trim()) {
      this.store.setSearchText(searchText);
    }
    /* END: 如果开启了搜索并且搜索的字符串不为空，那么保存搜索的字符串并搜索 */

  }

  /**
   * 获取每一列的 props 属性并存储为一个数组
   */
  getColumns() {
    return React.Children.map(this.props.children, (child, index) => {
      const props = child.props;
      return Object.assign({}, child.props, {index});
    });
  }

  /**
   * 根据每一列的配置信息生成列表的头部信息
   */
  getTableHeaders() {
    return React.Children.map(this.props.children, (child, index) => {
      const {sort, field} = child.props;
      return React.cloneElement(child, {
        onSort: this.handleSort.bind(this, field),
        orderStatus: this.state.orderStatus
      });
    });
  }

  /**
   * 点击表格的标题时处理排序的函数，用于传递给 <Column /> 标题的 onSort 属性
   */
  handleSort(sortField, order) {
    this.setState({
      data: this.store.sort(sortField, order).getCurrentData(),
      orderStatus: {
        field: sortField, order
      }
    });
  }

  /**
   * 处理分页按钮点击时切换分页的函数，用于传递给 <Pagination /> 组件的 onPage 属性
   */
  handlePageChange(nextPage) {
    this.setState({
      activePage: nextPage
    });
  }

  renderTbody() {
    const {activePage, data} = this.state;
    const {pageSize} = this.props;
    const start = (activePage - 1) * pageSize;
    const end = start + pageSize;
    return data.slice(start, end).map((row, rowIndex) => {
      const tds = this.getColumns().map((column, columnIndex) => {
        const {field, cell} = column;

        // 如果 <Column /> 组件设定了 cell 属性则使用自定义的单元格组件否则只是简单
        // 输出改列单元格的值的字符串格式
        const cellPresentation = cell ? cell(row, column, rowIndex) : row[column.field];

        return (
          <td key={`${rowIndex}-${columnIndex}`}>
            {cellPresentation}
          </td>
        );
      });

      return (
        <tr key={rowIndex}>
          {tds}
        </tr>
      );
    });
  }

  renderPagination() {
    return (
      <Pagination
        total={this.state.data.length}
        activePage={this.state.activePage}
        size = {this.props.pageSize}
        onPage={this.handlePageChange}
        />
    );
  }

  componentWillReceiveProps(nextProps) {
    // 当 <DataTable /> 组件的 searchText 属性发生变化的时候将 searchText 存入 store
    // 中并且触发 store 中的搜索函数并且设定当前 state 中的数据为搜索后的结果
    if(nextProps.searchText !== this.store.searchText) {
      this.store.setSearchText(nextProps.searchText);
      this.setState({
        data: this.store.getCurrentData(),
        activePage: 1 // 还原分页值，避免饭呢也数由少变多的时候失去 active 状态
      });
    }
  }

  render () {
    const {hover, data, children} = this.props;

    const cols = this.getColumns().map((column, index) => {
      // 根据 <Column /> 中的配置信息设定列的格式
      return (
        <col key={column.index} style={{width: column.width}} />
      );
    });

    const ths = this.getTableHeaders();
    const tbody = this.renderTbody();
    const pagination = this.renderPagination();

    const tableClass = classname({
      'data-table': true,
      'data-table-hover': hover
    });

    return (
      <div>
        <div style={style.wrapper}>
          <table className={tableClass}>
            <colgroup>{cols}</colgroup>

            <thead>
              <tr>{ths}</tr>
            </thead>

            <tbody>{tbody}</tbody>
          </table>
        </div>
        {pagination}
      </div>
    );
  }
}

export default DataTable;
