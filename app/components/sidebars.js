import { Menu } from "./menu"
import { menuController } from "@ionic/core"

export const SettingsMenu = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m("ion-list", [
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

export const SideBars = () => {
  return {
    view: ({ attrs: { mdl } }) => [
      m(Menu, {
        mdl,
        title: "Settings",
        side: "start",
        menuId: "settings",
        contentId: "layout",
        contents: m(SettingsMenu, { mdl }),
      }),
      m(Menu, {
        mdl,
        title: "Options",
        side: "end",
        menuId: "options",
        contentId: "layout",
        contents: m(SettingsMenu, { mdl }),
      }),
    ],
  }
}
