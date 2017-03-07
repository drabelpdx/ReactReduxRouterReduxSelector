const INIT_APP = 'INIT_APP';
const INITIAL_STATE = {};

export const initializeApp = () => ({ type: INIT_APP });

const reducer = (state = INITIAL_STATE, action) => {
  switch (action.payload) {
    case INIT_APP:
      return {...state, appInitialized: true };
    default:
      return state;
  }
};

export default reducer;
