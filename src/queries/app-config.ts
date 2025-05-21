import { graphql, useStaticQuery } from 'gatsby';
import { SiteMetadataConfigQuery } from '@/__generated__/gatsby-types';
import { DeepRequired } from '@/types';

export const SiteMetadataQuery = graphql`
    query SiteMetadataConfig {
        site {
            siteMetadata {
                title
                categoryFieldName
                defaultCategoryName
                defaultPostTitle
                obsidianNoteName
            }
        }
    }
`;

export const useFetchAppConfig = (): DeepRequired<SiteMetadataConfigQuery> => useStaticQuery(SiteMetadataQuery);