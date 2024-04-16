import { Button } from "@material-tailwind/react"

import { ReactComponent as FavIcon } from "../../../assets/icons/fav_icon.svg"
import { ReactComponent as CartIcon } from "../../../assets/icons/cart_icon.svg"

const Footer = () => {
  return (
    <div className="w-full h-[63px] flex-none bg-[#E5E5E5]">
      <div className="flex justify-between items-center h-full px-[12px]">
        <div className="flex justify-start items-center gap-2">
          <span className="text-[#000] text-[28px]">1034.87€</span>
          <div className="flex flex-col justify-start">
            <span className="text-[#000] text-[12px]">
              inkl. MwSt zzgl. Lieferkosten
            </span>
            <span className="text-[#36695C] text-[15px]">
              Lieferung in 4-5 Wochen{" "}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-[30px]">
          <Button className="bg-[#36695C] text-[#FFF] flex items-center gap-2 rounded-[2px] px-[29px] py-[11px] h-[43px]">
            <FavIcon />
            Design Speichern
          </Button>
          <Button className="bg-[#36695C] text-[#FFF] flex items-center gap-2 rounded-[2px] px-[29px] py-[11px] h-[43px]">
            <CartIcon />
            In Den Warenkorb
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Footer
