import * as React from "react"
import { HeadFC, PageProps } from "gatsby"
import { Post } from '@/components/post';
import Seo from '@/components/seo/seo';
import { useCategoryListViewModel } from '@/hooks/use-category-list-view-model';
import Category from '@/components/category/category';

const IndexPage: React.FC<PageProps> = ({ data }) => {
  const categoryList = useCategoryListViewModel();
  return (
    <Post style={{margin: '0 auto'}}>
      <nav>
        <Category data={categoryList} />
      </nav>
    </Post>
  )
}

export default IndexPage

export const Head: HeadFC = () => <Seo />