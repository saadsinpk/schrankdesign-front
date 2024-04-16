import createSelectors from "./createSelectors"
import Config from "../../config"
import { create } from "zustand"
import { getArrayIndex, getMaxVariables } from "../utils/getInfo"

const useFurnishingStore = createSelectors(
  create((set, get) => ({
    furnishingAssets: [], // {xIndex, yIndex, type, position, scale, selected}
    maxHeight: 0,
    maxDepth: Config.plate.minDepth,
    originalBaseType: Config.baseType.panel,
    totalSpace: [],
    internalDrawerSides: [],
    ledAssets: [],
    doorAssets: [],
    platesInfo: [],
    addAsset: (payload) => {
      const { removal, asset, drawerShelf } = payload

      const furnishingAssets = [...get().furnishingAssets]

      if (asset.selected)
        furnishingAssets.forEach((asset) => {
          asset.selected = false
        })

      if (removal !== undefined) {
        furnishingAssets[
          getArrayIndex(
            get().furnishingAssets,
            removal.xIndex,
            removal.yPos,
            removal.inDivider,
            removal.d_xIndex,
            removal.d_yPos
          )
        ] = { ...asset }
      } else {
        furnishingAssets.push(asset)
      }

      const { maxHeight, maxDepth } = getMaxVariables(get().furnishingAssets)

      set({ furnishingAssets, maxHeight, maxDepth })

      // drawerShelf?.forEach((item) => {
      //   const yIndex = getSortedYIndex(
      //     get().furnishingAssets,
      //     asset.xIndex,
      //     asset.position[1],
      //     asset.inDivider,
      //     asset.d_xIndex,
      //     asset.d_yIndex
      //   )

      //   const targetYIndex =
      //     item.location === "top"
      //       ? yIndex + 1
      //       : item.location === "bottom"
      //       ? yIndex - 1
      //       : yIndex

      //   const arrayIndex = getArrayIndex(
      //     get().furnishingAssets,
      //     asset.xIndex,
      //     targetYIndex,
      //     asset.inDivider,
      //     asset.d_xIndex,
      //     asset.d_yIndex
      //   )

      //   const existingAsset = get().furnishingAssets[arrayIndex]

      //   if (existingAsset !== undefined) {
      //     if (item.topVisible !== undefined) {
      //       existingAsset.topVisible = item.topVisible
      //     }
      //     if (item.bottomVisible !== undefined) {
      //       existingAsset.bottomVisible = item.bottomVisible
      //     }
      //   }
      // })

      // get().furnishingAssets.map((asset) => (asset.sideVisible = true))

      // get().internalDrawerSides = getInternalDrawerSides(get().furnishingAssets)

      // get().internalDrawerSides.map((xAssets, xIndex) =>
      //   xAssets.map((asset) => {
      //     for (let i = asset.startYIndex; i <= asset.stopYIndex; i++) {
      //       get().furnishingAssets[xIndex][
      //         getArrayIndex(get().furnishingAssets[xIndex], i)
      //       ].sideVisible = false
      //     }
      //   })
      // )
    },
    updateSelected: (payload) => {
      const furnishingAssets = [...get().furnishingAssets]

      furnishingAssets.forEach((asset) => {
        asset.selected = false
      })

      if (payload.selected) {
        furnishingAssets[
          getArrayIndex(
            furnishingAssets,
            payload.xIndex,
            payload.yPos,
            payload.inDivider,
            payload.d_xIndex,
            payload.d_yPos
          )
        ].selected = payload.selected
      }

      set({ furnishingAssets })
    },
    removeAsset: (payload) => {
      const furnishingAssets = [...get().furnishingAssets]

      furnishingAssets.splice(
        getArrayIndex(
          furnishingAssets,
          payload.xIndex,
          payload.yPos,
          payload.inDivider,
          payload.d_xIndex,
          payload.d_yPos
        ),
        1
      )

      const { maxHeight, maxDepth } = getMaxVariables(furnishingAssets)

      set({ furnishingAssets, maxHeight, maxDepth })

      // furnishingAssets.forEach((asset) => (asset.sideVisible = true))

      // internalDrawerSides = getInternalDrawerSides(furnishingAssets)

      // internalDrawerSides.map((xAssets, xIndex) =>
      //   xAssets.map((asset) => {
      //     for (let i = asset.startYIndex; i <= asset.stopYIndex; i++) {
      //       furnishingAssets[xIndex][
      //         getArrayIndex(furnishingAssets[xIndex], i)
      //       ].sideVisible = false
      //     }
      //   })
      // )
    },
    setFurnishingAssets: (furnishingAssets) => {
      set({ furnishingAssets })
    },
    setOriginalBaseType: (originalBaseType) => {
      set({ originalBaseType })
    },
    setTotalSpace: (totalSpace) => {
      set({ totalSpace })
    },
    showDrawerShelf: (payload) => {
      const { type, xIndex, yPos, inDivider, d_xIndex, d_yPos } = payload

      const furnishingAssets = [...get().furnishingAssets]
      const arrayIndex = getArrayIndex(
        furnishingAssets,
        xIndex,
        yPos,
        inDivider,
        d_xIndex,
        d_yPos
      )

      // if (type === Config.furnishing.type.internalDrawer) {
      //   let removalYIndex = -1
      //   for (let j = 0; j < internalDrawerSides[xIndex].length; j++) {
      //     if (
      //       arrayYIndex >= internalDrawerSides[xIndex][j].startYIndex &&
      //       arrayYIndex <= internalDrawerSides[xIndex][j].stopYIndex
      //     ) {
      //       removalYIndex = j
      //       for (
      //         let i = internalDrawerSides[xIndex][j].startYIndex;
      //         i <= internalDrawerSides[xIndex][j].stopYIndex;
      //         i++
      //       ) {
      //         furnishingAssets[xIndex][
      //           getArrayIndex(furnishingAssets[xIndex], i)
      //         ].sideVisible = true
      //       }
      //       break
      //     }
      //   }

      //   if (removalYIndex !== -1) {
      //     internalDrawerSides[xIndex].splice(removalYIndex, 1)
      //   }
      // }

      // const topIndex = getArrayIndex(
      //   furnishingAssets,
      //   xIndex,
      //   yIndex + 1,
      //   inDivider,
      //   d_xIndex,
      //   d_yIndex
      // )

      // const bottomIndex = getArrayIndex(
      //   furnishingAssets,
      //   xIndex,
      //   yIndex - 1,
      //   inDivider,
      //   d_xIndex,
      //   d_yIndex
      // )

      // furnishingAssets[arrayIndex].topVisible = true
      // furnishingAssets[arrayIndex].bottomVisible = true

      // if (furnishingAssets[topIndex]?.bottomVisible === false) {
      //   furnishingAssets[topIndex].bottomVisible = true
      // }

      // if (furnishingAssets[bottomIndex]?.topVisible === false) {
      //   furnishingAssets[bottomIndex].topVisible = true
      // }
    },
    updateDrawerInfo: (payload) => {
      const {
        xIndex,
        yPos,
        inDivider,
        d_xIndex,
        d_yPos,
        topShelfDistance,
        positionY,
      } = payload

      const furnishingAssets = [...get().furnishingAssets]

      const arrayIndex = getArrayIndex(
        furnishingAssets,
        xIndex,
        yPos,
        inDivider,
        d_xIndex,
        d_yPos
      )

      furnishingAssets[arrayIndex].topShelfDistance = topShelfDistance

      if (positionY !== undefined) {
        furnishingAssets[arrayIndex].position[1] = positionY
      }

      set({ furnishingAssets })
    },
    addLed: (asset) => {
      const ledAssets = [...get().ledAssets]

      ledAssets.push(asset)

      set({ ledAssets })
    },
    moveLed: (payload) => {
      const ledAssets = [...get().ledAssets]
      const index = ledAssets.findIndex(
        (asset) => asset.xIndex === payload.former_xIndex
      )

      if (index !== -1)
        ledAssets[index] = {
          xIndex: payload.xIndex,
          position: payload.position,
          scale: payload.scale,
        }

      set({ ledAssets })
    },
    removeLed: (payload) => {
      const ledAssets = [...get().ledAssets]
      const index = ledAssets.findIndex(
        (asset) => asset.xIndex === payload.xIndex
      )

      if (index !== -1) ledAssets.splice(index, 1)
      set({ ledAssets })
    },
    setLedAssets: (ledAssets) => {
      set({ ledAssets })
    },
    updateDividerAsset: (payload) => {
      const { xIndex, yPos, scale, position, topShelfVisible, leftWidth } =
        payload

      const furnishingAssets = [...get().furnishingAssets]

      const arrayIndex = getArrayIndex(furnishingAssets, xIndex, yPos, false)

      if (scale !== undefined) furnishingAssets[arrayIndex].scale = scale

      if (position !== undefined)
        furnishingAssets[arrayIndex].position = position

      if (topShelfVisible !== undefined)
        furnishingAssets[arrayIndex].topShelfVisible = topShelfVisible

      if (leftWidth !== undefined) {
        furnishingAssets[arrayIndex].dividerLeftWidth = leftWidth
        const dividerScale = furnishingAssets[arrayIndex].scale
        const dividerPos = furnishingAssets[arrayIndex].position
        furnishingAssets.forEach((asset) => {
          if (
            asset.inDivider &&
            asset.d_xIndex === xIndex &&
            asset.d_yIndex === yPos
          ) {
            if (asset.xIndex === 0) {
              asset.scale[0] =
                asset.type === Config.furnishing.type.shelf ||
                asset.type === Config.furnishing.type.foldBottom ||
                asset.type === Config.furnishing.type.glassBottom ||
                asset.type === Config.furnishing.type.pantsPullout
                  ? leftWidth - Config.furnishing.default.spaceSides * 2
                  : asset.type === Config.furnishing.type.drawer
                  ? leftWidth - Config.furnishing.drawer.sideIncident * 2
                  : asset.type === Config.furnishing.type.internalDrawer
                  ? leftWidth -
                    (Config.furnishing.internalDrawer.panelSpace +
                      Config.furnishing.internalDrawer.panelWidth) *
                      2
                  : leftWidth
              asset.position[0] =
                dividerPos[0] - dividerScale[0] / 2 + leftWidth / 2
            } else {
              asset.scale[0] =
                asset.type === Config.furnishing.type.shelf ||
                asset.type === Config.furnishing.type.foldBottom ||
                asset.type === Config.furnishing.type.glassBottom ||
                asset.type === Config.furnishing.type.pantsPullout
                  ? dividerScale[0] -
                    leftWidth -
                    Config.furnishing.divider.thickness -
                    Config.furnishing.default.spaceSides * 2
                  : asset.type === Config.furnishing.type.drawer
                  ? dividerScale[0] -
                    leftWidth -
                    Config.furnishing.divider.thickness -
                    Config.furnishing.drawer.sideIncident * 2
                  : asset.type === Config.furnishing.type.internalDrawer
                  ? dividerScale[0] -
                    leftWidth -
                    Config.furnishing.divider.thickness -
                    (Config.furnishing.internalDrawer.panelSpace +
                      Config.furnishing.internalDrawer.panelWidth) *
                      2
                  : dividerScale[0] -
                    leftWidth -
                    Config.furnishing.divider.thickness

              asset.position[0] =
                dividerPos[0] +
                dividerScale[0] / 2 -
                (dividerScale[0] -
                  leftWidth -
                  Config.furnishing.divider.thickness) /
                  2
            }
          }
        })
      }

      set({ furnishingAssets })
    },
    addDoor: (payload) => {
      const { removal, asset } = payload

      const doorAssets = [...get().doorAssets]

      if (asset.selected)
        doorAssets.forEach((asset) => {
          asset.selected = false
        })

      if (removal !== undefined) {
        doorAssets[
          doorAssets.findIndex(
            (item) =>
              item.xIndex === removal.xIndex &&
              item.position[1] === removal.posY
          )
        ] = { ...asset }
      } else {
        doorAssets.push(asset)
      }

      set({ doorAssets })
    },
    removeDoor: (payload) => {
      const doorAssets = [...get().doorAssets]
      const index = doorAssets.findIndex(
        (asset) =>
          asset.xIndex === payload.xIndex && asset.position[1] === payload.posY
      )

      if (index !== -1) doorAssets.splice(index, 1)

      set({ doorAssets })
    },
    updateDoorSelected: (payload) => {
      const doorAssets = [...get().doorAssets]

      doorAssets.forEach((asset) => (asset.selected = false))

      if (payload.selected) {
        const index = doorAssets.findIndex(
          (asset) =>
            asset.xIndex === payload.xIndex &&
            asset.position[1] === payload.posY
        )

        if (index !== -1) doorAssets[index].selected = true
      }

      set({ doorAssets })
    },
    updateDoorAsset: (payload) => {
      const { xIndex, posY, position, scale, topAsset, bottomAsset } = payload

      const doorAssets = [...get().doorAssets]
      const index = doorAssets.findIndex(
        (asset) => asset.xIndex === xIndex && asset.position[1] === posY
      )

      if (index !== -1)
        doorAssets[index] = {
          ...doorAssets[index],
          position,
          scale,
          topAsset,
          bottomAsset,
        }

      set({ doorAssets })
    },
    setDoorAssets: (doorAssets) => {
      set({ doorAssets })
    },
    setPlatesInfo: (platesInfo) => {
      set({ platesInfo })
    },
  }))
)

export default useFurnishingStore
