// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    files: ["**/*.ts"],
    ignores: [
      "**/*.d.ts",
      "**/*.spec.ts",
      "**/*.test.ts",
      "node_modules/",
      "backend/"
    ],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        {
          "type": "attribute",
          "prefix": "app",
          "style": "camelCase"
        }
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          "type": "element",
          "prefix": "app",
          "style": "kebab-case"
        }
      ],
      "@angular-eslint/no-output-native": "off",
      "quotes": ["error", "single"],
      "for-direction": "error",
      "no-async-promise-executor": "error",
      "no-case-declarations": "error",
      "no-class-assign": "error",
      "no-compare-neg-zero": "error",
      "no-constant-condition": "error",
      "no-control-regex": "error",
      "no-delete-var": "error",
      "no-dupe-else-if": "error",
      "no-duplicate-case": "error",
      "no-empty-character-class": "error",
      "no-empty-pattern": "error",
      "no-ex-assign": "error",
      "no-extra-boolean-cast": "error",
      "no-global-assign": "error",
      "no-inner-declarations": "error",
      "no-invalid-regexp": "error",
      "no-irregular-whitespace": "error",
      "no-misleading-character-class": "error",
      "no-mixed-spaces-and-tabs": "error",
      "no-octal": "error",
      "no-prototype-builtins": "error",
      "no-regex-spaces": "error",
      "no-self-assign": "error",
      "no-shadow-restricted-names": "error",
      "no-sparse-arrays": "error",
      "no-unexpected-multiline": "error",
      "no-useless-catch": "error",
      "no-useless-escape": "error",
      "no-with": "error",
      "require-yield": "error",
      "getter-return": "off",
      "no-const-assign": "off",
      "no-dupe-args": "off",
      "no-dupe-class-members": "off",
      "no-dupe-keys": "off",
      "no-func-assign": "off",
      "no-import-assign": "off",
      "no-new-symbol": "off",
      "no-obj-calls": "off",
      "no-redeclare": "off",
      "no-setter-return": "off",
      "no-this-before-super": "off",
      "no-undef": "off",
      "no-unreachable": "off",
      "no-unsafe-negation": "off",
      "prefer-rest-params": "error",
      "prefer-spread": "error",
      "@typescript-eslint/ban-ts-comment": "error",
      "@typescript-eslint/explicit-module-boundary-types": "warn",
      "no-array-constructor": "off",
      "@typescript-eslint/no-array-constructor": "error",
      "no-empty-function": "off",
      "@typescript-eslint/no-extra-non-null-assertion": "error",
      "no-extra-semi": "off",
      "@typescript-eslint/no-non-null-asserted-optional-chain": "error",
      "@typescript-eslint/no-this-alias": "error",
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          "vars": "all",
          "varsIgnorePattern": "^_",
          "args": "after-used",
          "argsIgnorePattern": "^_"
        }
      ],
      "@typescript-eslint/prefer-as-const": "error",
      "no-restricted-imports": [
        "error",
        {
          "paths": [
            {
              "name": "rxjs/Rx",
              "message": "Please import directly from 'rxjs instead'"
            }
          ]
        }
      ],
      "@typescript-eslint/member-ordering": [
        "error",
        {
          "default": [
            "static-field",
            "instance-field",
            "static-method",
            "instance-method"
          ]
        }
      ],
      "no-restricted-syntax": [
        "error",
        {
          "selector": "CallExpression[callee.object.name='console'][callee.property.name=/^(debug|info|time|timeEnd|trace)$/]",
          "message": "Unexpected property on console object was called"
        }
      ],
      "no-fallthrough": "error",
      "@angular-eslint/no-empty-lifecycle-method": "error",
      "@typescript-eslint/interface-name-prefix": "off",
      "@typescript-eslint/explicit-member-accessibility": "off",
      "sort-keys": "off",
      "@angular-eslint/component-class-suffix": "error",
      "@angular-eslint/contextual-lifecycle": "error",
      "@angular-eslint/directive-class-suffix": "error",
      "@angular-eslint/no-conflicting-lifecycle": "error",
      "@angular-eslint/no-input-rename": "error",
      "@angular-eslint/no-inputs-metadata-property": "error",
      "@angular-eslint/no-output-on-prefix": "error",
      "@angular-eslint/no-output-rename": "error",
      "@angular-eslint/no-outputs-metadata-property": "error",
      "@angular-eslint/use-lifecycle-interface": "error",
      "@angular-eslint/use-pipe-transform-interface": "error",
      "@typescript-eslint/adjacent-overload-signatures": "error",
      "@typescript-eslint/array-type": "off",
      "@typescript-eslint/consistent-type-assertions": "error",
      "@typescript-eslint/naming-convention": [
        "warn",
        {
          "selector": "default",
          "format": ["camelCase", "snake_case"],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          "selector": "variable",
          "format": ["camelCase", "UPPER_CASE"],
          "leadingUnderscore": "allow",
          "trailingUnderscore": "allow"
        },
        {
          "selector": "typeLike",
          "format": ["PascalCase"]
        },
        {
          "selector": "memberLike",
          "modifiers": ["private"],
          "format": ["camelCase"]
        },
        {
          "selector": "variable",
          "modifiers": ["const"],
          "format": ["camelCase", "UPPER_CASE"]
        },
        {
          "selector": "variable",
          "modifiers": ["exported"],
          "format": ["camelCase", "UPPER_CASE", "PascalCase"]
        },
        {
          "selector": "property",
          "modifiers": ["static"],
          "format": ["camelCase", "UPPER_CASE", "PascalCase"]
        },
        {
          "selector": "property",
          "modifiers": ["readonly"],
          "format": ["camelCase", "UPPER_CASE", "PascalCase"]
        },
        {
          "selector": "variable",
          "filter": {
            "regex": "Store$",
            "match": true
          },
          "format": null
        },
        {
          "selector": "enumMember",
          "format": ["UPPER_CASE"]
        },
        {
          "selector": "typeProperty",
          "format": ["snake_case", "camelCase"]
        }
      ],
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/no-empty-interface": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-inferrable-types": [
        "error",
        {
          "ignoreParameters": true
        }
      ],
      "@typescript-eslint/no-misused-new": "error",
      "@typescript-eslint/no-namespace": "error",
      "@typescript-eslint/no-parameter-properties": "off",
      "@typescript-eslint/no-unused-expressions": "error",
      "@typescript-eslint/no-use-before-define": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/prefer-for-of": "error",
      "@typescript-eslint/prefer-function-type": "error",
      "@typescript-eslint/prefer-namespace-keyword": "error",
      "@typescript-eslint/triple-slash-reference": [
        "error",
        {
          "path": "always",
          "types": "prefer-import",
          "lib": "always"
        }
      ],
      "@typescript-eslint/unified-signatures": "error",
      "arrow-parens": ["warn", "as-needed"],
      "complexity": "off",
      "constructor-super": "error",
      "eqeqeq": ["error", "smart"],
      "guard-for-in": "error",
      "id-blacklist": [
        "error",
        "any",
        "Number",
        "number",
        "String",
        "string",
        "Boolean",
        "boolean",
        "Undefined",
        "undefined"
      ],
      "id-match": "error",
      "max-classes-per-file": "off",
      "no-bitwise": "error",
      "no-caller": "error",
      "no-cond-assign": "error",
      "no-console": [
        "error",
        {
          "allow": [
            "log",
            "warn",
            "dir",
            "timeLog",
            "assert",
            "clear",
            "count",
            "countReset",
            "group",
            "groupEnd",
            "table",
            "dirxml",
            "error",
            "groupCollapsed",
            "Console",
            "profile",
            "profileEnd",
            "timeStamp",
            "context"
          ]
        }
      ],
      "no-debugger": "error",
      "no-empty": "off",
      "no-eval": "error",
      "no-invalid-this": "off",
      "no-new-wrappers": "error",
      "@typescript-eslint/no-shadow": [
        "error",
        {
          "hoist": "all"
        }
      ],
      "no-throw-literal": "error",
      "no-undef-init": "error",
      "no-unsafe-finally": "error",
      "no-unused-labels": "error",
      "no-var": "error",
      "object-shorthand": "error",
      "one-var": ["error", "never"],
      "prefer-const": "error",
      "radix": "error",
      "use-isnan": "error",
      "valid-typeof": "off",
    }
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {
      "max-len": ["error", { "code": 140 }],
    }
  }
);
