export const SkeletonText = () => {
  return {
    view: () =>
      m("", { id: "skeleton" }, [
        m("", [
          m("ion-skeleton-text", { animated: "", style: { width: "60%" } }),
          m("ion-skeleton-text", { animated: "" }),
          m("ion-skeleton-text", { animated: "", style: { width: "88%" } }),
          m("ion-skeleton-text", { animated: "", style: { width: "70%" } }),
          m("ion-skeleton-text", { animated: "", style: { width: "60%" } }),
        ]),
        m("ion-list", [
          m(
            "ion-list-header",
            m(
              "ion-label",
              m("ion-skeleton-text", { animated: "", style: { width: "20%" } })
            )
          ),
          m("ion-item", [
            m("ion-avatar", m("ion-skeleton-text", { animated: "" })),
            m("ion-label", [
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
            ]),
          ]),
          m("ion-item", [
            m(
              "ion-thumbnail",
              { slot: "start" },
              m("ion-skeleton-text", { animated: "" })
            ),
            m("ion-label", [
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
            ]),
          ]),
          m("ion-item", [
            m("ion-skeleton-text", {
              animated: "",
              slot: "start",
              style: { width: "27px", height: "27px" },
            }),
            m("ion-label", [
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
            ]),
          ]),
        ]),
      ]),
  }
}
