/* eslint-disable react/no-unknown-property */
import { RoundedBox } from "@react-three/drei"
import React from "react"

import CustomMaterial from "./customMaterial"
import Config from "../../../config"

const Plate = React.memo(function Plate(props) {
  return (
    <RoundedBox
      {...props}
      // rotation={props.rotation ? props.rotation : [0, 0, 0]}
      castShadow
      receiveShadow
      // material={Config.plate.material}
    >
      <CustomMaterial category={Config.color.category.body} />
    </RoundedBox>
  )
})

export default Plate
