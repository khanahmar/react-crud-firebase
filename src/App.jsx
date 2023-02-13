import "./App.css"
import React from "react"
import { db } from "./firebase-config"
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  deleteDoc,
  onSnapshot,
} from "firebase/firestore"

function App() {
  const [movies, setMovies] = React.useState([])
  const [movieName, setMovieName] = React.useState("")
  const [currentId, setCurrentId] = React.useState("")
  const movieCollection = collection(db, "movies")
  const [isChecked, setIsChecked] = React.useState(false)

  React.useEffect(() => {
    console.log(movies)
  }, [movies])

  async function addMovie() {
    if (isChecked && movieName !== "") {
      updateMovie()
    } else {
      if (movieName !== "" && !isChecked) {
        await addDoc(movieCollection, { name: movieName })
        setMovieName("")
      }
    }
  }

  const editMovie = (id, name) => {
    setIsChecked(true)
    setCurrentId(id)
    setMovieName(name)
  }

  async function updateMovie() {
    setIsChecked(false)
    const document = doc(db, "movies", currentId)
    await updateDoc(document, { name: movieName })
    setMovieName("")
  }

  async function deleteMovie(id) {
    const document = doc(db, "movies", id)
    await deleteDoc(document)
  }

  React.useEffect(() => {
    const unsubscribe = onSnapshot(movieCollection, (snapshot) => {
      setMovies(
        snapshot.docs.map((doc) => {
          return { data: doc.data(), id: doc.id }
        })
      )
    })

    return () => {
      unsubscribe()
    }
  }, [])

  // async function getMovies() {
  //   try {
  //     const data = await getDocs(movieCollection)
  //     setMovies(
  //       data.docs.map((doc) => {
  //         return { data: doc.data(), id: doc.id }
  //       })
  //     )
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  return (
    <div className="App">
      <input
        type="text"
        onChange={(e) => setMovieName(e.target.value)}
        value={movieName}
        placeholder="Add a movie"
      />
      <button onClick={addMovie} type="submit">
        {isChecked ? "Update" : "Add"}
      </button>

      <h1>Movies</h1>
      <div className="movies">
        <ul>
          {movies.map((movie) => {
            return (
              <li key={movie.id}>
                {movie.data.name}{" "}
                <button onClick={() => editMovie(movie.id, movie.data.name)}>
                  Edit
                </button>
                <button onClick={() => deleteMovie(movie.id)}>Delete 😥</button>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}

export default App
