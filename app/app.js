const toRouter = (mdl) => (Router, route) => {
  let match = route.url.includes(":slug")
    ? mdl.state.isLoggedIn()
      ? ({ slug }) => {
          mdl.slug = slug
        }
      : () => m.route.set("/login")
    : (_, b) => {
        mdl.slug = b
      }

  Router[route.url] = {
    onmatch: match,
    render: () => route.component(mdl),
  }
  return Router
}

const App = (mdl) => mdl.Routes.reduce(toRouter(mdl), {})

export default App
