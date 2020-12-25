export const Card = {
  view: ({ attrs: { header, content, footer } }) =>
    m(
      "ion-card",
      m("ion-card-header", { translucent: true }, header),
      m("ion-card-content", content),
      m("ion-card-footer", footer)
    ),
}
