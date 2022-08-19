import type { NextPage } from "next";
import Head from "next/head";
import React, { useEffect, useState } from "react";
import { AiFillGithub, AiFillLinkedin } from "react-icons/ai";
import { verifyUrl, verifySlug } from "../utils/validators";
import { trpc } from "../utils/trpc";
import debounce from "lodash/debounce";
import "@fontsource/ubuntu-mono";

const Home: NextPage = () => {
	const [canSubmit, setCanSubmit] = useState(true);
	const [shortLink, setShortLink] = useState("");
	const [inputData, setInputData] = useState<{
		link: string;
		slug: string;
	}>({
		link: "",
		slug: "",
	});
	const [conditions, setConditions] = useState<{
		link: string[];
		slug: string[];
	}>({
		link: [],
		slug: [],
	});
	const slugHasQuery = trpc.useQuery(
		["checkSlug", { slug: inputData.slug }],
		{
			refetchOnReconnect: false,
			refetchOnMount: false,
			refetchOnWindowFocus: false,
		}
	);
	const createSlugMutation = trpc.useMutation("createSlug");
	const handleCopyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(
				`${origin}/${inputData.slug}`
			);
			alert(`${shortLink} copied!`);
		} catch (error) {
			console.error(error);
			alert("Failed to copy to clipboard");
		}
	};

	useEffect(() => {
		let linkIsValid = true;
		let slugIsValid = true;

		setConditions({
			slug: [
				...verifySlug(inputData.slug),
				...(slugHasQuery.data?.used
					? ["Slug is already used"]
					: []),
			],
			link: verifyUrl(inputData.link),
		});

		if (conditions.link.length > 0) linkIsValid = false;
		if (conditions.slug.length > 0) slugIsValid = false;

		setCanSubmit(linkIsValid && slugIsValid);
	}, [
		inputData,
		canSubmit,
		conditions.slug.length,
		conditions.link.length,
		slugHasQuery.data,
	]);

	useEffect(() => {
		if (createSlugMutation.status === "success") {
			setShortLink(`${origin}/${inputData.slug}`);
			slugHasQuery.refetch();
			createSlugMutation.reset();
		}
	}, [createSlugMutation, shortLink, inputData.slug, slugHasQuery]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		createSlugMutation.mutate({
			...inputData,
		});
	};

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		console.log("name: ", name);
		console.log("value: ", value);
		setInputData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<>
			<Head>
				<title>Stubby - link shortener</title>
			</Head>
			<div className="font-ubuntu-mono text-md stack bg-orange-200 text-zinc-800 h-full">
				<div className="stack-center mt-5">
					<h1 className="text-8xl">Stubby</h1>
					<h2 className="text-3xl">Link Shortener</h2>
				</div>
				<Form
					canSubmit={canSubmit}
					inputData={inputData}
					conditions={conditions}
					refetch={slugHasQuery.refetch}
					slugHasData={slugHasQuery.data !== null}
					handleSubmit={handleSubmit}
					handleChange={handleChange}
				/>
				<div
					className={`my-auto sm:w-3/4 md:w-3/4 lg:w-2/4 self-center ${
						shortLink.length > 0 ? "visible" : "invisible"
					}`}>
					<ShortLink
						link={shortLink}
						handleCopyToClipboard={handleCopyToClipboard}
					/>
				</div>
				<footer className="mt-auto stack-center gap-1">
					<div className="stack-center text-md">
						<p>Created by Lucas Guerra Cardoso</p>
						<p>Heavily inspired by Theo from Ping Labs</p>
					</div>
					<div className="flex gap-2 p-2">
						<a href="https://github.com/FooOperator">
							<AiFillGithub
								size={40}
								className="text-zinc-600 hover:text-blue-700"
							/>
						</a>
						<a href="https://www.linkedin.com/in/lucas-guerra-cardoso-1b273a182/">
							<AiFillLinkedin
								size={40}
								className="text-zinc-600 hover:text-blue-700"
							/>
						</a>
					</div>
				</footer>
			</div>
		</>
	);
};

type ShortLinkProps = {
	link: string;
	handleCopyToClipboard: () => void;
};

const ShortLink = ({ link, handleCopyToClipboard }: ShortLinkProps) => {
	return (
		<div className="flex flex-col text-center justify-center">
			<p className=" text-lg">Click To Copy</p>
			<p
				className="text-sm p-4 overflow-x-auto cursor-pointer bg-zinc-300 hover:bg-blue-400"
				onClick={() => handleCopyToClipboard()}>
				{link}
			</p>
		</div>
	);
};

type FormGroupProps = {
	name: string;
	slug: string;
	placeholder: string;
	maxLength: number;
	handleDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const FormGroup = (props: FormGroupProps) => {
	const id = props.name + "-input";

	return (
		<fieldset className="flex flex-col sm:flex-row md:flex-row lg:flex-row items-center gap-3 w-full">
			<label className="text-lg" htmlFor={id}>
				{props.name.charAt(0).toUpperCase() + props.name.slice(1)}
			</label>
			<input
				id={id}
				name={props.name}
				value={props.slug}
				className="w-full indent-1 rounded-md py-1"
				onChange={(e) => {
					props.handleDataChange(e);
				}}
				minLength={1}
				maxLength={props.maxLength}
				placeholder={props.placeholder}
				required
			/>
		</fieldset>
	);
};

type SlugHasDataQuery = any;

type FormProps = {
	inputData: any;
	handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
	handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	conditions: {
		link: string[];
		slug: string[];
	};
	slugHasData: SlugHasDataQuery;

	refetch: () => void;
	canSubmit: boolean;
};

const Form = ({ conditions, ...props }: FormProps) => {
	const validLink = conditions.link.length === 0;
	const validSlug = conditions.slug.length === 0;
	return (
		<form
			onSubmit={props.handleSubmit}
			className="flex flex-col items-center gap-1 mt-auto w-10/12 sm:w-7/12 md:w-10/12 lg:w-3/12 self-center">
			<FormGroup
				name={"link"}
				slug={props.inputData.link}
				placeholder={"Enter your link"}
				handleDataChange={props.handleChange}
				maxLength={255}
			/>
			<p
				className={` ${
					validLink ? "text-purple-800" : "text-red-500"
				}`}>
				{!validLink ? conditions.link : "Link is valid"}
			</p>
			<FormGroup
				name={"slug"}
				slug={props.inputData.slug}
				placeholder={"The shorthand name for your link"}
				handleDataChange={(e) => {
					props.handleChange(e);
					debounce(props.refetch, 100);
				}}
				maxLength={191}
			/>

			<p
				className={` ${
					validSlug ? "text-purple-800" : "text-red-500"
				}`}>
				{!validSlug ? conditions.slug : "Slug is available"}
			</p>
			<button
				className="text-2xl sm:text-xl md:text-xl lg:text-xl active:cursor-pointer border-purple-800 text-purple-800 disabled:border-red-500 disabled:text-red-500 rounded-lg p-2 border-2 "
				disabled={!props.canSubmit}>
				Generate Short Link
			</button>
		</form>
	);
};

export default Home;
