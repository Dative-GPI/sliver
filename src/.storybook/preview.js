import Vue from 'vue';
import { Sliver } from "../src/index.ts";

Vue.use(Sliver)

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" }
};

// THIS is my decorator
export const decorators = [
  (story, context) => {
    const wrapped = story(context);
    return Vue.extend({
      components: { wrapped },
      template: `
        <div>
            <wrapped />
        </div>
      `
    });
  },
];