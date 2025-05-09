import React from 'react';
import Layout from './src/components/layout/layout';
import { GatsbyBrowser } from 'gatsby';
import '@/styles/reset.css';
import '@/styles/global.scss';


export const wrapPageElement: GatsbyBrowser['wrapPageElement'] = ({ element, props }) => {
  return <Layout {...props}>{element}</Layout>;
};
