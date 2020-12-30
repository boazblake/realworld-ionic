import Http from "Http"
import { log } from "Utils"

const submitTask = (http) => (mdl) => (data) => http.putTask(mdl)("user")(data)

const submit = (mdl, data) => {
  const onSuccess = ({ user }) => {
    localStorage.setItem("user", JSON.stringify(user))
    mdl.user = user
    console.log(mdl.user)
    m.route.set("/home")
  }
  const onError = log("error")
  submitTask(Http)(mdl)(data).fork(onError, onSuccess)
}

const User = ({
  attrs: {
    mdl: {
      user: { image, username, password, bio, email },
    },
  },
}) => {
  let data = { image, username, password, bio, email }
  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "form",
        m("ion-text", m("h1", "Your Settings")),

        m(
          "ion-item",
          m("ion-label", { position: "stacked" }, "URL of profile picture"),
          m("ion-input", {
            type: "text",
            placeholder: "URL of profile picture",
            onchange: (e) => (data.image = e.target.value),
            value: data.image,
          })
        ),

        m(
          "ion-item",
          m("ion-label", { position: "stacked" }, "Your Name"),
          m("ion-input", {
            type: "text",
            placeholder: "Your Name",
            onchange: (e) => (data.username = e.target.value),
            value: data.username,
          })
        ),

        m(
          "ion-item",
          m("ion-label", { position: "stacked" }, "Short bio about you"),
          m("ion-textarea", {
            placeholder: "Short bio about you",
            onchange: (e) => (data.bio = e.target.value),
            value: data.bio,
          })
        ),

        m(
          "ion-item",
          m("ion-label", { position: "stacked" }, "Email"),
          m("ion-input", {
            type: "text",
            placeholder: "Email",
            onchange: (e) => (data.email = e.target.value),
            value: data.email,
          })
        ),

        m(
          "ion-item",
          m("ion-label", { position: "stacked" }, "Password"),
          m("ion-input", {
            type: "password",
            placeholder: "Password",
            onchange: (e) => (data.password = e.target.value),
            value: data.password,
          })
        ),
        m(
          "ion-button",
          { onclick: (e) => submit(mdl, data) },
          " Update Settings "
        )
      ),
  }
}

export default User
