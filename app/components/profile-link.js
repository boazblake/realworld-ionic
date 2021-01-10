import { sanitizeImg } from "Utils"
import { MenuToggle } from "components"

export const ProfileLink = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "",

        m(MenuToggle, {
          side: "start",
          contents: m(
            "ion-grid",
            { onclick: (e) => m.route.set(`/profile/${mdl.user.username}`) },
            m(
              "a",
              m(
                "ion-row.ion-justify-content-evenly.ion-align-items-end",

                m(
                  "ion-avatar",
                  m("ion-img", { src: sanitizeImg(mdl.user.image) })
                ),

                m("ion-text", m("h1", `${mdl.user.username}`))
              )
            )
          ),
        })
      ),
  }
}
