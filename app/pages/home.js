import Http from "Http"
import { Loader, Paginator, Articles, FeedNav } from "components"

const getArticlesTask = (http) => (mdl) => (state) => (data) =>
  data.tags.current == "feed"
    ? http.getTask(mdl)(`articles/feed?limit=20&offset=${state.offset}`)
    : http.getTask(mdl)(
        `articles?limit=20&offset=${state.offset}&tag=${data.tags.current}`
      )

const Home = () => {
  const state = {
    feedStatus: "loading",
    pageStatus: "loading",
    limit: 20,
    offset: 0,
    total: 0,
    error: null,
  }

  const loadInitData = (mdl) => {
    const onSuccess = ({ articles, articlesCount }) => {
      mdl.data.articles = articles
      state.total = articlesCount
      state.pageStatus = "success"
      state.feedStatus = "success"
    }

    const onError = (error) => {
      console.log("error", error)
      state.error = error
      state.pageStatus = "error"
    }
    state.pageStatus = "loading"
    getArticlesTask(Http)(mdl)(state)(mdl.data).fork(onError, onSuccess)
  }

  const loadArticles = (mdl) => {
    const onSuccess = ({ articles, articlesCount }) => {
      mdl.data.articles = articles
      state.total = articlesCount
      state.feedStatus = "success"
    }

    const onError = (error) => {
      console.log("error", error)
      state.error = error
      state.feedStatus = "error"
    }

    state.feedStatus = "loading"
    getArticlesTask(Http)(mdl)(state)(mdl.data).fork(onError, onSuccess)
  }

  return {
    oninit: ({ attrs: { mdl } }) => loadInitData(mdl),
    view: ({ attrs: { mdl } }) => {
      return [
        m(
          "ion-content",
          { scroll: false, id: "profile", contentId: "profile" },
          [
            (!mdl.state.isLoggedIn() && state.pageStatus == "loading") ||
              (state.feedStatus == "loading" &&
                m(Loader, [m("h1.logo-font", `Loading Data`)])),

            state.pageStatus == "error" &&
              m(
                "ion-text",
                { color: "earning" },
                m("h1", `Error Loading Data: ${state.error}`)
              ),

            state.pageStatus == "success" && [
              m(
                "ion-list-header",
                m(FeedNav, { fetchData: loadArticles, mdl, data: mdl.data })
              ),

              state.feedStatus == "success" &&
                state.total && [
                  m("ion-scroll", m(Articles, { mdl, data: mdl.data })),

                  m(Paginator, {
                    mdl,
                    state,
                    fetchDataFor: (offset) => {
                      state.offset = offset
                      loadArticles(mdl)
                    },
                  }),
                ],

              state.feedStatus == "success" &&
                !state.total &&
                m("ion-text", "No articles are here... yet."),

              mdl.state.isLoggedIn() &&
                m(
                  "ion-fab",
                  { vertical: "bottom", horizontal: "end", slot: "fixed" },
                  m(m.route.Link, { class: "nav-link", href: "/editor" }, [
                    m("ion-fab-button", m("ion-icon", { name: "add-circle" })),
                  ])
                ),
            ],
          ]
        ),
      ]
    },
  }
}

export default Home
