const AuthReducer = (state, action) => {
    switch (action.type) {
        case "LOGIN":
            if (action.payload.user && action.payload.idToken) {
                const newState = {
                    ...state,
                    currentUser: action.payload.user,
                    idToken: action.payload.idToken
                };
                return newState;
            } else {
                return state;
            }
        case "LOGOUT":
            return {
                ...state,
                currentUser: null,
                idToken: null
            }
        default:
            return state
    }
}

export default AuthReducer;