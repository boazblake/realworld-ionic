import Http from "Http"
import { uniq } from "ramda"
const getTagsTask = (http) => (mdl) => http.getTask(mdl)("tags")

export const TagList = ({ attrs: { mdl } }) => {
  const selectTag = (data, tag) =>
    (mdl.data.tags.selected = uniq(mdl.data.tags.selected.concat([tag])))
  const onError = (e) => {}
  const onSuccess = ({ tags }) => {
    mdl.data.tags.tagList = tags
  }

  getTagsTask(Http)(mdl).fork(onError, onSuccess)

  return {
    view: ({ attrs: { data } }) => {
      const isSelected = (tag) =>
        mdl.data.tags.selected.includes(tag) ? "primary" : "secondary"

      return [
        m("ion-text", "Popular Tags"),

        m(
          "ion-list",
          mdl.data.tags.tagList
            .filter((tag) => !mdl.data.tags.selected.includes(tag))
            .map((tag) =>
              m(
                "ion-chip",
                {
                  color: isSelected(tag),
                  onclick: (e) => selectTag(data, tag),
                },
                tag
              )
            )
        ),
      ]
    },
  }
}
