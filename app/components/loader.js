export const Loader = () => {
  return {
    view: ({ attrs: { name, duration } }) =>
      m("ion-spinner.spinner", {
        duration: duration || 2000,
        name: name || "crescent",
      }),
  }
}
