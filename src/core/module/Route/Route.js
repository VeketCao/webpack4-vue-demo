/**
 * Created by Veket on 2019/10/6.
 */
import VueRouter from 'vue-router';

import Home from '../Home/Home'
/*import Login from '../Login/Login'*/

Vue.use(VueRouter);

const routesMap = [
    {
        path: '/',redirect:'/home',
    },
    {
        path:'/login',
        name:'login',
        component: (resolve)=>{require(['../Login/Login.vue'],resolve)},
    },
    {
        path:'/home',
        name:'home',
        component:Home,
    }

];

const router = new VueRouter({
    mode: 'hash',
    base: __dirname,
    routes: routesMap
});

export default router