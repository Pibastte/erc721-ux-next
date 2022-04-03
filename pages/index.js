import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.scss'


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>ERC721-ux</title>
        <meta name="description" content="ERC721-ux" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to <a href="https://github.com/l-henri/erc721-ux">ERC721-ux!</a>
        </h1>
        
        <h3>Routes</h3>
        <div className={styles.titleContainer}>
          <a href="./fakeBayc"><button>Fake BAYC</button></a>
          <a href="./fakeNefturians"><button style={{marginTop: "12px"}}>Fake Nefturians</button></a>
          <a href="./fakeMeebits"><button style={{marginTop: "12px"}}>Fake Meebits</button></a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  )
}
