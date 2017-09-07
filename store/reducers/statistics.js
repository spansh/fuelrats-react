import actionTypes from '../actionTypes'
import initialState from '../initialState'

import parseJSONAPIResponseForEntityType from '../../helpers/parse-json-api-response-for-entity-type'





export default function (state = initialState.statistics, action) {
  let {
    payload,
    status,
    type,
  } = action

  switch (type) {
    case actionTypes.GET_RESCUES_OVER_TIME:
      switch (status) {
        case 'success':
          return Object.assign({}, state, {
            loadingRescuesOverTime: false,
            rescuesOverTime: payload,
          })

        case 'error':
          return Object.assign({}, state, {
            loadingRescuesOverTime: false,
            rescuesOverTime: [],
          })

        default:
          return Object.assign({}, state, {
            loadingRescuesOverTime: true,
          })
      }

    default:
      return state
  }
}
