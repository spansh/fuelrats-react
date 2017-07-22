// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Link from 'next/link'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Module imports
import {
  actions,
  initStore,
} from '../store'
import Component from './Component'





class UserRatsPanel extends Component {

  /***************************************************************************\
    Private Methods
  \***************************************************************************/

  _renderRats (rats) {
    return rats.map((rat, index) => {
      let {
        id,
      } = rat
      let {
        name,
        platform,
      } = rat.attributes

      let badgeClasses = ['badge', 'platform', 'short', platform].join(' ')

      return (
        <li key={index}>
          <div className={badgeClasses}></div>

          <Link href={`/rats/${id}`}>
            <a>{name}</a>
          </Link>
        </li>
      )
    })
  }





  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentWillMount () {
    let {
      CMDRs,
      getRats,
      rats,
    } = this.props

    if (CMDRs && !rats) {
      getRats(CMDRs)
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods(['onSubmit'])

    this.state = {
      name: '',
      platform: 'pc',
      submitting: false,
    }
  }

  async onSubmit (event) {
    let {
      createRat,
    } = this.props
    let {
      name,
      platform,
    } = this.state

    event.preventDefault()

    this.setState({ submitting: true })

    let rat = {
      name,
      platform
    }

    await this.props.createRat(rat)
  }

  render () {
    let {
      id,
      rats,
    } = this.props
    let {
      name,
      platform,
      submitting,
    } = this.state

    return (
      <div className="panel user-rats">
        <header>Rats</header>

        <div className="panel-content">
          <div className="row">
            {!rats.retrieving && (
              <ul>{this._renderRats(rats.rats)}</ul>
            )}

            {rats.retrieving && 'Loading rat info...'}
          </div>

          <form
            className="row"
            onSubmit={this.onSubmit}>

            <div className="input-group stretch-9">
              <input
                disabled={submitting}
                name="add-rat"
                onChange={event => this.setState({ name: event.target.value })}
                placeholder="Add a rat..."
                type="text" />

              <input
                defaultChecked={platform === 'pc'}
                hidden
                id="platform-pc"
                name="platform"
                onChange={event => this.setState({ platform: event.target.value })}
                type="radio"
                value="pc" />
              <label
                className="button"
                htmlFor="platform-pc">
                PC
              </label>

              <input
                defaultChecked={platform === 'xb'}
                hidden
                id="platform-xb"
                name="platform"
                onChange={event => this.setState({ platform: event.target.value })}
                type="radio"
                value="xb" />
              <label
                className="button"
                htmlFor="platform-xb">
                XB
              </label>

              <input
                defaultChecked={platform === 'ps'}
                hidden
                id="platform-ps"
                name="platform"
                onChange={event => this.setState({ platform: event.target.value })}
                type="radio"
                value="ps" />
              <label
                className="button"
                htmlFor="platform-ps">
                PS
              </label>
            </div>

            <button
              disabled={!name || submitting}
              type="submit">Add</button>
          </form>
        </div>
      </div>
    )
  }
}





const mapDispatchToProps = dispatch => {
  return {
    createRat: bindActionCreators(actions.createRat, dispatch),
  }
}

const mapStateToProps = state => {
  let {
    rats,
    user,
  } = state

  return {
    rats,
    user,
  }
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(UserRatsPanel)
