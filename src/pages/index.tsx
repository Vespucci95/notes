import * as React from "react"
import { HeadFC, PageProps } from "gatsby"
import { Post } from '@/components/post';
import CategoryNavigation from '@/components/category-navigation/category-navigation';
import Seo from '@/components/seo/seo';

const IndexPage: React.FC<PageProps> = ({ data }) => {
  return (
    <Post style={{margin: '0 auto'}}>
      <CategoryNavigation />
    </Post>
  )
}

export default IndexPage

export const Head: HeadFC = () => <Seo />