import { menuController } from "@ionic/core"

export const MenuButton = () => {
  const toggleMenu = (menuId) => {
    console.log(menuController)
    menuController.open(menuId).then(
      (s) => console.log(s),
      (e) => console.log(e)
    )
  }

  return {
    view: ({ attrs: { name, menuId } }) =>
      m(
        "ion-menu-toggle",
        {
          oncreate: ({ dom }) => {
            menuController.enable(true, menuId)
          },
          onclick: (e) => toggleMenu(menuId),
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
    view: ({ attrs: { title, side, menuId, contentId, contents } }) =>
      m("ion-menu[main]", { side, menuId, contentId }, [
        m("ion-header", m("ion-toolbar[translucent]", m("ion-title", title))),
        m("ion-content", contents),
      ]),
  }
}
