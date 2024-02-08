import { createContext, ReactNode, useState } from 'react';
import { destroyCookie, setCookie, parseCookies } from 'nookies';
import Router from 'next/router';
import { api } from '../services/apiClient';
import { toast } from 'react-toastify';

type AuthContextData = {
    user: UserProps;
    isAuthenticated: boolean;
    signIn: (credentials: SignInProps) => Promise<void>;
    signOut: () => void;
    signUp: (credentials: SignUpProps) => Promise<void>;
}

type UserProps = {  
    id: string;
    name: string;
    email: string;
}

type SignInProps = { 
    email: string;
    password: string;
}

type SignUpProps = {
    name: string;
    email: string;
    password: string;
}

type AuthProviderProps = {
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData);

export function signOut(){
    try {
        destroyCookie(undefined, '@nextauth.token');
        Router.push('/');
    } catch{
        console.log("Erro ao deslogar o sistema.");
    }
}

export function AuthProvider({children}: AuthProviderProps){
    const [user, setUser] = useState<UserProps>();
    const isAuthenticated = !!user;

    async function signUp({name, email, password}: SignUpProps){
        try {
            const res = await api.post('/users', {
                name,
                email,
                password
            });

            toast.success("Conta criada com sucesso.");

            Router.push('/');

        } catch (error) {
            toast.error("Falha ao criar novo usuário. Por favor, tente mais tarde.");
            console.error("Erro ao cadastrar: " + error);
        }
    }

    async function signIn({ email, password }: SignInProps){
        try {
            const response = await api.post('/session', {
                email,
                password
            });

            const { id, name, token } = response.data;

            setCookie(undefined, '@nextauth.token', token, {
                maxAge: 60 * 60 * 24 * 30, //expora em 1 mês
                path: "/" //quais caminhos terão acesso ao cookie
            });

            setUser({
                id,
                name,
                email
            });
            
            //Passar para as próximas requisições o nosso token
            api.defaults.headers['Authorization'] = `Bearer ${token}`;

            toast.success("Usuário logado com sucesso.");

            //Redirecionar para o dashboard
            Router.push('/dashboard');

        } catch (error) {
            toast.error("Não foi possível acessar. Tente novamente mais tarde.");
            console.error("Error: " + error);
        }
    }

    return(
        <AuthContext.Provider value={{ user, isAuthenticated, signIn, signOut, signUp }}>
            {children}
        </AuthContext.Provider>
    )
}