const toRouter = (mdl) => (Router, route) => {
  let matcher =
    // mdl.state.isLoggedIn("MATCHER")
    route.url.includes(":slug")
      ? ({ slug }) => {
          mdl.slug = slug
        }
      : (_, b) => {
          mdl.slug = b
          // console.log(
          //   "login",
          //   mdl,
          //   mdl.state.isLoggedIn("MATCHER - slug"),
          //   localStorage.getItem("token")
          // )
        }
  // : () => m.route.set("/login")

  let renderer = () => {
    // console.log(
    //   "renderer",
    //   mdl,
    //   mdl.state.isLoggedIn("RENDERER "),
    //   localStorage.getItem("token")
    // )
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
