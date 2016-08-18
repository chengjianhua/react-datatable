import React, { PropTypes } from 'react'
import classname from 'classname';

const MAX_LENGTH = 10;

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
        margin: '1rem auto'
      }
    };

    const {size, total, activePage} = this.props;
    const length = Math.ceil(total / size);
    const pageButtons = [];
    const previousPage = activePage === 1 ? 1: activePage - 1;
    const nextPage = activePage === length ? length : activePage + 1;


    const range = [3, length - 2];
    let middle = [];

    let b = Math.floor((MAX_LENGTH - 4) / 2);
    let a = b - 1;

    for(let index = activePage - a, length = activePage + b; index <= length; index++) {
      middle.push(index);
    }
    if(middle[0] <= 0) {
      let diff = Math.abs(middle[0] - 1);
      middle = middle.map(value => value + diff);
    }
    if(middle[middle.length - 1] > length) {
      let diff = Math.abs(middle[middle.length - 1] - length);
      middle = middle.map(value => value - diff);
    }
    console.log(middle[middle.length - 1]);
    console.log(middle);

    for(let index = 1; index <= length; index++) {
      const classes = classname({
        'pagination-button': true,
        'active': index === activePage
      });
      if(length <= MAX_LENGTH) {
        pageButtons.push(
          <li className={classes} key={index} onClick={this.handlePageButtonClick.bind(this, index)}><span>{index}</span></li>
        );
      } else {

        if([1,  length].includes(index)) {
          pageButtons.push(
            <li className={classes} key={index} onClick={this.handlePageButtonClick.bind(this, index)}><span>{index}</span></li>
          );
        } else {
          if(middle.includes(index)){
            if(index === middle[0] && middle[0] !== 2) {
              pageButtons.push(
                <li className={classes} key='ellipsis-left'>...</li>
              );
            }
            pageButtons.push(
              <li className={classes} key={index} onClick={this.handlePageButtonClick.bind(this, index)}><span>{index}</span></li>
            );
            if(index === middle[middle.length - 1] && middle[middle.length - 1] !== length - 1) {
              pageButtons.push(
                <li className={classes} key='ellipsis-right'>...</li>
              );
            }
          }


        }
      }
    }

    return (
      <div style={style.root}>
        <ul className="pagination">
          <li key="previous" className="pagination-button previous" onClick={this.handlePageButtonClick.bind(this, previousPage)}>{'<'}</li>
          {pageButtons}
          <li key="next" className="pagination-button next" onClick={this.handlePageButtonClick.bind(this, nextPage)}>{'>'}</li>
        </ul>
      </div>
    );
  }
}

export default Pagination;
