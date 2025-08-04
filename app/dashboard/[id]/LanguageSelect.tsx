"use client";
import SelectInput from "@/components/inputs/SelectInput";
import { useState } from "react";

interface SelectInputWrapperProps {
  serverId: string;
}

export default function LanguageSelect({ serverId }: SelectInputWrapperProps) {
  const [lang, setLang] = useState<string>("en");

  return (
    <SelectInput
      onChange={(e) => {
        if (e === lang) return;
        setLang(e);
        console.log("send update");
      }}
      value={lang}
      options={[
        { label: "English", value: "en" },
        { label: "German", value: "de" },
      ]}
      required
    />
  );
}
