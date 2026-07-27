# Dependency notes

## Known dismissed advisory: `brace-expansion` GHSA-mh99-v99m-4gvg

**Status: dismissed in Dependabot as "risk is tolerable to this project". Do not
re-open this investigation without reading the section below.**

Dependabot will keep reporting this one, and GitHub's suggested fix does not
work. It was tested, not assumed.

| | |
| --- | --- |
| Advisory | [GHSA-mh99-v99m-4gvg](https://github.com/advisories/GHSA-mh99-v99m-4gvg) |
| Package | `brace-expansion` (npm), transitive |
| Severity | high |
| Affected | `<= 5.0.7` |
| Patched | `5.0.8` |
| Reaches us via | `eslint` → `minimatch@3` → `brace-expansion@1.1.16` |
| and via | `eslint-config-next` → `@typescript-eslint/*` → `minimatch@9` → `brace-expansion@2.1.2` |

### Why it is not fixed

There is no version of `brace-expansion` that is both patched and installable
here.

- The 1.x line ends at `1.1.16` and the 2.x line ends at `2.1.2`. Neither
  received a backport — the fix exists only in `5.0.8`.
- `minimatch@3` declares `brace-expansion: ^1.1.7` and `minimatch@9` declares
  `^2.0.2`. Version 5 satisfies neither.
- `minimatch@10` avoided the problem by switching to a **renamed** package,
  `@isaacs/brace-expansion@^5`. That rename is why the fix never landed on the
  old major lines.

### Why the suggested fix breaks the build

Dependabot's alert page offers a "Create Dependabot security update" button that
pins `brace-expansion` to `>= 5.0.8`. That suggestion is generated from the
advisory's version range without checking whether the consumers accept it. They
do not — version 5 changed the export from a bare function to a named one.

This was verified by actually applying the override (`"brace-expansion":
"^5.0.8"` in `pnpm.overrides`) and reinstalling. With 5.0.8 resolved in place of
1.x and 2.x:

```
$ node -e "const be = require('brace-expansion'); console.log(typeof be, typeof be.expand)"
object function          # 1.x and 2.x export the function itself, not an object

$ node -e "require('minimatch')('a/b.ts','a/**')"
TypeError: expand is not a function
```

Note that those commands only reproduce this while the override is in place. In
the repo's normal state they succeed, because 1.1.16 / 2.1.2 are installed —
vulnerable, but API-compatible.

`minimatch@3` and `@9` both do `const expand = require('brace-expansion')` and
call the result directly, so forcing 5.x makes every glob match throw and takes
eslint down with it. Do not click the button, and do not add a
`brace-expansion` override to `package.json`.

### Why the residual risk is acceptable

- It is dev-only. `brace-expansion` is reachable solely when eslint expands glob
  patterns from this repo. It is not in the built output and never runs in
  production — `pnpm audit --prod` is clean.
- The impact is that a lint process could exhaust memory on a maliciously
  crafted glob pattern. The patterns come from `eslint.config.mjs`, which we
  wrote.

### When it will actually close

When `eslint` and `@typescript-eslint` move to `minimatch@10`. Nothing on our
side changes that. Re-check by running `pnpm why brace-expansion` — if the
`minimatch` versions above have changed, this note is stale and the alert may be
resolvable.

## Keeping dependencies current

`pnpm outdated` alone is not enough. In March 2026 a dependency pass upgraded
everything to the then-latest versions, including `next@16.0.7` — which was
current that day. A security release landed eight days later, and by July the
project was 25 advisories behind on `next` alone while still looking "up to
date" by version-check standards.

Run both:

```bash
pnpm outdated        # what is behind
pnpm audit           # what is behind and exploitable
pnpm audit --prod    # what ships to users — this is the one that must stay clean
```
