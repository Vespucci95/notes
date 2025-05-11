import { graphql, useStaticQuery } from 'gatsby';
import { AllCategoriesDataQuery } from '@/__generated__/gatsby-types'

export const AllCategoriesQuery = graphql`
    query AllCategoriesData {
        allMarkdownRemark(sort: {frontmatter: {date: ASC}}) {
            group(field: {fields: {category: SELECT}}) {
                fieldValue
                totalCount
                edges {
                    node {
                        id
                        frontmatter {
                            title
                            date
                        }
                        fields {
                            path
                        }
                    }
                }
            }
        }
    }
`;

export const useFetchAllCategoriesQuery = (): AllCategoriesDataQuery => useStaticQuery(AllCategoriesQuery);