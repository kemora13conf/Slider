import React, { useState, useEffect } from "react";
import { Slider } from "./Slider";
import "./App.css";
import { NextButton } from "./Slider/NextButton";
import { PrevButton } from "./Slider/PrevButton";

interface Item {
  userId: number;
  id: number;
  title: string;
  body: string;
}

const App: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [elementsDone, setElementsDone] = useState(false);

  useEffect(() => {
    fetch(
      `https://jsonplaceholder.typicode.com/posts?_page=${page}&_limit=${itemsPerPage}`
    )
      .then((response) => response.json())
      .then((json) =>{
        if(json.length === 0){
          setElementsDone(true);
        } else {
          setItems((prev) => [...prev, ...json]);
        }
      });
  }, [page, itemsPerPage]);

  const handleNext = () => {
    setPage((prev) => prev + 1);
  };


  return (
    <Slider
      nextButton={<NextButton onClick={handleNext} />}
      prevButton={<PrevButton />}
      pas={3}
      isThereNewData={!elementsDone}
    >
      {items.map((item, index) => (
        <Card key={index} item={item} />
      ))}
    </Slider>
  );
};

const Card: React.FC<{ item: Item }> = ({ item }) => {
  return (
    <div className="card">
      <h1 className="title">{item.title}</h1>
      <p className="body">{item.body}</p>
    </div>
  );
};

export default App;