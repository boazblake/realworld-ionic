import { menuController } from "@ionic/core"

export const MenuButton = () => {
  const toggleMenu = (mdl, side) => {
    menuController
      .enable(true, side)
      .then(menuController.open(side))
      .then(
        (s) =>
          console.log("s", s, mdl.menu ? (mdl.menu = side) : (mdl.menu = null)),
        (e) => console.log("erro", e)
      )
  }

  return {
    view: ({ attrs: { mdl, name, side, label } }) =>
      m(
        "ion-menu-toggle",
        {
          onclick: () => toggleMenu(mdl, side),
        },
        m("ion-button", {}, m("ion-icon", { name }), label)
      ),
  }
}

export const Menu = () => {
  return {
    view: ({
      attrs: { title, visible, side, menuId, contentId, contents },
    }) => {
      console.log("wtf", { title, visible, side, menuId, contentId, contents })
      return m(
        "ion-menu[type='push']",
        {
          // onionWillOpen: (e) => {
          //   console.log("onionWillOpen", e.target)
          // },
          // onionDidOpen: (e) => {
          //   console.log("onionDidOpen", e)
          // },
          // onionWillClose: (e) => {
          //   console.log("onionwillClose", e)
          // },
          // onionDidClose: (e) => {
          //   console.log("ionDidClose", e)
          // },
          contentId,
        },
        [
          m("ion-header", m("ion-toolbar[translucent]", m("ion-title", title))),
          m("ion-content", contents),
        ]
      )
    },
  }
}
