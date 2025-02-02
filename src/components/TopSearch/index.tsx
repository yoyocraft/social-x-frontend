import { AutoComplete, AutoCompleteProps, Input } from 'antd';
import { useState } from 'react';

const getRandomInt = (max: number, min = 0) => Math.floor(Math.random() * (max - min + 1)) + min;

const searchResult = (query: string) =>
  new Array(getRandomInt(5))
    .join('.')
    .split('.')
    .map((_, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              Found {query} on{' '}
              <a
                href={`https://s.taobao.com/search?q=${query}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                {category}
              </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        ),
      };
    });

const TopSearch: React.FC = () => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };
  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', marginRight: 4 }}>
        <AutoComplete
          popupMatchSelectWidth={252}
          options={options}
          onSelect={onSelect}
          onSearch={handleSearch}
        >
          <Input.Search placeholder="搜索内容" allowClear enterButton="搜索" />
        </AutoComplete>
      </div>
    </>
  );
};

export default TopSearch;
