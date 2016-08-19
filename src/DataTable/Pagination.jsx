import React, {PropTypes} from 'react';
import classnames from 'classnames';
import {paginationButtons} from './utils/utils';
import {PAGE_SIZE, BUTTONS_COUNT} from './utils/Constants';

class Pagination extends React.Component {
  constructor(props) {
    super(props);

    this.handlePageButtonClick = this.handlePageButtonClick.bind(this);
    this.renderPagination = this.renderPagination.bind(this);
  }

  static propTypes = {
    total: PropTypes.number.isRequired,
    size: React.PropTypes.number,
    activePage: PropTypes.number,
    pager: PropTypes.bool
  };

  static defaultProps = {
    size: PAGE_SIZE,
    activePage: 1,
    pager: false
  };

  handlePageButtonClick(nextPage) {
    const {onPage} = this.props;
    onPage && onPage(nextPage);
  }

  renderPagination() {
    const {size, total, activePage, pager} = this.props;
    const length = Math.ceil(total / size);
    const previousPage = activePage === 1 ? 1 : activePage - 1;
    const nextPage = activePage === length ? length : activePage + 1;
    let pageButtons = [];

    pageButtons.push(
      <li key="previous" className="pagination-button previous" onClick={this.handlePageButtonClick.bind(this, previousPage)}>{'<'}</li>
    );

    if (!pager) {
      const pageNumbers = paginationButtons(BUTTONS_COUNT, activePage, length).map((value, index) => {
        const classes = classnames({
          'pagination-button': true,
          'active': (value + 1) === activePage //eslint-disable-line
        });
        return (
          value === 'ellipsis' ? <li key={`ellipsis${index}`} className={classes}>...</li> :
            <li className={classes} key={value + 1} onClick={this.handlePageButtonClick.bind(this, value + 1)}><span>{value + 1}</span></li>
        );
      });

      pageButtons = pageButtons.concat(pageNumbers);
    }

    pageButtons.push(
      <li key="next" className="pagination-button next" onClick={this.handlePageButtonClick.bind(this, nextPage)}>{'>'}</li>
    );

    return pageButtons;
  }

  render() {
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

    const pageButtons = this.renderPagination();

    return (
      <div style={style.root}>
        <ul style={style.pagination} className="pagination">
          {pageButtons}
        </ul>
      </div>
    );
  }
}

export default Pagination;
