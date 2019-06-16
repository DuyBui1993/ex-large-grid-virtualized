import 'react-virtualized/styles.css'
import React from 'react'
// import { Grid } from 'react-virtualized'
import Grid from './VirtualizeGrid'
import _min from 'lodash/min'
import _max from 'lodash/max'
import { HARD_DATA, SCHEMA } from '../utils/LargeTable'

class CustomGrid extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      selecteds: [],
      isDragSelection: false,
      startSelected: null
    }
  }

  render() {
    return (
      <div
        onMouseUp={() => {
          this.setState({
            isDragSelection: false,
            startSelected: null
          })
        }}
        onMouseDown={(e) => {
          if (e.target && e.target.classList[1] && e.target.classList[1].includes('cell-')) {
            const currentSelected = e.target.classList[1]
            const [_, rowIndex, columnIndex] = currentSelected.split('-')
            if (this.state.startSelected === null) {
              this.setState({
                startSelected: `${rowIndex}-${columnIndex}`,
                selecteds: []
              })
            }
            this.setState({
              isDragSelection: true,
            })
          }
        }}
        onMouseMove={(e) => {
          if (!this.state.isDragSelection) return
          if (e.target && e.target.classList[1] && e.target.classList[1].includes('cell-')) {
            const currentSelected = e.target.classList[1]
            const [_, rowIndex, columnIndex] = currentSelected.split('-')
            const [startRowIndex, startColIndex] = this.state.startSelected.split('-')
            const minRowIndex = _min([Number(rowIndex), Number(startRowIndex)])
            const maxRowIndex = _max([Number(rowIndex), Number(startRowIndex)])
            const minColIndex = _min([Number(columnIndex), Number(startColIndex)])
            const maxColIndex = _max([Number(columnIndex), Number(startColIndex)])

            let newSelecteds = []
            for(let i = minRowIndex; i <= maxRowIndex; i++) {
              for(let j = minColIndex; j <= maxColIndex; j++) {
                newSelecteds.push(`${i}-${j}`)
              }
            }
            this.setState({
              selecteds: newSelecteds
            })
          }
        }}
      >
        <Grid
          cellRenderer={({ columnIndex, key, rowIndex, style }) => {
            return (
              <div
                key={key}
                className={`cell cell-${rowIndex}-${columnIndex} ${this.state.selecteds.includes(`${rowIndex}-${columnIndex}`) ? 'selected' : ''}`}
                style={style}
                onClick={() => {
                  this.setState({
                    selecteds: [`${rowIndex}-${columnIndex}`]
                  })
                }}
              >
                {HARD_DATA[rowIndex][columnIndex]}
              </div>
            )
          }}
          columnCount={SCHEMA.length}
          columnWidth={window.innerWidth / 5 - 25}
          rowCount={HARD_DATA.length}
          rowHeight={30}
          height={window.innerHeight}
          width={window.innerWidth}
        /> 
      </div>
    )
  }
}

export default CustomGrid