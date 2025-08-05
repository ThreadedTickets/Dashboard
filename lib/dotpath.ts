type PrimitiveType = "string" | "number" | "boolean" | "null";

export default function updateJsonAtPath(
  obj: any,
  path: string,
  value: any,
  type: PrimitiveType
): any {
  const castValue = castToType(value, type);
  const keys = path.split(".");

  const result = { ...obj };
  let current = result;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];

    if (
      !(key in current) ||
      typeof current[key] !== "object" ||
      current[key] === null
    ) {
      current[key] = {};
    }

    current = current[key];
  }

  current[keys[keys.length - 1]] = castValue;

  return result;
}

function castToType(value: any, type: PrimitiveType): any {
  switch (type) {
    case "string":
      return String(value);
    case "number":
      const num = Number(value);
      if (isNaN(num)) throw new Error(`Cannot cast "${value}" to number`);
      return num;
    case "boolean":
      if (value === "true" || value === true) return true;
      if (value === "false" || value === false) return false;
      throw new Error(`Cannot cast "${value}" to boolean`);
    case "null":
      return null;
    default:
      throw new Error(`Unsupported type: ${type}`);
  }
}
