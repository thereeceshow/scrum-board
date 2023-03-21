import React, { useEffect, useState, useRef } from 'react';
import { Card, Container, Stack, Col, ListGroup, CloseButton, Form, Button } from 'react-bootstrap';
// import ListGroupItem from 'react-bootstrap';
// import { Draggable } from 'react-draggable';

const ScrumBoard = () => {

  const [categories, setCategories] = useState(['Project Backlog', 'Spring Backlog', 'In Progress', 'Done']);


  const [tasks, setTasks] = useState([
    { id: 1, name: 'Task 1', status: categories[0] },
    { id: 2, name: 'Task 2', status: categories[0] },
    { id: 3, name: 'Task 3', status: categories[1] },
    { id: 4, name: 'Task 4', status: categories[1] },
    { id: 5, name: 'Task 5', status: categories[1] },
    { id: 6, name: 'Task 6', status: categories[2] },
    { id: 7, name: 'Task 7', status: categories[2] }
  ]);

  console.log('here', tasks.reduce((prev, current) => (prev.id > current.id) ? prev : current).id)

  const dragItem = useRef();
  const dragOverItem = useRef();

  const TaskItem = (props) => {
    console.log(props)
    const [textValue, setTextValue] = useState(props.taskName)
    const [editable, setEditable] = useState(false);

    const EditText = (props) => {
      // let editable = true;
      return (
        <>
          {
            props.editable ? (
              <>
                <div>
                  <input type="text" value={textValue} onChange={props.handleChange} onBlur={props.handleBlur} autoFocus />
                  <CloseButton />
                </div>
              </>
            ) :
              (
                <>
                  <div onDoubleClick={props.handleDoubleClick}>{textValue}</div>
                  <Button variant='danger' size="sm" className="mt-1" onClick={props.handleClick}>Delete</Button>
                </>
              )
          }
        </>
      )
    };


    return (
      <EditText
        text={'test'}
        handleBlur={() => {
          setEditable(false);
          onHandleBlur(props.id, textValue);
        }
        }
        handleDoubleClick={() => setEditable(true)}
        handleChange={(e) => {
          // console.log(e.target.value, props.id);
          setTextValue(e.target.value);
        }}
        handleClick={() => {
          console.log('DEL ', props.id)
          const delTasksArray = tasks.filter(el => el.id !== props.id)
          setTasks(delTasksArray)
        }}
        editable={editable}
      />
    )
  }

  const List = (props) => {
    const listCategory = props.listCategory
    const listArray = [...props.listTasks.filter((task) => (task.status === listCategory))]
    return (
      <Col xs={12} sm={3}
        className="droppable"
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e, listCategory)}
        className="pt-0"
      >
        <Card>
          <Card.Body>
            <Card.Title>{listCategory}</Card.Title>
            {/* // ListGroup */}
            <ListItemsArray
              listArray={listArray} />
          </Card.Body>

        </Card>
      </Col>
    )
  }


  const ListItemsArray = (props) => {
    const listItems = props.listArray.map((item) => {
      const index = tasks.indexOf(item)
      console.log(index)
      return (
        <ListGroup.Item
          className="draggable"
          onDragStart={(e) => onDragStart(e, item, index)}
          onDragEnter={(e) => onDragEnter(e, index)}
          onDragEnd={onDrop}
          draggable
          key={item.id}>
          <TaskItem
            taskName={item.name}
            id={item.id}
          />
        </ListGroup.Item>
      )
    })
    return (
      <ListGroup variant="flush">
        {listItems}
      </ListGroup>
    )
  };


  const RenderedLists = () => categories.map((el, index) => {
    return (
      <List
        className="list"
        key={index}
        listTasks={tasks}
        listCategory={el}
      />
    )
  }
  )

  const onDragOver = (ev) => {
    ev.preventDefault();
  }

  const onDragEnter = (e, index) => {
    console.log('enter index ', index)
    console.log(e.currentTarget)
    dragOverItem.current = index;
  }

  const onDragStart = (ev, item, index) => {
    console.log('start index ', index)
    dragItem.current = index
    ev.dataTransfer.setData("id", item.id)
  }

  const onDrop = (ev, status) => {
    let id = ev.dataTransfer.getData('id');
    let newTasks = tasks.map((task) => {
      if (task.id == id) {
        task.status = status;
      }
      // console.log('new Task: ', task, status)
      return task
    })
    const dragItemContent = newTasks[dragItem.current]
    newTasks.splice(dragItem.current, 1);
    newTasks.splice(dragOverItem.current, 0, dragItemContent);
    dragItem.current = null;
    dragOverItem.current = null;
    console.log(newTasks)
    setTasks(newTasks)
  }


  const onHandleBlur = (id, text) => {
    setTasks(tasks.map((el) => el.id === id ? { ...el, name: text } : el))
  }


  return (
    <Container>
      <Stack direction="horizontal" gap={3} className="mt-3 overflow-x-scroll w-100 align-items-start">
        <RenderedLists />
      </Stack>
    </ Container>
  )

};

export default ScrumBoard;
