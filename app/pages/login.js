import Http from "Http"
import { errorViewModel } from "Utils"
import { FormErrors } from "components"

export const loginTask = (http) => (mdl) => (user) =>
  http.postTask(mdl)("users/login")({ user })

const Login = () => {
  const state = { errors: null, disabled: false }
  const data = {
    email: "",
    password: "",
  }

  const onSubmit = (mdl, e) => {
    e.preventDefault()
    state.disabled = true
    const onSuccess = ({ user }) => {
      localStorage.setItem("token", `Token ${user.token}`)
      localStorage.setItem("user", JSON.stringify(user))
      mdl.user = user
      state.disabled = false
      m.route.set("/home")
    }

    const onError = (errors) => {
      state.disabled = false
      state.errors = errorViewModel(errors)
    }

    loginTask(Http)(mdl)(data).fork(onError, onSuccess)
  }

  return {
    view: ({ attrs: { mdl } }) =>
      m(
        "ion-content",
        m("form", [
          m("ion-text", m("h1", "Login")),

          state.errors && m(FormErrors, { mdl, errors: state.errors }),

          m("ion-input", {
            type: "text",
            disabled: state.disabled,
            placeholder: "email",
            onchange: (e) => (data.email = e.target.value),
            value: data.email,
            onblur: (e) => state.isSubmitted && validate,
          }),

          m("ion-input", {
            type: "password",
            disabled: state.disabled,
            placeholder: "password",
            onchange: (e) => (data.password = e.target.value),
            value: data.password,
            onblur: (e) => state.isSubmitted && validate,
          }),

          m("ion-button", { onclick: (e) => onSubmit(mdl, e) }, "Login"),
          m(
            "ion-link",
            m(
              m.route.Link,
              { href: "/register" },
              m("ion-label", "Need an Account?")
            )
          ),
        ])
      ),
  }
}

export default Login
