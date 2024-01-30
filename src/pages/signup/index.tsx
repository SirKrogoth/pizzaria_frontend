import Head from 'next/head';
import logoImg from '../../../public/logo.svg';
import styles from "../../styles/home.module.scss";
import Image from 'next/image';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import Link from 'next/link';

export default function SignUp() {
  return (
    <>
      <Head>
        <title>Faça o seu cadastro agora!</title>
      </Head>
      <div>
        <div className={styles.containerCenter}>
          <Image src={logoImg} alt="Logo Sujeito Pizzaria" />          

          <div className={styles.login}>
            <form>
              <h1>Criando sua conta</h1>

              <Input
              placeholder='Digite seu nome'
              type='text'
              />
              <Input
              placeholder='Digite seu email'
              type='text'
              />
              <Input
              placeholder='Digite sua senha'
              type='password'
              />

              <Button type="submit" loading={false}>
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
