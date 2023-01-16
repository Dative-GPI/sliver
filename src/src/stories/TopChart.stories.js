import TopChart from '../components/examples/TopChart.vue';

export default {
  title: 'Example/TopChart',
  component: TopChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { TopChart },
  template:
    `<top-chart
      :data="data"
      :minHeight="minHeight"
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
      :xAxisTooltipNumberFormat="xAxisTooltipNumberFormat"
      :xAxisRanges="xAxisRanges"
      :xAxisUnit="xAxisUnit"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipText="yAxisTooltipText"
      :yAxisCellStartLocation="yAxisCellStartLocation"
      :yAxisCellEndLocation="yAxisCellEndLocation"
      :yAxisLabelsOversizedBehavior="yAxisLabelsOversizedBehavior"
      :yAxisLabelsMaxWidth="yAxisLabelsMaxWidth"
      :serieShowTooltip="serieShowTooltip"
      :serieTooltipText="serieTooltipText"
    />`,
});

const makeColumnSerie = (name, categories, rangeValue) => {
  var data = [];
  for (let i = 0; i < categories.length; i++) {
    let value = Math.floor(Math.random() * rangeValue) + 1;
    data.push({
      categoryY: categories[i],
      categoryCodeY: categories[i],
      valueX: 0,
      closeValueX: value,
      selfValueX: value
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
      { ...makeColumnSerie("Line 1", ["Donald Duck", "Riri Duck", "Fifi Duck", "Loulou Duck", "Balthazar Picsou", "Della Duck", "Gontran Bonheur", "Daisy Duck", "Archibald Gripsou", "Geo Trouvetou", "Rapetou", "Fantomiald", "Miss Tick", "Miss Frappe", "Matilda Picsou", "Hortense Picsou", "Gustave Bonheur", "Daphnée Duck"], 100 ) }
    ]
  },
  minHeight: '400px',
  locale: "fr-FR",
  colorSet: 5,
  colorSeed: "tango delta",
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
  xAxisRanges: [
    { startValue: 0,   endValue: 40,  opacity: 0.5, color: "#ff3c3c", label: "Bad" },
    { startValue: 40,  endValue: 80,  opacity: 0.5, color: "#ff8c3c", label: "Somewhat bad" },
    { startValue: 80,  endValue: 120, opacity: 0.5, color: "#b4b4b4", label: "Just meh" },
    { startValue: 120, endValue: 160, opacity: 0.5, color: "#aaff64", label: "Somewhat good" },
    { startValue: 160, endValue: 200, opacity: 0.5, color: "#64ff8c", label: "Good" }
  ],
  xAxisUnit: "cm",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipText: "{categoryY}",
  yAxisCellStartLocation: 0.5,
  yAxisCellEndLocation: 0.5,
  yAxisLabelsOversizedBehavior: "truncate",
  yAxisLabelsMaxWidth: 100,
  serieShowTooltip: true,
  serieTooltipText: "{dataItem.dataContext.categoryY}: {dataItem.dataContext.selfValueX}"
};