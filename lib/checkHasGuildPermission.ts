const ADMINISTRATOR = 1 << 3; // 8
const MANAGE_GUILD = 1 << 5; // 32

export default function hasManageOrAdmin(
  permissions: bigint | number
): boolean {
  // Convert to bigint if needed
  const perms =
    typeof permissions === "bigint" ? permissions : BigInt(permissions);
  return (
    (perms & BigInt(ADMINISTRATOR)) === BigInt(ADMINISTRATOR) ||
    (perms & BigInt(MANAGE_GUILD)) === BigInt(MANAGE_GUILD)
  );
}
