import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";

export const reactConfig = {
    ...reactPlugin.configs.flat["jsx-runtime"],

    languageOptions: {
        globals: {
            ...globals.browser,
        },
    },

    plugins: {
        "react-hooks": reactHooks,
    },

    rules: {
        ...reactHooks.configs.recommended.rules,
        "react/react-in-jsx-scope": "off",
    },

    settings: {
        react: {
            version: "detect",
        },
    },
};