export function bufferToObject(data: ArrayBufferLike): Object {
  // Bytes -> JSON string -> Object.
  let decoder = new TextDecoder();
  let jsonStr = decoder.decode(data);
  return JSON.parse(jsonStr);
}
