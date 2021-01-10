import { menuController } from "@ionic/core"

export const MenuToggle = ({
  attrs: { mdl, side, contents, eHandler, sHandler },
}) => {
  const toggleMenu = () => {
    menuController
      .enable(true, side)
      .then(menuController.toggle(side))
      .then(
        (x) => console.log("?menutoggle s", x),
        (z) => console.log("menutoggle e", z)
      )
    // .then(sHandler(mdl), eHandler(mdl))
  }

  return {
    view: () =>
      m(
        "ion-menu-toggle",
        {
          onclick: () => toggleMenu,
        },
        contents
      ),
  }
}

export const Menu = () => {
  return {
    view: ({ attrs: { mdl, header, title, contentId, contents } }) => {
      return m(
        "ion-menu[type='push']",
        {
          onionWillOpen: (e) => {
            mdl.menu.menuId = contentId
            // console.log("onionWillOpen", e.target)
          },
          // onionDidOpen: (e) => {
          //   console.log("onionDidOpen", e)
          // },
          onionWillClose: (e) => {
            mdl.menu.menuId = null
            console.log("onionwillClose", e)
          },
          // onionDidClose: (e) => {
          //   console.log("ionDidClose", e)
          // },
          contentId,
        },
        [
          header && header,
          title && m("ion-header", m("ion-toolbar", m("ion-title", title))),
          m("ion-content.has-header.has-subheader", contents),
        ]
      )
    },
  }
}
