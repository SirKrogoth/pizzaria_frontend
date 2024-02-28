import Head from 'next/head';
import { Header } from '../../components/ui/Header/';
import styles from './style.module.scss';
import { useState, FormEvent } from 'react'; 
import { setupAPIClient } from '../../services/api';
import { toast } from 'react-toastify';
import { canSSRAuth } from '../../utils/canSSRAuth';

export default function Category(){
    const [name, setName] = useState('');

    async function handleRegister(event: FormEvent){
        event.preventDefault();//para nao atualizar a página

        if(name === ''){
            toast.info("Informe uma categoria válida.");
            return;
        }

        const apiClient = setupAPIClient();
        
        await apiClient.post('/category', {
            name: name
        });

        toast.success("Categoria " + name + " cadastrada com sucesso!");
        setName("");

    }

    return(
        <>
            <Head>
                <title>Nova Categoria - Sujeito Pizzaria</title>
                <meta name="description" content="Página de Categorias" />
            </Head>

            <div>
                <Header />
                <main className={styles.container}>
                    <h1>Cadastrar Categorias</h1>

                    <form className={styles.form} onSubmit={handleRegister}>
                        <input type='text' 
                        placeholder='Digite o nome da categoria' 
                        className={styles.input}
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>

                        <button className={styles.buttonAdd} type="submit">Cadastrar</button>
                    </form>

                </main>
            </div>
        
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    return {
        props: {
            
        }
    }
});