export const initialState = {
  currentUser: null,
  allUsers: [],
  allBikes: [],
  myReservations: [],
};
const reducer = (state, { type, payload }) => {
  switch (type) {
    case "SET_MULTIPLE_PROPS":
      return {
        ...state,
        ...payload,
      };

    case "SET_PROP":
      return {
        ...state,
        [payload.key]: payload.value,
      };
    case "UPDATE_USER": {
      let new_array = state.allUsers.map((element) =>
        element.email == payload.email
          ? { ...element, ...payload.updated }
          : element
      );

      return {
        ...state,
        [payload.key]: new_array,
      };
    }
    case "UPDATE_BIKE": {
      let new_array = state.allBikes.map((element) =>
        element.registrationId == payload.registrationId
          ? { ...element, ...payload.updated }
          : element
      );

      return {
        ...state,
        [payload.key]: new_array,
      };
    }
    case "EMPTY_STATE": {
      return {
        currentUser: null,
        allUsers: [],
        allBikes: [],
        myReservations: [],
      };
    }
    case "UPDATE_MY_RESERVATIONS": {
      let new_array = state.myReservations.map((element) =>
        element.id == payload.id ? { ...element, ...payload.updated } : element
      );

      return {
        ...state,
        [payload.key]: new_array,
      };
    }

    default:
      return state;
  }
};

export default reducer;
