import Header from "./header.js"
import Footer from "./footer.js"
import { Toaster, SideBars } from "components"

const Layout = () => {
  return {
    view: ({ children, attrs: { mdl } }) =>
      m(
        "ion-app",
        m(Header, { mdl }),
        m("ion-content", { id: "layout" }, children),
        m(SideBars, { mdl }),
        mdl.toast.msg && m(Toaster, { mdl }),
        m(Footer, { mdl })
      ),
  }
}

export default Layout
