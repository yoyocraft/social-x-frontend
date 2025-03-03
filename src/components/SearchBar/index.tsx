import type React from 'react';

import { useNavigate } from '@umijs/max';
import { AutoComplete, type AutoCompleteProps, Input } from 'antd';
import { useEffect, useState } from 'react';

const MAX_HISTORY_ITEMS = 10;

const SearchBar: React.FC = () => {
  const [options, setOptions] = useState<AutoCompleteProps['options']>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    const storedHistory = localStorage.getItem('searchHistory');
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  const saveToHistory = (searchTerm: string) => {
    if (!searchTerm.trim()) return;

    const updatedHistory = [
      searchTerm,
      ...searchHistory.filter((item) => item !== searchTerm),
    ].slice(0, MAX_HISTORY_ITEMS);

    setSearchHistory(updatedHistory);
    localStorage.setItem('searchHistory', JSON.stringify(updatedHistory));
  };

  const getHistorySuggestions = (prefix: string): AutoCompleteProps['options'] => {
    if (!prefix) return [];

    const matchingHistory = searchHistory
      .filter((item) => item.toLowerCase().startsWith(prefix.toLowerCase()))
      .map((item) => ({
        value: item,
        label: (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{ marginRight: 'auto' }}>{item}</span>
            <span style={{ color: '#999', fontSize: '12px' }}>历史搜索</span>
          </div>
        ),
      }));

    return matchingHistory;
  };

  const handleSearch = (value: string) => {
    const historySuggestions = getHistorySuggestions(value);
    setOptions(historySuggestions);
  };

  const gotoSearchPage = () => {
    navigate(`/search?keyword=${searchValue}`);
  };

  const onSelect = (value: string) => {
    setSearchValue(value);
    saveToHistory(value);
  };

  const onSearch = (value: string) => {
    if (value) {
      saveToHistory(value);
      gotoSearchPage();
    }
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
          <Input.Search
            placeholder="搜索内容"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            allowClear
            enterButton="搜索"
            onSearch={onSearch}
          />
        </AutoComplete>
      </div>
    </>
  );
};

export default SearchBar;
