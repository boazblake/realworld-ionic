import Routes from "./routes"
const sanitizer = new Sanitizer()

const BaseModel = () => ({
  menus: ["settings", "options"],
  menu: { title: "", side: "", menuId: null, contentId: "", contents: null },
  Routes,
  state: {
    darkmode: false,
    isLoading: false,
    loadingProgress: { max: 0, value: 0 },
    isLoggedIn: () => !!localStorage.getItem("token"),
    isToaster: () => !!localStorage.getItem("toaster"),
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
  data: {
    tags: { tagList: [], selected: [], current: "" },
    articles: {},
  },
  sanitizer,
})

export default BaseModel
