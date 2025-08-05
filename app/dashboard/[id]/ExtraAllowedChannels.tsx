"use client";
import SelectMultiCheckbox from "@/components/inputs/MultiSelectInput";
import { useState } from "react";

interface SelectInputWrapperProps {
  serverId: string;
  channels: { id: string; name: string; type: number }[];
  defaultValue: string[];
}

export default function ExtraAllowedChannels({
  serverId,
  channels,
  defaultValue,
}: SelectInputWrapperProps) {
  const [selected, setChannels] = useState<string[]>(defaultValue);

  return (
    <SelectMultiCheckbox
      options={channels.map((c) => ({ value: c.id, label: c.name }))}
      value={selected}
      onChange={(e) => {
        setChannels(e);
        fetch("/api/update", {
          body: JSON.stringify({
            serverId,
            path: "settings.autoResponders.extraAllowedChannels",
            value: e,
          }),
          method: "POST",
        });
      }}
      max={10}
    />
  );
}
