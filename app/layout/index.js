import Header from "./header.js"
import Footer from "./footer.js"

const Layout = () => {
  return {
    view: ({ children, attrs: { mdl } }) =>
      m(
        "ion-app",
        m(Header, { mdl }),
        m("ion-content", children),
        m(Footer, { mdl })
      ),
  }
}

export default Layout
