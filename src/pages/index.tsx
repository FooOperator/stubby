import type { NextPage } from 'next';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { FaRegClipboard } from 'react-icons/fa';
import styles from '../styles/Home.module.css';
import { isUrlValid as verifyUrl, isSlugValid as verifySlug } from '../utils/validators';
import { trpc } from '../utils/trpc';
import debounce from 'lodash/debounce';
import absoluteUrl from 'next-absolute-url';

const { origin } = absoluteUrl();

const Home: NextPage = () => {
  const [canSubmit, setCanSubmit] = useState(true);
  const [shortLink, setShortLink] = useState('');
  const [inputData, setInputData] = useState<{ url: string; slug: string }>({
    url: '',
    slug: '',
  });
  const [conditions, setConditions] = useState<{ url: string[], slug: string[] }>({
    url: [],
    slug: [],
  });
  const slugHasQuery = trpc.useQuery(['checkSlug', { slug: inputData.slug }], {
    refetchOnReconnect: false,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
  const createSlugMutation = trpc.useMutation('createSlug');

  useEffect(() => {
    let linkIsValid = true;
    let slugIsValid = true;

    setConditions({
      slug: [
        ...verifySlug(inputData.slug),
        ...slugHasQuery.data?.used ? ['Slug is already used'] : [],
      ],
      url: verifyUrl(inputData.url),
    });

    if (conditions.url.length > 0) linkIsValid = false;
    if (conditions.slug.length > 0) slugIsValid = false;

    setCanSubmit(linkIsValid && slugIsValid);
  }, [inputData, canSubmit, conditions.slug.length, conditions.url.length, slugHasQuery.data]);

  useEffect(() => {
    if (createSlugMutation.status === 'success') {
      setShortLink(`${origin}/${inputData.slug}`);
    }
  }, [createSlugMutation, shortLink, inputData.slug])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createSlugMutation.mutate({
      ...inputData
    });
    console.log('submit');
  }

  const handleCopyToClipboard = () => {
    alert(`${inputData.url} copied!`);
    navigator.clipboard.writeText(shortLink);
  }

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    console.log('name: ', name);
    console.log('value: ', value);
    setInputData(prev => ({
      ...prev,
      [name]: value,
    }));
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
                name={'url'}
                value={inputData.url}
                className={styles['field']}
                onChange={handleDataChange}
                placeholder="Enter your link"
                required
              />
              <ul
                className={
                  `${styles['input-message']} 
                  ${(
                    conditions.url.length < 1 ?
                      styles['hide'] :
                      styles["input-is-invalid"]
                  )}`}
              >
                {
                  conditions.url.map((message, index) =>
                    <li key={index}>{message}</li>
                  )
                }
              </ul>
            </fieldset>
            <fieldset className={styles['fieldset']}>
              <label
                className={`${styles['label']}`}
                htmlFor="d122e2">
                Slug
              </label>
              <input
                id='d122e2'
                type="text"
                name={'slug'}
                value={inputData.slug}
                className={styles['field']}
                onChange={(e) => {
                  handleDataChange(e);
                  debounce(slugHasQuery.refetch, 100);
                }}
                minLength={1}
                pattern={"^[-a-zA-Z0-9]+$"}
                placeholder="The shorthand name for your link"
                required
              />
              <ul
                className={
                  `${styles['input-message']} 
                  ${(
                    conditions.slug.length < 1 ?
                      styles['hide'] :
                      styles["input-is-invalid"]
                  )}`}
              >
                {
                  conditions.slug.map((message, index) =>
                    <li key={index}>{message}</li>
                  )
                }
              </ul>
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
