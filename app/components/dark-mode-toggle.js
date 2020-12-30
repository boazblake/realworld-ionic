export const DarkModeToggle = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "ion-item",
        mdl.state.darkmode &&
          m(
            "ion-label",
            m("ion-icon", {
              name: "sunny-outline",
            })
          ),

        m("ion-toggle", {
          onclick: (e) => {
            mdl.state.darkmode = !mdl.state.darkmode
            document.body.classList.toggle("dark")
            window.matchMedia("(prefers-color-scheme: dark)")
          },
        }),

        !mdl.state.darkmode &&
          m(
            "ion-label",
            m("ion-icon", {
              name: "moon-outline",
            })
          )
      ),
  }
}
