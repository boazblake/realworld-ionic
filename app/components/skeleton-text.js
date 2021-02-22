const SkeletonItem = {
  view: () =>
    m("ion-item", [
      m(
        "ion-thumbnail",
        { slot: "start" },
        m("ion-skeleton-text", { animated: "" })
      ),
      m("ion-label", [
        m(
          "h2",
          m("ion-skeleton-text", {
            animated: "",
            style: { width: "50%" },
          })
        ),
        m(
          "h3",
          m("ion-skeleton-text", {
            animated: "",
            style: { width: "50%" },
          })
        ),
        m(
          "p",
          m("ion-skeleton-text", {
            animated: "",
            style: { width: "80%" },
          })
        ),
        m(
          "p",
          m("ion-skeleton-text", {
            animated: "",
            style: { width: "60%" },
          })
        ),
        m(
          "p",
          m("ion-skeleton-text", {
            animated: "",
            style: { width: "80%" },
          })
        ),
        m(
          "p",
          m("ion-skeleton-text", {
            animated: "",
            style: { width: "60%" },
          })
        ),
        m(
          "p",
          m("ion-skeleton-text", {
            animated: "",
            style: { width: "80%" },
          })
        ),
        m(
          "p",
          m("ion-skeleton-text", {
            animated: "",
            style: { width: "60%" },
          })
        ),
      ]),
    ]),
}

export const SkeletonText = () => {
  return {
    view: () =>
      m("", { id: "skeleton" }, [
        m("ion-list", [
          m(SkeletonItem),
          m(SkeletonItem),
          m(SkeletonItem),
          m(SkeletonItem),
          m(SkeletonItem),
          m(SkeletonItem),
          m(SkeletonItem),
          m(SkeletonItem),
        ]),
      ]),
  }
}
