# RUN Pixi WebGPU template

A small, production-minded portrait starter for 2D RUN.world games. The default
app is deliberately ordinary: React 19 UI, PixiJS 8 with WebGPU-first/WebGL
fallback, generated WebAudio, strict TypeScript, versioned saves, localization,
daily systems, and fail-closed RUN integrations.

The repository also serves as a map of the wider RUN platform. Safe client
features are visible in the active demo behind explicit controls. Patterns that
can navigate away, spend value, mutate remote state, upload content, require
creator authority, or need a server build live under `additional_features/`;
they are typechecked but never imported by the default client bundle.

## Quick start

Node.js 22 or newer is required. Install the exact reviewed dependency graph
from the lockfile:

```sh
git clone https://github.com/LorenzGit/rundot_template-pixi-webgpu.git
cd rundot_template-pixi-webgpu
npm ci
npm run dev
```

Before adapting or publishing a derived game, run the complete verification
suite:

```sh
npm run check:all
```

Useful focused commands:

```sh
npm run typecheck          # active app and additional feature references
npm run format             # apply the repository formatter
npm run lint               # Biome correctness and accessibility lint
npm run check              # format, lint, tests, normal + bundled builds
npm run check:all          # check plus multiplayer + Syncplay builds
npm run build              # RUN embedded-library build
npm run build:bundled      # standalone fallback build
npm run dev:playground     # real RUN services; sign-in required
npm run dev:multiplayer    # local room server + client
npm run build:multiplayer  # emits the room server bundle
npm run build:syncplay     # strict determinism check
```

Playground is opt-in because it connects to persistent RUN data. Purchases made
there are real. Never buy, upload platform configuration, deploy, publish, or
run billed generation without the owner’s explicit approval.

`firebase` is an explicit, pinned dependency because RUN SDK 5.24 dynamically
imports its Playground authentication bridge without declaring the package as
a dependency. It is required for a resolvable production graph even though the
template never imports Firebase directly.

React and React DOM are also pinned to the exact versions in SDK 5.24's
embedded-library manifest. The build verifier fails if that optimization
silently stops working or if a generated JavaScript chunk exceeds 600 kB.
The npm install-script policy pins the reviewed SDK and esbuild scripts while
denying unnecessary Firebase, protobuf, and native fsevents install behavior.

## Repository map

| Path | Purpose |
| --- | --- |
| `src/game/` | Pixi application, portrait stage, demo scene, particles, and tweens |
| `src/sdk/` | Capability-gated RUN facade and visible Feature Lab integration |
| `src/systems/` | Persistence, trusted time, localization, and daily systems |
| `src/ui/` | React-owned menus, HUD, settings, and platform demonstrations |
| `additional_features/` | Typechecked opt-in patterns excluded from the default client bundle |
| `docs/` | Platform, runtime, monetization, CLI, and audio contracts |
| `scripts/` | Template invariants and production-build verification |

## What is active

- Pixi 8 tries WebGPU device initialization and explicitly retries WebGL when
  that fails. `?renderer=webgpu` and
  `?renderer=webgl` force a backend for QA; the result is exposed as
  `document.documentElement.dataset.renderer`.
- A centered 9:16 portrait frame scales across phone, tablet, and desktop while
  RUN safe-area values feed CSS variables on every side.
- The procedural demo exercises sprite animation, tweens, particles, cleanup,
  reduced motion, quality scaling, lifecycle pause/resume, and generated audio.
- Versioned persistence validates untrusted save fields and serializes/coalesces
  RUN `appStorage` writes; plain local development has a visibly
  non-authoritative browser fallback.
- Daily rewards and quests use trusted RUN time in the host, stable claim IDs,
  duplicate/in-flight guards, atomic persistence, and rollback on save failure.
- LiveOps, custom/funnel analytics, notification consent/messaging, haptics, rewarded ads,
  Shop purchases, lifecycle hooks, and identity changes pass through one typed
  boundary in `src/sdk/runSdk.ts`.
