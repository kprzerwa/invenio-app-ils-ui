import { IS_LOADING, SUCCESS, HAS_ERROR } from './types';
import {
  DETAILS_SUCCESS as FETCH_LOAN_SUCCESS,
  DETAILS_IS_LOADING as FETCH_LOAN_IS_LOADING,
} from '@modules/Loan/actions';
import { itemApi, loanApi } from '@api';
import { invenioConfig } from '@config';
import { sendErrorNotification } from '@components/Notifications';

export const fetchAvailableItems = documentPid => {
  return async dispatch => {
    dispatch({
      type: IS_LOADING,
    });

    await itemApi
      .list(
        itemApi
          .query()
          .withDocPid(documentPid)
          .withStatus(invenioConfig.items.canCirculateStatuses)
          .availableForCheckout()
          .qs()
      )
      .then(response => {
        dispatch({
          type: SUCCESS,
          payload: response.data,
        });
      })
      .catch(error => {
        dispatch({
          type: HAS_ERROR,
          payload: error,
        });
        dispatch(sendErrorNotification(error));
      });
  };
};

export const assignItemToLoan = (itemId, loanId) => {
  return async dispatch => {
    dispatch({
      type: FETCH_LOAN_IS_LOADING,
    });
    await loanApi
      .assignItemToLoan(itemId, loanId)
      .then(response => {
        dispatch({
          type: FETCH_LOAN_SUCCESS,
          payload: response.data,
        });
      })
      .catch(error => {
        dispatch({
          type: HAS_ERROR,
          payload: error,
        });
        dispatch(sendErrorNotification(error));
      });
  };
};
