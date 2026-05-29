import frontend from "./apps/frontend/eslint.config.js";
import backend from "./apps/backend/eslint.config.js";
import ui from "./packages/ui/eslint.config.js"

export default [
    ...frontend,
    ...backend,
    ...ui
];