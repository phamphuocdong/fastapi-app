from fastapi import FastAPI, HTTPException
from typing import List
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

# Configure CORS
origins = ["http://localhost:3000"]  # Update this with your frontend's URL
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class TodoItem(BaseModel):
    title: str
    completed: bool = False

todos = [
    TodoItem(title = "Quet nha", completed = False),
    TodoItem(title = "Rua chen", completed = False),
]

@app.post("/todos/", response_model=TodoItem)
async def create_todo(item: TodoItem):
    todos.append(item)
    return item

@app.get("/todos/", response_model=List[TodoItem])
async def read_todos():
    return todos

@app.put("/todos/{todo_id}/", response_model=TodoItem)
async def update_todo(todo_id: int, item: TodoItem):
    if 0 <= todo_id < len(todos):
        todos[todo_id] = item
        return item
    raise HTTPException(status_code=404, detail="Todo not found")

@app.delete("/todos/{todo_id}/", response_model=TodoItem)
async def delete_todo(todo_id: int):
    if 0 <= todo_id < len(todos):
        item = todos.pop(todo_id)
        return item
    raise HTTPException(status_code=404, detail="Todo not found")
