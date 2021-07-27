import { useEffect, useState } from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider, useSelector, useDispatch } from 'react-redux';
import thunk from 'redux-thunk';


const FETCH_SUCCEDED = 'FETCH_SUCCEDED';
let link = 'https://pokeapi.co/api/v2/pokemon';

const reducer = (state = [], action) => {
  switch(action.type) {

    case FETCH_SUCCEDED: {
      return {...state, data: action.payload.data, count: action.payload.count, url: action.payload.url}
    };
  };
  return state;
};

const store = createStore(reducer, applyMiddleware(thunk));

const loadData = async (dispatch) => {
  const response = await fetch(link);
  const data = await response.json();

  dispatch({
    type: FETCH_SUCCEDED,
    payload: {
      data: data.results,
      count: data.count,
      url: data.next,
    },
  });
};
const loadAll = num => async (dispatch) => {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon?offset=20&limit=${num}`);
  const data = await response.json();

  dispatch({
    type: FETCH_SUCCEDED,
    payload: {
      data: data.results,
    },
  });
};



const DataList = ({ data, onCountChenge }) => {

  const[number, setNumber] = useState('');

  return (
    <>
    <input type='number' value={number} onChange={(e) => {
      setNumber(e.target.value)
      onCountChenge(number)
    }} />
     <ul>
       {data ? data.map(i => <li key={i.name}>{i.name}</li>) : []}
     </ul>
    </>
  )
};

const ConnectedDataList = () => {
  const data = useSelector(state => state.data);
  const dispatch = useDispatch();
  
  useEffect(() => {
    dispatch(loadData)
  },[]);

  return<DataList  data={data} onCountChenge={() => dispatch(loadAll())}  />
};



function App() {
  return (
    <Provider store={store}>
      <ConnectedDataList />
    </Provider>
  );
};

export default App;
