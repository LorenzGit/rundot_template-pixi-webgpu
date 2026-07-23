# RUN Pixi WebGPU template

This repository is a reusable 2D PixiJS, WebGPU-first portrait starter. Keep
the renderer, lifecycle, safe-area, accessibility, persistence, and
capability-gated RUN integration generic. Treat the Pixel Foundry identity,
demo loop, copy, economy, IDs, and presentation as replaceable examples.

Follow the parent RUN workspace instructions and the source-of-truth order
defined there before changing SDK or CLI integration.

## Project-local skills

- Use [`.agents/skills/img2threejs/SKILL.md`](.agents/skills/img2threejs/SKILL.md)
  when a reference image must become a code-only, procedural Three.js model,
  sculpt specification, or staged reconstruction plan. Read that file
  completely, follow its quality gates, and load its referenced `forge/` and
  `grimoire/` resources as directed.
- `img2threejs` is optional authoring tooling. It produces Three.js code, not a
  Pixi display object, and is not a runtime dependency of this template. Do
  not use it for ordinary 2D Pixi artwork or imply that its output renders in
  Pixi without a deliberate Three.js integration or conversion step.
- Using the local skill does not authorize RUN-billed 3D generation, external
  asset downloads, deployment, publication, or other remote mutations.
- Preserve the vendored skill's Apache-2.0 license and its entry in
  `THIRD_PARTY_NOTICES.md` when copying or redistributing this template.

## Verification

Run `npm run check:all` after template changes. The invariant suite verifies
that the project-local skill retains its instructions, license, pipeline
scripts, and required quality references.
