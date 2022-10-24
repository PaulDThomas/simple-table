import { useContext } from 'react';
import { SimpleTableContext } from './SimpleTableContext';

export const SimpleTableSearch = (): JSX.Element => {
  const simpleTableContext = useContext(SimpleTableContext);

  return (
    <div className='simpletable-search-holder'>
      <label
        id={`${simpleTableContext.id}-search-label`}
        htmlFor={`${simpleTableContext.id}-search`}
        className={simpleTableContext.searchLabelClassName}
        style={{
          marginTop: 0,
          marginBottom: 0,
          alignSelf: 'center',
          marginRight: '0.5rem',
        }}
      >
        {simpleTableContext.searchLabel ?? 'Search'}
      </label>
      <div>
        <input
          id={`${simpleTableContext.id}-search`}
          className={simpleTableContext.searchInputClassName}
          style={{ margin: '4px' }}
          role='searchbox'
          type='string'
          value={simpleTableContext.searchText ?? ''}
          disabled={!simpleTableContext.setSearchText}
          onChange={(e) => {
            simpleTableContext.setSearchText &&
              simpleTableContext.setSearchText(e.currentTarget.value);
          }}
        />
      </div>
    </div>
  );
};
