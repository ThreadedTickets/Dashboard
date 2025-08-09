"use client";
import PermissionToggle from "@/components/inputs/PermissionToggle";
import TagSelectInput from "@/components/inputs/TagSelectInput";
import TextInput from "@/components/inputs/TextInput";
import { useState } from "react";

interface Role {
  id: string;
  name: string;
  colour: string;
}

interface Group {
  name: string;
  roles: string[];
  extraMembers: string[];
  permissions: {
    tickets: {
      canClose: boolean;
      canCloseIfOwn: boolean;
      canForceOpen: boolean;
      canMove: boolean;
      canLock: boolean;
      canUnlock: boolean;
      canViewTranscripts: boolean;
      canViewLockedTranscripts: boolean;
      channelPermissions: {
        allow: string[];
        deny: string[];
      };
    };
    messages: {
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    tags: {
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    autoResponders: {
      create: boolean;
      edit: boolean;
      delete: boolean;
    };
    applications: {
      manage: boolean;
      respond: boolean;
    };
    panels: {
      manage: boolean;
    };
  };
}

type ChannelPermState = "allow" | "deny" | "neutral";

function getChannelPermissionState(
  permission: string,
  group: Group
): ChannelPermState {
  const { allow, deny } = group.permissions.tickets.channelPermissions;
  if (allow.includes(permission)) return "allow";
  if (deny.includes(permission)) return "deny";
  return "neutral";
}

function setChannelPermissionState(
  permission: string,
  state: ChannelPermState,
  group: Group,
  setGroup: (g: Group) => void
) {
  const { allow, deny } = group.permissions.tickets.channelPermissions;
  const newAllow = [...allow];
  const newDeny = [...deny];

  // Remove from both
  const remove = (arr: string[]) => {
    const index = arr.indexOf(permission);
    if (index !== -1) arr.splice(index, 1);
  };
  remove(newAllow);
  remove(newDeny);

  if (state === "allow") newAllow.push(permission);
  else if (state === "deny") newDeny.push(permission);

  setGroup({
    ...group,
    permissions: {
      ...group.permissions,
      tickets: {
        ...group.permissions.tickets,
        channelPermissions: {
          allow: newAllow,
          deny: newDeny,
        },
      },
    },
  });
}

const ticketChannelPermissions = {
  ManageChannels: "Manage Channel",
  ManageMessages: "Manage Messages",
  CreatePublicThreads: "Create Public Threads",
  CreatePrivateThreads: "Create Private Threads",
  ManageWebhooks: "Manage Webhooks",
  CreateInstantInvite: "Create Invites",
  UseApplicationCommands: "Use Slash Commands",
  UseExternalApps: "Use External Apps",
  SendMessages: "Send Messages",
  SendVoiceMessages: "Send Voice Messages",
  SendTTSMessages: "Send TTS Messages",
  SendPolls: "Send Polls",
  AddReactions: "React to messages",
  UseExternalEmojis: "Use External Emojis",
  UseExternalStickers: "Use External Stickers",
  EmbedLinks: "Embedded Links",
  ViewChannel: "View Channel",
  ReadMessageHistory: "View Message History",
  AttachFiles: "Upload Files",
  MentionEveryone: "Mention @everyone",
};

export default function GroupEditor({
  serverId,
  roles,
  value,
}: {
  serverId: string;
  roles: any[];
  value: any;
}) {
  const [group, setGroup] = useState<Group>(value);

  const toggle = (path: string[]) => {
    const copy = structuredClone(group.permissions);
    let ref: any = copy;
    for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
    const key = path[path.length - 1];
    ref[key] = !ref[key];
    setGroup({ ...group, permissions: copy });
  };

  if (!group) return <div>invalid group</div>;

  return (
    <div className="flex gap-4 flex-col">
      <div>
        <p className="font-semibold">Name</p>
        <TextInput
          onChange={(v) => setGroup({ ...group, name: v.target.value })}
          value={group.name}
          max={80}
        />
      </div>
      <div>
        <p className="font-semibold">Roles</p>
        <TagSelectInput
          options={roles.map((r) => ({ label: r.name, value: r.id }))}
          selected={group.roles}
          onChange={(e) =>
            setGroup({
              ...group,
              roles: e,
            })
          }
          className="grow"
          placeholder="Select roles"
          max={10}
        />
      </div>
      <div>
        <p className="font-semibold">Members</p>
        <TagSelectInput
          options={[]}
          selected={group.extraMembers}
          onChange={(e) =>
            setGroup({
              ...group,
              extraMembers: e,
            })
          }
          className="grow"
          placeholder="Paste user id then press enter"
          allowCustom
          max={10}
        />
      </div>

      <div className="bg-primary/10 p-4 rounded-lg">
        <p className="font-semibold">Ticket Channel Permissions</p>
        <div className="grid gap-2 gap-x-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          {Object.keys(ticketChannelPermissions).map((k: string, i: number) => (
            <div key={i} className="flex w-full justify-between">
              <p className="my-auto">
                {
                  ticketChannelPermissions[
                    k as keyof typeof ticketChannelPermissions
                  ]
                }
              </p>
              <hr className="text-primary/30 grow mx-2 my-auto" />
              <PermissionToggle
                className="my-auto"
                value={getChannelPermissionState(k, group)}
                onChange={(e) =>
                  setChannelPermissionState(k, e, group, setGroup)
                }
              />
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/10 p-4 rounded-lg">
        <p className="font-semibold">Ticket Management Permissions</p>
        <div className="grid gap-2 gap-x-8 sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
          <div className="flex w-full justify-between">
            <p className="my-auto">Close Tickets</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.tickets.canClose ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["tickets", "canClose"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Close Owned Tickets</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.tickets.canCloseIfOwn ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["tickets", "canCloseIfOwn"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Lock Tickets</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.tickets.canLock ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["tickets", "canLock"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Unlock Tickets</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.tickets.canUnlock ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["tickets", "canUnlock"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Force Open Tickets</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.tickets.canForceOpen ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["tickets", "canForceOpen"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Move Tickets</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.tickets.canMove ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["tickets", "canMove"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">View Transcripts</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={
                group.permissions.tickets.canViewTranscripts ? "allow" : "deny"
              }
              noNeutral
              onChange={() => toggle(["tickets", "canViewTranscripts"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">View Locked Transcripts</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={
                group.permissions.tickets.canViewLockedTranscripts
                  ? "allow"
                  : "deny"
              }
              noNeutral
              onChange={() => toggle(["tickets", "canViewLockedTranscripts"])}
            />
          </div>
        </div>
      </div>

      <div className="bg-primary/10 p-4 rounded-lg">
        <p className="font-semibold">Message Permissions</p>
        <div className="grid gap-2 gap-x-8 grid-cols-1 md:grid-cols-3">
          <div className="flex w-full justify-between">
            <p className="my-auto">Create</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.messages.create ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["message", "create"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Edit</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.messages.edit ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["message", "edit"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Delete</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.messages.delete ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["message", "delete"])}
            />
          </div>
        </div>
      </div>

      <div className="bg-primary/10 p-4 rounded-lg">
        <p className="font-semibold">Tag Permissions</p>
        <div className="grid gap-2 gap-x-8 grid-cols-1 md:grid-cols-3">
          <div className="flex w-full justify-between">
            <p className="my-auto">Create</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.tags.create ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["tags", "create"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Edit</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.tags.edit ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["tags", "edit"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Delete</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.tags.delete ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["tags", "delete"])}
            />
          </div>
        </div>
      </div>

      <div className="bg-primary/10 p-4 rounded-lg">
        <p className="font-semibold">Auto Responders Permissions</p>
        <div className="grid gap-2 gap-x-8 grid-cols-1 md:grid-cols-3">
          <div className="flex w-full justify-between">
            <p className="my-auto">Create</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.autoResponders.create ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["autoResponders", "create"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Edit</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.autoResponders.edit ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["autoResponders", "edit"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Delete</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.autoResponders.delete ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["autoResponders", "delete"])}
            />
          </div>
        </div>
      </div>

      <div className="bg-primary/10 p-4 rounded-lg">
        <p className="font-semibold">Applications Permissions</p>
        <div className="grid gap-2 gap-x-8 grid-cols-1 md:grid-cols-2">
          <div className="flex w-full justify-between">
            <p className="my-auto">Manage</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.applications.manage ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["applications", "manage"])}
            />
          </div>
          <div className="flex w-full justify-between">
            <p className="my-auto">Edit</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.applications.respond ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["applications", "respond"])}
            />
          </div>
        </div>
      </div>

      <div className="bg-primary/10 p-4 rounded-lg">
        <p className="font-semibold">Panel Permissions</p>
        <div className="grid gap-2 grid-cols-1">
          <div className="flex w-full justify-between">
            <p className="my-auto">Manage</p>
            <hr className="text-primary/30 grow mx-2 my-auto" />
            <PermissionToggle
              value={group.permissions.panels.manage ? "allow" : "deny"}
              noNeutral
              onChange={() => toggle(["panels", "manage"])}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
