import LineChart from '../components/examples/LineChart.vue';

export default {
  title: 'Example/LineChart',
  component: LineChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { LineChart },
  template:
    `<line-chart
      :data="data"
      :minHeight="minHeight"
      :locale="locale"
      :colorSet="colorSet"
      :colorSeed="colorSeed"
      :seriesLabels="seriesLabels"
      :chartLayout="chartLayout"
      :legend="legend"
      :legendLayout="legendLayout"
      :legendPosition="legendPosition"
      :legendX="legendX"
      :legendCenterX="legendCenterX"
      :legendY="legendY"
      :legendCenterY="legendCenterY"
      :cursor="cursor"
      :cursorBehavior="cursorBehavior"
      :cursorXVisible="cursorXVisible"
      :cursorYVisible="cursorYVisible"
      :scrollbar="scrollbar"
      :scrollbarHeight="scrollbarHeight"
      :scrollbarStartGripVisible="scrollbarStartGripVisible"
      :scrollbarEndGripVisible="scrollbarEndGripVisible"
      :xAxisOpposite="xAxisOpposite"
      :xAxisShowTooltip="xAxisShowTooltip"
      :xAxisTooltipDateFormat="xAxisTooltipDateFormat"
      :xAxisRanges="xAxisRanges"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :yAxisRanges="yAxisRanges"
      :yAxisUnit="yAxisUnit"
      :serieShowBullets="serieShowBullets"
      :serieBulletsRadius="serieBulletsRadius"
      :heatRule="heatRule"
      :minColor="minColor"
      :maxColor="maxColor"
      :heatRanges="heatRanges"
    />`,
});

const makeLineSerie = (name, tZero, vZero, elapsedTime, rangeValue, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    data.push({
      timestampX: tZero,
      valueY: vZero
    });

    let plusOrMinus = Math.random() < 0.5 ? -1 : 1;

    tZero += elapsedTime;
    vZero += (Math.random() * rangeValue * plusOrMinus);
  }

  return {
    serie: name,
    data: data
  };
}

export const Default = Template.bind({});
Default.args = {
  data: {
    series: [
      {
        label: "Level 1",
        data: [
          {
            valueY: 163.6,
            timestampX: 1671680092000,
            subs: []
          },
          {
            valueY: 165.7,
            timestampX: 1671680211000,
            subs: []
          },
          {
            valueY: 166.7,
            timestampX: 1671680332000,
            subs: []
          },
          {
            valueY: 167.5,
            timestampX: 1671680452000,
            subs: []
          },
          {
            valueY: 171,
            timestampX: 1671680572000,
            subs: []
          },
          {
            valueY: 182.2,
            timestampX: 1671680693000,
            subs: []
          },
          {
            valueY: 189.2,
            timestampX: 1671680812000,
            subs: []
          },
          {
            valueY: 191.8,
            timestampX: 1671680932000,
            subs: []
          },
          {
            valueY: 193.1,
            timestampX: 1671681052000,
            subs: []
          },
          {
            valueY: 193.6,
            timestampX: 1671681172000,
            subs: []
          },
          {
            valueY: 199.7,
            timestampX: 1671681292000,
            subs: []
          },
          {
            valueY: 208.8,
            timestampX: 1671681411000,
            subs: []
          },
          {
            valueY: 212.2,
            timestampX: 1671681532000,
            subs: []
          },
          {
            valueY: 212.8,
            timestampX: 1671681652000,
            subs: []
          },
          {
            valueY: 212.5,
            timestampX: 1671681772000,
            subs: []
          }
        ],
        subOperands: []
      },
      {
        label: "Level 4",
        data: [
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671680092000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671680212000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671680333000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671680452000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671680573000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671680692000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671680812000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671680933000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671681052000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671681172000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671681293000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671681412000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671681533000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671681653000,
            subs: []
          },
          {
            valueY: Math.ceil(Math.random() * 50),
            timestampX: 1671681772000,
            subs: []
          }
        ],
        subOperands: []
      },
      {
        label: "Level 6",
        data: [
          {
            valueY: 0,
            timestampX: 1671680092000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671680212000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671680333000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671680452000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671680573000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671680692000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671680812000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671680933000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671681052000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671681172000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671681293000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671681412000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671681533000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671681653000,
            subs: []
          },
          {
            valueY: 0,
            timestampX: 1671681772000,
            subs: []
          }
        ],
        subOperands: []
      }
    ]
  },
  minHeight: '400px',
  locale: "fr-FR",
  colorSet: 5,
  colorSeed: "tango",
  seriesLabels: ["Level 1", "Level 4", "Level 6"],
  chartLayout: 2,
  legend: true,
  legendLayout: 0,
  legendPosition: 1,
  legendX: 50,
  legendCenterX: 50,
  legendY: 50,
  legendCenterY: 50,
  cursor: true,
  cursorBehavior: "zoomX",
  cursorXVisible: true,
  cursorYVisible: true,
  scrollbar: true,
  scrollbarHeight: 2,
  scrollbarStartGripVisible: true,
  scrollbarEndGripVisible: true,
  xAxisOpposite: false,
  xAxisShowTooltip: true,
  xAxisTooltipDateFormat: "yyyy-MM-dd HH:mm:ss",
  xAxisRanges: [],
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisRanges: [],
  yAxisUnit: "mL",
  serieShowBullets: false,
  serieBulletsRadius: 5,
  heatRule: 0,
  minColor: "#FF0000",
  maxColor: "#00FF00",
  heatRanges: []
};