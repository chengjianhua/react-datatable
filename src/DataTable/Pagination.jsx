import React, { PropTypes } from 'react'
import classname from 'classname';
import {paginationButtons} from './utils/utils';

const BUTTONS_COUNT = 9;

class Pagination extends React.Component {

  constructor(props) {
    super(props);

    this.handlePageButtonClick = this.handlePageButtonClick.bind(this);
  }

  static propTypes = {
    total: PropTypes.number.isRequired,
    size: React.PropTypes.number,
    activePage: PropTypes.number
  };

  static defaultProps = {
    size: 20,
    activePage: 1
  };

  handlePageButtonClick(nextPage) {
    const {onPage} = this.props;
    onPage && onPage(nextPage);
  }

  render () {
    const style = {
      root: {
        width: '100%',
        position: 'relative',
        margin: '1rem auto',
        overflow: 'auto'
      },
      pagination: {
        float: 'right'
      }
    };

    const {size, total, activePage} = this.props;
    const length = Math.ceil(total / size);
    const previousPage = activePage === 1 ? 1: activePage - 1;
    const nextPage = activePage === length ? length : activePage + 1;

    const pageButtons = paginationButtons(BUTTONS_COUNT, activePage, length).map((value, index) => {
      const classes = classname({
        'pagination-button': true,
        'active': value + 1 === activePage
      });
      return (
        value === 'ellipsis' ? <li key={`ellipsis${index}`} className={classes}>...</li> :
          <li className={classes} key={value + 1} onClick={this.handlePageButtonClick.bind(this, value + 1)}><span>{value + 1}</span></li>
      );
    });

    return (
      <div style={style.root}>
        <ul style={style.pagination} className="pagination">
          <li key="previous" className="pagination-button previous" onClick={this.handlePageButtonClick.bind(this, previousPage)}>{'<'}</li>
          {pageButtons}
          <li key="next" className="pagination-button next" onClick={this.handlePageButtonClick.bind(this, nextPage)}>{'>'}</li>
        </ul>
      </div>
    );
  }
}

export default Pagination;
