
import React from 'react';

const CategoryOptions = ({ categories, level = 0 }) => {
  return categories.map((category) => (
    <React.Fragment key={category.id}>
      <option value={category.id}>
        {' '.repeat(level * 4)}
        {category.name}
      </option>
      {category.children && category.children.length > 0 && (
        <CategoryOptions categories={category.children} level={level + 1} />
      )}
    </React.Fragment>
  ));
};

export default CategoryOptions;
