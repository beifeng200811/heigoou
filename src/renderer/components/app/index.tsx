import React, { useMemo } from 'react';
import { StatusBar } from '../status-bar';
import { getAllExtensions } from '../../extensions';
import { Icon as LegacyIcon } from '@ant-design/compatible';
import classnames from 'classnames';
import { useTranslation } from 'react-i18next';
import { Provider, KeepAlive } from 'react-keep-alive';
// @ts-ignore
import { Titlebar } from 'react-titlebar-osx';

import useAppExtensionPanels, { AppPanel } from '../../hooks/use-app-extension-panels';
import { useThemeModeProvider } from '../../hooks/use-theme-mode';
import useCurrentWindow from '../../hooks/use-current-window';
import { SYSTEM_IS_MACOS } from '../../const';

export const App = () => {
    const { t } = useTranslation();
    const ThemeModeProvider = useThemeModeProvider();
    const extensions = useMemo(() => getAllExtensions(), []);
    const { panels, rightStatusItems, activePanel, handleClickPanel } = useAppExtensionPanels(extensions);
    const currentWindow = useCurrentWindow();

    const renderActivePanel = () => {
        const ActivePanelComponent = activePanel ? activePanel.component : null;
        if (ActivePanelComponent === null) {
            return null;
        }
        if (activePanel.keepAlive) {
            return (
                // @ts-ignore
                <KeepAlive name={activePanel.title}>
                    <ActivePanelComponent />
                </KeepAlive>
            );
        }
        return <ActivePanelComponent />;
    };

    return (
        <ThemeModeProvider>
            <div className="iproxy-app-container">
                <Provider>
                    {SYSTEM_IS_MACOS ? (
                        <Titlebar
                            text="iProxy"
                            onClose={() => currentWindow.close()}
                            onMaximize={() => currentWindow.maximize()}
                            onFullscreen={() => currentWindow.fullScreen()}
                            onMinimize={() => currentWindow.minimize()}
                            padding={5}
                            transparent={true}
                            draggable={true}
                        />
                    ) : null}

                    <div className="iproxy-panel-dock no-drag">
                        {panels.map((panel: AppPanel, index: number) => {
                            const className = classnames({
                                'iproxy-dock-item': true,
                                selected: panel.title === activePanel.title,
                            });

                            return (
                                <div className={className} key={panel.title} onClick={() => handleClickPanel(index)}>
                                    <LegacyIcon style={{ fontSize: '22px' }} type={panel.icon}></LegacyIcon>
                                    <span className="iproxy-dock-title">{t(panel.title)}</span>
                                </div>
                            );
                        })}
                    </div>
                    <div className="iproxy-panel-container drag">{renderActivePanel()}</div>
                    <StatusBar rightItems={rightStatusItems} />
                </Provider>
            </div>
        </ThemeModeProvider>
    );
};
