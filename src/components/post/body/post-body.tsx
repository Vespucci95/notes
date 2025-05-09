import * as React from 'react';

interface MDXProps {
  html: string;
}

const PostBody: React.FC<MDXProps> = ({ html }) => {
  return (
    <div className="markdown" dangerouslySetInnerHTML={{ __html: html }} />
  );
};

export default PostBody;