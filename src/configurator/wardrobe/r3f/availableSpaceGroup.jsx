/* eslint-disable react/no-unknown-property */
import { Plane } from "@react-three/drei"
import React, { useEffect, useRef } from "react"
import useDndStore from "../zustand/dndStore"
import useFurnishingStore from "../zustand/furnishingStore"

const AvailableSpaceGroup = React.memo(function AvailableSpaceGroup(props) {
  const { depth, setSpaceRef } = props

  // already located assets, total available space
  const totalSpace = useFurnishingStore.use.totalSpace()
  
  const productDragging = useDndStore.use.productDragging()
  const assetDragging = useDndStore.use.assetDragging()

  const availableRef = useRef()

  useEffect(() => {
    if (availableRef !== undefined && availableRef.current !== undefined) {
      setSpaceRef(availableRef.current)
    }
  }, [availableRef])

  return (
    <>
      <group ref={availableRef}>
        {(productDragging || assetDragging) &&
          totalSpace.map((space, index) => (
            <Plane
              key={index}
              castShadow
              name="available"
              userData={{
                xIndex: space.xIndex,
                top: space.top,
                bottom: space.bottom,
                topAsset: space.topAsset,
                bottomAsset: space.bottomAsset,
                availableTop: space.availableTop,
                availableBottom: space.availableBottom,
                inDivider: space.inDivider,
                d_xIndex: space.d_xIndex,
                d_yPos: space.d_yPos,
              }}
              args={[space.width, space.height]}
              rotateZ={Math.PI / 2}
              position={[space.posX, space.posY, space.posZ]}
            >
              <meshStandardMaterial color="green" opacity={0.5} transparent />
            </Plane>
          ))}
        {(productDragging || assetDragging) && (
          <Plane
            castShadow
            args={[1000, 500]}
            rotateZ={Math.PI / 2}
            position={[300, 100, depth]}
          >
            <shadowMaterial transparent opacity={0} />
          </Plane>
        )}
      </group>
    </>
  )
})

export default AvailableSpaceGroup
