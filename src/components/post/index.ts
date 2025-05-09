import PostContainer from '@/components/post/container/post-container';
import PostHeader from '@/components/post/header/post-header';
import PostBody from '@/components/post/body/post-body';

export const Post = Object.assign(PostContainer, {
  Header: PostHeader,
  Body: PostBody
})