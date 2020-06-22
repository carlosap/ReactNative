import React from "react";
import { View, Text } from "react-native";
import { Colors } from "../styles";

const ErrorContainer = props => {
  const { msg, color } = props;

  return (
    <View>
      <Text style={[{ color: Colors.red }, { color: color }]}>{msg}</Text>
    </View>
  );
};

export default ErrorContainer;
