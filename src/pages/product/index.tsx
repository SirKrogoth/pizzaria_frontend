import Head from 'next/head';
import styles from './styles.module.scss';
import { canSSRAuth } from '../../utils/canSSRAuth';
import { Header } from '../../components/ui/Header';
import { FiUpload } from 'react-icons/fi';
import { useState, ChangeEvent, FormEvent } from 'react';
import { setupAPIClient } from '../../services/api';
import { GetServerSideProps } from 'next';
import { toast } from 'react-toastify';

type ItemProps = {
    id: string;
    name: string;
}

interface CategoryProps{
    categoryList: ItemProps[];
}

export default function Product({ categoryList }: CategoryProps){

    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [description, setDescription] = useState('');

    //salvar a url
    const [avatarUrl, setAvatarUrl] = useState('');
    //salvar a img
    const [imageAvatar, setImageAvatar] = useState(null);
    const [categories, setCattegories] = useState(categoryList || []);
    const [categorySelected, setCategorySelected] = useState(0);

    function handleFile(e: ChangeEvent<HTMLInputElement>){
        //verificação caso usuário não envie o dado
        if(!e.target.files){
            return;
        }

        const image = e.target.files[0];

        //verificar se tem uma img
        if(!image){
            return; 
        }

        if(image.type === 'image/jpeg' || image.type === 'image/png'){
            setImageAvatar(image);
            setAvatarUrl(URL.createObjectURL(e.target.files[0]));

        }
    }
    //quando seleciona uma nova categoria
    function handleChangeCategory(event){ 
        //event.target.value
        setCategorySelected(event.target.value);
    }

    async function handleRegister(event: FormEvent){
        //para não atualizar a página
        event.preventDefault();
        
        try {
            const data = new FormData();

            if(name === ''){
                toast.warning("O campo nome precisa ser preenchido.");
                return
            }
            if(price === ''){
                toast.warning("O campo preço precisa ser preenchido.");
                return;
            }
            if(description === ''){
                toast.warning("O campo descrição precisa ser preenchido.");
                return;
            }
            if(imageAvatar === null){
                toast.warning("Precisa obrigatóriamente haver uma imagem associada ao produto.");
                return;
            }

            data.append('name', name);
            data.append('price', price);
            data.append('description', description);
            data.append('category_id', categories[categorySelected].id);
            data.append('file', imageAvatar);

            const apiClient = setupAPIClient();

            await apiClient.post('/product', data);

            toast.success("Produto cadastrado com sucesso!");

        } catch (error) {
            console.error(error);
            toast.error("Ops! Erro ao cadastrar produto. Detalhes: " + error);
        }

        setName('');
        setPrice('');
        setDescription('');
        setImageAvatar(null);
        setAvatarUrl('');
    }

    return(
        <>
            <Head>
                <title>Novo Produto - Sujeito Pizzaria</title>
                <meta name="description" content="Página de Produtos" />
            </Head>

            <div>
                <Header/>

                <main className={styles.container}>
                    <h1>Novo Produto</h1>

                    <form className={styles.form} onSubmit={handleRegister}>   
                        <label className={styles.labelAvatar}>
                            <span>
                                 <FiUpload size={25} color="#FFF" />
                            </span>    
                            <input type='file' accept='image/png, image/jpeg' onChange={handleFile} />
                            {avatarUrl && (
                                <img
                                    className={styles.preview} 
                                    src={avatarUrl}
                                    alt='Foto do produto'
                                    width={250}
                                    height={250}
                                />
                            )}
                        </label>                 
                        <select value={categorySelected} onChange={handleChangeCategory}>
                            {
                                categories.map((item, index) => {
                                   return(
                                    <option key={item.id} value={index}>
                                        {item.name}
                                    </option>
                                   ) 
                                })
                            }
                        </select>

                        <input 
                            type='text'
                            placeholder='Digite o nome do produto'
                            className={styles.input} 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <input 
                            type='text'
                            placeholder='Digite o preço do produto'
                            className={styles.input} 
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />

                        <textarea 
                            placeholder='Descreva o seu produto'
                            className={styles.input}
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />

                        <button className={styles.buttonAdd} type='submit'>
                            Cadastrar
                        </button>
                    </form>
                </main>
            </div>
        </>
    )
}

export const getServerSideProps = canSSRAuth(async (ctx) => {
    const apliClient = setupAPIClient(ctx)
  
    const response = await apliClient.get('/categoryList');
  
    return {
      props: {
        categoryList: response.data
      }
    }
  })