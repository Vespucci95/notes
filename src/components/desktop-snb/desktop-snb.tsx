import * as React from "react"
import { Accordion } from 'radix-ui';
import { useCategoryListViewModel } from '@/hooks/use-category-list-view-model';
import { Link } from 'gatsby';
import styles from './desktop-snb.module.scss'

const DesktopSnb = () => {
  const categoryList = useCategoryListViewModel();

  return (
    <nav className={styles.desktopSnb}>
      <Link to="/" className={styles.trigger}>
        Main
      </Link>
      <Accordion.Root type='multiple' className={styles.desktopSnb}>
        {
          categoryList.map(({ categoryName, posts }) => (
            <Accordion.Item value={categoryName} key={categoryName}>
              <Accordion.Trigger className={styles.trigger}>{categoryName}</Accordion.Trigger>
              <Accordion.Content className={styles.content}>
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