import * as React from "react";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTheme } from "next-themes";

export function ToggleTheme() {
  const { setTheme } = useTheme();

  return (
    <div className="flex items-center justify-between w-full">
      <span>Tema</span>
      <Select
        onValueChange={(value) => {
          setTheme(value); // Update the theme when the value changes
        }}
        defaultValue="system" // Set the default theme
      >
        <SelectTrigger className="w-3/4">
          <SelectValue placeholder="Select a theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="light">Light</SelectItem>
            <SelectItem value="dark">Dark</SelectItem>
            <SelectItem value="system">System</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}