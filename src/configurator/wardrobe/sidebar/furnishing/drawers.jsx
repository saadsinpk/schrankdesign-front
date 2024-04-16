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

export default function Drawers() {
  const tab_data = [
    { label: "Schublade", value: "outer" },
    { label: "Innenschublade", value: "inner" },
  ]

  const [activeTab, setActiveTab] = useState(tab_data[0].value)

  return (
    <Tabs value={activeTab} className="py-2">
      <TabsHeader
        className="bg-[#BDBCBC] h-[35px] p-0 mx-10 bg-opacity-100 rounded-[10px] border-[1px] border-black"
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
        <TabPanel key="outer" value="outer" className="p-0">
          <div className="grid grid-cols-2 gap-4">
            <ProductCard
              imageUrl="../images/furnishing/Drawer.png"
              title="Schublade Klein"
              type={Config.furnishing.type.drawer}
              drawerHeight={Config.furnishing.drawer.defaultHeight[0]}
              description={`Installation critieria:\nW 30-120 cm | D 30-120cm`}
            />
            <ProductCard
              imageUrl="../images/furnishing/Drawer.png"
              title="Schublade Mittel"
              type={Config.furnishing.type.drawer}
              drawerHeight={Config.furnishing.drawer.defaultHeight[1]}
              description={`Installation critieria:\nW 30-120 cm | D 30-120cm`}
            />
            <ProductCard
              imageUrl="../images/furnishing/Drawer.png"
              title="Schublade Groß"
              type={Config.furnishing.type.drawer}
              drawerHeight={Config.furnishing.drawer.defaultHeight[2]}
              description={`Installation critieria:\nW 30-120 cm | D 30-120cm`}
            />
            <ProductCard
              imageUrl="../images/furnishing/Drawer.png"
              title="Maß-Schublade"
              type={Config.furnishing.type.drawer}
              drawerHeight={Config.furnishing.drawer.defaultHeight[1]}
              description={`Installation critieria:\nW 30-120 cm | D 30-120cm`}
            />
          </div>
        </TabPanel>
        <TabPanel key="inner" value="inner" className="p-0">
          <div className="grid grid-cols-2 gap-4">
            <ProductCard
              imageUrl="../images/furnishing/inner_drawer.png"
              title="Schublade Klein"
              type={Config.furnishing.type.internalDrawer}
              drawerHeight={Config.furnishing.drawer.defaultHeight[0]}
              description={`Installation critieria:\nW 30-120 cm | D 42-120cm`}
            />
            <ProductCard
              imageUrl="../images/furnishing/inner_drawer.png"
              title="Schublade Mittel"
              type={Config.furnishing.type.internalDrawer}
              drawerHeight={Config.furnishing.drawer.defaultHeight[1]}
              description={`Installation critieria:\nW 30-120 cm | D 42-120cm`}
            />
            <ProductCard
              imageUrl="../images/furnishing/inner_drawer.png"
              title="Schublade Groß"
              type={Config.furnishing.type.internalDrawer}
              drawerHeight={Config.furnishing.drawer.defaultHeight[2]}
              description={`Installation critieria:\nW 30-120 cm | D 42-120cm`}
            />
          </div>
        </TabPanel>
      </TabsBody>
    </Tabs>
  )
}
