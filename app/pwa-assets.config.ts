import {
  combinePresetAndAppleSplashScreens,
  defineConfig,
  minimal2023Preset,
} from "@vite-pwa/assets-generator/config";

export default defineConfig({
  headLinkOptions: {
    preset: "2023",
  },
  preset: combinePresetAndAppleSplashScreens(minimal2023Preset, {
    padding: 0,
    resizeOptions: { background: "white", fit: "contain" },
    darkResizeOptions: { fit: "contain", background: "black" },
  }),
  images: ["../public/logo.svg"],
});
