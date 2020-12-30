import { Menu } from "./menu"
import { ProfileLink, MenuToggle, TagList, DarkModeToggle } from "components"
import BaseModel from "../model"

const logout = (mdl) => {
  localStorage.clear()
  mdl = BaseModel()
  m.redraw()
  m.route.set("/home")
}

const SettingsMenu = () => {
  return {
    view: ({ attrs: { mdl, side } }) =>
      m("ion-list", [
        m(
          "ion-item",
          m(MenuToggle, {
            mdl,
            side: "start",
            contents: m(
              "ion-button",
              { color: "danger", onclick: () => logout() },
              "logout"
            ),
          }),
          m(MenuToggle, {
            mdl,
            side: "start",
            contents: m(
              "ion-button",
              {
                color: "warning",
                onclick: (e) => m.route.set(`/settings/${mdl.user.username}`),
              },
              m("ion-icon", { name: "settings" }),
              "Edit"
            ),
          }),
          m(DarkModeToggle, { mdl })
        ),
        m("ion-item", m(TagList, { mdl })),
      ]),
  }
}

export const SideBar = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(Menu, {
        mdl,
        visibile: true,
        side: "start",
        menuId: "options",
        contentId: "layout",
        header: m("ion-header", m(ProfileLink, { mdl })),
        contents: m(SettingsMenu, {
          mdl,
          side: "start",
        }),
      }),
  }
}

// export const OptionsMenu = () => {
//   return {
//     view: ({ attrs: { mdl, side } }) =>
//       m("ion-list", [
//         m(
//           "ion-item",
//           m(
//             m.route.Link,
//             {
//               onclick: (e) =>
//                 menuController
//                   .close(side)
//                   .then(
//                     m.route.set(`/profile/${mdl.user.username}`),
//                     m.route.set(`/profile/${mdl.user.username}`)
//                   ),
//               // href: `/profile/${mdl.user.username}`,
//             },
//             mdl.user.username
//           )
//         ),
//       ]),
//   }
// }

// const test = (item) => {
//   menuController
//     .enable(item)
//     .then(menuController.isEnabled(item))
//     .then(
//       (s) => console.log("s", s),
//       (e) => console.log("e", e)
//     )
// }

// export const AuthMenu = () => {
//   return {
//     view: ({ attrs: { mdl, side } }) =>
//       m("ion-list", [
//         m("ion-item", m("ion-button", { onclick: test }, "test")),
//         m(
//           "ion-item",
//           m(
//             m.route.Link,
//             {
//               onclick: (e) => menuController.toggle(side),
//               href: "/register",
//             },
//             m("ion-label", "register")
//           )
//         ),
//         ,
//         m(
//           "ion-item",
//           m(
//             m.route.Link,
//             {
//               onclick: (e) => menuController.toggle(side),
//               href: "/login",
//             },
//             m("ion-label", "Login")
//           )
//         ),
//       ]),
//   }
// }

// export const StartSideBar = () => {
//   const side = "start"
//   return {
//     view: ({ attrs: { mdl } }) => {
//       console.log(side, mdl)
//       return mdl.state.isLoggedIn()
//         ? m(Menu, {
//             mdl,
//             side,
//             title: "Settings",
//             menuId: "settings",
//             contentId: "settings",
//             contents: m(SettingsMenu, { mdl, side }),
//           })
//         : m(Menu, {
//             mdl,
//             side,
//             title: "Login | Register",
//             menuId: "auth",
//             contentId: "auth",
//             contents: m(AuthMenu, { mdl, side }),
//           })
//     },
//   }
// }
