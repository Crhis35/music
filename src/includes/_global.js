import _ from 'lodash';

const GlobalComponents = {
  install(app) {
    const baseComponents = require.context('../components/base/', false, /[A-Za-z0-9-_,\s]+\.vue$/);
    baseComponents.keys().forEach((fileName) => {
      const componentConfig = baseComponents(fileName);
      const componentName = _.upperFirst(
        _.camelCase(fileName.replace(/^\.\//, '').replace(/\.\w+$/, '')),
      );

      app.component(`Base${componentName}`, componentConfig.default || componentConfig);
    });
  },
};

export default GlobalComponents;
