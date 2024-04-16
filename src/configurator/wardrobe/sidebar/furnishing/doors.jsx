import ProductCard from "../../common/productCard"
import Config from "../../../config"
import { useState } from "react"
import {
  Tabs,
  TabsHeader,
  TabsBody,
  TabPanel,
  Tab,
} from "@material-tailwind/react"

export default function Doors() {
  const tab_data = [
    { label: "Drehtür", value: "revolving" },
    { label: "Spiegeltür", value: "mirror" },
    { label: "Schiebetür", value: "sliding" },
  ]

  const [activeTab, setActiveTab] = useState(tab_data[0].value)

  return (
    <Tabs value={activeTab} className="py-2">
      <TabsHeader
        className="bg-[#BDBCBC] h-[35px] p-0 mx-5 bg-opacity-100 rounded-[10px] border-[1px] border-black"
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
        <TabPanel key="revolving" value="revolving" className="px-6 py-1">
          <div className="grid grid-cols-2 gap-4">
            <ProductCard
              imageUrl="../images/furnishing/revolving_left.png"
              type={Config.furnishing.type.door}
              door_type={Config.door.type.revolving_left}
              description={`Installation critieria:\nW 30-120 cm | H 30-260cm`}
            />
            <ProductCard
              imageUrl="../images/furnishing/revolving_right.png"
              type={Config.furnishing.type.door}
              door_type={Config.door.type.revolving_right}
              description={`Installation critieria:\nW 30-120 cm | H 30-260cm`}
            />
            <ProductCard
              imageUrl="../images/furnishing/revolving_double.png"
              type={Config.furnishing.type.door}
              door_type={Config.door.type.revolving_double}
              description={`Installation critieria:\nW 30-120 cm | D 30-260cm`}
            />
          </div>
        </TabPanel>
        <TabPanel key="mirror" value="mirror" className="px-6 py-1">
          <div className="grid grid-cols-2 gap-4">
            <ProductCard
              imageUrl="../images/furnishing/mirror_left.png"
              type={Config.furnishing.type.door}
              door_type={Config.door.type.mirror_left}
              description={`Installation critieria:\nW 30-120 cm | H 30-260cm`}
            />
            <ProductCard
              imageUrl="../images/furnishing/mirror_right.png"
              type={Config.furnishing.type.door}
              door_type={Config.door.type.mirror_right}
              description={`Installation critieria:\nW 30-120 cm | H 30-260cm`}
            />
            <ProductCard
              imageUrl="../images/furnishing/mirror_double.png"
              type={Config.furnishing.type.door}
              door_type={Config.door.type.mirror_double}
              description={`Installation critieria:\nW 30-120 cm | D 30-260cm`}
            />
          </div>
        </TabPanel>
        <TabPanel key="sliding" value="sliding" className="p-0">
          <div className="gap-y-3 flex flex-col items-center">
            <ProductCard
              imageUrl="../images/furnishing/sliding_double.png"
              type={Config.furnishing.type.door}
              door_type={Config.door.type.sliding_double}
              title="Schiebetür 2-Türen"
              description={`Installation critieria:\nW 30-120 cm | H 30-260cm`}
            />
            <ProductCard
              imageUrl="../images/furnishing/sliding_double.png"
              type={Config.furnishing.type.door}
              door_type={Config.door.type.sliding_triple}
              title="Schiebetür 3-Türen"
              description={`Installation critieria:\nW 30-120 cm | H 30-260cm`}
            />
          </div>
        </TabPanel>
      </TabsBody>
    </Tabs>
  )
}
