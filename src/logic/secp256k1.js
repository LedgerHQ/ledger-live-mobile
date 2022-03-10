import secp256k1 from "@ledgerhq/react-native-secp256k1";

export async function publicKeyTweakAdd(publicKey, tweak) {
  const buffer = Buffer.from(
    await secp256k1.pubKeyTweakAdd(
      Buffer.from(publicKey).toString("base64"),
      Buffer.from(tweak).toString("base64"),
    ),
    "base64",
  );
  // buffer is a uncompressed public key, we should return a compressed public key. refer to https://bitcoin.stackexchange.com/questions/3059/what-is-a-compressed-bitcoin-key
  return Promise.resolve(
    Buffer.concat([
      Buffer.from(buffer[64] % 2 === 0 ? "02" : "03", "hex"),
      buffer.slice(1, 33),
    ]).toJSON().data,
  );
}
