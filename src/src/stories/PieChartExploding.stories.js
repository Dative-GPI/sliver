import PieChart from '../components/examples/PieChart.vue';

export default {
  title: 'Example/PieChart/Exploding',
  component: PieChart,
};

const Template = (args, { argTypes }) => ({
  props: Object.keys(argTypes),
  components: { PieChart },
  template:
    `<pie-chart
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
      :otherLabel="otherLabel"
      :otherThreshold="otherThreshold"
    />`,
});

const makeExplodingPieSerie = (name, categories, subCategories, rangeValue) => {
  var data = [];
  for (let i = 0; i < categories.length; i++) {
    let parentCategory = {
      categoryX: categories[i],
      categoryCodeX: name + "-" + categories[i],
      valueY: 0,
      subs: []
    };
    for (let j = 0; j < subCategories.length; j++) {
      parentCategory.subs.push({
        categoryX: subCategories[j],
        valueY: Math.floor(Math.random() * rangeValue)
      });
    }
    parentCategory.valueY = parentCategory.subs.reduce((acc, cur) => acc + cur.valueY, 0);
    data.push(parentCategory);
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
      { ...makeExplodingPieSerie(
        "Expenses",
        ["Société Cairotte d'Elevage de Poulets", "Société Egyptienne d'Elevage de Boeufs"],
        ["Employees well-being", "Dividends", "Salaries & compensations", "Raw materials", "Wrongful terminations suing costs", "Public relations & marketing", "Miscellaneous"],
        500
      )},
    ]
  },
  height: '100vh',
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
  otherThreshold: 2
};