"use client";
import TagSelectInput from "@/components/inputs/TagSelectInput";
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
    <TagSelectInput
      options={channels.map((c) => ({ value: c.id, label: c.name }))}
      selected={selected}
      placeholder="Select channels"
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
