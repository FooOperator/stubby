import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { nanoid } from 'nanoid';

export async function middleware(req: NextRequest, event: NextFetchEvent) {
    const { pathname, origin } = req.nextUrl;
    console.log('pathname is: ', pathname);
    if (
        pathname.startsWith("/api/") ||
        pathname === "/"
    ) {
        return;
    }

    const slug = pathname.split('/').pop();

    const dataFetch = await fetch(`${origin}/api/get-url/${slug}`);

    if (dataFetch.status === 404) {
        return NextResponse.redirect(origin);
    }

    const data = await dataFetch.json();

    if (data?.url) {
        return NextResponse.redirect(data.url);
    }

    // return;
}