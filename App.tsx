import { useIntegration } from "@telegram-apps/react-router-integration";
import {
    bindMiniAppCSSVars,
    bindThemeParamsCSSVars,
    bindViewportCSSVars,
    initNavigator,
    useLaunchParams,
    useMiniApp,
    useThemeParams,
    useViewport,
} from "@telegram-apps/sdk-react";
import { AppRoot } from "@telegram-apps/telegram-ui";
import { type FC, useEffect, useMemo, useState } from "react";
import { Navigate, Route, Router, Routes } from "react-router-dom";

import { routes } from "@/navigation/routes.tsx";
import { Layout } from "@/components/Layout/Layout.tsx";

export const App: FC = () => {
    const lp = useLaunchParams();
    const miniApp = useMiniApp();
    const themeParams = useThemeParams();
    const viewport = useViewport();

    //edit to null and uncomment useffect for desktop restriction
    const [isMobile, setIsMobile] = useState<boolean | null>(true);

    // useEffect(() => {
    //     const userAgent = navigator.userAgent;
    //     if (/Mobile|Android|iPhone|iPad|iPod/.test(userAgent)) {
    //         setIsMobile(true);
    //     } else {
    //         setIsMobile(false);
    //     }
    // }, []);

    useEffect(() => {
        return bindMiniAppCSSVars(miniApp, themeParams);
    }, [miniApp, themeParams]);

    useEffect(() => {
        return bindThemeParamsCSSVars(themeParams);
    }, [themeParams]);

    useEffect(() => {
        return viewport && bindViewportCSSVars(viewport);
    }, [viewport]);

    const appNavigator = useMemo(
        () => initNavigator("app-navigation-state"),
        []
    );
    const [location, reactNavigator] = useIntegration(appNavigator);

    useEffect(() => {
        appNavigator.attach();
        return () => appNavigator.detach();
    }, [appNavigator]);

    return isMobile ? (
        <AppRoot
            appearance={miniApp.isDark ? "dark" : "light"}
            platform={["macos", "ios"].includes(lp.platform) ? "ios" : "base"}
        >
            <Router location={location} navigator={reactNavigator}>
                <Routes>
                    <Route path="/" element={<Layout />}>
                        {routes.map((route) => (
                            <Route key={route.path} {...route} />
                        ))}
                        <Route path="*" element={<Navigate to="/" />} />
                    </Route>
                </Routes>
            </Router>
        </AppRoot>
    ) : (
        <div
            style={{
                color: "white",
                textAlign: "center",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100vh",
            }}
        >
            <p>This site is only accessible from a mobile device.</p>
        </div>
    );
};
