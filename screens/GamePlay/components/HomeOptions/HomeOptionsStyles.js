import { StyleSheet } from "react-native";
import { moderateScale, verticalScale } from "../../../styles/Dimensions";

const styles = StyleSheet.create({
  buttonContainer: {
    height: "100%",
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },

  buttonWrapper: {
    gap: verticalScale(30),
  },
});

export { styles };