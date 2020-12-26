import { uniq } from "ramda"

export const TagList = () => {
  const selectTag = (data, tag) =>
    (data.tags.selected = uniq(data.tags.selected.concat([tag])))

  return {
    view: ({ attrs: { data } }) => {
      const isSelected = (tag) =>
        data.tags.selected.includes(tag) ? "primary" : "secondary"

      return [
        m("ion-text", "Popular Tags"),

        data.tags.tagList
          .filter((tag) => !data.tags.selected.includes(tag))
          .map((tag) =>
            m(
              "ion-chip",
              {
                color: isSelected(tag),
                onclick: (e) => selectTag(data, tag),
              },
              tag
            )
          ),
      ]
    },
  }
}
