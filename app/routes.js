import Layout from "./layout/index"
import Home from "./pages/home"
import Article from "./pages/article"
import Profile from "./pages/profile"
import Register from "./pages/register"
import Login from "./pages/login"
import User from "./pages/user"
import Editor from "./pages/editor"

const Routes = [
  { url: "/home", component: (mdl) => m(Layout, { mdl }, m(Home, { mdl })) },
  {
    url: "/editor",
    component: (mdl) => m(Layout, { mdl }, m(Editor, { mdl, key: mdl.slug })),
  },
  {
    url: "/editor/:slug",
    component: (mdl) => m(Layout, { mdl }, m(Editor, { mdl })),
  },
  {
    url: "/article/:slug",
    component: (mdl) => m(Layout, { mdl }, m(Article, { mdl })),
  },
  {
    url: "/profile/:slug",
    component: (mdl) => m(Layout, { mdl }, m(Profile, { mdl, key: mdl.slug })),
  },
  {
    url: "/settings/:slug",
    component: (mdl) => m(Layout, { mdl }, m(User, { mdl, key: mdl.slug })),
  },
  { url: "/login", component: (mdl) => m(Layout, { mdl }, m(Login, { mdl })) },
  {
    url: "/register",
    component: (mdl) => m(Layout, { mdl }, m(Register, { mdl })),
  },
]

export default Routes
