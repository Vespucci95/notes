import * as React from "react"
import { HeadFC, Link, PageProps } from "gatsby"

const NotFoundPage: React.FC<PageProps> = () => {
  return (
    <main>
      <Link to="/">HOME</Link>.
    </main>
  )
}

export default NotFoundPage

export const Head: HeadFC = () => <title>Not found</title>
