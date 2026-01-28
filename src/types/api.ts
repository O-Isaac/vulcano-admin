export interface Recurso {
  id: number
  nombre: string
  desc: string
  rareza: string
}

export interface Componente {
  id: number
  recursoId: number
  cantidad: number
  recurso?: Recurso
}

export interface Plano {
  id: number
  nombre: string
  tiempoConstrucion: number
  coste: number
  desc: string
  recursoFabricado?: Recurso
  recursoFabricadoId?: number
  componentes?: Componente[]
}

export interface Fundicion {
  id: number
  nombre: string
  material: string
  estado: string
}

// Auth
export interface RegisterBody {
  username: string;
  password: string;
  secondPassword: string;
}

export interface RegisterResponseBody {
  username: string;
  message: string;
}

export interface LoginResponseBody {
  refresh_token: string;
  access_token: string;
  token_type: string;
}

export interface RefreshTokenBody {
  refresh_token: string;
  access_token: string;
}

export interface InventoryItem {
  recurso: Recurso;
  cantidad: number;
}

export interface Queue {
  id: number;
  inicioTime: Date;
  finalTime: Date;
  estado: string;
  jugador: Jugador;
  plano: Plano;
}

export interface Jugador {
  id: number;
  nivel: number;
  correo: string;
  role: string;
}
