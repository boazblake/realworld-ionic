import Header from "./header.js"
import Footer from "./footer.js"
import { Toaster, LeftSideBar, RightSideBar } from "components"

const Layout = () => {
  return {
    view: ({ children, attrs: { mdl } }) =>
      m(
        "ion-app",
        m(Header, { mdl }),
        m(LeftSideBar, { mdl }),
        m("ion-content", { id: "layout", contentId: "layout" }, children),
        mdl.toast.msg && m(Toaster, { mdl }),
        m(RightSideBar, { mdl }),
        m(Footer, { mdl })
      ),
  }
}

export default Layout
