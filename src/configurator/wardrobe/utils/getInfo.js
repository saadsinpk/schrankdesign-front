import Config from "../../config"

export const getArrayIndex = (
  assets,
  xIndex,
  yPos,
  inDivider,
  d_xIndex,
  d_yPos
) => {
  return assets.findIndex((asset) => {
    const condition =
      (!inDivider &&
        asset.inDivider === false &&
        asset.xIndex === xIndex &&
        asset.position[1] === yPos) ||
      (inDivider &&
        asset.inDivider === true &&
        asset.xIndex === xIndex &&
        asset.position[1] === yPos &&
        asset.d_xIndex === d_xIndex &&
        asset.d_yPos === d_yPos)

    return condition
  })
}

export const getMaxHeight = (posY, scaleY, type) => {
  if (
    type === Config.furnishing.type.shelf ||
    type === Config.furnishing.type.glassBottom
  ) {
    return (
      posY -
      scaleY / 2 +
      Config.furnishing.shelf.interval +
      Config.plate.thickness
    )
  } else if (type === Config.furnishing.type.drawer) {
    return (
      posY +
      scaleY / 2 +
      Config.furnishing.drawer.topShelfDistance +
      Config.plate.thickness
    )
  } else if (type === Config.furnishing.type.internalDrawer) {
    return (
      posY +
      scaleY / 2 +
      Config.furnishing.internalDrawer.topShelfDistance +
      Config.plate.thickness
    )
  } else if (type === Config.furnishing.type.clothesRail) {
    return posY + scaleY / 2 + Config.furnishing.clothesRail.topSpace
  } else if (type === Config.furnishing.type.clothesLift) {
    return posY + scaleY / 2 + Config.furnishing.clothesLift.topSpace
  }

  return (
    posY +
    scaleY / 2 +
    Config.furnishing.default.interval +
    Config.plate.thickness
  )
}
const getMaxDepth = (type) => {
  if (type === Config.furnishing.type.pantsPullout)
    return (
      Config.furnishing.pantsPullout.availableDepth +
      Config.plate.backIncident +
      Config.plate.backThickness +
      Config.furnishing.default.spaceFront
    )
  else if (type === Config.furnishing.type.clothesLift)
    return (
      Config.furnishing.clothesLift.availableDepth +
      Config.plate.backIncident +
      Config.plate.backThickness
    )
  else if (type === Config.furnishing.type.slopingFloor)
    return (
      Config.furnishing.slopingFloor.availableDepth +
      Config.plate.backIncident +
      Config.plate.backThickness
    )

  return Config.plate.minDepth
}

export const getMaxVariables = (assets) => {
  let maxHeight = 0
  let maxDepth = 0

  assets.forEach((asset) => {
    const tempMaxHeight = getMaxHeight(
      asset.position[1],
      asset.scale[1],
      asset.type
    )
    const tempMaxDepth = getMaxDepth(asset.type)

    maxHeight = Math.max(maxHeight, tempMaxHeight)
    maxDepth = Math.max(maxDepth, tempMaxDepth)
  })

  return { maxHeight, maxDepth }
}

export const getInternalDrawerSides = (assets) => {
  const result = []

  // assets.map((xAssets, xIndex) => {
  //   result[xIndex] = []
  //   const sideData = {}
  //   let isSequential = false
  //   const tempAssets = [...xAssets]
  //   tempAssets
  //     .sort((a, b) => a.position[1] - b.position[1])
  //     .map((asset, yIndex) => {
  //       if (
  //         asset.type !== Config.furnishing.type.internalDrawer ||
  //         asset.bottomVisible === true
  //       ) {
  //         if (isSequential && sideData.stopYIndex !== undefined) {
  //           result[xIndex].push({ ...sideData })
  //           for (const key in sideData) {
  //             delete sideData[key]
  //           }
  //         }
  //         isSequential = false
  //       }

  //       if (asset.type === Config.furnishing.type.internalDrawer) {
  //         if (!isSequential && asset.topVisible === false) {
  //           isSequential = true
  //           sideData.startPosY = asset.position[1]
  //           sideData.startYIndex = yIndex
  //         } else if (isSequential && asset.bottomVisible === false) {
  //           sideData.stopPosY = asset.position[1]
  //           sideData.stopYIndex = yIndex
  //         }
  //       }

  //       if (yIndex === xAssets.length - 1 && sideData.stopYIndex === yIndex) {
  //         result[xIndex].push({ ...sideData })
  //       }
  //     })
  // })

  return result
}

