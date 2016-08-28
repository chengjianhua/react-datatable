/**
 * @author chengjianhua
 * @description 用来设置表格中一列数据的展示
 * @date 2016-8-15
 */
import React, {PropTypes} from 'react';
import classnames from 'classnames';
import {Order} from './utils/Constants';

class Column extends React.Component {
  constructor(props) {
    super(props);

    this.handleHeaderClick = this.handleHeaderClick.bind(this);

    this.state = {
      order: ''
    };
  }

  handleHeaderClick(event) {
    event.stopPropagation();

    const {sort, onSort} = this.props;

    sort && onSort && onSort(this.state.order);

    this.setState({
      order: this.state.order === Order.ASC ? Order.DESC : Order.ASC
    });
  }

  render() {
    const {children, sort, orderStatus, field} = this.props;
    const {order} = this.state;

    const classes = classnames({
      'sort-default': sort,
      'sort-asc': sort && orderStatus.field === field && order === Order.ASC,
      'sort-desc': sort && orderStatus.field === field && order === Order.DESC
    });

    return (
      <th className={classes} onClick={this.handleHeaderClick}>
        {children}
      </th>
    );
  }
}

Column.propTypes = {
  children: PropTypes.node,
  cell: PropTypes.func,
  width: PropTypes.string,
  field: PropTypes.string.isRequired,
  sort: PropTypes.bool
};

Column.defaultProps = {
  width: 'auto',
  sort: true
};

export default Column;
