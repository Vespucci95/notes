import * as React from "react"
import * as Accordion from '@radix-ui/react-accordion';
import { useCategoryListViewModel } from '@/hooks/use-category-list-view-model';
import { Link } from 'gatsby';
import styles from './category-navigation.module.scss';

const CategoryNavigation = () => {
  const categoryList = useCategoryListViewModel();

  return (
    <nav className={styles['categoryNavigation__container']}>
      <Accordion.Root type='multiple' className={styles['categoryNavigation__container']}>
        {
          categoryList.map(({ categoryName, posts }) => (
            <Accordion.Item value={categoryName} key={categoryName}>
              <Accordion.Trigger className={styles['categoryNavigation__trigger']}>{categoryName}</Accordion.Trigger>
              <Accordion.Content className={styles['categoryNavigation__content']}>
                {
                  posts.map(({ title, path }) => (
                    <Link 
                      key={`${categoryName}-${title}}`} 
                      to={path} 
                      className={styles['categoryNavigation__link']}
                    >
                      {title}
                    </Link>
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

export default CategoryNavigation;