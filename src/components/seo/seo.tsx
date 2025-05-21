import React from 'react'
import { graphql, useStaticQuery } from 'gatsby';

type Props = {
  title?: string;
}

const Seo = ({ title = '' }: Props) => {
  const { meta } = useStaticQuery(graphql`
      query MetaQuery {
          meta: site {
              siteMetadata {
                  title
                  description
                  siteUrl
                  author
              }
          }
      }
  `)

  return (
    <>
      <title>{`${title || meta.siteMetadata.author}`}</title>
      <meta lang="ko" />
      <meta property="og:type" content="website" />
      <meta httpEquiv="content-type" content="text/html; charset=UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={meta.siteMetadata.description} />
    </>
  );
};

export default Seo;
