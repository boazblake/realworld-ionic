import Http from "Http"
import { Loader, FollowFavorite, Comments } from "components"
import md from "marked"

const getArticleTask = (http) => (mdl) => (slug) =>
  http.getTask(mdl)(`articles/${slug}`)

const Article = () => {
  const data = {}
  const state = {
    status: "loading",
    error: null,
  }

  const onSuccess = ({ article, comments }) => {
    data.article = article
    data.comments = comments
    state.status = "success"
  }

  const onError = (error) => {
    console.log("error", error)
    state.error = error
    state.status = "error"
  }

  const loadData = (mdl) => {
    state.status = "loading"
    getArticleTask(Http)(mdl)(mdl.slug).fork(onError, onSuccess)
  }

  return {
    oninit: ({ attrs: { mdl } }) => loadData(mdl),
    view: ({ attrs: { mdl } }) => [
      state.status == "loading" &&
        m(Loader, m("ion-text", m("h1", "Loading ..."))),

      state.status == "error" &&
        m(
          "ion-text",
          { color: "danger" },
          m("h1", `Error Loading Data: ${state.error}`)
        ),

      state.status == "success" && [
        m("ion-text", m("h1", data.article.title)),
        m("ion-text", m.trust(md(data.article.body))),
        data.article.tagList.map((tag) => m("ion-chip", tag)),
        m(FollowFavorite, {
          mdl,
          data: data.article,
        }),

        m(Comments, {
          mdl,
          comments: data.comments,
          reloadArticle: () => loadData(mdl),
        }),
      ],
    ],
  }
}

export default Article
