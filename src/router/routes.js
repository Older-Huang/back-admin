import Login from 'views/login/Login'

const routes = [{
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/home',
        name: 'Home',
        component: () => import("views/home/Home"),
        redirect: '/welcome',
        children: [
            {
                path: '/welcome',
                name: 'Welcome',
                component: () => import("views/welcome/Welcome")
            }
        ]
    },
    {
        path: '*',
        component: () => import("views/NotFund")
    }
]

export default routes