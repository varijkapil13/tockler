import { Box, Flex } from 'reflexbox';
import { Button, Divider, Form, Input, Switch } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import React, { useState } from 'react';
import { useFormState } from 'react-use-form-state';
import { testAnalyserItem } from './AnalyserForm.util';

const AnalyserTestItem = ({ item }) => (
    <Box>
        <Box>
            <b>{item.title}</b>
        </Box>
        <Flex>
            <span>{item.findRe}</span> <i>|</i>
            <span>{item.takeGroup}</span> <i>|</i>
            <span>{item.takeTitle}</span>
        </Flex>
    </Box>
);

export const AnalyserFormItem = ({ analyserItem, removeItem, appItems, saveItem }) => {
    const [showTests, setShowTests] = useState(false);
    const toggleShowTests = () => {
        setShowTests(!showTests);
    };

    const [, { text, raw }] = useFormState(analyserItem, {
        onChange: (__ignore, ___ignore, nextStateValues) => {
            saveItem(nextStateValues);
        },
    });

    const check = raw('enabled');

    return (
        <div>
            <Flex justifyContent="space-between">
                <Flex>
                    <Box p={1}>
                        <Input placeholder="Task" {...text({ name: 'findRe' })} />
                    </Box>
                    <Box p={1}>
                        <Input placeholder="Group" {...text({ name: 'takeGroup' })} />
                    </Box>
                    <Box p={1}>
                        <Input placeholder="Title" {...text({ name: 'takeTitle' })} />
                    </Box>
                </Flex>
                <Form.Item name="active" label="Active">
                    <Switch
                        onChange={value => {
                            check.onChange(value);
                        }}
                        checked={check.value}
                    />
                </Form.Item>

                <Form.Item name="test" label="Test">
                    <Switch onChange={toggleShowTests} />
                </Form.Item>
                <Button
                    type="primary"
                    shape="circle"
                    icon={<DeleteOutlined />}
                    onClick={removeItem}
                />
            </Flex>

            {showTests && (
                <Box>
                    <Divider />

                    {testAnalyserItem(appItems, analyserItem).map((item: any) => (
                        <AnalyserTestItem item={item} key={item.title} />
                    ))}
                </Box>
            )}
        </div>
    );
};
