import React from "react";
import { useTheme } from '../../contexts/ThemeContext';

const KeyValueList = ({ keyValueList, handleKeyValueClick }) => {
  const { theme } = useTheme();

  return (
    <div className={`w-full ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-lg flex flex-col overflow-hidden`}>
      <h2 className={`text-xl font-semibold p-4 ${theme === 'dark' ? 'text-gray-200' : 'text-gray-700'}`}>
        Document Details
      </h2>
      <div className="flex-1 overflow-auto">
        <table className={`min-w-full divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
          <thead className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} sticky top-0`}>
            <tr>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Key
              </th>
              <th className={`px-6 py-4 text-center text-xs font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} uppercase tracking-wider`}>
                Value
              </th>
            </tr>
          </thead>
          <tbody className={`${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} divide-y ${theme === 'dark' ? 'divide-gray-700' : 'divide-gray-200'}`}>
            {keyValueList.map((item, index) => (
              <tr
                key={index}
                onClick={() => handleKeyValueClick(item.value)}
                className={`${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} cursor-pointer transition-all duration-200`}
              >
                <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${theme === 'dark' ? 'text-gray-200' : 'text-gray-900'} text-center`}>
                  {item.key}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} text-center`}>
                  {item.value}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KeyValueList;

