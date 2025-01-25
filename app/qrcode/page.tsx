
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {QRCodeSVG} from 'qrcode.react';
import { Input } from "@/components/ui/input"



import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
  } from "@/components/ui/select"


export default function Qrcode() {

  return (
      <div className="mx-20 rounded-lg">
          <Tabs defaultValue="information" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-4">
                  <TabsTrigger value="information">Information</TabsTrigger>
                  <TabsTrigger value="color">Color</TabsTrigger>
                  <TabsTrigger value="image">Image</TabsTrigger>
              </TabsList>

              <div className="w-full flex flex-row  h-[500px] border border-border rounded-xl p-6">
                  <TabsContent value="information">
                      <Select>
                          <SelectTrigger className="w-[180px]">
                              <SelectValue placeholder="Error Level" />
                          </SelectTrigger>
                          <SelectContent>
                              <SelectGroup>
                                  <SelectLabel>Error Level</SelectLabel>
                                  <SelectItem value="L">L</SelectItem>
                                  <SelectItem value="M">M</SelectItem>
                                  <SelectItem value="Q">Q</SelectItem>
                                  <SelectItem value="H">H</SelectItem>
                              </SelectGroup>
                          </SelectContent>
                      </Select>

                      <Input type="number" id="margin-size" placeholder="Margin size" />
                  </TabsContent>
                  <TabsContent value="color">color</TabsContent>
                  <TabsContent value="image">image</TabsContent>
                  <div className="">
                      <QRCodeSVG value="https://reactjs.org/" />
                  </div>
              </div>
          </Tabs>
      </div>
  )
}
