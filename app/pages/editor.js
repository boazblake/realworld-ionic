import Http from "Http"
import { log, errorViewModel } from "Utils"
import { FormErrors, Loader } from "components"
import {
  compose,
  head,
  join,
  lensPath,
  lensProp,
  over,
  split,
  trim,
  uniq,
} from "ramda"

export const loadArticleTask = (http) => (mdl) => (slug) =>
  http.getTask(mdl)(`articles/${slug}`).map(formatTagsToString)

const formatTagsToList = over(
  lensProp("tagList"),
  compose(uniq, split(","), trim)
)

const formatTagsToString = over(lensPath(["article", "tagList"]), join(","))

export const submitArticleTask = (http) => (mdl) => (article) => (isEditing) =>
  isEditing
    ? http.putTask(mdl)(`articles/${mdl.slug}`)({ article })
    : http.postTask(mdl)("articles")({ article })

const Editor = ({ attrs: { mdl } }) => {
  let data = {
    description: "",
    title: "",
    body: "",
    tagList: "",
  }
  const state = {
    isEditing: false,
    disabled: false,
    errors: null,
    status: "loading",
  }

  const initEditor = (mdl) => {
    state.disabled = false
    const onSuccess = ({ article }) => {
      console.log("?")
      data = article
      state.status = "success"
    }

    const onError = (errors) => {
      state.errors = errorViewModel(errors)
    }
    if (mdl.slug !== "/editor") {
      state.isEditing = true
      loadArticleTask(Http)(mdl)(mdl.slug).fork(onError, onSuccess)
    } else {
      state.status = "success"
    }
  }

  const submitData = (data) => {
    log("data")([data, formatTagsToList(data)])
    state.disabled = true
    const onSuccess = ({ article: { slug } }) => m.route.set(`/article/${slug}`)

    const onError = (errors) => {
      state.errors = errorViewModel(errors)
      state.disabled = false
    }

    submitArticleTask(Http)(mdl)(formatTagsToList(data))(state.isEditing).fork(
      onError,
      onSuccess
    )
  }

  return {
    oninit: ({ attrs: { mdl } }) => initEditor(mdl),
    view: () =>
      m(
        "form.ion-align-items-evenly.ion-justify-content-center",
        { "min-height": "100%", height: "100%" },
        state.status == "loading" && m(Loader, { mdl }),
        state.status == "error" && "Error!",
        state.status == "success" && [
          state.errors && m(FormErrors, { mdl, errors: state.errors }),
          m(
            "ion-item",
            m("ion-label", { position: "stacked" }, "Article Title"),
            m("ion-input", {
              type: "text",
              disabled: state.disabled,
              // placeholder: "Article Title",
              onchange: (e) => (data.title = e.target.value),
              value: data.title,
            })
          ),
          m(
            "ion-item",
            m(
              "ion-label",
              { position: "stacked" },
              "What's this article about?"
            ),
            m("ion-input", {
              type: "text",
              disabled: state.disabled,
              // placeholder: "What's this article about?",
              onchange: (e) => (data.description = e.target.value),
              value: data.description,
            })
          ),
          m(
            "ion-item",
            m(
              "ion-label",
              { position: "stacked" },
              "Write your article (in markdown)"
            ),
            m("ion-textarea", {
              rows: 8,
              // placeholder: "Write your article (in markdown)",
              disabled: state.disabled,
              onchange: (e) => (data.body = e.target.value),
              value: data.body,
            })
          ),
          m(
            "ion-item",
            m("ion-label", { position: "stacked" }, "Enter tags"),
            m("ion-input", {
              type: "text",
              disabled: state.disabled,
              // placeholder: "Enter tags",
              onchange: (e) => (data.tagList = e.target.value),
              value: data.tagList,
            })
          ),
          m(
            "ion-button",
            { color: "light", onclick: (e) => submitData(data) },
            "Publish Article"
          ),
        ]
      ),
  }
}
export default Editor
