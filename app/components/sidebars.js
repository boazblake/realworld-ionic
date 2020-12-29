import { Menu } from "./menu"
import { sanitizeImg } from "Utils"
import { menuController } from "@ionic/core"

export const OptionsMenu = () => {
  return {
    view: ({ attrs: { mdl, side } }) =>
      m("ion-list", [
        m(
          "ion-item",
          m(
            m.route.Link,
            {
              onclick: (e) => menuController.toggle(side),
              href: `/profile/${mdl.user.username}`,
            },
            mdl.user.username
          )
        ),
      ]),
  }
}

const test = (item) => {
  menuController
    .enable(item)
    .then(menuController.isEnabled(item))
    .then(
      (s) => console.log("s", s),
      (e) => console.log("e", e)
    )
}

const SettingsMenu = () => {
  return {
    view: ({ attrs: { mdl, side } }) =>
      m("ion-list", [
        m("ion-item", m("ion-button", { onclick: () => test() }, "test")),

        m(
          "ion-item",
          m(
            m.route.Link,
            {
              onclick: (e) => menuController.toggle(side),
              href: `/profile/${mdl.user.username}`,
            },
            m("ion-avatar", m("ion-img", { src: sanitizeImg(mdl.user.image) })),
            m("ion-label", `${mdl.user.username} Profile Page`)
          )
        ),
      ]),
  }
}

export const AuthMenu = () => {
  return {
    view: ({ attrs: { mdl, side } }) =>
      m("ion-list", [
        m("ion-item", m("ion-button", { onclick: test }, "test")),
        m(
          "ion-item",
          m(
            m.route.Link,
            {
              onclick: (e) => menuController.toggle(side),
              href: "/register",
            },
            m("ion-label", "register")
          )
        ),
        ,
        m(
          "ion-item",
          m(
            m.route.Link,
            {
              onclick: (e) => menuController.toggle(side),
              href: "/login",
            },
            m("ion-label", "Login")
          )
        ),
      ]),
  }
}

export const StartSideBar = () => {
  const side = "start"
  return {
    // oncreate: (dom) => {
    //   test("start")
    // },
    view: ({ attrs: { mdl } }) => {
      console.log(side, mdl)
      return mdl.state.isLoggedIn()
        ? m(Menu, {
            mdl,
            side,
            title: "Settings",
            menuId: "settings",
            contentId: "settings",
            contents: m(SettingsMenu, { mdl, side }),
          })
        : m(Menu, {
            mdl,
            side,
            title: "Login | Register",
            menuId: "auth",
            contentId: "auth",
            contents: m(AuthMenu, { mdl, side }),
          })
    },
  }
}

export const SideBar = () => {
  return {
    oncreate: (dom) => {
      test("end")
    },
    view: ({ attrs: { mdl } }) =>
      m(Menu, {
        mdl,
        visibile: true,
        title: "Options",
        side: "start",
        menuId: "options",
        contentId: "layout",
        contents: m(SettingsMenu, {
          mdl,
          side: "start",
        }),
      }),
  }
}
