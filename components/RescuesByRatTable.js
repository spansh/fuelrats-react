// Module imports
import { bindActionCreators } from 'redux'
import * as d3 from 'd3'
import React from 'react'
import ReactTable from 'react-table'
import withRedux from 'next-redux-wrapper'





// Module imports
import {
  actions,
  initStore,
} from '../store'
import Component from './Component'





class RescuesByRatTable extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  async _getRescuesByRatStatistics () {
    await this.props.getRescuesByRatStatistics()
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    this._getRescuesByRatStatistics()
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      '_getRescuesByRatStatistics',
    ])
  }

  render () {
    let {
      loading,
      statistics,
    } = this.props

    return (
      <section className="panel">
        <ReactTable
          className="rescues-by-rat"
          columns={this.columns}
          data={statistics}
          loading={loading}
          manual
          showPagination={false} />
      </section>
    )
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get columns () {
    return [
      {
        accessor: datum => datum.attributes['user.displayRat.name'] || datum.attributes.rats[0],
        className: 'name',
        Header: 'Name',
        headerClassName: 'name',
        id: 'name',
        resizable: false,
        sortable: false,
      },
      {
        accessor: 'attributes.rescueCount',
        className: 'rescues',
        Header: 'Rescues',
        headerClassName: 'rescues',
        id: 'rescues',
        resizable: false,
        sortable: false,
        width: 100,
      },
    ]
  }
}





const mapDispatchToProps = dispatch => {
  return {
    getRescuesByRatStatistics: bindActionCreators(actions.getRescuesByRatStatistics, dispatch),
  }
}

const mapStateToProps = state => {
  let {
    loading,
    statistics,
  } = state.rescuesByRat

  return Object.assign({}, {
    loading,
    statistics,
  })
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(RescuesByRatTable)
