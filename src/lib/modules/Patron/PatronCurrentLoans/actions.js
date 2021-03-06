import { loanApi } from '@api';
import { sendErrorNotification } from '@components/Notifications';
import { invenioConfig } from '@config';
import { HAS_ERROR, IS_LOADING, SUCCESS } from './types';

const selectQuery = (patronPid, page, size) => {
  return loanApi
    .query()
    .withPatronPid(patronPid)
    .withState(invenioConfig.circulation.loanActiveStates)
    .withPage(page)
    .withSize(size)
    .sortByNewest()
    .qs();
};

export const fetchPatronCurrentLoans = (
  patronPid,
  { page = 1, size = invenioConfig.defaultResultsSize } = {}
) => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });
    try {
      const response = await loanApi.list(selectQuery(patronPid, page, size));
      dispatch({
        type: SUCCESS,
        payload: response.data,
      });
    } catch (error) {
      dispatch({
        type: HAS_ERROR,
        payload: error,
      });
      dispatch(sendErrorNotification(error));
    }
  };
};
