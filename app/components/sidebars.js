import { Menu } from "./menu"
import { menuController } from "@ionic/core"

export const OptionsMenu = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m("ion-list", [
        m(
          "ion-item",
          m(
            m.route.Link,
            {
              onclick: (e) => menuController.toggle("settings"),
              href: `/profile/${mdl.user.username}`,
            },
            mdl.user.username
          )
        ),
      ]),
  }
}

export const SettingsMenu = () => {
  const test = () => {
    menuController.getMenus().then(
      (s) => console.log("s", s),
      (e) => console.log("e", e)
    )
  }

  return {
    view: ({ attrs: { mdl } }) =>
      m("ion-list", [
        m("ion-item", m("ion-button", { onclick: test }, "test")),
        m(
          "ion-item",
          m(
            m.route.Link,
            {
              onclick: (e) => menuController.toggle("settings"),
              href: `/settings/${mdl.user.username}`,
            },
            [m("i.ion-gear-a.p-5"), "Settings"]
          )
        ),
      ]),
  }
}

export const LeftSideBar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(Menu, {
        mdl,
        // visibile: mdl.menu == "settings",
        title: "Settings",
        side: "start",
        menuId: "settings",
        contentId: "layout",
        contents: m(SettingsMenu, { mdl }),
      }),
  }
}

export const RightSideBar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(Menu, {
        mdl,
        // visibile: mdl.menu == "options",
        title: "Options",
        side: "end",
        menuId: "options",
        contentId: "layout",
        contents: m(OptionsMenu, { mdl }),
      }),
  }
}
