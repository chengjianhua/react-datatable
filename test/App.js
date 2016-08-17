import React, { Component } from 'react';
import {DataTable, Column} from '../src/DataTable';
import data from './data';

export default class App extends Component {
  render() {
    const style = {
      container: {
        width: '100%',
        textAlign: 'center'
      }
    };

    return (
      <div>
        <h1>Hello, world.</h1>
        <DataTable
          hover
          data={data.data.task_list}
          >
          <Column
            sort
            width="30%"
            field="name"
            >
            名称
          </Column>
          <Column
            sort
            width="70%"
            field="modified_time"
            >
            创建时间
          </Column>
        </DataTable>
      </div>
    );
  }
}
