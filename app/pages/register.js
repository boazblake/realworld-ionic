import Http from "Http"
import { errorViewModel } from "Utils"
import { FormErrors } from "components"

const registerTask = (http) => (mdl) => (user) =>
  http.postTask(mdl)("users")({ user })

const Register = () => {
  const state = { errors: null, disabled: false }
  const data = {
    username: "",
    email: "",
    password: "",
  }

  const onSubmit = (mdl, e) => {
    e.preventDefault()
    console.log(mdl)
    state.disabled = true
    const onSuccess = ({ user }) => {
      mdl.user = user
      localStorage.setItem("token", `Token ${user.token}`)
      localStorage.setItem("user", JSON.stringify(user))
      state.disabled = false
      m.route.set("/home")
      console.log("success", user)
    }

    const onError = (errors) => {
      state.disabled = false
      state.errors = errorViewModel(errors)
    }

    state.isSubmitted = true
    registerTask(Http)(mdl)(data).fork(onError, onSuccess)
  }

  return {
    view: ({ attrs: { mdl } }) =>
      m("form", [
        m("ion-text", m("h1", "Sign Up")),

        state.errors && m(FormErrors, { mdl, errors: state.errors }),

        m("ion-input", {
          type: "text",
          disabled: state.disabled,
          placeholder: "Your Name",
          onchange: (e) => (data.username = e.target.value),
          value: data.username,
        }),

        m("ion-input", {
          type: "text",
          disabled: state.disabled,
          placeholder: "email",
          onchange: (e) => (data.email = e.target.value),
          value: data.email,
        }),

        m("ion-input", {
          type: "password",
          disabled: state.disabled,
          placeholder: "password",
          onchange: (e) => (data.password = e.target.value),
          value: data.password,
        }),

        m("ion-button", { onclick: (e) => onSubmit(mdl, e) }, "Sign Up"),

        m(
          "ion-link",
          m(
            m.route.Link,
            { href: "/login" },
            m("ion-label", "Have an account?")
          )
        ),
      ]),
  }
}

export default Register
