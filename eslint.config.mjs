import * as tseslint from "typescript-eslint";
import eslint from "eslint-plugin-import";
import importPlugin from "eslint-plugin-import";
import vitest from '@vitest/eslint-plugin'

export default tseslint.config(
    {
        ignores: ['dist/', 'examples/'],
    },
    eslint.configs.recommended, //기본적으로 ESLint의 추천 규칙을 적용합니다.
    tseslint.configs.recommended, //typescript-eslint의 추천 규칙을 적용합니다.
    importPlugin.flatConfigs.recommended, //eslint-plugin-import에서 제공하는 추천 규칙을 적용합니다.
    {
        settings: {
            'import/resolver': {
                typescript: true, //TypeScript 파일에 대해 typescript를 해결하는 설정을 추가합니다.
            },
        },
        rules: {
            eqeqeq: 'error', //==과 != 대신 ===와 !==를 사용하도록 강제합니다. (error)
            curly: ['warn', 'multi-line', 'consistent'],
            'sort-imports': [
                'error',
                {
                    ignoreDeclarationSort: true, // import 구문을 알파벳 순으로 정렬하라는 규칙입니다.
                },
            ],
            'import/no-unresolved': ['error', { commonjs: true, amd: true }], //import 경로가 해결되지 않으면 에러를 발생시킵니다.
            'import/named': 'off',
            'import/namespace': 'off',
            'import/no-named-as-default-member': 'off',
            'import/no-duplicates': 'error',
            'import/extensions': ['error', 'always'], //파일 확장자를 항상 명시하도록 강제합니다.
            'import/order': [
                'error',
                {
                    alphabetize: { order: 'asc', caseInsensitive: true },
                    groups: [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index',
                        'object',
                    ],
                    'newlines-between': 'never',
                    pathGroups: [
                        {
                            group: 'builtin',
                            position: 'before',
                        },
                    ],
                    pathGroupsExcludedImportTypes: ['builtin'],
                },
            ],
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': [
                'warn',
                { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
            ],
        }
    },
    {
        files: ['tests/**/*.ts'],
        ...vitest.configs.recommended,
        rules: {
            'import/extensions': ['error', 'never'], //테스트 파일에서는 확장자를 사용하지 않도록 설정합니다.
            '@typescript-eslint/no-unused-vars': 'off', //테스트 파일에서는 사용되지 않는 변수에 대한 경고를 끕니다.
            'vitest/expect-expect': 'off', //expect가 항상 사용되도록 요구하는 규칙을 끕니다.
            'vitest/consistent-test-it': [
                'error',
                { fn: 'it', withinDescribe: 'it' }, //테스트에서 it을 항상 사용하도록 강제합니다.
            ],
        },
    },
    {
        files: ['*.js'],
        rules: {
            '@typescript-eslint/no-require-imports': 'off', //TypeScript에서 require 대신 import를 사용하도록 강제하는 규칙을 끕니다.
        },
    },
)
