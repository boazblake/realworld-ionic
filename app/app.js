const toRouter = (mdl) => (Router, route) => {
  let matcher = route.url.includes(":slug")
    ? mdl.state.isLoggedIn("MATCHER")
      ? ({ slug }) => {
          mdl.slug = slug
        }
      : () => m.route.set("/login")
    : (_, b) => {
        mdl.slug = b
        // console.log(
        //   "login",
        //   mdl,
        //   mdl.state.isLoggedIn("MATCHER - slug"),
        //   localStorage.getItem("token")
        // )
      }

  let renderer = () => {
    return route.config.isAuth
      ? mdl.state.isLoggedIn("RENDERER")
        ? route.component(mdl)
        : m.route.set("/login")
      : route.component(mdl)
  }

  Router[route.url] = {
    onmatch: matcher,
    render: renderer,
  }

  // console.log("stringRouter", JSON.stringify(Router, null, 4))
  return Router
}

const App = (mdl) => mdl.Routes.reduce(toRouter(mdl), {})

export default App
