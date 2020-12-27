import { toastController } from "@ionic/core"

export const Toaster = () => {
  return {
    view: ({ attrs: { mdl } }) =>
      m("ion-toast", {
        oncreate: ({ dom }) => {
          toastController
            .create({
              component: dom,
              message: mdl.toast.msg,
              duration: mdl.toast.duration || 2000,
              showCloseButton: true,
              animated: true,
              color: mdl.toast.status ? "success" : "danger",
            })
            .then((toast) => toast.present())
        },
      }),
  }
}
