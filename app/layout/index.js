import Header from "./header.js"
import Footer from "./footer.js"
import { Toaster, SideBar } from "components"

const Layout = () => {
  return {
    view: ({ children, attrs: { mdl } }) =>
      m(
        "ion-app",
        m(Header, { mdl }),
        m(SideBar, { mdl }),
        m(
          "ion-content.ion-page",
          { id: "layout", contentId: "layout" },
          children
        ),
        mdl.toast.msg && m(Toaster, { mdl }),
        m(Footer, { mdl })
      ),
  }
}

export default Layout
