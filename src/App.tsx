import React, { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";

type todo = {
  title: string;
  id: number;
};
const fetchTodos = async (
  pageNumber: number,
  setTodos: React.Dispatch<React.SetStateAction<todo[]>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  if (pageNumber > 20) {
    setLoading(false);
    return;
  }
  setLoading(true);

  try {
    const res = await fetch("https://jsonplaceholder.typicode.com/todos/").then(
      (response) => response.json()
    );
    const slicedIndex = pageNumber * 10;
    const slicedResponse = res.slice(slicedIndex - 10, slicedIndex);
    setLoading(false);
    setTodos((todos: todo[]) => {
      return [...todos, ...slicedResponse];
    });
  } catch (error) {
    setLoading(false);
  }
};

const App: React.FunctionComponent = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [todos, setTodos] = useState<todo[]>([]);
  const [loading, setLoading] = useState(false);
  const observer = useRef<IntersectionObserver>();

  const lastTodo = useCallback((node: Element | null) => {
    console.log(node);
    if (node != null) {
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(
        (entries) => {
          const firstEntry = entries[0];
          if (firstEntry.isIntersecting) {
            setPageNumber((n) => n + 1);
          }
        },
        {
          threshold: 1,
        }
      );
      observer.current.observe(node);
    }
  }, []);

  useEffect(() => {
    fetchTodos(pageNumber, setTodos, setLoading);
  }, [pageNumber]);

  return (
    <div className="app">
      <header className="header">
        <h1>Custom Infinite Scroll</h1>
      </header>
      <main className="container">
        {todos.length
          ? todos.map((todo, index) => (
              <p
                className="todo"
                key={todo.id}
                ref={index === todos.length - 1 ? lastTodo : null}
              >
                {todo.title}
              </p>
            ))
          : ""}
        <div>{loading ? "Loading..." : ""}</div>
      </main>
      <footer className="footer">
        <p>Intersection Observer API</p>
      </footer>
    </div>
  );
};

export default App;
