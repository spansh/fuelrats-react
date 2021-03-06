// Module imports
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import Router from 'next/router'
import React from 'react'
import withRedux from 'next-redux-wrapper'





// Component imports
import {
  actions,
  initStore,
} from '../../store'
import Component from '../../components/Component'
import Page from '../../components/Page'
import FirstLimpetInput from '../../components/FirstLimpetInput'
import RatTagsInput from '../../components/RatTagsInput'
import SystemTagsInput from '../../components/SystemTagsInput'





class Paperwork extends Component {

  /***************************************************************************\
    Public Methods
  \***************************************************************************/

  componentDidMount () {
    let { id } = this.props

    if (id) {
      this.props.retrievePaperwork(id)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (nextProps.rescue !== this.props.rescue) {
      this.setState({
        firstLimpet: nextProps.firstLimpet,
        rats: nextProps.rats,
        rescue: nextProps.rescue,
      })
    }
  }

  constructor (props) {
    super(props)

    this._bindMethods([
      'onSubmit',
      'handleChange',
      'handleFirstLimpetChange',
      'handleRatsChange',
      'handleSystemChange',
    ])

    this.state = {
      firstLimpet: props.firstLimpet,
      rats: props.rats,
      rescue: props.rescue || {
        attributes: {
          codeRed: false,
          notes: '',
          outcome: 'success',
          platform: 'pc',
          system: null,
        },
      },
    }
  }

  static async getInitialProps ({ query }) {
    let { id } = query

    if (id) {
      return { id }
    }

    return {}
  }

  handleChange (event) {
    let newState = Object.assign({}, this.state)
    let {
      checked,
      name,
      type,
      value,
    } = event.target
    let attribute = name

    value = type === 'checkbox' ? checked : value

    if (value === 'true') {
      value = true

    } else if (value === 'false') {
      value = false
    }

    newState.rescue.attributes[attribute] = value

    if (attribute === 'platform') {
      newState.firstLimpet = null
      newState.rats = []
      newState.rescue.attributes.firstLimpetId = null
    }

    this.dirtyFields.add(attribute)

    this.setState(newState)
  }

  handleFirstLimpetChange (value) {
    let originalFirstLimpetId = this.props.rescue.attributes.firstLimpetId

    let isDifferent = value.length && (value[0].id !== originalFirstLimpetId)
    let isRemoved = !value.length && (originalFirstLimpetId !== null)

    if (isDifferent || isRemoved) {
      let newState = Object.assign({}, this.state)

      newState.firstLimpet = isRemoved ? null : value[0]
      newState.rescue.attributes.firstLimpetId = isRemoved ? null : value[0].id

      this.setState(newState)
      this.dirtyFields.add('firstLimpetId')
    }
  }

  handleRatsChange (value) {
    let newRatIds = value.map(rat => rat.id)
    let oldRatIds = this.props.rats.map(rat => rat.id)

    if (newRatIds.join(',') !== oldRatIds.join(',')) {
      let newState = Object.assign({}, this.state)

      newState.rats = value

      if (!value.find(rat => newState.rescue.attributes.firstLimpetId === rat.id)) {
        newState.firstLimpet = null
        newState.rescue.attributes.firstLimpetId = null
      }

      this.setState(newState)
      this.dirtyFields.add('rats')
    }
  }

  handleSystemChange (value) {
    let {
      rescue,
    } = this.props

    if (value[0].value !== rescue.attributes.system) {
      let newState = Object.assign({}, this.state)

      newState.rescue.attributes.system = value[0].value

      this.setState(newState)
      this.dirtyFields.add('system')
    }
  }

  async onSubmit (event) {
    event.preventDefault()

    let {
      firstLimpet,
      rats,
      rescue,
    } = this.state
    let ratUpdates = null
    let rescueUpdates = {}

    for (let field of this.dirtyFields) {
      if (field !== 'rats') {
        rescueUpdates[field] = rescue.attributes[field]
      }
    }

    if (this.dirtyFields.has('rats')) {
      let oldRats = rescue.relationships.rats.data

      ratUpdates = {
        added: rats.filter(rat => !oldRats.find(oldRat => rat.id === oldRat.id)),
        removed: oldRats.filter(oldRat => !rats.find(rat => oldRat.id === rat.id)),
      }
    }

    await this.props.submitPaperwork(rescue.id, rescueUpdates, ratUpdates)

    this.dirtyFields.clear()

    location = `/paperwork/${rescue.id}`
  }

  render () {
    let {
      path,
      retrieving,
      submitting,
    } = this.props

    let {
      firstLimpet,
      rats,
      rescue,
    } = this.state

    let classes = ['page-content']

    if (submitting) {
      classes.push('loading', 'force')
    }

    return (
      <Page path={path} title={this.title}>
        <header className="page-header">
          <h2>{this.title}</h2>
        </header>

        {retrieving && (
          <form className="loading page-content" />
        )}

        {!retrieving && (
          <form
            className={classes.join(' ')}
            onSubmit={this.onSubmit}>
            <fieldset>
              <label>What platform was the rescue on?</label>

              <div className="option-group">
                <input
                  checked={rescue.attributes.platform === 'pc'}
                  disabled={submitting || retrieving}
                  id="platform-pc"
                  name="platform"
                  onChange={this.handleChange}
                  type="radio"
                  value="pc" /> <label htmlFor="platform-pc">PC</label>

                <input
                  checked={rescue.attributes.platform === 'xb'}
                  disabled={submitting || retrieving}
                  id="platform-xb"
                  name="platform"
                  onChange={this.handleChange}
                  type="radio"
                  value="xb" /> <label htmlFor="platform-xb">Xbox One</label>

                <input
                  checked={rescue.attributes.platform === 'ps'}
                  disabled={submitting || retrieving}
                  id="platform-ps"
                  name="platform"
                  onChange={this.handleChange}
                  type="radio"
                  value="ps" /> <label htmlFor="platform-ps">Playstation 4</label>
              </div>
            </fieldset>

            <fieldset>
              <label>Was the rescue successful?</label>

              <div className="option-group">
                <input
                  checked={rescue.attributes.outcome === 'success'}
                  disabled={submitting || retrieving}
                  id="outcome-success"
                  name="outcome"
                  onChange={this.handleChange}
                  type="radio"
                  value="success" /> <label htmlFor="outcome-success">Yes</label>

                <input
                  checked={rescue.attributes.outcome === 'failure'}
                  disabled={submitting || retrieving}
                  id="outcome-failure"
                  name="outcome"
                  onChange={this.handleChange}
                  type="radio"
                  value="failure" /> <label htmlFor="outcome-failure">No</label>
              </div>
            </fieldset>

            <fieldset>
              <label>Was it a code red?</label>

              <div className="option-group">
                <input
                  checked={rescue.attributes.codeRed}
                  disabled={submitting || retrieving}
                  id="codeRed-yes"
                  name="codeRed"
                  onChange={this.handleChange}
                  type="radio"
                  value={true} /> <label htmlFor="codeRed-yes">Yes</label>

                <input
                  checked={!rescue.attributes.codeRed}
                  disabled={submitting || retrieving}
                  id="codeRed-no"
                  name="codeRed"
                  onChange={this.handleChange}
                  type="radio"
                  value={false} /> <label htmlFor="codeRed-no">No</label>
              </div>
            </fieldset>

            <fieldset>
              <label htmlFor="rats">Who arrived for the rescue?</label>

              <RatTagsInput
                data-platform={rescue.attributes.platform}
                disabled={submitting || retrieving}
                name="rats"
                onChange={this.handleRatsChange}
                value={rats} />
            </fieldset>

            <fieldset>
              <label htmlFor="firstLimpet">Who fired the first limpet?</label>

              <FirstLimpetInput
                data-single
                disabled={submitting || retrieving}
                name="firstLimpet"
                onChange={this.handleFirstLimpetChange}
                options={rats}
                value={firstLimpet} />
            </fieldset>

            <fieldset>
              <label htmlFor="system">Where did it happen? <small>In what star system did the rescue took place? (put "n/a" if not applicable)</small></label>

              <SystemTagsInput
                disabled={submitting || retrieving}
                name="system"
                onChange={this.handleSystemChange}
                data-single
                value={(rescue && rescue.attributes) ? rescue.attributes.system : null} />
            </fieldset>

            <fieldset>
              <label htmlFor="notes">Notes</label>

              <textarea
                disabled={submitting || retrieving}
                id="notes"
                name="notes"
                onChange={this.handleChange}
                value={rescue.attributes.notes} />
            </fieldset>

            <menu type="toolbar">
              <div className="primary">
                <button
                  disabled={submitting || retrieving || !this.validate()}
                  type="submit">
                  {submitting ? 'Submitting...' : 'Submit'}
                </button>
              </div>

              <div className="secondary"></div>
            </menu>
          </form>
        )}
      </Page>
    )
  }

  validate () {
    let {
      rats,
      rescue,
    } = this.state

    if (!rats || !rats.length) {
      return false
    }

    if (!rescue.attributes.firstLimpetId) {
      return false
    }

    if (!rescue.attributes.system) {
      return false
    }

    return true
  }





  /***************************************************************************\
    Getters
  \***************************************************************************/

  get dirtyFields () {
    return this._dirtyFields || (this._dirtyFields = new Set)
  }

  get title () {
    return 'Paperwork'
  }
}





const mapDispatchToProps = dispatch => {
  return {
    submitPaperwork: bindActionCreators(actions.submitPaperwork, dispatch),
    retrievePaperwork: bindActionCreators(actions.retrievePaperwork, dispatch),
  }
}

const mapStateToProps = state => {
  let {
    paperwork,
  } = state
  let {
    rescueId,
  } = paperwork
  let firstLimpet = []
  let rats = []
  let rescue = null

  if (rescueId) {
    rescue = state.rescues.rescues.find(rescue => rescue.id === rescueId)
  }

  if (rescue) {
    if (rescue.relationships.firstLimpet.data) {
      firstLimpet = state.rats.rats.filter(rat => rescue.relationships.firstLimpet.data.id === rat.id)
    }

    rats = state.rats.rats
      .filter(rat => rescue.relationships.rats.data.find(({ id }) => rat.id === id))
      .map(rat => {
        return Object.assign({
          id: rat.id,
          value: rat.attributes.name,
        }, rat)
      })
  }

  return Object.assign({
    firstLimpet,
    rats,
    rescue,
  }, paperwork)
}





export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(Paperwork)
