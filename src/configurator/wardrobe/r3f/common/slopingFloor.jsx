import { RoundedBox } from "@react-three/drei"
import React, { useMemo } from "react"
import Config from "../../../config"
import CustomMaterial from "./customMaterial"

const slopingConfig = Config.furnishing.slopingFloor

const SlopingFloor = React.memo(function SlopingFloor(props) {
  const { width, depth, visible } = props

  const floor_depth = useMemo(
    () =>
      (depth -
        2 * slopingConfig.zIncident -
        (slopingConfig.wallHeight + slopingConfig.thickness) *
          Math.sin(slopingConfig.angle)) /
      Math.cos(slopingConfig.angle),
    [depth]
  )

  return (
    // eslint-disable-next-line react/no-unknown-property
    <group visible={visible} rotation-x={slopingConfig.angle}>
      {/* floor */}
      <RoundedBox
        castShadow
        args={[width, slopingConfig.thickness, floor_depth]}
        position={[0, slopingConfig.thickness / 2, -floor_depth / 2]}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
      {/* wall front */}
      <RoundedBox
        castShadow
        args={[width, slopingConfig.wallHeight, slopingConfig.thickness]}
        position={[
          0,
          slopingConfig.thickness + slopingConfig.wallHeight / 2,
          -slopingConfig.thickness / 2,
        ]}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
      {/* wall middle */}
      <RoundedBox
        castShadow
        args={[width, slopingConfig.wallHeight, slopingConfig.thickness]}
        position={[
          0,
          slopingConfig.thickness + slopingConfig.wallHeight / 2,
          -floor_depth / 2,
        ]}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
      {/* wall back */}
      <RoundedBox
        castShadow
        args={[width, slopingConfig.wallHeight, slopingConfig.thickness]}
        position={[
          0,
          slopingConfig.thickness + slopingConfig.wallHeight / 2,
          -floor_depth + slopingConfig.thickness / 2,
        ]}
      >
        <CustomMaterial category={Config.color.category.body} />
      </RoundedBox>
    </group>
  )
})

export default SlopingFloor
