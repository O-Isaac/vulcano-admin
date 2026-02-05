import { api } from "../lib/api"
import type { Componente, LoginResponseBody, Plano, Queue, Recurso, RegisterResponseBody, Jugador } from "../types/api"

// Auth

export const login = (username: string, password: string) => {
    return api.post("auth/login", { json: { username, password } }).json<LoginResponseBody>()
}

export const getMe = () => {
    return api.get("jugadores/me").json<Jugador>()
}

export const register = (username: string, password: string, secondPassword: string) => {
    return api.post("auth/register", { json: { username, password, secondPassword } }).json<RegisterResponseBody>()
}

// Recurso

export const createRecurso = async (recurso: Partial<Recurso>) => {
    const response = await api.post("recursos", { json: recurso })
    return response.ok
}

export const updateRecurso = async (recurso: Partial<Recurso>) => {
    const response = await api.put(`recursos/${recurso.id}`, { json: recurso })
    return response.ok
}

export const deleteRecurso = async (id: number) => {
    const response = await api.delete(`recursos/${id}`)
    return response.ok
}


// Plano

export const createPlano = async (plano: Partial<Plano>) => {
    const response = await api.post("planos", { json: plano })
    return response.ok
}

export const updatePlano = async (plano: Partial<Plano>) => {
    const { id, ...data } = plano
    const response = await api.put(`planos/${id}`, { json: data })
    return response.ok
}

export const deletePlano = async (id: number) => {
    const response = await api.delete(`planos/${id}`)
    return response.ok
}

// Componentes

export const createComponente = async (_componente: any) => {
    throw new Error("Creation must be performed through a Plano (Hierarchical Model)")
}

export const getComponentes = async () => {
    const response = await api.get("componentes")
    return response.json<Componente[]>()
}

export const updateComponente = async (id: number, data: { cantidad: number, recursoId?: number }) => {
    const response = await api.put(`componentes/${id}`, { json: data })
    return response.ok
}

export const deleteComponente = async (id: number) => {
    const response = await api.delete(`componentes/${id}`)
    return response.ok
}

export const getPlanoComponentes = async (planoId: number) => {
    const response = await api.get(`planos/${planoId}/componentes`)
    return response.json<Componente[]>()
}

export const addPlanoComponentesBulk = async (planoId: number, componentes: { recursoId: number, cantidad: number }[]) => {
    const response = await api.post(`planos/${planoId}/componentes/bulk`, { json: componentes })
    return response.ok
}

// Fundicion
export const queuePlano = async (planoId: number) => {
    const response = await api.post("queues", { json: { planoId } });
    return response.json<Queue>();
};

// Petición optimizada para obtener activos (soporta múltiples)
export const getActiveQueues = async () => {
    const response = await api.get("queues/active");
    return response.json<Queue[]>();
};

// Inventario Admin
export const getJugadores = async () => {
    const response = await api.get("jugadores")
    return response.json<Jugador[]>()
}

export const updateInventario = async (jugadorId: number, recursoId: number, cantidad: number) => {
    const response = await api.put(`inventarios/${jugadorId}/${recursoId}`, { searchParams: { cantidad } })
    return response.ok
}

export const addInventario = async (jugadorId: number, recursoId: number) => {
     const response = await api.post(`inventarios/${jugadorId}/${recursoId}`)
     return response.ok
}

export const addCreditos = async (jugadorId: number, cantidad: number) => {
    const response = await api.patch(`jugadores/creditos/${jugadorId}/${cantidad}`)
    return response.ok
}

export const createMyInventory = async (recursoId: number) => {
    const response = await api.post(`inventarios/me/${recursoId}`)
    return response.ok
}