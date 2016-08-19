# react-datatable
A simple data table implementaition by react.js, to replace the jQuery data table with simple usages.

## Install
Install dependencies.

```bash
npm install
```

## Usage

### `<DataTable />`

The following table is the parameters list for Component `<DataTable />`:

Pooperty     | Type      | Default Value | Description
-------------|-----------|---------------|----------------------------------------------------------
`hover`      | `boolean` | `true`        | The row will be highlighted when you move cursor above it
`data`       | `Array`   | []            | The data to list in the table
`search`     | `boolean` | `false`       | Enable to search all the keywords in the table
`searchText` | string    | `''`          | Provide a search interface to outer component
`pager`      | `boolean` | `false`       | Enable to just show the button 'previous' and 'next'

### `<Column />`

Property | Type                           | Default Value  | Description
---------|--------------------------------|----------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
`cell`   | `function(row, column, index)` | N/A            | A function accept three parameter: `row`, `column`, `index`, return a `React.Component`. `row` maps to a object in data array. `column` maps all the props of the current `<Column />`. `index` maps to the index of current row in the table.
`width`  | `string`                       | `auto`         | eg. `12px`, `20%`, `5rem`
`field`  | `string`                       | [**required**] | The corresponding key name of the column
`sort`   | `boolean`                      | true           | Enable the sort funtionality of current column

## Example

```javascript
const statusCell = (row, column, index) => {
  return (
    <div>
      row--{row[column.field]}
    </div>
  )
};

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
    Name
  </Column>
  <Column
    sort
    width="20%"
    field="modified_time"
    >
    Time
  </Column>
  <Column
    width="20%"
    field="status"
    cell={statusCell}
    >
    Status
  </Column>
</DataTable>
```
