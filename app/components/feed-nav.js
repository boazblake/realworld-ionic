export const FeedNav = ({ attrs: { fetchData } }) => {
  return {
    view: ({ attrs: { mdl, data } }) => {
      return [
        m(
          "ion-toolbar",
          m(
            "ion-row",

            m(
              "ion-col",
              m(
                "ion-button",
                {
                  fill: "solid",
                  expand: "full",
                  id: "",
                  color: data.tags.current == "" ? "primary" : "secondary",
                  onclick: (e) => {
                    data.tags.current = e.target.id
                    fetchData(mdl)
                  },
                },
                "Global Feed"
              )
            ),

            mdl.state.isLoggedIn() &&
              m(
                "ion-col",
                m(
                  "ion-button",
                  {
                    fill: "solid",
                    expand: "full",
                    id: "feed",
                    color:
                      data.tags.current == "feed" ? "primary" : "secondary",
                    onclick: (e) => {
                      data.tags.current = e.target.id
                      fetchData(mdl)
                    },
                  },
                  "Your Feed"
                )
              )
          ),

          m(
            "ion-row",

            m(
              "ion-col",
              data.tags.selected.map((tag) =>
                m(
                  "ion-button",
                  {
                    fill: "solid",
                    size: "small",
                    color: data.tags.current == tag ? "primary" : "secondary",
                    id: tag,
                    onclick: (e) => {
                      data.tags.current = tag
                      fetchData(mdl)
                    },
                  },
                  m("ion-text", `# ${tag}`)
                  //Move this to user profile
                  // import { without } from "ramda"
                  // m("ion-icon", {
                  //   name: "close-circle-outline",
                  //   onclick: (e) =>
                  //     (data.tags.selected = without(tag, data.tags.selected)),
                  // })
                )
              )
            )
          )
        ),
      ]
    },
  }
}
