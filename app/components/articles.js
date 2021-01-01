import Http from "Http"
import { log, sanitizeImg } from "Utils"
import dayjs from "dayjs"
const favoriteArticleUrl = (slug) => `articles/${slug}/favorite`
const favoriteArticleTask = (http) => (mdl) => (slug) =>
  http.postTask(mdl)(favoriteArticleUrl(slug))()

const unFavoriteArticleTask = (http) => (mdl) => (slug) =>
  http.deleteTask(mdl)(favoriteArticleUrl(slug))

const ArticlePreview = ({ attrs: { mdl, article } }) => {
  let data = article
  const toggleArticleLike = (favorited, slug) => {
    const onError = log("toggleArticleLike err-art")
    const onSuccess = ({ article: { favorited, favoritesCount } }) => {
      data.favorited = favorited
      data.favoritesCount = favoritesCount
    }

    let toggle = favorited ? unFavoriteArticleTask : favoriteArticleTask
    toggle(Http)(mdl)(slug).fork(onError, onSuccess)
  }

  return {
    view: () => {
      return m(
        "ion-item",
        { button: true },
        m("ion-grid", [
          m(
            "ion-row.ion-justify-content-between.ion-align-items-end",
            m(
              "ion-col",
              m(
                m.route.Link,
                { class: "preview-link", href: `/article/${data.slug}` },
                m("ion-text", m("h1", data.title)),
                m("ion-text", m("p", data.description))
              )
            )
          ),
          m(
            "ion-row",
            m(
              "ion-col",
              m(
                "ion-list",
                { side: "end" },
                data.tagList.map((tag) => m("ion-chip", tag))
              )
            )
          ),
          m("ion-row.ion-justify-content-between.ion-align-items-end", [
            m(
              "ion-col",
              { size: 9 },
              m(
                "ion-item",
                {
                  lines: "none",
                  onclick: () =>
                    m.route.set(`/profile/${data.author.username}`, {
                      replace: true,
                    }),
                },
                m(
                  "ion-avatar",
                  { slot: "start" },
                  m("img", { src: sanitizeImg(data.author.image) })
                ),
                m(
                  "ion-label",
                  m("ion-text", m("h2", data.author.username)),
                  m("p", dayjs().format("MM/DD/YYYY HH:mm", data.createdAt))
                )
              )
            ),
            m(
              "ion-col",
              { size: 3 },
              m(
                "ion-item",
                {
                  lines: "none",
                  onclick: (e) => toggleArticleLike(data.favorited, data.slug),
                },

                m("ion-icon", {
                  color: "danger",
                  name: data.favorited ? "heart" : "heart-outline",
                }),
                m("ion-text", data.favoritesCount)
              )
            ),
          ]),
        ])
      )
    },
  }
}

export const Articles = () => {
  return {
    view: ({ attrs: { mdl, data } }) => {
      return data.articles.length
        ? m(
            "ion-list",
            { button: true },
            data.articles.map((article) =>
              m(ArticlePreview, { mdl, data, article })
            )
          )
        : m("p", "No articles are here... yet.")
    },
  }
}
