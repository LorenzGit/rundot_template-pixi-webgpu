import { getRunCapabilities } from "../sdk/runSdk.ts";
import { t } from "../systems/localization.ts";
import { useStore } from "../state/store.ts";
import MenuScreenLayout from "./MenuScreenLayout.tsx";

export default function ShopScreen() {
    useStore((state) => state.locale);
    const capabilities = getRunCapabilities();
    const status =
        capabilities.purchases || capabilities.ads
            ? "LIVEOPS + PLACEHOLDER IDS NOT CONFIGURED"
            : t("SettingsUnavailable");
    return (
        <MenuScreenLayout title={t("MenuShop")} kicker="MONETIZATION / FAIL-CLOSED">
            <p className="screen-copy">{t("ShopBody")}</p>
            <article className="shop-card">
                <p className="eyebrow">REWARDED PLACEMENT</p>
                <h3>RESULTS BONUS</h3>
                <p>Reward: 100 placeholder soft currency</p>
                <button type="button" disabled>
                    {status}
                </button>
            </article>
            <article className="shop-card">
                <p className="eyebrow">RUN SHOP PRODUCT</p>
                <h3>STARTER BUNDLE</h3>
                <p>Price is never invented; it must come from the live RUN catalog.</p>
                <button type="button" disabled>
                    {status}
                </button>
            </article>
            <p className="safety-note">No ad reward or purchase entitlement is granted by this template screen.</p>
        </MenuScreenLayout>
    );
}
