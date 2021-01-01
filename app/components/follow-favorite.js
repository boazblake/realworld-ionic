import Http from "Http"
import { log, sanitizeImg } from "Utils"

const deleteArticleUrl = (slug) => `articles/${slug}`
const favoriteArticleUrl = (slug) => `articles/${slug}/favorite`
const followAuthorUrl = (author) => `profiles/${author}/follow`

const deleteArticleTask = (http) => (mdl) =>
  http.deleteTask(mdl)(deleteArticleUrl(mdl.slug))

const favoriteArticleTask = (http) => (mdl) =>
  http.postTask(mdl)(favoriteArticleUrl(mdl.slug))()

const unFavoriteArticleTask = (http) => (mdl) =>
  http.deleteTask(mdl)(favoriteArticleUrl(mdl.slug))

const followAuthorTask = (http) => (mdl) => (author) =>
  http.postTask(mdl)(followAuthorUrl(author))()

const unFollowAuthorTask = (http) => (mdl) => (author) =>
  http.deleteTask(mdl)(followAuthorUrl(author))

export const FollowFavorite = ({ attrs: { mdl, data } }) => {
  const toggleArticleLike = ({ favorited }) => {
    const onError = log("toggleArticleLike err-art")
    const onSuccess = ({ article: { favorited, favoritesCount } }) => {
      data.favorited = favorited
      data.favoritesCount = favoritesCount
    }

    let toggle = favorited ? unFavoriteArticleTask : favoriteArticleTask
    toggle(Http)(mdl).fork(onError, onSuccess)
  }

  const toggleAuthorFollow = ({ author: { username, following } }) => {
    const onError = log("toggleAuthorFollow, err-auth")
    const onSuccess = ({ profile: { following } }) =>
      (data.author.following = following)

    let toggle = following ? unFollowAuthorTask : followAuthorTask
    toggle(Http)(mdl)(username).fork(onError, onSuccess)
  }

  const deleteArticle = (slug) => {
    const onError = log("deleteArticle, err-auth")
    const onSuccess = (s) => {
      console.log(s)
      m.route.set("/home")
    }
    deleteArticleTask(Http)(mdl).fork(onError, onSuccess)
  }

  return {
    view: ({
      attrs: {
        mdl,
        data: {
          author: { username, image, following },
          favoritesCount,
          favorited,
          slug,
        },
      },
    }) => {
      return m(
        "ion-grid",
        m("ion-row", [
          mdl.user.username == username
            ? [
                m(
                  "ion-button",
                  {
                    color: "light",
                    onclick: () => m.route.set(`/editor/${slug}`),
                  },
                  m("ion-icon", { name: "person" }),
                  m("ion-label", "Edit Article")
                ),
                m(
                  "ion-button",
                  { color: "danger", onclick: (e) => deleteArticle(slug) },
                  [
                    m("ion-icon", { name: "trash-outline" }),
                    m("ion-label", "Delete Article "),
                  ]
                ),
              ]
            : [
                m(
                  "ion-col",
                  { size: 5 },
                  m(
                    m.route.Link,
                    { href: `profile/${username}` },
                    m(
                      "ion-item",
                      {
                        lines: "none",
                      },
                      m(
                        "ion-avatar",
                        m("ion-img", { src: sanitizeImg(image) })
                      ),
                      m("ion-text", username)
                    )
                  )
                ),
                m(
                  "ion-col",
                  { size: 3 },
                  m(
                    "ion-item",
                    { lines: "none", onclick: (e) => toggleArticleLike(data) },
                    m("ion-icon", {
                      color: "danger",
                      name: favorited ? "heart" : "heart-outline",
                    }),
                    m("ion-label", favoritesCount)
                  )
                ),
                m(
                  "ion-col",
                  { size: 4 },
                  m(
                    "ion-item",
                    { lines: "none", onclick: (e) => toggleAuthorFollow(data) },
                    m("ion-icon", {
                      name: following ? "people" : "people-outline",
                    })
                  )
                ),
              ],
        ])
      )
    },
  }
}
