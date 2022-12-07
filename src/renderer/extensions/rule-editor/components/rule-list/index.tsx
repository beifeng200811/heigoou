import React, { useMemo, useState, useEffect, useRef, useCallback } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import classnames from 'classnames';
import { Editor } from '../editor';
import { FormOutlined } from '@ant-design/icons';
import { Button, Popover, message, Input } from 'antd';
import { useTranslation } from 'react-i18next';
import { uuidv4 } from '../../../../utils';

import { throttle } from 'lodash';

import * as remote from '@electron/remote';
import * as monaco from 'monaco-editor';
import { CoreAPI } from '../../../../core-api';

const { Menu, MenuItem } = remote;

export interface Rule {
    name: string;
    uuid: string;
    content: string;
    enabled: boolean;
    rename?: boolean;
}

function reorder<T>(list: T[], startIndex: number, endIndex: number) {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
}

function withNewlineAsEnd(str: string) {
    if (!/\n$/.test(str)) {
        return str + '\n';
    }
    return str;
}

interface Props {
    readRules: () => Rule[];
    saveRules: (rules: Rule[]) => void;
}

// save tab status here
const editorStatus = {} as {
    [index: number]:
        | {
              model: any;
              viewState: any;
          }
        | undefined;
};

let initalEditorViewState = null as any;

