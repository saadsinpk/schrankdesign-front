import createSelectors from "./createSelectors"
import Config from "../../config"
import { create } from "zustand"

const useDimensionStore = createSelectors(
  create((set) => ({
    width: Config.plate.width,
    height: Config.plate.height,
    depth: Config.plate.depth,
    manual: false,
    elementsCount: Config.init.elementsCount, // number of elements
    elementsWidths: Array(Config.init.elementsCount).fill(
      Number(
        (
          (Config.plate.width - Config.plate.thickness) /
            Config.init.elementsCount -
          Config.plate.thickness
        ).toFixed(1)
      )
    ),
    eWidthsFixed: Array(Config.init.elementsCount).fill(false),
    baseType: Config.baseType.panel,
    enableCutout: false,
    cutoutDepth: Config.cutout.depth,
    cutoutHeight: Config.cutout.height,
    enableFittingPanel: false,
    fittingType: Config.fittingType.all,
    isCornerView: false,
    setWidth: (width) => set({width}),
    setHeight: (height) => set({height}),
    setDepth: (depth) => set({depth}),
    setManual: (manual) => set({manual}),
    setElementsCount: (elementsCount) => set({elementsCount}),
    setElementsWidths: (elementsWidths) => set({elementsWidths}),
    setEWidthsFixed: (eWidthsFixed) => set({eWidthsFixed}),
    setBaseType: (baseType) => set({baseType}),
    setEnableCoutout: (enableCutout) => set({enableCutout}),
    setCutoutDepth: (cutoutDepth) => set({cutoutDepth}),
    setCutoutHeight: (cutoutHeight) => set({cutoutHeight}),
    setEnableFittingPanel: (enableFittingPanel) => set({enableFittingPanel}),
    setFittingType: (fittingType) => set({fittingType}),
    setCornerView: (isCornerView) => set({isCornerView}),
  }))
)

export default useDimensionStore