const toRouter = (mdl) => (Router, route) => {
  let matcher = route.url.includes(":slug")
    ? ({ slug }) => {
        mdl.slug = slug
      }
    : (_, b) => {
        mdl.slug = b
      }

  let renderer = () => {
    mdl.title = m.route.get().split("/")[1].toUpperCase()
    return route.config.isAuth
      ? mdl.state.isLoggedIn()
        ? route.component(mdl)
        : m.route.set("/login")
      : route.component(mdl)
  }
  Router[route.url] = {
    onmatch: matcher,
    render: renderer,
  }

  return Router
}

const App = (mdl) => mdl.Routes.reduce(toRouter(mdl), {})

export default App
