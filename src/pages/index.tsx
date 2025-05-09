import * as React from "react"
import { HeadFC, PageProps } from "gatsby"
import { Post } from '@/components/post';
import CategoryNavigation from '@/components/category-navigation/category-navigation';

const IndexPage: React.FC<PageProps> = ({ data }) => {
  return (
    <Post style={{margin: '0 auto'}}>
      <CategoryNavigation />
    </Post>
  )
}

export default IndexPage

export const Head: HeadFC = () => <title>note</title>