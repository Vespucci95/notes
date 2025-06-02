import * as React from 'react';
import { Accordion } from 'radix-ui';

import { Link } from 'gatsby';
import styles from './category.module.scss';
import { CategoryModel } from '@/hooks/use-category-list-view-model';

const Category = ({ data }: { data: CategoryModel[] }) => {
  return (
    <Accordion.Root type='multiple' className={styles['category__container']}>
      {
        data.map(({ categoryName, posts }) => (
          <Accordion.Item value={categoryName} key={categoryName}>
            <Accordion.Trigger className={styles['category__trigger']}>
              <div className={styles['arrow']}></div>
              {categoryName}
            </Accordion.Trigger>
            <Accordion.Content asChild className={styles['category__content']}>
              <ul>
                {
                  posts.map(({ title, path }) => (
                    <Link
                      key={`${categoryName}-${title}}-${path}`}
                      to={path}
                      className={styles['category__link']}
                    >
                      <li>{title}</li>
                    </Link>
                  ))
                }
              </ul>
            </Accordion.Content>
          </Accordion.Item>
        ))
      }
    </Accordion.Root>
  )
}

export default Category;