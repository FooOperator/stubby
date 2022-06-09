import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import { useState } from 'react';
import { FaRegClipboard } from 'react-icons/fa';
import styles from '../styles/Home.module.css';

const Home: NextPage = () => {

  const [link, setLink] = useState<string>('');
  const [shortLink, setSlug] = useState<string>('example-slug');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('submit')
  }

  const handleChangeOnLink = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  }

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Home</title>
      </Head>
      <div className={styles['main-element']}>
        <form onSubmit={handleSubmit} className={styles['form']}>
          <div className={styles['input-button-row']}>
            <input
              type="text"
              value={link}
              className={styles['input-link']}
              onChange={handleChangeOnLink}
              placeholder="Enter your link"
            />
            <button className={styles['submit-btn']}>Generate Short Link</button>
          </div>
        </form>
        {
          shortLink &&
          <div className={styles['shortened-link']}>
            <input className={styles['shortened-link--text']} value={shortLink} readOnly />
            <div className={styles['clipboard-btn']}>
              <FaRegClipboard size={30} className={styles['clipboard-btn-icon']} />
            </div>
          </div>
        }
      </div>
    </div>
  )
}

export default Home;
