import React from 'react';
import Layout from './src/components/layout';
import { GatsbyBrowser } from 'gatsby';
import '@/styles/reset.css';
import '@/styles/global.scss';
import '@/styles/markdown.scss';


export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
