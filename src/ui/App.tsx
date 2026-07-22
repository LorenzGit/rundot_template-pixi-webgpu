/**
 * Screen router. One phase visible at a time; the 'playing' phase stacks the
 * React HUD above the Pixi canvas.
 *
 * #app-frame (styled in styles/app.css) is the device frame: a centered
 * portrait column that fills phones edge-to-edge and sits over a full-bleed
 * desktop backdrop. Everything interactive — canvas and DOM UI — lives inside
 * the frame, so safe areas and input never leak into decorative side art.
 */
import { store, useStore } from "../state/store.ts";
import { lazy, Suspense } from "react";
import LoadingScreen from "./LoadingScreen.tsx";
import MainMenu from "./MainMenu.tsx";
import Hud from "./Hud.tsx";
import GameCanvas from "../game/GameCanvas.tsx";
import DailyRewardsScreen from "./DailyRewardsScreen.tsx";
import DailyQuestsScreen from "./DailyQuestsScreen.tsx";
import ShopScreen from "./ShopScreen.tsx";
import StatsScreen from "./StatsScreen.tsx";
import SettingsScreen from "./SettingsScreen.tsx";

const RunFeaturesScreen = lazy(() => import("./RunFeaturesScreen.tsx"));

function MenuRoute() {
    const screen = useStore((state) => state.menuScreen);
    if (screen === "daily-rewards") return <DailyRewardsScreen />;
    if (screen === "daily-quests") return <DailyQuestsScreen />;
    if (screen === "shop") return <ShopScreen />;
    if (screen === "stats") return <StatsScreen />;
    if (screen === "run-features")
        return (
            <Suspense
                fallback={
                    <main className="route-loading" aria-busy="true">
                        LOADING RUN FEATURES…
                    </main>
                }
            >
                <RunFeaturesScreen />
            </Suspense>
        );
    if (screen === "settings") return <SettingsScreen />;
    return <MainMenu />;
}

export default function App() {
    const phase = useStore((s) => s.phase);
    return (
        <div id="app-frame" className="bg-surface text-white">
            {phase === "loading" && <LoadingScreen />}
            {phase === "menu" && <MenuRoute />}
            {phase === "playing" && (
                <div className="absolute inset-0">
                    <GameCanvas />
                    <Hud />
                </div>
            )}
            <Toast />
        </div>
    );
}

function Toast() {
    const toast = useStore((state) => state.toast);
    if (!toast) return null;
    return (
        <button type="button" className="toast" onClick={() => store.patch({ toast: null })}>
            {toast}
        </button>
    );
}
