import createSelectors from "./createSelectors"
import Config from "../../config"
import { create } from "zustand"

const useColorStoreBase = create((set) => ({
  bodyType: Config.color.type.color,
  bodyTexture: Config.color.color.type0,
  frontType: Config.color.type.wood,
  frontTexture: Config.color.wood.type1,
  setBodyType: (bodyType) => set({ bodyType }),
  setBodyTexture: (bodyTexture) => set({ bodyTexture }),
  setFrontType: (frontType) => set({ frontType }),
  setFrontTexture: (frontTexture) => set({ frontTexture }),
}))

const useColorStore = createSelectors(useColorStoreBase)

export default useColorStore
