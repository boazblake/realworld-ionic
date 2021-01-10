import { MenuToggle } from "components"

const Header = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "ion-header",
        !mdl.menu.menuId &&
          m(
            "ion-toolbar",

            mdl.state.isLoggedIn()
              ? [
                  m.route.get() !== "/home" &&
                    m("ion-back-button", {
                      slot: "start",
                      onclick: (e) => {
                        e.preventDefault()
                        history.back()
                      },
                      defaultHref: "/",
                    }),

                  m(
                    "ion-toolbar-container",
                    m(
                      "ion-title",
                      { href: "#", slot: "toolbar-content" },
                      m(m.route.Link, "RealWorld-Ionic-Mithril")
                    )
                  ),
                  m(
                    "ion-buttons",
                    { slot: "end" },
                    m(MenuToggle, {
                      side: "start",
                      mdl,
                      eHandler: () => "",
                      sHandler: () => "",
                      contents: m(
                        "ion-button",
                        m("ion-icon", { name: "options" })
                      ),
                    })
                  ),
                ]
              : m(
                  "ion-item",
                  { slot: "primary", onclick: (e) => m.route.set("/home") },
                  [
                    m("ion-text", m("h1", "conduit")),
                    m("ion-text", m("p", "A place to share your knowledge.")),
                  ]
                )
          )
      ),
  }
}

export default Header
