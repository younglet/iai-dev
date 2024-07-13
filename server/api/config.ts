export default defineEventHandler(async (event) => {
    return {
        id: 'e6693b4011c2410998d0e3b5b21c3ce0',
        title: '项目',
        groups: [
            {
                name: '节点组1',
                number: 5,
                config: {
                    label: '节点1',
                    input: [
                        {
                            name: 'distance',
                            lable: '距离',
                            type: 'number',
                            restraint: null
                        }
                    ],
                    output: [
                        {
                            name: 'output1',
                            label: '输出1',
                            type: 'number',
                            restraint: {
                                min: 0,
                                max: 100
                            }
                        }
                    ]
                }
            }
        ]
    }
})