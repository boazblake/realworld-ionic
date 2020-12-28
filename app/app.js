const toRouter = (mdl) => (Router, route) => {
  let matcher = () =>
    route.url.includes(":slug")
      ? mdl.state.isLoggedIn()
        ? ({ slug }) => {
            mdl.slug = slug
          }
        : () => m.route.set("/login")
      : (_, b) => {
          mdl.slug = b
        }

  Router[route.url] = {
    onmatch: matcher(),
    render: () => route.component(mdl),
  }
  return Router
}

const App = (mdl) => mdl.Routes.reduce(toRouter(mdl), {})

export default App
