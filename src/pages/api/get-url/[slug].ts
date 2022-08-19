import { NextApiRequest, NextApiResponse } from "next";
import { prismaClient } from "../../../db/prismaClient";

// eslint-disable-next-line import/no-anonymous-default-export
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const slug = req.query['slug'];

    if (!slug) {
        res.statusCode = 404;
        res.send(JSON.stringify({ message: 'No slug provided' }));
        return;
    }

    if (typeof slug !== 'string') {
        res.statusCode = 400;
        res.send(JSON.stringify({ message: 'Invalid slug, must be valid string' }));
        return;
    }

    const data = await prismaClient.shortLink.findFirst({
        where: {
            slug: {
                equals: slug as string
            }
        }
    });

    if (!data) {
        res.statusCode = 404;
        res.send(JSON.stringify({ message: 'No such slug exists' }));
        return;
    }

    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Cache-Control",
        "s-maxage=1000000000, stale-while-revalidate"
    );

    return res.json(data);
};