import { MenuButton } from "components"

const Header = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "ion-header",
        m(
          "ion-toolbar",
          mdl.state.isLoggedIn()
            ? [
                m.route.get() !== "/home" &&
                  m("ion-buttons", { slot: "start" }, [
                    m("ion-back-button", {
                      slot: "start",
                      onclick: (e) => {
                        e.preventDefault()
                        history.back()
                      },
                      defaultHref: "/",
                    }),
                    m(m.route.Link, { href: "#" }, "Home"),
                  ]),
                m(
                  "ion-buttons",
                  { slot: "end" },
                  m(MenuButton, {
                    side: "start",
                    mdl,
                    name: "options",
                    label: "Options",
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
