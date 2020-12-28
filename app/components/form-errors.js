export const FormErrors = () => {
  return {
    view: ({ attrs: { errors } }) =>
      errors.map(({ key, errors }) =>
        m(
          ".error-messages",
          m(
            "ion-list",
            m("ion-label", { color: "danger" }, `${key}`),
            m(
              "ion-list",
              errors.map((error) => m("ion-item", { color: "danger" }, error))
            )
          )
        )
      ),
  }
}
