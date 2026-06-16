import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import Index from '@/views/IndexView.vue'
import LoginIn from '@/views/LoginInView.vue'
import UserFavorite from '@/components/UserFavorite.vue'
import UserLike from '@/components/UserLike.vue'
import UserComposition from '@/components/UserComposition.vue'
import HotArticle from '@/views/HotArticle.vue'
import ArticleView from '@/components/ArticleView.vue'
import ArticleEditor from '@/components/ArticleEditor.vue'
import ArticleSearch from '@/components/ArticleSearch.vue'
import UserUpdate from '@/views/UserUpdate.vue'

const routes = [
  {
    path: '/',
    redirect: '/hot',
    name: 'index',
    component: Index,
    children: [
      {
        path: '/home',
        redirect: '/home/composition',
        name: 'home',
        component: () => import('@/views/Home.vue'),
        children: [
          {
            path: 'favorite',
            name: 'favorite',
            component: UserFavorite,
          },
          {
            path: 'like',
            name: 'like',
            component: UserLike,
          },
          {
            path: 'composition',
            name: 'composition',
            component: UserComposition,
          },
        ],
      },
      {
        path: '/hot',
        name: 'hot',
        component: HotArticle,
      },
      {
        path: '/article/:id',
        name: 'article',
        component: ArticleView,
      },
      {
        path: '/article/edit/:id?',
        name: 'articleEdit',
        component: ArticleEditor,
        props: true,
      },
      {
        path: '/user/update',
        name: 'userUpdate',
        component: UserUpdate,
      },
      {
        path: '/search',
        name: 'search',
        component: ArticleSearch,
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: LoginIn,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: routes,
})

// 导航守卫
router.beforeEach((to, from) => {
  const userStore = useUserStore()

  if (to.path !== '/login' && userStore.isLogin === false) {
    return '/login'
  }
})

export default router
