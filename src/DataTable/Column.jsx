/**
 * @author chengjianhua
 * @description 用来设置表格中一列数据的展示
 * @date 2016-8-15
 */
import React, {PropTypes} from 'react';
import classname from 'classname';
import {Order} from './utils/Constants';

class Column extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    cell: PropTypes.func,
    width: PropTypes.string,
    field: PropTypes.string.isRequired,
    sort: PropTypes.bool,
  };

  static defaultProps = {
    width: 'auto',
    sort: true
  };

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

    onSort && onSort(this.state.order);

    this.setState({
      order: this.state.order === Order.ASC ? Order.DESC : Order.ASC
    });

  }

  render() {
    const {children, sort, orderStatus, field} = this.props;
    const {order} = this.state;

    const classes = classname({
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

export default Column;
