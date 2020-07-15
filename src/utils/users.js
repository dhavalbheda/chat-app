const users = []

const addUser = ({id, username, room}) => {
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    if(!username || !room){
        return{
            error: 'USername And Room Are Required...'
        }
    }

    const exstingUser = users.find((obj) => obj.room === room && obj.username === username)

    if(exstingUser){
        return {
            error: 'User Name in Use...'
        }
    }

    const user = {id, username, room}
    users.push(user)

    return { user }
}

const removeUser = id => {
    const index = users.findIndex(obj => obj.id === id)
    
    if(index !== -1){
        return users.splice(index, 1)[0]
    }
}

const getUser = id =>{
    return users.find(obj => obj.id === id)
}

const getUsersInRoom = room => {
    room = room.trim().toLowerCase()
    return users.filter(obj => obj.room === room)
}

// addUser({
//     id: 22,username:'1',room:'room 1    '
// })
// addUser({
//     id: 23,username:'2',room:'room 2'
// })
// addUser({
//     id: 24,username:'3',room:'room 1'
// })
// addUser({
//     id: 25,username:'4',room:'room 2'
// })
// addUser({
//     id: 26,username:'5',room:'room 1'
// })
// addUser({
//     id: 27,username:'6',room:'room 1'
// })
// console.log(users)
// // console.log(removeUser(23))
// console.log(getUsersInRoom('room 1'))

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}