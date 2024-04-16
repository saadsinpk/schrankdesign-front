/* eslint-disable react/no-unknown-property */
import { useLoader } from "@react-three/fiber"
import React, { useMemo } from "react"
import { useSelector } from "react-redux"
import * as THREE from "three"
import Config from "../../../config"
import useColorStore from "../../zustand/colorStore"

const CustomMaterial = React.memo(function CustomMaterial({ category }) {
  const bodyType = useColorStore.use.bodyType()
  const frontType = useColorStore.use.frontType()
  const bodyTexture = useColorStore.use.bodyTexture()
  const frontTexture = useColorStore.use.frontTexture()
  // const {bodyType, bodyTexture, frontType, frontTexture} = useColorStore.use

  const type = useMemo(
    () => (category === Config.color.category.body ? bodyType : frontType),
    [category, bodyType, frontType]
  )

  const textureUrl = useMemo(
    () =>
      category === Config.color.category.body ? bodyTexture : frontTexture,
    [category, bodyTexture, frontTexture]
  )

  const [_texture, _normalMap, _armMap] = useLoader(THREE.TextureLoader, [
    `/images/configurator/textures/${type}/${
      type === Config.color.type.color ? Config.color.color.type0 : textureUrl
    }.jpg`,
    `/images/configurator/textures/${type}/${
      type === Config.color.type.color ? Config.color.color.type0 : textureUrl
    }_normal.jpg`,
    `/images/configurator/textures/${type}/${
      type === Config.color.type.color ? Config.color.color.type0 : textureUrl
    }_arm.jpg`,
  ])

  _texture.wrapS = THREE.RepeatWrapping
  _texture.wrapT = THREE.RepeatWrapping
  _texture.repeat.set(0.01, 0.01)
  _texture.colorSpace = THREE.SRGBColorSpace

  _normalMap.wrapS = THREE.RepeatWrapping
  _normalMap.wrapT = THREE.RepeatWrapping
  _normalMap.repeat.set(0.01, 0.01)

  _armMap.wrapS = THREE.RepeatWrapping
  _armMap.wrapT = THREE.RepeatWrapping
  _armMap.repeat.set(0.01, 0.01)

  return (
    <meshStandardMaterial
      attach="material"
      map={_texture}
      normalMap={_normalMap}
      aoMap={type === Config.color.type.color ? null : _armMap}
      roughnessMap={_armMap}
      metalnessMap={_armMap}
      color={
        type === Config.color.type.color
          ? textureUrl === Config.color.color.type0
            ? "#F1F1EF"
            : textureUrl === Config.color.color.type1
            ? "#F1EDE2"
            : textureUrl === Config.color.color.type2
            ? "#D1C6B3"
            : textureUrl === Config.color.color.type3
            ? "#99857A"
            : ""
          : ""
      }
    />
  )
})

export default CustomMaterial
