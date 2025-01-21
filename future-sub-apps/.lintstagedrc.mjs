export default {
  // eslint-disable-next-line prettier/prettier
  '*.{js,jsx,ts,tsx}': [
    'prettier --cache --ignore-unknown  --write',
    'eslint --cache --fix',
  ],

  '*.{scss,less,styl,html,vue,css}': [
    'prettier --cache --ignore-unknown --write',
    // 'stylelint --fix --allow-empty-input',
  ],
  '*.md': ['prettier --cache --ignore-unknown --write'],

  '*.vue': [
    'prettier --write',
    'eslint --cache --fix',
    // 'stylelint --fix --allow-empty-input',
  ],
  // eslint-disable-next-line prettier/prettier
  '{!(package)*.json,*.code-snippets,.!(browserslist)*rc}': [
    'prettier --cache --write--parser json',
  ],
  'package.json': ['prettier --cache --write'],
};
