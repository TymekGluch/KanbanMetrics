const HASH_MODULO = 1_000_000_007;
const HASH_MULTIPLIER = 31;

export type HashDescriptor =
  | null
  | undefined
  | string
  | number
  | boolean
  | HashDescriptor[]
  | { [key: string]: HashDescriptor };

type IncrementalHash = {
  digest: () => string;
  update: (chunk: string) => void;
};

export function createIncrementalHash(): IncrementalHash {
  let hash = 0;
  let length = 0;

  return {
    update(chunk: string) {
      for (let index = 0; index < chunk.length; index += 1) {
        hash = (hash * HASH_MULTIPLIER + chunk.charCodeAt(index)) % HASH_MODULO;
      }

      length += chunk.length;
    },
    digest() {
      return `${hash.toString(36)}-${length.toString(36)}`;
    },
  };
}

function writeDescriptorHash(hasher: IncrementalHash, value: HashDescriptor): void {
  if (value === null) {
    hasher.update("l;");
    return;
  }

  if (value === undefined) {
    hasher.update("u;");
    return;
  }

  if (typeof value === "string") {
    hasher.update(`s${value.length}:`);
    hasher.update(value);
    hasher.update(";");
    return;
  }

  if (typeof value === "number") {
    const serializedNumber = Number.isNaN(value) ? "NaN" : `${value}`;
    hasher.update(`n${serializedNumber};`);
    return;
  }

  if (typeof value === "boolean") {
    hasher.update(value ? "b1;" : "b0;");
    return;
  }

  if (Array.isArray(value)) {
    hasher.update("a[");

    for (const item of value) {
      writeDescriptorHash(hasher, item);
    }

    hasher.update("]");
    return;
  }

  const keys = Object.keys(value).sort();
  hasher.update("o{");

  for (const key of keys) {
    hasher.update(`k${key.length}:`);
    hasher.update(key);
    hasher.update("=");
    writeDescriptorHash(hasher, value[key]);
  }

  hasher.update("}");
}

export function hashDescriptor(value: HashDescriptor): string {
  const hasher = createIncrementalHash();
  writeDescriptorHash(hasher, value);

  return hasher.digest();
}

export function hashString(value: string): string {
  const hasher = createIncrementalHash();
  hasher.update(value);

  return hasher.digest();
}
