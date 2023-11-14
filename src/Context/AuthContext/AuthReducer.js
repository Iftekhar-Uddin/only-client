const AuthReducer = (state, action) => {
    switch (action.type) {

      case "LOGIN_START":
        return {
          user: null,
          isFetching: true,
          error: false,
        };

      case "LOGIN_SUCCESS":
        return {
          user: action.payload,
          isFetching: false,
          error: false,
        };

      case "LOGIN_FAILURE":
        return {
          user: null,
          isFetching: false,
          error: true,
        };

      // case "UPDATE_USER":
      //   return {
      //     user: action.payload,
      //     isFetching: false,
      //     error: false,
      //   };

      case "LOGOUT":
        localStorage.clear();
        return {
          user: null,
        }

      case "FOLLOW":
        return {
          ...state,
          user: {
            ...state.user,
            result: {...state.user.result,
              followings: [...state.user.result.followings, action.payload],
            },
          },
        };
          
      case "UNFOLLOW":
        return {
          ...state,
          user: {
            ...state.user,
            result: {
              ...state.user.result,
              followings: state.user.result.followings.filter(
                (following) => following !== action.payload
              ),
            },
          },
        };
      default:
      return state;
    }
};
export default AuthReducer;




// case "LOGOUT":
//   localStorage.clear();
//     return {
//       ...state,
//       user: null,
//     };

