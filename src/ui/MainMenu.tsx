import packageJson from "../../package.json";
import { audioManager } from "../audio/audioManager.ts";
import { saveSystem } from "../systems/save.ts";
import { t } from "../systems/localization.ts";
import { dailySystems } from "../systems/dailySystems.ts";
import { runtimeServices } from "../systems/runtimeServices.ts";
import { store, useStore, type MenuScreen } from "../state/store.ts";

const destinations: Array<{ screen: MenuScreen; icon: string; label: string }> = [
    { screen: "daily-rewards", icon: "07", label: "MenuDailyRewards" },
    { screen: "daily-quests", icon: "Q", label: "MenuDailyQuests" },
    { screen: "shop", icon: "RB", label: "MenuShop" },
    { screen: "stats", icon: "#", label: "MenuStats" },
    { screen: "run-features", icon: "RUN", label: "MenuRunFeatures" },
    { screen: "settings", icon: "*", label: "MenuSettings" },
];

async function activate(action: () => void): Promise<void> {
    await audioManager.unlock();
    audioManager.play("tap");
    void runtimeServices.haptic("light");
    action();
}

export default function MainMenu() {
    useStore((state) => state.locale);
    const coins = useStore((state) => state.coins);
    const level = useStore((state) => state.level);

    const play = () =>
        void activate(() => {
            audioManager.play("start");
            runtimeServices.funnel(2, "demo_started", "template_first_play", 1);
            store.patch({ phase: "playing", score: 0, totalPlays: store.get().totalPlays + 1 });
            dailySystems.recordQuestProgress("plays");
            void saveSystem.flush();
        });

    return (
        <main className="menu-shell pt-safe-top pb-safe-bottom">
            <div className="menu-orbit menu-orbit-a" />
            <div className="menu-orbit menu-orbit-b" />
            <header className="menu-header">
                <p className="eyebrow">RUN / PIXI 8 / WEBGPU</p>
                <h1>
                    PIXEL
                    <br />
                    <span>FOUNDRY</span>
                </h1>
                <p className="menu-subtitle">{t("MenuSubtitle")}</p>
            </header>

            <section className="player-strip" aria-label="Player summary">
                <span>LV {level}</span>
                <span>{coins.toLocaleString()} COINS</span>
            </section>

            <button type="button" className="play-button" onClick={play}>
                <span>{t("ButtonPlay")}</span>
                <span aria-hidden="true">▶</span>
            </button>

            <nav className="menu-grid" aria-label="Game menus">
                {destinations.map(({ screen, icon, label }) => (
                    <button
                        type="button"
                        className="menu-tile"
                        key={screen}
                        onClick={() => void activate(() => store.patch({ menuScreen: screen }))}
                    >
                        <span className="menu-icon" aria-hidden="true">
                            {icon}
                        </span>
                        <span>{t(label)}</span>
                    </button>
                ))}
            </nav>

            <p className="template-stamp">TEMPLATE PLACEHOLDER IDENTITY · v{packageJson.version}</p>
        </main>
    );
}
