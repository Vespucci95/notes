import { useFetchAllCategoriesQuery } from '@/queries/categories';
import { useAppConfig } from '@/queries/app-config';
import { useMemo } from 'react';

export type Post = {
  title: string;
  path: string;
}

export type Category = {
  categoryName: string;
  posts: Post[]
}

export const useCategoryListViewModel = (): Category[] => {
  const categories = useFetchAllCategoriesQuery();
  const { site } = useAppConfig();

  return useMemo(() => categories.allMarkdownRemark.group.map((category) => (
      {
        categoryName: category.fieldValue || site.siteMetadata.categoryFieldName,
        posts: category.edges.map((edge) => ({
          title: edge.node.frontmatter?.title || site.siteMetadata.defaultPostTitle,
          path: edge.node.fields?.path || '/',
        })),
      }
    )),
    [categories, site]
  );
}