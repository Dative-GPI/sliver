import DExportData from '../components/plugins/DExportData.vue';

export default {
  title: 'Example/ExportData',
  component: DExportData,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DExportData },
  template:
    `<d-export-data
        :chartId="chartId"
        :tableData="tableDataSolo"
    >
        <template v-slot="{ getCsv, canPng, getPng }">
            <div @click="getCsv"> CSV </div>
        </template>
    </d-export-data>`,
});

export const Default = Template.bind({});
Default.args = {
    chartId: "dcf38f4a-3085-4810-a3c6-a5dd582c89e8",
    chartData: {
        chartType: 6,
        xAxisType: 0,
        startDate: 1685977213872,
        endDate: 1686063613872,
        plots: [
            {
                yAxisType: 2,
                series: [
                    {
                        serieType: 15,
                        operands: [
                            {
                                label: "Level Premier - Temps de cuisson en minutes",
                                unit: "",
                                data: [
                                    { valueY: 1.4556289999999998, timestampX: 1686028991000, closeTimestampX: 1686040789000, subs: [] }
                                ],
                                subOperands: []
                            },
                            {
                                label: "Level Deuxieme - Temps de cuisson en minutes",
                                unit: "",
                                data: [
                                    { valueY: 1.2015280000000002, timestampX: 1686028808000, closeTimestampX: 1686030210000, subs: [] }
                                ],
                                subOperands: []
                            }
                        ]
                    }
                ]
            }
        ]
    },
    tableData: {
        aggregates:true,
        headers:[
            { label: "Recipe", dataTable: 2 },
            { label: "Theoric (Sum)", dataTable: 1 },
            { label: "Real (Sum)", dataTable: 1 }
        ],
        rows:[
            { entity: "Orion oven EVO 801/4-099243", values: ["Manual","0","280.9780300000001"] },
            { entity: "Orion oven EVO 801/4-099243", values: ["Pizza alla pala","12","9.82872"] },
            { entity: "Orion oven EVO 801/4-099243", values: ["Ciabatta","100","106.58339999999998"] },
            { entity: "Orion oven EVO 801/4-099243", values: ["Cornetto","22","22.7275"] },
            { entity: "Orion oven EVO 801/4-099243", values: ["Pane lievito naturale","60","46.577529999999996"] },
            { entity: "Orion oven EVO 801/4-099243", values: ["Pane olio","18","22.0395"] }
        ]
    },
    tableDataMulti: {
        aggregates: false,
        headers: [
            { label: "Recipe", dataTable: 2 },
            { label: "Theoric", dataTable: 1 },
            { label: "Real", dataTable: 1 }
        ],
        rows: [
            {
                timestamp: 1686119092000,
                entity: "Orion oven EVO 801/4-099243",
                values: ["Ciabatta", "20", "20.6992"]
            },
            {
                timestamp: 1686118959000,
                entity: "Orion oven EVO 801/4-105043",
                values: ["Manual", "0", "5.96622"]
            },
            {
                timestamp: 1686118954000,
                entity: "Orion oven EVO 801/4-099243",
                values: ["Manual", "0", "3.52405"]
            },
            {
                timestamp: 1686118952000,
                entity: "Orion oven EVO 801/4-099243",
                values: ["Manual", "0", "11.7821"]
            }
        ]
    },
    tableDataSolo: {
        aggregates: false,
        headers: [
            { label: "Recipe", dataTable: 2 },
            { label: "Theoric", dataTable: 1 },
            { label: "Real", dataTable: 1 }
        ],
        rows: [
            {
                timestamp: 1686119092000,
                entity: "Orion oven EVO 801/4-099243",
                values: ["Ciabatta", "20", "20.6992"]
            },
            {
                timestamp: 1686118954000,
                entity: "Orion oven EVO 801/4-099243",
                values: ["Manual", "0", "3.52405"]
            },
            {
                timestamp: 1686118952000,
                entity: "Orion oven EVO 801/4-099243",
                values: ["Manual", "0", "11.7821"]
            },
            {
                timestamp: 1686118713000,
                entity: "Orion oven EVO 801/4-099243",
                values: ["Ciabatta", "20", "24.5931"]
            }
        ]
    }
};