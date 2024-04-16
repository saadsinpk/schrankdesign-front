/* eslint-disable react/no-unknown-property */
import { createUseGesture, dragAction, pinchAction } from "@use-gesture/react"
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useLoader, useThree } from "@react-three/fiber"
import * as THREE from "three"

import Door from "../common/door"
import Config from "../../../config"
import useDndStore from "../../zustand/dndStore"
import useDimensionStore from "../../zustand/dimensionStore"
import useCornerStore from "../../zustand/cornerStore"
import useFurnishingStore from "../../zustand/furnishingStore"

let intersects = new Array(1)

const RoundedShape = React.memo(function RoundedShape({
  width,
  visible,
  upward,
}) {
  const shape = useMemo(
    () =>
      new THREE.Shape()
        .moveTo(-width * 0.5, 0)
        .quadraticCurveTo(
          -width * 0.5,
          upward ? 8 : -8,
          -width * 0.5 + 8,
          upward ? 8 : -8
        )
        .lineTo(width * 0.5 - 8, upward ? 8 : -8)
        .quadraticCurveTo(width * 0.5, upward ? 8 : -8, width * 0.5, 0)
        .lineTo(-width * 0.5, 0),
    [width]
  )
  return (
    <mesh visible={visible}>
      <shapeGeometry args={[shape]} />
      <meshBasicMaterial color={0x577e60} />
    </mesh>
  )
})