export const RuleList = (props: Props) => {
    const { readRules, saveRules } = props;

    const { t } = useTranslation();

    const defaultRuleList = [
        {
            name: 'Default',
            enabled: true,
            uuid: 'Default',
            content: `# 黑狗去水印视频下载使用说明
# ☝🏻☝🏻☝🏻第一次使用请先按照下面说明配置证书，复制地址使用默认浏览器打开👇🏻👇🏻👇🏻
# https://mp.weixin.qq.com/s/201IbXiEsSbdgyXSR8UzcQ
# 如果上面链接打开异常，请关闭「黑狗」软件，打开说明后，重新打开「黑狗」🐶🐶🐶

# 如果你的浏览器没有自动打开黑狗首页，请复制下面链接手动操作
# http://127.0.0.1:12888/plugin.sph-download/

# 升级日志20221207
# 支持视频号直播直接录制
# 支持抖音达人监控直播间自动录制
# 支持抖音达人直播间手动录制

# 升级日志20221130
# 添加抖音搜索功能支持
# 抖音标签分析
# 优化首屏显示

# 升级日志20220910
# 下载路径去除达人名称，默认下载到配置路径下
# 下载文件检测，解决重名文件覆盖下载的问题
# 修复其他已知问题

# 感谢支持~

`,
        },
    ];

    const [ruleList, setRuleList] = useState(() => readRules() || defaultRuleList);

    const saveWithLimit = useCallback(
        throttle((rules: Rule[]) => {
            saveRules(rules);
        }, 1000),
        [],
    );

    const ruleListRef = useRef(ruleList);
    ruleListRef.current = ruleList;

    useEffect(() => {
        const enterHandler = () => {
            saveWithLimit(
                ruleListRef.current
                    .filter(item => item.uuid !== '[internal-debugger-on]')
                    .concat([
                        {
                            uuid: '[internal-debugger-on]',
                            content: `/iproxy=true/ whistle.chii-internal://[iproxy-debug]`,
                            enabled: true,
                            name: '[internal-debugger-on]',
                        },
                    ]),
            );
        };

        const exitHandler = () => {
            saveRules(ruleListRef.current.filter((item) => item.uuid !== '[internal-debugger-on]'));
        };
        CoreAPI.eventEmmitter.on('weinre-enter', enterHandler);
        CoreAPI.eventEmmitter.on('weinre-exit', exitHandler);

        return function() {
            CoreAPI.eventEmmitter.off('weiren-enter', enterHandler);
            CoreAPI.eventEmmitter.off('weiren-exit', exitHandler);
        };
    }, []);

    const [selected, setSelected] = useState(0);

    const [renameText, setRenameText] = useState('');

    const editorRef = useRef(null as null | monaco.editor.IStandaloneCodeEditor);

    const rule = ruleList[selected];

    const switchRule = (index: number, isRemove = false) => {
        const editor = editorRef.current;
        if (editor) {
            try {
                if (isRemove) {
                    editorStatus[selected] = undefined;
                } else {
                    editorStatus[selected] = {
                        model: editor.getModel(),
                        viewState: editor.saveViewState(),
                    };
                }
            } catch (e) {}

            if (!editorStatus[index]) {
                editorStatus[index] = {
                    model: monaco.editor.createModel(ruleList[index].content, 'rule'),
                    viewState: initalEditorViewState,
                };
            }

            try {
                editor.setModel(editorStatus[index]?.model);
            } catch (e) {
                // Model is disposed
                editorStatus[index] = {
                    model: monaco.editor.createModel(ruleList[index].content, 'rule'),
                    viewState: initalEditorViewState,
                };
                editor.setModel(editorStatus[index]?.model);
            }
            editor.restoreViewState(editorStatus[index]?.viewState);
        }

        setSelected(index);
        editorRef.current?.setScrollPosition({ scrollTop: 0 });
        editorRef.current?.setPosition({ column: 1, lineNumber: 1 });
        requestAnimationFrame(() => {
            editorRef.current?.setPosition({
                column: 1,
                lineNumber: editorRef.current?.getModel()?.getLineCount() || 0,
            });
        });
    };

    const onDragEnd = useMemo(() => {
        return (result: DropResult) => {
            if (!result.destination) {
                return;
            }

            const currentSelectUUID = ruleList[selected].uuid;

            const items = reorder(ruleList, result.source.index, result.destination.index);

            setRuleList(items);

            switchRule(items.findIndex(item => item.uuid === currentSelectUUID));
        };
    }, [selected, ruleList]);

    useEffect(() => {
        if (ruleList.length === 0) {
            // put default
            setRuleList(defaultRuleList);

            switchRule(0);
        }

        saveWithLimit(ruleList);
    }, [ruleList]);

    const toggleRuleEnabled = useCallback(
        (index: number) => {
            const newRules = ruleList.map((_item, _index) => {
                if (_index === index) {
                    return {
                        ..._item,
                        enabled: !_item.enabled,
                    };
                } else {
                    return _item;
                }
            });
            setRuleList(newRules);

            requestAnimationFrame(() => {
                saveRules(newRules);
                message.success(t('Switched'));
            });
        },
        [ruleList],
    );

    const toggleRuleEnabledRef = useRef(toggleRuleEnabled);
    toggleRuleEnabledRef.current = toggleRuleEnabled;

    useEffect(() => {
        if (!initalEditorViewState && editorRef.current) {
            initalEditorViewState = editorRef.current.saveViewState();
        }

        const handler = (index: number) => {
            toggleRuleEnabledRef.current(index);
        };
        CoreAPI.eventEmmitter.on('iproxy-toggle-rule', handler);

        return () => {
            CoreAPI.eventEmmitter.off('iproxy-toggle-rule', handler);
        };
    }, []);

    const handleEditorOnChange = (val: string) => {
        const newRuleList = ruleList.map((item, index) => {
            if (index === selected) {
                return {
                    ...item,
                    content: withNewlineAsEnd(val),
                };
            } else {
                return {
                    ...item,
                    content: withNewlineAsEnd(item.content),
                };
            }
        });
        setRuleList(newRuleList);
    };

    const handleOnSave = () => {
        saveRules(ruleList);
        message.destroy();
        if (new Date().getHours() >= 21) {
            message.success(t('Saved, good night'));
        } else {
            message.success(t('Saved'));
        }
    };

    const onEditorMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
        editorRef.current = editor;
    };

    const handleAddRule = () => {
        const newList = ruleList.concat({
            name: 'New Rule',
            enabled: true,
            uuid: uuidv4(),
            rename: true,
            content: `# New Rules
`,
        });

        setRuleList(newList);

        switchRule(newList.length - 1);

        saveWithLimit(newList);
    };

    return (
        <div style={{ height: '100%' }}>
            <div className="iproxy-rule-actionbar drag">
                <Popover content={t('New Rule')} trigger="hover">
                    <Button onClick={handleAddRule} className="no-drag iproxy-add-rule-btn">
                        <FormOutlined />
                    </Button>
                </Popover>
            </div>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable">
                    {provided => (
                        <div
                            className="iproxy-rule-list no-drag"
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                        >
                            {ruleList.map((item, index) => {
                                const className = classnames({
                                    'iproxy-rule-list-item': true,
                                    selected: index === selected,
                                    enabled: !item.rename && item.enabled,
                                });
                                return (
                                    <Draggable key={item.uuid} draggableId={item.uuid} index={index}>
                                        {provided => {
                                            const handleClick = () => {
                                                switchRule(index);
                                            };

                                            const handleDoubleClick = (rename: boolean | undefined) => {
                                                if (rename) return;

                                                toggleRuleEnabledRef.current(index);
                                            };

                                            const handleContextMenu = () => {
                                                const menu = new Menu();
                                                menu.append(
                                                    new MenuItem({
                                                        label: t('rename'),
                                                        click: () => {
                                                            setRuleList(
                                                                ruleList.map((_item, _index) => {
                                                                    if (_index === index) {
                                                                        return {
                                                                            ..._item,
                                                                            rename: true,
                                                                        };
                                                                    } else {
                                                                        return _item;
                                                                    }
                                                                }),
                                                            );
                                                            setRenameText(ruleList[index].name);
                                                            switchRule(index);
                                                        },
                                                    }),
                                                );

                                                menu.append(
                                                    new MenuItem({
                                                        label: t('remove'),
                                                        click: () => {
                                                            const newRules = ruleList.filter(
                                                                _item => _item.uuid !== item.uuid,
                                                            );
                                                            setRuleList(newRules);
                                                            switchRule(0, true);
                                                        },
                                                    }),
                                                );
                                                menu.popup();
                                            };

                                            const renameComplete = () => {
                                                setRuleList(
                                                    ruleList.map((_item, _index) => {
                                                        if (index === _index) {
                                                            return {
                                                                ..._item,
                                                                name: renameText || 'New Rule',
                                                                rename: false,
                                                            };
                                                        } else {
                                                            return _item;
                                                        }
                                                    }),
                                                );
                                                setSelected(index);
                                            };

                                            return (
                                                <div
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    className={className}
                                                    onClick={handleClick}
                                                    onContextMenu={handleContextMenu}
                                                    onDoubleClick={() => handleDoubleClick(item.rename)}
                                                >
                                                    {item.rename ? (
                                                        <Input
                                                            onBlur={renameComplete}
                                                            onPressEnter={renameComplete}
                                                            value={renameText}
                                                            onChange={e => setRenameText(e.target.value)}
                                                            autoFocus
                                                            onFocus={e => {
                                                                e.persist();
                                                                setTimeout(() => e.target.select());
                                                            }}
                                                        ></Input>
                                                    ) : (
                                                        <span>{item.name}</span>
                                                    )}
                                                </div>
                                            );
                                        }}
                                    </Draggable>
                                );
                            })}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>
            {rule ? (
                <Editor
                    // @ts-ignore
                    onMount={onEditorMount}
                    onSave={handleOnSave}
                    onChange={handleEditorOnChange}
                    content={(rule && rule.content) || ''}
                    enabled={rule && rule.enabled}
                />
            ) : null}
        </div>
    );
};
