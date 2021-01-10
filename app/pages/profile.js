import Http from "Http"
import { log, sanitizeImg } from "Utils"
import { Loader, Articles, Paginator } from "components"

const followAuthorUrl = (author) => `profiles/${author}/follow`

const followAuthorTask = (http) => (mdl) => (author) =>
  http.postTask(mdl)(followAuthorUrl(author))()

const unFollowAuthorTask = (http) => (mdl) => (author) =>
  http.deleteTask(mdl)(followAuthorUrl(author))

const getProfileTask = (http) => (mdl) => (username) =>
  http.getTask(mdl)(`profiles/${username}`)

const getAuthorArticlesTask = (http) => (mdl) => (state) => (username) =>
  http.getTask(mdl)(
    `articles?limit=${state.limit}&offset=${state.offset}&author=${username}`
  )

const getAuthorFavoriteArticlesTask = (http) => (mdl) => (state) => (
  username
) =>
  http.getTask(mdl)(
    `articles?limit=${state.limit}&offset=${state.offset}&favorited=${username}`
  )

export const loadDataTask = (http) => (mdl) => (state) =>
  state.showFaveArticles
    ? getAuthorFavoriteArticlesTask(http)(mdl)(state)(mdl.slug)
    : getAuthorArticlesTask(http)(mdl)(state)(mdl.slug)

export const loadInitDataTask = (http) => (mdl) => (state) =>
  Task.of((profile) => (authorArticles) => ({
    ...profile,
    authorArticles,
  }))
    .ap(getProfileTask(http)(mdl)(mdl.slug))
    .ap(getAuthorArticlesTask(http)(mdl)(state)(mdl.slug))

const Profile = ({ attrs: { mdl } }) => {
  const data = {
    authorArticles: { articles: [], articlesCount: 0 },
    authorFavoriteArticles: { articles: [], articlesCount: 0 },
  }

  const state = {
    pageStatus: "loading",
    feedStatus: "loading",
    showFaveArticles: false,
    limit: 5,
    offset: 0,
    total: 0,
    error: null,
  }

  const loadData = (mdl) => {
    const onSuccess = (result) => {
      state.showFaveArticles
        ? (data.authorFavoriteArticles = result)
        : (data.authorArticles = result)

      state.total = state.showFaveArticles
        ? data.authorFavoriteArticles.articlesCount
        : data.authorArticles.articlesCount
      state.feedStatus = "success"

      console.log(state, data)
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
    loadDataTask(Http)(mdl)(state).fork(onError, onSuccess)
  }

  const loadInitData = (mdl) => {
    const onSuccess = ({ authorArticles, profile }) => {
      data.authorArticles = authorArticles
      data.profile = profile
      state.pageStatus = "success"
      state.feedStatus = "success"
      state.total = data.authorArticles.articlesCount
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
      m.route.set("/home")
    }

    state.pageStatus = "loading"
    loadInitDataTask(Http)(mdl)(state).fork(onError, onSuccess)
  }

  const selectFeed = (toShowFaveArticles) => {
    state.showFaveArticles = toShowFaveArticles
    state.offset = 0
    loadData(mdl)
  }

  const toggleAuthorFollow = ({ author: { username, following } }) => {
    const onError = log("toggleAuthorFollow, err-auth")
    const onSuccess = ({ profile: { following } }) =>
      (data.profile.following = following)

    let toggleTask = following ? unFollowAuthorTask : followAuthorTask
    toggleTask(Http)(mdl)(username).fork(onError, onSuccess)
  }

  return {
    oninit: ({ attrs: { mdl } }) => loadInitData(mdl),
    view: ({ attrs: { mdl } }) => [
      state.pageStatus == "loading" &&
        m(Loader, m("h1.logo-font", "Loading ...")),

      state.pageStatus == "error" &&
        m("ion-text", m("h1", `Error Loading Data: ${state.error}`)),

      state.pageStatus == "success" && [
        m(
          "ion-list-header",
          m(
            "ion-row",
            m(
              "ion-col",
              m("ion-img", { src: sanitizeImg(data.profile.image) }),
              m("ion-text", m("h4", data.profile.username)),
              m("ion-text", m("p", data.profile.bio)),

              data.profile.username !== mdl.user.username
                ? m(
                    "ion-item",
                    { lines: "none" },
                    m("ion-icon", {
                      onclick: (e) =>
                        toggleAuthorFollow({
                          author: {
                            username: data.profile.username,
                            following: data.profile.following,
                          },
                        }),
                      name: data.profile.following
                        ? "people"
                        : "people-outline",
                    })
                  )
                : m(
                    "ion-chip",
                    {
                      onclick: (e) =>
                        m.route.set(`/settings/${data.profile.username}`),
                    },
                    m("ion-icon", { name: "settings" }),
                    m("ion-label", "Edit Profile Settings")
                  )
            )
          )
        ),
        m(
          "ion-buttons",

          m(
            "ion-button",
            {
              fill: !state.showFaveArticles && "solid",
              color: "light",
              onclick: (e) => selectFeed(false),
            },
            m("ion-link", "Written Articles")
          ),
          m(
            "ion-button",
            {
              fill: state.showFaveArticles && "solid",
              color: "light",
              onclick: (e) => selectFeed(true),
            },
            m("ion-link", "Favorited Articles")
          )
        ),
        state.feedStatus == "loading" && "Loading Articles...",
        state.feedStatus == "error" &&
          m("ion-text", { color: "warning" }, [
            m("h1", `Error Loading Data: ${state.error}`),
          ]),

        state.feedStatus == "success" &&
          m("ion-grid", [
            state.showFaveArticles
              ? m(Articles, { mdl, data: data.authorFavoriteArticles })
              : m(Articles, { mdl, data: data.authorArticles }),

            m(Paginator, {
              mdl,
              state,
              fetchDataFor: (offset) => {
                state.offset = offset
                loadData(mdl)
              },
            }),
          ]),
      ],
    ],
  }
}

export default Profile
