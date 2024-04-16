import { useThree } from "@react-three/fiber"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import * as THREE from "three"
import { Html, Select } from "@react-three/drei"
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react"

import Config from "../../../config"
import { getDraggingInfo } from "../../utils/draggingInfo"
import { getBottom, getTop } from "../../utils/availableSpace"
import { formatNumber } from "../../utils/formatNumber"
import Drawer from "../common/drawer"
import InternalDrawer from "../common/internalDrawer"
import MeasureComponent from "./MeasureComponent"
import useDndStore from "../../zustand/dndStore"
import useDimensionStore from "../../zustand/dimensionStore"
import useCornerStore from "../../zustand/cornerStore"
import useFurnishingStore from "../../zustand/furnishingStore"

let intersects = new Array(1)

// show or hide top and bottom shelf of drawer
let drawerTopVisible = true
let drawerBottomVisible = true

// show or hide shelf of neighbors
let topConnected = false
let bottomConnected = false

let g_availableTop = 0
let g_availableBottom = 0

let topAssetType = "none"

const DrawerComponent = React.memo(function DrawerComponent({
  xIndex,
  inDivider,
  d_xIndex,
  d_yPos,
  type,
  initialScale,
  position,
  selected,
  spaceRef,
  topVisible,
  bottomVisible,
  sideVisible,
  topShelfDistance,
}) {
  const { size, camera, raycaster } = useThree()

  const [scale, setScale] = useState(initialScale)

  const [dragging, setDragging] = useState(false)

  const setDrawerHeight = useDndStore.use.setDrawerHeight()
  const setDrawerTopDistance = useDndStore.use.setDrawerTopDistance()
  const setType = useDndStore.use.setType()

  const setShowDimensions = useCornerStore.use.setShowDimensions()

  const addAsset = useFurnishingStore.use.addAsset()
  const removeAsset = useFurnishingStore.use.removeAsset()
  const showDrawerShelf = useFurnishingStore.use.showDrawerShelf()
  const updateDrawerInfo = useFurnishingStore.use.updateDrawerInfo()
  const updateSelected = useFurnishingStore.use.updateSelected()

  const setAssetDragging = useDndStore.use.setAssetDragging()

  // update scale based on initial scale change
  useEffect(() => {
    setScale(initialScale)
  }, [initialScale])

  const pointer = useMemo(() => new THREE.Vector2(), [])

  const ref = useRef()

  const viewOption = useCornerStore.use.viewOption()

  const height = useDimensionStore.use.height()
  const depth = useDimensionStore.use.depth()
  const width = useDimensionStore.use.width()
  const elementsCount = useDimensionStore.use.elementsCount()

  const [dragStarted, setDragStarted] = useState(true)

  // show or hide measurement
  // show measure while dragging assets
  const [showMeasure, setShowMeasure] = useState(false)
  const [measureInfo, setMeasureInfo] = useState({
    posX: 0,
    aboveTop: 0,
    aboveBottom: 0,
    belowTop: 0,
    belowBottom: 0,
  })

  useEffect(() => {
    if (!dragStarted) {
      setShowDimensions(false)

      setAssetDragging(true)
      if (!topVisible || !bottomVisible) {
        showDrawerShelf({
          type,
          xIndex,
          yPos: position[1],
          inDivider,
          d_xIndex,
          d_yPos,
        })
      }
    }
  }, [dragStarted])

  const handleDragStart = useCallback(() => {
    if (!selected) {
      updateSelected({
        xIndex,
        yPos: position[1],
        selected: true,
        inDivider,
        d_xIndex,
        d_yPos,
      })
    }

    setType(type)
    setDrawerHeight(scale[1])
    if (type === Config.furnishing.type.drawer) {
      setDrawerTopDistance(topShelfDistance)
    }
    setDragStarted(true)
  }, [type, scale, selected, topShelfDistance, xIndex, position])

  const handleDrag = useCallback(
    (state) => {
      if (state.elapsedTime < 100) return

      if (state.delta[0] === 0 && state.delta[1] === 0) return

      setDragStarted(false)
      setDragging(true)

      pointer.x = ((state.values[0] - size.left) / size.width) * 2 - 1
      pointer.y = -((state.values[1] - size.top) / size.height) * 2 + 1

      raycaster.setFromCamera(pointer, camera)

      intersects = raycaster.intersectObjects(spaceRef.children, true)

      if (intersects[0] !== undefined) {
        if (intersects[0].object.name === "available") {
          const {
            top,
            bottom,
            topAsset,
            bottomAsset,
            availableTop,
            availableBottom,
          } = intersects[0].object.userData

          topAssetType = topAsset
          const result = getDraggingInfo({
            type,
            top,
            bottom,
            topAsset,
            bottomAsset,
            initialPosY: intersects[0].point.y * 100 + height / 2,
            raster: Config.furnishing.default.raster,
            availableWidth: intersects[0].object.geometry.parameters.width,
            objectHeight: scale[1],
          })

          drawerTopVisible = result.topVisible
          drawerBottomVisible = result.bottomVisible
          topConnected = result.topConnected
          bottomConnected = result.bottomConnected

          ref.current?.position.set(
            intersects[0].object.position.x,
            result.posY,
            position[2]
          )

          if (
            scale[0] !== result.objectWidth ||
            scale[1] !== initialScale[1] ||
            scale[2] !== initialScale[2]
          ) {
            setScale([result.objectWidth, initialScale[1], initialScale[2]])
          }

          setShowMeasure(true)

          const tempMeasureInfo = {
            posX: intersects[0].object.position.x,
            aboveTop: availableTop,
            aboveBottom: getBottom(
              result.posY,
              scale[1],
              type,
              topShelfDistance
            ),
            belowTop: getTop(result.posY, scale[1], type),
            belowBottom: availableBottom,
          }

          if (JSON.stringify(measureInfo) !== JSON.stringify(tempMeasureInfo)) {
            setMeasureInfo(tempMeasureInfo)
          }
        } else {
          drawerTopVisible = true
          topConnected = false

          drawerBottomVisible = true
          bottomConnected = false

          ref.current?.position.set(
            intersects[0].point.x * 100 + width / 2,
            intersects[0].point.y * 100 + height / 2,
            depth + depth / 2
          )

          setShowMeasure(false)
        }
      }
    },
    [ref, spaceRef, measureInfo]
    // [ref, scale, initialScale, spaceRef, dragStarted, showMeasure]
  )

  const handleDragEnd = useCallback(
    (state) => {
      if (
        state.values[0] === state.initial[0] &&
        state.values[1] === state.initial[1]
      ) {
        // dispatch(updateSelected({ xIndex, yIndex, selected: true }))
        return
      }

      setShowMeasure(false)

      if (intersects[0].object.name === "available") {
        const payload = {}

        payload.removal = {
          xIndex,
          yPos: position[1],
          inDivider,
          d_xIndex,
          d_yPos,
        }

        payload.asset = {
          xIndex: intersects[0].object.userData.xIndex,
          inDivider: intersects[0].object.userData.inDivider,
          d_xIndex: intersects[0].object.userData.d_xIndex,
          d_yIndex: intersects[0].object.userData.d_yIndex,
          position: [
            ref.current.position.x,
            ref.current.position.y,
            ref.current.position.z,
          ],
          scale: scale,
          type,
          selected: true,
          topVisible: drawerTopVisible,
          bottomVisible: drawerBottomVisible,
          sideVisible: true,
          topShelfDistance:
            type === Config.furnishing.type.drawer
              ? topShelfDistance
              : undefined,
          topShelfVisible:
            type === Config.furnishing.type.divider &&
            (topAssetType === Config.furnishing.type.slopingFloor ||
              topAssetType === Config.furnishing.type.clothesLift ||
              topAssetType === Config.furnishing.type.clothesRail ||
              topAssetType === Config.furnishing.type.pantsPullout)
              ? true
              : false,
          dividerLeftWidth:
            type === Config.furnishing.type.divider
              ? (scale[0] - Config.furnishing.divider.thickness) / 2
              : undefined,
        }

        payload.drawerShelf = []
        if (topConnected) {
          payload.drawerShelf.push({
            location: "top",
            bottomVisible: !topConnected,
          })
        }
        if (bottomConnected) {
          payload.drawerShelf.push({
            location: "bottom",
            topVisible: !bottomConnected,
          })
        }

        addAsset(payload)
      } else {
        removeAsset({ xIndex, yPos: position[1] })
      }

      setAssetDragging(false)
    },
    [ref, scale, topShelfDistance, xIndex]
  )

  const useGesture = createUseGesture([dragAction, pinchAction])

  const bind = useGesture(
    {
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
    },
    { enabled: viewOption === Config.view.front }
  )

  const handlePointerOver = useCallback(() => {
    document.body.style.cursor = "pointer"
  }, [])

  const handlePointerOut = useCallback(() => {
    document.body.style.cursor = "auto"
  }, [])

  const [drawerHeightValue, setDrawerHeightValue] = useState("")

  useEffect(() => {
    setDrawerHeightValue(
      (topShelfDistance === undefined
        ? 0
        : initialScale[1] +
          topShelfDistance +
          Config.furnishing.drawer.bottomShelfDistance +
          2 * Config.furnishing.drawer.shelfThickness1
      ).toFixed(1)
    )
  }, [initialScale, topShelfDistance])

  useEffect(() => {
    setTimeout(() => {
      // if (selected) {
      //   if (type === Config.furnishing.type.drawer) {
      //     g_availableTop = 0
      //     g_availableBottom = 0
      //     spaceRef?.children.map((mesh) => {
      //       if (
      //         mesh.userData.xIndex === xIndex &&
      //         mesh.userData.yIndex === yIndex
      //       ) {
      //         g_availableTop =
      //           mesh.userData.topAsset === "none"
      //             ? mesh.userData.availableTop +
      //               Config.furnishing.drawer.shelfThickness1
      //             : mesh.userData.availableTop
      //         g_availableBottom =
      //           mesh.userData.topAsset === "none"
      //             ? mesh.userData.bottom -
      //               Config.furnishing.drawer.shelfThickness1
      //             : mesh.userData.bottom
      //       }
      //     })
      //   } else if (type === Config.furnishing.type.divider) {
      //     spaceRef?.children.map((mesh) => {
      //       if (
      //         mesh.userData.xIndex === xIndex &&
      //         mesh.userData.yIndex === yIndex
      //       ) {
      //         g_availableTop = mesh.userData.availableTop
      //         g_availableBottom = mesh.userData.bottom
      //         topAssetType = mesh.userData.topAsset
      //       }
      //     })
      //     dispatch(setShowDividerInfo(true))
      //     const assetInfo = {
      //       xIndex: xIndex,
      //       yIndex: yIndex,
      //       scale: scale,
      //       position: position,
      //       topAsset: topAssetType,
      //       leftWidth: dividerLeftWidth,
      //       bottom: g_availableBottom,
      //       maxHeight: g_availableTop - g_availableBottom,
      //     }
      //     dispatch(setAssetInfo(assetInfo))
      //   }
      // }
    }, 0)
  }, [selected, type, xIndex, scale, spaceRef])

  const handleDrawerHeight = useCallback(
    (drawerHeight) => {
      const tempTopShelfDistance =
        drawerHeight -
        scale[1] -
        Config.furnishing.drawer.bottomShelfDistance -
        Config.furnishing.drawer.shelfThickness1 * 2

      if (tempTopShelfDistance < Config.furnishing.drawer.topShelfDistance) {
        alert(
          "Minimum of drawer front height is ",
          scale[1] +
            Config.furnishing.drawer.bottomShelfDistance +
            Config.furnishing.drawer.topShelfDistance +
            Config.furnishing.drawer.shelfThickness1 * 2
        )
        return false
      }

      if (drawerHeight > scale[1] + 10) {
        alert("Maximum is ", scale[1] + 10)
        return false
      }

      if (g_availableTop === 0 && g_availableBottom === 0) {
        alert("not enough available space!")
        return false
      }

      if (
        position[1] +
          scale[1] / 2 +
          tempTopShelfDistance +
          Config.furnishing.drawer.shelfThickness1 <
        g_availableTop
      ) {
        updateDrawerInfo({
          xIndex,
          yPos: position[1],
          topShelfDistance: tempTopShelfDistance,
          inDivider,
          d_xIndex,
          d_yPos,
        })
      } else if (
        position[1] -
          scale[1] / 2 -
          Config.furnishing.drawer.bottomShelfDistance -
          Config.furnishing.drawer.shelfThickness1 >
        g_availableBottom
      ) {
        updateDrawerInfo({
          xIndex,
          yPos: position[1],
          topShelfDistance: tempTopShelfDistance,
          positionY:
            g_availableTop -
            Config.furnishing.drawer.shelfThickness1 -
            tempTopShelfDistance -
            scale[1] / 2,
          inDivider,
          d_xIndex,
          d_yPos,
        })
      } else {
        alert("not enough available space!")
        return false
      }

      return true
    },
    [scale, position, topShelfDistance]
  )

  const handleHeightChange = useCallback((e) => {
    setDrawerHeightValue(e.target.value)
  })

  const handleHeightBlur = useCallback(() => {
    const fixedNumber = Math.round(formatNumber(drawerHeightValue))

    if (handleDrawerHeight(fixedNumber))
      setDrawerHeightValue(fixedNumber.toFixed(1))
  }, [drawerHeightValue, position])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") {
        e.preventDefault()

        const fixedNumber = Math.round(formatNumber(drawerHeightValue))
        if (handleDrawerHeight(fixedNumber))
          setDrawerHeightValue(fixedNumber.toFixed(1))
      }
    },
    [drawerHeightValue, position]
  )

  const decreaseDrawerHeight = useCallback(
    (e) => {
      e.preventDefault()

      const fixedNumber = formatNumber(drawerHeightValue) - 1

      if (handleDrawerHeight(fixedNumber))
        setDrawerHeightValue(fixedNumber.toFixed(1))
    },
    [drawerHeightValue, position]
  )

  const increaseDrawerHeight = useCallback(
    (e) => {
      e.preventDefault()

      const fixedNumber = formatNumber(drawerHeightValue) + 1
      if (handleDrawerHeight(fixedNumber))
        setDrawerHeightValue(fixedNumber.toFixed(1))
    },
    [drawerHeightValue, position]
  )

  return (
    <group>
      <group
        {...bind()}
        ref={ref}
        // eslint-disable-next-line react/no-unknown-property
        position={position}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <Select enabled={selected}>
          {type === Config.furnishing.type.drawer && (
            <Drawer
              scale={scale}
              depth={depth}
              elementIndex={
                xIndex === 0
                  ? Config.elementIndex.first
                  : xIndex === elementsCount - 1
                  ? Config.elementIndex.last
                  : Config.elementIndex.middle
              }
              topVisible={topVisible}
              bottomVisible={bottomVisible}
              topShelfDistance={topShelfDistance}
            />
          )}

          {type === Config.furnishing.type.internalDrawer && (
            <InternalDrawer
              scale={scale}
              depth={depth}
              topVisible={topVisible}
              bottomVisible={bottomVisible}
              sideVisible={sideVisible}
            />
          )}
        </Select>
      </group>
      {selected && !dragging && (
        <Html position={[0, 0, depth - position[2]]} center>
          <div className="flex gap-0 text-black-700 bg-white">
            <button
              className="bg-white w-6 border-[1px] border-[#000000]"
              onClick={decreaseDrawerHeight}
            >
              -
            </button>
            <input
              type="number"
              className="w-[60px] text-center"
              value={drawerHeightValue}
              min={0}
              step={0.1}
              onChange={handleHeightChange}
              onBlur={handleHeightBlur}
              onKeyDown={handleKeyDown}
            />
            <button
              className="bg-white w-6 border-[1px] border-[#000000]"
              onClick={increaseDrawerHeight}
            >
              +
            </button>
          </div>
        </Html>
      )}
      <MeasureComponent
        measureInfo={measureInfo}
        showMeasure={showMeasure}
        depth={depth}
      />
    </group>
  )
})

export default DrawerComponent
