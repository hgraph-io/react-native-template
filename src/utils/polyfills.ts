import "@ethersproject/shims";
import "@walletconnect/react-native-compat";
import "@react-native-anywhere/polyfill-base64";
import { polyfill } from "react-native-polyfill-globals/src/encoding";

polyfill();

// mock for matchMedia in @walletconnect/modal-core
window.matchMedia =
  window.matchMedia ||
  function () {
    return {
      matches: true,
      addListener: function () {},
      removeListener: function () {},
    };
  };
