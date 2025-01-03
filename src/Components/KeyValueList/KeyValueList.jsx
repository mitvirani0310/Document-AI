import React from "react";

const KeyValueList = ({ keyValueList, handleKeyValueClick }) => {
  return (
    <div className="w-1/2 bg-white rounded-lg shadow-lg flex flex-col overflow-hidden">
      <h2 className="text-xl font-semibold p-4 text-gray-700">
        Document Details
      </h2>
      <div className="flex-1 overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Key
              </th>
              <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Value
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {keyValueList.map((item, index) => (
              <tr
                key={index}
                onClick={() => handleKeyValueClick(item.value)}
                className="hover:bg-gray-100 cursor-pointer transition-all duration-200"
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 text-center">
                  {item.key}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
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
