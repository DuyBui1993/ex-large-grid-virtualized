import React from 'react'
import _ from 'lodash'

class VirtualizeGrid extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      gridRanges: []
    }
  }

  componentDidMount() {
    this._updateGridRange()
  }

  _updateGridRange = _.throttle((scrollTop = 0, scrollLeft = 0) => {
    const { columnCount, rowCount, columnWidth, rowHeight, width, height } = this.props
    let gridRanges = []
    const threshHold = 5
    const startColumnIndex = Math.max(Math.floor(Math.max(scrollLeft / columnWidth, 0)) - threshHold, 0)
    const stopColumnIndex = Math.min(startColumnIndex + Math.floor(width / columnWidth + threshHold * 3), columnCount)
    const startRowIndex = Math.max(Math.floor(Math.max(scrollTop / rowHeight, 0)) - threshHold, 0)
    const stopRowIndex = Math.min(startRowIndex + Math.floor(height / rowHeight + threshHold * 3), rowCount)
    for (let columnIndex = startColumnIndex; columnIndex < stopColumnIndex; columnIndex++) {
      for(let rowIndex = startRowIndex; rowIndex < stopRowIndex; rowIndex++) {
        const cell = {
          key: `${rowIndex}-${columnIndex}`,
          style: {
            position: 'absolute',
            left: columnIndex * columnWidth,
            top: rowIndex * rowHeight,
            width: columnWidth,
            height: rowHeight,
          },
          columnIndex,
          rowIndex
        }
        gridRanges.push(cell)
      }
    }
    this.setState({ gridRanges })
  }, 10)

  _handleScroll = (e) => {
    const { scrollTop, scrollLeft } = e.target
    this._updateGridRange(scrollTop, scrollLeft)
  }

  render() {
    const { gridRanges } = this.state
    const { cellRenderer, columnCount, columnWidth, rowCount, rowHeight, height, width, ...restProps } = this.props
    const maxWidth = columnWidth * columnCount
    const maxHeight = rowHeight * rowCount
    return (
      <div
        onScroll={this._handleScroll}
        style={{ height, width, position: 'relative', overflow: 'auto' }} className="ReactVirtualized__Grid">
        <div
          className="ReactVirtualized__Grid__innerScrollContainer"
          style={{
            maxWidth,
            maxHeight,
            width: maxWidth,
            height: maxHeight
          }}
          {...restProps}
        >
          {gridRanges.map(cell => {
            const { key, style, columnIndex, rowIndex } = cell
            const component = cellRenderer({ columnIndex, key, rowIndex, style })
            return component
          })}
        </div>
      </div>
    )
  }
}

export default VirtualizeGrid