- Monetization stays off until LiveOps, real IDs, host capability, direct player
  action, and authoritative outcomes all agree.
- The visible RUN Feature Lab exposes rewarded/interstitial ad tests, the native
  haptic palette, host/profile/system/gamepad/launch/attribution/time/feature
  discovery, native host UI, sign-in, add-to-home, player-service reads, sharing,
  clipboard writes, and all mapped SDK groups. Android back navigation closes
  the current game screen before delegating root exit to the host. Unsupported local calls report unavailable; they
  never simulate a successful host result.
- Procedural audio uses a quiet 68 BPM major-seventh motif with enveloped notes,
  cue cooldowns, separate Music/SFX controls, lifecycle suspension, and QA
  counters. Its direction is recorded in `docs/audio.md`.
- `?qa=1` installs a semantic `globalThis.__gameQa` contract in development
  only. Production builds do not expose it.

## Platform reference

- [`docs/run-capabilities.md`](docs/run-capabilities.md) maps every SDK surface,
  what prior games taught the template, required authority, and its source.
- [`docs/rundot-cli.md`](docs/rundot-cli.md) is the CLI command/safety atlas.
- [`additional_features/`](additional_features/) contains only the typechecked
  patterns intentionally excluded from the default demo, including camera,
  microphone, simulation, and permissioned-content examples, plus an adoption guide.
- [`additional_features/config/`](additional_features/config/)
  contains inert config references outside the auto-discovered `rundot/` directory.
- [`rundot/realtime.config.json`](rundot/realtime.config.json) is the one
  canonical-path exception required by the SDK's multiplayer validator. It is
  consumed only by the explicit multiplayer scripts and can be removed from a
  single-player derivative.
- [`docs/runtime.md`](docs/runtime.md) and
  [`docs/monetization.md`](docs/monetization.md) define the active contracts.
- [`docs/audio.md`](docs/audio.md) defines the procedural mix,
  feedback map, accessibility posture, and audio QA expectations.

The installed reference baseline is rundot CLI 7.10.0 and
`@series-inc/rundot-game-sdk` 5.24.0. Platform surfaces evolve; verify against
the installed declarations and `rundot <group> --help` before adopting an
example.

## Deriving a game

1. Copy this directory into the new game’s own folder/repository.
2. Replace the package name, title, menu identity, storage keys, analytics and
   notification IDs, self-authored `template_*` ad placement IDs, art,
   thumbnail, copy, balance, and procedural presentation.
3. Keep `base: './'`, capability gates, safe areas, lifecycle handling, error
   boundaries, user-selection suppression, and authoritative reward rules.
4. Copy only the optional modules and server configs the design needs. Remove
   unused `additional_features/` material before shipping a focused game.
5. Replace every `REPLACE_WITH_*` value. A placeholder intentionally makes its
   platform feature unavailable.
6. Verify local, RUN Playground, and production-host behavior separately. Never
   fake host-only success in local development.
7. Immediately before deployment, run `npm run check:all` and the workspace
   readiness audit, then produce a fresh build.

`game.config.prod.json` is a non-deployable placeholder until its game ID is
replaced. The supplied thumbnail and Pixel Foundry presentation are examples,
not defaults to preserve.

## Repository hygiene

The repository includes normalized line endings, locked dependencies, a
read-only CI workflow, contribution guidance, a security policy, and ignore
rules for dependencies, builds, secrets, Playground config, operator state,
player snapshots, campaign state, and transient QA output. Never commit
credentials, `.env` files, player data, or live campaign state.

The code is licensed under the terms in [`LICENSE.md`](LICENSE.md). Preserve the
license and notices when redistributing. It is RUN-only/source-available before
January 1, 2028 and automatically converts to MIT on that date; do not describe
the current license as OSI open source. Runtime dependency licenses are listed
in [`THIRD_PARTY_NOTICES.md`](THIRD_PARTY_NOTICES.md).

Contributions are welcome under [`CONTRIBUTING.md`](CONTRIBUTING.md). Report
security issues privately by following [`SECURITY.md`](SECURITY.md).
