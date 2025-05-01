import { graphql, useStaticQuery } from 'gatsby';
import { AllCategoriesDataQuery } from '@/__generated__/gatsby-types'

export const AllCategoriesQuery = graphql`
    query AllCategoriesData {
        allMarkdownRemark {
            group(field: {fields: {category: SELECT}}) {
                fieldValue
                totalCount
                edges {
                    node {
                        id
                        frontmatter {
                            title
                        }
                    }
                }
            }
        }
    }
`;

export const useFetchAllCategoriesQuery = (): AllCategoriesDataQuery => useStaticQuery(AllCategoriesQuery);