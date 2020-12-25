export const Paginator = () => {
  return {
    view: ({ attrs: { state, fetchDataFor } }) => {
      let total = Math.ceil(state.total / state.limit) + 1
      let current = state.offset / state.limit + 1
      let range = [...Array(total).keys()].slice(1)
      return (
        state.total > state.limit &&
        range.map((page, idx) => {
          return m(
            "ion-chip",
            {
              color: page == current && "primary",
              onclick: (e) => fetchDataFor(idx * state.limit),
            },
            page
          )
        })
      )
    },
  }
}
