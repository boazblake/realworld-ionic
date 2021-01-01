import Header from "./header.js"
import { Toaster, SideBar } from "components"

const Layout = () => {
  return {
    view: ({ children, attrs: { mdl } }) => {
      return m(
        "ion-app",
        m(Header, { mdl }),
        mdl.state.isLoggedIn() && m(SideBar, { mdl }),
        m("ion-content", { id: "layout", contentId: "layout" }, children),
        mdl.state.isToaster() && m(Toaster, { mdl })
      )
    },
  }
}

export default Layout
