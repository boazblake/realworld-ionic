import Http from "Http"
import { log, sanitizeImg } from "Utils"

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
        m("ion-grid", [
          m(
            "ion-row",
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
          m("ion-row", [
            m(
              m.route.Link,
              {
                href: `/profile/${data.author.username}`,
                options: { replace: true },
              },
              m(
                "ion-avatar",
                { slot: "start" },
                m("img", { src: sanitizeImg(data.author.image) })
              )
            ),
            m(
              "ion-label",
              m("ion-text", m("h2", data.author.username)),
              m("p", data.createdAt)
            ),
            m(
              "ion-chip",
              {
                onclick: (e) => toggleArticleLike(data.favorited, data.slug),
              },
              [
                m("ion-icon", {
                  name: data.favorited
                    ? "heart-dislike-outline"
                    : "heart-outline",
                }),
                m("ion-text", data.favoritesCount),
              ]
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
            data.articles.map((article) =>
              m(ArticlePreview, { mdl, data, article })
            )
          )
        : m("p", "No articles are here... yet.")
    },
  }
}
