export interface Usuarioo {
    uid: string;
    email: string;
    rol: 'admin' | 'usuario' | 'cliente';
    activo: boolean;
}