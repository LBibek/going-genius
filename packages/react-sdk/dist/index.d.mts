import * as react_jsx_runtime from 'react/jsx-runtime';
import React, { ReactNode } from 'react';

/**
 * Going Genius Developer SDK
 * This SDK is designed to be imported by applications integrating with the GG Identity platform.
 */
interface GGUser {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    role?: string;
}
interface GGAppConfig {
    clientId: string;
    redirectUri: string;
}
declare class GoingGenius {
    private config;
    constructor(config: GGAppConfig);
    /**
     * Generates the OAuth 2.0 authorization URL.
     */
    getAuthUrl(state?: string): string;
    /**
     * Redirects the user to the GG Login screen.
     */
    login(state?: string): void;
}

interface GoingGeniusContextType {
    clientId: string;
    user: GGUser | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (state?: string) => void;
    logout: () => Promise<void>;
    refreshSession: () => Promise<void>;
}
declare function GoingGeniusProvider({ clientId, redirectUri, config, children }: {
    clientId: string;
    redirectUri?: string;
    config?: {
        apiBase?: string;
    };
    children: ReactNode;
}): react_jsx_runtime.JSX.Element;
declare function useGoingGenius(): GoingGeniusContextType;
declare const useGGAuth: typeof useGoingGenius;
declare const GGProvider: typeof GoingGeniusProvider;

declare function useGGPlan(appId: string): {
    hasActiveSubscription: boolean;
    isLoading: boolean;
    error: string | null;
};

interface GGBillingButtonProps {
    appId: string;
    planId?: string;
    className?: string;
    children?: React.ReactNode;
    variant?: 'primary' | 'outline' | 'ghost';
    onClick?: () => void;
}
declare function GGBillingButton({ appId, planId, className, children, variant, onClick }: GGBillingButtonProps): react_jsx_runtime.JSX.Element;

interface GGFeatureGateProps {
    appId: string;
    children: React.ReactNode;
    fallback?: React.ReactNode;
    loadingComponent?: React.ReactNode;
    showUpgradeButton?: boolean;
    upgradeLabel?: string;
}
declare function GGFeatureGate({ appId, children, fallback, loadingComponent, showUpgradeButton, upgradeLabel }: GGFeatureGateProps): string | number | bigint | true | Iterable<React.ReactNode> | Promise<string | number | bigint | boolean | React.ReactPortal | React.ReactElement<unknown, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined> | react_jsx_runtime.JSX.Element;

interface AISalesBotProps {
    appId: string;
    agentType?: 'sales' | 'support' | 'custom';
    greeting?: string;
    theme?: 'light' | 'dark' | 'glass';
    position?: 'bottom-right' | 'bottom-left';
    apiHost?: string;
}
declare function AISalesBot({ appId, agentType, greeting, theme, position, apiHost }: AISalesBotProps): react_jsx_runtime.JSX.Element;

export { AISalesBot, type AISalesBotProps, type GGAppConfig, GGBillingButton, GGFeatureGate, GGProvider, type GGUser, GoingGenius, GoingGeniusProvider, useGGAuth, useGGPlan, useGoingGenius };
