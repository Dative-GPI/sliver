import Vue from 'vue'
import 'roboto-fontface/css/roboto/roboto-fontface.css'
import DatCharts from "../src/index.ts"

Vue.use(DatCharts)

// this was the only thing here by default
export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" }
}

// THIS is my decorator
export const decorators = [
  (story, context) => {
    // wrap the passed component within the passed context
    const wrapped = story(context)
    return Vue.extend({
      components: { wrapped },
      template: `
        <div>
            <wrapped />
        </div>
      `
    })
  },
]