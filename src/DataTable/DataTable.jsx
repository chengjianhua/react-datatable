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

  getColumns() {
    return React.Children.map(this.props.children, (child, index) => {
      const props = child.props;
      return Object.assign({}, child.props, {index});
    });
  }

  getTableHeaders() {
    return React.Children.map(this.props.children, (child, index) => {
      const {sort, field} = child.props;
      return React.cloneElement(child, {
        onSort: this.handleSort.bind(this, field),
        orderStatus: this.state.orderStatus
      });
    });
  }

  handleSort(sortField, order) {
    this.setState({
      data: this.store.sort(sortField, order).getCurrentData(),
      orderStatus: {
        field: sortField, order
      }
    });
  }

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
        return (
          <td key={`${rowIndex}-${columnIndex}`}>
            {row[column.field]}
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
    if(nextProps.searchText !== this.store.searchText) {
      this.store.setSearchText(nextProps.searchText);
      this.setState({
        data: this.store.getCurrentData(),
        activePage: 1
      });
    }
  }

  render () {
    const {hover, data, children} = this.props;

    const cols = this.getColumns().map((column, index) => {
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
