import {createRouter, createWebHistory} from 'vue-router';
import HomeView from '../views/HomeView.vue';
import LoginView from '../views/LoginView.vue';
import store from '../store/index';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: HomeView,
            meta: {requiresAuth: true}
        },
        {
            path: '/login',
            name: 'login',
            component: LoginView
        }
    ]
});
router.beforeEach(async (to, from, next) => {
    const shouldAuth = to.matched.some(record => record.meta.requiresAuth);
    const isAuth = !!store.state.authToken;

    if (shouldAuth) {
        if (!isAuth) {
            next({name: 'login'});
        } else {
            next();
        }
    } else if (to.name === 'login' && isAuth) {
        next({name: 'home'});
    } else {
        next();
    }
});

export default router;