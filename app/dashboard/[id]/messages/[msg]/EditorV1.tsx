"use client";

import Button from "@/components/Button";
import EmbedEditor from "@/components/dashboard/EmbedEditor";
import TextareaInput from "@/components/inputs/TextAreaInput";

export function EditorV1({
  message,
  setMessage,
}: {
  message: {
    flags: number;
    content: string | null;
    embeds: any[];
    components: any[];
  };
  setMessage: (v: any) => unknown;
}) {
  const createEmptyEmbed = () => ({
    title: "New Embed",
    description: "",
    color: "#5865F2",
    fields: [],
    author: { name: "", url: "", icon_url: "" },
    footer: { text: "", icon_url: "" },
    thumbnail: { url: "" },
    image: { url: "" },
    timestamp: false,
  });

  const handleEmbedChange = (index: number, field: string, value: any) => {
    const updatedEmbeds = [...message.embeds];
    updatedEmbeds[index][field] = value;
    setMessage({ ...message, embeds: updatedEmbeds });
  };

  const addNewEmbed = () => {
    if (message.embeds.length < 10) {
      setMessage({
        ...message,
        embeds: [...message.embeds, createEmptyEmbed()],
      });
    }
  };

  const removeEmbed = (index: number) => {
    const updatedEmbeds = [...message.embeds];
    updatedEmbeds.splice(index, 1);
    setMessage({ ...message, embeds: updatedEmbeds });
  };

  return (
    <div>
      <div>
        <p className="font-semibold">Message Content</p>
        <TextareaInput
          value={message.content ?? ""}
          maxLength={2000}
          onChange={(v) =>
            setMessage({ ...message, content: v.target.value || null })
          }
        />
      </div>
      <div className="flex flex-col gap-2">
        <div className="flex justify-between mt-4">
          <p className="font-bold text-lg my-auto">
            Embeds{" "}
            <span className="opacity-50">{message.embeds.length}/10</span>
          </p>
          <Button text="New" onClick={addNewEmbed} />
        </div>
        {message.embeds.map((embed, index) => (
          <EmbedEditor
            key={index}
            embed={embed}
            index={index}
            onChange={handleEmbedChange}
            onRemove={removeEmbed}
          />
        ))}
      </div>
    </div>
  );
}
