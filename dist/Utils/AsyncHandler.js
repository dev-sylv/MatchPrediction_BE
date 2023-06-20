"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AsyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);
exports.default = AsyncHandler;
