import { extendTheme } from "@chakra-ui/react";

const config = {
  initialColorMode: "dark", // default mode is dark
  useSystemColorMode: false, // do not use system preference
};

const theme = extendTheme({
  config,
  semanticTokens: {
    colors: {
      "chakra-body-bg": {
        default: "white",
        _dark: "#212121",
      },
    },
  },
});

export default theme;
