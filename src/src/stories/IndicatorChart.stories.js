import IndicatorChart from '../components/examples/IndicatorChart.vue';

export default {
  title: 'Example/IndicatorChart',
  component: IndicatorChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { IndicatorChart },
  template:
    `<indicator-chart
      :data="data"
      :minHeight="minHeight"
      :locale="locale"
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
      :xAxisTooltipNumberFormat="xAxisTooltipNumberFormat"
      :xAxisMin="xAxisMin"
      :xAxisMax="xAxisMax"
      :xAxisRanges="xAxisRanges"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :yAxisMin="yAxisMin"
      :yAxisMax="yAxisMax"
      :yAxisRanges="yAxisRanges"
    />`,
});

export const Default = Template.bind({});
Default.args = {
  data: {
    series: [{
      serie: "A",
      data: [{
        valueX: 0
      }]
    },{
      serie: "B",
      data: [{
        valueX: 5
      }]
    },{
      serie: "C",
      data: [{
        valueX: 10
      }]
    },
    {
      serie: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore",
      data: [{
        valueX: 20
      }]
    }]
  },
  minHeight: '300px',
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
  scrollbarHeight: 5,
  scrollbarStartGripVisible: true,
  scrollbarEndGripVisible: true,
  xAxisOpposite: false,
  xAxisShowTooltip: true,
  xAxisTooltipNumberFormat: "#,###.###### a",
  xAxisMin: 0,
  xAxisMax: 200,
  xAxisRanges: [
    { startValue: 0,   endValue: 40,  opacity: 0.5, color: "#ff3c3c", label: "Bad" },
    { startValue: 40,  endValue: 80,  opacity: 0.5, color: "#ff8c3c", label: "Somewhat bad" },
    { startValue: 80,  endValue: 120, opacity: 0.5, color: "#b4b4b4", label: "Just meh" },
    { startValue: 120, endValue: 160, opacity: 0.5, color: "#aaff64", label: "Somewhat good" },
    { startValue: 160, endValue: 200, opacity: 0.5, color: "#64ff8c", label: "Good" }
  ],
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisMin: 0,
  yAxisMax: 10,
  yAxisRanges: [
    { startValue: 0,   endValue: 10,  opacity: 1, color: "#ffffff", label: "Bad" },
  ]
};