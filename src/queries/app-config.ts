import { graphql, useStaticQuery } from 'gatsby';
import { SiteMetadataConfigQuery } from '@/__generated__/gatsby-types';
import { DeepRequired } from '@/types';

export const SiteMetadataQuery = graphql`
    query SiteMetadataConfig {
        site {
            siteMetadata {
                title
                author
                description
                siteUrl
                obsidianNoteName
                categoryFieldName
                postTemplateBasePath
                defaultCategoryName
                defaultPostTitle
            }
        }
    }
`;

export const useFetchAppConfig = (): DeepRequired<SiteMetadataConfigQuery> => useStaticQuery(SiteMetadataQuery);