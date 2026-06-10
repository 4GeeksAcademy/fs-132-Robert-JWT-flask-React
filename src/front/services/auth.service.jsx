const authService = {}
const url = import.meta.env.VITE_BACKEND_URL

authService.auth = async (formData) => {
    try {
        const resp = await fetch(url + '/api/auth', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        if (!resp.ok) throw new Error('error auth')
        const data = await resp.json()
    if (data.token) localStorage.setItem('token', data.token)
        return data
    } catch (error) {
        console.log(error)
    }
}

authService.getMe = async () => {
     try {
        const resp = await fetch(url + '/api/me', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // si tiene la ruta @jwt_required() SE ENVIA AUTHORIZATION CON BEARER TOKEN
            }, 
        })
        if (!resp.ok) throw new Error('error auth')
        const data = await resp.json()
        return data
    } catch (error) {
        console.log(error)
    }
}


authService.logout = () => {
    localStorage.removeItem('token')
}

export default authService