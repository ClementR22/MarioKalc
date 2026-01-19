import i18n, { translateParts } from "@/translations";
import ToastManager, { ToastType, VisibilityTime } from "./ToastManager";

function showToast(messageKey: string, type?: ToastType, visibilityTime?: VisibilityTime) {
  let prefix = "";
  if (type === "error") {
    prefix = i18n.t("toast:error") + i18n.t("text:colon");
  } else if (type === "importError") {
    prefix = i18n.t("toast:importError") + i18n.t("text:colon");
  } else if (type === "success") {
    prefix = i18n.t("toast:success") + i18n.t("text:colon");
  }
  const finalMessage = prefix + translateParts(messageKey);

  let isError = false;
  if (type === "error" || type === "importError") {
    visibilityTime = 4000;
    isError = true;
  }

  ToastManager.show(finalMessage, visibilityTime, isError);
}

export default showToast;
