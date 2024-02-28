import Head from 'next/head';
import logoImg from '../../../public/logo.svg';
import styles from "../../styles/home.module.scss";
import Image from 'next/image';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';
import { useState, FormEvent, useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function SignUp() {
  const { signUp } = useContext(AuthContext);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSignUp(event: FormEvent){
    event.preventDefault(); //serve para não atualizar a página

    if(name === '' || email === '' || password === ''){
      toast.warning("Você deverá informar nome, email e senha para continuar o cadastro.");
      return;
    }

    setLoading(true);

    let data = {
      name,
      email,
      password
    }

    await signUp(data);

    setLoading(false);
  }

  return (
    <>
      <Head>
        <title>Faça o seu cadastro agora!</title>
        <meta name="description" content="Página de Cadastro de Usuários" />
      </Head>
      <div>
        <div className={styles.containerCenter}>
          <Image src={logoImg} alt="Logo Sujeito Pizzaria" />          

          <div className={styles.login}>
            <form onSubmit={handleSignUp}>
              <h1>Criando sua conta</h1>

              <Input
              placeholder='Digite seu nome'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              />
              <Input
              placeholder='Digite seu email'
              type='text'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              />
              <Input
              placeholder='Digite sua senha'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              />

              <Button type="submit" loading={loading}>
                Cadastrar
              </Button>
            </form>

            <Link href="/" legacyBehavior>
              <a className={styles.text}>Já possui uma conta? Faça login!</a>
            </Link>
            
          </div>
        </div>        
      </div>
    </>
  );
}
