import {createStore} from 'vuex';

const store = createStore({
    state: {
        authToken: null,
        email: null,
        userInfo: null,
        dailySalesOverview: null,
        loginFailed: false,
        currency: null,
    },
    mutations: {
        setToken(state, {accessToken, email}) {
            state.authToken = accessToken;
            state.email = email;
            localStorage.setItem('authToken', accessToken);
            localStorage.setItem('email', email);
        },
        clearToken(state) {
            state.authToken = null;
            state.email = null;
            localStorage.removeItem('authToken');
            localStorage.removeItem('email');
            localStorage.removeItem('currency');
        },
        setUserInfo(state, userInfo) {
            state.userInfo = userInfo;
        },
        setDailySalesOverview(state, dailySalesOverview) {
            state.dailySalesOverview = dailySalesOverview;
        },
        setLoginFailed(state, value) {
            state.loginFailed = value;
        },
        setCurrency(state, currency) {
            state.currency = currency;
            localStorage.setItem('currency', currency);
        },
    },
    actions: {
        initStore({commit}) {
            const authToken = localStorage.getItem('authToken');
            const email = localStorage.getItem('email');
            if (authToken && email) {
                commit('setToken', {accessToken: authToken, email});
            }
        },
    },
});

// Initialize store when app starts
store.dispatch('initStore');

export default store;
