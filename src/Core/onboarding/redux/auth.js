const UPDATE_USER = 'UPDATE_USER';
const LOG_OUT = 'LOG_OUT';
const SET_USERS = 'SET_USERS';
const SET_DATE_ONE_INFO = 'SET_DATE_ONE_INFO';
const SET_DATE_TWO_INFO = 'SET_DATE_TWO_INFO';
const SET_ONSECONDDATE = 'SET_ONSECONDDATE';
const SET_DATE_ORDER = 'SET_DATE_ORDER';
const SET_TIMER = 'SET_TIMER';

export const DUMMY_USER_DATA = {};

export const setUsers = (data) => ({
  type: SET_USERS,
  data,
});

export const setUserData = (data) => ({
  type: UPDATE_USER,
  data,
});

export const setOnSecondDate = () => ({
  type: SET_ONSECONDDATE,
});

export const setDateOrder = (isSafeFirst) => ({
  type: SET_DATE_ORDER,
  isSafeFirst: isSafeFirst,
});

export const setTimer = (seconds) => ({
  type: SET_TIMER,
  timer: seconds,
});

export const setDateOne = (id, name, url) => ({
  type: SET_DATE_ONE_INFO,
  id: id,
  name: name,
  url: url,
});

export const setDateTwo = (id, name, url) => ({
  type: SET_DATE_TWO_INFO,
  id: id,
  name: name,
  url: url,
});

export const logout = () => ({
  type: LOG_OUT,
});

const initialState = {
  user: DUMMY_USER_DATA,
  users: [],
  dateOneId: 'firstdateID',
  dateOneName: 'firstdatename',
  dateOneUrl: 'first date http',
  dateTwoId: 'seconddateID',
  dateTwoName: 'seconddatename',
  dateTwoUrl: 'second date http',
  onSecondDate: false,
  isSafeFirst: true,
};

export const auth = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_USER:
      return {
        ...state,
        user: action.data.user,
      };
    case SET_USERS:
      return { ...state, users: [...action.data] };
    case LOG_OUT: {
      return initialState;
    }
    case SET_DATE_ONE_INFO: {
      // console.log(action.data);
      // console.log(initialState);
      return {
        ...state,
        dateOneId: action.id,
        dateOneName: action.name,
        dateOneUrl: action.url,
      };
    }
    case SET_DATE_TWO_INFO: {
      // console.log(action.data);
      // console.log(initialState);
      return {
        ...state,
        dateTwoId: action.id,
        dateTwoName: action.name,
        dateTwoUrl: action.url,
      };
    }
    case SET_ONSECONDDATE: {
      return {
        ...state,
        onSecondDate: true,
      };
    }
    case SET_DATE_ORDER: {
      return {
        ...state,
        isSafeFirst: action.isSafeFirst,
      };
    }
    case SET_TIMER: {
      return {
        ...state,
        timer: action.timer,
      };
    }
    default:
      return state;
  }
};
