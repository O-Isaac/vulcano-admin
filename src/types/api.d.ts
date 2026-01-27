export interface Recurso {
    id: number
    nombre: string
    desc: string
    rareza: string
}

export interface RegisterBody {
  username: string;
  password: string;
  secondPassword: string;
}