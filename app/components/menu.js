import { menuController } from "@ionic/core"

export const MenuButton = () => {
  const toggleMenu = (mdl, side) => {
    menuController.enable(true, side)
    mdl.menu ? (mdl.menu = side) : (mdl.menu = null)
    console.log("toggleMenu", side, menuController)
    menuController
      // .open(side)
      .toggle(side)
      .then(
        (s) => console.log("s", s),
        (e) => console.log("e", e)
      )
  }

  return {
    view: ({ attrs: { mdl, name, side } }) =>
      m(
        "ion-menu-toggle",
        {
          oncreate: ({ dom }) => {},
          onclick: (e) => toggleMenu(mdl, side),
        },
        m(
          "ion-button",
          m("ion-icon", {
            name,
          })
        )
      ),
  }
}

export const Menu = () => {
  return {
    oncreate: ({ dom }) => {
      menuController.enable(dom).then(
        (s) => console.log("doms", s),
        (e) => console.log("dome", e)
      )
    },
    view: ({ attrs: { title, visible, side, menuId, contentId, contents } }) =>
      m("ion-menu", { side, visible, id: menuId, menuId, contentId }, [
        m("ion-header", m("ion-toolbar[translucent]", m("ion-title", title))),
        m("ion-content", { id: menuId }, contents),
      ]),
  }
}