export const calculatePlatesInfo = (
  sidespanelinfo,
  aboveFloorInfo,
  backPanelInfo,
  enableCutout,
  cutoutDepth,
  cutoutHeight,
  width,
  depth
) => {
  const result = []

  sidespanelinfo.forEach((info, index) => {
    if (index === 0) {
      result.push({
        color: "white",
        type: Config.plate.type.vertical,
        id: "side-left",
        length: info.size[1],
        depth: info.size[2],
        cutout: {
          enable: enableCutout,
          lenght: cutoutHeight,
          depth: cutoutDepth,
        },
      })
    } else if (index === sidespanelinfo.length - 1) {
      result.push({
        color: "white",
        type: "vertical",
        id: "side-right",
        length: info.size[1],
        depth: info.size[2],
        cutout: {
          enable: enableCutout,
          lenght: cutoutHeight,
          depth: cutoutDepth,
        },
      })
    } else {
      result.push({
        color: "white",
        type: "vertical",
        id: "side-middle-" + index.toString(),
        length: info.size[1],
        depth: info.size[2],
      })
    }
  })

  aboveFloorInfo.forEach((info, index) => {
    result.push({
      color: "white",
      type: Config.plate.type.horizontal,
      id: "floor-top-" + (index + 1).toString(),
      length: info.size[0],
      depth: info.size[2],
    })
  })

  backPanelInfo.forEach((info, index) => {
    result.push({
      color: "white",
      type: Config.plate.type.vertical,
      id: "back-" + (index + 1).toString(),
      length: info.size[0],
      depth: info.size[1],
    })
  })

  result.push({
    color: "white",
    type: Config.plate.type.horizontal,
    id: "floor-bottom",
    length: width - Config.plate.thickness * 2,
    depth: depth,
  })

  result.push({
    color: "white",
    type: Config.plate.type.horizontal,
    id: "plinth",
    length: width - Config.plate.thickness * 2,
    depth: Config.plate.plinthHeight,
  })

  // console.log(result)
  return result
}

export const calculateFurnishingInfo = ({
  furnishingAssets,
  doorAssets,
}) => {
  const result = [];
  let furnishingInfo = JSON.parse(JSON.stringify(furnishingAssets));
  let doorInfo = JSON.parse(JSON.stringify(doorAssets));

  furnishingInfo.sort((a, b) => {
    let compareA = a.inDivider ? a.d_xIndex : a.xIndex;
    let compareB = b.inDivider ? b.d_xIndex : b.xIndex;
    if (compareA !== compareB) {
      return compareA - compareB;
    } else {
      return a.position[1] - b.position[1];
    }
  });

  let yIndex = 0;
  let xIndex = 0;
  furnishingInfo = furnishingInfo.map((info, index) => {
    let realIndex = info.inDivider ? info.d_xIndex : info.xIndex;
    if (realIndex !== xIndex || index === 0) {
      yIndex = 0;
      xIndex = realIndex;
    }
    else {
      yIndex++;
    }
    return {
      ...info,
      yIndex,
      xIndex: realIndex
    }
  })

  furnishingInfo.forEach((info) => {
    result.push({
      color: 'white',
      type: info.type,
      id: `${info.type}-x_${info.xIndex}-y_${info.yIndex}`,
      length: info.type === Config.furnishing.type.divider ? info.scale[1] : info.scale[0],
      depth: info.scale[2]
    })
  })

  doorInfo.sort((a, b) => {
    if (a.xIndex !== b.xIndex) {
      return a.xIndex - b.xIndex;
    } else {
      return a.position[1] - b.position[1];
    }
  });

  yIndex = 0;
  xIndex = 0;
  doorInfo = doorInfo.map((info, index) => {
    if (info.xIndex !== xIndex || index === 0) {
      yIndex = 0;
    }
    else {
      yIndex++;
    }
    return {
      ...info,
      yIndex,
    }
  })

  doorInfo.forEach((info) => {
    result.push({
      color: 'white',
      type: info.type,
      id: `${info.type}-x_${info.xIndex}-y_${info.yIndex}`,
      length: info.scale[0],
      depth: info.scale[2]
    })
  })

  // console.log(result)
  return result
}