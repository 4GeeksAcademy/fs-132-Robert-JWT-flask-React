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
        // leemos el JSON SIEMPRE (ok o no ok) para no perder el mensaje del backend
        const data = await resp.json()

        if (data.token) sessionStorage.setItem('token', data.token)

        return data

    } catch (error) {
        // aqui solo caen errores de red (backend caido, sin internet...)
        console.log(error)
        return { success: false, data: "No se pudo conectar con el servidor" }
    }
}

authService.getMe = async () => {
    try {
        const resp = await fetch(url + '/api/me', {
            method: "GET",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + sessionStorage.getItem('token') // si la ruta tiene @jwt_required() SE ENVIA AUTHORIZATION CON BEARER TOKEN
            },
        })
        if (!resp.ok) return null // token invalido o expirado

        const data = await resp.json()
        return data

    } catch (error) {
        console.log(error)
        return null
    }
}

authService.logout = () => {
    sessionStorage.removeItem('token')
}

export default authService