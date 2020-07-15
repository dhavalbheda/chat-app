const socket = io()
const $msgForm = document.querySelector('#form-data')
const $msgFormInput = $msgForm.querySelector('input')
const $msgFormButton = $msgForm.querySelector('button')
const $locationButton = document.querySelector('#send-locaiton')
const $message = document.querySelector('#message')

//Template
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Option
const {username,room} = Qs.parse(location.search, {ignoreQueryPrefix: true})

const autoScroll = () => {
    //visible Height 
    const visibleHeight = $message.offsetHeight
    console.log(visibleHeight)

    //Height Of Message Container
    const containerHeight = $message.scrollHeight

     if(containerHeight != visibleHeight)
     {
        $message.scrollTop = $message.scrollHeight
     }
     console.log('===')
        
}

socket.on('msg', msg => {
    const html = Mustache.render(messageTemplate,{
        username:msg.username,
        message: msg.text,
        createdAt: moment(msg.createdAt).format('hh:mm A')
    })
    $message.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

socket.on('locationMessage', msg => {
    const html = Mustache.render(locationTemplate, {
        username:msg.username,
        url:msg.url,
        createdAt: moment(msg.createdAt).format('hh:mm A')

    })
    $message.insertAdjacentHTML('beforeend',html)
    autoScroll()
})

$msgForm.addEventListener('submit', (e) => {

    e.preventDefault()
    $msgFormButton.setAttribute('disabled','disabled')

    socket.emit('sendMsg',document.querySelector('#txt').value, (error) => {
        // error?console.log(error):console.log('Message Delivered..')
        $msgFormButton.removeAttribute('disabled')
        $msgFormInput.value = ''
        $msgFormInput.focus()
    })
})

$locationButton.addEventListener('click', () => {
    $locationButton.setAttribute('disabled', 'disabled')

    if(!navigator.geolocation)
    {
        $locationButton.removeAttribute('disabled')
        return alert('Not Support From Browser')
    }    
    
    navigator.geolocation.getCurrentPosition((position) => {
        socket.emit('sendlocation', {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude },
                    () => {
                        $locationButton.removeAttribute('disabled')
                    })
    })
})

socket.emit('join', {username, room}, error => {
    if(error)
    {
        alert(error)
        location.href = '/'
    }
        
})

socket.on('roomdata', ({room, users}) => {
    const html = Mustache.render(sidebarTemplate, {
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML = html
})
