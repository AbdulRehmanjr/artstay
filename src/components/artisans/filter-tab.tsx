import { Tabs, TabsList, TabsTrigger, TabsContent } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Checkbox } from "~/components/ui/checkbox";
import { Input } from "~/components/ui/input";
import { Search } from "lucide-react";
import { Button } from "~/components/ui/button";

export const ArtisanFilter = () => {
  return (
    <Tabs defaultValue="craft" className="-mt-24">
      <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
        <TabsTrigger
          value="profile"
          disabled
          className="rounded-b-none rounded-t-lg bg-gradient-to-b from-white/80 to-white px-4 py-2 font-text text-lg tracking-wide text-primary"
        >
          <b>ARTISAN PROFILE</b>
        </TabsTrigger>
        {[
          { id: "craft", label: "Craft" },
          { id: "expertise", label: "Expertise" },
          { id: "rating", label: "Rating" },
          { id: "credentials", label: "Credentials" },
          { id: "fees", label: "Fees" },
          { id: "location", label: "Location" },
        ].map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            className="rounded-b-none rounded-t-lg bg-gray-200 px-4 py-2 font-text text-lg text-gray-950 backdrop-blur hover:bg-primary hover:text-white data-[state=active]:text-primary"
          >
            <span className="mr-2">+</span>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      <div className="rounded-lg bg-white/90 p-6 shadow-lg backdrop-blur">
        <TabsContent value="craft">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <div className="col-span-1">
              <label className="mb-2 block">Selected Craft</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="-- Select Craft --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Boutique Craft</SelectItem>
                  <SelectItem value="2">Wood Craft</SelectItem>
                  <SelectItem value="3">Decor Craft</SelectItem>
                  <SelectItem value="4">Carpet & Rug Craft</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-1">
              <label className="mb-2 block">Selected Sub-Craft</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="-- Select Sub Craft --" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">Zalakdozi (Chain Stitch)</SelectItem>
                  <SelectItem value="2">Aarikam (hook work)</SelectItem>
                  <SelectItem value="3">
                    Kashida Kari (Kashmiri Embroidery)
                  </SelectItem>
                  <SelectItem value="4">
                    Pashmina & Kanis (Warp Weaving)
                  </SelectItem>
                  <SelectItem value="5">Zardozi (Metal Embroidery)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="mb-2 block">Check in</label>
              <Input type="date" placeholder="yyyy-mm-dd" />
            </div>

            <div>
              <label className="mb-2 block">Check out</label>
              <Input type="date" placeholder="yyyy-mm-dd" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="rating" className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-2">
                <Checkbox id={`${stars}stars`} defaultChecked />
                <label htmlFor={`${stars}stars`}>{stars} Stars</label>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="expertise" className="space-y-4">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {["Grandmaster", "Master Craftsman", "Craftsman", "Apprentice"].map(
              (level) => (
                <div key={level} className="flex items-center gap-2">
                  <Checkbox id={level} defaultChecked />
                  <label htmlFor={level}>{level}</label>
                </div>
              ),
            )}
          </div>
        </TabsContent>

        <TabsContent value="credentials">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            {[
              {
                label: "Education",
                options: [
                  { value: "1", label: "Non-Formal Education" },
                  { value: "2", label: "Formal Education" },
                ],
              },
              {
                label: "Training",
                options: [
                  { value: "1", label: "Non-Formal Training" },
                  { value: "2", label: "Formal Training" },
                ],
              },
              {
                label: "Certification",
                options: [
                  { value: "1", label: "No Certification" },
                  { value: "2", label: "Professional Bodies" },
                  { value: "3", label: "Trade Associations" },
                  { value: "4", label: "Workshops" },
                ],
              },
              {
                label: "Recognition",
                options: [
                  { value: "1", label: "State Level (Craftsmanship)" },
                  { value: "2", label: "National Level (Padma Shri)" },
                  { value: "3", label: "International Level" },
                ],
              },
            ].map((field) => (
              <div key={field.label}>
                <label className="mb-2 block">{field.label}</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder={`-- ${field.label} --`} />
                  </SelectTrigger>
                  <SelectContent>
                    {field.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="fees">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="mb-2 block">Minimum</label>
              <Input type="number" placeholder="Minimum" />
            </div>
            <div>
              <label className="mb-2 block">Maximum</label>
              <Input type="number" placeholder="Maximum" />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="location">
          <div>
            <label className="mb-2 block">Location</label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="-- Select Location --" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">Location 1</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </TabsContent>

        <div className="mt-8">
          <Button type="button">
            <Search className="h-4 w-4" />
            Find Now
          </Button>
        </div>
      </div>
    </Tabs>
  );
};
