import Routes from "./routes"
import Stream from "mithril-stream"

const BaseModel = () => ({
  menus: ["settings", "options"],
  menu: { title: "", side: "", menuId: "", contentId: "", contents: null },
  Routes,
  state: {
    darkmode: false,
    isLoading: false,
    loadingProgress: { max: 0, value: 0 },
    isLoggedIn: (from) => {
      // console.log(
      //   "called is logged in",
      //   from,
      //   localStorage.getItem("token"),
      //   !!localStorage.getItem("token")
      // )
      return !!localStorage.getItem("token")
    },
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
})

export default BaseModel
