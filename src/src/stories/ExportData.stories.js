import DExportData from '../components/plugins/DExportData.vue';

export default {
  title: 'Example/ExportData',
  component: DExportData,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { DExportData },
  template:
    `<div class="d-flex align-center" style="gap: 8px;">
        <d-export-data
            style="padding: 8px; border-radius: 4px; border: 2px solid #CCC; cursor: pointer;"
            :locale="locale"
            :chartId="chartId"
            :chartData="chartData"
        >
            <template v-slot="{ getCsv, canPng, getPng }">
                <div @click="getCsv"> Chart data </div>
            </template>
        </d-export-data>
        <d-export-data
            style="padding: 8px; border-radius: 4px; border: 2px solid #CCC; cursor: pointer;"
            :locale="locale"
            :chartId="chartId"
            :tableData="tableData"
        >
            <template v-slot="{ getCsv, canPng, getPng }">
                <div @click="getCsv"> Table data with aggregates and one entity </div>
            </template>
        </d-export-data>
        <d-export-data
            style="padding: 8px; border-radius: 4px; border: 2px solid #CCC; cursor: pointer;"
            :locale="locale"
            :chartId="chartId"
            :tableData="tableDataSolo"
        >
            <template v-slot="{ getCsv, canPng, getPng }">
                <div @click="getCsv"> Table data without aggregates and one entity </div>
            </template>
        </d-export-data>
        <d-export-data
            style="padding: 8px; border-radius: 4px; border: 2px solid #CCC; cursor: pointer;"
            :locale="locale"
            :chartId="chartId"
            :tableData="tableDataMulti"
        >
            <template v-slot="{ getCsv, canPng, getPng }">
                <div @click="getCsv"> Table data without aggregates and several entities </div>
            </template>
        </d-export-data>
    </div>`,
});

export const Default = Template.bind({});
Default.args = {
    locale: "fr-FR",
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
                                label: "Niveau 1 - Temps de cuisson en minutes",
                                unit: "",
                                data: [
                                    { valueY: 1.45563, timestampX: 1686028991000, closeTimestampX: 1686040789000, subs: [] }
                                ],
                                subOperands: []
                            },
                            {
                                label: "Niveau 2 - Temps de cuisson en minutes",
                                unit: "",
                                data: [
                                    { valueY: 1.20150, timestampX: 1686028808000, closeTimestampX: 1686030210000, subs: [] }
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
            { label: "Recette", dataTable: 2 },
            { label: "Théorique (Sum)", dataTable: 1 },
            { label: "Réel (Sum)", dataTable: 1 }
        ],
        rows:[
            { entity: "Orion oven EVO 801/4-099243", values: ["Manual","0","1280.98"] },
            { entity: "Orion oven EVO 801/4-099243", values: ["Pizza alla pala","12","9.82872"] },
            { entity: "Orion oven EVO 801/4-099243", values: ["Ciabatta","100","106.59"] },
            { entity: "Orion oven EVO 801/4-099243", values: ["Cornetto","22","22.7275"] },
            { entity: "Orion oven EVO 801/4-099243", values: ["Pane lievito naturale","60","46.58"] },
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
                values: ["Ciabatta", "20000", "10520.6992"]
            },
            {
                timestamp: 1686118954000,
                entity: "Orion oven EVO 801/4-099243",
                values: ["Manual", "100", "5893.52405"]
            },
            {
                timestamp: 1686118952000,
                entity: "Orion oven EVO 801/4-099243",
                values: ["Manual", "1000", "1111.7821"]
            },
            {
                timestamp: 1686118713000,
                entity: "Orion oven EVO 801/4-099243",
                values: ["Ciabatta", "20", "1024.5931"]
            }
        ]
    }
};