import React, { useEffect, useState } from 'react'
import ClientApi from './client'

const App = () => {
  const [ persons, setPersons ] = useState([]) 
  const [ newName, setNewName ] = useState('')
  const [ number, setNumber ] = useState('')
  const [ search, setSearch ] = useState('')

  const handleChangeName = (e) =>{
    setNewName(e.target.value)
  }
  const handleChangeNumber = (e) =>{
    setNumber(e.target.value)
  }
  const handleChangeSearch = (e) =>{
    setSearch(e.target.value)
  }

  const handleSubmit = (e) =>{
    e.preventDefault()

    if( findPerson(newName) ){
      alert(`A person with the name ${newName} already exists`)
      return false
    }

    ClientApi.create({name:newName, number:number})
    .then( (data) => setPersons([...persons, data]) )
    .catch( err => console.log( err ))

    setNewName('')
    setNumber('')
  }

  const handleDelete = (id)=>{
    ClientApi.deleteRegister(id)
    .then( () => {
      let indexDelete = persons.findIndex( person => person.id === id )
      setPersons([...persons.slice(0,indexDelete), ...persons.slice(indexDelete + 1, persons.length  )])
    })
    .catch( err => console.log( err ))
  }

  const findPerson = (name) => persons.some( person => person.name === name )

  useEffect( () => {
     ClientApi.getAll()
     .then( data => setPersons(data) )
  }, [])

  const personsFiltered = search
  ?persons.filter( person => person.name.toLocaleLowerCase().match(search.toLocaleLowerCase()) || person.number.toLocaleLowerCase().match(search.toLocaleLowerCase()) )
  :persons
  return (
    <div>
      <h2>Phonebook</h2>
      <Filter sarch={search} handleChangeSearch={handleChangeSearch} />
    
      <PersonForm newName={newName} number={number} handleChangeName={handleChangeName} 
                  handleSubmit={handleSubmit} handleChangeNumber={handleChangeNumber}
      />

      <Persons personsFiltered={personsFiltered} handleDelete={handleDelete}/>
      
    </div>
  )
}

const Filter = ({search, handleChangeSearch})=> <>Search: <input value={search} onChange={handleChangeSearch} /> <br /></>

const PersonForm = ({ newName, number, handleChangeName, handleChangeNumber, handleSubmit}) =>{
  return (
    <>
      <h2>Add a new</h2>
      <form onSubmit={handleSubmit} >
        <div>
          name: <input value={newName} onChange={handleChangeName} />
        </div>
        <div>
          number: <input value={number} onChange={handleChangeNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  )
}
  
const Persons = ({personsFiltered, handleDelete})=> {
  const personsList = personsFiltered.map( (person)  => <span key={person.id} onClick={() => handleDelete(person.id) } > {person.name} : {person.number} <br /></span> )
  return(
    <> 
      <h2>Numbers</h2>
      {personsList}
    </>
  )
}
  
    

export default App;
