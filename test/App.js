import React, { Component } from 'react';
import {DataTable, Column} from '../src/DataTable';
import data from './data';

export default class App extends Component {
  constructor(props) {
    super(props);

    this.handleSearchChange = this.handleSearchChange.bind(this);

    this.state = {
      query: ''
    }
  }

  handleSearchChange(event) {
    this.setState({
      query: event.target.value
    });
  }

  render() {
    const style = {
      root: {
        width: '50%',
        textAlign: 'center'
      },
      searchBox: {
        width: '50%',
        margin: '1rem auto',
      },
      input: {
        border: '1px #657 solid',
        width: '100%',
        height: '2rem',
        lineHeight: '2rem',
        fontSize: '1.5rem'
      }
    };

    const statusCell = (row, column, index) => {
      return (
        <div>
          row--{row[column.field]}
        </div>
      )
    };

    return (
      <div style={style.root}>
        <h1>Hello, world.</h1>
        <div style={style.searchBox}>
          <input style={style.input} value={this.state.query} onChange={this.handleSearchChange} />
        </div>
        <DataTable
          hover
          data={data.data.task_list}
          search
          searchText={this.state.query}
          >
          <Column
            sort
            width="60%"
            field="name"
            >
            名称
          </Column>
          <Column
            sort
            width="20%"
            field="modified_time"
            >
            创建时间
          </Column>
          <Column
            width="20%"
            field="status"
            cell={statusCell}
            >
            状态
          </Column>
        </DataTable>
      </div>
    );
  }
}
