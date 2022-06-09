import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { FaRegClipboard } from 'react-icons/fa';
import { MAX_SLUG_LENGTH } from '../db/constants';
import styles from '../styles/Home.module.css';
import { isLinkValid, isSlugValid } from '../utils/validators';

const Home: NextPage = () => {
  const [canSubmit, setCanSubmit] = useState(false);
  const [link, setLink] = useState<string>('');
  const [slug, setSlug] = useState<string>('');
  const [shortLink, setShortLink] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log('submit');
  }

  useEffect(() => {
    setCanSubmit(isLinkValid(link) && isSlugValid(slug));
  }, [link, slug]);

  const handleCopyToClipboard = () => {
    alert(`${link} copied!`);
    navigator.clipboard.writeText(shortLink);
  }

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value.trim());
  }

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSlug(e.target.value.trim());
  }

  return (
    <div className={styles.wrapper}>
      <Head>
        <title>Stubby - link shortener</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Ubuntu+Mono:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" />
        {/* // TODO: Refactor line above into document link instead of page document. */}
      </Head>
      <div className={styles['main-element']}>
        <div className={styles['header']} >
          <h1>Stubby</h1>
          <legend>Link Shortener</legend>
        </div>
        <form onSubmit={handleSubmit} className={styles['form']}>
          <div className={styles['fieldsets']}>
            <fieldset className={styles['fieldset']}>
              <label className={styles['label']} htmlFor="f122e2">
                Your Link
              </label>
              <input
                id="f122e2"
                type="text"
                value={link}
                className={styles['field']}
                onChange={handleLinkChange}
                placeholder="Enter your link"
              />
            </fieldset>
            <fieldset className={styles['fieldset']}>
              <label className={styles['label']} htmlFor="d122e2">
                Slug
              </label>
              <input
                id='d122e2'
                type="text"
                value={slug}
                className={styles['field']}
                onChange={handleSlugChange}
                placeholder="The name of your link"
              />
            </fieldset>
          </div>
          <button
            className={styles['submit-btn']}
            disabled={!canSubmit}
          >
            Generate Short Link
          </button>
        </form>
        {
          shortLink &&
          <div className={styles['shortened-link']}>
            <input className={styles['shortened-link--text']} value={shortLink} readOnly />
            <button className={styles['clipboard-btn']} onClick={() => handleCopyToClipboard()}>
              <FaRegClipboard size={30} className={styles['clipboard-btn-icon']} />
            </button>
          </div>
        }
      </div>
    </div>
  );
}

export default Home;
