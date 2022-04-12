import actionTypes from './actionTypes';

const initialState = {
  date1: 'namehere',
  date2: null,
};

export const gDate = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.ADD_DATE_1:
      return {
        ...state,
        date: action.date1,
      };
    default:
      return state;
  }
};
