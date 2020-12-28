import Routes from "./routes"

const model = {
  menus: ["settings", "options"],
  menu: { title: "", side: "", menuId: "", contentId: "", contents: null },
  Routes,
  state: {
    isLoading: false,
    loadingProgress: { max: 0, value: 0 },
    isLoggedIn: () => sessionStorage.getItem("token"),
  },
  settings: {},
  page: "",
  user: {},
  toast: {
    show: false,
    duration: 2000,
    status: null,
    msg: null,
  },
}

export default model
