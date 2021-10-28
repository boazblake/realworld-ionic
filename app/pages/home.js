import Http from "Http"
import { SkeletonText, Paginator, Articles, FeedNav } from "components"

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
      localStorage.setItem("toaster", true)
      mdl.toast = {
        show: true,
        duration: 2000,
        status: "danger",
        msg: error,
      }
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
      localStorage.setItem("toaster", true)
      mdl.toast = {
        show: true,
        duration: 2000,
        status: "danger",
        msg: error,
      }
    }

    state.feedStatus = "loading"
    getArticlesTask(Http)(mdl)(state)(mdl.data).fork(onError, onSuccess)
  }

  return {
    oninit: ({ attrs: { mdl } }) => loadInitData(mdl),
    view: ({ attrs: { mdl } }) => {
      return m(
        "ion-content",
        { scroll: false, id: "profile", contentId: "profile" },

        state.pageStatus == "success" && [
          m(
            "ion-list-header",
            // { slot: "fixed" },
            m(FeedNav, { fetchData: loadArticles, mdl, data: mdl.data })
          ),

          state.feedStatus == "success" && state.total
            ? [
                m(Articles, { mdl, data: mdl.data }),

                m(Paginator, {
                  mdl,
                  state,
                  fetchDataFor: (offset) => {
                    state.offset = offset
                    loadArticles(mdl)
                  },
                }),
              ]
            : "",
          console.log(state),
          state.feedStatus == "success" && !state.total
            ? m("ion-text", "No articles are here... yet.")
            : "",

          mdl.state.isLoggedIn() &&
            m(
              "ion-fab",
              {
                style: { padding: "0 50px 40px 0" },
                vertical: "bottom",
                horizontal: "end",
                slot: "fixed",
              },
              m(m.route.Link, { class: "nav-link", href: "/editor" }, [
                m("ion-fab-button", m("ion-icon", { name: "add-circle" })),
              ])
            ),
        ],

        (!mdl.state.isLoggedIn() && state.pageStatus == "loading") ||
          (state.feedStatus == "loading" &&
            m(SkeletonText, [m("h1.logo-font", `Loading Data`)])),

        !mdl.state.isLoggedIn() &&
          m(
            m.route.Link,
            {
              selector: "ion-fab",
              vertical: "center",
              horizontal: "end",
              slot: "fixed",
              href: "/login",
            },
            m("ion-fab-button", m("ion-icon", { name: "log-in-outline" }))
          ),

        state.pageStatus == "error" &&
          m(
            "ion-text",
            { color: "danger" },
            m("h1", `Error Loading Data: ${state.error}`)
          )
      )
    },
  }
}

export default Home
