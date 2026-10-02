export function notFound(req, res) {
  res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, _req, res, _next) {
  console.error(error);
  if (error.name === "ValidationError") return res.status(400).json({ success: false, message: Object.values(error.errors).map(({ message }) => message).join(", ") });
  if (error.code === 11000) return res.status(409).json({ success: false, message: "An account with that email already exists" });
  res.status(error.statusCode || 500).json({ success: false, message: error.message || "Internal server error" });
}

export const asyncHandler = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
