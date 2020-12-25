import Http from "Http"
import { Card } from "./card"
import { log, sanitizeImg, errorViewModel } from "Utils"
import { lensProp, over, trim } from "ramda"

const getCommentsTask = (http) => (mdl) => (slug) =>
  http.getTask(mdl)(`articles/${slug}/comments`)

const deleteCommentTask = (http) => (mdl) => (slug) => (id) =>
  http.deleteTask(mdl)(`articles/${slug}/comments/${id}`)

const trimBody = over(lensProp("body"), trim)

const submitTask = (http) => (mdl) => (comment) =>
  http.postTask(mdl)(`articles/${mdl.slug}/comments`)({ comment })

const CommentForm = ({ attrs: { mdl, reload } }) => {
  const comment = { body: "" }
  const state = { errors: [], disabled: false }

  const onError = (errors) => {
    state.errors = errorViewModel(errors)
    console.log("Error with form ", state)
    state.disabled = false
  }

  const onSuccess = () => {
    comment.body = ""
    state.errors = []
    state.disabled = false
    reload()
  }

  const submit = (comment) =>
    submitTask(Http)(mdl)(trimBody(comment)).fork(onError, onSuccess)

  return {
    oninit: () => (comment.body = ""),
    view: ({ attrs: { mdl } }) => [
      m(Card, {
        content: m("ion-textarea", {
          rows: 3,
          placeholder: "Write a comment ...",
          onchange: (e) => (comment.body = e.target.value),
          disabled: state.disabled,
          value: comment.body,
        }),
        footer: [
          m(
            "ion-row",
            m(
              "ion-col",
              m("ion-avatar", m("img", { src: sanitizeImg(mdl.user.image) }))
            ),

            m(
              "ion-col",
              m(
                "ion-button",
                {
                  onclick: (e) => {
                    state.disabled = true
                    submit(comment)
                  },
                },
                " Post Comment "
              )
            )
          ),
        ],
      }),

      state.errors.map((e) =>
        e.values.map((err) => m("p.error-messages", `${e.key} ${err}`))
      ),
    ],
  }
}

const Comment = () => {
  return {
    view: ({
      attrs: {
        mdl,
        comment: {
          author: { image, username },
          body,
          createdAt,
          id,
        },
        deleteComment,
      },
    }) =>
      m(
        "ion-item",

        m(
          "ion-grid",
          ("ion-row", m("ion-text", body)),
          m(
            "ion-row",
            m(
              m.route.Link,
              {
                href: `/profile/${username}`,
                class: "comment-author m-5",
              },
              m(
                "ion-avatar",
                m("img", {
                  src: sanitizeImg(image),
                })
              ),
              m("ion-text", username)
            ),
            m("ion-text", createdAt),

            username == mdl.user.username &&
              m("ion-icon", {
                name: "trash-outline",
                onclick: (e) => deleteComment(id),
              })
          )
        )
      ),
  }
}

export const Comments = ({ attrs: { mdl } }) => {
  const data = { comments: [] }

  const loadComments = (mdl) => {
    const onSuccess = ({ comments }) => (data.comments = comments)

    const onError = log("error with comments")

    getCommentsTask(Http)(mdl)(mdl.slug).fork(onError, onSuccess)
  }

  const deleteComment = (id) => {
    const onSuccess = ({ comments }) => (data.comments = comments)

    const onError = log("error with comments")

    deleteCommentTask(Http)(mdl)(mdl.slug)(id)
      .chain((x) => getCommentsTask(Http)(mdl)(mdl.slug))
      .fork(onError, onSuccess)
  }

  return {
    oninit: ({ attrs: { mdl } }) => loadComments(mdl),
    view: ({ attrs: { mdl } }) =>
      m(
        "item-list",
        m(CommentForm, { mdl, reload: () => loadComments(mdl) }),
        data.comments.map((c) =>
          m(Comment, {
            mdl,
            comment: c,
            deleteComment: (id) => deleteComment(id),
          })
        )
      ),
  }
}
