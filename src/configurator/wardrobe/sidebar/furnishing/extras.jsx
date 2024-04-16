import Config from "../../../config"
import ProductCard from "../../common/productCard"

export default function Extras() {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4">
      <ProductCard
        imageUrl="../images/furnishing/led_lighting.png"
        title="LED-Beleuchtung"
        type={Config.furnishing.type.ledLighting}
        description={`Installation critieria:\nW 15-120 cm | D 30-120cm`}
      />
      <ProductCard
        imageUrl="../images/furnishing/divider_page.png"
        title="Trennseite"
        type={Config.furnishing.type.divider}
        description={`Installation critieria:\nW 15-120 cm | D 30-120cm`}
      />
    </div>
  )
}
