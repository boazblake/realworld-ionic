import Layout from "./layout/index"
import Home from "./pages/home"
import Article from "./pages/article"
import Profile from "./pages/profile"
import Register from "./pages/register"
import Login from "./pages/login"
import User from "./pages/user"
import Editor from "./pages/editor"

const Routes = [
  {
    url: "/home",
    config: { isAuth: false },
    component: (mdl) => m(Layout, { mdl }, m(Home, { mdl })),
  },
  {
    url: "/editor",
    config: { isAuth: true },
    component: (mdl) => m(Layout, { mdl }, m(Editor, { mdl, key: mdl.slug })),
  },
  {
    url: "/editor/:slug",
    config: { isAuth: true },
    component: (mdl) => m(Layout, { mdl }, m(Editor, { mdl })),
  },
  {
    url: "/article/:slug",
    config: { isAuth: true },
    component: (mdl) => m(Layout, { mdl }, m(Article, { mdl })),
  },
  {
    url: "/profile/:slug",
    config: { isAuth: true },
    component: (mdl) => m(Layout, { mdl }, m(Profile, { mdl, key: mdl.slug })),
  },
  {
    url: "/settings/:slug",
    config: { isAuth: true },
    component: (mdl) => m(Layout, { mdl }, m(User, { mdl, key: mdl.slug })),
  },
  {
    url: "/login",
    config: { isAuth: false },
    component: (mdl) => m(Layout, { mdl }, m(Login, { mdl })),
  },
  {
    url: "/register",
    config: { isAuth: false },
    component: (mdl) => m(Layout, { mdl }, m(Register, { mdl })),
  },
]

export default Routes
