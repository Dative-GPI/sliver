import BarsChart from '../components/examples/BarsChart.vue';

export default {
  title: 'Example/BarsChart',
  component: BarsChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { BarsChart },
  template:
    `<bars-chart
      :data="data"
      :height="height"
      :locale="locale"
      :colorSet="colorSet"
      :colorSeed="colorSeed"
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
      :xAxisLabelsOversizedBehavior="xAxisLabelsOversizedBehavior"
      :xAxisLabelsMaxWidth="xAxisLabelsMaxWidth"
      :xAxisLabelsTooltipText="xAxisLabelsTooltipText"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :yAxisRanges="yAxisRanges"
      :yAxisUnit="yAxisUnit"
    />`,
});

const makeColumnSerie = (name, categories, rangeValue, minValue) => {
  var data = [];
  for (let i = 0; i < categories.length; i++) {
    data.push({
      categoryX: categories[i],
      categoryCodeX: categories[i],
      valueY: minValue + Math.floor(Math.random() * rangeValue)
    });
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
      { ...makeColumnSerie("Line 1", ["Grapefruit", "Coconut", "Passion fruit", "Banana"], 250000, 0 ) },
      { ...makeColumnSerie("Line 2", ["Grapefruit", "Apple", "Peach", "Pear"], 350000, 50000 ) },
      { ...makeColumnSerie("Line 3", ["Grapefruit", "Pomelo", "Lime", "Lemon"], 350000, 0 ) }
    ]
  },
  height: '100vh',
  locale: "fr-FR",
  colorSet: 5,
  colorSeed: "foxtrot",
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
  xAxisLabelsOversizedBehavior: "truncate",
  xAxisLabelsMaxWidth: 100,
  xAxisLabelsTooltipText: "{categoryX}",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#,###.###### a",
  yAxisRanges: [
    { startValue: 50000, endValue: 51000, opacity: 0.5, color: "#0000FF", label: "Target" }
  ],
  yAxisUnit: "",
};