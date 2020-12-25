export const Card = {
  view: ({ attrs: { options, header, content, footer } }) =>
    m(
      "ion-card",
      options,
      m("ion-card-header", { translucent: true }, header),
      m("ion-card-content", content),
      m("ion-card-footer", footer)
    ),
}
