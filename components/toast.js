const { toast } = require("react-toastify");

export default function Toast({ type, text }) {
  console.log("TYPE => ", type, ", TEXT => ", text);

  switch (type) {
    case "success":
      toast.success(text, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      break;
    case "error":
      toast.error(text, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
      break;
    default:
      toast.success(text, {
        position: toast.POSITION.TOP_CENTER,
        autoClose: 1500,
      });
  }
}
