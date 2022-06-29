import MixedChart from '../components/examples/MixedChart.vue';

export default {
  title: 'Example/MixedChart',
  component: MixedChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { MixedChart },
  template:
    `<mixed-chart
      :data="data"
      :dataBis="dataBis"
      :dataTiers="dataTiers"
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
      :xAxisTooltipDateFormat="xAxisTooltipDateFormat"
      :yAxisOpposite="yAxisOpposite"
      :yAxisShowTooltip="yAxisShowTooltip"
      :yAxisTooltipNumberFormat="yAxisTooltipNumberFormat"
      :yAxisBisOpposite="yAxisBisOpposite"
      :yAxisBisShowTooltip="yAxisBisShowTooltip"
      :yAxisBisCellStartLocation="yAxisBisCellStartLocation"
      :yAxisBisCellEndLocation="yAxisBisCellEndLocation"
      :lineSeriesBullet="lineSeriesBullet"
      :lineSeriesBulletRadius="lineSeriesBulletRadius"
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
    vZero += (Math.floor(Math.random() * rangeValue) * plusOrMinus)
  }

  return {
    serie: name,
    data: data
  };
}

const makePlanningSerie = (name, tZero, elapsedTime, categories, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    let categoryRandom = categories[Math.floor(Math.random() * categories.length)];

    if (i > 0 && categoryRandom == data[data.length - 1].categoryY) {
      data[data.length - 1].closeTimestampX += elapsedTime;
    }
    else {
      data.push({
        timestampX: tZero,
        closeTimestampX: tZero + elapsedTime,
        categoryY: categoryRandom
      });
    }

    tZero  = tZero + elapsedTime;
  }

  return {
    serie: name,
    data: data
  };
}

const makeEventSerie = (name, tZero, elapsedTime, categories, values) => {
  var data = [];
  for (let i = 0; i < values; i++) {
    let categoryRandom = categories[Math.floor(Math.random() * categories.length)];

    if (i === 0) {
      data.push({
        timestampX: tZero,
        closeTimestampX: tZero,
        categoryY: categoryRandom
      });
    }
    else if (categoryRandom != data[data.length - 1].categoryY) {
      data.push({
        timestampX: tZero,
        closeTimestampX: tZero,
        categoryY: categoryRandom
      });
    }

    tZero  = tZero + elapsedTime;
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
      { ...makeLineSerie("Température voûte", 1640815320000, 50, 120000, 5, 50 ) },
      { ...makeLineSerie("Température plancher", 1640815320000, 50, 120000, 5, 50 ) }
    ]
  },
  dataBis: {
    series: [
      { ...makePlanningSerie("Etat", 1640815320000, 600000, ["Production", "Idle", "Cooling", "Warming"], 10 ) }
    ]
  },
  dataTiers: {
    series: [
      { ...makeEventSerie("Alertes", 1640815320000, 240000, ["Warning", "Error", "Information"], 25 ) }
    ]
  },
  minHeight: '400px',
  locale: "fr-FR",
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
  cursorYVisible: false,
  scrollbar: true,
  scrollbarHeight: 5,
  scrollbarStartGripVisible: true,
  scrollbarEndGripVisible: true,
  xAxisOpposite: false,
  xAxisShowTooltip: true,
  xAxisTooltipDateFormat: "yyyy-MM-dd HH:mm:ss",
  yAxisOpposite: false,
  yAxisShowTooltip: true,
  yAxisTooltipNumberFormat: "#",
  yAxisBisOpposite: true,
  yAxisBisShowTooltip: true,
  yAxisBisCellStartLocation: 0.5,
  yAxisBisCellEndLocation: 0.5,
  lineSeriesBullet: false,
  lineSeriesBulletRadius: 3
};