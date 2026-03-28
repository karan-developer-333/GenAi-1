// Shim for onnxruntime-node to enable WASM fallback on serverless platforms
module.exports = {
  InferenceSession: class {},
  SessionOptions: class {},
};
