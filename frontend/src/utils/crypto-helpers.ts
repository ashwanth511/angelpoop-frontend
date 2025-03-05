import { Sha256 } from "@aws-crypto/sha256-js";

export const sha256 = (str: string) => {
  const sha = new Sha256();
  sha.update(str);
  return Buffer.from(sha.digestSync());
}; 