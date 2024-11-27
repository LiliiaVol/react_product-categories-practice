/* eslint-disable jsx-a11y/accessible-emoji */
import { useState, React } from 'react';
import cn from 'classnames';

// import React from 'react';
import './App.scss';

import usersFromServer from './api/users';
import categoriesFromServer from './api/categories';
import productsFromServer from './api/products';

const products = productsFromServer.map(product => {
  const category = categoriesFromServer.find(
    categoryOne => product.categoryId === categoryOne.id,
  );

  const user = usersFromServer.find(userOne => category.ownerId === userOne.id);

  return { ...product, owner: user, category };
});

export const App = () => {
  const [query, setQuery] = useState('');
  const [filterField, setFilterField] = useState('');
  const [sortField, setSortField] = useState('');

  const getFilterProducts = () => {
    let filteredProducts = [...products];

    if (filterField !== '') {
      filteredProducts = products.filter(
        product => product.owner.name === filterField,
      );
    }

    if (sortField.length !== 0) {
      filteredProducts = products.filter(
        product => product.category.title === sortField,
      );
    }

    // розкоментуйте цю частину, вона працює, але lint свариться
    if (query.trim() !== '') {
      filteredProducts = filteredProducts
        .filter(product => product.name.toLowerCase()
          .includes(query.toLowerCase())
        );
    }

    return filteredProducts;
  };

  const visibleProducts = getFilterProducts();

  const onReset = () => {
    setQuery('');
    setFilterField('');
    setSortField('');
  };

  const onResetInput = () => {
    setQuery('');
  };

  // console.log(visibleProducts);
  // console.log(sortField);

  return (
    <div className="section">
      <div className="container">
        <h1 className="title">Product Categories</h1>

        <div className="block">
          <nav className="panel">
            <p className="panel-heading">Filters</p>

            <p className="panel-tabs has-text-weight-bold">
              <a
                data-cy="FilterAllUsers"
                href="#/"
                onClick={() => setFilterField('')}
                className={cn({
                  'is-active': filterField === '',
                })}
              >
                All
              </a>

              {usersFromServer.map(user => (
                <a
                  data-cy="FilterUser"
                  href="#/"
                  key={user.id}
                  onClick={() => setFilterField(user.name)}
                  className={cn({
                    'is-active': filterField === user.name,
                  })}
                >
                  {user.name}
                </a>
              ))}
            </p>

            <div className="panel-block">
              <p className="control has-icons-left has-icons-right">
                <input
                  data-cy="SearchField"
                  type="text"
                  className="input"
                  placeholder="Search"
                  value={query}
                  onChange={e => {
                    setQuery(e.target.value);
                  }}
                />

                <span className="icon is-left">
                  <i className="fas fa-search" aria-hidden="true" />
                </span>

                <span className="icon is-right">
                  {/* eslint-disable-next-line jsx-a11y/control-has-associated-label */}
                  {query === '' ? null : (
                    <button
                      data-cy="ClearButton"
                      type="button"
                      className="delete"
                      onClick={onResetInput}
                    />
                  )}
                </span>
              </p>
            </div>

            <div className="panel-block is-flex-wrap-wrap">
              <a
                href="#/"
                data-cy="AllCategories"
                className={cn('button is-success mr-6', {
                  'is-outlined': sortField !== '',
                })}
                onClick={() => setSortField('')}
              >
                All
              </a>

              {categoriesFromServer.map(category => (
                <a
                  key={category.id}
                  data-cy="Category"
                  href="#/"
                  // onClick={onPersonClick(person.slug)}
                  onClick={() => setSortField(category.title)}
                  className={cn('button mr-2 my-1', {
                    'is-info': sortField === category.title,
                  })}
                >
                  {category.title}
                </a>
              ))}
            </div>

            <div className="panel-block">
              <a
                data-cy="ResetAllButton"
                href="#/"
                className="button is-link is-outlined is-fullwidth"
                onClick={onReset}
              >
                Reset all filters
              </a>
            </div>
          </nav>
        </div>

        <div className="box table-container">
          {visibleProducts.length !== 0 ? (
            <table
              data-cy="ProductTable"
              className="table is-striped is-narrow is-fullwidth"
            >
              <thead>
                <tr>
                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      ID
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Product
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-down" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      Category
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort-up" />
                        </span>
                      </a>
                    </span>
                  </th>

                  <th>
                    <span className="is-flex is-flex-wrap-nowrap">
                      User
                      <a href="#/">
                        <span className="icon">
                          <i data-cy="SortIcon" className="fas fa-sort" />
                        </span>
                      </a>
                    </span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {visibleProducts.map(product => (
                  <tr data-cy="Product" key={product.id}>
                    <td className="has-text-weight-bold" data-cy="ProductId">
                      {product.id}
                    </td>

                    <td data-cy="ProductName">{product.name}</td>
                    <td data-cy="ProductCategory">{`${product.category.icon} - ${product.category.title}`}</td>

                    <td
                      data-cy="ProductUser"
                      className={cn({
                        'has-text-link': product.owner.sex === 'm',
                        'has-text-danger': product.owner.sex === 'f',
                      })}
                    >
                      {product.owner.name}
                    </td>
                  </tr>
                ))}

                {/* <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        1
                      </td>

                      <td data-cy="ProductName">Milk</td>
                      <td data-cy="ProductCategory">🍺 - Drinks</td>

                      <td data-cy="ProductUser" className="has-text-link">
                        Max
                      </td>
                    </tr>

                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        2
                      </td>

                      <td data-cy="ProductName">Bread</td>
                      <td data-cy="ProductCategory">🍞 - Grocery</td>

                      <td data-cy="ProductUser" className="has-text-danger">
                        Anna
                      </td>
                    </tr>

                    <tr data-cy="Product">
                      <td className="has-text-weight-bold" data-cy="ProductId">
                        3
                      </td>

                      <td data-cy="ProductName">iPhone</td>
                      <td data-cy="ProductCategory">💻 - Electronics</td>

                      <td data-cy="ProductUser" className="has-text-link">
                        Roma
                      </td>
                    </tr> */}
              </tbody>
            </table>
          ) : (
            <p data-cy="NoMatchingMessage">
              No products matching selected criteria
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
