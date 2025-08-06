"use client";

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
    </div>
  );
}
