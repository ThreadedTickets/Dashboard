"use client";
import SelectInput from "@/components/inputs/SelectInput";
import { useState } from "react";

interface SelectInputWrapperProps {
  serverId: string;
  defaultValue: string;
}

export default function LanguageSelect({
  serverId,
  defaultValue,
}: SelectInputWrapperProps) {
  const [lang, setLang] = useState<string>(defaultValue);

  return (
    <SelectInput
      onChange={(e) => {
        if (e === lang) return;
        setLang(e);
        fetch("/api/update", {
          body: JSON.stringify({
            serverId,
            path: "preferredLanguage",
            value: e,
          }),
          method: "POST",
        });
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
