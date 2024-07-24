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
    png: {
      compressionLevel: 9,
      quality: 60,
    },
    name: (landscape, size, dark) => {
      return `apple-splash-${landscape ? "landscape" : "portrait"}-${
        typeof dark === "boolean" ? (dark ? "dark-" : "light-") : ""
      }${size.width}x${size.height}.png`;
    },
  }),
  images: ["../public/logo.svg"],
});