const DoorComponent = React.memo(function DoorComponent({
  initialXIndex,
  initialScale,
  position,
  spaceRef,
  initialDoorType,
  initialDoorCategory,
  initialTopAsset,
  initialBottomAsset,
  initialElementIndex,
  selected,
  id,
}) {
  const [scale, setScale] = useState(initialScale)
  const [doorType, setDoorType] = useState(initialDoorType)
  const [top_asset, setTop_asset] = useState(initialTopAsset)
  const [bottom_asset, setBottom_asset] = useState(initialBottomAsset)
  const [elementIndex, setElementIndex] = useState(initialElementIndex)

  const totalSpace = useFurnishingStore.use.totalSpace()
  const furnishingAssets = useFurnishingStore.use.furnishingAssets()

  const assetDragging = useDndStore.use.assetDragging()
  const setAssetDragging = useDndStore.use.setAssetDragging()
  const setType = useDndStore.use.setType()

  const addDoor = useFurnishingStore.use.addDoor()
  const removeDoor = useFurnishingStore.use.removeDoor()
  const updateDoorAsset = useFurnishingStore.use.updateDoorAsset()
  const updateDoorSelected = useFurnishingStore.use.updateDoorSelected()

  const [availableData, setAvailableData] = useState({
    assets: [],
    innerAssets: [],
    top: 0,
    bottom: 0,
    topAssetType: "none",
    bottomAssetType: "none",
  })

  useEffect(() => {
    const space = totalSpace.find(
      (item) =>
        item.xIndex === initialXIndex &&
        item.availableBottom <= position[1] &&
        item.availableTop >= position[1]
    )

    if (!space) {
      // Handle the case where space is not found.
      return
    }

    const filterAndSortAssets = (item) =>
      !item.inDivider &&
      item.xIndex === initialXIndex &&
      item.position[1] >= space.availableBottom &&
      item.position[1] <= space.availableTop &&
      [
        Config.furnishing.type.shelf,
        Config.furnishing.type.foldBottom,
        Config.furnishing.type.pantsPullout,
      ].includes(item.type)

    const filteredAssets = furnishingAssets
      .filter(filterAndSortAssets)
      .sort((a, b) => a.position[1] - b.position[1])

    const innerAssets = filteredAssets.filter((item) => {
      return (
        item.position[1] - item.scale[1] * 0.5 <
          position[1] + scale[1] * 0.5 - 0.1 &&
        item.position[1] + item.scale[1] * 0.5 >
          position[1] - scale[1] * 0.5 + 0.1
      )
    })

    setAvailableData({
      assets: filteredAssets,
      top: space.availableTop,
      bottom: space.availableBottom,
      topAssetType: space.topAsset,
      bottomAssetType: space.bottomAsset,
      innerAssets: innerAssets,
    })
  }, [totalSpace, position, scale, initialXIndex, furnishingAssets])

  // Access the state values like this:
  const { assets, top, bottom, topAssetType, innerAssets, bottomAssetType } =
    availableData

  useEffect(() => {
    setScale(initialScale)
    setDoorType(initialDoorType)
    setTop_asset(initialTopAsset)
    setBottom_asset(initialBottomAsset)
    setElementIndex(initialElementIndex)
    setShowControl(true)
  }, [
    initialScale,
    initialDoorType,
    initialTopAsset,
    initialBottomAsset,
    initialElementIndex,
  ])

  const height = useDimensionStore.use.height()
  const depth = useDimensionStore.use.depth()
  const width = useDimensionStore.use.width()
  const elementsCount = useDimensionStore.use.elementsCount()

  const ref = useRef()

  const { size, camera, raycaster } = useThree()

  const pointer = useMemo(() => new THREE.Vector2(), [])

  const useGesture = createUseGesture([dragAction, pinchAction])

  const [dragStarted, setDragStarted] = useState(true)

  useEffect(() => {
    if (!dragStarted) {
      setShowControl(false)
      setAssetDragging(true)
    }
  }, [dragStarted])

  const handleDragStart = useCallback(
    (state) => {
      state.event.stopPropagation()

      setDragStarted(true)
      setType(Config.furnishing.type.door)
    },
    [initialXIndex, position]
  )

  const handleDrag = useCallback(
    (state) => {
      state.event.stopPropagation()

      if (state.elapsedTime < 100) return

      if (state.delta[0] === 0 && state.delta[1] === 0) return

      setDragStarted(false)

      pointer.x = ((state.values[0] - size.left) / size.width) * 2 - 1
      pointer.y = -((state.values[1] - size.top) / size.height) * 2 + 1

      raycaster.setFromCamera(pointer, camera)

      intersects = raycaster.intersectObjects(spaceRef.children, true)

      if (intersects[0] !== undefined) {
        if (intersects[0].object.name === "available") {
          const { xIndex, topAsset, bottomAsset } =
            intersects[0].object.userData

          const tempElementIndex =
            xIndex === 0
              ? Config.elementIndex.first
              : xIndex === elementsCount - 1
              ? Config.elementIndex.last
              : Config.elementIndex.middle

          setElementIndex(tempElementIndex)

          setTop_asset(topAsset)

          setBottom_asset(bottomAsset)

          const doorWidth = intersects[0].object.geometry.parameters.width
          if (
            initialDoorType === Config.door.type.revolving_left ||
            initialDoorType === Config.door.type.revolving_right
          ) {
            if (
              doorWidth >= Config.door.left_type_range.min &&
              doorWidth <= Config.door.left_type_range.max
            ) {
              setDoorType(initialDoorType)
            } else {
              setDoorType(Config.door.type.revolving_double)
            }
          } else if (initialDoorType === Config.door.type.revolving_double) {
            if (
              doorWidth >= Config.door.double_type_range.min &&
              doorWidth <= Config.door.double_type_range.max
            ) {
              setDoorType(initialDoorType)
            } else {
              setDoorType(Config.door.type.revolving_left)
            }
          }

          ref.current?.position.set(
            intersects[0].object.position.x,
            intersects[0].object.position.y,
            position[2]
          )

          if (
            scale[0] !== intersects[0].object.geometry.parameters.width ||
            scale[1] !== intersects[0].object.geometry.parameters.height ||
            scale[2] !== initialScale[2]
          ) {
            setScale([
              intersects[0].object.geometry.parameters.width,
              intersects[0].object.geometry.parameters.height,
              initialScale[2],
            ])
          }
        } else {
          ref.current?.position.set(
            intersects[0].point.x * 100 + width * 0.5,
            intersects[0].point.y * 100 + height * 0.5,
            depth + depth * 0.5
          )
        }
      }
    },
    [scale, spaceRef, initialDoorType]
    // [elementIndex, top_asset, bottom_asset, elementsCount, scale]
  )

  const handleDragEnd = useCallback(
    (state) => {
      state.event.stopPropagation()

      if (
        state.values[0] === state.initial[0] &&
        state.values[1] === state.initial[1]
      ) {
        return
      }

      setAssetDragging(false)

      if (intersects[0].object.name === "available") {
        const payload = {}

        payload.removal = { xIndex: initialXIndex, posY: position[1] }

        payload.asset = {
          xIndex: intersects[0].object.userData.xIndex,
          position: [
            ref.current?.position.x,
            ref.current?.position.y,
            ref.current?.position.z,
          ],
          scale,
          type: Config.furnishing.type.door,
          doorType: doorType,
          doorCategory: initialDoorCategory,
          topAsset: top_asset,
          bottomAsset: bottom_asset,
          elementIndex: elementIndex,
          selected: true,
          id,
        }
        addDoor(payload)
        setShowControl(true)
      } else {
        removeDoor({ xIndex: initialXIndex, posY: position[1] })
      }
    },
    [
      scale,
      initialXIndex,
      position,
      elementIndex,
      top_asset,
      bottom_asset,
      doorType,
    ]
  )

  const openDoor = useCornerStore.use.openDoor()
  const viewOption = useCornerStore.use.viewOption()

  const bind = useGesture(
    {
      onDragStart: handleDragStart,
      onDrag: handleDrag,
      onDragEnd: handleDragEnd,
    },
    { enabled: viewOption === Config.view.front }
  )

  // const handleDragStartTop = useCallback((state) => {
  //   state.event.stopPropagation()
  //   console.log("top Start")
  // }, [])

  // const handleDragTop = useCallback((state) => {
  //   state.event.stopPropagation()
  //   console.log("top Dragging")
  // }, [])

  // const handleDragEndTop = useCallback((state) => {
  //   state.event.stopPropagation()
  //   console.log("top end")
  // }, [])

  // const useGestureTop = createUseGesture([dragAction, pinchAction])

  // const bindTop = useGestureTop({
  //   onDragStart: handleDragStartTop,
  //   onDrag: handleDragTop,
  //   onDragEnd: handleDragEndTop,
  // })

  const [trashMap, arrowUpMap, arrowDownMap] = useLoader(THREE.TextureLoader, [
    "/images/furnishing/doors/trash_blue.png",
    "/images/furnishing/doors/arrow_up_green.png",
    "/images/furnishing/doors/arrow_down_green.png",
  ])

  const [showControl, setShowControl] = useState(true)

  return (
    <>
      <group {...bind()} ref={ref} position={position}>
        <group
          onPointerOver={(e) => {
            e.stopPropagation()

            if (assetDragging) return

            if (!selected)
              updateDoorSelected({
                xIndex: initialXIndex,
                posY: position[1],
                selected: true,
              })
            setShowControl(true)
          }}
          onPointerOut={(e) => {
            e.stopPropagation()

            if (assetDragging) return

            setShowControl(false)
          }}
        >
          <Door
            scale={scale}
            door_type={doorType}
            door_category={initialDoorCategory}
            elementIndex={elementIndex}
            topAsset={top_asset}
            bottomAsset={bottom_asset}
            visible={true}
            withAnimation={true}
          />
        </group>
        <group visible={selected && !assetDragging && showControl && !openDoor}>
          <group
            // {...bindTop()}
            position={[0, scale[1] * 0.5, scale[2] * 0.5 + 1]}
          >
            <RoundedShape width={scale[0]} upward={false} visible={true} />
            {innerAssets.length > 0 &&
              innerAssets[innerAssets.length - 1].position[1] -
                innerAssets[innerAssets.length - 1].scale[1] * 0.5 -
                (position[1] - scale[1] * 0.5) >
                Config.door.min_height && (
                <mesh
                  onPointerOver={() => {
                    document.body.style.cursor = "pointer"
                  }}
                  onPointerOut={() => {
                    document.body.style.cursor = "auto"
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    document.body.style.cursor = "auto"
                    const targetScaleY =
                      innerAssets[innerAssets.length - 1].position[1] -
                      innerAssets[innerAssets.length - 1].scale[1] * 0.5 -
                      (position[1] - scale[1] * 0.5)

                    const targetPosY =
                      targetScaleY * 0.5 + (position[1] - scale[1] * 0.5)

                    updateDoorAsset({
                      xIndex: initialXIndex,
                      posY: position[1],
                      position: [position[0], targetPosY, position[2]],
                      scale: [scale[0], targetScaleY, scale[2]],
                      topAsset: innerAssets[innerAssets.length - 1].type,
                      bottomAsset: bottom_asset,
                    })
                  }}
                  position={[
                    top > position[1] + scale[1] * 0.5 + 0.1 ? -10 : 0,
                    -6,
                    1,
                  ]}
                >
                  <circleGeometry args={[5]} />
                  <meshBasicMaterial map={arrowDownMap} />
                </mesh>
              )}
            {top > position[1] + scale[1] * 0.5 + 0.1 && (
              <mesh
                onPointerOver={() => {
                  document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                  document.body.style.cursor = "auto"
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  document.body.style.cursor = "auto"
                  const filteredAssets = assets.filter(
                    (item) =>
                      item.position[1] - item.scale[1] * 0.5 >
                      position[1] + scale[1] * 0.5 + 0.1
                  )

                  const payload = {
                    xIndex: initialXIndex,
                    bottomAsset: bottom_asset,
                    posY: position[1],
                  }
                  if (filteredAssets[0] === undefined) {
                    payload.position = [
                      position[0],
                      (top + (position[1] - scale[1] * 0.5)) * 0.5,
                      position[2],
                    ]
                    payload.scale = [
                      scale[0],
                      top - (position[1] - scale[1] * 0.5),
                      scale[2],
                    ]
                    payload.topAsset = topAssetType
                  } else {
                    payload.scale = [
                      scale[0],
                      filteredAssets[0].position[1] -
                        filteredAssets[0].scale[1] * 0.5 -
                        (position[1] - scale[1] * 0.5),
                      scale[2],
                    ]
                    payload.position = [
                      position[0],
                      (filteredAssets[0].position[1] -
                        filteredAssets[0].scale[1] * 0.5 +
                        (position[1] - scale[1] * 0.5)) /
                        2,
                      position[2],
                    ]
                    payload.topAsset = filteredAssets[0].type
                  }

                  updateDoorAsset(payload)
                }}
                position={[
                  innerAssets.length > 0 &&
                  innerAssets[innerAssets.length - 1].position[1] -
                    innerAssets[innerAssets.length - 1].scale[1] * 0.5 -
                    (position[1] - scale[1] * 0.5) >
                    Config.door.min_height
                    ? 10
                    : 0,
                  -6,
                  1,
                ]}
              >
                <circleGeometry args={[5]} />
                <meshBasicMaterial map={arrowUpMap} />
              </mesh>
            )}
          </group>
          <group
            position={[0, -scale[1] * 0.5, scale[2] * 0.5 + 1]}
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <RoundedShape width={scale[0]} upward={true} visible={true} />
            {bottom < position[1] - scale[1] * 0.5 - 0.1 && (
              <mesh
                onPointerOver={() => {
                  document.body.style.cursor = "pointer"
                }}
                onPointerOut={() => {
                  document.body.style.cursor = "auto"
                }}
                onClick={(e) => {
                  e.stopPropagation()
                  document.body.style.cursor = "auto"
                  const filteredAssets = assets.filter(
                    (item) =>
                      item.position[1] + item.scale[1] * 0.5 <
                      position[1] - scale[1] * 0.5 - 0.1
                  )

                  const payload = {
                    xIndex: initialXIndex,
                    topAsset: top_asset,
                    posY: position[1],
                  }

                  if (filteredAssets[0] === undefined) {
                    payload.position = [
                      position[0],
                      (position[1] + scale[1] * 0.5 + bottom) * 0.5,
                      position[2],
                    ]
                    payload.scale = [
                      scale[0],
                      position[1] + scale[1] * 0.5 - bottom,
                      scale[2],
                    ]
                    payload.bottomAsset = bottomAssetType
                  } else {
                    const index = filteredAssets.length - 1
                    payload.scale = [
                      scale[0],
                      position[1] +
                        scale[1] * 0.5 -
                        (filteredAssets[index].position[1] +
                          filteredAssets[index].scale[1] * 0.5),
                      scale[2],
                    ]
                    payload.position = [
                      position[0],
                      (position[1] +
                        scale[1] * 0.5 +
                        (filteredAssets[index].position[1] +
                          filteredAssets[index].scale[1] * 0.5)) /
                        2,
                      position[2],
                    ]
                    payload.bottomAsset = filteredAssets[index].type
                  }

                  updateDoorAsset(payload)
                }}
                position={[
                  innerAssets.length > 0 &&
                  position[1] +
                    scale[1] * 0.5 -
                    (innerAssets[0].position[1] +
                      innerAssets[0].scale[1] * 0.5) >
                    Config.door.min_height
                    ? -10
                    : 0,
                  6,
                  1,
                ]}
              >
                <circleGeometry args={[5]} />
                <meshBasicMaterial map={arrowDownMap} />
              </mesh>
            )}
            {innerAssets.length > 0 &&
              position[1] +
                scale[1] * 0.5 -
                (innerAssets[0].position[1] + innerAssets[0].scale[1] * 0.5) >
                Config.door.min_height && (
                <mesh
                  onPointerOver={() => {
                    document.body.style.cursor = "pointer"
                  }}
                  onPointerOut={() => {
                    document.body.style.cursor = "auto"
                  }}
                  onClick={(e) => {
                    e.stopPropagation()
                    document.body.style.cursor = "auto"
                    const targetScaleY =
                      position[1] +
                      scale[1] * 0.5 -
                      (innerAssets[0].position[1] +
                        innerAssets[0].scale[1] * 0.5)

                    const targetPosY =
                      (position[1] +
                        scale[1] * 0.5 +
                        (innerAssets[0].position[1] +
                          innerAssets[0].scale[1] * 0.5)) /
                      2

                    updateDoorAsset({
                      xIndex: initialXIndex,
                      posY: position[1],
                      position: [position[0], targetPosY, position[2]],
                      scale: [scale[0], targetScaleY, scale[2]],
                      topAsset: top_asset,
                      bottomAsset: innerAssets[0].type,
                    })
                  }}
                  position={[
                    bottom < position[1] - scale[1] * 0.5 - 0.1 ? 10 : 0,
                    6,
                    1,
                  ]}
                >
                  <circleGeometry args={[5]} />
                  <meshBasicMaterial map={arrowUpMap} />
                </mesh>
              )}
          </group>
          <mesh
            onPointerOver={() => {
              document.body.style.cursor = "pointer"
            }}
            onPointerOut={() => {
              document.body.style.cursor = "auto"
            }}
            onClick={(e) => {
              e.stopPropagation()
              document.body.style.cursor = "auto"
              removeDoor({ xIndex: initialXIndex, posY: position[1] })
            }}
            position={[0, 0, scale[2] * 0.5 + 1]}
            visible={selected}
          >
            <circleGeometry args={[6]} />
            <meshBasicMaterial map={trashMap} />
          </mesh>
        </group>
      </group>
    </>
  )
})

export default DoorComponent
