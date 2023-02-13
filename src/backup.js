import "./App.css"
import React from "react"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
} from "firebase/firestore"
import { db } from "./firebase-config"

// Component
function App() {
  const [users, setUsers] = React.useState([])
  const usersCollection = collection(db, "users")
  const [name, setName] = React.useState("")
  const [age, setAge] = React.useState(0)
  const [checkIt, setCheckIt] = React.useState(false)
  const [currentId, setCurrentId] = React.useState("")

  function updateItem(name, age, id) {
    setCurrentId(id)
    setCheckIt(true)
    setName(name)
    setAge(age)
  }

  async function updatingItem() {
    const document = doc(db, "users", currentId)
    const newFields = {
      name: name,
      age: Number.parseInt(age),
      id: currentId,
    }
    await updateDoc(document, newFields)
    console.log(document)
    console.log(newFields)
  }

  async function deleteItem(id) {
    const document = doc(db, "users", id)
    await deleteDoc(document)
  }

  async function addUser() {
    if (checkIt) {
      updatingItem()
      console.log("done")
      setCheckIt(false)
    } else {
      if (name !== "" && age !== 0) {
        await addDoc(usersCollection, {
          name: name,
          age: Number.parseInt(age),
        })
      }
    }
  }

  React.useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(usersCollection)
      setUsers(
        data.docs.map((doc) => {
          return {
            ...doc.data(),
            id: doc.id,
          }
        })
      )
    }
    getUsers()
  }, [users])

  return (
    <div className="App">
      <div>
        <input
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="Name..."
          name="name"
          value={name}
        />
        <input
          age="age"
          type="number"
          onChange={(e) => setAge(e.target.value)}
          value={age}
        />
        <button onClick={addUser}>{checkIt ? "Update it" : "Add user"}</button>
      </div>
      <div>
        {users.map((user) => {
          return (
            <div key={user.id}>
              <h1>Name : {user.name}</h1>
              <h1>Age : {user.age}</h1>
              <button onClick={() => updateItem(user.name, user.age, user.id)}>
                update item
              </button>
              <button onClick={() => deleteItem(user.id)}>Delete</button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
