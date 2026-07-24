import { AnimatedSprite, Graphics, type Application, type Texture, type Ticker } from "pixi.js";
import { audioManager } from "../audio/audioManager.ts";
import { createTweenController, ease } from "./tween.ts";
import { createParticleEmitter } from "./particles.ts";
import { runtimeServices } from "../systems/runtimeServices.ts";
import { dailySystems } from "../systems/dailySystems.ts";
import { store } from "../state/store.ts";
import type { Stage } from "./stage.ts";

export interface Scene {
    destroy(): void;
}

function createFrames(app: Application): Texture[] {
    const colors = [0xf4c95d, 0xffdc78, 0xf5a65b, 0xf4c95d];
    return colors.map((color, index) => {
        const frame = new Graphics()
            .rect(16, 0, 48, 16)
            .fill(color)
            .rect(0, 16, 80, 48)
            .fill(color)
            .rect(16, 64, 48, 16)
            .fill(color)
            .rect(24 + index * 2, 22, 10, 10)
            .fill(0x10151f)
            .rect(48 - index * 2, 22, 10, 10)
            .fill(0x10151f)
            .rect(24, 50, 32, 8)
            .fill(0xb5462d);
        const texture = app.renderer.generateTexture(frame);
        frame.destroy();
        return texture;
    });
}

export function createDemoScene(app: Application, stage: Stage): Scene {
    const settings = store.get();
    const reducedMotion = settings.reducedMotion;
    const highQuality = settings.quality === "high";
    const frames = createFrames(app);
    const sprite = new AnimatedSprite(frames);
    const emitter = createParticleEmitter(stage.root);
    const tweens = createTweenController();
    const baseSize = Math.min(stage.designWidth(), stage.designHeight()) * 0.23;

    sprite.anchor.set(0.5);
    sprite.width = baseSize;
    sprite.height = baseSize;
    const baseScale = sprite.scale.x;
    sprite.x = stage.designWidth() / 2;
    sprite.y = stage.designHeight() / 2;
    sprite.animationSpeed = highQuality ? 0.12 : 0.07;
    if (reducedMotion) sprite.gotoAndStop(0);
    else sprite.play();
    stage.root.addChild(sprite);

    let vx = 300;
    let vy = 240;
    let alive = true;

    const punch = () => {
        if (reducedMotion) return;
        tweens.addTween(
            (value) => sprite.scale.set(value),
            sprite.scale.x,
            baseScale * 1.14,
            ease.outCubic,
            () => {
                if (!alive) return;
                tweens.addTween(
                    (value) => sprite.scale.set(value),
                    baseScale * 1.14,
                    baseScale,
                    ease.outBack,
                    undefined,
                    { durationMs: 180 },
                );
            },
            { durationMs: 90 },
        );
    };

    const offResize = stage.onResize(() => {
        sprite.x = Math.min(sprite.x, stage.designWidth() - baseSize / 2);
        sprite.y = Math.min(sprite.y, stage.designHeight() - baseSize / 2);
    });

    const tick = (ticker: Ticker) => {
        const dt = ticker.deltaMS / 1000;
        sprite.x += vx * dt;
        sprite.y += vy * dt;
        if (!reducedMotion) sprite.rotation += dt * 0.55;
        tweens.update(dt);
        emitter.update(dt);

        const half = baseSize / 2;
        const maxY = stage.designHeight();
        let bounced = false;
        if (sprite.x < half) {
            sprite.x = half;
            vx = Math.abs(vx);
            bounced = true;
        }
        const maxX = stage.designWidth();
        if (sprite.x > maxX - half) {
            sprite.x = maxX - half;
            vx = -Math.abs(vx);
            bounced = true;
        }
        if (sprite.y < half) {
            sprite.y = half;
            vy = Math.abs(vy);
            bounced = true;
        }
        if (sprite.y > maxY - half) {
            sprite.y = maxY - half;
            vy = -Math.abs(vy);
            bounced = true;
        }

        if (bounced) {
            const nextScore = store.get().score + 1;
            store.patch({ score: nextScore });
            dailySystems.recordQuestProgress("bounces");
            audioManager.play("bounce");
            punch();
            if (!reducedMotion) {
                emitter.burst(sprite.x, sprite.y, {
                    burst: highQuality ? 18 : 6,
                    lifeMaxMs: highQuality ? 560 : 280,
                    hue: 42,
                });
            }
            if (nextScore === 10) {
                void runtimeServices.haptic("success");
                runtimeServices.track("demo_ten_bounces", { quality: settings.quality });
            }
        }
    };
    app.ticker.add(tick);

    return {
        destroy() {
            alive = false;
            app.ticker.remove(tick);
            offResize();
            tweens.clear();
            emitter.destroy();
            sprite.stop();
            sprite.destroy();
            for (const texture of frames) texture.destroy(true);
        },
    };
}
