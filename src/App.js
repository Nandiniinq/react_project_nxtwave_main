import React, { useState } from 'react';
import './App.css';

const API = "https://apis.ccbp.in/list-creation/lists";

const fetchUsers = async (url) => {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch data');
    const data = await response.json();
    return data.lists;
  } catch (err) {
    throw err;
  }
};

function App() {
  const [data, setData] = useState([]);
  const [list1, setList1] = useState([]);
  const [list2, setList2] = useState([]);
  const [middleList, setMiddleList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [isListCreated, setIsListCreated] = useState(false);
  const [selectedLists, setSelectedLists] = useState({ list1: false, list2: false });
  const [isUpdated, setIsUpdated] = useState(false);
  const [showArrows, setShowArrows] = useState(false); // State to control arrow visibility

  const loadData = async () => {
    setLoading(true);
    setError(false);
    try {
      const fetchedData = await fetchUsers(API);
      setData(fetchedData);
      setList1(fetchedData.filter(item => item.list_number === 1));
      setList2(fetchedData.filter(item => item.list_number === 2));
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    loadData();
  }, []);

  const handleCheckboxChange = (listNumber) => {
    setSelectedLists((prevState) => ({
      ...prevState,
      [`list${listNumber}`]: !prevState[`list${listNumber}`],
    }));
  };

  const handleCreateList = () => {
    if (selectedLists.list1 && selectedLists.list2) {
      setIsListCreated(true);
      setShowArrows(true); // Show arrows when Create List is pressed
    } else {
      alert('Please select both List 1 and List 2.');
    }
  };

  const moveItemToMiddleList = (item, fromList) => {
    if (fromList === 'list1') {
      setList1(list1.filter((i) => i.id !== item.id));
    } else {
      setList2(list2.filter((i) => i.id !== item.id));
    }
    setMiddleList([...middleList, item]);
  };

  const moveItemBackToList = (item, toList) => {
    setMiddleList(middleList.filter((i) => i.id !== item.id));
    if (toList === 'list1') {
      setList1([...list1, item]);
    } else {
      setList2([...list2, item]);
    }
  };

  const handleUpdate = () => {
    setIsUpdated(true);
    setShowArrows(false); // Hide arrows when Update is clicked
  };

  const handleCancel = () => {
    setIsListCreated(false); // Cancel all changes
    setMiddleList([]); // Reset the middle list
    setShowArrows(false); // Hide arrows when Cancel is clicked
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="failure-view">
        <h1>Something went wrong!</h1>
        <p>We couldn't fetch the data. Please try again later.</p>
        <button className="retry-button" onClick={loadData}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="header">List Creation</h1>
      <div className="create-list-button-container">
        <button className="create-list-button" onClick={handleCreateList}>
          Create List
        </button>
      </div>
      <div className="lists-container">
        <div className="list-container">
          <label>
            <input
              type="checkbox"
              checked={selectedLists.list1}
              onChange={() => handleCheckboxChange(1)}
            />
            <span>List 1</span>
          </label>
          <div className="scrollable-list">
            <ul>
              {list1.map((item) => (
                <li key={item.id} onClick={() => moveItemToMiddleList(item, 'list1')}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  {showArrows && <span className="arrow-right">→</span>} {/* Conditionally render the right arrow */}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {isListCreated && (
          <div className="list-container">
            <h2>Middle List</h2>
            <div className="scrollable-list">
              <ul>
                {middleList.map((item) => (
                  <li key={item.id} onClick={() => moveItemBackToList(item, item.list_number === 1 ? 'list1' : 'list2')}>
                    <h3>{item.name}</h3>
                    <p>{item.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        <div className="list-container">
          <label>
            <input
              type="checkbox"
              checked={selectedLists.list2}
              onChange={() => handleCheckboxChange(2)}
            />
            <span>List 2</span>
          </label>
          <div className="scrollable-list">
            <ul>
              {list2.map((item) => (
                <li key={item.id} onClick={() => moveItemToMiddleList(item, 'list2')}>
                  <h3>{item.name}</h3>
                  <p>{item.description}</p>
                  {showArrows && <span className="arrow-left">←</span>} {/* Conditionally render the left arrow */}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {isListCreated && !isUpdated && (
        <div className="update-container">
          <button className="update-button" onClick={handleUpdate}>Update</button>
          <button className="cancel-button" onClick={handleCancel}>Cancel</button>
        </div>
      )}
    </div>
  );
}

export default App;
