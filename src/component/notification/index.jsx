import { notification } from "antd";

const Notify = (toastType, toastContent, toastDuration = 4) => {
  notification.open({
    type: toastType, //error, info, succ3ess, warning
    message: toastContent, //Message to be notified
    duration: toastDuration, //Duration of the toast
  });
};

export default Notify;
