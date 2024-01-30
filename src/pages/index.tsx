import Head from 'next/head';
import logoImg from '../../public/logo.svg';
import styles from '../styles/home.module.scss';
import Image from 'next/image';
import { Input } from '../components/ui/Input/index';
import { Button } from '../components/ui/Button';
import Link from 'next/link';
import { useContext, FormEvent, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';

export default function Home() {
  const { signIn } = useContext(AuthContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: FormEvent){
    event.preventDefault();

    let data = {
      email,
      password
    }

    await signIn(data);
  }

  return (
    <>
      <Head>
        <title>SujeitoPizzaria - Faça o seu login</title>
      </Head>
      <div>
        <div className={styles.containerCenter}>
          <Image src={logoImg} alt="Logo Sujeito Pizzaria" />

          <div className={styles.login}>
            <form onSubmit={handleLogin}>
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

              <Button type="submit" loading={false}>
                Acessar
              </Button>
            </form>

            <Link href="/signup" legacyBehavior>
              <a className={styles.text}>Não possui uma conta? Cadastre-se</a>
            </Link>
            
          </div>
        </div>        
      </div>
    </>
  );
}
