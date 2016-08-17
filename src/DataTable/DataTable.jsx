import React, {Component, PropTypes} from 'react';
import classname from 'classname';
import Column from './Column';

import Store from './utils/Store';

const style = {
  container: {
    width: '100%'
  }
};

class DataTable extends Component {

  static propTypes = {
    children: PropTypes.arrayOf(PropTypes.instanceOf(Column))
  };

  constructor(props) {
    super(props);

    this.store = new Store(props.data.slice());

    this.getColumns = this.getColumns.bind(this);
    this.initTable = this.initTable.bind(this);
    this.renderTbody = this.renderTbody.bind(this);
    this.getInitialData = this.getInitialData.bind(this);
    this.getTableHeaders = this.getTableHeaders.bind(this);
    this.handleSort = this.handleSort.bind(this);

    // initialize the table
    this.initTable();

    this.state = {
      data: this.getInitialData(),
      orderStatus: this.store.getSortInfo()
    };
  }

  initTable() {
    /* START: 将 Column 中需要用到的数据存储到 store 中 */
    this.store.setColumns(this.getColumns().reduce((prev, curr) => {
        // 将每一列的列信息以列的 field 字段作为键，值为列的所有属性的集合来存储
        prev[curr.field] = curr;
        return prev;
      }, {}));
    /* END: 将 Column 中需要用到的数据存储到 store 中 */


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

  getInitialData() {
    const data = this.store.getCurrentData();
    return data;
  }

  handleSort(sortField, order) {

    this.setState({
      data: this.store.sort(sortField, order).getCurrentData(),
      orderStatus: {
        field: sortField, order
      }
    });
  }

  renderTbody() {
    return this.state.data.map((row, rowIndex) => {
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

  render () {
    const {hover, data, children} = this.props;
    const cols = this.getColumns().map((column, index) => {
      const {width, field} = column;
      return (
        <col key={index} style={{width: width}} />
      );
    });

    const ths = this.getTableHeaders();

    const tbody = this.renderTbody();

    const tableClass = classname({
      'data-table': true,
      'data-table-hover': hover
    });

    return (
      <table className={tableClass}>
        <colgroup>{cols}</colgroup>

        <thead>
          <tr>{ths}</tr>
        </thead>

        <tbody>{tbody}</tbody>
      </table>
    );
  }
}

export default DataTable;
