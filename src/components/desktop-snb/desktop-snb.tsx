import * as React from "react"
import { Accordion } from 'radix-ui';
import { useCategoryListViewModel } from '@/hooks/use-category-list-view-model';
import { Link } from 'gatsby';

const DesktopSnb = () => {
  const categoryList = useCategoryListViewModel();

  return (
    <nav>
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

export default DesktopSnb;