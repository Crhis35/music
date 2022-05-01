import { createRouter, createWebHistory } from 'vue-router';
import store from '../store';

const Home = () => import(/* webpackChunkName: "home" */ '@/views/Home.vue');
const Manage = () => import(/* webpackChunkName: "groupChunk" */ '@/views/Manage.vue');
const Song = () => import(/* webpackChunkName: "groupChunk" */ '@/views/Song.vue');
const About = () => import(/* webpackChunkName: "about" */ '@/views/About.vue');

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/manage-music',
    // alias: '/manage',
    name: 'Manage',
    component: Manage,
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: '/manage',
    redirect: {
      name: 'Manage',
    },
    // beforeEnter: (to, from, next) => {
    //   next();
    // },
  },
  {
    name: 'song',
    path: '/song/:id',
    component: Song,
  },
  {
    path: '/:catchAll(.*)*',
    redirect: {
      name: 'Home',
    },
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  linkExactActiveClass: 'text-yellow-500',
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some((route) => route.meta.requiresAuth);
  if (!requiresAuth) {
    next();
    return;
  }

  if (store.state.auth.userLoggedIn) {
    next();
  } else {
    next({
      name: 'Home',
    });
  }
});

export default router;
