import PieChart from '../components/examples/PieChart.vue';

export default {
  title: 'Example/PieChart',
  component: PieChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PieChart },
  template:
    `<pie-chart
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
      :otherLabel="otherLabel"
      :otherThreshold="otherThreshold"
    />`,
});

const makePieSerie = (name, categories, rangeValue) => {
  var data = [];
  for (let i = 0; i < categories.length; i++) {
    let subs = makePieSubs(categories[i], ["A", "B"], 5);
    data.push({
      categoryX: categories[i],
      valueY: subs.reduce((acc, cur) => acc + cur.valueY, 0),
      subs: subs
    });
  }

  return {
    serie: name,
    data: data
  };
}

const makePieSubs = (main, categories, rangeValue) => {
  return categories.map(c => {
    let subs = makePieSubSubs(main + " : " + c, ["1", "2"], rangeValue);
    return {
      categoryX: main + " : " + c,
      valueY: subs.reduce((acc, cur) => acc + cur.valueY, 0),
      subs: subs
    }
  });
}

const makePieSubSubs = (main, categories, rangeValues) => {
  return categories.map(c => {
    return {
      categoryX: main + " : " + c,
      valueY: Math.floor(Math.random() * rangeValues + 1),
      subs: []
    }
  });
}

export const Default = Template.bind({});
Default.args = {
  data: {
    series: [
      { ...makePieSerie("Categories", ["Société Cairotte d'Elevage de Poulets"], 5 ) },
      { ...makePieSerie("Categories", ["Société Egyptienne d'Elevage de Boeufs"], 5 ) }
    ]
  },
  minHeight: '400px',
  locale: "fr-FR",
  colorSet: 5,
  colorSeed: "papa",
  chartLayout: 2,
  legend: true,
  legendLayout: 0,
  legendPosition: 1,
  legendX: 50,
  legendCenterX: 50,
  legendY: 50,
  legendCenterY: 50,
  otherLabel: "Other",
  otherThreshold: 1
};