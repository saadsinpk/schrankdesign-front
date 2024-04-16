import {
  Tabs,
  TabsHeader,
  TabsBody,
  TabPanel,
  Tab,
} from "@material-tailwind/react"
import { useState } from "react"

import ColorCard from "../../common/colorCard"
import Config from "../../../config"

export default function BodyColors() {
  const tab_data = [
    { label: "Farben", value: "color" },
    { label: "Holzdekor", value: "wood" },
    { label: "Furnier", value: "special" },
  ]

  const [activeTab, setActiveTab] = useState(tab_data[0].value)

  return (
    <Tabs value={activeTab} className="py-4">
      <TabsHeader
        className="bg-[#BDBCBC] h-[35px] p-0 mx-3 bg-opacity-100 rounded-[10px] border-[1px] border-black"
        indicatorProps={{
          className: "bg-[#36695C] h-[33px] rounded-[10px]",
        }}
      >
        {tab_data.map(({ label, value }) => (
          <Tab
            key={value}
            value={value}
            className="text-[#FFF] text-[16px]"
            onClick={() => setActiveTab(value)}
          >
            {label}
          </Tab>
        ))}
      </TabsHeader>
      <TabsBody className="mt-5">
        <TabPanel key="color" value="color" className="py-1 px-0">
          <div className="grid grid-cols-3 gap-4">
            <ColorCard
              imageUrl="../images/extra/colors/type0.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type0}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/type1.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type1}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/type2.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type2}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/type3.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type3}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/type4.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type0}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/type5.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type1}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/type6.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type2}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/type7.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type3}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/type8.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type0}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/type9.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type1}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/type10.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type2}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/type11.png"
              type={Config.color.type.color}
              textureType={Config.color.color.type3}
              category={Config.color.category.front}
            />
          </div>
        </TabPanel>
        <TabPanel key="wood" value="wood" className="py-1 px-0">
          <div className="grid grid-cols-3 gap-4">
            <ColorCard
              imageUrl="../images/extra/colors/wtype0.png"
              type={Config.color.type.wood}
              textureType={Config.color.wood.type0}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/wtype1.png"
              type={Config.color.type.wood}
              textureType={Config.color.wood.type1}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/wtype2.png"
              type={Config.color.type.wood}
              textureType={Config.color.wood.type2}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/wtype3.png"
              type={Config.color.type.wood}
              textureType={Config.color.wood.type3}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/wtype4.png"
              type={Config.color.type.wood}
              textureType={Config.color.wood.type0}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/wtype5.png"
              type={Config.color.type.wood}
              textureType={Config.color.wood.type1}
              category={Config.color.category.front}
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mx-14 mt-4">
            <ColorCard
              imageUrl="../images/extra/colors/wtype6.png"
              type={Config.color.type.wood}
              textureType={Config.color.wood.type2}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/wtype7.png"
              type={Config.color.type.wood}
              textureType={Config.color.wood.type3}
              category={Config.color.category.front}
            />
          </div>
        </TabPanel>
        <TabPanel
          key="special"
          value="special"
          className="py-1 px-0"
        >
          <div className="grid grid-cols-2 gap-4 mx-14">
            <ColorCard
              imageUrl="../images/extra/colors/stype0.png"
              type={Config.color.type.special}
              textureType={Config.color.special.type0}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/stype1.png"
              type={Config.color.type.special}
              textureType={Config.color.special.type1}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/stype2.png"
              type={Config.color.type.special}
              textureType={Config.color.special.type0}
              category={Config.color.category.front}
            />
            <ColorCard
              imageUrl="../images/extra/colors/stype3.png"
              type={Config.color.type.special}
              textureType={Config.color.special.type1}
              category={Config.color.category.front}
            />
          </div>
        </TabPanel>
      </TabsBody>
    </Tabs>
  )
}
