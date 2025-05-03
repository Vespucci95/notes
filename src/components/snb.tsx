import * as React from "react"
import { Accordion } from 'radix-ui';
import { useCategoryListViewModel } from '@/hooks/use-category-list-view-model';
import { Link } from 'gatsby';

const SNB = () => {
  const categoryList = useCategoryListViewModel();

  return (
    <nav className="nav-snb-container">
      <Link to="/">
        Main
      </Link>
      <Accordion.Root type='multiple'>
        {
          categoryList.map(({ categoryName, posts }) => (
            <Accordion.Item value={categoryName} key={categoryName}>
              <Accordion.Trigger>{categoryName}</Accordion.Trigger>
              <Accordion.Content>
                {
                  posts.map(({ title, path }) => (
                    <Link key={`${categoryName}-${title}}`} to={path} style={{ display: 'block' }}>{title}</Link>
                  ))
                }
              </Accordion.Content>
            </Accordion.Item>
          ))
        }
      </Accordion.Root>
    </nav>
  )
}

export default SNB;