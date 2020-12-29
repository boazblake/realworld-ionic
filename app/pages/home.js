import Http from "Http"
import { Loader, Paginator, Articles, FeedNav, TagList } from "components"

const getTagsTask = (http) => (mdl) => http.getTask(mdl)("tags")
const getArticlesTask = (http) => (mdl) => (state) => (data) =>
  data.tags.current == "feed"
    ? http.getTask(mdl)(`articles/feed?limit=20&offset=${state.offset}`)
    : http.getTask(mdl)(
        `articles?limit=20&offset=${state.offset}&tag=${data.tags.current}`
      )

const loadDataTask = (http) => (mdl) => (state) => (data) =>
  Task.of((tags) => (articles) => ({ ...tags, ...articles }))
    .ap(getTagsTask(http)(mdl))
    .ap(getArticlesTask(http)(mdl)(state)(data))

const Home = () => {
  const data = {
    tags: { tagList: [], selected: [], current: "" },
    articles: {},
  }
  const state = {
    feedStatus: "loading",
    pageStatus: "loading",
    limit: 20,
    offset: 0,
    total: 0,
    error: null,
  }

  const loadInitData = (mdl) => {
    const onSuccess = ({ articles, articlesCount, tags }) => {
      data.articles = articles
      state.total = articlesCount
      data.tags.tagList = tags
      state.pageStatus = "success"
      state.feedStatus = "success"
    }

    const onError = (error) => {
      console.log("error", error)
      state.error = error
      state.pageStatus = "error"
    }
    state.pageStatus = "loading"
    loadDataTask(Http)(mdl)(state)(data).fork(onError, onSuccess)
  }

  const loadArticles = (mdl) => {
    const onSuccess = ({ articles, articlesCount }) => {
      data.articles = articles
      state.total = articlesCount
      state.feedStatus = "success"
    }

    const onError = (error) => {
      console.log("error", error)
      state.error = error
      state.feedStatus = "error"
    }

    state.feedStatus = "loading"
    getArticlesTask(Http)(mdl)(state)(data).fork(onError, onSuccess)
  }

  return {
    oninit: ({ attrs: { mdl } }) => loadInitData(mdl),
    view: ({ attrs: { mdl } }) => {
      return [
        m("ion-content", { id: "profile", contentId: "profile" }, [
          (!mdl.state.isLoggedIn() && state.pageStatus == "loading") ||
            (state.feedStatus == "loading" &&
              m(Loader, [m("h1.logo-font", `Loading Data`)])),

          state.pageStatus == "error" &&
            m(Banner, [
              m("h1.logo-font", `Error Loading Data: ${state.error}`),
            ]),

          state.pageStatus == "success" && [
            m(FeedNav, { fetchData: loadArticles, mdl, data }),

            state.feedStatus == "success" &&
              state.total && [
                m(Articles, { mdl, data }),

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

            m(TagList, { mdl, data }),
          ],
        ]),
      ]
    },
  }
}

export default Home
