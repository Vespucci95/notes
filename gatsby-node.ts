import { GatsbyNode } from 'gatsby';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

export const onCreateWebpackConfig: GatsbyNode['onCreateWebpackConfig'] = ({ getConfig, actions }) => {
  const output = (getConfig().output as object) || {};

  actions.setWebpackConfig({
    output,
    resolve: {
      plugins: [new TsconfigPathsPlugin()],
    },
  });
};