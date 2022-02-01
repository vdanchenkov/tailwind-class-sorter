# tailwind-class-sorter

Sorts tailwind CSS classes in a way similar to prettier-plugin-tailwindcss.

Use prettier-plugin-tailwindcss if prettier is available for your programming language. This extension was made because we did not.

Work is based on https://github.com/heybourn/headwind and https://github.com/tailwindlabs/prettier-plugin-tailwindcss hacked together for our specific usage.

## Features

Sorts tailwind css classes in recommended order https://tailwindcss.com/blog/automatic-class-sorting-with-prettier#how-classes-are-sorted

It runs automatically on save for languages with configured regexes.

## Requirements

- tailwindcss@3 installed in node_modules of your project
- tailwind.config.js present in the workspace root

## Extension Settings

Example settings to enable this extension for rescript:

```
"tailwind-class-sorter.classRegex": {
    "rescript": [
      "className\\w*?=\\w*(\"[\\s\\S]+?\")|className\\w*?=\\w*?\\{([\\s\\S]+?)\\}",
      "\"(.+?)\""
    ]
  }
```

## Known Issues

Have no option to disable autosave.

Will not work in multi-root or monorepo workspaces.

## Release Notes

### 0.0.1

Initial release
