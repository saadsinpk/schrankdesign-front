import { RoundedBox } from "@react-three/drei"
import DrawerBody from "./drawerBody"
import React from "react"

import Config from "../../../config"
import CustomMaterial from "./customMaterial"

const drawerConfig = Config.furnishing.drawer

const Drawer = React.memo(function Drawer(props) {
  // scale is just for the body part
  // position is a center of body part
  const {
    scale,
    depth,
    elementIndex,
    visible,
    topVisible,
    bottomVisible,
    topShelfDistance,
  } = props

  return (
    // eslint-disable-next-line react/no-unknown-property
    <group visible={visible}>
      <DrawerBody scale={scale} />
      {/* top shelf */}
      <RoundedBox
        name="drawer_top_shelf"
        castShadow
        args={[
          scale[0] + drawerConfig.sideIncident * 2,
          drawerConfig.shelfThickness1,
          depth - Config.plate.backThickness - Config.plate.backIncident,
        ]}
        position={[
          0,
          scale[1] / 2 + topShelfDistance + drawerConfig.shelfThickness1 / 2,
          Config.furnishing.drawer.bodyFrontIncident +
            scale[2] / 2 -
            depth / 2 +
            Config.plate.backThickness / 2 +
            Config.plate.backIncident / 2,
        ]}
        visible={topVisible}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
      {/* bottom shelf */}
      <RoundedBox
        name="drawer_bottom_shelf"
        castShadow
        args={[
          scale[0] + drawerConfig.sideIncident * 2,
          drawerConfig.shelfThickness1,
          depth - Config.plate.backThickness - Config.plate.backIncident,
        ]}
        position={[
          0,
          -scale[1] / 2 -
            drawerConfig.bottomShelfDistance -
            drawerConfig.shelfThickness1 / 2,
          Config.furnishing.drawer.bodyFrontIncident +
            scale[2] / 2 -
            depth / 2 +
            Config.plate.backThickness / 2 +
            Config.plate.backIncident / 2,
        ]}
        visible={bottomVisible}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
      {/* front plate */}
      <RoundedBox
        castShadow
        // visible={false}
        args={[
          elementIndex === Config.elementIndex.first ||
          elementIndex === Config.elementIndex.last
            ? scale[0] +
              drawerConfig.sideIncident * 2 +
              Config.plate.thickness * 1.5 -
              Config.furnishing.default.frontInterval * 2
            : scale[0] +
              drawerConfig.sideIncident * 2 +
              Config.plate.thickness -
              Config.furnishing.default.frontInterval * 2,
          scale[1] +
            topShelfDistance +
            drawerConfig.bottomShelfDistance +
            2 * Config.furnishing.default.shelfOverlapping,
          drawerConfig.frontThickness,
        ]}
        position={[
          elementIndex === Config.elementIndex.first
            ? -Config.plate.thickness / 4
            : elementIndex === Config.elementIndex.last
            ? Config.plate.thickness / 4
            : 0,
          (topShelfDistance - drawerConfig.bottomShelfDistance) / 2,
          scale[2] / 2 +
            drawerConfig.bodyFrontIncident +
            drawerConfig.frontThickness / 2,
        ]}
      >
        <CustomMaterial category={Config.color.category.front} />
      </RoundedBox>
    </group>
  )
})

export default Drawer
