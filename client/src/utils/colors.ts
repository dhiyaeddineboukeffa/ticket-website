export const toColor = (color: string | undefined | null) => {
  switch (color) {
    case "success":
      return "#58C235";
    case "error":
      return "#FB5050";
    case "warning":
      return "#F7AD30";
    default:
      return "#ADADAD";
  }
};


