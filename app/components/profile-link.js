import { sanitizeImg } from "Utils"
import { MenuToggle } from "components"

const toProfilePage = (mdl) => m.route.set(`/profile/${mdl.user.username}`)

export const ProfileLink = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(MenuToggle, {
        // mdl,
        side: "start",
        // sHandler: (mdl) => toProfilePage(mdl),
        // eHandler: (mdl) => toProfilePage(mdl),
        contents: m(
          "ion-grid",
          { onclick: (e) => toProfilePage(mdl) },
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
      }),
  }
}
