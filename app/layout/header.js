import { MenuButton } from "components"

const Header = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "ion-header",
        m(
          "ion-toolbar",
          m(
            "ion-buttons",
            { slot: "start" },
            m.route.get() !== "/home" &&
              m("ion-back-button", {
                slot: "start",
                onclick: () => history.back(),
                defaultHref: "/",
              }),
            mdl.state.isLoggedIn()
              ? m(MenuButton, { mdl, name: "settings" })
              : [
                  m(
                    "ion-item",
                    m(m.route.Link, { href: "/register" }, "Sign up")
                  ),
                  m("ion-item", m(m.route.Link, { href: "/login" }, "Login")),
                ],
            m(m.route.Link, { href: "#" }, "Home")
          ),
          m(
            "ion-buttons",
            { slot: "end" },
            m(MenuButton, { mdl, name: "options" })
          )
        )
      ),
  }
}

export default Header
