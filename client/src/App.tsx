import { Button, Checkbox, FormControl, Grid, List, ListItem, ListItemText, Paper, Table, TableBody, TableCell, TableHead, TableRow, TextField } from '@mui/material'
import { Box, width } from '@mui/system'
import { Fragment, useEffect, useState } from 'react'
import './App.css'
import Header from './components/Header'

type Todo = {
  id: number,
  description: string,
  isdone: boolean,
  createdat: Date,
}
const App = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [description, setDescription] = useState("");


  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
        const body = { description, isdone: false };
        const response = fetch("http://localhost:5000/todos",{
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body)
        });
        //console.log(response);
        setDescription("");
        getAll();

    } catch (error) {
        let message;
        if (error instanceof Error) message = error.message;
        else message = String(error);
        reportError({message})
    }
}

  const handleDelete = async (id: number) => {
      try {
          const response = fetch(`http://localhost:5000/todos/${id}`,{
              method: "DELETE",
              headers: { "Content-Type": "application/json" },
          });

          setTodos(todos.filter(todo => todo.id !== id));
      } catch (error) {
          let message;
          if (error instanceof Error) message = error.message;
          else message = String(error);
          reportError({message})
      }
  }

    const handleCheckbox = (id: number, description: string, isdone: boolean) => {
        console.log(isdone);
        let newTodos = [...todos];
        for (let i in newTodos) {
          if (newTodos[i].id === id) {
            newTodos[i].isdone = isdone;
          }
        }
        setTodos(newTodos);
        try {
            const body = { description, isdone: isdone };
            const response = fetch(`http://localhost:5000/todos/${id}`,{
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
    
            console.log(response);
        } catch (error) {
            let message;
            if (error instanceof Error) message = error.message;
            else message = String(error);
            reportError({message})
        }
    }    

  const getAll = async () => {
      let todos : Todo[] = [];
      try {
          const response = await fetch("http://localhost:5000/todos");
          const data = await response.json();
          todos = data;
      } catch (error) {
          let message;
          if (error instanceof Error) message = error.message;
          else message = String(error);
          reportError({message})
      }
      setTodos(todos);
  }

  useEffect(() => {
      getAll();
  }, []);

  return (
      <Grid
      >
        <Header/>
        <Box
          sx={{ 
            margin: "auto",
            padding: 2,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 8,
            width: "400px"
          }}
        >
            <Grid container>
                <form onSubmit={onSubmitForm}> 
                <Grid item
                sx={{ 
                    margin: "auto",
                    padding: 2,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 0,
                  }}>
                    <TextField
                        type="text" 
                        value={description}
                        onChange={e => setDescription(e.target.value)}   
                    />
                    <Button type='submit'>Add Task</Button>
                </Grid>
                </form>
            </Grid>
        </Box>
        <Grid>
        
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Task</TableCell>
                        <TableCell>Created at:</TableCell>
                        <TableCell>Is it done?</TableCell>
                        <TableCell>Command</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                {todos.map((todo) => {
                    const date = new Date(todo.createdat);
                    const year = date.getFullYear();
                    const month = date.getMonth();
                    const day = date.getDay();
                    return (
                            
                        <TableRow
                        key={todo.id}
                        >
                            <TableCell>{todo.description}</TableCell>
                            <TableCell>{year}/{month}/{day}</TableCell>
                            
                            <TableCell>
                                <Checkbox 
                                checked={todo.isdone}
                                onChange={e => handleCheckbox(todo.id, todo.description, e.target.checked)}
                                />
                            </TableCell>
                            <TableCell>
                                <Button 
                                variant="outlined" 
                                onClick={() => handleDelete(todo.id)}
                                >Delete Task</Button>
                            </TableCell>
                        
                    </TableRow>         
                    )  
                }
               )}
                </TableBody>
            </Table>
        </Grid>
      </Grid>
  )
}

export default App;